# 任务提交频率限制实施计划

## 📋 需求说明

系统需要限制用户在一周内的任务提交次数，防止过度提交：

### 限制规则
- **传播类（promotion.*）**：一周内不超过 **3次** 提交
- **短篇原创（short.*）**：一周内不超过 **3次** 提交
- **社区类TG（community.telegram）**：一周内不超过 **1次** 提交

**注意：长篇原创（long.*）不受一周内提交次数限制**

### 时间窗口计算
- 采用滚动窗口：从当前时间往前推算7天（168小时）
- 例如：第一次提交在周一，第四次提交如果还在这7天内就会被限制

### 实施原则
1. ✅ 不修改现有业务逻辑，避免引起不必要的问题
2. ✅ 尽量不修改原有数据库表，通过新增表实现
3. ✅ 实现要清晰易维护，逻辑职责分明

---

## 🏗️ 技术方案

### 1. 数据库设计 - 新增提交频率记录表

创建新表 `task_submission_frequency` 记录每个任务的提交时间：

```sql
-- 任务提交频率记录表
CREATE TABLE task_submission_frequency (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    task_id BIGINT NOT NULL COMMENT '任务ID',
    task_type VARCHAR(100) NOT NULL COMMENT '任务类型(promotion.*/short.*/long.*/community.*)',
    task_submission_id BIGINT NOT NULL COMMENT '所属任务提交ID',
    submit_time DATETIME NOT NULL COMMENT '提交时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    is_delete TINYINT DEFAULT 0 COMMENT '是否删除',
    
    -- 索引优化查询性能
    INDEX idx_user_submit (user_id, submit_time),
    INDEX idx_task_type (task_type),
    INDEX idx_task_submission (task_submission_id),
    INDEX idx_task (task_id)
) COMMENT '任务提交频率记录表' COLLATE = utf8mb4_unicode_ci;
```

**设计说明：**
- 每个Task创建一条记录
- 通过 `user_id + submit_time` 快速查询用户7天内的提交
- 通过 `task_submission_id` 可以批量删除某次提交的所有记录
- `task_type` 字段存储任务类型，便于分类统计

---

### 2. 后端实体类和Mapper

#### 2.1 创建实体类

**文件路径：** `src/main/java/com/yupi/springbootinit/model/entity/TaskSubmissionFrequency.java`

```java
package com.yupi.springbootinit.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.util.Date;

/**
 * 任务提交频率记录表
 * @TableName task_submission_frequency
 */
@TableName(value = "task_submission_frequency")
@Data
public class TaskSubmissionFrequency implements Serializable {
    
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    private Long userId;
    
    private Long taskId;
    
    private String taskType;
    
    private Long taskSubmissionId;
    
    private Date submitTime;
    
    private Date createTime;
    
    @TableLogic
    private Integer isDelete;
    
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
```

#### 2.2 创建Mapper接口

**文件路径：** `src/main/java/com/yupi/springbootinit/mapper/TaskSubmissionFrequencyMapper.java`

```java
package com.yupi.springbootinit.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yupi.springbootinit.model.entity.TaskSubmissionFrequency;

/**
 * 任务提交频率记录Mapper
 */
public interface TaskSubmissionFrequencyMapper extends BaseMapper<TaskSubmissionFrequency> {
}
```

---

### 3. 后端Service层

#### 3.1 创建Service接口

**文件路径：** `src/main/java/com/yupi/springbootinit/service/TaskSubmissionFrequencyService.java`

```java
package com.yupi.springbootinit.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.yupi.springbootinit.model.dto.task.TaskDTO;
import com.yupi.springbootinit.model.entity.Task;
import com.yupi.springbootinit.model.entity.TaskSubmissionFrequency;
import java.util.List;
import java.util.Map;

/**
 * 任务提交频率服务
 */
public interface TaskSubmissionFrequencyService extends IService<TaskSubmissionFrequency> {
    
    /**
     * 检查用户提交频率是否超限
     * 
     * @param userId 用户ID
     * @param tasks 本次要提交的任务列表
     * @return 检查结果 {success: Boolean, message: String}
     */
    Map<String, Object> checkSubmissionFrequency(Long userId, List<TaskDTO> tasks);
    
    /**
     * 记录任务提交
     * 
     * @param userId 用户ID
     * @param taskSubmissionId 任务提交ID
     * @param tasks 任务列表
     */
    void recordTaskSubmission(Long userId, Long taskSubmissionId, List<Task> tasks);
    
    /**
     * 删除任务提交的所有频率记录
     * 
     * @param taskSubmissionId 任务提交ID
     */
    void removeRecordsByTaskSubmissionId(Long taskSubmissionId);
}
```

#### 3.2 实现Service

**文件路径：** `src/main/java/com/yupi/springbootinit/service/impl/TaskSubmissionFrequencyServiceImpl.java`

```java
package com.yupi.springbootinit.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yupi.springbootinit.mapper.TaskSubmissionFrequencyMapper;
import com.yupi.springbootinit.model.dto.task.TaskDTO;
import com.yupi.springbootinit.model.entity.Task;
import com.yupi.springbootinit.model.entity.TaskSubmissionFrequency;
import com.yupi.springbootinit.service.TaskSubmissionFrequencyService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Slf4j
public class TaskSubmissionFrequencyServiceImpl 
        extends ServiceImpl<TaskSubmissionFrequencyMapper, TaskSubmissionFrequency>
        implements TaskSubmissionFrequencyService {

    @Override
    public Map<String, Object> checkSubmissionFrequency(Long userId, List<TaskDTO> tasks) {
        Map<String, Object> result = new HashMap<>();
        
        if (tasks == null || tasks.isEmpty()) {
            result.put("success", true);
            return result;
        }
        
        // 获取7天前的时间
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, -7);
        Date sevenDaysAgo = calendar.getTime();
        
        // 查询用户过去7天内的提交记录
        QueryWrapper<TaskSubmissionFrequency> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId)
                   .ge("submit_time", sevenDaysAgo)
                   .eq("is_delete", 0);
        List<TaskSubmissionFrequency> existingRecords = this.list(queryWrapper);
        
        // 统计已提交的各类型任务数量
        int promotionCount = 0;
        int shortCount = 0; // 只统计short，long不受限制
        int communityTgCount = 0;
        
        for (TaskSubmissionFrequency record : existingRecords) {
            String taskType = record.getTaskType();
            if (taskType.startsWith("promotion.")) {
                promotionCount++;
            } else if (taskType.startsWith("short.")) {
                shortCount++;
            } else if ("community.telegram".equals(taskType)) {
                communityTgCount++;
            }
        }
        
        log.info("用户{}过去7天提交统计: promotion={}, short={}, community.telegram={}", 
                userId, promotionCount, shortCount, communityTgCount);
        
        // 统计本次要提交的任务
        int newPromotionCount = 0;
        int newShortCount = 0;
        int newCommunityTgCount = 0;
        
        for (TaskDTO task : tasks) {
            String taskType = task.getTaskType();
            if (taskType.startsWith("promotion.")) {
                newPromotionCount++;
            } else if (taskType.startsWith("short.")) {
                newShortCount++;
            } else if ("community.telegram".equals(taskType)) {
                newCommunityTgCount++;
            }
        }
        
        log.info("本次提交统计: promotion={}, short={}, community.telegram={}", 
                newPromotionCount, newShortCount, newCommunityTgCount);
        
        // 检查是否超限
        if (promotionCount + newPromotionCount > 3) {
            result.put("success", false);
            result.put("message", "传播类任务一周内不能超过3次提交（当前已提交" + promotionCount 
                    + "次，本次提交" + newPromotionCount + "次）");
            log.warn("用户{}传播类任务提交超限", userId);
            return result;
        }
        
        if (shortCount + newShortCount > 3) {
            result.put("success", false);
            result.put("message", "短篇原创任务一周内不能超过3次提交（当前已提交" + shortCount 
                    + "次，本次提交" + newShortCount + "次）");
            log.warn("用户{}短篇原创任务提交超限", userId);
            return result;
        }
        
        if (communityTgCount + newCommunityTgCount > 1) {
            result.put("success", false);
            result.put("message", "社区类TG任务一周内不能超过1次提交（当前已提交" + communityTgCount 
                    + "次，本次提交" + newCommunityTgCount + "次）");
            log.warn("用户{}社区TG任务提交超限", userId);
            return result;
        }
        
        result.put("success", true);
        log.info("用户{}提交频率检查通过", userId);
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void recordTaskSubmission(Long userId, Long taskSubmissionId, List<Task> tasks) {
        if (tasks == null || tasks.isEmpty()) {
            return;
        }
        
        Date now = new Date();
        List<TaskSubmissionFrequency> records = new ArrayList<>();
        
        for (Task task : tasks) {
            TaskSubmissionFrequency record = new TaskSubmissionFrequency();
            record.setUserId(userId);
            record.setTaskId(task.getId());
            record.setTaskType(task.getTaskType());
            record.setTaskSubmissionId(taskSubmissionId);
            record.setSubmitTime(now);
            record.setCreateTime(now);
            records.add(record);
        }
        
        boolean saved = this.saveBatch(records);
        log.info("记录任务提交频率: userId={}, taskSubmissionId={}, 记录数={}, 结果={}", 
                userId, taskSubmissionId, records.size(), saved);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeRecordsByTaskSubmissionId(Long taskSubmissionId) {
        QueryWrapper<TaskSubmissionFrequency> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("task_submission_id", taskSubmissionId);
        boolean removed = this.remove(queryWrapper);
        log.info("删除任务提交频率记录: taskSubmissionId={}, 结果={}", taskSubmissionId, removed);
    }
}
```

---

### 4. 后端Controller层改造

#### 4.1 修改 TaskSubmissionServiceImpl

**文件路径：** `src/main/java/com/yupi/springbootinit/service/impl/TaskSubmissionServiceImpl.java`

在 `addTaskSubmission` 方法中添加频率检查：

```java
@Resource
private TaskSubmissionFrequencyService frequencyService;

@Override
@Transactional(rollbackFor = Exception.class)
public Long addTaskSubmission(TaskSubmissionAddRequest taskSubmissionAddRequest, HttpServletRequest request) {
    if (taskSubmissionAddRequest == null) {
        throw new BusinessException(ErrorCode.PARAMS_ERROR);
    }
    
    // 获取当前登录用户
    User loginUser = userService.getLoginUser(request);
    Long userId = loginUser.getId();
    
    // ========== 新增：检查提交频率 ==========
    List<TaskDTO> tasks = taskSubmissionAddRequest.getTasks();
    if (CollectionUtils.isNotEmpty(tasks)) {
        Map<String, Object> checkResult = frequencyService.checkSubmissionFrequency(userId, tasks);
        if (!(Boolean) checkResult.get("success")) {
            String message = (String) checkResult.get("message");
            log.warn("用户{}提交频率超限: {}", userId, message);
            throw new BusinessException(ErrorCode.OPERATION_ERROR, message);
        }
    }
    // ========================================
    
    TaskSubmission taskSubmission = new TaskSubmission();
    BeanUtils.copyProperties(taskSubmissionAddRequest, taskSubmission);
    
    // 校验
    validTaskSubmission(taskSubmission, true);
    
    taskSubmission.setUserId(userId);
    taskSubmission.setReviewStatus(0);
    
    // 保存成果提交表
    boolean result = this.save(taskSubmission);
    ThrowUtils.throwIf(!result, ErrorCode.OPERATION_ERROR);
    
    Long newTaskSubmissionId = taskSubmission.getId();
    
    // 保存任务列表
    if (CollectionUtils.isNotEmpty(tasks)) {
        List<Task> taskList = new ArrayList<>();
        for (TaskDTO taskDTO : tasks) {
            Task task = new Task();
            BeanUtils.copyProperties(taskDTO, task);
            task.setTaskSubmissionId(newTaskSubmissionId);
            task.setUserId(userId);
            task.setReviewStatus(0);
            taskList.add(task);
        }
        for (Task task : taskList) {
            taskMapper.insert(task);
        }
        
        // ========== 新增：记录提交频率 ==========
        frequencyService.recordTaskSubmission(userId, newTaskSubmissionId, taskList);
        // ========================================
    }
    
    return newTaskSubmissionId;
}
```

#### 4.2 修改删除方法

在 `deleteTaskSubmission` 方法中添加清理记录：

```java
@Override
@Transactional(rollbackFor = Exception.class)
public Boolean deleteTaskSubmission(DeleteRequest deleteRequest, HttpServletRequest request) {
    if (deleteRequest == null || deleteRequest.getId() <= 0) {
        throw new BusinessException(ErrorCode.PARAMS_ERROR);
    }
    User user = userService.getLoginUser(request);
    long id = deleteRequest.getId();
    
    // 判断是否存在
    TaskSubmission oldTaskSubmission = this.getById(id);
    ThrowUtils.throwIf(oldTaskSubmission == null, ErrorCode.NOT_FOUND_ERROR);
    
    // 仅本人或管理员可删除
    if (!oldTaskSubmission.getUserId().equals(user.getId()) && !userService.isAdmin(request)) {
        throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
    }
    
    // ========== 新增：删除频率记录 ==========
    frequencyService.removeRecordsByTaskSubmissionId(id);
    // ========================================
    
    boolean b = this.removeById(id);
    return b;
}
```

---

### 5. 前端错误提示改造

#### 5.1 修改提交表单页面

**文件路径：** `src/app/profile/page.tsx` 或提交表单所在页面

在提交请求的错误处理中添加友好提示：

```typescript
try {
  const result = await taskSubmissionService.addTaskSubmission(formData);
  // ... 成功处理
} catch (error: any) {
  // 检查是否是频率限制错误
  const errorMessage = error?.message || error?.toString() || '';
  
  if (errorMessage.includes('传播类任务一周内不能超过3次')) {
    toast.error('提交失败：传播类任务一周内最多提交3次');
  } else if (errorMessage.includes('原创类任务')) {
    toast.error('提交失败：原创类任务（短篇+长篇）一周内最多提交3次');
  } else if (errorMessage.includes('社区类TG任务')) {
    toast.error('提交失败：社区类TG任务一周内最多提交1次');
  } else {
    toast.error('提交失败：' + errorMessage);
  }
}
```

#### 5.2 可选：在提交前显示提示信息

在提交表单页面添加提示文字：

```tsx
<div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
  <h3 className="font-semibold mb-2">⏰ 提交频率限制</h3>
  <ul className="text-sm space-y-1">
    <li>• 传播类任务：一周内最多提交 3 次</li>
    <li>• 原创类任务（短篇+长篇）：一周内最多提交 3 次</li>
    <li>• 社区类TG任务：一周内最多提交 1 次</li>
  </ul>
</div>
```

---

## 📊 实施步骤

### Step 1: 数据库
1. 在生产环境和开发环境执行SQL创建表
2. 验证表结构和索引创建成功

### Step 2: 后端代码
1. 创建实体类 `TaskSubmissionFrequency`
2. 创建Mapper接口 `TaskSubmissionFrequencyMapper`
3. 创建Service接口和实现类
4. 修改 `TaskSubmissionServiceImpl` 添加频率检查和记录
5. 编译测试，确保没有语法错误

### Step 3: 测试
1. 本地环境测试提交流程
2. 测试频率限制是否生效
3. 测试删除任务是否清理记录
4. 测试7天时间窗口计算是否正确

### Step 4: 前端
1. 修改提交表单的错误处理
2. 添加友好的提示信息
3. 测试用户体验

### Step 5: 部署
1. 备份数据库
2. 执行数据库脚本
3. 部署后端代码
4. 部署前端代码
5. 验证生产环境功能

---

## ✅ 验收标准

1. ✅ 传播类任务一周内最多3次，超过后提示错误
2. ✅ 短篇原创任务一周内最多3次，超过后提示错误
3. ✅ 长篇原创任务不受一周内提交次数限制
3. ✅ 社区TG任务一周内最多1次
4. ✅ 时间窗口为滚动7天（168小时）
5. ✅ 删除任务时清理频率记录
6. ✅ 不影响现有审核、积分等功能
7. ✅ 前端提示信息友好清晰

---

## 🔍 注意事项

1. **事务一致性**：频率检查和记录必须在同一事务中
2. **时区问题**：确保时间计算使用正确的时区
3. **性能优化**：索引已创建，查询性能应该良好
4. **数据清理**：考虑定期清理超过30天的旧记录
5. **边界情况**：测试在7天边界的提交情况
6. **并发控制**：考虑使用数据库锁防止并发提交绕过限制

---

## 📅 实施时间表

预计实施时间：**2-3个工作日**

- Day 1: 数据库设计和后端代码实现
- Day 2: 测试和前端改造
- Day 3: 部署和验证

---

**文档创建时间：** 2025-10-01  
**创建人：** Cascade  
**状态：** 待实施

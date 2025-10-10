# 后端统一查询API实现文档

## 修改日期
2025-10-10

## 实现目标

开发一个统一的后端查询API，用于支持管理员页面的多表查询、排序和分页，特别是解决日期排序不一致的问题。

## 技术实现

### 1. 统一查询模型

#### DTO和VO类

创建了统一的数据传输对象：

```java
// 统一查询请求DTO
public class UnifiedSubmissionQueryRequest extends PageRequest {
    private String sortField;
    private String sortOrder;
    private List<String> types; // 表单类型筛选：application, task, activity
    private List<Integer> status; // 状态筛选：0待审核，1已通过，2已拒绝
    private String user; // 用户名或邮箱筛选
    private Date startDate; // 提交日期范围-开始
    private Date endDate; // 提交日期范围-结束
}

// 统一查询响应VO
public class UnifiedSubmissionVO {
    private Long id; // 记录ID
    private String type; // 表单类型：application/task/activity
    private String title; // 表单标题
    private String userName; // 用户名
    private String userEmail; // 用户邮箱
    private Integer status; // 状态：0待审核，1已通过，2已拒绝
    private Date createTime; // 提交时间
    private Long sourceId; // 原始表ID
    private String sourceTable; // 原始表名称
}
```

### 2. 连表查询设计

使用MyBatis的UNION ALL实现多表连接查询：

```xml
<!-- 统一查询 -->
<select id="getUnifiedSubmissions" resultType="com.yupi.springbootinit.model.vo.UnifiedSubmissionVO">
    (
        SELECT 
            id,
            'application' as type,
            '入职申请' as title,
            name as userName,
            email as userEmail,
            status,
            createTime,
            id as sourceId,
            'applicationForm' as sourceTable
        FROM applicationForm
        WHERE 1=1
        <include refid="baseQuery" />
        <!-- 类型筛选 -->
    )
    UNION ALL
    (
        SELECT 
            id,
            'task' as type,
            '成果提交' as title,
            name as userName,
            email as userEmail,
            reviewStatus as status,
            createTime,
            id as sourceId,
            'taskSubmission' as sourceTable
        FROM taskSubmission
        WHERE 1=1
        <include refid="baseQuery" />
        <!-- 类型筛选 -->
    )
    UNION ALL
    (
        <!-- 活动申请查询 -->
    )
    
    <!-- 统一排序 -->
    ORDER BY createTime ASC
    
    LIMIT #{offset}, #{req.pageSize}
</select>
```

### 3. 服务层实现

创建服务接口和实现类：

```java
@Service
public class UnifiedSubmissionServiceImpl implements UnifiedSubmissionService {
    
    @Resource
    private UnifiedSubmissionMapper unifiedSubmissionMapper;
    
    @Resource
    private ApplicationFormMapper applicationFormMapper;
    
    @Resource
    private TaskSubmissionMapper taskSubmissionMapper;
    
    @Resource
    private ActivityApplicationMapper activityApplicationMapper;

    @Override
    public Page<UnifiedSubmissionVO> getUnifiedSubmissions(UnifiedSubmissionQueryRequest request) {
        // 参数校验、分页计算...
        
        // 查询数据
        List<UnifiedSubmissionVO> records = unifiedSubmissionMapper.getUnifiedSubmissions(request, offset);
        
        return new Page<>(request.getCurrent(), request.getPageSize(), total);
    }
    
    @Override
    public Object getSubmissionDetail(String type, Long sourceId) {
        // 根据类型获取不同表的原始数据...
    }
}
```

### 4. 控制器接口

```java
@RestController
@RequestMapping("/api/admin")
public class AdminUnifiedController {
    
    @Resource
    private UnifiedSubmissionService unifiedSubmissionService;
    
    @GetMapping("/unified-submissions")
    @AuthCheck(mustRole = UserConstant.ADMIN_ROLE)
    public BaseResponse<Page<UnifiedSubmissionVO>> getUnifiedSubmissions(UnifiedSubmissionQueryRequest request) {
        Page<UnifiedSubmissionVO> page = unifiedSubmissionService.getUnifiedSubmissions(request);
        return ResultUtils.success(page);
    }
    
    @GetMapping("/submission-detail")
    public BaseResponse<Object> getSubmissionDetail(String type, Long sourceId) {
        // 获取详情...
    }
}
```

## 前端实现

### 1. API服务封装

```typescript
// 统一API服务
export const adminUnifiedService = {
  // 获取统一的提交列表
  async getUnifiedSubmissions(params: UnifiedSubmissionQueryRequest): Promise<PageData<UnifiedSubmissionVO>> {
    return request.get('/api/admin/unified-submissions', {
      params,
    });
  },
  
  // 获取表单详情
  async getSubmissionDetail(type: string, sourceId: number): Promise<any> {
    return request.get(`/api/admin/submission-detail`, {
      params: { type, sourceId }
    });
  }
};
```

### 2. 修改Admin页面

使用统一API替换原有的多个API调用：

```typescript
// 获取待审核表单（使用统一API）
const fetchPendingSubmissions = async (
  page: number = pendingCurrentPage,
  sortField: string = sortConfig?.key || 'createTime',
  sortOrder: 'asc' | 'desc' = sortConfig?.direction || 'asc'
) => {
  // 调用统一API
  const response = await adminUnifiedService.getUnifiedSubmissions({
    current: page,
    pageSize: pendingPageSize,
    sortField,
    sortOrder,
    status: [0], // 待审核状态
    user: filters.user || undefined,
    types: filters.formType ? [...] : undefined,
  });
  
  // 设置数据
  setPendingSubmissions(response.records);
};
```

## 解决的数据库表名问题

发现数据库表使用驼峰命名法而非下划线命名法，修改了SQL查询：

| 原SQL表名 | 修改后表名 |
|---------|---------|
| application_form | applicationForm |
| task_submission | taskSubmission |
| activity_application | activityApplication |

列名也同样做了修改：

| 原SQL列名 | 修改后列名 |
|---------|---------|
| create_time | createTime |
| review_status | reviewStatus |

## 效果评估

1. **排序问题**：解决了跨页面排序不一致的问题
2. **性能优化**：减少了API调用次数，提高了响应速度
3. **代码结构**：更符合后端处理数据转换的架构设计

## 后续优化建议

1. 添加数据库索引：在createTime字段上添加索引提升排序性能
2. 增加缓存机制：缓存常用查询结果减少数据库压力
3. 扩展筛选条件：添加更多筛选选项满足不同管理需求

## 测试要点

1. 日期升序排序测试：确认早期记录（8/30）排在前面
2. 分页一致性测试：切换页面时保持排序一致
3. 筛选功能测试：测试用户名、表单类型、日期范围筛选
4. 性能测试：加载时间和响应速度

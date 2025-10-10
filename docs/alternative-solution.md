# 分页问题的替代解决方案

## 当前状况

- ✅ 前端分页状态更新正常
- ✅ API调用正常  
- ❌ 后端SQL分页有问题，数据重复
- ❌ 后端服务启动困难

## 替代方案1：使用ID作为二级排序

问题可能在于createTime相同的记录排序不稳定。解决方案：

```sql
ORDER BY createTime ASC, id ASC
```

这样即使时间相同，也会有稳定的排序。

## 替代方案2：临时回退到前端分页

既然后端SQL有问题，可以临时回退到前端分页，但改进实现：

1. **分批加载**：每次加载100条而不是全部
2. **缓存机制**：缓存已加载的页面
3. **虚拟滚动**：只渲染可见的行

## 替代方案3：使用ROW_NUMBER()

如果MySQL版本支持，使用窗口函数：

```sql
SELECT * FROM (
    SELECT 
        id, type, title, userName, userEmail, status, createTime,
        ROW_NUMBER() OVER (ORDER BY createTime ASC, id ASC) as rn
    FROM (
        SELECT ... FROM table1 WHERE status = 0
        UNION ALL 
        SELECT ... FROM table2 WHERE reviewStatus = 0
        UNION ALL
        SELECT ... FROM table3 WHERE reviewStatus = 0
    ) t
) ranked
WHERE rn > #{offset} AND rn <= #{offset} + #{pageSize}
```

## 立即可行的解决方案

### 方案A：简化SQL，添加稳定排序

```xml
<select id="getUnifiedSubmissions" resultType="com.yupi.springbootinit.model.vo.UnifiedSubmissionVO">
    SELECT * FROM (
        SELECT id, 'application' as type, name as userName, email as userEmail, status, createTime, id as sourceId FROM applicationForm WHERE status = 0
        UNION ALL
        SELECT id, 'task' as type, name as userName, email as userEmail, reviewStatus as status, createTime, id as sourceId FROM taskSubmission WHERE reviewStatus = 0  
        UNION ALL
        SELECT id, 'activity' as type, organizer as userName, email as userEmail, reviewStatus as status, createTime, id as sourceId FROM activityApplication WHERE reviewStatus = 0
    ) t
    ORDER BY createTime ASC, id ASC
    LIMIT #{offset}, #{req.pageSize}
</select>
```

### 方案B：直接测试原始API

也许问题不在统一API，而在于原来的API。可以先测试：
1. 单独调用 applicationForm 的分页API
2. 单独调用 taskSubmission 的分页API  
3. 看看单个API的分页是否正常

## 建议

1. **立即执行**：等待后端启动，测试方案A
2. **如果方案A失败**：回退到原始的多API调用方式
3. **长期方案**：重新设计统一API的分页逻辑

这样至少能让分页功能先工作起来，然后再优化。

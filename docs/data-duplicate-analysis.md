# 数据重复问题分析

## 可能的根本原因

### 1. 数据本身重复
数据库中可能存在真正重复的记录，导致分页时看到相同的数据。

### 2. 排序不稳定
如果多条记录有相同的createTime，MySQL的排序可能不稳定，导致相同的记录在不同分页中重复出现。

### 3. LIMIT偏移量问题
MySQL的LIMIT OFFSET在大数据量时可能有性能和一致性问题。

### 4. UNION ALL去重问题
UNION ALL不会去重，如果三个表中有相同的ID，可能会导致重复。

## 测试方案

### 方案1：添加唯一标识符
在SQL中添加表名前缀到ID，确保唯一性：

```sql
SELECT 
    CONCAT(type, '_', id) as uniqueId,
    id,
    type,
    ...
FROM (...)
ORDER BY createTime ASC, uniqueId ASC
```

### 方案2：使用ROW_NUMBER()
使用窗口函数确保排序的唯一性：

```sql
SELECT * FROM (
    SELECT 
        *,
        ROW_NUMBER() OVER (ORDER BY createTime ASC, id ASC) as rowNum
    FROM (
        ... UNION ALL ...
    ) t
) ranked
WHERE rowNum > #{offset} AND rowNum <= #{offset} + #{req.pageSize}
```

### 方案3：检查数据质量
直接查询数据库，检查是否有重复记录：

```sql
-- 检查applicationForm表
SELECT id, name, email, createTime, COUNT(*) 
FROM applicationForm 
WHERE status = 0 
GROUP BY id, name, email, createTime 
HAVING COUNT(*) > 1;

-- 检查taskSubmission表
SELECT id, name, email, createTime, COUNT(*) 
FROM taskSubmission 
WHERE reviewStatus = 0 
GROUP BY id, name, email, createTime 
HAVING COUNT(*) > 1;
```

## 临时解决方案

如果是排序不稳定的问题，可以添加二级排序：

```sql
ORDER BY createTime ASC, id ASC, type ASC
```

这样确保即使时间相同，也有固定的排序规则。

## 验证步骤

1. **检查数据量**：确认每个表有多少条status=0的记录
2. **检查重复**：查看是否有真正的重复数据
3. **测试排序稳定性**：添加二级排序规则
4. **验证分页**：确保LIMIT OFFSET正常工作

## 下一步

1. 等待后端启动完成
2. 测试当前修复是否有效
3. 如果仍有问题，实施方案2（ROW_NUMBER方案）

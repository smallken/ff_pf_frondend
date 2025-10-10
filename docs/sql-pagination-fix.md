# SQL分页问题修复

## 问题发现

分页状态更新正常，但每页显示的数据都相同，说明后端SQL分页逻辑有问题。

## 根本原因

原始SQL结构：
```sql
(SELECT ... FROM table1 WHERE ...)
UNION ALL
(SELECT ... FROM table2 WHERE ...)
UNION ALL  
(SELECT ... FROM table3 WHERE ...)
ORDER BY createTime ASC
LIMIT #{offset}, #{req.pageSize}
```

**问题**：MySQL对UNION ALL查询直接应用LIMIT时，可能不会按预期工作，特别是在没有明确排序的情况下。

## 修复方案

将UNION ALL查询包装在子查询中，然后在外层进行排序和分页：

```sql
SELECT * FROM (
    (SELECT ... FROM table1 WHERE ...)
    UNION ALL
    (SELECT ... FROM table2 WHERE ...)
    UNION ALL  
    (SELECT ... FROM table3 WHERE ...)
) as unified_results
ORDER BY createTime ASC
LIMIT #{offset}, #{req.pageSize}
```

## 修复内容

1. **包装子查询**：将整个UNION ALL查询包装为子查询 `unified_results`
2. **外层排序**：在子查询外层进行ORDER BY
3. **外层分页**：在子查询外层进行LIMIT

## 修复文件

- `src/main/resources/mapper/UnifiedSubmissionMapper.xml`
- 已备份原文件为 `UnifiedSubmissionMapper.xml.backup`

## 测试验证

修复后应该验证：
1. 第1页和第2页显示不同的数据
2. 排序功能正常工作
3. 筛选功能正常工作
4. 总记录数正确

## 修复时间

2025-10-10 15:15

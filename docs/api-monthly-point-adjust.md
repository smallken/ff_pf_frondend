# 月度积分类别次数调整API文档

## 接口概述
用于管理员在已审核成果提交表中编辑"获得的类别次数"时，调整用户在monthlyPoint表中的类别次数统计。

## 接口详情

### POST /monthly-point/adjust-category-counts

**功能说明：**
管理员修改已审核的成果提交表中的"获得类别次数"时，需要调整monthlyPoint表中对应的类别次数。

**调整逻辑：**
- 原理：审核通过时系统已在monthlyPoint表中增加了对应类别次数
- 修改时：先减去原值，再加上新值
- 例如：传播类从2改为3，需要先减去2，再加上3（净增加1）

**请求参数：**
```json
{
  "userId": 123,           // 用户ID
  "pointYear": 2024,       // 年份
  "pointMonth": 10,        // 月份
  "promotionDelta": 1,     // 传播类调整量（可为负数）
  "shortDelta": -1,        // 短篇原创调整量（可为负数）
  "longDelta": 0,          // 长篇原创调整量（可为负数）
  "communityDelta": 2      // 社区类调整量（可为负数）
}
```

**响应数据：**
```json
{
  "code": 0,
  "message": "调整成功",
  "data": null
}
```

**错误响应：**
```json
{
  "code": 40400,
  "message": "用户月度积分记录不存在"
}
```

## 数据库操作

需要在monthlyPoint表中更新对应用户、年月的记录：

```sql
UPDATE monthlyPoint 
SET 
  promotion = promotion + promotionDelta,
  short = short + shortDelta,
  long = long + longDelta,
  community = community + communityDelta
WHERE userId = ? AND pointYear = ? AND pointMonth = ?
```

**注意事项：**
1. 确保类别次数不会变成负数
2. 如果该用户在该年月没有记录，需要先创建记录
3. 调整后需要重新计算总积分
4. 需要记录操作日志用于审计

## 前端调用示例

```typescript
await monthlyPointService.adjustCategoryCounts({
  userId: 123,
  pointYear: 2024,
  pointMonth: 10,
  promotionDelta: 1,
  shortDelta: -1,
  longDelta: 0,
  communityDelta: 2
});
```

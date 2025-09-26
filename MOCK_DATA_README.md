# 模拟用户数据说明

## 概述

本项目包含了100个模拟用户数据的完整数据集，用于测试和演示月度奖励系统功能。

## 文件结构

### 1. 模拟数据文件
- `src/services/mockUsersData.ts` - 包含100个模拟用户数据
- `src/services/mockMonthlyRewardService.ts` - 更新后的模拟服务，包含新数据接口

### 2. 示例组件
- `src/components/MockUsersDisplay.tsx` - 展示如何使用模拟数据的示例组件

## 数据特征

### 用户分布
- **总用户数**: 100个
- **等级分布**:
  - 基础级别 (basic): ~50%
  - 进阶一 (advanced1): ~30%
  - 进阶二 (advanced2): ~15%
  - 进阶三 (advanced3): ~5%

### 数据字段
每个用户包含以下信息：
- `userId`: 用户ID (1-100)
- `rewardYear`: 奖励年份 (2024)
- `rewardMonth`: 奖励月份 (1-12)
- `promotionScore`: 传播类分数
- `shortScore`: 短篇原创分数
- `longScore`: 长篇原创分数
- `communityScore`: 社区类分数
- `rewardLevel`: 奖励等级
- `rewardAmount`: 奖励金额 (USDT)
- `isCalculated`: 是否已计算 (0/1)
- `isPaid`: 是否已发放 (0/1)
- `createTime`: 创建时间
- `updateTime`: 更新时间

## 使用方法

### 1. 获取所有用户数据
```typescript
import { mockMonthlyRewardService } from '../services/mockMonthlyRewardService';

const users = await mockMonthlyRewardService.getAllUsersData();
```

### 2. 根据用户ID获取特定用户
```typescript
const user = await mockMonthlyRewardService.getUserDataById(1);
```

### 3. 在React组件中使用
```typescript
import React from 'react';
import { mockMonthlyRewardService } from '../services/mockMonthlyRewardService';

function MyComponent() {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    mockMonthlyRewardService.getAllUsersData()
      .then(data => setUsers(data));
  }, []);

  return (
    <div>
      {users.map(user => (
        <div key={user.userId}>
          用户{user.userId}: {user.rewardAmount} USDT
        </div>
      ))}
    </div>
  );
}
```

## 数据验证

所有模拟数据都符合以下规则：
1. 分数满足对应等级的最低要求
2. 奖励金额与等级匹配
3. 数据格式与后端API保持一致
4. 包含合理的随机波动，使数据更真实

## 扩展使用

可以基于这些模拟数据进行：
- 数据可视化展示
- 统计分析
- 搜索和筛选功能
- 导出功能测试

## 注意事项

- 这些是模拟数据，仅用于开发和测试
- 生产环境请使用真实的用户数据
- 如需修改数据分布或添加新字段，请更新 `mockUsersData.ts` 文件

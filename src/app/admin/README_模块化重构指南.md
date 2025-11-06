# 管理员后台模块化重构指南

## 当前模块结构

### 已分离的模块
1. **用户管理** - `user-management.tsx` ✅
   - 用户统计信息
   - 批量更新用户等级

2. **每周挑战数据** - `weekly-challenge-logs.tsx` ✅
   - 自动审核日志
   - 传播任务和社群任务审核记录

3. **原创任务审核** - `original-task-review.tsx` ✅
   - 待审核原创任务
   - 已审核原创任务
   - 周计划统计日志

4. **月度奖励** - `AdminMonthlyReward` 组件 ✅

5. **Launch参赛登记** - `launch-registrations/` 目录 ✅

6. **Launch DD问答** - `launch-dd-forms/` 目录 ✅

7. **Mint大赛表单** - `mint-forms/` 目录 ✅

### 待分离的模块
1. **报名申请审核** - 目前在 `page.tsx` 中（约400行代码）
   - 建议创建：`application-review.tsx`
   - 包含：成果提交表、申请表、活动申请的审核逻辑

## 模块化规范

### 1. 文件命名
- 使用kebab-case命名：`user-management.tsx`
- 复杂模块使用目录结构：`launch-registrations/page.tsx`

### 2. 组件结构
```tsx
'use client';

import { useState, useEffect } from 'react';
import { 相关Service } from '@/services/...';

export default function ModuleName() {
  // 1. 状态管理
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  
  // 2. 数据获取
  const fetchData = async () => {
    // ...
  };
  
  // 3. 事件处理
  const handleAction = async () => {
    // ...
  };
  
  // 4. 副作用
  useEffect(() => {
    fetchData();
  }, []);
  
  // 5. 渲染
  return (
    <div className="space-y-6">
      {/* 提示信息 */}
      {error && <ErrorMessage />}
      {success && <SuccessMessage />}
      
      {/* 主要内容 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        {/* ... */}
      </div>
    </div>
  );
}
```

### 3. 在 page.tsx 中集成

#### 3.1 导入组件
```tsx
import ModuleName from './module-name';
```

#### 3.2 添加标签按钮
```tsx
<button
  onClick={() => setActiveTab('module-name')}
  className={`py-4 px-6 border-b-2 font-medium text-sm ${
    activeTab === 'module-name'
      ? 'border-blue-500 text-blue-600'
      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
  }`}
>
  模块名称
</button>
```

#### 3.3 添加内容区域
```tsx
{activeTab === 'module-name' && (
  <ModuleName />
)}
```

## 待重构任务列表

### 优先级1：报名申请审核模块
- [ ] 创建 `application-review.tsx`
- [ ] 提取待审核表单逻辑（约200行）
- [ ] 提取已审核表单逻辑（约200行）
- [ ] 提取导出功能
- [ ] 在 page.tsx 中引用新组件

### 优先级2：代码优化
- [ ] 统一错误提示样式（可创建 `components/Toast.tsx`）
- [ ] 统一表格分页组件（可创建 `components/Pagination.tsx`）
- [ ] 统一筛选器组件（可创建 `components/FilterBar.tsx`）

### 优先级3：性能优化
- [ ] 懒加载大组件
- [ ] 使用 React.memo 优化不必要的重渲染
- [ ] 数据缓存策略

## 模块间通信

### 共享状态
如果模块间需要共享状态，建议使用：
1. Context API（轻量级状态）
2. 状态提升到 page.tsx（简单场景）
3. Zustand/Redux（复杂场景）

### 事件通信
```tsx
// 父组件传递回调
<ModuleName onSuccess={() => refreshOtherModule()} />

// 子组件调用
props.onSuccess?.();
```

## 样式规范

### Tailwind 类名顺序
1. 布局：`flex`, `grid`, `block`
2. 定位：`relative`, `absolute`
3. 尺寸：`w-`, `h-`, `min-`, `max-`
4. 间距：`p-`, `m-`, `space-`
5. 颜色：`bg-`, `text-`, `border-`
6. 其他：`rounded-`, `shadow-`, `hover:`

### 深色模式
始终使用 `dark:` 前缀支持深色模式：
```tsx
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
```

## 最佳实践

1. ✅ **单一职责**：每个组件只负责一个功能模块
2. ✅ **类型安全**：使用TypeScript类型定义
3. ✅ **错误处理**：统一的错误提示和日志
4. ✅ **加载状态**：提供清晰的加载反馈
5. ✅ **用户反馈**：成功/失败操作都要有提示
6. ✅ **响应式设计**：支持移动端和桌面端
7. ✅ **无障碍访问**：使用语义化HTML标签

## 下次新增模块的步骤

1. 在 `admin/` 目录创建新组件文件
2. 实现组件逻辑（参考上面的组件结构）
3. 在 `page.tsx` 导入组件
4. 添加标签按钮和内容区域
5. 测试功能完整性
6. 更新本文档

## 注意事项

⚠️ **重要**：
- 不要删除 `page.tsx` 中的共享逻辑（如认证、语言切换）
- 保持各模块的独立性，避免紧耦合
- 新增API接口时同步更新类型定义
- 提交代码前测试所有标签页功能

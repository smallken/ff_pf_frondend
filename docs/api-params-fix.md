# API参数修复

## 问题发现

用户报告"请求参数错误"，从错误日志看到：

```
TaskSubmission getAllTaskSubmissions 请求参数: {current: 1, pageSize: 40, submissionCategory: undefined, name: undefined}
原始参数: {current: 1, pageSize: 40, sortField: 'createTime', sortOrder: 'asc', reviewStatus: 0}
API Error: POST http://localhost:8100/api/task-submission/list/page/vo Error: 请求参数错误
```

## 根本原因

在新的多API并发调用实现中，我使用了错误的API参数格式。每个API有不同的参数要求：

### 原来的错误参数
```typescript
// 错误：试图对所有API使用相同的参数格式
const createApiParams = (apiSortField: string) => ({
  current: 1,
  pageSize: fetchSize,
  sortField: apiSortField,  // ❌ 不是所有API都支持
  sortOrder: sortOrder,     // ❌ 不是所有API都支持
  name: filters.user        // ❌ 参数名不匹配
});
```

### 正确的API参数要求

#### 1. FormService.getFormList
```typescript
params: {
  status?: number;
  userName?: string;  // ✅ 注意是userName，不是name
  current?: number;
  pageSize?: number;
}
```

#### 2. TaskSubmissionService.getAllTaskSubmissions  
```typescript
params: {
  current?: number;
  pageSize?: number;
  submissionCategory?: string;
  name?: string;           // ✅ 这里才是name
  reviewStatus?: number;
}
```

#### 3. ActivityApplicationService.getAllApplications
```typescript
params: {
  current?: number;
  pageSize?: number;
  reviewStatus?: number;
  organizer?: string;      // ✅ 注意是organizer，不是name
}
```

## 修复方案

为每个API创建专用的参数构造函数：

```typescript
// 修复后：每个API使用正确的参数
const createFormParams = () => ({
  current: 1,
  pageSize: fetchSize,
  status: 0, // 待审核
  ...(filters.user && { userName: filters.user })  // ✅ 正确字段名
});

const createTaskParams = () => ({
  current: 1,
  pageSize: fetchSize,
  reviewStatus: 0, // 待审核
  ...(filters.user && { name: filters.user })      // ✅ 正确字段名
});

const createActivityParams = () => ({
  current: 1,
  pageSize: fetchSize,
  reviewStatus: 0, // 待审核
  ...(filters.user && { organizer: filters.user }) // ✅ 正确字段名
});
```

## 修复内容

- ✅ 移除了不支持的`sortField`和`sortOrder`参数
- ✅ 修正了用户筛选的字段名映射
- ✅ 为每个API使用正确的参数结构

## 修复时间

2025-10-10 15:35

## 测试验证

修复后应该：
1. ✅ 不再出现"请求参数错误"
2. ✅ 三个API都能正常调用
3. ✅ 分页功能正常工作
4. ✅ 用户筛选功能正常工作

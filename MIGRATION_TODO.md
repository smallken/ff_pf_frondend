# 前端代码迁移待办事项

## 📍 当前状态

✅ **已完成**：
- 创建了 `src/services/adminService.ts`（新的Service）
- 在 `src/app/admin/page.tsx` 中添加了新版本函数：
  - `fetchPendingSubmissions_V2()` - 待审核表单
  - `fetchReviewedSubmissions_V2()` - 已审核表单
- 新旧代码并存，旧代码仍在使用中

⏳ **待后端完成**：
- 后端开发 `POST /api/admin/pending-submissions/page`
- 后端开发 `POST /api/admin/reviewed-submissions/page`

---

## 🚀 后端API完成后的切换步骤

### 第1步：启用真实API（修改adminService.ts）

打开 `src/services/adminService.ts`，找到这两行并取消注释：

```typescript
// 在 getPendingSubmissionsPage 方法中
// return request.post('/admin/pending-submissions/page', params); // 👈 取消这行的注释

// 在 getReviewedSubmissionsPage 方法中  
// return request.post('/admin/reviewed-submissions/page', params); // 👈 取消这行的注释
```

同时删除或注释掉Mock数据的代码。

### 第2步：切换函数调用（修改admin/page.tsx）

#### 2.1 切换待审核表单函数

找到 `fetchPendingSubmissions` 函数（约第380行），重命名为 `fetchPendingSubmissions_OLD`：

```typescript
// 旧版本（备份）
const fetchPendingSubmissions_OLD = async () => {
  // ... 保留旧代码作为备份
};
```

然后将 `fetchPendingSubmissions_V2` 重命名为 `fetchPendingSubmissions`：

```typescript
// 新版本（启用）
const fetchPendingSubmissions = async () => {  // 👈 去掉 _V2
  // ... 新代码
};
```

#### 2.2 切换已审核表单函数

类似地处理已审核表单函数。

### 第3步：清理前端排序逻辑（可选）

新版本使用后端排序，可以删除前端的排序代码：

```typescript
// 可以删除这部分（因为后端已排序）
const sortedPendingSubmissions = useMemo(() => {
  // ... 这段代码可以删除
}, [pendingSubmissions, sortConfig]);
```

直接使用：
```typescript
const paginatedPendingSubmissions = pendingSubmissions;
```

### 第4步：移除数据加载提示框（可选）

新版本不再需要"只显示前N条"的提示：

```typescript
// 可以删除这个蓝色提示框
{pendingTotal > 0 && pendingTotal < pendingActualTotal && (
  <div className="bg-blue-50...">
    数据加载提示...
  </div>
)}
```

### 第5步：测试

```bash
# 1. 启动开发服务器
npm run dev

# 2. 访问管理页面
# http://localhost:3000/admin

# 3. 测试项
- [ ] 待审核表单正常加载
- [ ] 点击下一页正常
- [ ] 末页有数据（不再为空）
- [ ] 排序功能正常
- [ ] 已审核表单正常加载
- [ ] 筛选功能正常
```

### 第6步：构建和部署

```bash
# 构建
npm run build

# 提交代码
git add .
git commit -m "feat: 切换到UNION API，实现真正的服务端分页"
git push
```

---

## 📝 详细的代码修改位置

### 文件1: `src/services/adminService.ts`

**第47行**：取消注释真实API调用
```typescript
// 当前（Mock）
console.warn('⚠️ 使用Mock数据，等待后端API完成');
return { records: [], total: 0, current: params.current, size: params.pageSize, pages: 0 };

// 修改为（真实API）
return request.post('/admin/pending-submissions/page', params);
```

**第67行**：取消注释真实API调用
```typescript
// 修改为
return request.post('/admin/reviewed-submissions/page', params);
```

### 文件2: `src/app/admin/page.tsx`

**约第380行**：重命名旧函数
```typescript
const fetchPendingSubmissions_OLD = async () => {
  // 保留作为备份
};
```

**约第530行**：启用新函数
```typescript
const fetchPendingSubmissions = async () => {  // 去掉_V2
  // 这就是新版本
};
```

**约第582行**：启用新函数
```typescript
const fetchReviewedSubmissions = async () => {  // 去掉_V2（或者修改旧版本名字）
  // 这就是新版本
};
```

---

## ⚠️ 注意事项

### 1. 保留备份

切换前建议创建一个备份分支：
```bash
git checkout -b backup/before-union-api
git add .
git commit -m "backup: 切换UNION API前的备份"
git checkout page
```

### 2. 分阶段测试

- 先在测试环境验证
- 确认无误后再上生产

### 3. 回滚方案

如果新版本有问题：
```bash
# 快速回滚
git checkout backup/before-union-api
git checkout page -- src/services/adminService.ts
git checkout page -- src/app/admin/page.tsx
```

---

## 🎯 切换后的预期效果

### 性能提升
- ✅ API调用：3次 → 1次
- ✅ 加载时间：2-3秒 → 0.5-1秒
- ✅ 数据完整性：可能缺失 → 100%完整

### 代码简化
- ✅ 前端逻辑更简洁
- ✅ 无需前端排序和分页
- ✅ 易于维护

### 用户体验
- ✅ 加载更快
- ✅ 翻页流畅
- ✅ 数据不再缺失

---

## 📞 联系人

如有问题：
- 后端API问题 → 查看 `BACKEND_IMPLEMENTATION_CHECKLIST.md`
- 前端切换问题 → 查看 `FRONTEND_MIGRATION_GUIDE.md`
- 快速参考 → 查看 `QUICK_REFERENCE.md`

---

**准备好后端API后，按照上述步骤切换即可！** 🚀

# 前端API集成说明

## 概述

本项目已完成前端与后端API的集成配置，包括环境配置、API服务层、用户认证、数据适配和错误处理。

## 项目结构

```
src/
├── config/
│   └── api.ts                 # API配置和端点定义
├── types/
│   └── api.ts                 # API相关类型定义
├── utils/
│   └── request.ts             # HTTP请求工具类
├── services/
│   ├── userService.ts         # 用户相关API服务
│   ├── formService.ts         # 表单相关API服务
│   ├── taskService.ts         # 任务提交相关API服务
│   ├── fileService.ts         # 文件上传相关API服务
│   └── index.ts               # 服务统一导出
├── contexts/
│   └── AuthContext.tsx        # 用户认证上下文
└── app/
    ├── login/page.tsx         # 登录页面（已集成API）
    ├── register/page.tsx      # 注册页面（已集成API）
    ├── profile/page.tsx       # 个人资料页面（已集成API）
    ├── forms/application/page.tsx # 申请表页面（已集成API）
    └── components/Header.tsx  # 头部组件（已集成认证状态）
```

## 环境配置

### API基础URL配置

在 `src/config/api.ts` 中配置了不同环境的API基础URL：

- 开发环境：`http://localhost:8101/api`
- 生产环境：`https://your-api-domain.com/api`

### 环境变量

可以通过环境变量覆盖默认配置：

```bash
# .env.local 或 .env.development
NEXT_PUBLIC_API_BASE_URL=http://localhost:8101/api
```

## API服务层

### 用户服务 (userService)

```typescript
import { userService } from '@/services';

// 用户登录
const loginUser = await userService.login({
  userAccount: 'username',
  userPassword: 'password'
});

// 用户注册
const registerUser = await userService.register({
  userAccount: 'username',
  userPassword: 'password',
  checkPassword: 'password'
});

// 发送邮箱验证码
const emailCode = await userService.sendEmail({
  userEmail: 'user@example.com',
  userName: 'username'
});

// 邮箱注册
const emailRegister = await userService.emailRegister({
  userEmail: 'user@example.com',
  strCode: 'verification_code',
  userPassword: 'password',
  checkPassword: 'password',
  userName: 'username'
});

// 获取当前登录用户
const currentUser = await userService.getLoginUser();

// 更新个人信息
const updateResult = await userService.updateMyInfo({
  userName: 'new_name',
  userProfile: 'new_profile'
});
```

### 表单服务 (formService)

```typescript
import { formService } from '@/services';

// 提交表单
const submitResult = await formService.submitForm({
  formType: 1, // 1-申请表，2-活动申请表，3-成果提交表
  formData: JSON.stringify(formData)
});

// 获取我的表单列表
const myForms = await formService.getMyForms({
  formType: 1,
  status: 0,
  current: 1,
  pageSize: 10
});

// 获取所有表单列表（管理员）
const allForms = await formService.getFormList({
  formType: 1,
  status: 0,
  userName: 'username',
  current: 1,
  pageSize: 10
});
```

### 任务服务 (taskService)

```typescript
import { taskService } from '@/services';

// 创建任务提交
const taskSubmission = await taskService.addTaskSubmission({
  taskId: 1,
  submissionData: JSON.stringify(submissionData)
});

// 获取我的任务提交列表
const myTasks = await taskService.getMyTaskSubmissionList({
  current: 1,
  pageSize: 10
});

// 编辑任务提交
const editResult = await taskService.editTaskSubmission({
  id: 1,
  submissionData: JSON.stringify(updatedData)
});
```

### 文件服务 (fileService)

```typescript
import { fileService } from '@/services';

// 上传文件
const uploadResult = await fileService.uploadFile(file, 'form_file');

// 上传头像
const avatarResult = await fileService.uploadAvatar(file);

// 上传表单附件
const formFileResult = await fileService.uploadFormFile(file);
```

## 用户认证

### 使用AuthContext

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout, loading } = useAuth();

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!isAuthenticated) {
    return <div>请先登录</div>;
  }

  return (
    <div>
      <p>欢迎, {user?.userName}</p>
      <button onClick={logout}>登出</button>
    </div>
  );
}
```

### 认证状态管理

- `user`: 当前登录用户信息
- `isAuthenticated`: 是否已登录
- `loading`: 认证状态加载中
- `login(userAccount, userPassword)`: 登录方法
- `logout()`: 登出方法
- `updateUser(userData)`: 更新用户信息

## 错误处理

### 统一错误处理

所有API请求都包含统一的错误处理：

```typescript
try {
  const result = await userService.login(loginData);
  // 处理成功结果
} catch (error) {
  // 错误信息已在前端显示
  console.error('登录失败:', error.message);
}
```

### 错误类型

- 网络错误：请求超时、连接失败
- 认证错误：未登录、token过期
- 业务错误：参数错误、权限不足
- 服务器错误：500错误

## 数据适配

### 类型安全

所有API请求和响应都有完整的TypeScript类型定义：

```typescript
// 请求类型
interface UserLoginRequest {
  userAccount: string;
  userPassword: string;
}

// 响应类型
interface LoginUserVO {
  id: number;
  userName: string;
  userRole: string;
  createTime: string;
  updateTime: string;
}
```

### 数据转换

- 表单数据自动转换为JSON字符串
- 日期字符串自动转换为Date对象
- 分页数据统一处理

## 使用示例

### 完整的登录流程

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (formData) => {
    setLoading(true);
    setError('');

    try {
      await login(formData.userAccount, formData.userPassword);
      router.push('/'); // 登录成功跳转
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* 表单内容 */}
      {error && <div className="error">{error}</div>}
      <button disabled={loading}>
        {loading ? '登录中...' : '登录'}
      </button>
    </form>
  );
}
```

### 表单提交示例

```typescript
import { formService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';

function ApplicationForm() {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      await formService.submitForm({
        formType: 1,
        formData: JSON.stringify(formData)
      });
      router.push('/forms?success=提交成功');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 表单内容 */}
      <button disabled={loading || !isAuthenticated}>
        {loading ? '提交中...' : '提交'}
      </button>
    </form>
  );
}
```

## 部署配置

### 开发环境

1. 确保后端服务运行在 `http://localhost:8101`
2. 启动前端开发服务器：`npm run dev`
3. 访问 `http://localhost:3000`

### 生产环境

1. 设置环境变量：
   ```bash
   NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
   ```

2. 构建项目：
   ```bash
   npm run build
   npm start
   ```

## 注意事项

1. **CORS配置**：确保后端已正确配置CORS，允许前端域名访问
2. **认证方式**：当前使用Session认证，如需JWT请修改request.ts中的认证逻辑
3. **错误处理**：所有API调用都应包含适当的错误处理
4. **类型安全**：建议使用TypeScript类型检查，避免运行时错误
5. **环境变量**：敏感信息应通过环境变量配置，不要硬编码

## 扩展功能

### 添加新的API服务

1. 在 `src/services/` 目录下创建新的服务文件
2. 在 `src/types/api.ts` 中添加相关类型定义
3. 在 `src/services/index.ts` 中导出新服务
4. 在组件中使用新服务

### 自定义请求拦截器

可以在 `src/utils/request.ts` 中修改请求拦截器，添加：
- 请求日志
- 请求重试
- 请求缓存
- 自定义认证逻辑

## 故障排除

### 常见问题

1. **API请求失败**：检查后端服务是否运行，CORS配置是否正确
2. **认证失败**：检查Session配置，确保Cookie正确设置
3. **类型错误**：确保TypeScript类型定义与后端API一致
4. **环境变量不生效**：确保环境变量以 `NEXT_PUBLIC_` 开头

### 调试技巧

1. 使用浏览器开发者工具查看网络请求
2. 检查控制台错误信息
3. 使用React DevTools查看组件状态
4. 在后端添加日志记录API调用

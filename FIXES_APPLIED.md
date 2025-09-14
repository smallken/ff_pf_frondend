# 问题修复说明

## 修复内容

### 1. 数据库字段统一改为驼峰命名

#### 问题描述
- 原数据库表使用下划线命名（如 `user_account`, `user_password`）
- Java实体类使用驼峰命名（如 `userAccount`, `userPassword`）
- MyBatis Plus配置中 `map-underscore-to-camel-case` 设置为 `false`

#### 解决方案
1. **修改MyBatis Plus配置**
   ```yaml
   mybatis-plus:
     configuration:
       map-underscore-to-camel-case: true  # 改为 true
   ```

2. **创建新的数据库表结构**
   - 文件：`springboot-init-master/sql/reset_database.sql`
   - 所有表字段统一使用驼峰命名
   - 简化表结构，使用统一的 `applicationFormUnified` 表

3. **更新实体类**
   - 更新 `ApplicationForm.java` 实体类
   - 表名改为 `applicationFormUnified`
   - 字段名保持驼峰命名

#### 数据库表结构变更
```sql
-- 用户表 (user)
- userAccount, userPassword, userName, userEmail
- userProfile, userRole, userPoints, userTotalPoints
- walletAddress, createTime, updateTime, isDelete

-- 统一申请表 (applicationFormUnified)  
- formType, formData, status, reviewMessage
- userId, createTime, updateTime, isDelete

-- 任务提交表 (taskSubmission)
- taskId, submissionData, status, reviewMessage  
- userId, createTime, updateTime, isDelete
```

### 2. 修复前端登录密码显示问题

#### 问题描述
- 前端登录页面中 AuthContext 引用路径错误
- 路径：`../../contexts/AuthContext` → `../contexts/AuthContext`

#### 解决方案
1. **修复引用路径**
   ```typescript
   // 修改前
   import { useAuth } from '../../contexts/AuthContext';
   
   // 修改后  
   import { useAuth } from '../contexts/AuthContext';
   ```

2. **验证登录流程**
   - 检查 AuthContext 中的登录逻辑
   - 确认 userService.login 方法正确
   - 验证错误处理机制

## 测试数据

### 管理员账号
- 账号：`admin`
- 密码：`123456`
- 邮箱：`admin@flipflop.com`

### 测试用户
- 账号：`testuser`
- 密码：`123456`  
- 邮箱：`test@flipflop.com`

## 启动步骤

### 1. 后端启动
```bash
cd springboot-init-master
# 确保MySQL运行并执行数据库脚本
mysql -u root -p < sql/reset_database.sql
# 启动Spring Boot应用
mvn spring-boot:run
```

### 2. 前端启动
```bash
cd ff-pf-frondend
# 安装依赖
npm install
# 启动开发服务器
npm run dev
# 或使用启动脚本
./start-dev.sh
```

### 3. 测试登录
- 访问：http://localhost:3000/login
- 使用管理员账号：admin / 123456
- 或测试用户：testuser / 123456

## API测试

可以使用提供的测试脚本验证API连接：
```bash
node test-api.js
```

## 注意事项

1. **数据库连接**
   - 确保MySQL服务运行
   - 检查 `application.yml` 中的数据库配置

2. **环境变量**
   - 前端API地址：`NEXT_PUBLIC_API_BASE_URL=http://localhost:8101/api`
   - 后端端口：8101，前端端口：3000

3. **CORS配置**
   - 后端已配置允许前端域名访问
   - 使用 `credentials: 'include'` 支持Session认证

## 文件变更清单

### 后端文件
- `src/main/resources/application.yml` - MyBatis Plus配置
- `src/main/java/com/yupi/springbootinit/model/entity/ApplicationForm.java` - 实体类更新
- `sql/reset_database.sql` - 新数据库结构
- `sql/create_table_camel_case.sql` - 驼峰命名建表脚本

### 前端文件
- `src/app/login/page.tsx` - 修复AuthContext引用路径
- `.env.local` - 环境变量配置
- `.env.example` - 环境变量示例
- `test-api.js` - API测试脚本

所有修改已完成，系统应该可以正常运行。

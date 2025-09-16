/**
 * API相关类型定义
 */

// 基础响应类型
export interface BaseResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 分页请求参数
export interface PageRequest {
  current: number;
  pageSize: number;
}

// 分页响应数据
export interface PageData<T> {
  records: T[];
  total: number;
  current: number;
  size: number;
  pages: number;
}

// 用户相关类型
export interface User {
  id: number;
  userEmail: string;
  userAccount: string;
  userName: string;
  userProfile?: string;
  userRole: string;
  userPoints?: number;
  userLevel?: number; // 用户等级：1-探索者，2-探路者，3-开路者，4-先驱者
  walletAddress?: string;
  createTime: string;
  updateTime: string;
}

export interface LoginUserVO {
  id: number;
  userName: string;
  userEmail?: string;
  userAvatar?: string;
  userProfile?: string;
  userRole: string;
  userPoints?: number;
  userLevel?: number; // 用户等级：1-探索者，2-探路者，3-开路者，4-先驱者
  walletAddress?: string;
  createTime: string;
  updateTime: string;
}

// 用户请求类型
export interface UserLoginRequest {
  userAccount: string;
  userPassword: string;
}

export interface UserRegisterRequest {
  userAccount: string;
  userPassword: string;
  checkPassword: string;
}

export interface UserEmailRegisterRequest {
  userEmail: string;
  strCode: string;
  userPassword: string;
  checkPassword: string;
  userName: string;
}

export interface UserSendEmailRequest {
  userEmail: string;
  userName: string;
}

export interface UserUpdateMyRequest {
  userName?: string;
  userEmail?: string;
  userProfile?: string;
  userAvatar?: string;
  walletAddress?: string;
}

// 表单相关类型
export interface ApplicationForm {
  id: number;
  userId: number;
  name: string;
  email: string;
  twitterUsername: string;
  telegramUsername?: string;
  walletAddress?: string;
  web3Role?: string;
  expertise?: string;
  portfolioLink?: string;
  motivation?: string;
  weeklyHours?: string;
  eventOrganization?: string;
  resources?: string;
  entrepreneurship?: string;
  status: number;
  reviewMessage?: string;
  reviewScore?: number;
  createTime: string;
  updateTime: string;
}

// 新的申请表请求类型
export interface ApplicationFormSubmitRequest {
  name: string;
  email: string;
  twitterUsername: string;
  telegramUsername?: string;
  walletAddress?: string;
  web3Role?: string;
  expertise?: string;
  portfolioLink?: string;
  motivation?: string;
  weeklyHours?: string;
  eventOrganization?: string;
  resources?: string;
  entrepreneurship?: string;
}

// 兼容旧的表单提交请求
export interface FormSubmitRequest {
  formType: number;
  formData: string;
}

// 活动申请表相关类型
export interface ActivityApplicationSubmitRequest {
  organizer: string;
  email: string;
  telegramUsername?: string;
  twitterUsername?: string;
  walletAddress?: string;
  activityTheme: string;
  briefIntroduction?: string;
  activityType: string;
  activityTime: string; // 前端使用字符串，后端会转换为Date
  activityLocation: string;
  activityScale: string;
  targetAudience: string;
  activityGoals: string;
  activityProcess: string;
  expectedResults?: string;
  invitedSpeakers?: string;
  partners?: string;
  financialSupport: string;
  otherSupport: string;
}

export interface ActivityApplication {
  id: number;
  userId: number;
  organizer: string;
  email: string;
  telegramUsername?: string;
  twitterUsername?: string;
  walletAddress?: string;
  activityTheme: string;
  briefIntroduction?: string;
  activityType: string;
  activityTime: string;
  activityLocation: string;
  activityScale: string;
  targetAudience: string;
  activityGoals: string;
  activityProcess: string;
  expectedResults?: string;
  invitedSpeakers?: string;
  partners?: string;
  financialSupport: string;
  otherSupport: string;
  reviewStatus?: number; // 0-待审核，1-审核通过，2-审核拒绝
  reviewMessage?: string;
  reviewScore?: number;
  createTime: string;
  updateTime: string;
}

// 成果提交表相关类型
export interface TaskDetailDTO {
  id?: number;
  taskSubmissionId?: number;
  submissionCategory: string; // 提交类别
  taskType: string;
  contentLink: string;
  screenshot?: string; // 文件路径，与后端一致
  completionDate: string;
  description?: string;
  reviewStatus?: number;
  reviewMessage?: string;
  reviewScore?: number;
  userId?: number;
  createTime?: string;
  updateTime?: string;
}

export interface TaskSubmissionAddRequest {
  name: string;
  email: string;
  twitterUsername: string;
  telegramUsername?: string;
  walletAddress?: string;
  tasks: TaskDetailDTO[];
}

export interface TaskSubmissionVO {
  id: number;
  userId: number;
  name: string;
  email: string;
  twitterUsername: string;
  telegramUsername?: string;
  walletAddress?: string;
  tasks: TaskDetailDTO[];
  reviewStatus?: number; // 审核状态：0-未审核，1-审核通过，2-未通过
  reviewMessage?: string; // 审核意见
  reviewScore?: number; // 审核积分
  createTime: string;
  updateTime: string;
}

export interface FormReviewRequest {
  formId: number;
  status: number;
  reviewComment?: string;
  score?: number;
}

// 任务提交相关类型 - 与后端保持一致
export interface TaskSubmissionEditRequest {
  id: number;
  name?: string;
  email?: string;
  twitterUsername?: string;
  telegramUsername?: string;
  walletAddress?: string;
  tasks?: TaskDetailDTO[];
}

export interface TaskSubmissionUpdateRequest {
  id: number;
  reviewStatus?: number;
  reviewMessage?: string;
  reviewScore?: number;
}

export interface TaskSubmissionQueryRequest extends PageRequest {
  userId?: number;
  reviewStatus?: number;
}

// 文件上传类型
export interface UploadFileRequest {
  biz: string;
}

export interface FileUploadResponse {
  url: string;
  name: string;
}

// 邮件验证码类型
export interface EmailVO {
  email: string;
  code: string;
}

// 删除请求类型
export interface DeleteRequest {
  id: number;
}

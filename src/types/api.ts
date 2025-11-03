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
  totalPoints?: number; // 总积分（从totalPoint表获取）
  userLevel?: number; // 用户等级：1-探索者，2-探路者，3-开路者，4-先驱者
  twitterUsername?: string;
  telegramUsername?: string;
  walletAddress?: string;
  country?: string; // 所在国家地区
  twitterFollowers?: number; // Twitter粉丝数
  createTime: string;
  updateTime: string;
}

export interface UserVO {
  id: number;
  userEmail?: string;
  userName: string;
  userAvatar?: string;
  userProfile?: string;
  twitterUsername?: string;
  telegramUsername?: string;
  walletAddress?: string;
  userRole: string;
  createTime: string;
}

// 排行榜用户类型
export interface RankingUserVO {
  rank?: number;
  id: number;
  userName: string;
  userEmail: string;
  twitterUsername?: string;
  userPoints: number;
  weeklyPoints?: number;
  totalPoints?: number;
  userLevel: number;
  walletAddress?: string;
}

export interface AdminStatsVO {
  totalUsers: number;
  pendingForms: number;
  approvedForms: number;
  rejectedForms: number;
  totalPoints: number;
  totalSubmissions: number;
  averagePoints: number;
  pendingApplications: number;
  pendingTaskSubmissions: number;
  pendingActivityApplications: number;
  approvedApplications: number;
  approvedTaskSubmissions: number;
  approvedActivityApplications: number;
  rejectedApplications: number;
  rejectedTaskSubmissions: number;
  rejectedActivityApplications: number;
  currentMonthApprovedPromotionTasks: number;
  currentMonthApprovedShortTasks: number;
  currentMonthApprovedLongTasks: number;
  currentMonthApprovedCommunityTasks: number;
}

export interface MonthlyPointVO {
  id?: number;
  userId: number;
  pointYear: number;
  pointMonth: number;
  point: number;
  isExcess?: number;
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
  twitterUsername?: string;
  telegramUsername?: string;
  walletAddress?: string;
  country?: string; // 所在国家地区
  twitterFollowers?: number; // Twitter粉丝数
  emailVerificationCode?: string;
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
  web3Role?: string | string[];
  expertise?: string | string[];
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

// 统一提交查询请求
export interface UnifiedSubmissionQueryRequest extends PageRequest {
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  types?: ('application' | 'task' | 'activity')[];
  status?: number[];
  user?: string;
  startDate?: string;
  endDate?: string;
}

// 统一提交记录
export interface UnifiedSubmissionVO {
  id: number;
  type: 'application' | 'task' | 'activity';
  title: string;
  userName: string;
  userEmail: string;
  status: number;
  createTime: string;
  sourceId: number;
  sourceTable: string;
}

// 周挑战相关类型
export interface CommunicationTaskVO {
  id: number;
  contentLink: string;
  screenshot: string;
  reviewStatus: number;
  reviewMessage?: string;
  weekCount: number;
  dateRange: string;
  createTime: string;
}

export interface CommunityTaskVO {
  id: number;
  screenshot: string;
  reviewStatus: number;
  reviewMessage?: string;
  weekCount: number;
  dateRange: string;
  createTime: string;
}

export interface OriginalTaskVO {
  id: number;
  contentLink: string;
  screenshot: string;
  browseNum: number;
  reviewStatus: number;
  reviewMessage?: string;
  weekCount: number;
  dateRange: string;
  createTime: string;
}

export interface WeeklyTaskOverview {
  communicationSubmitted: number;
  communicationLimit: number;
  communitySubmitted: number;
  communityLimit: number;
  originalSubmitted: number;
  originalLimit: number;
  weeklyPoints: number;
  communicationTasks: CommunicationTaskVO[];
  communityTasks: CommunityTaskVO[];
  originalTasks: OriginalTaskVO[];
}

export interface WeeklyTaskSubmitRequest {
  contentLink: string;
  screenshotUrl: string;
}

export interface OriginalTaskSubmitRequest {
  contentLink: string;
  screenshotUrl: string;
  browseNum: number;
}

export interface OriginalTaskUpdateRequest {
  id: number;
  screenshotUrl?: string;
  browseNum?: number;
  contentLink?: string;
}

export interface WeeklyTaskSubmitResponse {
  taskId: number;
  reviewStatus: number;
}

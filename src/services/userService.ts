/**
 * 用户相关API服务
 */
import { request } from '@/utils/request';
import { API_ENDPOINTS } from '@/config/api';
import type {
  UserLoginRequest,
  UserRegisterRequest,
  UserEmailRegisterRequest,
  UserSendEmailRequest,
  UserUpdateMyRequest,
  LoginUserVO,
  User,
  EmailVO,
  PageData,
  RankingUserVO,
  AdminStatsVO,
} from '@/types/api';

export const userService = {
  // 用户登录
  login: (data: UserLoginRequest): Promise<LoginUserVO> => {
    return request.post<LoginUserVO>(API_ENDPOINTS.USER.LOGIN, data);
  },

  // 用户注册
  register: (data: UserRegisterRequest): Promise<number> => {
    return request.post<number>(API_ENDPOINTS.USER.REGISTER, data);
  },

  // 发送邮箱验证码
  sendEmail: (data: UserSendEmailRequest): Promise<EmailVO> => {
    return request.post<EmailVO>(API_ENDPOINTS.USER.SEND_EMAIL, data);
  },

  // 邮箱注册
  emailRegister: (data: UserEmailRegisterRequest): Promise<number> => {
    return request.post<number>(API_ENDPOINTS.USER.EMAIL_REGISTER, data);
  },

  // 用户登出
  logout: (): Promise<boolean> => {
    return request.post<boolean>(API_ENDPOINTS.USER.LOGOUT);
  },

  // 获取当前登录用户信息
  getLoginUser: (): Promise<LoginUserVO> => {
    return request.get<LoginUserVO>(API_ENDPOINTS.USER.GET_LOGIN_USER);
  },

  // 更新个人信息
  updateMyInfo: (data: UserUpdateMyRequest): Promise<boolean> => {
    return request.post<boolean>(API_ENDPOINTS.USER.UPDATE_MY, data);
  },

  // 获取用户列表（管理员）
  getUserList: (params: {
    current?: number;
    pageSize?: number;
  } = {}): Promise<PageData<User>> => {
    return request.post<PageData<User>>(API_ENDPOINTS.USER.LIST, {
      current: params.current || 1,
      pageSize: params.pageSize || 20
    });
  },

  // 获取排行榜（分页）
  getRanking: (params: {
    current?: number;
    pageSize?: number;
  } = {}): Promise<PageData<RankingUserVO>> => {
    const queryParams = new URLSearchParams();
    if (params.current) queryParams.append('current', params.current.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.USER.RANKING}?${queryString}` : API_ENDPOINTS.USER.RANKING;
    
    return request.get<PageData<RankingUserVO>>(url);
  },

  // 获取周排行榜
  getWeeklyRanking: (params: {
    current?: number;
    pageSize?: number;
  } = {}): Promise<PageData<RankingUserVO>> => {
    const queryParams = new URLSearchParams();
    if (params.current) queryParams.append('current', params.current.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    
    const queryString = queryParams.toString();
    const url = queryString ? `/user/weeklyRanking?${queryString}` : '/user/weeklyRanking';
    
    return request.get<PageData<RankingUserVO>>(url);
  },

  // 获取总排行榜
  getTotalRanking: (params: {
    current?: number;
    pageSize?: number;
  } = {}): Promise<PageData<RankingUserVO>> => {
    const queryParams = new URLSearchParams();
    if (params.current) queryParams.append('current', params.current.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    
    const queryString = queryParams.toString();
    const url = queryString ? `/user/totalRanking?${queryString}` : '/user/totalRanking';
    
    return request.get<PageData<RankingUserVO>>(url);
  },

  // 获取管理员统计数据
  getAdminStats: (): Promise<AdminStatsVO> => {
    return request.get<AdminStatsVO>(API_ENDPOINTS.USER.ADMIN_STATS);
  },

  // 发送邮箱验证码
  sendEmailVerificationCode: (email: string): Promise<boolean> => {
    return request.post<boolean>(`/user/send-email-code?email=${encodeURIComponent(email)}`, null);
  },

  // 验证邮箱验证码
  verifyEmailCode: (data: { email: string; verificationCode: string }): Promise<boolean> => {
    return request.post<boolean>('/user/verify-email-code', data);
  },

  // 检查注册信息重复性
  checkRegistrationDuplicates: (userEmail: string, userName: string, twitterUsername?: string): Promise<string> => {
    const params = new URLSearchParams();
    params.append('userEmail', userEmail);
    params.append('userName', userName);
    if (twitterUsername && twitterUsername.trim()) {
      params.append('twitterUsername', twitterUsername.trim());
    }
    return request.post<string>(`/user/check-duplicates?${params.toString()}`, null);
  },

  // 检查字段唯一性
  checkFieldUnique: (field: string, value: string): Promise<boolean> => {
    const params = new URLSearchParams();
    params.append('field', field);
    params.append('value', value);
    return request.get<boolean>(`/user/check-field-unique?${params.toString()}`);
  },

  // 检查字段唯一性并返回具体错误信息
  checkFieldUniqueWithError: (field: string, value: string): Promise<{isUnique: boolean, errorMessage?: string}> => {
    // 使用POST方法避免URL长度限制，特别是对于长钱包地址
    return request.post<{isUnique: boolean, errorMessage?: string}>(`/user/check-field-unique-with-error`, {
      field,
      value
    });
  },
};

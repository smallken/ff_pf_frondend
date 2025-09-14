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
};

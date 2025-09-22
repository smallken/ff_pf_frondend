/**
 * API配置
 */

// 根据环境获取API基础URL
const getApiBaseUrl = () => {
  // 优先使用环境变量中的配置
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // 根据环境返回默认配置
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8100/api';
  }
  
  // 生产环境默认配置
  return 'https://api.ffpp.space/api';
};

// 获取超时时间
const getTimeout = () => {
  const timeout = process.env.NEXT_PUBLIC_API_TIMEOUT;
  return timeout ? parseInt(timeout, 10) : 30000; // 增加到30秒
};

// 获取重试次数
const getRetryCount = () => {
  const retryCount = process.env.NEXT_PUBLIC_RETRY_COUNT;
  return retryCount ? parseInt(retryCount, 10) : 3;
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: getTimeout(), // 超时时间（毫秒）
  RETRY_COUNT: getRetryCount(), // 重试次数
  DEBUG: process.env.NEXT_PUBLIC_DEBUG === 'true', // 是否启用调试模式
};

// 应用配置
export const APP_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Flipflop Footprint',
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  ENV: process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV || 'development',
};

// API端点配置
export const API_ENDPOINTS = {
  // 用户相关
  USER: {
    LOGIN: '/user/login',
    REGISTER: '/user/register',
    EMAIL_REGISTER: '/user/register/email',
    SEND_EMAIL: '/user/sendEmail',
    LOGOUT: '/user/logout',
    GET_LOGIN_USER: '/user/get/login',
    UPDATE_MY: '/user/update/my',
    LIST: '/user/list/page',
    RANKING: '/user/ranking',
    ADMIN_STATS: '/user/admin/stats',
  },
  // 表单相关
  FORM: {
    SUBMIT: '/form/submit',
    REVIEW: '/form/review',
    MY_FORMS: '/form/my',
    LIST: '/form/list/page',
  },
  // 活动申请表相关
  ACTIVITY_APPLICATION: {
    SUBMIT: '/activity-application/submit',
    REVIEW: '/activity-application/review',
    LIST: '/activity-application/list/page',
    MY_LIST: '/activity-application/my/list/page',
    GET: '/activity-application/get',
    PUBLIC_LIST: '/activity-application/public/list/page',
  },
  // 成果提交表相关
  TASK_SUBMISSION: {
    ADD: '/taskSubmission/add',
    DELETE: '/taskSubmission/delete',
    UPDATE: '/taskSubmission/update',
    GET: '/taskSubmission/get/vo',
    LIST: '/taskSubmission/list/page/vo',
    MY_LIST: '/taskSubmission/my/list/page/vo',
    EDIT: '/taskSubmission/edit',
  },
  // 文件上传
  FILE: {
    UPLOAD: '/file/upload',
  },
  // Launch大赛相关
  LAUNCH_CONTEST: {
    REGISTRATION: {
      ADD: '/launch-contest/registration/add',
      UPDATE: '/launch-contest/registration/update',
      DELETE: '/launch-contest/registration/delete',
      GET: '/launch-contest/registration/get/vo',
      LIST: '/launch-contest/registration/list/page/vo',
    },
    DD_QUESTIONNAIRE: {
      ADD: '/launch-contest/dd-questionnaire/add',
      UPDATE: '/launch-contest/dd-questionnaire/update',
      GET: '/launch-contest/dd-questionnaire/get/vo',
      LIST: '/launch-contest/dd-questionnaire/list/page/vo',
      MY_LIST: '/launch-contest/dd-questionnaire/my/list/page/vo',
    },
    LEADERBOARD: {
      GET: '/launch-contest/leaderboard',
      LIST: '/launch-contest/leaderboard/list/page/vo',
    },
  },
  // Mint大赛相关
  MINT_CONTEST: {
    REGISTRATION: {
      ADD: '/mint-contest/registration/add',
      UPDATE: '/mint-contest/registration/update',
      DELETE: '/mint-contest/registration/delete',
      GET: '/mint-contest/registration/get/vo',
      LIST: '/mint-contest/registration/list/page/vo',
      MY_LIST: '/mint-contest/registration/my/list/page/vo',
    },
    GALLERY: {
      ADD: '/mint-contest/gallery/add',
      UPDATE: '/mint-contest/gallery/update',
      DELETE: '/mint-contest/gallery/delete',
      GET: '/mint-contest/gallery/get/vo',
      LIST: '/mint-contest/gallery/list/page/vo',
    },
    VOTE: {
      ADD: '/mint-contest/vote/add',
      DELETE: '/mint-contest/vote/delete',
    },
  },
};

// 请求状态码
export const HTTP_STATUS = {
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// 错误码
export const ERROR_CODES = {
  SUCCESS: 0,
  PARAMS_ERROR: 40000,
  NOT_LOGIN_ERROR: 40100,
  NO_AUTH_ERROR: 40101,
  NOT_FOUND_ERROR: 40400,
  FORBIDDEN_ERROR: 40300,
  SYSTEM_ERROR: 50000,
  OPERATION_ERROR: 50001,
};

// 调试日志函数
export const debugLog = (...args: any[]) => {
  if (API_CONFIG.DEBUG) {
    console.log('[API Debug]', ...args);
  }
};

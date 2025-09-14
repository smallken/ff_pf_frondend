/**
 * HTTP请求工具类
 */
import { API_CONFIG, HTTP_STATUS, ERROR_CODES } from '@/config/api';
import type { BaseResponse } from '@/types/api';

// 请求配置接口
interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

// 请求拦截器
const requestInterceptor = (config: RequestConfig): RequestConfig => {
  // 添加认证token
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  // 添加默认headers
  config.headers = {
    'Content-Type': 'application/json',
    ...config.headers,
  };

  return config;
};

// 响应拦截器
const responseInterceptor = async <T>(response: Response): Promise<BaseResponse<T>> => {
  // 检查HTTP状态码
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
  }

  const result: BaseResponse<T> = await response.json();

  // 检查业务状态码
  if (result.code !== ERROR_CODES.SUCCESS) {
    throw new Error(result.message || '请求失败');
  }

  return result;
};

// 错误处理
const handleError = (error: any): never => {
  console.error('Request error:', error);
  
  if (error.name === 'AbortError') {
    throw new Error('请求超时');
  }
  
  if (error.message.includes('HTTP Error: 401')) {
    // 未授权，清除token并跳转到登录页
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('登录已过期，请重新登录');
  }
  
  throw error;
};

// 创建请求函数
const createRequest = async <T>(config: RequestConfig): Promise<T> => {
  const { url, method = 'GET', data, headers = {}, timeout = API_CONFIG.TIMEOUT } = config;
  
  // 应用请求拦截器
  const interceptedConfig = requestInterceptor({ url, method, data, headers, timeout });
  
  // 构建完整URL
  const fullUrl = `${API_CONFIG.BASE_URL}${interceptedConfig.url}`;
  
  // 构建请求选项
  const requestOptions: RequestInit = {
    method: interceptedConfig.method,
    headers: interceptedConfig.headers,
    credentials: 'include', // 包含cookies
  };

  // 添加请求体
  if (data && interceptedConfig.method !== 'GET') {
    requestOptions.body = JSON.stringify(data);
  }

  // 创建AbortController用于超时控制
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  requestOptions.signal = controller.signal;

  try {
    const response = await fetch(fullUrl, requestOptions);
    clearTimeout(timeoutId);
    
    const result = await responseInterceptor<T>(response);
    return result.data;
  } catch (error) {
    clearTimeout(timeoutId);
    handleError(error);
  }
};

// 导出请求方法
export const request = {
  get: <T>(url: string, params?: Record<string, any>): Promise<T> => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return createRequest<T>({ url: `${url}${queryString}`, method: 'GET' });
  },

  post: <T>(url: string, data?: any): Promise<T> => {
    return createRequest<T>({ url, method: 'POST', data });
  },

  put: <T>(url: string, data?: any): Promise<T> => {
    return createRequest<T>({ url, method: 'PUT', data });
  },

  delete: <T>(url: string, data?: any): Promise<T> => {
    return createRequest<T>({ url, method: 'DELETE', data });
  },
};

// 文件上传请求
export const uploadFile = async (url: string, file: File, biz: string): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('biz', biz);

  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    if (result.code !== ERROR_CODES.SUCCESS) {
      throw new Error(result.message || '上传失败');
    }

    return result.data;
  } catch (error) {
    handleError(error);
  }
};

export default request;

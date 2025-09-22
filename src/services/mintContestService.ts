import { API_CONFIG, API_ENDPOINTS, ERROR_CODES } from '../config/api';

export interface MintContestRegistrationData {
  category: string;
  studioName?: string;
  contactPerson?: string;
  email: string;
  phone?: string;
  website?: string;
  teamSize?: string;
  experience?: string;
  projectTitle: string;
  projectDescription: string;
  projectCategory: string;
  projectLink?: string;
  walletAddress: string;
  additionalInfo?: string;
}

interface BaseResponse<T> {
  code: number;
  data: T;
  message: string;
  description: string;
}

const request = async <T>(method: string, url: string, data?: any): Promise<BaseResponse<T>> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include', // 包含cookie，支持session认证
  };

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, config);
    const jsonResponse: BaseResponse<T> = await response.json();

    if (jsonResponse.code !== ERROR_CODES.SUCCESS) {
      console.error(`API Error: ${jsonResponse.message}`, jsonResponse.description);
      throw new Error(jsonResponse.message || 'API request failed');
    }
    return jsonResponse;
  } catch (error) {
    console.error(`Network or API call error for ${url}:`, error);
    throw error;
  }
};

export const mintContestService = {
  // 提交参赛登记
  submitRegistration: async (data: MintContestRegistrationData): Promise<BaseResponse<number>> => {
    return request<number>('POST', API_ENDPOINTS.MINT_CONTEST.REGISTRATION.ADD, data);
  },

  // 获取参赛登记信息
  getRegistration: async (id: number): Promise<BaseResponse<MintContestRegistrationData>> => {
    return request<MintContestRegistrationData>('GET', `${API_ENDPOINTS.MINT_CONTEST.REGISTRATION.GET}?id=${id}`);
  },

  // 更新参赛登记信息
  updateRegistration: async (id: number, data: Partial<MintContestRegistrationData>): Promise<BaseResponse<boolean>> => {
    return request<boolean>('POST', API_ENDPOINTS.MINT_CONTEST.REGISTRATION.UPDATE, { id, ...data });
  },

  // 获取我的参赛登记列表
  getMyRegistrations: async (pageSize: number = 10, current: number = 1): Promise<BaseResponse<{ records: MintContestRegistrationData[], total: number }>> => {
    return request<{ records: MintContestRegistrationData[], total: number }>('POST', API_ENDPOINTS.MINT_CONTEST.REGISTRATION.MY_LIST, {
      pageSize,
      current,
      sortField: 'createTime',
      sortOrder: 'desc'
    });
  },

  // 删除参赛登记
  deleteRegistration: async (id: number): Promise<BaseResponse<boolean>> => {
    return request<boolean>('POST', API_ENDPOINTS.MINT_CONTEST.REGISTRATION.DELETE, { id });
  }
};

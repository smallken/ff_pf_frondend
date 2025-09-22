import { API_CONFIG, API_ENDPOINTS, ERROR_CODES } from '../config/api';

export interface LaunchContestRegistrationData {
  projectName: string;
  tokenName?: string;
  tokenContractAddress: string;
  tokenLogo?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  contactName?: string;
  contactRole?: string;
  contactTelegram?: string;
  contactEmail?: string;
  teamSize?: string;
  trackCategory: string;
  otherTrackName?: string;
  keyDataAtT0?: string;
  trafficContribution?: string;
  projectQuality?: string;
  narrativeConsensus?: string;
  teamEfficiency?: string;
  nextSteps?: string;
  declarations: string; // JSON字符串格式
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

  // If you have authentication tokens, add them here
  // const token = localStorage.getItem('authToken');
  // if (token) {
  //   headers['Authorization'] = `Bearer ${token}`;
  // }

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

export const launchContestService = {
  // 提交参赛登记
  submitRegistration: async (data: LaunchContestRegistrationData): Promise<BaseResponse<number>> => {
    return request<number>('POST', API_ENDPOINTS.LAUNCH_CONTEST.REGISTRATION.ADD, data);
  },

  // 获取参赛登记信息
  getRegistration: async (id: number): Promise<BaseResponse<LaunchContestRegistrationData>> => {
    return request<LaunchContestRegistrationData>('GET', `${API_ENDPOINTS.LAUNCH_CONTEST.REGISTRATION.GET}?id=${id}`);
  },

  // 更新参赛登记信息
  updateRegistration: async (id: number, data: Partial<LaunchContestRegistrationData>): Promise<BaseResponse<boolean>> => {
    return request<boolean>('POST', API_ENDPOINTS.LAUNCH_CONTEST.REGISTRATION.UPDATE, { id, ...data });
  },

  // 获取我的参赛登记列表
  getMyRegistrations: async (pageSize: number = 10, current: number = 1): Promise<BaseResponse<{ records: LaunchContestRegistrationData[], total: number }>> => {
    return request<{ records: LaunchContestRegistrationData[], total: number }>('POST', API_ENDPOINTS.LAUNCH_CONTEST.REGISTRATION.MY_LIST, {
      pageSize,
      current,
      sortField: 'createTime',
      sortOrder: 'desc'
    });
  },

  // 获取所有参赛登记列表（用于排行榜/参赛名单）
  getAllRegistrations: async (pageSize: number = 100, current: number = 1): Promise<BaseResponse<{ records: LaunchContestRegistrationData[], total: number }>> => {
    return request<{ records: LaunchContestRegistrationData[], total: number }>('POST', API_ENDPOINTS.LAUNCH_CONTEST.REGISTRATION.PUBLIC_LIST, {
      pageSize,
      current,
      sortField: 'createTime',
      sortOrder: 'desc'
    });
  },

  // 获取我的DD问答清单列表
  getMyDDQuestionnaires: async (pageSize: number = 10, current: number = 1): Promise<BaseResponse<{ records: any[], total: number }>> => {
    return request<{ records: any[], total: number }>('POST', API_ENDPOINTS.LAUNCH_CONTEST.DD_QUESTIONNAIRE.MY_LIST, {
      pageSize,
      current,
      sortField: 'createTime',
      sortOrder: 'desc'
    });
  },

  // 删除参赛登记
  deleteRegistration: async (id: number): Promise<BaseResponse<boolean>> => {
    return request<boolean>('POST', API_ENDPOINTS.LAUNCH_CONTEST.REGISTRATION.DELETE, { id });
  }
};

/**
 * 活动申请表相关API服务
 */
import { request } from '@/utils/request';
import { API_ENDPOINTS } from '@/config/api';
import type {
  ActivityApplicationSubmitRequest,
  ActivityApplication,
  PageData,
} from '@/types/api';

export const activityApplicationService = {
  // 提交活动申请表
  submitApplication: (data: ActivityApplicationSubmitRequest): Promise<number> => {
    return request.post<number>(API_ENDPOINTS.ACTIVITY_APPLICATION.SUBMIT, data);
  },

  // 获取我的活动申请表列表
  getMyApplications: (params: {
    current?: number;
    pageSize?: number;
    reviewStatus?: number;
  } = {}): Promise<PageData<ActivityApplication>> => {
    return request.post<PageData<ActivityApplication>>(
      API_ENDPOINTS.ACTIVITY_APPLICATION.MY_LIST, 
      {
        current: Math.floor(params.current || 1),
        pageSize: Math.floor(params.pageSize || 10),
        reviewStatus: params.reviewStatus,
      }
    );
  },

  // 获取活动申请表详情
  getApplication: (id: number): Promise<ActivityApplication> => {
    return request.get<ActivityApplication>(`${API_ENDPOINTS.ACTIVITY_APPLICATION.GET}?id=${id}`);
  },

  // 获取公开的活动申请表列表（已审核通过的）
  getPublicApplications: (params: {
    current?: number;
    pageSize?: number;
  } = {}): Promise<PageData<ActivityApplication>> => {
    return request.post<PageData<ActivityApplication>>(
      API_ENDPOINTS.ACTIVITY_APPLICATION.PUBLIC_LIST,
      {
        current: Math.floor(params.current || 1),
        pageSize: Math.floor(params.pageSize || 10),
      }
    );
  },

  // 管理员获取所有活动申请表列表
  getAllApplications: (params: {
    current?: number;
    pageSize?: number;
    reviewStatus?: number;
    organizer?: string;
  } = {}): Promise<PageData<ActivityApplication>> => {
    // 🚀 优化：只发送后端支持的字段，避免参数验证失败
    const requestData: any = {
      current: Math.floor(params.current || 1),
      pageSize: Math.floor(params.pageSize || 10),
    };
    
    // 只添加有值的可选参数（注意：reviewStatus可以为0）
    if (params.reviewStatus !== undefined && params.reviewStatus !== null) {
      requestData.reviewStatus = params.reviewStatus;
    }
    if (params.organizer !== undefined && params.organizer !== null) {
      requestData.organizer = params.organizer;
    }
    
    return request.post<PageData<ActivityApplication>>(
      API_ENDPOINTS.ACTIVITY_APPLICATION.LIST,
      requestData
    );
  },

  // 管理员审核活动申请表
  reviewApplication: (data: {
    id: number;
    reviewStatus: number; // 1-通过，2-拒绝
    reviewComment?: string; // 注意：后端使用的是reviewComment字段
    reviewScore?: number;
  }): Promise<boolean> => {
    return request.post<boolean>(API_ENDPOINTS.ACTIVITY_APPLICATION.REVIEW, data).then(response => {
      return response;
    }).catch(error => {
      console.error('❌ 活动申请表审核API失败:', error);
      throw error;
    });
  },
};

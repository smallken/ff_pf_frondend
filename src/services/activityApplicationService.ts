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
        current: params.current || 1,
        pageSize: params.pageSize || 10,
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
        current: params.current || 1,
        pageSize: params.pageSize || 10,
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
    return request.post<PageData<ActivityApplication>>(
      API_ENDPOINTS.ACTIVITY_APPLICATION.LIST,
      {
        current: params.current || 1,
        pageSize: params.pageSize || 10,
        reviewStatus: params.reviewStatus,
        organizer: params.organizer,
      }
    );
  },

  // 管理员审核活动申请表
  reviewApplication: (data: {
    id: number;
    reviewStatus: number; // 1-通过，2-拒绝
    reviewComment?: string; // 注意：后端使用的是reviewComment字段
    reviewScore?: number;
  }): Promise<boolean> => {
    console.log('🎪 活动申请表审核API调用:', {
      endpoint: API_ENDPOINTS.ACTIVITY_APPLICATION.REVIEW,
      data: data
    });
    
    return request.post<boolean>(API_ENDPOINTS.ACTIVITY_APPLICATION.REVIEW, data).then(response => {
      console.log('✅ 活动申请表审核API响应:', response);
      return response;
    }).catch(error => {
      console.error('❌ 活动申请表审核API失败:', error);
      throw error;
    });
  },
};

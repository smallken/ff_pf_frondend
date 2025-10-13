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
    reviewStatusList?: number[];  // 新增：多状态查询
    organizer?: string;
    dateRange?: string;
    sortField?: string;
    sortOrder?: string;
  } = {}): Promise<PageData<ActivityApplication>> => {
    const requestData: any = {
      current: Math.floor(params.current || 1),
      pageSize: Math.floor(params.pageSize || 10),
    };
    
    // 只添加非undefined的参数
    if (params.reviewStatus !== undefined) {
      requestData.reviewStatus = params.reviewStatus;
    }
    if (params.reviewStatusList !== undefined) {
      requestData.reviewStatusList = params.reviewStatusList;  // 新增：支持多状态查询
    }
    if (params.organizer !== undefined) {
      requestData.organizer = params.organizer;
    }
    if (params.dateRange !== undefined) {
      requestData.dateRange = params.dateRange;
    }
    if (params.sortField !== undefined) {
      requestData.sortField = params.sortField;
    }
    if (params.sortOrder !== undefined) {
      requestData.sortOrder = params.sortOrder;
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

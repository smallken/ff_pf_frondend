/**
 * 表单相关API服务
 */
import { request } from '@/utils/request';
import { API_ENDPOINTS } from '@/config/api';
import type {
  FormSubmitRequest,
  ApplicationFormSubmitRequest,
  FormReviewRequest,
  ApplicationForm,
  PageRequest,
  PageData,
} from '@/types/api';

export const formService = {
  // 提交申请表单
  submitApplicationForm: (data: ApplicationFormSubmitRequest): Promise<number> => {
    return request.post<number>(API_ENDPOINTS.FORM.SUBMIT, data);
  },

  // 提交表单（兼容旧接口）
  submitForm: (data: FormSubmitRequest): Promise<number> => {
    return request.post<number>('/api/form/submit/legacy', data);
  },

  // 审核表单（管理员）
  reviewForm: (data: FormReviewRequest): Promise<boolean> => {
    return request.post<boolean>(API_ENDPOINTS.FORM.REVIEW, data);
  },

  // 获取我的表单列表
  getMyForms: (params: {
    status?: number;
    current?: number;
    pageSize?: number;
  } = {}): Promise<PageData<ApplicationForm>> => {
    const queryParams = new URLSearchParams();
    if (params.status !== undefined) queryParams.append('status', params.status.toString());
    if (params.current !== undefined) queryParams.append('current', params.current.toString());
    if (params.pageSize !== undefined) queryParams.append('pageSize', params.pageSize.toString());
    
    return request.get<PageData<ApplicationForm>>(`${API_ENDPOINTS.FORM.MY_FORMS}?${queryParams.toString()}`);
  },

  // 获取所有表单列表（管理员）
  getFormList: (params: {
    status?: number;
    userName?: string;
    current?: number;
    pageSize?: number;
  } = {}): Promise<PageData<ApplicationForm>> => {
    const queryParams = new URLSearchParams();
    if (params.status !== undefined) queryParams.append('status', params.status.toString());
    if (params.userName) queryParams.append('userName', params.userName);
    if (params.current !== undefined) queryParams.append('current', params.current.toString());
    if (params.pageSize !== undefined) queryParams.append('pageSize', params.pageSize.toString());
    
    return request.get<PageData<ApplicationForm>>(`${API_ENDPOINTS.FORM.LIST}?${queryParams.toString()}`);
  },
};

/**
 * 成果提交表相关API服务
 */
import { request } from '@/utils/request';
import { API_ENDPOINTS } from '@/config/api';
import type {
  TaskSubmissionAddRequest,
  TaskSubmissionVO,
  TaskSubmissionEditRequest,
  TaskSubmissionUpdateRequest,
  TaskDetailDTO,
  PageData,
} from '@/types/api';

export const taskSubmissionService = {
  // 提交成果提交表
  addTaskSubmission: (data: TaskSubmissionAddRequest): Promise<number> => {
    return request.post<number>(API_ENDPOINTS.TASK_SUBMISSION.ADD, data);
  },

  // 获取我的成果提交表列表
  getMyTaskSubmissions: (params: {
    current?: number;
    pageSize?: number;
    submissionCategory?: string;
  } = {}): Promise<PageData<TaskSubmissionVO>> => {
    return request.post<PageData<TaskSubmissionVO>>(
      API_ENDPOINTS.TASK_SUBMISSION.MY_LIST, 
      {
        current: params.current || 1,
        pageSize: params.pageSize || 10,
        submissionCategory: params.submissionCategory,
      }
    );
  },

  // 获取成果提交表详情
  getTaskSubmission: (id: number): Promise<TaskSubmissionVO> => {
    return request.get<TaskSubmissionVO>(`${API_ENDPOINTS.TASK_SUBMISSION.GET}?id=${id}`);
  },

  // 管理员获取所有成果提交表列表
  getAllTaskSubmissions: (params: {
    current?: number;
    pageSize?: number;
    submissionCategory?: string;
    name?: string;
  } = {}): Promise<PageData<TaskSubmissionVO>> => {
    return request.post<PageData<TaskSubmissionVO>>(
      API_ENDPOINTS.TASK_SUBMISSION.LIST,
      {
        current: params.current || 1,
        pageSize: params.pageSize || 10,
        submissionCategory: params.submissionCategory,
        name: params.name,
      }
    );
  },

  // 编辑成果提交表
  editTaskSubmission: (data: TaskSubmissionEditRequest): Promise<boolean> => {
    return request.post<boolean>(API_ENDPOINTS.TASK_SUBMISSION.EDIT, data);
  },

  // 更新成果提交表（管理员）
  updateTaskSubmission: (data: TaskSubmissionUpdateRequest): Promise<boolean> => {
    return request.post<boolean>(API_ENDPOINTS.TASK_SUBMISSION.UPDATE, data);
  },

  // 删除成果提交表
  deleteTaskSubmission: (id: number): Promise<boolean> => {
    return request.post<boolean>(API_ENDPOINTS.TASK_SUBMISSION.DELETE, { id });
  },
};

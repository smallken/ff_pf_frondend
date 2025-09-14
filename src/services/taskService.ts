/**
 * 任务提交相关API服务
 */
import { request } from '@/utils/request';
import { API_ENDPOINTS } from '@/config/api';
import type {
  TaskSubmissionAddRequest,
  TaskSubmissionEditRequest,
  TaskSubmissionUpdateRequest,
  TaskSubmissionQueryRequest,
  TaskSubmissionVO,
  PageData,
  DeleteRequest,
} from '@/types/api';

export const taskService = {
  // 创建任务提交
  addTaskSubmission: (data: TaskSubmissionAddRequest): Promise<number> => {
    return request.post<number>(API_ENDPOINTS.TASK_SUBMISSION.ADD, data);
  },

  // 删除任务提交
  deleteTaskSubmission: (data: DeleteRequest): Promise<boolean> => {
    return request.post<boolean>(API_ENDPOINTS.TASK_SUBMISSION.DELETE, data);
  },

  // 更新任务提交
  updateTaskSubmission: (data: TaskSubmissionUpdateRequest): Promise<boolean> => {
    return request.post<boolean>(API_ENDPOINTS.TASK_SUBMISSION.UPDATE, data);
  },

  // 编辑任务提交（用户使用）
  editTaskSubmission: (data: TaskSubmissionEditRequest): Promise<boolean> => {
    return request.post<boolean>(API_ENDPOINTS.TASK_SUBMISSION.EDIT, data);
  },

  // 根据ID获取任务提交详情
  getTaskSubmissionById: (id: number): Promise<TaskSubmissionVO> => {
    return request.get<TaskSubmissionVO>(`${API_ENDPOINTS.TASK_SUBMISSION.GET}?id=${id}`);
  },

  // 分页获取任务提交列表（管理员）
  getTaskSubmissionList: (data: TaskSubmissionQueryRequest): Promise<PageData<TaskSubmissionVO>> => {
    return request.post<PageData<TaskSubmissionVO>>(API_ENDPOINTS.TASK_SUBMISSION.LIST, data);
  },

  // 分页获取当前用户的任务提交列表
  getMyTaskSubmissionList: (data: TaskSubmissionQueryRequest): Promise<PageData<TaskSubmissionVO>> => {
    return request.post<PageData<TaskSubmissionVO>>(API_ENDPOINTS.TASK_SUBMISSION.MY_LIST, data);
  },
};

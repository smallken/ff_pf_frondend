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
    ).then(response => {
      return response;
    }).catch(error => {
      console.error('❌ 获取我的任务提交列表失败:', error);
      throw error;
    });
  },

  // 获取成果提交表详情
  getTaskSubmission: (id: number): Promise<TaskSubmissionVO> => {
    return request.get<TaskSubmissionVO>(`${API_ENDPOINTS.TASK_SUBMISSION.GET}?id=${id}`);
  },

  // 管理员获取所有成果提交表列表
  getAllTaskSubmissions: (params: {
    current?: number;
    pageSize?: number;
    name?: string;
    reviewStatus?: number;
  } = {}): Promise<PageData<TaskSubmissionVO>> => {
    // 🚀 优化：只发送后端支持的字段，避免参数验证失败
    const requestData: any = {
      current: Math.floor(params.current || 1),
      pageSize: Math.floor(params.pageSize || 10),
    };
    
    // 只添加有值的可选参数（注意：reviewStatus可以为0）
    if (params.name !== undefined && params.name !== null) {
      requestData.name = params.name;
    }
    if (params.reviewStatus !== undefined && params.reviewStatus !== null) {
      requestData.reviewStatus = params.reviewStatus;
    }
    
    return request.post<PageData<TaskSubmissionVO>>(
      API_ENDPOINTS.TASK_SUBMISSION.LIST,
      requestData
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

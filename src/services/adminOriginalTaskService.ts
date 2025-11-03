import { API_CONFIG } from '../config/api';

export interface OriginalTaskDetailVO {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  contentLink: string;
  screenshot: string;
  browseNum: number;
  originalPoints: number;
  reviewStatus: number;
  reviewMessage: string;
  verifier: number;
  verifierName: string;
  weekCount: number;
  dateRange: string;
  createTime: string;
  updateTime: string;
}

export interface AdminReviewOriginalTaskRequest {
  taskId: number;
  reviewStatus: number; // 1-通过，2-拒绝
  reviewMessage?: string;
}

export const adminOriginalTaskService = {
  /**
   * 获取待审核任务列表
   */
  async listPendingTasks(weekCount?: number, current: number = 1, pageSize: number = 10) {
    const params = new URLSearchParams();
    if (weekCount) params.append('weekCount', weekCount.toString());
    params.append('current', current.toString());
    params.append('pageSize', pageSize.toString());

    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/original-task/pending?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pending tasks');
    }

    const result = await response.json();
    if (result.code !== 0) {
      throw new Error(result.message || 'Failed to fetch pending tasks');
    }

    return result.data;
  },

  /**
   * 获取已审核任务列表
   */
  async listReviewedTasks(
    weekCount?: number,
    reviewStatus?: number,
    current: number = 1,
    pageSize: number = 10
  ) {
    const params = new URLSearchParams();
    if (weekCount) params.append('weekCount', weekCount.toString());
    if (reviewStatus) params.append('reviewStatus', reviewStatus.toString());
    params.append('current', current.toString());
    params.append('pageSize', pageSize.toString());

    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/original-task/reviewed?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reviewed tasks');
    }

    const result = await response.json();
    if (result.code !== 0) {
      throw new Error(result.message || 'Failed to fetch reviewed tasks');
    }

    return result.data;
  },

  /**
   * 获取任务详情
   */
  async getTaskDetail(id: number): Promise<OriginalTaskDetailVO> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/original-task/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch task detail');
    }

    const result = await response.json();
    if (result.code !== 0) {
      throw new Error(result.message || 'Failed to fetch task detail');
    }

    return result.data;
  },

  /**
   * 审核任务
   */
  async reviewTask(request: AdminReviewOriginalTaskRequest): Promise<boolean> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/original-task/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to review task');
    }

    const result = await response.json();
    if (result.code !== 0) {
      throw new Error(result.message || 'Failed to review task');
    }

    return result.data;
  },
};

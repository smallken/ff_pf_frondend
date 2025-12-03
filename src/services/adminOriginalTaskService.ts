import { API_CONFIG } from '../config/api';

export interface OriginalTaskDetailVO {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  contentLink: string;
  screenshot: string;
  browseNum: number;
  likeNum: number;
  commentNum: number;
  retweetNum: number;
  originalPoints: number;
  reviewStatus: number;
  reviewMessage: string;
  verifier: number;
  verifierName: string;
  weekCount: number;
  dateRange: string;
  ifAddTotal?: number;
  createTime: string;
  updateTime: string;
}

export interface WeeklyPlanStatLogVO {
  id: number;
  originalTaskId: number;
  userId: number;
  userName: string;
  userEmail: string;
  twitterUsername: string;
  weekCount: number;
  dateRange: string;
  addedPoints: number;
  weeklyPoints: number;
  totalPointsBefore: number;
  totalPointsAfter: number;
  userLevelAfter: number;
  createTime: string;
}

export interface AdminReviewOriginalTaskRequest {
  taskId: number;
  reviewStatus: number; // 1-通过，2-拒绝
  reviewMessage?: string;
  points?: number; // 审核通过时的积分
}

export interface OriginalTaskConfigVO {
  weekNumber: number;
  chineseTopic: string;
  englishTopic: string;
  uploadEnabled: boolean;
  updateTime: string;
}

export interface SaveOriginalTaskConfigRequest {
  weekNumber?: number;
  chineseTopic?: string;
  englishTopic?: string;
  uploadEnabled?: boolean;
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
   * 获取周计划统计日志
   */
  async listWeeklyPlanLogs(
    weekCount?: number,
    userId?: number,
    current: number = 1,
    pageSize: number = 10
  ) {
    const params = new URLSearchParams();
    if (weekCount !== undefined) params.append('weekCount', weekCount.toString());
    if (userId !== undefined) params.append('userId', userId.toString());
    params.append('current', current.toString());
    params.append('pageSize', pageSize.toString());

    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/original-task/plan-logs?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch weekly plan logs');
    }

    const result = await response.json();
    if (result.code !== 0) {
      throw new Error(result.message || 'Failed to fetch weekly plan logs');
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

  // ==================== 任务内容配置管理 ====================

  /**
   * 获取原创任务配置（公开接口）
   */
  async getTaskConfig(): Promise<OriginalTaskConfigVO> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/original-task/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch task config');
    }

    const result = await response.json();
    if (result.code !== 0) {
      throw new Error(result.message || 'Failed to fetch task config');
    }

    return result.data;
  },

  /**
   * 保存原创任务配置（管理员专用）
   */
  async saveTaskConfig(request: SaveOriginalTaskConfigRequest): Promise<boolean> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/original-task/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to save task config');
    }

    const result = await response.json();
    if (result.code !== 0) {
      throw new Error(result.message || 'Failed to save task config');
    }

    return result.data;
  },

  /**
   * 更新上传功能开关（管理员专用）
   */
  async updateUploadEnabled(enabled: boolean): Promise<boolean> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/original-task/config/upload-enabled?enabled=${enabled}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to update upload enabled setting');
    }

    const result = await response.json();
    if (result.code !== 0) {
      throw new Error(result.message || 'Failed to update upload enabled setting');
    }

    return result.data;
  },
};

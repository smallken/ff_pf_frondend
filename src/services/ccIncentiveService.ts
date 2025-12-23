import { API_CONFIG } from '../config/api';

// 任务类型常量
export const CC_TASK_TYPES = {
  GROUP_SIZE: 'ccGroupSizeTask',    // 群规模&拉新
  QQ_GROUP: 'ccQQGroupTask',        // 群内任务
  OUT_GROUP: 'ccOutGroupTask',      // 外群任务
  ORIGINAL: 'ccOriginalTask',       // 长期建设
} as const;

// 任务VO类型
export interface CcTaskVO {
  id: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  taskType: string;
  weekCount: number;
  dateRange: string;
  contentLink?: string;
  screenshot: string;
  reviewStatus: number;
  reviewMessage?: string;
  reviewerId?: number;
  reviewTime?: string;
  points: number;
  createTime: string;
  // 用于区分社区任务类型（根据taskType判断）
  communityType?: number; // 1-群内任务, 2-外群任务
}

// 任务概览VO
export interface CcTaskOverviewVO {
  currentWeek: number;
  dateRange: string;
  groupSizeSubmitted: number;
  groupSizeApproved: number;
  qqGroupSubmitted: number;
  qqGroupApproved: number;
  outGroupSubmitted: number;
  outGroupApproved: number;
  originalSubmitted: number;
  originalApproved: number;
  weeklyPoints: number;
  tasks: CcTaskVO[];
}

// 管理员任务列表VO
export interface CcAdminTaskListVO {
  currentWeek: number;
  dateRange: string;
  groupSizeTasks: CcTaskVO[];
  qqGroupTasks: CcTaskVO[];
  outGroupTasks: CcTaskVO[];
  originalTasks: CcTaskVO[];
}

// 任务提交请求
export interface CcTaskSubmitRequest {
  taskType: string;
  contentLink?: string;
  screenshotUrl: string;
}

// 任务审核请求
export interface CcTaskReviewRequest {
  taskId: number;
  reviewStatus: number;
  reviewMessage?: string;
  points?: number;
}

// 审核日志VO
export interface CcPointsLogVO {
  id: number;
  taskId: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  weekCount: number;
  dateRange: string;
  taskType: string;
  reviewStatus: number;
  reviewMessage?: string;
  points: number;
  createTime: string;
}

// 积分日志列表响应
export interface CcPointsLogListResponse {
  records: CcPointsLogVO[];
  total: number;
  page: number;
  pageSize: number;
}

// CC积分排行榜项
export interface CcPointsRankingItem {
  rank: number;
  userId: number;
  userName?: string;
  twitterUsername?: string;
  qqNumber?: string;
  qqGroup?: string;
  groupNumber?: string;
  weekCount: number;
  ccPoints: number;
  walletAddressSol?: string;
  walletAddressBsc?: string;
}

// CC积分排行榜响应
export interface CcPointsRankingResponse {
  records: CcPointsRankingItem[];
  weekCount: number;
  total: number;
}

/**
 * 群主激励计划API服务
 */
export const ccIncentiveService = {
  /**
   * 提交任务
   */
  async submitTask(request: CcTaskSubmitRequest): Promise<number> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/cc-incentive/task/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(request),
    });
    const data = await response.json();
    if (data.code !== 0) {
      throw new Error(data.message || '提交失败');
    }
    return data.data;
  },

  /**
   * 获取用户任务概览
   */
  async getMyTaskOverview(): Promise<CcTaskOverviewVO> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/cc-incentive/task/overview`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const data = await response.json();
    if (data.code !== 0) {
      throw new Error(data.message || '获取失败');
    }
    return data.data;
  },

  /**
   * 管理员获取任务列表
   */
  async getAdminTaskList(weekCount?: number, reviewStatus?: number): Promise<CcAdminTaskListVO> {
    const params = new URLSearchParams();
    if (weekCount !== undefined) params.append('weekCount', weekCount.toString());
    if (reviewStatus !== undefined) params.append('reviewStatus', reviewStatus.toString());
    
    const url = `${API_CONFIG.BASE_URL}/cc-incentive/admin/tasks${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const data = await response.json();
    if (data.code !== 0) {
      throw new Error(data.message || '获取失败');
    }
    return data.data;
  },

  /**
   * 管理员审核任务
   */
  async reviewTask(request: CcTaskReviewRequest): Promise<boolean> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/cc-incentive/admin/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(request),
    });
    const data = await response.json();
    if (data.code !== 0) {
      throw new Error(data.message || '审核失败');
    }
    return data.data;
  },

  /**
   * 管理员获取积分日志列表
   */
  async getPointsLogList(weekCount?: number, page: number = 1, pageSize: number = 10): Promise<CcPointsLogListResponse> {
    const params = new URLSearchParams();
    if (weekCount !== undefined) params.append('weekCount', weekCount.toString());
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    
    const url = `${API_CONFIG.BASE_URL}/cc-incentive/admin/points-log?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const data = await response.json();
    if (data.code !== 0) {
      throw new Error(data.message || '获取失败');
    }
    return data.data;
  },

  /**
   * 管理员获取CC积分排行榜
   */
  async getCcPointsRanking(weekCount?: number): Promise<CcPointsRankingResponse> {
    const params = new URLSearchParams();
    if (weekCount !== undefined) params.append('weekCount', weekCount.toString());
    
    const url = `${API_CONFIG.BASE_URL}/cc-incentive/admin/points-ranking?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const data = await response.json();
    if (data.code !== 0) {
      throw new Error(data.message || '获取失败');
    }
    return data.data;
  },
};

export default ccIncentiveService;

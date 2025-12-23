import { request } from '@/utils/request';
import { API_ENDPOINTS } from '@/config/api';
import type { AdminTaskListVO, AdminReviewTaskRequest } from '@/types/api';

export interface WeeklyRankingItem {
  rank?: number;
  id: number;
  userName: string;
  userEmail?: string;
  twitterUsername?: string;
  weeklyPoints?: number;
  userPoints?: number;
  walletAddress?: string;
  walletAddressSol?: string;
  walletAddressBsc?: string;
}

export interface WeeklyRankingResponse {
  weekCount?: number;
  records: WeeklyRankingItem[];
}

export const adminWeeklyChallengeService = {
  getWeeklyRanking: async (params: { weekCount?: number; limit?: number } = {}): Promise<WeeklyRankingResponse> => {
    const query = new URLSearchParams();
    if (params.weekCount !== undefined) {
      query.append('weekCount', params.weekCount.toString());
    }
    if (params.limit !== undefined) {
      query.append('limit', params.limit.toString());
    }
    const qs = query.toString();
    const url = `/admin/weekly-challenge/ranking${qs ? `?${qs}` : ''}`;
    return request.get<WeeklyRankingResponse>(url);
  },

  // 获取管理员任务列表（群主激励计划审核用）
  getAdminTaskList: async (params: { weekCount?: number; reviewStatus?: number } = {}): Promise<AdminTaskListVO> => {
    const query = new URLSearchParams();
    if (params.weekCount !== undefined) {
      query.append('weekCount', params.weekCount.toString());
    }
    if (params.reviewStatus !== undefined) {
      query.append('reviewStatus', params.reviewStatus.toString());
    }
    const qs = query.toString();
    const url = `${API_ENDPOINTS.ADMIN.WEEKLY_CHALLENGE.TASKS}${qs ? `?${qs}` : ''}`;
    return request.get<AdminTaskListVO>(url);
  },

  // 审核传播任务
  reviewCommunicationTask: async (data: AdminReviewTaskRequest): Promise<boolean> => {
    return request.post<boolean>(API_ENDPOINTS.ADMIN.WEEKLY_CHALLENGE.REVIEW_COMMUNICATION, data);
  },

  // 审核社群任务
  reviewCommunityTask: async (data: AdminReviewTaskRequest): Promise<boolean> => {
    return request.post<boolean>(API_ENDPOINTS.ADMIN.WEEKLY_CHALLENGE.REVIEW_COMMUNITY, data);
  },
};

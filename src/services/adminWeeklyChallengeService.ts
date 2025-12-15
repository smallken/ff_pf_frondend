import { request } from '@/utils/request';

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
};

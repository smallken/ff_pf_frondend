import { request } from '../utils/request';
import { API_CONFIG } from '../config/api';
import type { MonthlyRewardVO, MonthlyRewardStatsVO, MonthlyRewardProgress } from '../types/monthlyReward';

export const monthlyRewardService = {
  // 获取用户月度奖励进度
  async getMonthlyRewardProgress(): Promise<MonthlyRewardProgress> {
    return request.get('/monthly-reward/progress');
  },

  // 获取用户历史奖励记录
  async getMonthlyRewardHistory(page: number = 1, pageSize: number = 10): Promise<{
    records: MonthlyRewardVO[];
    total: number;
    current: number;
    size: number;
  }> {
    return request.get('/monthly-reward/history', {
      params: { page, pageSize }
    });
  },

  // 管理员：获取月度奖励统计
  async getMonthlyRewardStats(year?: number, month?: number): Promise<MonthlyRewardStatsVO> {
    return request.get('/monthly-reward/admin/stats', {
      params: { year, month }
    });
  },

  // 管理员：刷新月度奖励分数（已禁用，避免与增量累加逻辑冲突）
  async refreshMonthlyRewardScores(year?: number, month?: number): Promise<{
    success: boolean;
    message: string;
    processedUsers: number;
  }> {
    throw new Error('此接口已禁用，请使用增量累加逻辑');
  },

  // 管理员：获取待奖励用户列表（显式拼接查询参数，避免某些工具未正确序列化params）
  async getPendingRewardUsers(year?: number, month?: number): Promise<{
    records: Array<{
      userId: number;
      userName: string;
      userEmail: string;
      rewardLevel: string;
      rewardAmount: number;
      promotionScore: number;
      shortScore: number;
      longScore: number;
      communityScore: number;
      walletAddress?: string | null;
    }>;
    total: number;
  }> {
    const params = new URLSearchParams();
    if (typeof year === 'number') params.append('year', String(year));
    if (typeof month === 'number') params.append('month', String(month));

    const url = `${API_CONFIG.BASE_URL}/monthly-reward/admin/pending${params.toString() ? `?${params.toString()}` : ''}`;
    const resp = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!resp.ok) {
      throw new Error(`获取待奖励用户失败: ${resp.status} ${resp.statusText}`);
    }
    const json = await resp.json();
    if (json?.data) return json.data;
    throw new Error(json?.message || '获取待奖励用户失败');
  },

  // 管理员：标记已发奖励（支持单个或批量）
  async markAsPaid(userIds: number[], year: number, month: number): Promise<{
    success: boolean;
    message: string;
    successCount: number;
    errorCount: number;
  }> {
    return request.post('/monthly-reward/admin/mark-paid', {
      userIds,
      year,
      month,
    });
  },

  // 管理员：导出待奖励用户数据
  async exportPendingRewardUsers(year?: number, month?: number): Promise<Blob> {
    // 构建查询参数
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    
    // 使用配置的BASE_URL
    const url = `${API_CONFIG.BASE_URL}/monthly-reward/admin/export?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include', // 包含cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`导出失败: ${response.status} ${response.statusText}`);
    }
    
    return response.blob();
  },

  // 管理员：更新月度奖励记录
  async updateMonthlyReward(data: MonthlyRewardVO): Promise<boolean> {
    return request.put('/monthly-reward/admin/update', data);
  },

  // 管理员：保存或更新月度奖励记录
  async saveOrUpdateMonthlyReward(data: MonthlyRewardVO): Promise<boolean> {
    return request.post('/monthly-reward/admin/save-or-update', data);
  },

  // 获取用户的月度奖励记录（用于查找现有记录）
  async getMonthlyRewardsByUser(userId: number): Promise<MonthlyRewardVO[]> {
    return request.get(`/monthly-reward/admin/user/${userId}`);
  },

  // 累加用户月度奖励次数
  async incrementMonthlyRewardScores(data: {
    userId: number;
    year: number;
    month: number;
    promotionIncrement: number;
    shortIncrement: number;
    longIncrement: number;
    communityIncrement: number;
  }): Promise<boolean> {
    return request.post('/monthly-reward/admin/increment-scores', data);
  },

  // 管理员：获取有数据的年月列表
  async getAvailableYearMonths(): Promise<Array<{year: number; month: number}>> {
    return request.get('/monthly-reward/admin/available-months');
  },

  // 管理员：批量获取所有月份的奖励统计（优化版本）
  async getAllMonthlyStats(): Promise<MonthlyRewardStatsVO[]> {
    return request.get('/monthly-reward/admin/all-stats');
  }
};

import type { MonthlyRewardVO, MonthlyRewardStatsVO, MonthlyRewardProgress } from '../types/monthlyReward';
import { REWARD_LEVELS } from '../types/monthlyReward';
import mockUsersData from './mockUsersData';

// 模拟月度奖励进度数据
export const mockMonthlyRewardProgress: MonthlyRewardProgress = {
  promotionScore: 6,
  shortScore: 3,
  longScore: 1,
  communityScore: 2,
  currentLevel: REWARD_LEVELS.BASIC,
  nextLevel: REWARD_LEVELS.ADVANCED1,
  progress: {
    basic: 100,
    advanced1: 60,
    advanced2: 20,
    advanced3: 5
  }
};

// 模拟历史奖励记录
export const mockMonthlyRewardHistory: MonthlyRewardVO[] = [
  {
    id: 1,
    userId: 1,
    rewardYear: 2024,
    rewardMonth: 11,
    promotionScore: 5,
    shortScore: 2,
    longScore: 0,
    communityScore: 1,
    rewardLevel: REWARD_LEVELS.BASIC,
    rewardAmount: 10,
    isCalculated: 1,
    isPaid: 1,
    paidTime: '2024-12-01T10:00:00Z',
    createTime: '2024-11-30T23:59:59Z',
    updateTime: '2024-12-01T10:00:00Z'
  },
  {
    id: 2,
    userId: 1,
    rewardYear: 2024,
    rewardMonth: 10,
    promotionScore: 8,
    shortScore: 4,
    longScore: 0,
    communityScore: 2,
    rewardLevel: REWARD_LEVELS.ADVANCED1,
    rewardAmount: 50,
    isCalculated: 1,
    isPaid: 1,
    paidTime: '2024-11-01T10:00:00Z',
    createTime: '2024-10-31T23:59:59Z',
    updateTime: '2024-11-01T10:00:00Z'
  },
  {
    id: 3,
    userId: 1,
    rewardYear: 2024,
    rewardMonth: 9,
    promotionScore: 3,
    shortScore: 1,
    longScore: 0,
    communityScore: 1,
    rewardLevel: REWARD_LEVELS.BASIC,
    rewardAmount: 10,
    isCalculated: 1,
    isPaid: 0,
    createTime: '2024-09-30T23:59:59Z',
    updateTime: '2024-09-30T23:59:59Z'
  }
];

// 模拟月度奖励统计数据
export const mockMonthlyRewardStats: MonthlyRewardStatsVO = {
  id: 1,
  rewardYear: 2024,
  rewardMonth: 12,
  totalRewardAmount: 1500.00,
  totalRewardedUsers: 25,
  pendingRewardAmount: 800.00,
  pendingRewardedUsers: 12,
  basicLevelUsers: 15,
  advanced1LevelUsers: 8,
  advanced2LevelUsers: 2,
  advanced3LevelUsers: 0,
  createTime: '2024-12-01T00:00:00Z',
  updateTime: '2024-12-01T00:00:00Z'
};

// 模拟待奖励用户列表
export const mockPendingRewardUsers = [
  {
    userId: 1,
    userName: '张三',
    userEmail: 'zhangsan@example.com',
    rewardLevel: REWARD_LEVELS.BASIC,
    rewardAmount: 10,
    promotionScore: 4,
    shortScore: 2,
    longScore: 0,
    communityScore: 1
  },
  {
    userId: 2,
    userName: '李四',
    userEmail: 'lisi@example.com',
    rewardLevel: REWARD_LEVELS.ADVANCED1,
    rewardAmount: 50,
    promotionScore: 8,
    shortScore: 4,
    longScore: 0,
    communityScore: 2
  },
  {
    userId: 3,
    userName: '王五',
    userEmail: 'wangwu@example.com',
    rewardLevel: REWARD_LEVELS.ADVANCED2,
    rewardAmount: 100,
    promotionScore: 10,
    shortScore: 8,
    longScore: 1,
    communityScore: 3
  }
];

// 模拟API响应延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟月度奖励服务
export const mockMonthlyRewardService = {
  // 获取用户月度奖励进度
  async getMonthlyRewardProgress(): Promise<MonthlyRewardProgress> {
    await delay(500);
    return mockMonthlyRewardProgress;
  },

  // 获取用户历史奖励记录
  async getMonthlyRewardHistory(page: number = 1, pageSize: number = 10): Promise<{
    records: MonthlyRewardVO[];
    total: number;
    current: number;
    size: number;
  }> {
    await delay(300);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      records: mockMonthlyRewardHistory.slice(start, end),
      total: mockMonthlyRewardHistory.length,
      current: page,
      size: pageSize
    };
  },

  // 获取所有用户数据（新增）
  async getAllUsersData(): Promise<MonthlyRewardVO[]> {
    await delay(300);
    return mockUsersData;
  },

  // 根据用户ID获取用户数据（新增）
  async getUserDataById(userId: number): Promise<MonthlyRewardVO | null> {
    await delay(200);
    return mockUsersData.find(user => user.userId === userId) || null;
  },

  // 管理员：获取月度奖励统计
  async getMonthlyRewardStats(year?: number, month?: number): Promise<MonthlyRewardStatsVO> {
    await delay(400);
    return mockMonthlyRewardStats;
  },

  // 管理员：刷新月度奖励分数
  async refreshMonthlyRewardScores(year?: number, month?: number): Promise<{
    success: boolean;
    message: string;
    processedUsers: number;
  }> {
    await delay(2000);
    return {
      success: true,
      message: '奖励分数刷新成功',
      processedUsers: 45
    };
  },

  // 管理员：获取待奖励用户列表
  async getPendingRewardUsers(year?: number, month?: number): Promise<{
    records: typeof mockPendingRewardUsers;
    total: number;
  }> {
    await delay(300);
    return {
      records: mockPendingRewardUsers,
      total: mockPendingRewardUsers.length
    };
  },

  // 管理员：导出待奖励用户数据
  async exportPendingRewardUsers(year?: number, month?: number): Promise<Blob> {
    await delay(1000);
    // 创建一个简单的CSV内容
    const csvContent = `用户ID,用户名,邮箱,奖励等级,奖励金额,传播类分数,短篇原创分数,长篇原创分数,社区类分数
${mockPendingRewardUsers.map(user => 
  `${user.userId},${user.userName},${user.userEmail},${user.rewardLevel},${user.rewardAmount},${user.promotionScore},${user.shortScore},${user.longScore},${user.communityScore}`
).join('\n')}`;
    
    return new Blob([csvContent], { type: 'text/csv' });
  }
};

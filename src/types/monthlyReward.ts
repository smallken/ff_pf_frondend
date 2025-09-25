// 月度奖励相关类型定义

export interface MonthlyRewardVO {
  id: number | null;
  userId: number;
  rewardYear: number;
  rewardMonth: number;
  promotionScore: number;
  shortScore: number;
  longScore: number;
  communityScore: number;
  rewardLevel: string;
  rewardAmount: number;
  isCalculated: number; // 0-未计算，1-已计算
  isPaid: number; // 0-未发放，1-已发放
  paidTime?: string;
  createTime: string;
  updateTime: string;
}

export interface MonthlyRewardStatsVO {
  id: number;
  rewardYear: number;
  rewardMonth: number;
  totalRewardAmount: number;
  totalRewardedUsers: number;
  pendingRewardAmount: number;
  pendingRewardedUsers: number;
  basicLevelUsers: number;
  advanced1LevelUsers: number;
  advanced2LevelUsers: number;
  advanced3LevelUsers: number;
  createTime: string;
  updateTime: string;
}

export interface MonthlyRewardProgress {
  promotionScore: number;
  shortScore: number;
  longScore: number;
  communityScore: number;
  currentLevel: string;
  nextLevel?: string;
  progress: {
    basic: number;
    advanced1: number;
    advanced2: number;
    advanced3: number;
  };
}

// 奖励等级定义
export const REWARD_LEVELS = {
  BASIC: 'basic',
  ADVANCED1: 'advanced1',
  ADVANCED2: 'advanced2',
  ADVANCED3: 'advanced3'
} as const;

// 奖励等级要求
export const REWARD_REQUIREMENTS = {
  [REWARD_LEVELS.BASIC]: {
    promotion: 4,
    short: 2,
    long: 0,
    community: 1,
    amount: 10
  },
  [REWARD_LEVELS.ADVANCED1]: {
    promotion: 8,
    short: 4,
    long: 0,
    community: 2,
    amount: 50
  },
  [REWARD_LEVELS.ADVANCED2]: {
    promotion: 10,
    short: 8,
    long: 1,
    community: 3,
    amount: 100
  },
  [REWARD_LEVELS.ADVANCED3]: {
    promotion: 12,
    short: 12,
    long: 3,
    community: 4,
    amount: 200
  }
} as const;

// 奖励等级名称
export const REWARD_LEVEL_NAMES = {
  [REWARD_LEVELS.BASIC]: {
    zh: '基础级别',
    en: 'Basic Level'
  },
  [REWARD_LEVELS.ADVANCED1]: {
    zh: '进阶一',
    en: 'Advanced I'
  },
  [REWARD_LEVELS.ADVANCED2]: {
    zh: '进阶二',
    en: 'Advanced II'
  },
  [REWARD_LEVELS.ADVANCED3]: {
    zh: '进阶三',
    en: 'Advanced III'
  }
} as const;

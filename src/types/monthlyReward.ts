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

// 奖励等级要求（根据月度激励规则）
export const REWARD_REQUIREMENTS = {
  [REWARD_LEVELS.BASIC]: {
    // 基础任务完成 - 10U/月
    // 传播类：每月≥4次，短篇原创：每月≥3条，社区类：每月≥2次
    promotion: 4,
    short: 3,
    long: 0,
    community: 2,
    amount: 10
  },
  [REWARD_LEVELS.ADVANCED1]: {
    // 进阶 I - 50U/月
    // 传播类：每月≥8次，短篇原创：每月≥6条，长篇原创：每月≥1篇，社区类：每月≥3次
    promotion: 8,
    short: 6,
    long: 1,
    community: 3,
    amount: 50
  },
  [REWARD_LEVELS.ADVANCED2]: {
    // 进阶 II - 100U/月
    // 传播类：每月≥10次，短篇原创：每月≥8条，长篇原创：每月≥2篇，社区类：每月≥4次
    promotion: 10,
    short: 8,
    long: 2,
    community: 4,
    amount: 100
  },
  [REWARD_LEVELS.ADVANCED3]: {
    // 进阶 III - 200U/月
    // 传播类：每月≥12次，短篇原创：每月≥12条，长篇原创：每月≥6篇，社区类：每月≥5次
    promotion: 12,
    short: 12,
    long: 6,
    community: 5,
    amount: 200
  }
} as const;

// 奖励等级名称
export const REWARD_LEVEL_NAMES = {
  [REWARD_LEVELS.BASIC]: {
    zh: '基础任务完成',
    en: 'Basic Tasks Complete'
  },
  [REWARD_LEVELS.ADVANCED1]: {
    zh: '进阶 I',
    en: 'Advanced I'
  },
  [REWARD_LEVELS.ADVANCED2]: {
    zh: '进阶 II',
    en: 'Advanced II'
  },
  [REWARD_LEVELS.ADVANCED3]: {
    zh: '进阶 III',
    en: 'Advanced III'
  }
} as const;

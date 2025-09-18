'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { mockMonthlyRewardService, mockMonthlyRewardProgress } from '../../services/mockMonthlyRewardService';
import type { MonthlyRewardProgress } from '../../types/monthlyReward';
import { REWARD_LEVELS, REWARD_REQUIREMENTS, REWARD_LEVEL_NAMES } from '../../types/monthlyReward';

interface ProgressBarProps {
  label: string;
  current: number;
  required: number;
  color: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, current, required, color }) => {
  const percentage = Math.min((current / required) * 100, 100);
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {current}/{required}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {percentage.toFixed(1)}% 完成
      </div>
    </div>
  );
};

interface LevelCardProps {
  level: string;
  progress: number;
  isCurrent: boolean;
  isAchieved: boolean;
}

const LevelCard: React.FC<LevelCardProps> = ({ level, progress, isCurrent, isAchieved }) => {
  const getLevelColor = () => {
    if (isAchieved) return 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700';
    if (isCurrent) return 'bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700';
    return 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600';
  };

  const getTextColor = () => {
    if (isAchieved) return 'text-green-800 dark:text-green-200';
    if (isCurrent) return 'text-blue-800 dark:text-blue-200';
    return 'text-gray-600 dark:text-gray-400';
  };

  const requirements = REWARD_REQUIREMENTS[level as keyof typeof REWARD_REQUIREMENTS];
  const levelName = REWARD_LEVEL_NAMES[level as keyof typeof REWARD_LEVEL_NAMES];

  return (
    <div className={`p-4 rounded-lg border-2 ${getLevelColor()}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className={`font-semibold ${getTextColor()}`}>{levelName}</h3>
        <span className={`text-sm font-bold ${getTextColor()}`}>
          {requirements.amount} USDT
        </span>
      </div>
      
      <div className="space-y-2">
        {requirements.promotion > 0 && (
          <div className="text-xs">
            <span className={getTextColor()}>传播类: {requirements.promotion}</span>
          </div>
        )}
        {requirements.short > 0 && (
          <div className="text-xs">
            <span className={getTextColor()}>短篇原创: {requirements.short}</span>
          </div>
        )}
        {requirements.long > 0 && (
          <div className="text-xs">
            <span className={getTextColor()}>长篇原创: {requirements.long}</span>
          </div>
        )}
        {requirements.community > 0 && (
          <div className="text-xs">
            <span className={getTextColor()}>社区类: {requirements.community}</span>
          </div>
        )}
      </div>
      
      <div className="mt-3">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              isAchieved ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className={`text-xs mt-1 ${getTextColor()}`}>
          {progress.toFixed(1)}% 完成
        </div>
      </div>
    </div>
  );
};

export default function MockMonthlyRewardProgress() {
  const { t } = useLanguage();
  const [progress, setProgress] = useState<MonthlyRewardProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const data = await mockMonthlyRewardService.getMonthlyRewardProgress();
      setProgress(data);
    } catch (err: any) {
      console.error('获取月度奖励进度失败:', err);
      setError(err.message || '获取月度奖励进度失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          月度奖励进度 (模拟数据)
        </h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">加载中...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          月度奖励进度 (模拟数据)
        </h2>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  if (!progress) {
    return null;
  }

  const calculateLevelProgress = (level: string) => {
    const requirements = REWARD_REQUIREMENTS[level as keyof typeof REWARD_REQUIREMENTS];
    let totalRequired = 0;
    let totalCurrent = 0;

    if (requirements.promotion > 0) {
      totalRequired += requirements.promotion;
      totalCurrent += Math.min(progress.promotionScore, requirements.promotion);
    }
    if (requirements.short > 0) {
      totalRequired += requirements.short;
      totalCurrent += Math.min(progress.shortScore, requirements.short);
    }
    if (requirements.long > 0) {
      totalRequired += requirements.long;
      totalCurrent += Math.min(progress.longScore, requirements.long);
    }
    if (requirements.community > 0) {
      totalRequired += requirements.community;
      totalCurrent += Math.min(progress.communityScore, requirements.community);
    }

    return totalRequired > 0 ? (totalCurrent / totalRequired) * 100 : 0;
  };

  const isLevelAchieved = (level: string) => {
    const requirements = REWARD_REQUIREMENTS[level as keyof typeof REWARD_REQUIREMENTS];
    return (
      progress.promotionScore >= requirements.promotion &&
      progress.shortScore >= requirements.short &&
      progress.longScore >= requirements.long &&
      progress.communityScore >= requirements.community
    );
  };

  const getCurrentLevel = () => {
    if (isLevelAchieved(REWARD_LEVELS.ADVANCED3)) return REWARD_LEVELS.ADVANCED3;
    if (isLevelAchieved(REWARD_LEVELS.ADVANCED2)) return REWARD_LEVELS.ADVANCED2;
    if (isLevelAchieved(REWARD_LEVELS.ADVANCED1)) return REWARD_LEVELS.ADVANCED1;
    if (isLevelAchieved(REWARD_LEVELS.BASIC)) return REWARD_LEVELS.BASIC;
    return null;
  };

  const currentLevel = getCurrentLevel();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          月度奖励进度 (模拟数据)
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().getFullYear()}年{new Date().getMonth() + 1}月
        </div>
      </div>

      {/* 当前分数显示 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {progress.promotionScore}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">传播类</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {progress.shortScore}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">短篇原创</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {progress.longScore}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">长篇原创</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {progress.communityScore}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">社区类</div>
        </div>
      </div>

      {/* 奖励等级卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <LevelCard
          level={REWARD_LEVELS.BASIC}
          progress={calculateLevelProgress(REWARD_LEVELS.BASIC)}
          isCurrent={currentLevel === REWARD_LEVELS.BASIC}
          isAchieved={isLevelAchieved(REWARD_LEVELS.BASIC)}
        />
        <LevelCard
          level={REWARD_LEVELS.ADVANCED1}
          progress={calculateLevelProgress(REWARD_LEVELS.ADVANCED1)}
          isCurrent={currentLevel === REWARD_LEVELS.ADVANCED1}
          isAchieved={isLevelAchieved(REWARD_LEVELS.ADVANCED1)}
        />
        <LevelCard
          level={REWARD_LEVELS.ADVANCED2}
          progress={calculateLevelProgress(REWARD_LEVELS.ADVANCED2)}
          isCurrent={currentLevel === REWARD_LEVELS.ADVANCED2}
          isAchieved={isLevelAchieved(REWARD_LEVELS.ADVANCED2)}
        />
        <LevelCard
          level={REWARD_LEVELS.ADVANCED3}
          progress={calculateLevelProgress(REWARD_LEVELS.ADVANCED3)}
          isCurrent={currentLevel === REWARD_LEVELS.ADVANCED3}
          isAchieved={isLevelAchieved(REWARD_LEVELS.ADVANCED3)}
        />
      </div>

      {/* 当前等级显示 */}
      {currentLevel && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                当前等级: {REWARD_LEVEL_NAMES[currentLevel as keyof typeof REWARD_LEVEL_NAMES]}
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                奖励金额: {REWARD_REQUIREMENTS[currentLevel as keyof typeof REWARD_REQUIREMENTS].amount} USDT
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

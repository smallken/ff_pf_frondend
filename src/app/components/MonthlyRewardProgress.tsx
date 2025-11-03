'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { monthlyRewardService } from '../../services/monthlyRewardService';
import type { MonthlyRewardProgress } from '../../types/monthlyReward';
import { REWARD_LEVELS, REWARD_REQUIREMENTS, REWARD_LEVEL_NAMES } from '../../types/monthlyReward';

const LEVEL_SEQUENCE = [
  REWARD_LEVELS.BASIC,
  REWARD_LEVELS.ADVANCED1,
  REWARD_LEVELS.ADVANCED2,
  REWARD_LEVELS.ADVANCED3
] as const;

type LevelType = typeof LEVEL_SEQUENCE[number];

const isLevelType = (level: string): level is LevelType => {
  return (LEVEL_SEQUENCE as readonly string[]).includes(level);
};

interface ProgressBarProps {
  label: string;
  current: number;
  required: number;
  color: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, current, required, color }) => {
  const { t } = useLanguage();
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
        {percentage.toFixed(1)}% {t('monthly.progress.complete')}
      </div>
    </div>
  );
};

interface LevelCardProps {
  level: LevelType;
  progress: number;
  isCurrent: boolean;
  isAchieved: boolean;
}

const LevelCard: React.FC<LevelCardProps> = ({ level, progress, isCurrent, isAchieved }) => {
  const { t, language } = useLanguage();
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
  const levelNameData = REWARD_LEVEL_NAMES[level as keyof typeof REWARD_LEVEL_NAMES];
  const levelName = levelNameData[language as keyof typeof levelNameData];

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
            <span className={getTextColor()}>
              {t('monthly.progress.promotion')}: {t('monthly.progress.need')} {requirements.promotion}
            </span>
          </div>
        )}
        {requirements.short > 0 && (
          <div className="text-xs">
            <span className={getTextColor()}>
              {t('monthly.progress.short')}: {t('monthly.progress.need')} {requirements.short}
            </span>
          </div>
        )}
        {requirements.long > 0 && (
          <div className="text-xs">
            <span className={getTextColor()}>
              {t('monthly.progress.long')}: {t('monthly.progress.need')} {requirements.long}
            </span>
          </div>
        )}
        {requirements.community > 0 && (
          <div className="text-xs">
            <span className={getTextColor()}>
              {t('monthly.progress.community')}: {t('monthly.progress.need')} {requirements.community}
            </span>
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
          {progress.toFixed(1)}% {t('monthly.progress.complete')}
        </div>
      </div>
    </div>
  );
};

export default function MonthlyRewardProgress() {
  const { t, language } = useLanguage();
  const [progress, setProgress] = useState<MonthlyRewardProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const data = await monthlyRewardService.getMonthlyRewardProgress();
      setProgress(data);
    } catch (err: any) {
      console.error(`获取${t('monthly.progress.title')}失败:`, err);
      setError(err.message || `获取${t('monthly.progress.title')}失败`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('monthly.progress.title')}
        </h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">{t('monthly.progress.loading')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('monthly.progress.title')}
        </h2>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('monthly.progress.title')}
        </h2>
        <div className="text-center py-8">
          <div className="text-gray-500 dark:text-gray-400 mb-2">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">{t('monthly.progress.no.data') || '暂无月度激励进度数据'}</p>
        </div>
      </div>
    );
  }

  const clampPercentage = (value: number) => Math.min(Math.max(value, 0), 100);

  const normalizeLevel = (level?: string | null): LevelType | null => {
    if (!level) return null;
    const lower = level.toLowerCase();
    return isLevelType(lower) ? lower : null;
  };

  const calculateLevelProgressFromScores = (level: LevelType) => {
    const requirements = REWARD_REQUIREMENTS[level];
    let totalRequired = 0;
    let totalCurrent = 0;

    const accumulate = (required: number, currentValue: number | undefined | null) => {
      if (required <= 0) return;
      const safeCurrent = typeof currentValue === 'number' && !Number.isNaN(currentValue) ? currentValue : 0;
      totalRequired += required;
      totalCurrent += Math.min(safeCurrent, required);
    };

    accumulate(requirements.promotion, progress.promotionScore);
    accumulate(requirements.short, progress.shortScore);
    accumulate(requirements.long, progress.longScore);
    accumulate(requirements.community, progress.communityScore);

    return totalRequired > 0 ? (totalCurrent / totalRequired) * 100 : 0;
  };

  const calculateLevelProgress = (level: LevelType) => {
    const backendProgressValue = progress.progress?.[level];
    if (typeof backendProgressValue === 'number' && !Number.isNaN(backendProgressValue)) {
      return clampPercentage(backendProgressValue);
    }
    return clampPercentage(calculateLevelProgressFromScores(level));
  };

  const isLevelAchievedByScores = (level: LevelType) => {
    const requirements = REWARD_REQUIREMENTS[level];
    const ensureNumber = (value: number | undefined | null) => (typeof value === 'number' && !Number.isNaN(value) ? value : 0);
    return (
      ensureNumber(progress.promotionScore) >= requirements.promotion &&
      ensureNumber(progress.shortScore) >= requirements.short &&
      ensureNumber(progress.longScore) >= requirements.long &&
      ensureNumber(progress.communityScore) >= requirements.community
    );
  };

  const currentLevelFromBackend = normalizeLevel(progress.currentLevel);

  const deriveCurrentLevel = (): LevelType | null => {
    if (currentLevelFromBackend) {
      return currentLevelFromBackend;
    }
    for (let i = LEVEL_SEQUENCE.length - 1; i >= 0; i -= 1) {
      if (isLevelAchievedByScores(LEVEL_SEQUENCE[i])) {
        return LEVEL_SEQUENCE[i];
      }
    }
    return null;
  };

  const currentLevel = deriveCurrentLevel();

  const isLevelAchieved = (level: LevelType) => {
    const percentage = calculateLevelProgress(level);
    if (!Number.isNaN(percentage) && percentage >= 100) {
      return true;
    }
    if (currentLevel) {
      const currentIndex = LEVEL_SEQUENCE.indexOf(currentLevel);
      const targetIndex = LEVEL_SEQUENCE.indexOf(level);
      if (currentIndex >= 0 && targetIndex >= 0) {
        return currentIndex >= targetIndex;
      }
    }
    return isLevelAchievedByScores(level);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t('monthly.progress.title')}
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {language === 'zh' ? `${new Date().getFullYear()}年${new Date().getMonth() + 1}月` : `${new Date().getMonth() + 1}/${new Date().getFullYear()}`}
        </div>
      </div>

      {/* 当前分数显示 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {progress.promotionScore}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('monthly.progress.promotion')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {progress.shortScore}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('monthly.progress.short')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {progress.longScore}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('monthly.progress.long')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {progress.communityScore}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('monthly.progress.community')}</div>
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
                {t('monthly.progress.current.level')}: {REWARD_LEVEL_NAMES[currentLevel as keyof typeof REWARD_LEVEL_NAMES]?.[language as 'zh' | 'en'] || currentLevel}
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {t('monthly.progress.reward.amount')}: {REWARD_REQUIREMENTS[currentLevel as keyof typeof REWARD_REQUIREMENTS].amount} USDT
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

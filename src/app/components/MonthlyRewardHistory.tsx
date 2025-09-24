'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { monthlyRewardService } from '../../services/monthlyRewardService';
import type { MonthlyRewardVO } from '../../types/monthlyReward';
import { REWARD_LEVEL_NAMES } from '../../types/monthlyReward';

interface MonthlyRewardHistoryProps {
  pageSize?: number;
}

export default function MonthlyRewardHistory({ pageSize = 10 }: MonthlyRewardHistoryProps) {
  const { t, language } = useLanguage();
  const [rewards, setRewards] = useState<MonthlyRewardVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchRewardHistory();
  }, [currentPage]);

  const fetchRewardHistory = async () => {
    try {
      setLoading(true);
      const response = await monthlyRewardService.getMonthlyRewardHistory(currentPage, pageSize);
      setRewards(response.records);
      setTotal(response.total);
    } catch (err: any) {
      console.error('获取历史奖励记录失败:', err);
      setError(err.message || '获取历史奖励记录失败');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (isPaid: boolean) => {
    return isPaid 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
  };

  const getStatusText = (isPaid: boolean) => {
    return isPaid ? (language === 'zh' ? '已发放' : 'Paid') : (language === 'zh' ? '待发放' : 'Pending');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalPages = Math.ceil(total / pageSize);

  if (loading && rewards.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {language === 'zh' ? '历史奖励记录' : 'Historical Reward Records'}
        </h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">{language === 'zh' ? '加载中...' : 'Loading...'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {language === 'zh' ? '历史奖励记录' : 'Historical Reward Records'}
      </h2>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4">
          <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
        </div>
      )}

      {rewards.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 dark:text-gray-400 mb-2">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">{language === 'zh' ? '暂无奖励记录' : 'No reward records'}</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {language === 'zh' ? '奖励月份' : 'Reward Month'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {language === 'zh' ? '奖励等级' : 'Reward Level'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {language === 'zh' ? '分数详情' : 'Score Details'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {language === 'zh' ? '奖励金额' : 'Reward Amount'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {language === 'zh' ? '状态' : 'Status'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {language === 'zh' ? '发放时间' : 'Issuance Time'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {rewards.map((reward) => (
                  <tr key={reward.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {language === 'zh' ? `${reward.rewardYear}年${reward.rewardMonth}月` : `${reward.rewardMonth}/${reward.rewardYear}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                        {(() => {
                          const levelNameData = REWARD_LEVEL_NAMES[reward.rewardLevel as keyof typeof REWARD_LEVEL_NAMES];
                          return levelNameData ? levelNameData[language as keyof typeof levelNameData] : reward.rewardLevel;
                        })()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="space-y-1">
                        <div className="flex space-x-4 text-xs">
                          <span>{language === 'zh' ? '传播' : 'Promotion'}: {reward.promotionScore}</span>
                          <span>{language === 'zh' ? '短篇' : 'Short'}: {reward.shortScore}</span>
                          <span>{language === 'zh' ? '长篇' : 'Long'}: {reward.longScore}</span>
                          <span>{language === 'zh' ? '社区' : 'Community'}: {reward.communityScore}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                      {reward.rewardAmount} USDT
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(reward.isPaid)}`}>
                        {getStatusText(reward.isPaid)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {reward.paidTime ? formatDate(reward.paidTime) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {language === 'zh' ? `显示第 ${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, total)} 条，共 ${total} 条记录` : `Showing ${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, total)} of ${total} records`}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {language === 'zh' ? '上一页' : 'Previous'}
                </button>
                <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {language === 'zh' ? '下一页' : 'Next'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

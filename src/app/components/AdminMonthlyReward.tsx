'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { monthlyRewardService } from '../../services/monthlyRewardService';
import type { MonthlyRewardStatsVO } from '../../types/monthlyReward';
import { REWARD_LEVEL_NAMES } from '../../types/monthlyReward';

export default function AdminMonthlyReward() {
  const { t, language } = useLanguage();
  const [stats, setStats] = useState<MonthlyRewardStatsVO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [historicalRewards, setHistoricalRewards] = useState<any[]>([]);
  const [historicalLoading, setHistoricalLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [historicalPendingUsers, setHistoricalPendingUsers] = useState<any[]>([]);
  const [historicalPendingLoading, setHistoricalPendingLoading] = useState(false);
  const [selectedHistoricalYear, setSelectedHistoricalYear] = useState(new Date().getFullYear());
  const [selectedHistoricalMonth, setSelectedHistoricalMonth] = useState(new Date().getMonth() + 1);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [availableYearMonths, setAvailableYearMonths] = useState<{year: number, month: number}[]>([]);
  const [selectedHistoricalUsers, setSelectedHistoricalUsers] = useState<Set<number>>(new Set());

  // 获取当前年月
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    fetchStats();
    fetchPendingUsers();
    fetchHistoricalRewards();
    fetchAvailableYearMonths();
    fetchHistoricalPendingUsers();
  }, []);

  useEffect(() => {
    fetchHistoricalPendingUsers();
  }, [selectedHistoricalYear, selectedHistoricalMonth]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await monthlyRewardService.getMonthlyRewardStats(currentYear, currentMonth);
      setStats(data);
    } catch (err: any) {
      console.error('获取月度奖励统计失败:', err);
      setError(err.message || '获取月度奖励统计失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      setPendingLoading(true);
      const response = await monthlyRewardService.getPendingRewardUsers(currentYear, currentMonth);
      setPendingUsers(response.records);
    } catch (err: any) {
      console.error('获取待奖励用户失败:', err);
    } finally {
      setPendingLoading(false);
    }
  };

  const fetchHistoricalRewards = async () => {
    try {
      setHistoricalLoading(true);
      // 🚀 优化：使用批量API一次性获取所有月份的统计数据
      const allStats = await monthlyRewardService.getAllMonthlyStats();
      
      // 转换数据格式，确保数值类型正确
      const historicalData = allStats.map(data => ({
        year: data.rewardYear,
        month: data.rewardMonth,
        totalRewardAmount: data.totalRewardAmount ?? 0,
        totalRewardedUsers: data.totalRewardedUsers ?? 0,
        pendingRewardAmount: data.pendingRewardAmount ?? 0,
        pendingRewardedUsers: data.pendingRewardedUsers ?? 0,
        basicLevelUsers: data.basicLevelUsers ?? 0,
        advanced1LevelUsers: data.advanced1LevelUsers ?? 0,
        advanced2LevelUsers: data.advanced2LevelUsers ?? 0,
        advanced3LevelUsers: data.advanced3LevelUsers ?? 0
      }));
      
      setHistoricalRewards(historicalData);
    } catch (err: any) {
      console.error('获取历史奖励数据失败:', err);
    } finally {
      setHistoricalLoading(false);
    }
  };

  const fetchAvailableYearMonths = async () => {
    try {
      const data = await monthlyRewardService.getAvailableYearMonths();
      setAvailableYearMonths(data);
      // 自动选择第一个有数据的年月
      if (data.length > 0) {
        setSelectedHistoricalYear(data[0].year);
        setSelectedHistoricalMonth(data[0].month);
      }
    } catch (err: any) {
      console.error('获取可用年月列表失败:', err);
    }
  };

  const fetchHistoricalPendingUsers = async () => {
    try {
      setHistoricalPendingLoading(true);
      const response = await monthlyRewardService.getPendingRewardUsers(selectedHistoricalYear, selectedHistoricalMonth);
      setHistoricalPendingUsers(response.records);
      // 清空选择
      setSelectedHistoricalUsers(new Set());
    } catch (err: any) {
      console.error('获取历史待奖励用户失败:', err);
    } finally {
      setHistoricalPendingLoading(false);
    }
  };

  // 已禁用刷新功能，避免与增量累加逻辑冲突
  // const handleRefreshScores = async () => {
  //   // 此功能已禁用
  // };

  const handleExportPendingUsers = async () => {
    try {
      const blob = await monthlyRewardService.exportPendingRewardUsers(currentYear, currentMonth);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `待奖励用户_${currentYear}年${currentMonth}月.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('导出失败:', err);
      alert('导出失败：' + (err.message || '未知错误'));
    }
  };

  const handleDownloadAllRewards = async () => {
    try {
      // 这里可以调用一个新的API来下载所有奖励详情
      // 暂时使用当前月份的导出功能
      const blob = await monthlyRewardService.exportPendingRewardUsers(currentYear, currentMonth);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `所有奖励详情_${new Date().toISOString().slice(0, 7)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('下载所有奖励详情失败:', err);
      alert('下载失败：' + (err.message || '未知错误'));
    }
  };

  // 下载历史月份待奖励用户列表
  const handleDownloadHistoricalUsers = async () => {
    try {
      const blob = await monthlyRewardService.exportPendingRewardUsers(selectedHistoricalYear, selectedHistoricalMonth);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `待奖励用户_${selectedHistoricalYear}年${selectedHistoricalMonth}月.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('下载失败:', err);
      alert('下载失败：' + (err.message || '未知错误'));
    }
  };

  // 下载指定月份的奖励数据
  const handleDownloadMonthReward = async (year: number, month: number) => {
    try {
      const blob = await monthlyRewardService.exportPendingRewardUsers(year, month);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `月度奖励_${year}年${month}月.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('下载失败:', err);
      alert('下载失败：' + (err.message || '未知错误'));
    }
  };

  // 下载所有月份的奖励数据
  const handleDownloadAllMonthRewards = async () => {
    try {
      if (historicalRewards.length === 0) {
        alert('暂无数据可下载');
        return;
      }
      
      // 依次下载每个月份的数据
      for (const reward of historicalRewards) {
        await handleDownloadMonthReward(reward.year, reward.month);
        // 添加延迟避免下载过快
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      alert(`成功下载 ${historicalRewards.length} 个月份的数据`);
    } catch (err: any) {
      console.error('批量下载失败:', err);
      alert('批量下载失败：' + (err.message || '未知错误'));
    }
  };

  // 批量选择相关方法
  const handleSelectUser = (userId: number) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === pendingUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(pendingUsers.map(user => user.userId)));
    }
  };

  const handleMarkAsPaid = async (userId?: number) => {
    try {
      setMarkingPaid(true);
      const userIds = userId ? [userId] : Array.from(selectedUsers);
      
      if (userIds.length === 0) {
        alert(language === 'zh' ? '请选择要标记的用户' : 'Please select users to mark');
        return;
      }

      // 二次确认
      if (!confirm(language === 'zh' ? `确认将选中的 ${userIds.length} 位用户标记为已发奖励吗？` : `Confirm marking ${userIds.length} user(s) as paid?`)) {
        return;
      }

      // 调用服务
      const result = await monthlyRewardService.markAsPaid(userIds, currentYear, currentMonth);

      if (result && result.success !== false) {
        alert(language === 'zh' ? `成功标记 ${userIds.length} 个用户为已发奖励` : `Successfully marked ${userIds.length} user(s) as paid`);
        setSelectedUsers(new Set());
        fetchStats();
        fetchPendingUsers();
      } else {
        throw new Error(result?.message || (language === 'zh' ? '标记失败' : 'Mark failed'));
      }
    } catch (err: any) {
      console.error('标记已发奖励失败:', err);
      alert((language === 'zh' ? '标记失败：' : 'Mark failed: ') + (err.message || (language === 'zh' ? '未知错误' : 'Unknown error')));
    } finally {
      setMarkingPaid(false);
    }
  };

  // 历史待奖励用户批量选择功能
  const handleSelectHistoricalUser = (userId: number) => {
    const newSelected = new Set(selectedHistoricalUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedHistoricalUsers(newSelected);
  };

  const handleSelectAllHistorical = () => {
    if (selectedHistoricalUsers.size === historicalPendingUsers.length) {
      setSelectedHistoricalUsers(new Set());
    } else {
      setSelectedHistoricalUsers(new Set(historicalPendingUsers.map(user => user.userId)));
    }
  };

  const handleMarkHistoricalAsPaid = async () => {
    try {
      setMarkingPaid(true);
      const userIds = Array.from(selectedHistoricalUsers);
      
      if (userIds.length === 0) {
        alert(language === 'zh' ? '请选择要标记的用户' : 'Please select users to mark');
        return;
      }

      // 二次确认
      if (!confirm(language === 'zh' ? `确认将选中的 ${userIds.length} 位用户标记为已发奖励吗？` : `Confirm marking ${userIds.length} user(s) as paid?`)) {
        return;
      }

      // 调用服务
      const result = await monthlyRewardService.markAsPaid(userIds, selectedHistoricalYear, selectedHistoricalMonth);

      if (result && result.success !== false) {
        alert(language === 'zh' ? `成功标记 ${userIds.length} 个用户为已发奖励` : `Successfully marked ${userIds.length} user(s) as paid`);
        setSelectedHistoricalUsers(new Set());
        fetchHistoricalPendingUsers();
        fetchHistoricalRewards();
      } else {
        throw new Error(result?.message || (language === 'zh' ? '标记失败' : 'Mark failed'));
      }
    } catch (err: any) {
      console.error('标记已发奖励失败:', err);
      alert((language === 'zh' ? '标记失败：' : 'Mark failed: ') + (err.message || (language === 'zh' ? '未知错误' : 'Unknown error')));
    } finally {
      setMarkingPaid(false);
    }
  };

  // 已禁用历史刷新功能，避免与增量累加逻辑冲突
  // const handleRefreshHistoricalScores = async () => {
  //   // 此功能已禁用
  // };

  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null) {
      return '0.00 USDT';
    }
    return `${Number(amount).toFixed(2)} USDT`;
  };

  return (
    <div className="space-y-6">
      {/* 时间选择器 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            月度奖励管理 ({currentYear}年{currentMonth}月)
          </h2>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            月度奖励分数通过成果提交表审核自动累加
          </div>
        </div>
      </div>

      {/* 统计概览 */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">加载中...</span>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
          </div>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 总奖励金额 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">已奖励总额</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(stats.totalRewardAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* 已奖励用户数 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">已奖励用户</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.totalRewardedUsers}
                </p>
              </div>
            </div>
          </div>

          {/* 待发放金额 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">待发放金额</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(stats.pendingRewardAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* 待奖励用户数 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">待奖励用户</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.pendingRewardedUsers}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* 等级分布统计 */}
      {stats && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            奖励等级分布
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                {stats.basicLevelUsers}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">基础级别</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.advanced1LevelUsers}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">进阶一</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.advanced2LevelUsers}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">进阶二</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.advanced3LevelUsers}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">进阶三</div>
            </div>
          </div>
        </div>
      )}

      {/* 本月待奖励用户列表 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            本月待奖励用户列表
          </h3>
          <div className="flex space-x-2">
            {selectedUsers.size > 0 && (
              <button
                onClick={() => handleMarkAsPaid()}
                disabled={markingPaid}
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {markingPaid ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    处理中...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    批量确认 ({selectedUsers.size})
                  </>
                )}
              </button>
            )}
            <button
              onClick={handleExportPendingUsers}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              导出表格
            </button>
          </div>
        </div>

        {pendingLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">加载中...</span>
          </div>
        ) : pendingUsers.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 dark:text-gray-400 mb-2">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400">暂无待奖励用户</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedUsers.size === pendingUsers.length && pendingUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    用户信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    钱包地址
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    奖励等级
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    分数详情
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    奖励金额(USDT)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {pendingUsers.map((user, index) => (
                  <tr key={user.userId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user.userId)}
                        onChange={() => handleSelectUser(user.userId)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.userName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.userEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white font-mono">
                        {user.walletAddress ? (
                          <span title={user.walletAddress}>
                            {user.walletAddress.length > 20 
                              ? `${user.walletAddress.slice(0, 8)}...${user.walletAddress.slice(-8)}`
                              : user.walletAddress
                            }
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 italic">未设置</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                        {REWARD_LEVEL_NAMES[user.rewardLevel as keyof typeof REWARD_LEVEL_NAMES]?.[language] || user.rewardLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="space-y-1">
                        <div className="flex space-x-4 text-xs">
                          <span>传播: {user.promotionScore}</span>
                          <span>短篇: {user.shortScore}</span>
                          <span>长篇: {user.longScore}</span>
                          <span>社区: {user.communityScore}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                      {user.rewardAmount} USDT
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleMarkAsPaid(user.userId)}
                        disabled={markingPaid}
                        className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        确认
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 历史奖励 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            历史奖励（按月统计）
          </h3>
          <button
            onClick={handleDownloadAllMonthRewards}
            disabled={historicalRewards.length === 0}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            下载全部月份数据
          </button>
        </div>
        
        {historicalLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : historicalRewards.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            暂无历史奖励数据
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    月份
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    已奖励总额
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    已奖励用户
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    待发放金额
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    待奖励用户
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {historicalRewards.map((reward, index) => (
                  <tr key={`${reward.year}-${reward.month}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {reward.year}年{reward.month}月
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                      {formatCurrency(reward.totalRewardAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {reward.totalRewardedUsers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 dark:text-yellow-400">
                      {formatCurrency(reward.pendingRewardAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {reward.pendingRewardedUsers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDownloadMonthReward(reward.year, reward.month)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        📥 下载
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 历史待奖励用户列表 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            历史待奖励用户列表
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                选择月份:
              </label>
              <select
                value={`${selectedHistoricalYear}-${selectedHistoricalMonth}`}
                onChange={(e) => {
                  const [year, month] = e.target.value.split('-').map(Number);
                  setSelectedHistoricalYear(year);
                  setSelectedHistoricalMonth(month);
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableYearMonths.length === 0 ? (
                  <option value="">暂无数据</option>
                ) : (
                  availableYearMonths.map(ym => (
                    <option key={`${ym.year}-${ym.month}`} value={`${ym.year}-${ym.month}`}>
                      {ym.year}年{ym.month}月
                    </option>
                  ))
                )}
              </select>
            </div>
            <button
              onClick={handleDownloadHistoricalUsers}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              📥 下载列表
            </button>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              历史奖励分数通过成果提交表审核自动累加
            </div>
          </div>
        </div>

        {/* 批量操作工具栏 */}
        {historicalPendingUsers.length > 0 && (
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedHistoricalUsers.size === historicalPendingUsers.length && historicalPendingUsers.length > 0}
                  onChange={handleSelectAllHistorical}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  全选 ({selectedHistoricalUsers.size}/{historicalPendingUsers.length})
                </span>
              </label>
            </div>
            <button
              onClick={handleMarkHistoricalAsPaid}
              disabled={selectedHistoricalUsers.size === 0 || markingPaid}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-colors"
            >
              {markingPaid ? '处理中...' : `批量确认 (${selectedHistoricalUsers.size})`}
            </button>
          </div>
        )}
        
        {historicalPendingLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">加载中...</span>
          </div>
        ) : historicalPendingUsers.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 dark:text-gray-400 mb-2">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400">该月份暂无待奖励用户</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedHistoricalUsers.size === historicalPendingUsers.length && historicalPendingUsers.length > 0}
                      onChange={handleSelectAllHistorical}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    用户信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    钱包地址
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    奖励等级
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    分数详情
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    奖励金额(USDT)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {historicalPendingUsers.map((user, index) => (
                  <tr key={user.userId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedHistoricalUsers.has(user.userId)}
                        onChange={() => handleSelectHistoricalUser(user.userId)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.userName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.userEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white font-mono">
                        {user.walletAddress ? (
                          <span title={user.walletAddress}>
                            {user.walletAddress.length > 20 
                              ? `${user.walletAddress.slice(0, 8)}...${user.walletAddress.slice(-8)}`
                              : user.walletAddress
                            }
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 italic">未设置</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                        {REWARD_LEVEL_NAMES[user.rewardLevel as keyof typeof REWARD_LEVEL_NAMES]?.[language] || user.rewardLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="space-y-1">
                        <div className="flex space-x-4 text-xs">
                          <span>传播: {user.promotionScore}</span>
                          <span>短篇: {user.shortScore}</span>
                          <span>长篇: {user.longScore}</span>
                          <span>社区: {user.communityScore}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                      {user.rewardAmount} USDT
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedHistoricalUsers(new Set([user.userId]));
                          setTimeout(() => handleMarkHistoricalAsPaid(), 100);
                        }}
                        disabled={markingPaid}
                        className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        单独确认
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

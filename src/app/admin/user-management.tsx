'use client';

import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';

export default function UserManagement() {
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    applicants: 0,
    weeklyParticipants: 0,
    weeklyTopicViews: 0
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // 获取统计数据
  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await userService.getAdminStats();
      setStats({
        totalUsers: data.totalUsers || 0,
        applicants: data.totalApplications || 0,
        weeklyParticipants: data.weeklyParticipants || 0,
        weeklyTopicViews: data.weeklyTopicViews || 0
      });
    } catch (err: any) {
      console.error('获取统计数据失败:', err);
      setError('获取统计数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 更新所有用户等级
  const handleUpdateAllLevels = async () => {
    if (!confirm('确定要批量更新所有用户的等级吗？此操作会根据用户积分重新计算等级。')) {
      return;
    }

    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const result = await userService.updateAllUserLevels();
      setSuccess(result.message || `成功更新 ${result.successCount} 个用户的等级`);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      console.error('更新用户等级失败:', err);
      setError(err.message || '更新用户等级失败');
      setTimeout(() => setError(''), 5000);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* 成功提示 */}
      {success && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] max-w-2xl w-full mx-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg">
            {success}
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] max-w-2xl w-full mx-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
            {error}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        {/* 标题区域 */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">用户管理</h2>
        </div>

        {/* 统计卡片区域 */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">加载中...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 已注册用户数 */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-300">已注册用户数</p>
                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                      {stats.totalUsers.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 已申请人数 */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-300">已申请人数</p>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">
                      {stats.applicants.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 周挑战参与人数 */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-300">周挑战参与人数</p>
                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-2">
                      {stats.weeklyParticipants.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 dark:bg-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 周话题浏览数 */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-300">周话题浏览数</p>
                    <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mt-2">
                      {stats.weeklyTopicViews.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 dark:bg-orange-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 操作区域 */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">用户等级管理</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                根据用户积分批量更新所有用户的等级<br />
                <span className="text-xs">等级规则：0-100(L1 Explorer)、101-300(L2 Pathfinder)、301-700(L3 Trailblazer)、700+(L4 Pioneer)</span>
              </p>
            </div>
            <button
              onClick={handleUpdateAllLevels}
              disabled={updating}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {updating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  更新中...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  批量更新用户等级
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

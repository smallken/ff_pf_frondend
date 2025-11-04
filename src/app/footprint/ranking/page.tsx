'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { userService } from '../../../services';
import type { RankingUserVO } from '../../../types/api';

type RankingType = 'weekly' | 'total';

export default function Ranking() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  
  const [activeTab, setActiveTab] = useState<RankingType>('weekly'); // 默认显示周排行榜
  const [weeklyRankings, setWeeklyRankings] = useState<RankingUserVO[]>([]);
  const [totalRankings, setTotalRankings] = useState<RankingUserVO[]>([]);
  const [currentUserWeekly, setCurrentUserWeekly] = useState<RankingUserVO | null>(null);
  const [currentUserTotal, setCurrentUserTotal] = useState<RankingUserVO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 分页状态
  const [weeklyPage, setWeeklyPage] = useState(1);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [totalTotal, setTotalTotal] = useState(0);
  const pageSize = 20;

  // 根据脚印数量计算等级
  const calculateLevel = (points: number) => {
    if (points >= 300) return 4; // Pioneer（先驱者）
    if (points >= 101) return 3; // Trailblazer（开路者）
    if (points >= 31) return 2;  // Pathfinder（探路者）
    return 1; // Explorer（探索者）
  };

  // 根据脚印数量获取等级文本
  const getLevelText = (points: number) => {
    const level = calculateLevel(points);
    switch(level) {
      case 1: return t('profile.title.explorer');
      case 2: return t('profile.title.pathfinder');
      case 3: return t('profile.title.trailblazer');
      case 4: return t('profile.title.pioneer');
      default: return t('profile.title.explorer');
    }
  };

  // 根据脚印数量获取等级样式
  const getLevelStyle = (points: number) => {
    const level = calculateLevel(points);
    switch(level) {
      case 1: return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white';
      case 2: return 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white';
      case 3: return 'bg-gradient-to-r from-purple-400 to-indigo-500 text-white';
      case 4: return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white';
      default: return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white';
    }
  };

  // 获取周排行榜数据
  const fetchWeeklyRankings = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await userService.getWeeklyRanking({
        current: page,
        pageSize: pageSize
      });
      setWeeklyRankings(response.records || []);
      setWeeklyTotal(response.total || 0);
      
      // 保存当前用户的周排名信息
      if (user) {
        const currentUserRanking = response.records?.find(u => u.id === user.id);
        setCurrentUserWeekly(currentUserRanking || null);
      }
    } catch (error: any) {
      console.error('❌ 获取周排行榜失败:', error);
      setError(error.message || '获取周排行榜失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取总排行榜数据
  const fetchTotalRankings = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await userService.getTotalRanking({
        current: page,
        pageSize: pageSize
      });
      setTotalRankings(response.records || []);
      setTotalTotal(response.total || 0);
      
      // 保存当前用户的总排名信息
      if (user) {
        const currentUserRanking = response.records?.find(u => u.id === user.id);
        setCurrentUserTotal(currentUserRanking || null);
      }
    } catch (error: any) {
      console.error('❌ 获取总排行榜失败:', error);
      setError(error.message || '获取总排行榜失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyRankings(1);
    fetchTotalRankings(1);
  }, []);
  
  // 处理周排行榜分页
  const handleWeeklyPageChange = (page: number) => {
    setWeeklyPage(page);
    fetchWeeklyRankings(page);
  };
  
  // 处理总排行榜分页
  const handleTotalPageChange = (page: number) => {
    setTotalPage(page);
    fetchTotalRankings(page);
  };

  // 渲染排行榜表格
  const renderRankingTable = (rankings: RankingUserVO[], type: RankingType, currentPage: number) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y-2 divide-emerald-200 dark:divide-emerald-700">
        <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
              {t('ranking.table.rank')}
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
              {t('ranking.table.username')}
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
              {t('ranking.table.twitter')}
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
              {t('ranking.table.points')}
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
              {t('ranking.table.level')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {rankings.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                暂无排行榜数据
              </td>
            </tr>
          ) : (
            rankings.map((user, index) => {
              const points = type === 'weekly' ? (user.weeklyPoints || 0) : (user.totalPoints || 0);
              const globalRank = (currentPage - 1) * pageSize + index + 1;
              const isTopThree = globalRank <= 3;
              return (
                <tr key={user.id} className={`hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors duration-200 ${
                  isTopThree ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20' : ''
                }`}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl text-xs font-bold shadow-lg ${
                      globalRank === 1 ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white' :
                      globalRank === 2 ? 'bg-gradient-to-r from-gray-400 to-slate-500 text-white' :
                      globalRank === 3 ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white' :
                      'bg-gradient-to-r from-emerald-400 to-teal-500 text-white'
                    }`}>
                      {globalRank === 1 ? '🥇' : globalRank === 2 ? '🥈' : globalRank === 3 ? '🥉' : globalRank}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                    {user.userName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-300">
                    {user.twitterUsername || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    <span className="bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                      {points}{t('ranking.points.unit')}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full shadow-sm ${getLevelStyle(points)}`}>
                      {getLevelText(points)}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-6">
            {t('ranking.page.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t('ranking.page.subtitle')}
          </p>
        </div>

        {/* Tab切换按钮 */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-white dark:bg-gray-800 shadow-lg p-1">
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-8 py-3 rounded-md font-semibold transition-all duration-200 ${
                activeTab === 'weekly'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              📅 {t('ranking.tab.weekly')}
            </button>
            <button
              onClick={() => setActiveTab('total')}
              className={`px-8 py-3 rounded-md font-semibold transition-all duration-200 ${
                activeTab === 'total'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              🏆 {t('ranking.tab.total')}
            </button>
          </div>
        </div>

        {/* 单页布局 */}
        <div className="max-w-5xl mx-auto">
          {activeTab === 'weekly' ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border-2 border-emerald-500 ring-4 ring-emerald-200 dark:ring-emerald-800">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <span className="text-xl">📅</span>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  {t('ranking.tab.weekly')}
                </h2>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-300">加载中...</span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-600 dark:text-red-400">{error}</div>
                </div>
              ) : (
                <>
                  {renderRankingTable(weeklyRankings, 'weekly', weeklyPage)}
                  {/* 分页 */}
                  {weeklyTotal > pageSize && (
                    <div className="flex justify-center items-center mt-6 space-x-2">
                      <button
                        onClick={() => handleWeeklyPageChange(weeklyPage - 1)}
                        disabled={weeklyPage === 1}
                        className="px-4 py-2 rounded-lg bg-emerald-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors"
                      >
                        上一页
                      </button>
                      <span className="text-gray-700 dark:text-gray-300">
                        {weeklyPage} / {Math.ceil(weeklyTotal / pageSize)}
                      </span>
                      <button
                        onClick={() => handleWeeklyPageChange(weeklyPage + 1)}
                        disabled={weeklyPage >= Math.ceil(weeklyTotal / pageSize)}
                        className="px-4 py-2 rounded-lg bg-emerald-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors"
                      >
                        下一页
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border-2 border-emerald-500 ring-4 ring-emerald-200 dark:ring-emerald-800">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <span className="text-xl">🏆</span>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  {t('ranking.tab.total')}
                </h2>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-300">加载中...</span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-600 dark:text-red-400">{error}</div>
                </div>
              ) : (
                <>
                  {renderRankingTable(totalRankings, 'total', totalPage)}
                  {/* 分页 */}
                  {totalTotal > pageSize && (
                    <div className="flex justify-center items-center mt-6 space-x-2">
                      <button
                        onClick={() => handleTotalPageChange(totalPage - 1)}
                        disabled={totalPage === 1}
                        className="px-4 py-2 rounded-lg bg-emerald-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors"
                      >
                        上一页
                      </button>
                      <span className="text-gray-700 dark:text-gray-300">
                        {totalPage} / {Math.ceil(totalTotal / pageSize)}
                      </span>
                      <button
                        onClick={() => handleTotalPageChange(totalPage + 1)}
                        disabled={totalPage >= Math.ceil(totalTotal / pageSize)}
                        className="px-4 py-2 rounded-lg bg-emerald-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors"
                      >
                        下一页
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* 我的排名模块 */}
        <div className="max-w-5xl mx-auto mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-indigo-100 dark:border-gray-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-200 to-purple-300 dark:from-indigo-800 dark:to-purple-900 opacity-20 rounded-full -translate-y-24 translate-x-24"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-3xl">👤</span>
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">我的排名</h2>
              </div>
              
              {(currentUserWeekly || currentUserTotal) ? (
                <div className="space-y-6">
                  {/* 排名数据网格 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* 周积分 */}
                    <div className="group text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl text-white">⭐</span>
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                        {currentUserWeekly?.weeklyPoints || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-2">周积分</div>
                    </div>

                    {/* 总积分 */}
                    <div className="group text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl text-white">🏆</span>
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                        {currentUserTotal?.totalPoints || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-2">总积分</div>
                    </div>

                    {/* 周排名 */}
                    <div className="group text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl text-white font-bold">#</span>
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                        {currentUserWeekly?.rank || '-'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-2">周排名</div>
                    </div>

                    {/* 总排名 */}
                    <div className="group text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl text-white font-bold">#</span>
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                        {currentUserTotal?.rank || '-'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-2">总排名</div>
                    </div>
                  </div>

                  {/* 提升排名链接 */}
                  <div className="text-center pt-4">
                    <a href="/footprint/weekly-challenge" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
                      <span className="mr-2 text-xl">🚀</span>
                      <span className="text-lg">提升我的排名</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 dark:text-gray-400 text-lg mb-6">
                    {!isAuthenticated ? '请先登录查看您的排名' : '您还没有参与排名，快去完成任务吧！'}
                  </div>
                  <a href="/footprint/weekly-challenge" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
                    <span className="mr-2 text-xl">🚀</span>
                    <span className="text-lg">开始我的旅程</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

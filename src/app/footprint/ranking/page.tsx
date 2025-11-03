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
<<<<<<< HEAD
      let records = initialRecords;

      if (totalCount > 0 && records.length < totalCount) {
        const completeResponse = await userService.getRanking({
          current: 1,
          pageSize: totalCount
        });
        // 兼容后端返回格式
        records = Array.isArray(completeResponse) ? completeResponse : (completeResponse.records || []);
      }

      setFullRankingData(records);

      const totalPoints = records.reduce((sum, item) => sum + (item.userPoints || 0), 0);
      setAllUsersTotalPoints(totalPoints);

      if (user) {
        const userRanking = records.find((item) => item.id === user.id);
        if (userRanking) {
          setCurrentUserRank(userRanking);
        } else {
          const fallback = buildFallbackRanking(totalCount);
          if (fallback) {
            setCurrentUserRank(fallback);
          }
        }
      } else {
        setCurrentUserRank(null);
      }
    } catch (err) {
      console.error('❌ 获取完整排行榜失败:', err);
    } finally {
      setHasLoadedFullRanking(true);
    }
  };

  // 获取排行榜数据
  const fetchRankings = async (page: number = currentPage) => {
    try {
      // 调用后端API获取排行榜数据（分页）
      const rankingResponse = await userService.getRanking({
        current: page,
        pageSize: pageSize
      });
      
      // 兼容后端返回格式：可能是数组或分页对象
      let records: RankingUserVO[];
      let totalCount: number;
      let pages: number;
      let current: number;
      
      if (Array.isArray(rankingResponse)) {
        // 后端直接返回数组
        records = rankingResponse;
        totalCount = records.length;
        pages = 1;
        current = 1;
      } else {
        // 后端返回分页对象
        records = rankingResponse.records || [];
        totalCount = Number(rankingResponse.total ?? records.length);
        pages = Number(rankingResponse.pages ?? 1);
        current = Number(rankingResponse.current ?? 1);
      }
      
      // 过滤条件：必须有通过的报名申请（后端需保证），且分数>0
      const filtered = records.filter(u => (u.userPoints || 0) > 0);

      // 使用后端返回的原始分页信息，不重新计算
      setTotal(totalCount);
      setTotalPages(pages);
      setCurrentPage(current);

      // 直接使用过滤后的数据进行显示
      setRankings(filtered);

      // 如果当前页包含用户，则直接使用当前页结果；否则等待全量数据
      if (user) {
        const userRanking = records.find((item) => item.id === user.id);
        if (userRanking) {
          setCurrentUserRank(userRanking);
        } else if (!hasLoadedFullRanking) {
          const fallback = buildFallbackRanking(totalCount);
          if (fallback) {
            setCurrentUserRank((prev) => prev ?? fallback);
          }
        }
      } else {
        setCurrentUserRank(null);
      }

      // 加载完整数据以便统计和固定“我的排名”
      await loadFullRankingData(totalCount, records);
=======
      setLoading(true);
      const response = await userService.getWeeklyRanking({
        current: page,
        pageSize: pageSize
      });
      setWeeklyRankings(response.records || []);
      setWeeklyTotal(response.total || 0);
>>>>>>> newAutoReiw
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
      </div>
    </div>
  );
}

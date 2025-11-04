'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services';
import type { LoginUserVO, RankingUserVO } from '../../types/api';

export default function Ranking() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [rankings, setRankings] = useState<RankingUserVO[]>([]);
  const [totalRankings, setTotalRankings] = useState<RankingUserVO[]>([]);
  const [currentUser, setCurrentUser] = useState<RankingUserVO | null>(null);
  const [currentUserWeekly, setCurrentUserWeekly] = useState<RankingUserVO | null>(null);
  const [currentUserTotal, setCurrentUserTotal] = useState<RankingUserVO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'weekly' | 'total'>('weekly');

  // 根据脚印数量计算等级
  const calculateLevel = (userPoints: number) => {
    if (userPoints >= 700) return 4; // Pioneer（先驱者）
    if (userPoints >= 301) return 3; // Trailblazer（开路者）
    if (userPoints >= 101) return 2;  // Pathfinder（探路者）
    return 1; // Explorer（探索者）
  };

  // 根据脚印数量获取等级文本
  const getLevelText = (userPoints: number) => {
    const level = calculateLevel(userPoints);
    switch(level) {
      case 1: return t('profile.title.explorer');
      case 2: return t('profile.title.pathfinder');
      case 3: return t('profile.title.trailblazer');
      case 4: return t('profile.title.pioneer');
      default: return t('profile.title.explorer');
    }
  };

  // 根据脚印数量获取等级样式
  const getLevelStyle = (userPoints: number) => {
    const level = calculateLevel(userPoints);
    switch(level) {
      case 1: return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'; // 探索者 - 绿色
      case 2: return 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white'; // 探路者 - 蓝色
      case 3: return 'bg-gradient-to-r from-purple-400 to-indigo-500 text-white'; // 开路者 - 紫色
      case 4: return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'; // 先驱者 - 金色
      default: return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white';
    }
  };

  // 获取周排行榜数据
  const fetchWeeklyRankings = async () => {
    try {
      setLoading(true);
      // 调用后端API获取周排行榜数据
      const rankingResponse = await userService.getWeeklyRanking({
        current: 1,
        pageSize: 20
      });
      
      // 过滤条件：周积分>0
      const filtered = rankingResponse.records.filter(u => (u.userPoints || 0) > 0);
      setRankings(filtered);

      // 设置当前用户信息（周排行）
      if (user) {
        const currentUserRanking = filtered.find(u => u.id === user.id);
        setCurrentUser(currentUserRanking || null);
        setCurrentUserWeekly(currentUserRanking || null);
      }
    } catch (error: any) {
      console.error('❌ 获取周排行榜数据失败:', error);
      setError(error.message || '获取排行榜数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取总排行榜数据
  const fetchTotalRankings = async () => {
    try {
      setLoading(true);
      // 调用后端API获取总排行榜数据
      const rankingResponse = await userService.getTotalRanking({
        current: 1,
        pageSize: 20
      });
      
      // 过滤条件：总积分>0
      const filtered = rankingResponse.records.filter(u => (u.totalPoints || 0) > 0);
      setTotalRankings(filtered);

      // 设置当前用户信息（总排行）
      if (user) {
        const currentUserRanking = filtered.find(u => u.id === user.id);
        setCurrentUser(currentUserRanking || null);
        setCurrentUserTotal(currentUserRanking || null);
      }
    } catch (error: any) {
      console.error('❌ 获取总排行榜数据失败:', error);
      setError(error.message || '获取排行榜数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 同时加载周排行和总排行数据，以便在底部显示完整信息
    const fetchAllRankings = async () => {
      if (activeTab === 'weekly') {
        await fetchWeeklyRankings();
        // 如果还没有总排行数据，也加载它
        if (!currentUserTotal && user) {
          await fetchTotalRankings();
        }
      } else {
        await fetchTotalRankings();
        // 如果还没有周排行数据，也加载它
        if (!currentUserWeekly && user) {
          await fetchWeeklyRankings();
        }
      }
    };
    
    fetchAllRankings();
  }, [user, activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-gray-800 relative overflow-hidden">
      {/* Background decorative elements - Geometric Patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-16 left-16 w-28 h-28 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-400 animate-pulse">
            <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="currentColor"/>
            <polygon points="50,15 85,30 85,70 50,85 15,70 15,30" fill="none" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-gradient-to-r from-teal-300 to-cyan-400 opacity-15 animate-bounce delay-1000" style={{clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'}}></div>
        <div className="absolute bottom-32 left-1/3 w-16 h-16 bg-gradient-to-r from-emerald-300 to-teal-400 opacity-15 animate-ping delay-2000" style={{clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-16">
          
          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-6">{t('ranking.page.title')}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">{t('ranking.page.subtitle')}</p>
        </div>

        {/* 排行榜切换 */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-white/50 dark:bg-gray-800/50 rounded-full border border-white/40 dark:border-gray-700/40 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-6 py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ${
                activeTab === 'weekly'
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              周排行榜
            </button>
            <button
              onClick={() => setActiveTab('total')}
              className={`px-6 py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ${
                activeTab === 'total'
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              总排行榜
            </button>
          </div>
        </div>

        {/* 周排行榜 */}
        {activeTab === 'weekly' && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-12 border border-emerald-100 dark:border-gray-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-200 to-teal-300 dark:from-emerald-800 dark:to-teal-900 opacity-20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-2xl">📅</span>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">周排行榜</h2>
              </div>

              {/* 周排行榜说明 */}
              <div className="mb-8 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    本周奖池: <span className="text-emerald-600 dark:text-emerald-400 font-bold">1000U</span>
                  </div>
                  <div className="text-sm font-normal text-gray-600 dark:text-gray-300">
                    周排行榜前50名将获得奖励
                  </div>
                </div>
              </div>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-300">加载中...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-600 dark:text-red-400">{error}</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y-2 divide-emerald-200 dark:divide-emerald-700">
                  <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                        {t('ranking.table.rank')}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                        {t('ranking.table.username')}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                        邮箱
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                        {t('ranking.table.points')}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                        {t('ranking.table.level')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {rankings.map((user) => (
                      <tr key={user.rank ?? user.id} className={`hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors duration-200 ${
                        (user.rank ?? 999) <= 3 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20' : ''
                      }`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-2xl text-sm font-bold shadow-lg ${
                              user.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white' :
                              user.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-slate-500 text-white' :
                              user.rank === 3 ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white' :
                              'bg-gradient-to-r from-emerald-400 to-teal-500 text-white'
                            }`}>
                              {(user.rank ?? 999) <= 3 ? (
                                user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'
                              ) : user.rank ?? '-'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                          {user.userName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-300">
                          {user.userEmail}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          <span className="bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                            {user.userPoints}{t('ranking.points.unit')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-2 text-xs font-bold rounded-full shadow-sm ${getLevelStyle(user.userPoints)}`}>
                            {getLevelText(user.userPoints)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            </div>
          </div>
        )}

        {/* 总排行榜 */}
        {activeTab === 'total' && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-12 border border-purple-100 dark:border-gray-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-200 to-pink-300 dark:from-purple-800 dark:to-pink-900 opacity-20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-2xl">🏆</span>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">总排行榜</h2>
              </div>

              {/* 总排行榜说明 */}
              <div className="mb-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-700">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    历史总积分: <span className="text-purple-600 dark:text-purple-400 font-bold">
                      {totalRankings.reduce((total, user) => total + (user.totalPoints || 0), 0)}{t('ranking.points.unit')}
                    </span>
                  </div>
                  <div className="text-sm font-normal text-gray-600 dark:text-gray-300">
                    记录分数最高的前20名用户
                  </div>
                </div>
              </div>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-300">加载中...</span>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="text-red-600 dark:text-red-400">{error}</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y-2 divide-purple-200 dark:divide-purple-700">
                    <thead className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                          排名
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                          用户名
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                          邮箱
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                          总积分
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                          等级
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {totalRankings.slice(0, 20).map((user) => (
                        <tr key={user.rank ?? user.id} className={`hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors duration-200 ${
                          (user.rank ?? 999) <= 3 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20' : ''
                        }`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`inline-flex items-center justify-center w-10 h-10 rounded-2xl text-sm font-bold shadow-lg ${
                                user.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white' :
                                user.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-slate-500 text-white' :
                                user.rank === 3 ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white' :
                                'bg-gradient-to-r from-purple-400 to-pink-500 text-white'
                              }`}>
                                {(user.rank ?? 999) <= 3 ? (
                                  user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'
                                ) : user.rank ?? '-'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                            {user.userName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-300">
                            {user.userEmail}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            <span className="bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                              {user.totalPoints || 0}{t('ranking.points.unit')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-2 text-xs font-bold rounded-full shadow-sm ${getLevelStyle(user.totalPoints || 0)}`}>
                              {getLevelText(user.totalPoints || 0)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 我的排名 */}
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
                {/* 用户基本信息卡片 */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xl">👤</span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">用户名</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{(currentUserWeekly || currentUserTotal)?.userName}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xl">🐦</span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">推特</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {(currentUserWeekly || currentUserTotal)?.twitterUsername || '未绑定'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xl">✉️</span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">邮箱</div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {(currentUserWeekly || currentUserTotal)?.userEmail}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 排名数据网格 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* 周积分 */}
                  <div className="group text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-xl text-white">⭐</span>
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                      {currentUserWeekly?.userPoints || 0}
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
                  <a href="/forms" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
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
                <a href="/forms" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
                  <span className="mr-2 text-xl">🚀</span>
                  <span className="text-lg">开始我的旅程</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
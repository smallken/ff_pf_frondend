'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { userService } from '../../../services';
import type { LoginUserVO, RankingUserVO } from '../../../types/api';

export default function Ranking() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [rankings, setRankings] = useState<RankingUserVO[]>([]);
  const [currentUser, setCurrentUser] = useState<RankingUserVO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 根据脚印数量计算等级
  const calculateLevel = (userPoints: number) => {
    if (userPoints >= 300) return 4; // Pioneer（先驱者）
    if (userPoints >= 101) return 3; // Trailblazer（开路者）
    if (userPoints >= 31) return 2;  // Pathfinder（探路者）
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

  // 获取排行榜数据
  const fetchRankings = async () => {
    try {
      console.log('🔍 开始获取排行榜数据...');
      
      // 调用后端API获取排行榜数据
      const rankingData = await userService.getRanking();
      console.log('✅ 排行榜数据获取成功:', rankingData);
      
      // 过滤条件：必须有通过的报名申请（后端需保证），且分数>0
      const filtered = rankingData.filter(u => (u.userPoints || 0) > 0);
      setRankings(filtered);

      // 如果有当前用户，设置当前用户信息
      if (user) {
        const currentUserRanking = filtered.find(u => u.id === user.id);
        if (currentUserRanking) {
          setCurrentUser(currentUserRanking);
        } else {
          // 不在榜单中且分数为0或未申请通过，则不显示个人临时记录
          setCurrentUser(null);
        }
      }
    } catch (error: any) {
      console.error('❌ 获取排行榜数据失败:', error);
      setError(error.message || '获取排行榜数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, [user]);

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

        {/* 排行榜 */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-12 border border-emerald-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-200 to-teal-300 dark:from-emerald-800 dark:to-teal-900 opacity-20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <span className="text-2xl">🏅</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">{t('ranking.top10.title')}</h2>
            </div>
            
            {/* 总Footprint和参考说明 */}
            <div className="mb-8 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700">
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('ranking.total.points')}: <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {rankings.reduce((total, user) => total + user.userPoints, 0)}{t('ranking.points.unit')}
                  </span>
                </div>
                <div className="text-sm font-normal text-gray-600 dark:text-gray-300">
                  {t('ranking.reference.note')}
                  <a 
                    href="/honor" 
                    className="ml-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-normal underline transition-colors duration-200"
                  >
                    {t('ranking.reference.link')}
                  </a>
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
                      <tr key={user.rank} className={`hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors duration-200 ${
                        user.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20' : ''
                      }`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-2xl text-sm font-bold shadow-lg ${
                              user.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white' :
                              user.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-slate-500 text-white' :
                              user.rank === 3 ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white' :
                              'bg-gradient-to-r from-emerald-400 to-teal-500 text-white'
                            }`}>
                              {user.rank <= 3 ? (
                                user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'
                              ) : user.rank}
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

        {/* 当前用户排名 */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-teal-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-teal-200 to-cyan-300 dark:from-teal-800 dark:to-cyan-900 opacity-20 rounded-full -translate-y-20 -translate-x-20"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <span className="text-2xl">👤</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">{t('ranking.myrank.title')}</h2>
            </div>
            {currentUser ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="group text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl text-white font-bold">#</span>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">{currentUser.rank}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-2">{t('ranking.myrank.rank')}</div>
                </div>
                <div className="group text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl text-white">⭐</span>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">{currentUser.userPoints}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-2">{t('ranking.myrank.points')}</div>
                </div>
                <div className="group text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl text-white">🏆</span>
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 dark:from-yellow-400 dark:to-amber-400 bg-clip-text text-transparent">{getLevelText(currentUser.userPoints)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-2">{t('ranking.myrank.level')}</div>
                </div>
                <div className="group text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl text-white">📊</span>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    {rankings.length > 0 ? Math.ceil((currentUser.userPoints / rankings[0].userPoints) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-2">{t('ranking.myrank.completion')}</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500 dark:text-gray-400">
                  {!isAuthenticated ? t('ranking.notice.notlogin') : t('ranking.notice.notonboarded')}
                </div>
                <div className="mt-4">
                  <a href="/forms" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-2xl font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
                    <span className="mr-2">🚀</span>
                    {t('ranking.improve.link')}
                  </a>
                </div>
              </div>
            )}
            
            {currentUser && (
              <div className="mt-8 text-center">
                <a href="/forms" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-2xl font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
                  <span className="mr-2">🚀</span>
                  {t('ranking.improve.link')}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
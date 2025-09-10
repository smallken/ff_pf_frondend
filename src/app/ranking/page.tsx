'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Ranking() {
  const { t } = useLanguage();
  const [rankings, setRankings] = useState([
    { rank: 1, userName: '张三', twitterHandle: 'zhangsan_web3', points: 450, level: 'gold' },
    { rank: 2, userName: '李四', twitterHandle: 'lisi_crypto', points: 380, level: 'silver' },
    { rank: 3, userName: '王五', twitterHandle: 'wangwu_defi', points: 320, level: 'silver' },
    { rank: 4, userName: '赵六', twitterHandle: 'zhaoliu_nft', points: 280, level: 'silver' },
    { rank: 5, userName: '钱七', twitterHandle: 'qianqi_dao', points: 220, level: 'silver' },
    { rank: 6, userName: '孙八', twitterHandle: 'sunba_metaverse', points: 180, level: 'bronze' },
    { rank: 7, userName: '周九', twitterHandle: 'zhoujiu_gamefi', points: 150, level: 'bronze' },
    { rank: 8, userName: '吴十', twitterHandle: 'wushi_solana', points: 120, level: 'bronze' },
    { rank: 9, userName: '郑十一', twitterHandle: 'zhengshiyi_web3', points: 90, level: 'bronze' },
    { rank: 10, userName: '王十二', twitterHandle: 'wangshier_flipflop', points: 60, level: 'bronze' }
  ]);

  const [currentUser] = useState({ rank: 15, userName: t('ranking.currentuser'), points: 150, level: 'bronze' });

  const getLevelText = (level: string) => {
    switch(level) {
      case 'diamond': return t('ranking.level.diamond');
      case 'platinum': return t('ranking.level.platinum');
      case 'gold': return t('ranking.level.gold');
      case 'silver': return t('ranking.level.silver');
      case 'bronze': return t('ranking.level.bronze');
      default: return level;
    }
  };

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
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full text-sm font-medium mb-8 shadow-lg">
            <span className="mr-2">🏆</span>
            Leaderboard
          </div>
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
            
            {/* 总Flipprints和参考说明 */}
            <div className="mb-8 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700">
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('ranking.total.points')}: <span className="text-emerald-600 dark:text-emerald-400 font-bold">2250{t('ranking.points.unit')}</span>
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
                      {t('ranking.table.twitter')}
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
                        <span className="inline-flex items-center">
                          <span className="text-blue-500 mr-1">@</span>
                          {user.twitterHandle}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        <span className="bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                          {user.points}{t('ranking.points.unit')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-2 text-xs font-bold rounded-full shadow-sm ${
                          user.level === 'diamond' ? 'bg-gradient-to-r from-purple-400 to-indigo-500 text-white' :
                          user.level === 'platinum' ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white' :
                          user.level === 'gold' ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white' :
                          user.level === 'silver' ? 'bg-gradient-to-r from-gray-400 to-slate-500 text-white' :
                          'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                        }`}>
                          {getLevelText(user.level)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">{currentUser.points}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-2">{t('ranking.myrank.points')}</div>
              </div>
              <div className="group text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl text-white">🏆</span>
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 dark:from-yellow-400 dark:to-amber-400 bg-clip-text text-transparent">{getLevelText(currentUser.level)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-2">{t('ranking.myrank.level')}</div>
              </div>
              <div className="group text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl text-white">📊</span>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  {Math.ceil((currentUser.points / rankings[0].points) * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-2">{t('ranking.myrank.completion')}</div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <a href="/forms" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-2xl font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
                <span className="mr-2">🚀</span>
                {t('ranking.improve.link')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

function WeeklyChallenge() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  // 计算倒计时（假设每周六24:00截止）
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const saturday = new Date();

      // 设置到本周六24:00
      saturday.setDate(now.getDate() + (6 - now.getDay()));
      saturday.setHours(24, 0, 0, 0);

      const difference = saturday.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(timer);
  }, []);

  const taskCards = [
    {
      id: 'promotion',
      title: '📣 传播任务',
      description: '为本周官方推文一键三联（转 + 赞 + 评）',
      points: '3 分',
      requirement: '上传截图',
      buttonText: '上传并领取积分（Claim）',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'community',
      title: '💬 社群任务',
      description: '参与本周 Telegram Topic / AMA 发言',
      points: '4 分',
      requirement: '上传截图',
      buttonText: '上传并领取积分（Claim）',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'creation',
      title: '✍️ 原创任务',
      description: '#FFFPWeek5 – 「你眼中的 Flipflop」',
      points: '基础 5 分 + 浏览量加权',
      requirement: '上传链接 + 截图 + 浏览量',
      buttonText: '上传作品（Claim 5 分）',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const rewardTiers = [
    { rank: '🥇 Top 1–3', description: '固定大奖', amount: '金额...' },
    { rank: '🥈 Top 4–10', description: '梯度奖金', amount: '金额...' },
    { rank: '🥉 Top 11–30', description: '均分奖池', amount: '金额...' },
    { rank: '✨ Top 31–50', description: '基础奖励', amount: '金额...' }
  ];

  const leaderboardPreview = [
    { rank: 1, username: '@CryptoGist', points: 38 },
    { rank: 2, username: '@JayJay', points: 34 },
    { rank: 3, username: '@PathSeeker', points: 33 },
    { rank: 4, username: '@Web3Explorer', points: 29 },
    { rank: 5, username: '@BlockchainFan', points: 27 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 页面标题和倒计时 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
            Flipflop Footprint Weekly Challenge
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            🔥 完成任务，领取积分，冲击排行榜！
          </p>

          {/* 倒计时 */}
          <div className="inline-flex items-center px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg mb-8">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mr-4">距本周挑战结束还有：</span>
            <div className="flex items-center space-x-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{timeLeft.days}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">天</div>
              </div>
              <div className="text-gray-400">:</div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{timeLeft.hours}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">小时</div>
              </div>
              <div className="text-gray-400">:</div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{timeLeft.minutes}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">分钟</div>
              </div>
            </div>
          </div>

          {!isAuthenticated && (
            <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
              <span className="mr-2">🚀</span>
              立即参与
            </button>
          )}
        </div>

        {/* Section 1：任务概览 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">任务概览（每周更新）</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {taskCards.map((task) => (
              <div key={task.id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{task.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{task.description}</p>
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                      积分上限：{task.points}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">提交要求：{task.requirement}</p>
                  <button className={`w-full px-4 py-3 bg-gradient-to-r ${task.color} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300`}>
                    {task.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              🔔 截止时间：本周六 24:00（UTC+8）
              <br />
              审核将在活动结束后根据实际浏览量进行加权。
            </p>
          </div>
        </section>

        {/* Section 2：奖池与发奖规则 */}
        <section className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">奖池与发奖规则</h2>
            <div className="text-center mb-8">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                本周奖池：<span className="text-2xl font-bold text-green-600 dark:text-green-400">1000U</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">（Top 50 用户将获得奖励）</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {rewardTiers.map((tier, index) => (
                <div key={index} className="text-center p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl border border-gray-200 dark:border-gray-600">
                  <div className="text-2xl mb-2">{tier.rank}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{tier.description}</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{tier.amount}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                发榜时间：每周一（UTC+8）
              </p>
            </div>
          </div>
        </section>

        {/* Section 3：排行榜预览 */}
        <section className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">👑 本周前十榜单（实时更新）</h2>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                查看完整榜单 →
              </button>
            </div>

            <div className="space-y-4">
              {leaderboardPreview.map((user) => (
                <div key={user.rank} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className="flex items-center">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 ${
                      user.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white' :
                      user.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-slate-500 text-white' :
                      user.rank === 3 ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white' :
                      'bg-gradient-to-r from-blue-400 to-cyan-500 text-white'
                    }`}>
                      {user.rank}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">{user.username}</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{user.points} 分</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4：我的任务记录（登录后可见） */}
        {isAuthenticated && (
          <section>
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">📊 我的任务记录</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-600">
                  <div className="text-2xl mb-2">📣 传播类</div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">2 / 3 次</div>
                  <div className="text-green-600 dark:text-green-400">✅</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-600">
                  <div className="text-2xl mb-2">💬 社群类</div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">1 / 2 次</div>
                  <div className="text-yellow-600 dark:text-yellow-400">⏳</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-200 dark:border-purple-600">
                  <div className="text-2xl mb-2">✍️ 原创类</div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">1 / 1 次</div>
                  <div className="text-green-600 dark:text-green-400">✅</div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">本周总积分：xx 分</div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default function Forms() {
  return <WeeklyChallenge />;
}
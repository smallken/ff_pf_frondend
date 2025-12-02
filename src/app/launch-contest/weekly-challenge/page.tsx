'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Button } from '../../components/reactbits/ButtonSimple';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/reactbits/Card';

export default function WeeklyChallenge() {
  const { language, t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 12, minutes: 45, seconds: 0 });
  const [userStats, setUserStats] = useState({
    spreadTask: { submitted: 2, limit: 5 },
    communityTask: { submitted: 1, limit: 3 },
    originalTask: { submitted: 1, limit: 1 },
    totalPoints: 0
  });

  // 倒计时效果
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const { days, hours, minutes, seconds } = prev;
        if (seconds > 0) return { ...prev, seconds: seconds - 1 };
        if (minutes > 0) return { days, hours, minutes: minutes - 1, seconds: 59 };
        if (hours > 0) return { days, hours: hours - 1, minutes: 59, seconds: 59 };
        if (days > 0) return { days: days - 1, hours: 23, minutes: 59, seconds: 59 };
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 计算总积分
  useEffect(() => {
    const spreadPoints = userStats.spreadTask.submitted * 1; // 假设每次传播任务1分
    const communityPoints = userStats.communityTask.submitted * 2; // 假设每次社群任务2分
    const originalPoints = userStats.originalTask.submitted * 5; // 假设每次原创任务5分
    setUserStats(prev => ({ ...prev, totalPoints: spreadPoints + communityPoints + originalPoints }));
  }, [userStats.spreadTask.submitted, userStats.communityTask.submitted, userStats.originalTask.submitted]);

  const taskCards = [
    {
      id: '传播任务',
      title: language === 'zh' ? '📣 传播任务' : '📣 Spread Task',
      description: language === 'zh' 
        ? '为本周官方推文一键三联（转+赞+评）' 
        : 'Triple-click (retweet+like+comment) on this week\'s official tweet',
      points: language === 'zh' ? '积分上限：5分' : 'Points limit: 5 points',
      requirement: language === 'zh' ? '提交要求：上传截图 + 链接' : 'Submission: Upload screenshot + link',
      buttonText: language === 'zh' ? '上传并领取积分' : 'Upload & Claim Points',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: '社群任务',
      title: language === 'zh' ? '💬 社群任务' : '💬 Community Task',
      description: language === 'zh' 
        ? '参与本周 Telegram Topic / AMA 发言' 
        : 'Participate in this week\'s Telegram Topic / AMA',
      points: language === 'zh' ? '积分上限：4分' : 'Points limit: 4 points',
      requirement: language === 'zh' ? '提交要求：上传截图 + 链接' : 'Submission: Upload screenshot + link',
      buttonText: language === 'zh' ? '上传并领取积分' : 'Upload & Claim Points',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: '原创任务',
      title: language === 'zh' ? '✍️ 原创任务' : '✍️ Original Task',
      description: language === 'zh' 
        ? '#FFFPWeek5 –「你眼中的Flipflop」' 
        : '#FFFPWeek5 - "Flipflop in Your Eyes"',
      points: language === 'zh' ? '积分：基础5分 + 浏览量加权' : 'Points: Base 5 + view count bonus',
      requirement: language === 'zh' ? '：上传链接 + 截图 + 浏览量+转发、点赞、评论数据；' : 'Submission: Upload link + screenshot + view count',
      buttonText: language === 'zh' ? '上传作品' : 'Upload Work',
      color: 'from-amber-500 to-orange-500'
    }
  ];

  const leaderboard = [
    { rank: 1, name: '@CryptoGist', points: 38 },
    { rank: 2, name: '@JayJay', points: 34 },
    { rank: 3, name: '@PathSeeker', points: 33 },
    { rank: 4, name: '@CryptoExplorer', points: 30 },
    { rank: 5, name: '@Web3Pioneer', points: 28 },
    { rank: 6, name: '@TokenHunter', points: 27 },
    { rank: 7, name: '@DeFiMaster', points: 25 },
    { rank: 8, name: '@NFTCollector', points: 23 },
    { rank: 9, name: '@BlockchainDev', points: 21 },
    { rank: 10, name: '@CryptoAnalyst', points: 20 }
  ];

  const prizePool = [
    { rank: 'Top 1–3', prize: language === 'zh' ? '固定大奖 金额...' : 'Fixed grand prize amount...', color: 'from-yellow-400 to-amber-500' },
    { rank: 'Top 4–10', prize: language === 'zh' ? '梯度奖金 金额...' : 'Tiered prize amount...', color: 'from-gray-300 to-gray-400' },
    { rank: 'Top 11–30', prize: language === 'zh' ? '均分奖池 金额...' : 'Pool sharing amount...', color: 'from-orange-300 to-orange-400' },
    { rank: 'Top 31–50', prize: language === 'zh' ? '基础奖励 金额...' : 'Basic reward amount...', color: 'from-blue-300 to-blue-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 页面标题和副标题 */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            {language === 'zh' ? 'Flipflop Footprint Weekly Challenge | 完成任务，赢取奖励！' : 'Flipflop Footprint Weekly Challenge | Complete tasks, win rewards!'}
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
            🔥 {language === 'zh' ? '完成任务，领取积分，冲击排行榜！' : 'Complete tasks, claim points, climb the leaderboard!'}
          </p>
          
          {/* 倒计时 */}
          <div className="flex justify-center items-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg">
              <p className="text-lg font-medium">
                {language === 'zh' ? '距本周挑战结束还有：' : 'Time until this week\'s challenge ends:'}
              </p>
              <div className="flex justify-center mt-2 space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{timeLeft.days}</div>
                  <div className="text-xs">{language === 'zh' ? '天' : 'Days'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{timeLeft.hours}</div>
                  <div className="text-xs">{language === 'zh' ? '时' : 'Hours'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                  <div className="text-xs">{language === 'zh' ? '分' : 'Mins'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                  <div className="text-xs">{language === 'zh' ? '秒' : 'Secs'}</div>
                </div>
              </div>
            </div>
          </div>
          
          <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg">
            {language === 'zh' ? '立即参与' : 'Join Now'}
          </Button>
        </motion.div>

        {/* Section 1: 任务概览 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
            {language === 'zh' ? 'Section 1：任务概览（每周更新）' : 'Section 1: Task Overview (Weekly Update)'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {taskCards.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`h-full bg-gradient-to-br ${task.color} text-white shadow-xl`}>
                  <CardHeader>
                    <CardTitle className="text-xl">{task.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p>{task.description}</p>
                    <p className="text-sm opacity-90">{task.points}</p>
                    <p className="text-sm opacity-90">{task.requirement}</p>
                    <Button className="w-full bg-white text-gray-800 hover:bg-gray-100 font-medium">
                      {task.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
            <p>🔔 {language === 'zh' ? '截止时间：本周六 24:00（UTC+8）' : 'Deadline: Saturday 24:00 (UTC+8)'}</p>
            <p className="text-sm mt-1">{language === 'zh' ? '审核将在活动结束后根据实际浏览量进行加权。' : 'Review will be conducted after the event based on actual view counts.'}</p>
          </div>
        </section>

        {/* Section 2: 奖池与发奖规则 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
            {language === 'zh' ? 'Section 2：奖池与发奖规则' : 'Section 2: Prize Pool and Distribution Rules'}
          </h2>
          <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">
                {language === 'zh' ? '本周奖池：1000U（Top 50 用户将获得奖励）' : 'This week\'s prize pool: 1000U (Top 50 users will receive rewards)'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {prizePool.map((prize, index) => (
                  <div key={index} className={`p-4 rounded-lg bg-gradient-to-r ${prize.color} bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30`}>
                    <h3 className="font-bold text-lg mb-2">{prize.rank}</h3>
                    <p>{prize.prize}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-lg">
                {language === 'zh' ? '发榜时间：每周一（UTC+8）' : 'Leaderboard update: Every Monday (UTC+8)'}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 3: 排行榜预览 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
            {language === 'zh' ? 'Section 3：排行榜预览' : 'Section 3: Leaderboard Preview'}
          </h2>
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 dark:text-gray-200">
                👑 {language === 'zh' ? '本周前十榜单（实时更新）' : 'Top 10 This Week (Real-time Update)'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboard.map((user) => (
                  <div key={user.rank} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        user.rank === 1 ? 'bg-yellow-500' : 
                        user.rank === 2 ? 'bg-gray-400' : 
                        user.rank === 3 ? 'bg-amber-600' : 'bg-gray-600'
                      }`}>
                        {user.rank}
                      </div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{user.name}</span>
                    </div>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{user.points} {language === 'zh' ? '分' : 'points'}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  {language === 'zh' ? '查看完整榜单 →' : 'View Full Leaderboard →'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 4: 我的任务记录 */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
            {language === 'zh' ? 'Section 4：我的任务记录' : 'Section 4: My Task Records'}
          </h2>
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 dark:text-gray-200">
                📊 {language === 'zh' ? '我的任务记录' : 'My Task Records'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {language === 'zh' ? '传播类：' : 'Spread Tasks:'}
                  </span>
                  <span className={userStats.spreadTask.submitted >= userStats.spreadTask.limit ? 'text-green-600' : 'text-orange-600'}>
                    {language === 'zh' ? '已提交' : 'Submitted'} {userStats.spreadTask.submitted} / {userStats.spreadTask.limit} {userStats.spreadTask.submitted >= userStats.spreadTask.limit ? '✅' : '⏳'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {language === 'zh' ? '社群类：' : 'Community Tasks:'}
                  </span>
                  <span className={userStats.communityTask.submitted >= userStats.communityTask.limit ? 'text-green-600' : 'text-orange-600'}>
                    {language === 'zh' ? '已提交' : 'Submitted'} {userStats.communityTask.submitted} / {userStats.communityTask.limit} {userStats.communityTask.submitted >= userStats.communityTask.limit ? '✅' : '⏳'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {language === 'zh' ? '原创类：' : 'Original Tasks:'}
                  </span>
                  <span className={userStats.originalTask.submitted >= userStats.originalTask.limit ? 'text-green-600' : 'text-orange-600'}>
                    {language === 'zh' ? '已提交' : 'Submitted'} {userStats.originalTask.submitted} / {userStats.originalTask.limit} {userStats.originalTask.submitted >= userStats.originalTask.limit ? '✅' : '⏳'}
                  </span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-800 dark:text-gray-200">
                      {language === 'zh' ? '本周总积分：' : 'Total Points This Week:'}
                    </span>
                    <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
                      {userStats.totalPoints} {language === 'zh' ? '分' : 'points'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

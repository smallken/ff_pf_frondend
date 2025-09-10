'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Profile() {
  const { t } = useLanguage();
  const [userInfo, setUserInfo] = useState({
    userName: '张三',
    userEmail: 'zhangsan@example.com',
    monthlyPoints: 45,
    totalPoints: 150,
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    userRole: 'user',
    title: 'explorer' // explorer, pathfinder, trailblazer, pioneer
  });

  const [submissions, setSubmissions] = useState([
    { id: 1, formType: '申请表', status: '审核通过', score: 50, date: '2024-01-15' },
    { id: 2, formType: '活动申请表', status: '待审核', score: null, date: '2024-01-20' },
    { id: 3, formType: '成果提交表', status: '审核拒绝', score: 0, date: '2024-01-25' }
  ]);

  const [rewardHistory, setRewardHistory] = useState([
    { id: 1, type: '月度基础奖励', amount: '10U', status: '已发放', date: '2024-01-31' },
    { id: 2, type: '进阶任务奖励', amount: '50U', status: '已发放', date: '2024-01-15' },
    { id: 3, type: '创作奖励', amount: '25U', status: '处理中', date: '2024-02-05' }
  ]);

  const getTitleText = (title: string) => {
    switch(title) {
      case 'explorer': return t('profile.title.explorer');
      case 'pathfinder': return t('profile.title.pathfinder');
      case 'trailblazer': return t('profile.title.trailblazer');
      case 'pioneer': return t('profile.title.pioneer');
      default: return title;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('profile.page.title')}</h1>
        </div>

        {/* 用户信息卡片 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('profile.basic.info')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profile.username')}</label>
              <p className="mt-1 text-gray-900 dark:text-white">{userInfo.userName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profile.email')}</label>
              <p className="mt-1 text-gray-900 dark:text-white">{userInfo.userEmail}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profile.user.title')}</label>
              <p className="mt-1 text-emerald-600 dark:text-emerald-400 font-semibold">{getTitleText(userInfo.title)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profile.monthly.points')}</label>
              <p className="mt-1 text-blue-600 dark:text-blue-400 font-bold">{userInfo.monthlyPoints}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profile.total.points')}</label>
              <p className="mt-1 text-indigo-600 dark:text-indigo-400 font-bold">{userInfo.totalPoints}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profile.wallet')}</label>
              <p className="mt-1 text-gray-900 dark:text-white font-mono text-sm">{userInfo.walletAddress}</p>
            </div>
          </div>
          
          <div className="mt-6 flex space-x-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              {t('profile.edit.info')}
            </button>
            <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
              {t('profile.change.password')}
            </button>
          </div>
        </div>

        {/* 奖励历史 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('profile.reward.history')}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('profile.reward.date')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('profile.reward.type')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('profile.reward.amount')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('profile.reward.status')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {rewardHistory.map((reward) => (
                  <tr key={reward.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {reward.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {reward.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                      {reward.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        reward.status === '已发放' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                      }`}>
                        {reward.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 提交记录 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('profile.submission.records')}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    表单类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Flipprints
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    提交日期
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {submission.formType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        submission.status === '审核通过' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                        submission.status === '待审核' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                        'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      }`}>
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {submission.score !== null ? `${submission.score}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {submission.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <a href="/forms" className="text-blue-600 hover:text-blue-500 font-medium">
              {t('profile.continue.submit')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
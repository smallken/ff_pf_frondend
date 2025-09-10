'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Admin() {
  const { t, formatDate } = useLanguage();
  const [activeTab, setActiveTab] = useState('forms');
  const [forms, setForms] = useState([
    { id: 1, userNameKey: 'admin.sample.username1', formTypeKey: 'admin.sample.formtype.application', submitDate: '2024-01-20', score: null },
    { id: 2, userNameKey: 'admin.sample.username2', formTypeKey: 'admin.sample.formtype.activity', submitDate: '2024-01-19', score: null },
    { id: 3, userNameKey: 'admin.sample.username3', formTypeKey: 'admin.sample.formtype.achievement', submitDate: '2024-01-18', score: null }
  ]);

  const [users, setUsers] = useState([
    { id: 1, userNameKey: 'admin.sample.username1', email: 'zhangsan@example.com', points: 150, levelKey: 'admin.sample.level.bronze' },
    { id: 2, userNameKey: 'admin.sample.username2', email: 'lisi@example.com', points: 280, levelKey: 'admin.sample.level.silver' },
    { id: 3, userNameKey: 'admin.sample.username3', email: 'wangwu@example.com', points: 450, levelKey: 'admin.sample.level.gold' }
  ]);

  const handleReview = (formId: number, status: string, score: number) => {
    // 这里调用后端审核接口
    console.log('审核表单:', { formId, status, score });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('admin.page.title')}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">{t('admin.page.subtitle')}</p>
        </div>

        {/* 标签页 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('forms')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'forms'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {t('admin.tab.forms')}
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {t('admin.tab.users')}
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'stats'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {t('admin.tab.stats')}
              </button>
            </nav>
          </div>
        </div>

        {/* 表单审核 */}
        {activeTab === 'forms' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('admin.forms.title')}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('admin.table.user')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('admin.table.formtype')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('admin.table.submitdate')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('admin.table.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('admin.table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {forms.map((form) => (
                    <tr key={form.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {t(form.userNameKey)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {t(form.formTypeKey)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(form.submitDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          {t('admin.status.pending')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleReview(form.id, '通过', 50)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          {t('admin.action.approve')}
                        </button>
                        <button
                          onClick={() => handleReview(form.id, '拒绝', 0)}
                          className="text-red-600 hover:text-red-900"
                        >
                          {t('admin.action.reject')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 用户管理 */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('admin.users.title')}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('admin.table.username')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('admin.table.email')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('admin.table.points')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('admin.table.level')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('admin.table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {t(user.userNameKey)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {user.points}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          {t(user.levelKey)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          {t('admin.action.edit')}
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          {t('admin.action.delete')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 数据统计 */}
        {activeTab === 'stats' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('admin.stats.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">128</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{t('admin.stats.totalusers')}</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">56</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{t('admin.stats.pendingforms')}</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">2340</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{t('admin.stats.totalpoints')}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
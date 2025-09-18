'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { formService } from '../../../services';

export default function ApplicationForm() {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    twitterUsername: '',
    telegramUsername: '',
    walletAddress: '',
    web3Role: '',
    expertise: '',
    portfolioLink: '',
    motivation: '',
    weeklyHours: '',
    eventOrganization: '',
    resources: '',
    entrepreneurship: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 打印申请表数据
      console.log('📋 申请表提交数据:', {
        ...formData,
        timestamp: new Date().toISOString()
      });

      // 直接提交表单数据，不再使用JSON格式
      await formService.submitApplicationForm(formData);

      console.log('✅ 申请表提交成功');
      
      // 显示成功提示
      setSuccess('🎉 申请表提交成功！我们将在1-3个工作日内审核您的申请。');
      
      // 2秒后自动消失提示
      setTimeout(() => {
        setSuccess('');
      }, 2000);
      
      // 3秒后跳转到表单列表页面
      setTimeout(() => {
        router.push('/forms?success=application');
      }, 3000);
    } catch (error: any) {
      console.log('❌ 申请表提交失败:', error);
      setError(error.message || '提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCancel = () => {
    router.push('/forms');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12" lang={language === 'zh' ? 'zh-CN' : 'en-US'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('forms.application.title')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl p-6 mb-6 shadow-lg animate-pulse">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-1">{t('forms.error.submit.failed')}</h3>
                  <div className="text-red-700 dark:text-red-300">{error}</div>
                </div>
              </div>
            </div>
          )}
          
          {!isAuthenticated && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-6">
              <div className="text-sm text-yellow-600 dark:text-yellow-400">
                请先登录后再提交表单
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.field.name')} <span className="text-red-500">{t('forms.required')}</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.field.email')} <span className="text-red-500">{t('forms.required')}</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="twitterUsername" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.field.twitter')}
              </label>
              <input
                type="text"
                id="twitterUsername"
                name="twitterUsername"
                
                placeholder={t('forms.field.twitter')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={formData.twitterUsername}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="telegramUsername" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.field.telegram')} <span className="text-red-500">{t('forms.required')}</span>
              </label>
              <input
                type="text"
                id="telegramUsername"
                name="telegramUsername"
                required
                placeholder={t('forms.field.telegram')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={formData.telegramUsername}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.field.wallet.solana')} <span className="text-red-500">{t('forms.required')}</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{t('forms.wallet.tip')}</span>
              </label>
              <input
                type="text"
                id="walletAddress"
                name="walletAddress"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={formData.walletAddress}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('forms.application.web3role')} <span className="text-red-500">{t('forms.required')}</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { key: 'entrepreneur', value: 'forms.role.entrepreneur' },
                { key: 'developer', value: 'forms.role.developer' },
                { key: 'creator', value: 'forms.role.creator' },
                { key: 'kol', value: 'forms.role.kol' },
                { key: 'community', value: 'forms.role.community' },
                { key: 'marketing', value: 'forms.role.marketing' },
                { key: 'researcher', value: 'forms.role.researcher' },
                { key: 'enthusiast', value: 'forms.role.enthusiast' },
                { key: 'student', value: 'forms.role.student' }
              ].map((role) => (
                <label key={role.key} className="flex items-center">
                  <input
                    type="radio"
                    name="web3Role"
                    value={role.key}
                    checked={formData.web3Role === role.key}
                    onChange={handleChange}
                    className="mr-2 text-violet-600 focus:ring-violet-500"
                    required
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t(role.value)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('forms.application.expertise')} <span className="text-red-500">{t('forms.required')}</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'content', value: 'forms.expertise.content' },
                { key: 'community', value: 'forms.expertise.community' },
                { key: 'research', value: 'forms.expertise.research' },
                { key: 'promotion', value: 'forms.expertise.promotion' }
              ].map((skill) => (
                <label key={skill.key} className="flex items-center">
                  <input
                    type="radio"
                    name="expertise"
                    value={skill.key}
                    checked={formData.expertise === skill.key}
                    onChange={handleChange}
                    className="mr-2 text-violet-600 focus:ring-violet-500"
                    required
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t(skill.value)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="portfolioLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('forms.application.portfolio')}
            </label>
            <textarea
              id="portfolioLink"
              name="portfolioLink"
              rows={3}
              
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={formData.portfolioLink}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('forms.application.motivation')} <span className="text-red-500">{t('forms.required')}</span>
            </label>
            <textarea
              id="motivation"
              name="motivation"
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={formData.motivation}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="weeklyHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.application.weeklyhours')}
              </label>
              <input
                type="text"
                id="weeklyHours"
                name="weeklyHours"
                placeholder={t('forms.application.weeklyhours.placeholder')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={formData.weeklyHours}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="eventOrganization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.application.events')}
              </label>
              <select
                id="eventOrganization"
                name="eventOrganization"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={formData.eventOrganization}
                onChange={handleChange}
              >
                <option value="">{t('admin.review.not.filled')}</option>
                <option value="yes">{t('common.yes')}</option>
                <option value="no">{t('common.no')}</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="resources" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('forms.application.resources')}
            </label>
            <textarea
              id="resources"
              name="resources"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={formData.resources}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="entrepreneurship" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('forms.application.entrepreneurship')}
            </label>
            <textarea
              id="entrepreneurship"
              name="entrepreneurship"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={formData.entrepreneurship}
              onChange={handleChange}
            />
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6 border border-yellow-200 dark:border-yellow-700">
            <h3 className="font-medium text-yellow-900 dark:text-yellow-200 mb-2">📝 {t('forms.submit.button')}</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {t('forms.optional.note')}
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {t('forms.cancel.button')}
            </button>
            <button
              type="submit"
              disabled={loading || !isAuthenticated || !!success}
              className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-md hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('forms.submit.processing')}
                </div>
              ) : success ? (
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('forms.submit.completed')}
                </div>
              ) : (
                t('forms.submit.button')
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 成功提示模态框 */}
      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 max-w-md mx-4 shadow-2xl transform animate-scaleIn">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                <svg className="h-12 w-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('forms.success.title')}</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {success}
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('forms.success.redirect')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
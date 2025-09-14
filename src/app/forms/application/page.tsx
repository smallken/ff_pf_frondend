'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { formService } from '../../../services';

export default function ApplicationForm() {
  const { t } = useLanguage();
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
  
  // 功能暂时禁用
  const isDisabled = true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isDisabled) {
      setError('表单提交功能暂未开放，敬请期待');
      return;
    }
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 打印申请表数据
      console.log('📋 申请表提交数据:', {
        ...formData,
        timestamp: new Date().toISOString()
      });

      // 直接提交表单数据，不再使用JSON格式
      await formService.submitApplicationForm(formData);

      console.log('✅ 申请表提交成功');
      // 提交成功，跳转到表单列表页面
      router.push('/forms?success=申请表提交成功');
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('forms.application.title')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
              <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
            </div>
          )}
          
          {isDisabled && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-6">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  表单提交功能暂未开放，敬请期待
                </div>
              </div>
            </div>
          )}

          {!isAuthenticated && !isDisabled && (
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
                {t('forms.field.twitter')} <span className="text-red-500">{t('forms.required')}</span>
              </label>
              <input
                type="text"
                id="twitterUsername"
                name="twitterUsername"
                required
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
              {t('forms.application.portfolio')} <span className="text-red-500">{t('forms.required')}</span>
            </label>
            <textarea
              id="portfolioLink"
              name="portfolioLink"
              rows={3}
              required
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
              <input
                type="text"
                id="eventOrganization"
                name="eventOrganization"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={formData.eventOrganization}
                onChange={handleChange}
              />
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
                disabled={loading || !isAuthenticated || isDisabled}
              className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-md hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  提交中...
                </div>
              ) : (
                t('forms.submit.button')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
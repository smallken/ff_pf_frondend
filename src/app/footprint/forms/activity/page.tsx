'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../../contexts/AuthContext';
import { activityApplicationService } from '../../../../services';
import CustomDateInput from '../../../components/CustomDateInput';

export default function ActivityForm() {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Debug language state
  useEffect(() => {
    console.log('Activity form language changed to:', language);
  }, [language]);
  const [formData, setFormData] = useState({
    organizer: '',
    email: '',
    twitterUsername: '',
    telegramUsername: '',
    walletAddress: '',
    activityType: '',
    activityTheme: '',
    briefIntroduction: '',
    activityTime: '',
    activityLocation: '',
    activityScale: '',
    activityGoals: '',
    targetAudience: '',
    activityProcess: '',
    financialSupport: '',
    otherSupport: '',
    invitedSpeakers: '',
    partners: '',
    expectedResults: ''
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
      // 准备提交数据，将前端字段名映射到后端需要的格式
      const submitData = {
        organizer: formData.organizer,
        email: formData.email,
        twitterUsername: formData.twitterUsername,
        telegramUsername: formData.telegramUsername,
        walletAddress: formData.walletAddress,
        activityTheme: formData.activityTheme,
        briefIntroduction: formData.briefIntroduction,
        activityType: formData.activityType,
        activityTime: formData.activityTime,
        activityLocation: formData.activityLocation,
        activityScale: formData.activityScale,
        targetAudience: formData.targetAudience,
        activityGoals: formData.activityGoals,
        activityProcess: formData.activityProcess,
        expectedResults: formData.expectedResults,
        invitedSpeakers: formData.invitedSpeakers,
        partners: formData.partners,
        financialSupport: formData.financialSupport,
        otherSupport: formData.otherSupport,
      };

      // 调用后端活动申请表提交API
      const applicationId = await activityApplicationService.submitApplication(submitData);
      
      // 显示成功提示
      setSuccess('🎉 活动申请表提交成功！我们将在1-3个工作日内审核您的申请。');
      
      // 2秒后自动消失提示
      setTimeout(() => {
        setSuccess('');
      }, 2000);
      
      // 3秒后跳转到表单申请页面
      setTimeout(() => {
        router.push('/forms?success=activity');
      }, 3000);
    } catch (error: any) {
      console.log('❌ 活动申请表提交失败:', error);
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
    <div key={language} className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-800 relative overflow-hidden" lang={language === 'zh' ? 'zh-CN' : 'en-US'}>
      {/* Background decorative elements - Activity themed */}
      <div className="absolute inset-0">
        <div className="absolute top-16 left-16 w-24 h-24 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full text-blue-400 animate-pulse">
            <rect x="10" y="10" width="80" height="80" rx="15" fill="currentColor"/>
            <rect x="20" y="20" width="60" height="60" rx="10" fill="none" stroke="currentColor" strokeWidth="3"/>
          </svg>
        </div>
        <div className="absolute top-32 right-20 w-20 h-20 bg-gradient-to-r from-indigo-300 to-purple-400 opacity-15 animate-bounce delay-1000" style={{clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'}}></div>
        <div className="absolute bottom-32 left-1/3 w-16 h-16 bg-gradient-to-r from-blue-300 to-indigo-400 opacity-15 animate-ping delay-2000" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-medium mb-8 shadow-lg">
            <span className="mr-2">📝</span>
            Activity Form
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-6">
            {t('forms.activity.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          </p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-blue-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200 to-indigo-300 dark:from-blue-800 dark:to-indigo-900 opacity-20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            
            {!isAuthenticated && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-6">
                <div className="text-sm text-yellow-600 dark:text-yellow-400">
                  {t('forms.error.login.required')}
                </div>
              </div>
            )}

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="organizer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('forms.activity.organizer')} <span className="text-red-500">{t('forms.required')}</span>
                </label>
                <input
                  type="text"
                  id="organizer"
                  name="organizer"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.organizer}
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  placeholder={t('forms.placeholder.username')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  placeholder={t('forms.placeholder.username')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.telegramUsername}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('forms.field.wallet.both')} <span className="text-red-500">{t('forms.required')}</span>
                </label>
                <input
                  type="text"
                  id="walletAddress"
                  name="walletAddress"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.walletAddress}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('forms.activity.type')} <span className="text-red-500">{t('forms.required')}</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'online', value: 'forms.activity.type.online' },
                  { key: 'offline', value: 'forms.activity.type.offline' },
                  { key: 'hybrid', value: 'forms.activity.type.hybrid' }
                ].map((type) => (
                  <label key={type.key} className="flex items-center">
                    <input
                      type="radio"
                      name="activityType"
                      value={type.key}
                      checked={formData.activityType === type.key}
                      onChange={handleChange}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{t(type.value)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="activityTheme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('forms.activity.theme')} <span className="text-red-500">{t('forms.required')}</span>
                </label>
                <input
                  type="text"
                  id="activityTheme"
                  name="activityTheme"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.activityTheme}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="activityTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('forms.activity.time')} <span className="text-red-500">{t('forms.required')}</span>
                </label>
                <CustomDateInput
                  id="activityTime"
                  name="activityTime"
                  type="datetime-local"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.activityTime}
                  onChange={(e) => handleChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}
                />
              </div>

              <div>
                <label htmlFor="activityLocation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('forms.activity.location')} <span className="text-red-500">{t('forms.required')}</span>
                </label>
                <input
                  type="text"
                  id="activityLocation"
                  name="activityLocation"
                  required
                  placeholder={t('forms.activity.location')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.activityLocation}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="activityScale" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('forms.activity.scale')} <span className="text-red-500">{t('forms.required')}</span>
                </label>
                <input
                  type="text"
                  id="activityScale"
                  name="activityScale"
                  required
                  placeholder={t('forms.activity.scale')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.activityScale}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="briefIntroduction" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.activity.introduction')} <span className="text-red-500">{t('forms.required')}</span>
              </label>
              <textarea
                id="briefIntroduction"
                name="briefIntroduction"
                rows={4}
                required
                placeholder={t('forms.activity.introduction')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.briefIntroduction}
                onChange={handleChange}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="activityGoals" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.activity.goals')} <span className="text-red-500">{t('forms.required')}</span>
              </label>
              <textarea
                id="activityGoals"
                name="activityGoals"
                rows={3}
                required
                placeholder={t('forms.placeholder.goals')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.activityGoals}
                onChange={handleChange}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('forms.activity.audience')} <span className="text-red-500">{t('forms.required')}</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'newusers', value: 'forms.activity.audience.newusers' },
                  { key: 'community', value: 'forms.activity.audience.community' },
                  { key: 'projects', value: 'forms.activity.audience.projects' },
                  { key: 'makers', value: 'forms.activity.audience.makers' }
                ].map((audience) => (
                  <label key={audience.key} className="flex items-center">
                    <input
                      type="radio"
                      name="targetAudience"
                      value={audience.key}
                      checked={formData.targetAudience === audience.key}
                      onChange={handleChange}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{t(audience.value)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="activityProcess" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.activity.process')} <span className="text-red-500">{t('forms.required')}</span>
              </label>
              <textarea
                id="activityProcess"
                name="activityProcess"
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.activityProcess}
                onChange={handleChange}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="financialSupport" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.activity.financial')} <span className="text-red-500">{t('forms.required')}</span>
              </label>
              <textarea
                id="financialSupport"
                name="financialSupport"
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.financialSupport}
                onChange={handleChange}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="otherSupport" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.activity.support')} <span className="text-red-500">{t('forms.required')}</span>
              </label>
              <textarea
                id="otherSupport"
                name="otherSupport"
                rows={3}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.otherSupport}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="invitedSpeakers" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('forms.activity.speakers')}
                </label>
                <textarea
                  id="invitedSpeakers"
                  name="invitedSpeakers"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.invitedSpeakers}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="partners" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('forms.activity.partners')}
                </label>
                <textarea
                  id="partners"
                  name="partners"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.partners}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="expectedResults" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.activity.results')}
              </label>
              <textarea
                id="expectedResults"
                name="expectedResults"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.expectedResults}
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
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-all duration-300 transform hover:-translate-y-1"
              >
                {t('forms.cancel.button')}
              </button>
              <button
                type="submit"
                disabled={loading || !isAuthenticated || !!success}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg ${
                  loading || !isAuthenticated || !!success
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transform hover:-translate-y-1 hover:shadow-xl'
                }`}
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
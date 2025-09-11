'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import CustomDateInput from '../../components/CustomDateInput';

export default function ActivityForm() {
  const { t, language } = useLanguage();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 这里调用后端表单提交接口
    console.log('活动申请表数据:', formData);
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
    <div key={language} className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-800 relative overflow-hidden">
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
                  { key: 'online', value: 'forms.acttype.online' },
                  { key: 'offline', value: 'forms.acttype.offline' },
                  { key: 'hybrid', value: 'forms.acttype.hybrid' }
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
                  onChange={handleChange}
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
                  placeholder={t('forms.placeholder.location')}
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
                  placeholder={t('forms.placeholder.scale')}
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
                placeholder={t('forms.placeholder.introduction')}
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
                  { key: 'newusers', value: 'forms.audience.newusers' },
                  { key: 'community', value: 'forms.audience.community' },
                  { key: 'projects', value: 'forms.audience.projects' },
                  { key: 'makers', value: 'forms.audience.makers' }
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
                placeholder={t('forms.placeholder.process')}
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
                placeholder={t('forms.placeholder.financial')}
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
                placeholder={t('forms.placeholder.support')}
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
                  placeholder={t('forms.placeholder.speakers')}
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
                  placeholder={t('forms.placeholder.partners')}
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
                placeholder={t('forms.placeholder.results')}
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
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                {t('forms.submit.button')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
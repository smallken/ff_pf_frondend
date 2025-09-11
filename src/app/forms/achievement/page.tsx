'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import CustomDateInput from '../../components/CustomDateInput';

export default function AchievementForm() {
  const { t, language } = useLanguage();
  const router = useRouter();
  
  // Force re-render when language changes
  useEffect(() => {
    // This will trigger a re-render when language changes
  }, [language]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    twitterUsername: '',
    telegramUsername: '',
    walletAddress: '',
    submissionCategory: '',
    taskType: '',
    contentLink: '',
    screenshot: null,
    completionDate: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 这里调用后端表单提交接口
    console.log('成果提交表数据:', formData);
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
    <div key={language} className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-gray-800 relative overflow-hidden">
      {/* Background decorative elements - Achievement themed */}
      <div className="absolute inset-0">
        <div className="absolute top-16 left-16 w-24 h-24 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full text-green-400 animate-pulse">
            <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="currentColor"/>
          </svg>
        </div>
        <div className="absolute top-32 right-20 w-20 h-20 bg-gradient-to-r from-emerald-300 to-teal-400 opacity-15 animate-bounce delay-1000" style={{clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'}}></div>
        <div className="absolute bottom-32 left-1/3 w-16 h-16 bg-gradient-to-r from-green-300 to-emerald-400 opacity-15 animate-ping delay-2000" style={{clipPath: 'circle(50% at 50% 50%)'}}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-medium mb-8 shadow-lg">
            <span className="mr-2">🏆</span>
            Achievement Form
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-6">
            {t('forms.achievement.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          </p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-green-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200 to-emerald-300 dark:from-green-800 dark:to-emerald-900 opacity-20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.walletAddress}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('forms.achievement.category')} <span className="text-red-500">{t('forms.required')}</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'promotion', value: 'forms.category.promotion' },
                  { key: 'creation', value: 'forms.category.creation' },
                  { key: 'community', value: 'forms.category.community' }
                ].map((category) => (
                  <label key={category.key} className="flex items-center">
                    <input
                      type="radio"
                      name="submissionCategory"
                      value={category.key}
                      checked={formData.submissionCategory === category.key}
                      onChange={handleChange}
                      className="mr-2 text-green-600 focus:ring-green-500"
                      required
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{t(category.value)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('forms.achievement.tasktype')} <span className="text-red-500">{t('forms.required')}</span>
              </label>
              <div className="space-y-2">
                {[
                  { key: 'like', value: 'forms.task.like' },
                  { key: 'content', value: 'forms.task.content' },
                  { key: 'article', value: 'forms.task.article' },
                  { key: 'video', value: 'forms.task.video' },
                  { key: 'ama', value: 'forms.task.ama' },
                  { key: 'recap', value: 'forms.task.recap' },
                  { key: 'telegram', value: 'forms.task.telegram' },
                  { key: 'offline', value: 'forms.task.offline' }
                ].map((task) => (
                  <label key={task.key} className="flex items-start">
                    <input
                      type="radio"
                      name="taskType"
                      value={task.key}
                      checked={formData.taskType === task.key}
                      onChange={handleChange}
                      className="mr-2 mt-1 text-green-600 focus:ring-green-500"
                      required
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{t(task.value)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="contentLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.achievement.contentlink')} <span className="text-red-500">{t('forms.required')}</span>
              </label>
              <input
                type="url"
                id="contentLink"
                name="contentLink"
                required
                placeholder={t('forms.placeholder.contentlink')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.contentLink}
                onChange={handleChange}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="screenshot" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.achievement.screenshot')} <span className="text-red-500">{t('forms.required')}</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label htmlFor="screenshot" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                    <span className="px-2">{t('forms.upload.text')}</span>
                    <input 
                      id="screenshot" 
                      name="screenshot" 
                      type="file" 
                      className="sr-only" 
                      accept="image/*"
                      required
                      onChange={handleChange}
                    />
                  </label>
                  <p className="pl-1">{t('forms.upload.drag')}</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('forms.upload.format')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="completionDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('forms.achievement.completion')} <span className="text-red-500">{t('forms.required')}</span>
                </label>
                <CustomDateInput
                  id="completionDate"
                  name="completionDate"
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.completionDate}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('forms.achievement.description')}
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  placeholder={t('forms.placeholder.description')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6 border border-yellow-200 dark:border-yellow-700">
              <h3 className="font-medium text-yellow-900 dark:text-yellow-200 mb-2">📝 {t('forms.submit.achievement')}</h3>
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
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                {t('forms.submit.achievement')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
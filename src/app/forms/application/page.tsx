'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ApplicationForm() {
  const { t } = useLanguage();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 这里调用后端表单提交接口
    console.log('申请表数据:', formData);
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
                placeholder={t('forms.placeholder.username')}
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
                placeholder={t('forms.placeholder.username')}
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
              placeholder={t('forms.placeholder.portfolio')}
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
              placeholder={t('forms.placeholder.motivation')}
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
                placeholder={t('forms.placeholder.weeklyhours')}
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
                placeholder={t('forms.placeholder.events')}
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
              placeholder={t('forms.placeholder.resources')}
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
              placeholder={t('forms.placeholder.entrepreneurship')}
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
              className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-md hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              {t('forms.submit.button')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
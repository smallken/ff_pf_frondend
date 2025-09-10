'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ActivityForm() {
  const { t, language } = useLanguage();
  
  // Debug language state
  useEffect(() => {
    console.log('Activity form language changed to:', language);
  }, [language]);
  const [formData, setFormData] = useState({
    activityType: '',
    activityName: '',
    startDate: '',
    endDate: '',
    participants: '',
    description: '',
    goals: '',
    requirements: ''
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
            {t('forms.activity.subtitle')}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-blue-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200 to-indigo-300 dark:from-blue-800 dark:to-indigo-900 opacity-20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="activityType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.field.activitytype')} {t('forms.field.required')}
              </label>
              <select
                id="activityType"
                name="activityType"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.activityType}
                onChange={handleChange}
              >
                <option value="">{t('forms.placeholder.select')}</option>
                <option value="技术研讨">{t('forms.activity.type.research')}</option>
                <option value="项目开发">{t('forms.activity.type.development')}</option>
                <option value="社区活动">{t('forms.activity.type.community')}</option>
                <option value="培训课程">{t('forms.activity.type.training')}</option>
                <option value="其他">{t('forms.activity.type.other')}</option>
              </select>
            </div>

            <div>
              <label htmlFor="activityName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.field.activityname')} {t('forms.field.required')}
              </label>
              <input
                type="text"
                id="activityName"
                name="activityName"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('forms.placeholder.activityname')}
                value={formData.activityName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.field.startdate')} {t('forms.field.required')}
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                required
                placeholder={language === 'zh' ? '年/月/日' : 'mm/dd/yyyy'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.startDate}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {language === 'zh' ? '注：日期选择器显示语言由浏览器系统语言决定' : 'Note: Date picker display language is determined by browser system language'}
              </p>
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.field.enddate')} {t('forms.field.required')}
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                required
                placeholder={language === 'zh' ? '年/月/日' : 'mm/dd/yyyy'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="participants" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.field.participants')} {t('forms.field.required')}
              </label>
              <input
                type="number"
                id="participants"
                name="participants"
                required
                min="1"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.participants}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('forms.field.description')} {t('forms.field.required')}
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('forms.placeholder.description')}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="goals" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('forms.field.goals')} {t('forms.field.required')}
            </label>
            <textarea
              id="goals"
              name="goals"
              rows={3}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('forms.placeholder.goals')}
              value={formData.goals}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('forms.field.requirements')}
            </label>
            <textarea
              id="requirements"
              name="requirements"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('forms.placeholder.requirements')}
              value={formData.requirements}
              onChange={handleChange}
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('forms.submit.info')}</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• {t('forms.activity.submit.info.1')}</li>
              <li>• {t('forms.activity.submit.info.2')}</li>
              <li>• {t('forms.activity.submit.info.3')}</li>
              <li>• {t('forms.activity.submit.info.4')}</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-all duration-300 transform hover:-translate-y-1"
            >
              {t('forms.button.cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              {t('forms.button.submit')}
            </button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
}
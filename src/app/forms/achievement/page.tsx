'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function AchievementForm() {
  const { t, language } = useLanguage();
  
  // Force re-render when language changes
  useEffect(() => {
    // This will trigger a re-render when language changes
  }, [language]);
  const [formData, setFormData] = useState({
    projectName: '',
    activityType: '',
    completionDate: '',
    hoursSpent: '',
    achievements: '',
    challenges: '',
    lessons: '',
    attachments: ''
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
            {t('forms.achievement.subtitle')}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-green-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200 to-emerald-300 dark:from-green-800 dark:to-emerald-900 opacity-20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.field.projectname')} {t('forms.field.required')}
              </label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('forms.placeholder.projectname')}
                value={formData.projectName}
                onChange={handleChange}
              />
            </div>

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
                <option value="技术开发">{t('forms.achievement.type.development')}</option>
                <option value="社区贡献">{t('forms.achievement.type.community')}</option>
                <option value="内容创作">{t('forms.achievement.type.content')}</option>
                <option value="活动组织">{t('forms.achievement.type.organization')}</option>
                <option value="其他">{t('forms.activity.type.other')}</option>
              </select>
            </div>

            <div>
              <label htmlFor="completionDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.field.completiondate')} {t('forms.field.required')}
              </label>
              <input
                type="date"
                id="completionDate"
                name="completionDate"
                required
                placeholder={language === 'zh' ? '年/月/日' : 'mm/dd/yyyy'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.completionDate}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {language === 'zh' ? '注：日期选择器显示语言由浏览器系统语言决定' : 'Note: Date picker display language is determined by browser system language'}
              </p>
            </div>

            <div>
              <label htmlFor="hoursSpent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.field.hoursspent')} {t('forms.field.required')}
              </label>
              <input
                type="number"
                id="hoursSpent"
                name="hoursSpent"
                required
                min="1"
                max="1000"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.hoursSpent}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="achievements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('forms.field.achievements')} {t('forms.field.required')}
            </label>
            <textarea
              id="achievements"
              name="achievements"
              rows={5}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('forms.placeholder.achievements')}
              value={formData.achievements}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="challenges" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('forms.field.challenges')}
            </label>
            <textarea
              id="challenges"
              name="challenges"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('forms.placeholder.challenges')}
              value={formData.challenges}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="lessons" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('forms.field.lessons')} {t('forms.field.required')}
            </label>
            <textarea
              id="lessons"
              name="lessons"
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('forms.placeholder.lessons')}
              value={formData.lessons}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('forms.field.attachments')}
            </label>
            <input
              type="url"
              id="attachments"
              name="attachments"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('forms.placeholder.attachments')}
              value={formData.attachments}
              onChange={handleChange}
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('forms.submit.info')}</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• {t('forms.achievement.submit.info.1')}</li>
              <li>• {t('forms.achievement.submit.info.2')}</li>
              <li>• {t('forms.achievement.submit.info.3')}</li>
              <li>• {t('forms.achievement.submit.info.4')}</li>
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
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              {t('forms.button.submit.achievement')}
            </button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
}
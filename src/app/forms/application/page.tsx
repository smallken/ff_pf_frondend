'use client';

import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ApplicationForm() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    occupation: '',
    education: '',
    experience: '',
    motivation: '',
    expectations: ''
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('forms.application.page.title')}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">{t('forms.application.page.desc')}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.field.fullname')} {t('forms.field.required')}
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.field.age')} {t('forms.field.required')}
              </label>
              <input
                type="number"
                id="age"
                name="age"
                required
                min="18"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.field.occupation')} {t('forms.field.required')}
              </label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.occupation}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.field.education')} {t('forms.field.required')}
              </label>
              <select
                id="education"
                name="education"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.education}
                onChange={handleChange}
              >
                <option value="">{t('forms.placeholder.select')}</option>
                <option value="高中">{t('forms.education.highschool')}</option>
                <option value="大专">{t('forms.education.college')}</option>
                <option value="本科">{t('forms.education.bachelor')}</option>
                <option value="硕士">{t('forms.education.master')}</option>
                <option value="博士">{t('forms.education.doctor')}</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('forms.field.experience')} {t('forms.field.required')}
            </label>
            <textarea
              id="experience"
              name="experience"
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('forms.placeholder.experience')}
              value={formData.experience}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('forms.field.motivation')} {t('forms.field.required')}
            </label>
            <textarea
              id="motivation"
              name="motivation"
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('forms.placeholder.motivation')}
              value={formData.motivation}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="expectations" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('forms.field.expectations')} {t('forms.field.required')}
            </label>
            <textarea
              id="expectations"
              name="expectations"
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('forms.placeholder.expectations')}
              value={formData.expectations}
              onChange={handleChange}
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('forms.submit.info')}</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• {t('forms.submit.info.1')}</li>
              <li>• {t('forms.submit.info.2')}</li>
              <li>• {t('forms.submit.info.3')}</li>
              <li>• {t('forms.submit.info.4')}</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {t('forms.button.cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {t('forms.button.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
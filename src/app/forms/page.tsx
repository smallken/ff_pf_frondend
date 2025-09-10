'use client';

import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

export default function Forms() {
  const { t } = useLanguage();
  const formTypes = [
    {
      id: 1,
      titleKey: 'forms.application.title',
      descriptionKey: 'forms.application.desc',
      icon: '📄',
      link: '/forms/application'
    },
    {
      id: 2,
      titleKey: 'forms.activity.title',
      descriptionKey: 'forms.activity.desc',
      icon: '🎯',
      link: '/forms/activity'
    },
    {
      id: 3,
      titleKey: 'forms.achievement.title',
      descriptionKey: 'forms.achievement.desc',
      icon: '✅',
      link: '/forms/achievement'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('forms.page.title')}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">{t('forms.page.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {formTypes.map((form) => (
            <Link
              key={form.id}
              href={form.link}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{form.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t(form.titleKey)}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{t(form.descriptionKey)}</p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {t('forms.start.fill')} →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('forms.submit.records')}</h2>
          <p className="text-gray-600 dark:text-gray-300">{t('forms.submit.records.desc')}</p>
          <div className="mt-4">
            <Link
              href="/profile"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              {t('forms.view.records')} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';

function SuccessMessageHandler() {
  const searchParams = useSearchParams();
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const success = searchParams.get('success');
    if (success) {
      setSuccessMessage(success);
      setShowSuccess(true);
      // 5秒后自动隐藏成功消息
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }
  }, [searchParams]);

  if (!showSuccess) return null;

  return (
    <div className="mb-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-green-800 dark:text-green-200 font-medium">{successMessage}</span>
        </div>
        <button
          onClick={() => setShowSuccess(false)}
          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

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
        {/* 成功消息提示 */}
        <Suspense fallback={<div>Loading...</div>}>
          <SuccessMessageHandler />
        </Suspense>

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
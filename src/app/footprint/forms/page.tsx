'use client';

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import { formService } from '@/services';

const SUBMISSION_DEADLINE = new Date('2025-10-19T16:00:00Z');

const submissionClosedContent = {
  zh: {
    title: '脚印计划提交已暂停',
    description: [
      '自2025年10月20日00:00（UTC+8）起，脚印计划已暂停所有任务递交与系统功能。',
      '当前暂不接受新的表单提交，请关注后续上线通知。'
    ],
    badge: '提交关闭'
  },
  en: {
    title: 'Footprint submissions are paused',
    description: [
      'Starting October 20, 2025 at 00:00 (UTC+8), all Footprint tasks and features are temporarily suspended.',
      'New form submissions are currently unavailable. Stay tuned for update announcements.'
    ],
    badge: 'Submission closed'
  }
};

function FormsContent() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasApproved, setHasApproved] = useState<boolean>(false);
  const [hasSubmittedApplication, setHasSubmittedApplication] = useState<boolean>(false);
  const isSubmissionClosed = Date.now() >= SUBMISSION_DEADLINE.getTime();

  useEffect(() => {
    const success = searchParams.get('success');
    if (success) {
      setSuccessMessage(success);
      setShowSuccess(true);
      // 3秒后自动隐藏成功消息
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }
  }, [searchParams]);

  useEffect(() => {
    // 检查是否已有通过的报名申请表
    formService.hasApprovedApplication().then(setHasApproved).catch(() => setHasApproved(false));
    
    // 检查是否已提交过报名申请表（无论是否通过）
    formService.getMyForms({ status: undefined, current: 1, pageSize: 1 }).then(response => {
      setHasSubmittedApplication(response.records && response.records.length > 0);
    }).catch(() => setHasSubmittedApplication(false));
  }, []);

  const formTypes = [
    {
      id: 1,
      titleKey: 'forms.application.customTitle',
      descriptionKey: 'forms.application.customDesc',
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
        {showSuccess && (
          <div className="mb-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  {successMessage}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    onClick={() => setShowSuccess(false)}
                    className="inline-flex bg-green-50 dark:bg-green-900/20 rounded-md p-1.5 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                  >
                    <span className="sr-only">关闭</span>
                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('forms.page.customTitle')}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">{t('forms.page.customSubtitle')}</p>
        </div>

        {isSubmissionClosed && (
          <div className="mb-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {submissionClosedContent[language as 'zh' | 'en'].title}
                </h2>
                <div className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
                  {submissionClosedContent[language as 'zh' | 'en'].description.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold self-start">
                {submissionClosedContent[language as 'zh' | 'en'].badge}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {formTypes.map((form) => {
            const isLocked = (form.id !== 1 && !hasApproved) || (form.id === 1 && hasSubmittedApplication);
            const isDisabled = isSubmissionClosed || isLocked;
            const cardClasses = `bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-shadow duration-300 ${
              isDisabled ? 'pointer-events-none opacity-50' : 'hover:shadow-lg'
            }`;

            const statusBadge = () => {
              if (isSubmissionClosed) {
                return (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-600">
                    {submissionClosedContent[language as 'zh' | 'en'].badge}
                  </span>
                );
              }
              if (form.id === 1) {
                return hasSubmittedApplication ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-500">
                    已提交
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {t('forms.start.fill')} →
                  </span>
                );
              }
              if (hasApproved) {
                return (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {t('forms.start.fill')} →
                  </span>
                );
              }
              return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-500">
                  {t('forms.disabled.need.approved')}
                </span>
              );
            };

            const content = (
              <div className="text-center">
                <div className="text-4xl mb-4">{form.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t(form.titleKey)}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{t(form.descriptionKey)}</p>
                <div className="mt-4">{statusBadge()}</div>
              </div>
            );

            if (isDisabled) {
              return (
                <div key={form.id} className={cardClasses}>
                  {content}
                </div>
              );
            }

            return (
              <Link key={form.id} href={form.link} className={cardClasses}>
                {content}
              </Link>
            );
          })}
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

export default function Forms() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">加载中...</p>
        </div>
      </div>
    }>
      <FormsContent />
    </Suspense>
  );
}
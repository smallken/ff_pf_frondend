'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import LogoutConfirmModal from '../components/LogoutConfirmModal';

export default function Process() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      setShowLogoutModal(true);
    } else {
      router.push('/register');
    }
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    router.push('/register');
  };
  const steps = [
    {
      step: 1,
      title: t('process.step1.title'),
      description: t('process.step1.description'),
      icon: '📝',
      details: [
        t('process.step1.detail1'),
        t('process.step1.detail2'),
        t('process.step1.detail3'),
        t('process.step1.detail4')
      ]
    },
    {
      step: 2,
      title: t('process.step2.title'),
      description: t('process.step2.description'),
      icon: '📄',
      details: [
        t('process.step2.detail1'),
        t('process.step2.detail2'),
        t('process.step2.detail3'),
        t('process.step2.detail4')
      ]
    },
    {
      step: 3,
      title: t('process.step3.title'),
      description: t('process.step3.description'),
      icon: '📋',
      details: [
        t('process.step3.detail1'),
        t('process.step3.detail2'),
        t('process.step3.detail3'),
        t('process.step3.detail4')
      ]
    },
    {
      step: 4,
      title: t('process.step4.title'),
      description: t('process.step4.description'),
      icon: '⏳',
      details: [
        t('process.step4.detail1'),
        t('process.step4.detail2'),
        t('process.step4.detail3'),
        t('process.step4.detail4')
      ]
    },
    {
      step: 5,
      title: t('process.step5.title'),
      description: t('process.step5.description'),
      icon: '🎁',
      details: [
        t('process.step5.detail1'),
        t('process.step5.detail2'),
        t('process.step5.detail3'),
        t('process.step5.detail4')
      ]
    },
    {
      step: 6,
      title: t('process.step6.title'),
      description: t('process.step6.description'),
      icon: '🌟',
      details: [
        t('process.step6.detail1'),
        t('process.step6.detail2'),
        t('process.step6.detail3'),
        t('process.step6.detail4')
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-sky-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-gray-800 relative overflow-hidden">
      {/* Background decorative elements - Flowing Lines and Circles */}
      <div className="absolute inset-0">
        <svg className="absolute top-0 left-0 w-full h-64 text-indigo-200 dark:text-indigo-900/30" viewBox="0 0 1200 320" preserveAspectRatio="none">
          <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" fill="currentColor" opacity="0.3"></path>
        </svg>
        <div className="absolute top-20 right-12 w-20 h-20 bg-gradient-to-r from-blue-300 to-sky-400 opacity-15 animate-pulse delay-500" style={{clipPath: 'circle(50% at 50% 50%)'}}></div>
        <div className="absolute bottom-40 left-16 w-16 h-16 bg-gradient-to-r from-indigo-300 to-blue-400 opacity-15 animate-bounce delay-1500" style={{clipPath: 'circle(50% at 50% 50%)'}}></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-gradient-to-r from-sky-300 to-cyan-400 opacity-15 animate-ping delay-2500" style={{clipPath: 'circle(50% at 50% 50%)'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-full text-sm font-medium mb-8 shadow-lg">
            <span className="mr-2">🚀</span>
            Process Guide
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent mb-6">{t('process.page.title')}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">{t('process.page.subtitle')}</p>
        </div>

        {/* 流程步骤 */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <div key={step.step} className="flex group">
              {/* 步骤编号 */}
              <div className="flex-shrink-0 relative">
                <div className={`w-16 h-16 rounded-2xl text-white flex items-center justify-center text-xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                  step.step % 2 === 1 
                    ? 'bg-gradient-to-r from-indigo-500 to-blue-600' 
                    : 'bg-gradient-to-r from-blue-500 to-sky-600'
                }`}>
                  {step.step}
                </div>
                <div className={`absolute -inset-2 rounded-2xl opacity-20 blur-lg group-hover:opacity-30 transition-opacity duration-300 ${
                  step.step % 2 === 1 
                    ? 'bg-gradient-to-r from-indigo-500 to-blue-600' 
                    : 'bg-gradient-to-r from-blue-500 to-sky-600'
                }`}></div>
                {index < steps.length - 1 && (
                  <div className="h-32 w-1 bg-gradient-to-b from-indigo-300 to-blue-300 dark:from-indigo-700 dark:to-blue-700 mx-auto mt-4 rounded-full"></div>
                )}
              </div>

              {/* 步骤内容 */}
              <div className="ml-8 flex-1">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-indigo-100 dark:border-gray-700 relative overflow-hidden group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1">
                  <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full -translate-y-16 translate-x-16 ${
                    step.step % 3 === 1 
                      ? 'bg-gradient-to-bl from-indigo-200 to-blue-300 dark:from-indigo-800 dark:to-blue-900' 
                      : step.step % 3 === 2
                      ? 'bg-gradient-to-bl from-blue-200 to-sky-300 dark:from-blue-800 dark:to-sky-900'
                      : 'bg-gradient-to-bl from-sky-200 to-cyan-300 dark:from-sky-800 dark:to-cyan-900'
                  }`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-4 shadow-lg ${
                        step.step % 3 === 1 
                          ? 'bg-gradient-to-r from-indigo-400 to-blue-500' 
                          : step.step % 3 === 2
                          ? 'bg-gradient-to-r from-blue-400 to-sky-500'
                          : 'bg-gradient-to-r from-sky-400 to-cyan-500'
                      }`}>
                        <span className="text-2xl">{step.icon}</span>
                      </div>
                      <h3 className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                        step.step % 3 === 1 
                          ? 'from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400' 
                          : step.step % 3 === 2
                          ? 'from-blue-600 to-sky-600 dark:from-blue-400 dark:to-sky-400'
                          : 'from-sky-600 to-cyan-600 dark:from-sky-400 dark:to-cyan-400'
                      }`}>{step.title}</h3>
                    </div>
                    
                    <div className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {step.step === 1 ? (
                        <p>
                          {t('process.step1.custom')}
                        </p>
                      ) : step.step === 3 ? (
                        <p>
                          {t('process.step3.fill.form')}
                          <a href="/forms/achievement" className="mx-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium underline transition-colors duration-200">
                            {t('process.step3.achievement.form')}
                          </a>
                        </p>
                      ) : step.step === 2 ? (
                        <div>
                          <p className="mb-2">{step.description}</p>
                          <p>
                            {t('process.organize.activity')}
                            <a href="/forms/activity" className="mx-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium underline transition-colors duration-200">
                              {t('process.activity.form')}
                            </a>
                          </p>
                        </div>
                      ) : (
                        <p>{step.description}</p>
                      )}
                    </div>
                    
                    <div className={`rounded-2xl p-6 ${
                      step.step % 3 === 1 
                        ? 'bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-700' 
                        : step.step % 3 === 2
                        ? 'bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 border border-blue-200 dark:border-blue-700'
                        : 'bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 border border-sky-200 dark:border-sky-700'
                    }`}>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                        {t('process.details.title')}
                      </h4>
                      <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* 移除“立即注册/开始填写申请表”按钮 */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 社交媒体链接 */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 rounded-3xl p-8 text-center border border-blue-200 dark:border-blue-700 shadow-xl">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-sky-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <span className="text-2xl">🌐</span>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 dark:from-blue-400 dark:to-sky-400 bg-clip-text text-transparent">{t('process.social.title')}</h3>
          </div>
          <div className="flex justify-center space-x-6 flex-wrap gap-y-4">
            <a href="https://x.com/flipfloplaunch" target="_blank" rel="noopener noreferrer" className="group flex items-center px-6 py-3 bg-gradient-to-r from-gray-800 to-black text-white rounded-2xl font-semibold hover:from-gray-900 hover:to-gray-800 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
              <span className="mr-2">𝕏</span>
              X (Twitter)
            </a>
            <a href="https://t.me/flipflopEn" target="_blank" rel="noopener noreferrer" className="group flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
              <span className="mr-2">📱</span>
              Telegram EN
            </a>
            <a href="https://t.me/flipflopChi" target="_blank" rel="noopener noreferrer" className="group flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
              <span className="mr-2">📱</span>
              Telegram 中文
            </a>
            <a href="https://discord.com/invite/DtwkgAyD" target="_blank" rel="noopener noreferrer" className="group flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
              <span className="mr-2">💬</span>
              Discord
            </a>
          </div>
        </div>
      </div>

      {/* 退出确认弹窗 */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}
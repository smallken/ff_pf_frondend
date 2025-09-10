'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">👣</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                {t('home.title')}
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            <Link href="/honor" className="relative px-4 py-2 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group">
              <span className="relative z-10">{t('honor.title')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/ranking" className="relative px-4 py-2 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300 group">
              <span className="relative z-10">{t('ranking.title')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/process" className="relative px-4 py-2 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300 group">
              <span className="relative z-10">{t('process.title')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/forms" className="relative px-4 py-2 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 group">
              <span className="relative z-10">{t('forms.title')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
              title={t('theme.toggle')}
            >
              <span className="text-lg">{theme === 'light' ? '🌙' : '☀️'}</span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
              title={t('language.toggle')}
            >
              {language === 'zh' ? 'EN' : '中文'}
            </button>

            {/* User Actions */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <Link href="/profile" className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300">
                  {t('profile.title')}
                </Link>
                <Link href="/admin" className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300">
                  {t('admin.title')}
                </Link>
                <span className="text-gray-600 dark:text-gray-300 font-medium">{t('user.welcome')}, {userName}</span>
                <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-0.5 font-medium">
                  {t('user.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300">
                  {t('login.title')}
                </Link>
                <Link href="/register" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:-translate-y-0.5 font-semibold shadow-lg hover:shadow-xl">
                  {t('register.title')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
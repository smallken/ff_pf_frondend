'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();

  // 确定当前模块
  const getCurrentModule = () => {
    if (pathname.startsWith('/pathfinders')) return 'pathfinders';
    if (pathname.startsWith('/launch-contest')) return 'launch';
    if (pathname.startsWith('/mint-contest')) return 'mint';
    return 'pathport';
  };

  const currentModule = getCurrentModule();

  // 获取模块特定的导航配置
  const getModuleConfig = () => {
    switch (currentModule) {
      case 'pathfinders':
        return {
          logo: { icon: '👣', text: 'Flipflop Footprint', href: '/pathfinders' },
          navItems: [
            { href: '/pathfinders/honor', key: 'honor.title', color: 'blue' },
            { href: '/pathfinders/ranking', key: 'ranking.title', color: 'emerald' },
            { href: '/pathfinders/process', key: 'process.title', color: 'indigo' },
            { href: '/pathfinders/forms', key: 'forms.title', color: 'purple' },
          ]
        };
      case 'launch':
        return {
          logo: { icon: '🚀', text: 'Launch Contest', href: '/launch-contest' },
          navItems: [
            { href: '/launch-contest/rules', key: { zh: '大赛规则', en: 'Contest Rules' }, color: 'cyan' },
            { href: '/launch-contest/registration', key: { zh: '参赛登记', en: 'Registration' }, color: 'blue' },
            { href: '/launch-contest/leaderboard', key: { zh: '参赛名单', en: 'Participant List' }, color: 'purple' },
            { href: '/launch-contest/timeline', key: { zh: '赛事时间线', en: 'Timeline' }, color: 'indigo' },
            { href: '/launch-contest/dd-questionnaire', key: { zh: 'DD问答清单', en: 'DD Questionnaire' }, color: 'pink' },
          ]
        };
      case 'mint':
        return {
          logo: { icon: '🎮', text: 'Mint Contest', href: '/mint-contest' },
          navItems: [
            { href: '/mint-contest/rules', key: { zh: '大赛规则', en: 'Contest Rules' }, color: 'pink' },
            { href: '/mint-contest/registration', key: { zh: '参赛登记', en: 'Registration' }, color: 'red' },
          ]
        };
      default: // pathport
        return {
          logo: { icon: '⛵', text: 'FlipFlop PathPort', href: '/' },
          navItems: [
            { href: '/pathfinders', key: { zh: '脚印计划', en: 'Footprint Program' }, color: 'blue', icon: '👣' },
            { href: '/launch-contest', key: { zh: 'Launch大赛', en: 'Launch Contest' }, color: 'cyan', icon: '🚀' },
            { href: '/mint-contest', key: { zh: 'Mint大赛', en: 'Mint Contest' }, color: 'pink', icon: '🎮' },
          ]
        };
    }
  };

  const moduleConfig = getModuleConfig();

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={moduleConfig.logo.href} className="flex items-center space-x-3 group">
              <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">{moduleConfig.logo.icon}</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                {moduleConfig.logo.text}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className={`hidden md:flex ${currentModule === 'mint' ? 'justify-center flex-1 mx-8' : currentModule === 'pathport' ? 'justify-center flex-1 mx-8' : 'space-x-0.5'}`}>
            {moduleConfig.navItems.map((item) => {
              const displayText = (() => {
                if (currentModule === 'pathfinders') {
                  return t(item.key as string);
                } else if (currentModule === 'pathport' || currentModule === 'launch' || currentModule === 'mint') {
                  return typeof item.key === 'object' 
                    ? (item.key as any)[language as 'zh' | 'en']
                    : item.key;
                } else {
                  return item.key as string;
                }
              })();

              // 为主页导航添加特殊样式
              if (currentModule === 'pathport') {
                const getButtonStyle = (color: string) => {
                  switch (color) {
                    case 'blue':
                      return {
                        linkClass: "relative mx-4 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-400 font-bold rounded-xl hover:from-blue-500/20 hover:to-purple-500/20 hover:border-blue-400/40 hover:text-blue-300 transition-all duration-300 group whitespace-nowrap shadow-lg hover:shadow-blue-500/25 hover:scale-105 transform",
                        bgClass: "absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      };
                    case 'cyan':
                      return {
                        linkClass: "relative mx-4 px-6 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-400 font-bold rounded-xl hover:from-cyan-500/20 hover:to-blue-500/20 hover:border-cyan-400/40 hover:text-cyan-300 transition-all duration-300 group whitespace-nowrap shadow-lg hover:shadow-cyan-500/25 hover:scale-105 transform",
                        bgClass: "absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      };
                    case 'pink':
                      return {
                        linkClass: "relative mx-4 px-6 py-3 bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/20 text-pink-400 font-bold rounded-xl hover:from-pink-500/20 hover:to-red-500/20 hover:border-pink-400/40 hover:text-pink-300 transition-all duration-300 group whitespace-nowrap shadow-lg hover:shadow-pink-500/25 hover:scale-105 transform",
                        bgClass: "absolute inset-0 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      };
                    default:
                      return {
                        linkClass: "relative mx-4 px-6 py-3 bg-gradient-to-r from-gray-500/10 to-gray-600/10 border border-gray-500/20 text-gray-400 font-bold rounded-xl hover:from-gray-500/20 hover:to-gray-600/20 hover:border-gray-400/40 hover:text-gray-300 transition-all duration-300 group whitespace-nowrap shadow-lg hover:shadow-gray-500/25 hover:scale-105 transform",
                        bgClass: "absolute inset-0 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      };
                  }
                };

                const buttonStyle = getButtonStyle(item.color);
                
                return (
                  <Link key={item.href} href={item.href} className={buttonStyle.linkClass}>
                    <span className="relative z-10 text-sm font-bold flex items-center space-x-2">
                      <span className="text-lg">{(item as any).icon}</span>
                      <span>{displayText}</span>
                    </span>
                    <div className={buttonStyle.bgClass}></div>
                  </Link>
                );
              }

              // 为Mint大赛导航添加特殊样式
              const linkClassName = currentModule === 'mint' 
                ? "relative mx-4 px-8 py-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 text-red-400 font-bold rounded-2xl hover:from-red-500/20 hover:to-pink-500/20 hover:border-red-400/40 hover:text-red-300 transition-all duration-300 group whitespace-nowrap shadow-lg hover:shadow-red-500/25 hover:scale-105 transform"
                : "relative px-3 py-2 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group whitespace-nowrap";

              const backgroundClassName = currentModule === 'mint'
                ? "absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                : "absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300";

              return (
                <Link key={item.href} href={item.href} className={linkClassName}>
                  <span className={`relative z-10 ${currentModule === 'mint' ? 'text-base font-bold' : 'text-sm'}`}>
                    {displayText}
                  </span>
                  <div className={backgroundClassName}></div>
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme Toggle for mobile - Hidden for Launch and Mint contests */}
            {(currentModule !== 'launch' && currentModule !== 'mint') && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                title={t('theme.toggle')}
              >
                <span className="text-lg">{theme === 'light' ? '🌙' : '☀️'}</span>
              </button>
            )}

            {/* Language Toggle for mobile */}
            <button
              onClick={toggleLanguage}
              className="px-2 py-1 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              title={t('language.toggle')}
            >
              {language === 'zh' ? 'EN' : '中文'}
            </button>

            {/* Hamburger menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Theme Toggle - Hidden for Launch and Mint contests */}
            {(currentModule !== 'launch' && currentModule !== 'mint') && (
              <button
                onClick={toggleTheme}
                className="p-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
                title={t('theme.toggle')}
              >
                <span className="text-lg">{theme === 'light' ? '🌙' : '☀️'}</span>
              </button>
            )}

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
              title={t('language.toggle')}
            >
              {language === 'zh' ? 'EN' : '中文'}
            </button>

            {/* User Actions */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 whitespace-nowrap">
                <Link href="/profile" className="px-2 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300">
                  {t('profile.title')}
                </Link>
                {user?.userRole === 'admin' && (
                  <Link href="/admin" className="px-2 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300">
                    {t('admin.title')}
                  </Link>
                )}
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{t('user.welcome')}, {user?.userName}</span>
                <button 
                  onClick={logout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-medium"
                >
                  {t('user.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 whitespace-nowrap">
                <Link href="/login" className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300">
                  {t('login.title')}
                </Link>
                <Link href="/register" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-semibold shadow-lg hover:shadow-xl">
                  {t('register.title')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {/* Navigation Links */}
            <div className="space-y-1">
              {moduleConfig.navItems.map((item) => {
                const icons = {
                  'honor.title': '🏆',
                  'ranking.title': '📊',
                  'process.title': '🔄',
                  'forms.title': '📝',
                  '脚印计划': '👣',
                  'Footprint Program': '👣',
                  'Launch大赛': '🚀',
                  'Launch Contest': '🚀',
                  'Mint大赛': '🎮',
                  'Mint Contest': '🎮',
                  '大赛规则': '📋',
                  'Contest Rules': '📋',
                  '参赛登记': '✍️',
                  'Registration': '✍️',
                  '参赛名单': '📋',
                  'Participant List': '📋',
                  '赛事时间线': '⏰',
                  'Timeline': '⏰',
                  'DD问答清单': '📝',
                  'DD Questionnaire': '📝',
                  '作品画廊': '🎨',
                  'Gallery': '🎨',
                };
                const displayKey = (() => {
                  if (currentModule === 'pathfinders') {
                    return t(item.key as string);
                  } else if (currentModule === 'pathport' || currentModule === 'launch' || currentModule === 'mint') {
                    return typeof item.key === 'object' 
                      ? (item.key as any)[language as 'zh' | 'en']
                      : item.key;
                  } else {
                    return item.key as string;
                  }
                })();
                const icon = icons[displayKey as keyof typeof icons] || '🔗';
                
                
                return (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className="block px-4 py-3 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 whitespace-nowrap"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="inline-flex items-center space-x-2">
                      <span>{icon}</span>
                      <span>{displayKey}</span>
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* User Actions for Mobile */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              {isAuthenticated ? (
                <div className="space-y-1">
                  <Link 
                    href="/profile" 
                    className="block px-4 py-3 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    👤 {t('profile.title')}
                  </Link>
                  {user?.userRole === 'admin' && (
                    <Link 
                      href="/admin" 
                      className="block px-4 py-3 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      ⚙️ {t('admin.title')}
                    </Link>
                  )}
                  <div className="px-4 py-2 text-gray-600 dark:text-gray-400 text-sm">
                    {t('user.welcome')}, {user?.userName}
                  </div>
                  <button 
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-medium"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    🚪 {t('user.logout')}
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link 
                    href="/login" 
                    className="block px-4 py-3 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🔑 {t('login.title')}
                  </Link>
                  <Link 
                    href="/register" 
                    className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-semibold shadow-lg text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ✨ {t('register.title')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
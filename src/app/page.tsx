'use client';

import { useLanguage } from './contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4.5rem)] flex items-center overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0">
          {/* Animated gradient orbs */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-32 right-20 w-80 h-80 bg-gradient-to-r from-cyan-400/15 to-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
          {/* Floating geometric shapes */}
          <div className="absolute top-24 left-1/4 w-12 h-12 opacity-10 animate-bounce delay-500">
            <svg viewBox="0 0 100 100" className="w-full h-full text-blue-500">
              <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="currentColor"/>
            </svg>
          </div>
          <div className="absolute top-40 right-1/3 w-10 h-10 opacity-15 animate-bounce delay-1500">
            <svg viewBox="0 0 100 100" className="w-full h-full text-purple-500">
              <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="currentColor"/>
            </svg>
          </div>
          <div className="absolute bottom-32 right-1/4 w-11 h-11 opacity-12 animate-bounce delay-3000">
            <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-500">
              <circle cx="50" cy="50" r="45" fill="currentColor"/>
            </svg>
          </div>
          
          {/* Animated lines */}
          <svg className="absolute top-0 left-0 w-full h-full opacity-5" viewBox="0 0 1200 800">
            <path d="M0,400 Q300,200 600,400 T1200,400" stroke="url(#gradient1)" strokeWidth="2" fill="none">
              <animate attributeName="d" 
                values="M0,400 Q300,200 600,400 T1200,400;M0,400 Q300,600 600,400 T1200,400;M0,400 Q300,200 600,400 T1200,400" 
                dur="8s" repeatCount="indefinite"/>
            </path>
            <path d="M0,300 Q400,100 800,300 T1200,300" stroke="url(#gradient2)" strokeWidth="1.5" fill="none">
              <animate attributeName="d" 
                values="M0,300 Q400,100 800,300 T1200,300;M0,300 Q400,500 800,300 T1200,300;M0,300 Q400,100 800,300 T1200,300" 
                dur="10s" repeatCount="indefinite"/>
            </path>
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6"/>
                <stop offset="50%" stopColor="#8B5CF6"/>
                <stop offset="100%" stopColor="#06B6D4"/>
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06B6D4"/>
                <stop offset="50%" stopColor="#3B82F6"/>
                <stop offset="100%" stopColor="#8B5CF6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center">
            {/* Animated badge */}
            <div className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-200/30 dark:border-blue-700/30 rounded-full text-sm font-medium mb-6 shadow-lg animate-pulse">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping"></span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                🚀 Join the Flipflop Community
              </span>
            </div>

            {/* Enhanced title with gradient and animation */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent animate-pulse">
                {t('home.hero.title')}
              </span>
            </h1>

            {/* Enhanced subtitle */}
            <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              <span className="bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-300 dark:to-gray-400 bg-clip-text text-transparent">
                {t('home.subtitle')}
              </span>
            </p>

            {/* Enhanced action buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
              <a
                href="/register"
                className="group relative px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl font-semibold text-base min-w-[180px]"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <span className="mr-2">🚀</span>
                  {t('home.join')}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </a>
              <a
                href="/process"
                className="group relative px-8 py-3 border-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg font-semibold text-base min-w-[180px] backdrop-blur-sm"
              >
                <span className="flex items-center justify-center">
                  <span className="mr-2">📚</span>
                  {t('home.learn')}
                </span>
              </a>
            </div>

            {/* Stats or feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="group p-5 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">1000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Active Pathfinders</div>
              </div>
              <div className="group p-5 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Projects Completed</div>
              </div>
              <div className="group p-5 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-2xl mb-2">💎</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Rewards Distributed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-10 animate-pulse delay-2000"></div>
          <div className="absolute bottom-32 right-10 w-16 h-16 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full opacity-10 animate-pulse delay-3000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left side - Text content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium mb-6 shadow-lg">
                <span className="mr-2">🌟</span>
                Connect With Us
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
                {t('home.social.title')}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {t('home.social.desc')}
              </p>
              <div className="flex items-center justify-center lg:justify-start space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>实时更新 · 社区活跃</span>
              </div>
            </div>
            
            {/* Right side - Social media icons and links */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* X (Twitter) */}
                <a
                  href="https://x.com/flipfloplaunch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center">
                    <div className="w-14 h-14 bg-gradient-to-r from-gray-900 to-black dark:from-white dark:to-gray-200 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="w-7 h-7 text-white dark:text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-lg">X (Twitter)</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">flipfloplaunch</div>
                      <div className="text-xs text-blue-500 mt-1">实时更新 →</div>
                    </div>
                  </div>
                </a>

                {/* Discord */}
                <a
                  href="https://discord.com/invite/DtwkgAyD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center">
                    <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-lg">Discord</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Community</div>
                      <div className="text-xs text-indigo-500 mt-1">实时交流 →</div>
                    </div>
                  </div>
                </a>

                {/* Telegram Global */}
                <a
                  href="https://t.me/flipflopEng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-lg">Telegram</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t('home.social.global')}</div>
                      <div className="text-xs text-blue-500 mt-1">🌍 Global →</div>
                    </div>
                  </div>
                </a>

                {/* Telegram Chinese */}
                <a
                  href="https://t.me/flipflopChi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-lg">Telegram</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t('home.social.chinese')}</div>
                      <div className="text-xs text-blue-500 mt-1">🇨🇳 中文 →</div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-12 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-800 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Background decorative elements - Hexagons and Triangles */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-8 left-8 w-20 h-20 bg-gradient-to-r from-purple-300 to-pink-400 opacity-15 animate-spin" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}></div>
              <div className="absolute top-20 right-12 w-16 h-16 bg-gradient-to-r from-blue-300 to-cyan-400 opacity-15 animate-bounce" style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'}}></div>
              <div className="absolute bottom-16 left-1/4 w-12 h-12 bg-gradient-to-r from-green-300 to-blue-400 opacity-15 animate-pulse delay-1000" style={{clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'}}></div>
              <div className="absolute bottom-32 right-16 w-14 h-14 bg-gradient-to-r from-pink-300 to-purple-400 opacity-15 animate-ping delay-2000" style={{clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'}}></div>
            </div>
            
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100 dark:border-gray-700">
              {/* Header with icons */}
              <div className="flex justify-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <span className="text-2xl">🔗</span>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full">
                    <span className="text-2xl">🚀</span>
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium mb-6">
                  <span className="mr-2">✨</span>
                  Proof of Mint (PoM) & URC
                </div>
                
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                  {t('home.description')}
                </p>

                {/* Key features grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                      <span className="text-white text-lg">🏗️</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('home.features.builder.title')}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">{t('home.features.builder.desc')}</p>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mb-3">
                      <span className="text-white text-lg">👥</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('home.features.community.title')}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">{t('home.features.community.desc')}</p>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-3">
                      <span className="text-white text-lg">🎯</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('home.features.growth.title')}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">{t('home.features.growth.desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-tr from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-800 dark:via-emerald-900 dark:to-gray-900 relative overflow-hidden">
        {/* Background decorative elements - Diamonds and Stars */}
        <div className="absolute inset-0">
          <div className="absolute top-12 left-16 w-16 h-16 bg-gradient-to-r from-emerald-300 to-teal-400 opacity-20 animate-pulse" style={{clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'}}></div>
          <div className="absolute top-32 right-20 w-12 h-12 bg-gradient-to-r from-cyan-300 to-blue-400 opacity-20 animate-spin" style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'}}></div>
          <div className="absolute bottom-24 left-1/4 w-20 h-20 bg-gradient-to-r from-teal-300 to-emerald-400 opacity-15 animate-bounce delay-1000" style={{clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'}}></div>
          <div className="absolute bottom-16 right-12 w-14 h-14 bg-gradient-to-r from-blue-300 to-cyan-400 opacity-20 animate-ping delay-2000" style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full text-sm font-medium mb-8 shadow-lg">
              <span className="mr-2">🎯</span>
              Our Mission
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-6">
              {t('home.mission.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-emerald-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🌍</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t('home.mission.community')}</p>
            </div>
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🚀</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t('home.mission.incubation')}</p>
            </div>
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🎁</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t('home.mission.rewards')}</p>
            </div>
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🤝</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t('home.mission.builder')}</p>
            </div>
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-indigo-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">👣</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t('home.mission.footprints')}</p>
            </div>
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-teal-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📋</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                {t('home.mission.quote')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pathfinders Benefits Section */}
      <section className="py-16 bg-gradient-to-bl from-rose-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-orange-900/10 dark:to-gray-800 relative overflow-hidden">
        {/* Background decorative elements - Waves and Curves */}
        <div className="absolute inset-0">
          <svg className="absolute top-0 left-0 w-full h-32 text-rose-200 dark:text-rose-900/30" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity="0.25" fill="currentColor"></path>
          </svg>
          <div className="absolute top-16 right-8 w-24 h-24 bg-gradient-to-r from-orange-300 to-amber-400 opacity-15 animate-pulse" style={{clipPath: 'ellipse(50% 25% at 50% 50%)'}}></div>
          <div className="absolute bottom-20 left-12 w-32 h-16 bg-gradient-to-r from-rose-300 to-pink-400 opacity-15 animate-bounce delay-1000" style={{clipPath: 'ellipse(60% 40% at 50% 50%)'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 dark:from-rose-400 dark:to-orange-400 bg-clip-text text-transparent mb-4">
              ✨ {t('home.pathfinders.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('home.pathfinders.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. Flipprints 积分荣誉体系 */}
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 dark:border-gray-700">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">👣</span>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent text-center">{t('home.pathfinders.benefits.flipprints.title')}</h3>
              <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed space-y-2">
                <p>• {t('home.pathfinders.benefits.flipprints.desc1')}</p>
                <p>• {t('home.pathfinders.benefits.flipprints.desc2')}</p>
              </div>
            </div>

            {/* 2. 丰厚激励与专属奖励 */}
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-emerald-100 dark:border-gray-700">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent text-center">{t('home.pathfinders.benefits.rewards.title')}</h3>
              <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed space-y-2">
                <p>• {t('home.pathfinders.benefits.rewards.desc1')}</p>
                <p>• {t('home.pathfinders.benefits.rewards.desc2')}</p>
              </div>
            </div>

            {/* 3. 创业与融资支持 */}
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100 dark:border-gray-700">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🚀</span>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent text-center">{t('home.pathfinders.benefits.funding.title')}</h3>
              <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed space-y-2">
                <p>• {t('home.pathfinders.benefits.funding.desc1')}</p>
                <p>• {t('home.pathfinders.benefits.funding.desc2')}</p>
              </div>
            </div>

            {/* 4. Launchpad 特权 */}
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-100 dark:border-gray-700">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent text-center">{t('home.pathfinders.benefits.launchpad.title')}</h3>
              <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed space-y-2">
                <p>• {t('home.pathfinders.benefits.launchpad.desc1')}</p>
                <p>• {t('home.pathfinders.benefits.launchpad.desc2')}</p>
              </div>
            </div>

            {/* 5. Ambassador NFT 身份徽章 */}
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-indigo-100 dark:border-gray-700">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🏅</span>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent text-center">{t('home.pathfinders.benefits.nft.title')}</h3>
              <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed space-y-2">
                <p>• {t('home.pathfinders.benefits.nft.desc1')}</p>
                <p>• {t('home.pathfinders.benefits.nft.desc2')}</p>
              </div>
            </div>

            {/* 6. 社区影响力与共建权 */}
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-teal-100 dark:border-gray-700">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🌟</span>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent text-center">{t('home.pathfinders.benefits.community.title')}</h3>
              <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed space-y-2">
                <p>• {t('home.pathfinders.benefits.community.desc1')}</p>
                <p>• {t('home.pathfinders.benefits.community.desc2')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-gradient-to-tr from-slate-50 via-gray-50 to-zinc-50 dark:from-gray-800 dark:via-slate-900 dark:to-gray-900 relative overflow-hidden">
        {/* Background decorative elements - Lines and Dots */}
        <div className="absolute inset-0">
          <div className="absolute top-8 left-8 w-1 h-32 bg-gradient-to-b from-blue-400 to-purple-500 opacity-20 animate-pulse"></div>
          <div className="absolute top-16 right-16 w-32 h-1 bg-gradient-to-r from-green-400 to-teal-500 opacity-20 animate-pulse delay-500"></div>
          <div className="absolute bottom-12 left-1/3 w-3 h-3 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full opacity-30 animate-bounce delay-1000"></div>
          <div className="absolute bottom-24 right-1/4 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-30 animate-ping delay-1500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-600 to-gray-700 text-white rounded-full text-sm font-medium mb-8 shadow-lg">
              <span className="mr-2">🚀</span>
              Quick Access
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <a
              href="/honor"
              className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 text-center border border-amber-100 dark:border-gray-700 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl">🎖️</span>
                </div>
                <div className="font-bold text-lg bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">{t('honor.title')}</div>
              </div>
            </a>
            <a
              href="/ranking"
              className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 text-center border border-emerald-100 dark:border-gray-700 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl">🏅</span>
                </div>
                <div className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">{t('ranking.title')}</div>
              </div>
            </a>
            <a
              href="/process"
              className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 text-center border border-blue-100 dark:border-gray-700 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl">🚀</span>
                </div>
                <div className="font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">{t('process.title')}</div>
              </div>
            </a>
            <a
              href="/forms"
              className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 text-center border border-purple-100 dark:border-gray-700 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">{t('forms.title')}</div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

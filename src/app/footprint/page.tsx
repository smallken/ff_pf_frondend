'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import LogoutConfirmModal from '../components/LogoutConfirmModal';
import { userService } from '@/services';
import type { LoginUserVO } from '@/types/api';

export default function Home() {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // 提示弹窗相关状态
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [promptModalType, setPromptModalType] = useState<'qq' | 'wallet'>('qq'); // 弹窗类型：qq或wallet
  const [userInfo, setUserInfo] = useState<LoginUserVO | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    qqGroup: '',
    qqNumber: '',
    walletAddressSol: '',
    walletAddressBsc: '',
    country: ''
  });
  
  // 处理表单输入变化
  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 获取用户信息
  const fetchUserInfo = async () => {
    if (!isAuthenticated) return;
    
    try {
      const user = await userService.getLoginUser();
      setUserInfo(user);
      // 初始化编辑表单数据
      setEditForm({
        qqGroup: user.qqGroup || '',
        qqNumber: user.qqNumber || '',
        walletAddressSol: user.walletAddressSol || '',
        walletAddressBsc: user.walletAddressBsc || '',
        country: user.country || ''
      });
      
      // 检查：如果用户是中国用户且QQ群号或QQ号为空，显示QQ类型的提示弹窗
      if (user.country === 'China' && (!user.qqGroup || !user.qqNumber)) {
        setPromptModalType('qq');
        setShowPromptModal(true);
      }
      
      // 检查：如果钱包地址为空，显示wallet类型的提示弹窗
      else if (!user.walletAddressSol || !user.walletAddressBsc) {
        setPromptModalType('wallet');
        setShowPromptModal(true);
      }
      
      // 检查：如果所在国家地区是中国，QQ群号和QQ号不能为空
      const isChina = user.country === 'China';
      if (isChina) {
        const needQQGroup = !user.qqGroup || user.qqGroup.trim() === '';
        const needQQNumber = !user.qqNumber || user.qqNumber.trim() === '';
        
        if (needQQGroup || needQQNumber) {
          setPromptModalType('qq');
          setShowPromptModal(true);
        }
      }
    } catch (error: any) {
      console.error('获取用户信息失败:', error);
    }
  };

  // 组件挂载时获取用户信息
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserInfo();
    }
  }, [isAuthenticated]);

  const handleJoinClick = (e: React.MouseEvent) => {
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
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent animate-pulse">
                {t('home.hero.title')}
              </span>
            </h1>

            {/* Enhanced subtitle */}
            <p className="text-base sm:text-lg md:text-2xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              <span className="bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-300 dark:to-gray-400 bg-clip-text text-transparent">
                {t('home.subtitle')}
              </span>
            </p>

            {/* Enhanced action buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-4">
              <a
                href="/"
                className="group relative px-6 sm:px-8 py-3 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-2xl hover:from-pink-500 hover:to-purple-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl font-semibold text-sm sm:text-base w-full sm:w-auto sm:min-w-[180px] text-center"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <span className="mr-2">⛵</span>
                  {language === 'zh' ? '返回港湾' : 'Back to PathPort'}
                </span>
              </a>
              <button
                onClick={handleJoinClick}
                className="group relative px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl font-semibold text-sm sm:text-base w-full sm:w-auto sm:min-w-[180px] text-center"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <span className="mr-2">🚀</span>
                  {t('home.join')}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </button>
              <a
                href="/footprint/process"
                className="group relative px-6 sm:px-8 py-3 border-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg font-semibold text-sm sm:text-base w-full sm:w-auto sm:min-w-[180px] backdrop-blur-sm text-center"
              >
                <span className="flex items-center justify-center">
                  <span className="mr-2">📚</span>
                  {t('home.learn')}
                </span>
              </a>
            </div>

            {/* Stats or feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
              <div className="group p-5 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-2xl mb-2">👣</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">1000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{t('home.stats.contributors')}</div>
              </div>
              <div className="group p-5 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{t('home.stats.projects')}</div>
              </div>
              <div className="group p-5 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-2xl mb-2">💎</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">2000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{t('home.stats.creative')}</div>
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
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-4 sm:mb-6 px-2">
              {t('home.mission.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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


      {/* Footprint Benefits Section */}
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
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 dark:from-rose-400 dark:to-orange-400 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
              ✨ {t('home.pathfinders.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              {t('home.pathfinders.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* 1. Footprint 积分荣誉体系 */}
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
              {/* Main content */}
              <div className="text-center">
                <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-8">
                  {language === 'zh' ? 'POM机制' : 'POM Mechanism'}
                </h2>
                
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                  {t('home.description')}
                </p>
                
                <div className="flex justify-center">
                  <a
                    href="https://docsend.com/view/r9rz54y2ggvwny4j"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {language === 'zh' ? '查看白皮书' : 'View Whitepaper'}
                  </a>
                </div>
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
              <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
                {t('home.social.title')}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {t('home.social.desc')}
              </p>
              <div className="flex items-center justify-center lg:justify-start space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>{t('home.social.realtime')}</span>
              </div>
            </div>
            
            {/* Right side - Social media icons and links */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
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
                      <span className="text-2xl text-white dark:text-black font-extrabold">X</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-lg">X (Twitter)</div>
                      <div className="text-xs text-blue-500 mt-1">{t('home.social.twitter.update')}</div>
                    </div>
                  </div>
                </a>

                {/* Discord */}
                <a
                  href="https://discord.com/invite/2kaGjSy6hr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center">
                    <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-lg">Discord</div>
                      <div className="text-xs text-indigo-500 mt-1">{t('home.social.discord.chat')}</div>
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
                      <div className="text-xs text-blue-500 mt-1">🌍 Global →</div>
                    </div>
                  </div>
                </a>

                {/* 官方ff入口 */}
                <a
                  href="https://www.flipflop.plus/?utm_source=tokenpocket"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center">
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-lg">{t('home.social.official.title')}</div>
                      <div className="text-xs text-purple-500 mt-1">{t('home.social.official.visit')}</div>
                    </div>
                  </div>
                </a>

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
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <a
              href="/footprint/honor"
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
              href="/footprint/ranking"
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
              href="/footprint/process"
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
              href="/footprint/forms"
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

      

      {/* 提示弹窗 */}
      {showPromptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                  {language === 'zh' ? '完善个人资料' : 'Complete Your Profile'}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {promptModalType === 'qq' ? 
                  (language === 'zh' ? '为了更好地为您服务，请先完善以下QQ信息：' : 'To better serve you, please complete the following QQ information:')
                  : (language === 'zh' ? '为了更好地为您服务，请先完善以下钱包地址信息：' : 'To better serve you, please complete the following wallet address information:')
                }
              </p>
            </div>

            <div className="space-y-4">
              {/* QQ信息输入 */}
              {promptModalType === 'qq' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'zh' ? 'QQ群号' : 'QQ Group'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.qqGroup}
                      onChange={(e) => handleInputChange('qqGroup', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={language === 'zh' ? '请输入QQ群号' : 'Enter QQ Group'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'zh' ? 'QQ号' : 'QQ Number'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.qqNumber}
                      onChange={(e) => handleInputChange('qqNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={language === 'zh' ? '请输入QQ号' : 'Enter QQ Number'}
                    />
                  </div>
                </>
              )}

              {/* 钱包地址输入 */}
              {promptModalType === 'wallet' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'zh' ? 'Solana钱包地址' : 'Solana Wallet Address'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.walletAddressSol}
                      onChange={(e) => handleInputChange('walletAddressSol', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder={language === 'zh' ? '请输入Solana钱包地址' : 'Enter Solana Wallet Address'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'zh' ? 'BSC钱包地址' : 'BSC Wallet Address'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.walletAddressBsc}
                      onChange={(e) => handleInputChange('walletAddressBsc', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder={language === 'zh' ? '请输入BSC钱包地址' : 'Enter BSC Wallet Address'}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowPromptModal(false)}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {language === 'zh' ? '稍后填写' : 'Fill Later'}
              </button>
              <button
                onClick={async () => {
                  // 保存信息
                  try {
                    setEditLoading(true);
                    const updateData: any = {};
                    
                    // 根据弹窗类型添加相应的字段
                    if (promptModalType === 'qq') {
                      updateData.qqGroup = editForm.qqGroup;
                      updateData.qqNumber = editForm.qqNumber;
                    } else {
                      updateData.walletAddressSol = editForm.walletAddressSol;
                      updateData.walletAddressBsc = editForm.walletAddressBsc;
                    }
                    
                    await userService.updateMyInfo(updateData);
                    // 重新获取用户信息
                    await fetchUserInfo();
                    setShowPromptModal(false);
                    alert(language === 'zh' ? '信息保存成功！' : 'Information saved successfully!');
                  } catch (error: any) {
                    console.error('保存信息失败:', error);
                    alert(error.message || (language === 'zh' ? '保存失败，请重试' : 'Failed to save, please try again'));
                  } finally {
                    setEditLoading(false);
                  }
                }}
                disabled={editLoading}
                className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-md hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {language === 'zh' ? '保存中...' : 'Saving...'}
                  </div>
                ) : (
                  language === 'zh' ? '保存' : 'Save'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 退出确认弹窗 */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}

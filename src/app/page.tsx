'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from './contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LogoutConfirmModal from './components/LogoutConfirmModal';

const shillUsContent = {
  title: { zh: 'ShillUs', en: 'ShillUs' },
  tagline: { zh: '通过预约 AMA 展示自我', en: 'Showcase your vision with a dedicated AMA' },
  description: {
    zh: '若您是项目方、社区、KOL、MCN、活动主办方、开发者、媒体、培训机构、风投、孵化器、中心化交易所、去中心化交易所等，欢迎展示自我并成为我们的合作伙伴。',
    en: 'Projects, communities, KOLs, studios, event hosts, builders, media, educators, investors, incubators, centralized or decentralized exchanges—partner with us to share your story.'
  },
  highlight: {
    zh: '向我们的观众展示您的身份、正在构建的事业以及未来方向。预约专属 AMA，我们将在次日于 X 平台发布合作海报，触达北美、中国、非洲、欧洲、日韩、东南亚、印度等地区的观众。',
    en: 'Spotlight who you are, what you are building, and where you are heading. Book an exclusive AMA and we will publish the co-branded poster on X the next day, reaching audiences across North America, China, Africa, Europe, Japan & Korea, Southeast Asia, India, and beyond.'
  },
  schedule: {
    zh: '时间：每周一、三、五 12:00-13:00（UTC）',
    en: 'Schedule: Monday, Wednesday & Friday · 12:00–13:00 (UTC)'
  },
  requirements: {
    zh: ['填写项目名称及简介', 'Twitter 账号'],
    en: ['Project name and short introduction', 'Twitter handle']
  },
  ctaPrimary: { zh: '立即预约', en: 'Book your slot' },
  ctaSecondary: { zh: '了解 Twitter AMA 专场', en: 'Learn about the Twitter AMA' },
  calendlyLink: 'https://calendly.com/shillus-ffpp/60min',
  secondaryLink: 'https://twitter.com/FlipFlopShillUs'
};

// 模块卡片数据
const moduleCards = [
  {
    id: 'footprint',
    title: { zh: 'Footprint 脚印计划', en: 'Footprint Program' },
    subtitle: { zh: '每一枚脚印，都是共同的印记', en: 'Every footprint is a shared mark' },
    description: { zh: '这里是内容创作者的舞台，你的声音与作品，将与伙伴们一起留下足迹，共建属于大家的社区。', en: 'This is the stage for creators — where your voice and your work join others to co-build a community that belongs to all.' },
    icon: '👣',
    gradient: 'from-pink-300 via-pink-400 to-pink-500',
    href: '/footprint'
  },
  {
    id: 'launch',
    title: { zh: 'Launch 大赛', en: 'Launch Competition' },
    subtitle: { zh: '从这里点火，让梦想升空', en: 'Ignite your vision and watch it soar' },
    description: { zh: 'FlipFlop 是项目启航的港湾，也是驶向远方的起点，让你的代币从此被世界看见。', en: 'FlipFlop is the harbor where projects launch, the starting point for tokens to be seen by the world.' },
    icon: '🚀',
    gradient: 'from-blue-400 via-blue-500 to-blue-600',
    href: '/launch-contest'
  },
  {
    id: 'mint',
    title: { zh: 'Mint 大赛', en: 'Mint Competition' },
    subtitle: { zh: '投资的不只是代币，更是未来', en: "You're not just minting a token — you're investing in the future" },
    description: { zh: '每一次铸造，都是你与优质项目并肩前行的承诺，共享价值与成长。', en: 'Every mint is a commitment to grow alongside promising projects and share in their value.' },
    icon: '🎮',
    gradient: 'from-red-400 via-red-500 to-red-600',
    href: '/mint-contest'
  }
];

export default function PathPortHome() {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'popu' | 'com2u' | 'taptap'>('popu');
  const [activeSection, setActiveSection] = useState<string>('');

  const handleCardClick = (card: typeof moduleCards[0]) => {
    router.push(card.href);
  };

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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll spy to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['shillus', 'coming-soon'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Floating Sidebar Navigation */}
      <nav className="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 z-50">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-white/40 dark:border-gray-700/40 shadow-xl p-4">
          <div className="mb-3 px-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {language === 'zh' ? '快速导航' : 'Quick Nav'}
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => scrollToSection('shillus')}
              className={`group relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 text-left ${
                activeSection === 'shillus'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  activeSection === 'shillus' ? 'bg-white' : 'bg-blue-500'
                }`}></span>
                <span>{language === 'zh' ? 'ShillUs' : 'ShillUs'}</span>
              </div>
            </button>
            <button
              onClick={() => scrollToSection('coming-soon')}
              className={`group relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 text-left ${
                activeSection === 'coming-soon'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  activeSection === 'coming-soon' ? 'bg-white' : 'bg-purple-500'
                }`}></span>
                <span>{language === 'zh' ? '即将上线' : 'Coming Soon'}</span>
              </div>
            </button>
          </div>
        </div>
      </nav>

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
          <div className="text-center mb-16">
            {/* Animated badge */}
            <div className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-200/30 dark:border-blue-700/30 rounded-full text-sm font-medium mb-6 shadow-lg animate-pulse">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping"></span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  ⛵ 
              </span>
            </div>

            {/* Enhanced title with gradient and animation */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
                {language === 'zh' ? 'FlipFlop PathPort 足迹港湾' : 'FlipFlop PathPort'}
              </span>
            </h1>

            {/* Enhanced subtitle */}
            <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              <span className="bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-300 dark:to-gray-400 bg-clip-text text-transparent">
                {language === 'zh' 
                  ? '"在这里，每一枚脚印都承载着梦想，每一段旅程都能找到归宿"'
                  : '"Here, every footprint carries a dream, every journey finds its home"'
                }
              </span>
            </p>

          </div>

          {/* Module Cards Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            {moduleCards.map((card) => (
              <div
                key={card.id}
                className="group relative overflow-hidden rounded-3xl bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                onClick={() => handleCardClick(card)}
              >
                {/* Card Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Card Content */}
                <div className="relative p-8 h-full flex flex-col">
                  {/* Icon */}
                  <div className="text-6xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className={`text-2xl font-bold mb-3 text-center bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                    {card.title[language as 'zh' | 'en']}
                  </h3>
                  
                  {/* Subtitle */}
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
                    {card.subtitle[language as 'zh' | 'en']}
                  </p>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-center flex-grow">
                    {card.description[language as 'zh' | 'en']}
                  </p>
                  
                  {/* Enter Button */}
                  <div className="mt-6 text-center">
                    <span className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${card.gradient} text-white rounded-full font-medium shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      {language === 'zh' ? '进入' : 'Enter'}
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                    </div>
                  </div>
              </div>
            ))}
          </div>

          {/* ShillUs Showcase Section */}
          <section id="shillus" className="relative mb-20 scroll-mt-20">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/10 to-cyan-500/20 dark:from-blue-500/15 dark:via-purple-500/10 dark:to-cyan-500/15 blur-3xl rounded-3xl"></div>
            <div className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-gray-700/40 bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl shadow-2xl">
              <div className="absolute -top-32 -right-24 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-20 w-64 h-64 bg-gradient-to-br from-cyan-400/25 to-blue-500/15 rounded-full blur-3xl"></div>

              <div className="relative px-8 py-10 md:px-12 md:py-12">
                <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[2fr,1fr] lg:items-center">
                  <div>
                    <div className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-blue-500/15 to-purple-500/20 border border-white/40 dark:border-gray-700/50 rounded-full text-xs md:text-sm font-semibold text-blue-700 dark:text-blue-200 uppercase tracking-wide mb-6">
                      <span className="w-2 h-2 mr-2 rounded-full bg-blue-500 animate-pulse"></span>
                      {shillUsContent.title[language as 'zh' | 'en']}
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 dark:from-blue-300 dark:via-purple-300 dark:to-cyan-300 bg-clip-text text-transparent mb-4">
                      {shillUsContent.tagline[language as 'zh' | 'en']}
                    </h2>

                    <p className="text-base md:text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
                      {shillUsContent.description[language as 'zh' | 'en']}
                    </p>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                      {shillUsContent.highlight[language as 'zh' | 'en']}
                    </p>

                    <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                      <div className="p-5 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-white/50 dark:border-gray-700/60 shadow-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-semibold">⏰</span>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                            {language === 'zh' ? '预约时间' : 'Schedule'}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {shillUsContent.schedule[language as 'zh' | 'en']}
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-white/50 dark:border-gray-700/60 shadow-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-lg font-semibold">📝</span>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                            {language === 'zh' ? '预约需提供' : 'Required Details'}
                          </h3>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          {shillUsContent.requirements[language as 'zh' | 'en'].map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="relative p-6 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 text-white shadow-xl">
                    <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-white/20 blur-xl"></div>
                    <div className="relative">
                      <h3 className="text-xl font-semibold mb-2">Calendly</h3>
                      <p className="text-sm text-white/80 mb-6">
                        {shillUsContent.title[language as 'zh' | 'en']} · FlipFlop PathPort
                      </p>

                      <div className="space-y-4">
                        <a
                          href={shillUsContent.calendlyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full px-5 py-3 rounded-full bg-white text-blue-600 font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                          {shillUsContent.ctaPrimary[language as 'zh' | 'en']}
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </a>
                      </div>

                      <p className="text-xs text-white/60 mt-6 leading-relaxed">
                        {language === 'zh'
                          ? '预约成功后，我们会与你确认具体环节并准备合作海报与物料。'
                          : 'After booking, we will confirm the flow with you and prepare the co-branded visual assets.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Coming Soon Programs - Tabbed Section */}
          <section id="coming-soon" className="relative mb-20 scroll-mt-20">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/10 to-blue-500/20 dark:from-purple-500/15 dark:via-pink-500/10 dark:to-blue-500/15 blur-3xl rounded-3xl"></div>
            <div className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-gray-700/40 bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl shadow-2xl">
              <div className="absolute -top-32 -left-24 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -right-20 w-64 h-64 bg-gradient-to-br from-pink-400/25 to-purple-500/15 rounded-full blur-3xl"></div>

              <div className="relative px-8 py-10 md:px-12 md:py-12">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-purple-500/15 to-pink-500/20 border border-white/40 dark:border-gray-700/50 rounded-full text-xs md:text-sm font-semibold text-purple-700 dark:text-purple-200 uppercase tracking-wide mb-6">
                    <span className="w-2 h-2 mr-2 rounded-full bg-purple-500 animate-pulse"></span>
                    {language === 'zh' ? '即将上线' : 'Coming Soon'}
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-300 dark:via-pink-300 dark:to-blue-300 bg-clip-text text-transparent mb-8">
                    {language === 'zh' ? '探索更多精彩功能' : 'Explore More Features'}
                  </h2>
                </div>

                {/* Tabs Navigation */}
                <div className="flex justify-center mb-10">
                  <div className="inline-flex p-1 bg-white/50 dark:bg-gray-800/50 rounded-full border border-white/40 dark:border-gray-700/40 backdrop-blur-sm">
                    <button
                      onClick={() => setActiveTab('popu')}
                      className={`px-6 py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ${
                        activeTab === 'popu'
                          ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white shadow-lg'
                          : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                      }`}
                    >
                      PopU
                    </button>
                    <button
                      onClick={() => setActiveTab('com2u')}
                      className={`px-6 py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ${
                        activeTab === 'com2u'
                          ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white shadow-lg'
                          : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
                      }`}
                    >
                      Com2U
                    </button>
                    <button
                      onClick={() => setActiveTab('taptap')}
                      className={`px-6 py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ${
                        activeTab === 'taptap'
                          ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white shadow-lg'
                          : 'text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400'
                      }`}
                    >
                      Tap-Tap-Earn
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-[500px]">
                  {/* PopU Content */}
                  {activeTab === 'popu' && (
                    <div className="animate-fadeIn">
                      <div className="text-center mb-8">
                        <h3 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-300 dark:via-pink-300 dark:to-blue-300 bg-clip-text text-transparent mb-4">
                          PopU
                        </h3>
                        <p className="text-lg md:text-xl font-semibold bg-gradient-to-r from-purple-700 to-pink-700 dark:from-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
                          {language === 'zh' ? '人气爆棚！轻松找到最适合你的CDN、KOL和MCN' : 'Popular you! Easily find out your best CDN, KOL and MCN'}
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-white/50 dark:border-gray-700/60 shadow-lg">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl">🚀</span>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{language === 'zh' ? '项目方' : 'For Projects'}</h4>
                          </div>
                          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                            {language === 'zh' ? '作为项目方，你需要建立品牌形象并传递发展动态，以此凝聚社区与用户。过去，你只能寻找虚假粉丝平台，高价购买KOL服务却无法评估效果或申请退款。PopU汇聚真实社区、内容分发网络、优质KOL及MCN，为你提供更多选择。' : 'As a project party, you need to build your branding and convey your development to build up community and users. In the past, you could only look for fake fans platform, KOL to pay a premium but no way to evaluate results and request refunds. PopU collects the real community, content delivery networks, best KOLs and MCNs to provide you with more options.'}
                          </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-white/50 dark:border-gray-700/60 shadow-lg">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 text-white text-2xl">💼</span>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{language === 'zh' ? 'KOL/MCN/社区' : 'For KOL/MCN/Community'}</h4>
                          </div>
                          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                            {language === 'zh' ? '作为KOL/MCN，您助力项目方塑造品牌形象并传递信息；作为社群运营者，您投入精力资金维护社群，却难以实现流量变现。过去您只能通过推荐渠道接洽项目方，如今PopU汇聚各类项目方，为您拓展合作渠道与商业伙伴。' : 'As a KOL/MCN, you help project parties build branding and convey messages to everyone. As a community, you spend energy and money to fun your community, but hard to monetize your traffic. In the past, you could only contact them by referral. PopU collects all kinds of project parties, providing more options and business partners for you.'}
                          </p>
                        </div>
                      </div>
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 border border-purple-300/50 dark:border-purple-600/50 mb-6">
                        <h4 className="text-lg font-bold text-purple-900 dark:text-purple-200 mb-4 text-center">{language === 'zh' ? '保障您的权益' : 'Ensure your payment'}</h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/40 dark:bg-gray-800/40">
                            <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold">1</span>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{language === 'zh' ? '标准任务包/定制任务' : 'Standard and customized task package'}</span>
                          </div>
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/40 dark:bg-gray-800/40">
                            <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold">2</span>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{language === 'zh' ? '第三方支付' : 'Third-party payment'}</span>
                          </div>
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/40 dark:bg-gray-800/40">
                            <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold">3</span>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{language === 'zh' ? '评论任务结果' : 'Comment task result'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-full font-semibold shadow-lg">{language === 'zh' ? '即将上线...' : 'Coming Soon...'}</span>
                      </div>
                    </div>
                  )}

                  {/* Com2U Content */}
                  {activeTab === 'com2u' && (
                    <div className="animate-fadeIn">
                      <div className="text-center mb-8">
                        <h3 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-300 dark:via-emerald-300 dark:to-teal-300 bg-clip-text text-transparent mb-4">Com2U</h3>
                        <p className="text-lg md:text-xl font-semibold bg-gradient-to-r from-green-700 to-teal-700 dark:from-green-200 dark:to-teal-200 bg-clip-text text-transparent">{language === 'zh' ? '社区为你服务！在此获取资金、市场与社群支持。' : 'Community to you! Get funds, market, and community here.'}</p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-white/50 dark:border-gray-700/60 shadow-lg">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-500 text-white text-2xl">📊</span>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{language === 'zh' ? '项目方痛点' : 'Project Pain Points'}</h4>
                          </div>
                          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{language === 'zh' ? '作为项目方，过去你只能：向千家风投路演，漫长等待融资；支付高额KOL营销费；向社群支付高额佣金。过高的融资与运营成本不断稀释你的收益。' : 'As a project party, in the past, you could only: pitch to 1000 VCs and wait a looooong way to funding; pay KOL premiums to do marketing; pay high commissions to the community. Too much funding and operational costs dilute your revenue.'}</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-white/50 dark:border-gray-700/60 shadow-lg">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-green-500 text-white text-2xl">💔</span>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{language === 'zh' ? '社区痛点' : 'Community Pain Points'}</h4>
                          </div>
                          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{language === 'zh' ? '作为社区成员，过去您只能投资高估值的项目。可恶！代币发行后他们立即抛售！风投套现离场，项目方撤资，损失全由社区承担。' : 'As a community, in the past, you could only invest in a project with a high VC evaluation. Damn！they dump once TGE！VC cashes out, project parties drop, leaving the loss to the community.'}</p>
                        </div>
                      </div>
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-teal-500/10 dark:from-green-500/20 dark:to-teal-500/20 border border-green-300/50 dark:border-green-600/50 mb-6">
                        <h4 className="text-lg font-bold text-green-900 dark:text-green-200 mb-4 text-center">{language === 'zh' ? 'Com2U 双赢解决方案' : 'Com2U Win-Win Solution'}</h4>
                        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{language === 'zh' ? '在Com2U平台，项目方可获得资金与流动性支持；得到推广大使；得到真实用户与社区资源。社区才是我们真正的投资者、推广者和用户。社区能参与具备实际应用、代币经济模型及长期规划的潜力项目早期阶段。Com2U将利润回馈给真实投资者和用户。' : 'In Com2U, project parties can get funds and liquidity; get promotion ambassadors; get real users and community. The community is our ultimate investors, ambassadors, and users. The community can participate in the earliest phase of potential projects with real applications, tokenomics, and long-term roadmaps. Com2U returns the profit to real investors and users.'}</p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-white/50 dark:border-gray-700/60 shadow-lg">
                          <h4 className="text-lg font-bold text-green-900 dark:text-green-200 mb-3">{language === 'zh' ? '如何找到社区' : 'How to catch your community'}</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{language === 'zh' ? '上传项目描述至Com2U，即可获得社区匹配。您也可主动搜索心仪社区并发起匹配。' : 'Upload your project description to Com2U, you will get matching inquiries from the community. You can also search for your favorite community and submit a matching request.'}</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-white/50 dark:border-gray-700/60 shadow-lg">
                          <h4 className="text-lg font-bold text-teal-900 dark:text-teal-200 mb-3">{language === 'zh' ? '如何找到项目' : 'How to catch your project'}</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{language === 'zh' ? '将社区描述上传至Com2U，即可接收项目方的匹配。您也可主动搜索目标项目并提交匹配。' : 'Upload your community description to Com2U, you will get matching inquiries from the project parties. You can also search for your favorite project and submit a matching request.'}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-full font-semibold shadow-lg">{language === 'zh' ? '即将上线...' : 'Coming Soon...'}</span>
                      </div>
                    </div>
                  )}

                  {/* Tap-Tap-Earn Content */}
                  {activeTab === 'taptap' && (
                    <div className="animate-fadeIn">
                      <div className="text-center mb-8">
                        <h3 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-300 dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent mb-4">{language === 'zh' ? '点点赚计划' : 'Tap-Tap-Earn Program'}</h3>
                        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed">{language === 'zh' ? '点点赚是CDN（内容分发网络），让项目方轻松获取社区增长与社媒增长' : 'Tap-Tap-Earn is CDN (Content Delivery Network) helping project parties build up get community increase and social media increase'}</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 border border-cyan-300/50 dark:border-cyan-600/50 mb-8">
                        <h4 className="text-lg font-bold text-cyan-900 dark:text-cyan-200 mb-4 text-center">{language === 'zh' ? '全球社区覆盖' : 'Global Community Coverage'}</h4>
                        <div className="flex flex-wrap justify-center gap-3">
                          {[{ zh: '非洲', en: 'Africa' }, { zh: '印度', en: 'India' }, { zh: '东南亚', en: 'Southeast Asia' }, { zh: '中国', en: 'China' }, { zh: '日韩', en: 'Japan-Korea' }, { zh: '欧洲', en: 'Europe' }, { zh: '北美', en: 'North America' }].map((region, index) => (
                            <span key={index} className="inline-flex items-center px-4 py-2 bg-white/60 dark:bg-gray-800/60 border border-cyan-300/50 dark:border-cyan-600/50 rounded-full text-sm font-medium text-cyan-900 dark:text-cyan-200">🌍 {region[language as 'zh' | 'en']}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white rounded-full font-semibold shadow-lg">{language === 'zh' ? '即将上线...' : 'Coming Soon...'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

        </div>
      </section>

      {/* 退出确认弹窗 */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}

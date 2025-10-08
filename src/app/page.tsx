'use client';

import { useState } from 'react';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
          <section className="relative mb-20">
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

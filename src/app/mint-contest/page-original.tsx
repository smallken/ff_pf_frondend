'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function MintContest() {
  const { language } = useLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const pixelCards = [
    {
      icon: '🎮',
      title: language === 'zh' ? '工作室组' : 'Studio Category',
      subtitle: language === 'zh' ? '专业团队参赛' : 'Professional Teams',
      description: language === 'zh' 
        ? '面向专业游戏工作室和开发团队，展示大型项目和完整作品'
        : 'For professional game studios and development teams, showcasing large-scale projects and complete works',
      gradient: 'from-red-500 to-pink-600',
      href: '/mint-contest/studio'
    },
    {
      icon: '👤',
      title: language === 'zh' ? '个人组' : 'Individual Category',
      subtitle: language === 'zh' ? '独立开发者' : 'Independent Developers',
      description: language === 'zh'
        ? '面向独立开发者和个人创作者，展示创意作品和独特想法'
        : 'For independent developers and individual creators, showcasing creative works and unique ideas',
      gradient: 'from-cyan-500 to-blue-600',
      href: '/mint-contest/individual'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white relative overflow-hidden">
      {/* 像素背景效果 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 98%, rgba(255, 107, 107, 0.3) 100%),
            linear-gradient(0deg, transparent 98%, rgba(78, 205, 196, 0.3) 100%)
          `,
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* 鼠标跟随效果 */}
      <div 
        className="absolute w-4 h-4 bg-yellow-400 rounded-sm opacity-60 pointer-events-none transition-all duration-100 ease-out"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          boxShadow: '0 0 20px #ffe66d'
        }}
      />

      <div className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* 返回按钮 */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-bold rounded-lg hover:from-gray-700 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 border-2 border-gray-600 hover:border-gray-500"
            >
              <span className="mr-2">🏠</span>
              {language === 'zh' ? '返回港湾' : 'Back to PathPort'}
            </a>
          </motion.div>

          {/* 主标题区域 */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 font-mono">
              <span className="bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
                MINT
              </span>
            </h1>
            <h2 className="text-2xl md:text-4xl font-bold text-cyan-400 mb-4 font-mono">
              {language === 'zh' ? '铸造狂欢季' : 'MINT CARNIVAL'}
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {language === 'zh' 
                ? '像素艺术的终极舞台，8-bit风格的创作盛宴。无论是专业工作室还是独立开发者，这里都是展示你创意的最佳平台！'
                : 'The ultimate stage for pixel art, an 8-bit style creative feast. Whether you are a professional studio or an independent developer, this is the best platform to showcase your creativity!'
              }
            </p>
          </motion.div>

          {/* 参赛组别卡片 */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {pixelCards.map((card, index) => (
              <motion.div
                key={index}
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = card.href}
              >
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border-2 border-gray-700 rounded-2xl p-8 h-full relative overflow-hidden">
                  {/* 像素边框效果 */}
                  <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-r from-red-500 via-cyan-500 to-yellow-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl" />
                  
                  <div className="relative z-10">
                    <div className="text-6xl mb-4">{card.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-2 font-mono">
                      {card.title}
                    </h3>
                    <h4 className="text-lg font-semibold text-cyan-400 mb-4 font-mono">
                      {card.subtitle}
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      {card.description}
                    </p>
                    
                    <div className="mt-6">
                      <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-lg hover:from-red-400 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 font-mono">
                        <span className="mr-2">🎯</span>
                        {language === 'zh' ? '立即参赛' : 'Join Now'}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* 特色功能展示 */}
          <motion.div
            className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className="text-3xl font-bold text-center mb-8 font-mono text-yellow-400">
              {language === 'zh' ? '🎮 像素艺术特色' : '🎮 Pixel Art Features'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-4">🎨</div>
                <h4 className="text-xl font-bold text-red-400 mb-2 font-mono">
                  {language === 'zh' ? '8-bit 风格' : '8-bit Style'}
                </h4>
                <p className="text-gray-300 text-sm">
                  {language === 'zh' 
                    ? '经典像素艺术风格，复古游戏美学'
                    : 'Classic pixel art style with retro gaming aesthetics'
                  }
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h4 className="text-xl font-bold text-cyan-400 mb-2 font-mono">
                  {language === 'zh' ? '创意竞赛' : 'Creative Competition'}
                </h4>
                <p className="text-gray-300 text-sm">
                  {language === 'zh' 
                    ? '展示你的像素艺术创作才华'
                    : 'Showcase your pixel art creative talent'
                  }
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">👥</div>
                <h4 className="text-xl font-bold text-yellow-400 mb-2 font-mono">
                  {language === 'zh' ? '社区投票' : 'Community Voting'}
                </h4>
                <p className="text-gray-300 text-sm">
                  {language === 'zh' 
                    ? '社区参与评选最佳作品'
                    : 'Community participation in selecting the best works'
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

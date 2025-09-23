'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

export default function LaunchContestForms() {
  const router = useRouter();
  const { language } = useLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // 鼠标跟踪效果
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white relative overflow-hidden">
      {/* 科技背景效果 */}
      <div className="absolute inset-0">
        {/* 网格背景 */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#00ffff" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* 动态粒子 */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              animate={{
                x: [Math.random() * 1200, Math.random() * 1200],
                y: [Math.random() * 800, Math.random() * 800],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>

        {/* 鼠标光晕效果 */}
        <div 
          className="absolute w-96 h-96 bg-cyan-500 rounded-full opacity-10 blur-3xl pointer-events-none transition-all duration-300"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      </div>

      {/* 主要内容 */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-6xl mx-auto text-center">
            {/* 返回按钮 */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <button
                onClick={() => router.push('/launch-contest')}
                className="inline-flex items-center px-4 py-2 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition-all duration-300 text-sm font-medium"
              >
                <span className="mr-2">←</span>
                {language === 'zh' ? '返回大赛首页' : 'Back to Contest'}
              </button>
            </motion.div>

            {/* 主标题 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                📋 {language === 'zh' ? '表格申请' : 'Form Applications'}
              </h1>
              <h2 className="text-2xl md:text-4xl font-bold mb-8 text-cyan-300">
                {language === 'zh' ? '选择您需要的申请表格' : 'Choose Your Application Form'}
              </h2>
            </motion.div>

            {/* 描述文字 */}
            <motion.p 
              className="text-lg md:text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              {language === 'zh' ? (
                <>
                  参与 Flipflop Launch 大赛需要完成两个步骤：<span className="text-cyan-400 font-bold">参赛登记</span> 和 <span className="text-purple-400 font-bold">DD问答清单</span>。
                  请按照顺序完成这两个表格，确保信息完整准确。
                </>
              ) : (
                <>
                  Participating in Flipflop Launch Competition requires two steps: <span className="text-cyan-400 font-bold">Registration</span> and <span className="text-purple-400 font-bold">DD Questionnaire</span>.
                  Please complete both forms in order to ensure complete and accurate information.
                </>
              )}
            </motion.p>

            {/* 表格申请 */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              {/* 参赛登记表 */}
              <motion.div
                onClick={() => router.push('/launch-contest/registration')}
                className="group relative overflow-hidden bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8 cursor-pointer tech-glow hover:border-cyan-400/50 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-3xl">📝</span>
                  </div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                    {language === 'zh' ? '参赛登记表' : 'Registration Form'}
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {language === 'zh' 
                      ? '填写项目基本信息，包括代币信息、团队介绍等核心内容'
                      : 'Fill in basic project information, including token details, team introduction and core content'
                    }
                  </p>
                  <div className="inline-flex items-center text-cyan-400 font-medium group-hover:text-cyan-300 transition-colors duration-300">
                    <span>{language === 'zh' ? '立即填写' : 'Fill Now'}</span>
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </motion.div>

              {/* DD问答清单 */}
              <motion.div
                onClick={() => router.push('/launch-contest/dd-questionnaire')}
                className="group relative overflow-hidden bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 cursor-pointer tech-glow hover:border-purple-400/50 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-3xl">❓</span>
                  </div>
                  <h3 className="text-2xl font-bold text-purple-400 mb-4">
                    {language === 'zh' ? 'DD问答清单' : 'DD Questionnaire'}
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {language === 'zh' 
                      ? '完成项目深度问答，展示项目价值、技术实力和发展规划'
                      : 'Complete in-depth project Q&A to showcase project value, technical strength and development plans'
                    }
                  </p>
                  <div className="inline-flex items-center text-purple-400 font-medium group-hover:text-purple-300 transition-colors duration-300">
                    <span>{language === 'zh' ? '开始问答' : 'Start Q&A'}</span>
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* 提示信息 */}
            <motion.div 
              className="mt-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-2xl mr-3">💡</span>
                  <h4 className="text-lg font-bold text-yellow-400">
                    {language === 'zh' ? '申请提示' : 'Application Tips'}
                  </h4>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {language === 'zh' 
                    ? '建议先完成参赛登记表，再填写DD问答清单。两个表格都需要完整填写才能成功参与大赛。'
                    : 'We recommend completing the registration form first, then the DD questionnaire. Both forms must be completed to successfully participate in the competition.'
                  }
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { SimpleParticleBackground } from '../components/launch-contest/SimpleParticleBackground';
import { TechButton } from '../components/launch-contest/TechButton';
import { TechCard } from '../components/launch-contest/TechCard';

export default function LaunchContestHomeUpgraded() {
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

  const handleCardClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white relative overflow-hidden">
      {/* 专业粒子背景效果 */}
      <SimpleParticleBackground />
      
      {/* 科技网格背景 */}
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

      {/* 鼠标跟随光效 */}
      <div 
        className="absolute w-32 h-32 bg-cyan-500/20 rounded-full blur-xl pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 64,
          top: mousePosition.y - 64,
        }}
      />

      <div className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* 返回按钮 */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <TechButton
              onClick={() => router.push('/')}
              variant="secondary"
              icon="🏠"
            >
              {language === 'zh' ? '返回港湾' : 'Back to PathPort'}
            </TechButton>
          </motion.div>

          {/* 主标题区域 */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1 
              className="text-7xl md:text-9xl font-bold mb-6"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                LAUNCH
              </span>
            </motion.h1>
            <motion.h2 
              className="text-3xl md:text-5xl font-bold text-cyan-400 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {language === 'zh' ? '代币发射大赛' : 'Token Launch Contest'}
            </motion.h2>
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {language === 'zh' 
                ? '科技驱动的代币发射平台，为创新项目提供专业的发射服务和社区支持。'
                : 'Technology-driven token launch platform, providing professional launch services and community support for innovative projects.'
              }
            </motion.p>
          </motion.div>

          {/* 奖励亮点 */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <TechCard glowColor="cyan" className="mb-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-cyan-400 mb-6">
                  {language === 'zh' ? '🎯 奖励机制' : '🎯 Reward Mechanism'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🎓</div>
                    <h4 className="text-xl font-bold text-white mb-2">
                      {language === 'zh' ? '毕业奖励' : 'Graduation Rewards'}
                    </h4>
                    <p className="text-gray-300">
                      {language === 'zh' 
                        ? '完成所有阶段的项目将获得丰厚的毕业奖励'
                        : 'Projects completing all phases will receive generous graduation rewards'
                      }
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-4">🏆</div>
                    <h4 className="text-xl font-bold text-white mb-2">
                      {language === 'zh' ? '赛道排名奖励' : 'Track Ranking Rewards'}
                    </h4>
                    <p className="text-gray-300">
                      {language === 'zh' 
                        ? '各赛道前三名将获得额外的排名奖励'
                        : 'Top 3 in each track will receive additional ranking rewards'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </TechCard>
          </motion.div>

          {/* 赛事时间线预览 */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <TechCard glowColor="purple">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-purple-400 mb-8">
                  {language === 'zh' ? '⏰ 赛事时间线' : '⏰ Contest Timeline'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {[
                    { phase: language === 'zh' ? '报名阶段' : 'Registration', icon: '📝', color: 'cyan' },
                    { phase: language === 'zh' ? '项目提交' : 'Submission', icon: '🚀', color: 'blue' },
                    { phase: language === 'zh' ? '社区投票' : 'Voting', icon: '🗳️', color: 'purple' },
                    { phase: language === 'zh' ? '评审阶段' : 'Review', icon: '⚖️', color: 'pink' },
                    { phase: language === 'zh' ? '结果公布' : 'Results', icon: '🏆', color: 'yellow' }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                    >
                      <div className="text-4xl mb-3">{item.icon}</div>
                      <h4 className="text-lg font-bold text-white">{item.phase}</h4>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TechCard>
          </motion.div>

          {/* 行动按钮 */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <TechButton
              onClick={() => handleCardClick('/launch-contest/registration')}
              variant="primary"
              size="lg"
              showArrow={true}
              icon="🚀"
            >
              {language === 'zh' ? '立即参赛' : 'Join Contest'}
            </TechButton>
            
            <TechButton
              onClick={() => handleCardClick('/launch-contest/rules')}
              variant="secondary"
              size="lg"
              icon="📜"
            >
              {language === 'zh' ? '查看规则' : 'View Rules'}
            </TechButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

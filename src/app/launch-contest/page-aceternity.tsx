'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { AuroraBackground } from '../components/aceternity/AuroraBackground';
import { BackgroundBeams } from '../components/aceternity/BackgroundBeams';
import { Card3D } from '../components/aceternity/Card3D';
import { Spotlight } from '../components/aceternity/Spotlight';
import { Button } from '../components/reactbits/ButtonSimple';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/reactbits/Card';

export default function LaunchContestAceternity() {
  const router = useRouter();
  const { language } = useLanguage();

  const handleCardClick = (href: string) => {
    router.push(href);
  };

  return (
    <AuroraBackground className="min-h-screen">
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* 返回按钮 */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              animated
              className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              🏠 {language === 'zh' ? '返回港湾' : 'Back to PathPort'}
            </Button>
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
              className="text-3xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {language === 'zh' ? '代币发射大赛' : 'Token Launch Contest'}
            </motion.h2>
            <motion.p 
              className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed"
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

          {/* 3D卡片展示区域 */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
              <Card3D className="h-80 w-64">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {language === 'zh' ? '项目发射' : 'Project Launch'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'zh' ? '专业的代币发射服务' : 'Professional token launch services'}
                  </p>
                </div>
              </Card3D>
              
              <Card3D className="h-80 w-64">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {language === 'zh' ? '竞赛奖励' : 'Contest Rewards'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'zh' ? '丰厚的奖励机制' : 'Generous reward mechanism'}
                  </p>
                </div>
              </Card3D>
              
              <Card3D className="h-80 w-64">
                <div className="text-center">
                  <div className="text-6xl mb-4">🌐</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {language === 'zh' ? '社区支持' : 'Community Support'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'zh' ? '强大的社区生态' : 'Strong community ecosystem'}
                  </p>
                </div>
              </Card3D>
            </div>
          </motion.div>

          {/* 聚光灯效果区域 */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Spotlight className="mx-auto bg-black/50">
              <div className="p-8 text-center">
                <h3 className="text-3xl font-bold text-white mb-6">
                  {language === 'zh' ? '🎯 奖励机制' : '🎯 Reward Mechanism'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card variant="glass" className="bg-white/10 border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        🎓 {language === 'zh' ? '毕业奖励' : 'Graduation Rewards'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-white/80">
                        {language === 'zh' 
                          ? '完成所有阶段的项目将获得丰厚的毕业奖励'
                          : 'Projects completing all phases will receive generous graduation rewards'
                        }
                      </CardDescription>
                    </CardContent>
                  </Card>
                  
                  <Card variant="glass" className="bg-white/10 border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        🏆 {language === 'zh' ? '赛道排名奖励' : 'Track Ranking Rewards'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-white/80">
                        {language === 'zh' 
                          ? '各赛道前三名将获得额外的排名奖励'
                          : 'Top 3 in each track will receive additional ranking rewards'
                        }
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Spotlight>
          </motion.div>

          {/* 光束背景区域 */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <BackgroundBeams className="h-64">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-6">
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
                      transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
                    >
                      <div className="text-4xl mb-3">{item.icon}</div>
                      <h4 className="text-lg font-bold text-white">{item.phase}</h4>
                    </motion.div>
                  ))}
                </div>
              </div>
            </BackgroundBeams>
          </motion.div>

          {/* 行动按钮 */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <Button
              onClick={() => handleCardClick('/launch-contest/registration')}
              variant="glow"
              size="lg"
              animated
              className="text-lg px-8 py-4"
            >
              🚀 {language === 'zh' ? '立即参赛' : 'Join Contest'}
            </Button>
            
            <Button
              onClick={() => handleCardClick('/launch-contest/rules')}
              variant="outline"
              size="lg"
              animated
              className="text-lg px-8 py-4 backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              📜 {language === 'zh' ? '查看规则' : 'View Rules'}
            </Button>
          </motion.div>
        </div>
      </div>
    </AuroraBackground>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export default function LaunchContestHome() {
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
            {/* 返回港湾按钮 */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition-all duration-300 text-sm font-medium"
              >
                <span className="mr-2">⛵</span>
{language === 'zh' ? '返回港湾' : 'Back to PathPort'}
              </a>
            </motion.div>

            {/* 主标题 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                🚀 {language === 'zh' ? 'Launch 大赛' : 'Launch Contest'}
              </h1>
              <h2 className="text-2xl md:text-4xl font-bold mb-8 text-cyan-300">
                {language === 'zh' ? '用代币点燃梦想，瓜分 30 万美金！' : 'Ignite Dreams with Tokens, Share $300K Prize Pool!'}
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
                  这不是一场普通的比赛，而是 <span className="text-cyan-400 font-bold">专属于 Web3 Builder 与 Dreamer 的盛典</span>。
                  无论你是打造应用的开发者、塑造叙事的 KOL，还是团结社群的组织者，只要你敢于用代币去定义未来，这里都欢迎你的加入。
                </>
              ) : (
                <>
                  This is not an ordinary competition, but a <span className="text-cyan-400 font-bold">festival exclusively for Web3 Builders and Dreamers</span>.
                  Whether you're a developer creating applications, a KOL shaping narratives, or an organizer uniting communities, as long as you dare to define the future with tokens, you're welcome to join.
                </>
              )}
            </motion.p>

            {/* 奖励亮点 */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 tech-glow">
                <div className="text-3xl mb-3">💵</div>
                <h3 className="text-cyan-400 font-bold mb-2">{language === 'zh' ? '现金奖励' : 'Cash Rewards'}</h3>
                <p className="text-gray-300 text-sm">{language === 'zh' ? '让你的创意立即获得回报' : 'Get immediate returns for your creativity'}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 tech-glow">
                <div className="text-3xl mb-3">🌐</div>
                <h3 className="text-blue-400 font-bold mb-2">{language === 'zh' ? '全球曝光' : 'Global Exposure'}</h3>
                <p className="text-gray-300 text-sm">{language === 'zh' ? '让你的项目被更多人看见' : 'Make your project visible to more people'}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 tech-glow">
                <div className="text-3xl mb-3">🤝</div>
                <h3 className="text-purple-400 font-bold mb-2">{language === 'zh' ? '资源扶持' : 'Resource Support'}</h3>
                <p className="text-gray-300 text-sm">{language === 'zh' ? '让成长不止于此刻，而能走得更远' : 'Growth that extends beyond this moment'}</p>
              </div>
            </motion.div>

            {/* 行动按钮 */}
            <motion.div 
              className="flex flex-col sm:flex-row justify-center items-center gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <motion.button
                onClick={() => router.push('/launch-contest/registration')}
                className="relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">🚀 {language === 'zh' ? '现在报名' : 'Register Now'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </motion.button>
              
              <motion.button
                onClick={() => router.push('/launch-contest/rules')}
                className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 rounded-xl hover:bg-cyan-400 hover:text-black transition-all duration-300 font-bold neon-border"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
📋 {language === 'zh' ? '了解比赛细节' : 'Contest Details'}
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* 奖励详情 */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2 
              className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              🏆 {language === 'zh' ? '奖励机制' : 'Reward System'}
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* 毕业奖励 */}
              <motion.div 
                className="bg-gradient-to-br from-gray-900/50 to-cyan-900/20 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8 tech-glow"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-cyan-400 mb-6">
                  💎 {language === 'zh' ? '毕业奖励（基础激励）' : 'Graduation Rewards (Base Incentive)'}
                </h3>
                <p className="text-gray-300 mb-6">
                  {language === 'zh' 
                    ? '在 Flipflop，我们相信每一份努力都值得被看见。所有成功完成「毕业」的项目将获得毕业大礼包：'
                    : 'At Flipflop, we believe every effort deserves recognition. All projects that successfully "graduate" will receive a graduation package:'
                  }
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">💵</span>
                    {language === 'zh' ? '500 U 现金奖励' : '$500 Cash Reward'}
                  </li>
                  <li className="flex items-center">
                    <span className="text-yellow-400 mr-3">🪙</span>
                    {language === 'zh' ? '可申请Flipflop 基金会生态基金扶持' : 'Eligible for Flipflop Foundation Ecosystem Fund Support'}
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-400 mr-3">📢</span>
                    {language === 'zh' ? '官方推特单条Spotlight推文，周报/赛事简报统一介绍' : 'Official Twitter Spotlight post, weekly report/contest brief feature'}
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-400 mr-3">👥</span>
                    {language === 'zh' ? '社区TG频道公告 / 网页限时推荐位' : 'Community TG channel announcement / Website featured placement'}
                  </li>
                </ul>
                <p className="text-sm text-cyan-300 mt-4 italic">
                  {language === 'zh' 
                    ? '毕业意味着认可，也意味着新阶段的开始。我们将与每一个毕业项目并肩前行。'
                    : 'Graduation means recognition and marks the beginning of a new phase. We will stand alongside every graduating project.'
                  }
                </p>
              </motion.div>

              {/* 赛道排名奖励 */}
              <motion.div 
                className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 tech-glow"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-purple-400 mb-6">
                  🏅 {language === 'zh' ? '赛道排名奖励（Top 3）' : 'Track Ranking Rewards (Top 3)'}
                </h3>
                <p className="text-gray-300 mb-6">
                  {language === 'zh' 
                    ? '在每个赛道中评选前三名，给予基金会生态基金与相关资源的双重支持：'
                    : 'Top 3 winners in each track receive dual support from foundation ecosystem fund and related resources:'
                  }
                </p>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-500/30">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">🥇</span>
                      <span className="font-bold text-yellow-400">
                        {language === 'zh' ? '第一名' : '1st Place'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">
                      {language === 'zh' 
                        ? '100 SOL 基金会买入（约 $20,000）+ 深度宣发（AMA、长推、全球资源）'
                        : '100 SOL Foundation Purchase (~$20,000) + Deep Promotion (AMA, threads, global resources)'
                      }
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-gray-400/20 to-gray-500/20 rounded-lg p-4 border border-gray-400/30">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">🥈</span>
                      <span className="font-bold text-gray-300">
                        {language === 'zh' ? '第二名' : '2nd Place'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">
                      {language === 'zh' 
                        ? '50 SOL 基金会买入（约 $10,000）+ 媒体报道 + 官方 Spotlight'
                        : '50 SOL Foundation Purchase (~$10,000) + Media Coverage + Official Spotlight'
                      }
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-amber-600/20 to-amber-700/20 rounded-lg p-4 border border-amber-600/30">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">🥉</span>
                      <span className="font-bold text-amber-400">
                        {language === 'zh' ? '第三名' : '3rd Place'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">
                      {language === 'zh' 
                        ? '20 SOL 基金会买入（约 $4,000）+ Final Day 集中曝光'
                        : '20 SOL Foundation Purchase (~$4,000) + Final Day Concentrated Exposure'
                      }
                    </p>
                  </div>
                </div>
                <p className="text-sm text-purple-300 mt-4 italic">
                  {language === 'zh' 
                    ? '我们致力于为真正有潜力的团队，提供更持久的发展动力。'
                    : 'We are committed to providing lasting development momentum for truly promising teams.'
                  }
                </p>
              </motion.div>
            </div>
          </div>
        </section>


        {/* 快速导航 */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2 
              className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              🎯 快速导航
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { href: '/launch-contest/rules', icon: '📋', title: '大赛规则', desc: '了解参赛要求和评审标准' },
                { href: '/launch-contest/registration', icon: '✍️', title: '参赛登记', desc: '提交项目信息开始参赛' },
                { href: '/launch-contest/leaderboard', icon: '🏆', title: '排行榜', desc: '查看实时项目排名' },
              ].map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="group bg-gradient-to-br from-gray-900/50 to-blue-900/20 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 hover:border-cyan-400 transition-all duration-300 text-center tech-glow"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-cyan-400 mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {item.desc}
                  </p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

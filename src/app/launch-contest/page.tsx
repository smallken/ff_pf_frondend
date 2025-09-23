'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export default function LaunchContestHome() {
  const router = useRouter();
  const { language, t } = useLanguage();
  
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

            {/* 主标题 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                🚀 {language === 'zh' ? 'Flipflop Launch 大赛' : 'Flipflop Launch Competition'}
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
                  这不是一场普通的比赛，而是 <span className="text-cyan-400 font-bold">专属于 Web3 Builder 与 Dreamer 的盛典</span>。无论你是打造应用的开发者、塑造叙事的 KOL，还是团结社群的组织者，只要你敢于用代币去定义未来，这里都欢迎你的加
                  入。
                </>
              ) : (
                <>
                  This is not an ordinary competition, but a <span className="text-cyan-400 font-bold">festival exclusively for Web3 Builders and Dreamers</span>.
                  Whether you're a developer creating applications, a KOL shaping narratives, or an organizer uniting communities, as long as you dare to define the future with tokens, you're welcome to join.
                </>
              )}
            </motion.p>


            {/* 行动按钮 */}
            <motion.div 
              className="flex flex-col sm:flex-row justify-center items-center gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <a
                href="/"
                className="group relative px-8 py-3 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-2xl hover:from-blue-500 hover:to-cyan-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl font-semibold text-base min-w-[180px]"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <span className="mr-2">⛵</span>
                  {language === 'zh' ? '返回港湾' : 'Back to PathPort'}
                </span>
              </a>
              
              <motion.button
                onClick={() => router.push('/launch-contest/forms')}
                className="relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">📋 {language === 'zh' ? '表格申请' : 'Form Applications'}</span>
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
                
                {/* 重要说明 */}
                <div className="mt-6 p-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl border border-cyan-500/20">
                  <p className="text-sm text-cyan-200 mb-2">
                    {language === 'zh' 
                      ? '注：所有项目需在发币后，毕业前，递交参赛登记表，以满足领取毕业奖励的基本要求'
                      : 'Note: All projects must submit a participation registration form after token issuance and before graduation to meet the basic requirements for receiving graduation rewards'
                    }
                  </p>
                  <p className="text-sm text-cyan-200">
                    {language === 'zh' 
                      ? '现金奖励将在赛事结束后，统计，并统一时段发放，详情见大赛规则页'
                      : 'Cash rewards will be tallied and distributed at a unified time after the event concludes. See the competition rules page for details'
                    }
                  </p>
                </div>
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

        {/* 赛事时间线 */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2 
              className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              ⏰ {language === 'zh' ? '赛事时间线' : 'Contest Timeline'}
            </motion.h2>

            <motion.p 
              className="text-xl text-gray-300 text-center mb-16 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {language === 'zh' 
                ? '为了帮助所有参赛团队清晰掌握赛事进度，本届发射大赛设定了完整的时间线。请各项目方根据时间节点，合理安排发币、材料准备与社区动员，确保顺利参赛。'
                : 'To help all participating teams clearly understand the contest progress, this Launch Contest has established a complete timeline. Please arrange token issuance, material preparation, and community mobilization according to the timeline to ensure smooth participation.'
              }
            </motion.p>

            {/* 时间线阶段 */}
            <div className="space-y-12">
              {[
                {
                  id: 1,
                  title: language === 'zh' ? '开放期' : 'Open Period',
                  subtitle: language === 'zh' ? '赛事启动 → 截止日' : 'Contest Launch → Deadline',
                  icon: '🚀',
                  color: 'from-green-500 to-emerald-600',
                  borderColor: 'border-green-500/30',
                  description: language === 'zh' ? '这是项目正式加入赛事的起点。' : 'This is the starting point for projects to officially join the contest.',
                  details: [
                    {
                      title: language === 'zh' ? '平台开放' : 'Platform Opens',
                      content: language === 'zh' 
                        ? '自赛事启动日，Flipflop 平台将全面开放，所有项目均可在此期间自由完成发币。'
                        : 'From the contest launch date, the Flipflop platform will be fully open for all projects to freely complete token issuance.'
                    },
                    {
                      title: language === 'zh' ? '发币与登记' : 'Token Issuance & Registration',
                      content: language === 'zh' 
                        ? '发币完成后，项目方必需填写（参赛登记表），提交代币合约地址及基本信息，以确认参赛资格。注：若活动截止，依旧未递交信息表，则视为未参加本活动，不会享受活动奖励。'
                        : 'After token issuance, project teams must fill out the registration form, submit token contract address and basic information to confirm participation eligibility. Note: If the form is not submitted by the deadline, it will be considered non-participation and will not receive contest rewards.'
                    },
                    {
                      title: language === 'zh' ? '持续推进' : 'Continuous Progress',
                      content: language === 'zh' 
                        ? '在开放期内，参赛项目可不断开展运营、建设社区与市场活动，为最终评审积累成果。'
                        : 'During the open period, participating projects can continuously conduct operations, build communities, and market activities to accumulate achievements for final evaluation.'
                    }
                  ]
                },
                {
                  id: 2,
                  title: language === 'zh' ? '截止日（T0）' : 'Deadline (T0)',
                  subtitle: language === 'zh' ? '统一基准点' : 'Unified Baseline',
                  icon: '📊',
                  color: 'from-blue-500 to-cyan-600',
                  borderColor: 'border-blue-500/30',
                  description: language === 'zh' ? '截止日将作为赛事的统一基准点。' : 'The deadline serves as the unified baseline for the contest.',
                  details: [
                    {
                      title: language === 'zh' ? '数据快照' : 'Data Snapshot',
                      content: language === 'zh' 
                        ? '平台将在 T0 当日，对所有参赛项目进行链上与平台数据的统一快照；'
                        : 'On T0, the platform will take a unified snapshot of on-chain and platform data for all participating projects.'
                    },
                    {
                      title: language === 'zh' ? '评审基准' : 'Evaluation Baseline',
                      content: language === 'zh' 
                        ? '此快照数据将作为最终评审与排名的重要参考，确保公平与一致性。'
                        : 'This snapshot data will serve as an important reference for final evaluation and ranking, ensuring fairness and consistency.'
                    }
                  ]
                },
                {
                  id: 3,
                  title: language === 'zh' ? '考核内容提交期' : 'Evaluation Content Submission',
                  subtitle: 'T0 → T0+7 ' + (language === 'zh' ? '天' : 'days'),
                  icon: '📝',
                  color: 'from-purple-500 to-violet-600',
                  borderColor: 'border-purple-500/30',
                  description: language === 'zh' ? '截止日后，项目进入DD问答清单填写阶段。' : 'After the deadline, projects enter the DD questionnaire completion phase.',
                  details: [
                    {
                      title: language === 'zh' ? 'DD问答清单' : 'DD Questionnaire',
                      content: language === 'zh' 
                        ? '所有参赛项目需在截止日起7天内，登录 Flipflop 官网完成（DD 问答清单）。清单涵盖基础信息、核心数据、项目叙事与团队规划。'
                        : 'All participating projects must complete the DD questionnaire on the Flipflop official website within 7 days from the deadline. The questionnaire covers basic information, core data, project narrative, and team planning.'
                    },
                    {
                      title: language === 'zh' ? '评分依据' : 'Scoring Basis',
                      content: language === 'zh' 
                        ? '平台将结合链上/社媒快照与清单回答进行评分与排名。未在规定时间内提交清单者，将由评审团基于公开可见数据独立评估。'
                        : 'The platform will combine on-chain/social media snapshots with questionnaire responses for scoring and ranking. Those who fail to submit within the specified time will be independently evaluated by the jury based on publicly available data.'
                    }
                  ]
                },
                {
                  id: 4,
                  title: language === 'zh' ? '评审与公示期' : 'Review & Publicity Period',
                  subtitle: 'T0+7 → T0+14 ' + (language === 'zh' ? '天' : 'days'),
                  icon: '⚖️',
                  color: 'from-orange-500 to-red-600',
                  borderColor: 'border-orange-500/30',
                  description: language === 'zh' ? '这一阶段是对成果的全面检验与公开确认。' : 'This phase is a comprehensive examination and public confirmation of achievements.',
                  details: [
                    {
                      title: language === 'zh' ? '综合评估' : 'Comprehensive Evaluation',
                      content: language === 'zh' 
                        ? '评审团将结合提交材料与数据快照，从 流量贡献、项目质量、叙事与共识、团队效率 四个维度进行综合评估；'
                        : 'The jury will combine submitted materials and data snapshots to conduct comprehensive evaluation from four dimensions: traffic contribution, project quality, narrative & consensus, and team efficiency.'
                    },
                    {
                      title: language === 'zh' ? '公开公示' : 'Public Announcement',
                      content: language === 'zh' 
                        ? '初步结果将在官网及社交媒体公开公示 72 小时，期间社区可通过各社媒渠道，提出意见或补充证据；'
                        : 'Preliminary results will be publicly announced on the official website and social media for 72 hours, during which the community can provide feedback or additional evidence through various social media channels.'
                    },
                    {
                      title: language === 'zh' ? '最终确认' : 'Final Confirmation',
                      content: language === 'zh' 
                        ? '公示结束后，评审团将完成复核，并正式确认获奖名单。'
                        : 'After the publicity period, the jury will complete the review and officially confirm the winners list.'
                    }
                  ]
                },
                {
                  id: 5,
                  title: 'Final Day',
                  subtitle: language === 'zh' ? '收官活动' : 'Grand Finale',
                  icon: '🏆',
                  color: 'from-yellow-500 to-amber-600',
                  borderColor: 'border-yellow-500/30',
                  description: language === 'zh' ? '赛事的高潮与总结。' : 'The climax and conclusion of the contest.',
                  details: [
                    {
                      title: language === 'zh' ? '获奖公布' : 'Winners Announcement',
                      content: language === 'zh' 
                        ? '所有获奖项目将在 Final Day 集中公布，面向生态基金、合作伙伴与媒体进行展示；'
                        : 'All winning projects will be announced on Final Day, showcased to ecosystem funds, partners, and media.'
                    },
                    {
                      title: language === 'zh' ? '联系确认' : 'Contact Confirmation',
                      content: language === 'zh' 
                        ? '获奖项目方需在收到获奖通知后7天内，与平台建立有效联系，并递交领奖信息；'
                        : 'Winning project teams must establish effective contact with the platform within 7 days of receiving the winning notification and submit prize claim information.'
                    },
                    {
                      title: language === 'zh' ? '颁奖仪式' : 'Award Ceremony',
                      content: language === 'zh' 
                        ? '官方将公布最终排名与各奖项归属，并举行颁奖仪式，为赛事画上圆满句号。'
                        : 'The official will announce final rankings and award distributions, and hold an award ceremony to bring the contest to a perfect conclusion.'
                    }
                  ]
                }
              ].map((phase, index) => (
                <motion.div
                  key={phase.id}
                  className={`relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border ${phase.borderColor} rounded-2xl overflow-hidden`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  {/* 阶段编号 */}
                  <div className="absolute top-6 left-6">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${phase.color} flex items-center justify-center font-bold text-white text-lg`}>
                      {phase.id}
                    </div>
                  </div>

                  <div className="p-8 pl-24">
                    {/* 阶段标题 */}
                    <div className="mb-6">
                      <div className="flex items-center mb-2">
                        <span className="text-3xl mr-3">{phase.icon}</span>
                        <h3 className={`text-2xl font-bold bg-gradient-to-r ${phase.color} bg-clip-text text-transparent`}>
                          {phase.title}
                        </h3>
                      </div>
                      <p className="text-lg text-gray-400 mb-4">{phase.subtitle}</p>
                      <p className="text-gray-300 text-lg leading-relaxed">{phase.description}</p>
                    </div>

                    {/* 详细内容 */}
                    <div className="space-y-6">
                      {phase.details.map((detail, detailIndex) => (
                        <motion.div
                          key={detailIndex}
                          className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50"
                          initial={{ opacity: 0, x: 30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: (index * 0.2) + (detailIndex * 0.1) }}
                          viewport={{ once: true }}
                        >
                          <h4 className={`text-lg font-bold mb-3 bg-gradient-to-r ${phase.color} bg-clip-text text-transparent`}>
                            {detail.title}
                          </h4>
                          <p className="text-gray-300 leading-relaxed">{detail.content}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* 连接线 */}
                  {index < 4 && (
                    <div className="absolute bottom-0 left-12 w-0.5 h-12 bg-gradient-to-b from-gray-600 to-transparent transform translate-y-full"></div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* 评审维度说明 */}
            <motion.div
              className="mt-20 bg-gradient-to-br from-gray-900/50 to-purple-900/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-purple-400 mb-8 text-center">
                📊 {language === 'zh' ? '评审维度' : 'Evaluation Dimensions'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: language === 'zh' ? '流量贡献' : 'Traffic Contribution',
                    description: language === 'zh' ? '项目为平台和生态带来的新增用户、参与度与外部传播效果' : 'New users, engagement, and external communication effects brought by the project to the platform and ecosystem',
                    icon: '📈',
                    color: 'from-blue-500 to-cyan-600'
                  },
                  {
                    title: language === 'zh' ? '项目质量' : 'Project Quality',
                    description: language === 'zh' ? '代币及机制设计的稳健性、产品可用性与创新性' : 'Robustness of token and mechanism design, product usability and innovation',
                    icon: '⭐',
                    color: 'from-green-500 to-emerald-600'
                  },
                  {
                    title: language === 'zh' ? '叙事与共识' : 'Narrative & Consensus',
                    description: language === 'zh' ? '项目叙事的清晰度、社区的认可度、二次创作与媒体传播表现' : 'Clarity of project narrative, community recognition, secondary creation and media communication performance',
                    icon: '💭',
                    color: 'from-purple-500 to-violet-600'
                  },
                  {
                    title: language === 'zh' ? '团队效率' : 'Team Efficiency',
                    description: language === 'zh' ? '功能迭代速度、活动执行力、对市场及社区反馈的响应程度' : 'Feature iteration speed, activity execution, responsiveness to market and community feedback',
                    icon: '🚀',
                    color: 'from-orange-500 to-red-600'
                  }
                ].map((dimension, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="text-4xl mb-4">{dimension.icon}</div>
                    <h4 className={`text-lg font-bold mb-3 bg-gradient-to-r ${dimension.color} bg-clip-text text-transparent`}>
                      {dimension.title}
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{dimension.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
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
                  {language === 'zh' ? '关注我们！' : 'Follow Us!'}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  {language === 'zh' 
                    ? 'flipflop会发布最新活动和相关生态进展。'
                    : 'Flipflop will publish the latest activities and related ecosystem progress.'
                  }
                </p>
                <div className="flex items-center justify-center lg:justify-start space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span>{language === 'zh' ? '实时更新·社区活跃' : 'Real-time updates · Community active'}</span>
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
                        <div className="text-xs text-blue-500 mt-1">{language === 'zh' ? '实时更新→' : 'Real-time updates →'}</div>
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
                        <div className="text-xs text-indigo-500 mt-1">{language === 'zh' ? '实时交流→' : 'Real-time communication →'}</div>
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
                        <div className="font-bold text-gray-900 dark:text-white text-lg">{language === 'zh' ? '官方ff入口' : 'Official FF Portal'}</div>
                        <div className="text-xs text-purple-500 mt-1">{language === 'zh' ? '立即访问→' : 'Visit Now →'}</div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

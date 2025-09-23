'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

export default function LaunchTimeline() {
  const { language } = useLanguage();

  const timelinePhases = [
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
      title: language === 'zh' ? '截止日（2025年9月20日）' : 'Deadline (September 20, 2025)',
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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 返回按钮 */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <a
            href="/launch-contest"
            className="inline-flex items-center px-4 py-2 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition-all duration-300 text-sm font-medium"
          >
            <span className="mr-2">←</span>
            {language === 'zh' ? '返回Launch大赛' : 'Back to Launch Contest'}
          </a>
        </motion.div>

        {/* 页面标题 */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            ⏰ {language === 'zh' ? '赛事时间线' : 'Contest Timeline'}
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {language === 'zh' 
              ? '为了帮助所有参赛团队清晰掌握赛事进度，本届发射大赛设定了完整的时间线。请各项目方根据时间节点，合理安排发币、材料准备与社区动员，确保顺利参赛。'
              : 'To help all participating teams clearly understand the contest progress, this Launch Contest has established a complete timeline. Please arrange token issuance, material preparation, and community mobilization according to the timeline to ensure smooth participation.'
            }
          </p>
        </motion.div>

        {/* 时间线 */}
        <div className="space-y-12">
          {timelinePhases.map((phase, index) => (
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
                    <h2 className={`text-2xl font-bold bg-gradient-to-r ${phase.color} bg-clip-text text-transparent`}>
                      {phase.title}
                    </h2>
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
                      <h3 className={`text-lg font-bold mb-3 bg-gradient-to-r ${phase.color} bg-clip-text text-transparent`}>
                        {detail.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">{detail.content}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 连接线 */}
              {index < timelinePhases.length - 1 && (
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
          <h2 className="text-3xl font-bold text-purple-400 mb-8 text-center">
            📊 {language === 'zh' ? '评审维度' : 'Evaluation Dimensions'}
          </h2>
          
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
                <h3 className={`text-lg font-bold mb-3 bg-gradient-to-r ${dimension.color} bg-clip-text text-transparent`}>
                  {dimension.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">{dimension.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 底部导航 */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href="/launch-contest/registration"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105"
            >
              ✍️ {language === 'zh' ? '立即报名' : 'Register Now'}
            </a>
            <a
              href="/launch-contest/rules"
              className="px-8 py-4 border-2 border-purple-400 text-purple-400 rounded-xl hover:bg-purple-400 hover:text-black transition-all duration-300 font-bold"
            >
              📋 {language === 'zh' ? '查看规则' : 'View Rules'}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useState, useEffect } from 'react';

export default function LaunchContestRulesPage() {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState('section1');

  // 侧边导航结构
  const navigationSections = [
    {
      id: 'section1',
      title: language === 'zh' ? '第一部分：赛道划分说明' : 'Part 1: Track Division',
      subsections: [
        { id: 'section1-a', title: language === 'zh' ? 'A. 应用/产品型赛道' : 'A. Application/Product Track' },
        { id: 'section1-b', title: language === 'zh' ? 'B. 共识/社群型赛道' : 'B. Consensus/Community Track' },
        { id: 'section1-c', title: language === 'zh' ? 'C. 特别说明' : 'C. Special Notes' }
      ]
    },
    {
      id: 'section2',
      title: language === 'zh' ? '第二部分：总资金池金额 & 奖励机制' : 'Part 2: Prize Pool & Rewards',
      subsections: [
        { id: 'section2-a', title: language === 'zh' ? 'A. 总资金池规模' : 'A. Total Prize Pool' },
        { id: 'section2-b', title: language === 'zh' ? 'B. 毕业奖励（基础激励）' : 'B. Graduation Rewards' },
        { id: 'section2-c', title: language === 'zh' ? 'C. 赛道排名奖励（Top 3）' : 'C. Track Ranking Rewards' },
        { id: 'section2-d', title: language === 'zh' ? 'D. 奖励机制与合规相关特别说明' : 'D. Reward Mechanism & Compliance' }
      ]
    },
    {
      id: 'section3',
      title: language === 'zh' ? '第三部分：审核方式 & 评估标准' : 'Part 3: Review & Evaluation',
      subsections: [
        { id: 'section3-a', title: language === 'zh' ? 'A. 审核方式' : 'A. Review Process' },
        { id: 'section3-b', title: language === 'zh' ? 'B. 统计口径与数据源' : 'B. Data Standards & Sources' }
      ]
    },
    {
      id: 'section4',
      title: language === 'zh' ? '第四部分：赛事时间线' : 'Part 4: Contest Timeline',
      subsections: [
        { id: 'section4-1', title: language === 'zh' ? '1. 开放期' : '1. Open Period' },
        { id: 'section4-2', title: language === 'zh' ? '2. 截止日（T0）' : '2. Deadline (T0)' },
        { id: 'section4-3', title: language === 'zh' ? '3. 考核内容提交期' : '3. Assessment Submission' },
        { id: 'section4-4', title: language === 'zh' ? '4. 评审与公示期' : '4. Review & Announcement' },
        { id: 'section4-5', title: language === 'zh' ? '5. Final Day（收官活动）' : '5. Final Day' }
      ]
    },
    {
      id: 'section5',
      title: language === 'zh' ? '第五部分：毕业机制 & 特殊规则' : 'Part 5: Graduation & Special Rules',
      subsections: [
        { id: 'section5-1', title: language === 'zh' ? '1. 毕业机制' : '1. Graduation Mechanism' },
        { id: 'section5-2', title: language === 'zh' ? '2. 特殊规则：KOL 联盟化' : '2. Special Rule: KOL Alliance' }
      ]
    }
  ];

  // 监听滚动事件，更新当前活跃的章节
  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationSections.flatMap(section => [
        section.id,
        ...section.subsections.map(sub => sub.id)
      ]);
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigationSections]);

  // 滚动到指定章节
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white">
      {/* 侧边导航栏 */}
      <div className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-gray-900/98 to-gray-800/98 backdrop-blur-md border-r border-cyan-500/20 z-40 overflow-y-auto shadow-2xl">
        <div className="p-4">
          <div className="mb-6">
            <a
              href="/launch-contest"
              className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 text-cyan-300 rounded-lg hover:bg-cyan-400/20 hover:border-cyan-400 transition-all duration-300 text-sm font-medium backdrop-blur-sm"
            >
              <span className="mr-2">←</span>
              {language === 'zh' ? '返回Launch大赛' : 'Back to Launch Contest'}
            </a>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-cyan-400 text-lg">📋</span>
              <h3 className="text-base font-bold text-cyan-300">
                {language === 'zh' ? '规则导航' : 'Rules Navigation'}
              </h3>
            </div>
            <div className="h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
          </div>
          
          <nav className="space-y-1">
            {navigationSections.map((section, sectionIndex) => (
              <div key={section.id} className="space-y-0.5">
                <button
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center space-x-2 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/20 text-cyan-200 shadow-lg border-l-2 border-cyan-400'
                      : 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-600/30 hover:text-cyan-300'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                    {sectionIndex + 1}
                  </span>
                  <span className="flex-1 leading-tight">{section.title}</span>
                </button>
                
                {section.subsections.map((subsection) => (
                  <button
                    key={subsection.id}
                    onClick={() => scrollToSection(subsection.id)}
                    className={`w-full text-left px-8 py-1.5 rounded-md text-xs transition-all duration-200 ${
                      activeSection === subsection.id
                        ? 'bg-blue-500/20 text-blue-200 border-l-2 border-blue-400 shadow-sm'
                        : 'text-gray-400 hover:bg-gray-700/30 hover:text-blue-300'
                    }`}
                  >
                    <span className="text-xs opacity-70 mr-1">•</span>
                    {subsection.title}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="ml-72 py-16 px-8">
        <div className="max-w-5xl mx-auto">
          {/* 页面标题 */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              📋 {language === 'zh' ? 'Launch 大赛规则书' : 'Launch Contest Rulebook'}
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {language === 'zh' 
                ? 'Flipflop Launch 大赛规则书'
                : 'Flipflop Launch Contest Rulebook'
              }
            </p>
          </motion.div>

          {/* 第一部分：赛道划分说明 */}
          <motion.section
            id="section1"
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-cyan-400 mb-8">
              📑 {language === 'zh' ? '第一部分：赛道划分说明' : 'Part 1: Track Division'}
            </h2>
            <p className="text-gray-300 leading-relaxed mb-12 text-lg">
              {language === 'zh' 
                ? '为确保竞赛的公平性与多样性，我们将参赛项目按照其核心特征与发展方向划分为两大类赛道，并在其下设立五个重点细分赛道。该划分既体现了 Flipflop 平台希望重点孵化与推广的领域，也为不同类型的团队提供了清晰的参赛路径。'
                : 'To ensure fairness and diversity in the competition, we divide participating projects into two major categories based on their core characteristics and development directions, with five key sub-tracks. This division reflects the areas Flipflop platform aims to incubate and promote, providing clear participation paths for different types of teams.'
              }
            </p>

            {/* A. 应用/产品型赛道 */}
            <div id="section1-a" className="mb-16">
              <h3 className="text-3xl font-bold text-blue-300 mb-8">
                🔹 A. {language === 'zh' ? '应用 / 产品型赛道' : 'Application / Product Track'}
              </h3>
              <div className="bg-gradient-to-br from-gray-900/50 to-blue-900/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8">
                <p className="text-gray-300 leading-relaxed mb-8">
                  {language === 'zh'
                    ? '此类赛道面向以产品与技术应用为核心驱动力的团队，重点关注具备落地潜力、能够通过产品逻辑驱动用户与社群增长的项目。我们鼓励轻量化、快速迭代的小型应用与探索型团队参与，不仅看重产品的完整度，更关注创新性与潜在的市场价值。'
                    : 'This track is for teams driven by products and technical applications, focusing on projects with implementation potential that can drive user and community growth through product logic. We encourage lightweight, rapidly iterating small applications and exploratory teams, valuing not only product completeness but also innovation and potential market value.'
                  }
                </p>
                
                <div className="space-y-8">
                  {/* RWA 赛道 */}
                  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                    <h4 className="text-xl font-bold text-cyan-200 mb-4">
                      1. RWA {language === 'zh' ? '赛道（Real World Assets）' : 'Track (Real World Assets)'}
                    </h4>
                    <div className="space-y-3 text-gray-300 text-sm">
                      <p><span className="font-semibold text-cyan-300">定义：</span>围绕现实世界资产（债券、房地产、商品、艺术品等）的代币化尝试。</p>
                      <p><span className="font-semibold text-cyan-300">参赛对象：</span>能把现实资产和链上机制结合的团队，哪怕是早期实验版本。</p>
                      <p><span className="font-semibold text-cyan-300">评判重点：</span>资产合规性、叙事清晰度、市场需求匹配度、代币经济模型的稳健性。</p>
                    </div>
                  </div>
                  
                  {/* 小应用赛道 */}
                  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                    <h4 className="text-xl font-bold text-cyan-200 mb-4">
                      2. {language === 'zh' ? '小应用赛道（Mini dApps）' : 'Mini dApps Track'}
                    </h4>
                    <div className="space-y-3 text-gray-300 text-sm">
                      <p><span className="font-semibold text-cyan-300">定义：</span>轻量级、灵活的小工具或应用，包括结合 AI 的小功能模块。</p>
                      <p><span className="font-semibold text-cyan-300">参赛对象：</span>愿意通过小型产品切入市场、逐步积累用户和社群的团队</p>
                      <p><span className="font-semibold text-cyan-300">评判重点：</span>产品易用性、创新性、与社群结合度、早期用户反馈。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* B. 共识/社群型赛道 */}
            <div id="section1-b" className="mb-16">
              <h3 className="text-3xl font-bold text-purple-300 mb-8">
                🔹 B. {language === 'zh' ? '共识 / 社群型赛道' : 'Consensus / Community Track'}
              </h3>
              <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
                <p className="text-gray-300 leading-relaxed mb-8">
                  {language === 'zh'
                    ? '此类赛道面向以共识、叙事与社群驱动为核心价值的项目。我们认为，Web3 不仅仅是技术或应用的竞争，更是叙事、社区与影响力的较量。因此，该类赛道重点考察参赛团队在构建共识、塑造叙事、激活社群方面的能力。'
                    : 'This track is for projects driven by consensus, narrative, and community as core values. We believe Web3 is not just a competition of technology or applications, but also of narrative, community, and influence. Therefore, this track focuses on evaluating teams\' abilities in building consensus, shaping narratives, and activating communities.'
                  }
                </p>
                
                <div className="space-y-8">
                  {/* KOL 赛道 */}
                  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                    <h4 className="text-xl font-bold text-purple-200 mb-4">
                      3. KOL {language === 'zh' ? '赛道' : 'Track'}
                    </h4>
                    <div className="space-y-3 text-gray-300 text-sm">
                      <p><span className="font-semibold text-purple-300">定义：</span>由个人创作者、意见领袖发行的代币，核心是个人影响力的时间价值代币化。</p>
                      <p><span className="font-semibold text-purple-300">参赛对象：</span>拥有一定粉丝基础，并愿意通过代币与支持者绑定成长的 KOL。</p>
                      <p><span className="font-semibold text-purple-300">评判重点：</span>粉丝参与率、社区活跃度、叙事传播力、长期承诺。</p>
                    </div>
                  </div>
                  
                  {/* IP 赛道 */}
                  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                    <h4 className="text-xl font-bold text-purple-200 mb-4">
                      4. IP {language === 'zh' ? '赛道' : 'Track'}
                    </h4>
                    <div className="space-y-3 text-gray-300 text-sm">
                      <p><span className="font-semibold text-purple-300">定义：</span>围绕现有品牌、虚拟形象、内容版权或文化符号的代币化尝试。</p>
                      <p><span className="font-semibold text-purple-300">参赛对象：</span>原创 IP 创作者、动漫/影视/音乐等团队，或持有 IP 授权方。</p>
                      <p><span className="font-semibold text-purple-300">评判重点：</span>IP 独特性、粉丝群体粘性、二次创作潜力、跨界联动能力。</p>
                    </div>
                  </div>
                  
                  {/* 社区赛道 */}
                  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                    <h4 className="text-xl font-bold text-purple-200 mb-4">
                      5. {language === 'zh' ? '社区赛道' : 'Community Track'}
                    </h4>
                    <div className="space-y-3 text-gray-300 text-sm">
                      <p><span className="font-semibold text-purple-300">定义：</span>由 DAO、兴趣小组或社群组织主导的代币化尝试，强调共识驱动。</p>
                      <p><span className="font-semibold text-purple-300">参赛对象：</span>自发形成的去中心化社区，或有清晰共识叙事的团队。</p>
                      <p><span className="font-semibold text-purple-300">评判重点：</span>社区规模与活跃度、治理参与度、成员贡献度、叙事可持续性。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* C. 特别说明 */}
            <div id="section1-c" className="mb-16">
              <h3 className="text-3xl font-bold text-yellow-300 mb-8">
                🔹 C. {language === 'zh' ? '特别说明' : 'Special Notes'}
              </h3>
              <div className="bg-gradient-to-br from-gray-900/50 to-yellow-900/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-8">
                <div className="space-y-6">
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="font-semibold text-yellow-200 mb-3">1. 核心关注，但不限于此</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      以上五个赛道为本届发射大赛的重点方向，代表了 Flipflop 平台目前希望孵化与推广的核心价值。但我们同样欢迎其他类型的创新项目参与，只要具备独特的叙事或强大的社群共识，也有机会获得认可与奖励。
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="font-semibold text-yellow-200 mb-3">2. 赛道灵活性</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      如某一赛道参赛项目数量不足，评审团有权调整奖项设置，或合并赛道，剩余奖励不会收回，将由评审团择优颁发给未上榜的优质项目。
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="font-semibold text-yellow-200 mb-3">3. 跨赛道参赛</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      若项目特征横跨多个领域，可由团队自行选择最贴合的赛道报名，同一项目仅能在一个赛道进入最终排名，评审团将根据项目实际情况在最终考核时，综合考量其赛道适配度。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 第二部分：总资金池金额 & 奖励机制 */}
          <motion.section
            id="section2"
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-green-400 mb-8">
              📑 {language === 'zh' ? '第二部分：总资金池金额 & 奖励机制' : 'Part 2: Total Prize Pool & Reward Mechanism'}
            </h2>

            {/* A. 总资金池规模 */}
            <div id="section2-a" className="mb-16">
              <h3 className="text-3xl font-bold text-green-300 mb-8">
                🔹 A. {language === 'zh' ? '总资金池规模' : 'Total Prize Pool Size'}
              </h3>
              <div className="bg-gradient-to-br from-gray-900/50 to-green-900/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8">
                <div className="text-center mb-8">
                  <div className="text-6xl font-bold text-green-400 mb-4">$300,000+</div>
                  <p className="text-xl text-gray-300">超过 30 万美元规模的激励池</p>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg">
                  本届发射大赛将为参赛项目提供超过 30 万美元规模的激励池。这一激励不仅包含现金奖励与基金会生态基金扶持，更涵盖平台宣发、社区流量、孵化支持、全球合作资源等全方位扶持，确保优质项目能够在赛事中脱颖而出，并在未来的发展中获得持续支持。
                </p>
              </div>
            </div>

            {/* B. 毕业奖励（基础激励） */}
            <div id="section2-b" className="mb-16">
              <h3 className="text-3xl font-bold text-blue-300 mb-8">
                🔹 B. {language === 'zh' ? '毕业奖励（基础激励）' : 'Graduation Rewards (Base Incentive)'}
              </h3>
              <div className="bg-gradient-to-br from-gray-900/50 to-blue-900/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8">
                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                  在 Flipflop，我们相信每一份努力都值得被看见。因此，所有成功完成「毕业」的项目将获得一份毕业大礼包包括：
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/30 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-4">💵</div>
                    <h4 className="text-xl font-bold text-green-400 mb-3">500 U 现金奖励</h4>
                    <p className="text-gray-400 text-sm">直接的资金支持</p>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-4">🪙</div>
                    <h4 className="text-xl font-bold text-yellow-400 mb-3">生态基金扶持</h4>
                    <p className="text-gray-400 text-sm">可申请 Flipflop 基金会生态基金扶持</p>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-4">📢</div>
                    <h4 className="text-xl font-bold text-blue-400 mb-3">官方推广</h4>
                    <p className="text-gray-400 text-sm">官方推特单条 Spotlight 推文，周报/赛事简报统一介绍</p>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-4">👥</div>
                    <h4 className="text-xl font-bold text-purple-400 mb-3">社区曝光</h4>
                    <p className="text-gray-400 text-sm">社区 TG 频道公告 / 网页限时推荐位</p>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-blue-300 italic text-lg">
                    毕业意味着认可，也意味着新阶段的开始。我们将与每一个毕业项目并肩前行。
                  </p>
                </div>
              </div>
            </div>

            {/* C. 赛道排名奖励（Top 3） */}
            <div id="section2-c" className="mb-16">
              <h3 className="text-3xl font-bold text-purple-300 mb-8">
                🔹 C. {language === 'zh' ? '赛道排名奖励（Top 3）' : 'Track Ranking Rewards (Top 3)'}
              </h3>
              <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                  在赛事截止时，每个赛道将根据表现评选出最多三名获奖项目。获奖者将获得基金会生态基金扶持 + 资源扶持的双重支持：
                </p>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30">
                    <div className="flex items-center mb-4">
                      <span className="text-4xl mr-4">🥇</span>
                      <h4 className="text-2xl font-bold text-yellow-400">第一名</h4>
                    </div>
                    <p className="text-gray-300">
                      100 SOL 基金会买入（约 $20,000）+ 深度宣发（AMA、长推、全球资源）
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-400/20 to-gray-500/20 rounded-xl p-6 border border-gray-400/30">
                    <div className="flex items-center mb-4">
                      <span className="text-4xl mr-4">🥈</span>
                      <h4 className="text-2xl font-bold text-gray-300">第二名</h4>
                    </div>
                    <p className="text-gray-300">
                      50 SOL 基金会买入（约 $10,000）+ 媒体报道 + 官方 Spotlight
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-600/20 to-amber-700/20 rounded-xl p-6 border border-amber-600/30">
                    <div className="flex items-center mb-4">
                      <span className="text-4xl mr-4">🥉</span>
                      <h4 className="text-2xl font-bold text-amber-400">第三名</h4>
                    </div>
                    <p className="text-gray-300">
                      20 SOL 基金会买入（约 $4,000）+ Final Day 集中曝光
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* D. 奖励机制与合规相关特别说明 */}
            <div id="section2-d" className="mb-16">
              <h3 className="text-3xl font-bold text-red-300 mb-8">
                🔹 D. {language === 'zh' ? '奖励机制与合规相关特别说明' : 'Reward Mechanism & Compliance Special Notes'}
              </h3>
              <div className="bg-gradient-to-br from-gray-900/50 to-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8">
                <p className="text-gray-300 leading-relaxed mb-8">
                  为保证激励机制的公平性与执行力，本次发射大赛奖励机制特别说明如下：
                </p>
                
                <div className="space-y-8">
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-red-200 mb-4">1. 奖励发放</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• 奖励名额与金额将根据实际项目数量与质量动态调整，只增不减</li>
                      <li>• 现金奖励将在赛事评审最终结果公布后 7–14 个工作日内发放</li>
                      <li>• 基金会生态基金扶持将根据项目实际情况，采用分阶段买入的模式，以保证对项目代币价格的可持续支持</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-red-200 mb-4">2. 资源扶持</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• 资源扶持将在赛事结束后 1–3 个月内陆续安排</li>
                      <li>• 将通过会议沟通，结合项目需求与平台排期，共同制定执行计划</li>
                      <li>• 获奖项目需积极配合平台安排的 AMA、媒体宣发及社区活动</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-red-200 mb-4">3. 合规与责任</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• 赛事对全球团队开放，但需遵守其所在司法辖区法律法规，需自行遵守所在司法辖区的税务与合规要求</li>
                      <li>• Flipflop 对因不可抗力或第三方原因造成的奖励发放延迟不承担法律责任，但将尽力保障参赛方权益</li>
                      <li>• 注：若发现IP侵权，平台将立即中止其参赛资格，并不承担连带责任</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-red-200 mb-4">4. 公平与评审</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• 若获奖团队在评审结束后 1 周内未与平台建立有效联系并提交领奖信息，将视为放弃奖励</li>
                      <li>• 若发现虚假信息、刷量、恶意操纵等行为，平台有权取消其参赛或获奖资格</li>
                      <li>• 若项目特征涉及多个赛道，最终评审赛道由评审团确认</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-red-200 mb-4">5. 赛事时间线</h4>
                    <p className="text-gray-300 text-sm">
                      主办方保留根据实际情况（如市场环境、不可抗力或其他合理原因），提前结束或调整本次大赛的权利，并将通过官网及官方社媒进行公告。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 第三部分：审核方式 & 评估标准 */}
          <motion.section
            id="section3"
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-orange-400 mb-8">
              📑 {language === 'zh' ? '第三部分：审核方式 & 评估标准' : 'Part 3: Review Process & Evaluation Standards'}
            </h2>

            {/* A. 审核方式 */}
            <div id="section3-a" className="mb-16">
              <h3 className="text-3xl font-bold text-orange-300 mb-8">
                🔹 A. {language === 'zh' ? '审核方式' : 'Review Process'}
              </h3>
              <div className="bg-gradient-to-br from-gray-900/50 to-orange-900/20 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-8">
                <div className="space-y-8">
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-orange-200 mb-4">1. 参赛与登记</h4>
                    <ul className="space-y-3 text-gray-300 text-sm">
                      <li>• 本次竞赛的参赛单位以<span className="text-orange-400 font-bold">代币为独立计分单元</span>。项目方在 Flipflop 平台完成发币后，必须通过（参赛信息表）提交代币合约地址及所属赛道方可参与活动。</li>
                      <li>• <span className="text-red-400">注：若活动截止，依旧未递交信息表，则视为未参加本活动，不会享受活动奖励</span></li>
                      <li>• 项目方需在信息表中提供有效，可被邀请的Telegram账号，以进入专属群组，接受实时信息，配合后续安排。</li>
                      <li>• 同一团队可发行多个代币参与，但仅以该团队表现最优的一个代币进入比赛最终排名，以避免名额占用并保障公平竞争。</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-orange-200 mb-4">2. 截止日与DD（Due Diligence）问答清单递交（T0 ~ T0+7 天）</h4>
                    <ul className="space-y-3 text-gray-300 text-sm">
                      <li>• <span className="font-bold text-orange-400">统一截止日 T0：</span>平台将在截止日锁定统计口径（包括链上数据、平台内盘数据及公开社媒快照）。</li>
                      <li>• <span className="font-bold text-orange-400">DD问答清单填写窗口 7 天：</span>所有参赛项目需在截止日起7天内，登录官网活动页面，完成填写DD （Due Diligence）问答清单，平台将结合链上/社媒快照与清单回答进行评分与排名，清单一旦递交不可修改。</li>
                      <li>• <span className="font-bold text-orange-400">逾期/未填写DD问答清单：</span>将由评审团基于平台可见数据及公开信息独立完成评估，确保所有参赛项目均纳入考量。</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-orange-200 mb-4">3. 内部评审团综合评估（不设僵硬配比分权）</h4>
                    <p className="text-gray-300 text-sm mb-4">
                      评审团将围绕"项目质地"进行综合评估，不因参赛时间先后或运营时长进行加分。主要考量方向包括：
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-900/30 rounded-lg p-4">
                        <h5 className="font-bold text-blue-300 mb-2">流量贡献</h5>
                        <p className="text-gray-400 text-xs">项目为平台和生态带来的新增用户、参与度与外部传播效果</p>
                      </div>
                      <div className="bg-gray-900/30 rounded-lg p-4">
                        <h5 className="font-bold text-green-300 mb-2">项目质量</h5>
                        <p className="text-gray-400 text-xs">代币及机制设计的稳健性、产品可用性与创新性</p>
                      </div>
                      <div className="bg-gray-900/30 rounded-lg p-4">
                        <h5 className="font-bold text-purple-300 mb-2">叙事与共识</h5>
                        <p className="text-gray-400 text-xs">项目叙事的清晰度、社区的认可度、二次创作与媒体传播表现</p>
                      </div>
                      <div className="bg-gray-900/30 rounded-lg p-4">
                        <h5 className="font-bold text-red-300 mb-2">团队效率</h5>
                        <p className="text-gray-400 text-xs">功能迭代速度、活动执行力、对市场及社区反馈的响应程度</p>
                      </div>
                    </div>
                    <p className="text-yellow-300 text-xs mt-4">
                      注：评审团将保留对异常数据（如刷量、操纵等）进行核查与修正的权力，并可在必要时要求补充说明。
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-orange-200 mb-4">4. 结果复核与公示</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• 初步评审结果形成后，将进入<span className="text-orange-400 font-bold">公开公示期（不少于 72 小时）</span>，在此期间社区可提出质询与补充证据</li>
                      <li>• 公示结束后，评审团将完成最终复核，并正式公布结果与获奖名单</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* B. 统计口径与数据源（统一说明） */}
            <div id="section3-b" className="mb-16">
              <h3 className="text-3xl font-bold text-cyan-300 mb-8">
                🔹 B. {language === 'zh' ? '统计口径与数据源（统一说明）' : 'Data Standards & Sources (Unified Description)'}
              </h3>
              <div className="bg-gradient-to-br from-gray-900/50 to-cyan-900/20 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-800/30 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-4">⏰</div>
                    <h4 className="text-lg font-bold text-cyan-200 mb-3">时间口径</h4>
                    <p className="text-gray-300 text-sm">
                      除非另行公告，所有统计以截止日 T0 的数据快照为基准；DD问答清单填写窗口期间，新增数据仅作佐证参考。
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-4">📊</div>
                    <h4 className="text-lg font-bold text-cyan-200 mb-3">数据来源</h4>
                    <p className="text-gray-300 text-sm">
                      平台内盘数据、公开链上数据、第三方区块浏览器、公开社媒与社区数据。
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-4">✅</div>
                    <h4 className="text-lg font-bold text-cyan-200 mb-3">一致性</h4>
                    <p className="text-gray-300 text-sm">
                      如清单内容与可见数据不一致，以可验证数据为准；主观描述可能会被要求提供证据，以证实真实性。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 第四部分：赛事时间线 */}
          <motion.section
            id="section4"
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-indigo-400 mb-8">
              📑 {language === 'zh' ? '第四部分：赛事时间线' : 'Part 4: Contest Timeline'}
            </h2>
            <p className="text-gray-300 leading-relaxed mb-12 text-lg">
              为了帮助所有参赛团队清晰掌握赛事进度，本届发射大赛设定了完整的时间线。请各项目方根据时间节点，合理安排发币、材料准备与社区动员，确保顺利参赛。
            </p>

            <div className="space-y-12">
              {/* 1. 开放期 */}
              <div id="section4-1" className="bg-gradient-to-br from-gray-900/50 to-green-900/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8">
                <h3 className="text-3xl font-bold text-green-300 mb-6">
                  🔹 1. {language === 'zh' ? '开放期（赛事启动 → 截止日）' : 'Open Period (Launch → Deadline)'}
                </h3>
                <p className="text-gray-300 mb-6">这是项目正式加入赛事的起点。</p>
                <div className="space-y-4">
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <h4 className="font-bold text-green-200 mb-2">平台开放</h4>
                    <p className="text-gray-300 text-sm">自赛事启动日，Flipflop 平台将全面开放，所有项目均可在此期间自由完成发币。</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <h4 className="font-bold text-green-200 mb-2">发币与登记</h4>
                    <p className="text-gray-300 text-sm">发币完成后，项目方必需填写（参赛登记表），提交代币合约地址及基本信息，以确认参赛资格。<span className="text-red-400">注：若活动截止，依旧未递交信息表，则视为未参加本活动，不会享受活动奖励</span></p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <h4 className="font-bold text-green-200 mb-2">持续推进</h4>
                    <p className="text-gray-300 text-sm">在开放期内，参赛项目可不断开展运营、建设社区与市场活动，为最终评审积累成果。</p>
                  </div>
                </div>
              </div>

              {/* 2. 截止日（T0） */}
              <div id="section4-2" className="bg-gradient-to-br from-gray-900/50 to-blue-900/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8">
                <h3 className="text-3xl font-bold text-blue-300 mb-6">
                  🔹 2. {language === 'zh' ? '截止日（T0）' : 'Deadline (T0)'}
                </h3>
                <p className="text-gray-300 mb-6">截止日将作为赛事的统一基准点。</p>
                <div className="space-y-4">
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">平台将在 T0 当日，对所有参赛项目进行链上与平台数据的统一快照；</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">此快照数据将作为最终评审与排名的重要参考，确保公平与一致性。</p>
                  </div>
                </div>
              </div>

              {/* 3. 考核内容提交期 */}
              <div id="section4-3" className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
                <h3 className="text-3xl font-bold text-purple-300 mb-6">
                  🔹 3. {language === 'zh' ? '考核内容提交期（T0 → T0+7 天）' : 'Assessment Content Submission Period (T0 → T0+7 Days)'}
                </h3>
                <p className="text-gray-300 mb-6">截止日后，项目进入DD问答清单填写阶段。</p>
                <div className="space-y-4">
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">所有参赛项目需在截止日起7天内，登录 Flipflop 官网完成（DD 问答清单）。清单涵盖基础信息、核心数据、项目叙事与团队规划。</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">平台将结合链上/社媒快照与清单回答进行评分与排名。</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">未在规定时间内提交清单者，将由评审团基于公开可见数据独立评估。</p>
                  </div>
                </div>
              </div>

              {/* 4. 评审与公示期 */}
              <div id="section4-4" className="bg-gradient-to-br from-gray-900/50 to-orange-900/20 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-8">
                <h3 className="text-3xl font-bold text-orange-300 mb-6">
                  🔹 4. {language === 'zh' ? '评审与公示期（T0+7 天 → T0+14 天）' : 'Review & Announcement Period (T0+7 Days → T0+14 Days)'}
                </h3>
                <p className="text-gray-300 mb-6">这一阶段是对成果的全面检验与公开确认。</p>
                <div className="space-y-4">
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">评审团将结合提交材料与数据快照，从<span className="text-orange-400 font-bold">流量贡献、项目质量、叙事与共识、团队效率</span>四个维度进行综合评估；</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">初步结果将在官网及社交媒体公开公示 72 小时，期间社区可通过各社媒渠道，提出意见或补充证据；</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">公示结束后，评审团将完成复核，并正式确认获奖名单。</p>
                  </div>
                </div>
              </div>

              {/* 5. Final Day */}
              <div id="section4-5" className="bg-gradient-to-br from-gray-900/50 to-yellow-900/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-8">
                <h3 className="text-3xl font-bold text-yellow-300 mb-6">
                  🔹 5. Final Day（{language === 'zh' ? '收官活动' : 'Grand Finale'}）
                </h3>
                <p className="text-gray-300 mb-6">赛事的高潮与总结。</p>
                <div className="space-y-4">
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">所有获奖项目将在 Final Day 集中公布，面向生态基金、合作伙伴与媒体进行展示；</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">获奖项目方需在收到获奖通知后7天内，与平台建立有效联系，并递交领奖信息；</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">官方将公布最终排名与各奖项归属，并举行颁奖仪式，为赛事画上圆满句号。</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 第五部分：毕业机制 & 特殊规则 */}
          <motion.section
            id="section5"
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-pink-400 mb-8">
              📑 {language === 'zh' ? '第五部分：毕业机制 & 特殊规则' : 'Part 5: Graduation Mechanism & Special Rules'}
            </h2>

            {/* 1. 毕业机制 */}
            <div id="section5-1" className="mb-16">
              <h3 className="text-3xl font-bold text-pink-300 mb-8">
                🔹 1. {language === 'zh' ? '毕业机制' : 'Graduation Mechanism'}
              </h3>
              <div className="bg-gradient-to-br from-gray-900/50 to-pink-900/20 backdrop-blur-sm border border-pink-500/30 rounded-2xl p-8">
                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                  在 Flipflop 平台，「毕业」不仅代表一个阶段的完成，更意味着项目从基础试验走向更成熟的市场阶段。为保证赛事的公平性与项目的成长性，本次发射大赛将采用以下毕业机制：
                </p>
                
                <div className="space-y-8">
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-pink-200 mb-4">毕业定义</h4>
                    <p className="text-gray-300 text-sm">
                      当项目满足平台设定的<span className="text-pink-400 font-bold">内盘 Mint 完成度，成功进入外盘</span>，即可认定为"毕业"。
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-pink-200 mb-4">毕业意义</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• 毕业是进入最终评审与奖励的前提条件；但不是唯一参考要素</li>
                      <li>• 毕业项目将自动获得「毕业大礼包」（现金奖励 + 宣发资源 + 社区扶持）</li>
                      <li>• 毕业证明了项目具备基本的社群动员力与市场承接力，为后续发展奠定基础</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-pink-200 mb-4">毕业激励</h4>
                    <p className="text-gray-300 text-sm">
                      通过毕业机制，鼓励参赛团队持续推动项目建设，积极带动社群与用户参与，而非停留在发币阶段。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 特殊规则：KOL 联盟化 */}
            <div id="section5-2" className="mb-16">
              <h3 className="text-3xl font-bold text-cyan-300 mb-8">
                🔹 2. {language === 'zh' ? '特殊规则：KOL 联盟化' : 'Special Rule: KOL Alliance'}
              </h3>
              <div className="bg-gradient-to-br from-gray-900/50 to-cyan-900/20 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8">
                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                  在 KOL 赛道中，我们将引入一项独特的"联盟化规则"，使得本赛道不仅仅是单一竞争，更是一次集体成长的实验。
                </p>
                
                <div className="space-y-8">
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-cyan-200 mb-4">联盟机制</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• 赛事结束后，表现突出的 KOL 项目将有机会加入 Flipflop KOL 联盟</li>
                      <li>• 联盟成员将在品牌、流量、社群和资源层面展开合作，形成更强的网络效应</li>
                      <li>• 平台将为联盟提供额外支持，包括联合 AMA、跨社区活动、媒体专访等</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-cyan-200 mb-4">联盟意义</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• 通过联盟化，KOL 不仅在赛事中形成良性竞争，也能在赛后携手共进</li>
                      <li>• 让"个人影响力代币"成长为跨社区协作的长期价值网络</li>
                      <li>• 以联盟为单位，探索更多玩法与激励机制（如联合代币池、跨社区治理实验）</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-cyan-200 mb-4">特别说明</h4>
                    <p className="text-gray-300 text-sm">
                      具体内容，将于比赛结束后对外公布。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 底部声明 */}
          <motion.div
            className="mt-16 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-xl p-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400 text-sm italic">
              本规则书旨在说明所有参赛细则，Flipflop 保留在必要时对规则进行修改、补充或提前终止的权利，最终解释权归 Flipflop 所有。
            </p>
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
                🚀 {language === 'zh' ? '立即参赛' : 'Register Now'}
              </a>
              <a
                href="/launch-contest/timeline"
                className="px-8 py-4 border-2 border-purple-400 text-purple-400 rounded-xl hover:bg-purple-400 hover:text-black transition-all duration-300 font-bold"
              >
                ⏰ {language === 'zh' ? '查看时间线' : 'View Timeline'}
              </a>
              <a
                href="/launch-contest/dd-questionnaire"
                className="px-8 py-4 border-2 border-pink-400 text-pink-400 rounded-xl hover:bg-pink-400 hover:text-black transition-all duration-300 font-bold"
              >
                📝 {language === 'zh' ? 'DD问答清单' : 'DD Questionnaire'}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
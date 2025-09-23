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
                ? 'Flipflop Launch 大赛规则书 2025.09.20 - 2025.12.31'
                : 'Flipflop Launch Contest Rulebook 2025.09.20 - 2025.12.31'
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
                      <p><span className="font-semibold text-cyan-300">{language === 'zh' ? '定义：' : 'Definition:'}</span>{language === 'zh' ? '围绕现实世界资产（债券、房地产、商品、艺术品等）的代币化尝试。' : 'Tokenization attempts around real-world assets (bonds, real estate, commodities, artworks, etc.).'}</p>
                      <p><span className="font-semibold text-cyan-300">{language === 'zh' ? '参赛对象：' : 'Target Participants:'}</span>{language === 'zh' ? '能把现实资产和链上机制结合的团队，哪怕是早期实验版本。' : 'Teams that can combine real assets with on-chain mechanisms, even early experimental versions.'}</p>
                      <p><span className="font-semibold text-cyan-300">{language === 'zh' ? '评判重点：' : 'Evaluation Focus:'}</span>{language === 'zh' ? '资产合规性、叙事清晰度、市场需求匹配度、代币经济模型的稳健性。' : 'Asset compliance, narrative clarity, market demand alignment, robustness of token economic model.'}</p>
                    </div>
                  </div>
                  
                  {/* 小应用赛道 */}
                  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                    <h4 className="text-xl font-bold text-cyan-200 mb-4">
                      2. {language === 'zh' ? '小应用赛道（Mini dApps）' : 'Mini dApps Track'}
                    </h4>
                    <div className="space-y-3 text-gray-300 text-sm">
                      <p><span className="font-semibold text-cyan-300">{language === 'zh' ? '定义：' : 'Definition:'}</span>{language === 'zh' ? '轻量级、灵活的小工具或应用，包括结合 AI 的小功能模块。' : 'Lightweight, flexible small tools or applications, including AI-integrated small functional modules.'}</p>
                      <p><span className="font-semibold text-cyan-300">{language === 'zh' ? '参赛对象：' : 'Target Participants:'}</span>{language === 'zh' ? '愿意通过小型产品切入市场、逐步积累用户和社群的团队' : 'Teams willing to enter the market through small products and gradually accumulate users and communities'}</p>
                      <p><span className="font-semibold text-cyan-300">{language === 'zh' ? '评判重点：' : 'Evaluation Focus:'}</span>{language === 'zh' ? '产品易用性、创新性、与社群结合度、早期用户反馈。' : 'Product usability, innovation, community integration, early user feedback.'}</p>
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
                      <p><span className="font-semibold text-purple-300">{language === 'zh' ? '定义：' : 'Definition:'}</span>{language === 'zh' ? '由个人创作者、意见领袖发行的代币，核心是个人影响力的时间价值代币化。' : 'Tokens issued by individual creators and opinion leaders, with the core being the tokenization of personal influence time value.'}</p>
                      <p><span className="font-semibold text-purple-300">{language === 'zh' ? '参赛对象：' : 'Target Participants:'}</span>{language === 'zh' ? '拥有一定粉丝基础，并愿意通过代币与支持者绑定成长的 KOL。' : 'KOLs with a certain fan base who are willing to bind growth with supporters through tokens.'}</p>
                      <p><span className="font-semibold text-purple-300">{language === 'zh' ? '评判重点：' : 'Evaluation Focus:'}</span>{language === 'zh' ? '粉丝参与率、社区活跃度、叙事传播力、长期承诺。' : 'Fan engagement rate, community activity, narrative dissemination power, long-term commitment.'}</p>
                    </div>
                  </div>
                  
                  {/* IP 赛道 */}
                  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                    <h4 className="text-xl font-bold text-purple-200 mb-4">
                      4. IP {language === 'zh' ? '赛道' : 'Track'}
                    </h4>
                    <div className="space-y-3 text-gray-300 text-sm">
                      <p><span className="font-semibold text-purple-300">{language === 'zh' ? '定义：' : 'Definition:'}</span>{language === 'zh' ? '围绕现有品牌、虚拟形象、内容版权或文化符号的代币化尝试。' : 'Tokenization attempts around existing brands, virtual characters, content copyrights, or cultural symbols.'}</p>
                      <p><span className="font-semibold text-purple-300">{language === 'zh' ? '参赛对象：' : 'Target Participants:'}</span>{language === 'zh' ? '原创 IP 创作者、动漫/影视/音乐等团队，或持有 IP 授权方。' : 'Original IP creators, anime/film/music teams, or IP license holders.'}</p>
                      <p><span className="font-semibold text-purple-300">{language === 'zh' ? '评判重点：' : 'Evaluation Focus:'}</span>{language === 'zh' ? 'IP 独特性、粉丝群体粘性、二次创作潜力、跨界联动能力。' : 'IP uniqueness, fan group stickiness, secondary creation potential, cross-border collaboration ability.'}</p>
                    </div>
                  </div>
                  
                  {/* 社区赛道 */}
                  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                    <h4 className="text-xl font-bold text-purple-200 mb-4">
                      5. {language === 'zh' ? '社区赛道' : 'Community Track'}
                    </h4>
                    <div className="space-y-3 text-gray-300 text-sm">
                      <p><span className="font-semibold text-purple-300">{language === 'zh' ? '定义：' : 'Definition:'}</span>{language === 'zh' ? '由 DAO、兴趣小组或社群组织主导的代币化尝试，强调共识驱动。' : 'Tokenization attempts led by DAOs, interest groups, or community organizations, emphasizing consensus-driven approaches.'}</p>
                      <p><span className="font-semibold text-purple-300">{language === 'zh' ? '参赛对象：' : 'Target Participants:'}</span>{language === 'zh' ? '自发形成的去中心化社区，或有清晰共识叙事的团队。' : 'Spontaneously formed decentralized communities, or teams with clear consensus narratives.'}</p>
                      <p><span className="font-semibold text-purple-300">{language === 'zh' ? '评判重点：' : 'Evaluation Focus:'}</span>{language === 'zh' ? '社区规模与活跃度、治理参与度、成员贡献度、叙事可持续性。' : 'Community size and activity, governance participation, member contribution, narrative sustainability.'}</p>
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
                    <h4 className="font-semibold text-yellow-200 mb-3">{language === 'zh' ? '1. 核心关注，但不限于此' : '1. Core Focus, But Not Limited To'}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {language === 'zh' 
                        ? '以上五个赛道为本届发射大赛的重点方向，代表了 Flipflop 平台目前希望孵化与推广的核心价值。但我们同样欢迎其他类型的创新项目参与，只要具备独特的叙事或强大的社群共识，也有机会获得认可与奖励。'
                        : 'The above five tracks are the key directions for this Launch Contest, representing the core values that the Flipflop platform currently hopes to incubate and promote. However, we also welcome other types of innovative projects to participate. As long as they have unique narratives or strong community consensus, they also have the opportunity to receive recognition and rewards.'
                      }
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="font-semibold text-yellow-200 mb-3">{language === 'zh' ? '2. 赛道灵活性' : '2. Track Flexibility'}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {language === 'zh' 
                        ? '如某一赛道参赛项目数量不足，评审团有权调整奖项设置，或合并赛道，剩余奖励不会收回，将由评审团择优颁发给未上榜的优质项目。'
                        : 'If the number of participating projects in a certain track is insufficient, the judging panel has the right to adjust award settings or merge tracks. Remaining rewards will not be withdrawn and will be awarded by the judging panel to quality projects that did not make the list.'
                      }
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="font-semibold text-yellow-200 mb-3">{language === 'zh' ? '3. 跨赛道参赛' : '3. Cross-Track Participation'}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {language === 'zh' 
                        ? '若项目特征横跨多个领域，可由团队自行选择最贴合的赛道报名，同一项目仅能在一个赛道进入最终排名，评审团将根据项目实际情况在最终考核时，综合考量其赛道适配度。'
                        : 'If a project spans multiple fields, teams can choose the most suitable track for registration. The same project can only enter the final ranking in one track. The judging panel will comprehensively consider the track suitability during the final assessment based on the actual situation of the project.'
                      }
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
                  <p className="text-xl text-gray-300">{language === 'zh' ? '超过 30 万美元规模的激励池' : 'Incentive pool exceeding $300,000'}</p>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {language === 'zh' 
                    ? '本届发射大赛将为参赛项目提供超过 30 万美元规模的激励池。这一激励不仅包含现金奖励与基金会生态基金扶持，更涵盖平台宣发、社区流量、孵化支持、全球合作资源等全方位扶持，确保优质项目能够在赛事中脱颖而出，并在未来的发展中获得持续支持。'
                    : 'This Launch Contest will provide participating projects with an incentive pool exceeding $300,000. This incentive not only includes cash rewards and foundation ecosystem fund support, but also covers platform promotion, community traffic, incubation support, global cooperation resources, and comprehensive support to ensure quality projects can stand out in the competition and receive continuous support in future development.'
                  }
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
                  {language === 'zh' 
                    ? '在 Flipflop，我们相信每一份努力都值得被看见。因此，所有成功完成「毕业」的项目将获得一份毕业大礼包包括：'
                    : 'At Flipflop, we believe every effort deserves to be seen. Therefore, all projects that successfully complete "graduation" will receive a graduation package including:'
                  }
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/30 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-4">💵</div>
                    <h4 className="text-xl font-bold text-green-400 mb-3">{language === 'zh' ? '500 U 现金奖励' : '500 U Cash Reward'}</h4>
                    <p className="text-gray-400 text-sm">{language === 'zh' ? '直接的资金支持' : 'Direct financial support'}</p>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-4">🪙</div>
                    <h4 className="text-xl font-bold text-yellow-400 mb-3">{language === 'zh' ? '生态基金扶持' : 'Ecosystem Fund Support'}</h4>
                    <p className="text-gray-400 text-sm">{language === 'zh' ? '可申请 Flipflop 基金会生态基金扶持' : 'Can apply for Flipflop Foundation ecosystem fund support'}</p>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-4">📢</div>
                    <h4 className="text-xl font-bold text-blue-400 mb-3">{language === 'zh' ? '官方推广' : 'Official Promotion'}</h4>
                    <p className="text-gray-400 text-sm">{language === 'zh' ? '官方推特单条 Spotlight 推文，周报/赛事简报统一介绍' : 'Official Twitter Spotlight tweet, weekly/contest brief unified introduction'}</p>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-4">👥</div>
                    <h4 className="text-xl font-bold text-purple-400 mb-3">{language === 'zh' ? '社区曝光' : 'Community Exposure'}</h4>
                    <p className="text-gray-400 text-sm">{language === 'zh' ? '社区 TG 频道公告 / 网页限时推荐位' : 'Community TG channel announcement / website limited-time recommendation'}</p>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-blue-300 italic text-lg">
                    {language === 'zh' 
                      ? '毕业意味着认可，也意味着新阶段的开始。我们将与每一个毕业项目并肩前行。'
                      : 'Graduation means recognition and also the beginning of a new stage. We will walk alongside every graduated project.'
                    }
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
                  {language === 'zh' 
                    ? '在赛事截止时，每个赛道将根据表现评选出最多三名获奖项目。获奖者将获得基金会生态基金扶持 + 资源扶持的双重支持：'
                    : 'At the end of the contest, each track will select up to three winning projects based on performance. Winners will receive dual support from foundation ecosystem fund support + resource support:'
                  }
                </p>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30">
                    <div className="flex items-center mb-4">
                      <span className="text-4xl mr-4">🥇</span>
                      <h4 className="text-2xl font-bold text-yellow-400">{language === 'zh' ? '第一名' : '1st Place'}</h4>
                    </div>
                    <p className="text-gray-300">
                      {language === 'zh' 
                        ? '100 SOL 基金会买入（约 $20,000）+ 深度宣发（AMA、长推、全球资源）'
                        : '100 SOL Foundation purchase (~$20,000) + Deep promotion (AMA, long tweets, global resources)'
                      }
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-400/20 to-gray-500/20 rounded-xl p-6 border border-gray-400/30">
                    <div className="flex items-center mb-4">
                      <span className="text-4xl mr-4">🥈</span>
                      <h4 className="text-2xl font-bold text-gray-300">{language === 'zh' ? '第二名' : '2nd Place'}</h4>
                    </div>
                    <p className="text-gray-300">
                      {language === 'zh' 
                        ? '50 SOL 基金会买入（约 $10,000）+ 媒体报道 + 官方 Spotlight'
                        : '50 SOL Foundation purchase (~$10,000) + Media coverage + Official Spotlight'
                      }
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-600/20 to-amber-700/20 rounded-xl p-6 border border-amber-600/30">
                    <div className="flex items-center mb-4">
                      <span className="text-4xl mr-4">🥉</span>
                      <h4 className="text-2xl font-bold text-amber-400">{language === 'zh' ? '第三名' : '3rd Place'}</h4>
                    </div>
                    <p className="text-gray-300">
                      {language === 'zh' 
                        ? '20 SOL 基金会买入（约 $4,000）+ Final Day 集中曝光'
                        : '20 SOL Foundation purchase (~$4,000) + Final Day concentrated exposure'
                      }
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
                  {language === 'zh' 
                    ? '为保证激励机制的公平性与执行力，本次发射大赛奖励机制特别说明如下：'
                    : 'To ensure the fairness and execution of the incentive mechanism, the reward mechanism for this Launch Contest is specifically explained as follows:'
                  }
                </p>
                
                <div className="space-y-8">
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-red-200 mb-4">{language === 'zh' ? '1. 奖励发放' : '1. Reward Distribution'}</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• {language === 'zh' ? '奖励名额与金额将根据实际项目数量与质量动态调整，只增不减' : 'Reward quotas and amounts will be dynamically adjusted based on actual project quantity and quality, only increasing, never decreasing'}</li>
                      <li>• {language === 'zh' ? '现金奖励将在赛事评审最终结果公布后 7–14 个工作日内发放' : 'Cash rewards will be distributed within 7-14 working days after the final results of the contest review are announced'}</li>
                      <li>• {language === 'zh' ? '基金会生态基金扶持将根据项目实际情况，采用分阶段买入的模式，以保证对项目代币价格的可持续支持' : 'Foundation ecosystem fund support will adopt a phased purchase model based on actual project conditions to ensure sustainable support for project token prices'}</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-red-200 mb-4">{language === 'zh' ? '2. 资源扶持' : '2. Resource Support'}</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• {language === 'zh' ? '资源扶持将在赛事结束后 1–3 个月内陆续安排' : 'Resource support will be arranged gradually within 1-3 months after the contest ends'}</li>
                      <li>• {language === 'zh' ? '将通过会议沟通，结合项目需求与平台排期，共同制定执行计划' : 'Through meeting communication, combining project needs with platform scheduling, we will jointly develop execution plans'}</li>
                      <li>• {language === 'zh' ? '获奖项目需积极配合平台安排的 AMA、媒体宣发及社区活动' : 'Winning projects need to actively cooperate with platform-arranged AMAs, media promotion, and community activities'}</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-red-200 mb-4">{language === 'zh' ? '3. 合规与责任' : '3. Compliance & Responsibility'}</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• {language === 'zh' ? '赛事对全球团队开放，但需遵守其所在司法辖区法律法规，需自行遵守所在司法辖区的税务与合规要求' : 'The contest is open to global teams, but must comply with local jurisdictional laws and regulations, and must independently comply with local jurisdictional tax and compliance requirements'}</li>
                      <li>• {language === 'zh' ? 'Flipflop 对因不可抗力或第三方原因造成的奖励发放延迟不承担法律责任，但将尽力保障参赛方权益' : 'Flipflop is not legally liable for reward distribution delays due to force majeure or third-party reasons, but will do its best to protect participants\' rights'}</li>
                      <li>• {language === 'zh' ? '注：若发现IP侵权，平台将立即中止其参赛资格，并不承担连带责任' : 'Note: If IP infringement is discovered, the platform will immediately suspend participation eligibility and bears no joint liability'}</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-red-200 mb-4">{language === 'zh' ? '4. 公平与评审' : '4. Fairness & Review'}</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• {language === 'zh' ? '若获奖团队在评审结束后 1 周内未与平台建立有效联系并提交领奖信息，将视为放弃奖励' : 'If winning teams do not establish effective contact with the platform and submit reward claim information within 1 week after the review ends, it will be considered as forfeiting the reward'}</li>
                      <li>• {language === 'zh' ? '若发现虚假信息、刷量、恶意操纵等行为，平台有权取消其参赛或获奖资格' : 'If false information, volume manipulation, malicious manipulation, or other behaviors are discovered, the platform has the right to cancel participation or winning eligibility'}</li>
                      <li>• {language === 'zh' ? '若项目特征涉及多个赛道，最终评审赛道由评审团确认' : 'If project characteristics involve multiple tracks, the final review track will be confirmed by the judging panel'}</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-red-200 mb-4">{language === 'zh' ? '5. 赛事时间线' : '5. Contest Timeline'}</h4>
                    <p className="text-gray-300 text-sm">
                      {language === 'zh' 
                        ? '主办方保留根据实际情况（如市场环境、不可抗力或其他合理原因），提前结束或调整本次大赛的权利，并将通过官网及官方社媒进行公告。'
                        : 'The organizer reserves the right to end or adjust this contest in advance based on actual circumstances (such as market conditions, force majeure, or other reasonable reasons), and will make announcements through the official website and official social media.'
                      }
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
                    <h4 className="text-xl font-bold text-orange-200 mb-4">{language === 'zh' ? '1. 参赛与登记' : '1. Participation & Registration'}</h4>
                    <ul className="space-y-3 text-gray-300 text-sm">
                      <li>• {language === 'zh' 
                        ? '本次竞赛的参赛单位以代币为独立计分单元。项目方在 Flipflop 平台完成发币后，必须通过（参赛信息表）提交代币合约地址及所属赛道方可参与活动。'
                        : 'The participation unit for this competition is tokens as independent scoring units. After completing token issuance on the Flipflop platform, project teams must submit token contract addresses and track categories through the (participation information form) to participate in the activity.'
                        }</li>
                      <li>• <span className="text-red-400">{language === 'zh' 
                        ? '注：若活动截止，依旧未递交信息表，则视为未参加本活动，不会享受活动奖励'
                        : 'Note: If the activity deadline passes and the information form is still not submitted, it will be considered as not participating in this activity and will not enjoy activity rewards'
                        }</span></li>
                      <li>• {language === 'zh' 
                        ? '项目方需在信息表中提供有效，可被邀请的Telegram账号，以进入专属群组，接受实时信息，配合后续安排。'
                        : 'Project teams need to provide valid, invitable Telegram accounts in the information form to enter exclusive groups, receive real-time information, and cooperate with subsequent arrangements.'
                        }</li>
                      <li>• {language === 'zh' 
                        ? '同一团队可发行多个代币参与，但仅以该团队表现最优的一个代币进入比赛最终排名，以避免名额占用并保障公平竞争。'
                        : 'The same team can issue multiple tokens to participate, but only the team\'s best-performing token will enter the final competition ranking to avoid quota occupation and ensure fair competition.'
                        }</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-orange-200 mb-4">{language === 'zh' ? '2. 截止日与DD（Due Diligence）问答清单递交（T0 ~ T0+7 天）' : '2. Deadline & DD (Due Diligence) Questionnaire Submission (T0 ~ T0+7 days)'}</h4>
                    <ul className="space-y-3 text-gray-300 text-sm">
                      <li>• <span className="font-bold text-orange-400">{language === 'zh' ? '统一截止日 T0：' : 'Unified Deadline T0:'}</span>{language === 'zh' 
                        ? '平台将在截止日锁定统计口径（包括链上数据、平台内盘数据及公开社媒快照）。'
                        : 'The platform will lock in statistical standards on the deadline (including on-chain data, platform internal market data, and public social media snapshots).'
                        }</li>
                      <li>• <span className="font-bold text-orange-400">{language === 'zh' ? 'DD问答清单填写窗口 7 天：' : 'DD Questionnaire Completion Window 7 days:'}</span>{language === 'zh' 
                        ? '所有参赛项目需在截止日起7天内，登录官网活动页面，完成填写DD （Due Diligence）问答清单，平台将结合链上/社媒快照与清单回答进行评分与排名，清单一旦递交不可修改。'
                        : 'All participating projects must log into the official website activity page within 7 days from the deadline to complete the DD (Due Diligence) questionnaire. The platform will combine on-chain/social media snapshots with questionnaire responses for scoring and ranking. Once submitted, the questionnaire cannot be modified.'
                        }</li>
                      <li>• <span className="font-bold text-orange-400">{language === 'zh' ? '逾期/未填写DD问答清单：' : 'Overdue/Unfilled DD Questionnaire:'}</span>{language === 'zh' 
                        ? '将由评审团基于平台可见数据及公开信息独立完成评估，确保所有参赛项目均纳入考量。'
                        : 'Will be independently evaluated by the judging panel based on platform-visible data and public information to ensure all participating projects are considered.'
                        }</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-orange-200 mb-4">{language === 'zh' ? '3. 内部评审团综合评估（不设僵硬配比分权）' : '3. Internal Judging Panel Comprehensive Evaluation (No Rigid Scoring Weights)'}</h4>
                    <p className="text-gray-300 text-sm mb-4">
                      {language === 'zh' 
                        ? '评审团将围绕"项目质地"进行综合评估，不因参赛时间先后或运营时长进行加分。主要考量方向包括：'
                        : 'The judging panel will conduct comprehensive evaluation around "project quality", without bonus points for participation timing or operation duration. Main considerations include:'
                      }
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-900/30 rounded-lg p-4">
                        <h5 className="font-bold text-blue-300 mb-2">{language === 'zh' ? '流量贡献' : 'Traffic Contribution'}</h5>
                        <p className="text-gray-400 text-xs">{language === 'zh' ? '项目为平台和生态带来的新增用户、参与度与外部传播效果' : 'New users, engagement, and external dissemination effects brought to the platform and ecosystem by the project'}</p>
                      </div>
                      <div className="bg-gray-900/30 rounded-lg p-4">
                        <h5 className="font-bold text-green-300 mb-2">{language === 'zh' ? '项目质量' : 'Project Quality'}</h5>
                        <p className="text-gray-400 text-xs">{language === 'zh' ? '代币及机制设计的稳健性、产品可用性与创新性' : 'Robustness of token and mechanism design, product usability and innovation'}</p>
                      </div>
                      <div className="bg-gray-900/30 rounded-lg p-4">
                        <h5 className="font-bold text-purple-300 mb-2">{language === 'zh' ? '叙事与共识' : 'Narrative & Consensus'}</h5>
                        <p className="text-gray-400 text-xs">{language === 'zh' ? '项目叙事的清晰度、社区的认可度、二次创作与媒体传播表现' : 'Clarity of project narrative, community recognition, secondary creation and media dissemination performance'}</p>
                      </div>
                      <div className="bg-gray-900/30 rounded-lg p-4">
                        <h5 className="font-bold text-red-300 mb-2">{language === 'zh' ? '团队效率' : 'Team Efficiency'}</h5>
                        <p className="text-gray-400 text-xs">{language === 'zh' ? '功能迭代速度、活动执行力、对市场及社区反馈的响应程度' : 'Feature iteration speed, activity execution capability, responsiveness to market and community feedback'}</p>
                      </div>
                    </div>
                    <p className="text-yellow-300 text-xs mt-4">
                      {language === 'zh' 
                        ? '注：评审团将保留对异常数据（如刷量、操纵等）进行核查与修正的权力，并可在必要时要求补充说明。'
                        : 'Note: The judging panel reserves the right to verify and correct abnormal data (such as volume manipulation, manipulation, etc.) and may require supplementary explanations when necessary.'
                      }
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-orange-200 mb-4">{language === 'zh' ? '4. 结果复核与公示' : '4. Result Review & Public Announcement'}</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• {language === 'zh' 
                        ? '初步评审结果形成后，将进入公开公示期（不少于 72 小时），在此期间社区可提出质询与补充证据'
                        : 'After preliminary review results are formed, there will be a public announcement period (no less than 72 hours), during which the community can raise inquiries and provide supplementary evidence'
                        }</li>
                      <li>• {language === 'zh' 
                        ? '公示结束后，评审团将完成最终复核，并正式公布结果与获奖名单'
                        : 'After the announcement period ends, the judging panel will complete the final review and officially announce the results and winner list'
                        }</li>
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
                    <h4 className="text-lg font-bold text-cyan-200 mb-3">{language === 'zh' ? '时间口径' : 'Time Standards'}</h4>
                    <p className="text-gray-300 text-sm">
                      {language === 'zh' 
                        ? '除非另行公告，所有统计以截止日 T0 的数据快照为基准；DD问答清单填写窗口期间，新增数据仅作佐证参考。'
                        : 'Unless otherwise announced, all statistics are based on the data snapshot at deadline T0; during the DD questionnaire completion window, new data is for evidentiary reference only.'
                      }
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-4">📊</div>
                    <h4 className="text-lg font-bold text-cyan-200 mb-3">{language === 'zh' ? '数据来源' : 'Data Sources'}</h4>
                    <p className="text-gray-300 text-sm">
                      {language === 'zh' 
                        ? '平台内盘数据、公开链上数据、第三方区块浏览器、公开社媒与社区数据。'
                        : 'Platform internal market data, public on-chain data, third-party block explorers, public social media and community data.'
                      }
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-4">✅</div>
                    <h4 className="text-lg font-bold text-cyan-200 mb-3">{language === 'zh' ? '一致性' : 'Consistency'}</h4>
                    <p className="text-gray-300 text-sm">
                      {language === 'zh' 
                        ? '如清单内容与可见数据不一致，以可验证数据为准；主观描述可能会被要求提供证据，以证实真实性。'
                        : 'If checklist content is inconsistent with visible data, verifiable data shall prevail; subjective descriptions may be required to provide evidence to confirm authenticity.'
                      }
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
              {language === 'zh' 
                ? '为了帮助所有参赛团队清晰掌握赛事进度，本届发射大赛设定了完整的时间线。请各项目方根据时间节点，合理安排发币、材料准备与社区动员，确保顺利参赛。'
                : 'To help all participating teams clearly understand the contest progress, this Launch Contest has established a complete timeline. Please arrange token issuance, material preparation, and community mobilization according to the time nodes to ensure smooth participation.'
              }
            </p>

            <div className="space-y-12">
              {/* 1. 开放期 */}
              <div id="section4-1" className="bg-gradient-to-br from-gray-900/50 to-green-900/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8">
                <h3 className="text-3xl font-bold text-green-300 mb-6">
                  🔹 1. {language === 'zh' ? '开放期（赛事启动 → 截止日）' : 'Open Period (Launch → Deadline)'}
                </h3>
                <p className="text-gray-300 mb-6">{language === 'zh' ? '这是项目正式加入赛事的起点。' : 'This is the starting point for projects to officially join the contest.'}</p>
                <div className="space-y-4">
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <h4 className="font-bold text-green-200 mb-2">{language === 'zh' ? '平台开放' : 'Platform Opening'}</h4>
                    <p className="text-gray-300 text-sm">{language === 'zh' ? '自赛事启动日，Flipflop 平台将全面开放，所有项目均可在此期间自由完成发币。' : 'From the contest launch date, the Flipflop platform will be fully open, and all projects can freely complete token issuance during this period.'}</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <h4 className="font-bold text-green-200 mb-2">{language === 'zh' ? '发币与登记' : 'Token Issuance & Registration'}</h4>
                    <p className="text-gray-300 text-sm">
                      {language === 'zh' 
                        ? '发币完成后，项目方必需填写（参赛登记表），提交代币合约地址及基本信息，以确认参赛资格。注：若活动截止，依旧未递交信息表，则视为未参加本活动，不会享受活动奖励'
                        : 'After token issuance, project teams must fill out the (Registration Form), submit token contract address and basic information to confirm participation eligibility. Note: If the activity deadline passes without submitting the information form, it will be considered as not participating in this activity and will not enjoy activity rewards.'
                      }
                    </p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <h4 className="font-bold text-green-200 mb-2">{language === 'zh' ? '持续推进' : 'Continuous Progress'}</h4>
                    <p className="text-gray-300 text-sm">{language === 'zh' ? '在开放期内，参赛项目可不断开展运营、建设社区与市场活动，为最终评审积累成果。' : 'During the open period, participating projects can continuously carry out operations, community building, and market activities to accumulate achievements for the final review.'}</p>
                  </div>
                </div>
              </div>

              {/* 2. 截止日（T0） */}
              <div id="section4-2" className="bg-gradient-to-br from-gray-900/50 to-blue-900/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8">
                <h3 className="text-3xl font-bold text-blue-300 mb-6">
                  🔹 2. {language === 'zh' ? '截止日（T0）' : 'Deadline (T0)'}
                </h3>
                <p className="text-gray-300 mb-6">{language === 'zh' ? '截止日将作为赛事的统一基准点。' : 'The deadline will serve as the unified benchmark for the contest.'}</p>
                <div className="space-y-4">
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">{language === 'zh' ? '平台将在 T0 当日，对所有参赛项目进行链上与平台数据的统一快照；' : 'On T0 day, the platform will take a unified snapshot of on-chain and platform data for all participating projects;'}</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">{language === 'zh' ? '此快照数据将作为最终评审与排名的重要参考，确保公平与一致性。' : 'This snapshot data will serve as an important reference for final review and ranking, ensuring fairness and consistency.'}</p>
                  </div>
                </div>
              </div>

              {/* 3. 考核内容提交期 */}
              <div id="section4-3" className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
                <h3 className="text-3xl font-bold text-purple-300 mb-6">
                  🔹 3. {language === 'zh' ? '考核内容提交期（T0 → T0+7 天）' : 'Assessment Content Submission Period (T0 → T0+7 Days)'}
                </h3>
                <p className="text-gray-300 mb-6">{language === 'zh' ? '截止日后，项目进入DD问答清单填写阶段。' : 'After the deadline, projects enter the DD questionnaire completion phase.'}</p>
                <div className="space-y-4">
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">{language === 'zh' ? '所有参赛项目需在截止日起7天内，登录 Flipflop 官网完成（DD 问答清单）。清单涵盖基础信息、核心数据、项目叙事与团队规划。' : 'All participating projects must complete the (DD Questionnaire) on the Flipflop official website within 7 days from the deadline. The questionnaire covers basic information, core data, project narrative, and team planning.'}</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">{language === 'zh' ? '平台将结合链上/社媒快照与清单回答进行评分与排名。' : 'The platform will combine on-chain/social media snapshots with questionnaire responses for scoring and ranking.'}</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">{language === 'zh' ? '未在规定时间内提交清单者，将由评审团基于公开可见数据独立评估。' : 'Those who fail to submit the questionnaire within the specified time will be independently evaluated by the judging panel based on publicly visible data.'}</p>
                  </div>
                </div>
              </div>

              {/* 4. 评审与公示期 */}
              <div id="section4-4" className="bg-gradient-to-br from-gray-900/50 to-orange-900/20 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-8">
                <h3 className="text-3xl font-bold text-orange-300 mb-6">
                  🔹 4. {language === 'zh' ? '评审与公示期（T0+7 天 → T0+14 天）' : 'Review & Announcement Period (T0+7 Days → T0+14 Days)'}
                </h3>
                <p className="text-gray-300 mb-6">{language === 'zh' ? '这一阶段是对成果的全面检验与公开确认。' : 'This stage is a comprehensive examination and public confirmation of achievements.'}</p>
                <div className="space-y-4">
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">
                      {language === 'zh' 
                        ? '评审团将结合提交材料与数据快照，从流量贡献、项目质量、叙事与共识、团队效率四个维度进行综合评估；'
                        : 'The judging panel will combine submitted materials with data snapshots to conduct comprehensive evaluation from four dimensions: traffic contribution, project quality, narrative & consensus, and team efficiency;'
                      }
                    </p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">{language === 'zh' ? '初步结果将在官网及社交媒体公开公示 72 小时，期间社区可通过各社媒渠道，提出意见或补充证据；' : 'Preliminary results will be publicly announced on the official website and social media for 72 hours, during which the community can provide feedback or additional evidence through various social media channels;'}</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">{language === 'zh' ? '公示结束后，评审团将完成复核，并正式确认获奖名单。' : 'After the announcement period, the judging panel will complete the review and officially confirm the award list.'}</p>
                  </div>
                </div>
              </div>

              {/* 5. Final Day */}
              <div id="section4-5" className="bg-gradient-to-br from-gray-900/50 to-yellow-900/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-8">
                <h3 className="text-3xl font-bold text-yellow-300 mb-6">
                  🔹 5. Final Day（{language === 'zh' ? '收官活动' : 'Grand Finale'}）
                </h3>
                <p className="text-gray-300 mb-6">{language === 'zh' ? '赛事的高潮与总结。' : 'The climax and conclusion of the contest.'}</p>
                <div className="space-y-4">
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">{language === 'zh' ? '所有获奖项目将在 Final Day 集中公布，面向生态基金、合作伙伴与媒体进行展示；' : 'All winning projects will be announced collectively on Final Day, showcasing to ecosystem funds, partners, and media;'}</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">{language === 'zh' ? '获奖项目方需在收到获奖通知后7天内，与平台建立有效联系，并递交领奖信息；' : 'Winning project teams must establish effective contact with the platform and submit award collection information within 7 days of receiving the award notification;'}</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">{language === 'zh' ? '官方将公布最终排名与各奖项归属，并举行颁奖仪式，为赛事画上圆满句号。' : 'The official will announce the final rankings and award allocations, and hold an award ceremony to bring the contest to a perfect conclusion.'}</p>
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
                  {language === 'zh' 
                    ? '在 Flipflop 平台，「毕业」不仅代表一个阶段的完成，更意味着项目从基础试验走向更成熟的市场阶段。为保证赛事的公平性与项目的成长性，本次发射大赛将采用以下毕业机制：'
                    : 'On the Flipflop platform, "graduation" not only represents the completion of a stage, but also means projects moving from basic experimentation to a more mature market stage. To ensure fairness and project growth, this Launch Contest will adopt the following graduation mechanism:'
                  }
                </p>
                
                <div className="space-y-8">
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-pink-200 mb-4">{language === 'zh' ? '毕业定义' : 'Graduation Definition'}</h4>
                    <p className="text-gray-300 text-sm">
                      {language === 'zh' 
                        ? '当项目满足平台设定的内盘 Mint 完成度，成功进入外盘，即可认定为"毕业"。'
                        : 'When a project meets the platform-set internal market mint completion rate and successfully enters the external market, it can be recognized as "graduated".'
                      }
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-pink-200 mb-4">{language === 'zh' ? '毕业意义' : 'Graduation Significance'}</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• {language === 'zh' ? '毕业是进入最终评审与奖励的前提条件；但不是唯一参考要素' : 'Graduation is a prerequisite for entering final review and rewards; but not the only reference factor'}</li>
                      <li>• {language === 'zh' ? '毕业项目将自动获得「毕业大礼包」（现金奖励 + 宣发资源 + 社区扶持）' : 'Graduated projects will automatically receive the "Graduation Package" (cash rewards + promotional resources + community support)'}</li>
                      <li>• {language === 'zh' ? '毕业证明了项目具备基本的社群动员力与市场承接力，为后续发展奠定基础' : 'Graduation proves that the project has basic community mobilization and market acceptance capabilities, laying the foundation for future development'}</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-pink-200 mb-4">{language === 'zh' ? '毕业激励' : 'Graduation Incentive'}</h4>
                    <p className="text-gray-300 text-sm">
                      {language === 'zh' 
                        ? '通过毕业机制，鼓励参赛团队持续推动项目建设，积极带动社群与用户参与，而非停留在发币阶段。'
                        : 'Through the graduation mechanism, participating teams are encouraged to continuously promote project development, actively drive community and user participation, rather than staying at the token issuance stage.'
                      }
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
                  {language === 'zh' 
                    ? '在 KOL 赛道中，我们将引入一项独特的"联盟化规则"，使得本赛道不仅仅是单一竞争，更是一次集体成长的实验。'
                    : 'In the KOL track, we will introduce a unique "alliance rule" that makes this track not just a single competition, but an experiment in collective growth.'
                  }
                </p>
                
                <div className="space-y-8">
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-cyan-200 mb-4">{language === 'zh' ? '联盟机制' : 'Alliance Mechanism'}</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• {language === 'zh' ? '赛事结束后，表现突出的 KOL 项目将有机会加入 Flipflop KOL 联盟' : 'After the contest, outstanding KOL projects will have the opportunity to join the Flipflop KOL Alliance'}</li>
                      <li>• {language === 'zh' ? '联盟成员将在品牌、流量、社群和资源层面展开合作，形成更强的网络效应' : 'Alliance members will collaborate at brand, traffic, community, and resource levels to create stronger network effects'}</li>
                      <li>• {language === 'zh' ? '平台将为联盟提供额外支持，包括联合 AMA、跨社区活动、媒体专访等' : 'The platform will provide additional support to the alliance, including joint AMAs, cross-community events, media interviews, etc.'}</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-cyan-200 mb-4">{language === 'zh' ? '联盟意义' : 'Alliance Significance'}</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• {language === 'zh' ? '通过联盟化，KOL 不仅在赛事中形成良性竞争，也能在赛后携手共进' : 'Through alliance formation, KOLs not only form healthy competition during the contest but can also work together after the contest'}</li>
                      <li>• {language === 'zh' ? '让"个人影响力代币"成长为跨社区协作的长期价值网络' : 'Allow "personal influence tokens" to grow into long-term value networks for cross-community collaboration'}</li>
                      <li>• {language === 'zh' ? '以联盟为单位，探索更多玩法与激励机制（如联合代币池、跨社区治理实验）' : 'Use the alliance as a unit to explore more gameplay and incentive mechanisms (such as joint token pools, cross-community governance experiments)'}</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-cyan-200 mb-4">{language === 'zh' ? '特别说明' : 'Special Note'}</h4>
                    <p className="text-gray-300 text-sm">
                      {language === 'zh' ? '具体内容，将于比赛结束后对外公布。' : 'Specific details will be announced after the contest ends.'}
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
              {language === 'zh' 
                ? '本规则书旨在说明所有参赛细则，Flipflop 保留在必要时对规则进行修改、补充或提前终止的权利，最终解释权归 Flipflop 所有。'
                : 'This rulebook aims to explain all participation details. Flipflop reserves the right to modify, supplement, or terminate the rules when necessary. The final interpretation right belongs to Flipflop.'
              }
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
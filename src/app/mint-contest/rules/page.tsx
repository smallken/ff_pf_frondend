'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

export default function MintRules() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 返回按钮 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <a
            href="/mint-contest"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-bold rounded-lg hover:from-gray-700 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 border-2 border-gray-600 hover:border-gray-500"
          >
            <span className="mr-2">←</span>
            {language === 'zh' ? '返回Mint大赛' : 'Back to Mint Competition'}
          </a>
        </motion.div>

        {/* 页面标题 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
            {language === 'zh' ? 'Flipflop Mint大赛规则书' : 'Flipflop Mint Competition Rules'}
          </h1>
          <p className="text-xl text-gray-300">
            {language === 'zh' 
              ? '9月20日 – 10月05日'
              : 'September 20 - October 05'
            }
          </p>
        </motion.div>

        {/* 主要内容 */}
        <motion.div
          className="space-y-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* 大赛概述 */}
          <div className="bg-gradient-to-r from-gray-900/50 to-red-900/30 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-red-400 mb-6">🎮 {language === 'zh' ? '大赛概述' : 'Competition Overview'}</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                {language === 'zh' ? (
                  'Flipflop Mint大赛 · 铸造狂欢季正式开启！从 9月20日到10月05日，Flipflop将迎来一场属于所有 工作室与个人玩家 的链上挑战赛。 这不仅是一场关于 现金奖励 的角逐，更是一场检验 社区凝聚力与创造力 的竞赛。'
                ) : (
                  'Flipflop Mint Competition · Minting Carnival Season officially launched! From September 20th to October 5th, Flipflop will host an on-chain challenge for all studios and individual players. This is not just a competition about cash rewards, but also a test of community cohesion and creativity.'
                )}
              </p>
              <p>
                {language === 'zh' ? (
                  '在这里：你可以用实力证明自己，在链上留下属于团队或个人的荣耀记录；你可以凭借一次次Mint，冲击排行榜，赢取最高 1500 USDT 的现金大奖；你还将有机会获得项目方、基金、全球资源的关注与支持，打开更多合作与成长的机会。'
                ) : (
                  'Here: You can prove yourself with strength and leave glorious records on the chain for your team or personal achievements; You can climb the leaderboard through continuous Minting and win up to 1500 USDT in cash prizes; You will also have the opportunity to gain attention and support from project parties, funds, and global resources, opening up more opportunities for cooperation and growth.'
                )}
              </p>
              <p>
                {language === 'zh' ? (
                  'Flipflop相信：每一次Mint，不只是一个数字，更是推动整个生态向前的动力。在这场大赛中，没有边缘人，每一位参与者都是生态建设者。现在，就是展示你与团队力量的最佳时机！'
                ) : (
                  'Flipflop believes: Every Mint is not just a number, but the driving force that pushes the entire ecosystem forward. In this competition, there are no outsiders - every participant is an ecosystem builder. Now is the best time to showcase your and your team\'s strength!'
                )}
              </p>
            </div>
          </div>

          {/* 参赛组别 */}
          <div className="bg-gradient-to-r from-gray-900/50 to-blue-900/30 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">🏆 {language === 'zh' ? '参赛组别' : 'Competition Categories'}</h2>
            <p className="text-gray-300 mb-6">
              {language === 'zh' ? (
                '为了让更多人都能在链上展示实力，本次大赛设立 工作室赛道 与 个人赛道，无论你是经验丰富的团队，还是独立创作者，都有属于你的舞台。'
              ) : (
                'To allow more people to showcase their strength on-chain, this competition has established Studio Track and Individual Track. Whether you are an experienced team or an independent creator, there is a stage for you.'
              )}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 工作室赛道 */}
              <div className="bg-gradient-to-br from-red-900/40 to-pink-900/40 rounded-xl p-6 border border-red-500/30">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">🐕</div>
                  <h3 className="text-2xl font-bold text-red-400">{language === 'zh' ? '工作室赛道' : 'Studio Track'}</h3>
                </div>
                <div className="space-y-3 text-gray-300">
                  <p><strong>{language === 'zh' ? '参赛方式：' : 'Participation Method:'}</strong>{language === 'zh' ? '以团队身份参赛，需提交统一参赛钱包地址' : 'Participate as a team, need to submit a unified competition wallet address'}</p>
                  <p><strong>{language === 'zh' ? '适合人群：' : 'Target Audience:'}</strong>{language === 'zh' ? '社区主理人、项目孵化团队、运营工作室' : 'Community managers, project incubation teams, operation studios'}</p>
                  <div>
                    <strong>{language === 'zh' ? '优势亮点：' : 'Advantages:'}</strong>
                    <ul className="mt-2 space-y-1 ml-4">
                      <li>• {language === 'zh' ? '有机会角逐更高额的现金奖励' : 'Opportunity to compete for higher cash rewards'}</li>
                      <li>• {language === 'zh' ? '展示团队协作与资源整合能力' : 'Showcase team collaboration and resource integration capabilities'}</li>
                      <li>• {language === 'zh' ? '并有可能获得基金及全球资源的优先对接' : 'May receive priority access to funds and global resources'}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 个人赛道 */}
              <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-xl p-6 border border-blue-500/30">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">🐾</div>
                  <h3 className="text-2xl font-bold text-blue-400">{language === 'zh' ? '个人赛道' : 'Individual Track'}</h3>
                </div>
                <div className="space-y-3 text-gray-300">
                  <p><strong>{language === 'zh' ? '参赛方式：' : 'Participation Method:'}</strong>{language === 'zh' ? '使用个人钱包地址参赛，独立统计Mint数据' : 'Use personal wallet address to participate, independent Mint data statistics'}</p>
                  <p><strong>{language === 'zh' ? '适合人群：' : 'Target Audience:'}</strong>{language === 'zh' ? '独立创作者、个人玩家、Web3爱好者' : 'Independent creators, individual players, Web3 enthusiasts'}</p>
                  <div>
                    <strong>{language === 'zh' ? '优势亮点：' : 'Advantages:'}</strong>
                    <ul className="mt-2 space-y-1 ml-4">
                      <li>• {language === 'zh' ? '不限经验，新人也能凭实力上榜' : 'No experience restrictions, newcomers can also rank with strength'}</li>
                      <li>• {language === 'zh' ? '轻松参赛，单枪匹马也能赢取大奖' : 'Easy participation, solo players can also win big prizes'}</li>
                      <li>• {language === 'zh' ? '提升个人影响力，获得生态认可' : 'Enhance personal influence and gain ecosystem recognition'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl p-4 border border-green-500/30">
              <h4 className="text-lg font-bold text-green-400 mb-2">{language === 'zh' ? '参赛资格说明' : 'Eligibility Requirements'}</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• {language === 'zh' ? '所有参赛者需使用 Flipflop平台进行Mint，链上数据透明可查' : 'All participants must use the Flipflop platform for Minting, with transparent and verifiable on-chain data'}</li>
                <li>• {language === 'zh' ? '不限国籍、不限经验，只要你敢于Mint，就能参与角逐' : 'No nationality or experience restrictions - if you dare to Mint, you can participate'}</li>
                <li>• {language === 'zh' ? '工作室与个人赛道互不冲突，可分别报名参赛' : 'Studio and Individual tracks do not conflict and can be registered separately'}</li>
              </ul>
            </div>
          </div>

          {/* 奖励机制 */}
          <div className="bg-gradient-to-r from-gray-900/50 to-yellow-900/30 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-yellow-400 mb-6">💰 {language === 'zh' ? '奖励机制' : 'Reward Mechanism'}</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {language === 'zh' ? (
                '本次大赛设立 总价值30万美金的长期奖金池，奖励将按照系列赛事分期发放。每一阶段赛事，现金奖励都会单独核算与发放，确保每位参赛者的努力都有清晰、公平的回报。这不仅仅是一场比赛，而是一次长期的激励计划，奖金数额可根据参赛热度追加，但不会减少。'
              ) : (
                'This competition establishes a long-term prize pool with a total value of $300,000, with rewards distributed in phases according to the series of events. For each stage of the competition, cash rewards will be calculated and distributed separately, ensuring that every participant\'s efforts receive clear and fair returns. This is not just a competition, but a long-term incentive program. Prize amounts can be increased based on participation enthusiasm, but will not be reduced.'
              )}
            </p>
            
            <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 rounded-xl p-4 mb-6">
              <p className="text-center font-semibold text-red-400">
                📌 {language === 'zh' ? '说明：奖金数额会根据参赛热度适度追加，但绝不会减少！' : 'Note: Prize amounts will be moderately increased based on participation enthusiasm, but will never be reduced!'}
              </p>
            </div>

            {/* 奖励表格 */}
            <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-xl p-6 mb-6 border border-yellow-500/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <h4 className="text-xl font-bold text-yellow-400 mb-3">🐕 {language === 'zh' ? '工作室赛道' : 'Studio Track'}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">{language === 'zh' ? '第一名' : '1st Place'}</span>
                      <span className="text-yellow-400 font-bold">1500 USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">{language === 'zh' ? '第二名' : '2nd Place'}</span>
                      <span className="text-yellow-400 font-bold">1000 USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">{language === 'zh' ? '第三名' : '3rd Place'}</span>
                      <span className="text-yellow-400 font-bold">500 USDT</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-bold text-cyan-400 mb-3">👤 {language === 'zh' ? '个人赛道' : 'Individual Track'}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">{language === 'zh' ? '第一名' : '1st Place'}</span>
                      <span className="text-cyan-400 font-bold">800 USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">{language === 'zh' ? '第二名' : '2nd Place'}</span>
                      <span className="text-cyan-400 font-bold">500 USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">{language === 'zh' ? '第三名' : '3rd Place'}</span>
                      <span className="text-cyan-400 font-bold">300 USDT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 额外权益 */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">🌟 {language === 'zh' ? '额外权益' : 'Additional Benefits'}</h3>
              <p className="text-lg text-gray-300 mb-6">
                {language === 'zh' ? (
                  '本次大赛不仅仅提供现金奖励，获奖团队与个人还有机会获得 Flipflop 生态赋能的多重权益包括但不限于资源扶持、流量曝光、项目背书、平台话语权，助力你在 Web3 赛道走得更远：'
                ) : (
                  'This competition not only provides cash rewards, but winning teams and individuals also have the opportunity to receive multiple benefits empowered by the Flipflop ecosystem, including but not limited to resource support, traffic exposure, project endorsement, and platform voice, helping you go further in the Web3 track:'
                )}
              </p>
              
              <div className="space-y-6">
                {/* 1. 项目优先权 */}
                <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-blue-500/30">
                  <h4 className="text-xl font-bold text-blue-400 mb-3">1. {language === 'zh' ? '项目优先权' : 'Project Priority'}</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400">•</span>
                      <span className="text-gray-300">{language === 'zh' ? '有机会直通 优质项目 Mint，抢先参与最具潜力的生态发行；' : 'Opportunity to directly access high-quality project Minting and participate in the most promising ecosystem launches first;'}</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400">•</span>
                      <span className="text-gray-300">{language === 'zh' ? '可优先获邀参与项目方 AMA（线上问答） 与 战略讨论，直接与核心团队沟通，掌握一手信息。' : 'Priority invitation to participate in project AMAs (online Q&A) and strategic discussions, direct communication with core teams, and access to first-hand information.'}</span>
                    </li>
                  </ul>
                </div>

                {/* 2. 基金与资源扶持 */}
                <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-500/30">
                  <h4 className="text-xl font-bold text-green-400 mb-3">2. {language === 'zh' ? '基金与资源扶持' : 'Fund & Resource Support'}</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400">•</span>
                      <span className="text-gray-300"><strong>{language === 'zh' ? '基金支持：' : 'Fund Support:'}</strong>{language === 'zh' ? '有机会得到由 Flipflop 基金或合作生态基金参与扶持，增加你项目的热度与流动性；' : 'Opportunity to receive support from Flipflop funds or partner ecosystem funds, increasing your project\'s popularity and liquidity;'}</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400">•</span>
                      <span className="text-gray-300"><strong>{language === 'zh' ? '全球资源接入：' : 'Global Resource Access:'}</strong>{language === 'zh' ? '可享受包括国际合作伙伴、行业论坛、生态大会等曝光机会；' : 'Access to exposure opportunities including international partners, industry forums, ecosystem conferences, etc.;'}</span>
                    </li>
                  </ul>
                </div>

                {/* 3. 社区与流量支持 */}
                <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/30">
                  <h4 className="text-xl font-bold text-purple-400 mb-3">3. {language === 'zh' ? '社区与流量支持' : 'Community & Traffic Support'}</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-400">•</span>
                      <span className="text-gray-300"><strong>{language === 'zh' ? '官方曝光：' : 'Official Exposure:'}</strong>{language === 'zh' ? '获奖名单将在 Flipflop 官网、社交媒体及合作媒体重点推送；' : 'Winners list will be prominently featured on Flipflop official website, social media, and partner media;'}</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-400">•</span>
                      <span className="text-gray-300"><strong>{language === 'zh' ? '社区重点推荐：' : 'Community Priority Recommendation:'}</strong>{language === 'zh' ? '有机会获得社群话题引导与流量倾斜，帮助你扩大影响力；' : 'Opportunity to receive community topic guidance and traffic support to help expand your influence;'}</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-400">•</span>
                      <span className="text-gray-300"><strong>{language === 'zh' ? '跨社区合作：' : 'Cross-Community Cooperation:'}</strong>{language === 'zh' ? '将优先考虑推荐至合作方社区，吸引更多潜在支持者。' : 'Priority consideration for recommendation to partner communities, attracting more potential supporters.'}</span>
                    </li>
                  </ul>
                </div>

                {/* 4. 平台发展参与权 */}
                <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl p-6 border border-yellow-500/30">
                  <h4 className="text-xl font-bold text-yellow-400 mb-3">4. {language === 'zh' ? '平台发展参与权' : 'Platform Development Participation Rights'}</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-yellow-400">•</span>
                      <span className="text-gray-300">{language === 'zh' ? '获奖团队和个人将有机会成为 ' : 'Winning teams and individuals will have the opportunity to become '}<strong>{language === 'zh' ? '"金狗工作室主理人"' : '"Golden Dog Studio Manager"'}</strong>{language === 'zh' ? '，获得专属荣誉称号；' : ', receiving exclusive honorary titles;'}</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-yellow-400">•</span>
                      <span className="text-gray-300">{language === 'zh' ? '有机会直接参与 Flipflop 生态建设讨论与治理，成为平台发展过程中的核心一员；' : 'Opportunity to directly participate in Flipflop ecosystem construction discussions and governance, becoming a core member in the platform development process;'}</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-yellow-400">•</span>
                      <span className="text-gray-300">{language === 'zh' ? '可被优先考虑，享有未来平台新功能的 ' : 'Priority consideration for '}<strong>{language === 'zh' ? '优先体验权与建议权' : 'priority experience and suggestion rights'}</strong>{language === 'zh' ? '。' : ' for future platform new features.'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 评审方式 */}
          <div className="bg-gradient-to-r from-gray-900/50 to-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-purple-400 mb-6">⚖️ {language === 'zh' ? '评审方式' : 'Evaluation Method'}</h2>
            <p className="text-gray-300 mb-6">
              {language === 'zh' ? (
                '为保证本次大赛的 公平性与透明度，所有评审将基于链上真实数据，任何人都可以自行验证。'
              ) : (
                'To ensure fairness and transparency of this competition, all evaluations will be based on real on-chain data that anyone can verify independently.'
              )}
            </p>

            <div className="space-y-6">
              {/* 排名依据 */}
              <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-blue-500/30">
                <h3 className="text-xl font-bold text-blue-400 mb-3">{language === 'zh' ? '排名依据' : 'Ranking Criteria'}</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• {language === 'zh' ? '最终排名以参赛地址的 ' : 'Final ranking is based solely on the '}<strong className="text-blue-400">{language === 'zh' ? '实际投入金额' : 'actual investment amount'}</strong>{language === 'zh' ? ' 为唯一依据，退款（Refund）金额不计入统计。' : ' of competition addresses, with refund amounts not included in statistics.'}</li>
                  <li>• {language === 'zh' ? '金额越高，排名越靠前。如出现金额完全相同的情况，以地址提交时间的先后顺序为最终判定标准。' : 'Higher amounts rank higher. In case of identical amounts, the submission time order of addresses will be the final determining criterion.'}</li>
                </ul>
              </div>

              {/* 地址确认机制 */}
              <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-500/30">
                <h3 className="text-xl font-bold text-green-400 mb-3">地址确认机制</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 参赛者须在赛事期间通过官方信息表提交或更新钱包地址；参赛信息表将在 Flipflop 官网及官方社交媒体渠道公布入口。</li>
                  <li>• 截止日期锁定后，所有地址将不可再修改，评审与发奖将严格以锁定时的登记信息为准。</li>
                </ul>
              </div>

              {/* 公示与监督 */}
              <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl p-6 border border-yellow-500/30">
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{language === 'zh' ? '公示与监督' : 'Public Announcement & Supervision'}</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• {language === 'zh' ? '官方将在72小时公示期内对排名结果进行公开展示，并附上链上查询链接，保证数据透明可验证；' : 'Officials will publicly display ranking results during the 72-hour announcement period, with accompanying on-chain query links to ensure transparent and verifiable data;'}</li>
                  <li>• {language === 'zh' ? '公示期为社区监督时间，参赛者与成员均可提出复核申请；' : 'The announcement period is for community supervision, and participants and members can submit review applications;'}</li>
                  <li>• {language === 'zh' ? 'Flipflop相关运营团队将对复核请求进行审查并作出最终裁定。' : 'Flipflop related operations team will review review requests and make final decisions.'}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 参赛流程 */}
          <div className="bg-gradient-to-r from-gray-900/50 to-cyan-900/30 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">📋 {language === 'zh' ? '参赛流程' : 'Participation Process'}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 参赛登记 */}
              <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl p-6 border border-blue-500/30">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">📝</div>
                  <h3 className="text-xl font-bold text-blue-400">1. {language === 'zh' ? '参赛登记' : 'Registration'}</h3>
                </div>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• {language === 'zh' ? '大赛开始时，Flipflop将同步开放「参赛信息表」' : 'When the competition begins, Flipflop will simultaneously open the "Registration Form"'}</li>
                  <li>• {language === 'zh' ? '工作室赛道：需提交统一参赛地址' : 'Studio Track: Need to submit unified competition address'}</li>
                  <li>• {language === 'zh' ? '个人赛道：填写个人钱包地址即可' : 'Individual Track: Fill in personal wallet address'}</li>
                  <li>• {language === 'zh' ? '赛事期间可修改或补充信息' : 'Information can be modified or supplemented during the competition'}</li>
                </ul>
              </div>

              {/* 地址锁定 */}
              <div className="bg-gradient-to-br from-green-900/40 to-blue-900/40 rounded-xl p-6 border border-green-500/30">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🔒</div>
                  <h3 className="text-xl font-bold text-green-400">2. {language === 'zh' ? '地址锁定' : 'Address Lock'}</h3>
                </div>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• {language === 'zh' ? '官方将在最终截止日期锁定所有提交内容' : 'Officials will lock all submitted content on the final deadline'}</li>
                  <li>• {language === 'zh' ? '一旦截止，参赛地址不可再修改或替换' : 'Once the deadline passes, competition addresses cannot be modified or replaced'}</li>
                  <li>• {language === 'zh' ? '最终奖励仅会发放至截止前登记的收款地址' : 'Final rewards will only be distributed to payment addresses registered before the deadline'}</li>
                </ul>
              </div>

              {/* 参赛期 */}
              <div className="bg-gradient-to-br from-yellow-900/40 to-red-900/40 rounded-xl p-6 border border-yellow-500/30">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">⚡</div>
                  <h3 className="text-xl font-bold text-yellow-400">3. {language === 'zh' ? '参赛期' : 'Competition Period'}</h3>
                </div>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• {language === 'zh' ? '时间：9月20日 – 10月05日' : 'Time: September 20 - October 05'}</li>
                  <li>• {language === 'zh' ? '所有参赛者可自由选择项目进行Mint操作' : 'All participants can freely choose projects for Mint operations'}</li>
                  <li>• {language === 'zh' ? '链上数据将自动记录' : 'On-chain data will be automatically recorded'}</li>
                  <li>• {language === 'zh' ? 'Refund部分金额不计入统计' : 'Refund amounts are not included in statistics'}</li>
                </ul>
              </div>

              {/* 结果公示 */}
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-6 border border-purple-500/30">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">📊</div>
                  <h3 className="text-xl font-bold text-purple-400">4. {language === 'zh' ? '结果公示' : 'Results Announcement'}</h3>
                </div>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• {language === 'zh' ? '基于链上数据统计各参赛地址的实际投入金额' : 'Calculate actual investment amounts of each competition address based on on-chain data'}</li>
                  <li>• {language === 'zh' ? '72小时公示期内于官网、社交媒体公开' : 'Public announcement on official website and social media within 72-hour announcement period'}</li>
                  <li>• {language === 'zh' ? '附带链上可查询地址链接' : 'With accompanying on-chain queryable address links'}</li>
                  <li>• {language === 'zh' ? '公示期间可查验数据并提出疑义' : 'Data can be verified and objections raised during the announcement period'}</li>
                </ul>
              </div>

              {/* 奖励发放 */}
              <div className="bg-gradient-to-br from-orange-900/40 to-yellow-900/40 rounded-xl p-6 border border-orange-500/30 md:col-span-2 lg:col-span-1">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🏆</div>
                  <h3 className="text-xl font-bold text-orange-400">5. {language === 'zh' ? '奖励发放' : 'Reward Distribution'}</h3>
                </div>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• {language === 'zh' ? '公示期结束并确认无误后发放奖金' : 'Prizes will be distributed after the announcement period ends and is confirmed error-free'}</li>
                  <li>• {language === 'zh' ? '直接发放至参赛信息表中已锁定的收款钱包地址' : 'Directly distributed to locked payment wallet addresses in the registration form'}</li>
                  <li>• {language === 'zh' ? '奖励发放过程透明可查' : 'Reward distribution process is transparent and verifiable'}</li>
                  <li>• {language === 'zh' ? '警惕诈骗风险，官方不会索取私钥' : 'Beware of fraud risks, officials will not request private keys'}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 规则与声明 */}
          <div className="bg-gradient-to-r from-gray-900/50 to-red-900/30 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-red-400 mb-6">⚠️ {language === 'zh' ? '规则与声明' : 'Rules & Declarations'}</h2>
            <p className="text-gray-300 mb-6">
              {language === 'zh' ? (
                '为保障赛事的公平、公正与透明，Flipflop在此郑重声明：'
              ) : (
                'To ensure fairness, justice and transparency of the competition, Flipflop hereby solemnly declares:'
              )}
            </p>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 rounded-xl p-4 border border-red-500/30">
                <h4 className="text-lg font-bold text-red-400 mb-2">{language === 'zh' ? '公平参赛原则' : 'Fair Participation Principles'}</h4>
                <p className="text-gray-300">
                  {language === 'zh' ? (
                    '严禁任何形式的虚假刷量、地址造假或相关作弊行为，若查实违规，Flipflop有权 取消资格、收回奖励，并永久限制参赛资格'
                  ) : (
                    'Any form of false volume manipulation, address fraud or related cheating behavior is strictly prohibited. If violations are confirmed, Flipflop has the right to disqualify, recover rewards, and permanently restrict participation eligibility'
                  )}
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl p-4 border border-blue-500/30">
                <h4 className="text-lg font-bold text-blue-400 mb-2">{language === 'zh' ? '数据统计标准' : 'Data Statistics Standards'}</h4>
                <ul className="space-y-1 text-gray-300">
                  <li>• {language === 'zh' ? '所有排名与奖励发放，均以链上可验证的真实数据为唯一依据；' : 'All rankings and reward distributions are based solely on verifiable real on-chain data;'}</li>
                  <li>• {language === 'zh' ? 'Refund部分金额不计入实际投入金额。' : 'Refund amounts are not included in actual investment amounts.'}</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl p-4 border border-yellow-500/30">
                <h4 className="text-lg font-bold text-yellow-400 mb-2">{language === 'zh' ? '最终解释权' : 'Final Interpretation Rights'}</h4>
                <ul className="space-y-1 text-gray-300">
                  <li>• {language === 'zh' ? '本赛事规则的最终解释权归Flipflop官方所有；' : 'The final interpretation rights of these competition rules belong to Flipflop officials;'}</li>
                  <li>• {language === 'zh' ? '如有未尽事宜，Flipflop有权根据实际情况进行补充或调整，并提前公告；' : 'For any matters not covered, Flipflop has the right to supplement or adjust based on actual circumstances and announce in advance;'}</li>
                  <li>• {language === 'zh' ? '在特殊情况下，Flipflop保留提前结束、延期或调整赛事的权利。' : 'Under special circumstances, Flipflop reserves the right to end early, postpone or adjust the competition.'}</li>
                  <li>• {language === 'zh' ? '参赛者提交信息表并参与赛事，即视为已阅读、理解并同意上述所有规则。' : 'Participants submitting information forms and participating in the competition are deemed to have read, understood and agreed to all the above rules.'}</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl p-4 border border-purple-500/30">
                <h4 className="text-lg font-bold text-purple-400 mb-2">{language === 'zh' ? '免责与合规声明' : 'Disclaimer & Compliance Statement'}</h4>
                <ul className="space-y-1 text-gray-300">
                  <li>• {language === 'zh' ? '本活动奖励为社区激励行为，不构成任何形式的证券或投资承诺；' : 'The rewards for this activity are community incentive actions and do not constitute any form of securities or investment commitment;'}</li>
                  <li>• {language === 'zh' ? 'Flipflop仅作为平台方，基于链上数据进行统计与奖励发放；' : 'Flipflop only acts as a platform party, conducting statistics and reward distribution based on on-chain data;'}</li>
                  <li>• {language === 'zh' ? '因链上网络异常、黑客攻击或不可抗力导致的延迟或异常，官方不承担间接责任，但将尽力确保赛事公平与奖励发放。' : 'For delays or abnormalities caused by on-chain network anomalies, hacker attacks or force majeure, officials do not bear indirect responsibility, but will do their best to ensure competition fairness and reward distribution.'}</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

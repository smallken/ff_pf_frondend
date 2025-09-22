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
            {language === 'zh' ? '返回Mint大赛' : 'Back to Mint Contest'}
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
            Flipflop Mint大赛规则书
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
            <h2 className="text-3xl font-bold text-red-400 mb-6">🎮 大赛概述</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Flipflop Mint大赛 · 铸造狂欢季正式开启！从 9月20日到10月05日，Flipflop将迎来一场属于所有 工作室与个人玩家 的链上挑战赛。 这不仅是一场关于 现金奖励 的角逐，更是一场检验 社区凝聚力与创造力 的竞赛。
              </p>
              <p>
                在这里：你可以用实力证明自己，在链上留下属于团队或个人的荣耀记录；你可以凭借一次次Mint，冲击排行榜，赢取最高 1500 USDT 的现金大奖；你还将有机会获得项目方、基金、全球资源的关注与支持，打开更多合作与成长的机会。
              </p>
              <p>
                Flipflop相信：每一次Mint，不只是一个数字，更是推动整个生态向前的动力。在这场大赛中，没有边缘人，每一位参与者都是生态建设者。现在，就是展示你与团队力量的最佳时机！
              </p>
            </div>
          </div>

          {/* 参赛组别 */}
          <div className="bg-gradient-to-r from-gray-900/50 to-blue-900/30 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">🏆 参赛组别</h2>
            <p className="text-gray-300 mb-6">
              为了让更多人都能在链上展示实力，本次大赛设立 工作室赛道 与 个人赛道，无论你是经验丰富的团队，还是独立创作者，都有属于你的舞台。
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 工作室赛道 */}
              <div className="bg-gradient-to-br from-red-900/40 to-pink-900/40 rounded-xl p-6 border border-red-500/30">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">🐕</div>
                  <h3 className="text-2xl font-bold text-red-400">工作室赛道</h3>
                </div>
                <div className="space-y-3 text-gray-300">
                  <p><strong>参赛方式：</strong>以团队身份参赛，需提交统一参赛钱包地址</p>
                  <p><strong>适合人群：</strong>社区主理人、项目孵化团队、运营工作室</p>
                  <div>
                    <strong>优势亮点：</strong>
                    <ul className="mt-2 space-y-1 ml-4">
                      <li>• 有机会角逐更高额的现金奖励</li>
                      <li>• 展示团队协作与资源整合能力</li>
                      <li>• 并有可能获得基金及全球资源的优先对接</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 个人赛道 */}
              <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-xl p-6 border border-blue-500/30">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">🐾</div>
                  <h3 className="text-2xl font-bold text-blue-400">个人赛道</h3>
                </div>
                <div className="space-y-3 text-gray-300">
                  <p><strong>参赛方式：</strong>使用个人钱包地址参赛，独立统计Mint数据</p>
                  <p><strong>适合人群：</strong>独立创作者、个人玩家、Web3爱好者</p>
                  <div>
                    <strong>优势亮点：</strong>
                    <ul className="mt-2 space-y-1 ml-4">
                      <li>• 不限经验，新人也能凭实力上榜</li>
                      <li>• 轻松参赛，单枪匹马也能赢取大奖</li>
                      <li>• 提升个人影响力，获得生态认可</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl p-4 border border-green-500/30">
              <h4 className="text-lg font-bold text-green-400 mb-2">参赛资格说明</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• 所有参赛者需使用 Flipflop平台进行Mint，链上数据透明可查</li>
                <li>• 不限国籍、不限经验，只要你敢于Mint，就能参与角逐</li>
                <li>• 工作室与个人赛道互不冲突，可分别报名参赛</li>
              </ul>
            </div>
          </div>

          {/* 奖励机制 */}
          <div className="bg-gradient-to-r from-gray-900/50 to-yellow-900/30 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-yellow-400 mb-6">💰 奖励机制</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              本次大赛设立 总价值30万美金的长期奖金池，奖励将按照系列赛事分期发放。每一阶段赛事，现金奖励都会单独核算与发放，确保每位参赛者的努力都有清晰、公平的回报。这不仅仅是一场比赛，而是一次长期的激励计划，奖金数额可根据参赛热度追加，但不会减少。
            </p>
            
            <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 rounded-xl p-4 mb-6">
              <p className="text-center font-semibold text-red-400">
                📌 说明：奖金数额会根据参赛热度适度追加，但绝不会减少！
              </p>
            </div>
          </div>

          {/* 评审方式 */}
          <div className="bg-gradient-to-r from-gray-900/50 to-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-purple-400 mb-6">⚖️ 评审方式</h2>
            <p className="text-gray-300 mb-6">
              为保证本次大赛的 公平性与透明度，所有评审将基于链上真实数据，任何人都可以自行验证。
            </p>

            <div className="space-y-6">
              {/* 排名依据 */}
              <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-blue-500/30">
                <h3 className="text-xl font-bold text-blue-400 mb-3">排名依据</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 最终排名以参赛地址的 <strong className="text-blue-400">实际投入金额</strong> 为唯一依据，退款（Refund）金额不计入统计。</li>
                  <li>• 金额越高，排名越靠前。如出现金额完全相同的情况，以地址提交时间的先后顺序为最终判定标准。</li>
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
                <h3 className="text-xl font-bold text-yellow-400 mb-3">公示与监督</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 官方将在72小时公示期内对排名结果进行公开展示，并附上链上查询链接，保证数据透明可验证；</li>
                  <li>• 公示期为社区监督时间，参赛者与成员均可提出复核申请；</li>
                  <li>• Flipflop相关运营团队将对复核请求进行审查并作出最终裁定。</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 参赛流程 */}
          <div className="bg-gradient-to-r from-gray-900/50 to-cyan-900/30 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">📋 参赛流程</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 参赛登记 */}
              <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl p-6 border border-blue-500/30">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">📝</div>
                  <h3 className="text-xl font-bold text-blue-400">1. 参赛登记</h3>
                </div>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• 大赛开始时，Flipflop将同步开放「参赛信息表」</li>
                  <li>• 工作室赛道：需提交统一参赛地址</li>
                  <li>• 个人赛道：填写个人钱包地址即可</li>
                  <li>• 赛事期间可修改或补充信息</li>
                </ul>
              </div>

              {/* 地址锁定 */}
              <div className="bg-gradient-to-br from-green-900/40 to-blue-900/40 rounded-xl p-6 border border-green-500/30">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🔒</div>
                  <h3 className="text-xl font-bold text-green-400">2. 地址锁定</h3>
                </div>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• 官方将在最终截止日期锁定所有提交内容</li>
                  <li>• 一旦截止，参赛地址不可再修改或替换</li>
                  <li>• 最终奖励仅会发放至截止前登记的收款地址</li>
                </ul>
              </div>

              {/* 参赛期 */}
              <div className="bg-gradient-to-br from-yellow-900/40 to-red-900/40 rounded-xl p-6 border border-yellow-500/30">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">⚡</div>
                  <h3 className="text-xl font-bold text-yellow-400">3. 参赛期</h3>
                </div>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• 时间：9月20日 – 10月05日</li>
                  <li>• 所有参赛者可自由选择项目进行Mint操作</li>
                  <li>• 链上数据将自动记录</li>
                  <li>• Refund部分金额不计入统计</li>
                </ul>
              </div>

              {/* 结果公示 */}
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-6 border border-purple-500/30">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">📊</div>
                  <h3 className="text-xl font-bold text-purple-400">4. 结果公示</h3>
                </div>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• 基于链上数据统计各参赛地址的实际投入金额</li>
                  <li>• 72小时公示期内于官网、社交媒体公开</li>
                  <li>• 附带链上可查询地址链接</li>
                  <li>• 公示期间可查验数据并提出疑义</li>
                </ul>
              </div>

              {/* 奖励发放 */}
              <div className="bg-gradient-to-br from-orange-900/40 to-yellow-900/40 rounded-xl p-6 border border-orange-500/30 md:col-span-2 lg:col-span-1">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🏆</div>
                  <h3 className="text-xl font-bold text-orange-400">5. 奖励发放</h3>
                </div>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• 公示期结束并确认无误后发放奖金</li>
                  <li>• 直接发放至参赛信息表中已锁定的收款钱包地址</li>
                  <li>• 奖励发放过程透明可查</li>
                  <li>• 警惕诈骗风险，官方不会索取私钥</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 规则与声明 */}
          <div className="bg-gradient-to-r from-gray-900/50 to-red-900/30 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-red-400 mb-6">⚠️ 规则与声明</h2>
            <p className="text-gray-300 mb-6">
              为保障赛事的公平、公正与透明，Flipflop在此郑重声明：
            </p>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 rounded-xl p-4 border border-red-500/30">
                <h4 className="text-lg font-bold text-red-400 mb-2">公平参赛原则</h4>
                <p className="text-gray-300">
                  严禁任何形式的虚假刷量、地址造假或相关作弊行为，若查实违规，Flipflop有权 取消资格、收回奖励，并永久限制参赛资格
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl p-4 border border-blue-500/30">
                <h4 className="text-lg font-bold text-blue-400 mb-2">数据统计标准</h4>
                <ul className="space-y-1 text-gray-300">
                  <li>• 所有排名与奖励发放，均以链上可验证的真实数据为唯一依据；</li>
                  <li>• Refund部分金额不计入实际投入金额。</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl p-4 border border-yellow-500/30">
                <h4 className="text-lg font-bold text-yellow-400 mb-2">最终解释权</h4>
                <ul className="space-y-1 text-gray-300">
                  <li>• 本赛事规则的最终解释权归Flipflop官方所有；</li>
                  <li>• 如有未尽事宜，Flipflop有权根据实际情况进行补充或调整，并提前公告；</li>
                  <li>• 在特殊情况下，Flipflop保留提前结束、延期或调整赛事的权利。</li>
                  <li>• 参赛者提交信息表并参与赛事，即视为已阅读、理解并同意上述所有规则。</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl p-4 border border-purple-500/30">
                <h4 className="text-lg font-bold text-purple-400 mb-2">免责与合规声明</h4>
                <ul className="space-y-1 text-gray-300">
                  <li>• 本活动奖励为社区激励行为，不构成任何形式的证券或投资承诺；</li>
                  <li>• Flipflop仅作为平台方，基于链上数据进行统计与奖励发放；</li>
                  <li>• 因链上网络异常、黑客攻击或不可抗力导致的延迟或异常，官方不承担间接责任，但将尽力确保赛事公平与奖励发放。</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

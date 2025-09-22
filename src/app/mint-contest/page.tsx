'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function MintContest() {
  const { language } = useLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white relative overflow-hidden">
      {/* 像素背景效果 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 98%, rgba(255, 107, 107, 0.3) 100%),
            linear-gradient(0deg, transparent 98%, rgba(78, 205, 196, 0.3) 100%)
          `,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* 鼠标跟随效果 */}
      <div 
        className="absolute w-4 h-4 bg-red-500 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          transition: 'all 0.1s ease-out'
        }}
      ></div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* 返回港湾按钮 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 border-2 border-blue-500 hover:border-cyan-400"
          >
            <span className="mr-2">⛵</span>
            {language === 'zh' ? '返回港湾' : 'Back to Harbor'}
          </a>
        </motion.div>

        {/* 主标题区域 */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-500 to-orange-500"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            🎮 Flipflop Mint大赛
          </motion.h1>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            铸造狂欢季正式开启！
          </motion.h2>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button
              onClick={() => setShowRegistrationModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl hover:from-red-400 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              现在报名
            </button>
            <a
              href="/mint-contest/rules"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              详细规则书
            </a>
          </motion.div>
        </motion.div>

        {/* 大赛介绍 */}
        <motion.div 
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="bg-gradient-to-r from-gray-900/50 to-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8">
            <p className="text-lg leading-relaxed mb-6">
              从 <span className="text-red-400 font-bold">9月20日到10月05日</span>，Flipflop将迎来一场属于所有 
              <span className="text-cyan-400 font-bold">工作室与个人玩家</span> 的链上挑战赛。
              这不仅是一场关于 <span className="text-yellow-400 font-bold">现金奖励</span> 的角逐，更是一场检验 
              <span className="text-green-400 font-bold">社区凝聚力与创造力</span> 的竞赛。
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">💪</span>
                <p>你可以用实力证明自己，在链上留下属于团队或个人的荣耀记录；</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🏆</span>
                <p>你可以凭借一次次Mint，冲击排行榜，赢取最高 <span className="text-yellow-400 font-bold">1500 USDT</span> 的现金大奖；</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🌟</span>
                <p>你还将有机会获得项目方、基金、全球资源的关注与支持，打开更多合作与成长的机会。</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/30">
              <p className="text-center font-semibold">
                Flipflop相信：每一次Mint，不只是一个数字，更是推动整个生态向前的动力。在这场大赛中，没有边缘人，每一位参与者都是生态建设者。
              </p>
              <p className="text-center mt-2 text-cyan-400 font-bold">
                现在，就是展示你与团队力量的最佳时机！
              </p>
            </div>
          </div>
        </motion.div>

        {/* 参赛组别 */}
        <motion.div 
          className="max-w-6xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <h2 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            参赛组别
          </h2>
          <p className="text-center text-gray-300 mb-12 text-lg">
            在打狗大赛里，不管你是团队还是个人，都能找到属于你的舞台：
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 工作室赛道 */}
            <motion.div 
              className="bg-gradient-to-br from-red-900/50 to-pink-900/30 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🐕</div>
                <h3 className="text-2xl font-bold text-red-400 mb-2">工作室赛道</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-cyan-400 mb-2">适合谁？</h4>
                  <p>👉 社区主理人、项目孵化团队、运营工作室，或者任何有组织的小伙伴们。</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-cyan-400 mb-2">怎么参赛？</h4>
                  <p>👉 用一个统一的钱包地址报名，全队的Mint成绩都会算到一起。</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-cyan-400 mb-2">有什么优势？</h4>
                  <p>👉 奖金更高，更能展现团队的实力与协作。优秀团队还有机会得到基金会和全球资源的优先扶持。</p>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <a
                  href="/mint-contest/studio"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-lg hover:from-red-400 hover:to-pink-500 transition-all duration-300 transform hover:scale-105"
                >
                  工作室组报名
                </a>
              </div>
            </motion.div>

            {/* 个人赛道 */}
            <motion.div 
              className="bg-gradient-to-br from-blue-900/50 to-cyan-900/30 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🐾</div>
                <h3 className="text-2xl font-bold text-blue-400 mb-2">个人赛道</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-cyan-400 mb-2">适合谁？</h4>
                  <p>👉 独立创作者、个人玩家，哪怕你是刚入门的小白，也完全可以参赛。</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-cyan-400 mb-2">怎么参赛？</h4>
                  <p>👉 直接用你自己的钱包地址参赛，单枪匹马也能冲击排行榜。</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-cyan-400 mb-2">有什么优势？</h4>
                  <p>👉 操作简单，上榜机会大。赢了还能提升个人影响力，获得官方和社区的认可。</p>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <a
                  href="/mint-contest/individual"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-lg hover:from-blue-400 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105"
                >
                  个人组报名
                </a>
              </div>
            </motion.div>
          </div>

          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 backdrop-blur-sm border border-green-500/30 rounded-xl p-6">
              <p className="text-lg font-semibold text-green-400">
                📌 参赛门槛超低：只要在 Flipflop 平台完成 Mint，递交Mint地址，就能自动计入成绩。
              </p>
              <p className="text-gray-300 mt-2">
                不限国籍、不限经验，你敢Mint，我们就认！
              </p>
            </div>
          </div>
        </motion.div>

        {/* 奖励机制 */}
        <motion.div 
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            奖励机制
          </h2>
          
          <div className="bg-gradient-to-r from-gray-900/50 to-yellow-900/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-8">
            <p className="text-lg leading-relaxed mb-6">
              我们为本次大赛准备了 <span className="text-yellow-400 font-bold text-2xl">总价值 30 万美金</span> 的长期奖金池，
              每期赛事都会单独结算、透明发放，本期具体现金奖励如下：
            </p>
            
            {/* 奖励表格占位符 */}
            <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-xl p-6 mb-6 border border-yellow-500/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <h4 className="text-xl font-bold text-yellow-400 mb-3">🐕 工作室赛道</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>第一名</span>
                      <span className="text-yellow-400 font-bold">1500 USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span>第二名</span>
                      <span className="text-yellow-400 font-bold">800 USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span>第三名</span>
                      <span className="text-yellow-400 font-bold">400 USDT</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-bold text-cyan-400 mb-3">🐾 个人赛道</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>第一名</span>
                      <span className="text-cyan-400 font-bold">800 USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span>第二名</span>
                      <span className="text-cyan-400 font-bold">400 USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span>第三名</span>
                      <span className="text-cyan-400 font-bold">200 USDT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 rounded-xl p-4 mb-6">
              <p className="text-center font-semibold text-red-400">
                📌 说明：奖金数额会根据参赛热度适度追加，但绝不会减少！
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">🌟 额外权益</h3>
              <p className="text-lg">本次大赛不仅仅提供现金奖励，获奖团队与个人还有机会获得 Flipflop 生态赋能的多重权益包括但不限于资源扶持、流量曝光、项目背书、平台话语权，助力你在 Web3 赛道走得更远：</p>
              
              <div className="space-y-6">
                {/* 1. 项目优先权 */}
                <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-blue-500/30">
                  <h4 className="text-xl font-bold text-blue-400 mb-3">1. 项目优先权</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400">•</span>
                      <span>有机会直通 优质项目 Mint，抢先参与最具潜力的生态发行；</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400">•</span>
                      <span>可优先获邀参与项目方 AMA（线上问答） 与 战略讨论，直接与核心团队沟通，掌握一手信息。</span>
                    </li>
                  </ul>
                </div>

                {/* 2. 基金与资源扶持 */}
                <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-500/30">
                  <h4 className="text-xl font-bold text-green-400 mb-3">2. 基金与资源扶持</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400">•</span>
                      <span><strong>基金支持：</strong>有机会得到由 Flipflop 基金或合作生态基金参与扶持，增加你项目的热度与流动性；</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400">•</span>
                      <span><strong>全球资源接入：</strong>可享受包括国际合作伙伴、行业论坛、生态大会等曝光机会；</span>
                    </li>
                  </ul>
                </div>

                {/* 3. 社区与流量支持 */}
                <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/30">
                  <h4 className="text-xl font-bold text-purple-400 mb-3">3. 社区与流量支持</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-400">•</span>
                      <span><strong>官方曝光：</strong>获奖名单将在 Flipflop 官网、社交媒体及合作媒体重点推送；</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-400">•</span>
                      <span><strong>社区重点推荐：</strong>有机会获得社群话题引导与流量倾斜，帮助你扩大影响力；</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-400">•</span>
                      <span><strong>跨社区合作：</strong>将优先考虑推荐至合作方社区，吸引更多潜在支持者。</span>
                    </li>
                  </ul>
                </div>

                {/* 4. 平台发展参与权 */}
                <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl p-6 border border-yellow-500/30">
                  <h4 className="text-xl font-bold text-yellow-400 mb-3">4. 平台发展参与权</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-yellow-400">•</span>
                      <span>获奖团队和个人将有机会成为 <strong>"金狗工作室主理人"</strong>，获得专属荣誉称号；</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-yellow-400">•</span>
                      <span>有机会直接参与 Flipflop 生态建设讨论与治理，成为平台发展过程中的核心一员；</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-yellow-400">•</span>
                      <span>可被优先考虑，享有未来平台新功能的 <strong>优先体验权与建议权</strong>。</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 参赛流程 */}
        <motion.div 
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            参赛流程
          </h2>
          
          <div className="space-y-6">
            {[
              {
                step: '1',
                title: '参赛登记',
                content: '大赛开始时，Flipflop将同步开放「参赛信息表」。参赛者须填写有效的参赛钱包地址：工作室赛道：需提交统一参赛地址；个人赛道：填写个人钱包地址即可。在赛事进行期间，参赛者可根据实际情况对所填信息进行修改或补充。'
              },
              {
                step: '2',
                title: '地址锁定',
                content: '官方将在赛事设定的最终截止日期锁定所有提交内容。一旦截止，参赛地址不可再修改或替换。最终奖励仅会发放至截止前登记的收款地址，请务必确认信息准确。'
              },
              {
                step: '3',
                title: '参赛期（9月20日 – 10月05日）',
                content: '所有参赛者可在大赛期间自由选择项目进行Mint操作。链上数据将自动记录，Refund部分金额不计入统计。'
              },
              {
                step: '4',
                title: '结果公示',
                content: '大赛结束后，官方将基于链上数据统计各参赛地址的实际投入金额。完整排名将在72小时公示期内于Flipflop官网、社交媒体及社区频道公开，并附带链上可查询地址链接。'
              },
              {
                step: '5',
                title: '奖励发放',
                content: '公示期结束并确认无误后，奖金将由官方直接发放至参赛信息表中已锁定的收款钱包地址。奖励发放过程透明可查，Flipflop不会通过任何非官方渠道索取私钥、转账或手续费，请参赛者警惕诈骗风险。'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-r from-gray-900/50 to-blue-900/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 2.0 + index * 0.2 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-400 mb-2">{item.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{item.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 社交媒体 */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.8 }}
        >
          <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            社交媒体
          </h3>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-3xl hover:text-cyan-400 transition-colors">𝕏</a>
            <a href="#" className="text-3xl hover:text-blue-400 transition-colors">📱</a>
            <a href="#" className="text-3xl hover:text-purple-400 transition-colors">💬</a>
          </div>
        </motion.div>
      </div>

      {/* 报名弹窗 */}
      {showRegistrationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-gradient-to-br from-gray-900 to-red-900 border border-red-500/30 rounded-2xl p-8 max-w-md w-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">选择参赛组别</h3>
              <p className="text-gray-300">请选择您要参加的组别</p>
            </div>

            <div className="space-y-4">
              <a
                href="/mint-contest/studio"
                className="block w-full p-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl hover:from-red-400 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 text-center"
                onClick={() => setShowRegistrationModal(false)}
              >
                <div className="text-2xl mb-2">🐕</div>
                <div className="text-lg">工作室组报名</div>
                <div className="text-sm opacity-80">适合团队参赛</div>
              </a>

              <a
                href="/mint-contest/individual"
                className="block w-full p-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-400 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 text-center"
                onClick={() => setShowRegistrationModal(false)}
              >
                <div className="text-2xl mb-2">🐾</div>
                <div className="text-lg">个人组报名</div>
                <div className="text-sm opacity-80">适合个人参赛</div>
              </a>
            </div>

            <button
              onClick={() => setShowRegistrationModal(false)}
              className="w-full mt-6 p-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition-colors"
            >
              取消
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
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
            🎮 {language === 'zh' ? 'Flipflop Mint大赛' : 'Flipflop Mint Competition'}
          </motion.h1>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {language === 'zh' ? '铸造狂欢季正式开启！' : 'Minting Carnival Season Officially Launched!'}
          </motion.h2>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a
              href="/"
              className="group relative px-8 py-3 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-2xl hover:from-red-500 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl font-semibold text-base min-w-[180px]"
            >
              <span className="relative z-10 flex items-center justify-center">
                <span className="mr-2">⛵</span>
                {language === 'zh' ? '返回港湾' : 'Back to PathPort'}
              </span>
            </a>
            
            <button
              onClick={() => setShowRegistrationModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl hover:from-red-400 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {language === 'zh' ? '现在报名' : 'Register Now'}
            </button>
            <a
              href="/mint-contest/rules"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {language === 'zh' ? '详细规则书' : 'Detailed Rules'}
            </a>
          </motion.div>
        </motion.div>


        {/* 参赛组别 */}
        <motion.div 
          className="max-w-6xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <h2 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            {language === 'zh' ? '参赛组别' : 'Competition Categories'}
          </h2>
          
          
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
                <h3 className="text-2xl font-bold text-red-400 mb-2">{language === 'zh' ? '工作室赛道' : 'Studio Track'}</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-cyan-400 mb-2">{language === 'zh' ? '适合谁？' : 'Who is it for?'}</h4>
                  <p>👉 {language === 'zh' ? '社区主理人、项目孵化团队、运营工作室，或者任何有组织的小伙伴们。' : 'Community managers, project incubation teams, operation studios, or any organized groups.'}</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-cyan-400 mb-2">{language === 'zh' ? '怎么参赛？' : 'How to participate?'}</h4>
                  <p>👉 {language === 'zh' ? '用一个统一的钱包地址报名，全队的Mint成绩都会算到一起。' : 'Register with a unified wallet address, and all team minting achievements will be counted together.'}</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-cyan-400 mb-2">{language === 'zh' ? '有什么优势？' : 'What are the advantages?'}</h4>
                  <p>👉 {language === 'zh' ? '奖金更高，更能展现团队的实力与协作。优秀团队还有机会得到基金会和全球资源的优先扶持。' : 'Higher prizes, better showcasing of team strength and collaboration. Excellent teams also have the opportunity to receive priority support from foundations and global resources.'}</p>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <a
                  href="/mint-contest/studio"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-lg hover:from-red-400 hover:to-pink-500 transition-all duration-300 transform hover:scale-105"
                >
                  {language === 'zh' ? '工作室组报名' : 'Studio Registration'}
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
                <h3 className="text-2xl font-bold text-blue-400 mb-2">{language === 'zh' ? '个人赛道' : 'Individual Track'}</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-cyan-400 mb-2">{language === 'zh' ? '适合谁？' : 'Who is it for?'}</h4>
                  <p>👉 {language === 'zh' ? '独立创作者、个人玩家，哪怕你是刚入门的小白，也完全可以参赛。' : 'Independent creators, individual players, even if you are a beginner, you can fully participate.'}</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-cyan-400 mb-2">{language === 'zh' ? '怎么参赛？' : 'How to participate?'}</h4>
                  <p>👉 {language === 'zh' ? '直接用你自己的钱包地址参赛，单枪匹马也能冲击排行榜。' : 'Participate directly with your own wallet address, and you can climb the leaderboard single-handedly.'}</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-cyan-400 mb-2">{language === 'zh' ? '有什么优势？' : 'What are the advantages?'}</h4>
                  <p>👉 {language === 'zh' ? '操作简单，上榜机会大。赢了还能提升个人影响力，获得官方和社区的认可。' : 'Simple operation, high chance of ranking. Winning can also enhance personal influence and gain recognition from officials and the community.'}</p>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <a
                  href="/mint-contest/individual"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-lg hover:from-blue-400 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105"
                >
                  {language === 'zh' ? '个人组报名' : 'Individual Registration'}
                </a>
              </div>
            </motion.div>
          </div>

          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 backdrop-blur-sm border border-green-500/30 rounded-xl p-6">
              <p className="text-lg font-semibold text-green-400">
                📌 {language === 'zh' ? '参赛门槛超低：只要在 Flipflop 平台完成 Mint，递交Mint地址，就能自动计入成绩。' : 'Ultra-low entry threshold: Just complete Mint on the Flipflop platform and submit your Mint address to automatically count your achievements.'}
              </p>
              <p className="text-gray-300 mt-2">
                {language === 'zh' ? '不限国籍、不限经验，你敢Mint，我们就认！' : 'No nationality or experience restrictions - if you dare to Mint, we recognize it!'}
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
            {language === 'zh' ? '奖励机制' : 'Reward Mechanism'}
          </h2>
          
          <div className="bg-gradient-to-r from-gray-900/50 to-yellow-900/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-8">
            <p className="text-lg leading-relaxed mb-6">
              {language === 'zh' ? (
                <>
                  我们为本次大赛准备了 <span className="text-yellow-400 font-bold text-2xl">总价值 30 万美金</span> 的长期奖金池，
                  每期赛事都会单独结算、透明发放，本期具体现金奖励如下：
                </>
              ) : (
                <>
                  We have prepared a long-term prize pool with a <span className="text-yellow-400 font-bold text-2xl">total value of $300,000</span> for this competition.
                  Each event will be settled separately and distributed transparently. The specific cash rewards for this period are as follows:
                </>
              )}
            </p>
            
            {/* 奖励表格占位符 */}
            <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-xl p-6 mb-6 border border-yellow-500/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <h4 className="text-xl font-bold text-yellow-400 mb-3">🐕 {language === 'zh' ? '工作室赛道' : 'Studio Track'}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{language === 'zh' ? '第一名' : '1st Place'}</span>
                      <span className="text-yellow-400 font-bold">1500 USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'zh' ? '第二名' : '2nd Place'}</span>
                      <span className="text-yellow-400 font-bold">800 USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'zh' ? '第三名' : '3rd Place'}</span>
                      <span className="text-yellow-400 font-bold">400 USDT</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-bold text-cyan-400 mb-3">🐾 {language === 'zh' ? '个人赛道' : 'Individual Track'}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{language === 'zh' ? '第一名' : '1st Place'}</span>
                      <span className="text-cyan-400 font-bold">800 USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'zh' ? '第二名' : '2nd Place'}</span>
                      <span className="text-cyan-400 font-bold">400 USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'zh' ? '第三名' : '3rd Place'}</span>
                      <span className="text-cyan-400 font-bold">200 USDT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 rounded-xl p-4 mb-6">
              <p className="text-center font-semibold text-red-400">
                📌 {language === 'zh' ? '说明：奖金数额会根据参赛热度适度追加，但绝不会减少！' : 'Note: Prize amounts will be moderately increased based on participation enthusiasm, but will never be reduced!'}
              </p>
            </div>

            {/* 额外权益简要说明 */}
            <div className="mt-6 p-6 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl border border-cyan-500/30">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">🌟 {language === 'zh' ? '额外权益' : 'Additional Benefits'}</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                {language === 'zh' ? (
                  '本次大赛不仅仅提供现金奖励，获奖团队与个人还有机会获得 Flipflop 生态赋能的多重权益包括但不限于资源扶持、流量曝光、项目背书、平台话语权，助力你在 Web3 赛道走得更远。'
                ) : (
                  'This competition not only provides cash rewards, but winning teams and individuals also have the opportunity to receive multiple benefits empowered by the Flipflop ecosystem, including but not limited to resource support, traffic exposure, project endorsement, and platform voice, helping you go further in the Web3 track.'
                )}
              </p>
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
            {language === 'zh' ? '参赛流程' : 'Participation Process'}
          </h2>
          
          <div className="space-y-6">
            {[
              {
                step: '1',
                title: language === 'zh' ? '参赛登记' : 'Registration',
                content: language === 'zh' 
                  ? '大赛开始时，Flipflop将同步开放「参赛信息表」。参赛者须填写有效的参赛钱包地址：工作室赛道：需提交统一参赛地址；个人赛道：填写个人钱包地址即可。在赛事进行期间，参赛者可根据实际情况对所填信息进行修改或补充。'
                  : 'When the competition begins, Flipflop will simultaneously open the "Registration Form". Participants must fill in valid wallet addresses: Studio Track: Submit a unified competition address; Individual Track: Fill in personal wallet address. During the competition, participants can modify or supplement the information based on actual circumstances.'
              },
              {
                step: '2',
                title: language === 'zh' ? '地址锁定' : 'Address Lock',
                content: language === 'zh'
                  ? '官方将在赛事设定的最终截止日期锁定所有提交内容。一旦截止，参赛地址不可再修改或替换。最终奖励仅会发放至截止前登记的收款地址，请务必确认信息准确。'
                  : 'Officials will lock all submitted content on the final deadline set for the competition. Once the deadline passes, competition addresses cannot be modified or replaced. Final rewards will only be distributed to the payment addresses registered before the deadline. Please ensure information accuracy.'
              },
              {
                step: '3',
                title: language === 'zh' ? '参赛期（9月20日 – 10月05日）' : 'Competition Period (Sep 20 – Oct 05)',
                content: language === 'zh'
                  ? '所有参赛者可在大赛期间自由选择项目进行Mint操作。链上数据将自动记录，Refund部分金额不计入统计。'
                  : 'All participants can freely choose projects for Mint operations during the competition period. On-chain data will be automatically recorded, with refund amounts not included in statistics.'
              },
              {
                step: '4',
                title: language === 'zh' ? '结果公示' : 'Results Announcement',
                content: language === 'zh'
                  ? '大赛结束后，官方将基于链上数据统计各参赛地址的实际投入金额。完整排名将在72小时公示期内于Flipflop官网、社交媒体及社区频道公开，并附带链上可查询地址链接。'
                  : 'After the competition ends, officials will calculate the actual investment amounts of each competition address based on on-chain data. Complete rankings will be publicly announced on Flipflop official website, social media, and community channels during the 72-hour announcement period, with accompanying on-chain queryable address links.'
              },
              {
                step: '5',
                title: language === 'zh' ? '奖励发放' : 'Reward Distribution',
                content: language === 'zh'
                  ? '公示期结束并确认无误后，奖金将由官方直接发放至参赛信息表中已锁定的收款钱包地址。奖励发放过程透明可查，Flipflop不会通过任何非官方渠道索取私钥、转账或手续费，请参赛者警惕诈骗风险。'
                  : 'After the announcement period ends and is confirmed error-free, prizes will be directly distributed by officials to the locked payment wallet addresses in the registration form. The reward distribution process is transparent and verifiable. Flipflop will not request private keys, transfers, or fees through any unofficial channels. Please beware of fraud risks.'
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

        {/* 加入我们 - 复用脚印计划的《加入我们》部分 */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.8 }}
        >
          <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            {language === 'zh' ? '关注我们' : 'Follow Us'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* X (Twitter) */}
            <a
              href="https://x.com/flipfloplaunch"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-600/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center">
                <div className="w-14 h-14 bg-gradient-to-r from-gray-900 to-black rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl text-white font-extrabold">X</span>
                </div>
                <div>
                  <div className="font-bold text-white text-lg">X (Twitter)</div>
                  <div className="text-xs text-blue-400 mt-1">{language === 'zh' ? '最新动态 →' : 'Latest Updates →'}</div>
                </div>
              </div>
            </a>

            {/* Discord */}
            <a
              href="https://discord.com/invite/2kaGjSy6hr"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-600/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center">
                <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-white text-lg">Discord</div>
                  <div className="text-xs text-indigo-400 mt-1">{language === 'zh' ? '实时交流 →' : 'Real-time communication →'}</div>
                </div>
              </div>
            </a>

            {/* Telegram Global */}
            <a
              href="https://t.me/flipflopEng"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-600/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-white text-lg">Telegram</div>
                  <div className="text-xs text-blue-400 mt-1">🌍 Global →</div>
                </div>
              </div>
            </a>

            {/* 官方ff入口 */}
            <a
              href="https://www.flipflop.plus/?utm_source=tokenpocket"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-600/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <div className="font-bold text-white text-lg">{language === 'zh' ? '官方ff入口' : 'Official FF Portal'}</div>
                  <div className="text-xs text-purple-400 mt-1">{language === 'zh' ? '立即访问 →' : 'Visit Now →'}</div>
                </div>
              </div>
            </a>
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
              <h3 className="text-2xl font-bold text-white mb-2">选择你的赛道，并填写你的参赛信息</h3>
              <p className="text-gray-300">请选择您要参加的赛道并填写相关信息</p>
            </div>

            <div className="space-y-4">
              <a
                href="/mint-contest/studio"
                className="block w-full p-6 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl hover:from-red-400 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 text-center"
                onClick={() => setShowRegistrationModal(false)}
              >
                <div className="text-2xl mb-3">🎮</div>
                <div className="text-xl">工作室赛道</div>
              </a>

              <a
                href="/mint-contest/individual"
                className="block w-full p-6 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-400 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 text-center"
                onClick={() => setShowRegistrationModal(false)}
              >
                <div className="text-2xl mb-3">👤</div>
                <div className="text-xl">个人赛道</div>
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
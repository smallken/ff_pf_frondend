'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function DDQuestionnaire() {
  const { language } = useLanguage();
  const [selectedTrack, setSelectedTrack] = useState<string>('');

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
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-600 bg-clip-text text-transparent">
            📝 DD {language === 'zh' ? '问答清单' : 'Questionnaire'}
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {language === 'zh' 
              ? 'Launch 大赛深度尽调问答清单 - 项目评估的重要依据'
              : 'Launch Contest Due Diligence Questionnaire - Important Basis for Project Evaluation'
            }
          </p>
        </motion.div>

        {/* 重要说明 */}
        <motion.div
          className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-xl p-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center">
            <span className="mr-3">⚠️</span>
            {language === 'zh' ? '重要提醒' : 'Important Notice'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h4 className="font-bold text-yellow-300 mb-3">
                {language === 'zh' ? '提交时间' : 'Submission Time'}
              </h4>
              <p className="text-sm leading-relaxed">
                {language === 'zh' 
                  ? '所有参赛项目需在截止日起7天内（T0 → T0+7天），登录 Flipflop 官网完成 DD 问答清单填写。'
                  : 'All participating projects must complete the DD questionnaire on the Flipflop official website within 7 days from the deadline (T0 → T0+7 days).'
                }
              </p>
            </div>
            <div>
              <h4 className="font-bold text-yellow-300 mb-3">
                {language === 'zh' ? '评估依据' : 'Evaluation Basis'}
              </h4>
              <p className="text-sm leading-relaxed">
                {language === 'zh' 
                  ? '平台将结合链上/社媒快照与清单回答进行评分与排名。未提交者将由评审团基于公开数据独立评估。'
                  : 'The platform will combine on-chain/social media snapshots with questionnaire responses for scoring and ranking. Non-submitters will be independently evaluated by the jury based on public data.'
                }
              </p>
            </div>
          </div>
        </motion.div>

        {/* DD问答清单内容 */}
        <motion.div
          className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="space-y-6">
            {/* 基础信息确认 */}
            <motion.div
              className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center">
                <span className="mr-3">📋</span>
                {language === 'zh' ? '一、基础信息确认（所有赛道必答）' : '1. Basic Information Confirmation (All Tracks Required)'}
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-200 mb-4">
                    {language === 'zh' ? '项目基本信息' : 'Project Basic Information'}
                  </h4>
                  <div className="space-y-4 text-sm">
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '项目名称（与报名一致）：' : 'Project Name (consistent with registration):'}
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300"
                        placeholder={language === 'zh' ? '请输入项目名称' : 'Enter project name'}
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '代币合约地址（与报名一致）：' : 'Token Contract Address (consistent with registration):'}
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300"
                        placeholder={language === 'zh' ? '请输入代币合约地址' : 'Enter token contract address'}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-200 mb-4">
                    {language === 'zh' ? '所属赛道（与报名一致）：' : 'Track Category (consistent with registration):'}
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-cyan-300 font-medium mb-3">
                        {language === 'zh' ? '产品 / 应用型：' : 'Product / Application Type:'}
                      </h5>
                      <div className="space-y-2">
                        <label className="flex items-center text-gray-300 cursor-pointer hover:text-cyan-300 transition-colors">
                          <input
                            type="radio"
                            name="track"
                            value="rwa"
                            checked={selectedTrack === 'rwa'}
                            onChange={(e) => setSelectedTrack(e.target.value)}
                            className="mr-3 w-4 h-4 text-purple-400 bg-gray-800 border-gray-600 focus:ring-purple-400 focus:ring-2"
                          />
                          {language === 'zh' ? 'RWA赛道' : 'RWA Track'}
                        </label>
                        <label className="flex items-center text-gray-300 cursor-pointer hover:text-cyan-300 transition-colors">
                          <input
                            type="radio"
                            name="track"
                            value="mini-dapps"
                            checked={selectedTrack === 'mini-dapps'}
                            onChange={(e) => setSelectedTrack(e.target.value)}
                            className="mr-3 w-4 h-4 text-purple-400 bg-gray-800 border-gray-600 focus:ring-purple-400 focus:ring-2"
                          />
                          {language === 'zh' ? '小应用赛道' : 'Mini dApps Track'}
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-cyan-300 font-medium mb-3">
                        {language === 'zh' ? '共识 / 社群型：' : 'Consensus / Community Type:'}
                      </h5>
                      <div className="space-y-2">
                        <label className="flex items-center text-gray-300 cursor-pointer hover:text-cyan-300 transition-colors">
                          <input
                            type="radio"
                            name="track"
                            value="kol"
                            checked={selectedTrack === 'kol'}
                            onChange={(e) => setSelectedTrack(e.target.value)}
                            className="mr-3 w-4 h-4 text-purple-400 bg-gray-800 border-gray-600 focus:ring-purple-400 focus:ring-2"
                          />
                          {language === 'zh' ? 'KOL赛道' : 'KOL Track'}
                        </label>
                        <label className="flex items-center text-gray-300 cursor-pointer hover:text-cyan-300 transition-colors">
                          <input
                            type="radio"
                            name="track"
                            value="ip"
                            checked={selectedTrack === 'ip'}
                            onChange={(e) => setSelectedTrack(e.target.value)}
                            className="mr-3 w-4 h-4 text-purple-400 bg-gray-800 border-gray-600 focus:ring-purple-400 focus:ring-2"
                          />
                          {language === 'zh' ? 'IP赛道' : 'IP Track'}
                        </label>
                        <label className="flex items-center text-gray-300 cursor-pointer hover:text-cyan-300 transition-colors">
                          <input
                            type="radio"
                            name="track"
                            value="community"
                            checked={selectedTrack === 'community'}
                            onChange={(e) => setSelectedTrack(e.target.value)}
                            className="mr-3 w-4 h-4 text-purple-400 bg-gray-800 border-gray-600 focus:ring-purple-400 focus:ring-2"
                          />
                          {language === 'zh' ? '社区赛道' : 'Community Track'}
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="flex items-center text-gray-300 cursor-pointer hover:text-cyan-300 transition-colors">
                        <input
                          type="radio"
                          name="track"
                          value="other"
                          checked={selectedTrack === 'other'}
                          onChange={(e) => setSelectedTrack(e.target.value)}
                          className="mr-3 w-4 h-4 text-purple-400 bg-gray-800 border-gray-600 focus:ring-purple-400 focus:ring-2"
                        />
                        {language === 'zh' ? '其他赛道' : 'Other Track'}
                      </label>
                      
                      {selectedTrack === 'other' && (
                        <div className="mt-3 ml-7">
                          <input
                            type="text"
                            className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300"
                            placeholder={language === 'zh' ? '请输入其他赛道名称' : 'Enter other track name'}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-200 mb-4">
                    {language === 'zh' ? '截止日 T0 的关键数据：' : 'Key Data at Deadline T0:'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '持币地址数：' : 'Number of token holders:'}
                      </label>
                      <input
                        type="number"
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300"
                        placeholder={language === 'zh' ? '请输入持币地址数' : 'Enter number of token holders'}
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? 'Mint 完成度：' : 'Mint completion:'}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300 pr-8"
                          placeholder={language === 'zh' ? '请输入完成百分比' : 'Enter completion percentage'}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '社区规模（TG/Discord人数）：' : 'Community size (TG/Discord members):'}
                      </label>
                      <input
                        type="number"
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300"
                        placeholder={language === 'zh' ? '请输入社区人数' : 'Enter community size'}
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '推特粉丝数：' : 'Twitter followers:'}
                      </label>
                      <input
                        type="number"
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300"
                        placeholder={language === 'zh' ? '请输入推特粉丝数' : 'Enter Twitter followers'}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-200 mb-4">
                    {language === 'zh' ? '已毕业可补充描述外盘目前相关数据：' : 'Graduated projects can supplement current external market data:'}
                  </h4>
                  <textarea
                    className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300 min-h-[80px] resize-vertical"
                    placeholder={language === 'zh' ? '请详细描述外盘相关数据（交易量、流动性、市值等）' : 'Please describe external market data in detail (trading volume, liquidity, market cap, etc.)'}
                    rows={3}
                  />
                </div>
              </div>
            </motion.div>

            {/* 流量贡献 */}
            <motion.div
              className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
                <span className="mr-3">📈</span>
                {language === 'zh' ? '二、流量贡献' : '2. Traffic Contribution'}
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-200 mb-4">
                    {language === 'zh' ? '通用（所有赛道必答）' : 'General (All Tracks Required)'}
                  </h4>
                  <div className="space-y-4 text-sm">
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '截止 T0，你们带来的新增用户或曝光规模是多少？' : 'By T0, what is the scale of new users or exposure you brought?'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请描述新增用户数量、曝光规模等具体数据' : 'Please describe specific data on new users, exposure scale, etc.'}
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '在所有运营动作里，哪一种方式最有效果？（如 AMA、媒体、跨社区合作）' : 'Among all operational activities, which method was most effective? (e.g., AMA, media, cross-community cooperation)'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请详细说明最有效的运营方式及其效果' : 'Please describe the most effective operational methods and their results in detail'}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-900/30 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-200 mb-4">
                      {language === 'zh' ? '产品型项目' : 'Product-Type Projects'}
                    </h4>
                    <div className="space-y-4 text-sm">
                      <div>
                        <label className="text-gray-300 font-medium block mb-2">
                          {language === 'zh' ? '产品功能或迭代上线后，是否直接带来新增用户或交易？请举例说明。' : 'Did product features or iterations directly bring new users or transactions? Please provide examples.'}
                        </label>
                        <textarea
                          className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                          placeholder={language === 'zh' ? '请详细描述产品功能带来的用户增长和交易数据' : 'Please describe in detail how product features brought user growth and transaction data'}
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="text-gray-300 font-medium block mb-2">
                          {language === 'zh' ? '是否有外部渠道（应用商店、开发者社区、合作伙伴）帮助导入流量？' : 'Are there external channels (app stores, developer communities, partners) helping to import traffic?'}
                        </label>
                        <textarea
                          className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                          placeholder={language === 'zh' ? '请描述外部渠道的具体情况和流量导入效果' : 'Please describe specific external channels and their traffic import effects'}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900/30 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-200 mb-4">
                      {language === 'zh' ? '社群型项目' : 'Community-Type Projects'}
                    </h4>
                    <div className="space-y-4 text-sm">
                      <div>
                        <label className="text-gray-300 font-medium block mb-2">
                          {language === 'zh' ? '哪些社群活动最有效地吸引了新成员？请描述。' : 'Which community activities most effectively attracted new members? Please describe.'}
                        </label>
                        <textarea
                          className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                          placeholder={language === 'zh' ? '请详细描述最有效的社群活动和吸引新成员的具体数据' : 'Please describe in detail the most effective community activities and specific data on attracting new members'}
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="text-gray-300 font-medium block mb-2">
                          {language === 'zh' ? '是否有自发的社群传播（Meme、二创、裂变案例）显著带来流量？' : 'Is there spontaneous community spread (memes, secondary creation, viral cases) that significantly brought traffic?'}
                        </label>
                        <textarea
                          className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                          placeholder={language === 'zh' ? '请描述社群自发传播的具体案例和带来的流量数据' : 'Please describe specific cases of spontaneous community spread and the traffic data they brought'}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 项目质量 */}
            <motion.div
              className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center">
                <span className="mr-3">⭐</span>
                {language === 'zh' ? '三、项目质量' : '3. Project Quality'}
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-green-200 mb-4">
                    {language === 'zh' ? '通用（所有赛道必答）' : 'General (All Tracks Required)'}
                  </h4>
                  <div className="space-y-4 text-sm">
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '项目的核心价值与亮点是什么？' : 'What are the core values and highlights of the project?'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-300 min-h-[80px] resize-vertical"
                        placeholder={language === 'zh' ? '请详细描述项目的核心价值和独特亮点' : 'Please describe in detail the core values and unique highlights of the project'}
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '相比其他同类项目，你们最大的竞争优势在哪里？' : 'Compared to other similar projects, what is your biggest competitive advantage?'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-300 min-h-[80px] resize-vertical"
                        placeholder={language === 'zh' ? '请详细说明相比同类项目的最大竞争优势' : 'Please describe in detail your biggest competitive advantage compared to similar projects'}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-900/30 rounded-lg p-4">
                    <h4 className="font-semibold text-green-200 mb-4">
                      {language === 'zh' ? '产品型项目' : 'Product-Type Projects'}
                    </h4>
                    <div className="space-y-4 text-sm">
                      <div>
                        <label className="text-gray-300 font-medium block mb-2">
                          {language === 'zh' ? '产品目前所处阶段（概念 / Demo / 内测 / 正式上线），请说明现状。' : 'Current product stage (concept / Demo / beta / live), please describe the status.'}
                        </label>
                        <textarea
                          className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                          placeholder={language === 'zh' ? '请详细说明产品当前所处阶段和具体现状' : 'Please describe in detail the current product stage and specific status'}
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="text-gray-300 font-medium block mb-2">
                          {language === 'zh' ? '迭代过程中，有哪些功能或设计是你们最自豪的创新？' : 'During iteration, what features or designs are you most proud of as innovations?'}
                        </label>
                        <textarea
                          className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                          placeholder={language === 'zh' ? '请详细描述最自豪的功能创新和设计亮点' : 'Please describe in detail the most proud feature innovations and design highlights'}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900/30 rounded-lg p-4">
                    <h4 className="font-semibold text-green-200 mb-4">
                      {language === 'zh' ? '社群型项目' : 'Community-Type Projects'}
                    </h4>
                    <div className="space-y-4 text-sm">
                      <div>
                        <label className="text-gray-300 font-medium block mb-2">
                          {language === 'zh' ? '社群的核心叙事是什么？为什么它能引起共鸣？' : 'What is the core narrative of the community? Why does it resonate?'}
                        </label>
                        <textarea
                          className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                          placeholder={language === 'zh' ? '请详细描述社群的核心叙事和引起共鸣的原因' : 'Please describe in detail the core narrative of the community and why it resonates'}
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="text-gray-300 font-medium block mb-2">
                          {language === 'zh' ? '是否建立了稳定的治理或组织机制？（如投票、提案、联盟协作）' : 'Have you established stable governance or organizational mechanisms? (e.g., voting, proposals, alliance cooperation)'}
                        </label>
                        <textarea
                          className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                          placeholder={language === 'zh' ? '请详细描述已建立的治理机制和组织结构' : 'Please describe in detail the established governance mechanisms and organizational structure'}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 叙事与共识 */}
            <motion.div
              className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-orange-300 mb-4 flex items-center">
                <span className="mr-2">💭</span>
                {language === 'zh' ? '四、叙事与共识' : '4. Narrative & Consensus'}
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-200 mb-3">
                    {language === 'zh' ? '通用问题（所有赛道必答）' : 'General Questions (All Tracks Required)'}
                  </h4>
                  <div className="space-y-4 text-sm">
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '用一句话总结你们的叙事（≤200字）' : 'Summarize your narrative in one sentence (≤200 characters)'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all duration-300 min-h-[80px] resize-vertical"
                        placeholder={language === 'zh' ? '请用一句话总结项目的核心叙事，不超过200字' : 'Please summarize the core narrative of the project in one sentence, no more than 200 characters'}
                        rows={3}
                        maxLength={200}
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '截止 T0，你们的叙事是否得到过外部验证？（如媒体报道、KOL引用）' : 'By T0, has your narrative received external validation? (e.g., media reports, KOL citations)'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all duration-300 min-h-[80px] resize-vertical"
                        placeholder={language === 'zh' ? '请详细描述叙事的外部验证情况，包括媒体报道、KOL引用等具体案例' : 'Please describe in detail the external validation of the narrative, including specific cases of media reports, KOL citations, etc.'}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-gray-900/30 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-200 mb-3">
                      {language === 'zh' ? '产品型项目专项' : 'Product-Type Projects'}
                    </h4>
                    <div className="space-y-4 text-sm">
                      <div>
                        <label className="text-gray-300 font-medium block mb-2">
                          {language === 'zh' ? '产品叙事是否围绕"技术/应用如何改变体验"？请说明' : 'Does the product narrative revolve around "how technology/applications change experience"? Please explain'}
                        </label>
                        <textarea
                          className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all duration-300 min-h-[80px] resize-vertical"
                          placeholder={language === 'zh' ? '请详细说明产品叙事如何围绕技术/应用改变用户体验展开' : 'Please explain in detail how the product narrative revolves around how technology/applications change user experience'}
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="text-gray-300 font-medium block mb-2">
                          {language === 'zh' ? '是否因用户反馈而调整过叙事？举例说明' : 'Have you adjusted the narrative based on user feedback? Please provide examples'}
                        </label>
                        <textarea
                          className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all duration-300 min-h-[80px] resize-vertical"
                          placeholder={language === 'zh' ? '请详细描述基于用户反馈调整叙事的具体案例和效果' : 'Please describe in detail specific cases and effects of adjusting the narrative based on user feedback'}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900/30 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-200 mb-3">
                      {language === 'zh' ? '社群型项目专项' : 'Community-Type Projects'}
                    </h4>
                    <div className="space-y-4 text-sm">
                      <div>
                        <label className="text-gray-300 font-medium block mb-2">
                          {language === 'zh' ? '最近一次社群活动如何强化了叙事？' : 'How did the most recent community activity strengthen the narrative?'}
                        </label>
                        <textarea
                          className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all duration-300 min-h-[80px] resize-vertical"
                          placeholder={language === 'zh' ? '请详细描述最近一次社群活动如何强化和传播项目叙事' : 'Please describe in detail how the most recent community activity strengthened and spread the project narrative'}
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="text-gray-300 font-medium block mb-2">
                          {language === 'zh' ? '社群成员是否主动产出叙事相关的内容？请提供案例' : 'Do community members actively produce narrative-related content? Please provide examples'}
                        </label>
                        <textarea
                          className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all duration-300 min-h-[80px] resize-vertical"
                          placeholder={language === 'zh' ? '请详细描述社群成员主动产出叙事相关内容的具体案例和影响' : 'Please describe in detail specific cases and impact of community members actively producing narrative-related content'}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 团队效率 */}
            <motion.div
              className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-red-300 mb-4 flex items-center">
                <span className="mr-3">🚀</span>
                {language === 'zh' ? '五、团队效率' : '5. Team Efficiency'}
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-red-200 mb-4">
                    {language === 'zh' ? '通用（所有赛道必答）' : 'General (All Tracks Required)'}
                  </h4>
                  <div className="space-y-4 text-sm">
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '当前团队规模与核心分工。' : 'Current team size and core division of labor.'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请详细描述团队规模、成员背景和核心分工' : 'Please describe in detail team size, member backgrounds and core division of labor'}
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '截止 T0 已完成的关键动作（活动、迭代、合作）。' : 'Key actions completed by T0 (activities, iterations, collaborations).'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请详细列出截止T0已完成的关键动作和成果' : 'Please list in detail the key actions and achievements completed by T0'}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-900/30 rounded-lg p-4">
                    <h4 className="font-semibold text-red-200 mb-4">
                      {language === 'zh' ? '产品型项目' : 'Product-Type Projects'}
                    </h4>
                    <div className="space-y-4 text-sm">
                      <div>
                        <label className="text-gray-300 font-medium block mb-2">
                          {language === 'zh' ? '产品迭代周期通常多久？能否按计划推进？' : 'How long is the typical product iteration cycle? Can you advance as planned?'}
                        </label>
                        <textarea
                          className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                          placeholder={language === 'zh' ? '请详细描述产品迭代周期和推进计划执行情况' : 'Please describe in detail the product iteration cycle and plan execution'}
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="text-gray-300 font-medium block mb-2">
                          {language === 'zh' ? '团队是否具备全职技术开发力量？大约占比多少？' : 'Does the team have full-time technical development capabilities? What percentage approximately?'}
                        </label>
                        <textarea
                          className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                          placeholder={language === 'zh' ? '请详细说明团队技术开发力量配置和占比情况' : 'Please describe in detail the team technical development capabilities and percentage'}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900/30 rounded-lg p-4">
                    <h4 className="font-semibold text-red-200 mb-4">
                      {language === 'zh' ? '社群型项目' : 'Community-Type Projects'}
                    </h4>
                    <div className="space-y-4 text-sm">
                      <div>
                        <label className="text-gray-300 font-medium block mb-2">
                          {language === 'zh' ? '社群运营团队的人数与分工是怎样的？' : 'What is the size and division of labor of the community operations team?'}
                        </label>
                        <textarea
                          className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                          placeholder={language === 'zh' ? '请详细描述社群运营团队的规模、成员背景和具体分工' : 'Please describe in detail the community operations team size, member backgrounds and specific division of labor'}
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="text-gray-300 font-medium block mb-2">
                          {language === 'zh' ? '遇到社群负面情绪或突发问题时，你们是如何应对的？' : 'How do you respond when encountering negative community sentiment or emergencies?'}
                        </label>
                        <textarea
                          className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                          placeholder={language === 'zh' ? '请详细描述应对社群负面情绪和突发问题的具体策略和案例' : 'Please describe in detail the specific strategies and cases for handling negative community sentiment and emergencies'}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 下一步规划 */}
            <motion.div
              className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center">
                <span className="mr-2">🎯</span>
                {language === 'zh' ? '六、下一步规划（所有赛道必答）' : '6. Next Steps Planning (All Tracks Required)'}
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-200 mb-3">
                    {language === 'zh' ? '发展目标' : 'Development Goals'}
                  </h4>
                  <div>
                    <label className="text-gray-300 font-medium block mb-2">
                      {language === 'zh' ? '未来 3 个月的重点目标是什么？' : 'What are the key goals for the next 3 months?'}
                    </label>
                    <textarea
                      className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 min-h-[100px] resize-vertical"
                      placeholder={language === 'zh' ? '请详细描述未来3个月的重点发展目标和具体计划' : 'Please describe in detail the key development goals and specific plans for the next 3 months'}
                      rows={4}
                    />
                  </div>
                </div>
                
                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-200 mb-3">
                    {language === 'zh' ? '平台支持需求' : 'Platform Support Needs'}
                  </h4>
                  <div>
                    <label className="text-gray-300 font-medium block mb-2">
                      {language === 'zh' ? '希望 Flipflop 平台提供哪些支持？（多选）' : 'What support do you hope Flipflop platform can provide? (Multiple choices)'}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-4">
                      <label className="flex items-center text-gray-300 cursor-pointer hover:text-cyan-300 transition-colors">
                        <input
                          type="checkbox"
                          className="mr-2 w-4 h-4 text-cyan-400 bg-gray-800 border-gray-600 rounded focus:ring-cyan-400 focus:ring-2"
                        />
                        {language === 'zh' ? '流量曝光' : 'Traffic Exposure'}
                      </label>
                      <label className="flex items-center text-gray-300 cursor-pointer hover:text-cyan-300 transition-colors">
                        <input
                          type="checkbox"
                          className="mr-2 w-4 h-4 text-cyan-400 bg-gray-800 border-gray-600 rounded focus:ring-cyan-400 focus:ring-2"
                        />
                        {language === 'zh' ? '媒体宣发' : 'Media Promotion'}
                      </label>
                      <label className="flex items-center text-gray-300 cursor-pointer hover:text-cyan-300 transition-colors">
                        <input
                          type="checkbox"
                          className="mr-2 w-4 h-4 text-cyan-400 bg-gray-800 border-gray-600 rounded focus:ring-cyan-400 focus:ring-2"
                        />
                        {language === 'zh' ? '投资对接' : 'Investment Matching'}
                      </label>
                      <label className="flex items-center text-gray-300 cursor-pointer hover:text-cyan-300 transition-colors">
                        <input
                          type="checkbox"
                          className="mr-2 w-4 h-4 text-cyan-400 bg-gray-800 border-gray-600 rounded focus:ring-cyan-400 focus:ring-2"
                        />
                        {language === 'zh' ? '技术支持' : 'Technical Support'}
                      </label>
                      <label className="flex items-center text-gray-300 cursor-pointer hover:text-cyan-300 transition-colors">
                        <input
                          type="checkbox"
                          className="mr-2 w-4 h-4 text-cyan-400 bg-gray-800 border-gray-600 rounded focus:ring-cyan-400 focus:ring-2"
                        />
                        {language === 'zh' ? '海外推广' : 'Global Promotion'}
                      </label>
                      <label className="flex items-center text-gray-300 cursor-pointer hover:text-cyan-300 transition-colors">
                        <input
                          type="checkbox"
                          className="mr-2 w-4 h-4 text-cyan-400 bg-gray-800 border-gray-600 rounded focus:ring-cyan-400 focus:ring-2"
                        />
                        {language === 'zh' ? '其他' : 'Others'}
                      </label>
                    </div>
                    <textarea
                      className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 min-h-[80px] resize-vertical"
                      placeholder={language === 'zh' ? '请详细说明具体的支持需求和期望' : 'Please describe in detail specific support needs and expectations'}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 声明与承诺 */}
            <motion.div
              className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-yellow-300 mb-4 flex items-center">
                <span className="mr-2">✅</span>
                {language === 'zh' ? '七、声明与承诺' : '7. Declaration & Commitment'}
              </h3>
              <div className="bg-gray-900/30 rounded-lg p-4">
                <div className="space-y-3 text-gray-300 text-sm">
                  <label className="flex items-start cursor-pointer hover:text-yellow-300 transition-colors">
                    <input
                      type="checkbox"
                      className="mr-3 mt-1 w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400 focus:ring-2"
                    />
                    <span>
                      {language === 'zh' 
                        ? '我们提交的信息和数据均为真实、有效，无伪造或虚假'
                        : 'The information and data we submit are true and valid, without forgery or falsehood'
                      }
                    </span>
                  </label>
                  <label className="flex items-start cursor-pointer hover:text-yellow-300 transition-colors">
                    <input
                      type="checkbox"
                      className="mr-3 mt-1 w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400 focus:ring-2"
                    />
                    <span>
                      {language === 'zh' 
                        ? '若发现虚假/操纵，平台有权取消参赛或获奖资格'
                        : 'If falsification/manipulation is found, the platform has the right to cancel participation or award eligibility'
                      }
                    </span>
                  </label>
                  <label className="flex items-start cursor-pointer hover:text-yellow-300 transition-colors">
                    <input
                      type="checkbox"
                      className="mr-3 mt-1 w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400 focus:ring-2"
                    />
                    <span>
                      {language === 'zh' 
                        ? '我们遵守所在司法辖区的税务与合规要求'
                        : 'We comply with tax and regulatory requirements in our jurisdiction'
                      }
                    </span>
                  </label>
                  <label className="flex items-start cursor-pointer hover:text-yellow-300 transition-colors">
                    <input
                      type="checkbox"
                      className="mr-3 mt-1 w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400 focus:ring-2"
                    />
                    <span>
                      {language === 'zh' 
                        ? '涉及的知识产权内容均为原创或合法授权，若有侵权责任自负'
                        : 'All intellectual property content involved is original or legally authorized; we bear responsibility for any infringement'
                      }
                    </span>
                  </label>
                  <label className="flex items-start cursor-pointer hover:text-yellow-300 transition-colors">
                    <input
                      type="checkbox"
                      className="mr-3 mt-1 w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400 focus:ring-2"
                    />
                    <span>
                      {language === 'zh' 
                        ? '我们同意 Flipflop 平台对参赛材料进行公开展示和传播'
                        : 'We agree that Flipflop platform can publicly display and disseminate contest materials'
                      }
                    </span>
                  </label>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 提交说明 */}
        <motion.div
          className="mt-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center">
            <span className="mr-2">📌</span>
            {language === 'zh' ? '提交说明' : 'Submission Instructions'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300 text-xs">
            <div className="text-center">
              <div className="text-xl mb-2">⏰</div>
              <h4 className="font-bold text-purple-300 mb-1">
                {language === 'zh' ? '提交时限' : 'Deadline'}
              </h4>
              <p>
                {language === 'zh' 
                  ? 'T0+7天内提交'
                  : 'Submit within T0+7 days'
                }
              </p>
            </div>
            <div className="text-center">
              <div className="text-xl mb-2">🔒</div>
              <h4 className="font-bold text-purple-300 mb-1">
                {language === 'zh' ? '提交规则' : 'Rules'}
              </h4>
              <p>
                {language === 'zh' 
                  ? '提交后不可修改'
                  : 'Cannot modify after submission'
                }
              </p>
            </div>
            <div className="text-center">
              <div className="text-xl mb-2">⚖️</div>
              <h4 className="font-bold text-purple-300 mb-1">
                {language === 'zh' ? '评估方式' : 'Evaluation'}
              </h4>
              <p>
                {language === 'zh' 
                  ? '未提交者独立评估'
                  : 'Independent evaluation for non-submitters'
                }
              </p>
            </div>
          </div>
        </motion.div>

        {/* 提交按钮区域 */}
        <motion.div 
          className="mt-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-purple-400 mb-2">
              {language === 'zh' ? '📤 提交问答清单' : '📤 Submit Questionnaire'}
            </h3>
            <p className="text-gray-300 text-xs">
              {language === 'zh' 
                ? '请确保所有信息填写完整且准确，提交后不可修改'
                : 'Please ensure all information is complete and accurate, cannot be modified after submission'
              }
            </p>
          </div>
          
          <div className="flex justify-center">
            <button
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-400 hover:to-pink-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={() => {
                // TODO: 实现表单提交逻辑
                alert(language === 'zh' ? '表单提交功能正在开发中...' : 'Form submission feature is under development...');
              }}
            >
              🚀 {language === 'zh' ? '提交问答清单' : 'Submit Questionnaire'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

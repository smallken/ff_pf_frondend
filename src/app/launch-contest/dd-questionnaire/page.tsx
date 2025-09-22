'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ddQuestionnaireService, DDQuestionnaireData } from '../../../services/ddQuestionnaireService';
import SuccessModal from '../../components/SuccessModal';

export default function DDQuestionnaireTest() {
  const { language } = useLanguage();
  const [selectedTrack, setSelectedTrack] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // 表单数据状态
  const [formData, setFormData] = useState<DDQuestionnaireData>({
    registrationId: undefined, // 可选字段
    projectName: '',
    tokenContractAddress: '',
    trackCategory: '',
    otherTrackName: '',
    keyDataAtT0: '',
    trafficContribution: '',
    projectQuality: '',
    narrativeConsensus: '',
    teamEfficiency: '',
    nextSteps: '',
    declarations: '',
  });

  // 处理输入变化
  const handleInputChange = (field: keyof DDQuestionnaireData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理赛道选择
  const handleTrackChange = (track: string) => {
    setSelectedTrack(track);
    setFormData(prev => ({
      ...prev,
      trackCategory: track
    }));
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // 基本验证
      if (!formData.projectName.trim()) {
        alert(language === 'zh' ? '请输入项目名称' : 'Please enter project name');
        return;
      }
      
      if (!formData.trackCategory) {
        alert(language === 'zh' ? '请选择所属赛道' : 'Please select track category');
        return;
      }

      // 调试日志：查看提交的数据
      console.log('🔍 提交DD问答清单数据:', formData);
      console.log('🔍 各字段详情:', {
        projectName: formData.projectName,
        tokenContractAddress: formData.tokenContractAddress,
        trackCategory: formData.trackCategory,
        otherTrackName: formData.otherTrackName,
        keyDataAtT0: formData.keyDataAtT0,
        trafficContribution: formData.trafficContribution,
        projectQuality: formData.projectQuality,
        narrativeConsensus: formData.narrativeConsensus,
        teamEfficiency: formData.teamEfficiency,
        nextSteps: formData.nextSteps,
        declarations: formData.declarations
      });

      // 提交数据
      const result = await ddQuestionnaireService.submitDDQuestionnaire(formData);
      
      if (result.code === 0) {
        setShowSuccessModal(true);
      } else {
        alert(language === 'zh' ? `提交失败：${result.message}` : `Submission failed: ${result.message}`);
      }
    } catch (error) {
      console.error('提交失败:', error);
      alert(language === 'zh' ? '提交失败，请稍后重试' : 'Submission failed, please try again later');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 返回按钮 */}
        <div className="mb-8">
          <a
            href="/launch-contest"
            className="inline-flex items-center px-4 py-2 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition-all duration-300 text-sm font-medium"
          >
            <span className="mr-2">←</span>
            {language === 'zh' ? '返回Launch大赛' : 'Back to Launch Contest'}
          </a>
        </div>

        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-600 bg-clip-text text-transparent">
            📝 DD {language === 'zh' ? '问答清单' : 'Questionnaire'}
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {language === 'zh' 
              ? 'Launch 大赛深度尽调问答清单 - 项目评估的重要依据'
              : 'Launch Contest Due Diligence Questionnaire - Important Basis for Project Evaluation'
            }
          </p>
        </div>

        {/* 重要说明 */}
        <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-xl p-8 mb-12">
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
        </div>

        {/* 测试内容区域 */}
        <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-purple-300 mb-6">
            {language === 'zh' ? 'DD 问答清单内容' : 'DD Questionnaire Content'}
          </h2>
          
          <div className="space-y-6">
            {/* 基础信息 */}
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              <h3 className="text-xl font-bold text-purple-300 mb-4">
                {language === 'zh' ? '一、基础信息确认（所有赛道必答）' : '1. Basic Information Confirmation (All Tracks Required)'}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 font-medium block mb-2">
                      {language === 'zh' ? '项目名称：' : 'Project Name:'}
                    </label>
                    <input
                      type="text"
                      value={formData.projectName}
                      onChange={(e) => handleInputChange('projectName', e.target.value)}
                      className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300"
                      placeholder={language === 'zh' ? '请输入项目名称' : 'Enter project name'}
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 font-medium block mb-2">
                      {language === 'zh' ? '代币合约地址：' : 'Token Contract Address:'}
                    </label>
                    <input
                      type="text"
                      value={formData.tokenContractAddress}
                      onChange={(e) => handleInputChange('tokenContractAddress', e.target.value)}
                      className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300"
                      placeholder={language === 'zh' ? '请输入代币合约地址' : 'Enter token contract address'}
                    />
                  </div>
                </div>
                
                <div className="bg-gray-900/20 rounded-lg p-4 border border-gray-700/30">
                  <label className="text-gray-300 font-medium block mb-4">
                    {language === 'zh' ? '所属赛道（与报名一致）：' : 'Track Category (consistent with registration):'}
                  </label>
                  <div className="space-y-4">
                    <div className="bg-gray-800/30 rounded-lg p-3">
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
                            onChange={(e) => handleTrackChange(e.target.value)}
                            className="mr-3 w-4 h-4 text-cyan-500 bg-gray-800 border-gray-600 focus:ring-cyan-500 focus:ring-2"
                          />
                          {language === 'zh' ? 'RWA赛道' : 'RWA Track'}
                        </label>
                        <label className="flex items-center text-gray-300 cursor-pointer hover:text-cyan-300 transition-colors">
                          <input
                            type="radio"
                            name="track"
                            value="mini-app"
                            checked={selectedTrack === 'mini-app'}
                            onChange={(e) => handleTrackChange(e.target.value)}
                            className="mr-3 w-4 h-4 text-cyan-500 bg-gray-800 border-gray-600 focus:ring-cyan-500 focus:ring-2"
                          />
                          {language === 'zh' ? '小应用赛道' : 'Mini App Track'}
                        </label>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/30 rounded-lg p-3">
                      <h5 className="text-green-300 font-medium mb-3">
                        {language === 'zh' ? '共识 / 社群型：' : 'Consensus / Community Type:'}
                      </h5>
                      <div className="space-y-2">
                        <label className="flex items-center text-gray-300 cursor-pointer hover:text-green-300 transition-colors">
                          <input
                            type="radio"
                            name="track"
                            value="kol"
                            checked={selectedTrack === 'kol'}
                            onChange={(e) => handleTrackChange(e.target.value)}
                            className="mr-3 w-4 h-4 text-green-500 bg-gray-800 border-gray-600 focus:ring-green-500 focus:ring-2"
                          />
                          {language === 'zh' ? 'KOL赛道' : 'KOL Track'}
                        </label>
                        <label className="flex items-center text-gray-300 cursor-pointer hover:text-green-300 transition-colors">
                          <input
                            type="radio"
                            name="track"
                            value="ip"
                            checked={selectedTrack === 'ip'}
                            onChange={(e) => handleTrackChange(e.target.value)}
                            className="mr-3 w-4 h-4 text-green-500 bg-gray-800 border-gray-600 focus:ring-green-500 focus:ring-2"
                          />
                          {language === 'zh' ? 'IP赛道' : 'IP Track'}
                        </label>
                        <label className="flex items-center text-gray-300 cursor-pointer hover:text-green-300 transition-colors">
                          <input
                            type="radio"
                            name="track"
                            value="community"
                            checked={selectedTrack === 'community'}
                            onChange={(e) => handleTrackChange(e.target.value)}
                            className="mr-3 w-4 h-4 text-green-500 bg-gray-800 border-gray-600 focus:ring-green-500 focus:ring-2"
                          />
                          {language === 'zh' ? '社区赛道' : 'Community Track'}
                        </label>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/30 rounded-lg p-3">
                      <label className="flex items-center text-gray-300 cursor-pointer hover:text-purple-300 transition-colors">
                        <input
                          type="radio"
                          name="track"
                          value="other"
                          checked={selectedTrack === 'other'}
                          onChange={(e) => handleTrackChange(e.target.value)}
                          className="mr-3 w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 focus:ring-purple-500 focus:ring-2"
                        />
                        {language === 'zh' ? '其他赛道' : 'Other Track'}
                      </label>
                      {selectedTrack === 'other' && (
                        <div className="mt-3">
                          <label className="text-gray-300 font-medium block mb-2">
                            {language === 'zh' ? '请输入其他赛道名称：' : 'Please enter other track name:'}
                          </label>
                          <input
                            type="text"
                            value={formData.otherTrackName || ''}
                            onChange={(e) => handleInputChange('otherTrackName', e.target.value)}
                            className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300"
                            placeholder={language === 'zh' ? '请输入其他赛道名称' : 'Enter other track name'}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 font-medium block mb-2">
                    {language === 'zh' ? '截止日 T0 的关键数据：' : 'Key Data at Deadline T0:'}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm block mb-1">
                        {language === 'zh' ? '持币地址数：' : 'Token Holder Addresses:'}
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm block mb-1">
                        {language === 'zh' ? 'Mint 完成度：' : 'Mint Completion:'}
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300"
                        placeholder="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm block mb-1">
                        {language === 'zh' ? '社区规模（TG/Discord人数）：' : 'Community Size (TG/Discord):'}
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm block mb-1">
                        {language === 'zh' ? '推特粉丝数：' : 'Twitter Followers:'}
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-gray-400 text-sm block mb-1">
                      {language === 'zh' ? '已毕业可补充描述外盘目前相关数据：' : 'Additional external market data (for graduated projects):'}
                    </label>
                    <textarea
                      value={formData.keyDataAtT0}
                      onChange={(e) => handleInputChange('keyDataAtT0', e.target.value)}
                      className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                      placeholder={language === 'zh' ? '请描述外盘相关数据' : 'Please describe external market data'}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 流量贡献 */}
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              <h3 className="text-xl font-bold text-blue-300 mb-4">
                {language === 'zh' ? '二、流量贡献' : '2. Traffic Contribution'}
              </h3>
              <div className="space-y-6">
                {/* 通用问题 */}
                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-200 mb-4">
                    {language === 'zh' ? '通用（所有赛道必答）' : 'General (All Tracks Required)'}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '截止 T0，你们带来的新增用户或曝光规模是多少？' : 'By T0, what is the scale of new users or exposure you brought?'}
                      </label>
                      <textarea
                        value={formData.trafficContribution}
                        onChange={(e) => handleInputChange('trafficContribution', e.target.value)}
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

                {/* 产品型项目 */}
                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-200 mb-4">
                    {language === 'zh' ? '产品型项目' : 'Product-Type Projects'}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '产品功能或迭代上线后，是否直接带来新增用户或交易？请举例说明。' : 'After product features or iterations were launched, did they directly bring new users or transactions? Please provide examples.'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请举例说明产品功能带来的用户增长或交易增长' : 'Please provide examples of user growth or transaction growth brought by product features'}
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '是否有外部渠道（应用商店、开发者社区、合作伙伴）帮助导入流量？' : 'Are there external channels (app stores, developer communities, partners) that help import traffic?'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请描述外部渠道的流量导入情况' : 'Please describe traffic import from external channels'}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* 社群型项目 */}
                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-200 mb-4">
                    {language === 'zh' ? '社群型项目' : 'Community-Type Projects'}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '哪些社群活动最有效地吸引了新成员？请描述。' : 'Which community activities most effectively attracted new members? Please describe.'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请描述最有效的社群活动及其效果' : 'Please describe the most effective community activities and their results'}
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '是否有自发的社群传播（Meme、二创、裂变案例）显著带来流量？' : 'Are there spontaneous community spreads (Meme, secondary creation, fission cases) that significantly brought traffic?'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请描述自发的社群传播案例及其流量效果' : 'Please describe spontaneous community spread cases and their traffic effects'}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 项目质量 */}
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              <h3 className="text-xl font-bold text-green-300 mb-4">
                {language === 'zh' ? '三、项目质量' : '3. Project Quality'}
              </h3>
              <div className="space-y-6">
                {/* 通用问题 */}
                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-green-200 mb-4">
                    {language === 'zh' ? '通用（所有赛道必答）' : 'General (All Tracks Required)'}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '项目的核心价值与亮点是什么？' : 'What are the core value and highlights of the project?'}
                      </label>
                      <textarea
                        value={formData.projectQuality}
                        onChange={(e) => handleInputChange('projectQuality', e.target.value)}
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请详细描述项目的核心价值和亮点' : 'Please describe the core value and highlights of the project in detail'}
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '相比其他同类项目，你们最大的竞争优势在哪里？' : 'Compared to other similar projects, where is your biggest competitive advantage?'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请详细说明项目的竞争优势' : 'Please describe the competitive advantages of the project in detail'}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* 产品型项目 */}
                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-green-200 mb-4">
                    {language === 'zh' ? '产品型项目' : 'Product-Type Projects'}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '产品目前所处阶段（概念 / Demo / 内测 / 正式上线），请说明现状。' : 'What stage is the product currently in (concept / Demo / beta / officially launched)? Please describe the current status.'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请详细说明产品当前阶段和现状' : 'Please describe the current stage and status of the product in detail'}
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '迭代过程中，有哪些功能或设计是你们最自豪的创新？' : 'During the iteration process, which features or designs are you most proud of as innovations?'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请详细描述最自豪的创新功能或设计' : 'Please describe the most proud innovative features or designs in detail'}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* 社群型项目 */}
                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-green-200 mb-4">
                    {language === 'zh' ? '社群型项目' : 'Community-Type Projects'}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '社群的核心叙事是什么？为什么它能引起共鸣？' : 'What is the core narrative of the community? Why can it resonate?'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请详细描述社群的核心叙事和共鸣点' : 'Please describe the core narrative and resonance points of the community in detail'}
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '是否建立了稳定的治理或组织机制？（如投票、提案、联盟协作）' : 'Have stable governance or organizational mechanisms been established? (e.g., voting, proposals, alliance cooperation)'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请详细描述治理或组织机制' : 'Please describe governance or organizational mechanisms in detail'}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 叙事与共识 */}
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              <h3 className="text-xl font-bold text-orange-300 mb-4">
                {language === 'zh' ? '四、叙事与共识' : '4. Narrative & Consensus'}
              </h3>
              <div className="space-y-6">
                {/* 通用问题 */}
                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-200 mb-4">
                    {language === 'zh' ? '通用（所有赛道必答）' : 'General (All Tracks Required)'}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '用一句话总结你们的叙事（≤200字）。' : 'Summarize your narrative in one sentence (≤200 words).'}
                      </label>
                      <textarea
                        value={formData.narrativeConsensus}
                        onChange={(e) => handleInputChange('narrativeConsensus', e.target.value)}
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请用一句话总结项目叙事（不超过200字）' : 'Please summarize the project narrative in one sentence (no more than 200 words)'}
                        rows={2}
                        maxLength={200}
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '截止 T0，你们的叙事是否得到过外部验证？（如媒体报道、KOL引用）' : 'By T0, has your narrative been externally validated? (e.g., media reports, KOL citations)'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请描述外部验证情况，如媒体报道、KOL引用等' : 'Please describe external validation, such as media reports, KOL citations, etc.'}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* 产品型项目 */}
                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-200 mb-4">
                    {language === 'zh' ? '产品型项目' : 'Product-Type Projects'}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '产品叙事是否围绕"技术/应用如何改变体验"？请说明。' : 'Does the product narrative revolve around "how technology/applications change experience"? Please explain.'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请说明产品叙事如何围绕技术/应用改变体验' : 'Please explain how the product narrative revolves around technology/application changing experience'}
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '是否因用户反馈而调整过叙事？举例说明。' : 'Have you adjusted the narrative based on user feedback? Please provide examples.'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请举例说明因用户反馈而调整叙事的情况' : 'Please provide examples of narrative adjustments based on user feedback'}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* 社群型项目 */}
                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-200 mb-4">
                    {language === 'zh' ? '社群型项目' : 'Community-Type Projects'}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '最近一次社群活动如何强化了叙事？' : 'How did the most recent community activity strengthen the narrative?'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请描述最近一次社群活动如何强化叙事' : 'Please describe how the most recent community activity strengthened the narrative'}
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '社群成员是否主动产出叙事相关的内容？请提供案例。' : 'Do community members actively produce narrative-related content? Please provide cases.'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请提供社群成员主动产出叙事相关内容的案例' : 'Please provide cases of community members actively producing narrative-related content'}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 团队效率 */}
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              <h3 className="text-xl font-bold text-cyan-300 mb-4">
                {language === 'zh' ? '五、团队效率' : '5. Team Efficiency'}
              </h3>
              <div className="space-y-6">
                {/* 通用问题 */}
                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-200 mb-4">
                    {language === 'zh' ? '通用（所有赛道必答）' : 'General (All Tracks Required)'}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '当前团队规模与核心分工。' : 'Current team size and core division of labor.'}
                      </label>
                      <textarea
                        value={formData.teamEfficiency}
                        onChange={(e) => handleInputChange('teamEfficiency', e.target.value)}
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请描述团队规模和核心分工' : 'Please describe team size and core division of labor'}
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '截止 T0 已完成的关键动作（活动、迭代、合作）。' : 'Key actions completed by T0 (activities, iterations, cooperation).'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请描述截止T0已完成的关键动作' : 'Please describe key actions completed by T0'}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* 产品型项目 */}
                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-200 mb-4">
                    {language === 'zh' ? '产品型项目' : 'Product-Type Projects'}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '产品迭代周期通常多久？能否按计划推进？' : 'How long is the product iteration cycle usually? Can it proceed according to plan?'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请描述产品迭代周期和计划推进情况' : 'Please describe product iteration cycle and plan advancement'}
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '团队是否具备全职技术开发力量？大约占比多少？' : 'Does the team have full-time technical development capabilities? What is the approximate proportion?'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请描述团队技术开发力量配置' : 'Please describe team technical development capabilities'}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* 社群型项目 */}
                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-200 mb-4">
                    {language === 'zh' ? '社群型项目' : 'Community-Type Projects'}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '社群运营团队的人数与分工是怎样的？' : 'What is the size and division of labor of the community operations team?'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请描述社群运营团队的规模和分工' : 'Please describe the size and division of labor of the community operations team'}
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">
                        {language === 'zh' ? '遇到社群负面情绪或突发问题时，你们是如何应对的？' : 'When encountering negative community sentiment or sudden problems, how do you respond?'}
                      </label>
                      <textarea
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                        placeholder={language === 'zh' ? '请描述应对社群负面情绪或突发问题的方法' : 'Please describe methods for dealing with negative community sentiment or sudden problems'}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 下一步规划 */}
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              <h3 className="text-xl font-bold text-pink-300 mb-4">
                {language === 'zh' ? '六、下一步规划（所有赛道必答）' : '6. Next Steps Planning (All Tracks Required)'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 font-medium block mb-2">
                    {language === 'zh' ? '未来 3 个月的重点目标是什么？' : 'What are the key goals for the next 3 months?'}
                  </label>
                  <textarea
                    value={formData.nextSteps}
                    onChange={(e) => handleInputChange('nextSteps', e.target.value)}
                    className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 focus:outline-none transition-all duration-300 min-h-[60px] resize-vertical"
                    placeholder={language === 'zh' ? '请详细描述未来3个月的重点目标' : 'Please describe the key goals for the next 3 months in detail'}
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-medium block mb-2">
                    {language === 'zh' ? '希望 Flipflop 平台提供哪些支持（多选）：' : 'What support do you hope Flipflop platform will provide (multiple choice):'}
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center text-gray-300 cursor-pointer hover:text-pink-300 transition-colors">
                      <input
                        type="checkbox"
                        className="mr-3 w-4 h-4 text-pink-500 bg-gray-800 border-gray-600 rounded focus:ring-pink-500 focus:ring-2"
                      />
                      {language === 'zh' ? '流量曝光' : 'Traffic Exposure'}
                    </label>
                    <label className="flex items-center text-gray-300 cursor-pointer hover:text-pink-300 transition-colors">
                      <input
                        type="checkbox"
                        className="mr-3 w-4 h-4 text-pink-500 bg-gray-800 border-gray-600 rounded focus:ring-pink-500 focus:ring-2"
                      />
                      {language === 'zh' ? '媒体宣发' : 'Media Promotion'}
                    </label>
                    <label className="flex items-center text-gray-300 cursor-pointer hover:text-pink-300 transition-colors">
                      <input
                        type="checkbox"
                        className="mr-3 w-4 h-4 text-pink-500 bg-gray-800 border-gray-600 rounded focus:ring-pink-500 focus:ring-2"
                      />
                      {language === 'zh' ? '投资对接' : 'Investment Connection'}
                    </label>
                    <label className="flex items-center text-gray-300 cursor-pointer hover:text-pink-300 transition-colors">
                      <input
                        type="checkbox"
                        className="mr-3 w-4 h-4 text-pink-500 bg-gray-800 border-gray-600 rounded focus:ring-pink-500 focus:ring-2"
                      />
                      {language === 'zh' ? '技术支持' : 'Technical Support'}
                    </label>
                    <label className="flex items-center text-gray-300 cursor-pointer hover:text-pink-300 transition-colors">
                      <input
                        type="checkbox"
                        className="mr-3 w-4 h-4 text-pink-500 bg-gray-800 border-gray-600 rounded focus:ring-pink-500 focus:ring-2"
                      />
                      {language === 'zh' ? '海外推广' : 'Overseas Promotion'}
                    </label>
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center text-gray-300 cursor-pointer hover:text-pink-300 transition-colors">
                        <input
                          type="checkbox"
                          className="mr-3 w-4 h-4 text-pink-500 bg-gray-800 border-gray-600 rounded focus:ring-pink-500 focus:ring-2"
                        />
                        {language === 'zh' ? '其他：' : 'Other:'}
                      </label>
                      <input
                        type="text"
                        className="flex-1 p-2 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 focus:outline-none transition-all duration-300"
                        placeholder={language === 'zh' ? '请填写其他支持需求' : 'Please fill in other support needs'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 声明与承诺 */}
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              <h3 className="text-xl font-bold text-red-300 mb-4">
                {language === 'zh' ? '七、声明与承诺' : '7. Declaration & Commitment'}
              </h3>
              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center text-gray-300 cursor-pointer hover:text-red-300 transition-colors">
                    <input
                      type="checkbox"
                      className="mr-3 w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                    />
                    {language === 'zh' ? '我们提交的信息和数据均为真实、有效，无伪造或虚假。' : 'The information and data we submit are all true and valid, without forgery or falsehood.'}
                  </label>
                  <label className="flex items-center text-gray-300 cursor-pointer hover:text-red-300 transition-colors">
                    <input
                      type="checkbox"
                      className="mr-3 w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                    />
                    {language === 'zh' ? '若发现虚假/操纵，平台有权取消参赛或获奖资格。' : 'If fraud/manipulation is found, the platform has the right to cancel participation or award eligibility.'}
                  </label>
                  <label className="flex items-center text-gray-300 cursor-pointer hover:text-red-300 transition-colors">
                    <input
                      type="checkbox"
                      className="mr-3 w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                    />
                    {language === 'zh' ? '我们遵守所在司法辖区的税务与合规要求。' : 'We comply with tax and compliance requirements in our jurisdiction.'}
                  </label>
                  <label className="flex items-center text-gray-300 cursor-pointer hover:text-red-300 transition-colors">
                    <input
                      type="checkbox"
                      className="mr-3 w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                    />
                    {language === 'zh' ? '涉及的知识产权内容均为原创或合法授权，若有侵权责任自负。' : 'The intellectual property content involved is original or legally authorized, and any infringement liability is self-responsible.'}
                  </label>
                  <label className="flex items-center text-gray-300 cursor-pointer hover:text-red-300 transition-colors">
                    <input
                      type="checkbox"
                      className="mr-3 w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                    />
                    {language === 'zh' ? '我们同意 Flipflop 平台对参赛材料进行公开展示和传播。' : 'We agree that Flipflop platform can publicly display and disseminate contest materials.'}
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <button
              className={`px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl transition-all duration-300 transform shadow-lg hover:shadow-xl ${
                isSubmitting 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:from-purple-400 hover:to-pink-400 hover:scale-105'
              }`}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {language === 'zh' ? '提交中...' : 'Submitting...'}
                </span>
              ) : (
                <>🚀 {language === 'zh' ? '提交问答清单' : 'Submit Questionnaire'}</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 成功提交弹窗 */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={language === 'zh' ? '您的DD问答清单已成功提交！感谢您的详细回答。' : 'Your DD questionnaire has been submitted successfully! Thank you for your detailed responses.'}
        buttonText={language === 'zh' ? '返回Launch大赛' : 'Back to Launch Contest'}
        onButtonClick={() => {
          setShowSuccessModal(false);
          window.location.href = '/launch-contest';
        }}
      />
    </div>
  );
}

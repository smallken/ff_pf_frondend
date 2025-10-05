'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { mintContestService, MintContestRegistrationData } from '../../../services/mintContestService';
import SuccessModal from '../../components/SuccessModal';

export default function IndividualPage() {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    trackType: 'individual',
    displayName: '',
    email: '',
    twitterAccount: '',
    telegramAccount: '',
    mainWalletAddresses: [''],
    rewardWalletAddress: '',
    rulesAccepted: false,
    infoConfirmed: false,
    lockAccepted: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.rulesAccepted || !formData.infoConfirmed || !formData.lockAccepted) {
      alert(language === 'zh' ? '请确认所有声明与确认项' : 'Please confirm all declarations');
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData: MintContestRegistrationData = {
        trackType: formData.trackType,
        displayName: formData.displayName,
        email: formData.email,
        twitterAccount: formData.twitterAccount,
        telegramAccount: formData.telegramAccount,
        mainWalletAddresses: formData.mainWalletAddresses.filter(addr => addr.trim() !== ''),
        rewardWalletAddress: formData.rewardWalletAddress,
        rulesAccepted: formData.rulesAccepted,
        infoConfirmed: formData.infoConfirmed,
        lockAccepted: formData.lockAccepted
      };

      // 调用后端API
      const response = await mintContestService.submitRegistration(submissionData);
      
      if (response.code === 0) {
        setShowSuccessModal(true);
      } else {
        throw new Error(response.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Individual registration submission error:', error);
      alert(language === 'zh' ? `提交失败：${error instanceof Error ? error.message : '未知错误'}` : `Submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-900 to-black text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <a
            href="/mint-contest"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            ← {language === 'zh' ? '返回Mint大赛' : 'Back to Mint Competition'}
          </a>
        </motion.div>

        {/* 标题 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            🎨 {language === 'zh' ? '个人组参赛申请表' : 'Individual Registration Form'}
          </h1>
          <p className="text-gray-300 text-lg">
            {language === 'zh' 
              ? '提示：参赛信息表自大赛开始起开放，参赛者可在赛事期间随时修改或添加参赛钱包地址。最终截止日期锁定后，所有信息不可再修改。请务必确认填写内容真实有效。'
              : 'Note: Registration forms are open from the start of the contest. Participants can modify or add wallet addresses during the contest period. After the final deadline, all information cannot be modified. Please ensure all information is accurate.'
            }
          </p>
        </motion.div>

        {/* 表单 */}
        <motion.div
          className="bg-gradient-to-r from-gray-900/50 to-blue-900/20 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 一、参赛基本信息 */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-cyan-400 border-b border-cyan-500/30 pb-2">
                {language === 'zh' ? '一、参赛基本信息' : '1. Basic Information'}
              </h2>

              {/* 赛道选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  {language === 'zh' ? '赛道选择（单选）' : 'Track Selection (Single Choice)'}
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="trackType"
                      value="individual"
                      checked={formData.trackType === 'individual'}
                      onChange={(e) => handleInputChange('trackType', e.target.value)}
                      className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 focus:ring-cyan-500"
                    />
                    <span className="ml-2 text-gray-300">
                      {language === 'zh' ? '个人赛道' : 'Individual Track'}
                    </span>
                  </label>
                </div>
              </div>

              {/* 个人名称 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === 'zh' ? '个人名称（可选，用于展示榜单/宣传）' : 'Individual Name (Optional, for leaderboard/promotion)'}
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300"
                  placeholder={language === 'zh' ? '请输入您的个人名称' : 'Enter your individual name'}
                />
              </div>

              {/* 联系邮箱 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === 'zh' ? '联系邮箱' : 'Contact Email'} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300"
                  placeholder={language === 'zh' ? '请输入联系邮箱' : 'Enter contact email'}
                />
              </div>

              {/* Twitter账号 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Twitter 账号
                </label>
                <input
                  type="text"
                  value={formData.twitterAccount}
                  onChange={(e) => handleInputChange('twitterAccount', e.target.value)}
                  className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300"
                  placeholder="@your_twitter_handle"
                />
              </div>

              {/* Telegram账号 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === 'zh' ? 'Telegram账号（用于官方通知与奖励确认）' : 'Telegram Account (for official notifications and reward confirmation)'} *
                </label>
                <input
                  type="text"
                  value={formData.telegramAccount}
                  onChange={(e) => handleInputChange('telegramAccount', e.target.value)}
                  required
                  className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300"
                  placeholder="@your_telegram_handle"
                />
              </div>
            </div>

            {/* 二、参赛钱包信息 */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-cyan-400 border-b border-cyan-500/30 pb-2">
                {language === 'zh' ? '二、参赛钱包信息' : '2. Wallet Information'}
              </h2>
              <p className="text-gray-400 text-sm">
                {language === 'zh' 
                  ? '成功填写参赛登记表后，可在个人中心，修改/添加钱包地址信息'
                  : 'After successfully filling out the registration form, you can modify/add wallet address information in the personal center'
                }
              </p>

              {/* 主要参赛钱包地址 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === 'zh' ? '主要参赛钱包地址（在个人信息Mint大赛表单进行修改）' : 'Main Contest Wallet Address (Modify in Personal Info Mint Contest Form)'}
                </label>
                <div className="space-y-2">
                  {formData.mainWalletAddresses.map((address, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => {
                          const newAddresses = [...formData.mainWalletAddresses];
                          newAddresses[index] = e.target.value;
                          setFormData(prev => ({ ...prev, mainWalletAddresses: newAddresses }));
                        }}
                        className="flex-1 p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300"
                        placeholder={language === 'zh' ? '请输入钱包地址（可选）' : 'Enter wallet address (optional)'}
                      />
                      {formData.mainWalletAddresses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newAddresses = formData.mainWalletAddresses.filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, mainWalletAddresses: newAddresses }));
                          }}
                          className="px-3 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-500 transition-all duration-300"
                        >
                          {language === 'zh' ? '删除' : 'Delete'}
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ 
                        ...prev, 
                        mainWalletAddresses: [...prev.mainWalletAddresses, ''] 
                      }));
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105"
                  >
                    {language === 'zh' ? '添加钱包' : 'Add Wallet'}
                  </button>
                </div>
              </div>

              {/* 奖励发放地址 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === 'zh' ? '奖励发放地址' : 'Reward Distribution Address'} *
                </label>
                <input
                  type="text"
                  value={formData.rewardWalletAddress}
                  onChange={(e) => handleInputChange('rewardWalletAddress', e.target.value)}
                  required
                  className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300"
                  placeholder={language === 'zh' ? '请输入奖励发放地址' : 'Enter reward distribution address'}
                />
              </div>
            </div>

            {/* 三、声明与确认 */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-cyan-400 border-b border-cyan-500/30 pb-2">
                <span className="text-red-400 mr-2">*</span>
                {language === 'zh' ? '三、声明与确认' : '3. Declarations and Confirmations'}
              </h2>

              <div className="space-y-4">
                <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-800/30 transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={formData.rulesAccepted}
                    onChange={(e) => handleInputChange('rulesAccepted', e.target.checked)}
                    className="w-5 h-5 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 mt-0.5"
                  />
                  <span className="text-gray-300 text-sm">
                    {language === 'zh' 
                      ? '本人已阅读并理解《FlipFlop Mint大赛规则书（9月20日 – 12月31日）》'
                      : 'I have read and understood the "FlipFlop Mint Contest Rules (Sept 20 – Dec 31)"'
                    }
                  </span>
                </label>

                <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-800/30 transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={formData.infoConfirmed}
                    onChange={(e) => handleInputChange('infoConfirmed', e.target.checked)}
                    className="w-5 h-5 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 mt-0.5"
                  />
                  <span className="text-gray-300 text-sm">
                    {language === 'zh' 
                      ? '确认所提交信息真实有效，若提供虚假信息，愿承担被取消参赛资格及奖励的后果'
                      : 'Confirm that the submitted information is true and valid. If false information is provided, I am willing to bear the consequences of disqualification and reward cancellation'
                    }
                  </span>
                </label>

                <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-800/30 transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={formData.lockAccepted}
                    onChange={(e) => handleInputChange('lockAccepted', e.target.checked)}
                    className="w-5 h-5 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 mt-0.5"
                  />
                  <span className="text-gray-300 text-sm">
                    {language === 'zh' 
                      ? '同意在截止日期锁定后，所有参赛信息不可再修改'
                      : 'Agree that after the deadline lock, all contest information cannot be modified'
                    }
                  </span>
                </label>
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                  isSubmitting
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-cyan-500/25'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {language === 'zh' ? '提交中...' : 'Submitting...'}
                  </span>
                ) : (
                  `🚀 ${language === 'zh' ? '提交参赛申请' : 'Submit Application'}`
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* 成功提交弹窗 */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={language === 'zh' ? '您的个人组报名已成功提交！期待您在打狗大赛中的精彩表现！' : 'Your individual registration has been submitted successfully! Looking forward to your amazing performance in the Mint Contest!'}
        buttonText={language === 'zh' ? '返回Mint大赛' : 'Back to Mint Competition'}
        onButtonClick={() => {
          setShowSuccessModal(false);
          window.location.href = '/mint-contest';
        }}
      />
    </div>
  );
}
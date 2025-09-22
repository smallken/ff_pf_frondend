'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { launchContestService, LaunchContestRegistrationData } from '../../../services/launchContestService';

export default function LaunchRegistration() {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    tokenName: '',
    contractAddress: '',
    tokenLogo: null as File | null,
    track: '',
    customTrack: '',
    website: '',
    twitter: '',
    telegram: '',
    contactName: '',
    contactRole: '',
    contactTelegram: '',
    contactEmail: '',
    teamSize: '',
    declarations: {
      authentic: false,
      compliance: false,
      rules: false,
      tax: false,
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      if (name.startsWith('declarations.')) {
        const declarationKey = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          declarations: {
            ...prev.declarations,
            [declarationKey]: checkbox.checked
          }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, tokenLogo: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 基本验证
    if (!formData.projectName || !formData.tokenName || !formData.contractAddress || !formData.track || !formData.tokenLogo) {
      alert(language === 'zh' ? '请填写所有必填字段，包括代币Logo' : 'Please fill in all required fields, including token logo');
      return;
    }

    if (!formData.declarations.authentic || !formData.declarations.rules || !formData.declarations.compliance) {
      alert(language === 'zh' ? '请同意所有参赛声明' : 'Please agree to all contest declarations');
      return;
    }

    setIsSubmitting(true);

    try {
      // 先上传Logo文件到Vercel Blob
      let tokenLogoUrl = '';
      if (formData.tokenLogo) {
        console.log('🔄 开始上传代币Logo文件到Vercel Blob...');
        
        // 使用前端API路由上传到Vercel Blob
        const logoFormData = new FormData();
        logoFormData.append('file', formData.tokenLogo);
        logoFormData.append('biz', 'token_logo');
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: logoFormData,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '代币Logo上传失败');
        }
        
        const result = await response.json();
        tokenLogoUrl = result.url;
        console.log('✅ 代币Logo上传到Vercel Blob成功:', tokenLogoUrl);
      }

      // 准备提交数据
      const submissionData: LaunchContestRegistrationData = {
        projectName: formData.projectName,
        tokenName: formData.tokenName,
        tokenContractAddress: formData.contractAddress,
        tokenLogo: tokenLogoUrl,
        website: formData.website,
        twitter: formData.twitter,
        telegram: formData.telegram,
        contactName: formData.contactName,
        contactRole: formData.contactRole,
        contactTelegram: formData.contactTelegram,
        contactEmail: formData.contactEmail,
        teamSize: formData.teamSize,
        trackCategory: formData.track,
        otherTrackName: formData.track === 'other' ? formData.customTrack : undefined,
        declarations: JSON.stringify(formData.declarations)
      };

      // 调用后端API
      const response = await launchContestService.submitRegistration(submissionData);
      
      if (response.code === 0) {
        alert(language === 'zh' ? '参赛登记提交成功！' : 'Registration submitted successfully!');
        // 可以在这里添加跳转逻辑
        window.location.href = '/launch-contest';
      } else {
        throw new Error(response.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Registration submission error:', error);
      alert(language === 'zh' ? `提交失败：${error instanceof Error ? error.message : '未知错误'}` : `Submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tracks = [
    { value: 'rwa', label: language === 'zh' ? 'RWA赛道' : 'RWA Track' },
    { value: 'miniapps', label: language === 'zh' ? '小应用赛道' : 'Mini dApps Track' },
    { value: 'kol', label: language === 'zh' ? 'KOL赛道' : 'KOL Track' },
    { value: 'ip', label: language === 'zh' ? 'IP赛道' : 'IP Track' },
    { value: 'community', label: language === 'zh' ? '社区赛道' : 'Community Track' },
    { value: 'other', label: language === 'zh' ? '其他赛道' : 'Other Track' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
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
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            ✍️ {language === 'zh' ? '参赛登记' : 'Contest Registration'}
          </h1>
          <p className="text-xl text-gray-300">
            {language === 'zh' ? 'Flipflop Launch 大赛 - 信息收集表' : 'Flipflop Launch Contest - Registration Form'}
          </p>
        </motion.div>

        {/* 注意事项 */}
        <motion.div
          className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-yellow-400 mb-4">
            📌 {language === 'zh' ? '提交说明' : 'Submission Instructions'}
          </h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>• {language === 'zh' ? '本表需在发币完成后尽快提交，若活动截止依旧未递交会被视为未参赛' : 'This form must be submitted promptly after token issuance. Failure to submit by deadline will be considered non-participation'}</li>
            <li>• {language === 'zh' ? '所有有效信息将用于赛事沟通、社群对接与后续奖励发放' : 'All valid information will be used for contest communication, community coordination, and subsequent reward distribution'}</li>
            <li>• {language === 'zh' ? '平台将以此表为准建立专属群组，请确保 Telegram 账号可用' : 'Platform will create dedicated groups based on this form, please ensure Telegram account is available'}</li>
          </ul>
        </motion.div>

        {/* 表单 */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* 项目基础信息 */}
          <div className="bg-gradient-to-br from-gray-900/50 to-cyan-900/20 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-cyan-400 mb-6">
              📋 {language === 'zh' ? '项目基础信息' : 'Project Basic Information'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  {language === 'zh' ? '项目名称' : 'Project Name'} *
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder={language === 'zh' ? '输入项目名称' : 'Enter project name'}
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  {language === 'zh' ? '代币名称' : 'Token Name'} *
                </label>
                <input
                  type="text"
                  name="tokenName"
                  value={formData.tokenName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder={language === 'zh' ? '输入代币名称' : 'Enter token name'}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 font-medium mb-2">
                  {language === 'zh' ? '合约地址' : 'Contract Address'} *
                </label>
                <input
                  type="text"
                  name="contractAddress"
                  value={formData.contractAddress}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors font-mono text-sm"
                  placeholder={language === 'zh' ? '输入代币合约地址' : 'Enter token contract address'}
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  {language === 'zh' ? '代币Logo' : 'Token Logo'} <span className="text-red-400">*</span>
                </label>
                <input
                  type="file"
                  name="tokenLogo"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 transition-colors"
                />
                <p className="text-sm text-gray-400 mt-1">
                  {language === 'zh' ? '请上传代币Logo图片（支持JPG、PNG格式）' : 'Please upload token logo image (JPG, PNG supported)'}
                </p>
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  {language === 'zh' ? '所属赛道' : 'Track'} *
                </label>
                <select
                  name="track"
                  value={formData.track}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition-colors"
                >
                  <option value="">{language === 'zh' ? '请选择赛道' : 'Select Track'}</option>
                  {tracks.map(track => (
                    <option key={track.value} value={track.value}>{track.label}</option>
                  ))}
                </select>
              </div>

              {formData.track === 'other' && (
                <div className="md:col-span-2">
                  <label className="block text-gray-300 font-medium mb-2">
                    {language === 'zh' ? '其他赛道说明' : 'Other Track Description'}
                  </label>
                  <input
                    type="text"
                    name="customTrack"
                    value={formData.customTrack}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                    placeholder={language === 'zh' ? '请描述您的赛道类型' : 'Please describe your track type'}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 官方信息 */}
          <div className="bg-gradient-to-br from-gray-900/50 to-blue-900/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-blue-400 mb-6">
              🌐 {language === 'zh' ? '官方信息' : 'Official Information'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  {language === 'zh' ? '官网链接' : 'Website'} ({language === 'zh' ? '若无可填 N/A' : 'N/A if none'})
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  {language === 'zh' ? '官方推特账号' : 'Official Twitter'} *
                </label>
                <input
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="@username"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 font-medium mb-2">
                  {language === 'zh' ? '官方 Telegram / Discord 群组' : 'Official Telegram / Discord Group'} *
                </label>
                <input
                  type="text"
                  name="telegram"
                  value={formData.telegram}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder={language === 'zh' ? '群组链接或用户名' : 'Group link or username'}
                />
              </div>
            </div>
          </div>

          {/* 团队联系方式 */}
          <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-purple-400 mb-6">
              👥 {language === 'zh' ? '团队联系方式' : 'Team Contact Information'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  {language === 'zh' ? '主要联系人姓名/角色' : 'Primary Contact Name/Role'} *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
                  placeholder={language === 'zh' ? '张三 / CEO' : 'John Doe / CEO'}
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  {language === 'zh' ? 'Telegram 账号' : 'Telegram Account'} *
                </label>
                <input
                  type="text"
                  name="contactTelegram"
                  value={formData.contactTelegram}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  {language === 'zh' ? '邮箱' : 'Email'} *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
                  placeholder="contact@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  {language === 'zh' ? '团队规模（人数）' : 'Team Size'} *
                </label>
                <input
                  type="number"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
                  placeholder="5"
                />
              </div>
            </div>
          </div>

          {/* 参赛声明 */}
          <div className="bg-gradient-to-br from-gray-900/50 to-green-900/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-green-400 mb-6">
              ✅ {language === 'zh' ? '参赛声明' : 'Contest Declaration'}
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="declarations.authentic"
                  checked={formData.declarations.authentic}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-5 h-5 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                />
                <span className="text-gray-300">
                  {language === 'zh' 
                    ? '我们确认本项目由团队自主发起，信息真实有效'
                    : 'We confirm that this project is independently initiated by our team and all information is authentic and valid'
                  }
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="declarations.rules"
                  checked={formData.declarations.rules}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-5 h-5 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                />
                <span className="text-gray-300">
                  {language === 'zh' 
                    ? '我们同意遵守 Flipflop 平台的赛事规则与奖励机制'
                    : 'We agree to abide by Flipflop platform contest rules and reward mechanisms'
                  }
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="declarations.compliance"
                  checked={formData.declarations.compliance}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-5 h-5 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                />
                <span className="text-gray-300">
                  {language === 'zh' 
                    ? '我们确认已知晓并遵守所在司法辖区的合规与税务要求'
                    : 'We confirm awareness of and compliance with regulatory and tax requirements in our jurisdiction'
                  }
                </span>
              </label>
            </div>
          </div>

          {/* 提交按钮 */}
          <motion.div 
            className="text-center"
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-12 py-4 font-bold rounded-xl transition-all duration-300 transform text-lg ${
                isSubmitting 
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:from-cyan-400 hover:to-blue-500 hover:shadow-2xl'
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
                `🚀 ${language === 'zh' ? '提交参赛申请' : 'Submit Registration'}`
              )}
            </button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}

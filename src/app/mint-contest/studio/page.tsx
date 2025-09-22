'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { PixelButton } from '../../components/mint-contest/PixelButton';
import { PixelCard } from '../../components/mint-contest/PixelCard';
import { PixelInput } from '../../components/mint-contest/PixelInput';
import { PixelTextarea } from '../../components/mint-contest/PixelTextarea';
import { PixelSelect } from '../../components/mint-contest/PixelSelect';
import { mintContestService } from '../../../services/mintContestService';

export default function StudioPage() {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studioName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    teamSize: '',
    experience: '',
    projectTitle: '',
    projectDescription: '',
    projectCategory: '',
    projectLink: '',
    walletAddress: '',
    additionalInfo: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 基本验证
    if (!formData.studioName || !formData.contactPerson || !formData.email || !formData.projectTitle || !formData.projectDescription || !formData.projectCategory || !formData.walletAddress) {
      alert(language === 'zh' ? '请填写所有必填字段' : 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // 准备提交数据
      const submissionData = {
        category: 'studio',
        studioName: formData.studioName,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone || undefined,
        website: formData.website || undefined,
        teamSize: formData.teamSize || undefined,
        experience: formData.experience || undefined,
        projectTitle: formData.projectTitle,
        projectDescription: formData.projectDescription,
        projectCategory: formData.projectCategory,
        projectLink: formData.projectLink || undefined,
        walletAddress: formData.walletAddress,
        additionalInfo: formData.additionalInfo || undefined
      };

      // 调用后端API
      const response = await mintContestService.submitRegistration(submissionData);
      
      if (response.code === 0) {
        alert(language === 'zh' ? '工作室报名提交成功！' : 'Studio registration submitted successfully!');
        // 可以在这里添加跳转逻辑
        window.location.href = '/mint-contest';
      } else {
        throw new Error(response.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Studio registration submission error:', error);
      alert(language === 'zh' ? `提交失败：${error instanceof Error ? error.message : '未知错误'}` : `Submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectCategories = [
    { value: 'game', label: language === 'zh' ? '游戏开发' : 'Game Development' },
    { value: 'art', label: language === 'zh' ? '像素艺术' : 'Pixel Art' },
    { value: 'animation', label: language === 'zh' ? '动画制作' : 'Animation' },
    { value: 'music', label: language === 'zh' ? '音乐制作' : 'Music Production' },
    { value: 'other', label: language === 'zh' ? '其他' : 'Other' }
  ];

  const teamSizes = [
    { value: '1-5', label: '1-5 人' },
    { value: '6-10', label: '6-10 人' },
    { value: '11-20', label: '11-20 人' },
    { value: '20+', label: '20+ 人' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white py-20 px-4">
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
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-bold rounded-lg hover:from-gray-700 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 border-2 border-gray-600 hover:border-gray-500 font-mono"
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
          <h1 className="text-5xl font-bold mb-4 font-mono">
            <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              🎮 STUDIO
            </span>
          </h1>
          <p className="text-xl text-gray-300 font-mono">
            {language === 'zh' 
              ? '专业工作室参赛登记'
              : 'Professional Studio Registration'
            }
          </p>
        </motion.div>

        {/* 参赛表单 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <PixelCard>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 工作室基本信息 */}
              <div>
                <h3 className="text-2xl font-bold text-red-400 mb-4 font-mono">
                  {language === 'zh' ? '🏢 工作室信息' : '🏢 Studio Information'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-mono">
                      {language === 'zh' ? '工作室名称 *' : 'Studio Name *'}
                    </label>
                    <PixelInput
                      value={formData.studioName}
                      onChange={(e) => handleInputChange('studioName', e.target.value)}
                      placeholder={language === 'zh' ? '请输入工作室名称' : 'Enter studio name'}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2 font-mono">
                      {language === 'zh' ? '联系人 *' : 'Contact Person *'}
                    </label>
                    <PixelInput
                      value={formData.contactPerson}
                      onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                      placeholder={language === 'zh' ? '请输入联系人姓名' : 'Enter contact person name'}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2 font-mono">
                      {language === 'zh' ? '邮箱地址 *' : 'Email Address *'}
                    </label>
                    <PixelInput
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder={language === 'zh' ? '请输入邮箱地址' : 'Enter email address'}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2 font-mono">
                      {language === 'zh' ? '联系电话' : 'Phone Number'}
                    </label>
                    <PixelInput
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder={language === 'zh' ? '请输入联系电话' : 'Enter phone number'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2 font-mono">
                      {language === 'zh' ? '官方网站' : 'Official Website'}
                    </label>
                    <PixelInput
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder={language === 'zh' ? '请输入官网地址' : 'Enter website URL'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2 font-mono">
                      {language === 'zh' ? '团队规模 *' : 'Team Size *'}
                    </label>
                    <PixelSelect
                      options={teamSizes}
                      value={formData.teamSize}
                      onChange={(e) => handleInputChange('teamSize', e.target.value)}
                      placeholder={language === 'zh' ? '选择团队规模' : 'Select team size'}
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-gray-300 mb-2 font-mono">
                    {language === 'zh' ? '开发经验' : 'Development Experience'}
                  </label>
                  <PixelTextarea
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder={language === 'zh' ? '请描述工作室的开发经验和过往作品' : 'Describe studio development experience and past works'}
                    rows={3}
                  />
                </div>
              </div>

              {/* 项目信息 */}
              <div>
                <h3 className="text-2xl font-bold text-cyan-400 mb-4 font-mono">
                  {language === 'zh' ? '🎨 参赛项目' : '🎨 Contest Project'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-mono">
                      {language === 'zh' ? '项目标题 *' : 'Project Title *'}
                    </label>
                    <PixelInput
                      value={formData.projectTitle}
                      onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                      placeholder={language === 'zh' ? '请输入项目标题' : 'Enter project title'}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2 font-mono">
                      {language === 'zh' ? '项目类别 *' : 'Project Category *'}
                    </label>
                    <PixelSelect
                      options={projectCategories}
                      value={formData.projectCategory}
                      onChange={(e) => handleInputChange('projectCategory', e.target.value)}
                      placeholder={language === 'zh' ? '选择项目类别' : 'Select project category'}
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-gray-300 mb-2 font-mono">
                    {language === 'zh' ? '项目描述 *' : 'Project Description *'}
                  </label>
                  <PixelTextarea
                    value={formData.projectDescription}
                    onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                    placeholder={language === 'zh' ? '请详细描述参赛项目，包括创意理念、技术特色等' : 'Describe your contest project in detail, including creative concepts, technical features, etc.'}
                    rows={4}
                    required
                  />
                </div>
                
                <div className="mt-4">
                  <label className="block text-gray-300 mb-2 font-mono">
                    {language === 'zh' ? '项目链接' : 'Project Link'}
                  </label>
                  <PixelInput
                    value={formData.projectLink}
                    onChange={(e) => handleInputChange('projectLink', e.target.value)}
                    placeholder={language === 'zh' ? '请输入项目展示链接（如GitHub、作品集等）' : 'Enter project showcase link (GitHub, portfolio, etc.)'}
                  />
                </div>
                
                <div className="mt-4">
                  <label className="block text-gray-300 mb-2 font-mono">
                    {language === 'zh' ? '钱包地址 *' : 'Wallet Address *'}
                  </label>
                  <PixelInput
                    value={formData.walletAddress}
                    onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                    placeholder={language === 'zh' ? '请输入您的钱包地址（用于奖励发放）' : 'Enter your wallet address (for reward distribution)'}
                  />
                </div>
                
                <div className="mt-4">
                  <label className="block text-gray-300 mb-2 font-mono">
                    {language === 'zh' ? '补充信息' : 'Additional Information'}
                  </label>
                  <PixelTextarea
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    placeholder={language === 'zh' ? '其他需要说明的信息' : 'Any other information you would like to share'}
                    rows={3}
                  />
                </div>
              </div>

              {/* 提交按钮 */}
              <div className="flex justify-center pt-6">
                <PixelButton
                  type="submit"
                  variant="primary"
                  size="lg"
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
                    `🚀 ${language === 'zh' ? '提交参赛申请' : 'Submit Application'}`
                  )}
                </PixelButton>
              </div>
            </form>
          </PixelCard>
        </motion.div>
      </div>
    </div>
  );
}

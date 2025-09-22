'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { PixelCard } from '../../components/mint-contest/PixelCard';
import { PixelButton } from '../../components/mint-contest/PixelButton';

export default function MintRegistration() {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<'studio' | 'individual'>('studio');

  const handleCategorySelect = (category: 'studio' | 'individual') => {
    setSelectedCategory(category);
  };

  const handleRegister = () => {
    if (selectedCategory === 'studio') {
      window.location.href = '/mint-contest/studio';
    } else {
      window.location.href = '/mint-contest/individual';
    }
  };

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
              📝 REGISTRATION
            </span>
          </h1>
          <p className="text-xl text-gray-300 font-mono">
            {language === 'zh' 
              ? '选择参赛组别开始报名'
              : 'Choose Your Category to Start Registration'
            }
          </p>
        </motion.div>

        {/* 组别选择 */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 工作室组 */}
            <motion.div
              className={`cursor-pointer transition-all duration-300 ${
                selectedCategory === 'studio' ? 'scale-105' : 'scale-100'
              }`}
              onClick={() => handleCategorySelect('studio')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <PixelCard className={`h-full ${
                selectedCategory === 'studio' 
                  ? 'border-red-500 bg-red-900/20' 
                  : 'border-gray-600'
              }`}>
                <div className="text-center">
                  <div className="text-6xl mb-4">🎮</div>
                  <h3 className="text-2xl font-bold text-white font-mono mb-3">
                    {language === 'zh' ? '工作室组' : 'Studio Category'}
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {language === 'zh' 
                      ? '面向专业游戏工作室和开发团队，展示大型项目和完整作品。适合有完整团队和丰富开发经验的专业机构。'
                      : 'For professional game studios and development teams, showcasing large-scale projects and complete works. Suitable for professional organizations with complete teams and rich development experience.'
                    }
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-sm text-gray-300">
                        {language === 'zh' ? '团队规模：5人以上' : 'Team Size: 5+ members'}
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-sm text-gray-300">
                        {language === 'zh' ? '完整项目展示' : 'Complete project showcase'}
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-sm text-gray-300">
                        {language === 'zh' ? '专业评审标准' : 'Professional judging criteria'}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`inline-block px-6 py-3 font-mono font-bold border-4 rounded-none transition-all duration-300 ${
                    selectedCategory === 'studio'
                      ? 'bg-red-500 border-red-400 text-white'
                      : 'bg-gray-700 border-gray-500 text-gray-300'
                  }`}
                  style={{
                    boxShadow: selectedCategory === 'studio' ? '4px 4px 0px rgba(0, 0, 0, 0.3)' : 'none'
                  }}>
                    {selectedCategory === 'studio' 
                      ? (language === 'zh' ? '已选择' : 'Selected')
                      : (language === 'zh' ? '选择此组别' : 'Select This Category')
                    }
                  </div>
                </div>
              </PixelCard>
            </motion.div>

            {/* 个人组 */}
            <motion.div
              className={`cursor-pointer transition-all duration-300 ${
                selectedCategory === 'individual' ? 'scale-105' : 'scale-100'
              }`}
              onClick={() => handleCategorySelect('individual')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <PixelCard className={`h-full ${
                selectedCategory === 'individual' 
                  ? 'border-cyan-500 bg-cyan-900/20' 
                  : 'border-gray-600'
              }`}>
                <div className="text-center">
                  <div className="text-6xl mb-4">👤</div>
                  <h3 className="text-2xl font-bold text-white font-mono mb-3">
                    {language === 'zh' ? '个人组' : 'Individual Category'}
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {language === 'zh' 
                      ? '面向独立开发者和个人创作者，展示创意作品和独特想法。适合个人艺术家、独立开发者和创意爱好者。'
                      : 'For independent developers and individual creators, showcasing creative works and unique ideas. Suitable for individual artists, independent developers, and creative enthusiasts.'
                    }
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-sm text-gray-300">
                        {language === 'zh' ? '个人或小团队' : 'Individual or small team'}
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-sm text-gray-300">
                        {language === 'zh' ? '创意作品展示' : 'Creative work showcase'}
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-sm text-gray-300">
                        {language === 'zh' ? '灵活评审标准' : 'Flexible judging criteria'}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`inline-block px-6 py-3 font-mono font-bold border-4 rounded-none transition-all duration-300 ${
                    selectedCategory === 'individual'
                      ? 'bg-cyan-500 border-cyan-400 text-white'
                      : 'bg-gray-700 border-gray-500 text-gray-300'
                  }`}
                  style={{
                    boxShadow: selectedCategory === 'individual' ? '4px 4px 0px rgba(0, 0, 0, 0.3)' : 'none'
                  }}>
                    {selectedCategory === 'individual' 
                      ? (language === 'zh' ? '已选择' : 'Selected')
                      : (language === 'zh' ? '选择此组别' : 'Select This Category')
                    }
                  </div>
                </div>
              </PixelCard>
            </motion.div>
          </div>
        </motion.div>

        {/* 重要提示 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <PixelCard>
            <div className="text-center">
              <h3 className="text-xl font-bold text-yellow-400 font-mono mb-4">
                {language === 'zh' ? '⚠️ 重要提示' : '⚠️ Important Notice'}
              </h3>
              <div className="space-y-3 text-gray-300">
                <p>
                  {language === 'zh' 
                    ? '请仔细阅读大赛规则，确保您的作品符合参赛要求。'
                    : 'Please read the contest rules carefully to ensure your work meets the requirements.'
                  }
                </p>
                <p>
                  {language === 'zh' 
                    ? '每个参赛者/工作室最多可以提交3个作品。'
                    : 'Each contestant/studio can submit a maximum of 3 works.'
                  }
                </p>
                <p>
                  {language === 'zh' 
                    ? '报名截止时间：2024年1月31日 23:59'
                    : 'Registration deadline: January 31, 2024 23:59'
                  }
                </p>
              </div>
            </div>
          </PixelCard>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div
          className="flex justify-center space-x-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <PixelButton
            variant="primary"
            size="lg"
            onClick={handleRegister}
          >
            🚀 {language === 'zh' ? '开始报名' : 'Start Registration'}
          </PixelButton>
          
          <PixelButton
            variant="secondary"
            size="lg"
            onClick={() => window.location.href = '/mint-contest/rules'}
          >
            📜 {language === 'zh' ? '查看规则' : 'View Rules'}
          </PixelButton>
        </motion.div>
      </div>
    </div>
  );
}

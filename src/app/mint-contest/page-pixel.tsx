'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/reactbits/ButtonSimple';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/reactbits/Card';

export default function MintContestPixel() {
  const router = useRouter();
  const { language } = useLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // 鼠标跟踪效果
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCardClick = (href: string) => {
    router.push(href);
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `
          linear-gradient(45deg, #2d3436 25%, transparent 25%),
          linear-gradient(-45deg, #2d3436 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #2d3436 75%),
          linear-gradient(-45deg, transparent 75%, #2d3436 75%)
        `,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        backgroundColor: '#636e72'
      }}
    >
      {/* 像素风格背景装饰 */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-[#ff6b6b]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* 鼠标跟随像素光标 */}
      <div 
        className="absolute w-8 h-8 bg-[#4ecdc4] border-2 border-black pointer-events-none z-50"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
          imageRendering: 'pixelated',
        }}
      />

      <div className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* 返回按钮 */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button
              onClick={() => router.push('/')}
              variant="pixel"
              animated
              className="text-lg"
            >
              🏠 {language === 'zh' ? '返回港湾' : 'Back to PathPort'}
            </Button>
          </motion.div>

          {/* 主标题区域 */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1 
              className="text-7xl md:text-9xl font-bold mb-6"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              style={{
                fontFamily: 'monospace',
                textShadow: '4px 4px 0px #000',
                imageRendering: 'pixelated'
              }}
            >
              <span className="text-[#ff6b6b]">MINT</span>
            </motion.h1>
            <motion.h2 
              className="text-3xl md:text-5xl font-bold text-[#4ecdc4] mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{
                fontFamily: 'monospace',
                textShadow: '2px 2px 0px #000'
              }}
            >
              {language === 'zh' ? '像素艺术大赛' : 'Pixel Art Contest'}
            </motion.h2>
            <motion.p 
              className="text-xl md:text-2xl text-white max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              style={{
                fontFamily: 'monospace',
                textShadow: '1px 1px 0px #000'
              }}
            >
              {language === 'zh' 
                ? '复古像素艺术创作平台，展现你的创意和艺术天赋。'
                : 'Retro pixel art creation platform, showcase your creativity and artistic talent.'
              }
            </motion.p>
          </motion.div>

          {/* 像素风格卡片展示 */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card 
                variant="pixel" 
                animated 
                hover
                className="cursor-pointer"
                onClick={() => handleCardClick('/mint-contest/studio')}
              >
                <CardHeader>
                  <CardTitle className="text-black text-2xl flex items-center gap-3">
                    🎮 {language === 'zh' ? '工作室组' : 'Studio Group'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-black/80 text-lg">
                    {language === 'zh' 
                      ? '专业工作室团队参赛，展示团队协作和专业技能'
                      : 'Professional studio teams showcase collaboration and expertise'
                    }
                  </CardDescription>
                  <div className="mt-4 text-black font-bold">
                    {language === 'zh' ? '点击进入 →' : 'Click to Enter →'}
                  </div>
                </CardContent>
              </Card>

              <Card 
                variant="pixel" 
                animated 
                hover
                className="cursor-pointer"
                onClick={() => handleCardClick('/mint-contest/individual')}
              >
                <CardHeader>
                  <CardTitle className="text-black text-2xl flex items-center gap-3">
                    👤 {language === 'zh' ? '个人组' : 'Individual Group'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-black/80 text-lg">
                    {language === 'zh' 
                      ? '个人创作者参赛，展现独特的艺术风格和创意'
                      : 'Individual creators showcase unique artistic style and creativity'
                    }
                  </CardDescription>
                  <div className="mt-4 text-black font-bold">
                    {language === 'zh' ? '点击进入 →' : 'Click to Enter →'}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* 特色功能展示 */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Card variant="pixel" className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-black text-3xl text-center">
                  ✨ {language === 'zh' ? '特色功能' : 'Special Features'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl mb-3">🎨</div>
                    <h4 className="text-xl font-bold text-black mb-2">
                      {language === 'zh' ? '像素艺术工具' : 'Pixel Art Tools'}
                    </h4>
                    <p className="text-black/80">
                      {language === 'zh' ? '专业的像素艺术创作工具' : 'Professional pixel art creation tools'}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-3">🏆</div>
                    <h4 className="text-xl font-bold text-black mb-2">
                      {language === 'zh' ? '竞赛奖励' : 'Contest Rewards'}
                    </h4>
                    <p className="text-black/80">
                      {language === 'zh' ? '丰厚的奖励和认可' : 'Generous rewards and recognition'}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-3">🌐</div>
                    <h4 className="text-xl font-bold text-black mb-2">
                      {language === 'zh' ? '社区展示' : 'Community Showcase'}
                    </h4>
                    <p className="text-black/80">
                      {language === 'zh' ? '作品在社区中展示' : 'Showcase works in the community'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 行动按钮 */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <Button
              onClick={() => handleCardClick('/mint-contest/registration')}
              variant="pixel"
              size="lg"
              animated
              className="text-lg px-8 py-4"
            >
              🎮 {language === 'zh' ? '开始创作' : 'Start Creating'}
            </Button>
            
            <Button
              onClick={() => handleCardClick('/mint-contest/gallery')}
              variant="pixel"
              size="lg"
              animated
              className="text-lg px-8 py-4"
            >
              🖼️ {language === 'zh' ? '作品画廊' : 'Gallery'}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

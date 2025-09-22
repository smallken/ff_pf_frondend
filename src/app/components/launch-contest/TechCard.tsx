'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TechCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  glowColor?: 'cyan' | 'purple' | 'pink' | 'blue';
}

export const TechCard: React.FC<TechCardProps> = ({
  children,
  className = '',
  onClick,
  hover = true,
  glowColor = 'cyan'
}) => {
  const getGlowColor = () => {
    switch (glowColor) {
      case 'cyan':
        return 'shadow-cyan-500/20 border-cyan-500/30';
      case 'purple':
        return 'shadow-purple-500/20 border-purple-500/30';
      case 'pink':
        return 'shadow-pink-500/20 border-pink-500/30';
      case 'blue':
        return 'shadow-blue-500/20 border-blue-500/30';
      default:
        return 'shadow-cyan-500/20 border-cyan-500/30';
    }
  };

  return (
    <motion.div
      className={`
        relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl
        border border-gray-700/50 rounded-2xl overflow-hidden
        ${getGlowColor()}
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      whileHover={hover ? { 
        scale: 1.02,
        boxShadow: '0 25px 50px rgba(0, 242, 254, 0.15)'
      } : {}}
      whileTap={hover ? { scale: 0.98 } : {}}
      style={{
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* 背景网格效果 */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 242, 254, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 242, 254, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* 边框光效 */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {/* 内容 */}
      <div className="relative z-10 p-6">
        {children}
      </div>
      
      {/* 底部光条 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-60" />
    </motion.div>
  );
};

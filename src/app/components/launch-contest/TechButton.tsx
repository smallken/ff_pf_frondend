'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface TechButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  showArrow?: boolean;
}

export const TechButton: React.FC<TechButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon,
  showArrow = false
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-cyan-500/25';
      case 'secondary':
        return 'bg-gradient-to-r from-purple-500 to-pink-600 text-white border-purple-400 shadow-purple-500/25';
      case 'accent':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-yellow-400 shadow-yellow-500/25';
      default:
        return 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-cyan-500/25';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'md':
        return 'px-6 py-3 text-base';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  return (
    <motion.button
      className={`
        relative font-semibold rounded-lg border-2 backdrop-blur-sm
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { 
        scale: 1.05,
        boxShadow: '0 20px 40px rgba(0, 242, 254, 0.3)'
      }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      disabled={disabled}
      style={{
        boxShadow: '0 10px 30px rgba(0, 242, 254, 0.2)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* 背景光效 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      
      {/* 内容 */}
      <div className="relative z-10 flex items-center justify-center space-x-2">
        {icon && <span className="text-lg">{icon}</span>}
        <span>{children}</span>
        {showArrow && (
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </motion.div>
        )}
      </div>
      
      {/* 边框光效 */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 via-transparent to-blue-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  );
};

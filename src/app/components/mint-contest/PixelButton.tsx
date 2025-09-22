'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PixelButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = ''
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-red-500 border-red-400 text-white hover:bg-red-400 hover:border-red-300';
      case 'secondary':
        return 'bg-cyan-500 border-cyan-400 text-white hover:bg-cyan-400 hover:border-cyan-300';
      case 'accent':
        return 'bg-yellow-500 border-yellow-400 text-black hover:bg-yellow-400 hover:border-yellow-300';
      default:
        return 'bg-red-500 border-red-400 text-white hover:bg-red-400 hover:border-red-300';
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
      type={type}
      className={`
        relative font-mono font-bold border-4 rounded-none
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      disabled={disabled}
      style={{
        boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.1s ease'
      }}
    >
      <span className="relative z-10">{children}</span>
      
      {/* 像素化阴影效果 */}
      <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-200" />
    </motion.button>
  );
};

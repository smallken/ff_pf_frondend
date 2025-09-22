'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const PixelCard: React.FC<PixelCardProps> = ({
  children,
  className = '',
  onClick,
  hover = true
}) => {
  return (
    <motion.div
      className={`
        relative bg-gray-800 border-4 border-gray-600 rounded-none
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02 } : {}}
      whileTap={hover ? { scale: 0.98 } : {}}
      style={{
        boxShadow: '8px 8px 0px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.2s ease'
      }}
    >
      {/* 像素化边框效果 */}
      <div className="absolute -top-1 -left-1 w-full h-full bg-gradient-to-br from-red-500 via-cyan-500 to-yellow-500 opacity-0 hover:opacity-20 transition-opacity duration-300" />
      
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
};

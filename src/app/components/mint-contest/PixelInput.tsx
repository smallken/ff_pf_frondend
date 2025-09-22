'use client';

import React from 'react';

interface PixelInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export const PixelInput: React.FC<PixelInputProps> = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
  disabled = false,
  required = false
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`
        w-full px-4 py-3 bg-gray-800 border-4 border-gray-600 rounded-none
        text-white font-mono placeholder-gray-400
        focus:border-cyan-400 focus:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      style={{
        boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.2s ease'
      }}
    />
  );
};

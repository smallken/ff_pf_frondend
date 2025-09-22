'use client';

import React from 'react';

interface PixelTextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
}

export const PixelTextarea: React.FC<PixelTextareaProps> = ({
  placeholder = '',
  value,
  onChange,
  className = '',
  disabled = false,
  required = false,
  rows = 4
}) => {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      rows={rows}
      className={`
        w-full px-4 py-3 bg-gray-800 border-4 border-gray-600 rounded-none
        text-white font-mono placeholder-gray-400 resize-none
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

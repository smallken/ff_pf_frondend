'use client';

import React from 'react';

interface PixelSelectProps {
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
}

export const PixelSelect: React.FC<PixelSelectProps> = ({
  options,
  value,
  onChange,
  className = '',
  disabled = false,
  required = false,
  placeholder = '请选择...'
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`
        w-full px-4 py-3 bg-gray-800 border-4 border-gray-600 rounded-none
        text-white font-mono
        focus:border-cyan-400 focus:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      style={{
        boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.2s ease'
      }}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-gray-800 text-white">
          {option.label}
        </option>
      ))}
    </select>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import countries from 'world-countries';

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  language: 'zh' | 'en';
  className?: string;
}

// 国家中文翻译映射
const countryTranslations: { [key: string]: string } = {
  'China': '中国',
  'United States': '美国',
  'Japan': '日本',
  'South Korea': '韩国',
  'Singapore': '新加坡',
  'United Kingdom': '英国',
  'Canada': '加拿大',
  'Australia': '澳大利亚',
  'Germany': '德国',
  'France': '法国',
  'India': '印度',
  'Brazil': '巴西',
  'Russia': '俄罗斯',
  'Italy': '意大利',
  'Spain': '西班牙',
  'Netherlands': '荷兰',
  'Switzerland': '瑞士',
  'Sweden': '瑞典',
  'Poland': '波兰',
  'Turkey': '土耳其',
  'Mexico': '墨西哥',
  'Indonesia': '印度尼西亚',
  'Thailand': '泰国',
  'Vietnam': '越南',
  'Philippines': '菲律宾',
  'Malaysia': '马来西亚',
  'Hong Kong': '中国香港',
  'Taiwan': '中国台湾',
  'United Arab Emirates': '阿联酋',
  'Saudi Arabia': '沙特阿拉伯',
  'Israel': '以色列',
  'South Africa': '南非',
  'Egypt': '埃及',
  'Argentina': '阿根廷',
  'Chile': '智利',
  'Colombia': '哥伦比亚',
  'Peru': '秘鲁',
  'Belgium': '比利时',
  'Austria': '奥地利',
  'Denmark': '丹麦',
  'Norway': '挪威',
  'Finland': '芬兰',
  'Portugal': '葡萄牙',
  'Greece': '希腊',
  'Czech Republic': '捷克',
  'Romania': '罗马尼亚',
  'Hungary': '匈牙利',
  'New Zealand': '新西兰',
  'Ireland': '爱尔兰',
  'Pakistan': '巴基斯坦',
  'Bangladesh': '孟加拉国',
  'Nigeria': '尼日利亚',
  'Kenya': '肯尼亚',
  'Ukraine': '乌克兰',
  'Kazakhstan': '哈萨克斯坦',
  'Myanmar': '缅甸',
  'Cambodia': '柬埔寨',
  'Laos': '老挝',
  'Mongolia': '蒙古',
  'North Korea': '朝鲜',
  'Sri Lanka': '斯里兰卡',
  'Nepal': '尼泊尔',
  'Afghanistan': '阿富汗',
  'Iran': '伊朗',
  'Iraq': '伊拉克',
  'Jordan': '约旦',
  'Lebanon': '黎巴嫩',
  'Kuwait': '科威特',
  'Qatar': '卡塔尔',
  'Bahrain': '巴林',
  'Oman': '阿曼',
  'Yemen': '也门',
  'Syria': '叙利亚',
};

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange, language, className }) => {
  // 准备国家选项
  const countryOptions = countries
    .map(country => {
      const englishName = country.name.common;
      const chineseName = countryTranslations[englishName] || englishName;
      
      return {
        value: englishName,
        label: language === 'zh' ? chineseName : englishName,
        searchLabel: `${englishName} ${chineseName}`, // 用于搜索
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label, language === 'zh' ? 'zh-CN' : 'en'));

  // 找到当前选中的选项
  const selectedOption = countryOptions.find(option => option.value === value) || null;

  // 自定义样式
  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: '42px',
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      '&:hover': {
        borderColor: '#3b82f6',
      },
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
    }),
    menu: (base: any) => ({
      ...base,
      zIndex: 50,
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#e5e7eb' : 'white',
      color: state.isSelected ? 'white' : '#111827',
      '&:active': {
        backgroundColor: '#3b82f6',
      },
    }),
  };

  // Dark mode 样式
  const darkModeStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: '42px',
      backgroundColor: '#374151',
      borderColor: state.isFocused ? '#3b82f6' : '#4b5563',
      '&:hover': {
        borderColor: '#3b82f6',
      },
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
    }),
    singleValue: (base: any) => ({
      ...base,
      color: 'white',
    }),
    input: (base: any) => ({
      ...base,
      color: 'white',
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: '#374151',
      zIndex: 50,
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#4b5563' : '#374151',
      color: 'white',
      '&:active': {
        backgroundColor: '#3b82f6',
      },
    }),
  };

  // 检测是否为暗色模式
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDarkMode(darkModeQuery.matches);

      // 监听暗色模式变化
      const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
      darkModeQuery.addEventListener('change', handleChange);
      
      return () => darkModeQuery.removeEventListener('change', handleChange);
    }
  }, []);

  return (
    <Select
      value={selectedOption}
      onChange={(option) => onChange(option?.value || '')}
      options={countryOptions}
      styles={isDarkMode ? darkModeStyles : customStyles}
      placeholder={language === 'zh' ? '搜索或选择国家/地区...' : 'Search or select a country/region...'}
      isSearchable
      isClearable
      className={className}
      filterOption={(option, inputValue) => {
        // 支持中英文搜索
        return option.data.searchLabel.toLowerCase().includes(inputValue.toLowerCase());
      }}
    />
  );
};

export default CountrySelect;

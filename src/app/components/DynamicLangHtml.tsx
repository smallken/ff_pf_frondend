'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { useEffect } from 'react';

export default function DynamicLangHtml() {
  const { language } = useLanguage();

  useEffect(() => {
    // Update the html lang attribute based on current language
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en-US';
  }, [language]);

  return null; // This component doesn't render anything visible
}
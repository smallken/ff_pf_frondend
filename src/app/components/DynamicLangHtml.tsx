'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { useEffect } from 'react';

export default function DynamicLangHtml() {
  const { language } = useLanguage();

  useEffect(() => {
    // Update the html lang attribute based on current language
    const locale = language === 'zh' ? 'zh-CN' : 'en-US';
    document.documentElement.lang = locale;
    
    // Try to set additional locale properties
    try {
      // Set document locale for form controls
      if ('locale' in document.documentElement) {
        (document.documentElement as any).locale = locale;
      }
      
      // Force re-render of all date inputs by temporarily hiding and showing them
      const dateInputs = document.querySelectorAll('input[type="date"], input[type="datetime-local"]');
      dateInputs.forEach((input) => {
        const element = input as HTMLInputElement;
        const currentValue = element.value;
        element.style.display = 'none';
        setTimeout(() => {
          element.style.display = '';
          element.value = currentValue;
        }, 0);
      });
    } catch (error) {
      console.log('Could not update locale properties:', error);
    }
  }, [language]);

  return null; // This component doesn't render anything visible
}
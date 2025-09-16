'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface CustomDateInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
  required?: boolean;
  className?: string;
  type?: 'date' | 'datetime-local';
}

export default function CustomDateInput({
  id,
  name,
  value,
  onChange,
  required = false,
  className = '',
  type = 'date'
}: CustomDateInputProps) {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Format display value based on language
  const formatDisplayValue = (dateValue: string) => {
    if (!dateValue) return '';
    
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return dateValue;

      if (type === 'datetime-local') {
        if (language === 'zh') {
          return `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, '0')}月${date.getDate().toString().padStart(2, '0')}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        } else {
          return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        }
      } else {
        if (language === 'zh') {
          return `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, '0')}月${date.getDate().toString().padStart(2, '0')}日`;
        } else {
          return date.toLocaleDateString('en-US');
        }
      }
    } catch {
      return dateValue;
    }
  };

  // Update display value when value or language changes
  useEffect(() => {
    setInputValue(formatDisplayValue(value));
  }, [value, language, type]);

  const handleInputClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
    
    if (!inputRef.current) return;
    
    // Get the position of the current input field
    const rect = inputRef.current.getBoundingClientRect();
    
    // Create hidden native input for date picker positioned next to the visible input
    const hiddenInput = document.createElement('input');
    hiddenInput.type = type;
    hiddenInput.value = value;
    hiddenInput.style.position = 'fixed';
    hiddenInput.style.left = `${rect.left}px`;
    hiddenInput.style.top = `${rect.top}px`;
    hiddenInput.style.width = `${rect.width}px`;
    hiddenInput.style.height = `${rect.height}px`;
    hiddenInput.style.opacity = '0';
    hiddenInput.style.pointerEvents = 'none';
    hiddenInput.style.zIndex = '9999';
    // Set locale for date picker
    hiddenInput.setAttribute('lang', language === 'zh' ? 'zh-CN' : 'en-US');
    // Set required attribute to match the original input
    if (required) {
      hiddenInput.required = true;
    }
    document.body.appendChild(hiddenInput);
    
    // Add event listeners
    const cleanup = () => {
      setIsOpen(false);
      if (document.body.contains(hiddenInput)) {
        document.body.removeChild(hiddenInput);
      }
    };
    
    hiddenInput.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      onChange({ target: { name, value: target.value } });
      cleanup();
    });

    hiddenInput.addEventListener('blur', cleanup);
    
    // Add click outside listener
    const handleClickOutside = (event: MouseEvent) => {
      if (!hiddenInput.contains(event.target as Node) && !inputRef.current?.contains(event.target as Node)) {
        cleanup();
        document.removeEventListener('click', handleClickOutside);
      }
    };
    
    // Use setTimeout to avoid immediate cleanup
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);

    // Trigger the native date picker immediately (must be in direct response to user gesture)
    try {
      hiddenInput.showPicker?.();
    } catch (error) {
      // Fallback if showPicker fails - just focus the input
      hiddenInput.click();
      hiddenInput.focus();
    }
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setInputValue(inputVal);
    
    // Try to parse and convert to standard format
    try {
      let dateStr = '';
      if (type === 'datetime-local') {
        // Handle various datetime input formats
        if (language === 'zh') {
          // Parse Chinese format: 2024年01月15日 14:30
          const match = inputVal.match(/(\d{4})年(\d{2})月(\d{2})日\s*(\d{2}):(\d{2})/);
          if (match) {
            dateStr = `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}`;
          }
        } else {
          // Parse English formats
          const date = new Date(inputVal);
          if (!isNaN(date.getTime())) {
            dateStr = date.toISOString().slice(0, 16);
          }
        }
      } else {
        // Handle date only formats
        if (language === 'zh') {
          // Parse Chinese format: 2024年01月15日
          const match = inputVal.match(/(\d{4})年(\d{2})月(\d{2})日/);
          if (match) {
            dateStr = `${match[1]}-${match[2]}-${match[3]}`;
          }
        } else {
          // Parse English formats
          const date = new Date(inputVal);
          if (!isNaN(date.getTime())) {
            dateStr = date.toISOString().slice(0, 10);
          }
        }
      }
      
      if (dateStr) {
        onChange({ target: { name, value: dateStr } });
      }
    } catch {
      // If parsing fails, just update the display value
    }
  };

  const placeholder = type === 'datetime-local' 
    ? (language === 'zh' ? '请选择日期和时间' : 'Select date and time')
    : (language === 'zh' ? '请选择日期' : 'Select date');

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        id={id}
        name={name}
        required={required}
        className={`${className} cursor-pointer`}
        value={inputValue}
        onChange={handleManualInput}
        onClick={handleInputClick}
        placeholder={placeholder}
        readOnly={false}
      />
      <div 
        className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"
      >
        📅
      </div>
    </div>
  );
}

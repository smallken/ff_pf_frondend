'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import type { KeyboardEvent, SyntheticEvent } from 'react';
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
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return new Date();
  });
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const containerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const placeholder = useMemo(() => {
    if (type === 'datetime-local') {
      return t('forms.datepicker.placeholder.datetime');
    }
    return t('forms.datepicker.placeholder.date');
  }, [t, type, language]);

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

  useEffect(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        setViewDate(parsed);
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const container = containerRef.current;
      const calendarEl = calendarRef.current;
      if (!container) return;

      const inputEl = container.querySelector('input');
      if (!inputEl) return;

      const rect = inputEl.getBoundingClientRect();
      const calendarHeight = calendarEl?.offsetHeight ?? 320;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < calendarHeight && spaceAbove > spaceBelow) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    };

    const raf = requestAnimationFrame(updatePosition);

    window.addEventListener('resize', updatePosition);
    // capture scroll events from ancestors as well
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen]);

  const monthNames = useMemo(
    () => t('forms.datepicker.months').split(',').map((name) => name.trim()),
    [t, language]
  );
  const weekdayNames = useMemo(
    () => t('forms.datepicker.weekdays').split(',').map((name) => name.trim()),
    [t, language]
  );
  const clearText = t('forms.datepicker.clear');
  const todayText = t('forms.datepicker.today');

  const openPicker = () => {
    setIsOpen(true);
  };

  const closePicker = () => {
    setIsOpen(false);
  };

  const handleInputInteraction = (event: SyntheticEvent<HTMLInputElement>) => {
    event.preventDefault();
    openPicker();
  };

  const handleDateSelect = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const base = `${year}-${month}-${day}`;
    const formatted = type === 'datetime-local' ? `${base}T00:00` : base;
    onChange({ target: { name, value: formatted } });
    closePicker();
  };

  const handleClear = () => {
    onChange({ target: { name, value: '' } });
    closePicker();
  };

  const handleToday = () => {
    const today = new Date();
    handleDateSelect(today);
    setViewDate(today);
  };

  const goToPreviousMonth = () => {
    setViewDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(1);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setViewDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(1);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarCells: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) {
      calendarCells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      calendarCells.push(new Date(year, month, day));
    }

    while (calendarCells.length % 7 !== 0) {
      calendarCells.push(null);
    }

    const today = new Date();
    const selectedDate = value ? new Date(value) : null;

    const positionClasses =
      dropdownPosition === 'top'
        ? 'bottom-full mb-2'
        : 'top-full mt-2';

    return (
      <div
        ref={calendarRef}
        className={`absolute left-0 ${positionClasses} w-72 sm:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 p-4 animate-fadeIn`}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={goToPreviousMonth}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Previous month"
          >
            ‹
          </button>
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {monthNames[month]} {year}
          </div>
          <button
            type="button"
            onClick={goToNextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Next month"
          >
            ›
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
          {weekdayNames.map((weekday) => (
            <div key={weekday} className="text-center uppercase tracking-wide">
              {weekday}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 text-sm">
          {calendarCells.map((cellDate, index) => {
            if (!cellDate) {
              return <div key={`empty-${index}`} />;
            }

            const isToday =
              cellDate.getFullYear() === today.getFullYear() &&
              cellDate.getMonth() === today.getMonth() &&
              cellDate.getDate() === today.getDate();

            const isSelected = selectedDate &&
              cellDate.getFullYear() === selectedDate.getFullYear() &&
              cellDate.getMonth() === selectedDate.getMonth() &&
              cellDate.getDate() === selectedDate.getDate();

            return (
              <button
                type="button"
                key={cellDate.toISOString()}
                onClick={() => handleDateSelect(cellDate)}
                className={`h-9 flex items-center justify-center rounded-lg transition-colors duration-150
                  ${isSelected ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                  ${isToday && !isSelected ? 'border border-emerald-400' : ''}`}
              >
                {cellDate.getDate()}
              </button>
            );
          })}
        </div>
        <div className="flex justify-between items-center mt-4 text-sm">
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
          >
            {clearText}
          </button>
          <button
            type="button"
            onClick={handleToday}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {todayText}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        id={id}
        name={name}
        required={required}
        className={`${className} cursor-pointer`}
        value={inputValue}
        placeholder={placeholder}
        readOnly
        onFocus={() => {
          setIsOpen(true);
        }}
        onBlur={() => {
          // Delay closing to allow click handler to run
          setTimeout(() => {
            setIsOpen(false);
          }, 100);
        }}
        onClick={handleInputInteraction}
        onTouchEnd={handleInputInteraction}
        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openPicker();
          }
        }}
      />
      <div
        className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"
      >
        📅
      </div>
      {isOpen && renderCalendar()}
    </div>
  );
}

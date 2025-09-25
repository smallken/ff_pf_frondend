'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ModuleType = 'pathport' | 'footprint' | 'launch' | 'mint';

interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  border: string;
}

interface ModuleContextType {
  currentModule: ModuleType;
  setModule: (module: ModuleType) => void;
  getTheme: () => ThemeConfig;
}

const themes: Record<ModuleType, ThemeConfig> = {
  pathport: {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#4facfe',
    background: '#f8fafc',
    surface: 'rgba(255, 255, 255, 0.1)',
    text: '#1a202c',
    border: '#e2e8f0'
  },
  footprint: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#06B6D4',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1a202c',
    border: '#e2e8f0'
  },
  launch: {
    primary: '#00ffff',
    secondary: '#ff00ff',
    accent: '#ffff00',
    background: '#0a0a0f',
    surface: '#1a1a2e',
    text: '#ffffff',
    border: '#16213e'
  },
  mint: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    accent: '#ffe66d',
    background: '#2d3436',
    surface: '#636e72',
    text: '#ddd',
    border: '#74b9ff'
  }
};

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

interface ModuleProviderProps {
  children: ReactNode;
}

export const ModuleProvider: React.FC<ModuleProviderProps> = ({ children }) => {
  const [currentModule, setCurrentModule] = useState<ModuleType>('pathport');

  const setModule = (module: ModuleType) => {
    setCurrentModule(module);
    // 更新CSS变量
    const theme = themes[module];
    const root = document.documentElement;
    
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}-color`, value);
    });
  };

  const getTheme = (): ThemeConfig => {
    return themes[currentModule];
  };

  // 根据路径自动设置模块
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/footprint')) {
      setModule('footprint');
    } else if (path.startsWith('/launch-contest')) {
      setModule('launch');
    } else if (path.startsWith('/mint-contest')) {
      setModule('mint');
    } else {
      setModule('pathport');
    }
  }, []);

  const value: ModuleContextType = {
    currentModule,
    setModule,
    getTheme,
  };

  return (
    <ModuleContext.Provider value={value}>
      {children}
    </ModuleContext.Provider>
  );
};

export const useModule = (): ModuleContextType => {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error('useModule must be used within a ModuleProvider');
  }
  return context;
};

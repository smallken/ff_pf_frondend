'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import DynamicLangHtml from './DynamicLangHtml';
import { ThemeProvider } from '../contexts/ThemeContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AuthProvider } from '../../contexts/AuthContext';
import { ModuleProvider } from '../../contexts/ModuleContext';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // 如果是维护页面，不显示Header和其他组件
  if (pathname === '/maintenance') {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }
  
  // 其他页面正常显示Header和所有组件
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ModuleProvider>
            <DynamicLangHtml />
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
          </ModuleProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

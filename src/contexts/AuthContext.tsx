'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userService } from '@/services';
import type { LoginUserVO } from '@/types/api';

interface AuthContextType {
  user: LoginUserVO | null;
  loading: boolean;
  login: (userAccount: string, userPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<LoginUserVO>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<LoginUserVO | null>(null);
  const [loading, setLoading] = useState(true);

  // 检查用户是否已登录
  const checkAuth = async () => {
    try {
      const userData = await userService.getLoginUser();
      setUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 登录
  const login = async (userAccount: string, userPassword: string) => {
    try {
      const userData = await userService.login({ userAccount, userPassword });
      setUser(userData);
      // 这里可以保存token到localStorage，具体根据后端实现
      // localStorage.setItem('token', userData.token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // 登出
  const logout = async () => {
    try {
      await userService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  // 更新用户信息
  const updateUser = (userData: Partial<LoginUserVO>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  // 组件挂载时检查认证状态
  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

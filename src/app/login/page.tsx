'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import PasswordInput from '../components/PasswordInput';

export default function Login() {
  const { t } = useLanguage();
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    userAccount: '',
    userPassword: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  // 检查用户是否已登录
  useEffect(() => {
    if (!loading && isAuthenticated) {
      // 如果已登录，重定向到首页
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    try {
      await login(formData.userAccount, formData.userPassword);
      router.push('/'); // 登录成功后跳转到首页
    } catch (error: any) {
      console.log('❌ 登录失败:', error);
      setError(error.message || '登录失败，请检查账号密码');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 如果正在加载认证状态，显示加载中
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">检查登录状态中...</p>
        </div>
      </div>
    );
  }

  // 如果已登录，显示已登录状态
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">已登录</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">您已经登录，正在跳转到首页...</p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('login.page.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            {t('login.page.subtitle')}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
              <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="userAccount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('login.form.account')}
              </label>
              <input
                id="userAccount"
                name="userAccount"
                type="email"
                required
                disabled={submitLoading}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={t('login.form.account.placeholder')}
                value={formData.userAccount}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="userPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('login.form.password')}
              </label>
              <PasswordInput
                id="userPassword"
                name="userPassword"
                value={formData.userPassword}
                onChange={handleChange}
                placeholder={t('login.form.password.placeholder')}
                required
                disabled={submitLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={submitLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  登录中...
                </div>
              ) : (
                t('login.form.submit')
              )}
            </button>
          </div>

          <div className="text-center">
            <a href="/register" className="text-blue-600 hover:text-blue-500 text-sm">
              {t('login.form.register.link')}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
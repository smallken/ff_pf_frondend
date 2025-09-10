'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Login() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    userAccount: '',
    userPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 这里调用后端登录接口
    console.log('登录数据:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
          <div className="space-y-4">
            <div>
              <label htmlFor="userAccount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('login.form.account')}
              </label>
              <input
                id="userAccount"
                name="userAccount"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('login.form.account.placeholder')}
                value={formData.userAccount}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="userPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('login.form.password')}
              </label>
              <input
                id="userPassword"
                name="userPassword"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('login.form.password.placeholder')}
                value={formData.userPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('login.form.submit')}
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
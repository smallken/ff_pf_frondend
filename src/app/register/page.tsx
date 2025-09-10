'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Register() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    userEmail: '',
    userPassword: '',
    checkPassword: '',
    userName: '',
    twitterHandle: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateTwitterHandle = (handle: string): boolean => {
    // Twitter username validation: 1-15 characters, alphanumeric and underscore only
    const twitterRegex = /^[a-zA-Z0-9_]{1,15}$/;
    return twitterRegex.test(handle);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.twitterHandle.trim()) {
      newErrors.twitterHandle = t('register.twitter.required');
    } else if (!validateTwitterHandle(formData.twitterHandle.trim())) {
      newErrors.twitterHandle = t('register.twitter.invalid');
    }
    
    if (formData.userPassword !== formData.checkPassword) {
      newErrors.checkPassword = '密码不一致';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // 这里调用后端注册接口
      console.log('注册数据:', formData);
    }
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
            {t('register.page.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            {t('register.page.subtitle')}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('register.form.username')}
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('register.form.username.placeholder')}
                value={formData.userName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('register.form.email')}
              </label>
              <input
                id="userEmail"
                name="userEmail"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('register.form.email.placeholder')}
                value={formData.userEmail}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="twitterHandle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('register.form.twitter')} <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">@</span>
                </div>
                <input
                  id="twitterHandle"
                  name="twitterHandle"
                  type="text"
                  required
                  className={`block w-full pl-8 pr-3 py-2 border ${errors.twitterHandle ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder={t('register.form.twitter.placeholder')}
                  value={formData.twitterHandle}
                  onChange={handleChange}
                />
              </div>
              {errors.twitterHandle && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.twitterHandle}</p>
              )}
            </div>
            <div>
              <label htmlFor="userPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('register.form.password')}
              </label>
              <input
                id="userPassword"
                name="userPassword"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('register.form.password.placeholder')}
                value={formData.userPassword}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="checkPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('register.form.confirm.password')}
              </label>
              <input
                id="checkPassword"
                name="checkPassword"
                type="password"
                required
                className={`mt-1 block w-full px-3 py-2 border ${errors.checkPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder={t('register.form.confirm.password.placeholder')}
                value={formData.checkPassword}
                onChange={handleChange}
              />
              {errors.checkPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.checkPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('register.form.submit')}
            </button>
          </div>

          <div className="text-center">
            <a href="/login" className="text-blue-600 hover:text-blue-500 text-sm">
              {t('register.form.login.link')}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
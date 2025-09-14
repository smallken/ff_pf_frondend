'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { userService } from '../../services';

export default function Register() {
  const { t } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState({
    userEmail: '',
    userPassword: '',
    checkPassword: '',
    userName: '',
    twitterHandle: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [verificationCode, setVerificationCode] = useState('');
  
  // 功能暂时禁用
  const isDisabled = true;

  const validateTwitterHandle = (handle: string): boolean => {
    // Twitter username validation: 1-15 characters, alphanumeric and underscore only
    const twitterRegex = /^[a-zA-Z0-9_]{1,15}$/;
    return twitterRegex.test(handle);
  };

  // 发送邮箱验证码
  const sendVerificationCode = async () => {
    setLoading(true);
    try {
      await userService.sendEmail({
        userEmail: formData.userEmail,
        userName: formData.userName
      });
      setStep('verify');
    } catch (error: any) {
      setErrors({ general: error.message || '发送验证码失败' });
    } finally {
      setLoading(false);
    }
  };

  // 提交注册表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isDisabled) {
      setErrors({ general: '注册功能暂未开放，敬请期待' });
      return;
    }
    
    // 打印注册表单数据
    console.log('📝 注册表单数据:', {
      twitterHandle: formData.twitterHandle,
      userPassword: formData.userPassword,
      checkPassword: formData.checkPassword,
      timestamp: new Date().toISOString()
    });
    
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
      console.log('✅ 注册表单验证通过，发送验证码');
      await sendVerificationCode();
    } else {
      console.log('❌ 注册表单验证失败:', newErrors);
    }
  };

  // 完成注册
  const completeRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // 打印完整注册数据
    const registrationData = {
      userEmail: formData.userEmail,
      strCode: verificationCode,
      userPassword: formData.userPassword,
      checkPassword: formData.checkPassword,
      userName: formData.userName
    };
    console.log('🎯 完整注册数据:', registrationData);
    
    try {
      await userService.emailRegister(registrationData);
      
      console.log('✅ 注册成功');
      // 注册成功，跳转到登录页
      router.push('/login?message=注册成功，请登录');
    } catch (error: any) {
      console.log('❌ 注册失败:', error);
      setErrors({ general: error.message || '注册失败' });
    } finally {
      setLoading(false);
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
        {step === 'form' ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {isDisabled && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    注册功能暂未开放，敬请期待
                  </div>
                </div>
              </div>
            )}
            
            {errors.general && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <div className="text-sm text-red-600 dark:text-red-400">{errors.general}</div>
              </div>
            )}
            
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
                disabled={isDisabled}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={isDisabled}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={isDisabled}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={loading || isDisabled}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    发送验证码中...
                  </div>
                ) : (
                  t('register.form.submit')
                )}
              </button>
            </div>

            <div className="text-center">
              <a href="/login" className="text-blue-600 hover:text-blue-500 text-sm">
                {t('register.form.login.link')}
              </a>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={completeRegistration}>
            {errors.general && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <div className="text-sm text-red-600 dark:text-red-400">{errors.general}</div>
              </div>
            )}
            
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                验证码已发送到 <strong>{formData.userEmail}</strong>
              </p>
            </div>
            
            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                验证码
              </label>
              <input
                id="verificationCode"
                name="verificationCode"
                type="text"
                required
                disabled={loading || isDisabled}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="请输入验证码"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || isDisabled}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    注册中...
                  </div>
                ) : (
                  '完成注册'
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="text-blue-600 hover:text-blue-500 text-sm"
              >
                返回修改信息
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { formService, userService } from '../../../services';

export default function ApplicationForm() {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // 翻译后端返回的错误消息
  const translateErrorMessage = (message: string): string => {
    if (language === 'en') {
      const errorMap: Record<string, string> = {
        '推特用户名已被其他用户使用': 'Twitter username is already used by another user',
        'Telegram用户名已被其他用户使用': 'Telegram username is already used by another user',
        '钱包地址已被其他用户使用': 'Wallet address is already used by another user',
        '邮箱已被其他用户使用': 'Email is already used by another user',
        '用户名已被其他用户使用': 'Username is already used by another user',
        '该字段已被其他用户使用': 'This field is already used by another user'
      };
      return errorMap[message] || message;
    }
    return message;
  };
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    twitterUsername: '',
    telegramUsername: '',
    walletAddress: '',
    country: '',
    twitterFollowers: '',
    web3Role: [] as string[],
    expertise: [] as string[],
    portfolioLink: '',
    motivation: '',
    weeklyHours: '',
    eventOrganization: '',
    resources: '',
    entrepreneurship: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [missingFields, setMissingFields] = useState<{country: boolean, twitterFollowers: boolean}>({country: false, twitterFollowers: false});
  const [profileForm, setProfileForm] = useState({country: '', twitterFollowers: ''});
  const [profileSaving, setProfileSaving] = useState(false);

  // 检查登录状态并获取用户信息
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const user = await userService.getLoginUser();
        setUserInfo(user);
        // 自动填充用户信息
        setFormData(prev => ({
          ...prev,
          name: user.userName || '',
          email: user.userEmail || ''
        }));
        
        // 检查country和twitterFollowers是否填写
        console.log('🔍 检查用户字段 - country:', user.country, 'twitterFollowers:', user.twitterFollowers);
        
        const needCountry = !user.country || (typeof user.country === 'string' && user.country.trim() === '');
        const needTwitterFollowers = user.twitterFollowers === null || user.twitterFollowers === undefined;
        
        console.log('🔍 需要填写字段 - needCountry:', needCountry, 'needTwitterFollowers:', needTwitterFollowers);
        
        if (needCountry || needTwitterFollowers) {
          console.log('✅ 显示弹窗要求用户填写');
          setMissingFields({
            country: needCountry,
            twitterFollowers: needTwitterFollowers
          });
          setProfileForm({
            country: user.country || '',
            twitterFollowers: user.twitterFollowers?.toString() || ''
          });
          setShowProfileModal(true);
        } else {
          console.log('❌ 字段已填写，不显示弹窗');
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
        // 如果获取用户信息失败，可能是登录状态有问题，重定向到登录页
        router.push('/login');
      }
    };

    fetchUserInfo();
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证多选字段
    if (formData.web3Role.length === 0) {
      setError('请至少选择一个参与身份');
      return;
    }
    if (formData.expertise.length === 0) {
      setError('请至少选择一个擅长方向');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    // 检查字段重复性
    console.log('🔍 开始检查字段重复性...');
    const duplicateErrors = [];
    let hasApiError = false;
    
    // 检查推特用户名重复
    if (formData.twitterUsername && formData.twitterUsername.trim()) {
      try {
        const twitterResult = await userService.checkFieldUniqueWithError('twitterUsername', formData.twitterUsername.trim());
        console.log('🔍 推特用户名检查结果:', twitterResult);
        if (!twitterResult.isUnique && twitterResult.errorMessage) {
          console.log('🔍 推特用户名重复错误:', twitterResult.errorMessage);
          duplicateErrors.push(translateErrorMessage(twitterResult.errorMessage));
        }
      } catch (error: any) {
        console.error('❌ 推特用户名检查失败:', error);
        hasApiError = true;
      }
    }
    
    // 检查Telegram用户名重复
    if (formData.telegramUsername && formData.telegramUsername.trim()) {
      try {
        console.log('🔍 检查Telegram用户名:', formData.telegramUsername.trim());
        const telegramResult = await userService.checkFieldUniqueWithError('telegramUsername', formData.telegramUsername.trim());
        console.log('🔍 Telegram用户名检查结果:', telegramResult);
        if (!telegramResult.isUnique && telegramResult.errorMessage) {
          console.log('🔍 Telegram用户名重复错误:', telegramResult.errorMessage);
          duplicateErrors.push(translateErrorMessage(telegramResult.errorMessage));
        }
      } catch (error: any) {
        console.error('❌ Telegram用户名检查失败:', error);
        hasApiError = true;
      }
    }
    
    // 检查钱包地址重复
    if (formData.walletAddress && formData.walletAddress.trim()) {
      try {
        const walletResult = await userService.checkFieldUniqueWithError('walletAddress', formData.walletAddress.trim());
        console.log('🔍 钱包地址检查结果:', walletResult);
        if (!walletResult.isUnique && walletResult.errorMessage) {
          duplicateErrors.push(translateErrorMessage(walletResult.errorMessage));
        }
      } catch (error: any) {
        console.error('❌ 钱包地址检查失败:', error);
        hasApiError = true;
      }
    }
    
    // 如果有重复字段，显示具体的重复错误信息
    if (duplicateErrors.length > 0) {
      const separator = language === 'en' ? '; ' : '；';
      const combinedError = duplicateErrors.join(separator);
      setError(combinedError);
      setLoading(false);
      return;
    }
    
    // 如果没有重复字段但有API错误，显示通用错误
    if (hasApiError) {
      console.log('❌ 有API错误但没有重复字段，显示通用错误');
      setError(t('forms.duplicate.check.failed'));
      setLoading(false);
      return;
    }
    
    try {

      // 直接提交表单数据，不再使用JSON格式
      await formService.submitApplicationForm(formData);

      // 显示成功提示
      setSuccess(language === 'zh' 
        ? '🎉 申请表提交成功！我们将在1-3个工作日内审核您的申请。'
        : '🎉 Application form submitted successfully! We will review your application within 1-3 business days.');
      
      // 2秒后自动消失提示
      setTimeout(() => {
        setSuccess('');
      }, 2000);
      
      // 3秒后跳转到表单列表页面
      setTimeout(() => {
        router.push('/forms?success=application');
      }, 3000);
    } catch (error: any) {
      console.log('❌ 申请表提交失败:', error);
      setError(error.message || '提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = (name: 'web3Role' | 'expertise', value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
  };

  const handleCancel = () => {
    router.push('/forms');
  };

  // 保存个人资料信息
  const handleSaveProfile = async () => {
    setProfileSaving(true);
    try {
      const updateData: any = {};
      
      if (missingFields.country) {
        if (!profileForm.country || profileForm.country.trim() === '') {
          alert(language === 'zh' ? '请填写所在国家地区' : 'Please fill in your country/region');
          setProfileSaving(false);
          return;
        }
        updateData.country = profileForm.country.trim();
      }
      
      if (missingFields.twitterFollowers) {
        if (!profileForm.twitterFollowers || profileForm.twitterFollowers.trim() === '') {
          alert(language === 'zh' ? '请填写Twitter粉丝数' : 'Please fill in your Twitter followers count');
          setProfileSaving(false);
          return;
        }
        updateData.twitterFollowers = parseInt(profileForm.twitterFollowers);
      }
      
      await userService.updateMyInfo(updateData);
      
      // 重新获取用户信息
      const updatedUser = await userService.getLoginUser();
      setUserInfo(updatedUser);
      
      setShowProfileModal(false);
      alert(language === 'zh' ? '信息保存成功！' : 'Information saved successfully!');
    } catch (error: any) {
      console.error('保存个人信息失败:', error);
      alert(error.message || (language === 'zh' ? '保存失败，请重试' : 'Failed to save, please try again'));
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12" lang={language === 'zh' ? 'zh-CN' : 'en-US'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {language === 'zh' ? '报名申请表' : 'Enrollment Application Form'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl p-6 mb-6 shadow-lg animate-pulse">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-1">{t('forms.error.submit.failed')}</h3>
                  <div className="text-red-700 dark:text-red-300">{error}</div>
                </div>
              </div>
            </div>
          )}
          
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.field.name')} <span className="text-red-500">{t('forms.required')}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({t('forms.auto.filled')})</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                value={formData.name}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.field.email')} <span className="text-red-500">{t('forms.required')}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({t('forms.auto.filled')})</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                value={formData.email}
              />
            </div>

            <div>
              <label htmlFor="twitterUsername" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.field.twitter')}
              </label>
              <input
                type="text"
                id="twitterUsername"
                name="twitterUsername"
                
                placeholder={t('forms.field.twitter')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={formData.twitterUsername}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="telegramUsername" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.field.telegram')} <span className="text-red-500">{t('forms.required')}</span>
              </label>
              <input
                type="text"
                id="telegramUsername"
                name="telegramUsername"
                required
                placeholder={t('forms.field.telegram')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={formData.telegramUsername}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                所在国家地区 <span className="text-red-500">{t('forms.required')}</span>
              </label>
              <input
                type="text"
                id="country"
                name="country"
                required
                placeholder="例如：中国、美国、日本等"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={formData.country}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="twitterFollowers" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Twitter 粉丝数 <span className="text-red-500">{t('forms.required')}</span>
              </label>
              <input
                type="number"
                id="twitterFollowers"
                name="twitterFollowers"
                required
                placeholder="例如：1000"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={formData.twitterFollowers}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.field.wallet.solana')} <span className="text-red-500">{t('forms.required')}</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  {language === 'zh' ? '奖励的收款地址,可在个人信息更改' : 'Reward receiving address. You can change it in Profile later.'}
                </span>
              </label>
              <input
                type="text"
                id="walletAddress"
                name="walletAddress"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={formData.walletAddress}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('forms.application.web3role')} <span className="text-red-500">{t('forms.required')}</span>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                {language === 'zh' ? '多选' : 'Multiple Choice'}
              </span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { key: 'entrepreneur', value: 'forms.role.entrepreneur' },
                { key: 'developer', value: 'forms.role.developer' },
                { key: 'creator', value: 'forms.role.creator' },
                { key: 'kol', value: 'forms.role.kol' },
                { key: 'community', value: 'forms.role.community' },
                { key: 'marketing', value: 'forms.role.marketing' },
                { key: 'researcher', value: 'forms.role.researcher' },
                { key: 'enthusiast', value: 'forms.role.enthusiast' },
                { key: 'student', value: 'forms.role.student' }
              ].map((role) => (
                <label key={role.key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.web3Role.includes(role.key)}
                    onChange={() => handleCheckboxChange('web3Role', role.key)}
                    className="mr-2 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t(role.value)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('forms.application.expertise')} <span className="text-red-500">{t('forms.required')}</span>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                {language === 'zh' ? '多选' : 'Multiple Choice'}
              </span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'content', value: 'forms.expertise.content' },
                { key: 'community', value: 'forms.expertise.community' },
                { key: 'research', value: 'forms.expertise.research' },
                { key: 'promotion', value: 'forms.expertise.promotion' }
              ].map((skill) => (
                <label key={skill.key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.expertise.includes(skill.key)}
                    onChange={() => handleCheckboxChange('expertise', skill.key)}
                    className="mr-2 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t(skill.value)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="portfolioLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('forms.application.portfolio')}
            </label>
            <textarea
              id="portfolioLink"
              name="portfolioLink"
              rows={3}
              
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={formData.portfolioLink}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('forms.application.motivation')} <span className="text-red-500">{t('forms.required')}</span>
            </label>
            <textarea
              id="motivation"
              name="motivation"
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={formData.motivation}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="weeklyHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.application.weeklyhours')}
              </label>
              <input
                type="text"
                id="weeklyHours"
                name="weeklyHours"
                placeholder={t('forms.application.weeklyhours.placeholder')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={formData.weeklyHours}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="eventOrganization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('forms.application.events')}
              </label>
              <select
                id="eventOrganization"
                name="eventOrganization"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={formData.eventOrganization}
                onChange={handleChange}
              >
                <option value="">{language === 'zh' ? '未填写' : 'Not filled'}</option>
                <option value="yes">{language === 'zh' ? '是' : 'Yes'}</option>
                <option value="no">{language === 'zh' ? '否' : 'No'}</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="resources" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('forms.application.resources')}
            </label>
            <textarea
              id="resources"
              name="resources"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={formData.resources}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="entrepreneurship" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('forms.application.entrepreneurship')}
            </label>
            <textarea
              id="entrepreneurship"
              name="entrepreneurship"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={formData.entrepreneurship}
              onChange={handleChange}
            />
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6 border border-yellow-200 dark:border-yellow-700">
            <h3 className="font-medium text-yellow-900 dark:text-yellow-200 mb-2">📝 {t('forms.submit.button')}</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {t('forms.optional.note')}
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {t('forms.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading || !isAuthenticated || !!success}
              className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-md hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('forms.submit.processing')}
                </div>
              ) : success ? (
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('forms.submit.completed')}
                </div>
              ) : (
                t('forms.submit.button')
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 个人资料填写提示弹窗 */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                  {language === 'zh' ? '完善个人资料' : 'Complete Your Profile'}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {language === 'zh' 
                  ? '为了更好地为您服务，请先完善以下信息：' 
                  : 'To better serve you, please complete the following information:'}
              </p>
            </div>

            <div className="space-y-4">
              {missingFields.country && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'zh' ? '所在国家地区' : 'Country/Region'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={profileForm.country}
                    onChange={(e) => setProfileForm({...profileForm, country: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder={language === 'zh' ? '例如：中国、美国、日本等' : 'e.g., China, USA, Japan'}
                  />
                </div>
              )}

              {missingFields.twitterFollowers && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'zh' ? 'Twitter 粉丝数' : 'Twitter Followers'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={profileForm.twitterFollowers}
                    onChange={(e) => setProfileForm({...profileForm, twitterFollowers: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder={language === 'zh' ? '例如：1000' : 'e.g., 1000'}
                    min="0"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleSaveProfile}
                disabled={profileSaving}
                className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-md hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {profileSaving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {language === 'zh' ? '保存中...' : 'Saving...'}
                  </div>
                ) : (
                  language === 'zh' ? '保存' : 'Save'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 成功提示模态框 */}
      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 max-w-md mx-4 shadow-2xl transform animate-scaleIn">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                <svg className="h-12 w-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('forms.success.title')}</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {success}
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('forms.success.redirect')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
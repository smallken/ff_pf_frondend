'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { userService } from '@/services';
import CountrySelect from './CountrySelect';

export default function ProfileCompletionModal() {
  const { isAuthenticated, user } = useAuth();
  const { language } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [missingFields, setMissingFields] = useState<{country: boolean, twitterFollowers: boolean, twitterName: boolean}>({
    country: false,
    twitterFollowers: false,
    twitterName: false
  });
  const [profileForm, setProfileForm] = useState({country: '', twitterFollowers: '', twitterName: ''});
  const [saving, setSaving] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkUserProfile = async () => {
      // 只在已登录且未检查过的情况下执行
      if (!isAuthenticated || checked) {
        return;
      }

      try {
        const userInfo = await userService.getLoginUser();

        // 检查country、twitterFollowers和twitterName是否填写
        const needCountry = !userInfo.country || (typeof userInfo.country === 'string' && userInfo.country.trim() === '');
        const needTwitterFollowers = userInfo.twitterFollowers === null || userInfo.twitterFollowers === undefined;
        const needTwitterName = !userInfo.twitterName || (typeof userInfo.twitterName === 'string' && userInfo.twitterName.trim() === '');

        if (needCountry || needTwitterFollowers || needTwitterName) {
          setMissingFields({
            country: needCountry,
            twitterFollowers: needTwitterFollowers,
            twitterName: needTwitterName
          });
          setProfileForm({
            country: userInfo.country || '',
            twitterFollowers: userInfo.twitterFollowers?.toString() || '',
            twitterName: userInfo.twitterName || ''
          });
          setShowModal(true);
        }
        
        setChecked(true);
      } catch (error) {
        console.error('获取用户信息失败:', error);
        setChecked(true);
      }
    };

    checkUserProfile();
  }, [isAuthenticated, checked]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updateData: any = {};
      
      if (missingFields.country) {
        if (!profileForm.country || profileForm.country.trim() === '') {
          alert(language === 'zh' ? '请填写所在国家地区' : 'Please fill in your country/region');
          setSaving(false);
          return;
        }
        updateData.country = profileForm.country.trim();
      }
      
      if (missingFields.twitterFollowers) {
        if (!profileForm.twitterFollowers || profileForm.twitterFollowers.trim() === '') {
          alert(language === 'zh' ? '请填写Twitter粉丝数' : 'Please fill in your Twitter followers count');
          setSaving(false);
          return;
        }
        updateData.twitterFollowers = parseInt(profileForm.twitterFollowers);
      }

      if (missingFields.twitterName) {
        if (!profileForm.twitterName || profileForm.twitterName.trim() === '') {
          alert(language === 'zh' ? '请填写Twitter显示名称' : 'Please fill in your Twitter display name');
          setSaving(false);
          return;
        }
        updateData.twitterName = profileForm.twitterName.trim();
      }

      await userService.updateMyInfo(updateData);
      
      setShowModal(false);
      alert(language === 'zh' ? '信息保存成功！' : 'Information saved successfully!');
    } catch (error: any) {
      console.error('保存个人信息失败:', error);
      alert(error.message || (language === 'zh' ? '保存失败，请重试' : 'Failed to save, please try again'));
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-scaleIn relative">
        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

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
              <CountrySelect
                value={profileForm.country}
                onChange={(value) => setProfileForm({...profileForm, country: value})}
                language={language}
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

          {missingFields.twitterName && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'zh' ? 'Twitter 显示名称' : 'Twitter Display Name'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={profileForm.twitterName}
                onChange={(e) => setProfileForm({...profileForm, twitterName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder={language === 'zh' ? '例如：Flipflop' : 'e.g., Flipflop'}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {language === 'zh' ? '用于传播任务审核匹配，请填写Twitter个人资料中显示的名称' : 'Used for spread task verification, enter the name shown in your Twitter profile'}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            {language === 'zh' ? '稍后填写' : 'Later'}
          </button>
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-md hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
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
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { taskSubmissionService } from '../../../services';
import CustomDateInput from '../../components/CustomDateInput';

export default function AchievementForm() {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Force re-render when language changes
  useEffect(() => {
    // This will trigger a re-render when language changes
  }, [language]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    twitterUsername: '',
    telegramUsername: '',
    walletAddress: '',
    submissionCategory: '',
    tasks: [
      {
        taskType: '',
        contentLink: '',
        screenshot: null as File | null,
        completionDate: '',
        description: '',
        collapsed: false
      }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 功能暂时禁用
  const isDisabled = true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isDisabled) {
      setError('表单提交功能暂未开放，敬请期待');
      return;
    }
    
    if (!isAuthenticated) {
      setError('请先登录后再提交成果表');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 打印成果提交表数据
      console.log('🏆 成果提交表数据:', {
        ...formData,
        timestamp: new Date().toISOString()
      });

      // 准备提交数据，转换任务格式
      const submitData = {
        name: formData.name,
        email: formData.email,
        twitterUsername: formData.twitterUsername,
        telegramUsername: formData.telegramUsername,
        walletAddress: formData.walletAddress,
        submissionCategory: formData.submissionCategory,
        tasks: formData.tasks.map(task => ({
          taskType: task.taskType,
          contentLink: task.contentLink,
          completionDate: task.completionDate,
          description: task.description,
          // 注意：screenshot文件上传需要单独处理，这里先忽略
        }))
      };

      // 调用后端成果提交表API
      const submissionId = await taskSubmissionService.addTaskSubmission(submitData);
      
      console.log('✅ 成果提交表提交成功，ID:', submissionId);
      
      // 成功后跳转到表单申请页面
      router.push('/forms?success=成果提交表提交成功');
      
    } catch (error: any) {
      console.log('❌ 成果提交表提交失败:', error);
      setError(error.message || '提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: (e.target as HTMLInputElement).value
    });
  };

  const handleTaskChange = (index: number, field: string, value: any) => {
    const updatedTasks = [...formData.tasks];
    // @ts-ignore
    updatedTasks[index][field] = value;
    setFormData({ ...formData, tasks: updatedTasks });
  };

  const toggleTaskCollapsed = (index: number) => {
    const updatedTasks = [...formData.tasks];
    updatedTasks[index].collapsed = !updatedTasks[index].collapsed;
    setFormData({ ...formData, tasks: updatedTasks });
  };

  const addTask = () => {
    setFormData({
      ...formData,
      tasks: [
        ...formData.tasks,
        { taskType: '', contentLink: '', screenshot: null, completionDate: '', description: '', collapsed: false }
      ]
    });
  };

  const isContentLinkRequired = (taskType: string) => ['content', 'article', 'video', 'recap'].includes(taskType);
  const isScreenshotRequired = (taskType: string) => ['like', 'ama', 'telegram', 'offline'].includes(taskType);

  const handleCancel = () => {
    router.push('/forms');
  };

  return (
    <div key={language} className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-gray-800 relative overflow-hidden">
      {/* Background decorative elements - Achievement themed */}
      <div className="absolute inset-0">
        <div className="absolute top-16 left-16 w-24 h-24 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full text-green-400 animate-pulse">
            <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="currentColor"/>
          </svg>
        </div>
        <div className="absolute top-32 right-20 w-20 h-20 bg-gradient-to-r from-emerald-300 to-teal-400 opacity-15 animate-bounce delay-1000" style={{clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'}}></div>
        <div className="absolute bottom-32 left-1/3 w-16 h-16 bg-gradient-to-r from-green-300 to-emerald-400 opacity-15 animate-ping delay-2000" style={{clipPath: 'circle(50% at 50% 50%)'}}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-medium mb-8 shadow-lg">
            <span className="mr-2">🏆</span>
            Achievement Form
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-6">
            {t('forms.achievement.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          </p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-green-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200 to-emerald-300 dark:from-green-800 dark:to-emerald-900 opacity-20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            
            {isDisabled && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-6">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    表单提交功能暂未开放，敬请期待
                  </div>
                </div>
              </div>
            )}

            {!isAuthenticated && !isDisabled && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-6">
                <div className="text-sm text-yellow-600 dark:text-yellow-400">
                  请先登录后再提交成果表
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
                <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('forms.field.name')} <span className="text-red-500">{t('forms.required')}</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('forms.field.email')} <span className="text-red-500">{t('forms.required')}</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="twitterUsername" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('forms.field.twitter')} <span className="text-red-500">{t('forms.required')}</span>
                </label>
                <input
                  type="text"
                  id="twitterUsername"
                  name="twitterUsername"
                  required
                  placeholder={t('forms.placeholder.username')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  placeholder={t('forms.placeholder.username')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.telegramUsername}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('forms.field.wallet.both')} <span className="text-red-500">{t('forms.required')}</span>
                </label>
                <input
                  type="text"
                  id="walletAddress"
                  name="walletAddress"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.walletAddress}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('forms.achievement.category')} <span className="text-red-500">{t('forms.required')}</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'promotion', value: 'forms.achievement.category.promotion' },
                  { key: 'creation', value: 'forms.achievement.category.creation' },
                  { key: 'community', value: 'forms.achievement.category.community' }
                ].map((category) => (
                  <label key={category.key} className="flex items-center">
                    <input
                      type="radio"
                      name="submissionCategory"
                      value={category.key}
                      checked={formData.submissionCategory === category.key}
                      onChange={handleChange}
                      className="mr-2 text-green-600 focus:ring-green-500"
                      required
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{t(category.value)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('forms.achievement.tasktype')} <span className="text-red-500">{t('forms.required')}</span>
                </label>
                <button type="button" onClick={addTask} className="text-green-600 hover:text-green-700 text-sm font-medium">
                  + {t('forms.action.addTask')}
                </button>
              </div>
              <div className="space-y-4">
                {formData.tasks.map((task, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900/40 rounded-t-lg">
                      <div className="flex-1">
                        <select
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={task.taskType}
                          onChange={(e) => handleTaskChange(index, 'taskType', e.target.value)}
                          required
                        >
                          <option value="">{t('forms.placeholder.select')}</option>
                          {[
                            { key: 'like', value: 'forms.task.like' },
                            { key: 'content', value: 'forms.task.content' },
                            { key: 'article', value: 'forms.task.article' },
                            { key: 'video', value: 'forms.task.video' },
                            { key: 'ama', value: 'forms.task.ama' },
                            { key: 'recap', value: 'forms.task.recap' },
                            { key: 'telegram', value: 'forms.task.telegram' },
                            { key: 'offline', value: 'forms.task.offline' }
                          ].map((opt) => (
                            <option key={opt.key} value={opt.key}>{t(opt.value)}</option>
                          ))}
                        </select>
                      </div>
                      <button type="button" onClick={() => toggleTaskCollapsed(index)} className="ml-3 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                        {task.collapsed ? t('forms.action.expand') : t('forms.action.collapse')}
                      </button>
                    </div>
                    {!task.collapsed && (
                      <div className="p-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('forms.achievement.contentlink')} {isContentLinkRequired(task.taskType) && (<span className="text-red-500">{t('forms.required')}</span>)}
                          </label>
                          <input
                            type="url"
                            required={isContentLinkRequired(task.taskType)}
                            placeholder={t('forms.placeholder.contentlink')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={task.contentLink}
                            onChange={(e) => handleTaskChange(index, 'contentLink', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('forms.achievement.screenshot')} {isScreenshotRequired(task.taskType) && (<span className="text-red-500">{t('forms.required')}</span>)}
                          </label>
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                            <div className="mb-4">
                              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                              <label className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                                <span className="px-2">{t('forms.upload.text')}</span>
                                <input
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  required={isScreenshotRequired(task.taskType)}
                                  onChange={(e) => handleTaskChange(index, 'screenshot', (e.target.files && e.target.files[0]) || null)}
                                />
                              </label>
                              <p className="pl-1">{t('forms.upload.drag')}</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('forms.upload.format')}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              {t('forms.achievement.completion')} <span className="text-red-500">{t('forms.required')}</span>
                            </label>
                            <CustomDateInput
                              id={`completionDate-${index}`}
                              name={`completionDate-${index}`}
                              type="date"
                              required
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                              value={task.completionDate}
                              onChange={(e: any) => handleTaskChange(index, 'completionDate', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              {t('forms.achievement.description')}
                            </label>
                            <input
                              type="text"
                              placeholder={t('forms.placeholder.description')}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                              value={task.description}
                              onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6 border border-yellow-200 dark:border-yellow-700">
              <h3 className="font-medium text-yellow-900 dark:text-yellow-200 mb-2">📝 {t('forms.submit.achievement')}</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {t('forms.optional.note')}
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-all duration-300 transform hover:-translate-y-1"
              >
                {t('forms.cancel.button')}
              </button>
              <button
                type="submit"
                disabled={loading || !isAuthenticated || isDisabled}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg ${
                  loading || !isAuthenticated || isDisabled
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transform hover:-translate-y-1 hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    提交中...
                  </div>
                ) : (
                  t('forms.submit.achievement')
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
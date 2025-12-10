'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { taskSubmissionService } from '../../../services';
import CustomDateInput from '../../components/CustomDateInput';

const SUBMISSION_DEADLINE = new Date('2025-10-19T16:00:00Z');

const submissionClosedContent = {
  zh: {
    message: '脚印计划于2025年10月20日00:00（UTC+8）起暂停表单提交，当前暂不接受新的成果提交。',
    badge: '提交已关闭'
  },
  en: {
    message: 'Footprint submissions are paused starting October 20, 2025 at 00:00 (UTC+8). Achievement submissions are currently unavailable.',
    badge: 'Submission closed'
  }
};

export default function AchievementForm() {
  const { t, language } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const isSubmissionClosed = Date.now() >= SUBMISSION_DEADLINE.getTime();
  
  // Force re-render when language changes
  useEffect(() => {
    // This will trigger a re-render when language changes
  }, [language]);

  // 自动填充用户信息
  useEffect(() => {
    if (user && isAuthenticated) {
      setFormData(prev => ({
        ...prev,
        name: user.userName || '',
        email: user.userEmail || '',
        twitterUsername: user.twitterUsername || '',
        telegramUsername: user.telegramUsername || '',
        walletAddressSol: user.walletAddressSol || '',
        walletAddressBsc: user.walletAddressBsc || ''
      }));
    }
  }, [user, isAuthenticated]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    twitterUsername: '',
    telegramUsername: '',
    walletAddressSol: '',
    walletAddressBsc: '',
    tasks: [
      {
        submissionCategory: '',
        taskType: '',
        contentLink: '',
        screenshot: null as File | null,
        completionDate: '',
        description: '',
        viewCount: '',
        collapsed: false
      }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 错误信息翻译函数
  const translateError = (errorMsg: string): string => {
    if (language === 'zh') return errorMsg;
    
    // 传播类频率限制
    const promotionMatch = errorMsg.match(/传播类任务一周内不能超过5次提交（当前已提交(\d+)次，本次提交(\d+)次）/);
    if (promotionMatch) {
      return `Promotion tasks cannot exceed 5 submissions per week (currently submitted ${promotionMatch[1]} times, this submission ${promotionMatch[2]} time(s))`;
    }
    
    // 短篇原创频率限制
    const shortMatch = errorMsg.match(/短篇原创任务一周内不能超过3次提交（当前已提交(\d+)次，本次提交(\d+)次）/);
    if (shortMatch) {
      return `Short original tasks cannot exceed 3 submissions per week (currently submitted ${shortMatch[1]} times, this submission ${shortMatch[2]} time(s))`;
    }
    
    // 社区TG频率限制
    const communityMatch = errorMsg.match(/社区类TG任务一周内不能超过3次提交（当前已提交(\d+)次，本次提交(\d+)次）/);
    if (communityMatch) {
      return `Community TG tasks cannot exceed 3 submissions per week (currently submitted ${communityMatch[1]} time(s), this submission ${communityMatch[2]} time(s))`;
    }
    
    // 其他通用错误翻译
    const errorTranslations: { [key: string]: string } = {
      '提交失败，请重试': 'Submission failed, please try again',
      '请先登录后再提交成果表': 'Please login before submitting the achievement form',
      '姓名是必填项': 'Name is required',
      '邮箱是必填项': 'Email is required',
      'Twitter用户名是必填项': 'Twitter username is required',
      'Telegram用户名是必填项': 'Telegram username is required',
      '钱包地址是必填项': 'Wallet address is required',
    };
    
    return errorTranslations[errorMsg] || errorMsg;
  };

  // 表单验证函数
  const validateForm = () => {
    // 验证基本信息
    if (!formData.name.trim()) {
      setError('姓名是必填项');
      return false;
    }
    if (!formData.email.trim()) {
      setError('邮箱是必填项');
      return false;
    }
    if (!formData.twitterUsername.trim()) {
      setError('Twitter用户名是必填项');
      return false;
    }
    if (!formData.telegramUsername.trim()) {
      setError('Telegram用户名是必填项');
      return false;
    }
    if (!formData.walletAddressSol.trim() && !formData.walletAddressBsc.trim()) {
      setError('钱包地址是必填项');
      return false;
    }

    // 验证任务信息
    for (let i = 0; i < formData.tasks.length; i++) {
      const task = formData.tasks[i];
      
      if (!task.submissionCategory) {
        setError(`任务${i + 1}的提交类别是必填项`);
        return false;
      }
      if (!task.taskType) {
        setError(`任务${i + 1}的具体任务类型是必填项`);
        return false;
      }
      if (!task.completionDate) {
        setError(`任务${i + 1}的完成日期是必填项`);
        return false;
      }
      if (isDescriptionRequired(task.taskType) && !task.description.trim()) {
        setError(`任务${i + 1}的简短说明是必填项`);
        return false;
      }
      
      // 根据任务类型验证特定字段
      if (isContentLinkRequired(task.taskType) && !task.contentLink.trim()) {
        setError(`任务${i + 1}的内容链接是必填项`);
        return false;
      }
      if (isScreenshotRequired(task.taskType) && !task.screenshot) {
        setError(`任务${i + 1}的截图证明是必填项`);
        return false;
      }

      // 验证原创类任务的浏览量
      if (task.submissionCategory === 'long' && !task.viewCount.trim()) {
        setError(`任务${i + 1}的当前浏览量是必填项`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmissionClosed) {
      setError(submissionClosedContent[language as 'zh' | 'en'].message);
      return;
    }

    if (!isAuthenticated) {
      setError('请先登录后再提交成果表');
      return;
    }

    // 验证表单
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 准备提交数据，转换任务格式
      const submitData = {
        name: formData.name,
        email: formData.email,
        twitterUsername: formData.twitterUsername,
        telegramUsername: formData.telegramUsername,
        walletAddressSol: formData.walletAddressSol,
        walletAddressBsc: formData.walletAddressBsc,
        tasks: await Promise.all(formData.tasks.map(async (task) => {
          let screenshotPath = '';
          
          // 如果有截图文件，先上传到Vercel Blob
          if (task.screenshot) {
            try {
              // 使用API路由上传文件
              const formData = new FormData();
              formData.append('file', task.screenshot);
              formData.append('biz', 'task_screenshot');
              
              const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
              });
              
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || (language === 'zh' ? '上传失败' : 'Upload failed'));
              }
              
              const result = await response.json();
              screenshotPath = result.url;
              console.log('📸 截图上传到Vercel Blob成功:', screenshotPath);
            } catch (error) {
              console.error('❌ 截图上传到Vercel Blob失败:', error);
              const errorMessage = error instanceof Error ? error.message : (language === 'zh' ? '未知错误' : 'Unknown error');
              throw new Error(language === 'zh' ? `截图上传失败: ${errorMessage}` : `Screenshot upload failed: ${errorMessage}`);
            }
          }
          
          return {
            submissionCategory: task.submissionCategory,
            taskType: task.taskType,
            contentLink: task.contentLink,
            screenshot: screenshotPath,
            completionDate: task.completionDate,
            description: task.description,
            viewCount: task.viewCount,
          };
        }))
      };

      // 调用后端成果提交表API
      const submissionId = await taskSubmissionService.addTaskSubmission(submitData);
      // 显示成功提示
      setSuccess(language === 'zh' 
        ? '🎉 成果提交表提交成功！我们将在1-3个工作日内审核您的提交。'
        : '🎉 Achievement form submitted successfully! We will review your submission within 1-3 business days.');
      
      // 2秒后自动消失提示
      setTimeout(() => {
        setSuccess('');
      }, 2000);
      
      // 3秒后跳转到表单申请页面
      setTimeout(() => {
        router.push('/forms?success=achievement');
      }, 3000);
      
    } catch (error: any) {
      console.log('❌ 成果提交表提交失败:', error);
      setError(error.message || '提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTaskChange = (index: number, field: string, value: any) => {
    const updatedTasks = [...formData.tasks];
    
    // 如果改变了提交类别，检查是否允许更改
    if (field === 'submissionCategory') {
      // 检查是否已有其他任务使用了不同的提交类别
      const hasOtherTasks = updatedTasks.some((task, i) => i !== index && task.submissionCategory && task.submissionCategory !== '');
      if (hasOtherTasks) {
        // 获取第一个任务的提交类别
        const firstTaskCategory = updatedTasks.find(task => task.submissionCategory && task.submissionCategory !== '')?.submissionCategory;
        if (firstTaskCategory && value !== firstTaskCategory) {
          alert('同一次只能提交同一种提交类别任务');
          return;
        }
      }
      
      const taskTypeOptions = getTaskTypeOptions(value);
      if (taskTypeOptions.length === 1) {
        // 如果只有一个选项，自动设置
        updatedTasks[index].taskType = taskTypeOptions[0].key;
      } else {
        // 如果有多个选项，清空任务类型
        updatedTasks[index].taskType = '';
      }
    }
    
    // @ts-ignore
    updatedTasks[index][field] = value;
    setFormData({ ...formData, tasks: updatedTasks });
  };

  const toggleTaskCollapsed = (index: number) => {
    const updatedTasks = [...formData.tasks];
    updatedTasks[index].collapsed = !updatedTasks[index].collapsed;
    setFormData({ ...formData, tasks: updatedTasks });
  };

  const removeTask = (index: number) => {
    if (formData.tasks.length > 1) {
      const updatedTasks = formData.tasks.filter((_, i) => i !== index);
      setFormData({ ...formData, tasks: updatedTasks });
    }
  };

  const addTask = () => {
    // 检查是否已有任务，如果有，获取第一个任务的提交类别
    const firstTask = formData.tasks[0];
    if (firstTask && firstTask.submissionCategory) {
      // 如果第一个任务已有提交类别，新任务必须使用相同的类别
      const taskTypeOptions = getTaskTypeOptions(firstTask.submissionCategory);
      let newTaskType = '';
      
      // 如果只有一个选项，自动设置
      if (taskTypeOptions.length === 1) {
        newTaskType = taskTypeOptions[0].key;
      }
      
      setFormData({
        ...formData,
        tasks: [
          ...formData.tasks,
          {
            submissionCategory: firstTask.submissionCategory,
            taskType: newTaskType,
            contentLink: '',
            screenshot: null,
            completionDate: '',
            description: '',
            viewCount: '',
            collapsed: false
          }
        ]
      });
    } else {
      // 如果第一个任务没有提交类别，添加空任务
      setFormData({
        ...formData,
        tasks: [
          ...formData.tasks,
          { submissionCategory: '', taskType: '', contentLink: '', screenshot: null, completionDate: '', description: '', viewCount: '', collapsed: false }
        ]
      });
    }
  };

  const isContentLinkRequired = (taskType: string) => ['short.content', 'long.article', 'long.video', 'long.recap', 'community.viral'].includes(taskType);
  const isScreenshotRequired = (taskType: string) => ['promotion.triple', 'community.ama', 'community.telegram', 'community.offline'].includes(taskType);
  const isDescriptionRequired = (taskType: string) => false;

  // 根据选择的类别获取对应的任务类型选项
  const getTaskTypeOptions = (category: string) => {
    switch (category) {
      case 'promotion':
        return [
          { key: 'promotion.triple', value: 'forms.task.promotion.triple' }
        ];
      case 'short':
        return [
          { key: 'short.content', value: 'forms.task.short.content' }
        ];
      case 'long':
        return [
          { key: 'long.article', value: 'forms.task.long.article' },
          { key: 'long.video', value: 'forms.task.long.video' },
          { key: 'long.recap', value: 'forms.task.long.recap' }
        ];
      case 'community':
        return [
          { key: 'community.ama', value: 'forms.task.community.ama' },
          { key: 'community.telegram', value: 'forms.task.community.telegram' },
          { key: 'community.offline', value: 'forms.task.community.offline' },
          { key: 'community.viral', value: 'forms.task.community.viral' }
        ];
      default:
        return [];
    }
  };

  const handleCancel = () => {
    router.push('/forms');
  };

  return (
    <div key={language} className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-gray-800 relative overflow-hidden" lang={language === 'zh' ? 'zh-CN' : 'en-US'}>
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
        {isSubmissionClosed && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-800/60 dark:text-blue-200">
                {submissionClosedContent[language as 'zh' | 'en'].badge}
              </span>
              <p className="text-sm text-gray-700 dark:text-gray-200">{submissionClosedContent[language as 'zh' | 'en'].message}</p>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-green-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200 to-emerald-300 dark:from-green-800 dark:to-emerald-900 opacity-20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            
            {!isAuthenticated && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-6">
                <div className="text-sm text-yellow-600 dark:text-yellow-400">
                  请先登录后再提交成果表
                </div>
              </div>
            )}

            {/* 错误弹窗 */}
            {error && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-slideDown">
                  <div className="bg-gradient-to-r from-red-500 to-pink-600 p-4">
                    <div className="flex items-center text-white">
                      <svg className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <h3 className="text-xl font-bold">{t('forms.error.submit.failed')}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6">
                      {translateError(error)}
                    </p>
                    <button
                      onClick={() => setError('')}
                      className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      {language === 'zh' ? '我知道了' : 'Got it'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 用户信息自动填充提示 */}
            {isAuthenticated && user && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    {t('forms.auto.fill.tip')}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center">
                    {t('forms.field.name')} <span className="text-red-500">{t('forms.required')}</span>
                    {user?.userName && (
                      <svg className="h-4 w-4 text-green-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <title>自动填充</title>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                  </div>
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
                  <div className="flex items-center">
                    {t('forms.field.email')} <span className="text-red-500">{t('forms.required')}</span>
                    {user?.userEmail && (
                      <svg className="h-4 w-4 text-green-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <title>自动填充</title>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                  </div>
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
                  <div className="flex items-center">
                    {t('forms.field.twitter')} <span className="text-red-500">{t('forms.required')}</span>
                    {user?.twitterUsername && (
                      <svg className="h-4 w-4 text-green-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <title>自动填充</title>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                  </div>
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
                  <div className="flex items-center">
                    {t('forms.field.telegram')} <span className="text-red-500">{t('forms.required')}</span>
                    {user?.telegramUsername && (
                      <svg className="h-4 w-4 text-green-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <title>自动填充</title>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                  </div>
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

              <div>
                <label htmlFor="walletAddressSol" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center">
                    Solana钱包地址 <span className="text-red-500">{t('forms.required')}</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="walletAddressSol"
                  name="walletAddressSol"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.walletAddressSol}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="walletAddressBsc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center">
                    BSC钱包地址 <span className="text-red-500">{t('forms.required')}</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="walletAddressBsc"
                  name="walletAddressBsc"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.walletAddressBsc}
                  onChange={handleChange}
                />
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
                      <div className="flex-1 space-y-3">
                        {/* 提交类别选择 */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('forms.achievement.category')} <span className="text-red-500">{t('forms.required')}</span>
                          </label>
                          {(() => {
                            // 检查是否已有其他任务使用了不同的提交类别
                            const hasOtherTasks = formData.tasks.some((t, i) => i !== index && t.submissionCategory && t.submissionCategory !== '');
                            const firstTaskCategory = formData.tasks.find(t => t.submissionCategory && t.submissionCategory !== '')?.submissionCategory;
                            const isDisabled = hasOtherTasks && index > 0;
                            
                            return (
                              <>
                                <select
                                  className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    isDisabled 
                                      ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed opacity-60' 
                                      : 'bg-white dark:bg-gray-700'
                                  }`}
                                  value={task.submissionCategory}
                                  onChange={(e) => handleTaskChange(index, 'submissionCategory', e.target.value)}
                                  required
                                  disabled={isDisabled}
                                >
                                  <option value="">{t('forms.placeholder.select')}</option>
                                  <option value="promotion">{t('forms.achievement.category.promotion')}</option>
                                  <option value="short">{t('forms.achievement.category.short')}</option>
                                  <option value="long">{t('forms.achievement.category.long')}</option>
                                  <option value="community">{t('forms.achievement.category.community')}</option>
                                </select>
                                {isDisabled && (
                                  <p className="mt-1 text-sm text-orange-600 dark:text-orange-400">
                                    同一次只能提交同一种提交类别任务
                                  </p>
                                )}
                              </>
                            );
                          })()}
                        </div>
                        
                        {/* 任务类型选择 */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('forms.achievement.tasktype')} <span className="text-red-500">{t('forms.required')}</span>
                          </label>
                          {getTaskTypeOptions(task.submissionCategory).length === 1 ? (
                            // 如果只有一个选项，直接显示
                            <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white">
                              {t(getTaskTypeOptions(task.submissionCategory)[0].value)}
                              <input
                                type="hidden"
                                value={getTaskTypeOptions(task.submissionCategory)[0].key}
                              />
                            </div>
                          ) : (
                            // 如果有多个选项，显示下拉框
                            <select
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                              value={task.taskType}
                              onChange={(e) => handleTaskChange(index, 'taskType', e.target.value)}
                              required
                              disabled={!task.submissionCategory}
                            >
                              <option value="">{t('forms.placeholder.select')}</option>
                              {getTaskTypeOptions(task.submissionCategory).map((taskType) => (
                                <option key={taskType.key} value={taskType.key}>
                                  {t(taskType.value)}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {index > 0 && (
                          <button 
                            type="button" 
                            onClick={() => removeTask(index)} 
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            删除
                          </button>
                        )}
                        <button type="button" onClick={() => toggleTaskCollapsed(index)} className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                          {task.collapsed ? t('forms.action.expand') : t('forms.action.collapse')}
                        </button>
                      </div>
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
                          {task.screenshot ? (
                            // 显示已选择的文件
                            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{task.screenshot.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {(task.screenshot.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const url = URL.createObjectURL(task.screenshot!);
                                      window.open(url, '_blank');
                                    }}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                  >
                                    预览
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleTaskChange(index, 'screenshot', null)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                  >
                                    删除
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            // 文件上传区域
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
                          )}
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
                              {t('forms.achievement.description')} {isDescriptionRequired(task.taskType) && (<span className="text-red-500">{t('forms.required')}</span>)}
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

                        {/* 视图计数字段 - 仅对原创类任务显示 */}
                        {task.submissionCategory === 'long' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              当前浏览量 <span className="text-red-500">{t('forms.required')}</span>
                            </label>
                            <input
                              type="number"
                              min="0"
                              placeholder="请输入当前浏览量"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                              value={task.viewCount}
                              onChange={(e) => handleTaskChange(index, 'viewCount', e.target.value)}
                              required={task.submissionCategory === 'long'}
                            />
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              请准确填写当前浏览量，活动结束后将进行复核验证
                            </p>
                          </div>
                        )}
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
                disabled={loading || !isAuthenticated || !!success || isSubmissionClosed}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg ${
                  loading || !isAuthenticated || !!success || isSubmissionClosed
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transform hover:-translate-y-1 hover:shadow-xl'
                }`}
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
                  t('forms.submit.achievement')
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

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
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { formService, userService, taskSubmissionService, activityApplicationService } from '../../services';
import type { ApplicationForm, LoginUserVO, UserUpdateMyRequest, TaskSubmissionVO, ActivityApplication } from '../../types/api';

// 统一的提交历史类型
interface SubmissionHistoryItem {
  id: number;
  type: 'application' | 'task' | 'activity';
  title: string;
  status: number;
  reviewMessage?: string;
  createTime: string;
  data: ApplicationForm | TaskSubmissionVO | ActivityApplication;
}

export default function Profile() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // 构建图片URL的辅助函数
  const buildImageUrl = (screenshot: string) => {
    if (screenshot.startsWith('http')) {
      // Vercel Blob URL或完整URL直接使用
      console.log('🔗 使用完整URL:', screenshot);
      return screenshot;
    }
    if (screenshot.startsWith('/api/')) {
      // 兼容旧的本地存储格式
      if (screenshot.includes('?filepath=')) {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8101'}${screenshot}`;
        console.log('🔗 构建图片URL (旧格式):', { original: screenshot, built: url });
        return url;
      } else {
        const pathPart = screenshot.replace('/api/file/download', '');
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8101'}/api/file/download?filepath=${pathPart}`;
        console.log('🔗 构建图片URL (旧格式转换):', { original: screenshot, pathPart, built: url });
        return url;
      }
    }
    // 相对路径
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8101/api'}${screenshot}`;
    console.log('🔗 构建图片URL (相对路径):', { original: screenshot, built: url });
    return url;
  };
  const [submissions, setSubmissions] = useState<ApplicationForm[]>([]);
  const [submissionHistory, setSubmissionHistory] = useState<SubmissionHistoryItem[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionHistoryItem | null>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [userInfo, setUserInfo] = useState<LoginUserVO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    userName: '',
    walletAddress: ''
  });

  // 获取用户详细信息
  const fetchUserInfo = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await userService.getLoginUser();
      setUserInfo(response);
      // 初始化编辑表单数据
      setEditForm({
        userName: response.userName || '',
        walletAddress: response.walletAddress || ''
      });
    } catch (error: any) {
      console.error('获取用户信息失败:', error);
      setError(error.message || t('profile.error.fetch.user.info'));
    }
  };

  // 开始编辑
  const handleStartEdit = () => {
    setIsEditing(true);
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setIsEditing(false);
    // 恢复原始数据
    if (userInfo) {
      setEditForm({
        userName: userInfo.userName || '',
        walletAddress: userInfo.walletAddress || ''
      });
    }
  };

  // 保存编辑
  const handleSaveEdit = async () => {
    if (!userInfo) return;

    setEditLoading(true);
    try {
      const updateData: UserUpdateMyRequest = {
        userName: editForm.userName,
        walletAddress: editForm.walletAddress
        // 注意：userEmail 不包含在更新数据中，因为邮箱不可修改
      };

      await userService.updateMyInfo(updateData);
      
      // 重新获取用户信息
      await fetchUserInfo();
      setIsEditing(false);
      
      // 显示成功提示
      setError('');
      setSuccess('用户信息更新成功！');
      
      // 3秒后自动隐藏成功提示
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error: any) {
      console.error('更新用户信息失败:', error);
      setError(error.message || t('profile.error.update.user.info'));
    } finally {
      setEditLoading(false);
    }
  };

  // 处理表单输入变化
  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 获取用户的表单提交记录
  const fetchUserSubmissions = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await formService.getMyForms({
        current: 1,
        pageSize: 10
      });
      setSubmissions(response.records);
    } catch (error: any) {
      setError(error.message || t('profile.error.fetch.submissions'));
    } finally {
      setLoading(false);
    }
  };

  // 获取所有提交历史
  const fetchAllSubmissionHistory = async () => {
    if (!isAuthenticated) return;
    
    try {
      console.log('🔄 开始获取个人中心提交历史数据...');
      
      const [applicationForms, taskSubmissions, activityApplications] = await Promise.all([
        formService.getMyForms({ current: 1, pageSize: 20 }),
        taskSubmissionService.getMyTaskSubmissions({ current: 1, pageSize: 20 }),
        activityApplicationService.getMyApplications({ current: 1, pageSize: 20 })
      ]);

      // 详细的调试信息
      console.log('📊 个人中心数据获取结果:', {
        applicationForms: {
          total: applicationForms.total,
          records: applicationForms.records.length,
          data: applicationForms.records
        },
        taskSubmissions: {
          total: taskSubmissions.total,
          records: taskSubmissions.records.length,
          data: taskSubmissions.records
        },
        activityApplications: {
          total: activityApplications.total,
          records: activityApplications.records.length,
          data: activityApplications.records
        }
      });

      const history: SubmissionHistoryItem[] = [];

      // 添加申请表
      applicationForms.records.forEach(form => {
        history.push({
          id: form.id,
          type: 'application',
          title: t('profile.submission.application'),
          status: form.status,
          reviewMessage: form.reviewMessage,
          createTime: form.createTime,
          data: form
        });
      });

      // 添加任务提交
      console.log('📝 处理任务提交数据:', taskSubmissions.records);
      taskSubmissions.records.forEach(task => {
        console.log('📝 添加任务提交到历史:', {
          id: task.id,
          name: task.name,
          createTime: task.createTime,
          reviewStatus: task.reviewStatus
        });
        history.push({
          id: task.id,
          type: 'task',
          title: t('profile.submission.achievement'),
          status: task.reviewStatus || 0,
          reviewMessage: task.reviewMessage, // 使用任务提交的审核信息
          createTime: task.createTime,
          data: task
        });
      });

      // 添加活动申请
      activityApplications.records.forEach(activity => {
        history.push({
          id: activity.id,
          type: 'activity',
          title: t('profile.submission.activity'),
          status: activity.reviewStatus || 0,
          reviewMessage: activity.reviewMessage,
          createTime: activity.createTime,
          data: activity
        });
      });

      // 按创建时间排序（最新的在前）
      history.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
      
      console.log('📋 最终提交历史记录:', {
        totalCount: history.length,
        records: history.map(item => ({
          id: item.id,
          type: item.type,
          title: item.title,
          createTime: item.createTime,
          status: item.status
        }))
      });
      
      setSubmissionHistory(history);
    } catch (error: any) {
      console.error('获取提交历史失败:', error);
      setError(error.message || t('profile.submission.fetch.error'));
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // 并行获取用户信息和提交记录
    Promise.all([
      fetchUserInfo(),
      fetchUserSubmissions(),
      fetchAllSubmissionHistory()
    ]).catch(error => {
      console.error('获取数据失败:', error);
    });
  }, [isAuthenticated, router]);

  // 显示提交详情弹窗
  const handleShowSubmissionDetail = (submission: SubmissionHistoryItem) => {
    setSelectedSubmission(submission);
    setShowSubmissionModal(true);
  };

  // 关闭提交详情弹窗
  const handleCloseSubmissionModal = () => {
    setShowSubmissionModal(false);
    setSelectedSubmission(null);
  };


  const getTitleText = (userLevel?: number) => {
    switch(userLevel) {
      case 1: return t('profile.title.explorer'); // 探索者
      case 2: return t('profile.title.pathfinder'); // 探路者
      case 3: return t('profile.title.trailblazer'); // 开路者
      case 4: return t('profile.title.pioneer'); // 先驱者
      default: return t('profile.title.explorer'); // 默认为探索者
    }
  };

  const getFormTypeText = (formType: number) => {
    switch(formType) {
      case 1: return t('profile.submission.application');
      case 2: return t('profile.submission.activity');
      case 3: return t('profile.submission.achievement');
      default: return t('profile.submission.unknown.type');
    }
  };

  const getStatusText = (status: number) => {
    switch(status) {
      case 0: return t('admin.status.pending');
      case 1: return t('admin.status.approved');
      case 2: return t('admin.status.rejected');
      default: return t('profile.submission.unknown.status');
    }
  };

  const getStatusColor = (status: number) => {
    switch(status) {
      case 0: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 1: return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 2: return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  if (!isAuthenticated) {
    return null; // 重定向到登录页
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('profile.page.title')}</h1>
        </div>

        {/* 用户信息卡片 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('profile.basic.info')}</h2>
          
          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl p-4 mb-6 shadow-lg animate-pulse">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* 成功提示 */}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl p-4 mb-6 shadow-lg animate-bounce">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-green-700 dark:text-green-300">{success}</p>
                </div>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-300">{t('profile.loading')}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profile.username')}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.userName}
                  onChange={(e) => handleInputChange('userName', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('profile.username.placeholder')}
                />
              ) : (
                <p className="mt-1 text-gray-900 dark:text-white">{userInfo?.userName || user?.userName || t('profile.not.set')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profile.email')}</label>
              <div className="mt-1 flex items-center">
                <p className="text-gray-900 dark:text-white flex-1">{userInfo?.userEmail || user?.userEmail || t('profile.not.set')}</p>
                {isEditing && (
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {t('profile.email.not.editable')}
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profile.user.title')}</label>
              <p className="mt-1 text-emerald-600 dark:text-emerald-400 font-semibold">{getTitleText(userInfo?.userLevel)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Footprint</label>
              <p className="mt-1 text-blue-600 dark:text-blue-400 font-bold">{userInfo?.userPoints || 0}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profile.wallet')}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.walletAddress}
                  onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder={t('profile.wallet.placeholder')}
                />
              ) : (
                <p className="mt-1 text-gray-900 dark:text-white font-mono text-sm">{userInfo?.walletAddress || t('profile.not.set')}</p>
              )}
            </div>
          </div>
          )}
          
          <div className="mt-6 flex space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  disabled={editLoading}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {editLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('profile.saving')}
                    </>
                  ) : (
                    t('profile.save')
                  )}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={editLoading}
                  className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('profile.cancel')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleStartEdit}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  {t('profile.edit.info')}
                </button>
                <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                  {t('profile.change.password')}
                </button>
              </>
            )}
          </div>
        </div>


        {/* 提交历史 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('profile.submission.history')}</h2>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4">
              <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-300">{t('profile.loading.submissions')}</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('profile.submission.formtype')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('profile.submission.status.label')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('profile.submission.reviewinfo')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('profile.submission.points')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('profile.submission.submitdate')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('profile.submission.operation')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {submissionHistory.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        {t('profile.submission.no.records')}
                      </td>
                    </tr>
                  ) : (
                    submissionHistory.map((submission) => {
                      // 获取积分
                      let score = 0;
                      if (submission.type === 'task' && (submission.data as TaskSubmissionVO).reviewScore) {
                        score = (submission.data as TaskSubmissionVO).reviewScore!;
                      } else if (submission.type === 'activity' && (submission.data as ActivityApplication).reviewScore) {
                        score = (submission.data as ActivityApplication).reviewScore!;
                      } else if (submission.type === 'application' && (submission.data as ApplicationForm).reviewScore) {
                        score = (submission.data as ApplicationForm).reviewScore!;
                      }

                      return (
                        <tr key={`${submission.type}-${submission.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {submission.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(submission.status)}`}>
                              {getStatusText(submission.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {submission.reviewMessage || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {score > 0 ? (
                              <span className="text-green-600 dark:text-green-400 font-semibold">+{score}</span>
                            ) : score === 0 ? (
                              <span className="text-gray-600 dark:text-gray-400">0</span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(submission.createTime).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleShowSubmissionDetail(submission)}
                              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              {t('profile.submission.view.details')}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-6">
            <a href="/forms" className="text-blue-600 hover:text-blue-500 font-medium">
              {t('profile.continue.submit')}
            </a>
          </div>
        </div>
      </div>

      {/* 提交详情弹窗 */}
      {showSubmissionModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl transform animate-scaleIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedSubmission.title} - {t('profile.submission.details')}
              </h3>
              <button
                onClick={handleCloseSubmissionModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('profile.submission.basic.info')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.time')}：</span>
                    <span className="text-sm text-gray-900 dark:text-white ml-2">
                      {new Date(selectedSubmission.createTime).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.status.label')}：</span>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedSubmission.status)}`}>
                      {getStatusText(selectedSubmission.status)}
                    </span>
                  </div>
                  {selectedSubmission.reviewMessage && (
                    <div className="md:col-span-2">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.reviewinfo.label')}：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {selectedSubmission.reviewMessage}
                      </span>
                    </div>
                  )}
                  {selectedSubmission.type === 'task' && (selectedSubmission.data as TaskSubmissionVO).reviewScore !== undefined && (
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.points.earned')}：</span>
                      <span className="text-sm ml-2 font-semibold">
                        {(selectedSubmission.data as TaskSubmissionVO).reviewScore! > 0 ? (
                          <span className="text-green-600 dark:text-green-400">+{(selectedSubmission.data as TaskSubmissionVO).reviewScore}</span>
                        ) : (
                          <span className="text-gray-600 dark:text-gray-400">{(selectedSubmission.data as TaskSubmissionVO).reviewScore}</span>
                        )}
                      </span>
                    </div>
                  )}
                  {selectedSubmission.type === 'activity' && (selectedSubmission.data as ActivityApplication).reviewScore !== undefined && (
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.points.earned')}：</span>
                      <span className="text-sm ml-2 font-semibold">
                        {(selectedSubmission.data as ActivityApplication).reviewScore! > 0 ? (
                          <span className="text-green-600 dark:text-green-400">+{(selectedSubmission.data as ActivityApplication).reviewScore}</span>
                        ) : (
                          <span className="text-gray-600 dark:text-gray-400">{(selectedSubmission.data as ActivityApplication).reviewScore}</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 表单详情 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('profile.submission.form.details')}</h4>
                {selectedSubmission.type === 'application' && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.name')}：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as ApplicationForm).name}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.email')}：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as ApplicationForm).email}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Twitter：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as ApplicationForm).twitterUsername}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Telegram：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as ApplicationForm).telegramUsername || t('admin.review.not.filled')}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.wallet')}：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as ApplicationForm).walletAddress || t('admin.review.not.filled')}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.web3role')}：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as ApplicationForm).web3Role || t('admin.review.not.filled')}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.expertise')}：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as ApplicationForm).expertise || t('admin.review.not.filled')}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.motivation')}：</span>
                      <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                        {(selectedSubmission.data as ApplicationForm).motivation || t('admin.review.not.filled')}
                      </div>
                    </div>
                  </div>
                )}

                {selectedSubmission.type === 'task' && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.name')}：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as TaskSubmissionVO).name}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.email')}：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as TaskSubmissionVO).email}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Twitter：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as TaskSubmissionVO).twitterUsername}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.category')}：</span>
                      <div className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as TaskSubmissionVO).tasks?.map((task, index) => (
                          <span key={index} className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs mr-1 mb-1">
                            {task.submissionCategory}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.task.details')}：</span>
                      <div className="mt-2 space-y-2">
                        {(selectedSubmission.data as TaskSubmissionVO).tasks?.map((task, index) => (
                          <div key={index} className="p-3 bg-white dark:bg-gray-600 rounded border">
                            <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                              {t('profile.submission.task')} {index + 1}: {task.taskType}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                              <div>{t('profile.submission.completion.date')}: {new Date(task.completionDate).toLocaleDateString()}</div>
                              {task.contentLink && <div>{t('profile.submission.content.link')}: <a href={task.contentLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{task.contentLink}</a></div>}
                              {task.description && <div>{t('profile.submission.description')}: {task.description}</div>}
                              {task.screenshot && task.screenshot.trim() && (
                                <div className="mt-2">
                                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('profile.submission.screenshot')}：</div>
                                  <div className="relative inline-block">
                                    <img 
                                      src={buildImageUrl(task.screenshot)}
                                      alt={t('profile.submission.task.screenshot')}
                                      className="max-w-xs max-h-48 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
                                      onClick={() => {
                                        if (task.screenshot) {
                                          const url = buildImageUrl(task.screenshot);
                                          window.open(url, '_blank');
                                        }
                                      }}
                                      onError={(e) => {
                                        console.error('图片加载失败:', {
                                          originalPath: task.screenshot,
                                          builtUrl: task.screenshot ? buildImageUrl(task.screenshot) : 'undefined',
                                          apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
                                          error: e,
                                          timestamp: new Date().toISOString()
                                        });
                                        e.currentTarget.style.display = 'none';
                                      }}
                                      onLoad={() => {
                                        console.log('图片加载成功:', task.screenshot ? buildImageUrl(task.screenshot) : 'undefined');
                                      }}
                                    />
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('profile.submission.click.view.image')}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedSubmission.type === 'activity' && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.activity.theme')}：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as ActivityApplication).activityTheme}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.activity.organizer')}：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as ActivityApplication).organizer}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.activity.type')}：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as ActivityApplication).activityType}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.activity.time')}：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as ActivityApplication).activityTime}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.activity.location')}：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as ActivityApplication).activityLocation}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.activity.scale')}：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as ActivityApplication).activityScale}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.activity.introduction')}：</span>
                      <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                        {(selectedSubmission.data as ActivityApplication).briefIntroduction}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.activity.goals')}：</span>
                      <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                        {(selectedSubmission.data as ActivityApplication).activityGoals}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseSubmissionModal}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
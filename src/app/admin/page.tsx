'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { formService, taskSubmissionService, activityApplicationService, userService } from '../../services';
import type { ApplicationForm, TaskSubmissionVO, ActivityApplication } from '../../types/api';

// 统一的待审核表单类型
interface PendingSubmission {
  id: number;
  type: 'application' | 'task' | 'activity';
  title: string;
  userName: string;
  userEmail: string;
  status: number;
  createTime: string;
  data: ApplicationForm | TaskSubmissionVO | ActivityApplication;
}

// 统一的已审核表单类型
interface ReviewedSubmission {
  id: number;
  type: 'application' | 'task' | 'activity';
  title: string;
  userName: string;
  userEmail: string;
  status: number;
  createTime: string;
  reviewTime: string;
  reviewMessage: string;
  reviewScore: number;
  data: ApplicationForm | TaskSubmissionVO | ActivityApplication;
}

export default function Admin() {
  const { t, formatDate } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('forms');
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([]);
  const [reviewedSubmissions, setReviewedSubmissions] = useState<ReviewedSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<PendingSubmission | null>(null);
  const [selectedReviewedSubmission, setSelectedReviewedSubmission] = useState<ReviewedSubmission | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReviewedModal, setShowReviewedModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    reviewMessage: '',
    points: 0
  });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewedLoading, setReviewedLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 统计数据状态
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingForms: 0,
    approvedForms: 0,
    rejectedForms: 0,
    totalPoints: 0,
    totalSubmissions: 0
  });

  // 获取所有待审核表单
  const fetchPendingSubmissions = async () => {
    try {
      setLoading(true);
      setError(''); // 清除之前的错误
      
      const [applicationForms, taskSubmissions, activityApplications] = await Promise.all([
        formService.getFormList({ status: 0, current: 1, pageSize: 20 }), // 0-待审核
        taskSubmissionService.getAllTaskSubmissions({ current: 1, pageSize: 20 }), // 获取所有，然后过滤
        activityApplicationService.getAllApplications({ reviewStatus: 0, current: 1, pageSize: 20 }) // 0-待审核
      ]);

      const pending: PendingSubmission[] = [];

      // 添加待审核的申请表
      applicationForms.records.forEach(form => {
        if (form && form.id) {
          pending.push({
            id: form.id,
            type: 'application',
            title: '申请表',
            userName: form.name || '未知用户',
            userEmail: form.email || '',
            status: form.status,
            createTime: form.createTime || new Date().toISOString(),
            data: form
          });
        }
      });

      // 添加待审核的任务提交
      taskSubmissions.records
        .filter(task => task && task.id && (task.reviewStatus || 0) === 0)
        .forEach(task => {
          pending.push({
            id: task.id,
            type: 'task',
            title: '成果提交表',
            userName: task.name || '未知用户',
            userEmail: task.email || '',
            status: task.reviewStatus || 0,
            createTime: task.createTime || new Date().toISOString(),
            data: task
          });
        });

      // 添加待审核的活动申请
      activityApplications.records.forEach(activity => {
        if (activity && activity.id) {
          pending.push({
            id: activity.id,
            type: 'activity',
            title: '活动申请表',
            userName: activity.organizer || '未知用户',
            userEmail: activity.email || '',
            status: activity.reviewStatus || 0,
            createTime: activity.createTime || new Date().toISOString(),
            data: activity
          });
        }
      });

      // 按创建时间排序（最新的在前）
      pending.sort((a, b) => {
        const timeA = new Date(a.createTime).getTime();
        const timeB = new Date(b.createTime).getTime();
        return timeB - timeA;
      });
      
      setPendingSubmissions(pending);
    } catch (error: any) {
      console.error('获取待审核表单失败:', error);
      setError(error.message || '获取待审核表单失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取所有已审核表单
  const fetchReviewedSubmissions = async () => {
    try {
      setReviewedLoading(true);
      setError(''); // 清除之前的错误
      
      // 并行获取所有已审核的表单数据
      const [approvedForms, rejectedForms, taskSubmissions, approvedActivities, rejectedActivities] = await Promise.all([
        formService.getFormList({ status: 1, current: 1, pageSize: 20 }), // 已通过的申请表
        formService.getFormList({ status: 2, current: 1, pageSize: 20 }), // 已拒绝的申请表
        taskSubmissionService.getAllTaskSubmissions({ current: 1, pageSize: 20 }), // 所有任务提交
        activityApplicationService.getAllApplications({ reviewStatus: 1, current: 1, pageSize: 20 }), // 已通过的活动申请
        activityApplicationService.getAllApplications({ reviewStatus: 2, current: 1, pageSize: 20 })  // 已拒绝的活动申请
      ]);

      const reviewed: ReviewedSubmission[] = [];

      // 添加已审核的申请表（通过和拒绝）
      [...approvedForms.records, ...rejectedForms.records].forEach(form => {
        if (form && form.id) {
          reviewed.push({
            id: form.id,
            type: 'application',
            title: '申请表',
            userName: form.name || '未知用户',
            userEmail: form.email || '',
            status: form.status,
            createTime: form.createTime || new Date().toISOString(),
            reviewTime: form.updateTime || form.createTime || new Date().toISOString(),
            reviewMessage: form.reviewMessage || '',
            reviewScore: form.reviewScore || 0,
            data: form
          });
        }
      });

      // 添加已审核的任务提交（通过和拒绝）
      taskSubmissions.records
        .filter(task => task && task.id && (task.reviewStatus || 0) !== 0)
        .forEach(task => {
          reviewed.push({
            id: task.id,
            type: 'task',
            title: '成果提交表',
            userName: task.name || '未知用户',
            userEmail: task.email || '',
            status: task.reviewStatus || 0,
            createTime: task.createTime || new Date().toISOString(),
            reviewTime: task.updateTime || task.createTime || new Date().toISOString(),
            reviewMessage: task.reviewMessage || '',
            reviewScore: task.reviewScore || 0,
            data: task
          });
        });

      // 添加已审核的活动申请（通过和拒绝）
      [...approvedActivities.records, ...rejectedActivities.records].forEach(activity => {
        if (activity && activity.id) {
          reviewed.push({
            id: activity.id,
            type: 'activity',
            title: '活动申请表',
            userName: activity.organizer || '未知用户',
            userEmail: activity.email || '',
            status: activity.reviewStatus || 0,
            createTime: activity.createTime || new Date().toISOString(),
            reviewTime: activity.updateTime || activity.createTime || new Date().toISOString(),
            reviewMessage: activity.reviewMessage || '',
            reviewScore: activity.reviewScore || 0,
            data: activity
          });
        }
      });

      // 按审核时间排序（最新的在前）
      reviewed.sort((a, b) => {
        const timeA = new Date(a.reviewTime).getTime();
        const timeB = new Date(b.reviewTime).getTime();
        return timeB - timeA;
      });
      
      setReviewedSubmissions(reviewed);
    } catch (error: any) {
      console.error('获取已审核表单失败:', error);
      setError(error.message || '获取已审核表单失败');
    } finally {
      setReviewedLoading(false);
    }
  };

  // 获取统计数据
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      setError(''); // 清除之前的错误
      
      // 并行获取所有统计数据（使用后端允许的最大pageSize）
      const [
        usersData,
        pendingFormsData,
        approvedFormsData,
        rejectedFormsData,
        taskSubmissionsData,
        approvedActivitiesData,
        rejectedActivitiesData
      ] = await Promise.all([
        userService.getUserList({ current: 1, pageSize: 20 }), // 获取用户（后端限制20）
        formService.getFormList({ status: 0, current: 1, pageSize: 20 }), // 待审核申请表
        formService.getFormList({ status: 1, current: 1, pageSize: 20 }), // 已通过申请表
        formService.getFormList({ status: 2, current: 1, pageSize: 20 }), // 已拒绝申请表
        taskSubmissionService.getAllTaskSubmissions({ current: 1, pageSize: 20 }), // 所有任务提交（后端限制20）
        activityApplicationService.getAllApplications({ reviewStatus: 1, current: 1, pageSize: 20 }), // 已通过活动申请
        activityApplicationService.getAllApplications({ reviewStatus: 2, current: 1, pageSize: 20 })  // 已拒绝活动申请
      ]);

      // 计算统计数据
      const totalUsers = usersData.total;
      const pendingForms = pendingFormsData.total;
      const approvedForms = approvedFormsData.total;
      const rejectedForms = rejectedFormsData.total;
      
      // 计算待审核的任务提交（从当前页面的记录中计算，可能不准确）
      const pendingTasks = taskSubmissionsData.records.filter(task => (task.reviewStatus || 0) === 0).length;
      
      // 计算待审核的活动申请
      const pendingActivities = 0; // 活动申请没有待审核状态，只有通过和拒绝
      
      // 计算总积分（从当前页面的用户记录中计算，可能不准确）
      const totalPoints = usersData.records.reduce((sum, user) => {
        return sum + (user.userTotalPoints || 0);
      }, 0);
      
      // 计算总提交数
      const totalSubmissions = approvedForms + rejectedForms + 
                              taskSubmissionsData.total + 
                              approvedActivitiesData.total + rejectedActivitiesData.total;

      setStats({
        totalUsers,
        pendingForms: pendingForms + pendingTasks + pendingActivities,
        approvedForms: approvedForms + approvedActivitiesData.total,
        rejectedForms: rejectedForms + rejectedActivitiesData.total,
        totalPoints,
        totalSubmissions
      });
    } catch (error: any) {
      console.error('获取统计数据失败:', error);
      setError(error.message || '获取统计数据失败');
    } finally {
      setStatsLoading(false);
    }
  };

  // 显示审核弹窗
  const handleShowReviewModal = (submission: PendingSubmission) => {
    setSelectedSubmission(submission);
    setReviewForm({
      reviewMessage: '',
      points: 0
    });
    setShowReviewModal(true);
  };

  // 关闭审核弹窗
  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setSelectedSubmission(null);
    setReviewForm({
      reviewMessage: '',
      points: 0
    });
  };

  // 显示已审核表单详情弹窗
  const handleShowReviewedModal = (submission: ReviewedSubmission) => {
    setSelectedReviewedSubmission(submission);
    setShowReviewedModal(true);
  };

  // 关闭已审核表单详情弹窗
  const handleCloseReviewedModal = () => {
    setShowReviewedModal(false);
    setSelectedReviewedSubmission(null);
  };

  // 提交审核结果
  const handleSubmitReview = async (status: number) => {
    if (!selectedSubmission) return;

    setReviewLoading(true);
    try {
      if (selectedSubmission.type === 'application') {
        await formService.reviewForm({
          formId: selectedSubmission.id,
          status: status,
          reviewComment: reviewForm.reviewMessage,
          score: status === 1 ? reviewForm.points : 0
        });
      } else if (selectedSubmission.type === 'task') {
        await taskSubmissionService.updateTaskSubmission({
          id: selectedSubmission.id,
          reviewStatus: status,
          reviewMessage: reviewForm.reviewMessage,
          reviewScore: status === 1 ? reviewForm.points : 0
        });
      } else if (selectedSubmission.type === 'activity') {
        await activityApplicationService.reviewApplication({
          id: selectedSubmission.id,
          reviewStatus: status,
          reviewMessage: reviewForm.reviewMessage,
          reviewScore: status === 1 ? reviewForm.points : 0
        });
      }

      // 重新获取待审核表单
      await fetchPendingSubmissions();
      handleCloseReviewModal();
    } catch (error: any) {
      console.error('审核失败:', error);
      setError(error.message || '审核失败');
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.userRole === 'admin') {
      if (activeTab === 'forms') {
        fetchPendingSubmissions();
      } else if (activeTab === 'reviewed') {
        fetchReviewedSubmissions();
      } else if (activeTab === 'stats') {
        fetchStats();
      }
    }
  }, [isAuthenticated, user, activeTab]);

  // 权限检查
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">请先登录</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">您需要登录后才能访问管理员页面</p>
          <a 
            href="/login" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            去登录
          </a>
        </div>
      </div>
    );
  }

  if (user?.userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">权限不足</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">您没有权限访问管理员页面</p>
          <a 
            href="/" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回首页
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('admin.page.title')}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">{t('admin.page.subtitle')}</p>
        </div>

        {/* 标签页 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('forms')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'forms'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                待审核表单
              </button>
              <button
                onClick={() => setActiveTab('reviewed')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'reviewed'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                已审核表单
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'stats'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {t('admin.tab.stats')}
              </button>
            </nav>
          </div>
        </div>

        {/* 表单审核 */}
        {activeTab === 'forms' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">待审核表单</h2>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4">
                <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-300">加载中...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        用户
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        表单类型
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        提交日期
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {pendingSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                          暂无待审核表单
                        </td>
                      </tr>
                    ) : (
                      pendingSubmissions.map((submission) => (
                        <tr key={`${submission.type}-${submission.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            <div>
                              <div className="font-medium">{submission.userName}</div>
                              <div className="text-gray-500 text-xs">{submission.userEmail}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {submission.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(submission.createTime).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 rounded-full">
                              待审核
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleShowReviewModal(submission)}
                              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              审核
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 已审核表单 */}
        {activeTab === 'reviewed' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">已审核表单</h2>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4">
                <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
              </div>
            )}
            
            {reviewedLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-300">加载中...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        用户
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        表单类型
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        提交日期
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        审核日期
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        积分
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {reviewedSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                          暂无已审核表单
                        </td>
                      </tr>
                    ) : (
                      reviewedSubmissions.map((submission) => (
                        <tr key={`${submission.type}-${submission.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            <div>
                              <div className="font-medium">{submission.userName}</div>
                              <div className="text-gray-500 text-xs">{submission.userEmail}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {submission.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(submission.createTime).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(submission.reviewTime).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              submission.status === 1 
                                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                            }`}>
                              {submission.status === 1 ? '已通过' : '已拒绝'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {submission.reviewScore > 0 ? (
                              <span className="text-green-600 dark:text-green-400 font-semibold">+{submission.reviewScore}</span>
                            ) : submission.reviewScore === 0 ? (
                              <span className="text-gray-600 dark:text-gray-400">0</span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleShowReviewedModal(submission)}
                              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              查看详情
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 数据统计 */}
        {activeTab === 'stats' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">数据统计</h2>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4">
                <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
              </div>
            )}
            
            {statsLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-300">加载统计数据中...</span>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 主要统计卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalUsers}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">总用户数</div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.pendingForms}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">待审核表单</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{stats.approvedForms}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">已通过表单</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalPoints}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">总积分</div>
                  </div>
                </div>

                {/* 详细统计 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">表单统计</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">待审核表单</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.pendingForms}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">已通过表单</span>
                        <span className="text-sm font-medium text-green-600">{stats.approvedForms}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">已拒绝表单</span>
                        <span className="text-sm font-medium text-red-600">{stats.rejectedForms}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">总提交数</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.totalSubmissions}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">用户统计</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">总用户数</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.totalUsers}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">总积分</span>
                        <span className="text-sm font-medium text-purple-600">{stats.totalPoints}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">平均积分</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {stats.totalUsers > 0 ? Math.round(stats.totalPoints / stats.totalUsers) : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 审核弹窗 */}
      {showReviewModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl transform animate-scaleIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                审核 {selectedSubmission.title}
              </h3>
              <button
                onClick={handleCloseReviewModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* 用户信息 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">用户信息</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">姓名：</span>
                    <span className="text-sm text-gray-900 dark:text-white ml-2">{selectedSubmission.userName}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">邮箱：</span>
                    <span className="text-sm text-gray-900 dark:text-white ml-2">{selectedSubmission.userEmail}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">提交时间：</span>
                    <span className="text-sm text-gray-900 dark:text-white ml-2">
                      {new Date(selectedSubmission.createTime).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 表单详情 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">表单详情</h4>
                {selectedSubmission.type === 'application' && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Twitter：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as ApplicationForm).twitterUsername}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Web3角色：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as ApplicationForm).web3Role || '未填写'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">申请动机：</span>
                      <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                        {(selectedSubmission.data as ApplicationForm).motivation || '未填写'}
                      </div>
                    </div>
                  </div>
                )}

                {selectedSubmission.type === 'task' && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Twitter：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as TaskSubmissionVO).twitterUsername}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">提交类别：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as TaskSubmissionVO).submissionCategory}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">任务详情：</span>
                      <div className="mt-2 space-y-2">
                        {(selectedSubmission.data as TaskSubmissionVO).tasks?.map((task, index) => (
                          <div key={index} className="p-3 bg-white dark:bg-gray-600 rounded border">
                            <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                              任务 {index + 1}: {task.taskType}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                              <div>完成日期: {new Date(task.completionDate).toLocaleDateString()}</div>
                              {task.contentLink && <div>内容链接: <a href={task.contentLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{task.contentLink}</a></div>}
                              {task.description && <div>描述: {task.description}</div>}
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
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">活动主题：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as ActivityApplication).activityTheme}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">活动时间：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as ActivityApplication).activityTime}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">活动地点：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as ActivityApplication).activityLocation}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">活动目标：</span>
                      <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                        {(selectedSubmission.data as ActivityApplication).activityGoals}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 审核表单 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">审核意见</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      审核意见
                    </label>
                    <textarea
                      value={reviewForm.reviewMessage}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, reviewMessage: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="请输入审核意见..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      积分奖励（通过时填写）
                    </label>
                    <input
                      type="number"
                      value={reviewForm.points}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入积分数量"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleCloseReviewModal}
                disabled={reviewLoading}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleSubmitReview(2)}
                disabled={reviewLoading}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {reviewLoading ? '处理中...' : '拒绝'}
              </button>
              <button
                onClick={() => handleSubmitReview(1)}
                disabled={reviewLoading}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {reviewLoading ? '处理中...' : '通过'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 已审核表单详情弹窗 */}
      {showReviewedModal && selectedReviewedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl transform animate-scaleIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                已审核 {selectedReviewedSubmission.title}
              </h3>
              <button
                onClick={handleCloseReviewedModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* 用户信息 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">用户信息</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">姓名：</span>
                    <span className="text-sm text-gray-900 dark:text-white ml-2">{selectedReviewedSubmission.userName}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">邮箱：</span>
                    <span className="text-sm text-gray-900 dark:text-white ml-2">{selectedReviewedSubmission.userEmail}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">提交时间：</span>
                    <span className="text-sm text-gray-900 dark:text-white ml-2">
                      {new Date(selectedReviewedSubmission.createTime).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">审核时间：</span>
                    <span className="text-sm text-gray-900 dark:text-white ml-2">
                      {new Date(selectedReviewedSubmission.reviewTime).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 审核结果 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">审核结果</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">审核状态：</span>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                      selectedReviewedSubmission.status === 1 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}>
                      {selectedReviewedSubmission.status === 1 ? '已通过' : '已拒绝'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">积分奖励：</span>
                    <span className="text-sm text-gray-900 dark:text-white ml-2">
                      {selectedReviewedSubmission.reviewScore > 0 ? (
                        <span className="text-green-600 dark:text-green-400 font-semibold">+{selectedReviewedSubmission.reviewScore}</span>
                      ) : selectedReviewedSubmission.reviewScore === 0 ? (
                        <span className="text-gray-600 dark:text-gray-400">0</span>
                      ) : (
                        '无'
                      )}
                    </span>
                  </div>
                </div>
                {selectedReviewedSubmission.reviewMessage && (
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">审核意见：</span>
                    <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                      {selectedReviewedSubmission.reviewMessage}
                    </div>
                  </div>
                )}
              </div>

              {/* 表单详情 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">表单详情</h4>
                {selectedReviewedSubmission.type === 'application' && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Twitter：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedReviewedSubmission.data as ApplicationForm).twitterUsername}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Web3角色：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedReviewedSubmission.data as ApplicationForm).web3Role || '未填写'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">申请动机：</span>
                      <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                        {(selectedReviewedSubmission.data as ApplicationForm).motivation || '未填写'}
                      </div>
                    </div>
                  </div>
                )}

                {selectedReviewedSubmission.type === 'task' && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Twitter：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedReviewedSubmission.data as TaskSubmissionVO).twitterUsername}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">提交类别：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedReviewedSubmission.data as TaskSubmissionVO).submissionCategory}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">任务详情：</span>
                      <div className="mt-2 space-y-2">
                        {(selectedReviewedSubmission.data as TaskSubmissionVO).tasks?.map((task, index) => (
                          <div key={index} className="p-3 bg-white dark:bg-gray-600 rounded border">
                            <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                              任务 {index + 1}: {task.taskType}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                              <div>完成日期: {new Date(task.completionDate).toLocaleDateString()}</div>
                              {task.contentLink && <div>内容链接: <a href={task.contentLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{task.contentLink}</a></div>}
                              {task.description && <div>描述: {task.description}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedReviewedSubmission.type === 'activity' && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">活动主题：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedReviewedSubmission.data as ActivityApplication).activityTheme}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">活动时间：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedReviewedSubmission.data as ActivityApplication).activityTime}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">活动地点：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedReviewedSubmission.data as ActivityApplication).activityLocation}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">活动目标：</span>
                      <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                        {(selectedReviewedSubmission.data as ActivityApplication).activityGoals}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseReviewedModal}
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
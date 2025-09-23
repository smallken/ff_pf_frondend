'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { formService, userService, taskSubmissionService, activityApplicationService } from '../../services';
import { launchContestService } from '../../services/launchContestService';
import { mintContestService } from '../../services/mintContestService';
import type { ApplicationForm, LoginUserVO, UserUpdateMyRequest, TaskSubmissionVO, ActivityApplication } from '../../types/api';
import MonthlyRewardProgress from '../components/MonthlyRewardProgress';
import MonthlyRewardHistory from '../components/MonthlyRewardHistory';

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
  const [hasApproved, setHasApproved] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    userName: '',
    userEmail: '',
    twitterUsername: '',
    telegramUsername: '',
    walletAddress: '',
    emailVerificationCode: ''
  });
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [emailVerificationLoading, setEmailVerificationLoading] = useState(false);

  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // 每页显示10条
  const [totalRecords, setTotalRecords] = useState(0);
  const [allSubmissionHistory, setAllSubmissionHistory] = useState<SubmissionHistoryItem[]>([]);

  // Launch和Mint大赛表单状态
  const [launchRegistrations, setLaunchRegistrations] = useState<any[]>([]);
  const [mintRegistrations, setMintRegistrations] = useState<any[]>([]);
  const [launchDDQuestionnaires, setLaunchDDQuestionnaires] = useState<any[]>([]);
  const [contestFormsLoading, setContestFormsLoading] = useState(false);
  
  // 弹窗相关状态
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingWalletAddress, setEditingWalletAddress] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [editingRewardAddress, setEditingRewardAddress] = useState(false);
  const [rewardAddress, setRewardAddress] = useState('');

  // 安全的日期格式化函数
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  // 处理表单点击显示弹窗
  const handleFormClick = (form: any, type: 'launch' | 'mint' | 'dd') => {
    setSelectedForm({ ...form, type });
    setWalletAddress(form.walletAddress || '');
    setEditingWalletAddress(false);
    setShowFormModal(true);
  };

  // 关闭弹窗
  const handleCloseModal = () => {
    setShowFormModal(false);
    setSelectedForm(null);
    setEditingWalletAddress(false);
    setWalletAddress('');
    setEditingRewardAddress(false);
    setRewardAddress('');
  };

  // 保存钱包地址修改
  const handleSaveWalletAddress = async () => {
    if (!selectedForm || selectedForm.type !== 'mint') return;
    
    try {
      console.log('🔄 开始更新钱包地址:', { id: selectedForm.id, walletAddress });
      
      // 调用API更新钱包地址
      await mintContestService.updateRegistration(selectedForm.id, {
        mainWalletAddress: walletAddress
      });
      
      console.log('✅ 钱包地址更新成功');
      
      // 立即更新selectedForm状态，避免显示旧数据
      setSelectedForm(prev => ({
        ...prev,
        mainWalletAddress: walletAddress
      }));
      
      setEditingWalletAddress(false);
      
      // 刷新数据
      await fetchContestForms();
      
      alert('钱包地址更新成功！');
    } catch (error) {
      console.error('❌ 更新钱包地址失败:', error);
      alert('更新失败，请重试');
    }
  };

  // 保存奖励发放地址修改
  const handleSaveRewardAddress = async () => {
    if (!selectedForm || selectedForm.type !== 'mint') return;
    
    try {
      console.log('🔄 开始更新奖励发放地址:', { id: selectedForm.id, rewardAddress });
      
      // 调用API更新奖励发放地址
      await mintContestService.updateRegistration(selectedForm.id, {
        rewardWalletAddress: rewardAddress
      });
      
      console.log('✅ 奖励发放地址更新成功');
      
      // 立即更新selectedForm状态，避免显示旧数据
      setSelectedForm(prev => ({
        ...prev,
        rewardWalletAddress: rewardAddress
      }));
      
      setEditingRewardAddress(false);
      
      // 刷新数据
      await fetchContestForms();
      
      alert('奖励发放地址更新成功！');
    } catch (error) {
      console.error('❌ 更新奖励发放地址失败:', error);
      alert('更新失败，请重试');
    }
  };

  // 获取用户详细信息
  const fetchUserInfo = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await userService.getLoginUser();
      setUserInfo(response);
      // 初始化编辑表单数据
      setEditForm({
        userName: response.userName || '',
        userEmail: response.userEmail || '',
        twitterUsername: response.twitterUsername || '',
        telegramUsername: response.telegramUsername || '',
        walletAddress: response.walletAddress || '',
        emailVerificationCode: ''
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
        userEmail: userInfo.userEmail || '',
        twitterUsername: userInfo.twitterUsername || '',
        telegramUsername: userInfo.telegramUsername || '',
        walletAddress: userInfo.walletAddress || '',
        emailVerificationCode: ''
      });
    }
  };

  // 保存编辑
  const handleSaveEdit = async () => {
    if (!userInfo) return;

    setEditLoading(true);
    setError('');
    setSuccess('');

    try {
      // 检查字段重复性
      const duplicateErrors = [];
      let hasApiError = false;
      
      // 检查推特用户名重复
      if (editForm.twitterUsername && editForm.twitterUsername.trim()) {
        try {
          console.log('🔍 检查推特用户名:', editForm.twitterUsername.trim());
          const twitterResult = await userService.checkFieldUniqueWithError('twitterUsername', editForm.twitterUsername.trim());
          console.log('🔍 推特用户名检查结果:', twitterResult);
          if (!twitterResult.isUnique && twitterResult.errorMessage) {
            console.log('🔍 推特用户名重复错误:', twitterResult.errorMessage);
            duplicateErrors.push(twitterResult.errorMessage);
          }
        } catch (error: any) {
          console.error('❌ 推特用户名检查失败:', error);
          hasApiError = true;
        }
      }
      
      // 检查Telegram用户名重复
      if (editForm.telegramUsername && editForm.telegramUsername.trim()) {
        try {
          console.log('🔍 检查Telegram用户名:', editForm.telegramUsername.trim());
          const telegramResult = await userService.checkFieldUniqueWithError('telegramUsername', editForm.telegramUsername.trim());
          console.log('🔍 Telegram用户名检查结果:', telegramResult);
          if (!telegramResult.isUnique && telegramResult.errorMessage) {
            console.log('🔍 Telegram用户名重复错误:', telegramResult.errorMessage);
            duplicateErrors.push(telegramResult.errorMessage);
          }
        } catch (error: any) {
          console.error('❌ Telegram用户名检查失败:', error);
          hasApiError = true;
        }
      }
      
      // 检查钱包地址重复
      if (editForm.walletAddress && editForm.walletAddress.trim()) {
        try {
          console.log('🔍 检查钱包地址:', editForm.walletAddress.trim());
          const walletResult = await userService.checkFieldUniqueWithError('walletAddress', editForm.walletAddress.trim());
          console.log('🔍 钱包地址检查结果:', walletResult);
          if (!walletResult.isUnique && walletResult.errorMessage) {
            console.log('🔍 钱包地址重复错误:', walletResult.errorMessage);
            duplicateErrors.push(walletResult.errorMessage);
          }
        } catch (error: any) {
          console.error('❌ 钱包地址检查失败:', error);
          hasApiError = true;
        }
      }
      
      // 检查邮箱重复
      if (editForm.userEmail && editForm.userEmail.trim()) {
        try {
          console.log('🔍 检查邮箱:', editForm.userEmail.trim());
          const emailResult = await userService.checkFieldUniqueWithError('userEmail', editForm.userEmail.trim());
          console.log('🔍 邮箱检查结果:', emailResult);
          if (!emailResult.isUnique && emailResult.errorMessage) {
            console.log('🔍 邮箱重复错误:', emailResult.errorMessage);
            duplicateErrors.push(emailResult.errorMessage);
          }
        } catch (error: any) {
          console.error('❌ 邮箱检查失败:', error);
          hasApiError = true;
        }
      }
      
      console.log('🔍 重复错误列表:', duplicateErrors);
      console.log('🔍 是否有API错误:', hasApiError);
      
      // 如果有重复字段，显示具体的重复错误信息
      if (duplicateErrors.length > 0) {
        const combinedError = duplicateErrors.join('；');
        console.log('🔍 设置重复错误:', combinedError);
        setError(combinedError);
        setEditLoading(false);
        return;
      }
      
      // 如果没有重复字段但有API错误，显示通用错误
      if (hasApiError) {
        console.log('❌ 有API错误但没有重复字段，显示通用错误');
        setError('检查信息重复性失败，请重试');
        setEditLoading(false);
        return;
      }

      // 执行更新操作
      const updateData: UserUpdateMyRequest = {
        userName: editForm.userName,
        userEmail: editForm.userEmail,
        twitterUsername: editForm.twitterUsername,
        telegramUsername: editForm.telegramUsername,
        walletAddress: editForm.walletAddress
      };

      console.log('🔍 发送更新请求:', updateData);
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

  // 发送邮箱验证码
  const handleSendEmailVerificationCode = async () => {
    if (!editForm.userEmail) {
      setError('请先输入邮箱地址');
      return;
    }

    setEmailVerificationLoading(true);
    try {
      await userService.sendEmailVerificationCode(editForm.userEmail);
      setEmailVerificationSent(true);
      setSuccess('验证码已发送到您的邮箱，请查收');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      console.error('发送验证码失败:', error);
      setError(error.message || '发送验证码失败');
    } finally {
      setEmailVerificationLoading(false);
    }
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

  // 检查是否已有通过的报名申请表
  const fetchHasApproved = async () => {
    try {
      const approved = await formService.hasApprovedApplication();
      setHasApproved(approved);
    } catch (e) {
      setHasApproved(false);
    }
  };

  // 获取Launch和Mint大赛表单数据
  const fetchContestForms = async () => {
    if (!isAuthenticated) return;
    
    setContestFormsLoading(true);
    try {
      console.log('🔄 开始获取Launch和Mint大赛表单数据...');
      
      const [launchRegs, mintRegs, ddQuestionnaires] = await Promise.all([
        launchContestService.getMyRegistrations(10, 1).catch(err => {
          console.warn('获取Launch大赛登记失败:', err);
          return { data: { records: [], total: 0 } };
        }),
        mintContestService.getMyRegistrations(10, 1).catch(err => {
          console.warn('获取Mint大赛登记失败:', err);
          return { data: { records: [], total: 0 } };
        }),
        launchContestService.getMyDDQuestionnaires(10, 1).catch(err => {
          console.warn('获取DD问答清单失败:', err);
          return { data: { records: [], total: 0 } };
        })
      ]);

      console.log('📊 大赛表单数据获取结果:', {
        launchRegistrations: launchRegs.data.records.length,
        mintRegistrations: mintRegs.data.records.length,
        ddQuestionnaires: ddQuestionnaires.data.records.length
      });

      // 详细日志DD问答清单数据
      console.log('🔍 DD问答清单详细数据:', ddQuestionnaires.data.records);
      ddQuestionnaires.data.records.forEach((dd, index) => {
        console.log(`DD问答清单 ${index + 1}:`, {
          id: dd.id,
          projectName: dd.projectName,
          tokenContractAddress: dd.tokenContractAddress,
          trackCategory: dd.trackCategory,
          status: dd.status,
          keyDataAtT0: dd.keyDataAtT0 ? '已填写' : '未填写',
          trafficContribution: dd.trafficContribution ? '已填写' : '未填写',
          projectQuality: dd.projectQuality ? '已填写' : '未填写',
          narrativeConsensus: dd.narrativeConsensus ? '已填写' : '未填写',
          teamEfficiency: dd.teamEfficiency ? '已填写' : '未填写',
          nextSteps: dd.nextSteps ? '已填写' : '未填写'
        });
      });

      setLaunchRegistrations(launchRegs.data.records);
      setMintRegistrations(mintRegs.data.records);
      setLaunchDDQuestionnaires(ddQuestionnaires.data.records);
    } catch (error: any) {
      console.error('获取大赛表单数据失败:', error);
    } finally {
      setContestFormsLoading(false);
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
      
      // 存储所有历史记录
      setAllSubmissionHistory(history);
      setTotalRecords(history.length);
      
      // 计算当前页显示的数据
      updateCurrentPageData(history, 1);
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
      fetchAllSubmissionHistory(),
      fetchHasApproved(),
      fetchContestForms()
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

  // 更新当前页显示的数据
  const updateCurrentPageData = (allData: SubmissionHistoryItem[], page: number) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentPageData = allData.slice(startIndex, endIndex);
    setSubmissionHistory(currentPageData);
  };

  // 处理分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateCurrentPageData(allSubmissionHistory, page);
  };

  // 计算总页数
  const totalPages = Math.ceil(totalRecords / pageSize);


  // 根据userLevel获取称号
  const getTitleByLevel = (userLevel?: number) => {
    switch(userLevel) {
      case 1: return t('profile.title.explorer'); // 探索者
      case 2: return t('profile.title.pathfinder'); // 探路者
      case 3: return t('profile.title.trailblazer'); // 开路者
      case 4: return t('profile.title.pioneer'); // 先驱者
      default: return t('profile.title.explorer'); // 默认为探索者
    }
  };

  // 获取称号对应的颜色
  const getTitleColorByLevel = (userLevel?: number) => {
    switch(userLevel) {
      case 1: return 'text-blue-600 dark:text-blue-400'; // 探索者 - 蓝色
      case 2: return 'text-green-600 dark:text-green-400'; // 探路者 - 绿色
      case 3: return 'text-yellow-600 dark:text-yellow-400'; // 开路者 - 黄色
      case 4: return 'text-purple-600 dark:text-purple-400'; // 先驱者 - 紫色
      default: return 'text-blue-600 dark:text-blue-400'; // 默认为探索者 - 蓝色
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

        {/* 主要内容区域 - 两列布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧主要内容 */}
          <div className="lg:col-span-2 space-y-8">

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
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="email"
                    value={editForm.userEmail}
                    onChange={(e) => handleInputChange('userEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('profile.email.placeholder')}
                  />
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={editForm.emailVerificationCode}
                      onChange={(e) => handleInputChange('emailVerificationCode', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="邮箱验证码"
                    />
                    <button
                      type="button"
                      onClick={handleSendEmailVerificationCode}
                      disabled={emailVerificationLoading || !editForm.userEmail}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {emailVerificationLoading ? '发送中...' : '发送验证码'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-1 text-gray-900 dark:text-white">{userInfo?.userEmail || user?.userEmail || t('profile.not.set')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profile.user.title')}</label>
              <p className={`mt-1 font-semibold ${hasApproved ? getTitleColorByLevel(1) : 'text-gray-500 dark:text-gray-400'}`}>
                {hasApproved ? t('profile.title.explorer') : t('profile.title.none')}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Footprint</label>
              <p className="mt-1 text-blue-600 dark:text-blue-400 font-bold">{userInfo?.userPoints || 0}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Twitter</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.twitterUsername}
                  onChange={(e) => handleInputChange('twitterUsername', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="@username"
                />
              ) : (
                <p className="mt-1 text-gray-900 dark:text-white">{userInfo?.twitterUsername || t('profile.not.set')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telegram</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.telegramUsername}
                  onChange={(e) => handleInputChange('telegramUsername', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="@username"
                />
              ) : (
                <p className="mt-1 text-gray-900 dark:text-white">{userInfo?.telegramUsername || t('profile.not.set')}</p>
              )}
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

        {/* 月度奖励进度 */}
        <MonthlyRewardProgress />

        {/* 历史奖励记录 */}
        <MonthlyRewardHistory />

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

          {/* 分页组件 */}
          {totalRecords > pageSize && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                显示第 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalRecords)} 条，共 {totalRecords} 条记录
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  上一页
                </button>
                
                {/* 页码按钮 */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <a href="/forms" className="text-blue-600 hover:text-blue-500 font-medium">
              {t('profile.continue.submit')}
            </a>
          </div>
        </div>
          </div>

          {/* 右侧Launch和Mint大赛表单区域 */}
          <div className="lg:col-span-1 space-y-6">
            {/* Launch大赛表单 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="text-cyan-500 mr-2">🚀</span>
                Launch大赛表单
              </h3>
              
              {contestFormsLoading ? (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-600"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-300 text-sm">加载中...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 参赛登记 */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">参赛登记</h4>
                    {launchRegistrations.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">暂无登记记录</p>
                    ) : (
                      <div className="space-y-2">
                        {launchRegistrations.map((reg, index) => (
                          <div 
                            key={reg.id || index} 
                            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            onClick={() => handleFormClick(reg, 'launch')}
                          >
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {reg.projectName || '未命名项目'}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              赛道: {reg.trackCategory || '未选择'}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              提交时间: {formatDate(reg.createTime)}
                            </div>
                            <div className="mt-2 flex justify-between items-center">
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                                已提交
                              </span>
                              <span className="text-xs text-blue-600 dark:text-blue-400">点击查看</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-3">
                      <a href="/launch-contest/registration" className="text-cyan-600 hover:text-cyan-500 text-sm font-medium">
                        去参赛登记 →
                      </a>
                    </div>
                  </div>

                  {/* DD问答清单 */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">DD问答清单</h4>
                    {launchDDQuestionnaires.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">暂无问答记录</p>
                    ) : (
                      <div className="space-y-2">
                        {launchDDQuestionnaires.map((dd, index) => (
                          <div 
                            key={dd.id || index} 
                            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            onClick={() => handleFormClick(dd, 'dd')}
                          >
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {dd.projectName || '未命名项目'}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              状态: {dd.status === 'submitted' ? '已提交' : '草稿'}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              提交时间: {formatDate(dd.createTime)}
                            </div>
                            <div className="mt-2 flex justify-between items-center">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                dd.status === 'submitted' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                              }`}>
                                {dd.status === 'submitted' ? '已提交' : '草稿'}
                              </span>
                              <span className="text-xs text-blue-600 dark:text-blue-400">点击查看</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-3">
                      <a href="/launch-contest/dd-questionnaire" className="text-cyan-600 hover:text-cyan-500 text-sm font-medium">
                        去填写问答 →
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mint大赛表单 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="text-pink-500 mr-2">🎨</span>
                Mint大赛表单
              </h3>
              
              {contestFormsLoading ? (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-300 text-sm">加载中...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {mintRegistrations.length === 0 ? (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">暂无参赛记录</p>
                      <div className="space-y-2">
                        <a href="/mint-contest/studio" className="block w-full text-center bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors text-sm">
                          工作室组报名
                        </a>
                        <a href="/mint-contest/individual" className="block w-full text-center bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors text-sm">
                          个人组报名
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {mintRegistrations.map((reg, index) => (
                        <div 
                          key={reg.id || index} 
                          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          onClick={() => handleFormClick(reg, 'mint')}
                        >
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {reg.displayName || '未命名项目'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            类别: {reg.trackType === 'studio' ? '工作室组' : '个人组'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            邮箱: {reg.email}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Telegram: {reg.telegramAccount}
                          </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              提交时间: {formatDate(reg.createTime)}
                            </div>
                            <div className="mt-2 flex justify-between items-center">
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                                已提交
                              </span>
                              <span className="text-xs text-blue-600 dark:text-blue-400">点击查看</span>
                            </div>
                        </div>
                      ))}
                      <div className="mt-3">
                        <a href="/mint-contest/registration" className="text-pink-600 hover:text-pink-500 text-sm font-medium">
                          去报名参赛 →
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 提交详情弹窗 */}
      {showSubmissionModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl transform transition-all duration-300 ease-out scale-100 opacity-100 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">📋</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedSubmission.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t('profile.submission.details')}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseSubmissionModal}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors duration-200 group"
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-8">
              {/* 基本信息 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 border border-blue-100 dark:border-gray-600">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">ℹ️</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{t('profile.submission.basic.info')}</h4>
                </div>
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

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={handleCloseSubmissionModal}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 大赛表单详情弹窗 */}
      {showFormModal && selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl transform transition-all duration-300 ease-out scale-100 opacity-100 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedForm.type === 'launch' ? 'bg-gradient-to-r from-cyan-500 to-blue-600' :
                  selectedForm.type === 'mint' ? 'bg-gradient-to-r from-pink-500 to-purple-600' :
                  'bg-gradient-to-r from-green-500 to-teal-600'
                }`}>
                  <span className="text-white font-bold text-lg">
                    {selectedForm.type === 'launch' ? '🚀' : selectedForm.type === 'mint' ? '🎨' : '📋'}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedForm.type === 'launch' && 'Launch大赛参赛登记'}
                    {selectedForm.type === 'mint' && 'Mint大赛参赛登记'}
                    {selectedForm.type === 'dd' && 'DD问答清单'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    表单详情
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors duration-200 group"
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Launch大赛表单详情 */}
              {selectedForm.type === 'launch' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">项目名称</label>
                      <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        {selectedForm.projectName || '未填写'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">代币名称</label>
                      <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        {selectedForm.tokenName || '未填写'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">代币合约地址</label>
                      <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        {selectedForm.tokenContractAddress || '未填写'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">代币Logo</label>
                      <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        {selectedForm.tokenLogo ? (
                          <img 
                            src={selectedForm.tokenLogo} 
                            alt="代币Logo" 
                            className="w-16 h-16 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                              if (nextSibling) {
                                nextSibling.style.display = 'block';
                              }
                            }}
                          />
                        ) : (
                          <span className="text-gray-500">未上传</span>
                        )}
                        <span style={{display: 'none'}} className="text-red-500">Logo加载失败</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">所属赛道</label>
                      <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        {selectedForm.trackCategory || '未选择'}
                      </div>
                    </div>
                    {selectedForm.otherTrackName && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">其他赛道名称</label>
                        <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          {selectedForm.otherTrackName}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">提交时间</label>
                      <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        {formatDate(selectedForm.createTime)}
                      </div>
                    </div>
                  </div>
                  
                  {/* 项目信息 */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 border border-blue-100 dark:border-gray-600">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">🌐</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">项目信息</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">项目网站</label>
                        <div className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-600 p-3 rounded-lg">
                          {selectedForm.website ? (
                            <a href={selectedForm.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                              {selectedForm.website}
                            </a>
                          ) : (
                            '未填写'
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twitter</label>
                        <div className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-600 p-3 rounded-lg">
                          {selectedForm.twitter ? (
                            <a href={selectedForm.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                              {selectedForm.twitter}
                            </a>
                          ) : (
                            '未填写'
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telegram</label>
                        <div className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-600 p-3 rounded-lg">
                          {selectedForm.telegram ? (
                            <a href={selectedForm.telegram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                              {selectedForm.telegram}
                            </a>
                          ) : (
                            '未填写'
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">团队规模</label>
                        <div className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-600 p-3 rounded-lg">
                          {selectedForm.teamSize || '未填写'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 联系人信息 */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 border border-green-100 dark:border-gray-600">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">👤</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">联系人信息</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">联系人姓名</label>
                        <div className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-600 p-3 rounded-lg">
                          {selectedForm.contactName || '未填写'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">职位角色</label>
                        <div className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-600 p-3 rounded-lg">
                          {selectedForm.contactRole || '未填写'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">联系人Telegram</label>
                        <div className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-600 p-3 rounded-lg">
                          {selectedForm.contactTelegram ? (
                            <a href={selectedForm.contactTelegram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                              {selectedForm.contactTelegram}
                            </a>
                          ) : (
                            '未填写'
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">联系人邮箱</label>
                        <div className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-600 p-3 rounded-lg">
                          {selectedForm.contactEmail ? (
                            <a href={`mailto:${selectedForm.contactEmail}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                              {selectedForm.contactEmail}
                            </a>
                          ) : (
                            '未填写'
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mint大赛表单详情 */}
              {selectedForm.type === 'mint' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">显示名称</label>
                      <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        {selectedForm.displayName || '未填写'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">参赛类别</label>
                      <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        {selectedForm.trackType === 'studio' ? '工作室组' : '个人组'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">联系邮箱</label>
                      <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        {selectedForm.email || '未填写'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twitter账号</label>
                      <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        {selectedForm.twitterAccount || '未填写'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telegram账号</label>
                      <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        {selectedForm.telegramAccount || '未填写'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">提交时间</label>
                      <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        {formatDate(selectedForm.createTime)}
                      </div>
                    </div>
                  </div>
                  
                  {/* 钱包地址 - 可编辑 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">钱包地址</label>
                    {editingWalletAddress ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={walletAddress}
                          onChange={(e) => setWalletAddress(e.target.value)}
                          className="flex-1 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 p-3 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="请输入钱包地址"
                        />
                        <button
                          onClick={handleSaveWalletAddress}
                          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm"
                        >
                          保存
                        </button>
                        <button
                          onClick={() => setEditingWalletAddress(false)}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                        >
                          取消
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          {selectedForm.mainWalletAddress || '未填写'}
                        </div>
                        <button
                          onClick={() => {
                            setEditingWalletAddress(true);
                            setWalletAddress(selectedForm.mainWalletAddress || '');
                          }}
                          className="px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm"
                        >
                          编辑
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 奖励发放地址 - 可编辑 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">奖励发放地址</label>
                    {editingRewardAddress ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={rewardAddress}
                          onChange={(e) => setRewardAddress(e.target.value)}
                          className="flex-1 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 p-3 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="请输入奖励发放地址"
                        />
                        <button
                          onClick={handleSaveRewardAddress}
                          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm"
                        >
                          保存
                        </button>
                        <button
                          onClick={() => setEditingRewardAddress(false)}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                        >
                          取消
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          {selectedForm.rewardWalletAddress || '未填写'}
                        </div>
                        <button
                          onClick={() => {
                            setEditingRewardAddress(true);
                            setRewardAddress(selectedForm.rewardWalletAddress || '');
                          }}
                          className="px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm"
                        >
                          编辑
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* DD问答清单详情 */}
              {selectedForm.type === 'dd' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">项目名称</label>
                      <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        {selectedForm.projectName || '未填写'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">代币合约地址</label>
                      <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        {selectedForm.tokenContractAddress || '未填写'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">所属赛道</label>
                      <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        {selectedForm.trackCategory || '未选择'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">状态</label>
                      <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        {selectedForm.status === 'submitted' ? '已提交' : '草稿'}
                      </div>
                    </div>
                    {selectedForm.otherTrackName && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">其他赛道名称</label>
                        <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          {selectedForm.otherTrackName}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">提交时间</label>
                      <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        {formatDate(selectedForm.createTime)}
                      </div>
                    </div>
                  </div>
                  
                  {/* 项目评估详情 */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 border border-orange-100 dark:border-gray-600">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">📈</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">项目评估详情</h4>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">T0关键数据</label>
                        <div className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-600 p-3 rounded-lg">
                          {selectedForm.keyDataAtT0 || '未填写'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">流量贡献</label>
                        <div className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-600 p-3 rounded-lg">
                          {selectedForm.trafficContribution || '未填写'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">项目质量</label>
                        <div className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-600 p-3 rounded-lg">
                          {selectedForm.projectQuality || '未填写'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">叙事与共识</label>
                        <div className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-600 p-3 rounded-lg">
                          {selectedForm.narrativeConsensus || '未填写'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">团队效率</label>
                        <div className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-600 p-3 rounded-lg">
                          {selectedForm.teamEfficiency || '未填写'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">下一步规划</label>
                        <div className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-600 p-3 rounded-lg">
                          {selectedForm.nextSteps || '未填写'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
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
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  formService, 
  taskSubmissionService, 
  activityApplicationService, 
  userService, 
  monthlyRewardService, 
  monthlyPointService, 
  adminUnifiedService 
} from '../../services';
import type { 
  ApplicationForm, 
  TaskSubmissionVO, 
  ActivityApplication, 
  AdminStatsVO, 
  MonthlyPointVO,
  UnifiedSubmissionVO
} from '../../types/api';
import AdminMonthlyReward from '../components/AdminMonthlyReward';
import { API_CONFIG } from '../../config/api';

// 统一的待审核表单类型
interface PendingSubmission {
  id: number;
  type: 'application' | 'task' | 'activity';
  title: string;
  userName: string;
  userEmail: string;
  status: number;
  createTime: string;
  rawTime?: string; // 原始时间字段，用于调试
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
  const { t, formatDate, language } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  
  // 构建图片URL的辅助函数
  const buildImageUrl = (screenshot: string) => {
    if (screenshot.startsWith('http')) {
      // Vercel Blob URL或完整URL直接使用
      return screenshot;
    }
    if (screenshot.startsWith('/api/')) {
      // 兼容旧的本地存储格式
      if (screenshot.includes('?filepath=')) {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8101'}${screenshot}`;
        return url;
      } else {
        const pathPart = screenshot.replace('/api/file/download', '');
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8101'}/api/file/download?filepath=${pathPart}`;
        return url;
      }
    }
    // 相对路径
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8101/api'}${screenshot}`;
    return url;
  };
  const [activeTab, setActiveTab] = useState('forms');
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([]);
  const [pendingPageSize, setPendingPageSize] = useState(20);
  const [pendingCurrentPage, setPendingCurrentPage] = useState(1);
  const [pendingTotal, setPendingTotal] = useState(0); // 待审核表单总数（加载的数量）
  const [pendingActualTotal, setPendingActualTotal] = useState(0); // 实际总数（数据库中的真实数量）
  const [reviewedSubmissions, setReviewedSubmissions] = useState<ReviewedSubmission[]>([]);
  const [allReviewedSubmissions, setAllReviewedSubmissions] = useState<ReviewedSubmission[]>([]); // 存储所有数据
  const [selectedSubmission, setSelectedSubmission] = useState<PendingSubmission | null>(null);
  const [selectedReviewedSubmission, setSelectedReviewedSubmission] = useState<ReviewedSubmission | null>(null);
  
  // 已审核表单分页状态
  const [reviewedCurrentPage, setReviewedCurrentPage] = useState(1);
  const [reviewedPageSize] = useState(20);
  const [reviewedTotal, setReviewedTotal] = useState(0); // 实际总数
  const [reviewedLoadedCount, setReviewedLoadedCount] = useState(0); // 已加载数量
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReviewedModal, setShowReviewedModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    reviewMessage: '',
    points: 0
  });

  const handlePendingPageChange = (page: number) => {
    const target = Math.max(1, Math.min(page, pendingPageCount));
    console.log('📄 分页点击:', { 
      requestedPage: page, 
      targetPage: target, 
      currentPage: pendingCurrentPage,
      pageCount: pendingPageCount,
      total: pendingTotal
    });
    
    if (target !== pendingCurrentPage) {
      setPendingCurrentPage(target);
      // 切换页面时保持当前排序
      if (sortConfig) {
        console.log('📄 调用API - 带排序:', { page: target, sortConfig });
        fetchPendingSubmissions(target, sortConfig.key, sortConfig.direction);
      } else {
        console.log('📄 调用API - 默认排序:', { page: target });
        fetchPendingSubmissions(target);
      }
    } else {
      console.log('📄 页面未变化，跳过API调用');
    }
  };

  const handlePendingPageSizeChange = (size: number) => {
    if (size !== pendingPageSize) {
      setPendingPageSize(size);
      setPendingCurrentPage(1);
      
      // 切换页面大小时保持当前排序
      if (sortConfig) {
        fetchPendingSubmissions(1, sortConfig.key, sortConfig.direction);
      } else {
        // 默认排序
        fetchPendingSubmissions(1);
      }
    }
  };
  const [reviewLoading, setReviewLoading] = useState(false);
  const [monthlyPoint, setMonthlyPoint] = useState<MonthlyPointVO | null>(null);
  const [monthlyPointLoading, setMonthlyPointLoading] = useState(false);
  const [monthlyPointError, setMonthlyPointError] = useState('');

  const MONTHLY_POINT_LIMIT = 50;

  const getMonthlyPointValue = () => monthlyPoint?.point ?? 0;
  const getMonthlyPointAvailable = () => Math.max(0, MONTHLY_POINT_LIMIT - getMonthlyPointValue());

  // 贡献参考表显示状态
  const [showContributionReference, setShowContributionReference] = useState(false);
  
  // 4种提交类别次数状态
  const [categoryCounts, setCategoryCounts] = useState({
    promotion: 0,
    short: 0,
    long: 0,
    community: 0
  });
  
  // 编辑已审核表单的状态
  const [isEditingReviewed, setIsEditingReviewed] = useState(false);
  const [editReviewedForm, setEditReviewedForm] = useState({
    status: 1,
    reviewMessage: '',
    reviewScore: 0
  });
  
  // 编辑类别次数的状态
  const [isEditingCategoryCounts, setIsEditingCategoryCounts] = useState(false);
  const [editCategoryCounts, setEditCategoryCounts] = useState({
    promotion: 0,
    short: 0,
    long: 0,
    community: 0
  });
  const [originalCategoryCounts, setOriginalCategoryCounts] = useState({
    promotion: 0,
    short: 0,
    long: 0,
    community: 0
  });
  const [editReviewedLoading, setEditReviewedLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewedLoading, setReviewedLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // 筛选状态
  const [filters, setFilters] = useState({
    user: '',
    formType: '',
    status: '',
    dateRange: ''
  });

  // 排序状态 - 默认按时间倒序（早的在前）
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>({ key: 'createTime', direction: 'asc' });

  // 已审核表单排序状态
  const [reviewedSortConfig, setReviewedSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // 排序函数
  const handleSort = (key: string) => {
    // 允许所有字段切换升序/降序
    let direction: 'asc' | 'desc';
    
    // 正常切换排序方向
    direction = sortConfig && sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    
    // 更新排序状态
    setSortConfig({ key, direction });
    console.log('🔍 应用排序:', { 字段: key, 方向: direction });
    
    // 重置到第一页
    setPendingCurrentPage(1);
    
    // 获取新数据
    fetchPendingSubmissions(1, key, direction);
  };
  
  // 排序当前页数据
  const sortPendingSubmissions = () => {
    if (!sortConfig || !pendingSubmissions.length) return;
    
    const sortedData = [...pendingSubmissions];
    
    sortedData.sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      // 根据排序字段获取对应的值
      switch(sortConfig.key) {
        case 'userName':
          valueA = String(a.userName || '').toLowerCase();
          valueB = String(b.userName || '').toLowerCase();
          break;
        case 'formType':
          valueA = a.type || '';
          valueB = b.type || '';
          break;
        case 'createTime':
          try {
            // 深入调试日期处理
            console.log('📅 深入调试日期处理:', {
              A_raw: a.createTime,
              B_raw: b.createTime
            });
            
            // 防止空字符串或undefined
            const strA = a.createTime || '';
            const strB = b.createTime || '';
            
            // 注意：日期格式如果不是ISO格式，不同浏览器可能转换不一致
            // 直接使用Date.parse而不是new Date()构造函数
            const timeA = Date.parse(strA);
            const timeB = Date.parse(strB);
            
            // 如果不是有效时间戳，则用字符串比较
            if (isNaN(timeA) || isNaN(timeB)) {
              console.warn('❗ 日期解析失败，切换到字符串比较:', { strA, strB });
              valueA = strA;
              valueB = strB;
            } else {
              valueA = timeA;
              valueB = timeB;
              console.log('✅ 日期比较成功:', { 
                timeA: new Date(timeA).toISOString(), 
                timeB: new Date(timeB).toISOString(),
                result: timeA - timeB 
              });
            }
          } catch (e) {
            console.error('🚫 日期比较异常:', e);
            // 出错时使用字符串比较
            valueA = String(a.createTime || '');
            valueB = String(b.createTime || '');
          }
          break;
        default:
          valueA = a.createTime || '';
          valueB = b.createTime || '';
          break;
      }
      
      // 调试日期排序
      if (sortConfig.key === 'createTime') {
        console.log('🗓️ 日期排序调试:', {
          A_raw: a.createTime,
          A_time: new Date(a.createTime || '').getTime(),
          A_date: new Date(a.createTime || '').toISOString(),
          B_raw: b.createTime,
          B_time: new Date(b.createTime || '').getTime(),
          B_date: new Date(b.createTime || '').toISOString(),
          comparison: valueA - valueB
        });
      }
      
      // 如果排序字段是日期，打印更多调试信息
      if (sortConfig.key === 'createTime') {
        console.log('📅 排序方向:', {
          direction: sortConfig.direction,
          valueA,
          valueB,
          comparison: valueA < valueB ? '小于' : (valueA > valueB ? '大于' : '等于'),
          result: valueA < valueB ? 
            (sortConfig.direction === 'asc' ? -1 : 1) : 
            (valueA > valueB ? (sortConfig.direction === 'asc' ? 1 : -1) : 0)
        });
      }
      
      // 根据排序方向返回比较结果
      if (valueA < valueB) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    // 更新排序后的数据
    setPendingSubmissions(sortedData);
    
    console.log('🔍 前端排序完成：', { 
      字段: sortConfig.key, 
      方向: sortConfig.direction,
      首个记录: sortedData.length > 0 ? {
        类型: sortedData[0].type,
        时间: sortedData[0].createTime,
        日期: new Date(sortedData[0].createTime || '').toLocaleString()
      } : null,
      尾个记录: sortedData.length > 0 ? {
        类型: sortedData[sortedData.length-1].type,
        时间: sortedData[sortedData.length-1].createTime,
        日期: new Date(sortedData[sortedData.length-1].createTime || '').toLocaleString()
      } : null
    });
  };

  // 已审核表单排序函数
  const handleReviewedSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (reviewedSortConfig && reviewedSortConfig.key === key && reviewedSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setReviewedSortConfig({ key, direction });
  };

    
  // 计算分页信息
  const pendingPageCount = Math.max(1, Math.ceil(pendingTotal / pendingPageSize));
  const pendingRangeStart = pendingTotal === 0 ? 0 : (pendingCurrentPage - 1) * pendingPageSize + 1;
  const pendingRangeEnd = pendingTotal === 0 ? 0 : Math.min(pendingCurrentPage * pendingPageSize, pendingTotal);

  // 基于所有数据进行筛选
  const filteredAllReviewedSubmissions = allReviewedSubmissions.filter(submission => {
    if (filters.user && !submission.userName.toLowerCase().includes(filters.user.toLowerCase()) && 
        !submission.userEmail.toLowerCase().includes(filters.user.toLowerCase())) {
      return false;
    }
    if (filters.formType && submission.title !== filters.formType) {
      return false;
    }
    if (filters.status && submission.status.toString() !== filters.status) {
      return false;
    }
    if (filters.dateRange) {
      const submissionDate = new Date(submission.createTime).toDateString();
      const filterDate = new Date(filters.dateRange).toDateString();
      if (submissionDate !== filterDate) {
        return false;
      }
    }
    return true;
  });

  // 已审核表单排序
  const sortedFilteredAllReviewedSubmissions = useMemo(() => {
    let sorted = [...filteredAllReviewedSubmissions];
    
    if (reviewedSortConfig) {
      sorted.sort((a, b) => {
        let aValue: any;
        let bValue: any;
        
        switch (reviewedSortConfig.key) {
          case 'createTime':
            aValue = new Date(a.createTime).getTime();
            bValue = new Date(b.createTime).getTime();
            break;
          case 'reviewTime':
            aValue = new Date(a.reviewTime).getTime();
            bValue = new Date(b.reviewTime).getTime();
            break;
          case 'userName':
            aValue = a.userName.toLowerCase();
            bValue = b.userName.toLowerCase();
            break;
          case 'formType':
            aValue = a.type;
            bValue = b.type;
            break;
          default:
            return 0;
        }
        
        if (aValue < bValue) {
          return reviewedSortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return reviewedSortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    } else {
      // 默认按创建时间倒序排列
      sorted.sort((a, b) => {
        const timeA = new Date(a.createTime).getTime();
        const timeB = new Date(b.createTime).getTime();
        return timeB - timeA;
      });
    }
    
    return sorted;
  }, [filteredAllReviewedSubmissions, reviewedSortConfig]);

  // 计算筛选后的分页数据
  const filteredReviewedSubmissions = (() => {
    const startIndex = (reviewedCurrentPage - 1) * reviewedPageSize;
    const endIndex = startIndex + reviewedPageSize;
    return sortedFilteredAllReviewedSubmissions.slice(startIndex, endIndex);
  })();

  // 重置筛选
  const resetFilters = () => {
    setFilters({
      user: '',
      formType: '',
      status: '',
      dateRange: ''
    });
    setReviewedCurrentPage(1); // 重置到第一页
  };
  
  // 统计数据状态
  const [stats, setStats] = useState<AdminStatsVO>({
    totalUsers: 0,
    pendingForms: 0,
    approvedForms: 0,
    rejectedForms: 0,
    totalPoints: 0,
    totalSubmissions: 0,
    averagePoints: 0,
    pendingApplications: 0,
    pendingTaskSubmissions: 0,
    pendingActivityApplications: 0,
    approvedApplications: 0,
    approvedTaskSubmissions: 0,
    approvedActivityApplications: 0,
    rejectedApplications: 0,
    rejectedTaskSubmissions: 0,
    rejectedActivityApplications: 0,
    currentMonthApprovedPromotionTasks: 0,
    currentMonthApprovedShortTasks: 0,
    currentMonthApprovedLongTasks: 0,
    currentMonthApprovedCommunityTasks: 0,
  });

  const fetchMonthlyPointInfo = async (userId: number) => {
    setMonthlyPoint(null);
    setMonthlyPointError('');
    if (!userId) return;
    setMonthlyPointLoading(true);
    try {
      const data = await monthlyPointService.getUserMonthlyPoints(userId);
      setMonthlyPoint(data);
      if (selectedSubmission?.type === 'task') {
        const available = Math.max(0, MONTHLY_POINT_LIMIT - (data?.point ?? 0));
        setReviewForm(prev => ({
          ...prev,
          points: Math.min(prev.points, available)
        }));
      }
    } catch (error: any) {
      console.error('获取本月积分失败:', error);
      setMonthlyPointError(error?.message || '获取本月积分失败');
    } finally {
      setMonthlyPointLoading(false);
    }
  };

  const handleReviewPointsChange = (value: number) => {
    const sanitized = Math.max(0, Math.floor(value));
    if (selectedSubmission?.type === 'task' && monthlyPoint) {
      const available = getMonthlyPointAvailable();
      setReviewForm(prev => ({
        ...prev,
        points: Math.min(sanitized, available)
      }));
    } else {
      setReviewForm(prev => ({ ...prev, points: sanitized }));
    }
  };

  // 获取所有数据的辅助函数
  const fetchAllData = async (apiCall: Function, params: any, maxPageSize: number = 20) => {
    const allRecords: any[] = [];
    let currentPage = 1;
    let hasMore = true;
    let totalCount = 0;
    let pageCount = 0;

    console.log(`🔍 开始分页获取数据，API: ${apiCall.name}, 参数:`, params);

    while (hasMore) {
      const response = await apiCall({
        ...params,
        current: currentPage,
        pageSize: maxPageSize
      });
      
      pageCount++;
      console.log(`📄 第${pageCount}页数据:`, {
        当前页: currentPage,
        返回记录数: response?.records?.length || 0,
        总记录数: response?.total || 0,
        累计记录数: allRecords.length
      });
      
      if (response?.records && response.records.length > 0) {
        allRecords.push(...response.records);
        totalCount = response.total || 0;
        
        // 如果返回的记录数少于pageSize，说明已经到最后一页
        if (response.records.length < maxPageSize) {
          hasMore = false;
          console.log(`✅ 数据获取完成，共${pageCount}页，${allRecords.length}条记录`);
        } else {
          currentPage++;
        }
      } else {
        hasMore = false;
        console.log(`✅ 数据获取完成，共${pageCount}页，${allRecords.length}条记录`);
      }
    }

    return { records: allRecords, total: totalCount };
  };

  // 获取待审核表单（获取所有数据，默认按最早时间排序）
  const fetchPendingSubmissions = async (
    page: number = pendingCurrentPage,
    sortField: string = sortConfig?.key || 'createTime',
    sortOrder: 'asc' | 'desc' = sortConfig?.direction || 'asc'
  ) => {
    try {
      setLoading(true);
      setError('');

      console.log('🔍 开始获取所有待审核数据:', { page, sortField, sortOrder });

      // 强制按创建时间升序获取，确保最早的数据先显示
      const [appResult, taskResult, activityResult] = await Promise.all([
        fetchAllData(formService.getFormList, {
          status: 0,
          sortField: 'createTime', // 强制按创建时间排序
          sortOrder: 'asc', // 强制升序，最早的数据在前
          ...(filters.user && { userName: filters.user })
        }, 20), // ApplicationForm没有限制，但为了安全使用20
        fetchAllData(taskSubmissionService.getAllTaskSubmissions, {
          reviewStatus: 0,
          sortField: 'createTime', // 强制按创建时间排序
          sortOrder: 'asc', // 强制升序，最早的数据在前
          ...(filters.user && { name: filters.user })
        }, 20), // TaskSubmission限制为20
        fetchAllData(activityApplicationService.getAllApplications, {
          reviewStatus: 0,
          sortField: 'createTime', // 强制按创建时间排序
          sortOrder: 'asc', // 强制升序，最早的数据在前
          ...(filters.user && { organizer: filters.user })
        }, 100) // ActivityApplication没有限制，使用100
      ]);

      const appResponse = { records: appResult.records, total: appResult.total };
      const taskResponse = { records: taskResult.records, total: taskResult.total };
      const activityResponse = { records: activityResult.records, total: activityResult.total };

      console.log('📊 API返回数据:', {
        applications: appResponse?.records?.length || 0,
        tasks: taskResponse?.records?.length || 0,
        activities: activityResponse?.records?.length || 0
      });

      // 检查最早和最晚的创建时间
      const allRecords = [...(appResponse?.records || []), ...(taskResponse?.records || []), ...(activityResponse?.records || [])];
      if (allRecords.length > 0) {
        const createTimes = allRecords.map(record => new Date(record.createTime)).sort();
        console.log('📅 数据时间范围:', {
          最早时间: createTimes[0]?.toISOString(),
          最晚时间: createTimes[createTimes.length - 1]?.toISOString(),
          总记录数: allRecords.length
        });
      }

      // 合并数据
      const allData: PendingSubmission[] = [];

      (appResponse?.records || []).forEach((form: any) => {
        allData.push({
          id: form.id,
          type: 'application',
          title: t('admin.forms.application'),
          userName: form.name || t('admin.unknown.user'),
          userEmail: form.email || '',
          status: form.status,
          createTime: form.createTime,
          data: form
        });
      });

      (taskResponse?.records || []).forEach((task: any) => {
        allData.push({
          id: task.id,
          type: 'task',
          title: t('admin.forms.achievement'),
          userName: task.name || t('admin.unknown.user'),
          userEmail: task.email || '',
          status: task.reviewStatus || 0,
          createTime: task.createTime,
          data: task
        });
      });

      (activityResponse?.records || []).forEach((activity: any) => {
        allData.push({
          id: activity.id,
          type: 'activity',
          title: t('admin.forms.activity'),
          userName: activity.organizer || t('admin.unknown.user'),
          userEmail: activity.email || '',
          status: activity.reviewStatus || 0,
          createTime: activity.createTime,
          data: activity
        });
      });

      // 筛选
      let filteredData = allData.filter(item => {
        if (filters.formType) {
          if (filters.formType === t('admin.forms.application') && item.type !== 'application') return false;
          if (filters.formType === t('admin.forms.achievement') && item.type !== 'task') return false;
          if (filters.formType === t('admin.forms.activity') && item.type !== 'activity') return false;
        }
        if (filters.dateRange) {
          const itemDate = new Date(item.createTime).toDateString();
          const filterDate = new Date(filters.dateRange).toDateString();
          if (itemDate !== filterDate) return false;
        }
        return true;
      });

      // 排序
      filteredData.sort((a, b) => {
        let valueA: any, valueB: any;
        
        switch (sortField) {
          case 'createTime':
            valueA = new Date(a.createTime).getTime();
            valueB = new Date(b.createTime).getTime();
            break;
          case 'userName':
            valueA = (a.userName || '').toLowerCase();
            valueB = (b.userName || '').toLowerCase();
            break;
          default:
            valueA = new Date(a.createTime).getTime();
            valueB = new Date(b.createTime).getTime();
        }
        
        const comparison = valueA < valueB ? -1 : (valueA > valueB ? 1 : 0);
        return sortOrder === 'desc' ? -comparison : comparison;
      });

      // 分页
      const startIndex = (page - 1) * pendingPageSize;
      const paginatedData = filteredData.slice(startIndex, startIndex + pendingPageSize);

      // 更新状态
      // 使用合并后的数据长度作为总数，而不是三个API的总数相加
      const actualTotal = filteredData.length;
      setPendingTotal(actualTotal);
      setPendingActualTotal(actualTotal);
      setPendingCurrentPage(page);
      setPendingSubmissions(paginatedData);
      
      console.log('✅ 数据处理完成:', {
        总数据: filteredData.length,
        当前页数据: paginatedData.length,
        当前页: page
      });
      
    } catch (error: any) {
      console.error('❌ 获取数据失败:', error);
      setError(error.message || '获取数据失败');
    } finally {
      setLoading(false);
    }
  };


  // 获取已审核表单数据（优化：并发加载，每种类型最多200条）
  const fetchAllReviewedData = async () => {
    // 使用与待审核表单相同的全量数据获取逻辑
    const fetchAllReviewedDataForType = async (service: any, params: any, maxPageSize: number = 20) => {
      const allRecords: any[] = [];
      let currentPage = 1;
      let hasMore = true;
      let totalCount = 0;
      let pageCount = 0;

      console.log(`🔍 开始获取已审核数据，API: ${service.name}, 参数:`, params);

      while (hasMore) {
        const response = await service({
          ...params,
          current: currentPage,
          pageSize: maxPageSize
        });
        
        pageCount++;
        console.log(`📄 已审核数据第${pageCount}页:`, {
          当前页: currentPage,
          返回记录数: response?.records?.length || 0,
          总记录数: response?.total || 0,
          累计记录数: allRecords.length
        });
        
        if (response?.records && response.records.length > 0) {
          allRecords.push(...response.records);
          totalCount = response.total || 0;
          
          // 如果返回的记录数少于pageSize，说明已经到最后一页
          if (response.records.length < maxPageSize) {
            hasMore = false;
            console.log(`✅ 已审核数据获取完成，共${pageCount}页，${allRecords.length}条记录`);
          } else {
            currentPage++;
          }
        } else {
          hasMore = false;
          console.log(`✅ 已审核数据获取完成，共${pageCount}页，${allRecords.length}条记录`);
        }
      }

      return { records: allRecords, total: totalCount };
    };

    // 并行获取所有类型的数据（获取全量数据）
    const [approvedFormsResult, rejectedFormsResult, approvedTaskSubmissionsResult, rejectedTaskSubmissionsResult, approvedActivitiesResult, rejectedActivitiesResult] = await Promise.all([
      fetchAllReviewedDataForType(formService.getFormList, { status: 1 }, 20), // 通过申请
      fetchAllReviewedDataForType(formService.getFormList, { status: 2 }, 20), // 拒绝申请
      fetchAllReviewedDataForType(taskSubmissionService.getAllTaskSubmissions, { reviewStatus: 1 }, 20), // 通过任务
      fetchAllReviewedDataForType(taskSubmissionService.getAllTaskSubmissions, { reviewStatus: 2 }, 20), // 拒绝任务
      fetchAllReviewedDataForType(activityApplicationService.getAllApplications, { reviewStatus: 1 }, 100), // 通过活动
      fetchAllReviewedDataForType(activityApplicationService.getAllApplications, { reviewStatus: 2 }, 100) // 拒绝活动
    ]);

    const loadedCount = approvedFormsResult.records.length + 
                       rejectedFormsResult.records.length +
                       approvedTaskSubmissionsResult.records.length +
                       rejectedTaskSubmissionsResult.records.length +
                       approvedActivitiesResult.records.length +
                       rejectedActivitiesResult.records.length;
    
    const actualTotal = approvedFormsResult.total + 
                       rejectedFormsResult.total +
                       approvedTaskSubmissionsResult.total +
                       rejectedTaskSubmissionsResult.total +
                       approvedActivitiesResult.total +
                       rejectedActivitiesResult.total;

    console.log('📊 已审核表单加载完成:', {
      通过申请: `${approvedFormsResult.records.length}/${approvedFormsResult.total}`,
      拒绝申请: `${rejectedFormsResult.records.length}/${rejectedFormsResult.total}`,
      通过任务: `${approvedTaskSubmissionsResult.records.length}/${approvedTaskSubmissionsResult.total}`,
      拒绝任务: `${rejectedTaskSubmissionsResult.records.length}/${rejectedTaskSubmissionsResult.total}`,
      通过活动: `${approvedActivitiesResult.records.length}/${approvedActivitiesResult.total}`,
      拒绝活动: `${rejectedActivitiesResult.records.length}/${rejectedActivitiesResult.total}`,
      已加载: loadedCount,
      实际总数: actualTotal
    });

    if (loadedCount < actualTotal) {
      console.warn(`⚠️ 已审核表单：只加载了前${loadedCount}条记录，还有${actualTotal - loadedCount}条未加载`);
    }

    // 保存统计数据用于显示提示
    setReviewedTotal(actualTotal);
    setReviewedLoadedCount(loadedCount);

    return {
      approvedForms: { records: approvedFormsResult.records, total: approvedFormsResult.total },
      rejectedForms: { records: rejectedFormsResult.records, total: rejectedFormsResult.total },
      approvedTaskSubmissions: { records: approvedTaskSubmissionsResult.records, total: approvedTaskSubmissionsResult.total },
      rejectedTaskSubmissions: { records: rejectedTaskSubmissionsResult.records, total: rejectedTaskSubmissionsResult.total },
      approvedActivities: { records: approvedActivitiesResult.records, total: approvedActivitiesResult.total },
      rejectedActivities: { records: rejectedActivitiesResult.records, total: rejectedActivitiesResult.total },
      loadedCount,
      actualTotal
    };
  };

  // 获取已审核表单（支持分页）
  const fetchReviewedSubmissions = async (page: number = reviewedCurrentPage) => {
    try {
      setReviewedLoading(true);
      setError(''); // 清除之前的错误
      
      const { approvedForms, rejectedForms, approvedTaskSubmissions, rejectedTaskSubmissions, approvedActivities, rejectedActivities } = await fetchAllReviewedData();

      const reviewed: ReviewedSubmission[] = [];

      // 添加已审核的申请表（通过和拒绝）
      [...approvedForms.records, ...rejectedForms.records].forEach(form => {
        if (form && form.id) {
          reviewed.push({
            id: form.id,
            type: 'application',
            title: t('admin.forms.application'),
            userName: form.name || t('admin.unknown.user'),
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

      
      [...approvedTaskSubmissions.records, ...rejectedTaskSubmissions.records].forEach(task => {
        if (task && task.id) {
          
          reviewed.push({
            id: task.id,
            type: 'task',
            title: t('admin.forms.achievement'),
            userName: task.name || t('admin.unknown.user'),
            userEmail: task.email || '',
            status: task.reviewStatus || 0,
            createTime: task.createTime || new Date().toISOString(),
            reviewTime: task.updateTime || task.createTime || new Date().toISOString(),
            reviewMessage: task.reviewMessage || '',
            reviewScore: task.reviewScore || 0,
            data: task
          });
        }
      });

      // 添加已审核的活动申请（通过和拒绝）
      [...approvedActivities.records, ...rejectedActivities.records].forEach(activity => {
        if (activity && activity.id) {
          reviewed.push({
            id: activity.id,
            type: 'activity',
            title: t('admin.forms.activity'),
            userName: activity.organizer || t('admin.unknown.user'),
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
      
      // 计算总数据量
      const totalCount = reviewed.length;
      
      // 前端分页：计算当前页的数据
      const startIndex = (page - 1) * reviewedPageSize;
      const endIndex = startIndex + reviewedPageSize;
      const currentPageData = reviewed.slice(startIndex, endIndex);

      setAllReviewedSubmissions(reviewed); // 存储所有数据
      setReviewedSubmissions(currentPageData);
      setReviewedTotal(totalCount);
    } catch (error: any) {
      console.error('获取已审核表单失败:', error);
      setError(error.message || t('admin.error.fetch.reviewed'));
    } finally {
      setReviewedLoading(false);
    }
  };

  // 处理已审核表单分页
  const handleReviewedPageChange = (page: number) => {
    setReviewedCurrentPage(page);
    // 不需要重新获取数据，因为筛选后的数据已经在内存中
  };

  // 获取统计数据
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      setError(''); // 清除之前的错误
      
      // 调用新的统计数据API
      const statsData = await userService.getAdminStats();
      
      setStats(statsData);
    } catch (error: any) {
      console.error('❌ 获取统计数据失败:', error);
      setError(error.message || t('admin.error.fetch.stats'));
    } finally {
      setStatsLoading(false);
    }
  };

  // 显示审核弹窗
  const handleShowReviewModal = async (submission: PendingSubmission) => {
    // 先设置基本信息显示弹窗
    setSelectedSubmission(submission);
    setReviewForm({
      reviewMessage: '',
      points: submission.type === 'task' ? 1 : 0 // 默认给予任务提交 1 分
    });
    setShowReviewModal(true);
    setMonthlyPoint(null);
    setMonthlyPointError('');
    
    try {
      // 使用统一API获取详细数据
      console.log('🔍 获取表单详情:', {
        type: submission.type,
        sourceId: submission.data?.id || 0
      });
      
      // 获取详细数据
      const detailData = await adminUnifiedService.getSubmissionDetail(
        submission.type,
        submission.data?.id || submission.id
      );
      
      console.log('✅ 获取到表单详情:', detailData);
      
      // 更新所选提交的详细数据
      setSelectedSubmission({
        ...submission,
        data: detailData
      });
      
      // 如果是任务提交，需要获取用户的本月积分
      if (submission.type === 'task') {
        const userId = detailData?.userId || detailData?.user?.id;
        if (userId) {
          await fetchMonthlyPointInfo(userId);
        }
      }
    } catch (error: any) {
      console.error('获取表单详情失败:', error);
      setError(error.message || t('admin.error.fetch.detail') || '获取表单详情失败');
    }
  };

  // 关闭审核弹窗
  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setSelectedSubmission(null);
    setShowContributionReference(false); // 重置贡献参考表显示状态
    setCategoryCounts({ promotion: 0, short: 0, long: 0, community: 0 }); // 重置类别次数
    setReviewForm({
      reviewMessage: '',
      points: 0
    });
    setMonthlyPoint(null);
    setMonthlyPointError('');
    setMonthlyPointLoading(false);
  };

  // 显示已审核表单详情弹窗
  const handleShowReviewedModal = async (submission: ReviewedSubmission) => {
    setSelectedReviewedSubmission(submission);
    setShowReviewedModal(true);
    
    // 初始化类别次数状态
    if (submission.type === 'task') {
      const taskData = submission.data as any; // 使用any类型以访问新添加的字段
      
      // 优先使用存储的类别次数，如果没有则从tasks数组计算
      const currentCounts = {
        promotion: taskData.promotionCount !== undefined && taskData.promotionCount !== null 
          ? taskData.promotionCount 
          : (taskData.tasks?.filter((task: any) => task.submissionCategory === 'promotion').length || 0),
        short: taskData.shortCount !== undefined && taskData.shortCount !== null
          ? taskData.shortCount
          : (taskData.tasks?.filter((task: any) => task.submissionCategory === 'short').length || 0),
        long: taskData.longCount !== undefined && taskData.longCount !== null
          ? taskData.longCount
          : (taskData.tasks?.filter((task: any) => task.submissionCategory === 'long').length || 0),
        community: taskData.communityCount !== undefined && taskData.communityCount !== null
          ? taskData.communityCount
          : (taskData.tasks?.filter((task: any) => task.submissionCategory === 'community').length || 0),
      };
      
      setOriginalCategoryCounts(currentCounts);
      setEditCategoryCounts(currentCounts);
      
      console.log('🎬 弹窗打开时初始化类别次数:', currentCounts, 'taskData中的值:', {
        promotionCount: taskData.promotionCount,
        shortCount: taskData.shortCount,
        longCount: taskData.longCount,
        communityCount: taskData.communityCount
      });
    }
  };

  // 关闭已审核表单详情弹窗
  const handleCloseReviewedModal = () => {
    setShowReviewedModal(false);
    setSelectedReviewedSubmission(null);
    setIsEditingReviewed(false);
    setIsEditingCategoryCounts(false); // 重置类别次数编辑状态
    setEditReviewedForm({
      status: 1,
      reviewMessage: '',
      reviewScore: 0
    });
  };

  // 处理类别次数变化
  const handleCategoryCountChange = (category: string, delta: number) => {
    setCategoryCounts(prev => ({
      ...prev,
      [category]: Math.max(0, prev[category as keyof typeof prev] + delta)
    }));
  };

  // 开始编辑已审核表单
  const handleStartEditReviewed = () => {
    if (selectedReviewedSubmission) {
      setEditReviewedForm({
        status: selectedReviewedSubmission.status,
        reviewMessage: selectedReviewedSubmission.reviewMessage,
        reviewScore: selectedReviewedSubmission.reviewScore
      });
      setIsEditingReviewed(true);
    }
  };

  // 取消编辑已审核表单
  const handleCancelEditReviewed = () => {
    setIsEditingReviewed(false);
    if (selectedReviewedSubmission) {
      setEditReviewedForm({
        status: selectedReviewedSubmission.status,
        reviewMessage: selectedReviewedSubmission.reviewMessage,
        reviewScore: selectedReviewedSubmission.reviewScore
      });
    }
  };

  // 保存已审核表单的修改
  const handleSaveReviewedEdit = async () => {
    if (!selectedReviewedSubmission) return;

    setEditReviewedLoading(true);
    try {
      // 根据表单类型调用不同的更新接口
      if (selectedReviewedSubmission.type === 'application') {
        await formService.reviewForm({
          formId: selectedReviewedSubmission.id,
          status: editReviewedForm.status,
          reviewComment: editReviewedForm.reviewMessage || '', // 确保不为undefined
          score: Math.floor(editReviewedForm.reviewScore) || 0 // 确保是整数
        });
      } else if (selectedReviewedSubmission.type === 'task') {
        await taskSubmissionService.updateTaskSubmission({
          id: selectedReviewedSubmission.id,
          reviewStatus: editReviewedForm.status,
          reviewMessage: editReviewedForm.reviewMessage || '', // 确保不为undefined
          reviewScore: Math.floor(editReviewedForm.reviewScore) || 0 // 确保是整数
        });
      } else if (selectedReviewedSubmission.type === 'activity') {
        
        const result = await activityApplicationService.reviewApplication({
          id: selectedReviewedSubmission.id,
          reviewStatus: editReviewedForm.status,
          reviewComment: editReviewedForm.reviewMessage || '', // 后端使用reviewComment字段，确保不为undefined
          reviewScore: Math.floor(editReviewedForm.reviewScore) || 0 // 确保是整数
        });
        
      }

      // 更新本地状态
      setSelectedReviewedSubmission({
        ...selectedReviewedSubmission,
        status: editReviewedForm.status,
        reviewMessage: editReviewedForm.reviewMessage,
        reviewScore: editReviewedForm.reviewScore
      });

      // 更新列表中的对应项
      setReviewedSubmissions(prev => 
        prev.map(item => 
          item.id === selectedReviewedSubmission.id 
            ? {
                ...item,
                status: editReviewedForm.status,
                reviewMessage: editReviewedForm.reviewMessage,
                reviewScore: editReviewedForm.reviewScore
              }
            : item
        )
      );

      setIsEditingReviewed(false);
      setSuccess(language === 'zh' ? '审核结果已更新，邮件通知已发送给用户' : 'Review result updated, email notification sent to user');
      setTimeout(() => setSuccess(''), 3000);
      
      // 重新获取已审核数据以确保数据同步
      await fetchReviewedSubmissions(reviewedCurrentPage);
    } catch (error: any) {
      console.error('❌ 更新审核结果失败:', error);
      console.error('❌ 错误详情:', {
        message: error.message,
        response: error.response,
        status: error.status,
        data: error.data
      });
      setError(error.message || '更新失败，请重试');
    } finally {
      setEditReviewedLoading(false);
    }
  };

  // 开始编辑类别次数
  const handleStartEditCategoryCounts = () => {
    if (!selectedReviewedSubmission || selectedReviewedSubmission.type !== 'task') return;
    
    // 【关键】直接使用当前显示的originalCategoryCounts，不要重新计算
    // originalCategoryCounts已经在弹窗打开时从TaskSubmission字段正确初始化了
    setEditCategoryCounts(originalCategoryCounts);
    setIsEditingCategoryCounts(true);
    
    console.log('✏️ 开始编辑类别次数，当前值:', originalCategoryCounts);
  };

  // 取消编辑类别次数
  const handleCancelEditCategoryCounts = () => {
    setIsEditingCategoryCounts(false);
    setEditCategoryCounts(originalCategoryCounts);
  };

  // 更新编辑中的类别次数
  const handleEditCategoryCountChange = (category: string, value: number) => {
    setEditCategoryCounts(prev => ({
      ...prev,
      [category]: Math.max(0, value)
    }));
  };

  // 保存类别次数修改
  const handleSaveCategoryCountsEdit = async () => {
    if (!selectedReviewedSubmission || selectedReviewedSubmission.type !== 'task') return;

    setEditReviewedLoading(true);
    try {
      console.log('🔍 开始更新类别次数:', {
        submissionId: selectedReviewedSubmission.id,
        originalCounts: originalCategoryCounts,
        newCounts: editCategoryCounts
      });

      // 计算需要调整的差值
      const adjustments = {
        promotion: editCategoryCounts.promotion - originalCategoryCounts.promotion,
        short: editCategoryCounts.short - originalCategoryCounts.short,
        long: editCategoryCounts.long - originalCategoryCounts.long,
        community: editCategoryCounts.community - originalCategoryCounts.community,
      };

      console.log('📊 类别次数调整量:', adjustments);

      // 如果有变化才进行更新
      if (Object.values(adjustments).some(adj => adj !== 0)) {
        console.log('📊 类别次数有变化，开始更新...');
        console.log('  - 原始值:', originalCategoryCounts);
        console.log('  - 新值:', editCategoryCounts);
        console.log('  - 调整量:', adjustments);
        
        // 步骤1: 更新TaskSubmission表（单次提交的类别次数）
        const updatePayload = {
          promotionCount: editCategoryCounts.promotion,
          shortCount: editCategoryCounts.short,
          longCount: editCategoryCounts.long,
          communityCount: editCategoryCounts.community,
        };

        console.log('📤 步骤1: 更新TaskSubmission的类别次数:', updatePayload);

        const response = await fetch(`http://localhost:8100/api/taskSubmission/update-category-counts/${selectedReviewedSubmission.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(updatePayload)
        });

        if (!response.ok) {
          throw new Error('更新TaskSubmission失败');
        }

        const result = await response.json();
        if (result.code !== 0) {
          throw new Error(result.message || '更新TaskSubmission失败');
        }

        console.log('✅ TaskSubmission更新成功');
        
        // 步骤2: 同时更新monthlyReward表（月度总次数）
        const taskData = selectedReviewedSubmission.data as any;
        const userId = taskData.userId || taskData.user?.id;
        
        if (userId) {
          // 使用任务提交的创建时间，而不是完成时间或当前时间
          const createTime = new Date(selectedReviewedSubmission.createTime);
          const year = createTime.getFullYear();
          const month = createTime.getMonth() + 1;
          
          const monthlyPointPayload = {
            userId: userId,
            pointYear: year,
            pointMonth: month,
            promotionDelta: adjustments.promotion,
            shortDelta: adjustments.short,
            longDelta: adjustments.long,
            communityDelta: adjustments.community
          };
          
          console.log('📤 步骤2: 更新monthlyReward的总次数:', monthlyPointPayload);
          
          try {
            await monthlyPointService.adjustCategoryCounts(monthlyPointPayload);
            console.log('✅ monthlyReward更新成功');
          } catch (error) {
            console.error('⚠️ monthlyReward更新失败（不影响TaskSubmission）:', error);
          }
        } else {
          console.warn('⚠️ 无法获取userId，跳过monthlyReward更新');
        }
        
        // 更新本地状态
        setOriginalCategoryCounts(editCategoryCounts);
        
        // 更新selectedReviewedSubmission的数据
        const updatedTaskData = { ...selectedReviewedSubmission.data, ...updatePayload };
        setSelectedReviewedSubmission({
          ...selectedReviewedSubmission,
          data: updatedTaskData
        });
        
        console.log('🔄 本地状态已更新:', editCategoryCounts);
        
        // 重新获取已审核数据列表以确保数据同步
        await fetchReviewedSubmissions(reviewedCurrentPage);
        
        setSuccess(language === 'zh' ? '类别次数已更新' : 'Category counts updated');
        setTimeout(() => setSuccess(''), 3000);
      }

      setIsEditingCategoryCounts(false);
    } catch (error: any) {
      console.error('❌ 更新类别次数失败:', error);
      setError(error.message || '更新类别次数失败，请重试');
    } finally {
      setEditReviewedLoading(false);
    }
  };

  // 提交审核结果
  const handleSubmitReview = async (status: number) => {
    if (!selectedSubmission) return;

    if (status === 1 && selectedSubmission.type === 'task' && monthlyPointLoading) {
      alert(language === 'zh' ? '本月积分数据加载中，请稍后再试' : 'Monthly points data is loading, please try again later');
      return;
    }

    setReviewLoading(true);
    try {
      console.log('🔍 开始审核流程:', {
        submissionId: selectedSubmission.id,
        submissionType: selectedSubmission.type,
        status: status,
        reviewMessage: reviewForm.reviewMessage,
        points: reviewForm.points
      });

      // 申请表和活动申请表不给予积分奖励
      const basePoints = (selectedSubmission.type === 'application' || selectedSubmission.type === 'activity')
        ? 0
        : (status === 1 ? Math.max(0, reviewForm.points) : 0);

      let pointsToAward = Math.floor(basePoints) || 0; // 确保是整数
      
      console.log('📊 积分计算:', {
        basePoints,
        pointsToAward,
        submissionType: selectedSubmission.type,
        status
      });

      if (selectedSubmission.type === 'application') {
        const reviewData = {
          formId: selectedSubmission.id,
          status: status,
          reviewComment: reviewForm.reviewMessage || '', // 确保不为undefined
          score: pointsToAward
        };
        console.log('📝 申请表审核请求:', reviewData);
        await formService.reviewForm(reviewData);
        console.log('✅ 申请表审核成功');
      } else if (selectedSubmission.type === 'task') {
        const reviewData = {
          id: selectedSubmission.id,
          reviewStatus: status,
          reviewMessage: reviewForm.reviewMessage || '', // 确保不为undefined
          reviewScore: pointsToAward
        };
        console.log('📋 任务提交审核请求:', reviewData);
        await taskSubmissionService.updateTaskSubmission(reviewData);
        console.log('✅ 任务提交审核成功');

        // 如果审核通过，累加月度奖励类别次数
        if (status === 1) {
          // 月度积分更新已由后端统一处理，前端只需更新类别次数
          try {
            // 使用任务提交的创建时间，而不是当前审核时间
            const taskData = selectedSubmission.data as any;
            const createTime = new Date(selectedSubmission.createTime);
            const year = createTime.getFullYear();
            const month = createTime.getMonth() + 1;

            // 根据成果提交表中的实际任务类别计算累加次数
            const tasks = taskData.tasks || [];
            
            // 统计各类别的任务数量
            const taskCounts = {
              promotion: 0,
              short: 0,
              long: 0,
              community: 0
            };
            
            tasks.forEach((task: any) => {
              const category = task.submissionCategory;
              if (category === 'promotion') taskCounts.promotion++;
              else if (category === 'short') taskCounts.short++;
              else if (category === 'long') taskCounts.long++;
              else if (category === 'community') taskCounts.community++;
            });

            // 构建累加次数数据
            const incrementData = {
              userId: selectedSubmission.data.userId,
              year: year,
              month: month,
              promotionIncrement: taskCounts.promotion, // 传播类增加次数
              shortIncrement: taskCounts.short, // 短篇原创增加次数
              longIncrement: taskCounts.long, // 长篇原创增加次数
              communityIncrement: taskCounts.community // 社区类增加次数
            };

            // 调用累加次数接口
            console.warn('⚠️ 重要提醒：如果分数被错误修改，可能是后端的refreshMonthlyRewardScores接口被调用了！');
            const result = await monthlyRewardService.incrementMonthlyRewardScores(incrementData);
            
            // 审核成功后，重新获取用户的月度积分（已由后端更新）
            if (selectedSubmission.data?.userId) {
              const updatedMonthlyPoint = await monthlyPointService.getUserMonthlyPoints(selectedSubmission.data.userId);
              setMonthlyPoint(updatedMonthlyPoint);
            }
          } catch (error) {
            console.error('更新月度奖励数据失败:', error);
            // 不阻止审核流程，只记录错误
          }
        }
      } else if (selectedSubmission.type === 'activity') {
        const reviewData = {
          id: selectedSubmission.id,
          reviewStatus: status,
          reviewComment: reviewForm.reviewMessage || '', // 后端使用reviewComment字段，确保不为undefined
          reviewScore: pointsToAward
        };
        console.log('🎪 活动申请审核请求:', reviewData);
        await activityApplicationService.reviewApplication(reviewData);
        console.log('✅ 活动申请审核成功');
      }

      // 异步更新本地状态，不等待重新获取数据
      const updatedSubmission = {
        ...selectedSubmission,
        status: status,
        reviewMessage: reviewForm.reviewMessage
      };
      
      // 从待审核列表中移除已审核的项目
      setPendingSubmissions(prev => prev.filter(item => item.id !== selectedSubmission.id));
      setPendingTotal(prev => Math.max(0, prev - 1));
      setPendingActualTotal(prev => Math.max(0, prev - 1));
      
      // 关闭审核弹窗
      handleCloseReviewModal();
      
      // 显示成功消息
      setSuccess(language === 'zh' ? '审核完成！表单已移至已审核列表' : 'Review completed! Form moved to reviewed list');
      setTimeout(() => setSuccess(''), 3000);
      
      // 异步重新获取数据（不阻塞用户界面）
      setTimeout(async () => {
        try {
          // 刷新待审核表单
          await fetchPendingSubmissions();
          
          // 如果当前在已审核表单页面，也刷新已审核数据
          if (activeTab === 'reviewed') {
            console.log('🔄 审核完成后刷新已审核表单数据');
            await fetchReviewedSubmissions(reviewedCurrentPage);
          }
        } catch (error) {
          console.error('异步刷新数据失败:', error);
        }
      }, 1000);
    } catch (error: any) {
      console.error('❌ 审核失败:', error);
      console.error('❌ 错误详情:', {
        message: error.message,
        response: error.response,
        httpStatus: error.status,
        data: error.data,
        submissionId: selectedSubmission?.id,
        submissionType: selectedSubmission?.type,
        reviewStatus: status,
        reviewMessage: reviewForm.reviewMessage
      });
      
      // 提供更友好的错误信息
      let errorMessage = t('admin.error.review');
      if (error.message) {
        if (error.message.includes('参数错误') || error.message.includes('PARAMS_ERROR')) {
          errorMessage = '请求参数错误，请检查输入的数据格式';
        } else if (error.message.includes('权限') || error.message.includes('AUTH')) {
          errorMessage = '权限不足，请确认您有管理员权限';
        } else if (error.message.includes('网络') || error.message.includes('Network')) {
          errorMessage = '网络连接失败，请检查网络连接';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.userRole === 'admin') {
      if (activeTab === 'forms') {
        fetchPendingSubmissions(); // 加载所有待审核表单
      } else if (activeTab === 'reviewed') {
        // 切换到已审核表单时重置分页状态
        setReviewedCurrentPage(1);
        fetchReviewedSubmissions(1);
      } else if (activeTab === 'stats') {
        fetchStats();
      }
      // 月度奖励模块的数据获取在组件内部处理
    }
  }, [isAuthenticated, user, activeTab]);
  
  // 注释掉本地排序，因为后端已经返回排序好的数据
  // useEffect(() => {
  //   if (pendingSubmissions.length > 0 && sortConfig) {
  //     setTimeout(() => sortPendingSubmissions(), 0);
  //   }
  // }, [pendingSubmissions.length]);

  // 监听筛选条件变化，重新获取数据
  useEffect(() => {
    if (isAuthenticated && user?.userRole === 'admin' && activeTab === 'forms') {
      console.log('🔄 筛选条件变化，重新获取数据:', filters);
      // 待审核表单：筛选条件变化时重新获取数据
      setPendingCurrentPage(1);
      if (sortConfig) {
        fetchPendingSubmissions(1, sortConfig.key, sortConfig.direction);
      } else {
        fetchPendingSubmissions(1);
      }
    }
  }, [filters.user, filters.formType, filters.dateRange]);

  // 权限检查
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('admin.login.required')}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{t('admin.login.required.desc')}</p>
          <a 
            href="/login" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('admin.login.go')}
          </a>
        </div>
      </div>
    );
  }

  if (user?.userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('admin.permission.denied')}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{t('admin.permission.denied.desc')}</p>
          <a 
            href="/" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('admin.go.home')}
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
                {t('admin.tab.pending')}
              </button>
              <button
                onClick={() => setActiveTab('reviewed')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'reviewed'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {t('admin.reviewed.tab')}
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
              <button
                onClick={() => setActiveTab('monthly-reward')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'monthly-reward'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                月度奖励
              </button>
              <button
                onClick={() => setActiveTab('launch-registrations')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'launch-registrations'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Launch参赛登记
              </button>
              <button
                onClick={() => setActiveTab('launch-dd-forms')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'launch-dd-forms'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Launch DD问答
              </button>
              <button
                onClick={() => setActiveTab('mint-forms')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'mint-forms'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Mint大赛表单
              </button>
            </nav>
          </div>
        </div>

        {/* 表单审核 */}
        {activeTab === 'forms' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('admin.pending.title')}</h2>
            
            {/* 筛选器 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    用户筛选
                  </label>
                  <input
                    type="text"
                    value={filters.user}
                    onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
                    placeholder="输入用户名或邮箱"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    表单类型
                  </label>
                  <select
                    value={filters.formType}
                    onChange={(e) => setFilters(prev => ({ ...prev, formType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">全部类型</option>
                    <option value={t('admin.forms.application')}>{t('admin.forms.application')}</option>
                    <option value={t('admin.forms.achievement')}>{t('admin.forms.achievement')}</option>
                    <option value={t('admin.forms.activity')}>{t('admin.forms.activity')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    提交日期
                  </label>
                  <input
                    type="date"
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    重置筛选
                  </button>
                </div>
              </div>
            </div>
            
            {/* 数据加载提示 */}
            {pendingTotal > 0 && pendingTotal < pendingActualTotal && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 mb-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-1">
                      {language === 'zh' ? '数据加载提示' : 'Data Loading Notice'}
                    </p>
                    <p>
                      {language === 'zh' 
                        ? `为提升加载速度，当前只显示前 ${pendingTotal} 条记录（实际共 ${pendingActualTotal} 条，还有 ${pendingActualTotal - pendingTotal} 条未显示）` 
                        : `For improved loading speed, only the first ${pendingTotal} records are displayed (total: ${pendingActualTotal}, ${pendingActualTotal - pendingTotal} more not shown)`}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4">
                <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-300">{t('admin.loading')}</span>
              </div>
            ) : (
            <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('admin.table.user')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('admin.table.formtype')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        提交类别
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        任务类型
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
                      onClick={() => handleSort('createTime')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{t('admin.table.submitdate')}</span>
                        <div className="flex flex-col">
                          <svg 
                            className={`w-3 h-3 ${sortConfig?.key === 'createTime' && sortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                          <svg 
                            className={`w-3 h-3 -mt-1 ${sortConfig?.key === 'createTime' && sortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('admin.table.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('admin.table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {pendingSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                          {pendingTotal === 0 ? t('admin.no.pending') : '没有找到符合条件的表单'}
                        </td>
                      </tr>
                    ) : (
                      pendingSubmissions.map((submission: PendingSubmission) => {
                        const taskData = submission.type === 'task' ? (submission.data as TaskSubmissionVO) : null;
                        const categories = taskData?.tasks?.map(t => t.submissionCategory).filter((v, i, a) => a.indexOf(v) === i) || [];
                        const taskTypes = taskData?.tasks?.map(t => t.taskType).filter((v, i, a) => a.indexOf(v) === i) || [];
                        
                        return (
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
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {submission.type === 'task' ? (
                              <div className="flex flex-wrap gap-1">
                                {categories.map((cat, idx) => (
                                  <span key={idx} className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded text-xs">
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            ) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {submission.type === 'task' ? (
                              <div className="flex flex-wrap gap-1">
                                {taskTypes.map((type, idx) => (
                                  <span key={idx} className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded text-xs">
                                    {type}
                                  </span>
                                ))}
                              </div>
                            ) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(submission.createTime).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 rounded-full">
                              {t('admin.status.pending')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                              onClick={() => handleShowReviewModal(submission)}
                              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              {t('admin.action.review')}
                        </button>
                      </td>
                    </tr>
                        );
                      })
                    )}
                </tbody>
              </table>
            </div>
            {pendingTotal > 0 && (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  显示第 {pendingRangeStart} 到 {pendingRangeEnd} 条，共 {pendingTotal} 条记录
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={pendingPageSize}
                    onChange={(e) => handlePendingPageSizeChange(Number(e.target.value))}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  >
                    <option value={10}>每页 10 条</option>
                    <option value={20}>每页 20 条</option>
                    <option value={50}>每页 50 条</option>
                  </select>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePendingPageChange(1)}
                      disabled={pendingCurrentPage === 1}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      首页
                    </button>
                    <button
                      onClick={() => handlePendingPageChange(pendingCurrentPage - 1)}
                      disabled={pendingCurrentPage === 1}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      上一页
                    </button>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      第 {pendingCurrentPage} / {pendingPageCount} 页
                    </span>
                    <button
                      onClick={() => handlePendingPageChange(pendingCurrentPage + 1)}
                      disabled={pendingCurrentPage >= pendingPageCount}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      下一页
                    </button>
                    <button
                      onClick={() => handlePendingPageChange(pendingPageCount)}
                      disabled={pendingCurrentPage >= pendingPageCount}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      末页
                    </button>
                  </div>
                </div>
              </div>
            )}
            </>
            )}
          </div>
        )}

        {/* 已审核表单 */}
        {activeTab === 'reviewed' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('admin.reviewed.title')}</h2>
            
            {/* 筛选器 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    用户筛选
                  </label>
                  <input
                    type="text"
                    value={filters.user}
                    onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
                    placeholder="输入用户名或邮箱"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    表单类型
                  </label>
                  <select
                    value={filters.formType}
                    onChange={(e) => setFilters(prev => ({ ...prev, formType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">全部类型</option>
                    <option value={t('admin.forms.application')}>{t('admin.forms.application')}</option>
                    <option value={t('admin.forms.achievement')}>{t('admin.forms.achievement')}</option>
                    <option value={t('admin.forms.activity')}>{t('admin.forms.activity')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    审核状态
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">全部状态</option>
                    <option value="1">已通过</option>
                    <option value="2">已拒绝</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    提交日期
                  </label>
                  <input
                    type="date"
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    重置筛选
                  </button>
                </div>
              </div>
            </div>
            
            {/* 数据加载提示 */}
            {reviewedLoadedCount > 0 && reviewedLoadedCount < reviewedTotal && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 mb-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-1">
                      {language === 'zh' ? '数据加载提示' : 'Data Loading Notice'}
                    </p>
                    <p>
                      {language === 'zh' 
                        ? `为提升加载速度，当前只显示前 ${reviewedLoadedCount} 条记录（实际共 ${reviewedTotal} 条，还有 ${reviewedTotal - reviewedLoadedCount} 条未显示）` 
                        : `For improved loading speed, only the first ${reviewedLoadedCount} records are displayed (total: ${reviewedTotal}, ${reviewedTotal - reviewedLoadedCount} more not shown)`}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4">
                <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
              </div>
            )}
            
            {reviewedLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-300">{t('admin.loading')}</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('admin.table.user')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('admin.table.formtype')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        提交类别
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        任务类型
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
                        onClick={() => handleReviewedSort('createTime')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{t('admin.table.submitdate')}</span>
                          <div className="flex flex-col">
                            <svg 
                              className={`w-3 h-3 ${reviewedSortConfig?.key === 'createTime' && reviewedSortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            <svg 
                              className={`w-3 h-3 -mt-1 ${reviewedSortConfig?.key === 'createTime' && reviewedSortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
                      onClick={() => handleReviewedSort('reviewTime')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{t('admin.table.reviewdate')}</span>
                        <div className="flex flex-col">
                          <svg 
                            className={`w-3 h-3 ${reviewedSortConfig?.key === 'reviewTime' && reviewedSortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                          <svg 
                            className={`w-3 h-3 -mt-1 ${reviewedSortConfig?.key === 'reviewTime' && reviewedSortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('admin.table.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        积分
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('admin.table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredReviewedSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                          {reviewedSubmissions.length === 0 ? t('admin.no.reviewed') : '没有找到符合条件的表单'}
                        </td>
                      </tr>
                    ) : (
                      filteredReviewedSubmissions.map((submission) => {
                        const taskData = submission.type === 'task' ? (submission.data as TaskSubmissionVO) : null;
                        const categories = taskData?.tasks?.map(t => t.submissionCategory).filter((v, i, a) => a.indexOf(v) === i) || [];
                        const taskTypes = taskData?.tasks?.map(t => t.taskType).filter((v, i, a) => a.indexOf(v) === i) || [];
                        
                        return (
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
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {submission.type === 'task' ? (
                              <div className="flex flex-wrap gap-1">
                                {categories.map((cat, idx) => (
                                  <span key={idx} className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded text-xs">
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            ) : '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {submission.type === 'task' ? (
                              <div className="flex flex-wrap gap-1">
                                {taskTypes.map((type, idx) => (
                                  <span key={idx} className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded text-xs">
                                    {type}
                                  </span>
                                ))}
                              </div>
                            ) : '-'}
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
                              {submission.status === 1 ? t('admin.status.approved') : t('admin.status.rejected')}
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
                              {t('admin.action.view')}
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
            {filteredAllReviewedSubmissions.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <span>
                    显示第 {((reviewedCurrentPage - 1) * reviewedPageSize) + 1} 到 {Math.min(reviewedCurrentPage * reviewedPageSize, filteredAllReviewedSubmissions.length)} 条，
                    共 {filteredAllReviewedSubmissions.length} 条记录
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleReviewedPageChange(reviewedCurrentPage - 1)}
                    disabled={reviewedCurrentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    上一页
                  </button>
                  
                  {/* 页码显示 */}
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, Math.ceil(sortedFilteredAllReviewedSubmissions.length / reviewedPageSize)) }, (_, i) => {
                      const pageNum = Math.max(1, reviewedCurrentPage - 2) + i;
                      if (pageNum > Math.ceil(sortedFilteredAllReviewedSubmissions.length / reviewedPageSize)) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handleReviewedPageChange(pageNum)}
                          className={`px-3 py-1 text-sm border rounded-md ${
                            pageNum === reviewedCurrentPage
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handleReviewedPageChange(reviewedCurrentPage + 1)}
                    disabled={reviewedCurrentPage >= Math.ceil(sortedFilteredAllReviewedSubmissions.length / reviewedPageSize)}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一页
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 数据统计 */}
        {activeTab === 'stats' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('admin.stats.title')}</h2>
            
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
                    <div className="text-sm text-gray-600 dark:text-gray-300">{t('admin.stats.totalusers')}</div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.pendingForms}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{t('admin.pending.title')}</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{stats.approvedForms}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{t('admin.stats.approvedforms')}</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalPoints}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{t('admin.stats.totalpoints')}</div>
                  </div>
                </div>

                {/* 详细统计 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">申请表统计</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">待审核</span>
                        <span className="text-sm font-medium text-yellow-600">{stats.pendingApplications}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">已通过</span>
                        <span className="text-sm font-medium text-green-600">{stats.approvedApplications}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">已拒绝</span>
                        <span className="text-sm font-medium text-red-600">{stats.rejectedApplications}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">任务提交统计</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">待审核</span>
                        <span className="text-sm font-medium text-yellow-600">{stats.pendingTaskSubmissions}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">已通过</span>
                        <span className="text-sm font-medium text-green-600">{stats.approvedTaskSubmissions}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">已拒绝</span>
                        <span className="text-sm font-medium text-red-600">{stats.rejectedTaskSubmissions}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">活动申请统计</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">待审核</span>
                        <span className="text-sm font-medium text-yellow-600">{stats.pendingActivityApplications}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">已通过</span>
                        <span className="text-sm font-medium text-green-600">{stats.approvedActivityApplications}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">已拒绝</span>
                        <span className="text-sm font-medium text-red-600">{stats.rejectedActivityApplications}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 汇总统计 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('admin.stats.formstats')}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{t('admin.pending.title')}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.pendingForms}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{t('admin.stats.approvedforms')}</span>
                        <span className="text-sm font-medium text-green-600">{stats.approvedForms}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{t('admin.stats.rejectedforms')}</span>
                        <span className="text-sm font-medium text-red-600">{stats.rejectedForms}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{t('admin.stats.totalsubmissions')}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.totalSubmissions}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('admin.stats.userstats')}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{t('admin.stats.totalusers')}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.totalUsers}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{t('admin.stats.totalpoints')}</span>
                        <span className="text-sm font-medium text-purple-600">{stats.totalPoints}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{t('admin.stats.averagepoints')}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {stats.averagePoints.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 本月已审核通过任务类型统计 */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    本月已审核通过的任务类型统计
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-blue-100 dark:border-blue-800/50">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {stats.currentMonthApprovedPromotionTasks}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">传播类任务</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-green-100 dark:border-green-800/50">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                        {stats.currentMonthApprovedShortTasks}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">短篇类任务</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-purple-100 dark:border-purple-800/50">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                        {stats.currentMonthApprovedLongTasks}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">长篇类任务</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-orange-100 dark:border-orange-800/50">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                        {stats.currentMonthApprovedCommunityTasks}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">社区类任务</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800/50">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">本月已审核通过任务总数</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {Number(stats.currentMonthApprovedPromotionTasks) + Number(stats.currentMonthApprovedShortTasks) + Number(stats.currentMonthApprovedLongTasks) + Number(stats.currentMonthApprovedCommunityTasks)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 月度奖励管理 */}
        {activeTab === 'monthly-reward' && (
          <AdminMonthlyReward />
        )}

        {/* Launch参赛登记管理 */}
        {activeTab === 'launch-registrations' && (
          <LaunchRegistrationsTab />
        )}

        {/* Launch DD问答管理 */}
        {activeTab === 'launch-dd-forms' && (
          <LaunchDDFormsTab />
        )}

        {/* Mint大赛表单管理 */}
        {activeTab === 'mint-forms' && (
          <MintFormsTab />
        )}
      </div>

      {/* 审核弹窗 */}
      {showReviewModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className={`bg-white dark:bg-gray-800 rounded-2xl p-8 w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl transform animate-scaleIn ${
            selectedSubmission.type === 'task' && showContributionReference ? 'max-w-7xl' : 'max-w-4xl'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  审核 {selectedSubmission.title}
                </h3>
                {selectedSubmission.type === 'task' && (
                  <button
                    onClick={() => setShowContributionReference(!showContributionReference)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {showContributionReference ? '隐藏参考表' : '显示参考表'}
                  </button>
                )}
              </div>
              <button
                onClick={handleCloseReviewModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>

            <div className={`space-y-6 ${selectedSubmission.type === 'task' && showContributionReference ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : ''}`}>
              {/* 左侧内容 */}
              <div className={selectedSubmission.type === 'task' && showContributionReference ? 'space-y-6' : ''}>
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
                  {selectedSubmission.type === 'task' && (
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">本月积分：</span>
                      {monthlyPointLoading ? (
                        <span className="text-sm text-gray-500 dark:text-gray-400">加载中...</span>
                      ) : monthlyPointError ? (
                        <span className="text-sm text-red-500">{monthlyPointError}</span>
                      ) : (
                        <span className={`text-sm font-semibold ${monthlyPoint && monthlyPoint.point > 50 ? 'text-red-500' : 'text-blue-600 dark:text-blue-300'}`}>
                          {monthlyPoint ? monthlyPoint.point : '--'}
                        </span>
                      )}
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">提交时间：</span>
                    <span className="text-sm text-gray-900 dark:text-white ml-2">
                      {new Date(selectedSubmission.createTime).toLocaleString()}
                    </span>
                  </div>
                </div>
                {selectedSubmission.type === 'task' && monthlyPoint && monthlyPoint.point > 50 && (
                  <div className="mt-3 text-sm text-red-500">
                    本月积分已达到封顶值 50 分，本次审核的积分奖励将自动按上限计算。
                  </div>
                )}
              </div>

              {/* 表单详情 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">表单详情</h4>
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
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Twitter：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as TaskSubmissionVO).twitterUsername}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">提交类别：</span>
                      <div className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedSubmission.data as TaskSubmissionVO).tasks?.map((task, index) => (
                          <span key={index} className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs mr-1 mb-1">
                            {task.submissionCategory}
                          </span>
                        ))}
                      </div>
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
                              {task.screenshot && task.screenshot.trim() && (
                                <div className="mt-2">
                                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">截图：</div>
                                  <div className="relative inline-block">
                                    <img 
                                      src={buildImageUrl(task.screenshot)}
                                      alt="任务截图"
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
                                      onLoad={() => {}}
                                    />
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">点击查看大图</div>
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
                  <div className="space-y-4">
                    {/* 基本信息 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    {/* 联系信息 */}
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">联系信息</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">邮箱：</span>
                          <span className="text-sm text-gray-900 dark:text-white ml-2">
                            {(selectedSubmission.data as ActivityApplication).email}
                          </span>
                        </div>
                        {(selectedSubmission.data as ActivityApplication).telegramUsername && (
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Telegram：</span>
                            <span className="text-sm text-gray-900 dark:text-white ml-2">
                              {(selectedSubmission.data as ActivityApplication).telegramUsername}
                            </span>
                          </div>
                        )}
                        {(selectedSubmission.data as ActivityApplication).twitterUsername && (
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Twitter：</span>
                            <span className="text-sm text-gray-900 dark:text-white ml-2">
                              {(selectedSubmission.data as ActivityApplication).twitterUsername}
                            </span>
                          </div>
                        )}
                        {(selectedSubmission.data as ActivityApplication).walletAddress && (
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">钱包地址：</span>
                            <span className="text-sm text-gray-900 dark:text-white ml-2 font-mono">
                              {(selectedSubmission.data as ActivityApplication).walletAddress}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 活动详情 */}
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">活动详情</h4>
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.activity.introduction')}：</span>
                          <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                            {(selectedSubmission.data as ActivityApplication).briefIntroduction || '未填写'}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">目标受众：</span>
                          <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                            {(selectedSubmission.data as ActivityApplication).targetAudience || '未填写'}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.activity.goals')}：</span>
                          <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                            {(selectedSubmission.data as ActivityApplication).activityGoals}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">活动流程：</span>
                          <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                            {(selectedSubmission.data as ActivityApplication).activityProcess || '未填写'}
                          </div>
                        </div>
                        {(selectedSubmission.data as ActivityApplication).expectedResults && (
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">预期结果：</span>
                            <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                              {(selectedSubmission.data as ActivityApplication).expectedResults}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 支持信息 */}
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">支持信息</h4>
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">邀请嘉宾：</span>
                          <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                            {(selectedSubmission.data as ActivityApplication).invitedSpeakers || '未填写'}
                          </div>
                        </div>
                        {(selectedSubmission.data as ActivityApplication).partners && (
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">合作伙伴：</span>
                            <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                              {(selectedSubmission.data as ActivityApplication).partners}
                            </div>
                          </div>
                        )}
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">资金支持需求：</span>
                          <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                            {(selectedSubmission.data as ActivityApplication).financialSupport || '未填写'}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">其他支持需求：</span>
                          <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                            {(selectedSubmission.data as ActivityApplication).otherSupport || '未填写'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 审核表单 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('admin.review.comment')}</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('admin.review.comment')}
                    </label>
                    <textarea
                      value={reviewForm.reviewMessage}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, reviewMessage: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder={t('admin.review.placeholder.comment')}
                    />
                  </div>
                  {/* 只有任务提交才显示积分输入框 */}
                  {selectedSubmission?.type === 'task' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('admin.review.points')}
                      </label>
                      <input
                        type="number"
                        value={reviewForm.points}
                        onChange={(e) => handleReviewPointsChange(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={t('admin.review.placeholder.points')}
                        min="0"
                      />
                    </div>
                  )}
                </div>
              </div>
              </div>

              {/* 右侧贡献参考表 - 仅在成果提交表审核时显示 */}
              {selectedSubmission.type === 'task' && showContributionReference && (
                <div className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                    <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-4 flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Footprint贡献参考
                    </h4>
                    
                    <div className="space-y-4">
                      {/* 传播类 */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">传播类</h5>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">X官方内容一键三联</span>
                            <span className="font-medium text-green-600">+1</span>
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">单纯转发/点赞不计分</div>
                        </div>
                      </div>

                      {/* 短篇原创 */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">短篇原创</h5>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">原创内容/Meme/平台图文教程</span>
                            <span className="font-medium text-green-600">+2</span>
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">月积分上限: 10分</div>
                        </div>
                      </div>

                      {/* 长篇原创 */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">长篇原创</h5>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">长篇或深度文章(不少于500字)</span>
                            <span className="font-medium text-green-600">+8-10</span>
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">强调原创</div>
                        </div>
                      </div>

                      {/* 短视频 */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">短视频</h5>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">短视频(不少于30秒)</span>
                            <span className="font-medium text-green-600">+12-15</span>
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">强调原创,半原创积分减半</div>
                        </div>
                      </div>

                      {/* AMA Recap */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">AMA Recap</h5>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">AMA Recap(不少于500字)</span>
                            <span className="font-medium text-green-600">+8-10</span>
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">Twitter发布并@官方账号</div>
                        </div>
                      </div>

                      {/* 社区类 */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">社区类</h5>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">参加AMA/线上活动</span>
                            <span className="font-medium text-green-600">+2-3</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Telegram参与话题讨论</span>
                            <span className="font-medium text-green-600">+2-3</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">组织官方认证线下活动</span>
                            <span className="font-medium text-green-600">+25-30</span>
                          </div>
                        </div>
                      </div>

                      {/* 爆款内容 */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">爆款内容</h5>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">任何原创内容获得广泛关注</span>
                            <span className="font-medium text-green-600">×1.5-3倍</span>
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">针对爆款内容的额外奖励</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                      <div className="text-xs text-yellow-800 dark:text-yellow-200">
                        <strong>注意：</strong>任务完成后，请务必截图留存，并通过成果提交表统一提交
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4种提交类别次数按钮 - 仅在成果提交表审核时显示 */}
            {selectedSubmission.type === 'task' && (
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-4">
                  提交类别次数统计
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* 传播类 */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">传播类</div>
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleCategoryCountChange('promotion', -1)}
                          className="w-8 h-8 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center text-lg font-bold"
                        >
                          -
                        </button>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white min-w-[2rem] text-center">
                          {categoryCounts.promotion}
                        </span>
                        <button
                          onClick={() => handleCategoryCountChange('promotion', 1)}
                          className="w-8 h-8 bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-lg font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 短篇原创 */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">短篇原创</div>
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleCategoryCountChange('short', -1)}
                          className="w-8 h-8 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center text-lg font-bold"
                        >
                          -
                        </button>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white min-w-[2rem] text-center">
                          {categoryCounts.short}
                        </span>
                        <button
                          onClick={() => handleCategoryCountChange('short', 1)}
                          className="w-8 h-8 bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-lg font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 长篇原创 */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">长篇原创</div>
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleCategoryCountChange('long', -1)}
                          className="w-8 h-8 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center text-lg font-bold"
                        >
                          -
                        </button>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white min-w-[2rem] text-center">
                          {categoryCounts.long}
                        </span>
                        <button
                          onClick={() => handleCategoryCountChange('long', 1)}
                          className="w-8 h-8 bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-lg font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 社区类 */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">社区类</div>
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleCategoryCountChange('community', -1)}
                          className="w-8 h-8 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center text-lg font-bold"
                        >
                          -
                        </button>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white min-w-[2rem] text-center">
                          {categoryCounts.community}
                        </span>
                        <button
                          onClick={() => handleCategoryCountChange('community', 1)}
                          className="w-8 h-8 bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-lg font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                {reviewLoading ? t('admin.review.processing') : t('admin.review.reject')}
              </button>
              <button
                onClick={() => handleSubmitReview(1)}
                disabled={reviewLoading}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {reviewLoading ? t('admin.review.processing') : t('admin.review.approve')}
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
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('admin.reviewed.time')}：</span>
                    <span className="text-sm text-gray-900 dark:text-white ml-2">
                      {new Date(selectedReviewedSubmission.reviewTime).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>


              {/* 表单详情 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">表单详情</h4>
                {selectedReviewedSubmission.type === 'application' && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.name')}：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedReviewedSubmission.data as ApplicationForm).name}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.email')}：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedReviewedSubmission.data as ApplicationForm).email}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Twitter：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedReviewedSubmission.data as ApplicationForm).twitterUsername}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Telegram：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedReviewedSubmission.data as ApplicationForm).telegramUsername || t('admin.review.not.filled')}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.wallet')}：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedReviewedSubmission.data as ApplicationForm).walletAddress || t('admin.review.not.filled')}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.web3role')}：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedReviewedSubmission.data as ApplicationForm).web3Role || t('admin.review.not.filled')}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.expertise')}：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedReviewedSubmission.data as ApplicationForm).expertise || t('admin.review.not.filled')}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.motivation')}：</span>
                      <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                        {(selectedReviewedSubmission.data as ApplicationForm).motivation || t('admin.review.not.filled')}
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
                      <div className="text-sm text-gray-900 dark:text-white ml-2">
                        {(selectedReviewedSubmission.data as TaskSubmissionVO).tasks?.map((task, index) => (
                          <span key={index} className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs mr-1 mb-1">
                            {task.submissionCategory}
                          </span>
                        ))}
                      </div>
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
                              {task.screenshot && task.screenshot.trim() && (
                                <div className="mt-2">
                                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">截图：</div>
                                  <div className="relative inline-block">
                                    <img 
                                      src={buildImageUrl(task.screenshot)}
                                      alt="任务截图"
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
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">点击查看大图</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* 类别次数统计 */}
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-200">获得的类别次数</h5>
                        {!isEditingCategoryCounts && (
                          <button
                            onClick={handleStartEditCategoryCounts}
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                          >
                            编辑
                          </button>
                        )}
                        {isEditingCategoryCounts && (
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveCategoryCountsEdit}
                              disabled={editReviewedLoading}
                              className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                            >
                              {editReviewedLoading ? '保存中...' : '保存'}
                            </button>
                            <button
                              onClick={handleCancelEditCategoryCounts}
                              disabled={editReviewedLoading}
                              className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 transition-colors duration-200"
                            >
                              取消
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {/* 传播类 */}
                        <div className="text-center p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                          {isEditingCategoryCounts ? (
                            <input
                              type="number"
                              min="0"
                              value={editCategoryCounts.promotion}
                              onChange={(e) => handleEditCategoryCountChange('promotion', parseInt(e.target.value) || 0)}
                              className="w-full text-lg font-bold text-center bg-transparent border-b border-blue-500 focus:outline-none focus:border-blue-700"
                            />
                          ) : (
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              {originalCategoryCounts.promotion}
                            </div>
                          )}
                          <div className="text-xs text-gray-500 dark:text-gray-400">传播类</div>
                        </div>
                        {/* 短篇原创 */}
                        <div className="text-center p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                          {isEditingCategoryCounts ? (
                            <input
                              type="number"
                              min="0"
                              value={editCategoryCounts.short}
                              onChange={(e) => handleEditCategoryCountChange('short', parseInt(e.target.value) || 0)}
                              className="w-full text-lg font-bold text-center bg-transparent border-b border-blue-500 focus:outline-none focus:border-blue-700"
                            />
                          ) : (
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              {originalCategoryCounts.short}
                            </div>
                          )}
                          <div className="text-xs text-gray-500 dark:text-gray-400">短篇原创</div>
                        </div>
                        {/* 长篇原创 */}
                        <div className="text-center p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                          {isEditingCategoryCounts ? (
                            <input
                              type="number"
                              min="0"
                              value={editCategoryCounts.long}
                              onChange={(e) => handleEditCategoryCountChange('long', parseInt(e.target.value) || 0)}
                              className="w-full text-lg font-bold text-center bg-transparent border-b border-blue-500 focus:outline-none focus:border-blue-700"
                            />
                          ) : (
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              {originalCategoryCounts.long}
                            </div>
                          )}
                          <div className="text-xs text-gray-500 dark:text-gray-400">长篇原创</div>
                        </div>
                        {/* 社区类 */}
                        <div className="text-center p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                          {isEditingCategoryCounts ? (
                            <input
                              type="number"
                              min="0"
                              value={editCategoryCounts.community}
                              onChange={(e) => handleEditCategoryCountChange('community', parseInt(e.target.value) || 0)}
                              className="w-full text-lg font-bold text-center bg-transparent border-b border-blue-500 focus:outline-none focus:border-blue-700"
                            />
                          ) : (
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              {originalCategoryCounts.community}
                            </div>
                          )}
                          <div className="text-xs text-gray-500 dark:text-gray-400">社区类</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedReviewedSubmission.type === 'activity' && (
                  <div className="space-y-4">
                    {/* 基本信息 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.activity.theme')}：</span>
                        <span className="text-sm text-gray-900 dark:text-white ml-2">
                          {(selectedReviewedSubmission.data as ActivityApplication).activityTheme}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.activity.organizer')}：</span>
                        <span className="text-sm text-gray-900 dark:text-white ml-2">
                          {(selectedReviewedSubmission.data as ActivityApplication).organizer}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.activity.type')}：</span>
                        <span className="text-sm text-gray-900 dark:text-white ml-2">
                          {(selectedReviewedSubmission.data as ActivityApplication).activityType}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.activity.time')}：</span>
                        <span className="text-sm text-gray-900 dark:text-white ml-2">
                          {(selectedReviewedSubmission.data as ActivityApplication).activityTime}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.activity.location')}：</span>
                        <span className="text-sm text-gray-900 dark:text-white ml-2">
                          {(selectedReviewedSubmission.data as ActivityApplication).activityLocation}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.activity.scale')}：</span>
                        <span className="text-sm text-gray-900 dark:text-white ml-2">
                          {(selectedReviewedSubmission.data as ActivityApplication).activityScale}
                        </span>
                      </div>
                    </div>

                    {/* 联系信息 */}
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">联系信息</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">邮箱：</span>
                          <span className="text-sm text-gray-900 dark:text-white ml-2">
                            {(selectedReviewedSubmission.data as ActivityApplication).email}
                          </span>
                        </div>
                        {(selectedReviewedSubmission.data as ActivityApplication).telegramUsername && (
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Telegram：</span>
                            <span className="text-sm text-gray-900 dark:text-white ml-2">
                              {(selectedReviewedSubmission.data as ActivityApplication).telegramUsername}
                            </span>
                          </div>
                        )}
                        {(selectedReviewedSubmission.data as ActivityApplication).twitterUsername && (
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Twitter：</span>
                            <span className="text-sm text-gray-900 dark:text-white ml-2">
                              {(selectedReviewedSubmission.data as ActivityApplication).twitterUsername}
                            </span>
                          </div>
                        )}
                        {(selectedReviewedSubmission.data as ActivityApplication).walletAddress && (
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">钱包地址：</span>
                            <span className="text-sm text-gray-900 dark:text-white ml-2 font-mono">
                              {(selectedReviewedSubmission.data as ActivityApplication).walletAddress}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 活动详情 */}
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">活动详情</h4>
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.activity.introduction')}：</span>
                          <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                            {(selectedReviewedSubmission.data as ActivityApplication).briefIntroduction || '未填写'}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">目标受众：</span>
                          <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                            {(selectedReviewedSubmission.data as ActivityApplication).targetAudience || '未填写'}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.submission.activity.goals')}：</span>
                          <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                            {(selectedReviewedSubmission.data as ActivityApplication).activityGoals}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">活动流程：</span>
                          <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                            {(selectedReviewedSubmission.data as ActivityApplication).activityProcess || '未填写'}
                          </div>
                        </div>
                        {(selectedReviewedSubmission.data as ActivityApplication).expectedResults && (
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">预期结果：</span>
                            <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                              {(selectedReviewedSubmission.data as ActivityApplication).expectedResults}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 支持信息 */}
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">支持信息</h4>
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">邀请嘉宾：</span>
                          <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                            {(selectedReviewedSubmission.data as ActivityApplication).invitedSpeakers || '未填写'}
                          </div>
                        </div>
                        {(selectedReviewedSubmission.data as ActivityApplication).partners && (
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">合作伙伴：</span>
                            <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                              {(selectedReviewedSubmission.data as ActivityApplication).partners}
                            </div>
                          </div>
                        )}
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">资金支持需求：</span>
                          <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                            {(selectedReviewedSubmission.data as ActivityApplication).financialSupport || '未填写'}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">其他支持需求：</span>
                          <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                            {(selectedReviewedSubmission.data as ActivityApplication).otherSupport || '未填写'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 审核结果 - 移到最下面 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">审核结果</h4>
                  {!isEditingReviewed && (
                    <button
                      onClick={handleStartEditReviewed}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                    >
                      编辑
                    </button>
                  )}
                </div>
                
                {isEditingReviewed ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        审核状态
                      </label>
                      <select
                        value={editReviewedForm.status}
                        onChange={(e) => setEditReviewedForm(prev => ({ ...prev, status: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={1}>通过</option>
                        <option value={2}>驳回</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        积分
                      </label>
                      <input
                        type="number"
                        value={editReviewedForm.reviewScore}
                        onChange={(e) => setEditReviewedForm(prev => ({ ...prev, reviewScore: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="输入积分"
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        审核意见
                      </label>
                      <textarea
                        value={editReviewedForm.reviewMessage}
                        onChange={(e) => setEditReviewedForm(prev => ({ ...prev, reviewMessage: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="输入审核意见"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={handleCancelEditReviewed}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        disabled={editReviewedLoading}
                      >
                        取消
                      </button>
                      <button
                        onClick={handleSaveReviewedEdit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                        disabled={editReviewedLoading}
                      >
                        {editReviewedLoading ? '保存中...' : '保存并通知用户'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">审核状态：</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                        selectedReviewedSubmission.status === 1 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      }`}>
                        {selectedReviewedSubmission.status === 1 ? t('admin.status.approved') : t('admin.status.rejected')}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('admin.reviewed.score')}：</span>
                      <span className="text-sm text-gray-900 dark:text-white ml-2">
                        {selectedReviewedSubmission.reviewScore > 0 ? (
                          <span className="text-green-600 dark:text-green-400 font-semibold">+{selectedReviewedSubmission.reviewScore}</span>
                        ) : selectedReviewedSubmission.reviewScore === 0 ? (
                          <span className="text-gray-600 dark:text-gray-400">0</span>
                        ) : (
                          t('admin.review.no.comment')
                        )}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* 审核意见显示 */}
                {!isEditingReviewed && (
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('admin.reviewed.comment')}：</span>
                    <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                      {selectedReviewedSubmission.reviewMessage || '无审核意见'}
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
                {t('admin.review.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Launch参赛登记标签页组件
function LaunchRegistrationsTab() {
  const { language } = useLanguage();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalRegistrations: 0, trackStats: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const statsResponse = await fetch(`${API_CONFIG.BASE_URL}/launch-contest/admin/stats`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData.data) {
          setStats({
            totalRegistrations: statsData.data.totalRegistrations || 0,
            trackStats: statsData.data.trackStats || {}
          });
        }
      }
      
      const registrationsResponse = await fetch(`${API_CONFIG.BASE_URL}/launch-contest/admin/forms/list/page/vo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ current: 1, pageSize: 50 })
      });
      
      if (registrationsResponse.ok) {
        const registrationsData = await registrationsResponse.json();
        if (registrationsData.data?.records) {
          setRegistrations(registrationsData.data.records);
        } else {
          // 模拟数据
          setRegistrations([{
            id: 1,
            projectName: '示例项目',
            tokenName: 'EXAMPLE',
            trackCategory: 'DeFi',
            name: '示例用户',
            email: 'example@example.com',
            createTime: new Date().toISOString()
          }]);
        }
      }
    } catch (err) {
      console.error('获取Launch参赛登记数据失败:', err);
      setError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    try {
      const exportData = registrations.map((reg, index) => ({
        '序号': index + 1,
        '项目名称': reg.projectName,
        '代币名称': reg.tokenName,
        '赛道类别': reg.trackCategory,
        '联系人姓名': reg.name,
        '联系邮箱': reg.email,
        '提交时间': new Date(reg.createTime).toLocaleString('zh-CN')
      }));

      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(',')
        )
      ].join('\n');

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `Launch大赛参赛登记_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('下载失败:', err);
      alert(language === 'zh' ? '下载失败，请重试' : 'Download failed, please try again');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {language === 'zh' ? 'Launch大赛参赛登记管理' : 'Launch Contest Registration Management'}
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (language === 'zh' ? '刷新中...' : 'Refreshing...') : (language === 'zh' ? '刷新' : 'Refresh')}
          </button>
          <button
            onClick={downloadExcel}
            disabled={loading || registrations.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {language === 'zh' ? '下载Excel' : 'Download Excel'}
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {language === 'zh' ? '总参赛登记数' : 'Total Registrations'}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.totalRegistrations}
              </p>
            </div>
          </div>
        </div>

        {Object.entries(stats.trackStats).map(([track, count]) => (
          <div key={track} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {track}
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {count as number}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                {language === 'zh' ? '获取数据失败' : 'Failed to fetch data'}
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 参赛登记列表 */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language === 'zh' ? '序号' : 'No.'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language === 'zh' ? '项目名称' : 'Project Name'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language === 'zh' ? '代币名称' : 'Token Name'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language === 'zh' ? '赛道类别' : 'Track Category'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language === 'zh' ? '联系人' : 'Contact'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language === 'zh' ? '提交时间' : 'Submit Time'}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  <div className="inline-flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {language === 'zh' ? '加载中...' : 'Loading...'}
                  </div>
                </td>
              </tr>
            ) : registrations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  {language === 'zh' ? '暂无参赛登记数据' : 'No registration data available'}
                </td>
              </tr>
            ) : (
              registrations.map((reg, index) => (
                <tr key={reg.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="max-w-xs truncate" title={reg.projectName}>
                      {reg.projectName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="max-w-xs truncate" title={reg.tokenName}>
                      {reg.tokenName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {reg.trackCategory}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div>
                      <div className="font-medium">{reg.name}</div>
                      <div className="text-gray-500 dark:text-gray-400">{reg.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(reg.createTime).toLocaleString('zh-CN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Launch DD问答标签页组件
function LaunchDDFormsTab() {
  const { language } = useLanguage();
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalQuestionnaires: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const statsResponse = await fetch(`${API_CONFIG.BASE_URL}/launch-contest/admin/stats`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData.data) {
          setStats({
            totalQuestionnaires: statsData.data.totalDdQuestionnaires || 0
          });
        }
      }
      
      const questionnairesResponse = await fetch(`${API_CONFIG.BASE_URL}/launch-contest/dd-questionnaire/list/page/vo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ current: 1, pageSize: 50 })
      });
      
      if (questionnairesResponse.ok) {
        const questionnairesData = await questionnairesResponse.json();
        if (questionnairesData.data?.records) {
          setQuestionnaires(questionnairesData.data.records);
        } else {
          // 模拟数据
          setQuestionnaires([{
            id: 1,
            projectName: '示例项目',
            tokenName: 'EXAMPLE',
            name: '示例用户',
            email: 'example@example.com',
            createTime: new Date().toISOString()
          }]);
        }
      }
    } catch (err) {
      console.error('获取DD问答数据失败:', err);
      setError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    try {
      const exportData = questionnaires.map((questionnaire, index) => ({
        '序号': index + 1,
        '项目名称': questionnaire.projectName,
        '代币名称': questionnaire.tokenName,
        '联系人姓名': questionnaire.name,
        '联系邮箱': questionnaire.email,
        '提交时间': new Date(questionnaire.createTime).toLocaleString('zh-CN')
      }));

      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(',')
        )
      ].join('\n');

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `Launch大赛DD问答_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('下载失败:', err);
      alert(language === 'zh' ? '下载失败，请重试' : 'Download failed, please try again');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {language === 'zh' ? 'Launch大赛DD问答管理' : 'Launch Contest DD Questionnaire Management'}
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (language === 'zh' ? '刷新中...' : 'Refreshing...') : (language === 'zh' ? '刷新' : 'Refresh')}
          </button>
          <button
            onClick={downloadExcel}
            disabled={loading || questionnaires.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {language === 'zh' ? '下载Excel' : 'Download Excel'}
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {language === 'zh' ? '总DD问答数' : 'Total DD Questionnaires'}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.totalQuestionnaires}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                {language === 'zh' ? '获取数据失败' : 'Failed to fetch data'}
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DD问答列表 */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language === 'zh' ? '序号' : 'No.'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language === 'zh' ? '项目名称' : 'Project Name'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language === 'zh' ? '代币名称' : 'Token Name'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language === 'zh' ? '联系人' : 'Contact'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language === 'zh' ? '提交时间' : 'Submit Time'}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  <div className="inline-flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {language === 'zh' ? '加载中...' : 'Loading...'}
                  </div>
                </td>
              </tr>
            ) : questionnaires.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  {language === 'zh' ? '暂无DD问答数据' : 'No DD questionnaire data available'}
                </td>
              </tr>
            ) : (
              questionnaires.map((questionnaire, index) => (
                <tr key={questionnaire.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="max-w-xs truncate" title={questionnaire.projectName}>
                      {questionnaire.projectName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="max-w-xs truncate" title={questionnaire.tokenName}>
                      {questionnaire.tokenName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div>
                      <div className="font-medium">{questionnaire.name}</div>
                      <div className="text-gray-500 dark:text-gray-400">{questionnaire.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(questionnaire.createTime).toLocaleString('zh-CN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Mint大赛表单标签页组件
function MintFormsTab() {
  const { language } = useLanguage();
  const [forms, setForms] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalForms: 0, trackStats: { studio: 0, individual: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const statsResponse = await fetch(`${API_CONFIG.BASE_URL}/mint-contest/admin/stats`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData.data) {
          setStats({
            totalForms: statsData.data.totalForms || 0,
            trackStats: statsData.data.trackStats || { studio: 0, individual: 0 }
          });
        }
      }
      
      const formsResponse = await fetch(`${API_CONFIG.BASE_URL}/mint-contest/admin/forms/list/page/vo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ current: 1, pageSize: 50 })
      });
      
      if (formsResponse.ok) {
        const formsData = await formsResponse.json();
        if (formsData.data?.records) {
          setForms(formsData.data.records);
        } else {
          // 模拟数据
          setForms([{
            id: 1,
            trackType: 'studio',
            name: '示例工作室',
            email: 'example@example.com',
            walletAddress: '0x1234567890123456789012345678901234567890',
            createTime: new Date().toISOString()
          }]);
        }
      }
    } catch (err) {
      console.error('获取Mint大赛表单数据失败:', err);
      setError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    try {
      const exportData = forms.map((form, index) => ({
        '序号': index + 1,
        '赛道类型': form.trackType === 'studio' ? '工作室组' : '个人组',
        '名称': form.name,
        '邮箱': form.email,
        '钱包地址': form.walletAddress,
        '提交时间': new Date(form.createTime).toLocaleString('zh-CN')
      }));

      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(',')
        )
      ].join('\n');

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `Mint大赛表单_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('下载失败:', err);
      alert(language === 'zh' ? '下载失败，请重试' : 'Download failed, please try again');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {language === 'zh' ? 'Mint大赛表单管理' : 'Mint Contest Forms Management'}
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (language === 'zh' ? '刷新中...' : 'Refreshing...') : (language === 'zh' ? '刷新' : 'Refresh')}
          </button>
          <button
            onClick={downloadExcel}
            disabled={loading || forms.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {language === 'zh' ? '下载Excel' : 'Download Excel'}
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalForms}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {language === 'zh' ? '总表单数' : 'Total Forms'}
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">{stats.trackStats.studio}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {language === 'zh' ? '工作室组' : 'Studio Group'}
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{stats.trackStats.individual}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {language === 'zh' ? '个人组' : 'Individual Group'}
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                {language === 'zh' ? '获取数据失败' : 'Failed to fetch data'}
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 表单列表 */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language === 'zh' ? '序号' : 'No.'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language === 'zh' ? '赛道类型' : 'Track Type'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language === 'zh' ? '名称' : 'Name'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language === 'zh' ? '邮箱' : 'Email'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language === 'zh' ? '钱包地址' : 'Wallet Address'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language === 'zh' ? '提交时间' : 'Submit Time'}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  <div className="inline-flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {language === 'zh' ? '加载中...' : 'Loading...'}
                  </div>
                </td>
              </tr>
            ) : forms.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  {language === 'zh' ? '暂无表单数据' : 'No forms data available'}
                </td>
              </tr>
            ) : (
              forms.map((form, index) => (
                <tr key={form.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      form.trackType === 'studio' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                    }`}>
                      {form.trackType === 'studio' ? (language === 'zh' ? '工作室组' : 'Studio Group') : (language === 'zh' ? '个人组' : 'Individual Group')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="max-w-xs truncate" title={form.name}>
                      {form.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="max-w-xs truncate" title={form.email}>
                      {form.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="max-w-xs truncate" title={form.walletAddress}>
                      {form.walletAddress.slice(0, 10)}...{form.walletAddress.slice(-8)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(form.createTime).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
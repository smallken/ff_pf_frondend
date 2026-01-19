'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ccIncentiveService, CC_TASK_TYPES, type CcTaskVO, type CcAdminTaskListVO, type CcPointsLogVO, type CcPointsRankingItem } from '../../services/ccIncentiveService';

// 审核状态枚举
const REVIEW_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
};

// 审核状态筛选选项
const FILTER_OPTIONS = {
  ALL: undefined,
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
};

interface GroupLeaderIncentiveReviewProps {
  selectedWeek?: number;
}

const GroupLeaderIncentiveReview: React.FC<GroupLeaderIncentiveReviewProps> = ({ selectedWeek }) => {
  const { language } = useLanguage();
  
  // 状态管理
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  const [reviewStatusFilter, setReviewStatusFilter] = useState<number | undefined>(FILTER_OPTIONS.PENDING);
  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed' | 'pointsLog' | 'ranking'>('pending');
  
  // CC积分排行榜状态
  const [rankingRecords, setRankingRecords] = useState<CcPointsRankingItem[]>([]);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [rankingError, setRankingError] = useState('');
  const [rankingWeekCount, setRankingWeekCount] = useState<number | undefined>();
  
  // 积分日志状态
  const [pointsLogs, setPointsLogs] = useState<CcPointsLogVO[]>([]);
  const [pointsLogLoading, setPointsLogLoading] = useState(false);
  const [pointsLogError, setPointsLogError] = useState('');
  const [pointsLogPage, setPointsLogPage] = useState(1);
  const [pointsLogTotal, setPointsLogTotal] = useState(0);
  const pointsLogPageSize = 10;
  
  // 任务数据 - 使用新的CcTaskVO类型
  const [groupSizeTasks, setGroupSizeTasks] = useState<CcTaskVO[]>([]); // 群规模&拉新
  const [qqGroupTasks, setQqGroupTasks] = useState<CcTaskVO[]>([]); // 群内任务
  const [outGroupTasks, setOutGroupTasks] = useState<CcTaskVO[]>([]); // 外群任务
  const [originalTasks, setOriginalTasks] = useState<CcTaskVO[]>([]); // 长期建设
  
  // 用于生成周次选项的所有周次数据
  const [allWeeksData, setAllWeeksData] = useState<{
    tasks: CcTaskVO[];
    logs: CcPointsLogVO[];
    rankingWeeks: number[];
  }>({ tasks: [], logs: [], rankingWeeks: [] });
  
  // 审核状态
  const [reviewForm, setReviewForm] = useState({
    reviewStatus: REVIEW_STATUS.APPROVED,
    reviewMessage: '',
    points: 10, // 默认积分
  });
  
  // 正在审核的任务
  const [activeTask, setActiveTaskState] = useState<{
    type: 'groupSize' | 'qqGroup' | 'outGroup' | 'original';
    task: CcTaskVO;
  } | null>(null);
  
  // 打开任务时预填充表单
  const setActiveTask = useCallback((task: { type: 'groupSize' | 'qqGroup' | 'outGroup' | 'original'; task: CcTaskVO } | null) => {
    setActiveTaskState(task);
    if (task) {
      // 预填充审核表单
      setReviewForm({
        reviewStatus: task.task.reviewStatus === REVIEW_STATUS.PENDING 
          ? REVIEW_STATUS.APPROVED 
          : task.task.reviewStatus,
        reviewMessage: task.task.reviewMessage || '',
        points: task.task.points || 10, // 使用任务中已有的积分，默认10
      });
    }
  }, []);
  
  // 加载所有周次数据（用于生成周次选项）
  const fetchAllWeeksData = useCallback(async () => {
    try {
      // 获取所有周次的任务数据
      const allTaskList = await ccIncentiveService.getAdminTaskList(undefined, undefined);
      const allTasks = [
        ...(allTaskList.groupSizeTasks || []),
        ...(allTaskList.qqGroupTasks || []),
        ...(allTaskList.outGroupTasks || []),
        ...(allTaskList.originalTasks || [])
      ];
      
      // 获取所有周次的日志数据（只获取第一页）
      const allLogsResult = await ccIncentiveService.getPointsLogList(undefined, 1, 100);
      const allLogs = allLogsResult.records || [];
      
      setAllWeeksData({
        tasks: allTasks,
        logs: allLogs,
        rankingWeeks: [] // 排行榜周次在加载时单独更新
      });
    } catch (err: any) {
      console.error('获取所有周次数据失败:', err);
    }
  }, []);
  
  // 加载任务数据
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // 获取管理员任务列表
      const taskList = await ccIncentiveService.getAdminTaskList(
        currentWeek > 0 ? currentWeek : undefined,
        reviewStatusFilter
      );
      
      // 设置任务数据
      setGroupSizeTasks(taskList.groupSizeTasks || []);
      setQqGroupTasks(taskList.qqGroupTasks || []);
      setOutGroupTasks(taskList.outGroupTasks || []);
      setOriginalTasks(taskList.originalTasks || []);
    } catch (err: any) {
      console.error('获取任务数据失败:', err);
      setError(err.message || (language === 'zh' ? '获取任务数据失败' : 'Failed to load task data.'));
    } finally {
      setLoading(false);
    }
  }, [language, currentWeek, reviewStatusFilter]);
  
  // 加载积分日志
  const fetchPointsLogs = useCallback(async () => {
    try {
      setPointsLogLoading(true);
      setPointsLogError('');
      
      const result = await ccIncentiveService.getPointsLogList(
        currentWeek > 0 ? currentWeek : undefined,
        pointsLogPage,
        pointsLogPageSize
      );
      
      setPointsLogs(result.records || []);
      setPointsLogTotal(result.total || 0);
    } catch (err: any) {
      console.error('获取积分日志失败:', err);
      setPointsLogError(err.message || (language === 'zh' ? '获取积分日志失败' : 'Failed to load points log.'));
    } finally {
      setPointsLogLoading(false);
    }
  }, [language, currentWeek, pointsLogPage]);
  
  // 审核任务
  const handleReviewTask = useCallback(async () => {
    if (!activeTask) return;
    
    try {
      setLoading(true);
      setError('');
      
      // 使用新的审核API
      await ccIncentiveService.reviewTask({
        taskId: activeTask.task.id,
        reviewStatus: reviewForm.reviewStatus,
        reviewMessage: reviewForm.reviewMessage || undefined,
        points: reviewForm.reviewStatus === REVIEW_STATUS.APPROVED ? reviewForm.points : 0,
      });
      
      // 审核成功后重新加载数据
      await fetchTasks();
      
      // 重置状态
      setActiveTask(null);
      setReviewForm({
        reviewStatus: REVIEW_STATUS.APPROVED,
        reviewMessage: '',
        points: 10,
      });
    } catch (err: any) {
      console.error('审核任务失败:', err);
      setError(err.message || (language === 'zh' ? '审核任务失败' : 'Failed to review task.'));
    } finally {
      setLoading(false);
    }
  }, [activeTask, reviewForm, fetchTasks, language]);
  
  // 获取状态文本
  const getStatusText = useCallback((status: number) => {
    switch (status) {
      case REVIEW_STATUS.PENDING:
        return language === 'zh' ? '待审核' : 'Pending';
      case REVIEW_STATUS.APPROVED:
        return language === 'zh' ? '已通过' : 'Approved';
      case REVIEW_STATUS.REJECTED:
        return language === 'zh' ? '已拒绝' : 'Rejected';
      default:
        return language === 'zh' ? '未知状态' : 'Unknown';
    }
  }, [language]);
  
  // 获取状态样式
  const getStatusStyle = useCallback((status: number) => {
    switch (status) {
      case REVIEW_STATUS.PENDING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case REVIEW_STATUS.APPROVED:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case REVIEW_STATUS.REJECTED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  }, []);
  
  // 周选择器选项 - 根据所有周次数据生成，不受当前筛选影响
  const weekOptions = useMemo(() => {
    const options = [
      {
        value: 0,
        label: language === 'zh' ? '所有周' : 'All Weeks',
      },
    ];
    
    const uniqueWeeks = new Set<number>();
    
    // 根据不同的页签从allWeeksData中提取周次
    if (activeTab === 'pending') {
      // 待审核页签：只显示有待审核任务的周次
      allWeeksData.tasks.forEach(task => {
        if (task.weekCount && task.reviewStatus === REVIEW_STATUS.PENDING) {
          uniqueWeeks.add(task.weekCount);
        }
      });
    } else if (activeTab === 'reviewed') {
      // 已审核页签：只显示有已审核任务的周次
      allWeeksData.tasks.forEach(task => {
        if (task.weekCount && task.reviewStatus !== REVIEW_STATUS.PENDING) {
          uniqueWeeks.add(task.weekCount);
        }
      });
    } else if (activeTab === 'pointsLog') {
      // 审核日志页签：从所有日志数据中提取
      allWeeksData.logs.forEach(log => {
        if (log.weekCount) {
          uniqueWeeks.add(log.weekCount);
        }
      });
    } else if (activeTab === 'ranking') {
      // 排行榜页签：从排行榜周次数据中提取
      allWeeksData.rankingWeeks.forEach(week => {
        uniqueWeeks.add(week);
      });
      // 同时添加当前显示的周次
      if (rankingWeekCount) {
        uniqueWeeks.add(rankingWeekCount);
      }
    }
    
    // 将唯一周次转换为数组并排序（倒序，最新的周在前）
    const sortedWeeks = Array.from(uniqueWeeks).sort((a, b) => b - a);
    
    // 添加有数据的周次选项
    sortedWeeks.forEach(week => {
      options.push({
        value: week,
        label: language === 'zh' ? `第${week}周` : `Week ${week}`,
      });
    });
    
    return options;
  }, [language, activeTab, allWeeksData, rankingWeekCount]);
  
  // 切换页签时更新筛选条件
  useEffect(() => {
    if (activeTab === 'pending') {
      setReviewStatusFilter(FILTER_OPTIONS.PENDING);
    } else if (activeTab === 'reviewed') {
      // 已审核页签显示已通过和已拒绝的任务
      setReviewStatusFilter(undefined); // 获取全部，然后在前端过滤
    }
  }, [activeTab]);
  
  // 初始化时加载所有周次数据
  useEffect(() => {
    fetchAllWeeksData();
  }, [fetchAllWeeksData]);
  
  // 加载初始数据
  useEffect(() => {
    if (activeTab !== 'pointsLog') {
      fetchTasks();
    }
  }, [fetchTasks, activeTab]);
  
  // 加载积分日志
  useEffect(() => {
    if (activeTab === 'pointsLog') {
      fetchPointsLogs();
    }
  }, [activeTab, fetchPointsLogs]);

  // 加载CC积分排行榜
  const fetchRanking = useCallback(async () => {
    try {
      setRankingLoading(true);
      setRankingError('');
      
      const result = await ccIncentiveService.getCcPointsRanking(
        currentWeek > 0 ? currentWeek : undefined
      );
      setRankingRecords(result.records || []);
      setRankingWeekCount(result.weekCount);
      
      // 更新排行榜周次到allWeeksData
      if (result.weekCount) {
        setAllWeeksData(prev => ({
          ...prev,
          rankingWeeks: [...new Set([...prev.rankingWeeks, result.weekCount])]
        }));
      }
    } catch (err: any) {
      console.error('获取CC积分排行榜失败:', err);
      setRankingError(err.message || (language === 'zh' ? '获取排行榜失败' : 'Failed to load ranking.'));
      setRankingRecords([]);
    } finally {
      setRankingLoading(false);
    }
  }, [language, currentWeek]);

  // 切换到排行榜页签时自动加载数据，周次改变时也重新加载
  useEffect(() => {
    if (activeTab === 'ranking') {
      fetchRanking();
    }
  }, [activeTab, fetchRanking]);

  // 导出排行榜数据
  const handleDownloadRanking = useCallback(() => {
    if (!rankingRecords.length) {
      alert(language === 'zh' ? '没有数据可导出' : 'No data to export');
      return;
    }

    const headers = ['排名', '用户ID', '用户名', '推特', 'QQ号', 'QQ群', '群编号', 'CC积分', 'Solana钱包地址', 'BSC钱包地址'];
    const rows = rankingRecords.map((item) => [
      item.rank ?? '',
      item.userId ?? '',
      item.userName ?? '',
      item.twitterUsername ?? '',
      item.qqNumber ?? '',
      item.qqGroup ?? '',
      item.groupNumber ?? '',
      item.ccPoints ?? 0,
      item.walletAddressSol ?? '',
      item.walletAddressBsc ?? '',
    ]);
    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const week = rankingWeekCount || 'latest';
    link.href = url;
    link.setAttribute('download', `cc_points_ranking_week${week}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [rankingRecords, rankingWeekCount, language]);
  
  // 当选择的周改变时重新加载数据
  useEffect(() => {
    if (selectedWeek !== undefined && selectedWeek !== currentWeek) {
      setCurrentWeek(selectedWeek);
    }
  }, [selectedWeek, currentWeek]);
  
  // 合并所有任务并根据页签过滤
  const allFilteredTasks = useMemo(() => {
    const allTasks = [...groupSizeTasks, ...qqGroupTasks, ...outGroupTasks, ...originalTasks];
    if (activeTab === 'pending') {
      return allTasks.filter(t => t.reviewStatus === REVIEW_STATUS.PENDING);
    }
    return allTasks.filter(t => t.reviewStatus !== REVIEW_STATUS.PENDING);
  }, [groupSizeTasks, qqGroupTasks, outGroupTasks, originalTasks, activeTab]);

  // 获取任务类型文本
  const getTaskTypeText = useCallback((taskType: string) => {
    switch (taskType) {
      case CC_TASK_TYPES.GROUP_SIZE:
        return language === 'zh' ? '群规模&拉新' : 'Group Size';
      case CC_TASK_TYPES.QQ_GROUP:
        return language === 'zh' ? '群内任务' : 'Group Internal';
      case CC_TASK_TYPES.OUT_GROUP:
        return language === 'zh' ? '外群任务' : 'External Group';
      case CC_TASK_TYPES.ORIGINAL:
        return language === 'zh' ? '长期建设' : 'Long-term';
      default:
        return language === 'zh' ? '未知类型' : 'Unknown';
    }
  }, [language]);

  // 获取任务类型对应的显示类型
  const getTaskDisplayType = useCallback((task: CcTaskVO): 'groupSize' | 'qqGroup' | 'outGroup' | 'original' => {
    switch (task.taskType) {
      case CC_TASK_TYPES.GROUP_SIZE:
        return 'groupSize';
      case CC_TASK_TYPES.QQ_GROUP:
        return 'qqGroup';
      case CC_TASK_TYPES.OUT_GROUP:
        return 'outGroup';
      case CC_TASK_TYPES.ORIGINAL:
        return 'original';
      default:
        return 'original';
    }
  }, []);
  
  // 根据页签过滤任务（保留用于兼容）
  const filteredGroupSizeTasks = useMemo(() => {
    if (activeTab === 'pending') {
      return groupSizeTasks.filter(t => t.reviewStatus === REVIEW_STATUS.PENDING);
    }
    return groupSizeTasks.filter(t => t.reviewStatus !== REVIEW_STATUS.PENDING);
  }, [groupSizeTasks, activeTab]);
  
  const filteredQqGroupTasks = useMemo(() => {
    if (activeTab === 'pending') {
      return qqGroupTasks.filter(t => t.reviewStatus === REVIEW_STATUS.PENDING);
    }
    return qqGroupTasks.filter(t => t.reviewStatus !== REVIEW_STATUS.PENDING);
  }, [qqGroupTasks, activeTab]);
  
  const filteredOutGroupTasks = useMemo(() => {
    if (activeTab === 'pending') {
      return outGroupTasks.filter(t => t.reviewStatus === REVIEW_STATUS.PENDING);
    }
    return outGroupTasks.filter(t => t.reviewStatus !== REVIEW_STATUS.PENDING);
  }, [outGroupTasks, activeTab]);
  
  const filteredOriginalTasks = useMemo(() => {
    if (activeTab === 'pending') {
      return originalTasks.filter(t => t.reviewStatus === REVIEW_STATUS.PENDING);
    }
    return originalTasks.filter(t => t.reviewStatus !== REVIEW_STATUS.PENDING);
  }, [originalTasks, activeTab]);

  // 获取社群任务类型文本
  const getCommunityTypeText = useCallback((communityType?: number) => {
    if (communityType === 1) {
      return language === 'zh' ? '群内任务' : 'Group Internal';
    } else if (communityType === 2) {
      return language === 'zh' ? '外部群任务' : 'External Group';
    }
    return language === 'zh' ? '未知类型' : 'Unknown';
  }, [language]);
  
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      {/* 页签切换 */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'pending'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {language === 'zh' ? '待审核' : 'Pending Review'}
        </button>
        <button
          onClick={() => setActiveTab('reviewed')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'reviewed'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {language === 'zh' ? '已审核' : 'Reviewed'}
        </button>
        <button
          onClick={() => { setActiveTab('pointsLog'); setPointsLogPage(1); setPointsLogError(''); }}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'pointsLog'
              ? 'border-orange-500 text-orange-600 dark:text-orange-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {language === 'zh' ? '审核日志' : 'Review Log'} {pointsLogTotal > 0 && activeTab === 'pointsLog' && `(${pointsLogTotal})`}
        </button>
        <button
          onClick={() => { setActiveTab('ranking'); setRankingError(''); }}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'ranking'
              ? 'border-green-500 text-green-600 dark:text-green-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {language === 'zh' ? 'CC积分排行榜' : 'CC Points Ranking'}
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {activeTab === 'pending' 
            ? (language === 'zh' ? '待审核任务' : 'Pending Tasks')
            : activeTab === 'reviewed'
              ? (language === 'zh' ? '已审核任务' : 'Reviewed Tasks')
              : activeTab === 'pointsLog'
                ? (language === 'zh' ? '审核日志' : 'Review Log')
                : (language === 'zh' ? 'CC积分排行榜' : 'CC Points Ranking')}
        </h2>
        
        {/* 筛选器 */}
        <div className="flex flex-wrap items-center gap-4">
          {/* 周选择器 */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {language === 'zh' ? '周次：' : 'Week:'}
            </label>
            <select
              value={currentWeek}
              onChange={(e) => setCurrentWeek(parseInt(e.target.value))}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {weekOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* 错误信息 */}
      {error && activeTab !== 'pointsLog' && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}
      {pointsLogError && activeTab === 'pointsLog' && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 rounded-lg">
          {pointsLogError}
        </div>
      )}
      
      {/* 加载状态 */}
      {loading && activeTab !== 'pointsLog' && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {language === 'zh' ? '加载中...' : 'Loading...'}
        </div>
      )}
      
      {/* 积分日志页签内容 */}
      {activeTab === 'pointsLog' && (
        <div>
          {pointsLogLoading ? (
            <div className="text-center py-8 text-gray-500">{language === 'zh' ? '加载中...' : 'Loading...'}</div>
          ) : pointsLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">{language === 'zh' ? '暂无日志' : 'No logs'}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">{language === 'zh' ? '用户' : 'User'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">{language === 'zh' ? '周次' : 'Week'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">{language === 'zh' ? '任务类型' : 'Task Type'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">{language === 'zh' ? '审核结果' : 'Result'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">{language === 'zh' ? '积分' : 'Points'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">{language === 'zh' ? '审核意见' : 'Message'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">{language === 'zh' ? '审核时间' : 'Review Time'}</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {pointsLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{log.userName || '-'}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">ID: {log.userId}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{log.userEmail || '-'}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{language === 'zh' ? `第${log.weekCount}周` : `Week ${log.weekCount}`}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{getTaskTypeText(log.taskType)}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          log.reviewStatus === 1 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {log.reviewStatus === 1 ? (language === 'zh' ? '通过' : 'Approved') : (language === 'zh' ? '拒绝' : 'Rejected')}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400 font-semibold">{log.points}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate" title={log.reviewMessage || '-'}>{log.reviewMessage || '-'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {new Date(log.createTime).toLocaleString('zh-CN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pointsLogTotal > pointsLogPageSize && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">
                    {language === 'zh' 
                      ? `显示 ${(pointsLogPage - 1) * pointsLogPageSize + 1} 到 ${Math.min(pointsLogPage * pointsLogPageSize, pointsLogTotal)} 条，共 ${pointsLogTotal} 条`
                      : `Showing ${(pointsLogPage - 1) * pointsLogPageSize + 1} to ${Math.min(pointsLogPage * pointsLogPageSize, pointsLogTotal)} of ${pointsLogTotal}`}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPointsLogPage(Math.max(1, pointsLogPage - 1))}
                      disabled={pointsLogPage === 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50"
                    >{language === 'zh' ? '上一页' : 'Prev'}</button>
                    <span className="px-3 py-1 text-sm">{pointsLogPage} / {Math.ceil(pointsLogTotal / pointsLogPageSize)}</span>
                    <button
                      onClick={() => setPointsLogPage(Math.min(Math.ceil(pointsLogTotal / pointsLogPageSize), pointsLogPage + 1))}
                      disabled={pointsLogPage >= Math.ceil(pointsLogTotal / pointsLogPageSize)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50"
                    >{language === 'zh' ? '下一页' : 'Next'}</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* CC积分排行榜页签内容 */}
      {activeTab === 'ranking' && (
        <div>
          {/* 排行榜导出按钮 */}
          <div className="flex justify-end items-center mb-6 gap-3">
            {typeof rankingWeekCount === 'number' && rankingWeekCount > 0 && (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {language === 'zh' ? `当前显示第 ${rankingWeekCount} 周` : `Showing Week ${rankingWeekCount}`}
              </span>
            )}
            <button
              onClick={handleDownloadRanking}
              disabled={!rankingRecords.length}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {language === 'zh' ? '导出本周数据' : 'Export Week Data'}
            </button>
          </div>

          {rankingError && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-600 dark:text-red-400">{rankingError}</p>
            </div>
          )}

          {rankingLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : rankingRecords.length === 0 ? (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              {language === 'zh' ? '暂无排行榜数据' : 'No ranking data'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{language === 'zh' ? '排名' : 'Rank'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{language === 'zh' ? '用户ID' : 'User ID'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{language === 'zh' ? '用户名' : 'Username'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{language === 'zh' ? '推特' : 'Twitter'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{language === 'zh' ? 'QQ号' : 'QQ Number'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{language === 'zh' ? 'QQ群' : 'QQ Group'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{language === 'zh' ? '群编号' : 'Group Number'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{language === 'zh' ? 'CC积分' : 'CC Points'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{language === 'zh' ? 'Solana钱包' : 'Solana Wallet'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{language === 'zh' ? 'BSC钱包' : 'BSC Wallet'}</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {rankingRecords.map((item) => (
                    <tr key={item.userId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.rank}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.userId}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.userName || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.twitterUsername || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.qqNumber || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.qqGroup || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.groupNumber || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600 dark:text-blue-300 font-semibold">{item.ccPoints ?? 0}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate" title={item.walletAddressSol || '-'}>{item.walletAddressSol || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate" title={item.walletAddressBsc || '-'}>{item.walletAddressBsc || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* 任务列表 */}
      {!loading && (activeTab === 'pending' || activeTab === 'reviewed') && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'zh' ? '用户' : 'User'}
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'zh' ? '任务类型' : 'Task Type'}
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'zh' ? '周次' : 'Week'}
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'zh' ? '内容链接' : 'Content Link'}
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'zh' ? '状态' : 'Status'}
                </th>
                {activeTab === 'reviewed' && (
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {language === 'zh' ? '积分' : 'Points'}
                  </th>
                )}
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'zh' ? '时间' : 'Time'}
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'zh' ? '操作' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {allFilteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={activeTab === 'reviewed' ? 8 : 7} className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                    {language === 'zh' ? '暂无任务' : 'No tasks available'}
                  </td>
                </tr>
              ) : (
                allFilteredTasks.map((task: CcTaskVO) => (
                  <tr key={task.id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{task.userName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{task.userEmail}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        task.taskType === CC_TASK_TYPES.GROUP_SIZE 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : task.taskType === CC_TASK_TYPES.QQ_GROUP 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' 
                            : task.taskType === CC_TASK_TYPES.OUT_GROUP
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                              : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                      }`}>
                        {getTaskTypeText(task.taskType)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {language === 'zh' ? `第${task.weekCount}周` : `Week ${task.weekCount}`}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {task.contentLink ? (
                        <a 
                          href={task.contentLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                          title={task.contentLink}
                        >
                          {task.contentLink?.substring(0, 30)}...
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(task.reviewStatus)}`}>
                        {getStatusText(task.reviewStatus)}
                      </span>
                    </td>
                    {activeTab === 'reviewed' && (
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                        {task.points || 0}
                      </td>
                    )}
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                      {new Date(task.createTime).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setActiveTask({ type: getTaskDisplayType(task), task })} 
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        {activeTab === 'pending' 
                          ? (language === 'zh' ? '审核' : 'Review')
                          : (language === 'zh' ? '查看' : 'View')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* 审核弹窗 */}
      {activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {activeTab === 'pending' 
                  ? (language === 'zh' ? '审核任务' : 'Review Task')
                  : (language === 'zh' ? '查看任务详情' : 'View Task Details')}
              </h3>
              <button
                onClick={() => setActiveTask(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* 截图展示 */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {language === 'zh' ? '任务截图' : 'Task Screenshots'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeTask.task.screenshot?.split(',').map((url, index) => {
                      // 群规模&拉新任务截图标签：第一张为本周，第二张为上周
                      const getScreenshotLabel = () => {
                        if (activeTask.type === 'groupSize') {
                          if (index === 0) return language === 'zh' ? '本周QQ群成员截图' : 'This Week QQ Group';
                          if (index === 1) return language === 'zh' ? '上周QQ群成员截图' : 'Last Week QQ Group';
                        }
                        return `${language === 'zh' ? '截图' : 'Screenshot'} ${index + 1}`;
                      };
                      
                      return (
                        <div key={index} className="relative group">
                          {/* 截图标签 */}
                          <div className="absolute top-2 left-2 z-10 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                            {getScreenshotLabel()}
                          </div>
                          <a href={url.trim()} target="_blank" rel="noopener noreferrer">
                            <img 
                              src={url.trim()} 
                              alt={getScreenshotLabel()}
                              className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-600 hover:opacity-90 transition-opacity"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-30 rounded-lg">
                              <span className="text-white text-sm font-medium">
                                {language === 'zh' ? '点击查看大图' : 'Click to view'}
                              </span>
                            </div>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 任务基本信息 */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'zh' ? '任务信息' : 'Task Information'}
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{language === 'zh' ? '用户：' : 'User:'}</span>
                      <span className="font-medium">{activeTask.task.userName} ({activeTask.task.userEmail})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{language === 'zh' ? '任务类型：' : 'Task Type:'}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        activeTask.task.taskType === CC_TASK_TYPES.GROUP_SIZE 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : activeTask.task.taskType === CC_TASK_TYPES.QQ_GROUP 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' 
                            : activeTask.task.taskType === CC_TASK_TYPES.OUT_GROUP
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                              : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                      }`}>
                        {getTaskTypeText(activeTask.task.taskType)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{language === 'zh' ? '任务ID：' : 'Task ID:'}</span>
                      <span className="font-medium">{activeTask.task.id}</span>
                    </div>
                    {activeTask.task.contentLink && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">{language === 'zh' ? '内容链接：' : 'Content Link:'}</span>
                        <a 
                          href={activeTask.task.contentLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-xs"
                        >
                          {activeTask.task.contentLink}
                        </a>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{language === 'zh' ? '当前状态：' : 'Current Status:'}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(activeTask.task.reviewStatus)}`}>
                        {getStatusText(activeTask.task.reviewStatus)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{language === 'zh' ? '提交时间：' : 'Submit Time:'}</span>
                      <span>{new Date(activeTask.task.createTime).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* 审核表单 - 待审核和已审核都可以编辑 */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {activeTab === 'pending' 
                      ? (language === 'zh' ? '审核操作' : 'Review Action')
                      : (language === 'zh' ? '修改审核' : 'Modify Review')}
                  </h4>
                  
                  {/* 审核状态选择 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'zh' ? '审核结果：' : 'Review Result:'}
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="reviewStatus"
                          value={REVIEW_STATUS.APPROVED}
                          checked={reviewForm.reviewStatus === REVIEW_STATUS.APPROVED}
                          onChange={(e) => setReviewForm({...reviewForm, reviewStatus: parseInt(e.target.value)})}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>{language === 'zh' ? '通过' : 'Approve'}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="reviewStatus"
                          value={REVIEW_STATUS.REJECTED}
                          checked={reviewForm.reviewStatus === REVIEW_STATUS.REJECTED}
                          onChange={(e) => setReviewForm({...reviewForm, reviewStatus: parseInt(e.target.value)})}
                          className="text-red-600 focus:ring-red-500"
                        />
                        <span>{language === 'zh' ? '拒绝' : 'Reject'}</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* 积分填写 - 仅在通过时显示 */}
                  {reviewForm.reviewStatus === REVIEW_STATUS.APPROVED && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === 'zh' ? '奖励积分：' : 'Points Reward:'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={reviewForm.points}
                        onChange={(e) => setReviewForm({...reviewForm, points: parseInt(e.target.value) || 0})}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder={language === 'zh' ? '请输入积分...' : 'Enter points...'}
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {language === 'zh' ? '审核通过后，该积分将添加到用户的CC积分中' : 'Points will be added to user\'s CC points after approval'}
                      </p>
                    </div>
                  )}
                  
                  {/* 审核备注 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'zh' ? '审核备注：' : 'Review Notes:'}
                    </label>
                    <textarea
                      value={reviewForm.reviewMessage}
                      onChange={(e) => setReviewForm({...reviewForm, reviewMessage: e.target.value})}
                      rows={3}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder={language === 'zh' ? '请输入审核备注...' : 'Please enter review notes...'}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setActiveTask(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {language === 'zh' ? '取消' : 'Cancel'}
              </button>
              <button
                onClick={handleReviewTask}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  language === 'zh' ? '提交中...' : 'Submitting...'
                ) : (
                  activeTab === 'pending'
                    ? (language === 'zh' ? '提交审核' : 'Submit Review')
                    : (language === 'zh' ? '保存修改' : 'Save Changes')
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupLeaderIncentiveReview;
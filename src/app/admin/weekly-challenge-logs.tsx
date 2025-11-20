'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { adminWeeklyChallengeService, type WeeklyRankingItem } from '../../services/adminWeeklyChallengeService';

interface AutoReviewLog {
  id: number;
  taskType: string;
  taskTypeName: string;
  taskId: number;
  userId: number;
  username: string;
  weekCount: number;
  dateRange: string;
  contentLink: string;
  screenshot: string;
  ocrText: string;
  ocrDuration: number;
  ocrSuccess: boolean;
  verified: boolean;
  confidence: number;
  score: number;
  comment: string;
  hasRetweet: boolean;
  hasLike: boolean;
  hasComment: boolean;
  usernameMatch: boolean;
  aiDuration: number;
  totalDuration: number;
  reviewStatus: number;
  reviewStatusName: string;
  reviewMessage: string;
  pointsAdded: boolean;
  pointsValue: number;
  errorMessage: string;
  createTime: string;
  updateTime: string;
}

interface PageData {
  records: AutoReviewLog[];
  total: number;
  current: number;
  size: number;
}

export default function WeeklyChallengeLogsTab() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'logs' | 'ranking'>('logs');
  const [logs, setLogs] = useState<AutoReviewLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 筛选条件
  const [taskType, setTaskType] = useState('');
  const [weekCount, setWeekCount] = useState('');
  const [reviewStatus, setReviewStatus] = useState('');
  const [userId, setUserId] = useState('');
  
  // 分页
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  
  // 周排行状态
  const [rankingWeek, setRankingWeek] = useState<string>('');
  const [rankingLoading, setRankingLoading] = useState(false);
  const [rankingError, setRankingError] = useState('');
  const [rankingRecords, setRankingRecords] = useState<WeeklyRankingItem[]>([]);
  const [rankingWeekCount, setRankingWeekCount] = useState<number | undefined>();
  
  // 详情弹窗
  const [selectedLog, setSelectedLog] = useState<AutoReviewLog | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  
  // 修改审核弹窗
  const [showEditReview, setShowEditReview] = useState(false);
  const [editingLog, setEditingLog] = useState<AutoReviewLog | null>(null);
  const [editReviewStatus, setEditReviewStatus] = useState<number>(1);
  const [editReviewMessage, setEditReviewMessage] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [originalReviewStatus, setOriginalReviewStatus] = useState<number>(1);
  const [originalReviewMessage, setOriginalReviewMessage] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const fetchLogs = async (page: number = current) => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        current: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (taskType) params.append('taskType', taskType);
      if (weekCount) params.append('weekCount', weekCount);
      if (reviewStatus) params.append('reviewStatus', reviewStatus);
      // 只有当userId不为空且trim后不为空时才添加参数
      if (userId && userId.trim() !== '') params.append('userId', userId.trim());
      
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8100/api';
      const response = await fetch(`${apiBaseUrl}/auto-review-log/list?${params.toString()}`, {
        credentials: 'include',
        cache: 'no-store', // 禁用缓存
      });
      
      if (!response.ok) {
        throw new Error('获取数据失败');
      }
      
      const result = await response.json();
      
      if (result.code === 0 && result.data) {
        const pageData: PageData = result.data;
        setLogs(pageData.records);
        setTotal(pageData.total);
        
        // 使用前端传入的page参数设置当前页，而不是后端返回的pageData.current
        // 计算实际的最大页数
        const maxPages = Math.ceil(pageData.total / pageSize);
        // 确保page在有效范围内
        const validPage = Math.max(1, Math.min(page, maxPages));
        setCurrent(validPage);
        
        // 如果请求的页码超出范围，重新获取有效页码的数据
        if (validPage !== page && maxPages > 0) {
          fetchLogs(validPage);
          return;
        }
      } else {
        throw new Error(result.message || '获取数据失败');
      }
    } catch (err: any) {
      console.error('获取审核日志失败:', err);
      setError(err.message || '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'logs') {
      setCurrent(1);
      fetchLogs(1);
    }
  }, [activeTab, taskType, weekCount, reviewStatus, userId]);

  const handlePageChange = (page: number) => {
    setCurrent(page);
    fetchLogs(page);
  };

  const fetchRanking = async () => {
    setRankingLoading(true);
    setRankingError('');
    try {
      // 获取排行榜时使用-1获取全部数据
      const params: { weekCount?: number; limit: number } = { limit: -1 };
      if (rankingWeek.trim()) {
        const parsed = parseInt(rankingWeek.trim(), 10);
        if (!Number.isNaN(parsed) && parsed > 0) {
          params.weekCount = parsed;
        } else {
          throw new Error('周次必须为正整数');
        }
      }
      const response = await adminWeeklyChallengeService.getWeeklyRanking(params);
      setRankingRecords(response.records || []);
      const targetWeek = response.weekCount ?? params.weekCount;
      setRankingWeekCount(targetWeek !== undefined ? targetWeek : undefined);
    } catch (err: any) {
      console.error('获取周排行榜失败:', err);
      setRankingError(err.message || '获取周排行榜失败');
      setRankingRecords([]);
      setRankingWeekCount(undefined);
    } finally {
      setRankingLoading(false);
    }
  };

  const fetchAllRankingData = async () => {
    // 用于导出功能的专门方法，传入limit=-1获取全部数据
    const params: { weekCount?: number; limit: number } = { limit: -1 };
    if (rankingWeek.trim()) {
      const parsed = parseInt(rankingWeek.trim(), 10);
      if (!Number.isNaN(parsed) && parsed > 0) {
        params.weekCount = parsed;
      } else {
        throw new Error('周次必须为正整数');
      }
    }
    
    const response = await adminWeeklyChallengeService.getWeeklyRanking(params);
    return response.records || [];
  };

  useEffect(() => {
    if (activeTab === 'ranking') {
      fetchRanking();
    }
  }, [activeTab]);

  const handleDownloadRanking = async () => {
    try {
      setRankingLoading(true);
      // 获取全部数据进行导出
      const allRankingRecords = await fetchAllRankingData();
      if (!allRankingRecords.length) {
        alert('没有数据可导出');
        return;
      }

      const headers = ['排名', '用户ID', '用户名', '推特', '周积分', '钱包地址'];
      const rows = allRankingRecords.map((item) => [
        item.rank ?? '',
        item.id ?? '',
        item.userName ?? '',
        item.twitterUsername ?? '',
        item.weeklyPoints ?? 0,
        item.walletAddress ?? '',
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
      const week = (rankingWeekCount ?? rankingWeek) || 'latest';
      link.href = url;
      link.setAttribute('download', `weekly-ranking-week-${week}-all.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert(`成功导出${allRankingRecords.length}条排行榜数据`);
    } catch (err: any) {
      console.error('导出排行榜失败:', err);
      alert(err.message || '导出排行榜失败');
    } finally {
      setRankingLoading(false);
    }
  };

  const handleViewDetail = async (logId: number) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8100/api';
      const response = await fetch(`${apiBaseUrl}/auto-review-log/${logId}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('获取详情失败');
      }
      
      const result = await response.json();
      
      if (result.code === 0 && result.data) {
        setSelectedLog(result.data);
        setShowDetail(true);
      }
    } catch (err: any) {
      console.error('获取详情失败:', err);
      alert(err.message || '获取详情失败');
    }
  };

  const handleEditReview = (log: AutoReviewLog) => {
    setEditingLog(log);
    setEditReviewStatus(log.reviewStatus);
    setEditReviewMessage(log.reviewMessage || '');
    setOriginalReviewStatus(log.reviewStatus);
    setOriginalReviewMessage(log.reviewMessage || '');
    setShowEditReview(true);
  };

  // 检查是否有更改
  const hasChanges = () => {
    return editReviewStatus !== originalReviewStatus || 
           editReviewMessage.trim() !== originalReviewMessage.trim();
  };

  const handleSubmitReview = async () => {
    if (!editingLog) return;

    setEditLoading(true);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8100/api';
      const endpoint = editingLog.taskType === 'communication' 
        ? '/admin/weekly-challenge/review/communication'
        : '/admin/weekly-challenge/review/community';
      
      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          taskId: editingLog.taskId,
          reviewStatus: editReviewStatus,
          reviewMessage: editReviewMessage || null,
        }),
      });

      if (!response.ok) {
        throw new Error('修改审核状态失败');
      }

      const result = await response.json();

      if (result.code === 0) {
        // 显示成功提示
        setShowSuccessToast(true);
        // 1秒后关闭弹窗和提示
        setTimeout(() => {
          setShowSuccessToast(false);
          setShowEditReview(false);
          // 刷新列表，如果当前页可能超出范围，则返回第一页
          const currentPage = Math.min(current, Math.ceil(total / pageSize));
          fetchLogs(currentPage > 0 ? currentPage : 1);
        }, 1000);
      } else {
        throw new Error(result.message || '修改审核状态失败');
      }
    } catch (err: any) {
      console.error('修改审核状态失败:', err);
      alert(err.message || '修改审核状态失败');
    } finally {
      setEditLoading(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        每周挑战数据
      </h2>

      <div className="flex space-x-6 border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => { setActiveTab('logs'); setError(''); }}
          className={`py-3 px-2 border-b-2 text-sm font-medium transition-colors ${
            activeTab === 'logs'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          自动审核记录
        </button>
        <button
          onClick={() => { setActiveTab('ranking'); setRankingError(''); }}
          className={`py-3 px-2 border-b-2 text-sm font-medium transition-colors ${
            activeTab === 'ranking'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          周积分排行榜
        </button>
      </div>

      {activeTab === 'logs' ? (
        <>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">任务类型</label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="">全部</option>
                <option value="communication">传播类</option>
                <option value="community">社群类</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">周数</label>
              <input
                type="number"
                value={weekCount}
                onChange={(e) => setWeekCount(e.target.value)}
                placeholder="筛选周数"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">审核状态</label>
              <select
                value={reviewStatus}
                onChange={(e) => setReviewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="">全部</option>
                <option value="1">通过</option>
                <option value="2">拒绝</option>
                <option value="0">待审核</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">用户ID</label>
              <input
                type="number"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="筛选用户ID"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">类型</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">用户</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">周数</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">OCR</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">AI置信度</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">状态</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">积分</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">耗时</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">时间</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{log.id}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{log.taskTypeName}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          <div>{log.username || '-'}</div>
                          <div className="text-xs text-gray-500">ID: {log.userId}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">第{log.weekCount}周</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {log.ocrSuccess ? (
                            <span className="text-green-600 dark:text-green-400">✓ 成功</span>
                          ) : (
                            <span className="text-red-600 dark:text-red-400">✗ 失败</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {log.confidence !== null ? `${log.confidence}%` : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            log.reviewStatus === 1
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : log.reviewStatus === 2
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {log.reviewStatusName}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {log.pointsAdded ? (
                            <span className="text-green-600 dark:text-green-400">+{log.pointsValue}</span>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {log.totalDuration ? `${(log.totalDuration / 1000).toFixed(1)}s` : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(log.createTime).toLocaleString('zh-CN', {
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewDetail(log.id)}
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              详情
                            </button>
                            {log.reviewStatus !== 0 && (
                              <button
                                onClick={() => handleEditReview(log)}
                                className="text-green-600 dark:text-green-400 hover:underline"
                              >
                                修改
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(current - 1)}
                    disabled={current <= 1}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    上一页
                  </button>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    第 {current} / {totalPages} 页，共 {total} 条
                  </span>
                  <button
                    onClick={() => handlePageChange(current + 1)}
                    disabled={current >= totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一页
                  </button>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div className="flex items-end gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">周次</label>
                <input
                  type="number"
                  value={rankingWeek}
                  onChange={(e) => setRankingWeek(e.target.value)}
                  placeholder="不填默认最新周"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                onClick={fetchRanking}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                查询
              </button>
            </div>
            <div className="flex items-center gap-3">
              {typeof rankingWeekCount === 'number' && rankingWeekCount > 0 && (
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  当前显示第 {rankingWeekCount} 周
                </span>
              )}
              <button
                onClick={handleDownloadRanking}
                disabled={!rankingRecords.length}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                导出本周期数据
              </button>
            </div>
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
              暂无排行榜数据
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">排名</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">用户ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">用户名</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">推特</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">周积分</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">钱包地址</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {rankingRecords.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.rank ?? '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.id}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.userName || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.twitterUsername || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600 dark:text-blue-300 font-semibold">{item.weeklyPoints ?? 0}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.walletAddress || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* 详情弹窗 */}
      {showDetail && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  审核日志详情 #{selectedLog.id}
                </h3>
                <button
                  onClick={() => setShowDetail(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* 基本信息 */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">基本信息</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-500">任务类型：</span>{selectedLog.taskTypeName}</div>
                    <div><span className="text-gray-500">任务ID：</span>{selectedLog.taskId}</div>
                    <div><span className="text-gray-500">用户：</span>{selectedLog.username} (ID: {selectedLog.userId})</div>
                    <div><span className="text-gray-500">周数：</span>第{selectedLog.weekCount}周 ({selectedLog.dateRange})</div>
                  </div>
                  <div className="mt-2 text-sm">
                    <div className="text-gray-500">链接：</div>
                    <a href={selectedLog.contentLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                      {selectedLog.contentLink}
                    </a>
                  </div>
                </div>

                {/* OCR识别 */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">OCR识别</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                    <div>
                      <span className="text-gray-500">状态：</span>
                      {selectedLog.ocrSuccess ? (
                        <span className="text-green-600">✓ 成功</span>
                      ) : (
                        <span className="text-red-600">✗ 失败</span>
                      )}
                    </div>
                    <div><span className="text-gray-500">耗时：</span>{selectedLog.ocrDuration ? `${(selectedLog.ocrDuration / 1000).toFixed(2)}秒` : '-'}</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-gray-500 mb-1">识别文本：</div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded max-h-40 overflow-y-auto text-xs">
                      {selectedLog.ocrText || '无'}
                    </div>
                  </div>
                </div>

                {/* AI验证 */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">AI验证</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                    <div>
                      <span className="text-gray-500">结果：</span>
                      {selectedLog.verified ? (
                        <span className="text-green-600">✓ 通过</span>
                      ) : (
                        <span className="text-red-600">✗ 未通过</span>
                      )}
                    </div>
                    <div><span className="text-gray-500">置信度：</span>{selectedLog.confidence}%</div>
                    <div><span className="text-gray-500">评分：</span>{selectedLog.score || 0}分</div>
                    <div><span className="text-gray-500">耗时：</span>{selectedLog.aiDuration ? `${(selectedLog.aiDuration / 1000).toFixed(2)}秒` : '-'}</div>
                  </div>
                  <div className="text-sm mb-2">
                    <div className="text-gray-500 mb-1">评论：</div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                      {selectedLog.comment || '无'}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">转推：</span>
                      {selectedLog.hasRetweet ? '✓' : '✗'}
                    </div>
                    <div>
                      <span className="text-gray-500">点赞：</span>
                      {selectedLog.hasLike ? '✓' : '✗'}
                    </div>
                    <div>
                      <span className="text-gray-500">评论：</span>
                      {selectedLog.hasComment ? '✓' : '✗'}
                    </div>
                    <div>
                      <span className="text-gray-500">用户名：</span>
                      {selectedLog.usernameMatch ? '✓' : '✗'}
                    </div>
                  </div>
                </div>

                {/* 审核结果 */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">审核结果</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-500">状态：</span>{selectedLog.reviewStatusName}</div>
                    <div>
                      <span className="text-gray-500">积分：</span>
                      {selectedLog.pointsAdded ? (
                        <span className="text-green-600">+{selectedLog.pointsValue}分</span>
                      ) : (
                        <span>0分</span>
                      )}
                    </div>
                    <div><span className="text-gray-500">创建时间：</span>{new Date(selectedLog.createTime).toLocaleString('zh-CN')}</div>
                    <div><span className="text-gray-500">更新时间：</span>{new Date(selectedLog.updateTime).toLocaleString('zh-CN')}</div>
                  </div>
                  {selectedLog.reviewMessage && (
                    <div className="mt-2 text-sm">
                      <div className="text-gray-500 mb-1">审核消息：</div>
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                        {selectedLog.reviewMessage}
                      </div>
                    </div>
                  )}
                  {selectedLog.errorMessage && (
                    <div className="mt-2 text-sm">
                      <div className="text-red-500 mb-1">错误信息：</div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded text-red-600 dark:text-red-400">
                        {selectedLog.errorMessage}
                      </div>
                    </div>
                  )}
                </div>

                {/* 截图 */}
                {selectedLog.screenshot && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">截图</h4>
                    <img 
                      src={selectedLog.screenshot} 
                      alt="任务截图" 
                      className="max-w-full h-auto rounded border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetail(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 修改审核弹窗 */}
      {showEditReview && editingLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  修改审核结果 - 任务 #{editingLog.taskId}
                </h3>
                <button
                  onClick={() => setShowEditReview(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* 任务信息 */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-500">任务类型：</span>{editingLog.taskTypeName}</div>
                    <div><span className="text-gray-500">用户：</span>{editingLog.username} (ID: {editingLog.userId})</div>
                    <div><span className="text-gray-500">周数：</span>第{editingLog.weekCount}周</div>
                    <div><span className="text-gray-500">当前状态：</span>{editingLog.reviewStatusName}</div>
                  </div>
                  {editingLog.reviewMessage && (
                    <div className="mt-2 text-sm">
                      <div className="text-gray-500">原审核消息：</div>
                      <div className="mt-1 text-gray-900 dark:text-gray-100">{editingLog.reviewMessage}</div>
                    </div>
                  )}
                </div>

                {/* 审核状态 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    审核状态 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editReviewStatus}
                    onChange={(e) => setEditReviewStatus(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  >
                    <option value={1}>通过</option>
                    <option value={2}>拒绝</option>
                  </select>
                </div>

                {/* 审核意见 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    审核意见（选填）
                  </label>
                  <textarea
                    value={editReviewMessage}
                    onChange={(e) => setEditReviewMessage(e.target.value)}
                    rows={3}
                    placeholder="请输入审核意见..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* 成功提示 */}
              {showSuccessToast && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>修改审核状态成功</span>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowEditReview(false)}
                  disabled={editLoading || showSuccessToast}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={editLoading || showSuccessToast || !hasChanges()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editLoading ? '提交中...' : '确认修改'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

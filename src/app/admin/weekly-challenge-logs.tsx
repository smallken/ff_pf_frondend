'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

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
  
  // 详情弹窗
  const [selectedLog, setSelectedLog] = useState<AutoReviewLog | null>(null);
  const [showDetail, setShowDetail] = useState(false);

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
      if (userId) params.append('userId', userId);
      
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8100/api';
      const response = await fetch(`${apiBaseUrl}/auto-review-log/list?${params.toString()}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('获取数据失败');
      }
      
      const result = await response.json();
      
      if (result.code === 0 && result.data) {
        const pageData: PageData = result.data;
        setLogs(pageData.records);
        setTotal(pageData.total);
        setCurrent(pageData.current);
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
    fetchLogs(1);
  }, [taskType, weekCount, reviewStatus, userId]);

  const handlePageChange = (page: number) => {
    setCurrent(page);
    fetchLogs(page);
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

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        每周挑战自动审核记录
      </h2>

      {/* 筛选条件 */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            任务类型
          </label>
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            周数
          </label>
          <input
            type="number"
            value={weekCount}
            onChange={(e) => setWeekCount(e.target.value)}
            placeholder="筛选周数"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            审核状态
          </label>
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            用户ID
          </label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="筛选用户ID"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* 加载状态 */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* 表格 */}
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
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      第{log.weekCount}周
                    </td>
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
                        minute: '2-digit' 
                      })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewDetail(log.id)}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
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
    </div>
  );
}

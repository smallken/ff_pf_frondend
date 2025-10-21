'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { analyticsService, type DateRangeParams, type AnalyticsData } from '../../services/analyticsService';

const COLORS = {
  primary: '#3B82F6',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
};

type DatePreset = '7D' | '2W' | '4W' | '3M' | '1Y' | 'custom';

const DATE_PRESETS: { value: DatePreset; label: string }[] = [
  { value: '7D', label: '7天' },
  { value: '2W', label: '2周' },
  { value: '4W', label: '4周' },
  { value: '3M', label: '3个月' },
  { value: '1Y', label: '1年' },
];

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [datePreset, setDatePreset] = useState<DatePreset>('7D');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [currentMonthDailyTaskData, setCurrentMonthDailyTaskData] = useState<Array<{
    date: string;
    taskSubmissions: number;
    taskApproved: number;
    taskRejected: number;
  }>>([]);
  const [currentMonthDailyLoading, setCurrentMonthDailyLoading] = useState(true);
  const [currentMonthDailyError, setCurrentMonthDailyError] = useState('');

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params: DateRangeParams = {};
      
      if (datePreset === 'custom') {
        if (customStartDate && customEndDate) {
          params.startDate = customStartDate;
          params.endDate = customEndDate;
          console.log('🔍 获取自定义日期数据:', params);
        }
      } else {
        params.preset = datePreset as '7D' | '2W' | '4W' | '3M' | '1Y';
        console.log('🔍 获取预设日期数据:', params);
      }
      
      const data = await analyticsService.getAnalyticsData(params);
      console.log('✅ 数据已更新:', {
        totalSubmissions: data.totalSubmissions,
        dateRange: params.startDate ? `${params.startDate} ~ ${params.endDate}` : params.preset,
        dataPointsCount: data.timeSeriesData.length
      });
      setAnalyticsData(data);
    } catch (err: any) {
      console.error('获取分析数据失败:', err);
      setError(err.message || '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 只有选择快捷日期时才自动触发，自定义日期需要点击"应用"按钮
    if (datePreset !== 'custom') {
      fetchAnalyticsData();
    }
  }, [datePreset]);

  useEffect(() => {
    const loadCurrentMonthDailyData = async () => {
      setCurrentMonthDailyLoading(true);
      setCurrentMonthDailyError('');

      try {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const formatDateToYMD = (date: Date) => date.toISOString().split('T')[0];

        const monthlyData = await analyticsService.getAnalyticsData({
          startDate: formatDateToYMD(start),
          endDate: formatDateToYMD(end)
        });

        const recordMap = new Map(monthlyData.timeSeriesData.map((item) => [item.date, item]));
        const days: Array<{
          date: string;
          taskSubmissions: number;
          taskApproved: number;
          taskRejected: number;
        }> = [];

        for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
          const key = formatDateToYMD(cursor);
          const record = recordMap.get(key);

          days.push({
            date: key,
            taskSubmissions: record ? record.taskSubmissions : 0,
            taskApproved: record ? record.taskApproved : 0,
            taskRejected: record ? record.taskRejected : 0
          });
        }

        setCurrentMonthDailyTaskData(days);
      } catch (err: any) {
        console.error('获取当月每日审核数据失败:', err);
        setCurrentMonthDailyError(err.message || '获取当月每日审核数据失败');
        setCurrentMonthDailyTaskData([]);
      } finally {
        setCurrentMonthDailyLoading(false);
      }
    };

    loadCurrentMonthDailyData();
  }, []);

  const handleDatePresetChange = (preset: DatePreset) => {
    setDatePreset(preset);
    setShowDatePicker(preset === 'custom');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-300">加载分析数据中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
        <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  if (!analyticsData) {
    return <div className="text-center py-12 text-gray-500 dark:text-gray-400">暂无数据</div>;
  }

  return (
    <div className="space-y-6">
      {/* 标题和日期选择 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">数据分析</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {datePreset === 'custom' && customStartDate && customEndDate
              ? `日期范围: ${customStartDate} 至 ${customEndDate}`
              : '查看各类表单的提交、通过和拒绝数据'}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {DATE_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handleDatePresetChange(preset.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                datePreset === preset.value
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50'
              }`}
            >
              {preset.label}
            </button>
          ))}
          
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="p-2 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50"
            title="选择日期范围"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 自定义日期选择器 */}
      {showDatePicker && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">开始日期</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => {
                    setCustomStartDate(e.target.value);
                    setDatePreset('custom');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">结束日期</label>
                <input
                  type="date"
                  value={customEndDate}
                  min={customStartDate || undefined}
                  onChange={(e) => {
                    setCustomEndDate(e.target.value);
                    setDatePreset('custom');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setCustomStartDate('');
                  setCustomEndDate('');
                  setDatePreset('7D');
                  setShowDatePicker(false);
                }}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (customStartDate && customEndDate) {
                    fetchAnalyticsData();
                    setShowDatePicker(false);
                  }
                }}
                disabled={!customStartDate || !customEndDate}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                应用
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 统计卡片 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-2">
        <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>以下统计数据来自真实数据库</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">总提交数</h3>
            <span className="text-xs">📊</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {analyticsData.totalSubmissions.toLocaleString()}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">已通过</h3>
            <span className="text-xs">✓</span>
          </div>
          <div className="text-3xl font-bold text-green-600">
            {analyticsData.approvedSubmissions.toLocaleString()}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">已拒绝</h3>
            <span className="text-xs">✗</span>
          </div>
          <div className="text-3xl font-bold text-red-600">
            {analyticsData.rejectedSubmissions.toLocaleString()}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">待审核</h3>
            <span className="text-xs">⏳</span>
          </div>
          <div className="text-3xl font-bold text-yellow-600">
            {analyticsData.pendingSubmissions.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 图表选项 */}
      <div className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg p-4 border">
        <span className="text-sm text-gray-600 dark:text-gray-400">图表类型：</span>
        <button
          onClick={() => setChartType('bar')}
          className={`px-3 py-1 text-sm rounded ${chartType === 'bar' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
        >
          柱状图
        </button>
        <button
          onClick={() => setChartType('line')}
          className={`px-3 py-1 text-sm rounded ${chartType === 'line' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
        >
          折线图
        </button>
      </div>

      {/* 时间序列图表 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">提交趋势</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            示例数据
          </span>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          {chartType === 'bar' ? (
            <BarChart data={analyticsData.timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="applicationSubmissions" name="申请表" fill={COLORS.primary} />
              <Bar dataKey="taskSubmissions" name="成果表" fill={COLORS.success} />
              <Bar dataKey="activitySubmissions" name="活动表" fill={COLORS.warning} />
            </BarChart>
          ) : (
            <LineChart data={analyticsData.timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="applicationSubmissions" name="申请表" stroke={COLORS.primary} strokeWidth={2} />
              <Line type="monotone" dataKey="taskSubmissions" name="成果表" stroke={COLORS.success} strokeWidth={2} />
              <Line type="monotone" dataKey="activitySubmissions" name="活动表" stroke={COLORS.warning} strokeWidth={2} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* 各类表单统计 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { title: '申请表统计', stats: analyticsData.applicationStats },
          { title: '成果表统计', stats: analyticsData.taskStats },
          { title: '活动表统计', stats: analyticsData.activityStats },
        ].map((item) => (
          <div key={item.title} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{item.title}</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">总数</span>
                <span className="text-sm font-medium">{item.stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">已通过</span>
                <span className="text-sm font-medium text-green-600">{item.stats.approved}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">已拒绝</span>
                <span className="text-sm font-medium text-red-600">{item.stats.rejected}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">待审核</span>
                <span className="text-sm font-medium text-yellow-600">{item.stats.pending}</span>
              </div>
              <div className="pt-3 border-t">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">通过率</span>
                  <span className="text-sm font-bold text-blue-600">{item.stats.approvalRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 成果表每日审核统计（当月） */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">成果表每日审核统计（当月）</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">仅展示当前月份内成果表的提交与审核情况</p>
          </div>
        </div>
        {currentMonthDailyLoading ? (
          <div className="flex justify-center items-center py-12 text-sm text-gray-500 dark:text-gray-400">
            加载中...
          </div>
        ) : currentMonthDailyError ? (
          <div className="text-sm text-red-500 text-center py-12">{currentMonthDailyError}</div>
        ) : currentMonthDailyTaskData.length > 0 ? (
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={currentMonthDailyTaskData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => value.slice(5)} />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value: number) => value?.toLocaleString()} labelFormatter={(label) => `${label}`} />
              <Legend />
              <Line type="monotone" dataKey="taskSubmissions" name="提交总数" stroke={COLORS.primary} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="taskApproved" name="已通过" stroke={COLORS.success} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="taskRejected" name="已拒绝" stroke={COLORS.danger} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-12">
            暂无当月成果表审核数据
          </div>
        )}
      </div>
    </div>
  );
}

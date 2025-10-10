/**
 * 模拟分析数据 - 用于前端测试
 * 在后端API实现后可以删除此文件
 */
import type { AnalyticsData, DateRangeParams } from './analyticsService';

// 生成随机数
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// 生成日期序列
const generateDateSeries = (days: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

// 获取日期范围天数
const getDaysFromPreset = (preset?: string): number => {
  switch (preset) {
    case '7D': return 7;
    case '2W': return 14;
    case '4W': return 28;
    case '3M': return 90;
    case '1Y': return 365;
    default: return 7;
  }
};

// 计算两个日期之间的天数
const getDaysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1; // 包含起始日
};

// 生成指定日期范围的日期序列
const generateCustomDateSeries = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const current = new Date(start);
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};

/**
 * 生成模拟分析数据
 */
export const generateMockAnalyticsData = (params: DateRangeParams = {}): AnalyticsData => {
  let dates: string[];
  
  // 判断是使用自定义日期还是预设
  if (params.startDate && params.endDate) {
    dates = generateCustomDateSeries(params.startDate, params.endDate);
  } else {
    const days = params.preset ? getDaysFromPreset(params.preset) : 7;
    dates = generateDateSeries(days);
  }
  
  // 生成时间序列数据
  const timeSeriesData = dates.map(date => {
    const appSubmissions = randomInt(5, 20);
    const taskSubmissions = randomInt(10, 50);
    const activitySubmissions = randomInt(2, 15);
    
    return {
      date,
      applicationSubmissions: appSubmissions,
      taskSubmissions: taskSubmissions,
      activitySubmissions: activitySubmissions,
      totalSubmissions: appSubmissions + taskSubmissions + activitySubmissions,
      
      applicationApproved: Math.floor(appSubmissions * 0.7),
      taskApproved: Math.floor(taskSubmissions * 0.8),
      activityApproved: Math.floor(activitySubmissions * 0.6),
      totalApproved: Math.floor((appSubmissions + taskSubmissions + activitySubmissions) * 0.75),
      
      applicationRejected: Math.floor(appSubmissions * 0.2),
      taskRejected: Math.floor(taskSubmissions * 0.1),
      activityRejected: Math.floor(activitySubmissions * 0.3),
      totalRejected: Math.floor((appSubmissions + taskSubmissions + activitySubmissions) * 0.15),
    };
  });
  
  // 计算总计
  const totalSubmissions = timeSeriesData.reduce((sum, d) => sum + d.totalSubmissions, 0);
  const totalApproved = timeSeriesData.reduce((sum, d) => sum + d.totalApproved, 0);
  const totalRejected = timeSeriesData.reduce((sum, d) => sum + d.totalRejected, 0);
  const totalPending = totalSubmissions - totalApproved - totalRejected;
  
  const appTotal = timeSeriesData.reduce((sum, d) => sum + d.applicationSubmissions, 0);
  const appApproved = timeSeriesData.reduce((sum, d) => sum + d.applicationApproved, 0);
  const appRejected = timeSeriesData.reduce((sum, d) => sum + d.applicationRejected, 0);
  const appPending = appTotal - appApproved - appRejected;
  
  const taskTotal = timeSeriesData.reduce((sum, d) => sum + d.taskSubmissions, 0);
  const taskApproved = timeSeriesData.reduce((sum, d) => sum + d.taskApproved, 0);
  const taskRejected = timeSeriesData.reduce((sum, d) => sum + d.taskRejected, 0);
  const taskPending = taskTotal - taskApproved - taskRejected;
  
  const actTotal = timeSeriesData.reduce((sum, d) => sum + d.activitySubmissions, 0);
  const actApproved = timeSeriesData.reduce((sum, d) => sum + d.activityApproved, 0);
  const actRejected = timeSeriesData.reduce((sum, d) => sum + d.activityRejected, 0);
  const actPending = actTotal - actApproved - actRejected;
  
  return {
    totalSubmissions,
    approvedSubmissions: totalApproved,
    rejectedSubmissions: totalRejected,
    pendingSubmissions: totalPending,
    
    applicationStats: {
      total: appTotal,
      approved: appApproved,
      rejected: appRejected,
      pending: appPending,
      approvalRate: appTotal > 0 ? (appApproved / appTotal) * 100 : 0,
      rejectionRate: appTotal > 0 ? (appRejected / appTotal) * 100 : 0,
    },
    
    taskStats: {
      total: taskTotal,
      approved: taskApproved,
      rejected: taskRejected,
      pending: taskPending,
      approvalRate: taskTotal > 0 ? (taskApproved / taskTotal) * 100 : 0,
      rejectionRate: taskTotal > 0 ? (taskRejected / taskTotal) * 100 : 0,
    },
    
    activityStats: {
      total: actTotal,
      approved: actApproved,
      rejected: actRejected,
      pending: actPending,
      approvalRate: actTotal > 0 ? (actApproved / actTotal) * 100 : 0,
      rejectionRate: actTotal > 0 ? (actRejected / actTotal) * 100 : 0,
    },
    
    // 任务类型细分
    taskCategoryStats: [
      {
        category: 'promotion',
        categoryName: '传播类',
        total: Math.floor(taskTotal * 0.3),
        approved: Math.floor(taskApproved * 0.3),
        rejected: Math.floor(taskRejected * 0.3),
        pending: Math.floor(taskPending * 0.3),
        approvalRate: 75,
      },
      {
        category: 'short',
        categoryName: '短篇类',
        total: Math.floor(taskTotal * 0.25),
        approved: Math.floor(taskApproved * 0.25),
        rejected: Math.floor(taskRejected * 0.25),
        pending: Math.floor(taskPending * 0.25),
        approvalRate: 82,
      },
      {
        category: 'long',
        categoryName: '长篇类',
        total: Math.floor(taskTotal * 0.2),
        approved: Math.floor(taskApproved * 0.2),
        rejected: Math.floor(taskRejected * 0.2),
        pending: Math.floor(taskPending * 0.2),
        approvalRate: 88,
      },
      {
        category: 'community',
        categoryName: '社区类',
        total: Math.floor(taskTotal * 0.25),
        approved: Math.floor(taskApproved * 0.25),
        rejected: Math.floor(taskRejected * 0.25),
        pending: Math.floor(taskPending * 0.25),
        approvalRate: 70,
      },
    ],
    
    timeSeriesData,
  };
};

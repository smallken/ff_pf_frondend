/**
 * 数据分析相关API服务
 */
import { request } from '@/utils/request';
import { generateMockAnalyticsData } from './mockAnalyticsData';
import { userService } from './userService';
import type { AdminStatsVO } from '@/types/api';

// 临时开关：在后端API实现前使用模拟数据
const USE_MOCK_DATA = false; // 改为使用真实数据

// 分析数据类型定义
export interface AnalyticsData {
  // 总体统计
  totalSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
  pendingSubmissions: number;
  
  // 各类表单统计
  applicationStats: FormTypeStats;
  taskStats: FormTypeStats;
  activityStats: FormTypeStats;
  
  // 任务类型细分统计（仅成果表）
  taskCategoryStats?: TaskCategoryStats[];
  
  // 时间序列数据
  timeSeriesData: TimeSeriesDataPoint[];
}

export interface FormTypeStats {
  total: number;
  approved: number;
  rejected: number;
  pending: number;
  approvalRate: number; // 通过率
  rejectionRate: number; // 拒绝率
}

export interface TaskCategoryStats {
  category: string; // promotion, short, long, community
  categoryName: string; // 分类中文名
  total: number;
  approved: number;
  rejected: number;
  pending: number;
  approvalRate: number;
}

export interface TimeSeriesDataPoint {
  date: string; // YYYY-MM-DD格式
  applicationSubmissions: number;
  taskSubmissions: number;
  activitySubmissions: number;
  totalSubmissions: number;
  
  applicationApproved: number;
  taskApproved: number;
  activityApproved: number;
  totalApproved: number;
  
  applicationRejected: number;
  taskRejected: number;
  activityRejected: number;
  totalRejected: number;
}

export interface DateRangeParams {
  startDate?: string; // YYYY-MM-DD格式
  endDate?: string; // YYYY-MM-DD格式
  preset?: '7D' | '2W' | '4W' | '3M' | '1Y'; // 快捷选项
}

export const analyticsService = {
  /**
   * 获取分析数据
   * @param params 日期范围参数
   */
  getAnalyticsData: async (params: DateRangeParams = {}): Promise<AnalyticsData> => {
    // 临时使用模拟数据，后端API实现后改为 USE_MOCK_DATA = false
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(generateMockAnalyticsData(params));
        }, 500); // 模拟网络延迟
      });
    }
    
    // 使用真实的后端统计数据
    try {
      // 获取管理员统计数据
      const stats: AdminStatsVO = await userService.getAdminStats();
      
      // 转换为 AnalyticsData 格式
      const analyticsData: AnalyticsData = {
        totalSubmissions: stats.totalSubmissions,
        approvedSubmissions: stats.approvedForms,
        rejectedSubmissions: stats.rejectedForms,
        pendingSubmissions: stats.pendingForms,
        
        // 申请表统计
        applicationStats: {
          total: stats.pendingApplications + stats.approvedApplications + stats.rejectedApplications,
          approved: stats.approvedApplications,
          rejected: stats.rejectedApplications,
          pending: stats.pendingApplications,
          approvalRate: stats.approvedApplications > 0 
            ? (stats.approvedApplications / (stats.approvedApplications + stats.rejectedApplications)) * 100 
            : 0,
          rejectionRate: stats.rejectedApplications > 0 
            ? (stats.rejectedApplications / (stats.approvedApplications + stats.rejectedApplications)) * 100 
            : 0,
        },
        
        // 成果表统计
        taskStats: {
          total: stats.pendingTaskSubmissions + stats.approvedTaskSubmissions + stats.rejectedTaskSubmissions,
          approved: stats.approvedTaskSubmissions,
          rejected: stats.rejectedTaskSubmissions,
          pending: stats.pendingTaskSubmissions,
          approvalRate: stats.approvedTaskSubmissions > 0 
            ? (stats.approvedTaskSubmissions / (stats.approvedTaskSubmissions + stats.rejectedTaskSubmissions)) * 100 
            : 0,
          rejectionRate: stats.rejectedTaskSubmissions > 0 
            ? (stats.rejectedTaskSubmissions / (stats.approvedTaskSubmissions + stats.rejectedTaskSubmissions)) * 100 
            : 0,
        },
        
        // 活动表统计
        activityStats: {
          total: stats.pendingActivityApplications + stats.approvedActivityApplications + stats.rejectedActivityApplications,
          approved: stats.approvedActivityApplications,
          rejected: stats.rejectedActivityApplications,
          pending: stats.pendingActivityApplications,
          approvalRate: stats.approvedActivityApplications > 0 
            ? (stats.approvedActivityApplications / (stats.approvedActivityApplications + stats.rejectedActivityApplications)) * 100 
            : 0,
          rejectionRate: stats.rejectedActivityApplications > 0 
            ? (stats.rejectedActivityApplications / (stats.approvedActivityApplications + stats.rejectedActivityApplications)) * 100 
            : 0,
        },
        
        // 任务类型细分统计
        taskCategoryStats: [
          {
            category: 'promotion',
            categoryName: '传播类',
            total: stats.currentMonthApprovedPromotionTasks,
            approved: stats.currentMonthApprovedPromotionTasks,
            rejected: 0,
            pending: 0,
            approvalRate: 100,
          },
          {
            category: 'short',
            categoryName: '短篇类',
            total: stats.currentMonthApprovedShortTasks,
            approved: stats.currentMonthApprovedShortTasks,
            rejected: 0,
            pending: 0,
            approvalRate: 100,
          },
          {
            category: 'long',
            categoryName: '长篇类',
            total: stats.currentMonthApprovedLongTasks,
            approved: stats.currentMonthApprovedLongTasks,
            rejected: 0,
            pending: 0,
            approvalRate: 100,
          },
          {
            category: 'community',
            categoryName: '社区类',
            total: stats.currentMonthApprovedCommunityTasks,
            approved: stats.currentMonthApprovedCommunityTasks,
            rejected: 0,
            pending: 0,
            approvalRate: 100,
          },
        ],
        
        // 时间序列数据 - 暂时使用模拟数据，因为后端没有提供
        // TODO: 后端需要实现按日期的统计API
        timeSeriesData: generateMockAnalyticsData(params).timeSeriesData,
      };
      
      return analyticsData;
    } catch (error) {
      console.error('获取真实统计数据失败，回退到模拟数据:', error);
      // 如果获取真实数据失败，回退到模拟数据
      return generateMockAnalyticsData(params);
    }
  },
};

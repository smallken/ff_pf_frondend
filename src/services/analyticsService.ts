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
      
      // 转换为 AnalyticsData 格式（确保所有数值都是数字类型）
      const toNumber = (val: any): number => {
        const num = Number(val);
        return isNaN(num) ? 0 : num;
      };
      
      const analyticsData: AnalyticsData = {
        totalSubmissions: toNumber(stats.totalSubmissions),
        approvedSubmissions: toNumber(stats.approvedForms),
        rejectedSubmissions: toNumber(stats.rejectedForms),
        pendingSubmissions: toNumber(stats.pendingForms),
        
        // 申请表统计
        applicationStats: {
          total: toNumber(stats.pendingApplications) + toNumber(stats.approvedApplications) + toNumber(stats.rejectedApplications),
          approved: toNumber(stats.approvedApplications),
          rejected: toNumber(stats.rejectedApplications),
          pending: toNumber(stats.pendingApplications),
          approvalRate: toNumber(stats.approvedApplications) > 0 
            ? (toNumber(stats.approvedApplications) / (toNumber(stats.approvedApplications) + toNumber(stats.rejectedApplications))) * 100 
            : 0,
          rejectionRate: toNumber(stats.rejectedApplications) > 0 
            ? (toNumber(stats.rejectedApplications) / (toNumber(stats.approvedApplications) + toNumber(stats.rejectedApplications))) * 100 
            : 0,
        },
        
        // 成果表统计
        taskStats: {
          total: toNumber(stats.pendingTaskSubmissions) + toNumber(stats.approvedTaskSubmissions) + toNumber(stats.rejectedTaskSubmissions),
          approved: toNumber(stats.approvedTaskSubmissions),
          rejected: toNumber(stats.rejectedTaskSubmissions),
          pending: toNumber(stats.pendingTaskSubmissions),
          approvalRate: toNumber(stats.approvedTaskSubmissions) > 0 
            ? (toNumber(stats.approvedTaskSubmissions) / (toNumber(stats.approvedTaskSubmissions) + toNumber(stats.rejectedTaskSubmissions))) * 100 
            : 0,
          rejectionRate: toNumber(stats.rejectedTaskSubmissions) > 0 
            ? (toNumber(stats.rejectedTaskSubmissions) / (toNumber(stats.approvedTaskSubmissions) + toNumber(stats.rejectedTaskSubmissions))) * 100 
            : 0,
        },
        
        // 活动表统计
        activityStats: {
          total: toNumber(stats.pendingActivityApplications) + toNumber(stats.approvedActivityApplications) + toNumber(stats.rejectedActivityApplications),
          approved: toNumber(stats.approvedActivityApplications),
          rejected: toNumber(stats.rejectedActivityApplications),
          pending: toNumber(stats.pendingActivityApplications),
          approvalRate: toNumber(stats.approvedActivityApplications) > 0 
            ? (toNumber(stats.approvedActivityApplications) / (toNumber(stats.approvedActivityApplications) + toNumber(stats.rejectedActivityApplications))) * 100 
            : 0,
          rejectionRate: toNumber(stats.rejectedActivityApplications) > 0 
            ? (toNumber(stats.rejectedActivityApplications) / (toNumber(stats.approvedActivityApplications) + toNumber(stats.rejectedActivityApplications))) * 100 
            : 0,
        },
        
        // 任务类型细分统计 - 注意：后端只提供了本月已通过的数据
        // 如果需要完整的待审核、已拒绝数据，需要后端提供更详细的API
        taskCategoryStats: [
          {
            category: 'promotion',
            categoryName: '传播类',
            total: toNumber(stats.currentMonthApprovedPromotionTasks),
            approved: toNumber(stats.currentMonthApprovedPromotionTasks),
            rejected: 0, // 后端未提供此数据
            pending: 0, // 后端未提供此数据
            approvalRate: toNumber(stats.currentMonthApprovedPromotionTasks) > 0 ? 100 : 0,
          },
          {
            category: 'short',
            categoryName: '短篇类',
            total: toNumber(stats.currentMonthApprovedShortTasks),
            approved: toNumber(stats.currentMonthApprovedShortTasks),
            rejected: 0, // 后端未提供此数据
            pending: 0, // 后端未提供此数据
            approvalRate: toNumber(stats.currentMonthApprovedShortTasks) > 0 ? 100 : 0,
          },
          {
            category: 'long',
            categoryName: '长篇类',
            total: toNumber(stats.currentMonthApprovedLongTasks),
            approved: toNumber(stats.currentMonthApprovedLongTasks),
            rejected: 0, // 后端未提供此数据
            pending: 0, // 后端未提供此数据
            approvalRate: toNumber(stats.currentMonthApprovedLongTasks) > 0 ? 100 : 0,
          },
          {
            category: 'community',
            categoryName: '社区类',
            total: toNumber(stats.currentMonthApprovedCommunityTasks),
            approved: toNumber(stats.currentMonthApprovedCommunityTasks),
            rejected: 0, // 后端未提供此数据
            pending: 0, // 后端未提供此数据
            approvalRate: toNumber(stats.currentMonthApprovedCommunityTasks) > 0 ? 100 : 0,
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

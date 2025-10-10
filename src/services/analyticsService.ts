/**
 * 数据分析相关API服务
 */
import { request } from '@/utils/request';
import { generateMockAnalyticsData } from './mockAnalyticsData';

// 临时开关：在后端API实现前使用模拟数据
const USE_MOCK_DATA = true;

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
    
    const queryParams = new URLSearchParams();
    
    if (params.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    if (params.endDate) {
      queryParams.append('endDate', params.endDate);
    }
    if (params.preset) {
      queryParams.append('preset', params.preset);
    }
    
    const queryString = queryParams.toString();
    const url = queryString 
      ? `/admin/analytics?${queryString}` 
      : '/admin/analytics';
    
    return request.get<AnalyticsData>(url);
  },
};

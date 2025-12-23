import { request } from '@/utils/request';
import { API_ENDPOINTS } from '@/config/api';
import type { WeeklyTaskOverview, CcPointsOverview, CcPointsVO } from '@/types/api';

/**
 * CC积分服务
 * 用于处理群主激励计划的积分管理
 */
export const ccPointsService = {
  /**
   * 获取用户的CC积分概览
   * @returns 用户的CC积分概览
   */
  getMyCcPointsOverview: (): Promise<CcPointsOverview> => {
    return request.get(API_ENDPOINTS.WEEKLY.CC_POINTS.OVERVIEW);
  },

  /**
   * 获取用户的周次CC积分
   * @param weekCount 周次数
   * @returns 用户的周次CC积分
   */
  getMyCcPointsByWeek: (weekCount: number): Promise<CcPointsVO> => {
    return request.get(`${API_ENDPOINTS.WEEKLY.CC_POINTS.BY_WEEK}?weekCount=${weekCount}`);
  },

  /**
   * 获取用户的CC积分历史记录
   * @returns 用户的CC积分历史记录
   */
  getMyCcPointsHistory: (): Promise<CcPointsVO[]> => {
    return request.get(API_ENDPOINTS.WEEKLY.CC_POINTS.HISTORY);
  },

  /**
   * 获取用户的周任务概览（用于群主激励计划页面）
   * @returns 用户的周任务概览
   */
  getWeeklyTaskOverview: (): Promise<WeeklyTaskOverview> => {
    return request.get(API_ENDPOINTS.WEEKLY.TASK.MY_OVERVIEW);
  },
};

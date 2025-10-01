import { request } from '../utils/request';

export interface MonthlyPointVO {
  id?: number;
  userId: number;
  pointYear: number;
  pointMonth: number;
  point: number;
  promotion?: number;
  shortCount?: number;
  longCount?: number;
  community?: number;
  isExcess?: number;
}

export const monthlyPointService = {
  async getUserMonthlyPoints(userId: number): Promise<MonthlyPointVO> {
    return request.get(`/monthly-point/user/${userId}`);
  },

  async updateUserMonthlyPoints(data: {
    userId: number;
    pointYear: number;
    pointMonth: number;
    pointDelta?: number;
    finalPoint?: number;
  }): Promise<MonthlyPointVO> {
    return request.post('/monthly-point/update', data);
  },

  async adjustCategoryCounts(data: {
    userId: number;
    pointYear: number;
    pointMonth: number;
    promotionDelta?: number;
    shortDelta?: number;
    longDelta?: number;
    communityDelta?: number;
  }): Promise<void> {
    return request.post('/monthly-point/adjust-category-counts', data);
  }
};

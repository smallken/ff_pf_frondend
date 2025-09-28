import { request } from '../utils/request';

export interface MonthlyPointVO {
  id?: number;
  userId: number;
  pointYear: number;
  pointMonth: number;
  point: number;
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
  }
};

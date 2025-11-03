import { request } from '@/utils/request';
import { API_ENDPOINTS } from '@/config/api';
import type {
  WeeklyTaskSubmitRequest,
  OriginalTaskSubmitRequest,
  OriginalTaskUpdateRequest,
  WeeklyTaskSubmitResponse,
  WeeklyTaskOverview,
} from '@/types/api';

export const weeklyChallengeService = {
  submitCommunicationTask: (data: WeeklyTaskSubmitRequest): Promise<WeeklyTaskSubmitResponse> => {
    return request.post(API_ENDPOINTS.WEEKLY.TASK.COMMUNICATION, data);
  },

  submitCommunityTask: (data: WeeklyTaskSubmitRequest): Promise<WeeklyTaskSubmitResponse> => {
    return request.post(API_ENDPOINTS.WEEKLY.TASK.COMMUNITY, data);
  },

  submitOriginalTask: (data: OriginalTaskSubmitRequest): Promise<WeeklyTaskSubmitResponse> => {
    return request.post(API_ENDPOINTS.WEEKLY.TASK.ORIGINAL, data);
  },

  updateOriginalTask: (data: OriginalTaskUpdateRequest): Promise<boolean> => {
    const url = API_ENDPOINTS.WEEKLY.TASK.ORIGINAL_UPDATE(data.id);
    return request.put(url, data);
  },

  getMyTaskOverview: (): Promise<WeeklyTaskOverview> => {
    return request.get(API_ENDPOINTS.WEEKLY.TASK.MY_OVERVIEW);
  },
};

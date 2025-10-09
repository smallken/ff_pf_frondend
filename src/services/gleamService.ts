import request from '@/utils/request';

/**
 * Gleam任务状态
 */
export interface GleamTaskStatus {
  hasCompleted: boolean;
  completedCount: number;
  maxSubmissions: number;
  remainingTimes: number;
  lastCompletionTime: string | null;
  canSubmitMore: boolean;
}

/**
 * Gleam服务
 */
export const gleamService = {
  /**
   * 获取用户Gleam任务状态
   */
  async getGleamStatus(): Promise<GleamTaskStatus> {
    return request.get<GleamTaskStatus>('/gleam/status');
  },

  /**
   * 测试webhook（仅用于开发测试）
   */
  async testWebhook(email: string): Promise<any> {
    return request.post<any>(`/gleam/test-webhook?email=${email}`);
  }
};

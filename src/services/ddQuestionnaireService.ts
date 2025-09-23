import { API_CONFIG, API_ENDPOINTS } from '../config/api';

// DD问答清单数据类型
export interface DDQuestionnaireData {
  registrationId?: number; // 参赛登记ID（可选）
  projectName: string;
  tokenContractAddress: string;
  trackCategory: string;
  otherTrackName?: string;
  keyDataAtDeadline: string;
  trafficContribution: string;
  projectQuality: string;
  narrativeConsensus: string;
  teamEfficiency: string;
  nextSteps: string;
  declarations: string;
}

// API响应类型
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

/**
 * DD问答清单服务
 */
export class DDQuestionnaireService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * 提交DD问答清单
   */
  async submitDDQuestionnaire(data: DDQuestionnaireData): Promise<ApiResponse<number>> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.LAUNCH_CONTEST.DD_QUESTIONNAIRE.ADD}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 包含cookies
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('提交DD问答清单失败:', error);
      throw error;
    }
  }

  /**
   * 更新DD问答清单
   */
  async updateDDQuestionnaire(id: number, data: DDQuestionnaireData): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.LAUNCH_CONTEST.DD_QUESTIONNAIRE.UPDATE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('更新DD问答清单失败:', error);
      throw error;
    }
  }

  /**
   * 获取DD问答清单
   */
  async getDDQuestionnaire(id: number): Promise<ApiResponse<DDQuestionnaireData>> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.LAUNCH_CONTEST.DD_QUESTIONNAIRE.GET}?id=${id}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('获取DD问答清单失败:', error);
      throw error;
    }
  }
}

// 导出单例实例
export const ddQuestionnaireService = new DDQuestionnaireService();

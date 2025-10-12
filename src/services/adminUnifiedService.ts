import { request } from '../utils/request';
import type { 
  UnifiedSubmissionQueryRequest, 
  UnifiedSubmissionVO,
  PageData 
} from '../types/api';

/**
 * 管理员统一查询服务
 */
export const adminUnifiedService = {
  /**
   * 获取统一的提交列表
   * @param params 查询参数
   * @returns 分页数据
   */
  async getUnifiedSubmissions(params: UnifiedSubmissionQueryRequest): Promise<PageData<UnifiedSubmissionVO>> {
    return request.get('/api/admin/unified-submissions', {
      params,
    });
  },
  
  /**
   * 获取表单详情
   * @param type 表单类型
   * @param sourceId 源ID
   * @returns 详情对象
   */
  async getSubmissionDetail(type: string, sourceId: number): Promise<any> {
    console.log('🔍 获取表单详情 - 参数:', { type, sourceId });
    // 直接传递参数对象，而不是嵌套在 params 属性中
    return request.get('/api/admin/submission-detail', {
      type, 
      sourceId 
    });
  }
};

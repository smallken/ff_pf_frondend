import { request } from '../utils/request';

// ==================== 类型定义 ====================

export interface PendingSubmissionPageRequest {
  current: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ReviewedSubmissionPageRequest {
  current: number;
  pageSize: number;
  status?: string;  // '1' | '2' | '' (空=全部)
  type?: string;    // 'application' | 'task' | 'activity' | ''
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PendingSubmissionVO {
  id: number;
  type: 'application' | 'task' | 'activity';
  title: string;
  userName: string;
  userEmail: string;
  status: number;
  createTime: string;
  data: any; // 原始表单数据
}

export interface PageResult<T> {
  records: T[];
  total: number;
  current: number;
  size: number;
  pages: number;
}

// ==================== Service ====================

export const adminService = {
  /**
   * 获取待审核表单（分页）
   * 后端使用UNION ALL联合查询，一次性返回所有类型的表单
   * 
   * TODO: 等待后端API完成后启用
   * API: POST /api/admin/pending-submissions/page
   */
  async getPendingSubmissionsPage(
    params: PendingSubmissionPageRequest
  ): Promise<PageResult<PendingSubmissionVO>> {
    // TODO: 后端API完成后，取消注释下面这行
    // return request.post('/admin/pending-submissions/page', params);
    
    // 临时：返回Mock数据用于测试
    console.warn('⚠️ 使用Mock数据，等待后端API完成');
    await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟
    
    return {
      records: [],
      total: 0,
      current: params.current,
      size: params.pageSize,
      pages: 0
    };
  },

  /**
   * 获取已审核表单（分页）
   * 
   * TODO: 等待后端API完成后启用
   * API: POST /api/admin/reviewed-submissions/page
   */
  async getReviewedSubmissionsPage(
    params: ReviewedSubmissionPageRequest
  ): Promise<PageResult<PendingSubmissionVO>> {
    // TODO: 后端API完成后，取消注释下面这行
    // return request.post('/admin/reviewed-submissions/page', params);
    
    // 临时：返回Mock数据
    console.warn('⚠️ 使用Mock数据，等待后端API完成');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      records: [],
      total: 0,
      current: params.current,
      size: params.pageSize,
      pages: 0
    };
  }
};

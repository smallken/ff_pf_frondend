/**
 * 文件上传相关API服务
 */
import { uploadFile } from '@/utils/request';
import { API_ENDPOINTS } from '@/config/api';
import type { FileUploadResponse } from '@/types/api';

export const fileService = {
  // 上传文件
  uploadFile: (file: File, biz: string): Promise<FileUploadResponse> => {
    return uploadFile(API_ENDPOINTS.FILE.UPLOAD, file, biz);
  },

  // 上传头像
  uploadAvatar: (file: File): Promise<FileUploadResponse> => {
    return uploadFile(API_ENDPOINTS.FILE.UPLOAD, file, 'user_avatar');
  },

  // 上传表单附件
  uploadFormFile: (file: File): Promise<FileUploadResponse> => {
    return uploadFile(API_ENDPOINTS.FILE.UPLOAD, file, 'form_file');
  },

  // 上传任务提交文件
  uploadTaskFile: (file: File): Promise<FileUploadResponse> => {
    return uploadFile(API_ENDPOINTS.FILE.UPLOAD, file, 'task_screenshot');
  },
};

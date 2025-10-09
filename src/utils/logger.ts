/**
 * 日志工具 - 根据环境自动禁用console.log
 * 生产环境下不输出日志，提升性能
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * 开发环境下输出日志，生产环境下不输出
   */
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * 错误日志始终输出（用于调试生产问题）
   */
  error: (...args: any[]) => {
    console.error(...args);
  },

  /**
   * 警告日志始终输出
   */
  warn: (...args: any[]) => {
    console.warn(...args);
  },

  /**
   * 信息日志（仅开发环境）
   */
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * 调试日志（仅开发环境）
   */
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  }
};

'use client';

import MockMonthlyRewardProgress from '../components/MockMonthlyRewardProgress';
import MonthlyRewardHistory from '../components/MonthlyRewardHistory';
import AdminMonthlyReward from '../components/AdminMonthlyReward';

export default function TestMonthlyReward() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            月度奖励功能测试页面
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            用于测试月度奖励相关组件的显示效果
          </p>
        </div>

        <div className="space-y-8">
          {/* 月度奖励进度组件 */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              月度奖励进度组件 (模拟数据)
            </h2>
            <MockMonthlyRewardProgress />
          </div>

          {/* 历史奖励记录组件 */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              历史奖励记录组件
            </h2>
            <MonthlyRewardHistory />
          </div>

          {/* 管理员月度奖励组件 */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              管理员月度奖励组件
            </h2>
            <AdminMonthlyReward />
          </div>
        </div>
      </div>
    </div>
  );
}

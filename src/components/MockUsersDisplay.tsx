import React from 'react';
import { mockMonthlyRewardService } from '../services/mockMonthlyRewardService';
import type { MonthlyRewardVO } from '../types/monthlyReward';

// 示例组件：显示100个模拟用户数据
export default function MockUsersDisplay() {
  const [users, setUsers] = React.useState<MonthlyRewardVO[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const userData = await mockMonthlyRewardService.getAllUsersData();
      setUsers(userData);
    } catch (err: any) {
      setError(err.message || '加载用户数据失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">加载中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  // 统计数据
  const stats = users.reduce((acc, user) => {
    acc.totalUsers++;
    acc.totalRewardAmount += user.rewardAmount;
    acc.levelStats[user.rewardLevel] = (acc.levelStats[user.rewardLevel] || 0) + 1;
    return acc;
  }, {
    totalUsers: 0,
    totalRewardAmount: 0,
    levelStats: {} as Record<string, number>
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">模拟用户数据统计</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
            <div className="text-sm text-gray-600">总用户数</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">${stats.totalRewardAmount}</div>
            <div className="text-sm text-gray-600">总奖励金额</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{Object.keys(stats.levelStats).length}</div>
            <div className="text-sm text-gray-600">等级数量</div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">等级分布</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(stats.levelStats).map(([level, count]) => (
              <div key={level} className="text-center p-2 bg-gray-50 rounded">
                <div className="font-semibold">{level}</div>
                <div className="text-sm text-gray-600">{count} 人</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">用户列表（前20个）</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">用户ID</th>
                  <th className="px-4 py-2 text-left">姓名</th>
                  <th className="px-4 py-2 text-left">等级</th>
                  <th className="px-4 py-2 text-left">奖励金额</th>
                  <th className="px-4 py-2 text-left">传播类</th>
                  <th className="px-4 py-2 text-left">短篇</th>
                  <th className="px-4 py-2 text-left">长篇</th>
                  <th className="px-4 py-2 text-left">社区</th>
                  <th className="px-4 py-2 text-left">状态</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 20).map((user) => (
                  <tr key={user.userId} className="border-t">
                    <td className="px-4 py-2">{user.userId}</td>
                    <td className="px-4 py-2">用户{user.userId}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.rewardLevel === 'basic' ? 'bg-green-100 text-green-800' :
                        user.rewardLevel === 'advanced1' ? 'bg-blue-100 text-blue-800' :
                        user.rewardLevel === 'advanced2' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {user.rewardLevel}
                      </span>
                    </td>
                    <td className="px-4 py-2">${user.rewardAmount}</td>
                    <td className="px-4 py-2">{user.promotionScore}</td>
                    <td className="px-4 py-2">{user.shortScore}</td>
                    <td className="px-4 py-2">{user.longScore}</td>
                    <td className="px-4 py-2">{user.communityScore}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.isPaid ? '已发放' : '待发放'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

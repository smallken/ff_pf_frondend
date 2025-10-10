'use client';

import { useState } from 'react';

interface DebugPanelProps {
  pendingCurrentPage: number;
  pendingPageCount: number;
  pendingTotal: number;
  filters: {
    user: string;
    formType: string;
    dateRange: string;
  };
  onPageChange: (page: number) => void;
  onFilterChange: (filters: any) => void;
  onRefresh: () => void;
}

export default function DebugPanel({
  pendingCurrentPage,
  pendingPageCount,
  pendingTotal,
  filters,
  onPageChange,
  onFilterChange,
  onRefresh
}: DebugPanelProps) {
  const [testUser, setTestUser] = useState('');
  const [testFormType, setTestFormType] = useState('');
  const [testDate, setTestDate] = useState('');

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-4">
      <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-4">
        🐛 调试面板
      </h3>
      
      {/* 分页测试 */}
      <div className="mb-4">
        <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2">分页测试</h4>
        <div className="flex items-center space-x-2 text-sm">
          <span>当前页: {pendingCurrentPage}</span>
          <span>总页数: {pendingPageCount}</span>
          <span>总记录: {pendingTotal}</span>
        </div>
        <div className="flex space-x-2 mt-2">
          <button
            onClick={() => {
              console.log('🐛 测试：点击第一页');
              onPageChange(1);
            }}
            className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
          >
            第一页
          </button>
          <button
            onClick={() => {
              console.log('🐛 测试：点击第二页');
              onPageChange(2);
            }}
            className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
          >
            第二页
          </button>
          <button
            onClick={() => {
              console.log('🐛 测试：点击最后一页');
              onPageChange(pendingPageCount);
            }}
            className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
          >
            最后一页
          </button>
        </div>
      </div>

      {/* 筛选测试 */}
      <div className="mb-4">
        <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2">筛选测试</h4>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <input
            type="text"
            placeholder="测试用户名"
            value={testUser}
            onChange={(e) => setTestUser(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          />
          <select
            value={testFormType}
            onChange={(e) => setTestFormType(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          >
            <option value="">全部类型</option>
            <option value="入职申请">入职申请</option>
            <option value="成果提交">成果提交</option>
            <option value="活动申请">活动申请</option>
          </select>
          <input
            type="date"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              console.log('🐛 测试：应用筛选', { testUser, testFormType, testDate });
              onFilterChange({
                user: testUser,
                formType: testFormType,
                dateRange: testDate
              });
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
          >
            应用筛选
          </button>
          <button
            onClick={() => {
              console.log('🐛 测试：清空筛选');
              setTestUser('');
              setTestFormType('');
              setTestDate('');
              onFilterChange({
                user: '',
                formType: '',
                dateRange: ''
              });
            }}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
          >
            清空筛选
          </button>
        </div>
      </div>

      {/* 当前状态显示 */}
      <div className="mb-4">
        <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2">当前状态</h4>
        <div className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">
          <div>筛选条件: {JSON.stringify(filters)}</div>
          <div>分页状态: 第{pendingCurrentPage}页 / 共{pendingPageCount}页 / 总计{pendingTotal}条</div>
        </div>
      </div>

      {/* 手动刷新 */}
      <button
        onClick={() => {
          console.log('🐛 测试：手动刷新');
          onRefresh();
        }}
        className="w-full px-4 py-2 bg-green-500 text-white rounded"
      >
        手动刷新数据
      </button>
    </div>
  );
}

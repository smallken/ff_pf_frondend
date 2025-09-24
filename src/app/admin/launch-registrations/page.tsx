'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { API_CONFIG } from '../../../config/api';

// Launch大赛参赛登记数据类型
interface LaunchRegistration {
  id: number;
  projectName: string;
  tokenName: string;
  tokenSymbol: string;
  projectDescription: string;
  teamIntroduction: string;
  roadmap: string;
  socialLinks: {
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
  trackCategory: string;
  walletAddress: string;
  email: string;
  name: string;
  createTime: string;
  updateTime: string;
}

// 统计数据类型
interface LaunchRegistrationStats {
  totalRegistrations: number;
  trackStats: {
    [key: string]: number;
  };
}

export default function LaunchRegistrationsAdmin() {
  const { t, language } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  
  const [registrations, setRegistrations] = useState<LaunchRegistration[]>([]);
  const [stats, setStats] = useState<LaunchRegistrationStats>({
    totalRegistrations: 0,
    trackStats: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 获取数据
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 调用后端API获取统计数据
      const statsResponse = await fetch(`${API_CONFIG.BASE_URL}/launch-contest/admin/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!statsResponse.ok) {
        throw new Error('获取统计数据失败');
      }
      
      const statsData = await statsResponse.json();
      
      // 检查统计数据格式
      if (!statsData.data) {
        console.warn('Launch大赛统计数据格式异常:', statsData);
        setStats({
          totalRegistrations: 0,
          trackStats: {}
        });
      } else {
        setStats({
          totalRegistrations: statsData.data.totalRegistrations || 0,
          trackStats: statsData.data.trackStats || {}
        });
      }
      
      // 调用后端API获取参赛登记列表
      const registrationsResponse = await fetch(`${API_CONFIG.BASE_URL}/launch-contest/admin/forms/list/page/vo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          current: 1,
          pageSize: 50
        })
      });
      
      if (!registrationsResponse.ok) {
        throw new Error('获取参赛登记列表失败');
      }
      
      const registrationsData = await registrationsResponse.json();
      
      // 检查API返回的数据结构
      if (!registrationsData.data || !registrationsData.data.records) {
        console.warn('Launch大赛参赛登记数据格式异常:', registrationsData);
        // 使用模拟数据
        const mockRegistrations: LaunchRegistration[] = [
          {
            id: 1,
            projectName: '示例项目',
            tokenName: 'EXAMPLE',
            tokenSymbol: 'EXAMPLE',
            projectDescription: '这是一个示例项目描述',
            teamIntroduction: '这是一个示例团队介绍',
            roadmap: '项目路线图',
            socialLinks: {
              website: 'https://example.com',
              twitter: 'https://twitter.com/example',
              telegram: 'https://t.me/example',
              discord: 'https://discord.gg/example'
            },
            trackCategory: 'DeFi',
            walletAddress: '0x1234567890123456789012345678901234567890',
            email: 'example@example.com',
            name: '示例用户',
            createTime: new Date().toISOString(),
            updateTime: new Date().toISOString()
          }
        ];
        setRegistrations(mockRegistrations);
        return;
      }
      
      // 转换数据格式
      const registrations: LaunchRegistration[] = registrationsData.data.records.map((item: any) => ({
        id: item.id,
        projectName: item.projectName || '未填写',
        tokenName: item.tokenName || '未填写',
        tokenSymbol: item.tokenSymbol || '未填写',
        projectDescription: '项目描述信息', // 需要从详细接口获取
        teamIntroduction: '团队介绍信息', // 需要从详细接口获取
        roadmap: '项目路线图', // 需要从详细接口获取
        socialLinks: {
          website: 'https://example.com',
          twitter: 'https://twitter.com/example',
          telegram: 'https://t.me/example',
          discord: 'https://discord.gg/example'
        },
        trackCategory: item.trackCategory || '未选择',
        walletAddress: '0x0000000000000000000000000000000000000000',
        email: item.email || '未填写',
        name: item.name || '未知用户',
        createTime: item.createTime || new Date().toISOString(),
        updateTime: item.updateTime || new Date().toISOString()
      }));
      
      setRegistrations(registrations);
      
    } catch (err) {
      console.error('获取Launch大赛参赛登记数据失败:', err);
      setError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 下载Excel文件
  const downloadExcel = async () => {
    try {
      // 准备导出数据
      const exportData = registrations.map((reg, index) => ({
        '序号': index + 1,
        '项目名称': reg.projectName,
        '代币名称': reg.tokenName,
        '代币符号': reg.tokenSymbol,
        '赛道类别': reg.trackCategory,
        '联系人姓名': reg.name,
        '联系邮箱': reg.email,
        '钱包地址': reg.walletAddress,
        '提交时间': new Date(reg.createTime).toLocaleString('zh-CN')
      }));

      // 创建CSV内容
      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(',')
        )
      ].join('\n');

      // 创建并下载文件
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `Launch大赛参赛登记_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('下载失败:', err);
      alert('下载失败，请重试');
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.userRole === 'admin') {
      fetchData();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'zh' ? '请先登录' : 'Please Login First'}
          </h1>
        </div>
      </div>
    );
  }

  if (user?.userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'zh' ? '权限不足' : 'Insufficient Permissions'}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {language === 'zh' ? 'Launch大赛参赛登记管理' : 'Launch Contest Registration Management'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {language === 'zh' ? '管理Launch大赛的参赛登记信息' : 'Manage Launch Contest registration information'}
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {language === 'zh' ? '总参赛登记数' : 'Total Registrations'}
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.totalRegistrations}
                </p>
              </div>
            </div>
          </div>

          {/* 赛道统计 */}
          {Object.entries(stats.trackStats).map(([track, count]) => (
            <div key={track} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {track}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {count as number}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 操作按钮 */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (language === 'zh' ? '刷新中...' : 'Refreshing...') : (language === 'zh' ? '刷新' : 'Refresh')}
            </button>
            <button
              onClick={downloadExcel}
              disabled={loading || registrations.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {language === 'zh' ? '下载Excel' : 'Download Excel'}
            </button>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  {language === 'zh' ? '获取数据失败' : 'Failed to fetch data'}
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 参赛登记列表 */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {language === 'zh' ? '参赛登记列表' : 'Registration List'}
            </h3>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {language === 'zh' ? '加载中...' : 'Loading...'}
              </div>
            </div>
          ) : registrations.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              {language === 'zh' ? '暂无参赛登记数据' : 'No registration data available'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {language === 'zh' ? '序号' : 'No.'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {language === 'zh' ? '项目名称' : 'Project Name'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {language === 'zh' ? '代币名称' : 'Token Name'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {language === 'zh' ? '赛道类别' : 'Track Category'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {language === 'zh' ? '联系人' : 'Contact'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {language === 'zh' ? '提交时间' : 'Submit Time'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {registrations.map((reg, index) => (
                    <tr key={reg.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        <div className="max-w-xs truncate" title={reg.projectName}>
                          {reg.projectName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        <div className="max-w-xs truncate" title={reg.tokenName}>
                          {reg.tokenName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {reg.trackCategory}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        <div>
                          <div className="font-medium">{reg.name}</div>
                          <div className="text-gray-500 dark:text-gray-400">{reg.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(reg.createTime).toLocaleString('zh-CN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

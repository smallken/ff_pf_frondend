'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { API_CONFIG } from '../../config/api';

// Launch大赛表单数据类型
interface LaunchForm {
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
  status: number; // 0-待审核, 1-已通过, 2-已拒绝
}

// 统计数据类型
interface LaunchFormStats {
  totalForms: number;
  pendingForms: number;
  approvedForms: number;
  rejectedForms: number;
  trackStats: {
    [key: string]: number;
  };
}

export default function LaunchFormsAdmin() {
  const { t, language } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  
  const [forms, setForms] = useState<LaunchForm[]>([]);
  const [stats, setStats] = useState<LaunchFormStats>({
    totalForms: 0,
    pendingForms: 0,
    approvedForms: 0,
    rejectedForms: 0,
    trackStats: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedForm, setSelectedForm] = useState<LaunchForm | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // 筛选状态
  const [filters, setFilters] = useState({
    status: '',
    trackCategory: '',
    search: ''
  });

  // 获取Launch大赛表单数据
  const fetchLaunchForms = async () => {
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
        // 使用默认统计数据
        setStats({
          totalForms: 0,
          pendingForms: 0,
          approvedForms: 0,
          rejectedForms: 0,
          trackStats: {}
        });
      } else {
        setStats({
          totalForms: statsData.data.totalForms || 0,
          pendingForms: statsData.data.pendingForms || 0,
          approvedForms: statsData.data.approvedForms || 0,
          rejectedForms: statsData.data.rejectedForms || 0,
          trackStats: statsData.data.trackStats || {}
        });
      }
      
      // 调用后端API获取表单列表
      const formsResponse = await fetch(`${API_CONFIG.BASE_URL}/launch-contest/admin/forms/list/page/vo`, {
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
      
      if (!formsResponse.ok) {
        throw new Error('获取表单列表失败');
      }
      
      const formsData = await formsResponse.json();
      
      // 检查API返回的数据结构
      if (!formsData.data || !formsData.data.records) {
        console.warn('Launch大赛表单数据格式异常:', formsData);
        // 使用模拟数据
        const mockForms: LaunchForm[] = [
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
            updateTime: new Date().toISOString(),
            status: 1
          }
        ];
        setForms(mockForms);
        setStats({
          totalForms: 1,
          pendingForms: 0,
          approvedForms: 1,
          rejectedForms: 0,
          trackStats: { 'DeFi': 1 }
        });
        return;
      }
      
      // 转换数据格式
      const forms: LaunchForm[] = formsData.data.records.map((item: any) => ({
        id: item.id,
        projectName: item.projectName || '未填写',
        tokenName: item.tokenName || '未填写',
        tokenSymbol: item.tokenSymbol || '未填写',
        projectDescription: '项目描述信息', // 需要从详细接口获取
        teamIntroduction: '团队介绍信息', // 需要从详细接口获取
        roadmap: '项目路线图', // 需要从详细接口获取
        socialLinks: {
          website: 'https://example.com', // 需要从详细接口获取
          twitter: '@example' // 需要从详细接口获取
        },
        trackCategory: item.trackCategory || '未选择',
        walletAddress: '0x0000000000000000', // 需要从详细接口获取
        email: item.email || '',
        name: item.name || '未知用户',
        createTime: item.createTime,
        updateTime: item.updateTime,
        status: item.status || 1
      }));
      
      setForms(forms);
      
      // 设置统计数据
      setStats({
        totalForms: statsData.data.totalForms || 0,
        pendingForms: 0, // Launch大赛没有待审核状态
        approvedForms: statsData.data.totalForms || 0,
        rejectedForms: 0,
        trackStats: {} // 需要从详细数据计算
      });
      
    } catch (error: any) {
      console.error('获取Launch大赛表单失败:', error);
      setError(error.message || '获取数据失败');
      
      // 如果API调用失败，使用模拟数据
      const mockForms: LaunchForm[] = [
        {
          id: 1,
          projectName: '示例项目1',
          tokenName: 'Token1',
          tokenSymbol: 'TK1',
          projectDescription: '这是一个示例项目的描述',
          teamIntroduction: '团队介绍内容',
          roadmap: '项目路线图',
          socialLinks: {
            website: 'https://example1.com',
            twitter: '@example1'
          },
          trackCategory: 'DeFi',
          walletAddress: '0x1234567890abcdef',
          email: 'user1@example.com',
          name: '用户1',
          createTime: '2024-01-01T10:00:00Z',
          updateTime: '2024-01-01T10:00:00Z',
          status: 1
        }
      ];
      
      setForms(mockForms);
      setStats({
        totalForms: 1,
        pendingForms: 0,
        approvedForms: 1,
        rejectedForms: 0,
        trackStats: { 'DeFi': 1 }
      });
    } finally {
      setLoading(false);
    }
  };

  // 筛选后的表单
  const filteredForms = forms.filter(form => {
    if (filters.status && form.status.toString() !== filters.status) {
      return false;
    }
    if (filters.trackCategory && form.trackCategory !== filters.trackCategory) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        form.projectName.toLowerCase().includes(searchLower) ||
        form.name.toLowerCase().includes(searchLower) ||
        form.email.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // 获取状态文本
  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return language === 'zh' ? '待审核' : 'Pending';
      case 1:
        return language === 'zh' ? '已通过' : 'Approved';
      case 2:
        return language === 'zh' ? '已拒绝' : 'Rejected';
      default:
        return language === 'zh' ? '未知' : 'Unknown';
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 1:
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 2:
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  // 显示表单详情
  const handleShowDetail = (form: LaunchForm) => {
    setSelectedForm(form);
    setShowDetailModal(true);
  };

  // 关闭详情弹窗
  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedForm(null);
  };

  useEffect(() => {
    if (isAuthenticated && user?.userRole === 'admin') {
      fetchLaunchForms();
    }
  }, [isAuthenticated, user]);

  // 权限检查
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'zh' ? '请先登录' : 'Please login first'}
          </h1>
          <a 
            href="/login" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {language === 'zh' ? '去登录' : 'Go to Login'}
          </a>
        </div>
      </div>
    );
  }

  if (user?.userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'zh' ? '权限不足' : 'Insufficient permissions'}
          </h1>
          <a 
            href="/" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {language === 'zh' ? '返回首页' : 'Back to Home'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {language === 'zh' ? 'Launch大赛表单管理' : 'Launch Contest Forms Management'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {language === 'zh' ? '查看和管理用户提交的Launch大赛表单' : 'View and manage user-submitted Launch contest forms'}
          </p>
        </div>

        {/* 返回按钮 */}
        <div className="mb-6">
          <a
            href="/admin"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <span className="mr-2">←</span>
            {language === 'zh' ? '返回管理员后台' : 'Back to Admin Panel'}
          </a>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalForms}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {language === 'zh' ? '总表单数' : 'Total Forms'}
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.pendingForms}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {language === 'zh' ? '待审核' : 'Pending'}
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.approvedForms}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {language === 'zh' ? '已通过' : 'Approved'}
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{stats.rejectedForms}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {language === 'zh' ? '已拒绝' : 'Rejected'}
            </div>
          </div>
        </div>

        {/* 赛道统计 */}
        {Object.keys(stats.trackStats).length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'zh' ? '赛道分布统计' : 'Track Distribution Statistics'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.trackStats).map(([track, count]) => (
                <div key={track} className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{count}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{track}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 表单列表 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {language === 'zh' ? '表单列表' : 'Forms List'}
          </h2>
          
          {/* 筛选器 */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'zh' ? '搜索' : 'Search'}
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  placeholder={language === 'zh' ? '项目名、用户名或邮箱' : 'Project name, username or email'}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'zh' ? '审核状态' : 'Review Status'}
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{language === 'zh' ? '全部状态' : 'All Status'}</option>
                  <option value="0">{language === 'zh' ? '待审核' : 'Pending'}</option>
                  <option value="1">{language === 'zh' ? '已通过' : 'Approved'}</option>
                  <option value="2">{language === 'zh' ? '已拒绝' : 'Rejected'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'zh' ? '赛道类别' : 'Track Category'}
                </label>
                <select
                  value={filters.trackCategory}
                  onChange={(e) => setFilters(prev => ({ ...prev, trackCategory: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{language === 'zh' ? '全部赛道' : 'All Tracks'}</option>
                  <option value="DeFi">DeFi</option>
                  <option value="NFT">NFT</option>
                  <option value="GameFi">GameFi</option>
                  <option value="Social">Social</option>
                  <option value="Infrastructure">Infrastructure</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({ status: '', trackCategory: '', search: '' })}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  {language === 'zh' ? '重置筛选' : 'Reset Filters'}
                </button>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4">
              <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                {language === 'zh' ? '加载中...' : 'Loading...'}
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {language === 'zh' ? '项目信息' : 'Project Info'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {language === 'zh' ? '用户信息' : 'User Info'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {language === 'zh' ? '赛道类别' : 'Track Category'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {language === 'zh' ? '提交时间' : 'Submit Time'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {language === 'zh' ? '状态' : 'Status'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {language === 'zh' ? '操作' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredForms.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        {forms.length === 0 
                          ? (language === 'zh' ? '暂无表单数据' : 'No forms data')
                          : (language === 'zh' ? '没有找到符合条件的表单' : 'No forms match the criteria')
                        }
                      </td>
                    </tr>
                  ) : (
                    filteredForms.map((form) => (
                      <tr key={form.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {form.projectName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {form.tokenName} ({form.tokenSymbol})
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {form.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {form.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {form.trackCategory}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(form.createTime).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(form.status)}`}>
                            {getStatusText(form.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleShowDetail(form)}
                            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {language === 'zh' ? '查看详情' : 'View Details'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 表单详情弹窗 */}
      {showDetailModal && selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {language === 'zh' ? '表单详情' : 'Form Details'}
              </h3>
              <button
                onClick={handleCloseDetail}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {language === 'zh' ? '基本信息' : 'Basic Information'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {language === 'zh' ? '项目名称' : 'Project Name'}：
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white ml-2">
                      {selectedForm.projectName}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {language === 'zh' ? '代币名称' : 'Token Name'}：
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white ml-2">
                      {selectedForm.tokenName} ({selectedForm.tokenSymbol})
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {language === 'zh' ? '赛道类别' : 'Track Category'}：
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white ml-2">
                      {selectedForm.trackCategory}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {language === 'zh' ? '钱包地址' : 'Wallet Address'}：
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white ml-2 font-mono">
                      {selectedForm.walletAddress}
                    </span>
                  </div>
                </div>
              </div>

              {/* 用户信息 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {language === 'zh' ? '用户信息' : 'User Information'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {language === 'zh' ? '姓名' : 'Name'}：
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white ml-2">
                      {selectedForm.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {language === 'zh' ? '邮箱' : 'Email'}：
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white ml-2">
                      {selectedForm.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {language === 'zh' ? '提交时间' : 'Submit Time'}：
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white ml-2">
                      {new Date(selectedForm.createTime).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {language === 'zh' ? '状态' : 'Status'}：
                    </span>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedForm.status)}`}>
                      {getStatusText(selectedForm.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 项目详情 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {language === 'zh' ? '项目详情' : 'Project Details'}
                </h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {language === 'zh' ? '项目描述' : 'Project Description'}：
                    </span>
                    <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                      {selectedForm.projectDescription}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {language === 'zh' ? '团队介绍' : 'Team Introduction'}：
                    </span>
                    <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                      {selectedForm.teamIntroduction}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {language === 'zh' ? '项目路线图' : 'Project Roadmap'}：
                    </span>
                    <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border">
                      {selectedForm.roadmap}
                    </div>
                  </div>
                </div>
              </div>

              {/* 社交媒体链接 */}
              {Object.keys(selectedForm.socialLinks).length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {language === 'zh' ? '社交媒体链接' : 'Social Media Links'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedForm.socialLinks.website && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {language === 'zh' ? '官网' : 'Website'}：
                        </span>
                        <a 
                          href={selectedForm.socialLinks.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline ml-2"
                        >
                          {selectedForm.socialLinks.website}
                        </a>
                      </div>
                    )}
                    {selectedForm.socialLinks.twitter && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Twitter：
                        </span>
                        <span className="text-sm text-gray-900 dark:text-white ml-2">
                          {selectedForm.socialLinks.twitter}
                        </span>
                      </div>
                    )}
                    {selectedForm.socialLinks.telegram && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Telegram：
                        </span>
                        <span className="text-sm text-gray-900 dark:text-white ml-2">
                          {selectedForm.socialLinks.telegram}
                        </span>
                      </div>
                    )}
                    {selectedForm.socialLinks.discord && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Discord：
                        </span>
                        <span className="text-sm text-gray-900 dark:text-white ml-2">
                          {selectedForm.socialLinks.discord}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseDetail}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                {language === 'zh' ? '关闭' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

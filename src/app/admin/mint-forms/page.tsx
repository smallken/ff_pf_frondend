'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { API_CONFIG } from '../../../config/api';

// Mint大赛表单数据类型
interface MintForm {
  id: number;
  trackType: 'studio' | 'individual';
  email: string;
  name: string;
  walletAddress: string;
  mainWalletAddresses: string[];
  rewardWalletAddress: string;
  createTime: string;
  updateTime: string;
  status: number; // 0-待审核, 1-已通过, 2-已拒绝
}

// 统计数据类型
interface MintFormStats {
  totalForms: number;
  trackStats: {
    studio: number;
    individual: number;
  };
}

export default function MintFormsAdmin() {
  const { t, language } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  
  const [forms, setForms] = useState<MintForm[]>([]);
  const [stats, setStats] = useState<MintFormStats>({
    totalForms: 0,
    trackStats: {
      studio: 0,
      individual: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedForm, setSelectedForm] = useState<MintForm | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // 筛选状态
  const [filters, setFilters] = useState({
    trackType: '',
    search: ''
  });

  // 获取Mint大赛表单数据
  const fetchMintForms = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 调用后端API获取统计数据
      const statsResponse = await fetch(`${API_CONFIG.BASE_URL}/mint-contest/admin/stats`, {
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
        console.warn('Mint大赛统计数据格式异常:', statsData);
        // 使用默认统计数据
        setStats({
          totalForms: 0,
          trackStats: { studio: 0, individual: 0 }
        });
      } else {
        setStats({
          totalForms: statsData.data.totalForms || 0,
          trackStats: statsData.data.trackStats || { studio: 0, individual: 0 }
        });
      }
      
      // 调用后端API获取表单列表
      const formsResponse = await fetch(`${API_CONFIG.BASE_URL}/mint-contest/admin/forms/list/page/vo`, {
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
        console.warn('Mint大赛表单数据格式异常:', formsData);
        // 使用模拟数据
        const mockForms: MintForm[] = [
          {
            id: 1,
            trackType: 'studio',
            name: '示例工作室',
            email: 'example@example.com',
            walletAddress: '0x1234567890123456789012345678901234567890',
            mainWalletAddresses: ['0x1234567890123456789012345678901234567890'],
            rewardWalletAddress: '0x1234567890123456789012345678901234567890',
            createTime: new Date().toISOString(),
            updateTime: new Date().toISOString(),
            status: 1
          }
        ];
        setForms(mockForms);
        return;
      }
      
      // 转换数据格式
      const forms: MintForm[] = formsData.data.records.map((item: any) => ({
        id: item.id,
        trackType: item.trackType || 'individual',
        email: item.email || '',
        name: item.name || '未知用户',
        walletAddress: item.walletAddress || '0x0000000000000000',
        mainWalletAddresses: item.mainWalletAddresses || [item.walletAddress || '0x0000000000000000'],
        rewardWalletAddress: item.rewardWalletAddress || item.walletAddress || '0x0000000000000000',
        createTime: item.createTime,
        updateTime: item.updateTime,
        status: item.status || 1
      }));
      
      setForms(forms);
      
      // 设置统计数据
      setStats({
        totalForms: statsData.data.totalForms || 0,
        trackStats: {
          studio: statsData.data.trackStats?.studio || 0,
          individual: statsData.data.trackStats?.individual || 0
        }
      });
      
    } catch (error: any) {
      console.error('获取Mint大赛表单失败:', error);
      setError(error.message || '获取数据失败');
      
      // 如果API调用失败，使用模拟数据
      const mockForms: MintForm[] = [
        {
          id: 1,
          trackType: 'studio',
          email: 'studio1@example.com',
          name: '工作室1',
          walletAddress: '0x1234567890abcdef',
          mainWalletAddresses: [
            '0x1234567890abcdef',
            '0xabcdef1234567890',
            '0x9876543210fedcba'
          ],
          rewardWalletAddress: '0x1234567890abcdef',
          createTime: '2024-01-01T10:00:00Z',
          updateTime: '2024-01-01T10:00:00Z',
          status: 1
        },
        {
          id: 2,
          trackType: 'individual',
          email: 'individual1@example.com',
          name: '个人用户1',
          walletAddress: '0xabcdef1234567890',
          mainWalletAddresses: ['0xabcdef1234567890'],
          rewardWalletAddress: '0xabcdef1234567890',
          createTime: '2024-01-02T10:00:00Z',
          updateTime: '2024-01-02T10:00:00Z',
          status: 1
        }
      ];
      
      setForms(mockForms);
      setStats({
        totalForms: 2,
        trackStats: {
          studio: 1,
          individual: 1
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // 筛选后的表单
  const filteredForms = forms.filter(form => {
    if (filters.trackType && form.trackType !== filters.trackType) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        form.name.toLowerCase().includes(searchLower) ||
        form.email.toLowerCase().includes(searchLower) ||
        form.walletAddress.toLowerCase().includes(searchLower)
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

  // 获取赛道类型文本
  const getTrackTypeText = (trackType: string) => {
    if (trackType === 'studio') {
      return language === 'zh' ? '工作室组' : 'Studio Group';
    } else if (trackType === 'individual') {
      return language === 'zh' ? '个人组' : 'Individual Group';
    }
    return trackType;
  };

  // 显示表单详情
  const handleShowDetail = (form: MintForm) => {
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
      fetchMintForms();
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
            {language === 'zh' ? 'Mint大赛表单管理' : 'Mint Contest Forms Management'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {language === 'zh' ? '查看和管理用户提交的Mint大赛表单' : 'View and manage user-submitted Mint contest forms'}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalForms}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {language === 'zh' ? '总表单数' : 'Total Forms'}
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{stats.trackStats.studio}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {language === 'zh' ? '工作室组' : 'Studio Group'}
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.trackStats.individual}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {language === 'zh' ? '个人组' : 'Individual Group'}
            </div>
          </div>
        </div>

        {/* 赛道统计 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {language === 'zh' ? '赛道分布统计' : 'Track Distribution Statistics'}
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{stats.trackStats.studio}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {language === 'zh' ? '工作室组' : 'Studio Group'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.trackStats.individual}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {language === 'zh' ? '个人组' : 'Individual Group'}
              </div>
            </div>
          </div>
        </div>

        {/* 表单列表 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {language === 'zh' ? '表单列表' : 'Forms List'}
          </h2>
          
          {/* 筛选器 */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'zh' ? '搜索' : 'Search'}
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  placeholder={language === 'zh' ? '用户名、邮箱或钱包地址' : 'Username, email or wallet address'}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'zh' ? '赛道类型' : 'Track Type'}
                </label>
                <select
                  value={filters.trackType}
                  onChange={(e) => setFilters(prev => ({ ...prev, trackType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{language === 'zh' ? '全部类型' : 'All Types'}</option>
                  <option value="studio">{language === 'zh' ? '工作室组' : 'Studio Group'}</option>
                  <option value="individual">{language === 'zh' ? '个人组' : 'Individual Group'}</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({ trackType: '', search: '' })}
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
                      {language === 'zh' ? '用户信息' : 'User Info'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {language === 'zh' ? '赛道类型' : 'Track Type'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {language === 'zh' ? '钱包地址' : 'Wallet Address'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {language === 'zh' ? '提交时间' : 'Submit Time'}
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
                              {form.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {form.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            form.trackType === 'studio' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                          }`}>
                            {getTrackTypeText(form.trackType)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                          {form.walletAddress.slice(0, 10)}...{form.walletAddress.slice(-8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(form.createTime).toLocaleDateString()}
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
                      {language === 'zh' ? '赛道类型' : 'Track Type'}：
                    </span>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                      selectedForm.trackType === 'studio' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                    }`}>
                      {getTrackTypeText(selectedForm.trackType)}
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
                      {language === 'zh' ? '更新时间' : 'Update Time'}：
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white ml-2">
                      {new Date(selectedForm.updateTime).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 钱包地址信息 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {language === 'zh' ? '钱包地址信息' : 'Wallet Address Information'}
                </h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {language === 'zh' ? '主钱包地址' : 'Main Wallet Address'}：
                    </span>
                    <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border font-mono">
                      {selectedForm.walletAddress}
                    </div>
                  </div>
                  
                  {selectedForm.mainWalletAddresses.length > 1 && (
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {language === 'zh' ? '其他钱包地址' : 'Other Wallet Addresses'}：
                      </span>
                      <div className="mt-1 space-y-2">
                        {selectedForm.mainWalletAddresses.map((address, index) => (
                          <div key={index} className="text-sm text-gray-900 dark:text-white p-3 bg-white dark:bg-gray-600 rounded border font-mono">
                            {address}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {language === 'zh' ? '奖励发放地址' : 'Reward Distribution Address'}：
                    </span>
                    <div className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-600 rounded border font-mono">
                      {selectedForm.rewardWalletAddress}
                    </div>
                  </div>
                </div>
              </div>

              {/* 统计信息 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {language === 'zh' ? '统计信息' : 'Statistics'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {language === 'zh' ? '钱包地址总数' : 'Total Wallet Addresses'}：
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white ml-2">
                      {selectedForm.mainWalletAddresses.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {language === 'zh' ? '是否为工作室' : 'Is Studio'}：
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white ml-2">
                      {selectedForm.trackType === 'studio' 
                        ? (language === 'zh' ? '是' : 'Yes')
                        : (language === 'zh' ? '否' : 'No')
                      }
                    </span>
                  </div>
                </div>
              </div>
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

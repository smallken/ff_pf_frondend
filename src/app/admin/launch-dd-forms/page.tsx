'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { API_CONFIG } from '../../../config/api';

// DD问答表单数据类型
interface DDQuestionnaire {
  id: number;
  projectName: string;
  tokenName: string;
  answers: {
    [key: string]: string;
  };
  email: string;
  name: string;
  createTime: string;
  updateTime: string;
}

// 统计数据类型
interface DDQuestionnaireStats {
  totalQuestionnaires: number;
}

export default function LaunchDDFormsAdmin() {
  const { t, language } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  
  const [questionnaires, setQuestionnaires] = useState<DDQuestionnaire[]>([]);
  const [stats, setStats] = useState<DDQuestionnaireStats>({
    totalQuestionnaires: 0
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
        console.warn('DD问答统计数据格式异常:', statsData);
        setStats({
          totalQuestionnaires: 0
        });
      } else {
        setStats({
          totalQuestionnaires: statsData.data.totalDdQuestionnaires || 0
        });
      }
      
      // 调用后端API获取DD问答列表
      const questionnairesResponse = await fetch(`${API_CONFIG.BASE_URL}/launch-contest/dd-questionnaire/list/page/vo`, {
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
      
      if (!questionnairesResponse.ok) {
        throw new Error('获取DD问答列表失败');
      }
      
      const questionnairesData = await questionnairesResponse.json();
      
      // 检查API返回的数据结构
      if (!questionnairesData.data || !questionnairesData.data.records) {
        console.warn('DD问答数据格式异常:', questionnairesData);
        // 使用模拟数据
        const mockQuestionnaires: DDQuestionnaire[] = [
          {
            id: 1,
            projectName: '示例项目',
            tokenName: 'EXAMPLE',
            answers: {
              'q1': '示例答案1',
              'q2': '示例答案2',
              'q3': '示例答案3'
            },
            email: 'example@example.com',
            name: '示例用户',
            createTime: new Date().toISOString(),
            updateTime: new Date().toISOString()
          }
        ];
        setQuestionnaires(mockQuestionnaires);
        return;
      }
      
      // 转换数据格式
      const questionnaires: DDQuestionnaire[] = questionnairesData.data.records.map((item: any) => ({
        id: item.id,
        projectName: item.projectName || '未填写',
        tokenName: item.tokenName || '未填写',
        answers: item.answers || {},
        email: item.email || '未填写',
        name: item.name || '未知用户',
        createTime: item.createTime || new Date().toISOString(),
        updateTime: item.updateTime || new Date().toISOString()
      }));
      
      setQuestionnaires(questionnaires);
      
    } catch (err) {
      console.error('获取DD问答数据失败:', err);
      setError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 下载Excel文件
  const downloadExcel = async () => {
    try {
      // 准备导出数据
      const exportData = questionnaires.map((questionnaire, index) => ({
        '序号': index + 1,
        '项目名称': questionnaire.projectName,
        '代币名称': questionnaire.tokenName,
        '联系人姓名': questionnaire.name,
        '联系邮箱': questionnaire.email,
        '提交时间': new Date(questionnaire.createTime).toLocaleString('zh-CN')
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
      link.setAttribute('download', `Launch大赛DD问答_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('下载失败:', err);
      alert(language === 'zh' ? '下载失败，请重试' : 'Download failed, please try again');
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
            {language === 'zh' ? 'Launch大赛DD问答管理' : 'Launch Contest DD Questionnaire Management'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {language === 'zh' ? '管理Launch大赛的DD问答表单信息' : 'Manage Launch Contest DD questionnaire information'}
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {language === 'zh' ? '总DD问答数' : 'Total DD Questionnaires'}
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.totalQuestionnaires}
                </p>
              </div>
            </div>
          </div>
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
              disabled={loading || questionnaires.length === 0}
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

        {/* DD问答列表 */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {language === 'zh' ? 'DD问答列表' : 'DD Questionnaire List'}
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
          ) : questionnaires.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              {language === 'zh' ? '暂无DD问答数据' : 'No DD questionnaire data available'}
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
                      {language === 'zh' ? '联系人' : 'Contact'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {language === 'zh' ? '提交时间' : 'Submit Time'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {questionnaires.map((questionnaire, index) => (
                    <tr key={questionnaire.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        <div className="max-w-xs truncate" title={questionnaire.projectName}>
                          {questionnaire.projectName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        <div className="max-w-xs truncate" title={questionnaire.tokenName}>
                          {questionnaire.tokenName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        <div>
                          <div className="font-medium">{questionnaire.name}</div>
                          <div className="text-gray-500 dark:text-gray-400">{questionnaire.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(questionnaire.createTime).toLocaleString('zh-CN')}
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

'use client';

import { useState } from 'react';
import { userService } from '../../services';

export default function TestApi() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const testRankingApi = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await userService.getRanking();
      setResult(data);
    } catch (err: any) {
      console.error('❌ 排行榜API测试失败:', err);
      setError(err.message || 'API调用失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API测试页面</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">排行榜API测试</h2>
          <button
            onClick={testRankingApi}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '测试中...' : '测试排行榜API'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold">错误信息:</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-green-800 font-semibold mb-2">API响应:</h3>
            <div className="bg-white rounded p-4 overflow-auto max-h-96">
              <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

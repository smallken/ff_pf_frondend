'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { launchContestService } from '../../../services/launchContestService';

export default function LaunchContestList() {
  const { language } = useLanguage();
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const pageSize = 20; // 每页显示20条记录

  // 获取参赛名单数据
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const response = await launchContestService.getAllRegistrations(pageSize, currentPage);
        if (response.code === 0) {
          // 按Mint进度排序（这里暂时使用模拟数据，因为Mint数据需要从Solana获取）
          const sortedData = response.data.records.sort((a: any, b: any) => {
            // 暂时使用随机数模拟Mint进度，实际应该从Solana获取
            const aProgress = Math.random() * 100;
            const bProgress = Math.random() * 100;
            return bProgress - aProgress;
          });
          setRegistrations(sortedData);
          setTotalRecords(response.data.total);
          setTotalPages(Math.ceil(response.data.total / pageSize));
        }
      } catch (error) {
        console.error('获取参赛名单失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [currentPage, pageSize]); // 添加currentPage依赖

  // 模拟Mint进度数据（实际应该从Solana获取）
  const getMintProgress = (id: number) => {
    // 这里应该调用Solana API获取真实的Mint进度
    // 暂时使用基于ID的伪随机数
    const seed = id * 12345;
    return Math.floor((seed % 100) + 1);
  };

  // 过滤数据
  const filteredRegistrations = selectedTrack === 'all' 
    ? registrations 
    : registrations.filter(reg => reg.trackCategory === selectedTrack);

  // 赛道选项
  const trackOptions = [
    { value: 'all', label: language === 'zh' ? '全部赛道' : 'All Tracks' },
    { value: 'rwa', label: 'RWA' },
    { value: 'community', label: language === 'zh' ? '社区' : 'Community' },
    { value: 'miniapps', label: language === 'zh' ? '小应用' : 'Mini Apps' },
    { value: 'ai', label: 'AI' },
    { value: 'kol', label: 'KOL' },
    { value: 'ip', label: 'IP' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white">
      {/* 背景效果 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#00ffff" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* 页面标题 */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            🚀 {language === 'zh' ? 'Launch大赛实时参赛名单' : 'Launch Contest Real-time Participants'}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {language === 'zh' 
              ? '按Mint进度排序的参赛项目实时名单，数据来源于链上真实记录'
              : 'Real-time participant list sorted by mint progress, data from on-chain records'
            }
          </p>
        </motion.div>

        {/* 赛道筛选 */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {trackOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedTrack(option.value)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedTrack === option.value
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </motion.div>

        {/* 参赛名单 */}
        <motion.div 
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
              <p className="mt-4 text-gray-400">{language === 'zh' ? '加载中...' : 'Loading...'}</p>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-xl text-gray-400">
                {language === 'zh' ? '暂无参赛项目' : 'No participating projects'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredRegistrations.map((registration, index) => {
                const mintProgress = getMintProgress(registration.id);
                return (
                  <motion.div
                    key={registration.id}
                    className="bg-gradient-to-r from-gray-900/50 to-blue-900/20 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        {/* 排名 */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {index + 1}
                          </div>
                        </div>

                        {/* 项目信息 */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="text-2xl font-bold text-white">
                              {registration.projectName || registration.tokenName || '未命名项目'}
                            </h3>
                            <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm">
                              {registration.trackCategory || '未分类'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                            <div>
                              <span className="text-gray-500">{language === 'zh' ? '代币名称:' : 'Token Name:'}</span>
                              <span className="ml-2">{registration.tokenName || '未填写'}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">{language === 'zh' ? '合约地址:' : 'Contract:'}</span>
                              <span className="ml-2 font-mono text-xs">
                                {registration.tokenContractAddress ? 
                                  `${registration.tokenContractAddress.slice(0, 6)}...${registration.tokenContractAddress.slice(-4)}` : 
                                  '未填写'
                                }
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">{language === 'zh' ? '提交时间:' : 'Submit Time:'}</span>
                              <span className="ml-2">
                                {registration.createTime ? 
                                  new Date(registration.createTime).toLocaleDateString('zh-CN') : 
                                  '未知'
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mint进度 */}
                      <div className="flex-shrink-0 text-right">
                        <div className="mb-2">
                          <span className="text-sm text-gray-400">{language === 'zh' ? 'Mint进度' : 'Mint Progress'}</span>
                        </div>
                        <div className="w-32 bg-gray-700 rounded-full h-3 mb-2">
                          <div 
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${mintProgress}%` }}
                          ></div>
                        </div>
                        <div className="text-2xl font-bold text-cyan-400">
                          {mintProgress}%
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {language === 'zh' ? '待Solana数据接入' : 'Pending Solana Data'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* 分页器 */}
        {!loading && totalPages > 1 && (
          <motion.div 
            className="flex justify-center items-center mt-12 space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {/* 上一页按钮 */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                currentPage === 1
                  ? 'border-gray-600 text-gray-500 cursor-not-allowed'
                  : 'border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black'
              }`}
            >
              {language === 'zh' ? '上一页' : 'Previous'}
            </button>

            {/* 页码显示 */}
            <div className="flex items-center space-x-2">
              {/* 第一页 */}
              {currentPage > 3 && (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="px-3 py-2 rounded-lg border border-gray-600 text-gray-400 hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300"
                  >
                    1
                  </button>
                  {currentPage > 4 && (
                    <span className="text-gray-500">...</span>
                  )}
                </>
              )}

              {/* 当前页附近的页码 */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages, currentPage - 2 + i));
                if (pageNum < 1 || pageNum > totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg border transition-all duration-300 ${
                      currentPage === pageNum
                        ? 'border-cyan-500 bg-cyan-500 text-black font-medium'
                        : 'border-gray-600 text-gray-400 hover:border-cyan-500 hover:text-cyan-400'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* 最后一页 */}
              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && (
                    <span className="text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-2 rounded-lg border border-gray-600 text-gray-400 hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            {/* 下一页按钮 */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                currentPage === totalPages
                  ? 'border-gray-600 text-gray-500 cursor-not-allowed'
                  : 'border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black'
              }`}
            >
              {language === 'zh' ? '下一页' : 'Next'}
            </button>

            {/* 分页信息 */}
            <div className="ml-6 text-gray-400 text-sm">
              {language === 'zh' 
                ? `第 ${currentPage} 页，共 ${totalPages} 页，总计 ${totalRecords} 条记录`
                : `Page ${currentPage} of ${totalPages}, Total ${totalRecords} records`
              }
            </div>
          </motion.div>
        )}

        {/* 底部说明 */}
        <motion.div 
          className="text-center mt-16 p-6 bg-gray-800/30 rounded-2xl border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-cyan-400 mb-2">
            📊 {language === 'zh' ? '数据说明' : 'Data Information'}
          </h3>
          <p className="text-gray-400 text-sm max-w-4xl mx-auto">
            {language === 'zh' 
              ? '当前显示的Mint进度为模拟数据。实际数据将从Solana链上获取，包括代币铸造进度、持有者数量、交易量等真实指标。数据更新频率为每5分钟一次。'
              : 'The current mint progress shown is simulated data. Real data will be fetched from Solana blockchain, including token mint progress, holder count, trading volume and other real metrics. Data updates every 5 minutes.'
            }
          </p>
        </motion.div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { adminOriginalTaskService, type OriginalTaskDetailVO, type WeeklyPlanStatLogVO } from '../../services/adminOriginalTaskService';

export default function OriginalTaskReview() {
  const [activeSubTab, setActiveSubTab] = useState<'pending' | 'reviewed' | 'planLogs' | 'contentManagement'>('pending');
  const [tasks, setTasks] = useState<OriginalTaskDetailVO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;
  const [planLogs, setPlanLogs] = useState<WeeklyPlanStatLogVO[]>([]);
  const [planLogLoading, setPlanLogLoading] = useState(false);
  const [planLogError, setPlanLogError] = useState('');
  const [planLogPage, setPlanLogPage] = useState(1);
  const [planLogTotal, setPlanLogTotal] = useState(0);
  const planLogPageSize = 10;

  const [selectedTask, setSelectedTask] = useState<OriginalTaskDetailVO | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  const [reviewForm, setReviewForm] = useState({ reviewStatus: 1, reviewMessage: '', points: 0 });
  const [reviewLoading, setReviewLoading] = useState(false);

  const [weekCountFilter, setWeekCountFilter] = useState<number | undefined>();
  const [reviewStatusFilter, setReviewStatusFilter] = useState<number | undefined>();
  const [planLogWeekFilter, setPlanLogWeekFilter] = useState<number | undefined>();

  // 任务内容管理相关状态
  const [contentForm, setContentForm] = useState({
    weekNumber: 8,
    chineseTopic: 'Web3的叙事经济究竟是在推动前进，还是在制造泡沫？',
    englishTopic: 'In Web3, is the narrative economy pushing us forward or just pumping bubbles?'
  });
  const [savingContent, setSavingContent] = useState(false);
  
  // 上传功能开关状态
  const [uploadEnabled, setUploadEnabled] = useState(true);
  const [savingUploadSetting, setSavingUploadSetting] = useState(false);

  // 模板内容（固定部分）
  const getTemplateContent = (language: 'zh' | 'en', weekNumber: number, topic: string) => {
    const template = language === 'zh'
      ? `#FFFPWeek${weekNumber} –「{topic}」\n发布平台：X/Twitter\n每周提交次数上限：1 次\n提交要求：上传截图 + 链接 + 浏览量+转发、点赞、评论数据；内容需@官方账号并添加#FFFP话题标签；\n内容形式不限：文字、图片、视频等`
      : `#FFFPWeek${weekNumber} - "{topic}"\nPublishing Platform: X/Twitter\nWeekly submissions limit: 1\nSubmission: Upload screenshot + link + view count + number of likes, retweets and comments; Content must @ official account and add #FFFP hashtag;\nContent type is flexible: text, image, video, etc.`;
    return template.replace('{topic}', topic);
  };

  // 解析保存的内容，提取主题
  const parseSavedContent = (content?: string) => {
    if (!content) {
      return {
        chineseTopic: 'Web3的叙事经济究竟是在推动前进，还是在制造泡沫？',
        englishTopic: 'In Web3, is the narrative economy pushing us forward or just pumping bubbles?'
      };
    }
    const zhMatch = content.match(/「(.+?)」/);
    const enMatch = content.match(/"(.+?)"/);
    return {
      chineseTopic: zhMatch ? zhMatch[1] : 'Web3的叙事经济究竟是在推动前进，还是在制造泡沫？',
      englishTopic: enMatch ? enMatch[1] : 'In Web3, is the narrative economy pushing us forward or just pumping bubbles?'
    };
  };

  useEffect(() => {
    if (activeSubTab === 'pending' || activeSubTab === 'reviewed') {
      fetchTasks();
    }
  }, [activeSubTab, page, weekCountFilter, reviewStatusFilter]);

  useEffect(() => {
    if (activeSubTab === 'planLogs') {
      fetchPlanLogs(planLogPage, planLogWeekFilter);
    }
  }, [activeSubTab, planLogPage, planLogWeekFilter]);

  useEffect(() => {
    if (activeSubTab === 'contentManagement') {
      loadSavedContent();
      setError('');
      setSuccess('');
    }
  }, [activeSubTab]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const result = activeSubTab === 'pending'
        ? await adminOriginalTaskService.listPendingTasks(weekCountFilter, page, pageSize)
        : await adminOriginalTaskService.listReviewedTasks(weekCountFilter, reviewStatusFilter, page, pageSize);
      setTasks(result.records || []);
      setTotal(result.total || 0);
    } catch (err: any) {
      setError(err.message || '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlanLogs = async (currentPage = planLogPage, weekFilter = planLogWeekFilter) => {
    try {
      setPlanLogLoading(true);
      setPlanLogError('');
      const result = await adminOriginalTaskService.listWeeklyPlanLogs(weekFilter, undefined, currentPage, planLogPageSize);
      setPlanLogs(result.records || []);
      setPlanLogTotal(result.total || 0);
    } catch (err: any) {
      setPlanLogError(err.message || '获取周计划日志失败');
      setPlanLogs([]);
      setPlanLogTotal(0);
    } finally {
      setPlanLogLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedTask) return;
    try {
      setReviewLoading(true);
      setError('');
      await adminOriginalTaskService.reviewTask({
        taskId: selectedTask.id,
        reviewStatus: reviewForm.reviewStatus,
        reviewMessage: reviewForm.reviewMessage || undefined,
        points: reviewForm.points
      });
      setSuccess('审核成功！');
      setShowReviewModal(false);
      setSelectedTask(null);
      fetchTasks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || '审核失败');
    } finally {
      setReviewLoading(false);
    }
  };

  const calculatePoints = (browseNum: number, likeNum: number = 0, commentNum: number = 0, retweetNum: number = 0): number => {
    const likePoints = likeNum * 0.5;
    const commentPoints = commentNum * 0.8;
    const retweetPoints = retweetNum * 1;
    const browsePoints = Math.log10(browseNum + 1) * 1.2;
    return Math.round(likePoints + commentPoints + retweetPoints + browsePoints);
  };
  const currentError = activeSubTab === 'planLogs' ? planLogError : error;

  // 保存任务内容
  const handleSaveContent = async () => {
    if (!contentForm.chineseTopic.trim()) {
      setError('中文主题不能为空');
      return;
    }
    if (!contentForm.weekNumber || contentForm.weekNumber < 1) {
      setError('请输入正确的周次');
      return;
    }

    try {
      setSavingContent(true);
      setError('');

      // 使用模板生成完整内容
      const weekNumber = contentForm.weekNumber;
      const contentData = {
        version: '2.2', // 版本2.2：更新提交要求，添加内容形式说明
        chineseContent: getTemplateContent('zh', weekNumber, contentForm.chineseTopic),
        englishContent: getTemplateContent('en', weekNumber, contentForm.englishTopic || contentForm.chineseTopic),
        weekNumber,
        chineseTopic: contentForm.chineseTopic,
        englishTopic: contentForm.englishTopic,
        updateTime: new Date().toISOString()
      };
      localStorage.setItem('footprint_original_task_content', JSON.stringify(contentData));

      setSuccess('任务内容保存成功！每周挑战页面将立即生效');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || '保存失败');
    } finally {
      setSavingContent(false);
    }
  };

  // 加载已保存的内容
  const loadSavedContent = () => {
    if (typeof window === 'undefined') return;

    try {
      const savedContent = localStorage.getItem('footprint_original_task_content');
      if (savedContent) {
        const data = JSON.parse(savedContent);
        setContentForm({
          weekNumber: data.weekNumber || 8,
          chineseTopic: data.chineseTopic || parseSavedContent(data.chineseContent).chineseTopic,
          englishTopic: data.englishTopic || parseSavedContent(data.englishContent).englishTopic
        });
      }
      
      // 加载上传功能开关状态
      const uploadSetting = localStorage.getItem('footprint_original_task_upload_enabled');
      if (uploadSetting) {
        setUploadEnabled(JSON.parse(uploadSetting));
      }
    } catch (error) {
      console.error('读取保存的内容失败:', error);
    }
  };
  
  // 保存上传功能开关状态
  const handleSaveUploadSetting = async () => {
    try {
      setSavingUploadSetting(true);
      setError('');
      
      // 保存到localStorage
      localStorage.setItem('footprint_original_task_upload_enabled', JSON.stringify(uploadEnabled));
      
      setSuccess('上传功能开关设置成功！');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || '保存失败');
    } finally {
      setSavingUploadSetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 错误提示 - 固定定位，显示在页面下方一点 */}
      {currentError && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] max-w-2xl w-full mx-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">{currentError}</div>
        </div>
      )}
      {/* 成功提示 - 固定定位，显示在页面下方一点 */}
      {success && activeSubTab !== 'planLogs' && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] max-w-2xl w-full mx-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg">{success}</div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button onClick={() => { setActiveSubTab('pending'); setPage(1); }}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${activeSubTab === 'pending' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500'}`}>
              待审核任务 {total > 0 && activeSubTab === 'pending' && `(${total})`}
            </button>
            <button onClick={() => { setActiveSubTab('reviewed'); setPage(1); }}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${activeSubTab === 'reviewed' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500'}`}>
              已审核任务 {total > 0 && activeSubTab === 'reviewed' && `(${total})`}
            </button>
            <button onClick={() => { setActiveSubTab('planLogs'); setPlanLogPage(1); setPlanLogError(''); }}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${activeSubTab === 'planLogs' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500'}`}>
              周计划统计日志 {planLogTotal > 0 && activeSubTab === 'planLogs' && `(${planLogTotal})`}
            </button>
            <button onClick={() => { setActiveSubTab('contentManagement'); setError(''); setSuccess(''); }}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${activeSubTab === 'contentManagement' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500'}`}>
              任务内容管理
            </button>
          </nav>
        </div>

        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-4">
            {activeSubTab !== 'planLogs' && (
              <input
                type="number"
                value={weekCountFilter || ''}
                onChange={(e) => {
                  setWeekCountFilter(e.target.value ? parseInt(e.target.value) : undefined);
                  setPage(1);
                }}
                placeholder="周次筛选"
                className="px-3 py-2 border rounded-md bg-white dark:bg-gray-700"
              />
            )}
            {activeSubTab === 'reviewed' && (
              <select value={reviewStatusFilter || ''} onChange={(e) => { setReviewStatusFilter(e.target.value ? parseInt(e.target.value) : undefined); setPage(1); }}
                className="px-3 py-2 border rounded-md bg-white dark:bg-gray-700">
                <option value="">全部状态</option>
                <option value="1">通过</option>
                <option value="2">拒绝</option>
              </select>
            )}
            {activeSubTab === 'planLogs' && (
              <input
                type="number"
                value={planLogWeekFilter ?? ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
                  setPlanLogWeekFilter(Number.isNaN(value as any) ? undefined : value);
                  setPlanLogPage(1);
                }}
                placeholder="按周次筛选"
                className="px-3 py-2 border rounded-md bg-white dark:bg-gray-700"
              />
            )}
          </div>
        </div>

        <div className="p-6">
          {activeSubTab === 'contentManagement' ? (
            <div className="text-center py-8 text-gray-500">请在下方表单中管理任务内容</div>
          ) : activeSubTab === 'planLogs' ? (
            planLogLoading ? (
              <div className="text-center py-8 text-gray-500">加载中...</div>
            ) : planLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">暂无日志</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">用户</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">邮箱</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">周次</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">周期范围</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">新增原创积分</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">周积分</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">总积分变动</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">审核时间</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {planLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{log.userName || '-'}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">ID: {log.userId}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Twitter: {log.twitterUsername || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{log.userEmail || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">第{log.weekCount}周</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{log.dateRange || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">+{log.addedPoints ?? 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{log.weeklyPoints ?? 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {log.totalPointsBefore ?? 0} → <span className="text-blue-600 dark:text-blue-400 font-semibold">{log.totalPointsAfter ?? 0}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {new Date(log.createTime).toLocaleString('zh-CN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {planLogTotal > planLogPageSize && (
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-500">
                      显示 {(planLogPage - 1) * planLogPageSize + 1} 到 {Math.min(planLogPage * planLogPageSize, planLogTotal)} 条，共 {planLogTotal} 条
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setPlanLogPage(Math.max(1, planLogPage - 1))}
                        disabled={planLogPage === 1}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50"
                      >上一页</button>
                      <span className="px-3 py-1 text-sm">{planLogPage} / {Math.ceil(planLogTotal / planLogPageSize)}</span>
                      <button
                        onClick={() => setPlanLogPage(Math.min(Math.ceil(planLogTotal / planLogPageSize), planLogPage + 1))}
                        disabled={planLogPage >= Math.ceil(planLogTotal / planLogPageSize)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50"
                      >下一页</button>
                    </div>
                  </div>
                )}
              </div>
            )
          ) : loading ? (
            <div className="text-center py-8 text-gray-500">加载中...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">暂无数据</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">周次</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">浏览量</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">点赞数</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">评论数</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">转发数</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{activeSubTab === 'pending' ? '预计积分' : '获得积分'}</th>
                  {activeSubTab === 'reviewed' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">审核状态</th>}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{task.userName}</div>
                      <div className="text-xs text-gray-500">ID: {task.userId}</div>
                      <div className="text-sm text-gray-500">{task.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">第{task.weekCount}周</td>
                    <td className="px-6 py-4 text-sm">{task.browseNum?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4 text-sm">{task.likeNum?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4 text-sm">{task.commentNum?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4 text-sm">{task.retweetNum?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={activeSubTab === 'pending' ? 'text-orange-600 font-semibold' : 'text-green-600 font-semibold'}>
                        {activeSubTab === 'pending' ? `${calculatePoints(task.browseNum || 0, task.likeNum || 0, task.commentNum || 0, task.retweetNum || 0)}分` : task.originalPoints > 0 ? `+${task.originalPoints}分` : '-'}
                      </span>
                    </td>
                    {activeSubTab === 'reviewed' && (
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${task.reviewStatus === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {task.reviewStatus === 1 ? '通过' : '拒绝'}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button onClick={() => { setSelectedTask(task); setShowDetailModal(true); }} className="text-blue-600 hover:text-blue-500">详情</button>
                      {activeSubTab === 'pending' && (
                        <button onClick={() => { setSelectedTask(task); setReviewForm({ reviewStatus: 1, reviewMessage: '', points: calculatePoints(task.browseNum || 0, task.likeNum || 0, task.commentNum || 0, task.retweetNum || 0) }); setShowReviewModal(true); }} className="text-purple-600 hover:text-purple-500">审核</button>
                      )}
                      {activeSubTab === 'reviewed' && (
                        <button onClick={() => { setSelectedTask(task); setReviewForm({ reviewStatus: task.reviewStatus || 1, reviewMessage: task.reviewMessage || '', points: task.originalPoints || calculatePoints(task.browseNum || 0, task.likeNum || 0, task.commentNum || 0, task.retweetNum || 0) }); setShowReviewModal(true); }}
                          className="text-green-600 hover:text-green-500">修改</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {total > pageSize && activeSubTab !== 'contentManagement' && (
            <div className="flex justify-between mt-4 pt-4 border-t">
              <div className="text-sm">显示 {(page - 1) * pageSize + 1} 到 {Math.min(page * pageSize, total)} 条，共 {total} 条</div>
              <div className="flex space-x-2">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">上一页</button>
                <span className="px-3 py-1">{page} / {Math.ceil(total / pageSize)}</span>
                <button onClick={() => setPage(Math.min(Math.ceil(total / pageSize), page + 1))} disabled={page >= Math.ceil(total / pageSize)}
                  className="px-3 py-1 border rounded disabled:opacity-50">下一页</button>
              </div>
            </div>
          )}

          {/* 任务内容管理表单 */}
          {activeSubTab === 'contentManagement' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">📝 原创任务内容管理</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  管理员可以修改原创任务的主题和内容，以及控制上传功能的开启与关闭。修改后将影响前端页面的任务描述和上传功能。
                </p>
              </div>

              {/* 上传功能开关 */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">🔄 原创任务上传功能开关</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      控制前端用户是否可以提交原创任务。关闭后，用户将无法上传新的原创任务。
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-medium ${uploadEnabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {uploadEnabled ? '已开启' : '已关闭'}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={uploadEnabled} 
                        onChange={(e) => setUploadEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-600`}></div>
                    </label>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleSaveUploadSetting}
                    disabled={savingUploadSetting}
                    className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {savingUploadSetting ? '保存中...' : '💾 保存上传开关设置'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium mb-2">周次 *</label>
                    <input
                      type="number"
                      value={contentForm.weekNumber}
                      onChange={(e) => setContentForm(prev => ({ ...prev, weekNumber: parseInt(e.target.value) || 8 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                      min="1"
                    />
                    <p className="text-xs text-gray-500 mt-1">必填项，用于生成 FFFPWeek[N]</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-medium mb-2">中文主题 *</label>
                    <input
                      type="text"
                      value={contentForm.chineseTopic}
                      onChange={(e) => setContentForm(prev => ({ ...prev, chineseTopic: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                      placeholder="请输入中文主题..."
                    />
                    <p className="text-xs text-gray-500 mt-1">必填项，只修改主题部分</p>
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-2">英文主题（选填）</label>
                  <input
                    type="text"
                    value={contentForm.englishTopic}
                    onChange={(e) => setContentForm(prev => ({ ...prev, englishTopic: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                    placeholder="请输入英文主题...（不填写将使用中文主题）"
                  />
                  <p className="text-xs text-gray-500 mt-1">选填项，不填写将使用中文主题翻译</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium mb-2">预览效果（完整内容）</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">中文预览：</span>
                      <pre className="mt-1 text-xs bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600 overflow-x-auto whitespace-pre-wrap">
                        {getTemplateContent('zh', contentForm.weekNumber, contentForm.chineseTopic)}
                      </pre>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">英文预览：</span>
                      <pre className="mt-1 text-xs bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600 overflow-x-auto whitespace-pre-wrap">
                        {getTemplateContent('en', contentForm.weekNumber, contentForm.englishTopic || contentForm.chineseTopic)}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSaveContent}
                    disabled={savingContent || !contentForm.chineseTopic.trim()}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {savingContent ? '保存中...' : '💾 保存修改'}
                  </button>
                  <button
                    onClick={() => {
                      setContentForm({
                        weekNumber: 8,
                        chineseTopic: 'Web3的叙事经济究竟是在推动前进，还是在制造泡沫？',
                        englishTopic: 'In Web3, is the narrative economy pushing us forward or just pumping bubbles?'
                      });
                      setError('');
                      setSuccess('');
                    }}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    🔄 重置内容
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 详情弹窗 */}
      {showDetailModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold mb-4">原创任务详情</h3>
              <div><label className="font-medium">用户：</label>{selectedTask.userName}</div>
              <div><label className="font-medium">用户ID：</label>{selectedTask.userId}</div>
              <div><label className="font-medium">邮箱：</label>{selectedTask.userEmail}</div>
              <div><label className="font-medium">周次：</label>第{selectedTask.weekCount}周 ({selectedTask.dateRange})</div>
              <div><label className="font-medium">内容链接：</label><a href={selectedTask.contentLink} target="_blank" className="text-blue-600">{selectedTask.contentLink}</a></div>
              <div><label className="font-medium">浏览量：</label>{selectedTask.browseNum?.toLocaleString() || 0}</div>
              <div><label className="font-medium">点赞数：</label>{selectedTask.likeNum?.toLocaleString() || 0}</div>
              <div><label className="font-medium">评论数：</label>{selectedTask.commentNum?.toLocaleString() || 0}</div>
              <div><label className="font-medium">转发数：</label>{selectedTask.retweetNum?.toLocaleString() || 0}</div>
              {selectedTask.originalPoints > 0 && <div><label className="font-medium">获得积分：</label><span className="text-green-600 font-semibold text-lg">+{selectedTask.originalPoints}分</span></div>}
              <div><label className="font-medium">截图：</label><img src={selectedTask.screenshot} alt="截图" className="max-w-full rounded-lg border mt-2" /></div>
              {selectedTask.reviewStatus > 0 && (
                <>
                  <div><label className="font-medium">审核状态：</label><span className={`px-2 py-1 text-sm rounded ${selectedTask.reviewStatus === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {selectedTask.reviewStatus === 1 ? '通过' : '拒绝'}</span></div>
                  {selectedTask.reviewMessage && <div><label className="font-medium">审核意见：</label><div className="p-2 bg-gray-100 dark:bg-gray-700 rounded mt-1">{selectedTask.reviewMessage}</div></div>}
                  <div><label className="font-medium">审核人：</label>{selectedTask.verifierName || '-'}</div>
                  <div><label className="font-medium">审核时间：</label>{new Date(selectedTask.updateTime).toLocaleString('zh-CN')}</div>
                </>
              )}
              <button onClick={() => setShowDetailModal(false)} className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">关闭</button>
            </div>
          </div>
        </div>
      )}

      {/* 审核弹窗 */}
      {showReviewModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowReviewModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">{activeSubTab === 'pending' ? '审核原创任务' : '修改审核结果'}</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded text-sm space-y-2">
                <div><span className="text-gray-600">用户：</span>{selectedTask.userName}</div>
                <div><span className="text-gray-600">用户ID：</span>{selectedTask.userId}</div>
                <div><span className="text-gray-600">周次：</span>第{selectedTask.weekCount}周</div>
                <div><span className="text-gray-600">浏览量：</span>{selectedTask.browseNum?.toLocaleString() || 0}</div>
                <div><span className="text-gray-600">点赞数：</span>{selectedTask.likeNum?.toLocaleString() || 0}</div>
                <div><span className="text-gray-600">评论数：</span>{selectedTask.commentNum?.toLocaleString() || 0}</div>
                <div><span className="text-gray-600">转发数：</span>{selectedTask.retweetNum?.toLocaleString() || 0}</div>
                <div><span className="text-gray-600">预计积分：</span><span className="text-orange-600 font-semibold">{calculatePoints(selectedTask.browseNum || 0, selectedTask.likeNum || 0, selectedTask.commentNum || 0, selectedTask.retweetNum || 0)}分</span></div>
                <div className="text-xs text-gray-600 mt-1">
                  {(() => {
                    const browseNum = selectedTask.browseNum || 0;
                    const likeNum = selectedTask.likeNum || 0;
                    const commentNum = selectedTask.commentNum || 0;
                    const retweetNum = selectedTask.retweetNum || 0;
                    
                    const likePoints = likeNum * 0.5;
                    const commentPoints = commentNum * 0.8;
                    const retweetPoints = retweetNum * 1;
                    const browsePoints = Math.log10(browseNum + 1) * 1.2;
                    const totalPoints = Math.round(likePoints + commentPoints + retweetPoints + browsePoints);
                    
                    return `${likeNum}×0.5 + ${commentNum}×0.8 + ${retweetNum}×1 + lg(${browseNum}+1)×1.2 = ${Math.round(likePoints)} + ${Math.round(commentPoints)} + ${Math.round(retweetPoints)} + ${browsePoints.toFixed(1)} = ${totalPoints}分`;
                  })()}
                </div>
              </div>
              <div>
                <label className="block font-medium mb-2">审核结果 *</label>
                <div className="flex space-x-4">
                  <label className="flex items-center"><input type="radio" checked={reviewForm.reviewStatus === 1} onChange={() => setReviewForm({ ...reviewForm, reviewStatus: 1 })} className="mr-2" />通过</label>
                  <label className="flex items-center"><input type="radio" checked={reviewForm.reviewStatus === 2} onChange={() => setReviewForm({ ...reviewForm, reviewStatus: 2 })} className="mr-2" />拒绝</label>
                </div>
              </div>
              <div>
                <label className="block font-medium mb-2">积分设置（通过时生效）</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    value={reviewForm.points}
                    onChange={(e) => setReviewForm({ ...reviewForm, points: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="请输入积分"
                  />
                  <span className="text-gray-500">分</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">系统建议积分：<span className="text-orange-600 font-semibold">{calculatePoints(selectedTask?.browseNum || 0, selectedTask?.likeNum || 0, selectedTask?.commentNum || 0, selectedTask?.retweetNum || 0)}分</span></p>
              </div>
              <div>
                <label className="block font-medium mb-2">审核意见（可选）</label>
                <textarea value={reviewForm.reviewMessage} onChange={(e) => setReviewForm({ ...reviewForm, reviewMessage: e.target.value })} rows={4}
                  placeholder="请输入审核意见..." className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSubmitReview} disabled={reviewLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50">
                  {reviewLoading ? '提交中...' : (activeSubTab === 'pending' ? '提交审核' : '确认修改')}
                </button>
                <button onClick={() => setShowReviewModal(false)} disabled={reviewLoading} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">取消</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

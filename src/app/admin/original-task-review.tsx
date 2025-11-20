'use client';

import { useState, useEffect } from 'react';
import { adminOriginalTaskService, type OriginalTaskDetailVO, type WeeklyPlanStatLogVO } from '../../services/adminOriginalTaskService';

export default function OriginalTaskReview() {
  const [activeSubTab, setActiveSubTab] = useState<'pending' | 'reviewed' | 'planLogs'>('pending');
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
  
  const [reviewForm, setReviewForm] = useState({ reviewStatus: 1, reviewMessage: '' });
  const [reviewLoading, setReviewLoading] = useState(false);

  const [weekCountFilter, setWeekCountFilter] = useState<number | undefined>();
  const [reviewStatusFilter, setReviewStatusFilter] = useState<number | undefined>();
  const [planLogWeekFilter, setPlanLogWeekFilter] = useState<number | undefined>();

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
        reviewMessage: reviewForm.reviewMessage || undefined
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

  const calculatePoints = (browseNum: number): number => Math.round(5 * (1 + browseNum / 2000));
  const currentError = activeSubTab === 'planLogs' ? planLogError : error;

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
          {activeSubTab === 'planLogs' ? (
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
                    <td className="px-6 py-4 text-sm">
                      <span className={activeSubTab === 'pending' ? 'text-orange-600 font-semibold' : 'text-green-600 font-semibold'}>
                        {activeSubTab === 'pending' ? `${calculatePoints(task.browseNum || 0)}分` : task.originalPoints > 0 ? `+${task.originalPoints}分` : '-'}
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
                        <button onClick={() => { setSelectedTask(task); setReviewForm({ reviewStatus: 1, reviewMessage: '' }); setShowReviewModal(true); }}
                          className="text-purple-600 hover:text-purple-500">审核</button>
                      )}
                      {activeSubTab === 'reviewed' && (
                        <button onClick={() => { setSelectedTask(task); setReviewForm({ reviewStatus: task.reviewStatus || 1, reviewMessage: task.reviewMessage || '' }); setShowReviewModal(true); }}
                          className="text-green-600 hover:text-green-500">修改</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {total > pageSize && (
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
                <div><span className="text-gray-600">预计积分：</span><span className="text-orange-600 font-semibold">{calculatePoints(selectedTask.browseNum || 0)}分</span></div>
              </div>
              <div>
                <label className="block font-medium mb-2">审核结果 *</label>
                <div className="flex space-x-4">
                  <label className="flex items-center"><input type="radio" checked={reviewForm.reviewStatus === 1} onChange={() => setReviewForm({ ...reviewForm, reviewStatus: 1 })} className="mr-2" />通过</label>
                  <label className="flex items-center"><input type="radio" checked={reviewForm.reviewStatus === 2} onChange={() => setReviewForm({ ...reviewForm, reviewStatus: 2 })} className="mr-2" />拒绝</label>
                </div>
              </div>
              <div>
                <label className="block font-medium mb-2">审核意见（可选）</label>
                <textarea value={reviewForm.reviewMessage} onChange={(e) => setReviewForm({ ...reviewForm, reviewMessage: e.target.value })} rows={4}
                  placeholder="请输入审核意见..." className="w-full px-3 py-2 border rounded-md" />
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

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Button } from '../../components/reactbits/ButtonSimple';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/reactbits/Card';
import { formService, userService } from '@/services';
import { ccIncentiveService, CC_TASK_TYPES, type CcTaskOverviewVO } from '@/services/ccIncentiveService';
import { adminOriginalTaskService, type OriginalTaskConfigVO } from '@/services/adminOriginalTaskService';
import type { OriginalTaskVO, RankingUserVO, CcPointsVO } from '@/types/api';

export default function GroupLeaderIncentive() {
  // 所有Hook调用必须在组件顶部，在任何条件返回语句之前
  const { language, t } = useLanguage();
  const router = useRouter();
  
  // 状态管理Hooks
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [activeTask, setActiveTask] = useState<'groupSize' | 'communityActivity' | 'longTermConstruction' | null>(null);
  const [activeSubTask, setActiveSubTask] = useState<'groupInternal' | 'externalGroup' | null>(null);
  const [activeCommunityTaskType, setActiveCommunityTaskType] = useState<'groupActivity' | 'externalActivity' | null>(null);
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [taskError, setTaskError] = useState('');
  const [taskSuccess, setTaskSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'submitting' | 'success'>('idle');
  const [taskForm, setTaskForm] = useState<{ 
    contentLink: string; 
    screenshots: { thisWeek?: File | null; lastWeek?: File | null };
    multipleScreenshots: File[];  // 群内/外部群任务支持多个截图
  }>({
    contentLink: '',
    screenshots: {},
    multipleScreenshots: [],
  });
  const [taskOverview, setTaskOverview] = useState<CcTaskOverviewVO | null>(null);
  const [overviewLoading, setOverviewLoading] = useState<boolean>(false);
  const [overviewError, setOverviewError] = useState<string>('');
  const [isSunday, setIsSunday] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // ccPoints积分系统
  const [ccPoints, setCcPoints] = useState<any[]>([]);
  const [ccPointsLoading, setCcPointsLoading] = useState<boolean>(false);
  const [ccPointsError, setCcPointsError] = useState<string>('');
  
  // 区域检测：只有中国区域可以访问
  const [isChinaRegion, setIsChinaRegion] = useState<boolean | null>(null); // 默认为null，需要获取用户资料后判断
  const [userLoading, setUserLoading] = useState<boolean>(true);
  
  // 周期倒计时：周一 00:00 → 周日 00:00；周日显示距离下周一（基于UTC+8时区）
  useEffect(() => {
    const getTargetDate = (nowUTC8: Date) => {
      const day = nowUTC8.getDay(); // 0 = Sunday, 1 = Monday ...
      const startOfToday = new Date(nowUTC8);
      startOfToday.setHours(0, 0, 0, 0);

      const target = new Date(startOfToday);
      if (day === 0) {
        // Sunday: countdown to next Monday 00:00
        target.setDate(target.getDate() + 1);
      } else {
        const daysUntilSunday = 7 - day;
        target.setDate(target.getDate() + daysUntilSunday);
      }
      return target;
    };

    const updateCountdown = () => {
      // 获取当前时间并转换为UTC+8时区
      const now = new Date();
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000; // 转为UTC时间戳
      const utc8Time = utcTime + 8 * 3600000; // UTC+8时间戳
      const nowUTC8 = new Date(utc8Time); // UTC+8时间对象

      const target = getTargetDate(nowUTC8);
      let diff = target.getTime() - nowUTC8.getTime();
      setIsSunday(nowUTC8.getDay() === 0);

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, []);
  
  // 获取用户资料，检查用户地区是否为中国
  useEffect(() => {
    const checkUserRegion = async () => {
      try {
        const userInfo = await userService.getLoginUser();
        // 检查用户资料中的地区是否为中国
        const isChina = userInfo?.country === 'China' || userInfo?.country === '中国';
        setIsChinaRegion(isChina);
      } catch (error) {
        console.error('获取用户资料失败:', error);
        setIsChinaRegion(true); // 获取失败时默认为中国地区，允许访问
      } finally {
        setUserLoading(false);
      }
    };
    
    checkUserRegion();
  }, []);
  
  // 任务概览获取Hook
  const fetchTaskOverview = useCallback(async () => {
    try {
      setOverviewLoading(true);
      setOverviewError('');
      const data = await ccIncentiveService.getMyTaskOverview();
      setTaskOverview(data);
    } catch (error: any) {
      console.error('获取任务总览失败:', error);
      setOverviewError(error.message || (language === 'zh' ? '获取任务数据失败' : 'Failed to load task data.'));
    } finally {
      setOverviewLoading(false);
    }
  }, [language]);

  // 获取用户ccPoints积分
  const fetchCcPoints = useCallback(async () => {
    try {
      setCcPointsLoading(true);
      setCcPointsError('');
      // 调用ccIncentiveService获取任务概览，包含ccPoints数据
      const data = await ccIncentiveService.getMyTaskOverview();
      
      // 使用后端返回的周次和日期范围
      const ccPointsData = [
        {
          weekCount: data.currentWeek || 1,
          points: data.weeklyPoints || 0,
          status: isSunday ? 'completed' : 'in_progress',
          dateRange: data.dateRange || ''
        }
      ];
      
      setCcPoints(ccPointsData);
    } catch (error: any) {
      console.error('获取ccPoints失败:', error);
      setCcPointsError(error.message || (language === 'zh' ? '获取ccPoints失败' : 'Failed to load ccPoints.'));
      // 如果API调用失败，使用模拟数据作为备用
      const mockCcPoints = [
        { weekCount: 1, points: 150, status: 'completed', dateRange: '2024-01-01 to 2024-01-07' },
        { weekCount: 2, points: 200, status: 'completed', dateRange: '2024-01-08 to 2024-01-14' },
        { weekCount: 3, points: 180, status: 'completed', dateRange: '2024-01-15 to 2024-01-21' },
        { weekCount: 4, points: 220, status: 'in_progress', dateRange: '2024-01-22 to 2024-01-28' },
      ];
      setCcPoints(mockCcPoints);
    } finally {
      setCcPointsLoading(false);
    }
  }, [language, isSunday]);

  // 初始化数据加载
  useEffect(() => {
    // 直接获取任务概览，不再依赖申请表状态
    fetchTaskOverview();
    // 获取ccPoints
    fetchCcPoints();
  }, [fetchTaskOverview, fetchCcPoints]);

  // 打开任务模态框
  const openTaskModal = useCallback((task: 'groupSize' | 'communityActivity' | 'longTermConstruction') => {
    setActiveTask(task);
    
    // 如果是社区活跃任务，先显示任务类型选择
    if (task === 'communityActivity') {
      setActiveCommunityTaskType(null);
    } else {
      setActiveCommunityTaskType(null);
    }
    
    setShowTaskModal(true);
    setTaskForm({ contentLink: '', screenshots: {}, multipleScreenshots: [] });
    setTaskError('');
    setTaskSuccess('');
    setUploadProgress('idle');
  }, []);

  // 关闭任务模态框
  const closeTaskModal = useCallback(() => {
    setShowTaskModal(false);
    setActiveTask(null);
    setActiveCommunityTaskType(null);
    setTaskSubmitting(false);
    setTaskError('');
    setTaskSuccess('');
    setUploadProgress('idle');
    setTaskForm({ contentLink: '', screenshots: {}, multipleScreenshots: [] });
  }, []);

  // 任务表单处理
  const handleTaskFormChange = useCallback((field: 'contentLink', value: string) => {
    setTaskForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleTaskScreenshotChange = useCallback((type: 'thisWeek' | 'lastWeek', file: File | null) => {
    setTaskForm(prev => ({
      ...prev,
      screenshots: {
        ...prev.screenshots,
        [type]: file
      }
    }));
  }, []);

  // 多截图上传处理（群内/外部群任务）
  const handleMultipleScreenshotAdd = useCallback((files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setTaskForm(prev => ({
      ...prev,
      multipleScreenshots: [...prev.multipleScreenshots, ...newFiles]
    }));
  }, []);

  const handleMultipleScreenshotRemove = useCallback((index: number) => {
    setTaskForm(prev => ({
      ...prev,
      multipleScreenshots: prev.multipleScreenshots.filter((_, i) => i !== index)
    }));
  }, []);

  // 截图上传函数
  const uploadTaskScreenshot = useCallback(async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('biz', 'task_screenshot');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      let result: any = null;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('❌ 上传响应解析失败:', parseError);
      }

      if (!response.ok) {
        const message =
          (result && (result.error || result.message)) ||
          (language === 'zh' ? '上传失败，请稍后重试。' : 'Upload failed, please try again later.');
        throw new Error(message);
      }

      const url: string | undefined =
        result?.url ||
        result?.data?.url ||
        (typeof result?.data === 'string' ? result.data : undefined);

      if (!url) {
        throw new Error(language === 'zh' ? '上传成功但未获取到文件地址。' : 'Upload succeeded but no file URL returned.');
      }

      return url;
    } catch (error: any) {
      console.error('❌ 截图上传失败:', error);
      const baseMessage = error?.message || (language === 'zh' ? '上传失败，请稍后重试。' : 'Upload failed, please try again later.');
      throw new Error(language === 'zh' ? `截图上传失败：${baseMessage}` : `Screenshot upload failed: ${baseMessage}`);
    }
  }, []);

  // 任务提交函数
  const handleTaskSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;

    // 验证社区活跃任务类型
    if (activeTask === 'communityActivity' && !activeCommunityTaskType) {
      setTaskError(language === 'zh' ? '请选择具体的社区活跃任务类型' : 'Please select a specific community activity task type.');
      return;
    }

    setTaskError('');
    setTaskSuccess('');

    // 验证截图
    let hasValidScreenshots = false;
    let screenshotsToUpload: File[] = [];

    if (activeTask === 'groupSize') {
      // 群规模&拉新：需要上传两个截图
      if (!taskForm.screenshots.thisWeek || !taskForm.screenshots.lastWeek) {
        setTaskError(language === 'zh' ? '请上传本周和上周的QQ群成员数量截图' : 'Please upload both this week and last week\'s QQ group member count screenshots.');
        return;
      }
      hasValidScreenshots = true;
      screenshotsToUpload = [taskForm.screenshots.thisWeek, taskForm.screenshots.lastWeek] as File[];
    } else if (activeTask === 'communityActivity') {
      // 群内/外部群任务：支持多个截图
      if (taskForm.multipleScreenshots.length === 0) {
        setTaskError(language === 'zh' ? '请上传至少一张截图证明' : 'Please upload at least one screenshot proof.');
        return;
      }
      hasValidScreenshots = true;
      screenshotsToUpload = taskForm.multipleScreenshots;
    } else if (activeTask === 'longTermConstruction') {
      // 长期建设任务：需要群链接
      if (!taskForm.contentLink.trim()) {
        setTaskError(language === 'zh' ? '请填写群链接' : 'Please enter the group link.');
        return;
      }
      if (!taskForm.screenshots.thisWeek) {
        setTaskError(language === 'zh' ? '请上传截图证明' : 'Please upload a screenshot proof.');
        return;
      }
      hasValidScreenshots = true;
      screenshotsToUpload = [taskForm.screenshots.thisWeek] as File[];
    } else {
      // 其他任务：保持原有逻辑
      if (!taskForm.screenshots.thisWeek) {
        setTaskError(language === 'zh' ? '请上传截图证明' : 'Please upload a screenshot proof.');
        return;
      }
      hasValidScreenshots = true;
      screenshotsToUpload = [taskForm.screenshots.thisWeek] as File[];
    }

    if (!hasValidScreenshots) return;

    setTaskSubmitting(true);
    setUploadProgress('uploading');

    try {
      // 第一步：上传截图
      const screenshotUrls = await Promise.all(screenshotsToUpload.map(file => uploadTaskScreenshot(file)));

      // 第二步：提交数据到后端
      setUploadProgress('submitting');
      
      // 根据不同任务类型调用不同的API
      if (activeTask === 'groupSize') {
        // 群规模&拉新
        await ccIncentiveService.submitTask({
          taskType: CC_TASK_TYPES.GROUP_SIZE,
          contentLink: taskForm.contentLink.trim() || undefined,
          screenshotUrl: screenshotUrls.join(','),
        });
      } else if (activeTask === 'communityActivity') {
        // 社区活跃任务：根据activeCommunityTaskType选择任务类型
        const taskType = activeCommunityTaskType === 'groupActivity' 
          ? CC_TASK_TYPES.QQ_GROUP 
          : CC_TASK_TYPES.OUT_GROUP;
        await ccIncentiveService.submitTask({
          taskType: taskType,
          contentLink: taskForm.contentLink.trim() || undefined,
          screenshotUrl: screenshotUrls.join(','),
        });
      } else if (activeTask === 'longTermConstruction') {
        // 长期建设任务
        await ccIncentiveService.submitTask({
          taskType: CC_TASK_TYPES.ORIGINAL,
          contentLink: taskForm.contentLink.trim(),
          screenshotUrl: screenshotUrls.join(','),
        });
      }

      // 第三步：提交成功
      setUploadProgress('success');
      setTaskSuccess(language === 'zh' ? '任务提交成功，我们将尽快审核！' : 'Task submitted. We will review shortly.');
      await fetchTaskOverview();
      
      setTimeout(() => {
        closeTaskModal();
      }, 2000);
    } catch (error) {
      console.error('提交任务失败:', error);
      setUploadProgress('idle');
      let message = language === 'zh'
        ? '提交失败，请稍后重试。' 
        : 'Submission failed, please try again later.';
      if (error instanceof Error) {
        if (error.message.trim()) {
          message = error.message;
        }
      }
      setTaskError(message);
    } finally {
      setTaskSubmitting(false);
    }
  }, [activeTask, activeCommunityTaskType, taskForm, language, uploadTaskScreenshot, fetchTaskOverview, closeTaskModal]);

  // 任务状态 - 使用新的 CcTaskOverviewVO 字段
  const groupSizeSubmitted = taskOverview?.groupSizeSubmitted ?? 0;
  const groupSizeLimit = 1;
  const longTermConstructionSubmitted = taskOverview?.originalSubmitted ?? 0;
  const longTermConstructionLimit = 1;
  const weeklyPoints = taskOverview?.weeklyPoints ?? 0;
  
  // 社区活跃任务：使用已提交数量字段
  const groupInternalSubmitted = taskOverview?.qqGroupSubmitted ?? 0; // 群内任务已提交次数
  const externalGroupSubmitted = taskOverview?.outGroupSubmitted ?? 0; // 外群任务已提交次数
  const groupInternalLimit = 3; // 群内活动至少3次
  const externalGroupLimit = 1; // 外部群至少1次
  // 社区活跃任务达标条件：群内≥3次 且 外部群≥1次
  const communityActivityCompleted = groupInternalSubmitted >= groupInternalLimit && externalGroupSubmitted >= externalGroupLimit;
  
  // 周日（isSunday为true）时本周挑战已结束，禁止提交任务
  // 不限制提交次数，仅周日禁止提交
  const canSubmitGroupSize = !isSunday;
  const canSubmitCommunityActivity = !isSunday;
  // 长期建设任务只能提交一次
  const canSubmitLongTermConstruction = !isSunday && longTermConstructionSubmitted < longTermConstructionLimit;

  const { weeklyTaskCards, oneTimeTaskCards } = useMemo(() => {
    // 每周任务
    const weeklyTasks = [
      {
        id: 'groupSize',
        title: language === 'zh' ? '群规模&拉新' : 'Group Size & Growth',
        description: language === 'zh' 
          ? '用于确认群主身份，并统计本周拉新与群规模增长情况。' 
          : 'Used to confirm group leader identity and track this week\'s new members and group size growth.',
        requirement: language === 'zh'
          ? '<strong>需要上传截图</strong>\n  • 本周QQ群成员数量截图\n  • 上周QQ群成员数量截图'
          : '<strong>Screenshots required:</strong>\n  • Screenshot of this week\'s QQ group member count\n  • Screenshot of last week\'s QQ group member count',
        buttonText: language === 'zh' ? '上传并提交' : 'Upload & Submit',
        color: 'from-blue-500 to-cyan-500',
        onClick: () => openTaskModal('groupSize'),
        disabled: !canSubmitGroupSize
      },
      {
        id: 'communityActivity',
        title: language === 'zh' ? '社区活跃任务' : 'Community Activity Task',
        description: language === 'zh'
          ? '评估群内是否保持活跃讨论，并持续传播 FlipFlop 官方内容。' 
          : 'Evaluate whether the group maintains active discussions and continues to spread FlipFlop official content.',
        requirement: language === 'zh'
          ? '<strong>需要上传截图</strong>\n  1. 群内活跃截图（截图2–5 张，≥3 次 / 周，以下内容皆可）\n      • 官方 QQ 群资讯转发\n      • 区块链相关知识分享\n      • FF 平台讨论内容\n      • 正向观点 / 活跃讨论\n  2. 外部群传播截图（≥1次 / 周）\n      • 在其他 QQ 群或 Telegram 群分享 FF 内容'
          : '<strong>Screenshots required:</strong>\n  1. Group activity screenshots (2–5, ≥3 times / week)\n      • Official QQ group information forwarding\n      • Blockchain-related knowledge sharing\n      • FF platform discussion content\n      • Positive opinions / active discussions\n  2. External group sharing screenshots (≥1 time / week)\n      • Share FF content in other QQ groups or Telegram groups',
        buttonText: language === 'zh' ? '上传并提交' : 'Upload & Submit',
        color: 'from-purple-500 to-pink-500',
        onClick: () => openTaskModal('communityActivity'),
        disabled: !canSubmitCommunityActivity
      }
    ];

    // 单次任务
    const oneTimeTasks = [
      {
        id: 'longTermConstruction',
        title: language === 'zh' ? '长期建设任务' : 'Long-term Construction Task',
        description: language === 'zh'
          ? '鼓励群主进行长期社区建设，建立Debox群以保护私域流量。' 
          : 'Encourage group leaders to conduct long-term community building and establish Debox groups to protect private domain traffic.',
        requirement: language === 'zh'
          ? '• 需填写 Debox 群链接或群 ID\n  • 上传Debox 群截图'
          : '• Fill in Debox group link or group ID\n  • Upload Debox group screenshot',
        buttonText: language === 'zh' ? '上传并提交' : 'Upload & Submit',
        color: 'from-amber-500 to-orange-500',
        onClick: () => openTaskModal('longTermConstruction'),
        disabled: !canSubmitLongTermConstruction
      }
    ];

    return { weeklyTaskCards: weeklyTasks, oneTimeTaskCards: oneTimeTasks };
  }, [language, canSubmitGroupSize, canSubmitCommunityActivity, canSubmitLongTermConstruction, openTaskModal]);

  const taskModalCopy = useMemo(() => ({
    groupSize: {
      title: language === 'zh' ? '提交群规模&拉新任务' : 'Submit Group Size & Growth Task',
      description: language === 'zh'
        ? '请上传本周和上周的QQ群成员数量截图，并填写相应数据。' 
        : 'Please upload screenshots of this week\'s and last week\'s QQ group member counts, and fill in the corresponding data.',
      screenshotLabel: language === 'zh' ? '截图证明（必填）' : 'Screenshot Proof (required)',
      screenshotHint: language === 'zh'
        ? '支持 PNG、JPG、JPEG 格式，大小不超过 5MB。' 
        : 'Supports PNG, JPG, JPEG up to 5MB.',
      success: language === 'zh' ? '任务提交成功，我们将尽快审核！' : 'Task submitted. We will review shortly.',
    },
    communityActivity: {
      title: language === 'zh' ? '选择社区活跃任务类型' : 'Select Community Activity Task Type',
      description: language === 'zh'
        ? '请选择要提交的社区活跃任务类型。' 
        : 'Please select the community activity task type to submit.',
      subTasks: {
        groupTask: {
          title: language === 'zh' ? '群内任务' : 'Group Task',
          description: language === 'zh'
            ? '请上传群内活跃截图（2–5 张，≥3 次 / 周）。' 
            : 'Please upload group activity screenshots (2–5, ≥3 times / week).',
          screenshotLabel: language === 'zh' ? '群内活跃截图（必填）' : 'Group Activity Screenshots (required)',
          screenshotHint: language === 'zh'
            ? '支持 PNG、JPG、JPEG 格式，大小不超过 5MB。' 
            : 'Supports PNG, JPG, JPEG up to 5MB.',
          success: language === 'zh' ? '任务提交成功，我们将尽快审核！' : 'Task submitted. We will review shortly.',
        },
        externalTask: {
          title: language === 'zh' ? '外部群任务' : 'External Group Task',
          description: language === 'zh'
            ? '请上传外部群传播截图（≥1次 / 周）。' 
            : 'Please upload external group sharing screenshots (≥1 time / week).',
          screenshotLabel: language === 'zh' ? '外部群传播截图（必填）' : 'External Group Sharing Screenshots (required)',
          screenshotHint: language === 'zh'
            ? '支持 PNG、JPG、JPEG 格式，大小不超过 5MB。' 
            : 'Supports PNG, JPG, JPEG up to 5MB.',
          success: language === 'zh' ? '任务提交成功，我们将尽快审核！' : 'Task submitted. We will review shortly.',
        }
      }
    },
    longTermConstruction: {
      title: language === 'zh' ? '提交长期建设任务' : 'Submit Long-term Construction Task',
      description: language === 'zh'
        ? '请提交Debox群建设相关信息和官方活动参与情况。' 
        : 'Please submit Debox group construction information and official event participation status.',
      screenshotLabel: language === 'zh' ? '截图证明（必填）' : 'Screenshot Proof (required)',
      screenshotHint: language === 'zh'
        ? '支持 PNG、JPG、JPEG 格式，大小不超过 5MB。' 
        : 'Supports PNG, JPG, JPEG up to 5MB.',
      success: language === 'zh' ? '任务提交成功，我们将尽快审核！' : 'Task submitted. We will review shortly.',
    },
  }), [language]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 页面标题和副标题 */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            {language === 'zh' ? 'FlipFlop 华语社区「脚印奖励计划」' : 'FlipFlop Chinese Community "Footprint Reward Program"'}
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
            🔥 {language === 'zh' ? '完成任务，领取积分，赢取奖励——首周总奖励达10000RMB' : 'Complete tasks, claim points, win rewards - first week total reward reaches 10000RMB'}
          </p>
          
          {/* 倒计时 */}
          <div className="flex justify-center items-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg">
              <p className="text-lg font-medium">
                {isSunday
                  ? (language === 'zh' ? '距下周挑战开始还有：' : 'Time until next week\'s challenge starts:')
                  : (language === 'zh' ? '距本周挑战结束还有：' : 'Time until this week\'s challenge ends:')}
              </p>
              <div className="flex justify-center mt-2 space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{timeLeft.days}</div>
                  <div className="text-xs">{language === 'zh' ? '天' : 'Days'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{timeLeft.hours}</div>
                  <div className="text-xs">{language === 'zh' ? '时' : 'Hours'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                  <div className="text-xs">{language === 'zh' ? '分' : 'Mins'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                  <div className="text-xs">{language === 'zh' ? '秒' : 'Secs'}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 1: 任务概览（每周更新） */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
            {language === 'zh' ? '任务概览（每周更新）' : 'Task Overview (Weekly Update)'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weeklyTaskCards.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`h-full bg-gradient-to-br ${task.color} text-white shadow-xl flex flex-col`}>
                  <CardHeader>
                    <CardTitle className="text-xl">{task.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow space-y-3">
                    <div className="flex-grow space-y-3">
                      <p className="whitespace-pre-line">
                        {task.description.split(/<strong>(.*?)<\/strong>/g).map((part, index) => 
                          index % 2 === 0 
                            ? part 
                            : <strong key={index}>{part}</strong>
                        )}
                      </p>
                      <div className="text-sm opacity-90 whitespace-pre-line">
                        {task.requirement.split(/<strong>(.*?)<\/strong>/g).map((part, index) => 
                          index % 2 === 0 
                            ? part 
                            : <strong key={index}>{part}</strong>
                        )}
                      </div>
                    </div>
                    <Button
                      className="w-full bg-white text-gray-800 hover:bg-gray-100 font-medium mt-auto"
                      onClick={() => { if (!task.disabled) { task.onClick(); } }}
                      disabled={task.disabled || overviewLoading}
                    >
                      {task.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
            <p>🔔 {language === 'zh' ? '截止时间：本周六 24:00（UTC+8）' : 'Deadline: Saturday 24:00 (UTC+8)'}</p>
            <p className="text-sm mt-1">{language === 'zh' ? '审核将在活动结束后根据实际情况进行。' : 'Review will be conducted after the event based on actual situation.'}</p>
          </div>
        </section>

        {/* Section 2: 单次任务 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
            {language === 'zh' ? '单次任务' : 'One-time Tasks'}
          </h2>
          <div className="flex justify-center">
            {oneTimeTaskCards.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-full max-w-md"
              >
                <Card className={`bg-gradient-to-br ${task.color} text-white shadow-xl`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    <p className="text-sm whitespace-pre-line">
                      {task.description.split(/<strong>(.*?)<\/strong>/g).map((part, index) => 
                        index % 2 === 0 
                          ? part 
                          : <strong key={index}>{part}</strong>
                      )}
                    </p>
                    <div className="text-xs opacity-90 whitespace-pre-line">
                      {task.requirement.split(/<strong>(.*?)<\/strong>/g).map((part, index) => 
                        index % 2 === 0 
                          ? part 
                          : <strong key={index}>{part}</strong>
                      )}
                    </div>
                    <Button
                      className="w-full bg-white text-gray-800 hover:bg-gray-100 font-medium text-sm py-2"
                      onClick={() => { if (!task.disabled) { task.onClick(); } }}
                      disabled={task.disabled || overviewLoading}
                    >
                      {task.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>



        {/* Section 4: 我的任务记录 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
            {language === 'zh' ? '我的任务记录' : 'My Task Records'}
          </h2>
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 dark:text-gray-200">
                📊 {language === 'zh' ? '我的任务记录' : 'My Task Records'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overviewLoading && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {language === 'zh' ? '加载中...' : 'Loading...'}
                  </div>
                )}
                {overviewError && (
                  <div className="text-sm text-red-500 dark:text-red-400">
                    {overviewError}
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {language === 'zh' ? '群规模&拉新：' : 'Group Size & Growth:'}
                  </span>
                  <span className={groupSizeSubmitted >= groupSizeLimit ? 'text-green-600' : 'text-orange-600'}>
                    {language === 'zh' ? '已提交' : 'Submitted'} {groupSizeSubmitted} / {groupSizeLimit} {groupSizeSubmitted >= groupSizeLimit ? '✅' : '⏳'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {language === 'zh' ? '社区活跃任务 - 群内活动：' : 'Community Activity - Group Internal:'}
                  </span>
                  <span className={groupInternalSubmitted >= groupInternalLimit ? 'text-green-600' : 'text-orange-600'}>
                    {language === 'zh' ? '已提交' : 'Submitted'} {groupInternalSubmitted} / {groupInternalLimit} {groupInternalSubmitted >= groupInternalLimit ? '✅' : '⏳'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {language === 'zh' ? '社区活跃任务 - 外部群：' : 'Community Activity - External Group:'}
                  </span>
                  <span className={externalGroupSubmitted >= externalGroupLimit ? 'text-green-600' : 'text-orange-600'}>
                    {language === 'zh' ? '已提交' : 'Submitted'} {externalGroupSubmitted} / {externalGroupLimit} {externalGroupSubmitted >= externalGroupLimit ? '✅' : '⏳'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {language === 'zh' ? '长期建设任务：' : 'Long-term Construction Task:'}
                  </span>
                  <span className={longTermConstructionSubmitted >= longTermConstructionLimit ? 'text-green-600' : 'text-orange-600'}>
                    {language === 'zh' ? '已提交' : 'Submitted'} {longTermConstructionSubmitted} / {longTermConstructionLimit} {longTermConstructionSubmitted >= longTermConstructionLimit ? '✅' : '⏳'}
                  </span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-800 dark:text-gray-200">
                      {language === 'zh' ? '本周总积分：' : 'Total Points This Week:'}
                    </span>
                    <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
                      {weeklyPoints} {language === 'zh' ? '分' : 'points'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 5: CC积分历史记录 */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
            {language === 'zh' ? 'CC积分历史记录' : 'CC Points History'}
          </h2>
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 dark:text-gray-200">
                🏆 {language === 'zh' ? 'CC积分历史记录' : 'CC Points History'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ccPointsLoading && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {language === 'zh' ? '加载中...' : 'Loading...'}
                  </div>
                )}
                {ccPointsError && (
                  <div className="text-sm text-red-500 dark:text-red-400">
                    {ccPointsError}
                  </div>
                )}
                {ccPoints.length === 0 && !ccPointsLoading && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                    {language === 'zh' ? '暂无积分记录' : 'No points records yet'}
                  </div>
                )}
                {ccPoints.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {language === 'zh' ? '周次' : 'Week'}
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {language === 'zh' ? '日期范围' : 'Date Range'}
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {language === 'zh' ? '积分' : 'Points'}
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {language === 'zh' ? '状态' : 'Status'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {ccPoints.map((point) => (
                          <tr key={point.weekCount}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {point.weekCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {point.dateRange}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600 dark:text-blue-400">
                              {point.points} {language === 'zh' ? '分' : 'points'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${point.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                                {point.status === 'completed' ? (language === 'zh' ? '已完成' : 'Completed') : (language === 'zh' ? '进行中' : 'In Progress')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
      
      {/* 任务提交弹框 */}
      {showTaskModal && activeTask && taskModalCopy[activeTask] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-900 border border-purple-100 dark:border-purple-700">
            <button
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              onClick={closeTaskModal}
            >
              ×
            </button>
            
            {/* 社区活跃任务：任务类型选择 */}
            {activeTask === 'communityActivity' && !activeCommunityTaskType ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">
                  {taskModalCopy[activeTask].title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
                  {taskModalCopy[activeTask].description}
                </p>
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setActiveCommunityTaskType('groupActivity')}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium py-3 rounded-xl shadow-lg transition-all duration-300 p-6 text-left"
                  >
                    <h3 className="text-lg font-bold mb-2">
                      {taskModalCopy[activeTask].subTasks.groupTask.title}
                    </h3>
                    <p className="text-sm opacity-90">
                      {taskModalCopy[activeTask].subTasks.groupTask.description}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCommunityTaskType('externalActivity')}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-medium py-3 rounded-xl shadow-lg transition-all duration-300 p-6 text-left"
                  >
                    <h3 className="text-lg font-bold mb-2">
                      {taskModalCopy[activeTask].subTasks.externalTask.title}
                    </h3>
                    <p className="text-sm opacity-90">
                      {taskModalCopy[activeTask].subTasks.externalTask.description}
                    </p>
                  </button>
                </div>
              </div>
            ) : (
              // 其他任务或已选择社区任务类型
              <form onSubmit={handleTaskSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">
                  {activeTask === 'communityActivity' && activeCommunityTaskType 
                    ? (activeCommunityTaskType === 'groupActivity' 
                      ? taskModalCopy[activeTask].subTasks.groupTask.title 
                      : taskModalCopy[activeTask].subTasks.externalTask.title) 
                    : taskModalCopy[activeTask].title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
                  {activeTask === 'communityActivity' && activeCommunityTaskType 
                    ? (activeCommunityTaskType === 'groupActivity' 
                      ? taskModalCopy[activeTask].subTasks.groupTask.description 
                      : taskModalCopy[activeTask].subTasks.externalTask.description) 
                    : taskModalCopy[activeTask].description}
                </p>
                
                {/* 截图上传 */}
                {activeTask === 'groupSize' ? (
                  // 群规模&拉新：显示两个上传框
                  <>
                    {/* 本周截图 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === 'zh' ? '本周QQ群成员数量截图' : 'This Week\'s QQ Group Member Count Screenshot'}
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300">
                        {taskForm.screenshots.thisWeek ? (
                          <div className="flex flex-col items-center">
                            <div className="text-green-500 mb-2">✅</div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {taskForm.screenshots.thisWeek.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleTaskScreenshotChange('thisWeek', null)}
                              className="mt-2 text-sm text-red-500 hover:text-red-700 dark:hover:text-red-300"
                            >
                              {language === 'zh' ? '更换文件' : 'Change file'}
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/jpg"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                if (file) {
                                  handleTaskScreenshotChange('thisWeek', file);
                                }
                              }}
                              className="hidden"
                            />
                            <div className="text-gray-400 text-4xl mb-3">📸</div>
                            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {language === 'zh' ? '点击或拖拽文件到此处上传' : 'Click or drag file to upload'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {taskModalCopy[activeTask].screenshotHint}
                            </span>
                          </label>
                        )}
                      </div>
                    </div>
                    
                    {/* 上周截图 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === 'zh' ? '上周QQ群成员数量截图' : 'Last Week\'s QQ Group Member Count Screenshot'}
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300">
                        {taskForm.screenshots.lastWeek ? (
                          <div className="flex flex-col items-center">
                            <div className="text-green-500 mb-2">✅</div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {taskForm.screenshots.lastWeek.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleTaskScreenshotChange('lastWeek', null)}
                              className="mt-2 text-sm text-red-500 hover:text-red-700 dark:hover:text-red-300"
                            >
                              {language === 'zh' ? '更换文件' : 'Change file'}
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/jpg"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                if (file) {
                                  handleTaskScreenshotChange('lastWeek', file);
                                }
                              }}
                              className="hidden"
                            />
                            <div className="text-gray-400 text-4xl mb-3">📸</div>
                            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {language === 'zh' ? '点击或拖拽文件到此处上传' : 'Click or drag file to upload'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {taskModalCopy[activeTask].screenshotHint}
                            </span>
                          </label>
                        )}
                      </div>
                    </div>
                  </>
                ) : activeTask === 'communityActivity' ? (
                  // 群内/外部群任务：支持多个截图上传
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {activeCommunityTaskType === 'groupActivity' 
                        ? taskModalCopy[activeTask].subTasks.groupTask.screenshotLabel 
                        : taskModalCopy[activeTask].subTasks.externalTask.screenshotLabel}
                      <span className="text-xs text-gray-500 ml-2">
                        {language === 'zh' ? '（可上传多张）' : '(multiple allowed)'}
                      </span>
                    </label>
                    
                    {/* 已上传的截图列表 */}
                    {taskForm.multipleScreenshots.length > 0 && (
                      <div className="mb-4 space-y-2">
                        {taskForm.multipleScreenshots.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                            <div className="flex items-center">
                              <span className="text-green-500 mr-2">✅</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
                                {file.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleMultipleScreenshotRemove(index)}
                              className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-300"
                            >
                              {language === 'zh' ? '删除' : 'Remove'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* 添加更多截图 */}
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          multiple
                          onChange={(e) => handleMultipleScreenshotAdd(e.target.files)}
                          className="hidden"
                        />
                        <div className="text-gray-400 text-4xl mb-3">📸</div>
                        <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {taskForm.multipleScreenshots.length > 0 
                            ? (language === 'zh' ? '点击添加更多截图' : 'Click to add more screenshots')
                            : (language === 'zh' ? '点击或拖拽文件到此处上传' : 'Click or drag file to upload')}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {activeCommunityTaskType === 'groupActivity' 
                            ? taskModalCopy[activeTask].subTasks.groupTask.screenshotHint 
                            : taskModalCopy[activeTask].subTasks.externalTask.screenshotHint}
                        </span>
                      </label>
                    </div>
                  </div>
                ) : activeTask === 'longTermConstruction' ? (
                  // 长期建设任务：需要群链接
                  <>
                    {/* 群链接输入 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === 'zh' ? '群链接（必填）' : 'Group Link (required)'}
                      </label>
                      <input
                        type="url"
                        value={taskForm.contentLink}
                        onChange={(e) => handleTaskFormChange('contentLink', e.target.value)}
                        placeholder={language === 'zh' ? '请输入群链接...' : 'Enter group link...'}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    {/* 截图上传 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {taskModalCopy[activeTask].screenshotLabel}
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300">
                        {taskForm.screenshots.thisWeek ? (
                          <div className="flex flex-col items-center">
                            <div className="text-green-500 mb-2">✅</div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {taskForm.screenshots.thisWeek.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleTaskScreenshotChange('thisWeek', null)}
                              className="mt-2 text-sm text-red-500 hover:text-red-700 dark:hover:text-red-300"
                            >
                              {language === 'zh' ? '更换文件' : 'Change file'}
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/jpg"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                if (file) {
                                  handleTaskScreenshotChange('thisWeek', file);
                                }
                              }}
                              className="hidden"
                            />
                            <div className="text-gray-400 text-4xl mb-3">📸</div>
                            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {language === 'zh' ? '点击或拖拽文件到此处上传' : 'Click or drag file to upload'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {taskModalCopy[activeTask].screenshotHint}
                            </span>
                          </label>
                        )}
                      </div>
                    </div>
                  </>
                ) : null}
                {/* 错误信息 */}
                {taskError && (
                  <div className="text-sm text-red-500 dark:text-red-400">
                    {taskError}
                  </div>
                )}
                {/* 提交按钮 */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium py-3 rounded-xl shadow-lg transition-all duration-300"
                  disabled={taskSubmitting || uploadProgress !== 'idle'}
                >
                  {uploadProgress === 'idle' && (
                    taskSubmitting ? '提交中...' : (language === 'zh' ? '提交任务' : 'Submit Task')
                  )}
                  {uploadProgress === 'uploading' && (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin mr-2">🔄</span>
                      {language === 'zh' ? '上传截图中...' : 'Uploading screenshot...'}
                    </span>
                  )}
                  {uploadProgress === 'submitting' && (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin mr-2">🔄</span>
                      {language === 'zh' ? '提交数据中...' : 'Submitting data...'}
                    </span>
                  )}
                  {uploadProgress === 'success' && (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">✅</span>
                      {language === 'zh' ? '提交成功！' : 'Submitted successfully!'}
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
      
      {/* 成功提示 */}
      {taskSuccess && (
        <div className="fixed bottom-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg">
          {taskSuccess}
        </div>
      )}
    </div>
  );
}
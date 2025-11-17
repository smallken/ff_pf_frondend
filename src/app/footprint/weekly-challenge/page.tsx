'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Button } from '../../components/reactbits/ButtonSimple';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/reactbits/Card';
import { formService, userService } from '@/services';
import { weeklyChallengeService } from '@/services/weeklyChallengeService';
import type { WeeklyTaskOverview, OriginalTaskVO, RankingUserVO } from '@/types/api';

export default function WeeklyChallenge() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [hasSubmittedApplication, setHasSubmittedApplication] = useState<boolean>(false);
  const [hasApproved, setHasApproved] = useState<boolean>(false);
  const [isCheckingApplication, setIsCheckingApplication] = useState<boolean>(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [activeTask, setActiveTask] = useState<'spread' | 'community' | 'original' | null>(null);
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [taskError, setTaskError] = useState('');
  const [taskSuccess, setTaskSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'submitting' | 'success'>('idle');
  const [taskForm, setTaskForm] = useState<{ contentLink: string; screenshot: File | null; browseNum: string }>({
    contentLink: '',
    screenshot: null,
    browseNum: '',
  });
  const [taskOverview, setTaskOverview] = useState<WeeklyTaskOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState<boolean>(false);
  const [overviewError, setOverviewError] = useState<string>('');
  const [selectedOriginalTask, setSelectedOriginalTask] = useState<OriginalTaskVO | null>(null);
  const [showOriginalEditModal, setShowOriginalEditModal] = useState(false);
  const [originalForm, setOriginalForm] = useState<{ browseNum: string; screenshot: File | null; contentLink: string }>({
    browseNum: '',
    screenshot: null,
    contentLink: '',
  });
  const [updatingOriginal, setUpdatingOriginal] = useState(false);
  const [originalError, setOriginalError] = useState('');
  const [originalSuccess, setOriginalSuccess] = useState('');
  const [isSunday, setIsSunday] = useState(false);
  const [weeklyRankings, setWeeklyRankings] = useState<RankingUserVO[]>([]);
  const [rankingsLoading, setRankingsLoading] = useState(false);
  const taskModalCopy = useMemo(() => ({
    spread: {
      title: language === 'zh' ? '提交传播任务成果' : 'Submit Spread Task Proof',
      description: language === 'zh'
        ? '请填写任务内容链接，并上传截图证明，待审核通过后即可领取积分。'
        : 'Provide the content link and upload a screenshot proof. Points will be granted once approved.',
      linkLabel: language === 'zh' ? '内容链接（必填）' : 'Content Link (required)',
      linkPlaceholder: language === 'zh' ? '请输入任务链接' : 'Enter the content link',
      screenshotLabel: language === 'zh' ? '截图证明（必填）' : 'Screenshot Proof (required)',
      screenshotHint: language === 'zh'
        ? '支持 PNG、JPG、JPEG 格式，大小不超过 5MB。'
        : 'Supports PNG, JPG, JPEG up to 5MB.',
      success: language === 'zh' ? '传播任务提交成功，我们将尽快审核！' : 'Spread task submitted. We will review shortly.',
    },
    community: {
      title: language === 'zh' ? '提交社群任务成果' : 'Submit Community Task Proof',
      description: language === 'zh'
        ? '请提供本周社群互动的内容链接，并上传截图证明，审核通过后可领取积分。'
        : 'Provide the community interaction link and upload a screenshot proof. Points will be granted once approved.',
      linkLabel: language === 'zh' ? '社群互动链接（必填）' : 'Community Link (required)',
      linkPlaceholder: language === 'zh' ? '请输入社群互动链接' : 'Enter the community link',
      screenshotLabel: language === 'zh' ? '社群互动截图（必填）' : 'Community Screenshot (required)',
      screenshotHint: language === 'zh'
        ? '支持 PNG、JPG、JPEG 格式，大小不超过 5MB。'
        : 'Supports PNG, JPG, JPEG up to 5MB.',
      success: language === 'zh' ? '社群任务提交成功，我们将尽快审核！' : 'Community task submitted. We will review shortly.',
    },
    original: {
      title: language === 'zh' ? '提交原创任务成果' : 'Submit Original Task Proof',
      description: language === 'zh'
        ? '请提供原创内容链接，并上传截图证明，审核通过后可领取积分。'
        : 'Provide the original content link and upload a screenshot proof. Points will be granted once approved.',
      linkLabel: language === 'zh' ? '原创内容链接（必填）' : 'Original Content Link (required)',
      linkPlaceholder: language === 'zh' ? '请输入原创内容链接' : 'Enter the original content link',
      screenshotLabel: language === 'zh' ? '原创内容截图（必填）' : 'Original Screenshot (required)',
      screenshotHint: language === 'zh'
        ? '支持 PNG、JPG、JPEG 格式，大小不超过 5MB。'
        : 'Supports PNG, JPG, JPEG up to 5MB.',
      success: language === 'zh' ? '原创任务提交成功，我们将尽快审核！' : 'Original task submitted. We will review shortly.',
      browseLabel: language === 'zh' ? '浏览量（必填）' : 'View Count (required)',
      browsePlaceholder: language === 'zh' ? '请输入内容当前浏览量' : 'Enter current view count',
      browseHint: language === 'zh'
        ? '浏览量是当前内容的浏览量，可在周排行活动截止前进行修改。'
        : 'Use the current view count of your content. You can update it before the weekly leaderboard deadline.',
    },
  }), [language]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

  useEffect(() => {
    // 检查是否有通过审核的申请表
    formService.hasApprovedApplication()
      .then(approved => {
        setHasApproved(approved);
      })
      .catch(() => {
        setHasApproved(false);
      });
    
    // 检查是否提交过申请表（无论审核状态）
    formService
      .getMyForms({ status: undefined, current: 1, pageSize: 1 })
      .then(response => {
        const hasSubmitted = Boolean(response?.records && response.records.length > 0);
        setHasSubmittedApplication(hasSubmitted);
      })
      .catch(() => {
        setHasSubmittedApplication(false);
      })
      .finally(() => {
        setIsCheckingApplication(false);
      });
  }, []);

  const handleApplyClick = () => {
    router.push('/forms/application');
  };

  const uploadTaskScreenshot = async (file: File): Promise<string> => {
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
      console.error('❌ 截图上传到Vercel Blob失败:', error);
      const baseMessage = error?.message || (language === 'zh' ? '上传失败，请稍后重试。' : 'Upload failed, please try again later.');
      throw new Error(language === 'zh' ? `截图上传失败：${baseMessage}` : `Screenshot upload failed: ${baseMessage}`);
    }
  };

  const fetchTaskOverview = useCallback(async () => {
    try {
      setOverviewLoading(true);
      setOverviewError('');
      const data = await weeklyChallengeService.getMyTaskOverview();
      setTaskOverview(data);
    } catch (error: any) {
      console.error('获取任务总览失败:', error);
      setOverviewError(error.message || (language === 'zh' ? '获取任务数据失败' : 'Failed to load task data.'));
    } finally {
      setOverviewLoading(false);
    }
  }, [language]);

  useEffect(() => {
    if (!isCheckingApplication && hasSubmittedApplication) {
      fetchTaskOverview();
    }
  }, [fetchTaskOverview, hasSubmittedApplication, isCheckingApplication]);

  // 获取周排行榜数据
  useEffect(() => {
    const fetchWeeklyRankings = async () => {
      try {
        setRankingsLoading(true);
        const response = await userService.getWeeklyRanking({ current: 1, pageSize: 10 });
        setWeeklyRankings(response.records || []);
      } catch (error: any) {
        console.error('获取周排行榜失败:', error);
      } finally {
        setRankingsLoading(false);
      }
    };
    fetchWeeklyRankings();
  }, []);

  const openTaskModal = useCallback((task: 'spread' | 'community' | 'original') => {
    setActiveTask(task);
    setShowTaskModal(true);
    setTaskForm({ contentLink: '', screenshot: null, browseNum: '' });
    setTaskError('');
    setTaskSuccess('');
    setUploadProgress('idle');
  }, []);

  const closeTaskModal = () => {
    setShowTaskModal(false);
    setActiveTask(null);
    setTaskSubmitting(false);
    setTaskError('');
    setTaskSuccess('');
    setUploadProgress('idle');
    setTaskForm({ contentLink: '', screenshot: null, browseNum: '' });
  };

  const handleTaskFormChange = (field: 'contentLink' | 'browseNum', value: string) => {
    setTaskForm(prev => ({ ...prev, [field]: value }));
  };

  const handleTaskScreenshotChange = (file: File | null) => {
    setTaskForm(prev => ({ ...prev, screenshot: file }));
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;

    setTaskError('');
    setTaskSuccess('');

    // 传播任务和原创任务链接必填，社群任务链接选填
    if (activeTask !== 'community' && !taskForm.contentLink.trim()) {
      setTaskError(language === 'zh' ? '请填写内容链接' : 'Please provide the content link.');
      return;
    }

    if (!taskForm.screenshot) {
      setTaskError(language === 'zh' ? '请上传截图证明' : 'Please upload a screenshot proof.');
      return;
    }

    let browseNumValue: number | undefined;
    if (activeTask === 'original') {
      const trimmed = taskForm.browseNum.trim();
      if (!trimmed) {
        setTaskError(language === 'zh' ? '请填写浏览量。' : 'Please provide the view count.');
        return;
      }
      const parsed = Number(trimmed);
      if (Number.isNaN(parsed) || parsed < 0) {
        setTaskError(
          language === 'zh'
            ? '浏览量请输入大于或等于 0 的数字。'
            : 'Please enter a view count of 0 or greater.'
        );
        return;
      }
      browseNumValue = parsed;
    }

    setTaskSubmitting(true);
    setUploadProgress('uploading');

    try {
      // 第一步：上传截图到Vercel
      const screenshotUrl = await uploadTaskScreenshot(taskForm.screenshot as File);

      // 第二步：提交数据到后端
      setUploadProgress('submitting');
      
      if (activeTask === 'spread') {
        await weeklyChallengeService.submitCommunicationTask({
          contentLink: taskForm.contentLink.trim(),
          screenshotUrl,
        });
      } else if (activeTask === 'community') {
        // 社群任务不需要contentLink字段，但API要求，所以传空字符串
        await weeklyChallengeService.submitCommunityTask({
          contentLink: '',
          screenshotUrl,
        });
      } else if (activeTask === 'original') {
        await weeklyChallengeService.submitOriginalTask({
          contentLink: taskForm.contentLink.trim(),
          screenshotUrl,
          browseNum: browseNumValue!, // 非空断言：在这之前已经验证过
        });
      }

      // 第三步：提交成功
      setUploadProgress('success');
      setTaskSuccess(taskModalCopy[activeTask].success);
      await fetchTaskOverview();
      setTaskForm({ contentLink: '', screenshot: null, browseNum: '' });
      
      // 立即刷新一次，然后延迟10秒后再刷新一次以获取审核后的积分
      setTimeout(async () => {
        await fetchTaskOverview();
      }, 10000);
      
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
          // 直接使用后端返回的错误消息，保留详细信息
          message = error.message;
        }
      }
      setTaskError(message);
    } finally {
      setTaskSubmitting(false);
    }
  };

  const openOriginalEdit = (task: OriginalTaskVO) => {
    setSelectedOriginalTask(task);
    setOriginalForm({
      browseNum: task.browseNum !== undefined && task.browseNum !== null ? String(task.browseNum) : '',
      screenshot: null,
      contentLink: task.contentLink || '',
    });
    setOriginalError('');
    setOriginalSuccess('');
    setShowOriginalEditModal(true);
  };

  const closeOriginalEdit = () => {
    setShowOriginalEditModal(false);
    setSelectedOriginalTask(null);
    setOriginalForm({ browseNum: '', screenshot: null, contentLink: '' });
    setOriginalError('');
    setOriginalSuccess('');
  };

  const handleOriginalInputChange = (field: 'browseNum' | 'contentLink', value: string) => {
    setOriginalForm(prev => ({ ...prev, [field]: value }));
  };

  const handleOriginalScreenshotChange = (file: File | null) => {
    setOriginalForm(prev => ({ ...prev, screenshot: file }));
  };

  const handleOriginalUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOriginalTask) return;

    setOriginalError('');
    setOriginalSuccess('');
    setUpdatingOriginal(true);

    try {
      let screenshotUrl: string | undefined;
      if (originalForm.screenshot) {
        screenshotUrl = await uploadTaskScreenshot(originalForm.screenshot);
      }

      const browseTrimmed = originalForm.browseNum.trim();
      let browseNumValue = browseTrimmed ? Number(browseTrimmed) : undefined;
      if (browseNumValue !== undefined) {
        if (Number.isNaN(browseNumValue) || browseNumValue < 0) {
          throw new Error(language === 'zh' ? '浏览量请输入大于或等于 0 的数字。' : 'Please enter a view count of 0 or greater.');
        }
      }

      await weeklyChallengeService.updateOriginalTask({
        id: selectedOriginalTask.id,
        screenshotUrl,
        browseNum: browseNumValue,
        contentLink: originalForm.contentLink.trim() || undefined,
      });

      setOriginalSuccess(language === 'zh' ? '更新成功！' : 'Updated successfully!');
      await fetchTaskOverview();
      setTimeout(() => {
        closeOriginalEdit();
      }, 1200);
    } catch (error: any) {
      console.error('更新原创任务失败:', error);
      setOriginalError(error.message || (language === 'zh' ? '更新失败，请稍后重试。' : 'Update failed. Please try again.'));
    } finally {
      setUpdatingOriginal(false);
    }
  };

  const communicationSubmitted = taskOverview?.communicationSubmitted ?? 0;
  const communicationLimit = taskOverview?.communicationLimit ?? 5;
  const communitySubmitted = taskOverview?.communitySubmitted ?? 0;
  const communityLimit = taskOverview?.communityLimit ?? 3;
  const originalSubmitted = taskOverview?.originalSubmitted ?? 0;
  const originalLimit = taskOverview?.originalLimit ?? 1;
  const weeklyPoints = taskOverview?.weeklyPoints ?? 0;
  const originalTasks = taskOverview?.originalTasks ?? [];
  const canSubmitCommunication = hasSubmittedApplication && !isCheckingApplication && communicationSubmitted < communicationLimit;
  const canSubmitCommunity = hasSubmittedApplication && !isCheckingApplication && communitySubmitted < communityLimit;
  const canSubmitOriginal = hasSubmittedApplication && !isCheckingApplication && originalSubmitted < originalLimit;

  const taskCards = [
    {
      id: '传播任务',
      title: language === 'zh' ? '📣 传播任务' : '📣 Spread Task',
      description: language === 'zh' 
        ? '为本周官方推文一键三联（转+赞+评）' 
        : 'Triple-click (retweet+like+comment) on this week\'s official tweet',
      points: language === 'zh' ? `本周提交次数上限：${communicationLimit} 次` : `Weekly submissions limit: ${communicationLimit}`,
      requirement: language === 'zh' 
        ? '提交要求：上传截图（含评论文字）+ 链接；必须包含推特名字（需与平台登记一致）；截图需包含转发/点赞/评论证明（每周最多 5 次）' 
        : 'Submission: Upload screenshot (with comment text) + link; Must contain Twitter username (match registered name); Screenshot must show retweet/like/comment proof (up to 5 times per week)',
      buttonText: language === 'zh' ? '上传并领取积分' : 'Upload & Claim Points',
      color: 'from-blue-500 to-cyan-500',
      onClick: () => openTaskModal('spread'),
      disabled: !canSubmitCommunication
    },
    {
      id: '社群任务',
      title: language === 'zh' ? '💬 社群任务' : '💬 Community Task',
      description: language === 'zh' 
        ? '参与本周 Telegram Topic / AMA 发言（每周最多 3 次）' 
        : 'Participate in this week\'s Telegram Topic / AMA (up to 3 times per week)',
      points: language === 'zh' ? `本周提交次数上限：${communityLimit} 次` : `Weekly submissions limit: ${communityLimit}`,
      requirement: language === 'zh' 
        ? '提交要求：上传截图（含发言内容）+ 链接（每周最多 3 次）' 
        : 'Submission: Upload screenshot (with discussion content) + link (up to 3 times per week)',
      buttonText: language === 'zh' ? '上传并领取积分' : 'Upload & Claim Points',
      color: 'from-purple-500 to-pink-500',
      onClick: () => openTaskModal('community'),
      disabled: !canSubmitCommunity
    },
    {
      id: '原创任务',
      title: language === 'zh' ? '✍️ 原创任务' : '✍️ Original Task',
      description: language === 'zh'
        ? '#FFFPWeek7 –「你觉得未来Web3哪个赛道会先爆？来押一波」\n发布平台：X/Twitter\n本周提交次数上限：1 次\n提交要求：上传截图 + 链接 + 浏览量；内容需@官方账号并添加#FFFP话题标签；内容形式不限：文字、图片、视频等'
        : '#FFFPWeek7 - "Which Web3 track will moon first? Drop your prediction"\nPublishing Platform: X/Twitter\nWeekly submissions limit: 1\nSubmission: Upload screenshot + link + view count; Content must @ official account and add #FFFP hashtag; Content type is flexible: text, image, video, etc.',
      points: language === 'zh' ? `本周提交次数上限：${originalLimit} 次` : `Weekly submissions limit: ${originalLimit}`,
      requirement: language === 'zh'
        ? '提交要求：上传截图 + 链接 + 浏览量；内容需@官方账号并添加#FFFP话题标签；内容形式不限：文字、图片、视频等'
        : 'Submission: Upload screenshot + link + view count; Content must @ official account and add #FFFP hashtag; Content type is flexible: text, image, video, etc.',
      buttonText: language === 'zh' ? '上传作品' : 'Upload Work',
      color: 'from-amber-500 to-orange-500',
      onClick: () => openTaskModal('original'),
      disabled: !canSubmitOriginal
    }
  ];

  // 使用真实的周排行榜数据

  const prizePool = [
    { rank: 'Top 1–3', prize: language === 'zh' ? '固定大奖 金额...' : 'Fixed grand prize amount...', color: 'from-yellow-400 to-amber-500' },
    { rank: 'Top 4–10', prize: language === 'zh' ? '梯度奖金 金额...' : 'Tiered prize amount...', color: 'from-gray-300 to-gray-400' },
    { rank: 'Top 11–30', prize: language === 'zh' ? '均分奖池 金额...' : 'Pool sharing amount...', color: 'from-orange-300 to-orange-400' },
    { rank: 'Top 31–50', prize: language === 'zh' ? '基础奖励 金额...' : 'Basic reward amount...', color: 'from-blue-300 to-blue-400' }
  ];
  const activeTaskCopy = activeTask ? taskModalCopy[activeTask] : null;

  return (
    <>
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
            {language === 'zh' ? 'Flipflop Footprint Weekly Challenge | 完成任务，赢取奖励！' : 'Flipflop Footprint Weekly Challenge | Complete tasks, win rewards!'}
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
            🔥 {language === 'zh' ? '完成任务，领取积分，冲击排行榜！' : 'Complete tasks, claim points, climb the leaderboard!'}
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
          
          <Button
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg"
            onClick={handleApplyClick}
            disabled={isCheckingApplication || hasSubmittedApplication}
          >
            {language === 'zh' ? '报名申请' : 'Apply Now'}
          </Button>
          {hasSubmittedApplication && !hasApproved && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {language === 'zh' ? '您已提交报名申请表，耐心等待审核结果。' : 'You have already submitted the application form. Please wait for the review result.'}
            </p>
          )}
          {!hasSubmittedApplication && !isCheckingApplication && (
            <p className="mt-3 text-sm text-orange-500 dark:text-orange-300">
              {language === 'zh'
                ? '请先完成报名审核，才能提交每周挑战任务。'
                : 'Please complete the application review before submitting weekly challenge tasks.'}
            </p>
          )}
        </motion.div>

        {/* Section 1: 任务概览 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
            {language === 'zh' ? '任务概览（每周更新）' : 'Task Overview (Weekly Update)'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {taskCards.map((task, index) => (
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
                      <p className="whitespace-pre-line">{task.description}</p>
                      <p className="text-sm opacity-90">{task.points}</p>
                      <p className="text-sm opacity-90">{task.requirement}</p>
                    </div>
                    <Button
                      className="w-full bg-white text-gray-800 hover:bg-gray-100 font-medium mt-auto"
                      onClick={() => { if (!task.disabled) { task.onClick(); } }}
                      disabled={task.disabled || overviewLoading || isCheckingApplication}
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
            <p className="text-sm mt-1">{language === 'zh' ? '审核将在活动结束后根据实际浏览量进行加权。' : 'Review will be conducted after the event based on actual view counts.'}</p>
          </div>
        </section>

        {/* Section 2: 奖池与发奖规则 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
            {language === 'zh' ? '奖池与发奖规则' : 'Prize Pool and Distribution Rules'}
          </h2>
          <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">
                {language === 'zh' ? '本周奖池：1000U（Top 50 用户将获得奖励）' : 'This week\'s prize pool: 1000U (Top 50 users will receive rewards)'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {prizePool.map((prize, index) => (
                  <div key={index} className={`p-4 rounded-lg bg-gradient-to-r ${prize.color} bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30`}>
                    <h3 className="font-bold text-lg mb-2">{prize.rank}</h3>
                    <p>{prize.prize}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-lg">
                {language === 'zh' ? '发榜时间：每周一（UTC+8）' : 'Leaderboard update: Every Monday (UTC+8)'}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 3: 排行榜预览 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
            {language === 'zh' ? '排行榜预览' : 'Leaderboard Preview'}
          </h2>
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 dark:text-gray-200">
                👑 {language === 'zh' ? '本周前十榜单（实时更新）' : 'Top 10 This Week (Real-time Update)'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rankingsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-300">加载中...</span>
                </div>
              ) : weeklyRankings.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  {language === 'zh' ? '暂无排行榜数据' : 'No ranking data available'}
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {weeklyRankings.map((user, index) => {
                      const rank = user.rank || index + 1;
                      const points = user.weeklyPoints || 0;
                      const displayName = user.twitterUsername ? `@${user.twitterUsername}` : user.userName;
                      return (
                        <div key={user.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                              rank === 1 ? 'bg-yellow-500' : 
                              rank === 2 ? 'bg-gray-400' : 
                              rank === 3 ? 'bg-amber-600' : 'bg-gray-600'
                            }`}>
                              {rank}
                            </div>
                            <span className="font-medium text-gray-800 dark:text-gray-200">{displayName}</span>
                          </div>
                          <span className="font-bold text-blue-600 dark:text-blue-400">{points} {language === 'zh' ? '分' : 'points'}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 text-center">
                    <Button 
                      variant="outline" 
                      className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onClick={() => router.push('/footprint/ranking')}
                    >
                      {language === 'zh' ? '查看完整榜单 →' : 'View Full Leaderboard →'}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Section 4: 我的任务记录 */}
        <section>
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
                    {language === 'zh' ? '传播类：' : 'Spread Tasks:'}
                  </span>
                  <span className={communicationSubmitted >= communicationLimit ? 'text-green-600' : 'text-orange-600'}>
                    {language === 'zh' ? '已提交' : 'Submitted'} {communicationSubmitted} / {communicationLimit} {communicationSubmitted >= communicationLimit ? '✅' : '⏳'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {language === 'zh' ? '社群类：' : 'Community Tasks:'}
                  </span>
                  <span className={communitySubmitted >= communityLimit ? 'text-green-600' : 'text-orange-600'}>
                    {language === 'zh' ? '已提交' : 'Submitted'} {communitySubmitted} / {communityLimit} {communitySubmitted >= communityLimit ? '✅' : '⏳'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {language === 'zh' ? '原创类：' : 'Original Tasks:'}
                  </span>
                  <span className={originalSubmitted >= originalLimit ? 'text-green-600' : 'text-orange-600'}>
                    {language === 'zh' ? '已提交' : 'Submitted'} {originalSubmitted} / {originalLimit} {originalSubmitted >= originalLimit ? '✅' : '⏳'}
                  </span>
                </div>
                {originalTasks.length > 0 && (
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      className="text-sm"
                      onClick={() => openOriginalEdit(originalTasks[0])}
                    >
                      {language === 'zh' ? '更新原创任务' : 'Update Original Task'}
                    </Button>
                  </div>
                )}
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
      </div>
    </div>
    {showTaskModal && activeTaskCopy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-900 border border-blue-100 dark:border-blue-700">
            <button
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              onClick={closeTaskModal}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              {activeTaskCopy.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {activeTaskCopy.description}
            </p>
            <form onSubmit={handleTaskSubmit} className="space-y-5">
              {/* 社群任务不显示链接输入框 */}
              {activeTask !== 'community' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    {activeTaskCopy.linkLabel}
                  </label>
                  <input
                    type="url"
                    value={taskForm.contentLink}
                    onChange={(e) => handleTaskFormChange('contentLink', e.target.value)}
                    placeholder={activeTaskCopy.linkPlaceholder}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}
              {activeTask === 'original' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    {taskModalCopy.original.browseLabel}
                  </label>
                <input
                  type="number"
                  min={0}
                  value={taskForm.browseNum}
                  onChange={(e) => handleTaskFormChange('browseNum', e.target.value)}
                  placeholder={taskModalCopy.original.browsePlaceholder}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {taskModalCopy.original.browseHint}
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {activeTaskCopy.screenshotLabel}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleTaskScreenshotChange(e.target.files?.[0] ?? null)}
                  className="w-full rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {activeTaskCopy.screenshotHint}
                </p>
              </div>

              {taskError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300 flex items-start space-x-2">
                  <span>❌</span>
                  <span>{taskError}</span>
                </div>
              )}

              {taskSuccess && (
                <div className="rounded-xl border-2 border-green-400 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 px-6 py-4 shadow-lg animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-semibold text-green-700 dark:text-green-300">
                        {taskSuccess}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        {language === 'zh' ? '你可以关闭此窗口了' : 'You can close this window now'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {uploadProgress !== 'idle' && uploadProgress !== 'success' && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-600 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300 flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  <span>
                    {uploadProgress === 'uploading' && (language === 'zh' ? '正在上传截图，请稍候...' : 'Uploading screenshot, please wait...')}
                    {uploadProgress === 'submitting' && (language === 'zh' ? '正在提交数据，即将完成...' : 'Submitting data, almost done...')}
                  </span>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-2">
                {taskSuccess ? (
                  <Button
                    type="button"
                    className="bg-gradient-to-r from-green-500 to-green-600 px-8 text-white font-semibold hover:from-green-600 hover:to-green-700"
                    onClick={closeTaskModal}
                  >
                    ✓ {language === 'zh' ? '完成' : 'Done'}
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      className="px-5"
                      onClick={closeTaskModal}
                      disabled={taskSubmitting}
                    >
                      {language === 'zh' ? '取消' : 'Cancel'}
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 text-white"
                      disabled={taskSubmitting}
                    >
                      {taskSubmitting
                        ? (
                          <span className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>
                              {uploadProgress === 'uploading' && (language === 'zh' ? '上传中' : 'Uploading')}
                              {uploadProgress === 'submitting' && (language === 'zh' ? '提交中' : 'Submitting')}
                              {uploadProgress === 'success' && (language === 'zh' ? '成功' : 'Success')}
                            </span>
                          </span>
                        )
                        : (language === 'zh' ? '提交' : 'Submit')}
                    </Button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    {showOriginalEditModal && selectedOriginalTask && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
        <div className="relative w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-900 border border-blue-100 dark:border-blue-700">
          <button
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            onClick={closeOriginalEdit}
            type="button"
          >
            ×
          </button>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {language === 'zh' ? '更新原创任务' : 'Update Original Task'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {language === 'zh'
              ? '可在截止前更新原创内容链接、截图和浏览量。'
              : 'Update your original submission before the deadline.'}
          </p>
          <form onSubmit={handleOriginalUpdate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                {language === 'zh' ? '原创内容链接' : 'Original Content Link'}
              </label>
              <input
                type="url"
                value={originalForm.contentLink}
                onChange={(e) => handleOriginalInputChange('contentLink', e.target.value)}
                placeholder={language === 'zh' ? '请输入原创内容链接' : 'Enter original content link'}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                {language === 'zh' ? '浏览量（可选）' : 'View Count (optional)'}
              </label>
              <input
                type="number"
                min={0}
                value={originalForm.browseNum}
                onChange={(e) => handleOriginalInputChange('browseNum', e.target.value)}
                placeholder={language === 'zh' ? '请输入浏览量' : 'Enter view count'}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {language === 'zh'
                  ? '浏览量是当前内容的浏览量，可在周排行活动截止前进行修改。'
                  : 'Use the current view count of your content. You can update it before the weekly leaderboard deadline.'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                {language === 'zh' ? '更新截图（可选）' : 'Update Screenshot (optional)'}
              </label>
              {selectedOriginalTask.screenshot && (
                <div className="mb-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {language === 'zh' ? '当前截图：' : 'Current screenshot:'}
                  </div>
                  <img
                    src={selectedOriginalTask.screenshot}
                    alt="current screenshot"
                    className="max-h-40 rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleOriginalScreenshotChange(e.target.files?.[0] ?? null)}
                className="w-full rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {language === 'zh' ? '支持 PNG、JPG、JPEG 格式，大小不超过 5MB。' : 'Supports PNG, JPG, JPEG up to 5MB.'}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {language === 'zh'
                  ? '直接上传新的截图即可覆盖当前截图。'
                  : 'Uploading a new screenshot will overwrite the current one.'}
              </p>
            </div>

            {originalError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300">
                {originalError}
              </div>
            )}

            {originalSuccess && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-600 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300">
                {originalSuccess}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="px-5"
                onClick={closeOriginalEdit}
                disabled={updatingOriginal}
              >
                {language === 'zh' ? '取消' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 text-white"
                disabled={updatingOriginal}
              >
                {updatingOriginal
                  ? language === 'zh'
                    ? '保存中...'
                    : 'Saving...'
                  : language === 'zh'
                  ? '保存'
                  : 'Save'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
}

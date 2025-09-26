import type { MonthlyRewardVO } from '../types/monthlyReward';
import { REWARD_LEVELS, REWARD_REQUIREMENTS } from '../types/monthlyReward';

// 生成随机中文姓名的函数
const generateChineseName = (id: number): string => {
  const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗', '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧', '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕', '苏', '卢', '蒋', '蔡', '贾', '丁', '魏', '薛', '叶', '阎', '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜', '范', '方', '石', '姚', '谭', '廖', '邹', '熊', '金', '陆', '郝', '孔', '白', '崔', '康', '毛', '邱', '秦', '江', '史', '顾', '侯', '邵', '孟', '龙', '万', '段', '雷', '钱', '汤', '尹', '黎', '易', '常', '武', '乔', '贺', '赖', '龚', '文'];
  const givenNames = ['伟', '芳', '娜', '敏', '静', '秀英', '丽', '强', '磊', '洋', '艳', '勇', '军', '杰', '娟', '涛', '超', '明', '霞', '平', '刚', '桂英', '建华', '秀兰', '飞', '小红', '永', '红', '建国', '世杰', '志强', '文', '金凤', '荣', '桂兰', '秀珍', '国庆', '建军', '小明', '国强', '德华', '海燕', '春梅', '志明', '秀华', '建平', '小丽', '国华', '正', '玉兰', '玉英', '小华', '建国', '国栋', '国庆', '建华', '建平', '建军', '建国', '建华', '建平', '建军', '建国', '建华', '建平', '建军'];

  const surname = surnames[id % surnames.length];
  const givenName = givenNames[(id * 7) % givenNames.length];
  return surname + givenName;
};

// 生成随机邮箱
const generateEmail = (name: string, id: number): string => {
  const domains = ['gmail.com', 'qq.com', '163.com', '126.com', 'sina.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const domain = domains[id % domains.length];
  const username = name.toLowerCase() + (id % 100).toString().padStart(2, '0');
  return username + '@' + domain;
};

// 根据等级生成合理的分数
const generateScoresForLevel = (level: string) => {
  const requirements = REWARD_REQUIREMENTS[level as keyof typeof REWARD_REQUIREMENTS];
  const baseScores = {
    promotion: requirements.promotion,
    short: requirements.short,
    long: requirements.long,
    community: requirements.community
  };

  // 添加一些随机波动，让数据更真实
  const variation = 0.3; // 30%的波动
  return {
    promotion: Math.max(0, Math.round(baseScores.promotion * (1 + (Math.random() - 0.5) * variation))),
    short: Math.max(0, Math.round(baseScores.short * (1 + (Math.random() - 0.5) * variation))),
    long: Math.max(0, Math.round(baseScores.long * (1 + (Math.random() - 0.5) * variation))),
    community: Math.max(0, Math.round(baseScores.community * (1 + (Math.random() - 0.5) * variation)))
  };
};

// 生成随机日期
const generateRandomDate = (year: number, month: number): string => {
  const day = Math.floor(Math.random() * 28) + 1; // 避免月末日期问题
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T23:59:59Z`;
};

// 等级分布权重（基础:进阶一:进阶二:进阶三 = 50:30:15:5）
const getRandomLevel = (): string => {
  const rand = Math.random();
  if (rand < 0.5) return REWARD_LEVELS.BASIC;
  if (rand < 0.8) return REWARD_LEVELS.ADVANCED1;
  if (rand < 0.95) return REWARD_LEVELS.ADVANCED2;
  return REWARD_LEVELS.ADVANCED3;
};

// 生成100个模拟用户数据
export const mockUsersData: MonthlyRewardVO[] = [];

for (let i = 1; i <= 100; i++) {
  const userId = i;
  const name = generateChineseName(i);
  const email = generateEmail(name, i);
  const level = getRandomLevel();
  const scores = generateScoresForLevel(level);
  const requirements = REWARD_REQUIREMENTS[level as keyof typeof REWARD_REQUIREMENTS];

  // 随机生成年月（2024年1-12月）
  const year = 2024;
  const month = Math.floor(Math.random() * 12) + 1;

  mockUsersData.push({
    id: i,
    userId: userId,
    rewardYear: year,
    rewardMonth: month,
    promotionScore: scores.promotion,
    shortScore: scores.short,
    longScore: scores.long,
    communityScore: scores.community,
    rewardLevel: level,
    rewardAmount: requirements.amount,
    isCalculated: Math.random() > 0.2 ? 1 : 0, // 80%已计算
    isPaid: Math.random() > 0.3 ? 1 : 0, // 70%已发放
    paidTime: Math.random() > 0.3 ? generateRandomDate(year, month) : undefined,
    createTime: generateRandomDate(year, month),
    updateTime: generateRandomDate(year, month)
  });
}

// 按用户ID排序
mockUsersData.sort((a, b) => a.userId - b.userId);

export default mockUsersData;

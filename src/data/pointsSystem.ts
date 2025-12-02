// 地陪积分系统配置

export interface PointsLevel {
  level: number;
  name: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  icon: string;
  priceLimit: number; // 价格上限（元/小时）
  commission: number; // 平台抽成比例（0-1）
  benefits: string[];
}

// 积分等级配置
export const POINTS_LEVELS: PointsLevel[] = [
  {
    level: 1,
    name: '见习地陪',
    minPoints: 0,
    maxPoints: 499,
    color: 'from-gray-400 to-gray-500',
    icon: '🌱',
    priceLimit: 50,
    commission: 0.20, // 20%
    benefits: [
      '价格上限：¥50/小时',
      '平台抽成：20%',
      '基础客户推荐',
    ],
  },
  {
    level: 2,
    name: '初级地陪',
    minPoints: 500,
    maxPoints: 1499,
    color: 'from-green-400 to-green-500',
    icon: '🌿',
    priceLimit: 80,
    commission: 0.18, // 18%
    benefits: [
      '价格上限：¥80/小时',
      '平台抽成：18%',
      '优先展示',
      '初级徽章',
    ],
  },
  {
    level: 3,
    name: '中级地陪',
    minPoints: 1500,
    maxPoints: 2999,
    color: 'from-blue-400 to-blue-500',
    icon: '🌟',
    priceLimit: 120,
    commission: 0.15, // 15%
    benefits: [
      '价格上限：¥120/小时',
      '平台抽成：15%',
      '优先推荐',
      '中级徽章',
      '专属客服',
    ],
  },
  {
    level: 4,
    name: '高级地陪',
    minPoints: 3000,
    maxPoints: 4999,
    color: 'from-purple-400 to-purple-500',
    icon: '💎',
    priceLimit: 160,
    commission: 0.12, // 12%
    benefits: [
      '价格上限：¥160/小时',
      '平台抽成：12%',
      '黄金推荐位',
      '高级徽章',
      '专属客服',
      '免费推广',
    ],
  },
  {
    level: 5,
    name: '金牌地陪',
    minPoints: 5000,
    maxPoints: 9999,
    color: 'from-yellow-400 to-orange-500',
    icon: '🏆',
    priceLimit: 200,
    commission: 0.10, // 10%
    benefits: [
      '价格上限：¥200/小时',
      '平台抽成：10%',
      '钻石推荐位',
      '金牌徽章',
      '专属VIP客服',
      '免费推广',
      '优先接单权',
    ],
  },
  {
    level: 6,
    name: '传奇地陪',
    minPoints: 10000,
    maxPoints: Infinity,
    color: 'from-red-500 to-pink-500',
    icon: '👑',
    priceLimit: 300,
    commission: 0.08, // 8%
    benefits: [
      '价格上限：¥300/小时',
      '平台抽成：8%',
      '首页置顶',
      '传奇徽章',
      '1对1专属客服',
      '全平台推广',
      '优先接单权',
      '品牌合作机会',
    ],
  },
];

// 积分获取规则
export interface PointsRule {
  action: string;
  points: number;
  description: string;
  icon: string;
  limit?: string;
}

export const POINTS_RULES: PointsRule[] = [
  {
    action: 'complete_order',
    points: 10,
    description: '完成一单服务',
    icon: '✅',
  },
  {
    action: 'five_star_review',
    points: 20,
    description: '获得五星好评',
    icon: '⭐',
  },
  {
    action: 'four_star_review',
    points: 10,
    description: '获得四星好评',
    icon: '⭐',
  },
  {
    action: 'publish_video',
    points: 5,
    description: '发布攻略视频',
    icon: '📹',
    limit: '每天最多3次',
  },
  {
    action: 'video_like',
    points: 1,
    description: '视频获得点赞',
    icon: '❤️',
    limit: '每个点赞1分',
  },
  {
    action: 'video_share',
    points: 3,
    description: '视频被分享',
    icon: '📤',
  },
  {
    action: 'first_order_bonus',
    points: 50,
    description: '完成首单奖励',
    icon: '🎁',
    limit: '仅一次',
  },
  {
    action: 'monthly_top10',
    points: 100,
    description: '月度Top10奖励',
    icon: '🏅',
    limit: '每月评选',
  },
  {
    action: 'user_favorite',
    points: 5,
    description: '被用户收藏',
    icon: '💖',
  },
  {
    action: 'perfect_attendance',
    points: 30,
    description: '月度全勤奖',
    icon: '📅',
    limit: '每月一次',
  },
];

// 积分扣除规则
export const POINTS_DEDUCTIONS: PointsRule[] = [
  {
    action: 'cancel_order',
    points: -20,
    description: '取消已接订单',
    icon: '❌',
  },
  {
    action: 'complaint',
    points: -50,
    description: '被投诉（核实后）',
    icon: '⚠️',
  },
  {
    action: 'low_rating',
    points: -10,
    description: '获得一星/二星差评',
    icon: '😞',
  },
  {
    action: 'late_response',
    points: -5,
    description: '消息响应超时',
    icon: '⏰',
  },
];

/**
 * 根据积分获取等级信息
 */
export function getPointsLevel(points: number): PointsLevel {
  for (let i = POINTS_LEVELS.length - 1; i >= 0; i--) {
    const level = POINTS_LEVELS[i];
    if (points >= level.minPoints) {
      return level;
    }
  }
  return POINTS_LEVELS[0];
}

/**
 * 获取下一等级信息
 */
export function getNextLevel(currentPoints: number): PointsLevel | null {
  const currentLevel = getPointsLevel(currentPoints);
  const nextLevelIndex = POINTS_LEVELS.findIndex((l) => l.level === currentLevel.level) + 1;
  return nextLevelIndex < POINTS_LEVELS.length ? POINTS_LEVELS[nextLevelIndex] : null;
}

/**
 * 计算到下一等级所需积分
 */
export function getPointsToNextLevel(currentPoints: number): number {
  const nextLevel = getNextLevel(currentPoints);
  return nextLevel ? nextLevel.minPoints - currentPoints : 0;
}

/**
 * 计算等级进度百分比
 */
export function getLevelProgress(points: number): number {
  const currentLevel = getPointsLevel(points);
  if (currentLevel.maxPoints === Infinity) {
    return 100;
  }
  const range = currentLevel.maxPoints - currentLevel.minPoints + 1;
  const progress = points - currentLevel.minPoints;
  return Math.min(100, (progress / range) * 100);
}

/**
 * 根据积分计算实际收入（扣除平台抽成后）
 */
export function calculateActualEarnings(points: number, hourlyRate: number): {
  commission: number;
  actualEarnings: number;
  commissionRate: number;
} {
  const level = getPointsLevel(points);
  const commission = hourlyRate * level.commission;
  const actualEarnings = hourlyRate - commission;
  return {
    commission,
    actualEarnings,
    commissionRate: level.commission,
  };
}

/**
 * 验证价格是否在允许范围内
 */
export function isPriceValid(points: number, hourlyRate: number): boolean {
  const level = getPointsLevel(points);
  return hourlyRate >= 30 && hourlyRate <= level.priceLimit;
}

/**
 * 获取所有等级列表（用于展示等级体系）
 */
export function getAllLevels(): PointsLevel[] {
  return POINTS_LEVELS;
}

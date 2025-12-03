// 旅行管家等级系统

export type GuideLevel = 'junior' | 'intermediate' | 'senior' | 'gold';

export interface GuideLevelInfo {
  level: GuideLevel;
  name: string;
  color: string;
  bgColor: string;
  icon: string;
  baseCommissionRate: number; // 基础抽成比例
  priceRange: { min: number; max: number }; // 定价区间（元/小时）
  minPoints: number;
  maxPoints: number | null;
}

// 等级配置
export const GUIDE_LEVELS: Record<GuideLevel, GuideLevelInfo> = {
  junior: {
    level: 'junior',
    name: '初级',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: '🌱',
    baseCommissionRate: 20,
    priceRange: { min: 30, max: 80 },
    minPoints: 0,
    maxPoints: 100,
  },
  intermediate: {
    level: 'intermediate',
    name: '中级',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: '⭐',
    baseCommissionRate: 18,
    priceRange: { min: 50, max: 120 },
    minPoints: 101,
    maxPoints: 300,
  },
  senior: {
    level: 'senior',
    name: '高级',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: '💎',
    baseCommissionRate: 15,
    priceRange: { min: 50, max: 200 },
    minPoints: 301,
    maxPoints: 600,
  },
  gold: {
    level: 'gold',
    name: '金牌',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    icon: '👑',
    baseCommissionRate: 12,
    priceRange: { min: 50, max: 300 },
    minPoints: 601,
    maxPoints: null,
  },
};

// 积分规则
export const POINTS_RULES = {
  ORDER_COMPLETED: 5, // 每完成1单
  GOOD_REVIEW: 3, // 每获得1个好评
  PHOTOGRAPHY_EQUIPMENT: 50, // 提供摄影设备（一次性）
  VEHICLE_PROVIDED: 80, // 提供车辆（一次性）
};

// 认证优惠比例
export const VERIFICATION_DISCOUNT = 0.2; // 20%折扣

/**
 * 根据积分计算等级
 */
export function calculateLevel(points: number): GuideLevel {
  if (points >= GUIDE_LEVELS.gold.minPoints) return 'gold';
  if (points >= GUIDE_LEVELS.senior.minPoints) return 'senior';
  if (points >= GUIDE_LEVELS.intermediate.minPoints) return 'intermediate';
  return 'junior';
}

/**
 * 计算实际抽成比例
 */
export function calculateCommissionRate(level: GuideLevel, isVerified: boolean): number {
  const baseRate = GUIDE_LEVELS[level].baseCommissionRate;
  if (isVerified) {
    return baseRate * (1 - VERIFICATION_DISCOUNT);
  }
  return baseRate;
}

/**
 * 计算积分
 */
export function calculatePoints(
  orderCount: number,
  goodReviewCount: number,
  hasPhotography: boolean,
  hasVehicle: boolean
): number {
  let points = 0;
  
  // 订单积分
  points += orderCount * POINTS_RULES.ORDER_COMPLETED;
  
  // 好评积分
  points += goodReviewCount * POINTS_RULES.GOOD_REVIEW;
  
  // 设备积分
  if (hasPhotography) {
    points += POINTS_RULES.PHOTOGRAPHY_EQUIPMENT;
  }
  
  // 车辆积分
  if (hasVehicle) {
    points += POINTS_RULES.VEHICLE_PROVIDED;
  }
  
  return points;
}

/**
 * 获取下一等级所需积分
 */
export function getPointsToNextLevel(currentPoints: number): number | null {
  const currentLevel = calculateLevel(currentPoints);
  
  if (currentLevel === 'gold') {
    return null; // 已经是最高等级
  }
  
  const nextLevelMap: Record<GuideLevel, GuideLevel | null> = {
    junior: 'intermediate',
    intermediate: 'senior',
    senior: 'gold',
    gold: null,
  };
  
  const nextLevel = nextLevelMap[currentLevel];
  if (!nextLevel) return null;
  
  return GUIDE_LEVELS[nextLevel].minPoints - currentPoints;
}

/**
 * 获取等级进度百分比
 */
export function getLevelProgress(points: number): number {
  const level = calculateLevel(points);
  const levelInfo = GUIDE_LEVELS[level];
  
  if (!levelInfo.maxPoints) {
    return 100; // 最高等级
  }
  
  const range = levelInfo.maxPoints - levelInfo.minPoints;
  const current = points - levelInfo.minPoints;
  
  return Math.min(100, (current / range) * 100);
}

/**
 * 格式化抽成比例显示
 */
export function formatCommissionRate(rate: number): string {
  return `${rate.toFixed(1)}%`;
}

/**
 * 获取定价区间
 */
export function getPriceRange(level: GuideLevel): { min: number; max: number } {
  return GUIDE_LEVELS[level].priceRange;
}

/**
 * 格式化定价区间显示
 */
export function formatPriceRange(level: GuideLevel): string {
  const { min, max } = GUIDE_LEVELS[level].priceRange;
  return `¥${min}-${max}/小时`;
}

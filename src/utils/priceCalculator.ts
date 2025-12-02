// 地陪服务价格计算

export interface PriceBreakdown {
  baseDays: number;           // 预约天数
  hoursPerDay: number;        // 每天小时数
  totalHours: number;         // 总小时数
  pricePerHour: number;       // 每小时价格
  basePrice: number;          // 基础价格
  discountRate: number;       // 折扣率
  discountAmount: number;     // 折扣金额
  finalPrice: number;         // 最终价格
}

// 价格配置
const PRICING = {
  // 基础价格（元/小时）
  HOURLY_RATE: 40,
  
  // 快捷时段固定价格
  MORNING_PRICE: 160,      // 上午 (8:00-12:00, 4小时)
  AFTERNOON_PRICE: 200,    // 下午 (13:00-18:00, 5小时)
  FULL_DAY_PRICE: 350,     // 全天 (8:00-21:00, 13小时)
  
  // 折扣配置
  DISCOUNTS: {
    DAYS_3_OR_MORE: 0.1,   // 3天及以上 9折
    DAYS_5_OR_MORE: 0.15,  // 5天及以上 85折
    DAYS_7_OR_MORE: 0.2,   // 7天及以上 8折
  },
  
  // 时长档位价格（小时数: 价格）
  DURATION_TIERS: {
    3: 120,   // 3小时
    4: 160,   // 4小时
    5: 200,   // 5小时
    6: 240,   // 6小时
    7: 280,   // 7小时
    8: 320,   // 8小时
    9: 360,   // 9小时
    10: 400,  // 10小时
    11: 440,  // 11小时
    12: 480,  // 12小时
    13: 520,  // 13小时 (全天)
  }
};

/**
 * 计算服务价格
 * @param days 预约天数
 * @param startHour 开始时间（小时）
 * @param endHour 结束时间（小时）
 * @returns 价格详情
 */
export function calculatePrice(
  days: number,
  startHour: number,
  endHour: number
): PriceBreakdown {
  const hoursPerDay = endHour - startHour;
  const totalHours = days * hoursPerDay;
  
  // 检查是否是快捷时段
  let pricePerDay = 0;
  
  // 全天 (8:00-21:00, 13小时)
  if (startHour === 8 && endHour === 21) {
    pricePerDay = PRICING.FULL_DAY_PRICE;
  }
  // 上午 (8:00-12:00, 4小时)
  else if (startHour === 8 && endHour === 12) {
    pricePerDay = PRICING.MORNING_PRICE;
  }
  // 下午 (13:00-18:00, 5小时)
  else if (startHour === 13 && endHour === 18) {
    pricePerDay = PRICING.AFTERNOON_PRICE;
  }
  // 自定义时段，使用档位价格或按小时计费
  else {
    if (hoursPerDay in PRICING.DURATION_TIERS) {
      pricePerDay = PRICING.DURATION_TIERS[hoursPerDay as keyof typeof PRICING.DURATION_TIERS];
    } else {
      // 超过13小时按13小时计算，低于3小时按3小时计算
      const billableHours = Math.max(3, Math.min(hoursPerDay, 13));
      pricePerDay = billableHours * PRICING.HOURLY_RATE;
    }
  }
  
  // 基础价格
  const basePrice = pricePerDay * days;
  
  // 计算折扣
  let discountRate = 0;
  if (days >= 7) {
    discountRate = PRICING.DISCOUNTS.DAYS_7_OR_MORE;
  } else if (days >= 5) {
    discountRate = PRICING.DISCOUNTS.DAYS_5_OR_MORE;
  } else if (days >= 3) {
    discountRate = PRICING.DISCOUNTS.DAYS_3_OR_MORE;
  }
  
  const discountAmount = Math.floor(basePrice * discountRate);
  const finalPrice = basePrice - discountAmount;
  
  return {
    baseDays: days,
    hoursPerDay,
    totalHours,
    pricePerHour: PRICING.HOURLY_RATE,
    basePrice,
    discountRate,
    discountAmount,
    finalPrice,
  };
}

/**
 * 格式化价格显示
 * @param price 价格
 * @returns 格式化后的价格字符串
 */
export function formatPrice(price: number): string {
  return `¥${price}`;
}

/**
 * 获取折扣文本
 * @param days 天数
 * @returns 折扣文本
 */
export function getDiscountText(days: number): string {
  if (days >= 7) {
    return '7天及以上享8折优惠';
  } else if (days >= 5) {
    return '5天及以上享85折优惠';
  } else if (days >= 3) {
    return '3天及以上享9折优惠';
  }
  return '';
}

/**
 * 获取时段名称
 * @param startHour 开始时间
 * @param endHour 结束时间
 * @returns 时段名称
 */
export function getTimePeriodName(startHour: number, endHour: number): string {
  if (startHour === 8 && endHour === 21) {
    return '全天';
  } else if (startHour === 8 && endHour === 12) {
    return '上午';
  } else if (startHour === 13 && endHour === 18) {
    return '下午';
  }
  return '自定义时段';
}

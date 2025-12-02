// 丽江聚集点位置数据
export interface MeetingPoint {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
}

export const meetingPoints: MeetingPoint[] = [
  {
    id: 'gucheng-dashuiche',
    name: '丽江古城-大水车',
    address: '云南省丽江市古城区大研古城入口',
    latitude: 26.8774,
    longitude: 100.2298,
    description: '丽江古城标志性建筑，交通便利，易于寻找'
  },
  {
    id: 'gucheng-sifangjie',
    name: '丽江古城-四方街',
    address: '云南省丽江市古城区四方街',
    latitude: 26.8750,
    longitude: 100.2320,
    description: '古城中心广场，周边商铺林立'
  },
  {
    id: 'shuhe-rukou',
    name: '束河古镇-入口',
    address: '云南省丽江市古城区束河古镇入口',
    latitude: 26.9140,
    longitude: 100.2510,
    description: '束河古镇主入口，停车方便'
  },
  {
    id: 'yulong-youke',
    name: '玉龙雪山游客中心',
    address: '云南省丽江市玉龙纳西族自治县玉龙雪山景区',
    latitude: 27.1195,
    longitude: 100.2420,
    description: '雪山景区官方游客中心'
  },
  {
    id: 'keyunzhan',
    name: '丽江高快客运站',
    address: '云南省丽江市古城区康仲路',
    latitude: 26.8560,
    longitude: 100.2250,
    description: '丽江主要客运站，适合外地游客'
  },
  {
    id: 'airport',
    name: '丽江三义国际机场',
    address: '云南省丽江市古城区七河乡',
    latitude: 26.6800,
    longitude: 100.2460,
    description: '机场到达厅出口'
  },
  {
    id: 'wangfu',
    name: '丽江木府',
    address: '云南省丽江市古城区大研古城光义街官院巷',
    latitude: 26.8730,
    longitude: 100.2340,
    description: '纳西族土司府邸，古城内重要景点'
  },
  {
    id: 'mufu',
    name: '黑龙潭公园',
    address: '云南省丽江市古城区民主路1号',
    latitude: 26.8890,
    longitude: 100.2380,
    description: '丽江著名公园，可远眺玉龙雪山'
  }
];

// 计算两个经纬度之间的距离（单位：公里）
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // 地球半径（公里）
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // 保留一位小数
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// 格式化距离显示
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km}km`;
}

// 根据ID获取聚集点
export function getMeetingPointById(id: string): MeetingPoint | undefined {
  return meetingPoints.find(point => point.id === id);
}

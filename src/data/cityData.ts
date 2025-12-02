// 城市景点和美食数据配置

export interface Attraction {
  id: number;
  name: string;
  image: string;
  description: string;
  rating: number;
  location: string;
}

export interface Food {
  id: number;
  name: string;
  image: string;
  description: string;
  price: string;
  rating: number;
  restaurant: string;
}

export interface CityData {
  cityName: string;
  cityCode: string;
  province: string;
  location: {
    latitude: number;
    longitude: number;
  };
  attractions: Attraction[];
  foods: Food[];
}

// 丽江市数据
const lijiangData: CityData = {
  cityName: '丽江',
  cityCode: 'lijiang',
  province: '云南省',
  location: {
    latitude: 26.8774,
    longitude: 100.2298,
  },
  attractions: [
    {
      id: 1,
      name: '丽江古城',
      image: 'https://images.unsplash.com/photo-1704077393213-ec08ac53e3fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWppYW5nJTIwYW5jaWVudCUyMHRvd24lMjBjaGluYXxlbnwxfHx8fDE3NjQ2NjY1MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '世界文化遗产，纳西族文化的代表',
      rating: 4.8,
      location: '云南省丽江市古城区',
    },
    {
      id: 2,
      name: '玉龙雪山',
      image: 'https://images.unsplash.com/photo-1677922069769-0164b29e2c1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYWRlJTIwZHJhZ29uJTIwc25vdyUyMG1vdW50YWlufGVufDF8fHx8MTc2NDU5OTkwMHww&ixlib=rb-4.1.0&q=80&w=1080',
      description: '海拔5596米的雪山，四季积雪',
      rating: 4.7,
      location: '云南省丽江市玉龙纳西族自治县',
    },
    {
      id: 3,
      name: '束河古镇',
      image: 'https://images.unsplash.com/photo-1710176183906-0cdf2dd6f194?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaHVoZSUyMGFuY2llbnQlMjB0b3duJTIweXVubmFufGVufDF8fHx8MTc2NDY2NjUwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      description: '古朴宁静的纳西族聚居地',
      rating: 4.6,
      location: '云南省丽江市古城区',
    },
    {
      id: 4,
      name: '泸沽湖',
      image: 'https://images.unsplash.com/photo-1667568988110-ee8c867b1f38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdWd1JTIwbGFrZSUyMGNoaW5hfGVufDF8fHx8MTc2NDY2NjUwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      description: '高原明珠，摩梭族母系文化',
      rating: 4.9,
      location: '云南省丽江市宁蒗县',
    },
  ],
  foods: [
    {
      id: 1,
      name: '腊排骨火锅',
      image: 'https://images.unsplash.com/photo-1518879392561-b6d92a38e637?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwcHJlc2VydmVkJTIwcG9yayUyMHJpYnN8ZW58MXx8fHwxNzY0NjY2NTA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '丽江特色火锅，肉质鲜嫩',
      price: '¥68/人',
      rating: 4.7,
      restaurant: '阿妈腊排骨',
    },
    {
      id: 2,
      name: '鸡豆凉粉',
      image: 'https://images.unsplash.com/photo-1723561796007-2fcf547ec47d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwamVsbHklMjBub29kbGVzfGVufDF8fHx8MTc2NDY2NjUwOHww&ixlib=rb-4.1.0&q=80&w=1080',
      description: '纳西族传统小吃，口感Q弹',
      price: '¥8/份',
      rating: 4.5,
      restaurant: '88号小吃店',
    },
    {
      id: 3,
      name: '纳西烤鱼',
      image: 'https://images.unsplash.com/photo-1708388464725-5c62c6e4574d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwZ3JpbGxlZCUyMGZpc2h8ZW58MXx8fHwxNzY0NjY2NTA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '特色烤鱼，香辣可口',
      price: '¥58/条',
      rating: 4.6,
      restaurant: '老字号烤鱼',
    },
    {
      id: 4,
      name: '丽江粑粑',
      image: 'https://images.unsplash.com/photo-1756137943313-fdea9bce6bdd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwZmxhdGJyZWFkJTIwcGFzdHJ5fGVufDF8fHx8MTc2NDY2NjUwOXww&ixlib=rb-4.1.0&q=80&w=1080',
      description: '传统小吃，酥脆香甜',
      price: '¥10/个',
      rating: 4.4,
      restaurant: '百年粑粑店',
    },
  ],
};

// 昆明市数据
const kunmingData: CityData = {
  cityName: '昆明',
  cityCode: 'kunming',
  province: '云南省',
  location: {
    latitude: 25.0389,
    longitude: 102.7183,
  },
  attractions: [
    {
      id: 11,
      name: '石林风景区',
      image: 'https://images.unsplash.com/photo-1711886943210-beca23793689?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9uZSUyMGZvcmVzdCUyMGt1bm1pbmd8ZW58MXx8fHwxNzY0NjY2NTEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '世界自然遗产，喀斯特地貌奇观',
      rating: 4.7,
      location: '云南省昆明市石林县',
    },
    {
      id: 12,
      name: '滇池',
      image: 'https://images.unsplash.com/photo-1715911753891-fb35e3d1569b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFuY2hpJTIwbGFrZSUyMGt1bm1pbmd8ZW58MXx8fHwxNzY0NjY2NTE0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '高原湖泊，红嘴鸥越冬地',
      rating: 4.5,
      location: '云南省昆明市西山区',
    },
    {
      id: 13,
      name: '翠湖公园',
      image: 'https://images.unsplash.com/photo-1731917834394-c09087c981d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWlodSUyMHBhcmslMjBrdW5taW5nfGVufDF8fHx8MTc2NDY2NjUxNHww&ixlib=rb-4.1.0&q=80&w=1080',
      description: '市中心绿肺，海鸥聚集地',
      rating: 4.6,
      location: '云南省昆明市五华区',
    },
    {
      id: 14,
      name: '西山龙门',
      image: 'https://images.unsplash.com/photo-1751869430713-767325e000dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx4aXNoYW4lMjBkcmFnb24lMjBnYXRlfGVufDF8fHx8MTc2NDY2NjUxNXww&ixlib=rb-4.1.0&q=80&w=1080',
      description: '俯瞰滇池的绝佳观景点',
      rating: 4.4,
      location: '云南省昆明市西山区',
    },
  ],
  foods: [
    {
      id: 11,
      name: '过桥米线',
      image: 'https://images.unsplash.com/photo-1751495225564-2febb2409b5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9zc2luZyUyMGJyaWRnZSUyMG5vb2RsZXN8ZW58MXx8fHwxNzY0NjY2NTE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '云南特色美食，汤鲜味美',
      price: '¥38/碗',
      rating: 4.8,
      restaurant: '桥香园',
    },
    {
      id: 12,
      name: '汽锅鸡',
      image: 'https://images.unsplash.com/photo-1725445295556-e65c10c91403?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwc3RlYW0lMjBwb3QlMjBjaGlja2VufGVufDF8fHx8MTc2NDY2NjUxNXww&ixlib=rb-4.1.0&q=80&w=1080',
      description: '云南名菜，原汁原味',
      price: '¥88/份',
      rating: 4.7,
      restaurant: '福照楼',
    },
    {
      id: 13,
      name: '烧饵块',
      image: 'https://images.unsplash.com/photo-1763218412758-1539a5cb9237?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwcmljZSUyMGNha2VzJTIwY2hpbmVzZXxlbnwxfHx8fDE3NjQ2NjY1MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '昆明特色早点，软糯香甜',
      price: '¥8/份',
      rating: 4.5,
      restaurant: '老昆明小吃',
    },
    {
      id: 14,
      name: '宜良烤鸭',
      image: 'https://images.unsplash.com/photo-1722411488140-f0beb2521814?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FzdGVkJTIwZHVjayUyMGNoaW5lc2V8ZW58MXx8fHwxNzY0NTk0ODMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '昆明特色烤鸭，皮脆肉嫩',
      price: '¥68/只',
      rating: 4.6,
      restaurant: '宜良烤鸭店',
    },
  ],
};

// 大理市数据
const daliData: CityData = {
  cityName: '大理',
  cityCode: 'dali',
  province: '云南省',
  location: {
    latitude: 25.6065,
    longitude: 100.2676,
  },
  attractions: [
    {
      id: 21,
      name: '洱海',
      image: 'https://images.unsplash.com/photo-1715468932667-84581433613e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlcmhhaSUyMGxha2UlMjBkYWxpfGVufDF8fHx8MTc2NDY2NjUyMXww&ixlib=rb-4.1.0&q=80&w=1080',
      description: '高原湖泊，风花雪月四景之一',
      rating: 4.8,
      location: '云南省大理市',
    },
    {
      id: 22,
      name: '大理古城',
      image: 'https://images.unsplash.com/photo-1740028956665-cc496b5649cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWxpJTIwYW5jaWVudCUyMGNpdHl8ZW58MXx8fHwxNzY0NjY2NTIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '南诏国和大理国的都城遗址',
      rating: 4.7,
      location: '云南省大理市大理古城',
    },
    {
      id: 23,
      name: '苍山',
      image: 'https://images.unsplash.com/photo-1558519054-c5f29d0af766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5nc2hhbiUyMG1vdW50YWluJTIwZGFsaXxlbnwxfHx8fDE3NjQ2NjY1MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '云岭山脉南端主峰，四季风景如画',
      rating: 4.6,
      location: '云南省大理市',
    },
    {
      id: 24,
      name: '崇圣寺三塔',
      image: 'https://images.unsplash.com/photo-1646186605390-405f475df5f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aHJlZSUyMHBhZ29kYXMlMjBkYWxpfGVufDF8fHx8MTc2NDY2NjUyMnww&ixlib=rb-4.1.0&q=80&w=1080',
      description: '大理标志性建筑，千年古塔',
      rating: 4.7,
      location: '云南省���理市大理古城北',
    },
  ],
  foods: [
    {
      id: 21,
      name: '白族三道茶',
      image: 'https://images.unsplash.com/photo-1531969179221-3946e6b5a5e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwdGVhJTIwY2VyZW1vbnl8ZW58MXx8fHwxNzY0NTgxNDIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '白族待客礼仪，一苦二甜三回味',
      price: '¥28/人',
      rating: 4.6,
      restaurant: '古城茶馆',
    },
    {
      id: 22,
      name: '大理乳扇',
      image: 'https://images.unsplash.com/photo-1686998423980-ab223d183055?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwbWlsayUyMGNoZWVzZXxlbnwxfHx8fDE3NjQ2NjY1MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '白族特色奶制品，香脆可口',
      price: '¥15/份',
      rating: 4.5,
      restaurant: '喜洲古镇',
    },
    {
      id: 23,
      name: '酸辣鱼',
      image: 'https://images.unsplash.com/photo-1760390952094-d27868dada6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwc291ciUyMHNwaWN5JTIwZmlzaHxlbnwxfHx8fDE3NjQ2NjY1MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '洱海特色菜，酸辣开胃',
      price: '¥78/份',
      rating: 4.7,
      restaurant: '洱海渔家',
    },
    {
      id: 24,
      name: '烤乳���',
      image: 'https://images.unsplash.com/photo-1621523131979-27661bcda8f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwY2hlZXNlJTIwc25hY2t8ZW58MXx8fHwxNzY0NjY2NTI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '街头小吃，现烤现吃',
      price: '¥10/份',
      rating: 4.4,
      restaurant: '古城小吃街',
    },
  ],
};

// 香格里拉市数据
const shangrilaData: CityData = {
  cityName: '香格里拉',
  cityCode: 'shangrila',
  province: '云南省',
  location: {
    latitude: 27.8292,
    longitude: 99.7068,
  },
  attractions: [
    {
      id: 31,
      name: '普达措国家公园',
      image: 'https://images.unsplash.com/photo-1707989467887-81318e5bf04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdWRhY3VvJTIwbmF0aW9uYWwlMjBwYXJrfGVufDF8fHx8MTc2NDY2NjUyOHww&ixlib=rb-4.1.0&q=80&w=1080',
      description: '中国大陆首个国家公园，高原湿地',
      rating: 4.8,
      location: '云南省迪庆州香格里拉市',
    },
    {
      id: 32,
      name: '松赞林寺',
      image: 'https://images.unsplash.com/photo-1759626507894-68a2c5cbc20a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb25nemFubGluJTIwbW9uYXN0ZXJ5fGVufDF8fHx8MTc2NDY2NjUyOXww&ixlib=rb-4.1.0&q=80&w=1080',
      description: '云南最大的藏传佛教寺院',
      rating: 4.7,
      location: '云南省迪庆州香格里拉市',
    },
    {
      id: 33,
      name: '独克宗古城',
      image: 'https://images.unsplash.com/photo-1609478654983-8a8e18ddc5ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWtlem9uZyUyMGFuY2llbnQlMjBjaXR5fGVufDF8fHx8MTc2NDY2NjUyOXww&ixlib=rb-4.1.0&q=80&w=1080',
      description: '茶马古道上的重镇，藏族文化',
      rating: 4.5,
      location: '云南省迪庆州香格里拉市',
    },
    {
      id: 34,
      name: '梅里雪山',
      image: 'https://images.unsplash.com/photo-1693869189333-7befe88938f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWlsaSUyMHNub3clMjBtb3VudGFpbnxlbnwxfHx8fDE3NjQ2NjY1MzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '藏区八大神山之首，日照金山',
      rating: 4.9,
      location: '云南省迪庆州德钦县',
    },
  ],
  foods: [
    {
      id: 31,
      name: '酥油茶',
      image: 'https://images.unsplash.com/photo-1602964573801-f10e614849ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWJldGFuJTIwYnV0dGVyJTIwdGVhfGVufDF8fHx8MTc2NDY2NjUzMHww&ixlib=rb-4.1.0&q=80&w=1080',
      description: '藏族传统饮品，香醇可口',
      price: '¥15/壶',
      rating: 4.5,
      restaurant: '藏式茶馆',
    },
    {
      id: 32,
      name: '牦牛肉火锅',
      image: 'https://images.unsplash.com/photo-1668627631641-804af7ce4a5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5YWslMjBtZWF0JTIwaG90cG90fGVufDF8fHx8MTc2NDY2NjUzMHww&ixlib=rb-4.1.0&q=80&w=1080',
      description: '高原特色，肉质鲜美',
      price: '¥98/人',
      rating: 4.7,
      restaurant: '香格里拉藏餐',
    },
    {
      id: 33,
      name: '青稞饼',
      image: 'https://images.unsplash.com/photo-1593242523486-8d5aa22f3a25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJsZXklMjBjYWtlJTIwdGliZXRhbnxlbnwxfHx8fDE3NjQ2NjY1MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '藏族主食，营养丰富',
      price: '¥12/份',
      rating: 4.4,
      restaurant: '古城小吃',
    },
    {
      id: 34,
      name: '藏式糌粑',
      image: 'https://images.unsplash.com/photo-1613810354511-16c396170326?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWJldGFuJTIwdHNhbXBhJTIwZm9vZHxlbnwxfHx8fDE3NjQ2NjY1MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '藏族传统食品，能量补充',
      price: '¥8/份',
      rating: 4.3,
      restaurant: '藏家美食',
    },
  ],
};

// 成都市数据
const chengduData: CityData = {
  cityName: '成都',
  cityCode: 'chengdu',
  province: '四川省',
  location: {
    latitude: 30.5728,
    longitude: 104.0668,
  },
  attractions: [
    {
      id: 41,
      name: '宽窄巷子',
      image: 'https://images.unsplash.com/photo-1621575898452-52e0b64970f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVuZ2R1JTIwa3VhbnpoYWklMjBhbGxleXxlbnwxfHx8fDE3NjQ2NjY1MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '成都历史文化名片，巴蜀文化',
      rating: 4.6,
      location: '四川省成都市青羊区',
    },
    {
      id: 42,
      name: '大熊猫基地',
      image: 'https://images.unsplash.com/photo-1685353258330-9151d013ce94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVuZ2R1JTIwcGFuZGElMjBiYXNlfGVufDF8fHx8MTc2NDY2NjUzNnww&ixlib=rb-4.1.0&q=80&w=1080',
      description: '全球最大的熊猫繁育研究基地',
      rating: 4.9,
      location: '四川省成都市成华区',
    },
    {
      id: 43,
      name: '锦里古街',
      image: 'https://images.unsplash.com/photo-1603459771691-d4022336e755?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqaW5saSUyMGFuY2llbnQlMjBzdHJlZXR8ZW58MXx8fHwxNzY0NjY2NTM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '三国文化主题街区，美食天堂',
      rating: 4.5,
      location: '四川省成都市武侯区',
    },
    {
      id: 44,
      name: '武侯祠',
      image: 'https://images.unsplash.com/photo-1759498557990-c57dca82123e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW1wbGUlMjBzaHJpbmUlMjB0cmFkaXRpb25hbCUyMGNoaW5lc2V8ZW58MXx8fHwxNzY0NjY2NTQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '纪念诸葛亮的祠堂，三国文化',
      rating: 4.7,
      location: '四川省成都市武侯区',
    },
  ],
  foods: [
    {
      id: 41,
      name: '火锅',
      image: 'https://images.unsplash.com/photo-1666278172017-ad93e14c329d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWNodWFuJTIwaG90cG90fGVufDF8fHx8MTc2NDY2NjUzN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      description: '麻辣鲜香，成都美食代表',
      price: '¥88/人',
      rating: 4.9,
      restaurant: '蜀大侠火锅',
    },
    {
      id: 42,
      name: '担担面',
      image: 'https://images.unsplash.com/photo-1685209743819-dab6a8a853e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5kYW4lMjBub29kbGVzfGVufDF8fHx8MTc2NDY2NjUzN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      description: '四川传统小吃，麻辣鲜香',
      price: '¥12/碗',
      rating: 4.6,
      restaurant: '老字号面馆',
    },
    {
      id: 43,
      name: '龙抄手',
      image: 'https://images.unsplash.com/photo-1651783078053-fc9e8f2ed0e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwd29udG9uJTIwc291cHxlbnwxfHx8fDE3NjQ2NjY1Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '成都特色抄手，皮薄馅嫩',
      price: '¥18/碗',
      rating: 4.7,
      restaurant: '龙抄手总店',
    },
    {
      id: 44,
      name: '夫妻肺片',
      image: 'https://images.unsplash.com/photo-1741004580304-bda757783289?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwY29sZCUyMGJlZWYlMjBkaXNofGVufDF8fHx8MTc2NDY2NjU0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      description: '川菜经典凉菜，麻辣鲜香',
      price: '¥38/份',
      rating: 4.8,
      restaurant: '夫妻肺片店',
    },
  ],
};

// 重庆市数据
const chongqingData: CityData = {
  cityName: '重庆',
  cityCode: 'chongqing',
  province: '重庆市',
  location: {
    latitude: 29.5630,
    longitude: 106.5516,
  },
  attractions: [
    {
      id: 51,
      name: '洪崖洞',
      image: 'https://images.unsplash.com/photo-1722520454823-c921e0bd8752?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob25neWFkb25nJTIwY2hvbmdxaW5nfGVufDF8fHx8MTc2NDY2NjU0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      description: '吊脚楼建筑群，夜景绝美',
      rating: 4.7,
      location: '重庆市渝中区',
    },
    {
      id: 52,
      name: '长江索道',
      image: 'https://images.unsplash.com/photo-1707562964332-17b12df6f241?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9uZ3FpbmclMjBjYWJsZSUyMGNhcnxlbnwxfHx8fDE3NjQ2NjY1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '横跨长江的空中巴士',
      rating: 4.6,
      location: '重庆市渝中区',
    },
    {
      id: 53,
      name: '解放碑',
      image: 'https://images.unsplash.com/photo-1717267729174-06b64f37b246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqaWVmYW5nYmVpJTIwY2hvbmdxaW5nfGVufDF8fHx8MTc2NDY2NjU0NHww&ixlib=rb-4.1.0&q=80&w=1080',
      description: '重庆地标，商业中心',
      rating: 4.5,
      location: '重庆市渝中区',
    },
    {
      id: 54,
      name: '武隆天生三桥',
      image: 'https://images.unsplash.com/photo-1582727385539-75b8af161c3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3dWxvbmclMjBuYXR1cmFsJTIwYnJpZGdlc3xlbnwxfHx8fDE3NjQ2NjY1NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '世界自然遗产，喀斯特奇观',
      rating: 4.8,
      location: '重庆市武隆区',
    },
  ],
  foods: [
    {
      id: 51,
      name: '重庆火锅',
      image: 'https://images.unsplash.com/photo-1611345157614-26d3bdd10c93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9uZ3FpbmclMjBzcGljeSUyMGhvdHBvdHxlbnwxfHx8fDE3NjQ2NjY1NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '麻辣鲜香，火锅之都',
      price: '¥98/人',
      rating: 4.9,
      restaurant: '刘一手火锅',
    },
    {
      id: 52,
      name: '小面',
      image: 'https://images.unsplash.com/photo-1628610688436-e635552020fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9uZ3FpbmclMjBzbWFsbCUyMG5vb2RsZXN8ZW58MXx8fHwxNzY0NjY2NTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '重庆特色早餐，麻辣爽口',
      price: '¥10/碗',
      rating: 4.7,
      restaurant: '老太婆摊摊面',
    },
    {
      id: 53,
      name: '酸辣粉',
      image: 'https://images.unsplash.com/photo-1679279726940-be5ce80c632c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3VyJTIwc3BpY3klMjBnbGFzcyUyMG5vb2RsZXN8ZW58MXx8fHwxNzY0NjY2NTUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '重庆街头小吃，酸辣开胃',
      price: '¥12/碗',
      rating: 4.6,
      restaurant: '好又来酸辣粉',
    },
    {
      id: 54,
      name: '毛血旺',
      image: 'https://images.unsplash.com/photo-1709252792317-53d4e2b2203b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwc3BpY3klMjBibG9vZCUyMGN1cmR8ZW58MXx8fHwxNzY0NjY2NTUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '重庆经典川菜，麻辣鲜香',
      price: '¥48/份',
      rating: 4.8,
      restaurant: '老字号川菜馆',
    },
  ],
};

// 所有城市数据集合
export const CITIES_DATA: CityData[] = [
  lijiangData,
  kunmingData,
  daliData,
  shangrilaData,
  chengduData,
  chongqingData,
];

// 热门城市（用于快捷选择）
export const HOT_CITIES = [
  { name: '丽江', code: 'lijiang' },
  { name: '昆明', code: 'kunming' },
  { name: '大理', code: 'dali' },
  { name: '香格里拉', code: 'shangrila' },
  { name: '成都', code: 'chengdu' },
  { name: '重庆', code: 'chongqing' },
];

/**
 * 根据城市代码获取城市数据
 */
export function getCityData(cityCode: string): CityData | undefined {
  return CITIES_DATA.find((city) => city.cityCode === cityCode);
}

/**
 * 根据城市名称获取城市数据
 */
export function getCityDataByName(cityName: string): CityData | undefined {
  return CITIES_DATA.find((city) => city.cityName === cityName || cityName.includes(city.cityName));
}

/**
 * 计算两个坐标之间的距离（公里）
 */
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 地球半径（公里）
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * 根据用户位置推荐最近的城市
 */
export function getNearestCity(latitude: number, longitude: number): CityData {
  let nearestCity = lijiangData;
  let minDistance = Infinity;

  for (const city of CITIES_DATA) {
    const distance = getDistance(
      latitude,
      longitude,
      city.location.latitude,
      city.location.longitude
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city;
    }
  }

  return nearestCity;
}

/**
 * 获取默认城市（丽江）
 */
export function getDefaultCity(): CityData {
  return lijiangData;
}

import { useState } from 'react';
import { MapPin, Star, Award, Search, MessageCircle, Shield, Navigation, Heart, SlidersHorizontal, ChevronDown, ChevronUp, Car, Calendar, Users, FileText, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { GuideDetail } from './GuideDetail';
import { ChatDialog } from './ChatDialog';
import { calculateLevel, calculatePoints, GUIDE_LEVELS, type GuideLevel } from '../utils/guideLevelSystem';

interface GuideOrdersProps {
  userLocation: { latitude: number; longitude: number; city?: string } | null;
  touristVerified?: boolean;
}

interface Guide {
  id: number;
  name: string;
  avatar: string;
  age: number;
  gender: string;
  rating: number;
  orderCount: number;
  skills: string[];
  introduction: string;
  servicePrice: string;
  location: string;
  languages: string[];
  isCertified?: boolean;
  reviews: Review[];
  hasVehicle?: boolean;
  vehicleType?: string;
  vehiclePrice?: number; // 车辆价格（按天计价）
  vehicleMileageLimit?: number; // 车辆每日里程限制（公里）
  grabbedTime?: string; // 抢单时间
  // 等级系统字段
  points?: number;
  level?: GuideLevel;
  isVerified?: boolean;
  hasPhotography?: boolean;
  goodReviewCount?: number;
}

interface Review {
  id: number;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  content: string;
  images?: string[];
}

// 生成示例评论
const generateReviews = (count: number): Review[] => {
  const reviewTemplates = [
    { userName: '张小姐', content: '非常专业的旅行管家，安排的行程很合理，拍照技术一流！强烈推荐！', rating: 5 },
    { userName: '李先生', content: '服务态度好，对丽江很熟悉，带我们去了很多本地人才知道的地方。', rating: 5 },
    { userName: '王女士', content: '很有耐心，讲解详细，孩子们都很喜欢。下次还会选择TA。', rating: 5 },
    { userName: '刘先生', content: '性价比高，时间安排灵活，是一次愉快的旅行体验。', rating: 4 },
    { userName: '陈小姐', content: '热情周到，推荐的美食都很不错，拍照也很用心。', rating: 5 },
    { userName: '赵先生', content: '专业靠谱，对历史文化了解深入，学到了很多知识。', rating: 5 },
  ];
  
  return reviewTemplates.slice(0, count).map((template, index) => ({
    id: index + 1,
    userName: template.userName,
    userAvatar: `https://images.unsplash.com/photo-${1500000000000 + index * 1000000}?w=100`,
    rating: template.rating,
    date: `2024-${11 - Math.floor(index / 2)}-${15 + index}`,
    content: template.content,
    images: index % 3 === 0 ? [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400'
    ] : undefined
  }));
};

const mockGuides: Guide[] = [
  {
    id: 1,
    name: '阿秀',
    avatar: 'https://images.unsplash.com/photo-1643646805556-350c057663dd?w=400',
    age: 26,
    gender: '女',
    rating: 4.9,
    orderCount: 156,
    skills: ['摄影高手', '美食专家', '古城达人'],
    introduction: '土生土长的丽江纳西族姑娘，擅长摄影和美食推荐',
    servicePrice: '100',
    location: '丽江古城',
    languages: ['普通话', '纳西语', '英语'],
    isCertified: true,
    reviews: generateReviews(6),
    hasVehicle: false,
    // 等级系统数据
    goodReviewCount: 140,
    hasPhotography: true,
    isVerified: true,
    points: calculatePoints(156, 140, true, false),
    level: calculateLevel(calculatePoints(156, 140, true, false))
  },
  {
    id: 2,
    name: '和师傅',
    avatar: 'https://images.unsplash.com/photo-1695800998493-ccff5ea292ea?w=400',
    age: 35,
    gender: '男',
    rating: 4.8,
    orderCount: 203,
    skills: ['自驾向导', '户外专家', '摄影达人'],
    introduction: '10年旅游服务经验，擅长自驾游和户外探险',
    servicePrice: '150',
    location: '丽江市区',
    languages: ['普通话', '纳西语'],
    reviews: generateReviews(6),
    hasVehicle: true,
    vehicleType: '别克GL8',
    vehiclePrice: 300,
    vehicleMileageLimit: 100,
    // 等级系统数据
    goodReviewCount: 180,
    hasPhotography: true,
    isVerified: true,
    points: calculatePoints(203, 180, true, true),
    level: calculateLevel(calculatePoints(203, 180, true, true))
  },
  {
    id: 3,
    name: '小米',
    avatar: 'https://images.unsplash.com/photo-1643646805556-350c057663dd?w=400',
    age: 24,
    gender: '女',
    rating: 4.9,
    orderCount: 89,
    skills: ['美食专家', '网红打卡', '拍照圣手'],
    introduction: '95后丽江妹子，擅长美食和ins风拍照',
    servicePrice: '80',
    location: '丽江古城',
    languages: ['普通话', '英语'],
    reviews: generateReviews(5),
    hasVehicle: false,
    // 等级系统数据
    goodReviewCount: 75,
    hasPhotography: true,
    isVerified: false,
    points: calculatePoints(89, 75, true, false),
    level: calculateLevel(calculatePoints(89, 75, true, false))
  },
  {
    id: 4,
    name: '老李',
    avatar: 'https://images.unsplash.com/photo-1695800998493-ccff5ea292ea?w=400',
    age: 45,
    gender: '男',
    rating: 4.7,
    orderCount: 312,
    skills: ['历史讲解', '文化专家', '资深导游'],
    introduction: '资深导游，对丽江历史文化有深入研究',
    servicePrice: '120',
    location: '丽江古城',
    languages: ['普通话', '纳西语', '英语'],
    isCertified: true,
    reviews: generateReviews(6),
    hasVehicle: true,
    vehicleType: '丰田汉兰达',
    vehiclePrice: 250,
    vehicleMileageLimit: 100,
    // 等级系统数据
    goodReviewCount: 280,
    hasPhotography: false,
    isVerified: true,
    points: calculatePoints(312, 280, false, true),
    level: calculateLevel(calculatePoints(312, 280, false, true))
  }
];

export function GuideOrders({ userLocation, touristVerified }: GuideOrdersProps) {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatGuide, setChatGuide] = useState<Guide | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSkill, setFilterSkill] = useState<string>('全部');
  const [filterCertified, setFilterCertified] = useState<string>('全部');
  const [filterGender, setFilterGender] = useState<string>('全部');
  const [filterPriceRange, setFilterPriceRange] = useState<string>('全部');
  const [filterVehicle, setFilterVehicle] = useState<string>('全部');
  const [filterLevel, setFilterLevel] = useState<string>('全部');
  const [showFilters, setShowFilters] = useState(false); // 默认隐藏
  const [showSkillsExpanded, setShowSkillsExpanded] = useState(false); // 专业技能默认收起
  const [localTouristVerified, setLocalTouristVerified] = useState(touristVerified);

  // 需求填写相关状态
  const [requestDate, setRequestDate] = useState('');
  const [requestTime, setRequestTime] = useState('全天');
  const [maleCount, setMaleCount] = useState(1);
  const [femaleCount, setFemaleCount] = useState(0);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isMatched, setIsMatched] = useState(false); // 是否已匹配
  const [grabbedGuides, setGrabbedGuides] = useState<Guide[]>([]); // 抢单的旅行管家列表
  
  // Tab切换
  const [activeTab, setActiveTab] = useState<'match' | 'browse'>('match'); // 'match'智能匹配 'browse'浏览旅行管家

  const allSkills = ['全部', '摄影高手', '美食专家', '历史讲解', '自驾向导', '户外专家'];
  const priceRanges = [
    { label: '全部', min: 0, max: Infinity },
    { label: '50元以下', min: 0, max: 50 },
    { label: '50-100元', min: 50, max: 100 },
    { label: '100-150元', min: 100, max: 150 },
    { label: '150-200元', min: 150, max: 200 },
    { label: '200元以上', min: 200, max: Infinity }
  ];

  // 智能匹配模式：根据筛选条件匹配旅行管家
  const matchedGuides = mockGuides.filter(guide => {
    const skillMatch = filterSkill === '全部' || guide.skills.includes(filterSkill);
    const certifiedMatch = filterCertified === '全部' || (filterCertified === '是' ? guide.isCertified : !guide.isCertified);
    const genderMatch = filterGender === '全部' || guide.gender === filterGender;
    
    // 价格筛选
    const price = parseInt(guide.servicePrice);
    const selectedPriceRange = priceRanges.find(range => range.label === filterPriceRange);
    const priceMatch = !selectedPriceRange || filterPriceRange === '全部' || 
      (price >= selectedPriceRange.min && price < selectedPriceRange.max);
    
    // 等级筛选
    const levelMatch = filterLevel === '全部' || (guide.level && GUIDE_LEVELS[guide.level].name === filterLevel);
    
    // 车辆筛选
    const vehicleMatch = filterVehicle === '全部' || 
      (filterVehicle === '有车' ? guide.hasVehicle : !guide.hasVehicle);
    
    return skillMatch && certifiedMatch && genderMatch && priceMatch && levelMatch && vehicleMatch;
  });

  // 浏览旅行管家模式：根据用户距离推荐（默认不受筛选器影响）
  const browseGuides = mockGuides.filter(guide => {
    // 仅在用户主动搜索或使用筛选器时才应用筛选
    if (searchQuery === '' && !showFilters) {
      // 初始状态：显示所有旅行管家，按评分和距离排序
      return true;
    }
    
    // 搜索匹配
    const searchMatch = searchQuery === '' || 
      guide.name.includes(searchQuery) || 
      guide.skills.some(skill => skill.includes(searchQuery));
    
    // 筛选器激活时的筛选条件
    if (showFilters) {
      const skillMatch = filterSkill === '全部' || guide.skills.includes(filterSkill);
      const certifiedMatch = filterCertified === '全部' || (filterCertified === '是' ? guide.isCertified : !guide.isCertified);
      const genderMatch = filterGender === '全部' || guide.gender === filterGender;
      
      const price = parseInt(guide.servicePrice);
      const selectedPriceRange = priceRanges.find(range => range.label === filterPriceRange);
      const priceMatch = !selectedPriceRange || filterPriceRange === '全部' || 
        (price >= selectedPriceRange.min && price < selectedPriceRange.max);
      
      const levelMatch = filterLevel === '全部' || (guide.level && GUIDE_LEVELS[guide.level].name === filterLevel);
      
      const vehicleMatch = filterVehicle === '全部' || 
        (filterVehicle === '有车' ? guide.hasVehicle : !guide.hasVehicle);
      
      return searchMatch && skillMatch && certifiedMatch && genderMatch && priceMatch && levelMatch && vehicleMatch;
    }
    
    return searchMatch;
  });

  // 浏览旅行管家模式：根据评分和订单数排序
  const sortedGuidesForBrowse = [...browseGuides].sort((a, b) => {
    // 假设所有旅行管家都在丽江市内，距离都比较近，主要根据评分排序
    // 评分高的排在前面
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    
    // 评分相同，则按订单数排序
    return b.orderCount - a.orderCount;
  });

  const featuredGuide = sortedGuidesForBrowse[0]; // 使用排序后的列表
  const otherGuides = sortedGuidesForBrowse.slice(1);

  const handleChatClick = (guide: Guide) => {
    setSelectedGuide(null);
    setChatGuide(guide);
    setShowChat(true);
  };

  const handleMatch = () => {
    if (!requestDate) {
      alert('请选择需要旅行管家的日期');
      return;
    }
    setIsMatched(true);
    
    // 模拟旅行管家抢单（实际项目中从后端获取）
    setTimeout(() => {
      // 模拟2位旅行管家抢单
      const grabbed: Guide[] = [
        {
          ...mockGuides[1], // 和师傅
          grabbedTime: new Date(Date.now() - 2 * 60 * 1000).toISOString() // 2分钟前抢单
        },
        {
          ...mockGuides[0], // 阿秀
          grabbedTime: new Date(Date.now() - 5 * 60 * 1000).toISOString() // 5分钟前抢单
        }
      ];
      setGrabbedGuides(grabbed);
    }, 2000); // 2秒后模拟抢单
    
    // 滚动到旅行管家列表
    setTimeout(() => {
      const element = document.getElementById('guide-list');
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const getTimeAgo = (timestamp: string) => {
    const now = Date.now();
    const time = new Date(timestamp).getTime();
    const diff = now - time;
    
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小时前`;
    
    const days = Math.floor(hours / 24);
    return `${days}天前`;
  };

  const handleQuickBook = (guide: Guide) => {
    if (!isMatched) {
      setSelectedGuide(guide);
    } else {
      // 直接预约逻辑
      alert(`正在为您预约${guide.name}\n\n日期：${requestDate}\n时间：${requestTime}\n同行人数：${maleCount + femaleCount}人（男${maleCount}人，女${femaleCount}人）${additionalNotes ? `\n补充说明：${additionalNotes}` : ''}\n\n地陪将在24小时内确认订单`);
    }
  };

  return (
    <div className="min-h-screen pb-4">
      {/* Tab 切换 */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl rounded-2xl"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-1.5 shadow-lg border border-white/20 grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setActiveTab('match')}
              className={`py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'match'
                  ? 'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-600 hover:bg-gray-50/50'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${activeTab === 'match' ? 'animate-pulse' : ''}`} />
              <span className="font-medium">智能匹配</span>
            </button>
            <button
              onClick={() => setActiveTab('browse')}
              className={`py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'browse'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                  : 'text-gray-600 hover:bg-gray-50/50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="font-medium">浏览旅行管家</span>
            </button>
          </div>
        </div>
      </div>

      {/* 智能匹配模式 */}
      {activeTab === 'match' && (
        <>
          {/* 需求填写区域 */}
          <div className="px-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-teal-500/20 blur-2xl rounded-3xl"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-3.5 shadow-xl border border-white/20">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <h3 className="text-base text-gray-800">填写需求 智能匹配</h3>
                  {isMatched && (
                    <span className="ml-auto text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2.5 py-0.5 rounded-full">
                      已匹配
                    </span>
                  )}
                </div>

                <div className="space-y-2.5">
                  {/* 日期和时间 */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="flex items-center gap-1 text-xs text-gray-600 mb-1.5">
                        <Calendar className="w-3 h-3" />
                        需要日期 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={requestDate}
                        onChange={(e) => setRequestDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-2.5 py-1.5 bg-gray-50/80 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-1 text-xs text-gray-600 mb-1.5">
                        <span className="text-sm">⏰</span>
                        时间段
                      </label>
                      <select
                        value={requestTime}
                        onChange={(e) => setRequestTime(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-gray-50/80 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                      >
                        <option value="全天">全天</option>
                        <option value="上午">上午</option>
                        <option value="下午">下午</option>
                        <option value="晚上">晚上</option>
                      </select>
                    </div>
                  </div>

                  {/* 同行人数 */}
                  <div>
                    <label className="flex items-center gap-1 text-xs text-gray-600 mb-1.5">
                      <Users className="w-3 h-3" />
                      同行人数
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-2 border border-blue-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">👨 男</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setMaleCount(Math.max(0, maleCount - 1))}
                              className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors shadow-sm text-xs"
                            >
                              -
                            </button>
                            <span className="text-xs text-gray-800 w-5 text-center">{maleCount}</span>
                            <button
                              onClick={() => setMaleCount(maleCount + 1)}
                              className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors shadow-sm text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-2 border border-pink-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">👩 女</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setFemaleCount(Math.max(0, femaleCount - 1))}
                              className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors shadow-sm text-xs"
                            >
                              -
                            </button>
                            <span className="text-xs text-gray-800 w-5 text-center">{femaleCount}</span>
                            <button
                              onClick={() => setFemaleCount(femaleCount + 1)}
                              className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors shadow-sm text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-1 text-center">
                      <span className="text-xs text-gray-600">
                        共 {maleCount + femaleCount} 人
                      </span>
                    </div>
                  </div>

                  {/* 筛选器 - 放在补充说明之前 */}
                  <div className="space-y-2">
                    {/* 平台认证和性别 */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gradient-to-br from-blue-50/50 to-white rounded-xl p-2 border border-blue-100/50">
                        <div className="flex items-center gap-1 mb-1.5">
                          <Shield className="w-3 h-3 text-blue-600" />
                          <h4 className="text-xs text-gray-700">平台认证</h4>
                        </div>
                        <div className="flex gap-1">
                          {['全部', '是', '否'].map((option) => (
                            <button
                              key={option}
                              onClick={() => setFilterCertified(option)}
                              className={`flex-1 py-1 rounded-lg text-xs transition-all ${
                                filterCertified === option
                                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm'
                                  : 'bg-white text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-pink-50/50 to-white rounded-xl p-2 border border-pink-100/50">
                        <h4 className="text-xs text-gray-700 mb-1.5">性别</h4>
                        <div className="flex gap-1">
                          {['全部', '男', '女'].map((option) => (
                            <button
                              key={option}
                              onClick={() => setFilterGender(option)}
                              className={`flex-1 py-1 rounded-lg text-xs transition-all ${
                                filterGender === option
                                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm'
                                  : 'bg-white text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 价格范围 */}
                    <div className="bg-gradient-to-br from-green-50/50 to-white rounded-xl p-2 border border-green-100/50">
                      <div className="flex items-center gap-1 mb-1.5">
                        <span className="text-sm">💰</span>
                        <h4 className="text-xs text-gray-700">价格范围</h4>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {priceRanges.map((range) => (
                          <button
                            key={range.label}
                            onClick={() => setFilterPriceRange(range.label)}
                            className={`px-2 py-1 rounded-lg text-xs transition-all ${
                              filterPriceRange === range.label
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 车辆情况 */}
                    <div className="bg-gradient-to-br from-orange-50/50 to-white rounded-xl p-2 border border-orange-100/50">
                      <div className="flex items-center gap-1 mb-1.5">
                        <Car className="w-3 h-3 text-orange-600" />
                        <h4 className="text-xs text-gray-700">车辆情况</h4>
                      </div>
                      <div className="flex gap-1">
                        {['全部', '有车', '无车'].map((option) => (
                          <button
                            key={option}
                            onClick={() => setFilterVehicle(option)}
                            className={`flex-1 px-3 py-1 rounded-lg text-xs transition-all ${
                              filterVehicle === option
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 专业技能 - 可折叠 */}
                    <div className="bg-gradient-to-br from-purple-50/50 to-white rounded-xl p-2 border border-purple-100/50">
                      <button
                        onClick={() => setShowSkillsExpanded(!showSkillsExpanded)}
                        className="w-full flex items-center justify-between mb-1.5"
                      >
                        <div className="flex items-center gap-1">
                          <span className="text-sm">⭐</span>
                          <h4 className="text-xs text-gray-700">专业技能</h4>
                          <span className="text-xs text-gray-500">
                            {filterSkill !== '全部' && `(${filterSkill})`}
                          </span>
                        </div>
                        {showSkillsExpanded ? (
                          <ChevronUp className="w-3 h-3 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-3 h-3 text-gray-500" />
                        )}
                      </button>
                      
                      {showSkillsExpanded && (
                        <div className="flex gap-1 flex-wrap animate-slide-down">
                          {allSkills.map((skill) => (
                            <button
                              key={skill}
                              onClick={() => setFilterSkill(skill)}
                              className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                                filterSkill === skill
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                                  : 'bg-white text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 补充说明 */}
                  <div>
                    <label className="flex items-center gap-1 text-xs text-gray-600 mb-1.5">
                      <FileText className="w-3 h-3" />
                      补充说明 <span className="text-gray-400">(选填)</span>
                    </label>
                    <textarea
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="例如：想去玉龙雪山、需要拍照、有小朋友..."
                      rows={2}
                      className="w-full px-2.5 py-1.5 bg-gray-50/80 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none placeholder:text-gray-400"
                    />
                  </div>

                  {/* 匹配按钮 */}
                  <button
                    onClick={handleMatch}
                    className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white py-2.5 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 group"
                  >
                    <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span className="text-sm">{isMatched ? '重新匹配' : '开始匹配'}</span>
                  </button>

                  {isMatched && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-2.5 flex items-start gap-2 animate-slide-down">
                      <span className="text-sm">✅</span>
                      <div className="flex-1">
                        <p className="text-xs text-green-800 mb-0.5">匹配成功！</p>
                        <p className="text-xs text-green-600">
                          为您推荐了 {matchedGuides.length} 位符合条件的旅行管家，点击旅行管家卡片即可快速预约
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 匹配结果旅行管家列表 - 仅在匹配成功后显示 */}
          {isMatched && matchedGuides.length > 0 && (
            <div className="px-4 mt-4 space-y-3" id="guide-list">
              {/* 抢单旅行管家列表 - 显示在匹配结果上方 */}
              {grabbedGuides.length > 0 && (
                <div className="relative animate-slide-down">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20 blur-2xl rounded-[2rem]"></div>
                  <div className="relative bg-white/90 backdrop-blur-xl rounded-[2rem] p-4 shadow-xl border border-white/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center animate-pulse">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-base text-gray-800">抢单旅行管家</h3>
                          <p className="text-xs text-gray-500">有 {grabbedGuides.length} 位旅行管家抢单成功</p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1 rounded-full shadow-lg shadow-orange-500/30">
                        优先推荐
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-3 mb-3 border border-orange-200">
                      <div className="flex items-start gap-2">
                        <span className="text-sm">🔥</span>
                        <div className="flex-1 text-xs text-orange-800">
                          <p className="font-medium mb-1">这些旅行管家主动抢单，响应更快！</p>
                          <p className="text-orange-700">按抢单时间顺序显示，越早抢单越靠前，建议优先选择</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {grabbedGuides
                        .sort((a, b) => {
                          const timeA = a.grabbedTime ? new Date(a.grabbedTime).getTime() : 0;
                          const timeB = b.grabbedTime ? new Date(b.grabbedTime).getTime() : 0;
                          return timeA - timeB;
                        })
                        .map((guide, index) => (
                          <button
                            key={guide.id}
                            onClick={() => setSelectedGuide(guide)}
                            className="w-full bg-gradient-to-br from-white via-orange-50/30 to-white rounded-2xl p-3.5 hover:shadow-xl transition-all group border-2 border-orange-200 relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0"></div>
                            
                            <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs shadow-lg shadow-orange-500/50">
                              #{index + 1}
                            </div>

                            <div className="flex gap-3.5 relative">
                              <div className="relative flex-shrink-0">
                                <div className="w-18 h-18 rounded-2xl overflow-hidden shadow-md ring-2 ring-orange-200">
                                  <ImageWithFallback
                                    src={guide.avatar}
                                    alt={guide.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                                {guide.isCertified && (
                                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                                    <Shield className="w-3 h-3 text-white" />
                                  </div>
                                )}
                                <div className="absolute -top-2 -left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap animate-pulse">
                                  {guide.grabbedTime && getTimeAgo(guide.grabbedTime)}抢单
                                </div>
                              </div>

                              <div className="flex-1 min-w-0 text-left">
                                <div className="flex items-start justify-between mb-0.5">
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <h4 className="text-sm text-gray-800">{guide.name}</h4>
                                      <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-1.5 py-0.5 rounded">
                                        已抢单
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-500">{guide.age}岁 · {guide.gender}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-gray-800">¥{guide.servicePrice}</div>
                                    <div className="text-xs text-gray-500">元/小时</div>
                                  </div>
                                </div>

                                <div className="flex gap-1.5 mb-1.5 flex-wrap">
                                  {guide.skills.slice(0, 3).map((skill, skillIndex) => (
                                    <span key={skillIndex} className="text-xs bg-gradient-to-r from-orange-500/10 to-red-500/10 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">
                                      {skill}
                                    </span>
                                  ))}
                                </div>

                                <div className="flex items-center gap-2.5">
                                  <div className="flex items-center gap-0.5">
                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    <span className="text-xs text-gray-700">{guide.rating}</span>
                                  </div>
                                  <div className="flex items-center gap-0.5">
                                    <Award className="w-3 h-3 text-orange-400" />
                                    <span className="text-xs text-gray-700">{guide.orderCount}单</span>
                                  </div>
                                  {guide.hasVehicle && (
                                    <div className="flex items-center gap-0.5">
                                      <Car className="w-3 h-3 text-green-500" />
                                      <span className="text-xs text-gray-700">{guide.vehicleType}</span>
                                    </div>
                                  )}
                                  <div className="ml-auto flex items-center gap-0.5 text-orange-600">
                                    <Sparkles className="w-3 h-3 animate-pulse" />
                                    <span className="text-xs font-medium">快速响应</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 智能匹配结果 */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-2xl rounded-[2rem]"></div>
                <div className="relative bg-white/90 backdrop-blur-xl rounded-[2rem] p-4 shadow-xl border border-white/20">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-base text-gray-800">智能匹配结果</h3>
                      <p className="text-xs text-gray-500">为您找到 {matchedGuides.length} 位旅行管家</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {matchedGuides.map((guide) => {
                      return (
                        <button
                          key={guide.id}
                          onClick={() => setSelectedGuide(guide)}
                          className="w-full bg-gradient-to-br from-gray-50 to-white rounded-2xl p-3.5 hover:shadow-lg transition-all group border border-gray-100"
                        >
                          <div className="flex gap-3.5">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                              <div className="w-18 h-18 rounded-2xl overflow-hidden shadow-md">
                                <ImageWithFallback
                                  src={guide.avatar}
                                  alt={guide.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              {guide.isCertified && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                                  <Shield className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 text-left">
                              <div className="flex items-start justify-between mb-0.5">
                                <div>
                                  <h4 className="text-sm text-gray-800">{guide.name}</h4>
                                  <p className="text-xs text-gray-500">{guide.age}岁 · {guide.gender}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-gray-800">¥{guide.servicePrice}</div>
                                  <div className="text-xs text-gray-500">元/小时</div>
                                </div>
                              </div>

                              {/* Skills */}
                              <div className="flex gap-1.5 mb-1.5 flex-wrap">
                                {guide.skills.slice(0, 3).map((skill, index) => (
                                  <span key={index} className="text-xs bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 px-2 py-0.5 rounded-full">
                                    {skill}
                                  </span>
                                ))}
                              </div>

                              {/* Stats */}
                              <div className="flex items-center gap-2.5">
                                <div className="flex items-center gap-0.5">
                                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                  <span className="text-xs text-gray-700">{guide.rating}</span>
                                </div>
                                <div className="flex items-center gap-0.5">
                                  <Award className="w-3 h-3 text-orange-400" />
                                  <span className="text-xs text-gray-700">{guide.orderCount}单</span>
                                </div>
                                {guide.hasVehicle && (
                                  <div className="flex items-center gap-0.5">
                                    <Car className="w-3 h-3 text-green-500" />
                                    <span className="text-xs text-gray-700">{guide.vehicleType}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* 浏览旅行管家模式 */}
      {activeTab === 'browse' && (
        <>
          {/* Search Bar - 在浏览旅行管家下方 */}
          <div className="px-4 pb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl rounded-3xl"></div>
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 px-5 py-3.5 flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索旅行管家名字或技能..."
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`transition-all p-2 rounded-xl ${
                    showFilters ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' : 'bg-gray-100/80 text-gray-600'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters - 浏览旅行管家模式的筛选器 */}
          {showFilters && (
            <div className="px-4 pb-4 space-y-3 animate-slide-down">
              {/* 重要筛选：平台认证和性别 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-3 shadow-lg border border-white/20">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Shield className="w-3.5 h-3.5 text-blue-600" />
                    <h4 className="text-xs text-gray-700">平台认证</h4>
                  </div>
                  <div className="flex gap-2">
                    {['全部', '是', '否'].map((option) => (
                      <button
                        key={option}
                        onClick={() => setFilterCertified(option)}
                        className={`flex-1 py-1.5 rounded-xl text-xs transition-all ${
                          filterCertified === option
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                            : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-3 shadow-lg border border-white/20">
                  <h4 className="text-xs text-gray-700 mb-2">性别</h4>
                  <div className="flex gap-2">
                    {['全部', '男', '女'].map((option) => (
                      <button
                        key={option}
                        onClick={() => setFilterGender(option)}
                        className={`flex-1 py-1.5 rounded-xl text-xs transition-all ${
                          filterGender === option
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                            : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-lg border border-white/20">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">💰</span>
                  <h4 className="text-sm text-gray-700">价格范围</h4>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setFilterPriceRange(range.label)}
                      className={`px-3 py-2 rounded-xl text-xs transition-all ${
                        filterPriceRange === range.label
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                          : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vehicle Filter */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-lg border border-white/20">
                <div className="flex items-center gap-2 mb-3">
                  <Car className="w-4 h-4 text-orange-600" />
                  <h4 className="text-sm text-gray-700">车辆情况</h4>
                </div>
                <div className="flex gap-2">
                  {['全部', '有车', '无车'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setFilterVehicle(option)}
                      className={`flex-1 px-4 py-2 rounded-xl text-sm transition-all ${
                        filterVehicle === option
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30'
                          : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-lg border border-white/20">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-purple-600" />
                  <h4 className="text-sm text-gray-700">管家等级</h4>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['全部', '初级', '中级', '高级', '金牌'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setFilterLevel(level)}
                      className={`px-3 py-2 rounded-xl text-xs transition-all ${
                        filterLevel === level
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                          : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80'
                      }`}
                    >
                      {level === '全部' ? level : (
                        <span className="flex items-center justify-center gap-1">
                          {level === '初级' && '🌱'}
                          {level === '中级' && '⭐'}
                          {level === '高级' && '💎'}
                          {level === '金牌' && '👑'}
                          <span>{level}</span>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills Filter - 可折叠 */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-lg border border-white/20">
                <button
                  onClick={() => setShowSkillsExpanded(!showSkillsExpanded)}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">⭐</span>
                    <h4 className="text-sm text-gray-700">专业技能</h4>
                    <span className="text-xs text-gray-500">
                      {filterSkill !== '全部' && `(${filterSkill})`}
                    </span>
                  </div>
                  {showSkillsExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                
                {showSkillsExpanded && (
                  <div className="flex gap-2 flex-wrap animate-slide-down">
                    {allSkills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => setFilterSkill(skill)}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${
                          filterSkill === skill
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                            : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="px-4 space-y-4" id="guide-list">
            {/* Featured Guide */}
            {featuredGuide && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 blur-2xl rounded-[2rem]"></div>
                <div className="relative bg-white/90 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-2xl border border-white/20">
                  {/* Header */}
                  <div className="p-5 pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-800">推荐旅行管家</h3>
                      {featuredGuide.isCertified && (
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full flex items-center gap-1.5 text-xs shadow-lg shadow-blue-500/30">
                          <Shield className="w-3.5 h-3.5" />
                          <span>平台认证</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">本周推荐旅行管家</p>
                  </div>

                  {/* Main Card */}
                  <div className="px-5 pb-5">
                    <button
                      onClick={() => setSelectedGuide(featuredGuide)}
                      className="relative w-full rounded-3xl overflow-hidden shadow-xl group"
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <ImageWithFallback
                          src={featuredGuide.avatar}
                          alt={featuredGuide.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      </div>

                      {/* Content */}
                      <div className="relative aspect-[3/4] flex flex-col justify-end p-6">
                        {/* Stats Top Right */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                          <div className="bg-white/20 backdrop-blur-md rounded-2xl px-3 py-2 text-center">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mx-auto mb-1" />
                            <div className="text-white text-sm">{featuredGuide.rating}</div>
                          </div>
                          <div className="bg-white/20 backdrop-blur-md rounded-2xl px-3 py-2 text-center">
                            <Award className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                            <div className="text-white text-xs">{featuredGuide.orderCount}单</div>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h2 className="text-white">{featuredGuide.name}</h2>
                              {/* Level Badge */}
                              {featuredGuide.level && (
                                <div className="bg-white/20 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs flex items-center gap-1">
                                  <span>{GUIDE_LEVELS[featuredGuide.level].icon}</span>
                                  <span>{GUIDE_LEVELS[featuredGuide.level].name}</span>
                                </div>
                              )}
                              {/* Verified Badge */}
                              {featuredGuide.isVerified && (
                                <div className="bg-green-400/30 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs flex items-center gap-1">
                                  <Shield className="w-3 h-3" />
                                  <span>认证</span>
                                </div>
                              )}
                            </div>
                            <p className="text-white/80 text-sm">{featuredGuide.age}岁 · {featuredGuide.gender} · {featuredGuide.location}</p>
                          </div>

                          {/* Skills */}
                          <div className="flex gap-2 flex-wrap">
                            {featuredGuide.skills.slice(0, 3).map((skill, index) => (
                              <div key={index} className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1">
                                <span className="text-white text-xs">{skill}</span>
                              </div>
                            ))}
                          </div>

                          {/* Price & Action */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2 flex-1">
                              <div className="text-white/70 text-xs mb-0.5">按小时计价</div>
                              <div className="text-white">¥{featuredGuide.servicePrice}/小时</div>
                            </div>
                            <button className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                              <Navigation className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Other Guides */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-2xl rounded-[2rem]"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-[2rem] p-5 shadow-xl border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-gray-800">更多旅行管家</h3>
                    <p className="text-sm text-gray-500">共 {otherGuides.length} 位旅行管家</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {otherGuides.map((guide) => {
                    return (
                      <button
                        key={guide.id}
                        onClick={() => setSelectedGuide(guide)}
                        className="w-full bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 hover:shadow-lg transition-all group border border-gray-100"
                      >
                        <div className="flex gap-4">
                          {/* Avatar */}
                          <div className="relative flex-shrink-0">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md">
                              <ImageWithFallback
                                src={guide.avatar}
                                alt={guide.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            {guide.isCertified && (
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                                <Shield className="w-3.5 h-3.5 text-white" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-start justify-between mb-1">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <h4 className="text-gray-800">{guide.name}</h4>
                                  {/* Level Badge */}
                                  {guide.level && (
                                    <div className={`${GUIDE_LEVELS[guide.level].bgColor} ${GUIDE_LEVELS[guide.level].color} px-2 py-0.5 rounded-full text-xs flex items-center gap-1`}>
                                      <span className="text-[10px]">{GUIDE_LEVELS[guide.level].icon}</span>
                                      <span>{GUIDE_LEVELS[guide.level].name}</span>
                                    </div>
                                  )}
                                  {/* Verified Badge */}
                                  {guide.isVerified && (
                                    <div className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-xs flex items-center gap-0.5">
                                      <Shield className="w-2.5 h-2.5" />
                                    </div>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">{guide.age}岁 · {guide.gender}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-gray-800">¥{guide.servicePrice}</div>
                                <div className="text-xs text-gray-500">元/小时</div>
                              </div>
                            </div>

                            {/* Skills */}
                            <div className="flex gap-1.5 mb-2 flex-wrap">
                              {guide.skills.slice(0, 3).map((skill, index) => (
                                <span key={index} className="text-xs bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 px-2 py-0.5 rounded-full">
                                  {skill}
                                </span>
                              ))}
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                <span className="text-xs text-gray-700">{guide.rating}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 text-orange-400" />
                                <span className="text-xs text-gray-700">{guide.orderCount}单</span>
                              </div>
                              {guide.hasVehicle && (
                                <div className="flex items-center gap-1">
                                  <Car className="w-3.5 h-3.5 text-green-500" />
                                  <span className="text-xs text-gray-700">{guide.vehicleType}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Dialogs */}
      {selectedGuide && (
        <GuideDetail
          guide={selectedGuide}
          userLocation={userLocation}
          touristVerified={localTouristVerified}
          onClose={() => setSelectedGuide(null)}
          onChat={() => handleChatClick(selectedGuide)}
          onTouristVerified={() => setLocalTouristVerified(true)}
        />
      )}

      {showChat && chatGuide && (
        <ChatDialog
          guide={chatGuide}
          onClose={() => {
            setShowChat(false);
            setChatGuide(null);
          }}
        />
      )}
    </div>
  );
}
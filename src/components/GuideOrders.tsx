import { useState } from 'react';
import { MapPin, Star, Award, Search, MessageCircle, Shield, Navigation, Heart, SlidersHorizontal, ChevronDown, ChevronUp, Car, Calendar, Users, FileText, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { GuideDetail } from './GuideDetail';
import { ChatDialog } from './ChatDialog';
import { getPointsLevel } from '../data/pointsSystem';

interface GuideOrdersProps {
  userLocation: { latitude: number; longitude: number; city?: string } | null;
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
  points?: number;
  reviews: Review[];
  hasVehicle?: boolean;
  vehicleType?: string;
  vehiclePrice?: number; // 车辆价格（按天计价）
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
    points: 1500,
    reviews: [],
    hasVehicle: false
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
    points: 5200,
    reviews: [],
    hasVehicle: true,
    vehicleType: '别克GL8',
    vehiclePrice: 300 // 按天计价
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
    reviews: [],
    hasVehicle: false
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
    points: 3200,
    reviews: [],
    hasVehicle: true,
    vehicleType: '丰田汉兰达',
    vehiclePrice: 250 // 按天计价
  }
];

export function GuideOrders({ userLocation }: GuideOrdersProps) {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatGuide, setChatGuide] = useState<Guide | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSkill, setFilterSkill] = useState<string>('全部');
  const [filterCertified, setFilterCertified] = useState<string>('全部');
  const [filterGender, setFilterGender] = useState<string>('全部');
  const [filterPriceRange, setFilterPriceRange] = useState<string>('全部');
  const [filterVehicle, setFilterVehicle] = useState<string>('全部');
  const [showFilters, setShowFilters] = useState(false); // 默认隐藏
  const [showSkillsExpanded, setShowSkillsExpanded] = useState(false); // 专业技能默认收起
  
  // 需求填写相关状态
  const [requestDate, setRequestDate] = useState('');
  const [requestTime, setRequestTime] = useState('全天');
  const [maleCount, setMaleCount] = useState(1);
  const [femaleCount, setFemaleCount] = useState(0);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isMatched, setIsMatched] = useState(false); // 是否已匹配
  
  // Tab切换
  const [activeTab, setActiveTab] = useState<'match' | 'browse'>('match'); // 'match'智能匹配 'browse'浏览地陪

  const allSkills = ['全部', '摄影高手', '美食专家', '历史讲解', '自驾向导', '户外专家'];
  const priceRanges = [
    { label: '全部', min: 0, max: Infinity },
    { label: '50元以下', min: 0, max: 50 },
    { label: '50-100元', min: 50, max: 100 },
    { label: '100-150元', min: 100, max: 150 },
    { label: '150-200元', min: 150, max: 200 },
    { label: '200元以上', min: 200, max: Infinity }
  ];

  // 智能匹配模式：根据筛选条件匹配地陪
  const matchedGuides = mockGuides.filter(guide => {
    const skillMatch = filterSkill === '全部' || guide.skills.includes(filterSkill);
    const certifiedMatch = filterCertified === '全部' || (filterCertified === '是' ? guide.isCertified : !guide.isCertified);
    const genderMatch = filterGender === '全部' || guide.gender === filterGender;
    
    // 价格筛选
    const price = parseInt(guide.servicePrice);
    const selectedPriceRange = priceRanges.find(range => range.label === filterPriceRange);
    const priceMatch = !selectedPriceRange || filterPriceRange === '全部' || 
      (price >= selectedPriceRange.min && price < selectedPriceRange.max);
    
    // 车辆筛选
    const vehicleMatch = filterVehicle === '全部' || 
      (filterVehicle === '有车' ? guide.hasVehicle : !guide.hasVehicle);
    
    return skillMatch && certifiedMatch && genderMatch && priceMatch && vehicleMatch;
  });

  // 浏览地陪模式：根据用户距离和地陪积分推荐（默认不受筛选器影响）
  const browseGuides = mockGuides.filter(guide => {
    // 仅在用户主动搜索或使用筛选器时才应用筛选
    if (searchQuery === '' && !showFilters) {
      // 初始状态：显示所有地陪，按积分和距离排序
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
      
      const vehicleMatch = filterVehicle === '全部' || 
        (filterVehicle === '有车' ? guide.hasVehicle : !guide.hasVehicle);
      
      return searchMatch && skillMatch && certifiedMatch && genderMatch && priceMatch && vehicleMatch;
    }
    
    return searchMatch;
  });

  // 浏览地陪模式：根据距离和积分排序（积分优先，评分次之）
  const sortedGuidesForBrowse = [...browseGuides].sort((a, b) => {
    // 假设所有地陪都在丽江市内，距离都比较近，主要根据积分排序
    const pointsA = a.points || 0;
    const pointsB = b.points || 0;
    
    // 积分高的排在前面
    if (pointsB !== pointsA) {
      return pointsB - pointsA;
    }
    
    // 积分相同，则按评分排序
    return b.rating - a.rating;
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
      alert('请选择需要地陪的日期');
      return;
    }
    setIsMatched(true);
    // 滚动到地陪列表
    setTimeout(() => {
      const element = document.getElementById('guide-list');
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
              <span className="font-medium">浏览地陪</span>
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
                          为您推荐了 {matchedGuides.length} 位符合条件的地陪，点击地陪卡片即可快速预约
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 匹配结果地陪列表 - 仅在匹配成功后显示 */}
          {isMatched && matchedGuides.length > 0 && (
            <div className="px-4 mt-4 space-y-3" id="guide-list">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-2xl rounded-[2rem]"></div>
                <div className="relative bg-white/90 backdrop-blur-xl rounded-[2rem] p-4 shadow-xl border border-white/20">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-base text-gray-800">匹配结果</h3>
                      <p className="text-xs text-gray-500">为您找到 {matchedGuides.length} 位地陪</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {matchedGuides.map((guide) => {
                      const level = guide.points ? getPointsLevel(guide.points) : null;
                      
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
                                {level && (
                                  <div className="flex items-center gap-0.5">
                                    <div className={`w-3 h-3 rounded-full ${level.badgeColor}`}></div>
                                    <span className="text-xs text-gray-700">{level.name}</span>
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

      {/* 浏览地陪模式 */}
      {activeTab === 'browse' && (
        <>
          {/* Search Bar - 在浏览地陪下方 */}
          <div className="px-4 pb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl rounded-3xl"></div>
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 px-5 py-3.5 flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索地陪名字或技能..."
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

          {/* Filters - 浏览地陪模式的筛选器 */}
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
                      <h3 className="text-gray-800">推荐地陪</h3>
                      {featuredGuide.isCertified && (
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full flex items-center gap-1.5 text-xs shadow-lg shadow-blue-500/30">
                          <Shield className="w-3.5 h-3.5" />
                          <span>平台认证</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">本周推荐地陪</p>
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
                            <h2 className="text-white mb-1">{featuredGuide.name}</h2>
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
                    <h3 className="text-gray-800">更多地陪</h3>
                    <p className="text-sm text-gray-500">共 {otherGuides.length} 位地陪</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {otherGuides.map((guide) => {
                    const level = guide.points ? getPointsLevel(guide.points) : null;
                    
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
                              <div>
                                <h4 className="text-gray-800">{guide.name}</h4>
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
                              {level && (
                                <div className="flex items-center gap-1">
                                  <div className={`w-3.5 h-3.5 rounded-full ${level.badgeColor}`}></div>
                                  <span className="text-xs text-gray-700">{level.name}</span>
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
          onClose={() => setSelectedGuide(null)}
          onChatClick={() => handleChatClick(selectedGuide)}
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

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
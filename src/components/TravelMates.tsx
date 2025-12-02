import { useState, useMemo } from 'react';
import { MapPin, Calendar, Users, Heart, Plus, Search, UserPlus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PublishTrip, TripData } from './PublishTrip';
import { SendMessageDialog } from './SendMessageDialog';
import { MatchingTrip } from './MatchingTrip';

interface TravelMate {
  id: number;
  name: string;
  age: number;
  gender: string;
  avatar: string;
  destination: string;
  startDate: string;
  duration: string;
  peopleCount: string;
  lookingFor: string;
  activityTypes: string[];
  likes: number;
  distance?: number;
}

interface TravelMatesProps {
  userLocation?: { city: string; province: string } | null;
}

const activityTypeLabels: Record<string, { label: string; icon: string }> = {
  hiking: { label: '爬山', icon: '🏔️' },
  food: { label: '吃饭', icon: '🍜' },
  shopping: { label: '逛街', icon: '🛍️' },
  photo: { label: '拍照', icon: '📸' },
  culture: { label: '文化', icon: '🏛️' },
  beach: { label: '海滩', icon: '🏖️' },
  adventure: { label: '探险', icon: '🧗' },
  relax: { label: '休闲', icon: '☕' },
  nightlife: { label: '夜生活', icon: '🎉' },
  nature: { label: '自然', icon: '🌿' },
  art: { label: '艺术', icon: '🎨' },
  sports: { label: '运动', icon: '⚽' }
};

const mockMates: TravelMate[] = [
  {
    id: 1,
    name: '小雨',
    age: 25,
    gender: '女',
    avatar: 'https://images.unsplash.com/photo-1535208632259-841d129a6af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdHJhdmVsfGVufDF8fHx8MTc2NDU5ODc5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    destination: '三亚',
    startDate: '2025-01-15',
    duration: '4-7天',
    peopleCount: '2人',
    lookingFor: '寻找1-2名女生一起海岛游，喜欢拍照、美食',
    activityTypes: ['photo', 'food', 'beach', 'relax'],
    likes: 28
  },
  {
    id: 2,
    name: '阿杰',
    age: 28,
    gender: '男',
    avatar: 'https://images.unsplash.com/photo-1633177188754-980c2a6b6266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDUzMzYyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    destination: '拉萨',
    startDate: '2025-02-01',
    duration: '8-15天',
    peopleCount: '3-5人',
    lookingFor: '组队进藏，自驾或拼车都可以，有经验优先',
    activityTypes: ['hiking', 'photo', 'nature', 'adventure'],
    likes: 45
  },
  {
    id: 3,
    name: '糖糖',
    age: 23,
    gender: '女',
    avatar: 'https://images.unsplash.com/photo-1535208632259-841d129a6af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdHJhdmVsfGVufDF8fHx8MTc2NDU5ODc5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    destination: '成都',
    startDate: '2025-01-20',
    duration: '2-3天',
    peopleCount: '2人',
    lookingFor: '美食打卡之旅，吃货组！',
    activityTypes: ['food', 'shopping', 'culture', 'relax'],
    likes: 32
  },
  {
    id: 4,
    name: '旅行者李',
    age: 30,
    gender: '男',
    avatar: 'https://images.unsplash.com/photo-1633177188754-980c2a6b6266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDUzMzYyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    destination: '厦门',
    startDate: '2025-01-25',
    duration: '2-3天',
    peopleCount: '2人',
    lookingFor: '周末短途游，放松心情，慢慢逛',
    activityTypes: ['photo', 'culture', 'relax', 'beach'],
    likes: 19
  },
  {
    id: 5,
    name: '小明',
    age: 26,
    gender: '男',
    avatar: 'https://images.unsplash.com/photo-1633177188754-980c2a6b6266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDUzMzYyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    destination: '张家界',
    startDate: '2025-02-10',
    duration: '4-7天',
    peopleCount: '3-5人',
    lookingFor: '喜欢户外徒步，想去爬天门山和玻璃栈道',
    activityTypes: ['hiking', 'adventure', 'photo', 'nature'],
    likes: 38
  },
  {
    id: 6,
    name: '文艺青年',
    age: 24,
    gender: '女',
    avatar: 'https://images.unsplash.com/photo-1535208632259-841d129a6af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdHJhdmVsfGVufDF8fHx8MTc2NDU5ODc5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    destination: '杭州',
    startDate: '2025-01-28',
    duration: '2-3天',
    peopleCount: '2人',
    lookingFor: '西湖边喝茶、逛博物馆、看展览',
    activityTypes: ['culture', 'art', 'relax', 'photo'],
    likes: 25
  },
  {
    id: 7,
    name: '夜猫子',
    age: 27,
    gender: '男',
    avatar: 'https://images.unsplash.com/photo-1633177188754-980c2a6b6266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDUzMzYyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    destination: '上海',
    startDate: '2025-02-05',
    duration: '2-3天',
    peopleCount: '3-5人',
    lookingFor: '魔都夜生活，酒吧、livehouse、深夜食堂',
    activityTypes: ['nightlife', 'food', 'shopping', 'culture'],
    likes: 31
  },
  {
    id: 8,
    name: '运动达人',
    age: 29,
    gender: '女',
    avatar: 'https://images.unsplash.com/photo-1535208632259-841d129a6af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdHJhdmVsfGVufDF8fHx8MTc2NDU5ODc5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    destination: '桂林',
    startDate: '2025-02-15',
    duration: '4-7天',
    peopleCount: '2人',
    lookingFor: '骑行漓江、攀岩、徒步，寻找运动搭子',
    activityTypes: ['sports', 'adventure', 'nature', 'photo'],
    likes: 42
  }
];

export function TravelMates({ userLocation }: TravelMatesProps) {
  const [selectedMate, setSelectedMate] = useState<TravelMate | null>(null);
  const [likedMates, setLikedMates] = useState<Set<number>>(new Set());
  const [showPublish, setShowPublish] = useState(false);
  const [filterCity, setFilterCity] = useState<string>('全部');
  const [filterActivity, setFilterActivity] = useState<string>('全部');
  const [mates, setMates] = useState<TravelMate[]>(mockMates);
  const [showAllCities, setShowAllCities] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [messageTarget, setMessageTarget] = useState<TravelMate | null>(null);
  const [registeredMates, setRegisteredMates] = useState<Set<number>>(new Set());
  const [showMatching, setShowMatching] = useState(false);
  const [publishedTrip, setPublishedTrip] = useState<TripData | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const toggleLike = (id: number) => {
    const newLiked = new Set(likedMates);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLikedMates(newLiked);
  };

  const handleRegister = (mate: TravelMate) => {
    const newRegistered = new Set(registeredMates);
    newRegistered.add(mate.id);
    setRegisteredMates(newRegistered);
    
    // 显示报名成功提示（可以用toast或alert）
    alert(`已成功报名 ${mate.name} 的行程！\n您可以在消息中心与TA联系。`);
  };

  const handleSendMessage = (message: string) => {
    if (messageTarget) {
      // TODO: 这里应该将消息发送到Messages组件
      // 现在先用alert模拟
      alert(`消息已发送给 ${messageTarget.name}！\n\n内容：${message}\n\n对方将在"消息"功能中收到您的消息。`);
      setMessageTarget(null);
    }
  };

  const handlePublish = (tripData: TripData) => {
    // 创建新的搭子记录
    const newMate: TravelMate = {
      id: mates.length + 1,
      name: '我',
      age: 25,
      gender: '男',
      avatar: 'https://images.unsplash.com/photo-1633177188754-980c2a6b6266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDUzMzYyNHww&ixlib=rb-4.1.0&q=80&w=1080',
      destination: tripData.destination,
      startDate: tripData.startDate,
      duration: tripData.duration,
      peopleCount: tripData.peopleCount,
      lookingFor: tripData.description,
      activityTypes: tripData.activityTypes,
      likes: 0
    };
    setMates([newMate, ...mates]);
    setPublishedTrip(tripData);
    setShowMatching(true);
  };

  const handleMatchComplete = (matches: TravelMate[], groupId: number) => {
    setShowMatching(false);
    
    // 创建群组通知
    const memberNames = matches.map(m => m.name).join('、');
    alert(
      `🎉 行程组团成功！\\n\\n` +
      `目的地：${publishedTrip?.destination}\\n` +
      `成员：我、${memberNames}\\n\\n` +
      `系统已为您创建群组聊天！\\n` +
      `所有成员都将在"消息"功能中收到通知。\\n\\n` +
      `群组ID: ${groupId}`
    );
  };

  // 获取所有城市和活动类型用于筛选
  const allCities = Array.from(new Set(mates.map(m => m.destination)));
  
  // 热门城市列表
  const hotCities = ['北京', '上海', '广州', '深圳', '成都', '重庆', '杭州', '西安', '丽江', '三亚', '大理', '拉萨'];
  
  // 准备城市列表：用户位置优先，然后是热门城市，最后是其他城市
  const getCitiesToDisplay = () => {
    const displayed: string[] = [];
    
    // 1. 用户位置（如果存在且有搭子）
    if (userLocation?.city && allCities.includes(userLocation.city)) {
      displayed.push(userLocation.city);
    }
    
    // 2. 热门城市（在搭子列表中存在的）
    hotCities.forEach(city => {
      if (allCities.includes(city) && !displayed.includes(city)) {
        displayed.push(city);
      }
    });
    
    // 3. 其他城市
    allCities.forEach(city => {
      if (!displayed.includes(city)) {
        displayed.push(city);
      }
    });
    
    return displayed;
  };
  
  const citiesToDisplay = getCitiesToDisplay();
  const visibleCities = showAllCities ? citiesToDisplay : citiesToDisplay.slice(0, 9);
  
  // 搜索过滤
  const filteredCities = searchQuery.trim()
    ? citiesToDisplay.filter(city => city.includes(searchQuery))
    : [];
  
  const handleCitySelect = (city: string) => {
    setFilterCity(city);
    setSearchQuery('');
    setShowSearchResults(false);
  };
  
  const activities = ['全部', 'photo', 'food', 'hiking', 'beach', 'culture', 'shopping'];

  // 城市距离映射（单位：公里）- 简化示例
  const cityDistances: Record<string, number> = {
    '三亚': 1850,
    '拉萨': 2200,
    '成都': 650,
    '厦门': 1650,
    '张家界': 1100,
    '杭州': 1600,
    '上海': 1850,
    '桂林': 950,
    '北京': 1950,
    '广州': 1450,
    '深圳': 1580,
    '重庆': 520,
    '西安': 1050,
    '大理': 160,
    '丽江': 0  // 用户默认位置（丽江）
  };

  // 计算搭子距离
  const calculateDistance = (destination: string): number => {
    // 如果用户位置与目的地相同，距离为0-50km范围内随机
    if (userLocation?.city && destination === userLocation.city) {
      return Math.floor(Math.random() * 50);
    }
    
    // 如果有用户位置城市，使用该城市作为基准
    if (userLocation?.city && userLocation.city !== '丽江市') {
      const userCityName = userLocation.city.replace('市', '');
      const userCityDist = cityDistances[userCityName] || 0;
      const destDist = cityDistances[destination] || 1000;
      // 简化计算：两城市到丽江距离的差值
      return Math.abs(userCityDist - destDist);
    }
    
    // 默认使用丽江作为基准
    return cityDistances[destination] || 1000;
  };

  // 为搭子添加距离信息并排序
  const matesWithDistance = useMemo(() => {
    return mates.map(mate => ({
      ...mate,
      distance: calculateDistance(mate.destination)
    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [mates, userLocation]);

  // 筛选搭子
  const filteredMates = matesWithDistance.filter(mate => {
    const cityMatch = filterCity === '全部' || mate.destination === filterCity;
    const activityMatch = filterActivity === '全部' || mate.activityTypes.includes(filterActivity);
    return cityMatch && activityMatch;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Header Actions */}
      <button 
        onClick={() => setShowPublish(true)}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        发布行程
      </button>

      {/* City Filter */}
      <div className="relative">
        {/* Search Input - 城市选择整合到搜索栏 */}
        <div className="relative">
          <input
            type="text"
            value={filterCity === '全部' ? searchQuery : filterCity}
            onChange={(e) => {
              const value = e.target.value;
              setSearchQuery(value);
              if (value.trim() === '') {
                setFilterCity('全部');
              }
              setShowSearchResults(value.trim().length > 0);
            }}
            onFocus={() => setShowSearchResults(true)}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="搜索目的地..."
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          
          {/* Search Results Dropdown - 显示所有城市选项 */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-xl shadow-xl max-h-64 overflow-y-auto z-20">
              <button
                onClick={() => {
                  setFilterCity('全部');
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 ${
                  filterCity === '全部' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>📍 全部城市</span>
                  {filterCity === '全部' && <span className="text-blue-600">✓</span>}
                </div>
              </button>
              {citiesToDisplay.filter(city => !searchQuery || city.includes(searchQuery)).map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setFilterCity(city);
                    setSearchQuery('');
                    setShowSearchResults(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    filterCity === city ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span>{city}</span>
                      {userLocation?.city === city && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">当前位置</span>
                      )}
                    </div>
                    {filterCity === city && <span className="text-blue-600">✓</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 当前筛选显示 */}
        {filterCity !== '全部' && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-600">当前筛选:</span>
            <span className="px-3 py-1 bg-gradient-to-r from-sky-400 to-emerald-400 text-white rounded-full text-sm flex items-center gap-2">
              {filterCity}
              <button
                onClick={() => setFilterCity('全部')}
                className="hover:bg-white/20 rounded-full p-0.5"
              >
                ✕
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Activity Filter */}
      <div>
        <h4 className="text-gray-700 mb-2 text-sm">游玩类型</h4>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setFilterActivity('全部')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              filterActivity === '全部'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-500'
            }`}
          >
            全部
          </button>
          {activities.slice(1).map((activity) => {
            const type = activityTypeLabels[activity];
            return (
              <button
                key={activity}
                onClick={() => setFilterActivity(activity)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors flex items-center gap-1 ${
                  filterActivity === activity
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-500'
                }`}
              >
                <span>{type.icon}</span>
                <span>{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-gray-600 text-sm">
        找到 {filteredMates.length} 个搭子
      </div>

      {/* Mates List */}
      <div className="space-y-4">
        {filteredMates.map((mate) => (
          <div
            key={mate.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-4">
              {/* User Info */}
              <div className="flex items-start gap-3 mb-3">
                <div className="relative">
                  <ImageWithFallback
                    src={mate.avatar}
                    alt={mate.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                    {mate.gender}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-gray-800">{mate.name}</h3>
                    <span className="text-gray-500 text-sm">{mate.age}岁</span>
                    {mate.distance !== undefined && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-xs flex items-center gap-1">
                        📏 {mate.distance}km
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {mate.destination}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {mate.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {mate.peopleCount}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleLike(mate.id)}
                  className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      likedMates.has(mate.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>

              {/* Trip Details */}
              <div className="mb-3">
                <p className="text-gray-700 text-sm mb-2">{mate.lookingFor}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  出发日期：{mate.startDate}
                </div>
              </div>

              {/* Activity Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {mate.activityTypes.slice(0, 4).map((typeId, index) => {
                  const type = activityTypeLabels[typeId];
                  return (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs flex items-center gap-1"
                    >
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </span>
                  );
                })}
                {mate.activityTypes.length > 4 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    +{mate.activityTypes.length - 4}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {registeredMates.has(mate.id) ? (
                  <button
                    disabled
                    className="px-6 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed flex items-center gap-1"
                  >
                    <UserPlus className="w-4 h-4" />
                    已报名
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegister(mate)}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-400 to-sky-400 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1"
                  >
                    <UserPlus className="w-4 h-4" />
                    报名
                  </button>
                )}
                <button
                  onClick={() => setSelectedMate(mate)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  查看详情
                </button>
                <button
                  onClick={() => setMessageTarget(mate)}
                  className="px-6 py-2 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  联系TA
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedMate && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
          onClick={() => setSelectedMate(null)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-4">
              <ImageWithFallback
                src={selectedMate.avatar}
                alt={selectedMate.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h2 className="text-gray-800 mb-1">{selectedMate.name}</h2>
                <p className="text-gray-600 text-sm mb-2">{selectedMate.age}岁 · {selectedMate.gender}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedMate.activityTypes.map((typeId, index) => {
                    const type = activityTypeLabels[typeId];
                    return (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs flex items-center gap-1"
                      >
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-5 h-5 text-blue-500" />
                目的地：{selectedMate.destination}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-5 h-5 text-blue-500" />
                出发时间：{selectedMate.startDate}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="w-5 h-5 text-blue-500" />
                行程时长：{selectedMate.duration}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="w-5 h-5 text-blue-500" />
                期望人数：{selectedMate.peopleCount}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-gray-800 mb-2">行程说明</h3>
              <p className="text-gray-600">{selectedMate.lookingFor}</p>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl">
                立即联系
              </button>
              <button
                onClick={() => setSelectedMate(null)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Trip Modal */}
      {showPublish && (
        <PublishTrip
          onClose={() => setShowPublish(false)}
          onPublish={handlePublish}
          userLocation={userLocation}
        />
      )}

      {/* Send Message Dialog */}
      {messageTarget && (
        <SendMessageDialog
          userName={messageTarget.name}
          userAvatar={messageTarget.avatar}
          userType="mate"
          onClose={() => setMessageTarget(null)}
          onSend={handleSendMessage}
        />
      )}

      {/* Matching Trip Modal */}
      {showMatching && publishedTrip && (
        <MatchingTrip
          tripData={publishedTrip}
          onClose={() => setShowMatching(false)}
          onMatchComplete={handleMatchComplete}
        />
      )}
    </div>
  );
}
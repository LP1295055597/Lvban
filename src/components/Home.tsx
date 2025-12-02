import { useState, useEffect } from 'react';
import { Users, Briefcase, MapPin, Search, Play, Star, Plus, Navigation, Heart, BookmarkPlus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AttractionDetail } from './AttractionDetail';
import { VideoFeed } from './VideoFeed';
import { PublishContent } from './PublishContent';
import { CitySelector } from './CitySelector';
import { CityData, getNearestCity, getDefaultCity } from '../data/cityData';

interface HomeProps {
  userLocation: { latitude: number; longitude: number; city?: string } | null;
  onNavigate: (tab: 'home' | 'mates' | 'guide' | 'messages' | 'profile') => void;
}

interface Attraction {
  id: number;
  name: string;
  category: 'scenic' | 'food';
  image: string;
  location: string;
  openTime?: string;
  price?: string;
  rating: number;
  description: string;
  highlights: string[];
  tips: string[];
  audioGuide: string;
  distance?: string;
}

export function Home({ userLocation, onNavigate }: HomeProps) {
  const [selectedTab, setSelectedTab] = useState<'explore' | 'video'>('explore');
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [showPublish, setShowPublish] = useState(false);
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [currentCity, setCurrentCity] = useState<CityData>(getDefaultCity());
  const [scenicSpots, setScenicSpots] = useState<Attraction[]>([]);
  const [foods, setFoods] = useState<Attraction[]>([]);

  useEffect(() => {
    if (userLocation) {
      const nearestCity = getNearestCity(userLocation.latitude, userLocation.longitude);
      setCurrentCity(nearestCity);
    } else {
      setCurrentCity(getDefaultCity());
    }
  }, [userLocation]);

  useEffect(() => {
    loadCityAttractions(currentCity);
  }, [currentCity]);

  const loadCityAttractions = async (city: CityData) => {
    const scenicData: Attraction[] = city.attractions.map((attraction, index) => ({
      id: attraction.id,
      name: attraction.name,
      category: 'scenic' as const,
      image: attraction.image,
      location: attraction.location,
      openTime: '08:00-18:00',
      price: '门票待查',
      rating: attraction.rating,
      description: attraction.description,
      distance: `${(Math.random() * 10 + 1).toFixed(1)} km`,
      highlights: [
        `${attraction.name}是${city.cityName}的必游景点之一`,
        '景色优美，适合拍照留念',
        '建议游览时间2-3小时',
        '周边有餐饮和休息设施'
      ],
      tips: [
        '建议提前预约门票',
        '注意防晒和保暖',
        '遵守景区规定，保护环境',
        '可以聘请导游了解更多历史文化'
      ],
      audioGuide: `欢迎来到${attraction.name}。${attraction.description}这里是${city.cityName}最具代表性的景点之一，每年吸引大量游客前来参观。在这里，您可以欣赏到独特的自然风光和人文景观，感受${city.cityName}的魅力。祝您旅途愉快！`
    }));

    const foodData: Attraction[] = city.foods.map((food, index) => ({
      id: food.id,
      name: food.name,
      category: 'food' as const,
      image: food.image,
      location: food.restaurant,
      price: food.price,
      rating: food.rating,
      description: food.description,
      distance: `${(Math.random() * 5 + 0.5).toFixed(1)} km`,
      highlights: [
        `${food.name}是${city.cityName}的特色美食`,
        `推荐店铺：${food.restaurant}`,
        '口味地道，深受当地人和游客喜爱',
        '价格实惠，性价比高'
      ],
      tips: [
        '用餐高峰期可能需要等位',
        '可以提前电话预约',
        '注意饮食卫生',
        '如有特殊饮食要求，请提前告知商家'
      ],
      audioGuide: `${food.name}是${city.cityName}的传统美食。${food.description}这道美食承载着当地的饮食文化和历史传统，是来${city.cityName}必尝的特色菜品。推荐您到${food.restaurant}品尝，这里的制作手法最为正宗。`
    }));

    setScenicSpots(scenicData);
    setFoods(foodData);
  };

  const handleCityChange = (city: CityData) => {
    setCurrentCity(city);
  };

  const handlePublishSuccess = () => {
    setShowPublish(false);
  };

  // 合并景点和美食数据用于展示
  const allAttractions = [...scenicSpots, ...foods];
  const featuredAttraction = scenicSpots[0];
  const trendingSpots = allAttractions.slice(1, 5);

  return (
    <div className="min-h-screen pb-4">
      {/* Search Bar */}
      <div className="sticky top-[72px] z-20 px-4 pt-4 pb-3">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 px-5 py-3.5 flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索想去的"
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
            />
            <button 
              onClick={() => setShowCitySelector(true)}
              className="text-sm text-gray-600 bg-gray-100/80 px-3 py-1.5 rounded-full hover:bg-gray-200/80 transition-colors"
            >
              {currentCity.cityName}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="px-4 pt-4 pb-3">
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-1.5 flex gap-1 shadow-md border border-white/20">
          <button
            onClick={() => setSelectedTab('explore')}
            className={`flex-1 py-2.5 rounded-2xl transition-all ${
              selectedTab === 'explore'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            发现
          </button>
          <button
            onClick={() => setSelectedTab('video')}
            className={`flex-1 py-2.5 rounded-2xl transition-all ${
              selectedTab === 'video'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            精彩推荐
          </button>
        </div>
      </div>

      {/* Content */}
      {selectedTab === 'video' && (
        <div className="px-4">
          <VideoFeed />
        </div>
      )}

      {selectedTab === 'explore' && (
        <div className="px-4 space-y-4">
          {/* Quick Actions - 移到首屏 */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('mates')}
              className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500"></div>
              <div className="relative p-4 text-left">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white text-sm mb-0.5">找旅行搭子</h3>
                <p className="text-white/80 text-xs">结伴同行更有趣</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('guide')}
              className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-pink-500"></div>
              <div className="relative p-4 text-left">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white text-sm mb-0.5">预约地陪</h3>
                <p className="text-white/80 text-xs">本地向导带你游</p>
              </div>
            </button>
          </div>

          {/* Featured Destination Card */}
          {featuredAttraction && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-2xl rounded-[2rem]"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-2xl border border-white/20">
                {/* Header */}
                <div className="p-5 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-800 mb-1">精选推荐</h3>
                    <p className="text-sm text-gray-500">{currentCity.cityName}</p>
                  </div>
                  <button className="w-10 h-10 bg-gray-100/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-200/80 transition-colors">
                    <Users className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                {/* Main Image Card */}
                <div className="px-5 pb-4">
                  <button
                    onClick={() => setSelectedAttraction(featuredAttraction)}
                    className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-xl group"
                  >
                    <ImageWithFallback
                      src={featuredAttraction.image}
                      alt={featuredAttraction.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-end justify-between">
                        <div className="flex-1">
                          <h2 className="text-white mb-2">{featuredAttraction.name}</h2>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex -space-x-2">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white"></div>
                              ))}
                            </div>
                            <span className="text-white/90 text-xs">
                              {Math.floor(Math.random() * 50 + 10)}位游客正在探索
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-white" />
                              <span className="text-white text-xs">{featuredAttraction.distance}</span>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5">
                              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                              <span className="text-white text-xs">{featuredAttraction.rating}</span>
                            </div>
                          </div>
                        </div>
                        <button className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                          <Navigation className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Top Right Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                      <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                      <span className="text-xs text-gray-800">{Math.floor(Math.random() * 500 + 100)}</span>
                    </div>
                  </button>
                </div>

                {/* Bottom Map Preview */}
                <div className="px-5 pb-5">
                  <div className="relative h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                    {/* Simulated Map */}
                    <div className="absolute inset-0 opacity-40">
                      <svg className="w-full h-full" viewBox="0 0 200 100">
                        <path
                          d="M 20,80 Q 60,20 100,50 T 180,30"
                          stroke="#4F46E5"
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray="5,5"
                        />
                        <circle cx="20" cy="80" r="6" fill="#10B981" />
                        <circle cx="180" cy="30" r="6" fill="#EF4444" />
                      </svg>
                    </div>
                    <div className="relative h-full flex items-center justify-between px-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                        <span className="text-xs text-gray-700">📍 您的位置</span>
                      </div>
                      <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-xs hover:shadow-lg transition-all">
                        开始导航
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trending Destinations */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-pink-500/10 to-purple-500/10 blur-2xl rounded-[2rem]"></div>
            <div className="relative bg-white/90 backdrop-blur-xl rounded-[2rem] p-5 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-gray-800">本周热门</h3>
                  <p className="text-sm text-gray-500">大家都在看</p>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  查看全部 →
                </button>
              </div>

              {/* Circular Layout Grid */}
              <div className="grid grid-cols-2 gap-3">
                {trendingSpots.map((spot, index) => (
                  <button
                    key={spot.id}
                    onClick={() => setSelectedAttraction(spot)}
                    className="relative aspect-square rounded-3xl overflow-hidden shadow-lg group"
                  >
                    <ImageWithFallback
                      src={spot.image}
                      alt={spot.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="bg-white/20 backdrop-blur-md rounded-2xl px-3 py-2 mb-2">
                        <h4 className="text-white text-sm line-clamp-1">{spot.name}</h4>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md rounded-full px-2.5 py-1">
                          <MapPin className="w-3 h-3 text-white" />
                          <span className="text-white text-xs">{spot.distance}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md rounded-full px-2.5 py-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-white text-xs">{spot.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <div className={`backdrop-blur-md rounded-full px-2.5 py-1 ${
                        spot.category === 'food'
                          ? 'bg-orange-500/80'
                          : 'bg-blue-500/80'
                      }`}>
                        <span className="text-white text-xs">
                          {spot.category === 'food' ? '🍜 美食' : '🏔️ 景点'}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setShowPublish(true)}
        className="fixed bottom-24 right-6 z-20 w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-2xl shadow-purple-500/50 flex items-center justify-center hover:scale-110 transition-transform"
      >
        <Plus className="w-7 h-7 text-white" />
      </button>

      {/* Dialogs */}
      {selectedAttraction && (
        <AttractionDetail
          attraction={selectedAttraction}
          onClose={() => setSelectedAttraction(null)}
        />
      )}

      {showPublish && (
        <PublishContent
          onClose={() => setShowPublish(false)}
          onSuccess={handlePublishSuccess}
        />
      )}

      {showCitySelector && (
        <CitySelector
          currentCity={currentCity}
          onCityChange={handleCityChange}
          onClose={() => setShowCitySelector(false)}
        />
      )}
    </div>
  );
}
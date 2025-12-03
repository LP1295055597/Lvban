import React, { useState } from 'react';
import { X, MapPin, Navigation, Clock, DollarSign, Camera, Video, ChevronRight } from 'lucide-react';
import lijiangMapImage from 'figma:asset/1a233cd65b14f51c4c91304408acd85d0fc50d24.png';
import lijiangOldTownImage from 'figma:asset/ae6c0448caddc5af6967743b9b92f82c9134225a.png';

interface TravelMapProps {
  onClose: () => void;
  selectedCity?: string;
  userLocation?: {
    latitude: number;
    longitude: number;
    city: string;
  } | null;
}

interface Attraction {
  id: string;
  name: string;
  position: { x: number; y: number }; // 百分比位置
  price?: string;
  description: string;
  tips: string[];
  images: string[];
  hasDetailMap?: boolean;
  relatedVideos?: any[];
  category: string;
}

export function TravelMap({ onClose, selectedCity = '丽江', userLocation }: TravelMapProps) {
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [showDetailMap, setShowDetailMap] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'videos' | 'tips'>('info');

  // 获取当前时间段
  const getCurrentTimeSlot = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 9) return 'morning';
    if (hour >= 9 && hour < 12) return 'forenoon';
    if (hour >= 12 && hour < 14) return 'lunch';
    if (hour >= 14 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 19) return 'evening';
    return 'night';
  };

  // 模拟用户在地图上的位置（基于实际位置或默认位置）
  const getUserPositionOnMap = () => {
    // 如果用户在丽江，显示在丽江古城附近
    if (userLocation?.city.includes('丽江')) {
      return { x: 42, y: 68 };
    }
    // 如果用户不在丽江，显示在地图边缘（表示从外地来）
    return { x: 90, y: 90 };
  };

  const userPosition = getUserPositionOnMap();
  const currentTimeSlot = getCurrentTimeSlot();

  // 丽江市旅行地图景点数据
  const lijiangAttractions: Attraction[] = [
    {
      id: 'lashi-lake',
      name: '拉市海',
      position: { x: 15, y: 70 },
      price: '30元',
      description: '拉市海是云南省第一个以"湿地"命名的自然保护区，每年冬季有数万只候鸟来此越冬。',
      tips: ['骑马划船体验', '观鸟最佳季节11-3月', '建议游玩时间3-4小时'],
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
      category: '自然风光',
      relatedVideos: []
    },
    {
      id: 'old-town',
      name: '丽江古城',
      position: { x: 42, y: 68 },
      price: '免费',
      description: '世界文化遗产，茶马古道重镇，有800多年历史。古城布局错综复杂，是中国保存最完整的少数民族古城。',
      tips: ['夜景最美', '四方街是中心', '推荐清晨或傍晚游览'],
      images: ['https://images.unsplash.com/photo-1528127269322-539801943592?w=800'],
      hasDetailMap: true,
      category: '历史古迹',
      relatedVideos: []
    },
    {
      id: 'shuhe',
      name: '束河古镇',
      position: { x: 52, y: 50 },
      price: '免费',
      description: '比丽江古城更加安静的古镇，是茶马古道上的重要驿站，保留了更原始的纳西族风情。',
      tips: ['比古城安静', '适合摄影', '青龙桥是标志'],
      images: ['https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800'],
      category: '历史古迹',
      relatedVideos: []
    },
    {
      id: 'baisha',
      name: '白沙古镇',
      position: { x: 28, y: 45 },
      price: '免费',
      description: '纳西族最早的聚居地，有著名的白沙壁画，是丽江最原始的古镇。',
      tips: ['白沙壁画必看', '游客较少', '适合深度游'],
      images: ['https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800'],
      category: '历史古迹',
      relatedVideos: []
    },
    {
      id: 'yulong-snow',
      name: '玉龙雪山',
      position: { x: 35, y: 25 },
      price: '进山费100元 + 大索道140元',
      description: '海拔5596米的雪山，是纳西族心中的神山。拥有险、奇、美、秀著称于世。',
      tips: ['需提前预约', '准备防寒衣物', '避免剧烈运动'],
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
      category: '自然风光',
      relatedVideos: []
    },
    {
      id: 'lugu-lake',
      name: '泸沽湖',
      position: { x: 85, y: 70 },
      price: '70元',
      description: '被誉为"高原明珠"，是云南省海拔最高的湖泊，也是中国第三大深水湖泊。',
      tips: ['观日出日落', '摩梭族走婚文化', '环湖骑行'],
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
      category: '自然风光',
      relatedVideos: []
    },
    {
      id: 'tiger-jump',
      name: '虎跳峡',
      position: { x: 28, y: 20 },
      price: '45元',
      description: '世界上最深的峡谷之一，金沙江劈开玉龙、哈巴两座雪山，气势磅礴。',
      tips: ['徒步路线惊险', '注意安全', '带好装备'],
      images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'],
      category: '自然风光',
      relatedVideos: []
    },
    {
      id: 'blue-moon',
      name: '蓝月谷',
      position: { x: 42, y: 35 },
      price: '包含在雪山票里',
      description: '位于玉龙雪山脚下，湖水湛蓝如宝石，被誉为"小九寨沟"。',
      tips: ['晴天最美', '拍照圣地', '与雪山一起游玩'],
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
      category: '自然风光',
      relatedVideos: []
    }
  ];

  // 丽江古城详细景点数据
  const oldTownAttractions = [
    { name: '忠义市场', position: { x: 50, y: 85 } },
    { name: '木府', position: { x: 48, y: 68 } },
    { name: '三眼井', position: { x: 42, y: 72 } },
    { name: '方古楼', position: { x: 38, y: 58 } },
    { name: '狮子山', position: { x: 20, y: 45 } },
    { name: '大水车', position: { x: 60, y: 38 } },
    { name: '大研花巷', position: { x: 75, y: 35 } },
    { name: '五一街', position: { x: 72, y: 52 } },
    { name: '大石桥', position: { x: 55, y: 60 } },
    { name: '四方街', position: { x: 52, y: 75 } }
  ];

  const handleAttractionClick = (attraction: Attraction) => {
    setSelectedAttraction(attraction);
    setActiveTab('info');
  };

  const handleShowDetailMap = () => {
    setShowDetailMap(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-400 to-green-400 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-2xl mb-1">🗺️ {selectedCity}旅行地图</h2>
              <p className="text-white/90 text-sm">
                {(() => {
                  const timeSlot = getCurrentTimeSlot();
                  if (timeSlot === 'morning') return '☀️ 早上好！适合游览古城和公园';
                  if (timeSlot === 'forenoon') return '🌤️ 上午好！适合爬山看雪山';
                  if (timeSlot === 'lunch') return '🍜 午餐时间！去尝尝地道美食';
                  if (timeSlot === 'afternoon') return '☁️ 下午好！适合漫步古镇';
                  if (timeSlot === 'evening') return '🌆 傍晚时分！夜景即将上演';
                  return '🌙 晚上好！古城夜生活开始了';
                })()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!showDetailMap ? (
            <div className="relative">
              {/* 地图图片 */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-amber-50">
                <img 
                  src={lijiangMapImage} 
                  alt="丽江旅行地图" 
                  className="w-full h-auto"
                />
                
                {/* 用户位置标记 */}
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{ 
                    left: `${userPosition.x}%`, 
                    top: `${userPosition.y}%` 
                  }}
                >
                  <div className="relative">
                    {/* 脉冲动画 - 蓝色 */}
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                    {/* 主标记 - 用户位置 */}
                    <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                      <Navigation className="w-6 h-6 text-white" />
                    </div>
                    {/* 标签 */}
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-blue-600 px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                      <span className="text-xs text-white font-medium">📍 您的位置</span>
                    </div>
                  </div>
                </div>

                {/* 可点击的景点标记 */}
                {lijiangAttractions.map((attraction) => (
                  <button
                    key={attraction.id}
                    onClick={() => handleAttractionClick(attraction)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                    style={{ 
                      left: `${attraction.position.x}%`, 
                      top: `${attraction.position.y}%` 
                    }}
                  >
                    <div className="relative">
                      {/* 脉冲动画 */}
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                      {/* 主标记 */}
                      <div className="relative w-8 h-8 bg-red-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center group-hover:scale-125 transition-transform">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      {/* 标签 */}
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <span className="text-xs text-gray-800">{attraction.name}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* 智能推荐 */}
              <div className="mt-6 space-y-4">
                {/* 位置信息 */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4">
                  <h3 className="text-gray-800 mb-2 flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-blue-600" />
                    <span>您的位置</span>
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {userLocation?.city.includes('丽江') 
                      ? `📍 您目前在${userLocation.city}，可直接前往附近景点` 
                      : `📍 您目前在${userLocation?.city || '未知位置'}，建议先前往丽江古城入住`}
                  </p>
                </div>

                {/* 基于时间和位置的推荐 */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-gray-800 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <span>当前时段推荐</span>
                    </h3>
                    <span className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded-full">
                      {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {(() => {
                      const recommendations = [];
                      const timeSlot = getCurrentTimeSlot();
                      
                      if (timeSlot === 'morning') {
                        recommendations.push(
                          { name: '丽江古城', reason: '清晨的古城最安静，适合拍照和感受纳西文化', icon: '🌅' },
                          { name: '黑龙潭公园', reason: '晨光下的雪山倒影最美', icon: '🏔️' }
                        );
                      } else if (timeSlot === 'forenoon') {
                        recommendations.push(
                          { name: '玉龙雪山', reason: '上午天气最好，适合上雪山', icon: '⛰️' },
                          { name: '白沙古镇', reason: '游客较少，适合深度游', icon: '🏘️' }
                        );
                      } else if (timeSlot === 'lunch') {
                        recommendations.push(
                          { name: '忠义市场', reason: '品尝地道丽江美食的最佳时间', icon: '🍜' },
                          { name: '丽江古城', reason: '在特色餐厅享用午餐', icon: '🍴' }
                        );
                      } else if (timeSlot === 'afternoon') {
                        recommendations.push(
                          { name: '束河古镇', reason: '下午阳光温和，适合漫步拍照', icon: '📸' },
                          { name: '蓝月谷', reason: '下午光线柔和，湖水最蓝', icon: '💙' }
                        );
                      } else if (timeSlot === 'evening') {
                        recommendations.push(
                          { name: '丽江古城', reason: '夜景绝美，酒吧街热闹', icon: '🌃' },
                          { name: '狮子山', reason: '俯瞰古城夜景的最佳位置', icon: '🦁' }
                        );
                      } else {
                        recommendations.push(
                          { name: '丽江古城', reason: '夜晚的四方街和酒吧街最热闹', icon: '🎶' },
                          { name: '大研花巷', reason: '夜市小吃和表演精彩', icon: '🎭' }
                        );
                      }

                      return recommendations.map((rec, index) => (
                        <div key={index} className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => {
                            const attraction = lijiangAttractions.find(a => a.name === rec.name);
                            if (attraction) handleAttractionClick(attraction);
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">{rec.icon}</span>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-gray-800 font-medium mb-1">{rec.name}</h4>
                              <p className="text-gray-600 text-sm">{rec.reason}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* 出行建议 */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4">
                  <h3 className="text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-xl">💡</span>
                    <span>出行建议</span>
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    {userLocation?.city.includes('丽江') ? (
                      <>
                        <p className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">✓</span>
                          <span>您已在丽江市内，可直接前往各景点游玩</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="text-orange-600 mt-0.5">!</span>
                          <span>近距离：古城、束河、白沙（30分钟内）</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="text-orange-600 mt-0.5">!</span>
                          <span>中距离：玉龙雪山、拉市海（1小时内）</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="text-red-600 mt-0.5">!</span>
                          <span>远距离：泸沽湖、虎跳峡（需安排一整天）</span>
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">📍</span>
                          <span>您目前不在丽江，建议先前往丽江古城入住</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">✓</span>
                          <span>第一天：抵达丽江古城，感受纳西文化</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">✓</span>
                          <span>第二天：游览玉龙雪山、蓝月谷</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">✓</span>
                          <span>第三天+：束河古镇、白沙古镇或泸沽湖</span>
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* 古城详细地图 */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={lijiangOldTownImage} 
                  alt="丽江古城游玩攻略" 
                  className="w-full h-auto"
                />
                
                {/* 古城景点标记 */}
                {oldTownAttractions.map((spot, index) => (
                  <div
                    key={index}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ 
                      left: `${spot.position.x}%`, 
                      top: `${spot.position.y}%` 
                    }}
                  >
                    <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowDetailMap(false)}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-sky-400 to-green-400 text-white rounded-xl hover:shadow-lg transition-all"
              >
                ← 返回丽江全景地图
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 景点详情侧边栏 */}
      {selectedAttraction && (
        <div className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-white shadow-2xl z-50 overflow-y-auto animate-slideInRight">
          <div className="sticky top-0 bg-gradient-to-r from-sky-400 to-green-400 p-6 text-white z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-2xl mb-2">{selectedAttraction.name}</h3>
                <div className="flex items-center gap-3 text-sm text-white/90">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {selectedAttraction.price}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selectedAttraction.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAttraction(null)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-white sticky top-[120px] z-10">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-3 text-sm transition-colors ${
                activeTab === 'info'
                  ? 'text-sky-600 border-b-2 border-sky-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📍 景点介绍
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`flex-1 py-3 text-sm transition-colors ${
                activeTab === 'tips'
                  ? 'text-sky-600 border-b-2 border-sky-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              💡 游玩攻略
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex-1 py-3 text-sm transition-colors ${
                activeTab === 'videos'
                  ? 'text-sky-600 border-b-2 border-sky-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🎬 精彩推荐
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'info' && (
              <div className="space-y-6">
                {/* 景点图片 */}
                <div className="rounded-2xl overflow-hidden">
                  <img 
                    src={selectedAttraction.images[0]} 
                    alt={selectedAttraction.name}
                    className="w-full h-64 object-cover"
                  />
                </div>

                {/* 描述 */}
                <div className="bg-gradient-to-br from-sky-50 to-green-50 rounded-2xl p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedAttraction.description}
                  </p>
                </div>

                {/* 详细地图按钮 */}
                {selectedAttraction.hasDetailMap && (
                  <button
                    onClick={handleShowDetailMap}
                    className="w-full py-4 bg-gradient-to-r from-sky-400 to-green-400 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-5 h-5" />
                    <span>查看古城详细游玩地图</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {activeTab === 'tips' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4">
                  <h4 className="text-gray-800 mb-3 flex items-center gap-2">
                    <span>💡</span>
                    <span>游玩建议</span>
                  </h4>
                  <ul className="space-y-2">
                    {selectedAttraction.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4">
                  <h4 className="text-gray-800 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span>最佳游览时间</span>
                  </h4>
                  <p className="text-gray-700">
                    建议游玩时间：3-4小时<br/>
                    最佳季节：四季皆宜
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4">
                  <h4 className="text-gray-800 mb-3 flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-green-600" />
                    <span>交通方式</span>
                  </h4>
                  <p className="text-gray-700">
                    可从丽江古城包车前往，或预约旅行管家提供接送服务
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'videos' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Video className="w-5 h-5 text-purple-600" />
                    <h4 className="text-gray-800">相关视频推荐</h4>
                  </div>
                  
                  {/* 视频列表 */}
                  <div className="space-y-3">
                    {[
                      { title: `${selectedAttraction.name}游玩攻略`, views: '12.5万', duration: '05:23' },
                      { title: `带你逛遍${selectedAttraction.name}`, views: '8.3万', duration: '08:15' },
                      { title: `${selectedAttraction.name}美食推荐`, views: '6.7万', duration: '04:50' }
                    ].map((video, index) => (
                      <div key={index} className="bg-white rounded-xl p-3 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex gap-3">
                          <div className="w-24 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Camera className="w-8 h-8 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 mb-1 truncate">{video.title}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>▶ {video.views}</span>
                              <span>⏱ {video.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Camera className="w-5 h-5 text-sky-600" />
                    <h4 className="text-gray-800">摄影攻略</h4>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    最佳拍照时间：清晨和傍晚的柔和光线<br/>
                    推荐机位：主入口全景、特色建筑细节<br/>
                    拍照技巧：利用自然光线，避开人流高峰
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

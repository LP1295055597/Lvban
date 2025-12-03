import { useState, useEffect } from 'react';
import { Bell, Clock, MapPin, Users, Calendar, FileText, X, Sparkles, CheckCircle, AlertCircle, Award, TrendingUp, Info } from 'lucide-react';
import { GuideLevelInfo } from './GuideLevelInfo';
import { 
  calculateLevel, 
  calculatePoints, 
  calculateCommissionRate, 
  GUIDE_LEVELS, 
  formatCommissionRate,
  getLevelProgress,
  getPointsToNextLevel 
} from '../utils/guideLevelSystem';

interface OrderRequest {
  id: string;
  date: string;
  time: string;
  maleCount: number;
  femaleCount: number;
  additionalNotes: string;
  matchFilters: {
    skill?: string;
    certified?: string;
    gender?: string;
    priceRange?: string;
    vehicle?: string;
  };
  postedTime: string;
  touristInfo: {
    name: string;
    avatar: string;
  };
}

interface GrabbedOrder extends OrderRequest {
  grabbedTime: string;
  status: 'pending' | 'accepted' | 'rejected';
  source?: 'grab' | 'booking'; // 订单来源：抢单 or 预约
}

interface GuideOrderManagementProps {
  hasNewOrders?: boolean;
  onOrderGrabbed?: () => void;
}

export function GuideOrderManagement({ hasNewOrders = false, onOrderGrabbed }: GuideOrderManagementProps) {
  const [availableOrders, setAvailableOrders] = useState<OrderRequest[]>([]);
  const [grabbedOrders, setGrabbedOrders] = useState<GrabbedOrder[]>([]);
  const [bookingOrders, setBookingOrders] = useState<GrabbedOrder[]>([]); // 游客主动预约的订单
  const [selectedOrder, setSelectedOrder] = useState<OrderRequest | null>(null);
  const [showGrabModal, setShowGrabModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<GrabbedOrder | null>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'booking' | 'confirmed'>('available');
  const [showNotification, setShowNotification] = useState(false);
  const [showLevelInfo, setShowLevelInfo] = useState(false);

  // 地陪等级数据（模拟数据，实际应从后端获取）
  const guideStats = {
    orderCount: 156,
    goodReviewCount: 140,
    hasPhotography: true,
    hasVehicle: false,
    isVerified: true
  };
  
  const totalPoints = calculatePoints(
    guideStats.orderCount,
    guideStats.goodReviewCount,
    guideStats.hasPhotography,
    guideStats.hasVehicle
  );
  const guideLevel = calculateLevel(totalPoints);
  const levelInfo = GUIDE_LEVELS[guideLevel];
  const commissionRate = calculateCommissionRate(guideLevel, guideStats.isVerified);
  const levelProgress = getLevelProgress(totalPoints);
  const pointsToNext = getPointsToNextLevel(totalPoints);

  // 模拟新订单推送
  useEffect(() => {
    // 初始化一些可抢订单
    const mockOrders: OrderRequest[] = [
      {
        id: 'order-1',
        date: '2024-12-25',
        time: '全天',
        maleCount: 2,
        femaleCount: 1,
        additionalNotes: '想去玉龙雪山，需要拍照',
        matchFilters: {
          skill: '摄影高手',
          vehicle: '有车',
          priceRange: '100-150元'
        },
        postedTime: new Date().toISOString(),
        touristInfo: {
          name: '张三',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400'
        }
      },
      {
        id: 'order-2',
        date: '2024-12-26',
        time: '上午',
        maleCount: 1,
        femaleCount: 0,
        additionalNotes: '想了解丽江历史文化',
        matchFilters: {
          skill: '历史讲解',
          certified: '是',
          priceRange: '100-150元'
        },
        postedTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        touristInfo: {
          name: '李四',
          avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400'
        }
      }
    ];

    // 初始化一些游客主动预约的订单
    const mockBookingOrders: GrabbedOrder[] = [
      {
        id: 'booking-1',
        date: '2024-12-28',
        time: '下午',
        maleCount: 2,
        femaleCount: 2,
        additionalNotes: '一家人出游，希望带我们游览古城',
        matchFilters: {},
        postedTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        touristInfo: {
          name: '王芳',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
        },
        grabbedTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: 'pending',
        source: 'booking'
      },
      {
        id: 'booking-2',
        date: '2024-12-29',
        time: '全天',
        maleCount: 1,
        femaleCount: 1,
        additionalNotes: '情侣旅行，想拍照打卡',
        matchFilters: {},
        postedTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        touristInfo: {
          name: '赵强',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
        },
        grabbedTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        source: 'booking'
      }
    ];

    setAvailableOrders(mockOrders);
    setBookingOrders(mockBookingOrders);

    // 显示新订单通知
    if (hasNewOrders) {
      setShowNotification(true);
      playNotificationSound();
      setTimeout(() => setShowNotification(false), 5000);
    }
  }, [hasNewOrders]);

  const playNotificationSound = () => {
    // 播放提示音（实际项目中使用真实音频）
    console.log('🔔 新订单提示音播放');
  };

  const handleGrabOrder = (order: OrderRequest) => {
    setSelectedOrder(order);
    setShowGrabModal(true);
  };

  const confirmGrab = () => {
    if (!selectedOrder) return;

    const grabbedOrder: GrabbedOrder = {
      ...selectedOrder,
      grabbedTime: new Date().toISOString(),
      status: 'pending',
      source: 'grab'
    };

    // 从可抢订单中移除
    setAvailableOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
    
    // 添加到已抢订单
    setGrabbedOrders(prev => [grabbedOrder, ...prev]);

    setShowGrabModal(false);
    setSelectedOrder(null);

    // 通知父组件
    if (onOrderGrabbed) {
      onOrderGrabbed();
    }

    // 显示成功提示
    alert('抢单成功！游客将在匹配页面看到您的信息');
  };

  const handleAcceptBooking = (order: GrabbedOrder) => {
    // 接受预约
    setBookingOrders(prev => prev.filter(o => o.id !== order.id));
    setGrabbedOrders(prev => [{...order, status: 'accepted'}, ...prev]);
    alert('已接受预约！订单已移至已接订单');
  };

  const handleRejectBooking = (order: GrabbedOrder) => {
    // 拒绝预约
    if (confirm('确定要拒绝这个预约吗？')) {
      setBookingOrders(prev => prev.filter(o => o.id !== order.id));
      alert('已拒绝预约');
    }
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

  return (
    <div className="min-h-screen pb-20">
      {/* 新订单通知 */}
      {showNotification && (
        <div className="fixed top-20 left-4 right-4 z-50 animate-slide-down">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-red-500/30 blur-xl rounded-2xl"></div>
            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-orange-200 flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-gray-800 mb-1">🎉 新订单来啦！</h4>
                <p className="text-sm text-gray-600">有 {availableOrders.length} 个订单等待抢单</p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Level Info Card */}
      <div className="px-4 pt-4 pb-3">
        <div className="relative">
          <div className={`absolute inset-0 ${
            guideLevel === 'gold' ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20' :
            guideLevel === 'senior' ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20' :
            guideLevel === 'intermediate' ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20' :
            'bg-gradient-to-r from-gray-500/20 to-slate-500/20'
          } blur-xl rounded-2xl`}></div>
          <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 ${levelInfo.bgColor} rounded-2xl flex items-center justify-center text-2xl`}>
                  {levelInfo.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`${levelInfo.color}`}>{levelInfo.name}旅行管家</h3>
                    {guideStats.isVerified && (
                      <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        已认证
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{totalPoints}积分</p>
                </div>
              </div>
              <button
                onClick={() => setShowLevelInfo(true)}
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2 text-xs text-gray-600">
                <span>等级进度</span>
                {pointsToNext !== null && (
                  <span>再获得 {pointsToNext} 积分升级</span>
                )}
              </div>
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${
                    guideLevel === 'gold' ? 'from-amber-400 to-amber-500' :
                    guideLevel === 'senior' ? 'from-purple-400 to-purple-500' :
                    guideLevel === 'intermediate' ? 'from-blue-400 to-blue-500' :
                    'from-gray-400 to-gray-500'
                  } rounded-full transition-all duration-500`}
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 border border-blue-100">
                <div className={`${levelInfo.color} text-xl mb-1`}>
                  {formatCommissionRate(commissionRate)}
                </div>
                <div className="text-xs text-gray-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>平台抽成</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
                <div className="text-purple-600 text-xl mb-1">{guideStats.orderCount}</div>
                <div className="text-xs text-gray-600 flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  <span>完成订单</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-3 border border-amber-100">
                <div className="text-amber-600 text-xl mb-1">{guideStats.goodReviewCount}</div>
                <div className="text-xs text-gray-600 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>好评数量</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pb-3">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl rounded-2xl"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-1.5 shadow-lg border border-white/20 grid grid-cols-3 gap-1.5">
            <button
              onClick={() => setActiveTab('available')}
              className={`py-3 rounded-xl transition-all flex items-center justify-center gap-2 relative ${
                activeTab === 'available'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
                  : 'text-gray-600 hover:bg-gray-50/50'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${activeTab === 'available' ? 'animate-pulse' : ''}`} />
              <span className="font-medium">可抢订单</span>
              {availableOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-white shadow-lg">
                  {availableOrders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('booking')}
              className={`py-3 rounded-xl transition-all flex items-center justify-center gap-2 relative ${
                activeTab === 'booking'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-600 hover:bg-gray-50/50'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">预约订单</span>
              {bookingOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-white shadow-lg">
                  {bookingOrders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('confirmed')}
              className={`py-3 rounded-xl transition-all flex items-center justify-center gap-2 relative ${
                activeTab === 'confirmed'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                  : 'text-gray-600 hover:bg-gray-50/50'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">已抢订单</span>
              {grabbedOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-white shadow-lg">
                  {grabbedOrders.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-3">
        {activeTab === 'available' ? (
          <>
            {availableOrders.length === 0 ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 to-gray-200/50 blur-2xl rounded-3xl"></div>
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-12 text-center shadow-lg border border-white/20">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-gray-800 mb-2">暂无可抢订单</h3>
                  <p className="text-sm text-gray-500">有新订单时我们会第一时间通知您</p>
                </div>
              </div>
            ) : (
              availableOrders.map((order) => (
                <div key={order.id} className="relative animate-slide-down">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20 blur-2xl rounded-3xl"></div>
                  <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-4 shadow-xl border border-white/20">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-100">
                      <div className="flex items-start gap-3">
                        <img
                          src={order.touristInfo.avatar}
                          alt={order.touristInfo.name}
                          className="w-12 h-12 rounded-full object-cover shadow-md"
                        />
                        <div>
                          <h4 className="text-gray-800 mb-0.5">{order.touristInfo.name}</h4>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{getTimeAgo(order.postedTime)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs shadow-lg shadow-orange-500/30 animate-pulse">
                        可抢单
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <span className="text-gray-600">日期：</span>
                          <span className="text-gray-800">{order.date} · {order.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <span className="text-gray-600">人数：</span>
                          <span className="text-gray-800">
                            共{order.maleCount + order.femaleCount}人 (男{order.maleCount}人，女{order.femaleCount}人)
                          </span>
                        </div>
                      </div>

                      {order.additionalNotes && (
                        <div className="flex items-start gap-2 text-sm">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-600">备注：</span>
                            <span className="text-gray-800">{order.additionalNotes}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Match Filters */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-3 mb-3 border border-blue-100">
                      <h5 className="text-xs text-gray-600 mb-2">游客筛选条件</h5>
                      <div className="flex flex-wrap gap-2">
                        {order.matchFilters.skill && (
                          <span className="bg-white text-purple-700 text-xs px-2.5 py-1 rounded-full border border-purple-200">
                            ⭐ {order.matchFilters.skill}
                          </span>
                        )}
                        {order.matchFilters.certified && (
                          <span className="bg-white text-blue-700 text-xs px-2.5 py-1 rounded-full border border-blue-200">
                            🛡️ 平台认证
                          </span>
                        )}
                        {order.matchFilters.vehicle && (
                          <span className="bg-white text-orange-700 text-xs px-2.5 py-1 rounded-full border border-orange-200">
                            🚗 {order.matchFilters.vehicle}
                          </span>
                        )}
                        {order.matchFilters.priceRange && (
                          <span className="bg-white text-green-700 text-xs px-2.5 py-1 rounded-full border border-green-200">
                            💰 {order.matchFilters.priceRange}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleGrabOrder(order)}
                      className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-3 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 group"
                    >
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      <span>立即抢单</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        ) : activeTab === 'booking' ? (
          <>
            {bookingOrders.length === 0 ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 to-gray-200/50 blur-2xl rounded-3xl"></div>
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-12 text-center shadow-lg border border-white/20">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-gray-800 mb-2">暂无预约订单</h3>
                  <p className="text-sm text-gray-500">去可抢订单中抢单吧</p>
                </div>
              </div>
            ) : (
              bookingOrders.map((order) => (
                <div key={order.id} className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 blur-2xl rounded-3xl"></div>
                  <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-4 shadow-xl border border-white/20">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-100">
                      <div className="flex items-start gap-3">
                        <img
                          src={order.touristInfo.avatar}
                          alt={order.touristInfo.name}
                          className="w-12 h-12 rounded-full object-cover shadow-md"
                        />
                        <div>
                          <h4 className="text-gray-800 mb-0.5">{order.touristInfo.name}</h4>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>预约于 {getTimeAgo(order.grabbedTime)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs shadow-lg shadow-blue-500/30 animate-pulse">
                        待确认
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <span className="text-gray-600">日期：</span>
                          <span className="text-gray-800">{order.date} · {order.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <span className="text-gray-600">人数：</span>
                          <span className="text-gray-800">
                            共{order.maleCount + order.femaleCount}人 (男{order.maleCount}人，女{order.femaleCount}人)
                          </span>
                        </div>
                      </div>

                      {order.additionalNotes && (
                        <div className="flex items-start gap-2 text-sm">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-600">备注：</span>
                            <span className="text-gray-800">{order.additionalNotes}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Info Box */}
                    <div className="mb-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-3 border border-blue-200">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">👤</span>
                        <div className="flex-1 text-xs text-blue-800">
                          <p className="font-medium mb-1">游客主动预约</p>
                          <p className="text-blue-700">该游客在浏览旅行管家列表时主动选择了您，请及时确认是否接单</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRejectBooking(order)}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        <span>拒绝预约</span>
                      </button>
                      <button
                        onClick={() => handleAcceptBooking(order)}
                        className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all flex items-center justify-center gap-2 group"
                      >
                        <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>接受预约</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        ) : (
          <>
            {grabbedOrders.length === 0 ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 to-gray-200/50 blur-2xl rounded-3xl"></div>
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-12 text-center shadow-lg border border-white/20">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-gray-800 mb-2">暂无已抢订单</h3>
                  <p className="text-sm text-gray-500">去可抢订单中抢单吧</p>
                </div>
              </div>
            ) : (
              grabbedOrders.map((order) => (
                <div key={order.id} className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 blur-2xl rounded-3xl"></div>
                  <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-4 shadow-xl border border-white/20">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-100">
                      <div className="flex items-start gap-3">
                        <img
                          src={order.touristInfo.avatar}
                          alt={order.touristInfo.name}
                          className="w-12 h-12 rounded-full object-cover shadow-md"
                        />
                        <div>
                          <h4 className="text-gray-800 mb-0.5">{order.touristInfo.name}</h4>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{order.source === 'booking' ? '接单于' : '抢单于'} {getTimeAgo(order.grabbedTime)}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs shadow-lg ${
                        order.source === 'booking' 
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/30'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/30'
                      }`}>
                        {order.source === 'booking' ? '已接单' : '已抢单'}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <span className="text-gray-600">日期：</span>
                          <span className="text-gray-800">{order.date} · {order.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <span className="text-gray-600">人数：</span>
                          <span className="text-gray-800">
                            共{order.maleCount + order.femaleCount}人 (男{order.maleCount}人，女{order.femaleCount}人)
                          </span>
                        </div>
                      </div>

                      {order.additionalNotes && (
                        <div className="flex items-start gap-2 text-sm">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-600">备注：</span>
                            <span className="text-gray-800">{order.additionalNotes}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    {order.source === 'booking' ? (
                      <div className="mt-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 text-xs text-green-800">
                            <p className="font-medium mb-1">游客已确认预约</p>
                            <p className="text-green-700">该游客主动预约了您，您已接受预约，请按时提供优质服务</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 bg-yellow-50 rounded-xl p-3 border border-yellow-200">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 text-xs text-yellow-800">
                            <p className="font-medium mb-1">等待游客确认</p>
                            <p className="text-yellow-700">您已成功抢单，游客将在24小时内选择旅行管家并确认订单</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* Grab Order Modal */}
      {showGrabModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-red-500/30 blur-2xl rounded-3xl"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
                <h3 className="text-gray-800">确认抢单</h3>
                <button
                  onClick={() => setShowGrabModal(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Tourist Info */}
                <div className="flex items-center gap-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
                  <img
                    src={selectedOrder.touristInfo.avatar}
                    alt={selectedOrder.touristInfo.name}
                    className="w-14 h-14 rounded-full object-cover shadow-md"
                  />
                  <div>
                    <h4 className="text-gray-800">{selectedOrder.touristInfo.name}</h4>
                    <p className="text-sm text-gray-500">游客</p>
                  </div>
                </div>

                {/* Order Info */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">服务时间</p>
                      <p className="text-sm text-gray-800">{selectedOrder.date} · {selectedOrder.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Users className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">服务人数</p>
                      <p className="text-sm text-gray-800">
                        共{selectedOrder.maleCount + selectedOrder.femaleCount}人 (男{selectedOrder.maleCount}人，女{selectedOrder.femaleCount}人)
                      </p>
                    </div>
                  </div>

                  {selectedOrder.additionalNotes && (
                    <div className="flex items-start gap-2">
                      <FileText className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-0.5">补充说明</p>
                        <p className="text-sm text-gray-800">{selectedOrder.additionalNotes}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tips */}
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 text-sm text-amber-800">
                      <p className="font-medium mb-1">抢单说明</p>
                      <ul className="space-y-1 text-xs text-amber-700">
                        <li>• 抢单成功后，您的信息将展示游客</li>
                        <li>• 游客会在24小时内选择旅行管家</li>
                        <li>• 被选中后系统将通知您确认订单</li>
                        <li>• 请确保在服务时间内有空</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowGrabModal(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={confirmGrab}
                    className="flex-1 py-3 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>确认抢单</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Level Info Modal */}
      {showLevelInfo && (
        <GuideLevelInfo onClose={() => setShowLevelInfo(false)} />
      )}
    </div>
  );
}
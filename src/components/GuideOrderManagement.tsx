import { useState } from 'react';
import { Clock, MapPin, Users, Calendar, MessageCircle, Check, X, User, Navigation } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChatDialog } from './ChatDialog';
import { getMeetingPointById, calculateDistance, formatDistance } from '../data/meetingPoints';

interface Order {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  destination: string;
  date: string;
  timeSlot: string;
  requirements: string;
  status: 'pending' | 'accepted' | 'completed';
  price: string;
  meetingPointId: string; // 聚集点ID
}

const mockOrders: Order[] = [
  {
    id: 1,
    userId: 1,
    userName: '旅行者小美',
    userAvatar: 'https://images.unsplash.com/photo-1535208632259-841d129a6af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdHJhdmVsfGVufDF8fHx8MTc2NDU5ODc5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    destination: '丽江古城+玉龙雪山',
    date: '2024-12-25',
    timeSlot: '09:00-18:00',
    requirements: '希望能拍一些好看的照片，对纳西族文化比较感兴趣，想了解当地的历史故事。中午想品尝地道的丽江美食。',
    status: 'pending',
    price: '400元',
    meetingPointId: 'gucheng-dashuiche'
  },
  {
    id: 2,
    userId: 2,
    userName: '张先生',
    userAvatar: 'https://images.unsplash.com/photo-1633177188754-980c2a6b6266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDUzMzYyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    destination: '束河古镇+黑龙潭公园',
    date: '2024-12-23',
    timeSlot: '14:00-18:00',
    requirements: '下午半天时间，想去相对安静的景点，避开人群。希望地陪能推荐一些小众但有特色的地方。',
    status: 'pending',
    price: '250元',
    meetingPointId: 'shuhe-rukou'
  },
  {
    id: 3,
    userId: 3,
    userName: '李女士',
    userAvatar: 'https://images.unsplash.com/photo-1535208632259-841d129a6af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdHJhdmVsfGVufDF8fHx8MTc2NDU5ODc5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    destination: '丽江古城深度游',
    date: '2024-12-22',
    timeSlot: '09:00-15:00',
    requirements: '一家三口出游，带着8岁的孩子。希望能安排一些适合孩子的活动，节奏不要太快。',
    status: 'accepted',
    price: '350元',
    meetingPointId: 'gucheng-sifangjie'
  },
  {
    id: 4,
    userId: 4,
    userName: '王先生',
    userAvatar: 'https://images.unsplash.com/photo-1633177188754-980c2a6b6266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDUzMzYyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    destination: '玉龙雪山一日游',
    date: '2024-12-21',
    timeSlot: '08:00-17:00',
    requirements: '希望能去蓝月谷和雪山，拍一些风景照。有轻微高反，需要注意休息。',
    status: 'accepted',
    price: '500元',
    meetingPointId: 'yulong-youke'
  },
  {
    id: 5,
    userId: 5,
    userName: '赵女士',
    userAvatar: 'https://images.unsplash.com/photo-1535208632259-841d129a6af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdHJhdmVsfGVufDF8fHx8MTc2NDU5ODc5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    destination: '美食探店一日游',
    date: '2024-12-20',
    timeSlot: '10:00-20:00',
    requirements: '美食爱好者，想尝遍丽江特色小吃和餐厅。希望地陪能带我去当地人常去的地方。',
    status: 'completed',
    price: '300元',
    meetingPointId: 'keyunzhan'
  }
];

export function GuideOrderManagement() {
  const [selectedTab, setSelectedTab] = useState<'pending' | 'accepted' | 'completed'>('pending');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [chatOrder, setChatOrder] = useState<Order | null>(null);

  const handleAcceptOrder = (orderId: number) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'accepted' as const } : order
    ));
  };

  const handleRejectOrder = (orderId: number) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  const filteredOrders = orders.filter(order => order.status === selectedTab);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: '待接单', color: 'bg-orange-100 text-orange-600', icon: Clock };
      case 'accepted':
        return { text: '已接单', color: 'bg-blue-100 text-blue-600', icon: Check };
      case 'completed':
        return { text: '已完成', color: 'bg-green-100 text-green-600', icon: Check };
      default:
        return { text: '未知', color: 'bg-gray-100 text-gray-600', icon: Clock };
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
        <h2 className="mb-2">我的预约</h2>
        <p className="text-white/90 text-sm">管理您的服务订单</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
          <div className="text-orange-600 mb-1">
            {orders.filter(o => o.status === 'pending').length}
          </div>
          <div className="text-gray-600 text-xs">待接单</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
          <div className="text-blue-600 mb-1">
            {orders.filter(o => o.status === 'accepted').length}
          </div>
          <div className="text-gray-600 text-xs">进行中</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
          <div className="text-green-600 mb-1">
            {orders.filter(o => o.status === 'completed').length}
          </div>
          <div className="text-gray-600 text-xs">已完成</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm">
        <button
          onClick={() => setSelectedTab('pending')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            selectedTab === 'pending'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          待接单
        </button>
        <button
          onClick={() => setSelectedTab('accepted')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            selectedTab === 'accepted'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          已接单
        </button>
        <button
          onClick={() => setSelectedTab('completed')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            selectedTab === 'completed'
              ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          已完成
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="text-gray-400 text-4xl mb-3">📋</div>
            <p className="text-gray-500">暂无{getStatusInfo(selectedTab).text}订单</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;
            const meetingPoint = getMeetingPointById(order.meetingPointId);
            // 假设地陪当前位置在丽江古城中心（实际应从真实位置获取）
            const guideLocation = { latitude: 26.8774, longitude: 100.2298 };
            const distance = meetingPoint 
              ? calculateDistance(
                  guideLocation.latitude,
                  guideLocation.longitude,
                  meetingPoint.latitude,
                  meetingPoint.longitude
                )
              : null;

            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <ImageWithFallback
                        src={order.userAvatar}
                        alt={order.userName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white"
                      />
                      <div>
                        <h3 className="text-gray-800">{order.userName}</h3>
                        <p className="text-gray-500 text-sm">预约服务</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${statusInfo.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusInfo.text}
                    </span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-gray-600 text-sm">目的地</span>
                      <p className="text-gray-800">{order.destination}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-gray-600 text-sm">日期</span>
                      <p className="text-gray-800">{order.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-gray-600 text-sm">时间</span>
                      <p className="text-gray-800">{order.timeSlot}</p>
                    </div>
                  </div>

                  {/* Meeting Point - Show for accepted orders */}
                  {order.status === 'accepted' && meetingPoint && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                      <div className="flex items-start gap-2 mb-2">
                        <Navigation className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-700 font-medium">集合点</span>
                            {distance !== null && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                距离 {formatDistance(distance)}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-800">{meetingPoint.name}</p>
                          <p className="text-gray-600 text-xs mt-1">{meetingPoint.address}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">用户需求</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{order.requirements}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-gray-600 text-sm">服务费用</span>
                      <p className="text-orange-600 text-xl">{order.price}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  {order.status === 'pending' ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleRejectOrder(order.id)}
                        className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="w-5 h-5" />
                        拒绝
                      </button>
                      <button
                        onClick={() => handleAcceptOrder(order.id)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <Check className="w-5 h-5" />
                        接单
                      </button>
                    </div>
                  ) : order.status === 'accepted' ? (
                    <button
                      onClick={() => setChatOrder(order)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      联系游客
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setChatOrder(order)}
                        className="flex-1 py-3 border-2 border-blue-500 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-5 h-5" />
                        查看聊天
                      </button>
                      <button className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl hover:opacity-90 transition-opacity">
                        再次邀约
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Chat Dialog */}
      {chatOrder && (
        <ChatDialog
          guideName="阿秀"
          guideAvatar="https://images.unsplash.com/photo-1643646805556-350c057663dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcG9ydHJhaXQlMjBzbWlsZXxlbnwxfHx8fDE3NjQ1NTE0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080"
          onClose={() => setChatOrder(null)}
          hasActiveOrder={true}
          isGuideView={true}
          userName={chatOrder.userName}
        />
      )}
    </div>
  );
}
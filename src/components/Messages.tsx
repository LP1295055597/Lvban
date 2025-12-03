import { useState } from 'react';
import { Bell, MessageCircle, Search, Circle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChatDialog } from './ChatDialog';

interface ChatItem {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  type: 'guide' | 'mate' | 'system' | 'group';
  online?: boolean;
  groupMembers?: { name: string; avatar: string }[];
  memberCount?: number;
}

interface Notification {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  type: 'order' | 'match' | 'system' | 'review';
  read: boolean;
}

const mockChats: ChatItem[] = [
  {
    id: 1,
    name: '旅行管家阿秀',
    avatar: 'https://images.unsplash.com/photo-1643646805556-350c057663dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcG9ydHJhaXQlMjBzbWlsZXxlbnwxfHx8fDE3NjQ1NTE0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    lastMessage: '好的，明天早上9点在古城大门见面吧！',
    timestamp: '10:30',
    unread: 2,
    type: 'guide',
    online: true
  },
  {
    id: 2,
    name: '旅行者小明',
    avatar: 'https://images.unsplash.com/photo-1633177188754-980c2a6b6266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDUzMzYyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    lastMessage: '玉龙雪山一日游，有兴趣一起吗？',
    timestamp: '昨天',
    unread: 0,
    type: 'mate',
    online: false
  },
  {
    id: 3,
    name: '旅行管家小李',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDU5ODc5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    lastMessage: '感谢您的预约，我会提前准备好行程',
    timestamp: '昨天',
    unread: 0,
    type: 'guide',
    online: true
  },
  {
    id: 4,
    name: '系统消息',
    avatar: '',
    lastMessage: '您有新的订单待处理',
    timestamp: '2天前',
    unread: 1,
    type: 'system',
    online: false
  },
  {
    id: 5,
    name: '旅行者小红',
    avatar: 'https://images.unsplash.com/photo-1535208632259-841d129a6af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdHJhdmVsfGVufDF8fHx8MTc2NDU5ODc5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    lastMessage: '周末去泸沽湖，还差一个人！',
    timestamp: '3天前',
    unread: 0,
    type: 'mate',
    online: false
  },
  {
    id: 6,
    name: '旅行者小美',
    avatar: 'https://images.unsplash.com/photo-1535208632259-841d129a6af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdHJhdmVsfGVufDF8fHx8MTc2NDU5ODc5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    lastMessage: '我们一起去丽江古城吧！',
    timestamp: '3天前',
    unread: 0,
    type: 'group',
    online: false,
    groupMembers: [
      { name: '旅行者小美', avatar: 'https://images.unsplash.com/photo-1535208632259-841d129a6af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdHJhdmVsfGVufDF8fHx8MTc2NDU5ODc5OXww&ixlib=rb-4.1.0&q=80&w=1080' },
      { name: '旅行者小红', avatar: 'https://images.unsplash.com/photo-1535208632259-841d129a6af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdHJhdmVsfGVufDF8fHx8MTc2NDU5ODc5OXww&ixlib=rb-4.1.0&q=80&w=1080' }
    ],
    memberCount: 2
  }
];

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: '新订单提醒',
    content: '用户"旅行者小美"向您发起了一个预约请求，请及时处理',
    timestamp: '2小时前',
    type: 'order',
    read: false
  },
  {
    id: 2,
    title: '搭子匹配成功',
    content: '您发布的"玉龙雪山一日游"找到了2位感兴趣的旅伴',
    timestamp: '5小时前',
    type: 'match',
    read: false
  },
  {
    id: 3,
    title: '收到新评价',
    content: '用户"张先生"给您的服务打了5星好评',
    timestamp: '昨天',
    type: 'review',
    read: true
  },
  {
    id: 4,
    title: '系统通知',
    content: '您的认证信息即将过期，请及时更新',
    timestamp: '2天前',
    type: 'system',
    read: true
  },
  {
    id: 5,
    title: '行程提醒',
    content: '明天9点您有一个预约服务，请提前做好准备',
    timestamp: '3天前',
    type: 'order',
    read: true
  }
];

export function Messages() {
  const [activeTab, setActiveTab] = useState<'chats' | 'notifications'>('chats');
  const [chats, setChats] = useState<ChatItem[]>(mockChats);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchText, setSearchText] = useState('');
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);

  const unreadChats = chats.filter(chat => chat.unread > 0).length;
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchText.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleMarkAsRead = (notificationId: number) => {
    setNotifications(notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'match':
        return '🤝';
      case 'review':
        return '⭐';
      case 'system':
        return '🔔';
      default:
        return '📢';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide':
        return 'bg-blue-100 text-blue-600';
      case 'mate':
        return 'bg-purple-100 text-purple-600';
      case 'system':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4 px-4 pt-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索聊天记录..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex-1 py-2 rounded-lg transition-colors relative ${
              activeTab === 'chats'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MessageCircle className="w-4 h-4 inline-block mr-1" />
            聊天
            {unreadChats > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadChats}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-2 rounded-lg transition-colors relative ${
              activeTab === 'notifications'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Bell className="w-4 h-4 inline-block mr-1" />
            通知
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>
        </div>

        {/* Chats List */}
        {activeTab === 'chats' && (
          <div className="space-y-2">
            {filteredChats.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                <div className="text-gray-400 text-4xl mb-3">💬</div>
                <p className="text-gray-500">
                  {searchText ? '没有找到相关聊天' : '暂无聊天记录'}
                </p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => chat.type !== 'system' && setSelectedChat(chat)}
                  className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {chat.type === 'system' ? (
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                          <Bell className="w-6 h-6 text-white" />
                        </div>
                      ) : (
                        <ImageWithFallback
                          src={chat.avatar}
                          alt={chat.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      {chat.online && chat.type !== 'system' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                      {chat.unread > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {chat.unread}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-gray-800">{chat.name}</h3>
                          {chat.type !== 'system' && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(chat.type)}`}>
                              {chat.type === 'guide' ? '旅行管家' : '搭子'}
                            </span>
                          )}
                        </div>
                        <span className="text-gray-500 text-xs flex-shrink-0 ml-2">
                          {chat.timestamp}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${chat.unread > 0 ? 'text-gray-800' : 'text-gray-500'}`}>
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* Notifications List */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            {unreadNotifications > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-blue-600 text-sm hover:underline"
              >
                全部标记为已读
              </button>
            )}

            {notifications.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                <div className="text-gray-400 text-4xl mb-3">🔔</div>
                <p className="text-gray-500">暂无通知</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                  className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
                    !notification.read ? 'border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="text-2xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`text-gray-800 ${!notification.read ? '' : 'opacity-70'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-gray-500 text-xs flex-shrink-0 ml-2">
                          {notification.timestamp}
                        </span>
                      </div>
                      <p className={`text-sm ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
                        {notification.content}
                      </p>
                      {!notification.read && (
                        <div className="mt-2">
                          <Circle className="w-2 h-2 fill-blue-500 text-blue-500 inline-block mr-1" />
                          <span className="text-blue-600 text-xs">未读</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Chat Dialog */}
      {selectedChat && (
        <ChatDialog
          guideName={selectedChat.name}
          guideAvatar={selectedChat.avatar}
          onClose={() => setSelectedChat(null)}
          hasActiveOrder={selectedChat.type === 'guide'}
          isGuideView={false}
          userName="我"
        />
      )}
    </div>
  );
}
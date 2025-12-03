import { useState } from 'react';
import { Home } from './components/Home';
import { TravelMates } from './components/TravelMates';
import { GuideOrders } from './components/GuideOrders';
import { GuideOrderManagement } from './components/GuideOrderManagement';
import { Messages } from './components/Messages';
import { Profile } from './components/Profile';
import { LocationRequest, LocationData } from './components/LocationRequest';
import { LoginPage } from './components/LoginPage';
import { Home as HomeIcon, Users, Briefcase, MessageCircle, User } from 'lucide-react';
import { Toaster } from 'sonner@2.0.3';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'mates' | 'guide' | 'messages' | 'profile'>('home');
  const [userRole, setUserRole] = useState<'tourist' | 'guide'>('tourist');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [showLocationRequest, setShowLocationRequest] = useState(false);
  const [touristVerified, setTouristVerified] = useState(false);
  const [hasNewOrders, setHasNewOrders] = useState(true); // 新订单提示

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLocationRequest(true);
  };

  const handleLocationGranted = (locationData: LocationData) => {
    setLocation(locationData);
    setShowLocationRequest(false);
    console.log('用户位置:', locationData);
  };

  const handleLocationDenied = () => {
    setShowLocationRequest(false);
  };

  // 显示登录页面
  if (!isLoggedIn) {
    return (
      <>
        <LoginPage onLoginSuccess={handleLoginSuccess} />
        <Toaster position="top-center" />
      </>
    );
  }

  // 显示位置请求
  if (showLocationRequest) {
    return (
      <LocationRequest
        onLocationGranted={handleLocationGranted}
        onLocationDenied={handleLocationDenied}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-green-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/90 border-b border-sky-100/50 shadow-sm">
        <div className="max-w-md mx-auto px-6 py-4">
          <h1 className="bg-gradient-to-r from-sky-500 via-sky-400 to-green-400 bg-clip-text text-transparent text-center">
            旅伴
          </h1>
          <p className="text-center text-sm text-gray-600 mt-1">
            {location?.city 
              ? `📍 ${location.city}${location.city !== '丽江市' ? ' → 丽江市' : ''}`
              : '找搭子 · 约旅行管家 · 游丽江'
            }
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto">
        {activeTab === 'home' && <Home userLocation={location} onNavigate={setActiveTab} />}
        {activeTab === 'mates' && <TravelMates userLocation={location} />}
        {activeTab === 'guide' && (
          userRole === 'tourist' ? (
            <GuideOrders userLocation={location} touristVerified={touristVerified} />
          ) : (
            <GuideOrderManagement 
              hasNewOrders={hasNewOrders}
              onOrderGrabbed={() => setHasNewOrders(false)}
            />
          )
        )}
        {activeTab === 'messages' && <Messages />}
        {activeTab === 'profile' && (
          <Profile 
            userRole={userRole} 
            onRoleChange={setUserRole}
            touristVerified={touristVerified}
            onTouristVerified={() => setTouristVerified(true)}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30">
        <div className="max-w-md mx-auto">
          {/* Glassmorphism Background */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white/95 to-white/80 backdrop-blur-2xl border-t border-white/20"></div>
            
            {/* Navigation Items */}
            <div className="relative grid grid-cols-5 px-2 py-3">
              <button
                onClick={() => setActiveTab('home')}
                className="flex flex-col items-center gap-1 group"
              >
                <div className={`relative transition-all duration-300 ${
                  activeTab === 'home' 
                    ? 'scale-110' 
                    : 'group-hover:scale-105'
                }`}>
                  {activeTab === 'home' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-sky-500 rounded-2xl blur-lg opacity-60 animate-pulse"></div>
                  )}
                  <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    activeTab === 'home'
                      ? 'bg-gradient-to-br from-sky-400 to-sky-500 shadow-lg shadow-sky-400/50'
                      : 'bg-gray-100/80 group-hover:bg-gray-200/80'
                  }`}>
                    <HomeIcon className={`w-5 h-5 ${
                      activeTab === 'home' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                </div>
                <span className={`text-xs transition-colors ${
                  activeTab === 'home' 
                    ? 'text-sky-600' 
                    : 'text-gray-600'
                }`}>
                  首页
                </span>
              </button>

              <button
                onClick={() => setActiveTab('mates')}
                className="flex flex-col items-center gap-1 group"
              >
                <div className={`relative transition-all duration-300 ${
                  activeTab === 'mates' 
                    ? 'scale-110' 
                    : 'group-hover:scale-105'
                }`}>
                  {activeTab === 'mates' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl blur-lg opacity-60 animate-pulse"></div>
                  )}
                  <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    activeTab === 'mates'
                      ? 'bg-gradient-to-br from-green-400 to-green-500 shadow-lg shadow-green-400/50'
                      : 'bg-gray-100/80 group-hover:bg-gray-200/80'
                  }`}>
                    <Users className={`w-5 h-5 ${
                      activeTab === 'mates' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                </div>
                <span className={`text-xs transition-colors ${
                  activeTab === 'mates' 
                    ? 'text-green-600' 
                    : 'text-gray-600'
                }`}>
                  找搭子
                </span>
              </button>

              <button
                onClick={() => setActiveTab('guide')}
                className="flex flex-col items-center gap-1 group -mt-4"
              >
                <div className={`relative transition-all duration-300 ${
                  activeTab === 'guide' 
                    ? 'scale-110' 
                    : 'group-hover:scale-105'
                }`}>
                  {activeTab === 'guide' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-green-400 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
                  )}
                  <div className={`relative w-16 h-16 rounded-3xl flex items-center justify-center transition-all ${
                    activeTab === 'guide'
                      ? 'bg-gradient-to-br from-sky-400 via-sky-500 to-green-400 shadow-2xl shadow-sky-400/50'
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-gray-200 group-hover:to-gray-300 shadow-lg'
                  }`}>
                    <Briefcase className={`w-6 h-6 ${
                      activeTab === 'guide' ? 'text-white' : 'text-gray-600'
                    }`} />
                    {/* 地陪模式新订单红点 */}
                    {userRole === 'guide' && hasNewOrders && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-lg shadow-red-500/50 border-2 border-white animate-bounce">
                        2
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-xs transition-colors ${
                  activeTab === 'guide' 
                    ? 'bg-gradient-to-r from-sky-600 to-green-600 bg-clip-text text-transparent' 
                    : 'text-gray-600'
                }`}>
                  {userRole === 'tourist' ? '旅行管家' : '订单'}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className="flex flex-col items-center gap-1 group relative"
              >
                <div className={`relative transition-all duration-300 ${
                  activeTab === 'messages' 
                    ? 'scale-110' 
                    : 'group-hover:scale-105'
                }`}>
                  {activeTab === 'messages' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-sky-500 rounded-2xl blur-lg opacity-60 animate-pulse"></div>
                  )}
                  <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    activeTab === 'messages'
                      ? 'bg-gradient-to-br from-sky-400 to-sky-500 shadow-lg shadow-sky-400/50'
                      : 'bg-gray-100/80 group-hover:bg-gray-200/80'
                  }`}>
                    <MessageCircle className={`w-5 h-5 ${
                      activeTab === 'messages' ? 'text-white' : 'text-gray-600'
                    }`} />
                    {/* Unread Badge */}
                    <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-red-500/50 animate-bounce">
                      3
                    </span>
                  </div>
                </div>
                <span className={`text-xs transition-colors ${
                  activeTab === 'messages' 
                    ? 'text-sky-600' 
                    : 'text-gray-600'
                }`}>
                  消息
                </span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className="flex flex-col items-center gap-1 group"
              >
                <div className={`relative transition-all duration-300 ${
                  activeTab === 'profile' 
                    ? 'scale-110' 
                    : 'group-hover:scale-105'
                }`}>
                  {activeTab === 'profile' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl blur-lg opacity-60 animate-pulse"></div>
                  )}
                  <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    activeTab === 'profile'
                      ? 'bg-gradient-to-br from-green-400 to-green-500 shadow-lg shadow-green-400/50'
                      : 'bg-gray-100/80 group-hover:bg-gray-200/80'
                  }`}>
                    <User className={`w-5 h-5 ${
                      activeTab === 'profile' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                </div>
                <span className={`text-xs transition-colors ${
                  activeTab === 'profile' 
                    ? 'text-green-600' 
                    : 'text-gray-600'
                }`}>
                  我的
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Toast Notifications */}
      <Toaster 
        position="top-center"
        richColors
        expand={true}
        closeButton
      />
    </div>
  );
}
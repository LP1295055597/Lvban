import { Settings, Heart, MapPin, Star, Calendar, Award, ChevronRight, LogOut, RefreshCw, UserPlus, Shield, Wallet, Briefcase, DollarSign, AlertTriangle, TrendingUp, CheckCircle, Info, Sparkles, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';
import { GuideRegistration } from './GuideRegistration';
import { GuideCertification } from './GuideCertification';
import { GuideWallet } from './GuideWallet';
import { PriceSetting } from './PriceSetting';
import { OrderAlertManagement } from './OrderAlertManagement';
import { TouristVerification } from './TouristVerification';
import { GuideProfileEdit, GuideProfileData } from './GuideProfileEdit';
import { GuideLevelInfo } from './GuideLevelInfo';
import { 
  calculateLevel, 
  calculatePoints, 
  calculateCommissionRate, 
  GUIDE_LEVELS, 
  formatCommissionRate,
  formatPriceRange,
  getLevelProgress,
  getPointsToNextLevel 
} from '../utils/guideLevelSystem';

interface ProfileProps {
  userRole: 'tourist' | 'guide';
  onRoleChange: (role: 'tourist' | 'guide') => void;
  touristVerified?: boolean;
  onTouristVerified?: () => void;
}

export function Profile({ userRole, onRoleChange, touristVerified = false, onTouristVerified }: ProfileProps) {
  const isTourist = userRole === 'tourist';
  const [showGuideRegistration, setShowGuideRegistration] = useState(false);
  const [showCertification, setShowCertification] = useState(false);
  const [certificationStatus, setCertificationStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [showWallet, setShowWallet] = useState(false);
  const [showPriceSetting, setShowPriceSetting] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(80);
  const [hasVehicle, setHasVehicle] = useState(false);
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehiclePrice, setVehiclePrice] = useState(200);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // 平台管理员身份
  const [showTouristVerification, setShowTouristVerification] = useState(false);
  const [showGuideProfileEdit, setShowGuideProfileEdit] = useState(false);
  const [showLevelInfo, setShowLevelInfo] = useState(false);
  const [guideProfileData, setGuideProfileData] = useState<GuideProfileData>({
    mediaFiles: [],
    selectedSkills: ['photography', 'food', 'local'],
    introduction: '大家好！我是本地人阿秀，从事旅行管家服务已有5年时间，接待过来自全国各地的3000+游客。我熟悉丽江的每一条街道，了解最地道的纳西美食，会说流利的英语。擅长摄影，可以帮您记录旅途中的美好瞬间。我会用心为每一位游客提供贴心、专业的服务，让您的丽江之旅留下美好回忆！'
  });

  // 地陪等级数据（模拟数据，实际应从后端获取）
  const guideStats = {
    orderCount: 156,
    goodReviewCount: 140,
    hasPhotography: true,
    hasVehicle: false,
    isVerified: certificationStatus === 'approved'
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

  // 如果显示后台管理界面，直接返回
  if (showAdminPanel) {
    return (
      <div>
        <button
          onClick={() => setShowAdminPanel(false)}
          className="p-4 flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>
        <OrderAlertManagement />
      </div>
    );
  }
  
  // 如果显示钱包，直接返回钱包页面
  if (showWallet && !isTourist) {
    return (
      <div>
        <button
          onClick={() => setShowWallet(false)}
          className="p-4 flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>
        <GuideWallet onClose={() => setShowWallet(false)} />
      </div>
    );
  }

  const handleGuideRegistrationSuccess = () => {
    alert('恭喜您！旅行管家入驻申请已提交，我们将在1-3个工作日内完成审核。审核通过后，您可以切换到旅行管家模式开始接单。');
  };

  const handleCertificationSuccess = () => {
    setCertificationStatus('pending');
  };

  return (
    <div className="p-4 space-y-4">
      {/* Role Switch Card */}
      <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl p-4 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white mb-1">当前身份</h3>
            <p className="text-white/90 text-sm">
              {isTourist ? '🧳 游客模式' : '🎒 旅行管家模式'}
            </p>
          </div>
          <button
            onClick={() => onRoleChange(isTourist ? 'guide' : 'tourist')}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">切换为{isTourist ? '旅行管家' : '游客'}</span>
          </button>
        </div>
        <div className="mt-3 pt-3 border-t border-white/20">
          <p className="text-white/80 text-xs">
            {isTourist 
              ? '💡 切换到旅行管家模式可以体验接单、时间管理、创建旅行日记等功能'
              : '💡 切换到游客模式可以体验预约旅行管家、查看行程、接收旅行日记等功能'
            }
          </p>
        </div>
      </div>

      {/* User Info Card */}
      {isTourist ? (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1535208632259-841d129a6af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdHJhdmVsfGVufDF8fHx8MTc2NDU5ODc5OXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="User Avatar"
              className="w-20 h-20 rounded-full object-cover border-4 border-white/30"
            />
            <div className="flex-1">
              <h2 className="text-white mb-1">旅行者小美</h2>
              <p className="text-white/90 text-sm mb-2">资深旅行达人</p>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                <span className="text-sm">4.8分</span>
              </div>
            </div>
            <button 
              onClick={() => setShowGuideProfileEdit(true)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
            <div className="text-center">
              <div className="text-white mb-1">23</div>
              <div className="text-white/80 text-xs">旅行次数</div>
            </div>
            <div className="text-center">
              <div className="text-white mb-1">156</div>
              <div className="text-white/80 text-xs">获赞数</div>
            </div>
            <div className="text-center">
              <div className="text-white mb-1">8</div>
              <div className="text-white/80 text-xs">找到搭子</div>
            </div>
          </div>
        </div>
      ) : (
        /* Integrated Guide Profile Card - Guide Mode Only */
        <div className="relative">
          <div className={`absolute inset-0 ${
            guideLevel === 'gold' ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20' :
            guideLevel === 'senior' ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20' :
            guideLevel === 'intermediate' ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20' :
            'bg-gradient-to-r from-gray-500/20 to-slate-500/20'
          } blur-xl rounded-2xl`}></div>
          <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/20">
            {/* Header Section */}
            <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-100">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1643646805556-350c057663dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcG9ydHJhaXQlMjBzbWlsZXxlbnwxfHx8fDE3NjQ1NTE0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Guide Avatar"
                className="w-20 h-20 rounded-2xl object-cover shadow-lg ring-4 ring-white/50"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-gray-800">旅行管家阿秀</h2>
                  <button 
                    onClick={() => setShowGuideProfileEdit(true)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`${levelInfo.bgColor} rounded-lg px-2.5 py-1 flex items-center gap-1.5`}>
                    <span className="text-lg">{levelInfo.icon}</span>
                    <span className={`text-xs ${levelInfo.color}`}>{levelInfo.name}</span>
                  </div>
                  {guideStats.isVerified && (
                    <span className="bg-green-50 text-green-600 px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      已认证
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>4.9分</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-purple-500" />
                    <span>{totalPoints}积分</span>
                  </div>
                  <button
                    onClick={() => setShowLevelInfo(true)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                    <span className="text-xs">等级说明</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 border border-blue-100 text-center">
                <div className={`${levelInfo.color} text-xl mb-1`}>
                  {formatCommissionRate(commissionRate)}
                </div>
                <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>平台抽成</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100 text-center">
                <div className="text-purple-600 text-xl mb-1">{guideStats.orderCount}</div>
                <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                  <Award className="w-3 h-3" />
                  <span>完成订单</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-3 border border-amber-100 text-center">
                <div className="text-amber-600 text-xl mb-1">{guideStats.goodReviewCount}</div>
                <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>好评数量</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100 text-center">
                <div className="text-green-600 text-xl mb-1">98%</div>
                <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>好评率</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-3 border border-orange-100 text-center">
                <div className="text-orange-600 text-xl mb-1">3</div>
                <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>进行中</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-3 border border-indigo-100 text-center">
                <div className="text-indigo-600 text-xl mb-1">5</div>
                <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>本月订单</span>
                </div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-3 border border-gray-200">
              <div className="flex items-center justify-between mb-2 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  等级进度
                </span>
                {pointsToNext !== null && (
                  <span className="text-gray-500">再获得 {pointsToNext} 积分升级</span>
                )}
              </div>
              <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${
                    guideLevel === 'gold' ? 'from-amber-400 to-amber-500' :
                    guideLevel === 'senior' ? 'from-purple-400 to-purple-500' :
                    guideLevel === 'intermediate' ? 'from-blue-400 to-blue-500' :
                    'from-gray-400 to-gray-500'
                  } rounded-full transition-all duration-500 shadow-sm`}
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions - Only for Guides */}
      {!isTourist && (
        <div className="grid grid-cols-2 gap-3">
          {/* Wallet Card */}
          <button
            onClick={() => setShowWallet(true)}
            className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
            
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              
              <h4 className="text-white mb-1">我的钱包</h4>
              
              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-xs">可提现</span>
                  <span className="text-white text-lg">¥280</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-xs">锁定中</span>
                  <span className="text-white/90 text-sm">¥1000</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-white/90 text-xs">
                <span>查看详情</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </button>

          {/* Certification Card */}
          <button
            onClick={() => setShowCertification(true)}
            className={`rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 relative overflow-hidden ${
              certificationStatus === 'approved'
                ? 'bg-gradient-to-br from-yellow-500 to-orange-600'
                : 'bg-gradient-to-br from-blue-500 to-indigo-600'
            }`}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
            
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              
              <h4 className="text-white mb-1">
                {certificationStatus === 'none' && '平台认证'}
                {certificationStatus === 'pending' && '认证审核'}
                {certificationStatus === 'approved' && '已认证'}
                {certificationStatus === 'rejected' && '重新认证'}
              </h4>
              
              <div className="mb-3">
                {certificationStatus === 'none' && (
                  <p className="text-white/90 text-xs leading-relaxed">
                    抽成降低20%<br/>
                    获得优先推荐权
                  </p>
                )}
                {certificationStatus === 'pending' && (
                  <p className="text-white/90 text-xs leading-relaxed">
                    审核中<br/>
                    3-5个工作日完成
                  </p>
                )}
                {certificationStatus === 'approved' && (
                  <p className="text-white/90 text-xs leading-relaxed">
                    认证旅行管家<br/>
                    享受专属特权
                  </p>
                )}
                {certificationStatus === 'rejected' && (
                  <p className="text-white/90 text-xs leading-relaxed">
                    认证未通过<br/>
                    查看原因并重新申请
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                {certificationStatus === 'approved' ? (
                  <span className="text-xs bg-white/30 px-2 py-1 rounded-full">已认证</span>
                ) : certificationStatus === 'pending' ? (
                  <span className="text-xs bg-white/30 px-2 py-1 rounded-full">审核中</span>
                ) : certificationStatus === 'rejected' ? (
                  <span className="text-xs bg-white/30 px-2 py-1 rounded-full">未通过</span>
                ) : (
                  <span className="text-xs bg-white/30 px-2 py-1 rounded-full">立即申请</span>
                )}
                <ChevronRight className="w-4 h-4 text-white/90" />
              </div>
            </div>
          </button>
        </div>
      )}

      {/* My Activities */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-gray-800">我的活动</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {isTourist ? (
            <>
              {/* Tourist Verification Button - Only for Tourists */}
              <button 
                onClick={() => setShowTouristVerification(true)}
                className={`w-full flex items-center gap-3 p-4 transition-colors border-b-2 ${
                  touristVerified
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200'
                    : 'bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-blue-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  touristVerified
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                }`}>
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-gray-800 flex items-center gap-2">
                    游客身份认证
                    {touristVerified ? (
                      <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">已认证</span>
                    ) : (
                      <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">未认证</span>
                    )}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {touristVerified 
                      ? '已完成身份认证，可预约旅行管家' 
                      : '认证后才能预约旅行管家服务'}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {touristVerified ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-xs text-green-600">查看详情</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="text-xs text-blue-600">立即认证</span>
                    </>
                  )}
                </div>
              </button>

              {/* Guide Registration Button - Only for Tourists */}
              <button 
                onClick={() => setShowGuideRegistration(true)}
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors border-b-2 border-green-200"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-gray-800 flex items-center gap-2">
                    旅行管家入驻&认证
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">HOT</span>
                  </div>
                  <div className="text-gray-500 text-sm">成为认证旅行管家，开启收入之旅</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-xs text-green-600">免费入驻</span>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-gray-800">我发布的行程</div>
                  <div className="text-gray-500 text-sm">3个待匹配</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-gray-800">我的预约</div>
                  <div className="text-gray-500 text-sm">2个旅行管家服务</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-pink-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-gray-800">我的收藏</div>
                  <div className="text-gray-500 text-sm">15个搭子</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-gray-800">旅行足迹</div>
                  <div className="text-gray-500 text-sm">已去过18个城市</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </>
          ) : (
            <>
              {/* 注意：申请平台认证和我的钱包已移至上方快速操作卡片，此处不再显示 */}

              <button 
                onClick={() => setShowPriceSetting(true)}
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 transition-colors border-b-2 border-cyan-200"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-gray-800 flex items-center gap-2">
                    价格设置
                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">¥{currentPrice}/小时</span>
                  </div>
                  <div className="text-gray-500 text-sm">
                    {levelInfo.icon} {levelInfo.name}管家 · {formatPriceRange(guideLevel)}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <TrendingUp className="w-5 h-5 text-cyan-600" />
                  <span className="text-xs text-cyan-600">调整价格</span>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-gray-800">时间管理</div>
                  <div className="text-gray-500 text-sm">设置可接单时间</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-gray-800">我的订单</div>
                  <div className="text-gray-500 text-sm">3个待服务</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-gray-800">服务评价</div>
                  <div className="text-gray-500 text-sm">查看游客评价</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-gray-800">服务区域</div>
                  <div className="text-gray-500 text-sm">丽江市及周边</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </>
          )}
        </div>
      </div>



      {/* Admin Panel - Only for Admin */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-lg overflow-hidden">
          <button 
            onClick={() => setShowAdminPanel(true)}
            className="w-full flex items-center gap-3 p-4 text-white hover:bg-white/10 transition-colors"
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-white flex items-center gap-2">
                后台管理系统
                <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full">管理员</span>
              </div>
              <div className="text-white/90 text-sm">查看订单报警记录</div>
            </div>
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      {/* Settings */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-gray-800">设置</h3>
          {/* 管理员模式切换按钮 - 仅用于测试 */}
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {isAdmin ? '退出管理员' : '切换管理员'}
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <span className="text-gray-700">账号安全</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <span className="text-gray-700">隐私设置</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <span className="text-gray-700">通知管理</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <span className="text-gray-700">帮助与反馈</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Logout */}
      <button className="w-full bg-white text-red-600 py-3 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
        <LogOut className="w-5 h-5" />
        退出登录
      </button>

      {/* Guide Registration */}
      {showGuideRegistration && (
        <GuideRegistration
          onSuccess={handleGuideRegistrationSuccess}
          onClose={() => setShowGuideRegistration(false)}
        />
      )}

      {/* Guide Certification */}
      {showCertification && (
        <GuideCertification
          onSuccess={handleCertificationSuccess}
          onClose={() => setShowCertification(false)}
        />
      )}



      {/* Guide Wallet */}
      {showWallet && (
        <GuideWallet
          onClose={() => setShowWallet(false)}
        />
      )}

      {/* Price Setting */}
      {showPriceSetting && (
        <PriceSetting
          currentPrice={currentPrice}
          currentVehiclePrice={vehiclePrice}
          currentVehicleBrand={vehicleBrand}
          hasVehicle={hasVehicle}
          guideLevel={guideLevel}
          onSave={(data) => {
            setCurrentPrice(data.price);
            setHasVehicle(data.hasVehicle);
            if (data.vehicleInfo) {
              setVehicleBrand(data.vehicleInfo.brand);
              setVehiclePrice(data.vehicleInfo.price);
            }
            alert(`设置成功！\n地陪价格：¥${data.price}/小时${data.hasVehicle && data.vehicleInfo ? `\n车辆服务：${data.vehicleInfo.brand} ¥${data.vehicleInfo.price}/天` : ''}`);
          }}
          onClose={() => setShowPriceSetting(false)}
        />
      )}

      {/* Tourist Verification */}
      {showTouristVerification && (
        <TouristVerification
          onSuccess={() => {
            setShowTouristVerification(false);
            onTouristVerified?.();
            alert('恭喜您！身份认证已提交成功。审核通过后，您将可以预约旅行管家服务。');
          }}
          onClose={() => setShowTouristVerification(false)}
        />
      )}

      {/* Level Info Modal */}
      {showLevelInfo && (
        <GuideLevelInfo onClose={() => setShowLevelInfo(false)} />
      )}

      {/* Guide Profile Edit */}
      {showGuideProfileEdit && (
        <GuideProfileEdit
          userRole={userRole}
          initialData={guideProfileData}
          onSave={(data) => {
            setGuideProfileData(data);
          }}
          onClose={() => setShowGuideProfileEdit(false)}
        />
      )}
    </div>
  );
}

function Briefcase(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  );
}
import { Settings, Heart, MapPin, Star, Calendar, Award, ChevronRight, LogOut, RefreshCw, UserPlus, Shield, TrendingUp, Wallet, Briefcase, DollarSign } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';
import { GuideRegistration } from './GuideRegistration';
import { GuideCertification } from './GuideCertification';
import { PointsDetail } from './PointsDetail';
import { GuideWallet } from './GuideWallet';
import { PriceSetting } from './PriceSetting';
import { getPointsLevel, getLevelProgress, getPointsToNextLevel } from '../data/pointsSystem';

interface ProfileProps {
  userRole: 'tourist' | 'guide';
  onRoleChange: (role: 'tourist' | 'guide') => void;
}

export function Profile({ userRole, onRoleChange }: ProfileProps) {
  const isTourist = userRole === 'tourist';
  const [showGuideRegistration, setShowGuideRegistration] = useState(false);
  const [showCertification, setShowCertification] = useState(false);
  const [certificationStatus, setCertificationStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [showPointsDetail, setShowPointsDetail] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showPriceSetting, setShowPriceSetting] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(80);
  const [hasVehicle, setHasVehicle] = useState(false);
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehiclePrice, setVehiclePrice] = useState(200);
  
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
  
  // 模拟当前积分（实际应从后端获取）
  const currentPoints = isTourist ? 0 : 1500;
  const pointsLevel = currentPoints > 0 ? getPointsLevel(currentPoints) : null;
  const levelProgress = currentPoints > 0 ? getLevelProgress(currentPoints) : 0;
  const pointsToNext = currentPoints > 0 ? getPointsToNextLevel(currentPoints) : 0;

  const handleGuideRegistrationSuccess = () => {
    alert('恭喜您！地陪入驻申请已提交，我们将在1-3个工作日内完成审核。审核通过后，您可以切换到地陪模式开始接单。');
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
              {isTourist ? '🧳 游客模式' : '🎒 地陪模式'}
            </p>
          </div>
          <button
            onClick={() => onRoleChange(isTourist ? 'guide' : 'tourist')}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">切换为{isTourist ? '地陪' : '游客'}</span>
          </button>
        </div>
        <div className="mt-3 pt-3 border-t border-white/20">
          <p className="text-white/80 text-xs">
            {isTourist 
              ? '💡 切换到地陪模式可以体验接单、时间管理、创建旅行日记等功能'
              : '💡 切换到游客模式可以体验预约地陪、查看行程、接收旅行日记等功能'
            }
          </p>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <ImageWithFallback
            src={isTourist 
              ? "https://images.unsplash.com/photo-1535208632259-841d129a6af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdHJhdmVsfGVufDF8fHx8MTc2NDU5ODc5OXww&ixlib=rb-4.1.0&q=80&w=1080"
              : "https://images.unsplash.com/photo-1643646805556-350c057663dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcG9ydHJhaXQlMjBzbWlsZXxlbnwxfHx8fDE3NjQ1NTE0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080"
            }
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover border-4 border-white/30"
          />
          <div className="flex-1">
            <h2 className="text-white mb-1">{isTourist ? '旅行者小美' : '地陪阿秀'}</h2>
            <p className="text-white/90 text-sm mb-2">
              {isTourist ? '资深旅行达人' : '认证地陪 · 摄影高手'}
            </p>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
              <span className="text-sm">{isTourist ? '4.8分' : '4.9分'}</span>
            </div>
          </div>
          <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
          {isTourist ? (
            <>
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
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="text-white mb-1">156</div>
                <div className="text-white/80 text-xs">接单次数</div>
              </div>
              <div className="text-center">
                <div className="text-white mb-1">98%</div>
                <div className="text-white/80 text-xs">好评率</div>
              </div>
              <div className="text-center">
                <div className="text-white mb-1">3</div>
                <div className="text-white/80 text-xs">进行中</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Points Card - Only for Guides */}
      {!isTourist && pointsLevel && (
        <button
          onClick={() => setShowPointsDetail(true)}
          className={`bg-gradient-to-r ${pointsLevel.color} rounded-2xl p-6 text-white shadow-lg w-full text-left hover:shadow-xl transition-shadow`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{pointsLevel.icon}</div>
              <div>
                <h3 className="text-white mb-1">{pointsLevel.name}</h3>
                <p className="text-white/90 text-sm">Lv.{pointsLevel.level} · {currentPoints} 积分</p>
              </div>
            </div>
            <TrendingUp className="w-6 h-6 text-white" />
          </div>

          {/* Progress Bar */}
          {pointsToNext > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/90 text-sm">升级进度</span>
                <span className="text-white/90 text-sm">
                  还需 {pointsToNext} 分
                </span>
              </div>
              <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Benefits Preview */}
          <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-3">
            <div>
              <div className="text-white/80 text-xs mb-1">价格上限</div>
              <div className="text-white text-sm">¥{pointsLevel.priceLimit}/小时</div>
            </div>
            <div>
              <div className="text-white/80 text-xs mb-1">平台抽成</div>
              <div className="text-white text-sm">{(pointsLevel.commission * 100).toFixed(0)}%</div>
            </div>
          </div>
        </button>
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
                    认证后可定价¥200<br/>
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
                    认证地陪<br/>
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
                    地陪入驻&认证
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">HOT</span>
                  </div>
                  <div className="text-gray-500 text-sm">成为认证地陪，开启收入之旅</div>
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
                  <div className="text-gray-500 text-sm">2个地陪服务</div>
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
                    {certificationStatus === 'approved' 
                      ? `已认证 · 最高可定价¥${pointsLevel?.priceLimit || 200}` 
                      : '未认证 · 最高可定价¥80'}
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

      {/* Achievements */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-gray-800">我的成就</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-4 gap-3">
            {isTourist ? (
              [
                { icon: '✈️', name: '旅行达人', unlocked: true },
                { icon: '🌟', name: '超级旅伴', unlocked: true },
                { icon: '📸', name: '摄影高手', unlocked: true },
                { icon: '🍜', name: '美食专家', unlocked: false },
                { icon: '🏔️', name: '户外先锋', unlocked: false },
                { icon: '🎯', name: '百里挑一', unlocked: true },
                { icon: '💬', name: '热心助人', unlocked: true },
                { icon: '🏆', name: '旅行冠军', unlocked: false },
              ].map((achievement, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl ${
                    achievement.unlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50' : 'bg-gray-50'
                  }`}
                >
                  <div className={`text-2xl ${!achievement.unlocked && 'opacity-30'}`}>
                    {achievement.icon}
                  </div>
                  <div className={`text-xs text-center ${achievement.unlocked ? 'text-gray-700' : 'text-gray-400'}`}>
                    {achievement.name}
                  </div>
                </div>
              ))
            ) : (
              [
                { icon: '🏆', name: '金牌地陪', unlocked: true },
                { icon: '⭐', name: '五星好评', unlocked: true },
                { icon: '📸', name: '摄影高手', unlocked: true },
                { icon: '🍜', name: '美食专家', unlocked: true },
                { icon: '🎯', name: '服务达人', unlocked: true },
                { icon: '💯', name: '百单成就', unlocked: true },
                { icon: '💬', name: '好评如潮', unlocked: true },
                { icon: '👑', name: '王牌向导', unlocked: false },
              ].map((achievement, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl ${
                    achievement.unlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50' : 'bg-gray-50'
                  }`}
                >
                  <div className={`text-2xl ${!achievement.unlocked && 'opacity-30'}`}>
                    {achievement.icon}
                  </div>
                  <div className={`text-xs text-center ${achievement.unlocked ? 'text-gray-700' : 'text-gray-400'}`}>
                    {achievement.name}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-gray-800">设置</h3>
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

      {/* Points Detail */}
      {showPointsDetail && (
        <PointsDetail
          points={currentPoints}
          level={pointsLevel}
          progress={levelProgress}
          pointsToNext={pointsToNext}
          onClose={() => setShowPointsDetail(false)}
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
          certificationStatus={certificationStatus}
          pointsLevel={pointsLevel || undefined}
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
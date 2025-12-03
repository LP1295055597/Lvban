import { useState } from 'react';
import { X, MapPin, Star, Award, MessageCircle, Shield, ChevronRight, Heart, Navigation, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BookingCalendar } from './BookingCalendar';
import { TouristVerification } from './TouristVerification';
import { 
  calculateLevel, 
  calculatePoints, 
  GUIDE_LEVELS, 
  type GuideLevel 
} from '../utils/guideLevelSystem';
import headerBg from 'figma:asset/11050b82ae17b8cdaae4e2b2539ecb9a4170f2f8.png';

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
  reviews: Review[];
  hasVehicle?: boolean;
  vehicleType?: string;
  vehiclePrice?: number;
  vehicleMileageLimit?: number;
  // 等级系统新字段
  points?: number;
  level?: GuideLevel;
  isVerified?: boolean;
  hasPhotography?: boolean;
  goodReviewCount?: number;
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

interface GuideDetailProps {
  guide: Guide;
  userLocation: { latitude: number; longitude: number; city?: string } | null;
  touristVerified?: boolean;
  onClose: () => void;
  onChat: () => void;
  onTouristVerified?: () => void;
}

export function GuideDetail({ guide, userLocation, touristVerified = false, onClose, onChat, onTouristVerified }: GuideDetailProps) {
  const [showBooking, setShowBooking] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [expandedReview, setExpandedReview] = useState<number | null>(null);

  // 计算等级系统数据
  const goodReviewCount = guide.goodReviewCount || Math.floor(guide.reviews.filter(r => r.rating >= 4).length);
  const totalPoints = guide.points || calculatePoints(
    guide.orderCount,
    goodReviewCount,
    guide.hasPhotography || false,
    guide.hasVehicle || false
  );
  const guideLevel = guide.level || calculateLevel(totalPoints);
  const isVerified = guide.isVerified || false;
  const levelInfo = GUIDE_LEVELS[guideLevel];

  const handleBookingConfirm = (dates: string[], timeRange: { start: number; end: number }, meetingPoint: MeetingPoint, totalPrice: number) => {
    const datesText = dates.length === 1 ? dates[0] : `${dates[0]} 等 ${dates.length} 天`;
    const timeText = `${timeRange.start}:00-${timeRange.end}:00 (${timeRange.end - timeRange.start}小时)`;
    alert(`预约成功！\\n日期：${datesText}\\n时间：${timeText}\\n集合点：${meetingPoint.name}\\n地址：${meetingPoint.address}\\n预计费用：¥${totalPrice}\\n\\n地陪将在24小时内确认订单`);
    setShowBooking(false);
  };

  // 计算经验年限
  const experienceYears = Math.floor(guide.orderCount / 80) + 3;
  
  // 90天出游人数
  const recentTourists = Math.floor(guide.orderCount * 0.8);

  // 评价分类统计
  const reviewStats = {
    travel: Math.floor(guide.reviews.length * 0.6),
    service: Math.floor(guide.reviews.length * 0.3),
    attitude: Math.floor(guide.reviews.length * 0.4)
  };

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      <div className="min-h-screen bg-gray-50">
        {/* Header with Background Image */}
        <div className="relative h-[420px]">
          <ImageWithFallback
            src={headerBg}
            alt="背景"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-gray-50" />
          
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
            <button
              onClick={onClose}
              className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
            >
              <ChevronRight className="w-6 h-6 rotate-180" />
            </button>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Profile Card */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-6">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
              <div className="p-5">
                {/* Name and Intro */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h2 className="text-gray-900 text-2xl">{guide.name}</h2>
                      {/* Level Badge */}
                      <div className={`${levelInfo.bgColor} ${levelInfo.color} px-3 py-1 rounded-full text-xs flex items-center gap-1 font-medium`}>
                        <span>{levelInfo.icon}</span>
                        <span>{levelInfo.name}</span>
                      </div>
                      {/* Verified Badge */}
                      {isVerified && (
                        <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          <span>已认证</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      亲子行千里，因谈兹卷书。
                    </p>
                  </div>
                  <ImageWithFallback
                    src={guide.avatar}
                    alt={guide.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-lg"
                  />
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                    <span>90后</span>
                  </div>
                  <div className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs">
                    摩羯座
                  </div>
                  <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs">
                    古镇研学家
                  </div>
                  <div className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-xs">
                    细致耐心
                  </div>
                  <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs">
                    亲子游伴随者
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-gray-900 font-medium mb-1">云南</div>
                    <div className="text-gray-500 text-xs">主营目的地</div>
                  </div>
                  <div>
                    <div className="text-gray-900 font-medium mb-1">{experienceYears}年</div>
                    <div className="text-gray-500 text-xs">旅游从业年限</div>
                  </div>
                  <div>
                    <div className="text-gray-900 font-medium mb-1">{recentTourists}人</div>
                    <div className="text-gray-500 text-xs">90天出游人数</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-4 pb-24 space-y-4">
          {/* Service Introduction */}
          <div className="bg-white rounded-3xl shadow-sm p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-gray-900 mb-2">萬教于游亲子于光</h3>
                <div className="space-y-1.5 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>英国亲子出游越国团</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>开通跟其游至今坚持分享本地</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-blue-600 text-2xl mb-1">✨</div>
                <div className="text-gray-400 text-xs">亲子专家</div>
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="bg-white rounded-3xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-900">用户评价</span>
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                  {guide.rating}分
                </div>
              </div>
              <button className="text-gray-400 text-sm flex items-center gap-1">
                全部评价 ({guide.reviews.length})
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Rating Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm flex items-center gap-1 hover:bg-blue-100 transition-colors">
                旅程超开心 ({reviewStats.travel})
                <ChevronRight className="w-3 h-3" />
              </button>
              <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm flex items-center gap-1 hover:bg-blue-100 transition-colors">
                行程安排合理 ({reviewStats.service})
                <ChevronRight className="w-3 h-3" />
              </button>
              <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm flex items-center gap-1 hover:bg-blue-100 transition-colors">
                服务贴心 ({reviewStats.attitude})
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* User Reviews */}
          <div className="bg-white rounded-3xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">用户评价</h3>
              <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                {guide.rating}分
              </div>
            </div>

            <div className="space-y-4">
              {guide.reviews.slice(0, 2).map((review, index) => {
                const isExpanded = expandedReview === review.id;
                const shouldShowExpand = review.content.length > 100;
                const displayContent = isExpanded || !shouldShowExpand 
                  ? review.content 
                  : review.content.slice(0, 100) + '...';

                return (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-start gap-3 mb-3">
                      <ImageWithFallback
                        src={review.userAvatar}
                        alt={review.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-gray-900 text-sm">{review.userName}</h4>
                        </div>
                        <div className="text-gray-500 text-xs">{review.date}</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      {displayContent}
                      {shouldShowExpand && (
                        <button
                          onClick={() => setExpandedReview(isExpanded ? null : review.id)}
                          className="text-blue-600 ml-2 inline-flex items-center gap-1"
                        >
                          {isExpanded ? (
                            <>
                              收起
                              <ChevronUp className="w-3 h-3" />
                            </>
                          ) : (
                            <>
                              展开
                              <ChevronDown className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      )}
                    </p>

                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {review.images.map((img, imgIndex) => (
                          <ImageWithFallback
                            key={imgIndex}
                            src={img}
                            alt="评价图片"
                            className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                          />
                        ))}
                        {review.images.length > 3 && (
                          <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-500 text-sm">+{review.images.length - 3}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-white rounded-3xl shadow-sm p-5">
            <h3 className="text-gray-900 mb-4">服务详情</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-gray-900 text-sm mb-1">专业技能</div>
                  <div className="flex flex-wrap gap-2">
                    {guide.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-gray-900 text-sm mb-1">语言能力</div>
                  <div className="flex gap-2">
                    {guide.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-xs"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {guide.hasVehicle && (
                <div className="flex items-start gap-3">
                  <Navigation className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-gray-900 text-sm mb-1">配车服务</div>
                    <div className="text-gray-600 text-xs">
                      {guide.vehicleType} · ¥{guide.vehiclePrice}/天
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Bottom Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-bottom z-20">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <button
              onClick={onChat}
              className="flex-1 bg-white text-gray-900 py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-center"
            >
              在线问TA
            </button>
            <button
              onClick={() => {
                if (!touristVerified) {
                  setShowVerification(true);
                } else {
                  setShowBooking(true);
                }
              }}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3.5 rounded-xl hover:opacity-90 transition-opacity text-center"
            >
              <div className="flex items-center justify-center gap-2">
                <span>帮我定制</span>
                <span className="text-xs opacity-90">{recentTourists}人已出游</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Booking Calendar Modal */}
      {showBooking && (
        <BookingCalendar
          guideName={guide.name}
          guideHourlyRate={parseInt(guide.servicePrice)}
          hasVehicle={guide.hasVehicle}
          vehicleType={guide.vehicleType}
          vehiclePrice={guide.vehiclePrice}
          vehicleMileageLimit={guide.vehicleMileageLimit}
          userLocation={userLocation}
          onClose={() => setShowBooking(false)}
          onConfirm={handleBookingConfirm}
        />
      )}

      {/* Tourist Verification */}
      {showVerification && (
        <TouristVerification
          onSuccess={() => {
            setShowVerification(false);
            if (onTouristVerified) {
              onTouristVerified();
            }
            setTimeout(() => setShowBooking(true), 300);
          }}
          onCancel={() => setShowVerification(false)}
        />
      )}

    </div>
  );
}

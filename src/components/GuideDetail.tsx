import { useState } from 'react';
import { X, Star, MapPin, Award, MessageCircle, Phone, Calendar, Users, Car } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BookingCalendar } from './BookingCalendar';
import { MeetingPoint } from '../data/meetingPoints';

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
  vehiclePrice?: number; // 车辆价格（按天计价）
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
  onClose: () => void;
  onChat: () => void;
}

export function GuideDetail({ guide, userLocation, onClose, onChat }: GuideDetailProps) {
  const [selectedTab, setSelectedTab] = useState<'intro' | 'reviews'>('intro');
  const [showBooking, setShowBooking] = useState(false);

  const handleBookingConfirm = (dates: string[], timeRange: { start: number; end: number }, meetingPoint: MeetingPoint, totalPrice: number) => {
    const datesText = dates.length === 1 ? dates[0] : `${dates[0]} 等 ${dates.length} 天`;
    const timeText = `${timeRange.start}:00-${timeRange.end}:00 (${timeRange.end - timeRange.start}小时)`;
    alert(`预约成功！\n日期：${datesText}\n时间：${timeText}\n集合点：${meetingPoint.name}\n地址：${meetingPoint.address}\n预计费用：¥${totalPrice}\n\n地陪将在24小时内确认订单`);
    setShowBooking(false);
    // 这里可以添加实际的预约逻辑
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header Image */}
        <div className="relative h-64">
          <ImageWithFallback
            src={guide.avatar}
            alt={guide.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <X className="w-6 h-6 text-gray-800" />
          </button>

          {/* Basic Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-white mb-2">{guide.name}</h2>
                <p className="text-white/90 text-sm mb-2">{guide.age}岁 · {guide.gender} · {guide.location}</p>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{guide.rating}分</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>{guide.orderCount}次服务</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Price */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">服务价格</p>
                <p className="text-orange-600 text-xl">{guide.servicePrice}</p>
              </div>
              <button
                onClick={() => setShowBooking(true)}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                立即预约
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setSelectedTab('intro')}
              className={`flex-1 py-3 transition-colors ${
                selectedTab === 'intro'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600'
              }`}
            >
              个人介绍
            </button>
            <button
              onClick={() => setSelectedTab('reviews')}
              className={`flex-1 py-3 transition-colors ${
                selectedTab === 'reviews'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600'
              }`}
            >
              游客评价 ({guide.reviews.length})
            </button>
          </div>

          {/* Tab Content */}
          {selectedTab === 'intro' ? (
            <div className="space-y-6">
              {/* Skills */}
              <div>
                <h3 className="text-gray-800 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  专业技能
                </h3>
                <div className="flex flex-wrap gap-2">
                  {guide.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 rounded-full text-sm border border-blue-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h3 className="text-gray-800 mb-3">语言能力</h3>
                <div className="flex gap-2">
                  {guide.languages.map((lang, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Introduction */}
              <div>
                <h3 className="text-gray-800 mb-3">自我介绍</h3>
                <p className="text-gray-600 leading-relaxed">{guide.introduction}</p>
              </div>

              {/* Service Info */}
              <div className="bg-blue-50 rounded-xl p-4 space-y-3 border border-blue-100">
                <h3 className="text-gray-800">服务说明</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                    <p>提供丽江古城及周边景点专业导游服务</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                    <p>可定制个性化旅游路线和行程安排</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                    <p>提供摄影、美食推荐等增值服务</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                    <p>服务时间灵活，可根据您的需求调整</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {guide.reviews.map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <ImageWithFallback
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-gray-800">{review.userName}</h4>
                        <span className="text-gray-500 text-xs">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={`w-4 h-4 ${
                              index < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{review.content}</p>
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {review.images.map((img, index) => (
                            <ImageWithFallback
                              key={index}
                              src={img}
                              alt="Review"
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-2">
            <button
              onClick={onChat}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              立即咨询
            </button>
            <button className="px-6 py-3 border-2 border-blue-500 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              电话联系
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
          userLocation={userLocation}
          onClose={() => setShowBooking(false)}
          onConfirm={handleBookingConfirm}
        />
      )}
    </div>
  );
}
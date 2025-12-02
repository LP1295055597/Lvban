import { useState } from 'react';
import { MapPin, Star, Award, Search, MessageCircle, Shield, Navigation, Heart, SlidersHorizontal } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { GuideDetail } from './GuideDetail';
import { ChatDialog } from './ChatDialog';
import { getPointsLevel } from '../data/pointsSystem';

interface GuideOrdersProps {
  userLocation: { latitude: number; longitude: number; city?: string } | null;
}

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
  isCertified?: boolean;
  points?: number;
  reviews: Review[];
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

const mockGuides: Guide[] = [
  {
    id: 1,
    name: '阿秀',
    avatar: 'https://images.unsplash.com/photo-1643646805556-350c057663dd?w=400',
    age: 26,
    gender: '女',
    rating: 4.9,
    orderCount: 156,
    skills: ['摄影高手', '美食专家', '古城达人'],
    introduction: '土生土长的丽江纳西族姑娘，擅长摄影和美食推荐',
    servicePrice: '100',
    location: '丽江古城',
    languages: ['普通话', '纳西语', '英语'],
    isCertified: true,
    points: 1500,
    reviews: []
  },
  {
    id: 2,
    name: '和师傅',
    avatar: 'https://images.unsplash.com/photo-1695800998493-ccff5ea292ea?w=400',
    age: 35,
    gender: '男',
    rating: 4.8,
    orderCount: 203,
    skills: ['自驾向导', '户外专家', '摄影达人'],
    introduction: '10年旅游服务经验，擅长自驾游和户外探险',
    servicePrice: '150',
    location: '丽江市区',
    languages: ['普通话', '纳西语'],
    points: 5200,
    reviews: []
  },
  {
    id: 3,
    name: '小米',
    avatar: 'https://images.unsplash.com/photo-1643646805556-350c057663dd?w=400',
    age: 24,
    gender: '女',
    rating: 4.9,
    orderCount: 89,
    skills: ['美食专家', '网红打卡', '拍照圣手'],
    introduction: '95后丽江妹子，擅长美食和ins风拍照',
    servicePrice: '80',
    location: '丽江古城',
    languages: ['普通话', '英语'],
    reviews: []
  },
  {
    id: 4,
    name: '老李',
    avatar: 'https://images.unsplash.com/photo-1695800998493-ccff5ea292ea?w=400',
    age: 45,
    gender: '男',
    rating: 4.7,
    orderCount: 312,
    skills: ['历史讲解', '文化专家', '资深导游'],
    introduction: '资深导游，对丽江历史文化有深入研究',
    servicePrice: '120',
    location: '丽江古城',
    languages: ['普通话', '纳西语', '英语'],
    isCertified: true,
    points: 3200,
    reviews: []
  }
];

export function GuideOrders({ userLocation }: GuideOrdersProps) {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatGuide, setChatGuide] = useState<Guide | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSkill, setFilterSkill] = useState<string>('全部');
  const [filterCertified, setFilterCertified] = useState<string>('全部');
  const [filterGender, setFilterGender] = useState<string>('全部');
  const [showFilters, setShowFilters] = useState(false);

  const allSkills = ['全部', '摄影高手', '美食专家', '历史讲解', '自驾向导', '户外专家'];

  const filteredGuides = mockGuides.filter(guide => {
    const skillMatch = filterSkill === '全部' || guide.skills.includes(filterSkill);
    const searchMatch = searchQuery === '' || 
      guide.name.includes(searchQuery) || 
      guide.skills.some(skill => skill.includes(searchQuery));
    const certifiedMatch = filterCertified === '全部' || (filterCertified === '是' ? guide.isCertified : !guide.isCertified);
    const genderMatch = filterGender === '全部' || guide.gender === filterGender;
    return skillMatch && searchMatch && certifiedMatch && genderMatch;
  });

  const handleChatClick = (guide: Guide) => {
    setSelectedGuide(null);
    setChatGuide(guide);
    setShowChat(true);
  };

  const featuredGuide = filteredGuides[0];
  const otherGuides = filteredGuides.slice(1);

  return (
    <div className="min-h-screen pb-4">
      {/* Search Bar */}
      <div className="sticky top-[72px] z-20 px-4 pt-4 pb-3">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl rounded-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 px-5 py-3.5 flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索地陪名字或技能..."
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`transition-all p-2 rounded-xl ${
                showFilters ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' : 'bg-gray-100/80 text-gray-600'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="px-4 pb-4 space-y-3 animate-slide-down">
          {/* Skills Filter */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-lg border border-white/20">
            <h4 className="text-sm text-gray-700 mb-3">专业技能</h4>
            <div className="flex gap-2 flex-wrap">
              {allSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => setFilterSkill(skill)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    filterSkill === skill
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-3 shadow-lg border border-white/20">
              <h4 className="text-xs text-gray-600 mb-2">平台认证</h4>
              <div className="flex gap-2">
                {['全部', '是', '否'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setFilterCertified(option)}
                    className={`flex-1 py-1.5 rounded-xl text-xs transition-all ${
                      filterCertified === option
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : 'bg-gray-100/80 text-gray-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-3 shadow-lg border border-white/20">
              <h4 className="text-xs text-gray-600 mb-2">性别</h4>
              <div className="flex gap-2">
                {['全部', '男', '女'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setFilterGender(option)}
                    className={`flex-1 py-1.5 rounded-xl text-xs transition-all ${
                      filterGender === option
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                        : 'bg-gray-100/80 text-gray-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-4 space-y-4">
        {/* Featured Guide */}
        {featuredGuide && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 blur-2xl rounded-[2rem]"></div>
            <div className="relative bg-white/90 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-2xl border border-white/20">
              {/* Header */}
              <div className="p-5 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-800">Featured Guide</h3>
                  {featuredGuide.isCertified && (
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full flex items-center gap-1.5 text-xs shadow-lg shadow-blue-500/30">
                      <Shield className="w-3.5 h-3.5" />
                      <span>平台认证</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500">本周推荐地陪</p>
              </div>

              {/* Main Card */}
              <div className="px-5 pb-5">
                <button
                  onClick={() => setSelectedGuide(featuredGuide)}
                  className="relative w-full rounded-3xl overflow-hidden shadow-xl group"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <ImageWithFallback
                      src={featuredGuide.avatar}
                      alt={featuredGuide.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="relative aspect-[3/4] flex flex-col justify-end p-6">
                    {/* Stats Top Right */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <div className="bg-white/20 backdrop-blur-md rounded-2xl px-3 py-2 text-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mx-auto mb-1" />
                        <div className="text-white text-sm">{featuredGuide.rating}</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-md rounded-2xl px-3 py-2 text-center">
                        <Award className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                        <div className="text-white text-xs">{featuredGuide.orderCount}单</div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-3">
                      <div>
                        <h2 className="text-white mb-1">{featuredGuide.name}</h2>
                        <p className="text-white/80 text-sm">{featuredGuide.age}岁 · {featuredGuide.gender} · {featuredGuide.location}</p>
                      </div>

                      {/* Skills */}
                      <div className="flex gap-2 flex-wrap">
                        {featuredGuide.skills.slice(0, 3).map((skill, index) => (
                          <div key={index} className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1">
                            <span className="text-white text-xs">{skill}</span>
                          </div>
                        ))}
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2 flex-1">
                          <div className="text-white/70 text-xs mb-0.5">按小时计价</div>
                          <div className="text-white">¥{featuredGuide.servicePrice}/小时</div>
                        </div>
                        <button className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                          <Navigation className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Other Guides */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-2xl rounded-[2rem]"></div>
          <div className="relative bg-white/90 backdrop-blur-xl rounded-[2rem] p-5 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-gray-800">More Guides</h3>
                <p className="text-sm text-gray-500">共 {otherGuides.length} 位地陪</p>
              </div>
            </div>

            <div className="space-y-3">
              {otherGuides.map((guide) => {
                const level = guide.points ? getPointsLevel(guide.points) : null;
                
                return (
                  <button
                    key={guide.id}
                    onClick={() => setSelectedGuide(guide)}
                    className="w-full bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 hover:shadow-lg transition-all group border border-gray-100"
                  >
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md">
                          <ImageWithFallback
                            src={guide.avatar}
                            alt={guide.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        {guide.isCertified && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                            <Shield className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h4 className="text-gray-800">{guide.name}</h4>
                            <p className="text-xs text-gray-500">{guide.age}岁 · {guide.gender}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-gray-800">¥{guide.servicePrice}</div>
                            <div className="text-xs text-gray-500">元/小时</div>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="flex gap-1.5 mb-2 flex-wrap">
                          {guide.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="text-xs bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 px-2 py-0.5 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs text-gray-700">{guide.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-orange-400" />
                            <span className="text-xs text-gray-700">{guide.orderCount}单</span>
                          </div>
                          {level && (
                            <div className="flex items-center gap-1">
                              <div className={`w-3.5 h-3.5 rounded-full ${level.badgeColor}`}></div>
                              <span className="text-xs text-gray-700">{level.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {selectedGuide && (
        <GuideDetail
          guide={selectedGuide}
          onClose={() => setSelectedGuide(null)}
          onChatClick={() => handleChatClick(selectedGuide)}
        />
      )}

      {showChat && chatGuide && (
        <ChatDialog
          guide={chatGuide}
          onClose={() => {
            setShowChat(false);
            setChatGuide(null);
          }}
        />
      )}

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

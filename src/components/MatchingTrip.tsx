import { useState, useEffect } from 'react';
import { X, MapPin, Users, Calendar, Loader2, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TravelMate {
  id: number;
  name: string;
  age: number;
  gender: string;
  avatar: string;
  destination: string;
  startDate: string;
  duration: string;
  peopleCount: string;
  activityTypes: string[];
}

interface TripData {
  destination: string;
  startDate: string;
  duration: string;
  peopleCount: string;
  description: string;
  activityTypes: string[];
}

interface MatchingTripProps {
  tripData: TripData;
  onClose: () => void;
  onMatchComplete: (matches: TravelMate[], groupId: number) => void;
}

export function MatchingTrip({ 
  tripData, 
  onClose, 
  onMatchComplete
}: MatchingTripProps) {
  const [isMatching, setIsMatching] = useState(true);
  const [matches, setMatches] = useState<TravelMate[]>([]);
  const [matchCount, setMatchCount] = useState(0);
  const [progress, setProgress] = useState(0);

  // 模拟可用的搭子（同目的地）
  const availableMates: TravelMate[] = [
    {
      id: 101,
      name: '小雨',
      age: 25,
      gender: '女',
      avatar: 'https://images.unsplash.com/photo-1535208632259-841d129a6af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdHJhdmVsfGVufDF8fHx8MTc2NDU5ODc5OXww&ixlib=rb-4.1.0&q=80&w=1080',
      destination: tripData.destination,
      startDate: tripData.startDate,
      duration: tripData.duration,
      peopleCount: '2人',
      activityTypes: tripData.activityTypes
    },
    {
      id: 102,
      name: '阿杰',
      age: 28,
      gender: '男',
      avatar: 'https://images.unsplash.com/photo-1633177188754-980c2a6b6266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDUzMzYyNHww&ixlib=rb-4.1.0&q=80&w=1080',
      destination: tripData.destination,
      startDate: tripData.startDate,
      duration: tripData.duration,
      peopleCount: '3-5人',
      activityTypes: tripData.activityTypes
    },
    {
      id: 103,
      name: '糖糖',
      age: 23,
      gender: '女',
      avatar: 'https://images.unsplash.com/photo-1535208632259-841d129a6af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdHJhdmVsfGVufDF8fHx8MTc2NDU5ODc5OXww&ixlib=rb-4.1.0&q=80&w=1080',
      destination: tripData.destination,
      startDate: tripData.startDate,
      duration: tripData.duration,
      peopleCount: '2人',
      activityTypes: tripData.activityTypes
    }
  ];

  // 模拟匹配过程
  useEffect(() => {
    // 筛选符合条件的搭子
    const compatibleMates = availableMates.filter(mate => 
      mate.destination === tripData.destination
    );

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);

      // 随机添加匹配的人
      if (currentProgress % 30 === 0 && matches.length < compatibleMates.length) {
        const nextMatch = compatibleMates[matches.length];
        if (nextMatch) {
          setMatches(prev => [...prev, nextMatch]);
          setMatchCount(prev => prev + 1);
        }
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsMatching(false);
        
        // 3秒后自动完成匹配
        setTimeout(() => {
          const groupId = Date.now();
          onMatchComplete(matches, groupId);
        }, 3000);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between shadow-lg">
        <div>
          <h3 className="text-gray-800">正在为您匹配旅伴</h3>
          <p className="text-gray-600 text-sm flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {tripData.destination}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-gradient-to-b from-blue-100 to-emerald-100 overflow-hidden">
        {/* 模拟地图背景 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        </div>

        {/* 目的地标记 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            {/* 脉冲动画 */}
            {isMatching && (
              <>
                <div className="absolute -inset-8 bg-blue-400 rounded-full opacity-20 animate-ping"></div>
                <div className="absolute -inset-4 bg-blue-400 rounded-full opacity-30 animate-pulse"></div>
              </>
            )}
            
            {/* 中心标记 */}
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl relative z-10">
              <MapPin className="w-8 h-8 text-white" />
            </div>

            {/* 目的地名称 */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-4 py-2 rounded-lg shadow-lg">
              <p className="text-sm text-gray-800">{tripData.destination}</p>
            </div>
          </div>
        </div>

        {/* 匹配的用户（围绕在周围） */}
        {matches.map((mate, index) => {
          const angle = (index * 360) / Math.max(matches.length, 4);
          const radius = 120;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;

          return (
            <div
              key={mate.id}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
            >
              <div className="relative">
                {/* 连接线 */}
                <svg 
                  className="absolute top-1/2 left-1/2 pointer-events-none"
                  style={{
                    width: `${Math.abs(x) * 2 + 40}px`,
                    height: `${Math.abs(y) * 2 + 40}px`,
                    transform: `translate(-50%, -50%)`,
                  }}
                >
                  <line
                    x1="50%"
                    y1="50%"
                    x2={x > 0 ? '0%' : '100%'}
                    y2={y > 0 ? '0%' : '100%'}
                    stroke="#60a5fa"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                </svg>

                {/* 用户头像 */}
                <div className="relative animate-bounce-slow">
                  <ImageWithFallback
                    src={mate.avatar}
                    alt={mate.name}
                    className="w-12 h-12 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>
            </div>
          );
        })}

        {/* 匹配成功图标 */}
        {!isMatching && matches.length > 0 && (
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 animate-scale-in">
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-2" />
              <p className="text-center text-gray-800">匹配成功！</p>
              <p className="text-center text-gray-600 text-sm">
                找到 {matches.length} 位志同道合的旅伴
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Info */}
      <div className="bg-white rounded-t-3xl shadow-2xl">
        <div className="p-6 space-y-4">
          {/* Progress */}
          {isMatching && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-700 text-sm">匹配进度</p>
                <p className="text-blue-600 text-sm">{progress}%</p>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center gap-3">
            {isMatching ? (
              <>
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                <p className="text-gray-700">正在搜索附近的旅伴...</p>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <p className="text-gray-700">已为您找到 {matches.length} 位旅伴</p>
              </>
            )}
          </div>

          {/* Match Count */}
          {matchCount > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">已匹配旅伴</span>
                </div>
                <span className="text-blue-600">{matchCount} 人</span>
              </div>
              
              {/* Matched Users */}
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {matches.map((mate) => (
                  <div key={mate.id} className="flex-shrink-0">
                    <ImageWithFallback
                      src={mate.avatar}
                      alt={mate.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                    />
                    <p className="text-xs text-center text-gray-600 mt-1">{mate.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trip Info */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-blue-500" />
              目的地：{tripData.destination}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-blue-500" />
              出发时间：{tripData.startDate}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4 text-blue-500" />
              期望人数：{tripData.peopleCount}
            </div>
          </div>

          {!isMatching && matches.length > 0 && (
            <p className="text-center text-gray-500 text-sm">
              即将为您创建群组聊天...
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes scale-in {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
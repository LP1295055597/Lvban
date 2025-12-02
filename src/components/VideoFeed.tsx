import { useState } from 'react';
import { Heart, MessageCircle, Share2, Play, MapPin, Eye } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Masonry from 'react-responsive-masonry';

interface Video {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  type: 'video' | 'guide';
  thumbnail: string;
  title: string;
  description: string;
  location: string;
  duration?: string;
  views: number;
  likes: number;
  comments: number;
  isLiked: boolean;
  height: number; // For masonry layout
}

const mockVideos: Video[] = [
  {
    id: 1,
    userId: 1,
    userName: '旅行博主小雪',
    userAvatar: 'https://images.unsplash.com/photo-1535208632259-841d129a6af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdHJhdmVsfGVufDF8fHx8MTc2NDU5ODc5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1637872937209-e1a5ccdc90cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWppYW5nJTIwb2xkJTIwdG93bnxlbnwxfHx8fDE3NjQ1NTIzODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: '丽江古城夜景太美了！',
    description: '漫步古城，感受千年古韵。夜晚的灯光映照在石板路上，别有一番风味～',
    location: '丽江古城',
    duration: '02:35',
    views: 12500,
    likes: 856,
    comments: 234,
    isLiked: false,
    height: 320
  },
  {
    id: 2,
    userId: 2,
    userName: '摄影师阿杰',
    userAvatar: 'https://images.unsplash.com/photo-1633177188754-980c2a6b6266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDUzMzYyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1677922069769-0164b29e2c1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYWRlJTIwZHJhZ29uJTIwc25vdyUyMG1vdW50YWlufGVufDF8fHx8MTc2NDU5OTkwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    title: '玉龙雪山日出延时摄影',
    description: '凌晨4点出发，终于拍到了雪山日出的震撼画面。值了！',
    location: '玉龙雪山',
    duration: '01:15',
    views: 28900,
    likes: 2340,
    comments: 567,
    isLiked: true,
    height: 400
  },
  {
    id: 3,
    userId: 3,
    userName: '美食探店王小姐',
    userAvatar: 'https://images.unsplash.com/photo-1535208632259-841d129a6af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdHJhdmVsfGVufDF8fHx8MTc2NDU5ODc5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    type: 'guide',
    thumbnail: 'https://images.unsplash.com/photo-1672842035273-034ef95efa6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5dW5uYW4lMjBmb29kfGVufDF8fHx8MTc2NDU5OTkwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    title: '丽江腊排骨攻略：5家店对比测评',
    description: '作为腊排骨重度爱好者，今天带大家吃遍象山市场周边最有名的5家店，看看哪家最好吃！',
    location: '象山市场',
    duration: '08:42',
    views: 45600,
    likes: 3890,
    comments: 892,
    isLiked: false,
    height: 280
  },
  {
    id: 4,
    userId: 4,
    userName: '户外探险家老李',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDU5ODc5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1576033629470-267360d52efe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwbW9vbiUyMHZhbGxleXxlbnwxfHx8fDE3NjQ1OTk5MDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: '泸沽湖环湖骑行Vlog',
    description: '75公里环湖骑行，用双轮丈量女儿国的美丽。累并快乐着！',
    location: '泸沽湖',
    duration: '12:20',
    views: 18700,
    likes: 1560,
    comments: 445,
    isLiked: false,
    height: 360
  },
  {
    id: 5,
    userId: 5,
    userName: '旅拍达人小C',
    userAvatar: 'https://images.unsplash.com/photo-1535208632259-841d129a6af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdHJhdmVsfGVufDF8fHx8MTc2NDU5ODc5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    type: 'guide',
    thumbnail: 'https://images.unsplash.com/photo-1739868351932-6fb2ee9d3417?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwdHJhZGl0aW9uYWwlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzY0NTU4Nzg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: '束河古镇拍照打卡点推荐',
    description: '整理了10个超出片的拍照点，教你拍出古镇大片～',
    location: '束河古镇',
    duration: '05:30',
    views: 34200,
    likes: 2780,
    comments: 678,
    isLiked: true,
    height: 300
  },
  {
    id: 6,
    userId: 6,
    userName: '纳西文化传承人',
    userAvatar: 'https://images.unsplash.com/photo-1633177188754-980c2a6b6266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDUzMzYyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    type: 'guide',
    thumbnail: 'https://images.unsplash.com/photo-1637872937209-e1a5ccdc90cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWppYW5nJTIwb2xkJTIwdG93bnxlbnwxfHx8fDE3NjQ1NTIzODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: '东巴文化深度解读',
    description: '带你了解神秘的东巴文字和纳西族传统文化',
    location: '丽江古城',
    duration: '15:45',
    views: 8900,
    likes: 890,
    comments: 234,
    isLiked: false,
    height: 340
  },
  {
    id: 7,
    userId: 7,
    userName: '咖啡店主小林',
    userAvatar: 'https://images.unsplash.com/photo-1535208632259-841d129a6af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdHJhdmVsfGVufDF8fHx8MTc2NDU5ODc5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1739868351932-6fb2ee9d3417?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwdHJhZGl0aW9uYWwlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzY0NTU4Nzg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: '古城里最美的5家咖啡店',
    description: '每一家都有独特的故事，来丽江一定要打卡！',
    location: '丽江古城',
    duration: '06:15',
    views: 23400,
    likes: 1890,
    comments: 456,
    isLiked: false,
    height: 290
  },
  {
    id: 8,
    userId: 8,
    userName: '地陪阿秀',
    userAvatar: 'https://images.unsplash.com/photo-1643646805556-350c057663dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcG9ydHJhaXQlMjBzbWlsZXxlbnwxfHx8fDE3NjQ1NTE0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    type: 'guide',
    thumbnail: 'https://images.unsplash.com/photo-1677922069769-0164b29e2c1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYWRlJTIwZHJhZ29uJTIwc25vdyUyMG1vdW50YWlufGVufDF8fHx8MTc2NDU5OTkwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    title: '玉龙雪山一日游完整攻略',
    description: '从出发时间到注意事项，超详细的雪山游玩攻略！避坑指南！',
    location: '玉龙雪山',
    duration: '10:25',
    views: 56700,
    likes: 4560,
    comments: 1234,
    isLiked: true,
    height: 380
  }
];

export function VideoFeed() {
  const [videos, setVideos] = useState<Video[]>(mockVideos);

  const handleLike = (videoId: number) => {
    setVideos(videos.map(video =>
      video.id === videoId
        ? {
            ...video,
            isLiked: !video.isLiked,
            likes: video.isLiked ? video.likes - 1 : video.likes + 1
          }
        : video
    ));
  };

  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    }
    return num.toString();
  };

  return (
    <div className="px-4 pb-4">
      <Masonry columnsCount={2} gutter="12px">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative">
              <ImageWithFallback
                src={video.thumbnail}
                alt={video.title}
                className="w-full object-cover"
                style={{ height: `${video.height}px` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Play Icon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Play className="w-6 h-6 text-white fill-white ml-1" />
              </div>

              {/* Duration & Type Badge */}
              <div className="absolute top-2 left-2 flex gap-2">
                {video.type === 'guide' && (
                  <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
                    攻略
                  </span>
                )}
                <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
                  {video.duration}
                </span>
              </div>

              {/* Views */}
              <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
                <Eye className="w-3 h-3" />
                {formatNumber(video.views)}
              </div>

              {/* Location */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
                <MapPin className="w-3 h-3" />
                {video.location}
              </div>
            </div>

            {/* Content */}
            <div className="p-3">
              {/* Title */}
              <h4 className="text-gray-800 mb-2 line-clamp-2 text-sm">
                {video.title}
              </h4>

              {/* User Info */}
              <div className="flex items-center gap-2 mb-3">
                <ImageWithFallback
                  src={video.userAvatar}
                  alt={video.userName}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-gray-600 text-xs flex-1 truncate">
                  {video.userName}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 text-gray-500 text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(video.id);
                  }}
                  className={`flex items-center gap-1 ${
                    video.isLiked ? 'text-red-500' : 'hover:text-red-500'
                  } transition-colors`}
                >
                  <Heart
                    className={`w-4 h-4 ${video.isLiked ? 'fill-red-500' : ''}`}
                  />
                  {formatNumber(video.likes)}
                </button>

                <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  {formatNumber(video.comments)}
                </button>

                <button className="flex items-center gap-1 hover:text-green-500 transition-colors ml-auto">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </Masonry>
    </div>
  );
}

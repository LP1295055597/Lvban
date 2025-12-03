import { useState, useEffect } from 'react';
import { X, MapPin, Clock, DollarSign, Star, Volume2, VolumeX, Info, Camera, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Attraction {
  id: number;
  name: string;
  category: 'scenic' | 'food';
  image: string;
  location: string;
  openTime?: string;
  price?: string;
  rating: number;
  description: string;
  highlights: string[];
  tips: string[];
  audioGuide: string;
}

interface AttractionDetailProps {
  attraction: Attraction;
  onClose: () => void;
}

export function AttractionDetail({ attraction, onClose }: AttractionDetailProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSynthesis(window.speechSynthesis);
      const newUtterance = new SpeechSynthesisUtterance(attraction.audioGuide);
      newUtterance.lang = 'zh-CN';
      newUtterance.rate = 0.9;
      newUtterance.pitch = 1;
      
      newUtterance.onend = () => {
        setIsPlaying(false);
      };
      
      setUtterance(newUtterance);
    }

    return () => {
      if (synthesis) {
        synthesis.cancel();
      }
    };
  }, [attraction.audioGuide]);

  const toggleAudio = () => {
    if (!synthesis || !utterance) {
      alert('您的浏览器不支持语音播放功能');
      return;
    }

    if (isPlaying) {
      synthesis.cancel();
      setIsPlaying(false);
    } else {
      synthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header Image */}
        <div className="relative h-64">
          <ImageWithFallback
            src={attraction.image}
            alt={attraction.name}
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

          {/* Favorite Button */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-4 left-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-800'}`} />
          </button>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-white mb-2">{attraction.name}</h2>
            <div className="flex items-center gap-4 text-white/90 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{attraction.rating}分</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{attraction.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Audio Guide */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-gray-800">语音导览</h3>
              </div>
              <button
                onClick={toggleAudio}
                className={`px-4 py-2 rounded-full transition-colors ${
                  isPlaying
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isPlaying ? (
                  <div className="flex items-center gap-2">
                    <VolumeX className="w-4 h-4" />
                    <span className="text-sm">停止</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    <span className="text-sm">播放</span>
                  </div>
                )}
              </button>
            </div>
            <p className="text-gray-600 text-sm">点击播放按钮，收听专业导游讲解</p>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            {attraction.openTime && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="text-gray-500 text-sm">开放时间</div>
                  <div className="text-gray-800">{attraction.openTime}</div>
                </div>
              </div>
            )}
            {attraction.price && (
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="text-gray-500 text-sm">参考价格</div>
                  <div className="text-gray-800">{attraction.price}</div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="text-gray-800">景点介绍</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">{attraction.description}</p>
          </div>

          {/* Highlights */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Camera className="w-5 h-5 text-blue-600" />
              <h3 className="text-gray-800">游玩亮点</h3>
            </div>
            <div className="space-y-2">
              {attraction.highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                  <p className="text-gray-600 flex-1">{highlight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-orange-500" />
              <h3 className="text-gray-800">游玩贴士</h3>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 space-y-2 border border-orange-100">
              {attraction.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2" />
                  <p className="text-gray-700 flex-1 text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity">
              找搭子同行
            </button>
            <button className="flex-1 border-2 border-blue-500 text-blue-600 py-3 rounded-xl hover:bg-blue-50 transition-colors">
              预约旅行管家
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

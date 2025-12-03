import { useState } from 'react';
import { MapPin, Star, Award, Search, MessageCircle, Shield, Navigation, Heart, SlidersHorizontal } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { GuideDetail } from './GuideDetail';
import { ChatDialog } from './ChatDialog';

const GuideOrdersModern = ({ otherGuides }) => {
  const [selectedGuide, setSelectedGuide] = useState(null);

  return (
    <div className="space-y-3">
      {otherGuides.map((guide) => {
        return (
          <button
            key={guide.id}
            onClick={() => setSelectedGuide(guide)}
            className="w-full bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 hover:shadow-lg transition-all group border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <ImageWithFallback
                src={guide.avatar}
                alt={guide.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-700">{guide.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-xs text-gray-700">{guide.orderCount}单</span>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default GuideOrdersModern;
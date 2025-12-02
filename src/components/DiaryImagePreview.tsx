import { useState } from 'react';
import { ImageIcon, Heart } from 'lucide-react';
import { DiaryImageCard } from './DiaryImageCard';
import { getItemImage, cartoonFilter } from '../data/scenicImages';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DiaryImagePreviewProps {
  diaryData: {
    title: string;
    date: string;
    items: Array<{
      id: number;
      time: string;
      type: 'scenic' | 'food';
      name: string;
      description: string;
    }>;
  };
  guideName: string;
  userName: string;
}

export function DiaryImagePreview({ diaryData, guideName, userName }: DiaryImagePreviewProps) {
  const [showFullImage, setShowFullImage] = useState(false);

  return (
    <>
      {/* Clickable Preview */}
      <button
        onClick={() => setShowFullImage(true)}
        className="mt-2 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl p-2.5 w-56 hover:shadow-lg transition-shadow border border-yellow-300"
      >
        <div className="flex items-center gap-2 mb-2 bg-white rounded-lg p-2">
          <Heart className="w-4 h-4 fill-red-500 text-red-500 flex-shrink-0" />
          <div className="flex-1 text-left">
            <div className="text-xs text-gray-800 line-clamp-1">{diaryData.title}</div>
          </div>
        </div>
        
        {/* Mini Card Grid */}
        <div className="grid grid-cols-3 gap-1.5 mb-2">
          {diaryData.items.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className={`rounded-lg p-1.5 flex flex-col items-center ${
                item.type === 'scenic'
                  ? 'bg-gradient-to-br from-blue-100 to-blue-200'
                  : 'bg-gradient-to-br from-orange-100 to-orange-200'
              }`}
            >
              <div className="w-full aspect-square bg-white rounded-md overflow-hidden mb-1">
                <ImageWithFallback 
                  src={getItemImage(item.name)} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                  style={{ filter: cartoonFilter }}
                />
              </div>
              <div
                className={`px-1.5 py-0.5 rounded-full text-[9px] text-white text-center w-full truncate ${
                  item.type === 'scenic' ? 'bg-blue-900' : 'bg-orange-900'
                }`}
              >
                {item.name}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-600 bg-white rounded-md py-1">
          <ImageIcon className="w-3 h-3" />
          点击查看完整日记
        </div>
      </button>

      {/* Full Image Card Modal */}
      {showFullImage && (
        <DiaryImageCard
          title={diaryData.title}
          date={diaryData.date}
          items={diaryData.items}
          guideName={guideName}
          userName={userName}
          onClose={() => setShowFullImage(false)}
        />
      )}
    </>
  );
}
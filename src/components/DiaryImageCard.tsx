import { useState, useRef } from 'react';
import { X, Share2, Download, Camera, MapPin, Clock, Heart } from 'lucide-react';
import { getItemImage, cartoonFilter } from '../data/scenicImages';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DiaryItem {
  id: number;
  time: string;
  type: 'scenic' | 'food';
  name: string;
  description: string;
}

interface DiaryImageCardProps {
  title: string;
  date: string;
  items: DiaryItem[];
  guideName: string;
  userName: string;
  onClose: () => void;
}

export function DiaryImageCard({ title, date, items, guideName, userName, onClose }: DiaryImageCardProps) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    setShowShareOptions(true);
  };

  const handleDownload = async () => {
    const html2canvas = (await import('html2canvas')).default;
    
    if (imageRef.current) {
      const canvas = await html2canvas(imageRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `${title}-${date}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleShareToMoments = async () => {
    const html2canvas = (await import('html2canvas')).default;
    
    const shareContainer = document.createElement('div');
    shareContainer.style.position = 'fixed';
    shareContainer.style.left = '-9999px';
    
    // Generate card items HTML
    const cardsHTML = items.map((item, index) => {
      const bgColor = item.type === 'scenic' 
        ? 'background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);' 
        : 'background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);';
      
      const imageUrl = getItemImage(item.name);
      
      return `
        <div style="${bgColor} border-radius: 12px; padding: 12px; display: flex; flex-direction: column; align-items: center; gap: 8px; position: relative; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="width: 100%; aspect-ratio: 1; background: white; border-radius: 8px; overflow: hidden;">
            <img src="${imageUrl}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; filter: ${cartoonFilter};" crossorigin="anonymous" />
          </div>
          <div style="background: ${item.type === 'scenic' ? '#1e40af' : '#c2410c'}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; text-align: center; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${item.name}
          </div>
        </div>
      `;
    }).join('');

    shareContainer.innerHTML = `
      <div style="width: 375px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; border-radius: 20px;">
        <!-- Header -->
        <div style="background: white; border-radius: 16px; padding: 16px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <svg width="20" height="20" fill="#ef4444" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span style="font-size: 18px; font-weight: 600; color: #1f2937;">${title}</span>
          </div>
          <div style="font-size: 13px; color: #6b7280; line-height: 1.6;">
            ${items.map(item => `#${item.name}`).join(' ')}
          </div>
        </div>

        <!-- Card Grid -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px;">
          ${cardsHTML}
        </div>

        <!-- Footer Info -->
        <div style="background: white; border-radius: 16px; padding: 12px 16px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 6px; color: #6b7280; font-size: 13px;">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              丽江市
            </div>
            <svg width="16" height="16" fill="#9ca3af" viewBox="0 0 24 24">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 6px; color: #6b7280; font-size: 13px;">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              ${date}
            </div>
            <svg width="16" height="16" fill="#9ca3af" viewBox="0 0 24 24">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 6px; color: #6b7280; font-size: 13px;">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
              旅行管家可见
            </div>
            <div style="display: flex; align-items: center; gap: 4px; color: #6b7280; font-size: 13px;">
              <span>公开</span>
              <svg width="16" height="16" fill="#9ca3af" viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- App Footer -->
        <div style="background: white; border-radius: 16px; padding: 12px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <div style="width: 28px; height: 28px; background: linear-gradient(135deg, #38bdf8, #34d399); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">
                丽
              </div>
              <span style="font-size: 15px; font-weight: 600; color: #1f2937;">旅伴</span>
            </div>
            <div style="font-size: 11px; color: #9ca3af;">扫码下载APP，开启你的旅程</div>
          </div>
          <div style="width: 70px; height: 70px; background: white; border: 2px solid #e5e7eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; padding: 3px;">
            <div style="width: 100%; height: 100%; background: repeating-linear-gradient(0deg, #000 0px, #000 2px, transparent 2px, transparent 4px), repeating-linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent 4px);"></div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(shareContainer);
    
    const canvas = await html2canvas(shareContainer.firstChild as HTMLElement, {
      backgroundColor: 'transparent',
      scale: 2,
      logging: false,
      useCORS: true
    });

    document.body.removeChild(shareContainer);

    const link = document.createElement('a');
    link.download = `${title}-分享-${date}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    setShowShareOptions(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="relative max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Action Buttons */}
          <div className="absolute -bottom-16 left-0 right-0 flex gap-3 justify-center">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              分享
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-colors"
            >
              <Download className="w-5 h-5" />
              下载
            </button>
          </div>

          {/* Diary Image Card */}
          <div
            ref={imageRef}
            className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl overflow-hidden shadow-2xl p-5"
          >
            {/* Header */}
            <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                <h2 className="text-gray-800">{title}</h2>
              </div>
              <div className="text-xs text-gray-600 leading-relaxed">
                {items.map(item => `#${item.name}`).join(' ')}
              </div>
            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`rounded-xl p-3 flex flex-col items-center gap-2 shadow-sm ${
                    item.type === 'scenic'
                      ? 'bg-gradient-to-br from-blue-100 to-blue-200'
                      : 'bg-gradient-to-br from-orange-100 to-orange-200'
                  }`}
                >
                  {/* Icon Container */}
                  <div className="w-full aspect-square bg-white rounded-lg flex items-center justify-center overflow-hidden">
                    <ImageWithFallback 
                      src={getItemImage(item.name)} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                      style={{ filter: cartoonFilter }}
                    />
                  </div>
                  {/* Name Tag */}
                  <div
                    className={`px-3 py-1 rounded-full text-xs text-white text-center w-full truncate ${
                      item.type === 'scenic' ? 'bg-blue-900' : 'bg-orange-900'
                    }`}
                  >
                    {item.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Info */}
            <div className="bg-white rounded-2xl p-3 mb-3 shadow-sm space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>丽江市</span>
                </div>
                <span className="text-gray-400">›</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{date}</span>
                </div>
                <span className="text-gray-400">›</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                  <span>旅行管家可见</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <span>公开</span>
                  <span className="text-gray-400">›</span>
                </div>
              </div>
            </div>

            {/* App Branding */}
            <div className="text-center text-xs text-gray-500">
              由旅伴APP生成
            </div>
          </div>
        </div>
      </div>

      {/* Share Options Modal */}
      {showShareOptions && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-end justify-center" onClick={() => setShowShareOptions(false)}>
          <div
            className="bg-white rounded-t-3xl w-full max-w-md p-6 space-y-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-gray-800 text-center mb-4">分享到</h3>
            
            <button
              onClick={handleShareToMoments}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white">
                <Camera className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-gray-800">微信朋友圈</div>
                <div className="text-sm text-gray-500">生成带二维码的分享图片</div>
              </div>
            </button>

            <button
              onClick={handleDownload}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center text-white">
                <Download className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-gray-800">保存到相册</div>
                <div className="text-sm text-gray-500">下载原图到本地</div>
              </div>
            </button>

            <button
              onClick={() => setShowShareOptions(false)}
              className="w-full py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </>
  );
}
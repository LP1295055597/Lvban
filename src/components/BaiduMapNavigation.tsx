import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BaiduMapNavigationProps {
  destination: {
    name: string;
    latitude?: number;
    longitude?: number;
    address: string;
  };
  origin?: {
    latitude: number;
    longitude: number;
  } | null;
  onClose: () => void;
}

export function BaiduMapNavigation({ destination, origin, onClose }: BaiduMapNavigationProps) {
  const [mapUrl, setMapUrl] = useState<string>('');

  useEffect(() => {
    // 构建百度地图URL
    let url = '';
    
    if (origin && destination.latitude && destination.longitude) {
      // 导航模式 - 从当前位置到目的地
      const originStr = `${origin.latitude},${origin.longitude}`;
      const destStr = `${destination.latitude},${destination.longitude}`;
      url = `https://api.map.baidu.com/direction?origin=${originStr}&destination=latlng:${destStr}|name:${encodeURIComponent(destination.name)}&mode=driving&region=${encodeURIComponent(destination.address)}&output=html&src=webapp.baidu.openAPIdemo`;
    } else {
      // 定位模式 - 仅显示目的地
      const location = destination.latitude && destination.longitude 
        ? `${destination.latitude},${destination.longitude}`
        : encodeURIComponent(destination.address);
      url = `https://api.map.baidu.com/marker?location=${location}&title=${encodeURIComponent(destination.name)}&content=${encodeURIComponent(destination.address)}&output=html&src=webapp.baidu.openAPIdemo`;
    }
    
    setMapUrl(url);
  }, [destination, origin]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-gray-800">导航至</h3>
            <p className="text-sm text-gray-500">{destination.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          {mapUrl ? (
            <iframe
              src={mapUrl}
              className="w-full h-full border-0"
              title="百度地图导航"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-600">正在加载地图...</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-3xl">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">📍 {destination.address}</span>
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              在新窗口打开
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

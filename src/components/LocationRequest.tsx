import { useState, useEffect } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';

interface LocationRequestProps {
  onLocationGranted: (location: LocationData) => void;
  onLocationDenied: () => void;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  province?: string;
  country?: string;
}

export function LocationRequest({ onLocationGranted, onLocationDenied }: LocationRequestProps) {
  const [status, setStatus] = useState<'requesting' | 'loading' | 'error' | 'denied'>('requesting');
  const [errorMessage, setErrorMessage] = useState('');

  const requestLocation = () => {
    setStatus('loading');
    
    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMessage('您的浏览器不支持定位功能');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // 尝试使用逆地理编码获取城市信息
          // 这里使用一个公开的地理编码API（实际应用中可能需要配置API密钥）
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=zh-CN`
          );
          
          if (response.ok) {
            const data = await response.json();
            const locationData: LocationData = {
              latitude,
              longitude,
              city: data.address?.city || data.address?.county || data.address?.town,
              province: data.address?.state || data.address?.province,
              country: data.address?.country
            };
            onLocationGranted(locationData);
          } else {
            // 即使逆地理编码失败，也返回坐标
            onLocationGranted({ latitude, longitude });
          }
        } catch (error) {
          // 如果逆地理编码失败，仍然返回坐标
          console.error('逆地理编码失败:', error);
          onLocationGranted({ latitude, longitude });
        }
      },
      (error) => {
        setStatus('denied');
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrorMessage('您拒绝了位置访问请求');
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMessage('无法获取您的位置信息');
            break;
          case error.TIMEOUT:
            setErrorMessage('定位请求超时，请重试');
            break;
          default:
            setErrorMessage('获取位置时发生未知错误');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSkip = () => {
    // 默认设置为丽江位置
    onLocationGranted({
      latitude: 26.8772,
      longitude: 100.2333,
      city: '丽江市',
      province: '云南省',
      country: '中国'
    });
  };

  useEffect(() => {
    // 自动请求位置（可选）
    // requestLocation();
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header Image */}
        <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-20 h-20 bg-white rounded-full"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 bg-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full"></div>
          </div>
          <div className="relative">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MapPin className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-white mb-2">欢迎来到旅伴</h2>
            <p className="text-white/90 text-sm">为您提供更好的本地化服务</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {status === 'requesting' && (
            <>
              <div className="text-center mb-6">
                <h3 className="text-gray-800 mb-2">获取您的位置</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  我们需要获取您的位置信息，以便为您推荐附近的景点、美食和旅行搭子
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600">📍</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-800 text-sm mb-1">精准推荐</h4>
                    <p className="text-gray-600 text-xs">根据您的位置推荐附近的景点和活动</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-purple-50 rounded-xl p-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600">👥</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-800 text-sm mb-1">找到搭子</h4>
                    <p className="text-gray-600 text-xs">匹配同城或附近的旅行伙伴</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-pink-50 rounded-xl p-3">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-pink-600">🎯</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-800 text-sm mb-1">本地服务</h4>
                    <p className="text-gray-600 text-xs">获取最适合的地陪和导游服务</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={requestLocation}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
                >
                  <Navigation className="w-5 h-5" />
                  允许获取位置
                </button>

                <button
                  onClick={handleSkip}
                  className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  跳过，稍后设置
                </button>
              </div>

              <p className="text-center text-gray-500 text-xs mt-4">
                💡 您的隐私很重要，位置信息仅用于提供本地化服务
              </p>
            </>
          )}

          {status === 'loading' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-gray-800 mb-2">正在获取位置...</h3>
              <p className="text-gray-600 text-sm">请稍候片刻</p>
            </div>
          )}

          {status === 'denied' && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-gray-800 mb-2">无法获取位置</h3>
                <p className="text-gray-600 text-sm">{errorMessage}</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={requestLocation}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                  重新尝试
                </button>

                <button
                  onClick={handleSkip}
                  className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  使用默认位置（丽江市）
                </button>
              </div>

              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <p className="text-yellow-800 text-xs">
                  💡 提示：如果您拒绝了位置权限，可以在浏览器设置中重新开启，或在个人中心手动设置位置
                </p>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-gray-800 mb-2">位置服务不可用</h3>
                <p className="text-gray-600 text-sm">{errorMessage}</p>
              </div>

              <button
                onClick={handleSkip}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                继续使用默认位置
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
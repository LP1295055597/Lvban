import { useState, useEffect } from 'react';
import { X, MapPin, Navigation, Search, Clock, Star } from 'lucide-react';
import { meetingPoints, MeetingPoint, calculateDistance, formatDistance } from '../data/meetingPoints';

interface LocationPickerProps {
  userLocation: { latitude: number; longitude: number; city?: string } | null;
  onSelect: (location: MeetingPoint) => void;
  onClose: () => void;
}

export function LocationPicker({ userLocation, onSelect, onClose }: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<MeetingPoint | null>(null);
  const [searchText, setSearchText] = useState('');
  const [customLocation, setCustomLocation] = useState({
    name: '',
    address: '',
    latitude: 26.8774,
    longitude: 100.2298
  });
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [tab, setTab] = useState<'nearby' | 'common' | 'custom'>('nearby');

  // 模拟附近POI搜索结果
  const [searchResults, setSearchResults] = useState<MeetingPoint[]>([]);

  // 根据用户位置排序常用集合点
  const sortedMeetingPoints = userLocation
    ? [...meetingPoints].sort((a, b) => {
        const distA = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          a.latitude,
          a.longitude
        );
        const distB = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          b.latitude,
          b.longitude
        );
        return distA - distB;
      })
    : meetingPoints;

  // 用户当前位置作为一个选项
  const currentLocationOption: MeetingPoint | null = userLocation
    ? {
        id: 'current-location',
        name: '当前位置',
        address: userLocation.city || '定位中...',
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        description: '使用您的当前位置作为集合点'
      }
    : null;

  // 搜索功能
  useEffect(() => {
    if (searchText.trim() === '') {
      setSearchResults([]);
      return;
    }

    // 模拟搜索延迟
    const timer = setTimeout(() => {
      const results = meetingPoints.filter(
        point =>
          point.name.toLowerCase().includes(searchText.toLowerCase()) ||
          point.address.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchResults(results);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelect(selectedLocation);
      onClose();
    }
  };

  const handleCustomLocationConfirm = () => {
    if (customLocation.name && customLocation.address) {
      const location: MeetingPoint = {
        id: `custom-${Date.now()}`,
        name: customLocation.name,
        address: customLocation.address,
        latitude: customLocation.latitude,
        longitude: customLocation.longitude,
        description: '自定义集合点'
      };
      onSelect(location);
      onClose();
    }
  };

  const renderLocationCard = (location: MeetingPoint, isCurrent: boolean = false) => {
    const isSelected = selectedLocation?.id === location.id;
    const distance = userLocation
      ? calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          location.latitude,
          location.longitude
        )
      : null;

    return (
      <button
        key={location.id}
        onClick={() => setSelectedLocation(location)}
        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
          isSelected
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-blue-300'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${isCurrent ? 'bg-green-100' : 'bg-blue-100'}`}>
            {isCurrent ? (
              <Navigation className="w-5 h-5 text-green-600" />
            ) : (
              <MapPin className="w-5 h-5 text-blue-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-gray-800 truncate">{location.name}</h4>
              {distance !== null && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                  {formatDistance(distance)}
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm line-clamp-2">{location.address}</p>
            {location.description && (
              <p className="text-gray-500 text-xs mt-1">{location.description}</p>
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2>选择集合点</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="搜索集合点..."
            className="w-full px-4 py-3 pl-10 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Tabs */}
      {searchText === '' && (
        <div className="flex gap-2 p-4 bg-gray-50 border-b border-gray-200">
          <button
            onClick={() => setTab('nearby')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              tab === 'nearby'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            附近位置
          </button>
          <button
            onClick={() => setTab('common')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              tab === 'common'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            常用集合点
          </button>
          <button
            onClick={() => setTab('custom')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              tab === 'custom'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            自定义
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Search Results */}
        {searchText !== '' && (
          <>
            {searchResults.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">未找到相关位置</p>
                <p className="text-gray-400 text-sm mt-1">试试其他关键词</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 text-sm mb-3">找到 {searchResults.length} 个位置</p>
                {searchResults.map((location) => renderLocationCard(location))}
              </>
            )}
          </>
        )}

        {/* Nearby Tab */}
        {searchText === '' && tab === 'nearby' && (
          <>
            {currentLocationOption && (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <Navigation className="w-5 h-5 text-green-600" />
                  <h3 className="text-gray-800">当前位置</h3>
                </div>
                {renderLocationCard(currentLocationOption, true)}
                <div className="border-t border-gray-200 my-4" />
              </>
            )}
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h3 className="text-gray-800">附近集合点</h3>
            </div>
            {sortedMeetingPoints.slice(0, 5).map((location) => renderLocationCard(location))}
          </>
        )}

        {/* Common Tab */}
        {searchText === '' && tab === 'common' && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <h3 className="text-gray-800">常用集合点</h3>
            </div>
            {sortedMeetingPoints.map((location) => renderLocationCard(location))}
          </>
        )}

        {/* Custom Tab */}
        {searchText === '' && tab === 'custom' && (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-gray-800 mb-1">自定义集合点</h4>
                  <p className="text-gray-600 text-sm">
                    输入具体的集合地点名称和地址
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-gray-700 text-sm mb-2 block">地点名称 *</label>
              <input
                type="text"
                value={customLocation.name}
                onChange={(e) =>
                  setCustomLocation({ ...customLocation, name: e.target.value })
                }
                placeholder="例如：XX酒店门口"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm mb-2 block">详细地址 *</label>
              <textarea
                value={customLocation.address}
                onChange={(e) =>
                  setCustomLocation({ ...customLocation, address: e.target.value })
                }
                placeholder="例如：云南省丽江市古城区XX路XX号"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
            </div>

            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <p className="text-yellow-800 text-sm">
                💡 提示：请确保填写的地址准确，方便旅行管家准时到达
              </p>
            </div>

            <button
              onClick={handleCustomLocationConfirm}
              disabled={!customLocation.name || !customLocation.address}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              确认自定义位置
            </button>
          </div>
        )}
      </div>

      {/* Footer - Confirm Button */}
      {(tab === 'nearby' || tab === 'common' || searchText !== '') && (
        <div className="p-4 bg-white border-t border-gray-200 shadow-lg">
          <button
            onClick={handleConfirm}
            disabled={!selectedLocation}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            确认集合点
          </button>
        </div>
      )}
    </div>
  );
}

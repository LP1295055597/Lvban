import { useState } from 'react';
import { X, MapPin, Calendar, Users, Clock, Tag, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface PublishTripProps {
  onClose: () => void;
  onPublish: (trip: TripData) => void;
  userLocation?: { city: string; province: string } | null;
}

export interface TripData {
  destination: string;
  startDate: string;
  duration: string;
  peopleCount: string;
  activityTypes: string[];
  description: string;
}

const hotCities = [
  '北京', '上海', '广州', '深圳', '成都', '重庆', '杭州', '西安',
  '南京', '武汉', '苏州', '天津', '长沙', '郑州', '青岛', '厦门',
  '丽江', '三亚', '大理', '拉萨', '桂林', '张家界', '黄山', '九寨沟'
];

const activityTypes = [
  { id: 'hiking', label: '爬山', icon: '🏔️' },
  { id: 'food', label: '吃饭', icon: '🍜' },
  { id: 'shopping', label: '逛街', icon: '🛍️' },
  { id: 'photo', label: '拍照', icon: '📸' },
  { id: 'culture', label: '文化', icon: '🏛️' },
  { id: 'beach', label: '海滩', icon: '🏖️' },
  { id: 'adventure', label: '探险', icon: '🧗' },
  { id: 'relax', label: '休闲', icon: '☕' },
  { id: 'nightlife', label: '夜生活', icon: '🎉' },
  { id: 'nature', label: '自然', icon: '🌿' },
  { id: 'art', label: '艺术', icon: '🎨' },
  { id: 'sports', label: '运动', icon: '⚽' }
];

const durations = ['1天', '2-3天', '4-7天', '8-15天', '15天以上'];
const peopleCounts = ['1人', '2人', '3-5人', '6-10人', '10人以上'];

export function PublishTrip({ onClose, onPublish, userLocation }: PublishTripProps) {
  const [formData, setFormData] = useState<TripData>({
    destination: userLocation?.city || '',
    startDate: '',
    duration: '',
    peopleCount: '',
    activityTypes: [],
    description: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TripData, string>>>({});
  const [showAllCities, setShowAllCities] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const toggleActivityType = (typeId: string) => {
    setFormData(prev => ({
      ...prev,
      activityTypes: prev.activityTypes.includes(typeId)
        ? prev.activityTypes.filter(t => t !== typeId)
        : [...prev.activityTypes, typeId]
    }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof TripData, string>> = {};
    
    if (!formData.destination) newErrors.destination = '请选择目的地';
    if (!formData.startDate) newErrors.startDate = '请选择出发日期';
    if (!formData.duration) newErrors.duration = '请选择行程时长';
    if (!formData.peopleCount) newErrors.peopleCount = '请选择人数';
    if (formData.activityTypes.length === 0) newErrors.activityTypes = '请至少选择一种游玩类型';
    if (!formData.description.trim()) newErrors.description = '请填写行程说明';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onPublish(formData);
      onClose();
    }
  };

  // 准备城市列表：用户位置优先，然后是热门城市
  const getCitiesToDisplay = () => {
    const cities = [...hotCities];
    
    // 如果用户位置存在且不在热门城市中，添加到开头
    if (userLocation?.city && !cities.includes(userLocation.city)) {
      cities.unshift(userLocation.city);
    }
    
    return cities;
  };

  const citiesToDisplay = getCitiesToDisplay();
  
  // 根据是否展开显示不同数量的城市
  const visibleCities = showAllCities ? citiesToDisplay : citiesToDisplay.slice(0, 12); // 3行 x 4列 = 12个
  
  // 搜索过滤
  const filteredCities = searchQuery.trim() 
    ? citiesToDisplay.filter(city => city.includes(searchQuery))
    : [];

  const handleCitySelect = (city: string) => {
    setFormData(prev => ({ ...prev, destination: city }));
    setSearchQuery('');
    setShowSearchResults(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <h2 className="text-gray-800">发布行程</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Destination */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 mb-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              目的地
              <span className="text-red-500">*</span>
            </label>
            
            {/* Search Input */}
            <div className="relative mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(e.target.value.trim().length > 0);
                }}
                onFocus={() => setShowSearchResults(searchQuery.trim().length > 0)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="搜索目的地城市..."
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              
              {/* Search Results Dropdown */}
              {showSearchResults && filteredCities.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
                  {filteredCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 transition-colors"
                    >
                      <MapPin className="w-4 h-4 inline mr-2 text-blue-500" />
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Current Selection */}
            {formData.destination && (
              <div className="mb-3 flex items-center gap-2">
                <span className="text-sm text-gray-600">已选择：</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {formData.destination}
                  {userLocation?.city === formData.destination && (
                    <span className="ml-1 text-xs">(当前位置)</span>
                  )}
                </span>
              </div>
            )}

            {/* City Selection Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  {userLocation?.city ? '当前位置 & 热门目的地' : '热门目的地'}
                </span>
                {citiesToDisplay.length > 12 && (
                  <button
                    onClick={() => setShowAllCities(!showAllCities)}
                    className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
                  >
                    {showAllCities ? (
                      <>
                        收起 <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        查看更多 <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {visibleCities.map((city) => {
                  const isUserLocation = userLocation?.city === city;
                  const isSelected = formData.destination === city;
                  
                  return (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={`py-2 px-3 rounded-lg text-sm transition-colors relative ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {city}
                      {isUserLocation && (
                        <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                          isSelected ? 'bg-blue-400' : 'bg-emerald-500 text-white'
                        }`}>
                          📍
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {errors.destination && (
              <p className="text-red-500 text-sm mt-2">{errors.destination}</p>
            )}
          </div>

          {/* Start Date */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 mb-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              出发日期
              <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-2">{errors.startDate}</p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
              行程时长
              <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {durations.map((duration) => (
                <button
                  key={duration}
                  onClick={() => setFormData(prev => ({ ...prev, duration }))}
                  className={`py-2 px-3 rounded-lg text-sm transition-colors ${
                    formData.duration === duration
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {duration}
                </button>
              ))}
            </div>
            {errors.duration && (
              <p className="text-red-500 text-sm mt-2">{errors.duration}</p>
            )}
          </div>

          {/* People Count */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 mb-3">
              <Users className="w-5 h-5 text-blue-600" />
              期望人数
              <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {peopleCounts.map((count) => (
                <button
                  key={count}
                  onClick={() => setFormData(prev => ({ ...prev, peopleCount: count }))}
                  className={`py-2 px-3 rounded-lg text-sm transition-colors ${
                    formData.peopleCount === count
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
            {errors.peopleCount && (
              <p className="text-red-500 text-sm mt-2">{errors.peopleCount}</p>
            )}
          </div>

          {/* Activity Types */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 mb-3">
              <Tag className="w-5 h-5 text-blue-600" />
              游玩类型
              <span className="text-red-500">*</span>
              <span className="text-gray-500 text-sm">（可多选）</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {activityTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => toggleActivityType(type.id)}
                  className={`py-3 px-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 ${
                    formData.activityTypes.includes(type.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
            {errors.activityTypes && (
              <p className="text-red-500 text-sm mt-2">{errors.activityTypes}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 mb-3">
              行程说明
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="介绍一下你的行程计划，想找什么样的搭子..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-2">{errors.description}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              发布行程
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

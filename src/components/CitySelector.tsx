import { useState } from 'react';
import { X, MapPin, Search, Navigation, Check } from 'lucide-react';
import { CITIES_DATA, HOT_CITIES, CityData } from '../data/cityData';

interface CitySelectorProps {
  currentCity: CityData;
  onSelect: (city: CityData) => void;
  onClose: () => void;
}

export function CitySelector({ currentCity, onSelect, onClose }: CitySelectorProps) {
  const [searchText, setSearchText] = useState('');
  const [filteredCities, setFilteredCities] = useState<CityData[]>(CITIES_DATA);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredCities(CITIES_DATA);
    } else {
      const filtered = CITIES_DATA.filter(
        (city) =>
          city.cityName.toLowerCase().includes(text.toLowerCase()) ||
          city.province.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  };

  const handleSelectCity = (city: CityData) => {
    onSelect(city);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2>选择城市</h2>
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
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="搜索城市名称..."
            className="w-full px-4 py-3 pl-10 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Current City */}
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-5 h-5 text-blue-600" />
            <h3 className="text-gray-800">当前城市</h3>
          </div>
          <button
            className="w-full p-4 bg-white rounded-xl border-2 border-blue-500 text-left"
            onClick={() => handleSelectCity(currentCity)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-gray-800 mb-1">{currentCity.cityName}</h4>
                <p className="text-gray-600 text-sm">{currentCity.province}</p>
              </div>
              <Check className="w-6 h-6 text-blue-600" />
            </div>
          </button>
        </div>

        {/* Hot Cities */}
        {searchText === '' && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-orange-600" />
              <h3 className="text-gray-800">热门城市</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {HOT_CITIES.map((hotCity) => {
                const cityData = CITIES_DATA.find((c) => c.cityCode === hotCity.code);
                if (!cityData) return null;
                
                const isSelected = cityData.cityCode === currentCity.cityCode;
                
                return (
                  <button
                    key={hotCity.code}
                    onClick={() => handleSelectCity(cityData)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-center">
                      <h4 className="text-gray-800 mb-1">{hotCity.name}</h4>
                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-600 mx-auto" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* All Cities / Search Results */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-gray-600" />
            <h3 className="text-gray-800">
              {searchText ? `搜索结果 (${filteredCities.length})` : '全部城市'}
            </h3>
          </div>

          {filteredCities.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">未找到相关城市</p>
              <p className="text-gray-400 text-sm mt-1">试试其他关键词</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCities.map((city) => {
                const isSelected = city.cityCode === currentCity.cityCode;
                
                return (
                  <button
                    key={city.cityCode}
                    onClick={() => handleSelectCity(city)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-gray-800 mb-1">{city.cityName}</h4>
                        <p className="text-gray-600 text-sm">{city.province}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span>{city.attractions.length} 个景点</span>
                          <span>{city.foods.length} 种美食</span>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-6 h-6 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 bg-yellow-50 border-t border-yellow-100">
        <p className="text-yellow-800 text-sm flex items-start gap-2">
          <span>💡</span>
          <span>更换城市后，首页将显示该城市的景点和美食推荐</span>
        </p>
      </div>
    </div>
  );
}

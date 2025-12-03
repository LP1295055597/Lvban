import { useState } from 'react';
import { X, DollarSign, TrendingUp, AlertCircle, Info, CheckCircle2, Shield, Award, Car, Plus, Minus } from 'lucide-react';

interface PriceSettingProps {
  onClose: () => void;
  onSave: (data: {
    price: number;
    hasVehicle: boolean;
    vehicleInfo?: {
      brand: string;
      price: number;
    };
  }) => void;
  currentPrice?: number;
  currentVehiclePrice?: number;
  currentVehicleBrand?: string;
  hasVehicle?: boolean;
  certificationStatus: 'none' | 'pending' | 'approved' | 'rejected';
  pointsLevel?: {
    level: number;
    name: string;
    priceLimit: number;
    icon: string;
  };
}

export function PriceSetting({ 
  onClose, 
  onSave, 
  currentPrice = 50,
  currentVehiclePrice = 200,
  currentVehicleBrand = '',
  hasVehicle: initialHasVehicle = false,
  certificationStatus,
  pointsLevel
}: PriceSettingProps) {
  const [price, setPrice] = useState(currentPrice.toString());
  const [hasVehicle, setHasVehicle] = useState(initialHasVehicle);
  const [vehiclePrice, setVehiclePrice] = useState(currentVehiclePrice.toString());
  const [vehicleBrand, setVehicleBrand] = useState(currentVehicleBrand);
  const [showSuccess, setShowSuccess] = useState(false);

  // 计算价格限制
  const getMinPrice = () => 30;
  const getMaxPrice = () => {
    // 未认证：最高80元
    if (certificationStatus !== 'approved') {
      return 80;
    }
    // 已认证：根据积分等级
    return pointsLevel?.priceLimit || 200;
  };

  const minPrice = getMinPrice();
  const maxPrice = getMaxPrice();

  // 推荐价格
  const recommendedPrices = [
    { label: '入门价', value: 50, desc: '适合新手旅行管家' },
    { label: '标准价', value: 80, desc: '最受欢迎' },
    { label: '优质价', value: 120, desc: '高品质服务', needsCert: true },
    { label: '高端价', value: 180, desc: '资深旅行管家', needsCert: true },
  ];

  const handleSave = () => {
    const priceNum = parseFloat(price);
    const vehiclePriceNum = parseFloat(vehiclePrice);
    
    if (isNaN(priceNum)) {
      alert('请输入有效的价格');
      return;
    }

    if (priceNum < minPrice) {
      alert(`价格不能低于¥${minPrice}/小时`);
      return;
    }

    if (priceNum > maxPrice) {
      alert(`当前等级价格上限为¥${maxPrice}/小时\n${
        certificationStatus !== 'approved' 
          ? '申请平台认证可提升至¥200/小时'
          : '提升积分等级可获得更高定价权限'
      }`);
      return;
    }

    if (hasVehicle && isNaN(vehiclePriceNum)) {
      alert('请输入有效的车辆价格');
      return;
    }

    setShowSuccess(true);
    setTimeout(() => {
      onSave({
        price: priceNum,
        hasVehicle,
        vehicleInfo: hasVehicle ? { brand: vehicleBrand, price: vehiclePriceNum } : undefined
      });
      onClose();
    }, 1500);
  };

  const handleQuickSelect = (value: number) => {
    if (value <= maxPrice) {
      setPrice(value.toString());
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center animate-scale-in">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h3 className="text-gray-800 mb-2">价格设置成功！</h3>
          <p className="text-gray-600 text-sm">
            您的服务价格已更新为 ¥{price}/小时
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-3xl">
          <div>
            <h3 className="text-gray-800">价格设置</h3>
            <p className="text-gray-600 text-sm">设置您的服务价格（每小时）</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Status */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-gray-800 mb-1">当前定价权限</h4>
                <p className="text-gray-600 text-sm">
                  {certificationStatus === 'approved' ? '已认证旅行管家' : '未认证旅行管家'}
                  {pointsLevel && ` · ${pointsLevel.name}`}
                </p>
              </div>
              {certificationStatus === 'approved' && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-sm">
                  <Shield className="w-4 h-4" />
                  已认证
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-600 text-sm">最低价格</span>
                </div>
                <p className="text-2xl text-blue-600">¥{minPrice}</p>
              </div>
              <div className="bg-white rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-600 text-sm">最高价格</span>
                </div>
                <p className="text-2xl text-purple-600">¥{maxPrice}</p>
              </div>
            </div>

            {certificationStatus !== 'approved' && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
                <div className="flex gap-2">
                  <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-700 text-xs">
                    申请平台认证可将价格上限提升至¥200/小时，并获得更多曝光机会
                  </p>
                </div>
              </div>
            )}

            {pointsLevel && pointsLevel.level < 6 && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3">
                <div className="flex gap-2">
                  <Award className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-700 text-xs">
                    提升积分等级可获得更高的定价权限，传奇旅行管家最高可定价¥300/小时
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Select Prices */}
          <div>
            <h4 className="text-gray-800 mb-3">推荐价格</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {recommendedPrices.map((item) => {
                const isDisabled = item.needsCert && certificationStatus !== 'approved';
                const isSelected = price === item.value.toString();
                
                return (
                  <button
                    key={item.value}
                    onClick={() => !isDisabled && handleQuickSelect(item.value)}
                    disabled={isDisabled}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : isDisabled
                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    {isDisabled && (
                      <div className="absolute top-2 right-2">
                        <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">🔒</span>
                        </div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-gray-500 text-xs mb-1">{item.label}</div>
                      <div className={`text-xl mb-1 ${
                        isSelected ? 'text-blue-600' : isDisabled ? 'text-gray-400' : 'text-gray-800'
                      }`}>
                        ¥{item.value}
                      </div>
                      <div className="text-gray-400 text-xs">{item.desc}</div>
                    </div>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Price Input */}
          <div>
            <h4 className="text-gray-800 mb-3">自定义价格</h4>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <span className="text-gray-500 text-xl">¥</span>
              </div>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="请输入价格"
                min={minPrice}
                max={maxPrice}
                className="w-full pl-12 pr-20 py-4 text-2xl border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <span className="text-gray-500">/小时</span>
              </div>
            </div>

            {/* Price Range Indicator */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">价格区间</span>
                <span className="text-gray-600 text-sm">¥{minPrice} - ¥{maxPrice}</span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all"
                  style={{
                    left: '0%',
                    width: `${((parseFloat(price) || minPrice) - minPrice) / (maxPrice - minPrice) * 100}%`
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">最低</span>
                <span className="text-xs text-gray-500">最高</span>
              </div>
            </div>
          </div>

          {/* Market Reference */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-green-800 text-sm mb-2">市场参考</h4>
                <div className="text-green-700 text-xs space-y-1">
                  <p>• 丽江旅行管家平均价格：¥80-120/小时</p>
                  <p>• 新手旅行管家建议：¥50-80/小时</p>
                  <p>• 资深旅行管家参考：¥120-200/小时</p>
                  <p>• 定价适中更容易获得订单</p>
                </div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-amber-800 text-sm mb-1">温馨提示</h4>
                <p className="text-amber-700 text-xs leading-relaxed">
                  • 价格设置后立即生效，影响所有新订单<br/>
                  • 合理定价可提高订单量和收入<br/>
                  • 价格过高可能影响接单率<br/>
                  • 建议根据服务质量和市场行情调整
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Tips */}
          <div className="bg-blue-50 rounded-2xl p-5">
            <h4 className="text-gray-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              定价建议
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">💡</span>
                <p className="text-gray-700">
                  <span className="font-medium">新手旅行管家：</span>建议从¥50-60开始，积累好评后逐步提价
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">💡</span>
                <p className="text-gray-700">
                  <span className="font-medium">有经验旅行管家：</span>根据服务质量定价¥80-120
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">💡</span>
                <p className="text-gray-700">
                  <span className="font-medium">资深旅行管家：</span>凭借口碑和特色服务可定价¥150+
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">💡</span>
                <p className="text-gray-700">
                  <span className="font-medium">节假日：</span>可适当上调10-20%
                </p>
              </div>
            </div>
          </div>

          {/* Vehicle Settings Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Car className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="text-gray-800">车辆服务</h4>
                  <p className="text-gray-600 text-sm">提供车辆接送服务</p>
                </div>
              </div>
              <button
                onClick={() => setHasVehicle(!hasVehicle)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  hasVehicle ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                    hasVehicle ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {hasVehicle && (
              <div className="space-y-4 mt-4">
                {/* Vehicle Brand Input */}
                <div>
                  <label className="text-gray-700 text-sm mb-2 block">
                    车辆品牌 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={vehicleBrand}
                    onChange={(e) => setVehicleBrand(e.target.value)}
                    placeholder="例如：别克GL8"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Vehicle Price Input */}
                <div>
                  <label className="text-gray-700 text-sm mb-2 block">
                    车辆价格（按天计费） <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <span className="text-gray-500 text-xl">¥</span>
                    </div>
                    <input
                      type="number"
                      value={vehiclePrice}
                      onChange={(e) => setVehiclePrice(e.target.value)}
                      placeholder="请输入车辆价格"
                      className="w-full pl-12 pr-16 py-4 text-2xl border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <span className="text-gray-500">/天</span>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-white border border-green-200 rounded-xl p-3">
                  <div className="flex gap-2">
                    <Info className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-green-700 text-xs space-y-1">
                      <p>💡 无论游客预约几小时，车辆费用均按一天收取</p>
                      <p>🚗 车辆价格建议：经济型¥150-200，商务型¥250-300</p>
                      <p>📋 确保车辆信息真实有效，虚假信息将影响接单</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!hasVehicle && (
              <div className="bg-white border border-green-200 rounded-xl p-4 text-center">
                <p className="text-gray-500 text-sm mb-2">暂未提供车辆服务</p>
                <p className="text-gray-400 text-xs">开启后可设置车辆价格，增加收入来源</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              保存设置
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        /* 隐藏 number input 的上下箭头 */
        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type='number'] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
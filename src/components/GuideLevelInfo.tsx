import { X, Star, Award, Camera, Car, CheckCircle, ChevronRight } from 'lucide-react';
import { GUIDE_LEVELS, POINTS_RULES, VERIFICATION_DISCOUNT, formatCommissionRate, calculateCommissionRate, formatPriceRange } from '../utils/guideLevelSystem';

interface GuideLevelInfoProps {
  onClose: () => void;
}

export function GuideLevelInfo({ onClose }: GuideLevelInfoProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-gray-900">旅行管家等级体系</h2>
            <p className="text-sm text-gray-500 mt-1">通过积分提升等级，享受更低抽成</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Level Cards */}
          <div>
            <h3 className="text-gray-900 mb-4">等级说明</h3>
            <div className="space-y-3">
              {Object.values(GUIDE_LEVELS).map((levelInfo) => (
                <div
                  key={levelInfo.level}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${levelInfo.bgColor} rounded-2xl flex items-center justify-center text-2xl`}>
                        {levelInfo.icon}
                      </div>
                      <div>
                        <h4 className={`${levelInfo.color} mb-1`}>{levelInfo.name}旅行管家</h4>
                        <p className="text-sm text-gray-500">
                          {levelInfo.minPoints}-{levelInfo.maxPoints || '∞'}积分
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <div className="text-gray-500 text-xs mb-1">定价区间</div>
                      <div className={`${levelInfo.color} text-sm font-medium`}>
                        {formatPriceRange(levelInfo.level)}
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <div className="text-gray-500 text-xs mb-1">基础抽成</div>
                      <div className={`${levelInfo.color} text-xl`}>
                        {formatCommissionRate(levelInfo.baseCommissionRate)}
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <div className="text-gray-500 text-xs mb-1">认证后抽成</div>
                      <div className="text-green-600 text-xl">
                        {formatCommissionRate(calculateCommissionRate(levelInfo.level, true))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Points Rules */}
          <div>
            <h3 className="text-gray-900 mb-4">积分获取规则</h3>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-gray-900 text-sm">完成订单</div>
                    <div className="text-gray-500 text-xs">每完成1单</div>
                  </div>
                </div>
                <div className="text-blue-600">+{POINTS_RULES.ORDER_COMPLETED}积分</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-gray-900 text-sm">获得好评</div>
                    <div className="text-gray-500 text-xs">每获得1个好评</div>
                  </div>
                </div>
                <div className="text-blue-600">+{POINTS_RULES.GOOD_REVIEW}积分</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                    <Camera className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-gray-900 text-sm">提供摄影设备</div>
                    <div className="text-gray-500 text-xs">一次性加成</div>
                  </div>
                </div>
                <div className="text-blue-600">+{POINTS_RULES.PHOTOGRAPHY_EQUIPMENT}积分</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                    <Car className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-gray-900 text-sm">提供车辆服务</div>
                    <div className="text-gray-500 text-xs">一次性加成</div>
                  </div>
                </div>
                <div className="text-blue-600">+{POINTS_RULES.VEHICLE_PROVIDED}积分</div>
              </div>
            </div>
          </div>

          {/* Verification Benefits */}
          <div>
            <h3 className="text-gray-900 mb-4">平台认证优惠</h3>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900 mb-2">完成平台认证</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    完成平台身份认证后，平台抽成比例将降低<span className="text-green-600 font-medium"> {VERIFICATION_DISCOUNT * 100}%</span>
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 space-y-2">
                <div className="text-sm text-gray-600 mb-3">认证前后对比：</div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">初级管家（20%）</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span className="text-green-600">认证后 16%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">中级管家（18%）</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span className="text-green-600">认证后 14.4%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">高级管家（15%）</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span className="text-green-600">认证后 12%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">金牌管家（12%）</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span className="text-green-600">认证后 9.6%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
            <h4 className="text-gray-900 mb-3 flex items-center gap-2">
              <span>💡</span>
              <span>温馨提示</span>
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <p>积分实时累计，等级每日凌晨更新</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <p>提供摄影设备和车辆服务的积分为一次性加成</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <p>完成平台认证后，抽成优惠立即生效</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <p>提升等级可以获得更多订单推荐机会</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
}

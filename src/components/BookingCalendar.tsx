import { useState } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight, Check, MapPin, TrendingUp, Tag } from 'lucide-react';
import { MeetingPoint } from '../data/meetingPoints';
import { LocationPicker } from './LocationPicker';
import { TimeRangePicker } from './TimeRangePicker';
import { calculatePrice, formatPrice, getDiscountText, getTimePeriodName } from '../utils/priceCalculator';

interface BookingCalendarProps {
  guideName: string;
  userLocation: { latitude: number; longitude: number; city?: string } | null;
  onClose: () => void;
  onConfirm: (dates: string[], timeRange: { start: number; end: number }, meetingPoint: MeetingPoint, totalPrice: number) => void;
}

export function BookingCalendar({ guideName, userLocation, onClose, onConfirm }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [timeRange, setTimeRange] = useState<{ start: number; end: number } | null>(null);
  const [selectedMeetingPoint, setSelectedMeetingPoint] = useState<MeetingPoint | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // 生成日历
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const calendar: (Date | null)[] = [];
    
    // 添加空白日期
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendar.push(null);
    }
    
    // 添加日期
    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push(new Date(year, month, day));
    }
    
    return calendar;
  };

  const calendar = generateCalendar();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date >= today) {
      const isSelected = selectedDates.some(d => d.toDateString() === date.toDateString());
      if (isSelected) {
        setSelectedDates(selectedDates.filter(d => d.toDateString() !== date.toDateString()));
      } else {
        setSelectedDates([...selectedDates, date].sort((a, b) => a.getTime() - b.getTime()));
      }
    }
  };

  const handleConfirm = () => {
    if (selectedDates.length > 0 && timeRange && selectedMeetingPoint) {
      const dateStrs = selectedDates.map(date => 
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      );
      
      const priceInfo = calculatePrice(selectedDates.length, timeRange.start, timeRange.end);
      
      onConfirm(dateStrs, timeRange, selectedMeetingPoint, priceInfo.finalPrice);
      onClose();
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (date: Date) => {
    return selectedDates.some(d => d.toDateString() === date.toDateString());
  };

  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const formatFullDate = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const formatTimeRange = (range: { start: number; end: number }) => {
    return `${range.start}:00-${range.end}:00`;
  };

  // 计算价格
  const priceInfo = timeRange && selectedDates.length > 0
    ? calculatePrice(selectedDates.length, timeRange.start, timeRange.end)
    : null;

  const canConfirm = selectedDates.length > 0 && 
                     timeRange && 
                     (timeRange.end - timeRange.start) >= 3 && 
                     selectedMeetingPoint;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
        <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
            <h2 className="text-gray-800">预约 {guideName}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Step 1: Select Dates */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm">
                  1
                </div>
                <h3 className="text-gray-800">选择日期（可多选）</h3>
              </div>

              {/* Calendar Header */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h3 className="text-gray-800">
                  {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
                </h3>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div>
                {/* Week Days */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
                    <div key={day} className="text-center text-gray-500 text-sm py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-7 gap-2">
                  {calendar.map((date, index) => (
                    <button
                      key={index}
                      onClick={() => date && handleDateClick(date)}
                      disabled={!date || isPast(date)}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-colors relative ${
                        !date
                          ? 'invisible'
                          : isPast(date)
                          ? 'text-gray-300 cursor-not-allowed'
                          : isDateSelected(date)
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : isToday(date)
                          ? 'border-2 border-blue-500 text-blue-600 hover:bg-blue-50'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {date && date.getDate()}
                      {date && isDateSelected(date) && (
                        <Check className="w-3 h-3 absolute top-0.5 right-0.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Dates Summary */}
              {selectedDates.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 text-sm">已选择 {selectedDates.length} 天</span>
                    <button
                      onClick={() => setSelectedDates([])}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      清空
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedDates.map((date, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm"
                      >
                        <span>{formatDate(date)}</span>
                        <button
                          onClick={() => handleDateClick(date)}
                          className="ml-1 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Select Time Range */}
            {selectedDates.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm">
                    2
                  </div>
                  <h3 className="text-gray-800">选择服务时间</h3>
                </div>

                <TimeRangePicker
                  value={timeRange}
                  onChange={setTimeRange}
                />
              </div>
            )}

            {/* Step 3: Select Meeting Point */}
            {selectedDates.length > 0 && timeRange && (timeRange.end - timeRange.start) >= 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm">
                    3
                  </div>
                  <h3 className="text-gray-800">选择集合点</h3>
                </div>

                {selectedMeetingPoint ? (
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-gray-800">{selectedMeetingPoint.name}</h4>
                          <button
                            onClick={() => setSelectedMeetingPoint(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-gray-600 text-sm">{selectedMeetingPoint.address}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowLocationPicker(true)}
                      className="w-full mt-3 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
                    >
                      重新选择
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowLocationPicker(true)}
                    className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">点击选择集合点</p>
                    <p className="text-gray-400 text-xs mt-1">支持搜索或自定义位置</p>
                  </button>
                )}
              </div>
            )}

            {/* Price Estimation */}
            {priceInfo && (timeRange.end - timeRange.start) >= 3 && (
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <h4 className="text-gray-800">预计费用</h4>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">服务天数：</span>
                    <span className="text-gray-800">{priceInfo.baseDays} 天</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">每天时长：</span>
                    <span className="text-gray-800">
                      {priceInfo.hoursPerDay} 小时 
                      <span className="text-xs text-gray-500 ml-1">
                        ({getTimePeriodName(timeRange.start, timeRange.end)})
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">总时长：</span>
                    <span className="text-gray-800">{priceInfo.totalHours} 小时</span>
                  </div>
                  
                  {priceInfo.discountRate > 0 && (
                    <>
                      <div className="border-t border-orange-200 pt-2 mt-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">原价：</span>
                        <span className="text-gray-500 line-through">{formatPrice(priceInfo.basePrice)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Tag className="w-4 h-4 text-green-600" />
                          优惠折扣：
                        </span>
                        <span className="text-green-600">
                          -{formatPrice(priceInfo.discountAmount)} ({Math.round(priceInfo.discountRate * 100)}% OFF)
                        </span>
                      </div>
                      <div className="bg-green-100 rounded-lg px-3 py-2 text-xs text-green-700">
                        🎉 {getDiscountText(priceInfo.baseDays)}
                      </div>
                    </>
                  )}
                  
                  <div className="border-t border-orange-300 pt-2 mt-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-medium">预计总价：</span>
                    <span className="text-orange-600 text-2xl font-bold">
                      {formatPrice(priceInfo.finalPrice)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-500 bg-white rounded-lg p-3">
                  💡 最终价格以地陪确认为准，此为预估价格
                </div>
              </div>
            )}

            {/* Summary */}
            {selectedDates.length > 0 && timeRange && selectedMeetingPoint && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                <h4 className="text-gray-800 mb-3">预约摘要</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <Calendar className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-600">日期：</span>
                      <span className="text-gray-800">
                        {selectedDates.length === 1 
                          ? formatFullDate(selectedDates[0])
                          : `${formatFullDate(selectedDates[0])} 等 ${selectedDates.length} 天`
                        }
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-4 h-4 mt-0.5 flex-shrink-0 flex items-center justify-center">
                      ⏰
                    </div>
                    <div>
                      <span className="text-gray-600">时间：</span>
                      <span className="text-gray-800">
                        {formatTimeRange(timeRange)}
                        <span className="text-xs text-gray-500 ml-1">
                          ({timeRange.end - timeRange.start}小时)
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-600">集合点：</span>
                      <span className="text-gray-800">{selectedMeetingPoint.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirm}
                disabled={!canConfirm}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center"
              >
                <span>确认预约</span>
                {priceInfo && canConfirm && (
                  <span className="text-xs mt-1 opacity-90">
                    {formatPrice(priceInfo.finalPrice)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Location Picker */}
      {showLocationPicker && (
        <LocationPicker
          userLocation={userLocation}
          onSelect={(location) => {
            setSelectedMeetingPoint(location);
            setShowLocationPicker(false);
          }}
          onClose={() => setShowLocationPicker(false)}
        />
      )}
    </>
  );
}

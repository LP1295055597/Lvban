import { useState, useEffect } from 'react';
import { Clock, Sunrise, Sun, Moon } from 'lucide-react';

interface TimeRangePickerProps {
  value: { start: number; end: number } | null;
  onChange: (range: { start: number; end: number }) => void;
}

const MIN_HOUR = 8;
const MAX_HOUR = 21;
const MIN_DURATION = 3; // 最少3小时

// 快捷时间段
const QUICK_OPTIONS = [
  { label: '上午', icon: Sunrise, start: 8, end: 12, color: 'from-orange-400 to-yellow-400' },
  { label: '下午', icon: Sun, start: 13, end: 18, color: 'from-blue-400 to-cyan-400' },
  { label: '全天', icon: Moon, start: 8, end: 21, color: 'from-purple-500 to-pink-500' },
];

export function TimeRangePicker({ value, onChange }: TimeRangePickerProps) {
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null);
  const [tempRange, setTempRange] = useState<{ start: number; end: number } | null>(value);

  useEffect(() => {
    setTempRange(value);
  }, [value]);

  // 将小时转换为像素位置
  const hourToPosition = (hour: number) => {
    const totalHours = MAX_HOUR - MIN_HOUR;
    return ((hour - MIN_HOUR) / totalHours) * 100;
  };

  // 将像素位置转换为小时
  const positionToHour = (position: number, containerWidth: number) => {
    const totalHours = MAX_HOUR - MIN_HOUR;
    const hour = MIN_HOUR + (position / containerWidth) * totalHours;
    return Math.round(Math.max(MIN_HOUR, Math.min(MAX_HOUR, hour)));
  };

  const handleMouseDown = (type: 'start' | 'end') => {
    setIsDragging(type);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !tempRange) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const hour = positionToHour(x, rect.width);

    let newRange = { ...tempRange };

    if (isDragging === 'start') {
      // 确保开始时间不晚于结束时间 - MIN_DURATION
      newRange.start = Math.min(hour, tempRange.end - MIN_DURATION);
    } else {
      // 确保结束时间不早于开始时间 + MIN_DURATION
      newRange.end = Math.max(hour, tempRange.start + MIN_DURATION);
    }

    setTempRange(newRange);
  };

  const handleMouseUp = () => {
    if (isDragging && tempRange) {
      onChange(tempRange);
    }
    setIsDragging(false);
  };

  const handleQuickSelect = (start: number, end: number) => {
    const newRange = { start, end };
    setTempRange(newRange);
    onChange(newRange);
  };

  const formatTime = (hour: number) => {
    return `${hour}:00`;
  };

  const currentRange = tempRange || value || { start: 8, end: 11 };
  const duration = currentRange.end - currentRange.start;

  return (
    <div className="space-y-4">
      {/* Quick Options */}
      <div className="grid grid-cols-3 gap-3">
        {QUICK_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = 
            currentRange.start === option.start && 
            currentRange.end === option.end;
          
          return (
            <button
              key={option.label}
              onClick={() => handleQuickSelect(option.start, option.end)}
              className={`p-3 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center mx-auto mb-2`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-sm text-gray-700">{option.label}</div>
              <div className="text-xs text-gray-500 mt-1">
                {formatTime(option.start)}-{formatTime(option.end)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Time Range Selector */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-600" />
          <h4 className="text-gray-800">自定义时间段</h4>
        </div>

        {/* Time Labels */}
        <div className="relative mb-2">
          <div className="flex justify-between text-xs text-gray-500">
            {Array.from({ length: MAX_HOUR - MIN_HOUR + 1 }, (_, i) => MIN_HOUR + i).map((hour) => (
              <span key={hour} className="w-8 text-center">
                {hour % 2 === 0 ? hour : ''}
              </span>
            ))}
          </div>
        </div>

        {/* Time Range Slider */}
        <div
          className="relative h-12 bg-gray-200 rounded-lg cursor-pointer select-none"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Hour Markers */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: MAX_HOUR - MIN_HOUR }, (_, i) => (
              <div
                key={i}
                className="flex-1 border-r border-gray-300 last:border-r-0"
              />
            ))}
          </div>

          {/* Selected Range */}
          <div
            className="absolute top-0 bottom-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"
            style={{
              left: `${hourToPosition(currentRange.start)}%`,
              width: `${hourToPosition(currentRange.end) - hourToPosition(currentRange.start)}%`,
            }}
          />

          {/* Start Handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-blue-500 rounded-full cursor-grab active:cursor-grabbing shadow-lg z-10"
            style={{ left: `calc(${hourToPosition(currentRange.start)}% - 12px)` }}
            onMouseDown={(e) => {
              e.preventDefault();
              handleMouseDown('start');
            }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {formatTime(currentRange.start)}
            </div>
          </div>

          {/* End Handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-purple-500 rounded-full cursor-grab active:cursor-grabbing shadow-lg z-10"
            style={{ left: `calc(${hourToPosition(currentRange.end)}% - 12px)` }}
            onMouseDown={(e) => {
              e.preventDefault();
              handleMouseDown('end');
            }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {formatTime(currentRange.end)}
            </div>
          </div>
        </div>

        {/* Duration Info */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="text-gray-800">时长：</span>
            <span className="text-blue-600 font-medium">{duration} 小时</span>
          </div>
          <div className="text-xs text-gray-500">
            {duration < MIN_DURATION && (
              <span className="text-orange-600">⚠️ 最少需要{MIN_DURATION}小时</span>
            )}
          </div>
        </div>
      </div>

      {/* Selected Time Display */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700">已选时间：</span>
          </div>
          <div className="text-blue-600 font-medium">
            {formatTime(currentRange.start)} - {formatTime(currentRange.end)}
          </div>
        </div>
      </div>
    </div>
  );
}

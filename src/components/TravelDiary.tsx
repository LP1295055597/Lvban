import { useState, useRef } from 'react';
import { X, Plus, Trash2, MapPin, Utensils, Camera, Clock, Download, Share2 } from 'lucide-react';
import { getScenicNames, getFoodNames } from './CartoonIcons';
import { getItemImage, cartoonFilter } from '../data/scenicImages';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TravelDiaryProps {
  guideName: string;
  userName: string;
  isGuideView: boolean;
  onClose: () => void;
  onSend?: (diary: DiaryData) => void;
}

interface DiaryItem {
  id: number;
  time: string;
  type: 'scenic' | 'food';
  name: string;
  description: string;
}

interface DiaryData {
  title: string;
  date: string;
  items: DiaryItem[];
}

export function TravelDiary({ guideName, userName, isGuideView, onClose, onSend }: TravelDiaryProps) {
  const [diaryData, setDiaryData] = useState<DiaryData>({
    title: '丽江之旅',
    date: new Date().toISOString().split('T')[0],
    items: isGuideView ? [] : [
      {
        id: 1,
        time: '09:00',
        type: 'scenic',
        name: '丽江古城',
        description: '漫步古城，感受纳西族文化'
      },
      {
        id: 2,
        time: '12:00',
        type: 'food',
        name: '腊排骨火锅',
        description: '品尝地道的丽江美食'
      },
      {
        id: 3,
        time: '15:00',
        type: 'scenic',
        name: '玉龙雪山',
        description: '乘坐索道，近距离观赏雪山'
      }
    ]
  });

  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState<Partial<DiaryItem>>({
    type: 'scenic',
    name: '丽江古城'
  });
  const [showPreview, setShowPreview] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const scenicNames = getScenicNames();
  const foodNames = getFoodNames();

  const handleAddItem = () => {
    if (newItem.time && newItem.name && newItem.description) {
      const item: DiaryItem = {
        id: Date.now(),
        time: newItem.time,
        type: newItem.type as 'scenic' | 'food',
        name: newItem.name,
        description: newItem.description
      };
      setDiaryData({
        ...diaryData,
        items: [...diaryData.items, item].sort((a, b) => a.time.localeCompare(b.time))
      });
      setNewItem({ type: 'scenic', name: '丽江古城' });
      setShowAddItem(false);
    }
  };

  const handleDeleteItem = (id: number) => {
    setDiaryData({
      ...diaryData,
      items: diaryData.items.filter(item => item.id !== id)
    });
  };

  const handleSend = () => {
    if (onSend) {
      onSend(diaryData);
      onClose();
    }
  };

  const generateShareImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小
    canvas.width = 750;
    canvas.height = 1334;

    // 绘制背景渐变 - 卡通天空
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(0.5, '#B0E0E6');
    skyGradient.addColorStop(1, '#FFE4B5');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制卡通云朵
    const drawCloud = (x: number, y: number, size: number) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.arc(x + size * 0.8, y, size * 0.8, 0, Math.PI * 2);
      ctx.arc(x + size * 1.5, y, size, 0, Math.PI * 2);
      ctx.arc(x + size * 0.75, y - size * 0.5, size * 0.6, 0, Math.PI * 2);
      ctx.fill();
    };

    drawCloud(100, 80, 30);
    drawCloud(550, 120, 35);
    drawCloud(300, 1100, 40);
    drawCloud(600, 1150, 30);

    // 绘制太阳
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(650, 100, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // 太阳光芒
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const x1 = 650 + Math.cos(angle) * 50;
      const y1 = 100 + Math.sin(angle) * 50;
      const x2 = 650 + Math.cos(angle) * 70;
      const y2 = 100 + Math.sin(angle) * 70;
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // 标题卡片
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 5;
    
    // 圆角矩形函数
    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
    };

    roundRect(40, 180, 670, 150, 20);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // 标题
    ctx.fillStyle = '#2C3E50';
    ctx.font = 'bold 52px -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(diaryData.title, 375, 245);

    // 日期和信息
    ctx.font = '28px -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillStyle = '#7F8C8D';
    ctx.fillText(`${diaryData.date}`, 375, 290);
    
    ctx.font = '24px -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillText(`旅行管家：${guideName} ♡ 游客：${userName}`, 375, 315);

    // 绘制路线和行程
    let yPosition = 400;
    const leftMargin = 80;
    const iconSize = 80;
    const cardWidth = 600;

    diaryData.items.forEach((item, index) => {
      // 绘制连接线
      if (index < diaryData.items.length - 1) {
        ctx.strokeStyle = '#FFB6C1';
        ctx.lineWidth = 6;
        ctx.setLineDash([15, 10]);
        ctx.beginPath();
        ctx.moveTo(leftMargin + iconSize / 2, yPosition + iconSize);
        ctx.lineTo(leftMargin + iconSize / 2, yPosition + iconSize + 80);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 绘制行程卡片
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetY = 3;
      roundRect(leftMargin + iconSize + 20, yPosition, cardWidth - iconSize - 40, 100, 15);
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // 绘制图标背景圆
      const iconColor = item.type === 'scenic' ? '#4FC3F7' : '#FF7043';
      ctx.fillStyle = iconColor;
      ctx.beginPath();
      ctx.arc(leftMargin + iconSize / 2, yPosition + iconSize / 2, iconSize / 2, 0, Math.PI * 2);
      ctx.fill();

      // 绘制图标 (简化版)
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.type === 'scenic' ? '🏔️' : '🍜', leftMargin + iconSize / 2, yPosition + iconSize / 2 + 8);

      // 绘制时间
      ctx.fillStyle = '#95A5A6';
      ctx.font = '24px -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`⏰ ${item.time}`, leftMargin + iconSize + 40, yPosition + 35);

      // 绘制地点名称
      ctx.fillStyle = '#2C3E50';
      ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';
      ctx.fillText(item.name, leftMargin + iconSize + 40, yPosition + 70);

      // 绘制描述
      ctx.fillStyle = '#7F8C8D';
      ctx.font = '22px -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';
      const maxWidth = cardWidth - iconSize - 80;
      const description = item.description.length > 20 ? item.description.substring(0, 20) + '...' : item.description;
      ctx.fillText(description, leftMargin + iconSize + 40, yPosition + 95);

      // 绘制类型标签
      const tagText = item.type === 'scenic' ? '景点' : '美食';
      const tagColor = item.type === 'scenic' ? '#E3F2FD' : '#FFE0B2';
      const tagTextColor = item.type === 'scenic' ? '#1976D2' : '#E65100';
      
      ctx.fillStyle = tagColor;
      roundRect(leftMargin + iconSize + cardWidth - 100, yPosition + 10, 70, 30, 15);
      
      ctx.fillStyle = tagTextColor;
      ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(tagText, leftMargin + iconSize + cardWidth - 65, yPosition + 30);

      // 序号标签
      ctx.fillStyle = iconColor;
      ctx.beginPath();
      ctx.arc(leftMargin + 15, yPosition + 15, 18, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText((index + 1).toString(), leftMargin + 15, yPosition + 22);

      yPosition += 180;
    });

    // 底部品牌区域
    const bottomY = canvas.height - 130;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = -5;
    roundRect(40, bottomY, 670, 90, 20);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Logo图标
    ctx.fillStyle = '#FF6B9D';
    ctx.beginPath();
    ctx.arc(100, bottomY + 45, 25, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('旅', 100, bottomY + 53);

    // 品牌名称
    ctx.fillStyle = '#2C3E50';
    ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('旅伴', 140, bottomY + 40);

    ctx.font = '20px -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillStyle = '#95A5A6';
    ctx.fillText('让每一次旅行都有温度 ♡', 140, bottomY + 68);

    // 二维码区域
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 3;
    ctx.strokeRect(590, bottomY + 15, 60, 60);
    
    ctx.fillStyle = '#BDBDBD';
    ctx.font = '16px -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('扫码', 620, bottomY + 50);
    ctx.fillText('下载', 620, bottomY + 68);

    setShowPreview(true);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${diaryData.title}-${diaryData.date}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <h2 className="text-gray-800">旅行日记</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
            <input
              type="text"
              value={diaryData.title}
              onChange={(e) => setDiaryData({ ...diaryData, title: e.target.value })}
              disabled={!isGuideView}
              className="w-full bg-transparent text-xl text-gray-800 border-none focus:outline-none mb-2 placeholder-gray-400"
              placeholder="旅行标题"
            />
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <input
                  type="date"
                  value={diaryData.date}
                  onChange={(e) => setDiaryData({ ...diaryData, date: e.target.value })}
                  disabled={!isGuideView}
                  className="bg-transparent border-none focus:outline-none"
                />
              </div>
              <span>·</span>
              <span>旅行管家：{guideName}</span>
              <span>·</span>
              <span>游客：{userName}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-800">行程安排</h3>
              {isGuideView && (
                <button
                  onClick={() => setShowAddItem(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  添加行程
                </button>
              )}
            </div>

            {diaryData.items.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                暂无行程安排
              </div>
            ) : (
              <div className="relative pl-8">
                {/* Timeline Line */}
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-purple-300 to-pink-300" />

                {/* Timeline Items */}
                <div className="space-y-6">
                  {diaryData.items.map((item, index) => (
                    <div key={item.id} className="relative">
                      {/* Timeline Dot with Number */}
                      <div className={`absolute -left-8 top-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                        item.type === 'scenic' ? 'bg-blue-500' : 'bg-orange-500'
                      }`}>
                        {index + 1}
                      </div>

                      {/* Item Card */}
                      <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden hover:shadow-lg transition-all hover:border-blue-200">
                        <div className="flex">
                          {/* Icon Section - Real Image */}
                          <div className={`w-24 flex-shrink-0 overflow-hidden ${
                            item.type === 'scenic' ? 'bg-gradient-to-br from-blue-100 to-blue-50' : 'bg-gradient-to-br from-orange-100 to-orange-50'
                          }`}>
                            <ImageWithFallback 
                              src={getItemImage(item.name)} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                              style={{ filter: cartoonFilter }}
                            />
                          </div>

                          {/* Content Section */}
                          <div className="flex-1 p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-500">{item.time}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                                    item.type === 'scenic'
                                      ? 'bg-blue-100 text-blue-600'
                                      : 'bg-orange-100 text-orange-600'
                                  }`}>
                                    {item.type === 'scenic' ? '景点' : '美食'}
                                  </span>
                                </div>
                                <h4 className="text-gray-800 mb-1">{item.name}</h4>
                                <p className="text-gray-600 text-sm">{item.description}</p>
                              </div>
                              {isGuideView && (
                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="p-2 hover:bg-red-50 rounded-lg transition-colors ml-2"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {isGuideView ? (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSend}
                  disabled={diaryData.items.length === 0}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  发送给游客
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={generateShareImage}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  生成分享图
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  关闭
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-gray-800">添加行程项目</h3>
            
            <div>
              <label className="text-gray-700 text-sm mb-2 block">类型</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setNewItem({ ...newItem, type: 'scenic', name: scenicNames[0] })}
                  className={`py-2 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                    newItem.type === 'scenic'
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  景点
                </button>
                <button
                  onClick={() => setNewItem({ ...newItem, type: 'food', name: foodNames[0] })}
                  className={`py-2 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                    newItem.type === 'food'
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  美食
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-700 text-sm mb-2 block">选择地点</label>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2">
                {(newItem.type === 'scenic' ? scenicNames : foodNames).map((name) => (
                  <button
                    key={name}
                    onClick={() => setNewItem({ ...newItem, name })}
                    className={`p-2 rounded-lg border-2 transition-all overflow-hidden ${
                      newItem.name === name
                        ? newItem.type === 'scenic'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-full aspect-square rounded-lg overflow-hidden bg-white">
                        <ImageWithFallback 
                          src={getItemImage(name)} 
                          alt={name}
                          className="w-full h-full object-cover"
                          style={{ filter: cartoonFilter }}
                        />
                      </div>
                      <span className="text-xs text-center text-gray-800">{name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-gray-700 text-sm mb-2 block">时间</label>
              <input
                type="time"
                value={newItem.time || ''}
                onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm mb-2 block">描述</label>
              <textarea
                value={newItem.description || ''}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="简单描述这个行程..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddItem(false)}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddItem}
                disabled={!newItem.time || !newItem.description}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-4">
            <canvas
              ref={canvasRef}
              className="w-full rounded-2xl shadow-2xl"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 bg-white/10 backdrop-blur text-white py-3 rounded-xl hover:bg-white/20 transition-colors"
              >
                关闭
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                下载图片
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Canvas */}
      {!showPreview && <canvas ref={canvasRef} className="hidden" />}
    </div>
  );
}
import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SendMessageDialogProps {
  userName: string;
  userAvatar: string;
  userType: 'mate' | 'guide';
  onClose: () => void;
  onSend: (message: string) => void;
}

export function SendMessageDialog({ userName, userAvatar, userType, onClose, onSend }: SendMessageDialogProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-3">
            <ImageWithFallback
              src={userAvatar}
              alt={userName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="text-gray-800">{userName}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                userType === 'guide' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-purple-100 text-purple-600'
              }`}>
                {userType === 'guide' ? '旅行管家' : '搭子'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-gray-700 mb-2 block">
              发送消息给 {userName}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="输入您想说的话..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={6}
              autoFocus
            />
          </div>

          {/* Quick Messages */}
          <div>
            <p className="text-gray-600 text-sm mb-2">快捷消息</p>
            <div className="space-y-2">
              <button
                onClick={() => setMessage('你好，我对你的行程很感兴趣，可以一起吗？')}
                className="w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700"
              >
                你好，我对你的行程很感兴趣，可以一起吗？
              </button>
              <button
                onClick={() => setMessage('方便聊一下具体的行程安排吗？')}
                className="w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700"
              >
                方便聊一下具体的行程安排吗？
              </button>
              <button
                onClick={() => setMessage('我也想去这个地方，可以详细说说吗？')}
                className="w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700"
              >
                我也想去这个地方，可以详细说说吗？
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              发送消息
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

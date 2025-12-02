import { useState, useRef, useEffect } from 'react';
import { X, Send, Smile, BookOpen } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { TravelDiary } from './TravelDiary';
import { DiaryImagePreview } from './DiaryImagePreview';

interface ChatDialogProps {
  guideName: string;
  guideAvatar: string;
  onClose: () => void;
  hasActiveOrder?: boolean;
  isGuideView?: boolean;
  userName?: string;
}

interface Message {
  id: number;
  sender: 'user' | 'guide';
  content: string;
  timestamp: Date;
  type?: 'text' | 'diary';
  diaryData?: any;
}

const emojis = ['😀', '😃', '😄', '😁', '😊', '😍', '🥰', '😘', '👍', '👏', '🙏', '❤️', '🎉', '✨', '🌟', '💯', '🔥', '👌', '💪', '🤝'];

export function ChatDialog({ guideName, guideAvatar, onClose, hasActiveOrder = false, isGuideView = false, userName = '游客' }: ChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: isGuideView ? 'user' : 'guide',
      content: isGuideView 
        ? `你好！我是${userName}，期待您的服务！`
        : `你好！我是${guideName}，很高兴为您服务。请问有什么可以帮助您的吗？`,
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showDiary, setShowDiary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: isGuideView ? 'guide' : 'user',
        content: inputText,
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      setShowEmoji(false);

      // 模拟对方回复
      setTimeout(() => {
        const autoReply: Message = {
          id: messages.length + 2,
          sender: isGuideView ? 'user' : 'guide',
          content: '收到您的消息了！我会尽快为您安排行程 😊',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, autoReply]);
      }, 1000);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  const handleDiarySend = (diary: any) => {
    const diaryMessage: Message = {
      id: messages.length + 1,
      sender: 'guide',
      content: `📖 我为您准备了一份旅行日记：《${diary.title}》，请查收！`,
      timestamp: new Date(),
      type: 'diary',
      diaryData: diary
    };
    setMessages([...messages, diaryMessage]);
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <ImageWithFallback
              src={isGuideView 
                ? "https://images.unsplash.com/photo-1535208632259-841d129a6af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdHJhdmVsfGVufDF8fHx8MTc2NDU5ODc5OXww&ixlib=rb-4.1.0&q=80&w=1080"
                : guideAvatar
              }
              alt={isGuideView ? userName : guideName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="text-gray-800">{isGuideView ? userName : guideName}</h3>
              <p className="text-green-500 text-xs">在线</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveOrder && isGuideView && (
              <button
                onClick={() => setShowDiary(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">旅行日记</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                (isGuideView && message.sender === 'guide') || (!isGuideView && message.sender === 'user')
                  ? 'justify-end' 
                  : 'justify-start'
              }`}
            >
              <div className={`flex gap-2 max-w-[70%] ${
                (isGuideView && message.sender === 'guide') || (!isGuideView && message.sender === 'user')
                  ? 'flex-row-reverse' 
                  : 'flex-row'
              }`}>
                {((isGuideView && message.sender === 'user') || (!isGuideView && message.sender === 'guide')) && (
                  <ImageWithFallback
                    src={isGuideView 
                      ? "https://images.unsplash.com/photo-1535208632259-841d129a6af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdHJhdmVsfGVufDF8fHx8MTc2NDU5ODc5OXww&ixlib=rb-4.1.0&q=80&w=1080"
                      : guideAvatar
                    }
                    alt={isGuideView ? userName : guideName}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                )}
                <div>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      (isGuideView && message.sender === 'guide') || (!isGuideView && message.sender === 'user')
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.type === 'diary' ? (
                      <div className="flex flex-col">
                        <p className="text-sm mb-2">{message.content}</p>
                        <DiaryImagePreview 
                          diaryData={message.diaryData}
                          guideName={guideName}
                          userName={userName}
                        />
                      </div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Emoji Picker */}
        {showEmoji && (
          <div className="border-t border-gray-200 p-4">
            <div className="grid grid-cols-10 gap-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiClick(emoji)}
                  className="text-2xl hover:bg-gray-100 rounded p-2 transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEmoji(!showEmoji)}
              className={`p-2 rounded-full transition-colors ${
                showEmoji ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Smile className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入消息..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Travel Diary Modal */}
      {showDiary && (
        <TravelDiary
          guideName={guideName}
          userName={userName}
          isGuideView={true}
          onClose={() => setShowDiary(false)}
          onSend={handleDiarySend}
        />
      )}
    </div>
  );
}
import { useState } from 'react';
import { X, Image, Video, FileText, MapPin, Tag, Upload } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PublishContentProps {
  onClose: () => void;
  onPublish: (content: any) => void;
}

export function PublishContent({ onClose, onPublish }: PublishContentProps) {
  const [contentType, setContentType] = useState<'video' | 'guide'>('video');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const popularTags = [
    '丽江古城', '玉龙雪山', '泸沽湖', '束河古镇',
    '美食探店', '旅行攻略', 'Vlog', '摄影',
    '纳西文化', '打卡点', '避坑指南', '住宿推荐'
  ];

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileUpload = () => {
    // Simulate file upload
    const mockFile = 'https://images.unsplash.com/photo-1637872937209-e1a5ccdc90cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWppYW5nJTIwb2xkJTIwdG93bnxlbnwxfHx8fDE3NjQ1NTIzODB8MA&ixlib=rb-4.1.0&q=80&w=1080';
    setUploadedFiles([...uploadedFiles, mockFile]);
  };

  const handlePublish = () => {
    if (!title || !description) {
      alert('请填写标题和内容');
      return;
    }

    const content = {
      type: contentType,
      title,
      description,
      location,
      tags,
      files: uploadedFiles,
      timestamp: new Date()
    };

    onPublish(content);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-gray-800">发布内容</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content Type Selector */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setContentType('video')}
              className={`flex-1 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${
                contentType === 'video'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Video className="w-5 h-5" />
              发布短视频
            </button>
            <button
              onClick={() => setContentType('guide')}
              className={`flex-1 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${
                contentType === 'guide'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FileText className="w-5 h-5" />
              发布攻略
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              {contentType === 'video' ? (
                <Video className="w-8 h-8 text-blue-600" />
              ) : (
                <Image className="w-8 h-8 text-orange-600" />
              )}
            </div>
            <button
              onClick={handleFileUpload}
              className="text-blue-600 hover:underline mb-2"
            >
              点击上传{contentType === 'video' ? '视频' : '图片'}
            </button>
            <p className="text-gray-500 text-sm">
              {contentType === 'video'
                ? '支持 MP4、MOV 格式，最大 500MB'
                : '支持 JPG、PNG 格式，最大 10MB'
              }
            </p>
          </div>

          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={file}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-gray-700 mb-2">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={contentType === 'video' ? '给你的视频起个标题吧...' : '给你的攻略起个标题吧...'}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={50}
            />
            <div className="text-right text-gray-500 text-xs mt-1">
              {title.length}/50
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 mb-2">
              {contentType === 'video' ? '视频描述' : '攻略内容'} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={contentType === 'video' ? '分享你的旅行故事...' : '分享你的旅行经验和建议...'}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={6}
              maxLength={500}
            />
            <div className="text-right text-gray-500 text-xs mt-1">
              {description.length}/500
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline-block mr-1" />
              位置
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="添加位置信息"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline-block mr-1" />
              标签 (最多5个)
            </label>
            
            {/* Selected Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm flex items-center gap-1"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Tag Input */}
            {tags.length < 5 && (
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag(tagInput);
                  }
                }}
                placeholder="输入标签后按回车添加"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
            )}

            {/* Popular Tags */}
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => handleAddTag(tag)}
                  disabled={tags.includes(tag) || tags.length >= 5}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    tags.includes(tag)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handlePublish}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            <Upload className="w-5 h-5 inline-block mr-2" />
            发布
          </button>
        </div>
      </div>
    </div>
  );
}

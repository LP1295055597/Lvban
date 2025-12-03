import { useState } from 'react';
import { X, Upload, Camera, Video, Plus, Check, Trash2, Award } from 'lucide-react';

interface GuideProfileEditProps {
  onClose: () => void;
  onSave: (data: GuideProfileData) => void;
  initialData?: GuideProfileData;
  userRole?: 'tourist' | 'guide';
}

export interface GuideProfileData {
  mediaFiles: MediaFile[];
  selectedSkills: string[];
  introduction: string;
}

interface MediaFile {
  id: string;
  type: 'image' | 'video';
  url: string;
  file?: File;
}

// 技能卡片选项 - 旅行管家
const GUIDE_SKILL_OPTIONS = [
  { id: 'photography', label: '摄影师', icon: '📷', description: '专业拍照技术' },
  { id: 'hiking', label: '徒步向导', icon: '🥾', description: '擅长户外徒步' },
  { id: 'food', label: '美食达人', icon: '🍜', description: '了解当地美食' },
  { id: 'history', label: '历史讲解', icon: '📚', description: '熟悉历史文化' },
  { id: 'language', label: '多语言', icon: '🌍', description: '掌握多种语言' },
  { id: 'driver', label: '专业司机', icon: '🚗', description: '安全驾驶经验' },
  { id: 'outdoor', label: '户外运动', icon: '⛰️', description: '户外活动专家' },
  { id: 'local', label: '本地通', icon: '🏠', description: '熟悉本地情况' },
];

// 兴趣标签选项 - 游客
const TOURIST_INTEREST_OPTIONS = [
  { id: 'photography', label: '摄影爱好', icon: '📷', description: '喜欢拍照记录' },
  { id: 'hiking', label: '徒步旅行', icon: '🥾', description: '热爱户外徒步' },
  { id: 'food', label: '美食探索', icon: '🍜', description: '喜欢品尝美食' },
  { id: 'history', label: '人文历史', icon: '📚', description: '对历史文化感兴趣' },
  { id: 'shopping', label: '购物达人', icon: '🛍️', description: '喜欢逛街购物' },
  { id: 'adventure', label: '冒险挑战', icon: '🎯', description: '勇于尝试新事物' },
  { id: 'relaxation', label: '休闲放松', icon: '☕', description: '享受慢节奏旅行' },
  { id: 'social', label: '社交达人', icon: '👥', description: '喜欢结交朋友' },
];

export function GuideProfileEdit({ onClose, onSave, initialData, userRole = 'guide' }: GuideProfileEditProps) {
  const isTourist = userRole === 'tourist';
  const skillOptions = isTourist ? TOURIST_INTEREST_OPTIONS : GUIDE_SKILL_OPTIONS;

  const [currentTab, setCurrentTab] = useState<'media' | 'skills' | 'intro'>('media');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(initialData?.mediaFiles || []);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialData?.selectedSkills || ['photography', 'food', 'local']);
  const [introduction, setIntroduction] = useState(initialData?.introduction || '大家好！我是本地人阿秀，从事旅行管家服务已有5年时间，接待过来自全国各地的3000+游客。我熟悉丽江的每一条街道，了解最地道的纳西美食，会说流利的英语。擅长摄影，可以帮您记录旅途中的美好瞬间。我会用心为每一位游客提供贴心、专业的服务，让您的丽江之旅留下美好回忆！');

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: MediaFile[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      type,
      url: URL.createObjectURL(file),
      file,
    }));

    setMediaFiles([...mediaFiles, ...newFiles]);
  };

  const handleRemoveMedia = (id: string) => {
    setMediaFiles(mediaFiles.filter((file) => file.id !== id));
  };

  const handleSkillToggle = (skillId: string) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter((id) => id !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  const handleSave = () => {
    if (mediaFiles.length === 0) {
      alert('请至少上传一张照片或视频');
      return;
    }
    if (selectedSkills.length === 0) {
      alert('请至少选择一项技能');
      return;
    }
    if (introduction.trim().length < 20) {
      alert('自我介绍至少需要20个字');
      return;
    }

    onSave({
      mediaFiles,
      selectedSkills,
      introduction,
    });
    alert('个人资料已更新！');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-gray-800">编辑个人资料</h2>
            <p className="text-gray-500 text-sm mt-1">更新您的照片、技能和介绍</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setCurrentTab('media')}
            className={`flex-1 py-3 text-sm transition-colors ${
              currentTab === 'media'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📸 照片/视频
          </button>
          <button
            onClick={() => setCurrentTab('skills')}
            className={`flex-1 py-3 text-sm transition-colors ${
              currentTab === 'skills'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {isTourist ? '❤️ 旅行兴趣' : '⭐ 技能选择'}
          </button>
          <button
            onClick={() => setCurrentTab('intro')}
            className={`flex-1 py-3 text-sm transition-colors ${
              currentTab === 'intro'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            ✍️ 自我介绍
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Media Tab */}
          {currentTab === 'media' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-gray-800">照片和视频</h3>
                  <p className="text-gray-500 text-sm">
                    {isTourist ? '展示您的旅行经历和风采' : '展示您的形象和服务特色'}
                  </p>
                </div>
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-3 gap-3">
                {mediaFiles.map((file) => (
                  <div key={file.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                    {file.type === 'image' ? (
                      <img src={file.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <video src={file.url} className="w-full h-full object-cover" />
                    )}
                    <button
                      onClick={() => handleRemoveMedia(file.id)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                    {file.type === 'video' && (
                      <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        <Video className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Upload Photo Button */}
                {mediaFiles.length < 9 && (
                  <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-gray-500 text-xs">上传照片</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleMediaUpload(e, 'image')}
                      className="hidden"
                    />
                  </label>
                )}

                {/* Upload Video Button */}
                {mediaFiles.length < 9 && (
                  <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors">
                    <Video className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-gray-500 text-xs">上传视频</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleMediaUpload(e, 'video')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="text-center text-sm text-gray-500 mt-4">
                已上传 {mediaFiles.length} / 9
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="text-blue-800 text-sm">
                  <p className="mb-1">💡 上传建议：</p>
                  {isTourist ? (
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>上传您的旅行照片，展示旅行经历和个人风格</li>
                      <li>可上传旅行视频（不超过30秒），分享旅途精彩瞬间</li>
                      <li>照片清晰自然，展现真实的自己</li>
                      <li>最多上传9张照片/视频</li>
                    </ul>
                  ) : (
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>至少上传3张照片，展示您的形象和服务场景</li>
                      <li>可上传1-2个短视频（不超过30秒），介绍您的服务</li>
                      <li>照片清晰、光线充足，展现专业形象</li>
                      <li>最多上传9张照片/视频</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {currentTab === 'skills' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-gray-800">{isTourist ? '选择您的旅行兴趣' : '选择您的技能'}</h3>
                  <p className="text-gray-500 text-sm">
                    {isTourist ? '帮助找到志同道合的旅伴' : '帮助游客了解您的专长'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {skillOptions.map((skill) => {
                  const isSelected = selectedSkills.includes(skill.id);
                  return (
                    <button
                      key={skill.id}
                      onClick={() => handleSkillToggle(skill.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-2xl">{skill.icon}</span>
                        {isSelected && (
                          <Check className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <h4 className="text-gray-800 mb-1">{skill.label}</h4>
                      <p className="text-gray-500 text-xs">{skill.description}</p>
                    </button>
                  );
                })}
              </div>

              <div className="text-center text-sm text-gray-500 mt-4">
                已选择 {selectedSkills.length} 项{isTourist ? '兴趣' : '技能'}
              </div>
            </div>
          )}

          {/* Introduction Tab */}
          {currentTab === 'intro' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center">
                  <span className="text-lg">✍️</span>
                </div>
                <div>
                  <h3 className="text-gray-800">自我介绍</h3>
                  <p className="text-gray-500 text-sm">
                    {isTourist ? '让其他旅行者更了解您' : '让游客更了解您'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-gray-700 text-sm mb-2 block">
                  介绍文字 <span className="text-red-500">*</span>
                  <span className="text-gray-500 ml-2">（至少20字）</span>
                </label>
                <textarea
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  placeholder={
                    isTourist
                      ? '请介绍您的旅行经历、喜好、性格特点等，让其他旅行者更了解您...'
                      : '请介绍您的经验、擅长的服务、个人特色等，让游客更了解您...'
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={10}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {isTourist
                      ? '建议150-300字，真诚的介绍更容易找到合拍的旅伴'
                      : '建议150-300字，内容真实、详细更容易获得游客信任'}
                  </span>
                  <span className={`text-sm ${
                    introduction.length >= 20 ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {introduction.length} / 300
                  </span>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="text-green-800 text-sm">
                  <p className="mb-1">💡 优质介绍示例：</p>
                  {isTourist ? (
                    <p className="text-xs italic text-green-700 bg-white rounded p-2 mt-2">
                      "大家好！我是来自上海的小美，90后自由职业者，热爱旅行和摄影。去过20多个国家和地区，喜欢深度游而非走马观花。性格开朗随和，喜欢尝试各种当地美食，也热衷于徒步和户外运动。希望在旅途中结识志同道合的朋友，一起分享旅行的快乐和感悟。期待与你相遇！"
                    </p>
                  ) : (
                    <p className="text-xs italic text-green-700 bg-white rounded p-2 mt-2">
                      "你好！我是丽江本地人，从事旅行管家服务已有5年时间，接待过来自全国各地的3000+游客。我熟悉丽江的每一条街道，了解最地道的纳西美食，会说流利的英语和日语。擅长摄影，可以帮您记录旅途中的美好瞬间。提供7座商务车服务，可接送机场/火车站。我会用心为每一位游客提供贴心、专业的服务，让您的丽江之旅留下美好回忆！"
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              保存修改
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { X, Upload, Camera, Video, Plus, Check, Car, DollarSign, AlertCircle, User, Award, FileText, Image as ImageIcon, Trash2 } from 'lucide-react';

interface GuideRegistrationProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface MediaFile {
  id: string;
  type: 'image' | 'video';
  url: string;
  file?: File;
}

// 技能卡片选项
const SKILL_OPTIONS = [
  { id: 'photography', label: '摄影师', icon: '📷', description: '专业拍照技术' },
  { id: 'hiking', label: '徒步向导', icon: '🥾', description: '擅长户外徒步' },
  { id: 'food', label: '美食达人', icon: '🍜', description: '了解当地美食' },
  { id: 'history', label: '历史讲解', icon: '📚', description: '熟悉历史文化' },
  { id: 'language', label: '多语言', icon: '🌍', description: '掌握多种语言' },
  { id: 'driver', label: '专业司机', icon: '🚗', description: '安全驾驶经验' },
  { id: 'outdoor', label: '户外运动', icon: '⛰️', description: '户外活动专家' },
  { id: 'local', label: '本地通', icon: '🏠', description: '熟悉本地情况' },
];

const MIN_HOURLY_RATE = 30;
const MAX_HOURLY_RATE = 200;
const PLATFORM_COMMISSION = 0.2; // 20%

export function GuideRegistration({ onClose, onSuccess }: GuideRegistrationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [hasVehicle, setHasVehicle] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState({
    type: '',
    model: '',
    plateNumber: '',
    seats: '',
  });
  const [introduction, setIntroduction] = useState('');
  const [hourlyRate, setHourlyRate] = useState(100);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    realName: '',
    phone: '',
    city: '丽江',
    emergencyContact: '',
    emergencyPhone: '',
  });

  // 身份证照片
  const [idCardPhotos, setIdCardPhotos] = useState({
    front: null as string | null,
    back: null as string | null,
  });

  // 驾照照片
  const [driverLicensePhoto, setDriverLicensePhoto] = useState<string | null>(null);

  // 车辆品牌名称
  const [vehicleBrand, setVehicleBrand] = useState('');

  // 车辆价格（按天计价）
  const [vehiclePrice, setVehiclePrice] = useState(200);

  // 计算实际收入
  const actualEarnings = hourlyRate * (1 - PLATFORM_COMMISSION);
  const platformFee = hourlyRate * PLATFORM_COMMISSION;

  // 处理身份证照片上传
  const handleIdCardUpload = (event: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setIdCardPhotos({ ...idCardPhotos, [side]: url });
  };

  // 处理驾照照片上传
  const handleDriverLicenseUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setDriverLicensePhoto(url);
  };

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

  const handleHourlyRateChange = (value: number) => {
    const rate = Math.max(MIN_HOURLY_RATE, Math.min(MAX_HOURLY_RATE, value));
    setHourlyRate(rate);
  };

  const handleSubmit = () => {
    // 验证必填项
    if (!idCardPhotos.front || !idCardPhotos.back) {
      alert('请上传身份证正反面照片');
      return;
    }
    if (mediaFiles.length === 0) {
      alert('请至少上传一张照片或视频');
      return;
    }
    if (selectedSkills.length === 0) {
      alert('请至少选择一项技能');
      return;
    }
    if (hasVehicle && (!vehicleBrand || !driverLicensePhoto)) {
      alert('提供车辆服务需要填写车辆品牌并上传驾照');
      return;
    }
    if (!introduction.trim()) {
      alert('请填写自我介绍');
      return;
    }
    if (!personalInfo.realName || !personalInfo.phone) {
      alert('请完善个人信息');
      return;
    }
    if (!hasScrolledToBottom) {
      alert('请滚动至协议底部并同意服务条款');
      return;
    }

    // 这里应该调用API提交数据
    alert('提交成功！我们将在1-3个工作日内完成审核，请耐心等待。');
    onSuccess();
    onClose();
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return personalInfo.realName && personalInfo.phone && personalInfo.emergencyContact && personalInfo.emergencyPhone && idCardPhotos.front && idCardPhotos.back;
      case 2:
        return mediaFiles.length > 0;
      case 3:
        if (hasVehicle) {
          return selectedSkills.length > 0 && vehicleBrand && driverLicensePhoto;
        }
        return selectedSkills.length > 0;
      case 4:
        return introduction.trim().length >= 20;
      default:
        return true;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-gray-800">旅行管家入驻认证</h2>
            <p className="text-gray-500 text-sm mt-1">成为认证旅行管家，开启收入之旅</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                    step < currentStep
                      ? 'bg-green-500 text-white'
                      : step === currentStep
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step < currentStep ? <Check className="w-4 h-4" /> : step}
                </div>
                {step < 5 && (
                  <div
                    className={`w-8 h-1 mx-1 transition-colors ${
                      step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-600">个人信息</span>
            <span className="text-xs text-gray-600">照片/视频</span>
            <span className="text-xs text-gray-600">技能选择</span>
            <span className="text-xs text-gray-600">自我介绍</span>
            <span className="text-xs text-gray-600">价格配置</span>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-gray-800">个人信息</h3>
                  <p className="text-gray-500 text-sm">请填写真实信息以便审核</p>
                </div>
              </div>

              <div>
                <label className="text-gray-700 text-sm mb-2 block">
                  真实姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={personalInfo.realName}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, realName: e.target.value })
                  }
                  placeholder="请输入真实姓名"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 身份证照片上传 */}
              <div>
                <label className="text-gray-700 text-sm mb-2 block">
                  上传身份证 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* 身份证正面 */}
                  <div>
                    <label className="block aspect-[3/2] border-2 border-dashed border-gray-300 rounded-xl overflow-hidden cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                      {idCardPhotos.front ? (
                        <div className="relative w-full h-full">
                          <img src={idCardPhotos.front} alt="身份证正面" className="w-full h-full object-cover" />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setIdCardPhotos({ ...idCardPhotos, front: null });
                            }}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <Trash2 className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-gray-500 text-xs">身份证正面</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleIdCardUpload(e, 'front')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* 身份证反面 */}
                  <div>
                    <label className="block aspect-[3/2] border-2 border-dashed border-gray-300 rounded-xl overflow-hidden cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                      {idCardPhotos.back ? (
                        <div className="relative w-full h-full">
                          <img src={idCardPhotos.back} alt="身份证反面" className="w-full h-full object-cover" />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setIdCardPhotos({ ...idCardPhotos, back: null });
                            }}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <Trash2 className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-gray-500 text-xs">身份证反面</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleIdCardUpload(e, 'back')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-gray-700 text-sm mb-2 block">
                  手机号码 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, phone: e.target.value })
                  }
                  placeholder="请输入手机号码"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm mb-2 block">所在城市</label>
                <select
                  value={personalInfo.city}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, city: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="丽江">丽江</option>
                  <option value="昆明">昆明</option>
                  <option value="大理">大理</option>
                  <option value="香格里拉">香格里拉</option>
                </select>
              </div>

              {/* 紧急联系人信息 */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                <h4 className="text-gray-800 mb-3 flex items-center gap-2">
                  <span>🆘</span>
                  <span>紧急联系人</span>
                  <span className="text-red-500">*</span>
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-700 text-sm mb-2 block">
                      联系人姓名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={personalInfo.emergencyContact}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, emergencyContact: e.target.value })
                      }
                      placeholder="请输入紧急联系人姓名"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 text-sm mb-2 block">
                      联系人话 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={personalInfo.emergencyPhone}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, emergencyPhone: e.target.value })
                      }
                      placeholder="请输入紧急联系人电话"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    💡 紧急联系人用于突发情况联系，请填写可随时联系的亲友信息
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-yellow-800 text-sm">
                    <p className="mb-1">隐私保护说明：</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>您的身份证照片仅用于实名认证</li>
                      <li>平台将严格保护您的隐私信息</li>
                      <li>信息仅在必要审核时使用</li>
                      <li>照片需清晰完整，确保信息可读</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Media Upload */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-gray-800">上传照片或视频</h3>
                  <p className="text-gray-500 text-sm">展示您的形象和服务特色</p>
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

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-blue-800 text-sm">
                    <p className="mb-1">上传建议：</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>至少上传3张照片，展示您的形象和服务场景</li>
                      <li>可上传1-2个短视频（不超过30秒），介绍您的服务</li>
                      <li>照片清晰、光线充足，展现专业形象</li>
                      <li>最多上传9张照片/视频</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500">
                已上传 {mediaFiles.length} / 9
              </div>
            </div>
          )}

          {/* Step 3: Skills Selection */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-gray-800">选择您的技能</h3>
                  <p className="text-gray-500 text-sm">帮助游客了解您的专长</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {SKILL_OPTIONS.map((skill) => {
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

              <div className="text-center text-sm text-gray-500">
                已选择 {selectedSkills.length} 项技能
              </div>

              {/* Vehicle Option */}
              <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-gray-600" />
                    <h4 className="text-gray-800">是否有车</h4>
                  </div>
                  <button
                    onClick={() => setHasVehicle(!hasVehicle)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      hasVehicle ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        hasVehicle ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {hasVehicle && (
                  <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                    {/* 车辆品牌名称 */}
                    <div>
                      <label className="text-gray-700 text-sm mb-2 block">
                        车辆品牌名称 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={vehicleBrand}
                        onChange={(e) => setVehicleBrand(e.target.value)}
                        placeholder="例如：别克GL8"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>

                    {/* 车辆价格（按天） */}
                    <div>
                      <label className="text-gray-700 text-sm mb-2 block">
                        车辆价格（按天计价） <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={vehiclePrice}
                          onChange={(e) => setVehiclePrice(Math.max(0, Number(e.target.value)))}
                          placeholder="例如：200"
                          className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">元/天</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">💡 无论游客预约几小时，车辆费用均按一天收取</p>
                    </div>

                    {/* 上传驾照 */}
                    <div>
                      <label className="text-gray-700 text-sm mb-2 block">
                        上传驾照 <span className="text-red-500">*</span>
                      </label>
                      <label className="block aspect-[3/2] border-2 border-dashed border-gray-300 rounded-xl overflow-hidden cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                        {driverLicensePhoto ? (
                          <div className="relative w-full h-full">
                            <img src={driverLicensePhoto} alt="驾照" className="w-full h-full object-cover" />
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setDriverLicensePhoto(null);
                              }}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600"
                            >
                              <Trash2 className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-gray-500 text-xs">上传驾驶证</span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleDriverLicenseUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-700 text-sm mb-2 block">车辆类型</label>
                        <select
                          value={vehicleInfo.type}
                          onChange={(e) =>
                            setVehicleInfo({ ...vehicleInfo, type: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="">请选择</option>
                          <option value="轿车">轿车</option>
                          <option value="SUV">SUV</option>
                          <option value="商务车">商务车</option>
                          <option value="面包车">面包车</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-gray-700 text-sm mb-2 block">座位数</label>
                        <select
                          value={vehicleInfo.seats}
                          onChange={(e) =>
                            setVehicleInfo({ ...vehicleInfo, seats: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="">请选择</option>
                          <option value="5座">5座</option>
                          <option value="7座">7座</option>
                          <option value="9座">9座</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-700 text-sm mb-2 block">车牌号码</label>
                      <input
                        type="text"
                        value={vehicleInfo.plateNumber}
                        onChange={(e) =>
                          setVehicleInfo({ ...vehicleInfo, plateNumber: e.target.value })
                        }
                        placeholder="例如：云A12345"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Introduction */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-gray-800">自我介绍</h3>
                  <p className="text-gray-500 text-sm">让游客更了解您</p>
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
                  placeholder="请介绍您的经验、擅长的服务、个人特色等，让游客更了解您..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={8}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    建议150-300字，内容真实、详细更容易获得游客信任
                  </span>
                  <span className={`text-sm ${
                    introduction.length >= 20 ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {introduction.length} / 300
                  </span>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-green-800 text-sm">
                    <p className="mb-1">优质介绍示例：</p>
                    <p className="text-xs italic text-green-700 bg-white rounded p-2 mt-2">
                      "你好！我是丽江本地人，从事旅行管家服务已有5年时间，接待过来自全国各地的3000+游客。我熟悉丽江的每一条街道，了解最地道的纳西美食，会说流利的英语和日语。擅长摄影，可以帮您记录旅途中的美好瞬间。提供7座商务车服务，可接送机场/火车站。我会用心为每一位游客提供贴心、专业的服务，让您的丽江之旅留下美好回忆！"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Pricing */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-gray-800">价格配置</h3>
                  <p className="text-gray-500 text-sm">设置您的服务价格</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                <div className="text-center mb-6">
                  <p className="text-gray-600 text-sm mb-2">每小时服务价格</p>
                  <div className="text-4xl text-orange-600 mb-2">
                    ¥{hourlyRate}
                  </div>
                  <p className="text-gray-500 text-xs">
                    范围：¥{MIN_HOURLY_RATE} - ¥{MAX_HOURLY_RATE}
                  </p>
                </div>

                {/* Slider */}
                <div className="mb-6">
                  <input
                    type="range"
                    min={MIN_HOURLY_RATE}
                    max={MAX_HOURLY_RATE}
                    value={hourlyRate}
                    onChange={(e) => handleHourlyRateChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">¥{MIN_HOURLY_RATE}</span>
                    <span className="text-xs text-gray-500">¥{MAX_HOURLY_RATE}</span>
                  </div>
                </div>

                {/* Quick Select */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {[50, 100, 150, 200].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setHourlyRate(rate)}
                      className={`py-2 rounded-lg text-sm transition-colors ${
                        hourlyRate === rate
                          ? 'bg-orange-500 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:border-orange-400'
                      }`}
                    >
                      ¥{rate}
                    </button>
                  ))}
                </div>

                {/* Income Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-t border-orange-200">
                    <span className="text-gray-700 text-sm">游客支付价格：</span>
                    <span className="text-gray-800">¥{hourlyRate}/小时</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 text-sm">平台服务费（20%）：</span>
                    <span className="text-red-600">-¥{platformFee.toFixed(1)}/小时</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-orange-200">
                    <span className="text-gray-800">您的实际收入：</span>
                    <span className="text-green-600 text-xl">
                      ¥{actualEarnings.toFixed(1)}/小时
                    </span>
                  </div>
                </div>
              </div>

              {/* Income Calculator */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h4 className="text-gray-800 mb-3">收入预估</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">工作4小时/天：</span>
                    <span className="text-blue-600">
                      ¥{(actualEarnings * 4).toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">工作8小时/天：</span>
                    <span className="text-blue-600">
                      ¥{(actualEarnings * 8).toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">工作20天/月：</span>
                    <span className="text-green-600">
                      ¥{(actualEarnings * 8 * 20).toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-yellow-800 text-sm">
                    <p className="mb-1">定价建议：</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>价格范围：¥30-200/小时</li>
                      <li>新手旅行管家建议定价¥50-80，积累评价后再提价</li>
                      <li>经验丰富、好评率高的旅行管家可定价¥150-200</li>
                      <li>提供车辆、摄影等增值服务可适当提高价格</li>
                      <li>价格可在后台随时调整</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-gray-200">
            {/* Terms and Conditions - Only show on Step 5 */}
            {currentStep === 5 && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                <h4 className="text-gray-800 mb-2 flex items-center gap-2">
                  📜 旅行管家服务协议
                  <span className="text-red-500">*</span>
                </h4>
                <p className="text-xs text-gray-600 mb-3">请仔细阅读协议内容，滚动到底部后才可勾选同意</p>
                
                {/* Scrollable Agreement Content */}
                <div 
                  className="bg-white rounded-lg p-4 h-64 overflow-y-auto border border-gray-300 mb-3 text-xs text-gray-700 leading-relaxed"
                  onScroll={(e) => {
                    const element = e.currentTarget;
                    const hasReachedBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 5;
                    if (hasReachedBottom && !hasScrolledToBottom) {
                      setHasScrolledToBottom(true);
                    }
                  }}
                >
                  <h5 className="font-bold text-sm text-gray-800 mb-2">旅行管家服务协议</h5>
                  
                  <p className="mb-3">
                    <strong>一、服务内容</strong><br/>
                    1.1 旅行管家服务是指由本平台认证的本地向导为游客提供陪同游览、行程规划、景点讲解、美食推荐、交通协助等综合旅行服务。<br/>
                    1.2 旅行管家应根据游客需求，提供专业、热情、周到的服务，确保游客旅行体验良好。<br/>
                    1.3 旅行管家可根据自身情况提供车辆、摄影、翻译等增值服务，但需在平台上明确标注。
                  </p>
                  
                  <p className="mb-3">
                    <strong>二、服务标准</strong><br/>
                    2.1 旅行管家应按约定时间准时到达集合地点，如有特殊情况应提前30分钟通知游客。<br/>
                    2.2 旅行管家应保持良好的个人形象和职业素养，不得有任何骚扰、欺诈、强迫消费等不当行为。<br/>
                    2.3 旅行管家应尊重游客的个人意愿和隐私，不得擅自更改行程或带游客前往未经同意的地点。<br/>
                    2.4 旅行管家应熟悉服务区域的景点、餐饮、交通等信息，为游客提供准确的建议和帮助。
                  </p>
                  
                  <p className="mb-3">
                    <strong>三、费用与结算</strong><br/>
                    3.1 旅行管家的服务费用按小时计算，具体价格由旅行管家自主设定，平台收取20%的服务费。<br/>
                    3.2 游客支付的费用将由平台托管，服务完成后7天自动结算至旅行管家账户。<br/>
                    3.3 如遇投诉或纠纷，平台有权延迟结算，待问题解决后再进行结算。<br/>
                    3.4 旅行管家提供车辆服务的，车辆费用按天计算，无论服务时长多少，均按一天收费。
                  </p>
                  
                  <p className="mb-3">
                    <strong>四、取消与退款</strong><br/>
                    4.1 游客在集合前2小时以上取消订单，旅行管家不收取任何费用。<br/>
                    4.2 游客在集合前2小时内取消订单，旅行管家可获得订单金额的20%作为补偿。<br/>
                    4.3 旅行管家因个人原因取消订单，需提前24小时通知游客，否则将被扣除信用分。<br/>
                    4.4 因不可抗力因素（如极端天气、自然灾害等）导致订单取消的，双方均不承担责任。
                  </p>
                  
                  <p className="mb-3">
                    <strong>五、责任与义务</strong><br/>
                    5.1 旅行管家应确保所提供的个人信息、资质证明、服务介绍等内容真实有效，不得弄虚作假。<br/>
                    5.2 旅行管家在服务过程中应注意游客的人身和财产安全，但对游客自身行为导致的意外不承担责任。<br/>
                    5.3 旅行管家不得私下收取游客费用，所有交易必须通过平台完成，否则平台不承担任何责任。<br/>
                    5.4 旅行管家应遵守国家法律法规和平台规则，不得从事任何违法违规活动。<br/>
                    5.5 旅行管家有权拒绝提供服务给有不当行为、不尊重服务人员的游客。
                  </p>
                  
                  <p className="mb-3">
                    <strong>六、评价与信用</strong><br/>
                    6.1 每次服务完成后，游客可对旅行管家进行评价，评价将影响旅行管家的信用分和排名。<br/>
                    6.2 旅行管家连续收到3次差评或投诉，平台有权暂停其服务资格，进行审查。<br/>
                    6.3 旅行管家保持良好的服务质量和高评分，可获得平台推荐和流量倾斜。<br/>
                    6.4 旅行管家不得通过虚假交易、刷单等方式提高评分，一经发现将永久封禁账号。
                  </p>
                  
                  <p className="mb-3">
                    <strong>七、知识产权</strong><br/>
                    7.1 旅行管家在平台上传的照片、视频、文字等内容，应确保拥有合法的知识产权或使用权。<br/>
                    7.2 平台有权将旅行管家上传的内容用于平台宣传和推广，但不会用于商业盈利。<br/>
                    7.3 旅行管家不得侵犯他人的知识产权，否则由此产生的法律责任由旅行管家自行承担。
                  </p>
                  
                  <p className="mb-3">
                    <strong>八、隐私保护</strong><br/>
                    8.1 平台将严格保护旅行管家的个人信息，不会泄露给任何第三方。<br/>
                    8.2 旅行管家的身份证、驾照等敏感信息仅用于实名认证，存储在加密数据库中。<br/>
                    8.3 旅行管家应尊重游客的隐私，不得擅自拍摄、传播游客的照片或个人信息。
                  </p>
                  
                  <p className="mb-3">
                    <strong>九、协议变更</strong><br/>
                    9.1 平台有权根据业务发展需要修改本协议，修改后的协议将在平台上公布。<br/>
                    9.2 协议修改后，旅行管家继续使用平台服务即视为接受新的协议内容。<br/>
                    9.3 如旅行管家不同意修改后的协议，可以选择停止使用平台服务。
                  </p>
                  
                  <p className="mb-3">
                    <strong>十、争议解决</strong><br/>
                    10.1 本协议的签订、履行、解释均适用中华人民共和国法律。<br/>
                    10.2 因本协议产生的任何争议，双方应友好协商解决；协商不成的，可向平台所在地人民法院提起诉讼。
                  </p>
                  
                  <p className="mb-3">
                    <strong>十一、其他</strong><br/>
                    11.1 本协议自旅行管家勾选同意并提交入驻申请之日起生效。<br/>
                    11.2 本协议未尽事宜，按照国家相关法律法规和平台规则执行。<br/>
                    11.3 本协议的最终解释权归平台所有。
                  </p>
                  
                  <div className="text-center mt-6 py-4 border-t border-gray-300">
                    <p className="text-gray-600">— 协议结束 —</p>
                    <p className="text-xs text-gray-500 mt-2">感谢您的耐心阅读</p>
                  </div>
                </div>
                
                {/* Checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="guide-terms-checkbox"
                    checked={hasScrolledToBottom}
                    onChange={(e) => setHasScrolledToBottom(e.target.checked)}
                    disabled={!hasScrolledToBottom}
                    className="w-4 h-4 mt-0.5 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label 
                    htmlFor="guide-terms-checkbox" 
                    className={`text-sm cursor-pointer ${hasScrolledToBottom ? 'text-gray-700' : 'text-gray-400'}`}
                  >
                    我已完整阅读并同意《旅行管家服务协议》
                    {!hasScrolledToBottom && (
                      <span className="block text-xs text-orange-600 mt-1">
                        ⚠️ 请滚动至协议底部后勾选
                      </span>
                    )}
                  </label>
                </div>
              </div>
            )}
            
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  上一步
                </button>
              )}
              {currentStep < 5 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceedToNextStep()}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一步
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!hasScrolledToBottom}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  提交审核
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
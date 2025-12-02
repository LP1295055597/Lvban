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
  const [personalInfo, setPersonalInfo] = useState({
    realName: '',
    phone: '',
    city: '丽江',
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

    // 这里应该调用API提交数据
    alert('提交成功！我们将在1-3个工作日内完成审核，请耐心等待。');
    onSuccess();
    onClose();
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return personalInfo.realName && personalInfo.phone && idCardPhotos.front && idCardPhotos.back;
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
            <h2 className="text-gray-800">地陪入驻认证</h2>
            <p className="text-gray-500 text-sm mt-1">成为认证地陪，开启收入之旅</p>
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
                      "你好！我是丽江本地人，从事地陪服务已有5年时间，接待过来自全国各地的3000+游客。我熟悉丽江的每一条街道，了解最地道的纳西美食，会说流利的英语和日语。擅长摄影，可以帮您记录旅途中的美好瞬间。提供7座商务车服务，可接送机场/火车站。我会用心为每一位游客提供贴心、专业的服务，让您的丽江之旅留下美好回忆！"
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
                      <li>新手地陪建议定价¥50-80，积累评价后再提价</li>
                      <li>经验丰富、好评率高的地陪可定价¥150-200</li>
                      <li>提供车辆、摄影等增值服务可适当提高价格</li>
                      <li>价格可在后台随时调整</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
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
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                提交审核
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
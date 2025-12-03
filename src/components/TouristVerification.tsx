import { useState } from 'react';
import { X, Upload, CheckCircle, AlertCircle, Shield, Camera } from 'lucide-react';

interface TouristVerificationProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function TouristVerification({ onSuccess, onClose }: TouristVerificationProps) {
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFrontImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFrontImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    setUploading(true);
    
    // 模拟上传到后台保存
    setTimeout(() => {
      setUploading(false);
      setUploadSuccess(true);
      
      // 自动认证通过
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2000);
  };

  const canSubmit = frontImage && backImage && phoneNumber && emergencyContact && emergencyPhone;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-gray-800">游客身份认证</h2>
              <p className="text-xs text-gray-500">保障您和旅行管家的安全</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {!uploadSuccess ? (
            <div className="space-y-6">
              {/* Why Verify */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-800 mb-2">为什么需要认证？</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 flex-shrink-0 mt-0.5">✓</span>
                        <span>保障旅行管家人身安全</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 flex-shrink-0 mt-0.5">✓</span>
                        <span>建立真实可信的旅行环境</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 flex-shrink-0 mt-0.5">✓</span>
                        <span>提升预约成功率和服务质量</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 flex-shrink-0 mt-0.5">✓</span>
                        <span>享受认证游客专属服务</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-sm text-amber-800">
                    <p className="font-medium mb-1">隐私保护承诺</p>
                    <p className="text-xs leading-relaxed">
                      您的身份信息将被加密存储，仅用于身份验证和安全保障。我们承诺不会泄露您的个人信息，并严格遵守《个人信息保护法》相关规定。
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload Section */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-gray-800 mb-2">上传身份证照片</h3>
                  <p className="text-sm text-gray-500">请确保照片清晰完整，边框完整无遮挡</p>
                </div>

                {/* Upload Cards */}
                <div className="space-y-4">
                  {/* Front Side */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">身份证人像面</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFrontImageUpload}
                        className="hidden"
                        id="front-upload"
                      />
                      <label
                        htmlFor="front-upload"
                        className={`block border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all ${
                          frontImage
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50'
                        }`}
                      >
                        {frontImage ? (
                          <div className="space-y-3">
                            <img src={frontImage} alt="身份证人像面" className="w-full h-48 object-cover rounded-xl" />
                            <div className="flex items-center justify-center gap-2 text-green-600">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm">人像面已上传</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <Camera className="w-12 h-12 mb-3" />
                            <p className="text-sm">点击上传身份证人像面</p>
                            <p className="text-xs mt-1">包含头像、姓名、身份证号码等信息</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">身份证国徽面</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBackImageUpload}
                        className="hidden"
                        id="back-upload"
                      />
                      <label
                        htmlFor="back-upload"
                        className={`block border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all ${
                          backImage
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50'
                        }`}
                      >
                        {backImage ? (
                          <div className="space-y-3">
                            <img src={backImage} alt="身份证国徽面" className="w-full h-48 object-cover rounded-xl" />
                            <div className="flex items-center justify-center gap-2 text-green-600">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm">国徽面已上传</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <Camera className="w-12 h-12 mb-3" />
                            <p className="text-sm">点击上传身份证国徽面</p>
                            <p className="text-xs mt-1">包含国徽、有效期等信息</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-sm text-blue-800 mb-2 font-medium">📸 拍摄提示</p>
                  <ul className="space-y-1 text-xs text-blue-700">
                    <li>• 确保照片清晰，文字和头像清楚可辨</li>
                    <li>• 避免反光、模糊、遮挡等问题</li>
                    <li>• 保持身份证四角完整，边框清晰</li>
                    <li>• 建议在光线充足的环境下拍摄</li>
                  </ul>
                </div>

                {/* Contact Information */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200">
                  <h4 className="text-gray-800 mb-3 flex items-center gap-2">
                    <span>📞</span>
                    <span>联系方式</span>
                    <span className="text-red-500">*</span>
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        您的联系电话 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="block w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="请输入您的联系电话"
                      />
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <h5 className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                        <span>🆘</span>
                        <span>紧急联系人</span>
                        <span className="text-red-500">*</span>
                      </h5>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1.5">联系人姓名</label>
                          <input
                            type="text"
                            value={emergencyContact}
                            onChange={(e) => setEmergencyContact(e.target.value)}
                            className="block w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="请输入紧急联系人姓名"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1.5">联系人电话</label>
                          <input
                            type="tel"
                            value={emergencyPhone}
                            onChange={(e) => setEmergencyPhone(e.target.value)}
                            className="block w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="请输入紧急联系人电话"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          💡 紧急联系人用于突发情况联系，请填写可随时联系的亲友信息
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || uploading}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>上传中...</span>
                    </div>
                  ) : (
                    '提交认证'
                  )}
                </button>
              </div>
            </div>
          ) : (
            // Success Screen
            <div className="space-y-6 py-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-gray-800 mb-2">认证成功！</h3>
                <p className="text-sm text-gray-600 mb-4">
                  您的身份信息已保存，现在可以预约旅行管家
                </p>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 w-full text-left">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                        ✓
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">身份证照片已上传</p>
                        <p className="text-xs text-gray-500">人像面 + 国徽面</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                        ✓
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">信息已保存到后台</p>
                        <p className="text-xs text-gray-500">加密存储，安全可靠</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                        ✓
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">认证完成</p>
                        <p className="text-xs text-gray-500">现在可以预约旅行管家服务</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
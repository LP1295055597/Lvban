import { useState } from 'react';
import { X, Shield, Upload, Award, CheckCircle, Clock, AlertCircle, Star, Camera, FileText, Video, Trash2 } from 'lucide-react';

interface GuideCertificationProps {
  onClose: () => void;
  onSuccess: () => void;
  currentStatus?: 'none' | 'pending' | 'approved' | 'rejected';
}

interface CertificationFile {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  name: string;
  file?: File;
}

export function GuideCertification({ onClose, onSuccess, currentStatus = 'none' }: GuideCertificationProps) {
  const [certificationFiles, setCertificationFiles] = useState<CertificationFile[]>([]);
  const [achievements, setAchievements] = useState({
    tourGuideCard: false,
    drivingLicense: false,
    firstAidCert: false,
    languageCert: false,
  });
  const [experience, setExperience] = useState({
    years: '',
    totalOrders: '',
    specialties: '',
    awards: '',
  });
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'document') => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: CertificationFile[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      type,
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    }));

    setCertificationFiles([...certificationFiles, ...newFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setCertificationFiles(certificationFiles.filter((file) => file.id !== id));
  };

  const handleSubmit = () => {
    // 验证必填项
    if (certificationFiles.length === 0) {
      alert('请至少上传一份资质证明材料');
      return;
    }
    if (!experience.years || !experience.totalOrders) {
      alert('请完善工作经验信息');
      return;
    }

    // 提交认证申请
    alert('认证申请已提交！平台工作人员将在3-5个工作日内完成材料审核，并通过APP系统消息与您约定面试地点及准备材料，请注意查看消息中心。');
    onSuccess();
    onClose();
  };

  // 如果已经认证通过
  if (currentStatus === 'approved') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
        <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-gray-800 mb-2">🎉 您已是认证地陪</h2>
            <p className="text-gray-600 mb-6">
              恭喜！您已通过平台认证，可享受更高的定价权限和优先推荐。
            </p>
            
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-6 border border-yellow-200">
              <h3 className="text-gray-800 mb-3">认证特权</h3>
              <div className="space-y-2 text-sm text-gray-700 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>定价范围：¥30-200/小时（普通地陪¥30-50）</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>订单页面显示认证标识，获得游客信任</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>优先推荐给高端客户</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>专属认证徽章和标识</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              我知道了
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 如果正在审核中
  if (currentStatus === 'pending') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
        <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-gray-800 mb-2">认证审核中</h2>
            <p className="text-gray-600 mb-6">
              您的认证申请正在审核中，平台工作人员将在3-5个工作日内完成审核。
            </p>
            
            <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
              <h3 className="text-gray-800 mb-3">审核进度</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">提交申请</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">材料审核</span>
                  <Clock className="w-5 h-5 text-blue-600 animate-spin" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">线下面试</span>
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">审核完成</span>
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-xl p-3 mb-4 border border-orange-200">
              <p className="text-sm text-orange-800">
                <strong>💬 线下面试说明：</strong><br/>
                材料审核通过后，工作人员将通过APP系统消息与您约定面试地点及准备材料，请注意查看消息中心。
              </p>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              预计审核时间：3-5个工作日
            </p>

            <button
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 如果审核被拒绝
  if (currentStatus === 'rejected') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
        <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-gray-800 mb-2">认证未通过</h2>
            <p className="text-gray-600 mb-6">
              很抱歉，您的认证申请未能通过审核。
            </p>
            
            <div className="bg-red-50 rounded-xl p-4 mb-6 border border-red-200 text-left">
              <h3 className="text-gray-800 mb-2">未通过原因：</h3>
              <p className="text-sm text-gray-700">
                • 提供的资质证明材料不清晰或不完整<br/>
                • 服务订单数量不足（需完成10单以上）<br/>
                • 线下面试未通过平台审核标准
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-colors"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  // 重新申请，返回表单状态
                  window.location.reload();
                }}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                重新申请
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 认证申请表单
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-gray-800 flex items-center gap-2">
              <Shield className="w-6 h-6 text-yellow-600" />
              申请平台认证
            </h2>
            <p className="text-gray-500 text-sm mt-1">通过认证，享受更多特权</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Benefits */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-yellow-600" />
              <h3 className="text-gray-800">认证特权</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>定价上限¥200/小时</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>优先推荐</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>认证徽章</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>高端客户</span>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <h3 className="text-gray-800">认证要求</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                <span>完成订单数量10单以上</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                <span>好评率95%以上，无重大投诉</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                <span>提供相关资质证明（导游证、驾照等）</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                <span className="text-orange-700">通过平台工作人员线下面试</span>
              </div>
            </div>
          </div>

          {/* Certification Materials */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Upload className="w-5 h-5 text-gray-600" />
              <h3 className="text-gray-800">上传资质证明</h3>
              <span className="text-red-500 text-sm">*</span>
            </div>
            
            {/* Checkboxes for certifications */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                <input
                  type="checkbox"
                  checked={achievements.tourGuideCard}
                  onChange={(e) =>
                    setAchievements({ ...achievements, tourGuideCard: e.target.checked })
                  }
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm text-gray-700">导游证</span>
              </label>
              <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                <input
                  type="checkbox"
                  checked={achievements.drivingLicense}
                  onChange={(e) =>
                    setAchievements({ ...achievements, drivingLicense: e.target.checked })
                  }
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm text-gray-700">驾驶证</span>
              </label>
              <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                <input
                  type="checkbox"
                  checked={achievements.firstAidCert}
                  onChange={(e) =>
                    setAchievements({ ...achievements, firstAidCert: e.target.checked })
                  }
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm text-gray-700">急救证书</span>
              </label>
              <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                <input
                  type="checkbox"
                  checked={achievements.languageCert}
                  onChange={(e) =>
                    setAchievements({ ...achievements, languageCert: e.target.checked })
                  }
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm text-gray-700">语言证书</span>
              </label>
            </div>

            {/* File Upload */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              {certificationFiles.map((file) => (
                <div key={file.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  {file.type === 'image' && (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                  )}
                  {file.type === 'document' && (
                    <div className="w-full h-full flex flex-col items-center justify-center p-2">
                      <FileText className="w-8 h-8 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-600 text-center truncate w-full">
                        {file.name}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}

              {certificationFiles.length < 6 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-gray-500 text-xs">上传证明</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'image')}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <p className="text-xs text-gray-500">
              已上传 {certificationFiles.length} / 6 · 支持图片或PDF格式
            </p>
          </div>

          {/* Work Experience */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-gray-600" />
              <h3 className="text-gray-800">工作经验</h3>
              <span className="text-red-500 text-sm">*</span>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-700 text-sm mb-2 block">从业年限</label>
                  <input
                    type="number"
                    value={experience.years}
                    onChange={(e) =>
                      setExperience({ ...experience, years: e.target.value })
                    }
                    placeholder="例如：3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm mb-2 block">完成订单数</label>
                  <input
                    type="number"
                    value={experience.totalOrders}
                    onChange={(e) =>
                      setExperience({ ...experience, totalOrders: e.target.value })
                    }
                    placeholder="例如：150"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-700 text-sm mb-2 block">专业特长</label>
                <input
                  type="text"
                  value={experience.specialties}
                  onChange={(e) =>
                    setExperience({ ...experience, specialties: e.target.value })
                  }
                  placeholder="例如：摄影、徒步、美食讲解"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm mb-2 block">获得奖项（选填）</label>
                <input
                  type="text"
                  value={experience.awards}
                  onChange={(e) =>
                    setExperience({ ...experience, awards: e.target.value })
                  }
                  placeholder="例如：2023年度优秀地陪、金牌向导"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <h3 className="text-gray-800">补充说明</h3>
            </div>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="可以补充说明您的服务优势、特色案例、客户评价等，帮助审核人员更好地了解您..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {additionalInfo.length} / 500
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              提交认证申请
            </button>
            <p className="text-center text-xs text-gray-500 mt-3">
              提交后，平台工作人员将在3-5个工作日内完成审核
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
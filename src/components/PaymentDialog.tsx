import { useState } from 'react';
import { X, CreditCard, Wallet, Smartphone, Shield, CheckCircle2, Info } from 'lucide-react';

interface PaymentDialogProps {
  orderInfo: {
    guideName: string;
    destination: string;
    date: string;
    price: number;
    meetingTime?: string;
  };
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export function PaymentDialog({ orderInfo, onClose, onPaymentSuccess }: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay' | 'card'>('wechat');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePay = () => {
    setIsPaying(true);
    
    setTimeout(() => {
      setIsPaying(false);
      setPaymentSuccess(true);
      
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
      }, 2000);
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl z-50 flex items-center justify-center p-6">
        <div className="bg-white/90 backdrop-blur-2xl rounded-[2rem] max-w-sm w-full p-8 text-center shadow-2xl border border-white/20 animate-scale-in">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-gray-800 mb-2">支付成功</h3>
          <p className="text-gray-600 text-sm mb-6">
            资金已安全托管
          </p>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 space-y-2">
            <p className="text-green-700 text-sm flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              订单已确认
            </p>
            <p className="text-green-700 text-sm flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              地陪将收到通知
            </p>
            <p className="text-green-700 text-sm flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              可在消息中沟通
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900/40 via-blue-900/30 to-purple-900/40 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="bg-white/95 backdrop-blur-2xl rounded-t-[2rem] sm:rounded-[2rem] w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl border border-white/20">
        {/* Header */}
        <div className="relative p-6 pb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
          <div className="relative flex items-center justify-between">
            <h3 className="text-gray-800">确认支付</h3>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-200/80 transition-all hover:scale-105 active:scale-95"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Order Info */}
          <div className="relative overflow-hidden rounded-3xl p-5 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-90"></div>
            <div className="relative space-y-3">
              <div className="flex items-center justify-between text-white/90 text-sm">
                <span>地陪</span>
                <span>{orderInfo.guideName}</span>
              </div>
              <div className="flex items-center justify-between text-white/90 text-sm">
                <span>目的地</span>
                <span>{orderInfo.destination}</span>
              </div>
              <div className="flex items-center justify-between text-white/90 text-sm">
                <span>日期</span>
                <span>{orderInfo.date}</span>
              </div>
              <div className="h-px bg-white/20 my-2"></div>
              <div className="flex items-center justify-between">
                <span className="text-white/90 text-sm">订单金额</span>
                <span className="text-3xl text-white">¥{orderInfo.price}</span>
              </div>
            </div>
          </div>

          {/* Refund Policy */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-5 shadow-md border border-orange-100/50">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-gray-800 text-sm mb-2">退款政策</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-gray-700 leading-relaxed">
                      <span className="text-gray-800">集合前2小时以上取消</span>
                      <br/>
                      <span className="text-green-600">→ 全额退款</span>
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-gray-700 leading-relaxed">
                      <span className="text-gray-800">集合前2小时内取消</span>
                      <br/>
                      <span className="text-amber-600">→ 退款60%，平台和地陪各20%</span>
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-gray-700 leading-relaxed">
                      <span className="text-gray-800">集合后申请退款</span>
                      <br/>
                      <span className="text-red-600">→ 已陪伴时长费用+剩余退60%</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/60 rounded-2xl p-3 backdrop-blur-sm">
              <p className="text-xs text-gray-700 leading-relaxed">
                💡 提前规划行程，尽早取消可减少损失
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-5 shadow-md border border-blue-100/50">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 space-y-1.5">
                <h4 className="text-gray-800 text-sm">资金保障</h4>
                <div className="space-y-1 text-xs text-gray-700">
                  <p className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>资金托管7天后自动结算</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>投诉或违规可申请退款</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>禁止私下交易，保障权益</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h4 className="text-gray-700 text-sm px-1">支付方式</h4>
            
            <button
              onClick={() => setPaymentMethod('wechat')}
              className={`w-full p-4 rounded-2xl transition-all backdrop-blur-sm ${
                paymentMethod === 'wechat'
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 scale-[1.02]'
                  : 'bg-white/60 hover:bg-white/80 shadow-md hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md ${
                    paymentMethod === 'wechat'
                      ? 'bg-white/20 backdrop-blur-sm'
                      : 'bg-gradient-to-br from-green-500 to-emerald-600'
                  }`}>
                    <Smartphone className={`w-5 h-5 ${
                      paymentMethod === 'wechat' ? 'text-white' : 'text-white'
                    }`} />
                  </div>
                  <span className={paymentMethod === 'wechat' ? 'text-white' : 'text-gray-800'}>
                    微信支付
                  </span>
                </div>
                {paymentMethod === 'wechat' && (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                )}
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod('alipay')}
              className={`w-full p-4 rounded-2xl transition-all backdrop-blur-sm ${
                paymentMethod === 'alipay'
                  ? 'bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/30 scale-[1.02]'
                  : 'bg-white/60 hover:bg-white/80 shadow-md hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md ${
                    paymentMethod === 'alipay'
                      ? 'bg-white/20 backdrop-blur-sm'
                      : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                  }`}>
                    <Wallet className={`w-5 h-5 ${
                      paymentMethod === 'alipay' ? 'text-white' : 'text-white'
                    }`} />
                  </div>
                  <span className={paymentMethod === 'alipay' ? 'text-white' : 'text-gray-800'}>
                    支付宝
                  </span>
                </div>
                {paymentMethod === 'alipay' && (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                )}
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod('card')}
              className={`w-full p-4 rounded-2xl transition-all backdrop-blur-sm ${
                paymentMethod === 'card'
                  ? 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 scale-[1.02]'
                  : 'bg-white/60 hover:bg-white/80 shadow-md hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md ${
                    paymentMethod === 'card'
                      ? 'bg-white/20 backdrop-blur-sm'
                      : 'bg-gradient-to-br from-purple-500 to-pink-600'
                  }`}>
                    <CreditCard className={`w-5 h-5 ${
                      paymentMethod === 'card' ? 'text-white' : 'text-white'
                    }`} />
                  </div>
                  <span className={paymentMethod === 'card' ? 'text-white' : 'text-gray-800'}>
                    银行卡
                  </span>
                </div>
                {paymentMethod === 'card' && (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-gradient-to-t from-white/95 to-white/80 backdrop-blur-xl p-6 pt-4 border-t border-gray-100/50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isPaying}
              className="flex-1 py-3.5 bg-gray-100/80 backdrop-blur-sm text-gray-700 rounded-2xl hover:bg-gray-200/80 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-md"
            >
              取消
            </button>
            <button
              onClick={handlePay}
              disabled={isPaying}
              className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-3.5 rounded-2xl hover:shadow-xl hover:shadow-purple-500/50 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg"
            >
              {isPaying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  支付中...
                </>
              ) : (
                <>确认支付 ¥{orderInfo.price}</>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          0% {
            transform: scale(0.95);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}

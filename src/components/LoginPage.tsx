import { useState } from 'react';
import { Check, Apple } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [phoneNumber, setPhoneNumber] = useState('+86 131 **** 3428');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleOneKeyLogin = () => {
    if (!agreedToTerms) {
      alert('请先同意用户协议和隐私政策');
      return;
    }
    // 模拟登录成功
    onLoginSuccess();
  };

  const handleWechatLogin = () => {
    if (!agreedToTerms) {
      alert('请先同意用户协议和隐私政策');
      return;
    }
    // 模拟微信登录成功
    onLoginSuccess();
  };

  const handleAppleLogin = () => {
    if (!agreedToTerms) {
      alert('请先同意用户协议和隐私政策');
      return;
    }
    // 模拟Apple登录成功
    onLoginSuccess();
  };

  const handleChangePhone = () => {
    const newPhone = prompt('请输入手机号码：');
    if (newPhone) {
      // 格式化手机号显示
      const formatted = newPhone.replace(/(\d{3})(\d{4})(\d{4})/, '+86 $1 **** $3');
      setPhoneNumber(formatted);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-green-50 flex flex-col items-center justify-between px-6 py-8 sm:py-12 overflow-hidden relative">
      {/* 背景装饰元素 */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-sky-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-10 w-40 h-40 bg-green-400/10 rounded-full blur-3xl"></div>
      
      {/* Logo and Slogan */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        {/* Logo */}
        <div className="mb-8">
          <div className="relative">
            {/* 创意logo：旅伴两个字 */}
            <div className="text-center">
              {/* 主Logo */}
              <div className="relative inline-block mb-4">
                {/* 背景光晕效果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-sky-400/30 to-green-400/30 blur-3xl rounded-full"></div>
                
                {/* Logo文字 */}
                <h1 className="relative text-7xl tracking-tight">
                  <span className="inline-block relative">
                    <span className="bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600 bg-clip-text text-transparent drop-shadow-lg">
                      旅
                    </span>
                    {/* 装饰圆点 - 旅 */}
                    <div className="absolute -top-3 -right-2 w-3 h-3 bg-gradient-to-br from-sky-400 to-sky-500 rounded-full shadow-lg shadow-sky-400/50"></div>
                  </span>
                  <span className="inline-block relative">
                    <span className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent drop-shadow-lg">
                      伴
                    </span>
                    {/* 装饰圆点 - 伴 */}
                    <div className="absolute -bottom-2 -left-2 w-2.5 h-2.5 bg-gradient-to-br from-green-400 to-green-500 rounded-full shadow-lg shadow-green-400/50 animate-pulse"></div>
                  </span>
                </h1>
              </div>
              
              {/* 英文副标题 */}
              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-gray-300"></div>
                <p className="text-xs tracking-[0.3em] text-gray-400 uppercase">
                  Travel Companion
                </p>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-gray-300"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Slogan */}
        <p className="text-gray-600 text-center mb-16 text-base">
          让每一次出发，都有旅伴
        </p>
      </div>

      {/* Login Section */}
      <div className="w-full max-w-sm space-y-4">
        {/* Phone Number Display */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-gray-800 text-lg">{phoneNumber}</span>
          <button
            onClick={handleChangePhone}
            className="text-sky-500 text-sm hover:text-sky-600 transition-colors"
          >
            更换
          </button>
        </div>

        {/* One-Key Login Button */}
        <button
          onClick={handleOneKeyLogin}
          className="w-full bg-black text-white py-4 rounded-full flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg"
        >
          <div className="w-5 h-5 border-2 border-white rounded flex items-center justify-center">
            <div className="w-2 h-3 border-r-2 border-b-2 border-white transform rotate-45 -mt-0.5"></div>
          </div>
          <span>一键登录</span>
        </button>

        {/* WeChat Login Button */}
        <button
          onClick={handleWechatLogin}
          className="w-full bg-white text-gray-800 py-4 rounded-full flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 transition-colors shadow-md"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.5 10c.8 0 1.5-.7 1.5-1.5S9.3 7 8.5 7 7 7.7 7 8.5 7.7 10 8.5 10zm7 0c.8 0 1.5-.7 1.5-1.5S16.3 7 15.5 7 14 7.7 14 8.5s.7 1.5 1.5 1.5zM12 2C6.5 2 2 6 2 11c0 1.9.6 3.6 1.6 5.1L2 22l6.2-2.6c1.2.5 2.5.8 3.8.8 5.5 0 10-4 10-9s-4.5-9-10-9z"/>
          </svg>
          <span>微信登录</span>
        </button>

        {/* Apple Login Button */}
        <button
          onClick={handleAppleLogin}
          className="w-full bg-white text-gray-800 py-4 rounded-full flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 transition-colors shadow-md"
        >
          <Apple className="w-5 h-5" />
          <span>Apple登录</span>
        </button>

        {/* Terms Agreement */}
        <div className="flex items-start gap-2 pt-4">
          <button
            onClick={() => setAgreedToTerms(!agreedToTerms)}
            className={`w-4 h-4 mt-0.5 rounded-sm border flex-shrink-0 flex items-center justify-center transition-colors ${
              agreedToTerms
                ? 'bg-sky-500 border-sky-500'
                : 'bg-white border-gray-300'
            }`}
          >
            {agreedToTerms && <Check className="w-3 h-3 text-white" />}
          </button>
          <p className="text-xs text-gray-500 leading-relaxed">
            我已阅读并同意{' '}
            <a href="#" className="text-sky-500 hover:text-sky-600" onClick={(e) => e.preventDefault()}>
              《用户协议》
            </a>{' '}
            和{' '}
            <a href="#" className="text-sky-500 hover:text-sky-600" onClick={(e) => e.preventDefault()}>
              《隐私政策》
            </a>
            {' '}及{' '}
            <a href="#" className="text-sky-500 hover:text-sky-600" onClick={(e) => e.preventDefault()}>
              《儿童/青少年个人信息保护规则》
            </a>
          </p>
        </div>
      </div>

      {/* Bottom Indicator (for iOS style) */}
      <div className="w-32 h-1 bg-gray-300 rounded-full mt-6"></div>
    </div>
  );
}
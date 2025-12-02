import { useState } from 'react';
import { Wallet, Lock, TrendingUp, Clock, DollarSign, ArrowUpRight, Eye, EyeOff, AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface Transaction {
  id: number;
  type: 'income' | 'withdraw' | 'locked' | 'unlocked' | 'deducted';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'locked';
  orderId?: number;
  unlockDate?: string;
}

interface LockedFund {
  id: number;
  orderId: number;
  customerName: string;
  amount: number;
  lockDate: string;
  unlockDate: string;
  daysRemaining: number;
  status: 'locked' | 'warning';
}

const mockTransactions: Transaction[] = [
  {
    id: 1,
    type: 'locked',
    amount: 400,
    description: '订单收入（资金锁定7天）',
    date: '2024-12-20 10:30',
    status: 'locked',
    orderId: 5,
    unlockDate: '2024-12-27'
  },
  {
    id: 2,
    type: 'unlocked',
    amount: 300,
    description: '锁定资金解除',
    date: '2024-12-19 09:00',
    status: 'completed',
    orderId: 4
  },
  {
    id: 3,
    type: 'withdraw',
    amount: -500,
    description: '提现到银行卡',
    date: '2024-12-18 14:20',
    status: 'completed'
  },
  {
    id: 4,
    type: 'income',
    amount: 350,
    description: '订单收入',
    date: '2024-12-17 16:45',
    status: 'completed',
    orderId: 3
  },
  {
    id: 5,
    type: 'deducted',
    amount: -100,
    description: '违规扣款 - 私下接单',
    date: '2024-12-16 11:00',
    status: 'completed'
  }
];

const mockLockedFunds: LockedFund[] = [
  {
    id: 1,
    orderId: 1,
    customerName: '旅行者小美',
    amount: 400,
    lockDate: '2024-12-20',
    unlockDate: '2024-12-27',
    daysRemaining: 7,
    status: 'locked'
  },
  {
    id: 2,
    orderId: 2,
    customerName: '张先生',
    amount: 250,
    lockDate: '2024-12-21',
    unlockDate: '2024-12-28',
    daysRemaining: 6,
    status: 'locked'
  },
  {
    id: 3,
    orderId: 6,
    customerName: '李女士',
    amount: 350,
    lockDate: '2024-12-15',
    unlockDate: '2024-12-22',
    daysRemaining: 1,
    status: 'warning'
  }
];

interface GuideWalletProps {
  onClose: () => void;
}

export function GuideWallet({ onClose }: GuideWalletProps) {
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'locked' | 'history'>('overview');
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);

  const totalBalance = 1280;
  const lockedBalance = 1000;
  const availableBalance = totalBalance - lockedBalance;
  const totalIncome = 5680;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-b-3xl p-6 shadow-lg -mt-4 -mx-4 mb-0">
        <div className="flex items-center justify-between mb-4">
          <h2>我的钱包</h2>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            {showBalance ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-sm">总余额</span>
            </div>
            <p className="text-2xl">
              {showBalance ? `¥${totalBalance}` : '****'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-sm">可提现</span>
            </div>
            <p className="text-2xl text-green-300">
              {showBalance ? `¥${availableBalance}` : '****'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-100">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-orange-600" />
              <span className="text-gray-700 text-sm">锁定资金</span>
            </div>
            <p className="text-xl text-orange-600">
              {showBalance ? `¥${lockedBalance}` : '****'}
            </p>
            <p className="text-xs text-orange-500 mt-1">
              {mockLockedFunds.length} 笔订单锁定中
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-gray-700 text-sm">累计收入</span>
            </div>
            <p className="text-xl text-green-600">
              {showBalance ? `¥${totalIncome}` : '****'}
            </p>
            <p className="text-xs text-green-500 mt-1">
              本月 +¥{totalIncome * 0.3}
            </p>
          </div>
        </div>

        {/* Withdraw Button */}
        {availableBalance > 0 && (
          <button
            onClick={() => setShowWithdrawDialog(true)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
          >
            <ArrowUpRight className="w-5 h-5" />
            提现到银行卡（可提现 ¥{availableBalance}）
          </button>
        )}

        {/* Tabs */}
        <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 rounded-lg transition-colors text-sm ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            概览
          </button>
          <button
            onClick={() => setActiveTab('locked')}
            className={`flex-1 py-2 rounded-lg transition-colors text-sm relative ${
              activeTab === 'locked'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            锁定资金
            {mockLockedFunds.length > 0 && (
              <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                activeTab === 'locked' ? 'bg-white text-blue-600' : 'bg-red-500 text-white'
              }`}>
                {mockLockedFunds.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-lg transition-colors text-sm ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            明细
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Warning Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-amber-800 text-sm mb-1">资金安全说明</h4>
                  <p className="text-amber-700 text-xs leading-relaxed">
                    • 订单收入将锁定7天后自动转为可提现余额<br/>
                    • 如遇用户投诉或发现违规行为，平台有权扣除锁定资金<br/>
                    • 请勿私下接单，一经发现将扣除相应金额
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h4 className="text-gray-800 mb-3">最近交易</h4>
              <div className="space-y-3">
                {mockTransactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' || transaction.type === 'unlocked'
                          ? 'bg-green-100'
                          : transaction.type === 'deducted'
                          ? 'bg-red-100'
                          : 'bg-orange-100'
                      }`}>
                        {transaction.type === 'locked' ? (
                          <Lock className="w-5 h-5 text-orange-600" />
                        ) : transaction.type === 'deducted' ? (
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        ) : (
                          <DollarSign className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-gray-800 text-sm">{transaction.description}</p>
                        <p className="text-gray-500 text-xs">{transaction.date}</p>
                      </div>
                    </div>
                    <p className={`${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}¥{Math.abs(transaction.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Locked Funds Tab */}
        {activeTab === 'locked' && (
          <div className="space-y-3">
            {mockLockedFunds.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                <Lock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">暂无锁定资金</p>
              </div>
            ) : (
              mockLockedFunds.map((fund) => (
                <div
                  key={fund.id}
                  className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 ${
                    fund.status === 'warning' ? 'border-amber-500' : 'border-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-gray-800 mb-1">订单 #{fund.orderId}</h4>
                      <p className="text-gray-600 text-sm">{fund.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl text-orange-600">¥{fund.amount}</p>
                      {fund.status === 'warning' && (
                        <span className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          即将解锁
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">锁定日期</span>
                      <span className="text-gray-800">{fund.lockDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">解锁日期</span>
                      <span className="text-gray-800">{fund.unlockDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">剩余天数</span>
                      <span className={`px-2 py-1 rounded-full ${
                        fund.daysRemaining <= 2
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {fund.daysRemaining} 天
                      </span>
                    </div>
                  </div>

                  {fund.status === 'warning' && (
                    <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-2">
                      <p className="text-amber-700 text-xs">
                        ⚠️ 解锁前请确保服务质量，避免用户投诉
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="text-blue-800 text-sm mb-2">锁定资金说明</h4>
              <p className="text-blue-700 text-xs leading-relaxed">
                为保障用户权益，订单收入会锁定7天。锁定期间如遇投诉或发现违规行为，平台将扣除相应金额。7天后资金自动解锁，可随时提现。
              </p>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {mockTransactions.map((transaction) => (
              <div key={transaction.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' || transaction.type === 'unlocked'
                        ? 'bg-green-100'
                        : transaction.type === 'deducted'
                        ? 'bg-red-100'
                        : transaction.type === 'withdraw'
                        ? 'bg-purple-100'
                        : 'bg-orange-100'
                    }`}>
                      {transaction.type === 'locked' ? (
                        <Lock className="w-5 h-5 text-orange-600" />
                      ) : transaction.type === 'deducted' ? (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      ) : transaction.type === 'withdraw' ? (
                        <ArrowUpRight className="w-5 h-5 text-purple-600" />
                      ) : (
                        <DollarSign className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-gray-800">{transaction.description}</p>
                      <p className="text-gray-500 text-sm">{transaction.date}</p>
                      {transaction.unlockDate && (
                        <p className="text-xs text-orange-600 mt-1">
                          解锁时间：{transaction.unlockDate}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className={`text-lg ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}¥{Math.abs(transaction.amount)}
                  </p>
                </div>
                
                <div className={`mt-2 px-3 py-1 rounded-full text-xs inline-block ${
                  transaction.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : transaction.status === 'locked'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {transaction.status === 'completed' ? '已完成' : transaction.status === 'locked' ? '锁定中' : '处理中'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdraw Dialog */}
      {showWithdrawDialog && (
        <WithdrawDialog
          availableBalance={availableBalance}
          onClose={() => setShowWithdrawDialog(false)}
          onSuccess={() => {
            setShowWithdrawDialog(false);
            alert('提现申请已提交！\n预计1-3个工作日到账');
          }}
        />
      )}
    </div>
  );
}

// Withdraw Dialog Component
function WithdrawDialog({ 
  availableBalance, 
  onClose, 
  onSuccess 
}: { 
  availableBalance: number; 
  onClose: () => void; 
  onSuccess: () => void; 
}) {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > availableBalance) {
      alert('提现金额不能超过可用余额');
      return;
    }
    if (withdrawAmount < 1) {
      alert('提现金额不能少于1元');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-800">提现到银行卡</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-gray-700 text-sm mb-2 block">可提现余额</label>
            <p className="text-2xl text-green-600">¥{availableBalance}</p>
          </div>

          <div>
            <label className="text-gray-700 text-sm mb-2 block">提现金额</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="请输入提现金额"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setAmount(availableBalance.toString())}
              className="text-blue-600 text-sm mt-2 hover:underline"
            >
              全部提现
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
            <p>• 提现手续费：免费</p>
            <p>• 到账时间：1-3个工作日</p>
            <p>• 最低提现金额：¥1</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50"
            >
              取消
            </button>
            <button
              onClick={handleWithdraw}
              disabled={isProcessing || !amount}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 disabled:opacity-50"
            >
              {isProcessing ? '处理中...' : '确认提现'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
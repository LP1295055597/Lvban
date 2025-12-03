import { useEffect, useState, useRef } from 'react';
import { AlertTriangle, Clock, X, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface OrderEndReminderProps {
  orderId: number;
  orderEndTime: Date; // 订单结束时间
  isOrderActive: boolean; // 订单是否处于激活状态
  onEndOrder: (orderId: number) => void; // 手动结束订单的回调
  guideName: string;
}

interface ReminderState {
  count: number; // 提醒次数
  totalPenalty: number; // 总扣除金额
  lastReminderTime: Date | null;
  isOverdue: boolean; // 是否已超时
  hasReportedToBackend: boolean; // 是否已报警到后台
}

const REMINDER_INTERVAL_MS = 5 * 60 * 1000; // 5分钟
const PENALTY_PER_REMINDER = 5; // 每次提醒扣除5元
const MAX_PENALTY = 30; // 最多扣除30元
const MAX_REMINDERS = 5; // 最多提醒5次后报警

export function OrderEndReminder({
  orderId,
  orderEndTime,
  isOrderActive,
  onEndOrder,
  guideName
}: OrderEndReminderProps) {
  const [reminderState, setReminderState] = useState<ReminderState>({
    count: 0,
    totalPenalty: 0,
    lastReminderTime: null,
    isOverdue: false,
    hasReportedToBackend: false
  });

  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [timeUntilEnd, setTimeUntilEnd] = useState<string>('');
  const intervalRef = useRef<number | null>(null);
  const reminderTimerRef = useRef<number | null>(null);

  // 计算时间差
  const calculateTimeRemaining = () => {
    const now = new Date();
    const diff = orderEndTime.getTime() - now.getTime();
    
    if (diff <= 0) {
      return '已结束';
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    }
    return `${minutes}分钟`;
  };

  // 发送系统提醒
  const sendReminder = () => {
    const newCount = reminderState.count + 1;
    const newPenalty = Math.min(
      reminderState.totalPenalty + PENALTY_PER_REMINDER,
      MAX_PENALTY
    );

    setReminderState(prev => ({
      ...prev,
      count: newCount,
      totalPenalty: newPenalty,
      lastReminderTime: new Date(),
      isOverdue: true
    }));

    // 显示提醒对话框
    setShowReminderDialog(true);

    // 系统通知
    toast.error(
      `订单${orderId}已超时，请尽快手动结束！`,
      {
        description: `这是第${newCount}次提醒，已扣除${PENALTY_PER_REMINDER}元（累计${newPenalty}元）`,
        duration: 10000,
        action: {
          label: '立即结束',
          onClick: () => handleEndOrder()
        }
      }
    );

    // 如果达到最大提醒次数，报警到后台
    if (newCount >= MAX_REMINDERS && !reminderState.hasReportedToBackend) {
      reportToBackend();
    }
  };

  // 报警到后台管理系统
  const reportToBackend = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-96158a40/order-alert`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            orderId,
            guideName,
            reminderCount: reminderState.count,
            totalPenalty: reminderState.totalPenalty,
            orderEndTime: orderEndTime.toISOString(),
            alertTime: new Date().toISOString()
          })
        }
      );

      if (response.ok) {
        setReminderState(prev => ({
          ...prev,
          hasReportedToBackend: true
        }));

        toast.error(
          '警告：订单已报警至后台系统',
          {
            description: '平台工作人员将电话联系您，请注意接听！',
            duration: 15000
          }
        );

        console.log('订单报警成功：', { orderId, guideName, totalPenalty: reminderState.totalPenalty });
      }
    } catch (error) {
      console.error('订单报警失败：', error);
    }
  };

  // 手动结束订单
  const handleEndOrder = () => {
    setShowReminderDialog(false);
    onEndOrder(orderId);
    
    // 清除所有定时器
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (reminderTimerRef.current) {
      clearTimeout(reminderTimerRef.current);
      reminderTimerRef.current = null;
    }

    toast.success('订单已成功结束', {
      description: reminderState.totalPenalty > 0 
        ? `因延迟结束，已从订单收益中扣除${reminderState.totalPenalty}元`
        : '感谢您按时完成服务'
    });
  };

  // 主定时器 - 检查订单状态
  useEffect(() => {
    if (!isOrderActive) {
      return;
    }

    // 更新倒计时显示
    const updateCountdown = () => {
      setTimeUntilEnd(calculateTimeRemaining());

      const now = new Date();
      const isOverdue = now.getTime() > orderEndTime.getTime();

      if (isOverdue && !reminderState.isOverdue) {
        // 订单刚刚超时，立即发送第一次提醒
        sendReminder();

        // 设置5分钟后的下一次提醒
        scheduleNextReminder();
      }
    };

    // 每秒更新一次倒计时
    intervalRef.current = window.setInterval(updateCountdown, 1000);
    updateCountdown(); // 立即执行一次

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isOrderActive, orderEndTime, reminderState.isOverdue]);

  // 安排下一次提醒
  const scheduleNextReminder = () => {
    if (reminderTimerRef.current) {
      clearTimeout(reminderTimerRef.current);
    }

    reminderTimerRef.current = window.setTimeout(() => {
      sendReminder();
      
      // 如果还没达到最大提醒次数，继续安排下一次
      if (reminderState.count + 1 < MAX_REMINDERS) {
        scheduleNextReminder();
      }
    }, REMINDER_INTERVAL_MS);
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (reminderTimerRef.current) {
        clearTimeout(reminderTimerRef.current);
      }
    };
  }, []);

  if (!isOrderActive) {
    return null;
  }

  return (
    <>
      {/* 订单状态指示器 */}
      <div className={`rounded-xl p-3 mb-3 ${
        reminderState.isOverdue 
          ? 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200'
          : 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${reminderState.isOverdue ? 'text-red-600' : 'text-blue-600'}`} />
            <span className={`text-sm ${reminderState.isOverdue ? 'text-red-800' : 'text-blue-800'}`}>
              {reminderState.isOverdue ? '订单已超时' : `距离结束还有 ${timeUntilEnd}`}
            </span>
          </div>
          
          <button
            onClick={handleEndOrder}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              reminderState.isOverdue
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30 hover:shadow-xl animate-pulse'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {reminderState.isOverdue ? '立即结束订单' : '提前结束订单'}
          </button>
        </div>

        {/* 惩罚信息 */}
        {reminderState.totalPenalty > 0 && (
          <div className="mt-2 pt-2 border-t border-red-200">
            <div className="flex items-center justify-between text-xs">
              <span className="text-red-700">
                已提醒 {reminderState.count} 次
              </span>
              <span className="text-red-800 font-medium">
                已扣除 {reminderState.totalPenalty} 元 / 最多扣除 {MAX_PENALTY} 元
              </span>
            </div>
          </div>
        )}

        {/* 报警提示 */}
        {reminderState.hasReportedToBackend && (
          <div className="mt-2 pt-2 border-t border-red-200 bg-red-100/50 rounded-lg p-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />
              <span className="text-xs text-red-800 font-medium">
                已报警至后台管理系统，平台工作人员将联系您
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 提醒对话框 */}
      {showReminderDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">订单超时提醒</h3>
                    <p className="text-white/90 text-sm">第 {reminderState.count} 次提醒</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReminderDialog(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <p className="text-gray-800 text-sm leading-relaxed">
                  您的订单 <span className="font-medium text-orange-600">#{orderId}</span> 已超过预定结束时间，请尽快手动点击结束订单按钮。
                </p>
              </div>

              {/* 惩罚说明 */}
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-lg">⚠️</span>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-800 mb-2">超时惩罚</h4>
                    <div className="space-y-2 text-xs text-gray-700">
                      <div className="flex items-center justify-between">
                        <span>本次扣除：</span>
                        <span className="font-medium text-red-600">-{PENALTY_PER_REMINDER}元</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>累计扣除：</span>
                        <span className="font-medium text-red-600">-{reminderState.totalPenalty}元</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>最多扣除：</span>
                        <span className="text-gray-600">-{MAX_PENALTY}元</span>
                      </div>
                    </div>
                  </div>
                </div>

                {reminderState.count >= MAX_REMINDERS - 1 && !reminderState.hasReportedToBackend && (
                  <div className="pt-3 border-t border-red-200">
                    <p className="text-xs text-red-700">
                      ⚠️ 警告：再次未及时结束订单，系统将报警至后台管理系统！
                    </p>
                  </div>
                )}
              </div>

              {/* 温馨提示 */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-800 mb-1">温馨提示</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      为了保证服务质量和平台秩序，请在订单结束后及时手动点击"结束订单"按钮。未及时结束将影响您的信用评分。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => setShowReminderDialog(false)}
                className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                稍后处理
              </button>
              <button
                onClick={handleEndOrder}
                className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                立即结束订单
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

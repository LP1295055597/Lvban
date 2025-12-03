import { useState, useEffect } from 'react';
import { AlertTriangle, Phone, CheckCircle, Clock, User, Calendar, DollarSign, RefreshCw } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface AlertDetail {
  orderId: number;
  guideName: string;
  reminderCount: number;
  totalPenalty: number;
  orderEndTime: string;
  alertTime: string;
  status: 'pending' | 'contacted' | 'resolved';
  createdAt: string;
  notes?: string;
  updatedAt?: string;
}

interface Alert {
  alertKey: string;
  orderId: number;
  guideName: string;
  alertTime: string;
  status: 'pending' | 'contacted' | 'resolved';
  details: AlertDetail | null;
}

export function OrderAlertManagement() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'contacted' | 'resolved'>('all');
  const [updatingAlert, setUpdatingAlert] = useState<string | null>(null);

  // 获取报警记录
  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-96158a40/order-alerts`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('获取报警记录失败');
      }

      const data = await response.json();
      if (data.success) {
        setAlerts(data.alerts);
      }
    } catch (error) {
      console.error('获取报警记录失败:', error);
      toast.error('获取报警记录失败', {
        description: error instanceof Error ? error.message : '未知错误'
      });
    } finally {
      setLoading(false);
    }
  };

  // 更新报警状态
  const updateAlertStatus = async (alertKey: string, status: 'pending' | 'contacted' | 'resolved', notes?: string) => {
    setUpdatingAlert(alertKey);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-96158a40/order-alert/${alertKey}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ status, notes })
        }
      );

      if (!response.ok) {
        throw new Error('更新状态失败');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('状态已更新');
        fetchAlerts(); // 重新获取数据
      }
    } catch (error) {
      console.error('更新状态失败:', error);
      toast.error('更新状态失败', {
        description: error instanceof Error ? error.message : '未知错误'
      });
    } finally {
      setUpdatingAlert(null);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // 筛选报警记录
  const filteredAlerts = alerts.filter(alert => {
    if (selectedStatus === 'all') return true;
    return alert.status === selectedStatus;
  });

  // 统计数据
  const stats = {
    total: alerts.length,
    pending: alerts.filter(a => a.status === 'pending').length,
    contacted: alerts.filter(a => a.status === 'contacted').length,
    resolved: alerts.filter(a => a.status === 'resolved').length
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { 
          text: '待处理', 
          color: 'bg-red-100 text-red-600 border-red-200',
          icon: AlertTriangle 
        };
      case 'contacted':
        return { 
          text: '已联系', 
          color: 'bg-yellow-100 text-yellow-600 border-yellow-200',
          icon: Phone 
        };
      case 'resolved':
        return { 
          text: '已解决', 
          color: 'bg-green-100 text-green-600 border-green-200',
          icon: CheckCircle 
        };
      default:
        return { 
          text: '未知', 
          color: 'bg-gray-100 text-gray-600 border-gray-200',
          icon: Clock 
        };
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="mb-2">订单报警系统</h2>
            <p className="text-white/90 text-sm">平台工作人员专用管理界面</p>
          </div>
          <button
            onClick={fetchAlerts}
            disabled={loading}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
          <div className="text-gray-800 mb-1">{stats.total}</div>
          <div className="text-gray-600 text-xs">全部</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-red-100">
          <div className="text-red-600 mb-1">{stats.pending}</div>
          <div className="text-gray-600 text-xs">待处理</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-yellow-100">
          <div className="text-yellow-600 mb-1">{stats.contacted}</div>
          <div className="text-gray-600 text-xs">已联系</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-green-100">
          <div className="text-green-600 mb-1">{stats.resolved}</div>
          <div className="text-gray-600 text-xs">已解决</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm overflow-x-auto">
        {['all', 'pending', 'contacted', 'resolved'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status as any)}
            className={`flex-1 py-2 px-3 rounded-lg transition-colors whitespace-nowrap text-sm ${
              selectedStatus === status
                ? status === 'pending' 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                  : status === 'contacted'
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'
                  : status === 'resolved'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {status === 'all' ? '全部' : getStatusInfo(status).text}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-3 animate-spin" />
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="text-gray-400 text-4xl mb-3">🔔</div>
            <p className="text-gray-500">暂无{selectedStatus !== 'all' ? getStatusInfo(selectedStatus).text : ''}报警记录</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const statusInfo = getStatusInfo(alert.status);
            const StatusIcon = statusInfo.icon;
            const detail = alert.details;

            return (
              <div key={alert.alertKey} className="bg-white rounded-2xl shadow-md overflow-hidden">
                {/* Alert Header */}
                <div className={`p-4 border-b border-gray-100 ${
                  alert.status === 'pending' 
                    ? 'bg-gradient-to-r from-red-50 to-orange-50' 
                    : alert.status === 'contacted'
                    ? 'bg-gradient-to-r from-yellow-50 to-amber-50'
                    : 'bg-gradient-to-r from-green-50 to-emerald-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        alert.status === 'pending'
                          ? 'bg-red-100'
                          : alert.status === 'contacted'
                          ? 'bg-yellow-100'
                          : 'bg-green-100'
                      }`}>
                        <StatusIcon className={`w-5 h-5 ${
                          alert.status === 'pending'
                            ? 'text-red-600'
                            : alert.status === 'contacted'
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-gray-800">订单 #{alert.orderId}</h3>
                        <p className="text-gray-600 text-sm">{alert.guideName}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs border ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </div>
                </div>

                {/* Alert Details */}
                {detail && (
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <div>
                          <div className="text-xs text-gray-500">旅行管家</div>
                          <div className="text-sm text-gray-800">{detail.guideName}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <div>
                          <div className="text-xs text-gray-500">提醒次数</div>
                          <div className="text-sm text-gray-800">{detail.reminderCount} 次</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <div>
                          <div className="text-xs text-gray-500">累计扣除</div>
                          <div className="text-sm text-red-600 font-medium">{detail.totalPenalty} 元</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <div>
                          <div className="text-xs text-gray-500">报警时间</div>
                          <div className="text-sm text-gray-800">
                            {new Date(detail.alertTime).toLocaleString('zh-CN', {
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {detail.notes && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">处理备注</div>
                        <p className="text-sm text-gray-700">{detail.notes}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      {alert.status === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              const notes = prompt('请输入联系备注（可选）：');
                              updateAlertStatus(alert.alertKey, 'contacted', notes || undefined);
                            }}
                            disabled={updatingAlert === alert.alertKey}
                            className="flex-1 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            <Phone className="w-4 h-4" />
                            标记已联系
                          </button>
                          <button
                            onClick={() => {
                              const notes = prompt('请输入解决方案：');
                              if (notes) {
                                updateAlertStatus(alert.alertKey, 'resolved', notes);
                              }
                            }}
                            disabled={updatingAlert === alert.alertKey}
                            className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                            标记已解决
                          </button>
                        </>
                      )}

                      {alert.status === 'contacted' && (
                        <button
                          onClick={() => {
                            const notes = prompt('请输入解决方案：');
                            if (notes) {
                              updateAlertStatus(alert.alertKey, 'resolved', notes);
                            }
                          }}
                          disabled={updatingAlert === alert.alertKey}
                          className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          标记已解决
                        </button>
                      )}

                      {alert.status === 'resolved' && (
                        <div className="w-full py-2 bg-green-50 text-green-600 rounded-xl text-center text-sm flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          已处理完成
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

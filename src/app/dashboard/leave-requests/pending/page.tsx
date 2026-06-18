'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { CheckCircle, XCircle } from 'lucide-react';

export default function PendingLeaveRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try { const res = await api.getPendingLeaveRequests(); setRequests(res.data || []); } catch (err: any) { setError(api.extractMessage(err)); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setActionLoading(`${action}-${id}`);
    try {
      if (action === 'approve') {
        await api.approveLeaveRequest(id);
      } else {
        await api.rejectLeaveRequest(id, { reason: 'Từ chối bởi quản lý' });
      }
      fetchData();
    } catch (err: any) {
      setError(api.extractMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-6">Đơn nghỉ phép chờ duyệt</h2>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">{error}</div>}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Đang tải...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200">Không có đơn nào chờ duyệt</div>
      ) : (
        <div className="space-y-4">
          {requests.map((r: any) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-800">{r.employeeName || r.employeeId || r.employeeCode || 'Unknown'}</span>
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Chờ duyệt</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 space-y-1">
                    <p>Loại: {r.leaveTypeName || `Loại ${r.leaveType}`}</p>
                    <p>Từ: {r.fromDate ? new Date(r.fromDate).toLocaleDateString('vi-VN') : '-'} → Đến: {r.toDate ? new Date(r.toDate).toLocaleDateString('vi-VN') : '-'}</p>
                    {r.reason && <p>Lý do: {r.reason}</p>}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleAction(r.id, 'approve')} disabled={actionLoading === `approve-${r.id}`}
                    className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition cursor-pointer">
                    <CheckCircle size={16} /> Duyệt
                  </button>
                  <button onClick={() => handleAction(r.id, 'reject')} disabled={actionLoading === `reject-${r.id}`}
                    className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition cursor-pointer">
                    <XCircle size={16} /> Từ chối
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

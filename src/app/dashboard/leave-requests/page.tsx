'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Calendar } from 'lucide-react';

export default function MyLeaveRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [balance, setBalance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, balRes] = await Promise.all([
        api.getMyLeaveRequests(),
        api.getMyLeaveBalance(year),
      ]);
      setRequests(reqRes.data || []);
      setBalance(balRes.data);
    } catch { setRequests([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [year]);

  const statusBadge = (status: number) => {
    const map: Record<number, { label: string; class: string }> = {
      0: { label: 'Chờ duyệt', class: 'bg-yellow-100 text-yellow-700' },
      1: { label: 'Đã duyệt', class: 'bg-green-100 text-green-700' },
      2: { label: 'Từ chối', class: 'bg-red-100 text-red-700' },
    };
    const s = map[status] || { label: 'Không xác định', class: 'bg-gray-100 text-gray-600' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.class}`}>{s.label}</span>;
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-lg font-semibold">Đơn nghỉ phép của tôi</h2>
        <div className="ml-auto">
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            {Array.from({ length: 5 }, (_, i) => <option key={i} value={year - 2 + i}>{year - 2 + i}</option>)}
          </select>
        </div>
      </div>

      {balance && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Số dư nghỉ phép {year}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {balance.leaveBalances?.map((b: any, i: number) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-indigo-600">{b.remaining ?? 0}</p>
                <p className="text-xs text-gray-500">{b.leaveTypeName || `Loại ${b.leaveType}`}</p>
              </div>
            ))}
            {!balance.leaveBalances?.length && (
              <div className="text-sm text-gray-400 col-span-full text-center py-4">Chưa có dữ liệu</div>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Đang tải...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200">Chưa có đơn nghỉ phép nào</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-gray-600">Loại</th>
                  <th className="text-left px-4 py-3 text-gray-600">Từ ngày</th>
                  <th className="text-left px-4 py-3 text-gray-600">Đến ngày</th>
                  <th className="text-left px-4 py-3 text-gray-600">Lý do</th>
                  <th className="text-left px-4 py-3 text-gray-600">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r: any, i: number) => (
                  <tr key={r.id || i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">{r.leaveTypeName || `Loại ${r.leaveType}`}</td>
                    <td className="px-4 py-3">{r.fromDate ? new Date(r.fromDate).toLocaleDateString('vi-VN') : '-'}</td>
                    <td className="px-4 py-3">{r.toDate ? new Date(r.toDate).toLocaleDateString('vi-VN') : '-'}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{r.reason || '-'}</td>
                    <td className="px-4 py-3">{statusBadge(r.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import api from '@/services/api';
import { Send } from 'lucide-react';

export default function NewLeaveRequestPage() {
  const [form, setForm] = useState({ leaveType: 0, fromDate: '', toDate: '', reason: '' });
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fromDate || !form.toDate) { setMessage({ type: 'error', text: 'Vui lòng chọn ngày' }); return; }
    setLoading(true);
    setMessage(null);
    try {
      await api.createLeaveRequest({
        leaveType: form.leaveType,
        fromDate: form.fromDate,
        toDate: form.toDate,
        reason: form.reason || null,
      });
      setMessage({ type: 'success', text: 'Gửi đơn nghỉ phép thành công!' });
      setForm({ leaveType: 0, fromDate: '', toDate: '', reason: '' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.response?.data || 'Có lỗi xảy ra' });
    } finally { setLoading(false); }
  };

  const leaveTypes = [
    { value: 0, label: 'Nghỉ phép năm' },
    { value: 1, label: 'Nghỉ ốm' },
    { value: 2, label: 'Nghỉ việc riêng' },
    { value: 3, label: 'Nghỉ không lương' },
  ];

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Send size={24} className="text-indigo-600" />
          <h2 className="text-lg font-semibold">Tạo đơn nghỉ phép</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại nghỉ phép *</label>
            <select value={form.leaveType} onChange={(e) => setForm({ ...form, leaveType: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
              {leaveTypes.map((lt) => <option key={lt.value} value={lt.value}>{lt.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày *</label>
              <input type="date" value={form.fromDate} onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày *</label>
              <input type="date" value={form.toDate} onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lý do</label>
            <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
              placeholder="Nhập lý do nghỉ..." />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer">
            {loading ? 'Đang gửi...' : 'Gửi đơn'}
          </button>
          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>{message.text}</div>
          )}
        </form>
      </div>
    </div>
  );
}

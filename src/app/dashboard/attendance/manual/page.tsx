'use client';

import { useState } from 'react';
import api from '@/services/api';
import { AttendanceStatus } from '@/types';

export default function ManualAttendancePage() {
  const [form, setForm] = useState({
    employeeId: '',
    workDate: new Date().toISOString().split('T')[0],
    shiftId: '',
    checkInTime: '',
    checkOutTime: '',
    status: AttendanceStatus.Present,
    note: '',
  });
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const payload: any = {
        employeeId: form.employeeId,
        workDate: form.workDate,
        status: form.status,
        note: form.note || null,
      };
      if (form.shiftId) payload.shiftId = form.shiftId;
      if (form.checkInTime) payload.checkInTime = new Date(`${form.workDate}T${form.checkInTime}`).toISOString();
      if (form.checkOutTime) payload.checkOutTime = new Date(`${form.workDate}T${form.checkOutTime}`).toISOString();

      await api.createManualAttendance(payload);
      setMessage({ type: 'success', text: 'Tạo bản ghi chấm công thành công!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.response?.data || 'Có lỗi xảy ra' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Nhập chấm công thủ công</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
            <input value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày làm việc *</label>
            <input type="date" value={form.workDate} onChange={(e) => setForm({ ...form, workDate: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shift ID</label>
            <input value={form.shiftId} onChange={(e) => setForm({ ...form, shiftId: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
              <input type="time" value={form.checkInTime} onChange={(e) => setForm({ ...form, checkInTime: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
              <input type="time" value={form.checkOutTime} onChange={(e) => setForm({ ...form, checkOutTime: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái *</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
              <option value={0}>Có mặt</option>
              <option value={1}>Vắng</option>
              <option value={2}>Đi muộn</option>
              <option value={3}>Nửa ngày</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
            <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 h-20 resize-none" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer">
            {loading ? 'Đang xử lý...' : 'Lưu'}
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

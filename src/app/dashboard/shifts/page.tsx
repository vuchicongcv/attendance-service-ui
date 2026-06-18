'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ shiftCode: '', shiftName: '', startTime: '', endTime: '', standardHours: 8, isActive: true });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try { const res = await api.getShifts(); setShifts(res.data || []); } catch (err: any) { setError(api.extractMessage(err)); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm({ shiftCode: '', shiftName: '', startTime: '', endTime: '', standardHours: 8, isActive: true });
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (s: any) => {
    setForm({
      shiftCode: s.shiftCode || '',
      shiftName: s.shiftName || '',
      startTime: s.startTime || '',
      endTime: s.endTime || '',
      standardHours: s.standardHours ?? 8,
      isActive: s.isActive ?? true,
    });
    setEditing(s);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.shiftCode.trim() || !form.shiftName.trim() || !form.startTime || !form.endTime) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, standardHours: Number(form.standardHours) };
      if (editing) {
        await api.updateShift(editing.id, payload);
      } else {
        await api.createShift(payload);
      }
      resetForm();
      fetchData();
    } catch (err: any) { setError(api.extractMessage(err)); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa ca làm việc này?')) return;
    try { await api.deleteShift(id); fetchData(); } catch (err: any) { setError(api.extractMessage(err)); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Ca làm việc</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition cursor-pointer">
          <Plus size={18} /> Thêm ca
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">{error}</div>}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">{editing ? 'Sửa' : 'Thêm'} ca làm việc</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã ca *</label>
                  <input value={form.shiftCode} onChange={(e) => setForm({ ...form, shiftCode: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên ca *</label>
                  <input value={form.shiftName} onChange={(e) => setForm({ ...form, shiftName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giờ bắt đầu *</label>
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giờ kết thúc *</label>
                  <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số giờ tiêu chuẩn *</label>
                <input type="number" step="0.5" value={form.standardHours} onChange={(e) => setForm({ ...form, standardHours: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4" />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Kích hoạt</label>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={resetForm} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">Hủy</button>
                <button type="submit" disabled={saving}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 cursor-pointer">
                  {saving ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Đang tải...</div>
      ) : shifts.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200">Chưa có ca làm việc nào</div>
      ) : (
        <div className="grid gap-4">
          {shifts.map((s: any) => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h4 className="font-medium text-gray-800">{s.shiftName}</h4>
                  <span className="text-xs text-gray-400">({s.shiftCode})</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {s.isActive ? 'Hoạt động' : 'Ẩn'}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {s.startTime?.substring(0, 5)} - {s.endTime?.substring(0, 5)} | {s.standardHours}h/ngày
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(s)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(s.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

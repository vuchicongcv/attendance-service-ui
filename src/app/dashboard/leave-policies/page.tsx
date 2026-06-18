'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function LeavePoliciesPage() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', isPaid: true, annualQuotaDays: '', description: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try { const res = await api.getLeavePolicies(); setPolicies(res.data || []); } catch (err: any) { setError(api.extractMessage(err)); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm({ name: '', isPaid: true, annualQuotaDays: '', description: '' });
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (p: any) => {
    setForm({
      name: p.name || '',
      isPaid: p.isPaid ?? true,
      annualQuotaDays: p.annualQuotaDays?.toString() || '',
      description: p.description || '',
    });
    setEditing(p);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Vui lòng nhập tên chính sách'); return; }
    setSaving(true);
    setError('');
    try {
      const payload: any = { name: form.name.trim(), isPaid: form.isPaid };
      if (form.annualQuotaDays) payload.annualQuotaDays = parseFloat(form.annualQuotaDays);
      if (form.description) payload.description = form.description;
      if (editing) {
        payload.isActive = true;
        await api.updateLeavePolicy(editing.id, payload);
      } else {
        await api.createLeavePolicy(payload);
      }
      resetForm();
      fetchData();
    } catch (err: any) { setError(api.extractMessage(err)); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa chính sách này?')) return;
    try { await api.deleteLeavePolicy(id); fetchData(); } catch (err: any) { setError(api.extractMessage(err)); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Chính sách nghỉ phép</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition cursor-pointer">
          <Plus size={18} /> Thêm mới
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">{error}</div>}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">{editing ? 'Sửa' : 'Thêm'} chính sách</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isPaid" checked={form.isPaid} onChange={(e) => setForm({ ...form, isPaid: e.target.checked })} className="w-4 h-4" />
                <label htmlFor="isPaid" className="text-sm font-medium text-gray-700">Có lương</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hạn mức năm (ngày)</label>
                <input type="number" value={form.annualQuotaDays} onChange={(e) => setForm({ ...form, annualQuotaDays: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 h-20 resize-none" />
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
      ) : policies.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200">Chưa có chính sách nào</div>
      ) : (
        <div className="grid gap-4">
          {policies.map((p: any) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">{p.name}</h4>
                <div className="flex gap-4 mt-1 text-sm text-gray-500">
                  <span className={p.isPaid ? 'text-green-600' : 'text-red-600'}>{p.isPaid ? 'Có lương' : 'Không lương'}</span>
                  {p.annualQuotaDays && <span>Hạn mức: {p.annualQuotaDays} ngày/năm</span>}
                  {p.description && <span>{p.description}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer">
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

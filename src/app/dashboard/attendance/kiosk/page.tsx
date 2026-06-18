'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Monitor, CheckCircle, XCircle, Power } from 'lucide-react';

export default function KioskPage() {
  const [employeeCode, setEmployeeCode] = useState('');
  const [kioskEnabled, setKioskEnabled] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);

  const fetchStatus = async () => {
    setStatusLoading(true);
    try {
      const res = await api.getKioskStatus();
      setKioskEnabled(res.data?.enabled ?? false);
    } catch {
      setKioskEnabled(false);
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  const handleKioskAction = async (action: 'check-in' | 'check-out') => {
    if (!employeeCode.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập mã nhân viên' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const payload = { employeeCode: employeeCode.trim() };
      await (action === 'check-in' ? api.kioskCheckIn(payload) : api.kioskCheckOut(payload));
      setMessage({ type: 'success', text: `${action === 'check-in' ? 'Check In' : 'Check Out'} qua kiosk thành công!` });
      setEmployeeCode('');
    } catch (err: any) {
      setMessage({ type: 'error', text: api.extractMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  const toggleKiosk = async () => {
    setLoading(true);
    try {
      await api.toggleKiosk({ enabled: !kioskEnabled });
      setKioskEnabled(!kioskEnabled);
      setMessage({ type: 'success', text: `Kiosk đã ${!kioskEnabled ? 'bật' : 'tắt'}` });
    } catch (err: any) {
      setMessage({ type: 'error', text: api.extractMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  if (statusLoading) {
    return <div className="text-center py-12 text-gray-400">Đang tải trạng thái kiosk...</div>;
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Monitor size={24} className="text-indigo-600" />
            <h2 className="text-lg font-semibold">Kiosk Mode</h2>
          </div>
          <button
            onClick={toggleKiosk}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
              kioskEnabled ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <Power size={16} />
            {kioskEnabled ? 'Đang bật' : 'Đang tắt'}
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Mã nhân viên</label>
          <input
            value={employeeCode}
            onChange={(e) => setEmployeeCode(e.target.value)}
            placeholder="Nhập mã nhân viên..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg text-center outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={!kioskEnabled}
            onKeyDown={(e) => { if (e.key === 'Enter' && kioskEnabled) handleKioskAction('check-in'); }}
            autoFocus
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleKioskAction('check-in')}
            disabled={loading || !kioskEnabled}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition cursor-pointer"
          >
            <CheckCircle size={20} />
            Check In
          </button>
          <button
            onClick={() => handleKioskAction('check-out')}
            disabled={loading || !kioskEnabled}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition cursor-pointer"
          >
            <XCircle size={20} />
            Check Out
          </button>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>{message.text}</div>
        )}
      </div>
    </div>
  );
}

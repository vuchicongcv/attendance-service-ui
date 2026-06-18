'use client';

import { useState } from 'react';
import api from '@/services/api';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function CheckInOutPage() {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheck = async (action: 'check-in' | 'check-out') => {
    setLoading(action);
    setMessage(null);
    try {
      const res = await (action === 'check-in' ? api.checkIn() : api.checkOut());
      setMessage({ type: 'success', text: `${action === 'check-in' ? 'Check In' : 'Check Out'} thành công!` });
    } catch (err: any) {
      const text = err?.response?.data || 'Có lỗi xảy ra';
      setMessage({ type: 'error', text: typeof text === 'string' ? text : `${action === 'check-in' ? 'Check In' : 'Check Out'} thất bại` });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-lg mx-auto pt-12">
      <div className="text-center mb-8">
        <Clock size={48} className="text-indigo-600 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-gray-800">Check In / Check Out</h2>
        <p className="text-gray-500 text-sm mt-1">Nhấn nút để chấm công</p>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={() => handleCheck('check-in')}
          disabled={loading !== null}
          className="flex items-center gap-3 px-8 py-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 transition cursor-pointer text-lg"
        >
          <CheckCircle size={24} />
          {loading === 'check-in' ? 'Đang xử lý...' : 'Check In'}
        </button>
        <button
          onClick={() => handleCheck('check-out')}
          disabled={loading !== null}
          className="flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50 transition cursor-pointer text-lg"
        >
          <XCircle size={24} />
          {loading === 'check-out' ? 'Đang xử lý...' : 'Check Out'}
        </button>
      </div>

      {message && (
        <div className={`mt-6 p-4 rounded-lg text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';

export default function AttendancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.getMyAttendance(month, year);
      setData(res.data);
    } catch (err) {
      console.error(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [month, year]);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div>
          <label className="text-sm text-gray-500 block">Tháng</label>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-500 block">Năm</label>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={year - 2 + i}>{year - 2 + i}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Đang tải...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Check In</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Check Out</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {data?.records?.length > 0 ? data.records.map((record: any, idx: number) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">{record.workDate ? new Date(record.workDate).toLocaleDateString('vi-VN') : '-'}</td>
                    <td className="px-4 py-3">{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString('vi-VN') : '-'}</td>
                    <td className="px-4 py-3">{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString('vi-VN') : '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 0 ? 'bg-green-100 text-green-700' :
                        record.status === 1 ? 'bg-red-100 text-red-700' :
                        record.status === 2 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {['Có mặt', 'Vắng', 'Đi muộn', 'Nửa ngày'][record.status] || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{record.note || '-'}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-400">Chưa có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

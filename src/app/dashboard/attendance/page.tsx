'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Search } from 'lucide-react';

export default function AttendancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [employeeId, setEmployeeId] = useState('');
  const [mode, setMode] = useState<'me' | 'all' | 'search'>('me');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      let res;
      if (mode === 'me') {
        res = await api.getMyAttendance(month, year);
      } else if (mode === 'search' && employeeId.trim()) {
        res = await api.getAttendance(employeeId.trim(), month, year);
      } else {
        res = await api.getAttendance(undefined, month, year);
      }
      setRecords(res.data?.records || res.data || []);
    } catch (err: any) {
      setError(api.extractMessage(err));
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [month, year, mode]);

  const handleSearch = () => { if (employeeId.trim()) { setMode('search'); fetchData(); } };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button onClick={() => setMode('me')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition cursor-pointer ${mode === 'me' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}>Của tôi</button>
          <button onClick={() => setMode('all')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition cursor-pointer ${mode === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}>Tất cả</button>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <input placeholder="Employee ID" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-48" />
          <button onClick={handleSearch}
            className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer">
            <Search size={16} />
          </button>
        </div>
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
          {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>Tháng {i + 1}</option>)}
        </select>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
          {Array.from({ length: 5 }, (_, i) => <option key={i} value={year - 2 + i}>{year - 2 + i}</option>)}
        </select>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">{error}</div>}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Đang tải...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    {mode === 'all' ? 'Mã NV' : 'Ngày'}
                  </th>
                  {mode === 'all' && <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày</th>}
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Check In</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Check Out</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? records.map((record: any, idx: number) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    {mode === 'all' && <td className="px-4 py-3 font-mono text-xs">{record.employeeId?.substring(0, 8) || record.employeeCode || '-'}</td>}
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
                  <tr><td colSpan={6} className="text-center py-8 text-gray-400">Chưa có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400">
            Tổng: {records.length} bản ghi
          </div>
        </div>
      )}
    </div>
  );
}

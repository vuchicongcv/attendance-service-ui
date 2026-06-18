'use client';

import { useState } from 'react';
import api from '@/services/api';
import { Search, Building2 } from 'lucide-react';

export default function DepartmentAttendancePage() {
  const [departmentId, setDepartmentId] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const fetchData = async () => {
    if (!departmentId.trim()) {
      setError('Vui lòng nhập Department ID');
      return;
    }
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const res = await api.getAttendanceByDepartment(departmentId.trim(), month, year);
      setRecords(res.data?.records || res.data || []);
    } catch (err: any) {
      setError(api.extractMessage(err));
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Building2 size={24} className="text-indigo-600" />
        <h2 className="text-lg font-semibold">Chấm công theo phòng ban</h2>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[220px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Department ID *</label>
            <input value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nhập mã phòng ban..." onKeyDown={(e) => e.key === 'Enter' && fetchData()} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tháng</label>
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>Tháng {i + 1}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Năm</label>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {Array.from({ length: 5 }, (_, i) => <option key={i} value={year - 2 + i}>{year - 2 + i}</option>)}
            </select>
          </div>
          <button onClick={fetchData} disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer">
            <Search size={16} /> {loading ? 'Đang tải...' : 'Tra cứu'}
          </button>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">{error}</div>}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Đang tải...</div>
      ) : searched ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 font-medium text-gray-700 flex items-center justify-between">
            <span>Nhân viên phòng ban</span>
            <span className="text-xs text-gray-400">{records.length} bản ghi</span>
          </div>
          {records.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-gray-600">Nhân viên</th>
                    <th className="text-left px-4 py-3 text-gray-600">Ngày</th>
                    <th className="text-left px-4 py-3 text-gray-600">Check In</th>
                    <th className="text-left px-4 py-3 text-gray-600">Check Out</th>
                    <th className="text-left px-4 py-3 text-gray-600">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r: any, i: number) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{r.employeeName || r.employeeCode || r.employeeId?.substring(0, 8) || '-'}</td>
                      <td className="px-4 py-3">{r.workDate ? new Date(r.workDate).toLocaleDateString('vi-VN') : '-'}</td>
                      <td className="px-4 py-3">{r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString('vi-VN') : '-'}</td>
                      <td className="px-4 py-3">{r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString('vi-VN') : '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          r.status === 0 ? 'bg-green-100 text-green-700' :
                          r.status === 1 ? 'bg-red-100 text-red-700' :
                          r.status === 2 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>{['Có mặt', 'Vắng', 'Đi muộn', 'Nửa ngày'][r.status] || '-'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">Không tìm thấy dữ liệu cho phòng ban này</div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-200">
          <Building2 size={48} className="mx-auto mb-3 opacity-30" />
          <p>Nhập mã phòng ban và bấm "Tra cứu" để xem dữ liệu chấm công</p>
        </div>
      )}
    </div>
  );
}

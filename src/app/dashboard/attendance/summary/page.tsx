'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Users, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function SummaryPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getSummary(month, year);
      setData(res.data);
    } catch (err: any) {
      setError(api.extractMessage(err));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [month, year]);

  const stats = [
    { label: 'Tổng nhân viên', value: data?.totalEmployees ?? data?.total ?? 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Có mặt', value: data?.present ?? data?.onTime ?? 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Vắng', value: data?.absent ?? 0, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Đi muộn', value: data?.late ?? 0, icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  const details = data?.details || data?.employees || [];

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-lg font-semibold">Tổng quan chấm công</h2>
        <div className="ml-auto flex gap-2">
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
            {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>Tháng {i + 1}</option>)}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
            {Array.from({ length: 5 }, (_, i) => <option key={i} value={year - 2 + i}>{year - 2 + i}</option>)}
          </select>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">{error}</div>}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Đang tải...</div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{s.label}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{s.value ?? 0}</p>
                  </div>
                  <div className={`${s.bg} p-3 rounded-lg`}>
                    <s.icon size={24} className={s.color} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {details.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 font-medium text-gray-700 flex items-center justify-between">
                <span>Chi tiết theo nhân viên</span>
                <span className="text-xs text-gray-400">{details.length} nhân viên</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-3 text-gray-600">Nhân viên</th>
                      <th className="text-left px-4 py-3 text-gray-600">Mã NV</th>
                      <th className="text-left px-4 py-3 text-gray-600">Có mặt</th>
                      <th className="text-left px-4 py-3 text-gray-600">Vắng</th>
                      <th className="text-left px-4 py-3 text-gray-600">Đi muộn</th>
                      <th className="text-left px-4 py-3 text-gray-600">Tổng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((d: any, i: number) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{d.employeeName || d.name || '-'}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{d.employeeCode || d.code || d.employeeId?.substring(0, 8) || '-'}</td>
                        <td className="px-4 py-3 text-green-600 font-medium">{d.present ?? d.onTime ?? 0}</td>
                        <td className="px-4 py-3 text-red-600 font-medium">{d.absent ?? 0}</td>
                        <td className="px-4 py-3 text-yellow-600 font-medium">{d.late ?? 0}</td>
                        <td className="px-4 py-3 font-medium">{(d.present ?? d.onTime ?? 0) + (d.absent ?? 0) + (d.late ?? 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!details.length && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
              <Users size={32} className="mx-auto mb-2 opacity-50" />
              <p>{data ? 'Chưa có dữ liệu chi tiết' : 'Chưa có dữ liệu'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

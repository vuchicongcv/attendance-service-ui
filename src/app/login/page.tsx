'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [tokenInput, setTokenInput] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { setToken } = useAuth();

  const handleLogin = () => {
    const trimmed = tokenInput.trim();
    if (!trimmed) {
      setError('Vui lòng nhập JWT token');
      return;
    }
    setToken(trimmed);
    router.push('/dashboard/attendance');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">HR Attendance</h1>
          <p className="text-gray-500 mt-1">Đăng nhập với JWT token</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">JWT Token</label>
            <textarea
              value={tokenInput}
              onChange={(e) => { setTokenInput(e.target.value); setError(''); }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm h-28 resize-none"
              placeholder="Paste your JWT token here..."
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition cursor-pointer"
          >
            Đăng nhập
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            Lấy token từ HR Core sau khi đăng nhập
          </p>
        </div>
      </div>
    </div>
  );
}

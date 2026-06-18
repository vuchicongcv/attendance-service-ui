'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

const navItems = [
  {
    label: 'Chấm công',
    items: [
      { href: '/dashboard/attendance', label: 'Bảng chấm công', icon: '📋' },
      { href: '/dashboard/attendance/check', label: 'Check In / Out', icon: '⏱️' },
      { href: '/dashboard/attendance/kiosk', label: 'Kiosk', icon: '🖥️' },
      { href: '/dashboard/attendance/manual', label: 'Nhập thủ công', icon: '✏️' },
      { href: '/dashboard/attendance/summary', label: 'Tổng quan', icon: '📊' },
      { href: '/dashboard/attendance/department', label: 'Theo phòng ban', icon: '🏢' },
    ],
  },
  {
    label: 'Nghỉ phép',
    items: [
      { href: '/dashboard/leave-requests', label: 'Đơn nghỉ phép', icon: '📄' },
      { href: '/dashboard/leave-requests/new', label: 'Tạo đơn mới', icon: '➕' },
      { href: '/dashboard/leave-requests/pending', label: 'Duyệt đơn', icon: '✅' },
      { href: '/dashboard/leave-policies', label: 'Chính sách', icon: '⚙️' },
    ],
  },
  {
    label: 'Quản lý',
    items: [
      { href: '/dashboard/shifts', label: 'Ca làm việc', icon: '🕐' },
    ],
  },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="p-5 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">HR Attendance</h2>
          <p className="text-xs text-gray-400">Management System</p>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 hover:bg-gray-800 rounded cursor-pointer">
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navItems.map((group) => (
          <div key={group.label}>
            <p className="text-xs font-semibold uppercase text-gray-500 px-3 mb-2 tracking-wider">
              {group.label}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800 text-xs text-gray-500 text-center">
        HR Attendance v1.0
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0">
        {sidebarContent}
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={onClose}>
          <aside className="relative w-64 h-full">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

'use client';

import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';

function DashboardInner({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated) return null;

  const pageTitle = pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'Dashboard';
  const title = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-gray-800 capitalize">{title}</h1>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition cursor-pointer">
            <LogOut size={18} />
            <span className="hidden sm:inline text-sm">Đăng xuất</span>
          </button>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardInner>{children}</DashboardInner>;
}

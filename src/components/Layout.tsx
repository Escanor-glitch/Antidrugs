import {
  LayoutDashboard, Users, CalendarDays, ClipboardCheck,
  Star, LogOut, Shield, Menu, X, ChevronLeft, Bell, Layers, MapPin
} from 'lucide-react';
import { useState } from 'react';
import { type UserRole } from '../data';

export type Page = 'dashboard' | 'volunteers' | 'volunteer-profile' | 'achievements' | 'events' | 'event-detail' | 'attendance' | 'evaluations' | 'sectors' | 'neighborhoods';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  role: UserRole;
  onLogout: () => void;
}

const ROLE_LABELS: Record<UserRole, string> = {
  governorate_supervisor: 'المشرف على المحافظة',
  unit_director: 'مدير الوحدة',
  evaluation_committee: 'لجنة التقييم',
  sector_manager: 'مدير قطاع',
  neighborhood_coordinator: 'منسق الحي',
  volunteer: 'متطوع',
};

const getNavItems = (role: UserRole) => {
  const baseNav = [
    { page: 'dashboard' as Page, label: 'لوحة التحكم', icon: LayoutDashboard },
    { page: 'volunteers' as Page, label: 'المتطوعون', icon: Users },
    { page: 'events' as Page, label: 'الفعاليات', icon: CalendarDays },
  ];

  const adminNav = [
    { page: 'attendance' as Page, label: 'الحضور والغياب', icon: ClipboardCheck },
    { page: 'evaluations' as Page, label: 'التقييمات', icon: Star },
  ];

  const managerNav = [
    { page: 'sectors' as Page, label: 'إدارة القطاعات', icon: Layers },
    { page: 'neighborhoods' as Page, label: 'إدارة الأحياء', icon: MapPin },
  ];

  let items = [...baseNav];

  if (role === 'governorate_supervisor' || role === 'unit_director') {
    items.push(...managerNav, ...adminNav);
  } else if (role === 'evaluation_committee') {
    items.push({ page: 'evaluations' as Page, label: 'التقييمات', icon: Star });
  } else if (role === 'sector_manager') {
    items.push(...managerNav, ...adminNav);
  } else if (role === 'neighborhood_coordinator') {
    items.push(...adminNav);
  }

  return items;
};

export default function Layout({
  children,
  currentPage,
  onNavigate,
  role,
  onLogout,
}: SidebarProps & { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const roleLabel = ROLE_LABELS[role];
  const roleColor = role === 'governorate_supervisor' || role === 'unit_director' ? 'badge-danger'
    : role === 'evaluation_committee' ? 'badge-warning'
    : role === 'sector_manager' ? 'badge-info'
    : role === 'neighborhood_coordinator' ? 'badge-success'
    : 'badge-gray';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-teal-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-teal-700" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">صندوق الإسكندرية</p>
            <p className="text-teal-300 text-xs">لمكافحة المخدرات</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {getNavItems(role).map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => { onNavigate(item.page); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-white text-teal-800 shadow-sm'
                  : 'text-teal-100 hover:bg-teal-700 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
              {isActive && <ChevronLeft className="w-4 h-4 mr-auto" />}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-teal-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">م</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">مرحباً بك</p>
            <span className={`${roleColor} text-xs`}>{roleLabel}</span>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-teal-200 hover:bg-teal-700 hover:text-white text-sm font-semibold transition-all"
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-teal-800 flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-64 bg-teal-800 flex flex-col">
            <div className="absolute left-4 top-4">
              <button onClick={() => setSidebarOpen(false)} className="text-teal-200 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between flex-shrink-0">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden lg:block">
            <h1 className="text-gray-800 font-bold text-lg">
              {getNavItems(role).find(n => n.page === currentPage)?.label || 'نظام إدارة المتطوعين'}
            </h1>
          </div>
          <div className="flex items-center gap-3 mr-auto lg:mr-0">
            <button className="relative text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="text-sm text-gray-600 hidden sm:block font-medium">
              {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

import {
  Users, CalendarDays, ClipboardCheck, TrendingUp,
  Award, Clock, AlertCircle, CheckCircle2
} from 'lucide-react';
import { volunteers, events, registrations, followUpProfiles, sectors, type UserRole } from '../data';
import { getDashboardDataForRole, getAuthContext } from '../utils/permissions';

interface DashboardProps {
  onNavigate: (page: 'volunteers' | 'events' | 'attendance' | 'evaluations') => void;
  userId: string;
  role: UserRole;
}

export default function Dashboard({ onNavigate, userId, role }: DashboardProps) {
  const auth = getAuthContext(userId);
  const dashData = getDashboardDataForRole(auth);

  if (!dashData || !auth) {
    return (
      <div className="card text-center py-12 bg-yellow-50 border border-yellow-100">
        <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
        <p className="text-yellow-700 font-bold">لم يتمكن من تحميل بيانات لوحة التحكم</p>
        <p className="text-yellow-600 text-sm mt-2">يرجى محاولة إعادة تحميل الصفحة</p>
      </div>
    );
  }

  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  const completedEvents = events.filter(e => e.status === 'completed');
  const presentCount = registrations.filter(r => r.attendance === 'present').length;
  const totalAttendance = registrations.filter(r => r.attendance !== null).length;
  const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

  const followUpCount = followUpProfiles.length;

  const recentEvents = [...events]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  const topVolunteers = [...dashData.filteredVols]
    .filter(v => v.status === 'active')
    .sort((a, b) => b.hoursTotal - a.hoursTotal)
    .slice(0, 5);

  const statusConfig = {
    upcoming: { label: 'قادمة', className: 'badge-info' },
    ongoing: { label: 'جارية', className: 'badge-success' },
    completed: { label: 'منتهية', className: 'badge-gray' },
    cancelled: { label: 'ملغاة', className: 'badge-danger' },
  };

  const roleLabel = {
    governorate_supervisor: 'المشرف على المحافظة',
    unit_director: 'مدير الوحدة',
    evaluation_committee: 'لجنة التقييم',
    sector_manager: 'مدير القطاع',
    neighborhood_coordinator: 'منسق الحي',
    volunteer: 'متطوع',
  }[role];

  return (
    <div className="space-y-6">
      {/* Role Banner */}
      <div className="card bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-teal-100 text-sm">الدور الحالي</p>
            <p className="text-2xl font-bold mt-1">{roleLabel}</p>
            {dashData.sector && (
              <p className="text-teal-200 text-sm mt-2">القطاع: {dashData.sector.name}</p>
            )}
            {dashData.neighborhood && (
              <p className="text-teal-200 text-sm">الحي: {dashData.neighborhood.name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button onClick={() => onNavigate('volunteers')} className="card hover:shadow-md transition-shadow text-right cursor-pointer">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
            <span className="text-3xl font-bold text-teal-700">{dashData.activeVols}</span>
          </div>
          <p className="text-gray-600 text-sm font-medium mt-3">متطوع نشط</p>
          <p className="text-gray-400 text-xs mt-1">من إجمالي {dashData.totalVols}</p>
        </button>

        <button onClick={() => onNavigate('events')} className="card hover:shadow-md transition-shadow text-right cursor-pointer">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-3xl font-bold text-blue-600">{upcomingEvents.length}</span>
          </div>
          <p className="text-gray-600 text-sm font-medium mt-3">فعالية قادمة</p>
          <p className="text-gray-400 text-xs mt-1">{completedEvents.length} فعالية مكتملة</p>
        </button>

        <button onClick={() => onNavigate('attendance')} className="card hover:shadow-md transition-shadow text-right cursor-pointer">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-3xl font-bold text-green-600">{attendanceRate}%</span>
          </div>
          <p className="text-gray-600 text-sm font-medium mt-3">معدل الحضور</p>
          <p className="text-gray-400 text-xs mt-1">{presentCount} من {totalAttendance}</p>
        </button>

        <div className="card text-right">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-3xl font-bold text-amber-600">{dashData.totalHours}</span>
          </div>
          <p className="text-gray-600 text-sm font-medium mt-3">إجمالي الساعات</p>
          <p className="text-gray-400 text-xs mt-1">متوسط {Math.round(dashData.totalHours / dashData.totalVols || 0)} ساعة</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card text-right bg-gradient-to-br from-teal-700 to-teal-800 text-white border-0">
          <TrendingUp className="w-8 h-8 text-teal-200 mb-3" />
          <p className="text-3xl font-bold">{events.length}</p>
          <p className="text-teal-200 text-sm font-medium mt-1">إجمالي الفعاليات</p>
        </div>
        <div className="card text-right">
          <Award className="w-8 h-8 text-amber-500 mb-3" />
          <p className="text-3xl font-bold text-gray-800">{followUpCount}</p>
          <p className="text-gray-600 text-sm font-medium mt-1">ملفات متابعة</p>
        </div>
        <div className="card text-right col-span-2 lg:col-span-1">
          <AlertCircle className="w-8 h-8 text-orange-500 mb-3" />
          <p className="text-3xl font-bold text-gray-800">{dashData.pendingVols}</p>
          <p className="text-gray-600 text-sm font-medium mt-1">طلبات معلقة</p>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 font-bold text-base">آخر الفعاليات</h3>
            <button onClick={() => onNavigate('events')} className="text-teal-600 text-sm hover:text-teal-700 font-semibold">
              عرض الكل
            </button>
          </div>
          <div className="space-y-3">
            {recentEvents.slice(0, 4).map(event => {
              const config = statusConfig[event.status];
              const fillPct = Math.min(100, Math.round((event.volunteersRegistered / event.volunteersNeeded) * 100));
              return (
                <div key={event.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-semibold text-sm truncate">{event.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{event.date} · {event.location}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-teal-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {event.volunteersRegistered}/{event.volunteersNeeded}
                      </span>
                    </div>
                  </div>
                  <span className={config.className}>{config.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Volunteers */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 font-bold text-base">أكثر المتطوعين نشاطاً</h3>
            <button onClick={() => onNavigate('volunteers')} className="text-teal-600 text-sm hover:text-teal-700 font-semibold">
              عرض الكل
            </button>
          </div>
          <div className="space-y-3">
            {topVolunteers.map((vol, index) => {
              const volFollowUp = followUpProfiles.find(f => f.volunteerId === vol.id);
              return (
                <div key={vol.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    index === 0 ? 'bg-amber-100 text-amber-700' :
                    index === 1 ? 'bg-gray-200 text-gray-600' :
                    index === 2 ? 'bg-orange-100 text-orange-600' :
                    'bg-gray-100 text-gray-500'
                  }`}>{index + 1}</span>
                  <img src={vol.avatar} alt={vol.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-semibold text-sm truncate">{vol.name}</p>
                    <p className="text-gray-500 text-xs">{vol.eventsAttended} فعالية · {vol.hoursTotal} ساعة</p>
                  </div>
                  {volFollowUp && (
                    <div className="text-right text-xs flex-shrink-0">
                      <p className="text-gray-600 font-medium">{volFollowUp.participationLevel}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="card">
        <h3 className="text-gray-800 font-bold text-base mb-4">ملخص توزيع المتطوعين</h3>
        {dashData.neighborhood ? (
          <div className="text-center py-6">
            <p className="text-lg font-bold text-teal-700">{dashData.neighborhood.name}</p>
            <p className="text-gray-600 text-sm mt-2">{dashData.filteredVols.length} متطوع في هذا الحي</p>
          </div>
        ) : dashData.sector ? (
          <div className="text-center py-6">
            <p className="text-lg font-bold text-teal-700">{dashData.sector.name}</p>
            <p className="text-gray-600 text-sm mt-2">{dashData.filteredVols.length} متطوع في هذا القطاع</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {sectors.map(sector => {
              const count = volunteers.filter(v => v.sectorId === sector.id && v.status === 'active').length;
              return (
                <div key={sector.id} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-teal-700">{count}</p>
                  <p className="text-gray-600 text-xs mt-1 font-medium">{sector.name}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <span className="text-green-600 text-xs">نشط</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

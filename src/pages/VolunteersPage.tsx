import { useState } from 'react';
import { Search, Filter, UserPlus, ChevronLeft, Phone, MapPin, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { volunteers, neighborhoods, type UserRole } from '../data';
import { filterVolunteersByRole, getAuthContext } from '../utils/permissions';

interface VolunteersPageProps {
  onViewProfile: (id: string) => void;
  userId: string;
  role: UserRole;
}

const statusConfig = {
  active: { label: 'نشط', className: 'badge-success', icon: CheckCircle2, color: 'text-green-500' },
  inactive: { label: 'غير نشط', className: 'badge-gray', icon: XCircle, color: 'text-gray-400' },
  pending: { label: 'معلق', className: 'badge-warning', icon: AlertCircle, color: 'text-amber-500' },
};

export default function VolunteersPage({ onViewProfile, userId, role }: VolunteersPageProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const auth = getAuthContext(userId);
  const filteredVols = filterVolunteersByRole(auth);

  const filtered = filteredVols.filter(v => {
    const matchSearch = v.name.includes(search) || v.phone.includes(search) || v.nationalId.includes(search);
    const matchStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">قائمة المتطوعين</h2>
          <p className="text-gray-500 text-sm mt-0.5">{filtered.length} متطوع</p>
        </div>
        <button className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <UserPlus className="w-4 h-4" />
          إضافة متطوع
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="البحث بالاسم أو رقم الهاتف..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pr-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="input-field sm:w-40"
          >
            <option value="all">كل الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
            <option value="pending">معلق</option>
          </select>
        </div>
      </div>

      {/* Volunteers Grid */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">لا توجد نتائج تطابق البحث</p>
          <p className="text-gray-400 text-sm mt-1">جرب تغيير فلاتر البحث</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(vol => {
            const status = statusConfig[vol.status];
            const StatusIcon = status.icon;
            const neighborhood = neighborhoods.find(n => n.id === vol.neighborhoodId);
            return (
              <div key={vol.id} className="card hover:shadow-md transition-all duration-200 cursor-pointer group" onClick={() => onViewProfile(vol.id)}>
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <img src={vol.avatar} alt={vol.name} className="w-14 h-14 rounded-xl object-cover" />
                    <StatusIcon className={`absolute -bottom-1 -right-1 w-5 h-5 ${status.color} bg-white rounded-full`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm group-hover:text-teal-700 transition-colors">{vol.name}</h3>
                        <span className={`${status.className} mt-1 inline-block`}>{status.label}</span>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-gray-300 group-hover:text-teal-500 transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                    <span dir="ltr">{vol.phone}</span>
                  </div>
                  {neighborhood && (
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{neighborhood.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{vol.hoursTotal} ساعة · {vol.eventsAttended} فعالية</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {vol.skills.slice(0, 2).map(skill => (
                    <span key={skill} className="bg-teal-50 text-teal-700 text-xs px-2 py-0.5 rounded-md font-medium">{skill}</span>
                  ))}
                  {vol.skills.length > 2 && (
                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-md">+{vol.skills.length - 2}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

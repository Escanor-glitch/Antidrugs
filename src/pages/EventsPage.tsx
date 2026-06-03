import { useState } from 'react';
import { Search, CalendarDays, MapPin, Users, ChevronLeft, Plus, Clock } from 'lucide-react';
import { events, EVENT_CATEGORIES, DISTRICTS, type Event } from '../data';

interface EventsPageProps {
  onViewEvent: (id: string) => void;
}

const statusConfig = {
  upcoming: { label: 'قادمة', className: 'badge-info', bg: 'bg-blue-50 border-blue-100' },
  ongoing: { label: 'جارية الآن', className: 'badge-success', bg: 'bg-green-50 border-green-100' },
  completed: { label: 'منتهية', className: 'badge-gray', bg: 'bg-gray-50 border-gray-100' },
  cancelled: { label: 'ملغاة', className: 'badge-danger', bg: 'bg-red-50 border-red-100' },
};

export default function EventsPage({ onViewEvent }: EventsPageProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filtered = events.filter(e => {
    const matchSearch = e.title.includes(search) || e.location.includes(search) || e.district.includes(search);
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchCategory = categoryFilter === 'all' || e.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">الفعاليات والأنشطة</h2>
          <p className="text-gray-500 text-sm mt-0.5">{filtered.length} فعالية</p>
        </div>
        <button className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          إضافة فعالية
        </button>
      </div>

      {/* Status Quick Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: 'all', label: 'الكل', count: events.length },
          { value: 'upcoming', label: 'قادمة', count: events.filter(e => e.status === 'upcoming').length },
          { value: 'ongoing', label: 'جارية', count: events.filter(e => e.status === 'ongoing').length },
          { value: 'completed', label: 'منتهية', count: events.filter(e => e.status === 'completed').length },
        ].map(opt => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              statusFilter === opt.value
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-300 hover:text-teal-700'
            }`}
          >
            {opt.label} <span className={`mr-1 text-xs ${statusFilter === opt.value ? 'opacity-80' : 'text-gray-400'}`}>({opt.count})</span>
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في الفعاليات..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pr-10"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="input-field sm:w-52"
          >
            <option value="all">كل التصنيفات</option>
            {EVENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">لا توجد فعاليات</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(event => {
            const config = statusConfig[event.status];
            const fillPct = Math.min(100, Math.round((event.volunteersRegistered / event.volunteersNeeded) * 100));
            const isFull = event.volunteersRegistered >= event.volunteersNeeded;
            return (
              <div
                key={event.id}
                className="card p-0 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => onViewEvent(event.id)}
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className={`${config.className}`}>{config.label}</span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-white/90 text-teal-700 text-xs font-semibold px-2 py-1 rounded-lg">
                      {event.category}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-sm leading-tight mb-3 group-hover:text-teal-700 transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{event.date}</span>
                      <Clock className="w-3.5 h-3.5 flex-shrink-0 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>

                  {/* Volunteers Progress */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Users className="w-3.5 h-3.5" />
                        <span>{event.volunteersRegistered}/{event.volunteersNeeded} متطوع</span>
                      </div>
                      {isFull ? (
                        <span className="badge-success text-xs">مكتمل</span>
                      ) : (
                        <span className="text-xs text-orange-600 font-semibold">
                          متبقي {event.volunteersNeeded - event.volunteersRegistered}
                        </span>
                      )}
                    </div>
                    <div className="bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${isFull ? 'bg-green-500' : 'bg-teal-500'}`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-400">{event.coordinatorName}</span>
                    <ChevronLeft className="w-4 h-4 text-gray-300 group-hover:text-teal-500 transition-colors" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

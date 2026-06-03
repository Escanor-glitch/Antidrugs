import { useState } from 'react';
import {
  ArrowRight, CalendarDays, MapPin, Users, Clock, Tag,
  User, CheckCircle, UserPlus, UserMinus, AlertCircle
} from 'lucide-react';
import { events, volunteers, registrations as initialRegistrations, type Registration } from '../data';

interface EventDetailProps {
  eventId: string;
  onBack: () => void;
  onViewVolunteer: (id: string) => void;
}

const statusConfig = {
  upcoming: { label: 'قادمة', className: 'badge-info' },
  ongoing: { label: 'جارية الآن', className: 'badge-success' },
  completed: { label: 'منتهية', className: 'badge-gray' },
  cancelled: { label: 'ملغاة', className: 'badge-danger' },
};

const attendanceConfig = {
  present: { label: 'حاضر', className: 'badge-success' },
  absent: { label: 'غائب', className: 'badge-danger' },
  excused: { label: 'بعذر', className: 'badge-warning' },
};

export default function EventDetail({ eventId, onBack, onViewVolunteer }: EventDetailProps) {
  const event = events.find(e => e.id === eventId);
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState('');

  if (!event) {
    return (
      <div className="card text-center py-12 bg-yellow-50 border border-yellow-100">
        <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
        <p className="text-yellow-700 font-bold">لم يتم العثور على الفعالية</p>
        <button onClick={onBack} className="btn-secondary mt-4">
          العودة
        </button>
      </div>
    );
  }

  const config = statusConfig[event.status];
  const eventRegs = registrations.filter(r => r.eventId === eventId);
  const registeredVolunteers = eventRegs.map(r => ({
    ...r,
    volunteer: volunteers.find(v => v.id === r.volunteerId),
  })).filter(r => r.volunteer);

  const unregisteredVolunteers = volunteers.filter(
    v => !eventRegs.some(r => r.volunteerId === v.id) && v.status === 'active'
  );

  const handleRegister = () => {
    if (!selectedVolunteerId) return;
    const newReg: Registration = {
      id: `r_new_${Date.now()}`,
      volunteerId: selectedVolunteerId,
      eventId,
      registrationDate: new Date().toISOString().split('T')[0],
      attendance: null,
    };
    setRegistrations(prev => [...prev, newReg]);
    setShowRegisterModal(false);
    setSelectedVolunteerId('');
  };

  const handleRemove = (regId: string) => {
    setRegistrations(prev => prev.filter(r => r.id !== regId));
  };

  return (
    <div className="space-y-5">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold text-sm">
        <ArrowRight className="w-4 h-4" />
        العودة لقائمة الفعاليات
      </button>

      {/* Event Header */}
      <div className="card p-0 overflow-hidden">
        <div className="relative h-48 sm:h-64">
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 right-4 left-4">
            <div className="flex gap-2 mb-2">
              <span className={config.className}>{config.label}</span>
              <span className="badge-info">{event.category}</span>
            </div>
            <h2 className="text-white text-xl font-bold leading-snug">{event.title}</h2>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600 text-sm leading-relaxed mb-5">{event.description}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: CalendarDays, label: 'التاريخ', value: event.date },
              { icon: Clock, label: 'الوقت', value: event.time },
              { icon: MapPin, label: 'الموقع', value: event.location },
              { icon: Tag, label: 'الحي', value: event.district },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex gap-2 items-start">
                  <Icon className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-xs">{item.label}</p>
                    <p className="text-gray-700 text-sm font-medium">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">المنسق: <strong>{event.coordinatorName}</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                <strong className="text-teal-700">{eventRegs.length}</strong>/{event.volunteersNeeded} متطوع
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-teal-500 h-2 rounded-full"
                  style={{ width: `${Math.min(100, Math.round(eventRegs.length / event.volunteersNeeded * 100))}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registered Volunteers */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 text-base">المتطوعون المسجلون ({eventRegs.length})</h3>
          {event.status !== 'completed' && event.status !== 'cancelled' && (
            <button
              onClick={() => setShowRegisterModal(true)}
              className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              تسجيل متطوع
            </button>
          )}
        </div>

        {registeredVolunteers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">لا يوجد متطوعون مسجلون بعد</p>
          </div>
        ) : (
          <div className="space-y-3">
            {registeredVolunteers.map(reg => (
              <div key={reg.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <img
                  src={reg.volunteer!.avatar}
                  alt={reg.volunteer!.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0 cursor-pointer"
                  onClick={() => onViewVolunteer(reg.volunteer!.id)}
                />
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onViewVolunteer(reg.volunteer!.id)}>
                  <p className="font-semibold text-gray-800 text-sm">{reg.volunteer!.name}</p>
                  <p className="text-gray-500 text-xs">{reg.registrationDate} · {reg.volunteer!.district}</p>
                </div>
                <div className="flex items-center gap-2">
                  {reg.attendance ? (
                    <span className={attendanceConfig[reg.attendance].className}>
                      {attendanceConfig[reg.attendance].label}
                    </span>
                  ) : (
                    <span className="badge-info">مسجل</span>
                  )}
                  {event.status !== 'completed' && (
                    <button
                      onClick={() => handleRemove(reg.id)}
                      className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowRegisterModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">تسجيل متطوع في الفعالية</h3>
            <p className="text-sm text-gray-600 mb-4">
              <strong>{event.title}</strong>
            </p>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">اختر المتطوع</label>
              {unregisteredVolunteers.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">جميع المتطوعين النشطين مسجلون بالفعل</p>
              ) : (
                <select
                  value={selectedVolunteerId}
                  onChange={e => setSelectedVolunteerId(e.target.value)}
                  className="input-field"
                >
                  <option value="">-- اختر متطوعاً --</option>
                  {unregisteredVolunteers.map(v => (
                    <option key={v.id} value={v.id}>{v.name} · {v.district}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowRegisterModal(false)} className="btn-secondary flex-1">إلغاء</button>
              <button
                onClick={handleRegister}
                disabled={!selectedVolunteerId}
                className="btn-primary flex-1 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                تسجيل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

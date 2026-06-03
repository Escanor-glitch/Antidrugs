import {
  ArrowRight, Phone, Mail, MapPin, Calendar, Clock,
  Award, CheckCircle2, XCircle, AlertCircle,
  Briefcase, GraduationCap, Hash, TrendingUp, Lightbulb, Users, MessageSquare
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { volunteers, events, registrations, followUpProfiles, attendanceRecords, neighborhoods, sectors, type UserRole } from '../data';
import { getAuthContext, canViewVolunteer } from '../utils/permissions';

interface VolunteerProfileProps {
  volunteerId: string;
  onBack: () => void;
  onViewAchievements: (id: string) => void;
  onViewEvent: (eventId: string) => void;
  userId: string;
  role: UserRole;
}

const statusConfig = {
  active: { label: 'نشط', className: 'badge-success', icon: CheckCircle2, color: 'text-green-500' },
  inactive: { label: 'غير نشط', className: 'badge-gray', icon: XCircle, color: 'text-gray-400' },
  pending: { label: 'معلق', className: 'badge-warning', icon: AlertCircle, color: 'text-amber-500' },
};

const attendanceConfig = {
  present: { label: 'حاضر', className: 'badge-success' },
  absent: { label: 'غائب', className: 'badge-danger' },
  excused: { label: 'بعذر', className: 'badge-warning' },
};

export default function VolunteerProfile({ volunteerId, onBack, onViewAchievements, onViewEvent, userId, role }: VolunteerProfileProps) {
  const auth = getAuthContext(userId);
  const canView = canViewVolunteer(auth, volunteerId);

  if (!canView) {
    return (
      <div className="card text-center py-12 bg-red-50 border border-red-100">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-700 font-bold">ليس لديك صلاحية لعرض هذا المتطوع</p>
        <button onClick={onBack} className="btn-secondary mt-4">
          العودة
        </button>
      </div>
    );
  }

  const vol = volunteers.find(v => v.id === volunteerId);
  if (!vol) {
    return (
      <div className="card text-center py-12 bg-yellow-50 border border-yellow-100">
        <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
        <p className="text-yellow-700 font-bold">لم يتم العثور على المتطوع</p>
        <button onClick={onBack} className="btn-secondary mt-4">
          العودة
        </button>
      </div>
    );
  }

  const volRegistrations = registrations.filter(r => r.volunteerId === volunteerId);
  const volFollowUp = followUpProfiles.find(f => f.volunteerId === volunteerId);
  const volAttendance = attendanceRecords.filter(a => a.volunteerId === volunteerId);

  const status = statusConfig[vol.status];
  const StatusIcon = status.icon;

  const sector = sectors.find(s => s.id === vol.sectorId);
  const neighborhood = neighborhoods.find(n => n.id === vol.neighborhoodId);

  return (
    <div className="space-y-5">
      {/* Back Button */}
      <button onClick={onBack} className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold text-sm">
        <ArrowRight className="w-4 h-4" />
        العودة لقائمة المتطوعين
      </button>

      {/* Profile Header */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-shrink-0">
            <img src={vol.avatar} alt={vol.name} className="w-24 h-24 rounded-2xl object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{vol.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <StatusIcon className={`w-4 h-4 ${status.color}`} />
                  <span className={status.className}>{status.label}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onViewAchievements(volunteerId)} className="btn-primary text-sm py-2 px-4">سجل الإنجازات</button>
                <button className="btn-secondary text-sm py-2 px-4">تعديل</button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'إجمالي الساعات', value: `${vol.hoursTotal}`, unit: 'ساعة', icon: Clock },
                { label: 'الفعاليات', value: `${vol.eventsAttended}`, unit: 'فعالية', icon: Calendar },
                { label: 'سجلات الحضور', value: `${volAttendance.length}`, unit: 'سجل', icon: CheckCircle2 },
                { label: 'تاريخ الانضمام', value: vol.joinDate, unit: '', icon: Award },
              ].map(stat => {
                const StatIcon = stat.icon;
                return (
                  <div key={stat.label} className="bg-gray-50 rounded-xl p-3">
                    <StatIcon className="w-4 h-4 text-teal-600 mb-1" />
                    <p className="text-xl font-bold text-gray-800">{stat.value} <span className="text-sm font-normal text-gray-500">{stat.unit}</span></p>
                    <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Personal Info */}
        <div className="card space-y-4">
          <h3 className="font-bold text-gray-800 text-base border-b border-gray-100 pb-3">المعلومات الشخصية</h3>
          {[
            { icon: Phone, label: 'الهاتف', value: vol.phone, dir: 'ltr' },
            { icon: Mail, label: 'البريد الإلكتروني', value: vol.email, dir: 'ltr' },
            { icon: MapPin, label: 'العنوان', value: vol.address },
            sector && { icon: MapPin, label: 'القطاع', value: sector.name },
            neighborhood && { icon: MapPin, label: 'الحي', value: neighborhood.name },
            { icon: Hash, label: 'الرقم القومي', value: vol.nationalId, dir: 'ltr' },
            { icon: Calendar, label: 'العمر', value: `${vol.age} سنة` },
            { icon: GraduationCap, label: 'المؤهل العلمي', value: vol.education },
            { icon: Briefcase, label: 'المهنة', value: vol.occupation },
          ].filter(Boolean).map(item => {
            if (!item) return null;
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex gap-3">
                <Icon className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-xs">{item.label}</p>
                  <p className="text-gray-700 text-sm font-medium" dir={item.dir}>{item.value}</p>
                </div>
              </div>
            );
          })}

          {/* Skills */}
          <div>
            <p className="text-gray-400 text-xs mb-2">المهارات</p>
            <div className="flex flex-wrap gap-2">
              {vol.skills.map(skill => (
                <span key={skill} className="bg-teal-50 text-teal-700 text-xs px-3 py-1 rounded-lg font-medium">{skill}</span>
              ))}
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
            <p className="text-gray-500 text-xs mb-3 font-semibold">بطاقة الهوية الرقمية</p>
            <div className="bg-white rounded-lg p-3 inline-block border border-gray-100">
              <QRCodeSVG value={vol.qrCode} size={150} level="H" includeMargin={true} />
            </div>
            <p className="text-gray-700 text-xs font-mono mt-3 dir-ltr">{vol.qrCode}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Registrations */}
          <div className="card">
            <h3 className="font-bold text-gray-800 text-base border-b border-gray-100 pb-3 mb-4">سجل المشاركة في الفعاليات</h3>
            {volRegistrations.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">لا توجد مشاركات مسجلة</p>
            ) : (
              <div className="space-y-3">
                {volRegistrations.map(reg => {
                  const event = events.find(e => e.id === reg.eventId);
                  if (!event) return null;
                  return (
                    <div key={reg.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => onViewEvent(event.id)}>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">{event.title}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{event.date} · {event.location}</p>
                      </div>
                      {reg.attendance ? (
                        <span className={attendanceConfig[reg.attendance].className}>
                          {attendanceConfig[reg.attendance].label}
                        </span>
                      ) : (
                        <span className="badge-info">مسجل</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Follow-up Profile */}
          <div className="card">
            <h3 className="font-bold text-gray-800 text-base border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              ملف المتابعة والتطوير
            </h3>
            {!volFollowUp ? (
              <p className="text-gray-400 text-sm text-center py-6">لم يتم إعداد ملف متابعة بعد</p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
                    <p className="text-gray-500 text-xs mb-1">مستوى المشاركة</p>
                    <p className="text-gray-800 font-semibold text-sm">{volFollowUp.participationLevel}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <p className="text-gray-500 text-xs mb-1">الالتزام</p>
                    <p className="text-gray-800 font-semibold text-sm">{volFollowUp.commitmentLevel}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                    <p className="text-gray-500 text-xs mb-1">العمل الجماعي</p>
                    <p className="text-gray-800 font-semibold text-sm">{volFollowUp.teamwork}</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                    <p className="text-gray-500 text-xs mb-1">مهارات التواصل</p>
                    <p className="text-gray-800 font-semibold text-sm">{volFollowUp.communicationSkills}</p>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                  <p className="text-gray-500 text-xs mb-1">الإمكانيات القيادية</p>
                  <p className="text-gray-800 font-semibold text-sm">{volFollowUp.leadershipPotential}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs mb-2 font-semibold flex items-center gap-1">
                    <Lightbulb className="w-4 h-4" /> نقاط القوة
                  </p>
                  <p className="text-gray-700 text-sm bg-white rounded-lg p-3">{volFollowUp.strengths}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs mb-2 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> مجالات التطوير
                  </p>
                  <p className="text-gray-700 text-sm bg-white rounded-lg p-3">{volFollowUp.areasForImprovement}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs mb-2 font-semibold flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" /> ملاحظات الفعالية
                  </p>
                  <p className="text-gray-700 text-sm bg-white rounded-lg p-3">{volFollowUp.eventNotes}</p>
                </div>

                {(auth?.role === 'governorate_supervisor' || auth?.role === 'unit_director' || auth?.role === 'evaluation_committee') && volFollowUp.followUpCommitteeNotes && (
                  <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                    <p className="text-gray-500 text-xs mb-2 font-semibold">ملاحظات لجنة المتابعة والتقييم</p>
                    <p className="text-gray-700 text-sm">{volFollowUp.followUpCommitteeNotes}</p>
                  </div>
                )}

                {volFollowUp.recommendations.length > 0 && (
                  <div>
                    <p className="text-gray-500 text-xs mb-2 font-semibold">التوصيات</p>
                    <div className="flex flex-wrap gap-2">
                      {volFollowUp.recommendations.map(rec => (
                        <span key={rec} className="bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700 text-xs px-3 py-1.5 rounded-lg font-medium border border-teal-100">
                          {rec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Attendance History */}
          <div className="card">
            <h3 className="font-bold text-gray-800 text-base border-b border-gray-100 pb-3 mb-4">سجل الحضور</h3>
            {volAttendance.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">لا توجد سجلات حضور</p>
            ) : (
              <div className="space-y-2">
                {volAttendance.map(att => {
                  const event = events.find(e => e.id === att.eventId);
                  const statusLabel = { 'present': 'حاضر', 'absent': 'غائب', 'excused': 'بعذر' }[att.status];
                  const statusColor = { 'present': 'bg-green-50 text-green-700', 'absent': 'bg-red-50 text-red-700', 'excused': 'bg-amber-50 text-amber-700' }[att.status];
                  return (
                    <div key={att.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="text-gray-800 text-sm font-medium">{event?.title}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{att.timestamp} · {att.scannedByName}</p>
                      </div>
                      <span className={`${statusColor} text-xs px-3 py-1 rounded-lg font-medium`}>{statusLabel}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

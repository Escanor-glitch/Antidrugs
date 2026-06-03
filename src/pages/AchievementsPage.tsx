import { ArrowRight, Trophy, Award, Clock, Users, Zap } from 'lucide-react';
import { volunteers, events, registrations, attendanceRecords, followUpProfiles, type UserRole } from '../data';
import { getAuthContext, canViewVolunteer } from '../utils/permissions';

interface AchievementsPageProps {
  volunteerId: string;
  onBack: () => void;
  userId: string;
  role: UserRole;
}

export default function AchievementsPage({ volunteerId, onBack, userId, role }: AchievementsPageProps) {
  const auth = getAuthContext(userId);
  const canView = canViewVolunteer(auth, volunteerId);

  if (!canView) {
    return (
      <div className="card text-center py-12 bg-red-50 border border-red-100">
        <Trophy className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-700 font-bold">ليس لديك صلاحية لعرض هذا الملف</p>
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
        <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
        <p className="text-yellow-700 font-bold">لم يتم العثور على المتطوع</p>
        <button onClick={onBack} className="btn-secondary mt-4">
          العودة
        </button>
      </div>
    );
  }

  const volAttendance = attendanceRecords.filter(a => a.volunteerId === volunteerId);
  const volRegistrations = registrations.filter(r => r.volunteerId === volunteerId);
  const volFollowUp = followUpProfiles.find(f => f.volunteerId === volunteerId);

  const presentCount = volAttendance.filter(a => a.status === 'present').length;
  const participatedEvents = new Set(volAttendance.map(a => a.eventId)).size;

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold text-sm">
        <ArrowRight className="w-4 h-4" />
        العودة
      </button>

      {/* Header */}
      <div className="card bg-gradient-to-r from-teal-600 to-blue-600 text-white">
        <div className="flex items-start gap-4">
          <img src={vol.avatar} alt={vol.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-white" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{vol.name}</h1>
            <p className="text-teal-100 text-sm mt-1">سجل الإنجازات والتطوير</p>
            <div className="flex gap-4 mt-3 text-sm">
              <div>
                <p className="text-teal-100">تاريخ الانضمام</p>
                <p className="font-semibold">{vol.joinDate}</p>
              </div>
              <div>
                <p className="text-teal-100">إجمالي الساعات</p>
                <p className="font-semibold">{vol.hoursTotal} ساعة</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{participatedEvents}</p>
          <p className="text-gray-500 text-xs">فعالية شاركت</p>
        </div>
        <div className="card text-center">
          <Award className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{presentCount}</p>
          <p className="text-gray-500 text-xs">حضور مؤكد</p>
        </div>
        <div className="card text-center">
          <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{vol.hoursTotal}</p>
          <p className="text-gray-500 text-xs">ساعة تطوع</p>
        </div>
        <div className="card text-center">
          <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{vol.eventsAttended}</p>
          <p className="text-gray-500 text-xs">مجموع المشاركات</p>
        </div>
      </div>

      {/* Professional Summary */}
      {volFollowUp && (
        <div className="card space-y-4">
          <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">الملف المهني</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
              <p className="text-gray-500 text-xs mb-1">المؤهل العلمي</p>
              <p className="text-gray-800 font-semibold text-sm">{vol.education}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
              <p className="text-gray-500 text-xs mb-1">المهنة</p>
              <p className="text-gray-800 font-semibold text-sm">{vol.occupation}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border border-green-100">
              <p className="text-gray-500 text-xs mb-1">المستوى التطوعي</p>
              <p className="text-gray-800 font-semibold text-sm">{volFollowUp.participationLevel}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-gray-600 text-sm font-semibold mb-2">نقاط القوة الرئيسية:</p>
              <p className="text-gray-700 text-sm">{volFollowUp.strengths}</p>
            </div>

            <div>
              <p className="text-gray-600 text-sm font-semibold mb-2">مجالات التطوير:</p>
              <p className="text-gray-700 text-sm">{volFollowUp.areasForImprovement}</p>
            </div>
          </div>

          {volFollowUp.recommendations.length > 0 && (
            <div>
              <p className="text-gray-600 text-sm font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                التوصيات والفرص
              </p>
              <div className="flex flex-wrap gap-2">
                {volFollowUp.recommendations.map(rec => (
                  <span key={rec} className="bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 text-sm px-3 py-1.5 rounded-full font-medium border border-teal-200">
                    {rec}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Events Timeline */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">سجل الفعاليات والإنجازات</h2>
        {volAttendance.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">لا توجد سجلات فعاليات</p>
        ) : (
          <div className="space-y-2">
            {volAttendance.map((att, idx) => {
              const event = events.find(e => e.id === att.eventId);
              const statusIcon = att.status === 'present' ? '✓' : att.status === 'absent' ? '✗' : '!';
              const statusColor = att.status === 'present' ? 'text-green-600' : att.status === 'absent' ? 'text-red-600' : 'text-amber-600';
              return (
                <div key={att.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${statusColor} bg-gray-100`}>
                    {statusIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-medium text-sm">{event?.title}</p>
                    <p className="text-gray-500 text-xs">
                      {att.timestamp} • {event?.location}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded font-medium flex-shrink-0 ${att.status === 'present' ? 'bg-green-50 text-green-700' : att.status === 'absent' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                    {att.status === 'present' ? 'حاضر' : att.status === 'absent' ? 'غائب' : 'بعذر'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">المهارات والخبرات</h2>
        <div className="flex flex-wrap gap-2">
          {vol.skills.map(skill => (
            <span key={skill} className="bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700 text-sm px-4 py-2 rounded-lg font-medium border border-teal-200">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

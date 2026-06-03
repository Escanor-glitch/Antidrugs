import { useState } from 'react';
import { Plus, Save, AlertCircle, TrendingUp } from 'lucide-react';
import { volunteers, followUpProfiles, type ParticipationLevel, type CommitmentLevel, type TeammateStatus, type CommunicationSkill, type LeadershipPotential, type Recommendation } from '../data';

interface FormData {
  volunteerId: string;
  participationLevel: ParticipationLevel;
  commitmentLevel: CommitmentLevel;
  teamwork: TeammateStatus;
  communicationSkills: CommunicationSkill;
  leadershipPotential: LeadershipPotential;
  strengths: string;
  areasForImprovement: string;
  eventNotes: string;
  followUpCommitteeNotes: string;
  recommendations: Recommendation[];
}

const participationOptions: ParticipationLevel[] = ['مشارك بفاعلية', 'مشارك بانتظام', 'مشارك أحياناً', 'يحتاج زيادة المشاركة'];
const commitmentOptions: CommitmentLevel[] = ['ملتزم جداً', 'ملتزم', 'يحتاج تحسين الالتزام'];
const teamworkOptions: TeammateStatus[] = ['متعاون جداً', 'متعاون', 'يحتاج تطوير مهارات العمل الجماعي'];
const communicationOptions: CommunicationSkill[] = ['ممتازة', 'جيدة', 'تحتاج تطوير'];
const leadershipOptions: LeadershipPotential[] = ['مرشح للقيادة', 'يظهر إمكانيات جيدة', 'يحتاج مزيداً من الخبرة'];
const recommendationOptions: Recommendation[] = ['مرشح للتكريم', 'مرشح لمنصب منسق حي', 'مرشح لمنصب رئيس قطاع', 'مرشح لقيادة فعالية', 'يحتاج متابعة', 'يحتاج تدريب إضافي', 'لا توصية'];

export default function EvaluationsPage() {
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<FormData>({
    volunteerId: '',
    participationLevel: 'مشارك بانتظام',
    commitmentLevel: 'ملتزم',
    teamwork: 'متعاون',
    communicationSkills: 'جيدة',
    leadershipPotential: 'يحتاج مزيداً من الخبرة',
    strengths: '',
    areasForImprovement: '',
    eventNotes: '',
    followUpCommitteeNotes: '',
    recommendations: [],
  });

  const handleRecommendationToggle = (rec: Recommendation) => {
    setForm(prev => ({
      ...prev,
      recommendations: prev.recommendations.includes(rec)
        ? prev.recommendations.filter(r => r !== rec)
        : [...prev.recommendations, rec]
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setShowForm(false);
      setForm({
        volunteerId: '',
        participationLevel: 'مشارك بانتظام',
        commitmentLevel: 'ملتزم',
        teamwork: 'متعاون',
        communicationSkills: 'جيدة',
        leadershipPotential: 'يحتاج مزيداً من الخبرة',
        strengths: '',
        areasForImprovement: '',
        eventNotes: '',
        followUpCommitteeNotes: '',
        recommendations: [],
      });
    }, 1500);
  };

  const profilesCount = followUpProfiles.length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">ملفات المتابعة والتطوير</h2>
        <p className="text-gray-500 text-sm mt-0.5">إدارة ملفات تطوير المتطوعين والتوصيات</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-right bg-teal-50 border border-teal-100">
          <p className="text-gray-500 text-sm mb-1">إجمالي الملفات</p>
          <p className="text-3xl font-bold text-teal-700">{profilesCount}</p>
        </div>
        <div className="card text-right bg-blue-50 border border-blue-100">
          <p className="text-gray-500 text-sm mb-1">إجمالي المتطوعين</p>
          <p className="text-3xl font-bold text-blue-700">{volunteers.length}</p>
        </div>
        <div className="card text-right bg-amber-50 border border-amber-100">
          <button
            onClick={() => setShowForm(true)}
            className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-2 justify-end w-full"
          >
            <Plus className="w-5 h-5" />
            إضافة ملف جديد
          </button>
        </div>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-700 font-medium">تم حفظ الملف بنجاح</p>
        </div>
      )}

      {showForm && (
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            إضافة ملف متابعة وتطوير جديد
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">اختر المتطوع</label>
              <select
                value={form.volunteerId}
                onChange={e => setForm({ ...form, volunteerId: e.target.value })}
                className="input-field w-full"
              >
                <option value="">-- اختر متطوع --</option>
                {volunteers.map(vol => (
                  <option key={vol.id} value={vol.id}>{vol.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">مستوى المشاركة</label>
                <select value={form.participationLevel} onChange={e => setForm({ ...form, participationLevel: e.target.value as ParticipationLevel })} className="input-field w-full">
                  {participationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الالتزام</label>
                <select value={form.commitmentLevel} onChange={e => setForm({ ...form, commitmentLevel: e.target.value as CommitmentLevel })} className="input-field w-full">
                  {commitmentOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">العمل الجماعي</label>
                <select value={form.teamwork} onChange={e => setForm({ ...form, teamwork: e.target.value as TeammateStatus })} className="input-field w-full">
                  {teamworkOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">مهارات التواصل</label>
                <select value={form.communicationSkills} onChange={e => setForm({ ...form, communicationSkills: e.target.value as CommunicationSkill })} className="input-field w-full">
                  {communicationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الإمكانيات القيادية</label>
              <select value={form.leadershipPotential} onChange={e => setForm({ ...form, leadershipPotential: e.target.value as LeadershipPotential })} className="input-field w-full">
                {leadershipOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نقاط القوة</label>
              <textarea
                value={form.strengths}
                onChange={e => setForm({ ...form, strengths: e.target.value })}
                className="input-field w-full h-20"
                placeholder="وصف نقاط القوة..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">مجالات التطوير</label>
              <textarea
                value={form.areasForImprovement}
                onChange={e => setForm({ ...form, areasForImprovement: e.target.value })}
                className="input-field w-full h-20"
                placeholder="وصف المجالات التي تحتاج تطوير..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات الفعالية</label>
              <textarea
                value={form.eventNotes}
                onChange={e => setForm({ ...form, eventNotes: e.target.value })}
                className="input-field w-full h-20"
                placeholder="ملاحظات من قيادي الفعالية..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات لجنة المتابعة (سرية)</label>
              <textarea
                value={form.followUpCommitteeNotes}
                onChange={e => setForm({ ...form, followUpCommitteeNotes: e.target.value })}
                className="input-field w-full h-20"
                placeholder="ملاحظات داخلية للجنة..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">التوصيات</label>
              <div className="grid grid-cols-2 gap-2">
                {recommendationOptions.map(rec => (
                  <button
                    key={rec}
                    onClick={() => handleRecommendationToggle(rec)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      form.recommendations.includes(rec)
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {rec}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                حفظ الملف
              </button>
              <button onClick={() => setShowForm(false)} className="btn-secondary">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Profiles */}
      <div className="space-y-3">
        {followUpProfiles.map(profile => {
          const volunteer = volunteers.find(v => v.id === profile.volunteerId);
          return (
            <div key={profile.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{volunteer?.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{profile.participationLevel} • {profile.commitmentLevel}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {profile.recommendations.map(rec => (
                      <span key={rec} className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded font-medium">{rec}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">آخر تحديث</p>
                  <p className="text-sm font-semibold text-gray-700">{profile.lastUpdated}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

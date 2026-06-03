import { useState } from 'react';
import { QrCode, CheckCircle2, XCircle, AlertCircle, Clock, MapPin, Users } from 'lucide-react';
import { events, volunteers, attendanceRecords, type UserRole } from '../data';
import { getAuthContext, filterEventsByRole } from '../utils/permissions';

interface AttendancePageProps {
  userId: string;
  role: UserRole;
}

interface ScannedAttendance {
  volunteerId: string;
  volunteerName: string;
  timestamp: string;
  status: 'present' | 'absent' | 'excused';
}

export default function AttendancePage({ userId, role }: AttendancePageProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [qrInput, setQrInput] = useState('');
  const [scannedList, setScannedList] = useState<ScannedAttendance[]>([]);
  const [scanStatus, setScanStatus] = useState<'success' | 'error' | null>(null);
  const [scanMessage, setScanMessage] = useState('');

  const auth = getAuthContext(userId);
  const currentEvent = selectedEventId ? events.find(e => e.id === selectedEventId) : null;

  const handleQRScan = () => {
    if (!currentEvent) {
      setScanStatus('error');
      setScanMessage('يرجى اختيار فعالية أولاً');
      return;
    }

    const trimmedInput = qrInput.trim();
    if (!trimmedInput) {
      setScanStatus('error');
      setScanMessage('يرجى إدخال رمز QR');
      return;
    }

    const volunteer = volunteers.find(v => v.qrCode === trimmedInput);

    if (!volunteer) {
      setScanStatus('error');
      setScanMessage('رمز QR غير صحيح أو متطوع غير موجود');
      setQrInput('');
      return;
    }

    const isEventForVolunteer = volunteer.sectorId === currentEvent.sectorId && volunteer.neighborhoodId === currentEvent.neighborhoodId;
    if (!isEventForVolunteer) {
      setScanStatus('error');
      setScanMessage('المتطوع غير مسجل في هذه الفعالية');
      setQrInput('');
      return;
    }

    const already = scannedList.find(s => s.volunteerId === volunteer.id);
    if (already) {
      setScanStatus('error');
      setScanMessage('تم فحص هذا المتطوع مسبقاً');
      setQrInput('');
      return;
    }

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setScannedList([...scannedList, {
      volunteerId: volunteer.id,
      volunteerName: volunteer.name,
      timestamp,
      status: 'present',
    }]);

    setScanStatus('success');
    setScanMessage(`تم تسجيل حضور ${volunteer.name}`);
    setQrInput('');

    setTimeout(() => setScanStatus(null), 2000);
  };

  const handleRemove = (volunteerId: string) => {
    setScannedList(scannedList.filter(s => s.volunteerId !== volunteerId));
  };

  const handleStatusChange = (volunteerId: string, newStatus: 'present' | 'absent' | 'excused') => {
    setScannedList(scannedList.map(s => s.volunteerId === volunteerId ? { ...s, status: newStatus } : s));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQRScan();
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">تسجيل الحضور عبر رمز QR</h2>
        <p className="text-gray-500 text-sm mt-0.5">امسح رموز QR المتطوعين لتسجيل حضورهم في الفعالية</p>
      </div>

      <div className="card p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">اختر الفعالية</label>
          <select
            value={selectedEventId || ''}
            onChange={e => {
              setSelectedEventId(e.target.value || null);
              setScannedList([]);
            }}
            className="input-field w-full"
          >
            <option value="">-- اختر فعالية --</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.title} · {event.date} · {event.location}
              </option>
            ))}
          </select>
        </div>

        {currentEvent && (
          <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <p className="text-gray-500 text-xs">الفعالية</p>
                <p className="text-gray-800 font-semibold text-sm">{currentEvent.title}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">التاريخ</p>
                <p className="text-gray-800 font-semibold text-sm">{currentEvent.date}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">المكان</p>
                <p className="text-gray-800 font-semibold text-sm truncate">{currentEvent.location}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">المتطوعون المسجلون</p>
                <p className="text-gray-800 font-semibold text-sm">{currentEvent.volunteersRegistered}</p>
              </div>
            </div>
          </div>
        )}

        {currentEvent && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">رمز QR</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <QrCode className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="امسح رمز QR أو أدخل الكود يدويًا..."
                  value={qrInput}
                  onChange={e => setQrInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="input-field pr-10 w-full"
                  autoFocus
                />
              </div>
              <button
                onClick={handleQRScan}
                className="btn-primary px-6"
              >
                تسجيل
              </button>
            </div>

            {scanStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-green-700 text-sm font-medium">{scanMessage}</p>
              </div>
            )}
            {scanStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm font-medium">{scanMessage}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {scannedList.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600" />
              المتطوعون المسجلون ({scannedList.length})
            </h3>
            <button
              onClick={() => setScannedList([])}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              مسح الكل
            </button>
          </div>

          <div className="space-y-2">
            {scannedList.map(att => (
              <div key={att.volunteerId} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="text-gray-800 font-medium text-sm">{att.volunteerName}</p>
                  <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {att.timestamp}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={att.status}
                    onChange={e => handleStatusChange(att.volunteerId, e.target.value as 'present' | 'absent' | 'excused')}
                    className="text-xs px-2 py-1 rounded border border-gray-200 bg-white"
                  >
                    <option value="present">حاضر</option>
                    <option value="absent">غائب</option>
                    <option value="excused">بعذر</option>
                  </select>

                  <button
                    onClick={() => handleRemove(att.volunteerId)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-primary w-full mt-4">
            حفظ سجل الحضور
          </button>
        </div>
      )}

      {!currentEvent && (
        <div className="card text-center py-12 bg-gray-50">
          <QrCode className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">اختر فعالية لبدء تسجيل الحضور</p>
        </div>
      )}
    </div>
  );
}

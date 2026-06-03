import { Shield, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import { type UserRole } from '../data';

interface LoginPageProps {
  onLogin: (role: UserRole, userId: string) => void;
}

const DEMO_ACCOUNTS = [
  { username: 'gov', password: 'gov123', userId: 'u_gov', role: 'governorate_supervisor' as const, label: 'المشرف على المحافظة' },
  { username: 'director', password: 'dir123', userId: 'u_dir', role: 'unit_director' as const, label: 'مدير الوحدة' },
  { username: 'eval', password: 'eval123', userId: 'u_eval', role: 'evaluation_committee' as const, label: 'لجنة التقييم' },
  { username: 'sector', password: 'sec123', userId: 'u1', role: 'sector_manager' as const, label: 'مدير قطاع' },
  { username: 'coord', password: 'coord123', userId: 'u5', role: 'neighborhood_coordinator' as const, label: 'منسق حي' },
  { username: 'volunteer', password: 'vol123', userId: 'v1', role: 'volunteer' as const, label: 'متطوع' },
];

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const account = DEMO_ACCOUNTS.find(a => a.username === username && a.password === password);
      if (account) {
        onLogin(account.role, account.userId);
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
      setLoading(false);
    }, 800);
  };

  const quickLogin = (account: typeof DEMO_ACCOUNTS[0]) => {
    setUsername(account.username);
    setPassword(account.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-xl mb-4">
            <Shield className="w-10 h-10 text-teal-700" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">صندوق الإسكندرية</h1>
          <h2 className="text-lg font-semibold text-teal-200">لمكافحة المخدرات</h2>
          <p className="text-teal-300 text-sm mt-2">نظام إدارة المتطوعين</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">تسجيل الدخول</h3>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">اسم المستخدم</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="input-field"
                placeholder="أدخل اسم المستخدم"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field pl-12"
                  placeholder="أدخل كلمة المرور"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center mb-3">حسابات تجريبية للعرض</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map(account => (
                <button
                  key={account.username}
                  onClick={() => quickLogin(account)}
                  className="text-center p-2 rounded-lg border border-teal-200 hover:bg-teal-50 hover:border-teal-400 transition-all"
                >
                  <p className="text-xs font-semibold text-teal-700">{account.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{account.username}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-teal-300 text-xs mt-6">
          جميع الحقوق محفوظة © {new Date().getFullYear()} صندوق الإسكندرية لمكافحة المخدرات
        </p>
      </div>
    </div>
  );
}

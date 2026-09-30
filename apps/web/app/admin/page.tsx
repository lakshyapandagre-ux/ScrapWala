'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Recycle, 
  ShieldCheck, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useI18n, Language } from '@/lib/i18n';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { MineralsDashboard } from '@/components/admin/MineralsDashboard';

function AdminContent() {
  const router = useRouter();
  const { profile, logout } = useAuth();
  const { lang, setLang, t } = useI18n();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <div className="min-h-screen bg-[#E9EFEA] text-[#14181A] flex flex-col items-center justify-start sm:py-3">
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 flex-1 space-y-4">
        {/* Top Header */}
        <header className="w-full bg-white rounded-2xl border border-gray-200 px-4 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2E7D1F] text-white flex items-center justify-center shadow-xs">
              <Recycle size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-[#14181A]">
                  {t.brandName}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EFFAEB] text-[#2E7D1F] font-mono font-bold border border-[#D5EED1]">
                  MINISTRY PORTAL
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 p-0.5 rounded-full border border-gray-200 text-xs font-bold">
              {(['en', 'hi', 'mr'] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-full uppercase transition-all ${
                    lang === l ? 'bg-[#2E7D1F] text-white shadow-2xs' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title={t.logout}
              className="p-2 rounded-full bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 transition-all"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Officer Department Card */}
        <div className="p-4 rounded-2xl bg-white border border-gray-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#2E7D1F] flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#14181A]">
                {profile?.department || 'खान मंत्रालय (Ministry of Mines), भारत सरकार'}
              </h3>
              <p className="text-xs text-gray-500">
                {profile?.fullName || 'डॉ. संजय मेहता'} ({profile?.designation || 'निदेशक - क्रिटिकल मिनरल'})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              await logout();
              router.replace('/login');
            }}
            className="text-xs font-bold text-[#2E7D1F] bg-[#EFFAEB] px-3 py-1.5 rounded-xl border border-[#D9F5D0] hover:bg-[#E2F7DE] transition-colors"
          >
            {t.switchRole}
          </button>
        </div>

        {/* Live Ministry of Mines Critical Minerals Dashboard */}
        <MineralsDashboard />
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <RouteGuard allowedRoles={['admin']}>
      <AdminContent />
    </RouteGuard>
  );
}

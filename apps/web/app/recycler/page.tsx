'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Recycle, 
  Building2, 
  LogOut, 
  Globe, 
  ChevronDown, 
  X,
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useI18n, Language } from '@/lib/i18n';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { RecyclerPortal } from '@/components/recycler/RecyclerPortal';
import { BottomNav } from '@/components/navigation/BottomNav';

function RecyclerContent() {
  const router = useRouter();
  const { profile, logout } = useAuth();
  const { lang, setLang, t } = useI18n();
  const [activeTab, setActiveTab] = useState<'home' | 'lots' | 'history' | 'profile'>('home');
  const [isLangSheetOpen, setIsLangSheetOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <div className="min-h-screen bg-[#E9EFEA] text-[#14181A] flex flex-col items-center justify-start sm:py-3">
      <div className="w-full max-w-[440px] bg-[#F6F8F6] min-h-screen sm:min-h-[92vh] sm:rounded-[36px] sm:border sm:border-gray-200/90 sm:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] overflow-x-hidden relative flex flex-col">
        {/* Top Header */}
        <header className="w-full bg-white text-[#14181A] sticky top-0 z-50 border-b border-[#E9EFEA] shadow-xs">
          <div className="w-full px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#2E7D1F] text-white flex items-center justify-center shadow-xs shrink-0">
                <Building2 size={18} className="text-white" />
              </div>
              <div>
                <span className="font-black text-base tracking-tight text-[#14181A] block leading-tight">
                  {t.brandName}
                </span>
                <span className="text-[9px] font-bold text-[#2E7D1F] uppercase tracking-wider block">
                  रीसाइक्लिंग केंद्र (Recycler)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsLangSheetOpen(true)}
                className="flex items-center gap-1 h-8 px-2.5 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-800"
              >
                <Globe size={14} className="text-[#2E7D1F]" />
                {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिंदी' : 'मराठी'}
                <ChevronDown size={12} className="text-gray-400" />
              </button>

              <button
                type="button"
                onClick={handleLogout}
                title={t.logout}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 flex items-center justify-center transition-colors"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </header>

        {/* Recycler Facility Badge Banner */}
        <div className="p-3 bg-emerald-50 border-b border-emerald-100 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#2E7D1F] text-white flex items-center justify-center shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#14181A] truncate">
                {profile?.facilityName || 'E-Parisaraa Clean Tech Pvt. Ltd.'}
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                SPCB: {profile?.spcbLicense || 'MPPCB/E-WASTE/AUTH/2024/089'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              await logout();
              router.replace('/login');
            }}
            className="text-[10px] font-bold text-[#2E7D1F] bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs hover:bg-emerald-50 shrink-0"
          >
            {t.switchRole}
          </button>
        </div>

        {/* Main Recycler Dashboard View */}
        <main className="flex-1 p-3 pb-24">
          <RecyclerPortal />
        </main>

        {/* Bottom Nav */}
        <BottomNav
          role="recycler"
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as any)}
          onFabClick={() => setActiveTab('lots')}
        />
      </div>

      {/* Language Bottom Sheet */}
      {isLangSheetOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsLangSheetOpen(false)} />
          <div className="relative bg-white rounded-t-3xl shadow-2xl p-4 animate-in slide-in-from-bottom pb-8 max-w-[440px] mx-auto w-full">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-xl font-bold text-gray-900">भाषा चुनें / Language</h2>
              <button onClick={() => setIsLangSheetOpen(false)} className="p-2 -mr-2 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {[
                { code: 'hi', label: 'हिंदी' },
                { code: 'mr', label: 'मराठी' },
                { code: 'en', label: 'English' }
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code as Language); setIsLangSheetOpen(false); }}
                  className={`w-full h-14 px-4 flex items-center justify-between rounded-2xl border transition-all ${
                    lang === l.code 
                      ? 'bg-[#EFFAEB] border-[#D9F5D0]' 
                      : 'bg-white border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <span className={`text-base font-semibold ${lang === l.code ? 'text-[#2E7D1F]' : 'text-gray-700'}`}>
                    {l.label}
                  </span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    lang === l.code ? 'border-[#2E7D1F]' : 'border-gray-300'
                  }`}>
                    {lang === l.code && <div className="w-2.5 h-2.5 rounded-full bg-[#2E7D1F]" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RecyclerPage() {
  return (
    <RouteGuard allowedRoles={['recycler']}>
      <RecyclerContent />
    </RouteGuard>
  );
}

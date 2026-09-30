'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Package, 
  CreditCard, 
  ShieldAlert, 
  Users, 
  MapPin, 
  Globe, 
  Volume2, 
  Lock, 
  LogOut, 
  ChevronRight,
  Star,
  RefreshCw,
  Check,
  RefreshCcw
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useI18n } from '@/lib/i18n';
import { useGeolocation } from '@/lib/hooks/useGeolocation';
import { LocationPermissionBanner } from '../ui/LocationPermissionBanner';

export const CollectorProfile: React.FC<{
  onOpenSafety?: () => void;
  onOpenMyLots?: () => void;
}> = ({ onOpenSafety, onOpenMyLots }) => {
  const router = useRouter();
  const { profile, logout } = useAuth();
  const { lang, t } = useI18n();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [sahayakActive, setSahayakActive] = useState(false);

  // GPS Location Update State
  const geo = useGeolocation();
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'updating' | 'success' | 'error'>('idle');
  const [currentCity, setCurrentCity] = useState(profile?.operatingCity || 'Indore');

  const handleUpdateLocation = () => {
    setUpdateStatus('updating');
    geo.detect();
  };

  React.useEffect(() => {
    if (geo.status === 'success' && geo.lat && geo.lng) {
      const patchProfile = async () => {
        try {
          const cityToSet = geo.locality || currentCity || 'Indore';
          const colId = profile?.id || 'c1111111-1111-1111-1111-111111111111';
          const res = await fetch(`/api/collectors/${colId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              gps_lat: geo.lat,
              gps_lng: geo.lng,
              operating_city: cityToSet,
            }),
          });
          if (res.ok) {
            setCurrentCity(cityToSet);
            setUpdateStatus('success');
            setTimeout(() => setUpdateStatus('idle'), 4000);
          }
        } catch {
          setUpdateStatus('error');
        }
      };
      patchProfile();
    }
  }, [geo.status, geo.lat, geo.lng, geo.locality]);

  const displayName = profile?.fullName || (lang === 'hi' ? 'कबाड़ी साथी' : lang === 'mr' ? 'कबाडी मित्र' : 'Scrap Partner');
  const displayContact = profile?.phone || profile?.email || (lang === 'hi' ? 'सत्यापित उपयोगकर्ता' : lang === 'mr' ? 'सत्यापित वापरकर्ता' : 'Verified User');
  const avatarLetter = (displayName.trim()[0] || 'S').toUpperCase();

  return (
    <div className="space-y-4 pb-28">
      {/* 180px Dark Green Gradient Header */}
      <div
        className="p-5 pt-6 pb-6 rounded-3xl text-white shadow-sm flex items-center gap-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0B3D2E 0%, #0F5A43 100%)',
        }}
      >
        <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white shrink-0 text-2xl font-black shadow-md">
          {avatarLetter}
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white leading-tight">
            {displayName}
          </h2>
          <p className="text-xs text-[#D9F5D0] mt-0.5 font-medium">
            {displayContact}
          </p>
          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#2E7D1F] text-white text-[10px] font-bold">
            {t.registeredCollector} ({profile?.operatingCity || 'Indore'})
          </span>
        </div>
      </div>

      {/* Sahayak Mode Warning Strip (if active) */}
      {sahayakActive && (
        <div className="p-3 rounded-2xl bg-[#FFFBEB] border border-amber-300 text-xs text-amber-900 font-semibold flex items-center justify-between">
          <span>
            {lang === 'hi'
              ? 'सहायक मोड सक्रिय: आप साथी कबाड़ी के लिए लॉट बना रहे हैं'
              : lang === 'mr'
              ? 'सहाय्यक मोड सुरू: आपण इतर मित्रांसाठी लॉट तयार करत आहात'
              : 'Sahayak Mode Active: Assisting fellow informal collector'}
          </span>
          <button
            type="button"
            onClick={() => setSahayakActive(false)}
            className="text-[11px] underline font-bold"
          >
            {lang === 'hi' ? 'हटाएं' : lang === 'mr' ? 'काढा' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* 2x2 Quick Action Tiles */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onOpenMyLots}
          className="p-3.5 rounded-2xl bg-white border border-gray-200/90 hover:border-[#2E7D1F]/40 text-left transition-all active:scale-95 shadow-2xs"
        >
          <div className="w-9 h-9 rounded-xl bg-[#EFFAEB] text-[#2E7D1F] flex items-center justify-center mb-2">
            <Package size={18} />
          </div>
          <span className="text-xs font-bold text-[#14181A] block">{t.myLots}</span>
          <span className="text-[11px] text-gray-500 block font-medium">{t.activeAndHistory}</span>
        </button>

        <div className="p-3.5 rounded-2xl bg-white border border-gray-200/90 text-left shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0B4F9C] flex items-center justify-center mb-2">
            <CreditCard size={18} />
          </div>
          <span className="text-xs font-bold text-[#14181A] block">{t.payoutAccount}</span>
          <span className="text-[11px] text-gray-500 block font-medium">{t.cashOrUpi}</span>
        </div>

        <button
          type="button"
          onClick={onOpenSafety}
          className="p-3.5 rounded-2xl bg-white border border-gray-200/90 hover:border-[#2E7D1F]/40 text-left transition-all active:scale-95 shadow-2xs"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2">
            <ShieldAlert size={18} />
          </div>
          <span className="text-xs font-bold text-[#14181A] block">{t.safetyRules}</span>
          <span className="text-[11px] text-gray-500 block font-medium">{t.zeroAcidRisk}</span>
        </button>

        <button
          type="button"
          onClick={() => setSahayakActive(prev => !prev)}
          className={`p-3.5 rounded-2xl border text-left transition-all active:scale-95 shadow-2xs ${
            sahayakActive
              ? 'bg-[#EFFAEB] border-[#2E7D1F]'
              : 'bg-white border-gray-200/90 hover:border-[#2E7D1F]/40'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-2">
            <Users size={18} />
          </div>
          <span className="text-xs font-bold text-[#14181A] block">
            {lang === 'hi' ? 'सहायक मोड' : lang === 'mr' ? 'सहाय्यक मोड' : 'Sahayak Mode'}
          </span>
          <span className="text-[11px] text-gray-500 block font-medium">
            {sahayakActive
              ? (lang === 'hi' ? 'सक्रिय है' : lang === 'mr' ? 'सुरू आहे' : 'Active')
              : (lang === 'hi' ? 'सक्षम करें' : lang === 'mr' ? 'सुरू करा' : 'Enable')}
          </span>
        </button>
      </div>

      {/* Rating Row */}
      <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-amber-200 flex items-center justify-between text-xs text-amber-900 shadow-2xs">
        <div className="flex items-center gap-2">
          <Star size={16} className="text-[#F5B301] fill-[#F5B301]" />
          <span className="font-semibold">
            {lang === 'hi' ? 'कबाड़ी विश्वसनीयता रेटिंग:' : lang === 'mr' ? 'विश्वासार्हता रेटिंग:' : 'Collector Trust Rating:'}
          </span>
        </div>
        <span className="font-black text-sm tabular-nums">4.8 / 5.0 (24 Lots)</span>
      </div>

      {/* Grouped Account Settings */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-1">
          {lang === 'hi' ? 'खाता सेटिंग्स' : lang === 'mr' ? 'खाते सेटिंग्ज' : 'Account Settings'}
        </span>

        <div className="rounded-2xl bg-white border border-gray-200/90 divide-y divide-gray-100 overflow-hidden text-xs shadow-2xs">
          <div className="p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-[#14181A]">
                <MapPin size={16} className="text-[#2E7D1F]" />
                <div>
                  <span className="font-bold block">
                    {lang === 'hi' ? 'कार्य क्षेत्र / जीपीएस' : lang === 'mr' ? 'कार्य क्षेत्र' : 'Operating City / GPS'}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {currentCity} {geo.lat ? `• ${geo.lat.toFixed(3)}, ${geo.lng?.toFixed(3)}` : ''}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleUpdateLocation}
                disabled={geo.status === 'locating'}
                className="px-3 py-1.5 rounded-full bg-[#EFFAEB] hover:bg-[#E0F5DA] text-[#2E7D1F] border border-[#D0EBD2] text-xs font-extrabold flex items-center gap-1 active:scale-95 transition-all shadow-2xs disabled:opacity-60"
              >
                <RefreshCw size={12} className={geo.status === 'locating' ? 'animate-spin' : ''} />
                <span>{geo.status === 'locating' ? 'पहचान रहे हैं...' : 'स्थान अपडेट करें'}</span>
              </button>
            </div>

            {updateStatus === 'success' && (
              <div className="p-2.5 rounded-xl bg-[#EFFAEB] border border-[#C5EBC2] text-[#2E7D1F] text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                <Check size={14} strokeWidth={3} />
                <span>स्थान सफलतापूर्वक अपडेट हुआ: {currentCity}</span>
              </div>
            )}

            <LocationPermissionBanner
              status={geo.status}
              errorMsg={geo.errorMsg}
              errorType={geo.errorType}
              onRetry={handleUpdateLocation}
            />
          </div>

          <div className="p-3.5 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-2.5 text-[#14181A]">
              <Globe size={16} className="text-[#2E7D1F]" />
              <span>{t.appLanguage}</span>
            </div>
            <span className="text-gray-500 flex items-center gap-1 font-medium uppercase font-mono font-bold">
              {lang} <ChevronRight size={14} />
            </span>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-[#14181A]">
              <Volume2 size={16} className="text-[#2E7D1F]" />
              <span>{t.voiceAssistance}</span>
            </div>
            <input
              type="checkbox"
              checked={audioEnabled}
              onChange={(e) => setAudioEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-[#2E7D1F] focus:ring-[#2E7D1F] cursor-pointer"
            />
          </div>

          <div className="p-3.5 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-2.5 text-[#14181A]">
              <Lock size={16} className="text-[#2E7D1F]" />
              <span>{lang === 'hi' ? 'डेटा व गोपनीयता' : lang === 'mr' ? 'डेटा आणि गोपनीयता' : 'Privacy & Data'}</span>
            </div>
            <ChevronRight size={14} className="text-gray-400" />
          </div>

          <div 
            onClick={async () => {
              await logout();
              router.replace('/login');
            }}
            className="p-3.5 flex items-center justify-between hover:bg-emerald-50 text-[#2E7D1F] cursor-pointer font-bold transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <RefreshCcw size={16} />
              <span>{t.switchRole}</span>
            </div>
            <ChevronRight size={14} className="text-[#2E7D1F]" />
          </div>

          <div 
            onClick={async () => {
              const msg = lang === 'hi' ? 'क्या आप लॉग आउट करना चाहते हैं?' : lang === 'mr' ? 'तुम्हाला लॉग आउट करायचे आहे का?' : 'Are you sure you want to log out?';
              if (window.confirm(msg)) {
                await logout();
                router.replace('/login');
              }
            }}
            className="p-3.5 flex items-center justify-between hover:bg-red-50 text-red-600 cursor-pointer font-bold transition-colors active:bg-red-100"
          >
            <div className="flex items-center gap-2.5">
              <LogOut size={16} />
              <span>{t.logout}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

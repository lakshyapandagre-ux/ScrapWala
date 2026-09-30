'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Recycle, 
  ArrowRight, 
  Globe,
  ChevronDown,
  X,
  Camera
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useI18n, Language } from '@/lib/i18n';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { VoiceSheet } from '@/components/ai/VoiceSheet';
import { HeroHeader } from '@/components/collector/HeroHeader';
import { TrendingGrid } from '@/components/home/TrendingGrid';
import { BulkScrapSection } from '@/components/home/BulkScrapSection';
import { LotWizard } from '@/components/lot-wizard/LotWizard';
import { OfflineLotList } from '@/components/collector/OfflineLotList';
import { RatesListScreen } from '@/components/rates/RatesListScreen';
import { EarningsView } from '@/components/earnings/EarningsView';
import { CollectorProfile } from '@/components/profile/CollectorProfile';
import { BottomNav } from '@/components/navigation/BottomNav';
import { SafetySheet } from '@/components/safety/SafetySheet';
import { WasteDetectionScanner } from '@/components/ai/WasteDetectionScanner';
import { useGeolocation } from '@/lib/hooks/useGeolocation';
import { LocationPermissionBanner } from '@/components/ui/LocationPermissionBanner';

function CollectorContent() {
  const { profile } = useAuth();
  const { lang, setLang, t } = useI18n();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<'home' | 'rates' | 'earnings' | 'profile' | 'lots' | 'history'>('home');
  const [isSellWizardOpen, setIsSellWizardOpen] = useState(false);
  const [isAiScannerOpen, setIsAiScannerOpen] = useState(false);
  const [isSafetySheetOpen, setIsSafetySheetOpen] = useState(false);
  const [safetyCategory, setSafetyCategory] = useState('सर्किट बोर्ड व बैटरी');
  const [scrolled, setScrolled] = useState(false);
  const [isLangSheetOpen, setIsLangSheetOpen] = useState(false);
  const [isVoiceSheetOpen, setIsVoiceSheetOpen] = useState(false);

  // Auto GPS location detection for Collector Home
  const { status, errorMsg, errorType, detect, locality } = useGeolocation();

  useEffect(() => {
    if (!profile?.gps_lat) {
      detect();
    }
  }, [profile?.gps_lat, detect]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 4);
    };
    const handleVoiceNav = () => {
      setIsSellWizardOpen(true);
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('open-sell-wizard', handleVoiceNav);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('open-sell-wizard', handleVoiceNav);
    };
  }, []);

  // Handle URL query parameters (e.g., /collector?tab=sell&category=PCBs)
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'sell') {
      setIsSellWizardOpen(true);
    } else if (tabParam && ['home', 'rates', 'earnings', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  const handleOpenSafety = (catName: string = 'सर्किट बोर्ड व बैटरी') => {
    setSafetyCategory(catName);
    setIsSafetySheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#E9EFEA] text-[#14181A] flex flex-col items-center justify-start sm:py-3">
      <div className="w-full max-w-[440px] bg-[#F6F8F6] min-h-screen sm:min-h-[92vh] sm:rounded-[36px] sm:border sm:border-gray-200/90 sm:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] overflow-x-hidden relative flex flex-col">
        {/* Top Header */}
        <header className={`w-full bg-white text-[#14181A] sticky top-0 z-50 transition-shadow duration-200 border-b border-[#E9EFEA] ${scrolled ? 'shadow-sm' : ''}`}>
          <div className="w-full px-4 h-14 flex items-center justify-between">
            {/* Left: Logo + ScrapWala wordmark */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#2E7D1F] text-white flex items-center justify-center shadow-xs shrink-0">
                <Recycle size={18} className="text-white" />
              </div>
              <span className="font-black text-lg tracking-tight text-[#14181A]">
                {t.brandName}
              </span>
            </div>

            {/* Right: Language + Avatar */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsLangSheetOpen(true)}
                className="flex items-center gap-1.5 h-9 px-3 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-800"
              >
                <Globe size={16} className="text-[#2E7D1F]" />
                {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'मराठी'}
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              
              <button 
                onClick={() => setActiveTab('profile')} 
                className="w-9 h-9 rounded-full bg-[#E2F7DE] flex items-center justify-center text-[#2E7D1F] font-semibold text-sm shrink-0"
              >
                {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'L'}
              </button>
            </div>
          </div>
        </header>

        {/* Full-screen AI Waste Scanner Modal */}
        {isAiScannerOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl">
              <WasteDetectionScanner
                standalone
                onClose={() => setIsAiScannerOpen(false)}
                onMaterialSelected={() => {
                  setIsAiScannerOpen(false);
                  setActiveTab('rates');
                }}
              />
            </div>
          </div>
        )}

        {isSellWizardOpen ? (
          /* Full-screen Sell Flow Wizard */
          <LotWizard
            onComplete={() => {
              setIsSellWizardOpen(false);
              setActiveTab('earnings');
            }}
            onCancel={() => setIsSellWizardOpen(false)}
          />
        ) : (
          /* Tab Content */
          <main className="flex-1 pb-24">
            {/* TAB 1: HOME */}
            {activeTab === 'home' && (
              <div className="space-y-4">
                {/* Hero Header with Indian Kabadiwala Mascot & Live Location Pill */}
                <HeroHeader
                  locality={locality ?? profile?.operatingCity ?? 'Indore'}
                  onLocationClick={detect}
                  onSellClick={() => setIsSellWizardOpen(true)}
                  status={status}
                  isLocating={status === 'locating'}
                />

                {/* Location Permission / Error Banner */}
                <div className="px-4">
                  <LocationPermissionBanner
                    status={status}
                    errorMsg={errorMsg}
                    errorType={errorType}
                    onRetry={detect}
                  />
                </div>

                {/* AI Waste Camera Scan Feature Banner */}
                <div className="px-4">
                  <button
                    type="button"
                    onClick={() => setIsAiScannerOpen(true)}
                    className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#14181A] via-[#1E2529] to-[#2E7D1F] text-white flex items-center justify-between shadow-md active:scale-[0.99] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                        <Camera size={24} />
                      </div>
                      <div className="text-left space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black tracking-tight">AI Waste Scanner</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-md">
                            YOLO11n
                          </span>
                        </div>
                        <p className="text-xs text-white/70">
                          {lang === 'hi' ? 'फोटो खींचकर कबाड़ की पहचान व सही भाव जानें' : 'Scan scrap photo to detect items & get best deals'}
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 group-hover:translate-x-1 transition-transform">
                      <ArrowRight size={16} />
                    </div>
                  </button>
                </div>

                <div className="px-4 space-y-6 pb-6">
                  {/* Section 1: Trending Scrap Rates */}
                  <TrendingGrid onItemClick={() => setIsSellWizardOpen(true)} />

                  {/* Section 2: Sell Bulk Scrap & Vehicle Scrapping */}
                  <BulkScrapSection onSellClick={() => setIsSellWizardOpen(true)} />

                  {/* Section 3: Offline-First Lots Summary */}
                  <OfflineLotList />
                </div>
              </div>
            )}

            {/* TAB 2: RATES LIST */}
            {activeTab === 'rates' && (
              <div className="p-4 pt-5">
                <RatesListScreen onSellClick={() => setIsSellWizardOpen(true)} />
              </div>
            )}

            {/* TAB 3: EARNINGS */}
            {activeTab === 'earnings' && (
              <div className="p-4 pt-5">
                <EarningsView />
              </div>
            )}

            {/* TAB 4: PROFILE */}
            {activeTab === 'profile' && (
              <div className="p-4 pt-5">
                <CollectorProfile
                  onOpenSafety={() => handleOpenSafety('कबाड़ सुरक्षा नियम')}
                  onOpenMyLots={() => setActiveTab('earnings')}
                />
              </div>
            )}
          </main>
        )}

        {/* Floating Bottom Nav for Collector */}
        {!isSellWizardOpen && (
          <BottomNav
            role="collector"
            activeTab={activeTab}
            onTabChange={(tab) => {
              if (tab === 'sell') {
                setIsSellWizardOpen(true);
              } else {
                setActiveTab(tab as any);
              }
            }}
            onFabClick={() => setIsVoiceSheetOpen(true)}
          />
        )}
      </div>

      {/* Safety Sheet Modal */}
      <SafetySheet
        category={safetyCategory}
        isOpen={isSafetySheetOpen}
        onClose={() => setIsSafetySheetOpen(false)}
      />

      <VoiceSheet
        open={isVoiceSheetOpen}
        isOpen={isVoiceSheetOpen}
        onClose={() => setIsVoiceSheetOpen(false)}
        collectorId={profile?.id || 'COLLECTOR_01'}
      />

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

export default function CollectorPage() {
  return (
    <RouteGuard allowedRoles={['collector']}>
      <Suspense fallback={
        <div className="min-h-screen bg-[#E9EFEA] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#2E7D1F] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <CollectorContent />
      </Suspense>
    </RouteGuard>
  );
}

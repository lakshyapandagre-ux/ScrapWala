'use client';

import React from 'react';
import { 
  Home, 
  TrendingUp, 
  Mic, 
  Wallet, 
  User, 
  QrCode, 
  Package, 
  Clock,
  ShoppingBag
} from 'lucide-react';

import { useI18n } from '@/lib/i18n';

interface BottomNavProps {
  role: 'collector' | 'recycler';
  activeTab: string;
  onTabChange: (tab: string) => void;
  onFabClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  role,
  activeTab,
  onTabChange,
  onFabClick,
}) => {
  const { t } = useI18n();

  const collectorTabs = [
    { id: 'home', label: t.homeTab, icon: Home },
    { id: 'rates', label: t.ratesTab, icon: TrendingUp },
    { id: 'fab', label: t.voiceAssistance || 'Voice', icon: Mic, isFab: true },
    { id: 'sell', label: t.sellTab, icon: ShoppingBag },
    { id: 'earnings', label: t.earningsTab, icon: Wallet },
  ];

  const recyclerTabs = [
    { id: 'home', label: t.homeTab, icon: Home },
    { id: 'lots', label: role === 'collector' ? t.earningsTab : 'Lots', icon: Package },
    { id: 'fab', label: 'Scan', icon: QrCode, isFab: true },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'profile', label: t.profileTab, icon: User },
  ];

  const tabs = role === 'collector' ? collectorTabs : recyclerTabs;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-[440px] mx-auto pointer-events-none px-3 pb-[max(12px,env(safe-area-inset-bottom))]">
      <div className="bg-white rounded-2xl sm:rounded-sheet shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200/90 px-3 py-2 flex items-center justify-around pointer-events-auto relative backdrop-blur-md">
        {tabs.map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isFab) {
            return (
              <div key={tab.id} className="relative -top-5 flex flex-col items-center">
                <button
                  type="button"
                  onClick={onFabClick}
                  aria-label={tab.label}
                  className="w-14 h-14 rounded-full bg-[#0F5A43] hover:bg-[#0B3D2E] active:scale-95 text-white shadow-[0_8px_20px_rgba(15,90,67,0.45)] ring-4 ring-white flex items-center justify-center transition-all duration-200"
                >
                  <IconComp size={26} strokeWidth={2.8} className="text-white drop-shadow-xs" />
                </button>
                <span className="text-[11px] font-extrabold text-[#0F5A43] mt-1 select-none">
                  {tab.label}
                </span>
              </div>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-150 select-none ${
                isActive
                  ? 'bg-[#EFFAEB] text-[#2E7D1F] font-bold shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900 font-medium hover:bg-gray-50'
              }`}
            >
              <IconComp 
                size={20} 
                strokeWidth={isActive ? 2.4 : 1.8} 
                className={isActive ? 'text-[#2E7D1F]' : 'text-gray-500'}
              />
              <span className={`text-[11px] mt-0.5 leading-tight ${isActive ? 'font-bold text-[#2E7D1F]' : 'font-medium text-gray-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

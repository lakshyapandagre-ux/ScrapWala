'use client';

import React from 'react';
import { Cpu, Cable, BatteryCharging, Tv, Monitor, Cog, Package, Box, FileText, Info } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface TrendingItem {
  id: string;
  name: string;
  nameHi: string;
  nameMr: string;
  price: string;
  image: string;
}

const TRENDING_ITEMS: TrendingItem[] = [
  { id: 'copper', name: 'Copper Wire', nameHi: 'तांबा तार', nameMr: 'तांब्याची वायर', price: '₹60', image: '/images/copper_wire.jpg' },
  { id: 'pcb', name: 'PCBs', nameHi: 'सर्किट बोर्ड', nameMr: 'पीसीबी', price: '₹178', image: '/images/pcb.jpg' },
  { id: 'battery', name: 'Battery', nameHi: 'बैटरी स्क्रैप', nameMr: 'बॅटरी', price: '₹110', image: '/images/battery.jpg' },
  { id: 'ms_drum', name: 'MS Drum', nameHi: 'एमएस ड्रम', nameMr: 'एमएस ड्रम', price: '₹20', image: '/images/ms_drum.jpg' },
];

export const TrendingGrid: React.FC<{ onItemClick: () => void }> = ({ onItemClick }) => {
  const { lang, t } = useI18n();

  return (
    <div className="space-y-4">
      {/* Section Heading with Trailing Thin Line (Screenshot 4 Pattern) */}
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-black text-[#14181A] tracking-tight shrink-0">
            {t.trendingRates}
          </h2>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          {t.trendingSubtitle}
        </p>
      </div>

      {/* 4-Column Grid with Real Images (Screenshot 4 Pattern) */}
      <div className="grid grid-cols-4 gap-2">
        {TRENDING_ITEMS.map((item) => {
          const displayName = lang === 'hi' ? item.nameHi : lang === 'mr' ? item.nameMr : item.name;

          return (
            <div
              key={item.id}
              onClick={onItemClick}
              className="p-2 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:border-[#2E7D1F]/50 flex flex-col items-center justify-between text-center cursor-pointer transition-all active:scale-95 select-none min-h-[114px]"
            >
              <div className="w-13 h-13 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden mb-1.5 shadow-2xs">
                <img
                  src={item.image}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="w-full">
                <span className="text-[11px] font-bold text-[#14181A] block truncate">
                  {displayName}
                </span>
                <span className="text-xs font-black text-[#2E7D1F] block mt-0.5 tabular-nums">
                  {item.price}<span className="text-[10px] text-gray-400 font-semibold">/kg</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Blue Bulk Info Banner (Screenshot 4 Pattern) */}
      <div className="p-3.5 rounded-2xl bg-[#0B4F9C] text-white flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <Info size={18} className="text-white shrink-0" />
          <p className="text-[11px] font-medium leading-tight text-white/95">
            {t.bulkInfoBanner}
          </p>
        </div>
        <button
          type="button"
          onClick={onItemClick}
          className="h-7 px-3 rounded-full bg-white text-[#0B4F9C] text-[11px] font-black shrink-0 shadow-xs active:scale-95"
        >
          {t.getBulkQuote}
        </button>
      </div>
    </div>
  );
};

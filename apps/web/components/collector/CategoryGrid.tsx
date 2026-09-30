'use client';

import React from 'react';
import { 
  Cpu, 
  Cable, 
  BatteryCharging, 
  Tv, 
  Monitor, 
  Cog, 
  Package, 
  Check 
} from 'lucide-react';
import { AudioButton } from '../audio-button/AudioButton';

export interface CategoryItem {
  id: string;
  nameHi: string;
  nameEn: string;
  icon: any;
  defaultRate: number;
  bgPastel: string;
  isHazardous?: boolean;
}

export const CATEGORIES: CategoryItem[] = [
  { id: 'PCBs', nameHi: 'सर्किट बोर्ड', nameEn: 'PCBs', icon: Cpu, defaultRate: 178, bgPastel: 'bg-cat-pcb', isHazardous: true },
  { id: 'Cables', nameHi: 'तार व केबल', nameEn: 'Cables', icon: Cable, defaultRate: 140, bgPastel: 'bg-cat-cable', isHazardous: true },
  { id: 'Batteries', nameHi: 'बैटरी व सेल', nameEn: 'Batteries', icon: BatteryCharging, defaultRate: 110, bgPastel: 'bg-cat-battery', isHazardous: true },
  { id: 'CRT Monitors', nameHi: 'सीआरटी मॉनिटर', nameEn: 'CRT Monitors', icon: Tv, defaultRate: 18, bgPastel: 'bg-cat-crt', isHazardous: true },
  { id: 'LCD Panels', nameHi: 'एलसीडी स्क्रीन', nameEn: 'LCD Panels', icon: Monitor, defaultRate: 45, bgPastel: 'bg-cat-lcd' },
  { id: 'Electric Motors', nameHi: 'मोटर / पंखे', nameEn: 'Motors', icon: Cog, defaultRate: 65, bgPastel: 'bg-cat-motor' },
  { id: 'Mixed Plastics', nameHi: 'ई-प्लास्टिक', nameEn: 'Plastics', icon: Package, defaultRate: 15, bgPastel: 'bg-cat-plastic' },
];

interface CategoryGridProps {
  selectedId: string;
  onSelect: (category: CategoryItem) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedId,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {CATEGORIES.map((cat) => {
        const IconComp = cat.icon;
        const isSelected = selectedId === cat.id;

        return (
          <div
            key={cat.id}
            onClick={() => onSelect(cat)}
            className={`relative p-3 rounded-tile cursor-pointer transition-all flex flex-col justify-between h-[120px] select-none ${
              isSelected
                ? 'border-2 border-sw-green-600 bg-sw-green-50/70 shadow-sm'
                : 'border border-sw-line bg-sw-card hover:border-sw-green-600/40'
            }`}
          >
            {/* Top Row: Radio circle & Audio */}
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-xl ${cat.bgPastel} text-sw-forest-800`}>
                <IconComp size={20} />
              </div>

              {/* 22px Radio Circle */}
              <div
                className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'border-sw-green-600 bg-sw-green-600 text-white'
                    : 'border-sw-ink-400 bg-white'
                }`}
              >
                {isSelected && <Check size={13} strokeWidth={3} />}
              </div>
            </div>

            {/* Bottom Label & Price */}
            <div>
              <span className="font-bold text-xs text-sw-ink-900 block leading-tight line-clamp-1">
                {cat.nameHi}
              </span>
              <span className="text-[11px] font-semibold text-sw-green-700 block mt-0.5 tabular-nums">
                ₹{cat.defaultRate}/kg
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Search, 
  MapPin, 
  ChevronDown, 
  Info, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { AudioButton } from '../audio-button/AudioButton';
import { CATEGORIES } from '../collector/CategoryGrid';
import { ProvenanceBadge } from '../ui/ProvenanceBadge';

export const RatesView: React.FC<{ onSellItem?: (categoryId: string) => void }> = ({
  onSellItem,
}) => {
  const [search, setSearch] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('30 दिन');

  const filteredCategories = CATEGORIES.filter((c) =>
    c.nameHi.toLowerCase().includes(search.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-28">
      {/* Title & Location Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#14181A] tracking-tight">
            आज की कीमतें (Rates)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            दैनिक सत्यापित स्क्रैप भाव और सरकारी ईपीआर दरें
          </p>
        </div>
        <AudioButton textToSpeak="आज की दैनिक कीमतें। सामान्य कबाड़ भाव से अधिकृत रीसाइक्लर पर ईपीआर बोनस मिलता है।" />
      </div>

      {/* Filter and Location Chips */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-gray-300 text-xs font-bold text-gray-800 shadow-2xs shrink-0 active:scale-95"
        >
          <MapPin size={13} className="text-[#2E7D1F]" />
          <span>इंदौर (Indore)</span>
          <ChevronDown size={13} className="text-gray-400" />
        </button>

        <div className="flex gap-1.5 shrink-0">
          {['30 दिन', '60 दिन', '90 दिन'].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDuration(d)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedDuration === d
                  ? 'bg-[#2E7D1F] text-white shadow-xs'
                  : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="कबाड़ सामग्री खोजें (Search)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-gray-300 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2E7D1F]"
        />
      </div>

      {/* Rate List Rows with Strikethrough Market vs Formal Rate Pattern */}
      <div className="space-y-2.5">
        {filteredCategories.map((cat) => {
          const IconComp = cat.icon;
          const informalRate = Math.round(cat.defaultRate * 0.85);
          const eprBonusPerKg = Math.round((cat.id === 'PCBs' ? 75 : cat.id === 'Batteries' ? 90 : 40) * 0.30);
          const formalTotalRate = cat.defaultRate + eprBonusPerKg;

          return (
            <div
              key={cat.id}
              onClick={() => onSellItem && onSellItem(cat.id)}
              className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center justify-between gap-3 hover:border-[#2E7D1F]/50 transition-all cursor-pointer select-none active:scale-[0.99]"
            >
              {/* Left Thumbnail & Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-14 h-14 rounded-2xl ${cat.bgPastel} text-[#0F5A43] flex items-center justify-center shrink-0 shadow-2xs`}>
                  <IconComp size={24} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-[#14181A] truncate">
                    {cat.nameHi}
                  </h4>
                  <span className="text-[11px] text-gray-500 font-medium block">
                    {cat.nameEn}
                  </span>
                  <div className="mt-1">
                    <ProvenanceBadge type="verified" freshness="1 घंटा पहले" />
                  </div>
                </div>
              </div>

              {/* Right: Formal Price Variant (Strikethrough Old Rate -> Bold Green Rate) */}
              <div className="text-right shrink-0">
                <div className="text-[11px] text-gray-400 line-through tabular-nums font-medium">
                  कबाड़ भाव: ₹{informalRate}
                </div>
                <div className="flex items-baseline justify-end gap-1">
                  <span className="text-xl font-black text-[#2E7D1F] tabular-nums">
                    ₹{formalTotalRate}
                  </span>
                  <span className="text-xs text-gray-500 font-semibold">/kg</span>
                </div>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF4DC] text-[#B45309] border border-[#FDE68A] tabular-nums shadow-2xs">
                  +₹{eprBonusPerKg} EPR बोनस
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Blue Info Banner Sticky above Nav */}
      <div className="p-4 rounded-2xl bg-[#0B4F9C] text-white flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Info size={20} className="shrink-0 text-white" />
          <p className="text-xs leading-snug font-medium text-white/95">
            दरें सांकेतिक हैं। सटीक भुगतान अधिकृत रीसाइक्लर वजन व जांच पर निर्भर करता है।
          </p>
        </div>
        <button
          type="button"
          onClick={() => onSellItem && onSellItem('PCBs')}
          className="h-8 px-3.5 rounded-full bg-white text-[#0B4F9C] font-extrabold text-xs shrink-0 active:scale-95 transition-all shadow-xs"
        >
          बेचें
        </button>
      </div>
    </div>
  );
};

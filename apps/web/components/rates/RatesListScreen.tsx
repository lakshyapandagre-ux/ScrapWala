'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  X, 
  ArrowRight, 
  Cable, 
  Cpu, 
  BatteryCharging, 
  Tv, 
  Monitor, 
  Cog, 
  Package, 
  FileText, 
  Box,
  Car,
  Wind,
  WashingMachine,
  MapPin,
  Navigation
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { fetchMaterials, fetchLatestRates, Material } from '@/lib/market-data';
import { useGeolocation } from '@/lib/hooks/useGeolocation';
import { LocationPermissionBanner } from '../ui/LocationPermissionBanner';

interface RateItem extends Material {
  ratePerKg: number;
  oldRate?: number;
  icon: any;
  color: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  ewaste: 'bg-emerald-50 text-emerald-700',
  metal: 'bg-orange-50 text-orange-700',
  paper: 'bg-gray-100 text-gray-700',
  plastic: 'bg-purple-50 text-purple-700',
  appliance: 'bg-blue-50 text-blue-700',
};

const getIconForSlug = (slug: string) => {
  if (slug.includes('pcb') || slug.includes('motherboard')) return Cpu;
  if (slug.includes('wire') || slug.includes('cable')) return Cable;
  if (slug.includes('battery')) return BatteryCharging;
  if (slug.includes('monitor') || slug.includes('tv')) return Tv;
  if (slug.includes('lcd')) return Monitor;
  if (slug.includes('motor')) return Cog;
  if (slug.includes('paper') || slug.includes('book')) return FileText;
  if (slug.includes('cardboard') || slug.includes('carton')) return Box;
  if (slug.includes('plastic') || slug.includes('bottle')) return Package;
  if (slug.includes('ac_unit')) return Wind;
  if (slug.includes('washing')) return WashingMachine;
  return Box;
};

export const RatesListScreen: React.FC<{ onSellClick: () => void }> = ({ onSellClick }) => {
  const { lang, t } = useI18n();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'metal' | 'ewaste' | 'paper' | 'plastic' | 'appliance'>('all');
  const [showFloatingBar, setShowFloatingBar] = useState(true);
  
  // Auto-detect GPS on mount for location-based rates
  const geo = useGeolocation(true);
  const [selectedCity, setSelectedCity] = useState<string>('Indore');

  const [rates, setRates] = useState<RateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync city when GPS locality resolves
  useEffect(() => {
    if (geo.locality) {
      const l = geo.locality.toLowerCase();
      if (l.includes('bhopal')) setSelectedCity('Bhopal');
      else if (l.includes('ujjain')) setSelectedCity('Ujjain');
      else if (l.includes('dewas')) setSelectedCity('Dewas');
      else if (l.includes('dhar') || l.includes('pithampur')) setSelectedCity('Dhar');
      else if (l.includes('mumbai')) setSelectedCity('Mumbai');
      else if (l.includes('delhi')) setSelectedCity('Delhi');
      else setSelectedCity('Indore');
    }
  }, [geo.locality]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [materialsData, ratesData] = await Promise.all([
          fetchMaterials(),
          fetchLatestRates(selectedCity)
        ]);

        const merged: RateItem[] = materialsData.map(m => {
          const rateInfo = ratesData.find(r => r.material_id === m.id || r.slug === m.slug);
          return {
            ...m,
            ratePerKg: rateInfo?.rate || 0,
            oldRate: rateInfo?.prev_rate,
            icon: getIconForSlug(m.slug),
            color: CATEGORY_COLORS[m.category] || 'bg-gray-100 text-gray-700',
          };
        }).filter(m => m.ratePerKg > 0);

        setRates(merged);
      } catch (error) {
        console.error('Failed to load rates', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [selectedCity]);

  const filtered = rates.filter((item) => {
    const itemName = lang === 'hi' ? item.name_hi : lang === 'mr' ? item.name_mr : item.name_en;
    const matchesSearch = itemName.toLowerCase().includes(search.toLowerCase()) || item.name_en.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeFilter === 'all' || item.category === activeFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4 pb-28">
      {/* Title & Schedule Pickup (Screenshot 5 Pattern) */}
      <div className="space-y-3">
        <h1 className="text-3xl font-black text-[#14181A] tracking-tight">
          {t.scrapRatesTitle}
        </h1>

        {/* City Filter & Detect Location Bar */}
        <div className="p-3 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <MapPin size={16} className="text-[#2E7D1F] shrink-0" />
              <label htmlFor="city-select" className="text-xs font-bold text-gray-700 shrink-0">
                {lang === 'hi' ? 'शहर दरें:' : lang === 'mr' ? 'शहर दर:' : 'City Rates:'}
              </label>
              <select
                id="city-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="h-9 px-2.5 rounded-xl border border-gray-300 bg-gray-50 text-xs font-extrabold text-gray-900 focus:outline-none focus:border-[#2E7D1F] flex-1 truncate"
              >
                {['Indore', 'Bhopal', 'Ujjain', 'Dewas', 'Dhar', 'Mumbai', 'Delhi'].map((c) => (
                  <option key={c} value={c}>
                    {c} {c === 'Indore' ? '(MP Base)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Detect Location Button */}
            <button
              type="button"
              onClick={geo.detect}
              disabled={geo.status === 'locating'}
              className="h-9 px-3 rounded-xl bg-[#EFFAEB] hover:bg-[#E0F5DA] text-[#2E7D1F] border border-[#D0EBD2] text-xs font-extrabold flex items-center gap-1 active:scale-95 transition-all shadow-2xs shrink-0 disabled:opacity-60"
              title="वर्तमान GPS से दरें देखें"
            >
              <Navigation size={12} className={geo.status === 'locating' ? 'animate-spin' : ''} />
              <span>{geo.status === 'locating' ? 'पहचान रहे हैं...' : '📍 Detect GPS'}</span>
            </button>
          </div>

          {geo.locality && (
            <div className="text-[11px] text-gray-500 font-medium px-1 flex items-center justify-between">
              <span>स्थान: <strong>{geo.locality}</strong></span>
              <span className="text-[#2E7D1F] font-bold">GPS सक्रिय ✓</span>
            </div>
          )}

          <LocationPermissionBanner
            status={geo.status}
            errorMsg={geo.errorMsg}
            errorType={geo.errorType}
            onRetry={geo.detect}
          />
        </div>

        <button
          type="button"
          onClick={onSellClick}
          className="w-full h-12 rounded-xl bg-[#262B29] hover:bg-black active:scale-98 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
        >
          <span>{t.schedulePickup}</span>
        </button>

        {/* Search Input (Screenshots 2 & 5 Pattern) */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder={t.searchMaterial}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-10 pr-4 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2E7D1F]"
          />
        </div>

        {/* Filter Chips (Screenshot 5 Pattern) */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: t.all },
            { id: 'ewaste', label: 'E-Waste' },
            { id: 'metal', label: 'Metal Scrap' },
            { id: 'paper', label: 'Paper & Cardboard' },
            { id: 'plastic', label: 'Plastic' },
            { id: 'appliance', label: 'Appliances' },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setActiveFilter(chip.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                activeFilter === chip.id
                  ? 'bg-[#2E7D1F] text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section Header (Screenshot 5 Pattern) */}
      <div className="pt-2">
        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest block">
          {activeFilter === 'all' ? 'ALL RECYCLABLES' : activeFilter.toUpperCase()}
        </span>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10 opacity-60">
          <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#2E7D1F] animate-spin mb-3"></div>
          <p className="text-xs font-bold text-gray-500">Loading daily rates...</p>
        </div>
      )}

      {/* Rates Rows (Screenshot 5: strikethrough old rate -> bold green rate) */}
      {!isLoading && (
        <div className="space-y-2.5">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm font-medium">
              No materials found.
            </div>
          ) : (
            filtered.map((item) => {
              const IconComp = item.icon;
              const displayName = lang === 'hi' ? item.name_hi : lang === 'mr' ? item.name_mr : item.name_en;

              return (
                <div
                  key={item.id}
                  onClick={onSellClick}
                  className="p-3.5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs flex items-center justify-between gap-3 cursor-pointer hover:border-[#2E7D1F]/50 transition-all select-none active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-13 h-13 rounded-2xl ${item.color} flex items-center justify-center shrink-0 shadow-2xs`}>
                      <IconComp size={22} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-[#14181A] truncate">
                        {displayName}
                      </h4>
                      <span className="text-[11px] text-gray-400 font-medium capitalize">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Strikethrough rate -> Bold green rate (Screenshot 5 Pattern) */}
                  <div className="text-right shrink-0">
                    <div className="flex items-baseline justify-end gap-1.5">
                      {item.oldRate && item.oldRate !== item.ratePerKg && (
                        <span className="text-xs text-gray-400 line-through font-medium tabular-nums">
                          ₹{item.oldRate}
                        </span>
                      )}
                      <span className="text-lg font-black text-[#2E7D1F] tabular-nums">
                        ₹{item.ratePerKg}
                      </span>
                      <span className="text-xs text-gray-500 font-semibold">/{item.unit === 'piece' ? 'Pc' : 'Kg'}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Floating Mini "Sell Now" Bar (Screenshot 2 Pattern) */}
      {showFloatingBar && (
        <div className="fixed bottom-20 left-0 right-0 max-w-[440px] mx-auto px-4 z-30 pointer-events-none">
          <div className="relative pointer-events-auto rounded-2xl bg-[#2E7D1F] text-white p-3 shadow-xl flex items-center justify-between gap-3">
            {/* Dismiss X button */}
            <button
              type="button"
              onClick={() => setShowFloatingBar(false)}
              className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[#14181A] text-white flex items-center justify-center text-xs font-bold shadow-md hover:bg-black active:scale-90"
              aria-label="Dismiss"
            >
              ✕
            </button>

            {/* Overlapping Thumbnails & Item text */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex -space-x-2 shrink-0">
                <div className="w-8 h-8 rounded-full bg-white text-emerald-800 border-2 border-white flex items-center justify-center text-xs shadow-2xs font-bold">
                  PCB
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 border-2 border-white flex items-center justify-center text-xs shadow-2xs font-bold">
                  Cu
                </div>
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate">
                  PCBs, Copper, Batteries...
                </span>
                <span className="text-[10px] text-emerald-100">
                  +EPR bonus included
                </span>
              </div>
            </div>

            {/* Sell Now Button (Screenshot 2) */}
            <button
              type="button"
              onClick={onSellClick}
              className="h-9 px-4 rounded-xl bg-white hover:bg-gray-100 text-[#2E7D1F] font-black text-xs shrink-0 shadow-xs active:scale-95 transition-all"
            >
              {t.sellNow}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

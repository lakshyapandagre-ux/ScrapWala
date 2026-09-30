'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Info, 
  ArrowRight, 
  Cpu, 
  BatteryCharging, 
  Cable, 
  Monitor, 
  Tv, 
  Cog, 
  Package, 
  Sparkles 
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { fetchMaterials, fetchLatestRates } from '@/lib/market-data';

export interface ScrapSellItem {
  id: string;
  name: string;
  nameHi: string;
  nameMr: string;
  category: string;
  ratePerKg: number;
  image: string;
  icon?: any;
  color?: string;
  slug: string;
}

// Keep a fallback in case loading fails
export const SCRAP_CATALOG_FALLBACK: ScrapSellItem[] = [
  { id: 'copper_wire', slug: 'copper_wire', name: 'Copper Wire', nameHi: 'तांबे का तार', nameMr: 'तांब्याची वायर', category: 'metal', ratePerKg: 620, image: '/images/copper_wire.jpg' },
  { id: 'pcb_boards', slug: 'pcb_motherboard', name: 'PCBs', nameHi: 'पीसीबी मदरबोर्ड', nameMr: 'पीसीबी मदरबोर्ड', category: 'ewaste', ratePerKg: 178, image: '/images/pcb.jpg' },
];

export const SCRAP_CATALOG = SCRAP_CATALOG_FALLBACK;

interface ItemSelectSellProps {
  onBack: () => void;
  onContinue: (selectedItems: ScrapSellItem[]) => void;
}

export const ItemSelectSell: React.FC<ItemSelectSellProps> = ({ onBack, onContinue }) => {
  const { lang, t } = useI18n();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  
  const [catalog, setCatalog] = useState<ScrapSellItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [mats, rates] = await Promise.all([fetchMaterials(), fetchLatestRates('Indore')]);
        const items = mats.map(m => {
          const r = rates.find(x => x.material_id === m.id || x.slug === m.slug);
          // try to assign image based on slug
          let image = '/images/ms_drum.jpg';
          if (m.slug.includes('copper')) image = '/images/copper_wire.jpg';
          else if (m.slug.includes('pcb')) image = '/images/pcb.jpg';
          else if (m.slug.includes('battery')) image = '/images/battery.jpg';

          return {
            id: m.id,
            slug: m.slug,
            name: m.name_en,
            nameHi: m.name_hi,
            nameMr: m.name_mr,
            category: m.category,
            ratePerKg: r?.rate || 0,
            image
          };
        }).filter(m => m.ratePerKg > 0);
        
        setCatalog(items);
        if (items.length > 0) {
          // Auto select first item if none selected
          setSelectedItemIds([items[0].id]);
        }
      } catch (e) {
        setCatalog(SCRAP_CATALOG_FALLBACK);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const categories = ['all', 'metal', 'ewaste', 'paper', 'plastic', 'appliance'];

  const filtered = catalog.filter((item) => {
    const itemName = lang === 'hi' ? item.nameHi : lang === 'mr' ? item.nameMr : item.name;
    const matchesSearch = itemName.toLowerCase().includes(search.toLowerCase()) || item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    setSelectedItemIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    const selected = catalog.filter(i => selectedItemIds.includes(i.id));
    if (selected.length > 0) {
      onContinue(selected);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] sm:h-[92vh] bg-[#F6F8F6] relative max-w-[440px] mx-auto overflow-hidden">
      {/* Top App Bar */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-[15px] font-black text-[#14181A] leading-tight">
              {t.selectItemsToSell}
            </h1>
            <p className="text-[10px] text-gray-500 font-medium">
              Step 1 of 3
            </p>
          </div>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Sub Header & Search */}
        <div className="bg-white px-4 py-4 space-y-4 shadow-xs">
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder={t.searchMaterial}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2E7D1F] transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 capitalize ${
                  activeCategory === cat
                    ? 'bg-[#2E7D1F] text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat === 'all' ? t.all : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <div className="px-4 py-3">
          <div className="rounded-xl bg-[#E6F0FB] border border-[#BFD9F5] p-3 flex gap-3">
            <Info size={18} className="text-[#0B4F9C] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[#0B4F9C] leading-snug">
                {lang === 'hi' ? 'केवल प्रमाणित स्क्रैप भाव' : lang === 'mr' ? 'फक्त प्रमाणित भंगार भाव' : 'We buy only at scrap rates'}
              </p>
              <p className="text-[10px] text-[#0B4F9C]/80 font-medium mt-0.5">
                {lang === 'hi' ? 'काम करने वाले उपकरणों का कोई अतिरिक्त मूल्य नहीं।' : lang === 'mr' ? 'चालू उपकरणांचे अतिरिक्त मूल्य नाही.' : 'No additional value for working appliances.'}
              </p>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="px-4 pb-6">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#2E7D1F] animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filtered.map((item) => {
                const isSelected = selectedItemIds.includes(item.id);
                const displayName = lang === 'hi' ? item.nameHi : lang === 'mr' ? item.nameMr : item.name;

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`relative p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none active:scale-[0.99] ${
                      isSelected 
                        ? 'bg-[#F4FAF4] border-[#2E7D1F] shadow-sm' 
                        : 'bg-white border-gray-200/90 hover:border-gray-300 shadow-2xs'
                    }`}
                  >
                    {/* Top Right Check Radio (Screenshot 3 Pattern) */}
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full border flex items-center justify-center transition-all bg-white z-10">
                      {isSelected ? (
                        <div className="w-full h-full rounded-full bg-[#2E7D1F] border-2 border-[#2E7D1F] flex items-center justify-center text-white">
                          <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3">
                            <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-full border-2 border-gray-300" />
                      )}
                    </div>

                    <div className="flex items-center gap-3.5 min-w-0 pr-8">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-50 border border-gray-100 shadow-2xs relative">
                        {item.category === 'ewaste' && (
                          <div className="absolute top-0 right-0 bg-[#F5B301] text-white text-[8px] font-black px-1 py-0.5 rounded-bl-lg z-10">
                            EPR
                          </div>
                        )}
                        <img 
                          src={item.image} 
                          alt={displayName}
                          className={`w-full h-full object-cover transition-all ${isSelected ? 'scale-105' : 'scale-100'}`}
                          loading="lazy"
                        />
                      </div>
                      
                      <div className="min-w-0">
                        <h3 className={`font-bold text-sm truncate ${isSelected ? 'text-[#0F5A43]' : 'text-[#14181A]'}`}>
                          {displayName}
                        </h3>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className={`text-sm font-black tabular-nums ${isSelected ? 'text-[#2E7D1F]' : 'text-gray-800'}`}>
                            ₹{item.ratePerKg}
                          </span>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                            / kg
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-[max(16px,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              {t.itemsSelected}
            </span>
            <span className="text-lg font-black text-[#14181A]">
              {selectedItemIds.length} <span className="text-xs text-gray-400 font-semibold">items</span>
            </span>
          </div>
          {selectedItemIds.length > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
              <Sparkles size={12} className="text-emerald-500" />
              <span>{lang === 'hi' ? 'दाम लॉक किए गए' : lang === 'mr' ? 'दर लॉक केले' : 'Rates locked'}</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={selectedItemIds.length === 0}
          className={`w-full h-12 rounded-xl font-extrabold text-[13px] flex items-center justify-center gap-2 transition-all shadow-xs ${
            selectedItemIds.length > 0
              ? 'bg-[#2E7D1F] hover:bg-[#256618] text-white active:scale-98 cursor-pointer'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>{t.continueBtn}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

'use client';

import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Trash2, 
  MapPin, 
  ChevronDown, 
  Plus, 
  Info, 
  Image as ImageIcon, 
  FileText,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { ScrapSellItem } from './ItemSelectSell';
import { useI18n } from '@/lib/i18n';
import { fetchOffersForMaterial, calculateBestDeals, BestDeal } from '@/lib/market-data';

interface RequestSummaryStepProps {
  selectedItems: ScrapSellItem[];
  location: string;
  weight: number;
  userNote: string;
  photos: string[];
  onBack: () => void;
  onDiscard: () => void;
  onConfirm: () => void;
}

export const RequestSummaryStep: React.FC<RequestSummaryStepProps> = ({
  selectedItems,
  location,
  weight,
  userNote,
  photos,
  onBack,
  onDiscard,
  onConfirm,
}) => {
  const { lang, t } = useI18n();
  const [bestDeals, setBestDeals] = useState<BestDeal[]>([]);
  const [isLoadingDeals, setIsLoadingDeals] = useState(true);
  const [selectedDealIndex, setSelectedDealIndex] = useState(0);

  const primaryItem = selectedItems[0];

  useEffect(() => {
    async function loadDeals() {
      setIsLoadingDeals(true);
      if (primaryItem) {
        try {
          const offers = await fetchOffersForMaterial(primaryItem.id);
          const computed = calculateBestDeals(offers, weight, primaryItem.ratePerKg);
          setBestDeals(computed);
        } catch (e) {
          console.error('Failed to load deals', e);
        }
      }
      setIsLoadingDeals(false);
    }
    loadDeals();
  }, [primaryItem, weight]);

  const bestDeal = bestDeals[selectedDealIndex];

  return (
    <div className="flex flex-col min-h-[92dvh] justify-between pb-32 bg-white relative">
      {/* Top Bar: < Back and Discard (Screenshot 1 Pattern) */}
      <div className="p-4 pt-5 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 active:scale-95 transition-all"
        >
          <ArrowLeft size={18} />
        </button>

        <button
          type="button"
          onClick={onDiscard}
          className="text-xs font-bold text-[#E02424] hover:bg-red-50 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors active:scale-95"
        >
          <Trash2 size={14} />
          <span>{t.discard}</span>
        </button>
      </div>

      <div className="px-5 space-y-5 flex-1">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-black text-[#14181A] tracking-tight">
            {t.requestSummary}
          </h1>
        </div>

        {/* Selected Scrap Info */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
            <img src={primaryItem?.image} alt={primaryItem?.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-bold text-[#14181A]">{lang === 'hi' ? primaryItem?.nameHi : lang === 'mr' ? primaryItem?.nameMr : primaryItem?.name}</h3>
            <p className="text-sm font-semibold text-gray-500">{weight} kg approx.</p>
            <p className="text-xs text-gray-400 mt-0.5">Market Rate: ₹{primaryItem?.ratePerKg}/kg</p>
          </div>
        </div>

        {/* BEST DEALS ENGINE UI */}
        <div className="space-y-3 pt-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#F5B301]" />
            <span className="text-sm font-black text-[#14181A] uppercase tracking-wider">Best Deals for your scrap</span>
          </div>

          {isLoadingDeals ? (
            <div className="p-6 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 border-t-[#2E7D1F] animate-spin mb-2"></div>
              <p className="text-xs text-gray-500 font-semibold">Calculating net amounts & fees...</p>
            </div>
          ) : bestDeals.length > 0 ? (
            <div className="space-y-3">
              {bestDeals.slice(0, 3).map((deal, idx) => (
                <div 
                  key={deal.offer.id}
                  onClick={() => setSelectedDealIndex(idx)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    selectedDealIndex === idx ? 'border-[#2E7D1F] bg-[#F4FAF4] shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {/* Top Right Check Radio */}
                  <div className="absolute top-3.5 right-3 w-5 h-5 rounded-full border flex items-center justify-center transition-all bg-white z-10">
                    {selectedDealIndex === idx ? (
                      <div className="w-full h-full rounded-full bg-[#2E7D1F] border-2 border-[#2E7D1F] flex items-center justify-center text-white">
                        <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3">
                          <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    ) : (
                      <div className="w-full h-full rounded-full border-2 border-gray-300" />
                    )}
                  </div>

                  <div className="pr-8">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-extrabold text-[#14181A] text-sm">{deal.dealer.name}</h4>
                      {deal.dealer.rating > 4.5 && (
                        <div className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded-sm font-bold flex items-center gap-0.5">
                          <Award size={10} /> Top Rated
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-2">
                      <span className="font-semibold text-gray-800">Offer: ₹{deal.offer.offer_price}/kg</span>
                      <span className="text-gray-300">•</span>
                      <span>Deductions: ₹{deal.totalFees}</span>
                    </div>
                    
                    <div className="flex items-end justify-between mt-2 pt-2 border-t border-gray-200/60">
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Net Payout</span>
                        <span className={`text-lg font-black tabular-nums ${selectedDealIndex === idx ? 'text-[#2E7D1F]' : 'text-gray-800'}`}>
                          ₹{deal.netAmount}
                        </span>
                      </div>
                      
                      {deal.savingsVsMarket > 0 && (
                        <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                          +₹{deal.savingsVsMarket} vs Market
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
              <p className="text-xs text-gray-500 font-medium">No special offers for this quantity. Market rate will apply.</p>
            </div>
          )}
        </div>

        {/* Section 1: Picking up from */}
        <div className="space-y-1.5 pt-2">
          <span className="text-xs font-bold text-gray-500 block">
            {t.pickingUpFrom}
          </span>
          <div className="p-4 rounded-2xl border border-gray-200/90 shadow-2xs flex items-center justify-between bg-white cursor-pointer hover:border-gray-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EFFAEB] text-[#2E7D1F] flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#14181A]">{t.yourLocation}</h4>
                <p className="text-xs text-gray-500 truncate max-w-[220px]">
                  {location || 'HMWQ+9WV, ., Pithampur, Indore'}
                </p>
              </div>
            </div>
            <ChevronDown size={18} className="text-gray-400" />
          </div>
        </div>

        {/* Selected Photos & Note */}
        <div className="flex gap-2 pb-6">
          <div className="h-16 flex-1 rounded-2xl bg-white border border-gray-200 shadow-2xs flex items-center justify-center gap-2 relative overflow-hidden">
            {photos.length > 0 ? (
              <>
                <img src={photos[0]} alt="Scrap preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-black/40" />
                <span className="relative z-10 text-white font-bold text-xs">{photos.length} photos</span>
              </>
            ) : (
              <>
                <ImageIcon size={18} className="text-gray-400" />
                <span className="text-xs font-semibold text-gray-500">No photos</span>
              </>
            )}
          </div>
          
          <div className="h-16 flex-1 rounded-2xl bg-white border border-gray-200 shadow-2xs flex items-center justify-center gap-2">
            <FileText size={18} className="text-gray-400" />
            <span className="text-xs font-semibold text-gray-500 truncate max-w-[100px]">
              {userNote || 'No note'}
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Summary Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-[max(16px,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
              Net Amount Estimate
            </span>
            <span className="text-xl font-black text-[#2E7D1F] tabular-nums">
              ₹{bestDeal ? bestDeal.netAmount : Math.round(primaryItem?.ratePerKg * weight)}
            </span>
            <span className="text-xs text-gray-400 font-semibold ml-1">approx.</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-gray-400 block mb-1">
              Quantity
            </span>
            <span className="text-sm font-black text-[#14181A]">
              {weight} kg
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onConfirm}
          className="w-full h-12 rounded-xl bg-[#2E7D1F] hover:bg-[#256618] active:scale-98 text-white font-extrabold text-[13px] flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(46,125,31,0.25)] transition-all"
        >
          <span>{t.confirmPickup}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

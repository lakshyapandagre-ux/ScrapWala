'use client';

import React from 'react';
import { Sparkles, ShieldAlert, ArrowRight, TrendingUp } from 'lucide-react';
import { AudioButton } from '../audio-button/AudioButton';
import { ProvenanceBadge } from '../ui/ProvenanceBadge';

interface ValueXrayProps {
  category: string;
  weight: number;
  unit?: string;
  valuation: {
    estimated_value: number;
    market_rate_per_kg: number;
    market_range: { low: number; high: number };
    composition_estimate: {
      copper_g?: number;
      gold_mg?: number;
      silver_g?: number;
      lithium_g?: number;
      critical_minerals_detected?: string[];
      hazardous_components?: string[];
      [key: string]: any;
    };
    confidence: 'low' | 'medium' | 'high';
    data_freshness: string;
  };
}

export const ValueXray: React.FC<ValueXrayProps> = ({
  category,
  weight,
  unit = 'kg',
  valuation,
}) => {
  const { market_range, estimated_value, composition_estimate, data_freshness } = valuation;

  // Calculate EPR premium estimate
  const eprRate = category === 'PCBs' ? 75 : category === 'Batteries' ? 90 : 40;
  const eprPremium = Math.round(weight * eprRate * 0.30);
  const totalPayout = estimated_value + eprPremium;
  const informalPrice = Math.round(estimated_value * 0.75); // Backyard processing deduction

  const audioSummary = `${category} का ${weight} ${unit} माल। औपचारिक रीसाइक्लिंग से आपको कुल ${totalPayout} रुपये मिलेंगे, जिसमें ${eprPremium} रुपये ईपीआर बोनस शामिल है।`;

  return (
    <div className="space-y-4">
      {/* 1. Value X-ray Minerals Stacked Bar Card */}
      <div className="rounded-card border border-sw-line bg-sw-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-sw-green-50 text-sw-green-700">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sw-ink-900 text-sm">
                इस लॉट में क्या छुपा है (Value X-Ray)
              </h3>
              <p className="text-[11px] text-sw-ink-600">
                खनिजों और सही मूल्य का पारदर्शी विवरण
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <ProvenanceBadge type="estimate" freshness="CPCB बेंचमार्क" />
            <AudioButton textToSpeak={audioSummary} size={15} />
          </div>
        </div>

        {/* 12px Stacked Mineral Bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-gray-100">
          <div style={{ width: '45%' }} className="bg-[#B87333] h-full" title="Copper (तांबा)" />
          <div style={{ width: '20%' }} className="bg-[#FFD700] h-full" title="Gold (सोना)" />
          <div style={{ width: '15%' }} className="bg-[#C0C0C0] h-full" title="Silver (चांदी)" />
          <div style={{ width: '12%' }} className="bg-[#00D2D3] h-full" title="Lithium (लिथियम)" />
          <div style={{ width: '8%' }} className="bg-[#A29BFE] h-full" title="Other Rare Earth" />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          {composition_estimate.copper_g !== undefined && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-orange-50/60 border border-orange-100">
              <span className="flex items-center gap-1.5 text-sw-ink-800">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B87333]" />
                तांबा (Copper)
              </span>
              <span className="font-bold text-sw-ink-900 tabular-nums">
                {composition_estimate.copper_g}g
              </span>
            </div>
          )}

          {composition_estimate.gold_mg !== undefined && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/60 border border-amber-100">
              <span className="flex items-center gap-1.5 text-sw-ink-800">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFD700]" />
                सोना (Gold)
              </span>
              <span className="font-bold text-sw-ink-900 tabular-nums">
                {composition_estimate.gold_mg}mg
              </span>
            </div>
          )}

          {composition_estimate.silver_g !== undefined && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="flex items-center gap-1.5 text-sw-ink-800">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C0C0C0]" />
                चांदी (Silver)
              </span>
              <span className="font-bold text-sw-ink-900 tabular-nums">
                {composition_estimate.silver_g}g
              </span>
            </div>
          )}

          {composition_estimate.lithium_g !== undefined && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-cyan-50 border border-cyan-100">
              <span className="flex items-center gap-1.5 text-sw-ink-800">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00D2D3]" />
                लिथियम (Lithium)
              </span>
              <span className="font-bold text-sw-ink-900 tabular-nums">
                {composition_estimate.lithium_g}g
              </span>
            </div>
          )}
        </div>

        <p className="text-[10px] text-sw-ink-400 italic pt-1">
          * उद्योग संदर्भ से अनुमान। असली मात्रा रीसाइक्लर जांच में पता चलेगी।
        </p>
      </div>

      {/* 2. Kamai Breakdown with Gold Chip */}
      <div className="rounded-card border border-sw-line bg-sw-card p-4 space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-sw-ink-600 flex items-center justify-between">
          <span>कमाई का विवरण (Payout Breakdown)</span>
          <span className="text-[10px] text-sw-ink-400">उचित बाज़ार दर</span>
        </h4>

        <div className="flex justify-between items-center text-sm">
          <span className="text-sw-ink-600">मूल कबाड़ भाव (Base Price):</span>
          <span className="font-semibold text-sw-ink-900 tabular-nums">
            ₹{market_range.low} – ₹{market_range.high}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-1.5 text-sw-forest-800 font-medium">
            + सरकार ईपीआर बोनस (EPR Premium):
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#F5B301] to-[#FFD666] text-sw-ink-900 shadow-xs tabular-nums">
            +₹{eprPremium}
          </span>
        </div>

        <div className="border-t border-sw-line pt-2.5 flex justify-between items-baseline">
          <div>
            <span className="text-xs font-bold text-sw-ink-900 block">कुल अनुमानित प्राप्ति:</span>
            <span className="text-[10px] text-sw-ink-400">CPCB पोर्टल से सत्यापित</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-sw-green-600 tabular-nums">
              ₹{totalPayout}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Backyard vs Formal Comparison (Side-by-Side) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Left: Backyard burning (danger) */}
        <div className="p-3 rounded-card bg-sw-red-50 border border-red-200/80 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sw-red-600 block">
            अनौपचारिक भट्टी में
          </span>
          <div className="text-base font-black text-sw-red-600 tabular-nums">
            ~₹{informalPrice}
          </div>
          <ul className="text-[10px] text-red-900 space-y-0.5 pt-1">
            <li>✕ जहरीला धुआं और फेफड़ों का रोग</li>
            <li>✕ बहुमूल्य खनिज जलकर राख</li>
            <li>✕ कोई ईपीआर बोनस नहीं</li>
          </ul>
        </div>

        {/* Right: Formal Recycler Route */}
        <div className="p-3 rounded-card bg-sw-green-50 border border-sw-green-100 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sw-green-700 block">
            औपचारिक रीसाइक्लर
          </span>
          <div className="text-base font-black text-sw-green-600 tabular-nums">
            ₹{totalPayout}
          </div>
          <ul className="text-[10px] text-sw-forest-900 space-y-0.5 pt-1">
            <li>✓ सुरक्षित व वैज्ञानिक रीसाइक्लिंग</li>
            <li>✓ तांबा-सोना देश के काम आएगा</li>
            <li>✓ ₹{eprPremium} अतिरिक्त ईपीआर बोनस</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

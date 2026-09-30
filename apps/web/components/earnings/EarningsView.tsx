'use client';

import React, { useState } from 'react';
import { Wallet, CheckCircle2, Clock, ArrowDownLeft, FileCheck, Sparkles } from 'lucide-react';
import { SyncBadge } from '../ui/SyncBadge';
import { AudioButton } from '../audio-button/AudioButton';
import { useI18n } from '@/lib/i18n';

export const EarningsView: React.FC = () => {
  const { lang, t } = useI18n();
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');

  const transactions = [
    {
      id: 'tx-1',
      lotId: 'EW-IND-20260928-1024',
      category: lang === 'hi' ? 'सर्किट बोर्ड (PCBs)' : lang === 'mr' ? 'पीसीबी बोर्ड' : 'PCBs (Circuit Boards)',
      weight: 2.5,
      baseAmount: 445,
      eprPremium: 56,
      totalAmount: 501,
      status: 'paid' as const,
      paymentMode: 'UPI',
      date: lang === 'hi' ? 'आज, 11:30 AM' : lang === 'mr' ? 'आज, 11:30 AM' : 'Today, 11:30 AM',
    },
    {
      id: 'tx-2',
      lotId: 'EW-IND-20260927-0892',
      category: lang === 'hi' ? 'तांबा तार व केबल' : lang === 'mr' ? 'तांब्याची वायर' : 'Copper Wire & Cables',
      weight: 8.0,
      baseAmount: 1120,
      eprPremium: 96,
      totalAmount: 1216,
      status: 'paid' as const,
      paymentMode: lang === 'hi' ? 'नकद' : lang === 'mr' ? 'रोख' : 'Cash',
      date: lang === 'hi' ? 'कल, 04:15 PM' : lang === 'mr' ? 'काल, 04:15 PM' : 'Yesterday, 04:15 PM',
    },
    {
      id: 'tx-3',
      lotId: 'EW-IND-20260926-0741',
      category: lang === 'hi' ? 'लिथियम बैटरी' : lang === 'mr' ? 'लिथियम बॅटरी' : 'Lithium Batteries',
      weight: 3.0,
      baseAmount: 330,
      eprPremium: 81,
      totalAmount: 411,
      status: 'pending' as const,
      paymentMode: lang === 'hi' ? 'प्रतीक्षारत' : lang === 'mr' ? 'प्रलंबित' : 'Pending',
      date: '26 Sep 2026',
    },
  ];

  const filteredTx = transactions.filter(tx => {
    if (filter === 'paid') return tx.status === 'paid';
    if (filter === 'pending') return tx.status === 'pending';
    return true;
  });

  return (
    <div className="space-y-4 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#14181A] tracking-tight">
            {t.earningsTitle}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {t.earningsSubtitle}
          </p>
        </div>
        <AudioButton 
          textToSpeak={
            lang === 'hi'
              ? 'आपकी कुल कमाई 2128 रुपये है, जिसमें 233 रुपये सरकारी ईपीआर बोनस शामिल है।'
              : lang === 'mr'
              ? 'आपली एकूण कमाई २१२८ रुपये आहे.'
              : 'Your total verified earnings are ₹2,128, including ₹233 government EPR bonus.'
          } 
        />
      </div>

      {/* Forest Gradient Summary Card */}
      <div
        className="p-5 rounded-3xl text-white shadow-md space-y-4"
        style={{
          background: 'linear-gradient(145deg, #0B3D2E 0%, #134E39 50%, #2E7D1F 100%)',
        }}
      >
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#D9F5D0] flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#F5B301]" />
            {t.totalEarned}
          </span>
          <div className="text-3xl sm:text-4xl font-black mt-1 tracking-tight text-white tabular-nums">
            ₹2,128
          </div>
          <p className="text-xs text-emerald-100/90 mt-1 font-medium">
            {t.includesEprBonus}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/15">
          <div className="p-3 rounded-2xl bg-black/25 border border-white/10 backdrop-blur-xs">
            <span className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider block">
              {t.paid}
            </span>
            <div className="text-lg font-black text-white mt-0.5 tabular-nums">
              ₹1,717
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-black/25 border border-white/10 backdrop-blur-xs">
            <span className="text-[10px] text-amber-200 uppercase font-bold tracking-wider block">
              {t.pending}
            </span>
            <div className="text-lg font-black text-amber-300 mt-0.5 tabular-nums">
              ₹411
            </div>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 pt-1">
        {[
          { id: 'all', label: t.all },
          { id: 'paid', label: t.paid },
          { id: 'pending', label: t.pending },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === f.id
                ? 'bg-[#2E7D1F] text-white shadow-xs'
                : 'bg-white border border-gray-200/90 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Clean Transaction Cards */}
      <div className="space-y-3">
        {filteredTx.map((tx) => (
          <div
            key={tx.id}
            className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-3 hover:border-[#2E7D1F]/40 transition-all select-none"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#0F5A43]">
                {tx.lotId}
              </span>
              <span className="text-[11px] font-medium text-gray-500">{tx.date}</span>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-bold text-[#14181A]">{tx.category}</h4>
                <span className="text-xs text-gray-500 font-medium">{t.weight}: {tx.weight} kg</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-[#14181A] tabular-nums block">
                  ₹{tx.totalAmount}
                </span>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF4DC] text-[#B45309] border border-[#FDE68A] tabular-nums">
                  +₹{tx.eprPremium} {t.eprBonus}
                </span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-700 font-medium">
                {lang === 'hi' ? 'माध्यम: ' : lang === 'mr' ? 'पद्धत: ' : 'Mode: '}
                <strong className="text-[#14181A]">{tx.paymentMode}</strong>
              </span>
              <SyncBadge status={tx.status === 'paid' ? 'synced' : 'pending'} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

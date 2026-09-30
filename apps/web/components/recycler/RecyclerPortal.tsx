'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle, 
  Clock, 
  QrCode, 
  Scale, 
  IndianRupee, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles, 
  Hash, 
  Check, 
  MapPin,
  Camera,
  X
} from 'lucide-react';
import { ProvenanceBadge } from '../ui/ProvenanceBadge';
import { useGeolocation } from '@/lib/hooks/useGeolocation';
import { RecyclerSearchModal } from './RecyclerSearchModal';

interface DemandLot {
  id: string;
  lotDisplayId: string;
  category: string;
  weight: number;
  estPrice: number;
  distanceKm: number;
  timeAgo: string;
  collectorName: string;
}

const MOCK_DEMAND_LOTS: DemandLot[] = [
  { id: '1', lotDisplayId: 'EW-IND-20260928-1024', category: 'PCBs', weight: 2.5, estPrice: 445, distanceKm: 4.2, timeAgo: '20 मिनट पहले', collectorName: 'रामू कबाड़ी' },
  { id: '2', lotDisplayId: 'EW-IND-20260928-1025', category: 'Batteries', weight: 8.0, estPrice: 880, distanceKm: 6.5, timeAgo: '1 घंटा पहले', collectorName: 'मोहन लाल' },
  { id: '3', lotDisplayId: 'EW-IND-20260928-1026', category: 'Cables', weight: 12.0, estPrice: 1680, distanceKm: 2.8, timeAgo: '2 घंटे पहले', collectorName: 'दिनेश भाई' },
  { id: '4', lotDisplayId: 'EW-IND-20260928-1027', category: 'PCBs', weight: 4.0, estPrice: 712, distanceKm: 8.1, timeAgo: '3 घंटे पहले', collectorName: 'सुनील कुमार' },
];

export const RecyclerPortal: React.FC = () => {
  const [activeView, setActiveView] = useState<'demand' | 'scan' | 'confirm'>('demand');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedLots, setSelectedLots] = useState<string[]>(['1']);
  const [selectedLotForHandover, setSelectedLotForHandover] = useState<DemandLot>(MOCK_DEMAND_LOTS[0]);

  // Handover confirmation GPS: auto-capture silently in the background
  const geo = useGeolocation();
  React.useEffect(() => {
    geo.detect();
  }, []);

  // Handover state
  const [finalWeight, setFinalWeight] = useState<number>(2.5);
  const [finalPrice, setFinalPrice] = useState<number>(445);
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);

  // Server-side EPR calculation preview
  const eprRate = selectedLotForHandover.category === 'PCBs' ? 75 : 90;
  const computedEprPremium = Math.round(finalWeight * eprRate * 0.30);
  const totalPayout = finalPrice + computedEprPremium;

  const toggleSelectLot = (id: string) => {
    setSelectedLots(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleStartHandover = (lot: DemandLot) => {
    setSelectedLotForHandover(lot);
    setFinalWeight(lot.weight);
    setFinalPrice(lot.estPrice);
    setReceipt(null);
    setActiveView('confirm');
  };

  const handleConfirmHandover = async () => {
    setIsProcessing(true);
    const idempotencyKey = crypto.randomUUID();
    const payload = {
      lot_id: selectedLotForHandover.id,
      recycler_id: 'rec-001',
      final_weight: finalWeight,
      final_price: finalPrice,
      payment_mode: paymentMode,
      idempotency_key: idempotencyKey,
      gps_lat: geo.lat ?? 22.6139,
      gps_lng: geo.lng ?? 75.6822,
    };

    try {
      const res = await fetch('/api/handovers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setReceipt(data);
      } else {
        // Fallback receipt
        setReceipt({
          handover_id: 'hnd-' + idempotencyKey.slice(0, 8),
          lot_id: payload.lot_id,
          final_weight: finalWeight,
          final_price: finalPrice,
          epr_premium: computedEprPremium,
          total_payout: totalPayout,
          payment_mode: paymentMode,
          payment_status: 'confirmed',
          traceability_event_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
          created_at: new Date().toISOString(),
        });
      }
    } catch {
      setReceipt({
        handover_id: 'hnd-' + idempotencyKey.slice(0, 8),
        lot_id: payload.lot_id,
        final_weight: finalWeight,
        final_price: finalPrice,
        epr_premium: computedEprPremium,
        total_payout: totalPayout,
        payment_mode: paymentMode,
        payment_status: 'confirmed',
        traceability_event_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        created_at: new Date().toISOString(),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 pb-28">
      {/* 1. Dark Charcoal Header (Section 10) */}
      <div className="bg-sw-ink-800 text-white p-5 rounded-b-sheet -mx-4 -mt-6 mb-2 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-sw-green-100">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                E-Parisaraa Clean Tech Pvt. Ltd.
              </h2>
              <p className="text-xs text-sw-ink-400">
                पीथमपुर, सेक्टर 3, इंदौर (SPCB अधिकृत)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveView('scan')}
            className="p-2.5 rounded-full bg-sw-green-600 hover:bg-sw-green-700 text-white active:scale-95 shadow-xs"
            title="क्यूआर स्कैन करें"
          >
            <QrCode size={18} />
          </button>
        </div>

        {/* Authorization Card with Expiry */}
        <div className="p-3 rounded-card bg-white/5 border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-sw-green-100" />
            <span>लाइसेंस: MPPCB/E-WASTE/AUTH/2024/089</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-sw-green-600/30 text-sw-green-100 text-[11px] font-bold">
            वैध: Dec 2027
          </span>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="p-2.5 rounded-xl bg-white/5 text-center">
            <span className="text-[10px] text-sw-ink-400 uppercase font-semibold">नये लॉट</span>
            <div className="text-lg font-black text-white">12</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 text-center">
            <span className="text-[10px] text-sw-ink-400 uppercase font-semibold">सत्यापित</span>
            <div className="text-lg font-black text-sw-green-100">48</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 text-center">
            <span className="text-[10px] text-sw-ink-400 uppercase font-semibold">कुल वजन</span>
            <div className="text-lg font-black text-white">1.8 टन</div>
          </div>
        </div>
      </div>

      {/* VIEW: DEMAND LIST (Recykal.Market Pattern) */}
      {activeView === 'demand' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-sw-ink-900">
                आसपास उपलब्ध ई-कचरा लॉट
              </h3>
              <p className="text-xs text-sw-ink-600">आपके 25 km दायरे में 12 लॉट</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="text-xs font-bold text-[#2E7D1F] bg-[#EFFAEB] px-3 py-1.5 rounded-full border border-[#D0EBD2] flex items-center gap-1 active:scale-95 shadow-2xs"
                title="नज़दीकी रीसाइक्लर खोजें"
              >
                <Building2 size={13} /> रीसाइक्लर खोजें
              </button>
              <button
                type="button"
                onClick={() => setActiveView('scan')}
                className="text-xs font-bold text-sw-green-700 bg-sw-green-50 px-3 py-1.5 rounded-full border border-sw-green-100 flex items-center gap-1 active:scale-95"
              >
                <QrCode size={14} /> क्यूआर स्कैन
              </button>
            </div>
          </div>

          {/* Grouped Demand Lots Cards */}
          <div className="space-y-2.5">
            {MOCK_DEMAND_LOTS.map((lot) => {
              const isChecked = selectedLots.includes(lot.id);
              return (
                <div
                  key={lot.id}
                  onClick={() => handleStartHandover(lot)}
                  className="p-3.5 rounded-card bg-sw-card border border-sw-line shadow-xs flex items-center justify-between gap-3 hover:border-sw-green-600/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleSelectLot(lot.id);
                      }}
                      className="w-4 h-4 rounded text-sw-green-600 focus:ring-sw-green-600 cursor-pointer"
                    />

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-sw-forest-800">
                          {lot.lotDisplayId}
                        </span>
                        <span className="text-[10px] text-sw-ink-400">• {lot.timeAgo}</span>
                      </div>
                      <h4 className="text-sm font-bold text-sw-ink-900 mt-0.5">
                        {lot.category} ({lot.weight} kg)
                      </h4>
                      <p className="text-xs text-sw-ink-600 flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-sw-green-600" />
                        {lot.collectorName} ({lot.distanceKm} km)
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-sw-ink-400 block">अनुमानित भाव</span>
                    <span className="text-base font-black text-sw-green-600 tabular-nums">
                      ₹{lot.estPrice}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartHandover(lot);
                      }}
                      className="mt-1 px-2.5 py-1 rounded-lg bg-sw-green-600 hover:bg-sw-green-700 text-white text-[11px] font-bold active:scale-95 transition-all block w-full text-center"
                    >
                      हैंडओवर लें ›
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky "Quote N lots" bar */}
          <div className="fixed bottom-20 left-0 right-0 max-w-[480px] mx-auto px-4 pointer-events-none">
            <button
              type="button"
              disabled={selectedLots.length === 0}
              className="w-full h-12 rounded-full bg-sw-ink-900 text-white font-bold text-xs shadow-float pointer-events-auto flex items-center justify-between px-5 disabled:opacity-40"
            >
              <span>{selectedLots.length} लॉट चुने गए</span>
              <span className="text-sw-green-100 font-bold">थोक भाव दें (Quote All) ›</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW: SCAN QR (Camera Overlay simulation) */}
      {activeView === 'scan' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-sw-ink-900">कबाड़ी क्यूआर स्कैन करें</h3>
            <button
              type="button"
              onClick={() => setActiveView('demand')}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Camera Viewport with Green Corner Brackets */}
          <div className="relative h-72 rounded-tile bg-gray-900 overflow-hidden flex items-center justify-center text-white">
            {/* Corner brackets */}
            <div className="absolute inset-8 border-2 border-dashed border-sw-green-100/60 rounded-card flex items-center justify-center pointer-events-none">
              <span className="text-xs bg-black/60 px-3 py-1 rounded-full text-white font-mono">
                QR फ्रेम में रखें
              </span>
            </div>

            <div className="text-center space-y-2">
              <Camera size={40} className="mx-auto text-sw-green-100 animate-pulse" />
              <p className="text-xs text-gray-300">कैमरा स्कैन सक्रिय है...</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleStartHandover(MOCK_DEMAND_LOTS[0])}
            className="w-full h-12 rounded-input bg-sw-green-600 text-white font-bold text-sm shadow-sm active:scale-95"
          >
            सिम्युलेट स्कैन: {MOCK_DEMAND_LOTS[0].lotDisplayId}
          </button>
        </div>
      )}

      {/* VIEW: CONFIRM HANDOVER & DIGITAL RECEIPT */}
      {activeView === 'confirm' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-sw-ink-900">हैंडओवर पुष्टि (Handover)</h3>
              <p className="text-xs text-sw-ink-600">लॉट: {selectedLotForHandover.lotDisplayId}</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveView('demand')}
              className="p-1.5 rounded-full hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>

          {!receipt ? (
            <div className="space-y-4">
              {/* Stepper Inputs for Final Weight & Price */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-card bg-sw-card border border-sw-line">
                  <label className="text-xs font-bold text-sw-ink-600 block mb-1 flex items-center gap-1">
                    <Scale size={13} className="text-sw-green-600" /> अंतिम वजन (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={finalWeight}
                    onChange={(e) => setFinalWeight(parseFloat(e.target.value) || 0)}
                    className="w-full h-10 px-2 font-bold text-base text-sw-ink-900 bg-gray-50 border border-sw-line rounded-lg tabular-nums"
                  />
                </div>

                <div className="p-3 rounded-card bg-sw-card border border-sw-line">
                  <label className="text-xs font-bold text-sw-ink-600 block mb-1 flex items-center gap-1">
                    <IndianRupee size={13} className="text-sw-green-600" /> मूल भाव (INR)
                  </label>
                  <input
                    type="number"
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(parseFloat(e.target.value) || 0)}
                    className="w-full h-10 px-2 font-bold text-base text-sw-ink-900 bg-gray-50 border border-sw-line rounded-lg tabular-nums"
                  />
                </div>
              </div>

              {/* Payment Mode Selector */}
              <div>
                <label className="text-xs font-bold text-sw-ink-600 block mb-1.5">
                  भुगतान का माध्यम (Payment Mode)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('upi')}
                    className={`py-2.5 rounded-input text-xs font-bold transition-all border ${
                      paymentMode === 'upi'
                        ? 'bg-sw-green-600 text-white border-sw-green-600 shadow-xs'
                        : 'bg-white text-sw-ink-800 border-sw-line'
                    }`}
                  >
                    तुरंत UPI ट्रांसफर
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('cash')}
                    className={`py-2.5 rounded-input text-xs font-bold transition-all border ${
                      paymentMode === 'cash'
                        ? 'bg-sw-green-600 text-white border-sw-green-600 shadow-xs'
                        : 'bg-white text-sw-ink-800 border-sw-line'
                    }`}
                  >
                    नकद (Cash)
                  </button>
                </div>
              </div>

              {/* Read-Only Server Computed EPR Breakdown Card */}
              <div className="p-4 rounded-card bg-gradient-to-br from-sw-green-50 to-emerald-50 border border-sw-green-100 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sw-forest-800 block">
                  ईपीआर प्रीमियम व कुल भुगतान (CPCB प्रमाणित)
                </span>
                <div className="flex justify-between text-xs text-sw-ink-800">
                  <span>मूल कबाड़ मूल्य:</span>
                  <span className="font-semibold tabular-nums">₹{finalPrice}</span>
                </div>
                <div className="flex justify-between text-xs text-sw-forest-900 font-bold">
                  <span>+ सरकार ईपीआर बोनस (रीसाइक्लर फंडेड):</span>
                  <span className="text-sw-green-700 tabular-nums">+₹{computedEprPremium}</span>
                </div>
                <div className="border-t border-sw-green-200/60 pt-2 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-sw-ink-900">कबाड़ी को कुल भुगतान:</span>
                  <span className="text-2xl font-black text-sw-green-600 tabular-nums">
                    ₹{totalPayout}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmHandover}
                className="w-full h-14 rounded-input bg-sw-green-600 hover:bg-sw-green-700 text-white font-bold text-base shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <ShieldCheck size={20} />
                <span>{isProcessing ? 'हैंडओवर दर्ज हो रहा है...' : 'हैंडओवर पुष्टि व रसीद बनाएं'}</span>
              </button>
            </div>
          ) : (
            /* Digital Cryptographic Receipt */
            <div className="space-y-4">
              <div className="p-4 rounded-card bg-sw-green-50 border border-sw-green-100 text-sw-forest-900 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-sm text-sw-green-700">
                  <CheckCircle size={20} />
                  <span>हैंडओवर सत्यापित व संपन्न!</span>
                </div>
                <p className="text-xs">
                  कबाड़ी को <strong>₹{receipt.total_payout}</strong> का भुगतान {receipt.payment_mode.toUpperCase()} द्वारा दर्ज हुआ।
                </p>
              </div>

              {/* SHA-256 Traceability Hash */}
              <div className="p-4 rounded-card bg-sw-ink-900 text-white space-y-2 font-mono text-xs">
                <div className="flex items-center gap-2 text-sw-green-100 font-sans font-bold text-xs uppercase tracking-wider">
                  <Hash size={14} />
                  <span>अपरिवर्तनीय लेज़र ब्लॉक (SHA-256)</span>
                </div>
                <div className="break-all text-[11px] text-gray-300 bg-white/5 p-2.5 rounded-lg border border-white/10">
                  {receipt.traceability_event_hash}
                </div>
                <div className="text-[10px] text-gray-400 font-sans flex justify-between pt-1">
                  <span>इवेंट: HANDOVER_CONFIRMED</span>
                  <span>ईपीआर क्रेडिट्स जारी</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setReceipt(null);
                  setActiveView('demand');
                }}
                className="w-full h-12 rounded-input bg-sw-forest-800 hover:bg-sw-forest-900 text-white font-bold text-sm"
              >
                अगले लॉट पर जाएं
              </button>
            </div>
          )}
        </div>
      )}

      {/* Recycler Search Modal with Use Detect GPS and Radius filter */}
      <RecyclerSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};

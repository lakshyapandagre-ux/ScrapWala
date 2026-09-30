'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Sparkles, 
  Trash2, 
  Plus, 
  Minus, 
  QrCode,
  Check
} from 'lucide-react';
import { ItemSelectSell, ScrapSellItem, SCRAP_CATALOG } from '../sell/ItemSelectSell';
import { UploadPicturesStep } from '../sell/UploadPicturesStep';
import { RequestSummaryStep } from '../sell/RequestSummaryStep';
import { ValueXray } from '../value-xray/ValueXray';
import { SyncBadge } from '../ui/SyncBadge';
import { LocationPermissionBanner } from '../ui/LocationPermissionBanner';
import { queueMutation } from '@/lib/sync-queue';
import { useI18n } from '@/lib/i18n';
import { useGeolocation } from '@/lib/hooks/useGeolocation';

export const LotWizard: React.FC<{
  onComplete?: (lotData: any) => void;
  onCancel?: () => void;
}> = ({ onComplete, onCancel }) => {
  const { lang, t } = useI18n();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedItems, setSelectedItems] = useState<ScrapSellItem[]>([SCRAP_CATALOG[0], SCRAP_CATALOG[1]]);
  const [photos, setPhotos] = useState<string[]>(['/demo_pcb.jpg']);
  const [userNote, setUserNote] = useState('');
  const [weight, setWeight] = useState<number>(2.0);
  const [locationName, setLocationName] = useState('Pithampur Industrial Area, Indore');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdLot, setCreatedLot] = useState<any>(null);

  // Auto-detect GPS on mount
  const geo = useGeolocation();
  const [pinPosition, setPinPosition] = useState<{ lat: number; lng: number }>({
    lat: 22.7196,
    lng: 75.8577,
  });
  const [isDraggingPin, setIsDraggingPin] = useState(false);

  React.useEffect(() => {
    geo.detect();
  }, []);

  React.useEffect(() => {
    if (geo.lat && geo.lng) {
      setPinPosition({ lat: geo.lat, lng: geo.lng });
      if (geo.locality) {
        setLocationName(`${geo.locality}${geo.district ? ', ' + geo.district : ''}`);
      }
    }
  }, [geo.lat, geo.lng, geo.locality, geo.district]);

  // Stepper handlers
  const handleWeightChange = (delta: number) => {
    setWeight((prev) => Math.max(0.5, Math.round((prev + delta) * 10) / 10));
  };

  const primaryItem = selectedItems[0] || SCRAP_CATALOG[0];
  const lowRate = Math.round(primaryItem.ratePerKg * 0.9);
  const highRate = Math.round(primaryItem.ratePerKg * 1.12);
  const currentValuation = {
    estimated_value: Math.round(primaryItem.ratePerKg * weight),
    market_rate_per_kg: primaryItem.ratePerKg,
    market_range: {
      low: Math.round(lowRate * weight),
      high: Math.round(highRate * weight),
    },
    composition_estimate: {
      copper_g: Math.round(200 * weight),
      gold_mg: Math.round(30 * weight),
      silver_g: Math.round(1.0 * weight),
      critical_minerals_detected: ['Copper (तांबा)', 'Gold (सोना)'],
      hazardous_components: ['सुरक्षित रीसाइक्लिंग अनिवार्य'],
    },
    confidence: 'medium' as const,
    data_freshness: new Date().toISOString(),
  };

  const handleSubmitLot = async () => {
    setIsSubmitting(true);
    const collectorId = 'c1111111-1111-1111-1111-111111111111';
    const payload = {
      collector_id: collectorId,
      material_category: primaryItem.category,
      approximate_weight: weight,
      unit: 'kg',
      gps_lat: pinPosition.lat,
      gps_lng: pinPosition.lng,
      photos,
    };

    try {
      const { idempotencyKey } = await queueMutation('lot', payload);
      const generatedLot = {
        lot_id: 'lot-' + idempotencyKey.slice(0, 8),
        lot_display_id: `EW-IND-20260928-${Math.floor(1000 + Math.random() * 9000)}`,
        ...payload,
        valuation: currentValuation,
        syncStatus: 'pending',
      };
      setCreatedLot(generatedLot);
      setStep(5);
      if (onComplete) onComplete(generatedLot);
    } catch (e) {
      console.error('Error queuing lot:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // STEP 1: SCREENSHOT 3 PATTERN (Item Selection)
  if (step === 1) {
    return (
      <ItemSelectSell
        onBack={onCancel || (() => {})}
        onContinue={(chosen) => {
          setSelectedItems(chosen);
          setStep(2);
        }}
      />
    );
  }

  // STEP 2: SCREENSHOT 1 PATTERN (Upload Pictures & Keep In Mind 2x2)
  if (step === 2) {
    return (
      <UploadPicturesStep
        onBack={() => setStep(1)}
        onSkip={() => setStep(3)}
        onContinue={(uploadedPhotos, note) => {
          setPhotos(uploadedPhotos);
          setUserNote(note);
          setStep(3);
        }}
      />
    );
  }

  // STEP 4: SCREENSHOT 1 PATTERN (Request Summary)
  if (step === 4) {
    return (
      <RequestSummaryStep
        selectedItems={selectedItems}
        location={locationName}
        weight={weight}
        userNote={userNote}
        photos={photos}
        onBack={() => setStep(3)}
        onDiscard={onCancel || (() => setStep(1))}
        onConfirm={handleSubmitLot}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-[92dvh] justify-between pb-24 bg-[#F6F8F6]">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {step > 1 && step < 5 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700 active:scale-95"
            >
              <ArrowLeft size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700 active:scale-95"
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <div>
            <span className="text-[11px] font-black text-[#2E7D1F] uppercase tracking-wider">
              Step {step} of 4
            </span>
            <h3 className="text-sm font-extrabold text-[#14181A]">
              {step === 3 && 'Weight & Location'}
              {step === 5 && 'Lot Ready'}
            </h3>
          </div>
        </div>

        {step < 5 && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-bold text-red-600 px-2.5 py-1 rounded-lg hover:bg-red-50 flex items-center gap-1"
          >
            <Trash2 size={13} />
            <span>Cancel</span>
          </button>
        )}
      </div>

      <div className="p-4 flex-1 space-y-4">
        {/* STEP 3: WEIGHT STEPPER & GPS */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-3">
              <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block">
                Approximate Weight (kg)
              </span>

              <div className="flex items-center justify-between gap-4 py-2">
                <button
                  type="button"
                  onClick={() => handleWeightChange(-0.5)}
                  className="w-13 h-13 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-black text-xl flex items-center justify-center active:scale-95 transition-all shadow-2xs"
                >
                  <Minus size={22} />
                </button>

                <div className="text-center">
                  <span className="text-5xl font-black text-[#0B3D2E] tabular-nums tracking-tight">
                    {weight}
                  </span>
                  <span className="text-base font-bold text-gray-500 ml-1.5">kg</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleWeightChange(0.5)}
                  className="w-13 h-13 rounded-full bg-[#EFFAEB] hover:bg-emerald-100 text-[#2E7D1F] font-black text-xl flex items-center justify-center active:scale-95 transition-all shadow-2xs"
                >
                  <Plus size={22} />
                </button>
              </div>

              {/* Quick weight chips */}
              <div className="flex gap-2 pt-2">
                {[1, 2, 5, 10, 25].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWeight(w)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      weight === w
                        ? 'bg-[#2E7D1F] text-white shadow-2xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {w} kg
                  </button>
                ))}
              </div>
            </div>

            {/* GPS Location & Draggable Map Pin Card */}
            <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#EFFAEB] text-[#2E7D1F]">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#14181A] block">
                      पिकअप स्थान व जीपीएस (Pickup Location & Pin)
                    </span>
                    <span className="text-[11px] text-gray-500 font-mono">
                      {pinPosition.lat.toFixed(4)}, {pinPosition.lng.toFixed(4)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={geo.detect}
                  disabled={geo.status === 'locating'}
                  className="px-3 py-1.5 rounded-full bg-[#EFFAEB] hover:bg-[#E0F5DA] text-[#2E7D1F] border border-[#C5EBC2] text-xs font-bold flex items-center gap-1 active:scale-95 transition-all disabled:opacity-50"
                >
                  <MapPin size={13} className={geo.status === 'locating' ? 'animate-bounce' : ''} />
                  <span>{geo.status === 'locating' ? 'ढूंढ रहे हैं...' : '📍 Auto GPS'}</span>
                </button>
              </div>

              {/* Required error/permission banner if permission denied / timeout */}
              <LocationPermissionBanner
                status={geo.status}
                errorMsg={geo.errorMsg}
                errorType={geo.errorType}
                onRetry={geo.detect}
              />

              {/* Interactive Draggable Simulated Map Canvas */}
              <div
                className="relative h-44 rounded-xl bg-emerald-950/10 border border-emerald-900/20 overflow-hidden select-none cursor-crosshair group shadow-inner"
                style={{
                  backgroundImage: `radial-gradient(#2E7D1F 1px, transparent 1px), radial-gradient(#2E7D1F 1px, #F4FAF4 1px)`,
                  backgroundSize: '24px 24px',
                  backgroundPosition: '0 0, 12px 12px',
                }}
                onMouseDown={() => setIsDraggingPin(true)}
                onMouseUp={() => setIsDraggingPin(false)}
                onMouseLeave={() => setIsDraggingPin(false)}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const xRel = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
                  const yRel = (e.clientY - rect.top) / rect.height - 0.5;
                  const newLat = Math.round((pinPosition.lat - yRel * 0.04) * 10000) / 10000;
                  const newLng = Math.round((pinPosition.lng + xRel * 0.04) * 10000) / 10000;
                  setPinPosition({ lat: newLat, lng: newLng });
                }}
                onTouchEnd={(e) => {
                  if (e.changedTouches && e.changedTouches[0]) {
                    const touch = e.changedTouches[0];
                    const rect = e.currentTarget.getBoundingClientRect();
                    const xRel = (touch.clientX - rect.left) / rect.width - 0.5;
                    const yRel = (touch.clientY - rect.top) / rect.height - 0.5;
                    const newLat = Math.round((pinPosition.lat - yRel * 0.04) * 10000) / 10000;
                    const newLng = Math.round((pinPosition.lng + xRel * 0.04) * 10000) / 10000;
                    setPinPosition({ lat: newLat, lng: newLng });
                  }
                }}
              >
                {/* Decorative Roads / Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-40">
                  <div className="absolute top-1/2 left-0 right-0 h-4 bg-white/70 border-y border-emerald-600/30" />
                  <div className="absolute left-1/3 top-0 bottom-0 w-4 bg-white/70 border-x border-emerald-600/30" />
                  <div className="absolute left-2/3 top-0 bottom-0 w-3 bg-amber-100/70 border-x border-amber-400/40" />
                </div>

                {/* Draggable Map Pin in Center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="relative flex flex-col items-center -translate-y-4 animate-in fade-in zoom-in">
                    {/* Pin Bubble */}
                    <div className="px-2 py-0.5 rounded-full bg-[#14181A] text-white text-[10px] font-bold shadow-md whitespace-nowrap mb-1 flex items-center gap-1 border border-white/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>{locationName ? locationName.split(',')[0] : 'लॉट लोकेशन'}</span>
                    </div>

                    {/* Red Map Pin SVG */}
                    <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-red-500/20">
                      <MapPin size={20} className="fill-white text-red-600" />
                    </div>

                    {/* Ground Shadow Ripple */}
                    <div className="w-4 h-1.5 rounded-full bg-black/30 blur-[1px] mt-0.5" />
                  </div>
                </div>

                {/* Touch/Drag hint pill */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                  <span className="text-[10px] font-bold bg-white/90 backdrop-blur-xs text-gray-700 px-2 py-0.5 rounded-md border border-gray-200 shadow-2xs">
                    👆 पिन खिसकाने के लिए मैप पर टैप करें (Tap to drag/override)
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-[#EFFAEB] text-[#2E7D1F] px-2 py-0.5 rounded-md border border-[#C5EBC2]">
                    GPS Live ✓
                  </span>
                </div>
              </div>

              {/* Editable Locality Text Input (Fallback / Detail) */}
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                  पता या लैंडमार्क (Address / Landmark):
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="उदा. पीथमपुर सेक्टर 3, इंदौर"
                  className="w-full h-10 px-3 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#2E7D1F] bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}



        {/* STEP 5: SUCCESS QR SCREEN */}
        {step === 5 && createdLot && (
          <div className="space-y-4 text-center py-2">
            <div className="w-14 h-14 rounded-full bg-[#EFFAEB] text-[#2E7D1F] mx-auto flex items-center justify-center">
              <Check size={28} strokeWidth={3} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-[#14181A]">
                Lot Created Successfully!
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Show this QR code to the authorized recycler
              </p>
            </div>

            {/* 200px White QR Card */}
            <div className="w-56 h-56 mx-auto p-4 rounded-3xl bg-white border border-gray-200 shadow-md flex flex-col items-center justify-center">
              <QrCode size={160} className="text-[#0B3D2E]" />
              <span className="font-mono text-xs font-bold text-[#0B3D2E] mt-2">
                {createdLot.lot_display_id}
              </span>
            </div>

            <div className="flex justify-center">
              <SyncBadge status={createdLot.syncStatus} />
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-40 max-w-[480px] mx-auto p-4 bg-white border-t border-gray-200">
        {step === 3 && (
          <button
            type="button"
            onClick={() => setStep(4)}
            className="w-full h-13 rounded-2xl bg-[#2E7D1F] hover:bg-[#256618] active:scale-98 text-white font-extrabold text-sm shadow-md flex items-center justify-between px-5 transition-all"
          >
            <span>{weight} kg · {primaryItem.name}</span>
            <span>{t.continueBtn} ›</span>
          </button>
        )}



        {step === 5 && (
          <button
            type="button"
            onClick={() => {
              setStep(1);
              setCreatedLot(null);
            }}
            className="w-full h-13 rounded-2xl bg-[#0B3D2E] hover:bg-black active:scale-98 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <span>Create Another Lot</span>
          </button>
        )}
      </div>
    </div>
  );
};

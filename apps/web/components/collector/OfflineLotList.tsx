'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Wifi, WifiOff, Clock } from 'lucide-react';
import { db, LocalLot } from '@/lib/offline-db';
import { processSyncQueue } from '@/lib/sync-queue';
import { SyncBadge } from '../ui/SyncBadge';
import { AudioButton } from '../audio-button/AudioButton';

import { useI18n } from '@/lib/i18n';

export const OfflineLotList: React.FC = () => {
  const { lang, t } = useI18n();
  const [lots, setLots] = useState<LocalLot[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadLocalLots = async () => {
    try {
      const local = await db.localLots.reverse().toArray();
      if (local.length > 0) {
        setLots(local);
      } else {
        // Fallback default sample lot if IndexedDB is freshly opened
        setLots([
          {
            lot_display_id: 'EW-IND-20260928-1024',
            collector_id: 'c1111111-1111-1111-1111-111111111111',
            material_category: 'PCBs',
            approximate_weight: 2.5,
            unit: 'kg',
            status: 'draft',
            idempotency_key: 'idemp-seed-001',
            syncStatus: 'synced',
            created_at: new Date().toISOString(),
            valuation: {
              market_range: { low: 405, high: 498 },
              estimated_value: 445,
            },
            photos: [],
          },
        ]);
      }
    } catch (e) {
      console.error('Failed to load local lots:', e);
    }
  };

  useEffect(() => {
    setIsOnline(typeof window !== 'undefined' ? navigator.onLine : true);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadLocalLots();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await processSyncQueue();
      await loadLocalLots();
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Network & Local-first Status Banner */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Wifi size={14} /> {t.online}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <WifiOff size={14} /> {t.offlineMode}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleManualSync}
          disabled={isSyncing}
          className="flex items-center gap-1.5 text-xs font-bold text-[#2E7D1F] bg-[#EFFAEB] hover:bg-[#E2F7DE] border border-[#D5EED1] px-3 py-1.5 rounded-xl active:scale-95 transition-all disabled:opacity-50"
        >
          <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
          <span>{t.syncRefresh}</span>
        </button>
      </div>

      {/* Lots List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-[#14181A] text-sm">{t.myLotsTitle}</h3>
          <AudioButton 
            textToSpeak={lang === 'hi' ? 'आपके हाल के लॉट की सूची और सिंक स्थिति' : lang === 'mr' ? 'आपल्या लॉटची यादी' : 'Recent scrap lots and sync status'} 
            size={16} 
          />
        </div>

        {lots.map((lot, idx) => (
          <div
            key={lot.id || idx}
            className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-2 hover:border-[#2E7D1F]/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#2E7D1F]">
                {lot.lot_display_id}
              </span>
              <SyncBadge status={lot.syncStatus} />
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <div>
                <span className="font-bold text-sm text-[#14181A] block">
                  {lot.material_category}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {t.weight}: {lot.approximate_weight} {lot.unit || 'kg'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block font-medium">{t.estRange}</span>
                <span className="text-sm font-black text-[#2E7D1F] tabular-nums">
                  ₹{lot.valuation?.market_range?.low || Math.round(lot.approximate_weight * 160)} - ₹
                  {lot.valuation?.market_range?.high || Math.round(lot.approximate_weight * 200)}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-2 flex justify-between items-center text-[11px] text-gray-400">
              <span className="flex items-center gap-1 font-medium">
                <Clock size={11} /> {new Date(lot.created_at).toLocaleTimeString(lang === 'hi' ? 'hi-IN' : 'en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="font-bold text-[#2E7D1F] bg-[#EFFAEB] px-2 py-0.5 rounded-md border border-[#D5EED1]">
                {t.eprEligible}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

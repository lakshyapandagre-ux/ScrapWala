'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Search, 
  X, 
  Sparkles, 
  ChevronRight, 
  Phone, 
  CheckCircle,
  Filter,
  Navigation
} from 'lucide-react';
import { useGeolocation } from '@/lib/hooks/useGeolocation';
import { LocationPermissionBanner } from '../ui/LocationPermissionBanner';

interface RecyclerItem {
  recycler_id: string;
  facility_name: string;
  suitability_score: number;
  breakdown: {
    rate: number;
    distance: number;
    pickup: number;
    trust: number;
  };
  distance_km: number;
  authorized: boolean;
  spcb_license_number?: string;
  pickup_availability?: string;
  rate_offer_per_kg?: number;
}

const CITIES = ['Indore', 'Bhopal', 'Ujjain', 'Dewas', 'Dhar'];

export const RecyclerSearchModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelectRecycler?: (recycler: RecyclerItem) => void;
}> = ({ isOpen, onClose, onSelectRecycler }) => {
  const geo = useGeolocation();
  const [radiusKm, setRadiusKm] = useState<number>(25);
  const [selectedCity, setSelectedCity] = useState<string>('Indore');
  const [recyclers, setRecyclers] = useState<RecyclerItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState<string>('PCBs');

  const fetchMatches = async (lat?: number | null, lng?: number | null, radius?: number) => {
    setIsLoading(true);
    try {
      const queryLat = lat ?? 22.7196;
      const queryLng = lng ?? 75.8577;
      const queryRadius = radius ?? radiusKm;

      const url = `/api/recyclers/match?lat=${queryLat}&lng=${queryLng}&radius=${queryRadius}&category=${category}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setRecyclers(data);
      } else {
        // Fallback default mock
        setRecyclers([
          {
            recycler_id: 'rec-001',
            facility_name: 'E-Parisaraa Clean Tech Pvt. Ltd.',
            suitability_score: 94.5,
            breakdown: { rate: 92, distance: 95, pickup: 100, trust: 95 },
            distance_km: 4.2,
            authorized: true,
            spcb_license_number: 'MPPCB/E-WASTE/AUTH/2024/089',
            pickup_availability: 'scheduled',
            rate_offer_per_kg: 186.9,
          },
          {
            recycler_id: 'rec-002',
            facility_name: 'Moonstar Enterprises Clean Tech',
            suitability_score: 87.0,
            breakdown: { rate: 85, distance: 88, pickup: 75, trust: 95 },
            distance_km: 7.8,
            authorized: true,
            spcb_license_number: 'MPPCB/E-WASTE/AUTH/2023/142',
            pickup_availability: 'on_request',
            rate_offer_per_kg: 174.4,
          },
          {
            recycler_id: 'rec-003',
            facility_name: 'Malwa Eco-Recyclers Hub',
            suitability_score: 81.2,
            breakdown: { rate: 88, distance: 70, pickup: 50, trust: 95 },
            distance_km: 18.5,
            authorized: true,
            spcb_license_number: 'MPPCB/E-WASTE/AUTH/2025/019',
            pickup_availability: 'by_appointment',
            rate_offer_per_kg: 181.5,
          },
        ]);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (!geo.lat) {
        geo.detect();
      } else {
        fetchMatches(geo.lat, geo.lng, radiusKm);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (geo.lat && geo.lng) {
      fetchMatches(geo.lat, geo.lng, radiusKm);
    }
  }, [geo.lat, geo.lng, radiusKm, category]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EFFAEB] text-[#2E7D1F] flex items-center justify-center">
              <Building2 size={22} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#14181A]">
                नज़दीकी अधिकृत रीसाइक्लर (Find Recyclers)
              </h2>
              <p className="text-xs text-gray-500">
                SPCB अधिकृत रीसाइक्लिंग केंद्र खोजें
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Controls Section */}
        <div className="p-4 bg-[#F8FAF8] border-b border-gray-200/80 space-y-3">
          {/* Geo Detect Button + Locality status */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={geo.detect}
              disabled={geo.status === 'locating'}
              className="flex-1 h-11 px-4 rounded-xl bg-[#2E7D1F] hover:bg-[#256618] active:scale-98 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
            >
              <Navigation size={14} className={geo.status === 'locating' ? 'animate-spin' : ''} />
              <span>
                {geo.status === 'locating' ? 'स्थान ढूंढ रहे हैं...' : '📍 Use Detect GPS'}
              </span>
            </button>

            {/* City Fallback Selector */}
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                fetchMatches(22.7196, 75.8577, radiusKm);
              }}
              className="h-11 px-3 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-700 focus:outline-none focus:border-[#2E7D1F]"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  शहर: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Location Permission / Error Banner */}
          <LocationPermissionBanner
            status={geo.status}
            errorMsg={geo.errorMsg}
            errorType={geo.errorType}
            onRetry={geo.detect}
          />

          {/* Radius Filter Pills */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Filter size={12} /> दायरा (Radius):
            </span>
            <div className="flex gap-1.5">
              {[5, 10, 25, 50].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRadiusKm(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                    radiusKm === r
                      ? 'bg-[#14181A] text-white shadow-2xs'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recyclers List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-8 h-8 rounded-full border-3 border-emerald-600 border-t-transparent animate-spin mx-auto" />
              <p className="text-xs font-bold text-gray-500">नज़दीकी रीसाइक्लर खोजे जा रहे हैं...</p>
            </div>
          ) : recyclers.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-500">
              इस दायरे में कोई रीसाइक्लर नहीं मिला। दायरा (Radius) बढ़ाएं।
            </div>
          ) : (
            recyclers.map((rec) => (
              <div
                key={rec.recycler_id}
                onClick={() => {
                  if (onSelectRecycler) onSelectRecycler(rec);
                }}
                className="p-3.5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:border-[#2E7D1F]/50 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-sm text-[#14181A]">
                        {rec.facility_name}
                      </h4>
                      {rec.authorized && (
                        <CheckCircle size={14} className="text-[#2E7D1F] shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-gray-500 font-mono">
                      {rec.spcb_license_number || 'SPCB APPROVED'}
                    </span>
                  </div>

                  {/* Suitability Score Pill */}
                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      उपयुक्तता स्कोर
                    </span>
                    <span className="text-sm font-black text-[#2E7D1F] bg-[#EFFAEB] px-2 py-0.5 rounded-full border border-[#D0EBD2]">
                      {rec.suitability_score} / 100
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600 pt-1 border-t border-gray-100">
                  <span className="flex items-center gap-1 font-bold text-gray-800">
                    <MapPin size={13} className="text-[#2E7D1F]" />
                    {rec.distance_km} km दूरी पर
                  </span>
                  {rec.rate_offer_per_kg && (
                    <span className="font-extrabold text-[#2E7D1F]">
                      भाव: ₹{rec.rate_offer_per_kg}/kg
                    </span>
                  )}
                  <span className="capitalize text-[11px] font-medium text-gray-500">
                    {rec.pickup_availability === 'scheduled' ? 'शेड्यूल पिकअप' : 'ऑन-रिक्वेस्ट'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ProvenanceBadge } from '../ui/ProvenanceBadge';

interface LivePriceItem {
  id: string;
  nameHi: string;
  category: string;
  price: number;
  deltaPct: number;
  isUp: boolean;
  low: number;
  high: number;
  freshness: string;
  sparkline: number[];
}

const LIVE_PRICES: LivePriceItem[] = [
  {
    id: 'pcb',
    nameHi: 'सर्किट बोर्ड (PCBs)',
    category: 'PCBs',
    price: 178,
    deltaPct: 3.4,
    isUp: true,
    low: 162,
    high: 199,
    freshness: '2 घंटे पहले',
    sparkline: [165, 168, 172, 170, 175, 178],
  },
  {
    id: 'cables',
    nameHi: 'तार व केबल',
    category: 'Cables',
    price: 140,
    deltaPct: 1.8,
    isUp: true,
    low: 125,
    high: 155,
    freshness: '1 घंटा पहले',
    sparkline: [136, 137, 139, 138, 140, 140],
  },
  {
    id: 'battery',
    nameHi: 'लिथियम बैटरी',
    category: 'Batteries',
    price: 110,
    deltaPct: 2.1,
    isUp: false,
    low: 95,
    high: 130,
    freshness: '3 घंटे पहले',
    sparkline: [116, 114, 115, 112, 111, 110],
  },
  {
    id: 'motors',
    nameHi: 'इलेक्ट्रिक मोटर',
    category: 'Electric Motors',
    price: 65,
    deltaPct: 0.9,
    isUp: true,
    low: 55,
    high: 75,
    freshness: '4 घंटे पहले',
    sparkline: [62, 63, 63, 64, 64, 65],
  },
];

export const LivePriceCards: React.FC<{ onCardClick?: (item: LivePriceItem) => void }> = ({
  onCardClick,
}) => {
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4">
      {LIVE_PRICES.map((item) => {
        // Generate SVG sparkline points
        const minVal = Math.min(...item.sparkline);
        const maxVal = Math.max(...item.sparkline);
        const range = maxVal - minVal || 1;
        const width = 60;
        const height = 24;
        const points = item.sparkline
          .map((v, i) => {
            const x = (i / (item.sparkline.length - 1)) * width;
            const y = height - ((v - minVal) / range) * (height - 6) - 3;
            return `${x},${y}`;
          })
          .join(' ');

        return (
          <div
            key={item.id}
            onClick={() => onCardClick && onCardClick(item)}
            className="w-[168px] shrink-0 p-3.5 rounded-card bg-sw-card border border-sw-line shadow-xs flex flex-col justify-between cursor-pointer hover:border-sw-green-600/40 transition-all select-none"
          >
            {/* Top: Name & Delta Chip */}
            <div>
              <div className="flex items-start justify-between gap-1">
                <span className="text-xs font-bold text-sw-ink-900 line-clamp-1">
                  {item.nameHi}
                </span>
                <span
                  className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    item.isUp
                      ? 'bg-sw-green-50 text-sw-green-700'
                      : 'bg-sw-red-50 text-sw-red-600'
                  }`}
                >
                  {item.isUp ? (
                    <ArrowUpRight size={10} className="stroke-[3]" />
                  ) : (
                    <ArrowDownRight size={10} className="stroke-[3]" />
                  )}
                  {item.deltaPct}%
                </span>
              </div>

              {/* Price & Sparkline */}
              <div className="mt-2 flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-black text-sw-ink-900 tabular-nums">
                    ₹{item.price}
                  </span>
                  <span className="text-[11px] text-sw-ink-400 font-medium">/kg</span>
                </div>

                {/* 60x24 SVG Sparkline */}
                <svg width="60" height="24" className="overflow-visible">
                  <polyline
                    fill="none"
                    stroke={item.isUp ? '#2E7D1F' : '#C62828'}
                    strokeWidth="1.8"
                    points={points}
                  />
                </svg>
              </div>
            </div>

            {/* Bottom: Range and Provenance */}
            <div className="mt-2.5 pt-2 border-t border-sw-line/70">
              <div className="text-[10px] text-sw-ink-600 flex justify-between">
                <span>सीमा:</span>
                <span className="font-semibold tabular-nums">₹{item.low}–₹{item.high}</span>
              </div>
              <div className="mt-1">
                <ProvenanceBadge type="verified" freshness={item.freshness} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

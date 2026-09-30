'use client';

import React from 'react';
import { AlertTriangle, MapPinOff, RefreshCw, X, ChevronRight, Navigation } from 'lucide-react';
import { GeoStatus } from '@/lib/hooks/useGeolocation';

interface LocationPermissionBannerProps {
  status: GeoStatus;
  errorMsg?: string;
  errorType?: 'denied' | 'disabled' | 'timeout' | 'unavailable' | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export const LocationPermissionBanner: React.FC<LocationPermissionBannerProps> = ({
  status,
  errorMsg,
  errorType,
  onRetry,
  onDismiss,
  className = '',
}) => {
  if (status !== 'denied' && status !== 'error') {
    return null;
  }

  const isDenied = status === 'denied' || errorType === 'denied';
  const isDisabled = errorType === 'disabled';

  return (
    <div
      className={`rounded-2xl p-3.5 border transition-all text-xs shadow-xs ${
        isDenied
          ? 'bg-[#FFFBEB] border-amber-300 text-amber-900'
          : 'bg-[#FEF2F2] border-red-200 text-red-900'
      } ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <div className="shrink-0 mt-0.5">
          {isDenied ? (
            <AlertTriangle size={18} className="text-amber-600" />
          ) : isDisabled ? (
            <MapPinOff size={18} className="text-red-500" />
          ) : (
            <AlertTriangle size={18} className="text-red-500" />
          )}
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-[13px] leading-tight">
              {isDenied
                ? 'लोकेशन की अनुमति दें ताकि सही दरें और नज़दीकी रीसाइकलर दिखें'
                : isDisabled
                ? 'GPS ऑन करें (Turn On GPS)'
                : 'लोकेशन नहीं मिल पाई (Location Timeout)'}
            </span>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <p className="text-[11px] leading-normal opacity-90 font-medium">
            {isDenied ? (
              <span>
                ब्राउज़र सेटिंग्स में जाएं: <strong>Settings &gt; Site permissions &gt; Location</strong>
              </span>
            ) : isDisabled ? (
              <span>डिवाइस की क्विक सेटिंग्स / कंट्रोल सेंटर में जाकर Location / GPS चालू करें।</span>
            ) : (
              <span>{errorMsg || 'सिग्नल कमज़ोर हो सकता है। दोबारा कोशिश करें या नीचे से शहर चुनें।'}</span>
            )}
          </p>

          <div className="pt-1 flex items-center gap-2">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs ${
                  isDenied
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                <RefreshCw size={12} />
                <span>दोबारा जांचें (Retry)</span>
              </button>
            )}
            <span className="text-[10px] text-gray-500 font-medium">
              (मैन्युअल शहर चयन हमेशा उपलब्ध है)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

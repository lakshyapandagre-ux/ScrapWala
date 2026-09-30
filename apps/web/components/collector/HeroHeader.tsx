'use client';

import React from 'react';
import { MapPin, ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { AudioButton } from '../audio-button/AudioButton';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';

interface HeroHeaderProps {
  locality: string;
  onLocationClick: () => void;
  onSellClick: () => void;
  status?: string;
  isLocating?: boolean;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  locality = 'Indore',
  onLocationClick,
  onSellClick,
  status,
  isLocating = false,
}) => {
  const { lang, t } = useI18n();
  const { profile } = useAuth();
  const userName = profile?.fullName ? profile.fullName.split(' ')[0] : 'Lakshya';
  const locatingActive = isLocating || status === 'locating';

  return (
    <div className="p-4 pt-3 space-y-3 bg-white">
      {/* Top Location Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onLocationClick}
          className={`location-pill flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-extrabold transition-all active:scale-95 shadow-2xs ${
            locatingActive
              ? 'bg-amber-50 border-amber-300 text-amber-800 animate-pulse'
              : 'bg-[#F4FAF4] hover:bg-[#EAF6EA] border-[#D0EBD2] text-[#2E7D1F]'
          }`}
          title="जीपीएस लोकेशन अपडेट करें"
        >
          <MapPin size={13} className={locatingActive ? 'text-amber-600 animate-bounce' : 'text-[#2E7D1F]'} />
          <span>{locatingActive ? (lang === 'hi' ? 'ढूंढ रहे हैं...' : lang === 'mr' ? 'शोधत आहे...' : 'Locating...') : locality || profile?.operatingCity || 'Indore'}</span>
          <ChevronDown size={13} className="opacity-70" />
        </button>

        <div className="flex items-center gap-1.5">
          <AudioButton
            textToSpeak={
              lang === 'hi'
                ? `नमस्ते ${userName}, स्क्रैपवाला में आपका स्वागत है। आज के दाम देखें या अभी बेचें।`
                : lang === 'mr'
                ? `नमस्कार ${userName}, स्क्रॅपवाला मध्ये आपले स्वागत आहे.`
                : `Hello ${userName}, welcome to ScrapWala. Sell e-waste for best rates.`
            }
            className="bg-[#F4FAF4] text-[#2E7D1F] border border-[#D0EBD2] hover:bg-[#EAF6EA]"
          />
        </div>
      </div>

      {/* Light Green & White Hero Card with Mascot Illustration */}
      <div 
        className="rounded-3xl p-4 sm:p-5 border border-[#D4EED2] relative overflow-hidden shadow-xs flex items-center justify-between gap-3"
        style={{
          background: 'linear-gradient(135deg, #F0FAF0 0%, #E8F7E7 60%, #E2F5E0 100%)',
        }}
      >
        {/* Left Side: Greeting & CTA */}
        <div className="space-y-2 z-10 flex-1">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 border border-[#2E7D1F]/20 text-[10px] font-black text-[#2E7D1F] uppercase tracking-wider">
            <Sparkles size={11} className="text-[#F5B301]" />
            <span>
              {lang === 'hi'
                ? 'ईपीआर अधिकृत रीसाइक्लिंग'
                : lang === 'mr'
                ? 'ईपीआर अधिकृत रीसायकलिंग'
                : 'EPR Authorized Recycling'}
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#14181A] leading-tight tracking-tight">
              {lang === 'hi' ? 'नमस्ते' : lang === 'mr' ? 'नमस्कार' : 'Hello'}, <span className="text-[#2E7D1F]">{userName}</span>! 👋
            </h1>
            <p className="text-xs text-gray-600 mt-1 font-medium leading-snug">
              {lang === 'hi'
                ? 'ई-कचरा बेचें, सही भाव व 30% EPR बोनस पाएं'
                : lang === 'mr'
                ? 'ई-कचरा विका, योग्य दर आणि ३०% EPR बोनस मिळवा'
                : 'Sell e-waste, get fair rates & 30% EPR bonus'}
            </p>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={onSellClick}
              className="h-10 px-5 rounded-full bg-[#2E7D1F] hover:bg-[#256618] active:scale-95 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <span>{lang === 'hi' ? 'अभी बेचें →' : lang === 'mr' ? 'आत्ता विका →' : 'Sell Now →'}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Indian Scrap Collector Mascot Sticker */}
        <div className="shrink-0 relative w-24 h-28 sm:w-28 sm:h-32 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#2E7D1F]/15 blur-lg" />
          <img
            src="/images/mascot.jpg"
            alt="ScrapWala Mitra"
            className="w-full h-full object-contain relative z-10 drop-shadow-md select-none pointer-events-none"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { 
  Building2, 
  Factory, 
  Car, 
  Star, 
  FileCheck2, 
  Search, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export const BulkScrapSection: React.FC<{ onSellClick: () => void }> = ({ onSellClick }) => {
  const { lang, t } = useI18n();

  return (
    <div className="space-y-6 pt-2">
      {/* SECTION 1: SELL BULK SCRAP (SCREENSHOT 4 PATTERN) */}
      <div className="space-y-3">
        {/* Title with trailing line */}
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-[#14181A] tracking-tight shrink-0">
              {lang === 'hi' ? 'थोक कबाड़ बेचें' : lang === 'mr' ? 'मोठ्या प्रमाणात कबाड़ विका' : 'Sell bulk scrap'}
            </h2>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {lang === 'hi'
              ? '100+ किग्रा कबाड़ है? बेहतर रेट और सीधा पिकअप पाएं।'
              : lang === 'mr'
              ? '१००+ किलो भंगार आहे का? चांगला दर मिळवा.'
              : 'Got 100+ kg of scrap? List it and get better rates.'}
          </p>
        </div>

        {/* 3 Pill Badges */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="px-3 py-1 rounded-full border border-[#F5B301] text-[#B45309] text-[10px] font-black uppercase tracking-wider bg-[#FFFBEB] flex items-center gap-1 shrink-0">
            <Star size={11} className="fill-[#F5B301] text-[#F5B301]" />
            {lang === 'hi' ? 'सर्वोत्तम भाव' : lang === 'mr' ? 'सर्वोत्तम दर' : 'BEST RATES'}
          </span>
          <span className="px-3 py-1 rounded-full border border-[#F5B301] text-[#B45309] text-[10px] font-black uppercase tracking-wider bg-[#FFFBEB] flex items-center gap-1 shrink-0">
            <FileCheck2 size={11} className="text-[#B45309]" />
            {lang === 'hi' ? 'प्रमाणित' : lang === 'mr' ? 'प्रमाणित' : 'COMPLIANCE'}
          </span>
          <span className="px-3 py-1 rounded-full border border-[#F5B301] text-[#B45309] text-[10px] font-black uppercase tracking-wider bg-[#FFFBEB] flex items-center gap-1 shrink-0">
            <Search size={11} className="text-[#B45309]" />
            {lang === 'hi' ? 'पारदर्शिता' : lang === 'mr' ? 'पारदर्शकता' : 'TRANSPARENCY'}
          </span>
        </div>

        {/* Horizontal Bulk Cards */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
          {/* Card 1: Mint Green Industrial */}
          <div 
            onClick={onSellClick}
            className="w-[260px] shrink-0 p-5 rounded-3xl border border-[#D5EED1] bg-[#EFF8EE] flex flex-col justify-between cursor-pointer select-none active:scale-[0.98] transition-all shadow-xs min-h-[170px]"
          >
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase text-[#2E7D1F] tracking-wider flex items-center gap-1">
                <Factory size={13} />
                {lang === 'hi' ? 'औद्योगिक' : lang === 'mr' ? 'औद्योगिक' : 'Industrial'}
              </span>
              <h3 className="text-base font-black text-[#14181A] leading-tight">
                {lang === 'hi' ? 'उद्योगों के लिए बल्क स्क्रैप' : lang === 'mr' ? 'उद्योगांसाठी बल्क स्क्रॅप' : 'Bulk Scrap Request For Industries'}
              </h3>
              <p className="text-xs text-gray-600 leading-snug">
                {lang === 'hi' 
                  ? 'फैक्ट्री और औद्योगिक कबाड़ आसानी से बेचें।'
                  : lang === 'mr'
                  ? 'कारखान्यातील भंगार सहज विका.'
                  : 'Make it easy for yourself to sell your bulk manufacturing scrap.'}
              </p>
            </div>

            <div className="pt-3">
              <button
                type="button"
                className="h-8 px-4 rounded-xl bg-[#2E7D1F] text-white text-xs font-black shadow-xs active:scale-95"
              >
                {lang === 'hi' ? 'अभी बेचें' : lang === 'mr' ? 'आत्ता विका' : 'Sell Now'}
              </button>
            </div>
          </div>

          {/* Card 2: Peach / Warm Commercial */}
          <div 
            onClick={onSellClick}
            className="w-[260px] shrink-0 p-5 rounded-3xl border border-[#FED7AA] bg-[#FFF7ED] flex flex-col justify-between cursor-pointer select-none active:scale-[0.98] transition-all shadow-xs min-h-[170px]"
          >
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase text-[#EA580C] tracking-wider flex items-center gap-1">
                <Building2 size={13} />
                {lang === 'hi' ? 'व्यावसायिक' : lang === 'mr' ? 'व्यावसायिक' : 'Commercial'}
              </span>
              <h3 className="text-base font-black text-[#14181A] leading-tight">
                {lang === 'hi' ? 'ऑफिस व कॉम्प्लेक्स के लिए' : lang === 'mr' ? 'कार्यालयांसाठी बल्क विनंती' : 'Bulk Request For Modern Offices'}
              </h3>
              <p className="text-xs text-gray-600 leading-snug">
                {lang === 'hi'
                  ? 'आईटी एसेट्स, कंप्यूटर और इलेक्ट्रॉनिक्स रीसाइक्लिंग।'
                  : lang === 'mr'
                  ? 'आयटी उपकरणे, संगणक औपचारिक विल्हेवाट.'
                  : 'IT assets, servers, computers and electronics formal disposal.'}
              </p>
            </div>

            <div className="pt-3">
              <button
                type="button"
                className="h-8 px-4 rounded-xl bg-[#EA580C] text-white text-xs font-black shadow-xs active:scale-95"
              >
                {lang === 'hi' ? 'अभी बेचें' : lang === 'mr' ? 'आत्ता विका' : 'Sell Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: WANT TO SCRAP YOUR VEHICLE? (SCREENSHOT 4 PATTERN) */}
      <div className="space-y-3">
        {/* Title with trailing line */}
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-[#14181A] tracking-tight shrink-0">
              {lang === 'hi' ? 'वाहन स्क्रैप करना चाहते हैं?' : lang === 'mr' ? 'वाहन भंगारात काढायचे आहे?' : 'Want to scrap your vehicle?'}
            </h2>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {lang === 'hi'
              ? 'पुराने 2-व्हीलर या 4-व्हीलर का सही भाव और RTO स्क्रैपेज सर्टिफिकेट पाएं।'
              : lang === 'mr'
              ? 'कमी वेळात वाहन भंगार करा आणि आरटीओ प्रमाणपत्र मिळवा.'
              : 'Scrap your vehicle in less time with ScrapWala. We offer best rates.'}
          </p>
        </div>

        {/* 3 Green Pill Badges */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="px-3 py-1 rounded-full border border-[#2E7D1F] text-[#2E7D1F] text-[10px] font-black uppercase tracking-wider bg-[#F4FAF4] flex items-center gap-1 shrink-0">
            {lang === 'hi' ? '₹ सर्वोत्तम भाव' : lang === 'mr' ? '₹ सर्वोत्तम दर' : '₹ BEST RATES'}
          </span>
          <span className="px-3 py-1 rounded-full border border-[#2E7D1F] text-[#2E7D1F] text-[10px] font-black uppercase tracking-wider bg-[#F4FAF4] flex items-center gap-1 shrink-0">
            <FileCheck2 size={11} className="text-[#2E7D1F]" />
            {lang === 'hi' ? 'प्रमाणित' : lang === 'mr' ? 'प्रमाणित' : 'COMPLIANCE'}
          </span>
          <span className="px-3 py-1 rounded-full border border-[#2E7D1F] text-[#2E7D1F] text-[10px] font-black uppercase tracking-wider bg-[#F4FAF4] flex items-center gap-1 shrink-0">
            <Search size={11} className="text-[#2E7D1F]" />
            {lang === 'hi' ? 'पारदर्शिता' : lang === 'mr' ? 'पारदर्शकता' : 'TRANSPARENCY'}
          </span>
        </div>

        {/* Dark Teal/Green Vehicle Scrapping Card */}
        <div 
          onClick={onSellClick}
          className="p-5 rounded-3xl text-white relative overflow-hidden shadow-md cursor-pointer select-none active:scale-[0.99] transition-all space-y-3"
          style={{
            background: 'linear-gradient(135deg, #1B3830 0%, #17332C 50%, #0F241F 100%)',
          }}
        >
          {/* Subtle vehicle graphic icon */}
          <div className="space-y-1 z-10 relative max-w-[280px]">
            <h3 className="text-xl font-black leading-tight">
              {lang === 'hi' ? 'वाहन स्क्रैपिंग हुई आसान!' : lang === 'mr' ? 'वाहन स्क्रॅपिंग झाले सोपे!' : 'Vehicle Scrapping Made Easy!'}
            </h3>
            <p className="text-xs text-gray-300 leading-snug">
              {lang === 'hi'
                ? '2-व्हीलर से लेकर भारी वाहनों तक का अधिकृत स्क्रैपेज।'
                : lang === 'mr'
                ? '२-चाकीपासून ते अवजड वाहनांपर्यंत सर्व अधिकृत स्क्रॅप करा.'
                : 'You can scrap any type of vehicle from 2 wheelers to commercial heavy vehicles with official certificate.'}
            </p>
          </div>

          <div className="pt-1 flex items-center justify-between z-10 relative">
            <span className="text-xs font-black text-[#D9F5D0] flex items-center gap-1.5 hover:underline">
              <span>{lang === 'hi' ? 'वाहन स्क्रैप करें' : lang === 'mr' ? 'वाहन स्क्रॅप करा' : 'Scrap your vehicle'}</span>
              <ArrowRight size={15} />
            </span>

            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
              <Car size={22} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

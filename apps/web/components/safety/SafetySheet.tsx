'use client';

import React from 'react';
import { X, Flame, Hammer, AlertTriangle, ShieldCheck, Ban } from 'lucide-react';
import { AudioButton } from '../audio-button/AudioButton';

interface SafetySheetProps {
  category: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SafetySheet: React.FC<SafetySheetProps> = ({
  category,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const safetyItems = [
    {
      icon: Flame,
      title: 'कभी न जलाएं (Don\'t Burn)',
      desc: 'जहरीला धुआं फेफड़ों को भारी नुकसान पहुंचाता है।',
      audio: 'इस सामग्री को कभी न जलाएं। जहरीला धुआं जानलेवा होता है।',
    },
    {
      icon: Hammer,
      title: 'हथौड़े से न तोड़ें',
      desc: 'शीशा या एसिड फटने का खतरा रहता है।',
      audio: 'इसे हथौड़े से न तोड़ें। एसिड या शीशा छिटक सकता है।',
    },
    {
      icon: Ban,
      title: 'नाली या कचरे में न फेंकें',
      desc: 'जहरीले रसायन भूजल को दूषित करते हैं।',
      audio: 'नाली या खुले कचरे में न फेंकें। जमीन और पानी खराब होता है।',
    },
    {
      icon: ShieldCheck,
      title: 'सीधा अधिकृत रीसाइक्लर को दें',
      desc: 'पूरी सुरक्षा के साथ सरकार मान्य ईपीआर बोनस पाएं।',
      audio: 'सीधे अधिकृत रीसाइक्लर को दें और पूरा ईपीआर बोनस पाएं।',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-[480px] bg-sw-card rounded-t-sheet sm:rounded-sheet p-6 shadow-sheet space-y-5 animate-in slide-in-from-bottom duration-250"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sw-amber-50 text-amber-700">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-sw-ink-900 leading-tight">
                कृपया ध्यान रखें (Keep in Mind)
              </h3>
              <p className="text-xs text-sw-ink-600">
                {category} के सुरक्षित निपटान के नियम
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sw-ink-600 transition-all active:scale-95"
            aria-label="बंद करें"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2x2 Safety Tiles */}
        <div className="grid grid-cols-2 gap-3">
          {safetyItems.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="relative p-3.5 rounded-tile bg-sw-amber-50 border border-amber-200/80 flex flex-col justify-between min-h-[110px]"
              >
                <div className="flex justify-between items-start">
                  <div className="relative">
                    <div className="p-2 rounded-xl bg-white text-sw-red-600 shadow-xs">
                      <IconComp size={18} />
                    </div>
                  </div>
                  <AudioButton textToSpeak={item.audio} size={15} />
                </div>
                <div className="mt-2">
                  <span className="text-xs font-bold text-sw-ink-900 block leading-tight">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-sw-ink-600 block mt-0.5 leading-snug">
                    {item.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full h-14 rounded-input bg-sw-green-600 hover:bg-sw-green-700 text-white font-bold text-base shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span>समझ गया (Got It)</span>
        </button>
      </div>
    </div>
  );
};

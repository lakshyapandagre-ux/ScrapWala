'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  SkipForward, 
  Image as ImageIcon, 
  Plus, 
  Lightbulb, 
  FileEdit, 
  Flame, 
  Hammer, 
  Trash2, 
  ShieldAlert,
  Check,
  X,
  Camera
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

import { WasteDetectionScanner } from '../ai/WasteDetectionScanner';

interface UploadPicturesStepProps {
  onBack: () => void;
  onSkip: () => void;
  onContinue: (photos: string[], note: string) => void;
}

export const UploadPicturesStep: React.FC<UploadPicturesStepProps> = ({
  onBack,
  onSkip,
  onContinue,
}) => {
  const { lang, t } = useI18n();
  const [photos, setPhotos] = useState<string[]>(['/demo_scrap.jpg']);
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [showAiScanner, setShowAiScanner] = useState(false);

  const keepInMindCards = [
    {
      title: 'We buy only in scrap rates',
      titleHi: 'केवल स्क्रैप भाव पर खरीद',
      titleMr: 'फक्त भंगार दराने खरेदी',
      icon: 'furniture',
    },
    {
      title: 'We do not buy raw Glass',
      titleHi: 'कच्चा शीशा स्वीकार नहीं',
      titleMr: 'काच स्वीकारत नाही',
      icon: 'glass',
    },
    {
      title: 'Do not burn e-waste',
      titleHi: 'घर पर कचरा कभी न जलाएं',
      titleMr: 'कचरा कधीही जाळू नका',
      icon: 'flame',
    },
    {
      title: 'Do not break batteries',
      titleHi: 'बैटरी हथौड़े से न तोड़ें',
      titleMr: 'बॅटरी फोडू नका',
      icon: 'acid',
    },
  ];

  const handleSimulateAddPhoto = () => {
    setShowAiScanner(true);
  };

  return (
    <div className="flex flex-col min-h-[92dvh] justify-between pb-24 bg-white">
      {/* Top Bar with < and Skip Pill (Screenshot 1 Pattern) */}
      <div className="p-4 pt-5 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 active:scale-95"
        >
          <ArrowLeft size={18} />
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="h-9 px-4 rounded-full bg-[#14181A] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-xs"
        >
          <SkipForward size={14} />
          <span>{t.skip}</span>
        </button>
      </div>

      <div className="px-5 space-y-4 flex-1">
        {/* Big Bold Headline (Screenshot 1 Pattern) */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#14181A] tracking-tight leading-tight">
            {t.uploadPicturesTitle}
          </h1>
        </div>

        {/* AI Scanner View or Upload Box */}
        {showAiScanner ? (
          <div className="space-y-2">
            <WasteDetectionScanner
              onClose={() => setShowAiScanner(false)}
              onMaterialSelected={(slug, detections) => {
                setPhotos(prev => [...prev, '/photo_ai_scanned.jpg']);
                setShowAiScanner(false);
              }}
            />
          </div>
        ) : (
          <div
            onClick={handleSimulateAddPhoto}
            className="h-40 rounded-2xl border-2 border-dashed border-[#2E7D1F]/40 hover:border-[#2E7D1F] bg-[#FAFBFB] flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all active:scale-[0.99] select-none shadow-xs group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-[#2E7D1F] mb-2 group-hover:scale-105 transition-transform">
              <Camera size={26} className="text-[#2E7D1F]" />
            </div>
            <span className="text-xs font-extrabold text-[#14181A] block">
              Scan with AI Waste Detector (YOLO11n)
            </span>
            <span className="text-[11px] text-gray-500 mt-0.5 font-medium">
              Tap to open camera or upload photo • {photos.length} photos ready
            </span>
          </div>
        )}

        {/* Tip Row with 💡 (Screenshot 1 Pattern) */}
        <div className="flex items-start gap-2.5 text-xs text-gray-600 leading-snug">
          <span className="text-base select-none">💡</span>
          <p className="text-[11px] text-gray-600 font-medium">
            {t.uploadTip}
          </p>
        </div>

        {/* Add a note Row with 📝 and + (Screenshot 1 Pattern) */}
        <div className="p-3.5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs font-bold text-[#14181A]">
              <FileEdit size={16} className="text-[#2E7D1F]" />
              <span>{t.addNote}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowNoteInput(prev => !prev)}
              className="w-7 h-7 rounded-full bg-[#EFFAEB] text-[#2E7D1F] flex items-center justify-center font-bold active:scale-95"
            >
              <Plus size={16} />
            </button>
          </div>

          {showNoteInput && (
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.notePlaceholder}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2E7D1F]"
            />
          )}
        </div>

        {/* "Please keep in mind" 2x2 Amber Tiles with Red X Overlay (Screenshot 1 Pattern) */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block">
            {t.keepInMind}
          </span>

          <div className="grid grid-cols-2 gap-3">
            {keepInMindCards.map((card, idx) => {
              const cardTitle = lang === 'hi' ? card.titleHi : lang === 'mr' ? card.titleMr : card.title;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FFF9EB] border border-[#FDE68A]/60 flex flex-col items-center justify-center text-center space-y-2 relative shadow-2xs min-h-[120px]"
                >
                  {/* Center graphic with red X overlay */}
                  <div className="relative w-14 h-14 rounded-full bg-white shadow-2xs flex items-center justify-center">
                    {idx === 0 && <span className="text-2xl">🛋️</span>}
                    {idx === 1 && <span className="text-2xl">🍾</span>}
                    {idx === 2 && <span className="text-2xl">🔥</span>}
                    {idx === 3 && <span className="text-2xl">🔨</span>}

                    {/* Red ❌ Cross Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-black text-red-600 drop-shadow-sm select-none">
                        ✕
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-gray-900 leading-tight">
                    {cardTitle}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Green Continue Button (Screenshot 1 Pattern) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 max-w-[440px] mx-auto p-4 bg-white border-t border-gray-200">
        <button
          type="button"
          onClick={() => onContinue(photos, note)}
          className="w-full h-13 rounded-2xl bg-[#2E7D1F] hover:bg-[#256618] active:scale-98 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <span>{t.continueBtn}</span>
        </button>
      </div>
    </div>
  );
};

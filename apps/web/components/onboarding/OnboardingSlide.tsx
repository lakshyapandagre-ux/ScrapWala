import React from 'react';
import { OnboardingSlideData } from './onboardingData';
import { RatesIllustration } from './illustrations/RatesIllustration';
import { ConnectKabadiIllustration } from './illustrations/ConnectKabadiIllustration';
import { SwachhBharatIllustration } from './illustrations/SwachhBharatIllustration';

interface OnboardingSlideProps {
  slide: OnboardingSlideData;
  onSkip: () => void;
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  slide,
  onSkip,
}) => {
  const renderIllustration = () => {
    switch (slide.id) {
      case 1:
        return (
          <div className="relative w-full max-w-[315px] flex items-center justify-center">
            {/* Exact illustration image uploaded by user */}
            <img
              src="/images/onboarding/slide1-scan.png"
              alt="ScrapWala Waste Scanner"
              className="w-full h-auto max-h-[250px] object-contain drop-shadow-sm select-none pointer-events-none"
            />
          </div>
        );
      case 2:
        return (
          <div className="relative w-full max-w-[315px] flex items-center justify-center">
            {/* Exact illustration image uploaded by user */}
            <img
              src="/images/onboarding/slide2-rates.png"
              alt="Instant Scrap Rates"
              className="w-full h-auto max-h-[250px] object-contain drop-shadow-sm select-none pointer-events-none"
            />
          </div>
        );
      case 3:
        return (
          <div className="relative w-full max-w-[315px] flex items-center justify-center">
            {/* Exact illustration image uploaded by user */}
            <img
              src="/images/onboarding/slide3-connect.png"
              alt="Connect with Local Kabadi"
              className="w-full h-auto max-h-[250px] object-contain drop-shadow-sm select-none pointer-events-none"
            />
          </div>
        );
      case 4:
        return (
          <div className="relative w-full max-w-[315px] flex items-center justify-center">
            {/* Exact illustration image uploaded by user */}
            <img
              src="/images/onboarding/slide4-earth.png"
              alt="Swachh Bharat Clean Earth"
              className="w-full h-auto max-h-[250px] object-contain drop-shadow-sm select-none pointer-events-none"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between relative select-none overflow-hidden bg-white">
      {/* ================= TOP ORGANIC GREEN CURVE (Matching Reference Image 3) ================= */}
      {slide.layout === 'slide1' ? (
        <div className="absolute top-0 left-0 right-0 h-48 pointer-events-none z-0">
          <svg
            viewBox="0 0 380 200"
            preserveAspectRatio="none"
            className="w-full h-full"
            fill="none"
          >
            {/* Deep organic green wave curve */}
            <path
              d="M0 0 L260 0 C240 75 190 150 0 185 Z"
              fill="#2E7D1F"
            />
            {/* Subtle inner highlight */}
            <path
              d="M0 0 L265 0 C245 77 193 153 0 189 Z"
              stroke="#4ADE80"
              strokeWidth="2"
              fill="none"
              opacity="0.35"
            />
          </svg>
        </div>
      ) : (
        <div className="absolute top-0 left-0 right-0 h-28 pointer-events-none z-0">
          <svg
            viewBox="0 0 380 120"
            preserveAspectRatio="none"
            className="w-full h-full"
            fill="none"
          >
            <path
              d="M0 0 L210 0 C160 48 100 88 0 105 Z"
              fill="#2E7D1F"
            />
            <path
              d="M0 0 L215 0 C164 50 103 90 0 108 Z"
              stroke="#4ADE80"
              strokeWidth="2"
              fill="none"
              opacity="0.35"
            />
          </svg>
        </div>
      )}

      {/* ================= TOP BAR (Skip button only - no time/wifi) ================= */}
      <div className="relative z-10 pt-4 px-5 flex items-center justify-end">
        <button
          type="button"
          onClick={onSkip}
          className="text-[12px] font-bold text-[#15803D] hover:text-[#166534] bg-white/95 hover:bg-white px-3 py-1 rounded-full border border-[#C8E6C9] shadow-xs active:scale-95 transition-all cursor-pointer"
          aria-label="Skip onboarding"
        >
          Skip (छोड़ें)
        </button>
      </div>

      {/* ================= SLIDE 1 BRAND HEADER (Exact Outfit/Jakarta typography) ================= */}
      {slide.layout === 'slide1' && (
        <div className="relative z-10 px-6 pt-1 text-white">
          <h1 className="text-[27px] font-black tracking-tight leading-none text-white drop-shadow-xs">
            {slide.topBrandTitle}
          </h1>
          <p className="text-[14px] font-semibold leading-snug mt-1.5 text-white/95 whitespace-pre-line drop-shadow-xs">
            {slide.topBrandSubtitle}
          </p>
        </div>
      )}

      {/* ================= SLIDES 2, 3, 4 HEADLINE ABOVE ILLUSTRATION ================= */}
      {slide.layout === 'standard' && (
        <div className="relative z-10 px-6 pt-2 text-center space-y-1">
          <h2 className="text-[22px] sm:text-[24px] font-black leading-tight tracking-tight">
            <span className="block text-[#0F172A]">{slide.headingDark}</span>
            <span className="block text-[#15803D] mt-0.5">{slide.headingGreen}</span>
          </h2>
          <p className="text-[12px] font-medium text-[#64748B] max-w-[280px] mx-auto leading-relaxed">
            {slide.englishSubtitle}
          </p>
        </div>
      )}

      {/* ================= MIDDLE ILLUSTRATION ================= */}
      <div className="relative z-0 flex-1 flex items-center justify-center px-4 py-1 my-auto">
        {renderIllustration()}
      </div>

      {/* ================= SLIDE 1 HEADLINE BELOW ILLUSTRATION ================= */}
      {slide.layout === 'slide1' && (
        <div className="relative z-10 px-6 pb-2 text-center space-y-1">
          <h2 className="text-[23px] sm:text-[24px] font-black leading-tight tracking-tight">
            <span className="block text-[#0F172A]">{slide.headingDark}</span>
            <span className="block text-[#15803D] mt-0.5">{slide.headingGreen}</span>
          </h2>
          <p className="text-[12.5px] font-medium text-[#64748B] max-w-[280px] mx-auto leading-relaxed">
            {slide.englishSubtitle}
          </p>
        </div>
      )}

      <div className="h-0.5" />
    </div>
  );
};

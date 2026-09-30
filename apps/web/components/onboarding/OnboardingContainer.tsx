'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { ONBOARDING_SLIDES_DATA } from './onboardingData';
import { OnboardingSlide } from './OnboardingSlide';
import { ProgressDots } from './ProgressDots';

export const ONBOARDING_STORAGE_KEY = 'scrapwala_onboarding_completed';

interface OnboardingContainerProps {
  onComplete: () => void;
}

export const OnboardingContainer: React.FC<OnboardingContainerProps> = ({
  onComplete,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const totalSlides = ONBOARDING_SLIDES_DATA.length;
  const currentSlide = ONBOARDING_SLIDES_DATA[currentSlideIndex];

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  // Mark completed in localStorage and notify parent
  const markCompletedAndProceed = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
      }
    } catch (e) {
      console.warn('Could not save onboarding status to localStorage', e);
    }
    onComplete();
  };

  const handleNext = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    } else {
      markCompletedAndProceed();
    }
  };

  const handleSkip = () => {
    markCompletedAndProceed();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null) return;
    const swipeDistance = touchDeltaX.current;
    const minSwipeDistance = 45;

    if (swipeDistance < -minSwipeDistance) {
      // Swiped Left -> Next
      if (currentSlideIndex < totalSlides - 1) {
        setCurrentSlideIndex(prev => prev + 1);
      } else {
        markCompletedAndProceed();
      }
    } else if (swipeDistance > minSwipeDistance) {
      // Swiped Right -> Previous
      if (currentSlideIndex > 0) {
        setCurrentSlideIndex(prev => prev - 1);
      }
    }

    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft' && currentSlideIndex > 0) {
        setCurrentSlideIndex(prev => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex]);

  return (
    <div className="min-h-screen w-full bg-[#EAF4E8] flex items-center justify-center p-2 sm:p-4 transition-colors">
      {/* Mobile Frame Container (Compact & proportional, no excessive whitespace) */}
      <div
        className="w-full max-w-[390px] bg-white rounded-3xl sm:rounded-[36px] shadow-2xl shadow-green-950/10 border border-[#D0E2CF] overflow-hidden flex flex-col h-[650px] sm:h-[660px] max-h-[92vh] relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Track with smooth horizontal CSS sliding animation */}
        <div className="flex-1 w-full relative overflow-hidden flex flex-col">
          <div
            className="flex-1 flex w-full transition-transform duration-350 ease-out h-full"
            style={{
              transform: `translateX(-${(currentSlideIndex * 100) / totalSlides}%)`,
              width: `${totalSlides * 100}%`,
            }}
          >
            {ONBOARDING_SLIDES_DATA.map((slide) => (
              <div
                key={slide.id}
                className="w-full h-full flex-shrink-0"
                style={{ width: `${100 / totalSlides}%` }}
              >
                <OnboardingSlide
                  slide={slide}
                  onSkip={handleSkip}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ================= BOTTOM CONTROLS ================= */}
        <div className="w-full px-5 pt-1 pb-5 bg-white relative z-20 space-y-3">
          {/* 4 Animated Progress Dots */}
          <div className="py-0.5">
            <ProgressDots
              total={totalSlides}
              current={currentSlideIndex}
              onSelect={(idx) => setCurrentSlideIndex(idx)}
            />
          </div>

          {/* Premium Modern CTA Button */}
          <button
            type="button"
            onClick={handleNext}
            className="group relative w-full h-[52px] rounded-2xl bg-gradient-to-r from-[#16A34A] via-[#15803D] to-[#15803D] hover:from-[#15803D] hover:to-[#14532D] text-white font-extrabold text-[15px] flex items-center justify-center gap-2.5 shadow-[0_4px_16px_rgba(22,163,74,0.32),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_6px_22px_rgba(22,163,74,0.42)] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <span>{currentSlide.ctaText}</span>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-200">
              <ArrowRight size={16} strokeWidth={2.5} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

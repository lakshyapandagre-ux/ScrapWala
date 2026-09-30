'use client';

import React from 'react';
import { OnboardingContainer } from '../onboarding';

interface OnboardingSlidesProps {
  onComplete: () => void;
}

export const OnboardingSlides: React.FC<OnboardingSlidesProps> = ({ onComplete }) => {
  return <OnboardingContainer onComplete={onComplete} />;
};

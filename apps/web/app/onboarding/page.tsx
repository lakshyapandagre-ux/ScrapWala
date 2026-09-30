'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { OnboardingContainer } from '@/components/onboarding';

export default function OnboardingPage() {
  const router = useRouter();
  const { role, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && role && (role === 'collector' || role === 'recycler' || role === 'admin')) {
      router.replace(`/${role}`);
    }
  }, [role, isLoading, router]);

  const handleComplete = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('scrapwala_onboarding_completed', 'true');
      }
    } catch (e) {
      console.warn('Failed to set onboarding completed flag', e);
    }
    router.push('/login');
  };

  return <OnboardingContainer onComplete={handleComplete} />;
}

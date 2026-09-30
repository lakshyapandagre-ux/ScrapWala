'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Recycle } from 'lucide-react';

export default function RootPage() {
  const { role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (role && (role === 'collector' || role === 'recycler' || role === 'admin')) {
      // Authenticated -> Route directly to their role dashboard
      router.replace(`/${role}`);
    } else {
      // Not authenticated -> Route based on onboarding status
      try {
        const completed = typeof window !== 'undefined' && localStorage.getItem('scrapwala_onboarding_completed') === 'true';
        if (completed) {
          router.replace('/login');
        } else {
          router.replace('/onboarding');
        }
      } catch {
        router.replace('/login');
      }
    }
  }, [role, isLoading, router]);

  return (
    <div className="min-h-screen bg-[#E9EFEA] flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 rounded-2xl bg-[#2E7D1F] text-white flex items-center justify-center shadow-lg animate-pulse mb-4">
        <Recycle size={32} className="text-white" />
      </div>
      <h1 className="text-xl font-black text-[#14181A] tracking-tight">ScrapWala</h1>
      <p className="text-xs text-gray-500 mt-1">सुरक्षित प्रवेश हो रहा है... / Loading...</p>
    </div>
  );
}

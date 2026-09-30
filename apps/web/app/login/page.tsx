'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AuthScreen } from '@/components/auth/AuthScreen';

export default function LoginPage() {
  const router = useRouter();
  const { role, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && role && (role === 'collector' || role === 'recycler' || role === 'admin')) {
      router.replace(`/${role}`);
    }
  }, [role, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EAF4E8] flex items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-[#2E7D1F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <AuthScreen />;
}

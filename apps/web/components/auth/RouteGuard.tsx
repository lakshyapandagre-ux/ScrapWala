'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/lib/auth-context';
import { Recycle } from 'lucide-react';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, allowedRoles }) => {
  const { role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const isValid = role === 'collector' || role === 'recycler' || role === 'admin';
      if (!role || !isValid) {
        router.replace('/login');
      } else if (allowedRoles && !allowedRoles.includes(role)) {
        router.replace(`/${role}`);
      }
    }
  }, [role, isLoading, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E9EFEA] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-[#2E7D1F] text-white flex items-center justify-center shadow-lg animate-pulse mb-4">
          <Recycle size={32} className="animate-spin text-white" style={{ animationDuration: '3s' }} />
        </div>
        <p className="text-base font-bold text-[#14181A]">ScrapWala</p>
        <p className="text-xs text-gray-500 mt-1">लोड हो रहा है... / Loading...</p>
      </div>
    );
  }

  if (!role || (allowedRoles && !allowedRoles.includes(role))) {
    return (
      <div className="min-h-screen bg-[#E9EFEA] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-[#2E7D1F] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-gray-600 font-medium">लोड हो रहा है...</p>
      </div>
    );
  }

  return <>{children}</>;
};

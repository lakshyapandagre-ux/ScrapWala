'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Recycle, ArrowRight, Home } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem('scrapwala_role');
      if (storedRole && storedRole !== 'collector' && storedRole !== 'recycler' && storedRole !== 'admin') {
        localStorage.removeItem('scrapwala_role');
        localStorage.removeItem('scrapwala_profile');
      }

      // If the user arrived at a corrupted [object Object] URL, auto-redirect to root
      if (window.location.pathname.includes('[object') || window.location.pathname.includes('%5Bobject')) {
        router.replace('/');
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#E9EFEA] flex flex-col items-center justify-center p-4 text-[#14181A]">
      <div className="w-full max-w-[420px] bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#2E7D1F]/10 text-[#2E7D1F] flex items-center justify-center mb-5">
          <Recycle size={36} />
        </div>

        <span className="text-4xl font-black text-[#2E7D1F] tracking-tight">404</span>
        <h1 className="text-xl font-bold text-gray-900 mt-2">पेज नहीं मिला / Page Not Found</h1>
        <p className="text-sm text-gray-600 mt-2 mb-6">
          यह पेज उपलब्ध नहीं है या पता बदल गया है।
          <br />
          The page you requested could not be found.
        </p>

        <Link
          href="/"
          className="w-full h-12 bg-[#2E7D1F] hover:bg-[#256619] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
        >
          <Home size={18} />
          <span>मुख्य पृष्ठ पर जाएं / Go Home</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}

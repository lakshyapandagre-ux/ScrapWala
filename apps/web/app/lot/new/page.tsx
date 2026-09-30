'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function NewLotContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const category = searchParams.get('category') || '';
    router.replace(`/collector?tab=sell&category=${encodeURIComponent(category)}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#E9EFEA] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
        <p className="text-base font-semibold text-[#14181A]">लॉट बनाया जा रहा है...</p>
        <p className="text-xs text-gray-500 mt-1">Opening Lot Wizard...</p>
      </div>
    </div>
  );
}

export default function NewLotPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#E9EFEA] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#2E7D1F] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <NewLotContent />
    </Suspense>
  );
}

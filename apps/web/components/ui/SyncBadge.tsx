import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface SyncBadgeProps {
  status: 'synced' | 'pending' | 'failed';
  className?: string;
}

export const SyncBadge: React.FC<SyncBadgeProps> = ({ status, className = '' }) => {
  if (status === 'synced') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
        <CheckCircle2 size={13} className="text-emerald-600" />
        सिंक हुआ (Synced)
      </span>
    );
  }

  if (status === 'pending') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse ${className}`}>
        <Clock size={13} className="text-amber-600" />
        सिंक बाकी (Pending)
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 ${className}`}>
      <AlertCircle size={13} className="text-rose-600" />
      सिंक विफल (Retry)
    </span>
  );
};

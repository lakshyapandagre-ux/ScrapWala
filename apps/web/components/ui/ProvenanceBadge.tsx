import React from 'react';
import { CheckCircle2, Clock, HelpCircle, FileText } from 'lucide-react';

export type ProvenanceType = 'verified' | 'reported' | 'estimate' | 'demo';

interface ProvenanceBadgeProps {
  type?: ProvenanceType;
  freshness?: string;
  className?: string;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  type = 'verified',
  freshness = '2 घंटे पहले',
  className = '',
}) => {
  const getBadgeContent = () => {
    switch (type) {
      case 'verified':
        return {
          icon: <CheckCircle2 size={11} className="text-sw-green-600" />,
          label: 'सत्यापित भाव (Verified)',
          badgeClass: 'bg-sw-green-50 text-sw-green-700 border-sw-green-100',
        };
      case 'reported':
        return {
          icon: <FileText size={11} className="text-sw-ink-600" />,
          label: 'रिपोर्टेड (Reported)',
          badgeClass: 'bg-gray-100 text-sw-ink-600 border-gray-200',
        };
      case 'estimate':
        return {
          icon: <HelpCircle size={11} className="text-sw-amber-500" />,
          label: 'अनुमानित (Estimate)',
          badgeClass: 'bg-sw-amber-50 text-amber-800 border-amber-200',
        };
      case 'demo':
        return {
          icon: <Clock size={11} className="text-sw-ink-400" />,
          label: 'डेमो डेटा (Demo)',
          badgeClass: 'bg-gray-50 text-sw-ink-400 border-dashed border-gray-300',
        };
    }
  };

  const { icon, label, badgeClass } = getBadgeContent();

  return (
    <div className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${className}`}>
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${badgeClass}`}>
        {icon}
        <span>{label}</span>
      </span>
      {freshness && (
        <span className="text-[10px] text-sw-ink-400">
          • {freshness}
        </span>
      )}
    </div>
  );
};

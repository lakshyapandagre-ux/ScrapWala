import React from 'react';

interface ProgressDotsProps {
  total: number;
  current: number;
  onSelect?: (index: number) => void;
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({
  total,
  current,
  onSelect,
}) => {
  return (
    <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Slide indicators">
      {Array.from({ length: total }).map((_, idx) => {
        const isActive = idx === current;
        return (
          <button
            key={idx}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => onSelect && onSelect(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              isActive
                ? 'w-6 bg-[#166534]'
                : 'w-2 bg-[#D1D5DB] hover:bg-[#9CA3AF]'
            }`}
          />
        );
      })}
    </div>
  );
};

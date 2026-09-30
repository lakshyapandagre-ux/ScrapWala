'use client';

import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { useSpeak } from '@/lib/use-speak';

interface AudioButtonProps {
  textToSpeak: string;
  className?: string;
  size?: number;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  textToSpeak,
  className = '',
  size = 18,
}) => {
  const { speak } = useSpeak();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
    speak(textToSpeak);
    setTimeout(() => {
      setIsPlaying(false);
    }, 2800);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title="आवाज़ सुनें (Listen)"
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-sw-green-600 ${
        isPlaying
          ? 'bg-sw-green-100 text-sw-green-700 scale-105 ring-2 ring-sw-green-600/40'
          : 'bg-sw-green-50 text-sw-green-600 hover:bg-sw-green-100 active:scale-95'
      } ${className}`}
      aria-label="बोलकर सुनाएं"
    >
      <Volume2 size={size} className={isPlaying ? 'animate-pulse text-sw-forest-800' : ''} />
    </button>
  );
};

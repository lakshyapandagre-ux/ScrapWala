import React from 'react';

export const ScanIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 360 270"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Soft Sky Gradient */}
        <linearGradient id="s1_sky" x1="180" y1="0" x2="180" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0FAF4" />
          <stop offset="1" stopColor="#E0F2E9" />
        </linearGradient>

        {/* City Gradient */}
        <linearGradient id="s1_city" x1="180" y1="60" x2="180" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D4EADF" stopOpacity="0.85" />
          <stop offset="1" stopColor="#EAF5EE" stopOpacity="0.5" />
        </linearGradient>

        {/* Hill Gradient */}
        <linearGradient id="s1_ground" x1="180" y1="160" x2="180" y2="270" gradientUnits="userSpaceOnUse">
          <stop stopColor="#68D391" />
          <stop offset="1" stopColor="#38A169" />
        </linearGradient>

        {/* Green Recycle Bin Gradient */}
        <linearGradient id="s1_bin" x1="220" y1="150" x2="220" y2="245" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38A169" />
          <stop offset="1" stopColor="#22543D" />
        </linearGradient>
      </defs>

      {/* Floating Clouds */}
      <g fill="#EAF5EE" fillOpacity="0.9">
        <path d="M70 75 C60 75 52 82 52 90 C52 98 60 102 70 102 L110 102 C118 102 124 96 124 90 C124 84 118 78 110 78 C108 72 100 68 92 68 C82 68 74 72 70 75 Z" />
        <path d="M250 85 C242 85 235 91 235 97 C235 103 242 107 250 107 L285 107 C292 107 297 102 297 97 C297 92 292 88 285 88 C283 83 277 80 270 80 C261 80 254 83 250 85 Z" />
      </g>

      {/* Modern Clean Cityscape Silhouette */}
      <g fill="url(#s1_city)">
        <rect x="70" y="110" width="22" height="70" rx="3" />
        <rect x="98" y="95" width="28" height="85" rx="3" />
        <rect x="132" y="125" width="18" height="55" rx="2" />
        <rect x="156" y="105" width="26" height="75" rx="3" />
        <rect x="238" y="115" width="20" height="65" rx="2" />
        <rect x="264" y="100" width="30" height="80" rx="3" />
        <rect x="300" y="120" width="24" height="60" rx="2" />
      </g>

      {/* Soft Green City Windows */}
      <g fill="#FFFFFF" fillOpacity="0.6">
        <rect x="105" y="105" width="4" height="6" rx="1" />
        <rect x="115" y="105" width="4" height="6" rx="1" />
        <rect x="105" y="118" width="4" height="6" rx="1" />
        <rect x="115" y="118" width="4" height="6" rx="1" />
        <rect x="272" y="110" width="4" height="6" rx="1" />
        <rect x="282" y="110" width="4" height="6" rx="1" />
      </g>

      {/* Lush Green Trees in Midground */}
      <circle cx="48" cy="170" r="28" fill="#48BB78" />
      <circle cx="80" cy="180" r="24" fill="#38A169" />
      <circle cx="310" cy="175" r="30" fill="#48BB78" />
      <circle cx="340" cy="185" r="22" fill="#2F855A" />

      {/* Foreground Organic Ground Curve */}
      <path
        d="M-20 205 Q60 170 170 185 T380 190 L380 270 L-20 270 Z"
        fill="url(#s1_ground)"
      />
      <path
        d="M-20 220 Q80 190 200 200 T380 215 L380 270 L-20 270 Z"
        fill="#2E7D32"
        fillOpacity="0.35"
      />

      {/* RECYCLE BIN (Center Right) */}
      <g id="recycle_bin">
        {/* Bin Body */}
        <path
          d="M175 168 L184 248 C185 252 188 255 192 255 L260 255 C264 255 267 252 268 248 L277 168 Z"
          fill="url(#s1_bin)"
        />
        {/* Bin Top Lip/Rim */}
        <rect x="170" y="162" width="112" height="10" rx="4" fill="#22543D" />

        {/* White Möbius Recycle Symbol on Bin */}
        <g transform="translate(208, 196) scale(0.65)" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2 L22 18 L16 18 L19 23 L26 12 L19 12 L12 2 Z" fill="#FFFFFF" stroke="none" />
          <path d="M36 28 L20 38 L23 33 L17 33 L21 44 L27 41 L36 28 Z" fill="#FFFFFF" stroke="none" />
          <path d="M8 38 L16 24 L13 24 L10 18 L3 29 L8 29 L8 38 Z" fill="#FFFFFF" stroke="none" />
          {/* Circular loop arrows */}
          <path d="M22 6 L30 19 M32 23 L22 38 M18 38 L8 24 M9 20 L18 6" stroke="#FFFFFF" strokeWidth="3" />
        </g>

        {/* Cardboard Box inside bin */}
        <g transform="translate(225, 140)">
          <path d="M5 25 L45 25 L40 50 L0 50 Z" fill="#D97706" />
          <path d="M5 25 L20 12 L55 12 L45 25 Z" fill="#F59E0B" />
          <path d="M45 25 L55 12 L50 36 L40 50 Z" fill="#B45309" />
          {/* Tape line */}
          <rect x="22" y="14" width="8" height="35" fill="#FDE68A" fillOpacity="0.8" />
        </g>

        {/* Blue Plastic Bottle 1 (inside bin) */}
        <g transform="translate(202, 135) rotate(-10)">
          <rect x="3" y="0" width="8" height="5" rx="1.5" fill="#2563EB" />
          <path d="M2 5 L12 5 L14 12 L14 38 L0 38 L0 12 Z" fill="#60A5FA" fillOpacity="0.9" />
          <line x1="0" y1="18" x2="14" y2="18" stroke="#93C5FD" strokeWidth="1.5" />
          <line x1="0" y1="26" x2="14" y2="26" stroke="#93C5FD" strokeWidth="1.5" />
        </g>

        {/* Blue Plastic Bottle 2 (in air / scanned) */}
        <g transform="translate(182, 115) rotate(15)">
          <rect x="3" y="0" width="8" height="5" rx="1.5" fill="#2563EB" />
          <path d="M2 5 L12 5 L14 12 L14 38 L0 38 L0 12 Z" fill="#38BDF8" fillOpacity="0.95" />
          <line x1="0" y1="18" x2="14" y2="18" stroke="#BAE6FD" strokeWidth="1.5" />
          <line x1="0" y1="26" x2="14" y2="26" stroke="#BAE6FD" strokeWidth="1.5" />
        </g>
      </g>

      {/* AI SCANNER BRACKETS (Targeting scrap) */}
      <g stroke="#16A34A" strokeWidth="3" strokeLinecap="round">
        {/* Top-Left */}
        <path d="M170 120 L170 110 L180 110" />
        {/* Top-Right */}
        <path d="M216 110 L226 110 L226 120" />
        {/* Bottom-Left */}
        <path d="M170 145 L170 155 L180 155" />
        {/* Bottom-Right */}
        <path d="M216 155 L226 155 L226 145" />
      </g>

      {/* Scanning Laser Beam (Subtle Green) */}
      <line x1="172" y1="132" x2="224" y2="132" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="3 2" />

      {/* COLLECTOR CHARACTER (Left) */}
      <g id="collector_person">
        {/* Body / Green T-Shirt */}
        <path
          d="M32 205 C32 185 52 170 78 170 C92 170 104 175 110 188 L98 255 L20 255 Z"
          fill="#1F6B43"
        />

        {/* Neck */}
        <rect x="74" y="152" width="14" height="22" rx="4" fill="#F6C49A" />

        {/* Head / Face */}
        <circle cx="82" cy="140" r="18" fill="#F6C49A" />

        {/* Ear */}
        <circle cx="72" cy="142" r="4.5" fill="#F6C49A" />

        {/* Dark Modern Hair */}
        <path
          d="M66 140 C66 124 76 120 90 120 C102 120 106 128 104 136 C98 134 94 136 90 138 C86 140 76 135 72 142 Z"
          fill="#1E293B"
        />
        {/* Hair Back */}
        <path d="M64 135 C64 145 68 152 72 152 Z" fill="#1E293B" />

        {/* Left Arm extended with phone */}
        {/* Arm */}
        <path
          d="M92 180 Q122 176 142 166 L148 178 Q125 192 88 198 Z"
          fill="#1F6B43"
        />
        {/* Forearm & Hand */}
        <path
          d="M136 170 L166 160 C170 159 172 163 170 166 L164 175 C162 178 158 178 154 177 L132 182 Z"
          fill="#F6C49A"
        />

        {/* SMARTPHONE */}
        <g transform="translate(162, 142) rotate(-12)">
          {/* Phone Shell */}
          <rect x="0" y="0" width="22" height="42" rx="5" fill="#0F172A" />
          {/* Phone Screen with live green preview */}
          <rect x="2" y="2" width="18" height="38" rx="3.5" fill="#15803D" />
          {/* Screen Camera View / White Recycle Logo */}
          <circle cx="11" cy="21" r="5" fill="#22C55E" />
          <path d="M11 18 L13 21 L9 21 Z" fill="#FFFFFF" />
          <path d="M13 23 L11 25 L11 22 Z" fill="#FFFFFF" />
        </g>
      </g>
    </svg>
  );
};

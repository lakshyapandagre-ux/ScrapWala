import React from 'react';

export const SwachhBharatIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 360 270"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Sky Gradient */}
        <linearGradient id="s4_sky" x1="180" y1="0" x2="180" y2="230" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0FAF4" />
          <stop offset="1" stopColor="#E2F4EA" />
        </linearGradient>

        {/* Earth Gradient */}
        <radialGradient id="s4_earth" cx="45%" cy="40%" r="55%">
          <stop stopColor="#4ADE80" />
          <stop offset="0.7" stopColor="#22C55E" />
          <stop offset="1" stopColor="#15803D" />
        </radialGradient>

        {/* Hand Gradient */}
        <linearGradient id="s4_hand" x1="120" y1="180" x2="240" y2="250" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDBA74" />
          <stop offset="1" stopColor="#FB923C" />
        </linearGradient>

        {/* Sprout Leaf Gradient */}
        <linearGradient id="s4_leaf" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#86EFAC" />
          <stop offset="1" stopColor="#22C55E" />
        </linearGradient>
      </defs>

      {/* Fluffy White Clouds */}
      <g fill="#EAF5EE" fillOpacity="0.9">
        <path d="M50 45 C42 45 36 50 36 56 C36 62 42 66 50 66 L85 66 C92 66 96 62 96 56 C96 50 92 46 85 46 C83 41 77 38 70 38 C62 38 56 41 52 45 Z" />
        <path d="M280 40 C272 40 266 45 266 51 C266 57 272 61 280 61 L315 61 C322 61 326 57 326 51 C326 45 322 41 315 41 C313 36 307 33 300 33 C292 33 286 36 282 40 Z" />
      </g>

      {/* Clean City Silhouette in Background */}
      <g fill="#D4EADF" fillOpacity="0.7">
        <rect x="30" y="105" width="22" height="90" rx="3" />
        <rect x="58" y="90" width="28" height="105" rx="3" />
        <rect x="92" y="115" width="18" height="80" rx="2" />
        <rect x="250" y="110" width="24" height="85" rx="3" />
        <rect x="280" y="95" width="28" height="100" rx="3" />
        <rect x="314" y="115" width="22" height="80" rx="2" />
      </g>

      {/* Eco Windmills in distance */}
      <g stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round">
        {/* Windmill 1 */}
        <line x1="90" y1="120" x2="90" y2="90" />
        <line x1="90" y1="90" x2="80" y2="78" />
        <line x1="90" y1="90" x2="102" y2="84" />
        <line x1="90" y1="90" x2="88" y2="104" />
        {/* Windmill 2 */}
        <line x1="265" y1="115" x2="265" y2="85" />
        <line x1="265" y1="85" x2="255" y2="75" />
        <line x1="265" y1="85" x2="276" y2="80" />
        <line x1="265" y1="85" x2="263" y2="98" />
      </g>

      {/* Lush Trees on left & right */}
      <circle cx="25" cy="180" r="32" fill="#4ADE80" />
      <circle cx="65" cy="190" r="26" fill="#22C55E" />
      <circle cx="300" cy="180" r="32" fill="#4ADE80" />
      <circle cx="335" cy="192" r="24" fill="#16A34A" />

      {/* Rolling Foreground Hills */}
      <path
        d="M-20 215 Q80 185 190 200 T380 200 L380 270 L-20 270 Z"
        fill="#68D391"
      />
      <path
        d="M-20 230 Q90 200 210 210 T380 215 L380 270 L-20 270 Z"
        fill="#38A169"
      />

      {/* ================= GREEN EARTH GLOBE (CENTER) ================= */}
      <g id="green_earth" transform="translate(180, 142)">
        {/* Globe Outer Circle */}
        <circle cx="0" cy="0" r="48" fill="url(#s4_earth)" />

        {/* Continents / Organic Landmasses in Dark Forest Green */}
        <g fill="#166534">
          {/* India / Asia shape */}
          <path d="M-8 -32 C-2 -30 12 -28 16 -18 C18 -10 14 -4 8 -2 C2 0 -6 -6 -8 -12 C-10 -18 -14 -24 -8 -32 Z" />
          {/* Lower Peninsula */}
          <path d="M2 -4 C6 2 8 10 2 16 C-4 12 -4 4 2 -4 Z" />
          {/* Africa / Europe shape */}
          <path d="M-36 -24 C-26 -26 -18 -20 -20 -10 C-22 -4 -28 8 -30 18 C-36 14 -44 0 -40 -12 C-38 -18 -38 -20 -36 -24 Z" />
          {/* Island / Australia */}
          <circle cx="28" cy="16" r="6" />
          <circle cx="34" cy="6" r="3.5" />
          <circle cx="-16" cy="28" r="4" />
        </g>

        {/* Soft highlight arc on top of globe */}
        <path
          d="M-36 -24 C-20 -44 20 -44 36 -24"
          stroke="#DCFCE7"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
      </g>

      {/* ================= FRESH SPROUT (GROWING ON TOP OF GLOBE) ================= */}
      <g id="fresh_sprout" transform="translate(180, 95)">
        {/* Stem */}
        <path
          d="M0 16 Q-2 8 0 0"
          stroke="#16A34A"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right Leaf */}
        <path
          d="M0 4 C10 -6 24 -14 30 -4 C32 6 20 14 0 10 Z"
          fill="url(#s4_leaf)"
          stroke="#15803D"
          strokeWidth="1.5"
        />
        {/* Left Leaf */}
        <path
          d="M0 2 C-10 -8 -24 -14 -28 -2 C-30 8 -18 14 0 8 Z"
          fill="url(#s4_leaf)"
          stroke="#15803D"
          strokeWidth="1.5"
        />
      </g>

      {/* ================= CARING HUMAN HANDS (HOLDING GLOBE FROM BELOW) ================= */}
      <g id="caring_hands">
        {/* Left Hand / Palm cradling the globe */}
        <path
          d="M72 235 C72 215 95 200 120 182 C132 173 148 168 162 176 C170 182 172 192 165 200 C156 210 140 220 126 230 L110 248 L72 248 Z"
          fill="url(#s4_hand)"
        />

        {/* Right Hand / Fingers gently cupping from bottom right */}
        <path
          d="M280 230 C280 210 256 195 236 178 C226 170 212 174 206 182 C202 190 206 200 216 208 C228 218 245 228 258 240 L270 252 L280 252 Z"
          fill="url(#s4_hand)"
        />

        {/* Wrist base connecting at bottom */}
        <path
          d="M100 252 Q180 238 260 252 L260 270 L100 270 Z"
          fill="#FB923C"
        />
      </g>
    </svg>
  );
};

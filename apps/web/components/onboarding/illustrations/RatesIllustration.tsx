import React from 'react';

export const RatesIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 360 270"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Soft Sky Gradient */}
        <linearGradient id="s2_sky" x1="180" y1="0" x2="180" y2="230" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0FAF4" />
          <stop offset="1" stopColor="#E2F4EA" />
        </linearGradient>

        {/* Soft Background Trees */}
        <linearGradient id="s2_tree" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#86EFAC" />
          <stop offset="1" stopColor="#4ADE80" />
        </linearGradient>

        {/* Phone Frame Gradient */}
        <linearGradient id="s2_phone_frame" x1="175" y1="35" x2="175" y2="260" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E7B44" />
          <stop offset="1" stopColor="#14532D" />
        </linearGradient>

        {/* Card Shadow */}
        <filter id="s2_card_shadow" x="-8%" y="-8%" width="120%" height="130%" filterUnits="objectBoundingBox">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.06" />
        </filter>
      </defs>

      {/* Subtle floating background cloud */}
      <path
        d="M200 45 C192 45 186 50 186 55 C186 60 192 64 200 64 L245 64 C252 64 256 60 256 55 C256 50 252 46 245 46 C243 42 237 39 230 39 C222 39 216 42 212 45 Z"
        fill="#EAF5EE"
        fillOpacity="0.9"
      />

      {/* Cityscape Buildings in Background */}
      <g fill="#D4EADF" fillOpacity="0.75">
        <rect x="50" y="105" width="22" height="85" rx="3" />
        <rect x="76" y="90" width="26" height="100" rx="3" />
        <rect x="270" y="95" width="28" height="95" rx="3" />
        <rect x="302" y="110" width="24" height="80" rx="3" />
      </g>

      {/* Windows on buildings */}
      <g fill="#FFFFFF" fillOpacity="0.6">
        <rect x="83" y="100" width="4" height="6" rx="1" />
        <rect x="91" y="100" width="4" height="6" rx="1" />
        <rect x="83" y="114" width="4" height="6" rx="1" />
        <rect x="91" y="114" width="4" height="6" rx="1" />
        <rect x="277" y="108" width="4" height="6" rx="1" />
        <rect x="287" y="108" width="4" height="6" rx="1" />
      </g>

      {/* Lush Green Trees */}
      <circle cx="45" cy="180" r="32" fill="#4ADE80" />
      <circle cx="85" cy="190" r="26" fill="#22C55E" />
      <circle cx="310" cy="180" r="34" fill="#4ADE80" />
      <circle cx="345" cy="192" r="24" fill="#16A34A" />

      {/* Rolling ground hill */}
      <path
        d="M-20 215 Q70 180 180 195 T380 200 L380 270 L-20 270 Z"
        fill="#48BB78"
      />
      <path
        d="M-20 230 Q80 200 200 210 T380 220 L380 270 L-20 270 Z"
        fill="#38A169"
      />

      {/* Sparkles / Price rays around phone */}
      <g stroke="#15803D" strokeWidth="2.5" strokeLinecap="round">
        <line x1="280" y1="72" x2="288" y2="64" />
        <line x1="292" y1="80" x2="304" y2="80" />
        <line x1="284" y1="92" x2="294" y2="98" />
      </g>

      {/* ================= SMARTPHONE MOCKUP (CENTER) ================= */}
      <g id="phone_mockup" transform="translate(130, 22)">
        {/* Outer Phone Frame */}
        <rect
          x="0"
          y="0"
          width="135"
          height="242"
          rx="26"
          fill="url(#s2_phone_frame)"
          stroke="#166534"
          strokeWidth="3.5"
        />

        {/* Screen Bezel / Background */}
        <rect
          x="6"
          y="6"
          width="123"
          height="230"
          rx="21"
          fill="#FFFFFF"
        />

        {/* Top Speaker Ear-piece */}
        <rect x="52" y="11" width="31" height="4" rx="2" fill="#CBD5E1" />

        {/* CARD 1: PLASTIC ₹28 / kg */}
        <g transform="translate(11, 28)" filter="url(#s2_card_shadow)">
          <rect x="0" y="0" width="113" height="48" rx="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          {/* Plastic Bottle Icon */}
          <g transform="translate(10, 8)">
            <rect x="3" y="1" width="8" height="4" rx="1.5" fill="#2563EB" />
            <path d="M2 5 L12 5 L14 11 L14 30 L0 30 L0 11 Z" fill="#60A5FA" />
            <line x1="1" y1="16" x2="13" y2="16" stroke="#BFDBFE" strokeWidth="1" />
            <line x1="1" y1="22" x2="13" y2="22" stroke="#BFDBFE" strokeWidth="1" />
          </g>
          {/* Text */}
          <text x="32" y="21" fill="#1E293B" fontSize="11" fontWeight="700" fontFamily="sans-serif">
            Plastic
          </text>
          <text x="32" y="37" fill="#15803D" fontSize="11" fontWeight="800" fontFamily="sans-serif">
            ₹28 / kg
          </text>
          {/* Chevron */}
          <path d="M96 21 L100 24 L96 27" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* CARD 2: CARDBOARD ₹18 / kg */}
        <g transform="translate(11, 84)" filter="url(#s2_card_shadow)">
          <rect x="0" y="0" width="113" height="48" rx="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          {/* Cardboard Box Icon */}
          <g transform="translate(8, 10)">
            <path d="M4 14 L20 14 L18 28 L2 28 Z" fill="#D97706" />
            <path d="M4 14 L11 7 L27 7 L20 14 Z" fill="#F59E0B" />
            <path d="M20 14 L27 7 L24 21 L18 28 Z" fill="#B45309" />
          </g>
          {/* Text */}
          <text x="32" y="21" fill="#1E293B" fontSize="10.5" fontWeight="700" fontFamily="sans-serif">
            Cardboard
          </text>
          <text x="32" y="37" fill="#15803D" fontSize="11" fontWeight="800" fontFamily="sans-serif">
            ₹18 / kg
          </text>
          {/* Chevron */}
          <path d="M96 21 L100 24 L96 27" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* CARD 3: METAL ₹52 / kg */}
        <g transform="translate(11, 140)" filter="url(#s2_card_shadow)">
          <rect x="0" y="0" width="113" height="48" rx="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          {/* Metal Can Icon */}
          <g transform="translate(10, 11)">
            <ellipse cx="9" cy="6" rx="7" ry="3" fill="#CBD5E1" />
            <path d="M2 6 L2 22 C2 24 5 25 9 25 C13 25 16 24 16 22 L16 6 Z" fill="#94A3B8" />
            <ellipse cx="9" cy="6" rx="6" ry="2.2" fill="#E2E8F0" />
            <line x1="2" y1="14" x2="16" y2="14" stroke="#64748B" strokeWidth="1" />
          </g>
          {/* Text */}
          <text x="32" y="21" fill="#1E293B" fontSize="11" fontWeight="700" fontFamily="sans-serif">
            Metal
          </text>
          <text x="32" y="37" fill="#15803D" fontSize="11" fontWeight="800" fontFamily="sans-serif">
            ₹52 / kg
          </text>
          {/* Chevron */}
          <path d="M96 21 L100 24 L96 27" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>

      {/* ================= GIRL CHARACTER POINTING (LEFT) ================= */}
      <g id="girl_pointing">
        {/* Yellow Top / Shirt */}
        <path
          d="M20 220 C20 195 40 185 68 185 C84 185 96 192 102 205 L95 260 L12 260 Z"
          fill="#F59E0B"
        />

        {/* Neck */}
        <rect x="62" y="162" width="13" height="24" rx="4" fill="#F6C49A" />

        {/* Head */}
        <circle cx="69" cy="150" r="17" fill="#F6C49A" />

        {/* Ear */}
        <circle cx="58" cy="151" r="4" fill="#F6C49A" />

        {/* Dark Hair Bun */}
        {/* Bun on Back */}
        <circle cx="38" cy="144" r="13" fill="#1E293B" />
        {/* Hair Scrunchie */}
        <circle cx="48" cy="144" r="4" fill="#059669" />
        {/* Main Hair Sweep */}
        <path
          d="M50 148 C50 130 60 128 78 128 C88 128 92 135 90 144 C84 142 80 144 76 148 C70 152 60 146 56 153 Z"
          fill="#1E293B"
        />

        {/* Right Arm extended pointing at phone */}
        {/* Upper Arm */}
        <path
          d="M82 195 Q106 188 126 180 L132 192 Q108 205 78 212 Z"
          fill="#F59E0B"
        />
        {/* Forearm & Pointing Hand */}
        <path
          d="M120 184 L142 176 C147 174 150 176 148 180 L140 188 C136 192 131 192 126 190 Z"
          fill="#F6C49A"
        />
        {/* Extended Index Finger */}
        <path d="M142 176 L154 172 C156 171 157 174 155 176 L145 181 Z" fill="#F6C49A" />
      </g>
    </svg>
  );
};

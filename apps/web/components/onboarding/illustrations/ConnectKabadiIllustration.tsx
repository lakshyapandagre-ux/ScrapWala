import React from 'react';

export const ConnectKabadiIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 360 270"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Sky Gradient */}
        <linearGradient id="s3_sky" x1="180" y1="0" x2="180" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0FAF4" />
          <stop offset="1" stopColor="#E2F2E9" />
        </linearGradient>

        {/* Truck Body Green Gradient */}
        <linearGradient id="s3_truck_green" x1="210" y1="170" x2="210" y2="245" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E7B44" />
          <stop offset="1" stopColor="#14532D" />
        </linearGradient>

        {/* Pin Drop Shadow */}
        <filter id="s3_pin_shadow" x="-20%" y="-20%" width="140%" height="150%" filterUnits="objectBoundingBox">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#B45309" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* White Cloud */}
      <path
        d="M230 45 C222 45 216 50 216 56 C216 62 222 66 230 66 L265 66 C272 66 276 62 276 56 C276 50 272 46 265 46 C263 41 257 38 250 38 C242 38 236 41 232 45 Z"
        fill="#EAF5EE"
        fillOpacity="0.9"
      />

      {/* City Buildings in Background */}
      <g fill="#D4EADF" fillOpacity="0.75">
        <rect x="25" y="110" width="22" height="85" rx="3" />
        <rect x="52" y="95" width="26" height="100" rx="3" />
        <rect x="255" y="105" width="24" height="90" rx="3" />
        <rect x="284" y="90" width="30" height="105" rx="3" />
      </g>

      {/* Trees in Background */}
      <circle cx="20" cy="180" r="30" fill="#4ADE80" />
      <circle cx="56" cy="190" r="24" fill="#22C55E" />
      <circle cx="250" cy="185" r="28" fill="#4ADE80" />
      <circle cx="280" cy="192" r="22" fill="#16A34A" />

      {/* Rolling Hills Ground */}
      <path
        d="M-20 210 Q80 180 190 195 T380 195 L380 270 L-20 270 Z"
        fill="#68D391"
      />
      <path
        d="M-20 225 Q90 198 210 205 T380 212 L380 270 L-20 270 Z"
        fill="#38A169"
      />

      {/* ================= 5-STAR RATING BADGE (TOP RIGHT) ================= */}
      <g transform="translate(225, 62)">
        <rect x="0" y="0" width="98" height="26" rx="13" fill="#14532D" />
        {/* 5 Golden Stars */}
        <g fill="#FBBF24">
          <path d="M12 7 L13.8 11.5 L18.5 11.8 L15 14.8 L16 19.5 L12 17 L8 19.5 L9 14.8 L5.5 11.8 L10.2 11.5 Z" />
          <path d="M30 7 L31.8 11.5 L36.5 11.8 L33 14.8 L34 19.5 L30 17 L26 19.5 L27 14.8 L23.5 11.8 L28.2 11.5 Z" />
          <path d="M48 7 L49.8 11.5 L54.5 11.8 L51 14.8 L52 19.5 L48 17 L44 19.5 L45 14.8 L41.5 11.8 L46.2 11.5 Z" />
          <path d="M66 7 L67.8 11.5 L72.5 11.8 L69 14.8 L70 19.5 L66 17 L62 19.5 L63 14.8 L59.5 11.8 L64.2 11.5 Z" />
          <path d="M84 7 L85.8 11.5 L90.5 11.8 L87 14.8 L88 19.5 L84 17 L80 19.5 L81 14.8 L77.5 11.8 L82.2 11.5 Z" />
        </g>
      </g>

      {/* ================= LOCAL KABADI SHOP (RIGHT) ================= */}
      <g transform="translate(230, 115)">
        {/* Shop Signboard "कबाड़ी" */}
        <rect x="6" y="0" width="80" height="22" rx="6" fill="#15803D" />
        <text
          x="46"
          y="15.5"
          fill="#FFFFFF"
          fontSize="12.5"
          fontWeight="900"
          fontFamily="'Segoe UI', Roboto, sans-serif"
          textAnchor="middle"
        >
          कबाड़ी
        </text>

        {/* Shop Awning (Striped Canopy) */}
        <g transform="translate(0, 24)">
          {/* Stripes */}
          <path d="M0 0 L92 0 L88 18 L4 18 Z" fill="#FED7AA" />
          <path d="M0 0 L15 0 L12 18 L4 18 Z" fill="#EA580C" />
          <path d="M30 0 L45 0 L42 18 L30 18 Z" fill="#EA580C" />
          <path d="M60 0 L75 0 L72 18 L60 18 Z" fill="#EA580C" />
          {/* Scalloped valance bottom edge */}
          <path
            d="M4 18 Q11 23 18 18 Q25 23 32 18 Q39 23 46 18 Q53 23 60 18 Q67 23 74 18 Q81 23 88 18"
            stroke="#C2410C"
            strokeWidth="2.5"
            fill="none"
          />
        </g>

        {/* Shop Building Front Wall */}
        <rect x="8" y="44" width="76" height="58" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
        {/* Doorway / Counter */}
        <rect x="22" y="56" width="34" height="46" rx="4" fill="#38BDF8" fillOpacity="0.3" stroke="#0284C7" strokeWidth="1" />
        <rect x="60" y="60" width="16" height="22" rx="2" fill="#E2E8F0" />
      </g>

      {/* ================= DASHED ROUTE LINE ================= */}
      <path
        d="M98 90 C98 120 106 142 136 150 C162 156 166 178 185 186"
        stroke="#15803D"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="6 5"
        fill="none"
      />

      {/* ================= YELLOW GPS PIN (TOP LEFT) ================= */}
      <g transform="translate(80, 50)" filter="url(#s3_pin_shadow)">
        {/* Pin Shape */}
        <path
          d="M18 0 C8 0 0 8 0 18 C0 28 14 44 18 48 C22 44 36 28 36 18 C36 8 28 0 18 0 Z"
          fill="#F59E0B"
        />
        {/* Inner White Circle */}
        <circle cx="18" cy="17" r="7.5" fill="#FFFFFF" />
      </g>

      {/* ================= RECYCLING EV PICKUP TRUCK (BOTTOM LEFT/CENTER) ================= */}
      <g id="kabadi_truck" transform="translate(70, 160)">
        {/* Cargo Container (Green) */}
        <rect x="0" y="10" width="78" height="52" rx="7" fill="url(#s3_truck_green)" />

        {/* White Möbius Recycling Logo on Cargo Body */}
        <g transform="translate(39, 36) scale(0.6)" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="0" cy="0" r="15" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="18 10" />
          <path d="M-4 -15 L2 -15 L-1 -20 Z" fill="#FFFFFF" />
          <path d="M14 6 L11 11 L17 11 Z" fill="#FFFFFF" />
          <path d="M-10 11 L-15 8 L-14 14 Z" fill="#FFFFFF" />
        </g>

        {/* Driver Cab (Yellow) */}
        <path
          d="M78 24 L96 24 C100 24 103 27 105 31 L112 44 C113 46 114 49 114 52 L114 62 L78 62 Z"
          fill="#F59E0B"
        />

        {/* Cab Windshield (Blue Tint) */}
        <path
          d="M84 28 L95 28 C97 28 99 30 100 32 L106 43 L84 43 Z"
          fill="#BAE6FD"
          stroke="#0284C7"
          strokeWidth="1"
        />

        {/* Headlight */}
        <rect x="111" y="50" width="4" height="6" rx="2" fill="#FEF08A" />

        {/* Truck Under-chassis */}
        <rect x="-4" y="58" width="122" height="6" rx="2" fill="#0F172A" />

        {/* Front Wheel */}
        <g transform="translate(94, 62)">
          <circle cx="0" cy="0" r="11" fill="#0F172A" />
          <circle cx="0" cy="0" r="5" fill="#94A3B8" />
        </g>

        {/* Rear Wheel */}
        <g transform="translate(22, 62)">
          <circle cx="0" cy="0" r="11" fill="#0F172A" />
          <circle cx="0" cy="0" r="5" fill="#94A3B8" />
        </g>
      </g>
    </svg>
  );
};

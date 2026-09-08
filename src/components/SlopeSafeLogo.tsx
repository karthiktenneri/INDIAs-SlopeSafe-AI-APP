import React from 'react';

interface SlopeSafeLogoProps {
  className?: string;
  size?: number;
  showTextBeside?: boolean;
  isDarkMode?: boolean;
}

export const SlopeSafeLogo: React.FC<SlopeSafeLogoProps> = ({
  className = '',
  size = 40,
  showTextBeside = false,
  isDarkMode = false
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* SVG Emblem rendered accurately from the official SlopeSafe-AI design */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 select-none filter drop-shadow-md"
      >
        <defs>
          {/* Cyan Glow Filters */}
          <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="shieldBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#0077cc" />
          </linearGradient>

          <linearGradient id="mountainFacetLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#003b7a" />
            <stop offset="100%" stopColor="#001a3d" />
          </linearGradient>

          <linearGradient id="mountainFacetRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00a6ff" />
            <stop offset="100%" stopColor="#0055aa" />
          </linearGradient>

          <linearGradient id="mountainFacetCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#0077cc" />
          </linearGradient>
        </defs>

        {/* 1. Deep Black Circle Background */}
        <circle cx="250" cy="250" r="240" fill="#000000" stroke="#00d4ff" strokeWidth="8" filter="url(#cyanGlow)" />
        <circle cx="250" cy="250" r="236" fill="#000000" />

        {/* 2. Outer Cyan Partial Ring Arcs (Top and Bottom Accents) */}
        <path
          d="M 90 200 A 210 210 0 0 1 410 200"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M 100 350 A 210 210 0 0 0 400 350"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* 3. Cyan Shield at Top */}
        <g id="shield-group" transform="translate(0, 5)">
          <path
            d="M 185 105 L 250 65 L 315 105 L 315 145 C 315 185, 250 210, 250 210 C 250 210, 185 185, 185 145 Z"
            fill="#000000"
            stroke="#00d4ff"
            strokeWidth="5.5"
            strokeLinejoin="round"
          />

          {/* Circuit Traces Extending from AI Chip */}
          {/* Top Traces */}
          <line x1="230" y1="105" x2="230" y2="85" stroke="#00d4ff" strokeWidth="4" />
          <circle cx="230" cy="85" r="4.5" fill="#00d4ff" />

          <line x1="270" y1="105" x2="270" y2="85" stroke="#00d4ff" strokeWidth="4" />
          <circle cx="270" cy="85" r="4.5" fill="#00d4ff" />

          {/* Left Traces */}
          <line x1="210" y1="125" x2="195" y2="125" stroke="#00d4ff" strokeWidth="4" />
          <circle cx="195" cy="125" r="4" fill="#00d4ff" />

          <line x1="210" y1="145" x2="195" y2="145" stroke="#00d4ff" strokeWidth="4" />
          <circle cx="195" cy="145" r="4" fill="#00d4ff" />

          {/* Right Traces */}
          <line x1="290" y1="125" x2="305" y2="125" stroke="#00d4ff" strokeWidth="4" />
          <circle cx="305" cy="125" r="4" fill="#00d4ff" />

          <line x1="290" y1="145" x2="305" y2="145" stroke="#00d4ff" strokeWidth="4" />
          <circle cx="305" cy="145" r="4" fill="#00d4ff" />

          {/* Bottom Traces */}
          <line x1="235" y1="165" x2="235" y2="185" stroke="#00d4ff" strokeWidth="4" />
          <circle cx="235" cy="185" r="4" fill="#00d4ff" />

          <line x1="265" y1="165" x2="265" y2="185" stroke="#00d4ff" strokeWidth="4" />
          <circle cx="265" cy="185" r="4" fill="#00d4ff" />

          {/* AI Processor Chip Center Box */}
          <rect
            x="210"
            y="105"
            width="80"
            height="60"
            rx="6"
            fill="#000000"
            stroke="#00d4ff"
            strokeWidth="5"
          />
          <text
            x="250"
            y="148"
            fill="#00d4ff"
            fontSize="34"
            fontFamily="Outfit, Inter, sans-serif"
            fontWeight="900"
            textAnchor="middle"
            letterSpacing="2"
          >
            AI
          </text>
        </g>

        {/* 4. Mountain Peaks with Snowcaps and Blue/Cyan Shaded Facets */}
        <g id="mountains-group">
          {/* Main Ridge Base Outline */}
          {/* Left Peak Main Body */}
          <polygon
            points="225,155 130,240 240,240"
            fill="url(#mountainFacetLeft)"
          />
          {/* Left Peak Shaded Facet */}
          <polygon
            points="225,155 240,240 260,185"
            fill="#002244"
          />
          {/* Left Snow Cap */}
          <polygon
            points="225,155 200,180 215,178 225,190 235,175 245,180"
            fill="#ffffff"
          />

          {/* Center Valley Shadow */}
          <polygon
            points="260,185 240,240 280,240"
            fill="#00142b"
          />

          {/* Right Peak Main Body & Facets */}
          <polygon
            points="285,160 260,185 280,240 370,240"
            fill="url(#mountainFacetRight)"
          />
          <polygon
            points="285,160 370,240 435,235 320,205"
            fill="url(#mountainFacetCyan)"
          />

          {/* Right Peak Snow Cap */}
          <polygon
            points="285,160 265,185 280,182 290,195 305,182 320,190"
            fill="#ffffff"
          />

          {/* Mountain Sharp Outline Edges */}
          <polyline
            points="95,245 225,155 260,185 285,160 435,235"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="285" y1="160" x2="330" y2="240" stroke="#001122" strokeWidth="4" />
        </g>

        {/* 5. Typography: iNDIA'S */}
        {/* Cyan Dot on the 'i' */}
        <circle cx="78" cy="288" r="11" fill="#00d4ff" filter="url(#cyanGlow)" />
        {/* 'i' stem */}
        <rect x="71" y="306" width="14" height="42" fill="#00d4ff" rx="2" />

        {/* "NDIA'S" in bold sharp white font */}
        <text
          x="94"
          y="348"
          fill="#ffffff"
          fontSize="56"
          fontFamily="Outfit, 'Arial Black', sans-serif"
          fontWeight="900"
          letterSpacing="4"
        >
          NDIA'S
        </text>

        {/* 6. Middle Bar: — SlopeSafe-AI — */}
        {/* Left Dash */}
        <line x1="45" y1="384" x2="80" y2="384" stroke="#00d4ff" strokeWidth="6" strokeLinecap="round" />

        {/* Text: SlopeSafe-AI */}
        <text
          x="250"
          y="395"
          fill="#ffffff"
          fontSize="36"
          fontFamily="Outfit, Inter, sans-serif"
          fontWeight="900"
          textAnchor="middle"
          letterSpacing="2"
        >
          SlopeSafe-AI
        </text>

        {/* Right Dash */}
        <line x1="420" y1="384" x2="455" y2="384" stroke="#00d4ff" strokeWidth="6" strokeLinecap="round" />

        {/* 7. Bottom Text: ERROR 404 */}
        <text
          x="250"
          y="442"
          fill="#00d4ff"
          fontSize="30"
          fontFamily="Outfit, 'JetBrains Mono', monospace"
          fontWeight="900"
          textAnchor="middle"
          letterSpacing="4"
        >
          ERROR 404
        </text>
      </svg>

      {/* Optional Side Branding Text for Headers */}
      {showTextBeside && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`text-base sm:text-lg font-black tracking-tight font-display ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              INDIA&apos;S <span className="text-cyan-600">SlopeSafe</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-300">
              -AI
            </span>
            <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 border border-cyan-800 ml-1">
              ERROR 404
            </span>
          </div>
          <p className={`text-[10px] sm:text-[11px] font-mono leading-none mt-0.5 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            National Landslide Risk Intelligence Portal
          </p>
        </div>
      )}
    </div>
  );
};

import React from "react";

// =========================================================================
// 1. CUTE PERSON AVATARS (Modern Illustrated Tech Persona)
// =========================================================================

/**
 * Cute, friendly student developer avatar (Hilman - Tech Lead / D4 SIB)
 * Designed with soft gradients, stylish glasses, cool hairstyle, and hoodie.
 */
export function CuteStudentAvatar({
  className = "w-10 h-10",
  showBadge = true,
}: {
  className?: string;
  showBadge?: boolean;
}) {
  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full rounded-2xl shadow-sm hover:scale-105 transition-transform duration-200"
      >
        <defs>
          <linearGradient id="avatarBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fee2e2" />
            <stop offset="50%" stopColor="#fecdd3" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
          <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#fcd34d" />
          </linearGradient>
        </defs>

        {/* Background rounded squircle */}
        <rect width="64" height="64" rx="18" fill="url(#avatarBgGrad)" />

        {/* Hoodie / Shoulders */}
        <path
          d="M12 64 C12 48, 20 44, 32 44 C44 44, 52 48, 52 64 Z"
          fill="url(#hoodieGrad)"
        />
        {/* Hoodie Collar V */}
        <path d="M26 44 L32 53 L38 44 Z" fill="#7f1d1d" />
        <circle cx="32" cy="53" r="2" fill="#ffffff" opacity="0.8" />

        {/* Neck */}
        <rect x="28" y="38" width="8" height="8" rx="2" fill="#fbb040" />

        {/* Head / Face */}
        <ellipse cx="32" cy="30" rx="13" ry="14" fill="url(#skinGrad)" />

        {/* Blush Cheeks (Cute touch!) */}
        <circle cx="23" cy="34" r="2.5" fill="#f43f5e" opacity="0.45" />
        <circle cx="41" cy="34" r="2.5" fill="#f43f5e" opacity="0.45" />

        {/* Stylish Modern Glasses (Thick dark frames) */}
        <rect
          x="20"
          y="25"
          width="10"
          height="8"
          rx="3"
          fill="#ffffff"
          fillOpacity="0.4"
          stroke="#0f172a"
          strokeWidth="2"
        />
        <rect
          x="34"
          y="25"
          width="10"
          height="8"
          rx="3"
          fill="#ffffff"
          fillOpacity="0.4"
          stroke="#0f172a"
          strokeWidth="2"
        />
        {/* Glasses Bridge */}
        <path d="M30 28 L34 28" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />

        {/* Friendly Sparkly Eyes inside glasses */}
        <circle cx="25" cy="29" r="1.5" fill="#0f172a" />
        <circle cx="25.5" cy="28.5" r="0.6" fill="#ffffff" />
        <circle cx="39" cy="29" r="1.5" fill="#0f172a" />
        <circle cx="39.5" cy="28.5" r="0.6" fill="#ffffff" />

        {/* Cute Smile */}
        <path
          d="M28 35 Q32 39 36 35"
          stroke="#9a3412"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Modern Fluffy Hair */}
        <path
          d="M19 26 C17 18, 22 13, 32 13 C42 13, 47 18, 45 26 C43 23, 41 21, 38 21 C34 21, 33 23, 30 21 C27 21, 25 24, 23 23 C21 24, 20 25, 19 26 Z"
          fill="url(#hairGrad)"
        />
        {/* Hair Tuft Accent */}
        <path
          d="M30 13 Q35 7 38 12 Q34 11 32 13"
          fill="#334155"
        />
      </svg>

      {/* Online / Ready Status Indicator Badge */}
      {showBadge && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
        </span>
      )}
    </div>
  );
}

/**
 * Cute Mentor / Counselor Avatar
 */
export function CuteMentorAvatar({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full rounded-2xl shadow-sm hover:scale-105 transition-transform duration-200"
      >
        <defs>
          <linearGradient id="mentorBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ede9fe" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id="mentorCoat" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#3730a3" />
          </linearGradient>
        </defs>

        <rect width="64" height="64" rx="18" fill="url(#mentorBgGrad)" />

        {/* Blazer / Coat */}
        <path d="M12 64 C12 48, 20 44, 32 44 C44 44, 52 48, 52 64 Z" fill="url(#mentorCoat)" />
        <path d="M26 44 L32 55 L38 44 Z" fill="#ffffff" />
        {/* Tie */}
        <path d="M31 46 L33 46 L34 56 L32 58 L30 56 Z" fill="#dc2626" />

        {/* Head */}
        <ellipse cx="32" cy="29" rx="12" ry="13" fill="#fed7aa" />

        {/* Glasses */}
        <circle cx="26" cy="28" r="4.5" stroke="#1e1b4b" strokeWidth="1.8" fill="#ffffff" fillOpacity="0.4" />
        <circle cx="38" cy="28" r="4.5" stroke="#1e1b4b" strokeWidth="1.8" fill="#ffffff" fillOpacity="0.4" />
        <path d="M30.5 28 L33.5 28" stroke="#1e1b4b" strokeWidth="1.8" />

        {/* Eyes & Smile */}
        <circle cx="26" cy="28" r="1.3" fill="#1e1b4b" />
        <circle cx="38" cy="28" r="1.3" fill="#1e1b4b" />
        <path d="M29 34 Q32 37 35 34" stroke="#9a3412" strokeWidth="1.6" strokeLinecap="round" fill="none" />

        {/* Mature Hair */}
        <path
          d="M20 24 C18 16, 23 12, 32 12 C41 12, 46 16, 44 24 C41 21, 35 20, 32 21 C29 20, 23 21, 20 24 Z"
          fill="#475569"
        />
      </svg>
    </div>
  );
}

/**
 * Cute AI Mascot Robot Avatar
 */
export function CuteBotMascot({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full hover:rotate-6 transition-transform duration-200"
      >
        <defs>
          <linearGradient id="botGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
        </defs>

        {/* Antenna */}
        <line x1="24" y1="5" x2="24" y2="12" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
        <circle cx="24" cy="4" r="3" fill="#fbbf24" />

        {/* Head body */}
        <rect x="8" y="12" width="32" height="26" rx="10" fill="url(#botGrad)" />

        {/* Screen / Visor */}
        <rect x="13" y="17" width="22" height="13" rx="6" fill="#0f172a" />

        {/* Glowing Cheerful Eyes */}
        <ellipse cx="19" cy="23.5" rx="2.5" ry="3.5" fill="#38bdf8" />
        <ellipse cx="29" cy="23.5" rx="2.5" ry="3.5" fill="#38bdf8" />

        {/* Friendly Blush */}
        <circle cx="11" cy="28" r="2" fill="#fca5a5" opacity="0.6" />
        <circle cx="37" cy="28" r="2" fill="#fca5a5" opacity="0.6" />

        {/* Neck */}
        <rect x="20" y="38" width="8" height="5" rx="2" fill="#cbd5e1" />
      </svg>
    </div>
  );
}

// =========================================================================
// 2. CUSTOM COOL & UNIQUE BUTTON / FEATURE ICONS
// =========================================================================

/**
 * Futuristic 3D-styled Rocket Launch Icon (For "What's Next?", "Eksplorasi Jalur")
 */
export function IconCoolRocket({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
        <linearGradient id="flameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      {/* Flame Trail */}
      <path
        d="M6 18 C5 20, 3 22, 2 22 C4 21, 6 19, 6 18 Z"
        fill="url(#flameGrad)"
      />
      <path
        d="M8 16 C6 19, 4 21, 3 21 C5 19, 7 17, 8 16 Z"
        fill="#fef08a"
      />
      {/* Rocket Main Hull */}
      <path
        d="M14.5 3 C10.5 4 6 8.5 5 13 L8 14 L11 11 L13 13 L10 16 L11 19 C15.5 18 20 13.5 21 9.5 C21 9.5 21 8 19 6 C17 4 14.5 3 14.5 3 Z"
        fill="url(#rocketGrad)"
      />
      {/* Porthole Window */}
      <circle cx="14.5" cy="9.5" r="2.2" fill="#ffffff" />
      <circle cx="14.5" cy="9.5" r="1.4" fill="#0284c7" />
      {/* Fin */}
      <path d="M4 14 L1.5 16 C3 16.5 4 16 5 15.5 Z" fill="#be123c" />
      <path d="M10 20 L8.5 22.5 C9 21 9.5 20 10 20 Z" fill="#be123c" />
    </svg>
  );
}

/**
 * 3D-styled Modern Compass Icon (For "Career Explorer")
 */
export function IconCoolCompass({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="compRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
      </defs>
      {/* Outer Ring */}
      <circle cx="12" cy="12" r="9" stroke="url(#compRing)" strokeWidth="2.2" />
      <circle cx="12" cy="12" r="7" stroke="#fee2e2" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
      {/* North Arrow (Red) */}
      <path d="M12 4 L14.5 12 L12 10.5 L9.5 12 Z" fill="#dc2626" />
      {/* South Arrow (Slate) */}
      <path d="M12 20 L14.5 12 L12 13.5 L9.5 12 Z" fill="#64748b" />
      {/* Center Pivot Pin */}
      <circle cx="12" cy="12" r="1.5" fill="#ffffff" stroke="#991b1b" strokeWidth="1" />
    </svg>
  );
}

/**
 * Modern Flagship & Strategic Industry Icon
 */
export function IconCoolShip({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="shipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>
      {/* Radar Mast & Bridge */}
      <path d="M11 5 L13 5 L13 9 L11 9 Z" fill="#dc2626" />
      <path d="M8 9 L16 9 L15 13 L9 13 Z" fill="#e2e8f0" />
      <rect x="10" y="10" width="4" height="2" rx="0.5" fill="#0369a1" />
      {/* Ship Hull */}
      <path
        d="M2 13 L22 13 L19.5 19 C18 20, 6 20, 4.5 19 Z"
        fill="url(#shipGrad)"
      />
      {/* Water Wave Lines */}
      <path
        d="M1 21 Q4 19 7 21 T13 21 T19 21 T24 21"
        stroke="#38bdf8"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * Holographic Shield with Checkmark (For "Skill Passport")
 */
export function IconCoolPassport({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>
      <path
        d="M12 3 L19 6 V12 C19 16.5 16 19.5 12 21 C8 19.5 5 16.5 5 12 V6 Z"
        fill="url(#shieldGrad)"
      />
      {/* Star / Sparkle in top right */}
      <circle cx="16" cy="8" r="1.2" fill="#fef08a" />
      {/* Checkmark */}
      <path
        d="M8.5 12 L11 14.5 L15.5 9.5"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Bullseye Target with Arrow (For "Rencana Aksi IDP")
 */
export function IconCoolTarget({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="9" stroke="#dc2626" strokeWidth="2" fill="#fef2f2" />
      <circle cx="12" cy="12" r="6" stroke="#f87171" strokeWidth="1.5" fill="#ffffff" />
      <circle cx="12" cy="12" r="3" fill="#dc2626" />
      {/* Arrow shaft and head */}
      <line x1="12" y1="12" x2="20" y2="4" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 4 L21 4 L21 6" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * AI Brain Sparkle Constellation (For "AI Career Mentor")
 */
export function IconCoolAI({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      {/* 4-point star */}
      <path
        d="M12 2 C12 7, 17 12, 22 12 C17 12, 12 17, 12 22 C12 17, 7 12, 2 12 C7 12, 12 7, 12 2 Z"
        fill="url(#aiGrad)"
      />
      <circle cx="18" cy="5" r="1.5" fill="#fbbf24" />
      <circle cx="6" cy="19" r="1.5" fill="#38bdf8" />
    </svg>
  );
}


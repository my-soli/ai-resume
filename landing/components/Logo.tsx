export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="raiDoc" x1="5" y1="4" x2="26" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="raiSpark" x1="25" y1="24" x2="45" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>

      {/* Document body with folded corner */}
      <path
        d="M5,4 L20,4 L26,10 L26,42 Q26,44 24,44 L7,44 Q5,44 5,42 Z"
        fill="url(#raiDoc)"
      />
      {/* Fold shadow */}
      <path d="M20,4 L26,10 L20,10 Z" fill="#4338CA" />

      {/* Resume text lines */}
      <rect x="8" y="15"   width="14" height="2.5" rx="1.25" fill="white" fillOpacity="0.92" />
      <rect x="8" y="21"   width="10" height="1.5" rx="0.75" fill="white" fillOpacity="0.55" />
      <rect x="8" y="24.5" width="13" height="1.5" rx="0.75" fill="white" fillOpacity="0.55" />
      <rect x="8" y="28"   width="9"  height="1.5" rx="0.75" fill="white" fillOpacity="0.55" />
      <rect x="8" y="31.5" width="11" height="1.5" rx="0.75" fill="white" fillOpacity="0.35" />

      {/* AI sparkle badge */}
      <circle cx="35" cy="34" r="10" fill="url(#raiSpark)" />
      {/* 4-pointed star */}
      <path
        d="M35,27 L36.4,32.6 L42,34 L36.4,35.4 L35,41 L33.6,35.4 L28,34 L33.6,32.6 Z"
        fill="white"
      />
    </svg>
  );
}

export default function Logo({
  size = 36,
  showText = true,
}: {
  size?: number;
  showText?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      {showText && (
        <span className="font-bold text-gray-900 text-lg leading-none tracking-tight">
          AI CV{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
            Builder
          </span>
        </span>
      )}
    </span>
  );
}

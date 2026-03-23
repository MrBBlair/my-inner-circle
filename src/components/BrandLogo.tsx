type BrandLogoProps = {
  /** Icon only, or include wordmark text */
  variant?: "mark" | "full";
  size?: "sm" | "md" | "lg";
  className?: string;
  idSuffix?: string;
};

const sizes = { sm: 36, md: 44, lg: 56 };

/**
 * The My Inner Circle — custom SVG mark (three nodes in a circle = community + safe space).
 */
export function BrandLogo({
  variant = "full",
  size = "md",
  className = "",
  idSuffix = "default",
}: BrandLogoProps) {
  const px = sizes[size];
  const gradId = `mic-logo-grad-${idSuffix}`;
  const glowId = `mic-logo-glow-${idSuffix}`;

  const mark = (
    <svg
      width={px}
      height={px}
      viewBox="0 0 120 120"
      className={className}
      aria-hidden={variant === "full" ? true : undefined}
      role={variant === "mark" ? "img" : undefined}
      aria-label={variant === "mark" ? "The My Inner Circle logo" : undefined}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5a9a94" />
          <stop offset="45%" stopColor="#e8b4b8" />
          <stop offset="100%" stopColor="#9b87b3" />
        </linearGradient>
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="60" cy="60" r="56" fill={`url(#${gradId})`} filter={`url(#${glowId})`} opacity="0.98" />
      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
      {/* Three pearls — sisterhood / circle */}
      <circle cx="60" cy="38" r="10" fill="rgba(255,255,255,0.95)" />
      <circle cx="38" cy="74" r="10" fill="rgba(255,255,255,0.92)" />
      <circle cx="82" cy="74" r="10" fill="rgba(255,255,255,0.92)" />
      <path
        d="M60 48 C52 58 48 68 44 72 M60 48 C68 58 72 68 76 72 M44 72 Q60 82 76 72"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === "mark") return mark;

  return (
    <span
      className={`brand-logo brand-logo--full ${className}`.trim()}
      style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem" }}
    >
      {mark}
      <span className="brand-logo__text">
        <span className="brand-logo__the">The </span>
        <span className="brand-logo__name">My Inner Circle</span>
      </span>
    </span>
  );
}

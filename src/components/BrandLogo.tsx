import brandLogoAsset from "../assets/brand-logo.png";

type BrandLogoProps = {
  /** Full lockup (default) or cropped mark for tight headers */
  variant?: "mark" | "full";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const markBoxPx = { sm: 54, md: 68, lg: 84 };
const fullMaxHeightPx = { sm: 64, md: 78, lg: 100 };

/**
 * The My Inner Circle App — official raster lockup (mark + wordmark).
 */
export function BrandLogo({ variant = "full", size = "md", className = "" }: BrandLogoProps) {
  const rootClass = `brand-logo brand-logo--${variant} ${className}`.trim();

  if (variant === "mark") {
    const px = markBoxPx[size];
    return (
      <span className={rootClass} style={{ width: px, height: px, display: "inline-block", flexShrink: 0 }}>
        <img
          src={brandLogoAsset}
          alt=""
          width={px}
          height={px}
          className="brand-logo__img brand-logo__img--mark"
          decoding="async"
        />
      </span>
    );
  }

  const maxH = fullMaxHeightPx[size];
  return (
    <span className={rootClass} style={{ display: "inline-flex", lineHeight: 0 }}>
      <img
        src={brandLogoAsset}
        alt="The My Inner Circle App"
        className="brand-logo__img brand-logo__img--full"
        style={{ height: maxH, width: "auto", maxWidth: "min(100%, 520px)" }}
        decoding="async"
      />
    </span>
  );
}

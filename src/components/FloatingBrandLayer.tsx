import { useMemo } from "react";
import type { CSSProperties } from "react";

const LOGO_SRC = "/InnerCircle_Old_Logo.png";

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function anim(durMin: number, durMax: number, delayMin: number, delayMax: number): CSSProperties {
  return {
    ["--mic-float-dur" as string]: `${rand(durMin, durMax)}s`,
    ["--mic-float-delay" as string]: `${rand(delayMin, delayMax)}s`,
  };
}

type Variant = "marketing" | "app";

type MarkConfig = { slotStyle: CSSProperties; scale: number };

export function FloatingBrandLayer({ variant = "marketing" }: { variant?: Variant }) {
  const marks = useMemo((): MarkConfig[] => {
    const nearEdges = () =>
      Math.random() < 0.5
        ? ({ top: `${rand(6, 28)}vh`, left: `${rand(2, 12)}vw` } as const)
        : ({ top: `${rand(6, 28)}vh`, left: `${rand(72, 86)}vw` } as const);

    const midField = () =>
      ({
        top: `${rand(38, 72)}vh`,
        left: `${rand(18, 78)}vw`,
      }) as const;

    if (variant === "app") {
      return [
        {
          slotStyle: {
            ...nearEdges(),
            ...anim(26, 44, -20, 0),
          },
          scale: rand(0.82, 1.08),
        },
        {
          slotStyle: anim(30, 50, -24, -4),
          scale: rand(0.72, 0.98),
        },
      ];
    }

    return [
      {
        slotStyle: {
          ...nearEdges(),
          ...anim(26, 44, -20, 0),
        },
        scale: rand(0.82, 1.08),
      },
      {
        slotStyle: {
          ...midField(),
          ...anim(30, 50, -24, -4),
        },
        scale: rand(0.72, 0.98),
      },
    ];
  }, [variant]);

  return (
    <div
      className={`floating-brand-layer${variant === "app" ? " floating-brand-layer--app" : ""}`}
      aria-hidden="true"
    >
      {marks.map((m, i) => (
        <div
          key={i}
          className={
            variant === "app" && i === 1
              ? "floating-brand-layer__slot floating-brand-layer__slot--app-gutter"
              : "floating-brand-layer__slot"
          }
          style={m.slotStyle}
        >
          <div className="floating-brand-layer__mark-scale" style={{ transform: `scale(${m.scale})` }}>
            <img src={LOGO_SRC} alt="" className="floating-brand-layer__mark" draggable={false} />
          </div>
        </div>
      ))}
    </div>
  );
}

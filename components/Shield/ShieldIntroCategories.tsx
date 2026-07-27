"use client";

import { useEffect, useRef, type RefObject } from "react";

// ShieldIntroCategories — centered intro row of the 3 stage categories,
// shown BEFORE the hex callouts begin firing.
//
// Lives in the scroll window [0, 0.04]. SEQ_START for the first hex is 0.03,
// so this intro fully fades out before the first callout surfaces. Reads as
// "here's what you'll see next" — the same three labels that StageProgress
// then re-shows individually as each act completes, but presented up front
// as the section's table of contents.
//
// rAF + direct DOM writes — matches the StageProgress / captionState
// pattern in shieldMotion.ts. No React state in the hot path.

interface ShieldIntroCategoriesProps {
  scrollProgressRef: RefObject<number>;
  reducedMotion: boolean;
  viewportWidth: number;
}

interface Category {
  idx: string;
  name: string;
  accent: string;
}

const CATEGORIES: ReadonlyArray<Category> = [
  { idx: "01", name: "THE DIAGNOSIS",    accent: "var(--accent-copper)" },
  { idx: "02", name: "THE PRESCRIPTION", accent: "var(--accent-teal)"   },
  { idx: "03", name: "THE OUTCOME",      accent: "var(--accent-copper)" },
];

// Opacity window: fade-in 0..0.008, hold 0.008..0.022, fade-out 0.022..0.038.
// Fully clear by 0.04 — first hex begins travel at SEQ_START=0.03 with its
// callout not yet visible until TRAVEL_END (~0.074), so there's a real
// breath between this row vanishing and the first callout surfacing.
const FADE_IN_END  = 0.008;
const HOLD_END    = 0.022;
const FADE_OUT_END = 0.038;

function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

function introOpacity(p: number): number {
  if (p < 0 || p >= FADE_OUT_END) return 0;
  if (p < FADE_IN_END)  return smoothstep(p / FADE_IN_END);
  if (p < HOLD_END)     return 1;
  return 1 - smoothstep((p - HOLD_END) / (FADE_OUT_END - HOLD_END));
}

export default function ShieldIntroCategories({
  scrollProgressRef,
  reducedMotion,
  viewportWidth,
}: ShieldIntroCategoriesProps) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([null, null, null]);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([null, null]);

  // Single-row, nowrap layout — natural width (~650-750px) doesn't fit under
  // ~768px. Matches StageProgress's desktop-only rail breakpoint; this intro
  // row is purely decorative (aria-hidden) so hiding it below that width
  // loses no content.
  const showRow = viewportWidth >= 768;

  useEffect(() => {
    if (!showRow || reducedMotion) {
      // No scroll = no intro. Section still reads the same as before —
      // a brief beat of black then the shield assembles.
      if (wrapRef.current) wrapRef.current.style.opacity = "0";
      return;
    }

    let raf = 0;
    const tick = () => {
      const p = scrollProgressRef.current ?? 0;
      const op = introOpacity(p);

      if (wrapRef.current) {
        wrapRef.current.style.opacity = String(op);
        // Subtle rise as it fades in; hold; subtle settle as it fades out.
        const yIn  = (1 - smoothstep(Math.min(1, Math.max(0, p / FADE_IN_END)))) * 8;
        const yOut = smoothstep(Math.max(0, (p - HOLD_END) / (FADE_OUT_END - HOLD_END))) * -4;
        wrapRef.current.style.transform = `translateX(-50%) translateY(${(yIn + yOut).toFixed(2)}px)`;
      }

      // Per-item opacity tracks the row; connectors fade at 60% so they
      // read as supporting hairlines, not primary content.
      for (let i = 0; i < 3; i++) {
        const item = itemRefs.current[i];
        if (item) item.style.opacity = String(op);
      }
      for (let i = 0; i < 2; i++) {
        const line = lineRefs.current[i];
        if (line) line.style.opacity = String(op * 0.6);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, scrollProgressRef, showRow]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      style={{
        position: "absolute",
        top: "10%",
        left: "50%",
        transform: "translateX(-50%) translateY(8px)",
        display: "flex",
        alignItems: "center",
        gap: "clamp(14px, 2.5vw, 28px)",
        padding: "0.6rem clamp(16px, 2.5vw, 28px)",
        opacity: 0,
        pointerEvents: "none",
        zIndex: 3,
        willChange: "transform, opacity",
      }}
    >
      {CATEGORIES.map((c, i) => (
        <div key={c.idx} style={{ display: "flex", alignItems: "center", gap: "clamp(14px, 2.5vw, 28px)" }}>
          <div
            ref={(el) => { itemRefs.current[i] = el; }}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "0.55rem",
              whiteSpace: "nowrap",
              opacity: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                fontSize: "clamp(0.78rem, 0.95vw, 0.88rem)",
                fontWeight: 800,
                letterSpacing: "0.26em",
                color: c.accent,
                textShadow: `0 0 10px ${c.accent}66`,
              }}
            >
              [{c.idx}]
            </span>
            <span
              style={{
                fontFamily: "var(--font-fraunces, Georgia, serif)",
                fontSize: "clamp(1rem, 1.4vw, 1.3rem)",
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: "#F4F1E8",
                textTransform: "uppercase",
              }}
            >
              {c.name}
            </span>
          </div>
          {/* Connector hairline after each item except the last */}
          {i < CATEGORIES.length - 1 && (
            <span
              ref={(el) => { lineRefs.current[i] = el; }}
              aria-hidden
              style={{
                display: "inline-block",
                width: "clamp(18px, 3vw, 40px)",
                height: 1,
                background: "linear-gradient(90deg, transparent, rgba(199,162,58,0.55), transparent)",
                opacity: 0,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
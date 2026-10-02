"use client";

import { FINALE_CAPTIONS } from "./finaleConstants";

interface FinaleCaptionProps {
  activeIndex: number;
  reducedMotion: boolean;
  /** True once the bottom stat strip + CTA are visible. On mobile the
   * caption is repositioned to the bottom (max-md:!bottom-24), which sits
   * directly behind the stats/CTA once they appear — desktop is unaffected
   * since its caption sits vertically centered, away from that cluster. */
  hideOnMobile?: boolean;
}

// HTML caption overlay for the convergence finale. Motion handles the
// cross-fade between chapters (micro-interaction — the scroll scrub itself
// stays in GSAP/useFrame land).
export default function FinaleCaption({ activeIndex, reducedMotion, hideOnMobile = false }: FinaleCaptionProps) {
  const caption = FINALE_CAPTIONS[activeIndex] ?? FINALE_CAPTIONS[0];

  return (
    <div
      style={{
        position: "absolute",
        left: "clamp(1.5rem, 6vw, 6rem)",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 4,
        maxWidth: "min(34rem, 42vw)",
        pointerEvents: "none",
      }}
      className={`max-md:!left-6 max-md:!right-6 max-md:!top-auto max-md:!bottom-24 max-md:!max-w-none max-md:!translate-y-0 ${hideOnMobile ? "max-md:hidden" : ""}`}
    >
      {/* Cross-fade between chapters was AnimatePresence + motion.div. Now the
          keyed remount replays a CSS animation — same fade/blur-in feel, no
          library import. The exit half of the old transition is intentionally
          dropped (the outgoing caption is replaced immediately). */}
      <style>{`
        @keyframes sgc-caption-in {
          from { opacity: 0; transform: translateY(22px); filter: blur(6px); }
          to   { opacity: 1; transform: none; filter: blur(0); }
        }
        .sgc-caption-in { animation: sgc-caption-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @media (prefers-reduced-motion: reduce) { .sgc-caption-in { animation: none; } }
      `}</style>
      <div key={activeIndex} className={reducedMotion ? "" : "sgc-caption-in"}>
          <p
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "0.68rem",
              letterSpacing: "0.22em",
              color: "rgba(199,162,58,0.75)",
              marginBottom: "0.9rem",
            }}
          >
            {caption.eyebrow}
          </p>
          <h3
            style={{
              fontFamily: "var(--font-fraunces, serif)",
              fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)",
              fontWeight: 600,
              lineHeight: 1.15,
              color: "#F4F1EA",
              marginBottom: "0.8rem",
            }}
          >
            {caption.headline}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-inter, sans-serif)",
              fontSize: "clamp(0.9rem, 1.15vw, 1.05rem)",
              lineHeight: 1.6,
              color: "#A7AAB0",
            }}
          >
            {caption.subline}
          </p>
      </div>
    </div>
  );
}

"use client";

import { DIAMONDS } from "./diamonds.config";

interface CinematicCaptionProps {
  activeIndex: number;
}

export default function CinematicCaption({ activeIndex }: CinematicCaptionProps) {
  const diamond = DIAMONDS[activeIndex];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {/* Bottom-left: counter + progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(1rem, 4vh, 2.5rem)",
          left: "2.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "0.65rem",
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(199,162,58,0.6)",
          }}
        >
          {String(activeIndex + 1).padStart(2, "0")}&nbsp;/&nbsp;08
        </span>
        {/* Gold progress bar */}
        <div
          style={{
            width: "4rem",
            height: "1px",
            background: "rgba(199,162,58,0.2)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#C7A23A",
              transformOrigin: "left",
              transform: `scaleX(${(activeIndex + 1) / 8})`,
              transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>
      </div>

      {/* Bottom-center: active diamond headline + subhead */}
      {/* Cross-fade between diamonds was AnimatePresence + motion.div; now a
          keyed remount replaying a CSS animation (same fade/blur-in). */}
      <style>{`
        @keyframes sgc-helix-caption-in {
          from { opacity: 0; transform: translate(-50%, 16px); filter: blur(4px); }
          to   { opacity: 1; transform: translate(-50%, 0);    filter: blur(0); }
        }
        .sgc-helix-caption-in { animation: sgc-helix-caption-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) both; }
        @media (prefers-reduced-motion: reduce) { .sgc-helix-caption-in { animation: none; } }
      `}</style>
      <div
        key={activeIndex}
        className="sgc-helix-caption-in"
        style={{
          position: "absolute",
          bottom: "3rem",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          maxWidth: "min(640px, 80vw)",
          pointerEvents: "auto",
        }}
      >
          {/* Gold connection line — bridges active diamond to caption text */}
          <div
            style={{
              width: "1px",
              height: "36px",
              margin: "0 auto 0.875rem",
              background:
                "repeating-linear-gradient(to bottom, #C7A23A 0px, #C7A23A 4px, transparent 4px, transparent 8px)",
              opacity: 0.5,
            }}
          />
          <h2
            style={{
              fontFamily: "var(--font-fraunces, serif)",
              fontSize: "clamp(1.1rem, 2vw, 1.65rem)",
              fontWeight: 700,
              lineHeight: 1.25,
              color: "#F4F1E8",
              textShadow: "0 2px 24px rgba(0,0,0,0.85)",
              marginBottom: "0.5rem",
            }}
          >
            {diamond.headline}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter, sans-serif)",
              fontSize: "clamp(0.8rem, 1vw, 0.95rem)",
              lineHeight: 1.7,
              color: "rgba(199,162,58,0.8)",
              textShadow: "0 1px 12px rgba(0,0,0,0.9)",
            }}
          >
            {diamond.subhead}
          </p>
          {diamond.isCTA && (
            <a
              href="#contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "1.5rem",
                padding: "0.7rem 1.5rem",
                background: "#C7A23A",
                color: "#080B11",
                fontFamily: "var(--font-inter, sans-serif)",
                fontSize: "0.875rem",
                fontWeight: 600,
                textDecoration: "none",
                borderRadius: "2px",
                letterSpacing: "0.04em",
              }}
            >
              Book a Finance Operations Audit →
            </a>
          )}
      </div>
    </div>
  );
}

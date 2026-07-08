"use client";

import { FINALE_CAPTIONS } from "./finaleMotion";
import FinaleStats from "./FinaleStats";

// Static recap for prefers-reduced-motion: the four story beats stacked as
// quiet cards, no WebGL, no pin — a single readable viewport.
export default function ReducedMotionFinaleFallback() {
  return (
    <section
      id="finale"
      aria-label="The SGC journey, summarized"
      style={{
        position: "relative",
        minHeight: "100dvh",
        background: "#080B11",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "6rem 1.5rem 9rem",
        overflow: "hidden",
      }}
    >
      <h2 className="sr-only">The SGC journey, summarized</h2>
      <div style={{ maxWidth: "46rem", margin: "0 auto", width: "100%" }}>
        {FINALE_CAPTIONS.map((caption) => (
          <div
            key={caption.eyebrow}
            style={{
              borderLeft: "2px solid rgba(199,162,58,0.4)",
              paddingLeft: "1.5rem",
              marginBottom: "2.5rem",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "0.65rem",
                letterSpacing: "0.22em",
                color: "rgba(199,162,58,0.75)",
                marginBottom: "0.5rem",
              }}
            >
              {caption.eyebrow}
            </p>
            <h3
              style={{
                fontFamily: "var(--font-fraunces, serif)",
                fontSize: "clamp(1.3rem, 2.4vw, 1.8rem)",
                fontWeight: 600,
                color: "#F4F1EA",
                marginBottom: "0.4rem",
                lineHeight: 1.2,
              }}
            >
              {caption.headline}
            </h3>
            <p
              style={{
                fontFamily: "var(--font-inter, sans-serif)",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                color: "#A7AAB0",
              }}
            >
              {caption.subline}
            </p>
          </div>
        ))}
      </div>
      <FinaleStats reducedMotion />
    </section>
  );
}

"use client";

/**
 * ReducedMotionTransitionFallback — static centered gold ring + mono
 * caption. Renders in place of the canvas-driven HelixToShieldTransition
 * when prefers-reduced-motion is set.
 */
export default function ReducedMotionTransitionFallback() {
  return (
    <div
      id="helix-to-shield"
      className="relative w-full bg-[#080B11] py-16 md:py-24"
      style={{ minHeight: "60vh" }}
      aria-label="Transition: helix to shield"
    >
      <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <div
          aria-hidden
          className="mb-8 h-[120px] w-[120px] rounded-full border-2 border-[rgba(199,162,58,0.7)]"
          style={{
            boxShadow:
              "0 0 30px rgba(199,162,58,0.45), inset 0 0 18px rgba(199,162,58,0.25)",
          }}
        />
        <p
          style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}
          className="text-[0.72rem] font-bold uppercase tracking-[0.34em] text-[rgba(199,162,58,0.85)]"
        >
          · · ·
        </p>
        <p
          style={{ fontFamily: "var(--font-fraunces)" }}
          className="mt-4 text-[clamp(1.5rem,2.4vw,2rem)] font-bold leading-[1.2] text-[var(--text-primary)]"
        >
          A firm that anchors.
        </p>
        <p
          style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}
          className="mt-3 text-[0.65rem] tracking-[0.32em] text-[rgba(167,170,176,0.6)]"
        >
          ANIMATED INTERMISSION · REDUCED MOTION
        </p>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import HoneycombSpinner from "@/components/ui/HoneycombSpinner";

/**
 * LoadingScreen — first-paint splash with strong contrast + animated reveal.
 *
 *   - Fixed full-viewport overlay, z-[9999], sits above every section.
 *   - Brand palette: vault-ink background, refined-gold gradient text + bar.
 *   - Animated gold sweep across the monogram on mount (skew shimmer),
 *     so the screen reads as "loading, not broken" even before the bar
 *     advances.
 *   - Two thin gold corner brackets frame the monogram — institutional
 *     credential framing, picks up the bezel motif from AwardBadge.
 *   - Subtle scanline + radial vignette so contrast holds even on the
 *     darkest monitors.
 *   - Progress bar fills 0 → 100% over a fixed budget, plus a dismiss
 *     on `window.load`. Honors `prefers-reduced-motion`.
 *
 * One-shot — after first dismiss, `STORAGE_KEY` is set in sessionStorage
 * so re-mounts during HMR don't flash the splash again.
 */

const MIN_VISIBLE_MS = 1400; // never flash past first paint
const MAX_VISIBLE_MS = 4500; // safety bound if window.load never fires

export default function LoadingScreen() {
  const reducedMotionPref = useReducedMotion();
  // `useReducedMotion` can resolve differently between the server render and
  // the client's pre-hydration pass, and `reduced` branches whole JSX
  // subtrees below — trusting it before mount causes a hydration mismatch.
  // First paint always assumes full motion; the real preference applies
  // immediately after mount (imperceptible on a loading splash).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduced = mounted ? !!reducedMotionPref : false;
  const [visible, setVisible] = useState(true);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Splash shows on every page load (including refresh) — the brand wants
    // the loading animation visible on each entry, not just first paint.

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      // Asymptotic curve toward 100% — never blocks the user if window.load
      // is fast, but always reads as "progressing" if it's slow.
      const p = Math.min(100, 100 * (1 - Math.exp(-elapsed / 900)));
      // Write to DOM directly to avoid React re-render on every frame
      if (labelRef.current) {
        labelRef.current.textContent = `${Math.round(p).toString().padStart(3, "0")}% · Loading`;
      }
      if (barRef.current) {
        barRef.current.style.width = `${p}%`;
      }
      if (elapsed < MAX_VISIBLE_MS) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const dismiss = () => {
      const elapsed = performance.now() - start;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(() => {
        setVisible(false);
      }, wait);
    };

    if (document.readyState === "complete") {
      dismiss();
    } else {
      window.addEventListener("load", dismiss, { once: true });
    }

    // Hard cap so we never trap the user.
    const safety = window.setTimeout(dismiss, MAX_VISIBLE_MS);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", dismiss);
      window.clearTimeout(safety);
    };
  }, []);

  if (!visible) return null;

  // Reduced motion: instant fade, no progress bar animation.
  const overlayVariants = reduced
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 0, transition: { duration: 0.25 } },
      }
    : {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: {
          opacity: 0,
          y: -8,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
        },
      };

  return (
    <motion.div
      key="sgc-loading"
      role="status"
      aria-live="polite"
      aria-label="Loading SGC Tech AI"
      variants={overlayVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#080B11] overflow-hidden"
    >
      {/* Layer 1 — radial gold wash (matches the hero's brand cue) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(199,162,58,0.10) 0%, rgba(8,11,17,0) 55%)",
        }}
      />

      {/* Layer 2 — animated contrast grid (hairline lattice, slow drift).
          This is the "animated contrast" the brand asks for — a low-opacity
          gold grid that breathes on its own, so the screen never reads as
          flat black even before the monogram lands. */}
      {!reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(199,162,58,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(199,162,58,0.55) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            animation: "sgc-load-drift 14s linear infinite",
          }}
        />
      )}

      {/* Layer 3 — moving scanline. Single thin gold bar that sweeps top→bottom,
          sells "loading, in motion". */}
      {!reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 h-px"
          style={{
            top: 0,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(199,162,58,0.6) 50%, transparent 100%)",
            animation: "sgc-load-scan 2.6s cubic-bezier(0.55,0,0.45,1) infinite",
          }}
        />
      )}

      {/* Layer 4 — top/bottom hairline borders, signature navbar cue */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(199,162,58,0.55)] to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(199,162,58,0.35)] to-transparent"
      />

      <div className="relative flex flex-col items-center gap-7 px-6">
        {/* Honeycomb spinner — premium hex-cell loader. Sits ABOVE the
            monogram stack. Gold hairline hexes around a glowing centre,
            ring rotates + cells stagger through a chase. Same bezel
            vocabulary as the Vanguard Shield tiles. */}
        {!reduced && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
            aria-hidden
          >
            <HoneycombSpinner size={120} />
          </motion.div>
        )}
        {reduced && (
          <div aria-hidden className="relative">
            {/* Static fallback for reduced-motion: monogram-only, no spinner */}
            <HoneycombSpinner size={120} className="opacity-60" />
          </div>
        )}

        {/* Monogram mark — credential-framed: two corner brackets + SGC. */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col items-center gap-3"
        >
          <p
            style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}
            className="text-[0.62rem] uppercase tracking-[0.42em] text-[rgba(199,162,58,0.55)]"
          >
            SGC TECH AI
          </p>

          {/* Monogram with corner brackets and gold shimmer sweep */}
          <div className="relative px-10 py-4">
            {/* Corner brackets — institutional credential framing */}
            {!reduced && (
              <>
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-3 w-3 border-l border-t border-[rgba(199,162,58,0.65)]"
                />
                <span
                  aria-hidden
                  className="absolute right-0 top-0 h-3 w-3 border-r border-t border-[rgba(199,162,58,0.65)]"
                />
                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-[rgba(199,162,58,0.65)]"
                />
                <span
                  aria-hidden
                  className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-[rgba(199,162,58,0.65)]"
                />
              </>
            )}

            <p
              style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
              className="text-gold-gradient relative text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-none tracking-[0.18em]"
            >
              SGC
              {/* Gold shimmer sweep — diagonal highlight that crosses the type */}
              {!reduced && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 overflow-hidden"
                  style={{ mixBlendMode: "screen" }}
                >
                  <span
                    className="absolute inset-y-0 -left-1/2 w-1/3"
                    style={{
                      background:
                        "linear-gradient(115deg, transparent 0%, rgba(255,236,179,0.55) 50%, transparent 100%)",
                      animation: "sgc-shimmer 2.4s ease-in-out infinite",
                    }}
                  />
                </span>
              )}
            </p>
          </div>
        </motion.div>

        {/* Tagline — honest, matches the hero copy */}
        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{ fontFamily: "var(--font-inter, sans-serif)" }}
          className="max-w-md text-center text-[0.78rem] leading-[1.7] text-text-muted md:text-[0.82rem]"
        >
          Practitioner-led Odoo &amp; AI for UAE mid-market.
        </motion.p>

        {/* Progress bar — gold gradient fill over a dim track */}
        <div className="relative mt-4 h-px w-56 overflow-hidden md:w-72">
          <div
            aria-hidden
            className="absolute inset-0 bg-[rgba(199,162,58,0.18)]"
          />
          {!reduced && (
            <div
              ref={barRef}
              aria-hidden
              className="absolute inset-y-0 left-0 bg-gold-gradient"
              style={{ width: "0%" }}
            />
          )}
          {reduced && (
            <div
              aria-hidden
              className="absolute inset-y-0 left-0 bg-gold-gradient"
              style={{ width: "100%" }}
            />
          )}
        </div>

        {/* Progress label — written to DOM directly via ref to avoid re-renders */}
        <p
          ref={labelRef}
          style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}
          className="text-[0.6rem] uppercase tracking-[0.32em] text-text-muted"
          suppressHydrationWarning
        >
          000% · Loading
        </p>
      </div>

      {/* Inject the @keyframes for the loading-only animations.
          Scoped via the inline class so it never leaks elsewhere. */}
      <style>{`
        @keyframes sgc-load-drift {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 44px 44px, 44px 44px; }
        }
        @keyframes sgc-load-scan {
          0%   { top: 0%;   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes sgc-shimmer {
          0%   { transform: translateX(0%); }
          100% { transform: translateX(420%); }
        }
      `}</style>
    </motion.div>
  );
}
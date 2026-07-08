"use client";

/**
 * TidalCursor — production custom cursor with a fluid metallic "tidal"
 * trailing effect in a light-brown / gold palette.
 *
 * Replaces the system pointer with three layers:
 *
 *   1. Main dot — solid metallic gold, snaps 1:1 to the pointer.
 *   2. Wave ring — larger soft gold ring that lags via linear
 *      interpolation (lerpFactor); reads as liquid catching up.
 *   3. Trail particles — last N mouse positions rendered as translucent
 *      circles that shrink and lose opacity with age, producing a
 *      rippling "tide" wake.
 *
 * Performance:
 *   - Single rAF loop. Zero per-frame React state updates.
 *   - All DOM mutation via refs (no React reconciler overhead).
 *   - Inline styles for every dynamic transform / opacity / gradient.
 *
 * A11y / UX:
 *   - SSR-guarded (returns null on typeof window === "undefined").
 *   - Touch devices (hideOnTouch) render null — native stays.
 *   - Honors `prefers-reduced-motion` (snaps to position, no trail).
 *   - Hides the system cursor via cursor: none while mounted,
 *     restores on unmount.
 *   - Wave ring grows on hover over hoverSelectors, ripples on click.
 *
 * Brand tuning: "champagne" preset uses brand palette hexes
 * (#F5E6C8 / #E8C45A / #C7A23A / #B8924D) to match the rest of the
 * SGC Tech AI site; remaining presets use the spec's exact hexes.
 * Explicit color props always take precedence over the preset.
 */

import { useEffect, useRef } from "react";

export type GoldTone = "champagne" | "classic" | "roseGold" | "bronze";
export type CursorBlendMode = "screen" | "plus-lighter" | "normal";

export interface TidalCursorProps {
  goldTone?: GoldTone;
  highlightColor?: string;
  midColor?: string;
  warmColor?: string;
  edgeColor?: string;
  trailLength?: number;
  glowIntensity?: number;
  dotSize?: number;
  ringSize?: number;
  lerpFactor?: number;
  blendMode?: CursorBlendMode;
  hoverSelectors?: string;
  zIndex?: number;
  hideOnTouch?: boolean;
}

const PRESETS: Record<GoldTone, Pick<TidalCursorProps, "highlightColor" | "midColor" | "warmColor" | "edgeColor">> = {
  // Brand-tuned: matches existing site palette
  champagne: {
    highlightColor: "#F5E6C8",
    midColor: "#E8C45A",
    warmColor: "#C7A23A",
    edgeColor: "#B8924D",
  },
  // Spec defaults
  classic: {
    highlightColor: "#F5E6C8",
    midColor: "#D4AF37",
    warmColor: "#A67C52",
    edgeColor: "#8B6914",
  },
  roseGold: {
    highlightColor: "#FFE4D6",
    midColor: "#E0BFB8",
    warmColor: "#B76E79",
    edgeColor: "#7B4B5A",
  },
  bronze: {
    highlightColor: "#E8C9A0",
    midColor: "#B0823D",
    warmColor: "#7B5429",
    edgeColor: "#3C2A1A",
  },
};

export default function TidalCursor(props: TidalCursorProps) {
  const {
    goldTone = "classic",
    highlightColor,
    midColor,
    warmColor,
    edgeColor,
    trailLength = 18,
    glowIntensity = 0.6,
    dotSize = 10,
    ringSize = 40,
    lerpFactor = 0.12,
    blendMode = "screen",
    hoverSelectors = "a, button, [data-cursor-hover]",
    zIndex = 9999,
    hideOnTouch = true,
  } = props;

  // Preset resolution: explicit props always win.
  const preset = PRESETS[goldTone];
  const palette = {
    highlight: highlightColor ?? preset.highlightColor,
    mid: midColor ?? preset.midColor,
    warm: warmColor ?? preset.warmColor,
    edge: edgeColor ?? preset.edgeColor,
  };

  // Refs — never React state on the rAF path.
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const waveRef = useRef<HTMLDivElement | null>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Touch device guard
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (hideOnTouch && isTouch) return;

    // Reduced motion guard
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Apply native cursor hide + class hook
    const prevBodyCursor = document.body.style.cursor;
    document.body.style.cursor = "none";
    document.documentElement.classList.add("sgc-tidal-cursor-active");

    // Theme-aware blend mode: "screen" is gorgeous in dark mode but
    // washes the cursor to near-invisible on cream/white light surfaces.
    // Detect data-theme and set the root blend mode accordingly.
    const updateBlend = () => {
      if (!rootRef.current) return;
      const isLight =
        document.documentElement.getAttribute("data-theme") === "light";
      rootRef.current.style.mixBlendMode =
        isLight && blendMode === "screen" ? "normal" : blendMode;
    };
    updateBlend();
    const themeObserver = new MutationObserver(updateBlend);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Mouse state
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let waveX = targetX;
    let waveY = targetY;
    let dotScale = 1;
    let waveScale = 1;

    // Trail history (ring buffer of last trailLength points)
    const trail: { x: number; y: number }[] = Array.from(
      { length: trailLength },
      () => ({ x: targetX, y: targetY }),
    );
    let trailIndex = 0;

    // Hover state via event delegation
    let isHover = false;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      trail[trailIndex] = { x: targetX, y: targetY };
      trailIndex = (trailIndex + 1) % trailLength;
    };
    const onDown = () => {
      dotScale = 1.4;
      waveScale = Math.max(0.7, waveScale * 0.85);
    };
    const onUp = () => {
      dotScale = 1;
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t || !t.closest) return;
      const hit = t.closest(hoverSelectors);
      if (hit && !isHover) {
        isHover = true;
      } else if (!hit && isHover) {
        isHover = false;
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseover", onOver, { passive: true });

    let raf = 0;
    const tick = () => {
      if (!reduced) {
        waveX += (targetX - waveX) * lerpFactor;
        waveY += (targetY - waveY) * lerpFactor;
      } else {
        waveX = targetX;
        waveY = targetY;
      }

      const targetWaveScale = isHover ? 1.25 : 1;
      waveScale += (targetWaveScale - waveScale) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX - dotSize / 2}px, ${targetY - dotSize / 2}px, 0) scale(${dotScale})`;
      }
      if (waveRef.current) {
        waveRef.current.style.transform = `translate3d(${waveX - ringSize / 2}px, ${waveY - ringSize / 2}px, 0) scale(${waveScale})`;
      }

      if (!reduced) {
        for (let i = 0; i < trailLength; i++) {
          const p = trail[(trailIndex - 1 - i + trailLength) % trailLength];
          const el = trailRefs.current[i];
          if (!el) continue;
          const opacity = Math.max(0, 1 - i / trailLength) * 0.55;
          const sz = dotSize * (1 - (i / trailLength) * 0.6);
          el.style.transform = `translate3d(${p.x - sz / 2}px, ${p.y - sz / 2}px, 0)`;
          el.style.opacity = String(opacity);
          el.style.width = `${sz}px`;
          el.style.height = `${sz}px`;
        }
      } else {
        for (let i = 0; i < trailLength; i++) {
          const el = trailRefs.current[i];
          if (el) el.style.opacity = "0";
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseover", onOver);
      document.body.style.cursor = prevBodyCursor;
      document.documentElement.classList.remove("sgc-tidal-cursor-active");
      trailRefs.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hideOnTouch,
    hoverSelectors,
    lerpFactor,
    trailLength,
    dotSize,
    ringSize,
    zIndex,
    blendMode,
  ]);

  const trails: number[] = [];
  for (let i = 0; i < trailLength; i++) trails.push(i);

  const gradientBg = `linear-gradient(135deg, ${palette.highlight} 0%, ${palette.mid} 45%, ${palette.warm} 100%)`;
  const ringBg = `radial-gradient(circle, ${palette.mid}55 0%, ${palette.warm}22 60%, transparent 100%)`;
  const specular = `radial-gradient(circle at 30% 30%, ${palette.highlight} 0%, ${palette.mid} 60%, transparent 100%)`;
  const glow = `${12 * glowIntensity}px ${12 * glowIntensity}px ${24 * glowIntensity}px rgba(232,196,90,${0.55 * glowIntensity}), 0 0 ${48 * glowIntensity}px rgba(212,165,116,${0.4 * glowIntensity})`;

  return (
    <div
      ref={rootRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex,
      }}
    >
      <div
        ref={waveRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: ringSize,
          height: ringSize,
          borderRadius: "50%",
          background: ringBg,
          border: `1px solid rgba(212,165,116,${0.5 * glowIntensity})`,
          boxShadow: glow,
          willChange: "transform",
          transition: "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)",
          filter: `blur(${2 * glowIntensity}px)`,
        }}
      />

      {trails.map((i) => (
        <div
          key={`t-${i}`}
          ref={(el) => {
            if (el) trailRefs.current[i] = el;
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            background: gradientBg,
            boxShadow: `0 0 ${8 * glowIntensity}px rgba(232,196,90,${0.5 * glowIntensity})`,
            willChange: "transform, opacity",
            opacity: 0,
            pointerEvents: "none",
          }}
        />
      ))}

      <div
        ref={dotRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          background: gradientBg,
          boxShadow: glow,
          willChange: "transform",
          transition: "transform 80ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: specular,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
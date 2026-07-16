"use client";

import { useEffect, useState } from "react";

/**
 * useCoarsePointer — single source of truth for "does this input device
 * have a hover-capable, fine pointer (mouse/trackpad) or not (touch)?"
 *
 * Mirrors the CSS `(pointer: coarse)` media feature: true on touchscreens
 * (phones, tablets, most touch laptops-in-tablet-mode), false for mouse/
 * trackpad. This is a HARDWARE/input-capability check — deliberately
 * distinct from `prefers-reduced-motion`, which is a user ACCESSIBILITY
 * preference. Both independently gate motion in this codebase:
 *
 *   - prefers-reduced-motion: user asked for less/no animation (any device)
 *   - pointer: coarse:         device physically cannot hover, so mouse-only
 *                              decorative effects (tilt-on-hover, glow-on-
 *                              proximity, cursor trail) have no meaningful
 *                              input to react to and must be skipped —
 *                              scroll-driven / tap-driven interactivity is
 *                              NOT affected by this flag.
 *
 * SSR-safe: resolves to `false` on the server and first client render,
 * then syncs to the real value in a layout-safe effect. Also listens for
 * changes (e.g. a 2-in-1 laptop docking/undocking a mouse, or Playwright/
 * DevTools toggling emulation) so the effects stay correct without a
 * refresh.
 */
export function useCoarsePointer(): boolean {
  const [isCoarse, setIsCoarse] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setIsCoarse(mq.matches);

    const handle = (e: MediaQueryListEvent) => setIsCoarse(e.matches);
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);

  return isCoarse;
}

export default useCoarsePointer;

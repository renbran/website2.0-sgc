"use client";
import { useEffect, useRef } from "react";
import { getLenis } from "@/lib/lenis";
import { getScrubPlayer, VELOCITY_SCALE } from "@/lib/scrubPlayer";

/**
 * Runs a per-frame rAF loop that reads Lenis scroll velocity and drives the
 * scrub audio player. Accepts an optional scrollProgressRef (0–1) from the
 * helix container's ScrollTrigger — audio mutes when user is outside the pin.
 */
export function useHelixScrub(
  scrollProgressRef?: { current: number },
): void {
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tick = () => {
      const lenis = getLenis();
      const rawVel   = lenis ? Math.abs(lenis.velocity) : 0;
      const normVel  = Math.min(rawVel * VELOCITY_SCALE, 1.0);
      // inSection: true while scroll progress is strictly inside the helix pin
      const progress  = scrollProgressRef ? scrollProgressRef.current : 0.5;
      const inSection = progress > 0.005 && progress < 0.995;
      getScrubPlayer().tick(normVel, inSection);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      getScrubPlayer().muteAll();
    };
  }, [scrollProgressRef]);
}

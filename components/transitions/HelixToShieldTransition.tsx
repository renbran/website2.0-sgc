"use client";

import { useEffect } from "react";

/**
 * HelixToShieldTransition — invisible seam marker between the 600vh helix
 * (Act 1) and the 750vh Shield section (Act 2).
 *
 * Kept as a separate component (Path A): exists only to publish a single
 * `sgc:helix-exit` CustomEvent the moment the helix scroll progress
 * crosses 0.95, so the ShieldSection can delay its entrance by one beat
 * and the helix logo's continuous downward motion reads as continuous
 * across the seam.
 *
 * No canvas, no Lenis hooks, no GSAP, no extra DOM. Reduced-motion safe.
 */
export default function HelixToShieldTransition() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let fired = false;

    const onProgress = (e: Event) => {
      if (fired) return;
      const detail = (e as CustomEvent<number>).detail;
      if (typeof detail !== "number") return;
      if (detail >= 0.95) {
        fired = true;
        window.dispatchEvent(new CustomEvent("sgc:helix-exit"));
      }
      if (detail < 0.05) fired = false;
    };

    window.addEventListener("sgc:helix-progress", onProgress as EventListener);
    return () =>
      window.removeEventListener(
        "sgc:helix-progress",
        onProgress as EventListener,
      );
  }, []);

  // Zero-height anchor — keeps the legacy `#helix-to-shield` id for any
  // deep links still in the wild, but renders nothing visual.
  return (
    <div
      id="helix-to-shield"
      aria-hidden
      style={{ height: 0, width: "100%", pointerEvents: "none" }}
    />
  );
}
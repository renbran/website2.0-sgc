import Lenis from "lenis";

let lenis: Lenis | null = null;
let rafId = 0;
let detachScrollSync: (() => void) | null = null;

// iOS Safari only (excludes Chrome / Firefox / Edge on iOS which report
// their own UAs). On iOS Safari, rubber-band overscroll races with the
// ScrollTrigger RAF loop, and without normalizeScroll the touch scroll
// progress stalls near 0.
const IS_IOS_SAFARI =
  typeof navigator !== "undefined" &&
  /iPhone|iPad|iPod/.test(navigator.userAgent) &&
  /WebKit/.test(navigator.userAgent) &&
  !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);

/**
 * Loads GSAP + ScrollTrigger on demand and registers the plugin.
 *
 * This module is imported by the root layout, so a static `import` of gsap
 * put ~110 KB of animation-library evaluation into the initial paint window
 * of *every* page. Components that create ScrollTriggers call this instead,
 * so the cost lands after first paint and only where it is actually used.
 */
export async function loadGsap() {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}

export function initLenis(): Lenis | null {
  if (typeof window === "undefined") return null;
  if (lenis) return lenis;

  lenis = new Lenis({ lerp: 0.08 });

  // Drive Lenis from a plain rAF (previously gsap.ticker). This keeps smooth
  // scrolling working while GSAP loads lazily below.
  const loop = (time: number) => {
    lenis?.raf(time);
    rafId = requestAnimationFrame(loop);
  };
  rafId = requestAnimationFrame(loop);

  // Wire ScrollTrigger once GSAP has loaded. Ordering is safe: every
  // component that creates a ScrollTrigger awaits the same import, so no
  // trigger exists until this has run.
  void (async () => {
    const { ScrollTrigger } = await loadGsap();
    if (!lenis) return; // destroyed before the import resolved
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    detachScrollSync = () => lenis?.off("scroll", onScroll);

    // iOS Safari: route scroll through GSAP's normalized touch handler so
    // rubber-band overscroll doesn't break ScrollTrigger progress. Safe
    // desktop no-op (the function ignores the call when isIOS is false).
    if (IS_IOS_SAFARI) {
      ScrollTrigger.normalizeScroll({ type: "touch" });
    }

    // Refresh once after the page load event fires (fonts + late images
    // resolved). iOS Safari in particular reports wrong viewport heights
    // until the first load event — without this, ScrollTrigger's measured
    // scroll range can be off by hundreds of pixels.
    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
    ScrollTrigger.refresh();
  })();

  return lenis;
}

export function destroyLenis() {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
  detachScrollSync?.();
  detachScrollSync = null;
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}

export function getLenis(): Lenis | null {
  return lenis;
}

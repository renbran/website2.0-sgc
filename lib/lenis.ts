import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let tickerFn: ((time: number) => void) | null = null;

// iOS Safari only (excludes Chrome / Firefox / Edge on iOS which report
// their own UAs). On iOS Safari, rubber-band overscroll races with the
// ScrollTrigger RAF loop, and without normalizeScroll the touch scroll
// progress stalls near 0.
const IS_IOS_SAFARI =
  typeof navigator !== "undefined" &&
  /iPhone|iPad|iPod/.test(navigator.userAgent) &&
  /WebKit/.test(navigator.userAgent) &&
  !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);

export function initLenis(): Lenis | null {
  if (typeof window === "undefined") return null;
  if (lenis) return lenis;

  lenis = new Lenis({ lerp: 0.08 });
  lenis.on("scroll", ScrollTrigger.update);
  tickerFn = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);

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
  if (typeof window !== "undefined") {
    window.addEventListener("load", () => ScrollTrigger.refresh(), {
      once: true,
    });
  }

  return lenis;
}

export function destroyLenis() {
  if (tickerFn) {
    gsap.ticker.remove(tickerFn);
    tickerFn = null;
  }
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}

export function getLenis(): Lenis | null {
  return lenis;
}

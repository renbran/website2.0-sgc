// Single contract for "the brand splash has started clearing". Heavy 3D work
// (the helix canvas and its ~370 KB three.js chunk) waits for this signal so
// it never competes with first paint / hydration for the main thread — the
// splash already covers that window, so nothing is visibly delayed.
//
// LoadingScreen marks + dispatches on a hard load; the flag keeps the signal
// idempotent across client-side remounts (navigating back to "/" later in the
// session must mount the canvas immediately, not wait for a splash that will
// never appear again).

export const SPLASH_DONE_EVENT = "sgc:splash-done";
const FLAG = "__sgcSplashDone";

export function markSplashDone(): void {
  if (typeof window === "undefined") return;
  (window as unknown as Record<string, unknown>)[FLAG] = true;
  window.dispatchEvent(new Event(SPLASH_DONE_EVENT));
}

export function isSplashDone(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean((window as unknown as Record<string, unknown>)[FLAG]);
}

// Safety net: if the event is never observed (e.g. the splash is removed or
// script order changes), mount the canvas anyway rather than leaving the hero
// empty. Slightly after MIN_VISIBLE_MS (900 ms) + fade (600 ms).
export const CANVAS_MOUNT_FALLBACK_MS = 1800;

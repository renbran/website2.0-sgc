"use client";

import { useEffect } from "react";

/**
 * Starts downloading (without executing) a lazily-imported module as soon as the
 * visitor first interacts with the page — scroll, wheel, touch, pointer or key.
 *
 * Why interaction rather than idle-after-load: the below-fold scene chunks are
 * genuinely needed when the visitor scrolls to those acts, but they must not
 * compete with the initial page load. Firing on first interaction means a
 * bounce visit that never scrolls downloads nothing extra, while anyone who
 * does scroll starts the fetch thousands of pixels early, so the canvas mounts
 * without a network wait when they arrive.
 *
 * `loader` must be stable (define it at module scope), otherwise the effect
 * re-runs on every render.
 */
export function usePrefetchOnInteraction(loader: () => Promise<unknown>): void {
  useEffect(() => {
    let done = false;
    const events: (keyof WindowEventMap)[] = [
      "scroll",
      "wheel",
      "touchstart",
      "pointerdown",
      "keydown",
    ];

    const remove = () => {
      for (const ev of events) window.removeEventListener(ev, run);
    };

    function run() {
      if (done) return;
      done = true;
      remove();
      void loader().catch(() => {});
    }

    // passive: the listeners never call preventDefault, so marking them passive
    // keeps them off the scroll-critical path.
    for (const ev of events) window.addEventListener(ev, run, { passive: true });

    return () => {
      done = true;
      remove();
    };
  }, [loader]);
}

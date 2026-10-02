"use client";

import { useEffect } from "react";

/**
 * Downloads (but does not execute) a lazily-imported module during idle time
 * after the first-load window. Paired with proximity-gated mounts: the chunk
 * is already in cache when the user approaches, so the canvas mounts without
 * a network wait — and nothing competes with hydration/LCP.
 *
 * `loader` must be stable (define it at module scope), otherwise the effect
 * re-runs on every render.
 */
export function useIdlePrefetch(loader: () => Promise<unknown>, timeoutMs = 3000): void {
  useEffect(() => {
    let cancelled = false;
    const run = () => {
      if (!cancelled) void loader().catch(() => {});
    };

    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(run, { timeout: timeoutMs });
      return () => {
        cancelled = true;
        w.cancelIdleCallback?.(id);
      };
    }

    const timer = window.setTimeout(run, timeoutMs);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [loader, timeoutMs]);
}

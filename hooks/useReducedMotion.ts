"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe `prefers-reduced-motion` flag.
 *
 * Replaces `useReducedMotion` from the `motion` package so components that only
 * needed that check no longer pull the ~330 KB animation library into their
 * bundle. Returns a plain boolean (the library's version returned boolean|null,
 * so `?? false` call sites keep working unchanged).
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

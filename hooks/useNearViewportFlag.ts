"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * One-way proximity latch for deferring heavy child mounts (WebGL canvases,
 * videos). The element is observed with a generous rootMargin so the child's
 * own warm-up machinery (shader compile, heartbeat) runs during the approach
 * — before the section is actually visible — instead of at page load.
 *
 * Latches on first intersection and disconnects: the child mounts exactly
 * once, and scroll-back never unmounts it. SSR/no-IO environments latch
 * immediately rather than holding the child back.
 */
export function useNearViewportFlag(
  ref: RefObject<Element | null>,
  rootMargin = "1500px",
): boolean {
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return near;
}

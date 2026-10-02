"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * A hairline that draws in (scaleX 0 → 1) when scrolled into view. Implemented
 * with IntersectionObserver + a CSS transition instead of `motion.div`, so this
 * component no longer pulls the animation library into the bundle.
 */
export default function GoldDrawIn() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  if (reduced) {
    return (
      <div
        aria-hidden
        className="mx-auto mb-2 h-px w-full max-w-md bg-gradient-to-r from-transparent via-[rgba(199,162,58,0.12)] to-transparent"
      />
    );
  }
  return (
    <div
      ref={ref}
      aria-hidden
      className="mx-auto mb-2 h-px w-full max-w-md origin-left bg-gradient-to-r from-transparent via-[rgba(199,162,58,0.25)] to-transparent"
      style={{
        transform: shown ? "scaleX(1)" : "scaleX(0)",
        transition: "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    />
  );
}

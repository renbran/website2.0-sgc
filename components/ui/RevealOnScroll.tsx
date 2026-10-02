"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ReactNode } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  focusPull?: boolean;
}

/**
 * Scroll reveal implemented with IntersectionObserver + a CSS transition.
 * Previously a `motion.div` with `whileInView`; converted so this component no
 * longer pulls the animation library into the bundle.
 */
export default function RevealOnScroll({ children, className = "", delay = 0, focusPull = false }: RevealOnScrollProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) {
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
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shouldReduceMotion]);

  // Before reveal: opacity 0, shifted down and slightly scaled (optionally
  // blurred). Matches the previous motion initial state exactly.
  const hidden = !shouldReduceMotion && !shown;
  const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: hidden ? 0 : 1,
        transform: hidden ? "translateY(36px) scale(0.97)" : "none",
        filter: focusPull && hidden ? "blur(8px)" : "none",
        transition: shouldReduceMotion
          ? undefined
          : `opacity 0.7s ${ease} ${delay}s, transform 0.7s ${ease} ${delay}s, filter 0.7s ${ease} ${delay}s`,
        willChange: hidden ? "opacity, transform" : undefined,
      }}
    >
      {children}
    </div>
  );
}

"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { loadGsap } from "@/lib/lenis";

interface ScrollParallaxProps {
  children: React.ReactNode;
  /** Total Y travel in px. Splits evenly: starts at -amplitude/2, ends at +amplitude/2. */
  amplitude?: number;
  className?: string;
}

export default function ScrollParallax({ children, amplitude = 16, className }: ScrollParallaxProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || !ref.current) return;
    const el = ref.current;
    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    // GSAP + ScrollTrigger load on demand — see lib/lenis.ts.
    void (async () => {
      const { gsap } = await loadGsap();
      if (cancelled) return;
      ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { y: -(amplitude / 2) },
          {
            y: amplitude / 2,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("section") ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }, el);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduced, amplitude]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

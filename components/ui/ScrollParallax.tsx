"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    gsap.registerPlugin(ScrollTrigger);
    const el = ref.current;
    const ctx = gsap.context(() => {
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
    return () => ctx.revert();
  }, [reduced, amplitude]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

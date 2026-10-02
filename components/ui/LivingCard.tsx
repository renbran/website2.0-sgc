"use client";
import { useCallback, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useCoarsePointer } from "@/hooks/useCoarsePointer";

interface LivingCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Pointer-tracked 3D tilt + radial gold glow.
 *
 * Previously driven by `motion` springs (`useSpring`/`useMotionTemplate`); now
 * plain DOM writes on pointermove with CSS transitions providing the easing, so
 * the animation library is not pulled into the bundle.
 */
export default function LivingCard({ children, className }: LivingCardProps) {
  const reduced = useReducedMotion();
  // No hover on touch, so the tilt/glow effect has nothing to react to —
  // isCoarse skips it and renders a plain static wrapper instead.
  const isCoarse = useCoarsePointer();
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;

    if (innerRef.current) {
      innerRef.current.style.transform = `rotateX(${-(y - 0.5) * 6}deg) rotateY(${(x - 0.5) * 6}deg)`;
    }
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(199,162,58,0.12) 0%, transparent 65%)`;
      glowRef.current.style.opacity = "1";
    }
  }, []);

  const onPointerLeave = useCallback(() => {
    if (innerRef.current) {
      innerRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
    }
    if (glowRef.current) {
      glowRef.current.style.opacity = "0";
    }
  }, []);

  if (reduced || isCoarse) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={wrapRef}
      className={`relative ${className ?? ""}`}
      style={{ perspective: "800px" }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div
        ref={innerRef}
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d", transition: "transform 0.25s ease-out" }}
      >
        <div
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
          style={{ opacity: 0, transition: "opacity 0.25s ease-out" }}
        />
        {children}
      </div>
    </div>
  );
}

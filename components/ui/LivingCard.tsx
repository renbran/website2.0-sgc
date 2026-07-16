"use client";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useCallback, useRef } from "react";
import { useCoarsePointer } from "@/hooks/useCoarsePointer";

interface LivingCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function LivingCard({ children, className }: LivingCardProps) {
  const reduced = useReducedMotion();
  // No hover on touch, so the tilt/glow effect has nothing to react to —
  // isCoarse skips it and renders a plain static wrapper instead.
  const isCoarse = useCoarsePointer();
  const wrapRef = useRef<HTMLDivElement>(null);

  const rotX = useSpring(0, { stiffness: 150, damping: 20 });
  const rotY = useSpring(0, { stiffness: 150, damping: 20 });
  const glowOpacity = useSpring(0, { stiffness: 200, damping: 25 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glowBg = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(199,162,58,0.12) 0%, transparent 65%)`;

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!wrapRef.current) return;
      const r = wrapRef.current.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      rotY.set((x - 0.5) * 6);
      rotX.set(-(y - 0.5) * 6);
      glowX.set(x * 100);
      glowY.set(y * 100);
      glowOpacity.set(1);
    },
    [rotX, rotY, glowX, glowY, glowOpacity],
  );

  const onPointerLeave = useCallback(() => {
    rotX.set(0);
    rotY.set(0);
    glowOpacity.set(0);
  }, [rotX, rotY, glowOpacity]);

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
      <motion.div
        className="relative h-full w-full"
        style={{ rotateX: rotX, rotateY: rotY }}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
          style={{ background: glowBg, opacity: glowOpacity }}
        />
        {children}
      </motion.div>
    </div>
  );
}

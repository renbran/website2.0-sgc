"use client";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import CtaButton from "@/components/ui/CtaButton";

interface ProximityCtaButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * ProximityCtaButton — a primary CtaButton wrapped in a desktop-only
 * proximity glow (radius 120px, eased). On touch devices and reduced-motion
 * users it falls back to a plain primary CTA, identical in look to a
 * default <CtaButton variant="primary">.
 */
export default function ProximityCtaButton({
  href,
  children,
  className,
  style,
}: ProximityCtaButtonProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const [glow, setGlow] = useState(0);
  const [isCoarse, setIsCoarse] = useState(true);

  useEffect(() => {
    setIsCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current || reduced || isCoarse) return;
      const r = ref.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      setGlow(Math.max(0, 1 - dist / 120));
    },
    [reduced, isCoarse],
  );

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  const proximityStyle: CSSProperties =
    !reduced && !isCoarse && glow > 0
      ? {
          boxShadow: `0 0 ${Math.round(8 + glow * 28)}px rgba(199,162,58,${(0.12 + glow * 0.28).toFixed(2)})`,
        }
      : {};

  return (
    <CtaButton
      ref={ref}
      href={href}
      variant="primary"
      className={className}
      style={{ ...style, ...proximityStyle }}
    >
      {children}
    </CtaButton>
  );
}
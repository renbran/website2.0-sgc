"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface GoldHairlineProps {
  children: ReactNode;
  className?: string;
  /**
   * When provided, controls the hairline externally (e.g. scroll-based).
   * When omitted, hairline appears on hover.
   */
  active?: boolean;
}

/**
 * Wraps children with a 1px gold hairline that draws left-to-right.
 * Two modes:
 *   - Hover mode (default): `active` omitted — hairline triggers on whileHover.
 *   - Controlled mode: `active` supplied — hairline driven by parent state.
 */
export function GoldHairline({ children, className, active }: GoldHairlineProps) {
  const reduced = useReducedMotion();
  const controlled = active !== undefined;

  if (controlled) {
    return (
      <div className={`relative ${className ?? ""}`}>
        {children}
        <motion.div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-px origin-left bg-[var(--accent)]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: active && !reduced ? 1 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      </div>
    );
  }

  return (
    <motion.div
      className={`relative inline-block ${className ?? ""}`}
      initial="idle"
      whileHover={reduced ? "idle" : "hovered"}
    >
      {children}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-px bg-[var(--accent)]"
        style={{ width: "100%", transformOrigin: "left center" }}
        variants={{
          idle: { scaleX: 0, transition: { duration: 0.15 } },
          hovered: { scaleX: 1, transition: { duration: 0.2, ease: "easeOut" } },
        }}
      />
    </motion.div>
  );
}

export default GoldHairline;

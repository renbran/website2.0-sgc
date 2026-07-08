"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** Applied to the inner card surface (the padded, overflow-hidden box). */
  contentClassName?: string;
  featured?: boolean;
  /**
   * Optional click target — when set, renders a button surface with the
   * appropriate focus ring + hover state. Keep href/internal links via the
   * children body, not via this prop.
   */
  as?: "div" | "article" | "section";
}

/**
 * GlassCard — premium featured-card surface used by:
 *   - TierCard (pricing popular tier)
 *   - ContactSection (featured Option B)
 *   - PricingSection retainer (Silver featured tier)
 *
 * Visual: dark-translucent surface, thin gold top-edge highlight, soft inner
 * border, hover-lift with subtle gold glow. Honors reduced-motion.
 */
export default function GlassCard({
  children,
  className,
  contentClassName,
  featured = false,
  as = "article",
}: GlassCardProps) {
  const reduced = useReducedMotion();
  const Wrap = as;

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -3 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`relative ${className ?? ""}`}
    >
      {/* Top-edge gold hairline — premium "edge-lit" feel */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-3 top-0 h-px ${
          featured ? "" : "opacity-60"
        }`}
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(244,241,234,0.55) 50%, transparent 100%)",
        }}
      />
      <Wrap
        className={`relative h-full overflow-hidden rounded-2xl border backdrop-blur-md transition-shadow duration-300 ${
          featured
            ? "border-[rgba(244,241,234,0.18)] bg-[rgba(26,34,48,0.7)] shadow-[0_0_30px_rgba(199,162,58,0.18)] hover:shadow-[0_8px_36px_rgba(199,162,58,0.28)]"
            : "border-[var(--border)] bg-[var(--surface)]"
        } ${contentClassName ?? ""}`}
      >
        {children}
      </Wrap>
    </motion.div>
  );
}

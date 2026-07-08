"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * FoundationBadges — three monochrome SVG medallions for the AwardsCarousel.
 *
 * Echoes the laurel-wreath reference badge but rendered in white/dark/contrast
 * to harmonize with the site's charcoal-and-ivory palette rather than the
 * site's gold accents. Tokens used:
 *   - ivory:   #F4F1E8 (warm off-white, matches text-primary)
 *   - ink:     #1A2230 (deep slate, matches surface-high)
 *   - ash:     #A7AAB0 (mid neutral, matches text-secondary)
 *   - jet:     #080B11 (deepest, matches bg)
 *
 * Each medallion is 96×96 by default and uses currentColor for ivory rings
 * so callers can tint via CSS. All three honor prefers-reduced-motion.
 */

interface BadgeProps {
  size?: number;
  className?: string;
  label?: string;
}

const baseRing = "stroke-[rgba(244,241,234,0.55)]";
const innerRing = "stroke-[rgba(244,241,234,0.25)]";

/** Platinum seal — full circular border + laurels. Most prominent tier. */
export function PlatinumSeal({ size = 96, className, label }: BadgeProps) {
  const reduced = useReducedMotion();
  return (
    <motion.svg
      role="img"
      aria-label={label ?? "Platinum seal medallion"}
      width={size}
      height={size}
      viewBox="0 0 96 96"
      className={className}
      animate={reduced ? undefined : { rotate: [0, 6, -6, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      style={{ originX: "50%", originY: "50%" }}
    >
      <circle cx="48" cy="48" r="44" fill="#1A2230" className={baseRing} strokeWidth="1.5" />
      <circle cx="48" cy="48" r="38" fill="none" className={innerRing} strokeWidth="0.75" />
      {/* Laurels — left + right branches */}
      <g className={baseRing} strokeWidth="1.25" fill="none" strokeLinecap="round">
        <path d="M16 56 Q12 48 16 40" />
        <path d="M16 48 Q20 40 26 38" />
        <path d="M16 44 Q22 38 28 38" />
        <path d="M80 56 Q84 48 80 40" />
        <path d="M80 48 Q76 40 70 38" />
        <path d="M80 44 Q74 38 68 38" />
      </g>
      {/* Center star (engraved) */}
      <path
        d="M48 30 L52 42 L64 42 L54 50 L57 62 L48 55 L39 62 L42 50 L32 42 L44 42 Z"
        fill="rgba(244,241,234,0.92)"
      />
    </motion.svg>
  );
}

/** Shield badge — banner ribbon wrap. Mid tier. */
export function ShieldBadge({ size = 96, className, label }: BadgeProps) {
  const reduced = useReducedMotion();
  return (
    <motion.svg
      role="img"
      aria-label={label ?? "Shield ribbon medallion"}
      width={size}
      height={size}
      viewBox="0 0 96 96"
      className={className}
      animate={reduced ? undefined : { rotate: [0, -4, 4, 0] }}
      transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      style={{ originX: "50%", originY: "50%" }}
    >
      {/* Banner — left tail */}
      <path
        d="M8 36 L18 36 L18 60 L8 56 Z"
        fill="#1A2230"
        className={baseRing}
        strokeWidth="1"
      />
      {/* Banner — right tail */}
      <path
        d="M88 36 L78 36 L78 60 L88 56 Z"
        fill="#1A2230"
        className={baseRing}
        strokeWidth="1"
      />
      {/* Central shield silhouette */}
      <path
        d="M48 16 L72 24 L72 50 Q72 66 48 80 Q24 66 24 50 L24 24 Z"
        fill="#1A2230"
        className={baseRing}
        strokeWidth="1.5"
      />
      {/* Inner shield */}
      <path
        d="M48 24 L66 30 L66 50 Q66 62 48 72 Q30 62 30 50 L30 30 Z"
        fill="none"
        className={innerRing}
        strokeWidth="0.75"
      />
      {/* Engraved checkmark */}
      <path
        d="M40 48 L46 54 L58 40"
        stroke="rgba(244,241,234,0.92)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

/** Corner-crest badge — single-line ribbon. Compact tier. */
export function CornerCrest({ size = 96, className, label }: BadgeProps) {
  const reduced = useReducedMotion();
  return (
    <motion.svg
      role="img"
      aria-label={label ?? "Corner-crest medallion"}
      width={size}
      height={size}
      viewBox="0 0 96 96"
      className={className}
      animate={reduced ? undefined : { rotate: [0, 3, -3, 0] }}
      transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      style={{ originX: "50%", originY: "50%" }}
    >
      {/* Hex outline */}
      <path
        d="M48 10 L80 28 L80 60 L48 78 L16 60 L16 28 Z"
        fill="#1A2230"
        className={baseRing}
        strokeWidth="1.25"
      />
      <path
        d="M48 18 L72 32 L72 56 L48 70 L24 56 L24 32 Z"
        fill="none"
        className={innerRing}
        strokeWidth="0.75"
      />
      {/* Engraved lozenge */}
      <path
        d="M48 32 L60 44 L48 56 L36 44 Z"
        fill="rgba(244,241,234,0.88)"
      />
      <circle cx="48" cy="44" r="3" fill="#080B11" />
    </motion.svg>
  );
}

"use client";

import type { ReactNode } from "react";
import AnimatedIcon from "./AnimatedIcon";

type Size = "sm" | "md" | "lg";

interface SectionIconProps {
  /** Lucide (or any stroke-based) icon node to render inside. */
  children: ReactNode;
  /** Visual size of the icon. md = ~22px (default), sm = 16, lg = 30. */
  size?: Size;
  /** Optional label below the icon. */
  label?: string;
  /** Hook for parent re-triggering the draw animation (e.g. on hover/active). */
  deps?: React.DependencyList;
  className?: string;
}

const SIZE_PX: Record<Size, number> = { sm: 16, md: 22, lg: 30 };
const STROKE: Record<Size, number> = { sm: 1.5, md: 1.6, lg: 1.75 };

/**
 * Premium animated icon for strategic sections (Contact, Pricing, Awards,
 * Shield callouts, etc.). Combines the existing <AnimatedIcon> draw-on
 * with a hover lift/glow micro-animation, plus an optional label.
 *
 * Color is inherited from the parent section's accent (typically
 * --accent gold). Intentionally NOT a button — no border, no background
 * plate — just a refined icon mark.
 */
export default function SectionIcon({
  children,
  size = "md",
  label,
  deps,
  className = "",
}: SectionIconProps) {
  const px = SIZE_PX[size];
  return (
    <div className={`section-icon ${className}`} data-size={size}>
      <AnimatedIcon deps={deps ?? [size]}>
        <span
          className="inline-flex items-center justify-center"
          style={{ width: px, height: px, color: "var(--accent)" }}
        >
          {children}
        </span>
      </AnimatedIcon>
      {label && (
        <span className="section-icon-label text-[0.7rem] uppercase tracking-[0.18em] text-[var(--sgc-text-muted)]">
          {label}
        </span>
      )}
      <style>{`
        [data-size="sm"] svg { width: ${SIZE_PX.sm}px; height: ${SIZE_PX.sm}px; stroke-width: ${STROKE.sm}; }
        [data-size="md"] svg { width: ${SIZE_PX.md}px; height: ${SIZE_PX.md}px; stroke-width: ${STROKE.md}; }
        [data-size="lg"] svg { width: ${SIZE_PX.lg}px; height: ${SIZE_PX.lg}px; stroke-width: ${STROKE.lg}; }
      `}</style>
    </div>
  );
}

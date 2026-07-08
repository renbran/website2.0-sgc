"use client";

import type { ReactNode } from "react";
import { useLucideDrawerAnimation } from "@/hooks/useLucideDrawerAnimation";

type Props = {
  children: ReactNode;
  /** Extra classes for the wrapper span (e.g. color overrides). */
  className?: string;
  /**
   * React dependency array forwarded to the drawer hook.
   * Pass a changing value to re-trigger the draw animation
   * (e.g. `[isPlaying]` for a toggle icon).
   */
  deps?: React.DependencyList;
};

/**
 * Wraps any Lucide (or other stroke-based SVG) icon and applies an
 * infinite draw-on / draw-off animation via animejs.
 *
 * Colors are inherited from the child icon's own classes — this wrapper
 * only provides the animation container and does NOT add any color.
 */
export default function AnimatedIcon({
  children,
  className = "",
  deps,
}: Props) {
  const ref = useLucideDrawerAnimation(deps ?? []);

  return (
    <span
      ref={ref}
      className={`inline-flex items-center justify-center ${className}`}
    >
      {children}
    </span>
  );
}

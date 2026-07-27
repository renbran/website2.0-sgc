"use client";

/**
 * FlippingCard — brand re-skin of a 3D flip card.
 *
 *   - Hover flips on pointer devices (primary trigger).
 *   - Click / tap flips for touch users who never hover.
 *   - `role="button"` + `aria-pressed` + keyboard `Enter`/`Space`
 *     so screen readers and keyboard users can flip it on demand.
 *   - `prefers-reduced-motion` snaps the rotation (no 700ms tween).
 *
 * Self-contained: inline cn() helper, no shadcn dep added.
 */

import * as React from "react";

type CnArg = string | number | null | undefined | false;
function cn(...args: CnArg[]): string {
  return args
    .filter((a) => a !== false && a !== null && a !== undefined)
    .map((a) =>
      typeof a === "string" || typeof a === "number" ? String(a) : "",
    )
    .join(" ");
}

// Aligned to the site's vault-ink + gold token system (styles/hero.css).
const PALETTE = {
  ink: "#080B11", // --vault-ink / --bg
  inkRaised: "#1A2230", // --slate-steel / --surface-high
  warmWhite: "#F4F1E8", // --text-primary
  warmWhiteSoft: "rgba(244,241,232,0.78)",
  warmWhiteMuted: "rgba(244,241,232,0.55)",
  gold: "#C7A23A", // --refined-gold / --accent
  goldBright: "#EFDBA0", // --champagne
  goldDeep: "#C7A23A", // --refined-gold
  goldShadow: "#8A6A1E", // --antique-bronze
};

interface FlippingCardProps {
  className?: string;
  height?: number;
  width?: number;
  /** Front content. Always rendered. */
  frontContent?: React.ReactNode;
  /** Back content. Always rendered. */
  backContent?: React.ReactNode;
  /** Accessible label for the flip control. */
  flipLabel?: string;
}

export function FlippingCard({
  className,
  frontContent,
  backContent,
  height = 320,
  width = 350,
  flipLabel = "Flip card",
}: FlippingCardProps) {
  const [flipped, setFlipped] = React.useState(false);
  const reducedRef = React.useRef(false);

  React.useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const flip = React.useCallback(() => setFlipped((v) => !v), []);
  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        flip();
      }
    },
    [flip],
  );

  const cssVars = {
    "--height": `${height}px`,
    "--width": `${width}px`,
  } as React.CSSProperties;

  return (
    <div className="group/flipping-card [perspective:1200px]" style={cssVars}>
      <div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={flipLabel}
        onClick={flip}
        onKeyDown={onKeyDown}
        className={cn(
          "relative rounded-xl cursor-pointer outline-none overflow-hidden",
          "h-[var(--height)] w-[min(100%,var(--width))]",
          "[transform-style:preserve-3d]",
          "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "group-hover/flipping-card:[transform:rotateY(180deg)]",
          flipped && "[transform:rotateY(180deg)]",
          "focus-visible:[box-shadow:0_0_0_2px_rgba(199,162,58,0.7)]",
          "motion-reduce:transition-none",
          className,
        )}
        style={{
          ...cssVars,
          background: PALETTE.ink,
          color: PALETTE.warmWhite,
          border: `1px solid rgba(199,162,58,0.45)`,
          boxShadow:
            "0 8px 30px rgba(0,0,0,0.45), 0 0 0 1px rgba(199,162,58,0.18)",
        }}
      >
        {/* Front face — warm white on ink */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full rounded-[inherit] overflow-hidden",
            "[transform-style:preserve-3d] [backface-visibility:hidden] [transform:rotateY(0deg)]",
            "flex flex-col",
          )}
          style={{
            background: PALETTE.ink,
            color: PALETTE.warmWhite,
            padding: "1.25rem 1.4rem 1.3rem",
          }}
        >
          <div className="[transform:translateZ(40px)] flex h-full w-full flex-col overflow-hidden">
            {frontContent}
            <div
              aria-hidden
              className="mt-auto pt-3 text-[0.62rem] font-bold uppercase tracking-[0.22em]"
              style={{
                color: PALETTE.warmWhiteMuted,
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              }}
            >
              Hover · tap · Enter
            </div>
          </div>
        </div>

        {/* Back face — gold hairline + gold-top hairline so it reads
            as the "rich" face once revealed. */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full rounded-[inherit] overflow-hidden",
            "[transform-style:preserve-3d] [backface-visibility:hidden] [transform:rotateY(180deg)]",
            "flex flex-col",
          )}
          style={{
            background: PALETTE.inkRaised,
            color: PALETTE.warmWhite,
            padding: "1.25rem 1.4rem 1.3rem",
            borderTop: "1px solid rgba(199,162,58,0.55)",
            boxShadow: "inset 0 0 0 1px rgba(199,162,58,0.12)",
          }}
        >
          {/* Gold gradient hairline at top of back face */}
          <div
            aria-hidden
            className="absolute inset-x-6 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(199,162,58,0.85) 50%, transparent 100%)",
            }}
          />
          <div className="[transform:translateZ(40px)] flex h-full w-full flex-col overflow-y-auto">
            {backContent}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlippingCard;

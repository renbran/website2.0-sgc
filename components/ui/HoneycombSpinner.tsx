"use client";

/**
 * HoneycombSpinner — premium hex-cell spinner loader for the brand splash.
 *
 *   - 12 hex tiles arranged in a ring around a central monogram slot.
 *   - Two animated layers:
 *       (1) the ring rotates 360° per cycle (whole assembly);
 *       (2) each cell fills with a gold gradient in staggered sequence
 *           (chase pattern, ~1.7s sweep), so the loader reads as
 *           institutional/architectural, not a generic spinner.
 *   - A static gold-filled hex at the centre anchors the ring.
 *   - Honors `prefers-reduced-motion`: ring static, cells static.
 *
 * Reusable: monogram is a slot. Drop in anywhere a loading state needs
 * to read as "premium, in motion" (see /diagnostic, contact form
 * submission, scan-in transitions).
 */

import * as React from "react";

interface HoneycombSpinnerProps {
  /** Pixel size of the spinner. Defaults to 144. */
  size?: number;
  /** CSS class on the wrapper. */
  className?: string;
}

// Rounds trig output to a fixed precision so tiny last-digit floating-point
// differences between the server's JS engine and the browser's can't leak
// into rendered SVG attributes and cause a hydration mismatch.
const round = (n: number) => Math.round(n * 1000) / 1000;

const STAGGER_MS = 90;
const RING_ROTATION_MS = 3200;
const SWEEP_PAUSE_MS = 600;
const TOTAL_SWEEP_MS = 12 * STAGGER_MS + SWEEP_PAUSE_MS; // ~1.7s per cycle

export function HoneycombSpinner({
  size = 144,
  className,
}: HoneycombSpinnerProps) {
  const reducedRef = React.useRef(false);

  React.useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const cells = React.useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return { angle, index: i };
      }),
    [],
  );

  return (
    <div
      role="status"
      aria-label="Loading"
      className={className}
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "inline-block",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: "block",
          animation: reducedRef.current
            ? undefined
            : `sgc-spinner-ring ${RING_ROTATION_MS}ms linear infinite`,
          transformOrigin: "50% 50%",
        }}
      >
        {/* Faint gold hairline ring */}
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="rgba(212,165,116,0.18)"
          strokeWidth="0.4"
        />

        {/* Outer bezel ticks (counter-rotating) */}
        <g
          style={{
            transformOrigin: "50% 50%",
            animation: reducedRef.current
              ? undefined
              : `sgc-spinner-tick ${RING_ROTATION_MS}ms linear infinite reverse`,
          }}
        >
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * Math.PI * 2;
            const r1 = 46;
            const r2 = 48;
            const x1 = round(50 + Math.cos(a) * r1);
            const y1 = round(50 + Math.sin(a) * r1);
            const x2 = round(50 + Math.cos(a) * r2);
            const y2 = round(50 + Math.sin(a) * r2);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(212,165,116,0.4)"
                strokeWidth="0.25"
              />
            );
          })}
        </g>

        {/* 12 hex cells around the perimeter */}
        {cells.map(({ angle, index }) => {
          const cx = round(50 + Math.cos(angle) * 36);
          const cy = round(50 + Math.sin(angle) * 36);
          const r = 7;
          const hexPath = (() => {
            let p = "";
            for (let i = 0; i < 6; i++) {
              const a2 = (i * Math.PI) / 3 + Math.PI / 6;
              const x = round(cx + Math.cos(a2) * r);
              const y = round(cy + Math.sin(a2) * r);
              p += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
            }
            return p + " Z";
          })();

          const fillDelay = (index * STAGGER_MS) % TOTAL_SWEEP_MS;
          return (
            <path
              key={index}
              d={hexPath}
              fill="rgba(184,146,77,0.05)"
              stroke="rgba(212,165,116,0.85)"
              strokeWidth="0.5"
              style={{
                transformOrigin: `${cx}px ${cy}px`,
                animation: reducedRef.current
                  ? undefined
                  : `sgc-spinner-cell ${TOTAL_SWEEP_MS}ms ease-in-out ${fillDelay}ms infinite`,
              }}
            />
          );
        })}

        {/* Centre marker — static anchor */}
        <path
          d="M 50 44 L 55 47 L 55 53 L 50 56 L 45 53 L 45 47 Z"
          fill="rgba(232,196,90,1)"
          stroke="rgba(212,165,116,1)"
          strokeWidth="0.4"
        />
      </svg>

      <style>{`
        @keyframes sgc-spinner-ring {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes sgc-spinner-tick {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes sgc-spinner-cell {
          0%, 35%   { fill: rgba(184,146,77,0.05); }
          50%       { fill: rgba(232,196,90,0.95); }
          65%, 100% { fill: rgba(184,146,77,0.05); }
        }
      `}</style>
    </div>
  );
}

export default HoneycombSpinner;
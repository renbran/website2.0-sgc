"use client";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Infinite gold sheen sweep, formerly a `motion.div` animating x. Now a pure
 * CSS keyframe animation (7 s travel + 3 s hold, matching the old
 * duration/repeatDelay), so the animation library stays out of the bundle.
 */
export default function SheenLayer() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      <div
        className="absolute inset-y-0 left-0 w-1/3 sgc-sheen"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(199,162,58,0.06) 50%, transparent 100%)",
        }}
      />
      <style>{`
        @keyframes sgc-sheen {
          0%   { transform: translateX(-50%) skewX(-12deg); }
          70%  { transform: translateX(400%) skewX(-12deg); }
          100% { transform: translateX(400%) skewX(-12deg); }
        }
        .sgc-sheen { animation: sgc-sheen 10s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .sgc-sheen { animation: none; } }
      `}</style>
    </div>
  );
}

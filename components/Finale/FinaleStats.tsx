"use client";

import StatCounter from "@/components/ui/StatCounter";
import { METRICS } from "@/content/canonical-facts";

interface FinaleStatsProps {
  reducedMotion: boolean;
}

// Outcome stat strip for Phase D. Every figure is read from canonical-facts,
// which traces to the signed client case study — the finale summarizes the
// case study, it never invents a figure of its own.
const roiValue = Number(METRICS.year1Roi.value.replace(/[^0-9.]/g, "")) || 0;
const STATS = [
  { counter: { value: roiValue, suffix: "%" }, label: METRICS.year1Roi.label },
  { display: METRICS.paybackMonths.value, label: METRICS.paybackMonths.label },
  { display: METRICS.hoursReleasedPerWeek.value, label: METRICS.hoursReleasedPerWeek.label },
] as const;

export default function FinaleStats({ reducedMotion }: FinaleStatsProps) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "clamp(2rem, 6vh, 4rem)",
        left: "50%",
        zIndex: 4,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "clamp(1.25rem, 3.5vw, 4rem)",
        width: "min(92vw, 60rem)",
        pointerEvents: "none",
        transform: "translateX(-50%)",
        // Was a `motion.div` entrance; now a one-shot CSS animation. `both`
        // holds the end state, so the -50% centring is preserved after it runs.
        animation: reducedMotion
          ? undefined
          : "sgc-finale-stats 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both",
      }}
    >
      <style>{`
        @keyframes sgc-finale-stats {
          from { opacity: 0; transform: translate(-50%, 18px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
      {STATS.map((stat) => (
        <div key={stat.label} style={{ textAlign: "center" }}>
          <p
            style={{
              fontFamily: "var(--font-fraunces, serif)",
              fontSize: "clamp(1.4rem, 2.6vw, 2.1rem)",
              fontWeight: 600,
              color: "#D4A574",
              lineHeight: 1.1,
              marginBottom: "0.35rem",
            }}
          >
            {"counter" in stat ? (
              <StatCounter value={stat.counter.value} suffix={stat.counter.suffix} />
            ) : (
              stat.display
            )}
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "0.62rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#7A7F88",
            }}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

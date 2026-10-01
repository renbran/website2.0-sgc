"use client";

import { motion } from "motion/react";
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
    <motion.div
      initial={reducedMotion ? { opacity: 1, x: "-50%" } : { opacity: 0, y: 18, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
      }}
    >
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
    </motion.div>
  );
}

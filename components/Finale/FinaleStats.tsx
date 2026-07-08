"use client";

import { motion } from "motion/react";
import StatCounter from "@/components/ui/StatCounter";

interface FinaleStatsProps {
  reducedMotion: boolean;
}

// Outcome stat strip for Phase D. Numbers mirror CaseStudySection —
// the finale summarizes, it does not invent new claims.
const STATS = [
  { counter: { value: 60, suffix: "%" }, label: "Faster monthly close" },
  { display: "4–6 mo", label: "Typical payback, Year 1" },
  { counter: { value: 10, suffix: " hrs/wk" }, label: "Returned to the founder" },
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
              color: "var(--text-muted)",
            }}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </motion.div>
  );
}

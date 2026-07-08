"use client";
import { motion, useReducedMotion } from "motion/react";

export default function SheenLayer() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      <motion.div
        className="absolute inset-y-0 left-0 w-1/3 -skew-x-12"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(199,162,58,0.06) 50%, transparent 100%)",
        }}
        animate={{ x: ["-50%", "400%"] }}
        transition={{ duration: 7, ease: "linear", repeat: Infinity, repeatDelay: 3 }}
      />
    </div>
  );
}

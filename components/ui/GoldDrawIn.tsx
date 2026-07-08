"use client";
import { motion, useReducedMotion } from "motion/react";

export default function GoldDrawIn() {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <div
        aria-hidden
        className="mx-auto mb-2 h-px w-full max-w-md bg-gradient-to-r from-transparent via-[rgba(199,162,58,0.12)] to-transparent"
      />
    );
  }
  return (
    <motion.div
      aria-hidden
      className="mx-auto mb-2 h-px w-full max-w-md origin-left bg-gradient-to-r from-transparent via-[rgba(199,162,58,0.25)] to-transparent"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

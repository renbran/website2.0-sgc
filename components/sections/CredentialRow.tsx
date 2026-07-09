"use client";
import { motion, useReducedMotion } from "motion/react";

const BADGES = ["CPA", "CIA", "CRMA", "CIPFA", "ACCA", "M.Econ"];

export default function CredentialRow() {
  const reduced = useReducedMotion();

  return (
    <div
      aria-label="Founder credentials"
      className="mt-20 border-y border-[var(--accent-soft-2)] bg-[var(--accent-faint)] px-6 py-5"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 sm:flex-row sm:justify-between sm:flex-wrap">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {BADGES.map((badge, i) => (
            <motion.span
              key={badge}
              initial={reduced ? {} : { opacity: 0, scale: 0.8, y: 8 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-sm border border-[var(--accent-strong)] px-2.5 py-0.5 font-mono text-[0.7rem] font-medium text-[var(--accent-bright)]"
            >
              {badge}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={reduced ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-center text-[0.75rem] text-[var(--text-secondary)] sm:text-right"
        >
          Practitioner-led · Dubai, UAE · IFZA-Licensed
        </motion.p>
      </div>
    </div>
  );
}

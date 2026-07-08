"use client";

import { Sun, Moon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTheme } from "@/components/ThemeProvider";

/**
 * Premium branded theme switch — a sliding gold thumb on a navy/cream track,
 * with a spring-physics glide (matches the site's "living" hover language
 * elsewhere: LivingCard tilt, GoldHairline draw-in) and an icon crossfade +
 * rotate morph inside the thumb. A brief gold glow pulses outward on toggle,
 * echoing the signature gold-hairline interaction from CLAUDE.md.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const reduced = useReducedMotion();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={!isDark}
      className={`group relative inline-flex h-8 w-[52px] shrink-0 items-center rounded-full border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] ${
        isDark
          ? "border-[rgba(199,162,58,0.3)] bg-[var(--sgc-black)]"
          : "border-[rgba(138,106,30,0.3)] bg-[var(--surface-high)]"
      } ${className}`}
    >
      {/* Ambient gold glow — brightens on hover/press, echoes GoldHairline */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        initial={false}
        animate={{ boxShadow: "0 0 0 0 rgba(199,162,58,0)" }}
        whileHover={reduced ? undefined : { boxShadow: "0 0 14px 1px rgba(199,162,58,0.35)" }}
        whileTap={reduced ? undefined : { boxShadow: "0 0 20px 3px rgba(199,162,58,0.45)" }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />

      {/* Sliding thumb */}
      <motion.span
        className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gold-gradient shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
        initial={false}
        animate={{ x: isDark ? 3 : 23 }}
        transition={
          reduced
            ? { duration: 0 }
            : { type: "spring", stiffness: 420, damping: 32 }
        }
        whileTap={reduced ? undefined : { scale: 0.92 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="moon"
              initial={reduced ? {} : { rotate: -90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={reduced ? {} : { rotate: 90, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center"
            >
              <Moon size={13} aria-hidden className="text-[var(--sgc-black)]" />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={reduced ? {} : { rotate: 90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={reduced ? {} : { rotate: -90, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center"
            >
              <Sun size={13} aria-hidden className="text-[#10161F]" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </button>
  );
}

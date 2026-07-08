"use client";

import { useEffect, useId, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

/**
 * PremiumToggle — A high-end animated toggle switch with:
 * - Spring-physics thumb slide with overshoot
 * - Gradient track transition (navy ↔ gold)
 * - Icon morphing with rotation + scale crossfade
 * - Gold glow pulse on toggle
 * - Ripple ring effect on interaction
 * - Particle burst on state change
 *
 * Follows SGC design system: gold accent, navy/cream states, living hover language.
 */

interface PremiumToggleProps {
  /** Current state */
  checked: boolean;
  /** State change handler */
  onToggle: (checked: boolean) => void;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Optional label for accessibility */
  label?: string;
  /** Show particles on toggle */
  showParticles?: boolean;
  /** Show ripple effect */
  showRipple?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Custom unchecked icon */
  uncheckedIcon?: React.ReactNode;
  /** Custom checked icon */
  checkedIcon?: React.ReactNode;
  /** Additional className */
  className?: string;
}

const sizeConfig = {
  sm: { width: 40, height: 22, thumb: 16, icon: 10 },
  md: { width: 52, height: 28, thumb: 22, icon: 13 },
  lg: { width: 64, height: 34, thumb: 28, icon: 16 },
};

export default function PremiumToggle({
  checked,
  onToggle,
  size = "md",
  label,
  showParticles = true,
  showRipple = true,
  disabled = false,
  uncheckedIcon,
  checkedIcon,
  className = "",
}: PremiumToggleProps) {
  const id = useId();
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const config = sizeConfig[size];
  const thumbTravel = config.width - config.thumb - 4;

  const handleClick = () => {
    if (!disabled) {
      onToggle(!checked);
    }
  };

  return (
    <motion.button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={handleClick}
      disabled={disabled}
      className={`group relative inline-flex items-center rounded-full border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${className}`}
      style={{
        width: config.width,
        height: config.height,
        borderColor: checked
          ? "rgba(199,162,58,0.4)"
          : "rgba(138,106,30,0.25)",
        backgroundColor: checked ? "rgba(199,162,58,0.15)" : "rgba(14,18,27,0.6)",
      }}
      whileHover={
        reduced || disabled
          ? undefined
          : {
              scale: 1.02,
              boxShadow: "0 0 16px 2px rgba(199,162,58,0.3)",
            }
      }
      whileTap={
        reduced || disabled
          ? undefined
          : { scale: 0.97 }
      }
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Animated track background */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        animate={{
          background: checked
            ? "linear-gradient(135deg, rgba(199,162,58,0.25) 0%, rgba(199,162,58,0.08) 100%)"
            : "linear-gradient(135deg, rgba(14,18,27,0.8) 0%, rgba(14,18,27,0.4) 100%)",
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Gold glow pulse on check */}
      <AnimatePresence>
        {checked && !reduced && (
          <motion.span
            key="glow"
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            initial={{ boxShadow: "0 0 0 0 rgba(199,162,58,0)" }}
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(199,162,58,0.4)",
                "0 0 20px 4px rgba(199,162,58,0.25)",
                "0 0 12px 2px rgba(199,162,58,0.15)",
              ],
            }}
            exit={{ boxShadow: "0 0 0 0 rgba(199,162,58,0)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Ripple ring on click */}
      {showRipple && (
        <AnimatePresence>
          {!reduced && (
            <motion.span
              key={`ripple-${checked ? "on" : "off"}`}
              aria-hidden
              className="pointer-events-none absolute rounded-full border-2 border-[var(--accent)]"
              style={{
                left: checked ? thumbTravel + 2 : 2,
                top: "50%",
                width: config.thumb,
                height: config.thumb,
                translateY: "-50%",
              }}
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
      )}

      {/* Particle burst — only renders client-side to prevent SSR hydration mismatch */}
      {mounted && showParticles && !reduced && (
        <ParticleBurst
          key={`particles-${checked ? "on" : "off"}`}
          active={true}
          config={config}
          thumbTravel={thumbTravel}
          checked={checked}
        />
      )}

      {/* Sliding thumb with icon */}
      <motion.span
        className="relative z-10 flex items-center justify-center rounded-full shadow-lg"
        style={{
          width: config.thumb,
          height: config.thumb,
          margin: 2,
        }}
        initial={false}
        animate={{
          x: checked ? thumbTravel : 0,
          backgroundColor: checked
            ? "linear-gradient(135deg, #C7A23A 0%, #9B7B2C 100%)"
            : "linear-gradient(135deg, #1A1F2E 0%, #0E121B 100%)",
          boxShadow: checked
            ? "0 2px 8px rgba(199,162,58,0.4), 0 0 0 1px rgba(199,162,58,0.3)"
            : "0 2px 6px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
        transition={
          reduced
            ? { duration: 0 }
            : {
                type: "spring",
                stiffness: 500,
                damping: 30,
                mass: 0.8,
              }
        }
        whileHover={
          reduced || disabled
            ? undefined
            : { scale: 1.08 }
        }
        whileTap={
          reduced || disabled
            ? undefined
            : { scale: 0.92 }
        }
      >
        {/* Icon morphing */}
        <AnimatePresence mode="wait" initial={false}>
          {checked ? (
            <motion.span
              key="checked"
              initial={reduced ? {} : { rotate: -90, opacity: 0, scale: 0.4 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={reduced ? {} : { rotate: 90, opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center"
            >
              {checkedIcon || (
                <svg
                  width={config.icon}
                  height={config.icon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[var(--sgc-black)]"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </motion.span>
          ) : (
            <motion.span
              key="unchecked"
              initial={reduced ? {} : { rotate: 90, opacity: 0, scale: 0.4 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={reduced ? {} : { rotate: -90, opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center"
            >
              {uncheckedIcon || (
                <svg
                  width={config.icon}
                  height={config.icon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[rgba(255,255,255,0.4)]"
                >
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </motion.button>
  );
}

/**
 * ParticleBurst — Small gold particles that scatter on toggle
 */
function ParticleBurst({
  active,
  config,
  thumbTravel,
  checked,
}: {
  active: boolean;
  config: { thumb: number };
  thumbTravel: number;
  checked: boolean;
}) {
  if (!active) return null;

  const particleCount = 6;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    angle: (i * 360) / particleCount + Math.random() * 30,
    distance: 12 + Math.random() * 8,
    size: 2 + Math.random() * 2,
    delay: Math.random() * 0.1,
  }));

  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-[var(--accent)]"
          style={{
            width: p.size,
            height: p.size,
            left: checked ? thumbTravel + config.thumb / 2 : config.thumb / 2 + 2,
            top: "50%",
            translateY: "-50%",
          }}
          initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [1, 0.8, 0],
            x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
            y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
          }}
          transition={{
            duration: 0.5,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </span>
  );
}

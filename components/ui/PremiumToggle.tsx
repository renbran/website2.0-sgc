"use client";

import { useEffect, useId, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * PremiumToggle — A high-end animated toggle switch with:
 * - Thumb slide with overshoot
 * - Gradient track transition (navy ↔ gold)
 * - Icon morphing with rotation + scale crossfade
 * - Gold glow pulse on toggle
 * - Ripple ring effect on interaction
 * - Particle burst on state change
 *
 * All motion is CSS (transition + keyframes) rather than the `motion` library,
 * so this control no longer pulls the animation library into the bundle.
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

  const interactive = !reduced && !disabled;

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={handleClick}
      disabled={disabled}
      className={`group relative inline-flex items-center rounded-full border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] ${
        interactive
          ? "hover:scale-[1.02] hover:shadow-[0_0_16px_2px_rgba(199,162,58,0.3)] active:scale-[0.97]"
          : "transition-transform"
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${className}`}
      style={{
        width: config.width,
        height: config.height,
        borderColor: checked ? "rgba(199,162,58,0.4)" : "rgba(138,106,30,0.25)",
        backgroundColor: checked ? "rgba(199,162,58,0.15)" : "rgba(14,18,27,0.6)",
      }}
    >
      {/* Animated track background */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full transition-[background] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          background: checked
            ? "linear-gradient(135deg, rgba(199,162,58,0.25) 0%, rgba(199,162,58,0.08) 100%)"
            : "linear-gradient(135deg, rgba(14,18,27,0.8) 0%, rgba(14,18,27,0.4) 100%)",
        }}
      />

      {/* Gold glow pulse on check */}
      {checked && !reduced && (
        <span aria-hidden className="sgc-toggle-glow pointer-events-none absolute inset-0 rounded-full" />
      )}

      {/* Ripple ring on click */}
      {showRipple && !reduced && (
        <span
          key={`ripple-${checked ? "on" : "off"}`}
          aria-hidden
          className="sgc-toggle-ripple pointer-events-none absolute rounded-full border-2 border-[var(--accent)]"
          style={{
            left: checked ? thumbTravel + 2 : 2,
            top: "50%",
            width: config.thumb,
            height: config.thumb,
            marginTop: -config.thumb / 2,
          }}
        />
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
      <span
        className="relative z-10 flex items-center justify-center rounded-full shadow-lg"
        style={{
          width: config.thumb,
          height: config.thumb,
          margin: 2,
          transform: `translateX(${checked ? thumbTravel : 0}px)`,
          background: checked
            ? "linear-gradient(135deg, #C7A23A 0%, #9B7B2C 100%)"
            : "linear-gradient(135deg, #1A1F2E 0%, #0E121B 100%)",
          boxShadow: checked
            ? "0 2px 8px rgba(199,162,58,0.4), 0 0 0 1px rgba(199,162,58,0.3)"
            : "0 2px 6px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.05)",
          transition: reduced
            ? undefined
            : "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        {/* Icon morphing — keyed remount replays a CSS animation */}
        <span
          key={checked ? "checked" : "unchecked"}
          className={`flex items-center justify-center ${reduced ? "" : "sgc-toggle-icon"}`}
        >
          {checked
            ? checkedIcon || (
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
              )
            : uncheckedIcon || (
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
        </span>
      </span>

      <style>{`
        @keyframes sgc-toggle-glow {
          0%   { box-shadow: 0 0 0 0 rgba(199,162,58,0.4); }
          50%  { box-shadow: 0 0 20px 4px rgba(199,162,58,0.25); }
          100% { box-shadow: 0 0 12px 2px rgba(199,162,58,0.15); }
        }
        .sgc-toggle-glow { animation: sgc-toggle-glow 0.6s ease-out both; }

        @keyframes sgc-toggle-ripple {
          from { transform: scale(0.8); opacity: 0.8; }
          to   { transform: scale(1.8); opacity: 0; }
        }
        .sgc-toggle-ripple { animation: sgc-toggle-ripple 0.5s ease-out both; }

        @keyframes sgc-toggle-icon {
          from { opacity: 0; transform: rotate(-90deg) scale(0.4); }
          to   { opacity: 1; transform: none; }
        }
        .sgc-toggle-icon { animation: sgc-toggle-icon 0.25s cubic-bezier(0.22, 1, 0.36, 1) both; }

        @keyframes sgc-toggle-particle {
          0%   { transform: translate(0, 0) scale(0); opacity: 1; }
          60%  { opacity: 0.8; }
          100% { transform: translate(var(--sgc-dx), var(--sgc-dy)) scale(0); opacity: 0; }
        }
        .sgc-toggle-particle { animation: sgc-toggle-particle 0.5s ease-out both; }
      `}</style>
    </button>
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
        <span
          key={p.id}
          className="sgc-toggle-particle absolute rounded-full bg-[var(--accent)]"
          style={
            {
              width: p.size,
              height: p.size,
              left: checked ? thumbTravel + config.thumb / 2 : config.thumb / 2 + 2,
              top: "50%",
              marginTop: -p.size / 2,
              animationDelay: `${p.delay}s`,
              "--sgc-dx": `${Math.cos((p.angle * Math.PI) / 180) * p.distance}px`,
              "--sgc-dy": `${Math.sin((p.angle * Math.PI) / 180) * p.distance}px`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );
}

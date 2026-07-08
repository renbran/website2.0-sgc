"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import PremiumToggle from "./PremiumToggle";

/**
 * Premium branded theme switch — a sliding gold thumb on a navy/cream track,
 * with a spring-physics glide (matches the site's "living" hover language
 * elsewhere: LivingCard tilt, GoldHairline draw-in) and an icon crossfade +
 * rotate morph inside the thumb. A brief gold glow pulses outward on toggle,
 * echoing the signature gold-hairline interaction from CLAUDE.md.
 *
 * Now powered by PremiumToggle for enhanced particle effects and ripple.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <PremiumToggle
      checked={isDark}
      onToggle={() => toggleTheme()}
      size="md"
      label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      showParticles={true}
      showRipple={true}
      uncheckedIcon={<Sun size={13} className="text-[var(--text-primary)]" />}
      checkedIcon={<Moon size={13} className="text-[var(--sgc-black)]" />}
      className={className}
    />
  );
}

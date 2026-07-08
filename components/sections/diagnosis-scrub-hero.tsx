"use client";

import { HeroScrub } from "@/components/ui/hero-scrub";

export default function DiagnosisScrubHero() {
  return (
    <HeroScrub
      frameCount={61}
      frameUrl={(i) =>
        `/frames/chaos-to-clarity/${String(i + 1).padStart(4, "0")}.webp`
      }
      titleTop="OPERATIONAL CHAOS"
      titleBottom="OPERATIONAL CLARITY"
      accentHex="#C7A23A"
      bgClassName="bg-[#080B11]"
      titleTopFontFamily="var(--font-fraunces), 'Playfair Display', serif"
      titleTopClassName="hero-scrub-title overlay-text-shadow absolute z-10 top-[20%] left-1/2 w-[90vw] max-w-2xl -translate-x-1/2 text-center text-2xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tight pointer-events-none"
      titleBottomFontFamily="var(--font-fraunces), 'Playfair Display', serif"
      titleBottomClassName="hero-scrub-title overlay-text-shadow absolute z-10 top-[75%] left-1/2 w-[90vw] max-w-2xl -translate-x-1/2 text-center text-2xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tight pointer-events-none"
    />
  );
}

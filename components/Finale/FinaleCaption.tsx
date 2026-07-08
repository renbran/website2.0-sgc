"use client";

import { AnimatePresence, motion } from "motion/react";
import { FINALE_CAPTIONS } from "./finaleMotion";

interface FinaleCaptionProps {
  activeIndex: number;
  reducedMotion: boolean;
}

// HTML caption overlay for the convergence finale. Motion handles the
// cross-fade between chapters (micro-interaction — the scroll scrub itself
// stays in GSAP/useFrame land).
export default function FinaleCaption({ activeIndex, reducedMotion }: FinaleCaptionProps) {
  const caption = FINALE_CAPTIONS[activeIndex] ?? FINALE_CAPTIONS[0];

  return (
    <div
      style={{
        position: "absolute",
        left: "clamp(1.5rem, 6vw, 6rem)",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 4,
        maxWidth: "min(34rem, 42vw)",
        pointerEvents: "none",
      }}
      className="max-md:!left-6 max-md:!right-6 max-md:!top-auto max-md:!bottom-24 max-md:!max-w-none max-md:!translate-y-0"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 22, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -14, filter: "blur(4px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "0.68rem",
              letterSpacing: "0.22em",
              color: "rgba(199,162,58,0.75)",
              marginBottom: "0.9rem",
            }}
          >
            {caption.eyebrow}
          </p>
          <h3
            style={{
              fontFamily: "var(--font-fraunces, serif)",
              fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)",
              fontWeight: 600,
              lineHeight: 1.15,
              color: "#F4F1EA",
              marginBottom: "0.8rem",
            }}
          >
            {caption.headline}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-inter, sans-serif)",
              fontSize: "clamp(0.9rem, 1.15vw, 1.05rem)",
              lineHeight: 1.6,
              color: "rgba(244,241,234,0.7)",
            }}
          >
            {caption.subline}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

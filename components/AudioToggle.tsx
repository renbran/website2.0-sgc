"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import AnimatedIcon from "@/components/ui/AnimatedIcon";
import { getCinematicSynth } from "@/lib/cinematicSynth";

export default function AudioToggle() {
  const shouldReduceMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(false);
  const firedRef = useRef(false);

  const beginPlayback = useCallback(async () => {
    const synth = getCinematicSynth();
    if (!synth.running) {
      await synth.startContextOnly(); // context-only: no oscillator drone
    } else {
      synth.resume();
    }
    setIsPlaying(true);
  }, []);

  const pausePlayback = useCallback(() => {
    const synth = getCinematicSynth();
    synth.suspend();
    setIsPlaying(false);
  }, []);

  // Autoplay on first user interaction — scroll, click, touch, or keydown
  useEffect(() => {
    if (shouldReduceMotion) return;
    const onInteraction = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      void beginPlayback();
    };
    // scroll is NOT a valid user gesture for AudioContext autoplay policy —
    // Chrome refuses AudioContext.resume() from scroll events.
    // pointerdown covers mouse click + stylus + touch (fires before click).
    // touchend covers tap release on iOS Safari specifically.
    const events = ["pointerdown", "touchend", "keydown"] as const;
    events.forEach((e) =>
      window.addEventListener(e, onInteraction, { passive: true, once: true })
    );
    return () => {
      events.forEach((e) => window.removeEventListener(e, onInteraction));
    };
  }, [beginPlayback, shouldReduceMotion]);

  // Pause when tab hidden, resume when visible
  useEffect(() => {
    const onVisibility = () => {
      const synth = getCinematicSynth();
      if (document.visibilityState === "hidden") {
        synth.suspend();
      } else if (isPlaying) {
        synth.resume();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [isPlaying]);

  const onToggle = useCallback(async () => {
    if (isPlaying) {
      pausePlayback();
    } else {
      await beginPlayback();
    }
  }, [isPlaying, beginPlayback, pausePlayback]);

  return (
    <motion.button
      type="button"
      onClick={() => void onToggle()}
      aria-label={isPlaying ? "Pause ambient soundtrack" : "Play ambient soundtrack"}
      aria-pressed={isPlaying}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(199,162,58,0.3)] bg-[rgba(8,11,17,0.45)] text-[var(--sgc-cyan)] transition duration-300 ease-out hover:scale-105 hover:border-[var(--sgc-cyan)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sgc-cyan)]"
      animate={
        isPlaying && !shouldReduceMotion
          ? {
              scale: [1, 1.06, 1],
              boxShadow: [
                "0 0 0 rgba(199,162,58,0)",
                "0 0 22px rgba(199,162,58,0.42)",
                "0 0 0 rgba(199,162,58,0)",
              ],
            }
          : { scale: 1, boxShadow: "0 0 0 rgba(199,162,58,0)" }
      }
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <AnimatedIcon deps={[isPlaying]}>
        {isPlaying ? (
          <Volume2 size={18} className="text-[var(--sgc-cyan)]" />
        ) : (
          <VolumeX size={18} className="text-[rgba(245,250,255,0.55)]" />
        )}
      </AnimatedIcon>
    </motion.button>
  );
}

"use client";
import { useEffect, useRef } from "react";
import { getSwooshPlayer } from "@/lib/swooshPlayer";

/**
 * Fires the big-swoosh accent on every active-diamond change.
 * The bed loop lifecycle is managed inside SwooshPlayer via AudioContext
 * statechange — this hook only owns the accent trigger and unmount cleanup.
 */
export function useDiamondSwoosh(activeIndex: number): void {
  const prevRef = useRef(activeIndex);

  useEffect(() => {
    if (prevRef.current !== activeIndex) {
      prevRef.current = activeIndex;
      void getSwooshPlayer().playAccent();
    }
  }, [activeIndex]);

  // Full stop only on unmount — tab blur is handled by AudioContext suspension
  useEffect(() => {
    return () => {
      getSwooshPlayer().muteAll();
    };
  }, []);
}

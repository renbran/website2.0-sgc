"use client";

import { type DependencyList, useEffect, useRef } from "react";

/**
 * Animates SVG stroke paths inside a container with a draw-on shimmer.
 * Each path has its stroke-dashoffset animated 0 → 1, infinite
 * alternate, ~1s per cycle. Equivalent to animejs's drawable draw-on
 * but built on rAF + inline style mutation so we don't ship a 60kb
 * library for a four-line animation.
 *
 * @param deps  React dependency array — re-runs the animation when deps
 *              change (e.g. pass `[isPlaying]` to re-animate on toggle).
 */
export function useLucideDrawerAnimation(deps: DependencyList = []) {
  const root = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = root.current;
    if (!container) return;

    const els = container.querySelectorAll<SVGGeometryElement>(
      "svg path, svg circle, svg polyline",
    );
    if (!els.length) return;

    // Capture each path's intrinsic length once and lock the dash array.
    const lens: number[] = [];
    els.forEach((el) => {
      const len = el.getTotalLength();
      lens.push(len);
      el.style.strokeDasharray = `${len} ${len}`;
      el.style.strokeDashoffset = "0";
      el.style.transition = "none";
    });

    const start = performance.now();
    const cycle = 1000; // ms — same as the prior animejs loop

    const tick = () => {
      const elapsed = (performance.now() - start) % (cycle * 2);
      const t = elapsed < cycle ? elapsed / cycle : 2 - elapsed / cycle;
      // ease-in-out quad for smoother feel
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      els.forEach((el, i) => {
        const len = lens[i];
        el.style.strokeDashoffset = `${(1 - eased) * len}px`;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      els.forEach((el) => {
        el.style.strokeDasharray = "";
        el.style.strokeDashoffset = "";
        el.style.transition = "";
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return root;
}

import * as THREE from "three";

// Single source of truth for the helix's scroll-driven motion.
//
// Every value here is a PURE, deterministic function of scroll progress (0..1):
// the same progress always yields the same camera position and diamond layout,
// regardless of scroll direction — so the scene reverses frame-for-frame.
// No time accumulation, no exponential damping, no history. Smoothness comes
// from Lenis input-smoothing on `progress`, not from per-frame lerps.

export const DIAMOND_COUNT = 8;

// Y position of diamond i (and the camera height when centred on it).
// i=0 is the bottom of the helix, i=7 the top.
export const diamondY = (i: number) => ((DIAMOND_COUNT - 1) / 2 - i) * 1.5;

// Maps scroll progress (0..1) to a continuous "camera index" (0..7) that dwells
// near each diamond and eases through the gaps — preserving the elevator-dwell
// feel of the original (which came from a discrete activeIndex + settle), but as
// a pure function of progress so it retraces exactly in reverse.
export function progressToCamIndex(progress: number): number {
  const f = THREE.MathUtils.clamp(progress, 0, 1) * (DIAMOND_COUNT - 1);
  const seg = Math.floor(f);
  const frac = f - seg;
  // Hold near `seg` for frac<0.35, ease across 0.35..0.65, hold near seg+1.
  const eased = THREE.MathUtils.smoothstep(frac, 0.35, 0.65);
  return Math.min(seg + eased, DIAMOND_COUNT - 1);
}

// 0..1 "activeness" of diamond i for the current camera index. Peaks at 1 when
// the camera is centred on it and smoothly falls to 0 by ~0.75 away — so at rest
// exactly one diamond is prominent, and transitions hand off without a pop.
export function diamondActiveness(camIndex: number, i: number): number {
  const t = THREE.MathUtils.clamp(1 - Math.abs(camIndex - i) / 0.75, 0, 1);
  return t * t * (3 - 2 * t); // smoothstep
}

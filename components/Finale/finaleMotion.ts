import * as THREE from "three";
import {
  PHASE_A_END,
  PHASE_B_END,
  PHASE_C_END,
  CHASE_ALPHA,
  SHARD_COUNT_DESKTOP,
  SHARD_COUNT_MOBILE,
  invLerp,
  smoothInOut,
  captionOpacity,
  activeCaptionIndex,
  STATS_AT,
  GOLD,
  GOLD_SOFT,
  CYAN,
  BG,
  FINALE_CAPTIONS,
} from "./finaleConstants";
import type { FinaleCaptionData } from "./finaleConstants";

// Three-free values (phase windows, caption copy, palette, pure math) live in
// finaleConstants.ts so the eagerly-loaded overlay components can use them
// without pulling three.js into the initial bundle. Re-exported here so the
// lazy 3D modules keep importing everything from one place.
export {
  PHASE_A_END,
  PHASE_B_END,
  PHASE_C_END,
  CHASE_ALPHA,
  SHARD_COUNT_DESKTOP,
  SHARD_COUNT_MOBILE,
  invLerp,
  smoothInOut,
  captionOpacity,
  activeCaptionIndex,
  STATS_AT,
  GOLD,
  GOLD_SOFT,
  CYAN,
  BG,
  FINALE_CAPTIONS,
};
export type { FinaleCaptionData };

// Single source of truth for the Act-3 "Convergence" finale motion.
//
// Every value is a PURE, deterministic function of scroll progress (0..1):
// the same progress always yields the same shard layout, so the scene
// retraces frame-for-frame in reverse (same convention as helixMotion.ts
// and the shield). Smoothness for fast scrollers comes from a soft-chase
// lerp on raw progress in the scene, not from stateful tweens.
//
// This module intentionally imports NOTHING from components/Shield or
// components/HelixSpiral — the shield code diverges across branches, so the
// small amount of shared geometry (hex lattice, vanguard silhouette) is
// duplicated here to keep Act 3 portable.

// ─── Phase windows, shard counts, caption copy and palette ──────────────
// Moved to finaleConstants.ts (three-free) — imported and re-exported above.
// A — Chaos:      scattered shards drift (echo of the pre-Odoo mess)
// B — One System: shards spiral into a mini double-helix (echo of Act 1)
// C — Protected:  shards lock onto the hex cluster + frame draws (echo of Act 2)
// D — Outcome:    SGC beacon mark + stat counters, handoff to SectionEight

// Chaos-cloud bounds — slightly wider on desktop, narrower on mobile.
const CHAOS_W = 9.5;
const CHAOS_H = 5.8;
const CHAOS_D = 2.6;

// ─── Hex lattice (flat-top honeycomb, unit radius) ──────────────────────
// Duplicated from the shield's lattice so the finale echoes its geometry
// without importing branch-divergent code. Hourglass layout: shoulders,
// flanks, crown, foundation around a logo center.
const HEX_RADIUS = 1.0;
const SQRT3 = Math.sqrt(3);
const H = 1.5 * HEX_RADIUS;
const VH = (SQRT3 / 2) * HEX_RADIUS;
const V2 = SQRT3 * HEX_RADIUS;

// Logo center + 6 narrative hexes, scaled down to sit inside the frame.
export const HEX_CLUSTER_SCALE = 0.62;
export const HEX_CENTERS: THREE.Vector3[] = [
  new THREE.Vector3(0, 0, 0),      // logo center
  new THREE.Vector3(-H, VH, 0),    // upper-left shoulder
  new THREE.Vector3(H, VH, 0),     // upper-right shoulder
  new THREE.Vector3(-H, -VH, 0),   // lower-left flank
  new THREE.Vector3(H, -VH, 0),    // lower-right flank
  new THREE.Vector3(0, V2, 0),     // crown
  new THREE.Vector3(0, -V2, 0),    // foundation
].map((v) => v.multiplyScalar(HEX_CLUSTER_SCALE));

export const HEX_OUTLINE_RADIUS = HEX_RADIUS * HEX_CLUSTER_SCALE * 0.92;

// ─── Vanguard shield silhouette (duplicated constant geometry) ──────────
// Slim Vanguard outline: width ≈4.4, height ≈5.7 (0.77:1, taller-than-wide).
export const FRAME_POINTS: [number, number][] = [
  [0.0, 2.8], [0.7, 2.8], [1.6, 2.8],
  [2.2, 2.0], [2.2, 0.7], [2.2, -0.3],
  [1.65, -1.4], [1.0, -2.1], [0.0, -2.9],
  [-1.0, -2.1], [-1.65, -1.4], [-2.2, -0.3],
  [-2.2, 0.7], [-2.2, 2.0], [-1.6, 2.8], [-0.7, 2.8],
];
export const FRAME_SCALE = 0.72; // fits the hex cluster with breathing room

// ─── Helpers ────────────────────────────────────────────────────────────
// invLerp / smoothInOut live in finaleConstants.ts (imported above).

// Deterministic per-shard pseudo-random (mulberry32) — no Math.random so
// SSR/CSR and every remount produce identical layouts.
export function shardRandom(seed: number): () => number {
  let a = (seed + 1) * 0x9e3779b9;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface ShardStatic {
  chaosBase: THREE.Vector3;   // home position in the chaos cloud
  driftPhase: number;         // per-shard sine phase for chaos drift
  driftAmp: number;           // per-shard drift amplitude
  helixT: number;             // 0..1 parameter along the mini helix
  strand: 0 | 1;              // which helix strand
  hexIndex: number;           // which hex center it locks onto
  hexAngle: number;           // resting angle on the hex ring
  isGold: boolean;            // gold vs cyan shard
  scale: number;              // base shard scale
}

// Precompute the per-shard static attributes once (pure function of count).
export function buildShards(count: number): ShardStatic[] {
  const shards: ShardStatic[] = [];
  for (let i = 0; i < count; i++) {
    const rnd = shardRandom(i);
    const strand = (i % 2) as 0 | 1;
    shards.push({
      chaosBase: new THREE.Vector3(
        (rnd() - 0.5) * CHAOS_W,
        (rnd() - 0.5) * CHAOS_H,
        (rnd() - 0.5) * CHAOS_D,
      ),
      driftPhase: rnd() * Math.PI * 2,
      driftAmp: 0.15 + rnd() * 0.3,
      helixT: i / Math.max(1, count - 1),
      strand,
      hexIndex: i % HEX_CENTERS.length,
      hexAngle: rnd() * Math.PI * 2,
      isGold: i % 3 === 0, // 1/3 gold, 2/3 cyan — gold is the accent, not the wash
      scale: 0.05 + rnd() * 0.05,
    });
  }
  return shards;
}

// ─── Mini double-helix parametrics (echo of Act 1, NOT the frozen DNAHelix) ──
const HELIX_TURNS = 2.0;
const HELIX_RADIUS = 1.35;
const HELIX_HEIGHT = 5.0;

export function helixPoint(t: number, strand: 0 | 1, spin: number, out: THREE.Vector3): THREE.Vector3 {
  const angle = t * Math.PI * 2 * HELIX_TURNS + (strand === 0 ? 0 : Math.PI) + spin;
  out.set(
    Math.cos(angle) * HELIX_RADIUS,
    (t - 0.5) * HELIX_HEIGHT,
    Math.sin(angle) * HELIX_RADIUS,
  );
  return out;
}

// ─── Per-shard position: continuous blend across the three targets ──────
// Chaos → helix over [0.24..0.46]; helix → hex ring over [0.55..0.72].
const scratchA = new THREE.Vector3();
const scratchB = new THREE.Vector3();

export function shardPosition(s: ShardStatic, p: number, out: THREE.Vector3): THREE.Vector3 {
  // Chaos: base + slow deterministic sine drift (function of p, not time).
  const drift = Math.sin(p * 14 + s.driftPhase) * s.driftAmp;
  scratchA.set(
    s.chaosBase.x + drift,
    s.chaosBase.y + Math.cos(p * 11 + s.driftPhase * 1.7) * s.driftAmp,
    s.chaosBase.z,
  );

  // Helix: spins slowly with progress so Act 1's auto-rotation is echoed.
  helixPoint(s.helixT, s.strand, p * Math.PI * 1.5, scratchB);

  const toHelix = smoothInOut(invLerp(0.24, 0.46, p));
  out.copy(scratchA).lerp(scratchB, toHelix);

  // Hex ring: shards settle on a small ring around their assigned hex center.
  const hc = HEX_CENTERS[s.hexIndex];
  scratchB.set(
    hc.x + Math.cos(s.hexAngle) * HEX_OUTLINE_RADIUS * 0.55,
    hc.y + Math.sin(s.hexAngle) * HEX_OUTLINE_RADIUS * 0.55,
    0.05,
  );
  const toHex = smoothInOut(invLerp(0.55, 0.72, p));
  out.lerp(scratchB, toHex);
  return out;
}

// Shard opacity: fade in at the very start, hand off to the hex tiles in C.
export function shardOpacity(p: number): number {
  const fadeIn = smoothInOut(invLerp(0.0, 0.06, p));
  const fadeOut = 1 - smoothInOut(invLerp(0.74, 0.84, p));
  return fadeIn * fadeOut;
}

// ─── Hex outlines: surface as the shards arrive, hold through D ─────────
export function hexOpacity(p: number): number {
  return smoothInOut(invLerp(0.68, 0.80, p));
}

// ─── Vanguard frame draw-in (setDrawRange fraction) ─────────────────────
export function frameDrawProgress(p: number): number {
  return smoothInOut(invLerp(0.64, 0.90, p));
}

// ─── SGC beacon mark (Phase D) ──────────────────────────────────────────
export function markOpacity(p: number): number {
  return smoothInOut(invLerp(0.86, 0.95, p));
}
export function markScale(p: number): number {
  return 0.86 + 0.14 * smoothInOut(invLerp(0.86, 0.98, p));
}
// Hexes recede slightly behind the mark so it reads as the destination.
export function hexRecede(p: number): number {
  return 1 - 0.55 * smoothInOut(invLerp(0.86, 0.97, p));
}

// ─── Camera: gentle dolly-in across the whole act ───────────────────────
export function cameraZ(p: number): number {
  return 7.4 - 1.4 * smoothInOut(p);
}

// ─── Captions (HTML overlay) ────────────────────────────────────────────
// FinaleCaptionData / FINALE_CAPTIONS / captionOpacity / activeCaptionIndex /
// STATS_AT live in finaleConstants.ts (three-free) — imported/re-exported above.

// ─── Responsive scaling (same contract as the shield's) ─────────────────
const BP = 768;
const MIN_W = 375;
const MIN_S = 0.72;

export function responsiveScale(viewportWidth: number): number {
  if (viewportWidth >= BP) return 1;
  const t = THREE.MathUtils.clamp((viewportWidth - MIN_W) / (BP - MIN_W), 0, 1);
  return MIN_S + t * (1 - MIN_S);
}

// ─── Palette ────────────────────────────────────────────────────────────
// GOLD / GOLD_SOFT / CYAN / BG live in finaleConstants.ts (re-exported above).

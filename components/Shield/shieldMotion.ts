import * as THREE from "three";
import type { Stage } from "./complianceData";

// ─── Hex geometry constants (shared unit lattice) ──────────────────────
// Flat-top honeycomb. Every meaningful hex + every filler hex is built on
// THIS lattice so they tessellate flush. Scaling happens once, on the parent
// cluster group in ShieldScene (CLUSTER_SCALE * responsiveScale).
export const HEX_RADIUS = 1.0;
const SQRT3 = Math.sqrt(3);
const H = 1.5 * HEX_RADIUS;         // horizontal column step (edge-sharing)
const VH = (SQRT3 / 2) * HEX_RADIUS; // vertical half-step
const V2 = SQRT3 * HEX_RADIUS;       // vertical full-step
export { H as LATTICE_H, VH as LATTICE_VH, V2 as LATTICE_V2 };

// Whole cluster (logo + 6 hexes + filler) scaled by this on the parent group.
// 0.54 keeps the full 3-ring honeycomb shield (29 cells) inside the camera
// frame (z=5.8, fov=55 → ~±3 units tall). With FRAME_POINTS = SHIELD×0.581,
// FillerMesh's hexTest polygon = SHIELD exactly, yielding 22 dormant cells.
export const CLUSTER_SCALE = 0.54;

// ─── 6 narrative hex lock positions (raw unit lattice) ─────────────────
// LOCK ORDER: shoulders (0,1) → flanks (2,3) → vertical axis (4,5).
// Hourglass assembly: outer ring → inner ring → crown + foundation.
//
//          [4] (0, +√3)              RESULT: Connected   (crown)
//     [0]      [1]  (∓H, +VH)       PROBLEM: Scattered / At Risk
//          (LOGO 0,0)
//     [2]      [3]  (∓H, -VH)       SOLUTION: Unified / Automated
//          [5] (0, -√3)              RESULT: Audit-Ready (foundation)
export const TILE_LOCK_POS: THREE.Vector3[] = [
  new THREE.Vector3(-H,  VH,  0), // 0 — upper-left shoulder
  new THREE.Vector3( H,  VH,  0), // 1 — upper-right shoulder
  new THREE.Vector3(-H, -VH,  0), // 2 — lower-left flank
  new THREE.Vector3( H, -VH,  0), // 3 — lower-right flank
  new THREE.Vector3( 0,  V2,  0), // 4 — top crest
  new THREE.Vector3( 0, -V2,  0), // 5 — bottom point
];

export const TILE_STAGE: Stage[] = [
  "problem",  // 0 Scattered
  "problem",  // 1 At Risk
  "solution", // 2 Unified
  "solution", // 3 Automated
  "result",   // 4 Connected
  "result",   // 5 Audit-Ready
];

// Act each hex belongs to (0=problem, 1=solution, 2=result)
export const ACT_OF = [0, 0, 1, 1, 2, 2];

// All meaningful cell centers (logo + 6) — filler skips these.
export const OCCUPIED_CENTERS: [number, number][] = [
  [0, 0],
  ...TILE_LOCK_POS.map((v) => [v.x, v.y] as [number, number]),
];

// ─── Continuous-travel reveal model (scroll progress 0→1) ──────────────
// 6 hexes each own ONE contiguous, non-overlapping window of scroll.
// Within a window (local fraction f∈[0,1]):
//   travel  [0 .. TRAVEL_END]           hex lerps origin→slot
//   label   [TRAVEL_END .. LABEL_END]   diagnosis label surfaces first, latched
//   dwell   [LABEL_END .. DWELL_END]    callout surfaces & holds
//   c-fade  [DWELL_END .. CFADE_END]    callout fades to 0
// Callout-visible and label-only are sequenced: label first, callout second.
export const SEQ_START = 0.03;
export const SEQ_END   = 0.92;
export const HEX_COUNT = 6;
export const HEX_WINDOW = (SEQ_END - SEQ_START) / HEX_COUNT; // ≈ 0.1483

// Per-window phase fractions.
export const TRAVEL_END = 0.30; // hex locks faster → more window left for dwell
export const LABEL_END  = 0.45; // diagnosis label surfaces first, right after lock
export const DWELL_END  = 0.80; // callout enter+hold ends
export const CFADE_END  = 0.92; // callout fades cleanly

export const DORMANT_OPACITY = 0.0; // hexes invisible at scatter — materialise during flight

// Soft-chase lerp alpha: smoothP += (rawP - smoothP) * CHASE_ALPHA per frame.
// At 60 fps → ~95% catch-up in 0.6 s — removes jerk for fast scrollers.
export const CHASE_ALPHA = 0.08;

const FR_S = 0.45; const FR_E = 0.99; // gold frame draws in, completes last

// Window bounds for hex i.
export function hexWindow(i: number): [number, number] {
  const ws = SEQ_START + i * HEX_WINDOW;
  return [ws, ws + HEX_WINDOW];
}

// Global progress at which both hexes of an act have locked.
// Used for stage-breath beat timing.
export function actCompletesAt(act: number): number {
  const secondHex = act * 2 + 1; // hex indices 1, 3, 5
  const [ws] = hexWindow(secondHex);
  return ws + TRAVEL_END * HEX_WINDOW;
}

// ─── Varied, deliberate, non-crossing entry origins (cluster-local) ─────
// Each hex starts off-frame in a distinct compass region near its slot's side.
// Order matches TILE_LOCK_POS lock order (shoulders, flanks, axis).
export const ORIGIN_OFFSETS: [number, number, number][] = [
  [ -6.5,  1.0, 1.0 ], // 0 upper-left  — from LEFT
  [  6.5,  1.0, 1.0 ], // 1 upper-right — from RIGHT
  [ -5.8, -5.0, 1.0 ], // 2 lower-left  — from LOWER-LEFT
  [  5.8, -5.0, 1.0 ], // 3 lower-right — from LOWER-RIGHT
  [  0.0,  7.2, 1.0 ], // 4 top crest   — from ABOVE
  [  0.0, -7.0, 1.0 ], // 5 bottom      — from BELOW
];

// ─── Helpers ───────────────────────────────────────────────────────────
function invLerp(a: number, b: number, v: number): number {
  return THREE.MathUtils.clamp((v - a) / (b - a), 0, 1);
}
function smoothInOut(t: number): number {
  return t * t * (3 - 2 * t);
}

// cubic-bezier(0.22, 1, 0.36, 1) — per-hex settle easing (Newton solve).
const BZ_X1 = 0.22, BZ_Y1 = 1.0, BZ_X2 = 0.36, BZ_Y2 = 1.0;
function bezAxis(t: number, p1: number, p2: number): number {
  const c = 3 * p1;
  const b = 3 * (p2 - p1) - c;
  const a = 1 - c - b;
  return ((a * t + b) * t + c) * t;
}
function bezAxisSlope(t: number, p1: number, p2: number): number {
  const c = 3 * p1;
  const b = 3 * (p2 - p1) - c;
  const a = 1 - c - b;
  return (3 * a * t + 2 * b) * t + c;
}
function easeSettle(x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  let t = x;
  for (let i = 0; i < 5; i++) {
    const xe = bezAxis(t, BZ_X1, BZ_X2) - x;
    const d = bezAxisSlope(t, BZ_X1, BZ_X2);
    if (Math.abs(d) < 1e-6) break;
    t -= xe / d;
  }
  t = THREE.MathUtils.clamp(t, 0, 1);
  return bezAxis(t, BZ_Y1, BZ_Y2);
}

// ─── Per-hex travel (0 = at scattered origin, 1 = locked in slot) ────────
export const tileProgress: ((p: number) => number)[] = Array.from(
  { length: HEX_COUNT },
  (_, i) => {
    const [ws] = hexWindow(i);
    const s = ws;
    const e = ws + TRAVEL_END * HEX_WINDOW;
    return (p: number) => easeSettle(invLerp(s, e, p));
  },
);

// ─── Per-hex caption choreography ─────────────────────────────────────────
// Diagnosis label surfaces first at lock (TRAVEL_END→LABEL_END), THEN the
// callout surfaces (LABEL_END), holds through DWELL_END, fades by CFADE_END.
export interface CaptionState {
  opacity: number;
  type: number;    // 0→1 character reveal
  dy: number;      // translateY(px)
  blur: number;    // blur(px)
  scale: number;
}
const ENTER_DY = 10, EXIT_DY = -8, ENTER_BLUR = 5, EXIT_SCALE = 0.98;

export function captionState(i: number, p: number): CaptionState {
  const [ws] = hexWindow(i);
  const f = (p - ws) / HEX_WINDOW;
  if (f <= 0)          return { opacity: 0, type: 0, dy: ENTER_DY, blur: ENTER_BLUR, scale: 1 };
  if (f >= CFADE_END)  return { opacity: 0, type: 1, dy: EXIT_DY, blur: 0, scale: EXIT_SCALE };
  if (f < LABEL_END)   return { opacity: 0, type: 0, dy: ENTER_DY, blur: ENTER_BLUR, scale: 1 };

  if (f < DWELL_END) {
    // Enter ramp: 8% of the (DWELL_END − LABEL_END) window ≈ 40 px at 750 vh.
    // Keeping it this tight ensures "surface" and "fade" are never within the
    // same scroll gesture — there is ~500 px of flat hold separating them.
    const ENTER_END = LABEL_END + 0.08 * (DWELL_END - LABEL_END);
    if (f < ENTER_END) {
      const s = invLerp(LABEL_END, ENTER_END, f);
      const op = smoothInOut(s);
      return { opacity: op, type: s, dy: ENTER_DY * (1 - op), blur: ENTER_BLUR * (1 - op), scale: 1 };
    }
    return { opacity: 1, type: 1, dy: 0, blur: 0, scale: 1 };
  }
  // Exit ramp covers DWELL_END→CFADE_END (12% of window ≈ 80 px) — brief fade-out.
  const o = smoothInOut(invLerp(DWELL_END, CFADE_END, f));
  return { opacity: 1 - o, type: 1, dy: EXIT_DY * o, blur: 0, scale: 1 - (1 - EXIT_SCALE) * o };
}

// ─── Per-hex in-hex label (diagnosis) surface ─────────────────────────────
// Ramps 0→1 over [TRAVEL_END..LABEL_END] — right after the hex locks, before
// the callout appears. Latched at 1 afterward (dimmed later by the callout
// via calloutDimming in HexTile, but never hidden again).
export function labelProgress(i: number, p: number): number {
  const [ws] = hexWindow(i);
  const f = (p - ws) / HEX_WINDOW;
  if (f < TRAVEL_END) return 0;
  if (f >= LABEL_END) return 1;
  return smoothInOut(invLerp(TRAVEL_END, LABEL_END, f));
}

// Active hex index — drives the mobile caption band.
export function activeCaptionIndex(p: number): number {
  if (p <= SEQ_START) return 0;
  if (p >= SEQ_END) return HEX_COUNT - 1;
  return THREE.MathUtils.clamp(Math.floor((p - SEQ_START) / HEX_WINDOW), 0, HEX_COUNT - 1);
}

// ─── Responsive scaling ────────────────────────────────────────────────
export const BP = 768;
const MIN_W = 375;
const MIN_S = 0.72;

export function responsiveScale(viewportWidth: number): number {
  if (viewportWidth >= BP) return 1;
  const t = THREE.MathUtils.clamp((viewportWidth - MIN_W) / (BP - MIN_W), 0, 1);
  return MIN_S + t * (1 - MIN_S);
}

// ─── Shield frame progress ─────────────────────────────────────────────
export function shieldFrameProgress(p: number): number {
  if (p < FR_S) return 0;
  if (p > FR_E) return 1;
  return smoothInOut(invLerp(FR_S, FR_E, p));
}

// ─── Finale threshold ──────────────────────────────────────────────────
// 0.95 is comfortably past SEQ_END (0.92) — the 6th label is latched before
// the finale trigger fires.
export const FINALE_AT = 0.95;

// ─── Shield assembly progress (glow + filler fill) ─────────────────────
export function assemblyProgress(p: number): number {
  return smoothInOut(invLerp(SEQ_START, SEQ_END, p));
}

// ─── Impact / collision-splash (post-spin "landing") ────────────────────
// Fires once the finale spin is almost complete — reads as the shield
// landing into its settlement slot, like a stone striking water: a brief
// shake + radial gold-dust splash that bursts outward fast then drag-
// decelerates and dissolves, rather than a linear explosion.
export const IMPACT_AT = 0.96;        // ft threshold that fires the impact
export const SHAKE_DURATION = 0.5;    // seconds, decaying jitter
export const SHAKE_AMPLITUDE = 0.16;  // world units, peak jitter offset
export const SHAKE_FREQUENCY = 34;    // rad/s, jitter oscillation rate
export const PUNCH_SCALE = 0.09;      // peak scale bump (1 + PUNCH_SCALE) on impact
export const BURST_LIFETIME = 1.1;    // seconds, splash particle life
const BURST_DRAG = 2.6;               // higher = faster deceleration (water-like)

// Decaying sinusoidal shake offset — reads as a jolt that rings down, not a
// single bounce. Returns 0 once t exceeds SHAKE_DURATION.
export function shakeOffset(t: number): number {
  if (t <= 0 || t >= SHAKE_DURATION) return 0;
  const decay = Math.exp(-t * 7);
  return Math.sin(t * SHAKE_FREQUENCY) * decay * SHAKE_AMPLITUDE;
}

// Quick scale punch (1 → 1+PUNCH_SCALE → 1), same decay envelope as the
// shake so the "landing" reads as a single cohesive jolt, not two effects.
export function punchScale(t: number): number {
  if (t <= 0 || t >= SHAKE_DURATION) return 1;
  const decay = Math.exp(-t * 7);
  return 1 + Math.abs(Math.sin(t * SHAKE_FREQUENCY * 0.5)) * decay * PUNCH_SCALE;
}

// Radial splash expansion — fast burst, drag-damped settle (stone-in-water
// ripple, not a linear explosion). Returns world-unit radius at time t.
export function burstRadius(t: number, maxRadius: number): number {
  const tt = THREE.MathUtils.clamp(t / BURST_LIFETIME, 0, 1);
  return maxRadius * (1 - Math.exp(-tt * BURST_DRAG * 3));
}

// Splash opacity — quick flash-in through the initial burst, then dissolves.
export function burstOpacity(t: number): number {
  const tt = THREE.MathUtils.clamp(t / BURST_LIFETIME, 0, 1);
  if (tt < 0.15) return tt / 0.15;
  return 1 - smoothInOut((tt - 0.15) / 0.85);
}

// ─── Per-hex lock impact ────────────────────────────────────────────
// When a hex travels into its lock slot (TRAVEL_END of its window), it
// fires its own small shake + scale-punch + tiny gold-dust burst, so
// the user feels 6 individual impacts across the scrub, not 1 finale
// hit. Smaller, faster decay than the finale group shake.
export const HEX_SHAKE_DURATION = 0.32;   // seconds — shorter than finale
export const HEX_SHAKE_AMPLITUDE = 0.07; // world units — smaller per-cell
export const HEX_SHAKE_FREQUENCY = 52;   // rad/s — tighter jitter
export const HEX_PUNCH_SCALE = 0.14;     // bigger than finale since it's per-cell
export const HEX_BURST_LIFETIME = 0.55;  // seconds — quick burst per hex

// Same envelope as the finale shake but faster + smaller scale. Direction
// of jitter is fixed per-hex so the cell looks like it's being struck
// from a consistent angle (not a generic wobble).
export function hexShakeOffset(t: number, seed: number): number {
  if (t <= 0 || t >= HEX_SHAKE_DURATION) return 0;
  const decay = Math.exp(-t * 11);
  return Math.sin(t * HEX_SHAKE_FREQUENCY + seed) * decay * HEX_SHAKE_AMPLITUDE;
}

export function hexPunchScale(t: number): number {
  if (t <= 0 || t >= HEX_SHAKE_DURATION) return 1;
  const decay = Math.exp(-t * 11);
  return 1 + Math.abs(Math.sin(t * HEX_SHAKE_FREQUENCY * 0.5)) * decay * HEX_PUNCH_SCALE;
}

// Smaller splash radius (per-cell, not whole shield). Inherits the drag-
// damped easing from the finale burst via burstRadius/burstOpacity.
export function hexBurstRadius(t: number, maxRadius: number): number {
  const tt = THREE.MathUtils.clamp(t / HEX_BURST_LIFETIME, 0, 1);
  return maxRadius * (1 - Math.exp(-tt * 4.2));
}

export function hexBurstOpacity(t: number): number {
  const tt = THREE.MathUtils.clamp(t / HEX_BURST_LIFETIME, 0, 1);
  if (tt < 0.1) return tt / 0.1;
  return 1 - smoothInOut((tt - 0.1) / 0.9);
}

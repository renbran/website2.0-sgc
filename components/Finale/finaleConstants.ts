// Three-free finale constants — safe for the eagerly-loaded overlay
// components (FinaleConvergenceSection, FinaleCaption,
// ReducedMotionFinaleFallback). Anything importing from finaleMotion.ts
// drags three.js (~370 KB) into the initial bundle, so the caption copy,
// phase windows and pure math helpers live here instead.

// ─── Phase windows (scroll progress 0→1 across the 400vh pin) ───────────
// A — Chaos:      scattered shards drift (echo of the pre-Odoo mess)
// B — One System: shards spiral into a mini double-helix (echo of Act 1)
// C — Protected:  shards lock onto the hex cluster + frame draws (echo of Act 2)
// D — Outcome:    SGC beacon mark + stat counters, handoff to SectionEight
export const PHASE_A_END = 0.30;
export const PHASE_B_END = 0.58;
export const PHASE_C_END = 0.84;

// Soft-chase lerp alpha: smoothP += (rawP - smoothP) * CHASE_ALPHA per frame.
export const CHASE_ALPHA = 0.085;

export const SHARD_COUNT_DESKTOP = 50;
export const SHARD_COUNT_MOBILE = 24;

// ─── Helpers ────────────────────────────────────────────────────────────
export function invLerp(a: number, b: number, v: number): number {
  return Math.min(1, Math.max(0, (v - a) / (b - a)));
}
export function smoothInOut(t: number): number {
  return t * t * (3 - 2 * t);
}

// ─── Captions (HTML overlay) ────────────────────────────────────────────
export interface FinaleCaptionData {
  eyebrow: string;
  headline: string;
  subline: string;
}

export const FINALE_CAPTIONS: FinaleCaptionData[] = [
  {
    eyebrow: "ACT I · WHERE YOU ARE",
    headline: "You saw the chaos.",
    subline: "Excel, Tally, WhatsApp — seven systems, zero truth.",
  },
  {
    eyebrow: "ACT II · ONE SYSTEM",
    headline: "One system replaced them all.",
    subline: "CRM, sales, accounting and HR — unified in Odoo.",
  },
  {
    eyebrow: "ACT III · PROTECTED",
    headline: "Then we made it audit-proof.",
    subline: "VAT, Corporate Tax, RERA, goAML — built in, not bolted on.",
  },
  {
    eyebrow: "YEAR ONE · THE OUTCOME",
    headline: "This is what your Q1 could look like.",
    subline: "Measured on live deployments — not projections.",
  },
];

// Caption visibility windows: [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd].
// Caption 3 (Outcome) never fades out — it hands off into SectionEight.
const CAPTION_WINDOWS: [number, number, number, number][] = [
  [0.02, 0.07, 0.24, 0.29],
  [0.32, 0.36, 0.51, 0.56],
  [0.59, 0.63, 0.78, 0.83],
  [0.86, 0.91, 1.01, 1.02],
];

export function captionOpacity(index: number, p: number): number {
  const [inS, inE, outS, outE] = CAPTION_WINDOWS[index];
  return smoothInOut(invLerp(inS, inE, p)) * (1 - smoothInOut(invLerp(outS, outE, p)));
}

export function activeCaptionIndex(p: number): number {
  for (let i = CAPTION_WINDOWS.length - 1; i >= 0; i--) {
    if (p >= CAPTION_WINDOWS[i][0]) return i;
  }
  return 0;
}

// Stats become visible with the Outcome caption.
export const STATS_AT = 0.88;

// ─── Palette (design tokens, 3D-legal colors only) ──────────────────────
export const GOLD = "#C7A23A";
export const GOLD_SOFT = "#D4A574";
export const CYAN = "#3FA9F5";
export const BG = "#080B11";

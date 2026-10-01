// Pure scroll-timeline constants for the Shield act — deliberately free of
// any `three` import. Both the eagerly-loaded choreography (ShieldSection,
// StageProgress) and the lazy 3D canvas modules read these numbers, so they
// live here rather than in shieldMotion.ts: importing even one value from a
// module that instantiates THREE.Vector3 at module scope drags the whole of
// three.js (~370 KB) into the initial page bundle.

// ─── Continuous-travel reveal model (scroll progress 0→1) ──────────────
// 6 hexes each own ONE contiguous, non-overlapping window of scroll.
// The first hex starts travelling at SEQ_START; the last holds by SEQ_END.
export const SEQ_START = 0.03;
export const SEQ_END = 0.92;
export const HEX_COUNT = 6;
export const HEX_WINDOW = (SEQ_END - SEQ_START) / HEX_COUNT; // ≈ 0.1483

// Within a window, the diagnosis label surfaces right after the hex locks
// (TRAVEL_END→LABEL_END in shieldMotion.ts) and stays latched at 1 after
// LABEL_END. StageProgress reads LABEL_END to time the stage titles.
export const LABEL_END = 0.45;

// ─── Finale threshold ──────────────────────────────────────────────────
// 0.95 is comfortably past SEQ_END (0.92) — the 6th label is latched before
// the finale trigger fires.
export const FINALE_AT = 0.95;

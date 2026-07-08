"use client";

import { useEffect, useRef, type RefObject } from "react";
import { SEQ_START, HEX_WINDOW, LABEL_END } from "./shieldMotion";

// StageProgress — synced to scrollProgressRef.
//
// Two synced visuals driven by the same scroll value the rest of the
// shield scene reads:
//
//   1. Persistent side rail (left edge, desktop only):
//      3 vertical dots with mono labels [01] DIAGNOSIS / [02] PRESCRIPTION /
//      [03] OUTCOME. Active stage lights up (gold/teal), inactive dim to 25%.
//      Always visible 0.03 → 0.95 of scroll.
//
//   2. Cinematic stage overlays (centered top):
//      3 eyebrow overlays "STAGE 0X · THE DIAGNOSIS/PRESCRIPTION/OUTCOME"
//      fade in/out at the act-completion beats (derived from shieldMotion.ts
//      constants — no new choreography). Letter-spacing + gold underline
//      draw-in left→right, fades with smoothstep.
//
// rAF + direct DOM writes for per-frame visuals (no React state in hot path
// — matches the existing captionState() pattern in shieldMotion.ts).

interface StageProgressProps {
  scrollProgressRef: RefObject<number>;
  reducedMotion: boolean;
  viewportWidth: number;
}

interface Stage {
  idx: "01" | "02" | "03";
  name: "DIAGNOSIS" | "PRESCRIPTION" | "OUTCOME";
  accent: string;
}

const STAGES: ReadonlyArray<Stage> = [
  { idx: "01", name: "DIAGNOSIS",    accent: "var(--accent-copper)" },
  { idx: "02", name: "PRESCRIPTION", accent: "var(--accent-teal)"   },
  { idx: "03", name: "OUTCOME",      accent: "var(--accent-copper)" },
];

// Overlay windows: [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd].
// Derived from shieldMotion.ts so each stage title surfaces BEFORE its act's
// first callout enters and clears while the callout still holds.
//
// For act `a` (0=problem, 1=solution, 2=result):
//   fadeInStart  = SEQ_START + (2a)   * HEX_WINDOW                  (hex 2a locks)
//   fadeInEnd    = fadeInStart + 0.06                              (quick fade-in)
//   fadeOutStart = SEQ_START + (2a)   * HEX_WINDOW + LABEL_END*HW   (just before callout #2a+1 enters)
//   fadeOutEnd   = fadeOutStart + 0.04
// This keeps the title fully visible during the diagnosis→callout handoff
// rather than letting the callout outshine a faint title.
function overlayWindowForAct(act: 0 | 1 | 2): readonly [number, number, number, number] {
  const fiS = SEQ_START + (2 * act) * HEX_WINDOW;
  const fiE = fiS + 0.06;
  const foS = fiS + LABEL_END * HEX_WINDOW;
  const foE = foS + 0.04;
  return [fiS, fiE, foS, foE];
}
const OVERLAY_WINDOWS: ReadonlyArray<readonly [number, number, number, number]> = [
  overlayWindowForAct(0),
  overlayWindowForAct(1),
  overlayWindowForAct(2),
];

// Rail active-state crossfade windows (stage N → N+1).
const RAIL_TRANSITIONS: ReadonlyArray<readonly [number, number]> = [
  [0.30, 0.36],
  [0.60, 0.66],
];

const RAIL_VISIBLE_START = 0.03;
const RAIL_VISIBLE_END   = 0.95;

function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

function overlayOpacity(
  p: number,
  [fiS, fiE, foS, foE]: readonly [number, number, number, number],
): number {
  if (p < fiS || p >= foE) return 0;
  if (p < fiE) return smoothstep((p - fiS) / (fiE - fiS));
  if (p < foS) return 1;
  return 1 - smoothstep((p - foS) / (foE - foS));
}

function stageIntensity(stageIdx: 0 | 1 | 2, p: number): number {
  if (stageIdx === 0) {
    const [s, e] = RAIL_TRANSITIONS[0];
    if (p < s) return 1;
    if (p < e) return 1 - smoothstep((p - s) / (e - s));
    return 0;
  }
  if (stageIdx === 1) {
    const [_s0, e0] = RAIL_TRANSITIONS[0];
    const [s1, e1] = RAIL_TRANSITIONS[1];
    if (p < e0) return 0;
    if (p < s1) return 1;
    if (p < e1) return 1 - smoothstep((p - s1) / (e1 - s1));
    return 0;
  }
  // stageIdx === 2
  const [_s1, e1] = RAIL_TRANSITIONS[1];
  if (p < e1) return 0;
  return 1;
}

export default function StageProgress({
  scrollProgressRef,
  reducedMotion,
  viewportWidth,
}: StageProgressProps) {
  const railRef        = useRef<HTMLDivElement>(null);
  const overlayRefs    = useRef<Array<HTMLDivElement | null>>([null, null, null]);
  const underlineRefs  = useRef<Array<HTMLDivElement | null>>([null, null, null]);
  const dotRefs        = useRef<Array<HTMLDivElement | null>>([null, null, null]);
  const labelRefs      = useRef<Array<HTMLDivElement | null>>([null, null, null]);

  useEffect(() => {
    if (reducedMotion) {
      // Static fallback: rail fully visible, overlays hidden (no scroll = no beat).
      if (railRef.current) railRef.current.style.opacity = "1";
      for (let i = 0; i < 3; i++) {
        if (overlayRefs.current[i])   overlayRefs.current[i]!.style.opacity   = "0";
        if (underlineRefs.current[i]) underlineRefs.current[i]!.style.transform = "scaleX(1)";
        if (dotRefs.current[i]) {
          dotRefs.current[i]!.style.opacity    = "0.7";
          dotRefs.current[i]!.style.transform  = "translate(-50%, -50%) scale(1)";
        }
        if (labelRefs.current[i]) {
          labelRefs.current[i]!.style.opacity   = "1";
          labelRefs.current[i]!.style.transform = "translateX(0)";
        }
      }
      return;
    }

    let raf = 0;
    const tick = () => {
      const p = scrollProgressRef.current ?? 0;

      // Rail overall visibility — fades in just after SEQ_START, out just before FINALE_AT.
      if (railRef.current) {
        const inWindow = p >= RAIL_VISIBLE_START && p <= RAIL_VISIBLE_END;
        const fadeIn   = smoothstep((p - RAIL_VISIBLE_START) / 0.04);
        const fadeOut  = smoothstep((RAIL_VISIBLE_END - p) / 0.02);
        const op       = inWindow ? Math.min(fadeIn, fadeOut) : 0;
        railRef.current.style.opacity = String(op);
      }

      // Stage overlays — opacity + tiny upward drift + underline scaleX.
      for (let i = 0; i < 3; i++) {
        const op = overlayOpacity(p, OVERLAY_WINDOWS[i]);
        const el = overlayRefs.current[i];
        if (el) {
          el.style.opacity = String(op);
          el.style.transform = `translateX(-50%) translateY(${((1 - op) * 12).toFixed(2)}px)`;
        }
        const ul = underlineRefs.current[i];
        if (ul) ul.style.transform = `scaleX(${op.toFixed(3)})`;
      }

      // Rail dots + labels — per-stage intensity (0..1) drives scale + opacity.
      for (let i = 0; i < 3; i++) {
        const intensity = stageIntensity(i as 0 | 1 | 2, p);
        const dot = dotRefs.current[i];
        if (dot) {
          dot.style.opacity   = String(0.25 + 0.75 * intensity);
          dot.style.transform = `translate(-50%, -50%) scale(${(1 + 0.18 * intensity).toFixed(3)})`;
        }
        const label = labelRefs.current[i];
        if (label) {
          label.style.opacity   = String(0.4 + 0.6 * intensity);
          label.style.transform = `translateX(${((1 - intensity) * -6).toFixed(2)}px)`;
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, scrollProgressRef]);

  const showRail = viewportWidth >= 768;

  return (
    <>
      {/* Side rail (left edge, desktop only) */}
      {showRail && (
        <div
          ref={railRef}
          aria-hidden
          style={{
            position: "absolute",
            left: "clamp(16px, 2.5vw, 32px)",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 3,
          }}
        >
          {/* Faint vertical connector threading the 3 dots. */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              top: "5px",
              bottom: "5px",
              width: 1,
              background:
                "linear-gradient(to bottom, rgba(244,241,234,0.05), rgba(244,241,234,0.18), rgba(244,241,234,0.05))",
              transform: "translateX(-50%)",
              pointerEvents: "none",
            }}
          />
          {STAGES.map((s, i) => (
            <div
              key={s.idx}
              style={{ position: "relative", height: 10, display: "flex", alignItems: "center" }}
            >
              <div
                ref={(el) => { dotRefs.current[i] = el; }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: s.accent,
                  boxShadow: `0 0 6px ${s.accent}, 0 0 14px ${s.accent}60`,
                  transform: "translate(-50%, -50%) scale(1)",
                  opacity: 0.25,
                  willChange: "transform, opacity",
                }}
              />
              <div
                ref={(el) => { labelRefs.current[i] = el; }}
                style={{
                  marginLeft: "20px",
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  color: "var(--text-primary)",
                  whiteSpace: "nowrap",
                  opacity: 0.4,
                  transform: "translateX(-6px)",
                  willChange: "transform, opacity",
                }}
              >
                [{s.idx}] {s.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stage overlays (centered top) */}
      {STAGES.map((s, i) => (
        <div
          key={s.idx}
          ref={(el) => { overlayRefs.current[i] = el; }}
          aria-hidden
          style={{
            position: "absolute",
            top: "12%",
            left: "50%",
            transform: "translateX(-50%) translateY(12px)",
            textAlign: "center",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 3,
            width: "min(90vw, 520px)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              fontSize: "clamp(0.7rem, 0.95vw, 0.85rem)",
              fontWeight: 700,
              letterSpacing: "0.34em",
              color: s.accent,
              margin: 0,
              textShadow: `0 0 14px ${s.accent}80`,
              textTransform: "uppercase",
            }}
          >
            STAGE {s.idx}
          </p>
          <p
            style={{
              fontFamily: "var(--font-fraunces, Georgia, serif)",
              fontSize: "clamp(1.5rem, 2.6vw, 2.25rem)",
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: "var(--text-primary)",
              margin: "0.45rem 0 0",
              textTransform: "uppercase",
            }}
          >
            THE {s.name}
          </p>
          <div
            ref={(el) => { underlineRefs.current[i] = el; }}
            style={{
              marginTop: "14px",
              marginLeft: "auto",
              marginRight: "auto",
              width: "clamp(80px, 14vw, 160px)",
              height: 1,
              background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)`,
              transformOrigin: "left center",
              transform: "scaleX(0)",
              boxShadow: `0 0 6px ${s.accent}60`,
              willChange: "transform",
            }}
          />
        </div>
      ))}
    </>
  );
}
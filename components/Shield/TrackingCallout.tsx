"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { captionState } from "./shieldMotion";
import { GOLD } from "./complianceData";

type Side = "left" | "right" | "up" | "down";

interface CalloutData {
  badge: string;
  title: string;
  body: string;
  cta: string;
  side: Side;
  accent: string;
}

export interface TrackingCalloutProps {
  tileIndex: number;
  scrollProgressRef: React.RefObject<number>;
  reducedMotion: boolean;
  viewportWidth: number;
  callout?: CalloutData;
}

/**
 * TrackingCallout — anchored at the hex's screen-center (Html position=[0,0,0]).
 * Renders a gold glassmorphism SVG connector line that draws in from the hex center
 * to the callout card, a pulsing dot at the hex center, and a dot where the line
 * meets the card edge. The PNG background is a clean glass panel (no built-in pin).
 */
export default function TrackingCallout({
  tileIndex,
  scrollProgressRef,
  reducedMotion,
  viewportWidth,
  callout,
}: TrackingCalloutProps) {
  const calloutRef  = useRef<HTMLDivElement>(null);
  const cardRef     = useRef<HTMLDivElement>(null);
  const mainLineRef = useRef<SVGLineElement | null>(null);
  const glowLineRef = useRef<SVGLineElement | null>(null);
  const hexDotRef   = useRef<HTMLSpanElement | null>(null);
  const cardDotRef  = useRef<HTMLSpanElement | null>(null);

  const side   = callout?.side ?? "right";
  const accent = callout?.accent ?? GOLD;

  // HOFF: connector length from hex center to card edge (px).
  // ShieldFrame reaches ±2.2 world units; shoulder/flank hexes sit at ±0.81 world.
  // Axis hexes (4/5) are at x=0 so they need more reach to clear the frame edge.
  const isRightSide = side === "right";
  const isAxisHex = tileIndex === 4 || tileIndex === 5;
  const HOFF = isRightSide
    ? (isAxisHex
        ? Math.min(440, Math.max(340, viewportWidth * 0.235))
        : Math.min(320, Math.max(240, viewportWidth * 0.167)))
    : (isAxisHex
        ? Math.min(400, Math.max(310, viewportWidth * 0.200))
        : Math.min(300, Math.max(220, viewportWidth * 0.155)));
  const VOFF = 90;
  const lineLen = side === "left" || side === "right" ? HOFF : VOFF;

  // SVG layout constants
  const PAD = 10; // glow breathing room around the line endpoints

  // SVG size and CSS position anchor (all sides put hex-center at the "source" end)
  const isH = side === "left" || side === "right";
  const svgW = isH ? lineLen + PAD * 2 : PAD * 2;
  const svgH = isH ? PAD * 2           : lineLen + PAD * 2;

  // Line endpoints in SVG local coords (hex-center = source, card = dest)
  // Convention: source first so strokeDashoffset draws outward from hex center.
  const pts: Record<Side, [number, number, number, number]> = {
    right: [PAD,            PAD, lineLen + PAD, PAD],           // left→right
    left:  [lineLen + PAD,  PAD, PAD,           PAD],           // right→left
    up:    [PAD, lineLen + PAD,  PAD,           PAD],           // bottom→top
    down:  [PAD,            PAD, PAD,  lineLen + PAD],          // top→bottom
  };
  const [x1, y1, x2, y2] = pts[side];

  // SVG absolutely positioned so its source-end aligns with hex center (0,0).
  // Using negative offsets to extend the SVG slightly past center for the glow dot.
  const svgAnchor: React.CSSProperties = {
    right:  [PAD + (isH && side === "left"  ? 0 : svgW - PAD)][0],
    bottom: [PAD + (!isH && side === "up"   ? 0 : svgH - PAD)][0],
  };
  // Cleaner approach per side:
  const svgStyle: React.CSSProperties = (() => {
    const base: React.CSSProperties = { position: "absolute", overflow: "visible", pointerEvents: "none" };
    if (side === "right") return { ...base, left: -PAD,  top: -PAD };
    if (side === "left")  return { ...base, right: -PAD, top: -PAD };
    if (side === "up")    return { ...base, left: -PAD,  bottom: -PAD };
    /* down */            return { ...base, left: -PAD,  top: -PAD };
  })();

  // Card anchor: offset from hex center in the direction of `side`
  const cardAnchor: React.CSSProperties = (() => {
    const h = `${HOFF}px`, v = `${VOFF}px`;
    if (side === "right") return { left: h,    top: "50%", transform: "translateY(-50%)" };
    if (side === "left")  return { right: h,   top: "50%", transform: "translateY(-50%)" };
    if (side === "up")    return { bottom: v,  left: "50%", transform: "translateX(-50%)" };
    /* down */            return { top: v,     left: "50%", transform: "translateX(-50%)" };
  })();

  // Card-edge dot: sits at the junction where the connector meets the card
  const cardEdgeDot: React.CSSProperties = (() => {
    const h = `${HOFF - 5}px`, v = `${VOFF - 5}px`;
    if (side === "right") return { left: h,    top: "50%", transform: "translateY(-50%)" };
    if (side === "left")  return { right: h,   top: "50%", transform: "translateY(-50%)" };
    if (side === "up")    return { bottom: v,  left: "50%", transform: "translateX(-50%)" };
    /* down */            return { top: v,     left: "50%", transform: "translateX(-50%)" };
  })();

  // SVG gradient: bright gold at hex center → dim at card edge
  const gradId = `cg-${tileIndex}`;
  const gradProps = (() => {
    // gradientUnits="userSpaceOnUse" avoids zero-dimension bounding-box issues on lines
    if (side === "right") return { x1, y1, x2, y2 };
    if (side === "left")  return { x1, y1, x2, y2 };
    if (side === "up")    return { x1, y1, x2, y2 };
    /* down */            return { x1, y1, x2, y2 };
  })();

  // PNG background keyed to badge prefix
  const bgImage =
    callout?.badge?.startsWith("PROBLEM")  ? "/red.png"
    : callout?.badge?.startsWith("SOLUTION") ? "/green%20(2).png"
    : "/gold%20(2).png";

  useFrame(() => {
    if (!callout) return;
    const p  = scrollProgressRef.current ?? 0;
    const cs = reducedMotion
      ? { opacity: 0, type: 0, dy: 0, blur: 0, scale: 1 }
      : captionState(tileIndex, p);

    // ── Wrapper opacity (card + dot + SVG all fade together) ────────────
    if (calloutRef.current) calloutRef.current.style.opacity = String(cs.opacity);

    // ── Card transform + typewriter ─────────────────────────────────────
    if (cardRef.current && cs.opacity > 0) {
      cardRef.current.style.transform =
        `translateY(${cs.dy.toFixed(2)}px) scale(${cs.scale.toFixed(3)})`;
      cardRef.current.style.filter =
        cs.blur > 0.01 ? `blur(${cs.blur.toFixed(2)}px)` : "none";
      const titleEl = cardRef.current.querySelector(".callout-title") as HTMLElement | null;
      const bodyEl  = cardRef.current.querySelector(".callout-body")  as HTMLElement | null;
      if (titleEl) titleEl.textContent = callout.title.slice(0, Math.ceil(cs.type * callout.title.length));
      if (bodyEl)  bodyEl.textContent  = callout.body.slice(0,  Math.ceil(cs.type * callout.body.length));
    }

    // ── Connector draw-in: faster ramp than card opacity ────────────────
    const drawProg = Math.min(1, cs.opacity * 2.5);
    const dash     = String(lineLen * (1 - drawProg));
    if (mainLineRef.current) mainLineRef.current.setAttribute("stroke-dashoffset", dash);
    if (glowLineRef.current) glowLineRef.current.setAttribute("stroke-dashoffset", dash);

    // ── Hex-center dot: continuous pulse when visible ───────────────────
    if (hexDotRef.current && cs.opacity > 0.01) {
      const pulse = 0.55 + 0.45 * Math.sin(Date.now() * 0.0042);
      const r1 = (7  + 5  * pulse).toFixed(1);
      const r2 = (14 + 8  * pulse).toFixed(1);
      hexDotRef.current.style.boxShadow =
        `0 0 ${r1}px ${accent}, 0 0 ${r2}px ${accent}55`;
    }

    // ── Card-edge dot: snaps in after line finishes drawing ─────────────
    if (cardDotRef.current) {
      cardDotRef.current.style.opacity = String(Math.min(1, cs.opacity * 4));
    }
  });

  const showDesktop = callout && viewportWidth >= 600;

  return (
    <Html
      position={[0, 0, 0]}
      style={{ overflow: "visible", pointerEvents: "none", userSelect: "none" }}
      zIndexRange={[10, 0]}
    >
      <div
        ref={calloutRef}
        style={{ opacity: 0, position: "relative", width: 0, height: 0 }}
      >

        {/* ── Hex-center pulsing dot ──────────────────────────────────── */}
        <span
          ref={hexDotRef}
          style={{
            position: "absolute",
            width: 10, height: 10,
            borderRadius: "50%",
            background: `radial-gradient(circle, #fff 0%, ${accent} 45%, ${accent}90 100%)`,
            boxShadow: `0 0 8px ${accent}, 0 0 18px ${accent}60`,
            transform: "translate(-50%, -50%)",
            zIndex: 4,
          }}
        />

        {/* ── Gold glassmorphism SVG connector ───────────────────────── */}
        {showDesktop && (
          <svg
            width={svgW}
            height={svgH}
            viewBox={`0 0 ${svgW} ${svgH}`}
            style={svgStyle}
          >
            <defs>
              <linearGradient
                id={gradId}
                gradientUnits="userSpaceOnUse"
                x1={gradProps.x1} y1={gradProps.y1}
                x2={gradProps.x2} y2={gradProps.y2}
              >
                <stop offset="0%"   stopColor={accent} stopOpacity="1"   />
                <stop offset="55%"  stopColor={accent} stopOpacity="0.65"/>
                <stop offset="100%" stopColor={accent} stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Outer glow layer — wide, low-opacity */}
            <line
              ref={glowLineRef as React.Ref<SVGLineElement>}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={accent}
              strokeWidth="7"
              strokeOpacity="0.15"
              strokeLinecap="round"
              strokeDasharray={String(lineLen)}
              strokeDashoffset={String(lineLen)}
            />
            {/* Main crisp line */}
            <line
              ref={mainLineRef as React.Ref<SVGLineElement>}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={`url(#${gradId})`}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={String(lineLen)}
              strokeDashoffset={String(lineLen)}
              style={{ filter: `drop-shadow(0 0 2px ${accent})` }}
            />
          </svg>
        )}

        {/* ── Card-edge connection dot ────────────────────────────────── */}
        {showDesktop && (
          <span
            ref={cardDotRef}
            style={{
              position: "absolute",
              ...cardEdgeDot,
              width: 6, height: 6,
              borderRadius: "50%",
              background: accent,
              boxShadow: `0 0 6px ${accent}, 0 0 12px ${accent}60`,
              zIndex: 4,
              opacity: 0,
            }}
          />
        )}

        {/* ── Callout card ────────────────────────────────────────────── */}
        {showDesktop && (
          <div style={{ position: "absolute", ...cardAnchor }}>
            <div
              ref={cardRef}
              style={{
                position: "relative",
                width: "clamp(290px, 22vw, 370px)",
                background: "rgba(8, 11, 17, 0.88)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: `1px solid ${accent}50`,
                borderRadius: "8px",
                boxShadow: `0 0 28px ${accent}14, inset 0 1px 0 ${accent}22`,
                overflow: "hidden",
                transformOrigin: "center",
                willChange: "transform, filter",
              }}
            >
              {/* Text layer */}
              <div style={{ position: "relative", padding: "1.25rem 1.75rem 1.4rem 2rem" }}>
                <p style={{
                  fontFamily: "var(--font-mono,'JetBrains Mono',monospace)",
                  fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em",
                  color: accent, margin: "0 0 0.45rem",
                }}>
                  [{callout.badge}]
                </p>

                <p className="callout-title" style={{
                  fontFamily: "var(--font-fraunces,Georgia,serif)",
                  fontSize: "clamp(1.25rem,1.55vw,1.5rem)", fontWeight: 600,
                  color: "rgba(244,241,234,0.95)", lineHeight: 1.25,
                  margin: "0 0 0.45rem", minHeight: "1.25em",
                }} />

                <p className="callout-body" style={{
                  fontFamily: "var(--font-inter,sans-serif)",
                  fontSize: "clamp(0.93rem,1.05vw,1.05rem)",
                  color: "rgba(244,241,234,0.72)", lineHeight: 1.6,
                  margin: "0 0 0.7rem", minHeight: "2.4em",
                }} />

                <a href="#contact" style={{
                  display: "inline-block",
                  pointerEvents: "auto",
                  fontFamily: "var(--font-mono,'JetBrains Mono',monospace)",
                  fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em",
                  textTransform: "uppercase", color: accent, textDecoration: "none",
                }}>
                  {callout.cta}
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </Html>
  );
}

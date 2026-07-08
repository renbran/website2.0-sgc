"use client";

import { useRef, type RefObject, useMemo } from "react";
import * as THREE from "three";
import { Points, PointMaterial } from "@react-three/drei";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import LogoHex from "./LogoHex";
import FillerMesh from "./FillerMesh";
import FinaleGlow from "./FinaleGlow";
import GoldDustBurst from "./GoldDustBurst";
import HexTile from "./HexTile";
import ShieldFrame from "./ShieldFrame";
import {
  GOLD,
  STAGE_COLORS,
  type Stage,
} from "./complianceData";
import {
  captionState,
  activeCaptionIndex,
  responsiveScale,
  CLUSTER_SCALE,
  IMPACT_AT,
  SHAKE_DURATION,
  shakeOffset,
  punchScale,
} from "./shieldMotion";

interface ShieldSceneProps {
  isFinale?: boolean; // true when finale sequence starts
  scrollProgressRef: RefObject<number>;
  reducedMotion: boolean;
  viewportWidth: number;
  onFinaleEnd?: () => void;
  onFinaleTitleStart?: () => void;
}

// ─── NARRATIVE HEXES — EDIT ALL COPY HERE ──────────────────────────────
// 9 hexes around the center logo, grouped by stage. Order is fixed to the
// lattice positions in shieldMotion.ts → TILE_LOCK_POS (P1,P2,P3 / S1,S2,S3 /
// R1,R2,R3). `label` is the sharp white text on the hex (may wrap to 2 lines).
// Each callout reveals one-at-a-time, scroll-paced (see captionState); the
// caption fades in + types out → holds → fades out before the next hex begins.
// `side` opens the card away from center.

interface NarrativeHex {
  stage: Stage;
  label: string;        // text on the hex
  badge: string;        // callout eyebrow
  body: string;         // callout supporting line
  cta: string;          // call to action
  side: "left" | "right" | "up" | "down"; // card direction (center hexes use up/down → no overlap)
}

const CTA = "Book Discovery Call →";

// ORDER MUST MATCH shieldMotion.ts → TILE_LOCK_POS (index = lattice slot):
//   0 upper-left shoulder · 1 upper-right shoulder · 2 lower-left flank
//   3 lower-right flank · 4 top crest · 5 bottom point
// Locked hourglass: Connected=crest, Scattered=UL, At Risk=UR,
// Unified=LL, Automated=LR, Audit-Ready=point.
const NARRATIVE_HEXES: NarrativeHex[] = [
  { stage: "problem",  label: "Scattered",   badge: "PROBLEM",  body: "Data spread across disconnected tools — no single source of truth.", cta: CTA, side: "left"  }, // 0 upper-left
  { stage: "problem",  label: "At Risk",     badge: "PROBLEM",  body: "VAT, tax and ESR gaps surface too late to fix cheaply.",             cta: CTA, side: "right" }, // 1 upper-right
  { stage: "solution", label: "Unified",     badge: "SOLUTION", body: "One Odoo core — every function on the same connected data.",         cta: CTA, side: "left"  }, // 2 lower-left
  { stage: "solution", label: "Automated",   badge: "SOLUTION", body: "Approvals and posting run on rules, with a clear audit trail.",       cta: CTA, side: "right" }, // 3 lower-right
  { stage: "result",   label: "Connected",   badge: "RESULT",   body: "Finance, ops and compliance move as a single connected system.",      cta: CTA, side: "right" }, // 4 top crest
  { stage: "result",   label: "Audit-Ready", badge: "RESULT",   body: "Books and filings stand up to scrutiny on any given day.",            cta: CTA, side: "left"  }, // 5 bottom point
];

const TILE_CALLOUTS = NARRATIVE_HEXES.map((h) => ({
  badge: h.badge,
  title: h.label,
  body: h.body,
  cta: h.cta,
  side: h.side,
  accent: STAGE_COLORS[h.stage],
}));

function GoldDustParticles() {
  const particles = useRef<THREE.Points>(null!);
  // generate modest number of particles within shield radius
  const count = 200;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 4.5; // within glow radius
      const theta = Math.random() * Math.PI * 2;
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = (Math.random() - 0.5) * 0.2;
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, []);

  return (
    <points ref={particles} frustumCulled={false}>
      <bufferGeometry attach='geometry'>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <PointMaterial
        transparent
        color={GOLD}
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </points>
  );
}

function DepthOfFieldEffect() {
  // Reduce blur to keep shield and labels sharp; background only.
  return (
    <EffectComposer multisampling={4}>
      <DepthOfField focusDistance={0.5} focalLength={0.02} bokehScale={0.1} height={480} />
    </EffectComposer>
  );
}

export default function ShieldScene({ scrollProgressRef, reducedMotion, viewportWidth, isFinale = false, onFinaleEnd, onFinaleTitleStart }: ShieldSceneProps) {
  // Mobile caption band: one shared card below the shield showing the active
  // callout (highest opacity). Replaces per-tile cards on narrow screens.
  // Suppressed in reduced motion (<600px shows hex labels only).
  const showBand = viewportWidth < 600 && !reducedMotion;
  const bandRef = useRef<HTMLDivElement>(null);
  const bandTickRef = useRef<HTMLSpanElement>(null);
  const bandBadgeRef = useRef<HTMLParagraphElement>(null);
  const bandTitleRef = useRef<HTMLParagraphElement>(null);
  const bandBodyRef = useRef<HTMLParagraphElement>(null);

  const finaleGroupRef = useRef<THREE.Group>(null!);
  const finaleAngleRef = useRef(0);
  const finaleProgressRef = useRef(0);
  const onFinaleEndCalledRef = useRef(false);
  const titleStartCalledRef = useRef(false);
  const shakeFiredRef = useRef(false);
  const shakeElapsedRef = useRef(-1);
  const SPIN_DURATION = 3.0; // seconds for full cinematic ease-in-out 360°

  // Drive the mobile caption band — the SINGLE active hex's caption, revealed
  // one-at-a-time with the same scroll-paced typewriter + cinematic fade as the
  // desktop cards (color-coded red / green / gold).
  useFrame(() => {
    if (!showBand || !bandRef.current) return;
    const p = scrollProgressRef.current ?? 0;
    const idx = activeCaptionIndex(p);
    const c = NARRATIVE_HEXES[idx];
    const accent = STAGE_COLORS[c.stage];
    const cs = captionState(idx, p);

    bandRef.current.style.opacity = String(cs.opacity);
    bandRef.current.style.transform = `translateX(-50%) translateY(${cs.dy.toFixed(2)}px)`;
    bandRef.current.style.filter = cs.blur > 0.01 ? `blur(${cs.blur.toFixed(2)}px)` : "none";
    bandRef.current.style.borderColor = `${accent}77`;
    bandRef.current.style.boxShadow = `0 0 28px ${accent}2e, inset 0 1px 0 ${accent}2e`;
    if (bandTickRef.current) bandTickRef.current.style.borderBottomColor = accent;
    if (bandBadgeRef.current) {
      bandBadgeRef.current.textContent = `[${c.badge}]`;
      bandBadgeRef.current.style.color = accent;
    }
    const nT = Math.ceil(cs.type * c.label.length);
    const nB = Math.ceil(cs.type * c.body.length);
    if (bandTitleRef.current) bandTitleRef.current.textContent = c.label.slice(0, nT);
    if (bandBodyRef.current) bandBodyRef.current.textContent = c.body.slice(0, nB);
  });

  // Finale 360° Y-axis rotation with cinematic ease-in-out (forward and reverse)
  useFrame((_, delta) => {
    if (!finaleGroupRef.current) return;

    // Forward spin when entering finale (non‑reduced motion)
    if (isFinale && !reducedMotion) {
      finaleProgressRef.current = Math.min(finaleProgressRef.current + delta / SPIN_DURATION, 1);
    } else if (!isFinale && !reducedMotion && finaleProgressRef.current > 0) {
      // Reverse spin when exiting finale – unwind smoothly
      finaleProgressRef.current = Math.max(finaleProgressRef.current - delta / SPIN_DURATION, 0);
    } else if (isFinale && reducedMotion) {
      // Reduced motion: skip animation, jump to end state
      finaleProgressRef.current = 1;
    }

    const ft = finaleProgressRef.current;
    const ftEased = ft * ft * (3 - 2 * ft);
    finaleAngleRef.current = ftEased * Math.PI * 2;
    finaleGroupRef.current.rotation.y = finaleAngleRef.current;

    // Launch title when the shield is mostly settled (ft≈0.85)
    if (ft >= 0.85 && !titleStartCalledRef.current) {
      titleStartCalledRef.current = true;
      onFinaleTitleStart?.();
    }
    // Forward Lenis unlock once spin completes (only once per forward spin)
    if (ft >= 1.0 && isFinale && !onFinaleEndCalledRef.current) {
      onFinaleEndCalledRef.current = true;
      onFinaleEnd?.();
    }
    // Reset flags when spin fully rewinds (or on exit)
    if (ft <= 0 && !isFinale) {
      titleStartCalledRef.current = false;
      onFinaleEndCalledRef.current = false;
    }

    // Impact shake — the shield "lands" into its settlement slot just before
    // the spin finishes (IMPACT_AT), like a stone striking water: a brief
    // jolt that rings down, paired with GoldDustBurst's splash below.
    if (isFinale && !reducedMotion) {
      if (ft >= IMPACT_AT && !shakeFiredRef.current) {
        shakeFiredRef.current = true;
        shakeElapsedRef.current = 0;
      }
    } else if (!isFinale) {
      shakeFiredRef.current = false;
      shakeElapsedRef.current = -1;
    }

    if (shakeElapsedRef.current >= 0) {
      shakeElapsedRef.current += delta;
      const off = shakeOffset(shakeElapsedRef.current);
      finaleGroupRef.current.position.set(off, off * 0.6, 0);
      finaleGroupRef.current.scale.setScalar(punchScale(shakeElapsedRef.current));
      if (shakeElapsedRef.current >= SHAKE_DURATION) {
        shakeElapsedRef.current = -1;
        finaleGroupRef.current.position.set(0, 0, 0);
        finaleGroupRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      {/* warm key light (top‑front) — gives the gold bevels their glint */}
      <directionalLight position={[3, 6, 8]} intensity={1.0} color="#FFF1DA" />
      {/* gold rim light from behind — edge separation */}
      <directionalLight position={[-4, 2, -6]} intensity={0.6} color={GOLD} />
      {/* cool fill so the navy glass keeps depth on the shadow side */}
      <pointLight position={[-5, 3, 4]} color={GOLD} intensity={0.9} distance={16} decay={2} />
      <pointLight position={[ 5, -3, 4]} color="#6FA8C3" intensity={0.7} distance={16} decay={2} />
      <directionalLight position={[0, 0, 6]} intensity={0.3} color={GOLD} />
      {/* Gold‑dust particles – desktop only */}
      {viewportWidth >= 768 && <GoldDustParticles />}
      {/* Depth‑of‑field – desktop only */}
      {viewportWidth >= 768 && <DepthOfFieldEffect />}

      {/* Impact splash — radial gold-dust burst on shield "landing" (IMPACT_AT) */}
      {viewportWidth >= 768 && (
        <GoldDustBurst isFinale={isFinale} reducedMotion={reducedMotion} finaleProgressRef={finaleProgressRef} />
      )}

      {/* Finale glow rings — world-space pulse triggered at ft=0.85/0.87/0.89 */}
      <FinaleGlow isFinale={isFinale} reducedMotion={reducedMotion} finaleProgressRef={finaleProgressRef} />

      {/* Rotation group — frame + cluster spin together during finale */}
      <group ref={finaleGroupRef}>
        <ShieldFrame scrollProgressRef={scrollProgressRef} reducedMotion={reducedMotion} viewportWidth={viewportWidth} />
        <group scale={CLUSTER_SCALE * responsiveScale(viewportWidth)}>
          <LogoHex finaleAngleRef={finaleAngleRef} />
          <FillerMesh
            scrollProgressRef={scrollProgressRef}
            reducedMotion={reducedMotion}
            isFinale={isFinale}
            finaleAngleRef={finaleAngleRef}
            viewportWidth={viewportWidth}
          />
          {TILE_CALLOUTS.map((callout, i) => (
            <HexTile
              key={i}
              tileIndex={i}
              label={callout.title}
              scrollProgressRef={scrollProgressRef}
              reducedMotion={reducedMotion}
              viewportWidth={viewportWidth}
              callout={callout}
              finaleAngleRef={finaleAngleRef}
            />
          ))}
        </group>
      </group>

      {showBand && (
        <Html
          position={[0, -2.4, 0]}
          style={{ pointerEvents: "none", userSelect: "none" }}
          zIndexRange={[20, 0]}
        >
          <div
            ref={bandRef}
            style={{
              opacity: 0,
              width: "clamp(248px, 90vw, 360px)",
              transform: "translateX(-50%)",
              transformOrigin: "center top",
              willChange: "transform, filter, opacity",
              position: "relative",
              border: `1px solid ${GOLD}77`,
              borderRadius: "4px",
              padding: "1rem 1.15rem 1.1rem",
              background: "rgba(8, 11, 17, 0.94)",
              backdropFilter: "blur(14px)",
              boxShadow: `0 0 28px ${GOLD}2e, inset 0 1px 0 ${GOLD}2e`,
            }}
          >
            {/* up-leader tick pointing toward the active hex */}
            <span ref={bandTickRef} style={{
              position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)",
              width: 0, height: 0,
              borderLeft: "7px solid transparent",
              borderRight: "7px solid transparent",
              borderBottom: `9px solid ${GOLD}`,
            }} />
            <p ref={bandBadgeRef} style={{ fontFamily: "var(--font-mono,'JetBrains Mono',monospace)", fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.22em", color: GOLD, marginBottom: "0.45rem" }} />
            <p ref={bandTitleRef} style={{ fontFamily: "var(--font-fraunces,Georgia,serif)", fontSize: "1.28rem", fontWeight: 600, color: "#F8F5EE", lineHeight: 1.28, marginBottom: "0.4rem", minHeight: "1.28em" }} />
            <p ref={bandBodyRef} style={{ fontFamily: "var(--font-inter,sans-serif)", fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.55, minHeight: "2.3em" }} />
          </div>
        </Html>
      )}
    </>
  );
}

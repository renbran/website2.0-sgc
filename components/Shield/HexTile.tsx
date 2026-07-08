"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import TrackingCallout from "./TrackingCallout";
import * as THREE from "three";
import {
  tileProgress,
  captionState,
  labelProgress,
  activeCaptionIndex,
  ORIGIN_OFFSETS,
  DORMANT_OPACITY,
  TILE_LOCK_POS,
  HEX_RADIUS,
  HEX_WINDOW,
  TRAVEL_END,
  ACT_OF,
  actCompletesAt,
  hexWindow,
  hexShakeOffset,
  hexPunchScale,
  hexBurstRadius,
  hexBurstOpacity,
} from "./shieldMotion";
import { GOLD } from "./complianceData";

// ─── Extruded hex tile geometry (built once, shared by all tiles) ──────
function makeHexShape(r: number): THREE.Shape {
  const s = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    const x = r * Math.cos(a);
    const y = r * Math.sin(a);
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  s.closePath();
  return s;
}
const HEX_SHAPE = makeHexShape(HEX_RADIUS * 0.92);
function makeTileGeo(depth: number, bevel: number, seg: number) {
  const g = new THREE.ExtrudeGeometry(HEX_SHAPE, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: seg,
    steps: 1,
  });
  g.center();
  return g;
}
const TILE_GEO = makeTileGeo(0.18, 0.07, 2);
const TILE_GEO_MOBILE = makeTileGeo(0.12, 0.05, 1);

// Mild overshoot-and-settle for the lock-in
function easeOutBack(t: number): number {
  const c1 = 0.9;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

type Side = "left" | "right" | "up" | "down";

interface HexTileCallout {
  badge: string;
  title: string;
  body: string;
  cta: string;
  side: Side;
  accent: string;
}

interface HexTileProps {
  tileIndex: number;
  label: string;
  scrollProgressRef: RefObject<number>;
  reducedMotion: boolean;
  viewportWidth: number;
  callout?: HexTileCallout;
  finaleAngleRef?: React.RefObject<number>;
}

function startOutside(tileIndex: number): THREE.Vector3 {
  const [x, y, z] = ORIGIN_OFFSETS[tileIndex];
  return new THREE.Vector3(x, y, z);
}

export default function HexTile({
  tileIndex,
  label,
  scrollProgressRef,
  reducedMotion,
  viewportWidth,
  callout,
  finaleAngleRef,
}: HexTileProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const goldMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const innerMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const burstRef = useRef<THREE.Points>(null);
  const burstMatRef = useRef<THREE.PointsMaterial>(null);

  // Unit-sphere particle cloud for the lock-impact dust burst; the group
  // scale (hexBurstRadius) expands it outward from the hex centre.
  const burstPositions = useMemo(() => {
    const count = 28;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const rr = 0.7 + Math.random() * 0.4;
      arr[i * 3] = Math.sin(phi) * Math.cos(theta) * rr;
      arr[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * rr;
      arr[i * 3 + 2] = Math.cos(phi) * rr * 0.4;
    }
    return arr;
  }, []);

  // ── Rhythm beat refs ──────────────────────────────────────────────────
  const lockPulsedRef = useRef(false);      // latch: lock-pulse has fired
  const lockPulseTimeRef = useRef(-1);      // wall-clock ms when lock-pulse fired
  const breathFiredRef = useRef(false);     // latch: stage-breath has fired
  const breathPulseTimeRef = useRef(-1);    // wall-clock ms when breath fired

  const lockPos = TILE_LOCK_POS[tileIndex];
  const startPos = useRef(startOutside(tileIndex)).current;
  const progressFn = tileProgress[tileIndex];
  const myAct = ACT_OF[tileIndex];
  const actCompleteP = actCompletesAt(myAct);
  const [myWs] = hexWindow(tileIndex);

  useFrame(() => {
    if (!groupRef.current) return;
    const p = scrollProgressRef.current ?? 0;
    const t = reducedMotion ? 1 : progressFn(p);
    const settle = reducedMotion ? 1 : easeOutBack(t);

    // ── Position + scale ──────────────────────────────────────────────
    groupRef.current.position.lerpVectors(startPos, lockPos, settle);
    const s = 0.55 + 0.45 * settle;
    groupRef.current.scale.setScalar(s);

    // ── Beat A: pre-travel brighten ───────────────────────────────────
    // Hex glows slightly as scroll approaches within 0.4 windows of its start.
    const preApproach = THREE.MathUtils.clamp((p - (myWs - 0.4 * HEX_WINDOW)) / (0.4 * HEX_WINDOW), 0, 1);
    const preGlow = t > 0 ? 0 : preApproach * 0.35; // only before travel starts

    // ── Beat B: lock-pulse ────────────────────────────────────────────
    // Brief golden flash when hex reaches TRAVEL_END (locks into position).
    const f = (p - myWs) / HEX_WINDOW;
    if (!reducedMotion) {
      if (f >= TRAVEL_END && !lockPulsedRef.current) {
        lockPulsedRef.current = true;
        lockPulseTimeRef.current = Date.now();
      }
      if (f < TRAVEL_END - 0.05) {
        lockPulsedRef.current = false; // reset on scroll-back
        lockPulseTimeRef.current = -1;
      }
    }
    const pulseAge = lockPulseTimeRef.current > 0 ? (Date.now() - lockPulseTimeRef.current) / 1000 : Infinity;
    const lockPulse = reducedMotion ? 0 : Math.max(0, 1 - pulseAge / 0.6); // 600ms fade

    // ── Per-hex lock impact: shake + punch ────────────────────────────
    // Fires each time this hex locks into the shield (lockPulseTimeRef
    // latch above). Layered AFTER lerpVectors/setScalar since those
    // overwrite the transform every frame.
    if (!reducedMotion) {
      const shk = hexShakeOffset(pulseAge, tileIndex * 1.7);
      groupRef.current.position.x += shk;
      groupRef.current.position.y += shk * 0.6;
      groupRef.current.scale.setScalar(s * hexPunchScale(pulseAge));
    }

    // ── Per-hex gold-dust burst (desktop only) ────────────────────────
    if (burstRef.current && burstMatRef.current) {
      const op = reducedMotion ? 0 : hexBurstOpacity(pulseAge);
      burstMatRef.current.opacity = op;
      burstRef.current.visible = op > 0.01;
      const r = hexBurstRadius(pulseAge, 1.6);
      burstRef.current.scale.setScalar(Math.max(r, 0.001));
    }

    // ── Beat C: stage-breath ──────────────────────────────────────────
    // 1.5s glow on all hexes in the same act when the act completes.
    if (!reducedMotion) {
      if (p > actCompleteP && !breathFiredRef.current) {
        breathFiredRef.current = true;
        breathPulseTimeRef.current = Date.now();
      }
      if (p < actCompleteP - 0.02) {
        breathFiredRef.current = false;
        breathPulseTimeRef.current = -1;
      }
    }
    const breathAge = breathPulseTimeRef.current > 0 ? (Date.now() - breathPulseTimeRef.current) / 1000 : Infinity;
    const breathGlow = reducedMotion ? 0 : Math.max(0, 1 - breathAge / 1.5); // 1.5s fade

    // ── Combined glow intensity ───────────────────────────────────────
    const beatBoost = Math.max(preGlow, lockPulse * 0.8, breathGlow * 0.6);

    // ── Material opacity + emissive ───────────────────────────────────
    // Hexes materialise from nothing as they approach (sqrt ramp, starts at 0).
    const baseVis = Math.pow(t, 0.5);
    const vis = Math.min(1, baseVis + beatBoost * 0.4);
    if (innerMatRef.current) {
      innerMatRef.current.opacity = 0.82 * vis;
      innerMatRef.current.emissiveIntensity = 0.08 + t * 0.18 + beatBoost * 0.3;
    }
    if (goldMatRef.current) {
      goldMatRef.current.opacity = vis;
      goldMatRef.current.emissiveIntensity = 0.4 + t * 0.5 + beatBoost * 0.8;
    }

    // ── In-hex label ──────────────────────────────────────────────────
    // Visible at DORMANT_OPACITY from t=0 (scatter), then surfaces fully
    // after callout fades (labelProgress).
    if (labelRef.current) {
      const lp = reducedMotion ? 1 : labelProgress(tileIndex, p);
      // Label fades in after callout concludes (CFADE_END → 1.0 in window).
      const labelBase = lp;
      // Dim previously-visited hexes to 35% so the active callout dominates.
      const active = reducedMotion ? tileIndex : activeCaptionIndex(p);
      const cs = reducedMotion ? { opacity: 0 } : captionState(tileIndex, p);
      // During callout dwell, label dims to near-zero (callout + label disjoint by design,
      // but add explicit dim for in-progress hexes that haven't reached CFADE_END yet).
      const calloutDimming = cs.opacity > 0.1 ? (1 - cs.opacity) * 0.5 : 1;
      const dimFactor = lp < 0.05 ? 1 : (tileIndex === active ? 1.0 : 0.72);
      const angle = finaleAngleRef?.current ?? 0;
      const facingCamera = Math.cos(angle) > 0.15;
      labelRef.current.style.opacity = String(facingCamera ? labelBase * dimFactor * calloutDimming : 0);
    }
  });

  const tileGeo = viewportWidth < 768 ? TILE_GEO_MOBILE : TILE_GEO;
  const accent = callout?.accent ?? GOLD;
  const labelWords = label.trim().split(/[\s-]+/);

  return (
    <group ref={groupRef} position={[startPos.x, startPos.y, startPos.z]}>
      <mesh geometry={tileGeo}>
        <meshStandardMaterial
          ref={innerMatRef}
          attach="material-0"
          color="#0A1A2E"
          emissive="#1E4A6E"
          emissiveIntensity={0.1}
          metalness={0.3}
          roughness={0.22}
          transparent
          opacity={0}
        />
        <meshStandardMaterial
          ref={goldMatRef}
          attach="material-1"
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.28}
          transparent
          opacity={0}
        />
      </mesh>

      <TrackingCallout
        tileIndex={tileIndex}
        scrollProgressRef={scrollProgressRef}
        reducedMotion={reducedMotion}
        viewportWidth={viewportWidth}
        callout={callout}
      />
      <pointLight color={GOLD} intensity={0.4} distance={4.5} decay={2} />

      {/* Label — surfaces after callout fades. Single-word labels stay on one
          row at full size (no wrap, no clip); two-word labels ("At Risk")
          get one word per row at a slightly reduced size so both fit without
          overlapping. */}
      <Html
        center
        position={[0, 0, 0]}
        distanceFactor={5}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        <div
          ref={labelRef}
          style={{
            opacity: 0,
            width: "max-content",
            maxWidth: "150px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            fontWeight: 900,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#FFFFFF",
            textShadow: `0 0 8px ${accent}, 0 2px 6px rgba(0,0,0,1), 0 0 18px ${accent}70, 0 0 1px rgba(255,255,255,0.9)`,
          }}
        >
          {labelWords.map((word) => (
            <span
              key={word}
              style={{
                whiteSpace: "nowrap",
                fontSize: labelWords.length > 1 ? "24px" : "27px",
                lineHeight: 1.1,
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </Html>

      {/* Lock-impact gold-dust burst — small splash fired each time this
          hex locks into the shield. Desktop only; reduced-motion skips. */}
      {viewportWidth >= 768 && !reducedMotion && (
        <points ref={burstRef} visible={false} scale={0.001}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[burstPositions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            ref={burstMatRef}
            color="#FFE9A8"
            size={0.09}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
          />
        </points>
      )}
    </group>
  );
}

"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  buildShards,
  shardPosition,
  shardOpacity,
  hexOpacity,
  hexRecede,
  frameDrawProgress,
  markOpacity,
  markScale,
  cameraZ,
  responsiveScale,
  CHASE_ALPHA,
  HEX_CENTERS,
  HEX_OUTLINE_RADIUS,
  FRAME_POINTS,
  FRAME_SCALE,
  GOLD,
  GOLD_SOFT,
  CYAN,
} from "./finaleMotion";

interface FinaleSceneProps {
  scrollProgressRef: RefObject<number>;
  reducedMotion: boolean;
  viewportWidth: number;
  shardCount: number;
}

const MARK_TEXTURE = "/images/diamonds/sgc-logo-beacon-tex.webp";

// ─── Flat hexagon outline in the XY plane (flat-top, matches shield) ─────
function hexOutlineGeometry(radius: number): THREE.BufferGeometry {
  const pts: THREE.Vector3[] = [];
  for (let k = 0; k <= 6; k++) {
    const a = (k / 6) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  return new THREE.BufferGeometry().setFromPoints(pts);
}
const HEX_GEO = hexOutlineGeometry(HEX_OUTLINE_RADIUS);

// Vanguard silhouette — draw-in via geometry.setDrawRange on the TubeGeometry.
const frameCurve = new THREE.CatmullRomCurve3(
  FRAME_POINTS.map(([x, y]) => new THREE.Vector3(x * FRAME_SCALE, y * FRAME_SCALE, -0.05)),
  true,
);
const FRAME_GEO = new THREE.TubeGeometry(frameCurve, 220, 0.052, 10, true);
const FRAME_INDEX_COUNT = FRAME_GEO.index ? FRAME_GEO.index.count : 0;

// Soft halo ring that lives behind the SGC mark — subtle, never the focal point.
const HALO_GEO = new THREE.RingGeometry(0.95, 1.6, 64);

const dummy = new THREE.Object3D();
const shardPos = new THREE.Vector3();

// Lazy texture fetch — returns a placeholder immediately, swaps real data in
// when the network resolves. Avoids blocking the canvas mount.
function loadTexture(path: string): THREE.Texture {
  const loader = new THREE.TextureLoader();
  const tex = loader.load(path);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

export default function FinaleScene({
  scrollProgressRef,
  reducedMotion,
  viewportWidth,
  shardCount,
}: FinaleSceneProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const instRef = useRef<THREE.InstancedMesh>(null!);
  const shardMatRef = useRef<THREE.MeshBasicMaterial>(null!);
  const frameRef = useRef<THREE.Mesh>(null!);
  const frameMatRef = useRef<THREE.MeshBasicMaterial>(null!);
  const markRef = useRef<THREE.Mesh>(null!);
  const markMatRef = useRef<THREE.MeshBasicMaterial>(null!);
  const haloRef = useRef<THREE.Mesh>(null!);
  const haloMatRef = useRef<THREE.MeshBasicMaterial>(null!);
  const hexMatRefs = useRef<(THREE.LineBasicMaterial | null)[]>([]);
  const smoothPRef = useRef(0);

  const shards = useMemo(() => buildShards(shardCount), [shardCount]);
  const markTexture = useMemo(() => loadTexture(MARK_TEXTURE), []);

  const goldColor = useMemo(() => new THREE.Color(GOLD), []);
  const goldSoftColor = useMemo(() => new THREE.Color(GOLD_SOFT), []);
  const cyanColor = useMemo(() => new THREE.Color(CYAN), []);

  useFrame((state) => {
    const raw = scrollProgressRef.current ?? 0;
    smoothPRef.current += (raw - smoothPRef.current) * (reducedMotion ? 1 : CHASE_ALPHA);
    if (Math.abs(raw - smoothPRef.current) < 0.0005) smoothPRef.current = raw;
    const p = smoothPRef.current;

    state.camera.position.z = cameraZ(p);
    state.camera.lookAt(0, 0, 0);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(responsiveScale(viewportWidth));
      // Desktop: the caption column owns the left side — bias the cluster
      // right so Phase D's mark never sits under the headline.
      groupRef.current.position.x = viewportWidth >= 1024 ? 1.35 : 0;
    }

    // Shards — one InstancedMesh, matrices recomputed from pure math.
    const inst = instRef.current;
    if (inst) {
      for (let i = 0; i < shards.length; i++) {
        const s = shards[i];
        shardPosition(s, p, shardPos);
        dummy.position.copy(shardPos);
        // Per-shard twinkle — function of progress so it retraces exactly.
        const twinkle = 1 + 0.18 * Math.sin(p * 9 + s.driftPhase);
        dummy.scale.setScalar(s.scale * twinkle);
        dummy.rotation.set(p * 2 + s.driftPhase, p * 3 + s.driftPhase, 0);
        dummy.updateMatrix();
        inst.setMatrixAt(i, dummy.matrix);
      }
      inst.instanceMatrix.needsUpdate = true;
    }
    if (shardMatRef.current) {
      // Slow deterministic phase flicker so the cloud feels alive at rest.
      const flicker = 0.92 + 0.08 * Math.sin(p * Math.PI * 2);
      shardMatRef.current.opacity = shardOpacity(p) * flicker;
    }

    // Hex outlines surface as shards lock, recede behind the mark in D.
    const hexOp = hexOpacity(p) * hexRecede(p);
    for (const mat of hexMatRefs.current) {
      if (mat) mat.opacity = hexOp * 0.85;
    }

    // Vanguard frame draws in along its path.
    if (frameRef.current && frameMatRef.current) {
      const f = frameDrawProgress(p);
      frameRef.current.geometry.setDrawRange(0, Math.floor(FRAME_INDEX_COUNT * f));
      frameMatRef.current.opacity = f > 0 ? 0.95 : 0;
    }

    // SGC beacon mark resolves last; soft halo behind it breathes.
    if (markRef.current && markMatRef.current) {
      markMatRef.current.opacity = markOpacity(p);
      markRef.current.scale.setScalar(markScale(p) * 2.4);
    }
    if (haloRef.current && haloMatRef.current) {
      const haloOp = markOpacity(p) * 0.32;
      haloMatRef.current.opacity = haloOp;
      const breathe = 1 + 0.06 * Math.sin(state.clock.elapsedTime * 0.9);
      haloRef.current.scale.setScalar(markScale(p) * 2.6 * breathe);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Shards — octahedra echo the hero's diamonds */}
      <instancedMesh
        ref={instRef}
        args={[undefined, undefined, shards.length]}
        onUpdate={(mesh) => {
          if (!mesh.instanceColor) {
            for (let i = 0; i < shards.length; i++) {
              mesh.setColorAt(i, shards[i].isGold ? goldColor : cyanColor);
            }
            if (mesh.instanceColor) {
              (mesh.instanceColor as THREE.InstancedBufferAttribute).needsUpdate = true;
            }
          }
        }}
      >
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          ref={shardMatRef}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>

      {/* Hex cluster outlines (logo center + 6) */}
      {HEX_CENTERS.map((c, i) => (
        <lineLoop key={i} position={[c.x, c.y, 0]} geometry={HEX_GEO}>
          <lineBasicMaterial
            ref={(m) => { hexMatRefs.current[i] = m; }}
            color={GOLD}
            transparent
            opacity={0}
          />
        </lineLoop>
      ))}

      {/* Vanguard shield frame — draw-in via drawRange */}
      <mesh ref={frameRef} geometry={FRAME_GEO}>
        <meshBasicMaterial
          ref={frameMatRef}
          color={goldSoftColor}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* Soft halo behind the SGC beacon mark */}
      <mesh ref={haloRef} position={[0, 0, 0.08]} geometry={HALO_GEO}>
        <meshBasicMaterial
          ref={haloMatRef}
          color={goldSoftColor}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* SGC beacon mark — the destination of the whole story */}
      <mesh ref={markRef} position={[0, 0, 0.15]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={markMatRef}
          map={markTexture}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

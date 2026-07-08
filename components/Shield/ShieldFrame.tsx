"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { responsiveScale } from "./shieldMotion";
import { GOLD } from "./complianceData";

interface ShieldFrameProps {
  scrollProgressRef: RefObject<number>;
  reducedMotion: boolean;
  viewportWidth: number;
}

// Slim Vanguard: x-values ≈0.72× the wide version.
// Width ≈4.4 units, height ≈5.7 → 0.77:1 aspect (taller-than-wide).
// Five crest points share y=2.800 → horizontal CatmullRom tangents (no heart).
export const FRAME_POINTS: [number, number][] = [
  [  0.000,  2.800],  // top-center crest     ─┐
  [  0.700,  2.800],  // top right-inner        │ same y → horizontal tangent
  [  1.600,  2.800],  // top right-outer       ─┘
  [  2.200,  2.000],  // right shoulder corner
  [  2.200,  0.700],  // right flank upper
  [  2.200, -0.300],  // right flank (widest)
  [  1.650, -1.400],  // right taper upper
  [  1.000, -2.100],  // right taper lower
  [  0.000, -2.900],  // bottom point
  [ -1.000, -2.100],  // left taper lower
  [ -1.650, -1.400],  // left taper upper
  [ -2.200, -0.300],  // left flank (widest)
  [ -2.200,  0.700],  // left flank upper
  [ -2.200,  2.000],  // left shoulder corner
  [ -1.600,  2.800],  // top left-outer        ─┐ same y
  [ -0.700,  2.800],  // top left-inner        ─┘
];

const curve = new THREE.CatmullRomCurve3(
  FRAME_POINTS.map(([x, y]) => new THREE.Vector3(x, y, 0.04)),
  true, // closed
);

// Thick, raised, polished-gold border tracing the shield edge
const tubeGeo = new THREE.TubeGeometry(curve, 160, 0.12, 12, true);

export default function ShieldFrame({ scrollProgressRef, reducedMotion, viewportWidth }: ShieldFrameProps) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.opacity = 1;
    const respScale = responsiveScale(viewportWidth);
    meshRef.current.scale.setScalar(respScale);
  });

  return (
    <mesh ref={meshRef} geometry={tubeGeo} scale={0.85}>
<meshStandardMaterial
              color={GOLD}
              transparent
              opacity={0}
              side={THREE.DoubleSide}
              metalness={0.9}
              roughness={0.2}
              depthWrite={false}
            />
    </mesh>
  );
}

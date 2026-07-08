"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GOLD } from "./complianceData";

interface FinaleGlowProps {
  isFinale: boolean;
  reducedMotion: boolean;
  finaleProgressRef: React.RefObject<number>;
}

const RING_TRIGGERS = [0.85, 0.87, 0.89] as const;
const RING_DURATION = 0.25; // local fraction over which each ring expands
const RING_GEO = new THREE.RingGeometry(0.9, 1.0, 48);

export default function FinaleGlow({ isFinale, reducedMotion, finaleProgressRef }: FinaleGlowProps) {
  const mat0 = useRef<THREE.MeshBasicMaterial>(null!);
  const mat1 = useRef<THREE.MeshBasicMaterial>(null!);
  const mat2 = useRef<THREE.MeshBasicMaterial>(null!);
  const mesh0 = useRef<THREE.Mesh>(null!);
  const mesh1 = useRef<THREE.Mesh>(null!);
  const mesh2 = useRef<THREE.Mesh>(null!);

  const mats = [mat0, mat1, mat2];
  const meshes = [mesh0, mesh1, mesh2];

  useFrame(() => {
    if (!isFinale || reducedMotion) {
      // Hide all rings when not in finale
      mats.forEach(m => { if (m.current) m.current.opacity = 0; });
      return;
    }
    const ft = finaleProgressRef.current ?? 0;

    RING_TRIGGERS.forEach((trigger, i) => {
      const mat = mats[i].current;
      const mesh = meshes[i].current;
      if (!mat || !mesh) return;
      const rp = THREE.MathUtils.clamp((ft - trigger) / RING_DURATION, 0, 1);
      // Scale from 0.3 → 4.5 as ring expands
      const s = 0.3 + rp * 4.2;
      mesh.scale.setScalar(s);
      // Fade from 0.55 → 0 as ring expands
      mat.opacity = (1 - rp) * 0.55;
    });
  });

  // Rings removed — return null in all paths
  return null;
}

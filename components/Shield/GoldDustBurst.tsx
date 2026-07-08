"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { IMPACT_AT, BURST_LIFETIME, burstRadius, burstOpacity } from "./shieldMotion";

interface GoldDustBurstProps {
  isFinale: boolean;
  reducedMotion: boolean;
  finaleProgressRef: React.RefObject<number>;
}

// Brighter/warmer than the ambient GoldDustParticles' muted GOLD — this is a
// foreground impact cue and needs to read clearly against the shield, not
// blend into the background scatter.
const BURST_COLOR = "#FFE9A8";
const COUNT = 160;
const MAX_RADIUS = 4.2;

// Splash choreography: the shield "lands" after its spin (IMPACT_AT) like a
// stone striking water — particles radiate outward fast, then drag-
// decelerate and dissolve (see shieldMotion.burstRadius/burstOpacity),
// rather than a linear explosion. Fires once per finale entry, resets on
// exit so it can replay on the next entry.
export default function GoldDustBurst({ isFinale, reducedMotion, finaleProgressRef }: GoldDustBurstProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.PointsMaterial>(null!);
  const firedRef = useRef(false);
  const elapsedRef = useRef(-1);

  // Fixed random direction + speed variance per particle, generated once.
  const directions = useMemo(() => {
    const arr = new Float32Array(COUNT * 2); // [theta, speedMul]
    for (let i = 0; i < COUNT; i++) {
      arr[i * 2] = Math.random() * Math.PI * 2;
      arr[i * 2 + 1] = 0.55 + Math.random() * 0.65;
    }
    return arr;
  }, []);

  const positions = useMemo(() => new Float32Array(COUNT * 3), []);

  useFrame((_, delta) => {
    const ft = finaleProgressRef.current ?? 0;

    if (isFinale && !reducedMotion) {
      if (ft >= IMPACT_AT && !firedRef.current) {
        firedRef.current = true;
        elapsedRef.current = 0;
      }
    } else if (!isFinale) {
      firedRef.current = false;
      elapsedRef.current = -1;
    }

    if (!materialRef.current || !pointsRef.current) return;

    if (elapsedRef.current < 0) {
      materialRef.current.opacity = 0;
      return;
    }

    elapsedRef.current += delta;
    const t = elapsedRef.current;
    materialRef.current.opacity = burstOpacity(t);

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < COUNT; i++) {
      const theta = directions[i * 2];
      const speedMul = directions[i * 2 + 1];
      const radius = burstRadius(t, MAX_RADIUS * speedMul);
      posAttr.setXYZ(i, radius * Math.cos(theta), radius * Math.sin(theta), (Math.random() - 0.5) * 0.06);
    }
    posAttr.needsUpdate = true;

    if (t >= BURST_LIFETIME) {
      elapsedRef.current = -1;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry attach="geometry">
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        transparent
        color={BURST_COLOR}
        size={0.11}
        sizeAttenuation
        depthWrite={false}
        opacity={0}
      />
    </points>
  );
}

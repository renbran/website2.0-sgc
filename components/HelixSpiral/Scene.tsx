"use client";

import { ExperienceProvider } from "@/hooks/useExperienceStoreImpl";

import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import SceneLighting from "./SceneLighting";
import DNAHelix from "./DNAHelix";
import DiamondRing from "./DiamondRing";
import Particles from "./Particles";
import { DIAMOND_IMAGES } from "./diamonds.config";
import { progressToCamIndex, diamondY } from "./helixMotion";

// Preload all 8 textures at module level — no pop-in when diamonds mount
useTexture.preload(DIAMOND_IMAGES);

interface SceneProps {
  scrollProgressRef: React.RefObject<number>;
  activeIndex: number;
  mouseRef: React.RefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
  particleCount: number;
  diamondSize: number;
  strandSegments: number;
  scrollVelocityRef: React.RefObject<number>;
}

export default function Scene({
  scrollProgressRef,
  activeIndex,
  mouseRef,
  reducedMotion,
  particleCount,
  diamondSize,
  strandSegments,
  scrollVelocityRef,
}: SceneProps) {
  const outerGroupRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    // Camera + helix rotation are PURE functions of scroll progress, so the
    // scene reverses frame-for-frame. Smoothness comes from Lenis-smoothed
    // `progress`, not from per-frame damping. (See helixMotion.ts.)
    const progress = scrollProgressRef.current ?? 0;

    // Camera rides the helix axis, dwelling on each diamond. Z = 7.5 keeps the
    // active diamond surface filling the frame without losing the helix.
    const camIndex = progressToCamIndex(progress);
    const camY = diamondY(camIndex);
    state.camera.position.set(0, camY + 0.5, 7.5);
    state.camera.lookAt(0, camY, 0);

    if (outerGroupRef.current) {
      // One full scroll-driven revolution — deterministic in progress. The old
      // free-running idle auto-spin was a time accumulator that made the same
      // progress render differently each pass and broke reverse scrubbing.
      outerGroupRef.current.rotation.y = progress * Math.PI * 2;

      // Mouse parallax: subtle tilt. Interactive and self-resetting (0 when the
      // pointer is still) — orthogonal to scroll, doesn't affect reversibility.
      if (!reducedMotion && mouseRef?.current) {
        outerGroupRef.current.rotation.x = THREE.MathUtils.lerp(
          outerGroupRef.current.rotation.x,
          mouseRef.current.y * 0.05,
          delta * 3
        );
        outerGroupRef.current.rotation.z = THREE.MathUtils.lerp(
          outerGroupRef.current.rotation.z,
          -mouseRef.current.x * 0.03,
          delta * 3
        );
      }
    }
  });

  return (
    <ExperienceProvider>
      <SceneLighting />

      {/* Single rotation group — helix and diamonds share the same parent so they
          rotate in lockstep. RotatingSpine removed: it was spinning the helix alone
          at a different rate, visually decoupling it from the diamond positions. */}
      <group ref={outerGroupRef}>
        <DNAHelix segments={strandSegments} />
        <Suspense fallback={null}>
          <DiamondRing
            scrollProgressRef={scrollProgressRef}
            diamondSize={diamondSize}
          />
        </Suspense>
        <Particles
          count={particleCount}
          reduced={reducedMotion}
          scrollVelocityRef={scrollVelocityRef}
        />
      </group>

      <EffectComposer>
        <Bloom
          intensity={0.55}
          luminanceThreshold={0.32}
          mipmapBlur
        />
      </EffectComposer>
    </ExperienceProvider>
  );
}

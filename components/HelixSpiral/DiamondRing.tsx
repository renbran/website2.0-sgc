"use client";

import { useCallback, useRef, useState, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Diamond, { type DiamondHandle } from "./Diamond";
import { DIAMONDS } from "./diamonds.config";
import { getTargetSection } from "./diamondBindings";
import { progressToCamIndex, diamondActiveness, diamondY } from "./helixMotion";
import { getLenis } from "@/lib/lenis";

// Orbit radius: diamonds sit just outside helix strands — they ARE the ladder rungs
const ORBIT_RADIUS = 4.0;

interface OrbitPosition {
  x: number;
  y: number;
  z: number;
}

// Each diamond is positioned so its world-space angle at activation = π/2,
// meaning it faces directly toward the camera (worldZ = +ORBIT_RADIUS) when active.
// Derivation: outerGroup.rotation.y = progress × 2π; diamond i activates at
// progress = i/7, so rot_active = (i/7)×2π. Setting t_local = rot_active + π/2
// gives worldZ = R·sin(t_local − rot_active) = R·sin(π/2) = R for all i.
const ORBIT_POSITIONS: OrbitPosition[] = DIAMONDS.map((_, i) => {
  const y = diamondY(i);
  const t = (i / (DIAMONDS.length - 1)) * Math.PI * 2 + Math.PI / 2; // always faces camera when active
  return {
    x: ORBIT_RADIUS * Math.cos(t),
    y,
    z: ORBIT_RADIUS * Math.sin(t),
  };
});

const ORBIT_VEC3S: THREE.Vector3[] = ORBIT_POSITIONS.map(
  (p) => new THREE.Vector3(p.x, p.y, p.z),
);

interface DiamondRingProps {
  scrollProgressRef: RefObject<number>;
  diamondSize?: number;
}

export default function DiamondRing({
  scrollProgressRef,
  diamondSize = 2.4,
}: DiamondRingProps) {
  const diamondRefs = useRef<(DiamondHandle | null)[]>(Array(8).fill(null));
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useFrame(() => {
    // Highlight is a PURE function of scroll progress (via the shared camera
    // index), so it reverses exactly — no per-frame damping, no activeIndex
    // hysteresis. Diamond positions are fixed on the helix (set once via
    // initialPosition); the group rotation surfaces each one as you scroll.
    const progress = scrollProgressRef.current ?? 0;
    const camIndex = progressToCamIndex(progress);

    for (let i = 0; i < DIAMONDS.length; i++) {
      const handle = diamondRefs.current[i];
      if (!handle) continue;

      const activeness = diamondActiveness(camIndex, i);
      const hovered = hoveredIndex === i;

      // Active: prominent (1.12). Inactive: secondary (0.68). Hover: slight pop.
      const scale = THREE.MathUtils.lerp(0.68, 1.12, activeness) * (hovered ? 1.06 : 1.0);
      handle.group.scale.setScalar(scale);

      // Active: full opacity. Inactive: 65% — secondary but never invisible.
      handle.material.opacity = THREE.MathUtils.lerp(0.65, 1.0, activeness);

      // Equalized point light — clean diamond, small hover lift only.
      handle.light.intensity = 0.6 + (hovered ? 0.15 : 0);
    }
  });

  const handlePointerOver = useCallback((index: number) => {
    setHoveredIndex(index);
    document.body.style.cursor = "pointer";
  }, []);

  const handlePointerOut = useCallback((_index: number) => {
    setHoveredIndex(null);
    document.body.style.cursor = "default";
  }, []);

  const handleClick = useCallback((index: number) => {
    const targetSection = getTargetSection(index);
    const lenis = getLenis();
    if (lenis) {
      const target = document.querySelector<HTMLElement>(targetSection);
      if (target) {
        lenis.scrollTo(target, { duration: 1.5 });
      }
    }
  }, []);

  return (
    <group>
      {DIAMONDS.map((diamond, i) => (
        <Diamond
          key={diamond.image}
          imagePath={diamond.image}
          initialPosition={ORBIT_VEC3S[i]}
          onClick={() => handleClick(i)}
          onPointerOver={() => handlePointerOver(i)}
          onPointerOut={() => handlePointerOut(i)}
          size={diamondSize}
          ref={(el) => {
            diamondRefs.current[i] = el;
          }}
        />
      ))}
    </group>
  );
}

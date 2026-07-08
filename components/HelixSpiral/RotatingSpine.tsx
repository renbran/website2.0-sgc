"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Baseline auto-rotation speed. Will be driven by GSAP ScrollTrigger in M3.
const BASE_ROT_SPEED = 0.08; // rad/sec

interface RotatingSpineProps {
  children: React.ReactNode;
}

export default function RotatingSpine({ children }: RotatingSpineProps) {
  const spineRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (spineRef.current) {
      spineRef.current.rotation.y += BASE_ROT_SPEED * delta;
    }
  });

  return <group ref={spineRef}>{children}</group>;
}

"use client";

import { useRef, Suspense } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LogoHexProps {
  finaleAngleRef?: React.RefObject<number>;
}

function LogoHexInner({ finaleAngleRef }: LogoHexProps) {
  const texture = useTexture("/sgc-logo-tex.webp");
  const logoMatRef = useRef<THREE.MeshBasicMaterial>(null!);
  const rimMatRef = useRef<THREE.MeshBasicMaterial>(null!);

  useFrame(() => {
    const angle = finaleAngleRef?.current ?? 0;
    // Same threshold as HexTile labels: hide when turned more than ~81° from front.
    const facingCamera = Math.cos(angle) > 0.15;
    if (logoMatRef.current) logoMatRef.current.opacity = facingCamera ? 1 : 0;
    if (rimMatRef.current)  rimMatRef.current.opacity  = facingCamera ? 0.55 : 0;
  });

  return (
    <group>
      {/* Hex base — always visible; covered by full filler during finale spin */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 0.10, 6]} />
        <meshStandardMaterial
          color="#0D1520"
          emissive="#D4A574"
          emissiveIntensity={0.35}
          metalness={0.75}
          roughness={0.25}
        />
      </mesh>

      {/* Logo face plane — hidden when turned away */}
      <mesh position={[0, 0, 0.07]}>
        <planeGeometry args={[1.7, 1.7]} />
        <meshBasicMaterial
          ref={logoMatRef}
          map={texture}
          transparent
          alphaTest={0.04}
          depthWrite={false}
          color="#F4D5A8"
        />
      </mesh>

      {/* Gold hexagonal rim — hidden when turned away */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.005]}>
        <ringGeometry args={[0.97, 1.03, 6]} />
        <meshBasicMaterial
          ref={rimMatRef}
          color="#D4A574"
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Subtle rim glow */}
      <pointLight color="#D4A574" intensity={1.4} distance={6} decay={2} />
    </group>
  );
}

export default function LogoHex({ finaleAngleRef }: LogoHexProps) {
  return (
    <Suspense fallback={null}>
      <LogoHexInner finaleAngleRef={finaleAngleRef} />
    </Suspense>
  );
}

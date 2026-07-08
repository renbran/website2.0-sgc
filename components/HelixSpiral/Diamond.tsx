"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { Billboard, useTexture } from "@react-three/drei";
import * as THREE from "three";

export interface DiamondHandle {
  group: THREE.Group;
  material: THREE.MeshBasicMaterial;
  light: THREE.PointLight;
}

interface DiamondProps {
  imagePath: string;
  initialPosition: THREE.Vector3;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
  size?: number;
}

const Diamond = forwardRef<DiamondHandle, DiamondProps>(
  ({ imagePath, initialPosition, onClick, onPointerOver, onPointerOut, size = 2.4 }, ref) => {
    const groupRef = useRef<THREE.Group>(null!);
    const materialRef = useRef<THREE.MeshBasicMaterial>(null!);
    const lightRef = useRef<THREE.PointLight>(null!);

    useImperativeHandle(ref, () => ({
      group: groupRef.current,
      material: materialRef.current,
      light: lightRef.current,
    }));

    const texture = useTexture(imagePath);

    return (
      <group ref={groupRef} position={initialPosition}>
        <Billboard follow lockX={false} lockY={false} lockZ={false}>
          {/* Diamond texture plane */}
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              onPointerOver();
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              onPointerOut();
            }}
          >
            <planeGeometry args={[size, size]} />
            <meshBasicMaterial
              ref={materialRef}
              map={texture}
              transparent
              alphaTest={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Billboard>

        <pointLight
          ref={lightRef}
          color="#C7A23A"
          intensity={0.4}
          distance={6}
          position={[0, 0, 1]}
        />
      </group>
    );
  }
);

Diamond.displayName = "Diamond";

export default Diamond;

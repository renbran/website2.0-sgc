"use client";

import { useRef, useMemo, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * TransitionCanvas — Three.js scene for the HelixToShieldTransition.
 *
 * Three scroll-driven beats:
 *   0.00–0.33  Particles converge inward to a single center point.
 *   0.33–0.66  Center pulses 3 times, particle count effectively collapses to 1.
 *   0.66–1.00  Gold-rimmed shield outline blooms from the center and glows.
 *
 * After the shield finishes, the entire scene fades to the bg color so the
 * next section (Awards) takes over seamlessly.
 */

interface TransitionCanvasProps {
  scrollProgressRef: RefObject<number>;
  frameloop: "always" | "never";
  viewportWidth: number;
}

const PARTICLE_COUNT_DESKTOP = 240;
const PARTICLE_COUNT_MOBILE = 120;

export default function TransitionCanvas({
  scrollProgressRef,
  frameloop,
  viewportWidth,
}: TransitionCanvasProps) {
  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      camera={{ position: [0, 0, 6], fov: 50, near: 0.1, far: 100 }}
      style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}
    >
      <color attach="background" args={["#080B11"]} />
      <ambientLight intensity={0.45} />
      <pointLight
        position={[0, 0, 4]}
        intensity={1.2}
        color="#C7A23A"
        distance={9}
        decay={2}
      />
      <Scene
        scrollProgressRef={scrollProgressRef}
        isMobile={viewportWidth < 768}
      />
    </Canvas>
  );
}

function Scene({
  scrollProgressRef,
  isMobile,
}: {
  scrollProgressRef: RefObject<number>;
  isMobile: boolean;
}) {
  const particleCount = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
  const shieldRef = useRef<THREE.Mesh>(null!);
  const shieldMatRef = useRef<THREE.MeshBasicMaterial>(null!);

  // Pre-baked random angles + radii (deterministic, no SSR mismatch)
  const particles = useMemo(() => {
    const arr: { ax: number; ay: number; r: number; ph: number }[] = [];
    for (let i = 0; i < particleCount; i++) {
      const a = (i / particleCount) * Math.PI * 2 + Math.sin(i * 12.9898) * 0.05;
      const r = 1.5 + (Math.sin(i * 78.233) * 0.5 + 0.5) * 2.5;
      arr.push({
        ax: a,
        ay: Math.sin(i * 4.31) * 0.4,
        r,
        ph: (Math.sin(i * 17.13) * 0.5 + 0.5) * Math.PI * 2,
      });
    }
    return arr;
  }, [particleCount]);

  const positions = useMemo(() => {
    const buf = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const p = particles[i];
      buf[i * 3 + 0] = Math.cos(p.ax) * p.r;
      buf[i * 3 + 1] = p.ay * 0.3;
      buf[i * 3 + 2] = Math.sin(p.ax) * p.r * 0.3;
    }
    return buf;
  }, [particles, particleCount]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.045,
        color: "#F4F1E8",
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useFrame(() => {
    const p = scrollProgressRef.current ?? 0;

    // Beat 1: 0.00–0.33 — particles converge
    // Beat 2: 0.33–0.66 — collapse to center + pulse
    // Beat 3: 0.66–1.00 — shield bloom
    const convergeT = Math.min(1, p / 0.33);
    const pulseT = p < 0.33 ? 0 : Math.min(1, (p - 0.33) / 0.33);
    const shieldT = p < 0.66 ? 0 : Math.min(1, (p - 0.66) / 0.34);

    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;

    for (let i = 0; i < particleCount; i++) {
      const pa = particles[i];
      const r0 = pa.r;
      const targetR = r0 * (1 - convergeT) + convergeT * 0.04;
      const pulse =
        pulseT > 0 && pulseT < 1
          ? Math.sin(pulseT * Math.PI * 6) * 0.06 * (1 - pulseT)
          : 0;
      const finalR = targetR + pulse;

      posAttr.setXYZ(
        i,
        Math.cos(pa.ax) * finalR,
        pa.ay * 0.3 * (1 - convergeT) + convergeT * Math.sin(pa.ph + p * 4) * 0.02,
        Math.sin(pa.ax) * finalR * 0.3,
      );
    }
    posAttr.needsUpdate = true;
    material.opacity = 0.95 * Math.max(0, 1 - shieldT * 1.4);

    if (shieldRef.current) {
      shieldRef.current.scale.set(shieldT, shieldT, shieldT);
    }
    if (shieldMatRef.current) {
      shieldMatRef.current.opacity = shieldT * 0.9;
    }
  });

  return (
    <>
      <points geometry={geometry} material={material} />
      <mesh ref={shieldRef} position={[0, 0, -0.5]} scale={[0, 0, 0]}>
        <torusGeometry args={[1.0, 0.06, 24, 96]} />
        <meshBasicMaterial
          ref={shieldMatRef}
          color="#C7A23A"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

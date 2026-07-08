"use client";

import { Suspense, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import FinaleScene from "./FinaleScene";

interface FinaleCanvasProps {
  scrollProgressRef: RefObject<number>;
  reducedMotion: boolean;
  frameloop: "always" | "never";
  viewportWidth: number;
  shardCount: number;
}

export default function FinaleCanvas({
  scrollProgressRef,
  reducedMotion,
  frameloop,
  viewportWidth,
  shardCount,
}: FinaleCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={frameloop}
      camera={{ position: [0, 0, 7.2], fov: 55 }}
      gl={{ alpha: true, antialias: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <FinaleScene
          scrollProgressRef={scrollProgressRef}
          reducedMotion={reducedMotion}
          viewportWidth={viewportWidth}
          shardCount={shardCount}
        />
      </Suspense>
    </Canvas>
  );
}

"use client";

import { Suspense, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import ShieldScene from "./ShieldScene";

interface ShieldCanvasProps {
  scrollProgressRef: RefObject<number>;
  reducedMotion: boolean;
  frameloop: "always" | "never";
  viewportWidth: number;
  isFinale?: boolean;
  onFinaleEnd?: () => void;
  onFinaleTitleStart?: () => void;
}

export default function ShieldCanvas({
  scrollProgressRef,
  reducedMotion,
  frameloop,
  viewportWidth,
  isFinale = false,
  onFinaleEnd,
  onFinaleTitleStart,
}: ShieldCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={frameloop}
      camera={{ position: [0, 0, 5.8], fov: 55 }}
      gl={{ alpha: true, antialias: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      // `inert` instead of `aria-hidden="true"` so the 3D overlay's
      // portalled HTML children (e.g. drei <Html> buttons rendered into
      // the Canvas wrapper) are also removed from the tab order.
      // aria-hidden alone left those decorative CTAs focusable, which
      // Lighthouse flagged as a serious WCAG violation.
      inert={true}
    >
      <Suspense fallback={null}>
        <ShieldScene
          scrollProgressRef={scrollProgressRef}
          reducedMotion={reducedMotion}
          viewportWidth={viewportWidth}
          isFinale={isFinale}
          onFinaleEnd={onFinaleEnd}
          onFinaleTitleStart={onFinaleTitleStart}
        />
      </Suspense>
    </Canvas>
  );
}

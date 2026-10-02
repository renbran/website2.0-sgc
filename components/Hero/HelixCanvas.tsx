"use client";

import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import Scene from "@/components/HelixSpiral/Scene";

/**
 * Renders on demand instead of every frame.
 *
 * The hero camera, helix rotation and highlight are pure functions of scroll
 * progress, and the parallax is a function of pointer position — so there is
 * nothing to animate when the visitor is not scrolling or moving the pointer.
 * A permanent 60 fps loop therefore just burned main-thread time while the
 * page was idle (the single biggest contributor to the homepage's blocking
 * time under mobile CPU throttling).
 *
 * Any input "kicks" a short render burst (~400 ms) and then the loop parks
 * itself again, so the pointer-parallax easing still settles and the dust
 * still drifts while scrolling — it simply stops when nothing is happening.
 */
function DemandInvalidator() {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    let raf = 0;
    let activeUntil = 0;

    const loop = () => {
      invalidate();
      if (performance.now() < activeUntil) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    const kick = () => {
      activeUntil = performance.now() + 400;
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const events = [
      "pointermove",
      "scroll",
      "wheel",
      "touchmove",
      "resize",
      "sgc:helix-progress",
    ];
    for (const e of events) window.addEventListener(e, kick, { passive: true });

    // Initial paint, plus late coverage for Suspense (texture) resolution and
    // the entrance fade — r3f cannot invalidate for those by itself in demand
    // mode.
    kick();
    const timers = [260, 700, 1400].map((ms) => window.setTimeout(kick, ms));

    return () => {
      for (const e of events) window.removeEventListener(e, kick);
      timers.forEach((t) => window.clearTimeout(t));
      if (raf) cancelAnimationFrame(raf);
    };
  }, [invalidate]);

  return null;
}

interface HelixCanvasProps {
  scrollProgressRef: React.RefObject<number>;
  activeIndex: number;
  mouseRef: React.RefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
  particleCount: number;
  diamondSize: number;
  strandSegments: number;
  scrollVelocityRef: React.RefObject<number>;
  isMobile: boolean;
}

function PulsingDot() {
  return (
    <mesh>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshBasicMaterial color="#C7A23A" />
    </mesh>
  );
}

export default function HelixCanvas({
  scrollProgressRef,
  activeIndex,
  mouseRef,
  reducedMotion,
  particleCount,
  diamondSize,
  strandSegments,
  scrollVelocityRef,
  isMobile,
}: HelixCanvasProps) {
  return (
    <Canvas
      frameloop="demand"
      dpr={isMobile ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, -5.25, 7.5], fov: 65 }}
      style={{ background: "#080B11", width: "100%", height: "100%" }}
    >
      <DemandInvalidator />
      <Suspense fallback={<PulsingDot />}>
        <Scene
          scrollProgressRef={scrollProgressRef}
          activeIndex={activeIndex}
          mouseRef={mouseRef}
          reducedMotion={reducedMotion}
          particleCount={particleCount}
          diamondSize={diamondSize}
          strandSegments={strandSegments}
          scrollVelocityRef={scrollVelocityRef}
          enablePostFx={!isMobile}
        />
      </Suspense>
    </Canvas>
  );
}

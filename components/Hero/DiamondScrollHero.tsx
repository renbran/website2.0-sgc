"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReducedMotionFallback from "./ReducedMotionFallback";
import CinematicCaption from "@/components/HelixSpiral/CinematicCaption";
import AudioToggle from "@/components/AudioToggle";
import { useHelixScrub } from "@/hooks/useHelixScrub";
import HeroIntroOverlay from "./HeroIntroOverlay";

gsap.registerPlugin(ScrollTrigger);

const HelixCanvas = dynamic(() => import("./HelixCanvas"), { ssr: false });


export default function DiamondScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollVelocityRef = useRef(0);
  const lastProgressRef = useRef(0);
  const lastTimeRef = useRef(0);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useHelixScrub(scrollProgressRef);

  // Publish the helix scroll progress (0..1) on every animation frame so the
  // HelixToShieldTransition marker (and any future listener) can react to
  // the helix's exit point and seam itself to the Shield entrance without
  // any shared state. Cost: one window.dispatchEvent per rAF tick.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const tick = () => {
      window.dispatchEvent(
        new CustomEvent<number>("sgc:helix-progress", {
          detail: scrollProgressRef.current,
        }),
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scrollProgressRef]);


  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    lastTimeRef.current = performance.now();

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotion = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handleMotion);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkMobile, { passive: true });

    return () => {
      mq.removeEventListener("change", handleMotion);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !stickyRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        // iOS Safari's `position: sticky` fails inside containers whose
        // parent uses `100vh` (the URL-bar collapse shimmies the release
        // point), so we replaced CSS sticky with GSAP's pin. The 600vh
        // outer container provides the scroll range; pin locks the inner
        // canvas + UI to the viewport for that range. `pinSpacing: false`
        // because the outer container already supplies the flow spacer.
        pin: stickyRef.current,
        pinSpacing: false,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
          // Fade scroll hint on first scroll
          const hintOpacity = String(Math.max(0, 1 - self.progress * 40));
          if (scrollHintRef.current) {
            scrollHintRef.current.style.opacity = hintOpacity;
          }
          // Exit fade — canvas fades out over the last 12% of scroll so the
          // pin release into ProblemSection has no hard visual jump.
          if (stickyRef.current) {
            const exitOpacity = Math.max(0, 1 - Math.max(0, (self.progress - 0.88) / 0.12));
            stickyRef.current.style.opacity = String(exitOpacity);
          }
          const nextIndex = Math.round(self.progress * 7);
          if (nextIndex !== activeIndexRef.current) {
            activeIndexRef.current = nextIndex;
            setActiveIndex(nextIndex);
          }
          // Scroll velocity for reactive particles
          const now = performance.now();
          const dt = now - lastTimeRef.current;
          scrollVelocityRef.current =
            dt > 0 ? Math.abs(self.progress - lastProgressRef.current) / dt : 0;
          lastProgressRef.current = self.progress;
          lastTimeRef.current = now;
        },
      });
    }, containerRef);

    // iOS Safari fix: ScrollTrigger's measurements lock in before the
    // dynamically-imported Canvas + 8 diamond textures have mounted, so
    // the trigger's measured height is wrong on first paint. Refresh once
    // after canvas + textures are stable, plus once after the page load
    // event fires (fonts, late images).
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 600);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  const handleMouseMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseRef.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  };

  if (reducedMotion) {
    return <ReducedMotionFallback />;
  }

  const particleCount = isMobile ? 120 : 400;
  const diamondSize = isMobile ? 2.0 : 2.8;
  const strandSegments = isMobile ? 300 : 400;

  return (
    <div
      ref={containerRef}
      style={{ height: "600vh", position: "relative" }}
      onPointerMove={handleMouseMove}
    >
      {/* Full-bleed viewport — pinned by GSAP ScrollTrigger (see useEffect above).
          CSS `position: sticky` was removed because iOS Safari's sticky bug
          causes the canvas to release partway through the 600vh scroll range. */}
      <div
        ref={stickyRef}
        style={{
          height: "100dvh",
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#080B11",
          zIndex: 1,
        }}
      >
        <HelixCanvas
          scrollProgressRef={scrollProgressRef}
          activeIndex={activeIndex}
          mouseRef={mouseRef}
          reducedMotion={reducedMotion}
          particleCount={particleCount}
          diamondSize={diamondSize}
          strandSegments={strandSegments}
          scrollVelocityRef={scrollVelocityRef}
        />
        {/* Edge vignette — darkens corners without blocking center */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 2,
            background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 50%, rgba(8,11,17,0.65) 100%)",
          }}
        />
        {/* SGC brand watermark — near-invisible, sits above canvas, below all UI */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/diamonds/final-logo.png"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "clamp(260px, 38vw, 520px)",
            opacity: 0.055,
            pointerEvents: "none",
            zIndex: 3,
            userSelect: "none",
            filter: "grayscale(1) brightness(2)",
          }}
        />
        {/* Audio toggle — top-right corner, above canvas */}
        <div
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            zIndex: 12,
          }}
        >
          <AudioToggle />
        </div>

        {/* HTML caption overlay — sits above the canvas */}
        <CinematicCaption activeIndex={activeIndex} />

        {/* Intro overlay — doors open on scroll, MARK persists at bottom */}
        <HeroIntroOverlay scrollProgressRef={scrollProgressRef} />

        {/* Scroll hint — visible at scroll=0, fades immediately on scroll */}
        <div
          ref={scrollHintRef}
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            pointerEvents: "none",
            textAlign: "center",
            opacity: 1,
            transition: "opacity 0.4s ease",
          }}
        >
          <p style={{
            color: "#C7A23A",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontFamily: "var(--font-inter, sans-serif)",
            marginBottom: "0.6rem",
            opacity: 0.8,
          }}>
            Scroll to explore
          </p>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            style={{ margin: "0 auto", display: "block", animation: "sgc-bounce 1.8s ease-in-out infinite" }}
          >
            <path d="M12 5v14M5 12l7 7 7-7" stroke="#C7A23A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <style>{`
            @keyframes sgc-bounce {
              0%, 100% { transform: translateY(0); opacity: 0.6; }
              50% { transform: translateY(6px); opacity: 1; }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import FinaleCaption from "./FinaleCaption";
import FinaleStats from "./FinaleStats";
import ReducedMotionFinaleFallback from "./ReducedMotionFinaleFallback";
import CtaButton from "@/components/ui/CtaButton";
import {
  activeCaptionIndex,
  STATS_AT,
  SHARD_COUNT_DESKTOP,
  SHARD_COUNT_MOBILE,
} from "./finaleMotion";

gsap.registerPlugin(ScrollTrigger);

const FinaleCanvas = dynamic(() => import("./FinaleCanvas"), { ssr: false });

// Act 3 — "Convergence": a 400vh pinned recap of the whole site story.
// Chaos shards → mini helix (Act 1 echo) → hex shield (Act 2 echo) →
// SGC mark + outcomes, releasing into the SectionEight letter + CTA.
export default function FinaleConvergenceSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const [frameloop, setFrameloop] = useState<"always" | "never">("never");
  const [warming, setWarming] = useState(false);
  const ioActivatedRef = useRef(false);
  const [viewportWidth, setViewportWidth] = useState(1440);

  const reducedMotion = useReducedMotion() ?? false;

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsVisibleRef = useRef(false);

  const [entranceVisible, setEntranceVisible] = useState(false);
  const entranceFiredRef = useRef(false);

  // GPU warm-up: 6 rAF ticks at mount, then a 1fps heartbeat until the IO
  // activates the canvas (same discipline as ShieldSection — a third canvas
  // must never cold-start mid-scroll). Ticks 4-6 run at p=0.7 to compile the
  // hex/frame/mark material paths that are unreachable at p=0.
  useEffect(() => {
    let cancelled = false;
    setWarming(true);
    let depth = 0;

    const beat = () => {
      if (cancelled || ioActivatedRef.current) return;
      setWarming(true);
      requestAnimationFrame(() => {
        if (!cancelled && !ioActivatedRef.current) setWarming(false);
        setTimeout(beat, 1200);
      });
    };

    const step = () => {
      if (cancelled) return;
      depth++;
      if (depth === 3) scrollProgressRef.current = 0.7;
      if (depth < 6) {
        requestAnimationFrame(step);
      } else {
        scrollProgressRef.current = 0;
        setWarming(false);
        setTimeout(beat, 1200);
      }
    };
    requestAnimationFrame(step);
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    onResize();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const handle = () => {
      clearTimeout(timer);
      timer = setTimeout(onResize, 80);
    };
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("resize", handle);
      clearTimeout(timer);
    };
  }, []);

  // IO gates the frameloop so this canvas costs ~nothing while the hero and
  // shield acts are on screen.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          ioActivatedRef.current = true;
          setWarming(false);
        }
        setFrameloop(entry.isIntersecting ? "always" : "never");
        if (entry.isIntersecting && !entranceFiredRef.current) {
          entranceFiredRef.current = true;
          setEntranceVisible(true);
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
          const nextIndex = activeCaptionIndex(self.progress);
          if (nextIndex !== activeIndexRef.current) {
            activeIndexRef.current = nextIndex;
            setActiveIndex(nextIndex);
          }
          const showStats = self.progress >= STATS_AT;
          if (showStats !== statsVisibleRef.current) {
            statsVisibleRef.current = showStats;
            setStatsVisible(showStats);
          }
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Native scroll fallback — covers window.scrollTo (e.g. Playwright) before
  // Lenis has driven a ScrollTrigger update for the new position.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const totalRange = el.offsetHeight - window.innerHeight;
      if (totalRange <= 0) return;
      const progress = Math.max(0, Math.min(1, -el.getBoundingClientRect().top / totalRange));
      scrollProgressRef.current = progress;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (reducedMotion) {
    return <ReducedMotionFinaleFallback />;
  }

  const shardCount = viewportWidth < 768 ? SHARD_COUNT_MOBILE : SHARD_COUNT_DESKTOP;

  return (
    <div
      ref={containerRef}
      id="finale"
      style={{ height: "400vh", position: "relative" }}
    >
      <h2 className="sr-only">The SGC journey, summarized</h2>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100dvh",
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#080B11",
          zIndex: 1,
          opacity: entranceVisible ? 1 : 0,
          transform: entranceVisible ? "scale(1)" : "scale(0.96)",
          transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          willChange: !entranceVisible ? "opacity, transform" : undefined,
        }}
      >
        <FinaleCanvas
          scrollProgressRef={scrollProgressRef}
          reducedMotion={reducedMotion}
          frameloop={warming ? "always" : frameloop}
          viewportWidth={viewportWidth}
          shardCount={shardCount}
        />

        {/* Edge vignette — matches the hero/shield acts */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 2,
            background:
              "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 48%, rgba(8,11,17,0.7) 100%)",
          }}
        />

        <FinaleCaption activeIndex={activeIndex} reducedMotion={reducedMotion} />

        {statsVisible && <FinaleStats reducedMotion={reducedMotion} />}

        {/* Conversion touchpoint inside the 400vh finale — picks up scroll-driven
            visitors before they reach SectionEight's CTA. Sits above the vignette
            (zIndex 2) and the stats (zIndex 4) and is hidden until stats appear. */}
        {statsVisible && (
          <div
            style={{
              position: "absolute",
              bottom: "clamp(0.5rem, 2vh, 1.25rem)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 5,
              pointerEvents: "auto",
            }}
          >
            <CtaButton
              href="#contact"
              className="px-5 py-2 text-[0.78rem] md:px-6 md:py-3 md:text-[0.88rem]"
            >
              Book a Discovery Call →
            </CtaButton>
          </div>
        )}
      </div>
    </div>
  );
}

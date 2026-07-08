"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface HeroScrubProps {
  frameCount: number;
  frameUrl: (index: number) => string;
  titleTop: string;
  titleBottom: string;
  bgClassName?: string;
  accentHex?: string;
  defaultAspect?: number;
  /** Overrides the default Fraunces font-family on the top title only. */
  titleTopFontFamily?: string;
  /** Overrides the default text-6xl/md:text-8xl sizing on the top title
   *  only — needed when titleTop is a full phrase instead of one word. */
  titleTopClassName?: string;
  /** Same as titleTopFontFamily, for the bottom title. */
  titleBottomFontFamily?: string;
  /** Same as titleTopClassName, for the bottom title. */
  titleBottomClassName?: string;
}

const TITLE_TRAVEL_DESKTOP_VW = 60;
const TITLE_TRAVEL_MOBILE_VW = 70;
const SECTION_SCROLL_MULTIPLIER = 3.2;
const FRAME_BATCH_SIZE = 20;
const FRAME_BATCH_DELAY_MS = 80;

// CHAOS is visible over the opening frame and exits early; CLARITY stays
// hidden through the immersive midpoint and reveals only once the card has
// shrunk back down over the finished dashboard frames. Mirrored spans (both
// 0.30 of the scroll track) so the choreography is symmetric and identical
// whether scrolling forward or back — a wide enough window that normal
// scroll speed doesn't blow past the fade before it's readable.
const CHAOS_FADE_START = 0.0;
const CHAOS_FADE_SPAN = 0.3;
const CLARITY_FADE_START = 0.7;
const CLARITY_FADE_SPAN = 0.3;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handle = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);

  return reduced;
}

export function HeroScrub({
  frameCount,
  frameUrl,
  titleTop,
  titleBottom,
  bgClassName = "bg-[#080B11]",
  accentHex = "#C7A23A",
  defaultAspect = 16 / 9,
  titleTopFontFamily,
  titleTopClassName,
  titleBottomFontFamily,
  titleBottomClassName,
}: HeroScrubProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleTopRef = useRef<HTMLHeadingElement>(null);
  const titleBottomRef = useRef<HTMLHeadingElement>(null);
  const reducedCanvasRef = useRef<HTMLCanvasElement>(null);

  const framesRef = useRef<HTMLImageElement[]>([]);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [aspect, setAspect] = useState(defaultAspect);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });
  const isMobileRef = useRef(isMobile);
  const [isNearViewport, setIsNearViewport] = useState(false);

  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Match the ShieldSection/FinaleConvergenceSection convention: don't spend
  // bandwidth/CPU on this section until it's within 600px of the viewport.
  useEffect(() => {
    if (reducedMotion) return;
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsNearViewport(true);
      },
      { rootMargin: "600px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const drawFrame = useCallback((index: number, target: HTMLCanvasElement | null) => {
    const canvas = target;
    const img = framesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }, []);

  // Cross-fade between two adjacent frames so the reverse scrub looks smooth
  // instead of quantizing to integer frames (which produces visible "stuck"
  // pops at boundaries during fast reverse). t is the sub-frame position in
  // [0, 1] between frame a and frame b.
  const drawFrameCrossfaded = useCallback((a: number, b: number, t: number, target: HTMLCanvasElement | null) => {
    const canvas = target;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imgA = framesRef.current[a];
    const imgB = framesRef.current[b];
    const aReady = !!imgA && imgA.complete && imgA.naturalWidth > 0;
    const bReady = !!imgB && imgB.complete && imgB.naturalWidth > 0;

    // 61 frames download in throttled batches — a fast scroll can outrun that,
    // landing on a pair that isn't decoded yet. Keep the last painted frame on
    // screen instead of clearing to blank; it fills in on the next onUpdate
    // once the image finishes loading.
    if (!aReady && !bReady) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    if (aReady) {
      ctx.drawImage(imgA, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = t;
    }
    if (bReady) {
      ctx.drawImage(imgB, 0, 0, canvas.width, canvas.height);
    }
    ctx.globalAlpha = 1;
  }, []);

  // Load frame 0 synchronously (sets aspect/canvas dimensions), then batch-load the rest.
  // Gated behind isNearViewport (matches ShieldSection/FinaleConvergenceSection's IO
  // convention) so this never competes for bandwidth/CPU before the user scrolls near
  // it — reduced-motion loads immediately since it's a single static frame, not the
  // full sequence.
  useEffect(() => {
    if (!reducedMotion && !isNearViewport) return;

    const frames: HTMLImageElement[] = new Array(frameCount);
    framesRef.current = frames;

    // Mobile canvases render far smaller physically — halving the backing-store
    // resolution cuts per-frame drawImage() cost ~4x with no visible quality loss.
    const resScale = isMobileRef.current ? 0.5 : 1;

    const firstImg = new Image();
    firstImg.onload = () => {
      frames[0] = firstImg;
      const naturalAspect = firstImg.naturalWidth / firstImg.naturalHeight;
      setAspect(naturalAspect);

      [canvasRef.current, reducedCanvasRef.current].forEach((canvas) => {
        if (!canvas) return;
        canvas.width = Math.round(firstImg.naturalWidth * resScale);
        canvas.height = Math.round(firstImg.naturalHeight * resScale);
      });

      setFirstFrameReady(true);

      const remaining = Array.from({ length: frameCount - 1 }, (_, i) => i + 1);
      let batchIndex = 0;

      const loadBatch = () => {
        const start = batchIndex * FRAME_BATCH_SIZE;
        const batch = remaining.slice(start, start + FRAME_BATCH_SIZE);
        if (batch.length === 0) return;

        batch.forEach((i) => {
          const img = new Image();
          img.src = frameUrl(i);
          img.onerror = () => console.error(`Failed to load frame: ${frameUrl(i)}`);
          frames[i] = img;
        });

        batchIndex++;
        if (start + FRAME_BATCH_SIZE < remaining.length) {
          setTimeout(loadBatch, FRAME_BATCH_DELAY_MS);
        }
      };

      loadBatch();
    };
    firstImg.onerror = () => console.error(`Failed to load frame: ${frameUrl(0)}`);
    firstImg.src = frameUrl(0);
  }, [frameCount, frameUrl, reducedMotion, isNearViewport]);

  // Draw first frame once ready (both canvases, covers reduced-motion + initial paint)
  useEffect(() => {
    if (!firstFrameReady) return;
    drawFrame(0, canvasRef.current);
    drawFrame(0, reducedCanvasRef.current);
  }, [firstFrameReady, drawFrame]);

  // Entry animation on mount — only the container/card fade in as a one-time
  // reveal. Title opacity/position is NOT touched here: it's driven solely by
  // applyProgress() below so there's exactly one writer of that state, making
  // the sequence identical whether the section is scrolled into forward or
  // reached by scrolling back up.
  //
  // Skip the fade-in when the user lands deep-linked / refreshed already inside
  // the section — otherwise the brief 0-opacity mount would flash a blank
  // canvas before the scrub sync overwrites it.
  useEffect(() => {
    if (reducedMotion || !firstFrameReady) return;
    if (!stickyRef.current || !cardRef.current) return;
    if (typeof window !== "undefined" && window.scrollY > 0) return;

    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(
      stickyRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" },
    ).fromTo(
      cardRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" },
      "<0.1",
    );

    return () => {
      tl.kill();
    };
  }, [reducedMotion, firstFrameReady]);

  // Scroll-driven master timeline — sticky div simulates pin, no ScrollTrigger pin:true
  useEffect(() => {
    if (reducedMotion || !firstFrameReady) return;
    if (!wrapperRef.current || !cardRef.current || !titleTopRef.current || !titleBottomRef.current) return;

    const titleTravel = isMobile ? TITLE_TRAVEL_MOBILE_VW : TITLE_TRAVEL_DESKTOP_VW;

    // Pure function of progress — same output for the same progress value
    // regardless of scroll direction or when it's called, so forward and
    // reverse scroll always show the identical sequence. Image is full-bleed
    // for the entire scroll span; frames cross-fade between adjacent indices
    // so the reverse scrub reads as continuous motion instead of quantizing
    // to integer frames (which produces visible "stuck" pops during fast
    // reverse at frame boundaries).
    const applyProgress = (progress: number) => {
      // Smoothstep — softens the title opacity/offset transitions in both
      // directions (forward and reverse) without changing the timing of
      // when CHAOS/CLARITY begin or end. Reads as a polished ease-in-out.
      const smoothT = (x: number) => x * x * (3 - 2 * x);

      // CHAOS reads over the opening chaotic frame, then exits and never
      // returns. CLARITY stays hidden through the immersive full-bleed
      // midpoint and only reveals once the dashboard frames arrive near the
      // end — sequential, not a symmetric fade.
      const chaosRaw = 1 - clamp((progress - CHAOS_FADE_START) / CHAOS_FADE_SPAN, 0, 1);
      const clarityRaw = clamp((progress - CLARITY_FADE_START) / CLARITY_FADE_SPAN, 0, 1);
      const chaosOpacity = smoothT(chaosRaw);
      const clarityOpacity = smoothT(clarityRaw);
      const chaosOffset = titleTravel * (1 - chaosOpacity);

      gsap.set(titleTopRef.current, { opacity: chaosOpacity, xPercent: -chaosOffset });
      gsap.set(titleBottomRef.current, { opacity: clarityOpacity, xPercent: 0 });

      // Sub-frame interpolation between adjacent frames. Exact-direction
      // symmetric: forward at p=0.5 shows frame 30 + 0.5 fade-in toward 31,
      // reverse at p=0.5 shows the same.
      const exact = progress * (frameCount - 1);
      const a = Math.min(frameCount - 1, Math.max(0, Math.floor(exact)));
      const b = Math.min(frameCount - 1, a + 1);
      const subT = smoothT(exact - a);
      drawFrameCrossfaded(a, b, subT, canvasRef.current);
    };

    // Sync the initial visual state immediately — don't rely on ScrollTrigger
    // implicitly firing onUpdate before the first scroll event.
    applyProgress(0);

    const trigger = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top top",
      end: `+=${window.innerHeight * SECTION_SCROLL_MULTIPLIER}px`,
      scrub: true,
      onUpdate: (self) => applyProgress(self.progress),
    });

    return () => trigger.kill();
  }, [frameCount, reducedMotion, firstFrameReady, isMobile, drawFrame]);

  if (reducedMotion) {
    return (
      <div className={`relative w-full h-[100svh] ${bgClassName} flex items-center justify-center`}>
        <div className="relative w-full h-full" style={{ aspectRatio: aspect, overflow: "hidden" }}>
          <canvas ref={reducedCanvasRef} className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
      style={{ height: `${(SECTION_SCROLL_MULTIPLIER + 1) * 100}vh` }}
    >
      <div
        ref={stickyRef}
        className={`sticky top-0 w-full h-[100svh] flex items-center justify-center overflow-hidden ${bgClassName}`}
      >
        {/* Ambient gold vignette — atmosphere behind the card, not part of the scroll timeline */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 45%, ${accentHex}14 0%, transparent 60%)`,
          }}
        />

        {/* Loading skeleton — avoids a blank flash while the first frame decodes */}
        {!firstFrameReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-[60vw] max-w-3xl animate-pulse rounded-[28px] bg-[var(--text-primary)]/5"
              style={{ aspectRatio: defaultAspect }}
            />
          </div>
        )}

        <h2
          ref={titleTopRef}
          className={
            titleTopClassName ??
            "hero-scrub-title overlay-text-shadow absolute z-10 top-[20%] left-1/2 -translate-x-1/2 text-6xl md:text-8xl tracking-tight whitespace-nowrap pointer-events-none"
          }
          style={{
            color: accentHex,
            ...(titleTopFontFamily ? { fontFamily: titleTopFontFamily } : {}),
          }}
        >
          <span className="relative inline-block">
            {titleTop}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
              style={{ mixBlendMode: "screen" }}
            >
              <span
                className="absolute inset-y-0 -left-1/2 w-1/3"
                style={{
                  background:
                    "linear-gradient(115deg, transparent 0%, rgba(255,236,179,0.55) 50%, transparent 100%)",
                  animation: "sgc-shimmer 2.4s ease-in-out infinite",
                }}
              />
            </span>
          </span>
        </h2>

        <div ref={cardRef} className="absolute inset-0 overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full object-cover block" />
        </div>

        <h2
          ref={titleBottomRef}
          className={
            titleBottomClassName ??
            "hero-scrub-title overlay-text-shadow absolute z-10 top-[75%] left-1/2 -translate-x-1/2 text-6xl md:text-8xl tracking-tight whitespace-nowrap pointer-events-none"
          }
          style={{
            color: accentHex,
            ...(titleBottomFontFamily ? { fontFamily: titleBottomFontFamily } : {}),
          }}
        >
          <span className="relative inline-block">
            {titleBottom}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
              style={{ mixBlendMode: "screen" }}
            >
              <span
                className="absolute inset-y-0 -left-1/2 w-1/3"
                style={{
                  background:
                    "linear-gradient(115deg, transparent 0%, rgba(255,236,179,0.55) 50%, transparent 100%)",
                  animation: "sgc-shimmer 2.4s ease-in-out infinite",
                  animationDelay: "1.2s",
                }}
              />
            </span>
          </span>
        </h2>
      </div>

      <style>{`
        @keyframes sgc-shimmer {
          0%   { transform: translateX(0%); }
          100% { transform: translateX(420%); }
        }
      `}</style>
    </div>
  );
}

export default HeroScrub;

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import FinaleTitle from "./FinaleTitle";
import StageProgress from "./StageProgress";
import ShieldIntroCategories from "./ShieldIntroCategories";
import { getLenis } from "@/lib/lenis";
import { FINALE_AT } from "./shieldMotion";

gsap.registerPlugin(ScrollTrigger);

const ShieldCanvas = dynamic(() => import("./ShieldCanvas"), { ssr: false });

export default function ShieldSection() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const [frameloop, setFrameloop] = useState<"always" | "never">("never");
  const [warming, setWarming] = useState(false);
  // Signals the post-warm-up heartbeat to stop once the IO activates the canvas.
  const ioActivatedRef = useRef(false);
  const [viewportWidth, setViewportWidth] = useState(1440);

  const reducedMotion = useReducedMotion() ?? false;
  const [isFinale, setIsFinale] = useState(false);
  // Stable refs for use inside ScrollTrigger closure (avoids stale captures).
  const isFinaleRef = useRef(false);
  const reducedMotionRef = useRef(reducedMotion);
  useEffect(() => { reducedMotionRef.current = reducedMotion; }, [reducedMotion]);

  // GPU warm-up: 6 rAF ticks at mount, then a 1fps heartbeat until IO fires.
  // Ticks 1-3 (p=0): flush geometry/material uploads, compile shaders.
  // Ticks 4-6 (p=0.3): exercise the opacity>0 tile paths, TrackingCallout
  //   card branch, and Math.sin() pulse that are unreachable at p=0 — ensures
  //   the transparent-render and compositor paths are warm before the approach.
  // Heartbeat (after warm-up): two frames every 1200ms keeps the GPU context
  //   alive during the ~30s helix scroll without competing at 60fps.
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
      // Ticks 4-6: non-zero progress warms tile opacity + callout paths.
      if (depth === 3) scrollProgressRef.current = 0.3;
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

  const [entranceVisible, setEntranceVisible] = useState(false);
  const entranceFiredRef = useRef(false);

  // Gates the 13MB cinematic background video's preload — decoupled from
  // entranceVisible (which can also flip true via the sgc:helix-exit event
  // or its 1200ms safety timeout, neither of which guarantee the section is
  // actually near the viewport). This flag is driven solely by the same
  // 600px-rootMargin IntersectionObserver used for frameloop below, so the
  // video never starts downloading until the user has scrolled close to it.
  const [videoNearViewport, setVideoNearViewport] = useState(false);
  // Helix→Shield seam: when the helix scroll progress crosses 0.95 the
  // HelixToShieldTransition marker fires `sgc:helix-exit`. We treat that
  // as permission to fade the shield in, so the helix logo's continuous
  // motion carries into the shield entrance rather than cutting off mid-
  // translation. Falls back to the IntersectionObserver trigger after a
  // 1200ms safety timeout (covers cases where the marker never fires,
  // e.g. user lands mid-page from a deep link).
  useEffect(() => {
    if (typeof window === "undefined") return;
    let fired = false;
    const fire = () => {
      if (fired) return;
      fired = true;
      entranceFiredRef.current = true;
      setEntranceVisible(true);
    };
    const onExit = () => fire();
    window.addEventListener("sgc:helix-exit", onExit);
    const safety = window.setTimeout(fire, 1200);
    return () => {
      window.removeEventListener("sgc:helix-exit", onExit);
      window.clearTimeout(safety);
    };
  }, []);

  const [titleActive, setTitleActive] = useState(false);
  const titleActiveRef = useRef(false);

  const onFinaleTitleStart = useCallback(() => {
    if (!titleActiveRef.current) {
      titleActiveRef.current = true;
      setTitleActive(true);
    }
  }, []);

  const onFinaleEnd = useCallback(() => {
    getLenis()?.start();
  }, []);

  useEffect(() => {
    if (!isFinale) {
      titleActiveRef.current = false;
      setTitleActive(false);
    }
  }, [isFinale]);

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

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          ioActivatedRef.current = true; // stops heartbeat
          setWarming(false);             // clean handoff to frameloop
          setVideoNearViewport(true);    // allow the background video to preload
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
          // Layer 5 — finale trigger: latch once when progress crosses FINALE_AT.
          // Lenis.stop() freezes scroll so the one-shot finale plays fully on-screen.
          if (!reducedMotionRef.current && !isFinaleRef.current && self.progress >= FINALE_AT) {
            isFinaleRef.current = true;
            setIsFinale(true);
            getLenis()?.stop();
          }
          // Reset when scrolled back below the threshold (only possible after Lenis
          // releases via onFinaleEnd in the finale wiring step). Hysteresis of 0.02
          // prevents immediately re-triggering if the user hovers at the boundary.
          else if (isFinaleRef.current && self.progress < FINALE_AT - 0.02) {
            isFinaleRef.current = false;
            setIsFinale(false);
            getLenis()?.start();
          }
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!reducedMotion) return;
    scrollProgressRef.current = 1;
  }, [reducedMotion]);

  // Native scroll fallback — fires on window.scrollTo (e.g. Playwright tests) when
  // Lenis hasn't yet driven a ScrollTrigger update for the new position. Skipped
  // once finale has latched: Lenis is frozen (getLenis()?.stop()) so the finale
  // sequence plays out fully on-screen, and this fallback has no awareness of
  // that latch — letting it keep writing scrollProgressRef during finale (e.g.
  // from residual native scroll/rubber-band events) can drag progress back
  // below SEQ_END and re-surface a hex caption underneath the already-visible
  // FinaleTitle.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      if (isFinaleRef.current) return;
      const totalRange = el.offsetHeight - window.innerHeight;
      if (totalRange <= 0) return;
      const progress = Math.max(0, Math.min(1, -el.getBoundingClientRect().top / totalRange));
      scrollProgressRef.current = progress;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Layer 6: mobile finale shield nudge — scale down + translate to clear
  // room for the title above the shield at 375px viewport.
  const mobileNudge = isFinale && viewportWidth <= 375
    ? { transform: "scale(0.78) translateY(2vh)", transformOrigin: "center bottom" }
    : {};

  // Desktop finale shield glide-right: the FinaleTitle sits on the left half
  // (left:3%, maxWidth:32vw) so the shield shifts right by ~10% of the viewport
  // to give the headline and subline breathing room. Same 3s cinematic ease as
  // the video background.
  const desktopGlide = isFinale && viewportWidth > 375
    ? "translateX(10%)"
    : "translateX(0)";

  return (
    <div ref={containerRef} style={{ height: "750vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: "calc(5rem + 0.5rem)",
          height: "calc(100dvh - 5.5rem)",
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#080B11",
          opacity: (reducedMotion || entranceVisible) ? 1 : 0,
          transform: (reducedMotion || entranceVisible) ? "scale(1)" : "scale(0.94)",
          transition: reducedMotion ? undefined : "opacity 0.7s ease-out, transform 0.7s ease-out",
          willChange: (!reducedMotion && !entranceVisible) ? "opacity, transform" : undefined,
        }}
      >
        {/* Cinematic shield background — plays once as section enters.
            The <video> tag itself is only mounted once videoNearViewport
            flips true (600px IntersectionObserver rootMargin, same signal
            that gates the WebGL canvas's frameloop above), so this 13MB
            asset never starts downloading on initial page load — only once
            the user has scrolled close to the section. Reduced-motion users
            never mount it at all: they get the static gradient backdrop
            only, consistent with every other pinned-scroll section on this
            page skipping autoplay video for that preference. */}
        {videoNearViewport && !reducedMotion && (
          <video
            autoPlay
            muted
            playsInline
            loop={false}
            preload="auto"
            src="/shield/Cinematic 3D animation of a blank heraldic shield_2.mp4"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.45,
              pointerEvents: "none",
              transform: isFinale ? "translateX(52%)" : "translateX(0)",
              transition: "transform 3s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        )}

        {/* Shield canvas — glides right on desktop finale, mobile nudge on small screens */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: desktopGlide,
            transition: "transform 3s cubic-bezier(0.22,1,0.36,1)",
            ...mobileNudge,
          }}
        >
          <ShieldCanvas
            scrollProgressRef={scrollProgressRef}
            reducedMotion={reducedMotion}
            frameloop={warming ? "always" : frameloop}
            viewportWidth={viewportWidth}
            isFinale={isFinale}
            onFinaleEnd={onFinaleEnd}
            onFinaleTitleStart={onFinaleTitleStart}
          />
        </div>

        {/* Vignette overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 2,
            background:
              "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 45%, rgba(8,11,17,0.7) 100%)",
          }}
        />

        {/* Stage progress — Problem/Solution/Outcome labels synced to scroll */}
        <StageProgress
          scrollProgressRef={scrollProgressRef}
          reducedMotion={reducedMotion}
          viewportWidth={viewportWidth}
        />

        {/* Intro categories — the 3 stage names shown BEFORE the hex callouts
            fire. Fades in at p=0 and clears by p=0.04, so it's fully gone
            before SEQ_START (0.03) advances into TRAVEL_END (~0.074). */}
        <ShieldIntroCategories
          scrollProgressRef={scrollProgressRef}
          reducedMotion={reducedMotion}
          viewportWidth={viewportWidth}
        />

        {/* Finale title overlay — rendered here (above canvas, below interactions) */}
        {isFinale && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 3,
            }}
          >
            <FinaleTitle start={titleActive} reducedMotion={reducedMotion} />
          </div>
        )}
      </div>
    </div>
  );
}

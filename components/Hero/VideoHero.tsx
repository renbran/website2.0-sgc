"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useNearViewportFlag } from "@/hooks/useNearViewportFlag";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * VideoHero — full-bleed autoplaying background-video hero.
 *
 * Replaces the scroll-pinned WebGL helix hero (DiamondScrollHero) with a plain
 * video backdrop. The video tells its own story, so there is no 600vh pin and
 * no `sgc:helix-progress` to publish; this component is deliberately
 * standalone — nothing downstream depends on its scroll state.
 *
 * Performance notes:
 * - The MP4s are silent by design. A 59 s clip with an audio track costs
 *   materially more bytes for a muted-by-default hero, and the hero must
 *   autoplay muted to be allowed to autoplay at all.
 * - The <video> is mounted only once the hero approaches the viewport, so a
 *   visitor who never reaches the top of the page never pays the download.
 * - `poster` carries the LCP paint. The previous hero's first paint was a
 *   Three.js canvas, which is why the brand watermark was rendered as a CSS
 *   background rather than an <img> (background images are not LCP candidates
 *   by spec). A poster frame keeps LCP on a still image.
 */

export interface VideoHeroProps {
  /** Content rendered above the video layer (headline, CTA, scroll hint). */
  children?: React.ReactNode;
  className?: string;
  /**
   * Autoplaying video must be muted to be permitted by browsers, so this
   * defaults to true and should stay true unless a source with an audio track
   * is supplied AND the user has had a chance to gesture.
   */
  muted?: boolean;
  poster?: string;
  /** Wide-viewport source. */
  src?: string;
  /** Narrow-viewport source, selected by a `max-width` media query. */
  srcSmall?: string;
}

const DEFAULT_SRC = "/videos/hero/hero-1280.mp4";
const DEFAULT_SRC_SMALL = "/videos/hero/hero-854.mp4";
const DEFAULT_POSTER = "/videos/hero/hero-poster.jpg";

export default function VideoHero({
  children,
  className,
  muted = true,
  poster = DEFAULT_POSTER,
  src = DEFAULT_SRC,
  srcSmall = DEFAULT_SRC_SMALL,
}: VideoHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const reducedMotion = useReducedMotion();
  const near = useNearViewportFlag(containerRef as RefObject<Element | null>);

  // Reduced motion never mounts the <video> at all: the poster frame is shown
  // on its own. This mirrors ShieldSection's reduced-motion path.
  const mountVideo = near && !reducedMotion;

  // Autoplay can still be refused (low-power mode, data saver). A rejected
  // play() must degrade silently to the poster rather than surface an error.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !mountVideo) return;
    const attempt = video.play();
    if (attempt && typeof attempt.catch === "function") attempt.catch(() => {});
  }, [mountVideo]);

  // Pause in a background tab — a playing 1080p video costs real CPU/battery
  // and no one is looking at it.
  useEffect(() => {
    if (!mountVideo) return;
    const video = videoRef.current;
    if (!video) return;
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        video.pause();
      } else {
        const attempt = video.play();
        if (attempt && typeof attempt.catch === "function") attempt.catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [mountVideo]);

  // Unmute on the first genuine user activation, if the caller asked for sound.
  //
  // scroll is deliberately NOT a trigger: Chrome refuses to resume media /
  // AudioContext from a scroll event, so listening for it would silently do
  // nothing in every major browser. Only discrete activations count.
  // See components/AudioToggle.tsx for the same reasoning in this codebase.
  useEffect(() => {
    if (muted || !mountVideo) return;
    const video = videoRef.current;
    if (!video) return;
    const onActivation = () => {
      video.muted = false;
      const attempt = video.play();
      if (attempt && typeof attempt.catch === "function") attempt.catch(() => {});
    };
    const events = ["pointerdown", "touchend", "keydown"] as const;
    events.forEach((e) =>
      window.addEventListener(e, onActivation, { passive: true, once: true })
    );
    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivation));
    };
  }, [muted, mountVideo]);

  return (
    <section
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        backgroundColor: "#080B11",
      }}
    >
      {mountVideo ? (
        <video
          ref={videoRef}
          autoPlay
          muted={muted}
          playsInline
          loop
          preload="metadata"
          poster={poster}
          // The video is decorative scenery; the accessible content is the
          // children layer below. Hiding the element (not its container) keeps
          // the <h1> exposed — aria-hidden on the <section> would hide that too.
          aria-hidden="true"
          tabIndex={-1}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            pointerEvents: "none",
          }}
        >
          {/* Narrow first so the mobile derivative wins on small viewports.
              Resolution order is declarative, so the correct file is chosen
              before hydration — no layout shift from swapping src in JS. */}
          <source src={srcSmall} media="(max-width: 767px)" type="video/mp4" />
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        // Reduced motion, or pre-intersection: a still frame of the same
        // artwork, so the hero never flashes an empty black box on arrival.
        <div
          role="presentation"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${poster})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Edge vignette — darkens corners without blocking the centre. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
          background:
            "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 50%, rgba(8,11,17,0.65) 100%)",
        }}
      />

      {/* Centre-weighted scrim for text legibility.
          The edge vignette alone is not enough: this hero source is a bright,
          daylight architectural render, and the subhead sits dead centre over
          the lightest part of the frame (sky + white facade), where it was
          unreadable. A soft elliptical darkening under the content column
          restores contrast on every frame without flattening the whole video
          or hiding the footage. Tuned against the actual hero source. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
          background:
            "radial-gradient(ellipse 62% 52% at 50% 52%, rgba(8,11,17,0.72) 0%, rgba(8,11,17,0.55) 45%, rgba(8,11,17,0.22) 72%, rgba(8,11,17,0) 100%)",
        }}
      />

      {/* Bottom gradient so the CTA keeps its contrast against whatever the
          video is doing in the lower third at that moment. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
          background:
            "linear-gradient(to bottom, rgba(8,11,17,0) 45%, rgba(8,11,17,0.55) 100%)",
        }}
      />

      {/* Content layer. Sits above the video and is NOT aria-hidden: the
          headline and any CTA must stay reachable by assistive tech and
          indexable by crawlers. */}
      <div
        className={className}
        style={{ position: "relative", zIndex: 3, height: "100%" }}
      >
        {children}
      </div>
    </section>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import VideoHero from "./VideoHero";
import VideoHeroContent from "./VideoHeroContent";

/**
 * HomeHero — the homepage hero: cinematic full-bleed video backdrop with the
 * headline layer on top.
 *
 * Replaces DiamondScrollHero (the 600vh GSAP-pinned three.js helix). This is
 * a deliberate replacement rather than a re-skin: the helix published
 * `sgc:helix-progress` for HeroIntroOverlay, HelixCanvas and
 * HelixToShieldTransition, and none of those have a scroll-driven equivalent
 * over a plain autoplay video.
 *
 * Consequences handled here:
 *  - The <h1> moved into VideoHeroContent (HeroIntroOverlay owned it).
 *  - `sgc:helix-exit` is fired once on mount so ShieldSection's entrance,
 *    which waits on that event, still resolves. ShieldSection also carries a
 *    1200ms safety timeout, so the seam degrades gracefully either way.
 */

/** True when the hero source has an audio track and the user has unmuted it. */
const AUDIBLE = false; // hero-1280/854.mp4 ship silent; flip with an audible source

export default function HomeHero() {
  const [soundOn, setSoundOn] = useState(false);
  const firedExit = useRef(false);

  // Let ShieldSection start its entrance. Previously this came from the helix
  // crossing 0.95 scroll progress; there is no scroll range now, so fire once
  // after the hero has painted rather than on mount, so the two do not race.
  useEffect(() => {
    if (firedExit.current) return;
    firedExit.current = true;
    const id = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("sgc:helix-exit"));
    }, 400);
    return () => window.clearTimeout(id);
  }, []);

  const toggleSound = useCallback(() => setSoundOn((v) => !v), []);

  return (
    <VideoHero muted={!soundOn}>
      <VideoHeroContent
        soundOn={soundOn}
        onToggleSound={AUDIBLE ? toggleSound : undefined}
      />
    </VideoHero>
  );
}

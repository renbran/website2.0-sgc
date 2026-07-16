"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DIAMONDS } from "@/components/HelixSpiral/diamonds.config";

// All 40 extracted helix animation frames. Converted from PNG to WebP
// (quality 82, ~91% smaller: 39.7MB -> 3.4MB total) since this component
// preloads every frame up front for the flipbook effect.
const FRAME_COUNT = 40;

// Batched + delayed preloading (mirrors components/ui/hero-scrub.tsx's
// pattern) so 40 image requests don't all fire in the same tick and
// compete with the rest of the page's initial load — this component only
// mounts when prefers-reduced-motion is set, but the flipbook frames still
// shouldn't stampede the network on mount.
const FRAME_BATCH_SIZE = 10;
const FRAME_BATCH_DELAY_MS = 100;

export const HELIX_FRAMES: string[] = Array.from(
  { length: FRAME_COUNT },
  (_, i) =>
    `/videos/video-frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.webp`
);

// Mid-animation frame used as the static backdrop
const STATIC_FRAME = HELIX_FRAMES[19];

export default function ReducedMotionFallback() {
  const [prefersReduced] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const [frameIdx, setFrameIdx] = useState(19);
  const preloadedRef = useRef(false);

  // Preload frames in small batches with a short delay between each, instead
  // of firing all 40 requests in the same tick. The static frame (index 19,
  // rendered immediately below via next/image + priority) is excluded since
  // it's already being fetched at full priority.
  useEffect(() => {
    if (preloadedRef.current) return;
    preloadedRef.current = true;

    const remaining = HELIX_FRAMES.filter((_, i) => i !== 19);
    let batchIndex = 0;

    const loadBatch = () => {
      const start = batchIndex * FRAME_BATCH_SIZE;
      const batch = remaining.slice(start, start + FRAME_BATCH_SIZE);
      if (batch.length === 0) return;

      batch.forEach((src) => {
        const img = new window.Image();
        img.src = src;
      });

      batchIndex++;
      if (start + FRAME_BATCH_SIZE < remaining.length) {
        setTimeout(loadBatch, FRAME_BATCH_DELAY_MS);
      }
    };

    loadBatch();
  }, []);

  // Animate only when motion is permitted (~15 fps)
  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(
      () => setFrameIdx((f) => (f + 1) % FRAME_COUNT),
      66
    );
    return () => clearInterval(id);
  }, [prefersReduced]);

  const activeSrc = prefersReduced ? STATIC_FRAME : HELIX_FRAMES[frameIdx];

  return (
    <section
      style={{
        minHeight: "100dvh",
        background: "#080B11",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "5rem 1.5rem",
      }}
    >
      {/* Helix frame backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.38,
          pointerEvents: "none",
        }}
      >
        <Image
          src={activeSrc}
          alt=""
          width={1280}
          height={720}
          priority={prefersReduced}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Radial vignette — darkens edges, focuses center */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 75% 75% at 50% 50%, transparent 20%, rgba(8,11,17,0.88) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "62rem",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-fraunces, serif)",
            fontSize: "clamp(1.4rem, 3.5vw, 2.25rem)",
            color: "#F4F1E8",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: "0.5rem",
            lineHeight: 1.2,
          }}
        >
          The Odoo Firm Your CFO Would Have Founded.
        </h2>

        <p
          style={{
            fontFamily: "monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            color: "#C7A23A",
            textAlign: "center",
            marginBottom: "3rem",
          }}
        >
          CPA&nbsp;·&nbsp;CIA&nbsp;·&nbsp;CRMA&nbsp;·&nbsp;CIPFA&nbsp;·&nbsp;ACCA&nbsp;·&nbsp;M.Econ
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "0.875rem",
          }}
        >
          {DIAMONDS.map((diamond) => (
            <div
              key={diamond.image}
              style={{
                background: "rgba(199,162,58,0.05)",
                border: "1px solid rgba(199,162,58,0.18)",
                borderRadius: "0.5rem",
                padding: "1.25rem",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-inter, sans-serif)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#F4F1E8",
                  marginBottom: "0.5rem",
                  lineHeight: 1.3,
                }}
              >
                {diamond.headline}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-inter, sans-serif)",
                  fontSize: "0.75rem",
                  color: "rgba(244,241,232,0.55)",
                  lineHeight: 1.5,
                }}
              >
                {diamond.subhead}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

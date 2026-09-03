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

// One-shot scroll reveal: opacity + translateY only, no parallax or
// continuous scroll-linked motion, so it stays compliant with
// prefers-reduced-motion (this component only ever mounts when that's set).
function FadeInCard({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 260ms ease-out ${index * 70}ms, transform 260ms ease-out ${index * 70}ms`,
      }}
    >
      {children}
    </div>
  );
}

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

  // diamonds[0] is the isCTA slot — its headline/subhead are the same copy
  // as the H2 + banner below, so the card grid only covers the 7 concrete
  // pain points (diamonds[1..7]) instead of repeating it.
  const painPoints = DIAMONDS.slice(1);

  return (
    <section
      style={{
        minHeight: "100dvh",
        background: "#080B11",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Hero banner strip — fixed height so the backdrop image covers it
          cleanly at any viewport width, then dissolves into the card list
          below instead of letterboxing across however tall the section
          gets with 7 stacked cards. */}
      <div
        style={{
          position: "relative",
          height: "clamp(200px, 38vw, 300px)",
          overflow: "hidden",
        }}
      >
        <Image
          src={activeSrc}
          alt=""
          aria-hidden="true"
          width={1280}
          height={720}
          priority={prefersReduced}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Ambient gold glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 70% at 50% 40%, rgba(199,162,58,0.14) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        {/* Fade into the card-list background — an intentional dissolve
            instead of the old hard letterbox edge. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 40%, #080B11 94%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 1.5rem",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-fraunces, serif)",
              fontSize: "clamp(1.4rem, 3.5vw, 2.25rem)",
              color: "#F4F1E8",
              fontWeight: 600,
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
            }}
          >
            CPA&nbsp;·&nbsp;CIA&nbsp;·&nbsp;CRMA&nbsp;·&nbsp;CIPFA&nbsp;·&nbsp;ACCA&nbsp;·&nbsp;M.Econ
          </p>
        </div>
      </div>

      {/* Card list */}
      <div
        style={{
          position: "relative",
          maxWidth: "62rem",
          margin: "0 auto",
          width: "100%",
          padding: "2.5rem 1.5rem 4rem",
        }}
      >
        <div
          className="sgc-rmf-grid"
          style={{
            display: "grid",
            gap: "1.25rem",
          }}
        >
          {painPoints.map((diamond, index) => (
            <FadeInCard key={diamond.image} index={index}>
              <div
                style={{
                  borderTop: "1px solid rgba(199,162,58,0.45)",
                  background: "rgba(244,241,232,0.03)",
                  borderRadius: "0.375rem",
                  padding: "1.5rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    color: "#C7A23A",
                    marginBottom: "0.6rem",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter, sans-serif)",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "#F4F1E8",
                    marginBottom: "0.5rem",
                    lineHeight: 1.35,
                  }}
                >
                  {diamond.headline}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter, sans-serif)",
                    fontSize: "0.8rem",
                    color: "rgba(244,241,232,0.55)",
                    lineHeight: 1.6,
                  }}
                >
                  {diamond.subhead}
                </p>
              </div>
            </FadeInCard>
          ))}
        </div>
        <style>{`
          .sgc-rmf-grid {
            grid-template-columns: 1fr;
          }
          @media (min-width: 480px) {
            .sgc-rmf-grid {
              grid-template-columns: 1fr 1fr;
            }
          }
        `}</style>
      </div>
    </section>
  );
}

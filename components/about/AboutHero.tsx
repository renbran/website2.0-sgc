"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { loadGsap } from "@/lib/lenis";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

const LICENSE_LINE =
  "Scholarix Global Consultants FZCO · License 45160 · DIEZ · Dubai Silicon Oasis";

export default function AboutHero() {
  const rootRef = useRef<HTMLElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !rootRef.current) return;
    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    // GSAP + ScrollTrigger load on demand — see lib/lenis.ts.
    void (async () => {
      const { gsap } = await loadGsap();
      if (cancelled || !rootRef.current) return;
      ctx = gsap.context(() => {
        // Depth-parallax orb: 3D perspective tilt scrubbed to scroll, the
        // first "3D scroll trigger" beat the page establishes.
        gsap.to(orbRef.current, {
          rotateX: 18,
          rotateY: -14,
          z: 80,
          yPercent: 22,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }, rootRef);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-[var(--bg)] pt-32 pb-24 md:pt-44 md:pb-32"
      style={{ perspective: "1200px" }}
    >
      <div
        ref={orbRef}
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[10%] h-[420px] w-[420px] rounded-full md:h-[560px] md:w-[560px]"
        style={{
          background:
            "radial-gradient(circle at 40% 35%, var(--accent-soft-2) 0%, transparent 68%)",
          transformStyle: "preserve-3d",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 text-center md:px-10">
        {/* Entrance animations were `motion.*` props; now one CSS keyframe with
            per-element delays, so the library stays out of the bundle. */}
        <style>{`
          @keyframes sgc-about-in {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: none; }
          }
          .sgc-about-in { animation: sgc-about-in 0.75s cubic-bezier(0.22, 1, 0.36, 1) both; }
          @media (prefers-reduced-motion: reduce) { .sgc-about-in { animation: none; } }
        `}</style>

        <div className={reduced ? "" : "sgc-about-in"}>
          <SectionEyebrow label="ABOUT SGC TECH AI" className="justify-center" />
        </div>

        <h1
          style={{ fontFamily: "var(--font-fraunces)", animationDelay: "0.1s" }}
          className={`text-[clamp(2.25rem,6vw,4.5rem)] font-bold leading-[1.05] text-[var(--text-primary)] ${reduced ? "" : "sgc-about-in"}`}
        >
          Built by Operators.
          <br />
          <span className="text-gold-gradient">Not Consultants.</span>
        </h1>

        <p
          style={{ animationDelay: "0.22s" }}
          className={`mx-auto mt-6 max-w-2xl text-[clamp(1rem,1.6vw,1.25rem)] leading-[1.65] text-[var(--text-secondary)] ${reduced ? "" : "sgc-about-in"}`}
        >
          We are the <span className="text-[var(--accent)]">Operational Physician</span> of
          the UAE Mid-Market — we diagnose the condition before we sell the cure.
        </p>

        <p
          style={{ fontFamily: "var(--font-mono)", animationDelay: "0.4s" }}
          className={`mt-8 text-[0.72rem] tracking-[0.14em] text-[var(--text-muted)] ${reduced ? "" : "sgc-about-in"}`}
        >
          {LICENSE_LINE}
        </p>
      </div>
    </section>
  );
}

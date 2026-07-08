"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

gsap.registerPlugin(ScrollTrigger);

const LICENSE_LINE =
  "Scholarix Global Consultants FZCO · License 45160 · DIEZA · Dubai Silicon Oasis";

export default function AboutHero() {
  const rootRef = useRef<HTMLElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !rootRef.current) return;
    const ctx = gsap.context(() => {
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
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-[var(--sgc-black)] pt-32 pb-24 md:pt-44 md:pb-32"
      style={{ perspective: "1200px" }}
    >
      <div
        ref={orbRef}
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[10%] h-[420px] w-[420px] rounded-full md:h-[560px] md:w-[560px]"
        style={{
          background:
            "radial-gradient(circle at 40% 35%, rgba(199,162,58,0.18) 0%, transparent 68%)",
          transformStyle: "preserve-3d",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 text-center md:px-10">
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionEyebrow label="ABOUT SGC TECH AI" className="justify-center" />
        </motion.div>

        <motion.h1
          initial={reduced ? {} : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: "var(--font-fraunces)" }}
          className="text-[clamp(2.25rem,6vw,4.5rem)] font-bold leading-[1.05] text-[var(--text-primary)]"
        >
          Built by Operators.
          <br />
          <span className="text-gold-gradient">Not Consultants.</span>
        </motion.h1>

        <motion.p
          initial={reduced ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-2xl text-[clamp(1rem,1.6vw,1.25rem)] leading-[1.65] text-[var(--text-secondary)]"
        >
          We are the <span className="text-[var(--accent)]">Operational Physician</span> of
          the UAE Mid-Market — we diagnose the condition before we sell the cure.
        </motion.p>

        <motion.p
          initial={reduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{ fontFamily: "var(--font-mono)" }}
          className="mt-8 text-[0.72rem] tracking-[0.14em] text-[var(--text-muted)]"
        >
          {LICENSE_LINE}
        </motion.p>
      </div>
    </section>
  );
}

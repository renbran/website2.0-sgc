"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LineChart, Cog, Cpu, CheckCircle2 } from "lucide-react";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

gsap.registerPlugin(ScrollTrigger);

const LAYERS = [
  {
    index: "01",
    icon: LineChart,
    title: "Financial Visibility",
    tag: "FOUNDATION LAYER",
    summary: "Clear financial intelligence driving executive decisions.",
    points: [
      "CFO Advisory & Leadership",
      "Financial Planning & Analysis",
      "Cash Flow Optimization",
      "Revenue Intelligence",
      "Compliance & Governance",
    ],
  },
  {
    index: "02",
    icon: Cog,
    title: "Operational Control",
    tag: "EXECUTION LAYER",
    summary: "Streamlined operations driving efficiency & scale.",
    points: [
      "Business Process Optimization",
      "Operational Excellence",
      "Performance Management",
      "Cost Structure Analysis",
      "KPI Framework Design",
    ],
  },
  {
    index: "03",
    icon: Cpu,
    title: "Technology Enablement",
    tag: "INNOVATION LAYER",
    summary: "Intelligent systems powering future-ready operations.",
    points: [
      "ERP Implementation",
      "AI-Powered Intelligence",
      "Automation & Integration",
      "Business Intelligence",
      "Digital Transformation",
    ],
  },
];

/**
 * TransformationFramework — pinned 3D depth-stack. Three layer cards sit at
 * different Z depths inside a shared perspective; scroll progress drives a
 * GSAP timeline that advances focus from card to card (incoming card glides
 * from behind into the foreground while the outgoing card pushes forward
 * and fades). Falls back to a static stacked list under reduced-motion.
 */
export default function TransformationFramework() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !rootRef.current) return;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length !== LAYERS.length) return;

    const ctx = gsap.context(() => {
      gsap.set(cards[0], { z: 0, yPercent: 0, opacity: 1, scale: 1 });
      gsap.set(cards[1], { z: -220, yPercent: 6, opacity: 0, scale: 0.88 });
      gsap.set(cards[2], { z: -440, yPercent: 12, opacity: 0, scale: 0.78 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=250%",
          scrub: 1,
          pin: pinRef.current,
          anticipatePin: 1,
        },
      });

      // Step 1: card 0 recedes forward-and-out, card 1 rises into focus.
      // Durations of 1 match the 1-unit gap between step labels, so each
      // transition fills its whole scroll span instead of snapping early.
      tl.to(cards[0], { z: 260, yPercent: -8, opacity: 0, scale: 1.08, duration: 1, ease: "power1.inOut" }, 0)
        .to(cards[1], { z: 0, yPercent: 0, opacity: 1, scale: 1, duration: 1, ease: "power1.inOut" }, 0)
        // Step 2: card 1 recedes, card 2 rises into focus.
        .to(cards[1], { z: 260, yPercent: -8, opacity: 0, scale: 1.08, duration: 1, ease: "power1.inOut" }, 1)
        .to(cards[2], { z: 0, yPercent: 0, opacity: 1, scale: 1, duration: 1, ease: "power1.inOut" }, 1);
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      aria-labelledby="framework-heading"
      className="relative bg-[var(--bg)]"
    >
      <div className="mx-auto max-w-6xl px-6 pt-16 md:px-10 md:pt-24">
        <div className="text-center">
          <SectionEyebrow label="THE FRAMEWORK" className="justify-center" />
          <h2
            id="framework-heading"
            style={{ fontFamily: "var(--font-fraunces)" }}
            className="text-[clamp(1.85rem,4vw,3rem)] font-bold leading-[1.15] text-[var(--text-primary)]"
          >
            Three layers. <span className="text-gold-gradient">One system.</span>
          </h2>
        </div>
      </div>

      {reduced ? (
        <div className="mx-auto mt-12 grid max-w-6xl gap-6 px-6 pb-20 md:grid-cols-3 md:px-10">
          {LAYERS.map((layer) => (
            <LayerCard key={layer.index} layer={layer} />
          ))}
        </div>
      ) : (
        <div
          ref={pinRef}
          className="relative mt-4 flex h-[100svh] items-center justify-center overflow-hidden"
          style={{ perspective: "1400px" }}
        >
          {LAYERS.map((layer, i) => (
            <div
              key={layer.index}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="absolute w-[min(90vw,640px)]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <LayerCard layer={layer} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function LayerCard({ layer }: { layer: (typeof LAYERS)[number] }) {
  const Icon = layer.icon;
  return (
    <div className="rounded-2xl border border-[rgba(199,162,58,0.22)] bg-[var(--surface)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:p-8">
      <div className="flex items-center justify-between">
        <span
          style={{ fontFamily: "var(--font-fraunces)" }}
          className="text-[1.1rem] font-bold text-[var(--accent)]"
        >
          {layer.index}
        </span>
        <Icon size={22} aria-hidden className="text-[var(--accent)]" />
      </div>
      <h3
        style={{ fontFamily: "var(--font-fraunces)" }}
        className="mt-4 text-[1.5rem] font-bold text-[var(--text-primary)]"
      >
        {layer.title}
      </h3>
      <p className="mt-2 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
        {layer.summary}
      </p>
      <ul className="mt-5 space-y-2.5">
        {layer.points.map((point) => (
          <li key={point} className="flex items-center gap-2.5">
            <CheckCircle2 size={14} aria-hidden className="shrink-0 text-[var(--accent)]" />
            <span className="text-[0.85rem] text-[var(--text-secondary)]">{point}</span>
          </li>
        ))}
      </ul>
      <p
        style={{ fontFamily: "var(--font-mono)" }}
        className="mt-6 text-[0.68rem] tracking-[0.16em] text-[var(--text-muted)]"
      >
        {layer.tag}
      </p>
    </div>
  );
}

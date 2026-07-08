"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const PHASES = [
  {
    step: "01",
    days: "DAYS 1–22",
    title: "Assess",
    points: ["Business architecture analysis", "Financial system audit", "Process mapping & gap analysis"],
  },
  {
    step: "02",
    days: "DAYS 23–45",
    title: "Design",
    points: ["Strategic framework design", "Technology architecture blueprint", "Implementation roadmap"],
  },
  {
    step: "03",
    days: "DAYS 46–75",
    title: "Implement",
    points: ["System deployment & integration", "Process automation execution", "Team training & change management"],
  },
  {
    step: "04",
    days: "DAYS 76–90",
    title: "Optimize",
    points: ["Performance monitoring & KPIs", "Continuous improvement cycle", "Strategic refinement & scaling"],
  },
];

export default function RoadmapTimeline() {
  const rootRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const markerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!pathRef.current) return;

    const markers = markerRefs.current.filter(Boolean) as HTMLDivElement[];

    if (reduced) {
      gsap.set(pathRef.current, { drawSVG: "100%" });
      gsap.set(markers, { opacity: 1, scale: 1 });
      return;
    }

    gsap.set(pathRef.current, { drawSVG: "0%" });
    gsap.set(markers, { opacity: 0, scale: 0.75 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 75%",
          end: "bottom 60%",
          scrub: 1,
        },
      });

      tl.to(pathRef.current, { drawSVG: "100%", ease: "none" }, 0);

      markers.forEach((marker, i) => {
        tl.to(
          marker,
          { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" },
          i / markers.length,
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      aria-labelledby="roadmap-heading"
      className="relative bg-[var(--sgc-black)] py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="text-center">
          <SectionEyebrow label="THE 90-DAY TRANSFORMATION ROADMAP" className="justify-center" />
          <h2
            id="roadmap-heading"
            style={{ fontFamily: "var(--font-fraunces)" }}
            className="text-[clamp(1.85rem,4vw,3rem)] font-bold leading-[1.15] text-[var(--text-primary)]"
          >
            From diagnosis to <span className="text-gold-gradient">day 90.</span>
          </h2>
        </div>

        <div className="relative mt-16">
          {/* Connector line — draws left-to-right as the section scrolls into view. */}
          <svg
            aria-hidden
            viewBox="0 0 1000 4"
            preserveAspectRatio="none"
            className="pointer-events-none absolute left-0 right-0 top-[26px] hidden h-[4px] w-full md:block"
          >
            <path
              ref={pathRef}
              d="M20 2 L980 2"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>

          <div className="grid gap-8 md:grid-cols-4 md:gap-6">
            {PHASES.map((phase, i) => (
              <div key={phase.step} className="relative">
                <div
                  ref={(el) => {
                    markerRefs.current[i] = el;
                  }}
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(199,162,58,0.4)] bg-[var(--surface)]"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  <span className="text-[1rem] font-bold text-[var(--accent)]">{phase.step}</span>
                </div>

                <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <p
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="text-[0.68rem] tracking-[0.16em] text-[var(--text-muted)]"
                  >
                    {phase.days}
                  </p>
                  <h3
                    style={{ fontFamily: "var(--font-fraunces)" }}
                    className="mt-1.5 text-[1.2rem] font-bold text-[var(--text-primary)]"
                  >
                    {phase.title}
                  </h3>
                  <ul className="mt-3 space-y-1.5">
                    {phase.points.map((point) => (
                      <li key={point} className="text-[0.8rem] leading-[1.5] text-[var(--text-secondary)]">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

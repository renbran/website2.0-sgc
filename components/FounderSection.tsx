"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import LivingCard from "@/components/ui/LivingCard";
import GoldDrawIn from "@/components/ui/GoldDrawIn";
import CtaButton from "@/components/ui/CtaButton";

const FOUNDER_AVATAR_PLACEHOLDER =
  "https://res.cloudinary.com/dsl5fhclj/image/upload/v1782135617/no3vpkxd88fy1uhytuhp.png?w=400&auto=format&q=80&fit=crop";
const MOHSIN_IMG = FOUNDER_AVATAR_PLACEHOLDER;
const RENBRAN_IMG = FOUNDER_AVATAR_PLACEHOLDER;

const FIRM_PILLARS = [
  {
    stat: "15+ Years",
    label: "UAE & international finance\nleadership experience",
  },
  {
    stat: "Practitioner-Led",
    label: "Every engagement led by a named\nsenior consultant — not a junior",
  },
  {
    stat: "Fixed Delivery",
    label: "Fixed price · Fixed timeline\nNo surprise invoices",
  },
];

const founders = [
  {
    img: MOHSIN_IMG,
    alt: "Mohsin Ali — Co-Founder, Finance Strategy & Advisory",
    name: "Mohsin Ali",
    role: "Co-Founder — Finance Strategy & Advisory",
    credentials: "CFO · Group CFO · Financial Controller · 15+ Years · UAE & International",
    credentialsGold: false,
    domains: ["Real Estate", "Petrochemicals", "Healthcare", "International Groups", "UAE Mid-Market"],
    message:
      "I own the financial strategy, decision-making, and compliance at SGC — the CFO-level judgment that keeps clients protected and in control. Across 15+ years in senior finance seats I've seen what quietly breaks businesses, and I bring the partnerships and advisory depth that turn good intentions into sound decisions.",
    quote: "Compliance isn't paperwork. It's the difference between a business that lasts and one that gets blindsided.",
  },
  {
    img: RENBRAN_IMG,
    alt: "Renbran Anthony Madelo — Co-Founder, Product & Technical Delivery",
    name: "Renbran Anthony Madelo",
    role: "Co-Founder — Product & Technical Delivery",
    credentials: "CMA · ERP Lead · AI/ML · Finance Automation · 200+ Apps Built",
    credentialsGold: true,
    domains: ["ERP Implementation", "Finance Automation", "AI Workflows", "KPI Dashboards", "Multi-Currency Controls"],
    message:
      "I own product and execution — turning financial strategy into systems that actually run. I've led ERP and automation across UAE real estate and property-development groups, compressing financial close from 10 days to 4 and cutting manual work by 70%. My own finance background means I understand the strategy I'm building for — so nothing gets lost between advice and delivery.",
    quote: "You don't figure it out — we've already built it, proven it, and delivered it.",
  },
];

export default function FounderSection() {
  const reduced = useReducedMotion();

  return (
    <section
      id="founder"
      aria-labelledby="founder-heading"
      className="scroll-mt-20 bg-[var(--sgc-black)] pt-10 pb-14 md:pt-14 md:pb-20"
    >
      <GoldDrawIn />

      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">

        {/* Heading */}
        <RevealOnScroll>
          <div className="text-center max-w-2xl mx-auto">
            <h2
              id="founder-heading"
              style={{ fontFamily: "var(--font-fraunces)" }}
              className="text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.1] text-[var(--sgc-text-primary)]"
            >
              Two of us. One firm. No handoffs.
            </h2>
            {/* Firm voice — one Fraunces italic sentence */}
            <p
              style={{ fontFamily: "var(--font-fraunces)" }}
              className="mt-4 text-[clamp(0.95rem,1.2vw,1.1rem)] italic leading-[1.7] text-[rgba(212,165,116,0.8)]"
            >
              Two founders, one firm — finance strategy and the system that delivers it.
              Because we both speak finance, nothing is lost between advice and execution.
            </p>
          </div>
        </RevealOnScroll>

        {/* Three-pillar strip */}
        <RevealOnScroll delay={0.1}>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[rgba(199,162,58,0.15)] border border-[rgba(199,162,58,0.15)] rounded-xl max-w-3xl mx-auto overflow-hidden">
            {FIRM_PILLARS.map((pillar) => (
              <div key={pillar.stat} className="px-6 py-5 pb-6 sm:pb-5 text-center">
                <p
                  style={{ fontFamily: "var(--font-fraunces)" }}
                  className="text-[1.1rem] font-bold text-[var(--accent)]"
                >
                  {pillar.stat}
                </p>
                <p
                  style={{ fontFamily: "var(--font-inter)" }}
                  className="mt-1 text-[0.78rem] leading-[1.55] text-text-muted whitespace-pre-line"
                >
                  {pillar.label}
                </p>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        {/* Thin gold rule */}
        <div className="max-w-xs mx-auto mt-10 mb-10 h-px bg-gradient-to-r from-transparent via-[rgba(199,162,58,0.25)] to-transparent" />

        {/* Two-column founder cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {founders.map((founder, i) => (
            <RevealOnScroll key={founder.name} delay={i * 0.1}>
              <LivingCard>
                <div className="h-full p-6 rounded-xl bg-[var(--surface)] border border-[rgba(199,162,58,0.18)] transition-shadow duration-300 hover:shadow-[0_6px_28px_rgba(199,162,58,0.07)] flex flex-col gap-4">

                  {/* Photo + identity */}
                  <div className="flex items-start gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border border-[rgba(199,162,58,0.3)] flex-shrink-0">
                      <Image
                        src={founder.img}
                        alt={founder.alt}
                        fill
                        sizes="(max-width: 768px) 96px, 128px"
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3
                        style={{ fontFamily: "var(--font-fraunces)" }}
                        className="text-[1rem] text-[var(--sgc-text-primary)] leading-tight"
                      >
                        {founder.name}
                      </h3>
                      <p
                        style={{ fontFamily: "var(--font-mono)" }}
                        className="mt-0.5 text-[0.65rem] tracking-[0.13em] text-[var(--accent)]"
                      >
                        {founder.role}
                      </p>
                      <p
                        style={{ fontFamily: "var(--font-mono)" }}
                        className={`mt-1 text-[0.6rem] tracking-[0.06em] leading-[1.6] break-words ${
                          founder.credentialsGold
                            ? "text-[var(--accent)]"
                            : "text-text-muted"
                        }`}
                      >
                        {founder.credentials}
                      </p>
                    </div>
                  </div>

                  {/* Domain expertise tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {founder.domains.map((domain) => (
                      <span
                        key={domain}
                        style={{ fontFamily: "var(--font-mono)" }}
                        className="inline-block px-2 py-0.5 rounded text-[0.6rem] tracking-[0.06em] bg-[rgba(199,162,58,0.07)] border border-[rgba(199,162,58,0.18)] text-text-muted"
                      >
                        {domain}
                      </span>
                    ))}
                  </div>

                  {/* Message */}
                  <p
                    style={{ fontFamily: "var(--font-inter)" }}
                    className="text-[0.88rem] leading-[1.72] text-text-secondary flex-1"
                  >
                    {founder.message}
                  </p>

                  {/* Pull quote */}
                  <motion.blockquote
                    variants={
                      reduced
                        ? undefined
                        : {
                            hidden: { opacity: 0, y: 6 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
                          }
                    }
                    initial={reduced ? undefined : "hidden"}
                    whileInView={reduced ? undefined : "visible"}
                    viewport={{ once: true, margin: "-40px" }}
                    className="border-l-2 border-[var(--accent)] pl-4"
                  >
                    <p
                      style={{ fontFamily: "var(--font-fraunces)" }}
                      className="text-[0.9rem] italic text-[var(--accent)] leading-snug"
                    >
                      &ldquo;{founder.quote}&rdquo;
                    </p>
                  </motion.blockquote>

                </div>
              </LivingCard>
            </RevealOnScroll>
          ))}
        </div>

        {/* CTA */}
        <RevealOnScroll delay={0.2}>
          <div className="flex justify-center mt-8">
            <CtaButton href="#contact" className="px-7">
              Book a Discovery Call With a Founder →
            </CtaButton>
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
}

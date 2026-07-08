import { Landmark, Cog, ShieldCheck, Cpu, Compass, Globe2 } from "lucide-react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import LivingCard from "@/components/ui/LivingCard";

const FOUNDERS = [
  {
    icon: Landmark,
    initials: "MA",
    name: "Mohsin Ali",
    role: "Strategic Finance Leader",
    highlights: [
      "CFO Leadership for Multi-Billion Dollar Enterprises",
      "International Business Transformation",
      "M&A Advisory & Capital Strategy",
    ],
    quote: "The auditor doesn't care that your books are 'mostly right.' We make them defensible.",
  },
  {
    icon: Cog,
    initials: "RM",
    name: "Renbran Madelo",
    role: "Systems & Technology Expert",
    highlights: [
      "Enterprise Architecture & ERP Implementation",
      "AI-Powered Business Intelligence",
      "Digital Transformation Leadership",
    ],
    quote: "I'm an operator, not a consultant. I've closed the books you're trying to close.",
  },
];

const TRACK_RECORD = [
  {
    icon: Landmark,
    label: "Finance",
    items: [
      { title: "CFO Leadership", detail: "Multiple Enterprise Transformations" },
      { title: "Financial Strategy", detail: "M&A & Capital Advisory" },
      { title: "Cash Flow Optimization", detail: "$2B+ Revenue Managed" },
    ],
  },
  {
    icon: ShieldCheck,
    label: "Governance",
    items: [
      { title: "Board Advisory", detail: "Public & Private Companies" },
      { title: "Compliance Frameworks", detail: "Multi-Jurisdictional Expertise" },
      { title: "Risk Management", detail: "Enterprise Risk Assessment" },
    ],
  },
  {
    icon: Cpu,
    label: "Technology",
    items: [
      { title: "ERP Implementation", detail: "50+ Successful Deployments" },
      { title: "AI Integration", detail: "Machine Learning Systems" },
      { title: "Digital Architecture", detail: "Cloud & On-Premise Solutions" },
    ],
  },
  {
    icon: Compass,
    label: "Transformation",
    items: [
      { title: "Business Turnarounds", detail: "Operational Excellence Programs" },
      { title: "Change Management", detail: "Organizational Alignment" },
      { title: "Growth Strategy", detail: "Scale & Expansion Advisory" },
    ],
  },
];

export default function LeadershipSection() {
  return (
    <section
      id="leadership"
      aria-labelledby="leadership-heading"
      className="scroll-mt-20 bg-[var(--bg)] py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <RevealOnScroll>
          <div className="text-center">
            <SectionEyebrow label="LEADERSHIP" className="justify-center" />
            <h2
              id="leadership-heading"
              style={{ fontFamily: "var(--font-fraunces)" }}
              className="text-[clamp(1.85rem,4vw,3rem)] font-bold leading-[1.15] text-[var(--text-primary)]"
            >
              Leadership you <span className="text-gold-gradient">can trust.</span>
            </h2>
          </div>
        </RevealOnScroll>

        {/* Founder cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {FOUNDERS.map((founder, i) => {
            const Icon = founder.icon;
            return (
              <RevealOnScroll key={founder.name} delay={i * 0.1}>
                <LivingCard>
                  <div className="h-full rounded-2xl border border-[rgba(199,162,58,0.2)] bg-[var(--surface)] p-6 md:p-8">
                    <div className="relative inline-flex">
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--sgc-black)] ring-1 ring-[rgba(199,162,58,0.35)]"
                        aria-hidden
                      >
                        <span
                          style={{ fontFamily: "var(--font-fraunces)" }}
                          className="text-[1.35rem] font-bold text-gold-gradient"
                        >
                          {founder.initials}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--surface)] bg-[var(--sgc-black)]">
                        <Icon size={13} aria-hidden className="text-[var(--accent)]" />
                      </div>
                    </div>
                    <h3
                      style={{ fontFamily: "var(--font-fraunces)" }}
                      className="mt-4 text-[1.35rem] font-bold text-[var(--text-primary)]"
                    >
                      {founder.name}
                    </h3>
                    <p
                      style={{ fontFamily: "var(--font-mono)" }}
                      className="mt-1 text-[0.72rem] tracking-[0.14em] text-[var(--accent)]"
                    >
                      {founder.role.toUpperCase()}
                    </p>
                    <ul className="mt-4 space-y-1.5">
                      {founder.highlights.map((h) => (
                        <li key={h} className="text-[0.85rem] leading-[1.6] text-[var(--text-secondary)]">
                          {h}
                        </li>
                      ))}
                    </ul>
                    <blockquote className="mt-5 border-l-2 border-[var(--accent)] pl-4">
                      <p
                        style={{ fontFamily: "var(--font-fraunces)" }}
                        className="text-[0.95rem] italic text-[var(--accent)] leading-snug"
                      >
                        &ldquo;{founder.quote}&rdquo;
                      </p>
                    </blockquote>
                  </div>
                </LivingCard>
              </RevealOnScroll>
            );
          })}
        </div>

        {/* Track record grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRACK_RECORD.map((group, i) => {
            const Icon = group.icon;
            return (
              <RevealOnScroll key={group.label} delay={0.1 + i * 0.05}>
                <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <div className="flex items-center gap-2.5">
                    <Icon size={18} aria-hidden className="text-[var(--accent)]" />
                    <h4
                      style={{ fontFamily: "var(--font-fraunces)" }}
                      className="text-[1rem] font-bold text-[var(--text-primary)]"
                    >
                      {group.label}
                    </h4>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {group.items.map((item) => (
                      <li key={item.title}>
                        <p className="text-[0.82rem] font-medium text-[var(--text-secondary)]">
                          {item.title}
                        </p>
                        <p className="text-[0.72rem] text-[var(--text-muted)]">{item.detail}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        <RevealOnScroll delay={0.2}>
          <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl bg-[var(--sgc-black)] px-6 py-5 text-center">
            <Globe2 size={20} aria-hidden className="shrink-0 text-[var(--accent)]" />
            <p className="text-[0.85rem] text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)]">
                International Business Leadership
              </span>{" "}
              — Cross-Border Operations &amp; Global Best Practices
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

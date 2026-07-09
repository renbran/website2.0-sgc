import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import GoldDrawIn from "@/components/ui/GoldDrawIn";
import LivingCard from "@/components/ui/LivingCard";
import ProximityCtaButton from "@/components/ui/ProximityCtaButton";
import ScrollParallax from "@/components/ui/ScrollParallax";
import SheenLayer from "@/components/ui/SheenLayer";
import GlassCard from "@/components/ui/GlassCard";
import CtaButton from "@/components/ui/CtaButton";

const WHATSAPP_NUMBER = "971521985231";
const WHATSAPP_PRESET = {
  audit: "Hi SGC, I'd like to book a Finance Operations Audit.",
  implementation: "Hi SGC, we're ready to start Direct Implementation.",
  founder: "Hi SGC, I'd like to book a Founder Call.",
};

type ContactOption = {
  eyebrow: string;
  title: string;
  body: string;
  bestWhen: string;
  cta: string;
  href: string;
  whatsappHref: string;
  featured?: boolean;
};

const options: ContactOption[] = [
  {
    eyebrow: "OPTION A · FROM AED 5,000",
    title: "Finance Operations Audit",
    body: "We audit your finance operations, compliance posture, and reporting — regardless of what systems you run. VAT, Corporate Tax, PDPL, goAML, RERA, financial visibility, and operational time-waste. Diagnosed by a finance-credentialed team. 50% of the audit fee is credited to implementation if you proceed within 90 days.",
    bestWhen: "'I want to know exactly what's broken before I buy anything.'",
    cta: "Book a Finance Operations Audit →",
    href: "mailto:info@sgctech.ai?subject=Finance%20Operations%20Audit%20Request",
    whatsappHref: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      WHATSAPP_PRESET.audit,
    )}`,
  },
  {
    eyebrow: "OPTION B · FROM AED 15,000",
    title: "Direct Implementation",
    body: "Start with a Discovery workshop next week. Order Form within 10 working days. Go-live within your tier's timeline. Go-live guarantee in writing.",
    bestWhen: "'We've decided. We need to move now.'",
    cta: "Start Discovery →",
    href: "mailto:info@sgctech.ai?subject=Direct%20Implementation%20Request",
    whatsappHref: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      WHATSAPP_PRESET.implementation,
    )}`,
    featured: true,
  },
  {
    eyebrow: "OPTION C · FREE · 30 MIN",
    title: "Founder Call",
    body: "Have specific questions, technical concerns, or stakeholders not in this room? Book a deep-dive directly with the founder.",
    bestWhen: "'I need to walk my CFO through this first.'",
    cta: "Book a Founder Call",
    href: "mailto:info@sgctech.ai?subject=Founder%20Call%20Request",
    whatsappHref: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      WHATSAPP_PRESET.founder,
    )}`,
  },
];

const nextSteps = [
  {
    number: "①",
    heading: "You reach out",
    body: "No form. Just email.",
  },
  {
    number: "②",
    heading: "We respond",
    body: "Within one business day. Founder-level. Not a sales rep.",
  },
  {
    number: "③",
    heading: "You get a clear answer",
    body: '"We can help — here\'s how." Or honestly: "We can\'t."',
  },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative scroll-mt-20 bg-[var(--bg)] pt-10 pb-14 md:pt-14 md:pb-20"
    >
      <ScrollParallax amplitude={20} className="pointer-events-none absolute inset-0">
        <div aria-hidden className="absolute inset-x-0 top-0 h-1/2 bg-[var(--accent-faint)]" />
      </ScrollParallax>
      <GoldDrawIn />
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        <RevealOnScroll>
          <SectionEyebrow label="NEXT STEPS" />
          <h2
            id="contact-heading"
            style={{ fontFamily: "var(--font-fraunces)" }}
            className="max-w-4xl text-[clamp(2rem,4.5vw,3.75rem)] font-extrabold leading-[1.1] text-[var(--sgc-text-primary)]"
          >
            Three ways to start. Pick one today.
          </h2>
          <p
            style={{ fontFamily: "var(--font-inter)" }}
            className="mt-5 max-w-[42rem] text-[clamp(1.05rem,1.4vw,1.35rem)] font-medium leading-[1.5] text-[var(--sgc-text-muted)]"
          >
            Each option is non-binding until an Order Form is signed.
          </p>
        </RevealOnScroll>

        {/* What happens next — desktop dashed connector added */}
        <div className="relative mt-12">
          <span
            aria-hidden
            className="pointer-events-none absolute top-7 left-[12%] right-[12%] hidden h-px sm:block"
            style={{
backgroundImage:
                 "linear-gradient(90deg, var(--accent-strong) 50%, transparent 0)",
              backgroundSize: "8px 1px",
              backgroundRepeat: "repeat-x",
              animation: "sgc-connector 1.6s linear infinite",
            }}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {nextSteps.map((step, index) => (
              <RevealOnScroll key={step.number} delay={0.1 + index * 0.1}>
                <LivingCard>
                  <div className="relative h-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 transition duration-300 ease-out hover:-translate-y-[3px] hover:border-[var(--accent-strong)] hover:shadow-[0_8px_24px_var(--accent-glow)]">
                    <p
                      style={{ fontFamily: "var(--font-mono)" }}
                      className="text-[1.1rem] font-bold text-[var(--accent)] opacity-70"
                    >
                      {step.number}
                    </p>
                    <p
                      style={{ fontFamily: "var(--font-inter)" }}
                      className="mt-2 text-[0.95rem] font-semibold text-[var(--sgc-text-primary)]"
                    >
                      {step.heading}
                    </p>
                    <p className="mt-1 text-[0.85rem] leading-[1.6] text-[var(--sgc-text-muted)]">
                      {step.body}
                    </p>
                  </div>
                </LivingCard>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        <div className="my-16 grid gap-6 md:grid-cols-3">
          {options.map((option) => (
            <RevealOnScroll key={option.title}>
              <GlassCard as="article" featured={!!option.featured} className="relative" contentClassName="flex min-h-[26rem] flex-col p-8">
                {option.featured && <SheenLayer />}
                <p
                  style={{ fontFamily: "var(--font-inter)" }}
                  className="text-[0.74rem] font-semibold uppercase tracking-[0.2em] text-[var(--accent-copper)]"
                >
                  {option.eyebrow}
                </p>
                <h3
                  style={{ fontFamily: "var(--font-fraunces)" }}
                  className="mt-4 text-[1.5rem] font-bold text-[var(--sgc-text-primary)]"
                >
                  {option.title}
                </h3>
                <p className="mt-4 max-w-prose text-[0.95rem] leading-[1.7] text-[var(--sgc-text-muted)]">
                  {option.body}
                </p>
                <p className="mt-4 text-[0.85rem] font-semibold text-[var(--text-secondary)]">
                  Best when: {option.bestWhen}
                </p>

                {option.featured ? (
                  <ProximityCtaButton
                    href={option.href}
                    className="mt-auto w-full px-4 py-3"
                  >
                    {option.cta}
                  </ProximityCtaButton>
                ) : (
                  <CtaButton
                    href={option.href}
                    variant="secondary"
                    className="mt-auto w-full px-4 py-3"
                  >
                    {option.cta}
                  </CtaButton>
                )}

                {/* WhatsApp channel — preferred by UAE buyers */}
                <a
                  href={option.whatsappHref}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-2 inline-flex items-center justify-center gap-2 text-[0.78rem] font-medium text-[var(--sgc-text-muted)] transition duration-200 hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-3.5 w-3.5"
                  >
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276.992 4.974 0 5.46-3.95 7.296-9.51 1.79-12.99-3.404-2.155-8.213-.775-10.218 2.706-1.79 3.115-.79 7.564 2.454 9.32l-.61 2.23 1.61-.766zm10.18-9.36c-.05-.084-.182-.135-.382-.236-.2-.1-.5-.247-.96-.473-1.61-.8-2.485-1.34-2.844-1.605-.42-.31-.55-.247-.91-.247-.36 0-.71.05-.96.247-.25.198-.96.937-1.07 1.087-.11.15-.21.198-.41.05-.2-.148-1.6-.588-3.05-1.873-1.13-.99-1.89-2.21-2.11-2.585-.22-.37-.02-.57.16-.755.16-.165.36-.42.54-.63.18-.21.24-.36.36-.61.12-.247.06-.46-.03-.645-.08-.184-1.07-2.585-1.47-3.535-.39-.93-.78-.81-1.07-.82-.27-.01-.59-.01-.91-.01-.32 0-.84.12-1.28.59-.44.47-1.69 1.65-1.69 4.025 0 2.375 1.73 4.66 1.97 4.985.24.32 3.4 5.197 8.24 7.29 1.15.5 2.05.8 2.75 1.025 1.16.37 2.21.32 3.04.19.93-.14 2.86-1.17 3.27-2.3.4-1.13.4-2.1.28-2.3z" />
                  </svg>
                  Or WhatsApp · +971 52 198 5231 →
                </a>
              </GlassCard>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

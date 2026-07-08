import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import GoldDrawIn from "@/components/ui/GoldDrawIn";

const faqs = [
  {
    question: "We already run Odoo and it isn't working. Can you fix an existing installation?",
    answer:
      "Yes — that is exactly what the Finance Operations Audit is for. We audit what you have, regardless of who built it, tell you what is salvageable, and give you a costed plan. 50% of the audit fee is credited to implementation if you proceed within 90 days.",
  },
  {
    question: "Who owns the system and our data?",
    answer:
      "You do. The platform is built on an open-source Odoo core running in your own instance, hosted in AWS or Azure Middle East regions with daily backups, and processed in line with UAE PDPL.",
  },
  {
    question: "What happens if we stop the subscription?",
    answer:
      "Your Odoo core and your data remain yours — nothing is held hostage. The subscription covers the AI operating layer, monitoring, security patching, and support; when it ends, those services stop, but the system and its data stay with you.",
  },
  {
    question: "How disruptive is implementation?",
    answer:
      "Timelines are fixed per tier — from 2–3 weeks on Starter to 10–16 weeks on Enterprise — and agreed in writing before we start. Go-live is staged so your team keeps working, and hypercare after launch is part of delivery.",
  },
  {
    question: "Why is the subscription mandatory?",
    answer:
      "Because an unmaintained system decays into exactly the mess you came to us with. The subscription funds AI task capacity, hosting, security, backups, and the compliance updates that UAE regulation keeps generating — and it keeps us accountable after go-live, which is why the go-live guarantee goes in writing.",
  },
  {
    question: "How do we verify your credentials and case numbers?",
    answer:
      "Ask. Credentials (CPA, CIA, CRMA, ACCA, CIPFA) are held by the named founders and can be confirmed with the issuing bodies. Case figures come from live client systems; we share the audit trail and arrange reference calls under NDA after Discovery.",
  },
];

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative scroll-mt-20 bg-[var(--sgc-gradient-bg)] pt-10 pb-14 md:pt-14 md:pb-20"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <GoldDrawIn />
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        <RevealOnScroll>
          <SectionEyebrow label="FAQ" />
          <h2
            id="faq-heading"
            style={{ fontFamily: "var(--font-fraunces)" }}
            className="max-w-4xl text-[clamp(2rem,4.5vw,3.75rem)] font-extrabold leading-[1.1] text-[var(--sgc-text-primary)]"
          >
            Questions founders actually ask.
          </h2>
          <p
            style={{ fontFamily: "var(--font-inter)" }}
            className="mt-5 max-w-[42rem] text-[clamp(1.05rem,1.4vw,1.35rem)] font-medium leading-[1.5] text-[var(--sgc-text-muted)]"
          >
            Straight answers — the same ones you&apos;d get on a call.
          </p>
        </RevealOnScroll>

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {faqs.map((faq, index) => (
            <RevealOnScroll key={faq.question} delay={index * 0.05}>
              <details className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition duration-300 ease-out hover:border-[rgba(199,162,58,0.3)] open:border-[rgba(199,162,58,0.3)]">
                <summary
                  style={{ fontFamily: "var(--font-inter)" }}
                  className="flex cursor-pointer select-none items-center justify-between gap-4 px-6 py-5 text-[1rem] font-semibold text-[var(--sgc-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sgc-cyan)] rounded-2xl"
                >
                  {faq.question}
                  <span
                    aria-hidden
                    className="shrink-0 text-[var(--accent-copper)] transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="border-t border-[var(--border)] px-6 pb-6 pt-4 text-[0.95rem] leading-[1.7] text-[var(--sgc-text-muted)]">
                  {faq.answer}
                </p>
              </details>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

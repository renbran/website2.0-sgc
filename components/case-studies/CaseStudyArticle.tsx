import GoldDrawIn from "@/components/ui/GoldDrawIn";
import CtaButton from "@/components/ui/CtaButton";

export interface CaseStudySection {
  question: string;
  answer: string;
  detail?: string;
}

export interface CaseStudyArticleProps {
  eyebrow: string;
  h1: string;
  answerBlock: string;
  shortAnswer: string[];
  sections: CaseStudySection[];
  results: { label: string; value: string }[];
  quote: { text: string; attribution: string };
  faqs: { q: string; a: string }[];
  publishedDate: string;
  updatedDate: string;
  internalLinks: { label: string; href: string }[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

// Shared layout for anonymized case studies. Same answer-engine skeleton as
// ServiceArticle (question H1 → direct answer → short-answer box → question
// H2s → data table → FAQ), with a results table and client quote in place of
// the pricing comparison. Clients are described, never named.
export default function CaseStudyArticle({
  eyebrow,
  h1,
  answerBlock,
  shortAnswer,
  sections,
  results,
  quote,
  faqs,
  publishedDate,
  updatedDate,
  internalLinks,
}: CaseStudyArticleProps) {
  return (
    <main id="main" className="relative min-h-screen w-full bg-[var(--sgc-gradient-bg)] pt-28 pb-24 md:pt-36 md:pb-32">
      <GoldDrawIn />
      <article className="mx-auto max-w-3xl px-6 md:px-10">
        <p
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent-copper)]"
        >
          {eyebrow}
        </p>

        <h1
          style={{ fontFamily: "var(--font-fraunces)" }}
          className="mt-3 text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.1] text-[var(--sgc-text-primary)]"
        >
          {h1}
        </h1>

        {/* Answer block — first 40-60 words, above the fold, no preamble. */}
        <p className="mt-6 text-[1.15rem] font-medium leading-[1.65] text-[var(--sgc-text-primary)]">
          {answerBlock}
        </p>

        {/* Short-answer summary box */}
        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--accent)]"
          >
            At a glance
          </p>
          <ul className="mt-3 space-y-2">
            {shortAnswer.map((line) => (
              <li key={line} className="flex gap-2.5 text-[0.95rem] leading-[1.6] text-[var(--sgc-text-primary)]">
                <span className="shrink-0 text-[var(--accent)]">✓</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.78rem] text-[var(--sgc-text-muted)]">
          <a href="/about" className="font-semibold text-[var(--accent)] hover:underline">
            SGC Tech AI
          </a>
          <span>· Client anonymized on request · figures from a signed case study</span>
          <span>· Published {formatDate(publishedDate)}</span>
          <span>· Updated {formatDate(updatedDate)}</span>
        </div>

        {/* Sub-question sections */}
        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <section key={s.question}>
              <h2
                style={{ fontFamily: "var(--font-fraunces)" }}
                className="text-[clamp(1.4rem,2.5vw,1.75rem)] font-bold text-[var(--sgc-text-primary)]"
              >
                {s.question}
              </h2>
              <p className="mt-3 text-[1rem] font-medium leading-[1.7] text-[var(--sgc-text-primary)]">
                {s.answer}
              </p>
              {s.detail && (
                <p className="mt-3 text-[0.95rem] leading-[1.75] text-[var(--sgc-text-muted)]">{s.detail}</p>
              )}
            </section>
          ))}
        </div>

        {/* Results table */}
        <div className="mt-12 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <table className="w-full min-w-[480px] border-collapse text-left">
            <caption className="sr-only">Results at a glance</caption>
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th
                  style={{ fontFamily: "var(--font-inter)" }}
                  className="px-5 py-4 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]"
                >
                  Outcome
                </th>
                <th
                  style={{ fontFamily: "var(--font-inter)" }}
                  className="px-5 py-4 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]"
                >
                  Result
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((row) => (
                <tr key={row.label} className="border-b border-[var(--hairline-faint)] last:border-none">
                  <td className="px-5 py-4 text-[0.9rem] text-[var(--sgc-text-primary)]">{row.label}</td>
                  <td className="px-5 py-4 text-[0.9rem] font-semibold text-[var(--accent)]">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Client quote */}
        <blockquote className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
          <p
            style={{ fontFamily: "var(--font-fraunces)" }}
            className="text-[1.1rem] font-medium leading-[1.6] text-[var(--sgc-text-primary)]"
          >
            “{quote.text}”
          </p>
          <footer className="mt-4 text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent-copper)]">
            {quote.attribution}
          </footer>
        </blockquote>

        {/* FAQ */}
        <section className="mt-12">
          <h2
            style={{ fontFamily: "var(--font-fraunces)" }}
            className="text-[clamp(1.4rem,2.5vw,1.75rem)] font-bold text-[var(--sgc-text-primary)]"
          >
            Frequently asked questions
          </h2>
          <div className="mt-6 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition duration-300 ease-out hover:border-[var(--accent-strong)] open:border-[var(--accent-strong)]"
              >
                <summary className="flex cursor-pointer select-none items-center justify-between gap-4 px-6 py-5 text-[0.98rem] font-semibold text-[var(--sgc-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sgc-cyan)] rounded-2xl">
                  {faq.q}
                  <span aria-hidden className="shrink-0 text-[var(--accent-copper)] transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="border-t border-[var(--border)] px-6 pb-6 pt-4 text-[0.92rem] leading-[1.7] text-[var(--sgc-text-muted)]">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Internal links */}
        <nav aria-label="Related pages" className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--border)] pt-6">
          {internalLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.9rem] font-semibold text-[var(--accent)] hover:underline"
            >
              {link.label} →
            </a>
          ))}
        </nav>

        <div className="mt-10">
          <CtaButton href="/contact">Book a Discovery Call →</CtaButton>
        </div>
      </article>
    </main>
  );
}

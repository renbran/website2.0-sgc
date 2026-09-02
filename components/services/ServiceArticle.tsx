import GoldDrawIn from "@/components/ui/GoldDrawIn";
import CtaButton from "@/components/ui/CtaButton";

export interface ServiceSection {
  question: string;
  answer: string;
  detail?: string;
}

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface ComparisonTable {
  headers: string[];
  rows: string[][];
}

export interface ServiceArticleProps {
  eyebrow: string;
  h1: string;
  answerBlock: string;
  shortAnswer: string[];
  sections: ServiceSection[];
  comparisonTable?: ComparisonTable;
  faqs: ServiceFaq[];
  authorName: string;
  authorHref: string;
  authorCredentials: string;
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

export default function ServiceArticle({
  eyebrow,
  h1,
  answerBlock,
  shortAnswer,
  sections,
  comparisonTable,
  faqs,
  authorName,
  authorHref,
  authorCredentials,
  publishedDate,
  updatedDate,
  internalLinks,
}: ServiceArticleProps) {
  return (
    <main className="relative min-h-screen w-full bg-[var(--sgc-gradient-bg)] pt-28 pb-24 md:pt-36 md:pb-32">
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

        {/* Answer block — first 40-60 words, above the fold, no preamble. This
            is the block AI answer engines quote. */}
        <p className="mt-6 text-[1.15rem] font-medium leading-[1.65] text-[var(--sgc-text-primary)]">
          {answerBlock}
        </p>

        {/* Short-answer summary box */}
        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--accent)]"
          >
            Short answer
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
          <a href={authorHref} className="font-semibold text-[var(--accent)] hover:underline">
            {authorName}
          </a>
          <span>· {authorCredentials}</span>
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

        {comparisonTable && (
          <div className="mt-12 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <table className="w-full min-w-[480px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {comparisonTable.headers.map((h) => (
                    <th
                      key={h}
                      style={{ fontFamily: "var(--font-inter)" }}
                      className="px-5 py-4 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonTable.rows.map((row, i) => (
                  <tr key={i} className="border-b border-[var(--hairline-faint)] last:border-none">
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`px-5 py-4 text-[0.9rem] ${j === 0 ? "text-[var(--sgc-text-primary)]" : "text-[var(--sgc-text-muted)]"}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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

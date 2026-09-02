import type { Metadata } from "next";
import Link from "next/link";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import GoldDrawIn from "@/components/ui/GoldDrawIn";
import Footer from "@/components/Footer";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "Terms of Service — SGC Tech AI | UAE Governing Law",
  description:
    "Website terms of use for sgctech.ai — site usage, professional advice disclaimer, engagement scope, IP, and dispute resolution under UAE law.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "Effective 1 July 2026";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Terms of Service — SGC Tech AI",
  url: "https://sgctech.ai/terms",
  inLanguage: "en-AE",
  isPartOf: {
    "@type": "WebSite",
    name: "SGC Tech AI",
    url: "https://sgctech.ai",
  },
  publisher: {
    "@type": "Organization",
    name: "SGC Tech AI",
    legalName: "Scholarix Global Consultants FZCO",
    url: "https://sgctech.ai",
  },
};

export default function TermsPage() {
  return (
    <>
      <main className="relative min-h-screen w-full bg-[var(--sgc-gradient-bg)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <BreadcrumbJsonLd
          crumbs={[
            { name: "Home", path: "/" },
            { name: "Terms of Service", path: "/terms" },
          ]}
        />
        <div className="mx-auto max-w-3xl px-6 pt-28 pb-16 md:px-10 md:pt-32 md:pb-24">
          <RevealOnScroll>
            <SectionEyebrow label="LEGAL" />
            <h1
              style={{ fontFamily: "var(--font-fraunces)" }}
              className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.1] text-[var(--sgc-text-primary)]"
            >
              Terms of Service
            </h1>
            <p
              style={{ fontFamily: "var(--font-mono)" }}
              className="mt-4 text-[0.72rem] uppercase tracking-[0.22em] text-[var(--sgc-text-muted)]"
            >
              {LAST_UPDATED}
            </p>
            <p className="mt-6 text-[0.98rem] leading-[1.75] text-text-secondary">
              These terms govern your use of{" "}
              <span className="font-semibold text-[var(--sgc-text-primary)]">
                sgctech.ai
              </span>{" "}
              and any engagement you enter into with{" "}
              <span className="font-semibold text-[var(--sgc-text-primary)]">
                Scholarix Global Consultants FZCO (trading as SGC Tech AI)
              </span>
              . They sit alongside any Order Form or written agreement you sign
              with us.
            </p>
          </RevealOnScroll>

          <GoldDrawIn />

          <TermsSection number="01" title="Using the site">
            <p>
              sgctech.ai is provided for general information about our
              services. You may browse it for personal or business evaluation
              purposes. You may not scrape, mirror, or otherwise systematically
              copy our content without our written permission.
            </p>
          </TermsSection>

          <TermsSection number="02" title="No professional advice">
            <p>
              Anything you read on this site describes our services and
              experience. It is not a substitute for an audit or engagement
              with your own advisors. Numbers shown on case-study and proof
              sections are illustrative of typical results; your results
              will depend on your own situation, your team, and the scope we
              agree in a written Order Form.
            </p>
          </TermsSection>

          <TermsSection number="03" title="Engagements">
            <p>
              Our services begin only when a written Order Form or equivalent
              agreement is signed by both parties. The terms of that Order
              Form — including scope, fees, deliverables, warranties, and
              termination — govern the engagement and supersede anything on
              this site.
            </p>
          </TermsSection>

          <TermsSection number="04" title="Intellectual property">
            <p>
              All text, designs, code, and brand marks on sgctech.ai belong to
              Scholarix Global Consultants FZCO or our licensors. You may quote
              or link to our content for legitimate evaluation or press
              purposes; please attribute to SGC Tech AI.
            </p>
          </TermsSection>

          <TermsSection number="05" title="Warranties and liability">
            <p>
              The site is provided on an &quot;as is&quot; basis. To the
              maximum extent permitted by UAE law, we disclaim all warranties
              of any kind, express or implied. We will not be liable for any
              indirect, incidental, or consequential loss arising from your
              use of this site.
            </p>
          </TermsSection>

          <TermsSection number="06" title="Governing law">
            <p>
              These terms are governed by the laws of the United Arab Emirates
              and the Emirate of Dubai. Any dispute will be resolved by the
              courts of Dubai, unless a written engagement specifies
              arbitration under DIAC or another agreed forum.
            </p>
          </TermsSection>

          <TermsSection number="07" title="Updates">
            <p>
              We may update these terms from time to time. Material changes
              will be posted on this page with a new effective date. Your
              continued use of sgctech.ai after a change indicates acceptance
              of the updated terms.
            </p>
          </TermsSection>

          <TermsSection number="08" title="Contact">
            <p>
              Questions about these terms:{" "}
              <a
                href="mailto:legal@sgctech.ai"
                className="text-[var(--sgc-cyan)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                legal@sgctech.ai
              </a>
            </p>
            <p className="mt-3">
              See also:{" "}
              <Link
                href="/privacy"
                className="text-[var(--sgc-cyan)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                Privacy Policy
              </Link>
            </p>
          </TermsSection>
        </div>
      </main>
      <Footer />
    </>
  );
}

function TermsSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <RevealOnScroll>
      <section aria-labelledby={`terms-h-${number}`} className="mt-14">
        <div className="flex items-baseline gap-4">
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[var(--accent)]"
          >
            {number}
          </span>
          <h2
            id={`terms-h-${number}`}
            style={{ fontFamily: "var(--font-fraunces)" }}
            className="text-[clamp(1.4rem,2.6vw,2rem)] font-bold leading-[1.15] text-[var(--sgc-text-primary)]"
          >
            {title}
          </h2>
        </div>
        <div className="mt-5 space-y-3 text-[0.95rem] leading-[1.75] text-[var(--sgc-text-muted)]">
          {children}
        </div>
      </section>
    </RevealOnScroll>
  );
}
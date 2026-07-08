import type { Metadata } from "next";
import Link from "next/link";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import GoldDrawIn from "@/components/ui/GoldDrawIn";
import Footer from "@/components/Footer";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "Privacy Policy — SGC Tech AI | UAE PDPL Compliance",
  description:
    "How Scholarix Global Consultant FZE (SGC Tech AI) collects, uses and protects personal data on sgctech.ai under UAE PDPL.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "Effective 1 July 2026";

const dataWeCollect = [
  {
    label: "Contact enquiries you send us",
    detail:
      "When you email info@sgctech.ai (or use a CTA that opens your mail client), we receive your name, email address, organisation, and the contents of your message. We use these only to reply.",
  },
  {
    label: "Server logs",
    detail:
      "Our hosting provider records standard request metadata: IP address, user-agent, referrer, timestamp, and the resource requested. Logs are kept for 30 days for security and capacity planning, then deleted.",
  },
  {
    label: "Aggregated analytics",
    detail:
      "We do not use third-party analytics, advertising pixels, or session-replay tools. We count page views from our own server logs only.",
  },
];

const howWeUseIt = [
  "To respond to your enquiry and provide the services you requested.",
  "To operate, secure, and improve sgctech.ai (e.g. diagnosing outages, blocking abuse).",
  "To comply with UAE law and respond to lawful requests from public authorities.",
];

const yourRights = [
  "Request a copy of the personal data we hold about you.",
  "Request correction of inaccurate or incomplete data.",
  "Request deletion of your data, subject to our record-keeping obligations.",
  "Withdraw consent at any time, where processing is based on consent.",
  "Lodge a complaint with the UAE Data Office.",
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Privacy Policy — SGC Tech AI",
  url: "https://sgctech.ai/privacy",
  inLanguage: "en-AE",
  isPartOf: {
    "@type": "WebSite",
    name: "SGC Tech AI",
    url: "https://sgctech.ai",
  },
  publisher: {
    "@type": "Organization",
    name: "SGC Tech AI",
    legalName: "Scholarix Global Consultant FZE",
    url: "https://sgctech.ai",
  },
};

export default function PrivacyPage() {
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
            { name: "Privacy Policy", path: "/privacy" },
          ]}
        />
        <div className="mx-auto max-w-3xl px-6 pt-28 pb-16 md:px-10 md:pt-32 md:pb-24">
          <RevealOnScroll>
            <SectionEyebrow label="LEGAL" />
            <h1
              style={{ fontFamily: "var(--font-fraunces)" }}
              className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.1] text-[var(--sgc-text-primary)]"
            >
              Privacy Policy
            </h1>
            <p
              style={{ fontFamily: "var(--font-mono)" }}
              className="mt-4 text-[0.72rem] uppercase tracking-[0.22em] text-[var(--sgc-text-muted)]"
            >
              {LAST_UPDATED}
            </p>
            <p className="mt-6 text-[0.98rem] leading-[1.75] text-[rgba(244,241,234,0.78)]">
              This policy explains how{" "}
              <span className="font-semibold text-[var(--sgc-text-primary)]">
                Scholarix Global Consultant FZE (trading as SGC Tech AI)
              </span>{" "}
              handles personal data collected through{" "}
              <Link
                href="https://sgctech.ai"
                className="text-[var(--sgc-cyan)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                sgctech.ai
              </Link>{" "}
              and related correspondence. We process data in line with UAE
              Federal Decree-Law No. 45 of 2021 on the Protection of Personal
              Data (PDPL) and its executive regulations.
            </p>
          </RevealOnScroll>

          <GoldDrawIn />

          <PrivacySection
            number="01"
            title="What data we collect"
            intro="We collect the minimum needed to operate the site and respond to enquiries. We do not buy or trade data."
          >
            <ul className="space-y-5">
              {dataWeCollect.map((item) => (
                <li
                  key={item.label}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
                >
                  <p
                    style={{ fontFamily: "var(--font-inter)" }}
                    className="text-[0.98rem] font-semibold text-[var(--sgc-text-primary)]"
                  >
                    {item.label}
                  </p>
                  <p className="mt-2 text-[0.92rem] leading-[1.7] text-[var(--sgc-text-muted)]">
                    {item.detail}
                  </p>
                </li>
              ))}
            </ul>
          </PrivacySection>

          <PrivacySection
            number="02"
            title="How we use it"
            intro="Three purposes, narrowly defined."
          >
            <ol className="space-y-3">
              {howWeUseIt.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
                >
                  <span
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[rgba(199,162,58,0.3)] text-[0.78rem] font-bold text-[var(--accent)]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[0.92rem] leading-[1.7] text-[var(--sgc-text-muted)]">
                    {item}
                  </p>
                </li>
              ))}
            </ol>
          </PrivacySection>

          <PrivacySection
            number="03"
            title="Lawful basis"
            intro="We rely on one or more of the following PDPL grounds for each processing activity: your consent, performance of a contract you have asked us to perform, our legitimate interests in operating a secure service, or compliance with a legal obligation."
          >
            <p className="text-[0.92rem] leading-[1.7] text-[var(--sgc-text-muted)]">
              Where we rely on legitimate interests, we balance them against
              your rights and apply the minimum-data principle. You can ask us
              about the specific basis for any processing at any time.
            </p>
          </PrivacySection>

          <PrivacySection
            number="04"
            title="Sharing and processors"
            intro="We do not sell or rent personal data. We share it only with vetted processors who help us operate the site, and only as much as they need to do their job."
          >
            <ul className="space-y-3 text-[0.92rem] leading-[1.7] text-[var(--sgc-text-muted)]">
              <li>
                <span className="font-semibold text-[var(--sgc-text-primary)]">
                  Hosting & CDN —
                </span>{" "}
                Vercel and a CDN provider host and serve sgctech.ai. They
                process request logs on our behalf under written processor
                terms.
              </li>
              <li>
                <span className="font-semibold text-[var(--sgc-text-primary)]">
                  Email delivery —
                </span>{" "}
                Outbound enquiry emails route through a transactional email
                provider for delivery. They receive the email content you
                send.
              </li>
              <li>
                <span className="font-semibold text-[var(--sgc-text-primary)]">
                  Legal —
                </span>{" "}
                If compelled by a lawful UAE order, we will disclose the
                minimum data required to comply.
              </li>
            </ul>
          </PrivacySection>

          <PrivacySection
            number="05"
            title="Retention"
            intro="We keep data only as long as we have a reason to keep it."
          >
            <ul className="space-y-3 text-[0.92rem] leading-[1.7] text-[var(--sgc-text-muted)]">
              <li>
                <span className="font-semibold text-[var(--sgc-text-primary)]">
                  Enquiry correspondence —
                </span>{" "}
                up to 24 months from last contact, then archived or deleted.
              </li>
              <li>
                <span className="font-semibold text-[var(--sgc-text-primary)]">
                  Server logs —
                </span>{" "}
                30 days, then deleted automatically.
              </li>
              <li>
                <span className="font-semibold text-[var(--sgc-text-primary)]">
                  Engagement records —
                </span>{" "}
                for the duration of the engagement plus the UAE statutory
                record-keeping window (typically 7 years for financial
                records).
              </li>
            </ul>
          </PrivacySection>

          <PrivacySection
            number="06"
            title="Your rights under PDPL"
            intro="You can exercise any of these at any time by emailing privacy@sgctech.ai."
          >
            <ul className="grid gap-3 sm:grid-cols-2">
              {yourRights.map((right) => (
                <li
                  key={right}
                  className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
                >
                  <span
                    aria-hidden
                    className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                  />
                  <p className="text-[0.92rem] leading-[1.7] text-[var(--sgc-text-muted)]">
                    {right}
                  </p>
                </li>
              ))}
            </ul>
          </PrivacySection>

          <PrivacySection
            number="07"
            title="International transfers"
            intro="Some of our processors store data outside the UAE. Where we do, we rely on the PDPL transfer mechanisms and put contractual safeguards in place."
          >
            <p className="text-[0.92rem] leading-[1.7] text-[var(--sgc-text-muted)]">
              Hosting is delivered from regions we select for latency and
              redundancy. A current list of regions and safeguards is
              available on request.
            </p>
          </PrivacySection>

          <PrivacySection
            number="08"
            title="Cookies and similar technologies"
            intro="sgctech.ai does not set marketing, advertising, or analytics cookies. We use a single first-party session marker (a 32-byte opaque value) to remember that you have already seen the loading splash, so we don&apos;t re-flash it on every navigation."
          >
            <p className="text-[0.92rem] leading-[1.7] text-[var(--sgc-text-muted)]">
              You can clear it via your browser&apos;s site-data settings at
              any time. Clearing it just means you&apos;ll see the splash
              once on your next visit.
            </p>
          </PrivacySection>

          <PrivacySection
            number="09"
            title="Updates to this policy"
            intro="When we change this policy in a material way, we will post a notice on sgctech.ai with the new effective date. The previous version is available on request."
          />

          <PrivacySection number="10" title="Contact">
            <p className="text-[0.92rem] leading-[1.7] text-[var(--sgc-text-muted)]">
              Data controller:{" "}
              <span className="font-semibold text-[var(--sgc-text-primary)]">
                Scholarix Global Consultant FZE
              </span>
              , Maseed Building Office No. 304, 119/12st, Al Rigga, Dubai (AE), United Arab Emirates.
            </p>
            <p className="mt-3 text-[0.92rem] leading-[1.7] text-[var(--sgc-text-muted)]">
              Privacy enquiries:{" "}
              <a
                href="mailto:privacy@sgctech.ai"
                className="text-[var(--sgc-cyan)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                privacy@sgctech.ai
              </a>
            </p>
            <p className="mt-3 text-[0.92rem] leading-[1.7] text-[var(--sgc-text-muted)]">
              See also:{" "}
              <Link
                href="/terms"
                className="text-[var(--sgc-cyan)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                Terms of Service
              </Link>
            </p>
          </PrivacySection>
        </div>
      </main>
      <Footer />
    </>
  );
}

function PrivacySection({
  number,
  title,
  intro,
  children,
}: {
  number: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <RevealOnScroll>
      <section aria-labelledby={`privacy-h-${number}`} className="mt-14">
        <div className="flex items-baseline gap-4">
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[var(--accent)]"
          >
            {number}
          </span>
          <h2
            id={`privacy-h-${number}`}
            style={{ fontFamily: "var(--font-fraunces)" }}
            className="text-[clamp(1.4rem,2.6vw,2rem)] font-bold leading-[1.15] text-[var(--sgc-text-primary)]"
          >
            {title}
          </h2>
        </div>
        {intro && (
          <p className="mt-3 text-[0.95rem] leading-[1.7] text-[var(--sgc-text-muted)]">
            {intro}
          </p>
        )}
        {children && <div className="mt-5">{children}</div>}
      </section>
    </RevealOnScroll>
  );
}
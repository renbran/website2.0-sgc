import type { Metadata } from "next";
import Link from "next/link";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import GoldDrawIn from "@/components/ui/GoldDrawIn";
import Footer from "@/components/Footer";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "The SGC Tech AI Platform — app.sgctech.ai",
  description:
    "What app.sgctech.ai is, who uses it, and how it connects to your Google account for sign-in.",
  alternates: { canonical: "/platform" },
  robots: { index: true, follow: true },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "The SGC Tech AI Platform",
  url: "https://sgctech.ai/platform",
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

export default function PlatformPage() {
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
            { name: "Platform", path: "/platform" },
          ]}
        />
        <div className="mx-auto max-w-3xl px-6 pt-28 pb-16 md:px-10 md:pt-32 md:pb-24">
          <RevealOnScroll>
            <SectionEyebrow label="PLATFORM" />
            <h1
              style={{ fontFamily: "var(--font-fraunces)" }}
              className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.1] text-[var(--sgc-text-primary)]"
            >
              The SGC Tech AI Platform
            </h1>
            <p className="mt-6 text-[0.98rem] leading-[1.75] text-text-secondary">
              <span className="font-semibold text-[var(--sgc-text-primary)]">
                Scholarix Global Consultant FZE
              </span>{" "}
              (trading as{" "}
              <span className="font-semibold text-[var(--sgc-text-primary)]">
                SGC Tech AI
              </span>
              ) is a UAE-based Odoo + AI implementation firm led by CPAs and
              CIAs. This page describes{" "}
              <a
                href="https://app.sgctech.ai"
                className="text-[var(--sgc-cyan)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                app.sgctech.ai
              </a>
              , the workspace behind that consulting practice, for anyone
              reviewing what it does — including Google&apos;s app
              verification team.
            </p>
          </RevealOnScroll>

          <GoldDrawIn />

          <PlatformSection number="01" title="What app.sgctech.ai is">
            <p>
              app.sgctech.ai is SGC Tech AI&apos;s Odoo-based operations
              workspace. Our team uses it to run the consulting practice, and
              client-portal users sign in to the same system for the parts of
              an engagement relevant to them.
            </p>
          </PlatformSection>

          <PlatformSection number="02" title="Signing in with Google">
            <p>
              The app.sgctech.ai login screen offers &quot;Sign in with
              Google&quot; alongside email/password and passkey sign-in. If
              you use Google to sign in, we request your name, email address,
              and profile photo to create and authenticate your account. This
              is the only Google integration in use today — app.sgctech.ai
              does not connect to Google Calendar or Google Drive. If that
              changes, we will update this page and our{" "}
              <Link
                href="/privacy#privacy-h-09"
                className="text-[var(--sgc-cyan)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                Privacy Policy
              </Link>{" "}
              first.
            </p>
          </PlatformSection>

          <PlatformSection number="03" title="Your data">
            <p>
              Full detail on what we request, how it is stored, how long we
              keep it, and how to revoke access is in our{" "}
              <Link
                href="/privacy#privacy-h-09"
                className="text-[var(--sgc-cyan)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                Privacy Policy — Google user data
              </Link>{" "}
              section. Our use of Google API data follows the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                className="text-[var(--sgc-cyan)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                Google API Services User Data Policy
              </a>
              , including its Limited Use requirements.
            </p>
          </PlatformSection>

          <PlatformSection number="04" title="Contact">
            <p>
              Questions about the platform or its data handling:{" "}
              <a
                href="mailto:privacy@sgctech.ai"
                className="text-[var(--sgc-cyan)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                privacy@sgctech.ai
              </a>
              . See also our{" "}
              <Link
                href="/terms"
                className="text-[var(--sgc-cyan)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                Terms of Service
              </Link>
              .
            </p>
          </PlatformSection>
        </div>
      </main>
      <Footer />
    </>
  );
}

function PlatformSection({
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
      <section aria-labelledby={`platform-h-${number}`} className="mt-14">
        <div className="flex items-baseline gap-4">
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[var(--accent)]"
          >
            {number}
          </span>
          <h2
            id={`platform-h-${number}`}
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

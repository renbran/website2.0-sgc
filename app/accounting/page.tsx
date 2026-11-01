import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import PackageFlipCard from "@/components/accounting/PackageFlipCard";
import { FAQ, MATRIX, ONBOARDING_FEE, PACKAGES, aed } from "@/content/accounting-packages";

const TITLE = "Accounting Packages UAE from AED 399/month — SGC Tech AI";
const DESCRIPTION =
  "Professional accounting for UAE startups and SMEs with the system, the portal and the deadlines included. Five packages from AED 399 to AED 1,999 a month, excl. 5% VAT.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/accounting" },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "https://sgctech.ai/accounting", type: "website", images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/opengraph-image"] },
};

const cta =
  "inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-[0.85rem] font-bold transition duration-300";

function Mark({ value }: { value: string }) {
  if (value === "✓") return <span className="text-[var(--accent)]" aria-label="Included">✓</span>;
  if (value === "—") return <span className="text-[var(--text-muted)]" aria-label="Not included">—</span>;
  return <span>{value}</span>;
}

export default function AccountingPage() {
  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Accounting", path: "/accounting" },
        ]}
      />
      <Navbar />
      <main id="main" className="relative min-h-screen w-full bg-[var(--sgc-gradient-bg)] pt-28 pb-24 md:pt-36 md:pb-32">
        <div className="relative mx-auto max-w-7xl px-4 md:px-10">
          <RevealOnScroll focusPull className="mx-auto max-w-3xl text-center">
            <SectionEyebrow label="ACCOUNTING PACKAGES" className="justify-center" />
            <h1 className="mt-4 font-fraunces text-4xl font-semibold leading-[1.05] text-[var(--text-primary)] md:text-5xl">
              Your accountant. Your accounting system. <span className="text-gold-gradient">Your compliance calendar.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--text-secondary)] md:text-[16px]">
              Professional accounting for UAE startups and SMEs — with the system, the portal and the deadlines
              included. One monthly fee. No surprise invoices. Books closed on a fixed date every month, ready for VAT,
              Corporate Tax and audit.
            </p>
            <p className="mt-4 text-[0.8rem] uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Fixed price · Fixed deadlines · You own your data · Cancel with 30 days&apos; notice
            </p>
          </RevealOnScroll>

          <p className="mt-12 text-center text-[0.8rem] uppercase tracking-[0.14em] text-[var(--text-muted)]">
            Turn any card over to see everything it includes
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-5">
            {PACKAGES.map((p, i) => (
              <RevealOnScroll
                key={p.code}
                delay={i * 0.08}
                className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-13.34px)]"
              >
                <PackageFlipCard pkg={p} />
              </RevealOnScroll>
            ))}
          </div>

          <p className="mt-6 text-center text-[0.82rem] leading-relaxed text-[var(--text-muted)]">
            One-time onboarding and system setup: {aed(ONBOARDING_FEE)}. Extra users: USD 7 per user per month. Annual
            prepayment: 12 for 11. All prices exclude 5% VAT. No free trial — your client portal opens as soon as your
            first payment clears.
          </p>

          <RevealOnScroll>
            <section aria-labelledby="compare" className="mt-20">
              <h2 id="compare" className="text-center font-fraunces text-3xl font-semibold text-[var(--text-primary)]">
                Compare packages
              </h2>
              <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                <table className="w-full min-w-[720px] text-left text-[0.85rem]">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-[var(--text-primary)]">
                      <th scope="col" className="p-4 font-semibold">
                        <span className="sr-only">Feature</span>
                      </th>
                      {PACKAGES.map((p) => (
                        <th key={p.code} scope="col" className="p-4 text-center font-semibold">
                          {p.name}
                          <span className="block text-[0.78rem] font-normal text-[var(--text-muted)]">{aed(p.monthly)}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-[var(--text-secondary)]">
                    {MATRIX.map(([label, values]) => (
                      <tr key={label} className="border-b border-[var(--border)] last:border-0">
                        <th scope="row" className="p-4 font-normal text-[var(--text-primary)]">
                          {label}
                        </th>
                        {values.map((v, i) => (
                          <td key={PACKAGES[i].code} className="p-4 text-center">
                            <Mark value={v} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section aria-labelledby="faq" className="mx-auto mt-20 max-w-3xl">
              <h2 id="faq" className="text-center font-fraunces text-3xl font-semibold text-[var(--text-primary)]">
                Questions
              </h2>
              <div className="mt-8 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                {FAQ.map(({ q, a }) => (
                  <details key={q} className="group p-5">
                    <summary className="cursor-pointer list-none font-semibold text-[var(--text-primary)]">{q}</summary>
                    <p className="mt-3 text-[0.9rem] leading-relaxed text-[var(--text-secondary)]">{a}</p>
                  </details>
                ))}
              </div>
            </section>
          </RevealOnScroll>

          <div className="mx-auto mt-16 flex max-w-md flex-col gap-3">
            <Link
              href="/accounting/subscribe?package=start"
              className={`${cta} bg-gold-gradient py-3.5 text-[var(--bg)] hover:shadow-[0_0_22px_rgba(199,162,58,0.35)]`}
            >
              Get started from AED 399/month
            </Link>
            <Link
              href="/contact"
              className={`${cta} border border-[rgba(199,162,58,0.5)] text-[var(--accent)] hover:bg-[rgba(199,162,58,0.06)]`}
            >
              Book a 15-minute call
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

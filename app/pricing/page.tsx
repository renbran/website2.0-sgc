import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import PricingPlans from "@/components/layer3/PricingPlans";
import { getPricing, type Pricing } from "@/lib/layer3";

export const revalidate = 300;

const DESCRIPTION =
  "The SGC real estate operating system, hosted and maintained for you. Priced per company with five users included; prices exclude 5% VAT.";

export const metadata: Metadata = {
  title: "Pricing — SGC Tech AI",
  description: DESCRIPTION,
  alternates: { canonical: "/pricing" },
  robots: { index: true, follow: true },
};

async function loadPricing(): Promise<Pricing | null> {
  try {
    return await getPricing();
  } catch (err) {
    console.error("[pricing] Odoo pricing unavailable:", (err as Error).message);
    return null;
  }
}

export default async function PricingPage() {
  const pricing = await loadPricing();
  return (
    <>
      <Navbar />
      <main id="main" className="relative min-h-screen w-full bg-[var(--sgc-gradient-bg)] pt-28 pb-24 md:pt-36 md:pb-32">
        <div className="relative mx-auto max-w-3xl px-6 md:px-10">
          <div className="text-center">
            <SectionEyebrow label="PRICING" />
            <h1 className="mt-4 font-fraunces text-4xl font-semibold leading-[1.05] text-[var(--text-primary)] md:text-5xl">
              Your brokerage, <span className="text-gold-gradient">run properly</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--text-secondary)] md:text-[16px]">
              One workspace for your company at its own address, set up the moment you pay, hosted and maintained
              by us. You are billed in advance for the cycle you choose.
            </p>
          </div>
          <div className="mt-12">
            {pricing ? (
              <PricingPlans pricing={pricing} />
            ) : (
              <p className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-[var(--text-secondary)]">
                Pricing is being updated. Please{" "}
                <a className="text-[var(--accent)]" href="/contact">
                  contact us
                </a>{" "}
                for a quote.
              </p>
            )}
          </div>
          <p className="mt-8 text-center text-[0.8rem] leading-relaxed text-[var(--text-muted)]">
            Prices exclude 5% VAT. E-invoicing ready; activation and portal integrations are quoted separately. Data
            migration above 1,000 records is quoted separately.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

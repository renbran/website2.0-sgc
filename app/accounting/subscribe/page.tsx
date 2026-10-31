import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import AccountingSubscribeForm from "@/components/accounting/AccountingSubscribeForm";
import { packageByCode } from "@/content/accounting-packages";

export const metadata: Metadata = {
  title: "Start your accounting package — SGC Tech AI",
  description: "Choose your package, sign your Order Form and pay. Your accounting portal opens as soon as payment clears.",
  alternates: { canonical: "/accounting/subscribe" },
  robots: { index: false, follow: true },
};

export default async function AccountingSubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string; cycle?: string }>;
}) {
  const params = await searchParams;
  const pkg = packageByCode(params.package)?.code ?? "start";
  const cycle = params.cycle === "annual" ? "annual" : "monthly";
  return (
    <>
      <Navbar />
      <main id="main" className="relative min-h-screen w-full bg-[var(--sgc-gradient-bg)] pt-28 pb-24 md:pt-36 md:pb-32">
        <div className="relative mx-auto max-w-3xl px-4 md:px-10">
          <div className="text-center">
            <SectionEyebrow label="ACCOUNTING" className="justify-center" />
            <h1 className="mt-4 font-fraunces text-4xl font-semibold leading-[1.05] text-[var(--text-primary)] md:text-5xl">
              Start your <span className="text-gold-gradient">accounting package</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--text-secondary)]">
              No free trial. You sign your Order Form and pay the first period plus onboarding by card; your client
              portal and document vault open as soon as the payment clears.
            </p>
          </div>
          <div className="mt-12">
            <AccountingSubscribeForm initialPackage={pkg} initialCycle={cycle} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import SubscribeForm from "@/components/layer3/SubscribeForm";

export const metadata: Metadata = {
  title: "Start your subscription — SGC Tech AI",
  description: "Register your company and choose your workspace address.",
  alternates: { canonical: "/subscribe" },
  robots: { index: false, follow: true },
};

const CYCLES = new Set(["monthly", "quarterly", "half_yearly", "annual"]);

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ cycle?: string; users?: string; trial?: string }>;
}) {
  const params = await searchParams;
  const cycle = CYCLES.has(params.cycle || "") ? (params.cycle as string) : "monthly";
  const users = Math.max(5, Math.min(100, Number.parseInt(params.users || "5", 10) || 5));
  const trial = params.trial === "1" || params.trial === "true";
  return (
    <>
      <Navbar />
      <main id="main" className="relative min-h-screen w-full bg-[var(--sgc-gradient-bg)] pt-28 pb-24 md:pt-36 md:pb-32">
        <div className="relative mx-auto max-w-3xl px-6 md:px-10">
          <div className="text-center">
            <SectionEyebrow label={trial ? "FREE TRIAL" : "SUBSCRIBE"} />
            <h1 className="mt-4 font-fraunces text-4xl font-semibold leading-[1.05] text-[var(--text-primary)] md:text-5xl">
              {trial ? (
                <>
                  Start your <span className="text-gold-gradient">14-day free trial</span>
                </>
              ) : (
                <>
                  Register your <span className="text-gold-gradient">company</span>
                </>
              )}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--text-secondary)]">
              {trial
                ? "Card required, nothing charged today. 14 days free, then AED 875/month (5 users included). Your workspace is provisioned as soon as the card is saved."
                : "These are the details for your Order Form. Regulatory items such as goAML, MLRO or TRN are not needed to start."}
            </p>
          </div>
          <div className="mt-12">
            <SubscribeForm cycle={cycle} users={users} trial={trial} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

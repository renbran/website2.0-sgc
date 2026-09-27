import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import SubscribeStatus from "@/components/layer3/SubscribeStatus";

export const metadata: Metadata = {
  title: "Your subscription — SGC Tech AI",
  robots: { index: false, follow: false },
};

const REQUEST_ID_RE = /^[A-Za-z0-9_\-:.]{8,128}$/;

export default async function SubscribeDonePage({ searchParams }: { searchParams: Promise<{ r?: string }> }) {
  const { r } = await searchParams;
  const requestId = r && REQUEST_ID_RE.test(r) ? r : null;
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen w-full bg-[var(--sgc-gradient-bg)] pt-28 pb-24 md:pt-36 md:pb-32">
        <div className="relative mx-auto max-w-3xl px-6 md:px-10">
          <div className="text-center">
            <SectionEyebrow label="NEXT STEPS" />
            <h1 className="mt-4 font-fraunces text-4xl font-semibold leading-[1.05] text-[var(--text-primary)] md:text-5xl">
              Almost <span className="text-gold-gradient">there</span>
            </h1>
          </div>
          <div className="mt-12">
            {requestId ? (
              <SubscribeStatus requestId={requestId} />
            ) : (
              <p className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-[var(--text-secondary)]">
                We could not find this signup. Please check the email we sent you, or{" "}
                <a className="text-[var(--accent)]" href="/contact">
                  contact us
                </a>
                .
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

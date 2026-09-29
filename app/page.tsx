import type { Metadata } from "next";

const TITLE = "SGC Tech AI — Odoo Implementation & AI Automation for UAE Mid-Market";
const DESCRIPTION =
  "Practitioner-led Odoo ERP and AI implementation for UAE mid-market firms in Dubai. CPAs and CIAs deliver diagnosis-first engagement, fixed price and timeline, covering ERP implementation, AI finance automation, and UAE compliance.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://sgctech.ai",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
  other: {
    datePublished: "2026-09-02",
    dateModified: "2026-09-06",
  },
};

// Section: Imports
import Footer from "@/components/Footer";
import DiamondScrollHero from "@/components/Hero/DiamondScrollHero";
import Navbar from "@/components/Navbar";
import HelixToShieldTransition from "@/components/transitions/HelixToShieldTransition";
import CaseStudySection from "@/components/sections/CaseStudySection";
import MetricsFactBlock from "@/components/seo/MetricsFactBlock";
import CommercialModelSection from "@/components/sections/CommercialModelSection";
import ContactSection from "@/components/sections/ContactSection";
import PricingSection from "@/components/sections/PricingSection";
import ProblemSection from "@/components/sections/ProblemSection";
import SolutionSection from "@/components/sections/SolutionSection";
import SectionEight from "@/components/sections/SectionEight";
import FaqSection from "@/components/sections/FaqSection";
import ShieldSection from "@/components/Shield/ShieldSection";
import FinaleConvergenceSection from "@/components/Finale/FinaleConvergenceSection";
import DiagnosisScrubHero from "@/components/sections/diagnosis-scrub-hero";

// Note: SectionOne–Seven were verbatim duplicates of the helix diamond captions
// and have been removed (Phase 1 collapse). SectionEight is retained as the
// Rescue-Audit CTA beat and now sits immediately before ContactSection.
// CredentialRow, FounderSection, LeadershipSection, and AwardsCarousel have all
// been removed from this layout (founder direction 2026-09-02: public site
// carries no founder names, no credential strip, no credential trophy reel).
// Their components remain in the repo as dead code in case we ever need to
// revive them as an anonymised team strip or an "our proof" page.
// Organization/ProfessionalService + WebSite JSON-LD now lives once, site-wide,
// in app/layout.tsx (lib/schema.ts) — no per-page duplicate here.

export default function HomePage() {
  return (
    <main id="main" className="relative min-h-screen w-full bg-[var(--sgc-gradient-bg)]">
      <Navbar />
      <DiamondScrollHero />
      <DiagnosisScrubHero />
      <HelixToShieldTransition />
      <ProblemSection />
      <ShieldSection />
      <SolutionSection />
      <CaseStudySection />
      <MetricsFactBlock />
      <CommercialModelSection />
      <PricingSection />
      <FinaleConvergenceSection />
      <SectionEight />
      <FaqSection />
      <ContactSection />
      <Footer />
    </main>
  );
}

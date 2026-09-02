// Section: Imports
import Footer from "@/components/Footer";
import DiamondScrollHero from "@/components/Hero/DiamondScrollHero";
import Navbar from "@/components/Navbar";
import HelixToShieldTransition from "@/components/transitions/HelixToShieldTransition";
import CaseStudySection from "@/components/sections/CaseStudySection";
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

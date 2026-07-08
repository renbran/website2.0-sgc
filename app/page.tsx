// Section: Imports
import Footer from "@/components/Footer";
import DiamondScrollHero from "@/components/Hero/DiamondScrollHero";
import Navbar from "@/components/Navbar";
import HelixToShieldTransition from "@/components/transitions/HelixToShieldTransition";
import CredentialRow from "@/components/sections/CredentialRow";
import CaseStudySection from "@/components/sections/CaseStudySection";
import CommercialModelSection from "@/components/sections/CommercialModelSection";
import ContactSection from "@/components/sections/ContactSection";
import FounderSection from "@/components/FounderSection";
import AwardsCarousel from "@/components/sections/AwardsCarousel";
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
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "SGC Tech AI",
  legalName: "Scholarix Global Consultant FZE",
  url: "https://sgctech.ai",
  email: "info@sgctech.ai",
  telephone: "+971-52-198-5231",
  priceRange: "AED 5,000 – AED 75,000+",
  description:
    "Practitioner-led Odoo ERP and AI implementation firm for UAE mid-market companies, led by CPAs and CIAs.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Maseed Building Office No. 304, 119/12st, Al Rigga",
    addressLocality: "Dubai",
    addressRegion: "Dubai",
    addressCountry: "AE",
  },
  sameAs: [
    "https://linkedin.com/company/sgctechai",
    "https://instagram.com/sgctech.ai",
    "https://x.com/sgctech_ai",
  ],
  areaServed: {
    "@type": "Country",
    name: "United Arab Emirates",
  },
  knowsAbout: [
    "Odoo ERP implementation",
    "AI finance automation",
    "Financial reporting",
    "UAE corporate tax compliance",
  ],
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full bg-[var(--sgc-gradient-bg)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <CredentialRow />
      <DiamondScrollHero />
      <DiagnosisScrubHero />
      <HelixToShieldTransition />
      <ProblemSection />
      <ShieldSection />
      <SolutionSection />
      <CaseStudySection />
      <AwardsCarousel />
      <FounderSection />
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

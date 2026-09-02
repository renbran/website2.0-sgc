import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import AboutHero from "@/components/about/AboutHero";
import OriginStory from "@/components/about/OriginStory";
import TransformationCompare from "@/components/about/TransformationCompare";
import TransformationFramework from "@/components/about/TransformationFramework";
import RoadmapTimeline from "@/components/about/RoadmapTimeline";
import IndustriesGrid from "@/components/about/IndustriesGrid";
import EngagementTiers from "@/components/about/EngagementTiers";
import AboutCTA from "@/components/about/AboutCTA";

export const metadata: Metadata = {
  title: "About — SGC Tech AI",
  description:
    "Built by operators, not consultants. SGC Tech AI is the Operational Physician of the UAE Mid-Market — CPAs and CIAs who diagnose before they prescribe.",
  alternates: { canonical: "/about" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "About SGC Tech AI — Built by Operators, Not Consultants",
    description:
      "The Operational Physician of the UAE Mid-Market. Practitioner-led Odoo ERP, AI automation, and CFO advisory led by CPAs and CIAs.",
    type: "website",
    locale: "en_AE",
    url: "https://sgctech.ai/about",
    // Route-level `openGraph` replaces (not merges with) the root layout's
    // openGraph object, so the shared /opengraph-image must be re-declared
    // here — otherwise this page silently ships with no social preview image.
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About SGC Tech AI",
    description:
      "Built by operators, not consultants. CPAs and CIAs who diagnose before they prescribe.",
    images: ["/opengraph-image"],
  },
};

// LeadershipSection and the per-founder Person JSON-LD have been removed from
// this route (founder direction 2026-09-02): the public site carries no founder
// names. Site-wide Organization + WebSite JSON-LD is still emitted by the root
// layout. LeadershipSection remains in the repo as dead code for potential
// revival as anonymised team cards.

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />
      <main className="relative min-h-screen w-full bg-[var(--sgc-gradient-bg)]">
        <AboutHero />
        <OriginStory />
        <TransformationCompare />
        <TransformationFramework />
        <RoadmapTimeline />
        <IndustriesGrid />
        <EngagementTiers />
        <AboutCTA />
      </main>
      <Footer />
    </>
  );
}

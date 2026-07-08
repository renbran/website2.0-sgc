import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import AboutHero from "@/components/about/AboutHero";
import OriginStory from "@/components/about/OriginStory";
import TransformationCompare from "@/components/about/TransformationCompare";
import TransformationFramework from "@/components/about/TransformationFramework";
import RoadmapTimeline from "@/components/about/RoadmapTimeline";
import LeadershipSection from "@/components/about/LeadershipSection";
import IndustriesGrid from "@/components/about/IndustriesGrid";
import EngagementTiers from "@/components/about/EngagementTiers";
import AboutCTA from "@/components/about/AboutCTA";

export const metadata: Metadata = {
  title: "About — SGC Tech AI",
  description:
    "Built by operators, not consultants. SGC Tech AI is the Operational Physician of the UAE Mid-Market — CPAs and CIAs who diagnose before they prescribe. Meet the founders, the framework, and the 90-day transformation roadmap.",
  alternates: { canonical: "/about" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "About SGC Tech AI — Built by Operators, Not Consultants",
    description:
      "The Operational Physician of the UAE Mid-Market. Practitioner-led Odoo ERP, AI automation, and CFO advisory led by CPAs and CIAs.",
    type: "website",
    locale: "en_AE",
    url: "https://sgctech.ai/about",
  },
};

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
        <LeadershipSection />
        <IndustriesGrid />
        <EngagementTiers />
        <AboutCTA />
      </main>
      <Footer />
    </>
  );
}

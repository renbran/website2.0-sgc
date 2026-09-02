import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/JsonLd";
import { serviceSchema, faqSchema, graph } from "@/lib/schema";
import ServiceArticle from "@/components/services/ServiceArticle";

const TITLE = "How Do You Configure UAE Corporate Tax in Odoo?";
const DESCRIPTION =
  "UAE Corporate Tax in Odoo: 0% up to AED 375,000, 9% above it, Small Business Relief at AED 3M revenue, and QFZP qualifying-income segregation — configured, not bolted on.";

export const metadata: Metadata = {
  title: `${TITLE} | SGC Tech AI`,
  description: DESCRIPTION,
  alternates: { canonical: "/services/uae-corporate-tax-compliance" },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://sgctech.ai/services/uae-corporate-tax-compliance",
    type: "article",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/opengraph-image"] },
};

const faqs = [
  {
    q: "What's the current UAE Corporate Tax rate?",
    a: "0% on taxable income from AED 0 to AED 375,000, and 9% on taxable income above that threshold, for all taxable persons except Qualifying Free Zone Persons. Source: Federal Tax Authority (FTA); verified current as of September 2026 — confirm your specific position with the FTA or your tax advisor before filing.",
  },
  {
    q: "What is Small Business Relief and do I qualify?",
    a: "It's an election (not automatic) for taxpayers with revenue at or below AED 3,000,000, applicable to tax periods ending on or before 31 December 2026 as a transitional measure. You elect it through EmaraTax at the time of filing — Odoo doesn't apply it for you.",
  },
  {
    q: "What if we're a Qualifying Free Zone Person (QFZP)?",
    a: "QFZPs get 0% on qualifying income but 9% on non-qualifying income, with no AED 375,000 threshold available. The de-minimis rule allows non-qualifying revenue up to the lower of AED 5,000,000 or 5% of total revenue before QFZP status is at risk — which is exactly the kind of revenue-stream segregation that needs to be built into your chart of accounts, not tracked in a spreadsheet on the side.",
  },
  {
    q: "Does this replace my tax advisor?",
    a: "No. We configure the system to produce accurate, audit-ready records and supporting schedules. Filing positions, elections, and interpretation of your specific facts remain with your tax advisor and the FTA.",
  },
  {
    q: "How does this stay current as rules change?",
    a: "Regulatory and version upgrades are part of the Annual Maintenance Contract — when FTA rules change, the compliance layer is assessed and updated as part of what the AMC already funds, not billed as a surprise change request.",
  },
];

export default function CorporateTaxCompliancePage() {
  return (
    <>
      <Navbar />
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "UAE Corporate Tax in Odoo", path: "/services/uae-corporate-tax-compliance" },
        ]}
      />
      <JsonLd
        data={graph([
          serviceSchema({
            name: "UAE Corporate Tax Configuration in Odoo",
            description: DESCRIPTION,
            slug: "uae-corporate-tax-compliance",
            offers: [
              {
                name: "Implementation Foundation",
                minPrice: "14000",
                currency: "AED",
                description:
                  "Configured as part of the Implementation layer: from AED 14,000 foundation, plus module blocks scoped in Discovery. Compliance updates covered under the mandatory AMC.",
              },
              {
                name: "Annual Maintenance Contract (AMC)",
                minPrice: "4800",
                currency: "AED",
                description:
                  "Annual Maintenance Contract: 20% of the Implementation price per year, billed annually — keeps the compliance layer current as FTA rules evolve. From AED 4,800/year, based on the AED 24,000 minimum qualifying Implementation deal — scales with actual Implementation price.",
              },
            ],
          }),
          faqSchema(faqs),
        ])}
      />
      <ServiceArticle
        eyebrow="COMPLIANCE · UAE CORPORATE TAX"
        h1={TITLE}
        answerBlock="UAE Corporate Tax runs at 0% on taxable income up to AED 375,000 and 9% above it, administered by the Federal Tax Authority. We configure Odoo's chart of accounts, tax rules, and fiscal positions to reflect your actual position — including Small Business Relief eligibility and Qualifying Free Zone Person income segregation — so your books match what you'll actually file, not a generic default."
        shortAnswer={[
          "0% up to AED 375,000 taxable income, 9% above it (non-QFZP)",
          "Small Business Relief: elect via EmaraTax if revenue ≤ AED 3,000,000, through periods ending on or before 31 Dec 2026",
          "QFZP: 0% on qualifying income, 9% on non-qualifying — segregated in the chart of accounts, not tracked separately",
        ]}
        sections={[
          {
            question: "What does \"configuring\" Corporate Tax in Odoo actually involve?",
            answer:
              "Setting up your tax registration, structuring fiscal positions and tax groups so qualifying and non-qualifying income are separated at the transaction level, and aligning your invoicing formats to what the FTA expects — so year-end reporting is a review, not a reconstruction.",
          },
          {
            question: "Why does QFZP status need chart-of-accounts-level segregation?",
            answer:
              "Because the de-minimis limit — non-qualifying revenue capped at the lower of AED 5,000,000 or 5% of total revenue — has to be monitored continuously, not discovered at year-end. If it's not built into how transactions are coded from day one, you're reconstructing the split retroactively under time pressure.",
          },
          {
            question: "What about Small Business Relief?",
            answer:
              "It's a transitional election through EmaraTax for taxpayers at or below AED 3,000,000 in revenue, for periods ending on or before 31 December 2026 — not an automatic exemption. We make sure your revenue reporting is accurate enough that the election decision is straightforward, but the election itself is made by you or your tax advisor.",
          },
          {
            question: "Where does this sit in your commercial model?",
            answer:
              "Inside the Implementation build and the Annual Maintenance Contract — not a separate line item. Configuration happens during Discovery and Build; keeping the compliance layer current as FTA rules evolve is part of what the mandatory 20%-of-implementation AMC funds.",
          },
        ]}
        faqs={faqs}
        authorName="SGC Tech AI"
        authorHref="/about"
        authorCredentials="Practitioner-led · Dubai, UAE · DIEZ Licensed"
        publishedDate="2026-09-02"
        updatedDate="2026-09-02"
        internalLinks={[
          { label: "How much Odoo implementation costs", href: "/services/odoo-implementation-uae" },
          { label: "What outsourced reporting costs", href: "/services/outsourced-financial-reporting" },
          { label: "Read our Privacy Policy (UAE PDPL)", href: "/privacy" },
          { label: "Book a Discovery diagnostic", href: "/diagnostic" },
        ]}
      />
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/JsonLd";
import { serviceSchema, faqSchema, graph } from "@/lib/schema";
import ServiceArticle from "@/components/services/ServiceArticle";

const TITLE = "What Does Outsourced Financial Reporting Cost in Dubai?";
const DESCRIPTION =
  "We don't sell financial reporting as a separate retainer — it's built into Implementation and AMC. Real cost basis, verified against an OSUS result.";

export const metadata: Metadata = {
  title: `${TITLE} | SGC Tech AI`,
  description: DESCRIPTION,
  alternates: { canonical: "/services/outsourced-financial-reporting" },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://sgctech.ai/services/outsourced-financial-reporting",
    type: "article",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/opengraph-image"] },
};

const faqs = [
  {
    q: "So there's no separate monthly reporting fee?",
    a: "Correct — not as a standalone product. Reporting dashboards, financial consolidation, and management reporting are built during Implementation and kept current under the AMC, which is priced at 20% of the implementation price annually.",
  },
  {
    q: "What if I only want reporting, not a full ERP?",
    a: "The Subscription (Rent) layer, from AED 875/month including five licensed users, includes records and report generation for smaller deals that don't need a full implementation.",
  },
  {
    q: "How do I know the reporting will actually be accurate?",
    a: "Because it's generated from the same system running your invoicing, commissions, and deal records — not a parallel spreadsheet someone reconciles by hand. OSUS Real Estate's central reporting came out of the same Odoo ERP that processed AED 39.89 million in brokerage revenue.",
  },
  {
    q: "What's the real cost basis, then?",
    a: "The Implementation foundation (from AED 14,000, minimum qualifying deal AED 24,000) plus the mandatory AMC (20% of that price, annually). Reporting scope is defined during Discovery as part of what gets built, not quoted as a separate line.",
  },
  {
    q: "Do you offer a named senior consultant for ongoing reporting review?",
    a: "That's scoped case by case, not a published fixed-price product yet — talk to us in Discovery about what oversight cadence you actually need.",
  },
];

export default function OutsourcedFinancialReportingPage() {
  return (
    <>
      <Navbar />
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "Outsourced Financial Reporting", path: "/services/outsourced-financial-reporting" },
        ]}
      />
      <JsonLd
        data={graph([
          serviceSchema({
            name: "Outsourced Financial Reporting",
            description: DESCRIPTION,
            slug: "outsourced-financial-reporting",
            offers: [
              {
                name: "Implementation Foundation",
                minPrice: "14000",
                currency: "AED",
                description:
                  "Built into the Implementation layer (from AED 14,000, min AED 24,000). No standalone reporting retainer — kept current under the mandatory AMC at 20% of Implementation per year.",
              },
            ],
          }),
          faqSchema(faqs),
        ])}
      />
      <ServiceArticle
        eyebrow="FINANCIAL REPORTING · DUBAI"
        h1={TITLE}
        answerBlock="We don't sell outsourced financial reporting as a separate monthly retainer. Management reporting and dashboards are built during Implementation (from AED 14,000, minimum deal AED 24,000) and kept current under the mandatory AMC (20% of the implementation price, annually) — so the real cost is the same as any other Odoo build, not a bolt-on fee."
        shortAnswer={[
          "No standalone reporting retainer — it's built into Implementation and kept current under the AMC",
          "Smaller teams: records and report generation included from AED 875/month under Subscription",
          "OSUS Real Estate's central reporting ran on the same ERP that processed AED 39.89M in revenue",
        ]}
        sections={[
          {
            question: "Why don't you sell reporting as its own product?",
            answer:
              "Because reporting that isn't generated from your live operational data is just another reconciliation problem waiting to happen. Building it into the same Odoo instance that runs invoicing and deal management means the numbers can't drift apart.",
          },
          {
            question: "What does a real deployment's reporting scope look like?",
            answer:
              "OSUS Real Estate's implementation included management and financial reporting dashboards alongside finance, invoicing, brokerage lifecycle, and HR — connected into a single digital record per deal, not a separate reporting workstream.",
            detail:
              "Eleven staff were spending an estimated 247.5 hours a week on manual admin before the build; the same deployment delivered a 445% first-year ROI and AED 1.64 million in first-year net savings.",
          },
          {
            question: "What if I already have an ERP and just want better reporting out of it?",
            answer:
              "That's scoped as a smaller engagement in Discovery — configuration and dashboard work against your existing system rather than a full implementation. Pricing is set once we know what's actually there to work with.",
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
          { label: "How we configure UAE Corporate Tax", href: "/services/uae-corporate-tax-compliance" },
          { label: "Read the OSUS Real Estate case", href: "/#case-study" },
          { label: "Book a Discovery diagnostic", href: "/diagnostic" },
        ]}
      />
      <Footer />
    </>
  );
}

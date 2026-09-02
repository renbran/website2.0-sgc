import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/JsonLd";
import { serviceSchema, faqSchema, graph } from "@/lib/schema";
import ServiceArticle from "@/components/services/ServiceArticle";

const TITLE = "How Much Does Odoo Implementation Cost in the UAE?";
const DESCRIPTION =
  "Real, published pricing: Odoo implementation from AED 14,000 (min. AED 24,000), a mandatory 20%/year AMC, and an AED 875/month subscription tier for smaller deals.";

export const metadata: Metadata = {
  title: `${TITLE} | SGC Tech AI`,
  description: DESCRIPTION,
  alternates: { canonical: "/services/odoo-implementation-uae" },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://sgctech.ai/services/odoo-implementation-uae",
    type: "article",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/opengraph-image"] },
};

const faqs = [
  {
    q: "Does the AED 14,000 foundation include module licenses?",
    a: "No. The foundation covers Discovery, configuration, UAT, training, and hypercare on the base build. Third-party module licenses, custom app development, and hardware/hosting are scoped and quoted separately per the Commercial Schedule.",
  },
  {
    q: "How long does a typical implementation take?",
    a: "It depends on scope, decided in Discovery. For reference, our AX Capital engagement — Bitrix–Odoo 17 integration, automated commission engine, property management — was delivered in an intensive 6-7 weeks, including weekend work to meet an urgent deadline.",
  },
  {
    q: "Can I cancel the Subscription layer?",
    a: "Yes. The Subscription has no fixed end date and continues until cancelled per your Order Form. Accounts move through defined states (Active, Grace, Read-only, Archive) rather than an abrupt cutoff, and your data is never held hostage on cancellation.",
  },
  {
    q: "Who owns the system and the data after go-live?",
    a: "You do. The platform runs on an open-source Odoo core in your own instance; your data is yours regardless of whether you continue the AMC or Subscription afterward.",
  },
  {
    q: "Are these prices inclusive of VAT?",
    a: "No. All prices are exclusive of 5% UAE VAT, added at invoicing.",
  },
  {
    q: "Why is the AMC mandatory rather than optional?",
    a: "An unmaintained Odoo system decays into the same disconnected, error-prone state clients come to us to fix in the first place. The AMC funds patching, compliance updates, and priority support — go-live doesn't happen without one executed.",
  },
];

export default function OdooImplementationCostPage() {
  return (
    <>
      <Navbar />
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "Odoo Implementation Cost", path: "/services/odoo-implementation-uae" },
        ]}
      />
      <JsonLd
        data={graph([
          serviceSchema({
            name: "Odoo ERP Implementation",
            description: DESCRIPTION,
            slug: "odoo-implementation-uae",
            offers: [
              {
                name: "Implementation Foundation",
                minPrice: "14000",
                currency: "AED",
                description:
                  "Implementation foundation: from AED 14,000, plus module blocks scoped in Discovery. Minimum qualifying deal AED 24,000.",
              },
              {
                name: "Annual Maintenance Contract (AMC)",
                minPrice: "4800",
                currency: "AED",
                description:
                  "Mandatory Annual Maintenance Contract: 20% of the Implementation price per year, billed annually. From AED 4,800/year, based on the AED 24,000 minimum qualifying Implementation deal — scales with actual Implementation price. Go-live does not proceed without an executed AMC.",
              },
            ],
          }),
          faqSchema(faqs),
        ])}
      />
      <ServiceArticle
        eyebrow="ODOO IMPLEMENTATION · PRICING"
        h1={TITLE}
        answerBlock="Odoo implementation at SGC Tech AI starts at AED 14,000 for the foundation build, with a minimum qualifying deal of AED 24,000 once module blocks are scoped in Discovery. Every implementation carries a mandatory Annual Maintenance Contract priced at 20% of the implementation price per year — fixed, published, no hidden fees."
        shortAnswer={[
          "Foundation build: AED 14,000, ~25-hour base scope, fixed price",
          "Minimum qualifying deal: AED 24,000 once module blocks are scoped",
          "Mandatory AMC: 20% of the implementation price, billed annually",
        ]}
        sections={[
          {
            question: "What's included in the AED 14,000 foundation?",
            answer:
              "Discovery workshops and As-Is/To-Be mapping, Odoo configuration for the scoped module blocks, UAT scripts and user training, a cutover plan, and hypercare after go-live.",
            detail:
              "Excluded: custom app development (quoted separately per scope), hardware, networking or on-prem hosting, and third-party module licenses. These are itemized before you sign, not discovered mid-project.",
          },
          {
            question: "Why does the final price scale with module blocks?",
            answer:
              "Because a finance-only rollout and a finance-plus-CRM-plus-inventory rollout are different builds. Module blocks are scoped and priced in Discovery — the same fixed-price, fixed-timeline discipline applies to whatever set of modules you actually need.",
          },
          {
            question: "Is there a lower-cost option for a smaller team?",
            answer:
              "Yes — the Subscription (Rent) layer, from AED 875/month including five licensed users. It's a hosted platform aimed at smaller deals needing AML screening signal, a secure digital client-intake form, and records/report generation, without a full custom implementation.",
          },
          {
            question: "What does a real deployment actually cost and deliver?",
            answer:
              "OSUS Real Estate — an 11-person UAE brokerage — deployed an end-to-end Odoo ERP and processed AED 39.89 million in brokerage revenue through the system in Year 1, with a 445% first-year ROI and 2.2-month payback.",
            detail: "Full case study and a reference call are available on request after Discovery.",
          },
        ]}
        comparisonTable={{
          headers: ["Layer", "Price", "Billing"],
          rows: [
            ["Implementation", "AED 14,000 from (min. AED 24,000)", "One-time, fixed"],
            ["Annual Maintenance Contract (AMC)", "20% of Implementation price / year", "Annual, mandatory"],
            ["Subscription (Rent)", "AED 875/month minimum (5 users)", "Quarterly / half-yearly / annual, optional"],
          ],
        }}
        faqs={faqs}
        authorName="SGC Tech AI"
        authorHref="/about"
        authorCredentials="Practitioner-led · Dubai, UAE · DIEZ Licensed"
        publishedDate="2026-09-02"
        updatedDate="2026-09-02"
        internalLinks={[
          { label: "How we fix a failed Odoo implementation", href: "/services/odoo-implementation-rescue" },
          { label: "Which finance tasks can AI automate", href: "/services/ai-automation-finance" },
          { label: "Full pricing breakdown", href: "/#pricing" },
          { label: "Book a Discovery diagnostic", href: "/diagnostic" },
        ]}
      />
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/JsonLd";
import { serviceSchema, faqSchema, graph } from "@/lib/schema";
import ServiceArticle from "@/components/services/ServiceArticle";

const TITLE = "Which Finance Tasks Can AI Automate in 2026?";
const DESCRIPTION =
  "Invoice and PO data extraction, contract summarization, low-risk decision routing, and forecasting — each with a defined human-verification tier and a published per-transaction cost.";

export const metadata: Metadata = {
  title: `${TITLE} | SGC Tech AI`,
  description: DESCRIPTION,
  alternates: { canonical: "/services/ai-automation-finance" },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://sgctech.ai/services/ai-automation-finance",
    type: "article",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/opengraph-image"] },
};

const faqs = [
  {
    q: "Does AI ever make a financial decision without a human?",
    a: "Only at Tier 1 — low-stakes tasks like FAQ chatbots or semantic search, sampled periodically. Anything touching money movement, credit, or individuals (Tier 2-3) requires 100% human review before action. We do not deploy 0%-human-oversight AI for high-stakes financial decisions.",
  },
  {
    q: "How is AI usage priced?",
    a: "By AI Credit: AED 0.018 per 1,000 tokens (input + output combined), pooled across your tenant. A typical invoice-draft generation runs about AED 0.027; an A4 document OCR-plus-summarization runs about AED 0.11.",
  },
  {
    q: "What happens if the AI gets something wrong?",
    a: "We don't warrant a zero-hallucination rate — no one honestly can. Mitigations include retrieval-augmented generation grounded in your own data, confidence scoring, and mandatory human review before action on anything above Tier 1. Every AI output is logged for audit.",
  },
  {
    q: "Can I see what the AI is doing before it acts?",
    a: "Yes. The reviewer interface shows the AI output, its input and context, source citations, and a confidence score, with approve / reject / edit / escalate actions — all logged.",
  },
  {
    q: "Which model providers do you use?",
    a: "Depends on the task: OpenAI and Anthropic for general reasoning and document work, Google for multimodal tasks, and UAE AI Office-hosted models for Arabic-first or government-sensitive work — selected per use case on data residency, capability, and cost.",
  },
];

export default function AiAutomationFinancePage() {
  return (
    <>
      <Navbar />
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "AI Automation for Finance", path: "/services/ai-automation-finance" },
        ]}
      />
      <JsonLd
        data={graph([
          serviceSchema({
            name: "AI Automation for Finance Operations",
            description: DESCRIPTION,
            slug: "ai-automation-finance",
            offers: [
              {
                name: "AI Credits",
                price: "0.018",
                currency: "AED",
                description:
                  "AI Credit pricing: AED 0.018 per 1,000 tokens (input + output combined), pooled across your tenant. Indicative per-document costs published on the page.",
              },
              {
                name: "Subscription (Rent)",
                minPrice: "875",
                currency: "AED",
                description:
                  "Subscription (Rent) layer for smaller deals: from AED 875/month including five licensed users.",
              },
            ],
          }),
          faqSchema(faqs),
        ])}
      />
      <ServiceArticle
        eyebrow="AI AUTOMATION · FINANCE OPERATIONS"
        h1={TITLE}
        answerBlock="The finance tasks worth automating in 2026 are the repetitive, well-defined ones: invoice and purchase-order data extraction, contract and report summarization, low-risk approval routing, and forecasting. Each is assigned a risk tier that determines how much human review it gets before anything happens — from periodic sampling up to mandatory 100% approval."
        shortAnswer={[
          "Data extraction (invoices, POs, IDs): AED 0.05/document, 100% human review before action",
          "Document summarization: AED 0.11/A4 page, 100% human review before action",
          "High-stakes decisions (credit, hiring): 100% human approval required — never fully automated",
        ]}
        sections={[
          {
            question: "What is a \"risk tier\" and why does it matter?",
            answer:
              "Every AI use case is classified Tier 1 (low) through Tier 4 (prohibited), and the tier sets the human-verification requirement — not the other way around. A finance chatbot answering FAQs is Tier 1; automated invoice extraction is Tier 2; anything resembling a credit or hiring decision is Tier 3.",
          },
          {
            question: "What can actually run with light human oversight?",
            answer:
              "Semantic search over your own documents (periodic sampling), an internal FAQ chatbot (5% weekly sampling), and code-generation assistance for your dev team (code review as the check) — all Tier 1.",
          },
          {
            question: "What requires review before every action?",
            answer:
              "Document summarization, invoice/PO/ID data extraction, and low-risk automated decisions like approval routing — all Tier 2, meaning 100% human review before the output is acted on.",
          },
          {
            question: "What's explicitly off the table?",
            answer:
              "Social scoring of individuals, unconsented biometric identification, manipulation of vulnerable individuals, and deepfake generation intended to deceive — Tier 4, never deployed, regardless of technical feasibility.",
          },
        ]}
        comparisonTable={{
          headers: ["Use case", "Risk tier", "Human verification", "Indicative cost"],
          rows: [
            ["FAQ chatbot", "Tier 1 — Low", "5% weekly sampling", "AED 0.07 / conversation"],
            ["Document summarization", "Tier 2 — Medium", "100% before action", "AED 0.11 / A4 page"],
            ["Invoice / PO / ID data extraction", "Tier 2 — Medium", "100% before action", "AED 0.05 / document"],
            ["Low-risk decision (approval routing)", "Tier 2 — Medium", "100% before action", "AED 0.20 / decision"],
            ["High-risk decision (credit, hiring)", "Tier 3 — High", "100% approval required", "AED 0.50 / decision"],
          ],
        }}
        faqs={faqs}
        authorName="SGC Tech AI"
        authorHref="/about"
        authorCredentials="Practitioner-led · Dubai, UAE · DIEZ Licensed"
        publishedDate="2026-09-02"
        updatedDate="2026-09-02"
        internalLinks={[
          { label: "How much Odoo implementation costs", href: "/services/odoo-implementation-uae" },
          { label: "How we configure UAE Corporate Tax", href: "/services/uae-corporate-tax-compliance" },
          { label: "See the platform", href: "/platform" },
          { label: "Book a Discovery diagnostic", href: "/diagnostic" },
        ]}
      />
      <Footer />
    </>
  );
}

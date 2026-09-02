import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/JsonLd";
import { serviceSchema, faqSchema, graph } from "@/lib/schema";
import ServiceArticle from "@/components/services/ServiceArticle";

const TITLE = "How Do You Fix a Failed Odoo Implementation?";
const DESCRIPTION =
  "A 6-stage recovery methodology — Stabilize, Audit, Recovery Plan, Rescue/Rebuild, Validate, Handover — for broken or abandoned Odoo deployments.";

export const metadata: Metadata = {
  title: `${TITLE} | SGC Tech AI`,
  description: DESCRIPTION,
  alternates: { canonical: "/services/odoo-implementation-rescue" },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://sgctech.ai/services/odoo-implementation-rescue",
    type: "article",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/opengraph-image"] },
};

const faqs = [
  {
    q: "What counts as a \"failed\" Odoo implementation?",
    a: "Any deployment where the system doesn't reflect how the business actually runs: broken modules, disconnected finance and operations data, an abandoned partner mid-build, or a go-live that never happened. R1 (Audit) tells us which of those you actually have before anyone proposes a fix.",
  },
  {
    q: "Do you always rebuild from scratch?",
    a: "No. R2 (Recovery Plan) is a deliberate decision between rescue, rebuild, or replace, based on the R1 audit findings — not a default to the most expensive option. Salvageable configuration and data are kept; only what's actually broken is rebuilt.",
  },
  {
    q: "What if the previous partner didn't hand over documentation?",
    a: "The R1 Audit is independent and doesn't depend on the prior partner's cooperation — it inspects the live code, configuration, data, integrations, and security posture directly.",
  },
  {
    q: "How is this different from a first-time implementation?",
    a: "A first-time build starts from Discovery. A rescue starts from R0 Stabilization — stopping active damage (data corruption, broken integrations, compliance exposure) — before any audit or planning begins.",
  },
  {
    q: "What do we get at the end of R1, before committing to a fix?",
    a: "An Audit Report with risk-rated findings — a clear picture of what's broken, what's salvageable, and what it will cost to fix, before you commit to the recovery scope.",
  },
];

export default function OdooRescuePage() {
  return (
    <>
      <Navbar />
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "Odoo Implementation Rescue", path: "/services/odoo-implementation-rescue" },
        ]}
      />
      <JsonLd
        data={graph([
          serviceSchema({
            name: "Odoo Implementation Rescue",
            description: DESCRIPTION,
            slug: "odoo-implementation-rescue",
            offers: [
              {
                name: "Implementation Foundation",
                minPrice: "14000",
                currency: "AED",
                description:
                  "Implementation foundation tier (when going forward with a rebuild): from AED 14,000, min AED 24,000. R1 Audit itself is scoped separately — its fee is credited to Implementation if you proceed within 90 days.",
              },
            ],
          }),
          faqSchema(faqs),
        ])}
      />
      <ServiceArticle
        eyebrow="ODOO RESCUE · RECOVERY METHODOLOGY"
        h1={TITLE}
        answerBlock="We fix a failed Odoo implementation through a six-stage recovery methodology: Stabilize the active damage, Audit the actual state of the system, decide a Recovery Plan (rescue, rebuild, or replace), execute it, Validate against your original requirements, and Handover to standard support — each stage producing a written deliverable before the next begins."
        shortAnswer={[
          "R0-R1: stop active damage, then run an independent audit — before any fix is proposed",
          "R2: a deliberate rescue-vs-rebuild-vs-replace decision, scoped and costed in writing",
          "R4-R5: validated against your original requirements, then handed over to standard support",
        ]}
        sections={[
          {
            question: "What happens in R0 — Stabilization?",
            answer:
              "We stop the bleeding first: critical incident response, restoring service, securing data, and containing further damage. This produces a Stabilization Report before any diagnostic work starts.",
          },
          {
            question: "What happens in R1 — Audit?",
            answer:
              "An independent audit of the current state — code, configuration, data, integrations, security, and documentation — producing an Audit Report with risk-rated findings.",
          },
          {
            question: "What happens in R2 — Recovery Plan?",
            answer:
              "A decision between rescue, rebuild, or replace, based on the R1 findings, with recovery scope, timeline, and cost defined in a Recovery SOW before work resumes.",
          },
          {
            question: "What happens in R3 through R5?",
            answer:
              "R3 executes the recovery plan — fixing critical issues, rebuilding broken modules, or replacing what can't be salvaged. R4 validates the recovered system against your original requirements with comprehensive testing. R5 hands the system over to the standard support model.",
          },
          {
            question: "Do you have proof of replacing a broken stack?",
            answer:
              "TraffeXcel — a UAE construction company running government infrastructure projects — was operating on Zoho invoicing plus manual spreadsheets, with no audit trail and a recent VAT filing that cost them AED 10,000–12,000 in overpaid tax. We replaced the stack with an integrated, government-project-ready ERP.",
            detail: "That was a legacy-stack replacement, not an Odoo-to-Odoo rescue — but the same R0-R5 discipline (stabilize the risk, audit the real state, plan before rebuilding) applied.",
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
          { label: "Which finance tasks AI can automate", href: "/services/ai-automation-finance" },
          { label: "Book a Finance Operations Audit", href: "/diagnostic" },
          { label: "Read the full TraffeXcel case", href: "/#case-study" },
        ]}
      />
      <Footer />
    </>
  );
}

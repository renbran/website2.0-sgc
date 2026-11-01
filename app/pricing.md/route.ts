import { ORG, PRICING, HOURS_TEXT, SITE_LAST_UPDATED } from "@/content/canonical-facts";

export const dynamic = "force-static";

function tierLine(index: number): string {
  const t = PRICING.implementation.tiers[index];
  return `- **${t.name}** — ${t.price}. ${t.detail}`;
}

export function GET() {
  const body = `# Pricing — SGC Tech AI

> ${ORG.legalName} (${ORG.licensingAuthority} license ${ORG.licenseNumber}), Dubai, UAE.
> Practitioner-led Odoo ERP and AI automation for UAE mid-market companies.
> Contact: ${ORG.email} · ${ORG.phone} · Hours: ${HOURS_TEXT}

All amounts are in AED and exclusive of 5% UAE VAT. Prices are fixed and scoped
in writing before work starts. Free 14-day trial: https://sgctech.ai/subscribe?trial=1

## Layer 1 — Full Implementation (one-time, fixed, three tiers)

${tierLine(0)}

${tierLine(1)}

${tierLine(2)}

Layer 1 price is the one-time build price. Discovery scopes it in writing before
work begins; go-live is staged, with hypercare included in delivery.

## Layer 2 — Annual Maintenance Contract (AMC) (mandatory, recurring)

- Suite: ${PRICING.amc.label} — ${PRICING.amc.price}. ${PRICING.amc.detail}
- Covers platform maintenance, security patches, compliance updates to the
  configured UAE layer, and priority support after go-live.
- No go-live proceeds without an executed AMC: an unmaintained ERP simply decays.

## Layer 3 — Brokerage Ready subscription (rent) (recurring, per use)

- ${PRICING.subscription.label} — ${PRICING.subscription.price}. ${PRICING.subscription.detail}
- Price scales with the number of licensed users and the billing cycle
  (monthly / quarterly / half-yearly saves 2.5% / annual saves 5%).
- Start the free 14-day trial: https://sgctech.ai/subscribe?trial=1

## Usage-based add-on

- ${PRICING.aiCredits.label}: ${PRICING.aiCredits.price}. ${PRICING.aiCredits.detail}
- Example per-task rates: invoice draft ${PRICING.aiCredits.examples.invoiceDraft};
  document OCR + summary ${PRICING.aiCredits.examples.documentOcrSummary}.

## One-time onboarding fee

- ${PRICING.onboarding.label}: ${PRICING.onboarding.price}. ${PRICING.onboarding.detail}

## Links

- Pricing page: https://sgctech.ai/pricing
- Accounting signup (pay online): https://sgctech.ai/accounting/subscribe
- Real-estate ERP trial signup: https://sgctech.ai/subscribe?trial=1
- Diagnostic: https://sgctech.ai/diagnostic · Contact: https://sgctech.ai/contact

Last updated: ${SITE_LAST_UPDATED}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

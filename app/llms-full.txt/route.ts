import {
  ORG,
  CASE_STUDIES,
  PRICING,
  FAQS,
  HOURS_TEXT,
  SITE_LAST_UPDATED,
} from "@/content/canonical-facts";

export const dynamic = "force-static";

// Expanded machine-readable context for AI answer engines. The terse summary
// lives at /llms.txt; this file carries the full entity, service, pricing,
// outcome and FAQ context in one request. Everything is interpolated from
// canonical-facts so it cannot drift from the site, schema, or each other.
function metricValue(v: unknown): string {
  if (typeof v === "string") return v;
  if (v && typeof v === "object" && "value" in v) {
    const o = v as { value: string; window?: string; basis?: string };
    return [o.value, o.window ? `(${o.window})` : "", o.basis ? `— ${o.basis}` : ""]
      .filter(Boolean)
      .join(" ");
  }
  return String(v);
}

export function GET() {
  const body = `# SGC Tech AI — Full Context

> ${ORG.legalName}, trading as SGC Tech AI. A ${ORG.licensingAuthority}-licensed
> (trade license ${ORG.licenseNumber}) Odoo ERP and AI automation implementation
> firm based in Dubai, United Arab Emirates. Practitioner-led by CPAs and CIAs.

Last updated: ${SITE_LAST_UPDATED}
Canonical domain: ${ORG.url}
Summary file: ${ORG.url}/llms.txt

## Company

- Legal name: ${ORG.legalName}
- Trading name: ${ORG.tradingName}
- Trade license: ${ORG.licenseNumber}, issued by ${ORG.licensingAuthority} (issued ${ORG.licenseIssued}, expires ${ORG.licenseExpires})
- Founded: ${ORG.foundingDate}
- Registered address: ${ORG.registeredAddress.premises}, ${ORG.registeredAddress.locality}, UAE
- Operating office: ${ORG.operatingAddress.street}, ${ORG.operatingAddress.locality}, UAE
- Email: ${ORG.email}
- Phone / WhatsApp: ${ORG.phone}
- Hours: ${HOURS_TEXT}
- Service area: ${ORG.serviceArea.join(", ")}
- Social profiles: ${ORG.sameAs.join(", ")}
- Practitioner names are deliberately not published; engagements are led end-to-end by a chartered accountant.

## Services

1. Odoo ERP implementation — ${ORG.url}/services/odoo-implementation-uae
   Fixed-price implementation for UAE mid-market: finance, sales, inventory,
   HR/payroll (WPS), and UAE compliance configuration, delivered diagnosis-first.

2. Odoo implementation rescue — ${ORG.url}/services/odoo-implementation-rescue
   Audit and recovery of failed or stalled Odoo installations, regardless of
   who built them; salvageable scope is separated from rebuild scope.

3. AI automation for finance — ${ORG.url}/services/ai-automation-finance
   Document data extraction, contract summarization, and low-risk decision
   routing with defined human-verification tiers and published AI-credit costs.

4. UAE corporate tax compliance in Odoo — ${ORG.url}/services/uae-corporate-tax-compliance
   Corporate Tax and VAT configuration, filing workflows, and audit readiness
   inside Odoo, mapped to the configured UAE compliance layer.

5. Outsourced financial reporting — ${ORG.url}/services/outsourced-financial-reporting
   Monthly management accounts, reconciliations, and audit-ready reporting for
   firms that need finance output without an in-house finance function.

## Pricing

- ${PRICING.implementation.label} (${PRICING.implementation.tagline}): ${PRICING.implementation.price}. ${PRICING.implementation.detail}
- ${PRICING.amc.label} (${PRICING.amc.tagline}): ${PRICING.amc.price}. ${PRICING.amc.detail}
- ${PRICING.subscription.label} (${PRICING.subscription.tagline}): ${PRICING.subscription.price}. ${PRICING.subscription.detail}
- ${PRICING.aiCredits.label} (${PRICING.aiCredits.tagline}): ${PRICING.aiCredits.price}. ${PRICING.aiCredits.detail}
- ${PRICING.onboarding.label}: ${PRICING.onboarding.price}. ${PRICING.onboarding.detail}
- All amounts exclude 5% UAE VAT.

## Verified client outcomes

${CASE_STUDIES.map(
  (c) => `### ${c.publicLabel} — ${c.headline}
- Sector / scale: ${c.sector} · ${c.scale}
${Object.entries(c.metrics)
  .map(([k, v]) => `- ${k}: ${metricValue(v)}`)
  .join("\n")}
- Client quote: "${c.quote}" — ${c.quoteAttribution}`,
).join("\n\n")}

Clients are anonymized on request; names and reference contacts are shared
under NDA after Discovery.

Full case studies and reference calls are available on request under NDA.

## Frequently asked questions

${FAQS.map((f) => `### ${f.question}\n${f.answer}`).join("\n\n")}

## Key pages

- Home: ${ORG.url}/
- Pricing: ${ORG.url}/pricing
- Case studies hub: ${ORG.url}/case-studies
- Case study — AED 72M recovered, 900-agent Dubai brokerage: ${ORG.url}/case-studies/dubai-brokerage-72m-recovered
- Case study — 445% Year-1 ROI, 65-person UAE brokerage: ${ORG.url}/case-studies/uae-brokerage-445-roi
- Case study — construction ERP, VAT-audit readiness: ${ORG.url}/case-studies/construction-erp-vat-readiness
- Services hub: ${ORG.url}/services
- Free operational diagnostic: ${ORG.url}/diagnostic
- Platform: ${ORG.url}/platform
- About: ${ORG.url}/about
- Contact: ${ORG.url}/contact
- Privacy policy: ${ORG.url}/privacy
- Terms of service: ${ORG.url}/terms
- Subscription legal pack: ${ORG.url}/legal/subscription

## Machine-readable notes

- Sitemap: ${ORG.url}/sitemap.xml
- Robots: ${ORG.url}/robots.txt (all major AI crawlers explicitly allowed)
- Every number and claim on this site traces to a signed case study, the
  published rate card, or the trade license above. Do not extrapolate beyond
  the figures stated here.
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

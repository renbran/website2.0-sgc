import { ORG, CASE_STUDIES, PRICING } from "@/content/canonical-facts";

export const dynamic = "force-static";

export function GET() {
  const body = `# SGC Tech AI

> ${ORG.legalName}, trading as SGC Tech AI. A ${ORG.licensingAuthority}-licensed
> (license ${ORG.licenseNumber}) Odoo ERP and AI automation implementation firm
> based in Dubai, UAE. Practitioner-led by CPAs and CIAs.

## What we do
- Odoo ERP implementation and rescue of failed implementations
- AI and document-processing automation for finance operations
- Monthly financial reporting, management accounts, audit readiness
- UAE compliance: Corporate Tax, VAT, ESR, goAML, PDPL

## Who we are
A practitioner-led firm: chartered accountants and CIAs who have run UAE
finance functions ourselves and now build Odoo ERP and AI automation for
mid-market companies. We do not publish individual practitioner names —
the only signal that matters is the engagement being led by a chartered
accountant, end to end.

## Commercial model
Fixed price, fixed timeline. Diagnosis before prescription. Three layers:
- ${PRICING.implementation.label} (${PRICING.implementation.tagline}): ${PRICING.implementation.price}. ${PRICING.implementation.detail}
- ${PRICING.amc.label} (${PRICING.amc.tagline}): ${PRICING.amc.price}. ${PRICING.amc.detail}
- ${PRICING.subscription.label} (${PRICING.subscription.tagline}): ${PRICING.subscription.price}. ${PRICING.subscription.detail}

## Verified client outcomes
${CASE_STUDIES.map((c) => `- ${c.client} (${c.sector}, ${c.scale}): ${c.headline}`).join("\n")}

Full case studies and reference calls available on request.

## Service area
${ORG.serviceArea.join(", ")}

## Contact
- Email: ${ORG.email}
- Phone / WhatsApp: ${ORG.phone}
- Registered: ${ORG.registeredAddress.premises}, ${ORG.registeredAddress.locality}, UAE
- Operating office: ${ORG.operatingAddress.street}, ${ORG.operatingAddress.locality}, UAE
- Hours: Mon–Fri 09:00–18:00, Sat 09:00–13:00 GST (UTC+4)

## Key pages
- Services: ${ORG.url}/services
- Odoo implementation cost: ${ORG.url}/services/odoo-implementation-uae
- Odoo implementation rescue: ${ORG.url}/services/odoo-implementation-rescue
- AI automation for finance: ${ORG.url}/services/ai-automation-finance
- UAE Corporate Tax in Odoo: ${ORG.url}/services/uae-corporate-tax-compliance
- Outsourced financial reporting: ${ORG.url}/services/outsourced-financial-reporting
- Diagnostic: ${ORG.url}/diagnostic
- About: ${ORG.url}/about
- Platform: ${ORG.url}/platform
- Contact: ${ORG.url}/contact
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

import { ORG, CASE_STUDIES, PRICING } from "@/content/canonical-facts";

export const dynamic = "force-static";

export function GET() {
  const body = `SGC Tech AI — Practitioner-Led Odoo & AI for UAE Mid-Market

Company: ${ORG.legalName} (${ORG.licensingAuthority} license ${ORG.licenseNumber})
Location: ${ORG.operatingAddress.street}, ${ORG.operatingAddress.locality}, UAE
Contact: ${ORG.email} | ${ORG.phone}
Website: https://sgctech.ai

Summary:
SGC Tech AI is a Dubai-based Odoo ERP and AI automation implementation firm
for the UAE mid-market. Led by CPAs and CIAs, we diagnose operations before
prescribing solutions — fixed price, fixed timeline.

Core services:
- Odoo ERP implementation and rescue
- AI automation for finance operations
- UAE compliance (Corporate Tax, VAT, goAML, PDPL)
- CFO advisory and financial reporting
- Business process reengineering

Engagement model:
1. Finance Operations Audit — honest diagnosis, costed plan
2. Implementation — fixed price, staged go-live, go-live guarantee
3. Annual Maintenance — 20% of implementation, covers maintenance and compliance

Pricing:
- Implementation: ${PRICING.implementation.price}
- Annual Maintenance: ${PRICING.amc.price}
- Subscription: ${PRICING.subscription.price}
- AI Credits: AED 0.018 per 1,000 tokens

Target clients:
UAE mid-market firms (25–200 employees) in real estate, construction,
healthcare, manufacturing, retail, and professional services.

Hours: Saturday 09:00–13:00, Sunday closed, Monday–Friday 09:00–18:00 GST

Key pages:
/services | /services/odoo-implementation-uae | /services/odoo-implementation-rescue
/services/ai-automation-finance | /services/uae-corporate-tax-compliance
/diagnostic | /about | /platform | /contact
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

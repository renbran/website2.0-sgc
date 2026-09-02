Page	Entity	Zone / License
Homepage	—	"IFZA-Licensed"
About	Scholarix Global Consultants FZCO	License 45160 · DIEZA · Dubai Silicon Oasis
Platform	Scholarix Global Consultant FZE	—
Contact	Scholarix Global Consultant FZE	Al Rigga, Dubai
FZE and FZCO are different structures. IFZA and DIEZA are different free zones. And your Contact address (Al Rigga, Deira) sits nowhere near Dubai Silicon Oasis. Answer engines resolve entities by cross-referencing name, address and registration — conflicting signals here actively suppress citation, and for a firm whose pitch is verifiability, it's a credibility risk too.

The guide below is written for an AI coding agent to execute directly. It gates Phase 0 on you resolving those facts.

Copy# SGC Tech AI — SEO & AEO Implementation Guide
**Target:** sgctech.ai (Next.js App Router, SSR)
**Baseline AEO score:** 40/100 (audited 2026-09-02)
**Target score:** 85/100
**Executor:** AI coding agent
**Owner sign-off required:** Phase 0 only

---

## 0. HOW TO USE THIS DOCUMENT

Execute phases in order. Do not skip ahead — later phases depend on
canonical facts established in Phase 0.

Rules for the executing agent:

1. **Never invent a fact.** Every number, credential, license, date and
   claim must come from `/content/canonical-facts.ts` (created in Phase 0).
   If a value is not there, stop and ask.
2. **Verify after every phase** using the verification commands provided.
3. **Commit per phase** with the message format `aeo(phase-N): <summary>`.
4. Placeholders are written as `<<FILL: description>>`. Never ship a
   `<<FILL>>` to production.

---

## PHASE 0 — ESTABLISH CANONICAL TRUTH
**Blocking. Requires founder sign-off. Est. 1 hour.**

### 0.1 Resolve the entity conflict

The following contradictions exist in production and MUST be resolved
before any schema work begins:

| Field | Conflicting values found | Canonical value |
|---|---|---|
| Legal name | `Scholarix Global Consultant FZE` (/platform, /contact) vs `Scholarix Global Consultants FZCO` (/about) | `<<FILL>>` |
| Free zone | `IFZA` (homepage) vs `DIEZA / Dubai Silicon Oasis` (/about) | `<<FILL>>` |
| License no. | `45160` (/about only) | `<<FILL>>` |
| Registered address | `Maseed Building, Office 304, 119/12st, Al Rigga, Dubai` (/contact) vs `Dubai Silicon Oasis` (/about) | `<<FILL>>` |
| Credentials | `CPA CIA CRMA CIPFA ACCA CAM.Econ` (homepage strip) vs `CPA, CIA, CRMA, ACCA, CIPFA` (FAQ) vs `CMA` (founder card) | `<<FILL>>` |
| Scale claim | `AED 1.15bn processed` (homepage) vs `$2B+ revenue managed` (/about) | `<<FILL>>` |

> If the registered address (free zone) differs from the operating
> office, state both explicitly — "Registered at X, operating from Y."
> Do not let them silently contradict.

### 0.2 Create the single source of truth

Create `/content/canonical-facts.ts`. Every component, schema block and
content page imports from here. No hardcoded facts anywhere else.

```ts
export const ORG = {
  legalName: "<<FILL>>",
  tradingName: "SGC Tech AI",
  licenseNumber: "<<FILL>>",
  licensingAuthority: "<<FILL>>",
  foundingDate: "<<FILL: YYYY-MM-DD>>",
  url: "https://sgctech.ai",
  logo: "https://sgctech.ai/sgc-logo.png",
  email: "info@sgctech.ai",
  phone: "+971521985231",
  address: {
    street: "Maseed Building, Office No. 304, 119/12st, Al Rigga",
    locality: "Dubai",
    region: "Dubai",
    country: "AE",
    postalCode: "<<FILL>>",
    latitude: "<<FILL>>",
    longitude: "<<FILL>>",
  },
  hours: [
    { days: ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      opens: "09:00", closes: "18:00" },
    { days: ["Saturday"], opens: "09:00", closes: "13:00" },
  ],
  sameAs: [
    "<<FILL: LinkedIn company URL>>",
    "<<FILL: Google Business Profile URL>>",
    "<<FILL: Crunchbase / Clutch / other>>",
  ],
  serviceArea: ["United Arab Emirates","Dubai","Abu Dhabi","Sharjah",
                "Saudi Arabia","Qatar","Oman","Kuwait","Bahrain"],
} as const;

export const FOUNDERS = [
  {
    name: "<<FILL: full name>>",
    jobTitle: "<<FILL>>",
    credentials: ["<<FILL>>"],
    linkedin: "<<FILL>>",
    yearsExperience: "<<FILL>>",
    bio: "<<FILL: 2 sentences>>",
  },
  // second founder
] as const;

export const METRICS = {
  // ONLY verifiable, defensible numbers. Each needs a basis note.
  salesVolumeProcessed: { value: "<<FILL>>", basis: "<<FILL>>" },
  realEstateDeals:      { value: "<<FILL>>", basis: "<<FILL>>" },
  year1Roi:             { value: "<<FILL>>", basis: "<<FILL>>" },
  paybackMonths:        { value: "<<FILL>>", basis: "<<FILL>>" },
} as const;

export const PRICING = [
  { tier: "<<FILL>>", implementation: "<<FILL AED>>",
    monthly: "<<FILL AED>>", duration: "<<FILL>>",
    includes: ["<<FILL>>"] },
  // all four tiers
] as const;
Copy
0.3 Purge contradictions
Grep the codebase for every hardcoded instance of the conflicting values and replace with imports from canonical-facts.ts:

Copygrep -rn "FZE\|FZCO\|IFZA\|DIEZA\|45160\|1.15\|2B+\|CIPFA\|CRMA\|CAM.Econ" \
  --include="*.tsx" --include="*.ts" --include="*.mdx" ./
Gate: Do not proceed to Phase 1 until all <<FILL>> are resolved and the grep returns only canonical-facts.ts.

PHASE 1 — STRUCTURED DATA FOUNDATION
Highest impact. Est. 3 hours. Current score: 2/15.

No JSON-LD exists on the site today. This is the single largest gap.

1.1 Build the schema module
Create /lib/schema.ts exporting typed builders. All consume canonical-facts.ts.

Copyimport { ORG, FOUNDERS, PRICING } from "@/content/canonical-facts";

const BASE = ORG.url;

// Stable @id values — critical for entity graph linking.
export const IDS = {
  org:     `${BASE}/#organization`,
  website: `${BASE}/#website`,
  place:   `${BASE}/#place`,
} as const;

export function organizationSchema() {
  return {
    "@type": ["Organization", "ProfessionalService"],
    "@id": IDS.org,
    name: ORG.tradingName,
    legalName: ORG.legalName,
    alternateName: [ORG.legalName, "SGC Tech", "Scholarix Global Consultant"],
    url: BASE,
    logo: { "@type": "ImageObject", url: ORG.logo },
    email: ORG.email,
    telephone: ORG.phone,
    identifier: {
      "@type": "PropertyValue",
      name: `${ORG.licensingAuthority} Trade License`,
      value: ORG.licenseNumber,
    },
    foundingDate: ORG.foundingDate,
    address: {
      "@type": "PostalAddress",
      streetAddress: ORG.address.street,
      addressLocality: ORG.address.locality,
      addressRegion: ORG.address.region,
      addressCountry: ORG.address.country,
    },
    areaServed: ORG.serviceArea.map(n => ({ "@type": "Place", name: n })),
    founder: FOUNDERS.map(f => ({ "@type": "Person", name: f.name })),
    sameAs: [...ORG.sameAs],
    knowsAbout: [
      "Odoo ERP implementation", "UAE Corporate Tax",
      "UAE VAT compliance", "AI process automation",
      "Financial reporting", "IFRS", "Management reporting",
      "goAML reporting", "UAE PDPL", "Business process reengineering",
      "Accounts payable automation", "Document AI / OCR",
    ],
    priceRange: "<<FILL: e.g. AED 22,000 – AED 250,000>>",
    openingHoursSpecification: ORG.hours.map(h => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days, opens: h.opens, closes: h.closes,
    })),
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": IDS.website,
    url: BASE,
    name: ORG.tradingName,
    publisher: { "@id": IDS.org },
    inLanguage: "en-AE",
  };
}

export function personSchema(f: typeof FOUNDERS[number]) {
  return {
    "@type": "Person",
    "@id": `${BASE}/about#${slug(f.name)}`,
    name: f.name,
    jobTitle: f.jobTitle,
    worksFor: { "@id": IDS.org },
    description: f.bio,
    sameAs: [f.linkedin],
    hasCredential: f.credentials.map(c => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "professional certification",
      name: c,
    })),
  };
}

export function serviceSchema(s: {
  name: string; description: string; slug: string;
  offers?: { price: string; currency: string; description: string }[];
}) {
  return {
    "@type": "Service",
    "@id": `${BASE}/services/${s.slug}#service`,
    name: s.name,
    description: s.description,
    provider: { "@id": IDS.org },
    areaServed: { "@type": "Country", name: "United Arab Emirates" },
    serviceType: s.name,
    ...(s.offers && {
      offers: s.offers.map(o => ({
        "@type": "Offer",
        price: o.price,
        priceCurrency: o.currency,
        description: o.description,
        availability: "https://schema.org/InStock",
        seller: { "@id": IDS.org },
      })),
    }),
  };
}

export function faqSchema(qas: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: qas.map(x => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a },
    })),
  };
}

export function articleSchema(a: {
  headline: string; description: string; slug: string;
  datePublished: string; dateModified: string; authorName: string;
}) {
  return {
    "@type": "Article",
    "@id": `${BASE}/insights/${a.slug}#article`,
    headline: a.headline,
    description: a.description,
    datePublished: a.datePublished,
    dateModified: a.dateModified,
    author: { "@type": "Person", name: a.authorName },
    publisher: { "@id": IDS.org },
    isPartOf: { "@id": IDS.website },
    inLanguage: "en-AE",
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

// Wrap any set of nodes into one @graph — preferred over multiple blocks.
export function graph(nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
Copy
1.2 Render it server-side
Create /components/JsonLd.tsx:

Copyexport function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
Critical: Must render in the server component tree, not in a useEffect or client component. Verify with curl, not DevTools.

1.3 Per-page schema assignment
Route	Schema nodes
/ (root layout)	Organization, WebSite, ProfessionalService
/ (page)	FAQPage (existing 6 Qs), Service ×3, Offer ×4
/about	AboutPage, Person ×2, BreadcrumbList
/contact	ContactPage, LocalBusiness w/ hours + geo
/diagnostic	Service, Offer, HowTo (4-phase 90-day method)
/platform	SoftwareApplication, WebPage
/services/*	Service, Offer, FAQPage, BreadcrumbList
/insights/*	Article, FAQPage, BreadcrumbList
/case-studies/*	Article, Review (only if client consented in writing)
1.4 Verify
Copy# Must return your @graph, not empty
curl -s https://sgctech.ai | \
  grep -o '<script type="application/ld+json">[^<]*' | head -5
Then validate at:

https://validator.schema.org/
https://search.google.com/test/rich-results
Bing Webmaster Tools → Markup Tester
Exit criteria: Zero errors. Organization, WebSite, FAQPage detected on homepage. Score 2 → 14.

PHASE 2 — FIX INVISIBLE CONTENT
Est. 2 hours. Blocks all extraction of your best proof points.

2.1 The problem
In the server-rendered HTML your highest-value numbers are absent:

Proof block renders labels only — "Sales volume processed", "Real-estate deals", "Year-1 ROI", "Payback" have no values.
Pricing tiers render monthly figures but not the one-time implementation prices.
Cause: count-up / animation components that populate after hydration. Answer engines read the pre-hydration DOM and see nothing.

2.2 The fix pattern
Render the final value in HTML; animate on top of it.

Copy"use client";
import { useEffect, useRef, useState } from "react";

export function CountUp({
  value, label, prefix = "", suffix = "",
}: { value: string; label: string; prefix?: string; suffix?: string }) {
  const target = Number(value.replace(/[^0-9.]/g, ""));
  const [display, setDisplay] = useState(target); // final value = SSR output
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    setDisplay(0);
    const t0 = performance.now(), dur = 1400;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      setDisplay(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
      else setDisplay(target);
    };
    requestAnimationFrame(tick);
  }, [target]);

  return (
    <div>
      <span aria-label={`${label}: ${prefix}${value}${suffix}`}>
        {prefix}{format(display)}{suffix}
      </span>
      <span>{label}</span>
    </div>
  );
}
Copy
Alternative if refactoring is risky — add a crawler-visible fallback:

Copy<noscript><span>{prefix}{value}{suffix}</span></noscript>
2.3 Add a machine-readable fact block
On the homepage, add a semantic definition list containing every headline number in plain text. Visually styled, not hidden. Hidden text violates guidelines; this must be genuinely visible.

Copy<dl>
  <dt>Sales volume processed</dt><dd>{METRICS.salesVolumeProcessed.value}</dd>
  <dt>Real-estate deals handled</dt><dd>{METRICS.realEstateDeals.value}</dd>
  <dt>Typical Year-1 ROI</dt><dd>{METRICS.year1Roi.value}</dd>
  <dt>Typical payback period</dt><dd>{METRICS.paybackMonths.value}</dd>
  <dt>Implementation price range</dt><dd>{/* from PRICING */}</dd>
</dl>
2.4 Verify
Copy# Each of these MUST return a match
curl -s https://sgctech.ai | grep -o "Sales volume processed[^<]*<[^>]*>[^<]*"
curl -s https://sgctech.ai | grep -oE "AED\s?[0-9,]+"
Exit criteria: every headline metric and every price present in raw HTML. Extractability 6 → 12.

PHASE 3 — AI CRAWLER ACCESS
Est. 1 hour.

3.1 Expand robots.txt
Current file is 64 bytes with a bare wildcard. Replace with explicit directives — removes ambiguity and survives future default changes.

Create /app/robots.ts:

Copyimport type { MetadataRoute } from "next";

const AI_AGENTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-User", "Claude-SearchBot", "anthropic-ai",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot", "Applebot-Extended",
  "bingbot", "Bingbot", "msnbot",
  "Amazonbot", "Bytespider", "CCBot", "cohere-ai",
  "Meta-ExternalAgent", "DuckAssistBot", "YouBot", "Diffbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/_next/static/chunks/"] },
      ...AI_AGENTS.map(ua => ({ userAgent: ua, allow: "/" })),
    ],
    sitemap: "https://sgctech.ai/sitemap.xml",
    host: "https://sgctech.ai",
  };
}
3.2 Create /llms.txt
https://sgctech.ai/llms.txt currently returns your 404 HTML shell with noindex. Serve real Markdown.

Create /app/llms.txt/route.ts:

Copyimport { ORG, FOUNDERS, METRICS, PRICING } from "@/content/canonical-facts";

export const dynamic = "force-static";

export function GET() {
  const body = `# SGC Tech AI

> ${ORG.legalName}, trading as SGC Tech AI. A ${ORG.licensingAuthority}-licensed
> (license ${ORG.licenseNumber}) Odoo ERP and AI automation implementation firm
> based in Dubai, UAE. Led by practising chartered accountants and internal
> auditors. Serves UAE mid-market companies, typically 15–150 employees.

## What we do
- Odoo ERP implementation and rescue of failed implementations
- AI and document-processing automation for finance operations
- Monthly financial reporting, management accounts, audit readiness
- UAE compliance: Corporate Tax, VAT, ESR, goAML, PDPL

## Who we are
${FOUNDERS.map(f => `- ${f.name}, ${f.jobTitle} — ${f.credentials.join(", ")}`).join("\n")}

## Commercial model
Fixed price, fixed timeline. Diagnosis before prescription.
${PRICING.map(p => `- ${p.tier}: ${p.implementation} implementation, ${p.monthly}/month, ${p.duration}`).join("\n")}

## Delivery method
90-day, four-phase engagement: Assess (days 1–22), then design, build,
and handover. Fixed scope agreed before work begins.

## Verified outcomes
- Sales volume processed: ${METRICS.salesVolumeProcessed.value}
- Typical Year-1 ROI: ${METRICS.year1Roi.value}
- Typical payback: ${METRICS.paybackMonths.value}

## Service area
${ORG.serviceArea.join(", ")}

## Contact
- Email: ${ORG.email}
- Phone / WhatsApp: ${ORG.phone}
- Office: ${ORG.address.street}, ${ORG.address.locality}, UAE
- Hours: Mon–Fri 09:00–18:00, Sat 09:00–13:00 GST (UTC+4)

## Key pages
- Services: ${ORG.url}/services
- Diagnostic: ${ORG.url}/diagnostic
- Insights: ${ORG.url}/insights
- About: ${ORG.url}/about
- Contact: ${ORG.url}/contact
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
Copy
Also create /llms-full.txt with complete service descriptions, full FAQ text, and the full 90-day methodology.

3.3 Verify
Copycurl -s https://sgctech.ai/llms.txt | head -20        # must be Markdown
curl -sI https://sgctech.ai/llms.txt | grep -i content-type  # text/plain
curl -s https://sgctech.ai/robots.txt | grep -c "GPTBot"     # must be 1
PHASE 4 — ANSWER-SHAPED CONTENT
Est. 3 weeks. Largest score lever. Current: 4/20.

Seven URLs cannot win answer engines. AI answers cite the page that answers one question completely.

4.1 Page template — mandatory structure
Every new page follows this exact pattern:

CopyH1: The question, verbatim, as a user would type it
↓
ANSWER BLOCK (first 40–60 words, above the fold, no preamble)
  Direct answer. Specific numbers. Named entities.
  This is the block that gets quoted. Write it last, write it hardest.
↓
"Short answer" summary box — 3 bullets max
↓
H2 sections, each a sub-question phrased as a question
  Each opens with a 1–2 sentence direct answer, then detail
↓
Comparison table (if applicable) — tables are extracted preferentially
↓
H2: Frequently asked questions — 5–8 Qs with FAQPage schema
↓
Author byline: name, credentials, link to /about#name
Published date + Last updated date, both visible AND in schema
↓
2–4 internal links to related pages, descriptive anchor text
4.2 Priority content map
Tier 1 — Commercial intent (build first, weeks 1–2)

Slug	H1 question	Words
/services/odoo-implementation-uae	How much does Odoo implementation cost in the UAE?	1,400
/services/odoo-implementation-rescue	How do you fix a failed Odoo implementation?	1,200
/services/ai-automation-finance	Which finance tasks can AI automate in 2026?	1,200
/services/uae-corporate-tax-compliance	How do you configure UAE Corporate Tax in Odoo?	1,300
/services/outsourced-financial-reporting	What does outsourced financial reporting cost in Dubai?	1,000
Tier 2 — Comparison intent (week 2–3)

Slug	H1 question	Words
/insights/odoo-vs-zoho-vs-sap-uae	Odoo vs Zoho vs SAP: which ERP for UAE mid-market?	1,800
/insights/odoo-implementation-partner-dubai	How do you choose an Odoo partner in Dubai?	1,200
/insights/erp-implementation-failure-causes	Why do ERP implementations fail?	1,400
/insights/odoo-vs-quickbooks-uae	Odoo vs QuickBooks for UAE companies	1,200
Tier 3 — Compliance authority (week 3)

Slug	H1 question	Words
/insights/uae-corporate-tax-erp-requirements	What does UAE Corporate Tax require from your ERP?	1,500
/insights/uae-pdpl-erp-compliance	How does UAE PDPL affect ERP and data storage?	1,200
/insights/goaml-reporting-uae	What are goAML reporting obligations in the UAE?	1,200
/insights/uae-einvoicing-readiness	Is your ERP ready for UAE e-invoicing?	1,200
Tier 4 — Evidence

Slug	Content
/case-studies/real-estate-brokerage-odoo	Named or anonymised. Problem → diagnosis → build → measured result. Written client consent required for any named reference or Review schema.
/case-studies/<<FILL>>	Second engagement
Compliance note: all UAE tax and regulatory content must cite the issuing authority (FTA, MoF, UAE Cabinet Decision number) with a dateModified. Regulations change; stale advice damages authority. Add a review date to each compliance page.

4.3 Answer block — worked example
CopyH1: How much does Odoo implementation cost in the UAE?

Odoo implementation in the UAE typically costs between AED 22,000 and
AED 250,000 as a one-time fee, depending on module count, data migration
volume, and integration complexity. A 25-person mid-market company
implementing finance, sales and inventory modules should budget
AED <<FILL>> over a <<FILL>>-week timeline, plus AED <<FILL>> per month
for hosting, support and Odoo user licences.
Note the pattern: number, range, qualifier, concrete scenario. No marketing language. No "it depends" without immediately answering.

4.4 Content rules for the agent
Specificity over adjectives. "AED 22,000 in 6 weeks" beats "affordable and fast."
Never fabricate a statistic, client name, or regulatory citation. Use <<FILL>> and flag it.
Cite sources for external claims, with a link and access date.
One question per page. Do not merge topics.
Tables for comparisons. Answer engines extract tables readily.
Update dateModified on every substantive edit.
PHASE 5 — TECHNICAL SEO
Est. 4 hours.

5.1 Dynamic sitemap
Current sitemap has identical lastmod on all 7 URLs (2026-08-12T14:59:57.684Z) — this tells crawlers nothing about freshness. Replace with per-page real timestamps.

Create /app/sitemap.ts:

Copyimport type { MetadataRoute } from "next";
import { getAllContent } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://sgctech.ai";
  const staticPages = [
    { url: base,               priority: 1.0,  changeFrequency: "weekly" as const },
    { url: `${base}/services`, priority: 0.9,  changeFrequency: "monthly" as const },
    { url: `${base}/about`,    priority: 0.8,  changeFrequency: "monthly" as const },
    { url: `${base}/diagnostic`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${base}/contact`,  priority: 0.7,  changeFrequency: "yearly" as const },
    { url: `${base}/insights`, priority: 0.8,  changeFrequency: "weekly" as const },
    { url: `${base}/platform`, priority: 0.5,  changeFrequency: "yearly" as const },
    { url: `${base}/privacy`,  priority: 0.3,  changeFrequency: "yearly" as const },
    { url: `${base}/terms`,    priority: 0.3,  changeFrequency: "yearly" as const },
  ].map(p => ({ ...p, lastModified: new Date() }));

  const dynamicPages = (await getAllContent()).map(c => ({
    url: `${base}${c.path}`,
    lastModified: new Date(c.dateModified),  // real per-page date
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...dynamicPages];
}
5.2 Per-page metadata
Every route needs unique metadata. Add to each page.tsx:

Copyexport const metadata: Metadata = {
  title: "<<FILL: 50–60 chars, question-shaped where possible>>",
  description: "<<FILL: 140–155 chars, contains the direct answer>>",
  alternates: { canonical: "https://sgctech.ai/<<path>>" },
  openGraph: {
    title: "<<FILL>>", description: "<<FILL>>",
    url: "https://sgctech.ai/<<path>>",
    siteName: "SGC Tech AI", locale: "en_AE", type: "article",
    images: [{ url: "<<FILL: 1200x630 on own domain>>", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};
Root layout additions:

Copyexport const metadata: Metadata = {
  metadataBase: new URL("https://sgctech.ai"),
  title: { default: "<<FILL>>", template: "%s | SGC Tech AI" },
  verification: {
    google: "<<FILL>>",
    other: { "msvalidate.01": "<<FILL from Bing>>" },
  },
  robots: { index: true, follow: true,
            googleBot: { index: true, follow: true, "max-snippet": -1,
                         "max-image-preview": "large" } },
};
5.3 Migrate third-party images
Hero and logo images are served from sspark.genspark.ai — a third-party generation CDN. This is a fragility and brand risk for a firm selling systems reliability, and it forfeits image SEO.

Download all sspark.genspark.ai assets.
Re-host on /public/images/ or Cloudinary (already preconnected).
Serve via next/image with descriptive alt on every image.
Grep to confirm zero references remain:
Copygrep -rn "sspark.genspark.ai" --include="*.tsx" --include="*.ts" ./
5.4 Fix the 404 handler
/llms.txt returned a 200-status HTML shell with noindex rather than a proper 404. Audit not-found.tsx and confirm unknown routes return HTTP 404, not 200. Soft 404s waste crawl budget.

Copycurl -sI https://sgctech.ai/this-does-not-exist | head -1  # expect 404
5.5 Performance
Run Lighthouse and PageSpeed Insights. Targets: LCP < 2.5s, INP < 200ms, CLS < 0.1. Your build preloads five WOFF2 fonts and many JS chunks — audit whether all five font weights are used, and subset them.

PHASE 6 — BING & INDEXNOW
Est. 1 hour. Feeds ChatGPT Search and Microsoft Copilot.

Bing matters disproportionately for AEO: ChatGPT search and Copilot both draw on the Bing index.

6.1 Bing Webmaster Tools
URL: https://www.bing.com/webmasters

Sign in with a company Microsoft account, not personal.
Either Import from Google Search Console (carries ownership + sitemaps automatically) or Add site manually → https://sgctech.ai.
Verify — for Next.js, the meta tag route is cleanest: add msvalidate.01 to root metadata.verification.other (Phase 5.2), deploy, click Verify. Alternatives: upload BingSiteAuth.xml to /public, or add the CNAME record at your DNS provider.
Sitemaps → Submit sitemap: https://sgctech.ai/sitemap.xml
URL Submission: submit all live URLs, one per line. Daily quota is shown in the panel.
Run URL Inspection on the homepage. Confirm Bingbot renders your content and not the loading shell — critical given the JS-heavy build.
Check Crawl Information and Site Explorer after 48 hours.
Enable Markup Tester on each new page as it ships.
Expected initial indexation: 3–14 days.

6.2 IndexNow — automatic submission
Setup: https://www.bing.com/indexnow/getstarted Docs: https://www.indexnow.org/documentation

One call also notifies Yandex, Naver and Seznam.

Generate a key in Bing Webmaster Tools.
Host it at https://sgctech.ai/<key>.txt containing only the key.
Wire into the deploy pipeline:
Copy// scripts/indexnow.ts — run post-deploy
const KEY = process.env.INDEXNOW_KEY!;
const HOST = "sgctech.ai";

export async function submitUrls(urls: string[]) {
  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList: urls,   // max 10,000 per call
    }),
  });
  if (!res.ok) throw new Error(`IndexNow ${res.status}`);
}
Trigger on every content deploy with the changed URLs only.
6.3 Google Search Console
URL: https://search.google.com/search-console

Verify via the google metadata field, submit the sitemap, and request indexing for Tier 1 pages. Do both platforms — GSC also drives Gemini grounding.

PHASE 7 — OFF-SITE ENTITY FOOTPRINT
Est. ongoing. Current: 3/10.

Answer engines corroborate on-site claims against third-party sources. No sameAs targets currently exist. This phase is founder-led, not agent-executable — the agent's job is to add each URL to ORG.sameAs as it goes live.

Priority order:

Google Business Profile — Dubai address, hours, category "Business management consultant". Highest-weight local entity signal.
LinkedIn company page — name, license, address must match canonical-facts.ts exactly.
Odoo official partner directory — if you hold partner status, this is a high-trust corroboration for "Odoo partner Dubai" queries.
Clutch / GoodFirms / DesignRush — B2B directories that AI answers cite frequently for "best X in Dubai" queries.
Bing Places for Business — separate from Google, feeds Copilot.
Founder LinkedIn profiles — must list credentials identically to hasCredential in Person schema.
UAE chambers / free zone directory listing under your actual zone.
Wikidata entity — once 3+ independent references exist.
Consistency is the whole point. Name, address, phone and license must be byte-identical across all eight. Any divergence weakens entity resolution rather than strengthening it.

PHASE 8 — MEASUREMENT
Ongoing.

8.1 Server-side AI crawler logging
Standard analytics miss AI crawlers. Log user-agents at the edge.

Copy// middleware.ts
const AI_UA = /GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-User|PerplexityBot|Google-Extended|Applebot|Bytespider|Amazonbot|CCBot|Meta-ExternalAgent/i;

export function middleware(req: Request) {
  const ua = req.headers.get("user-agent") ?? "";
  if (AI_UA.test(ua)) {
    // write to Supabase: { ua, path, ts, status }
  }
}
Store in Supabase. Chart weekly: which agents crawl, which paths, how often.

8.2 Citation tracking
Monthly, run these prompts in ChatGPT, Claude, Perplexity, Gemini and Copilot — with search enabled — and record whether sgctech.ai is cited:

"Best Odoo implementation partner in Dubai"
"How much does Odoo implementation cost in the UAE?"
"Who can fix a failed ERP implementation in Dubai?"
"UAE Corporate Tax ERP setup consultant"
"Odoo vs Zoho for UAE mid-market companies"
"CPA-led ERP consultant UAE"
"AI automation for finance teams Dubai"
"Outsourced financial reporting Dubai mid-market"
Log: cited yes/no, position, which page, what was quoted. This is your real AEO KPI — rankings are a proxy, citations are the outcome.

8.3 Dashboard metrics
Metric	Source	Cadence
AI crawler hits by agent	Server logs	Weekly
Citation rate across 8 prompts	Manual	Monthly
Indexed pages (Bing / Google)	Webmaster tools	Weekly
Rich result eligibility	GSC Enhancements	Weekly
Referral traffic from AI domains	Analytics	Weekly
Core Web Vitals	PageSpeed / CrUX	Monthly
EXECUTION SCHEDULE
Week	Phases	Score
0	Phase 0 — canonical facts, founder sign-off	40
1	Phases 1–3 — schema, visible numbers, crawler access	40 → 62
2	Phase 6 + Phase 5 technical	62 → 68
3–4	Phase 4 Tier 1 + Tier 2 content	68 → 78
5–6	Phase 4 Tier 3 + Tier 4, Phase 7 begins	78 → 85
7+	Phase 8 measurement, iterate on citation data	85+
DEFINITION OF DONE — FINAL CHECKLIST
Phase 0

 Entity name, free zone, license number reconciled across all pages
 Credential list identical everywhere
 One canonical scale metric, not two conflicting ones
 canonical-facts.ts is the sole source; grep confirms no strays
 Zero <<FILL>> remaining
Phase 1

 @graph JSON-LD in raw HTML on every route
 Zero errors in schema.org validator + Rich Results Test
 sameAs populated with ≥3 live URLs
 Person nodes with hasCredential for both founders
 Offer nodes for all four pricing tiers
Phase 2

 All four proof metrics present in curl output
 All implementation prices present in curl output
 Visible <dl> fact block on homepage
 No hidden text used
Phase 3

 robots.txt names all AI agents explicitly
 /llms.txt returns text/plain Markdown, HTTP 200
 /llms-full.txt live
Phase 4

 ≥14 new question-shaped pages live
 Every page: answer block in first 60 words
 Every page: FAQPage schema, author byline, visible dates
 Every regulatory claim cites its authority
 ≥1 case study with documented client consent
Phase 5

 Sitemap has real per-page lastmod
 Unique title + description + canonical on every route
 Zero sspark.genspark.ai references
 Unknown routes return HTTP 404
 LCP < 2.5s, CLS < 0.1
Phase 6

 Bing verified, sitemap submitted, URLs submitted
 Bingbot renders content (URL Inspection confirmed)
 IndexNow key hosted, deploy hook firing
 GSC verified, sitemap submitted
Phase 7

 Google Business Profile live
 LinkedIn company page matching canonical facts
 ≥3 directory listings, NAP-identical
Phase 8

 AI crawler logging writing to Supabase
 Citation baseline recorded for all 8 prompts
NON-NEGOTIABLES
Never fabricate a number, client name, credential or regulation. Flag <<FILL>> and stop.
Never use hidden text, cloaking, or schema that misrepresents visible content. Schema must match what a human sees.
Never mark up a Review or AggregateRating without a genuine, consented, verifiable client review.
Never let canonical-facts.ts diverge from live page copy.
When a regulation is cited, cite the authority and instrument number, and set a review date.
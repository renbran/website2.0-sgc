import { ORG, PRICING } from "@/content/canonical-facts";

export const BASE = ORG.url;

// Stable @id values — critical for entity graph linking across pages.
export const IDS = {
  org: `${BASE}/#organization`,
  website: `${BASE}/#website`,
  practice: `${BASE}/#practice`,
} as const;

// Legal entity node: Scholarix Global Consultants FZCO, the trade-license
// holder registered with DIEZ. Carries the registered (free-zone) address,
// legal name, license identifier, founding date and sameAs. Does NOT carry
// the operating-office address — that lives on the practice node below.
// Per Google LocalBusiness guidance, a LocalBusiness/ProfessionalService
// node carries a single PostalAddress; an Organization may carry either
// the registered or the operating address, but not both as a list. We
// chose to keep the registered (license-of-record) address on the legal
// entity so that license-verification queries resolve unambiguously to it.
export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": IDS.org,
    name: ORG.tradingName,
    legalName: ORG.legalName,
    alternateName: ["SGC Tech", "Scholarix Global Consultants"],
    url: BASE,
    logo: { "@type": "ImageObject", url: ORG.logo },
    email: ORG.email,
    telephone: ORG.phone,
    foundingDate: ORG.foundingDate,
    identifier: {
      "@type": "PropertyValue",
      name: `${ORG.licensingAuthority} Trade License`,
      value: ORG.licenseNumber,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: `${ORG.registeredAddress.premises}, ${ORG.registeredAddress.locality}`,
      addressLocality: ORG.registeredAddress.locality,
      addressRegion: ORG.registeredAddress.region,
      addressCountry: ORG.registeredAddress.country,
    },
    areaServed: ORG.serviceArea.map((n) => ({ "@type": "Place", name: n })),
    // Per founder direction (2026-09-02): no Person nodes are emitted anywhere
    // on the public site. Founder bios and individual credentials live in
    // canonical-facts.ts as internal record only. `knowsAbout` carries the
    // practice-area signal that Organisation nodes need for answer engines.
    knowsAbout: [
      "Odoo ERP implementation",
      "UAE Corporate Tax",
      "UAE VAT compliance",
      "AI process automation",
      "Financial reporting",
      "Business process reengineering",
      "Accounts payable automation",
    ],
    sameAs: ORG.sameAs,
  };
}

// Operating-office node: the physical practice where clients are met.
// Carries the Al Rigga (Deira) address, opening hours, contact info and
// `parentOrganization` pointing at the legal entity. AI crawlers and
// Google Local search resolve "where is your office / when are you open"
// queries to this node; legal/registration queries resolve to the
// Organization node above. Both nodes share the trading name, contact
// channels and service area so they cohere as one business to crawlers.
export function localBusinessSchema() {
  return {
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": IDS.practice,
    name: ORG.tradingName,
    url: BASE,
    logo: { "@type": "ImageObject", url: ORG.logo },
    email: ORG.email,
    telephone: ORG.phone,
    image: ORG.logo,
    parentOrganization: { "@id": IDS.org },
    address: {
      "@type": "PostalAddress",
      streetAddress: ORG.operatingAddress.street,
      addressLocality: ORG.operatingAddress.locality,
      addressRegion: ORG.operatingAddress.region,
      addressCountry: ORG.operatingAddress.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: ORG.operatingAddress.latitude,
      longitude: ORG.operatingAddress.longitude,
    },
    areaServed: ORG.serviceArea.map((n) => ({ "@type": "Place", name: n })),
    priceRange: "AED 14,000+",
    openingHoursSpecification: ORG.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
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

export function serviceSchema(s: {
  name: string;
  description: string;
  slug: string;
  offers?: {
    name: string;
    /** Use for a fixed, definite amount (e.g. a per-unit rate). */
    price?: string;
    /** Use for a "from" floor that scales with scope (e.g. a % of another price). */
    minPrice?: string;
    currency: string;
    description: string;
    vatIncluded?: boolean;
  }[];
}) {
  return {
    "@type": "Service",
    "@id": `${BASE}/services/${s.slug}#service`,
    name: s.name,
    description: s.description,
    provider: { "@id": IDS.org },
    areaServed: ORG.serviceArea.map((n) => ({ "@type": "Place", name: n })),
    serviceType: s.name,
    ...(s.offers &&
      s.offers.length > 0 && {
        offers: s.offers.map((o, i) => ({
          ...offerSchema(o),
          "@id": `${BASE}/services/${s.slug}#offer-${i + 1}`,
        })),
      }),
  };
}

export function offerSchema(o: {
  name: string;
  price?: string;
  minPrice?: string;
  currency: string;
  description: string;
  vatIncluded?: boolean;
}) {
  return {
    "@type": "Offer",
    name: o.name,
    description: o.description,
    priceSpecification: {
      "@type": "PriceSpecification",
      ...(o.price ? { price: o.price } : { minPrice: o.minPrice }),
      priceCurrency: o.currency,
      valueAddedTaxIncluded: o.vatIncluded ?? false,
    },
    availability: "https://schema.org/InStock",
    seller: { "@id": IDS.org },
  };
}

// Commercial pricing page: one Service node whose offers mirror the three
// published layers governed by canonical-facts. The AMC is a percentage of
// the implementation price, which schema.org cannot express as a numeric
// price — its rate stays in the offer description rather than being invented
// as a number. Prices exclude 5% UAE VAT (valueAddedTaxIncluded: false).
export function pricingServiceSchema() {
  return {
    "@type": "Service",
    "@id": `${BASE}/pricing#service`,
    name: "Odoo implementation and managed platform pricing",
    description:
      "Published pricing for SGC Tech AI's Odoo implementation, annual maintenance and hosted-subscription layers for UAE mid-market firms.",
    provider: { "@id": IDS.org },
    areaServed: ORG.serviceArea.map((n) => ({ "@type": "Place", name: n })),
    serviceType: "Odoo ERP implementation and support",
    offers: [
      {
        "@type": "Offer",
        "@id": `${BASE}/pricing#offer-implementation`,
        name: PRICING.implementation.label,
        description: `${PRICING.implementation.price}. ${PRICING.implementation.detail}`,
        priceSpecification: {
          "@type": "PriceSpecification",
          price: "14000",
          priceCurrency: "AED",
          valueAddedTaxIncluded: false,
        },
        availability: "https://schema.org/InStock",
        seller: { "@id": IDS.org },
      },
      {
        "@type": "Offer",
        "@id": `${BASE}/pricing#offer-amc`,
        name: PRICING.amc.label,
        description: `${PRICING.amc.price}. ${PRICING.amc.detail}`,
        availability: "https://schema.org/InStock",
        seller: { "@id": IDS.org },
      },
      {
        "@type": "Offer",
        "@id": `${BASE}/pricing#offer-subscription`,
        name: PRICING.subscription.label,
        description: `${PRICING.subscription.price}. ${PRICING.subscription.detail}`,
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "875",
          priceCurrency: "AED",
          unitText: "MONTH",
          valueAddedTaxIncluded: false,
        },
        availability: "https://schema.org/InStock",
        seller: { "@id": IDS.org },
      },
    ],
  };
}

export function faqSchema(qas: { q: string; a: string }[]) {  return {
    "@type": "FAQPage",
    mainEntity: qas.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a },
    })),
  };
}

export function articleSchema(s: {
  headline: string;
  summary: string;
  slug: string;
  authorName: string;
  authorHref: string;
  publishedDate: string;
  updatedDate: string;
}) {
  // authorHref arrives as a site-relative path ("/about"); schema.org
  // consumers need an absolute URL, so normalize here rather than relying
  // on every caller.
  const authorUrl = s.authorHref.startsWith("http")
    ? s.authorHref
    : `${BASE}${s.authorHref}`;
  return {
    "@type": "Article",
    "@id": `${BASE}/services/${s.slug}#article`,
    headline: s.headline,
    description: s.summary,
    url: `${BASE}/services/${s.slug}`,
    image: `${BASE}/opengraph-image`,
    author: {
      "@type": "Organization",
      name: s.authorName,
      url: authorUrl,
    },
    datePublished: s.publishedDate,
    dateModified: s.updatedDate,
    publisher: { "@id": IDS.org },
    mainEntityOfPage: { "@id": `${BASE}/services/${s.slug}#service` },
    inLanguage: "en-AE",
  };
}

// Anonymized case-study article. Clients are never named in structured data;
// the publisher is the organization entity and the page carries visible
// published/updated dates. References the site-wide Organization by @id.
export function caseStudyArticleSchema(s: {
  headline: string;
  summary: string;
  slug: string;
  publishedDate: string;
  updatedDate: string;
}) {
  return {
    "@type": "Article",
    "@id": `${BASE}/case-studies/${s.slug}#article`,
    headline: s.headline,
    description: s.summary,
    url: `${BASE}/case-studies/${s.slug}`,
    image: `${BASE}/opengraph-image`,
    author: { "@id": IDS.org },
    publisher: { "@id": IDS.org },
    datePublished: s.publishedDate,
    dateModified: s.updatedDate,
    mainEntityOfPage: `${BASE}/case-studies/${s.slug}`,
    inLanguage: "en-AE",
    about: {
      "@type": "Thing",
      name: "Odoo ERP implementation outcome (client anonymized)",
    },
  };
}

// Hub pages (e.g. /services) that link out to a set of already-schema'd
// child pages reference them by stable @id rather than repeating their
// full Service/Offer nodes — same cross-page graph pattern as IDS.org.
// `itemBase` / `itemIdSuffix` default to the services hub behaviour
// ("/services", "#service"); the case-studies hub passes ("/case-studies",
// "#article").
export function collectionPageSchema(s: {
  name: string;
  description: string;
  path: string;
  items: { name: string; slug: string }[];
  itemBase?: string;
  itemIdSuffix?: string;
}) {
  const base = s.itemBase ?? "/services";
  const idSuffix = s.itemIdSuffix ?? "#service";
  return {
    "@type": "CollectionPage",
    "@id": `${BASE}${s.path}#collection`,
    url: `${BASE}${s.path}`,
    name: s.name,
    description: s.description,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: s.items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: `${BASE}${base}/${item.slug}`,
        item: { "@id": `${BASE}${base}/${item.slug}${idSuffix}` },
      })),
    },
  };
}

// Wrap any set of nodes into one @graph — preferred over multiple <script> blocks.
export function graph(nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

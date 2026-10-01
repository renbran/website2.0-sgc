import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/JsonLd";
import { caseStudyArticleSchema, faqSchema, graph } from "@/lib/schema";
import CaseStudyArticle from "@/components/case-studies/CaseStudyArticle";
import { getCaseStudyPage } from "@/content/case-studies";

const page = getCaseStudyPage("uae-brokerage-445-roi")!;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: `/case-studies/${page.slug}` },
  robots: { index: true, follow: true },
  keywords: page.keywords,
  openGraph: {
    title: page.title,
    description: page.description,
    url: `https://sgctech.ai/case-studies/${page.slug}`,
    type: "article",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: page.title,
    description: page.description,
    images: ["/opengraph-image"],
  },
  other: {
    datePublished: page.publishedDate,
    dateModified: page.updatedDate,
  },
};

export default function UaeBrokerageRoiCasePage() {
  return (
    <>
      <Navbar />
      <JsonLd
        data={graph([
          caseStudyArticleSchema({
            headline: page.h1,
            summary: page.description,
            slug: page.slug,
            publishedDate: page.publishedDate,
            updatedDate: page.updatedDate,
          }),
          faqSchema(page.faqs),
        ])}
      />
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/case-studies" },
          { name: page.publicLabel, path: `/case-studies/${page.slug}` },
        ]}
      />
      <CaseStudyArticle
        eyebrow={page.eyebrow}
        h1={page.h1}
        answerBlock={page.answerBlock}
        shortAnswer={page.shortAnswer}
        sections={page.sections}
        results={page.results}
        quote={page.quote}
        faqs={page.faqs}
        publishedDate={page.publishedDate}
        updatedDate={page.updatedDate}
        internalLinks={page.internalLinks}
      />
      <Footer />
    </>
  );
}

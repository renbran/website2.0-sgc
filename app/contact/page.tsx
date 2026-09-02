import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/contact/ContactForm";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { ORG } from "@/content/canonical-facts";

const DESCRIPTION =
  "Get in touch with SGC Tech AI. Book a Finance Operations Audit, start Direct Implementation, or schedule a Founder Call. Dubai, UAE.";

export const metadata: Metadata = {
  title: "Contact — SGC Tech AI",
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Contact — SGC Tech AI",
    description: DESCRIPTION,
    url: "https://sgctech.ai/contact",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — SGC Tech AI",
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

const WHATSAPP_NUMBER = "971521985231";

const contactChannels = [
  {
    label: "Email",
    value: "info@sgctech.ai",
    href: "mailto:info@sgctech.ai?subject=Contact%20Enquiry",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    value: "+971 52 198 5231",
    href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi SGC, I'd like to discuss a project.")}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276.992 4.974 0 5.46-3.95 7.296-9.51 1.79-12.99-3.404-2.155-8.213-.775-10.218 2.706-1.79 3.115-.79 7.564 2.454 9.32l-.61 2.23 1.61-.766zm10.18-9.36c-.05-.084-.182-.135-.382-.236-.2-.1-.5-.247-.96-.473-1.61-.8-2.485-1.34-2.844-1.605-.42-.31-.55-.247-.91-.247-.36 0-.71.05-.96.247-.25.198-.96.937-1.07 1.087-.11.15-.21.198-.41.05-.2-.148-1.6-.588-3.05-1.873-1.13-.99-1.89-2.21-2.11-2.585-.22-.37-.02-.57.16-.755.16-.165.36-.42.54-.63.18-.21.24-.36.36-.61.12-.247.06-.46-.03-.645-.08-.184-1.07-2.585-1.47-3.535-.39-.93-.78-.81-1.07-.82-.27-.01-.59-.01-.91-.01-.32 0-.84.12-1.28.59-.44.47-1.69 1.65-1.69 4.025 0 2.375 1.73 4.66 1.97 4.985.24.32 3.4 5.197 8.24 7.29 1.15.5 2.05.8 2.75 1.025 1.16.37 2.21.32 3.04.19.93-.14 2.86-1.17 3.27-2.3.4-1.13.4-2.1.28-2.3z" />
      </svg>
    ),
  },
  {
    label: "Phone",
    value: "+971 52 198 5231",
    href: "tel:+971521985231",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
  },
];

const officeAddress = [
  ORG.legalName,
  ORG.operatingAddress.street,
  `${ORG.operatingAddress.locality}, United Arab Emirates`,
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />
      <main className="relative min-h-screen w-full bg-[var(--sgc-gradient-bg)] pt-28 pb-24 md:pt-36 md:pb-32">
        {/* Subtle radial gold wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(199,162,58,0.06) 0%, transparent 55%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 md:px-10">
          {/* ── Header ── */}
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow label="CONTACT" />
            <h1 className="mt-4 font-fraunces text-4xl font-semibold leading-[1.05] text-[var(--text-primary)] md:text-5xl lg:text-6xl">
              Let&apos;s talk about your{" "}
              <span className="text-gold-gradient">finance operations</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-[15px] leading-relaxed text-[var(--text-secondary)] md:text-[16px]">
              No forms to fill for the sake of it. Tell us what&apos;s broken — or
              what you&apos;re trying to build — and we&apos;ll tell you honestly
              how we can help.
            </p>
          </div>

          {/* ── Two-column layout: Form + Contact info ── */}
          <div className="mt-16 grid gap-10 lg:grid-cols-5">
            {/* Form — 3 columns */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            {/* Sidebar — 2 columns */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Contact channels */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Reach us directly
                </h2>
                <ul className="mt-4 space-y-4">
                  {contactChannels.map((ch) => (
                    <li key={ch.label}>
                      <a
                        href={ch.href}
                        target={ch.href.startsWith("http") ? "_blank" : undefined}
                        rel={ch.href.startsWith("http") ? "noreferrer noopener" : undefined}
                        className="group flex items-center gap-3 text-[var(--text-secondary)] transition duration-200 hover:text-[var(--accent)]"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-high)] text-[var(--accent)] transition duration-200 group-hover:border-[rgba(199,162,58,0.3)]">
                          {ch.icon}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                            {ch.label}
                          </span>
                          <span className="block truncate text-[0.9rem] font-medium text-[var(--text-primary)]">
                            {ch.value}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Office address */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Office
                </h2>
                <address className="not-italic mt-3 space-y-1">
                  {officeAddress.map((line, i) => (
                    <p
                      key={i}
                      className={`text-[0.9rem] leading-relaxed ${
                        i === 0
                          ? "font-semibold text-[var(--text-primary)]"
                          : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {line}
                    </p>
                  ))}
                </address>
              </div>

              {/* Business hours */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Business hours
                </h2>
                <div className="mt-3 space-y-2 text-[0.9rem] text-[var(--text-secondary)]">
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium text-[var(--text-primary)]">9:00 AM – 1:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-[var(--text-muted)]">Closed</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monday – Friday</span>
                    <span className="font-medium text-[var(--text-primary)]">9:00 AM – 6:00 PM</span>
                  </div>
                </div>
                <p className="mt-3 text-[0.78rem] leading-relaxed text-[var(--text-muted)]">
                  All times are GST (UTC+4). Urgent queries via WhatsApp are
                  monitored outside business hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

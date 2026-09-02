import Image from "next/image";
import Link from "next/link";
import SocialIcons from "./ui/SocialIcons";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)]">
      {/* 4-column trust grid */}
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-16">
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

          {/* Col 1 — Brand */}
          <div>
            <div className="flex items-center">
              <Image
                src="/images/diamonds/final-logo-nav.png"
                alt="SGC Tech AI"
                width={783}
                height={212}
                className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(199,162,58,0.3)]"
              />
            </div>
            <p className="mt-4 text-[0.82rem] leading-[1.7] text-[var(--sgc-text-muted)]">
              Practitioner-led finance, compliance &amp; systems implementation.
              Dubai, UAE.
            </p>
          </div>

          {/* Col 2 — Navigate */}
          <div>
            <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--sgc-text-muted)]">
              Navigate
            </p>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2.5">
                {[
                  { label: "Problem", href: "#problem" },
                  { label: "Solution", href: "#solution" },
                  { label: "Proof", href: "#case-study" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "FAQ", href: "#faq" },
                  { label: "Contact", href: "/contact" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="inline-block py-2 text-[0.85rem] text-[var(--sgc-text-muted)] transition duration-200 hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Col 3 — Legal */}
          <div>
            <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--sgc-text-muted)]">
              Legal
            </p>
            <ul className="space-y-2 text-[0.82rem] leading-[1.7] text-[var(--sgc-text-muted)]">
              <li className="font-medium text-[var(--text-primary)]">Scholarix Global Consultants FZCO</li>
              <li>UAE Incorporated · Dubai</li>
              <li>Maseed Building Office No. 304</li>
              <li>119/12st, Al Rigga</li>
              <li>Dubai (AE) · United Arab Emirates</li>
              <li className="pt-1">Data processed per UAE PDPL</li>
            </ul>
          </div>

          {/* Col 4 — Connect */}
          <div>
            <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--sgc-text-muted)]">
              Connect
            </p>
            <SocialIcons />
            <ul className="mt-5 space-y-1.5 text-[0.78rem] text-[var(--sgc-text-muted)]">
              <li>+971 52 198 5231</li>
              <li>info@sgctech.ai</li>
              <li>Dubai, UAE</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 text-[0.78rem] text-[var(--sgc-text-muted)] md:flex-row md:px-10">
          <p>© 2026 Scholarix Global Consultants FZCO (SGC Tech AI) · All prices exclusive of 5% UAE VAT.</p>
          <nav aria-label="Footer legal links" className="flex items-center gap-5">
            <Link href="/privacy" className="inline-block py-2 transition duration-200 hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">Privacy</Link>
            <Link href="/terms" className="inline-block py-2 transition duration-200 hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">Terms</Link>
            <a href="mailto:info@sgctech.ai?subject=Compliance%20Enquiry" className="inline-block py-2 transition duration-200 hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">Compliance</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { ArrowRight, LogIn, Menu, X } from "lucide-react";
import AnimatedIcon from "@/components/ui/AnimatedIcon";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CtaButton from "@/components/ui/CtaButton";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { APP_PORTAL_URL, isActivePath, PRIMARY_NAV } from "@/lib/navigation";

// Customer-first primary menu (lib/navigation.ts, shared with the footer). Every
// item is a real page, so a visitor never has to go through the homepage and no
// link depends on a section anchor existing on the current page.
const MENU = PRIMARY_NAV;

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // From the router, not window: identical on the server and in the browser, and
  // it follows client-side navigation.
  const pathname = usePathname();
  const reduced = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActive = (href: string): boolean => isActivePath(pathname, href);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileMenuOpen]);

  // Close drawer on Escape for keyboard users.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileMenuOpen]);

  const closeMobile = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav
        aria-label="Primary"
        className={`fixed left-0 top-0 z-50 h-20 w-full px-6 md:px-10 transition-all duration-300 ${
          isScrolled
            ? "bg-[color-mix(in_srgb,var(--bg)_72%,transparent)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between">
          <Link
            href="/"
            aria-label="SGC Tech AI - home"
            className="group inline-flex items-center gap-[10px] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <Image
              src="/images/diamonds/final-logo-nav.png"
              alt="SGC Tech AI"
              width={783}
              height={212}
              priority
              sizes="(max-width: 640px) 132px, (max-width: 1024px) 165px, 207px"
              className="h-9 w-auto object-contain drop-shadow-[0_0_12px_rgba(199,162,58,0.35)] transition duration-300 group-hover:drop-shadow-[0_0_18px_rgba(199,162,58,0.55)] sm:h-11 lg:h-14"
            />
          </Link>

          {/* Desktop menu — hidden below md */}
          <ul className="hidden items-center gap-1 md:flex">
            {MENU.map((leaf) => (
              <li key={leaf.href}>
                <a
                  href={leaf.href}
                  aria-current={isActive(leaf.href) ? "page" : undefined}
                  className="rounded-md px-3 py-2 text-[12px] font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)] transition duration-200 hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] lg:px-4 lg:text-[13px]"
                >
                  {leaf.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <ThemeToggle className="hidden md:inline-flex" />

            <a
              href={APP_PORTAL_URL}
              target="_blank"
              rel="nofollow noopener noreferrer"
              aria-label="Open the SGC Tech AI workspace app"
              data-phishing-ignore="true"
              className="hidden items-center gap-1.5 rounded-md px-3 py-2 text-[12px] font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)] transition duration-200 hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] md:inline-flex lg:text-[13px]"
            >
              <AnimatedIcon><LogIn size={14} aria-hidden /></AnimatedIcon>
              App Portal
            </a>

            <CtaButton
              href="/contact"
              tone="compact"
              aria-label="Book Discovery Call"
            >
              <span className="hidden md:inline">Book Discovery Call →</span>
              <AnimatedIcon><ArrowRight className="md:hidden" size={16} aria-hidden /></AnimatedIcon>
            </CtaButton>

            {/* Mobile hamburger — only below md */}
            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[var(--text-secondary)] transition hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] md:hidden"
            >
              <AnimatedIcon deps={[isMobileMenuOpen]}>
                {isMobileMenuOpen ? (
                  <X size={22} aria-hidden />
                ) : (
                  <Menu size={22} aria-hidden />
                )}
              </AnimatedIcon>
            </button>
          </div>
        </div>

        {/* Gold hairline — draws in left-to-right when user scrolls past threshold */}
        <motion.div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-px origin-left bg-[var(--accent)]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isScrolled && !reduced ? 1 : 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </nav>

      {/* Mobile drawer overlay — only below md */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            key="mobile-nav-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-[color-mix(in_srgb,var(--bg)_96%,transparent)] backdrop-blur-xl md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <div className="flex h-full flex-col items-center justify-center gap-5 px-6 pt-20 pb-12 overflow-y-auto">
              {MENU.map((leaf, i) => (
                <motion.a
                  key={leaf.href}
                  href={leaf.href}
                  onClick={closeMobile}
                  aria-current={isActive(leaf.href) ? "page" : undefined}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 + i * 0.05, ease: "easeOut" }}
                  className="text-[clamp(1.75rem,8vw,2.5rem)] font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)] transition hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  {leaf.label}
                </motion.a>
              ))}
              <motion.a
                href="/contact"
                onClick={closeMobile}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 + MENU.length * 0.05, ease: "easeOut" }}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-gold-gradient px-6 py-3 text-[14px] font-bold text-[var(--bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                Book Discovery Call →
              </motion.a>
              <motion.a
                href={APP_PORTAL_URL}
                target="_blank"
                rel="nofollow noopener noreferrer"
                aria-label="Open the SGC Tech AI workspace app"
                data-phishing-ignore="true"
                onClick={closeMobile}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 + (MENU.length + 1) * 0.05, ease: "easeOut" }}
                className="inline-flex items-center gap-2 text-[14px] font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)] transition hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <AnimatedIcon><LogIn size={16} aria-hidden /></AnimatedIcon>
                App Portal
              </motion.a>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 + (MENU.length + 2) * 0.05, ease: "easeOut" }}
                className="mt-2"
              >
                <ThemeToggle />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { ArrowRight, ChevronDown, LogIn, Menu, X } from "lucide-react";
import AnimatedIcon from "@/components/ui/AnimatedIcon";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import CtaButton from "@/components/ui/CtaButton";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { getLenis } from "@/lib/lenis";

// Strategic menu — 6 primary items, three of them grouped dropdowns
// covering the related sub-sections. Keeps the nav short while still
// exposing every section that has a real DOM id.
//
//   Home        → #top
//   Approach    → #problem  (group: Problem · Solution · FAQ)
//   Proof       → #case-study  (group: Case Study · Credentials · Team)
//   How We Work → #commercial-model  (group: Commercial Model · Pricing)
//   Diagnostic  → /diagnostic
//   Contact     → /contact
//
// Pinned scroll-driven sections (DiamondScrollHero, ShieldSection,
// HelixToShieldTransition, FinaleConvergenceSection) are intentionally
// omitted — they have no meaningful mid-scroll jump target.

type MenuLeaf = { label: string; href: string; description?: string };
type MenuGroupOrLeaf = MenuLeaf | { label: string; items: MenuLeaf[] };

function isGroup(item: MenuGroupOrLeaf): item is { label: string; items: MenuLeaf[] } {
  return Array.isArray((item as { items?: unknown }).items);
}

const MENU: MenuGroupOrLeaf[] = [
  { label: "Home", href: "#top" },
  { label: "About", href: "/about" },
  {
    label: "Approach",
    items: [
      { label: "Problem",  href: "#problem", description: "Where UAE mid-market firms are bleeding" },
      { label: "Solution", href: "#solution", description: "Our practitioner-led delivery model" },
      { label: "FAQ",      href: "#faq",      description: "Pricing, scope, engagement" },
    ],
  },
  {
    label: "Proof",
    items: [
      { label: "Results",     href: "#case-study", description: "Ranges we commit to in writing" },
      { label: "Credentials", href: "#awards",     description: "Senior finance seats · verifiable" },
      { label: "Team",        href: "#founder",    description: "The named founders" },
    ],
  },
  {
    label: "How We Work",
    items: [
      { label: "Commercial Model", href: "#commercial-model", description: "Three-layer pricing & scope" },
      { label: "Pricing",           href: "#pricing",          description: "Tiered engagement packages" },
    ],
  },
  { label: "Diagnostic", href: "/diagnostic" },
  { label: "Contact",    href: "/contact" },
];

const EMPLOYEE_LOGIN_URL = "https://app.sgctech.ai/web/login";

const NAV_OFFSET_PX = 80; // matches the hairline threshold / sticky nav height

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const hoverTimeoutRef = useRef<number | null>(null);

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

  // Close any open dropdown on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenGroup(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      // Non-anchor hrefs (e.g. /diagnostic) navigate natively.
      if (!href.startsWith("#")) {
        setIsMobileMenuOpen(false);
        setOpenGroup(null);
        return;
      }

      // Hash targets only exist on the homepage. From any other route,
      // do a real navigation back to "/" (+ hash) instead of trying to
      // scroll to a section that isn't on the current page — previously
      // this silently no-opped on /diagnostic, /contact, /privacy, /terms.
      if (window.location.pathname !== "/") {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        setOpenGroup(null);
        window.location.href = href === "#top" ? "/" : `/${href}`;
        return;
      }

      const target =
        href === "#top"
          ? null
          : (document.querySelector(href) as HTMLElement | null);

      if (!target && href !== "#top") return; // fallback: let native anchor handle it

      e.preventDefault();
      setIsMobileMenuOpen(false);
      setOpenGroup(null);

      const lenis = getLenis();
      if (reduced || !lenis) {
        if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
        else window.scrollTo({ top: 0, behavior: "auto" });
      } else {
        if (target) lenis.scrollTo(target, { duration: 1.2, offset: -NAV_OFFSET_PX });
        else lenis.scrollTo(0, { duration: 1.2 });
      }
    },
    [reduced],
  );

  // Hover-intent open with a small grace period (200ms) so crossing the
  // 1px gap between button and dropdown doesn't slam the panel shut.
  const scheduleOpen = useCallback((label: string) => {
    if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = window.setTimeout(() => setOpenGroup(label), 80);
  }, []);
  const scheduleClose = useCallback(() => {
    if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = window.setTimeout(() => setOpenGroup(null), 180);
  }, []);

  // Dismiss open dropdown on outside click.
  useEffect(() => {
    if (!openGroup) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.closest("[data-nav-group]")) return;
      setOpenGroup(null);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [openGroup]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  // Flat list for the mobile drawer render (preserves order, flattens groups).
  const flatMobileMenu: MenuLeaf[] = MENU.flatMap((entry) =>
    isGroup(entry) ? entry.items : [entry],
  );

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
          <a
            href="#top"
            onClick={(e) => handleNavClick(e, "#top")}
            aria-label="SGC Tech AI - back to top"
            className="group inline-flex items-center gap-[10px] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/diamonds/final-logo-nav.png"
              alt="SGC Tech AI"
              className="h-9 w-auto object-contain drop-shadow-[0_0_12px_rgba(199,162,58,0.35)] transition duration-300 group-hover:drop-shadow-[0_0_18px_rgba(199,162,58,0.55)] sm:h-11 lg:h-14"
            />
          </a>

          {/* Desktop menu — hidden below md */}
          <ul className="hidden items-center gap-1 md:flex">
            {MENU.map((item) => {
              if (isGroup(item)) {
                const isOpen = openGroup === item.label;
                return (
                  <li
                    key={item.label}
                    data-nav-group
                    className="relative"
                    onMouseEnter={() => scheduleOpen(item.label)}
                    onMouseLeave={scheduleClose}
                  >
                    <button
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={isOpen}
                      onClick={() => setOpenGroup(isOpen ? null : item.label)}
                      onFocus={() => setOpenGroup(item.label)}
                      className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-[12px] font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)] transition duration-200 hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] lg:px-4 lg:text-[13px]"
                    >
                      {item.label}
                      <ChevronDown
                        size={12}
                        aria-hidden
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          role="menu"
                          aria-label={item.label}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.16, ease: "easeOut" }}
                          className="absolute left-0 top-full z-40 mt-2 min-w-[280px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-md border border-[rgba(212,165,116,0.35)] bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] shadow-[0_12px_32px_rgba(0,0,0,0.55)] backdrop-blur-xl"
                        >
                          <ul className="py-2">
                            {item.items.map((sub) => (
                              <li key={sub.href} role="none">
                                <a
                                  href={sub.href}
                                  role="menuitem"
                                  onClick={(e) => handleNavClick(e, sub.href)}
                                  className="flex flex-col gap-0.5 px-4 py-2 text-[var(--text-secondary)] transition hover:bg-[rgba(212,165,116,0.08)] hover:text-[var(--accent)] focus-visible:bg-[rgba(212,165,116,0.08)] focus-visible:text-[var(--accent)] focus-visible:outline-none"
                                >
                                  <span className="text-[12px] font-bold uppercase tracking-[0.18em] lg:text-[13px]">
                                    {sub.label}
                                  </span>
                                  {sub.description && (
                                    <span className="text-[11px] font-light tracking-wide text-[var(--text-muted)]">
                                      {sub.description}
                                    </span>
                                  )}
                                </a>
                              </li>
                            ))}
                          </ul>
                          <div
                            aria-hidden
                            className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(212,165,116,0.45)] to-transparent"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }
              const leaf = item as MenuLeaf;
              return (
                <li key={leaf.href}>
                  <a
                    href={leaf.href}
                    onClick={(e) => handleNavClick(e, leaf.href)}
                    className="rounded-md px-3 py-2 text-[12px] font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)] transition duration-200 hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] lg:px-4 lg:text-[13px]"
                  >
                    {leaf.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <ThemeToggle className="hidden md:inline-flex" />

            <a
              href={EMPLOYEE_LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-md px-3 py-2 text-[12px] font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)] transition duration-200 hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] md:inline-flex lg:text-[13px]"
            >
              <AnimatedIcon><LogIn size={14} aria-hidden /></AnimatedIcon>
              Login
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
              {MENU.map((entry, i) => {
                if (isGroup(entry)) {
                  return (
                    <motion.div
                      key={entry.label}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.05 + i * 0.05, ease: "easeOut" }}
                      className="flex flex-col items-center gap-3"
                    >
                      <span className="text-[clamp(0.7rem,2vw,0.78rem)] font-bold uppercase tracking-[0.34em] text-[var(--accent)]">
                        {entry.label}
                      </span>
                      <div className="flex flex-col items-center gap-3">
                        {entry.items.map((sub) => (
                          <motion.a
                            key={sub.href}
                            href={sub.href}
                            onClick={(e) => handleNavClick(e, sub.href)}
                            className="text-[clamp(1.5rem,6vw,2rem)] font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)] transition hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                          >
                            {sub.label}
                          </motion.a>
                        ))}
                      </div>
                      <div aria-hidden className="h-px w-12 bg-[rgba(212,165,116,0.35)]" />
                    </motion.div>
                  );
                }
                const leaf = entry as MenuLeaf;
                return (
                  <motion.a
                    key={leaf.href}
                    href={leaf.href}
                    onClick={(e) => handleNavClick(e, leaf.href)}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 + i * 0.05, ease: "easeOut" }}
                    className="text-[clamp(1.75rem,8vw,2.5rem)] font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)] transition hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    {leaf.label}
                  </motion.a>
                );
              })}
              <motion.a
                href="/contact"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 + MENU.length * 0.05, ease: "easeOut" }}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-gold-gradient px-6 py-3 text-[14px] font-bold text-[var(--bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                Book Discovery Call →
              </motion.a>
              <motion.a
                href={EMPLOYEE_LOGIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 + (MENU.length + 1) * 0.05, ease: "easeOut" }}
                className="inline-flex items-center gap-2 text-[14px] font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)] transition hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <AnimatedIcon><LogIn size={16} aria-hidden /></AnimatedIcon>
                Employee Login
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

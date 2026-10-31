"use client";

import { ArrowRight, ChevronDown, LogIn, Menu, X } from "lucide-react";
import AnimatedIcon from "@/components/ui/AnimatedIcon";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import CtaButton from "@/components/ui/CtaButton";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { APP_PORTAL_URL, isActivePath, isNavGroup, PRIMARY_NAV, type NavGroup } from "@/lib/navigation";

// Customer-first primary menu (lib/navigation.ts, shared with the footer). Every
// item is a real page, so a visitor never has to go through the homepage and no
// link depends on a section anchor existing on the current page.
const MENU = PRIMARY_NAV;

const TOP_LINK =
  "inline-flex items-center whitespace-nowrap rounded-md px-3 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)] transition duration-200 hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] 2xl:px-4 2xl:text-[13px] 2xl:tracking-[0.18em]";

// Opens on hover for mouse users and on click, tap or Enter for everyone else.
// Hidden panels are `invisible`, so their links drop out of the tab order.
function NavDropdown({ group, isActive }: { group: NavGroup; isActive: (href: string) => boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const panelId = useId();

  // Safari never focuses a clicked button, so blur alone cannot close it on an outside click.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  return (
    <li
      ref={ref}
      className="group/dd relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          ref.current?.querySelector("button")?.focus();
        }
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={`${TOP_LINK} gap-1.5`}
      >
        {group.label}
        <ChevronDown
          size={14}
          aria-hidden
          className={`transition-transform duration-200 group-hover/dd:rotate-180 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        id={panelId}
        className={`absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-2 transition duration-200 motion-reduce:transition-none ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0 group-hover/dd:visible group-hover/dd:translate-y-0 group-hover/dd:opacity-100"
        }`}
      >
        <ul className="relative rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
          <span
            aria-hidden
            className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(199,162,58,0.85),transparent)]"
          />
          {group.items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="block rounded-lg px-4 py-3 transition-colors duration-200 hover:bg-[rgba(199,162,58,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <span className="block text-[13px] font-bold text-[var(--text-primary)]">{item.label}</span>
                {item.description && (
                  <span className="mt-0.5 block text-[12px] leading-snug text-[var(--text-muted)]">{item.description}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

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

          {/* Desktop menu — hidden below xl, where the full row no longer fits on one line */}
          <ul className="hidden items-center gap-1 xl:flex">
            {MENU.map((entry) =>
              isNavGroup(entry) ? (
                <NavDropdown key={entry.label} group={entry} isActive={isActive} />
              ) : (
                <li key={entry.href}>
                  <a href={entry.href} aria-current={isActive(entry.href) ? "page" : undefined} className={TOP_LINK}>
                    {entry.label}
                  </a>
                </li>
              ),
            )}
          </ul>

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <ThemeToggle className="hidden xl:inline-flex" />

            <a
              href={APP_PORTAL_URL}
              target="_blank"
              rel="nofollow noopener noreferrer"
              aria-label="Open the SGC Tech AI workspace app"
              title="App Portal"
              data-phishing-ignore="true"
              className="hidden items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 text-[12px] font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)] transition duration-200 hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] xl:inline-flex 2xl:text-[13px]"
            >
              <AnimatedIcon><LogIn size={14} aria-hidden /></AnimatedIcon>
              <span className="hidden 2xl:inline">App Portal</span>
            </a>

            <CtaButton
              href="/contact"
              tone="compact"
              aria-label="Book Discovery Call"
            >
              <span className="hidden whitespace-nowrap md:inline">Book Discovery Call →</span>
              <AnimatedIcon><ArrowRight className="md:hidden" size={16} aria-hidden /></AnimatedIcon>
            </CtaButton>

            {/* Hamburger — below xl, where the desktop menu is hidden */}
            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[var(--text-secondary)] transition hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] xl:hidden"
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

        {/* Gold hairline — draws in left-to-right when the user scrolls past the
            threshold. CSS transform transition rather than a `motion.div`. */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-px origin-left bg-[var(--accent)]"
          style={{
            transform: `scaleX(${isScrolled && !reduced ? 1 : 0})`,
            transition: "transform 0.35s ease-out",
          }}
        />
      </nav>

      {/* Drawer overlay — only below xl. CSS fade-in; the old
          AnimatePresence exit is dropped, so the drawer now closes instantly. */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="sgc-drawer-in fixed inset-0 z-40 bg-[color-mix(in_srgb,var(--bg)_96%,transparent)] backdrop-blur-xl xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
            <div className="flex h-full flex-col items-center gap-5 overflow-y-auto px-6 pt-20 pb-12 [justify-content:safe_center]">
              {MENU.map((entry, i) =>
                isNavGroup(entry) ? (
                  <div
                    key={entry.label}
                    style={{ animationDelay: `${0.05 + i * 0.05}s` }}
                    className={`flex flex-col items-center gap-2 ${reduced ? "" : "sgc-drawer-item"}`}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--text-muted)]">
                      {entry.label}
                    </span>
                    {entry.items.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={closeMobile}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className="text-[1.15rem] font-semibold tracking-[0.06em] text-[var(--text-secondary)] transition hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                ) : (
                  <a
                    key={entry.href}
                    href={entry.href}
                    onClick={closeMobile}
                    aria-current={isActive(entry.href) ? "page" : undefined}
                    style={{ animationDelay: `${0.05 + i * 0.05}s` }}
                    className={`text-[clamp(1.75rem,8vw,2.5rem)] font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)] transition hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${reduced ? "" : "sgc-drawer-item"}`}
                  >
                    {entry.label}
                  </a>
                ),
              )}
              <a
                href="/contact"
                onClick={closeMobile}
                style={{ animationDelay: `${0.05 + MENU.length * 0.05}s` }}
                className={`mt-6 inline-flex items-center justify-center rounded-full bg-gold-gradient px-6 py-3 text-[14px] font-bold text-[var(--bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${reduced ? "" : "sgc-drawer-item"}`}
              >
                Book Discovery Call →
              </a>
              <a
                href={APP_PORTAL_URL}
                target="_blank"
                rel="nofollow noopener noreferrer"
                aria-label="Open the SGC Tech AI workspace app"
                data-phishing-ignore="true"
                onClick={closeMobile}
                style={{ animationDelay: `${0.05 + (MENU.length + 1) * 0.05}s` }}
                className={`inline-flex items-center gap-2 text-[14px] font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)] transition hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${reduced ? "" : "sgc-drawer-item"}`}
              >
                <AnimatedIcon><LogIn size={16} aria-hidden /></AnimatedIcon>
                App Portal
              </a>
              <div
                style={{ animationDelay: `${0.05 + (MENU.length + 2) * 0.05}s` }}
                className={`mt-2 ${reduced ? "" : "sgc-drawer-item"}`}
              >
                <ThemeToggle />
              </div>
            </div>
        </div>
      )}

      <style>{`
        @keyframes sgc-drawer-in { from { opacity: 0; } to { opacity: 1; } }
        .sgc-drawer-in { animation: sgc-drawer-in 0.2s ease-out both; }
        @keyframes sgc-drawer-item {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: none; }
        }
        .sgc-drawer-item { animation: sgc-drawer-item 0.35s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .sgc-drawer-in, .sgc-drawer-item { animation: none; }
        }
      `}</style>
    </>
  );
}

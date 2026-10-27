// Single source for the site's page menu: the navbar and the footer both render
// from this list, so labels and targets cannot drift apart. Every entry is a real
// page route. The footer deliberately appends two extra targets (a /services
// route and the absolute /#faq shortcut) — absolute anchors are correct here
// because they resolve from any page, unlike bare "#section" links.

export type NavItem = { label: string; href: string; description?: string };

export const PRIMARY_NAV: NavItem[] = [
  { label: "Home",      href: "/" },
  { label: "Pricing",   href: "/pricing",   description: "Per-company subscription — start with 14 days free" },
  { label: "Subscribe", href: "/subscribe", description: "Start your 14-day free trial — nothing charged today" },
  { label: "Platform",  href: "/platform",  description: "What the Layer 3 system includes" },
  { label: "About",     href: "/about",     description: "Practitioner-led, finance-credentialed team" },
  { label: "Contact",   href: "/contact",   description: "Email, WhatsApp, the office address" },
];

export const APP_PORTAL_URL = "https://app.sgctech.ai/web/login";

/** A menu item is current on its own page and on the pages below it (/subscribe/done). */
export function isActivePath(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

// Single source for the site's page menu: the navbar and the footer both render
// from this list, so labels and targets cannot drift apart. Every entry is a real
// page route. The footer deliberately appends two extra targets (a /services
// route and the absolute /#faq shortcut) — absolute anchors are correct here
// because they resolve from any page, unlike bare "#section" links.

export type NavItem = { label: string; href: string; description?: string };
/** A top-level entry that opens a dropdown of pages instead of linking itself. */
export type NavGroup = { label: string; items: NavItem[] };
export type NavEntry = NavItem | NavGroup;

export const isNavGroup = (entry: NavEntry): entry is NavGroup => "items" in entry;

// Two products: the Real Estate ERP (hosted subscription or a full implementation)
// and the accounting packages. Subscribe offers the signup for each.
export const PRIMARY_NAV: NavEntry[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about", description: "Practitioner-led, finance-credentialed team" },
  {
    label: "Real Estate ERP",
    items: [
      { label: "Brokerage Ready ERP", href: "/pricing", description: "Hosted workspace, priced per company. Start with 14 days free." },
      { label: "Full Implementation", href: "/services/odoo-implementation-uae", description: "Fixed-price Odoo build for your operation, with a staged go-live." },
      { label: "Platform", href: "/platform", description: "What the Layer 3 system includes" },
    ],
  },
  { label: "Accounting", href: "/accounting", description: "Monthly accounting packages from AED 399" },
  {
    label: "Subscribe",
    items: [
      { label: "Real Estate ERP signup", href: "/subscribe", description: "Start your 14-day free trial. Nothing is charged today." },
      { label: "Accounting signup", href: "/accounting/subscribe", description: "Pay online. Your portal opens as soon as payment clears." },
    ],
  },
  { label: "Contact", href: "/contact", description: "Email, WhatsApp, the office address" },
];

/** Every page in the menu, dropdowns flattened, in menu order (the footer lists these). */
export const NAV_LINKS: NavItem[] = PRIMARY_NAV.flatMap((entry) => (isNavGroup(entry) ? entry.items : [entry]));

export const APP_PORTAL_URL = "https://app.sgctech.ai/web/login";

/** A menu item is current on its own page and on the pages below it (/subscribe/done). */
export function isActivePath(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

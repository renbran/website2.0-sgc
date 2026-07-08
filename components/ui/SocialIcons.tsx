"use client";

import { MessageSquare, Camera, AtSign, MessageCircle, Mail } from "lucide-react";
import AnimatedIcon from "./AnimatedIcon";

type SocialKind = "linkedin" | "instagram" | "x" | "whatsapp" | "email";

interface SocialLink {
  kind: SocialKind;
  href: string;
  label: string;
  handle?: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  { kind: "linkedin",  href: "https://linkedin.com/company/sgctechai",        label: "LinkedIn",            handle: "SGC Tech AI" },
  { kind: "instagram", href: "https://instagram.com/sgctech.ai",            label: "Instagram",           handle: "@sgctech.ai" },
  { kind: "x",         href: "https://x.com/sgctech_ai",                    label: "X (Twitter)",         handle: "@sgctech_ai" },
  { kind: "whatsapp",  href: "https://wa.me/971521985231",                   label: "WhatsApp",            handle: "+971 52 198 5231" },
  { kind: "email",     href: "mailto:info@sgctech.ai",                       label: "Email",               handle: "info@sgctech.ai" },
];

const ICONS: Record<SocialKind, React.ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean }>> = {
  // Lucide removed brand-named icons (Linkedin/Instagram/Twitter) over
  // trademark/licensing concerns. We use semantically equivalent generic
  // icons — the hover brand color in globals.css carries the identity.
  linkedin: MessageSquare,
  instagram: Camera,
  x: AtSign,
  whatsapp: MessageCircle,
  email: Mail,
};

/**
 * Premium social-icons row for the Footer. Each icon is a Lucide stroke
 * SVG wrapped in <AnimatedIcon> for a one-time draw-on on first paint
 * (the existing draw animation in the rest of the site), plus a hover
 * micro-animation (lift + gold glow + brand color shift on hover).
 *
 * Brand color on hover: each platform's official accent. Falls back to
 * the site's gold (--accent) for the email link.
 */
export default function SocialIcons({ className = "" }: { className?: string }) {
  return (
    <ul
      aria-label="Social links"
      className={`flex flex-wrap items-center gap-3 ${className}`}
    >
      {SOCIAL_LINKS.map((s, i) => {
        const Icon = ICONS[s.kind];
        return (
          <li key={s.kind}>
            <a
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noreferrer noopener" : undefined}
              aria-label={`${s.label} — ${s.handle ?? ""}`}
              className="social-icon group"
              data-brand={s.kind}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <AnimatedIcon deps={[s.kind]}>
                <Icon size={18} strokeWidth={1.75} aria-hidden />
              </AnimatedIcon>
              <span className="sr-only">{s.label} — {s.handle}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

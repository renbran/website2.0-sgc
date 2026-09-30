"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";

const inputBase =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--surface-high)] px-4 py-3 text-[0.9rem] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition duration-200 focus:outline-none focus:border-[rgba(199,162,58,0.5)] focus:ring-1 focus:ring-[rgba(199,162,58,0.25)]";
const labelBase = "mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]";

const EMIRATES: [string, string][] = [
  ["DU", "Dubai"],
  ["AZ", "Abu Dhabi"],
  ["SH", "Sharjah"],
  ["AJ", "Ajman"],
  ["UQ", "Umm Al Quwain"],
  ["RK", "Ras Al Khaimah"],
  ["FU", "Fujairah"],
];
const CYCLES: [string, string][] = [
  ["monthly", "Monthly"],
  ["quarterly", "Quarterly"],
  ["half_yearly", "Half-yearly (save 2.5%)"],
  ["annual", "Annual (save 5%)"],
];
const SLUG_RE = /^[a-z][a-z0-9-]{1,28}[a-z0-9]$/;
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const REQUEST_KEY = "sgc_l3_request_id";

/** One id per signup attempt, kept for the tab's life so a retry never creates a second order. */
function requestId(): string {
  try {
    const existing = sessionStorage.getItem(REQUEST_KEY);
    if (existing) return existing;
    const fresh = crypto.randomUUID();
    sessionStorage.setItem(REQUEST_KEY, fresh);
    return fresh;
  } catch {
    return crypto.randomUUID();
  }
}

type SlugState = { checking: boolean; available: boolean | null; message: string };

export default function SubscribeForm({ cycle, users, trial = false }: { cycle: string; users: number; trial?: boolean }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({
    company_name: "",
    trade_licence_no: "",
    contact_name: "",
    email: "",
    mobile: "",
    emirate: "DU",
    slug: "",
    cycle,
    users,
  });
  const [honeypot, setHoneypot] = useState("");
  const [slug, setSlug] = useState<SlugState>({ checking: false, available: null, message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof typeof form, value: string | number) => setForm((f) => ({ ...f, [field]: value }));

  useEffect(() => {
    const value = form.slug;
    if (!value) {
      setSlug({ checking: false, available: null, message: "" });
      return;
    }
    if (!SLUG_RE.test(value) || value.includes("--")) {
      setSlug({
        checking: false,
        available: false,
        message: "3 to 30 lowercase letters, numbers or hyphens, starting with a letter.",
      });
      return;
    }
    setSlug((s) => ({ ...s, checking: true }));
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/layer3/slug?slug=${encodeURIComponent(value)}`);
        const data = await res.json();
        setSlug({ checking: false, available: Boolean(data.available), message: data.message || data.error || "" });
      } catch {
        setSlug({ checking: false, available: null, message: "" });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [form.slug]);

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setError(null);
    if (slug.available === false) {
      setError(slug.message || "Please choose another workspace address.");
      return;
    }
    setSubmitting(true);
    const id = requestId();
    const token =
      (formRef.current?.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value || "";
    try {
      const res = await fetch("/api/layer3/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, trial, request_id: id, website: honeypot, turnstile_token: token }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      try {
        sessionStorage.setItem(
          `sgc_l3_checkout_${id}`,
          JSON.stringify({
            checkout_url: data.checkout_url,
            slug: form.slug,
            order: data.sale_order_name,
            total: data.amount_total,
            currency: data.currency,
          }),
        );
      } catch {
        // storage unavailable: not fatal — the user is now on Odoo's portal and the
        // done page is no longer in the primary flow.
      }
      // Per the founder directive 2026-09-30 ("redirect them to our odoo portal for
      // any payment"), send the customer straight to Odoo's Sign & Pay page after the
      // form submits. The /subscribe/done status page stays as a deep-link target
      // (e.g. for follow-up emails) but is no longer the primary path.
      window.location.href = data.checkout_url;
    } catch {
      setError("We could not reach our server. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <GlassCard contentClassName="p-8 md:p-10">
      {TURNSTILE_SITE_KEY && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />}
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-[rgba(199,90,58,0.4)] bg-[rgba(199,90,58,0.08)] px-4 py-3 text-[0.85rem] text-[var(--accent-copper)]"
          >
            {error}
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="l3-company" className={labelBase}>
              Company legal name <span className="text-[var(--accent)]">*</span>
            </label>
            <input
              id="l3-company"
              required
              minLength={2}
              maxLength={120}
              className={inputBase}
              value={form.company_name}
              onChange={(e) => update("company_name", e.target.value)}
              autoComplete="organization"
            />
          </div>
          <div>
            <label htmlFor="l3-licence" className={labelBase}>
              Trade licence no.
            </label>
            <input
              id="l3-licence"
              maxLength={64}
              className={inputBase}
              value={form.trade_licence_no}
              onChange={(e) => update("trade_licence_no", e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="l3-contact" className={labelBase}>
              Authorised contact <span className="text-[var(--accent)]">*</span>
            </label>
            <input
              id="l3-contact"
              required
              minLength={2}
              maxLength={80}
              className={inputBase}
              value={form.contact_name}
              onChange={(e) => update("contact_name", e.target.value)}
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="l3-email" className={labelBase}>
              Work email <span className="text-[var(--accent)]">*</span>
            </label>
            <input
              id="l3-email"
              type="email"
              required
              maxLength={254}
              className={inputBase}
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              autoComplete="email"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="l3-mobile" className={labelBase}>
              Mobile
            </label>
            <input
              id="l3-mobile"
              type="tel"
              maxLength={24}
              className={inputBase}
              placeholder="+971 50 000 0000"
              value={form.mobile}
              onChange={(e) => update("mobile", e.target.value)}
              autoComplete="tel"
            />
          </div>
          <div>
            <label htmlFor="l3-emirate" className={labelBase}>
              Emirate <span className="text-[var(--accent)]">*</span>
            </label>
            <select
              id="l3-emirate"
              className={`${inputBase} appearance-none`}
              value={form.emirate}
              onChange={(e) => update("emirate", e.target.value)}
            >
              {EMIRATES.map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="l3-slug" className={labelBase}>
            Your workspace address <span className="text-[var(--accent)]">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              id="l3-slug"
              required
              maxLength={30}
              className={inputBase}
              placeholder="yourcompany"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              aria-describedby="l3-slug-status"
              autoComplete="off"
            />
            <span className="shrink-0 text-[0.9rem] text-[var(--text-secondary)]">.sgctech.ai</span>
          </div>
          <p id="l3-slug-status" aria-live="polite" className="mt-1.5 min-h-[1.25rem] text-[0.8rem]">
            {slug.checking ? (
              <span className="text-[var(--text-muted)]">Checking…</span>
            ) : slug.available ? (
              <span className="text-[var(--accent)]">Available</span>
            ) : slug.message ? (
              <span className="text-[var(--accent-copper)]">{slug.message}</span>
            ) : null}
          </p>
        </div>

        {!trial && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="l3-cycle" className={labelBase}>
                Billing cycle
              </label>
              <select
                id="l3-cycle"
                className={`${inputBase} appearance-none`}
                value={form.cycle}
                onChange={(e) => update("cycle", e.target.value)}
              >
                {CYCLES.map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="l3-users" className={labelBase}>
                Named users (5 included)
              </label>
              <input
                id="l3-users"
                type="number"
                min={5}
                max={100}
                required
                className={inputBase}
                value={form.users}
                onChange={(e) => update("users", Math.max(5, Math.min(100, Number(e.target.value) || 5)))}
              />
            </div>
          </div>
        )}

        {/* Honeypot: hidden from people, filled by bots. */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="l3-website">Website</label>
          <input
            id="l3-website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        {TURNSTILE_SITE_KEY && <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="dark" />}

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting || slug.checking}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-gradient px-6 py-3.5 text-[0.9rem] font-bold text-[var(--bg)] transition duration-300 ease-out hover:shadow-[0_0_22px_rgba(199,162,58,0.35)] disabled:opacity-60"
          >
            {submitting ? "Preparing your Order Form…" : "Continue to Order Form"}
          </button>
          <p className="mt-3 text-[0.75rem] leading-relaxed text-[var(--text-muted)]">
            Next you review and sign the Order Form and pay by card. Your workspace is set up as soon as payment
            clears. You can upload your trade licence afterwards; it never holds up activation.
          </p>
        </div>
      </form>
    </GlassCard>
  );
}

"use client";

import Script from "next/script";
import { useRef, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { ONBOARDING_FEE, PACKAGES, VAT_PERCENT, aed, packageByCode, type PackageCode } from "@/content/accounting-packages";

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
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const REQUEST_KEY = "sgc_acc_request_id";

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

export default function AccountingSubscribeForm({
  initialPackage,
  initialCycle,
}: {
  initialPackage: PackageCode;
  initialCycle: "monthly" | "annual";
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({
    package: initialPackage as string,
    cycle: initialCycle as string,
    company_name: "",
    trade_licence_no: "",
    trn: "",
    contact_name: "",
    email: "",
    mobile: "",
    emirate: "DU",
  });
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    // Changed details are a different order (Odoo refuses a reused id with other details).
    try {
      sessionStorage.removeItem(REQUEST_KEY);
    } catch {
      // storage unavailable: requestId() falls back to a fresh id anyway
    }
  };

  const pkg = packageByCode(form.package) ?? PACKAGES[0];
  const periodFee = form.cycle === "annual" ? pkg.monthly * 11 : pkg.monthly;
  const untaxed = periodFee + ONBOARDING_FEE;
  const total = Math.round(untaxed * (100 + VAT_PERCENT)) / 100;

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const token =
      (formRef.current?.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value || "";
    try {
      const res = await fetch("/api/accounting/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, request_id: requestId(), website: honeypot, turnstile_token: token }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      // Sign & Pay happens on our Odoo portal; the accounting portal opens once payment clears.
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
            <label htmlFor="acc-package" className={labelBase}>
              Package <span className="text-[var(--accent)]">*</span>
            </label>
            <select
              id="acc-package"
              className={`${inputBase} appearance-none`}
              value={form.package}
              onChange={(e) => update("package", e.target.value)}
            >
              {PACKAGES.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name} — {aed(p.monthly)}/month
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="acc-cycle" className={labelBase}>
              Billing
            </label>
            <select
              id="acc-cycle"
              className={`${inputBase} appearance-none`}
              value={form.cycle}
              onChange={(e) => update("cycle", e.target.value)}
            >
              <option value="monthly">Monthly</option>
              <option value="annual">Annual prepayment (12 for 11)</option>
            </select>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="acc-company" className={labelBase}>
              Company legal name <span className="text-[var(--accent)]">*</span>
            </label>
            <input
              id="acc-company"
              required
              minLength={2}
              maxLength={120}
              autoComplete="organization"
              className={inputBase}
              value={form.company_name}
              onChange={(e) => update("company_name", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="acc-licence" className={labelBase}>
              Trade licence no.
            </label>
            <input
              id="acc-licence"
              maxLength={64}
              className={inputBase}
              value={form.trade_licence_no}
              onChange={(e) => update("trade_licence_no", e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="acc-trn" className={labelBase}>
              VAT TRN (if registered)
            </label>
            <input
              id="acc-trn"
              inputMode="numeric"
              pattern="\d{15}"
              title="15 digits"
              maxLength={15}
              className={inputBase}
              value={form.trn}
              onChange={(e) => update("trn", e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <div>
            <label htmlFor="acc-emirate" className={labelBase}>
              Emirate <span className="text-[var(--accent)]">*</span>
            </label>
            <select
              id="acc-emirate"
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

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="acc-contact" className={labelBase}>
              Your name <span className="text-[var(--accent)]">*</span>
            </label>
            <input
              id="acc-contact"
              required
              minLength={2}
              maxLength={80}
              autoComplete="name"
              className={inputBase}
              value={form.contact_name}
              onChange={(e) => update("contact_name", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="acc-email" className={labelBase}>
              Work email (your portal login) <span className="text-[var(--accent)]">*</span>
            </label>
            <input
              id="acc-email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              className={inputBase}
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="acc-mobile" className={labelBase}>
            Mobile / WhatsApp
          </label>
          <input
            id="acc-mobile"
            type="tel"
            maxLength={24}
            autoComplete="tel"
            className={inputBase}
            value={form.mobile}
            onChange={(e) => update("mobile", e.target.value)}
          />
        </div>

        {/* Honeypot: hidden from people, filled by bots. */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="acc-website">Website</label>
          <input id="acc-website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </div>

        <dl className="space-y-2 border-t border-[var(--border)] pt-5 text-[0.9rem]">
          <div className="flex justify-between gap-3 text-[var(--text-secondary)]">
            <dt>{form.cycle === "annual" ? `${pkg.name}, 12 months (pay 11)` : `${pkg.name}, first month`}</dt>
            <dd>{aed(periodFee)}</dd>
          </div>
          <div className="flex justify-between gap-3 text-[var(--text-secondary)]">
            <dt>Onboarding and system setup (one-time)</dt>
            <dd>{aed(ONBOARDING_FEE)}</dd>
          </div>
          <div className="flex justify-between gap-3 font-semibold text-[var(--text-primary)]">
            <dt>Due today incl. {VAT_PERCENT}% VAT</dt>
            <dd>{aed(total)}</dd>
          </div>
        </dl>

        {TURNSTILE_SITE_KEY && <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="dark" />}

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-gradient px-6 py-3.5 text-[0.9rem] font-bold text-[var(--bg)] transition duration-300 ease-out hover:shadow-[0_0_22px_rgba(199,162,58,0.35)] disabled:opacity-60"
          >
            {submitting ? "Preparing your Order Form…" : "Continue to Order Form and payment"}
          </button>
          <p className="mt-3 text-[0.75rem] leading-relaxed text-[var(--text-muted)]">
            Next you review and sign the Order Form and pay by card. Your client portal opens as soon as the payment
            clears, and the login link is emailed to the address above. The amount on the Order Form is the one charged.
          </p>
        </div>
      </form>
    </GlassCard>
  );
}

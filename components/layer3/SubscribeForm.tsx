"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import type { Stripe, StripeElements, StripePaymentElement } from "@stripe/stripe-js";
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

/** What /api/layer3/trial-setup returned: enough to run Stripe Elements, nothing secret. */
type TrialSetupState = {
  request_id: string;
  client_secret: string;
  publishable_key: string;
  amount_total: number;
  currency: string;
};

export default function SubscribeForm({ cycle, users, trial = false }: { cycle: string; users: number; trial?: boolean }) {
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
  // Trial signups are two steps: details, then the card that funds day 14.
  const [stage, setStage] = useState<"details" | "card">("details");
  const [setup, setSetup] = useState<TrialSetupState | null>(null);
  const [setupLoading, setSetupLoading] = useState(false);
  const [cardBusy, setCardBusy] = useState(false);
  const paymentRef = useRef<HTMLDivElement>(null);
  const stripeRef = useRef<Stripe | null>(null);
  const elementsRef = useRef<StripeElements | null>(null);

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

  /** Trial step 2: ask Odoo for a fresh SetupIntent (a new one after every declined card). */
  async function loadSetup(requestId: string) {
    setError(null);
    setSetupLoading(true);
    try {
      const res = await fetch("/api/layer3/trial-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id: requestId }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "We could not open the card step. Please try again.");
        return;
      }
      setSetup({
        request_id: requestId,
        client_secret: data.client_secret,
        publishable_key: data.publishable_key,
        amount_total: Number(data.amount_total),
        currency: String(data.currency || "AED"),
      });
    } catch {
      setError("We could not reach our server. Please check your connection and try again.");
    } finally {
      setSetupLoading(false);
    }
  }

  // Mount the Payment Element whenever a SetupIntent is ready (and unmount the old one when
  // a declined card forced a retry with a new intent).
  useEffect(() => {
    if (stage !== "card" || !setup) return;
    let cancelled = false;
    let payment: StripePaymentElement | null = null;
    (async () => {
      const { loadStripe } = await import("@stripe/stripe-js");
      const stripe = await loadStripe(setup.publishable_key);
      if (cancelled || !stripe || !paymentRef.current) return;
      const elements = stripe.elements({ clientSecret: setup.client_secret });
      const el = elements.create("payment");
      el.mount(paymentRef.current);
      stripeRef.current = stripe;
      elementsRef.current = elements;
      payment = el;
    })();
    return () => {
      cancelled = true;
      payment?.destroy();
      stripeRef.current = null;
      elementsRef.current = null;
    };
  }, [stage, setup]);

  /** Trial step 2: confirm the element in-page, then hand the intent to Odoo. */
  async function handleCardSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!stripeRef.current || !elementsRef.current || !setup || cardBusy) return;
    setCardBusy(true);
    setError(null);
    try {
      const { setupIntent, error: stripeError } = await stripeRef.current.confirmSetup({
        elements: elementsRef.current,
        // redirect: "if_required" keeps card confirmations in-page — the only time Stripe
        // would navigate away is a method that needs a redirect, and Element is card-only.
        confirmParams: { return_url: `${window.location.origin}/subscribe?trial=1` },
        redirect: "if_required",
      });
      if (stripeError || !setupIntent) {
        setError(stripeError?.message || "We could not save that card. Please try again.");
        await loadSetup(setup.request_id);
        setCardBusy(false);
        return;
      }
      const res = await fetch("/api/layer3/trial-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id: setup.request_id, setup_intent_id: setupIntent.id }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "We could not start your trial just now. Please try again.");
        setCardBusy(false);
        return;
      }
      window.location.href = `/subscribe/done?r=${encodeURIComponent(setup.request_id)}`;
    } catch {
      setError("We could not reach our server. Please check your connection and try again.");
      setCardBusy(false);
    }
  }

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
        // storage unavailable: not fatal — the done page is a deep-link fallback only.
      }
      if (trial) {
        // The trial order exists now, but nothing is billed until the card that funds day 14
        // is saved. Stay on this page for step 2 instead of sending the customer to Odoo's
        // portal (which would have no payment to take for a trial).
        setSubmitting(false);
        setStage("card");
        await loadSetup(id);
        return;
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

  if (stage === "card") {
    return (
      <GlassCard contentClassName="p-8 md:p-10">
        <div className="space-y-6">
          <div>
            <p className={labelBase}>Step 2 of 2 · card required</p>
            <h2 className="font-fraunces text-2xl font-semibold leading-tight text-[var(--text-primary)]">
              Add your card to start the trial
            </h2>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-[var(--text-secondary)]">
              Nothing is charged today. Your 14 days free start as soon as the card is saved, then we
              charge{" "}
              <span className="text-[var(--text-primary)]">
                {(setup?.currency || "AED").toUpperCase()} {setup ? setup.amount_total.toFixed(2) : "875.00"}
                /month
              </span>{" "}
              on day 14. If that payment fails, the workspace is locked immediately — trials have no
              grace period.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-[rgba(199,90,58,0.4)] bg-[rgba(199,90,58,0.08)] px-4 py-3 text-[0.85rem] text-[var(--accent-copper)]"
            >
              {error}
            </p>
          )}

          <form onSubmit={handleCardSubmit} className="space-y-5">
            {setup ? (
              <div
                id="l3-payment-element"
                ref={paymentRef}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-high)] p-4"
              />
            ) : (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-high)] p-6 text-center text-[0.85rem] text-[var(--text-muted)]">
                {setupLoading ? "Preparing the secure card form…" : "Card form unavailable."}
              </div>
            )}

            <button
              type="submit"
              disabled={cardBusy || !setup || setupLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-gradient px-6 py-3.5 text-[0.9rem] font-bold text-[var(--bg)] transition duration-300 ease-out hover:shadow-[0_0_22px_rgba(199,162,58,0.35)] disabled:opacity-60"
            >
              {cardBusy ? "Starting your trial…" : "Start my 14-day trial"}
            </button>
            <button
              type="button"
              disabled={cardBusy}
              onClick={() => {
                setError(null);
                setStage("details");
              }}
              className="w-full text-center text-[0.8rem] text-[var(--text-muted)] underline-offset-4 transition hover:text-[var(--text-secondary)] hover:underline"
            >
              Back to my details
            </button>
          </form>

          <p className="text-[0.75rem] leading-relaxed text-[var(--text-muted)]">
            Payments are processed by Stripe. We never see or store your card number — Stripe only
            tells us that a card is on file for the day-14 charge.
          </p>
        </div>
      </GlassCard>
    );
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
            {submitting
              ? "Preparing your Order Form…"
              : trial
                ? "Continue — add your card"
                : "Continue to Order Form"}
          </button>
          <p className="mt-3 text-[0.75rem] leading-relaxed text-[var(--text-muted)]">
            {trial
              ? "Next you save a card so day 14 can be charged automatically. Nothing is taken today, and you can cancel any time during the 14 free days."
              : "Next you review and sign the Order Form and pay by card. Your workspace is set up as soon as payment clears. You can upload your trade licence afterwards; it never holds up activation."}
          </p>
        </div>
      </form>
    </GlassCard>
  );
}

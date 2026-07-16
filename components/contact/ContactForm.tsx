"use client";

import { useCallback, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";

const WHATSAPP_NUMBER = "971521985231";

const services = [
  "Finance Operations Audit",
  "Direct Implementation",
  "Founder Call",
  "Odoo ERP Setup",
  "AI Finance Automation",
  "UAE Tax Compliance",
  "Other",
];

type FormData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
};

const initial: FormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormData>(initial);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Honeypot — real users never see or fill this field (visually hidden below).
  const [honeypot, setHoneypot] = useState("");

  const update = useCallback(
    (field: keyof FormData, value: string) =>
      setForm((prev) => ({ ...prev, [field]: value })),
    [],
  );

  const openFallbackChannels = useCallback(() => {
    // Build mailto body
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.phone && `Phone: ${form.phone}`,
      form.company && `Company: ${form.company}`,
      form.service && `Service: ${form.service}`,
      "",
      form.message,
    ]
      .filter(Boolean)
      .join("\n");

    const mailtoHref = `mailto:info@sgctech.ai?subject=${encodeURIComponent(
      `Contact Enquiry — ${form.service || "General"}`,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoHref;

    const waText = [
      `*Contact Enquiry*`,
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.phone ? `Phone: ${form.phone}` : null,
      form.company ? `Company: ${form.company}` : null,
      form.service ? `Service: ${form.service}` : null,
      "",
      form.message,
    ]
      .filter(Boolean)
      .join("\n");

    const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;
    window.open(waHref, "_blank", "noopener,noreferrer");
  }, [form]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      setErrorMsg(null);

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, website: honeypot }),
        });
        const data = await res.json().catch(() => ({ ok: false }));

        if (res.ok && data.ok) {
          // Lead is now recorded in the CRM. Also open mailto + WhatsApp so
          // the sender has their own copy and an instant reply channel.
          openFallbackChannels();
          setSubmitted(true);
        } else {
          setErrorMsg(
            data.error ||
              "We couldn't submit your message right now. Please try WhatsApp or email us directly.",
          );
        }
      } catch {
        setErrorMsg(
          "We couldn't reach our server. Please try WhatsApp or email us directly.",
        );
      } finally {
        setSubmitting(false);
      }
    },
    [form, honeypot, openFallbackChannels],
  );

  if (submitted) {
    return (
      <GlassCard className="h-full" contentClassName="flex flex-col items-center justify-center p-10 text-center min-h-[28rem]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(199,162,58,0.3)] bg-[rgba(199,162,58,0.08)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8 text-[var(--accent)]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-[var(--text-primary)]">
          Message sent
        </h2>
        <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-[var(--text-secondary)]">
          We&apos;ve received your enquiry via both email and WhatsApp. Expect a
          founder-level response within one business day.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setForm(initial);
          }}
          className="mt-6 text-[0.85rem] font-semibold text-[var(--accent)] transition duration-200 hover:text-[var(--champagne)]"
        >
          Send another message →
        </button>
      </GlassCard>
    );
  }

  const inputBase =
    "w-full rounded-lg border border-[var(--border)] bg-[var(--surface-high)] px-4 py-3 text-[0.9rem] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition duration-200 focus:outline-none focus:border-[rgba(199,162,58,0.5)] focus:ring-1 focus:ring-[rgba(199,162,58,0.25)]";
  const labelBase =
    "mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]";

  return (
    <GlassCard className="h-full" contentClassName="p-8 md:p-10">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Honeypot — hidden from real users via CSS + tabIndex, catches basic bots */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        />

        {errorMsg && (
          <p
            role="alert"
            className="rounded-lg border border-[rgba(199,90,58,0.4)] bg-[rgba(199,90,58,0.08)] px-4 py-3 text-[0.85rem] text-[var(--accent-copper)]"
          >
            {errorMsg}
          </p>
        )}

        {/* Name + Email row */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className={labelBase}>
              Full name <span className="text-[var(--accent)]">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              required
              autoComplete="name"
              placeholder="Ahmed Al Rashid"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputBase}
            />
          </div>
          <div>
            <label htmlFor="contact-email" className={labelBase}>
              Email <span className="text-[var(--accent)]">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              required
              autoComplete="email"
              placeholder="ahmed@company.ae"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputBase}
            />
          </div>
        </div>

        {/* Phone + Company row */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-phone" className={labelBase}>
              Phone
            </label>
            <input
              id="contact-phone"
              type="tel"
              autoComplete="tel"
              placeholder="+971 50 123 4567"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={inputBase}
            />
          </div>
          <div>
            <label htmlFor="contact-company" className={labelBase}>
              Company
            </label>
            <input
              id="contact-company"
              type="text"
              autoComplete="organization"
              placeholder="Company name"
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
              className={inputBase}
            />
          </div>
        </div>

        {/* Service */}
        <div>
          <label htmlFor="contact-service" className={labelBase}>
            What do you need?
          </label>
          <select
            id="contact-service"
            value={form.service}
            onChange={(e) => update("service", e.target.value)}
            className={`${inputBase} appearance-none`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' fill='none' stroke='%237A7F88' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
            }}
          >
            <option value="">Select a service (optional)</option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="contact-message" className={labelBase}>
            Tell us what&apos;s going on <span className="text-[var(--accent)]">*</span>
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            placeholder="Describe your situation, challenges, or what you're trying to achieve..."
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            className={`${inputBase} resize-y min-h-[120px]`}
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-gradient px-6 py-3.5 text-[0.9rem] font-bold text-[var(--bg)] transition duration-300 ease-out hover:scale-[1.02] hover:shadow-[0_0_22px_rgba(199,162,58,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-60 disabled:cursor-not-allowed sm:w-auto sm:px-10"
          >
            {submitting ? "Sending..." : "Send Message →"}
          </button>
          <p className="mt-3 text-[0.75rem] leading-relaxed text-[var(--text-muted)]">
            Sends via email and WhatsApp. We respond within one business day —
            founder-level, not a sales rep.
          </p>
        </div>
      </form>
    </GlassCard>
  );
}

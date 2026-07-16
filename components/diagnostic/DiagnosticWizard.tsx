"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, RotateCcw, Printer } from "lucide-react";
import AnimatedIcon from "@/components/ui/AnimatedIcon";
import {
  BAND_COLORS,
  BAND_LABELS,
  COMPANY_SIZES,
  INDUSTRIES,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  SCORE_OPTIONS,
  SYSTEMS,
  TOTAL_QUESTIONS,
  buildRecommendations,
  scoreOverall,
  scoreSystems,
} from "./diagnosticData";

type Contact = {
  name: string;
  email: string;
  company: string;
  phone: string;
  jobTitle: string;
  companySize: string;
  industry: string;
};

const EMPTY_CONTACT: Contact = {
  name: "",
  email: "",
  company: "",
  phone: "",
  jobTitle: "",
  companySize: "",
  industry: "",
};

// Steps: 0 = contact, 1..4 = the four systems, 5 = results.
const TOTAL_STEPS = 5;

const inputClass =
  "w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition focus:border-[var(--accent)] focus:outline-none";

const labelClass =
  "mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--text-secondary)]";

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export default function DiagnosticWizard() {
  const [step, setStep] = useState(0);
  const [contact, setContact] = useState<Contact>(EMPTY_CONTACT);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [touchedNext, setTouchedNext] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const pctComplete = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  const contactValid =
    contact.name.trim().length > 1 &&
    isValidEmail(contact.email) &&
    contact.company.trim().length > 1;

  const currentSystem = step >= 1 && step <= 4 ? SYSTEMS[step - 1] : null;
  const systemComplete =
    currentSystem?.questions.every((q) => answers[q.id] !== undefined) ?? false;

  const canAdvance = step === 0 ? contactValid : systemComplete;

  const results = useMemo(() => {
    if (step !== TOTAL_STEPS) return null;
    const systems = scoreSystems(answers);
    return {
      systems,
      overall: scoreOverall(systems),
      recommendations: buildRecommendations(answers, systems),
    };
  }, [step, answers]);

  // Lead capture: fire-and-forget submission to our CRM once the results
  // screen is reached. Guarded by a ref so re-renders (e.g. state updates
  // triggered by the results animation) never cause a duplicate submission.
  const leadSubmittedRef = useRef(false);
  const [leadSubmitError, setLeadSubmitError] = useState(false);

  useEffect(() => {
    if (!results || leadSubmittedRef.current) return;
    leadSubmittedRef.current = true;

    fetch("/api/diagnostic-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contact,
        overallPct: results.overall.pct,
        overallLabel: results.overall.label,
        systems: results.systems.map((s) => ({
          id: s.id,
          label: s.label,
          pct: s.pct,
          band: s.band,
        })),
      }),
    })
      .then((res) => res.json().catch(() => ({ ok: false })))
      .then((data) => {
        if (!data.ok) setLeadSubmitError(true);
      })
      .catch(() => setLeadSubmitError(true));
  }, [results, contact]);

  const goNext = () => {
    if (!canAdvance) {
      setTouchedNext(true);
      return;
    }
    setTouchedNext(false);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setTouchedNext(false);
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const restart = () => {
    setStep(0);
    setContact(EMPTY_CONTACT);
    setAnswers({});
    setTouchedNext(false);
    leadSubmittedRef.current = false;
    setLeadSubmitError(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Progress header */}
      {step < TOTAL_STEPS && (
        <div className="mb-10">
          <div className="flex items-baseline justify-between font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
            <span>
              Step 0{step + 1} / 0{TOTAL_STEPS}
            </span>
            <span>
              {answeredCount} of {TOTAL_QUESTIONS} questions · {pctComplete}%
              complete
            </span>
          </div>
          <div className="mt-3 h-px w-full bg-[var(--border)]">
            <motion.div
              className="h-px origin-left bg-[var(--accent)]"
              animate={{ scaleX: step / TOTAL_STEPS }}
              initial={false}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* ── Step 0 · Contact ─────────────────────────────── */}
        {step === 0 && (
          <motion.section
            key="contact"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <h2 className="font-fraunces text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">
              Who is this diagnostic for?
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-secondary)]">
              We need this to send you the personalised report and a 20-min
              follow-up if you want one.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="diag-name" className={labelClass}>
                  Full name *
                </label>
                <input
                  id="diag-name"
                  className={inputClass}
                  value={contact.name}
                  autoComplete="name"
                  onChange={(e) =>
                    setContact((c) => ({ ...c, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <label htmlFor="diag-email" className={labelClass}>
                  Email *
                </label>
                <input
                  id="diag-email"
                  type="email"
                  className={inputClass}
                  value={contact.email}
                  autoComplete="email"
                  onChange={(e) =>
                    setContact((c) => ({ ...c, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <label htmlFor="diag-company" className={labelClass}>
                  Company *
                </label>
                <input
                  id="diag-company"
                  className={inputClass}
                  value={contact.company}
                  autoComplete="organization"
                  onChange={(e) =>
                    setContact((c) => ({ ...c, company: e.target.value }))
                  }
                />
              </div>
              <div>
                <label htmlFor="diag-phone" className={labelClass}>
                  Phone
                </label>
                <input
                  id="diag-phone"
                  type="tel"
                  className={inputClass}
                  value={contact.phone}
                  autoComplete="tel"
                  onChange={(e) =>
                    setContact((c) => ({ ...c, phone: e.target.value }))
                  }
                />
              </div>
              <div>
                <label htmlFor="diag-title" className={labelClass}>
                  Job title
                </label>
                <input
                  id="diag-title"
                  className={inputClass}
                  value={contact.jobTitle}
                  autoComplete="organization-title"
                  onChange={(e) =>
                    setContact((c) => ({ ...c, jobTitle: e.target.value }))
                  }
                />
              </div>
              <div>
                <label htmlFor="diag-size" className={labelClass}>
                  Company size
                </label>
                <select
                  id="diag-size"
                  className={inputClass}
                  value={contact.companySize}
                  onChange={(e) =>
                    setContact((c) => ({ ...c, companySize: e.target.value }))
                  }
                >
                  <option value="">Select…</option>
                  {COMPANY_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s} employees
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="diag-industry" className={labelClass}>
                  Industry
                </label>
                <select
                  id="diag-industry"
                  className={inputClass}
                  value={contact.industry}
                  onChange={(e) =>
                    setContact((c) => ({ ...c, industry: e.target.value }))
                  }
                >
                  <option value="">Select…</option>
                  {INDUSTRIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {touchedNext && !contactValid && (
              <p className="mt-4 text-[13px] text-[var(--accent-copper)]">
                Please fill in your name, a valid email, and company to
                continue.
              </p>
            )}
          </motion.section>
        )}

        {/* ── Steps 1–4 · Question sections ────────────────── */}
        {currentSystem && (
          <motion.section
            key={currentSystem.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
              {currentSystem.short}
            </p>
            <h2 className="mt-2 font-fraunces text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">
              {currentSystem.label}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-secondary)]">
              {currentSystem.description}
            </p>

            <div className="mt-8 space-y-10">
              {currentSystem.questions.map((q, qi) => (
                <fieldset key={q.id}>
                  <legend className="text-[16px] font-medium leading-snug text-[var(--text-primary)]">
                    <span className="mr-2 font-mono text-[12px] text-[var(--text-muted)]">
                      {qi + 1}.
                    </span>
                    {q.text}
                  </legend>
                  <p className="mt-1.5 pl-6 text-[13px] italic text-[var(--text-muted)]">
                    {q.helper}
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-2 pl-6 sm:grid-cols-5">
                    {SCORE_OPTIONS.map((opt) => {
                      const selected = answers[q.id] === opt.score;
                      return (
                        <button
                          key={opt.score}
                          type="button"
                          aria-pressed={selected}
                          onClick={() =>
                            setAnswers((a) => ({ ...a, [q.id]: opt.score }))
                          }
                          className={`rounded-md border px-2 py-3 text-left transition sm:text-center ${
                            selected
                              ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text-primary)]"
                              : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--accent)]"
                          }`}
                        >
                          <span className="block font-mono text-[15px] font-bold">
                            {opt.label}
                          </span>
                          <span className="mt-0.5 block text-[11px] leading-tight">
                            {opt.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>

            {touchedNext && !systemComplete && (
              <p className="mt-6 text-[13px] text-[var(--accent-copper)]">
                Please answer all three questions before continuing.
              </p>
            )}
          </motion.section>
        )}

        {/* ── Step 5 · Results ─────────────────────────────── */}
        {results && (
          <motion.section
            key="results"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
              Your operational health report
            </p>
            <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <span className="font-fraunces text-6xl font-semibold text-[var(--text-primary)]">
                {results.overall.pct}%
              </span>
              <span
                className="font-mono text-[14px] font-bold uppercase tracking-[0.2em]"
                style={{ color: results.overall.color }}
              >
                {results.overall.label}
              </span>
            </div>
            {contact.name && (
              <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
                Prepared for {contact.name}
                {contact.company ? ` · ${contact.company}` : ""}
              </p>
            )}

            {/* Per-system scores */}
            <div className="mt-10 space-y-5">
              {results.systems.map((sys) => (
                <div key={sys.id}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[15px] font-medium text-[var(--text-primary)]">
                      {sys.label}
                    </span>
                    <span
                      className="font-mono text-[12px] font-bold uppercase tracking-[0.14em]"
                      style={{ color: BAND_COLORS[sys.band] }}
                    >
                      {sys.pct}% · {BAND_LABELS[sys.band]}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-[var(--surface-high)]">
                    <motion.div
                      className="h-1.5 rounded-full"
                      style={{ backgroundColor: BAND_COLORS[sys.band] }}
                      initial={{ width: 0 }}
                      animate={{ width: `${sys.pct}%` }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <h3 className="mt-12 font-fraunces text-xl font-semibold text-[var(--text-primary)]">
              Recommended next moves
            </h3>
            <ol className="mt-5 space-y-4">
              {results.recommendations.map((rec, i) => (
                <li
                  key={`${rec.system}-${i}`}
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em]"
                      style={{
                        color: PRIORITY_COLORS[rec.priority],
                        borderColor: PRIORITY_COLORS[rec.priority],
                      }}
                    >
                      {PRIORITY_LABELS[rec.priority]}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                      {rec.system}
                    </span>
                  </div>
                  <p className="mt-2.5 text-[15px] font-medium leading-snug text-[var(--text-primary)]">
                    {rec.title}
                  </p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--text-secondary)]">
                    {rec.description}
                  </p>
                </li>
              ))}
            </ol>

            {/* Actions */}
            <div className="mt-10 flex flex-wrap items-center gap-4 print:hidden">
              <a
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-[14px] font-bold text-[var(--bg)] transition hover:opacity-90"
              >
                Book a 20-min walkthrough
                <AnimatedIcon><ArrowRight size={16} aria-hidden /></AnimatedIcon>
              </a>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-3 text-[13px] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <AnimatedIcon><Printer size={15} aria-hidden /></AnimatedIcon>
                Save as PDF
              </button>
              <button
                type="button"
                onClick={restart}
                className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] transition hover:text-[var(--accent)]"
              >
                <AnimatedIcon><RotateCcw size={14} aria-hidden /></AnimatedIcon>
                Restart
              </button>
            </div>
            <p className="mt-6 text-[12px] text-[var(--text-muted)]">
              Your data is never sold or shared.
            </p>
            {leadSubmitError && (
              <p className="mt-2 text-[12px] text-[var(--accent-copper)]">
                We couldn&apos;t save a copy of your report to our system, but
                your results above are unaffected — feel free to book a
                walkthrough directly.
              </p>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* Back / Next */}
      {step < TOTAL_STEPS && (
        <div className="mt-12 flex items-center justify-between border-t border-[var(--border)] pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)] transition hover:text-[var(--accent)] disabled:invisible"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={goNext}
            className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-bold transition ${
              canAdvance
                ? "bg-gold-gradient text-[var(--bg)] hover:opacity-90"
                : "border border-[var(--border)] text-[var(--text-muted)]"
            }`}
          >
            {step === 4 ? "See my report" : "Next"}
            <AnimatedIcon><ArrowRight size={16} aria-hidden /></AnimatedIcon>
          </button>
        </div>
      )}
    </div>
  );
}

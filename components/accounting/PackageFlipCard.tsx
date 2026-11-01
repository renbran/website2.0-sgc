"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SheenLayer from "@/components/ui/SheenLayer";
import { aed, type AccountingPackage } from "@/content/accounting-packages";

// Both faces share one grid cell, so the card is as tall as its longer face and
// nothing jumps on flip. The face you are not looking at is `inert`: it cannot be
// focused or read out, and real <button>s (not a role="button" wrapper) do the
// flipping, so the links inside stay valid and the inclusions stay readable.
const face =
  "relative flex flex-col rounded-2xl border p-6 [grid-area:1/1] [backface-visibility:hidden] transition-shadow duration-500 group-hover:shadow-[0_22px_60px_-20px_rgba(199,162,58,0.35)]";
const cta =
  "inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-[0.85rem] font-bold transition duration-300";
const turn =
  "inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2 text-[0.8rem] font-semibold text-[var(--text-secondary)] transition-colors duration-300 hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]";

export default function PackageFlipCard({ pkg }: { pkg: AccountingPackage }) {
  const [flipped, setFlipped] = useState(false);
  const toBack = useRef<HTMLButtonElement>(null);
  const toFront = useRef<HTMLButtonElement>(null);
  const moveFocus = useRef(false);

  // detail 0 = keyboard activation; mouse and touch users keep focus where it was.
  function flip(next: boolean, e?: { detail: number }) {
    moveFocus.current = !e || e.detail === 0;
    setFlipped(next);
  }

  // The button just pressed is now on an inert face; land keyboard focus on the other side.
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    (flipped ? toFront : toBack).current?.focus({ preventScroll: true });
  }, [flipped]);

  const start = (
    <Link
      href={`/accounting/subscribe?package=${pkg.code}`}
      aria-label={`Get started with ${pkg.name}`}
      className={`${cta} ${
        pkg.featured
          ? "border border-transparent bg-gold-gradient text-[var(--bg)] hover:shadow-[0_0_22px_rgba(199,162,58,0.35)]"
          : "border border-[rgba(199,162,58,0.5)] text-[var(--accent)] hover:bg-[rgba(199,162,58,0.06)]"
      }`}
    >
      Get started
    </Link>
  );

  return (
    <div className="group h-full [perspective:1600px] transition-transform duration-500 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div
        className={`grid h-full [transform-style:preserve-3d] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <div
          inert={flipped}
          className={`${face} bg-[var(--surface)] ${
            pkg.featured ? "border-[rgba(199,162,58,0.55)]" : "border-[var(--border)]"
          }`}
        >
          {pkg.featured && <SheenLayer />}
          <h2 className="text-[0.8rem] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{pkg.name}</h2>
          <p className="mt-3 whitespace-nowrap font-fraunces text-3xl font-semibold text-[var(--text-primary)]">
            {aed(pkg.monthly)}
          </p>
          <p className="text-[0.8rem] text-[var(--text-muted)]">per month, excl. VAT</p>
          <p className="mt-4 text-[0.9rem] leading-relaxed text-[var(--text-secondary)]">{pkg.forWho}</p>
          <dl className="mt-5 space-y-1.5 border-t border-[var(--border)] pt-4 text-[0.84rem]">
            {(
              [
                ["Transactions", `${pkg.transactions}/mo`],
                ["Banks + cards", pkg.banks],
                ["User seats", pkg.seats],
                ["Monthly close", pkg.close],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 text-[var(--text-secondary)]">
                <dt>{k}</dt>
                <dd className="text-right text-[var(--text-primary)]">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-auto space-y-2 pt-6">
            <button type="button" ref={toBack} onClick={(e) => flip(true, e)} className={turn}>
              See what&apos;s included <span aria-hidden>↻</span>
            </button>
            {start}
          </div>
        </div>

        <div
          inert={!flipped}
          onKeyDown={(e) => e.key === "Escape" && flip(false)}
          className={`${face} border-[rgba(199,162,58,0.55)] bg-[var(--surface-high)] [transform:rotateY(180deg)]`}
        >
          <div
            aria-hidden
            className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(199,162,58,0.9),transparent)]"
          />
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
            {pkg.name} · {aed(pkg.monthly)}/mo
          </p>
          <h3 className="mt-2 font-fraunces text-xl font-semibold text-[var(--text-primary)]">What&apos;s included</h3>
          {pkg.plus && <p className="mt-4 text-[0.84rem] font-semibold text-[var(--text-primary)]">{pkg.plus}:</p>}
          <ul className="mt-3 space-y-2.5 text-[0.86rem] leading-snug text-[var(--text-secondary)]">
            {pkg.includes.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span aria-hidden className="text-[var(--accent)]">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {pkg.notIncluded && (
            <p className="mt-4 border-t border-[var(--border)] pt-3 text-[0.8rem] leading-snug text-[var(--text-muted)]">
              <span className="font-semibold text-[var(--text-secondary)]">Not included:</span> {pkg.notIncluded}
            </p>
          )}
          <div className="mt-auto space-y-2 pt-6">
            {start}
            <button type="button" ref={toFront} onClick={(e) => flip(false, e)} className={turn}>
              <span aria-hidden>←</span> Back to price
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

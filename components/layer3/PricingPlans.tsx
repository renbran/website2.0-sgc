"use client";

import Link from "next/link";
import { useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import type { Pricing } from "@/lib/layer3";
import { CYCLE_LABEL, cycleCharge, money, period, vat } from "./format";

export default function PricingPlans({ pricing }: { pricing: Pricing }) {
  const [cycleKey, setCycleKey] = useState<string>("monthly");
  const [users, setUsers] = useState<number>(pricing.included_users);
  const cycle = pricing.cycles.find((c) => c.cycle === cycleKey) ?? pricing.cycles[0];
  const charge = cycleCharge(pricing, cycle, users);
  const tax = vat(pricing, charge);
  const canSignUp = pricing.checkout_enabled && pricing.open && pricing.founding;

  return (
    <GlassCard contentClassName="p-8 md:p-10">
      <fieldset>
        <legend className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          Billing cycle
        </legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {pricing.cycles.map((c) => {
            const selected = c.cycle === cycle.cycle;
            return (
              <button
                key={c.cycle}
                type="button"
                aria-pressed={selected}
                onClick={() => setCycleKey(c.cycle)}
                className={`rounded-xl border p-4 text-left transition duration-200 ${
                  selected
                    ? "border-[rgba(199,162,58,0.6)] bg-[rgba(199,162,58,0.08)]"
                    : "border-[var(--border)] bg-[var(--surface-high)] hover:border-[rgba(199,162,58,0.3)]"
                }`}
              >
                <span className="block text-[0.8rem] font-semibold text-[var(--text-primary)]">
                  {CYCLE_LABEL[c.cycle]}
                  {c.rebate_percent > 0 && <span className="ml-2 text-[var(--accent)]">save {c.rebate_percent}%</span>}
                </span>
                <span className="mt-2 block font-fraunces text-2xl font-semibold text-[var(--text-primary)]">
                  {money(c.base_price / c.months, pricing.currency)}
                </span>
                <span className="block text-[0.78rem] text-[var(--text-muted)]">
                  {c.months === 1
                    ? "a month, billed monthly"
                    : `a month · ${money(c.base_price, pricing.currency)} per ${period(c.months)}`}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8">
        <label
          htmlFor="l3-users"
          className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]"
        >
          Named users: {users}
        </label>
        <input
          id="l3-users"
          type="range"
          min={pricing.included_users}
          max={Math.min(pricing.max_users, 50)}
          value={users}
          onChange={(e) => setUsers(Number(e.target.value))}
          className="mt-3 w-full accent-[var(--accent)]"
        />
        <p className="mt-2 text-[0.85rem] text-[var(--text-secondary)]">
          {pricing.included_users} users are included. Each additional user is{" "}
          {money(pricing.user_monthly, pricing.currency)} a month
          {pricing.founding ? " at the founding rate" : ""}.
        </p>
      </div>

      <dl className="mt-8 space-y-2 border-t border-[var(--border)] pt-6 text-[0.9rem]">
        <div className="flex justify-between text-[var(--text-secondary)]">
          <dt>{CYCLE_LABEL[cycle.cycle]} charge</dt>
          <dd>{money(charge, pricing.currency)}</dd>
        </div>
        <div className="flex justify-between text-[var(--text-secondary)]">
          <dt>VAT {pricing.vat_percent}%</dt>
          <dd>{money(tax, pricing.currency)}</dd>
        </div>
        <div className="flex justify-between font-semibold text-[var(--text-primary)]">
          <dt>Due every {period(cycle.months)}</dt>
          <dd>{money(charge + tax, pricing.currency)}</dd>
        </div>
      </dl>

      <div className="mt-8">
        {canSignUp ? (
          <Link
            href={`/subscribe?cycle=${cycle.cycle}&users=${users}`}
            className="inline-flex w-full items-center justify-center rounded-full bg-gold-gradient px-6 py-3.5 text-[0.9rem] font-bold text-[var(--bg)] transition duration-300 hover:shadow-[0_0_22px_rgba(199,162,58,0.35)]"
          >
            Start my subscription
          </Link>
        ) : (
          <Link
            href="/contact"
            className="inline-flex w-full items-center justify-center rounded-full border border-[rgba(199,162,58,0.5)] px-6 py-3.5 text-[0.9rem] font-bold text-[var(--accent)]"
          >
            Talk to us to get started
          </Link>
        )}
        {canSignUp && (
          <Link
            href="/subscribe/trial"
            className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-[rgba(199,162,58,0.5)] px-6 py-3 text-[0.85rem] font-semibold text-[var(--accent)] transition duration-300 hover:bg-[rgba(199,162,58,0.06)]"
          >
            Start 14-day free trial (card required)
          </Link>
        )}
        {pricing.founding && (
          <p className="mt-3 text-[0.78rem] leading-relaxed text-[var(--text-muted)]">
            Founding clients: the one-time onboarding fee (AED 1,500) is waived, and the founding rate holds while
            your subscription stays active.
          </p>
        )}
      </div>
    </GlassCard>
  );
}

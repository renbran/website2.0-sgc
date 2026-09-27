import type { CyclePrice, Pricing } from "@/lib/layer3";

export const CYCLE_LABEL: Record<CyclePrice["cycle"], string> = {
  quarterly: "Quarterly",
  half_yearly: "Half-yearly",
  annual: "Annual",
};

export function money(amount: number, currency = "AED"): string {
  return `${currency} ${amount.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Charge for one billing cycle, before VAT, for `users` named users. */
export function cycleCharge(pricing: Pricing, cycle: CyclePrice, users: number): number {
  const extra = Math.max(0, users - pricing.included_users);
  return Math.round((cycle.base_price + extra * cycle.extra_user_price) * 100) / 100;
}

export function vat(pricing: Pricing, amount: number): number {
  return Math.round(amount * pricing.vat_percent) / 100;
}

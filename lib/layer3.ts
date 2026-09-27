// Server-only client for the Layer 3 signup methods on Odoo (sgc_layer3_bridge, model
// layer3.checkout), called over Odoo 19's JSON-2 API with a dedicated machine user's API key.
//
// IMPORTANT: reads ODOO_* / ODOO_L3_* environment variables without a NEXT_PUBLIC_ prefix, so
// it must only be imported from server code (Route Handlers, Server Components).
//
// JSON-2 reference: https://www.odoo.com/documentation/19.0/developer/reference/external_api.html

export class Layer3ConfigError extends Error {}

/** A refusal from Odoo that the visitor can act on (slug taken, waitlist, bad input...). */
export class Layer3UserError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

export class Layer3RequestError extends Error {}

export type CyclePrice = {
  cycle: "quarterly" | "half_yearly" | "annual";
  months: number;
  rebate_percent: number;
  base_price: number;
  extra_user_price: number;
};

export type Pricing = {
  currency: string;
  vat_percent: number;
  base_monthly: number;
  user_monthly: number;
  included_users: number;
  max_users: number;
  founding: boolean;
  open: boolean;
  checkout_enabled: boolean;
  cycles: CyclePrice[];
};

export type CheckoutResult = {
  ok: boolean;
  deduplicated: boolean;
  checkout_url: string;
  amount_untaxed: number;
  amount_tax: number;
  amount_total: number;
  currency: string;
  cycle: string;
  users: number;
  tenant_slug: string;
  sale_order_name: string;
};

export type OrderStatus =
  | { found: false }
  | {
      found: true;
      order_state: string;
      account_state: string;
      paid: boolean;
      tenant_url: string | false;
      docs_status: string;
    };

// Odoo UserError codes raised by layer3.checkout -> text a visitor can act on.
const USER_MESSAGES: Record<string, string> = {
  layer3_checkout_disabled: "Online signup is not open yet. Please contact us and we will set you up.",
  layer3_slug_taken: "That workspace address is already taken. Please choose another.",
  layer3_slug_reserved: "That workspace address is reserved. Please choose another.",
  layer3_slug_invalid:
    "The workspace address must be 3 to 30 lowercase letters, numbers or hyphens, starting with a letter.",
  layer3_waitlist: "We have reached our current capacity. Leave your details and we will contact you.",
  layer3_sales_assisted: "Our founding places are full. Please contact us and we will set you up directly.",
};

function config() {
  const url = process.env.ODOO_URL;
  const db = process.env.ODOO_DB;
  const key = process.env.ODOO_L3_API_KEY;
  if (!url || !db || !key) {
    throw new Layer3ConfigError("Layer 3 signup is not configured. Set ODOO_URL, ODOO_DB and ODOO_L3_API_KEY.");
  }
  return { url: url.replace(/\/+$/, ""), db, key };
}

async function call<T>(method: string, body: Record<string, unknown>): Promise<T> {
  const { url, db, key } = config();
  let res: Response;
  try {
    res = await fetch(`${url}/json/2/layer3.checkout/${method}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${key}`,
        "X-Odoo-Database": db,
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
  } catch (err) {
    throw new Layer3RequestError(`Odoo unreachable: ${(err as Error).name}`);
  }
  if (res.ok) {
    return (await res.json()) as T;
  }
  let detail: { name?: string; message?: string } = {};
  try {
    detail = await res.json();
  } catch {
    // non-JSON error page
  }
  const message = (detail.message || "").trim();
  if (detail.name === "odoo.exceptions.UserError" && message in USER_MESSAGES) {
    throw new Layer3UserError(message, USER_MESSAGES[message]);
  }
  if (detail.name === "odoo.exceptions.ValidationError" && message) {
    // Field validation from layer3.checkout._validate: safe, specific, written for people.
    throw new Layer3UserError("invalid", message);
  }
  throw new Layer3RequestError(`Odoo ${method} failed: HTTP ${res.status} ${detail.name || ""}`);
}

export function getPricing(): Promise<Pricing> {
  return call<Pricing>("pricing", {});
}

export function slugStatus(slug: string): Promise<{ slug: string; available: boolean; reason: string }> {
  return call("slug_status", { slug });
}

export function createCheckout(payload: Record<string, unknown>): Promise<CheckoutResult> {
  return call<CheckoutResult>("create_or_get_checkout", { payload });
}

export function orderStatus(requestId: string): Promise<OrderStatus> {
  return call<OrderStatus>("order_status", { request_id: requestId });
}

export function slugMessage(reason: string): string {
  return USER_MESSAGES[`layer3_slug_${reason}`] || "That workspace address is not available.";
}

// ---------------------------------------------------------------- abuse controls

const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

/** Per-instance sliding window (same approach as /api/contact); Cloudflare adds the edge limit. */
export function rateLimited(key: string, max: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > max;
}

export function clientIp(headers: Headers): string {
  return headers.get("cf-connecting-ip") || headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/** Cloudflare Turnstile check. Enforced only when TURNSTILE_SECRET_KEY is set. */
export async function turnstileOk(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

// Server-only Odoo JSON-RPC client for lead capture.
//
// IMPORTANT: This module reads ODOO_* environment variables (no NEXT_PUBLIC_
// prefix), so they are never bundled into client JavaScript. It must only be
// imported from server-side code (Next.js Route Handlers / Server Components/
// Server Actions) — importing it from a "use client" component would be a
// build-time module-resolution error at best and a secret leak at worst.
//
// Odoo external API reference: https://www.odoo.com/documentation/19.0/developer/reference/external_api.html

type JsonRpcResponse<T> = {
  jsonrpc: "2.0";
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: { name?: string; debug?: string; message?: string };
  };
};

class OdooConfigError extends Error {}
class OdooRequestError extends Error {}

function getConfig() {
  const url = process.env.ODOO_URL;
  const db = process.env.ODOO_DB;
  const username = process.env.ODOO_USERNAME;
  const apiKey = process.env.ODOO_API_KEY;

  if (!url || !db || !username || !apiKey) {
    throw new OdooConfigError(
      "Odoo integration is not configured. Set ODOO_URL, ODOO_DB, ODOO_USERNAME, and ODOO_API_KEY.",
    );
  }
  return { url: url.replace(/\/+$/, ""), db, username, apiKey };
}

let cachedUid: number | null = null;
let cachedUidAt = 0;
const UID_TTL_MS = 10 * 60 * 1000; // re-authenticate every 10 min (cheap, avoids stale-session edge cases)

async function jsonRpc<T>(
  endpoint: string,
  service: string,
  method: string,
  args: unknown[],
): Promise<T> {
  const { url } = getConfig();
  const res = await fetch(`${url}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: { service, method, args },
      id: Date.now(),
    }),
    // Odoo lead capture must never be served from cache.
    cache: "no-store",
  });

  if (!res.ok) {
    throw new OdooRequestError(`Odoo responded with HTTP ${res.status}`);
  }

  const payload = (await res.json()) as JsonRpcResponse<T>;
  if (payload.error) {
    const detail = payload.error.data?.message || payload.error.message;
    throw new OdooRequestError(`Odoo RPC error: ${detail}`);
  }
  if (payload.result === undefined) {
    throw new OdooRequestError("Odoo RPC returned no result");
  }
  return payload.result;
}

async function authenticate(): Promise<number> {
  const now = Date.now();
  if (cachedUid !== null && now - cachedUidAt < UID_TTL_MS) {
    return cachedUid;
  }
  const { db, username, apiKey } = getConfig();
  const uid = await jsonRpc<number | false>("/jsonrpc", "common", "authenticate", [
    db,
    username,
    apiKey,
    {},
  ]);
  if (!uid) {
    throw new OdooRequestError(
      "Odoo authentication failed — check ODOO_DB / ODOO_USERNAME / ODOO_API_KEY.",
    );
  }
  cachedUid = uid;
  cachedUidAt = now;
  return uid;
}

async function executeKw<T>(
  model: string,
  method: string,
  args: unknown[],
  kwargs: Record<string, unknown> = {},
): Promise<T> {
  const { db, apiKey } = getConfig();
  const uid = await authenticate();
  try {
    return await jsonRpc<T>("/jsonrpc", "object", "execute_kw", [
      db,
      uid,
      apiKey,
      model,
      method,
      args,
      kwargs,
    ]);
  } catch (err) {
    // If the cached uid went stale (session expired server-side), retry once
    // with a fresh authentication before giving up.
    if (err instanceof OdooRequestError) {
      cachedUid = null;
      const freshUid = await authenticate();
      return jsonRpc<T>("/jsonrpc", "object", "execute_kw", [
        db,
        freshUid,
        apiKey,
        model,
        method,
        args,
        kwargs,
      ]);
    }
    throw err;
  }
}

export type LeadSource = "contact_form" | "diagnostic";

export interface CreateLeadInput {
  /** Short opportunity/lead title, e.g. "Website enquiry — Ahmed Al Rashid" */
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  jobTitle?: string;
  /** Free-text notes / HTML description body for the lead */
  description?: string;
  source: LeadSource;
}

let websiteTeamId: number | null | undefined; // undefined = not looked up yet

/**
 * Finds (but does not create) the "Website" crm.team id, so submissions from
 * this site route into the correct sales team's pipeline in Odoo. Cached
 * in-memory per server instance. Falls back to no team_id (Odoo's default)
 * if the "Website" team doesn't exist in this database.
 */
async function findWebsiteTeamId(): Promise<number | null> {
  if (websiteTeamId !== undefined) return websiteTeamId;
  const rows = await executeKw<{ id: number }[]>("crm.team", "search_read", [
    [["name", "=", "Website"]],
  ], { fields: ["id"], limit: 1 });
  websiteTeamId = rows[0]?.id ?? null;
  return websiteTeamId;
}

/**
 * Creates a crm.lead record in Odoo. Returns the new record's id.
 * Throws OdooConfigError if env vars are missing, OdooRequestError on any
 * RPC failure — callers should catch and translate to a generic 5xx so the
 * Odoo error text (and endpoint) is never echoed back to the browser.
 */
export async function createLead(input: CreateLeadInput): Promise<number> {
  const teamId = await findWebsiteTeamId();

  const values: Record<string, unknown> = {
    name: input.name,
    type: "lead",
    contact_name: input.contactName || undefined,
    email_from: input.email || undefined,
    phone: input.phone || undefined,
    partner_name: input.companyName || undefined,
    function: input.jobTitle || undefined,
    description: input.description || undefined,
    team_id: teamId || undefined,
  };

  // Strip undefined keys — Odoo's ORM is picky about explicit `undefined`.
  for (const key of Object.keys(values)) {
    if (values[key] === undefined) delete values[key];
  }

  return executeKw<number>("crm.lead", "create", [values]);
}

export { OdooConfigError, OdooRequestError };

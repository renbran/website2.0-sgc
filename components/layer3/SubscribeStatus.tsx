"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { money } from "./format";

type Saved = { checkout_url: string; slug: string; order: string; total: number; currency: string };
type Status = { found: boolean; paid?: boolean; account_state?: string; tenant_url?: string | null };

const POLL_MS = 5000;

export default function SubscribeStatus({ requestId }: { requestId: string }) {
  const [saved, setSaved] = useState<Saved | null>(null);
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`sgc_l3_checkout_${requestId}`);
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      // no stored summary; the status API still works
    }
  }, [requestId]);

  useEffect(() => {
    let stop = false;
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      try {
        const res = await fetch(`/api/layer3/status?r=${encodeURIComponent(requestId)}`, { cache: "no-store" });
        if (res.ok) {
          const data: Status = await res.json();
          if (!stop) setStatus(data);
          if (data.paid && data.account_state === "active") return; // done: stop polling
        }
      } catch {
        // transient: try again
      }
      if (!stop) timer = setTimeout(poll, POLL_MS);
    }
    poll();
    return () => {
      stop = true;
      clearTimeout(timer);
    };
  }, [requestId]);

  const paid = Boolean(status?.paid);
  const tenantUrl = status?.tenant_url || (saved?.slug ? `https://${saved.slug}.sgctech.ai` : null);

  return (
    <GlassCard contentClassName="p-8 md:p-10">
      <ol className="space-y-6">
        <li>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            1 · Order Form
          </p>
          {paid ? (
            <p className="mt-2 text-[var(--text-primary)]">Signed and paid. Thank you.</p>
          ) : (
            <>
              <p className="mt-2 text-[var(--text-secondary)]">
                Your Order Form{saved?.order ? ` ${saved.order}` : ""} is ready
                {saved ? ` (${money(saved.total, saved.currency)} including VAT)` : ""}. Review it, sign, and pay by
                card.
              </p>
              {saved?.checkout_url && (
                <a
                  href={saved.checkout_url}
                  target="_blank"
                  rel="noopener"
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-gold-gradient px-6 py-3 text-[0.9rem] font-bold text-[var(--bg)]"
                >
                  Sign &amp; pay
                </a>
              )}
              {!saved && (
                <p className="mt-2 text-[0.85rem] text-[var(--text-muted)]">
                  The link to your Order Form has also been emailed to you.
                </p>
              )}
            </>
          )}
        </li>
        <li>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            2 · Your workspace
          </p>
          {paid ? (
            <p className="mt-2 text-[var(--text-secondary)]">
              Your workspace is being set up at{" "}
              {tenantUrl ? (
                <a className="text-[var(--accent)]" href={tenantUrl}>
                  {tenantUrl.replace("https://", "")}
                </a>
              ) : (
                "your chosen address"
              )}
              . Within a few minutes you will receive an email with a link to set your password.
            </p>
          ) : (
            <p className="mt-2 text-[var(--text-muted)]">
              Set up automatically as soon as your payment clears. This page updates on its own.
            </p>
          )}
        </li>
        <li>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            3 · Trade licence
          </p>
          <p className="mt-2 text-[var(--text-muted)]">
            Upload a copy from Billing &amp; documents inside your workspace whenever it suits you. It never holds up
            activation.
          </p>
        </li>
      </ol>
    </GlassCard>
  );
}

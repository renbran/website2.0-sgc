# Pre-Launch Deployment Handoff

Source-side audit fixes are merged in PR #10 (`sgc-website` remote, branch
`feat/awards-marquee-and-badge-layout`). The items below are deployment-side
and cannot be fixed from this repo. Run through them in order before pointing
DNS at the new build.

---

## 1. Active commits in PR #10 (already pushed to `sgc-website`)

- `1ea1124` — `lang="en-AE"`, title/desc trim, skip-to-content, `<noscript>` fallback, GA4 scaffold
- `12ee68d` — `ProfessionalService.telephone`, privacy/terms SEO metadata
- `a08f49a` — loading splash on every refresh
- `281e3d6` — Shield stage title now surfaces before its callout
- `7dec310` — guard `toNonIndexed()` to stop three.js console spam
- `54c7760` — diagnosis label before callout (Shield sequence)

## 2. Operator actions on Vercel (prod alias)

### 2a. Set the environment variable

In **Project Settings → Environment Variables** on Vercel for the
`renbran/SGC-WEBSITE` project:

| Name | Value | Scope |
|------|-------|-------|
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` (your GA4 measurement ID) | Production, Preview, Development |

Trigger a redeploy after saving so the GA4 script gets injected.

### 2b. Verify the 404s are fixed on the prod alias

Before swapping DNS, curl each from the **prod alias URL** (not the preview):

```bash
curl -sI https://sgc-website-nu.vercel.app/robots.txt
curl -sI https://sgc-website-nu.vercel.app/sitemap.xml
curl -sI https://sgc-website-nu.vercel.app/opengraph-image
```

Expected: `HTTP/2 200` on all three.

If any return 404 on the prod alias, the issue is Vercel route propagation,
not the source. Workarounds in order of preference:

1. Promote the latest preview deployment to production in Vercel.
2. Open a Vercel support ticket quoting the deployment SHA — they can
   re-bind the production alias.
3. Last-resort: redeploy to force route re-resolution.

### 2c. Confirm the deployment SHA matches

In Vercel, the production deployment's SHA must equal the HEAD of
`feat/awards-marquee-and-badge-layout` on `sgc-website`. If it doesn't,
trigger a production redeploy from that branch.

## 3. The deployed `/final logo.png` 0-byte artifact (C4)

This file does **not** exist in the source repo. It's a deployed artifact,
almost certainly left over from a previous broken build. To remove:

1. SSH into the server (or use Vercel CLI):
   ```bash
   vercel env pull
   ```
2. Trigger a fresh production deploy from `feat/awards-marquee-and-badge-layout`:
   ```bash
   git push sgc-website feat/awards-marquee-and-badge-layout:main
   ```
3. After deploy, re-curl:
   ```bash
   curl -sI https://sgctech.ai/final%20logo.png
   ```
   Expected: `HTTP/2 404` (the source never references it; only deployed
   copies may have had it). If still 200, the CDN has it cached — purge
   via Vercel dashboard → Deployments → [Latest] → "Purge Cache".

## 4. DNS swap (C6)

After all checks above pass:

1. In the DNS provider for `sgctech.ai`, point the apex A/CNAME record at
   the Vercel production alias target (visible in Vercel Domains tab).
2. Wait for propagation (usually <10 minutes for apex A records).
3. Verify on the live domain:
   ```bash
   curl -sI https://sgctech.ai/
   curl -sI https://sgctech.ai/robots.txt
   curl -sI https://sgctech.ai/sitemap.xml
   curl -sI https://sgctech.ai/opengraph-image
   ```
   Expected title in the home HTML response:
   `"SGC Tech AI — Odoo & AI for UAE Mid-Market"`.
4. Spot-check OpenGraph preview by pasting
   `https://sgctech.ai/opengraph-image` into
   https://www.opengraph.xyz/ — it should resolve to the OG image, not 404.

## 5. Post-launch smoke checks

- [ ] All 4 routes load: `/`, `/diagnostic`, `/privacy`, `/terms`
- [ ] Hero scroll through the helix into the shield renders without console errors
- [ ] Custom gold cursor visible on desktop; native cursor on touch
- [ ] Loading splash visible on every page refresh (not just first paint)
- [ ] GA4 realtime shows a page_view within 60 seconds of your visit
- [ ] LinkedIn / Twitter / WhatsApp link previews render the OG image with the title

## 6. Rollback

If the new build misbehaves:

1. In Vercel, promote the previous production deployment back to alias.
2. Or, in DNS, point back at the previous A record.

No code changes needed — the previous build SHA is preserved in the Vercel
deployment history.

---

## Reference: audit-to-fix mapping

| Audit ID | Status | Resolution |
|----------|--------|------------|
| C1 — `/opengraph-image` 404 on prod | Deployed-side | See §2b |
| C2 — `/robots.txt` 404 on prod | Deployed-side | See §2b |
| C3 — `/sitemap.xml` 404 on prod | Deployed-side | See §2b |
| C4 — `/final logo.png` 0 bytes | Deployed artifact | See §3 |
| C5 — missing `alt` on `<img>` | False positive in audit | Source has `alt="SGC Tech AI"` |
| C6 — prod serving old site | DNS / Vercel alias | See §4 |
| H1 — no analytics | **Fixed in `1ea1124`** | Set `NEXT_PUBLIC_GA_ID` per §2a |
| H2 — no `<noscript>` fallback | **Fixed in `1ea1124`** | — |
| H3 — direct `<img>` for sgc-logo | False positive in audit | Source uses `/_next/image` |
| M1 — title 63 chars | **Fixed in `1ea1124`** | Now 49 chars |
| M2 — meta desc 131 chars | **Fixed in `1ea1124`** | Now 158 chars |
| M3 — privacy desc 165 chars | **Fixed in `12ee68d`** | Now 135 chars |
| M4 — privacy/terms titles short | **Fixed in `12ee68d`** | Now 53/57 chars |
| M5 — JSON-LD missing `telephone` | **Fixed in `12ee68d`** | Added |
| M6 — `html lang="en"` | **Fixed in `1ea1124`** | Now `en-AE` |
| M7 — no Arabic hreflang | Out of scope | Not shipping Arabic |
| M8 — no skip-to-content | **Fixed in `1ea1124`** | — |
| M9 — filename with space | See C4 | See §3 |
| M10 — duplicate preload | False positive in audit | Source clean |
| L3 — no CSP header | Defer | Add via `next.config.ts` post-launch |
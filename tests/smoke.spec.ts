import { test, expect } from "@playwright/test";

/**
 * Smoke tests for the SGC Tech AI marketing site.
 *
 * Run against `bun run start` (production server on :3000). These are
 * not exhaustive — they only catch the regressions that would actually
 * ship to production: missing pages, broken links, dead WhatsApp channel.
 *
 * Add to this file as new critical paths land. Do not move fast tests
 * here — keep them in unit-level suites.
 */

test.describe("public routes", () => {
  for (const path of ["/", "/privacy", "/terms"]) {
    test(`${path} returns 200`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status(), `${path} should return 200`).toBe(200);
    });

    test(`${path} has a single <h1>`, async ({ page }) => {
      await page.goto(path);
      const h1Count = await page.locator("h1").count();
      expect(h1Count, `${path} should have exactly one <h1>`).toBe(1);
    });

    test(`${path} has the canonical link`, async ({ page }) => {
      await page.goto(path);
      const canonical = await page
        .locator('link[rel="canonical"]')
        .first()
        .getAttribute("href");
      expect(canonical, `${path} should declare a canonical URL`).toBeTruthy();
    });
  }
});

test.describe("crawl surface", () => {
  test("robots.txt allows / and points to sitemap", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("Allow: /");
    expect(body).toContain("sitemap.xml");
  });

  test("sitemap.xml includes /, /privacy, /terms", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("https://sgctech.ai/");
    expect(body).toContain("https://sgctech.ai/privacy");
    expect(body).toContain("https://sgctech.ai/terms");
  });

  test("opengraph-image returns a PNG", async ({ request }) => {
    const res = await request.get("/opengraph-image");
    expect(res.status()).toBe(200);
    const ct = res.headers()["content-type"] ?? "";
    expect(ct, "opengraph-image should be a PNG").toContain("image/png");
  });
});

test.describe("conversion channels", () => {
  test("Footer has the WhatsApp link", async ({ page }) => {
    await page.goto("/");
    const wa = page.locator('a[href*="wa.me/971521985231"]').first();
    await expect(wa).toBeVisible();
  });

  test("Contact section has 3 per-option WhatsApp links with prefill", async ({ page }) => {
    await page.goto("/");
    const waLinks = page.locator('a[href*="wa.me/971521985231"][href*="?text="]');
    expect(await waLinks.count()).toBeGreaterThanOrEqual(3);
  });

  test("Footer Privacy and Terms route to real pages", async ({ page }) => {
    await page.goto("/");
    const privacy = page.locator('footer a[href="/privacy"]');
    const terms = page.locator('footer a[href="/terms"]');
    await expect(privacy).toBeVisible();
    await expect(terms).toBeVisible();
  });
});

test.describe("no fabricated claims", () => {
  test("homepage does not mention 'award', 'winner', 'shortlist', 'nomination'", async ({ page }) => {
    await page.goto("/");
    const body = await page.locator("body").innerText();
    for (const term of ["award", "winner", "shortlist", "nomination"]) {
      expect(
        body.toLowerCase().includes(term.toLowerCase()),
        `homepage should not contain "${term}" — capability badges only`,
      ).toBe(false);
    }
  });
});
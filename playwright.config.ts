import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for the SGC Tech AI smoke + e2e tests.
 *
 * `tests/smoke.spec.ts` runs the production-critical smoke checks
 * (routes 200, h1 counts, canonical URLs, robots/sitemap, WhatsApp
 * link present, no fabricated claims).
 *
 * `e2e/` retains the older visual scripts (e.g. shoot.mjs migrated
 * work). Both directories are picked up because we glob `*.spec.ts`
 * and `*.test.ts` from the configured `testDir`.
 *
 * Run `bun run test` for everything, or `bun run test:smoke` for the
 * production-critical smoke checks only.
 */
export default defineConfig({
  testDir: ".",
  testMatch: ["**/*.spec.ts", "**/*.test.ts"],
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "line" : "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    headless: true,
    viewport: { width: 1280, height: 900 },
    ignoreHTTPSErrors: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: ["--use-gl=angle", "--use-angle=swiftshader"],
        },
      },
    },
  ],
  outputDir: "./public/test-result",
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "bun run start",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});

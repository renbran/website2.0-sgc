/// <reference types="node" />
// Tiny script to capture screenshots and FPS metrics using Playwright
import { chromium } from "@playwright/test";
import * as fs from "fs";

async function capture(viewport: { width: number; height: number }, label: string) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.goto("http://localhost:3001", { waitUntil: "networkidle" });
  // wait a moment for three.js animation to settle
  await page.waitForTimeout(2000);
  // capture screenshot
  const screenshotPath = `shield-${label}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  // get FPS via PerformanceObserver (approx frame count over 5s)
  const fps = await page.evaluate(() => {
    return new Promise<number>((resolve) => {
      let frames = 0;
      const start = performance.now();
      function tick() {
        frames++;
        const now = performance.now();
        if (now - start < 5000) {
          requestAnimationFrame(tick);
        } else {
          resolve(frames / 5);
        }
      }
      requestAnimationFrame(tick);
    });
  });
  console.log(`FPS ${label}: ${fps.toFixed(1)}`);
  await browser.close();
  return { screenshotPath, fps };
}

(async () => {
  const results = [];
  results.push(await capture({ width: 1440, height: 900 }, "desktop"));
  results.push(await capture({ width: 375, height: 667 }, "mobile"));
  // write simple JSON report
  fs.writeFileSync("fps-report.json", JSON.stringify(results, null, 2));
})();

/**
 * Proof script for 3 Shield refinements:
 * 1. Entrance roll (p=0→0.08 rolls shield from edge-on to face-forward)
 * 2. Honeycomb identity (filler cells match active tiles visually)
 * 3. Callout card auto-size (longest body text fully visible)
 */
import { chromium } from '@playwright/test';
import { existsSync, statSync, mkdirSync } from 'fs';

const URL = process.env.URL || 'http://localhost:3000';
const OUT = 'D:/Temp/claude/shots';
mkdirSync(OUT, { recursive: true });

const b = await chromium.launch();

// Calibrate: find shield section
const calibPage = await b.newPage({ viewport: { width: 1440, height: 900 } });
await calibPage.goto(URL, { waitUntil: 'networkidle' });
const C = await calibPage.evaluate(() => {
  const vh = window.innerHeight;
  const bodyH = document.body.scrollHeight;
  let best = null;
  document.querySelectorAll('div').forEach(el => {
    const h = el.offsetHeight;
    if (h >= vh * 6.5 && h <= vh * 8.5) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      if (!best || Math.abs(h - vh * 7.5) < Math.abs(best.h - vh * 7.5))
        best = { h, top };
    }
  });
  if (!best) return null;
  const { h, top } = best;
  const range = h - vh;
  const at = p => (top + p * range) / bodyH;
  return {
    atEntry00: at(0.00), atEntry02: at(0.02), atEntry05: at(0.05),
    atEntry10: at(0.10), atRest: at(0.40),
    atConnected: at(0.69), atFinale: at(0.975),
  };
});
await calibPage.close();
if (!C) { console.error('CALIBRATION FAILED'); process.exit(1); }
console.log('Calibration OK');

async function shot(name) {
  // page is closed after each section — this helper is called inline
  return name;
}

// ══════════════════════════════════════════════════════
// STORY 1 — ENTRANCE ROLL
// ══════════════════════════════════════════════════════
console.log('\n=== STORY 1: ENTRANCE ROLL ===');
const ep = await b.newPage({ viewport: { width: 1440, height: 900 } });
await ep.emulateMedia({ reducedMotion: 'no-preference' });
await ep.goto(URL, { waitUntil: 'networkidle' });

for (const [label, bodyP] of [
  ['entrance-p000', C.atEntry00],
  ['entrance-p002', C.atEntry02],
  ['entrance-p005', C.atEntry05],
  ['entrance-p010', C.atEntry10],
]) {
  await ep.evaluate(y => window.scrollTo(0, document.body.scrollHeight * y), bodyP);
  await ep.waitForTimeout(900);
  const f = `${OUT}/${label}.png`;
  await ep.screenshot({ path: f });
  const ok = existsSync(f) && statSync(f).size > 5000;
  console.log(ok ? `OK  ${label} (${statSync(f).size}b)` : `ERR ${label}`);
}

// Reverse: scroll back from p=0.05 → p=0.02 to prove reversibility
await ep.evaluate(y => window.scrollTo(0, document.body.scrollHeight * y), C.atEntry05);
await ep.waitForTimeout(500);
await ep.evaluate(y => window.scrollTo(0, document.body.scrollHeight * y), C.atEntry02);
await ep.waitForTimeout(900);
const revF = `${OUT}/entrance-reverse.png`;
await ep.screenshot({ path: revF });
console.log(existsSync(revF) ? `OK  entrance-reverse (${statSync(revF).size}b)` : 'ERR entrance-reverse');
await ep.close();

// ══════════════════════════════════════════════════════
// STORY 2 — HONEYCOMB IDENTITY
// ══════════════════════════════════════════════════════
console.log('\n=== STORY 2: HONEYCOMB IDENTITY ===');
const hp = await b.newPage({ viewport: { width: 1440, height: 900 } });
await hp.emulateMedia({ reducedMotion: 'no-preference' });
await hp.goto(URL, { waitUntil: 'networkidle' });
await hp.evaluate(y => window.scrollTo(0, document.body.scrollHeight * y), C.atRest);
await hp.waitForTimeout(2000);
const hf1 = `${OUT}/honeycomb-rest-1440.png`;
await hp.screenshot({ path: hf1 });
console.log(existsSync(hf1) ? `OK  honeycomb-rest-1440 (${statSync(hf1).size}b)` : 'ERR honeycomb-rest-1440');
await hp.evaluate(y => window.scrollTo(0, document.body.scrollHeight * y), C.atFinale);
await hp.waitForTimeout(2000);
const hf2 = `${OUT}/honeycomb-finale-1440.png`;
await hp.screenshot({ path: hf2 });
console.log(existsSync(hf2) ? `OK  honeycomb-finale-1440 (${statSync(hf2).size}b)` : 'ERR honeycomb-finale-1440');
await hp.close();

// ══════════════════════════════════════════════════════
// STORY 3 — CALLOUT CARD AUTO-SIZE
// ══════════════════════════════════════════════════════
console.log('\n=== STORY 3: CALLOUT CARD AUTO-SIZE ===');
const cp = await b.newPage({ viewport: { width: 1440, height: 900 } });
await cp.emulateMedia({ reducedMotion: 'no-preference' });
await cp.goto(URL, { waitUntil: 'networkidle' });
await cp.evaluate(y => window.scrollTo(0, document.body.scrollHeight * y), C.atRest);
await cp.waitForTimeout(600);
await cp.evaluate(y => window.scrollTo(0, document.body.scrollHeight * y), C.atConnected);
await cp.waitForTimeout(2500);

const cardProbe = await cp.evaluate(() => {
  const wrapper = document.querySelector('[data-callout-tile="4"]');
  if (!wrapper) return { found: false };
  const card = wrapper.querySelector('div > div[style]');
  const body = card ? card.querySelector('.callout-body') : null;
  const cardRect = card ? card.getBoundingClientRect() : null;
  const bodyRect = body ? body.getBoundingClientRect() : null;
  const cardCs = card ? window.getComputedStyle(card) : null;
  return {
    found: true,
    cardH: cardRect ? Math.round(cardRect.height) : 0,
    cardW: cardRect ? Math.round(cardRect.width) : 0,
    bodyH: bodyRect ? Math.round(bodyRect.height) : 0,
    bodyBottom: bodyRect ? Math.round(bodyRect.bottom) : 0,
    cardBottom: cardRect ? Math.round(cardRect.bottom) : 0,
    bodyClipped: bodyRect && cardRect ? bodyRect.bottom > cardRect.bottom + 2 : false,
    overflow: cardCs ? cardCs.overflow : 'n/a',
    minHeight: cardCs ? cardCs.minHeight : 'n/a',
    bodyText: body ? body.textContent.slice(0, 90) : '',
  };
});
console.log(JSON.stringify(cardProbe, null, 2));
console.log('BODY CLIPPED:', cardProbe.bodyClipped ? 'YES — BUG' : 'NO — PASS');
const cf = `${OUT}/callout-connected-card.png`;
await cp.screenshot({ path: cf });
console.log(existsSync(cf) ? `OK  callout-connected-card (${statSync(cf).size}b)` : 'ERR callout-connected-card');
await cp.close();

await b.close();
console.log('\n=== DONE ===');

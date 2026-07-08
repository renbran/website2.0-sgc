import { chromium } from '@playwright/test';
import { existsSync, statSync, mkdirSync } from 'fs';

const URL = process.env.URL || 'http://localhost:3000';
const OUT = 'D:/Temp/claude/shots';
mkdirSync(OUT, { recursive: true });

const b = await chromium.launch();

// Calibrate: find the shield section (height 6.5–8.5× viewport)
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
    pHero:               0,
    pCallout_scattered:  at(0.13),
    pCallout_atrisk:     at(0.25),
    pCallout_unified:    at(0.40),
    pCallout_automated:  at(0.55),
    pCallout_connected:  at(0.69),
    pCallout_auditready: at(0.84),
    pFinale_early:       at(0.958),
    pFinale_spin:        at(0.975),
    pFinale_title:       at(0.99),
  };
});
await calibPage.close();
console.log('Shield calibration:', JSON.stringify(C, null, 2));
if (!C) { console.error('CALIBRATION FAILED'); process.exit(1); }

// Screenshot runs — 5th element = callout tile index to wait on (-1 = no wait)
const shots = [
  ['hero-1440',            1440, 900, C.pHero,               -1],
  ['callout-scattered',    1440, 900, C.pCallout_scattered,    0],
  ['callout-atrisk',       1440, 900, C.pCallout_atrisk,       1],
  ['callout-unified',      1440, 900, C.pCallout_unified,      2],
  ['callout-automated',    1440, 900, C.pCallout_automated,    3],
  ['callout-connected',    1440, 900, C.pCallout_connected,    4],
  ['callout-auditready',   1440, 900, C.pCallout_auditready,   5],
  ['finale-early-1440',    1440, 900, C.pFinale_early,        -1],
  ['finale-spin-1440',     1440, 900, C.pFinale_spin,         -1],
  ['finale-title-1440',    1440, 900, C.pFinale_title,        -1],
  ['finale-title-375',     375,  812, 0.55,                   -1],
];

console.log('\n=== SCREENSHOTS ===');
for (const [name, w, h, sy, calloutTile] of shots) {
  const pg = await b.newPage({ viewport: { width: w, height: h } });
  await pg.emulateMedia({ reducedMotion: 'no-preference' });
  await pg.goto(URL, { waitUntil: 'networkidle' });
  await pg.evaluate(y => window.scrollTo(0, document.body.scrollHeight * y), sy);
  await pg.waitForTimeout(1600);
  // For callout shots: wait until the tile's wrapper opacity reaches ≥0.9 (R3F settled)
  if (calloutTile >= 0) {
    await pg.waitForFunction(
      (ti) => {
        const el = document.querySelector(`[data-callout-tile="${ti}"]`);
        return el ? parseFloat(window.getComputedStyle(el).opacity) >= 0.9 : false;
      },
      calloutTile,
      { timeout: 4000 }
    ).catch(() => console.log(`  WARN: tile-${calloutTile} opacity never reached 0.9`));
  }
  const file = `${OUT}/${name}.png`;
  await pg.screenshot({ path: file });
  const ok = existsSync(file) && statSync(file).size > 1000;
  console.log(ok ? `OK  ${name} (${statSync(file).size}b)` : `ERR ${name}`);
  await pg.close();
}

// === SPIN PROBE: measure actual rotation.y at p=0.975 ===
console.log('\n=== SPIN PROBE ===');
const sp = await b.newPage({ viewport: { width: 1440, height: 900 } });
await sp.emulateMedia({ reducedMotion: 'no-preference' });
await sp.goto(URL, { waitUntil: 'networkidle' });
// Scroll into the section first so IntersectionObserver fires frameloop="always"
await sp.evaluate(y => window.scrollTo(0, document.body.scrollHeight * y), C.pCallout_auditready);
await sp.waitForTimeout(800);
// Now scroll to finale-spin position
await sp.evaluate(y => window.scrollTo(0, document.body.scrollHeight * y), C.pFinale_spin);
await sp.waitForTimeout(2000); // wait for R3F frames to settle
const spinResult = await sp.evaluate(() => {
  const rotY = (window).__finaleRotY;
  const shields = [...document.querySelectorAll('div')].find(el =>
    el.offsetHeight >= window.innerHeight * 6.5 && el.offsetHeight <= window.innerHeight * 8.5
  );
  const shieldP = shields
    ? Math.max(0, Math.min(1, -shields.getBoundingClientRect().top / (shields.offsetHeight - window.innerHeight)))
    : -1;
  return { rotY: rotY !== undefined ? rotY : 'NOT-SET', shieldP };
});
const spinFile = `${OUT}/spin-probe.png`;
await sp.screenshot({ path: spinFile });
console.log(`shield_p=${typeof spinResult.shieldP === 'number' ? spinResult.shieldP.toFixed(4) : spinResult.shieldP}`);
console.log(`rotation.y=${spinResult.rotY}  (expect ~3.1416 at p=0.975 if spin is running)`);
console.log(`screenshot: ${existsSync(spinFile) ? statSync(spinFile).size+'b' : 'MISSING'}`);
await sp.close();

// === CONNECTED CALLOUT RECT PROBE ===
console.log('\n=== CONNECTED CALLOUT RECT PROBE ===');
const cp = await b.newPage({ viewport: { width: 1440, height: 900 } });
await cp.emulateMedia({ reducedMotion: 'no-preference' });
await cp.goto(URL, { waitUntil: 'networkidle' });
// Scroll into section first
await cp.evaluate(y => window.scrollTo(0, document.body.scrollHeight * y), C.pCallout_unified);
await cp.waitForTimeout(600);
// Then to connected dwell
await cp.evaluate(y => window.scrollTo(0, document.body.scrollHeight * y), C.pCallout_connected);
await cp.waitForTimeout(2000);
const rectResult = await cp.evaluate(() => {
  const wrapper = document.querySelector('[data-callout-tile="4"]');
  if (!wrapper) return { found: false };
  const wRect = wrapper.getBoundingClientRect();
  const wcs   = window.getComputedStyle(wrapper);

  // Find the card (first div with absolute position inside wrapper)
  const card = wrapper.querySelector('div > div[style]');
  const cardRect = card ? card.getBoundingClientRect() : null;
  const cardCs   = card ? window.getComputedStyle(card) : null;

  // Walk up to check for overflow:hidden ancestors
  const overflowParents = [];
  let el = wrapper.parentElement;
  while (el && el !== document.body) {
    const cs = window.getComputedStyle(el);
    if (cs.overflow === 'hidden' || cs.overflowX === 'hidden') {
      const r = el.getBoundingClientRect();
      overflowParents.push({ tag: el.tagName, clip: `${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.right)},${Math.round(r.bottom)}` });
    }
    el = el.parentElement;
  }

  return {
    found: true,
    wrapperOpacity: wcs.opacity,
    wrapperZIndex:  wcs.zIndex,
    wrapperRect:    { left: Math.round(wRect.left), top: Math.round(wRect.top), w: Math.round(wRect.width), h: Math.round(wRect.height) },
    cardRect:       cardRect ? { left: Math.round(cardRect.left), top: Math.round(cardRect.top), w: Math.round(cardRect.width), h: Math.round(cardRect.height) } : null,
    cardVisible:    cardRect ? (cardRect.left < 1440 && cardRect.right > 0 && cardRect.top < 900 && cardRect.bottom > 0) : false,
    cardZIndex:     cardCs ? cardCs.zIndex : null,
    overflowParents,
  };
});
const connFile = `${OUT}/connected-rect-probe.png`;
await cp.screenshot({ path: connFile });
console.log('tile-4 wrapper opacity:', rectResult.wrapperOpacity);
console.log('tile-4 wrapper rect:', JSON.stringify(rectResult.wrapperRect));
console.log('tile-4 card rect:', JSON.stringify(rectResult.cardRect));
console.log('tile-4 card in viewport:', rectResult.cardVisible);
console.log('overflow:hidden parents:', JSON.stringify(rectResult.overflowParents));
console.log(`screenshot: ${existsSync(connFile) ? statSync(connFile).size+'b' : 'MISSING'}`);
await cp.close();

// P-sweep: verify finale title opacity
console.log('\n=== FINALE TITLE P-SWEEP ===');
console.log('body_p\ttitle_opacity\ttitle_transform');
const sw = await b.newPage({ viewport: { width: 1440, height: 900 } });
await sw.emulateMedia({ reducedMotion: 'no-preference' });
await sw.goto(URL, { waitUntil: 'networkidle' });
for (const p of [C.pCallout_auditready, C.pFinale_spin, C.pFinale_title]) {
  await sw.evaluate(y => window.scrollTo(0, document.body.scrollHeight * y), p);
  await sw.waitForTimeout(700);
  const v = await sw.evaluate(() => {
    const el = document.querySelector('[data-finale-title]');
    if (!el) return { opacity: 'NO-EL', y: 'NO-EL' };
    const cs = window.getComputedStyle(el);
    return { opacity: cs.opacity, y: cs.transform };
  });
  console.log(`${p.toFixed(4)}\t${v.opacity}\t${v.y}`);
}
await sw.close();

// P-sweep: verify finale fires and no dead zone 0.90→1.0
console.log('\n=== FINALE PROGRESS SWEEP (0.90→1.00) ===');
console.log('target\tactual\tscrollY');
const fs = await b.newPage({ viewport: { width: 1440, height: 900 } });
await fs.emulateMedia({ reducedMotion: 'no-preference' });
await fs.goto(URL, { waitUntil: 'networkidle' });
for (let i = 0; i <= 10; i++) {
  const shieldP = 0.90 + i * 0.01;
  const bodyP = C.pFinale_early + (shieldP - 0.958) * ((C.pFinale_title - C.pFinale_early) / (0.99 - 0.958));
  const clampedBodyP = Math.max(C.pCallout_auditready, Math.min(0.9999, bodyP));
  await fs.evaluate(y => window.scrollTo(0, document.body.scrollHeight * y), clampedBodyP);
  await fs.waitForTimeout(600);
  const v = await fs.evaluate(() => {
    const shields = [...document.querySelectorAll('div')].find(el =>
      el.offsetHeight >= window.innerHeight * 6.5 && el.offsetHeight <= window.innerHeight * 8.5
    );
    const shieldP = shields
      ? Math.max(0, Math.min(1, -shields.getBoundingClientRect().top / (shields.offsetHeight - window.innerHeight)))
      : -1;
    return { shieldP: shieldP.toFixed(4), scrollY: window.scrollY };
  });
  console.log(`target=${shieldP.toFixed(2)}\tactual=${v.shieldP}\tscrollY=${v.scrollY}`);
}
await fs.close();

// === AUDIT-READY CALLOUT PROOF (tile-5 scroll sweep) ===
// Fixed scroll point at(0.84) misses tile-5's dwell window.
// Sweep at(0.72)→at(0.90) until opacity ≥ 0.9, then screenshot + inspect.
console.log('\n=== AUDIT-READY CALLOUT PROOF ===');
const ar = await b.newPage({ viewport: { width: 1440, height: 900 } });
await ar.emulateMedia({ reducedMotion: 'no-preference' });
await ar.goto(URL, { waitUntil: 'networkidle' });
// Warm up: scroll into the section so R3F frameloop is active
await ar.evaluate(y => window.scrollTo(0, document.body.scrollHeight * y), C.pCallout_unified);
await ar.waitForTimeout(800);

// Linear interpolation between calibration anchors
// at(0.69) = C.pCallout_connected,  at(0.958) = C.pFinale_early
const arSlope = (C.pFinale_early - C.pCallout_connected) / (0.958 - 0.69);
const arAt = frac => C.pCallout_connected + (frac - 0.69) * arSlope;

let arFoundFrac = -1;
for (let step = 0; step <= 18; step++) {
  const frac = 0.72 + step * 0.01; // at(0.72) → at(0.90)
  await ar.evaluate(y => window.scrollTo(0, document.body.scrollHeight * y), arAt(frac));
  await ar.waitForTimeout(500);
  const op = await ar.evaluate(() => {
    const el = document.querySelector('[data-callout-tile="5"]');
    return el ? parseFloat(window.getComputedStyle(el).opacity) : 0;
  });
  if (op >= 0.9) { arFoundFrac = frac; break; }
}

if (arFoundFrac < 0) {
  console.log('  BUG: tile-5 opacity never reached 0.9 across sweep at(0.72)→at(0.90) — real rendering bug');
} else {
  console.log(`  tile-5 opacity >= 0.9 found at shield-fraction ~${arFoundFrac.toFixed(2)}`);
  await ar.waitForTimeout(400);
  const arResult = await ar.evaluate(() => {
    const wrapper = document.querySelector('[data-callout-tile="5"]');
    if (!wrapper) return { found: false };
    const wOp = parseFloat(window.getComputedStyle(wrapper).opacity);
    const svg = wrapper.querySelector('svg');
    const svgRect = svg ? svg.getBoundingClientRect() : null;
    const lines = svg ? svg.querySelectorAll('line') : [];
    const card = wrapper.querySelector('div[style]');
    const cardRect = card ? card.getBoundingClientRect() : null;
    const vp = { w: window.innerWidth, h: window.innerHeight };
    return {
      wrapperOpacity: wOp.toFixed(3),
      leaderSvgPresent: !!svg,
      leaderSvgW: svgRect ? Math.round(svgRect.width) : 0,
      lineCount: lines.length,
      lineOffset: lines.length > 1 ? lines[1].getAttribute('stroke-dashoffset') : 'n/a',
      cardRect: cardRect ? { left: Math.round(cardRect.left), top: Math.round(cardRect.top), w: Math.round(cardRect.width), h: Math.round(cardRect.height) } : null,
      cardInViewport: cardRect ? cardRect.left < vp.w && cardRect.right > 0 && cardRect.top < vp.h && cardRect.bottom > 0 : false,
    };
  });
  console.log('  wrapper opacity:', arResult.wrapperOpacity);
  console.log('  leader SVG present:', arResult.leaderSvgPresent, '| SVG width:', arResult.leaderSvgW);
  console.log('  SVG line count:', arResult.lineCount, '| main-line stroke-dashoffset:', arResult.lineOffset);
  console.log('  card rect:', JSON.stringify(arResult.cardRect));
  console.log('  card in viewport:', arResult.cardInViewport);
}
const arFile = `${OUT}/callout-auditready-proof.png`;
await ar.screenshot({ path: arFile });
console.log(`  screenshot: ${existsSync(arFile) ? statSync(arFile).size+'b' : 'MISSING'}`);
await ar.close();

await b.close();
console.log('\n=== DONE -- open D:/Temp/claude/shots ===');

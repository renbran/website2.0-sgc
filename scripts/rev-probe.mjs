import { chromium } from '@playwright/test';
import { statSync, mkdirSync } from 'fs';

const URL = process.env.URL || 'http://localhost:3000';
const OUT = 'D:/Temp/claude/shots';
mkdirSync(OUT, { recursive: true });

const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 1440, height: 900 } });
await pg.emulateMedia({ reducedMotion: 'no-preference' });
await pg.goto(URL, { waitUntil: 'networkidle' });

const C = await pg.evaluate(() => {
  const el = [...document.querySelectorAll('div')].find(e =>
    e.offsetHeight >= window.innerHeight * 6.5 && e.offsetHeight <= window.innerHeight * 8.5
  );
  if (!el) return null;
  const h = el.offsetHeight;
  const top = el.getBoundingClientRect().top + window.scrollY;
  const range = h - window.innerHeight;
  const at = p => (top + p * range) / document.body.scrollHeight;
  return { at070: at(0.70), at085: at(0.85), at090: at(0.90), at095: at(0.95), at097: at(0.97), at100: at(1.0) };
});

if (!C) { console.error('CALIBRATION FAILED'); process.exit(1); }

// Warm up the section, then scroll to end
await pg.evaluate(y => window.scrollTo(0, document.body.scrollHeight * y), C.at085);
await pg.waitForTimeout(600);
await pg.evaluate(y => window.scrollTo(0, document.body.scrollHeight * y), C.at100);
await pg.waitForTimeout(2000);

console.log('=== REVERSE SWEEP (forward→backward) ===');
console.log('p\t\trotY\t\theadline\t\t\tsubOp');

const points = [
  ['1.00', C.at100],
  ['0.97', C.at097],
  ['0.95', C.at095],
  ['0.90', C.at090],
  ['0.85', C.at085],
  ['0.70', C.at070],
];

for (const [label, bodyP] of points) {
  await pg.evaluate(y => window.scrollTo(0, document.body.scrollHeight * y), bodyP);
  await pg.waitForTimeout(800);

  const v = await pg.evaluate(() => {
    const rotY = window.__finaleRotY;

    // Find desktop title container by style (top:28%, left:7%)
    const titleDiv = [...document.querySelectorAll('div[style]')].find(el =>
      el.style.top === '28%' && el.style.left === '7%'
    );

    let headText = '(not found)';
    if (titleDiv) {
      const wordSpans = titleDiv.querySelectorAll('span > span');
      headText = [...wordSpans].map(s => s.textContent ?? '').join('');
      if (!headText) headText = '(empty)';
    }

    const sub = document.querySelector('[data-finale-title]');
    const subOp = sub ? parseFloat(window.getComputedStyle(sub).opacity).toFixed(2) : 'N/A';

    return {
      rotY: rotY !== undefined ? Number(rotY).toFixed(3) : 'N/A',
      headText,
      subOp,
    };
  });

  const file = `${OUT}/rev-sweep-p${label.replace('.', '')}.png`;
  await pg.screenshot({ path: file });
  const sz = statSync(file).size;
  console.log(`p=${label}\trotY=${v.rotY}\t"${v.headText}"\tsubOp=${v.subOp}\t(${sz}b)`);
}

await b.close();
console.log('\nDONE');

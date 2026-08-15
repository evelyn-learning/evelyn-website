/**
 * Doppler A/B probe: run the REAL Haiku doodler on the Doppler-effect concept
 * N times, render each result, and screenshot to a PNG grid for eyeballing.
 *
 * Run BEFORE the concentric-primitive change (baseline = raw-primitive blob) and
 * AFTER (with the `concentric` primitive) to compare quality on the same concept.
 *
 * Usage: npx tsx scripts/sketch-doppler-ab.ts <label>
 *   e.g. npx tsx scripts/sketch-doppler-ab.ts before
 */
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { chromium } from 'playwright';
import { generateDoodle } from '../src/lib/tutor/whiteboard/doodler';
import { sketchToSvgString } from '../src/lib/tutor/whiteboard/sketch-render-core';

const OUT_DIR =
  '/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/d8c1f850-7170-4749-82b2-c44d6bef1efc/scratchpad';

const LABEL = process.argv[2] || 'run';
const SAMPLES = 4;

const CONCEPT =
  'the Doppler effect: a sound source moving to the right, its sound wavefronts bunched together (compressed) ahead of it and spread out (stretched) behind it';
const LABELS = ['compressed (high pitch)', 'moving source', 'stretched (low pitch)'];

(async () => {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set — aborting.');
    process.exit(1);
  }

  const results = await Promise.all(
    Array.from({ length: SAMPLES }, async (_, i) => {
      const t0 = Date.now();
      try {
        const { primitives, abstained, usage } = await generateDoodle(CONCEPT, LABELS);
        const ms = Date.now() - t0;
        const status = abstained ? 'ABSTAIN' : primitives ? `${String(primitives.length).padStart(2)} prims` : 'NULL   ';
        console.log(`#${i} ${status} | ${String(ms).padStart(5)}ms | out=${usage?.outputTokens ?? '?'}`);
        return { i, primitives, abstained, ms };
      } catch (e) {
        console.error(`#${i} ERROR | ${(e as Error).message}`);
        return { i, primitives: null, abstained: false, ms: Date.now() - t0 };
      }
    }),
  );

  const cards = results.map((r) => {
    const body = r.abstained
      ? '<div style="color:#d97706;font-weight:600">ABSTAIN → fallback card</div>'
      : r.primitives
        ? sketchToSvgString(r.primitives)
        : '<div style="color:#dc2626">NULL (fail-to-nothing)</div>';
    return `<div class="card"><h3>sample #${r.i}</h3><div class="meta">${r.abstained ? 'abstained' : `${r.primitives?.length ?? 0} prims`} · ${r.ms}ms</div><div class="frame">${body}</div></div>`;
  });

  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    body{margin:0;background:#fff;font-family:sans-serif;padding:20px}
    h1{font-size:15px;color:#111}
    .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}
    .card h3{margin:0 0 2px;font-size:12px;color:#111}
    .card .meta{font-size:10px;color:#6b7280;margin-bottom:6px}
    .frame{border:1px solid #e5e7eb;border-radius:8px;padding:10px;height:320px;display:flex;align-items:center;justify-content:center}
    svg{width:100%;height:auto;max-height:300px}
  </style></head><body>
    <h1>Doppler effect — doodler output [${LABEL}]</h1>
    <div class="grid">${cards.join('')}</div>
  </body></html>`;

  const htmlPath = path.join(OUT_DIR, `doppler-${LABEL}.html`);
  fs.writeFileSync(htmlPath, html);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1000, height: 780 }, deviceScaleFactor: 2 });
  await page.goto('file://' + htmlPath);
  await page.waitForTimeout(200);
  const pngPath = path.join(OUT_DIR, `doppler-${LABEL}.png`);
  await page.screenshot({ path: pngPath, fullPage: true });
  await browser.close();
  console.log('\nwrote', pngPath);
})();

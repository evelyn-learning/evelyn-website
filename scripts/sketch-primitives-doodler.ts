/**
 * Exercise the REAL Haiku doodler on one representative concept per new
 * primitive, render each result, and screenshot to a PNG grid for eyeballing.
 *
 * Loads env from the MAIN checkout (.env.local is gitignored / not in the
 * worktree) so ANTHROPIC_API_KEY is available.
 *
 * Usage: npx tsx scripts/sketch-primitives-doodler.ts
 * Output: scratchpad/primitives-doodler.png
 */
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: '/Users/luke/Dev/evelynlearning/.env.local' });

import { chromium } from 'playwright';
import { generateDoodle } from '../apps/marketing/src/lib/tutor/whiteboard/doodler';
import { sketchToSvgString } from '../apps/marketing/src/lib/tutor/whiteboard/sketch-render-core';

const OUT_DIR =
  '/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/d8c1f850-7170-4749-82b2-c44d6bef1efc/scratchpad';

const PROBES: { primitive: string; concept: string; labels: string[] }[] = [
  { primitive: 'spring', concept: 'a mass on a spring bouncing up and down', labels: ['mass', 'spring'] },
  { primitive: 'wave', concept: 'a transverse wave traveling along a string', labels: ['wavelength', 'amplitude'] },
  { primitive: 'stick_figure', concept: 'a person skiing down a slope', labels: ['skier'] },
  { primitive: 'container_fill', concept: 'a beaker about half full of water', labels: ['water'] },
];

(async () => {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set — aborting.');
    process.exit(1);
  }

  const results = await Promise.all(
    PROBES.map(async (probe) => {
      const t0 = Date.now();
      try {
        const { primitives, abstained, usage } = await generateDoodle(probe.concept, probe.labels);
        const ms = Date.now() - t0;
        const types = primitives ? Array.from(new Set(primitives.map((p) => p.type))).join(', ') : '—';
        const status = abstained ? 'ABSTAIN' : primitives ? `${primitives.length} prims` : 'NULL';
        console.log(`[${probe.primitive}] ${status} | ${ms}ms | out=${usage?.outputTokens ?? '?'} | types: ${types}`);
        const usedTarget = primitives?.some((p) => p.type === probe.primitive) ?? false;
        return { ...probe, primitives, abstained, ms, usedTarget };
      } catch (e) {
        console.error(`[${probe.primitive}] ERROR | ${(e as Error).message}`);
        return { ...probe, primitives: null, abstained: false, ms: Date.now() - t0, usedTarget: false };
      }
    }),
  );

  const cards = results.map((r) => {
    const body = r.abstained
      ? '<div style="color:#d97706;font-weight:600">ABSTAIN → fallback card</div>'
      : r.primitives
        ? sketchToSvgString(r.primitives)
        : '<div style="color:#dc2626">NULL (fail-to-nothing)</div>';
    const badge = r.usedTarget
      ? `<span style="color:#16a34a">✓ used ${r.primitive}</span>`
      : `<span style="color:#dc2626">✗ did NOT use ${r.primitive}</span>`;
    return `<div class="card"><h3>${r.primitive}</h3><div class="meta">"${r.concept}" · ${r.primitives?.length ?? 0} prims · ${r.ms}ms · ${badge}</div><div class="frame">${body}</div></div>`;
  });

  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    body{margin:0;background:#fff;font-family:sans-serif;padding:20px}
    h1{font-size:15px;color:#111}
    .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}
    .card h3{margin:0 0 2px;font-size:12px;color:#111}
    .card .meta{font-size:10px;color:#6b7280;margin-bottom:6px}
    .frame{border:1px solid #e5e7eb;border-radius:8px;padding:10px;height:340px;display:flex;align-items:center;justify-content:center}
    svg{width:100%;height:auto;max-height:320px}
  </style></head><body>
    <h1>New primitives — real Haiku doodler output</h1>
    <div class="grid">${cards.join('')}</div>
  </body></html>`;

  const htmlPath = path.join(OUT_DIR, 'primitives-doodler.html');
  fs.writeFileSync(htmlPath, html);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1000, height: 820 }, deviceScaleFactor: 2 });
  await page.goto('file://' + htmlPath);
  await page.waitForTimeout(200);
  const pngPath = path.join(OUT_DIR, 'primitives-doodler.png');
  await page.screenshot({ path: pngPath, fullPage: true });
  await browser.close();
  console.log('\nwrote', pngPath);
})();

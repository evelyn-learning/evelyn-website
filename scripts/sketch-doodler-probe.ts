/**
 * Phase-1 probe: exercise the REAL Haiku doodler on the flagged analogies plus
 * novel concepts (to check generalization beyond the few-shot), render each, and
 * screenshot to a PNG grid for eyeballing.
 *
 * Usage: TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register \
 *   --compiler-options '{"module":"commonjs","baseUrl":"./"}' scripts/sketch-doodler-probe.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { chromium } from 'playwright';
import { generateDoodle } from '../apps/marketing/src/lib/tutor/whiteboard/doodler';
import { sketchToSvgString } from '../apps/marketing/src/lib/tutor/whiteboard/sketch-render-core';

const OUT_DIR =
  '/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/eef0f93c-2529-4cf5-a783-e7aa5c6bf075/scratchpad';

// The exact concepts the brain produced in the 2026-06-23 ear-tests (energy +
// electricity) — the doodles the user flagged. Re-render after the prompt+few-shot
// fix to compare the coaster / falling-ball / staircase quality.
const PROBES: { concept: string; labels: string[] }[] = [
  { concept: 'a pendulum: a bob on a string from a pivot, swinging between a high side and the low middle', labels: ['high: PE', 'low: KE'] },
  { concept: 'a skier going down a snowy slope from the top to the bottom', labels: ['top: high PE', 'bottom: high KE'] },
  { concept: 'a water pipe with water flowing through it past a cross-section', labels: ['current = flow per second'] },
  { concept: 'a crowded hallway with students walking through a doorway, one by one', labels: ['more students = more current'] },
  { concept: 'a line of people: each person asks the one behind them, and the answer passes back up the line', labels: ['ask behind', 'pass back', "I'm last = 1"] },
  { concept: 'russian nesting dolls, each opening to reveal a smaller doll inside, down to the smallest', labels: ['big', 'smaller', 'smallest = base case'] },
];

(async () => {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set — aborting.');
    process.exit(1);
  }

  const results = await Promise.all(
    PROBES.map(async (p) => {
      const t0 = Date.now();
      try {
        const { primitives, usage } = await generateDoodle(p.concept, p.labels);
        const ms = Date.now() - t0;
        console.log(
          `${primitives ? `${String(primitives.length).padStart(2)} prims` : 'NULL   '} | ${String(ms).padStart(5)}ms | out=${usage?.outputTokens ?? '?'} | ${p.concept.slice(0, 55)}`,
        );
        return { ...p, primitives, ms };
      } catch (e) {
        console.error(`ERROR | ${p.concept.slice(0, 55)} | ${(e as Error).message}`);
        return { ...p, primitives: null, ms: Date.now() - t0 };
      }
    }),
  );

  const cards = results.map((r) => {
    const svg = r.primitives ? sketchToSvgString(r.primitives) : '<div style="color:#dc2626">NULL (fail-to-nothing)</div>';
    return `<div class="card"><h3>${r.concept}</h3><div class="meta">${r.primitives?.length ?? 0} prims · ${r.ms}ms · labels: ${r.labels.join(', ')}</div><div class="frame">${svg}</div></div>`;
  });

  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    body{margin:0;background:#fff;font-family:sans-serif;display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:20px}
    .card h3{margin:0 0 2px;font-size:12px;color:#111}
    .card .meta{font-size:10px;color:#6b7280;margin-bottom:6px}
    .frame{border:1px solid #e5e7eb;border-radius:8px;padding:10px;height:300px;display:flex;align-items:center;justify-content:center}
    svg{width:100%;height:auto;max-height:280px}
  </style></head><body>${cards.join('')}</body></html>`;

  const htmlPath = path.join(OUT_DIR, 'doodler-probe.html');
  fs.writeFileSync(htmlPath, html);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 760 }, deviceScaleFactor: 2 });
  await page.goto('file://' + htmlPath);
  await page.waitForTimeout(200);
  const pngPath = path.join(OUT_DIR, 'doodler-probe.png');
  await page.screenshot({ path: pngPath, fullPage: true });
  await browser.close();
  console.log('\nwrote', pngPath);
})();

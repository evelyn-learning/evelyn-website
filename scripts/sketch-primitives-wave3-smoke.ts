/**
 * Visual smoke for the 4 Wave-3 "smart primitives" (pulley, lever, gauge, axis):
 * render each hand-authored exemplar + a few variants to a PNG grid for eyeballing.
 *
 * Usage: npx tsx scripts/sketch-primitives-wave3-smoke.ts
 * Output: scratchpad/primitives-wave3-exemplars.png
 */
import * as fs from 'fs';
import * as path from 'path';
import { chromium } from 'playwright';
import { sketchToSvgString } from '../apps/marketing/src/lib/tutor/whiteboard/sketch-render-core';
import {
  PULLEY_LIFT, LEVER_BALANCE, SPEEDOMETER, NUMBER_LINE,
} from '../apps/marketing/src/lib/tutor/whiteboard/sketch-examples';
import type { SketchPrimitive } from '../apps/marketing/src/lib/tutor/whiteboard/sketch-schema';

const OUT_DIR =
  '/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/d8c1f850-7170-4749-82b2-c44d6bef1efc/scratchpad';

// pulley ropeDir sampler
const pulleys: SketchPrimitive[][] = (['both', 'left', 'right'] as const).map((ropeDir) => [
  { type: 'pulley', cx: 50, cy: 32, r: 16, ropeDir, stroke: 'ink', strokeWidth: 1.4 },
  { type: 'label', x: 50, y: 92, text: ropeDir, fontSize: 6, stroke: 'gray', anchor: 'middle' },
]);

// lever tilt sampler
const levers: SketchPrimitive[][] = ([-18, 0, 18] as const).map((tilt) => [
  { type: 'lever', x: 50, y: 52, length: 78, pivotFrac: 0.5, tilt, stroke: 'ink', strokeWidth: 1.5 },
  { type: 'label', x: 50, y: 90, text: `tilt ${tilt}°`, fontSize: 6, stroke: 'gray', anchor: 'middle' },
]);

// lever off-center pivot (mechanical advantage)
const leverOffset: SketchPrimitive[][] = [[
  { type: 'lever', x: 50, y: 52, length: 82, pivotFrac: 0.28, tilt: 0, stroke: 'ink', strokeWidth: 1.5 },
  { type: 'label', x: 50, y: 90, text: 'pivot 0.28', fontSize: 6, stroke: 'gray', anchor: 'middle' },
]];

// gauge frac sampler
const gauges: SketchPrimitive[][] = ([0.15, 0.5, 0.85] as const).map((frac) => [
  { type: 'gauge', cx: 50, cy: 58, r: 32, frac, stroke: 'ink', strokeWidth: 1.4, label: `${Math.round(frac * 100)}%` },
]);

// axis sampler
const axes: SketchPrimitive[][] = [
  [{ type: 'axis', x1: 10, y1: 50, x2: 90, y2: 50, ticks: 6, labels: ['0', '2', '4', '6', '8', '10'], stroke: 'ink', strokeWidth: 1.4 },
   { type: 'label', x: 50, y: 88, text: 'number line', fontSize: 6, stroke: 'gray', anchor: 'middle' }],
  [{ type: 'axis', x1: 12, y1: 50, x2: 88, y2: 50, ticks: 5, labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], stroke: 'blue', strokeWidth: 1.4 },
   { type: 'label', x: 50, y: 88, text: 'timeline', fontSize: 6, stroke: 'gray', anchor: 'middle' }],
];

const cards: { title: string; svg: string }[] = [
  { title: 'PULLEY_LIFT (exemplar)', svg: sketchToSvgString(PULLEY_LIFT) },
  { title: 'LEVER_BALANCE (exemplar)', svg: sketchToSvgString(LEVER_BALANCE) },
  { title: 'SPEEDOMETER (exemplar)', svg: sketchToSvgString(SPEEDOMETER) },
  { title: 'NUMBER_LINE (exemplar)', svg: sketchToSvgString(NUMBER_LINE) },
  ...pulleys.map((p, i) => ({ title: `pulley — ${(['both', 'left', 'right'] as const)[i]}`, svg: sketchToSvgString(p) })),
  ...levers.map((p, i) => ({ title: `lever — tilt ${[-18, 0, 18][i]}°`, svg: sketchToSvgString(p) })),
  ...leverOffset.map((p) => ({ title: 'lever — off-center pivot', svg: sketchToSvgString(p) })),
  ...gauges.map((p, i) => ({ title: `gauge — ${[15, 50, 85][i]}%`, svg: sketchToSvgString(p) })),
  ...axes.map((p, i) => ({ title: `axis — ${['number line', 'timeline'][i]}`, svg: sketchToSvgString(p) })),
];

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;background:#fff;font-family:sans-serif;padding:20px}
  h1{font-size:15px;color:#111}
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
  .card h3{margin:0 0 6px;font-size:11px;color:#374151}
  .frame{border:1px solid #e5e7eb;border-radius:8px;padding:10px}
  svg{width:100%;height:auto}
</style></head><body>
  <h1>Wave-3 smart primitives — hand-authored exemplars + variants</h1>
  <div class="grid">
  ${cards.map((c) => `<div class="card"><h3>${c.title}</h3><div class="frame">${c.svg}</div></div>`).join('')}
  </div>
</body></html>`;

(async () => {
  const htmlPath = path.join(OUT_DIR, 'primitives-wave3-exemplars.html');
  fs.writeFileSync(htmlPath, html);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + htmlPath);
  await page.waitForTimeout(200);
  const pngPath = path.join(OUT_DIR, 'primitives-wave3-exemplars.png');
  await page.screenshot({ path: pngPath, fullPage: true });
  await browser.close();
  console.log('wrote', pngPath);
})();

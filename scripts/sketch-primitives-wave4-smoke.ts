/**
 * Visual smoke for the 4 Wave-4 "smart primitives" (coordinate_grid, orbit,
 * molecule, bar_compare): render each hand-authored exemplar + a few variants to
 * a PNG grid for eyeballing.
 *
 * Usage: npx tsx scripts/sketch-primitives-wave4-smoke.ts
 * Output: scratchpad/primitives-wave4-exemplars.png
 */
import * as fs from 'fs';
import * as path from 'path';
import { chromium } from 'playwright';
import { sketchToSvgString } from '../src/lib/tutor/whiteboard/sketch-render-core';
import {
  PLOT_POINT, PLANET_ORBIT, WATER_MOLECULE, BAR_HEIGHTS,
} from '../src/lib/tutor/whiteboard/sketch-examples';
import type { SketchPrimitive } from '../src/lib/tutor/whiteboard/sketch-schema';

const OUT_DIR =
  '/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/d8c1f850-7170-4749-82b2-c44d6bef1efc/scratchpad';

// coordinate_grid: 4-quadrant vs 1-quadrant
const grids: SketchPrimitive[][] = [
  [{ type: 'coordinate_grid', x: 18, y: 16, w: 64, h: 64, quadrants: 4, xLabel: 'x', yLabel: 'y', stroke: 'ink', strokeWidth: 1.3 },
   { type: 'ellipse', cx: 65, cy: 26, rx: 2.6, ry: 2.6, stroke: 'red', fill: 'red' }],
  [{ type: 'coordinate_grid', x: 18, y: 12, w: 64, h: 64, quadrants: 1, xLabel: 'time', yLabel: 'dist', stroke: 'blue', strokeWidth: 1.3 }],
];

// orbit: satellite at a few angles
const orbits: SketchPrimitive[][] = ([-35, 90, 200] as const).map((angle) => [
  { type: 'orbit', cx: 50, cy: 50, rx: 34, ry: 20, angle, centerLabel: 'sun', satelliteLabel: 'planet', stroke: 'blue', fill: 'amber', strokeWidth: 1.2 },
  { type: 'label', x: 50, y: 92, text: `angle ${angle}°`, fontSize: 5, stroke: 'gray', anchor: 'middle' },
]);

// molecule: water (bent) + CO2 (double bonds, linear)
const molecules: SketchPrimitive[][] = [
  [{ type: 'molecule',
    atoms: [{ x: 50, y: 42, label: 'O' }, { x: 34, y: 60, label: 'H' }, { x: 66, y: 60, label: 'H' }],
    bonds: [{ a: 0, b: 1, order: 1 }, { a: 0, b: 2, order: 1 }], stroke: 'ink', strokeWidth: 1.3 },
   { type: 'label', x: 50, y: 82, text: 'H₂O', fontSize: 5.5, stroke: 'blue', anchor: 'middle' }],
  [{ type: 'molecule',
    atoms: [{ x: 26, y: 50, label: 'O' }, { x: 50, y: 50, label: 'C' }, { x: 74, y: 50, label: 'O' }],
    bonds: [{ a: 0, b: 1, order: 2 }, { a: 1, b: 2, order: 2 }], stroke: 'ink', strokeWidth: 1.3 },
   { type: 'label', x: 50, y: 78, text: 'CO₂ (double bonds)', fontSize: 5, stroke: 'blue', anchor: 'middle' }],
];

// bar_compare: a few value sets
const barsets: SketchPrimitive[][] = [
  [{ type: 'bar_compare', x: 20, y: 22, w: 60, h: 52, values: [3, 7, 5], labels: ['A', 'B', 'C'], stroke: 'ink', fill: 'blue', strokeWidth: 1.3 }],
  [{ type: 'bar_compare', x: 16, y: 22, w: 68, h: 52, values: [8, 2, 5, 9, 4], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], stroke: 'ink', fill: 'green', strokeWidth: 1.2 }],
];

const cards: { title: string; svg: string }[] = [
  { title: 'PLOT_POINT (exemplar)', svg: sketchToSvgString(PLOT_POINT) },
  { title: 'PLANET_ORBIT (exemplar)', svg: sketchToSvgString(PLANET_ORBIT) },
  { title: 'WATER_MOLECULE (exemplar)', svg: sketchToSvgString(WATER_MOLECULE) },
  { title: 'BAR_HEIGHTS (exemplar)', svg: sketchToSvgString(BAR_HEIGHTS) },
  ...grids.map((p, i) => ({ title: `coordinate_grid — ${['4-quadrant', '1-quadrant'][i]}`, svg: sketchToSvgString(p) })),
  ...orbits.map((p, i) => ({ title: `orbit — angle ${[-35, 90, 200][i]}°`, svg: sketchToSvgString(p) })),
  ...molecules.map((p, i) => ({ title: `molecule — ${['H₂O', 'CO₂'][i]}`, svg: sketchToSvgString(p) })),
  ...barsets.map((p, i) => ({ title: `bar_compare — ${['3 bars', '5 bars'][i]}`, svg: sketchToSvgString(p) })),
];

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;background:#fff;font-family:sans-serif;padding:20px}
  h1{font-size:15px;color:#111}
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
  .card h3{margin:0 0 6px;font-size:11px;color:#374151}
  .frame{border:1px solid #e5e7eb;border-radius:8px;padding:10px}
  svg{width:100%;height:auto}
</style></head><body>
  <h1>Wave-4 smart primitives — hand-authored exemplars + variants</h1>
  <div class="grid">
  ${cards.map((c) => `<div class="card"><h3>${c.title}</h3><div class="frame">${c.svg}</div></div>`).join('')}
  </div>
</body></html>`;

(async () => {
  const htmlPath = path.join(OUT_DIR, 'primitives-wave4-exemplars.html');
  fs.writeFileSync(htmlPath, html);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + htmlPath);
  await page.waitForTimeout(200);
  const pngPath = path.join(OUT_DIR, 'primitives-wave4-exemplars.png');
  await page.screenshot({ path: pngPath, fullPage: true });
  await browser.close();
  console.log('wrote', pngPath);
})();

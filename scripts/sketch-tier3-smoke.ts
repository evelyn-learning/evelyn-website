/**
 * Visual smoke for the 6 Tier-3 "smart primitives" (vector, grid, brace, arc,
 * blob, dots_cluster): render each hand-authored exemplar + a few variants to a
 * PNG grid for eyeballing.
 *
 * Usage: npx tsx scripts/sketch-tier3-smoke.ts
 * Output: scratchpad/tier3-exemplars.png
 */
import * as fs from 'fs';
import * as path from 'path';
import { chromium } from 'playwright';
import { sketchToSvgString } from '../apps/marketing/src/lib/tutor/whiteboard/sketch-render-core';
import {
  TORQUE, TEN_FRAME, WAVELENGTH_BRACE, PENDULUM, GAS_CLOUD, MOLECULES_BOX,
} from '../apps/marketing/src/lib/tutor/whiteboard/sketch-examples';
import type { SketchPrimitive } from '../apps/marketing/src/lib/tutor/whiteboard/sketch-schema';

const OUT_DIR =
  '/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/d8c1f850-7170-4749-82b2-c44d6bef1efc/scratchpad';

// vector style sampler
const vectors: SketchPrimitive[][] = (['single', 'double', 'curved', 'block'] as const).map((style) => [
  { type: 'vector', x1: 18, y1: 50, x2: 78, y2: 50, style, stroke: 'ink', strokeWidth: 1.4, label: style },
]);

// grid style sampler
const grids: SketchPrimitive[][] = (['lines', 'dots', 'boxes'] as const).map((style) => [
  { type: 'grid', x: 24, y: 30, cols: 4, rows: 4, cell: 12, style, fillCount: style === 'boxes' ? 6 : 0, fill: 'blue', stroke: 'ink', strokeWidth: 1.1 },
  { type: 'label', x: 50, y: 90, text: style, fontSize: 6, stroke: 'gray', anchor: 'middle' },
]);

// brace side sampler
const braces: SketchPrimitive[][] = (['top', 'bottom', 'left', 'right'] as const).map((side) => {
  const span: SketchPrimitive = side === 'left' || side === 'right'
    ? { type: 'brace', x1: 50, y1: 24, x2: 50, y2: 74, side, stroke: 'ink', strokeWidth: 1.2, label: side }
    : { type: 'brace', x1: 22, y1: 50, x2: 78, y2: 50, side, stroke: 'ink', strokeWidth: 1.2, label: side };
  return [span];
});

// arc sweep sampler
const arcs: SketchPrimitive[][] = [
  [{ type: 'arc', cx: 50, cy: 50, r: 34, startAngle: 200, endAngle: 340, stroke: 'blue', strokeWidth: 1.4 },
   { type: 'label', x: 50, y: 92, text: 'shallow arc', fontSize: 6, stroke: 'gray', anchor: 'middle' }],
  [{ type: 'arc', cx: 50, cy: 50, r: 34, startAngle: 30, endAngle: 320, stroke: 'red', strokeWidth: 1.4 },
   { type: 'label', x: 50, y: 92, text: 'wide arc', fontSize: 6, stroke: 'gray', anchor: 'middle' }],
];

// blob wobble sampler
const blobs: SketchPrimitive[][] = [
  [{ type: 'blob', cx: 50, cy: 48, rx: 32, ry: 22, wobble: 0.15, stroke: 'gray', fill: 'gray' },
   { type: 'label', x: 50, y: 90, text: 'wobble 0.15', fontSize: 6, stroke: 'ink', anchor: 'middle' }],
  [{ type: 'blob', cx: 50, cy: 48, rx: 32, ry: 22, wobble: 0.45, stroke: 'green', strokeWidth: 1.3 },
   { type: 'label', x: 50, y: 90, text: 'wobble 0.45 (outline)', fontSize: 6, stroke: 'ink', anchor: 'middle' }],
];

// dots_cluster density sampler
const clusters: SketchPrimitive[][] = [
  [{ type: 'dots_cluster', cx: 50, cy: 48, count: 12, spread: 26, stroke: 'blue', fill: 'blue' },
   { type: 'label', x: 50, y: 90, text: '12 dots', fontSize: 6, stroke: 'ink', anchor: 'middle' }],
  [{ type: 'dots_cluster', cx: 50, cy: 48, count: 45, spread: 30, stroke: 'red', fill: 'red' },
   { type: 'label', x: 50, y: 90, text: '45 dots', fontSize: 6, stroke: 'ink', anchor: 'middle' }],
];

const cards: { title: string; svg: string }[] = [
  { title: 'TORQUE (exemplar)', svg: sketchToSvgString(TORQUE) },
  { title: 'TEN_FRAME (exemplar)', svg: sketchToSvgString(TEN_FRAME) },
  { title: 'WAVELENGTH_BRACE (exemplar)', svg: sketchToSvgString(WAVELENGTH_BRACE) },
  { title: 'PENDULUM (exemplar)', svg: sketchToSvgString(PENDULUM) },
  { title: 'GAS_CLOUD (exemplar)', svg: sketchToSvgString(GAS_CLOUD) },
  { title: 'MOLECULES_BOX (exemplar)', svg: sketchToSvgString(MOLECULES_BOX) },
  ...vectors.map((p, i) => ({ title: `vector — ${(['single', 'double', 'curved', 'block'] as const)[i]}`, svg: sketchToSvgString(p) })),
  ...grids.map((p, i) => ({ title: `grid — ${(['lines', 'dots', 'boxes'] as const)[i]}`, svg: sketchToSvgString(p) })),
  ...braces.map((p, i) => ({ title: `brace — ${(['top', 'bottom', 'left', 'right'] as const)[i]}`, svg: sketchToSvgString(p) })),
  ...arcs.map((p, i) => ({ title: `arc — ${['shallow', 'wide'][i]}`, svg: sketchToSvgString(p) })),
  ...blobs.map((p, i) => ({ title: `blob — ${['smooth', 'lumpy'][i]}`, svg: sketchToSvgString(p) })),
  ...clusters.map((p, i) => ({ title: `dots_cluster — ${['sparse', 'dense'][i]}`, svg: sketchToSvgString(p) })),
];

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;background:#fff;font-family:sans-serif;padding:20px}
  h1{font-size:15px;color:#111}
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
  .card h3{margin:0 0 6px;font-size:11px;color:#374151}
  .frame{border:1px solid #e5e7eb;border-radius:8px;padding:10px}
  svg{width:100%;height:auto}
</style></head><body>
  <h1>Tier-3 smart primitives — hand-authored exemplars + variants</h1>
  <div class="grid">
  ${cards.map((c) => `<div class="card"><h3>${c.title}</h3><div class="frame">${c.svg}</div></div>`).join('')}
  </div>
</body></html>`;

(async () => {
  const htmlPath = path.join(OUT_DIR, 'tier3-exemplars.html');
  fs.writeFileSync(htmlPath, html);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + htmlPath);
  await page.waitForTimeout(200);
  const pngPath = path.join(OUT_DIR, 'tier3-exemplars.png');
  await page.screenshot({ path: pngPath, fullPage: true });
  await browser.close();
  console.log('wrote', pngPath);
})();

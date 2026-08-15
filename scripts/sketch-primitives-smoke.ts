/**
 * Visual smoke for the 4 new parametric sketch primitives: render each hand-
 * authored exemplar (and a couple of pose/shape variants) to a PNG grid.
 *
 * Usage: npx tsx scripts/sketch-primitives-smoke.ts
 * Output: scratchpad/primitives-exemplars.png
 */
import * as fs from 'fs';
import * as path from 'path';
import { chromium } from 'playwright';
import { sketchToSvgString } from '../apps/marketing/src/lib/tutor/whiteboard/sketch-render-core';
import {
  SPRING_MASS, TRANSVERSE_WAVE, SKIER, BEAKER_HALF,
} from '../apps/marketing/src/lib/tutor/whiteboard/sketch-examples';
import type { SketchPrimitive } from '../apps/marketing/src/lib/tutor/whiteboard/sketch-schema';

const OUT_DIR =
  '/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/d8c1f850-7170-4749-82b2-c44d6bef1efc/scratchpad';

// stick-figure pose sampler
const poses: SketchPrimitive[][] = (['stand', 'walk', 'run', 'point', 'arms-up'] as const).map((pose) => [
  { type: 'stick_figure', x: 50, y: 50, scale: 60, pose, stroke: 'ink', strokeWidth: 1.4 },
  { type: 'label', x: 50, y: 92, text: pose, fontSize: 6, stroke: 'gray', anchor: 'middle' },
]);

// container-shape sampler
const shapes: SketchPrimitive[][] = (['tank', 'beaker', 'battery', 'thermometer'] as const).map((shape) => [
  { type: 'container_fill', x: 34, y: 22, w: 32, h: 54, fillFrac: 0.6, shape, stroke: 'ink', strokeWidth: 1.2 },
  { type: 'label', x: 50, y: 92, text: shape, fontSize: 6, stroke: 'gray', anchor: 'middle' },
]);

const damped: SketchPrimitive[] = [
  { type: 'wave', x1: 8, y1: 50, x2: 92, y2: 50, cycles: 4, amplitude: 22, damping: 0.7, stroke: 'red', strokeWidth: 1.3 },
  { type: 'label', x: 50, y: 90, text: 'damped', fontSize: 6, stroke: 'gray', anchor: 'middle' },
];

const cards: { title: string; svg: string }[] = [
  { title: 'SPRING_MASS (exemplar)', svg: sketchToSvgString(SPRING_MASS) },
  { title: 'TRANSVERSE_WAVE (exemplar)', svg: sketchToSvgString(TRANSVERSE_WAVE) },
  { title: 'SKIER (exemplar)', svg: sketchToSvgString(SKIER) },
  { title: 'BEAKER_HALF (exemplar)', svg: sketchToSvgString(BEAKER_HALF) },
  { title: 'wave — damped', svg: sketchToSvgString(damped) },
  ...poses.map((p, i) => ({ title: `stick_figure — ${(['stand', 'walk', 'run', 'point', 'arms-up'] as const)[i]}`, svg: sketchToSvgString(p) })),
  ...shapes.map((p, i) => ({ title: `container_fill — ${(['tank', 'beaker', 'battery', 'thermometer'] as const)[i]}`, svg: sketchToSvgString(p) })),
];

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;background:#fff;font-family:sans-serif;padding:20px}
  h1{font-size:15px;color:#111}
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
  .card h3{margin:0 0 6px;font-size:11px;color:#374151}
  .frame{border:1px solid #e5e7eb;border-radius:8px;padding:10px}
  svg{width:100%;height:auto}
</style></head><body>
  <h1>New sketch primitives — hand-authored exemplars + variants</h1>
  <div class="grid">
  ${cards.map((c) => `<div class="card"><h3>${c.title}</h3><div class="frame">${c.svg}</div></div>`).join('')}
  </div>
</body></html>`;

(async () => {
  const htmlPath = path.join(OUT_DIR, 'primitives-exemplars.html');
  fs.writeFileSync(htmlPath, html);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + htmlPath);
  await page.waitForTimeout(200);
  const pngPath = path.join(OUT_DIR, 'primitives-exemplars.png');
  await page.screenshot({ path: pngPath, fullPage: true });
  await browser.close();
  console.log('wrote', pngPath);
})();

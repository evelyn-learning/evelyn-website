/**
 * Regenerates sketch-review/index.html — a browsable gallery of every sketch
 * primitive, one inline-SVG card per SKETCH_FEWSHOT exemplar plus an all-icons
 * grid. Inline SVG (no external PNG files, no CSP issues), so the file is
 * self-contained. Run after any sketch-primitive change:
 *
 *   npm run sketch-gallery
 *
 * (Standing request: tutor sketches always go here for review.)
 */
import * as fs from 'fs';
import * as path from 'path';
import { sketchToSvgString } from '../src/lib/tutor/whiteboard/sketch-render-core';
import { SKETCH_FEWSHOT } from '../src/lib/tutor/whiteboard/sketch-examples';
import { ICON_NAMES, SKETCH_PRIMITIVE_TYPES, type SketchPrimitive } from '../src/lib/tutor/whiteboard/sketch-schema';

// An all-icons grid so every glyph is reviewable at a glance.
const iconGrid: SketchPrimitive[] = [];
ICON_NAMES.forEach((name, i) => {
  const col = i % 6, row = Math.floor(i / 6);
  const x = 10 + col * 16, y = 16 + row * 30;
  iconGrid.push({ type: 'icon', name, x, y, size: 15, stroke: 'ink', strokeWidth: 1 } as SketchPrimitive);
  iconGrid.push({ type: 'label', x, y: y + 12, text: name, fontSize: 3.4, anchor: 'middle', stroke: 'gray' } as SketchPrimitive);
});

interface Card { kind: string; concept: string; svg: string }
const cards: Card[] = [
  { kind: 'icon (×18)', concept: 'the full icon glyph set', svg: sketchToSvgString(iconGrid, { title: 'all 18 icons' }) },
  ...SKETCH_FEWSHOT.map((f) => ({
    kind: f.primitives[0].type,
    concept: f.concept,
    svg: sketchToSvgString(f.primitives),
  })),
];

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const cardHtml = (c: Card) => `
  <figure class="card">
    <div class="frame">${c.svg}</div>
    <figcaption><span class="chip">${esc(c.kind)}</span> ${esc(c.concept)}</figcaption>
  </figure>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Voice Tutor — Sketch primitives gallery</title>
<style>
  :root { --border:#e5e7eb; --muted:#6b7280; --ink:#111827; }
  * { box-sizing:border-box; }
  body { margin:0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; color:var(--ink); background:#fafafa; }
  header { padding:22px 28px; border-bottom:1px solid var(--border); background:#fff; position:sticky; top:0; z-index:2; }
  h1 { margin:0 0 4px; font-size:19px; }
  header p { margin:0; color:var(--muted); font-size:13px; }
  main { max-width:1200px; margin:0 auto; padding:24px 20px 80px; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:16px; }
  .card { margin:0; background:#fff; border:1px solid var(--border); border-radius:12px; padding:12px; }
  .frame { border:1px solid var(--border); border-radius:8px; background:#fff; padding:8px; }
  .frame svg { width:100%; height:auto; display:block; }
  figcaption { margin-top:9px; font-size:12.5px; color:var(--muted); line-height:1.45; }
  .chip { display:inline-block; font-size:11px; font-weight:600; color:#1d4ed8; background:#eff6ff; border:1px solid #bfdbfe; border-radius:999px; padding:1px 8px; margin-right:4px; }
  footer { color:var(--muted); font-size:12px; text-align:center; padding:24px; }
</style>
</head>
<body>
  <header>
    <h1>Voice Tutor — Sketch primitives gallery</h1>
    <p>${SKETCH_PRIMITIVE_TYPES.length} primitive types · ${cards.length} exemplars · hand-authored reference doodles (the few-shot the doodler learns from). Regenerate with <code>npm run sketch-gallery</code>.</p>
  </header>
  <main>
    <div class="grid">${cards.map(cardHtml).join('')}</div>
  </main>
  <footer>Generated from SKETCH_FEWSHOT + the icon set. Inline SVG, self-contained.</footer>
</body>
</html>`;

const outPath = path.join(__dirname, '..', 'sketch-review', 'index.html');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html);
console.log(`wrote ${outPath} (${cards.length} cards, ${SKETCH_PRIMITIVE_TYPES.length} primitive types)`);

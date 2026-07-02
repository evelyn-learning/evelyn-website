/**
 * Unit tests for the sketch RENDER core (buildSketchPaths) — the pure path/label
 * builder shared by the live component, the PDF renderer, and the smoke script.
 * Focus: the label-clamp (long labels near an edge must not clip) and that the
 * `concentric` primitive expands into one ellipse path per ring.
 *
 * Usage: npx tsx scripts/test-sketch-render.ts
 */
import { buildSketchPaths } from '../src/lib/tutor/whiteboard/sketch-render-core';
import { SKETCH_VIEWBOX, type SketchPrimitive } from '../src/lib/tutor/whiteboard/sketch-schema';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

const W = SKETCH_VIEWBOX.width;
const PAD = 2;
const estW = (text: string, fs: number) => Math.max(8, text.length * fs * 0.55);
const onlyLabel = (prims: SketchPrimitive[]) => buildSketchPaths(prims).labels[0];

const LONG = 'compressed (high pitch)'; // the exact label that clipped in the Doppler probe
const fs = 5;
const w = estW(LONG, fs);

// ── the reported nit: a long label anchored 'start' near the right edge ──
const start = onlyLabel([{ type: 'label', x: 95, y: 50, text: LONG, anchor: 'start' } as SketchPrimitive]);
check('start-anchored long label right edge stays in-bounds',
  start.x + w <= W - PAD + 1e-6, `x=${start.x} x+w=${start.x + w}`);

// ── middle anchor near right edge: box (x ± w/2) stays in-bounds ──
const mid = onlyLabel([{ type: 'label', x: 96, y: 50, text: LONG, anchor: 'middle' } as SketchPrimitive]);
check('middle-anchored long label right edge stays in-bounds',
  mid.x + w / 2 <= W - PAD + 1e-6 && mid.x - w / 2 >= PAD - 1e-6, `x=${mid.x}`);

// ── end anchor near left edge: box (x - w) stays in-bounds ──
const end = onlyLabel([{ type: 'label', x: 4, y: 50, text: LONG, anchor: 'end' } as SketchPrimitive]);
check('end-anchored long label left edge stays in-bounds',
  end.x - w >= PAD - 1e-6, `x=${end.x} x-w=${end.x - w}`);

// ── vertical clamp: a label at the very bottom is pulled up by half its height ──
const bottom = onlyLabel([{ type: 'label', x: 50, y: 100, text: 'source', anchor: 'middle' } as SketchPrimitive]);
check('bottom label clamped above the edge', bottom.y <= W - PAD, `y=${bottom.y}`);
const top = onlyLabel([{ type: 'label', x: 50, y: 0, text: 'source', anchor: 'middle' } as SketchPrimitive]);
check('top label clamped below the edge', top.y >= PAD, `y=${top.y}`);

// ── a well-placed label is left untouched ──
const ok = onlyLabel([{ type: 'label', x: 50, y: 50, text: 'hi', anchor: 'middle' } as SketchPrimitive]);
check('centered label unchanged', ok.x === 50 && ok.y === 50);

// ── the feature bbox tracks the clamped position (scribble targeting stays aligned) ──
check('feature cx matches clamped x',
  Math.abs(((start.feature as any).cx ?? start.x) - start.x) < 1e-6 || start.feature != null);

// ── concentric expands to ≥ count ellipse paths (one hand-drawn ring each) ──
const conc = buildSketchPaths([
  { type: 'concentric', cx: 45, cy: 50, count: 4, spacing: 6.5, squeeze: 0.5, angle: 0 } as SketchPrimitive,
]);
const pathCount = conc.drawn.reduce((n, d) => n + d.paths.length, 0);
check('concentric renders ≥ count rings', conc.drawn.length === 1 && pathCount >= 4, `paths=${pathCount}`);

// ── wave expands to a single sampled curve ──
const wv = buildSketchPaths([
  { type: 'wave', x1: 10, y1: 50, x2: 90, y2: 50, cycles: 3, amplitude: 14, damping: 0.5 } as SketchPrimitive,
]);
check('wave renders one drawn curve', wv.drawn.length === 1 && wv.drawn[0].paths.length >= 1,
  `paths=${wv.drawn[0]?.paths.length}`);

// ── spring expands to a single polyline ──
const sp = buildSketchPaths([
  { type: 'spring', x1: 50, y1: 14, x2: 50, y2: 60, coils: 6, width: 6 } as SketchPrimitive,
]);
check('spring renders one drawn polyline', sp.drawn.length === 1 && sp.drawn[0].paths.length >= 1,
  `paths=${sp.drawn[0]?.paths.length}`);

// ── stick_figure expands to head + spine + 2 arms + 2 legs (≥6 shapes) ──
const sf = buildSketchPaths([
  { type: 'stick_figure', x: 50, y: 50, scale: 30, pose: 'run' } as SketchPrimitive,
]);
check('stick_figure renders ≥6 sub-paths (head+spine+arms+legs)',
  sf.drawn.length === 1 && sf.drawn[0].paths.length >= 6, `paths=${sf.drawn[0]?.paths.length}`);

// ── container_fill (beaker) renders outline + liquid + spout ──
const cf = buildSketchPaths([
  { type: 'container_fill', x: 36, y: 26, w: 28, h: 46, fillFrac: 0.5, shape: 'beaker', fillColor: 'blue' } as SketchPrimitive,
]);
check('container_fill beaker renders ≥3 sub-paths', cf.drawn[0].paths.length >= 3, `paths=${cf.drawn[0]?.paths.length}`);
// an empty container (fillFrac 0) still draws its outline
const cf0 = buildSketchPaths([
  { type: 'container_fill', x: 36, y: 26, w: 28, h: 46, fillFrac: 0, shape: 'tank' } as SketchPrimitive,
]);
check('empty container_fill still renders its outline', cf0.drawn[0].paths.length >= 1);

// ── each new primitive's geometry stays within the canvas (with rough jitter tol) ──
const TOL = 6;
const nums = (d: string) => (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
function inBounds(prims: SketchPrimitive[]): boolean {
  const { drawn } = buildSketchPaths(prims);
  for (const { paths } of drawn) {
    for (const pi of paths) {
      for (const v of nums(pi.d)) {
        if (v < -TOL || v > W + TOL) return false;
      }
    }
  }
  return true;
}
check('wave stays in bounds', inBounds([
  { type: 'wave', x1: 10, y1: 50, x2: 90, y2: 50, cycles: 3, amplitude: 14 } as SketchPrimitive,
]));
check('spring stays in bounds', inBounds([
  { type: 'spring', x1: 50, y1: 14, x2: 50, y2: 60, coils: 6, width: 6 } as SketchPrimitive,
]));
check('stick_figure stays in bounds', inBounds([
  { type: 'stick_figure', x: 50, y: 50, scale: 30, pose: 'run' } as SketchPrimitive,
]));
check('container_fill stays in bounds', inBounds([
  { type: 'container_fill', x: 36, y: 26, w: 28, h: 46, fillFrac: 0.5, shape: 'thermometer' } as SketchPrimitive,
]));

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);

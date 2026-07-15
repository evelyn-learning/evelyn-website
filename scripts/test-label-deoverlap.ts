/**
 * Label de-overlap pass — regression test for the stacked-caption bug
 * (2026-07-14 APUSH live session): a showSketch item placed three caption
 * labels ("tomatoes / potatoes / maize — from Americas") at the SAME
 * coordinates and the strings composited into unreadable mush. The pass in
 * src/lib/tutor/whiteboard/label-deoverlap.ts must:
 *   - leave non-colliding labels bit-for-bit untouched (same reference),
 *   - stack exact-same-coords piles vertically in reading order,
 *   - resolve chain overlaps (A↔B↔C) without reintroducing collisions,
 *   - stay inside the bounds, and be pure + stable (same input → same output).
 *
 * Run: npx tsx scripts/test-label-deoverlap.ts
 */
import { deoverlapLabels, type DeoverlapLabel } from '../src/lib/tutor/whiteboard/label-deoverlap';
import { buildSketchPaths } from '../src/lib/tutor/whiteboard/sketch-render-core';
import { SKETCH_VIEWBOX, type SketchPrimitive } from '../src/lib/tutor/whiteboard/sketch-schema';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

const BOUNDS = { width: 100, height: 100 };
const L = (x: number, y: number, text: string, fontSize = 5): DeoverlapLabel =>
  ({ x, y, text, fontSize, anchor: 'middle' });

/** Mirror of the pass's bbox estimate, for overlap assertions (middle baseline). */
function box(l: DeoverlapLabel, o = { charWidth: 0.55, lineHeight: 1.2, minWidth: 0 }) {
  const w = Math.max(o.minWidth, l.text.length * l.fontSize * o.charWidth);
  const h = l.fontSize * o.lineHeight;
  const left = l.anchor === 'start' ? l.x : l.anchor === 'end' ? l.x - w : l.x - w / 2;
  return { left, right: left + w, top: l.y - h / 2, bottom: l.y - h / 2 + h };
}
function anyOverlap(ls: DeoverlapLabel[]): boolean {
  for (let i = 0; i < ls.length; i++)
    for (let j = i + 1; j < ls.length; j++) {
      const a = box(ls[i]), b = box(ls[j]);
      if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) return true;
    }
  return false;
}

// ── 1. no-collision passthrough ────────────────────────────────────
{
  const input = [L(20, 10, 'sun'), L(80, 30, 'moon'), L(50, 70, 'earth')];
  const out = deoverlapLabels(input, BOUNDS);
  check('passthrough: same references for non-colliding labels', out.every((l, i) => l === input[i]));
  check('passthrough: order preserved', out.map((l) => l.text).join() === 'sun,moon,earth');
}

// ── 2. exact-same-coords pile (the observed APUSH bug shape) ───────
{
  const input = [
    L(50, 60, 'tomatoes - from Americas'),
    L(50, 60, 'potatoes - from Americas'),
    L(50, 60, 'maize/corn - from Americas'),
  ];
  const out = deoverlapLabels(input, BOUNDS);
  check('same-coords: no residual overlap', !anyOverlap(out));
  check('same-coords: first label (reading order) did not move', out[0] === input[0]);
  check('same-coords: x never changes', out.every((l, i) => l.x === input[i].x));
  const ys = out.map((l) => l.y);
  check('same-coords: stacked strictly downward in input order', ys[0] < ys[1] && ys[1] < ys[2]);
  check('same-coords: stays inside bounds', out.every((l) => l.y > 0 && l.y < BOUNDS.height));
}

// ── 3. chain overlap (A↔B, B↔C, but not A↔C) ──────────────────────
{
  const input = [L(50, 40, 'alpha beta'), L(50, 44, 'gamma delta'), L(50, 48, 'epsilon')];
  const out = deoverlapLabels(input, BOUNDS);
  check('chain: no residual overlap', !anyOverlap(out));
  check('chain: reading order preserved (y ascending)', out[0].y < out[1].y && out[1].y < out[2].y);
  check('chain: topmost label anchors the pile', out[0] === input[0]);
}

// ── 4. purity + stability ──────────────────────────────────────────
{
  const input = [L(50, 60, 'aaa'), L(50, 60, 'bbb'), L(10, 10, 'ccc')];
  const snapshot = JSON.stringify(input);
  const a = deoverlapLabels(input, BOUNDS);
  const b = deoverlapLabels(input, BOUNDS);
  check('pure: input array not mutated', JSON.stringify(input) === snapshot);
  check('stable: same input → same output', JSON.stringify(a) === JSON.stringify(b));
}

// ── 5. bottom-edge pile flips upward instead of clipping ──────────
{
  const input = [L(50, 96, 'one one'), L(50, 96, 'two two'), L(50, 96, 'three three')];
  const out = deoverlapLabels(input, BOUNDS);
  check('bottom edge: no residual overlap', !anyOverlap(out));
  check(
    'bottom edge: every label box stays inside the canvas',
    out.every((l) => box(l).top >= 0 && box(l).bottom <= BOUNDS.height),
  );
}

// ── 6. end-to-end through buildSketchPaths (the showSketch pipeline) ─
{
  const prims: SketchPrimitive[] = [
    { type: 'ellipse', cx: 50, cy: 30, rx: 20, ry: 12 },
    { type: 'label', x: 50, y: 60, text: 'tomatoes - from Americas' },
    { type: 'label', x: 50, y: 60, text: 'potatoes - from Americas' },
    { type: 'label', x: 50, y: 60, text: 'maize/corn - from Americas' },
  ];
  const { labels } = buildSketchPaths(prims);
  check('sketch: three labels come out', labels.length === 3);
  const ys = labels.map((l) => l.y);
  check('sketch: labels no longer share a y', new Set(ys).size === 3);
  check(
    'sketch: no residual overlap',
    !anyOverlap(labels.map((l) => ({ x: l.x, y: l.y, text: l.text, fontSize: l.fontSize, anchor: l.anchor }))),
  );
  check(
    'sketch: feat() cy tracks the final position',
    labels.every((l) => l.feature['data-feature-cy'] === (l.y / SKETCH_VIEWBOX.height).toFixed(3)),
  );
  // Determinism across the whole pipeline (rough.js jitter is seeded).
  const again = buildSketchPaths(prims);
  check('sketch: pipeline is stable across calls', JSON.stringify(again.labels) === JSON.stringify(labels));
  // A sketch with well-separated labels is untouched.
  const apart: SketchPrimitive[] = [
    { type: 'label', x: 20, y: 20, text: 'left' },
    { type: 'label', x: 80, y: 80, text: 'right' },
  ];
  const spread = buildSketchPaths(apart).labels;
  check('sketch: non-colliding labels keep their coords', spread[0].y === 20 && spread[1].y === 80);
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);

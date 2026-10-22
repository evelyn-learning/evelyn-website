/**
 * The geometry renderer's auto view range (GAC round 8, G3):
 * src/lib/tutor/whiteboard/geometry-view-range.ts `autoViewRange`.
 *
 *   - fit 'canvas' is today's arithmetic exactly (± PADDING 1.5, the `< 1`
 *     widening) — every live session renders with it;
 *   - fit 'content' pads every side by max(1.5, 12 % of the larger extent),
 *     so a 125-unit-wide figure keeps its edge labels and arcs inside;
 *   - engine-freeze pin: a static render with the default fit is
 *     byte-identical to the render before the change.
 *
 * Pure: no database, no network, no model.
 * Run: npm run test:geometry-view-range   (npx tsx scripts/test-geometry-view-range.ts)
 */
import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import { renderToStaticMarkup } from 'react-dom/server';
import { autoViewRange } from '../src/lib/tutor/whiteboard/geometry-view-range';
import { renderGeometryTree } from '../src/app/tutor/components/whiteboard/GeometryRenderer';
import { GEOMETRY_FREEZE_EXPECTED, GEOMETRY_FREEZE_FIXTURE } from './fixtures/geometry-freeze-fixture';

let failed = 0;
function section(name: string, fn: () => void): void {
  try { fn(); console.log(`  ok   ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
}

const LIGHTHOUSE = [{ x: 0, y: 0 }, { x: 0, y: 60 }, { x: 71.5, y: 0 }, { x: 112.8, y: 0 }, { x: 125, y: 60 }];
const TRIANGLE = [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 }];

console.log('geometry view range');

section('fit content: the lighthouse (125 wide) pads by 12 % of its extent, 15 units', () => {
  const r = autoViewRange({ points: LIGHTHOUSE, circles: [], conics: [], fit: 'content' });
  assert.equal(r.x[0], -15); assert.equal(r.y[0], -15);
  assert.equal(r.x[1], 140); assert.equal(r.y[1], 75);
});

section('fit canvas: the lighthouse keeps today\'s ± 1.5', () => {
  const r = autoViewRange({ points: LIGHTHOUSE, circles: [], conics: [], fit: 'canvas' });
  assert.deepEqual(r, { x: [-1.5, 126.5], y: [-1.5, 61.5] });
});

section('fit content: a 4-unit triangle pads by the 1.5 floor', () => {
  const r = autoViewRange({ points: TRIANGLE, circles: [], conics: [], fit: 'content' });
  assert.deepEqual(r, { x: [-1.5, 5.5], y: [-1.5, 4.5] });
});

section('circles (center ± radius) and conics (± 2·max(a, b)) widen the range as before', () => {
  const c = autoViewRange({ points: [{ x: 0, y: 0 }], circles: [{ center: { x: 0, y: 0 }, radius: 2 }], conics: [], fit: 'canvas' });
  assert.deepEqual(c, { x: [-3.5, 3.5], y: [-3.5, 3.5] });
  const k = autoViewRange({ points: [{ x: 0, y: 0 }], circles: [], conics: [{ center: { x: 1, y: 0 }, a: 3, b: 1 }], fit: 'canvas' });
  assert.deepEqual(k, { x: [-6.5, 8.5], y: [-7.5, 7.5] });
  const kb = autoViewRange({ points: [{ x: 0, y: 0 }], circles: [], conics: [{ center: { x: 0, y: 0 }, a: 1 }], fit: 'canvas' });
  assert.deepEqual(kb, { x: [-3.5, 3.5], y: [-3.5, 3.5] }, 'b defaults to a');
});

section('the `< 1` widening: a single point gets ± 1 then the padding', () => {
  assert.deepEqual(autoViewRange({ points: [{ x: 2, y: 3 }], circles: [], conics: [], fit: 'canvas' }), { x: [-0.5, 4.5], y: [0.5, 5.5] });
  assert.deepEqual(autoViewRange({ points: [{ x: 2, y: 3 }], circles: [], conics: [], fit: 'content' }), { x: [-0.5, 4.5], y: [0.5, 5.5] });
});

section('engine freeze: the default fit renders byte-identically to before (literal viewBox + first point)', () => {
  const html = renderToStaticMarkup(renderGeometryTree(GEOMETRY_FREEZE_FIXTURE));
  assert.equal(/viewBox="([^"]+)"/.exec(html)![1], GEOMETRY_FREEZE_EXPECTED.viewBox);
  assert.equal(GEOMETRY_FREEZE_EXPECTED.viewBox, '0 0 500 400');
  const a = /<circle cx="([^"]+)" cy="([^"]+)"[^>]*data-feature="point-a"/.exec(html);
  assert.ok(a, 'point A is drawn');
  assert.equal(a![1], '164.28571428571428');
  assert.equal(a![2], '257.14285714285717');
  assert.equal(Number(a![1]), GEOMETRY_FREEZE_EXPECTED.firstPointCx);
  assert.equal(Number(a![2]), GEOMETRY_FREEZE_EXPECTED.firstPointCy);
  assert.equal(html.length, GEOMETRY_FREEZE_EXPECTED.markupLength);
  assert.equal(createHash('sha256').update(html).digest('hex'), GEOMETRY_FREEZE_EXPECTED.markupSha256, 'the whole markup is unchanged');
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall passed');

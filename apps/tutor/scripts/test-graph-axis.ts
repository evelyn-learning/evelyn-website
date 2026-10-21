/**
 * Unit test for src/lib/tutor/whiteboard/graph-axis.ts (π-stepped axes) and
 * the geometry validator's label rule (src/lib/tutor/whiteboard/geometry-validator.ts).
 *
 * 2026-10-20 (GAC "Geometry & Graphs" upload portal-f7a639d4): a sine graph
 * marked π/2…2π on the sheet drew with numeric ticks; a sketch's given side
 * lengths (7; 6, 12, 9, 15) were relabelled with coordinate lengths.
 *
 * Run: npx tsx scripts/test-graph-axis.ts  (npm run test:graph-axis)
 */

import { strict as assert } from 'node:assert';
import { parseAxisStep, isPiStep, labelPiTick } from '../src/lib/tutor/whiteboard/graph-axis';
import { validateGeometryCommand, coordinatesAreShown, type GeometryCommand } from '../src/lib/tutor/whiteboard/geometry-validator';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

test('parseAxisStep reads π expressions, numbers and nothing else', () => {
  assert.ok(Math.abs(parseAxisStep('pi/2')! - Math.PI / 2) < 1e-12);
  assert.ok(Math.abs(parseAxisStep('π')! - Math.PI) < 1e-12);
  assert.ok(Math.abs(parseAxisStep('2pi')! - 2 * Math.PI) < 1e-12);
  assert.ok(Math.abs(parseAxisStep('3π/4')! - 3 * Math.PI / 4) < 1e-12);
  assert.ok(Math.abs(parseAxisStep('0.5 * pi')! - Math.PI / 2) < 1e-12);
  assert.equal(parseAxisStep(2), 2);
  assert.equal(parseAxisStep('0.25'), 0.25);
  for (const bad of [undefined, null, '', 'auto', 0, -1, 'pi/0', {}]) assert.equal(parseAxisStep(bad), undefined, String(bad));
});

test('a π step is recognised; a plain step is not', () => {
  assert.equal(isPiStep(Math.PI / 2), true);
  assert.equal(isPiStep(2 * Math.PI), true);
  assert.equal(isPiStep(1), false);
  assert.equal(isPiStep(undefined), false);
});

test('π tick labels: the sheet\'s π/2, π, 3π/2, 2π', () => {
  const step = Math.PI / 2;
  assert.deepEqual([0, 1, 2, 3, 4].map((i) => labelPiTick(i * step, step)), ['0', 'π/2', 'π', '3π/2', '2π']);
  assert.equal(labelPiTick(-Math.PI / 2, step), '−π/2');
  assert.equal(labelPiTick(2 * Math.PI, Math.PI), '2π');
  assert.equal(labelPiTick(3 * Math.PI / 4, Math.PI / 4), '3π/4');
});

// ── geometry validator: labels on a not-to-scale sketch stay as given ──
const sketch = (): GeometryCommand => ({
  action: 'showGeometry',
  title: 'Problem 7: Two sides and included angle',
  points: [{ id: 'B', x: 0, y: 0, label: 'B' }, { id: 'C', x: 9, y: 0, label: 'C' }, { id: 'A', x: 3, y: 5, label: 'A' }],
  segments: [{ from: 'B', to: 'A', label: '7' }, { from: 'B', to: 'C', label: '9' }, { from: 'A', to: 'C', label: 'c' }],
  angles: [{ vertex: 'B', from: 'A', to: 'C', label: '50°' }],
} as unknown as GeometryCommand);

test('the session: a sketch with sides 7, 9, c keeps its labels (no "√34")', () => {
  const cmd = sketch();
  assert.equal(coordinatesAreShown(cmd), false);
  const out = validateGeometryCommand(cmd);
  assert.deepEqual(out.segments!.map((s) => s.label), ['7', '9', 'c']);
});

test('the session: DE ∥ BC with 6, 12, 9, 15 keeps the sheet\'s numbers', () => {
  const cmd = {
    action: 'showGeometry',
    points: [{ id: 'A', x: 3, y: 5, label: 'A' }, { id: 'B', x: 0, y: 0, label: 'B' }, { id: 'C', x: 6, y: 0, label: 'C' }, { id: 'D', x: 1.5, y: 2.5, label: 'D' }, { id: 'E', x: 4.5, y: 2.5, label: 'E' }],
    segments: [{ from: 'A', to: 'D', label: '6' }, { from: 'A', to: 'E', label: '12' }, { from: 'D', to: 'E', label: '9' }, { from: 'B', to: 'C', label: '15' }, { from: 'D', to: 'B', label: 'x' }, { from: 'E', to: 'C', label: 'y' }],
  } as unknown as GeometryCommand;
  const out = validateGeometryCommand(cmd);
  assert.deepEqual(out.segments!.map((s) => s.label), ['6', '12', '9', '15', 'x', 'y']);
});

test('a coordinate figure (a point labelled with its (x, y)) still gets a slipped length corrected', () => {
  const cmd = {
    action: 'showGeometry',
    points: [{ id: 'O', x: 0, y: 0, label: 'O(0, 0)' }, { id: 'P', x: 3, y: 4, label: 'P(3, 4)' }],
    segments: [{ from: 'O', to: 'P', label: '√24' }],
  } as unknown as GeometryCommand;
  assert.equal(coordinatesAreShown(cmd), true);
  const out = validateGeometryCommand(cmd);
  assert.equal(out.segments![0].label, '5');
});

test('showAxes / showCoords also mark a coordinate figure', () => {
  assert.equal(coordinatesAreShown({ ...sketch(), showAxes: true }), true);
  const withCoords = sketch();
  (withCoords.points[0] as { showCoords?: boolean }).showCoords = true;
  assert.equal(coordinatesAreShown(withCoords), true);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);

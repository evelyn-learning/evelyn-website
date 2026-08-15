/**
 * Unit tests for computeFitScale() — task W1, per-card scale-to-fit for
 * wide whiteboard content (CatalogComparisonTableRenderer's `<table>`,
 * TChart's CSS grid).
 *
 * Locks down the pure ratio/floor math: never upscale, never divide by
 * zero/NaN, floor clamps correctly, and `overflowing` flips true exactly
 * when floor had to override the natural fit ratio.
 *
 *   npx tsx scripts/test-fit-scale.ts
 */
import assert from 'node:assert';
import { computeFitScale } from '../src/app/tutor/components/whiteboard/fit-scale-math';

let passed = 0;
function check(label: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${label}`); }
  catch (e) { console.error(`  ✗ ${label}\n    ${e instanceof Error ? e.message : e}`); process.exitCode = 1; }
}

console.log('computeFitScale — core ratio/floor math');

check('content narrower than container: scale 1, never upscale', () => {
  const { scale, overflowing } = computeFitScale({ containerWidth: 600, contentWidth: 400, floor: 0.6 });
  assert.strictEqual(scale, 1);
  assert.strictEqual(overflowing, false);
});

check('content exactly equal to container: scale 1', () => {
  const { scale, overflowing } = computeFitScale({ containerWidth: 500, contentWidth: 500, floor: 0.6 });
  assert.strictEqual(scale, 1);
  assert.strictEqual(overflowing, false);
});

check('content wider than container but natural ratio above floor: scale = natural ratio, fits exactly, not overflowing', () => {
  // 5-column comparison table: container 390px, table naturally 500px wide.
  // natural = 390/500 = 0.78, above the 0.6 floor.
  const { scale, overflowing } = computeFitScale({ containerWidth: 390, contentWidth: 500, floor: 0.6 });
  assert.strictEqual(scale, 390 / 500);
  assert.strictEqual(overflowing, false);
  const scaledWidth = 500 * scale;
  assert.ok(Math.abs(scaledWidth - 390) < 1e-9, `scaled width ${scaledWidth} should exactly match container 390`);
});

check('content far wider than container, natural ratio below floor: clamps at floor, overflowing=true', () => {
  // container 390px, table naturally 1000px wide. natural = 0.39, below 0.6 floor.
  const { scale, overflowing } = computeFitScale({ containerWidth: 390, contentWidth: 1000, floor: 0.6 });
  assert.strictEqual(scale, 0.6, 'scale should clamp at the floor, not go lower');
  assert.strictEqual(overflowing, true, 'still wider than container at floor scale — must flag overflowing so caller adds scroll');
  const scaledWidth = 1000 * scale;
  assert.ok(scaledWidth > 390, 'sanity: floor-scaled content is still wider than the container (that IS the overflowing case)');
});

check('natural ratio exactly at floor: scale = floor, NOT flagged overflowing (fits exactly at floor)', () => {
  // container 300, content 500 -> natural = 0.6 exactly, floor = 0.6.
  const { scale, overflowing } = computeFitScale({ containerWidth: 300, contentWidth: 500, floor: 0.6 });
  assert.strictEqual(scale, 0.6);
  assert.strictEqual(overflowing, false, 'exactly-at-floor fits with no remainder — no scroll needed');
});

check('floor 0: never clamps (equivalent to EquationRenderer-style plain shrink, minus its own explicit 0.32)', () => {
  const { scale, overflowing } = computeFitScale({ containerWidth: 200, contentWidth: 2000, floor: 0 });
  assert.strictEqual(scale, 0.1);
  assert.strictEqual(overflowing, false);
});

console.log('\ncomputeFitScale — degenerate / not-yet-measured inputs never divide-by-zero or NaN/Infinity');

check('containerWidth 0 (ResizeObserver has not fired yet): falls back to scale 1, not overflowing', () => {
  const { scale, overflowing } = computeFitScale({ containerWidth: 0, contentWidth: 500, floor: 0.6 });
  assert.strictEqual(scale, 1);
  assert.strictEqual(overflowing, false);
});

check('contentWidth 0 (content not yet measured): falls back to scale 1, no divide-by-zero/Infinity', () => {
  const { scale, overflowing } = computeFitScale({ containerWidth: 390, contentWidth: 0, floor: 0.6 });
  assert.strictEqual(scale, 1);
  assert.ok(Number.isFinite(scale));
  assert.strictEqual(overflowing, false);
});

check('negative containerWidth: falls back to scale 1, no NaN', () => {
  const { scale, overflowing } = computeFitScale({ containerWidth: -10, contentWidth: 500, floor: 0.6 });
  assert.strictEqual(scale, 1);
  assert.strictEqual(overflowing, false);
});

check('NaN contentWidth: falls back to scale 1, no NaN propagation', () => {
  const { scale, overflowing } = computeFitScale({ containerWidth: 390, contentWidth: NaN, floor: 0.6 });
  assert.strictEqual(scale, 1);
  assert.ok(Number.isFinite(scale));
  assert.strictEqual(overflowing, false);
});

check('floor above 1 is clamped to 1 (defensive — a misconfigured caller should not upscale)', () => {
  const { scale } = computeFitScale({ containerWidth: 300, contentWidth: 500, floor: 1.5 });
  assert.strictEqual(scale, 1);
});

check('negative floor is clamped to 0 (defensive)', () => {
  const { scale, overflowing } = computeFitScale({ containerWidth: 200, contentWidth: 2000, floor: -1 });
  assert.strictEqual(scale, 0.1); // behaves as floor 0 — natural ratio, never clamped-overflowing
  assert.strictEqual(overflowing, false);
});

console.log(`\n${passed} check(s) passed.`);
if (process.exitCode) {
  console.error('FAILED');
} else {
  console.log('ALL PASSED');
}

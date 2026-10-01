/**
 * Free-body-diagram direction math — regression test for the GreenApple
 * incline bug (session portal-ffd73a9d-461a-49b0-8976-9ed288f8a796,
 * 2026-10-01): `into-surface` was drawn down-LEFT on a rising-right slope
 * instead of down-right (sign error in `dirToAngle`), and separately the
 * tutor sent `N direction: 'up'` on an inclined surface, which the renderer
 * obeyed literally and drew the normal force vertical instead of
 * perpendicular to the slope.
 *
 * Run: npm run test:fbd-directions
 */
import { strict as assert } from 'node:assert';
import { dirToAngle, normalizeInclineForces, type FbdForce, type FbdSurface } from './FreeBodyDiagramRenderer';

let passed = 0, failed = 0;
function test(name: string, fn: () => void): void {
  try { fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

// ── dirToAngle: inclined (θ = 30) ───────────────────────────────────────
test('θ=30: normal is 120° (perpendicular to slope, outward/up-left)', () => {
  assert.equal(dirToAngle('normal', 30), 120);
});

test('θ=30: into-surface is -60° (opposite of normal, down-right)', () => {
  assert.equal(dirToAngle('into-surface', 30), -60);
});

test('θ=30: down-slope is 210°', () => {
  assert.equal(dirToAngle('down-slope', 30), 210);
});

test('θ=30: up-slope is 30°', () => {
  assert.equal(dirToAngle('up-slope', 30), 30);
});

// ── dirToAngle: horizontal (θ = 0) stays unchanged ──────────────────────
test('θ=0: into-surface is still -90° (horizontal case unaffected)', () => {
  assert.equal(dirToAngle('into-surface', 0), -90);
});

// ── normalizeInclineForces: structural guard ────────────────────────────
const inclined: FbdSurface = { type: 'inclined', angle: 30 };
const horizontal: FbdSurface = { type: 'horizontal' };

test("N 'up' on an inclined surface is corrected to 'normal'", () => {
  const forces: FbdForce[] = [{ name: 'N', direction: 'up' }];
  const out = normalizeInclineForces(forces, inclined);
  assert.equal(out[0].direction, 'normal');
});

test("N 'up' on a horizontal surface is left unchanged", () => {
  const forces: FbdForce[] = [{ name: 'N', direction: 'up' }];
  const out = normalizeInclineForces(forces, horizontal);
  assert.equal(out[0].direction, 'up');
});

test("W 'up' on an inclined surface is left unchanged (only normal-force names are corrected)", () => {
  const forces: FbdForce[] = [{ name: 'W', direction: 'up' }];
  const out = normalizeInclineForces(forces, inclined);
  assert.equal(out[0].direction, 'up');
});

test("Fn 'up' on an inclined surface is corrected to 'normal'", () => {
  const forces: FbdForce[] = [{ name: 'Fn', direction: 'up' }];
  const out = normalizeInclineForces(forces, inclined);
  assert.equal(out[0].direction, 'normal');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);

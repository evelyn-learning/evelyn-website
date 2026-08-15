/**
 * Unit test for the conic-construction enforcement
 * (src/lib/tutor/whiteboard/conic-construction.ts — see
 * project_tutor_conic_construction_fix.md).
 *
 * Run: npm run test:conic
 * No framework — matches the test:page-grouping / test:board-map pattern.
 * Fixtures are the exact failing specs from Console_55 (2026-06-19).
 */

import { strict as assert } from 'node:assert';
import {
  isCurveLessConic,
  isCompleteConic,
  sameConicSubject,
  carryForwardConicCurve,
  findPriorConic,
  type GeoConstructionCommand,
} from '../src/lib/tutor/whiteboard/conic-construction';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

// ── Fixtures (from the failing session) ─────────────────────────────────────
const ellipseFull: GeoConstructionCommand = {
  action: 'showGeometryConstructed',
  title: 'Ellipse x²/9 + y²/4 = 1',
  given: [
    { id: 'O', kind: 'point', x: 0, y: 0, label: 'O' },
    { id: 'F1', kind: 'point', x: -2.236, y: 0, label: 'F₁' },
    { id: 'F2', kind: 'point', x: 2.236, y: 0, label: 'F₂' },
  ],
  steps: [
    { id: 'el', kind: 'ellipse', center: 'O', a: 3, b: 2 },
    { id: 'foci', kind: 'conic_foci', conic: 'el', pointIds: ['F1', 'F2'] },
  ],
};

const ellipseDirectricesCurveLess: GeoConstructionCommand = {
  action: 'showGeometryConstructed',
  title: 'Ellipse x²/9 + y²/4 = 1 — with Directrices',
  given: [
    { id: 'O', kind: 'point', x: 0, y: 0, label: 'O' },
    { id: 'F1', kind: 'point', x: -2.236, y: 0, label: 'F₁' },
    { id: 'F2', kind: 'point', x: 2.236, y: 0, label: 'F₂' },
    { id: 'd1a', kind: 'point', x: -5.367, y: -3 },
    { id: 'd1b', kind: 'point', x: -5.367, y: 3 },
  ],
  steps: [
    { id: 'dir1', kind: 'segment', from: 'd1a', to: 'd1b', label: 'x = −9/√5' },
  ],
};

const hyperbolaDirectricesCurveLess: GeoConstructionCommand = {
  action: 'showGeometryConstructed',
  title: 'Hyperbola x²/4 − y²/9 = 1 — with Directrices',
  given: [{ id: 'O', kind: 'point', x: 0, y: 0, label: 'O' }],
  steps: [
    { id: 'dir1', kind: 'segment', from: 'd1a', to: 'd1b' },
    { id: 'asymp1', kind: 'segment', from: 'a1', to: 'a2' },
  ],
};

function main() {
  console.log('Conic construction enforcement — fix\n');

  // ── Detection ──────────────────────────────────────────────────────────
  test('isCurveLessConic: conic title + no curve step → true', () => {
    assert.equal(isCurveLessConic(ellipseDirectricesCurveLess), true);
    assert.equal(isCurveLessConic(hyperbolaDirectricesCurveLess), true);
  });

  test('isCurveLessConic: conic WITH curve step → false', () => {
    assert.equal(isCurveLessConic(ellipseFull), false);
  });

  test('isCurveLessConic: non-conic title (has segments) → false', () => {
    assert.equal(isCurveLessConic({
      action: 'showGeometryConstructed', title: 'Triangle ABC',
      steps: [{ id: 's', kind: 'segment', from: 'A', to: 'B' }],
    }), false);
  });

  test('isCurveLessConic: not a geometry construction → false', () => {
    assert.equal(isCurveLessConic({ action: 'showGraph', title: 'Ellipse' }), false);
    assert.equal(isCurveLessConic(null), false);
    assert.equal(isCurveLessConic(undefined), false);
  });

  test('isCurveLessConic: parabola variants count as curve steps', () => {
    assert.equal(isCurveLessConic({
      action: 'showGeometryConstructed', title: 'y² = 4x',
      steps: [{ id: 'p', kind: 'parabola', vertex: 'V', focalLength: 1, opens: 'right' }],
    }), false);
  });

  test('isCompleteConic: full ellipse → true; curve-less → false', () => {
    assert.equal(isCompleteConic(ellipseFull), true);
    assert.equal(isCompleteConic(ellipseDirectricesCurveLess), false);
  });

  // ── Subject matching ───────────────────────────────────────────────────
  test('sameConicSubject: ellipse base vs ellipse+directrices → true', () => {
    assert.equal(sameConicSubject(ellipseDirectricesCurveLess, ellipseFull), true);
  });

  test('sameConicSubject: ellipse vs hyperbola → false', () => {
    assert.equal(sameConicSubject(ellipseDirectricesCurveLess, hyperbolaDirectricesCurveLess), false);
  });

  test('sameConicSubject: same conic kind, different equation → false', () => {
    assert.equal(sameConicSubject(
      { action: 'showGeometryConstructed', title: 'Ellipse x²/9 + y²/4 = 1 — with Directrices' },
      { action: 'showGeometryConstructed', title: 'Ellipse x²/16 + y²/4 = 1' },
    ), false);
  });

  // ── Carry-forward ──────────────────────────────────────────────────────
  test('carryForwardConicCurve: prepends the ellipse curve step', () => {
    const merged = carryForwardConicCurve(ellipseDirectricesCurveLess, ellipseFull);
    assert.equal(merged.steps![0].kind, 'ellipse', 'curve step first');
    assert.equal(merged.steps![0].center, 'O', 'references reused point id');
    // original directrix step preserved AFTER the curve
    assert.ok(merged.steps!.some((s: any) => s.kind === 'segment' && s.id === 'dir1'));
    assert.equal(isCurveLessConic(merged), false, 'merged figure is no longer curve-less');
  });

  test('carryForwardConicCurve: reuses re-declared points (no duplicate O/F1/F2)', () => {
    const merged = carryForwardConicCurve(ellipseDirectricesCurveLess, ellipseFull);
    const ids = (merged.given ?? []).map((g: any) => g.id);
    // target already declared O/F1/F2 → curve step's center:"O" resolves to them,
    // nothing carried (no dupes).
    assert.deepEqual(ids.filter((id: string) => id === 'O'), ['O'], 'single O');
    assert.equal(ids.filter((id: string) => id === 'F1').length, 1, 'single F1');
  });

  test('carryForwardConicCurve: carries a referenced point the target lacks', () => {
    const prior: GeoConstructionCommand = {
      action: 'showGeometryConstructed', title: 'Ellipse E',
      given: [{ id: 'C', kind: 'point', x: 1, y: 1, label: 'C' }],
      steps: [{ id: 'el', kind: 'ellipse', center: 'C', a: 3, b: 2 }],
    };
    const target: GeoConstructionCommand = {
      action: 'showGeometryConstructed', title: 'Ellipse E — with Directrices',
      given: [{ id: 'd1a', kind: 'point', x: 0, y: 0 }],
      steps: [{ id: 'dir1', kind: 'segment', from: 'd1a', to: 'd1a' }],
    };
    const merged = carryForwardConicCurve(target, prior);
    const ids = (merged.given ?? []).map((g: any) => g.id);
    assert.ok(ids.includes('C'), 'carried center point C the target did not declare');
  });

  test('carryForwardConicCurve: renames curve-step id on collision', () => {
    const prior: GeoConstructionCommand = {
      action: 'showGeometryConstructed', title: 'Ellipse E',
      given: [{ id: 'O', kind: 'point', x: 0, y: 0 }],
      steps: [{ id: 'dir1', kind: 'ellipse', center: 'O', a: 3, b: 2 }], // id collides w/ target
    };
    const target: GeoConstructionCommand = {
      action: 'showGeometryConstructed', title: 'Ellipse E — with Directrices',
      given: [{ id: 'O', kind: 'point', x: 0, y: 0 }],
      steps: [{ id: 'dir1', kind: 'segment', from: 'O', to: 'O' }],
    };
    const merged = carryForwardConicCurve(target, prior);
    const curveStep = merged.steps!.find((s: any) => s.kind === 'ellipse');
    assert.notEqual(curveStep!.id, 'dir1', 'collided id renamed');
    assert.ok(merged.steps!.some((s: any) => s.kind === 'segment' && s.id === 'dir1'), 'target dir1 intact');
  });

  // ── History lookup ─────────────────────────────────────────────────────
  test('findPriorConic: returns the matching complete conic from history', () => {
    const history = [
      { action: 'showEquation' },
      ellipseFull,
      { action: 'showGeometryConstructed', title: 'Hyperbola H', steps: [{ kind: 'hyperbola' }] },
    ];
    const found = findPriorConic(ellipseDirectricesCurveLess, history);
    assert.ok(found && found.title === 'Ellipse x²/9 + y²/4 = 1');
  });

  test('findPriorConic: no same-subject conic → null', () => {
    const history = [{ action: 'showEquation' }, hyperbolaDirectricesCurveLess];
    assert.equal(findPriorConic(ellipseDirectricesCurveLess, history), null);
  });

  test('findPriorConic: newest-first (evolving figure carries from latest)', () => {
    const older = { ...ellipseFull, title: 'Ellipse x²/9 + y²/4 = 1' };
    const newer = { ...ellipseFull, title: 'Ellipse x²/9 + y²/4 = 1 — with Foci',
      steps: [{ id: 'el2', kind: 'ellipse', center: 'O', a: 3, b: 2 }, { kind: 'conic_foci', conic: 'el2' }] };
    const found = findPriorConic(ellipseDirectricesCurveLess, [older, newer]);
    assert.ok(found && found.title!.includes('with Foci'), 'picked newest');
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();

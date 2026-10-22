/**
 * Unit test for src/lib/tutor/whiteboard/homework-figure.ts — the figure that
 * belongs to a homework problem, found again on a problem move.
 *
 * 2026-10-20 (GAC Geometry upload portal-4cc98574): back on problem 2 with its
 * figure on page 2 of 4, the tutor said "Looking at the figure…" to a board
 * showing problem 3's working.
 *
 * Run: npx tsx scripts/test-homework-figure.ts  (npm run test:homework-figure)
 */

import { strict as assert } from 'node:assert';
import { homeworkFigureFor, titleNamesProblem } from '../src/lib/tutor/whiteboard/homework-figure';
import { namedPointsIn, validateFigure, checkClaims } from '../src/lib/tutor/homework-build/figure-validate';
import { shouldScrollToDedupedItem } from '../src/lib/tutor/whiteboard/dedup-scroll';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

test('a title names its problem by number, in the forms the brain and the page grouping use', () => {
  for (const t of ['Problem 2: Parallel Lines Cut by Transversal', 'Problem 2 of 8', 'Problem 2', 'problem 2 (b)', 'Q2', 'Q 2', '#2', 'Question 2', 'Exercise 2']) {
    assert.equal(titleNamesProblem(t, 2), true, t);
  }
});

test('a title does not name a different problem', () => {
  for (const t of ['Problem 12', 'Problem 12 of 20', 'Problem 2.5', 'Problem 1: Intersecting Lines', 'Next', 'Similar Triangles', undefined]) {
    assert.equal(titleNamesProblem(t, 2), false, String(t));
  }
  assert.equal(titleNamesProblem('Problem 2', 0), false);
});

const board = [
  { itemId: 'showGeometryConstructed-1', order: 1, action: 'showGeometryConstructed', title: 'Problem 1: Intersecting Lines', pageTitle: 'Problem 1: Intersecting Lines', pageId: 'p1' },
  { itemId: 'showEquation-5', order: 2, action: 'showEquation', pageTitle: 'Problem 1: Intersecting Lines', pageId: 'p1' },
  { itemId: 'showGeometryConstructed-2', order: 3, action: 'showGeometryConstructed', title: 'Problem 2: Parallel Lines Cut by Transversal', pageTitle: 'Problem 2: Parallel Lines Cut by Transversal', pageId: 'p2' },
  { itemId: 'showGeometryConstructed-3', order: 4, action: 'showGeometryConstructed', title: 'Problem 3: Similar Triangles', pageTitle: 'Problem 3: Similar Triangles', pageId: 'p3' },
  { itemId: 'showEquation-12', order: 5, action: 'showEquation', pageTitle: 'Next', pageId: 'p4' },
  { itemId: 'showEquation-13', order: 6, action: 'showEquation', pageTitle: 'Next', pageId: 'p4' },
];

test('the session: back on problem 2 from page 4, its figure on page 2 is found and is worth a scroll', () => {
  const fig = homeworkFigureFor(board, 2);
  assert.ok(fig);
  assert.equal(fig.itemId, 'showGeometryConstructed-2');
  assert.equal(shouldScrollToDedupedItem({ itemPageTitle: fig.pageTitle, currentPageTitle: 'Next', itemsAfterOnPage: 0 }), true);
});

test('an equation is not a figure: problem 1 resolves to its construction, not its working', () => {
  assert.equal(homeworkFigureFor(board, 1)?.itemId, 'showGeometryConstructed-1');
});

test('a problem with no figure on the board resolves to nothing (the tutor draws one if it needs one)', () => {
  assert.equal(homeworkFigureFor(board, 5), null);
  assert.equal(homeworkFigureFor([], 2), null);
});

test('a figure on a page titled by the page grouping ("Problem 2 of 8") is found by its page title', () => {
  const items = [{ itemId: 'showGraph-1', order: 1, action: 'showGraph', pageTitle: 'Problem 2 of 8', pageId: 'p1' }];
  assert.equal(homeworkFigureFor(items, 2)?.itemId, 'showGraph-1');
});

test('the latest figure for a problem wins (a redrawn figure over the first one)', () => {
  const items = [
    { itemId: 'a', order: 1, action: 'showGeometryConstructed', title: 'Problem 2: first try', pageId: 'p1' },
    { itemId: 'b', order: 9, action: 'showGeometryConstructed', title: 'Problem 2: redrawn', pageId: 'p3' },
  ];
  assert.equal(homeworkFigureFor(items, 2)?.itemId, 'b');
});

test('a same-page figure that is still near is left alone (no yank)', () => {
  assert.equal(shouldScrollToDedupedItem({ itemPageTitle: 'Problem 2 of 8', currentPageTitle: 'Problem 2 of 8', itemsAfterOnPage: 1 }), false);
});

test('namedPointsIn ignores a quoted letter and a letter-shape (F4a)', () => {
  const names = (s: string) => [...namedPointsIn(s)].sort().join(',');
  assert.equal(names('Segments AE and BE form a "V" shape that points right, with its vertex at E. Point A is on p.'), 'A,E');
  assert.equal(names('an "L" shape'), '');
  assert.equal(names('a V-shaped notch'), '');
  assert.equal(names('the letter T'), '');
  assert.equal(names('Point V lies on q'), 'V');
  assert.equal(names('a \u201CV\u201D shape'), '');
  assert.equal(names("a 'V' shape"), '');
  assert.equal(names("triangle A'B'C' is the image"), '');
});

// GAC acceptance 2026-10-22 (hw-14 problem 3, the lighthouse): the claims
// named the boats by the sheet's words ("Boat1", "Boat2") and the base as
// "Base"; the figure drew them as P1/P2 labelled "Boat 1"/"Boat 2" and had no
// base point by that name, so every attempt failed and no figure showed.
const HW14_P3_TEXT = 'From the top of a 60 m lighthouse, the angles of depression to two boats are 40° and 28°. How far apart are the boats? [Figure: A vertical lighthouse stands on the left on a horizontal ground line. Its height is labelled 60 m along its left side. A dashed horizontal line extends to the right from the top of the lighthouse. Two sight lines run from the top of the lighthouse down to Boat 1 (the nearer boat) and Boat 2 (the farther boat), both on the ground/water line to the right. 40° is the angle between the dashed line and the line to Boat 1, below the dashed line. 28° is the angle between the dashed line and the line to Boat 2, below the dashed line.]';
const HW14_P3_FIGURE = {"action":"showGeometryConstructed","given":[{"id":"B","kind":"point","x":0,"y":0},{"id":"T","kind":"point","x":0,"y":60},{"id":"P1","kind":"point","x":71.5,"y":0,"label":"Boat 1"},{"id":"P2","kind":"point","x":112.8,"y":0,"label":"Boat 2"},{"id":"H","kind":"point","x":130,"y":60},{"id":"G","kind":"point","x":130,"y":0}],"steps":[{"id":"s_lh","kind":"segment","from":"B","to":"T","label":"60 m"},{"id":"s_ground","kind":"segment","from":"B","to":"G"},{"id":"s_hor","kind":"segment","from":"T","to":"H","style":"dashed"},{"id":"s_1","kind":"segment","from":"T","to":"P1"},{"id":"s_2","kind":"segment","from":"T","to":"P2"},{"id":"a1","kind":"angle_marker","vertex":"T","from":"P1","to":"H","style":"arc","label":"40°"},{"id":"a2","kind":"angle_marker","vertex":"T","from":"P2","to":"H","style":"arc","label":"28°"},{"id":"ar","kind":"angle_marker","vertex":"B","from":"G","to":"T","style":"right"}],"display":{"grid":false,"axes":false}} as unknown as Parameters<typeof validateFigure>[0];
type Claims = Parameters<typeof validateFigure>[1]['claims'];
const hw14 = (claims: Claims) => validateFigure(HW14_P3_FIGURE, { problemText: HW14_P3_TEXT, claims });

test('claims name points by the sheet\'s label; a word no point carries is skipped (F4c)', () => {
  const v = hw14([
    { kind: 'on_segment', point: 'Boat1', segment: ['Base', 'Boat2'] },
    { kind: 'between', point: 'Boat1', ends: ['Base', 'Boat2'] },
  ]);
  assert.deepEqual(v, { ok: true });
});

test('a label-resolved claim is still checked against the drawing (F4c)', () => {
  // Boat 2 is not between B and Boat 1: resolved by label, then it fails on geometry.
  const v = hw14([{ kind: 'between', point: 'Boat 2', ends: ['B', 'Boat1'] }]);
  assert.equal(v.ok, false);
  assert.match(v.ok ? '' : v.reasons.join('; '), /between P2 \[B,P1\] fails/);
  assert.deepEqual(hw14([{ kind: 'between', point: 'boat-1', ends: ['B', 'Boat 2'] }]), { ok: true });
});

test('a missing letter id still fails; a prose word is still skipped (F4c)', () => {
  const q = hw14([{ kind: 'on_segment', point: 'Q', segment: ['B', 'G'] }]);
  assert.equal(q.ok, false);
  assert.match(q.ok ? '' : q.reasons.join('; '), /names Q but the solver has no such point/);
  const p3 = hw14([{ kind: 'on_segment', point: 'P3', segment: ['B', 'G'] }]);
  assert.equal(p3.ok, false);
  assert.deepEqual(hw14([{ kind: 'on_segment', point: 'apex', segment: ['B', 'G'] }]), { ok: true });
});

test('checkClaims resolves through an explicit name map; an ambiguous (null) key stays unresolved (F4c)', () => {
  const pts = { P1: { x: 1, y: 0 }, B: { x: 0, y: 0 }, G: { x: 2, y: 0 }, T: { x: 0, y: 2 } };
  const map = new Map<string, string | null>([['boat1', 'P1'], ['boat', null]]);
  assert.deepEqual(checkClaims(pts, {}, [{ kind: 'between', point: 'Boat 1', ends: ['B', 'G'] }], undefined, map), []);
  assert.match(checkClaims(pts, {}, [{ kind: 'on_segment', point: 'Boat1', segment: ['B', 'T'] }], undefined, map)[0], /on_segment P1 \[B,T\] fails/);
  // "Boat" is ambiguous: unresolved, a word, so the claim is skipped rather than checked against either point.
  assert.deepEqual(checkClaims(pts, {}, [{ kind: 'on_segment', point: 'Boat', segment: ['B', 'T'] }], undefined, map), []);
  // No map: a name is its own id, as before.
  assert.match(checkClaims(pts, {}, [{ kind: 'between', point: 'Boat1', ends: ['B', 'G'] }, { kind: 'between', point: 'Q', ends: ['B', 'G'] }])[0], /between claim names Q but/);
});

test('two points whose labels fold alike: the label resolves to neither, the claim is skipped (F4c)', () => {
  const fig = JSON.parse(JSON.stringify(HW14_P3_FIGURE));
  fig.given[3].label = 'Boat 1';          // P2 now also labelled "Boat 1"
  const v = validateFigure(fig, { problemText: HW14_P3_TEXT, claims: [{ kind: 'on_segment', point: 'Boat1', segment: ['T', 'H'] }] });
  // First-wins would resolve to P1 and fail (P1 is not on TH); ambiguous → unresolved word → skipped.
  assert.deepEqual(v, { ok: true });
});

// Review probe: a point A labelled "A" and A1 labelled "A'" — the fold kept no
// prime, so the claim on A' was checked against A and a correct figure failed.
const PRIME_TEXT = "Point A' is the image of point A, and A' lies on segment A'B.";
const PRIME_FIGURE = { action: 'showGeometryConstructed', given: [
  { id: 'A', kind: 'point', x: 0, y: 2, label: 'A' },
  { id: 'A1', kind: 'point', x: 1, y: 0, label: "A'" },
  { id: 'B', kind: 'point', x: 2, y: 0 },
], steps: [{ id: 's', kind: 'segment', from: 'A1', to: 'B' }], display: { grid: false, axes: false } } as unknown as Parameters<typeof validateFigure>[0];
const prime = (claims: Claims) => validateFigure(PRIME_FIGURE, { problemText: PRIME_TEXT, claims });

test("a primed name keeps its prime: A' resolves to the point labelled A', not A (F4c)", () => {
  assert.deepEqual(prime([{ kind: 'on_segment', point: "A'", segment: ['A1', 'B'] }]), { ok: true });
  assert.deepEqual(prime([{ kind: 'on_segment', point: 'A′', segment: ['A1', 'B'] }]), { ok: true });
});

test("a missing primed id (C', P1') fails like any id; it is not a word (F4c)", () => {
  for (const n of ["C'", 'C′', "P1'"]) {
    const v = prime([{ kind: 'on_segment', point: n, segment: ['A1', 'B'] }]);
    assert.equal(v.ok, false, n);
    assert.match(v.ok ? '' : v.reasons.join('; '), /no such point/, n);
  }
});

// GAC acceptance 2026-10-22 (hw-14 p2): the proposer drew the incircle as an
// `incircle` step (attempt 1) and then as a `circle` centred on a
// `triangle_center` incenter (attempt 2); both were rejected because the claims
// named "incircle" and the validator found "no such circle". Specs verbatim from
// engine.log lines 74 and 79.
const HW14_P2_TEXT = 'The circle is inscribed in △ABC and AC = 13. [Figure: Triangle ABC. A is at the top, B is at the bottom left, and C is at the bottom right. A circle is inscribed in the triangle, tangent to AB at D, to AC at F, and to BC at E. The label 5 is next to segment AD. The label 7 is under segment BE on the base. The label x is beside segment FC.]';
const HW14_P2_GIVEN = [{"id":"A","kind":"point","x":6.667,"y":9.978,"label":"A"},{"id":"B","kind":"point","x":0,"y":0,"label":"B"},{"id":"C","kind":"point","x":15,"y":0,"label":"C"}];
const HW14_P2_TAIL = [{"id":"D","kind":"section_point","of":{"from":"A","to":"B"},"ratio":[5,7],"label":"D"},{"id":"E","kind":"section_point","of":{"from":"B","to":"C"},"ratio":[7,8],"label":"E"},{"id":"F","kind":"section_point","of":{"from":"A","to":"C"},"ratio":[5,8],"label":"F"},{"id":"sAD","kind":"segment","from":"A","to":"D","label":"5"},{"id":"sBE","kind":"segment","from":"B","to":"E","label":"7"},{"id":"sFC","kind":"segment","from":"F","to":"C","label":"x"}];
const HW14_P2_ATTEMPT1 = {"action":"showGeometryConstructed","given":HW14_P2_GIVEN,"steps":[{"id":"tri","kind":"polygon","vertices":["A","B","C"]},{"id":"inc","kind":"incircle","vertices":["A","B","C"]},...HW14_P2_TAIL],"display":{"grid":false,"axes":false}} as unknown as Parameters<typeof validateFigure>[0];
const HW14_P2_ATTEMPT2 = {"action":"showGeometryConstructed","given":HW14_P2_GIVEN,"steps":[{"id":"tri","kind":"polygon","vertices":["A","B","C"]},{"id":"I","kind":"triangle_center","vertices":["A","B","C"],"type":"incenter"},{"id":"inc","kind":"circle","center":"I","radius":3.7417},...HW14_P2_TAIL],"display":{"grid":false,"axes":false}} as unknown as Parameters<typeof validateFigure>[0];
const onIncircle = (circle: string): Claims => ['D', 'E', 'F'].map((point) => ({ kind: 'on_circle' as const, point, circle }));

test('an incircle step registers its circle: D, E, F on "incircle" and on "inc" are checked and hold (F4b)', () => {
  // AB = 12, AC = 13, BC = 15: tangent lengths 5, 7, 8 — the sheet's ratios put D, E, F on the incircle.
  assert.deepEqual(validateFigure(HW14_P2_ATTEMPT1, { problemText: HW14_P2_TEXT, claims: onIncircle('incircle') }), { ok: true });
  assert.deepEqual(validateFigure(HW14_P2_ATTEMPT1, { problemText: HW14_P2_TEXT, claims: onIncircle('inc') }), { ok: true });
});

test('a circle centred on the incenter, aliased by its centre, is still the only circle (F4b)', () => {
  assert.deepEqual(validateFigure(HW14_P2_ATTEMPT2, { problemText: HW14_P2_TEXT, claims: onIncircle('incircle') }), { ok: true });
});

test('an incircle claim is still checked against the drawing: a point off it fails, not "no such circle" (F4b)', () => {
  const v = validateFigure(HW14_P2_ATTEMPT1, { problemText: HW14_P2_TEXT, claims: [{ kind: 'on_circle', point: 'A', circle: 'incircle' }] });
  assert.equal(v.ok, false);
  assert.match(v.ok ? '' : v.reasons.join('; '), /on_circle A incircle fails: A is [\d.]+ off the circle/);
});

test('a circumcircle step registers its circle; with two circles an unknown name is not guessed (F4b)', () => {
  const fig = { action: 'showGeometryConstructed', given: HW14_P2_GIVEN, steps: [
    { id: 'cc', kind: 'circumcircle', vertices: ['A', 'B', 'C'] },
  ], display: { grid: false, axes: false } } as unknown as Parameters<typeof validateFigure>[0];
  const CC_TEXT = 'Points A, B and C lie on a circle. [Figure: Triangle ABC with its vertices A, B and C on its circumscribed circle.]';
  assert.deepEqual(validateFigure(fig, { problemText: CC_TEXT, claims: [{ kind: 'on_circle', point: 'A', circle: 'circumcircle' }] }), { ok: true });
  const two = JSON.parse(JSON.stringify(fig));
  two.steps.push({ id: 'inc', kind: 'incircle', vertices: ['A', 'B', 'C'] });
  assert.deepEqual(validateFigure(two, { problemText: CC_TEXT, claims: [{ kind: 'on_circle', point: 'A', circle: 'cc' }] }), { ok: true });
  // A name that matches an id only after folding ("CC" → "cc") reaches that circle.
  assert.deepEqual(validateFigure(two, { problemText: CC_TEXT, claims: [{ kind: 'on_circle', point: 'A', circle: 'CC' }] }), { ok: true });
  const v = validateFigure(two, { problemText: CC_TEXT, claims: [{ kind: 'on_circle', point: 'A', circle: 'the circle' }] });
  assert.equal(v.ok, false);
  assert.match(v.ok ? '' : v.reasons.join('; '), /names circle the circle but the solver has no such circle/);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);

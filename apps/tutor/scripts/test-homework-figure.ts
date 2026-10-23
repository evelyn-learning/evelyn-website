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
import { namedPointsIn, validateFigure, checkClaims, labelIsFromText } from '../src/lib/tutor/homework-build/figure-validate';
import { numberIsFromText, parseNumberCell } from '../src/lib/tutor/homework-build/figure-text';
import { shouldScrollToDedupedItem } from '../src/lib/tutor/whiteboard/dedup-scroll';
import { normalizeFigureDisplay } from '../src/lib/tutor/homework-build/figure-build';
import { BOX, HIST, DOT, BAR, PIE, HW11_P6, TABLE, NL, SCAT, boxFig, hw11p6Fig, histFig, dotFig, barFig, pieFig, tableFig, nlFig, scatFig, type Fig } from './fixtures/homework-figure-fixtures';

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

test('labelIsFromText: a single token with a trailing degree sign (F5)', () => {
  const T = 'x° at the lower-left vertex, inside the pentagon.';
  assert.equal(labelIsFromText('x°', T), true);
  assert.equal(labelIsFromText('y°', T), false);
  assert.equal(labelIsFromText('42°', '42° at B'), true);
});

test('a graph function written as `expression` is plotted: a labelled point on it holds, one off it fails (final review, F8)', () => {
  const T = 'The line y = 2x + 1 passes through point P.';
  const fig = (y: number) => ({ action: 'showGraph', type: 'function', data: { xLabel: 'x', yLabel: 'y', xRange: [-5, 5], yRange: [-5, 5], functions: [{ expression: '2*x+1' }], points: [{ x: 0, y, label: 'P' }] } }) as unknown as Parameters<typeof validateFigure>[0];
  assert.deepEqual(validateFigure(fig(1), { problemText: T, claims: [] }), { ok: true });
  const off = validateFigure(fig(2), { problemText: T, claims: [] });
  assert.equal(off.ok, false);
  assert.match(off.ok ? '' : off.reasons.join('; '), /point \(0, 2\) is not on any plotted function/);
});

test('labelIsFromText: a point letter inside a compound name (△ABC, AB, OBA) is from the text (G2)', () => {
  const P2TEXT = 'The circle is inscribed in △ABC and AC = 13. [Figure: Triangle ABC with inscribed circle touching AB at D, AC at F, and BC at E. Segment AD = 5, segment BE = 7, segment FC = x.]\n(a) Find x.\n(b) Find the perimeter of △ABC.';
  for (const l of ['A', 'B', 'C', 'D', 'E', 'F', 'x', '5', '7']) assert.equal(labelIsFromText(l, P2TEXT), true, l);
  assert.equal(labelIsFromText('G', P2TEXT), false);
  // Unchanged by G2: the compound token AB is itself a word of the text, so today it passes.
  assert.equal(labelIsFromText('AB', P2TEXT), true);
  const P6TEXT = 'The shaded sector has radius 9 cm and a central angle of 80°. [Figure: Circle with center O. Sector OBA with radius 9 cm and central angle 80° is shaded.]';
  for (const l of ['O', 'B', 'A']) assert.equal(labelIsFromText(l, P6TEXT), true, l);
});


// GAC acceptance 2026-10-22 (hw-14b problem 3, attempt 1): the proposer titled
// the figure "Lighthouse and two boats" and the whole attempt was rejected
// ("label ... does not come from the problem text"). A caption-like title is
// the proposer's own words: dropped from the stored figure, never a failure.
// A title that is a label ("AB = 5") keeps the from-the-text check. (G7)
const HW14B_P3_TEXT = 'From the top of a 60 m lighthouse, the angles of depression to two boats are 40° and 28°. How far apart are the boats?';
const HW14B_P3_ATTEMPT1 = {"action":"showGeometryConstructed","title":"Lighthouse and two boats","given":[{"id":"B","kind":"point","x":0,"y":0},{"id":"T","kind":"point","x":0,"y":60},{"id":"A","kind":"point","x":71.5,"y":0},{"id":"C","kind":"point","x":112.8,"y":0},{"id":"H","kind":"point","x":125,"y":60}],"steps":[{"id":"sTB","kind":"segment","from":"B","to":"T","label":"60 m"},{"id":"sBC","kind":"segment","from":"B","to":"C"},{"id":"sTA","kind":"segment","from":"T","to":"A"},{"id":"sTC","kind":"segment","from":"T","to":"C"},{"id":"sTH","kind":"segment","from":"T","to":"H"},{"id":"m1","kind":"angle_marker","vertex":"T","from":"H","to":"A","style":"arc","label":"40°"},{"id":"m2","kind":"angle_marker","vertex":"T","from":"H","to":"C","style":"arc","label":"28°"},{"id":"m3","kind":"angle_marker","vertex":"B","from":"T","to":"A","style":"right"}],"display":{"grid":false,"axes":false}} as unknown as Parameters<typeof validateFigure>[0];

test('a caption-like figure title is dropped, not fatal; a label-like title is still checked (G7)', () => {
  assert.deepEqual(validateFigure(HW14B_P3_ATTEMPT1, { problemText: HW14B_P3_TEXT, claims: [] }), { ok: true });
  const stored = normalizeFigureDisplay(HW14B_P3_ATTEMPT1, HW14B_P3_TEXT) as { title?: string } | null;
  assert.ok(stored);
  assert.equal(stored.title, undefined, 'the caption is gone from the stored figure');
  assert.equal('title' in stored, false);
  const labelTitle = { ...(HW14B_P3_ATTEMPT1 as object), title: 'AB = 5' } as unknown as Parameters<typeof validateFigure>[0];
  const v = validateFigure(labelTitle, { problemText: HW14B_P3_TEXT, claims: [] });
  assert.equal(v.ok, false, 'a label-like title absent from the text still fails');
  assert.match(v.ok ? '' : v.reasons.join('; '), /AB = 5/);
  assert.equal((normalizeFigureDisplay(labelTitle, HW14B_P3_TEXT) as { title?: string }).title, 'AB = 5', 'a label-like title is not dropped');
});

// GAC acceptance 2026-10-22 (hw-14b problem 5, G5): the sheet shades the four
// circular segments between the circle and the inner square; the stored figure
// drew the inner square as a filled polygon, so the wrong region read as shaded.
// A `region` step (outer minus inner shapes) passes the gate; one naming a shape
// the figure does not have fails by name, not with a solver trace.
const HW14B_P5_TEXT = 'A circle is inscribed in a square with side 12 cm, and a smaller square is inscribed in the circle. Find the area of the shaded region. [Figure: Outer square with side 12 cm. Circle inscribed in outer square. Smaller square inscribed in circle, rotated 45° with vertices at the points where the circle touches the outer square. The four circular segments between the circle and inner square are shaded.]';
const HW14B_P5_STORED = JSON.parse('{"action":"showGeometryConstructed","given":[{"id":"A","kind":"point","x":0,"y":0,"label":""},{"id":"B","kind":"point","x":12,"y":0,"label":""},{"id":"C","kind":"point","x":12,"y":12,"label":""},{"id":"D","kind":"point","x":0,"y":12,"label":""},{"id":"O","kind":"point","x":6,"y":6,"label":""},{"id":"c1","kind":"circle","center":"O","radius":6}],"steps":[{"id":"sAB","kind":"segment","from":"A","to":"B","label":"12 cm"},{"id":"sBC","kind":"segment","from":"B","to":"C"},{"id":"sCD","kind":"segment","from":"C","to":"D"},{"id":"sDA","kind":"segment","from":"D","to":"A"},{"id":"P","kind":"midpoint","of":"sAB","label":""},{"id":"Q","kind":"midpoint","of":"sBC","label":""},{"id":"R","kind":"midpoint","of":"sCD","label":""},{"id":"S","kind":"midpoint","of":"sDA","label":""},{"id":"inner","kind":"polygon","vertices":["P","Q","R","S"]}],"display":{"grid":false,"axes":false,"keepLabels":true}}') as { steps: Array<Record<string, unknown>> };
const p5Region = (region: Record<string, unknown>) => ({
  ...HW14B_P5_STORED,
  steps: [...HW14B_P5_STORED.steps.map((s) => (s.id === 'inner' ? { ...s, fill: 'none' } : s)), region],
}) as unknown as Parameters<typeof validateFigure>[0];
const P5_CLAIMS = ['P', 'Q', 'R', 'S'].map((point) => ({ kind: 'on_circle' as const, point, circle: 'c1' }));

test('the p5 figure with a region step and an unfilled inner square passes the gate (G5)', () => {
  assert.deepEqual(validateFigure(p5Region({ id: 'shade', kind: 'region', outer: 'c1', inner: ['inner'] }), { problemText: HW14B_P5_TEXT, claims: P5_CLAIMS }), { ok: true });
  assert.deepEqual(validateFigure(HW14B_P5_STORED as unknown as Parameters<typeof validateFigure>[0], { problemText: HW14B_P5_TEXT, claims: P5_CLAIMS }), { ok: true }, 'the stored figure without a region still passes');
});

test('a region naming a shape the figure does not have fails honestly, by name (G5)', () => {
  const v = validateFigure(p5Region({ id: 'shade', kind: 'region', outer: 'c9', inner: ['inner'] }), { problemText: HW14B_P5_TEXT, claims: P5_CLAIMS });
  assert.equal(v.ok, false);
  const reasons = v.ok ? [] : v.reasons;
  assert.ok(reasons.includes('region "shade" names c9 but the figure has no such shape'), reasons.join(' | '));
  assert.ok(!reasons.some((r) => /solver rejected/.test(r)), `named, not a solver trace: ${reasons.join(' | ')}`);
  const inner = validateFigure(p5Region({ id: 'shade', kind: 'region', outer: 'c1', inner: ['inner', 'sq2'] }), { problemText: HW14B_P5_TEXT, claims: P5_CLAIMS });
  assert.ok(!inner.ok && inner.reasons.includes('region "shade" names sq2 but the figure has no such shape'), inner.ok ? 'passed' : inner.reasons.join(' | '));
  // A shape that exists but is not an area (a segment) is still the solver's refusal, named by step.
  const seg = validateFigure(p5Region({ id: 'shade', kind: 'region', outer: 'sAB' }), { problemText: HW14B_P5_TEXT, claims: P5_CLAIMS });
  assert.ok(!seg.ok && seg.reasons.some((r) => /region "shade"/.test(r) && /not a circle or polygon/.test(r)), seg.ok ? 'passed' : seg.reasons.join(' | '));
});

// GAC acceptance 2026-10-22 (hw-14b problem 1, G1): the photo read described
// the figure as a "<" shape with E on the left; the sheet has E to the RIGHT of
// A and B (a ">"). The proposer drew the read faithfully and nothing checked
// orientation. Stated relative positions are now claims checked on the drawing.
const HW14B_P1_TEXT = "Lines p ∥ q. Point E lies between them. [Figure: Two horizontal parallel lines p (top) and q (bottom). Point A is on p, point B is on q, point E is between the lines. Segments AE and BE form a \"<\" shape. Angle at A (below line p, right of AE): (3x + 8)°. Angle AEB at E (left side, between EA and EB): (5x − 4)°. Angle at B (above line q, right of BE): 42°. Angle 1 at B (above line q, left side of BE, extending left along q): unlabeled.]";
const HW14B_P1_STORED = {"action":"showGeometryConstructed","given":[{"id":"A","kind":"point","x":2,"y":4,"label":"A"},{"id":"B","kind":"point","x":2,"y":0,"label":"B"},{"id":"E","kind":"point","x":-1,"y":2,"label":"E"},{"id":"PL","kind":"point","x":-4,"y":4,"label":""},{"id":"PR","kind":"point","x":6,"y":4,"label":""},{"id":"QL","kind":"point","x":-4,"y":0,"label":""},{"id":"QR","kind":"point","x":6,"y":0,"label":""}],"steps":[{"id":"p","kind":"line","through":["PL","PR"],"label":"p"},{"id":"q","kind":"line","through":["QL","QR"],"label":"q"},{"id":"sAE","kind":"segment","from":"A","to":"E"},{"id":"sBE","kind":"segment","from":"B","to":"E"},{"id":"mA","kind":"angle_marker","vertex":"A","from":"E","to":"PR","style":"arc","label":"(3x + 8)°"},{"id":"mE","kind":"angle_marker","vertex":"E","from":"B","to":"A","style":"arc","label":"(5x − 4)°"},{"id":"mB","kind":"angle_marker","vertex":"B","from":"QR","to":"E","style":"arc","label":"42°"},{"id":"m1","kind":"angle_marker","vertex":"B","from":"E","to":"QL","style":"arc","label":"1"}],"display":{"grid":false,"axes":false,"keepLabels":true}};
const mirrorX = (f: typeof HW14B_P1_STORED) => ({ ...f, given: f.given.map((g) => ({ ...g, x: -g.x })) });
const P1_RIGHT: Claims = [{ kind: 'right_of', point: 'E', of: 'A' }, { kind: 'right_of', point: 'E', of: 'B' }];
const p1 = (f: unknown, claims: Claims) => validateFigure(f as Parameters<typeof validateFigure>[0], { problemText: HW14B_P1_TEXT, claims });

test('the stored mirrored p1 figure (E left of A and B) fails a stated right_of, naming the points (G1)', () => {
  assert.deepEqual(p1(HW14B_P1_STORED, []), { ok: true }, 'the stored figure passes with no position claims');
  const v = p1(HW14B_P1_STORED, P1_RIGHT);
  assert.equal(v.ok, false);
  const reasons = v.ok ? [] : v.reasons;
  assert.ok(reasons.includes('right_of E A fails: E is left of A'), reasons.join(' | '));
  assert.ok(reasons.includes('right_of E B fails: E is left of B'), reasons.join(' | '));
});

test('the same figure mirrored in x (E right of A and B) passes the stated right_of (G1)', () => {
  const m = mirrorX(HW14B_P1_STORED);
  assert.equal(m.given.find((g) => g.id === 'E')!.x, 1, 'E really moved to the right');
  assert.equal(m.given.find((g) => g.id === 'A')!.x, -2);
  assert.equal(m.given.find((g) => g.id === 'PR')!.x, -6, 'the helper points that place lines p and q follow');
  assert.deepEqual(p1(m, P1_RIGHT), { ok: true });
  assert.deepEqual(p1(HW14B_P1_STORED, [{ kind: 'left_of', point: 'E', of: 'A' }]), { ok: true });
  const l = p1(m, [{ kind: 'left_of', point: 'E', of: 'A' }]);
  assert.ok(!l.ok && l.reasons.includes('left_of E A fails: E is right of A'), l.ok ? 'passed' : l.reasons.join(' | '));
});

test('above / below on the lighthouse (T above B) hold; the reverse fails; level within tolerance is named (G1)', () => {
  assert.deepEqual(hw14([{ kind: 'above', point: 'T', of: 'B' }, { kind: 'below', point: 'B', of: 'T' }]), { ok: true });
  const v = hw14([{ kind: 'above', point: 'B', of: 'T' }, { kind: 'below', point: 'T', of: 'B' }]);
  const reasons = v.ok ? [] : v.reasons;
  assert.ok(reasons.includes('above B T fails: B is below T'), reasons.join(' | '));
  assert.ok(reasons.includes('below T B fails: T is above B'), reasons.join(' | '));
  // B (0,0) and P1 "Boat 1" (71.5,0) are level: neither above nor below; T and B share x.
  const lv = hw14([{ kind: 'above', point: 'Boat 1', of: 'B' }, { kind: 'right_of', point: 'T', of: 'B' }]);
  const lr = lv.ok ? [] : lv.reasons;
  assert.ok(lr.includes('above P1 B fails: P1 is level with B'), lr.join(' | '));
  assert.ok(lr.includes('right_of T B fails: T is level with B'), lr.join(' | '));
});

test('position claims resolve names like every claim: a prose word is skipped, a missing letter fails (G1)', () => {
  assert.deepEqual(hw14([{ kind: 'left_of', point: 'lighthouse', of: 'Boat1' }]), { ok: true });
  const q = hw14([{ kind: 'left_of', point: 'Q', of: 'B' }]);
  assert.ok(!q.ok && q.reasons.some((r) => /left_of claim names Q but the solver has no such point/.test(r)), q.ok ? 'passed' : q.reasons.join(' | '));
  assert.deepEqual(checkClaims({ A: { x: 0, y: 0 }, B: { x: 1, y: 0 } }, {}, [{ kind: 'left_of', point: 'A', of: 'B' }]), []);
});

// Review of 6be191d6 (controller ruling R4): an inner shape outside or straddling
// the outer would paint a union / XOR silently. Every hole vertex must lie inside
// the outer (within r + dtol of a circle's centre; inside a polygon's bounding
// box ± dtol) — dtol is the claims tolerance, so the p5 inner square, which
// TOUCHES the circle at P, Q, R, S, still passes (asserted above).
test('a region whose inner shape lies outside its outer fails: "is not inside outer" (G5, R4)', () => {
  const far = (outer: string, inner: string[]) => ({
    ...HW14B_P5_STORED,
    given: [...(HW14B_P5_STORED as unknown as { given: unknown[] }).given,
      { id: 'F1', kind: 'point', x: 30, y: 30, label: '' }, { id: 'F2', kind: 'point', x: 34, y: 30, label: '' }, { id: 'F3', kind: 'point', x: 32, y: 34, label: '' },
      { id: 'far', kind: 'polygon', vertices: ['F1', 'F2', 'F3'] },
      { id: 'cfar', kind: 'circle', center: 'F1', radius: 1 }],
    steps: [...HW14B_P5_STORED.steps, { id: 'shade', kind: 'region', outer, inner }],
  }) as unknown as Parameters<typeof validateFigure>[0];
  const v = validateFigure(far('c1', ['far']), { problemText: HW14B_P5_TEXT, claims: P5_CLAIMS });
  assert.ok(!v.ok && v.reasons.includes('region "shade" fails: inner far is not inside outer c1'), v.ok ? 'passed' : v.reasons.join(' | '));
  // A circle hole outside a circle outer, and a polygon/circle hole outside a POLYGON outer, likewise.
  const c = validateFigure(far('c1', ['inner', 'cfar']), { problemText: HW14B_P5_TEXT, claims: P5_CLAIMS });
  assert.ok(!c.ok && c.reasons.includes('region "shade" fails: inner cfar is not inside outer c1') && !c.reasons.some((r) => /inner inner/.test(r)), c.ok ? 'passed' : c.reasons.join(' | '));
  const p = validateFigure(far('inner', ['far']), { problemText: HW14B_P5_TEXT, claims: P5_CLAIMS });
  assert.ok(!p.ok && p.reasons.includes('region "shade" fails: inner far is not inside outer inner'), p.ok ? 'passed' : p.reasons.join(' | '));
  // A straddling hole fails too: the circle c1 is not inside the inner square.
  const s = validateFigure(far('inner', ['c1']), { problemText: HW14B_P5_TEXT, claims: P5_CLAIMS });
  assert.ok(!s.ok && s.reasons.includes('region "shade" fails: inner c1 is not inside outer inner'), s.ok ? 'passed' : s.reasons.join(' | '));
  // The touching case still passes: the inner square's vertices sit ON c1.
  assert.deepEqual(validateFigure(p5Region({ id: 'shade', kind: 'region', outer: 'c1', inner: ['inner'] }), { problemText: HW14B_P5_TEXT, claims: P5_CLAIMS }), { ok: true });
});

// Final review (finding 1): "E is right of segment AB" — a phrasing the read
// sentence invites — named AB as a point and both attempts died on a claim the
// proposer could never satisfy by redrawing. A position claim skips a missing
// name that is not a single-letter id; a missing single letter still fails.
test('a position claim naming a two-letter name (AB) is skipped; a missing single letter still fails (final review)', () => {
  assert.deepEqual(p1(HW14B_P1_STORED, [{ kind: 'right_of', point: 'E', of: 'AB' }]), { ok: true });
  assert.deepEqual(p1(HW14B_P1_STORED, [{ kind: 'above', point: 'AB', of: 'B' }]), { ok: true });
  const q = p1(HW14B_P1_STORED, [{ kind: 'right_of', point: 'E', of: 'Q' }]);
  assert.ok(!q.ok && q.reasons.some((r) => /right_of claim names Q but the solver has no such point/.test(r)), q.ok ? 'passed' : q.reasons.join(' | '));
  // Other kinds keep today's rule: a two-letter id is still a point the figure forgot.
  assert.deepEqual(checkClaims({ A: { x: 0, y: 0 }, B: { x: 1, y: 0 } }, {}, [{ kind: 'on_segment', point: 'PQ', segment: ['A', 'B'] }]), ['on_segment claim names PQ but the solver has no such point']);
});

// Final review (finding 2): m∠AEB names E, A and B on p1/p4.
test('labelIsFromText: a letter inside m∠XYZ is from the text (final review)', () => {
  assert.equal(labelIsFromText('E', 'Find m∠AEB.'), true);
  assert.equal(labelIsFromText('A', 'Find m∠AEB.'), true);
  assert.equal(labelIsFromText('E', 'Find m ∠AEB.'), true);
  assert.equal(labelIsFromText('Z', 'Find m∠AEB.'), false);
});

// Final review (finding 3): the solver round2's every point (≤ 0.005 per axis,
// ≤ 0.0071 off a circle), while dtol is 1e-3 of the extent — 0.002 on a
// figure of extent 2, so an internally tangent circle hole failed at a sample.
const circles = (hole: { x: number; y: number; r: number }, R: number) => ({
  action: 'showGeometryConstructed',
  given: [
    { id: 'O', kind: 'point', x: 0, y: 0, label: '' },
    { id: 'H', kind: 'point', x: hole.x, y: hole.y, label: '' },
    { id: 'co', kind: 'circle', center: 'O', radius: R },
    { id: 'ch', kind: 'circle', center: 'H', radius: hole.r },
  ],
  steps: [{ id: 'shade', kind: 'region', outer: 'co', inner: ['ch'] }],
  display: { grid: false, axes: false },
}) as unknown as Parameters<typeof validateFigure>[0];
const TANGENT_TEXT = 'A small circle is inside a larger circle and touches it at one point. Find the area of the shaded region.';
test('an internally tangent circle hole passes the containment guard on a small figure; one outside still fails (final review)', () => {
  assert.deepEqual(validateFigure(circles({ x: 1, y: 0, r: 1 }, 2), { problemText: TANGENT_TEXT, claims: [] }), { ok: true }, 'extent 4');
  assert.deepEqual(validateFigure(circles({ x: 0.5, y: 0, r: 0.5 }, 1), { problemText: TANGENT_TEXT, claims: [] }), { ok: true }, 'extent 2');
  assert.deepEqual(validateFigure(circles({ x: 0, y: 0.5, r: 0.5 }, 1), { problemText: TANGENT_TEXT, claims: [] }), { ok: true }, 'extent 2, tangent at the top');
  const out = validateFigure(circles({ x: 3, y: 0, r: 0.5 }, 1), { problemText: TANGENT_TEXT, claims: [] });
  assert.ok(!out.ok && out.reasons.includes('region "shade" fails: inner ch is not inside outer co'), out.ok ? 'passed' : out.reasons.join(' | '));
  const poke = validateFigure(circles({ x: 0.52, y: 0, r: 0.5 }, 1), { problemText: TANGENT_TEXT, claims: [] });
  assert.ok(!poke.ok && poke.reasons.includes('region "shade" fails: inner ch is not inside outer co'), poke.ok ? 'passed' : 'a hole poking 0.02 out still fails');
});

test('numberIsFromText: whole tokens, signs, separators, fractions, percentages, small number words', () => {
  const T = (v: number, t: string) => numberIsFromText(v, t);
  assert.ok(T(9, 'the median is ≈ 9 minutes'));
  assert.ok(T(1200, 'a total of 1,200 people'));
  assert.ok(T(-3, 'a closed dot at −3')); assert.ok(!T(3, 'a closed dot at −3'));
  assert.ok(T(0.5, 'shade 1/2 of the bar'));
  assert.ok(T(25, '25% chose red') && T(0.25, '25% chose red'));
  assert.ok(T(10, 'a height of 10 cm') && T(10, 'height 10cm'));
  assert.ok(T(1.5, 'a step of 1.50'));
  assert.ok(T(3, 'three dots at 5') && T(20, 'Twenty students') && T(0, 'zero'));
  // a range states both endpoints
  assert.ok(T(90, 'scores of 90–100') && T(100, 'scores of 90–100'));
  assert.ok(T(90, 'scores of 90-100') && T(100, 'scores of 90-100'));
  assert.ok(T(21, 'twenty-one and 21'));
  // a digit inside another token is not a stated number
  for (const [v, t] of [[1, 'point P1'], [2, 'x2 + 1'], [5, '15 students'], [20, 'in 2023'], [21, 'twenty-one'], [9, 'about 19']] as const) assert.ok(!T(v, t), `${v} in "${t}"`);
  assert.ok(!T(1, 'twenty-one') && !T(20, 'twenty-one'), 'hyphen-joined number words state neither part');
  assert.ok(!T(7, 'seventeen') && !T(25, 'twenty five'));
  assert.equal(parseNumberCell('1,200'), 1200); assert.equal(parseNumberCell('3/4'), 0.75); assert.equal(parseNumberCell('Red'), null);
  assert.equal(parseNumberCell('25%'), 25); assert.equal(parseNumberCell('−3.5'), -3.5); assert.equal(parseNumberCell('10 cm'), 10);
  assert.equal(parseNumberCell('x2'), null); assert.equal(parseNumberCell('1/0'), null); assert.equal(parseNumberCell(''), null);
});

// ---------------------------------------------------------------- stats family (Task 4)

const statsOk = (fig: Fig, text: string, vocabulary?: 'all' | 'geometry') => validateFigure(fig, { problemText: text, claims: [], vocabulary });
const statsFails = (fig: Fig, text: string, re: RegExp) => {
  const v = statsOk(fig, text);
  assert.ok(!v.ok, `expected a failure matching ${re}, got ok`);
  assert.ok(v.reasons.some((r) => re.test(r)), `no reason matches ${re}: ${v.reasons.join(' | ')}`);
};
const withBox = (f: Fig, patch: Record<string, unknown>) => {
  const o = f as unknown as { boxplot: { datasets: Array<Record<string, unknown>> } };
  Object.assign(o.boxplot.datasets[0], patch);
  return f;
};

test('box plot: the stated five numbers pass', () => {
  assert.deepEqual(statsOk(boxFig(), BOX), { ok: true });
});
test('box plot: an answer value fails on provenance (q3 42, title "IQR = 21")', () => {
  statsFails(withBox(boxFig(), { q3: 42 }), BOX, /number 42 .*does not come from the problem text/);
  statsFails(Object.assign(boxFig(), { title: 'IQR = 21' }), BOX, /label "IQR = 21"/);
});
test('box plot: five numbers out of order fail structurally', () => {
  statsFails(withBox(boxFig(), { q1: 35 }), BOX, /min ≤ q1 ≤ median ≤ q3 ≤ max fails/);
  statsFails(Object.assign(boxFig(), { boxplot: { datasets: [] } }), BOX, /at least one/);
  statsFails(withBox(boxFig(), { outliers: [30] }), BOX, /outlier 30 is inside the whiskers/);
});
test('hw-11 p6 (stored text): good passes; IQR/range answers fail; q1 and q3 swapped fails', () => {
  assert.deepEqual(statsOk(hw11p6Fig(), HW11_P6), { ok: true });
  statsFails(withBox(hw11p6Fig(), { max: 38 }), HW11_P6, /number 38 .*does not come from the problem text/);
  statsFails(Object.assign(hw11p6Fig(), { title: 'IQR = 16' }), HW11_P6, /label "IQR = 16"/);
  statsFails(withBox(hw11p6Fig(), { q1: 33, q3: 17 }), HW11_P6, /min ≤ q1 ≤ median ≤ q3 ≤ max fails/);
});

test('histogram: the stated bins pass', () => {
  assert.deepEqual(statsOk(histFig(), HIST), { ok: true });
});
test('histogram: a bin the text does not state fails on provenance', () => {
  const f = histFig() as unknown as { bins: number[][] };
  f.bins.push([100, 110, 2]);
  statsFails(f as unknown as Fig, HIST, /number 110/);
});
test('histogram: gapped bins and raw data fail structurally', () => {
  statsFails(Object.assign(histFig(), { bins: [[50, 60, 3], [65, 70, 7]] }), HIST, /not contiguous at 60 \/ 65/);
  statsFails(Object.assign(histFig(), { data: [55, 61] }), HIST, /takes bins only/);
  statsFails(Object.assign(histFig(), { bins: [[60, 50, 3]] }), HIST, /lo < hi/);
  statsFails(Object.assign(histFig(), { bins: [[50, 60, 2.5]] }), HIST, /non-negative integer/);
});

test('dot plot: the stated counts pass', () => {
  assert.deepEqual(statsOk(dotFig(), DOT), { ok: true });
});
test('dot plot: a count the text does not state fails', () => {
  statsFails(Object.assign(dotFig(), { data: [0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 4] }), DOT, /5 dots at 1/);
  statsFails(Object.assign(dotFig(), { data: [0, 0, 1, 1, 1, 1, 2, 2, 2, 7] }), DOT, /number 7/);
});
test('dot plot: empty data fails structurally', () => {
  statsFails(Object.assign(dotFig(), { data: [] }), DOT, /non-empty/);
});

test('bar: the stated categories and values pass', () => {
  assert.deepEqual(statsOk(barFig(), BAR), { ok: true });
});
test('bar: a value the text does not state fails', () => {
  statsFails(Object.assign(barFig(), { bar: { categories: ['Apple', 'Banana', 'Cherry'], values: [8, 5, 4] } }), BAR, /number 4/);
  statsFails(Object.assign(barFig(), { bar: { categories: ['Apple', 'Banana', 'Kiwi'], values: [8, 5, 3] } }), BAR, /label "Kiwi"/);
});
test('bar: 3 categories and 2 values fail structurally', () => {
  statsFails(Object.assign(barFig(), { bar: { categories: ['Apple', 'Banana', 'Cherry'], values: [8, 5] } }), BAR, /categories and values/);
});

test('pie: the stated slices pass', () => {
  assert.deepEqual(statsOk(pieFig(), PIE), { ok: true });
});
test('pie: computed percentages fail; stated ones pass', () => {
  const f = pieFig() as unknown as { pie: Record<string, unknown> };
  f.pie.showPercentages = true;
  statsFails(f as unknown as Fig, PIE, /computed, not stated/);
  const stated = 'A pie chart: Red 10 (25%), Blue 18 (45%), Green 12 (30%).';
  assert.deepEqual(statsOk(f as unknown as Fig, stated), { ok: true });
  statsFails(Object.assign(pieFig(), { showPercentages: true }), PIE, /showStats field "showPercentages" is not used by a pie/);
});
test('pie: a zero slice and a single slice fail structurally', () => {
  statsFails(Object.assign(pieFig(), { pie: { slices: [{ label: 'Red', value: 0 }, { label: 'Blue', value: 18 }] } }), PIE, /pie slice "Red" value must be positive/);
  statsFails(Object.assign(pieFig(), { pie: { slices: [{ label: 'Red', value: 10 }] } }), PIE, /at least two/);
});

test('stats: a field the type does not use is rejected', () => {
  statsFails(Object.assign(barFig(), { bins: [[0, 1, 1]] }), BAR, /showStats field "bins" is not used by a bar/);
  statsFails(Object.assign(boxFig(), { yLabel: 'Minutes' }), BOX, /showStats field "yLabel" is not used by a boxplot/);
});
test('stats: distribution and scatter types are unsupported', () => {
  for (const t of ['distribution', 'scatter', 'scatterplot', 'scatterplot_regression']) {
    statsFails({ action: 'showStats', type: t } as unknown as Fig, BOX, new RegExp(`unsupported figure kind "showStats:${t}"`));
  }
});
test('stats: the kill switch (geometry) rejects a good box plot', () => {
  assert.deepEqual(statsOk(boxFig(), BOX, 'geometry'), { ok: false, reasons: ['unsupported figure kind "showStats:boxplot"'] });
});

// ---------------------------------------------------------------- table and number line (Task 5)

const rowsOf = (f: Fig) => (f as unknown as { rows: string[][] }).rows;

test('table: the stated headers and rows pass', () => {
  assert.deepEqual(statsOk(tableFig(), TABLE), { ok: true });
});
test('table: an answer row (Total 17) fails on provenance', () => {
  const f = tableFig(); rowsOf(f).push(['Total', '17']);
  statsFails(f, TABLE, /table cell "17" does not come from the problem text/);
});
test('table: a ragged row fails structurally (rows are numbered from 1)', () => {
  const f = tableFig(); rowsOf(f)[1] = ['2', '6', '9'];
  statsFails(f, TABLE, /table row 2 has 3 cells, headers have 2/);
});
test('table: a cell the sheet leaves blank is ""; a stated number beside it passes', () => {
  const f = tableFig(); rowsOf(f).push(['5', '']);
  assert.deepEqual(statsOk(f, TABLE), { ok: true });
});
test('table: no headers or no rows fails structurally', () => {
  statsFails(Object.assign(tableFig(), { headers: [] }), TABLE, /at least one header/);
  statsFails(Object.assign(tableFig(), { rows: [] }), TABLE, /at least one row/);
});
test('table: a stem-and-leaf display as two columns passes the same rules', () => {
  const text = '[Figure: A stem-and-leaf plot. Stem 1 | Leaf 2 5 8; Stem 2 | Leaf 0 3; Key: 1 | 2 means 12.]';
  const f = { action: 'showTable', headers: ['Stem', 'Leaf'], rows: [['1', '2 5 8'], ['2', '0 3']] } as unknown as Fig;
  assert.deepEqual(statsOk(f, text), { ok: true });
});
test('table: a 40-row table is valid data', () => {
  const rows = Array.from({ length: 40 }, (_, i) => [String(i + 1), String(2 * (i + 1))]);
  const text = `[Figure: A table of x and y: ${rows.map((r) => `${r[0]} – ${r[1]}`).join(', ')}.]`;
  assert.deepEqual(statsOk({ action: 'showTable', headers: ['x', 'y'], rows } as unknown as Fig, text), { ok: true });
});

test('number line: the stated open circle and ray pass', () => {
  assert.deepEqual(statsOk(nlFig(), NL), { ok: true });
});
test('number line: an answer label (x > -2) fails on provenance', () => {
  const f = nlFig() as unknown as { points: Array<Record<string, unknown>> };
  f.points[0].label = 'x > -2';
  statsFails(f as unknown as Fig, NL, /label "x > -2"/);
});
test('number line: a point outside [min, max] fails structurally', () => {
  const f = nlFig() as unknown as { points: Array<Record<string, unknown>> };
  f.points.push({ value: 7 });
  statsFails(f as unknown as Fig, NL, /number line point 7 is outside \[-5, 5\]/);
});
test('number line: a point or interval end the text does not state fails; min/max/step are scaffolding', () => {
  const f = nlFig() as unknown as { points: Array<Record<string, unknown>>; intervals: Array<Record<string, unknown>> };
  f.points.push({ value: 3 });
  statsFails(f as unknown as Fig, NL, /number 3 .*does not come from the problem text/);
  const g = nlFig() as unknown as { intervals: Array<Record<string, unknown>> };
  g.intervals[0].to = 4;
  statsFails(g as unknown as Fig, NL, /number 4 .*does not come from the problem text/);
  // a wider axis than the sheet's, and an unstated step, are scaffolding
  assert.deepEqual(statsOk(Object.assign(nlFig(), { min: -6, max: 6, step: 2 }), NL), { ok: true });
});
test('number line: min ≥ max, step ≤ 0 and an unused field fail structurally', () => {
  statsFails(Object.assign(nlFig(), { min: 5, max: -5 }), NL, /min < max/);
  statsFails(Object.assign(nlFig(), { step: 0 }), NL, /step must be > 0/);
  statsFails(Object.assign(nlFig(), { data: [1] }), NL, /showNumberLine field "data" is not used/);
});
test('number line: an unstated fraction-tick denominator fails', () => {
  statsFails(Object.assign(nlFig(), { fractionTicks: { denominator: 3 } }), NL, /number 3 .*fractionTicks/);
});
test('table and number line: the kill switch (geometry) rejects them', () => {
  assert.deepEqual(statsOk(tableFig(), TABLE, 'geometry'), { ok: false, reasons: ['unsupported figure kind "showTable"'] });
  assert.deepEqual(statsOk(nlFig(), NL, 'geometry'), { ok: false, reasons: ['unsupported figure kind "showNumberLine"'] });
});

// ---------------------------------------------------------------- scatter plot (Task 6)

const ptsOf = (f: Fig) => (f as unknown as { points: Array<Record<string, unknown>> }).points;

test('scatter: the five stated points pass', () => {
  assert.deepEqual(statsOk(scatFig(), SCAT), { ok: true });
});
test('scatter: an extra (predicted) point fails on provenance', () => {
  const f = scatFig(); ptsOf(f).push({ x: 6, y: 93 });
  statsFails(f, SCAT, /number (6|93) /);
});
test('scatter: a trend line is always rejected (computed R²), even with a stated equation', () => {
  statsFails(Object.assign(scatFig(), { showTrendLine: true }), SCAT, /a trend line is drawn by least squares with a computed R²; it is never part of a homework figure/);
  statsFails(Object.assign(scatFig(), { trendLineEquation: 'y = 6.4x + 56' }), SCAT, /computed R²/);
});
test('scatter: no points or a non-numeric point fails structurally', () => {
  statsFails(Object.assign(scatFig(), { points: [] }), SCAT, /at least one point/);
  const f = scatFig(); ptsOf(f)[0].y = 'sixty';
  statsFails(f, SCAT, /scatter point 0: x and y must be finite numbers/);
});
test('scatter: labels, series, title and notes come from the text; ranges are scaffolding', () => {
  statsFails(Object.assign(scatFig(), { title: 'Strong positive correlation' }), SCAT, /label "Strong positive correlation"/);
  statsFails(Object.assign(scatFig(), { notes: 'r = 0.99' }), SCAT, /label "r = 0.99"/);
  const f = scatFig(); ptsOf(f)[0].series = 'Outlier';
  statsFails(f, SCAT, /label "Outlier"/);
  assert.deepEqual(statsOk(Object.assign(scatFig(), { xRange: [0, 6], yRange: [50, 100], xLabel: 'hours studied', yLabel: 'score' }), SCAT), { ok: true });
});
test('scatter: the kill switch (geometry) rejects it', () => {
  assert.deepEqual(statsOk(scatFig(), SCAT, 'geometry'), { ok: false, reasons: ['unsupported figure kind "showScatterPlot"'] });
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);

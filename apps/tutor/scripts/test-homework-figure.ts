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
import { BOX, HIST, DOT, BAR, PIE, HW11_P6, TABLE, NL, SCAT, boxFig, hw11p6Fig, histFig, dotFig, barFig, pieFig, tableFig, nlFig, scatFig, CONE, SLANT, HW910_P4, coneFig, hw910p4Fig, VENN, VENN3, TREE, vennFig, venn3Fig, treeFig, FRAC, TAPE, AREA, fracFig, tapeFig, areaFig, CP, TR, INEQ, GRID, cpFig, ineqFig, gridFig, type Fig } from './fixtures/homework-figure-fixtures';

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
test('number line: an interval end at the axis bound is checked like any other (the board draws a circle there, never a ray)', () => {
  // The solution of an inequality the student solves: 3 and 10 are not stated, and the bounds exempt nothing.
  const solve = 'Solve 2x + 1 > 7 and graph the solution on a number line.';
  statsFails({ action: 'showNumberLine', min: 3, max: 10, step: 1, intervals: [{ from: 3, to: 10 }] } as unknown as Fig, solve, /number 3 in intervals\[0\]\.from does not come from the problem text/);
  statsFails({ action: 'showNumberLine', min: 0, max: 10, step: 1, intervals: [{ from: 3, to: 10 }] } as unknown as Fig, solve, /number 10 in intervals\[0\]\.to/);
  // A stated bounded interval passes.
  const bounded = '[Figure: A number line from 0 to 10 with the interval from 2 to 7 shaded, a closed circle at 2 and an open circle at 7.]';
  assert.deepEqual(statsOk({ action: 'showNumberLine', min: 0, max: 10, step: 1, intervals: [{ from: 2, to: 7, fromInclusive: true }] } as unknown as Fig, bounded), { ok: true });
  // The old ray fixture: an interval end at the bound passes only when that number is stated (here 5, the sheet's axis end) …
  assert.deepEqual(statsOk(nlFig(), NL), { ok: true });
  // … and fails when it is not (a widened axis, the interval run to its unstated end).
  const g = Object.assign(nlFig(), { min: -6, max: 6 }) as unknown as { intervals: Array<Record<string, unknown>> };
  g.intervals[0].to = 6;
  statsFails(g as unknown as Fig, NL, /number 6 in intervals\[0\]\.to does not come from the problem text/);
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

// ---------------------------------------------------------------- 3D solid (Task 7)

const paramsOf = (f: Fig) => (f as unknown as { params: Record<string, unknown> }).params;
const solid = (params: Record<string, unknown>) => ({ action: 'showDiagram', type: 'solid_3d', params }) as unknown as Fig;

test('solid_3d: the stated cone passes', () => {
  assert.deepEqual(statsOk(coneFig(), CONE), { ok: true });
});
test('solid_3d: an answer in the title fails as a label', () => {
  const f = coneFig(); paramsOf(f).title = 'V = 48π';
  statsFails(f, CONE, /label "V = 48π"/);
});
test('solid_3d: a computed height on a cone stated by slant height fails on provenance', () => {
  statsFails(solid({ shape: 'cone', dims: { radius: 3, height: 4 } }), SLANT, /number 4/);
});
test('solid_3d: a missing dim fails (the solver would draw its default)', () => {
  statsFails(solid({ shape: 'cone', dims: { radius: 4 } }), CONE, /solid_3d cone needs dims radius, height/);
  statsFails(solid({ shape: 'cone' }), CONE, /needs dims radius, height/);
});
test('solid_3d: an alias or unknown shape fails (the solver would map or fall back)', () => {
  statsFails(solid({ shape: 'pyramid', dims: { base: 4, height: 9 } }), CONE, /solid_3d shape "pyramid" is not one of/);
  statsFails(solid({ shape: 'ball', dims: { radius: 4 } }), CONE, /is not one of/);
  statsFails(solid({ shape: 'torus', dims: { radius: 4 } }), CONE, /is not one of/);
});
test('solid_3d: an extra dim, a bad dim value, or an unread param fails', () => {
  statsFails(solid({ shape: 'cone', dims: { radius: 4, height: 9, slant: 9 } }), CONE, /solid_3d dim "slant" is not drawn for a cone/);
  statsFails(solid({ shape: 'cone', dims: { radius: 4, height: -9 } }), CONE, /height/);
  statsFails(solid({ shape: 'cone', dims: { radius: 4, height: '9' } }), CONE, /height/);
  statsFails(solid({ shape: 'cone', dimensions: { radius: 4, height: 9 } }), CONE, /solid_3d param "dimensions"/);
});
test('solid_3d: a sphere has no net', () => {
  statsFails(solid({ shape: 'sphere', dims: { radius: 2 }, showNet: true }), 'sphere of radius 2', /no net/);
  assert.deepEqual(statsOk(solid({ shape: 'sphere', dims: { radius: 2 } }), 'sphere of radius 2'), { ok: true });
});
test('solid_3d: every shape with its stated dims passes; a net on a prism passes', () => {
  const T = 'side 2, length 3, width 4, height 5, base 6, triHeight 7, radius 8';
  assert.deepEqual(statsOk(solid({ shape: 'cube', dims: { side: 2 }, showNet: true }), T), { ok: true });
  assert.deepEqual(statsOk(solid({ shape: 'rectangular_prism', dims: { length: 3, width: 4, height: 5 } }), T), { ok: true });
  assert.deepEqual(statsOk(solid({ shape: 'triangular_prism', dims: { base: 6, triHeight: 7, length: 3 } }), T), { ok: true });
  assert.deepEqual(statsOk(solid({ shape: 'cylinder', dims: { radius: 8, height: 5 } }), T), { ok: true });
  assert.deepEqual(statsOk(solid({ shape: 'square_pyramid', dims: { base: 6, height: 5 } }), T), { ok: true });
});
test('solid_3d: other diagram kinds are unsupported until their task', () => {
  assert.deepEqual(statsOk({ action: 'showDiagram', type: 'supply_demand', params: {} } as unknown as Fig, CONE),
    { ok: false, reasons: ['unsupported figure kind "showDiagram:supply_demand"'] });
});
test('solid_3d: the kill switch (geometry) rejects it', () => {
  assert.deepEqual(statsOk(coneFig(), CONE, 'geometry'), { ok: false, reasons: ['unsupported figure kind "showDiagram:solid_3d"'] });
});
test('solid_3d: hw-9/10 p4 cone (hand-written): good passes, the slant height fails, a missing height fails', () => {
  assert.deepEqual(statsOk(hw910p4Fig(), HW910_P4), { ok: true });
  const f = hw910p4Fig(); (paramsOf(f).dims as Record<string, number>).height = 13;
  statsFails(f, HW910_P4, /number 13/);
  statsFails(solid({ shape: 'cone', dims: { radius: 5 } }), HW910_P4, /needs dims radius, height/);
});

// ---------------------------------------------------------------- Venn and tree diagrams (Task 14)

type Obj = Record<string, unknown>;
const regionsOf = (f: Fig) => (f as unknown as { regions: Record<string, Obj> }).regions;
const rootOf = (f: Fig) => (f as unknown as { root: Obj }).root;
const kids = (n: Obj) => n.children as Array<Obj & { node: Obj }>;

test('venn: the stated two-set diagram passes; a three-set one passes', () => {
  assert.deepEqual(statsOk(vennFig(), VENN), { ok: true });
  assert.deepEqual(statsOk(venn3Fig(), VENN3), { ok: true });
});
test('venn: a region count the sheet does not state fails on provenance', () => {
  const f = vennFig(); regionsOf(f).intersection.value = '6';
  statsFails(f, VENN, /number 6|"6"/);
});
test('venn: a region key of the other set count fails structurally', () => {
  const f = vennFig(); regionsOf(f).ABC = { value: '5' };
  statsFails(f, VENN, /does not belong to 2 sets/);
  const g = venn3Fig(); regionsOf(g).intersection = { value: '1' };
  statsFails(g, VENN3, /Venn region "intersection" does not belong to 3 sets/);
});
test('venn: one or four sets, an unlabelled set, an unused field or a bad items list fails', () => {
  statsFails({ ...vennFig(), sets: [{ label: 'Soccer' }] } as unknown as Fig, VENN, /2 or 3 sets/);
  statsFails({ ...vennFig(), sets: [{ label: 'Soccer' }, { label: 'Band' }, { label: 'Soccer' }, { label: 'Band' }] } as unknown as Fig, VENN, /2 or 3 sets/);
  statsFails({ ...vennFig(), sets: [{ label: 'Soccer' }, {}] } as unknown as Fig, VENN, /set 1 needs a label/);
  statsFails({ ...vennFig(), showCounts: true } as unknown as Fig, VENN, /field "showCounts" is not used/);
  const f = vennFig(); regionsOf(f).onlyA = { items: 'Ana' };
  statsFails(f, VENN, /items must be an array/);
  statsFails({ ...vennFig(), regions: [] } as unknown as Fig, VENN, /regions must be an object/);
});
test('venn: set labels, items, title and universal label come from the text', () => {
  statsFails({ ...vennFig(), sets: [{ label: 'Soccer' }, { label: 'Chess' }] } as unknown as Fig, VENN, /label "Chess"/);
  statsFails({ ...vennFig(), title: 'Clubs' } as unknown as Fig, VENN, /label "Clubs"/);
  assert.deepEqual(statsOk({ ...vennFig(), universalLabel: '30 students' } as unknown as Fig, VENN), { ok: true });
  statsFails({ ...vennFig(), universalLabel: '31 students' } as unknown as Fig, VENN, /label "31 students"/);
  const f = vennFig(); regionsOf(f).onlyA = { items: ['Ana'] };
  statsFails(f, VENN, /label "Ana"/);
  const t = 'Sets: A = {1, 2, 3}, B = {2, 4}. [Figure: A Venn diagram of A and B.]';
  assert.deepEqual(statsOk({ action: 'showVennDiagram', sets: [{ label: 'A' }, { label: 'B' }], regions: { onlyA: { items: ['1', '3'] }, intersection: { items: ['2'] }, onlyB: { items: ['4'] } } } as unknown as Fig, t), { ok: true });
});
test('venn: the kill switch (geometry) rejects it', () => {
  assert.deepEqual(statsOk(vennFig(), VENN, 'geometry'), { ok: false, reasons: ['unsupported figure kind "showVennDiagram"'] });
});

test('tree: the stated probability tree passes (no root label needed)', () => {
  assert.deepEqual(statsOk(treeFig(), TREE), { ok: true });
});
test('tree: leaf probabilities are computed products and fail unless every one is stated', () => {
  statsFails({ ...treeFig(), showLeafProbabilities: true } as unknown as Fig, TREE, /computed products/);
  const stated = `${TREE} The leaf probabilities are 1/10, 3/10, 3/10 and 3/10.`;
  assert.deepEqual(statsOk({ ...treeFig(), showLeafProbabilities: true } as unknown as Fig, stated), { ok: true });
});
test('tree: a branch probability or node value the sheet does not state fails on provenance', () => {
  const f = treeFig(); kids(kids(rootOf(f))[0].node)[0].probability = '1/10';
  statsFails(f, TREE, /probability "1\/10"/);
  const g = treeFig(); kids(rootOf(g))[1].node.value = '3/10';
  statsFails(g, TREE, /number 3\/10 in root\.children\[1\]\.node\.value/);
  const h = treeFig(); kids(rootOf(h))[0].node.label = 'Green';
  statsFails(h, TREE, /label "Green"/);
});
test('tree: a branch with no node, a bad children list, a bad type or a missing root fails structurally', () => {
  const f = treeFig(); delete (kids(rootOf(f))[0] as Obj).node;
  statsFails(f, TREE, /has no node/);
  const g = treeFig(); kids(rootOf(g))[0].node.children = 'Red';
  statsFails(g, TREE, /children must be an array/);
  statsFails({ ...treeFig(), type: 'family' } as unknown as Fig, TREE, /tree type/);
  statsFails({ action: 'showTree', type: 'probability' } as unknown as Fig, TREE, /needs a root/);
  statsFails({ action: 'showTree', root: { label: 'Red' } } as unknown as Fig, TREE, /at least one branch/);
  statsFails({ ...treeFig(), direction: 'left-right' } as unknown as Fig, TREE, /field "direction" is not used/);
  let deep: Obj = { label: 'Red' };
  for (let i = 0; i < 5; i++) deep = { label: 'Red', children: [{ label: '', probability: '2/5', node: deep }] };
  statsFails({ action: 'showTree', root: deep } as unknown as Fig, TREE, /deeper than 4 levels/);
  statsFails({ action: 'showTree', root: { label: '', children: Array.from({ length: 7 }, () => ({ label: '', probability: '2/5', node: { label: 'Red' } })) } } as unknown as Fig, TREE, /more than 6 branches/);
  const p = treeFig(); kids(rootOf(p))[0].probability = '7/5';
  const t = `${TREE} 7/5`;
  const v = statsOk(p, t);
  assert.ok(!v.ok && v.reasons.some((r) => /between 0 and 1/.test(r)), JSON.stringify(v));
});
test('tree: the kill switch (geometry) rejects it', () => {
  assert.deepEqual(statsOk(treeFig(), TREE, 'geometry'), { ok: false, reasons: ['unsupported figure kind "showTree"'] });
});

// ---------------------------------------------------------------- fraction bar, tape diagram, area model (Task 15)

const itemsOf = (f: Fig) => (f as unknown as { items: Obj[] }).items;
const pOf = (f: Fig) => (f as unknown as { params: Obj }).params;
const barsOf = (f: Fig) => pOf(f).bars as Array<Obj & { segments: Obj[] }>;

test('fraction bar: the stated bars pass (numerator/denominator read as the stated fraction)', () => {
  assert.deepEqual(statsOk(fracFig(), FRAC), { ok: true });
  assert.deepEqual(statsOk({ ...fracFig(), title: 'fraction bars', layout: 'horizontal' } as unknown as Fig, FRAC), { ok: true });
  // Each part stated on its own also passes (no fraction token needed).
  assert.deepEqual(statsOk({ action: 'showFractionBar', items: [{ numerator: 5, denominator: 8, label: 'Ana', style: 'circle' }] } as unknown as Fig, 'Ana ate 5 of the 8 slices. [Figure: A circle cut into 8 equal parts with 5 shaded, labelled Ana.]'), { ok: true });
});
test('fraction bar: a fraction or label the sheet does not state, or a computed comparison, fails on provenance', () => {
  const f = fracFig(); itemsOf(f)[1].numerator = 1;
  statsFails(f, FRAC, /fraction 1\/3 in items\[1\] does not come from the problem text/);
  const g = fracFig(); itemsOf(g)[0].label = '0.75';
  statsFails(g, FRAC, /"0\.75"/);
  statsFails({ ...fracFig(), showComparison: true } as unknown as Fig, FRAC, /a comparison is computed, not stated/);
});
test('fraction bar: a zero denominator, a negative or fractional numerator, an improper fraction or an unused field fails structurally', () => {
  const f = fracFig(); itemsOf(f)[0].denominator = 0;
  statsFails(f, FRAC, /items\[0\]: denominator must be an integer > 0/);
  const g = fracFig(); itemsOf(g)[0].numerator = -1;
  statsFails(g, FRAC, /items\[0\]: numerator must be an integer ≥ 0/);
  const h = fracFig(); itemsOf(h)[0].numerator = 1.5;
  statsFails(h, FRAC, /numerator must be an integer/);
  const i = fracFig(); itemsOf(i)[0].numerator = 5;
  statsFails(i, `${FRAC} 5/4`, /more shaded parts than parts/);
  statsFails({ action: 'showFractionBar', items: [] } as unknown as Fig, FRAC, /at least one fraction/);
  statsFails({ ...fracFig(), layout: 'grid' } as unknown as Fig, FRAC, /layout/);
  statsFails({ ...fracFig(), shaded: true } as unknown as Fig, FRAC, /field "shaded" is not used/);
  const j = fracFig(); itemsOf(j)[0].style = 'hexagon';
  statsFails(j, FRAC, /style/);
});
test('fraction bar: a fraction matches the text as written, never by value (controller ruling)', () => {
  const T = '[Figure: A fraction bar with 2/4 shaded.]';
  const one = (n: number, d: number) => ({ action: 'showFractionBar', items: [{ numerator: n, denominator: d }] } as unknown as Fig);
  assert.deepEqual(statsOk(one(2, 4), T), { ok: true });
  statsFails(one(1, 2), T, /fraction 1\/2 in items\[0\] does not come from the problem text/);
  // Typesetting variants of the same n/d pass.
  for (const v of ['2 / 4', '2⁄4', '\\frac{2}{4}', '\\dfrac{2}{4}']) assert.deepEqual(statsOk(one(2, 4), `[Figure: A bar with ${v} shaded.]`), { ok: true }, v);
  // A decimal or percent is not the fraction; a longer number is not a match.
  statsFails(one(3, 4), '[Figure: A bar with 0.75 shaded.]', /fraction 3\/4/);
  statsFails(one(2, 4), '[Figure: A bar with 12/45 shaded.]', /fraction 2\/4/);
});
test('fraction bar: the kill switch (geometry) rejects it', () => {
  assert.deepEqual(statsOk(fracFig(), FRAC, 'geometry'), { ok: false, reasons: ['unsupported figure kind "showFractionBar"'] });
});

test('tape diagram: the stated tape passes (unknown parts need no stated length)', () => {
  assert.deepEqual(statsOk(tapeFig(), TAPE), { ok: true });
  const t = 'Sam has 5 more stickers than Jo. [Figure: Two tapes: Jo has one part labelled j; Sam has a part labelled j and a part of 5.]';
  assert.deepEqual(statsOk({ action: 'showDiagram', type: 'tape_diagram', params: { bars: [
    { name: 'Jo', segments: [{ length: 1, label: 'j', unknown: true }] },
    { name: 'Sam', segments: [{ length: 1, label: 'j', unknown: true }, { length: 5, label: '5' }] },
  ] } } as unknown as Fig, t), { ok: true });
});
test('tape diagram: an answer label or a computed part length fails on provenance', () => {
  const f = tapeFig(); barsOf(f)[0].totalLabel = 'x = 8';
  statsFails(f, TAPE, /label "x = 8"/);
  const g = tapeFig(); barsOf(g)[0].segments[0] = { length: 8, label: 'x' };
  statsFails(g, TAPE, /number 8 in params\.bars\[0\]\.segments\[0\]\.length/);
});
test('tape diagram: no bars, an empty or bad segment, or an unused param fails structurally (before the solver can default)', () => {
  statsFails({ action: 'showDiagram', type: 'tape_diagram', params: { bars: [] } } as unknown as Fig, TAPE, /tape_diagram needs at least one bar/);
  const f = tapeFig(); barsOf(f)[0].segments = [];
  statsFails(f, TAPE, /bars\[0\] needs at least one segment/);
  const g = tapeFig(); barsOf(g)[0].segments[0].length = 0;
  statsFails(g, TAPE, /length must be a number > 0/);
  statsFails({ ...tapeFig(), params: { ...pOf(tapeFig()), orientation: 'vertical' } } as unknown as Fig, TAPE, /param "orientation" is not used/);
});
test('tape diagram: the kill switch (geometry) rejects it', () => {
  assert.deepEqual(statsOk(tapeFig(), TAPE, 'geometry'), { ok: false, reasons: ['unsupported figure kind "showDiagram:tape_diagram"'] });
});

test('area model: the split sides pass with showProducts false; stated products or stated cell labels pass', () => {
  assert.deepEqual(statsOk(areaFig(), AREA), { ok: true });
  const stated = `${AREA} The parts are 200, 80, 30 and 12.`;
  assert.deepEqual(statsOk({ action: 'showDiagram', type: 'area_model', params: { rows: [20, 3], cols: [10, 4] } } as unknown as Fig, stated), { ok: true });
  // A full cellLabels matrix replaces every product, so none is drawn.
  const t = `${AREA} The top-left part is labelled A and the others are blank.`;
  assert.deepEqual(statsOk({ action: 'showDiagram', type: 'area_model', params: { rows: [20, 3], cols: [10, 4], cellLabels: [['A', ''], ['', '']] } } as unknown as Fig, t), { ok: true });
});
test('area model: products the student must find fail on provenance (showProducts defaults on); a side not stated fails', () => {
  const f = areaFig(); delete pOf(f).showProducts;
  statsFails(f, AREA, /area model products are computed, not stated; set showProducts false/);
  const g = areaFig(); pOf(g).showProducts = true;
  statsFails(g, AREA, /products are computed/);
  const h = areaFig(); pOf(h).cols = [10, 5];
  statsFails(h, AREA, /number 5 in params\.cols\[1\]/);
  const i = areaFig(); pOf(i).cellLabels = [['200', ''], ['', '']];
  statsFails(i, AREA, /"200"/);
});
test('area model: an empty or non-positive side, a bad cellLabels matrix or an unused param fails structurally', () => {
  const f = areaFig(); pOf(f).rows = [];
  statsFails(f, AREA, /rows must be a non-empty array/);
  const g = areaFig(); pOf(g).cols = [10, -4];
  statsFails(g, AREA, /cols\[1\] must be a number > 0/);
  const h = areaFig(); pOf(h).cellLabels = [['']];
  statsFails(h, AREA, /cellLabels must be a 2×2 matrix/);
  statsFails({ ...areaFig(), params: { ...pOf(areaFig()), showSum: true } } as unknown as Fig, AREA, /param "showSum" is not used/);
});
test('area model: the kill switch (geometry) rejects it', () => {
  assert.deepEqual(statsOk(areaFig(), AREA, 'geometry'), { ok: false, reasons: ['unsupported figure kind "showDiagram:area_model"'] });
});

// ---------------------------------------------------------------- coordinate plane, inequality graph, coordinate grid (Task 16)

const cpPts = (f: Fig) => (f as unknown as { points: Obj[] }).points;
const cpSegs = (f: Fig) => (f as unknown as { segments: Array<Obj & { from: Obj; to: Obj }> }).segments;

test('coordinate plane: the stated triangle passes (vertices, sides, labels; ranges are scaffolding)', () => {
  assert.deepEqual(statsOk(cpFig(), CP), { ok: true });
  // Any range, grid flag or a one-letter axis name passes; ranges are never provenance-checked.
  assert.deepEqual(statsOk({ ...cpFig(), xRange: [-10, 10], yRange: [-3, 9], showGrid: false, xLabel: 'x', yLabel: 'y' } as unknown as Fig, CP), { ok: true });
  // A vector between stated points passes; a vector from the origin (the default tail) passes.
  assert.deepEqual(statsOk({ ...cpFig(), vectors: [{ from: { x: 1, y: 2 }, to: { x: 4, y: 2 } }, { to: { x: 1, y: 6 } }] } as unknown as Fig, CP), { ok: true });
  // A blank plane (a "plot these" grid) passes.
  assert.deepEqual(statsOk({ action: 'showCoordinatePlane', xRange: [-5, 5], yRange: [-5, 5] } as unknown as Fig, CP), { ok: true });
});
test('coordinate plane: a point, vertex or label the sheet does not state fails on provenance', () => {
  // D(4, 6): both numbers happen to be stated (B and C), so the label is what fails.
  const f = cpFig(); cpPts(f).push({ x: 4, y: 6, label: 'D' });
  statsFails(f, CP, /label "D" does not come from the problem text/);
  const g = cpFig(); cpPts(g)[1].x = 7;
  statsFails(g, CP, /number 7 in points\[1\]\.x does not come from the problem text/);
  const h = cpFig(); cpSegs(h)[0].to = { x: 4, y: 5 };
  statsFails(h, CP, /number 5 in segments\[0\]\.to\.y/);
  statsFails({ ...cpFig(), notes: 'Area = 6' } as unknown as Fig, CP, /label "Area = 6"/);
  statsFails({ ...cpFig(), title: 'Triangle with area 6' } as unknown as Fig, CP, /label "Triangle with area 6"/);
});
test('coordinate plane: a transformation image is drawn only when the sheet states it (never computed)', () => {
  const pre = [{ x: 1, y: 2 }, { x: 4, y: 2 }, { x: 1, y: 6 }];
  const image = pre.map((p) => ({ x: -p.x, y: p.y }));
  assert.deepEqual(statsOk({ action: 'showCoordinatePlane', points: pre } as unknown as Fig, TR), { ok: true });
  statsFails({ action: 'showCoordinatePlane', points: [...pre, ...image] } as unknown as Fig, TR, /number -1 in points\[3\]\.x does not come from the problem text/);
  // The sheet states both shapes' vertices: both are drawn.
  const both = 'Triangle ABC has A(1, 2), B(4, 2), C(1, 6); its image after a reflection over the y-axis has vertices (−1, 2), (−4, 2), (−1, 6).';
  assert.deepEqual(statsOk({ action: 'showCoordinatePlane', points: [...pre, ...image] } as unknown as Fig, both), { ok: true });
  // The catalog transformation kind (which computes the image) is not in the vocabulary.
  assert.deepEqual(statsOk({ action: 'showDiagram', type: 'transformation', params: { shape: { type: 'triangle', vertices: pre }, transform: { type: 'reflect', axis: 'y' } } } as unknown as Fig, TR),
    { ok: false, reasons: ['unsupported figure kind "showDiagram:transformation"'] });
});
test('coordinate plane: a bad range, a non-numeric or off-plane point, a bad segment or an unused field fails structurally', () => {
  statsFails({ ...cpFig(), xRange: [5, 1] } as unknown as Fig, CP, /xRange must be \[lo, hi\] with lo < hi/);
  const f = cpFig(); cpPts(f)[0].x = 'one';
  statsFails(f, CP, /points\[0\]: x and y must be finite numbers/);
  statsFails({ ...cpFig(), xRange: [2, 8] } as unknown as Fig, CP, /\(1, 2\) in points\[0\] is outside xRange\/yRange/);
  // No range given: the board's default is −10..10.
  statsFails({ action: 'showCoordinatePlane', points: [{ x: 12, y: 2 }] } as unknown as Fig, '[Figure: the point (12, 2).]', /outside xRange\/yRange/);
  const g = cpFig(); delete cpSegs(g)[0].to;
  statsFails(g, CP, /segments\[0\]: from and to must be \{ x, y \}/);
  statsFails({ ...cpFig(), shading: 'above' } as unknown as Fig, CP, /showCoordinatePlane field "shading" is not used/);
  const h = cpFig(); cpPts(h)[0].size = 3;
  statsFails(h, CP, /points\[0\] field "size" is not used/);
});
test('coordinate plane: the kill switch (geometry) rejects it', () => {
  assert.deepEqual(statsOk(cpFig(), CP, 'geometry'), { ok: false, reasons: ['unsupported figure kind "showCoordinatePlane"'] });
});

test('inequality graph: the stated inequality passes (either way round, any operator spelling)', () => {
  assert.deepEqual(statsOk(ineqFig(), INEQ), { ok: true });
  const one = (operator: string, value: number, variable = 'x') => ({ action: 'showDiagram', type: 'inequality_graph', params: { variable, operator, value, title: undefined } } as unknown as Fig);
  assert.deepEqual(statsOk(one('>=', 3), '[Figure: A number line showing x >= 3.]'), { ok: true });
  assert.deepEqual(statsOk(one('>=', 3), '[Figure: The graph of $x \\geq 3$.]'), { ok: true });
  assert.deepEqual(statsOk(one('<', -2, 'n'), '[Figure: A number line for n < −2 with an open circle at −2.]'), { ok: true });
  // "−2 < x ≤ 5": each half is stated (reversed for the left half).
  assert.deepEqual(statsOk(one('>', -2), '[Figure: A number line for −2 < x ≤ 5.]'), { ok: true });
  assert.deepEqual(statsOk(one('<=', 5), '[Figure: A number line for −2 < x ≤ 5.]'), { ok: true });
});
test('inequality graph: a solution the student must find fails on provenance', () => {
  // The boundary is the answer: 3 is not stated.
  statsFails(ineqFig(), 'Solve 2x + 1 ≥ 7 and graph the solution on a number line.', /number 3 in params\.value does not come from the problem text/);
  // The boundary number is stated, but the inequality x ≥ 3 is the answer, not the sheet's.
  statsFails(ineqFig(), 'Solve 3x ≥ 9 and graph the solution.', /the inequality x >= 3 is not stated in the problem text/);
  // The opposite direction, or a variable the sheet does not use (the solver's default x included).
  const f = ineqFig(); paramsOf(f).operator = '<=';
  statsFails(f, INEQ, /the inequality x <= 3 is not stated/);
  const g = ineqFig(); delete paramsOf(g).variable;
  statsFails(g, '[Figure: A number line showing n ≥ 3.]', /the inequality x >= 3 is not stated/);
  statsFails({ ...ineqFig(), params: { ...paramsOf(ineqFig()), title: 'x = 3 or more' } } as unknown as Fig, INEQ, /label "x = 3 or more"/);
});
test('inequality graph: a bad operator, a non-numeric value or an unused param fails structurally', () => {
  const f = ineqFig(); paramsOf(f).operator = '==';
  statsFails(f, INEQ, /inequality_graph operator must be one of <, >, <=, >=/);
  const g = ineqFig(); paramsOf(g).value = '3';
  statsFails(g, INEQ, /inequality_graph value must be a finite number/);
  statsFails({ ...ineqFig(), params: { ...paramsOf(ineqFig()), shade: 'right' } } as unknown as Fig, INEQ, /inequality_graph param "shade" is not used/);
});
test('inequality graph: the kill switch (geometry) rejects it', () => {
  assert.deepEqual(statsOk(ineqFig(), INEQ, 'geometry'), { ok: false, reasons: ['unsupported figure kind "showDiagram:inequality_graph"'] });
});

test('coordinate grid: the stated points pass (bounds are scaffolding; a blank grid passes)', () => {
  assert.deepEqual(statsOk(gridFig(), GRID), { ok: true });
  assert.deepEqual(statsOk({ ...gridFig(), params: { ...paramsOf(gridFig()), xMin: -5, xMax: 5, yMin: -5, yMax: 5, quadrants: 4, connect: true, title: 'grid' } } as unknown as Fig, GRID), { ok: true });
  assert.deepEqual(statsOk({ action: 'showDiagram', type: 'coordinate_grid', params: {} } as unknown as Fig, GRID), { ok: true });
});
test('coordinate grid: a computed point or unstated label fails on provenance', () => {
  // The midpoint of PQ is the answer.
  const f = gridFig(); (paramsOf(f).points as Obj[]).push({ x: 0.5, y: 3.5, label: 'M' });
  statsFails(f, GRID, /number 0\.5 in params\.points\[2\]\.x does not come from the problem text/);
  const g = gridFig(); (paramsOf(g).points as Obj[])[0].label = 'P(2, 3) midpoint';
  statsFails(g, GRID, /label "P\(2, 3\) midpoint"/);
});
test('coordinate grid: bad points, quadrants, bounds or an unused param fail structurally (before the solver can default)', () => {
  statsFails({ action: 'showDiagram', type: 'coordinate_grid', params: { points: 'P' } } as unknown as Fig, GRID, /coordinate_grid points must be an array/);
  const f = gridFig(); (paramsOf(f).points as Obj[])[0].x = '2';
  statsFails(f, GRID, /params\.points\[0\]: x and y must be finite numbers/);
  statsFails({ ...gridFig(), params: { ...paramsOf(gridFig()), quadrants: 2 } } as unknown as Fig, GRID, /coordinate_grid quadrants must be 1 or 4/);
  statsFails({ ...gridFig(), params: { ...paramsOf(gridFig()), xMax: 'ten' } } as unknown as Fig, GRID, /coordinate_grid xMax must be a finite number/);
  // An explicit bound that leaves a stated point off the grid.
  statsFails({ ...gridFig(), params: { ...paramsOf(gridFig()), xMax: 1 } } as unknown as Fig, GRID, /point \(2, 3\) in params\.points\[0\] is off the grid/);
  statsFails({ ...gridFig(), params: { ...paramsOf(gridFig()), shadeBelow: true } } as unknown as Fig, GRID, /coordinate_grid param "shadeBelow" is not used/);
});
test('coordinate grid: the kill switch (geometry) rejects it', () => {
  assert.deepEqual(statsOk(gridFig(), GRID, 'geometry'), { ok: false, reasons: ['unsupported figure kind "showDiagram:coordinate_grid"'] });
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);

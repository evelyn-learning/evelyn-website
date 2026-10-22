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
import { namedPointsIn, validateFigure } from '../src/lib/tutor/homework-build/figure-validate';
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

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);

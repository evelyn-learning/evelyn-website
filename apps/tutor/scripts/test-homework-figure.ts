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
import { namedPointsIn } from '../src/lib/tutor/homework-build/figure-validate';
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

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);

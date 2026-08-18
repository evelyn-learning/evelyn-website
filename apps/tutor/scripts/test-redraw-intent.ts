/**
 * Redraw-intent supersede (2026-08-17 triage, portal-35b9a5d8): the student
 * asked three times to fix an overlapping timeline; the brain re-rendered
 * three times with fresh titles and NO removeItems, so three timelines
 * stacked on the page — the student kept seeing the old overlap above the
 * "fixed" copy. Generic evolve-in-place couldn't fire: its containment test
 * (deliberately strict — a wrong replace destroys a figure) fails when the
 * brain retitles the redraw. The relaxation: when the student's current
 * turn was a VISUAL COMPLAINT, a new primary figure of the same category
 * replaces the latest same-category item, containment or not.
 *
 * Run: npm run test:redraw-intent
 */

import { strict as assert } from 'node:assert';
import { WhiteboardCatalog, computeAnchorKey } from '../src/lib/tutor/whiteboard/catalog';
import { isVisualComplaint } from '../src/lib/tutor/whiteboard/redraw-intent';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

console.log('isVisualComplaint\n');

// Verbatim from the sessions.
test('35b9a5d8 turn 1: "timeline on the board is a little bit messy… redraw it"', () => {
  assert.equal(isVisualComplaint('Uh, like, by tools, do you mean stuff like the military, et cetera? Also, uh, the timeline on the board is a little bit messy. It\'s like overlapping. Could you please redraw it for me?'), true);
});
test('35b9a5d8 turn 2: "redraw the diagram… it\'s overlapping"', () => {
  assert.equal(isVisualComplaint('Oh, it\'s the taxes. Also, could you please redraw the, the diagram on the board, the timeline, because it\'s overlapping and I can\'t really understand it.'), true);
});
test('35b9a5d8 turn 3: "it\'s still overlapping"', () => {
  assert.equal(isVisualComplaint('Uh, no, not really, sorry. It\'s still overlapping. Like, I can understand it now, but it\'s still overlapping a bit.'), true);
});
test('36fe22eb: "the diagram is kind of like overlapping… remake it"', () => {
  assert.equal(isVisualComplaint('Uh, wait, could you uh, the diagram is kind of like overlapping and I can\'t really read it too well. Could you just remake it, please?'), true);
});

// Negatives — conceptual confusion and ordinary conversation must not arm it.
test('conceptual "I can\'t see how" is not a visual complaint', () => {
  assert.equal(isVisualComplaint('I can\'t see how that follows from the last step.'), false);
});
test('"I don\'t really understand the question" is not a visual complaint', () => {
  assert.equal(isVisualComplaint('Uh, well, I\'m I I don\'t really understand the question too well.'), false);
});
test('"that\'s a messy situation" without a visual noun is not one', () => {
  assert.equal(isVisualComplaint('Wow, that was a really messy situation historically.'), false);
});
test('plain answer is not one', () => {
  assert.equal(isVisualComplaint('Oh, it\'s the taxes.'), false);
});

console.log('\nfindRedrawReplaceTarget\n');

function appendFigure(cat: WhiteboardCatalog, itemId: string, action: string, cmd: Record<string, unknown>) {
  return cat.append({
    itemId,
    action,
    title: typeof cmd.title === 'string' ? cmd.title : undefined,
    anchorKey: computeAnchorKey(action, cmd),
    features: [],
  });
}

const timeline = (title: string) => ({ type: 'historical_timeline', title });

test('the 35b9a5d8 case: retitled timeline redraw finds the prior timeline', () => {
  const cat = new WhiteboardCatalog();
  cat.setCurrentPage('Next');
  cat.setCurrentTurn(1);
  appendFigure(cat, 'showDiagram-1', 'showDiagram', timeline('From Failing Government to New Constitution'));
  cat.setCurrentTurn(2);
  const key = computeAnchorKey('showDiagram', timeline('From Failed Government to New Government'));
  // The strict evolve test refuses (no title containment)…
  assert.equal(cat.findEvolvableFigure(key, 5), null, 'containment test refuses the retitle');
  // …but the redraw-intent relaxation replaces the same-category prior.
  const target = cat.findRedrawReplaceTarget(key, 5);
  assert.ok(target && target.itemId === 'showDiagram-1', 'redraw target is the prior timeline');
});

test('different diagram kind is NOT a redraw target', () => {
  const cat = new WhiteboardCatalog();
  cat.setCurrentPage('Next');
  cat.setCurrentTurn(1);
  appendFigure(cat, 'showDiagram-1', 'showDiagram', { type: 'flowchart_simple', title: 'Bill to Law' });
  cat.setCurrentTurn(2);
  const key = computeAnchorKey('showDiagram', timeline('From the Articles to Ratification'));
  assert.equal(cat.findRedrawReplaceTarget(key, 5), null, 'flowchart is not a timeline');
});

test('a stale same-category figure is NOT yanked', () => {
  const cat = new WhiteboardCatalog();
  cat.setCurrentPage('Next');
  cat.setCurrentTurn(1);
  appendFigure(cat, 'showDiagram-1', 'showDiagram', timeline('Old Timeline'));
  cat.setCurrentTurn(10);
  const key = computeAnchorKey('showDiagram', timeline('New Timeline'));
  assert.equal(cat.findRedrawReplaceTarget(key, 5), null, 'stale prior stays');
});

test('newest same-category prior wins when several exist', () => {
  const cat = new WhiteboardCatalog();
  cat.setCurrentPage('Next');
  cat.setCurrentTurn(1);
  appendFigure(cat, 'showDiagram-1', 'showDiagram', timeline('First'));
  cat.setCurrentTurn(2);
  appendFigure(cat, 'showDiagram-2', 'showDiagram', timeline('Second'));
  cat.setCurrentTurn(3);
  const key = computeAnchorKey('showDiagram', timeline('Third'));
  const target = cat.findRedrawReplaceTarget(key, 5);
  assert.ok(target && target.itemId === 'showDiagram-2', 'latest prior is the one replaced');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);

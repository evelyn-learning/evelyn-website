/**
 * Unit test for the keep-validated-on-kill decision core
 * (src/lib/tutor/whiteboard/kill-keep.ts). Covers: distinct equations both
 * kept, two-figures-same-category pile-up (stale swept / latest kept), a lone
 * validated figure with no superseder kept, and older board content never
 * triggering a false sweep. See project_tutor_validate_before_speak (#5+#7).
 *
 * Run: npm run test:kill-keep
 * No framework — matches test:render-sync / test:page-grouping. Pure.
 */

import { strict as assert } from 'node:assert';
import { decideKillKeep, type KillRenderDesc } from '../apps/marketing/src/lib/tutor/whiteboard/kill-keep';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

/** Non-figure render (equation/text) — unique slot, always coexists. */
const uniq = (id: string, order: number): KillRenderDesc => ({ id, slot: `uniq:${id}`, order });
/** Figure render — slot keyed by category + page. */
const fig = (id: string, order: number, category: string, page = 'p1'): KillRenderDesc =>
  ({ id, slot: `fig:${category}:${page}`, order });

function main() {
  console.log('Keep-validated-on-kill — decideKillKeep\n');

  test('empty → nothing kept or swept', () => {
    const r = decideKillKeep([], []);
    assert.deepEqual(r.keep, []);
    assert.deepEqual(r.sweep, []);
  });

  test('the captured give-up: two distinct equations both KEPT', () => {
    // showEquation-2 and showEquation-3 are different formulas → unique slots.
    const cand = [uniq('showEquation-2', 10), uniq('showEquation-3', 12)];
    const r = decideKillKeep(cand, cand);
    assert.deepEqual(r.keep.sort(), ['showEquation-2', 'showEquation-3']);
    assert.deepEqual(r.sweep, []);
  });

  test('two-BSTs pile-up: stale (earlier) swept, corrected (latest) kept', () => {
    // Wrong BST then corrected BST — same category + page, different content
    // (so evolve-in-place did NOT auto-supersede). Keep the latest.
    const wrong = fig('showDiagram-1', 5, 'showDiagram:binary_search_tree');
    const right = fig('showDiagram-2', 9, 'showDiagram:binary_search_tree');
    const cand = [wrong, right];
    const r = decideKillKeep(cand, cand);
    assert.deepEqual(r.keep, ['showDiagram-2'], 'latest BST kept');
    assert.deepEqual(r.sweep, ['showDiagram-1'], 'stale BST swept');
  });

  test('lone validated figure, no superseder → KEPT', () => {
    const cand = [fig('showGeometryConstructed-1', 7, 'showGeometryConstructed')];
    const r = decideKillKeep(cand, cand);
    assert.deepEqual(r.keep, ['showGeometryConstructed-1']);
    assert.deepEqual(r.sweep, []);
  });

  test('two distinct figures (different page) both kept', () => {
    // Ellipse on p1, hyperbola on p2 — page-grouping keeps distinct figures on
    // distinct pages, so different slots → both survive.
    const ellipse = fig('showGeometryConstructed-1', 4, 'showGeometryConstructed', 'p1');
    const hyperbola = fig('showGeometryConstructed-2', 6, 'showGeometryConstructed', 'p2');
    const cand = [ellipse, hyperbola];
    const r = decideKillKeep(cand, cand);
    assert.deepEqual(r.keep.sort(), ['showGeometryConstructed-1', 'showGeometryConstructed-2']);
    assert.deepEqual(r.sweep, []);
  });

  test('survivor (non-candidate) supersedes an earlier candidate', () => {
    // Path-2 case: a deferred wrong figure (candidate) + the winning figure
    // (survivor, NOT a candidate) in the same slot with higher order → sweep
    // the candidate, and never touch the survivor.
    const wrongDeferred = fig('showDiagram-1', 5, 'showDiagram:binary_search_tree');
    const winningSurvivor = fig('showDiagram-2', 9, 'showDiagram:binary_search_tree');
    const r = decideKillKeep([wrongDeferred], [wrongDeferred, winningSurvivor]);
    assert.deepEqual(r.sweep, ['showDiagram-1']);
    assert.deepEqual(r.keep, []);
    // The survivor is not a candidate, so it appears in neither result.
    const all = [...r.keep, ...r.sweep];
    assert.ok(!all.includes('showDiagram-2'), 'survivor is never in the candidate result');
  });

  test('older board content (lower order) never triggers a false sweep', () => {
    // A prior-turn figure of the same category sits on the board (low order).
    // This turn re-rendered the figure (higher order) and was killed → it is
    // the LATEST in its slot → kept, not swept by the stale old one.
    const oldBoard = fig('showDiagram-1', 2, 'showDiagram:binary_search_tree');
    const thisTurn = fig('showDiagram-7', 11, 'showDiagram:binary_search_tree');
    const r = decideKillKeep([thisTurn], [oldBoard, thisTurn]);
    assert.deepEqual(r.keep, ['showDiagram-7'], 'newest in slot kept');
    assert.deepEqual(r.sweep, []);
  });

  test('mixed: kept equations + swept stale figure in one pass', () => {
    const eq2 = uniq('showEquation-2', 10);
    const eq3 = uniq('showEquation-3', 12);
    const wrongFig = fig('showDiagram-1', 5, 'showDiagram:tree');
    const rightFig = fig('showDiagram-2', 14, 'showDiagram:tree');
    const cand = [eq2, eq3, wrongFig, rightFig];
    const r = decideKillKeep(cand, cand);
    assert.deepEqual(r.keep.sort(), ['showDiagram-2', 'showEquation-2', 'showEquation-3']);
    assert.deepEqual(r.sweep, ['showDiagram-1']);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();

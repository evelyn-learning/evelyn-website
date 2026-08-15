/**
 * Unit test for generic evolve-in-place — catalog.findEvolvableFigure
 * (project_tutor_figure_identity_design). Run: npm run test:figure-evolve
 *
 * No framework — matches the test:page-model / test:board-map pattern.
 * Proves: same-subject recent figure is found; different subjects DON'T merge
 * (the critical negatives); staleness bound; supporting/non-primary skipped;
 * newest-first; generic across figure types.
 */

import { strict as assert } from 'node:assert';
import { WhiteboardCatalog, computeAnchorKey } from '../apps/marketing/src/lib/tutor/whiteboard/catalog';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

const STALE = 5;

/** Append a primary figure stamped with its anchorKey (mirrors the orchestrator). */
function appendFigure(cat: WhiteboardCatalog, itemId: string, action: string, title: string) {
  return cat.append({
    itemId, action, title,
    anchorKey: computeAnchorKey(action, { title }),
    features: [],
  });
}

function main() {
  console.log('Generic evolve-in-place (findEvolvableFigure) — Phase 1\n');

  test('same subject, recent → returns the prior figure (to replace)', () => {
    const cat = new WhiteboardCatalog();
    cat.setCurrentPage('Parabola');
    cat.setCurrentTurn(1);
    appendFigure(cat, 'showGraph-1', 'showFunctionGraph', 'Parabola y² = 4x');
    cat.setCurrentTurn(2);
    // "add tangent" → same subject (title superset)
    const key = computeAnchorKey('showFunctionGraph', { title: 'Parabola y² = 4x with Tangent at t=1' });
    const prior = cat.findEvolvableFigure(key, STALE);
    assert.ok(prior && prior.itemId === 'showGraph-1', 'found the parabola to evolve');
  });

  test('NEGATIVE: two distinct same-type figures do NOT merge', () => {
    const cat = new WhiteboardCatalog();
    cat.setCurrentPage('Charts');
    cat.setCurrentTurn(1);
    appendFigure(cat, 'bar-1', 'showStats', 'Rainfall by Month');
    cat.setCurrentTurn(2);
    const key = computeAnchorKey('showStats', { title: 'Population by Country' });
    assert.equal(cat.findEvolvableFigure(key, STALE), null, 'distinct bar charts stay separate');
  });

  test('NEGATIVE: ellipse vs hyperbola do NOT merge (different subject)', () => {
    const cat = new WhiteboardCatalog();
    cat.setCurrentPage('Conics');
    cat.setCurrentTurn(1);
    appendFigure(cat, 'g-1', 'showFunctionGraph', 'Ellipse x²/9 + y²/4 = 1');
    cat.setCurrentTurn(2);
    const key = computeAnchorKey('showFunctionGraph', { title: 'Hyperbola x²/4 − y²/9 = 1' });
    assert.equal(cat.findEvolvableFigure(key, STALE), null, 'ellipse ≠ hyperbola');
  });

  test('stale prior (beyond staleTurns) → null (treated as fresh)', () => {
    const cat = new WhiteboardCatalog();
    cat.setCurrentPage('Parabola');
    cat.setCurrentTurn(1);
    appendFigure(cat, 'showGraph-1', 'showFunctionGraph', 'Parabola y² = 4x');
    cat.setCurrentTurn(1 + STALE + 1); // 7 turns later
    const key = computeAnchorKey('showFunctionGraph', { title: 'Parabola y² = 4x with Tangent' });
    assert.equal(cat.findEvolvableFigure(key, STALE), null, 'stale figure not yanked');
  });

  test('staleness boundary: exactly staleTurns away → still evolvable', () => {
    const cat = new WhiteboardCatalog();
    cat.setCurrentPage('Parabola');
    cat.setCurrentTurn(1);
    appendFigure(cat, 'showGraph-1', 'showFunctionGraph', 'Parabola y² = 4x');
    cat.setCurrentTurn(1 + STALE); // exactly at the bound
    const key = computeAnchorKey('showFunctionGraph', { title: 'Parabola y² = 4x with Tangent' });
    assert.ok(cat.findEvolvableFigure(key, STALE), 'at the bound is still evolvable');
  });

  test('supporting renders (no anchorKey) are skipped', () => {
    const cat = new WhiteboardCatalog();
    cat.setCurrentPage('P');
    cat.setCurrentTurn(1);
    // equation appended WITHOUT anchorKey (supporting render)
    cat.append({ itemId: 'eq-1', action: 'showEquation', title: 'Standard Form', features: [] });
    cat.setCurrentTurn(2);
    const key = computeAnchorKey('showEquation', { title: 'Standard Form' });
    assert.equal(cat.findEvolvableFigure(key, STALE), null, 'no anchorKey → not evolvable');
  });

  test('newest-first: evolves the most recent same-subject figure', () => {
    const cat = new WhiteboardCatalog();
    cat.setCurrentPage('Parabola');
    cat.setCurrentTurn(1);
    appendFigure(cat, 'showGraph-1', 'showFunctionGraph', 'Parabola y² = 4x');
    cat.setCurrentTurn(2);
    appendFigure(cat, 'showGraph-2', 'showFunctionGraph', 'Parabola y² = 4x with Tangent');
    cat.setCurrentTurn(3);
    const key = computeAnchorKey('showFunctionGraph', { title: 'Parabola y² = 4x with Tangent and Directrix' });
    const prior = cat.findEvolvableFigure(key, STALE);
    assert.ok(prior && prior.itemId === 'showGraph-2', 'most-recent parabola, not the oldest');
  });

  test('generic across figure types: geometry construction evolves', () => {
    const cat = new WhiteboardCatalog();
    cat.setCurrentPage('Triangle');
    cat.setCurrentTurn(1);
    appendFigure(cat, 'geo-1', 'showGeometryConstructed', 'Triangle ABC');
    cat.setCurrentTurn(2);
    const key = computeAnchorKey('showGeometryConstructed', { title: 'Triangle ABC with Altitude' });
    assert.ok(cat.findEvolvableFigure(key, STALE), 'geometry figure evolves too');
  });

  test('empty anchorKey query → null', () => {
    const cat = new WhiteboardCatalog();
    cat.setCurrentPage('P');
    cat.setCurrentTurn(1);
    appendFigure(cat, 'g-1', 'showFunctionGraph', 'Parabola');
    assert.equal(cat.findEvolvableFigure('', STALE), null);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();

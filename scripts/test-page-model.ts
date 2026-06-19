/**
 * Standalone unit test for the first-class Page model in
 * src/lib/tutor/whiteboard/catalog.ts (Phase 1 of cross-turn page grouping —
 * see project_tutor_page_grouping_design.md).
 *
 * Run with:
 *   npx ts-node -r tsconfig-paths/register --compiler-options '{"module":"commonjs","baseUrl":"./"}' scripts/test-page-model.ts
 * Or:
 *   npm run test:page-model
 *
 * No test framework — matches the existing test:gaps / test:skip-cap pattern.
 * catalog.ts has only a type-only import, so this loads no SDK / API key.
 *
 * What it proves: the Page model is populated off the existing newPage flow
 * (setCurrentPage bridge), items stamp pageId, getPageIndex / empty-page GC /
 * anchor transfer behave, and the pure helpers computeAnchorKey /
 * isPrimaryFigure classify subjects deterministically.
 */

import { strict as assert } from 'node:assert';
import {
  WhiteboardCatalog,
  computeAnchorKey,
  computeFigureCategory,
  anchorsDiverge,
  isPrimaryFigure,
} from '../src/lib/tutor/whiteboard/catalog';

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`      ${(err as Error).message}`);
    failed++;
  }
}

// Minimal append helper — features default to [] (FeatureManifestEntry[]).
function appendItem(
  cat: WhiteboardCatalog,
  itemId: string,
  action: string,
  extra: { title?: string; pageId?: string } = {},
) {
  return cat.append({ itemId, action, features: [], ...extra });
}

async function main() {
  console.log('Page model (catalog.ts) — Phase 1\n');

  await test('setCurrentPage bridge opens a Page and activates it', () => {
    const cat = new WhiteboardCatalog();
    assert.equal(cat.getActivePageId(), null, 'no active page initially');
    cat.setCurrentPage('Parabola');
    const active = cat.getActivePage();
    assert.ok(active, 'active page exists after setCurrentPage');
    assert.equal(active!.title, 'Parabola');
    assert.equal(cat.getPages().length, 1);
  });

  await test('same title does not open a duplicate page; new title does', () => {
    const cat = new WhiteboardCatalog();
    cat.setCurrentPage('Parabola');
    cat.setCurrentPage('Parabola'); // duplicate consecutive — no new page
    assert.equal(cat.getPages().length, 1, 'consecutive same-title → 1 page');
    cat.setCurrentPage('Hyperbola');
    assert.equal(cat.getPages().length, 2, 'new title → 2nd page');
    assert.equal(cat.getActivePage()!.title, 'Hyperbola');
  });

  await test('append stamps the active pageId and bumps lastRenderTurn', () => {
    const cat = new WhiteboardCatalog();
    cat.setCurrentTurn(3);
    cat.setCurrentPage('Parabola');
    const activeId = cat.getActivePageId()!;
    const item = appendItem(cat, 'showGraph-1', 'showGraph', { title: 'y=x^2' });
    assert.equal(item.pageId, activeId, 'item stamped with active pageId');
    assert.equal(cat.getActivePage()!.lastRenderTurn, 3);
    assert.equal(cat.getActivePage()!.anchorItemId, 'showGraph-1', 'first item is provisional anchor');
  });

  await test('append with explicit pageId pins (kill-recovery replace path)', () => {
    const cat = new WhiteboardCatalog();
    cat.setCurrentPage('Page A');
    const pageA = cat.getActivePageId()!;
    appendItem(cat, 'showGraph-1', 'showGraph');
    cat.setCurrentPage('Page B'); // active moves to B
    const item = appendItem(cat, 'showGraph-2', 'showGraph', { pageId: pageA });
    assert.equal(item.pageId, pageA, 'explicit pageId wins over active page');
    assert.equal(cat.pageItemCount(pageA), 2);
  });

  await test('getPageIndex numbers pages and lists distinct artifact types', () => {
    const cat = new WhiteboardCatalog();
    cat.setCurrentPage('Parabola');
    appendItem(cat, 'showGraph-1', 'showGraph');
    appendItem(cat, 'showEquation-1', 'showEquation');
    appendItem(cat, 'showEquation-2', 'showEquation'); // dup type collapses
    cat.setCurrentPage('Triangle');
    appendItem(cat, 'showGeometry-1', 'showGeometry');
    const idx = cat.getPageIndex();
    assert.equal(idx.length, 2);
    assert.deepEqual(idx[0], {
      number: 1,
      id: idx[0].id,
      title: 'Parabola',
      artifactTypes: ['Graph', 'Equation'],
      isContinuation: undefined,
    });
    assert.equal(idx[1].number, 2);
    assert.deepEqual(idx[1].artifactTypes, ['Geometry']);
  });

  await test('removeByIds GCs an emptied non-active page and clears its anchor', () => {
    const cat = new WhiteboardCatalog();
    cat.setCurrentPage('Parabola');
    const pageA = cat.getActivePageId()!;
    appendItem(cat, 'showGraph-1', 'showGraph');
    cat.setCurrentPage('Triangle'); // active moves away from Parabola
    appendItem(cat, 'showGeometry-1', 'showGeometry');
    assert.equal(cat.getPages().length, 2);
    const removed = cat.removeByIds(['showGraph-1']); // empties Parabola
    assert.equal(removed, 1);
    assert.equal(cat.getPage(pageA), undefined, 'emptied non-active page GC’d');
    assert.equal(cat.getPages().length, 1);
  });

  await test('active page is preserved even when emptied (about to receive a render)', () => {
    const cat = new WhiteboardCatalog();
    cat.setCurrentPage('Parabola');
    const pageA = cat.getActivePageId()!;
    appendItem(cat, 'showGraph-1', 'showGraph');
    cat.removeByIds(['showGraph-1']); // empties the ACTIVE page
    assert.ok(cat.getPage(pageA), 'active page survives empty GC');
    assert.equal(cat.getActivePage()!.anchorItemId, undefined, 'stale anchor cleared');
  });

  await test('continuation page inherits parent anchorKey', () => {
    const cat = new WhiteboardCatalog();
    cat.setCurrentPage('Parabola');
    const parent = cat.getActivePageId()!;
    appendItem(cat, 'showGraph-1', 'showGraph');
    cat.setPageAnchor(parent, 'showGraph-1', 'anchor-key-parabola');
    const contId = cat.openPage({ title: 'Parabola (cont.)', isContinuation: true, parentPageId: parent });
    const cont = cat.getPage(contId)!;
    assert.equal(cont.isContinuation, true);
    assert.equal(cont.parentPageId, parent);
    assert.equal(cont.anchorKey, 'anchor-key-parabola', 'cont. shares parent subject');
  });

  await test('snapshot exposes pageId and isOnActivePage (active vs view distinct)', () => {
    const cat = new WhiteboardCatalog();
    cat.setCurrentPage('Parabola');
    const pageA = cat.getActivePageId()!;
    appendItem(cat, 'showGraph-1', 'showGraph');
    cat.setCurrentPage('Triangle');
    appendItem(cat, 'showGeometry-1', 'showGeometry');
    const snap = cat.getSnapshot();
    const g1 = snap.find((s) => s.itemId === 'showGraph-1')!;
    const t1 = snap.find((s) => s.itemId === 'showGeometry-1')!;
    assert.equal(g1.pageId, pageA);
    assert.equal(g1.isOnActivePage, false, 'Parabola item not on active page');
    assert.equal(t1.isOnActivePage, true, 'Triangle item on active page');
  });

  await test('clear() resets the page model', () => {
    const cat = new WhiteboardCatalog();
    cat.setCurrentPage('Parabola');
    appendItem(cat, 'showGraph-1', 'showGraph');
    cat.clear();
    assert.equal(cat.getPages().length, 0);
    assert.equal(cat.getActivePageId(), null);
    // nextPageNum reset → first page after clear is page-1 again.
    const id = cat.openPage({ title: 'Fresh' });
    assert.equal(id, 'page-1');
  });

  // ---- pure helpers ----

  await test('isPrimaryFigure: figures true, supporting renders false', () => {
    assert.equal(isPrimaryFigure('showGraph'), true);
    assert.equal(isPrimaryFigure('showGeometry'), true);
    assert.equal(isPrimaryFigure('showDiagram'), true);
    assert.equal(isPrimaryFigure('showEquation'), false);
    assert.equal(isPrimaryFigure('showSolution'), false);
    assert.equal(isPrimaryFigure('showProblem'), false);
    assert.equal(isPrimaryFigure('totallyUnknownAction'), false, 'unknown defaults to supporting (bias-to-group)');
  });

  await test('computeAnchorKey: same subject matches, different figure differs', () => {
    const parabola = { type: 'parabola', expression: 'y = x^2', title: 'A parabola' };
    const parabola2 = { type: 'parabola', expression: 'y = x^2', title: 'A parabola' };
    const hyperbola = { type: 'hyperbola', expression: 'x^2 - y^2 = 1', title: 'A conic' };
    assert.equal(
      computeAnchorKey('showFunctionGraph', parabola),
      computeAnchorKey('showFunctionGraph', parabola2),
      'identical subjects → identical key',
    );
    assert.notEqual(
      computeAnchorKey('showFunctionGraph', parabola),
      computeAnchorKey('showFunctionGraph', hyperbola),
      'different figures → different key',
    );
  });

  await test('computeAnchorKey ignores expression (anchor = category|||title)', () => {
    // Same title, different expression → SAME key now (expressions intentionally
    // dropped so evolving figures don't split — design Q6 / 2026-06-19 fix).
    const a = { title: 'Parabola: y² = 4x', expression: 'y = 2*sqrt(x)' };
    const b = { title: 'Parabola: y² = 4x', expression: 'y = sqrt(4x)' };
    assert.equal(
      computeAnchorKey('showFunctionGraph', a),
      computeAnchorKey('showFunctionGraph', b),
      'same subject, equivalent curve written differently → same key',
    );
  });

  await test('computeFigureCategory: kind only (showDiagram carries its type)', () => {
    assert.equal(computeFigureCategory('showGraph', {}), 'showGraph');
    assert.equal(computeFigureCategory('showGeometryConstructed', {}), 'showGeometryConstructed');
    assert.equal(computeFigureCategory('showDiagram', { type: 'eclipse_diagram' }), 'showDiagram:eclipse_diagram');
  });

  await test('anchorsDiverge: kind, evolving figure, and different subject', () => {
    const parabola = computeAnchorKey('showFunctionGraph', { title: 'Parabola: y² = 4x' });
    const parabolaDir = computeAnchorKey('showFunctionGraph', { title: 'Parabola: y² = 4x with Directrix' });
    const ellipse = computeAnchorKey('showFunctionGraph', { title: 'Ellipse: x²/9 + y²/4 = 1' });
    const construction = computeAnchorKey('showGeometryConstructed', { title: 'Focus-Directrix Property' });
    // Evolving figure (title superset, same kind) → NOT diverge → group.
    assert.equal(anchorsDiverge(parabola, parabolaDir), false, 'evolving figure groups');
    // Different subject, same kind (dissimilar titles) → diverge → split.
    assert.equal(anchorsDiverge(parabola, ellipse), true, 'parabola vs ellipse splits');
    // Different kind → diverge → split.
    assert.equal(anchorsDiverge(parabola, construction), true, 'graph vs construction splits');
    // Identical → not diverge.
    assert.equal(anchorsDiverge(parabola, parabola), false);
  });

  // ───────── Board Map: resolveTarget page-scoping (Phase 3) ─────────
  // Two pages each carrying a feature with the SAME name; page-scoping must
  // pick the right page, and fail open when the page misses.
  function twoPageCatalog() {
    const cat = new WhiteboardCatalog();
    cat.setCurrentPage('Page A'); // page-1
    cat.append({
      itemId: 'a1', action: 'showGraph', title: 'Parabola',
      features: [{ name: 'focus', kind: 'point', description: 'Focus (1,0)' }],
    });
    cat.setCurrentPage('Page B'); // page-2
    cat.append({
      itemId: 'b1', action: 'showGeometry', title: 'Ellipse',
      features: [{ name: 'focus', kind: 'point', description: 'Focus (2,0)' }],
    });
    return cat;
  }

  await test('resolveTarget: no page → newest-first (page-2 item wins)', () => {
    const r = twoPageCatalog().resolveTarget('focus');
    assert.ok(r.ok && r.itemId === 'b1', 'newest (page-2) item');
    assert.ok(r.ok && !r.pageFallback, 'no fallback flag without a page arg');
  });

  await test('resolveTarget: page=1 scopes to that page (older item)', () => {
    const r = twoPageCatalog().resolveTarget('focus', { page: 1 });
    assert.ok(r.ok && r.itemId === 'a1', 'page-1 scoped pick');
    assert.ok(r.ok && !r.pageFallback, 'no fallback — matched on page');
  });

  await test('resolveTarget: page=2 scopes to page 2', () => {
    const r = twoPageCatalog().resolveTarget('focus', { page: 2 });
    assert.ok(r.ok && r.itemId === 'b1', 'page-2 scoped pick');
  });

  await test('resolveTarget: out-of-range page → fail-open + pageFallback', () => {
    const r = twoPageCatalog().resolveTarget('focus', { page: 99 });
    assert.ok(r.ok && r.itemId === 'b1', 'falls back to board newest-first');
    assert.ok(r.ok && r.pageFallback === true, 'pageFallback flagged');
  });

  await test('resolveTarget: name absent on named page → fail-open to board', () => {
    const cat = new WhiteboardCatalog();
    cat.setCurrentPage('P1');
    cat.append({ itemId: 'x', action: 'showGraph', features: [{ name: 'alpha', kind: 'point', description: 'A' }] });
    cat.setCurrentPage('P2');
    cat.append({ itemId: 'y', action: 'showGraph', features: [{ name: 'beta', kind: 'point', description: 'B' }] });
    // "beta" only exists on page 2; scoped to page 1 it must fail open to page 2.
    const r = cat.resolveTarget('beta', { page: 1 });
    assert.ok(r.ok && r.itemId === 'y', 'fell open to page-2 item');
    assert.ok(r.ok && r.pageFallback === true, 'pageFallback flagged');
  });

  await test('resolveTarget: genuine no_match even with page → no_match', () => {
    const r = twoPageCatalog().resolveTarget('nonexistent-thing', { page: 1 });
    assert.ok(!r.ok && r.reason === 'no_match', 'no_match preserved');
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();

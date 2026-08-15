/**
 * Standalone unit test for the Board Map formatter in
 * src/lib/tutor/whiteboard/summary.ts (Phase 1 of Board Map — see
 * project_tutor_board_map_design.md).
 *
 * Run with:
 *   npx ts-node -r tsconfig-paths/register --compiler-options '{"module":"commonjs","baseUrl":"./"}' scripts/test-board-map.ts
 * Or:
 *   npm run test:board-map
 *
 * No test framework — matches the existing test:page-grouping / test:gaps
 * pattern. summary.ts has only a type-only + prettyAction import from
 * catalog.ts, so this loads no SDK / API key.
 *
 * What it proves: LEGACY mode (no opts) is byte-for-byte the old flat
 * behaviour; MAP mode groups by page with position-based numbers, expands
 * current-segment ∪ view-page ∪ top-N-off-segment pages, collapses the rest
 * to a header line, and degrades gracefully (empty board, unpaged items).
 */

import { strict as assert } from 'node:assert';
import type { CatalogSnapshotEntry, Page } from '../apps/marketing/src/lib/tutor/whiteboard/catalog';
import {
  buildWhiteboardSummary,
  AUTO_EXPAND_OFF_SEGMENT_PAGES,
} from '../apps/marketing/src/lib/tutor/whiteboard/summary';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`      ${(err as Error).message}`);
    failed++;
  }
}

type FeatLite = { canonical: string; kind: string; description: string };

function entry(
  itemId: string,
  action: string,
  partial: Partial<CatalogSnapshotEntry> & { feats?: FeatLite[] } = {},
): CatalogSnapshotEntry {
  const feats = partial.feats ?? [];
  return {
    itemId,
    action,
    title: partial.title,
    pageTitle: partial.pageTitle,
    pageId: partial.pageId,
    featureCount: feats.length,
    segmentId: partial.segmentId,
    isOnCurrentPage: partial.isOnCurrentPage,
    isOnActivePage: partial.isOnActivePage,
    features: feats,
  };
}

function page(id: string, title: string, partial: Partial<Page> = {}): Page {
  return {
    id,
    title,
    segmentId: partial.segmentId,
    anchorKey: partial.anchorKey,
    anchorItemId: partial.anchorItemId,
    openedAtTurn: partial.openedAtTurn ?? 0,
    lastRenderTurn: partial.lastRenderTurn ?? 0,
    isContinuation: partial.isContinuation,
    parentPageId: partial.parentPageId,
  };
}

function main() {
  console.log('Board Map formatter (summary.ts) — Phase 1\n');

  /* ───────── LEGACY parity ───────── */

  test('empty snapshot → "(whiteboard is empty)" in both modes', () => {
    assert.equal(buildWhiteboardSummary([]), '(whiteboard is empty)');
    assert.equal(
      buildWhiteboardSummary([], { pages: [page('page-1', 'X')] }),
      '(whiteboard is empty)',
    );
  });

  test('no opts → legacy flat list (unchanged shape)', () => {
    const snap = [
      entry('i1', 'showGraph', {
        title: 'Parabola',
        pageTitle: 'Parabola',
        isOnCurrentPage: true,
        feats: [{ canonical: 'focus', kind: 'point', description: 'Focus (1,0)' }],
      }),
      entry('i2', 'showEquation', { title: 'Standard Form', pageTitle: 'Parabola', isOnCurrentPage: true }),
    ];
    const out = buildWhiteboardSummary(snap);
    assert.ok(out.includes('Currently visible page: "Parabola"'), 'has visible-page header');
    assert.ok(out.includes('[1] showGraph — Parabola'), 'flat numbered item');
    assert.ok(out.includes('   - Focus (1,0)'), 'feature line');
    assert.ok(!out.includes('Whiteboard pages'), 'no map header in legacy mode');
  });

  test('empty pages array → legacy mode (not map)', () => {
    const snap = [entry('i1', 'showGraph', { title: 'G', isOnCurrentPage: true, pageTitle: 'P' })];
    const out = buildWhiteboardSummary(snap, { pages: [] });
    assert.ok(out.includes('[1] showGraph'), 'falls back to flat');
    assert.ok(!out.includes('Whiteboard pages'));
  });

  /* ───────── MAP mode ───────── */

  // Scenario: 3 pages across 2 segments. Page 1 current segment + viewed.
  function scenario() {
    const pages = [
      page('page-1', 'Parabola y²=4x', { segmentId: 'seg-A', lastRenderTurn: 5 }),
      page('page-2', 'Ellipse', { segmentId: 'seg-B', lastRenderTurn: 4 }),
      page('page-3', 'Hyperbola', { segmentId: 'seg-B', lastRenderTurn: 3 }),
    ];
    const snap = [
      entry('i1', 'showGraph', {
        title: 'Parabola', pageId: 'page-1', segmentId: 'seg-A', isOnCurrentPage: true,
        feats: [{ canonical: 'focus', kind: 'point', description: 'Focus (1,0)' }],
      }),
      entry('i2', 'showEquation', { title: 'Std Form', pageId: 'page-1', segmentId: 'seg-A', isOnCurrentPage: true }),
      entry('i3', 'showGeometry', {
        title: 'Ellipse', pageId: 'page-2', segmentId: 'seg-B', isOnCurrentPage: false,
        feats: [{ canonical: 'center', kind: 'point', description: 'Center O(0,0)' }],
      }),
      entry('i4', 'showGraph', {
        title: 'Hyperbola', pageId: 'page-3', segmentId: 'seg-B', isOnCurrentPage: false,
        feats: [{ canonical: 'asymp', kind: 'line', description: 'Asymptote y=x' }],
      }),
    ];
    return { pages, snap };
  }

  test('map header names the current view page by number', () => {
    const { pages, snap } = scenario();
    const out = buildWhiteboardSummary(snap, { pages, currentSegmentId: 'seg-A' });
    assert.ok(out.includes('you are viewing Page 1 "Parabola y²=4x"'), out);
  });

  test('pages numbered by position (1,2,3)', () => {
    const { pages, snap } = scenario();
    const out = buildWhiteboardSummary(snap, { pages, currentSegmentId: 'seg-A' });
    assert.ok(out.includes('Page 1: "Parabola y²=4x"'), 'page 1');
    assert.ok(out.includes('Page 2: "Ellipse"'), 'page 2');
    assert.ok(out.includes('Page 3: "Hyperbola"'), 'page 3');
  });

  test('current view page gets [CURRENT PAGE] + artifact types', () => {
    const { pages, snap } = scenario();
    const out = buildWhiteboardSummary(snap, { pages, currentSegmentId: 'seg-A' });
    assert.ok(/Page 1: "Parabola y²=4x" — Graph, Equation \[CURRENT PAGE\]/.test(out), out);
  });

  test('off-segment pages tagged [earlier]', () => {
    const { pages, snap } = scenario();
    const out = buildWhiteboardSummary(snap, { pages, currentSegmentId: 'seg-A' });
    assert.ok(out.includes('Page 2: "Ellipse" — Geometry [earlier]'), out);
  });

  test('current-segment page expands (feature detail shown)', () => {
    const { pages, snap } = scenario();
    const out = buildWhiteboardSummary(snap, { pages, currentSegmentId: 'seg-A' });
    assert.ok(out.includes('Focus (1,0)'), 'page-1 detail present');
  });

  test('N=1 → only the most-recent off-segment page expands, the rest collapse', () => {
    const { pages, snap } = scenario();
    const out = buildWhiteboardSummary(snap, { pages, currentSegmentId: 'seg-A', autoExpandN: 1 });
    // page-2 (lastRenderTurn 4) expands → Center detail shown
    assert.ok(out.includes('Center O(0,0)'), 'top-1 off-segment expanded');
    // page-3 (lastRenderTurn 3) collapses → asymptote detail hidden, header still present
    assert.ok(!out.includes('Asymptote y=x'), 'collapsed page detail hidden');
    assert.ok(out.includes('Page 3: "Hyperbola" — Graph [earlier]'), 'collapsed header present');
  });

  test('N=0 → all off-segment pages collapse (only segment+view expand)', () => {
    const { pages, snap } = scenario();
    const out = buildWhiteboardSummary(snap, { pages, currentSegmentId: 'seg-A', autoExpandN: 0 });
    assert.ok(out.includes('Focus (1,0)'), 'current segment still expands');
    assert.ok(!out.includes('Center O(0,0)'), 'off-segment page-2 collapsed');
    assert.ok(!out.includes('Asymptote y=x'), 'off-segment page-3 collapsed');
  });

  test('default N matches AUTO_EXPAND_OFF_SEGMENT_PAGES (=2) → both off-seg expand', () => {
    const { pages, snap } = scenario();
    const out = buildWhiteboardSummary(snap, { pages, currentSegmentId: 'seg-A' });
    assert.equal(AUTO_EXPAND_OFF_SEGMENT_PAGES, 2);
    assert.ok(out.includes('Center O(0,0)') && out.includes('Asymptote y=x'), 'both expand at N=2');
  });

  test('VIEW page expands even when off-segment (back-nav loop) + gets [CURRENT PAGE]', () => {
    const { pages } = scenario();
    // Brain navigated back to page-2 (seg-B); current segment is still seg-A.
    const snap = [
      entry('i1', 'showGraph', { title: 'Parabola', pageId: 'page-1', segmentId: 'seg-A', isOnCurrentPage: false,
        feats: [{ canonical: 'focus', kind: 'point', description: 'Focus (1,0)' }] }),
      entry('i3', 'showGeometry', { title: 'Ellipse', pageId: 'page-2', segmentId: 'seg-B', isOnCurrentPage: true,
        feats: [{ canonical: 'center', kind: 'point', description: 'Center O(0,0)' }] }),
      entry('i4', 'showGraph', { title: 'Hyperbola', pageId: 'page-3', segmentId: 'seg-B', isOnCurrentPage: false,
        feats: [{ canonical: 'asymp', kind: 'line', description: 'Asymptote y=x' }] }),
    ];
    const out = buildWhiteboardSummary(snap, { pages, currentSegmentId: 'seg-A', autoExpandN: 0 });
    assert.ok(out.includes('Page 2: "Ellipse" — Geometry [CURRENT PAGE]'), 'view page marked CURRENT even off-segment');
    assert.ok(out.includes('Center O(0,0)'), 'view page expands despite N=0 + off-segment');
    assert.ok(out.includes('Focus (1,0)'), 'current-segment page-1 also expands');
  });

  test('continuation page shows (cont.)', () => {
    const pages = [
      page('page-1', 'Parabola', { segmentId: 'seg-A', lastRenderTurn: 1 }),
      page('page-2', 'Parabola', { segmentId: 'seg-A', lastRenderTurn: 2, isContinuation: true, parentPageId: 'page-1' }),
    ];
    const snap = [
      entry('i1', 'showGraph', { title: 'P', pageId: 'page-1', segmentId: 'seg-A', isOnCurrentPage: false }),
      entry('i2', 'showEquation', { title: 'E', pageId: 'page-2', segmentId: 'seg-A', isOnCurrentPage: true }),
    ];
    const out = buildWhiteboardSummary(snap, { pages, currentSegmentId: 'seg-A' });
    assert.ok(out.includes('Page 2: "Parabola" (cont.)'), out);
  });

  test('GC guard: a page with zero rendered items is skipped', () => {
    const pages = [
      page('page-1', 'Parabola', { segmentId: 'seg-A' }),
      page('page-2', 'Ghost', { segmentId: 'seg-A' }), // no items in snapshot
    ];
    const snap = [entry('i1', 'showGraph', { title: 'P', pageId: 'page-1', segmentId: 'seg-A', isOnCurrentPage: true })];
    const out = buildWhiteboardSummary(snap, { pages, currentSegmentId: 'seg-A' });
    assert.ok(out.includes('Page 1: "Parabola"'), 'real page rendered');
    assert.ok(!out.includes('Ghost'), 'empty page skipped');
  });

  test('unpaged items (free convo) land in a trailing bucket', () => {
    const pages = [page('page-1', 'Parabola', { segmentId: 'seg-A' })];
    const snap = [
      entry('i1', 'showGraph', { title: 'P', pageId: 'page-1', segmentId: 'seg-A', isOnCurrentPage: true }),
      entry('i2', 'showText', { title: 'loose note' /* no pageId */ }),
    ];
    const out = buildWhiteboardSummary(snap, { pages, currentSegmentId: 'seg-A' });
    assert.ok(out.includes('Unpaged items:'), 'unpaged bucket present');
    assert.ok(out.includes('showText — loose note'), 'unpaged item listed');
  });

  test('free-convo (undefined currentSegmentId) → every page expands', () => {
    const { pages, snap } = scenario();
    const out = buildWhiteboardSummary(snap, { pages /* no currentSegmentId */ });
    // With curSeg = '', a page's (segmentId ?? '') !== '' for seg-A/seg-B, so they
    // are off-segment; but with default N=2 the two non-view off-seg pages expand,
    // and the view page (page-1) always expands → all detail present.
    assert.ok(out.includes('Focus (1,0)') && out.includes('Center O(0,0)') && out.includes('Asymptote y=x'), out);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();

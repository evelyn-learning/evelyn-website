/**
 * Standalone unit test for the pure page-grouping decision module
 * (src/lib/tutor/whiteboard/page-grouping.ts) — Phase 2 of cross-turn page
 * grouping. See project_tutor_page_grouping_design.md.
 *
 * Run: npm run test:page-grouping
 *
 * No framework — node:assert, matches test:gaps / test:skip-cap. The module
 * is pure (imports only catalog.ts's pure helpers), so this loads no SDK /
 * API key. Proves the entire tiered precedence (Tier 0..4 + overflow) and
 * the do-NOT-regress behaviors deterministically, without the model/canvas.
 */

import { strict as assert } from 'node:assert';
import {
  decidePageForBatch,
  PAGE_WEIGHT_BUDGET,
  STALE_TURNS,
  type PageGroupingInput,
  type PageGroupingCommand,
  type ActivePageView,
} from '../src/lib/tutor/whiteboard/page-grouping';

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => void) {
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

// Default-everything input builder so each test states only what it varies.
function input(over: Partial<PageGroupingInput> & { batch: PageGroupingCommand[] }): PageGroupingInput {
  return {
    studentText: '',
    activePage: defaultActivePage(),
    currentTurn: 10,
    segmentTitle: undefined,
    signals: {
      topicShiftDistance: null,
      continuationGuardActive: false,
      tutorSameContext: false,
      segmentAdvancePending: false,
      killRecoveryPinPageId: null,
      firstTeachingWillDedup: false,
      ...(over.signals ?? {}),
    },
    ...over,
  };
}

function defaultActivePage(over: Partial<ActivePageView> = {}): ActivePageView {
  return {
    id: 'page-1',
    title: 'Parabola',
    segmentId: 'seg-1',
    anchorKey: undefined,
    weightedLoad: 3,
    lastRenderTurn: 10,
    ...over,
  };
}

const graph = (title = 'Parabola: y² = 4x', expr = 'y = x^2'): PageGroupingCommand => ({ action: 'showFunctionGraph', expression: expr, title });
const construction = (title = 'Focus-Directrix Property'): PageGroupingCommand => ({ action: 'showGeometryConstructed', title });
const equation = (): PageGroupingCommand => ({ action: 'showEquation', label: 'Focus', latex: 'x=1' });
const scribble = (): PageGroupingCommand => ({ action: 'tutorScribble', target: 'vertex' });
// Composite anchor keys (category|||normTitle) as computeAnchorKey produces.
const PARABOLA_ANCHOR = 'showFunctionGraph|||parabola: y² = 4x';

function main() {
  console.log('page-grouping.ts — Phase 2 (tiered precedence)\n');

  // ---- Tier 0 ----
  test('Tier 0: kill-recovery pin beats everything (even brain new_page)', () => {
    const d = decidePageForBatch(input({
      batch: [{ action: 'newPage', title: 'X' }, graph()],
      studentText: 'clear the board',
      signals: { killRecoveryPinPageId: 'page-7' } as PageGroupingInput['signals'],
    }));
    assert.equal(d.action, 'pin');
    if (d.action === 'pin') assert.equal(d.pageId, 'page-7');
  });

  // ---- meta / H1 ----
  test('meta-only batch → none (no page decision)', () => {
    const d = decidePageForBatch(input({ batch: [scribble()] }));
    assert.equal(d.action, 'none');
  });

  test('H1: explicit newPage already in batch → none (no double break)', () => {
    const d = decidePageForBatch(input({ batch: [{ action: 'newPage', title: 'Fresh' }, graph()] }));
    assert.equal(d.action, 'none');
  });

  test('no active page + teaching → opens first page', () => {
    const d = decidePageForBatch(input({ batch: [graph()], activePage: null }));
    assert.equal(d.action, 'newPage');
    if (d.action === 'newPage') assert.equal(d.event, 'auto_new_page_first');
  });

  // ---- Tier 1 structural ----
  test('H5 reset beats continuation (Tier 1 > Tier 2)', () => {
    const d = decidePageForBatch(input({
      batch: [graph()],
      studentText: 'clear the board please',
      signals: { continuationGuardActive: true } as PageGroupingInput['signals'],
    }));
    assert.equal(d.action, 'newPage');
    if (d.action === 'newPage') assert.equal(d.event, 'auto_new_page_reset');
  });

  test('H5 reset regex does NOT fire on "draw a new triangle"', () => {
    const d = decidePageForBatch(input({ batch: [graph()], studentText: 'can you draw a new triangle' }));
    assert.equal(d.action, 'none', 'should fall through to default group, not reset');
  });

  test('H2 segment advance (advanceLesson + show) beats continuation, uses segment title', () => {
    const d = decidePageForBatch(input({
      batch: [{ action: 'advanceLesson' }, graph()],
      segmentTitle: 'Photosynthesis',
      signals: { continuationGuardActive: true } as PageGroupingInput['signals'],
    }));
    assert.equal(d.action, 'newPage');
    if (d.action === 'newPage') {
      assert.equal(d.event, 'auto_new_page_segment_advance');
      assert.equal(d.title, 'Photosynthesis');
    }
  });

  test('H2 deferred segment advance pending → break when teaching lands', () => {
    const d = decidePageForBatch(input({
      batch: [graph()],
      signals: { segmentAdvancePending: true } as PageGroupingInput['signals'],
    }));
    assert.equal(d.action, 'newPage');
    if (d.action === 'newPage') assert.equal(d.event, 'auto_new_page_segment_advance');
  });

  // ---- Topic/segment-level grouping (H6 removed 2026-06-19): figures NEVER
  // split. A graph, a different-kind construction, a different-subject graph —
  // all group onto the active page. Only segment-advance / topic-shift / reset
  // / overflow split. ----
  test('different KIND (graph → construction) → GROUP (no figure split)', () => {
    const d = decidePageForBatch(input({
      batch: [construction('Focus-Directrix Property')],
      activePage: defaultActivePage({ anchorKey: PARABOLA_ANCHOR }),
    }));
    assert.equal(d.action, 'none', 'figures of the same topic stay together');
  });

  test('different SUBJECT, same kind (parabola → ellipse graph) → GROUP (split via topic-shift/segment, not figure)', () => {
    const d = decidePageForBatch(input({
      batch: [graph('Ellipse: x²/9 + y²/4 = 1')],
      activePage: defaultActivePage({ anchorKey: PARABOLA_ANCHOR }),
    }));
    assert.equal(d.action, 'none', 'figure subject alone never splits; a real topic boundary does');
  });

  test('evolving figure (parabola → parabola+directrix) → GROUP', () => {
    const d = decidePageForBatch(input({
      batch: [graph('Parabola: y² = 4x with Directrix', 'y = sqrt(4x)')],
      activePage: defaultActivePage({ anchorKey: PARABOLA_ANCHOR }),
    }));
    assert.equal(d.action, 'none');
  });

  test('G1 headline: follow-up equation on a graph page → group', () => {
    const d = decidePageForBatch(input({
      batch: [equation()],
      activePage: defaultActivePage({ anchorKey: PARABOLA_ANCHOR }),
    }));
    assert.equal(d.action, 'none', 'supporting equation groups with the figure');
  });

  // ---- Tier 2 continuation ----
  test('do-NOT-regress: continuation beats topic-shift ("find T for this")', () => {
    const d = decidePageForBatch(input({
      batch: [equation()],
      studentText: 'can you show me the steps to find T for this',
      signals: { continuationGuardActive: true, topicShiftDistance: 0.42 } as PageGroupingInput['signals'],
    }));
    assert.equal(d.action, 'none', 'continuation (Tier 2) overrides topic-shift (Tier 3)');
  });

  test('Tier 2: tutor-same-context → group', () => {
    const d = decidePageForBatch(input({
      batch: [equation()],
      signals: { tutorSameContext: true, topicShiftDistance: 0.5 } as PageGroupingInput['signals'],
    }));
    assert.equal(d.action, 'none');
  });

  // ---- Tier 3 topic-shift ----
  test('Tier 3: topic-shift with no continuation → new page', () => {
    // Supporting render (equation) so H6 can't pre-empt — isolates Tier 3.
    const d = decidePageForBatch(input({
      batch: [equation()],
      signals: { topicShiftDistance: 0.6 } as PageGroupingInput['signals'],
    }));
    assert.equal(d.action, 'newPage');
    if (d.action === 'newPage') assert.equal(d.event, 'auto_new_page');
  });

  // ---- Tier 4 default + backstops ----
  test('Tier 4: default group', () => {
    const d = decidePageForBatch(input({ batch: [equation()] }));
    assert.equal(d.action, 'none');
  });

  test('staleness: active page gone ≥ STALE_TURNS render-less turns → new page', () => {
    const d = decidePageForBatch(input({
      batch: [equation()],
      currentTurn: 20,
      activePage: defaultActivePage({ lastRenderTurn: 20 - STALE_TURNS }),
    }));
    assert.equal(d.action, 'newPage');
    if (d.action === 'newPage') assert.equal(d.event, 'auto_new_page_stale');
  });

  test('overflow: grouping past budget → continuation sharing anchorKey', () => {
    const d = decidePageForBatch(input({
      batch: [equation(), equation()], // weight 2
      activePage: defaultActivePage({ weightedLoad: PAGE_WEIGHT_BUDGET, anchorKey: 'ak-x' }),
    }));
    assert.equal(d.action, 'continuation');
    if (d.action === 'continuation') {
      assert.equal(d.title, 'Parabola (cont.)');
      assert.equal(d.anchorKey, 'ak-x', 'continuation inherits the subject');
    }
  });

  test('overflow: continuation title is idempotent (no double suffix)', () => {
    const d = decidePageForBatch(input({
      batch: [equation(), equation(), equation()],
      activePage: defaultActivePage({ title: 'Parabola (cont.)', weightedLoad: PAGE_WEIGHT_BUDGET }),
    }));
    assert.equal(d.action, 'continuation');
    if (d.action === 'continuation') assert.equal(d.title, 'Parabola (cont.)');
  });

  // ---- organizer blank-page guard ----
  test('blank-page guard: structural break suppressed when first teaching will dedup', () => {
    const d = decidePageForBatch(input({
      batch: [graph()],
      signals: { topicShiftDistance: 0.6, firstTeachingWillDedup: true } as PageGroupingInput['signals'],
    }));
    assert.equal(d.action, 'none', 'no break in front of a guaranteed-dedup (would blank-page)');
  });

  // ---- title priority ----
  test('title falls back: label > "Next"', () => {
    const d = decidePageForBatch(input({
      batch: [{ action: 'showEquation', label: 'Vieta' }],
      activePage: null,
    }));
    assert.equal(d.action, 'newPage');
    if (d.action === 'newPage') assert.equal(d.title, 'Vieta');
  });

  test('title reads nested data.title (show_function_graph → showGraph)', () => {
    // 2026-06-19 regression: graph titles live at cmd.data.title; pickTitle
    // must not fall back to "Next".
    const d = decidePageForBatch(input({
      batch: [{ action: 'showGraph', data: { title: 'Parabola: y² = 4x' } }],
      activePage: null,
    }));
    assert.equal(d.action, 'newPage');
    if (d.action === 'newPage') assert.equal(d.title, 'Parabola: y² = 4x');
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();

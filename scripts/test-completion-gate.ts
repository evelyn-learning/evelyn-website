/**
 * Unit test — Task C2: compress-and-confirm completion gate
 * (src/lib/tutor/ai/completion-gate.ts).
 *
 * Pins two contracts:
 *   1. gateActive === false ⇒ resolveCompletionOutcome reproduces the
 *      pre-C2 inline markSegmentComplete logic EXACTLY:
 *        - milestone: concept ⇒ first_concept_complete (regardless of
 *          masteryDelta); try_yourself ⇒ first_try_yourself_success unless
 *          an explicit non-positive masteryDelta marks it a miss
 *          (md === undefined || md > 0); anything else ⇒ null.
 *        - recordMastery ⇔ typeof masteryDelta === 'number' (the loId
 *          presence check stays in the caller).
 *        - visitedNotMastered: always false.
 *   2. gateActive === true ⇒ identical outcomes when demonstrated; when NOT
 *      demonstrated, everything is suppressed and visitedNotMastered flags.
 * Plus shouldFireRecapMilestone: gate off ⇒ always true; gate on ⇒
 * requires at least one demonstrated segment.
 *
 * Run: npx tsx scripts/test-completion-gate.ts   (npm run test:pedagogy-c2)
 * No framework — matches the test:pedagogy-b6 / test:pedagogy-c1 pattern.
 */

import { strict as assert } from 'node:assert';
import {
  resolveCompletionOutcome,
  shouldFireRecapMilestone,
  type CompletionSignal,
  type CompletionOutcome,
} from '../src/lib/tutor/ai/completion-gate';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

function sig(overrides: Partial<CompletionSignal>): CompletionSignal {
  return {
    gateActive: false,
    segmentKind: undefined,
    masteryDelta: undefined,
    demonstrated: false,
    ...overrides,
  };
}

function assertOutcome(actual: CompletionOutcome, expected: CompletionOutcome) {
  assert.deepEqual(actual, expected);
}

function main() {
  console.log('Task C2 — completion gate (resolveCompletionOutcome + shouldFireRecapMilestone)\n');

  // ── 1. Gate OFF: today's exact matrix ────────────────────────────────────
  test('gate off: concept + no delta ⇒ concept milestone, no mastery push', () => {
    assertOutcome(
      resolveCompletionOutcome(sig({ segmentKind: 'concept' })),
      { recordMastery: false, milestone: 'first_concept_complete', visitedNotMastered: false },
    );
  });

  test('gate off: concept + positive delta ⇒ concept milestone + mastery push', () => {
    assertOutcome(
      resolveCompletionOutcome(sig({ segmentKind: 'concept', masteryDelta: 0.2 })),
      { recordMastery: true, milestone: 'first_concept_complete', visitedNotMastered: false },
    );
  });

  test('gate off: concept milestone fires even with delta ≤ 0 (today: delta only gates try_yourself)', () => {
    assertOutcome(
      resolveCompletionOutcome(sig({ segmentKind: 'concept', masteryDelta: -0.1 })),
      { recordMastery: true, milestone: 'first_concept_complete', visitedNotMastered: false },
    );
    assertOutcome(
      resolveCompletionOutcome(sig({ segmentKind: 'concept', masteryDelta: 0 })),
      { recordMastery: true, milestone: 'first_concept_complete', visitedNotMastered: false },
    );
  });

  test('gate off: try_yourself + no delta ⇒ success milestone (completion treated as success), no mastery push', () => {
    assertOutcome(
      resolveCompletionOutcome(sig({ segmentKind: 'try_yourself' })),
      { recordMastery: false, milestone: 'first_try_yourself_success', visitedNotMastered: false },
    );
  });

  test('gate off: try_yourself + positive delta ⇒ success milestone + mastery push', () => {
    assertOutcome(
      resolveCompletionOutcome(sig({ segmentKind: 'try_yourself', masteryDelta: 0.3 })),
      { recordMastery: true, milestone: 'first_try_yourself_success', visitedNotMastered: false },
    );
  });

  test('gate off: try_yourself + delta ≤ 0 ⇒ NO milestone but mastery push still happens (explicit miss)', () => {
    assertOutcome(
      resolveCompletionOutcome(sig({ segmentKind: 'try_yourself', masteryDelta: 0 })),
      { recordMastery: true, milestone: null, visitedNotMastered: false },
    );
    assertOutcome(
      resolveCompletionOutcome(sig({ segmentKind: 'try_yourself', masteryDelta: -0.2 })),
      { recordMastery: true, milestone: null, visitedNotMastered: false },
    );
  });

  test('gate off: other kinds (recap/worked_example/undefined) ⇒ no milestone; mastery push tracks delta', () => {
    for (const kind of ['recap', 'worked_example', 'misconception_check', undefined]) {
      assertOutcome(
        resolveCompletionOutcome(sig({ segmentKind: kind, masteryDelta: 0.1 })),
        { recordMastery: true, milestone: null, visitedNotMastered: false },
      );
      assertOutcome(
        resolveCompletionOutcome(sig({ segmentKind: kind })),
        { recordMastery: false, milestone: null, visitedNotMastered: false },
      );
    }
  });

  test('gate off: demonstrated flag is irrelevant (outcome identical either way)', () => {
    for (const demonstrated of [true, false]) {
      assertOutcome(
        resolveCompletionOutcome(sig({ segmentKind: 'concept', masteryDelta: 0.2, demonstrated })),
        { recordMastery: true, milestone: 'first_concept_complete', visitedNotMastered: false },
      );
    }
  });

  // ── 2. Gate ON + demonstrated: identical to gate off ─────────────────────
  test('gate on + demonstrated: concept ⇒ same as gate off', () => {
    assertOutcome(
      resolveCompletionOutcome(sig({ gateActive: true, demonstrated: true, segmentKind: 'concept', masteryDelta: 0.2 })),
      { recordMastery: true, milestone: 'first_concept_complete', visitedNotMastered: false },
    );
  });

  test('gate on + demonstrated: try_yourself matrix matches gate off (incl. ≤0 suppressing milestone only)', () => {
    assertOutcome(
      resolveCompletionOutcome(sig({ gateActive: true, demonstrated: true, segmentKind: 'try_yourself' })),
      { recordMastery: false, milestone: 'first_try_yourself_success', visitedNotMastered: false },
    );
    assertOutcome(
      resolveCompletionOutcome(sig({ gateActive: true, demonstrated: true, segmentKind: 'try_yourself', masteryDelta: -0.1 })),
      { recordMastery: true, milestone: null, visitedNotMastered: false },
    );
  });

  test('gate on + demonstrated: full matrix equals gate-off matrix point-for-point', () => {
    for (const segmentKind of ['concept', 'try_yourself', 'recap', undefined]) {
      for (const masteryDelta of [undefined, -0.2, 0, 0.3]) {
        const off = resolveCompletionOutcome(sig({ segmentKind, masteryDelta }));
        const on = resolveCompletionOutcome(sig({ gateActive: true, demonstrated: true, segmentKind, masteryDelta }));
        assert.deepEqual(on, off, `mismatch at kind=${segmentKind} delta=${masteryDelta}`);
      }
    }
  });

  // ── 3. Gate ON + NOT demonstrated: suppress everything ───────────────────
  test('gate on + not demonstrated: concept ⇒ no milestone, no mastery, visitedNotMastered', () => {
    assertOutcome(
      resolveCompletionOutcome(sig({ gateActive: true, segmentKind: 'concept', masteryDelta: 0.2 })),
      { recordMastery: false, milestone: null, visitedNotMastered: true },
    );
  });

  test('gate on + not demonstrated: try_yourself ⇒ no milestone, no mastery, visitedNotMastered', () => {
    assertOutcome(
      resolveCompletionOutcome(sig({ gateActive: true, segmentKind: 'try_yourself', masteryDelta: 0.5 })),
      { recordMastery: false, milestone: null, visitedNotMastered: true },
    );
    assertOutcome(
      resolveCompletionOutcome(sig({ gateActive: true, segmentKind: 'try_yourself' })),
      { recordMastery: false, milestone: null, visitedNotMastered: true },
    );
  });

  test('gate on + not demonstrated: other kinds also flagged visitedNotMastered (mastery suppressed even with delta)', () => {
    assertOutcome(
      resolveCompletionOutcome(sig({ gateActive: true, segmentKind: 'recap', masteryDelta: 0.1 })),
      { recordMastery: false, milestone: null, visitedNotMastered: true },
    );
  });

  // ── 4. shouldFireRecapMilestone ───────────────────────────────────────────
  test('recap milestone: gate off ⇒ always fires (count irrelevant)', () => {
    assert.equal(shouldFireRecapMilestone({ gateActive: false, demonstratedCount: 0 }), true);
    assert.equal(shouldFireRecapMilestone({ gateActive: false, demonstratedCount: 3 }), true);
  });

  test('recap milestone: gate on ⇒ requires demonstratedCount > 0', () => {
    assert.equal(shouldFireRecapMilestone({ gateActive: true, demonstratedCount: 0 }), false);
    assert.equal(shouldFireRecapMilestone({ gateActive: true, demonstratedCount: 1 }), true);
    assert.equal(shouldFireRecapMilestone({ gateActive: true, demonstratedCount: 5 }), true);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();

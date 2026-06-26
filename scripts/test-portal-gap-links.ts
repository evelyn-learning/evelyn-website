/**
 * Phase 3(a) — notes ↔ gaps reconciliation tests (pure `reconcileGapLinks`).
 *
 * Run: `npm run test:portal-gap-links`
 * Style mirrors scripts/test-cross-session-promotion.ts.
 */

import assert from 'node:assert';
import { reconcileGapLinks, type GapLinkInput } from '@/lib/tutor/topic-notes/reconcile-gap-links';
import type { StudentTopicNotes, TheoryOverlay } from '@/lib/tutor/topic-notes/types';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${(err as Error).message}`);
  }
}

function overlay(o: Partial<TheoryOverlay> & Pick<TheoryOverlay, 'overlayId' | 'kind'>): TheoryOverlay {
  return {
    loId: null,
    content: 'x',
    addedInSessionId: 's1',
    addedAt: '2026-06-26T00:00:00.000Z',
    ...o,
  } as TheoryOverlay;
}

function notesOf(overlays: TheoryOverlay[]): StudentTopicNotes {
  return {
    id: 'stu::base',
    studentId: 'stu',
    baselineId: 'base',
    theoryOverlays: overlays,
    methodsAdds: [],
    pointersAdds: [],
    createdAt: '2026-06-26T00:00:00.000Z',
    updatedAt: '2026-06-26T00:00:00.000Z',
    schemaVersion: 1,
  };
}

const loGap: GapLinkInput = { id: 'gap-lo', kind: 'lo', loId: 'apstats.normal-distribution' };
const prereqGap: GapLinkInput = { id: 'gap-pre', kind: 'prerequisite', conceptLabel: 'Solving Linear Equations' };

console.log('\nPhase 3(a) reconcileGapLinks:\n');

test('expansion overlay ↔ lo gap on shared loId → linked', () => {
  const n = notesOf([overlay({ overlayId: 'o1', kind: 'expansion', loId: 'apstats.normal-distribution' })]);
  const r = reconcileGapLinks(n, [loGap], { sessionId: 's1' });
  assert.strictEqual(r.linked, 1);
  assert.strictEqual(r.notes.theoryOverlays[0].sourceGapId, 'gap-lo');
  assert.notStrictEqual(r.notes, n, 'should return a new object when changed');
});

test('rerun is a no-op (idempotent)', () => {
  const n = notesOf([overlay({ overlayId: 'o1', kind: 'expansion', loId: 'apstats.normal-distribution' })]);
  const first = reconcileGapLinks(n, [loGap], { sessionId: 's1' });
  const second = reconcileGapLinks(first.notes, [loGap], { sessionId: 's1' });
  assert.strictEqual(second.linked, 0);
  assert.strictEqual(second.notes, first.notes, 'no-op should return same reference');
});

test('prereq-refresher ↔ prerequisite gap on conceptLabel (case/space-insensitive)', () => {
  const n = notesOf([
    overlay({ overlayId: 'o1', kind: 'prereq-refresher', loId: null, conceptLabel: '  solving   linear equations ' }),
  ]);
  const r = reconcileGapLinks(n, [prereqGap], { sessionId: 's1' });
  assert.strictEqual(r.linked, 1);
  assert.strictEqual(r.notes.theoryOverlays[0].sourceGapId, 'gap-pre');
});

test('never overwrites an existing sourceGapId', () => {
  const n = notesOf([
    overlay({ overlayId: 'o1', kind: 'expansion', loId: 'apstats.normal-distribution', sourceGapId: 'preexisting' }),
  ]);
  const r = reconcileGapLinks(n, [loGap], { sessionId: 's1' });
  assert.strictEqual(r.linked, 0);
  assert.strictEqual(r.notes.theoryOverlays[0].sourceGapId, 'preexisting');
  assert.strictEqual(r.notes, n);
});

test('no matching pairs → notes untouched (same ref)', () => {
  const n = notesOf([overlay({ overlayId: 'o1', kind: 'expansion', loId: 'apstats.other' })]);
  const r = reconcileGapLinks(n, [loGap], { sessionId: 's1' });
  assert.strictEqual(r.linked, 0);
  assert.strictEqual(r.notes, n);
});

test('empty gaps → notes untouched', () => {
  const n = notesOf([overlay({ overlayId: 'o1', kind: 'expansion', loId: 'apstats.normal-distribution' })]);
  const r = reconcileGapLinks(n, [], { sessionId: 's1' });
  assert.strictEqual(r.linked, 0);
  assert.strictEqual(r.notes, n);
});

test('student-add overlay is never linked', () => {
  const n = notesOf([overlay({ overlayId: 'o1', kind: 'student-add', loId: null })]);
  const r = reconcileGapLinks(n, [loGap, prereqGap]);
  assert.strictEqual(r.linked, 0);
});

test('sessionId scoping: other-session overlay skipped when scoped, linked when unscoped', () => {
  const n = notesOf([
    overlay({ overlayId: 'o1', kind: 'expansion', loId: 'apstats.normal-distribution', addedInSessionId: 'OTHER' }),
  ]);
  const scoped = reconcileGapLinks(n, [loGap], { sessionId: 's1' });
  assert.strictEqual(scoped.linked, 0, 'scoped run should skip other-session overlay');
  const unscoped = reconcileGapLinks(n, [loGap]);
  assert.strictEqual(unscoped.linked, 1, 'unscoped run should link it');
});

test('expansion with no matching lo gap (only prereq gap present) → not linked', () => {
  const n = notesOf([overlay({ overlayId: 'o1', kind: 'expansion', loId: 'apstats.normal-distribution' })]);
  const r = reconcileGapLinks(n, [prereqGap], { sessionId: 's1' });
  assert.strictEqual(r.linked, 0);
});

test('multiple lo gaps same loId → first wins (deterministic)', () => {
  const n = notesOf([overlay({ overlayId: 'o1', kind: 'expansion', loId: 'apstats.normal-distribution' })]);
  const gaps: GapLinkInput[] = [
    { id: 'first', kind: 'lo', loId: 'apstats.normal-distribution' },
    { id: 'second', kind: 'lo', loId: 'apstats.normal-distribution' },
  ];
  const r = reconcileGapLinks(n, gaps, { sessionId: 's1' });
  assert.strictEqual(r.notes.theoryOverlays[0].sourceGapId, 'first');
});

test('gaps missing loId / conceptLabel are ignored', () => {
  const n = notesOf([
    overlay({ overlayId: 'o1', kind: 'expansion', loId: 'apstats.normal-distribution' }),
    overlay({ overlayId: 'o2', kind: 'prereq-refresher', loId: null, conceptLabel: 'fractions' }),
  ]);
  const gaps: GapLinkInput[] = [
    { id: 'g1', kind: 'lo' }, // no loId
    { id: 'g2', kind: 'prerequisite' }, // no conceptLabel
  ];
  const r = reconcileGapLinks(n, gaps, { sessionId: 's1' });
  assert.strictEqual(r.linked, 0);
});

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);

import { strict as assert } from 'node:assert';
import type { MockReviewItem } from '@evelyn/portal-contract/v1';
import { selectMockReviewFocus, buildMockReviewContext } from './review-focus';

let passed = 0, failed = 0;
function test(name: string, fn: () => void): void {
  try { fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

const mcq = (id: string, loId: string, isCorrect: boolean, marked = false): MockReviewItem => ({
  itemId: id, sectionId: 'mcq', sectionLabel: 'Section I', responseFormat: 'mcq',
  problemText: `stem ${id}`, choices: ['a', 'b', 'c', 'd'], correctAnswer: 'A',
  studentAnswer: isCorrect ? 'A' : 'B', isCorrect, markedForReview: marked, loId,
});
const frq = (id: string, loId: string, pts: number, max: number): MockReviewItem => ({
  itemId: id, sectionId: 'frq', sectionLabel: 'Section II', responseFormat: 'frq',
  problemText: `frq ${id}`, studentAnswer: 'essay text', loId,
  frqGrade: { itemId: id, totalPoints: pts, maxPoints: max, parts: [] },
});

test('correct items are never selected', () => {
  const { focus, remaining } = selectMockReviewFocus([mcq('a', 'x.u1', true), mcq('b', 'x.u1', false)]);
  assert.deepEqual(focus.map((i) => i.itemId), ['b']);
  assert.equal(remaining.length, 0);
});

test('marked-for-review misses come first, then weak FRQs, then MCQs', () => {
  const items = [
    mcq('m1', 'x.u1', false),
    frq('f1', 'x.u2', 2, 9),          // ratio .22 -> miss
    frq('f2', 'x.u2', 8, 9),          // ratio .89 -> NOT a miss
    mcq('m2', 'x.u3', false, true),   // marked miss -> first
  ];
  const { focus } = selectMockReviewFocus(items);
  assert.deepEqual(focus.map((i) => i.itemId), ['m2', 'f1', 'm1']);
});

test('cap of 8 with unit round-robin for MCQ misses; remainder returned', () => {
  const items = [
    ...Array.from({ length: 6 }, (_, i) => mcq(`u1-${i}`, 'x.algebra', false)),
    ...Array.from({ length: 6 }, (_, i) => mcq(`u2-${i}`, 'x.geometry', false)),
  ];
  const { focus, remaining } = selectMockReviewFocus(items);
  assert.equal(focus.length, 8);
  assert.equal(remaining.length, 4);
  // round-robin: first two picks are one from each unit
  assert.notEqual(focus[0].loId, focus[1].loId);
  assert.equal(focus.filter((i) => i.loId === 'x.algebra').length, 4);
  assert.equal(focus.filter((i) => i.loId === 'x.geometry').length, 4);
});

test('an ungraded FRQ (no frqGrade) counts as a miss', () => {
  const it = { ...frq('f9', 'x.u4', 0, 9) };
  delete (it as { frqGrade?: unknown }).frqGrade;
  const { focus } = selectMockReviewFocus([it]);
  assert.deepEqual(focus.map((i) => i.itemId), ['f9']);
});

test('pinned item is placed first even when it was not the top miss', () => {
  const items = [
    mcq('m1', 'x.u1', false, true),   // marked miss -> normally first
    mcq('m2', 'x.u2', false),
    mcq('m3', 'x.u3', false),
  ];
  const { focus } = selectMockReviewFocus(items, 8, ['m3']);
  assert.equal(focus[0].itemId, 'm3');
  assert.deepEqual(focus.map((i) => i.itemId).slice(1).sort(), ['m1', 'm2']);
});

test('a pinned CORRECT item is included; misses-only totals unchanged', () => {
  const items = [
    mcq('c1', 'x.u1', true),          // correct — never selected normally
    mcq('m1', 'x.u1', false),
  ];
  const { focus, remaining, totalMissed } = selectMockReviewFocus(items, 8, ['c1']);
  assert.equal(focus[0].itemId, 'c1');
  assert.ok(focus.some((i) => i.itemId === 'm1'));
  assert.equal(totalMissed, 1);       // only m1 is a miss
  assert.equal(remaining.length, 0);
});

test('pinned items take priority within the cap', () => {
  const items = Array.from({ length: 10 }, (_, i) => mcq(`u1-${i}`, 'x.algebra', false));
  const { focus } = selectMockReviewFocus(items, 8, ['u1-9', 'u1-8']);
  assert.equal(focus.length, 8);
  assert.deepEqual(focus.slice(0, 2).map((i) => i.itemId), ['u1-9', 'u1-8']);
  assert.equal(focus.filter((i) => i.itemId === 'u1-9').length, 1);   // pinned once only
});

test('unknown pin ids are ignored', () => {
  const items = [mcq('m1', 'x.u1', false), mcq('m2', 'x.u2', false)];
  const { focus } = selectMockReviewFocus(items, 8, ['nope', 'm2']);
  assert.equal(focus[0].itemId, 'm2');
  assert.equal(focus.length, 2);
});

test('buildMockReviewContext: focusItems carry itemId and honor pins', () => {
  const items = [
    mcq('c-ok', 'x.algebra', true),
    ...Array.from({ length: 9 }, (_, i) => mcq(`r${i}`, 'x.geometry', false)),
  ];
  const ctx = buildMockReviewContext({ formLabel: 'Form A', composite: 3, compositeMax: 5, items, pinItemIds: ['c-ok'] });
  assert.equal(ctx.focusItems[0].itemId, 'c-ok');   // pinned correct first
  assert.equal(ctx.totalMissed, 9);                 // correct item is not a miss
  assert.equal(ctx.focusItems.length, 8);
});

test('buildMockReviewContext: totals, per-unit remainder summary, passage truncation', () => {
  const longPassage = 'p'.repeat(2000);
  const items: MockReviewItem[] = [
    { ...mcq('m1', 'x.algebra', false), passage: { passageId: 'p1', title: 'T', text: longPassage } },
    ...Array.from({ length: 9 }, (_, i) => mcq(`r${i}`, 'x.geometry', false)),
  ];
  const ctx = buildMockReviewContext({ formLabel: 'Form A', composite: 3, compositeMax: 5, items });
  assert.equal(ctx.totalMissed, 10);
  assert.equal(ctx.focusItems.length, 8);
  assert.ok(ctx.focusItems[0].passageExcerpt!.length <= 1210);
  const geo = ctx.remainingMissSummary.find((s) => s.unitLabel === 'x.geometry');
  assert.ok(geo && geo.missed === 2);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);

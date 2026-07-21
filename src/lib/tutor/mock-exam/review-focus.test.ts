import { strict as assert } from 'node:assert';
import type { MockReviewItem } from '@evelyn/portal-contract/v1';
import {
  selectMockReviewFocus,
  buildMockReviewContext,
  buildMockReviewAgenda,
  buildMockReviewDrawer,
  buildMockReviewCorrectRows,
  mathSafeSnippet,
} from './review-focus';

const dollarCount = (s: string) => (s.match(/\$/g) ?? []).length;

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

// ─── mathSafeSnippet ────────────────────────────────────────────────────────
test('mathSafeSnippet: string shorter than max is returned unchanged', () => {
  assert.equal(mathSafeSnippet('short stem', 90), 'short stem');
});

test('mathSafeSnippet: prose cut trims and appends an ellipsis', () => {
  assert.equal(mathSafeSnippet('The quick brown fox jumps over', 10), 'The quick…');
});

test('mathSafeSnippet: a cut that lands mid-span backs up before the span', () => {
  const out = mathSafeSnippet('abc $x+y+z+w$ def', 8);
  assert.equal(out, 'abc…');
  assert.equal(dollarCount(out) % 2, 0);  // never leaves an unbalanced $
});

test('mathSafeSnippet: a leading span longer than maxLen is kept whole (never split)', () => {
  const out = mathSafeSnippet('$\\frac{a+b+c+d}{g}$ tail', 5);
  assert.ok(out.includes('\\frac'));
  assert.equal(dollarCount(out) % 2, 0);
  assert.ok(out.endsWith('…'));
});

// ─── frqScore (skipped-FRQ 0/9 bug) ─────────────────────────────────────────
test('skipped FRQ (empty parts) reports frqScore from totalPoints/maxPoints; agenda shows 0/9 not 0/0', () => {
  const it = frq('f1', 'x.u1', 0, 9);   // parts:[], totalPoints 0, maxPoints 9
  const ctx = buildMockReviewContext({ formLabel: 'F', composite: 0, compositeMax: 5, items: [it] });
  assert.deepEqual(ctx.focusItems[0].frqScore, { points: 0, max: 9 });
  const { agenda } = buildMockReviewAgenda(ctx);
  assert.equal(agenda[0].result, '0/9');
});

// ─── agenda label keeps math (no utterance field — rows send control markers) ─
test('agenda label keeps $..$ math balanced (the row itself carries no utterance)', () => {
  const it = { ...mcq('m1', 'x.u1', false), problemText: 'Find $\\lim_{x\\to2}(2x^2-3x+1)$ now' };
  const ctx = buildMockReviewContext({ formLabel: 'F', composite: 1, compositeMax: 5, items: [it] });
  const { agenda } = buildMockReviewAgenda(ctx);
  assert.ok(agenda[0].label.includes('$'));
  assert.equal(dollarCount(agenda[0].label) % 2, 0);
  assert.ok(!('utterance' in agenda[0]), 'utterance field was dropped');
});

// ─── pinned flags + pinnedCount ─────────────────────────────────────────────
test('buildMockReviewContext: pinned focus items are flagged and counted', () => {
  const items = [
    mcq('m1', 'x.u1', false),
    mcq('m2', 'x.u2', false),
    mcq('m3', 'x.u3', false),
  ];
  const ctx = buildMockReviewContext({ formLabel: 'F', composite: 1, compositeMax: 5, items, pinItemIds: ['m3', 'm2'] });
  assert.equal(ctx.pinnedCount, 2);
  assert.equal(ctx.focusItems[0].itemId, 'm3');
  assert.equal(ctx.focusItems[0].pinned, true);
  assert.equal(ctx.focusItems[1].itemId, 'm2');
  assert.equal(ctx.focusItems[1].pinned, true);
  // The unpinned natural miss carries no pinned flag.
  const m1 = ctx.focusItems.find((f) => f.itemId === 'm1');
  assert.ok(m1 && !m1.pinned);
});

test('buildMockReviewContext: pinnedCount is 0 and no item is pinned without pins', () => {
  const items = [mcq('m1', 'x.u1', false), mcq('m2', 'x.u2', false)];
  const ctx = buildMockReviewContext({ formLabel: 'F', composite: 1, compositeMax: 5, items });
  assert.equal(ctx.pinnedCount, 0);
  assert.ok(ctx.focusItems.every((f) => !f.pinned));
});

test('buildMockReviewContext: unknown pin ids do not inflate pinnedCount', () => {
  const items = [mcq('m1', 'x.u1', false), mcq('m2', 'x.u2', false)];
  const ctx = buildMockReviewContext({ formLabel: 'F', composite: 1, compositeMax: 5, items, pinItemIds: ['nope', 'm2'] });
  assert.equal(ctx.pinnedCount, 1);
  assert.equal(ctx.focusItems[0].itemId, 'm2');
  assert.equal(ctx.focusItems[0].pinned, true);
});

// ─── condensed footer (no loId dump) ────────────────────────────────────────
test('remainingLine is the condensed footer with a count and no loId list', () => {
  const items = Array.from({ length: 12 }, (_, i) => mcq(`m${i}`, 'x.algebra', false));
  const ctx = buildMockReviewContext({ formLabel: 'F', composite: 1, compositeMax: 5, items });
  const { remainingLine } = buildMockReviewAgenda(ctx);
  assert.equal(remainingLine, '+ 4 more missed — open the agenda (top right) to jump to any of them.');
});

// ─── allMisses (drawer data source) ─────────────────────────────────────────
test('buildMockReviewContext: allMisses lists every miss, focus-first, with snippet fields', () => {
  const items = [
    ...Array.from({ length: 5 }, (_, i) => mcq(`a${i}`, 'x.algebra', false)),
    ...Array.from({ length: 5 }, (_, i) => mcq(`g${i}`, 'x.geometry', false)),
  ];
  const ctx = buildMockReviewContext({ formLabel: 'F', composite: 1, compositeMax: 5, items });
  assert.equal(ctx.allMisses.length, 10);
  assert.equal(ctx.totalMissed, 10);
  const focusIds = ctx.focusItems.map((f) => f.itemId);
  assert.deepEqual(ctx.allMisses.slice(0, focusIds.length).map((m) => m.itemId), focusIds);
  assert.ok(ctx.allMisses.every((m) => typeof m.snippet === 'string' && !!m.sectionLabel && !!m.responseFormat));
});

// ─── drawer view-model ──────────────────────────────────────────────────────
test('buildMockReviewDrawer: one numbered row per miss, focus rows flagged', () => {
  const items = Array.from({ length: 9 }, (_, i) => mcq(`a${i}`, 'x.algebra', false));
  const ctx = buildMockReviewContext({ formLabel: 'F', composite: 1, compositeMax: 5, items });
  const rows = buildMockReviewDrawer(ctx);
  assert.equal(rows.length, 9);
  assert.equal(rows.filter((r) => r.isFocus).length, 8);
  assert.deepEqual(rows.map((r) => r.n), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});


test('mathSafeSnippet: escaped \\$ currency is not a math delimiter', () => {
  const s = 'A firm charges \\$40 per unit and \\$2.50 per mile, where $x \\ge 0$ is miles driven and revenue grows';
  const out = mathSafeSnippet(s, 56);
  // cut lands in prose between the currency figures and the math span —
  // must not treat \\$40/\\$2.50 as span delimiters (phantom pairing).
  assert.ok(out.endsWith('…'));
  assert.ok(!out.includes('$x'), 'cut should fall before the real math span');
  assert.ok(out.includes('\\$2.50'), 'currency stays intact');
});

// ─── real exam question numbers (qNum) ──────────────────────────────────────
test('qNum = real exam question number: CONTINUOUS 1-based position over the FULL served list', () => {
  const item = (id: string, section: string, isCorrect: boolean): MockReviewItem => ({
    itemId: id, sectionId: 'x', sectionLabel: section, responseFormat: 'mcq',
    problemText: `stem ${id}`, choices: ['a', 'b', 'c', 'd'], correctAnswer: 'A',
    studentAnswer: isCorrect ? 'A' : 'B', isCorrect, loId: 'x.u1',
  });
  // Served exam order, two sections, misses interleaved with correct items.
  const items = [
    item('s1', 'Section I', true),
    item('s2', 'Section I', false),
    item('s3', 'Section I', false),
    item('s4', 'Section I', true),
    item('t1', 'Section II', false),
    item('t2', 'Section II', true),
    item('t3', 'Section II', false),
  ];
  const ctx = buildMockReviewContext({ formLabel: 'F', composite: 1, compositeMax: 5, items });
  const qByMiss = new Map(ctx.allMisses.map((m) => [m.itemId, m.qNum]));
  // Correct items still consume a number — numbering counts every item.
  assert.equal(qByMiss.get('s2'), 2);
  assert.equal(qByMiss.get('s3'), 3);
  // Continuous: Section II's first item CONTINUES the count (no per-section
  // restart) — t1 is the 5th served item, t3 the 7th.
  assert.equal(qByMiss.get('t1'), 5);
  assert.equal(qByMiss.get('t3'), 7);
  // focusItems carry the same real numbers.
  const qByFocus = new Map(ctx.focusItems.map((f) => [f.itemId, f.qNum]));
  assert.equal(qByFocus.get('s2'), 2);
  assert.equal(qByFocus.get('t3'), 7);
  // Agenda + drawer view-models expose qNum for the badge.
  const { agenda } = buildMockReviewAgenda(ctx);
  assert.ok(agenda.every((a) => typeof a.qNum === 'number'));
  const rows = buildMockReviewDrawer(ctx);
  assert.equal(new Map(rows.map((r) => [r.itemId, r.qNum])).get('t1'), 5);
});

// ─── correct items (drawer "show correct too" toggle) ───────────────────────
test('buildMockReviewContext: correctItems = every non-miss served item, condensed', () => {
  const items = [
    mcq('c1', 'x.algebra', true),
    mcq('m1', 'x.algebra', false),
    mcq('c2', 'x.geometry', true),
    frq('f1', 'x.u2', 8, 9),          // ratio .89 -> NOT a miss -> correct
    frq('f2', 'x.u2', 2, 9),          // ratio .22 -> miss
  ];
  const ctx = buildMockReviewContext({ formLabel: 'F', composite: 1, compositeMax: 5, items });
  assert.deepEqual(ctx.correctItems.map((c) => c.itemId).sort(), ['c1', 'c2', 'f1']);
  assert.equal(ctx.totalMissed, 2);   // m1 + f2 only
  // Same condensed shape as a miss row (snippet/qNum present).
  assert.ok(ctx.correctItems.every((c) => typeof c.snippet === 'string' && typeof c.qNum === 'number'));
  // A correct FRQ still carries its frqScore for the ✓/points display.
  assert.deepEqual(ctx.correctItems.find((c) => c.itemId === 'f1')?.frqScore, { points: 8, max: 9 });
});

test('a pinned CORRECT item appears in correctItems (never in allMisses)', () => {
  const items = [mcq('c1', 'x.u1', true), mcq('m1', 'x.u1', false)];
  const ctx = buildMockReviewContext({ formLabel: 'F', composite: 1, compositeMax: 5, items, pinItemIds: ['c1'] });
  assert.ok(ctx.correctItems.some((c) => c.itemId === 'c1'));
  assert.ok(!ctx.allMisses.some((m) => m.itemId === 'c1'));
});

test('buildMockReviewCorrectRows: one row per correct item with a ✓ result; pinned-correct flagged', () => {
  const items = [mcq('c1', 'x.u1', true), mcq('m1', 'x.u1', false), mcq('c2', 'x.u2', true)];
  const ctx = buildMockReviewContext({ formLabel: 'F', composite: 1, compositeMax: 5, items, pinItemIds: ['c1'] });
  const rows = buildMockReviewCorrectRows(ctx);
  assert.equal(rows.length, 2);   // c1, c2
  assert.ok(rows.every((r) => r.result.startsWith('✓')));
  assert.equal(rows.find((r) => r.itemId === 'c1')?.isFocus, true);   // pinned-correct is "up next"
  assert.equal(rows.find((r) => r.itemId === 'c2')?.isFocus, false);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);

// scripts/test-relation-step-note.ts
// Run: npx tsx scripts/test-relation-step-note.ts
//
// Witness correction note for a wrong inequality step
// (src/lib/tutor/voice/relation-step-note.ts). A COUNTED disagreement in the
// `chain` or `vs-problem` tier plants a next-turn correction note; `adjacent`
// never does. The note quotes the boarded line and its reference and states
// the witness value at which exactly one of them holds.
import { strict as assert } from 'node:assert';
import { extractProblemRelation } from '../src/lib/tutor/voice/relation-sampling';
import { checkEquationRelations, type EquationRelationCheck } from '../src/lib/tutor/voice/relation-step-check';
import { buildJudgeCorrectionNote, shouldConsumeJudgeCorrectionNote } from '../src/lib/tutor/voice/judge-correction-note';
import {
  CORRECTION_NOTE_MARKER,
  buildRelationStepNote,
  decideRelationStepNote,
  relationStepNoteKey,
  settleRelationStepNote,
  recordRelationStepNoteDispatch,
  relationStepNoteExpired,
  type RelationStepNoteRecord,
} from '../src/lib/tutor/voice/relation-step-note';

const R = String.raw;
let n = 0;
const ok = (cond: unknown, msg: string): void => { assert.ok(cond, msg); n++; };
const eq = <T>(a: T, b: T, msg: string): void => { assert.deepEqual(a, b, msg); n++; };

const problem = (statement: string) => {
  const p = extractProblemRelation(statement);
  assert.ok(p.ok, `test setup: problem must parse — ${statement}`);
  return p;
};

// ── the marker is the one every other correction note opens with ──────────
{
  const judge = buildJudgeCorrectionNote(['x = 3 is wrong']) ?? '';
  ok(judge.startsWith(CORRECTION_NOTE_MARKER), 'marker matches the judge correction note');
  eq(CORRECTION_NOTE_MARKER, '[correction note — not from the student]', 'marker text');
}

// ── production: 45 + 12t ≥ 20 + 18t, boarded t ≥ 25/6 ─────────────────────
const TRIPS = problem(R`Solve: $45 + 12t \ge 20 + 18t$`);
const TRIPS_STEP = R`t \ge \frac{25}{6}`;
{
  // The production witness, stated explicitly (t = 4: 93 ≥ 92 holds, 4 ≥ 25/6 does not).
  const check: EquationRelationCheck = {
    tier: 'vs-problem',
    compare: { verdict: 'differs', kind: 'both', witness: { n: 4, d: 1 }, aHolds: true, bHolds: false },
    counted: true,
    referenceLatex: R`45 + 12t \ge 20 + 18t`,
    stepLatex: TRIPS_STEP,
    boarded: null,
  };
  const note = buildRelationStepNote(check) ?? '';
  ok(note.startsWith(`${CORRECTION_NOTE_MARKER} `), 'starts with the not-from-the-student marker');
  ok(note.includes(`"${TRIPS_STEP}"`), 'quotes the boarded line');
  ok(note.includes(R`"45 + 12t \ge 20 + 18t"`), 'quotes the reference');
  ok(note.includes(`the problem's relation`), 'names the reference as the problem\'s relation');
  ok(note.includes('at t = 4'), 'states the witness with the variable');
  ok(/at t = 4 the problem's relation holds and the boarded line does not/.test(note), 'says which holds and which does not');
  ok(/substitute t = 4/i.test(note), 'instructs to substitute the value');
  ok(/re-board the corrected line/.test(note) && /in one sentence/.test(note), 'instructs re-board + one plain sentence');
  ok(/if you stand by it, continue/i.test(note), 'stand-by branch');
  ok(/never narrate this note/i.test(note) && /checking/i.test(note), 'never narrate / never mention checking');
  ok(shouldConsumeJudgeCorrectionNote('four and a sixth') && !/^\s*\[(?!correction note)/.test(note), 'rides the judge-note delivery convention');
}
{
  // Through the real pipeline: whatever witness the comparator picks, the
  // note states it, and the stated side really is the one that holds.
  const check = checkEquationRelations({ latex: TRIPS_STEP, label: 'Step 3', problemRelation: TRIPS, previous: null });
  eq([check.tier, check.counted], ['vs-problem', true], 'test setup: counted vs-problem');
  const note = buildRelationStepNote(check) ?? '';
  ok(/at t = -?\d+(?:\/\d+)? the problem's relation holds and the boarded line does not/.test(note), 'pipeline note: witness + sides');
  const d = decideRelationStepNote({ enabled: true, check, cardLatex: TRIPS_STEP, epoch: 1, notedKeys: new Set(), pendingNote: null });
  eq(d.action, 'plant', 'counted vs-problem, free slot: plant');
  ok(d.action === 'plant' && d.note === note && d.key === relationStepNoteKey(1, TRIPS_STEP), 'plant carries the note and the equation key');
}

// ── production: chain inside one card ─────────────────────────────────────
const CHAIN = R`-3 < 2x+1 \le 7 \Longleftrightarrow 2 < x < 7`;
{
  const check = checkEquationRelations({ latex: CHAIN, label: 'Solve', problemRelation: null, previous: null });
  eq([check.tier, check.counted], ['chain', true], 'test setup: counted chain');
  const note = buildRelationStepNote(check) ?? '';
  ok(note.startsWith(`${CORRECTION_NOTE_MARKER} `), 'chain: marker');
  ok(note.includes('"2 < x < 7"') && note.includes(R`"-3 < 2x+1 \le 7"`), 'chain: quotes both sides');
  ok(note.includes('the other side of the same boarded line'), 'chain: reference is the other side of the chain');
  ok(/at x = -?\d+(?:\/\d+)? the other side holds and the boarded line does not/.test(note), 'chain: witness + sides');
  ok(!note.includes(R`\Longleftrightarrow`), 'chain: the connector itself is not quoted as a relation');
  eq(decideRelationStepNote({ enabled: true, check, cardLatex: CHAIN, epoch: 0, notedKeys: new Set(), pendingNote: null }).action, 'plant', 'counted chain: plant');
}
{
  // ⟺ counted on an `adds`: the boarded side holds where the reference does not.
  const check = checkEquationRelations({ latex: R`x > 3 \iff x > 1`, label: '', problemRelation: null, previous: null });
  eq([check.tier, check.counted], ['chain', true], 'test setup: adds-iff counted');
  const note = buildRelationStepNote(check) ?? '';
  ok(/at x = -?\d+(?:\/\d+)? the boarded line holds and the other side does not/.test(note), 'adds: sides stated the other way round');
}

// ── decision table ────────────────────────────────────────────────────────
{
  const counted = checkEquationRelations({ latex: TRIPS_STEP, label: 'Step 3', problemRelation: TRIPS, previous: null });
  const key = relationStepNoteKey(1, TRIPS_STEP);
  const base = { enabled: true, check: counted, cardLatex: TRIPS_STEP, epoch: 1, notedKeys: new Set<string>(), pendingNote: null as string | null };

  eq(decideRelationStepNote({ ...base, enabled: false }).action, 'none', 'flag off: nothing');
  const pending = decideRelationStepNote({ ...base, pendingNote: '[correction note — not from the student] earlier' });
  eq([pending.action, pending.action === 'skip' && pending.reason], ['skip', 'note-pending'], 'a pending note is never overwritten');
  const again = decideRelationStepNote({ ...base, notedKeys: new Set([key]) });
  eq([again.action, again.action === 'skip' && again.reason], ['skip', 'already-noted'], 'one note per boarded equation');
  const bothApply = decideRelationStepNote({ ...base, notedKeys: new Set([key]), pendingNote: 'x' });
  eq([bothApply.action, bothApply.action === 'skip' && bothApply.reason], ['skip', 'already-noted'], 'already-noted wins over note-pending');
  eq(decideRelationStepNote({ ...base, epoch: 2 }).action, 'plant', 'same latex under a NEW problem is a new equation');
  ok(relationStepNoteKey(1, `  t   \\ge  \\frac{25}{6} `) === key, 'key ignores whitespace differences');

  // adjacent tier never plants, even when counted.
  const prev = checkEquationRelations({ latex: R`2x + 1 \le 7`, label: '', problemRelation: null, previous: null }).boarded;
  const adjacent = checkEquationRelations({ latex: R`x \ge 3`, label: 'Step 3', problemRelation: null, previous: prev });
  eq([adjacent.tier, adjacent.counted], ['adjacent', true], 'test setup: counted adjacent');
  eq(decideRelationStepNote({ ...base, check: adjacent, cardLatex: R`x \ge 3` }).action, 'none', 'adjacent tier: never a note');
  eq(buildRelationStepNote(adjacent), null, 'adjacent tier: no note text either');

  // Not counted / equivalent / unknown / skipped ⇒ nothing.
  const fine = checkEquationRelations({ latex: R`25 \ge 6t`, label: 'Step 2', problemRelation: TRIPS, previous: null });
  eq(decideRelationStepNote({ ...base, check: fine, cardLatex: R`25 \ge 6t` }).action, 'none', 'equivalent step: nothing');
  const half = checkEquationRelations({ latex: R`-3 < 2x+1`, label: '', problemRelation: problem(R`Solve: $-3 < 2x+1 \le 7$`), previous: null });
  eq(decideRelationStepNote({ ...base, check: half, cardLatex: R`-3 < 2x+1` }).action, 'none', 'adds-only half (not counted): nothing');
  const labelled = checkEquationRelations({ latex: TRIPS_STEP, label: 'Spot the error', problemRelation: TRIPS, previous: null });
  eq(decideRelationStepNote({ ...base, check: labelled }).action, 'none', 'deliberate wrong step: nothing');
  const prose = checkEquationRelations({ latex: R`t \ge 5 \text{ whole trips}`, label: '', problemRelation: TRIPS, previous: null });
  eq(decideRelationStepNote({ ...base, check: prose }).action, 'none', 'unknown: nothing');
}

// ── settle: a note for an equation that never painted is withdrawn ────────
{
  const rec = { note: 'N', key: 'k', latex: TRIPS_STEP, renderIds: ['eq-1'] as string[] | null, onBoard: false, settled: false };
  eq(settleRelationStepNote({ record: rec, pendingNote: 'N', isOnBoard: () => true }), 'keep', 'render still on the board: keep');
  eq(settleRelationStepNote({ record: rec, pendingNote: 'N', isOnBoard: () => false }), 'withdraw', 'render rolled back: withdraw');
  eq(settleRelationStepNote({ record: { ...rec, renderIds: null }, pendingNote: 'N', isOnBoard: () => true }), 'withdraw', 'never dispatched: withdraw');
  eq(settleRelationStepNote({ record: { ...rec, renderIds: [] }, pendingNote: 'N', isOnBoard: () => true }), 'withdraw', 'dispatched but nothing painted (rejected): withdraw');
  eq(settleRelationStepNote({ record: { ...rec, renderIds: [], onBoard: true }, pendingNote: 'N', isOnBoard: () => false }), 'keep', 'dedup hit — the same equation is already on the board: keep');
  eq(settleRelationStepNote({ record: { ...rec, renderIds: ['a', 'b'] }, pendingNote: 'N', isOnBoard: (id) => id === 'b' }), 'keep', 'any surviving render keeps the note');
  eq(settleRelationStepNote({ record: rec, pendingNote: 'another note', isOnBoard: () => false }), 'gone', 'slot now holds a different note: leave it alone');
  eq(settleRelationStepNote({ record: rec, pendingNote: null, isOnBoard: () => false }), 'gone', 'already delivered: nothing to withdraw');
  eq(settleRelationStepNote({ record: { ...rec, settled: true }, pendingNote: 'N', isOnBoard: () => false }), 'gone', 'a settled record is not re-examined');
  eq(settleRelationStepNote({ record: null, pendingNote: 'N', isOnBoard: () => false }), 'gone', 'no record');
}

// ── 2026-10-04: legitimate lines never get a note; production cases still do ─
{
  const base = { enabled: true, epoch: 1, notedKeys: new Set<string>(), pendingNote: null as string | null };
  const decide = (statement: string | null, latex: string, label: string) => {
    const check = checkEquationRelations({ latex, label, problemRelation: statement ? problem(statement) : null, previous: null });
    return { check, d: decideRelationStepNote({ ...base, check, cardLatex: latex }) };
  };
  const INEQ = R`Solve the inequality: $2x + 3 < 13$`;
  for (const [statement, latex, label] of [
    [INEQ, 'x = 5', 'Boundary point'], [INEQ, R`2x + 3 = 13`, 'Related equation'], [INEQ, 'x = 0', 'Test point'],
    [INEQ, 'x > 5', 'Your step'], [INEQ, 'x > 5', 'You wrote'], [INEQ, 'x > 5', 'Is this right?'], [INEQ, 'x > 5', 'Common trap'],
    [INEQ, 'x > 5', "Sam's line"], [INEQ, 'x > 5', 'Outside the interval (not a solution)'],
    [R`Solve: $-3x > 6$`, 'x > -2', 'What if we forget to flip?'],
    [R`Solve the equation: $2x + 3 = 13$`, R`3x - 1 = 8`, 'Similar example'],
    [R`Solve the equation: $2x + 3 = 13$`, 'x > 5', ''],
    [INEQ, 'x = 5', ''],
  ] as const) {
    const { check, d } = decide(statement, latex, label);
    eq([check.counted, d.action], [false, 'none'], `no note: "${latex}" labelled "${label}"`);
  }
  // The three production cases are still counted and still plant.
  for (const [statement, latex, label, tier] of [
    [R`Solve: $45 + 12t \ge 20 + 18t$`, R`t \ge \frac{25}{6}`, '', 'vs-problem'],
    [R`Solve: $-4 < \frac{3x+2}{-2} \le 5$`, R`-4 < x \le 2`, '', 'vs-problem'],
    [null, R`-3 < 2x+1 \le 7 \Longleftrightarrow 2 < x < 7`, '', 'chain'],
  ] as const) {
    const { check, d } = decide(statement, latex, label);
    eq([check.tier, check.counted, d.action], [tier, true, 'plant'], `production case still planted: ${latex}`);
    ok(d.action === 'plant' && /deliberately wrong \(an error for the student to find\) or is the student's own work, ignore this note and continue/.test(d.note), 'note carries the deliberate-wrong / student-work clause');
  }
}

// ── ids accumulate across attempts of the planting call (kill → re-board) ──
{
  const fresh = (): RelationStepNoteRecord => ({ note: 'N', key: 'k', latex: TRIPS_STEP, renderIds: null, onBoard: false, settled: false });
  const rec = fresh();
  recordRelationStepNoteDispatch(rec, { latex: TRIPS_STEP, assignedIds: ['a1'] });
  eq(rec.renderIds, ['a1'], 'attempt 1 ids recorded');
  // attempt 1 is killed and rolled back; attempt 2 re-boards the same latex.
  recordRelationStepNoteDispatch(rec, { latex: TRIPS_STEP, assignedIds: ['a2'] });
  eq(rec.renderIds, ['a1', 'a2'], 'attempt 2 ids appended');
  eq(settleRelationStepNote({ record: rec, pendingNote: 'N', isOnBoard: (id) => id === 'a2' }), 'keep', 're-boarded line is on the board: the note is kept');
  eq(settleRelationStepNote({ record: rec, pendingNote: 'N', isOnBoard: () => false }), 'withdraw', 'both attempts rolled back: withdraw');
  const dup = fresh();
  recordRelationStepNoteDispatch(dup, { latex: TRIPS_STEP, assignedIds: ['a1'] });
  recordRelationStepNoteDispatch(dup, { latex: TRIPS_STEP, assignedIds: [], duplicate: true });
  ok(dup.onBoard === true, 'a later dedup hit marks the line as on the board');
  const rej = fresh();
  recordRelationStepNoteDispatch(rej, { latex: TRIPS_STEP, assignedIds: [], duplicate: true, rejected: true });
  eq([rej.onBoard, rej.renderIds], [false, []], 'rejected dispatch: dispatched, nothing painted');
  const other = fresh();
  recordRelationStepNoteDispatch(other, { latex: 'x < 2', assignedIds: ['z'] });
  eq(other.renderIds, null, 'another equation does not touch the record');
  const settled = { ...fresh(), settled: true };
  recordRelationStepNoteDispatch(settled, { latex: TRIPS_STEP, assignedIds: ['z'] });
  eq(settled.renderIds, null, 'a settled record is not touched');
  assert.doesNotThrow(() => recordRelationStepNoteDispatch(null, { latex: undefined })); n++;
}

// ── no deadline: the note expires with its problem / page ─────────────────
{
  const scope = { statement: 'Solve: 2x < 6', epoch: 3, pageKey: 'P1' };
  const rec: RelationStepNoteRecord = { note: 'N', key: 'k', latex: 'x > 3', renderIds: ['a'], onBoard: false, settled: true, scope };
  ok(!relationStepNoteExpired({ record: rec, pendingNote: 'N', now: { statement: ' Solve: 2x < 6 ', epoch: 3, pageKey: 'P1' } }), 'same problem and page: alive');
  ok(relationStepNoteExpired({ record: rec, pendingNote: 'N', now: { statement: 'Solve: 3x < 9', epoch: 4, pageKey: 'P1' } }), 'new problem: expired');
  ok(relationStepNoteExpired({ record: rec, pendingNote: 'N', now: { statement: 'Solve: 2x < 6', epoch: 4, pageKey: 'P1' } }), 'new epoch: expired');
  ok(relationStepNoteExpired({ record: rec, pendingNote: 'N', now: { statement: 'Solve: 2x < 6', epoch: 3, pageKey: 'P2' } }), 'new page: expired');
  ok(relationStepNoteExpired({ record: rec, pendingNote: 'N', now: { statement: null, epoch: 3, pageKey: 'P1' } }), 'problem gone: expired');
  ok(!relationStepNoteExpired({ record: rec, pendingNote: 'another note', now: { statement: 'x', epoch: 9, pageKey: 'P9' } }), 'slot holds another note: not ours to clear');
  ok(!relationStepNoteExpired({ record: rec, pendingNote: null, now: { statement: 'x', epoch: 9, pageKey: 'P9' } }), 'already delivered');
  ok(!relationStepNoteExpired({ record: { ...rec, scope: undefined }, pendingNote: 'N', now: { statement: 'x', epoch: 9, pageKey: 'P9' } }), 'no scope recorded: never expires by this rule');
  ok(!relationStepNoteExpired({ record: null, pendingNote: 'N', now: { statement: 'x', epoch: 9, pageKey: 'P9' } }), 'no record');
}

// ── structural: no topic examples, bounded, never throws ──────────────────
{
  const long = `x \\ge ${'1 + '.repeat(200)}1`;
  const check: EquationRelationCheck = {
    tier: 'vs-problem',
    compare: { verdict: 'differs', kind: 'drops', witness: { n: 19, d: 6 }, aHolds: true, bHolds: false },
    counted: true, referenceLatex: 'x \\le 4', stepLatex: long, boarded: null,
  };
  const note = buildRelationStepNote(check) ?? '';
  ok(note.length < 1200, 'long latex is truncated');
  ok(note.includes('at x = 19/6'), 'fractional witness');
  for (const junk of [null, undefined, {}, { tier: 'chain', counted: true, compare: null }, { tier: 'vs-problem', counted: true, compare: { verdict: 'differs' } }]) {
    assert.doesNotThrow(() => buildRelationStepNote(junk as unknown as EquationRelationCheck)); n++;
    eq(buildRelationStepNote(junk as unknown as EquationRelationCheck), null, 'junk ⇒ null');
  }
  eq(buildRelationStepNote({ ...check, stepLatex: '' }), null, 'nothing to quote ⇒ no note');
}

console.log(`relation-step-note: ${n} cases passed`);

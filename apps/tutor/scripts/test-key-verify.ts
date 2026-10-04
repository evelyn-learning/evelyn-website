/**
 * Creation-time answer-key verification.
 *
 * Principle under test: a stored answer key is trusted only if it was
 * independently verified; an unverified key is never served as a practice
 * item's key nor used to grade in a session.
 *
 * Under test:
 *   - portal/key-compare.ts — the pure comparison (numeric tolerance, MCQ
 *     letter/text/flag keys, relations, free text via an injected judge);
 *   - portal/key-verify.ts `verifyAnswerKey` — blind solve → compare → judge
 *     with a FAKE model: every status, and every failure → `unverifiable`;
 *   - lesson-plan/plan-key-verify.ts `verifyPlanKeys` with a fake verifier —
 *     statuses recorded on segments, time budget, background completion,
 *     ill-posed drop, flag off;
 *   - portal/withdrawn-items.ts — a segment whose `keyCheck` is present and
 *     not `verified` is treated exactly like a withdrawn one
 *     (`effectiveSegment`, `getSegmentTruth`, the brain prompt blocks,
 *     `planAuthoredFallback`, `effectiveAnchor`), and practice retrieval
 *     (`retrievePractice` → planToItems) does not serve it; a legacy segment
 *     with no `keyCheck` is unchanged.
 *
 * No database, no network: fakes only.
 *
 * Run (ts-node/commonjs, same as test:withdrawn-items):
 *   npm run test:key-verify
 */
import { strict as assert } from 'node:assert';
import {
  compareDeterministic,
  compareKeyToSolve,
  compareKeyWithJudge,
  keyedLetterOf,
  numbersAgree,
  toChoices,
  type KeyJudge,
} from '@/lib/tutor/portal/key-compare';
import {
  verifyAnswerKey,
  keyVerifyEnabled,
  type KeyVerifyLlm,
  type KeyVerifyLlmRequest,
} from '@/lib/tutor/portal/key-verify';
import {
  verifyPlanKeys,
  formatKeyVerifySummary,
  type PlanKeyVerifyFn,
  type KeyCheckTarget,
} from '@/lib/tutor/lesson-plan/plan-key-verify';
import { parseLessonPlan } from '@/lib/tutor/lesson-plan/parser';
import { buildRecapSegment, namespaceGeneratedLos } from '@/lib/tutor/lesson-plan/generate-from-text';
import { buildLessonPlanContext, getSegmentTruth } from '@/lib/tutor/lesson-plan/context';
import { LESSON_PLAN_SCHEMA_VERSION, type KeyCheck, type LessonPlan, type Segment } from '@/lib/tutor/lesson-plan/types';
import { effectiveSegment, keyCheckUntrusted, segmentKeyUntrusted, NO_VERIFIED_ANSWER_LINE } from '@/lib/tutor/portal/withdrawn-items';
import { retrievePractice, type PracticeSources, type PlanLite } from '@/lib/tutor/portal/practice';
import { toPlanLite } from '@/lib/tutor/portal/adapters';
import { formatSegmentTruth, formatLessonPlanContext } from '@/lib/tutor/voice/claude-brain';
import { formatLessonPlanForRealtime } from '@/lib/tutor/orchestrator/format-lesson-plan';
import { planAuthoredFallback, effectiveAnchor } from '@/lib/tutor/voice/problem-generator';

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
    passed++;
    console.log(`  ok - ${name}`);
  } catch (e) {
    failed++;
    console.log(`  FAIL - ${name}`);
    console.error(e);
  } finally {
    delete process.env.TUTOR_KEY_VERIFY_AT_CREATION;
  }
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

async function main(): Promise<void> {
  // =========================================================================
  console.log('\npure comparator (key-compare.ts):\n');
  // =========================================================================

  const det = (k: string, s: string) => compareDeterministic(k, s).result;

  await test('numeric: tolerance is max(0.01, 1 % of the solved value)', () => {
    assert.equal(numbersAgree(100, 100.9), true);
    assert.equal(numbersAgree(100, 101.2), false);
    assert.equal(numbersAgree(0.5, 0.509), true, 'absolute floor 0.01');
    assert.equal(numbersAgree(0.5, 0.52), false);
    assert.equal(det('12.5', '12.5'), 'same');
    assert.equal(det('1/2', '0.5'), 'same');
    assert.equal(det('x = 13/3', '4.3333'), 'same');
    assert.equal(det('42', '43'), 'different');
    assert.equal(det('3', '-3'), 'different');
    assert.equal(det('50%', '0.5'), 'same');
  });

  await test('numeric: anything richer than one number is NOT decided deterministically', () => {
    assert.equal(det('2x + 8', '2(x + 4)'), 'unknown');
    assert.equal(det('3 or 5', '3'), 'unknown');
    assert.equal(det('2 m', '200 cm'), 'unknown');
    assert.equal(det('(0, 3)', '(0,3)'), 'same', 'identical after notation clean-up');
  });

  const strChoices = toChoices(['144', '6', '24', '36']);
  const objChoices = toChoices([
    { id: 'a', text: 'x = 4', correct: true },
    { id: 'b', text: 'x = −4' },
    { id: 'c', text: 'x = 6/5' },
  ]);

  await test('mcq: the key resolves by letter, by option text, and by the correct flag', () => {
    assert.deepEqual(keyedLetterOf({ key: 'B', choices: strChoices }), { letter: 'B', via: 'letter' });
    assert.equal(keyedLetterOf({ key: 'd', choices: strChoices }).letter, 'D');
    assert.deepEqual(keyedLetterOf({ key: ' 36 ', choices: strChoices }), { letter: 'D', via: 'text' });
    assert.deepEqual(keyedLetterOf({ key: null, choices: objChoices }), { letter: 'A', via: 'flag' });
  });

  await test('mcq: compared by OPTION — solver letter or solver option text', () => {
    assert.equal(compareKeyToSolve({ claimedAnswer: 'B', choices: strChoices, solverAnswer: '6', solverOption: 'B' }).result, 'same');
    assert.equal(compareKeyToSolve({ claimedAnswer: '36', choices: strChoices, solverAnswer: '36', solverOption: '' }).result, 'same', 'text key vs text answer');
    assert.equal(compareKeyToSolve({ claimedAnswer: 'B', choices: strChoices, solverAnswer: '36', solverOption: 'D' }).result, 'different');
    assert.equal(compareKeyToSolve({ claimedAnswer: '', choices: objChoices, solverAnswer: 'x = 4', solverOption: 'A' }).result, 'same', 'flag key');
    assert.equal(compareKeyToSolve({ claimedAnswer: '', choices: objChoices, solverAnswer: '', solverOption: 'C' }).result, 'different', 'flag key vs another option');
  });

  await test('mcq: an unresolvable key, an unresolved solver, or a flag/key conflict is never "same"', () => {
    assert.equal(compareKeyToSolve({ claimedAnswer: 'Z', choices: strChoices, solverAnswer: '6', solverOption: 'B' }).result, 'unknown');
    assert.equal(compareKeyToSolve({ claimedAnswer: 'B', choices: strChoices, solverAnswer: 'none of these', solverOption: '' }).result, 'unknown');
    const conflict = compareKeyToSolve({ claimedAnswer: 'x = 6/5', choices: objChoices, solverAnswer: 'x = 4', solverOption: 'A' });
    assert.equal(conflict.result, 'unknown');
    assert.match(conflict.reason, /resolves to C/);
  });

  await test('relations: compared as solution sets, not by first number', () => {
    assert.equal(det('-4 < x \\le 2', '-4 \\le x < 2'), 'different', 'same numbers, different endpoints');
    assert.equal(det('-4 < x ≤ 2', '-4 ≤ x < 2'), 'different');
    assert.equal(det('x > 3', 'x >= 3'), 'different');
    assert.equal(det('x > 3', 'x < 3'), 'different');
    assert.equal(det('x > 3', '3 < x'), 'same');
    assert.equal(det('$x \\geq 5$', 'x >= 5'), 'same');
    assert.equal(det('x > 3', '(3, ∞)'), 'unknown', 'interval notation goes to the judge');
    assert.equal(det('x > 3', '3'), 'unknown', 'a bare number against an inequality is not decided');
  });

  await test('free text: the injected judge decides only what the deterministic pass cannot', async () => {
    const calls: Array<[string, string]> = [];
    const judge = (verdict: 'SAME' | 'DIFFERENT' | 'KEY_INCOMPLETE' | 'CANNOT_JUDGE'): KeyJudge => async (a1, a2) => {
      calls.push([a1, a2]);
      return { verdict, reason: `judge said ${verdict}` };
    };
    assert.equal((await compareKeyWithJudge({ claimedAnswer: '42', solverAnswer: '42.0' }, judge('DIFFERENT'))).verdict, 'SAME');
    assert.equal((await compareKeyWithJudge({ claimedAnswer: '42', solverAnswer: '17' }, judge('SAME'))).verdict, 'DIFFERENT');
    assert.equal(calls.length, 0, 'no judge call for a deterministic verdict');

    const same = await compareKeyWithJudge({ claimedAnswer: 'mitochondria make ATP', solverAnswer: 'ATP is produced in the mitochondria' }, judge('SAME'));
    assert.deepEqual([same.verdict, same.method], ['SAME', 'judge']);
    assert.deepEqual(calls[0], ['mitochondria make ATP', 'ATP is produced in the mitochondria'], 'ANSWER 1 is the stored key');
    assert.equal((await compareKeyWithJudge({ claimedAnswer: '2x + 8', solverAnswer: '2x - 8' }, judge('DIFFERENT'))).verdict, 'DIFFERENT');
    assert.equal((await compareKeyWithJudge({ claimedAnswer: 'x = 2', solverAnswer: 'x = 2 or x = -2' }, judge('KEY_INCOMPLETE'))).verdict, 'KEY_INCOMPLETE');
    assert.equal((await compareKeyWithJudge({ claimedAnswer: 'see figure', solverAnswer: 'B' }, judge('CANNOT_JUDGE'))).verdict, 'CANNOT_JUDGE');
    assert.equal((await compareKeyWithJudge({ claimedAnswer: '2x + 8', solverAnswer: '2(x + 4)' })).verdict, 'CANNOT_JUDGE', 'no judge supplied');

    const before = calls.length;
    const mcq = await compareKeyWithJudge({ claimedAnswer: 'Z', choices: strChoices, solverAnswer: '6', solverOption: 'B' }, judge('SAME'));
    assert.equal(mcq.verdict, 'CANNOT_JUDGE');
    assert.equal(calls.length, before, 'multiple choice is never judged');
  });

  // =========================================================================
  console.log('\nverifyAnswerKey (fake model):\n');
  // =========================================================================

  interface FakeSpec {
    solve?: Record<string, unknown> | string | Error;
    judge?: Record<string, unknown> | string | Error;
  }
  function fakeLlm(spec: FakeSpec): { llm: KeyVerifyLlm; requests: KeyVerifyLlmRequest[] } {
    const requests: KeyVerifyLlmRequest[] = [];
    const llm: KeyVerifyLlm = async (req) => {
      requests.push(req);
      const r = req.kind === 'solve' ? spec.solve : spec.judge;
      if (r === undefined) throw new Error(`unexpected ${req.kind} call`);
      if (r instanceof Error) throw r;
      return { text: typeof r === 'string' ? r : JSON.stringify(r), inputTokens: 1000, outputTokens: 200 };
    };
    return { llm, requests };
  }
  const solved = (final_answer: string, over: Record<string, unknown> = {}) => ({
    working: 'w', ill_posed: false, ill_posed_reason: '', assumptions: '', chosen_option: '', final_answer, justification: 'j', ...over,
  });

  await test('verified: numeric key, deterministic agreement, ONE call', async () => {
    const { llm, requests } = fakeLlm({ solve: solved('7') });
    const r = await verifyAnswerKey({ question: 'Solve 2x + 1 = 15.', claimedAnswer: 'x = 7', answerFormat: 'numeric' }, { llm, model: 'fake-model' });
    assert.equal(r.status, 'verified');
    assert.equal(r.solverAnswer, '7');
    assert.equal(r.model, 'fake-model');
    assert.deepEqual(r.usage, { calls: 1, inputTokens: 1000, outputTokens: 200 });
    assert.equal(requests.length, 1);
  });

  await test('the solver is BLIND: the claimed answer never appears in the solve request', async () => {
    const SECRET = 'SECRET-KEY-91357';
    const { llm, requests } = fakeLlm({ solve: solved('something else'), judge: { verdict: 'DIFFERENT', reason: 'r' } });
    await verifyAnswerKey(
      { question: 'Name the process.', claimedAnswer: SECRET, choices: undefined, answerFormat: 'free' },
      { llm, model: 'm' },
    );
    const solve = requests.find((q) => q.kind === 'solve')!;
    assert.ok(!JSON.stringify(solve).includes(SECRET), 'claimed answer leaked into the solver prompt');
    const judge = requests.find((q) => q.kind === 'judge')!;
    assert.ok(judge.user.includes(SECRET), 'the judge compares against the stored key');
  });

  await test('the solver is BLIND for multiple choice too: no correct flag, no keyed letter', async () => {
    const { llm, requests } = fakeLlm({ solve: solved('x = 4', { chosen_option: 'A' }) });
    const r = await verifyAnswerKey(
      { question: 'Solve 5x - 4 = 16.', claimedAnswer: '', choices: [{ id: 'a', text: 'x = 4', correct: true }, { id: 'b', text: 'x = 3' }] },
      { llm, model: 'm' },
    );
    assert.equal(r.status, 'verified');
    assert.ok(!JSON.stringify(requests[0]).includes('"correct"') && !/correct:\s*true/i.test(requests[0].user), 'no correct flag reaches the solver');
    assert.ok(requests[0].user.includes('A) x = 4') && requests[0].user.includes('B) x = 3'));
  });

  await test('mismatch: multiple choice, solver picks another option', async () => {
    const { llm, requests } = fakeLlm({ solve: solved('36', { chosen_option: 'D' }) });
    const r = await verifyAnswerKey({ question: 'Q', claimedAnswer: 'B', choices: ['144', '6', '24', '36'] }, { llm, model: 'm' });
    assert.equal(r.status, 'mismatch');
    assert.equal(requests.length, 1, 'no judge for multiple choice');
  });

  await test('mismatch: numeric disagreement; and two inequalities with the same first number', async () => {
    const a = await verifyAnswerKey({ question: 'Q', claimedAnswer: '12', answerFormat: 'numeric' }, { ...fakeLlm({ solve: solved('15') }), model: 'm' });
    assert.equal(a.status, 'mismatch');
    const b = await verifyAnswerKey({ question: 'Q', claimedAnswer: '-4 < x \\le 2' }, { ...fakeLlm({ solve: solved('-4 \\le x < 2') }), model: 'm' });
    assert.equal(b.status, 'mismatch');
    assert.match(b.reason, /relation/);
  });

  await test('free text: judge SAME → verified (two calls); DIFFERENT / KEY_INCOMPLETE → mismatch; CANNOT_JUDGE → unverifiable', async () => {
    const run = async (verdict: string) =>
      verifyAnswerKey(
        { question: 'Why is the sky blue?', claimedAnswer: 'Rayleigh scattering of short wavelengths', answerFormat: 'free' },
        { ...fakeLlm({ solve: solved('Shorter wavelengths scatter more (Rayleigh scattering)'), judge: { verdict, reason: 'because' } }), model: 'm' },
      );
    const same = await run('SAME');
    assert.equal(same.status, 'verified');
    assert.equal(same.usage.calls, 2);
    assert.deepEqual([same.usage.inputTokens, same.usage.outputTokens], [2000, 400]);
    assert.equal((await run('DIFFERENT')).status, 'mismatch');
    const inc = await run('KEY_INCOMPLETE');
    assert.equal(inc.status, 'mismatch');
    assert.match(inc.reason, /key incomplete/);
    assert.equal((await run('CANNOT_JUDGE')).status, 'unverifiable');
    assert.equal((await run('MAYBE')).status, 'unverifiable', 'an unknown judge verdict fails closed');
  });

  await test('ill_posed: the solver may refuse the question — no comparison, no judge', async () => {
    const { llm, requests } = fakeLlm({ solve: solved('', { ill_posed: true, ill_posed_reason: 'The figure is not included.' }) });
    const r = await verifyAnswerKey({ question: 'Use the graph to find f(2).', claimedAnswer: '5' }, { llm, model: 'm' });
    assert.equal(r.status, 'ill_posed');
    assert.equal(r.reason, 'The figure is not included.');
    assert.equal(requests.length, 1);
  });

  await test('FAIL CLOSED: network failure, non-JSON, empty answer, judge failure → unverifiable (never throws)', async () => {
    const net = await verifyAnswerKey({ question: 'Q', claimedAnswer: '5' }, { ...fakeLlm({ solve: new Error('ECONNRESET') }), model: 'm' });
    assert.equal(net.status, 'unverifiable');
    assert.match(net.reason, /solve failed: ECONNRESET/);
    const junk = await verifyAnswerKey({ question: 'Q', claimedAnswer: '5' }, { ...fakeLlm({ solve: 'I think the answer is five.' }), model: 'm' });
    assert.equal(junk.status, 'unverifiable');
    const empty = await verifyAnswerKey({ question: 'Q', claimedAnswer: '5' }, { ...fakeLlm({ solve: solved('') }), model: 'm' });
    assert.equal(empty.status, 'unverifiable');
    const judgeDown = await verifyAnswerKey(
      { question: 'Q', claimedAnswer: 'an explanation' },
      { ...fakeLlm({ solve: solved('another explanation'), judge: new Error('529 overloaded') }), model: 'm' },
    );
    assert.equal(judgeDown.status, 'unverifiable');
    assert.equal(judgeDown.usage.calls, 1, 'the solve was still counted');
    const throwing: KeyVerifyLlm = () => { throw new Error('sync boom'); };
    assert.equal((await verifyAnswerKey({ question: 'Q', claimedAnswer: '5' }, { llm: throwing, model: 'm' })).status, 'unverifiable');
  });

  await test('a failed call is retried ONCE: fail-then-succeed verifies; an aborted budget is never retried', async () => {
    let n = 0;
    const flaky: KeyVerifyLlm = async () => {
      n++;
      if (n === 1) throw new Error('model declined the request');
      return { text: JSON.stringify(solved('5')), inputTokens: 10, outputTokens: 5 };
    };
    const r = await verifyAnswerKey({ question: 'Q', claimedAnswer: '5' }, { llm: flaky, model: 'm' });
    assert.deepEqual([r.status, n, r.usage.calls], ['verified', 2, 1]);

    let always = 0;
    const down: KeyVerifyLlm = async () => { always++; throw new Error('503'); };
    assert.equal((await verifyAnswerKey({ question: 'Q', claimedAnswer: '5' }, { llm: down, model: 'm' })).status, 'unverifiable');
    assert.equal(always, 2, 'exactly one retry');

    const ac = new AbortController();
    ac.abort();
    let aborted = 0;
    const abortedLlm: KeyVerifyLlm = async () => { aborted++; throw new Error('aborted'); };
    assert.equal((await verifyAnswerKey({ question: 'Q', claimedAnswer: '5' }, { llm: abortedLlm, model: 'm', signal: ac.signal })).status, 'unverifiable');
    assert.equal(aborted, 1, 'no retry once the budget aborted the call');
  });

  await test('no stored key / no question → unverifiable WITHOUT a model call', async () => {
    const { llm, requests } = fakeLlm({});
    assert.equal((await verifyAnswerKey({ question: 'Q', claimedAnswer: '   ' }, { llm, model: 'm' })).status, 'unverifiable');
    assert.equal((await verifyAnswerKey({ question: ' ', claimedAnswer: '5' }, { llm, model: 'm' })).status, 'unverifiable');
    assert.equal(requests.length, 0);
  });

  await test('fenced JSON replies are read', async () => {
    const r = await verifyAnswerKey({ question: 'Q', claimedAnswer: '5' }, { ...fakeLlm({ solve: '```json\n' + JSON.stringify(solved('5')) + '\n```' }), model: 'm' });
    assert.equal(r.status, 'verified');
  });

  // =========================================================================
  console.log('\nplan generation with a fake verifier (verifyPlanKeys):\n');
  // =========================================================================

  const PLAN_ID = 'gen-00000000-test-4000-8000-keyverify0001';

  /** A plan assembled exactly as the generation routes assemble one: Stage-2
   *  shaped segments, plan-scoped LO ids, parseLessonPlan. */
  function generatedPlan(): LessonPlan {
    const los = [
      { id: 'lo-1', description: 'Solve one-step equations' },
      { id: 'lo-2', description: 'Solve two-step equations' },
      { id: 'lo-3', description: 'Solve inequalities' },
      { id: 'lo-4', description: 'Explain inverse operations' },
    ];
    const stage2: unknown[] = los.flatMap((lo, i) => [
      { id: `${lo.id}-hook`, kind: 'hook', goal: `Hook ${i + 1}` },
      { id: `${lo.id}-concept`, kind: 'concept', goal: `Concept ${i + 1}`, keyIdeas: ['idea'] },
      { id: `${lo.id}-worked`, kind: 'worked_example', problem: `Worked ${i + 1}`, steps: ['step'], answer: 'a' },
      { id: `${lo.id}-try`, kind: 'try_yourself', problem: `Try problem ${i + 1}: find the value.`, expectedAnswer: `key-${i + 1}` },
    ]);
    const ns = namespaceGeneratedLos({ planId: PLAN_ID, los, segments: stage2 as Segment[] });
    return parseLessonPlan({
      id: PLAN_ID,
      title: 'Equations',
      curriculum: 'freestyle',
      grade: '8',
      subject: 'math',
      locale: 'en',
      los: ns.los,
      estimatedMinutes: 30,
      segments: [{ id: 'intro', kind: 'hook', goal: 'Intro' }, ...ns.segments, buildRecapSegment(ns.los)],
      prerequisites: [],
      followUps: [],
      schemaVersion: LESSON_PLAN_SCHEMA_VERSION,
      metadata: { generatedFromText: true, generatorOk: true },
    });
  }
  const tryId = (n: number) => `${PLAN_ID}.lo-${n}-try`;
  const segOf = (plan: LessonPlan, id: string) => plan.segments.find((s) => s.id === id)! as Segment & { keyCheck?: KeyCheck; expectedAnswer?: string };

  /** key-1 verified · key-2 mismatch · key-3 ill_posed · key-4 unverifiable */
  const STATUS_BY_KEY: Record<string, 'verified' | 'mismatch' | 'ill_posed' | 'unverifiable'> = {
    'key-1': 'verified', 'key-2': 'mismatch', 'key-3': 'ill_posed', 'key-4': 'unverifiable',
  };
  const fakeVerify = (delayMs = 0, seen?: string[]): PlanKeyVerifyFn => async (input) => {
    seen?.push(input.claimedAnswer);
    if (delayMs) await sleep(delayMs);
    return {
      status: STATUS_BY_KEY[input.claimedAnswer] ?? 'verified',
      reason: `fake ${input.claimedAnswer}`,
      model: 'fake-verify-model',
      usage: { calls: 1, inputTokens: 1000, outputTokens: 200 },
    };
  };
  const FIXED_NOW = () => new Date('2026-10-04T12:00:00.000Z');
  const quiet = { log: () => undefined, now: FIXED_NOW };

  await test('statuses are recorded ON the segments: { status, checkedAt, model }', async () => {
    const plan = generatedPlan();
    const seen: string[] = [];
    const out = await verifyPlanKeys(plan, { label: 'test', inlineBudgetMs: 5000, verify: fakeVerify(0, seen), ...quiet });
    assert.deepEqual(seen.sort(), ['key-1', 'key-2', 'key-3', 'key-4'], 'every try-yourself with an expectedAnswer is checked');
    assert.equal(out.finish, null, 'everything settled inline');
    assert.deepEqual(segOf(out.plan, tryId(1)).keyCheck, { status: 'verified', checkedAt: '2026-10-04T12:00:00.000Z', model: 'fake-verify-model', reason: 'fake key-1' });
    assert.equal(segOf(out.plan, tryId(2)).keyCheck?.status, 'mismatch');
    assert.equal(segOf(out.plan, tryId(3)).keyCheck?.status, 'ill_posed');
    assert.equal(segOf(out.plan, tryId(4)).keyCheck?.status, 'unverifiable');
    // The question and the stored key stay on the STORED segment; readers strip.
    assert.equal(segOf(out.plan, tryId(2)).expectedAnswer, 'key-2');
    // Nothing else is touched: non-try segments are the same objects, in order.
    assert.deepEqual(out.plan.segments.map((s) => s.id), plan.segments.map((s) => s.id));
    for (const s of plan.segments.filter((x) => x.kind !== 'try_yourself')) assert.equal(out.plan.segments.find((x) => x.id === s.id), s);
    assert.equal(segOf(plan, tryId(1)).keyCheck, undefined, 'the input plan is not mutated');
    // Round-trips through the plan schema (upsertLessonPlan re-parses).
    assert.deepEqual(segOf(parseLessonPlan(out.plan), tryId(2)).keyCheck, segOf(out.plan, tryId(2)).keyCheck);
  });

  await test('one summary line per plan: counts by status and tokens used', async () => {
    const lines: string[] = [];
    const out = await verifyPlanKeys(generatedPlan(), { label: 'plan-generate', inlineBudgetMs: 5000, verify: fakeVerify(), log: (l) => lines.push(l), now: FIXED_NOW });
    assert.equal(lines.length, 1);
    assert.match(lines[0], new RegExp(`^\\[key-verify\\] plan=${PLAN_ID} path=plan-generate tryYourselves=4 verified=1 mismatch=1 ill_posed=1 unverifiable=1 `));
    assert.match(lines[0], /calls=4 inputTokens=4000 outputTokens=800 model=fake-verify-model/);
    assert.equal(lines[0], formatKeyVerifySummary(out.summary!));
  });

  await test('a segment with no expectedAnswer, and non-try segments, are not checked', async () => {
    const base = generatedPlan();
    const plan: LessonPlan = {
      ...base,
      segments: base.segments.map((s) => (s.id === tryId(2) ? ({ ...s, expectedAnswer: undefined } as Segment) : s)),
    };
    const seen: string[] = [];
    const out = await verifyPlanKeys(plan, { label: 'test', inlineBudgetMs: 5000, verify: fakeVerify(0, seen), ...quiet });
    assert.deepEqual(seen.sort(), ['key-1', 'key-3', 'key-4']);
    assert.equal(segOf(out.plan, tryId(2)).keyCheck, undefined);
    assert.equal(out.summary!.tryYourselves, 3);
  });

  await test('a verifier that throws is an unverifiable segment, not a failed plan', async () => {
    const boom: PlanKeyVerifyFn = async () => { throw new Error('boom'); };
    const out = await verifyPlanKeys(generatedPlan(), { label: 'test', inlineBudgetMs: 5000, verify: boom, ...quiet });
    for (const n of [1, 2, 3, 4]) assert.equal(segOf(out.plan, tryId(n)).keyCheck?.status, 'unverifiable');
    assert.match(segOf(out.plan, tryId(1)).keyCheck!.reason!, /verifier error: boom/);
  });

  await test('concurrency cap: never more than `concurrency` checks in flight', async () => {
    let inFlight = 0;
    let peak = 0;
    const verify: PlanKeyVerifyFn = async () => {
      inFlight++;
      peak = Math.max(peak, inFlight);
      await sleep(15);
      inFlight--;
      return { status: 'verified', reason: 'ok' };
    };
    await verifyPlanKeys(generatedPlan(), { label: 'test', inlineBudgetMs: 5000, concurrency: 2, verify, ...quiet });
    assert.equal(peak, 2);
  });

  await test('TIME BUDGET: checks unfinished at the total budget become unverifiable (budget_exceeded)', async () => {
    const verify: PlanKeyVerifyFn = async (input) => {
      await sleep(input.claimedAnswer === 'key-1' ? 5 : 400);
      return { status: 'verified', reason: 'ok', model: 'fake-verify-model' };
    };
    const t0 = Date.now();
    const out = await verifyPlanKeys(generatedPlan(), { label: 'test', inlineBudgetMs: 60, totalBudgetMs: 60, verify, ...quiet });
    assert.ok(Date.now() - t0 < 350, `returned at the budget, not after the slow checks (${Date.now() - t0} ms)`);
    assert.equal(segOf(out.plan, tryId(1)).keyCheck?.status, 'verified', 'the fast check landed');
    for (const n of [2, 3, 4]) {
      assert.deepEqual(
        [segOf(out.plan, tryId(n)).keyCheck?.status, segOf(out.plan, tryId(n)).keyCheck?.reason],
        ['unverifiable', 'budget_exceeded'],
      );
    }
    assert.equal(out.finish, null, 'nothing left running after the total budget');
    assert.equal(out.summary!.budgetExceeded, 3);
  });

  await test('BACKGROUND (session-start paths): returned plan has NO trusted key; late results are written to the stored plan', async () => {
    const lines: string[] = [];
    const persisted: Array<{ planId: string; target: KeyCheckTarget; keyCheck: KeyCheck }> = [];
    const out = await verifyPlanKeys(generatedPlan(), {
      label: 'plan-generate',
      inlineBudgetMs: 0,
      verify: fakeVerify(20),
      persist: async (planId, target, keyCheck) => { persisted.push({ planId, target, keyCheck }); return true; },
      log: (l) => lines.push(l),
      now: FIXED_NOW,
    });
    // At return: every checked key is untrusted, and nothing was awaited.
    for (const n of [1, 2, 3, 4]) {
      const seg = segOf(out.plan, tryId(n));
      assert.deepEqual([seg.keyCheck?.status, seg.keyCheck?.reason], ['unverifiable', 'pending']);
      assert.equal(keyCheckUntrusted(seg), true);
      assert.equal(getSegmentTruth(seg, PLAN_ID)?.expectedAnswer, undefined);
    }
    assert.equal(out.summary!.pending, 4);
    assert.equal(lines.length, 0, 'the one summary line is printed when the plan settles');
    assert.equal(persisted.length, 0);
    assert.ok(out.finish, 'finish() is offered');

    const final = await out.finish!();
    assert.deepEqual(persisted.map((p) => p.keyCheck.status).sort(), ['ill_posed', 'mismatch', 'unverifiable', 'verified']);
    const v = persisted.find((p) => p.keyCheck.status === 'verified')!;
    assert.equal(v.planId, PLAN_ID);
    assert.deepEqual(v.target, { segmentId: tryId(1), problem: 'Try problem 1: find the value.', expectedAnswer: 'key-1' }, 'matched on id + problem + key');
    assert.deepEqual([final.verified, final.mismatch, final.ill_posed, final.unverifiable, final.pending, final.stored], [1, 1, 1, 1, 0, 4]);
    assert.equal(lines.length, 1);
    assert.match(lines[0], /storedLate=4 calls=4 inputTokens=4000 outputTokens=800/);
    assert.equal(await out.finish!(), final, 'finish() is idempotent');
    assert.equal(persisted.length, 4);
  });

  await test('BACKGROUND: a persist failure never rejects — the stored segment just stays untrusted', async () => {
    const out = await verifyPlanKeys(generatedPlan(), {
      label: 'test', inlineBudgetMs: 0, verify: fakeVerify(5), ...quiet,
      persist: async () => { throw new Error('mongo down'); },
    });
    const origWarn = console.warn;
    console.warn = () => undefined;
    try {
      const final = await out.finish!();
      assert.equal(final.stored, 0);
    } finally {
      console.warn = origWarn;
    }
  });

  await test('inline budget shorter than the checks: finished ones recorded, the rest pending → completed by finish()', async () => {
    const verify: PlanKeyVerifyFn = async (input) => {
      await sleep(input.claimedAnswer === 'key-1' ? 5 : 120);
      return { status: 'verified', reason: 'ok', model: 'fake-verify-model' };
    };
    const persisted: string[] = [];
    const out = await verifyPlanKeys(generatedPlan(), {
      label: 'test', inlineBudgetMs: 40, totalBudgetMs: 5000, verify, ...quiet,
      persist: async (_p, target, kc) => { persisted.push(`${target.segmentId}=${kc.status}`); return true; },
    });
    assert.equal(segOf(out.plan, tryId(1)).keyCheck?.status, 'verified');
    assert.equal(segOf(out.plan, tryId(2)).keyCheck?.reason, 'pending');
    await out.finish!();
    assert.deepEqual(persisted.sort(), [2, 3, 4].map((n) => `${tryId(n)}=verified`), 'only the late ones are written');
  });

  await test('ill_posed is DROPPED only when its LO has another sound try-yourself (review plans: -try / -try2)', async () => {
    const REV = 'rev-00000000-test';
    const review = parseLessonPlan({
      id: REV, title: 'Review', curriculum: 'review', grade: 'general', subject: 'math', locale: 'en',
      los: [{ id: 'alg.a', description: 'A' }, { id: 'alg.b', description: 'B' }, { id: 'alg.c', description: 'C' }],
      estimatedMinutes: 20,
      segments: [
        { id: 'alg.a-recall', kind: 'concept', goal: 'g', keyIdeas: ['k'] },
        { id: 'alg.a-try', kind: 'try_yourself', problem: 'A try', expectedAnswer: 'key-3' }, // ill-posed, has -try2
        { id: 'alg.a-try2', kind: 'try_yourself', problem: 'A try2', expectedAnswer: 'key-1' },
        { id: 'alg.b-try', kind: 'try_yourself', problem: 'B try', expectedAnswer: 'key-3' }, // ill-posed, ONLY try for its LO
        { id: 'alg.c-try', kind: 'try_yourself', problem: 'C try', expectedAnswer: 'key-3' }, // ill-posed …
        { id: 'alg.c-try2', kind: 'try_yourself', problem: 'C try2', expectedAnswer: 'key-3' }, // … and so is its sibling
        { id: 'recap', kind: 'recap', mustRemember: ['A', 'B', 'C'] },
      ],
      prerequisites: [], schemaVersion: LESSON_PLAN_SCHEMA_VERSION, metadata: { reviewPlan: true },
    });
    const out = await verifyPlanKeys(review, { label: 'review-plan', inlineBudgetMs: 5000, dropIllPosed: true, verify: fakeVerify(), ...quiet });
    const ids = out.plan.segments.map((s) => s.id);
    assert.ok(!ids.includes('alg.a-try'), 'dropped: alg.a still has a sound try2');
    assert.ok(ids.includes('alg.a-try2'));
    assert.ok(ids.includes('alg.b-try'), 'kept: the only try-yourself of its LO');
    assert.equal(segOf(out.plan, 'alg.b-try').keyCheck?.status, 'ill_posed');
    assert.ok(ids.includes('alg.c-try') && ids.includes('alg.c-try2'), 'kept: no sound sibling');
    assert.equal(out.summary!.dropped, 1);
    // Without the option nothing is dropped.
    const kept = await verifyPlanKeys(review, { label: 'review-plan', inlineBudgetMs: 5000, verify: fakeVerify(), ...quiet });
    assert.equal(kept.plan.segments.length, review.segments.length);
  });

  await test("FLAG OFF (TUTOR_KEY_VERIFY_AT_CREATION=off): today's behaviour — same plan object, no verifier call, no log", async () => {
    process.env.TUTOR_KEY_VERIFY_AT_CREATION = 'off';
    assert.equal(keyVerifyEnabled(), false);
    const plan = generatedPlan();
    let calls = 0;
    const lines: string[] = [];
    const out = await verifyPlanKeys(plan, {
      label: 'test', inlineBudgetMs: 5000, log: (l) => lines.push(l),
      verify: async () => { calls++; return { status: 'mismatch', reason: 'x' }; },
    });
    assert.equal(out.plan, plan, 'the SAME object');
    assert.deepEqual([out.summary, out.finish, calls, lines.length], [null, null, 0, 0]);
    assert.equal(JSON.stringify(out.plan), JSON.stringify(generatedPlan()), 'byte-identical to a plan generated without the check');
  });

  await test('flag default is ON; only the literal "off" disables', () => {
    delete process.env.TUTOR_KEY_VERIFY_AT_CREATION;
    assert.equal(keyVerifyEnabled(), true);
    process.env.TUTOR_KEY_VERIFY_AT_CREATION = 'false';
    assert.equal(keyVerifyEnabled(), true);
    process.env.TUTOR_KEY_VERIFY_AT_CREATION = 'off';
    assert.equal(keyVerifyEnabled(), false);
  });

  await test('a picker / fallback / homework plan (no try-yourself) passes through untouched', async () => {
    const plan = parseLessonPlan({
      id: 'gen-picker', title: 'P', curriculum: 'freestyle', grade: '8', subject: 'math', estimatedMinutes: 20,
      los: [{ id: 'gen-picker.lo-1', description: 'd' }],
      segments: [{ id: 'intro', kind: 'hook', goal: 'g' }, { id: 'pick-los', kind: 'concept', goal: 'g', keyIdeas: ['k'] }],
      schemaVersion: LESSON_PLAN_SCHEMA_VERSION,
    });
    const out = await verifyPlanKeys(plan, { label: 'test', inlineBudgetMs: 5000, verify: fakeVerify(), ...quiet });
    assert.equal(out.plan, plan);
    assert.equal(out.summary, null);
  });

  // =========================================================================
  console.log('\nan unverified key is treated like a withdrawn one:\n');
  // =========================================================================

  const checked = (await verifyPlanKeys(generatedPlan(), { label: 'test', inlineBudgetMs: 5000, verify: fakeVerify(), ...quiet })).plan;
  // Authored-style fields a stored key travels with, to prove they all go.
  const rich = (n: number): Segment => ({
    ...(segOf(checked, tryId(n)) as Segment),
    hints: ['hint that gives it away'],
    modelResponse: 'full-credit response',
    responseFormat: 'mcq',
    choices: [{ id: 'a', text: 'one', correct: true }, { id: 'b', text: 'two' }],
  } as Segment);

  await test('effectiveSegment: mismatch / ill_posed / unverifiable → question kept, key + hints + rubric + correct flags stripped', () => {
    for (const n of [2, 3, 4]) {
      const raw = rich(n);
      const eff = effectiveSegment(PLAN_ID, raw) as unknown as Record<string, unknown>;
      assert.notEqual(eff, raw);
      assert.equal(eff.problem, `Try problem ${n}: find the value.`);
      for (const k of ['expectedAnswer', 'hints', 'modelResponse', 'rubric']) assert.ok(!(k in eff), `${k} must be stripped (status ${n})`);
      assert.deepEqual(eff.choices, [{ id: 'a', text: 'one' }, { id: 'b', text: 'two' }]);
      assert.equal(eff.keyWithdrawn, true);
      assert.deepEqual(effectiveSegment(PLAN_ID, eff), eff, 'idempotent');
      // Independent of the plan id (the check travels on the segment).
      assert.equal((effectiveSegment(undefined, raw) as unknown as Record<string, unknown>).keyWithdrawn, true);
    }
  });

  await test('effectiveSegment: a VERIFIED segment and a LEGACY segment (no keyCheck) are the same object, key intact', () => {
    const verified = rich(1);
    assert.equal(effectiveSegment(PLAN_ID, verified), verified);
    assert.equal(getSegmentTruth(verified, PLAN_ID)?.expectedAnswer, 'key-1');
    const legacy = segOf(generatedPlan(), tryId(2));
    assert.equal(legacy.keyCheck, undefined);
    assert.equal(effectiveSegment(PLAN_ID, legacy), legacy);
    assert.deepEqual(getSegmentTruth(legacy, PLAN_ID), { problemText: 'Try problem 2: find the value.', expectedAnswer: 'key-2', kind: 'try_yourself' });
    // Mongo turns an absent optional into a literal null → still "no check".
    const nulled = { ...legacy, keyCheck: null } as unknown as Segment;
    assert.equal(keyCheckUntrusted(nulled), false);
    assert.equal(effectiveSegment(PLAN_ID, nulled), nulled);
    assert.equal(segmentKeyUntrusted(PLAN_ID, legacy), false);
  });

  await test('a keyCheck with an unknown status is NOT trusted (fails closed), also after a parse round-trip', () => {
    const odd = { ...segOf(generatedPlan(), tryId(1)), keyCheck: { status: 'checked-ok-v2', checkedAt: 'x', model: 'm' } } as unknown as Segment;
    assert.equal(keyCheckUntrusted(odd), true);
    const reparsed = parseLessonPlan({ ...generatedPlan(), segments: [odd, buildRecapSegment([])] });
    assert.equal((reparsed.segments[0] as { keyCheck?: KeyCheck }).keyCheck?.status, 'unverifiable');
  });

  await test('session prompt blocks: no stored answer, the neutral "no verified answer" line instead', () => {
    const raw = rich(2);
    const truth = getSegmentTruth(raw, PLAN_ID)!;
    assert.deepEqual(truth, { problemText: 'Try problem 2: find the value.', expectedAnswer: undefined, kind: 'try_yourself', keyWithdrawn: true });
    const block = formatSegmentTruth(raw, PLAN_ID);
    assert.ok(!block.includes('key-2') && !/^expectedAnswer:/m.test(block), block);
    assert.ok(block.includes(`answerKey: none. ${NO_VERIFIED_ANSWER_LINE}`));

    const plan: LessonPlan = { ...checked, segments: checked.segments.map((s) => (s.id === tryId(2) ? raw : s)) };
    const ctx = buildLessonPlanContext(plan, tryId(2))!;
    assert.equal((ctx.currentSegment as { expectedAnswer?: string }).expectedAnswer, undefined);
    const ctxBlock = formatLessonPlanContext(ctx);
    for (const leak of ['key-2', 'hint that gives it away', 'full-credit response', '"correct"', 'keyCheck', 'fake key-2']) {
      assert.ok(!ctxBlock.includes(leak), `leaked ${leak}`);
    }
    assert.ok(ctxBlock.includes('Try problem 2: find the value.'));
    // Even if a caller passes the RAW segment as the context's current segment.
    const rawCtxBlock = formatLessonPlanContext({ ...ctx, currentSegment: raw });
    assert.ok(!rawCtxBlock.includes('key-2') && !rawCtxBlock.includes('keyCheck'));

    const rt = formatLessonPlanForRealtime(plan, tryId(2), [])!;
    assert.ok(!rt.includes('key-2') && !rt.includes('Expected answer'), rt);
    assert.ok(rt.includes(NO_VERIFIED_ANSWER_LINE));
  });

  await test('session prompt blocks: a VERIFIED segment prints exactly what the same segment printed before the check existed', () => {
    const before = generatedPlan();
    const after = checked;
    assert.equal(formatSegmentTruth(segOf(after, tryId(1)), PLAN_ID), formatSegmentTruth(segOf(before, tryId(1)), PLAN_ID));
    assert.equal(
      formatLessonPlanContext(buildLessonPlanContext(after, tryId(1))!),
      formatLessonPlanContext(buildLessonPlanContext(before, tryId(1))!),
      'keyCheck is bookkeeping, never prompt content',
    );
    assert.equal(formatLessonPlanForRealtime(after, tryId(1), []), formatLessonPlanForRealtime(before, tryId(1), []));
  });

  await test('generator fallback + anchor: an unverified-key try-yourself is never re-served, and its answer never seeds generation', () => {
    const origLog = console.log;
    console.log = () => undefined;
    try {
      const single = (n: number): LessonPlan => ({ ...checked, segments: checked.segments.filter((s) => s.kind !== 'try_yourself' || s.id === tryId(n)) });
      assert.equal(planAuthoredFallback(single(2), 'Try problem: find the value.', []), null, 'mismatch');
      assert.equal(planAuthoredFallback(single(3), 'Try problem: find the value.', []), null, 'ill_posed');
      assert.equal(planAuthoredFallback(single(4), 'Try problem: find the value.', []), null, 'unverifiable');
      assert.equal(planAuthoredFallback(single(1), 'Try problem: find the value.', [])?.expectedAnswer, 'key-1', 'verified is served');
      const legacyPlan = generatedPlan();
      const legacySingle: LessonPlan = { ...legacyPlan, segments: legacyPlan.segments.filter((x) => x.kind !== 'try_yourself' || x.id === tryId(2)) };
      assert.equal(planAuthoredFallback(legacySingle, 'Try problem: find the value.', [])?.expectedAnswer, 'key-2', 'legacy (no keyCheck) unchanged');

      const dropped = effectiveAnchor(checked, { statement: 'Try problem 2:   find the value.', expectedAnswer: 'key-2' });
      assert.ok(!('expectedAnswer' in dropped));
      const kept = effectiveAnchor(checked, { statement: 'Try problem 1: find the value.', expectedAnswer: 'key-1' });
      assert.equal(kept.expectedAnswer, 'key-1');
      const legacyAnchor = { statement: 'Try problem 2: find the value.', expectedAnswer: 'key-2' };
      assert.equal(effectiveAnchor(generatedPlan(), legacyAnchor), legacyAnchor);
    } finally {
      console.log = origLog;
    }
  });

  function sourcesOf(plans: PlanLite[]): PracticeSources {
    return {
      caller: undefined,
      async plansForLoId(loId) { return plans.filter((p) => p.los.some((l) => l.id === loId)); },
      async plansForTopic(topicId) { return plans.filter((p) => p.topic === topicId); },
      async bankForLoId() { return []; },
      async bankForTopic() { return []; },
    } as PracticeSources;
  }
  const practiceIds = async (plan: LessonPlan, n: number): Promise<string[]> => {
    const origLog = console.log;
    console.log = () => undefined;
    try {
      const r = await retrievePractice(
        { studentId: 's1', courseId: 'c1', scope: { loId: `${PLAN_ID}.lo-${n}` }, count: 10 },
        sourcesOf([toPlanLite(plan)]),
      );
      return r.items.map((i) => i.id);
    } finally {
      console.log = origLog;
    }
  };

  await test('practice retrieval (planToItems): only a VERIFIED key is served; mismatch / ill_posed / unverifiable are not', async () => {
    delete process.env.PRACTICE_GEN; // no generate-on-exhaustion in this test
    assert.deepEqual(await practiceIds(checked, 1), [`${PLAN_ID}::${tryId(1)}`]);
    assert.deepEqual(await practiceIds(checked, 2), [], 'mismatch');
    assert.deepEqual(await practiceIds(checked, 3), [], 'ill_posed');
    assert.deepEqual(await practiceIds(checked, 4), [], 'unverifiable');
  });

  await test('practice retrieval: a plan still PENDING its background check serves nothing; a legacy plan serves as before', async () => {
    const pending = (await verifyPlanKeys(generatedPlan(), { label: 'test', inlineBudgetMs: 0, verify: fakeVerify(5), persist: async () => true, ...quiet }));
    for (const n of [1, 2, 3, 4]) assert.deepEqual(await practiceIds(pending.plan, n), [], `lo-${n} while pending`);
    await pending.finish!();
    const legacy = generatedPlan();
    for (const n of [1, 2, 3, 4]) assert.deepEqual(await practiceIds(legacy, n), [`${PLAN_ID}::${tryId(n)}`], `legacy lo-${n}`);
    // …including a legacy plan read back from Mongo with `keyCheck: null`.
    const nulled: LessonPlan = { ...legacy, segments: legacy.segments.map((s) => (s.kind === 'try_yourself' ? ({ ...s, keyCheck: null } as unknown as Segment) : s)) };
    assert.deepEqual(await practiceIds(nulled, 2), [`${PLAN_ID}::${tryId(2)}`]);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

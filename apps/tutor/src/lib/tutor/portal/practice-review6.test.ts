/**
 * Review round 6 (2026-10-05) — practice generation: latency, deadline and
 * background completion, reservations, the empty-draw reason, and the gates
 * that rejected good items or stored a wrong key.
 *
 * No network, no database: model clients and Mongo are stubbed.
 *
 * Run: npm run test:practice-review6
 */
import { strict as assert } from 'node:assert';
import {
  generatePracticeItems,
  generatePracticeItemsDetailed,
  practiceGenSources,
  checkGeneratedAnswer,
  normalizeNumericAnswer,
  normalizedKeyAgrees,
  isPlainUnit,
  numericKeyPrecisionOk,
  statedPrecision,
  numericHasSecondPart,
  dollarMathDelimiters,
  PRACTICE_DRAW_DEADLINE_MS,
  type PracticeGenSources,
  type GeneratePracticeItemsOptions,
  type VerifyFn,
} from './practice-gen';
import {
  callTextModel,
  generateCandidate,
  verifyClaimedAnswer,
  brainGenWithinBudget,
  generateProblem,
  GEN_MAX_TOKENS,
  GEN_MAX_TOKENS_THINKING,
  generatorThinkingOn,
  VERIFY_MAX_TOKENS,
  RETRY_MAX_TOKENS,
  GEN_CALL_TIMEOUT_MS,
  LIVE_BRAINGEN_BUDGET_MS,
  type GenPayload,
  type TextCallClient,
  type GenerateProblemInput,
} from '../voice/problem-generator';
import { nearDuplicateReason, mathTokens } from './practice-similarity';
import { retrievePractice, practiceEmptyReason, type PracticeSources, type PlanLite } from './practice';
import { ProblemBank } from '@/models/ProblemBank';
import { PracticeGenCounter } from '@/models/PracticeGenCounter';
import * as dbModule from '@core/db';

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
  }
}
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const quiet = async <T>(fn: () => Promise<T>): Promise<T> => {
  const warn = console.warn; const log = console.log;
  console.warn = () => {}; console.log = () => {};
  try { return await fn(); } finally { console.warn = warn; console.log = log; }
};

const unhandled: unknown[] = [];
process.on('unhandledRejection', (reason) => { unhandled.push(reason); });

// No database anywhere in this file.
(dbModule as unknown as { default: () => Promise<void> }).default = async () => {};
(dbModule as unknown as { connectDB: () => Promise<void> }).connectDB = async () => { throw new Error('no database in tests'); };

(async () => {
// ════════════════════════════════════════════════════════════════════════
// 1. LATENCY
// ════════════════════════════════════════════════════════════════════════
console.log('\n1. latency\n');

type Body = { model: string; max_tokens: number; thinking?: { type: string } };
type Opts = { signal?: AbortSignal; timeout?: number; maxRetries?: number } | undefined;
interface Reply { text?: string; stop?: string; delayMs?: number; error?: unknown }
function fakeClient(script: (body: Body, call: number) => Reply, honourAbort = true) {
  const bodies: Body[] = [];
  const options: Opts[] = [];
  const client: TextCallClient = {
    messages: {
      async create(body, opts) {
        const call = bodies.length;
        bodies.push(body as Body);
        options.push(opts);
        const r = script(body as Body, call);
        if (r.delayMs) {
          await new Promise<void>((resolve, reject) => {
            const t = setTimeout(resolve, r.delayMs);
            if (honourAbort && opts?.signal) {
              opts.signal.addEventListener('abort', () => { clearTimeout(t); reject(new Error('Request was aborted.')); });
            }
          });
        }
        if (r.error) throw r.error;
        return { stop_reason: r.stop ?? 'end_turn', content: r.text === undefined ? [{ type: 'thinking' }] : [{ type: 'text', text: r.text }] };
      },
    },
  };
  return { client, bodies, options };
}
const GEN_JSON = (q = 'What is 6 × 7?', a = '42') => JSON.stringify({ problemText: q, finalAnswer: a, teachingAnswer: '6 × 7 = 42', responseFormat: 'numeric', hints: ['multiply'] });
const isGenCall = (b: Body) => b.thinking?.type === 'disabled';

await test('generator: thinking is switched OFF, the cap is sized for the reply, the call has a hard timeout', async () => {
  const f = fakeClient(() => ({ text: GEN_JSON() }));
  const out = await generateCandidate('write one', [], { client: f.client });
  assert.equal(out?.gen.finalAnswer, '42');
  assert.equal(f.bodies.length, 1);
  assert.deepEqual(f.bodies[0].thinking, { type: 'disabled' });
  assert.equal(f.bodies[0].max_tokens, GEN_MAX_TOKENS);
  assert.ok(GEN_MAX_TOKENS <= 3000, 'no thinking budget in the generator cap');
  assert.equal(f.options[0]?.timeout, GEN_CALL_TIMEOUT_MS);
  assert.equal(f.options[0]?.maxRetries, 1);
});
await test('generator: with thinking off the reply WORKS BEFORE IT ANSWERS — "working" precedes "finalAnswer" in the format, and is ignored by the parser', async () => {
  // Measured without it: finalAnswer "54", then a worked solution that computed 42 (4 of 4 Riemann-sum candidates rejected).
  const f = fakeClient(() => ({ text: JSON.stringify({ problemText: 'Right Riemann sum of x^2 + 3 on [0, 4], n = 4?', working: '4 + 7 + 12 + 19 = 42', finalAnswer: '42', teachingAnswer: 'Sum the four right-endpoint values: 42.', responseFormat: 'numeric', hints: ['width 1'] }) }));
  const out = await generateCandidate('write one', [], { client: f.client });
  const system = (f.bodies[0] as unknown as { system: string }).system;
  const at = (field: string) => system.indexOf(`"${field}"`);
  assert.ok(at('problemText') >= 0 && at('working') > at('problemText'), 'the format names "working"');
  assert.ok(at('working') < at('finalAnswer') && at('finalAnswer') < at('teachingAnswer'), '"working" comes before "finalAnswer"');
  assert.equal(out?.gen.finalAnswer, '42');
  assert.equal(out?.gen.teachingAnswer, 'Sum the four right-endpoint values: 42.');
  assert.equal('working' in (out?.gen ?? {}), false, 'scratch work is never part of the item');
});
await test('generator: a reply cut off at the cap is NOT re-asked at 12000 (it was: 44.6 s + 38.5 s for one slot)', async () => {
  const f = fakeClient(() => ({ text: '{"problemText": "cut', stop: 'max_tokens' }));
  assert.equal(await quiet(() => generateCandidate('write one', [], { client: f.client })), null);
  assert.deepEqual(f.bodies.map((b) => b.max_tokens), [GEN_MAX_TOKENS]);
});
await test('generator: TUTOR_BRAINGEN_THINKING=on (the owner\'s switch) restores a thinking generator; anything else is the fast default', async () => {
  assert.equal(generatorThinkingOn({}), false);
  assert.equal(generatorThinkingOn({ TUTOR_BRAINGEN_THINKING: 'off' }), false);
  assert.equal(generatorThinkingOn({ TUTOR_BRAINGEN_THINKING: 'true' }), false);
  assert.equal(generatorThinkingOn({ TUTOR_BRAINGEN_THINKING: 'on' }), true);
  process.env.TUTOR_BRAINGEN_THINKING = 'on';
  try {
    const f = fakeClient(() => ({ text: GEN_JSON() }));
    await generateCandidate('write one', [], { client: f.client });
    assert.equal(f.bodies[0].thinking, undefined, 'no thinking parameter: the model default');
    assert.equal(f.bodies[0].max_tokens, GEN_MAX_TOKENS_THINKING);
    assert.equal(f.options[0]?.timeout, GEN_CALL_TIMEOUT_MS, 'the hard timeout still applies');
  } finally {
    delete process.env.TUTOR_BRAINGEN_THINKING;
  }
  const g = fakeClient(() => ({ text: GEN_JSON() }));
  await generateCandidate('write one', [], { client: g.client });
  assert.deepEqual(g.bodies[0].thinking, { type: 'disabled' });
});
await test('solver: keeps the model\'s default thinking (no thinking parameter) and its one retry at the higher cap', async () => {
  const f = fakeClient((_b, call) => (call === 0 ? { stop: 'max_tokens' } : { text: '42' }));
  const out = await quiet(() => verifyClaimedAnswer('What is 6 × 7?', '42', undefined, { client: f.client }));
  assert.equal(out.agree, true);
  assert.deepEqual(f.bodies.map((b) => b.max_tokens), [VERIFY_MAX_TOKENS, RETRY_MAX_TOKENS]);
  assert.ok(f.bodies.every((b) => b.thinking === undefined));
});
await test('solver: retryCutOff:false (live session) → never the 12000 retry', async () => {
  const f = fakeClient(() => ({ stop: 'max_tokens' }));
  const out = await quiet(() => verifyClaimedAnswer('What is 6 × 7?', '42', undefined, { client: f.client, retryCutOff: false }));
  assert.equal(out.agree, false);
  assert.deepEqual(f.bodies.map((b) => b.max_tokens), [VERIFY_MAX_TOKENS]);
});
await test('thinking parameter rejected by the endpoint (400 naming it) → the call is repeated once without it', async () => {
  const f = fakeClient((b) => (b.thinking ? { error: Object.assign(new Error('400 thinking: this model does not support disabling thinking'), { status: 400 }) } : { text: 'ok' }));
  assert.equal(await quiet(() => callTextModel(f.client, 'm', 'sys', 'user', 100, { thinking: 'disabled' })), 'ok');
  assert.equal(f.bodies.length, 2);
  assert.equal(f.bodies[1].thinking, undefined);
  // Any other 400 is not swallowed.
  const g = fakeClient(() => ({ error: Object.assign(new Error('400 max_tokens too large'), { status: 400 }) }));
  await assert.rejects(() => callTextModel(g.client, 'm', 'sys', 'user', 100, { thinking: 'disabled' }), /max_tokens/);
  assert.equal(g.bodies.length, 1);
});

// ── (c) the live tutor session ──────────────────────────────────────────
const PLAN = {
  id: 'plan-live',
  topic: 'algebra-1',
  los: [{ id: 'plan-live.lo-1', description: 'Multiply whole numbers' }],
  segments: [{ kind: 'try_yourself', id: 'try-1', problem: 'Multiply whole numbers: what is 3 × 4?', expectedAnswer: '12' }],
} as unknown as GenerateProblemInput['plan'];
const LIVE_INPUT: GenerateProblemInput = {
  planId: 'plan-live', plan: PLAN, topic: 'no-such-topic', difficulty: 'same',
  anchor: { statement: 'Multiply whole numbers: what is 5 × 5?', expectedAnswer: '25' },
};
(ProblemBank as unknown as { updateOne: () => Promise<unknown> }).updateOne = async () => ({});

await test(`live session: the default budget is ${LIVE_BRAINGEN_BUDGET_MS} ms (a voice turn used to be able to wait 45–85 s)`, () => {
  assert.ok(LIVE_BRAINGEN_BUDGET_MS >= 8_000 && LIVE_BRAINGEN_BUDGET_MS <= 15_000);
});
await test('live session: a SLOW model → null at the budget, the request aborted, no 12000 retry, no unhandled rejection', async () => {
  const f = fakeClient(() => ({ text: GEN_JSON(), delayMs: 2_000 }));
  const t0 = Date.now();
  const out = await quiet(() => brainGenWithinBudget(LIVE_INPUT, 2, 80, f.client));
  const took = Date.now() - t0;
  assert.equal(out, null);
  assert.ok(took >= 70 && took < 600, `returned at the budget (took ${took} ms)`);
  assert.equal(f.options[0]?.signal?.aborted, true, 'the in-flight request is aborted');
  await sleep(30);
  assert.equal(f.bodies.length, 1, 'nothing further is sent after the budget');
});
await test('live session: a slow client that IGNORES the abort still cannot hold the turn, and its late result is not served', async () => {
  const f = fakeClient((b) => ({ text: isGenCall(b) ? GEN_JSON() : '42', delayMs: 150 }), false);
  const t0 = Date.now();
  const out = await quiet(() => brainGenWithinBudget(LIVE_INPUT, 2, 60, f.client));
  assert.equal(out, null);
  assert.ok(Date.now() - t0 < 140);
  await sleep(400); // let the ignored calls finish
});
await test('live session: a cut-off solver reply is never re-asked at the higher cap', async () => {
  const f = fakeClient((b) => (isGenCall(b) ? { text: GEN_JSON() } : { stop: 'max_tokens' }));
  assert.equal(await quiet(() => brainGenWithinBudget(LIVE_INPUT, 2, 2_000, f.client)), null);
  assert.ok(f.bodies.every((b) => b.max_tokens <= VERIFY_MAX_TOKENS), JSON.stringify(f.bodies.map((b) => b.max_tokens)));
});
await test('live session: a fast, agreeing model still yields the generated problem', async () => {
  const f = fakeClient((b) => ({ text: isGenCall(b) ? GEN_JSON() : '42' }));
  const out = await quiet(() => brainGenWithinBudget(LIVE_INPUT, 2, 2_000, f.client));
  assert.equal(out?.canonicalText, 'What is 6 × 7?');
  assert.equal(out?.provenance, 'brain-gen');
});
await test('live session, whole pipeline (generateProblem): slow generation → the EXISTING fallback (plan-authored) within the budget', async () => {
  const f = fakeClient(() => ({ text: GEN_JSON(), delayMs: 5_000 }));
  const t0 = Date.now();
  const { result, telemetry } = await quiet(() => generateProblem({ ...LIVE_INPUT, forceBrainGen: true, brainGenBudgetMs: 100, brainGenClient: f.client }));
  const took = Date.now() - t0;
  assert.ok(took < 1_000, `took ${took} ms`);
  assert.equal(result?.provenance, 'plan-authored');
  assert.equal(result?.canonicalText, 'Multiply whole numbers: what is 3 × 4?');
  assert.equal(telemetry.layerReached, 4);
  assert.equal(telemetry.brainGenFailed, true);
});

// ── (b) the interactive practice draw: deadline + background ────────────
const LO = 'alg1.linear-equations';
function gen(text: string, answer: string, free = false): GenPayload {
  return free
    ? { problemText: text, finalAnswer: answer, answerKind: 'free', expectedAnswer: answer, hints: [] }
    : { problemText: text, finalAnswer: answer, teachingAnswer: 'worked', responseFormat: 'numeric', hints: ['h'] };
}
type Slot = { gen?: GenPayload | null; delayMs?: number; reject?: boolean };
function timedSources(slots: Slot[], allowed?: number) {
  const persisted: string[] = [];
  const released: Array<{ studentId: string; loId: string; n: number; at: Date }> = [];
  const signals: Array<AbortSignal | undefined> = [];
  let call = 0;
  const sources: PracticeGenSources = {
    async generateAndVerify(_prompt, _exclude, _onGateFailed, signal) {
      const i = call++;
      signals.push(signal);
      const slot = slots[Math.min(i, slots.length - 1)];
      if (slot.delayMs) await sleep(slot.delayMs);
      if (slot.reject) throw new Error('simulated HTTP 529');
      return slot.gen ? { gen: slot.gen, hash: `h${i}` } : null;
    },
    async reserve(_s, _l, n) { return allowed ?? n; },
    async persist(row) { persisted.push(row.gen.problemText); },
    async release(studentId, loId, n, at) { released.push({ studentId, loId, n, at }); },
  };
  return { sources, persisted, released, signals };
}
const opts = (over: Partial<GeneratePracticeItemsOptions> = {}): GeneratePracticeItemsOptions => ({ studentId: 'stu-1', loId: LO, topic: 'algebra-1', shortfall: 2, anchorItems: [], ...over });
const A = gen('Solve 2x + 3 = 11 for x.', '4');
const B = gen('A taxi charges $3 plus $2 per km. How many km for $19?', '8');
process.env.PRACTICE_GEN = 'on';

await test(`deadline: the practice endpoint waits about ${PRACTICE_DRAW_DEADLINE_MS / 1000} s, under the academy's 60 s`, () => {
  assert.ok(PRACTICE_DRAW_DEADLINE_MS >= 25_000 && PRACTICE_DRAW_DEADLINE_MS <= 40_000);
});
await test('deadline: one slot ready, one still running → returns the ready one AT the deadline; the late one is stored afterwards, once', async () => {
  const s = timedSources([{ gen: A }, { gen: B, delayMs: 250 }]);
  const events: string[] = [];
  const t0 = Date.now();
  const out = await generatePracticeItemsDetailed(opts({ deadlineMs: 60, onDebugEvent: (t, m) => events.push(`${t} ${m}`) }), s.sources);
  const took = Date.now() - t0;
  assert.ok(took >= 50 && took < 200, `returned at the deadline (took ${took} ms)`);
  assert.deepEqual(out.items.map((i) => i.problemText), [A.problemText]);
  assert.equal(out.status, 'ran');
  assert.equal(out.reserved, 2);
  assert.equal(out.pending, 1);
  assert.deepEqual(s.persisted, [A.problemText], 'only the ready item is stored so far');
  await out.background;
  assert.deepEqual(s.persisted, [A.problemText, B.problemText], 'the late item is stored when it finishes — once');
  assert.deepEqual(out.items.map((i) => i.problemText), [A.problemText], 'the returned list is not mutated afterwards');
  assert.ok(events.some((e) => e.startsWith('practice_gen_deadline') && e.includes('pending=1')), events.join(' | '));
  assert.ok(events.some((e) => e.startsWith('practice_gen_background_stored')), events.join(' | '));
  assert.deepEqual(s.released, [], 'a slot that produced an item keeps its reservation');
});
await test('deadline: nothing ready → [] with both slots pending; both are stored in the background for the next draw', async () => {
  const s = timedSources([{ gen: A, delayMs: 120 }, { gen: B, delayMs: 160 }]);
  const out = await generatePracticeItemsDetailed(opts({ deadlineMs: 40 }), s.sources);
  assert.deepEqual(out.items, []);
  assert.equal(out.pending, 2);
  assert.deepEqual(s.persisted, []);
  await out.background;
  assert.deepEqual(s.persisted.sort(), [A.problemText, B.problemText].sort());
});
await test('deadline: a background item goes through the SAME gates — a twin of the item already served is not stored', async () => {
  const T1 = gen('In ClF3 the central chlorine atom is bonded to three fluorine atoms and also has two lone pairs of electrons. What is the molecular geometry?', 'T-shaped', true);
  const T2 = gen('In ClF3 the central chlorine atom is bonded to three fluorine atoms and also carries two lone pairs of electrons. What is the molecular geometry?', 'T-shaped', true);
  const s = timedSources([{ gen: T1 }, { gen: T2, delayMs: 120 }]);
  const events: string[] = [];
  const out = await generatePracticeItemsDetailed(opts({ deadlineMs: 40, onDebugEvent: (t, m) => events.push(`${t} ${m}`) }), s.sources);
  assert.equal(out.items.length, 1);
  await out.background;
  assert.deepEqual(s.persisted, [T1.problemText]);
  assert.ok(events.some((e) => e.includes('near_duplicate_sibling')));
  // …and two late twins store ONE.
  const s2 = timedSources([{ gen: T1, delayMs: 100 }, { gen: T2, delayMs: 110 }]);
  const out2 = await generatePracticeItemsDetailed(opts({ deadlineMs: 30 }), s2.sources);
  await out2.background;
  assert.equal(s2.persisted.length, 1);
  // …and the same content from both late slots (same id) stores ONE.
  const same: PracticeGenSources = { ...timedSources([]).sources, async generateAndVerify() { await sleep(90); return { gen: A, hash: 'same' }; } };
  const stored: string[] = [];
  same.persist = async (row) => { stored.push(row.id); };
  const out3 = await quiet(() => generatePracticeItemsDetailed(opts({ deadlineMs: 30 }), same));
  await out3.background;
  assert.equal(stored.length, 1, 'never double-stored');
});
await test('deadline: a late slot whose model call FAILS → no unhandled rejection, nothing stored, its reservation released', async () => {
  const before = unhandled.length;
  const s = timedSources([{ gen: A }, { reject: true, delayMs: 100 }]);
  const out = await quiet(() => generatePracticeItemsDetailed(opts({ deadlineMs: 40 }), s.sources));
  assert.equal(out.items.length, 1);
  await quiet(() => out.background);
  await sleep(20);
  assert.equal(unhandled.length, before);
  assert.deepEqual(s.persisted, [A.problemText]);
  assert.equal(s.released.length, 1);
});
await test('deadline: a persist that throws in the background is contained', async () => {
  const before = unhandled.length;
  const s = timedSources([{ gen: A, delayMs: 80 }], 1);
  s.sources.persist = async () => { throw new Error('mongo down'); };
  const out = await generatePracticeItemsDetailed(opts({ shortfall: 1, deadlineMs: 20 }), s.sources);
  await quiet(() => out.background);
  await sleep(20);
  assert.equal(unhandled.length, before);
});
await test('no deadline (session-end top-up, scripts): every slot is awaited, as before — slot order kept', async () => {
  const s = timedSources([{ gen: A, delayMs: 80 }, { gen: B }]);
  const out = await generatePracticeItemsDetailed(opts(), s.sources);
  assert.deepEqual(out.items.map((i) => i.problemText), [A.problemText, B.problemText]);
  assert.equal(out.pending, 0);
  assert.deepEqual(await generatePracticeItems(opts(), timedSources([{ gen: A }, { gen: B }]).sources).then((i) => i.length), 2);
});
await test('every slot receives the request\'s hard-limit abort signal', async () => {
  const s = timedSources([{ gen: A }, { gen: B }]);
  await generatePracticeItemsDetailed(opts(), s.sources);
  assert.equal(s.signals.length, 2);
  assert.ok(s.signals.every((sig) => sig instanceof AbortSignal && !sig.aborted));
});

// ── (e) reservations ────────────────────────────────────────────────────
await test('reservation: a slot whose model call FAILED gives its (student, LO) slot back; a slot the gates rejected does not', async () => {
  const failedCall = timedSources([{ reject: true }, { gen: B }]);
  const out = await quiet(() => generatePracticeItemsDetailed(opts(), failedCall.sources));
  assert.equal(out.items.length, 1);
  assert.equal(failedCall.released.length, 1);
  assert.deepEqual({ ...failedCall.released[0], at: undefined }, { studentId: 'stu-1', loId: LO, n: 1, at: undefined });
  assert.ok(failedCall.released[0].at instanceof Date);
  const gated = timedSources([{ gen: null }, { gen: null }]);
  await generatePracticeItemsDetailed(opts(), gated.sources);
  assert.deepEqual(gated.released, [], 'the gates said no: the slot did its work and stays counted');
});
await test('reservation: sources without release (older stubs) behave as before; a release that throws is contained', async () => {
  const s = timedSources([{ reject: true }], 1);
  delete s.sources.release;
  assert.deepEqual((await quiet(() => generatePracticeItemsDetailed(opts({ shortfall: 1 }), s.sources))).items, []);
  const t = timedSources([{ reject: true }], 1);
  t.sources.release = async () => { throw new Error('mongo down'); };
  assert.deepEqual((await quiet(() => generatePracticeItemsDetailed(opts({ shortfall: 1 }), t.sources))).items, []);
});
await test('reservation: the real release decrements ONLY the (student, LO) counter of the reservation\'s day, never below zero — the global cost ceiling stays counted', async () => {
  const calls: Array<{ filter: Record<string, unknown>; update: Record<string, unknown> }> = [];
  (PracticeGenCounter as unknown as { updateOne: (f: Record<string, unknown>, u: Record<string, unknown>) => Promise<unknown> }).updateOne = async (filter, update) => {
    calls.push({ filter, update });
    return {};
  };
  await practiceGenSources().release!('stu-9', LO, 1, new Date('2026-10-05T23:59:30Z'));
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].filter, { scopeKey: `stu-9::${LO}`, day: '2026-10-05', count: { $gte: 1 } });
  assert.deepEqual(calls[0].update, { $inc: { count: -1 } });
});

// ════════════════════════════════════════════════════════════════════════
// 13. why a draw is empty
// ════════════════════════════════════════════════════════════════════════
console.log('\n13. emptyReason\n');
const EMPTY_PLAN: PlanLite = { id: 'gen-empty', topic: 'algebra-1', los: [{ id: LO }], segments: [] };
const FULL_PLAN: PlanLite = { ...EMPTY_PLAN, segments: [{ kind: 'try_yourself', id: 'try-1', problem: 'Solve x + 1 = 2.', expectedAnswer: '1', responseFormat: 'numeric' }] };
const practiceSources = (plan: PlanLite | null): PracticeSources => ({
  async plansForLoId() { return plan ? [plan] : []; },
  async plansForTopic() { return plan ? [plan] : []; },
  async bankForLoId() { return []; },
  async bankForTopic() { return []; },
});
const REQ = { studentId: 'stu-1', courseId: 'c1', scope: { loId: LO }, count: 2 } as const;

await test('emptyReason: absent whenever there are items', async () => {
  const res = await retrievePractice({ ...REQ, count: 1 }, practiceSources(FULL_PLAN), timedSources([{ gen: null }]).sources);
  assert.equal(res.items.length, 1);
  assert.equal('emptyReason' in res, false);
});
await test('emptyReason "none_available": generation is off / the skill has no owning plan / a topic scope', async () => {
  delete process.env.PRACTICE_GEN;
  assert.deepEqual(await retrievePractice(REQ, practiceSources(EMPTY_PLAN), timedSources([{ gen: A }]).sources), { items: [], emptyReason: 'none_available' });
  process.env.PRACTICE_GEN = 'on';
  assert.deepEqual(await retrievePractice(REQ, practiceSources(null), timedSources([{ gen: A }]).sources), { items: [], emptyReason: 'none_available' });
  assert.deepEqual(await retrievePractice({ ...REQ, scope: { topicId: 'algebra-1' } }, practiceSources(EMPTY_PLAN), timedSources([{ gen: A }]).sources), { items: [], emptyReason: 'none_available' });
});
await test('emptyReason "limit": the daily cap granted no slot', async () => {
  assert.deepEqual(await retrievePractice(REQ, practiceSources(EMPTY_PLAN), timedSources([{ gen: A }], 0).sources), { items: [], emptyReason: 'limit' });
});
await test('emptyReason "preparing": the gates rejected both slots / a model call failed / the cap check failed', async () => {
  assert.deepEqual(await quiet(() => retrievePractice(REQ, practiceSources(EMPTY_PLAN), timedSources([{ gen: null }]).sources)), { items: [], emptyReason: 'preparing' });
  assert.deepEqual(await quiet(() => retrievePractice(REQ, practiceSources(EMPTY_PLAN), timedSources([{ reject: true }]).sources)), { items: [], emptyReason: 'preparing' });
  const capDown = timedSources([{ gen: A }]);
  capDown.sources.reserve = async () => { throw new Error('mongo down'); };
  assert.deepEqual(await quiet(() => retrievePractice(REQ, practiceSources(EMPTY_PLAN), capDown.sources)), { items: [], emptyReason: 'preparing' });
});
await test('emptyReason "preparing": the deadline passed with generation still running — the background work is handed to the caller and stored', async () => {
  const s = timedSources([{ gen: A, delayMs: 120 }, { gen: B, delayMs: 130 }]);
  const background: Array<Promise<void>> = [];
  const res = await quiet(() => retrievePractice(REQ, practiceSources(EMPTY_PLAN), s.sources, undefined, { genDeadlineMs: 30, onBackground: (w) => background.push(w) }));
  assert.deepEqual(res, { items: [], emptyReason: 'preparing' });
  assert.equal(background.length, 1);
  await background[0];
  assert.equal(s.persisted.length, 2, 'the next draw finds them in the bank');
});
await test('emptyReason: no deadline unless the caller asks for one (assessments, top-up keep waiting)', async () => {
  const s = timedSources([{ gen: A, delayMs: 60 }, { gen: B, delayMs: 70 }]);
  const res = await quiet(() => retrievePractice(REQ, practiceSources(EMPTY_PLAN), s.sources));
  assert.equal(res.items.length, 2);
});
await test('practiceEmptyReason: the mapping', () => {
  assert.equal(practiceEmptyReason(null), 'none_available');
  assert.equal(practiceEmptyReason({ status: 'off' }), 'none_available');
  assert.equal(practiceEmptyReason({ status: 'limit' }), 'limit');
  assert.equal(practiceEmptyReason({ status: 'ran' }), 'preparing');
  assert.equal(practiceEmptyReason({ status: 'unavailable' }), 'preparing');
});
delete process.env.PRACTICE_GEN;

// ════════════════════════════════════════════════════════════════════════
// 2. a fraction followed by something that is not a unit
// ════════════════════════════════════════════════════════════════════════
console.log('\n2. fraction keys\n');
const agree = (solved = 'agree'): VerifyFn => async () => ({ agree: true, solved });
const numeric = (q: string, a: string, worked = 'worked'): GenPayload => ({ problemText: q, finalAnswer: a, teachingAnswer: worked, responseFormat: 'numeric', hints: [] });

await test('"4/3 π" is not the fraction 4/3 (it was stored as the key 4/3 — 1.33 for an answer of 4.19)', async () => {
  for (const s of ['4/3 π', '4/3 pi', '4/3π', '1/2 π rad', '3/4 x', '2/3 e', '7/2 cm^2', '5/6 √2', '5/6 sqrt(2)', '1/2 × 10^3', '1/2 · 3', '3/4 y', '5/6 (about 0.83)', '1/3 ≈ 0.33', '2/3 or 0.67', '1 1/2'])
    assert.equal(normalizeNumericAnswer(s), null, s);
});
await test('a plain unit after a fraction is still a unit', () => {
  assert.equal(normalizeNumericAnswer('5/6 rad'), '5/6');
  assert.equal(normalizeNumericAnswer('5/6 m/s'), '5/6');
  assert.equal(normalizeNumericAnswer('-7/3 m/s'), '-7/3');
  assert.equal(normalizeNumericAnswer('5/6 of the pie'), '5/6');
  assert.equal(normalizeNumericAnswer('5/6 ft/s'), '5/6');
  assert.equal(normalizeNumericAnswer('2/3 °'), '2/3');
  assert.equal(normalizeNumericAnswer('3/2 hours'), '1.5');
  assert.equal(normalizeNumericAnswer('5/6'), '5/6');
  assert.equal(normalizeNumericAnswer('\\frac{5}{13}'), '5/13');
  for (const u of ['rad', 'm/s', 'of the pie', 'kg', 'm', 'N', 'μm', '°', '%', 'ft/s', 'cups']) assert.equal(isPlainUnit(u), true, u);
  for (const u of ['π', 'pi', 'π rad', 'x', 'e', 'cm^2', 'm/s^2', '√2', 'sqrt', '× 10', '· 3', '2', 'y', 'i', '(about)']) assert.equal(isPlainUnit(u), false, u);
});
await test('gate: "4/3 π" with an AGREEING solver is rejected — no key is stored that the solver did not agree with', async () => {
  const out = await checkGeneratedAnswer(numeric('Find the volume of a sphere of radius 1.', '4/3 π'), agree('4π/3'));
  assert.deepEqual(out, { ok: false, reason: 'numeric_shape' });
});
await test('gate: the stored key must have the value the solver agreed with (normalizedKeyAgrees)', async () => {
  assert.equal(normalizedKeyAgrees('5/6', '5/6 rad', '0.8333 rad'), true);
  assert.equal(normalizedKeyAgrees('5/6', '5/6 rad', '5/6'), true);
  assert.equal(normalizedKeyAgrees('48', '48 square inches', '48 in²'), true);
  assert.equal(normalizedKeyAgrees('50', '50%', '50%'), true, 'percent: the key is the bare numeral');
  assert.equal(normalizedKeyAgrees('50', '50%', '0.5'), true);
  assert.equal(normalizedKeyAgrees('50', 'approximately 50%', 'about 50 percent'), true);
  assert.equal(normalizedKeyAgrees('4/3', '4/3 π', '4.19'), false, 'the key is not the value that was verified');
  assert.equal(normalizedKeyAgrees('1.33', '1.33', '4.19'), false);
  assert.equal(normalizedKeyAgrees('42', '42', 'no number here'), true, 'nothing further to compare with');
  // End to end: a solver that "agrees" (stub) but whose own value is far from the key.
  const out = await checkGeneratedAnswer(numeric('What is 6 × 7?', '42'), agree('13'));
  assert.deepEqual(out, { ok: false, reason: 'verify_disagree' });
  const ok = await checkGeneratedAnswer(numeric('What is 6 × 7?', '42'), agree('42'));
  assert.equal(ok.ok && ok.gen.finalAnswer, '42');
  const pct = await checkGeneratedAnswer(numeric('What percent of 80 is 40?', '50%'), agree('50%'));
  assert.equal(pct.ok && pct.gen.finalAnswer, '50');
});

// ════════════════════════════════════════════════════════════════════════
// 3. duplicates
// ════════════════════════════════════════════════════════════════════════
console.log('\n3. duplicates\n');
const Q = (problemText: string, answerText?: string, choices?: string[]) => ({ problemText, answerText, choices });
await test('distinct items are NOT duplicates — every pair the review listed', () => {
  const pairs: Array<[ReturnType<typeof Q>, ReturnType<typeof Q>]> = [
    [Q('Find the derivative of f(x) = x² sin(x).', '2x sin x + x² cos x'), Q('Find the derivative of f(x) = sin(x²).', '2x cos(x²)')],
    [Q('Find the derivative of f(x) = x² sin(x).'), Q('Find the derivative of f(x) = sin(x²).')],
    [Q('Differentiate f(x) = sin(x) cos(x).', 'cos 2x'), Q('Differentiate f(x) = sin(x) + cos(x).', 'cos x − sin x')],
    [Q('Differentiate f(x) = sin(x) cos(x).'), Q('Differentiate f(x) = sin(x) + cos(x).')],
    [Q('Factor x² − 9.', '(x−3)(x+3)'), Q('Factor x² − 9x.', 'x(x−9)')],
    [Q('Factor x² − 9.'), Q('Factor x² − 9x.')],
    [Q('Simplify (a + b)(a − b).', 'a² − b²'), Q('Simplify (a + b)(a + b).', 'a² + 2ab + b²')],
    [Q('Simplify (a + b)(a − b).'), Q('Simplify (a + b)(a + b).')],
    [Q('Evaluate $\\lim_{x\\to 0}\\frac{\\sin x}{x}$.', '1'), Q('Evaluate $\\lim_{x\\to 0}\\frac{\\sin(3x)}{x}$.', '3')],
    [Q('Evaluate $\\lim_{x\\to 0}\\frac{\\sin x}{x}$.'), Q('Evaluate $\\lim_{x\\to 0}\\frac{\\sin(3x)}{x}$.')],
    [Q('What is the oxidation state of sulfur in sulfuric acid?', '+6'), Q('What is the oxidation state of sulfur in sulfurous acid?', '+4')],
    [Q('What is the oxidation state of sulfur in sulfuric acid?'), Q('What is the oxidation state of sulfur in sulfurous acid?')],
    [Q('What is the oxidation state of sulfur in H2SO4?', '+6'), Q('What is the oxidation state of sulfur in H2SO3?', '+4')],
    [Q('How many lone pairs are on the central atom of water?', '2'), Q('How many lone pairs are on the central atom of ammonia?', '1')],
    [Q('How many lone pairs are on the central atom of water?'), Q('How many lone pairs are on the central atom of ammonia?')],
    [Q('Conjugate the verb "hablar" in the first person singular preterite.', 'hablé'), Q('Conjugate the verb "comer" in the first person singular preterite.', 'comí')],
    [Q('Conjugate the verb "hablar" in the first person singular preterite.'), Q('Conjugate the verb "comer" in the first person singular preterite.')],
    [Q('Write the equation of the line with slope 2 through (0, 3).', 'y = 2x + 3'), Q('Write the equation of the line with slope 3 through (0, 2).', 'y = 3x + 2')],
    [Q('Write the equation of the line with slope 2 through (0, 3).'), Q('Write the equation of the line with slope 3 through (0, 2).')],
    [Q('Does the series Σ 1/n converge or diverge?', 'diverges'), Q('Does the series Σ 1/n² converge or diverge?', 'converges')],
    [Q('Does the series Σ 1/n converge or diverge?'), Q('Does the series Σ 1/n² converge or diverge?')],
    // Same stem, the content is in the options.
    [
      Q('Which sentence is punctuated correctly?', 'We loaded the van with tents, sleeping bags, and a stove.', ['We loaded the van with tents, sleeping bags, and a stove.', 'We loaded the van, with tents sleeping bags and a stove.']),
      Q('Which sentence is punctuated correctly?', 'My oldest cousin, a welder in Duluth, taught me to solder.', ['My oldest cousin a welder in Duluth, taught me to solder.', 'My oldest cousin, a welder in Duluth, taught me to solder.']),
    ],
    [Q('Which sentence is punctuated correctly?', undefined, ['A, b.', 'A b.']), Q('Which sentence is punctuated correctly?', undefined, ['C, d.', 'C d.'])],
    // Same answer by coincidence — a bare number or word identifies nothing.
    [Q('How many valence electrons does oxygen have?', '6'), Q('How many valence electrons does sulfur have?', '6')],
    [Q('What is the molecular geometry of methane?', 'tetrahedral'), Q('What is the molecular geometry of carbon tetrachloride?', 'tetrahedral')],
    [Q('A car travels 60 km in 2 hours. What is its average speed in km/h?', '30'), Q('A train travels 90 km in 3 hours. What is its average speed in km/h?', '30')],
    [Q('Evaluate 3 + 4 × 2.', '11'), Q('Evaluate (3 + 4) × 2.', '14')],
    [Q('Evaluate 3 + 4 × 2.'), Q('Evaluate (3 + 4) × 2.')],
    // A ratio answer inside another only when the numbers are the same.
    [Q('In pea plants round (R) is dominant to wrinkled (r) and yellow (Y) to green (y). RrYy is crossed with rryy. What phenotype ratio is expected?', '1 round yellow : 1 round green : 1 wrinkled yellow : 1 wrinkled green'), Q('In pea plants round (R) is dominant to wrinkled (r) and yellow (Y) to green (y). RrYy is crossed with RrYy. What phenotype ratio is expected?', '9:3:3:1 round yellow : round green : wrinkled yellow : wrinkled green')],
    [Q('For the parametric curve $x=t^2$, $y=t^3$, find $\\dfrac{dy}{dx}$.', '$\\dfrac{3t}{2}$'), Q('For $x=t^2$, $y=t^3$ (so $\\dfrac{dy}{dx}=\\dfrac{3t}{2}$), find $\\dfrac{d^2y}{dx^2}$.', '$\\dfrac{3}{4t}$')],
  ];
  for (const [a, b] of pairs) {
    assert.equal(nearDuplicateReason(a, b), null, `${a.problemText} <> ${b.problemText}`);
    assert.equal(nearDuplicateReason(b, a), null, `${b.problemText} <> ${a.problemText}`);
  }
});
await test('the ordered maths tokens tell x² sin(x) from sin(x²), and 2 … (0, 3) from 3 … (0, 2)', () => {
  assert.notDeepEqual(mathTokens('f(x) = x² sin(x)'), mathTokens('f(x) = sin(x²)'));
  assert.notDeepEqual(mathTokens('slope 2 through (0, 3)'), mathTokens('slope 3 through (0, 2)'));
  assert.deepEqual(mathTokens("the essay's point — a well-known one"), [], 'possessives, dashes and hyphens are not maths');
});
await test("'duplicate': the WHOLE item matches — stem words, ordered maths tokens, options, answer", () => {
  assert.equal(nearDuplicateReason(Q('Factor x² − 9.', '(x−3)(x+3)'), Q('Factor:  x^2 - 9', '(x−3)(x+3)')), 'duplicate');
  assert.equal(nearDuplicateReason(Q('Factor x² − 9.'), Q('Factor x^2 - 9')), 'duplicate', 'answers unknown: the question alone');
  assert.equal(nearDuplicateReason(Q('What is 6 × 7?', '42'), Q('What is 6 × 7?', '42')), 'duplicate');
  assert.equal(nearDuplicateReason(Q('What is 6 × 7?', '42'), Q('What is 6 × 7?', '43')), null, 'a different answer is a different item');
  const opts1 = ['Physical change', 'Chemical change'];
  assert.equal(nearDuplicateReason(Q('You tear a sheet of paper. What type of change is this?', 'Physical change', opts1), Q('You tear a sheet of paper. What type of change is this?', 'Physical change', [...opts1].reverse())), 'duplicate', 'option order does not matter');
  assert.equal(nearDuplicateReason(Q('Which is prime?', undefined, ['4', '7']), Q('Which is prime?', undefined, ['9', '11'])), null, 'different options');
});
await test("'reworded': needs the same identifying answer AND the same data AND a largely shared stem", () => {
  const stem1 = 'During which stage of the cell cycle is a cell\'s DNA copied, so that each chromosome ends up as two identical sister chromatids joined at a centromere?';
  const stem2 = 'At what point in the cell cycle is a cell\'s DNA copied, so that each chromosome ends up as two identical sister chromatids?';
  assert.equal(nearDuplicateReason(Q(stem1, 'S phase of interphase'), Q(stem2, 'During S phase of interphase, before mitosis begins')), 'reworded');
  assert.equal(nearDuplicateReason(Q(stem1, 'S phase of interphase'), Q(stem2, 'G1 phase')), null, 'another answer');
  assert.equal(nearDuplicateReason(Q(stem1), Q(stem2)), null, 'answers unknown → only a whole-item match counts');
  assert.equal(nearDuplicateReason(Q(stem1, '2'), Q(stem2, '2')), null, 'a bare number cannot identify a question');
});

// ════════════════════════════════════════════════════════════════════════
// 4. precision
// ════════════════════════════════════════════════════════════════════════
console.log('\n4. precision\n');
await test('exact decimals pass with no stated precision — every example from the review', async () => {
  const exact: Array<[string, string]> = [
    ['Convert 3/8 to a decimal.', '0.375'],
    ['What is 1 ÷ 8?', '0.125'],
    ['Solve 16x = 1.', '0.0625'],
    ['What is sin(30°)?', '0.5'],
    ['Evaluate cos(60°) + 1.', '1.5'],
    ['A circle has radius 2. Find its area. Use π = 3.14.', '12.56'],
    ['A circle has radius 2. Find its area, using 3.14 for π.', '12.56'],
    ['Water is heated from 20°C to 45.5°C. What is the temperature change in °C?', '25.5'],
    ['The nearest star is 4.2 light years away. How far is that in light-months?', '50.4'],
    ['A triangle has angles 40.5° and 60.25°. Find the third angle in degrees.', '79.25'],
    ['Evaluate log(1000) / 4.', '0.75'],
    ['An object in the nearest lane travels 7 m in 2 s. What is its speed in m/s?', '3.5'],
  ];
  for (const [q, k] of exact) {
    assert.equal(numericKeyPrecisionOk(q, k, { worked: `= ${k}`, solved: k }), true, q);
    assert.equal(numericKeyPrecisionOk(q, k, ''), true, q);
    const gated = await checkGeneratedAnswer(numeric(q, k, `The answer is ${k}.`), agree(k));
    assert.equal(gated.ok && gated.gen.finalAnswer, k, q);
  }
});
await test('a fraction answer whose decimal terminates ("1/2", "3/8") passes — it is exact by construction', async () => {
  for (const [raw, key] of [['1/2', '0.5'], ['3/8', '0.375'], ['\\frac{3}{8}', '0.375'], ['3/8 cup', '0.375']] as const) {
    assert.equal(numericKeyPrecisionOk('What fraction of the tank is full?', key, { rawAnswer: raw, worked: 'about three eighths ≈ 0.375', solved: '0.3750001' }), true, raw);
    const gated = await checkGeneratedAnswer(numeric('Find sin of the angle whose opposite side is 3 and hypotenuse 8.', raw), agree(raw));
    assert.equal(gated.ok && gated.gen.finalAnswer, key, raw);
  }
});
await test('a stated precision is recognised in the forms the review listed', () => {
  const places = (q: string, n: number) => assert.deepEqual(statedPrecision(q), { kind: 'places', n }, q);
  places('Give the answer correct to 1 d.p.', 1);
  places('Find x to 2 d.p.', 2);
  places('Give your answer to 3 dp.', 3);
  places('to 2 decimal places', 2);
  places('to one decimal place', 1);
  places('Round to the nearest tenth.', 1);
  places('to the nearest hundredth', 2);
  places('to the nearest whole number', 0);
  places('to the nearest integer', 0);
  places('to the nearest cent', 2);
  places('to the nearest dollar', 0);
  places('to the nearest percent', 0);
  places('to the nearest degree', 0);
  places('to the nearest metre', 0);
  places('to the nearest 0.01', 2);
  places('to the nearest tenth of a percent', 1);
  const sig = (q: string, n: number) => assert.deepEqual(statedPrecision(q), { kind: 'sigfigs', n }, q);
  sig('correct to 3 s.f.', 3);
  sig('to 3 sig figs', 3);
  sig('to three significant figures', 3);
  sig('Give 2 sf.', 2);
  for (const q of ['Round your answer.', 'Use 3.14 for π.', 'Use π = 3.14.', 'Take π ≈ 3.14.', 'Take pi as 3.14', 'Give your answer to at least two decimal places.', 'Give the exact value.', 'as a fraction'])
    assert.deepEqual(statedPrecision(q), { kind: 'stated' }, q);
  for (const q of ['Give a decimal.', 'Convert 3/8 to a decimal.', 'Write 7/16 as a decimal.', 'Give your answer as a decimal.'])
    assert.deepEqual(statedPrecision(q), { kind: 'decimal' }, q);
  for (const q of ['The nearest star is 4.2 light years away.', 'An object in the nearest lane travels 7 m.', 'Water is heated from 20°C to 45.5°C.', 'What is sin(30°)?'])
    assert.equal(statedPrecision(q), null, q);
});
await test('when a precision IS stated the key must follow it — "1 d.p." with the key 0.33 is rejected (it passed)', async () => {
  assert.equal(numericKeyPrecisionOk('Give the answer correct to 1 d.p.', '0.33', ''), false);
  assert.equal(numericKeyPrecisionOk('Give the answer correct to 1 d.p.', '0.3', ''), true);
  assert.equal(numericKeyPrecisionOk('Find x to 2 d.p.', '0.333', ''), false);
  assert.equal(numericKeyPrecisionOk('Round your answer to the nearest dollar.', '4.57', ''), false);
  assert.equal(numericKeyPrecisionOk('Round your answer to the nearest cent.', '4.57', ''), true);
  assert.equal(numericKeyPrecisionOk('Give 3 s.f.', '0.6428', ''), false);
  assert.equal(numericKeyPrecisionOk('Give your answer to at least two decimal places: 5/7', '0.714', ''), true);
  assert.deepEqual(await checkGeneratedAnswer(numeric('Find 1/3 correct to 1 d.p.', '0.33'), agree('0.33')), { ok: false, reason: 'numeric_precision' });
});
await test('"give a decimal" admits EXACT decimals only: a rounding shown by the solver is still rejected', () => {
  assert.equal(numericKeyPrecisionOk('Write 3/8 as a decimal.', '0.375', { solved: '0.375' }), true);
  assert.equal(numericKeyPrecisionOk('Write 2/3 as a decimal.', '0.67', { solved: '0.6667' }), false);
  assert.equal(numericKeyPrecisionOk('Write 2/3 as a decimal.', '0.67', { solved: '≈ 0.67' }), false);
});
await test('rounding evidence: the solver\'s longer value or an approximation mark on the key — never the question\'s subject, never an intermediate value', () => {
  assert.equal(numericKeyPrecisionOk('Find the volume in litres.', '5.94', { worked: 'V = nRT/P ≈ 5.94 L' }), false);
  assert.equal(numericKeyPrecisionOk('Find the volume in litres.', '5.94', { solved: '5.9358 L' }), false);
  assert.equal(numericKeyPrecisionOk('Find the volume in litres.', '5.94', { solved: 'approximately 5.94 L' }), false);
  assert.equal(numericKeyPrecisionOk('Find the half-life.', '30.0', { worked: 'ln2/k ≈ 30.0' }), false);
  assert.equal(numericKeyPrecisionOk('Convert 1 inch to cm, then halve… how many inches is 6.35 cm?', '2.5', { worked: '6.35 / 2.54 = 2.5', solved: '2.5 inches' }), true, 'an intermediate 2.54 is not evidence');
  assert.equal(numericKeyPrecisionOk('The object is about 3 m from the wall. What is 1.5 × 3?', '4.5', { worked: 'It is 4.5', solved: '4.5' }), true, '"about" in the QUESTION is not evidence');
  assert.equal(numericKeyPrecisionOk('What is 10% of $45?', '4.5', { solved: '$4.50' }), true, 'the same value written longer');
});

// ════════════════════════════════════════════════════════════════════════
// 5. a numeric item with a second task
// ════════════════════════════════════════════════════════════════════════
console.log('\n5. second part\n');
await test('only an IMPERATIVE second task counts', async () => {
  const AUDITED = 'A biologist places a plant cell into an open beaker of pure water. The cell has a solute potential (Ψs) of -0.8 MPa and a pressure potential (Ψp) of 0.2 MPa. Calculate the water potential of the cell and use it to determine whether water will move into or out of the cell.';
  for (const q of [
    AUDITED,
    'Calculate the water potential and determine whether water moves into or out of the cell.',
    'Find the slope and explain what it means.',
    'Find the slope. Explain what it means.',
    'Compute Q. Then determine whether the reaction shifts left or right.',
    'Compute the mean, then state the units.',
    'How many grams are needed? Say whether that is more than 5.',
    'Find the area and justify your answer.',
  ]) assert.equal(numericHasSecondPart(q), true, q);
  for (const q of [
    'A scientist wants to explain a result. If the mass is 2 kg and a = 3 m/s², find F.',
    'A student must decide whether to buy 3 or 4. If each costs $2, what is the cost of 4?',
    'The table can explain the trend. What is the mean?',
    'A judge must determine whether the fee is fair: 3 hours at $40 an hour. What is the fee?',
    'Determine the value of x for which 3x = 12.',
    'Determine whether 91 is prime. Enter 1 for yes and 0 for no.',
    'Tom and Ann share 12 sweets. How many each?',
    'Predict the products, balance the equation, and state the coefficient of Cu. Type your answer as a number.',
    'Predict the monatomic ion sulfur forms, then state how many electrons that ion has. Type your answer as a number.',
    'Find the total number of units produced over these 7 weeks.',
  ]) assert.equal(numericHasSecondPart(q), false, q);
  assert.deepEqual(await checkGeneratedAnswer(numeric(AUDITED, '-0.6'), agree('-0.6')), { ok: false, reason: 'numeric_extra_part' });
  const fine = await checkGeneratedAnswer(numeric('A student must decide whether to buy 3 or 4. If each costs $2, what is the cost of 4?', '8'), agree('8'));
  assert.equal(fine.ok, true);
});

// ════════════════════════════════════════════════════════════════════════
// 12. maths delimiters
// ════════════════════════════════════════════════════════════════════════
console.log('\n12. delimiters\n');
await test('dollarMathDelimiters: code spans untouched, a dollar inside the maths escaped, an escaped backslash left alone', () => {
  const d = dollarMathDelimiters;
  assert.equal(d('code `arr\\[0\\]` and `f\\(x\\)` stay'), 'code `arr\\[0\\]` and `f\\(x\\)` stay');
  assert.equal(d('```\n\\(x\\)\n``` then \\(y\\)'), '```\n\\(x\\)\n``` then $y$');
  assert.equal(d('the cost is \\($5\\)'), 'the cost is $\\$5$');
  assert.equal(d('\\[ \\$5 + $3 \\]'), '$\\$5 + \\$3$');
  assert.equal(d('escaped \\\\( not math \\\\)'), 'escaped \\\\( not math \\\\)');
  assert.equal(d('line\\\\[2pt] break \\\\[3pt]'), 'line\\\\[2pt] break \\\\[3pt]');
  // unchanged behaviour
  assert.equal(d('Evaluate \\(\\sum_{k=1}^{6} k\\) now'), 'Evaluate $\\sum_{k=1}^{6} k$ now');
  assert.equal(d('So \\[ x = \\frac{1}{2} \\] and $$y = 3$$.'), 'So $x = \\frac{1}{2}$ and $y = 3$.');
  assert.equal(d('costs $5 and \\(x\\) dollars'), 'costs $5 and $x$ dollars');
  assert.equal(d('matrix \\(\\begin{pmatrix}1\\\\2\\end{pmatrix}\\)'), 'matrix $\\begin{pmatrix}1\\\\2\\end{pmatrix}$');
  assert.equal(d('interval \\([0, 1)\\)'), 'interval $[0, 1)$');
});

// ════════════════════════════════════════════════════════════════════════
// 8. mixed numbers
// ════════════════════════════════════════════════════════════════════════
console.log('\n8. mixed numbers\n');
await test('prompt: a numeric answer is "a decimal or a simple fraction, never a mixed number" — on every branch', async () => {
  process.env.PRACTICE_GEN = 'on';
  const prompts: string[] = [];
  const capture: PracticeGenSources = { async generateAndVerify(p) { prompts.push(p); return null; }, async reserve(_s, _l, n) { return n; }, async persist() {} };
  const anchor = { id: 'a1', source: 'bank' as const, problemText: 'Solve 2x = 3.', expectedAnswer: '3/2', responseFormat: 'numeric' as const, loId: LO };
  await generatePracticeItems(opts({ anchorItems: [anchor] }), capture);
  await generatePracticeItems(opts({ anchorItems: [] }), capture);
  await generatePracticeItems(opts({ anchorItems: [], authoredDrawingTasks: true, loTitle: 'Graph lines' }), capture);
  assert.ok(prompts.length >= 6);
  for (const p of prompts) assert.match(p, /a decimal or a simple\s+fraction \(for example "3\/2"\), never a mixed number/);
  delete process.env.PRACTICE_GEN;
  assert.equal(normalizeNumericAnswer('1 1/2'), null, 'a mixed number is never a key');
});

await sleep(50);
await test('no unhandled promise rejection anywhere in this file', () => {
  assert.deepEqual(unhandled, []);
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
})();

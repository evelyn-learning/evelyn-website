/**
 * Design B (generate-on-exhaustion), Task 3 — practice-gen.ts unit tests.
 *
 * `generatePracticeItems` is exercised two ways:
 *   - with an injected `PracticeGenSources` stub (no Anthropic, no Mongo) for
 *     the verify-gate / cap / kill-switch / anchor / parallel-failure logic;
 *   - against the REAL `practiceGenSources()` for the Mongo-facing pieces
 *     (cap math in `reserve`, persisted row shape in `persist`), with
 *     `connectDB` and the two Mongoose models monkeypatched — same idiom as
 *     `adapters.test.ts`'s `bankScope`/`brain-gen.*` filter tests: no live
 *     database, assertions on the call args the real code builds.
 *
 * Run: npm run test:practice-gen
 */
import { strict as assert } from 'node:assert';
import {
  generatePracticeItems,
  practiceGenSources,
  gateGeneratedAnswer,
  normalizeNumericAnswer,
  stripChoiceLetterPrefixes,
  pickAnchorsForSlots,
  MAX_GENERATIONS_PER_REQUEST,
  PER_STUDENT_LO_DAILY_CAP,
  GLOBAL_DAILY_CAP,
  type PracticeGenSources,
  type GeneratePracticeItemsOptions,
  type VerifyFn,
} from './practice-gen';
import type { GenPayload } from '../voice/problem-generator';
import type { PracticeItem } from '@evelyn/portal-contract/v1';
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

const LO = 'apstats.normal-distribution';
const TOPIC = 'ap-statistics';

function numericGen(text = 'Fresh problem text', answer = '42'): GenPayload {
  return { problemText: text, finalAnswer: answer, teachingAnswer: 'Because reasons.', responseFormat: 'numeric', hints: ['hint'] };
}
function mcqGen(): GenPayload {
  return { problemText: 'Which is correct?', finalAnswer: 'B', responseFormat: 'mcq', choices: ['wrong', 'right'] };
}

const bankAnchor: PracticeItem = {
  id: 'openstax.stats.0042',
  source: 'bank',
  problemText: 'Existing anchor problem',
  expectedAnswer: '0.84',
  responseFormat: 'mcq',
  difficulty: 2,
  loId: LO,
  cedCode: 'AP-STATS-1.10',
};
const bankAnchorHard: PracticeItem = { ...bankAnchor, id: 'openstax.stats.0099', difficulty: 4 };
// Same difficulty as `bankAnchor` but DIFFERENT `problemText` — `bankAnchor`/
// `bankAnchorHard` intentionally share problemText (they only need to differ
// by difficulty for the difficulty-preference tests), which makes them
// useless for asserting "the two slots anchored on different candidates" by
// substring-matching the prompt. This pair exists for that assertion.
const bankAnchorAlt: PracticeItem = { ...bankAnchor, id: 'openstax.stats.0055', problemText: 'Alternate anchor problem' };

/** Stub sources: records calls, generateAndVerify resolves the given payload
 *  (or null) for every call unless overridden per-call via `perCall`. */
function makeStubSources(opts: {
  gen?: GenPayload | null;
  perCall?: Array<GenPayload | null | 'reject'>;
  allowed?: number;
} = {}): PracticeGenSources & {
  prompts: string[];
  excludeHashesSeen: string[][];
  persisted: unknown[];
  reserveCalls: Array<{ studentId: string; loId: string; n: number }>;
} {
  const prompts: string[] = [];
  const excludeHashesSeen: string[][] = [];
  const persisted: unknown[] = [];
  const reserveCalls: Array<{ studentId: string; loId: string; n: number }> = [];
  let callIndex = 0;
  return {
    prompts,
    excludeHashesSeen,
    persisted,
    reserveCalls,
    async generateAndVerify(userPrompt: string, excludeHashes: string[]) {
      prompts.push(userPrompt);
      excludeHashesSeen.push(excludeHashes);
      const i = callIndex++;
      const spec = opts.perCall ? opts.perCall[i] : opts.gen;
      if (spec === 'reject') throw new Error('simulated generation failure');
      if (!spec) return null;
      return { gen: spec, hash: `hash-${i}` };
    },
    async reserve(studentId: string, loId: string, n: number) {
      reserveCalls.push({ studentId, loId, n });
      return opts.allowed ?? n;
    },
    async persist(row: unknown) {
      persisted.push(row);
    },
  };
}

function baseOpts(over: Partial<GeneratePracticeItemsOptions> = {}): GeneratePracticeItemsOptions {
  return {
    studentId: 'student-1',
    loId: LO,
    topic: TOPIC,
    shortfall: 1,
    anchorItems: [bankAnchor],
    ...over,
  };
}

test('strip: a single choice is never stripped (vacuous sequence guard)', () => {
  assert.deepEqual(stripChoiceLetterPrefixes(['(A) allele']), ['(A) allele']);
});

(async () => {
console.log('\npractice-gen — generate-on-exhaustion:\n');

// ── Kill-switch ──────────────────────────────────────────────────
await test('kill-switch OFF by default (env unset) — returns [] without touching sources', async () => {
  delete process.env.PRACTICE_GEN;
  const sources = makeStubSources({ gen: numericGen() });
  const items = await generatePracticeItems(baseOpts(), sources);
  assert.deepEqual(items, []);
  assert.equal(sources.reserveCalls.length, 0, 'must not even check caps when killed');
  assert.equal(sources.prompts.length, 0, 'must not call the generator when killed');
  assert.equal(sources.persisted.length, 0);
});

await test('kill-switch OFF for any value other than the literal "on"', async () => {
  process.env.PRACTICE_GEN = 'true';
  const sources = makeStubSources({ gen: numericGen() });
  const items = await generatePracticeItems(baseOpts(), sources);
  assert.deepEqual(items, []);
  delete process.env.PRACTICE_GEN;
});

await test('kill-switch ON (PRACTICE_GEN=on) — proceeds to generate', async () => {
  process.env.PRACTICE_GEN = 'on';
  const sources = makeStubSources({ gen: numericGen() });
  const items = await generatePracticeItems(baseOpts(), sources);
  assert.equal(items.length, 1);
  delete process.env.PRACTICE_GEN;
});

// ── Verify-gate ──────────────────────────────────────────────────
await test('verify-gate: unverified generation (null) is dropped, never persisted', async () => {
  process.env.PRACTICE_GEN = 'on';
  const sources = makeStubSources({ gen: null });
  const items = await generatePracticeItems(baseOpts(), sources);
  assert.deepEqual(items, []);
  assert.equal(sources.persisted.length, 0, 'unverified output must never be banked');
  delete process.env.PRACTICE_GEN;
});

// ── ≤2 cap ───────────────────────────────────────────────────────
await test('≤2 generations per request even when shortfall is larger', async () => {
  process.env.PRACTICE_GEN = 'on';
  const sources = makeStubSources({ gen: numericGen(), allowed: MAX_GENERATIONS_PER_REQUEST });
  const items = await generatePracticeItems(baseOpts({ shortfall: 5 }), sources);
  assert.equal(sources.reserveCalls[0].n, MAX_GENERATIONS_PER_REQUEST, 'reserve is asked for at most the cap, not the raw shortfall');
  assert.equal(items.length, MAX_GENERATIONS_PER_REQUEST);
  delete process.env.PRACTICE_GEN;
});

await test('shortfall of 1 requests only 1 generation slot', async () => {
  process.env.PRACTICE_GEN = 'on';
  const sources = makeStubSources({ gen: numericGen() });
  await generatePracticeItems(baseOpts({ shortfall: 1 }), sources);
  assert.equal(sources.reserveCalls[0].n, 1);
  delete process.env.PRACTICE_GEN;
});

// ── Caps deny ────────────────────────────────────────────────────
await test('over-cap (reserve grants 0) — returns [] silently, no generation attempted', async () => {
  process.env.PRACTICE_GEN = 'on';
  const sources = makeStubSources({ gen: numericGen(), allowed: 0 });
  const items = await generatePracticeItems(baseOpts({ shortfall: 2 }), sources);
  assert.deepEqual(items, []);
  assert.equal(sources.prompts.length, 0, 'no generation call when the cap grants zero slots');
  delete process.env.PRACTICE_GEN;
});

await test('partial cap grant (reserve grants fewer than requested) — generates only the granted count', async () => {
  process.env.PRACTICE_GEN = 'on';
  const sources = makeStubSources({ gen: numericGen(), allowed: 1 });
  const items = await generatePracticeItems(baseOpts({ shortfall: 2 }), sources);
  assert.equal(items.length, 1);
  delete process.env.PRACTICE_GEN;
});

// ── Real cap math (mongoReserve via practiceGenSources(), Mongo stubbed) ──
(dbModule as unknown as { default: () => Promise<void> }).default = async () => {};
const counterCalls: Array<{ op: 'findOne' | 'updateOne'; args: unknown[] }> = [];
function stubCounter(studentCount: number | null, globalCount: number | null): void {
  counterCalls.length = 0;
  (PracticeGenCounter as unknown as {
    findOne: (filter: Record<string, unknown>) => { lean: () => Promise<{ count: number } | null> };
  }).findOne = (filter) => {
    counterCalls.push({ op: 'findOne', args: [filter] });
    const isGlobal = filter.scopeKey === 'global';
    const count = isGlobal ? globalCount : studentCount;
    return { lean: async () => (count === null ? null : { count }) };
  };
  (PracticeGenCounter as unknown as {
    updateOne: (filter: Record<string, unknown>, update: Record<string, unknown>, opts: Record<string, unknown>) => Promise<unknown>;
  }).updateOne = (filter, update, opts) => {
    counterCalls.push({ op: 'updateOne', args: [filter, update, opts] });
    return Promise.resolve({});
  };
}

await test(`real cap: per-(student,LO) daily cap ${PER_STUDENT_LO_DAILY_CAP} denies at the limit`, async () => {
  stubCounter(PER_STUDENT_LO_DAILY_CAP, 0);
  const allowed = await practiceGenSources().reserve('student-1', LO, 1);
  assert.equal(allowed, 0, 'at-cap student count must deny further generation');
  assert.ok(!counterCalls.some((c) => c.op === 'updateOne'), 'no increment when denied');
});

await test(`real cap: global daily cap ${GLOBAL_DAILY_CAP} denies at the limit`, async () => {
  stubCounter(0, GLOBAL_DAILY_CAP);
  const allowed = await practiceGenSources().reserve('student-1', LO, 1);
  assert.equal(allowed, 0, 'at-cap global count must deny further generation');
});

await test('real cap: partial room on both caps grants the smaller remaining room', async () => {
  stubCounter(PER_STUDENT_LO_DAILY_CAP - 1, GLOBAL_DAILY_CAP - 10);
  const allowed = await practiceGenSources().reserve('student-1', LO, 2);
  assert.equal(allowed, 1, 'student room (1) is the binding constraint');
});

await test('real cap: fresh student/LO with no counter docs yet grants the full request', async () => {
  stubCounter(null, null);
  const allowed = await practiceGenSources().reserve('student-1', LO, 2);
  assert.equal(allowed, 2);
});

// ── Persisted row shape (real mongoPersist via practiceGenSources()) ──
type CapturedUpdate = { filter: Record<string, unknown>; update: { $setOnInsert: Record<string, unknown> } };
let capturedPersist: CapturedUpdate | null = null;
(ProblemBank as unknown as {
  updateOne: (filter: Record<string, unknown>, update: unknown, opts: unknown) => Promise<unknown>;
}).updateOne = (filter, update) => {
  capturedPersist = { filter, update: update as CapturedUpdate['update'] };
  return Promise.resolve({});
};

await test('generated item shape: id prefix, letter mcq answer, internal-original license, no plan scoping, topicId set', async () => {
  capturedPersist = null;
  await practiceGenSources().persist({
    id: `practice-gen.${LO}.abc123`,
    topic: TOPIC,
    topicId: TOPIC,
    loId: LO,
    cedCode: 'AP-STATS-1.10',
    difficulty: 3,
    gen: mcqGen(),
  });
  const cp = capturedPersist as CapturedUpdate | null;
  assert.ok(cp, 'expected ProblemBank.updateOne to be called');
  const row = cp!.update.$setOnInsert;
  assert.equal(row.id, `practice-gen.${LO}.abc123`);
  assert.ok(String(row.id).startsWith('practice-gen.'), 'id carries the practice-gen. prefix');
  assert.equal(row.answer, 'B', 'mcq answer stored as the bare letter');
  assert.equal(row.license, 'internal-original');
  assert.equal(row.loId, LO);
  assert.equal(row.topic, TOPIC);
  assert.equal(row.topicId, TOPIC, 'topicId set so bankForTopic\'s {topic}/{topicId} OR match finds this row');
  assert.equal(row.cedCode, 'AP-STATS-1.10');
  assert.equal(row.difficulty, 3);
  assert.ok(!('subtopic' in row), 'practice-gen rows carry no plan scoping (no subtopic)');
});

await test('generated item shape end-to-end: numeric answer stays a plain number string', async () => {
  process.env.PRACTICE_GEN = 'on';
  const sources = makeStubSources({ gen: numericGen('Solve for x.', '17') });
  const items = await generatePracticeItems(baseOpts(), sources);
  assert.equal(items.length, 1);
  assert.ok(items[0].id.startsWith(`practice-gen.${LO}.`));
  assert.equal(items[0].expectedAnswer, '17');
  assert.equal(items[0].responseFormat, 'numeric');
  assert.equal(items[0].loId, LO);
  delete process.env.PRACTICE_GEN;
});

await test('generated item shape end-to-end: mcq answer stays the bare letter', async () => {
  process.env.PRACTICE_GEN = 'on';
  const sources = makeStubSources({ gen: mcqGen() });
  const items = await generatePracticeItems(baseOpts(), sources);
  assert.equal(items[0].expectedAnswer, 'B');
  assert.equal(items[0].responseFormat, 'mcq');
  assert.deepEqual(items[0].choices, [{ id: 'A', text: 'wrong' }, { id: 'B', text: 'right' }]);
  delete process.env.PRACTICE_GEN;
});

// ── Anchor selection ─────────────────────────────────────────────
await test('anchor: same-difficulty item is preferred when present', async () => {
  process.env.PRACTICE_GEN = 'on';
  const sources = makeStubSources({ gen: numericGen() });
  await generatePracticeItems(baseOpts({ difficulty: 4, anchorItems: [bankAnchor, bankAnchorHard] }), sources);
  assert.ok(sources.prompts[0].includes(bankAnchorHard.problemText), 'anchor at the target difficulty (4) chosen');
  assert.ok(!sources.prompts[0].includes('brand-new LO'));
  delete process.env.PRACTICE_GEN;
});

await test('anchor: falls back to any same-LO item when none match the target difficulty', async () => {
  process.env.PRACTICE_GEN = 'on';
  const sources = makeStubSources({ gen: numericGen() });
  await generatePracticeItems(baseOpts({ difficulty: 1, anchorItems: [bankAnchor, bankAnchorHard] }), sources);
  const usedAnAnchor = sources.prompts[0].includes(bankAnchor.problemText) || sources.prompts[0].includes(bankAnchorHard.problemText);
  assert.ok(usedAnAnchor, 'falls back to SOME same-LO item rather than the fresh-LO branch');
  delete process.env.PRACTICE_GEN;
});

await test('anchor: fresh LO with zero existing items generates from the LO id + topic alone', async () => {
  process.env.PRACTICE_GEN = 'on';
  const sources = makeStubSources({ gen: numericGen() });
  const items = await generatePracticeItems(baseOpts({ anchorItems: [], difficulty: undefined }), sources);
  assert.ok(sources.prompts[0].includes(LO), 'prompt names the LO id');
  assert.ok(sources.prompts[0].includes(TOPIC), 'prompt names the topic');
  assert.ok(/no existing practice|brand-new LO/i.test(sources.prompts[0]), 'prompt signals the no-anchor edge case');
  assert.equal(items.length, 1, 'generation still succeeds with no anchor');
  assert.equal(items[0].difficulty, 2, 'falls back to the default difficulty bucket');
  delete process.env.PRACTICE_GEN;
});

// ── Per-slot anchor variety (production defect 2026-08-01: two parallel
// generations from the SAME anchor + prompt came back as the same template
// with swapped numbers, e.g. LO geom.angles-and-measure) ───────────────
console.log('\nper-slot anchor + prompt variety:\n');

await test('pickAnchorsForSlots: pool of 0 (fresh LO) returns null for every slot', () => {
  assert.deepEqual(pickAnchorsForSlots([], 2), [null, null]);
});

await test('pickAnchorsForSlots: pool of exactly 1 falls back to that same anchor for every slot (no crash)', () => {
  assert.deepEqual(pickAnchorsForSlots([bankAnchor], 2), [bankAnchor, bankAnchor]);
});

await test('pickAnchorsForSlots: pool of >=2 assigns DISTINCT anchors per slot, deterministically under an injected rng', () => {
  const a = pickAnchorsForSlots([bankAnchor, bankAnchorHard], 2, undefined, () => 0.9);
  const b = pickAnchorsForSlots([bankAnchor, bankAnchorHard], 2, undefined, () => 0.9);
  assert.deepEqual(a, b, 'same injected rng sequence -> same anchor assignment (seedable/deterministic)');
  assert.notEqual(a[0], a[1], 'the two slots got distinct anchors, not the same one twice');
});

await test('vary: with >=2 anchor candidates in the pool, the two parallel slots receive DIFFERENT anchors', async () => {
  process.env.PRACTICE_GEN = 'on';
  const sources = makeStubSources({ gen: numericGen(), allowed: 2 });
  await generatePracticeItems(baseOpts({ shortfall: 2, anchorItems: [bankAnchor, bankAnchorAlt] }), sources);
  assert.equal(sources.prompts.length, 2);
  const slot0UsesBank = sources.prompts[0].includes(bankAnchor.problemText);
  const slot0UsesAlt = sources.prompts[0].includes(bankAnchorAlt.problemText);
  const slot1UsesBank = sources.prompts[1].includes(bankAnchor.problemText);
  const slot1UsesAlt = sources.prompts[1].includes(bankAnchorAlt.problemText);
  assert.ok(slot0UsesBank !== slot0UsesAlt, 'slot 0 anchors on exactly one candidate');
  assert.ok(slot1UsesBank !== slot1UsesAlt, 'slot 1 anchors on exactly one candidate');
  assert.notEqual(slot0UsesBank, slot1UsesBank, 'the two slots must NOT anchor on the same candidate — this is the production defect (identical anchor -> near-identical siblings)');
  delete process.env.PRACTICE_GEN;
});

await test('vary: with exactly 1 anchor candidate, both slots still generate successfully (fallback anchor, no crash)', async () => {
  process.env.PRACTICE_GEN = 'on';
  const sources = makeStubSources({ gen: numericGen(), allowed: 2 });
  const items = await generatePracticeItems(baseOpts({ shortfall: 2, anchorItems: [bankAnchor] }), sources);
  assert.equal(items.length, 2, 'a single anchor candidate must not reduce the two parallel generations to fewer/zero');
  assert.ok(sources.prompts[0].includes(bankAnchor.problemText));
  assert.ok(sources.prompts[1].includes(bankAnchor.problemText));
  delete process.env.PRACTICE_GEN;
});

await test('vary: per-slot directive text differs between slots, even anchored on the SAME candidate', async () => {
  process.env.PRACTICE_GEN = 'on';
  const sources = makeStubSources({ gen: numericGen(), allowed: 2 });
  await generatePracticeItems(baseOpts({ shortfall: 2, anchorItems: [bankAnchor] }), sources);
  assert.notEqual(sources.prompts[0], sources.prompts[1], 'identical anchor must not produce byte-identical prompts across slots — the per-slot directive must differ');
  delete process.env.PRACTICE_GEN;
});

// ── Parallel generation, partial failure ────────────────────────
await test('parallel: one generation rejecting still returns the other verified item', async () => {
  process.env.PRACTICE_GEN = 'on';
  const sources = makeStubSources({ perCall: ['reject', numericGen('Second problem', '9')], allowed: 2 });
  const items = await generatePracticeItems(baseOpts({ shortfall: 2 }), sources);
  assert.equal(items.length, 1, 'a rejected generation degrades to fewer items, not an error');
  assert.equal(items[0].expectedAnswer, '9');
  delete process.env.PRACTICE_GEN;
});

await test('parallel: one generation returning null (unverified) still returns the other', async () => {
  process.env.PRACTICE_GEN = 'on';
  const sources = makeStubSources({ perCall: [null, numericGen('Second problem', '9')], allowed: 2 });
  const items = await generatePracticeItems(baseOpts({ shortfall: 2 }), sources);
  assert.equal(items.length, 1);
  delete process.env.PRACTICE_GEN;
});

// ── Excludes forwarded to generation (finding #4) ───────────────
await test('anchor-pool text hashes are forwarded as excludeHashes to every parallel generation', async () => {
  process.env.PRACTICE_GEN = 'on';
  const sources = makeStubSources({ gen: numericGen(), allowed: 2 });
  await generatePracticeItems(baseOpts({ shortfall: 2, anchorItems: [bankAnchor, bankAnchorHard] }), sources);
  assert.equal(sources.excludeHashesSeen.length, 2, 'both parallel calls received an excludeHashes list');
  for (const seen of sources.excludeHashesSeen) {
    assert.equal(seen.length, 2, 'seeded with both anchor items\' text hashes');
  }
  delete process.env.PRACTICE_GEN;
});

// ── In-batch duplicate-id dedup (finding #4) ────────────────────
await test('two parallel generations landing on the identical hash/id collapse to one item, not a duplicate', async () => {
  process.env.PRACTICE_GEN = 'on';
  // Both parallel slots resolve to the SAME gen+hash (as if two concurrent
  // generations happened to land on identical content) — the stub ignores
  // callIndex and always returns hash "dup".
  const sources: PracticeGenSources & { calls: number } = {
    calls: 0,
    async generateAndVerify() {
      this.calls++;
      return { gen: numericGen('Same problem both times', '5'), hash: 'dup' };
    },
    async reserve() {
      return 2;
    },
    async persist() {
      /* no-op */
    },
  };
  const items = await generatePracticeItems(baseOpts({ shortfall: 2 }), sources);
  assert.equal(sources.calls, 2, 'both generations were attempted');
  assert.equal(items.length, 1, 'the duplicate id is dropped, not returned twice');
  assert.equal(items[0].id, `practice-gen.${LO}.dup`);
  delete process.env.PRACTICE_GEN;
});

// ── Answer-shape gate (round-1 review CRITICAL fix) ─────────────
// Real-bank audit: 422/422 numeric answers are plain numbers, 2469/2469 mcq
// answers are bare A-E; the portal grader does `Number(answer)` — an
// unnormalized unit-suffixed answer ("48 square inches") silently grades
// NaN, permanently wrong for every student who sees the item. These tests
// exercise `gateGeneratedAnswer` directly with an injected `VerifyFn` stub —
// no Anthropic — the "non-pass-through" coverage the review asked for.
console.log('\nanswer-shape gate:\n');

function agreeVerify(solved = 'irrelevant — agree unconditionally'): VerifyFn {
  return async () => ({ agree: true, solved });
}
function disagreeVerify(): VerifyFn {
  return async () => ({ agree: false, solved: 'wrong' });
}

await test('normalizeNumericAnswer: already-plain numbers pass through unchanged', () => {
  assert.equal(normalizeNumericAnswer('48'), '48');
  assert.equal(normalizeNumericAnswer('-7.5'), '-7.5');
});

await test('normalizeNumericAnswer: unambiguous unit suffix is normalized ("48 square inches" -> "48")', () => {
  assert.equal(normalizeNumericAnswer('48 square inches'), '48');
});

await test('normalizeNumericAnswer: currency/comma-thousands normalize to plain numbers', () => {
  assert.equal(normalizeNumericAnswer('$4.50'), '4.5');
  assert.equal(normalizeNumericAnswer('300,000 J'), '300000');
});

// Round-2 review CRITICAL fix: the portal grader's parseNum (PracticeView.tsx)
// strips a trailing '%' WITHOUT rescaling, unlike extractAnswerNumber (which
// divides by 100 for the tutor's answersAgree). A banked "0.5" would grade a
// student's correct "50" as permanently wrong — the bank-safe form keeps the
// bare numeral.
await test('normalizeNumericAnswer: percent keeps the bare numeral, does NOT divide by 100 ("50%" -> "50")', () => {
  assert.equal(normalizeNumericAnswer('50%'), '50');
  assert.equal(normalizeNumericAnswer('12.5%'), '12.5');
  assert.equal(normalizeNumericAnswer('-3%'), '-3');
});

// Round-3 review fix: the round-2 percent case only matched an EXACT
// "<number>%" string — prose-wrapped percents ("approximately 50%", "a 40%
// discount") were still falling through to extractAnswerNumber's /100
// scaling and banking "0.5"/"0.4".
await test('normalizeNumericAnswer: prose-wrapped percents still keep the bare numeral, not the /100 form', () => {
  assert.equal(normalizeNumericAnswer('approximately 50%'), '50');
  assert.equal(normalizeNumericAnswer('a 40% discount'), '40');
});

await test('normalizeNumericAnswer: a leading-dot percent gets the leading zero, still unscaled (".5%" -> "0.5")', () => {
  assert.equal(normalizeNumericAnswer('.5%'), '0.5');
});

await test('normalizeNumericAnswer: a multi-run percent string is still rejected as ambiguous', () => {
  assert.equal(normalizeNumericAnswer('between 30% and 50%'), null);
});

await test('normalizeNumericAnswer: ambiguous multi-number strings are rejected, not guessed', () => {
  assert.equal(normalizeNumericAnswer('between 3 and 5'), null);
  assert.equal(normalizeNumericAnswer('3 apples and 5 oranges'), null);
});

await test('normalizeNumericAnswer: no number at all is rejected', () => {
  assert.equal(normalizeNumericAnswer('competitive inhibition'), null);
});

await test('gate: numeric "48 square inches" is normalized to "48" and passes when verify agrees', async () => {
  const out = await gateGeneratedAnswer(numericGen('Area problem', '48 square inches'), agreeVerify());
  assert.ok(out, 'expected the gate to accept a normalizable answer');
  assert.equal(out!.finalAnswer, '48', 'stored/served answer is the bare number, not the unit-suffixed text');
});

await test('gate: ambiguous numeric answer is rejected even if a blind verify would agree', async () => {
  const out = await gateGeneratedAnswer(numericGen('Range problem', 'between 3 and 5'), agreeVerify());
  assert.equal(out, null, 'ambiguous shape is rejected before verification is even meaningful');
});

await test('gate: numeric answer failing independent verify is rejected', async () => {
  const out = await gateGeneratedAnswer(numericGen('Solve for x', '42'), disagreeVerify());
  assert.equal(out, null);
});

await test('gate: percent "50%" is stored as the bare numeral "50", but VERIFIED against the ORIGINAL "50%"', async () => {
  let receivedClaim: string | undefined;
  const verify: VerifyFn = async (_problemText, claimed) => {
    receivedClaim = claimed;
    return { agree: true, solved: '50%' };
  };
  const out = await gateGeneratedAnswer(numericGen('What percent?', '50%'), verify);
  assert.ok(out, 'expected the gate to accept the percent answer');
  assert.equal(out!.finalAnswer, '50', 'stored/served answer is the bare numeral, not "0.5"');
  assert.equal(receivedClaim, '50%', 'verify must see the ORIGINAL claim so extractAnswerNumber scales both sides consistently — verifying with the bank-safe "50" instead would spuriously disagree against a solve of "50%" (50 vs 0.5)');
});

await test('gate: mcq bare-letter claim is verified CHOICES-AWARE (verify receives the choices)', async () => {
  let receivedChoices: Array<{ letter: string; text: string }> | undefined;
  const verify: VerifyFn = async (_problemText, _claimed, choices) => {
    receivedChoices = choices;
    return { agree: true, solved: 'B' };
  };
  const out = await gateGeneratedAnswer(mcqGen(), verify);
  assert.ok(out);
  assert.equal(out!.finalAnswer, 'B');
  assert.deepEqual(receivedChoices, [{ letter: 'A', text: 'wrong' }, { letter: 'B', text: 'right' }], 'verify must see the actual choices, not a blind solve');
});

await test('gate: mcq claim given as CHOICE TEXT instead of a letter resolves via the choices', async () => {
  const gen: GenPayload = { problemText: 'Which is correct?', finalAnswer: 'right', responseFormat: 'mcq', choices: ['wrong', 'right'] };
  const out = await gateGeneratedAnswer(gen, agreeVerify());
  assert.ok(out, 'expected the gate to resolve choice-text to a letter');
  assert.equal(out!.finalAnswer, 'B', 'stored/served answer is the bare letter, resolved via the choices');
});

await test('gate: mcq claim that matches no choice text and no letter shape is rejected', async () => {
  const gen: GenPayload = { problemText: 'Which is correct?', finalAnswer: 'neither of these', responseFormat: 'mcq', choices: ['wrong', 'right'] };
  const out = await gateGeneratedAnswer(gen, agreeVerify());
  assert.equal(out, null, 'unresolvable claim must be rejected, not guessed');
});

await test('gate: mcq with no choices at all is rejected (malformed payload)', async () => {
  const gen: GenPayload = { problemText: 'Which is correct?', finalAnswer: 'B', responseFormat: 'mcq', choices: [] };
  const out = await gateGeneratedAnswer(gen, agreeVerify());
  assert.equal(out, null);
});

// Round-2 review IMPORTANT fix: resolveMcqLetter's direct-letter branch
// accepts any A-E shape without checking it indexes into THIS problem's
// choices — a 4-choice mcq (A-D) with a claimed "E" would otherwise bank an
// out-of-bounds letter the portal could never match to a real choice.
await test('gate: mcq claim "E" with only 4 choices (A-D) is rejected as out-of-bounds', async () => {
  const gen: GenPayload = {
    problemText: 'Which is correct?',
    finalAnswer: 'E',
    responseFormat: 'mcq',
    choices: ['first', 'second', 'third', 'fourth'],
  };
  const out = await gateGeneratedAnswer(gen, agreeVerify());
  assert.equal(out, null, 'a letter beyond the actual choice count must be rejected, not banked');
});

await test('gate: mcq claim "D" IS accepted with exactly 4 choices (A-D) — bounds check is inclusive, not off-by-one', async () => {
  const gen: GenPayload = {
    problemText: 'Which is correct?',
    finalAnswer: 'D',
    responseFormat: 'mcq',
    choices: ['first', 'second', 'third', 'fourth'],
  };
  const out = await gateGeneratedAnswer(gen, agreeVerify());
  assert.ok(out, 'the LAST valid choice letter must still be accepted');
  assert.equal(out!.finalAnswer, 'D');
});

await test('gate: mcq resolved letter failing choices-aware verify is rejected', async () => {
  const out = await gateGeneratedAnswer(mcqGen(), disagreeVerify());
  assert.equal(out, null);
});

// ── Baked-in choice-letter prefix strip (production defect: real generation
// returned choices ["A) 2","B) 10/3","C) 5","D) 19/3"] — the portal renders
// its own A/B/C/D labels next to each choice, so students saw a doubled
// label, "B. B) 10/3". 1-of-3 real generations observed with the defect. ──
console.log('\nbaked-in choice-letter prefix strip:\n');

await test('stripChoiceLetterPrefixes: all choices prefixed "X) " and sequential from A are stripped', () => {
  const out = stripChoiceLetterPrefixes(['A) 2', 'B) 10/3', 'C) 5', 'D) 19/3']);
  assert.deepEqual(out, ['2', '10/3', '5', '19/3']);
});

await test('stripChoiceLetterPrefixes: recognizes ". : ( ) -" prefix styles, mixed across choices', () => {
  const out = stripChoiceLetterPrefixes(['A. 2', 'B: 10/3', '(C) 5', 'D - 19/3']);
  assert.deepEqual(out, ['2', '10/3', '5', '19/3']);
});

await test('stripChoiceLetterPrefixes: is case-insensitive', () => {
  const out = stripChoiceLetterPrefixes(['a) 2', 'b) 10/3', 'c) 5', 'd) 19/3']);
  assert.deepEqual(out, ['2', '10/3', '5', '19/3']);
});

await test('stripChoiceLetterPrefixes: partial match (only 2 of 4 prefixed) leaves ALL choices untouched', () => {
  const original = ['A) 2', 'B) 10/3', '5', '19/3'];
  const out = stripChoiceLetterPrefixes(original);
  assert.deepEqual(out, original, 'a partial match must not strip anything, even the choices that DO match');
});

await test('stripChoiceLetterPrefixes: non-sequential letters (A, B, D, C order) leave everything untouched', () => {
  const original = ['A) 2', 'B) 10/3', 'D) 5', 'C) 19/3'];
  const out = stripChoiceLetterPrefixes(original);
  assert.deepEqual(out, original);
});

await test('stripChoiceLetterPrefixes: repeated letters (A, A, B, C) leave everything untouched', () => {
  const original = ['A) 2', 'A) 10/3', 'B) 5', 'C) 19/3'];
  const out = stripChoiceLetterPrefixes(original);
  assert.deepEqual(out, original);
});

await test('stripChoiceLetterPrefixes: a choice with no letter-prefix shape at all leaves everything untouched', () => {
  const original = ['wrong', 'right'];
  const out = stripChoiceLetterPrefixes(original);
  assert.deepEqual(out, original);
});

await test('gate: all-prefixed mcq choices are stripped, answer letter preserved and still valid', async () => {
  const gen: GenPayload = {
    problemText: 'Solve for x.',
    finalAnswer: 'D',
    responseFormat: 'mcq',
    choices: ['A) 2', 'B) 10/3', 'C) 5', 'D) 19/3'],
  };
  const out = await gateGeneratedAnswer(gen, agreeVerify());
  assert.ok(out, 'expected the gate to accept the stripped mcq');
  assert.equal(out!.finalAnswer, 'D', 'answer letter is unaffected by text stripping');
  assert.deepEqual(out!.choices, ['2', '10/3', '5', '19/3'], 'stored/served choices have the baked-in prefixes removed');
});

await test('gate: partially-prefixed mcq choices are served UNCHANGED (no strip)', async () => {
  const gen: GenPayload = {
    problemText: 'Solve for x.',
    finalAnswer: 'A',
    responseFormat: 'mcq',
    choices: ['A) 2', 'B) 10/3', '5', '19/3'],
  };
  const out = await gateGeneratedAnswer(gen, agreeVerify());
  assert.ok(out, 'a partial-prefix match is not itself a rejection reason');
  assert.deepEqual(out!.choices, ['A) 2', 'B) 10/3', '5', '19/3'], 'left untouched — never strip on a partial match');
});

await test('gate: non-sequential letter-prefixed mcq choices are served UNCHANGED (no strip)', async () => {
  const gen: GenPayload = {
    problemText: 'Solve for x.',
    finalAnswer: 'A',
    responseFormat: 'mcq',
    choices: ['A) 2', 'B) 10/3', 'D) 5', 'C) 19/3'],
  };
  const out = await gateGeneratedAnswer(gen, agreeVerify());
  assert.ok(out);
  assert.deepEqual(out!.choices, ['A) 2', 'B) 10/3', 'D) 5', 'C) 19/3']);
});

await test('gate: a prefix-only choice ("A) ") strips to empty and REJECTS the whole generation', async () => {
  const gen: GenPayload = {
    problemText: 'Solve for x.',
    finalAnswer: 'B',
    responseFormat: 'mcq',
    choices: ['A) ', 'B) 10/3', 'C) 5', 'D) 19/3'],
  };
  const out = await gateGeneratedAnswer(gen, agreeVerify());
  assert.equal(out, null, 'a choice that strips to empty must reject the whole generation, never serve mangled/blank text');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
})();


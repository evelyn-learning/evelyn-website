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
import { createHash } from 'node:crypto';
import {
  generatePracticeItems,
  practiceGenSources,
  gateGeneratedAnswer,
  normalizeNumericAnswer,
  stripChoiceLetterPrefixes,
  pickAnchorsForSlots,
  usableAnchor,
  checkGeneratedAnswer,
  DRAWING_ANCHOR_RE,
  isDrawingInstruction,
  isDrawingOnlyItem,
  MAX_GENERATIONS_PER_REQUEST,
  PER_STUDENT_LO_DAILY_CAP,
  GLOBAL_DAILY_CAP,
  type PracticeGenSources,
  type GeneratePracticeItemsOptions,
  type VerifyFn,
  type KeyVerifyFn,
  UNVERIFIED_MODEL,
} from './practice-gen';
import * as problemGeneratorModule from '../voice/problem-generator';
import { gradeNumericAnswer } from './numeric-answer-rule';
import { nearDuplicateReason, findNearDuplicate, normalizeItemText } from './practice-similarity';
import * as practiceGenModule from './practice-gen';
import * as keyVerifyModule from './key-verify';
import type { GenPayload } from '../voice/problem-generator';
import type { PracticeItem } from '@evelyn/portal-contract/v1';
import { ProblemBank } from '@/models/ProblemBank';
import { PracticeGenCounter } from '@/models/PracticeGenCounter';
import * as dbModule from '@core/db';
import { retrievePractice, loHasDrawingOnlyTask, type PracticeSources, type PlanLite } from './practice';
import { buildAssessment } from './assessment';
import { NO_GEN_SOURCES } from '@/lib/tutor/practice-assign/resolve';

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
  // Two DIFFERENT items: identical siblings are now dropped as near-duplicates.
  const sources = makeStubSources({ perCall: [numericGen('A tank holds 40 litres and drains 5 litres per minute. How many minutes until it is empty?', '8'), numericGen('Find the 9th term of the sequence that starts at 4 and rises by 3 each time.', '28')], allowed: MAX_GENERATIONS_PER_REQUEST });
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
  // The ANCHOR is the text right under the "ANCHOR problem" line (both texts
  // also appear lower down, in the do-not-repeat list — 2026-10-05).
  const anchorOf = (prompt: string) => prompt.split('\n')[1];
  const slot0UsesBank = anchorOf(sources.prompts[0]) === bankAnchor.problemText;
  const slot0UsesAlt = anchorOf(sources.prompts[0]) === bankAnchorAlt.problemText;
  const slot1UsesBank = anchorOf(sources.prompts[1]) === bankAnchor.problemText;
  const slot1UsesAlt = anchorOf(sources.prompts[1]) === bankAnchorAlt.problemText;
  assert.ok(slot0UsesBank !== slot0UsesAlt, 'slot 0 anchors on exactly one candidate');
  assert.ok(slot1UsesBank !== slot1UsesAlt, 'slot 1 anchors on exactly one candidate');
  assert.notEqual(slot0UsesBank, slot1UsesBank, 'the two slots must NOT anchor on the same candidate — this is the production defect (identical anchor -> near-identical siblings)');
  delete process.env.PRACTICE_GEN;
});

await test('vary: with exactly 1 anchor candidate, both slots still generate successfully (fallback anchor, no crash)', async () => {
  process.env.PRACTICE_GEN = 'on';
  const sources = makeStubSources({ perCall: [numericGen('A tank holds 40 litres and drains 5 litres per minute. How many minutes until it is empty?', '8'), numericGen('Find the 9th term of the sequence that starts at 4 and rises by 3 each time.', '28')], allowed: 2 });
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

// ── Drawing/graphing anchors + visible empty outcomes (2026-10-02) ──
// Observed 2026-10-02: "Graph y = 2x + 3 and mark where it crosses both
// axes" as the anchor produced zero usable items — the generator copied the
// drawing task and every candidate failed the typed-answer gate.
console.log('\ndrawing anchors + debug events:\n');

const drawingAnchor: PracticeItem = { ...bankAnchor, id: 'plan.graph-1', problemText: 'Graph y = 2x + 3 and mark where it crosses both axes.' };

await test('usableAnchor: drawing/graphing anchors become null', () => {
  for (const text of [
    'Graph y = 2x + 3 and mark where it crosses both axes.',
    'Draw a labeled free-body diagram for the block on the incline.',
    'Plot the points (1, 2) and (3, 4).',
    'Sketch the parabola y = x^2 - 4.',
    'Shade the region where y > 2x.',
    'Label the diagram with the forces acting on the box.',
    'Graphing: graph y=2x+3',
    'Solve for the intercepts, then graph the line.',
    'Find the vertex and sketch the curve.',
    'Please plot these data points.',
    '(a) Draw the triangle ABC.',
  ]) {
    assert.equal(usableAnchor({ ...bankAnchor, problemText: text }), null, text);
    assert.ok(DRAWING_ANCHOR_RE.test(text), text);
  }
});

await test('usableAnchor: typed-answer anchors are kept as-is; null stays null', () => {
  for (const text of [
    'Solve 2x + 3 = 7',
    'Find the x-intercept of y = 2x + 3',
    'The graph of f(x) passes through (1,2); find f(3)',
    'A scatter plot shows the data below. What is the slope of the trend line?',
    'The shaded region has what area?',
  ]) {
    const a = { ...bankAnchor, problemText: text };
    assert.equal(usableAnchor(a), a, text);
  }
  assert.equal(usableAnchor(null), null);
});

await test('a drawing anchor builds the skill-only (no-anchor) prompt', async () => {
  process.env.PRACTICE_GEN = 'on';
  const sources = makeStubSources({ gen: numericGen() });
  await generatePracticeItems(baseOpts({ anchorItems: [drawingAnchor] }), sources);
  assert.equal(sources.prompts.length, 1);
  assert.ok(!sources.prompts[0].includes(drawingAnchor.problemText), 'the drawing anchor text must not reach the prompt');
  assert.ok(!sources.prompts[0].includes('ANCHOR problem'), 'no anchor branch');
  // 2026-10-04: the skill-only branch for a drawing LO is the drawing-LO
  // prompt — it no longer claims the LO is brand-new.
  assert.ok(!/brand-new LO|no existing practice/i.test(sources.prompts[0]), 'not the brand-new-LO prompt');
  assert.ok(/existing practice tasks .* are drawing tasks/i.test(sources.prompts[0]), 'drawing-LO branch');
  assert.ok(sources.prompts[0].includes(LO));
  delete process.env.PRACTICE_GEN;
});

// ── Drawing LO → typed/choice practice (2026-10-04) ──────────────────────────
// Live: a graphing LO marked Needs Support got no practice. Its only
// try-yourself was a drawing task (dropped before it could be an anchor), so
// the generator got the brand-new-LO prompt and returned nothing usable
// (`no_candidate` ×4, `practice_gen_empty`).
const sha256 = (t: string): string => createHash('sha256').update(t).digest('hex');

/** The drawing-LO prompt's own instruction (everything before the shared
 *  answer-format clauses, which legitimately say "never ask them to draw"). */
function drawingLoInstruction(prompt: string): string {
  const cut = prompt.indexOf('If the correct answer to your problem is a percentage');
  assert.ok(cut > 0, 'shared clauses follow the instruction');
  return prompt.slice(0, cut);
}

await test('drawing LO (flag from the caller, no anchors): the prompt asks for a typed/choice question on the same skill', async () => {
  process.env.PRACTICE_GEN = 'on';
  const sources = makeStubSources({ gen: numericGen() });
  await generatePracticeItems(
    baseOpts({ loId: 'gen-9.lo-2', topic: 'A topic', anchorItems: [], authoredDrawingTasks: true, loTitle: 'An LO  title\nover two lines', shortfall: 2 }),
    sources,
  );
  assert.equal(sources.prompts.length, 2);
  for (const p of sources.prompts) {
    assert.ok(/existing practice tasks .* are drawing tasks/i.test(p), p);
    assert.ok(!/brand-new LO|no existing practice/i.test(p), 'never claims the LO is new');
    assert.ok(/answered by typing or choosing/i.test(p), 'asks for a typed/choice form');
    assert.ok(/SAME skill/.test(p), 'same skill');
    assert.ok(/interpret or\s+describe/i.test(p) && /decide a property/i.test(p) && /give a value/i.test(p), 'names the three typed forms');
    assert.ok(/Do NOT ask the student to draw, sketch, graph, plot, shade or\s+label/i.test(p), 'the no-drawing rule');
    assert.ok(p.includes('gen-9.lo-2') && p.includes('(topic: A topic)'));
    assert.ok(p.includes('Learning objective: An LO title over two lines\n'), 'title on one line');
    assert.ok(p.includes('"answerKind"') && p.includes('as a percent'), 'shared answer clauses kept');
    assert.ok(/JSON object only/.test(p));
  }
  assert.notEqual(sources.prompts[0], sources.prompts[1], 'per-slot directive still differs');
  delete process.env.PRACTICE_GEN;
});

await test('drawing LO: the instruction is structural — no subject or topic word of its own', async () => {
  process.env.PRACTICE_GEN = 'on';
  const run = async (loId: string, topic: string) => {
    const sources = makeStubSources({ gen: numericGen() });
    await generatePracticeItems(baseOpts({ loId, topic, anchorItems: [], authoredDrawingTasks: true, shortfall: 1 }), sources);
    return sources.prompts[0];
  };
  const a = await run('LO_A', 'TOPIC_A');
  const b = await run('LO_B', 'TOPIC_B');
  // Identical apart from the LO id and topic that were passed in.
  assert.equal(a.replace('LO_A', '@').replace('TOPIC_A', '#'), b.replace('LO_B', '@').replace('TOPIC_B', '#'));
  // And nothing in the instruction names a subject (the live LO was linear
  // inequalities; a force diagram or a Lewis structure must read the same).
  assert.ok(!/inequalit|linear|slope|intercept|axis|axes|coordinate|dashed|solid|force|molecul|triangle|angle/i.test(drawingLoInstruction(a)), drawingLoInstruction(a));
  assert.ok(!a.includes('Learning objective: '), 'no title line when none was given');
  delete process.env.PRACTICE_GEN;
});

await test('drawing LO (a drawing anchor in the pool, no flag): same branch; the drawing text and loTitle rules hold', async () => {
  process.env.PRACTICE_GEN = 'on';
  const sources = makeStubSources({ gen: numericGen() });
  await generatePracticeItems(baseOpts({ anchorItems: [drawingAnchor], shortfall: 2 }), sources);
  assert.equal(sources.prompts.length, 2);
  for (const p of sources.prompts) {
    assert.ok(/existing practice tasks .* are drawing tasks/i.test(p), p);
    assert.ok(!p.includes(drawingAnchor.problemText), 'the drawing task text still never reaches the prompt');
  }
  delete process.env.PRACTICE_GEN;
});

await test('drawing LO: verified typed/choice candidates are served and banked (mcq, numeric, free)', async () => {
  process.env.PRACTICE_GEN = 'on';
  const mcq: GenPayload = { problemText: 'A region is described in words. Which description matches it?', finalAnswer: 'B', responseFormat: 'mcq', choices: ['first', 'second', 'third'], answerKind: 'mcq' };
  const numeric: GenPayload = { ...numericGen('A line is described by two stated values. Give the value where it crosses the vertical axis.', '3'), answerKind: 'numeric' };
  const sources = makeStubSources({ perCall: [mcq, numeric] });
  const items = await generatePracticeItems(baseOpts({ anchorItems: [], authoredDrawingTasks: true, shortfall: 2 }), sources);
  assert.deepEqual(items.map((i) => i.responseFormat).sort(), ['mcq', 'numeric']);
  assert.equal(sources.persisted.length, 2, 'both banked');
  assert.ok(items.every((i) => i.id.startsWith(`practice-gen.${LO}.`) && i.loId === LO));
  delete process.env.PRACTICE_GEN;
});

/** The REAL generateAndVerify (generate → gate → 1 retry) with the generator,
 *  the blind re-solve and the key verifier replaced — no Anthropic. Every
 *  generator call returns the next payload of `payloads` (last one repeats). */
async function runRealGateWith(payloads: GenPayload[], opts: Partial<GeneratePracticeItemsOptions> = {}) {
  const pg = problemGeneratorModule as unknown as { generateCandidate: unknown; verifyClaimedAnswer: unknown };
  const kv = keyVerifyModule as unknown as { verifyAnswerKey: unknown };
  const orig = { gen: pg.generateCandidate, verify: pg.verifyClaimedAnswer, key: kv.verifyAnswerKey };
  let n = 0;
  let solves = 0;
  pg.generateCandidate = async () => { const gen = payloads[Math.min(n, payloads.length - 1)]; n++; return { gen, hash: `rh${n}` }; };
  pg.verifyClaimedAnswer = async () => { solves++; return { agree: true, solved: 'same' }; };
  kv.verifyAnswerKey = async () => { solves++; return { status: 'verified', model: 'fake-content-verify', reason: 'fake', usage: { calls: 1, inputTokens: 0, outputTokens: 0 } }; };
  process.env.PRACTICE_GEN = 'on';
  const events: Array<{ type: string; message: string }> = [];
  const persisted: Array<{ id: string; gen: GenPayload }> = [];
  try {
    const real = practiceGenSources();
    const sources: PracticeGenSources = {
      generateAndVerify: real.generateAndVerify,
      async reserve(_s, _l, want) { return want; },
      async persist(row) { persisted.push({ id: row.id, gen: row.gen }); },
    };
    const items = await generatePracticeItems(
      baseOpts({ shortfall: 1, anchorItems: [], authoredDrawingTasks: true, onDebugEvent: (type, message) => events.push({ type, message }), ...opts }),
      sources,
    );
    return { items, events, persisted, generations: n, solves };
  } finally {
    pg.generateCandidate = orig.gen;
    pg.verifyClaimedAnswer = orig.verify;
    kv.verifyAnswerKey = orig.key;
    delete process.env.PRACTICE_GEN;
  }
}

await test('drawing LO (real gate): a generator that returns a drawing task is still rejected — free, numeric and mcq alike — and nothing is banked', async () => {
  const drawingFree: GenPayload = { problemText: 'Graph the region and shade the side that is included.', finalAnswer: 'the upper side', responseFormat: 'numeric', answerKind: 'free', expectedAnswer: 'the upper side' };
  const drawingNumeric: GenPayload = { ...numericGen('Sketch the line through the two stated points.', '2'), answerKind: 'numeric' };
  const drawingMcq: GenPayload = { problemText: 'Plot the three stated points on the grid.', finalAnswer: 'A', responseFormat: 'mcq', choices: ['one', 'two'], answerKind: 'mcq' };
  for (const [payload, reason] of [[drawingFree, 'free_shape'], [drawingNumeric, 'drawing_task'], [drawingMcq, 'drawing_task']] as const) {
    const r = await runRealGateWith([payload]);
    assert.deepEqual(r.items, [], reason);
    assert.deepEqual(r.persisted, [], `${reason}: nothing banked`);
    assert.equal(r.generations, 2, 'first attempt + the one retry');
    assert.equal(r.solves, 0, 'a drawing task never reaches a solver — even one that would agree');
    const gated = r.events.filter((e) => e.type === 'practice_gen_gate_failed');
    assert.deepEqual(gated.map((g) => g.message), [`loId=${LO} reason=${reason}`, `loId=${LO} reason=${reason}`]);
    assert.ok(r.events.some((e) => e.type === 'practice_gen_empty' && e.message.includes(`loId=${LO}`)), 'the empty outcome names the LO');
  }
});

await test('drawing LO (real gate): a drawing task first, a typed question on the retry → the typed one is verified, served and banked', async () => {
  const drawing: GenPayload = { ...numericGen('Sketch the line through the two stated points.', '2'), answerKind: 'numeric' };
  const typed: GenPayload = { problemText: 'A boundary is described in words. Is the stated point included? Answer yes or no.', finalAnswer: 'yes', responseFormat: 'numeric', answerKind: 'free', expectedAnswer: 'yes' };
  const r = await runRealGateWith([drawing, typed]);
  assert.equal(r.items.length, 1);
  assert.equal(r.items[0].responseFormat, 'free');
  assert.equal(r.items[0].expectedAnswer, 'yes');
  assert.equal(r.persisted.length, 1);
  assert.equal(r.persisted[0].gen.verifierModel, 'fake-content-verify', 'free → the key check, stamped');
  assert.deepEqual([r.generations, r.solves], [2, 1]);
});

await test('gate: a drawing-only numeric/mcq candidate fails drawing_task; one with a typed question still passes', async () => {
  assert.deepEqual(await checkGeneratedAnswer(numericGen('Graph the line y = 2x + 1.', '1'), agreeVerify()), { ok: false, reason: 'drawing_task' });
  assert.deepEqual(
    await checkGeneratedAnswer({ problemText: 'Draw the figure described.', finalAnswer: 'A', responseFormat: 'mcq', choices: ['x', 'y'] }, agreeVerify()),
    { ok: false, reason: 'drawing_task' },
  );
  assert.equal((await checkGeneratedAnswer(numericGen('The graph of f passes through (1, 2) and (3, 6). Find its slope.', '2'), agreeVerify())).ok, true);
  assert.equal((await checkGeneratedAnswer(numericGen('Draw the free-body diagram. How many forces act on the block?', '3'), agreeVerify())).ok, true, 'a typed-answer cue keeps it');
});

await test('normal LO: loTitle / authoredDrawingTasks:false never change the anchor prompt or the brand-new-LO prompt', async () => {
  // Was a byte-for-byte golden (captured 2026-10-04). The prompts changed on
  // purpose on 2026-10-05 (do-not-repeat list, precision, $…$, skill-level
  // and slot clauses — asserted in the tests below), so what is pinned here
  // is the property the golden protected: only the drawing-LO branch reads
  // the title.
  process.env.PRACTICE_GEN = 'on';
  const cases: Array<[string, PracticeItem[], 2 | undefined]> = [['anchor', [bankAnchor], 2], ['brand-new', [], undefined]];
  const promptsFor = async (o: Partial<GeneratePracticeItemsOptions>) => {
    const sources = makeStubSources({ gen: null });
    await generatePracticeItems({ studentId: 's', loId: LO, topic: TOPIC, shortfall: 2, anchorItems: [], ...o }, sources);
    return sources.prompts;
  };
  for (const [name, anchorItems, difficulty] of cases) {
    const base = await promptsFor({ anchorItems, difficulty });
    assert.equal(base.length, 2);
    assert.notEqual(base[0], base[1], 'the two slots are prompted differently');
    for (const extra of [{ loTitle: 'A title that must not appear' }, { authoredDrawingTasks: false }]) {
      assert.deepEqual(await promptsFor({ anchorItems, difficulty, ...extra }), base, `${name} ${JSON.stringify(extra)}`);
    }
    assert.ok(base.every((p) => !p.includes('A title that must not appear')));
    assert.ok(base.every((p) => p.endsWith('Write the problem now.')));
  }
  const anchor = await promptsFor({ anchorItems: [bankAnchor], difficulty: 2 });
  assert.ok(anchor[0].startsWith('ANCHOR problem ('));
  assert.ok((await promptsFor({}))[0].startsWith('There is no existing practice problem yet for this learning objective (brand-new LO).'));
  // A typed anchor in the pool keeps the anchor prompt even on a drawing LO.
  assert.deepEqual(await promptsFor({ anchorItems: [bankAnchor], difficulty: 2, authoredDrawingTasks: true, loTitle: 'x' }), anchor);
  delete process.env.PRACTICE_GEN;
});

await test('practice: an LO whose only try-yourself is a drawing task → generation is told so (authoredDrawingTasks), a typed LO is not', async () => {
  process.env.PRACTICE_GEN = 'on';
  const plan = (id: string, problem: string): PlanLite => ({
    id, topic: 'a-topic', los: [{ id: `${id}.lo-1` }, { id: `${id}.lo-2` }],
    segments: [
      { kind: 'try_yourself', id: `${id}.lo-1-try`, problem: 'Solve 2x = 6.', expectedAnswer: '3', responseFormat: 'numeric' },
      { kind: 'try_yourself', id: `${id}.lo-2-try`, problem, expectedAnswer: 'see board' },
    ],
  });
  const drawPlan = plan('gen-draw', 'Graph the region described and shade the included side.');
  const typedPlan = plan('gen-typed', 'Find the value of x when 3x = 12.');
  assert.equal(loHasDrawingOnlyTask(drawPlan, 'gen-draw.lo-2'), true);
  assert.equal(loHasDrawingOnlyTask(drawPlan, 'gen-draw.lo-1'), false, 'another LO of the same plan is not a drawing LO');
  assert.equal(loHasDrawingOnlyTask(typedPlan, 'gen-typed.lo-2'), false);
  assert.equal(loHasDrawingOnlyTask(drawPlan, 'not-in-plan'), false);
  // Review item 4: an UNOWNED segment in a multi-LO plan (curated bare ids)
  // was attributed to EVERY LO, so a non-drawing LO got the drawing prompt.
  const bareMulti = {
    los: [{ id: 'lo-1' }, { id: 'lo-2' }],
    segments: [
      { kind: 'try_yourself', id: 'try-1', problem: 'Graph the line y = 2x + 1.' },
      { kind: 'try_yourself', id: 'try-2', problem: 'Solve 2x = 8.' },
    ],
  };
  assert.equal(loHasDrawingOnlyTask(bareMulti, 'lo-1'), false, 'unowned drawing segment does not make lo-1 a drawing LO');
  assert.equal(loHasDrawingOnlyTask(bareMulti, 'lo-2'), false, 'unowned drawing segment does not make lo-2 a drawing LO');
  assert.equal(loHasDrawingOnlyTask({ los: [{ id: 'lo-1' }, { id: 'lo-2' }], segments: [{ kind: 'try_yourself', id: 'try-1', problem: 'Graph the line y = 2x + 1.' }] }, 'lo-1'), false,
    'multi-LO plan with ONLY an unowned drawing segment: still no LO owns it');
  assert.equal(loHasDrawingOnlyTask({ los: [{ id: 'only-lo' }], segments: [{ kind: 'try_yourself', id: 'try-1', problem: 'Graph the line y = 2x + 1.' }] }, 'only-lo'), true,
    'single-LO drawing plan (bare ids) → true');
  assert.equal(loHasDrawingOnlyTask({ los: [{ id: 'only-lo' }], segments: [
    { kind: 'try_yourself', id: 'try-1', problem: 'Graph the line y = 2x + 1.' },
    { kind: 'try_yourself', id: 'try-2', problem: 'Solve 2x = 8.' },
  ] }, 'only-lo'), false, 'single-LO plan: ALL its try-yourselves must be drawing-only');
  assert.equal(loHasDrawingOnlyTask({ los: [{ id: 'lo-1' }, { id: 'lo-2' }], segments: [
    { kind: 'try_yourself', id: 'lo-1-try-a', problem: 'Graph the line y = 2x + 1.' },
    { kind: 'try_yourself', id: 'lo-1-try-b', problem: 'Solve 2x = 8.' },
    { kind: 'try_yourself', id: 'lo-2-try-a', problem: 'Sketch the parabola and shade below it.' },
  ] }, 'lo-1'), false, 'an LO with one drawing and one typed try-yourself is not a drawing LO');
  assert.equal(loHasDrawingOnlyTask({ los: [{ id: 'lo-1' }, { id: 'lo-2' }], segments: [
    { kind: 'try_yourself', id: 'lo-1-try-a', problem: 'Solve 2x = 8.' },
    { kind: 'try_yourself', id: 'lo-2-try-a', problem: 'Graph the line y = 2x + 1.' },
    { kind: 'try_yourself', id: 'try-9', problem: 'Solve 3x = 9.' },
  ] }, 'lo-2'), true, 'an LO that owns only drawing try-yourselves qualifies; an unowned typed one is ignored');
  for (const [p, lo, wantDrawing] of [[drawPlan, 'gen-draw.lo-2', true], [typedPlan, 'gen-typed.lo-2', false], [drawPlan, 'gen-draw.lo-1', false]] as const) {
    const src: PracticeSources = {
      async plansForLoId(loId) { return loId.startsWith(p.id!) ? [p] : []; },
      async plansForTopic() { return []; },
      async bankForLoId() { return []; },
      async bankForTopic() { return []; },
    };
    const gen = makeStubSources({ gen: numericGen('A typed question?', '7') });
    const res = await retrievePractice({ studentId: 's1', courseId: 'c1', scope: { loId: lo }, count: 3 }, src, gen);
    assert.ok(gen.prompts.length > 0, `${lo}: generation ran for the shortfall`);
    for (const prompt of gen.prompts) {
      assert.equal(/existing practice tasks .* are drawing tasks/i.test(prompt), wantDrawing, `${lo}: ${prompt.slice(0, 80)}`);
    }
    if (wantDrawing) {
      assert.ok(res.items.length >= 1 && res.items.every((i) => i.id.startsWith('practice-gen.')), 'the drawing LO now gets typed practice');
      assert.ok(res.items.every((i) => !isDrawingOnlyItem(i.problemText)));
    }
  }
  delete process.env.PRACTICE_GEN;
});

await test('a typed-answer anchor wins the slot over a drawing anchor in the same pool', async () => {
  process.env.PRACTICE_GEN = 'on';
  const typed: PracticeItem = { ...bankAnchor, id: 'plan.typed-1', problemText: 'Solve 2x + 3 = 7' };
  for (const pool of [[drawingAnchor, typed], [typed, drawingAnchor]]) {
    const sources = makeStubSources({ gen: numericGen() });
    await generatePracticeItems(baseOpts({ anchorItems: pool }), sources);
    assert.equal(sources.prompts.length, 1);
    assert.ok(sources.prompts[0].includes(typed.problemText), 'typed anchor used');
    assert.ok(!sources.prompts[0].includes(drawingAnchor.problemText), 'drawing anchor never prompts');
  }
  delete process.env.PRACTICE_GEN;
});

await test('onDebugEvent receives practice_gen_empty when every candidate is gated out', async () => {
  process.env.PRACTICE_GEN = 'on';
  const events: Array<{ type: string; message: string }> = [];
  const sources = makeStubSources({ gen: null });
  const items = await generatePracticeItems(
    baseOpts({ shortfall: 2, onDebugEvent: (type, message) => events.push({ type, message }) }),
    sources,
  );
  assert.equal(items.length, 0);
  const empty = events.filter((e) => e.type === 'practice_gen_empty');
  assert.equal(empty.length, 1, JSON.stringify(events));
  assert.ok(empty[0].message.includes(`loId=${LO}`), empty[0].message);
  assert.ok(empty[0].message.includes(`topic=${TOPIC}`), empty[0].message);
  assert.ok(empty[0].message.includes('attempts=2'), empty[0].message);
  delete process.env.PRACTICE_GEN;
});

await test('onDebugEvent: no practice_gen_empty when an item was produced', async () => {
  process.env.PRACTICE_GEN = 'on';
  const events: string[] = [];
  await generatePracticeItems(baseOpts({ onDebugEvent: (type) => events.push(type) }), makeStubSources({ gen: numericGen() }));
  assert.ok(!events.includes('practice_gen_empty'), JSON.stringify(events));
  delete process.env.PRACTICE_GEN;
});

await test('onDebugEvent receives practice_gen_gate_failed with the reason sources report', async () => {
  process.env.PRACTICE_GEN = 'on';
  const events: Array<{ type: string; message: string }> = [];
  const sources: PracticeGenSources = {
    async generateAndVerify(_p, _x, onGateFailed) {
      onGateFailed?.('numeric_shape');
      onGateFailed?.('verify_disagree');
      return null;
    },
    async reserve(_s, _l, n) { return n; },
    async persist() { /* no-op */ },
  };
  await generatePracticeItems(baseOpts({ onDebugEvent: (type, message) => events.push({ type, message }) }), sources);
  const gated = events.filter((e) => e.type === 'practice_gen_gate_failed');
  assert.equal(gated.length, 2, JSON.stringify(events));
  assert.ok(gated[0].message.includes('reason=numeric_shape') && gated[0].message.includes(`loId=${LO}`), gated[0].message);
  assert.ok(gated[1].message.includes('reason=verify_disagree'), gated[1].message);
  assert.ok(events.some((e) => e.type === 'practice_gen_empty'));
  delete process.env.PRACTICE_GEN;
});

await test('checkGeneratedAnswer: names the gate branch that rejected', async () => {
  assert.deepEqual(await checkGeneratedAnswer(numericGen('x', 'between 3 and 5'), agreeVerify()), { ok: false, reason: 'numeric_shape' });
  assert.deepEqual(await checkGeneratedAnswer(numericGen('x', '42'), disagreeVerify()), { ok: false, reason: 'verify_disagree' });
  assert.deepEqual(await checkGeneratedAnswer({ ...mcqGen(), choices: [] }, agreeVerify()), { ok: false, reason: 'mcq_no_choices' });
  assert.deepEqual(await checkGeneratedAnswer({ ...mcqGen(), choices: ['A) ', 'B) 2'] }, agreeVerify()), { ok: false, reason: 'mcq_blank_choice' });
  assert.deepEqual(await checkGeneratedAnswer({ ...mcqGen(), finalAnswer: 'no such choice text' }, agreeVerify()), { ok: false, reason: 'mcq_unresolved_letter' });
  assert.deepEqual(await checkGeneratedAnswer({ ...mcqGen(), finalAnswer: 'E' }, agreeVerify()), { ok: false, reason: 'mcq_letter_out_of_range' });
  assert.deepEqual(await checkGeneratedAnswer(mcqGen(), disagreeVerify()), { ok: false, reason: 'verify_disagree' });
  const ok = await checkGeneratedAnswer(numericGen('x', '42'), agreeVerify());
  assert.equal(ok.ok, true);
});

// ── Free-text answers (2026-10-02): ordered pairs, expressions, sets and
// short phrases ("(0, 3)", "(x+2)(x+6)", "phosphate, ribose, guanine") used to
// fail `numeric_shape`, so such skills got NO generated practice once their
// authored items ran out. A `free` candidate is admitted and graded by the
// free-response judge (/grade). ──
console.log('\nfree-text answers:\n');

function freeGen(text = 'Find the y-intercept of y = 2x + 3. Give it as an ordered pair.', expectedAnswer = '(0, 3)'): GenPayload {
  return {
    problemText: text,
    finalAnswer: expectedAnswer,
    answerKind: 'free',
    expectedAnswer,
    modelResponse: 'Set x = 0: y = 3, so the intercept is (0, 3).',
    teachingAnswer: 'Set x = 0 to get y = 3.',
    responseFormat: 'numeric',
    hints: ['Set x = 0.'],
  };
}

/** Injected independent key check for `free` answers (./key-verify.ts) —
 *  no Anthropic. */
function keyVerdict(status: 'verified' | 'mismatch' | 'ill_posed' | 'unverifiable', seen?: Array<{ question: string; claimedAnswer: string }>): KeyVerifyFn {
  return async (input) => {
    seen?.push({ question: input.question, claimedAnswer: input.claimedAnswer });
    return { status, model: 'fake-content-verify' };
  };
}

// 2026-10-04 (creation-time key verification). This test used to pin the
// opposite — "a valid free candidate passes WITHOUT a blind re-solve" — which
// is exactly how unverified free-text keys were banked and stamped verified.
await test('free: a valid free candidate passes ONLY when its key is independently verified; answer = expectedAnswer, no choices', async () => {
  let numericVerifyCalls = 0;
  const verify: VerifyFn = async () => { numericVerifyCalls++; return { agree: false, solved: 'x' }; };
  const seen: Array<{ question: string; claimedAnswer: string }> = [];
  const out = await checkGeneratedAnswer({ ...freeGen(), choices: ['stray'] }, verify, keyVerdict('verified', seen));
  assert.equal(out.ok, true, JSON.stringify(out));
  if (!out.ok) return;
  assert.equal(out.gen.finalAnswer, '(0, 3)');
  assert.equal(out.gen.answerKind, 'free');
  assert.equal(out.gen.choices, undefined);
  assert.equal(numericVerifyCalls, 0, 'the numeric/mcq first-number agreement check is not used for free answers');
  assert.deepEqual(seen, [{ question: freeGen().problemText, claimedAnswer: '(0, 3)' }], 'the key verifier ran once, on this problem and key');
  assert.equal(out.gen.verifierModel, 'fake-content-verify', 'stamped with the model that actually solved it');
});

await test('free: mismatch → verify_disagree, ill-posed → ill_posed, unverifiable / verifier failure → free_unverified', async () => {
  assert.deepEqual(await checkGeneratedAnswer(freeGen(), agreeVerify(), keyVerdict('mismatch')), { ok: false, reason: 'verify_disagree' });
  assert.deepEqual(await checkGeneratedAnswer(freeGen(), agreeVerify(), keyVerdict('ill_posed')), { ok: false, reason: 'ill_posed' });
  assert.deepEqual(await checkGeneratedAnswer(freeGen(), agreeVerify(), keyVerdict('unverifiable')), { ok: false, reason: 'free_unverified' });
  const throwing: KeyVerifyFn = async () => { throw new Error('network down'); };
  assert.deepEqual(await checkGeneratedAnswer(freeGen(), agreeVerify(), throwing), { ok: false, reason: 'free_unverified' });
  assert.equal(await gateGeneratedAnswer(freeGen(), agreeVerify(), keyVerdict('mismatch')), null);
});

await test('free: the shape checks still run FIRST — a bad shape never reaches the key verifier', async () => {
  const seen: Array<{ question: string; claimedAnswer: string }> = [];
  assert.deepEqual(await checkGeneratedAnswer({ ...freeGen(), expectedAnswer: '  ' }, agreeVerify(), keyVerdict('verified', seen)), { ok: false, reason: 'free_shape' });
  assert.deepEqual(await checkGeneratedAnswer(freeGen('Graph y = 2x + 3 and label both intercepts.', '(0, 3)'), agreeVerify(), keyVerdict('verified', seen)), { ok: false, reason: 'free_shape' });
  assert.equal(seen.length, 0);
});

await test('free: TUTOR_KEY_VERIFY_AT_CREATION=off → the previous shape-only admission, marked unverified (never stamped as solved)', async () => {
  process.env.TUTOR_KEY_VERIFY_AT_CREATION = 'off';
  try {
    const seen: Array<{ question: string; claimedAnswer: string }> = [];
    const out = await checkGeneratedAnswer(freeGen(), disagreeVerify(), keyVerdict('mismatch', seen));
    assert.equal(out.ok, true, JSON.stringify(out));
    assert.equal(seen.length, 0, 'no key check with the flag off');
    if (out.ok) {
      assert.equal(out.gen.verifierModel, UNVERIFIED_MODEL);
      const { verifierModel: _vm, ...rest } = out.gen;
      void _vm;
      assert.deepEqual(rest, { ...freeGen(), finalAnswer: '(0, 3)', expectedAnswer: '(0, 3)', choices: undefined }, 'otherwise exactly the pre-change payload');
    }
  } finally {
    delete process.env.TUTOR_KEY_VERIFY_AT_CREATION;
  }
});

await test('verifierModel: mcq and numeric payloads are stamped with the blind re-solve model', async () => {
  const num = await checkGeneratedAnswer(numericGen('Solve 2x = 6.', '3'), agreeVerify());
  const mcq = await checkGeneratedAnswer(mcqGen(), agreeVerify());
  assert.ok(num.ok && mcq.ok);
  if (num.ok && mcq.ok) {
    assert.equal(num.gen.verifierModel, problemGeneratorModule.BRAINGEN_VERIFY_MODEL);
    assert.equal(mcq.gen.verifierModel, problemGeneratorModule.BRAINGEN_VERIFY_MODEL);
  }
});

await test('free: an empty or over-long expectedAnswer fails free_shape', async () => {
  assert.deepEqual(await checkGeneratedAnswer({ ...freeGen(), expectedAnswer: '   ' }, agreeVerify()), { ok: false, reason: 'free_shape' });
  assert.deepEqual(await checkGeneratedAnswer({ ...freeGen(), expectedAnswer: undefined }, agreeVerify()), { ok: false, reason: 'free_shape' });
  assert.deepEqual(await checkGeneratedAnswer({ ...freeGen(), expectedAnswer: 'x'.repeat(121) }, agreeVerify()), { ok: false, reason: 'free_shape' });
  assert.equal((await checkGeneratedAnswer({ ...freeGen(), expectedAnswer: 'x'.repeat(120) }, agreeVerify(), keyVerdict('verified'))).ok, true, '120 chars is the inclusive limit');
});

await test('free: a drawing-instruction free candidate fails free_shape', async () => {
  const out = await checkGeneratedAnswer(freeGen('Graph y = 2x + 3 and label both intercepts.', '(0, 3) and (-1.5, 0)'), agreeVerify());
  assert.deepEqual(out, { ok: false, reason: 'free_shape' });
});

await test('free: a numeric candidate (answerKind numeric) still needs agreement and still rejects a non-numeric shape', async () => {
  const numeric: GenPayload = { ...numericGen('Solve 2x = 6.', '3'), answerKind: 'numeric' };
  assert.deepEqual(await checkGeneratedAnswer(numeric, disagreeVerify()), { ok: false, reason: 'verify_disagree' });
  assert.equal((await checkGeneratedAnswer(numeric, agreeVerify())).ok, true);
  assert.deepEqual(await checkGeneratedAnswer({ ...numeric, finalAnswer: '(0, 3)' }, agreeVerify()), { ok: false, reason: 'numeric_shape' });
});

await test('free: generatePracticeItems serves a free item (responseFormat free, no choices) and persists it', async () => {
  process.env.PRACTICE_GEN = 'on';
  const sources = makeStubSources({ gen: { ...freeGen(), finalAnswer: '(0, 3)', choices: undefined } });
  const items = await generatePracticeItems(baseOpts(), sources);
  assert.equal(items.length, 1);
  assert.equal(items[0].responseFormat, 'free');
  assert.equal(items[0].expectedAnswer, '(0, 3)');
  assert.equal(items[0].choices, undefined);
  assert.equal(sources.persisted.length, 1);
  delete process.env.PRACTICE_GEN;
});

await test('free: the real persist writes responseFormat free, answer = expectedAnswer, no choices', async () => {
  capturedPersist = null;
  await practiceGenSources().persist({
    id: `practice-gen.${LO}.free1`,
    topic: TOPIC,
    loId: LO,
    difficulty: 2,
    gen: { ...freeGen(), finalAnswer: '(0, 3)' },
  });
  const cp = capturedPersist as CapturedUpdate | null;
  assert.ok(cp, 'expected ProblemBank.updateOne to be called');
  const row = cp!.update.$setOnInsert;
  assert.equal(row.responseFormat, 'free');
  assert.equal(row.answer, '(0, 3)');
  assert.equal(row.choices, undefined);
});

await test('persist stamps verifierModel from the solve that happened — never a solve that did not', async () => {
  const persistRow = async (gen: GenPayload) => {
    capturedPersist = null;
    await practiceGenSources().persist({ id: `practice-gen.${LO}.vm`, topic: TOPIC, loId: LO, difficulty: 2, gen });
    return (capturedPersist as CapturedUpdate | null)!.update.$setOnInsert;
  };
  const verifiedFree = await checkGeneratedAnswer(freeGen(), agreeVerify(), keyVerdict('verified'));
  assert.ok(verifiedFree.ok);
  if (verifiedFree.ok) {
    const row = await persistRow(verifiedFree.gen);
    assert.equal(row.verifierModel, 'fake-content-verify');
    assert.ok(row.verifiedAt instanceof Date);
  }
  // A free payload that reaches persist with NO recorded solve (flag off, or a
  // caller that bypassed the gate) is marked unverified.
  assert.equal((await persistRow({ ...freeGen(), finalAnswer: '(0, 3)' })).verifierModel, UNVERIFIED_MODEL);
  assert.equal((await persistRow({ ...freeGen(), finalAnswer: '(0, 3)', verifierModel: UNVERIFIED_MODEL })).verifierModel, UNVERIFIED_MODEL);
  // mcq / numeric: unchanged — the blind re-solve model.
  assert.equal((await persistRow(mcqGen())).verifierModel, problemGeneratorModule.BRAINGEN_VERIFY_MODEL);
  const gatedNumeric = await checkGeneratedAnswer(numericGen('Solve 2x = 6.', '3'), agreeVerify());
  assert.ok(gatedNumeric.ok);
  if (gatedNumeric.ok) assert.equal((await persistRow(gatedNumeric.gen)).verifierModel, problemGeneratorModule.BRAINGEN_VERIFY_MODEL);
});

/** Drive the REAL `practiceGenSources().generateAndVerify` (generate → gate →
 *  1 retry) with the generator and the key verifier replaced — no Anthropic. */
async function runRealGate(status: 'verified' | 'mismatch' | 'ill_posed' | 'unverifiable') {
  const pg = problemGeneratorModule as unknown as { generateCandidate: unknown };
  const kv = keyVerifyModule as unknown as { verifyAnswerKey: unknown };
  const origGen = pg.generateCandidate;
  const origVerify = kv.verifyAnswerKey;
  let n = 0;
  let keyChecks = 0;
  pg.generateCandidate = async () => { n++; return { gen: freeGen(`Free problem ${n}: give the y-intercept as an ordered pair.`), hash: `fh${n}` }; };
  kv.verifyAnswerKey = async () => { keyChecks++; return { status, model: 'fake-content-verify', reason: 'fake', usage: { calls: 1, inputTokens: 0, outputTokens: 0 } }; };
  process.env.PRACTICE_GEN = 'on';
  const events: Array<{ type: string; message: string }> = [];
  const persisted: Array<{ id: string; gen: GenPayload }> = [];
  try {
    const real = practiceGenSources();
    const sources: PracticeGenSources = {
      generateAndVerify: real.generateAndVerify,
      async reserve(_s, _l, want) { return want; },
      async persist(row) { persisted.push({ id: row.id, gen: row.gen }); },
    };
    const items = await generatePracticeItems(
      baseOpts({ shortfall: 1, onDebugEvent: (type, message) => events.push({ type, message }) }),
      sources,
    );
    return { items, events, persisted, generations: n, keyChecks };
  } finally {
    pg.generateCandidate = origGen;
    kv.verifyAnswerKey = origVerify;
    delete process.env.PRACTICE_GEN;
  }
}

await test('free end-to-end (real gate): a VERIFIED free item is served and banked, stamped with the verifier model', async () => {
  const r = await runRealGate('verified');
  assert.equal(r.items.length, 1);
  assert.equal(r.items[0].responseFormat, 'free');
  assert.equal(r.items[0].expectedAnswer, '(0, 3)');
  assert.equal(r.persisted.length, 1);
  assert.equal(r.persisted[0].gen.verifierModel, 'fake-content-verify');
  assert.deepEqual([r.generations, r.keyChecks], [1, 1]);
  assert.deepEqual(r.events, []);
});

await test('free end-to-end (real gate): mismatch / ill-posed / unverifiable → rejected, NOT served, NOT banked, practice_gen_gate_failed logged', async () => {
  for (const [status, reason] of [['mismatch', 'verify_disagree'], ['ill_posed', 'ill_posed'], ['unverifiable', 'free_unverified']] as const) {
    const r = await runRealGate(status);
    assert.deepEqual(r.items, [], status);
    assert.deepEqual(r.persisted, [], `${status}: nothing banked, so nothing stamped verified`);
    assert.deepEqual([r.generations, r.keyChecks], [2, 2], `${status}: first attempt + the one retry, each checked`);
    const gated = r.events.filter((e) => e.type === 'practice_gen_gate_failed');
    assert.equal(gated.length, 2, JSON.stringify(r.events));
    for (const g of gated) assert.equal(g.message, `loId=${LO} reason=${reason}`);
    assert.ok(r.events.some((e) => e.type === 'practice_gen_empty'), status);
  }
});

await test('free: both prompt branches carry the answerKind instruction', async () => {
  process.env.PRACTICE_GEN = 'on';
  for (const anchorItems of [[bankAnchor], []]) {
    const sources = makeStubSources({ gen: numericGen() });
    await generatePracticeItems(baseOpts({ anchorItems }), sources);
    const p = sources.prompts[0];
    assert.ok(p.includes('"answerKind"'), p);
    assert.ok(/"numeric"/.test(p) && /"mcq"/.test(p) && /"free"/.test(p), p);
    assert.ok(p.includes('"expectedAnswer"') && p.includes('120'), p);
    assert.ok(p.includes('"modelResponse"'), p);
  }
  delete process.env.PRACTICE_GEN;
});

// G2 (2026-10-03): a drawing/graphing try-yourself ("Sketch forces on…",
// "Draw a labeled free-body diagram…", "Graph the line…") can't be answered
// in a typed practice/assessment item — it must never be SERVED.
await test('isDrawingInstruction: instruction-anchored drawing verbs only', () => {
  assert.equal(isDrawingInstruction('Sketch forces on a 3 kg block resting on a 30° incline.'), true);
  assert.equal(isDrawingInstruction('Draw a labeled free-body diagram for the block.'), true);
  assert.equal(isDrawingInstruction('Graph the line y = 2x + 1.'), true);
  assert.equal(isDrawingInstruction('The graph of f passes through (1, 2); find f(3).'), false);
  assert.equal(isDrawingInstruction('A 3 kg block slides down a 30° incline. Find its acceleration.'), false);
});

await test('isDrawingOnlyItem: a drawing instruction WITH a typed-answer cue is kept', () => {
  for (const text of [
    'Draw the Lewis structure for water (H₂O). How many lone pairs are on the oxygen?',
    'Sketch the graph of y = x^2 - 4 and find its x-intercepts.',
    '(a) Draw a correctly labeled AD-AS graph. (b) Calculate the change in real GDP.',
  ]) {
    assert.equal(isDrawingInstruction(text), true, text);
    assert.equal(isDrawingOnlyItem(text), false, text);
  }
});

await test('isDrawingOnlyItem: a pure drawing instruction with no cue is dropped', () => {
  for (const text of [
    'Sketch forces on a 3 kg block resting on a 30° incline.',
    'Graph the line y = 2x + 1.',
    'Draw a labeled free-body diagram for the block.',
  ]) {
    assert.equal(isDrawingOnlyItem(text), true, text);
  }
  assert.equal(isDrawingOnlyItem('A 3 kg block slides down a 30° incline. Find its acceleration.'), false);
});

const DRAWING_PLAN: PlanLite = {
  id: 'gen-fbd',
  topic: 'physics-1',
  los: [{ id: 'gen-fbd.lo-1', standard: 'P1.2' }],
  segments: [
    { kind: 'try_yourself', id: 'try-draw', problem: 'Sketch forces on a 3 kg block resting on a 30° incline.', expectedAnswer: 'gravity, normal, friction' },
    { kind: 'try_yourself', id: 'try-fbd-q', problem: 'Draw the free-body diagram. How many forces act on the block?', expectedAnswer: '3', responseFormat: 'numeric' },
    { kind: 'try_yourself', id: 'try-a', problem: 'A 3 kg block slides down a frictionless 30° incline. Find a in m/s^2.', expectedAnswer: '4.9', responseFormat: 'numeric' },
    { kind: 'try_yourself', id: 'try-n', problem: 'Find the normal force on the 3 kg block on the 30° incline (N).', expectedAnswer: '25.5', responseFormat: 'numeric' },
  ],
};
const drawingPlanSources: PracticeSources = {
  async plansForLoId(loId) { return loId === 'gen-fbd.lo-1' ? [DRAWING_PLAN] : []; },
  async plansForTopic() { return []; },
  async bankForLoId() { return []; },
  async bankForTopic() { return []; },
};

await test('practice: a plan with one pure-drawing, one drawing-with-question and two numeric try-yourselves drops only the pure drawing', async () => {
  const res = await retrievePractice(
    { studentId: 's1', courseId: 'c1', scope: { loId: 'gen-fbd.lo-1' }, count: 5 },
    drawingPlanSources,
    NO_GEN_SOURCES,
  );
  assert.deepEqual(res.items.map((i) => i.id), ['gen-fbd::try-fbd-q', 'gen-fbd::try-a', 'gen-fbd::try-n']);
});

await test('assessment: the same plan builds a calibration set without the pure drawing item', async () => {
  const set = await buildAssessment(
    { studentId: 's1', courseId: 'c1', loIds: ['gen-fbd.lo-1'], maxPerLo: 5 },
    drawingPlanSources,
    NO_GEN_SOURCES,
  );
  assert.deepEqual(set.items.map((i) => i.itemId), ['gen-fbd::try-fbd-q', 'gen-fbd::try-a', 'gen-fbd::try-n']);
});

// ── problem-generator: reply parsing (2026-10-04) ────────────────────────
// A reply that yielded no candidate used to vanish (`reason=no_candidate`
// with nothing to read). The parser now names the reason, and tolerates the
// two harmless deviations from "ONLY a JSON object".
{
  const { parseGenPayload, parseGenPayloadDetailed, describeUnusableGenReply } = problemGeneratorModule;
  const OBJ = '{"problemText": "A rectangle is 6 in by 8 in. Find its area.", "finalAnswer": "48 square inches", "teachingAnswer": "6 × 8 = 48.", "responseFormat": "numeric", "hints": ["Area = length × width"]}';

  await test('gen-parse: a bare JSON object parses exactly as before', () => {
    assert.deepEqual(parseGenPayload(OBJ), {
      problemText: 'A rectangle is 6 in by 8 in. Find its area.', finalAnswer: '48 square inches',
      teachingAnswer: '6 × 8 = 48.', responseFormat: 'numeric', hints: ['Area = length × width'], choices: undefined,
    });
  });
  await test('gen-parse: a whole-reply ```json fence still parses', () => {
    assert.equal(parseGenPayload('```json\n' + OBJ + '\n```')?.finalAnswer, '48 square inches');
  });
  await test('gen-parse: prose before and after the object → the object is extracted', () => {
    const r = parseGenPayload(`Here is a fresh problem:\n\n${OBJ}\n\nLet me know if you want another.`);
    assert.equal(r?.problemText, 'A rectangle is 6 in by 8 in. Find its area.');
    assert.equal(r?.finalAnswer, '48 square inches');
  });
  await test('gen-parse: prose followed by a fenced block → the object is extracted', () => {
    assert.equal(parseGenPayload('Sure — here it is.\n```json\n' + OBJ + '\n```\nHope that helps!')?.finalAnswer, '48 square inches');
  });
  await test('gen-parse: braces inside strings and a non-JSON brace group in the preamble do not confuse the extraction', () => {
    const obj = '{"problemText": "Simplify $\\\\frac{6}{8}$ — write it as {a}/{b}. A \\"}\\" is not a close.", "finalAnswer": "3/4"}';
    const r = parseGenPayload(`Using the set {1, 2} as an anchor:\n${obj}\nDone.`);
    assert.equal(r?.problemText, 'Simplify $\\frac{6}{8}$ — write it as {a}/{b}. A "}" is not a close.');
    assert.equal(r?.finalAnswer, '3/4');
  });
  await test('gen-parse: nested objects are kept whole (the outer object is the payload)', () => {
    const r = parseGenPayload('Note: {"problemText": "What is 2 + 2?", "finalAnswer": "4", "meta": {"k": {"deep": 1}}} trailing');
    assert.equal(r?.finalAnswer, '4');
  });
  await test('gen-parse: a numeric finalAnswer is stringified (48, -2.5, 0)', () => {
    assert.equal(parseGenPayload('{"problemText": "Area of a 6 by 8 rectangle?", "finalAnswer": 48}')?.finalAnswer, '48');
    assert.equal(parseGenPayload('{"problemText": "Solve 2x = -5.", "finalAnswer": -2.5}')?.finalAnswer, '-2.5');
    assert.equal(parseGenPayload('{"problemText": "What is 3 - 3?", "finalAnswer": 0}')?.finalAnswer, '0');
  });
  await test('gen-parse: a free-kind payload still takes its answer from expectedAnswer', () => {
    const r = parseGenPayload('{"problemText": "Name the y-intercept.", "answerKind": "free", "expectedAnswer": "(0, 3)"}');
    assert.equal(r?.finalAnswer, '(0, 3)');
    assert.equal(r?.answerKind, 'free');
  });
  await test('gen-parse: failures name their reason', () => {
    const reason = (raw: string) => { const r = parseGenPayloadDetailed(raw); return r.ok ? 'ok' : r.reason; };
    assert.equal(reason('I could not write a problem for that anchor.'), 'unparseable_json');
    assert.equal(reason(''), 'unparseable_json');
    assert.equal(reason('[1, 2, 3]'), 'unparseable_json');
    // Cut off at the token cap: never balances.
    assert.equal(reason('{"problemText": "A long problem that never fin'), 'unparseable_json');
    assert.equal(reason('{"finalAnswer": "4"}'), 'missing_problem_text');
    assert.equal(reason('{"problemText": "   ", "finalAnswer": "4"}'), 'missing_problem_text');
    assert.equal(reason('{"problemText": "What is 2 + 2?"}'), 'missing_final_answer');
    assert.equal(reason('{"problemText": "What is 2 + 2?", "finalAnswer": ""}'), 'missing_final_answer');
    assert.equal(reason('{"problemText": "What is 2 + 2?", "finalAnswer": ["4"]}'), 'missing_final_answer');
    assert.equal(reason('{"problemText": "What is 2 + 2?", "finalAnswer": null}'), 'missing_final_answer');
    assert.equal(parseGenPayload('{"problemText": "What is 2 + 2?"}'), null);
  });
  await test('gen-parse: LaTeX in the JSON strings survives as text (2026-10-05)', () => {
    // `\frac`, `\times`, `\nabla`, `\beta`, `\rho` are VALID JSON escapes: before the
    // shared reader they parsed into form feed / tab / newline / backspace / CR + "rac"…
    const raw = '{"problemText": "Compute $\\frac{3}{4} \\times 8$. Then find $\\nabla f$ for $\\beta = 2$, $\\rho = 3$.", "finalAnswer": "$\\frac{1}{2}$", "hints": ["Use $\\theta \\to 0$.\\nThen simplify."]}';
    assert.ok(/[\f\t\n\b\r]/.test(JSON.parse(raw).problemText), 'precondition: a plain JSON.parse corrupts it');
    const gen = parseGenPayload(raw)!;
    assert.equal(gen.problemText, 'Compute $\\frac{3}{4} \\times 8$. Then find $\\nabla f$ for $\\beta = 2$, $\\rho = 3$.');
    assert.equal(gen.finalAnswer, '$\\frac{1}{2}$');
    assert.deepEqual(gen.hints, ['Use $\\theta \\to 0$.\nThen simplify.'], 'a real line break is still a line break');
    assert.ok(!/[\f\t\b\r]/.test(gen.problemText + gen.finalAnswer));
  });
  await test('gen-parse: an invalid escape (`\\sqrt`) no longer throws the whole problem away', () => {
    const gen = parseGenPayload('{"problemText": "Simplify $\\sqrt{8}$.", "finalAnswer": "2\\sqrt{2}"}')!;
    assert.equal(gen.problemText, 'Simplify $\\sqrt{8}$.');
    assert.equal(gen.finalAnswer, '2\\sqrt{2}');
    // Already-escaped LaTeX is untouched.
    assert.equal(parseGenPayload('{"problemText": "Simplify $\\\\sqrt{8}$ and $\\\\frac{1}{2}$.", "finalAnswer": "4"}')?.problemText, 'Simplify $\\sqrt{8}$ and $\\frac{1}{2}$.');
  });
  await test('gen-parse: the log line is ONE line, carries reason + length, and caps the reply at 300 characters', () => {
    const raw = 'Sorry,\nI cannot\r\n\tdo that.\n' + 'x'.repeat(1000);
    const line = describeUnusableGenReply('unparseable_json', raw);
    assert.ok(!/[\r\n\t]/.test(line), 'no line breaks or tabs');
    assert.ok(line.startsWith(`[problem-generator] candidate_unusable reason=unparseable_json len=${raw.length} head="Sorry, I cannot do that. xxx`));
    const head = JSON.parse(line.slice(line.indexOf('head=') + 5)) as string;
    assert.equal(head.length, 300);
  });
}

// ════════════════════════════════════════════════════════════════════════
// 2026-10-05 — pre-generation run (185 items, 21 failed the audit; 64 % of
// generation slots yielded an item)
// ════════════════════════════════════════════════════════════════════════
{
  const {
    normalizeNumericAnswer: norm, exactFractionKey, statedPrecision, numericKeyPrecisionOk, numericHasSecondPart,
    dollarMathDelimiters, globalDailyCap, GLOBAL_DAILY_CAP: DEFAULT_CAP, GLOBAL_DAILY_CAP_MAX,
  } = practiceGenModule;
  const { callTextModel, GEN_MAX_TOKENS, VERIFY_MAX_TOKENS, RETRY_MAX_TOKENS } = problemGeneratorModule;

  // ── (5) a reply cut off at the token cap ──────────────────────────────
  const fakeClient = (replies: Array<{ text?: string; stop: string; thinkingOnly?: boolean }>) => {
    const caps: number[] = [];
    return {
      caps,
      client: {
        messages: {
          async create(body: { max_tokens: number }) {
            const r = replies[Math.min(caps.length, replies.length - 1)];
            caps.push(body.max_tokens);
            return { stop_reason: r.stop, content: [{ type: 'thinking', thinking: '…' }, ...(r.thinkingOnly ? [] : [{ type: 'text', text: r.text ?? '' }])] };
          },
        },
      },
    };
  };
  const quiet = async <T>(fn: () => Promise<T>): Promise<T> => {
    const warn = console.warn; console.warn = () => {};
    try { return await fn(); } finally { console.warn = warn; }
  };

  await test('cut-off: the generator cap is sized for the reply alone (thinking is off); the solver cap leaves room for thinking', () => {
    assert.ok(GEN_MAX_TOKENS >= 1500 && GEN_MAX_TOKENS <= 3000, 'a ~500-token JSON reply, with room');
    assert.ok(VERIFY_MAX_TOKENS >= 2000 && RETRY_MAX_TOKENS > VERIFY_MAX_TOKENS);
  });
  await test('cut-off: a complete reply is returned as is — one call', async () => {
    const f = fakeClient([{ text: ' {"problemText": "Q", "finalAnswer": "4"} ', stop: 'end_turn' }]);
    assert.equal(await callTextModel(f.client, 'm', 'sys', 'user', GEN_MAX_TOKENS), '{"problemText": "Q", "finalAnswer": "4"}');
    assert.deepEqual(f.caps, [GEN_MAX_TOKENS]);
  });
  await test('cut-off (solver): thinking used the whole cap, no text at all → ONE retry at the higher cap when the caller asks for it', async () => {
    const f = fakeClient([{ stop: 'max_tokens', thinkingOnly: true }, { text: '42', stop: 'end_turn' }]);
    assert.equal(await quiet(() => callTextModel(f.client, 'm', 'sys', 'user', VERIFY_MAX_TOKENS, { retryMaxTokens: RETRY_MAX_TOKENS })), '42');
    assert.deepEqual(f.caps, [VERIFY_MAX_TOKENS, RETRY_MAX_TOKENS]);
  });
  await test('cut-off (solver): still cut off after the retry → the text is returned for the caller to reject; never a third call', async () => {
    const f = fakeClient([{ text: 'never fin', stop: 'max_tokens' }]);
    await quiet(() => callTextModel(f.client, 'm', 'sys', 'user', VERIFY_MAX_TOKENS, { retryMaxTokens: RETRY_MAX_TOKENS }));
    assert.deepEqual(f.caps, [VERIFY_MAX_TOKENS, RETRY_MAX_TOKENS]);
  });
  await test('cut-off (generator): NEVER re-asked at a higher cap — the cut-off text goes to the parser, which rejects it', async () => {
    const f = fakeClient([{ text: '{"problemText": "A Riemann sum with n subinterv', stop: 'max_tokens' }, { text: '{"problemText": "Q", "finalAnswer": "4"}', stop: 'end_turn' }]);
    const text = await quiet(() => callTextModel(f.client, 'm', 'sys', 'user', GEN_MAX_TOKENS));
    assert.deepEqual(f.caps, [GEN_MAX_TOKENS], 'one call');
    assert.equal(problemGeneratorModule.parseGenPayloadDetailed(text).ok, false);
    assert.equal(parseGenPayloadSafe(text), undefined);
  });
  function parseGenPayloadSafe(raw: string): string | undefined { return problemGeneratorModule.parseGenPayload(raw)?.problemText; }

  // ── (6) fraction answers and decimal precision ────────────────────────
  await test('fraction: 5/6 and 5/13 stay FRACTION keys — they were stored as 0.8333333333333334 / 0.38461538461538464', () => {
    assert.equal(norm('5/6'), '5/6');
    assert.equal(norm('5/13'), '5/13');
    assert.equal(norm('10/26'), '5/13', 'reduced');
    assert.equal(norm('5/6 ft/s'), '5/6', 'a unit after the fraction');
    assert.equal(norm('\\frac{5}{6}'), '5/6');
    assert.equal(norm('$\\frac{5}{13}$'), '5/13');
    assert.equal(norm('−7/3'), '-7/3');
    assert.equal(norm('7/-3'), '-7/3', 'sign on the numerator');
    assert.equal(exactFractionKey(1, 0), null);
    assert.equal(norm('1/0'), null);
  });
  await test('fraction: a whole number or terminating decimal is still a plain number (as before)', () => {
    assert.equal(norm('12/3'), '4');
    assert.equal(norm('1/2'), '0.5');
    assert.equal(norm('3/8'), '0.375');
    assert.equal(norm('-9/4'), '-2.25');
    assert.equal(norm('48 square inches'), '48');
    assert.equal(norm('$4.50'), '4.5');
    assert.equal(norm('50%'), '50');
  });
  await test('fraction: no 16-digit float is ever a key — a computed non-terminating value is rejected', () => {
    assert.equal(norm('2π'), null, 'was "6.283185307179586"');
    assert.equal(norm('√2'), null, 'was "1.4142135623730951"');
    assert.equal(norm('1.5/7'), null, 'a decimal over an integer that does not terminate');
    assert.equal(norm('1.5/2'), '0.75');
    for (const raw of ['5/6', '5/13', '2π', '√2', '22/7', '1/3', '100/7 m']) {
      const key = norm(raw);
      assert.ok(key === null || !/\.\d{7,}/.test(key), `${raw} → ${key}`);
    }
  });
  await test('fraction: what a student may type against a fraction key, by the numeric rule (unchanged)', () => {
    const ok = (key: string, answer: string) => { const r = gradeNumericAnswer(key, answer); return r.decided ? r.correct : 'undecided'; };
    for (const a of ['5/6', '10/12', '0.83', '0.833', '0.8333', '.83']) assert.equal(ok('5/6', a), true, a);
    for (const a of ['0.8', '0.84', '0.834', '1', '6/5']) assert.equal(ok('5/6', a), false, a);
    for (const a of ['5/13', '10/26', '0.38', '0.385', '0.3846']) assert.equal(ok('5/13', a), true, a);
    // Before: the float key accepted none of the answers a student would type.
    for (const a of ['0.83', '0.833', '0.8333']) assert.equal(ok('0.8333333333333334', a), false, a);
  });
  await test('precision: the rounding a question states is read from its text', () => {
    assert.deepEqual(statedPrecision('Give your answer to the nearest tenth.'), { kind: 'places', n: 1 });
    assert.deepEqual(statedPrecision('Round to the nearest hundredth of a second.'), { kind: 'places', n: 2 });
    assert.deepEqual(statedPrecision('to the nearest thousandth'), { kind: 'places', n: 3 });
    assert.deepEqual(statedPrecision('to the nearest cent'), { kind: 'places', n: 2 });
    assert.deepEqual(statedPrecision('to the nearest whole number'), { kind: 'places', n: 0 });
    assert.deepEqual(statedPrecision('to the nearest metre'), { kind: 'places', n: 0 });
    assert.deepEqual(statedPrecision('Give the volume to 2 decimal places.'), { kind: 'places', n: 2 });
    assert.deepEqual(statedPrecision('correct to three decimal places'), { kind: 'places', n: 3 });
    assert.deepEqual(statedPrecision('Answer to 3 significant figures.'), { kind: 'sigfigs', n: 3 });
    assert.deepEqual(statedPrecision('to two sig figs'), { kind: 'sigfigs', n: 2 });
    assert.deepEqual(statedPrecision('to the nearest star'), null, 'not a precision: the list of units is closed');
    assert.deepEqual(statedPrecision('Round your answer appropriately.'), { kind: 'stated' });
    assert.deepEqual(statedPrecision('Give the exact value as a fraction.'), { kind: 'stated' });
    assert.equal(statedPrecision('Find the horizontal component of the initial velocity.'), null);
  });
  await test('precision: the two audited fails are rejected ON EVIDENCE — the solver\'s longer value (34.47 for the key 34.5), a "≈" in the working (5.94) — and pass once the question states the rounding', async () => {
    const SOCCER = 'A soccer ball is kicked with an initial speed of 45 m/s at an angle of 40° above the horizontal. Find the horizontal component of the initial velocity, vₓ.';
    const GAS = 'A rigid steel cylinder contains 2.80 mol of nitrogen at a pressure of 12.0 atm and a temperature of 310 K. Using the ideal gas law with R = 0.0821 L·atm/(mol·K), find the volume of the cylinder in litres.';
    assert.equal(numericKeyPrecisionOk(SOCCER, '34.5', { worked: 'vx = 45cos40° = 34.5', solved: '34.47 m/s' }), false);
    assert.equal(numericKeyPrecisionOk(SOCCER, '34.5', { worked: 'vx = 45cos40° ≈ 34.5 m/s' }), false);
    assert.equal(numericKeyPrecisionOk(GAS, '5.94', '5.94 L V = nRT/P = 2.80(0.0821)(310)/12.0 ≈ 5.94 L'), false);
    assert.equal(numericKeyPrecisionOk(`${SOCCER} Give your answer to the nearest tenth.`, '34.5', '≈ 34.5'), true);
    assert.equal(numericKeyPrecisionOk(`${GAS} Give your answer to 3 significant figures.`, '5.94', '≈ 5.94'), true);
    assert.equal(numericKeyPrecisionOk(`${GAS} Give your answer to 2 significant figures.`, '5.94', '≈ 5.94'), false, 'more figures than asked for');
    assert.equal(numericKeyPrecisionOk(`${SOCCER} Round to the nearest whole number.`, '34.5', ''), false);
    // At the gate: the solver's own value is the evidence.
    const solver = (solved: string): VerifyFn => async () => ({ agree: true, solved });
    assert.deepEqual(await checkGeneratedAnswer({ ...numericGen(SOCCER, '34.5 m/s'), teachingAnswer: 'vx = 45cos40° = 34.5 m/s' }, solver('34.4720 m/s')), { ok: false, reason: 'numeric_precision' });
    assert.deepEqual(await checkGeneratedAnswer({ ...numericGen(SOCCER, '34.5 m/s'), teachingAnswer: 'vx = 45cos40° = 34.5 m/s' }, solver('≈ 34.5 m/s')), { ok: false, reason: 'numeric_precision' });
    // A stated precision the key does not follow is rejected before any solve is spent.
    let verifyCalls = 0;
    const counting: VerifyFn = async () => { verifyCalls++; return { agree: true, solved: 'x' }; };
    assert.deepEqual(await checkGeneratedAnswer(numericGen(`${SOCCER} Round to the nearest whole number.`, '34.5 m/s'), counting), { ok: false, reason: 'numeric_precision' });
    assert.equal(verifyCalls, 0);
    const passed = await checkGeneratedAnswer({ ...numericGen(`${SOCCER} Give your answer to the nearest tenth.`, '34.5 m/s') }, counting);
    assert.equal(passed.ok && passed.gen.finalAnswer, '34.5');
  });
  await test('precision: whole numbers, fractions and exact decimals need no stated rounding', async () => {
    assert.equal(numericKeyPrecisionOk('Evaluate the sum.', '336', ''), true);
    assert.equal(numericKeyPrecisionOk('How fast is the top of the ladder sliding down?', '5/6', ''), true);
    assert.equal(numericKeyPrecisionOk('A notebook costs $4.50. What do 3 notebooks cost, in dollars?', '13.5', '3 × 4.50 = 13.50'), true);
    assert.equal(numericKeyPrecisionOk('Qc = [NO2]^2/[N2O4] with [NO2] = 0.030 M and [N2O4] = 0.050 M. Find Qc.', '0.018', '(0.030)^2/0.050 = 0.018'), true);
    assert.equal(numericKeyPrecisionOk('A car travels 150 km in 4 hours. Find its average speed in km/h.', '37.5', '150/4 = 37.5'), true);
    // Evidence of a rounding → not accepted without a stated precision.
    assert.equal(numericKeyPrecisionOk('A car travels 100 km in 7 hours. Find its average speed in km/h.', '14.3', '100/7 ≈ 14.3'), false);
    assert.equal(numericKeyPrecisionOk('Find ln(5).', '1.61', { worked: 'ln 5 = 1.61', solved: '1.6094' }), false);
    // No evidence either way → passes (the gate acts only on what it can show).
    assert.equal(numericKeyPrecisionOk('Find ln(5).', '1.61', 'ln 5 = 1.61'), true);
    assert.equal(numericKeyPrecisionOk('A car travels 100 km in 8 hours. Find its speed.', '12.5000', '= 12.5000'), true, 'the same value written long is not a rounding');
    const frac = await checkGeneratedAnswer(numericGen('A 13-foot ladder… how fast is the top sliding down, in ft/s? Give your answer as a fraction.', '5/6 ft/s'), agreeVerify());
    assert.equal(frac.ok && frac.gen.finalAnswer, '5/6');
  });
  await test('numeric box: a second part that needs words is rejected (audit: key -0.6 "…and determine whether water moves in or out")', async () => {
    const WATER = 'A plant cell has a solute potential of -0.8 MPa and a pressure potential of 0.2 MPa. Calculate the water potential of the cell and determine whether water moves into or out of the cell.';
    assert.equal(numericHasSecondPart(WATER), true);
    assert.equal(numericHasSecondPart('Find the slope and explain what it means.'), true);
    assert.equal(numericHasSecondPart('Compute the mean, then state the units.'), true);
    assert.equal(numericHasSecondPart('Determine the value of x for which 3x = 12.'), false);
    assert.equal(numericHasSecondPart('Find the total number of units produced over these 7 weeks.'), false);
    assert.deepEqual(await checkGeneratedAnswer(numericGen(WATER, '-0.6'), agreeVerify()), { ok: false, reason: 'numeric_extra_part' });
    // The same question as a free item is fine: the judge reads words.
    const free = await checkGeneratedAnswer({ problemText: WATER, finalAnswer: '-0.6 MPa; into the cell', answerKind: 'free', expectedAnswer: '-0.6 MPa; into the cell' }, agreeVerify(), async () => ({ status: 'verified', model: 'm' }));
    assert.equal(free.ok, true);
  });

  // ── (7) maths delimiters ──────────────────────────────────────────────
  await test('delimiters: \\( … \\), \\[ … \\] and $$ … $$ become $ … $ in everything the student sees', async () => {
    assert.equal(dollarMathDelimiters('Evaluate \\(\\sum_{k=1}^{6} (3k^2 - 2k + 1)\\). Find the sum.'), 'Evaluate $\\sum_{k=1}^{6} (3k^2 - 2k + 1)$. Find the sum.');
    assert.equal(dollarMathDelimiters('So \\[ x = \\frac{1}{2} \\] and $$y = 3$$.'), 'So $x = \\frac{1}{2}$ and $y = 3$.');
    assert.equal(dollarMathDelimiters('Already $x^2$; an interval [0, 1) and f(x) (plain) stay.'), 'Already $x^2$; an interval [0, 1) and f(x) (plain) stay.');
    const gated = await checkGeneratedAnswer(
      { problemText: 'Evaluate \\(\\sum_{k=1}^{7} (2k^2 + 3k - 4)\\).', finalAnswer: '336', teachingAnswer: '\\(2\\cdot 140 + 3\\cdot 28 - 28 = 336\\)', responseFormat: 'numeric', hints: ['Split \\(\\sum\\) into three sums.'] },
      agreeVerify(),
    );
    assert.ok(gated.ok);
    if (gated.ok) {
      assert.equal(gated.gen.problemText, 'Evaluate $\\sum_{k=1}^{7} (2k^2 + 3k - 4)$.');
      assert.deepEqual(gated.gen.hints, ['Split $\\sum$ into three sums.']);
      assert.equal(gated.gen.teachingAnswer, '$2\\cdot 140 + 3\\cdot 28 - 28 = 336$');
    }
    const mcq = await checkGeneratedAnswer({ problemText: 'Which equals \\(x^2\\)?', finalAnswer: 'B', responseFormat: 'mcq', choices: ['\\(2x\\)', '\\(x \\cdot x\\)'] }, agreeVerify());
    assert.deepEqual(mcq.ok && mcq.gen.choices, ['$2x$', '$x \\cdot x$']);
  });

  // ── (8) twins ─────────────────────────────────────────────────────────
  const Q = (problemText: string, answerText?: string) => ({ problemText, answerText });
  await test('near-duplicate: the audited twins that ARE caught (real texts)', () => {
    // word-for-word, "carries" / "has"
    assert.equal(nearDuplicateReason(
      Q('In a molecule of chlorine trifluoride, ClF3, the central chlorine atom is bonded to three fluorine atoms and also carries two lone pairs of electrons. Using VSEPR theory, what is the molecular geometry?', 'T-shaped'),
      Q('In a molecule of chlorine trifluoride, ClF3, the central chlorine atom is bonded to three fluorine atoms and also has two lone pairs of electrons. Using VSEPR theory, what is the molecular geometry?', 'T-shaped'),
    ), 'reworded');
    // the same expression with a story wrapped round it (the twin restates it "in the form (x + a)²")
    assert.equal(nearDuplicateReason(
      Q('A gardener is designing a square plot and writes its area in expanded form as x² + 14x + 49 square feet, where x is the side length adjustment in feet. Rewrite this expression as a perfect square trinomial (in the form (x + a)²).', '(x + 7)²'),
      Q('Write x² + 14x + 49 as a perfect square trinomial in factored form.', '(x + 7)²'),
    ), 'reworded');
    // the skill's stored question with a clause added
    assert.equal(nearDuplicateReason(
      Q('During cellular respiration, which stage takes place in the cytoplasm (outside the mitochondrion) and does not require oxygen to proceed?', 'Glycolysis'),
      Q('Which stage of respiration occurs outside the mitochondrion?', 'Glycolysis'),
    ), 'reworded');
    assert.equal(nearDuplicateReason(
      Q('In the electron transport chain, FADH₂ is produced by succinate dehydrogenase during the Krebs cycle and donates its electrons directly to an enzyme complex embedded in the inner mitochondrial membrane, bypassing Complex I. Which complex of the electron transport chain directly accepts electrons from FADH₂?', 'Complex II'),
      Q('Which complex receives electrons from FADH₂?', 'Complex II'),
    ), 'reworded');
    // tearing / shredding a sheet of paper, one with an incidental number
    assert.equal(nearDuplicateReason(
      Q('You shred a sheet of paper into many thin strips using a paper shredder. What type of change is this?', 'Physical change'),
      Q('You tear a sheet of paper into 8 small strips. What type of change is this?', 'Physical change'),
    ), 'reworded');
    // the answer of one contains the other's
    assert.equal(nearDuplicateReason(
      Q('An RNA strand contains a cytosine nucleotide. Name the three chemical components that are bonded together to form this single nucleotide.', 'Phosphate group, ribose sugar, and cytosine base'),
      Q('A molecular biology student is analyzing a single nucleotide isolated from an RNA strand. The nucleotide contains the nitrogenous base cytosine. Name the three components that make up this cytosine nucleotide in RNA.', 'Phosphate, ribose, cytosine'),
    ), 'reworded');
  });
  await test('near-duplicate: fresh items are NOT twins — same wording with different numbers, another example, another answer', () => {
    // The ordinary computational case: same template, different data.
    assert.equal(nearDuplicateReason(Q('A crate has a mass of 8 kg. Calculate its weight on Earth, using g = 10 m/s².', '80'), Q('A box has mass 5 kg. Calculate its weight on Earth using g = 10 m/s².', '50')), null);
    assert.equal(nearDuplicateReason(Q('Write x² + 14x + 49 as a perfect square trinomial.', '(x + 7)²'), Q('Write x² + 8x + 16 as a perfect square trinomial.', '(x + 4)²')), null);
    assert.equal(nearDuplicateReason(Q('Evaluate \\(\\sum_{k=1}^{6} (3k^2 - 2k + 1)\\).', '237'), Q('Evaluate \\(\\sum_{k=1}^{7} (2k^2 + 3k - 4)\\).', '336')), null);
    // Same answer by coincidence, different question.
    assert.equal(nearDuplicateReason(Q('You tear a sheet of paper into small strips. What type of change is this?', 'Physical change'), Q('You break a chalk stick into smaller pieces. What type of change?', 'Physical change')), null);
    assert.equal(nearDuplicateReason(Q('What is the name of the electron carrier that accepts electrons from Complex II?', 'Ubiquinone'), Q('Which complex receives electrons from FADH₂?', 'Complex II')), null);
    assert.equal(nearDuplicateReason(Q('Find f(3) for f(x) = 2x + 1.', '7'), Q('Solve x − 4 = 3.', '7')), null);
  });
  await test('near-duplicate: known limits, pinned — twins the text rule does NOT catch (missing one costs a repeat; a false positive costs the skill its practice)', () => {
    // Audit duplicate …1yovm4 vs …ofoh7k (silicon carbide twice). The texts share
    // too few words; this pair is what the per-slot "different example" instruction is for.
    assert.equal(nearDuplicateReason(
      Q('Silicon carbide (SiC), used in industrial cutting tools, consists of silicon and carbon atoms bonded together in a rigid three-dimensional lattice, with every atom covalently bonded to four neighbors throughout the entire crystal. This structure gives SiC an extremely high melting point and great hardness. Which type of solid is silicon carbide?', 'Covalent network'),
      Q('Silicon carbide (SiC), used in cutting tools and abrasives, has an extremely high melting point (about 2700°C), is extremely hard, does not conduct electricity in any state, and will not dissolve in water or any common solvent. Based on these properties, which type of solid is silicon carbide?', 'Covalent network'),
    ), null);
    // …1fp48sn: the third version of the stored question shares only 3 of its 5 content words.
    assert.equal(nearDuplicateReason(
      Q('In muscle cells, the breakdown of glucose into pyruvate takes place in the cytoplasm, independent of oxygen availability, before any pyruvate enters a cellular organelle for further processing. Which stage of cellular respiration does this describe, and in which part of the cell does it occur?', 'Glycolysis; occurs in the cytoplasm (cytosol)'),
      Q('Which stage of respiration occurs outside the mitochondrion?', 'Glycolysis'),
    ), null);
    // The same sum behind a story: a bare number ("336") cannot identify a
    // question, and the story states the expression twice.
    assert.equal(nearDuplicateReason(
      Q("A factory's weekly output (in units) during the k-th week is modeled by 2k^2 + 3k - 4. The total output over the first 7 weeks is $\\sum_{k=1}^{7} (2k^2 + 3k - 4)$. Find the total number of units.", '336'),
      Q('Evaluate the finite series given in sigma notation: \\(\\sum_{k=1}^{7} (2k^2 + 3k - 4)\\). Find the numerical value of the sum.', '336'),
    ), null);
  });
  await test('near-duplicate: text normalisation folds ², ₂, \\( \\), $ and LaTeX commands', () => {
    assert.equal(normalizeItemText('Evaluate \\(\\sum_{k=1}^{7} x²\\) for H₂O — now.'), 'evaluate sum _ k=1 ^ 7 x^2 for h2o - now.');
    assert.equal(findNearDuplicate(Q('Find f(3) for f(x) = 2x + 1.', '7'), [Q('Solve x − 4 = 3.', '7')]), null);
  });

  const TWIN_A = numericGenFree('In a molecule of chlorine trifluoride, ClF3, the central chlorine atom is bonded to three fluorine atoms and also has two lone pairs of electrons. What is the molecular geometry?', 'T-shaped');
  const TWIN_B = numericGenFree('In a molecule of chlorine trifluoride, ClF3, the central chlorine atom is bonded to three fluorine atoms and also carries two lone pairs of electrons. What is the molecular geometry?', 'T-shaped');
  const OTHER = numericGenFree('Sulfur hexafluoride, SF6, has six bonding pairs and no lone pairs on the central atom. What is its molecular geometry?', 'Octahedral');
  function numericGenFree(problemText: string, answer: string): GenPayload {
    return { problemText, finalAnswer: answer, answerKind: 'free', expectedAnswer: answer, hints: [] };
  }
  await test('twins: two slots of one request that produce the same item → ONE is served and ONE is stored (both used to be stored)', async () => {
    process.env.PRACTICE_GEN = 'on';
    const events: string[] = [];
    const sources = makeStubSources({ perCall: [TWIN_A, TWIN_B], allowed: 2 });
    const items = await generatePracticeItems(baseOpts({ shortfall: 2, anchorItems: [], onDebugEvent: (t, m) => events.push(`${t} ${m}`) }), sources);
    assert.equal(items.length, 1);
    assert.equal(items[0].problemText, TWIN_A.problemText, 'the first slot is kept');
    assert.equal(sources.persisted.length, 1);
    assert.equal((sources.persisted[0] as { gen: GenPayload }).gen.problemText, TWIN_A.problemText);
    assert.deepEqual(events, [`practice_gen_gate_failed loId=${LO} reason=near_duplicate_sibling`]);
    delete process.env.PRACTICE_GEN;
  });
  await test('twins: two different items are both served and stored, in slot order', async () => {
    process.env.PRACTICE_GEN = 'on';
    const sources = makeStubSources({ perCall: [TWIN_A, OTHER], allowed: 2 });
    const items = await generatePracticeItems(baseOpts({ shortfall: 2, anchorItems: [] }), sources);
    assert.deepEqual(items.map((i) => i.expectedAnswer), ['T-shaped', 'Octahedral']);
    assert.equal(sources.persisted.length, 2);
    delete process.env.PRACTICE_GEN;
  });
  await test('twins: a candidate that restates an item the skill already has is regenerated ONCE (rejected text excluded), never stored', async () => {
    process.env.PRACTICE_GEN = 'on';
    const stored: PracticeItem = { id: 'plan::try', source: 'plan-try-yourself', problemText: 'Which stage of respiration occurs outside the mitochondrion?', expectedAnswer: 'Glycolysis', responseFormat: 'free', loId: LO };
    const RESTATED = numericGenFree('During cellular respiration, which stage takes place in the cytoplasm (outside the mitochondrion) and does not require oxygen to proceed?', 'Glycolysis');
    const FRESH = numericGenFree('A cell is poisoned so that its electron transport chain stops. Which stage of respiration can still make a small amount of ATP?', 'Glycolysis');
    const events: string[] = [];
    const ok = makeStubSources({ perCall: [RESTATED, FRESH], allowed: 1 });
    const items = await generatePracticeItems(baseOpts({ shortfall: 1, anchorItems: [stored], onDebugEvent: (t, m) => events.push(m) }), ok);
    assert.deepEqual(items.map((i) => i.problemText), [FRESH.problemText]);
    assert.equal(ok.persisted.length, 1);
    assert.deepEqual(events, [`loId=${LO} reason=near_duplicate`]);
    assert.ok(ok.excludeHashesSeen[1].includes('hash-0'), 'the retry excludes the rejected text');
    const never = makeStubSources({ gen: RESTATED, allowed: 1 });
    assert.deepEqual(await generatePracticeItems(baseOpts({ shortfall: 1, anchorItems: [stored] }), never), []);
    assert.equal(never.prompts.length, 2, 'one retry, no more');
    assert.equal(never.persisted.length, 0);
    delete process.env.PRACTICE_GEN;
  });
  await test('twins: a multiple-choice answer is compared by its option TEXT, not its letter', async () => {
    process.env.PRACTICE_GEN = 'on';
    const mcqA: GenPayload = { problemText: 'You tear a sheet of paper into 8 small strips. What type of change is this?', finalAnswer: 'A', responseFormat: 'mcq', choices: ['Physical change', 'Chemical change'] };
    const mcqB: GenPayload = { problemText: 'You shred a sheet of paper into many thin strips using a paper shredder. What type of change is this?', finalAnswer: 'B', responseFormat: 'mcq', choices: ['Chemical change', 'Physical change'] };
    const sources = makeStubSources({ perCall: [mcqA, mcqB], allowed: 2 });
    assert.equal((await generatePracticeItems(baseOpts({ shortfall: 2, anchorItems: [] }), sources)).length, 1);
    delete process.env.PRACTICE_GEN;
  });

  await test('prompt: every branch carries the do-not-repeat list, the precision rule, $…$ only, the skill-level rule; the slots differ', async () => {
    process.env.PRACTICE_GEN = 'on';
    const others: PracticeItem[] = [
      { ...bankAnchor, id: 'a1', problemText: 'Which complex receives electrons from FADH₂?' },
      { ...bankAnchor, id: 'a2', problemText: 'Which stage of respiration occurs outside the mitochondrion?' },
      { ...bankAnchor, id: 'a3', problemText: 'Sketch the mitochondrion and label the matrix.' },
    ];
    const run = async (o: Partial<GeneratePracticeItemsOptions>) => {
      const sources = makeStubSources({ gen: null });
      await generatePracticeItems({ studentId: 's', loId: LO, topic: TOPIC, shortfall: 2, anchorItems: [], ...o }, sources);
      return sources.prompts;
    };
    const anchored = await run({ anchorItems: others });
    const brandNew = await run({});
    const drawing = await run({ authoredDrawingTasks: true, loTitle: 'Graph linear inequalities' });
    for (const p of [...anchored, ...brandNew, ...drawing]) {
      assert.match(p, /MUST say how to give it: either a rounding precision/);
      assert.match(p, /"as a fraction" with finalAnswer the exact fraction/);
      assert.match(p, /wrap it in single dollar signs, \$…\$, and nothing else — never \\\( … \\\), \\\[ … \\\] or \$\$ … \$\$/);
      assert.match(p, /must make the student DO the skill the objective names/);
      assert.match(p, /never ask only for vocabulary/);
      assert.match(p, /must not state or describe its own answer/);
      assert.match(p, /A numeric problem asks for exactly ONE number and nothing else/);
    }
    for (const p of anchored) {
      assert.match(p, /Do NOT repeat or closely paraphrase any of them/);
      assert.ok(p.includes('- Which complex receives electrons from FADH₂?') && p.includes('- Which stage of respiration occurs outside the mitochondrion?'));
      assert.ok(!p.includes('Sketch the mitochondrion'), 'a drawing task is never shown to the generator');
      assert.match(p, /do NOT reuse its numbers, its context, its example or its question/);
    }
    assert.ok(brandNew.every((p) => !/Do NOT repeat or closely paraphrase/.test(p)), 'nothing to list for a skill with no items');
    for (const pair of [anchored, brandNew, drawing]) {
      assert.match(pair[0], /generation 1 of up to 2[^]*Yours is the DIRECT one[^]*use a standard one\./);
      assert.match(pair[1], /generation 2 of up to 2[^]*STRUCTURALLY distinct[^]*do NOT use the most familiar textbook one — choose a different, less common example/);
    }
    delete process.env.PRACTICE_GEN;
  });

  // ── (9) the global daily cap ──────────────────────────────────────────
  await test('cap: PRACTICE_GEN_GLOBAL_DAILY_CAP sets the global cap; anything unusable falls back to 500; never above 5000', () => {
    assert.equal(DEFAULT_CAP, 500);
    assert.equal(GLOBAL_DAILY_CAP_MAX, 5000);
    const cap = (v?: string) => globalDailyCap(v === undefined ? {} : { PRACTICE_GEN_GLOBAL_DAILY_CAP: v });
    assert.equal(cap(), 500);
    assert.equal(cap('2000'), 2000);
    assert.equal(cap(' 1500 '), 1500);
    assert.equal(cap('1'), 1);
    assert.equal(cap('5000'), 5000);
    for (const bad of ['', '   ', 'abc', '2k', '1e3', '12.5', '0', '-5', '5001', '100000', '99999999999999999999', 'NaN', 'Infinity', '0x10', '+50'])
      assert.equal(cap(bad), 500, JSON.stringify(bad));
  });
  await test('cap: the real reserve reads it at call time — raising it admits, removing it restores 500', async () => {
    const real = practiceGenSources();
    stubCounter(0, 500);
    assert.equal(await real.reserve('s-cap', LO, 2), 0, 'default 500: full');
    process.env.PRACTICE_GEN_GLOBAL_DAILY_CAP = '2000';
    stubCounter(0, 500);
    assert.equal(await real.reserve('s-cap', LO, 2), 2, 'raised to 2000: room');
    stubCounter(0, 1999);
    assert.equal(await real.reserve('s-cap', LO, 2), 1, 'only the room that is left');
    process.env.PRACTICE_GEN_GLOBAL_DAILY_CAP = 'lots';
    stubCounter(0, 500);
    assert.equal(await real.reserve('s-cap', LO, 2), 0, 'a typo is the default, not "no cap"');
    delete process.env.PRACTICE_GEN_GLOBAL_DAILY_CAP;
    stubCounter(0, 499);
    assert.equal(await real.reserve('s-cap', LO, 2), 1);
  });
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
})();

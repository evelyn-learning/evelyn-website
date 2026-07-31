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
  MAX_GENERATIONS_PER_REQUEST,
  PER_STUDENT_LO_DAILY_CAP,
  GLOBAL_DAILY_CAP,
  type PracticeGenSources,
  type GeneratePracticeItemsOptions,
} from './practice-gen';
import type { GenPayload } from '../voice/problem-generator';
import type { PracticeItem } from '@evelyn/portal-contract/v1';
import { ProblemBank } from '@/models/ProblemBank';
import { PracticeGenCounter } from '@/models/PracticeGenCounter';
import * as dbModule from '@/lib/db';

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

/** Stub sources: records calls, generateAndVerify resolves the given payload
 *  (or null) for every call unless overridden per-call via `perCall`. */
function makeStubSources(opts: {
  gen?: GenPayload | null;
  perCall?: Array<GenPayload | null | 'reject'>;
  allowed?: number;
} = {}): PracticeGenSources & {
  prompts: string[];
  persisted: unknown[];
  reserveCalls: Array<{ studentId: string; loId: string; n: number }>;
} {
  const prompts: string[] = [];
  const persisted: unknown[] = [];
  const reserveCalls: Array<{ studentId: string; loId: string; n: number }> = [];
  let callIndex = 0;
  return {
    prompts,
    persisted,
    reserveCalls,
    async generateAndVerify(userPrompt: string) {
      prompts.push(userPrompt);
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

await test('generated item shape: id prefix, letter mcq answer, internal-original license, no plan scoping', async () => {
  capturedPersist = null;
  await practiceGenSources().persist({
    id: `practice-gen.${LO}.abc123`,
    topic: TOPIC,
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

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
})();

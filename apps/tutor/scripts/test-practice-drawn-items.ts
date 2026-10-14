/**
 * Drawn-answer items (contract v1.22.0; portal/drawn-items.ts) — practice
 * items a student answers by drawing on the figure (points / a line on a
 * grid, an interval or ray on a number line), graded by the contract's pure
 * `gradeDrawn`.
 *
 * THE GATE: a drawn item is served only when ALL hold —
 *   - the caller is the practice route (`options.allowFigures`),
 *   - the request lists BOTH `figure` and `drawn` in `accepts`,
 *   - the partner is on `PRACTICE_DRAWN_ANSWER_PARTNERS` (unset ⇒ nobody).
 * Every other partner / request gets EXACTLY what it got before drawn rows
 * existed — proven below by comparing against the same pool without them.
 *
 * Old builds: a stored drawn row carries a `figure` with NO svg (the picture
 * and its frame are drawn at serve time from `figure.spec`). Every build
 * before this one default-denies a figure row and withholds a figure with no
 * svg — so a drawn row can never reach a build or partner that cannot take
 * it, even though it shares the bank collection with them.
 *
 * No database, no model: injected fakes; `ProblemBank.find` is replaced for
 * the adapter section (same convention as test-practice-figure-items.ts).
 *
 * Fixture: scripts/fixtures/drawn-practice-items.json — four example items as
 * the wire carries them, with sample answers and their grades, for the
 * academy. Checked against the serve path here; regenerate with
 *   UPDATE_DRAWN_FIXTURE=1 npm run test:practice-drawn-items
 *
 * Run: npm run test:practice-drawn-items
 */
// FIRST, before anything loads `@core/db`: no run of this file can reach a database.
import { NO_DB_URI } from './lib/no-db-env';
import { strict as assert } from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import {
  DrawnSpecSchema,
  RetrievePracticeResponseSchema,
  gradeDrawn,
  type DrawnSpec,
  type PracticeItem,
  type RetrievePracticeRequest,
} from '@evelyn/portal-contract/v1';
import { retrievePractice, type BankLite, type BankQueryOptions, type PlanLite, type PracticeSources } from '@/lib/tutor/portal/practice';
import {
  DRAWN_ANSWER_PARTNERS_ENV,
  NO_DRAWN_FILTER,
  acceptsDrawn,
  drawnAnswersForPartner,
  drawnRowFields,
  isDrawnRow,
  servableDrawn,
  type StoredDrawn,
  type StoredDrawnFigure,
} from '@/lib/tutor/portal/drawn-items';
import { carriesFigure, servableFigure } from '@/lib/tutor/portal/figure-items';
import { AUDITED_ONLY_PARTNERS_ENV } from '@/lib/tutor/portal/audited-items';
import { buildAssessment } from '@/lib/tutor/portal/assessment';
import { mongoPracticeSources, resolveAssessmentItem, resolveGradeItem, type ItemKeyDeps } from '@/lib/tutor/portal/adapters';
import { NO_GEN_SOURCES, resolveAssignmentItems } from '@/lib/tutor/practice-assign/resolve';
import { eligibleBankCandidates } from '@/lib/tutor/voice/problem-generator';
import { mockFormRows } from '@/lib/tutor/mock-exam/service';
import { LessonPlanModel } from '@/models/LessonPlan';
import { ProblemBank, type IProblemBank } from '@/models/ProblemBank';

(mongoose as unknown as { connect: (uri: unknown) => Promise<typeof mongoose> }).connect = async (uri) => {
  assert.equal(uri, NO_DB_URI);
  return mongoose;
};

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  const log = console.log;
  const warn = console.warn;
  try {
    console.log = () => {};
    console.warn = () => {};
    await fn();
    console.log = log;
    console.warn = warn;
    passed++;
    console.log(`  ok - ${name}`);
  } catch (e) {
    console.log = log;
    console.warn = warn;
    failed++;
    console.log(`  FAIL - ${name}`);
    console.error(e);
  } finally {
    console.log = log;
    console.warn = warn;
    delete process.env[DRAWN_ANSWER_PARTNERS_ENV];
    delete process.env[AUDITED_ONLY_PARTNERS_ENV];
    delete process.env.PRACTICE_GEN;
  }
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const LO = 'alg1.graphing-and-inequalities';
const GAC = 'greenapple';

const grid = (alt: string): StoredDrawnFigure => ({ alt, spec: { type: 'coordinate_grid', params: { xRange: [-5, 5], yRange: [-5, 5] } } });
const line = (alt: string, min: number, max: number): StoredDrawnFigure => ({ alt, spec: { type: 'number_line', params: { min, max, step: 1 } } });

const EXAMPLES: Array<{ id: string; problemText: string; answer: string; drawn: StoredDrawn; figure: StoredDrawnFigure }> = [
  {
    id: 'practice-gen.alg1.drawn.points-01',
    problemText: 'Plot the points A(2, 3) and B(−1, −4) on the grid.',
    answer: '(2, 3) and (−1, −4)',
    drawn: { kind: 'grid-points', snap: { x: 1, y: 1 }, tolerance: { x: 0.25, y: 0.25 }, key: { points: [[2, 3], [-1, -4]] } },
    figure: grid('A blank coordinate grid; x and y each run from −5 to 5.'),
  },
  {
    id: 'practice-gen.alg1.drawn.line-01',
    problemText: 'Graph the line y = 2x − 1. Place two points on it.',
    answer: 'y = 2x − 1',
    drawn: { kind: 'grid-line', snap: { x: 1, y: 1 }, tolerance: { x: 0.2, y: 0.2 }, key: { through: [[0, -1], [1, 1]] } },
    figure: grid('A blank coordinate grid; x and y each run from −5 to 5.'),
  },
  {
    id: 'practice-gen.alg1.drawn.interval-01',
    problemText: 'Show −2 < x ≤ 3 on the number line.',
    answer: '−2 < x ≤ 3',
    drawn: { kind: 'number-line-interval', snap: 1, tolerance: 0.25, key: { from: -2, to: 3, fromOpen: true, toOpen: false } },
    figure: line('A number line from −6 to 6, marked in ones.', -6, 6),
  },
  {
    id: 'practice-gen.alg1.drawn.ray-01',
    problemText: 'Solve 2x + 1 ≥ 7 and show the solution on the number line.',
    answer: 'x ≥ 3',
    drawn: { kind: 'number-line-interval', snap: 1, tolerance: 0.25, key: { from: 3, to: null, fromOpen: false, toOpen: false } },
    figure: line('A number line from 0 to 8, marked in ones.', 0, 8),
  },
];

const row = (id: string, over: Partial<BankLite> = {}): BankLite => ({
  id, problemText: `Bank question ${id}`, answer: '4', responseFormat: 'numeric', loId: LO, difficulty: 2, ...over,
});
const drawnRow = (e: (typeof EXAMPLES)[number]): BankLite => row(e.id, { problemText: e.problemText, answer: e.answer, ...drawnRowFields(e.drawn, e.figure) });

const T1 = row('alg1.text.01');
const T2 = row('alg1.text.02');
const DRAWN = EXAMPLES.map(drawnRow);
const POOL = [T1, ...DRAWN, T2];
const DRAWN_IDS = EXAMPLES.map((e) => e.id);

const plan: PlanLite = {
  id: 'alg1-graphing',
  topic: 'algebra-1',
  los: [{ id: LO }],
  segments: [{ kind: 'try_yourself', id: 'try-1', problem: 'Solve 3x = 12.', expectedAnswer: '4', responseFormat: 'numeric' }],
};

interface BankCall { opts?: BankQueryOptions }
function sourcesOf(bank: BankLite[], calls: BankCall[] = []): PracticeSources {
  return {
    plansForLoId: async (loId) => [plan].filter((p) => p.los.some((l) => l.id === loId)),
    plansForTopic: async () => [],
    bankForLoId: async (loId, _d, opts) => {
      calls.push({ opts });
      return bank.filter((b) => b.loId === loId);
    },
    bankForTopic: async (_t, _d, opts) => {
      calls.push({ opts });
      return bank;
    },
  };
}

const req = (over: Partial<RetrievePracticeRequest> = {}): RetrievePracticeRequest => ({
  studentId: 's1', courseId: 'c1', scope: { loId: LO }, count: 20, ...over,
});
const BOTH = { accepts: ['figure' as const, 'drawn' as const] };
const ROUTE = { allowFigures: true };
const ids = (r: { items: PracticeItem[] }) => r.items.map((i) => i.id);

/** The key itself, as a student answer. */
function keyAnswer(spec: DrawnSpec): unknown {
  if (spec.kind === 'grid-points') return { kind: spec.kind, points: spec.key.points };
  if (spec.kind === 'grid-line') return { kind: spec.kind, points: spec.key.through };
  return { kind: spec.kind, ...spec.key };
}

async function main(): Promise<void> {
  console.log('\nThe helpers (drawn-items.ts):\n');

  await test('drawnAnswersForPartner: comma list, trimmed, case-insensitive, whole ids; unset / blank ⇒ nobody; blank caller ⇒ never', () => {
    assert.equal(drawnAnswersForPartner(GAC, {}), false, 'unset');
    assert.equal(drawnAnswersForPartner(GAC, { [DRAWN_ANSWER_PARTNERS_ENV]: '' }), false, 'blank');
    assert.equal(drawnAnswersForPartner(GAC, { [DRAWN_ANSWER_PARTNERS_ENV]: 'greenapple' }), true);
    assert.equal(drawnAnswersForPartner(' GreenApple ', { [DRAWN_ANSWER_PARTNERS_ENV]: 'crimsora, greenapple ' }), true);
    assert.equal(drawnAnswersForPartner('green', { [DRAWN_ANSWER_PARTNERS_ENV]: 'greenapple' }), false, 'whole ids only');
    assert.equal(drawnAnswersForPartner('', { [DRAWN_ANSWER_PARTNERS_ENV]: 'greenapple,' }), false, 'blank caller');
    assert.equal(drawnAnswersForPartner(undefined, { [DRAWN_ANSWER_PARTNERS_ENV]: 'greenapple' }), false);
    process.env[DRAWN_ANSWER_PARTNERS_ENV] = 'greenapple';
    assert.equal(drawnAnswersForPartner(GAC), true, 'read from process.env at call time');
  });

  await test('acceptsDrawn / isDrawnRow', () => {
    assert.equal(acceptsDrawn(req(BOTH)), true);
    assert.equal(acceptsDrawn(req({ accepts: ['figure'] })), false);
    assert.equal(acceptsDrawn(req()), false);
    assert.equal(acceptsDrawn(null), false);
    for (const d of DRAWN) assert.equal(isDrawnRow(d), true);
    assert.equal(isDrawnRow(T1), false);
    assert.equal(isDrawnRow({ id: 'x', responseFormat: 'drawn' }), true, 'the format alone marks it (fail closed)');
    assert.equal(isDrawnRow({ id: 'x', drawn: null }), true, 'any `drawn` value marks it');
    assert.deepEqual(NO_DRAWN_FILTER, { responseFormat: { $ne: 'drawn' }, drawn: { $exists: false } });
  });

  await test('servableDrawn: the stored row becomes { figure with svg, drawn spec with the frame }, and its key grades correct', () => {
    for (const d of DRAWN) {
      const s = servableDrawn(d.id, d);
      assert.ok(s, d.id);
      assert.ok(s.figure.svg.startsWith('<svg'));
      DrawnSpecSchema.parse(s.drawn);
      assert.deepEqual(gradeDrawn(s.drawn, keyAnswer(s.drawn)), { gradable: true, correct: true, reason: 'correct' });
      assert.deepEqual(s.figure.spec, (d.figure as StoredDrawnFigure).spec);
    }
  });

  await test('servableDrawn WITHHOLDS (null) a row it cannot serve correctly', () => {
    const e = EXAMPLES[0];
    const bad: Array<[string, { figure?: unknown; drawn?: unknown }]> = [
      ['no figure', { drawn: e.drawn }],
      ['no alt', { drawn: e.drawn, figure: { spec: e.figure.spec } }],
      ['no spec', { drawn: e.drawn, figure: { alt: 'x' } }],
      ['unknown kind', { drawn: { ...e.drawn, kind: 'grid-region' }, figure: e.figure }],
      ['key outside the frame', { drawn: { ...e.drawn, key: { points: [[9, 9]] } }, figure: e.figure }],
      ['tolerance over half the snap', { drawn: { ...e.drawn, tolerance: { x: 0.9, y: 0.9 } }, figure: e.figure }],
      ['grid kind on a number line', { drawn: e.drawn, figure: EXAMPLES[2].figure }],
      ['interval kind on a grid', { drawn: EXAMPLES[2].drawn, figure: e.figure }],
      ['a figure kind that draws data (could show the answer)', { drawn: e.drawn, figure: { alt: 'x', spec: { type: 'function_graph', params: { xRange: [-5, 5], yRange: [-5, 5], points: [{ x: 2, y: 3 }] } } } }],
      ['a number line that already shows an interval', { drawn: EXAMPLES[2].drawn, figure: { alt: 'x', spec: { type: 'number_line', params: { min: -6, max: 6, intervals: [{ from: -2, to: 3 }] } } } }],
      ['a number line that already shows a point', { drawn: EXAMPLES[2].drawn, figure: { alt: 'x', spec: { type: 'number_line', params: { min: -6, max: 6, points: [{ x: 3 }] } } } }],
      ['a spec that does not render', { drawn: e.drawn, figure: { alt: 'x', spec: { type: 'coordinate_grid', params: { xRange: [5, -5], yRange: [0, 1] } } } }],
      ['drawn not an object', { drawn: 'grid', figure: e.figure }],
    ];
    for (const [why, r] of bad) assert.equal(servableDrawn('x', r), null, why);
  });

  await test('drawnRowFields refuses at authoring time what servableDrawn would withhold', () => {
    assert.throws(() => drawnRowFields({ ...EXAMPLES[0].drawn, key: { points: [[9, 9]] } } as StoredDrawn, EXAMPLES[0].figure));
    assert.throws(() => drawnRowFields(EXAMPLES[0].drawn, EXAMPLES[2].figure));
    const f = drawnRowFields(EXAMPLES[1].drawn, EXAMPLES[1].figure);
    assert.equal(f.responseFormat, 'drawn');
    assert.equal('svg' in f.figure, false, 'no svg is stored');
  });

  console.log('\nOld builds (default-deny of figure rows, as shipped in v1.21.0):\n');

  await test('a stored drawn row is a figure row with NO svg — so every earlier build drops or withholds it', () => {
    for (const d of DRAWN) {
      assert.equal(carriesFigure(d), true, 'default-denied by every non-practice reader');
      assert.equal(servableFigure(d.id, d.figure), null, 'withheld even for a caller that accepts figures');
    }
  });

  console.log('\nThe gate (retrievePractice):\n');

  await test('greenapple listed + accepts [figure, drawn] + practice route ⇒ drawn items served, with figure and frame, wire-valid', async () => {
    process.env[DRAWN_ANSWER_PARTNERS_ENV] = GAC;
    const calls: BankCall[] = [];
    const r = await retrievePractice(req(BOTH), sourcesOf(POOL, calls), NO_GEN_SOURCES, { partnerId: GAC }, ROUTE);
    for (const id of DRAWN_IDS) assert.ok(ids(r).includes(id), id);
    assert.ok(calls.every((c) => c.opts?.figures === true && c.opts?.drawn === true));
    const parsed = RetrievePracticeResponseSchema.parse(r);
    for (const it of parsed.items.filter((i) => DRAWN_IDS.includes(i.id))) {
      assert.equal(it.responseFormat, 'drawn');
      assert.ok(it.figure && it.drawn);
      assert.equal(gradeDrawn(it.drawn, keyAnswer(it.drawn)).correct, true);
    }
    // Text items unchanged.
    const baseline = await retrievePractice(req(BOTH), sourcesOf([T1, T2]), NO_GEN_SOURCES, { partnerId: GAC }, ROUTE);
    assert.deepEqual(r.items.filter((i) => !DRAWN_IDS.includes(i.id)), baseline.items);
  });

  /** Everything that must NOT get drawn items, each compared with the same request over the pool WITHOUT them. */
  const denied: Array<[string, string | undefined, string | undefined, Partial<RetrievePracticeRequest>, { allowFigures?: boolean } | undefined]> = [
    ['env unset', undefined, GAC, BOTH, ROUTE],
    ['env blank', '', GAC, BOTH, ROUTE],
    ['another partner (crimsora)', GAC, 'crimsora', BOTH, ROUTE],
    ['unknown caller', GAC, undefined, BOTH, ROUTE],
    ['accepts [figure] only', GAC, GAC, { accepts: ['figure'] }, ROUTE],
    ['accepts [drawn] only (no figure)', GAC, GAC, { accepts: ['drawn'] }, ROUTE],
    ['no accepts', GAC, GAC, {}, ROUTE],
    ['not the practice route (no allowFigures)', GAC, GAC, BOTH, undefined],
  ];
  for (const [why, env, partner, over, options] of denied) {
    await test(`denied — ${why}: exactly the result without drawn rows`, async () => {
      if (env !== undefined) process.env[DRAWN_ANSWER_PARTNERS_ENV] = env;
      const caller = partner ? { partnerId: partner } : undefined;
      const calls: BankCall[] = [];
      const withDrawn = await retrievePractice(req(over), sourcesOf(POOL, calls), NO_GEN_SOURCES, caller, options);
      const today = await retrievePractice(req(over), sourcesOf([T1, T2]), NO_GEN_SOURCES, caller, options);
      assert.deepEqual(withDrawn, today);
      assert.ok(!JSON.stringify(withDrawn).includes('"drawn"'));
      assert.ok(calls.every((c) => c.opts?.drawn !== true), 'the bank is never asked for drawn rows');
    });
  }

  await test('topic scope applies the same gate', async () => {
    process.env[DRAWN_ANSWER_PARTNERS_ENV] = GAC;
    const topic = { scope: { topicId: 'algebra-1' } };
    const yes = await retrievePractice(req({ ...topic, ...BOTH }), sourcesOf(POOL), NO_GEN_SOURCES, { partnerId: GAC }, ROUTE);
    assert.ok(DRAWN_IDS.every((id) => ids(yes).includes(id)));
    const no = await retrievePractice(req({ ...topic, ...BOTH }), sourcesOf(POOL), NO_GEN_SOURCES, { partnerId: 'crimsora' }, ROUTE);
    assert.deepEqual(no, await retrievePractice(req({ ...topic, ...BOTH }), sourcesOf([T1, T2]), NO_GEN_SOURCES, { partnerId: 'crimsora' }, ROUTE));
  });

  await test('the audited-only gate still applies first: an unaudited practice-gen drawn row is not served to an audited-only partner', async () => {
    process.env[DRAWN_ANSWER_PARTNERS_ENV] = GAC;
    process.env[AUDITED_ONLY_PARTNERS_ENV] = GAC;
    const r = await retrievePractice(req(BOTH), sourcesOf(POOL), NO_GEN_SOURCES, { partnerId: GAC }, ROUTE);
    assert.ok(DRAWN_IDS.every((id) => !ids(r).includes(id)));
  });

  await test('a malformed drawn row is withheld (never served bare, never as text)', async () => {
    process.env[DRAWN_ANSWER_PARTNERS_ENV] = GAC;
    const broken = row('practice-gen.alg1.drawn.broken', { responseFormat: 'drawn', drawn: { kind: 'grid-points' }, figure: EXAMPLES[0].figure });
    const formatOnly = row('practice-gen.alg1.drawn.format-only', { responseFormat: 'drawn' });
    const r = await retrievePractice(req(BOTH), sourcesOf([T1, broken, formatOnly, T2]), NO_GEN_SOURCES, { partnerId: GAC }, ROUTE);
    assert.deepEqual(r, await retrievePractice(req(BOTH), sourcesOf([T1, T2]), NO_GEN_SOURCES, { partnerId: GAC }, ROUTE));
    // And for everyone else a format-only row (no figure) is not a text item either.
    const other = await retrievePractice(req(), sourcesOf([T1, formatOnly, T2]), NO_GEN_SOURCES, { partnerId: 'crimsora' }, ROUTE);
    assert.deepEqual(other, await retrievePractice(req(), sourcesOf([T1, T2]), NO_GEN_SOURCES, { partnerId: 'crimsora' }, ROUTE));
  });

  console.log('\nEvery other reader of the bank:\n');

  await test('assessment, assigned practice, show_problem and mock forms never take a drawn row', async () => {
    process.env[DRAWN_ANSWER_PARTNERS_ENV] = GAC;
    const set = await buildAssessment({ studentId: 's1', courseId: 'c1', loIds: [LO], maxPerLo: 20 }, sourcesOf(POOL), NO_GEN_SOURCES);
    assert.ok(set.items.every((i) => !DRAWN_IDS.includes(i.itemId)));
    const assigned = await resolveAssignmentItems({ los: [{ loId: LO, title: 'Graphs' }], band: 'steady', seenItemIds: [], studentId: 's1', courseId: 'c1' }, sourcesOf(POOL));
    assert.ok(assigned.flatMap((l) => l.items.map((i) => i.id)).every((id) => !DRAWN_IDS.includes(id)));
    const cands = POOL.map((b) => ({ ...b, _id: b.id })) as unknown as IProblemBank[];
    assert.deepEqual(eligibleBankCandidates(cands, [], GAC).map((c) => c.id), [T1.id, T2.id]);
    assert.deepEqual(mockFormRows(POOL).map((r) => r.id), [T1.id, T2.id]);
  });

  await test('the engine never grades a drawn item (no model judge, no tokens): both key resolvers return null', async () => {
    const deps: ItemKeyDeps = {
      getStoredPlan: async () => null,
      findBankRow: async (id) => (id === DRAWN[1].id ? ({ ...DRAWN[1] } as unknown as IProblemBank) : id === T1.id ? ({ ...T1 } as unknown as IProblemBank) : null),
    };
    assert.equal(await resolveGradeItem(DRAWN[1].id, deps), null);
    assert.equal(await resolveAssessmentItem(DRAWN[1].id, deps), null);
    assert.equal((await resolveGradeItem(T1.id, deps))?.expectedAnswer, '4', 'text items unchanged');
  });

  console.log('\nProduction adapter (stubbed Mongo — no connection):\n');

  await test('the bank query leaves drawn rows out unless drawn items may be served; when they may, `drawn` is carried through', async () => {
    const stored = { id: DRAWN[0].id, problemText: DRAWN[0].problemText, answer: DRAWN[0].answer, responseFormat: 'drawn', difficulty: 2, loId: LO, figure: DRAWN[0].figure, drawn: DRAWN[0].drawn };
    const text = { id: T1.id, problemText: T1.problemText, answer: '4', responseFormat: 'numeric', difficulty: 2, loId: LO };
    const filters: Array<Record<string, unknown>> = [];
    (LessonPlanModel as unknown as { find: () => { limit: () => Promise<unknown[]> } }).find = () => ({ limit: async () => [] });
    (ProblemBank as unknown as { find: (f: Record<string, unknown>) => { limit: () => { lean: () => Promise<unknown[]> } } }).find = (f) => {
      filters.push(f);
      const noDrawn = JSON.stringify(f.drawn) === JSON.stringify({ $exists: false });
      const noFig = JSON.stringify(f.figure) === JSON.stringify({ $exists: false });
      return { limit: () => ({ lean: async () => [stored, text].filter((r) => (!noDrawn || !('drawn' in r)) && (!noFig || !('figure' in r))) }) };
    };
    process.env[DRAWN_ANSWER_PARTNERS_ENV] = GAC;
    const figOnly = await retrievePractice(req({ accepts: ['figure'] }), mongoPracticeSources(), NO_GEN_SOURCES, { partnerId: GAC }, ROUTE);
    assert.ok(ids(figOnly).includes(T1.id));
    assert.ok(!ids(figOnly).includes(DRAWN[0].id));
    assert.deepEqual(filters[0].responseFormat, { $ne: 'drawn' });
    assert.deepEqual(filters[0].drawn, { $exists: false });
    filters.length = 0;
    const both = await retrievePractice(req(BOTH), mongoPracticeSources(), NO_GEN_SOURCES, { partnerId: GAC }, ROUTE);
    assert.equal('drawn' in filters[0], false);
    assert.equal('responseFormat' in filters[0], false);
    const it = both.items.find((i) => i.id === DRAWN[0].id);
    assert.ok(it?.drawn && it.figure);
    RetrievePracticeResponseSchema.parse(both);
  });

  console.log('\nStored shape (models/ProblemBank.ts — no connection):\n');

  await test('ProblemBank stores responseFormat drawn, a Mixed `drawn`, and a figure without svg ONLY on a drawn row', () => {
    const baseDoc = { id: 'x.1', topic: 'algebra-1', difficulty: 2, problemText: 'q', answer: '1', source: { name: 'Evelyn (original)' }, license: 'internal-original', verifiedAt: new Date(0), verifierModel: 'test' };
    const Model = ProblemBank as unknown as new (d: unknown) => { validateSync(): { errors: Record<string, unknown> } | undefined; toObject(): Record<string, unknown> };
    const fields = drawnRowFields(EXAMPLES[0].drawn, EXAMPLES[0].figure);
    const good = new Model({ ...baseDoc, ...fields });
    assert.equal(good.validateSync(), undefined);
    const obj = JSON.parse(JSON.stringify(good.toObject()));
    assert.deepEqual(obj.drawn, JSON.parse(JSON.stringify(EXAMPLES[0].drawn)));
    assert.deepEqual(obj.figure, JSON.parse(JSON.stringify(EXAMPLES[0].figure)));
    // A non-drawn row still needs its svg.
    assert.ok(new Model({ ...baseDoc, responseFormat: 'numeric', figure: EXAMPLES[0].figure }).validateSync()?.errors['figure.svg']);
    assert.ok(new Model({ ...baseDoc, figure: EXAMPLES[0].figure }).validateSync()?.errors['figure.svg']);
    assert.ok(new Model({ ...baseDoc, responseFormat: 'sketch' }).validateSync()?.errors.responseFormat);
  });

  console.log('\nFixture for the academy (scripts/fixtures/drawn-practice-items.json):\n');

  await test('the fixture is what the serve path produces, and its sample answers grade as recorded', async () => {
    process.env[DRAWN_ANSWER_PARTNERS_ENV] = GAC;
    const r = await retrievePractice(req({ ...BOTH, count: 4 }), sourcesOf(DRAWN), NO_GEN_SOURCES, { partnerId: GAC }, ROUTE);
    const items = r.items.filter((i) => DRAWN_IDS.includes(i.id)).sort((a, b) => DRAWN_IDS.indexOf(a.id) - DRAWN_IDS.indexOf(b.id));
    assert.equal(items.length, 4);
    const ans = (o: unknown) => JSON.stringify(o);
    const samples: Array<[string, unknown]> = [
      [DRAWN_IDS[0], { kind: 'grid-points', points: [[-1, -4], [2, 3]] }],
      [DRAWN_IDS[0], { kind: 'grid-points', points: [[3, 2], [-1, -4]] }],
      [DRAWN_IDS[0], { kind: 'grid-points', points: [[2, 3]] }],
      [DRAWN_IDS[1], { kind: 'grid-line', points: [[2, 3], [-1, -3]] }],
      [DRAWN_IDS[1], { kind: 'grid-line', points: [[0, 1], [1, 3]] }],
      [DRAWN_IDS[2], { kind: 'number-line-interval', from: -2, to: 3, fromOpen: true, toOpen: false }],
      [DRAWN_IDS[2], { kind: 'number-line-interval', from: -2, to: 3, fromOpen: false, toOpen: false }],
      [DRAWN_IDS[3], { kind: 'number-line-interval', from: 3, to: null, fromOpen: false, toOpen: false }],
      [DRAWN_IDS[3], { kind: 'number-line-interval', from: null, to: 3, fromOpen: false, toOpen: false }],
      [DRAWN_IDS[3], { kind: 'number-line-interval', from: 3, to: null, fromOpen: true, toOpen: false }],
    ];
    const fixture = {
      about: 'Contract v1.22.0 drawn-answer practice items exactly as POST /api/portal/v1/practice returns them (greenapple, accepts [figure, drawn]), with sample answers as the attempt `answer` string and the grade @evelyn/portal-contract gradeDrawn gives. Generated and checked by apps/tutor/scripts/test-practice-drawn-items.ts.',
      items: JSON.parse(JSON.stringify(items)),
      answers: samples.map(([itemId, a]) => {
        const it = items.find((i) => i.id === itemId) as PracticeItem;
        return { itemId, answer: ans(a), grade: gradeDrawn(it.drawn, ans(a)) };
      }),
    };
    assert.deepEqual(fixture.answers.map((a) => a.grade.reason), ['correct', 'wrong-position', 'wrong-count', 'correct', 'wrong-line', 'correct', 'wrong-endpoint-type', 'correct', 'wrong-direction', 'wrong-endpoint-type']);
    const file = path.resolve(__dirname, 'fixtures/drawn-practice-items.json');
    if (process.env.UPDATE_DRAWN_FIXTURE === '1') fs.writeFileSync(file, `${JSON.stringify(fixture, null, 2)}\n`);
    assert.deepEqual(JSON.parse(fs.readFileSync(file, 'utf8')), fixture);
    RetrievePracticeResponseSchema.parse({ items: fixture.items });
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

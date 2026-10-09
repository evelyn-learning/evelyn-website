/**
 * Figure items — a practice item that carries a figure is DEFAULT-DENIED
 * (contract v1.21.0; portal/figure-items.ts).
 *
 * The defect this exists to prevent: a question that says "the graph shows…"
 * served WITHOUT the graph, then machine-graded. So a bank row with a
 * `figure` is returned by exactly one path — the practice route, for a
 * request that lists `figure` in `accepts` — and then with its figure.
 *
 * Under test, one section per reader of the bank:
 *   - portal/practice.ts `retrievePractice` — LO, topic and skill scope; the
 *     two-key gate (`accepts` AND `options.allowFigures`); a bad stored
 *     figure withholds the item; a figure item takes no slot; never a
 *     generation anchor; withdrawn and audited-only still apply;
 *   - the wire shape against `RetrievePracticeResponseSchema` /
 *     `PracticeFigureSchema`;
 *   - portal/assessment.ts `buildAssessment`;
 *   - practice-assign/resolve.ts `resolveAssignmentItems`;
 *   - portal/practice-gen.ts `generatePracticeItemsDetailed` (anchors,
 *     exclude hashes);
 *   - voice/problem-generator.ts `eligibleBankCandidates` +
 *     `sessionBankFilter` (show_problem);
 *   - mock-exam/service.ts `mockFormRows`;
 *   - portal/adapters.ts — the production adapter over STUBBED Mongo (query
 *     filter, figure carried through), and the grading resolvers UNCHANGED;
 *   - POST /api/portal/v1/practice end to end over the stubbed adapter;
 *   - portal/practice-coverage.ts — the `figures` option;
 *   - models/ProblemBank.ts — the stored shape.
 *
 * No database, no model: injected fakes; `mongoose.connect`,
 * `LessonPlanModel.find` and `ProblemBank.find` are replaced for the adapter
 * and route sections (same convention as test-practice-skill-scope.ts).
 *
 * Run — either runner:
 *   npm run test:practice-figure-items
 *   npx tsx scripts/test-practice-figure-items.ts
 */
// FIRST, before anything loads `@core/db`: no run of this file can reach a database.
import { NO_DB_URI } from './lib/no-db-env';
import { strict as assert } from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';

process.env.PORTAL_PARTNER_SECRETS = JSON.stringify({ portalA: 'secret-a' });

import { signPortalRequest } from '@evelyn/portal-contract/auth';
import {
  PracticeFigureSchema,
  RetrievePracticeRequestSchema,
  RetrievePracticeResponseSchema,
  type PracticeItem,
  type RetrievePracticeRequest,
} from '@evelyn/portal-contract/v1';
import type { NextRequest } from 'next/server';
import { retrievePractice, type BankLite, type BankQueryOptions, type PlanLite, type PracticeSources } from '@/lib/tutor/portal/practice';
import {
  MAX_FIGURE_ALT_CHARS,
  NO_FIGURE_FILTER,
  acceptsFigures,
  carriesFigure,
  servableFigure,
  withoutFigureItems,
} from '@/lib/tutor/portal/figure-items';
import { generatePracticeItemsDetailed, type PracticeGenSources } from '@/lib/tutor/portal/practice-gen';
import { AUDITED_GENERATED_ITEM_IDS, AUDITED_ONLY_PARTNERS_ENV } from '@/lib/tutor/portal/audited-items';
import { WITHDRAWN_ITEM_IDS } from '@/lib/tutor/portal/withdrawn-items';
import { buildAssessment } from '@/lib/tutor/portal/assessment';
import { mongoPracticeSources, resolveAssessmentItem, resolveGradeItem, type ItemKeyDeps } from '@/lib/tutor/portal/adapters';
import { resolveAssignmentItems, NO_GEN_SOURCES } from '@/lib/tutor/practice-assign/resolve';
import { eligibleBankCandidates, sessionBankFilter, simpleHash } from '@/lib/tutor/voice/problem-generator';
import { mockFormRows } from '@/lib/tutor/mock-exam/service';
import { skillCoverage, summarizeCoverage } from '@/lib/tutor/portal/practice-coverage';
import { buildPracticeFigure } from '@/lib/tutor/practice-figure/render';
import { MAX_FIGURE_SVG_CHARS } from '@/lib/tutor/practice-figure/svg-safety';
import { LessonPlanModel } from '@/models/LessonPlan';
import { ProblemBank, type IProblemBank } from '@/models/ProblemBank';
import { POST as practicePOST } from '@/app/api/portal/v1/practice/route';
import { __setLimitsDepsOverrideForTests, __setRegistryOverrideForTests } from '@/lib/tutor/portal/auth';

let connectCalls = 0;
const connectUris: unknown[] = [];
(mongoose as unknown as { connect: (uri: unknown) => Promise<typeof mongoose> }).connect = async (uri) => {
  connectCalls++;
  connectUris.push(uri);
  return mongoose;
};

let passed = 0;
let failed = 0;
/** Lines the code under test logged during the current test. */
let logged: string[] = [];
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  const log = console.log;
  const warn = console.warn;
  logged = [];
  try {
    console.log = (...a: unknown[]) => { logged.push(a.map(String).join(' ')); };
    console.warn = (...a: unknown[]) => { logged.push(a.map(String).join(' ')); };
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
    delete process.env.PRACTICE_GEN;
    delete process.env[AUDITED_ONLY_PARTNERS_ENV];
  }
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const LO = 'phys.kinematics-graphs';
const TOPIC = 'physics-1';
const P1 = 'partner-one';

/** A real figure, drawn by the authoring renderer. */
const FIGURE = buildPracticeFigure(
  { type: 'motion_graph', params: { quantity: 'position', series: [{ points: [[0, 0], [2, 8], [5, 8], [8, -4]] }] } },
  'A position–time graph that rises, stays level, then falls below zero.',
);

const plan: PlanLite = {
  id: 'phys-kinematics',
  topic: TOPIC,
  los: [{ id: LO, standard: 'PHYS.1.2' }],
  segments: [{ kind: 'try_yourself', id: 'try-1', problem: 'A car travels 120 m in 8 s. Find its average speed.', expectedAnswer: '15', responseFormat: 'numeric' }],
};

const row = (id: string, over: Partial<BankLite> = {}): BankLite => ({
  id, problemText: `Bank question ${id}`, answer: '4', responseFormat: 'numeric', loId: LO, difficulty: 2, ...over,
});

const T1 = row('phys.text.01');
const T2 = row('phys.text.02');
const F1 = row('phys.figure.01', { problemText: 'The graph shows the position of a cyclist. What is the velocity between t = 5 s and t = 8 s?', answer: '-4', figure: FIGURE });
/** Stored figures that must WITHHOLD their item, never serve it bare. */
const F_SCRIPT = row('phys.figure.script', { figure: { svg: FIGURE.svg.replace('</svg>', '<script>alert(1)</script></svg>'), alt: 'x' } });
const F_NULL = row('phys.figure.null', { figure: null });
const F_NOALT = row('phys.figure.noalt', { figure: { svg: FIGURE.svg } });
const F_STRING = row('phys.figure.string', { figure: '<svg/>' });
const F_HUGE = row('phys.figure.huge', { figure: { svg: `<svg viewBox="0 0 1 1">${'<g></g>'.repeat(30_000)}</svg>`, alt: 'x' } });
const BAD_FIGURES = [F_SCRIPT, F_NULL, F_NOALT, F_STRING, F_HUGE];
const POOL = [F1, T1, ...BAD_FIGURES, T2];

interface BankCall { loId?: string; topicId?: string; opts?: BankQueryOptions }
function sourcesOf(plans: PlanLite[], bank: BankLite[], calls: BankCall[] = []): PracticeSources {
  return {
    plansForLoId: async (loId) => plans.filter((p) => p.los.some((l) => l.id === loId)),
    plansForTopic: async (topicId) => plans.filter((p) => p.topic === topicId),
    bankForLoId: async (loId, difficulty, opts) => {
      calls.push({ loId, opts });
      return bank.filter((b) => b.loId === loId && (!difficulty || b.difficulty === difficulty));
    },
    bankForTopic: async (topicId, _difficulty, opts) => {
      calls.push({ topicId, opts });
      return topicId === TOPIC ? bank : [];
    },
  };
}

const req = (over: Partial<RetrievePracticeRequest> = {}): RetrievePracticeRequest => ({
  studentId: 's1', courseId: 'c1', scope: { loId: LO }, count: 20, ...over,
});
const FIG = { accepts: ['figure' as const] };
const ROUTE = { allowFigures: true };
const ids = (r: { items: PracticeItem[] }) => r.items.map((i) => i.id);
const withFigure = (r: { items: PracticeItem[] }) => r.items.filter((i) => 'figure' in i).map((i) => i.id);
const TEXT_IDS = [T1.id, T2.id, 'phys-kinematics::try-1'];

async function main(): Promise<void> {
  console.log('\nContract pin:\n');

  await test('the repo pins @evelyn/portal-contract v1.21.0 and the installed schema has `accepts` and `figure`', () => {
    const rootPkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../package.json'), 'utf8'));
    assert.equal(rootPkg.dependencies['@evelyn/portal-contract'], 'github:evelyn-learning/portal-contract#v1.21.0');
    assert.deepEqual(RetrievePracticeRequestSchema.parse(req(FIG)).accepts, ['figure']);
    assert.equal(RetrievePracticeRequestSchema.safeParse({ ...req(), accepts: ['video'] }).success, false);
    PracticeFigureSchema.parse(FIGURE);
  });

  console.log('\nThe helpers (figure-items.ts):\n');

  await test('carriesFigure: any stored `figure` value counts, including null and malformed ones', () => {
    assert.equal(carriesFigure(T1), false);
    assert.equal(carriesFigure({ id: 'x', figure: undefined }), false);
    for (const r of [F1, ...BAD_FIGURES]) assert.equal(carriesFigure(r), true, r.id);
    assert.equal(carriesFigure(null), false);
  });

  await test('acceptsFigures reads the request list only', () => {
    assert.equal(acceptsFigures(req(FIG)), true);
    assert.equal(acceptsFigures(req()), false);
    assert.equal(acceptsFigures({ accepts: [] }), false);
    assert.equal(acceptsFigures({ accepts: null }), false);
    assert.equal(acceptsFigures(undefined), false);
  });

  await test('withoutFigureItems drops and logs one line per id', () => {
    assert.deepEqual(withoutFigureItems(POOL, 'unit').map((r) => r.id), [T1.id, T2.id]);
    assert.equal(logged.filter((l) => l.startsWith('[practice] figure item not served')).length, 6);
    assert.ok(logged.includes(`[practice] figure item not served ${F1.id} where=unit`));
  });

  await test('servableFigure: a good figure passes with its spec; every bad shape is withheld with a reason', () => {
    const ok = servableFigure(F1.id, FIGURE);
    assert.deepEqual(ok, FIGURE);
    PracticeFigureSchema.parse(ok);
    for (const r of BAD_FIGURES) assert.equal(servableFigure(r.id, r.figure), null, r.id);
    assert.equal(servableFigure('a', { svg: FIGURE.svg, alt: '   ' }), null);
    assert.equal(servableFigure('a', { svg: FIGURE.svg, alt: 'x'.repeat(MAX_FIGURE_ALT_CHARS + 1) }), null);
    assert.equal(servableFigure('a', { svg: `${FIGURE.svg}<svg viewBox="0 0 1 1"></svg>`, alt: 'two roots' }), null);
    assert.ok(F_HUGE.figure && (F_HUGE.figure as { svg: string }).svg.length > MAX_FIGURE_SVG_CHARS);
    assert.ok(logged.some((l) => l.includes(`figure item withheld ${F_SCRIPT.id}: unsafe svg (script_element)`)), logged.join('\n'));
    assert.ok(logged.some((l) => l.includes(`figure item withheld ${F_HUGE.id}: svg over 200000 characters`)));
    // The spec is optional: a malformed one is dropped, the figure still serves.
    assert.deepEqual(servableFigure('a', { svg: FIGURE.svg, alt: 'ok', spec: 'motion' }), { svg: FIGURE.svg, alt: 'ok' });
  });

  console.log('\nretrievePractice — the gate:\n');

  await test('no `accepts` ⇒ text items only, exactly the text pool, no `figure` key anywhere', async () => {
    const calls: BankCall[] = [];
    const r = await retrievePractice(req(), sourcesOf([plan], POOL, calls), NO_GEN_SOURCES, undefined, ROUTE);
    assert.deepEqual(ids(r), TEXT_IDS);
    assert.deepEqual(withFigure(r), []);
    assert.ok(!JSON.stringify(r).includes('<svg'));
    assert.deepEqual(calls.map((c) => c.opts), [{ figures: false }], 'the source is told not to load figure rows');
    for (const f of [F1, ...BAD_FIGURES]) assert.ok(logged.includes(`[practice] figure item not served ${f.id} where=practice-lo`), f.id);
    RetrievePracticeResponseSchema.parse({ items: r.items });
  });

  await test('`accepts` WITHOUT allowFigures (any caller that is not the practice route) ⇒ still text only', async () => {
    for (const options of [undefined, {}, { allowFigures: false }]) {
      const calls: BankCall[] = [];
      const r = await retrievePractice(req(FIG), sourcesOf([plan], POOL, calls), NO_GEN_SOURCES, undefined, options);
      assert.deepEqual(ids(r), TEXT_IDS);
      assert.deepEqual(calls.map((c) => c.opts), [{ figures: false }]);
    }
  });

  await test('`accepts: [figure]` on the practice route ⇒ the figure item, WITH its figure; bad stored figures are withheld, never served bare', async () => {
    const calls: BankCall[] = [];
    const r = await retrievePractice(req(FIG), sourcesOf([plan], POOL, calls), NO_GEN_SOURCES, undefined, ROUTE);
    assert.deepEqual(ids(r), [F1.id, ...TEXT_IDS]);
    assert.deepEqual(withFigure(r), [F1.id]);
    const item = r.items[0];
    assert.deepEqual(item.figure, FIGURE);
    assert.equal(item.expectedAnswer, '-4');
    assert.equal(item.source, 'bank');
    assert.deepEqual(calls.map((c) => c.opts), [{ figures: true }]);
    for (const f of BAD_FIGURES) assert.ok(logged.some((l) => l.includes(`figure item withheld ${f.id}`)), f.id);
    // Wire shape.
    const parsed = RetrievePracticeResponseSchema.parse({ items: r.items });
    assert.deepEqual(PracticeFigureSchema.parse(parsed.items[0].figure), FIGURE);
    assert.equal(parsed.items.filter((i) => i.figure).length, 1);
  });

  await test('a figure item takes no slot from a text-only caller, and its shortfall is honest', async () => {
    const r = await retrievePractice(req({ count: 2 }), sourcesOf([plan], [F1, T1, T2]), NO_GEN_SOURCES, undefined, ROUTE);
    assert.deepEqual(ids(r), [T1.id, T2.id]);
    // Only a figure item exists: a text-only caller gets nothing, and is told so.
    const only = await retrievePractice(req(), sourcesOf([{ ...plan, segments: [] }], [F1]), NO_GEN_SOURCES, undefined, ROUTE);
    assert.deepEqual(only.items, []);
    assert.equal(only.emptyReason, 'none_available');
    const accepted = await retrievePractice(req(FIG), sourcesOf([{ ...plan, segments: [] }], [F1]), NO_GEN_SOURCES, undefined, ROUTE);
    assert.deepEqual(withFigure(accepted), [F1.id]);
  });

  await test('excludeIds and difficulty apply to a figure item like any other', async () => {
    const src = sourcesOf([plan], [F1, T1]);
    assert.deepEqual(ids(await retrievePractice(req({ ...FIG, excludeIds: [F1.id] }), src, NO_GEN_SOURCES, undefined, ROUTE)), [T1.id, 'phys-kinematics::try-1']);
    assert.deepEqual(ids(await retrievePractice(req({ ...FIG, difficulty: 3 }), src, NO_GEN_SOURCES, undefined, ROUTE)), ['phys-kinematics::try-1']);
  });

  await test('topic scope: the same gate', async () => {
    const src = sourcesOf([plan], POOL);
    const topic = { scope: { topicId: TOPIC } };
    assert.deepEqual(withFigure(await retrievePractice(req(topic), src, NO_GEN_SOURCES, undefined, ROUTE)), []);
    assert.deepEqual(withFigure(await retrievePractice(req({ ...topic, ...FIG }), src, NO_GEN_SOURCES)), []);
    const r = await retrievePractice(req({ ...topic, ...FIG }), src, NO_GEN_SOURCES, undefined, ROUTE);
    assert.deepEqual(withFigure(r), [F1.id]);
    assert.ok(!ids(r).some((id) => BAD_FIGURES.some((b) => b.id === id)));
  });

  console.log('\nWithdrawn, audited-only and skill scope apply to a figure row as to any other:\n');

  await test('a withdrawn figure row is never served, accepted or not', async () => {
    const withdrawnId = [...WITHDRAWN_ITEM_IDS].find((id) => !id.includes('::'));
    assert.ok(withdrawnId, 'the withdrawn list holds a bank id');
    const src = sourcesOf([plan], [row(withdrawnId as string, { figure: FIGURE }), T1]);
    const r = await retrievePractice(req(FIG), src, NO_GEN_SOURCES, undefined, ROUTE);
    assert.deepEqual(ids(r), [T1.id, 'phys-kinematics::try-1']);
  });

  await test('audited-only partner: an unlisted generated figure row is not served; a listed one is, with its figure', async () => {
    const listed = [...AUDITED_GENERATED_ITEM_IDS][0];
    const unlisted = `practice-gen.${LO}.notaudited01`;
    assert.ok(listed && !AUDITED_GENERATED_ITEM_IDS.has(unlisted));
    const src = sourcesOf([plan], [row(listed, { figure: FIGURE }), row(unlisted, { figure: FIGURE }), T1]);
    process.env[AUDITED_ONLY_PARTNERS_ENV] = P1;
    const gated = await retrievePractice(req(FIG), src, NO_GEN_SOURCES, { partnerId: P1 }, ROUTE);
    assert.deepEqual(withFigure(gated), [listed]);
    // …and without `accepts` the listed partner gets neither.
    assert.deepEqual(withFigure(await retrievePractice(req(), src, NO_GEN_SOURCES, { partnerId: P1 }, ROUTE)), []);
    // Any other partner: both, when it accepts figures.
    assert.deepEqual(withFigure(await retrievePractice(req(FIG), src, NO_GEN_SOURCES, { partnerId: 'someone-else' }, ROUTE)), [listed, unlisted]);
  });

  const SKILL = 'gen-cccccccc-0000-4000-8000-000000000003';
  const slo = (k: number) => `${SKILL}.lo-${k}`;
  const skillPlan: PlanLite = {
    id: SKILL, title: 'Motion graphs', topic: 'Motion graphs', partnerId: P1,
    los: [1, 2, 3].map((k) => ({ id: slo(k) })),
    segments: [1, 2, 3].map((k) => ({ kind: 'try_yourself', id: `${slo(k)}-try`, problem: `Objective ${k}: compute ${k} + ${k}.`, expectedAnswer: String(2 * k), responseFormat: 'numeric' as const })),
  };
  const skillFigure = row(`practice-fig.${slo(3)}.01`, { loId: slo(3), figure: FIGURE });
  const skillText = row(`practice-txt.${slo(2)}.01`, { loId: slo(2) });

  await test('skill scope: a figure row stored under objective 3 is served under the skill LO — only to a caller that accepts figures', async () => {
    const calls: BankCall[] = [];
    const src = sourcesOf([skillPlan], [skillFigure, skillText], calls);
    const skillReq = { scope: { loId: slo(1) }, count: 4 };
    const text = await retrievePractice(req(skillReq), src, NO_GEN_SOURCES, { partnerId: P1 }, ROUTE);
    assert.deepEqual(withFigure(text), []);
    assert.ok(!ids(text).includes(skillFigure.id));
    assert.ok(calls.every((c) => c.opts?.figures === false), 'every objective is read without figures');
    calls.length = 0;
    const fig = await retrievePractice(req({ ...skillReq, ...FIG }), src, NO_GEN_SOURCES, { partnerId: P1 }, ROUTE);
    assert.deepEqual(withFigure(fig), [skillFigure.id]);
    assert.deepEqual(calls.map((c) => c.loId).sort(), [slo(1), slo(2), slo(3)]);
    assert.ok(calls.every((c) => c.opts?.figures === true));
    // Attribution stays on the skill; the spread still covers each objective once in a 3-item draw.
    assert.ok(fig.items.every((i) => i.loId === slo(1)));
    const three = await retrievePractice(req({ ...skillReq, ...FIG, count: 3 }), src, NO_GEN_SOURCES, { partnerId: P1 }, ROUTE);
    assert.deepEqual(ids(three), [`${SKILL}::${slo(1)}-try`, skillText.id, skillFigure.id]);
    RetrievePracticeResponseSchema.parse({ items: three.items });
  });

  console.log('\nEvery other reader of the bank:\n');

  await test('buildAssessment (quiz / unit test / diagnostic) never returns a figure item — even if a request smuggles `accepts`', async () => {
    const calls: BankCall[] = [];
    const src = sourcesOf([plan], POOL, calls);
    const set = await buildAssessment({ studentId: 's1', courseId: 'c1', loIds: [LO], maxPerLo: 20 }, src, NO_GEN_SOURCES);
    assert.deepEqual(set.items.map((i) => i.itemId), TEXT_IDS);
    const smuggled = { studentId: 's1', courseId: 'c1', loIds: [LO], maxPerLo: 20, accepts: ['figure'] } as unknown as Parameters<typeof buildAssessment>[0];
    const set2 = await buildAssessment(smuggled, src, NO_GEN_SOURCES);
    assert.deepEqual(set2.items.map((i) => i.itemId), TEXT_IDS);
    assert.ok(!JSON.stringify([set, set2]).includes('<svg'));
    assert.ok(calls.every((c) => c.opts?.figures === false));
  });

  await test('resolveAssignmentItems (assigned practice / homework) never returns a figure item, and asks for none', async () => {
    const calls: BankCall[] = [];
    const out = await resolveAssignmentItems(
      { los: [{ loId: LO, title: 'Graphs' }], band: 'steady', seenItemIds: [], studentId: 's1', courseId: 'c1' },
      sourcesOf([plan], POOL, calls),
    );
    assert.deepEqual(out.flatMap((l) => l.items.map((i) => i.id)), TEXT_IDS);
    assert.ok(calls.length > 0 && calls.every((c) => c.opts?.figures === false));
    // What it passes to the retrieval core: no `accepts`, no options at all.
    const seen: unknown[][] = [];
    await resolveAssignmentItems(
      { los: [{ loId: LO, title: 'Graphs' }], band: 'steady', seenItemIds: [], studentId: 's1', courseId: 'c1' },
      sourcesOf([plan], POOL),
      (async (...args: unknown[]) => { seen.push(args); return { items: [] }; }) as unknown as typeof retrievePractice,
    );
    assert.ok(seen.length > 0);
    for (const args of seen) {
      assert.equal('accepts' in (args[0] as object), false);
      assert.equal(args[4], undefined);
    }
  });

  await test('generation: a figure item is never an anchor, an avoid-list entry or an exclude hash', async () => {
    process.env.PRACTICE_GEN = 'on';
    const prompts: string[] = [];
    const hashes: string[][] = [];
    const gen: PracticeGenSources = {
      async generateAndVerify(userPrompt, excludeHashes) {
        prompts.push(userPrompt);
        hashes.push(excludeHashes);
        return null;
      },
      async reserve(_s, _l, n) { return n; },
      async persist() {},
    };
    const figureAnchor: PracticeItem = { id: F1.id, source: 'bank', problemText: F1.problemText, expectedAnswer: '-4', responseFormat: 'numeric', figure: FIGURE };
    const textAnchor: PracticeItem = { id: T1.id, source: 'bank', problemText: 'A train covers 300 km in 4 h. Find its average speed in km/h.', expectedAnswer: '75', responseFormat: 'numeric' };
    // Directly: whatever pool a caller hands over.
    await generatePracticeItemsDetailed({ studentId: 's1', loId: LO, topic: TOPIC, shortfall: 2, anchorItems: [figureAnchor, textAnchor] }, gen);
    assert.ok(prompts.length > 0, 'the generator ran');
    for (const p of prompts) assert.ok(!p.includes('position of a cyclist'), 'the figure item text is in no prompt');
    assert.ok(prompts.some((p) => p.includes('A train covers 300 km')), 'the text anchor is used');
    for (const h of hashes) assert.ok(!h.includes(simpleHash(F1.problemText)));
    // Through retrievePractice, for a caller that DOES accept figures.
    prompts.length = 0;
    const r = await retrievePractice(req({ ...FIG, count: 6 }), sourcesOf([plan], [F1, T1]), gen, undefined, ROUTE);
    assert.deepEqual(withFigure(r), [F1.id]);
    assert.ok(prompts.length > 0);
    for (const p of prompts) assert.ok(!p.includes('position of a cyclist'));
  });

  await test('in-session bank query (show_problem): figure rows are filtered in the query AND in the candidate filter, for every partner', () => {
    const cands = [F1, T1, F_NULL].map((b) => ({ ...b, _id: b.id })) as unknown as IProblemBank[];
    for (const partner of [undefined, '', P1, 'greenapple']) {
      assert.deepEqual(eligibleBankCandidates(cands, [], partner).map((c) => c.id), [T1.id], String(partner));
    }
    assert.ok(logged.includes(`[practice] figure item not served ${F1.id} where=session-generate-problem`));
    const filter = sessionBankFilter('physics-1', 2, [], 'plan-1', ['lo-1']);
    assert.deepEqual(filter.figure, { $exists: false });
    assert.deepEqual(filter.bankScope, { $ne: 'mock' });
    assert.deepEqual(sessionBankFilter('physics-1', 2, ['a']).figure, { $exists: false });
    assert.deepEqual(NO_FIGURE_FILTER, { figure: { $exists: false } });
  });

  await test('mock-exam forms: a figure row is not a form item', () => {
    assert.deepEqual(mockFormRows([F1, T1, F_NULL, T2]).map((r) => r.id), [T1.id, T2.id]);
    assert.ok(logged.includes(`[practice] figure item not served ${F1.id} where=mock-form`));
  });

  await test('grading is unchanged: an already-issued figure item id still resolves its key', async () => {
    const deps: ItemKeyDeps = {
      getStoredPlan: async () => null,
      findBankRow: async (id) => (id === F1.id ? ({ id: F1.id, problemText: F1.problemText, answer: '-4', responseFormat: 'numeric', figure: FIGURE } as unknown as IProblemBank) : null),
    };
    assert.equal((await resolveGradeItem(F1.id, deps))?.expectedAnswer, '-4');
    const key = await resolveAssessmentItem(F1.id, deps);
    assert.equal(key?.expectedAnswer, '-4');
    assert.ok(!JSON.stringify(key).includes('<svg'), 'the key resolver does not carry the figure');
  });

  console.log('\nStored shape (models/ProblemBank.ts — no connection):\n');

  await test('the ProblemBank schema stores figure { svg, alt, spec } and enforces the contract bounds', () => {
    const baseDoc = { id: 'x.1', topic: TOPIC, difficulty: 2, problemText: 'q', answer: '1', source: { name: 'Evelyn (original)' }, license: 'internal-original', verifiedAt: new Date(0), verifierModel: 'test' };
    const Model = ProblemBank as unknown as new (d: unknown) => { validateSync(): { errors: Record<string, unknown> } | undefined; toObject(): Record<string, unknown> };
    const good = new Model({ ...baseDoc, figure: FIGURE });
    assert.equal(good.validateSync(), undefined);
    const stored = good.toObject().figure as Record<string, unknown>;
    assert.deepEqual(Object.keys(stored).sort(), ['alt', 'spec', 'svg']);
    assert.deepEqual(JSON.parse(JSON.stringify(stored)), JSON.parse(JSON.stringify(FIGURE)));
    assert.equal('figure' in new Model(baseDoc).toObject(), false, 'absent on a row without one');
    assert.ok(new Model({ ...baseDoc, figure: { svg: FIGURE.svg } }).validateSync()?.errors['figure.alt']);
    assert.ok(new Model({ ...baseDoc, figure: { svg: 'x'.repeat(200_001), alt: 'a' } }).validateSync()?.errors['figure.svg']);
    assert.ok(new Model({ ...baseDoc, figure: { svg: FIGURE.svg, alt: 'a'.repeat(601) } }).validateSync()?.errors['figure.alt']);
  });

  console.log('\nProduction adapter (mongoPracticeSources over stubbed Mongo — no connection):\n');

  const dbRows = [
    { id: F1.id, problemText: F1.problemText, answer: '-4', responseFormat: 'numeric', difficulty: 2, loId: LO, figure: FIGURE },
    { id: T1.id, problemText: T1.problemText, answer: '4', responseFormat: 'numeric', difficulty: 2, loId: LO },
  ];
  const bankFilters: Array<Record<string, unknown>> = [];
  /** A stub that honours the figure clause the way Mongo would. */
  const stubMongo = (opts: { ignoreFigureClause?: boolean } = {}) => {
    (LessonPlanModel as unknown as { find: () => { limit: () => Promise<unknown[]> } }).find = () => ({ limit: async () => [] });
    (ProblemBank as unknown as {
      find: (filter: Record<string, unknown>) => { limit: () => { lean: () => Promise<unknown[]> } };
    }).find = (filter) => {
      bankFilters.push(filter);
      const noFigures = JSON.stringify(filter.figure) === JSON.stringify({ $exists: false });
      const rows = dbRows.filter((r) => r.loId === filter.loId && (opts.ignoreFigureClause || !noFigures || !('figure' in r)));
      return { limit: () => ({ lean: async () => rows }) };
    };
  };

  await test('the bank query leaves figure rows out unless the caller accepts figures; when it does the figure is carried to the wire', async () => {
    stubMongo();
    bankFilters.length = 0;
    const text = await retrievePractice(req(), mongoPracticeSources(), NO_GEN_SOURCES, undefined, ROUTE);
    assert.deepEqual(ids(text), [T1.id]);
    assert.deepEqual(bankFilters.map((f) => f.figure), [{ $exists: false }]);
    assert.deepEqual(bankFilters[0].bankScope, { $ne: 'mock' });

    bankFilters.length = 0;
    const notRoute = await retrievePractice(req(FIG), mongoPracticeSources(), NO_GEN_SOURCES);
    assert.deepEqual(ids(notRoute), [T1.id]);
    assert.deepEqual(bankFilters.map((f) => f.figure), [{ $exists: false }]);

    bankFilters.length = 0;
    const fig = await retrievePractice(req(FIG), mongoPracticeSources(), NO_GEN_SOURCES, undefined, ROUTE);
    assert.deepEqual(ids(fig), [F1.id, T1.id]);
    assert.equal('figure' in bankFilters[0], false);
    assert.deepEqual(fig.items[0].figure, FIGURE);
    RetrievePracticeResponseSchema.parse({ items: fig.items });
    assert.ok(connectCalls > 0, 'the adapter went through connectDB to the stubbed mongoose.connect');
    assert.ok(connectUris.every((u) => u === NO_DB_URI), 'only ever the unresolvable test URI');
  });

  await test('defence in depth: if the query returned a figure row anyway, the core still drops it', async () => {
    stubMongo({ ignoreFigureClause: true });
    const r = await retrievePractice(req(), mongoPracticeSources(), NO_GEN_SOURCES, undefined, ROUTE);
    assert.deepEqual(ids(r), [T1.id]);
    const set = await buildAssessment({ studentId: 's1', courseId: 'c1', loIds: [LO], maxPerLo: 5 }, mongoPracticeSources(), NO_GEN_SOURCES);
    assert.deepEqual(set.items.map((i) => i.itemId), [T1.id]);
  });

  console.log('\nPOST /api/portal/v1/practice (signed, over the stubbed adapter):\n');

  const callRoute = async (body: unknown): Promise<{ status: number; json: { items: PracticeItem[] } }> => {
    const text = JSON.stringify(body);
    const timestamp = String(Date.now());
    const sig = signPortalRequest('secret-a', { method: 'POST', path: '/api/portal/v1/practice', timestamp, body: text });
    const request = new Request('http://localhost/api/portal/v1/practice', {
      method: 'POST',
      headers: { 'x-evelyn-partner': 'portalA', 'x-evelyn-timestamp': timestamp, 'x-evelyn-signature': sig },
      body: text,
    }) as unknown as NextRequest;
    const res = await (practicePOST as unknown as (r: NextRequest) => Promise<Response>)(request);
    return { status: res.status, json: await res.json() };
  };

  await test('a request without `accepts` gets text only; with `accepts: [figure]` it gets the item and its figure', async () => {
    stubMongo();
    // The partner registry and the rate limiter have their own Mongo models;
    // their test seams keep the route's auth off the (stubbed) connection.
    __setRegistryOverrideForTests(async (id) => (id === 'portalA'
      ? { partnerId: id, kind: 'partner', status: 'active', secrets: ['secret-a'], allowedEndpoints: ['/api/portal/v1/'], limits: { rpm: 600, burst: 60, dailyQuota: null }, flagOverrides: {} }
      : null));
    __setLimitsDepsOverrideForTests({ bump: async () => 1, now: () => Date.now(), env: {} as NodeJS.ProcessEnv });
    const plain = await callRoute(req());
    assert.equal(plain.status, 200);
    assert.deepEqual(ids(plain.json), [T1.id]);
    assert.ok(!JSON.stringify(plain.json).includes('<svg'));
    const fig = await callRoute(req(FIG));
    assert.equal(fig.status, 200);
    assert.deepEqual(ids(fig.json), [F1.id, T1.id]);
    const parsed = RetrievePracticeResponseSchema.parse(fig.json);
    assert.deepEqual(parsed.items[0].figure, JSON.parse(JSON.stringify(FIGURE)));
    assert.equal((await callRoute({ ...req(), accepts: ['hologram'] })).status, 400);
  });

  console.log('\nCoverage helper (practice-coverage.ts):\n');

  await test('skillCoverage counts figure items by default (as a caller that accepts figures); figures:false reports the text-only view', async () => {
    const dump = {
      plans: [{
        _id: SKILL, title: 'Motion graphs', topic: 'Motion graphs', metadata: { portalPartnerId: P1 },
        los: [1, 2, 3].map((k) => ({ id: slo(k), description: `objective ${k}` })),
        segments: [{ kind: 'try_yourself', id: `${slo(1)}-try`, problem: 'Compute 1 + 1.', expectedAnswer: '2', responseFormat: 'numeric' }],
      }],
      bank: [
        { id: skillFigure.id, loId: slo(3), problemText: 'The graph shows…', answer: '1', figure: FIGURE },
        { id: `practice-fig.${slo(3)}.bad`, loId: slo(3), problemText: 'The graph shows…', answer: '1', figure: { svg: '<svg><script/></svg>', alt: 'x' } },
        { id: skillText.id, loId: slo(2), problemText: 'Text item', answer: '1' },
      ],
    };
    const dflt = await skillCoverage(dump);
    assert.deepEqual(dflt[0].objectives.map((o) => [o.servable, o.servableFigures]), [[1, 0], [1, 0], [1, 1]]);
    assert.equal(dflt[0].servableFigures, 1);
    assert.deepEqual(dflt[0].zeroObjectives, []);
    assert.deepEqual(summarizeCoverage(dflt), { skills: 1, objectives: 3, servable: 3, servableFigures: 1, objectivesWithZero: 0, skillsWithAZeroObjective: 0, skillsWithNothing: 0 });
    assert.deepEqual(await skillCoverage(dump, { figures: true }), dflt);
    const textOnly = await skillCoverage(dump, { figures: false });
    assert.deepEqual(textOnly[0].objectives.map((o) => [o.servable, o.servableFigures]), [[1, 0], [1, 0], [0, 0]]);
    assert.deepEqual(textOnly[0].zeroObjectives, [slo(3)]);
    assert.equal(summarizeCoverage(textOnly).servableFigures, 0);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

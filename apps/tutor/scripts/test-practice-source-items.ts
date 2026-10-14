/**
 * Source documents on practice items (contract v1.22.0 `PracticeItem.sources`;
 * portal/source-items.ts).
 *
 * THE GATE: an item that references passages gets `sources` only when the
 * caller is the practice route (`options.allowSources`) AND the request lists
 * `sources` in `accepts`. An item on the sources-required list is served ONLY
 * then, and only with every document resolved; every other caller gets
 * exactly what it got before (proven below against the same pool).
 *
 * Real data: the committed required list is checked against the seeds (each
 * id is a try-yourself / bank row with passages that all resolve, and none is
 * still withdrawn), and one of the 41 GreenApple essay skills is served
 * end-to-end from the real seed plan.
 *
 * No database, no model: injected fakes; `ProblemBank.find` is replaced for
 * the adapter section (same convention as test-practice-drawn-items.ts).
 *
 * Fixture: scripts/fixtures/sources-practice-items.json — example wire items
 * for the academy, regenerated with
 *   UPDATE_SOURCES_FIXTURE=1 npm run test:practice-source-items
 *
 * Run: npm run test:practice-source-items
 */
// FIRST, before anything loads `@core/db`: no run of this file can reach a database.
import { NO_DB_URI } from './lib/no-db-env';
import { strict as assert } from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import {
  PracticeSourceSchema,
  RetrievePracticeResponseSchema,
  type PracticeItem,
  type RetrievePracticeRequest,
} from '@evelyn/portal-contract/v1';
import { retrievePractice, type BankLite, type PlanLite, type PracticeSources } from '@/lib/tutor/portal/practice';
import {
  SOURCES_REQUIRED_ITEM_IDS,
  acceptsSources,
  applySourcesGate,
  practiceSourcesFor,
  sourceLabel,
  withPassageTitles,
  withoutSourcesRequired,
} from '@/lib/tutor/portal/source-items';
import { isWithdrawnItem } from '@/lib/tutor/portal/withdrawn-items';
import { mongoPracticeSources, resolvePassageText, toPlanLite } from '@/lib/tutor/portal/adapters';
import { NO_GEN_SOURCES } from '@/lib/tutor/practice-assign/resolve';
import { eligibleBankCandidates } from '@/lib/tutor/voice/problem-generator';
import { SEED_PLANS } from '@/lib/tutor/lesson-plan/store';
import { SEED_PASSAGES, resolvePassage } from '@/lib/tutor/passages/store';
import type { Passage } from '@/lib/tutor/passages/types';
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
  }
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const P = (id: string, over: Partial<Passage> = {}): Passage => ({
  id, title: `Title ${id}`, author: `Author ${id}`, year: 1850, sourceUrl: 'https://example.org', license: 'public-domain',
  genre: 'document', fullText: `Para one of ${id}.\n\nPara two of ${id}.`, lineNumbered: false, wordCount: 10, ...over,
});
const FAKE: Record<string, Passage> = {
  d1: P('d1'),
  d2: P('d2'),
  d3: P('d3', { table: { caption: 'Grants', columns: ['Year', 'Billions'], rows: [['1990', '256'], ['2019', '692']] } }),
};
const fakeResolve = (id: string): Passage | undefined => FAKE[id];

const LO = 'apush.u1-dbq-practice';
const DBQ = 'plan-dbq::try-dbq';
const SAQ = 'plan-dbq::try-saq';
const PLAIN = 'plan-dbq::try-plain';
const plan: PlanLite = {
  id: 'plan-dbq',
  topic: 'apush',
  los: [{ id: LO }],
  segments: [
    { kind: 'try_yourself', id: 'try-dbq', problem: 'Using the documents, evaluate…', expectedAnswer: 'model', responseFormat: 'frq', passageIds: ['d1', 'd2', 'd3'], packetLabel: 'document' },
    { kind: 'try_yourself', id: 'try-saq', problem: 'Using the source, explain…', expectedAnswer: 'model', responseFormat: 'frq', passageId: 'd3' },
    { kind: 'try_yourself', id: 'try-plain', problem: 'Name one cause of…', expectedAnswer: 'x', responseFormat: 'free' },
  ],
};
const bankRow: BankLite = { id: 'apush.bank.mcq.01', problemText: 'According to the excerpt…', answer: 'A', responseFormat: 'mcq', choices: ['a', 'b'], loId: LO, difficulty: 2, passageId: 'd1' };

function sourcesOf(plans: PlanLite[], bank: BankLite[] = []): PracticeSources {
  return {
    plansForLoId: async (loId) => plans.filter((p) => p.los.some((l) => l.id === loId)),
    plansForTopic: async () => plans,
    bankForLoId: async (loId) => bank.filter((b) => b.loId === loId),
    bankForTopic: async () => bank,
  };
}
const req = (over: Partial<RetrievePracticeRequest> = {}): RetrievePracticeRequest => ({
  studentId: 's1', courseId: 'c1', scope: { loId: LO }, count: 10, ...over,
});
const ACCEPT = { accepts: ['sources' as const] };
const REQUIRED = new Set([DBQ, SAQ]);
const ROUTE = { allowSources: true, sourcesRequired: REQUIRED, resolvePassage: fakeResolve };
const ids = (r: { items: PracticeItem[] }) => r.items.map((i) => i.id);

async function main(): Promise<void> {
  console.log('\nThe helpers (source-items.ts):\n');

  await test('labels match the grader: Document 1..N for a document packet, Source A.. otherwise, "Source" for one', () => {
    assert.equal(sourceLabel(0, 5, 'document'), 'Document 1');
    assert.equal(sourceLabel(4, 5, 'document'), 'Document 5');
    assert.equal(sourceLabel(1, 3, 'source'), 'Source B');
    assert.equal(sourceLabel(1, 3, undefined), 'Source B');
    assert.equal(sourceLabel(0, 1, 'document'), 'Source');
    // The grader's packet text names the same labels, in the same order.
    const graderText = resolvePassageText(undefined, ['evelyn.passage.apush-columbus-letter.v1', 'evelyn.passage.apush-las-casas.v1'], 'document') ?? '';
    assert.ok(graderText.startsWith('Document 1 — '));
    assert.ok(graderText.includes('Document 2 — '));
  });

  await test('practiceSourcesFor: title, "author, year", paragraphs kept, table carried; null for none / any unresolved', () => {
    const s = practiceSourcesFor({ passageIds: ['d1', 'd3'], packetLabel: 'document' }, fakeResolve);
    assert.ok(s);
    assert.deepEqual(s?.map((x) => x.label), ['Document 1', 'Document 2']);
    assert.equal(s?.[0].title, 'Title d1');
    assert.equal(s?.[0].attribution, 'Author d1, 1850');
    assert.equal(s?.[0].text, FAKE.d1.fullText);
    assert.equal(s?.[0].table, undefined);
    assert.deepEqual(s?.[1].table, FAKE.d3.table);
    for (const x of s ?? []) PracticeSourceSchema.parse(x);
    assert.equal(practiceSourcesFor({}, fakeResolve), null);
    assert.equal(practiceSourcesFor({ passageIds: ['d1', 'nope'] }, fakeResolve), null, 'a partial packet is never shown');
    assert.deepEqual(practiceSourcesFor({ passageId: 'd1', passageIds: ['d1', 'd2'] }, fakeResolve)?.map((x) => x.label), ['Source A', 'Source B'], 'de-duplicated');
  });

  await test('withPassageTitles: an internal passage id in the prompt becomes the title; a parenthetical id after a named work is dropped', () => {
    assert.equal(withPassageTitles('Using the passage d1, write…', fakeResolve), 'Using the passage d1, write…', 'not an id');
    const real = (id: string) => resolvePassage(id);
    assert.equal(
      withPassageTitles('Using the passage evelyn.passage.lincoln-gettysburg.v1, write ONE sentence.', real),
      `Using the passage "${resolvePassage('evelyn.passage.lincoln-gettysburg.v1')?.title}", write ONE sentence.`,
    );
    assert.equal(withPassageTitles("Using Lincoln's Gettysburg Address (evelyn.passage.lincoln-gettysburg.v1) and…", real), "Using Lincoln's Gettysburg Address and…");
    assert.equal(withPassageTitles('See evelyn.passage.nope.v1 now.', real), 'See evelyn.passage.nope.v1 now.', 'unresolved id left alone');
  });

  await test('the gate rewrites the prompt only when it sends the documents', async () => {
    const lincoln: PlanLite = { id: 'p-l', los: [{ id: 'lo-l' }], segments: [{ kind: 'try_yourself', id: 't', problem: 'Using the passage evelyn.passage.lincoln-gettysburg.v1, write.', responseFormat: 'free', passageId: 'evelyn.passage.lincoln-gettysburg.v1' }] };
    const opts = { allowSources: true, sourcesRequired: new Set<string>() };
    const shown = await retrievePractice(req({ ...ACCEPT, scope: { loId: 'lo-l' } }), sourcesOf([lincoln]), NO_GEN_SOURCES, { partnerId: 'greenapple' }, opts);
    assert.ok(!shown.items[0].problemText.includes('evelyn.passage.'));
    const plain = await retrievePractice(req({ scope: { loId: 'lo-l' } }), sourcesOf([lincoln]), NO_GEN_SOURCES, { partnerId: 'greenapple' }, opts);
    assert.equal(plain.items[0].problemText, lincoln.segments[0].problem, 'no sources ⇒ text exactly as before');
  });

  await test('acceptsSources reads the request', () => {
    assert.equal(acceptsSources({}), false);
    assert.equal(acceptsSources({ accepts: ['figure'] }), false);
    assert.equal(acceptsSources({ accepts: ['figure', 'sources'] }), true);
  });

  await test('applySourcesGate: serve ⇒ attach / drop an unresolvable required item; no serve ⇒ drop required only', () => {
    const items: Array<{ id: string; sources?: ReturnType<typeof practiceSourcesFor> & object }> = [{ id: DBQ }, { id: PLAIN }, { id: 'x' }];
    const refs = new Map([[DBQ, { passageIds: ['d1', 'd2'], packetLabel: 'document' as const }], ['x', { passageId: 'nope' }]]);
    const served = applySourcesGate(items, refs, true, 't', REQUIRED, fakeResolve);
    assert.deepEqual(served.map((i) => i.id), [DBQ, PLAIN, 'x']);
    assert.equal(served[0].sources?.length, 2);
    assert.equal((served[2] as { sources?: unknown }).sources, undefined, 'an optional unresolvable item stays, without sources');
    assert.deepEqual(applySourcesGate(items, refs, false, 't', REQUIRED, fakeResolve), [{ id: PLAIN }, { id: 'x' }]);
    assert.deepEqual(applySourcesGate([{ id: DBQ }], new Map([[DBQ, { passageIds: ['d1', 'nope'] }]]), true, 't', REQUIRED, fakeResolve), []);
  });

  console.log('\nretrievePractice (injected fakes):\n');

  await test('practice route + accepts sources: the DBQ comes with its documents, in order, and the reply parses', async () => {
    const r = await retrievePractice(req(ACCEPT), sourcesOf([plan], [bankRow]), NO_GEN_SOURCES, { partnerId: 'greenapple' }, ROUTE);
    RetrievePracticeResponseSchema.parse(r);
    const dbq = r.items.find((i) => i.id === DBQ);
    assert.deepEqual(dbq?.sources?.map((s) => s.label), ['Document 1', 'Document 2', 'Document 3']);
    assert.deepEqual(dbq?.sources?.[2].table?.columns, ['Year', 'Billions']);
    assert.equal(r.items.find((i) => i.id === SAQ)?.sources?.[0].label, 'Source');
    assert.equal(r.items.find((i) => i.id === bankRow.id)?.sources?.[0].title, 'Title d1', 'a bank row with a passage gets it too');
    assert.equal(r.items.find((i) => i.id === PLAIN)?.sources, undefined);
  });

  await test('any other caller: required items dropped, everything else EXACTLY as before (no sources field)', async () => {
    const before = await retrievePractice(req(), sourcesOf([plan], [bankRow]), NO_GEN_SOURCES, { partnerId: 'greenapple' }, { sourcesRequired: new Set() });
    const noAccept = await retrievePractice(req(), sourcesOf([plan], [bankRow]), NO_GEN_SOURCES, { partnerId: 'greenapple' }, ROUTE);
    const notRoute = await retrievePractice(req(ACCEPT), sourcesOf([plan], [bankRow]), NO_GEN_SOURCES, { partnerId: 'greenapple' }, { sourcesRequired: REQUIRED, resolvePassage: fakeResolve });
    for (const r of [noAccept, notRoute]) {
      assert.deepEqual(r.items, before.items.filter((i) => !REQUIRED.has(i.id)));
      assert.ok(r.items.every((i) => i.sources === undefined));
    }
  });

  await test('a skill whose only item needs its documents reads none_available to a caller that cannot show them', async () => {
    const only: PlanLite = { ...plan, segments: [plan.segments[0]] };
    const r = await retrievePractice(req(), sourcesOf([only]), NO_GEN_SOURCES, { partnerId: 'greenapple' }, ROUTE);
    assert.deepEqual(r.items, []);
    assert.equal(r.emptyReason, 'none_available');
    const ok = await retrievePractice(req(ACCEPT), sourcesOf([only]), NO_GEN_SOURCES, { partnerId: 'greenapple' }, ROUTE);
    assert.deepEqual(ids(ok), [DBQ]);
    // "Give me another": the one item already served ⇒ empty, not an error.
    const again = await retrievePractice(req({ ...ACCEPT, excludeIds: [DBQ] }), sourcesOf([only]), NO_GEN_SOURCES, { partnerId: 'greenapple' }, ROUTE);
    assert.deepEqual(again.items, []);
    assert.equal(again.emptyReason, 'none_available');
  });

  await test('a required item missing a document is withheld even from a caller that shows documents', async () => {
    const broken: PlanLite = { ...plan, segments: [{ ...plan.segments[0], passageIds: ['d1', 'gone'] }] };
    const r = await retrievePractice(req(ACCEPT), sourcesOf([broken]), NO_GEN_SOURCES, { partnerId: 'greenapple' }, ROUTE);
    assert.deepEqual(r.items, []);
  });

  await test('topic scope applies the same gate', async () => {
    const r = await retrievePractice(req({ scope: { topicId: 'apush' } }), sourcesOf([plan], [bankRow]), NO_GEN_SOURCES, { partnerId: 'greenapple' }, ROUTE);
    assert.ok(!ids(r).includes(DBQ) && !ids(r).includes(SAQ));
    const ok = await retrievePractice(req({ scope: { topicId: 'apush' }, ...ACCEPT }), sourcesOf([plan], [bankRow]), NO_GEN_SOURCES, { partnerId: 'greenapple' }, ROUTE);
    assert.equal(ok.items.find((i) => i.id === DBQ)?.sources?.length, 3);
  });

  console.log('\nThe committed list and the real seeds:\n');

  await test('every required id is a try-yourself / bank row whose passages all resolve, and none is still withdrawn', () => {
    const segs = new Map<string, { passageId?: string; passageIds?: string[]; packetLabel?: 'source' | 'document' }>();
    for (const p of SEED_PLANS) for (const s of p.segments) if (s.kind === 'try_yourself') segs.set(`${p.id}::${s.id}`, s as never);
    const bankDir = path.join(__dirname, '..', 'src', 'data', 'problem-bank');
    const bank = new Map<string, { passageId?: string }>();
    for (const dir of fs.readdirSync(bankDir)) {
      const full = path.join(bankDir, dir);
      if (!fs.statSync(full).isDirectory()) continue;
      for (const f of fs.readdirSync(full).filter((x) => x.endsWith('.json'))) {
        const rows = JSON.parse(fs.readFileSync(path.join(full, f), 'utf8'));
        if (Array.isArray(rows)) for (const r of rows) if (r && typeof r.id === 'string') bank.set(r.id, r);
      }
    }
    for (const id of SOURCES_REQUIRED_ITEM_IDS) {
      assert.ok(!isWithdrawnItem(id), `${id} is still on the withdrawn list`);
      const refs = segs.get(id) ?? bank.get(id);
      assert.ok(refs, `${id} is not a seed try-yourself or bank row`);
      const s = practiceSourcesFor(refs);
      assert.ok(s && s.length > 0, `${id}: documents do not all resolve`);
      for (const x of s ?? []) PracticeSourceSchema.parse(x);
    }
  });

  await test('every seed passage maps to a valid wire source (incl. tables: every row as wide as its columns)', () => {
    for (const p of SEED_PASSAGES) {
      const s = practiceSourcesFor({ passageId: p.id });
      assert.ok(s, p.id);
      PracticeSourceSchema.parse(s?.[0]);
      if (p.table) {
        assert.deepEqual(s?.[0].table, p.table, `${p.id}: table clipped or dropped`);
        for (const row of p.table.rows) assert.equal(row.length, p.table.columns.length, `${p.id}: ragged row`);
      }
    }
  });

  await test('real seed plan, real passages: APUSH Period 1 DBQ is served with Documents 1–5 when the id is required', async () => {
    const seed = SEED_PLANS.find((p) => p.id === 'evelyn.ap.apush.u1-dbq-practice.v1');
    assert.ok(seed);
    const lite = toPlanLite(seed as never);
    const id = 'evelyn.ap.apush.u1-dbq-practice.v1::try-full-essay-dbq';
    const r = await retrievePractice(req(ACCEPT), sourcesOf([lite]), NO_GEN_SOURCES, { partnerId: 'greenapple' }, { allowSources: true, sourcesRequired: new Set([id]) });
    RetrievePracticeResponseSchema.parse(r);
    const it = r.items.find((i) => i.id === id);
    assert.deepEqual(it?.sources?.map((s) => s.label), ['Document 1', 'Document 2', 'Document 3', 'Document 4', 'Document 5']);
    assert.equal(it?.sources?.[0].text, resolvePassage('evelyn.passage.apush-columbus-letter.v1')?.fullText);
  });

  console.log('\nOther readers:\n');

  await test('the in-session bank query never takes a required row (show_problem puts text only on the board)', () => {
    const rows = [{ id: 'a', problemText: 'q1' }, { id: 'b', problemText: 'q2' }] as unknown as IProblemBank[];
    assert.deepEqual(withoutSourcesRequired(rows, 't', new Set(['b'])).map((r) => r.id), ['a']);
    const req1 = [...SOURCES_REQUIRED_ITEM_IDS].find((x) => !x.includes('::'));
    if (req1) {
      const got = eligibleBankCandidates([{ id: req1, problemText: 'q' }] as unknown as IProblemBank[], [], undefined);
      assert.deepEqual(got, []);
    }
  });

  console.log('\nProduction adapter (stubbed Mongo — no connection):\n');

  await test('toPlanLite / bank rows carry the passage references through', async () => {
    const seed = SEED_PLANS.find((p) => p.id === 'evelyn.ap.apgov.u1-frq-argument-essay.v1');
    const seg = toPlanLite(seed as never).segments.find((s) => s.id === 'try-argument-essay');
    assert.equal(seg?.passageIds?.length, 5);
    const stored = { id: 'apenglang.x.mcq.01', problemText: 'According to the passage…', answer: 'B', responseFormat: 'mcq', choices: ['a', 'b'], difficulty: 2, loId: LO, passageId: 'evelyn.passage.douglass-fourth-of-july.v1' };
    (LessonPlanModel as unknown as { find: () => { limit: () => Promise<unknown[]> } }).find = () => ({ limit: async () => [] });
    (ProblemBank as unknown as { find: () => { limit: () => { lean: () => Promise<unknown[]> } } }).find = () => ({ limit: () => ({ lean: async () => [stored] }) });
    const r = await retrievePractice(req(ACCEPT), mongoPracticeSources(), NO_GEN_SOURCES, { partnerId: 'greenapple' }, { allowSources: true });
    RetrievePracticeResponseSchema.parse(r);
    assert.equal(r.items.find((i) => i.id === stored.id)?.sources?.[0].attribution, 'Frederick Douglass, 1852');
  });

  // Fixture for the academy: what the wire carries for the real items.
  const fixturePath = path.join(__dirname, 'fixtures', 'sources-practice-items.json');
  await test('fixture (scripts/fixtures/sources-practice-items.json) matches the serve path', async () => {
    const want = [
      ['evelyn.ap.apush.u1-dbq-practice.v1', 'apush.u1-dbq-practice'],
      ['evelyn.ap.apgov.u1-frq-quantitative.v1', 'apgov.u1-frq-quantitative'],
    ] as const;
    const items: PracticeItem[] = [];
    for (const [planId, lo] of want) {
      const lite = toPlanLite(SEED_PLANS.find((p) => p.id === planId) as never);
      const r = await retrievePractice(req({ ...ACCEPT, scope: { loId: lo } }), sourcesOf([lite]), NO_GEN_SOURCES, { partnerId: 'greenapple' }, { allowSources: true, sourcesRequired: new Set() });
      items.push(...r.items.filter((i) => i.sources));
    }
    const body = `${JSON.stringify({ items }, null, 2)}\n`;
    if (process.env.UPDATE_SOURCES_FIXTURE === '1' || !fs.existsSync(fixturePath)) fs.writeFileSync(fixturePath, body);
    assert.equal(fs.readFileSync(fixturePath, 'utf8'), body);
    RetrievePracticeResponseSchema.parse(JSON.parse(body));
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();

/**
 * Audited generated items — for a partner listed in
 * PRACTICE_GEN_AUDITED_ONLY_PARTNERS a stored GENERATED practice item
 * (`practice-gen.*` bank row) is served only when its id is on the audited
 * list. Authored bank rows and plan try-yourselves are unaffected, every
 * other partner (and an unknown caller) is unaffected, and withdrawn still
 * wins.
 *
 * Under test:
 *   - src/data/audited-generated-items.json (the committed list) and
 *     scripts/audit/build-audited-generated-list.ts (its builder);
 *   - portal/audited-items.ts — the env switch, the predicate, the filters;
 *   - portal/practice.ts `retrievePractice` — bank rows (LO and topic scope)
 *     dropped before de-dup / slicing; no generation for a listed partner;
 *     an injected generator's item is not served;
 *   - portal/practice-gen.ts `generatePracticeItemsDetailed` — never runs for
 *     a listed partner (a fresh item is unaudited by definition);
 *   - portal/assessment.ts `buildAssessment`, practice-assign/resolve.ts
 *     `resolveAssignmentItems`, practice-assign/top-up.ts `topUpPractice`;
 *   - the stored-assignment read (`withoutUnauditedAssignmentItems`, used by
 *     /api/portal/v1/assigned-practice);
 *   - voice/problem-generator.ts `eligibleBankCandidates` (the live session's
 *     generate_problem bank lookup) and embed-token.ts
 *     `embedTokenPartnerClaim` (how that route learns the partner);
 *   - portal/adapters.ts `resolveGradeItem` is UNCHANGED: an id already
 *     issued still resolves for grading.
 *
 * No database, no model: injected sources throughout.
 * Run (ts-node/commonjs, same as test:withdrawn-items):
 *   TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register \
 *     --compiler-options '{"module":"commonjs","baseUrl":"./"}' scripts/test-audited-generated-items.ts
 */
import { strict as assert } from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { retrievePractice, type PracticeSources, type PlanLite, type BankLite } from '@/lib/tutor/portal/practice';
import { generatePracticeItemsDetailed, type GeneratePracticeItemsOptions, type PracticeGenSources } from '@/lib/tutor/portal/practice-gen';
import {
  AUDITED_GENERATED_ITEM_IDS,
  AUDITED_ONLY_PARTNERS_ENV,
  auditedOnlyForPartner,
  isAuditedGeneratedItem,
  servableToPartner,
  withoutUnauditedAssignmentItems,
  withoutUnauditedGenerated,
} from '@/lib/tutor/portal/audited-items';
import { WITHDRAWN_ITEM_IDS } from '@/lib/tutor/portal/withdrawn-items';
import { isGeneratedPracticeItemId } from '@/lib/tutor/portal/essay-practice';
import { buildAssessment } from '@/lib/tutor/portal/assessment';
import { resolveGradeItem, type ItemKeyDeps } from '@/lib/tutor/portal/adapters';
import { resolveAssignmentItems } from '@/lib/tutor/practice-assign/resolve';
import { topUpPractice } from '@/lib/tutor/practice-assign/top-up';
import { eligibleBankCandidates, simpleHash, type GenPayload } from '@/lib/tutor/voice/problem-generator';
import { embedTokenPartnerClaim, signEmbedToken } from '@/lib/tutor/portal/embed-token';
import { buildAuditedGeneratedList, readAuditedIds } from './audit/build-audited-generated-list';
import type { IProblemBank } from '@/models/ProblemBank';
import type { PracticeItem } from '@evelyn/portal-contract/v1';

let passed = 0;
let failed = 0;
const VAR = 'PRACTICE_GEN_AUDITED_ONLY_PARTNERS';
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
    delete process.env[VAR];
    delete process.env.PRACTICE_GEN;
    delete process.env.PRACTICE_GEN_DISABLED_PARTNERS;
  }
}
async function captureLogs<T>(fn: () => Promise<T> | T): Promise<{ result: T; lines: string[] }> {
  const lines: string[] = [];
  const orig = console.log;
  console.log = (...a: unknown[]) => { lines.push(a.map(String).join(' ')); };
  try { return { result: await fn(), lines }; } finally { console.log = orig; }
}

// ---------------------------------------------------------------------------
// Real ids
// ---------------------------------------------------------------------------
const LO = 'alg1.real-numbers-operations';
/** On the audited list (check 2 of the 2026-10-05 final audit). */
const AUDITED_ID = `practice-gen.${LO}.fncg2l`;
/** A generated row that exists in production and is NOT on the list. */
const UNLISTED_ID = 'practice-gen.bio.characteristics-of-life.1gf50xl';
/** A generated row on the WITHDRAWN list. */
const WITHDRAWN_GEN_ID = 'practice-gen.gen-ba15a88f-6de6-46aa-8466-da3dd259478f.lo-1.16aropq';
const AUTHORED_ID = 'alg1-real-numbers-operations-001';
const PLAN_ID = 'evelyn.alg1.real-numbers-operations.v1';
const TRY_ID = `${PLAN_ID}::try-1`;

const plan: PlanLite = {
  id: PLAN_ID,
  title: 'Real Numbers & Operations',
  topic: 'algebra-1',
  los: [{ id: LO }],
  segments: [{ kind: 'try_yourself', id: 'try-1', problem: 'Evaluate -7 - (-3).', expectedAnswer: '-4', responseFormat: 'numeric' }],
};
function row(id: string, over: Partial<BankLite> = {}): BankLite {
  return { id, problemText: `Problem ${id}: compute 1 + 1.`, answer: '2', responseFormat: 'numeric', difficulty: 2, loId: LO, ...over };
}
const BANK: BankLite[] = [row(UNLISTED_ID), row(AUTHORED_ID), row(AUDITED_ID), row(WITHDRAWN_GEN_ID), row(`practice-gen.${LO}.zzunlisted`)];
function sourcesOf(bank: BankLite[] = BANK, plans: PlanLite[] = [plan]): PracticeSources {
  return {
    async plansForLoId(loId) { return plans.filter((p) => p.los.some((l) => l.id === loId)); },
    async plansForTopic(topicId) { return plans.filter((p) => p.topic === topicId); },
    async bankForLoId(loId) { return bank.filter((b) => b.loId === loId); },
    async bankForTopic() { return bank; },
  };
}
const req = (count = 10, excludeIds?: string[]) => ({ studentId: 's1', courseId: 'c1', scope: { loId: LO }, count, ...(excludeIds ? { excludeIds } : {}) });
const topicReq = { studentId: 's1', courseId: 'c1', scope: { topicId: 'algebra-1' }, count: 10 };
const ids = (r: { items: Array<{ id: string }> }) => r.items.map((i) => i.id);
const GA = { partnerId: 'greenapple' };

const NUMERIC_GEN: GenPayload = { problemText: 'What is 6 × 7?', finalAnswer: '42', responseFormat: 'numeric', answerKind: 'numeric' };
function countingGen() {
  const calls = { reserve: 0, generate: 0, persist: 0 };
  const sources: PracticeGenSources = {
    async reserve(_s, _l, n) { calls.reserve++; return n; },
    async generateAndVerify() { calls.generate++; return { gen: { ...NUMERIC_GEN, problemText: `What is 6 × ${6 + calls.generate}?` }, hash: `fresh${calls.generate}` }; },
    async persist() { calls.persist++; },
  };
  return { calls, sources };
}

(async () => {
  console.log('audited generated items');

  // -------------------------------------------------------------------------
  // The committed list + its builder
  // -------------------------------------------------------------------------
  const file = path.join(__dirname, '..', 'src', 'data', 'audited-generated-items.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8')) as { generatedAt: string; source: string; items: Record<string, string> };

  await test('the JSON holds exactly 3216 generated ids, each marked AUDITED', () => {
    assert.equal(data.generatedAt, '2026-10-09');
    assert.equal(data.source, 'audited generated items 2026-10-06 (828) + practice extension 2026-10-09 (357: two blind solvers, quality check, full read) + figure items 2026-10-09 (49: visual read) + depth job 2026-10-10 (1779: two blind solves, full read, grader test) + slope-field figure items 2026-10-10 (11: visual read)');
    assert.equal(Object.keys(data.items).length, 3216);
    for (const [id, mark] of Object.entries(data.items)) {
      assert.ok(id === id.trim() && isGeneratedPracticeItemId(id), `not a generated item id: ${JSON.stringify(id)}`);
      assert.equal(mark, 'AUDITED', id);
    }
    assert.deepEqual(Object.keys(data.items), [...Object.keys(data.items)].sort(), 'ids are sorted');
  });

  await test('no id is on both the audited and the withdrawn list', () => {
    const both = Object.keys(data.items).filter((id) => WITHDRAWN_ITEM_IDS.has(id));
    assert.deepEqual(both, []);
    assert.equal(WITHDRAWN_ITEM_IDS.size, 660);
  });

  await test('isAuditedGeneratedItem / the set reflect the JSON', () => {
    assert.equal(AUDITED_GENERATED_ITEM_IDS.size, 3216);
    assert.equal(isAuditedGeneratedItem(AUDITED_ID), true);
    assert.equal(isAuditedGeneratedItem(UNLISTED_ID), false);
    assert.equal(isAuditedGeneratedItem(WITHDRAWN_GEN_ID), false);
    assert.equal(isAuditedGeneratedItem(AUTHORED_ID), false);
    assert.equal(isAuditedGeneratedItem(undefined), false);
    assert.equal(isAuditedGeneratedItem(''), false);
    assert.equal(isAuditedGeneratedItem('constructor'), false);
  });

  await test('builder: CSV and JSONL input give the same sorted list', () => {
    const csv = 'id,loId,evidence\npractice-gen.b.lo.2,b.lo,"A, with a comma"\npractice-gen.a.lo.1,a.lo,B\n';
    const jsonl = '{"id":"practice-gen.b.lo.2"}\n\n{"id":"practice-gen.a.lo.1","x":1}\n';
    const want = { generatedAt: '2026-10-06', source: 'src', items: { 'practice-gen.a.lo.1': 'AUDITED', 'practice-gen.b.lo.2': 'AUDITED' } };
    assert.deepEqual(buildAuditedGeneratedList(readAuditedIds(csv, 'x.csv'), '2026-10-06', 'src', new Set()), want);
    assert.deepEqual(buildAuditedGeneratedList(readAuditedIds(jsonl, 'x.jsonl'), '2026-10-06', 'src', new Set()), want);
    assert.deepEqual(Object.keys(want.items), ['practice-gen.a.lo.1', 'practice-gen.b.lo.2']);
  });

  await test('builder: rejects a duplicate, a non-generated id, an empty id, and an id that is withdrawn', () => {
    const build = (list: string[], withdrawn: string[] = []) => buildAuditedGeneratedList(list, '2026-10-06', 's', new Set(withdrawn));
    assert.throws(() => build(['practice-gen.a.1', 'practice-gen.a.1']), /duplicate/);
    assert.throws(() => build(['alg1-authored-001']), /not a generated practice item id/);
    assert.throws(() => build(['plan::try-1']), /not a generated practice item id/);
    assert.throws(() => build(['']), /empty id/);
    assert.throws(() => build(['practice-gen.a.1'], ['practice-gen.a.1']), /withdrawn/);
    assert.throws(() => readAuditedIds('loId,evidence\na,b\n', 'x.csv'), /"id" column/);
  });

  await test('builder: rebuilding from the combined id file reproduces the committed file byte for byte', () => {
    const csvPath = path.join(__dirname, '..', '..', '..', '..', '..', '..', 'docs', 'whitelabel', 'greenapple', 'integration', 'practice-extension-2026-10-09', 'coverage-run', 'final', 'audited-generated-combined.csv');
    if (!fs.existsSync(csvPath)) { console.log('    (combined id file not present in this checkout — skipped)'); return; }
    const rebuilt = buildAuditedGeneratedList(readAuditedIds(fs.readFileSync(csvPath, 'utf8'), csvPath), data.generatedAt, data.source, WITHDRAWN_ITEM_IDS);
    assert.equal(JSON.stringify(rebuilt, null, 2) + '\n', fs.readFileSync(file, 'utf8'));
  });

  // -------------------------------------------------------------------------
  // The env switch
  // -------------------------------------------------------------------------
  await test('PRACTICE_GEN_AUDITED_ONLY_PARTNERS: unset / empty = nobody; trimmed; case-insensitive; whole ids; unknown caller never listed', () => {
    assert.equal(AUDITED_ONLY_PARTNERS_ENV, VAR);
    assert.equal(auditedOnlyForPartner('greenapple', {}), false);
    assert.equal(auditedOnlyForPartner('greenapple', { [VAR]: '' }), false);
    assert.equal(auditedOnlyForPartner('greenapple', { [VAR]: ' , ' }), false);
    assert.equal(auditedOnlyForPartner('greenapple', { [VAR]: 'greenapple' }), true);
    assert.equal(auditedOnlyForPartner(' GreenApple ', { [VAR]: 'kanzoo, GREENAPPLE ,x' }), true);
    assert.equal(auditedOnlyForPartner('green', { [VAR]: 'greenapple' }), false);
    assert.equal(auditedOnlyForPartner('greenapple2', { [VAR]: 'greenapple' }), false);
    assert.equal(auditedOnlyForPartner('crimsora', { [VAR]: 'greenapple' }), false);
    for (const unknown of [undefined, null, '', '   ']) {
      assert.equal(auditedOnlyForPartner(unknown, { [VAR]: 'greenapple' }), false);
      assert.equal(auditedOnlyForPartner(unknown, { [VAR]: ' , ,' }), false);
    }
  });

  await test('the switch is read at call time from process.env', () => {
    assert.equal(auditedOnlyForPartner('greenapple'), false);
    process.env[VAR] = 'greenapple';
    assert.equal(auditedOnlyForPartner('greenapple'), true);
    delete process.env[VAR];
    assert.equal(auditedOnlyForPartner('greenapple'), false);
  });

  await test('servableToPartner: only an unlisted GENERATED id, and only for a listed partner, is refused', () => {
    process.env[VAR] = 'greenapple';
    assert.equal(servableToPartner(UNLISTED_ID, 'greenapple'), false);
    assert.equal(servableToPartner(AUDITED_ID, 'greenapple'), true);
    assert.equal(servableToPartner(AUTHORED_ID, 'greenapple'), true);
    assert.equal(servableToPartner(TRY_ID, 'greenapple'), true);
    assert.equal(servableToPartner('brain-gen.algebra-1.abc', 'greenapple'), true);
    assert.equal(servableToPartner(UNLISTED_ID, 'crimsora'), true);
    assert.equal(servableToPartner(UNLISTED_ID, undefined), true);
    delete process.env[VAR];
    assert.equal(servableToPartner(UNLISTED_ID, 'greenapple'), true);
  });

  await test('withoutUnauditedGenerated: same array back when nothing applies; one count-only log line when rows are dropped', async () => {
    const items = BANK.map((b) => ({ id: b.id }));
    assert.equal(withoutUnauditedGenerated(items, 'greenapple', 'test'), items, 'env unset → same reference');
    process.env[VAR] = 'greenapple';
    assert.equal(withoutUnauditedGenerated(items, 'crimsora', 'test'), items, 'other partner → same reference');
    assert.equal(withoutUnauditedGenerated(items, undefined, 'test'), items, 'unknown partner → same reference');
    const { result, lines } = await captureLogs(() => withoutUnauditedGenerated(items, 'greenapple', 'test'));
    // Withdrawn is not this filter's business (it is not on the audited list either, so it goes too).
    assert.deepEqual(result.map((i) => i.id), [AUTHORED_ID, AUDITED_ID]);
    assert.deepEqual(lines, ['[practice] unaudited generated items filtered partner=greenapple where=test count=3']);
    assert.ok(!lines.join('\n').includes(UNLISTED_ID), 'count only — no ids in the log line');
    const clean = [{ id: AUTHORED_ID }, { id: AUDITED_ID }];
    const none = await captureLogs(() => withoutUnauditedGenerated(clean, 'greenapple', 'test'));
    assert.deepEqual(none.lines, [], 'nothing dropped → no line');
    assert.deepEqual(none.result, clean);
  });

  // -------------------------------------------------------------------------
  // retrievePractice
  // -------------------------------------------------------------------------
  await test('listed partner (LO scope): unlisted generated rows are dropped; audited generated, authored and plan items stay', async () => {
    process.env[VAR] = 'greenapple';
    const { result, lines } = await captureLogs(() => retrievePractice(req(), sourcesOf(), undefined, GA));
    assert.deepEqual(ids(result), [AUTHORED_ID, AUDITED_ID, TRY_ID]);
    assert.deepEqual(lines.filter((l) => l.includes('unaudited')), ['[practice] unaudited generated items filtered partner=greenapple where=practice-lo count=2']);
    // Withdrawn was removed first, by its own rule and with its own line.
    assert.deepEqual(lines.filter((l) => l.includes('withdrawn')), [`[practice] withdrawn item skipped ${WITHDRAWN_GEN_ID}`]);
  });

  await test('listed partner (topic scope): the same rows are dropped', async () => {
    process.env[VAR] = 'greenapple';
    const res = await retrievePractice(topicReq, sourcesOf(), undefined, GA);
    assert.deepEqual(ids(res), [AUTHORED_ID, AUDITED_ID, TRY_ID]);
  });

  await test('the caller bound on the sources (no explicit caller) is honoured', async () => {
    process.env[VAR] = 'greenapple';
    const res = await retrievePractice(req(), { ...sourcesOf(), caller: GA });
    assert.deepEqual(ids(res), [AUTHORED_ID, AUDITED_ID, TRY_ID]);
  });

  await test('an unlisted generated row never takes a slot: count is filled from the remaining pool', async () => {
    process.env[VAR] = 'greenapple';
    // Unlisted row FIRST: a post-slice filter would return a single item.
    const res = await retrievePractice(req(2), sourcesOf(), undefined, GA);
    assert.deepEqual(ids(res), [AUTHORED_ID, AUDITED_ID]);
  });

  await test('other partners, an unknown caller, and everyone when the env is unset: byte-identical to before', async () => {
    const baseline = async (caller?: { partnerId?: string }) => JSON.stringify(await retrievePractice(req(), sourcesOf(), undefined, caller));
    const topicBaseline = async (caller?: { partnerId?: string }) => JSON.stringify(await retrievePractice(topicReq, sourcesOf(), undefined, caller));
    const callers = [undefined, {}, { partnerId: '' }, { partnerId: 'crimsora' }, { partnerId: 'kanzoo' }, GA];
    const before = await Promise.all(callers.map(baseline));
    const beforeTopic = await Promise.all(callers.map(topicBaseline));
    // The unfiltered order: every non-withdrawn bank row, then the plan item.
    assert.deepEqual(ids(JSON.parse(before[0]!)), [UNLISTED_ID, AUTHORED_ID, AUDITED_ID, `practice-gen.${LO}.zzunlisted`, TRY_ID]);
    process.env[VAR] = 'greenapple';
    for (const [i, c] of callers.entries()) {
      if (c === GA) continue;
      const { result, lines } = await captureLogs(() => baseline(c));
      assert.equal(result, before[i], `caller ${JSON.stringify(c)}`);
      assert.deepEqual(lines.filter((l) => l.includes('unaudited')), []);
      assert.equal(await topicBaseline(c), beforeTopic[i], `topic, caller ${JSON.stringify(c)}`);
    }
    // And the listed partner is itself unchanged while the env is unset (asserted by `before` above being unfiltered).
    assert.deepEqual(ids(JSON.parse(before[callers.indexOf(GA)]!)), ids(JSON.parse(before[0]!)));
  });

  await test('withdrawn still wins: a withdrawn generated row is dropped for every caller, listed or not', async () => {
    for (const env of [undefined, 'greenapple']) {
      if (env) process.env[VAR] = env; else delete process.env[VAR];
      for (const c of [undefined, { partnerId: 'crimsora' }, GA]) {
        const res = await retrievePractice(req(), sourcesOf(), undefined, c);
        assert.ok(!ids(res).includes(WITHDRAWN_GEN_ID), `${env} ${JSON.stringify(c)}`);
      }
    }
    // Even if an id were ever on BOTH lists, the withdrawn rule runs first and for everyone.
    process.env[VAR] = 'greenapple';
    assert.equal(servableToPartner(WITHDRAWN_GEN_ID, 'greenapple'), false);
  });

  await test('listed partner: a shortfall is NOT topped up by generation (a fresh item is unaudited); empty reads none_available', async () => {
    process.env[VAR] = 'greenapple';
    process.env.PRACTICE_GEN = 'on';
    const g = countingGen();
    const res = await retrievePractice(req(5), sourcesOf(), g.sources, GA);
    assert.deepEqual(ids(res), [AUTHORED_ID, AUDITED_ID, TRY_ID]);
    assert.deepEqual(g.calls, { reserve: 0, generate: 0, persist: 0 });
    const empty = await retrievePractice(req(3), sourcesOf([row(UNLISTED_ID)], [{ ...plan, segments: [] }]), g.sources, GA);
    assert.deepEqual(empty, { items: [], emptyReason: 'none_available' });
    assert.deepEqual(g.calls, { reserve: 0, generate: 0, persist: 0 });
  });

  await test('another partner still generates on a shortfall, anchored on the full pool, exactly as before', async () => {
    process.env[VAR] = 'greenapple';
    process.env.PRACTICE_GEN = 'on';
    const g = countingGen();
    const res = await retrievePractice(req(6), sourcesOf(), g.sources, { partnerId: 'crimsora' });
    assert.equal(g.calls.reserve, 1);
    assert.equal(res.items.length, 6);
    assert.ok(ids(res).includes(UNLISTED_ID));
    assert.ok(ids(res).some((i) => i.startsWith(`practice-gen.${LO}.fresh`)));
  });

  await test('generatePracticeItemsDetailed never runs for a listed partner (no slot reserved, no model call, nothing banked)', async () => {
    process.env[VAR] = 'greenapple';
    process.env.PRACTICE_GEN = 'on';
    const g = countingGen();
    const events: string[] = [];
    const opts: GeneratePracticeItemsOptions = {
      studentId: 's1', loId: LO, topic: 'algebra-1', shortfall: 2, partnerId: 'GreenApple',
      anchorItems: [{ id: UNLISTED_ID, source: 'bank', problemText: 'UNLISTED-ANCHOR-TEXT', expectedAnswer: '1', loId: LO }],
      onDebugEvent: (t, m) => events.push(`${t} ${m}`),
    };
    const out = await generatePracticeItemsDetailed(opts, g.sources);
    assert.deepEqual({ items: out.items, status: out.status, reserved: out.reserved, pending: out.pending }, { items: [], status: 'off', reserved: 0, pending: 0 });
    assert.deepEqual(g.calls, { reserve: 0, generate: 0, persist: 0 });
    assert.deepEqual(events, [`practice_gen_skipped loId=${LO} reason=partner_audited_only`]);
    // Unlisted partner / unknown partner: the generator runs as before.
    for (const partnerId of ['crimsora', undefined]) {
      const g2 = countingGen();
      const out2 = await generatePracticeItemsDetailed({ ...opts, partnerId, onDebugEvent: undefined }, g2.sources);
      assert.equal(out2.items.length, 2, String(partnerId));
      assert.equal(g2.calls.reserve, 1);
    }
  });

  // -------------------------------------------------------------------------
  // Callers that inherit the rule
  // -------------------------------------------------------------------------
  await test('buildAssessment (placement check) never includes an unlisted generated item for a listed partner', async () => {
    const run = async (caller?: { partnerId?: string }) =>
      (await buildAssessment({ studentId: 's1', courseId: 'c1', loIds: [LO], maxPerLo: 10 } as Parameters<typeof buildAssessment>[0], sourcesOf(), undefined, caller)).items.map((i) => i.itemId);
    const before = await run({ partnerId: 'crimsora' });
    process.env[VAR] = 'greenapple';
    assert.deepEqual(await run(GA), [AUTHORED_ID, AUDITED_ID, TRY_ID]);
    assert.deepEqual(await run({ partnerId: 'crimsora' }), before);
    assert.ok(before.includes(UNLISTED_ID));
  });

  await test('resolveAssignmentItems (assigned practice) never includes an unlisted generated item and still fills from the pool', async () => {
    const input = { los: [{ loId: LO, title: 'Real numbers' }], band: 'steady' as const, seenItemIds: [], studentId: 's1', courseId: 'c1', cap: 2 };
    const before = await resolveAssignmentItems(input, { ...sourcesOf(), caller: { partnerId: 'crimsora' } });
    process.env[VAR] = 'greenapple';
    const out = await resolveAssignmentItems(input, { ...sourcesOf(), caller: GA });
    assert.deepEqual(out.map((l) => l.items.map((i) => i.id)), [[AUTHORED_ID, AUDITED_ID]]);
    assert.deepEqual(await resolveAssignmentItems(input, { ...sourcesOf(), caller: { partnerId: 'crimsora' } }), before);
    assert.equal(before[0]!.items[0]!.id, UNLISTED_ID);
  });

  await test('topUpPractice (session-end draft): a listed partner is never topped up by generation; other partners are', async () => {
    process.env[VAR] = 'greenapple';
    process.env.PRACTICE_GEN = 'on';
    const stored: PracticeItem = { id: AUDITED_ID, source: 'bank', problemText: 'q', expectedAnswer: '1', loId: LO };
    let genCalls = 0;
    const gen = async (): Promise<PracticeItem[]> => { genCalls++; return [{ ...stored, id: `practice-gen.${LO}.fresh${genCalls}` }]; };
    const resolved = [{ loId: LO, title: 'T', items: [stored] }];
    const want = [{ loId: LO, title: 'T' }];
    const input = { studentId: 's1', topic: 'algebra-1', anchorsFor: () => [] };
    const ga = await topUpPractice(resolved, want, { ...input, partnerId: 'greenapple' }, gen, 1000);
    assert.equal(genCalls, 0);
    assert.deepEqual(ga.map((l) => l.items.map((i) => i.id)), [[AUDITED_ID]]);
    const other = await topUpPractice(resolved, want, { ...input, partnerId: 'crimsora' }, gen, 1000);
    assert.ok(genCalls > 0);
    assert.ok(other[0]!.items.length > 1);
  });

  await test('stored assignments read for a listed partner: unlisted generated items are removed, emptied skills and assignments go', async () => {
    const item = (id: string) => ({ id, source: 'bank', problemText: 'q' });
    const recs = [
      { _id: 'a1', los: [{ loId: 'x', title: 'X', items: [item(UNLISTED_ID), item(AUDITED_ID), item(TRY_ID)] }, { loId: 'y', title: 'Y', items: [item(UNLISTED_ID)] }] },
      { _id: 'a2', los: [{ loId: 'z', title: 'Z', items: [item(`practice-gen.${LO}.zzunlisted`), item(UNLISTED_ID)] }] },
      { _id: 'a3', los: [{ loId: 'w', title: 'W', items: [item(AUTHORED_ID)] }] },
    ];
    const snapshot = JSON.stringify(recs);
    assert.equal(withoutUnauditedAssignmentItems(recs, 'greenapple'), recs, 'env unset → same reference');
    process.env[VAR] = 'greenapple';
    assert.equal(withoutUnauditedAssignmentItems(recs, 'crimsora'), recs);
    assert.equal(withoutUnauditedAssignmentItems(recs, undefined), recs);
    const { result, lines } = await captureLogs(() => withoutUnauditedAssignmentItems(recs, 'greenapple'));
    assert.deepEqual(result.map((r) => [r._id, r.los.map((l) => [l.loId, l.items.map((i) => i.id)])]), [
      ['a1', [['x', [AUDITED_ID, TRY_ID]]]],
      ['a3', [['w', [AUTHORED_ID]]]],
    ]);
    assert.equal(result[1], recs[2], 'an untouched assignment is the same object');
    assert.equal(result[0]!.los[0]!.title, 'X');
    assert.deepEqual(lines, ['[practice] unaudited generated items filtered partner=greenapple where=assigned-practice count=4']);
    assert.equal(JSON.stringify(recs), snapshot, 'input not mutated');
  });

  // -------------------------------------------------------------------------
  // Live session: generate_problem bank lookup
  // -------------------------------------------------------------------------
  const cand = (id: string, problemText = `text of ${id}`) => ({ id, problemText } as unknown as IProblemBank);
  const CANDS = [cand(UNLISTED_ID), cand(AUTHORED_ID), cand(AUDITED_ID), cand(WITHDRAWN_GEN_ID), cand('brain-gen.algebra-1.h1')];

  await test('generate_problem bank lookup: a listed partner never gets an unlisted generated row', async () => {
    const quiet = async <T,>(fn: () => T) => (await captureLogs(fn)).result;
    const base = await quiet(() => eligibleBankCandidates(CANDS, [], undefined).map((c) => c.id));
    assert.deepEqual(base, [UNLISTED_ID, AUTHORED_ID, AUDITED_ID, 'brain-gen.algebra-1.h1']);
    process.env[VAR] = 'greenapple';
    const { result, lines } = await captureLogs(() => eligibleBankCandidates(CANDS, [], 'greenapple').map((c) => c.id));
    assert.deepEqual(result, [AUTHORED_ID, AUDITED_ID, 'brain-gen.algebra-1.h1']);
    assert.deepEqual(lines.filter((l) => l.includes('unaudited')), ['[practice] unaudited generated items filtered partner=greenapple where=session-generate-problem count=1']);
    for (const p of ['crimsora', undefined, '']) assert.deepEqual(await quiet(() => eligibleBankCandidates(CANDS, [], p).map((c) => c.id)), base, String(p));
    // The pre-existing hash exclusion still applies, for everyone.
    const h = simpleHash(`text of ${AUDITED_ID}`);
    assert.deepEqual(await quiet(() => eligibleBankCandidates(CANDS, [h], 'greenapple').map((c) => c.id)), [AUTHORED_ID, 'brain-gen.algebra-1.h1']);
    assert.deepEqual(await quiet(() => eligibleBankCandidates(CANDS, [h], 'crimsora').map((c) => c.id)), [UNLISTED_ID, AUTHORED_ID, 'brain-gen.algebra-1.h1']);
  });

  await test('embedTokenPartnerClaim reads the partner off a session token; anything unreadable is "unknown"', () => {
    const token = signEmbedToken({ partner_id: 'greenapple', student_id: 's1' }, 'any-secret');
    assert.equal(embedTokenPartnerClaim(token), 'greenapple');
    // Restriction-only use: the claim is read without the secret (a forged
    // claim can only make the filter stricter for the forger).
    assert.equal(embedTokenPartnerClaim(`${token.split('.').slice(0, 2).join('.')}.badsig`), 'greenapple');
    for (const bad of [null, undefined, '', 'abc', 'a.b', 'a.b.c', 'bnVsbA.bnVsbA.x', signEmbedToken({ student_id: 's1' }, 's'), signEmbedToken({ partner_id: 7 }, 's')]) {
      assert.equal(embedTokenPartnerClaim(bad as string | null), undefined, String(bad));
    }
  });

  await test('the two session routes pass the token partner to generateProblem', () => {
    const read = (rel: string) => fs.readFileSync(path.join(__dirname, '..', 'src', 'app', 'api', 'tutor', rel), 'utf8');
    for (const rel of ['brain/stream/route.ts', 'generate-problem/route.ts']) {
      const src = read(rel);
      assert.ok(/embedTokenPartnerClaim\(req\.headers\.get\('x-embed-token'\)\)/.test(src), `${rel}: partner not read off the embed token`);
      assert.ok(/partnerId:\s*sessionPartnerId/.test(src), `${rel}: partner not passed to generateProblem`);
    }
    const pg = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'tutor', 'voice', 'problem-generator.ts'), 'utf8');
    assert.equal((pg.match(/await queryBank\(/g) ?? []).length, 2, 'two bank lookups (layer 1 and layer 3)');
    assert.equal((pg.match(/await queryBank\([^\n]*input\.partnerId\)/g) ?? []).length, 2, 'both bank lookups carry the partner');
    assert.equal((pg.match(/ProblemBank\.find\(/g) ?? []).length, 1, 'one bank read in the session path');
  });

  // -------------------------------------------------------------------------
  // Grading is untouched
  // -------------------------------------------------------------------------
  await test('an unlisted generated id already issued still resolves for grading', async () => {
    process.env[VAR] = 'greenapple';
    const bankDoc = { id: UNLISTED_ID, problemText: 'Q', answer: 'B', responseFormat: 'mcq', choices: ['a', 'b'], loId: 'bio.characteristics-of-life' } as unknown as IProblemBank;
    const deps: ItemKeyDeps = { async getStoredPlan() { return null; }, async findBankRow(id) { return id === UNLISTED_ID ? bankDoc : null; } };
    const got = await resolveGradeItem(UNLISTED_ID, deps);
    assert.ok(got, 'the grade resolver does not consult the audited list');
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})();

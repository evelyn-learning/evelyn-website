/**
 * Plan-generator model comparison — Haiku 4.5 (today) vs Haiku 5.5 vs Sonnet 5
 * on typed "Ask a question" topics (2026-10-22; brief:
 * .superpowers/sdd/plangen-model-compare-brief.md). LIVE API SPEND.
 *
 * Generation mirrors /api/portal/v1/plan-generate for a typed topic on the
 * homework-help brand with no studentId: text = topic = what the student
 * typed, Stage 1 (extractLearningObjectives), cap to maxLOsForBudget (the
 * route's homeworkNoPicker branch — TUTOR_HOMEWORK_OWN_MATERIAL defaults ON),
 * Stage 2 (expandSegmentsForLOs), namespace + parseLessonPlan, fallbackPlan on
 * any failure. No Mongo: nothing is cached or persisted.
 *
 * The registry reads TUTOR_MODEL_PLANGEN at module load, so each model's
 * generation pass runs as a CHILD PROCESS with that env (plus
 * TUTOR_PLANGEN_EFFORT for the newer models).
 *
 * Phases (all resume: a (model, topic) / segment / topic already recorded in
 * its JSONL is skipped):
 *   gen     generation per model            → gen.jsonl
 *   verify  production blind-solve verifier → verify.jsonl (verifyAnswerKey, content-verify = Sonnet 5)
 *   judge   blind Opus 5.5 rubric, per topic, plans shuffled → judge.jsonl
 *   report  markdown tables + CSV
 *
 * Usage (from apps/tutor):
 *   npx tsx scripts/eval/plangen-model-compare.ts dry            # 2 topics × Sonnet 5, gen+verify+judge, cost estimate
 *   npx tsx scripts/eval/plangen-model-compare.ts all            # gen (3 models) → verify → judge → report
 *   npx tsx scripts/eval/plangen-model-compare.ts gen|verify|judge|report
 * Env: PLANGEN_EVAL_DIR (default: the session scratchpad plangen-eval/), PLANGEN_EVAL_MD / _CSV (report paths).
 */
import { config } from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { AsyncLocalStorage } from 'node:async_hooks';
import { PLANGEN_TOPICS, type EvalTopic } from './plangen-topics';

config({ path: path.resolve(process.cwd(), '.env.local') });

const DEFAULT_DIR = '/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/4a161fe0-83a7-4975-9771-5713264fa71e/scratchpad/plangen-eval';
const DIR = process.env.PLANGEN_EVAL_DIR || DEFAULT_DIR;
const SESSION_MINUTES = 30;
const SPEND_CAP_USD = 25;
const JUDGE_MODEL = 'claude-opus-5-5';

export const MODELS: { id: string; effort?: 'low' }[] = [
  { id: 'claude-haiku-4-5-20251001' },
  { id: 'claude-haiku-5-5', effort: 'low' },
  { id: 'claude-sonnet-5', effort: 'low' },
];

/* ---------------------------------------------------------------- jsonl io */

function jsonlPath(name: string) {
  return path.join(DIR, `${name}.jsonl`);
}
function readJsonl<T>(name: string): T[] {
  const p = jsonlPath(name);
  if (!fs.existsSync(p)) return [];
  return fs
    .readFileSync(p, 'utf8')
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l) as T);
}
function appendJsonl(name: string, row: unknown) {
  fs.mkdirSync(DIR, { recursive: true });
  fs.appendFileSync(jsonlPath(name), JSON.stringify(row) + '\n');
}

async function pool<T>(items: T[], n: number, fn: (t: T) => Promise<void>) {
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) await fn(items[i++]);
    }),
  );
}

const pct = (xs: number[], p: number) => {
  if (xs.length === 0) return NaN;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.max(0, Math.ceil((p / 100) * s.length) - 1))];
};

/* ------------------------------------------------------------- rows (types) */

interface StageUsage {
  stage: 1 | 2;
  ms: number;
  inputTokens: number;
  outputTokens: number;
  stopReason: string | null;
  /** Content block types in order (thinking blocks show up here). */
  blocks?: string[];
  /** The text the stage parser saw — kept only on a failed generation. */
  rawText?: string;
  error?: string;
}
interface GenRow {
  model: string;
  effort: string | null;
  topicId: string;
  generatorOk: boolean;
  reason: string;
  stage1Ms: number | null;
  stage2Ms: number | null;
  totalMs: number;
  stage1LoCount: number;
  loCount: number;
  segmentCount: number;
  tryCount: number;
  usage: StageUsage[];
  costUsd: number;
  plan: unknown;
  at: string;
}
interface VerifyRow {
  model: string;
  topicId: string;
  segmentId: string;
  problem: string;
  expectedAnswer: string;
  status: string;
  solverAnswer?: string;
  reason: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
}
interface JudgeScore {
  concept: number;
  worked: number;
  tryYourself: number;
  structure: number;
  total: number;
  factualError: string;
}
interface JudgeRow {
  topicId: string;
  order: string[]; // label index → model
  scores: Record<string, JudgeScore>; // model → score
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  error?: string;
}

/** Everything recorded so far, across all three JSONLs — the $25 cap guard. */
function spentSoFar(): number {
  const sum = (name: string) => readJsonl<{ costUsd: number }>(name).reduce((a, r) => a + (r.costUsd || 0), 0);
  return sum('gen') + sum('verify') + sum('judge');
}
function assertUnderCap() {
  const s = spentSoFar();
  if (s > SPEND_CAP_USD) throw new Error(`spend cap: $${s.toFixed(2)} recorded > $${SPEND_CAP_USD} — stopping`);
}

/* --------------------------------------------------------------- generation */

async function genChild(modelId: string, topicIds: string[]) {
  const { getModelClient } = await import('../../src/lib/tutor/ai/model-registry');
  const { lookupModelRate } = await import('../../src/lib/tutor/ai/model-rates');
  const gen = await import('../../src/lib/tutor/lesson-plan/generate-from-text');
  const { maxLOsForBudget } = await import('../../src/lib/tutor/lesson-plan/session-budget');
  const { parseLessonPlan } = await import('../../src/lib/tutor/lesson-plan/parser');
  const { LESSON_PLAN_SCHEMA_VERSION } = await import('../../src/lib/tutor/lesson-plan/types');
  const { client, model } = getModelClient('plangen');
  if (model !== modelId) throw new Error(`registry resolved ${model}, expected ${modelId}`);
  const effort = gen.plangenEffort() ?? null;

  // Attribute usage/latency per (topic, stage): wrap the shared client's
  // create() and record into the AsyncLocalStorage of the calling topic.
  const als = new AsyncLocalStorage<StageUsage[]>();
  const messages = client.messages as unknown as { create: (p: unknown, o?: unknown) => Promise<unknown> };
  const realCreate = messages.create.bind(client.messages);
  messages.create = async (p: unknown, o?: unknown) => {
    const store = als.getStore();
    const stage: 1 | 2 = JSON.stringify((p as { system?: unknown }).system ?? '').startsWith('"You extract') ? 1 : 2;
    const t0 = Date.now();
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r: any = await realCreate(p, o);
      store?.push({
        stage,
        ms: Date.now() - t0,
        inputTokens: r.usage?.input_tokens ?? 0,
        outputTokens: r.usage?.output_tokens ?? 0,
        stopReason: r.stop_reason ?? null,
        blocks: (r.content ?? []).map((b: { type: string }) => b.type),
        rawText: (r.content ?? []).filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text).join(''),
      });
      return r;
    } catch (e) {
      store?.push({ stage, ms: Date.now() - t0, inputTokens: 0, outputTokens: 0, stopReason: null, error: String((e as Error).message).slice(0, 300) });
      throw e;
    }
  };

  const rate = lookupModelRate(model);
  if (!rate) throw new Error(`no rate row for ${model}`);
  const topics = PLANGEN_TOPICS.filter((t) => topicIds.includes(t.id));

  await pool(topics, 3, async (t: EvalTopic) => {
    const usage: StageUsage[] = [];
    const t0 = Date.now();
    const row = await als.run(usage, async () => {
      const genInput = { text: t.text, subject: t.subject, grade: t.grade, topic: t.text, locale: undefined };
      const X = maxLOsForBudget({ sessionMinutes: SESSION_MINUTES, grade: t.grade });
      const planId = `gen-eval-${t.id}`;
      const stage1 = await gen.extractLearningObjectives(genInput);
      if (!stage1.ok || stage1.los.length === 0) {
        return { ok: false, reason: `stage1: ${stage1.reason}`, plan: gen.fallbackPlan(genInput, stage1.reason, planId), s1Los: 0 };
      }
      const fullLos = stage1.los.slice(0, Math.max(1, X)); // capObjectivesForHomework
      const stage2 = await gen.expandSegmentsForLOs(fullLos, genInput);
      if (!stage2.ok || stage2.segments.length === 0) {
        return { ok: false, reason: `stage2: ${stage2.reason}`, plan: gen.fallbackPlan(genInput, stage2.reason, planId), s1Los: stage1.los.length };
      }
      const ns = gen.namespaceGeneratedLos({ planId, los: fullLos, segments: stage2.segments });
      try {
        const plan = parseLessonPlan({
          id: planId,
          title: stage1.titleSuggestion,
          curriculum: 'freestyle',
          grade: t.grade,
          subject: t.subject,
          topic: t.text,
          locale: 'en',
          los: ns.los,
          estimatedMinutes: SESSION_MINUTES,
          segments: [{ id: 'intro', kind: 'hook', goal: 'intro' }, ...ns.segments, gen.buildRecapSegment(ns.los)],
          prerequisites: [],
          followUps: [],
          schemaVersion: LESSON_PLAN_SCHEMA_VERSION,
          metadata: { generatedFromText: true, generatorOk: true, sessionMaxLOs: X },
        });
        return { ok: true, reason: 'generated ok', plan, s1Los: stage1.los.length };
      } catch (err) {
        const kind = err instanceof Error ? err.constructor.name : typeof err;
        return { ok: false, reason: `parse failed: ${kind}: ${String((err as Error).message).slice(0, 200)}`, plan: gen.fallbackPlan(genInput, 'parse failed', planId), s1Los: stage1.los.length };
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plan = row.plan as any;
    const segs: { kind: string }[] = plan.segments ?? [];
    const s1 = usage.find((u) => u.stage === 1);
    const s2 = usage.find((u) => u.stage === 2);
    const inTok = usage.reduce((a, u) => a + u.inputTokens, 0);
    const outTok = usage.reduce((a, u) => a + u.outputTokens, 0);
    if (row.ok) for (const u of usage) delete u.rawText;
    const out: GenRow = {
      model,
      effort,
      topicId: t.id,
      generatorOk: row.ok,
      reason: row.reason,
      stage1Ms: s1?.ms ?? null,
      stage2Ms: s2?.ms ?? null,
      totalMs: Date.now() - t0,
      stage1LoCount: row.s1Los,
      loCount: row.ok ? plan.los.length : 0,
      segmentCount: segs.length,
      tryCount: segs.filter((s) => s.kind === 'try_yourself').length,
      usage,
      costUsd: (inTok * rate.input + outTok * rate.output) / 1e6,
      plan,
      at: new Date().toISOString(),
    };
    appendJsonl('gen', out);
    console.log(`[gen] ${model} ${t.id} ok=${row.ok} los=${out.loCount} try=${out.tryCount} ${out.totalMs}ms $${out.costUsd.toFixed(4)} ${row.ok ? '' : row.reason}`);
  });
}

function runGen(models: typeof MODELS, topicIds: string[]) {
  const done = readJsonl<GenRow>('gen');
  for (const m of models) {
    const todo = topicIds.filter((id) => !done.some((r) => r.model === m.id && r.topicId === id));
    assertUnderCap();
    if (todo.length === 0) {
      console.log(`[gen] ${m.id}: all ${topicIds.length} recorded, skipping`);
      continue;
    }
    const env: NodeJS.ProcessEnv = { ...process.env, TUTOR_MODEL_PLANGEN: m.id, PLANGEN_EVAL_DIR: DIR };
    delete env.TUTOR_PLANGEN_EFFORT;
    if (m.effort) env.TUTOR_PLANGEN_EFFORT = m.effort;
    const r = spawnSync('npx', ['tsx', process.argv[1], '__gen-child', m.id, todo.join(',')], { stdio: 'inherit', env, cwd: process.cwd() });
    if (r.status !== 0) throw new Error(`gen child for ${m.id} exited ${r.status}`);
  }
}

/* --------------------------------------------------------------- verify */

async function runVerify(filter?: (g: GenRow) => boolean) {
  const { verifyAnswerKey, keyVerifyModel } = await import('../../src/lib/tutor/portal/key-verify');
  const { lookupModelRate } = await import('../../src/lib/tutor/ai/model-rates');
  const vModel = keyVerifyModel();
  const rate = lookupModelRate(vModel)!;
  const done = readJsonl<VerifyRow>('verify');
  const jobs: { g: GenRow; seg: { id: string; problem: string; expectedAnswer: string; responseFormat?: string } }[] = [];
  for (const g of readJsonl<GenRow>('gen')) {
    if (filter && !filter(g)) continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const seg of ((g.plan as any).segments ?? []) as any[]) {
      if (seg.kind !== 'try_yourself' || !seg.problem?.trim() || !seg.expectedAnswer?.trim()) continue;
      if (done.some((v) => v.model === g.model && v.topicId === g.topicId && v.segmentId === seg.id)) continue;
      jobs.push({ g, seg });
    }
  }
  console.log(`[verify] ${jobs.length} try-yourselves to check with ${vModel}`);
  await pool(jobs, 6, async ({ g, seg }) => {
    assertUnderCap();
    const r = await verifyAnswerKey({ question: seg.problem, claimedAnswer: seg.expectedAnswer, answerFormat: seg.responseFormat ?? undefined });
    const row: VerifyRow = {
      model: g.model,
      topicId: g.topicId,
      segmentId: seg.id,
      problem: seg.problem,
      expectedAnswer: seg.expectedAnswer,
      status: r.status,
      solverAnswer: r.solverAnswer,
      reason: r.reason,
      inputTokens: r.usage.inputTokens,
      outputTokens: r.usage.outputTokens,
      costUsd: (r.usage.inputTokens * rate.input + r.usage.outputTokens * rate.output) / 1e6,
    };
    appendJsonl('verify', row);
    console.log(`[verify] ${g.model} ${g.topicId} ${seg.id.split('.').pop()} → ${r.status}`);
  });
}

/* --------------------------------------------------------------- judge */

const JUDGE_SYSTEM = `You are a strict, expert reviewer of short tutoring lesson plans written for a live one-on-one AI tutor. A student typed a topic; each plan below was generated for that topic, for the stated grade band and a 30-minute session. The plans come from different generators, are labelled only by letter, and are shown in random order — judge each one on its own merits against the rubric, not against the others.

Score each plan 0, 1 or 2 on each criterion (2 = fully meets, 1 = minor problem, 0 = serious problem):
(a) concept — keyIdeas and goals are factually right and free of misconceptions.
(b) worked — every worked example's steps and final answer are correct and the steps actually lead to the answer.
(c) tryYourself — every try_yourself problem is well-posed (one unambiguous answer, enough information given), its expectedAnswer is correct, and it fits the grade band.
(d) structure — sensible number and order of objectives for a 30-minute session on what the student asked, fields terse, no padding or off-topic objectives.

Check the arithmetic and facts yourself. factualError: if you find any factual or computational error, quote the wrong text exactly and say briefly what is wrong (one line); otherwise the empty string.`;

const JUDGE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['plans'],
  properties: {
    plans: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['label', 'concept', 'worked', 'tryYourself', 'structure', 'factualError'],
        properties: {
          label: { type: 'string' },
          concept: { type: 'integer', enum: [0, 1, 2] },
          worked: { type: 'integer', enum: [0, 1, 2] },
          tryYourself: { type: 'integer', enum: [0, 1, 2] },
          structure: { type: 'integer', enum: [0, 1, 2] },
          factualError: { type: 'string' },
        },
      },
    },
  },
};

/** Model-blind rendering of a plan: LOs + teaching segments, no ids, no metadata. */
function renderPlanForJudge(plan: unknown): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = plan as any;
  const los = (p.los ?? []).map((lo: { description: string }, i: number) => `${i + 1}. ${lo.description}`);
  const segs = (p.segments ?? [])
    .filter((s: { kind: string }) => ['hook', 'concept', 'worked_example', 'try_yourself'].includes(s.kind) && s.id !== 'intro')
    .map((s: Record<string, unknown>) => {
      const lo = String(s.id).match(/\.lo-(\d+)-/)?.[1] ?? '?';
      const f: Record<string, unknown> = { lo: Number(lo), kind: s.kind };
      for (const k of ['goal', 'keyIdeas', 'problem', 'steps', 'answer', 'expectedAnswer']) if (s[k] !== undefined) f[k] = s[k];
      return JSON.stringify(f);
    });
  return `Objectives:\n${los.join('\n')}\nSegments:\n${segs.join('\n')}`;
}

function seededShuffle<T>(xs: T[], seed: string): T[] {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  const rnd = () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0), (h ^= h >>> 13), (h >>> 0) / 4294967296);
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function runJudge(modelIds: string[], topicIds: string[]) {
  const { getModelClient } = await import('../../src/lib/tutor/ai/model-registry');
  const { lookupModelRate } = await import('../../src/lib/tutor/ai/model-rates');
  const { client } = getModelClient('content-verify'); // same Anthropic key; model overridden below
  const rate = lookupModelRate(JUDGE_MODEL)!;
  const gens = readJsonl<GenRow>('gen');
  const done = readJsonl<JudgeRow>('judge').filter((j) => !j.error);
  const todo = topicIds.filter((id) => !done.some((j) => j.topicId === id));
  await pool(todo, 4, async (topicId) => {
    assertUnderCap();
    const t = PLANGEN_TOPICS.find((x) => x.id === topicId)!;
    const rows = modelIds.map((m) => gens.find((g) => g.model === m && g.topicId === topicId));
    if (rows.some((r) => !r)) {
      console.log(`[judge] ${topicId}: generation incomplete, skipping`);
      return;
    }
    // Fallback skeletons are not plans for this topic — scored 0, not shown.
    const real = rows.filter((r) => r!.generatorOk).map((r) => r!);
    const order = seededShuffle(real.map((r) => r.model), `judge-${topicId}`);
    const labels = order.map((_, i) => String.fromCharCode(65 + i));
    const scores: Record<string, JudgeScore> = {};
    for (const r of rows) if (!r!.generatorOk) scores[r!.model] = { concept: 0, worked: 0, tryYourself: 0, structure: 0, total: 0, factualError: '(fallback plan — not judged)' };
    let inputTokens = 0;
    let outputTokens = 0;
    let error: string | undefined;
    if (order.length > 0) {
      const user = `Student typed: "${t.text}"\nSubject: ${t.subject}\nGrade band: ${t.grade}\nSession: ${SESSION_MINUTES} minutes\n\n${order
        .map((m, i) => `=== Plan ${labels[i]} ===\n${renderPlanForJudge(real.find((r) => r.model === m)!.plan)}`)
        .join('\n\n')}\n\nReturn one entry per plan (labels ${labels.join(', ')}).`;
      try {
        let msg;
        for (let attempt = 0; ; attempt++) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            msg = await (client.messages.create as any)({
              model: JUDGE_MODEL,
              max_tokens: 16000,
              system: JUDGE_SYSTEM,
              messages: [{ role: 'user', content: user }],
              thinking: { type: 'adaptive' },
              output_config: { effort: 'low', format: { type: 'json_schema', schema: JUDGE_SCHEMA } },
            });
            break;
          } catch (e) {
            if (attempt >= 1) throw e;
          }
        }
        inputTokens = msg.usage?.input_tokens ?? 0;
        outputTokens = msg.usage?.output_tokens ?? 0;
        if (msg.stop_reason !== 'end_turn') throw new Error(`stop_reason=${msg.stop_reason}`);
        const text = msg.content.filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text).join('');
        const parsed = JSON.parse(text) as { plans: (Omit<JudgeScore, 'total'> & { label: string })[] };
        for (const [i, m] of order.entries()) {
          const s = parsed.plans.find((p) => p.label.trim().replace(/^Plan\s+/i, '') === labels[i]);
          if (!s) throw new Error(`judge omitted plan ${labels[i]}`);
          scores[m] = { concept: s.concept, worked: s.worked, tryYourself: s.tryYourself, structure: s.structure, total: s.concept + s.worked + s.tryYourself + s.structure, factualError: s.factualError };
        }
      } catch (e) {
        error = String((e as Error).message).slice(0, 300);
      }
    }
    const row: JudgeRow = { topicId, order, scores, inputTokens, outputTokens, costUsd: (inputTokens * rate.input + outputTokens * rate.output) / 1e6, ...(error ? { error } : {}) };
    appendJsonl('judge', row);
    console.log(`[judge] ${topicId} ${error ? `ERROR ${error}` : order.map((m) => `${m.replace('claude-', '')}=${scores[m].total}`).join(' ')} $${row.costUsd.toFixed(4)}`);
  });
}

/* --------------------------------------------------------------- report */

function short(m: string) {
  return m.replace('claude-', '').replace('-20251001', '');
}

function report(mdPath: string, csvPath: string) {
  const gens = readJsonl<GenRow>('gen');
  const ver = readJsonl<VerifyRow>('verify');
  const judges = readJsonl<JudgeRow>('judge').filter((j) => !j.error);
  const judgeOf = (topicId: string) => judges.filter((j) => j.topicId === topicId).at(-1);
  const keyStats = (rows: VerifyRow[]) => {
    const c = { verified: 0, mismatch: 0, ill_posed: 0, unverifiable: 0 } as Record<string, number>;
    for (const r of rows) c[r.status] = (c[r.status] ?? 0) + 1;
    return { ...c, n: rows.length, rate: rows.length ? c.verified / rows.length : NaN };
  };
  const f = (n: number, d = 2) => (Number.isFinite(n) ? n.toFixed(d) : '–');
  const lines: string[] = [];
  const csv: string[] = ['model,effort,topic_id,subject,grade,generator_ok,reason,lo_count,segment_count,try_count,stage1_ms,stage2_ms,total_ms,in_tokens,out_tokens,cost_usd,keys_verified,keys_mismatch,keys_ill_posed,keys_unverifiable,judge_concept,judge_worked,judge_try,judge_structure,judge_total,judge_factual_error'];
  const summary: string[] = [];
  summary.push('| Model | Effort | Verified-key rate | Keys v / m / ill / u | Judge /8 | Concept | Worked | Try | Structure | Fallback rate | p50 S1 | p50 S2 | p50 total | p90 total | Cost / plan |');
  summary.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  let genSpend = 0;
  for (const m of MODELS) {
    const g = gens.filter((r) => r.model === m.id);
    if (g.length === 0) continue;
    const k = keyStats(ver.filter((v) => v.model === m.id));
    const sc = g.map((r) => judgeOf(r.topicId)?.scores[m.id]).filter(Boolean) as JudgeScore[];
    const mean = (sel: (s: JudgeScore) => number) => sc.reduce((a, s) => a + sel(s), 0) / sc.length;
    const fb = g.filter((r) => !r.generatorOk).length;
    const cost = g.reduce((a, r) => a + r.costUsd, 0);
    genSpend += cost;
    summary.push(
      `| ${short(m.id)} | ${m.effort ?? 'unset (today)'} | ${f(k.rate * 100, 1)}% | ${k.verified} / ${k.mismatch} / ${k.ill_posed} / ${k.unverifiable} (n=${k.n}) | ${f(mean((s) => s.total))} | ${f(mean((s) => s.concept))} | ${f(mean((s) => s.worked))} | ${f(mean((s) => s.tryYourself))} | ${f(mean((s) => s.structure))} | ${fb}/${g.length} | ${f(pct(g.map((r) => r.stage1Ms ?? NaN).filter(Number.isFinite), 50) / 1000, 1)} s | ${f(pct(g.map((r) => r.stage2Ms ?? NaN).filter(Number.isFinite), 50) / 1000, 1)} s | ${f(pct(g.map((r) => r.totalMs), 50) / 1000, 1)} s | ${f(pct(g.map((r) => r.totalMs), 90) / 1000, 1)} s | $${f(cost / g.length, 4)} |`,
    );
  }
  const verifySpend = ver.reduce((a, r) => a + r.costUsd, 0);
  const judgeSpend = readJsonl<JudgeRow>('judge').reduce((a, r) => a + r.costUsd, 0);

  lines.push('## Results by model', '', ...summary, '');
  lines.push(`Spend: generation $${f(genSpend, 3)} · key verification (Sonnet 5) $${f(verifySpend, 3)} · judge (Opus 5.5) $${f(judgeSpend, 3)} · **total $${f(genSpend + verifySpend + judgeSpend, 2)}**.`, '');

  // Reliability detail
  lines.push('## Reliability', '');
  lines.push('| Model | Fallbacks (reasons) | Stage errors | max_tokens stops | p90 S1 | p90 S2 | mean LOs | mean try-yourselves | mean out tokens S1 / S2 |');
  lines.push('|---|---|---|---|---|---|---|---|---|');
  for (const m of MODELS) {
    const g = gens.filter((r) => r.model === m.id);
    if (g.length === 0) continue;
    const u = g.flatMap((r) => r.usage);
    const reasons = g.filter((r) => !r.generatorOk).map((r) => `${r.topicId}: ${r.reason}`);
    const meanOut = (st: 1 | 2) => {
      const x = u.filter((v) => v.stage === st);
      return x.reduce((a, v) => a + v.outputTokens, 0) / (x.length || 1);
    };
    lines.push(
      `| ${short(m.id)} | ${reasons.length ? reasons.join('; ') : 'none'} | ${u.filter((v) => v.error).length} | ${u.filter((v) => v.stopReason === 'max_tokens').length} | ${f(pct(g.map((r) => r.stage1Ms ?? NaN).filter(Number.isFinite), 90) / 1000, 1)} s | ${f(pct(g.map((r) => r.stage2Ms ?? NaN).filter(Number.isFinite), 90) / 1000, 1)} s | ${f(g.reduce((a, r) => a + r.loCount, 0) / g.length, 1)} | ${f(g.reduce((a, r) => a + r.tryCount, 0) / g.length, 1)} | ${f(meanOut(1), 0)} / ${f(meanOut(2), 0)} |`,
    );
  }
  lines.push('');

  // Per-topic
  lines.push('## Per topic', '', `| Topic | Grade | ${MODELS.map((m) => `${short(m.id)} judge · keys`).join(' | ')} |`, `|---|---|${MODELS.map(() => '---').join('|')}|`);
  for (const t of PLANGEN_TOPICS) {
    const cells = MODELS.map((m) => {
      const g = gens.find((r) => r.model === m.id && r.topicId === t.id);
      if (!g) return '–';
      const k = keyStats(ver.filter((v) => v.model === m.id && v.topicId === t.id));
      const s = judgeOf(t.id)?.scores[m.id];
      const keys = `${k.verified}/${k.n}✓${k.mismatch ? ` ${k.mismatch}✗` : ''}${k.ill_posed ? ` ${k.ill_posed}ill` : ''}${k.unverifiable ? ` ${k.unverifiable}?` : ''}`;
      return `${g.generatorOk ? (s ? s.total : '?') : 'FALLBACK'} · ${keys}`;
    });
    lines.push(`| ${t.text} | ${t.subject} ${t.grade} | ${cells.join(' | ')} |`);
  }
  lines.push('', 'Keys: `v/n✓` verified of checked, `✗` mismatch, `ill` ill-posed, `?` unverifiable.', '');

  // Factual errors + mismatches
  lines.push('## Judge-quoted factual errors', '');
  for (const m of MODELS) {
    const errs = PLANGEN_TOPICS.map((t) => ({ t, s: judgeOf(t.id)?.scores[m.id] })).filter((x) => x.s && x.s.factualError.trim() && !x.s.factualError.startsWith('(fallback'));
    lines.push(`### ${short(m.id)} (${errs.length})`, '');
    for (const { t, s } of errs) lines.push(`- **${t.id}** — ${s!.factualError.replace(/\n/g, ' ')}`);
    lines.push('');
  }
  lines.push('## Key mismatches (blind solve disagreed)', '');
  for (const m of MODELS) {
    const mm = ver.filter((v) => v.model === m.id && (v.status === 'mismatch' || v.status === 'ill_posed'));
    lines.push(`### ${short(m.id)} (${mm.length})`, '');
    for (const v of mm) lines.push(`- **${v.topicId}** [${v.status}] "${v.problem}" — key \`${v.expectedAnswer}\`, solver \`${v.solverAnswer ?? '–'}\` (${v.reason.replace(/\n/g, ' ').slice(0, 160)})`);
    lines.push('');
  }

  for (const g of gens) {
    const t = PLANGEN_TOPICS.find((x) => x.id === g.topicId)!;
    const k = keyStats(ver.filter((v) => v.model === g.model && v.topicId === g.topicId));
    const s = judgeOf(g.topicId)?.scores[g.model];
    const q = (x: unknown) => `"${String(x ?? '').replace(/"/g, '""')}"`;
    csv.push(
      [g.model, g.effort ?? '', g.topicId, t.subject, t.grade, g.generatorOk, q(g.reason), g.loCount, g.segmentCount, g.tryCount, g.stage1Ms ?? '', g.stage2Ms ?? '', g.totalMs, g.usage.reduce((a, u) => a + u.inputTokens, 0), g.usage.reduce((a, u) => a + u.outputTokens, 0), g.costUsd.toFixed(6), k.verified, k.mismatch, k.ill_posed, k.unverifiable, s?.concept ?? '', s?.worked ?? '', s?.tryYourself ?? '', s?.structure ?? '', s?.total ?? '', q(s?.factualError ?? '')].join(','),
    );
  }
  fs.mkdirSync(path.dirname(mdPath), { recursive: true });
  fs.writeFileSync(mdPath, lines.join('\n') + '\n');
  fs.mkdirSync(path.dirname(csvPath), { recursive: true });
  fs.writeFileSync(csvPath, csv.join('\n') + '\n');
  console.log(lines.slice(0, summary.length + 4).join('\n'));
  console.log(`[report] wrote ${mdPath} and ${csvPath}`);
  return genSpend + verifySpend + judgeSpend;
}

/* --------------------------------------------------------------- main */

async function main() {
  const [cmd, a1, a2] = process.argv.slice(2);
  const allIds = PLANGEN_TOPICS.map((t) => t.id);
  const mdPath = process.env.PLANGEN_EVAL_MD || path.join(DIR, 'report.md');
  const csvPath = process.env.PLANGEN_EVAL_CSV || path.join(DIR, 'report.csv');
  if (cmd === '__gen-child') return genChild(a1, a2.split(','));
  if (cmd === 'dry') {
    if (!process.env.PLANGEN_EVAL_DIR) throw new Error('set PLANGEN_EVAL_DIR to a dry-run dir');
    const ids = allIds.slice(0, 2);
    const m = MODELS.filter((x) => x.id === (a1 || 'claude-sonnet-5'));
    runGen(m, ids);
    await runVerify();
    await runJudge(m.map((x) => x.id), ids);
    const spent = report(mdPath, csvPath);
    // Extrapolate: verify + judge scale with plans; generation by model rate ratio is printed per model in the full run.
    const gens = readJsonl<GenRow>('gen');
    const perPlanGen = gens.reduce((a, r) => a + r.costUsd, 0) / gens.length;
    const perPlanVerify = readJsonl<VerifyRow>('verify').reduce((a, r) => a + r.costUsd, 0) / gens.length;
    const perTopicJudgeOne = readJsonl<JudgeRow>('judge').reduce((a, r) => a + r.costUsd, 0) / ids.length;
    const est = 30 * perPlanGen * 1.6 /* Sonnet + Haiku 4.5 (~0.5×) + Haiku 5.5 (~0.1×) */ + 90 * perPlanVerify + 30 * perTopicJudgeOne * 2.6;
    console.log(`[dry] spent $${spent.toFixed(3)}; per plan gen $${perPlanGen.toFixed(4)}, verify $${perPlanVerify.toFixed(4)}; judge (1 plan) $${perTopicJudgeOne.toFixed(4)}; FULL-RUN ESTIMATE ≈ $${est.toFixed(2)} (cap $${SPEND_CAP_USD})`);
    return;
  }
  if (cmd === 'gen' || cmd === 'all') runGen(MODELS, allIds);
  if (cmd === 'verify' || cmd === 'all') await runVerify();
  if (cmd === 'judge' || cmd === 'all') await runJudge(MODELS.map((m) => m.id), allIds);
  if (cmd === 'report' || cmd === 'all') report(mdPath, csvPath);
  if (!['gen', 'verify', 'judge', 'report', 'all'].includes(cmd ?? '')) {
    console.error('usage: plangen-model-compare.ts dry [model] | gen | verify | judge | report | all');
    process.exit(2);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

/**
 * Offline practice-item extension: write new practice items for the
 * objectives of a skill that have none (or too few), then audit every item
 * with two independent blind solvers before anything is exported.
 *
 * Reads local JSON files, calls model APIs, writes local files under --out.
 * It opens NO database connection and it does NOT seed anything: `export`
 * only writes ProblemBank-shaped rows for a later, separate seeding step.
 *
 *   npx tsx scripts/practice-extend/practice-extend.ts <stage> --out <dir> [options]
 *
 * Stages (each resumable; each reads the files of the stage before it):
 *   figures       one cheap call per skill: which objectives cannot be practised without a
 *                 figure → figure-objectives.json (they are then never requested)
 *   plan          coverage file → targets.jsonl (skill, objective, n)
 *   generate      one model call per skill → generated.jsonl
 *   audit         per item: rule checks → quality review → two blind solvers (+ tie-break) → audit.jsonl
 *   second-check  the same two-solver check on EXISTING items (--in) → second-check.jsonl
 *   export        accepted items → export/problem-bank-rows.json, export/audited-item-ids.json,
 *                 export/coverage-after-export.json
 *   review        review.md for a human reader + summary.json
 *
 * Options
 *   --out <dir>              stage files live here (required)
 *   --dump <file>            plans + bank rows ({plans, bank})        [plan, generate, audit, export, review]
 *   --coverage <file>        coverage report ({skills:[…]})            [plan, export]
 *   --skills-map <file>      skill → subject list                      [plan]
 *   --min-per-objective N    default 2          --min-per-skill N   default 8
 *   --skills a,b             only these skill ids (skillLoId)
 *   --sample N               N skills spread over the subjects
 *   --in <file>              items to second-check ([{id, problem, answer, …}])
 *   --tier <name>            second-check: only rows with this `tier`
 *   --limit N                process at most N skills / items this run
 *   --concurrency N          default 4
 *   --max-usd X              spend cap over the whole ledger (required for stages that call a model)
 *   --exclude-targets a,b    plan: leave out the skills of earlier targets.jsonl files (a fresh sample)
 *   --figures <file>         plan / export / review: a figure-objectives.json; those objectives are not requested
 *   --empty-only             plan: coverage mode — request only for objectives with NO servable item
 *                            (--per-objective N each, default 3); no top-up, no per-skill minimum
 *   --retry-empty-from <dir> plan: a further pass — the objectives targeted in <dir> that have no
 *                            accepted question there (--per-objective N each)
 *   --previous <dir>         generate / audit: an earlier pass; its rejected attempts are shown to the
 *                            writer with the reason, and its questions count for the duplicate check
 *   --also a,b               export / review: merge these run directories into the result
 *   --key-first              audit: answer check before the quality review (default: quality first)
 *   --max-items-per-call N   generate: split a skill's request into calls of at most N questions (default 6)
 *   --gen-effort E           generate: thinking effort of the writer (default medium; none = no thinking)
 *   --split-review           review: kept questions → review.md, the rest → rejected.md
 *   --require-figure-skill   plan --sample: make sure one sampled skill has a figure-dependent objective
 *   --reassess-assumptions   second-check: re-decide stored "unstated assumption" rejections with the
 *                            answer-changing classification (stored solves are reused)
 *   --retry-incomplete       generate: redo skills whose stored reply was incomplete (status salvaged)
 *   --ledger <file>          cost ledger (default <out>/ledger.jsonl); share one file between
 *                            runs to cap them together
 *
 * Credentials: ANTHROPIC_API_KEY from apps/tutor/.env.local, the DeepSeek
 * key / base URL / model from the TUTOR_MODEL_BRAIN_FALLBACK* entries of
 * <worktree>/.env.local.production. Only those keys are read; none is printed.
 */
import fs from 'node:fs';
import path from 'node:path';
import { buildSolverPrompt, type SolverView } from '../../src/lib/tutor/portal/key-verify-prompts';
import { parseNumericKey } from '../../src/lib/tutor/portal/numeric-answer-rule';
import type { JudgeVerdict } from '../../src/lib/tutor/portal/key-compare';
import {
  BudgetExceeded,
  GENERATION_SCHEMA,
  chunkTargets,
  planEmptyTargets,
  QUALITY_CHECKS,
  STRICT_CHECKS,
  confirmedFlags,
  contentDefects,
  contestedFlags,
  rebuttalClears,
  sameTaskLosers,
  shortfallOf,
  qualityFlags,
  repeatedTaskTypes,
  comparableOf,
  compareWithRules,
  decide,
  itemIdOf,
  nearDuplicateOf,
  pickSample,
  planTargets,
  trimToRequested,
  validateGeneration,
  type CoverageSkill,
  type Decision,
  type FigureMarker,
  type GeneratedItem,
  type KeyedQuestion,
  type QualityFlag,
  type SolverOutcome,
  type Target,
} from './core';
import { Ledger, callJson, loadProviders, readLedger, type Providers } from './models';
import {
  GENERATE_SYSTEM,
  buildAssumptionPrompt,
  buildFigurePrompt,
  buildQualityPrompt,
  buildRebuttalPrompt,
  buildSameTaskPrompt,
  buildWholeKeyJudgePrompt,
  type QualityView,
} from './prompts';

// ── CLI ─────────────────────────────────────────────────────────────────────

interface Args {
  stage: string;
  out: string;
  dump?: string;
  coverage?: string;
  skillsMap?: string;
  minPerObjective: number;
  minPerSkill: number;
  skills?: string[];
  sample?: number;
  in?: string;
  tier?: string;
  limit?: number;
  concurrency: number;
  maxUsd?: number;
  ledger?: string;
  retryIncomplete: boolean;
  excludeTargets?: string;
  reassessAssumptions: boolean;
  figures?: string;
  requireFigureSkill: boolean;
  emptyOnly: boolean;
  perObjective: number;
  retryEmptyFrom?: string;
  previous?: string;
  also?: string[];
  keyFirst: boolean;
  maxItemsPerCall: number;
  genEffort: string;
  splitReview: boolean;
}

function parseArgs(argv: string[]): Args {
  const a: Args = { stage: argv[0] ?? '', out: '', minPerObjective: 2, minPerSkill: 8, concurrency: 4, retryIncomplete: false, reassessAssumptions: false, requireFigureSkill: false, emptyOnly: false, perObjective: 3, keyFirst: false, maxItemsPerCall: 6, genEffort: 'medium', splitReview: false };
  const num = (f: string, v: string) => {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) throw new Error(`${f} needs a non-negative number`);
    return n;
  };
  for (let i = 1; i < argv.length; i++) {
    const f = argv[i];
    const val = () => {
      const v = argv[++i];
      if (v === undefined) throw new Error(`${f} needs a value`);
      return v;
    };
    switch (f) {
      case '--out': a.out = val(); break;
      case '--dump': a.dump = val(); break;
      case '--coverage': a.coverage = val(); break;
      case '--skills-map': a.skillsMap = val(); break;
      case '--min-per-objective': a.minPerObjective = num(f, val()); break;
      case '--min-per-skill': a.minPerSkill = num(f, val()); break;
      case '--skills': a.skills = val().split(',').map((s) => s.trim()).filter(Boolean); break;
      case '--sample': a.sample = num(f, val()); break;
      case '--in': a.in = val(); break;
      case '--tier': a.tier = val(); break;
      case '--limit': a.limit = num(f, val()); break;
      case '--concurrency': a.concurrency = Math.max(1, num(f, val())); break;
      case '--max-usd': a.maxUsd = num(f, val()); break;
      case '--ledger': a.ledger = val(); break;
      case '--retry-incomplete': a.retryIncomplete = true; break;
      case '--exclude-targets': a.excludeTargets = val(); break;
      case '--reassess-assumptions': a.reassessAssumptions = true; break;
      case '--figures': a.figures = val(); break;
      case '--require-figure-skill': a.requireFigureSkill = true; break;
      case '--empty-only': a.emptyOnly = true; break;
      case '--per-objective': a.perObjective = num(f, val()); break;
      case '--retry-empty-from': a.retryEmptyFrom = val(); break;
      case '--previous': a.previous = val(); break;
      case '--also': a.also = val().split(',').map((x) => x.trim()).filter(Boolean); break;
      case '--key-first': a.keyFirst = true; break;
      case '--max-items-per-call': a.maxItemsPerCall = Math.max(1, num(f, val())); break;
      case '--gen-effort': a.genEffort = val(); break;
      case '--split-review': a.splitReview = true; break;
      default: throw new Error(`unknown argument: ${f}`);
    }
  }
  if (!a.out) throw new Error('--out is required');
  return a;
}

// ── files ───────────────────────────────────────────────────────────────────

const readJson = <T>(file: string): T => JSON.parse(fs.readFileSync(file, 'utf8')) as T;
function readJsonl<T>(file: string): T[] {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l) as T);
}
function appendJsonl(file: string, row: unknown): void {
  fs.appendFileSync(file, JSON.stringify(row) + '\n');
}
function need(v: string | undefined, flag: string): string {
  if (!v) throw new Error(`${flag} is required for this stage`);
  return v;
}

// ── plans + bank (local dump) ───────────────────────────────────────────────

interface PlanLo { id: string; description: string; shortTitle?: string }
interface PlanSegment {
  id: string;
  kind: string;
  goal?: string | null;
  keyIdeas?: string[] | null;
  problem?: string | null;
  steps?: string[] | null;
  answer?: string | null;
  expectedAnswer?: string | null;
}
interface Plan {
  _id: string;
  title: string;
  topic?: string;
  subject?: string;
  los: PlanLo[];
  segments: PlanSegment[];
  metadata?: { pendingPicker?: boolean };
}
interface BankRow {
  id: string;
  loId: string;
  problemText: string;
  answer?: string;
  choices?: unknown[];
  responseFormat?: string;
}
interface Dump { plans: Plan[]; bank: BankRow[] }

interface ObjectiveMaterial {
  loId: string;
  description: string;
  shortTitle: string;
  concept?: { goal: string; keyIdeas: string[] };
  worked?: { problem: string; steps: string[]; answer: string };
  tryStep?: { problem: string; expectedAnswer: string };
}

function materialOf(plan: Plan, lo: PlanLo): ObjectiveMaterial {
  const seg = (suffix: string) => plan.segments.find((s) => s.id === `${lo.id}-${suffix}`);
  const c = seg('concept');
  const w = seg('worked');
  const t = seg('try');
  return {
    loId: lo.id,
    description: lo.description,
    shortTitle: lo.shortTitle ?? '',
    concept: c?.goal ? { goal: c.goal, keyIdeas: c.keyIdeas ?? [] } : undefined,
    worked: w?.problem ? { problem: w.problem, steps: w.steps ?? [], answer: w.answer ?? '' } : undefined,
    tryStep: t?.problem ? { problem: t.problem, expectedAnswer: t.expectedAnswer ?? '' } : undefined,
  };
}

const choiceTexts = (choices: unknown[] | undefined): string[] =>
  (choices ?? []).map((c) => (typeof c === 'string' ? c : String((c as { text?: unknown })?.text ?? ''))).filter(Boolean);

/** Everything the skill already has, as the duplicate rule compares it: its
 *  bank rows on any of its objectives, and its lesson steps. */
function existingItemsOf(plan: Plan, dump: Dump) {
  const ids = new Set(plan.los.map((l) => l.id));
  const bank = dump.bank
    .filter((b) => ids.has(b.loId))
    .map((b) => ({ id: b.id, ...comparableOf({ problemText: b.problemText, answer: b.answer, choices: choiceTexts(b.choices) }) }));
  const steps = plan.los.flatMap((lo) => {
    const m = materialOf(plan, lo);
    return [
      m.tryStep && { id: `${plan._id}::${lo.id}-try`, problemText: m.tryStep.problem, answerText: m.tryStep.expectedAnswer || undefined },
      m.worked && { id: `${plan._id}::${lo.id}-worked`, problemText: m.worked.problem, answerText: m.worked.answer || undefined },
    ].filter((x): x is { id: string; problemText: string; answerText: string | undefined } => Boolean(x));
  });
  return [...bank, ...steps];
}

// ── stage: plan ─────────────────────────────────────────────────────────────

interface SkillMapRow { subject: string; subject_code?: string; skill: string; title?: string }

function stagePlan(a: Args): void {
  const coverage = readJson<{ skills: Array<CoverageSkill & { zeroObjectives?: string[] }> }>(need(a.coverage, '--coverage'));
  const map = new Map(readJson<SkillMapRow[]>(need(a.skillsMap, '--skills-map')).map((r) => [r.skill, r.subject]));
  const dump = a.dump ? readJson<Dump>(a.dump) : null;
  const picker = new Set((dump?.plans ?? []).filter((p) => p.metadata?.pendingPicker).map((p) => p._id));
  const params = { minPerObjective: a.minPerObjective, minPerSkill: a.minPerSkill };

  let skills = coverage.skills;
  if (a.skills) skills = skills.filter((s) => a.skills!.includes(s.skillLoId));
  if (a.excludeTargets) {
    const used = new Set(a.excludeTargets.split(',').flatMap((f) => readJsonl<Target>(f.trim()).map((t) => t.skillLoId)));
    skills = skills.filter((s) => !used.has(s.skillLoId));
  }
  const figureIds = figureObjectiveIds(a.figures);
  const retry = a.retryEmptyFrom
    ? (() => {
        const accepted = new Set(auditRecords(path.join(a.retryEmptyFrom!, 'audit.jsonl')).filter((r) => r.verdict === 'ACCEPTED').map((r) => r.objectiveLoId));
        return readJsonl<Target>(path.join(a.retryEmptyFrom!, 'targets.jsonl')).filter((t) => !accepted.has(t.objectiveLoId));
      })()
    : null;
  /** The targets of this run for a list of skills. */
  const planFor = (list: CoverageSkill[], exclude?: ReadonlySet<string>): Target[] => {
    if (retry) {
      const ids = new Set(list.map((x) => x.skillLoId));
      return retry.filter((t) => ids.has(t.skillLoId) && !exclude?.has(t.objectiveLoId)).map((t) => ({ skillLoId: t.skillLoId, planId: t.planId, objectiveLoId: t.objectiveLoId, have: 0, n: a.perObjective }));
    }
    return a.emptyOnly ? planEmptyTargets(list, a.perObjective, exclude) : planTargets(list, params, exclude);
  };
  const hasFigure = (s: CoverageSkill) => s.objectives.some((o) => figureIds.has(o.loId));
  if (a.sample) {
    // Only skills the plan would actually write for can be sampled.
    const withTargets = new Set(planFor(skills, figureIds).map((t) => t.skillLoId));
    const picked = pickSample(
      skills
        .filter((s) => withTargets.has(s.skillLoId))
        .map((s) => ({
          skillLoId: s.skillLoId,
          subject: map.get(s.skillLoId) ?? 'Unknown',
          zeroObjectives: s.objectives.filter((o) => !o.servable).length,
          descriptionOnly: picker.has(s.planId),
        })),
      a.sample,
    );
    if (a.requireFigureSkill && !picked.some((id) => hasFigure(skills.find((s) => s.skillLoId === id)!))) {
      // Swap one lesson-based pick for a skill of the same subject that has a figure-dependent objective.
      const subjectOf = (id: string) => map.get(id) ?? 'Unknown';
      for (let i = picked.length - 1; i >= 0; i--) {
        const out = skills.find((s) => s.skillLoId === picked[i])!;
        if (picker.has(out.planId)) continue;
        const swap = skills.find((s) => withTargets.has(s.skillLoId) && !picked.includes(s.skillLoId) && !picker.has(s.planId) && hasFigure(s) && subjectOf(s.skillLoId) === subjectOf(out.skillLoId));
        if (swap) {
          picked[i] = swap.skillLoId;
          break;
        }
      }
    }
    skills = picked.map((id) => skills.find((s) => s.skillLoId === id)!);
  }

  const targets = planFor(skills, figureIds);
  fs.mkdirSync(a.out, { recursive: true });
  fs.writeFileSync(path.join(a.out, 'targets.jsonl'), targets.map((t) => JSON.stringify({ ...t, subject: map.get(t.skillLoId) ?? 'Unknown' })).join('\n') + (targets.length ? '\n' : ''));

  const bySubject: Record<string, { skills: number; objectives: number; items: number; emptyObjectives: number; descriptionOnlySkills: number }> = {};
  for (const s of skills) {
    const mine = targets.filter((t) => t.skillLoId === s.skillLoId);
    if (mine.length === 0) continue;
    const subj = map.get(s.skillLoId) ?? 'Unknown';
    const row = (bySubject[subj] ??= { skills: 0, objectives: 0, items: 0, emptyObjectives: 0, descriptionOnlySkills: 0 });
    row.skills++;
    row.objectives += mine.length;
    row.items += mine.reduce((n, t) => n + t.n, 0);
    row.emptyObjectives += mine.filter((t) => t.have === 0).length;
    if (picker.has(s.planId)) row.descriptionOnlySkills++;
  }
  const total = Object.values(bySubject).reduce(
    (t, r) => ({ skills: t.skills + r.skills, objectives: t.objectives + r.objectives, items: t.items + r.items, emptyObjectives: t.emptyObjectives + r.emptyObjectives, descriptionOnlySkills: t.descriptionOnlySkills + r.descriptionOnlySkills }),
    { skills: 0, objectives: 0, items: 0, emptyObjectives: 0, descriptionOnlySkills: 0 },
  );
  // Objectives left out because they need a figure — and how many of them the
  // plan would otherwise have written for.
  const withoutFigures = planFor(skills);
  const figureBySubject: Record<string, { figureObjectives: number; wouldHaveBeenTargets: number; withNoItem: number }> = {};
  for (const s of skills) {
    for (const o of s.objectives) {
      if (!figureIds.has(o.loId)) continue;
      const row = (figureBySubject[map.get(s.skillLoId) ?? 'Unknown'] ??= { figureObjectives: 0, wouldHaveBeenTargets: 0, withNoItem: 0 });
      row.figureObjectives++;
      if (withoutFigures.some((t) => t.objectiveLoId === o.loId)) row.wouldHaveBeenTargets++;
      if (!o.servable) row.withNoItem++;
    }
  }
  const summary = { mode: retry ? 'retry-empty' : a.emptyOnly ? 'empty-only' : 'minimums', perObjective: a.perObjective, params, coverageFile: a.coverage, figuresFile: a.figures ?? null, skillsConsidered: skills.length, total, bySubject, targetsWithoutFigureExclusion: { objectives: withoutFigures.length, items: withoutFigures.reduce((n, t) => n + t.n, 0) }, figureBySubject };
  fs.writeFileSync(path.join(a.out, 'plan-summary.json'), JSON.stringify(summary, null, 2));
  console.log(retry ? `plan: further pass — ${a.perObjective} per objective still without an accepted question` : a.emptyOnly ? `plan: coverage mode — ${a.perObjective} per empty objective` : `plan: min ${a.minPerObjective} per objective, min ${a.minPerSkill} per skill`);
  console.table(Object.fromEntries([...Object.entries(bySubject).sort(), ['TOTAL', total]]));
  if (figureIds.size) {
    console.log('left out because they need a figure:');
    console.table(Object.fromEntries(Object.entries(figureBySubject).sort()));
  }
}

// ── stage: figures ──────────────────────────────────────────────────────────

interface FigureObjective { subject: string; skillLoId: string; title: string; objectiveLoId: string; description: string; why: string; servable: number }

function figureObjectiveIds(file: string | undefined): Set<string> {
  if (!file || !fs.existsSync(file)) return new Set();
  return new Set(readJson<FigureObjective[]>(file).map((f) => f.objectiveLoId));
}

/**
 * One cheap call per skill BEFORE anything is generated: which of its
 * objectives cannot be practised in text. Those objectives are written to
 * figure-objectives.json and never requested from the generator.
 */
async function stageFigures(a: Args): Promise<void> {
  const coverage = readJson<{ skills: CoverageSkill[] }>(need(a.coverage, '--coverage'));
  const map = new Map(readJson<SkillMapRow[]>(need(a.skillsMap, '--skills-map')).map((r) => [r.skill, r.subject]));
  const dump = readJson<Dump>(need(a.dump, '--dump'));
  const plans = new Map(dump.plans.map((p) => [p._id, p]));
  fs.mkdirSync(a.out, { recursive: true });
  const file = path.join(a.out, 'figure-classification.jsonl');
  interface Row { skillLoId: string; objectives: Array<{ loId: string; figureDependent: boolean; reason: string; classified: boolean }>; model: string; at: string }
  const done = new Set(readJsonl<Row>(file).map((r) => r.skillLoId));
  let skills = coverage.skills.filter((s) => !done.has(s.skillLoId));
  if (a.skills) skills = skills.filter((s) => a.skills!.includes(s.skillLoId));
  if (a.limit !== undefined) skills = skills.slice(0, a.limit);
  console.log(`figures: ${skills.length} skill(s) to classify, ${done.size} already done`);
  if (skills.length > 0) {
    const providers = loadProviders();
    const ledger = openLedger(a);
    const { budgetStop } = await pool(skills, a.concurrency, async (s) => {
      const plan = plans.get(s.planId);
      const views = s.objectives.map((o) => {
        const lo = plan?.los.find((l) => l.id === o.loId);
        const m = plan && lo ? materialOf(plan, lo) : undefined;
        const lesson = [m?.concept?.goal, m?.worked?.problem && `Worked example: ${m.worked.problem}`].filter(Boolean).join(' ');
        return { description: o.description, ...(lesson ? { lesson } : {}) };
      });
      const prompt = buildFigurePrompt(s.title, views);
      const r = await callJson(providers, ledger, {
        provider: 'deepseek', model: providers.models.deepseek, system: prompt.system, user: prompt.user, schema: prompt.schema,
        maxTokens: 300 + 120 * views.length, stage: 'figures', purpose: 'classify-figures', ref: s.skillLoId,
      });
      const byN = new Map((Array.isArray(r.objectives) ? r.objectives : []).map((e) => [Number((e as { n?: unknown })?.n), e as { figure_dependent?: unknown; reason?: unknown }]));
      appendJsonl(file, {
        skillLoId: s.skillLoId,
        objectives: s.objectives.map((o, i) => {
          const e = byN.get(i + 1);
          return { loId: o.loId, figureDependent: e?.figure_dependent === true, reason: String(e?.reason ?? '').trim(), classified: !!e };
        }),
        model: providers.models.deepseek,
        at: new Date().toISOString(),
      } satisfies Row);
    });
    finish('figures', ledger, budgetStop);
  }
  const rows = new Map(readJsonl<Row>(file).map((r) => [r.skillLoId, r]));
  const out: FigureObjective[] = [];
  let unclassified = 0;
  for (const s of coverage.skills) {
    for (const o of rows.get(s.skillLoId)?.objectives ?? []) {
      if (!o.classified) unclassified++;
      if (!o.figureDependent) continue;
      const c = s.objectives.find((x) => x.loId === o.loId);
      out.push({ subject: map.get(s.skillLoId) ?? 'Unknown', skillLoId: s.skillLoId, title: s.title, objectiveLoId: o.loId, description: c?.description ?? '', why: o.reason, servable: c?.servable ?? 0 });
    }
  }
  fs.writeFileSync(path.join(a.out, 'figure-objectives.json'), JSON.stringify(out, null, 2));
  console.log(`figures: ${rows.size} skill(s) classified, ${out.length} figure-dependent objective(s), ${unclassified} objective(s) the model left out (treated as not figure-dependent)`);
  console.table(countBy(out, (f) => f.subject));
}

// ── stage: generate ─────────────────────────────────────────────────────────

/** Question texts each objective already has: its bank rows and its lesson step. */
function existingStemsByObjective(plan: Plan, dump: Dump): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const lo of plan.los) {
    const m = materialOf(plan, lo);
    out.set(lo.id, [...dump.bank.filter((b) => b.loId === lo.id).map((b) => b.problemText), ...(m.tryStep ? [m.tryStep.problem] : [])]);
  }
  return out;
}

const oneLineText = (t: string) => t.replace(/\s+/g, ' ').trim();

/**
 * The request for one skill. `written` adds, per objective, questions this
 * job has just written (the follow-up call must not repeat them); `note`
 * is appended as is (defects of the previous reply).
 */
function buildGenerateUser(plan: Plan, subject: string, targets: Target[], dump: Dump, extra?: { written?: Map<string, string[]>; note?: string; avoid?: Map<string, string[]> }): string {
  const existing = existingStemsByObjective(plan, dump);
  const parts: string[] = [`Subject: ${subject}`, `Skill: ${plan.title}`, '', 'Objectives to write for:'];
  for (const t of targets) {
    const lo = plan.los.find((l) => l.id === t.objectiveLoId)!;
    const m = materialOf(plan, lo);
    parts.push('', `Objective id: ${m.loId}`, `Questions requested: ${t.n}`, `Description: ${m.description}`);
    if (m.concept) {
      parts.push(`Lesson idea: ${m.concept.goal}`);
      if (m.concept.keyIdeas.length) parts.push('Key ideas:', ...m.concept.keyIdeas.map((k) => `  - ${k}`));
    }
    if (m.worked) {
      parts.push(`Worked example: ${m.worked.problem}`);
      if (m.worked.steps.length) parts.push(...m.worked.steps.map((s, i) => `  ${i + 1}. ${s}`));
      if (m.worked.answer) parts.push(`  Result: ${m.worked.answer}`);
    }
    if (!m.concept && !m.worked) parts.push('Lesson material: none for this objective — work from the description.');
    const has = [...(existing.get(lo.id) ?? []), ...(extra?.written?.get(lo.id) ?? [])];
    parts.push('Questions this objective already has (a new question must be a type of task none of these uses):');
    parts.push(...(has.length ? has.map((q) => `  - ${oneLineText(q)}`) : ['  (none)']));
    const failed = extra?.avoid?.get(lo.id) ?? [];
    if (failed.length) {
      parts.push('Earlier attempts for this objective that were rejected, each with the reason — write something that does not have that fault, and do not rewrite the same question:');
      parts.push(...failed.map((f) => `  - ${f}`));
    }
  }
  const others = plan.los.filter((l) => !targets.some((t) => t.objectiveLoId === l.id));
  if (others.length) {
    parts.push('', 'Other objectives of this skill (context only — write nothing for them, and do not write a question that really belongs to one of them):');
    for (const l of others) {
      const n = (existing.get(l.id) ?? []).length + (extra?.written?.get(l.id) ?? []).length;
      parts.push(`  - ${l.description}${n ? ` (has ${n} question${n === 1 ? '' : 's'})` : ''}`);
    }
  }
  if (extra?.note) parts.push('', extra.note);
  // The count per objective once more, as a closing checklist.
  const total = targets.reduce((n, t) => n + t.n, 0);
  parts.push('', `Return ${total} question(s) in all — for every objective below either the stated number of questions or a needsFigure entry:`);
  parts.push(...targets.map((t) => `  - ${t.objectiveLoId}: ${t.n}`));
  return parts.join('\n');
}

interface StoredItem extends GeneratedItem {
  id: string;
  skillLoId: string;
  /** 'lesson' — written from the objective's concept + worked example;
   *  'description-only' — the plan stores no lesson material for it. */
  grounding: 'lesson' | 'description-only';
}
interface GeneratedSkill {
  skillLoId: string;
  planId: string;
  subject: string;
  title: string;
  requested: Record<string, number>;
  items: StoredItem[];
  needsFigure: FigureMarker[];
  attempts: number;
  /** Defects of the reply that was finally used (empty when it was clean). */
  errors: string[];
  firstAttemptErrors?: string[];
  /** Items of the first reply dropped for a rule defect and asked for again. */
  replacedForDefects?: number;
  status: 'ok' | 'salvaged' | 'failed';
  model: string;
  at: string;
}

async function pool<T>(items: T[], concurrency: number, fn: (item: T) => Promise<void>): Promise<{ budgetStop: string | null }> {
  let i = 0;
  let budgetStop: string | null = null;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, async () => {
      while (i < items.length && !budgetStop) {
        const item = items[i++];
        try {
          await fn(item);
        } catch (e) {
          if (e instanceof BudgetExceeded) budgetStop = e.message;
          else throw e;
        }
      }
    }),
  );
  return { budgetStop };
}

function openLedger(a: Args): Ledger {
  if (a.maxUsd === undefined) throw new Error('--max-usd is required for a stage that calls a model');
  return new Ledger(a.ledger ?? path.join(a.out, 'ledger.jsonl'), a.maxUsd);
}

async function stageGenerate(a: Args): Promise<void> {
  const dump = readJson<Dump>(need(a.dump, '--dump'));
  const plans = new Map(dump.plans.map((p) => [p._id, p]));
  const targets = readJsonl<Target & { subject: string }>(path.join(a.out, 'targets.jsonl'));
  const outFile = path.join(a.out, 'generated.jsonl');
  const done = new Set(generatedSkills(a.out).filter((g) => g.status === 'ok' || (g.status === 'salvaged' && !a.retryIncomplete)).map((g) => g.skillLoId));
  let skillIds = [...new Set(targets.map((t) => t.skillLoId))].filter((s) => !done.has(s));
  if (a.skills) skillIds = skillIds.filter((s) => a.skills!.includes(s));
  if (a.limit !== undefined) skillIds = skillIds.slice(0, a.limit);
  console.log(`generate: ${skillIds.length} skill(s) to do, ${done.size} already done`);
  if (skillIds.length === 0) return;

  const providers = loadProviders();
  const ledger = openLedger(a);
  const model = providers.models.generate;
  // A further pass: what was tried before for each objective, and why it failed.
  const previousAttempts = new Map<string, string[]>();
  if (a.previous) {
    const before = new Map(auditRecords(path.join(a.previous, 'audit.jsonl')).map((r) => [r.id, r]));
    for (const g of generatedSkills(a.previous)) {
      for (const it of g.items) {
        const r = before.get(it.id);
        if (!r || r.verdict !== 'REJECTED') continue;
        const why = r.reason === 'quality' ? flagText(rejectedFlags(r.quality)) : `${REASON_TEXT[r.reason] ?? r.reason}${r.detail ? ` (${flat(r.detail)})` : ''}`;
        previousAttempts.set(it.objectiveLoId, [...(previousAttempts.get(it.objectiveLoId) ?? []), `"${oneLineText(it.problemText).slice(0, 260)}" — rejected: ${why}`]);
      }
    }
  }

  let failedSkills = 0;
  const { budgetStop } = await pool(skillIds, Math.min(a.concurrency, 3), async (skillLoId) => {
    try {
      await generateSkill(skillLoId);
    } catch (e) {
      if (e instanceof BudgetExceeded) throw e;
      // One skill's failure (a reply cut short, an API error after retries) must
      // not stop the run: it is reported and picked up again on the next run.
      failedSkills++;
      console.error(`  FAILED   ${skillLoId}  ${(e instanceof Error ? e.message : String(e)).slice(0, 160)}`);
    }
  });
  if (failedSkills > 0) console.error(`generate: ${failedSkills} skill(s) failed and were left for a re-run`);
  finish('generate', ledger, budgetStop);

  async function generateSkill(skillLoId: string): Promise<void> {
    const mine = targets.filter((t) => t.skillLoId === skillLoId);
    const plan = plans.get(mine[0].planId);
    if (!plan) throw new Error(`plan ${mine[0].planId} is not in the dump`);
    const requested = Object.fromEntries(mine.map((t) => [t.objectiveLoId, t.n]));
    const ctx = { skillObjectiveIds: plan.los.map((l) => l.id), requested };
    const call = (user: string, count: number, purpose: string) =>
      callJson(providers, ledger, {
        provider: 'anthropic', model, system: GENERATE_SYSTEM, user, schema: GENERATION_SCHEMA, cacheSystem: true,
        maxTokens: Math.min(24000, 6000 + count * 1500), ...(a.genEffort === 'none' ? { noThinking: true } : { effort: a.genEffort }), stage: 'generate', purpose, ref: skillLoId,
      });
    const total = mine.reduce((n, t) => n + t.n, 0);
    const avoid = previousAttempts;

    // The request is split into calls of a few questions each, so a reply
    // cannot be cut short. Per call: keep what is clean, then ONE follow-up
    // that asks only for what is still missing (left out, or broke a rule).
    let attempts = 1;
    let kept: GeneratedItem[] = [];
    let needsFigure: FigureMarker[] = [];
    const errors: string[] = [];
    let firstAttemptErrors: string[] | undefined;
    let replacedForDefects = 0;
    for (const chunk of chunkTargets(mine, a.maxItemsPerCall)) {
      const req = Object.fromEntries(chunk.map((t) => [t.objectiveLoId, t.n]));
      const count = chunk.reduce((n, t) => n + t.n, 0);
      const first = validateGeneration(await call(buildGenerateUser(plan, mine[0].subject, chunk, dump, { avoid }), count, 'generate'), { skillObjectiveIds: ctx.skillObjectiveIds, requested: req });
      let got = trimToRequested(first.clean, first.needsFigure, req);
      let figs = first.needsFigure;
      let errs = first.errors;
      replacedForDefects += first.items.length - first.clean.length;
      const missing = shortfallOf(req, got, figs);
      if (Object.keys(missing).length > 0) {
        attempts = 2;
        firstAttemptErrors = [...(firstAttemptErrors ?? []), ...first.errors];
        const again = chunk.filter((t) => missing[t.objectiveLoId]).map((t) => ({ ...t, n: missing[t.objectiveLoId] }));
        const written = new Map<string, string[]>();
        for (const it of got) written.set(it.objectiveLoId, [...(written.get(it.objectiveLoId) ?? []), it.problemText]);
        const defects = first.errors.filter((m) => !/item\(s\) requested/.test(m)).slice(0, 12);
        const note = defects.length ? `Questions written earlier for this request were discarded for these defects — do not repeat them:\n${defects.map((m) => `  - ${m}`).join('\n')}` : '';
        const againTotal = again.reduce((n, t) => n + t.n, 0);
        const second = validateGeneration(await call(buildGenerateUser(plan, mine[0].subject, again, dump, { written, note, avoid }), againTotal, 'generate-followup'), { skillObjectiveIds: ctx.skillObjectiveIds, requested: missing });
        // Clean ones first; a follow-up item that still breaks a rule is kept
        // so that the audit stage rejects (and counts) it.
        got = [...got, ...trimToRequested([...second.clean, ...second.items.filter((it) => !second.clean.includes(it))], second.needsFigure, missing)];
        figs = [...figs, ...second.needsFigure];
        errs = second.errors;
      }
      kept = [...kept, ...got];
      needsFigure = [...needsFigure, ...figs];
      errors.push(...errs);
    }
    const v = { ok: errors.length === 0, needsFigure, errors };
    const material = new Map(plan.los.map((l) => [l.id, materialOf(plan, l)]));
    const row: GeneratedSkill = {
      skillLoId, planId: plan._id, subject: mine[0].subject, title: plan.title, requested,
      items: kept.map((it) => {
        const m = material.get(it.objectiveLoId)!;
        return { id: itemIdOf(it.objectiveLoId, it.problemText), skillLoId, grounding: m.concept || m.worked ? 'lesson' : 'description-only', ...it };
      }),
      needsFigure: v.needsFigure,
      attempts,
      errors: v.ok ? [] : v.errors,
      ...(firstAttemptErrors ? { firstAttemptErrors } : {}),
      replacedForDefects,
      status: v.ok ? 'ok' : kept.length > 0 || v.needsFigure.length > 0 ? 'salvaged' : 'failed',
      model,
      at: new Date().toISOString(),
    };
    appendJsonl(outFile, row);
    console.log(`  ${row.status.padEnd(8)} ${skillLoId}  ${row.items.length}/${total} items, ${row.needsFigure.length} need a figure${attempts > 1 ? ' (with a follow-up for missing ones)' : ''}`);
  }
}

function finish(stage: string, ledger: Ledger, budgetStop: string | null): void {
  console.log(`${stage}: ledger total $${ledger.budget.spentUsd.toFixed(4)} of cap $${ledger.budget.maxUsd.toFixed(2)}`);
  if (budgetStop) {
    console.error(`STOPPED before the spend cap: ${budgetStop}. Re-run the same command with a higher --max-usd to continue.`);
    process.exitCode = 3;
  }
}

/** Skills of this run directory and of every `--also` directory, one row per
 *  skill: items, requests and figure markers of the passes put together. */
function allGeneratedSkills(a: Args): GeneratedSkill[] {
  const bySkill = new Map<string, GeneratedSkill>();
  for (const dir of [a.out, ...(a.also ?? [])]) {
    for (const g of generatedSkills(dir)) {
      const have = bySkill.get(g.skillLoId);
      if (!have) {
        bySkill.set(g.skillLoId, { ...g, requested: { ...g.requested }, items: [...g.items], needsFigure: [...g.needsFigure] });
        continue;
      }
      for (const [lo, n] of Object.entries(g.requested)) have.requested[lo] = (have.requested[lo] ?? 0) + n;
      have.items.push(...g.items.filter((it) => !have.items.some((x) => x.id === it.id)));
      have.needsFigure.push(...g.needsFigure.filter((m) => !have.needsFigure.some((x) => x.objectiveLoId === m.objectiveLoId)));
      have.attempts = Math.max(have.attempts, g.attempts);
      have.replacedForDefects = (have.replacedForDefects ?? 0) + (g.replacedForDefects ?? 0);
      if (g.status !== 'ok') have.status = g.status;
    }
  }
  return [...bySkill.values()];
}

function allAuditRecords(a: Args, name: string): AuditRecord[] {
  const byId = new Map<string, AuditRecord>();
  for (const dir of [a.out, ...(a.also ?? [])]) for (const r of auditRecords(path.join(dir, name))) byId.set(r.id, r);
  return [...byId.values()];
}

/** Latest row per skill; a failed attempt is superseded by a later one. */
function generatedSkills(out: string): GeneratedSkill[] {
  const bySkill = new Map<string, GeneratedSkill>();
  for (const g of readJsonl<GeneratedSkill>(path.join(out, 'generated.jsonl'))) bySkill.set(g.skillLoId, g);
  return [...bySkill.values()];
}

// ── stage: audit / second-check ─────────────────────────────────────────────

interface SolverEvidence {
  model: string;
  working: string;
  illPosed: boolean;
  illPosedReason: string;
  assumptions: string;
  chosenOption: string;
  answer: string;
  justification: string;
  vsKey?: { verdict: JudgeVerdict; method: string; reason: string };
  /** Set when the solver named an assumption: would another reasonable one change the answer? */
  assumptionCheck?: { answerChanging: boolean; reason: string; model: string };
  error?: string;
}

interface QualityEvidence {
  deepseek: QualityFlag[];
  haiku?: QualityFlag[];
  /** Raised by both reviewers. */
  confirmed: QualityFlag[];
  /** Strict checks raised by one reviewer only, put to the other one again. */
  contested?: Array<QualityFlag & { raisedBy: 'first' | 'second'; rebuttal: { agree: boolean; reason: string }; upheld: boolean }>;
  /** The flags the item is rejected for: confirmed ones + upheld contested ones. */
  rejected?: QualityFlag[];
  models: { first: string; second: string };
}

const rejectedFlags = (q: QualityEvidence | undefined): QualityFlag[] => q?.rejected ?? q?.confirmed ?? [];

interface AuditRecord {
  id: string;
  skillLoId?: string;
  objectiveLoId?: string;
  subject?: string;
  format: string;
  question: string;
  key: string;
  choices: string[];
  taskType?: string;
  verdict: 'ACCEPTED' | 'REJECTED' | 'ERROR';
  /** Where the item was decided: rule checks, the quality review, or the answer check. */
  gate?: 'checks' | 'quality' | 'key';
  /** Machine reason: a `decide` reason, or failed_checks / near_duplicate / quality / error. */
  reason: string;
  detail?: string;
  quality?: QualityEvidence;
  /** Set when a stored decision was re-made (second-check --reassess-assumptions). */
  previous?: { verdict: string; reason: string };
  solvers?: { deepseek: SolverEvidence; haiku: SolverEvidence };
  tiebreak?: SolverEvidence;
  at: string;
}

const NO_ASSUMPTION_RE = /^(?:none|n\/a|no(?:ne)?\s+(?:needed|required|made)|no\s+assumptions?(?:\s+\w+)*)\.?$/i;

async function solveBlind(
  p: Providers, ledger: Ledger, q: KeyedQuestion, who: 'deepseek' | 'haiku' | 'tiebreak', stage: string, ref: string,
): Promise<SolverEvidence> {
  // The solver's view has no key: only the question, its options and its format.
  const view: SolverView = { format: q.format, question: q.question, options: q.choices.map((text, i) => ({ letter: 'ABCDEFGHIJ'[i], text })) };
  const prompt = buildSolverPrompt(view);
  const spec =
    who === 'deepseek'
      ? { provider: 'deepseek' as const, model: p.models.deepseek, maxTokens: 4000 }
      : who === 'haiku'
        ? { provider: 'anthropic' as const, model: p.models.haiku, maxTokens: 4000 }
        : { provider: 'anthropic' as const, model: p.models.tiebreak, maxTokens: 12000, effort: 'high' };
  const r = await callJson(p, ledger, { ...spec, system: prompt.system, user: prompt.user, schema: prompt.schema, stage, purpose: `solve-${who}`, ref });
  const str = (v: unknown) => (v == null ? '' : String(v)).trim();
  const ev: SolverEvidence = {
    model: spec.model,
    working: str(r.working),
    illPosed: r.ill_posed === true || r.ill_posed === 'true',
    illPosedReason: str(r.ill_posed_reason),
    assumptions: str(r.assumptions).replace(NO_ASSUMPTION_RE, ''),
    chosenOption: str(r.chosen_option),
    answer: str(r.final_answer),
    justification: str(r.justification),
  };
  if (!ev.illPosed) {
    const rules = compareWithRules(q, ev);
    if (rules.verdict) ev.vsKey = { verdict: rules.verdict, method: rules.method, reason: rules.reason };
    else {
      // The rules cannot decide: a judge that sees both answers (it does not re-solve).
      const jp = buildWholeKeyJudgePrompt(q.question, q.key, ev.answer);
      const j = await callJson(p, ledger, {
        provider: 'anthropic', model: p.models.judge, system: jp.system, user: jp.user, schema: jp.schema,
        maxTokens: 2000, effort: 'low', stage, purpose: `judge-${who}`, ref,
      });
      const v = String(j.verdict ?? '');
      ev.vsKey = { verdict: v === 'SAME' || v === 'DIFFERENT' || v === 'KEY_INCOMPLETE' ? v : 'CANNOT_JUDGE', method: 'judge', reason: str(j.reason) };
    }
    await classifyAssumption(p, ledger, q, ev, stage, ref, who);
  }
  return ev;
}

/** Fills `assumptionCheck` when the solver named an assumption and it has
 *  not been classified yet. */
async function classifyAssumption(p: Providers, ledger: Ledger, q: KeyedQuestion, ev: SolverEvidence, stage: string, ref: string, who: string): Promise<void> {
  if (ev.illPosed || !ev.assumptions || ev.assumptionCheck) return;
  const ap = buildAssumptionPrompt(q.question, q.choices, ev.assumptions);
  const r = await callJson(p, ledger, {
    provider: 'anthropic', model: p.models.judge, system: ap.system, user: ap.user, schema: ap.schema,
    maxTokens: 2000, effort: 'low', stage, purpose: `assumption-${who}`, ref,
  });
  ev.assumptionCheck = { answerChanging: r.answer_changing !== false && r.answer_changing !== 'false', reason: String(r.reason ?? '').trim(), model: p.models.judge };
}

/** Only an ANSWER-CHANGING assumption counts against an item; one that was
 *  never classified is treated as answer-changing. */
const outcomeOf = (e: SolverEvidence): SolverOutcome => ({
  illPosed: e.illPosed,
  assumed: e.assumptions !== '' && (e.assumptionCheck ? e.assumptionCheck.answerChanging : true),
  vsKey: e.vsKey?.verdict,
});

/**
 * Both reviewers answer the checklist independently. A flag both raise
 * rejects. For the strict checks one reviewer's flag is enough unless the
 * other, shown that concern, explicitly disagrees and says why.
 */
async function qualityGate(p: Providers, ledger: Ledger, view: QualityView, stage: string, ref: string): Promise<QualityEvidence> {
  const ctx = { format: view.format, hasEarlier: view.earlier.length > 0 };
  const who = { first: { provider: 'deepseek' as const, model: p.models.deepseek, name: 'deepseek' }, second: { provider: 'anthropic' as const, model: p.models.haiku, name: 'haiku' } };
  const ask = (r: (typeof who)['first' | 'second'], prompt: ReturnType<typeof buildQualityPrompt>) =>
    callJson(p, ledger, { provider: r.provider, model: r.model, system: prompt.system, user: prompt.user, schema: prompt.schema, maxTokens: 1800, stage, purpose: `quality-${r.name}`, ref });
  const deepseek = qualityFlags(await ask(who.first, buildQualityPrompt(view)), ctx);
  // The second reviewer answers the strict checks (where its flag alone counts)
  // and every check the first one raised (where both must agree). Its view of
  // any other check could not change the outcome, so it is not asked.
  const secondChecks = [...new Set([...STRICT_CHECKS, ...deepseek.map((f) => f.id)])];
  const haiku = qualityFlags(await ask(who.second, buildQualityPrompt(view, secondChecks)), ctx);
  const confirmed = confirmedFlags(deepseek, haiku);
  const contested: NonNullable<QualityEvidence['contested']> = [];
  for (const f of contestedFlags(deepseek, haiku)) {
    const other = f.raisedBy === 'first' ? who.second : who.first;
    const rp = buildRebuttalPrompt(view, f.id, f.reason);
    const r = await callJson(p, ledger, { provider: other.provider, model: other.model, system: rp.system, user: rp.user, schema: rp.schema, maxTokens: 600, stage, purpose: `quality-rebuttal-${other.name}`, ref });
    contested.push({ ...f, rebuttal: { agree: r.agree === true || r.agree === 'true', reason: String(r.reason ?? '').trim() }, upheld: !rebuttalClears(r) });
  }
  const rejected = [...confirmed, ...contested.filter((c) => c.upheld).map((c) => ({ id: c.id, reason: c.reason }))];
  return { deepseek, haiku, confirmed, contested, rejected, models: { first: p.models.deepseek, second: p.models.haiku } };
}

async function twoSolverCheck(p: Providers, ledger: Ledger, q: KeyedQuestion, stage: string, ref: string) {
  const [deepseek, haiku] = await Promise.all([solveBlind(p, ledger, q, 'deepseek', stage, ref), solveBlind(p, ledger, q, 'haiku', stage, ref)]);
  let decision: Decision = decide(outcomeOf(deepseek), outcomeOf(haiku));
  let tiebreak: SolverEvidence | undefined;
  if (decision.status === 'TIEBREAK') {
    tiebreak = await solveBlind(p, ledger, q, 'tiebreak', stage, ref);
    decision = decide(outcomeOf(deepseek), outcomeOf(haiku), outcomeOf(tiebreak));
  }
  return { deepseek, haiku, tiebreak, decision };
}

async function auditMany(
  a: Args, stage: string, outFile: string,
  work: Array<{ meta: Pick<AuditRecord, 'id' | 'skillLoId' | 'objectiveLoId' | 'subject' | 'taskType'>; q: KeyedQuestion; precheck?: { reason: string; detail: string }; quality?: QualityView }>,
): Promise<void> {
  const prior = new Map(readJsonl<AuditRecord>(outFile).map((r) => [r.id, r]));
  let todo = work.filter((w) => !prior.has(w.meta.id) || prior.get(w.meta.id)!.verdict === 'ERROR');
  const alreadyDone = work.length - todo.length;
  if (a.limit !== undefined) todo = todo.slice(0, a.limit);
  console.log(`${stage}: ${todo.length} item(s) to do, ${alreadyDone} already done`);
  if (todo.length === 0) return;
  const providers = loadProviders();
  const ledger = openLedger(a);
  let n = 0;
  const { budgetStop } = await pool(todo, a.concurrency, async (w) => {
    const base = { ...w.meta, format: w.q.format, question: w.q.question, key: w.q.key, choices: w.q.choices };
    let rec: AuditRecord;
    if (w.precheck) {
      rec = { ...base, verdict: 'REJECTED', gate: 'checks', reason: w.precheck.reason, detail: w.precheck.detail, at: new Date().toISOString() };
    } else {
      try {
        if (a.keyFirst) {
          // Answer check first; the quality review only for items whose answer held up.
          const r = await twoSolverCheck(providers, ledger, w.q, stage, w.meta.id);
          if (r.decision.status === 'TIEBREAK') throw new Error('tie-break did not resolve');
          const key = { solvers: { deepseek: r.deepseek, haiku: r.haiku }, ...(r.tiebreak ? { tiebreak: r.tiebreak } : {}) };
          const quality = r.decision.status === 'ACCEPTED' && w.quality ? await qualityGate(providers, ledger, w.quality, stage, w.meta.id) : undefined;
          rec =
            rejectedFlags(quality).length > 0
              ? { ...base, verdict: 'REJECTED', gate: 'quality', reason: 'quality', detail: rejectedFlags(quality).map((f) => f.id).join(', '), quality, ...key, at: new Date().toISOString() }
              : { ...base, verdict: r.decision.status, gate: 'key', reason: r.decision.reason, ...(quality ? { quality } : {}), ...key, at: new Date().toISOString() };
        } else {
          // Quality first (cheaper): an item that fails it is not solved at all.
          const quality = w.quality ? await qualityGate(providers, ledger, w.quality, stage, w.meta.id) : undefined;
          if (rejectedFlags(quality).length > 0) {
            rec = { ...base, verdict: 'REJECTED', gate: 'quality', reason: 'quality', detail: rejectedFlags(quality).map((f) => f.id).join(', '), quality, at: new Date().toISOString() };
          } else {
            const r = await twoSolverCheck(providers, ledger, w.q, stage, w.meta.id);
            if (r.decision.status === 'TIEBREAK') throw new Error('tie-break did not resolve');
            rec = { ...base, verdict: r.decision.status, gate: 'key', reason: r.decision.reason, ...(quality ? { quality } : {}), solvers: { deepseek: r.deepseek, haiku: r.haiku }, ...(r.tiebreak ? { tiebreak: r.tiebreak } : {}), at: new Date().toISOString() };
          }
        }
      } catch (e) {
        if (e instanceof BudgetExceeded) throw e; // nothing written: the item is redone on the next run
        rec = { ...base, verdict: 'ERROR', reason: 'error', detail: (e instanceof Error ? e.message : String(e)).slice(0, 300), at: new Date().toISOString() };
      }
    }
    appendJsonl(outFile, rec);
    if (++n % 20 === 0 || n === todo.length) console.log(`  ${n}/${todo.length} · ledger $${ledger.budget.spentUsd.toFixed(4)}`);
  });
  finish(stage, ledger, budgetStop);
}

async function stageAudit(a: Args): Promise<void> {
  const dump = readJson<Dump>(need(a.dump, '--dump'));
  const plans = new Map(dump.plans.map((p) => [p._id, p]));
  const work: Parameters<typeof auditMany>[3] = [];
  const earlierPass = new Map((a.previous ? generatedSkills(a.previous) : []).map((g) => [g.skillLoId, g.items]));
  for (const g of generatedSkills(a.out)) {
    const plan = plans.get(g.planId);
    const known: Array<{ id: string; problemText: string; answerText?: string; choices?: readonly string[] }> = plan ? existingItemsOf(plan, dump) : [];
    for (const it of earlierPass.get(g.skillLoId) ?? []) known.push({ id: it.id, ...comparableOf(it) });
    const repeats = new Set(repeatedTaskTypes(g.items));
    /** What each objective had before this job — a new item must not be the same task
     *  (new items are compared with one another after the answer check). */
    const earlier = plan ? existingStemsByObjective(plan, dump) : new Map<string, string[]>();
    g.items.forEach((it, i) => {
      const q: KeyedQuestion = { format: it.responseFormat, question: it.problemText, key: it.answer, choices: it.choices };
      const me = comparableOf(it);
      const defects = contentDefects({ ...it, taskType: it.taskType ?? '' });
      if (repeats.has(i)) defects.push(`its task type "${it.taskType}" repeats another question of the same objective`);
      const dup = defects.length === 0 ? nearDuplicateOf(me, known) : null;
      const precheck =
        defects.length > 0
          ? { reason: 'failed_checks', detail: defects.join('; ') }
          : dup
            ? { reason: 'near_duplicate', detail: `${dup.reason} of ${dup.of.id}` }
            : undefined;
      const lo = plan?.los.find((l) => l.id === it.objectiveLoId);
      const quality: QualityView | undefined = lo
        ? {
            objective: lo.description,
            otherObjectives: plan!.los.filter((l) => l.id !== lo.id).map((l) => l.description),
            format: it.responseFormat,
            question: it.problemText,
            choices: it.choices,
            answer: it.responseFormat === 'mcq' ? `${it.answer}) ${it.choices['ABCD'.indexOf(it.answer)] ?? ''}` : it.answer,
            earlier: [...(earlier.get(lo.id) ?? [])],
            rationales: it.distractorRationales,
          }
        : undefined;
      // Later items of the skill are compared with this one (whether or not it
      // is finally kept: a twin of a rejected item is still a twin).
      if (!precheck) known.push({ id: it.id, ...me });
      work.push({ meta: { id: it.id, skillLoId: g.skillLoId, objectiveLoId: it.objectiveLoId, subject: g.subject, taskType: it.taskType }, q, precheck, quality });
    });
  }
  await auditMany(a, 'audit', path.join(a.out, 'audit.jsonl'), work);
  await dropSameTasks(a, path.join(a.out, 'audit.jsonl'), plans);
}

/**
 * After the answer check: where one objective has two or more accepted new
 * questions, one call groups those that are the same task (by what the
 * student must do) and names the best of each group; the others are dropped.
 */
async function dropSameTasks(a: Args, file: string, plans: Map<string, Plan>): Promise<void> {
  const groupsFile = path.join(a.out, 'same-task.jsonl');
  const done = new Set(readJsonl<{ objectiveLoId: string }>(groupsFile).map((r) => r.objectiveLoId));
  const byObjective = new Map<string, AuditRecord[]>();
  for (const r of auditRecords(file)) {
    if (r.verdict !== 'ACCEPTED' || !r.objectiveLoId || done.has(r.objectiveLoId)) continue;
    byObjective.set(r.objectiveLoId, [...(byObjective.get(r.objectiveLoId) ?? []), r]);
  }
  const todo = [...byObjective.entries()].filter(([, list]) => list.length >= 2);
  console.log(`same-task: ${todo.length} objective(s) with two or more accepted questions to compare`);
  if (todo.length === 0) return;
  const providers = loadProviders();
  const ledger = openLedger(a);
  const { budgetStop } = await pool(todo, a.concurrency, async ([loId, list]) => {
    const lo = plans.get(loId.replace(/\.lo-\d+$/, ''))?.los.find((l) => l.id === loId);
    const prompt = buildSameTaskPrompt(lo?.description ?? loId, list.map((r) => (r.choices.length ? `${r.question} [options: ${r.choices.join(' | ')}]` : r.question)));
    const reply = await callJson(providers, ledger, {
      provider: 'deepseek', model: providers.models.deepseek, system: prompt.system, user: prompt.user, schema: prompt.schema,
      maxTokens: 800, stage: 'audit', purpose: 'same-task', ref: loId,
    });
    const losers = sameTaskLosers(reply, list.length);
    for (const l of losers) {
      appendJsonl(file, { ...list[l.drop], verdict: 'REJECTED', gate: 'quality', reason: 'same_task_as_better', detail: `${l.reason} — kept: "${list[l.keep].question.slice(0, 70)}…"`, previous: { verdict: 'ACCEPTED', reason: list[l.drop].reason }, at: new Date().toISOString() });
    }
    appendJsonl(groupsFile, { objectiveLoId: loId, compared: list.map((r) => r.id), dropped: losers.map((l) => list[l.drop].id), model: providers.models.deepseek, at: new Date().toISOString() });
  });
  finish('same-task', ledger, budgetStop);
}

interface SecondCheckRow { id: string; subject?: string; skillLo?: string; skill?: string; problem: string; answer: string; tier?: string; choices?: unknown[] }

async function stageSecondCheck(a: Args): Promise<void> {
  let rows = readJson<SecondCheckRow[]>(need(a.in, '--in'));
  if (a.tier) rows = rows.filter((r) => r.tier === a.tier);
  const work = rows.map((r) => {
    const choices = choiceTexts(r.choices);
    const key = String(r.answer ?? '');
    // A lesson step is a typed answer: the app applies its strict number rule
    // whenever the stored key is a plain number.
    const format = choices.length > 0 ? 'mcq' : parseNumericKey(key) ? 'numeric' : 'free';
    return { meta: { id: r.id, skillLoId: r.skillLo, subject: r.subject }, q: { format, question: String(r.problem ?? ''), key, choices } };
  });
  fs.mkdirSync(a.out, { recursive: true });
  if (a.reassessAssumptions) await reassessAssumptions(a, path.join(a.out, 'second-check.jsonl'));
  else await auditMany(a, 'second-check', path.join(a.out, 'second-check.jsonl'), work);
  writeSummary(a, 'second-check.jsonl');
}

/**
 * Re-decide stored rejections whose reason was an unstated assumption: each
 * named assumption is classified (answer-changing or not) and the acceptance
 * rule is applied again to the STORED solves. A new solve happens only when
 * the rule then asks for a tie-break that was never run.
 */
async function reassessAssumptions(a: Args, file: string): Promise<void> {
  const todo = auditRecords(file).filter((r) => r.verdict === 'REJECTED' && /unstated_assumption/.test(r.reason) && r.solvers && !r.previous);
  console.log(`reassess: ${todo.length} stored "unstated assumption" rejection(s)`);
  if (todo.length === 0) return;
  const providers = loadProviders();
  const ledger = openLedger(a);
  const { budgetStop } = await pool(todo, a.concurrency, async (r) => {
    const q: KeyedQuestion = { format: r.format, question: r.question, key: r.key, choices: r.choices };
    const { deepseek, haiku } = r.solvers!;
    let tiebreak = r.tiebreak;
    await classifyAssumption(providers, ledger, q, deepseek, 'second-check', r.id, 'deepseek');
    await classifyAssumption(providers, ledger, q, haiku, 'second-check', r.id, 'haiku');
    if (tiebreak) await classifyAssumption(providers, ledger, q, tiebreak, 'second-check', r.id, 'tiebreak');
    let decision = decide(outcomeOf(deepseek), outcomeOf(haiku), tiebreak && outcomeOf(tiebreak));
    if (decision.status === 'TIEBREAK') {
      tiebreak = await solveBlind(providers, ledger, q, 'tiebreak', 'second-check', r.id);
      decision = decide(outcomeOf(deepseek), outcomeOf(haiku), outcomeOf(tiebreak));
    }
    if (decision.status === 'TIEBREAK') throw new Error('tie-break did not resolve');
    appendJsonl(file, { ...r, verdict: decision.status, gate: 'key', reason: decision.reason, solvers: { deepseek, haiku }, ...(tiebreak ? { tiebreak } : {}), previous: { verdict: r.verdict, reason: r.reason }, at: new Date().toISOString() });
  });
  finish('reassess', ledger, budgetStop);
}

/** Latest record per id. */
function auditRecords(file: string): AuditRecord[] {
  const byId = new Map<string, AuditRecord>();
  for (const r of readJsonl<AuditRecord>(file)) byId.set(r.id, r);
  return [...byId.values()];
}

// ── stage: export ───────────────────────────────────────────────────────────

const JOB_NAME = 'practice-extend offline job';

function verifierOf(r: AuditRecord): string {
  const two = `${r.solvers?.deepseek.model}+${r.solvers?.haiku.model}`;
  return r.tiebreak ? `${two}+${r.tiebreak.model} (tie-break)` : two;
}

function stageExport(a: Args): void {
  const dump = readJson<Dump>(need(a.dump, '--dump'));
  const plans = new Map(dump.plans.map((p) => [p._id, p]));
  const audit = new Map(allAuditRecords(a, 'audit.jsonl').map((r) => [r.id, r]));
  const skills = allGeneratedSkills(a);
  const rows: Array<Record<string, unknown>> = [];
  for (const g of skills) {
    const plan = plans.get(g.planId);
    for (const it of g.items) {
      const r = audit.get(it.id);
      if (!r || r.verdict !== 'ACCEPTED') continue;
      const lo = plan?.los.find((l) => l.id === it.objectiveLoId);
      rows.push({
        id: it.id,
        topic: plan?.topic ?? g.title,
        topicId: plan?.topic ?? g.title,
        loId: it.objectiveLoId,
        subtopic: lo?.shortTitle ?? '',
        difficulty: it.difficulty,
        problemText: it.problemText,
        answer: it.answer,
        solutionText: it.solutionText,
        hints: it.hints,
        responseFormat: it.responseFormat,
        choices: it.responseFormat === 'mcq' ? it.choices : [],
        source: { name: `Evelyn (${JOB_NAME})` },
        license: 'internal-original',
        verifiedAt: r.at,
        verifierModel: verifierOf(r),
      });
    }
  }
  const dir = path.join(a.out, 'export');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'problem-bank-rows.json'), JSON.stringify(rows, null, 2));
  fs.writeFileSync(path.join(dir, 'audited-item-ids.json'), JSON.stringify(rows.map((r) => r.id), null, 2));

  // What each sampled skill would have once these rows are seeded.
  const coverage = a.coverage ? readJson<{ skills: CoverageSkill[] }>(a.coverage) : { skills: [] };
  const cov = new Map(coverage.skills.map((s) => [s.skillLoId, s]));
  const figureIds = figureObjectiveIds(a.figures);
  const after = skills.map((g) => {
    const plan = plans.get(g.planId);
    const objectives = (cov.get(g.skillLoId)?.objectives ?? []).map((o) => {
      const added = rows.filter((r) => r.loId === o.loId).length;
      return {
        loId: o.loId,
        shortTitle: plan?.los.find((l) => l.id === o.loId)?.shortTitle ?? '',
        before: o.servable,
        requested: g.requested[o.loId] ?? 0,
        added,
        after: o.servable + added,
        needsFigure: g.needsFigure.some((m) => m.objectiveLoId === o.loId),
        figureDependent: figureIds.has(o.loId),
        belowMinimum: o.servable + added < a.minPerObjective,
      };
    });
    const total = objectives.reduce((n, o) => n + o.after, 0);
    return { skillLoId: g.skillLoId, subject: g.subject, title: g.title, before: objectives.reduce((n, o) => n + o.before, 0), after: total, belowSkillMinimum: total < a.minPerSkill, emptyObjectivesAfter: objectives.filter((o) => o.after === 0).length, objectives };
  });
  const tally = (list: Array<{ after: number }>) => ({ objectives: list.length, with0: list.filter((o) => o.after === 0).length, with1: list.filter((o) => o.after === 1).length, with2orMore: list.filter((o) => o.after >= 2).length });
  const allObjectives = after.flatMap((s) => s.objectives);
  const objectivesAfter = {
    requested: tally(allObjectives.filter((o) => o.requested > 0)),
    figureDependent: tally(allObjectives.filter((o) => o.figureDependent)),
    all: tally(allObjectives),
  };
  fs.writeFileSync(path.join(dir, 'coverage-after-export.json'), JSON.stringify({ minPerObjective: a.minPerObjective, minPerSkill: a.minPerSkill, rows: rows.length, objectivesAfter, skills: after }, null, 2));
  console.log(JSON.stringify(objectivesAfter));

  // Every objective of the coverage file that still has nothing, with the reason.
  const subjectOf = new Map((a.skillsMap ? readJson<SkillMapRow[]>(a.skillsMap) : []).map((r) => [r.skill, r.subject]));
  const bySkill = new Map(skills.map((g) => [g.skillLoId, g]));
  const stillEmpty = coverage.skills.flatMap((s) =>
    s.objectives
      .filter((o) => !(o.servable > 0) && !rows.some((r) => r.loId === o.loId))
      .map((o) => {
        const g = bySkill.get(s.skillLoId);
        const written = (g?.items ?? []).filter((i) => i.objectiveLoId === o.loId);
        const reason = figureIds.has(o.loId)
          ? 'figure-dependent'
          : written.length > 0
            ? 'all attempts rejected'
            : g && o.loId in g.requested
              ? g.needsFigure.some((m) => m.objectiveLoId === o.loId) ? 'writer said it needs a figure' : 'writer returned nothing'
              : 'not requested in this run';
        return {
          subject: subjectOf.get(s.skillLoId) ?? g?.subject ?? 'Unknown', skillLoId: s.skillLoId, title: s.title, objectiveLoId: o.loId, description: o.description, reason,
          attempts: written.length,
          rejections: countBy(written.map((i) => audit.get(i.id)).filter((r): r is AuditRecord => !!r), (r) => (r.reason === 'quality' ? `quality: ${r.detail}` : r.reason)),
        };
      }),
  );
  fs.writeFileSync(path.join(dir, 'still-empty.json'), JSON.stringify({ total: stillEmpty.length, byReason: countBy(stillEmpty, (e) => e.reason), bySubjectAndReason: countBy(stillEmpty, (e) => `${e.subject} | ${e.reason}`), objectives: stillEmpty }, null, 2));
  console.log(`still empty: ${stillEmpty.length}`, JSON.stringify(countBy(stillEmpty, (e) => e.reason)));
  console.log(`export: ${rows.length} accepted row(s) → ${dir} (nothing was seeded)`);
}

// ── stage: review ───────────────────────────────────────────────────────────

const REASON_TEXT: Record<string, string> = {
  both_solvers_agree: 'Both checkers got the stored answer.',
  tiebreak_agrees_with_key: 'One checker disagreed; a third, stronger check got the stored answer.',
  ill_posed: 'A checker said the question cannot be answered as written.',
  unstated_assumption: 'A checker had to assume something the question does not state, and another reasonable assumption would change the answer.',
  both_solvers_disagree: 'Neither checker got the stored answer.',
  tiebreak_disagrees_with_key: 'One checker disagreed, and the third check did not get the stored answer either.',
  tiebreak_ill_posed: 'One checker disagreed, and the third check said the question cannot be answered as written.',
  tiebreak_unstated_assumption: 'One checker disagreed, and the third check had to assume something that changes the answer.',
  figure_reference: 'The question points to a figure that is not there.',
  failed_checks: 'It broke a writing rule.',
  quality: 'The quality review found a problem.',
  same_task_as_better: 'The same task as another new question for this objective; the better one was kept.',
  near_duplicate: 'Too close to a question the skill already has (or to another new one).',
  error: 'The check did not complete (technical failure) — not yet decided.',
};

const flat = (s: string) => s.replace(/\s*\n\s*/g, ' ').trim();

function solverLine(name: string, e: SolverEvidence | undefined): string {
  if (!e) return `- ${name}: (not run)`;
  if (e.illPosed) return `- ${name}: says the question cannot be answered — ${flat(e.illPosedReason)}`;
  const text = flat(e.answer).replace(/^\(?[A-J][).:]\s+/, '');
  const ans = e.chosenOption && e.chosenOption.length <= 2 ? `${e.chosenOption}) ${text}` : flat(e.answer);
  const cmp = e.vsKey ? (e.vsKey.verdict === 'SAME' ? 'matches the stored answer' : `does NOT match (${flat(e.vsKey.reason)})`) : '';
  return `- ${name}: ${ans} — ${cmp}${e.assumptions ? ` — assumed: ${flat(e.assumptions)}${e.assumptionCheck ? (e.assumptionCheck.answerChanging ? ' [changes the answer]' : ' [standard for the course; does not change the answer]') : ''}` : ''}`;
}

const QUALITY_LABEL: Record<string, string> = Object.fromEntries(QUALITY_CHECKS.map((c) => [c.id, c.label]));
const flagText = (flags: QualityFlag[]) => flags.map((f) => `${QUALITY_LABEL[f.id] ?? f.id}${f.reason ? ` (${flat(f.reason)})` : ''}`).join('; ');

function qualityLine(r: AuditRecord): string | undefined {
  const q = r.quality;
  if (!q) return undefined;
  const rejected = rejectedFlags(q);
  const cleared = (q.contested ?? []).filter((c) => !c.upheld);
  const clearedText = cleared.length ? ` One reviewer raised: ${flagText(cleared)}; the other disagreed (${cleared.map((c) => flat(c.rebuttal.reason)).join('; ')}).` : '';
  if (rejected.length > 0) return `- Quality review: FAILED — ${flagText(rejected)}`;
  const single = [...q.deepseek, ...(q.haiku ?? [])].filter((f) => !cleared.some((c) => c.id === f.id));
  if (single.length > 0) return `- Quality review: passed — one reviewer alone raised: ${flagText(single)}.${clearedText}`;
  return `- Quality review: passed — ${cleared.length ? '' : 'nothing raised'}${clearedText}`.replace('—  ', '— ');
}

function itemBlock(n: number, r: AuditRecord, covers?: string, grounding?: string): string[] {
  const kind = r.format === 'mcq' ? 'multiple choice' : r.format === 'numeric' ? 'number' : 'short answer';
  const out = [`**${n}. (${kind})** ${flat(r.question)}`, ''];
  r.choices.forEach((c, i) => out.push(`   ${'ABCD'[i]}) ${flat(c)}`));
  if (r.choices.length) out.push('');
  out.push(`- Stored answer: **${flat(r.key)}**`);
  if (r.taskType) out.push(`- Type of task: ${r.taskType}`);
  if (covers) out.push(`- What it practises: ${covers}`);
  if (grounding === 'description-only') out.push('- Written from the objective description only (this skill stores no lesson material).');
  const ql = qualityLine(r);
  if (ql) out.push(ql);
  if (r.solvers) {
    out.push(solverLine('Checker 1 (DeepSeek)', r.solvers.deepseek), solverLine('Checker 2 (Claude Haiku)', r.solvers.haiku));
    if (r.tiebreak) out.push(solverLine('Third check (Claude Sonnet)', r.tiebreak));
  }
  out.push(`- Result: ${r.verdict === 'ACCEPTED' ? 'kept' : r.verdict === 'REJECTED' ? 'NOT kept' : 'undecided'} — ${REASON_TEXT[r.reason] ?? r.reason}${r.detail && r.reason !== 'quality' ? ` (${r.detail})` : ''}`, '');
  return out;
}

/** Totals of the ledger rows of the given stages — and, when `refs` is given,
 *  only of calls made for those skills / items (several runs share a ledger). */
function ledgerTotals(file: string, stages?: string[], refs?: Set<string>) {
  const rows = readLedger(file).filter((r) => (!stages || stages.includes(r.stage)) && (!refs || refs.has(r.ref)));
  const add = (into: Record<string, { calls: number; input: number; output: number; costUsd: number }>, k: string, r: (typeof rows)[number]) => {
    const t = (into[k] ??= { calls: 0, input: 0, output: 0, costUsd: 0 });
    t.calls++;
    t.input += r.input + r.cacheRead + r.cacheWrite;
    t.output += r.output;
    t.costUsd = Math.round((t.costUsd + r.costUsd) * 1e6) / 1e6;
  };
  const byStage: Record<string, { calls: number; input: number; output: number; costUsd: number }> = {};
  const byProvider: typeof byStage = {};
  const byModel: typeof byStage = {};
  const byPurpose: typeof byStage = {};
  for (const r of rows) {
    add(byStage, r.stage, r);
    add(byProvider, r.provider, r);
    add(byModel, r.model, r);
    add(byPurpose, `${r.stage}/${r.purpose}`, r);
  }
  return { totalUsd: Math.round(rows.reduce((s, r) => s + r.costUsd, 0) * 1e6) / 1e6, calls: rows.length, byStage, byProvider, byModel, byPurpose };
}

function countBy<T>(list: T[], key: (x: T) => string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const x of list) out[key(x)] = (out[key(x)] ?? 0) + 1;
  return out;
}

function writeSummary(a: Args, auditFile: string): void {
  const recs = allAuditRecords(a, auditFile);
  const skills = auditFile === 'audit.jsonl' ? allGeneratedSkills(a) : [];
  const targets = [a.out, ...(a.also ?? [])].flatMap((dir) => readJsonl<Target>(path.join(dir, 'targets.jsonl')));
  const summary = {
    stageFile: auditFile,
    ...(skills.length
      ? {
          skills: skills.length,
          objectivesTargeted: targets.filter((t) => skills.some((s) => s.skillLoId === t.skillLoId)).length,
          itemsRequested: skills.reduce((n, s) => n + Object.values(s.requested).reduce((x, y) => x + y, 0), 0),
          itemsGenerated: skills.reduce((n, s) => n + s.items.length, 0),
          needsFigureObjectives: skills.reduce((n, s) => n + s.needsFigure.length, 0),
          generationStatus: countBy(skills, (s) => s.status),
          generationFollowUps: skills.filter((s) => s.attempts > 1).length,
          replacedForRuleDefectsAtGeneration: skills.reduce((n, s) => n + (s.replacedForDefects ?? 0), 0),
          generatedByFormat: countBy(skills.flatMap((s) => s.items), (i) => i.responseFormat),
        }
      : {}),
    checked: recs.length,
    byVerdict: countBy(recs, (r) => r.verdict),
    byReason: countBy(recs, (r) => `${r.verdict}:${r.reason}`),
    bySubject: Object.fromEntries(Object.entries(countBy(recs, (r) => `${r.subject ?? '?'}|${r.verdict}`)).sort()),
    rejectedAt: countBy(recs.filter((r) => r.verdict === 'REJECTED'), (r) => r.gate ?? (r.solvers ? 'key' : 'checks')),
    qualityFirstReviewerFlagged: recs.filter((r) => (r.quality?.deepseek.length ?? 0) > 0).length,
    qualitySecondReviewerFlagged: recs.filter((r) => (r.quality?.haiku?.length ?? 0) > 0).length,
    qualityRejectedByCheck: countBy(recs.flatMap((r) => (r.reason === 'quality' ? rejectedFlags(r.quality) : [])), (f) => f.id),
    qualityContested: countBy(recs.flatMap((r) => r.quality?.contested ?? []), (c) => `${c.id}:${c.upheld ? 'upheld' : 'cleared'}`),
    droppedAsSameTask: recs.filter((r) => r.reason === 'same_task_as_better').length,
    reassessed: countBy(recs.filter((r) => r.previous), (r) => `${r.previous!.reason} → ${r.verdict}:${r.reason}`),
    acceptedWithStandardAssumption: recs.filter((r) => r.verdict === 'ACCEPTED' && [r.solvers?.deepseek, r.solvers?.haiku, r.tiebreak].some((e) => e?.assumptionCheck && !e.assumptionCheck.answerChanging)).length,
    tiebreaks: recs.filter((r) => r.tiebreak).length,
    ledger: ledgerTotals(a.ledger ?? path.join(a.out, 'ledger.jsonl'), auditFile === 'audit.jsonl' ? ['generate', 'audit'] : ['second-check'], new Set([...skills.map((g) => g.skillLoId), ...recs.map((r) => r.id)])),
  };
  fs.writeFileSync(path.join(a.out, 'summary.json'), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify({ ...summary, ledger: { totalUsd: summary.ledger.totalUsd, byStage: summary.ledger.byStage } }, null, 1));
}

function stageReview(a: Args): void {
  const dump = readJson<Dump>(need(a.dump, '--dump'));
  const plans = new Map(dump.plans.map((p) => [p._id, p]));
  const audit = new Map(allAuditRecords(a, 'audit.jsonl').map((r) => [r.id, r]));
  const skills = allGeneratedSkills(a).sort((x, y) => x.subject.localeCompare(y.subject) || x.title.localeCompare(y.title));
  const all = skills.flatMap((s) => s.items);
  const kept = all.filter((i) => audit.get(i.id)?.verdict === 'ACCEPTED').length;
  const notKept = all.filter((i) => audit.get(i.id)?.verdict === 'REJECTED').length;

  const isDescOnly = (g: GeneratedSkill) => !!plans.get(g.planId)?.metadata?.pendingPicker || g.items.some((i) => i.grounding === 'description-only');
  const gateOf = (r: AuditRecord) => r.gate ?? (r.solvers ? 'key' : 'checks');
  const md: string[] = [
    '# New practice questions — for review',
    '',
    `${skills.length} skills · ${all.length} questions written · ${kept} kept · ${notKept} not kept · ${all.length - kept - notKept} undecided.`,
    '',
    'Every question went through three steps. (1) Automatic rules on its form. (2) A quality review by an AI reviewer against a fixed checklist; a problem counts only when a second, different AI reviewer raises the same one. (3) An answer check: two different AI checkers were shown the question only, never the stored answer, and a question is kept only when both arrive at the stored answer (or, if exactly one disagrees, when a third and stronger check arrives at it). Nothing here has been added to the product.',
    '',
  ];
  const renderKept = (list: GeneratedSkill[]) => {
    if (list.length === 0) md.push('None.', '');
    for (const g of list) {
      const plan = plans.get(g.planId);
      md.push(`### ${g.subject} — ${g.title}`, '');
      for (const lo of plan?.los ?? []) {
        if (!(lo.id in g.requested)) continue;
        md.push(`#### Objective: ${lo.description}`, '');
        const flag = g.needsFigure.find((m) => m.objectiveLoId === lo.id);
        if (flag) {
          md.push(`No question written — this objective needs a figure. ${flag.reason}`, '');
          continue;
        }
        const mine = g.items.filter((i) => i.objectiveLoId === lo.id && audit.get(i.id)?.verdict === 'ACCEPTED');
        const lost = g.items.filter((i) => i.objectiveLoId === lo.id).length - mine.length;
        if (mine.length === 0) md.push(`No question kept for this objective (${g.requested[lo.id]} asked for).`, '');
        mine.forEach((i, k) => md.push(...itemBlock(k + 1, audit.get(i.id)!, i.covers, i.grounding)));
        if (lost > 0 && mine.length > 0) md.push(`_${lost} more written for this objective but not kept — see further down._`, '');
      }
    }
  };
  md.push('## Questions that were kept', '');
  renderKept(skills.filter((g) => !isDescOnly(g)));
  md.push('## Kept questions for skills that store only objective descriptions', '', '_These skills have no lesson material, so their questions were written from the objective descriptions alone. Please read them with extra care._', '');
  renderKept(skills.filter(isDescOnly));

  const renderLost = (title: string, intro: string, pick: (r: AuditRecord) => boolean) => {
    md.push(`## ${title}`, '', intro, '');
    let any = false;
    for (const g of skills) {
      const lost = g.items.filter((i) => audit.get(i.id) && audit.get(i.id)!.verdict !== 'ACCEPTED' && pick(audit.get(i.id)!));
      if (lost.length === 0) continue;
      any = true;
      md.push(`### ${g.subject} — ${g.title}${isDescOnly(g) ? ' (objective descriptions only)' : ''}`, '');
      const plan = plans.get(g.planId);
      lost.forEach((i, k) => {
        md.push(`Objective: ${plan?.los.find((l) => l.id === i.objectiveLoId)?.description ?? i.objectiveLoId}`, '');
        md.push(...itemBlock(k + 1, audit.get(i.id)!, i.covers, i.grounding));
      });
    }
    if (!any) md.push('None.', '');
  };
  const lostFrom = md.length;
  renderLost('Not kept — the stored answer did not hold up', 'The checkers did not arrive at the stored answer, or said the question cannot be answered as written.', (r) => gateOf(r) === 'key');
  renderLost('Not kept — quality problems', 'The answer may well be right; the reviewers found the question itself weak, or the same task as a better one.', (r) => gateOf(r) === 'quality');
  renderLost('Not kept — broke a writing rule or repeats another question', 'Caught automatically, before any reviewer saw it.', (r) => gateOf(r) === 'checks');
  const unchecked = all.filter((i) => !audit.get(i.id)).length;
  if (unchecked) md.push(`${unchecked} question(s) have not been checked yet.`, '');
  const figures = skills.flatMap((g) => g.needsFigure.map((m) => ({ g, m })));
  md.push('## Objectives that need a figure', '', 'No question is written for these; they are listed for a later question type that can show a figure.', '');
  const setAside = a.figures && fs.existsSync(a.figures) ? readJson<FigureObjective[]>(a.figures).filter((f) => skills.some((g) => g.skillLoId === f.skillLoId)) : [];
  for (const f of setAside) md.push(`- ${f.subject} — ${f.title}: ${f.description} — ${f.why}`);
  if (figures.length + setAside.length === 0) md.push('None.', '');
  for (const { g, m } of figures) {
    const lo = plans.get(g.planId)?.los.find((l) => l.id === m.objectiveLoId);
    md.push(`- ${g.subject} — ${g.title}: ${lo?.description ?? m.objectiveLoId} — ${m.reason}`);
  }
  md.push('');
  if (a.splitReview) {
    fs.writeFileSync(path.join(a.out, 'review.md'), md.slice(0, lostFrom).join('\n'));
    fs.writeFileSync(path.join(a.out, 'rejected.md'), ['# New practice questions that were NOT kept', '', `${notKept} of ${all.length} questions written. The kept ones are in review.md.`, '', ...md.slice(lostFrom)].join('\n'));
  } else {
    fs.writeFileSync(path.join(a.out, 'review.md'), md.join('\n'));
  }
  writeSummary(a, 'audit.jsonl');
  console.log(`review: ${path.join(a.out, 'review.md')}`);
}

// ── main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is set in the environment. This job never opens a database; run it with MONGODB_URI unset so nothing it imports could.');
  }
  const a = parseArgs(process.argv.slice(2));
  switch (a.stage) {
    case 'figures': return stageFigures(a);
    case 'plan': return stagePlan(a);
    case 'generate': return stageGenerate(a);
    case 'audit': return stageAudit(a);
    case 'second-check': return stageSecondCheck(a);
    case 'export': return stageExport(a);
    case 'review': return stageReview(a);
    default: throw new Error(`unknown stage "${a.stage}" — one of: figures, plan, generate, audit, second-check, export, review`);
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});

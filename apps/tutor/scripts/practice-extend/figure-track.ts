/**
 * The FIGURE track of the offline practice-extension job: practice items
 * that are shown together with one figure, for the objectives the text
 * track set aside as figure-dependent. Entered through
 * practice-extend.ts (`figure-kinds`, `figure-plan`, `figure-generate`,
 * `figure-audit`, `figure-export`), which hands over its own helpers
 * (ledger, quality gate, two-solver check) so both tracks audit the same way.
 *
 * Local JSON in, local files out. No database: the no-db import below comes
 * before anything that loads app code. Nothing is seeded.
 */
import '../lib/no-db-env';
import fs from 'node:fs';
import path from 'node:path';
import { buildPracticeFigure } from '../../src/lib/tutor/practice-figure/render';
import { BudgetExceeded, comparableOf, contentDefects, itemIdOf, nearDuplicateOf, repeatedTaskTypes, simpleHash, type KeyedQuestion } from './core';
import {
  FIGURE_GENERATION_SCHEMA,
  PRACTICE_FIGURE_KINDS,
  RENDERER_NEEDS_WORK,
  examineFigureItem,
  kindChoiceOf,
  neededGroup,
  pickFigureSample,
  solverQuestion,
  validateFigureItem,
  type FigureExamination,
  type FigureItem,
  type KindChoice,
} from './figure-core';
import { FIGURE_GENERATE_SYSTEM, buildKindPrompt } from './figure-prompts';
import { callJson, loadProviders, readLedger } from './models';
import type { Args, AuditRecord, Dump, FigureObjective, FigureTools, Plan } from './practice-extend';
import type { QualityView } from './prompts';

// ── files of this track ─────────────────────────────────────────────────────

interface KindRow { skillLoId: string; subject: string; choices: KindChoice[]; model: string; at: string }
interface KindEntry extends KindChoice { skillLoId: string; title: string; description: string; why: string; servable: number; group: string }
interface FigureTarget { skillLoId: string; planId: string; objectiveLoId: string; subject: string; kind: string; n: number }
interface StoredFigureItem extends FigureItem { id: string; skillLoId: string; grounding: 'lesson' | 'description-only' }
/** What became of one item of one writer reply. */
interface Attempt { attempt: 1 | 2; stem: string; outcome: 'clean' | 'invalid' | 'figure_refused' | 'key_mismatch' | 'derivation_error' | 'rule' | 'repeat'; errors: string[] }
interface GeneratedObjective {
  objectiveLoId: string;
  skillLoId: string;
  planId: string;
  subject: string;
  title: string;
  kind: string;
  requested: number;
  items: StoredFigureItem[];
  cannotWrite?: string;
  attempts: number;
  log: Attempt[];
  status: 'ok' | 'salvaged' | 'declined' | 'failed';
  model: string;
  at: string;
}
interface FigureAuditRecord extends AuditRecord {
  /** `transcript`: hash of the figure transcription the reviewers and solvers were given. */
  figure: { kind: string; derived: boolean; derivation: FigureExamination['derivation']; transcript?: string };
}

const planIdOf = (objectiveLoId: string): string => objectiveLoId.replace(/\.lo-\d+$/, '');
const oneLine = (t: string): string => t.replace(/\s+/g, ' ').trim();
const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function latestBy<T>(rows: T[], key: (r: T) => string): T[] {
  const m = new Map<string, T>();
  for (const r of rows) m.set(key(r), r);
  return [...m.values()];
}

export async function runFigureStage(a: Args, t: FigureTools): Promise<void> {
  switch (a.stage) {
    case 'figure-kinds': return stageKinds(a, t);
    case 'figure-plan': return stagePlan(a, t);
    case 'figure-generate': return stageGenerate(a, t);
    case 'figure-audit': return stageAudit(a, t);
    case 'figure-export': return stageExport(a, t);
    default: throw new Error(`unknown figure stage "${a.stage}" — one of: figure-kinds, figure-plan, figure-generate, figure-audit, figure-export`);
  }
}

// ── stage: figure-kinds ─────────────────────────────────────────────────────

/**
 * One cheap call per skill: for each of its figure-dependent objectives,
 * the supported figure kind that fits, or `unsupported` with the type of
 * figure it would need.
 */
async function stageKinds(a: Args, t: FigureTools): Promise<void> {
  const figures = t.readJson<FigureObjective[]>(t.need(a.figures, '--figures'));
  const dump = t.readJson<Dump>(t.need(a.dump, '--dump'));
  const plans = new Map(dump.plans.map((p) => [p._id, p]));
  fs.mkdirSync(a.out, { recursive: true });
  const file = path.join(a.out, 'kind-selection.jsonl');
  const done = new Set(t.readJsonl<KindRow>(file).map((r) => r.skillLoId));
  const bySkill = new Map<string, FigureObjective[]>();
  for (const f of figures) bySkill.set(f.skillLoId, [...(bySkill.get(f.skillLoId) ?? []), f]);
  let todo = [...bySkill.entries()].filter(([id]) => !done.has(id));
  if (a.limit !== undefined) todo = todo.slice(0, a.limit);
  console.log(`figure-kinds: ${todo.length} skill(s) to classify, ${done.size} already done`);
  if (todo.length > 0) {
    const providers = loadProviders();
    const ledger = t.openLedger(a);
    const { budgetStop } = await t.pool(todo, a.concurrency, async ([skillLoId, list]) => {
      const plan = plans.get(planIdOf(list[0].objectiveLoId));
      const views = list.map((f) => {
        const lo = plan?.los.find((l) => l.id === f.objectiveLoId);
        const m = plan && lo ? t.materialOf(plan, lo) : undefined;
        const lesson = [m?.concept?.goal, m?.worked?.problem && `Worked example: ${m.worked.problem}`].filter(Boolean).join(' ');
        return { description: f.description, why: f.why, ...(lesson ? { lesson } : {}) };
      });
      const prompt = buildKindPrompt(list[0].subject, list[0].title, views);
      const r = await callJson(providers, ledger, {
        provider: 'deepseek', model: providers.models.deepseek, system: prompt.system, user: prompt.user, schema: prompt.schema,
        maxTokens: 400 + 200 * views.length, stage: 'figure-kinds', purpose: 'select-kind', ref: skillLoId,
      });
      const byN = new Map((Array.isArray(r.objectives) ? r.objectives : []).map((e) => [Number((e as { n?: unknown })?.n), e as Record<string, unknown>]));
      t.appendJsonl(file, { skillLoId, subject: list[0].subject, choices: list.map((f, i) => kindChoiceOf(f.objectiveLoId, f.subject, byN.get(i + 1))), model: providers.models.deepseek, at: new Date().toISOString() } satisfies KindRow);
    });
    t.finish('figure-kinds', ledger, budgetStop);
  }

  const choice = new Map(t.readJsonl<KindRow>(file).flatMap((r) => r.choices).map((c) => [c.objectiveLoId, c]));
  const all: KindEntry[] = figures.filter((f) => choice.has(f.objectiveLoId)).map((f) => {
    const c = choice.get(f.objectiveLoId)!;
    return { ...c, skillLoId: f.skillLoId, title: f.title, description: f.description, why: f.why, servable: f.servable, group: neededGroup(c) };
  });
  const supported = all.filter((c) => c.kind !== 'unsupported');
  const unsupported = all.filter((c) => c.kind === 'unsupported');
  const subjects = [...new Set(figures.map((f) => f.subject))].sort();
  const summary = {
    figureObjectives: figures.length,
    classified: all.length,
    supported: supported.length,
    unsupported: unsupported.length,
    studentMustDraw: unsupported.filter((c) => c.studentMustDraw).length,
    bySubject: Object.fromEntries(subjects.map((s) => [s, { supported: supported.filter((c) => c.subject === s).length, unsupported: unsupported.filter((c) => c.subject === s).length }])),
    supportedByKind: Object.fromEntries(PRACTICE_FIGURE_KINDS.map((k) => [k, supported.filter((c) => c.kind === k).length])),
    supportedBySubjectAndKind: t.countBy(supported, (c) => `${c.subject} | ${c.kind}`),
    unsupportedByNeededFigure: Object.fromEntries(Object.entries(t.countBy(unsupported, (c) => c.group)).sort((x, y) => y[1] - x[1])),
  };
  fs.writeFileSync(path.join(a.out, 'figure-kinds.json'), JSON.stringify(all, null, 2));
  fs.writeFileSync(path.join(a.out, 'supported-figure-objectives.json'), JSON.stringify(supported, null, 2));
  fs.writeFileSync(path.join(a.out, 'unsupported-figure-objectives.json'), JSON.stringify(unsupported.map((c) => ({ subject: c.subject, skillLoId: c.skillLoId, title: c.title, objectiveLoId: c.objectiveLoId, description: c.description, neededFigure: c.neededFigure, neededFigureGroup: c.group, studentMustDraw: c.studentMustDraw, reason: c.reason })), null, 2));
  fs.writeFileSync(path.join(a.out, 'kinds-summary.json'), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 1));
}

// ── stage: figure-plan ──────────────────────────────────────────────────────

function stagePlan(a: Args, t: FigureTools): void {
  const kinds = t.readJson<KindEntry[]>(t.need(a.kinds, '--kinds'));
  let supported: KindChoice[] = kinds.filter((c) => c.kind !== 'unsupported');
  if (a.skills) supported = supported.filter((c) => a.skills!.includes((c as KindEntry).skillLoId));
  // Kinds whose drawing is not good enough yet are set aside, not generated.
  const needsWork = supported.filter((c) => RENDERER_NEEDS_WORK[c.kind]);
  supported = supported.filter((c) => !RENDERER_NEEDS_WORK[c.kind]);
  fs.mkdirSync(a.out, { recursive: true });
  fs.writeFileSync(path.join(a.out, 'renderer-needs-work.json'), JSON.stringify(needsWork.map((c) => ({ subject: c.subject, objectiveLoId: c.objectiveLoId, description: (c as KindEntry).description, kind: c.kind, reason: `renderer needs work: ${RENDERER_NEEDS_WORK[c.kind]}` })), null, 2));
  if (a.retryEmptyFrom) {
    // A further pass: only the objectives targeted there that have no accepted question.
    const accepted = new Set(t.auditRecords(path.join(a.retryEmptyFrom, 'audit.jsonl')).filter((r) => r.verdict === 'ACCEPTED').map((r) => r.objectiveLoId));
    const before = new Set(t.readJsonl<FigureTarget>(path.join(a.retryEmptyFrom, 'targets.jsonl')).map((x) => x.objectiveLoId));
    supported = supported.filter((c) => before.has(c.objectiveLoId) && !accepted.has(c.objectiveLoId));
  }
  const picked = a.sample ? pickFigureSample(supported, a.sample) : supported;
  const targets: FigureTarget[] = picked.map((c) => ({ skillLoId: (c as KindEntry).skillLoId, planId: planIdOf(c.objectiveLoId), objectiveLoId: c.objectiveLoId, subject: c.subject, kind: c.kind, n: a.perObjective }));
  fs.writeFileSync(path.join(a.out, 'targets.jsonl'), targets.map((x) => JSON.stringify(x)).join('\n') + (targets.length ? '\n' : ''));
  console.log(`figure-plan: ${targets.length} objective(s), ${a.perObjective} question(s) each`);
  console.table({ bySubject: t.countBy(targets, (x) => x.subject), byKind: t.countBy(targets, (x) => x.kind) });
}

// ── stage: figure-generate ──────────────────────────────────────────────────

function buildGenerateUser(t: FigureTools, plan: Plan, dump: Dump, target: FigureTarget, n: number, extra?: { written?: string[]; note?: string; failed?: string[] }): string {
  const lo = plan.los.find((l) => l.id === target.objectiveLoId)!;
  const m = t.materialOf(plan, lo);
  const parts = [`Subject: ${target.subject}`, `Skill: ${plan.title}`, '', `Objective id: ${m.loId}`, `Description: ${m.description}`, `Kind of figure assigned: ${target.kind}`, `Questions requested: ${n}`];
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
  const has = [...(t.existingStemsByObjective(plan, dump).get(lo.id) ?? []), ...(extra?.written ?? [])];
  parts.push('Questions this objective already has (a new question must be a type of task none of these uses):', ...(has.length ? has.map((q) => `  - ${oneLine(q)}`) : ['  (none)']));
  if (extra?.failed?.length) parts.push('Earlier attempts for this objective that were rejected, each with the reason — write something that does not have that fault, and do not rewrite the same question:', ...extra.failed.map((f) => `  - ${f}`));
  const others = plan.los.filter((l) => l.id !== lo.id);
  if (others.length) parts.push('', 'Other objectives of this skill (context only — do not write a question that really belongs to one of them):', ...others.map((l) => `  - ${l.description}`));
  if (extra?.note) parts.push('', extra.note);
  parts.push('', `Return ${n} question(s) for objective ${m.loId}, each with its own ${target.kind} figure — or a cannotWrite entry.`);
  return parts.join('\n');
}

function generatedObjectives(out: string, t: FigureTools): GeneratedObjective[] {
  return latestBy(t.readJsonl<GeneratedObjective>(path.join(out, 'generated.jsonl')), (g) => g.objectiveLoId);
}

async function stageGenerate(a: Args, t: FigureTools): Promise<void> {
  const dump = t.readJson<Dump>(t.need(a.dump, '--dump'));
  const plans = new Map(dump.plans.map((p) => [p._id, p]));
  const targets = t.readJsonl<FigureTarget>(path.join(a.out, 'targets.jsonl'));
  const outFile = path.join(a.out, 'generated.jsonl');
  const done = new Set(generatedObjectives(a.out, t).filter((g) => g.status !== 'failed' && !(g.status === 'salvaged' && a.retryIncomplete)).map((g) => g.objectiveLoId));
  let todo = targets.filter((x) => !done.has(x.objectiveLoId));
  if (a.skills) todo = todo.filter((x) => a.skills!.includes(x.skillLoId));
  if (a.limit !== undefined) todo = todo.slice(0, a.limit);
  console.log(`figure-generate: ${todo.length} objective(s) to do, ${done.size} already done`);
  if (todo.length === 0) return;
  const providers = loadProviders();
  const ledger = t.openLedger(a);
  const model = providers.models.generate;
  let failed = 0;
  // A further pass: what was tried before for each objective, and why it was not kept.
  const failedBefore = new Map<string, string[]>();
  if (a.previous) {
    const before = new Map(t.auditRecords(path.join(a.previous, 'audit.jsonl')).map((r) => [r.id, r]));
    for (const g of generatedObjectives(a.previous, t)) {
      for (const it of g.items) {
        const r = before.get(it.id);
        if (!r || r.verdict !== 'REJECTED') continue;
        const why = r.reason === 'quality' ? t.flagText(t.rejectedFlags(r.quality)) : `${FIGURE_REASON_TEXT[r.reason] ?? t.REASON_TEXT[r.reason] ?? r.reason}${r.detail ? ` (${oneLine(r.detail).slice(0, 260)})` : ''}`;
        failedBefore.set(g.objectiveLoId, [...(failedBefore.get(g.objectiveLoId) ?? []), `"${oneLine(it.problemText).slice(0, 220)}" — rejected: ${why}`]);
      }
    }
  }

  const { budgetStop } = await t.pool(todo, Math.min(a.concurrency, 3), async (target) => {
    try {
      await generateObjective(target);
    } catch (e) {
      if (e instanceof BudgetExceeded) throw e;
      failed++;
      console.error(`  FAILED   ${target.objectiveLoId}  ${(e instanceof Error ? e.message : String(e)).slice(0, 160)}`);
    }
  });
  if (failed > 0) console.error(`figure-generate: ${failed} objective(s) failed and were left for a re-run`);
  t.finish('figure-generate', ledger, budgetStop);

  async function generateObjective(target: FigureTarget): Promise<void> {
    const plan = plans.get(target.planId);
    if (!plan) throw new Error(`plan ${target.planId} is not in the dump`);
    const ids = plan.los.map((l) => l.id);
    const call = (user: string, count: number, purpose: string) =>
      callJson(providers, ledger, {
        provider: 'anthropic', model, system: FIGURE_GENERATE_SYSTEM, user, schema: FIGURE_GENERATION_SCHEMA, cacheSystem: true,
        maxTokens: 5000 + count * 2500, ...(a.genEffort === 'none' ? { noThinking: true } : { effort: a.genEffort }), stage: 'figure-generate', purpose, ref: target.objectiveLoId,
      });
    const log: Attempt[] = [];
    /** Sort one reply into clean items and defective ones, logging each. */
    const sift = (reply: Record<string, unknown>, attempt: 1 | 2, before: FigureItem[]) => {
      const clean: FigureItem[] = [];
      const defective: FigureItem[] = [];
      for (const raw of Array.isArray(reply.items) ? reply.items : []) {
        const v = validateFigureItem(raw, ids, target.kind);
        const stem = oneLine(String((raw as { problemText?: unknown })?.problemText ?? '')).slice(0, 200);
        if (!v.item) {
          log.push({ attempt, stem, outcome: 'invalid', errors: v.errors });
          continue;
        }
        const errors = [...v.errors];
        if (v.item.objectiveLoId !== target.objectiveLoId) errors.push(`objective ${v.item.objectiveLoId} was not requested`);
        const seen = [...before, ...clean];
        if (seen.some((x) => oneLine(x.problemText).toLowerCase() === oneLine(v.item!.problemText).toLowerCase())) errors.push('same question text as another question of this request');
        const repeat = repeatedTaskTypes([...seen, v.item]).length > 0;
        if (repeat) errors.push(`its task type "${v.item.taskType}" repeats another question of the objective — it must be a different kind of task`);
        const d = v.exam?.derivation.status;
        const outcome: Attempt['outcome'] = errors.length === 0 ? 'clean' : !v.exam?.svg ? 'figure_refused' : d === 'mismatch' ? 'key_mismatch' : d === 'error' ? 'derivation_error' : repeat && errors.length === 1 ? 'repeat' : 'rule';
        log.push({ attempt, stem, outcome, errors });
        (errors.length === 0 ? clean : defective).push(v.item);
      }
      return { clean, defective };
    };

    const failedList = failedBefore.get(target.objectiveLoId);
    const first = await call(buildGenerateUser(t, plan, dump, target, target.n, { failed: failedList }), target.n, 'generate');
    const declined = (Array.isArray(first.cannotWrite) ? first.cannotWrite : []).map((c) => oneLine(String((c as { reason?: unknown })?.reason ?? ''))).filter(Boolean)[0];
    const one = sift(first, 1, []);
    let kept = one.clean.slice(0, target.n);
    let leftover = one.defective;
    let attempts = 1;
    if (kept.length < target.n && !(declined && one.clean.length + one.defective.length === 0)) {
      // ONE follow-up, only for what is missing, with the reasons the first ones were refused.
      attempts = 2;
      const faults = log.filter((l) => l.outcome !== 'clean').slice(0, 6);
      const note = faults.length
        ? `Questions written earlier for this request were discarded — do not repeat these faults:\n${faults.map((l) => `  - "${l.stem.slice(0, 110)}…": ${l.errors.slice(0, 3).join('; ')}`).join('\n')}`
        : '';
      const second = await call(buildGenerateUser(t, plan, dump, target, target.n - kept.length, { written: kept.map((k) => k.problemText), note, failed: failedList }), target.n - kept.length, 'generate-followup');
      const two = sift(second, 2, kept);
      kept = [...kept, ...two.clean].slice(0, target.n);
      leftover = [...two.defective, ...leftover];
    }
    // A question that still breaks a rule is kept (up to the count asked for)
    // so that the audit stage rejects it by rule — and counts it.
    const items = [...kept, ...leftover.slice(0, Math.max(0, target.n - kept.length))];
    const m = t.materialOf(plan, plan.los.find((l) => l.id === target.objectiveLoId)!);
    const row: GeneratedObjective = {
      objectiveLoId: target.objectiveLoId, skillLoId: target.skillLoId, planId: plan._id, subject: target.subject, title: plan.title, kind: target.kind, requested: target.n,
      items: items.map((it) => ({ id: itemIdOf(it.objectiveLoId, it.problemText), skillLoId: target.skillLoId, grounding: m.concept || m.worked ? 'lesson' : 'description-only', ...it })),
      ...(declined ? { cannotWrite: declined } : {}),
      attempts, log,
      status: kept.length === target.n ? 'ok' : items.length > 0 ? 'salvaged' : declined ? 'declined' : 'failed',
      model, at: new Date().toISOString(),
    };
    t.appendJsonl(outFile, row);
    console.log(`  ${row.status.padEnd(8)} ${target.subject.padEnd(15)} ${target.kind.padEnd(20)} ${kept.length}/${target.n} clean${attempts > 1 ? ' (after a follow-up)' : ''}${declined ? ` — declined: ${declined.slice(0, 80)}` : ''}`);
  }
}

// ── stage: figure-audit ─────────────────────────────────────────────────────

const keyQuestion = (it: FigureItem, question = it.problemText): KeyedQuestion => ({ format: it.responseFormat, question, key: it.answer, choices: it.choices });

async function stageAudit(a: Args, t: FigureTools): Promise<void> {
  const dump = t.readJson<Dump>(t.need(a.dump, '--dump'));
  const plans = new Map(dump.plans.map((p) => [p._id, p]));
  const file = path.join(a.out, 'audit.jsonl');
  const prior = new Map(t.readJsonl<FigureAuditRecord>(file).map((r) => [r.id, r]));
  const work: Array<{ g: GeneratedObjective; it: StoredFigureItem; exam: FigureExamination; precheck?: { reason: string; detail: string }; view?: QualityView }> = [];
  const earlierPass = new Map((a.previous ? generatedObjectives(a.previous, t) : []).map((g) => [g.objectiveLoId, g.items]));
  for (const g of generatedObjectives(a.out, t)) {
    const plan = plans.get(g.planId);
    const known: Array<{ id: string; problemText: string; answerText?: string; choices?: readonly string[] }> = plan ? t.existingItemsOf(plan, dump) : [];
    for (const it of earlierPass.get(g.objectiveLoId) ?? []) known.push({ id: it.id, ...comparableOf(it) });
    const repeats = new Set(repeatedTaskTypes(g.items));
    const earlier = plan ? t.existingStemsByObjective(plan, dump) : new Map<string, string[]>();
    g.items.forEach((it, i) => {
      const exam = examineFigureItem(it);
      const rule = contentDefects(it, { hasFigure: true });
      if (repeats.has(i)) rule.push(`its task type "${it.taskType}" repeats another question of the same objective`);
      const me = comparableOf(it);
      const figureFault = exam.defects.length > 0;
      const dup = !figureFault && rule.length === 0 ? nearDuplicateOf(me, known) : null;
      const precheck = figureFault
        ? { reason: !exam.svg ? 'figure_refused' : exam.derivation.status === 'mismatch' ? 'key_disagrees_with_figure' : exam.derivation.status === 'error' ? 'derivation_failed' : 'failed_figure_checks', detail: [...exam.defects, ...rule].join('; ') }
        : rule.length > 0
          ? { reason: 'failed_checks', detail: rule.join('; ') }
          : dup
            ? { reason: 'near_duplicate', detail: `${dup.reason} of ${dup.of.id}` }
            : undefined;
      if (!precheck) known.push({ id: it.id, ...me });
      const lo = plan?.los.find((l) => l.id === it.objectiveLoId);
      const view: QualityView | undefined = lo && exam.figureText
        ? {
            objective: lo.description,
            otherObjectives: plan!.los.filter((l) => l.id !== lo.id).map((l) => l.description),
            format: it.responseFormat, question: it.problemText, choices: it.choices,
            answer: it.responseFormat === 'mcq' ? `${it.answer}) ${it.choices['ABCD'.indexOf(it.answer)] ?? ''}` : it.answer,
            earlier: [...(earlier.get(lo.id) ?? [])], rationales: it.distractorRationales, figureText: exam.figureText,
          }
        : undefined;
      work.push({ g, it, exam, precheck, view });
    });
  }
  // Done already — unless the check failed technically, the transcription the
  // decision rested on has changed since, or a rule now refuses a kept item.
  const stale = (w: (typeof work)[number]): boolean => {
    const p = prior.get(w.it.id);
    if (!p || p.verdict === 'ERROR') return true;
    if (w.precheck) return p.gate !== 'checks';
    return p.gate === 'checks' || p.figure?.transcript !== simpleHash(w.exam.figureText ?? '');
  };
  let todo = work.filter(stale);
  const already = work.length - todo.length;
  if (a.limit !== undefined) todo = todo.slice(0, a.limit);
  console.log(`figure-audit: ${todo.length} item(s) to do, ${already} already done`);
  if (todo.length > 0) {
    const providers = loadProviders();
    const ledger = t.openLedger(a);
    const { budgetStop } = await t.pool(todo, a.concurrency, async (w) => {
      const { it, exam } = w;
      const base = {
        id: it.id, skillLoId: it.skillLoId, objectiveLoId: it.objectiveLoId, subject: w.g.subject, taskType: it.taskType,
        format: it.responseFormat, question: it.problemText, key: it.answer, choices: it.choices,
        figure: { kind: it.figureSpec.type, derived: exam.derivation.status === 'derived', derivation: exam.derivation, transcript: simpleHash(exam.figureText ?? '') },
      };
      const now = () => new Date().toISOString();
      let rec: FigureAuditRecord;
      if (w.precheck) rec = { ...base, verdict: 'REJECTED', gate: 'checks', reason: w.precheck.reason, detail: w.precheck.detail, at: now() };
      else {
        try {
          // Is the figure needed at all? One blind solve of the question WITHOUT the
          // figure: a solver that reaches the stored answer from the text alone settles it.
          const alone = await t.solveBlind(providers, ledger, keyQuestion(it), 'deepseek', 'figure-audit-stem-alone', it.id);
          if (!alone.illPosed && alone.vsKey?.verdict === 'SAME') {
            rec = { ...base, verdict: 'REJECTED', gate: 'checks', reason: 'answerable_without_figure', detail: `a solver shown the question without the figure reached the stored answer (${oneLine(alone.justification).slice(0, 200)})`, at: now() };
            t.appendJsonl(file, rec);
            return;
          }
          const quality = w.view ? await t.qualityGate(providers, ledger, w.view, 'figure-audit', it.id) : undefined;
          if (t.rejectedFlags(quality).length > 0) {
            rec = { ...base, verdict: 'REJECTED', gate: 'quality', reason: 'quality', detail: t.rejectedFlags(quality).map((f) => f.id).join(', '), quality, at: now() };
          } else {
            // The solvers get the code-made transcription in place of the picture — and no key.
            const r = await t.twoSolverCheck(providers, ledger, keyQuestion(it, solverQuestion(exam.figureText!, it.problemText)), 'figure-audit', it.id);
            if (r.decision.status === 'TIEBREAK') throw new Error('tie-break did not resolve');
            rec = { ...base, verdict: r.decision.status, gate: 'key', reason: r.decision.reason, ...(quality ? { quality } : {}), solvers: { deepseek: r.deepseek, haiku: r.haiku }, ...(r.tiebreak ? { tiebreak: r.tiebreak } : {}), at: now() };
          }
        } catch (e) {
          if (e instanceof BudgetExceeded) throw e;
          rec = { ...base, verdict: 'ERROR', reason: 'error', detail: (e instanceof Error ? e.message : String(e)).slice(0, 300), at: now() };
        }
      }
      t.appendJsonl(file, rec);
    });
    t.finish('figure-audit', ledger, budgetStop);
  }
  await t.dropSameTasks(a, file, plans);
}

// ── stage: figure-export ────────────────────────────────────────────────────

const FIGURE_REASON_TEXT: Record<string, string> = {
  figure_refused: 'The figure specification could not be drawn, or broke a rule of the figure.',
  key_disagrees_with_figure: 'The answer recomputed from the figure is not the stored answer.',
  derivation_failed: 'The named derivation could not be carried out on the figure (for instance a value that is not on a gridline).',
  failed_figure_checks: 'It broke a rule for questions with a figure.',
  answerable_without_figure: 'It can be answered without the figure.',
};

/** PNG width in device pixels: the 340 px phone column at 2×. */
const PNG_WIDTH = 680;

async function stageExport(a: Args, t: FigureTools): Promise<void> {
  const dump = t.readJson<Dump>(t.need(a.dump, '--dump'));
  const plans = new Map(dump.plans.map((p) => [p._id, p]));
  // This run directory and every further pass (--also), put together.
  const dirs = [a.out, ...(a.also ?? [])];
  const audit = new Map(dirs.flatMap((d) => t.auditRecords(path.join(d, 'audit.jsonl'))).map((r) => [r.id, r as FigureAuditRecord]));
  const gens = dirs.flatMap((d) => generatedObjectives(d, t)).sort((x, y) => x.subject.localeCompare(y.subject) || x.objectiveLoId.localeCompare(y.objectiveLoId));
  const targets = dirs.flatMap((d) => t.readJsonl<FigureTarget>(path.join(d, 'targets.jsonl')));
  const dir = path.join(a.out, 'export');
  fs.mkdirSync(dir, { recursive: true });

  const rows: Array<Record<string, unknown>> = [];
  const meta: Array<Record<string, unknown>> = [];
  const cards: Array<{ accepted: boolean; html: string }> = [];
  const pngs: Array<{ id: string; svg: string }> = [];
  const rejected: string[] = [];
  const read: Array<Record<string, unknown>> = [];
  const pngDir = path.join(a.out, 'png');
  for (const g of gens) {
    const plan = plans.get(g.planId);
    const lo = plan?.los.find((l) => l.id === g.objectiveLoId);
    for (const it of g.items) {
      const r = audit.get(it.id);
      const exam = examineFigureItem(it);
      const accepted = r?.verdict === 'ACCEPTED';
      if (exam.svg) pngs.push({ id: it.id, svg: exam.svg });
      if (accepted && r) {
        rows.push({
          id: it.id, topic: plan?.topic ?? g.title, topicId: plan?.topic ?? g.title, loId: it.objectiveLoId, subtopic: lo?.shortTitle ?? '', difficulty: it.difficulty,
          problemText: it.problemText, answer: it.answer, solutionText: it.solutionText, hints: it.hints, responseFormat: it.responseFormat,
          choices: it.responseFormat === 'mcq' ? it.choices : [],
          // Drawn again through the authoring entry point: svg + alt within the contract bounds, spec kept beside it.
          figure: buildPracticeFigure(it.figureSpec, it.alt),
          source: { name: `Evelyn (${t.JOB_NAME}, figure track)` }, license: 'internal-original', verifiedAt: r.at, verifierModel: t.verifierOf(r),
        });
        read.push({
          id: it.id, subject: g.subject, skill: g.title, objective: lo?.description ?? it.objectiveLoId, format: it.responseFormat, question: it.problemText, choices: it.choices, key: it.answer,
          hints: it.hints, solution: it.solutionText, figureKind: it.figureSpec.type, figureText: exam.figureText ?? '', png: path.resolve(pngDir, `${it.id}.png`),
        });
        meta.push({ id: it.id, subject: g.subject, objectiveLoId: it.objectiveLoId, kind: it.figureSpec.type, derived: exam.derivation.status === 'derived', checker: exam.derivation.checker, derivedValue: exam.derivation.value ?? null, taskType: it.taskType });
      }
      const verdictText = !r ? 'not checked yet' : accepted ? `KEPT — ${t.REASON_TEXT[r.reason] ?? r.reason}` : `NOT KEPT — ${FIGURE_REASON_TEXT[r.reason] ?? t.REASON_TEXT[r.reason] ?? r.reason}${r.detail && r.reason !== 'quality' ? ` (${r.detail})` : ''}`;
      const derivationText = exam.derivation.status === 'derived' ? `derived: true — checker ${exam.derivation.checker}: ${exam.derivation.detail}` : exam.derivation.status === 'not_derived' ? 'derived: false — no checker; the answer rests on the solver check alone' : `checker ${exam.derivation.checker}: ${exam.derivation.status.toUpperCase()} — ${exam.derivation.detail}`;
      const lines = [
        r ? t.qualityLine(r) : undefined,
        r?.solvers ? t.solverLine('Checker 1 (DeepSeek)', r.solvers.deepseek) : undefined,
        r?.solvers ? t.solverLine('Checker 2 (Claude Haiku)', r.solvers.haiku) : undefined,
        r?.tiebreak ? t.solverLine('Third check (Claude Sonnet)', r.tiebreak) : undefined,
      ].filter((l): l is string => !!l).map((l) => l.replace(/^- /, ''));
      cards.push({
        accepted,
        html: `<section class="card ${accepted ? 'ok' : 'no'}" id="${esc(it.id)}">
<h2>${esc(g.subject)} · <span class="kind">${esc(it.figureSpec.type)}</span> · <span class="${accepted ? 'v-ok' : 'v-no'}">${accepted ? 'kept' : 'not kept'}</span></h2>
<p class="obj"><b>Objective:</b> ${esc(lo?.description ?? it.objectiveLoId)}</p>
<div class="row"><div class="fig">${exam.svg ?? `<p class="err">no figure — ${esc(exam.defects[0] ?? 'not drawn')}</p>`}</div>
<div class="q"><p><b>Question (${it.responseFormat === 'mcq' ? 'multiple choice' : it.responseFormat === 'numeric' ? 'number' : 'short answer'}):</b> ${esc(it.problemText)}</p>
${it.choices.length ? `<ol type="A">${it.choices.map((c, i) => `<li${'ABCD'[i] === it.answer ? ' class="key"' : ''}>${esc(c)}</li>`).join('')}</ol>` : ''}
<p><b>Stored answer:</b> ${esc(it.answer)}${it.responseFormat === 'mcq' ? ` — ${esc(it.choices['ABCD'.indexOf(it.answer)] ?? '')}` : ''}</p>
<p><b>Key recomputed from the figure:</b> ${esc(derivationText)}</p>
${lines.map((l) => `<p class="ev">${esc(l)}</p>`).join('\n')}
<p class="verdict"><b>Result:</b> ${esc(verdictText)}</p>
<p class="small"><b>Type of task:</b> ${esc(it.taskType)} · <b>Solution:</b> ${esc(it.solutionText)}</p>
<p class="small"><b>Alt text:</b> ${esc(it.alt)}</p>
<p class="small">${esc(it.id)}</p></div></div>
<details><summary>what the solvers and reviewers were given in place of the picture</summary><pre>${esc(exam.figureText ?? '(none)')}</pre></details>
<details><summary>figure spec · derivation</summary><pre>${esc(JSON.stringify({ spec: it.figureSpec, derivation: it.derivation }, null, 2))}</pre></details>
</section>`,
      });
      if (!accepted) {
        rejected.push(`### ${g.subject} — ${g.title} (${it.figureSpec.type})`, '', `Objective: ${lo?.description ?? it.objectiveLoId}`, '', `**Question:** ${oneLine(it.problemText)}`, '', ...it.choices.map((c, i) => `   ${'ABCD'[i]}) ${oneLine(c)}`), ...(it.choices.length ? [''] : []), `- Stored answer: **${it.answer}**`, `- Key recomputed from the figure: ${derivationText}`, ...lines.map((l) => `- ${l}`), `- Result: ${verdictText}`, `- Item: ${it.id}`, '');
      }
    }
  }
  fs.writeFileSync(path.join(dir, 'problem-bank-rows.json'), JSON.stringify(rows, null, 2));
  fs.writeFileSync(path.join(dir, 'audited-item-ids.json'), JSON.stringify(rows.map((r) => r.id), null, 2));
  fs.writeFileSync(path.join(dir, 'figure-items-meta.json'), JSON.stringify(meta, null, 2));

  // The accepted items in files of at most 30, for an independent visual read.
  const readDir = path.join(a.out, 'read');
  fs.rmSync(readDir, { recursive: true, force: true });
  fs.mkdirSync(readDir, { recursive: true });
  for (let i = 0; i < read.length; i += 30) fs.writeFileSync(path.join(readDir, `read-${String(i / 30 + 1).padStart(2, '0')}.json`), JSON.stringify(read.slice(i, i + 30), null, 2));

  // Every figure objective that still has no accepted question, with the reason.
  const filled = new Set(rows.map((r) => r.loId as string));
  const kindsFile = a.kinds && fs.existsSync(a.kinds) ? t.readJson<KindEntry[]>(a.kinds) : [];
  const stillEmpty = kindsFile.filter((k) => !filled.has(k.objectiveLoId)).map((k) => {
    const mine = gens.filter((g) => g.objectiveLoId === k.objectiveLoId);
    const recs = mine.flatMap((g) => g.items).map((i) => audit.get(i.id)).filter((r): r is FigureAuditRecord => !!r);
    const reason = k.kind === 'unsupported'
      ? `no supported figure kind — needs: ${k.group}`
      : RENDERER_NEEDS_WORK[k.kind]
        ? `renderer needs work (${k.kind}): ${RENDERER_NEEDS_WORK[k.kind]}`
        : mine.length === 0
          ? 'not requested in this run'
          : recs.length === 0
            ? (mine.find((g) => g.cannotWrite)?.cannotWrite ? `writer declined: ${mine.find((g) => g.cannotWrite)!.cannotWrite}` : 'writer returned nothing usable')
            : 'all attempts rejected';
    return { subject: k.subject, skill: k.title, objectiveLoId: k.objectiveLoId, objective: k.description, kind: k.kind, reason, attempts: recs.length, rejections: t.countBy(recs, (r) => (r.reason === 'quality' ? `quality: ${r.detail}` : r.reason)) };
  });
  fs.writeFileSync(path.join(a.out, 'still-empty.json'), JSON.stringify({ total: stillEmpty.length, byReason: t.countBy(stillEmpty, (e) => e.reason.replace(/[:(—].*$/, '').trim()), objectives: stillEmpty }, null, 2));

  // Funnel + cost.
  const items = gens.flatMap((g) => g.items);
  const recs = items.map((i) => audit.get(i.id)).filter((r): r is FigureAuditRecord => !!r);
  const log = gens.flatMap((g) => g.log);
  const refs = new Set([...gens.map((g) => g.objectiveLoId), ...items.map((i) => i.id)]);
  const ledgerFile = a.ledger ?? path.join(a.out, 'ledger.jsonl');
  const cost = t.ledgerTotals(ledgerFile, ['figure-generate', 'figure-audit', 'figure-audit-stem-alone', 'audit'], refs);
  const accepted = recs.filter((r) => r.verdict === 'ACCEPTED');
  const requested = targets.reduce((n, x) => n + x.n, 0);
  const funnel = {
    objectives: targets.length,
    requested,
    writerReplies: { itemsWritten: log.length, byOutcome: t.countBy(log, (l) => `attempt ${l.attempt}: ${l.outcome}`), objectivesNeedingFollowUp: gens.filter((g) => g.attempts > 1).length, declined: gens.filter((g) => g.cannotWrite).length },
    generated: items.length,
    checked: recs.length,
    byPass: Object.fromEntries(dirs.map((d) => {
      const g = generatedObjectives(d, t);
      const r = g.flatMap((x) => x.items).map((i) => audit.get(i.id)).filter((x): x is FigureAuditRecord => !!x);
      const tg = t.readJsonl<FigureTarget>(path.join(d, 'targets.jsonl'));
      return [path.basename(d), {
        objectives: tg.length, requested: tg.reduce((n, x) => n + x.n, 0), writerItems: t.countBy(g.flatMap((x) => x.log), (l) => l.outcome), generated: g.flatMap((x) => x.items).length,
        rejectedAtChecks: t.countBy(r.filter((x) => x.verdict === 'REJECTED' && x.gate === 'checks'), (x) => x.reason),
        rejectedAtQuality: r.filter((x) => x.reason === 'quality').length, droppedAsSameTask: r.filter((x) => x.reason === 'same_task_as_better').length,
        rejectedAtKey: t.countBy(r.filter((x) => x.verdict === 'REJECTED' && x.gate === 'key'), (x) => x.reason), errors: r.filter((x) => x.verdict === 'ERROR').length,
        accepted: r.filter((x) => x.verdict === 'ACCEPTED').length,
      }];
    })),
    rejectedAtChecks: t.countBy(recs.filter((r) => r.verdict === 'REJECTED' && r.gate === 'checks'), (r) => r.reason),
    rejectedAtQuality: recs.filter((r) => r.verdict === 'REJECTED' && r.gate === 'quality').length,
    qualityRejectedByCheck: t.countBy(recs.flatMap((r) => (r.reason === 'quality' ? t.rejectedFlags(r.quality) : [])), (f) => f.id),
    droppedAsSameTask: recs.filter((r) => r.reason === 'same_task_as_better').length,
    rejectedAtKey: t.countBy(recs.filter((r) => r.verdict === 'REJECTED' && r.gate === 'key'), (r) => r.reason),
    errors: recs.filter((r) => r.verdict === 'ERROR').length,
    accepted: accepted.length,
    acceptedDerived: { true: accepted.filter((r) => r.figure?.derived).length, false: accepted.filter((r) => !r.figure?.derived).length },
    acceptedByKind: t.countBy(accepted, (r) => r.figure?.kind ?? '?'),
    acceptedBySubject: t.countBy(accepted, (r) => r.subject ?? '?'),
    objectivesWithAnAcceptedItem: new Set(accepted.map((r) => r.objectiveLoId)).size,
    tiebreaks: recs.filter((r) => r.tiebreak).length,
  };
  const allCalls = readLedger(ledgerFile);
  const summary = {
    funnel,
    cost: { thisRun: cost, wholeLedgerUsd: Math.round(allCalls.reduce((s, r) => s + r.costUsd, 0) * 1e4) / 1e4, perObjectiveUsd: targets.length ? Math.round((cost.totalUsd / targets.length) * 1e4) / 1e4 : 0, perAcceptedItemUsd: accepted.length ? Math.round((cost.totalUsd / accepted.length) * 1e4) / 1e4 : null },
  };
  fs.writeFileSync(path.join(a.out, 'summary.json'), JSON.stringify(summary, null, 2));

  const kept = cards.filter((c) => c.accepted);
  const lost = cards.filter((c) => !c.accepted);
  fs.writeFileSync(path.join(a.out, 'review.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Practice questions with a figure — review</title>
<style>
  body { margin: 0; padding: 24px 16px 64px; background: #f1f5f9; color: #0f172a; font: 15px/1.5 system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  h1 { font-size: 22px; margin: 0 0 4px; } h1 + p, .lead { color: #475569; max-width: 900px; margin: 0 0 16px; }
  .part { font-size: 18px; margin: 28px 0 12px; }
  .card { background: #fff; border: 1px solid #cbd5e1; border-left-width: 5px; border-radius: 8px; padding: 14px 16px; margin: 0 0 18px; max-width: 1100px; }
  .card.ok { border-left-color: #15803d; } .card.no { border-left-color: #b91c1c; }
  .card h2 { font-size: 15px; margin: 0 0 4px; } .kind { color: #1d4ed8; font-weight: 500; }
  .v-ok { color: #15803d; } .v-no { color: #b91c1c; }
  .obj { margin: 0 0 10px; color: #334155; }
  .row { display: flex; flex-wrap: wrap; gap: 20px; align-items: flex-start; }
  .fig { width: 340px; max-width: 100%; flex: none; border: 1px dashed #94a3b8; } .fig svg { display: block; width: 100%; height: auto; }
  .q { flex: 1 1 380px; min-width: 0; } .q p { margin: 0 0 6px; } .q ol { margin: 0 0 8px; padding-left: 26px; }
  li.key { font-weight: 600; color: #15803d; }
  .ev, .small { font-size: 13px; color: #475569; } .verdict { margin-top: 8px; } .err { color: #b91c1c; padding: 10px; }
  details { margin-top: 8px; font-size: 13px; } pre { background: #f8fafc; padding: 10px; overflow: auto; border-radius: 6px; white-space: pre-wrap; }
</style></head><body>
<h1>Practice questions with a figure — review</h1>
<p class="lead">${targets.length} objectives · ${requested} questions asked for · ${items.length} written · ${kept.length} kept · ${lost.length} not kept. Each figure is drawn by the engine's authoring renderer from the stored specification and shown here at 340 px, the width of a phone column. Every question went through: rules on the question and on the figure; the answer recomputed from the figure's specification by a program wherever a checker exists ("derived: true"); a quality review by two AI reviewers; and an answer check by two AI checkers who were given a program-made transcription of the figure and never the stored answer. Nothing here has been added to the product. Generated ${new Date().toISOString().slice(0, 10)}.</p>
<h2 class="part">Kept (${kept.length})</h2>
${kept.map((c) => c.html).join('\n') || '<p>None.</p>'}
<h2 class="part">Not kept (${lost.length})</h2>
${lost.map((c) => c.html).join('\n') || '<p>None.</p>'}
</body></html>
`);
  fs.writeFileSync(path.join(a.out, 'rejected.md'), ['# Practice questions with a figure that were NOT kept', '', `${lost.length} of ${items.length} questions written. The kept ones are in review.html.`, '', ...(rejected.length ? rejected : ['None.', ''])].join('\n'));

  // One PNG per item that could be drawn, for reading by eye.
  let wrote = 0;
  try {
    type Sharp = (input: Buffer, opts?: { density?: number }) => { resize(o: { width: number }): { png(): { toFile(p: string): Promise<unknown> } } };
    const mod = (await import('sharp')) as unknown as { default?: Sharp };
    const sharp = (mod.default ?? (mod as unknown as Sharp)) as Sharp;
    fs.mkdirSync(pngDir, { recursive: true });
    for (const { id, svg } of pngs) {
      await sharp(Buffer.from(svg), { density: 192 }).resize({ width: PNG_WIDTH }).png().toFile(path.join(pngDir, `${id}.png`));
      wrote++;
    }
  } catch (e) {
    console.error(`PNGs incomplete — ${(e as Error).message}`);
  }
  console.log(JSON.stringify(summary, null, 1));
  console.log(`figure-export: ${rows.length} accepted row(s) → ${dir}; review.html, rejected.md, ${wrote} PNG(s) → ${a.out} (nothing was seeded)`);
}

/**
 * Skill practice coverage — for each generated-course skill (a plan whose
 * first LO is a skill handle, practice.ts `isSkillScopePlan`), how many
 * practice items are servable from each of its objectives, and which
 * objectives have none.
 *
 * Input is plain data in the shape of the stored Mongo documents (a
 * LessonPlan dump and a ProblemBank dump). Nothing here opens a database or
 * calls a model: the documents are wrapped in an in-memory `PracticeSources`
 * and run through the REAL `retrievePractice`, so every serving rule
 * (withdrawn, key check, drawing-only, essay node, partner stamp, audited-only
 * generated rows and lesson steps, the skill-scope kill switch) is the
 * engine's own, not a copy. Generation never runs (`NO_GEN_SOURCES`).
 *
 * Not modelled: the production bank query's 50-row limit per LO, and a
 * difficulty filter (coverage counts every difficulty).
 *
 * `auditedOnly` reports what a partner on PRACTICE_GEN_AUDITED_ONLY_PARTNERS
 * would be served: the switch is set to the caller's partner for the duration
 * of the call and restored afterwards (and cleared for the call when
 * `auditedOnly` is false, so the ambient environment never changes a report).
 */
import type { PracticeItem } from '@evelyn/portal-contract/v1';
import {
  retrievePractice,
  classifyPrivatePlan,
  isSkillScopePlan,
  isStudentOwnedPlan,
  segmentOwnerLoId,
  type BankLite,
  type PlanLite,
  type PracticeSources,
} from './practice';
import { AUDITED_ONLY_PARTNERS_ENV } from './audited-items';
import { NO_GEN_SOURCES } from '../practice-assign/resolve';

export interface CoverageInput {
  /** LessonPlan documents (`_id` or `id`, `title`, `topic`, `los[]`, `segments[]`, `metadata`). */
  plans: readonly unknown[];
  /** ProblemBank documents (`id`, `loId`, `problemText`, `answer`, …). */
  bank: readonly unknown[];
}

export interface CoverageOptions {
  /** The partner the report is for. Omitted ⇒ each plan is read as its own
   *  stamped partner (`metadata.portalPartnerId`) would be served it. */
  partnerId?: string;
  /** Apply the audited-only rules (generated rows + lesson steps) for the caller. */
  auditedOnly?: boolean;
  /** Restrict the report to these skill LO ids (the course nodes' `loId`). */
  skillLoIds?: readonly string[];
}

export interface ObjectiveCoverage {
  loId: string;
  description?: string;
  /** try_yourself segments the plan holds for this objective (before any filter). */
  authoredSteps: number;
  /** Items servable for this objective. */
  servable: number;
  servableSteps: number;
  servableBank: number;
  itemIds: string[];
}

export interface SkillCoverage {
  skillLoId: string;
  planId: string;
  title?: string;
  partnerId?: string;
  objectives: ObjectiveCoverage[];
  servable: number;
  /** LO ids of the objectives with zero servable items. */
  zeroObjectives: string[];
}

type Doc = Record<string, unknown>;
const str = (v: unknown): string | undefined => (typeof v === 'string' && v.length > 0 ? v : undefined);
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

/** A stored LessonPlan document → the retrieval projection (adapters.ts
 *  `toPlanLite`, over a raw document). Null when it has no id or no LOs. */
export function planLiteFromDoc(doc: unknown): (PlanLite & { loDescriptions: Map<string, string> }) | null {
  const d = doc as Doc | null;
  if (!d || typeof d !== 'object') return null;
  const id = str(d.id) ?? str(d._id);
  const los = arr(d.los).filter((l): l is Doc => !!l && typeof l === 'object' && typeof (l as Doc).id === 'string');
  if (!id || los.length === 0) return null;
  const metadata = d.metadata && typeof d.metadata === 'object' ? (d.metadata as Doc) : undefined;
  const loDescriptions = new Map<string, string>();
  for (const l of los) if (str(l.description)) loDescriptions.set(l.id as string, l.description as string);
  return {
    id,
    title: str(d.title),
    topic: str(d.topic),
    partnerId: str(metadata?.portalPartnerId)?.trim() || undefined,
    privateKind: classifyPrivatePlan(id, metadata),
    ...(isStudentOwnedPlan(metadata) ? { studentOwned: true } : {}),
    los: los.map((l) => ({ id: l.id as string, standard: str(l.standard) })),
    segments: arr(d.segments)
      .filter((s): s is Doc => !!s && typeof s === 'object' && typeof (s as Doc).id === 'string')
      .map((s) => {
        const choices = Array.isArray(s.choices) && s.choices.length > 0 ? (s.choices as PlanLite['segments'][number]['choices']) : undefined;
        const rf = s.responseFormat;
        return {
          kind: String(s.kind ?? ''),
          id: s.id as string,
          problem: str(s.problem),
          expectedAnswer: str(s.expectedAnswer),
          hints: Array.isArray(s.hints) ? (s.hints as string[]) : [],
          responseFormat: rf === 'mcq' || rf === 'frq' || rf === 'numeric' || rf === 'free' ? rf : choices ? 'mcq' : 'free',
          choices,
          offTopic: s.offTopic === true,
          ...(s.keyCheck && typeof s.keyCheck === 'object' ? { keyCheck: s.keyCheck as { status: string } } : {}),
        };
      }),
    loDescriptions,
  };
}

function bankLiteFromDoc(doc: unknown): BankLite | null {
  const d = doc as Doc | null;
  if (!d || typeof d !== 'object') return null;
  const id = str(d.id);
  // Same exclusions as the production query (adapters.ts): no mock-form rows,
  // no live-session `brain-gen.*` rows.
  if (!id || d.bankScope === 'mock' || id.startsWith('brain-gen.')) return null;
  const rf = d.responseFormat;
  const diff = d.difficulty;
  return {
    id,
    problemText: str(d.problemText) ?? '',
    answer: str(d.answer) ?? '',
    ...(Array.isArray(d.hints) ? { hints: d.hints as string[] } : {}),
    ...(rf === 'mcq' || rf === 'frq' || rf === 'numeric' || rf === 'free' ? { responseFormat: rf } : {}),
    ...(Array.isArray(d.choices) && d.choices.length > 0 ? { choices: d.choices as string[] } : {}),
    ...(diff === 1 || diff === 2 || diff === 3 || diff === 4 ? { difficulty: diff } : {}),
    ...(str(d.loId) ? { loId: d.loId as string } : {}),
    ...(str(d.cedCode) ? { cedCode: d.cedCode as string } : {}),
  };
}

/** Per-skill coverage for every skill plan in the input (plan order). */
export async function skillCoverage(input: CoverageInput, opts: CoverageOptions = {}): Promise<SkillCoverage[]> {
  const plans = input.plans.map(planLiteFromDoc).filter((p): p is NonNullable<ReturnType<typeof planLiteFromDoc>> => p !== null);
  const bank = input.bank.map(bankLiteFromDoc).filter((b): b is BankLite => b !== null);
  const bankLoOf = new Map(bank.map((b) => [b.id, b.loId]));
  const sources: PracticeSources = {
    plansForLoId: async (loId) => plans.filter((p) => p.privateKind !== 'review' && p.los.some((l) => l.id === loId)),
    plansForTopic: async () => [],
    bankForLoId: async (loId) => bank.filter((b) => b.loId === loId),
    bankForTopic: async () => [],
  };
  const only = opts.skillLoIds ? new Set(opts.skillLoIds) : null;
  const out: SkillCoverage[] = [];
  const savedEnv = process.env[AUDITED_ONLY_PARTNERS_ENV];
  const savedLog = console.log;
  console.log = () => {}; // the retrieval logs one line per skipped item
  try {
    for (const plan of plans) {
      const skillLoId = plan.los[0].id;
      if (!isSkillScopePlan(plan, skillLoId)) continue;
      if (only && !only.has(skillLoId)) continue;
      const partnerId = opts.partnerId ?? plan.partnerId;
      if (opts.auditedOnly) {
        if (!partnerId) throw new Error(`audited-only coverage needs a partner: plan ${plan.id} carries no partner stamp and none was given`);
        process.env[AUDITED_ONLY_PARTNERS_ENV] = partnerId;
      } else {
        delete process.env[AUDITED_ONLY_PARTNERS_ENV];
      }
      const res = await retrievePractice(
        { studentId: 'coverage', courseId: 'coverage', scope: { loId: skillLoId }, count: 100_000 },
        sources,
        NO_GEN_SOURCES,
        partnerId ? { partnerId } : undefined,
      );
      const objectiveIds = [...new Set(plan.los.map((l) => l.id))];
      const byObjective = new Map<string, PracticeItem[]>(objectiveIds.map((o) => [o, []]));
      for (const it of res.items) {
        const sep = it.id.indexOf('::');
        const objective = it.source === 'plan-try-yourself' && sep >= 0
          ? segmentOwnerLoId(plan.los, it.id.slice(sep + 2))
          : bankLoOf.get(it.id);
        const key = objective && byObjective.has(objective) ? objective : skillLoId;
        (byObjective.get(key) as PracticeItem[]).push(it);
      }
      const objectives: ObjectiveCoverage[] = objectiveIds.map((loId) => {
        const items = byObjective.get(loId) as PracticeItem[];
        const steps = items.filter((it) => it.source === 'plan-try-yourself').length;
        return {
          loId,
          ...(plan.loDescriptions.get(loId) ? { description: plan.loDescriptions.get(loId) } : {}),
          authoredSteps: plan.segments.filter((sg) => sg.kind === 'try_yourself' && segmentOwnerLoId(plan.los, sg.id) === loId).length,
          servable: items.length,
          servableSteps: steps,
          servableBank: items.length - steps,
          itemIds: items.map((it) => it.id),
        };
      });
      out.push({
        skillLoId,
        planId: plan.id as string,
        ...(plan.title ? { title: plan.title } : {}),
        ...(partnerId ? { partnerId } : {}),
        objectives,
        servable: res.items.length,
        zeroObjectives: objectives.filter((o) => o.servable === 0).map((o) => o.loId),
      });
    }
  } finally {
    console.log = savedLog;
    if (savedEnv === undefined) delete process.env[AUDITED_ONLY_PARTNERS_ENV];
    else process.env[AUDITED_ONLY_PARTNERS_ENV] = savedEnv;
  }
  return out;
}

/** One-screen totals for a coverage report. Pure. */
export function summarizeCoverage(rows: readonly SkillCoverage[]): {
  skills: number;
  objectives: number;
  servable: number;
  objectivesWithZero: number;
  skillsWithAZeroObjective: number;
  skillsWithNothing: number;
} {
  return {
    skills: rows.length,
    objectives: rows.reduce((n, r) => n + r.objectives.length, 0),
    servable: rows.reduce((n, r) => n + r.servable, 0),
    objectivesWithZero: rows.reduce((n, r) => n + r.zeroObjectives.length, 0),
    skillsWithAZeroObjective: rows.filter((r) => r.zeroObjectives.length > 0).length,
    skillsWithNothing: rows.filter((r) => r.servable === 0).length,
  };
}

/**
 * Phase 4 — concrete data adapters for the portal endpoints.
 *
 * Bridges the pure cores (practice retrieval, grading) to the real data
 * stores: curated lesson-plan seeds for try-yourselves, ProblemBank for bank
 * items. DB failures degrade gracefully (empty bank → plan-only results).
 */

import connectDB from '@/lib/db';
import { ProblemBank, type IProblemBank } from '@/models/ProblemBank';
import { SEED_PLANS } from '@/lib/tutor/lesson-plan/store';
import type { LessonPlan, SegmentTryYourself } from '@/lib/tutor/lesson-plan/types';
import type { PracticeSources, PlanLite, BankLite } from './practice';
import type { GradeItem } from './grade-free-response';
import { resolvePassage } from '@/lib/tutor/passages/store';
import type { FrqRubric } from '@evelyn/portal-contract/v1';

type Difficulty = 1 | 2 | 3 | 4;

function toPlanLite(plan: LessonPlan): PlanLite {
  return {
    id: plan.id,
    los: plan.los.map((l) => ({ id: l.id, standard: l.standard })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    segments: plan.segments.map((s: any) => ({
      kind: s.kind,
      id: s.id,
      problem: s.problem,
      expectedAnswer: s.expectedAnswer,
      hints: s.hints,
      responseFormat: s.responseFormat,
      choices: s.choices,
      offTopic: s.offTopic,
    })),
  };
}

function toBankLite(b: IProblemBank): BankLite {
  return {
    id: b.id,
    problemText: b.problemText,
    answer: b.answer,
    hints: b.hints,
    responseFormat: b.responseFormat,
    choices: b.choices,
    difficulty: b.difficulty,
    loId: b.loId,
    cedCode: b.cedCode,
  };
}

async function safeBankQuery(filter: Record<string, unknown>): Promise<BankLite[]> {
  try {
    await connectDB();
    const rows = (await ProblemBank.find(filter).limit(50).lean()) as unknown as IProblemBank[];
    return rows.map(toBankLite);
  } catch {
    return [];
  }
}

/** Production practice sources: curated seeds + ProblemBank. */
export function mongoPracticeSources(): PracticeSources {
  return {
    async plansForLoId(loId) {
      return SEED_PLANS.filter((p) => p.los.some((l) => l.id === loId)).map(toPlanLite);
    },
    async plansForTopic(topicId) {
      return SEED_PLANS.filter((p) => p.topic === topicId).map(toPlanLite);
    },
    async bankForLoId(loId, difficulty?: Difficulty) {
      const filter: Record<string, unknown> = { loId };
      if (difficulty) filter.difficulty = difficulty;
      return safeBankQuery(filter);
    },
    async bankForTopic(topicId, difficulty?: Difficulty) {
      const filter: Record<string, unknown> = { $or: [{ topic: topicId }, { topicId }] };
      if (difficulty) filter.difficulty = difficulty;
      return safeBankQuery(filter);
    },
  };
}

/** Split a qualified plan-try-yourself item id (`${planId}::${segmentId}`).
 *  Bank item ids (e.g. `apstats.correlation.mcq.01`) have no `::` → null. */
function splitQualifiedItemId(itemId: string): { planId: string; segId: string } | null {
  const i = itemId.indexOf('::');
  if (i < 0) return null;
  return { planId: itemId.slice(0, i), segId: itemId.slice(i + 2) };
}

/** Resolve the try-yourself segment for a qualified plan-TY item id — scoped to
 *  the NAMED plan (segment ids are not globally unique, so a whole-corpus scan
 *  returns the wrong plan's answer key). Returns null when unqualified or the
 *  plan/segment is gone. */
function resolveTrySegment(itemId: string): SegmentTryYourself | null {
  const q = splitQualifiedItemId(itemId);
  if (!q) return null;
  const plan = SEED_PLANS.find((p) => p.id === q.planId);
  if (!plan) return null;
  for (const seg of plan.segments) {
    if (seg.id === q.segId && seg.kind === 'try_yourself') return seg;
  }
  return null;
}

/** Resolve a `passageId` (and/or a Synthesis `passageIds[]` packet) to the full
 *  stimulus text, undefined when absent or unknown. Shared by both GradeItem
 *  producers below so passage-aware grading (grade-free-response.ts) actually
 *  sees the stimulus text. Multiple sources are labeled Source A/B/C and joined
 *  so the grader can verify cross-source synthesis. */
function resolvePassageText(passageId?: string, passageIds?: string[]): string | undefined {
  const ids = [...(passageId ? [passageId] : []), ...(passageIds ?? [])];
  if (ids.length === 0) return undefined;
  const multi = ids.length > 1;
  const chunks = ids
    .map((id, i) => {
      const p = resolvePassage(id);
      if (!p) return undefined;
      const label = multi ? `Source ${String.fromCharCode(65 + i)} — ${p.title} (${p.author}):\n` : '';
      return label + p.fullText;
    })
    .filter((c): c is string => Boolean(c));
  return chunks.length ? chunks.join('\n\n---\n\n') : undefined;
}

/** Resolve a gradable FRQ item by id from the curated try-yourself seeds.
 *  Item ids are plan-qualified (`${planId}::${segmentId}`) so the answer key
 *  resolves to the exact authoring plan. A segment with no rubric grades via
 *  the legacy single-answer path. */
export function resolveGradeItem(itemId: string): GradeItem | null {
  const seg = resolveTrySegment(itemId);
  if (!seg) return null;
  return {
    itemId,
    rubric: seg.rubric,
    expectedAnswer: seg.expectedAnswer,
    modelResponse: seg.modelResponse,
    passageText: resolvePassageText(seg.passageId, seg.passageIds),
  };
}

/** Answer key for grading an assessment item, resolved statelessly by id from
 *  the curated try-yourself seeds or ProblemBank. The key NEVER leaves the
 *  engine (it is not part of AssessmentItem sent to the portal). */
export interface ResolvedAssessmentKey {
  responseFormat?: 'mcq' | 'frq' | 'numeric' | 'free';
  expectedAnswer?: string;
  choices?: Array<{ id: string; text: string }>;
  correctChoiceId?: string;
  /** Present on rubric-bearing FRQs → part-by-part partial-credit grading in a
   *  scored quiz (v1.4.0). Absent → the legacy single-answer judge path. */
  rubric?: FrqRubric;
  /** Optional reference (full-credit) solution for the legacy judge path. */
  modelResponse?: string;
  /** Item hints — used to synthesize a short review rationale (never sent as an
   *  answer key; only a derived feedback string reaches the portal). */
  hints?: string[];
  /** Resolved stimulus text (from passageId) — threaded into gradeFreeResponse
   *  so a scored-quiz FRQ gets the same passage-aware grading as the
   *  standalone /grade endpoint (grade-free-response.ts). */
  passageText?: string;
}

export async function resolveAssessmentItem(itemId: string): Promise<ResolvedAssessmentKey | null> {
  // Qualified id (`planId::segId`) → a plan try-yourself, scoped to the exact
  // authoring plan (carry expectedAnswer + {id,text,correct?} choices). A
  // qualified id is definitively a plan item, so never fall through to the bank.
  if (splitQualifiedItemId(itemId)) {
    const seg = resolveTrySegment(itemId);
    if (!seg) return null;
    return {
      responseFormat: seg.responseFormat,
      expectedAnswer: seg.expectedAnswer,
      choices: seg.choices?.map((c) => ({ id: c.id, text: c.text })),
      correctChoiceId: seg.choices?.find((c) => c.correct)?.id,
      rubric: seg.rubric,
      modelResponse: seg.modelResponse,
      hints: seg.hints,
      passageText: resolvePassageText(seg.passageId, seg.passageIds),
    };
  }
  // Bare id → ProblemBank (globally-unique ids; choices are string[]; the
  // reference `answer` is the key). No cross-plan scan (that mis-resolved keys).
  try {
    await connectDB();
    const b = (await ProblemBank.findOne({ id: itemId }).lean()) as unknown as IProblemBank | null;
    if (b) {
      const choices = b.choices?.map((t, i) => ({ id: String.fromCharCode(65 + i), text: t }));
      // Bank MCQs store the correct choice LETTER in `answer`. Surface it as
      // correctChoiceId when it's a valid bare letter within range so MCQ
      // grading is as robust as the plan-try-yourself path (assessment.ts
      // matches letter OR the correct choice's text).
      let correctChoiceId: string | undefined;
      if (b.responseFormat === 'mcq' && choices && /^[A-E]$/i.test((b.answer ?? '').trim())) {
        const id = b.answer.trim().toUpperCase();
        if (choices.some((c) => c.id === id)) correctChoiceId = id;
      }
      return {
        responseFormat: b.responseFormat,
        expectedAnswer: b.answer,
        choices,
        correctChoiceId,
        hints: b.hints,
        passageText: resolvePassageText(b.passageId),
      };
    }
  } catch {
    // DB unavailable — fall through.
  }
  return null;
}

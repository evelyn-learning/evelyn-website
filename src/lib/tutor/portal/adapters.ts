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
import type { LessonPlan } from '@/lib/tutor/lesson-plan/types';
import type { PracticeSources, PlanLite, BankLite } from './practice';
import type { GradeItem } from './grade-free-response';
import type { FrqRubric } from '@evelyn/portal-contract/v1';

type Difficulty = 1 | 2 | 3 | 4;

function toPlanLite(plan: LessonPlan): PlanLite {
  return {
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

/** Resolve a gradable FRQ item by id from the curated try-yourself seeds.
 *  (Authored rubric-bearing FRQs are fixtures in the content workstream; a
 *  segment with no rubric grades via the legacy single-answer path.) */
export function resolveGradeItem(itemId: string): GradeItem | null {
  for (const plan of SEED_PLANS) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const seg of plan.segments as any[]) {
      if (seg.id === itemId && seg.kind === 'try_yourself') {
        return {
          itemId,
          rubric: seg.rubric,
          expectedAnswer: seg.expectedAnswer,
          modelResponse: seg.modelResponse,
        };
      }
    }
  }
  return null;
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
}

export async function resolveAssessmentItem(itemId: string): Promise<ResolvedAssessmentKey | null> {
  // Plan try-yourselves (carry expectedAnswer + {id,text,correct?} choices).
  for (const plan of SEED_PLANS) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const seg of plan.segments as any[]) {
      if (seg.id === itemId && seg.kind === 'try_yourself') {
        return {
          responseFormat: seg.responseFormat,
          expectedAnswer: seg.expectedAnswer,
          choices: seg.choices?.map((c: { id: string; text: string }) => ({ id: c.id, text: c.text })),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          correctChoiceId: seg.choices?.find((c: any) => c.correct)?.id,
          rubric: seg.rubric,
          modelResponse: seg.modelResponse,
        };
      }
    }
  }
  // ProblemBank (choices are string[]; the reference `answer` is the key).
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
      };
    }
  } catch {
    // DB unavailable — fall through.
  }
  return null;
}

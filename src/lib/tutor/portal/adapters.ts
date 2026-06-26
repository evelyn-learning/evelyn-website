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

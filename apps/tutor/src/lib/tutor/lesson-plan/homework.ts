/**
 * Homework-help mode: wrap a student's own enumerated problems (see
 * `enumerate-problems.ts`) into the fields a `LessonPlan` needs so the
 * existing orchestrator can drive a session over them, one at a time,
 * instead of a freestyle-generated lesson about the topic.
 *
 * The plan built around these fields carries exactly ONE learning
 * objective — a wrapper LO standing in for "work through what you
 * brought" — because homework-help isn't teaching a concept the plan
 * decomposes into several LOs; it's a single activity over externally
 * supplied problems. The problems themselves live in `metadata.problems`
 * (read back via `homeworkProblemsOf`), not as separate LOs or segments,
 * so Task 4/5 can build whatever segment shape they need from the same
 * source list without this module guessing at it.
 */

import type { HomeworkProblem } from './enumerate-problems';
import type { LearningObjective } from './types';

/** `metadata.kind` marking a plan as homework-help, read by consumers
 *  that need to branch on it (the brain block, the client). */
export const HOMEWORK_PLAN_KIND = 'homework-help' as const;

/**
 * The wrapper LO shape a homework plan's `los[0]` takes — every field
 * `parseStage1Los` (generate-from-text.ts:211-227) fills on a normal
 * generated LO, plus `estimatedMinutes` since this LO stands in for the
 * plan's one and only activity rather than one of several.
 */
export interface LessonPlanLo extends LearningObjective {
  estimatedMinutes: number;
}

/** Suffix of a homework plan's single wrapper LO id. */
export const HOMEWORK_LO_ID_SUFFIX = 'homework-lo-1' as const;

/** The plan-scoped wrapper LO id for a homework plan. */
export function homeworkLoIdFor(planId: string): string {
  return `${planId}.${HOMEWORK_LO_ID_SUFFIX}`;
}

/** Fixed time budget for the wrapper LO — homework-help is one activity,
 *  not a paced multi-LO lesson, so this is a reasonable single estimate
 *  rather than a per-problem sum. */
const HOMEWORK_LO_ESTIMATED_MINUTES = 30;

export interface HomeworkPlanMetadata {
  kind: typeof HOMEWORK_PLAN_KIND;
  problems: HomeworkProblem[];
}

export interface HomeworkPlanFields {
  metadata: HomeworkPlanMetadata;
  los: [LessonPlanLo];
}

/**
 * Read the enumerated problems back off a plan, or null when the plan
 * isn't homework-help (or the field is missing/malformed). Pure — takes
 * only the `metadata` slice a caller has, so it works on a `LessonPlan`,
 * a partial plan under construction, or a plain object off the wire.
 */
export function homeworkProblemsOf(plan: { metadata?: Record<string, unknown> }): HomeworkProblem[] | null {
  const problems = plan.metadata?.problems;
  if (!Array.isArray(problems) || problems.length === 0) return null;
  const out: HomeworkProblem[] = [];
  for (const p of problems) {
    if (!p || typeof p !== 'object') continue;
    const it = p as Record<string, unknown>;
    if (typeof it.n !== 'number' || typeof it.text !== 'string' || !it.text.trim()) continue;
    out.push({ n: it.n, text: it.text });
  }
  return out.length > 0 ? out : null;
}

/**
 * Build the `metadata` and `los` fields a homework-help `LessonPlan`
 * needs. The caller (Task 4's plan-generate route) spreads these into a
 * full `LessonPlan` alongside `id` / `title` / `curriculum` / `grade` /
 * `subject` / `segments` / `schemaVersion` — this module only owns the
 * two fields that are specific to homework-help.
 */
export function buildHomeworkPlanFields(
  problems: HomeworkProblem[],
  topicSummary: string,
  planId: string,
): HomeworkPlanFields {
  const lo: LessonPlanLo = {
    // Namespaced under the plan id (like generated LOs, `${planId}.lo-N`):
    // everything downstream keys on the LO id — stored-plan lookup by LO,
    // practice derivedTopic, bank items, evidence events, learner-model
    // mastery — so a fixed literal would pool every homework plan's
    // evidence and bank items under one key.
    id: homeworkLoIdFor(planId),
    description: 'Work the uploaded problems in order.',
    shortTitle: topicSummary,
    estimatedMinutes: HOMEWORK_LO_ESTIMATED_MINUTES,
  };
  return {
    metadata: { kind: HOMEWORK_PLAN_KIND, problems },
    los: [lo],
  };
}

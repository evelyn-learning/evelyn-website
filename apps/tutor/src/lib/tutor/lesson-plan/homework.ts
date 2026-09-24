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

import type { HomeworkProblem, EnumerateResult } from './enumerate-problems';
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

/** Round 3 (A1, 2026-09-23 live check): a homework-help upload is extracted but
 *  never classified — the classifier judged a real 10-problem worksheet
 *  `unusable` and 422'd it. Extraction failures still refuse. Every other goal
 *  keeps the classifier gate unchanged. */
export function shouldClassifyMaterial(goal: string | undefined): boolean {
  return goal !== HOMEWORK_PLAN_KIND;
}

export type HomeworkPlanDecision =
  | { kind: 'homework'; problems: HomeworkProblem[] }
  | { kind: 'normal'; reason: 'enumeration_failed_open' };

/** Round 3 (A2): only a REAL enumeration makes a homework plan. A fail-open
 *  result (typed concept question, unusable text) is one "problem" holding the
 *  whole input, which produced a one-problem plan with no practice — those
 *  requests take the normal topic path instead. */
export function homeworkPlanDecision(r: EnumerateResult): HomeworkPlanDecision {
  if (r.failedOpen || r.problems.length === 0) return { kind: 'normal', reason: 'enumeration_failed_open' };
  return { kind: 'homework', problems: r.problems };
}

const LIST_MARKER = /(?:^|\s)(?:\d{1,2}|[a-hA-H])[.)]\s/g;
const OPERATOR = /[=<>+−×÷/^]/;

/** Round 4 (E1, 2026-09-24 live check): typed homework-help text is only worth
 *  a problem split when it LOOKS like problems — ≥2 lines, a numbered/lettered
 *  list, digits with an operator/relation, or ≥2 questions. A plain topic or
 *  single question skips the extra Haiku call (it pushed typed starts past the
 *  portal's timeout) and goes straight to normal generation. Pure. */
export function hasProblemSignals(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (t.split(/\r?\n/).filter((l) => l.trim()).length >= 2) return true;
  if ((t.match(LIST_MARKER) ?? []).length >= 2) return true;
  if (/\d/.test(t) && OPERATOR.test(t)) return true;
  return (t.match(/\?/g) ?? []).length >= 2;
}

/** Final fix wave (I2): a host may prefix the typed request with its own
 *  focus preamble (multi-line objective bullets) and end with
 *  `Topic: <topic>`. The preamble is the host's instruction, not the
 *  student's problems — keep only what follows the LAST `\nTopic: ` marker.
 *  No marker ⇒ unchanged. Pure. */
const TOPIC_MARKER = '\nTopic: ';
export function stripFocusPreamble(text: string): string {
  const i = text.lastIndexOf(TOPIC_MARKER);
  return i >= 0 ? text.slice(i + TOPIC_MARKER.length) : text;
}

/** Final fix wave (I2): what typed homework enumeration looks at — the
 *  request's own `topic` (the student's / normalised topic) when present,
 *  else the typed text with any focus preamble stripped. Pure. */
export function typedEnumerationText(requestTopic: string | undefined, text: string): string {
  return requestTopic?.trim() || stripFocusPreamble(text);
}

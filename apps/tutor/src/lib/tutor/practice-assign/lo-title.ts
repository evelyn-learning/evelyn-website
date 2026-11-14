/**
 * The title a practice assignment gives an objective (assign.ts), which is also what the bank picks items by.
 * A one-problem homework plan's only objective is "Work problem 3": practice on that would be on nothing. Its
 * title is the problem itself, without the photo read's figure description (GAC homework on v2, 2026-11-14).
 */
import { homeworkProblemOf, problemTextForDisplay } from '../lesson-plan/homework-problem-meta';
import type { LessonPlan } from '../lesson-plan/types';

export const PRACTICE_PROBLEM_TITLE_MAX = 160;

export function practiceLoTitle(plan: Pick<LessonPlan, 'los' | 'metadata'> | null | undefined, loId: string): string {
  const hp = homeworkProblemOf(plan as { metadata?: Record<string, unknown> } | null);
  if (hp) return problemTextForDisplay(hp.text).replace(/\s+/g, ' ').trim().slice(0, PRACTICE_PROBLEM_TITLE_MAX) || loId;
  const lo = plan?.los.find((l) => l.id === loId);
  return lo?.shortTitle ?? lo?.description ?? loId;
}

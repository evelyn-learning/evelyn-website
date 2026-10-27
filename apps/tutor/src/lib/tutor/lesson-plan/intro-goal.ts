// src/lib/tutor/lesson-plan/intro-goal.ts
/**
 * How a generated plan's intro segment starts the lesson.
 *
 * WHY (lesson portal-939d545b, Haiku 5.5, 2026-10-27): the intro goal said
 * "… and propose starting with the first one", and the opener asked "Which of
 * the four objectives do you want to start with, or shall we take the first
 * one as planned?" — the student, not knowing, asked to be told. The plan's
 * order is the order: the intro says it is starting with the first one.
 * Plans already stored carry the old clause, so it is rewritten where the
 * segment reaches the brain (lesson-plan/context.ts).
 */
export const LEGACY_INTRO_START_CLAUSE = 'and propose starting with the first one';
export const INTRO_START_CLAUSE =
  'and say you are starting with the first one — never ask the student to choose or confirm where to start';

/** The goal with the legacy "propose starting" clause replaced; otherwise unchanged. */
export function normalizeIntroGoal(goal: string): string {
  return typeof goal === 'string' ? goal.split(LEGACY_INTRO_START_CLAUSE).join(INTRO_START_CLAUSE) : goal;
}

/** A segment object with its intro goal normalized (same object when nothing changes). */
export function withIntroStart<T>(seg: T): T {
  const g = (seg as { goal?: unknown } | null | undefined)?.goal;
  if (typeof g !== 'string' || !g.includes(LEGACY_INTRO_START_CLAUSE)) return seg;
  return { ...(seg as object), goal: normalizeIntroGoal(g) } as T;
}

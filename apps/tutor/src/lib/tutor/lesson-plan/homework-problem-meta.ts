/**
 * The client-safe half of `homework-problem.ts`: the one-problem plan's
 * metadata shape and its reader. The browser (VoiceTutorRealtime) reads a
 * plan's problem with this; it must not import `homework-problem.ts`, whose
 * builder pulls in the server-only plan generator.
 */

import type { FigureCommand } from '../homework-build/types';

export const HOMEWORK_PROBLEM_KIND = 'homework-problem' as const;

export interface HomeworkProblemMeta {
  kind: typeof HOMEWORK_PROBLEM_KIND;
  parentPlanId: string;
  n: number;
  text: string;
  figure: FigureCommand | null;
  verified: boolean;
  priorNote?: string;
}

/** Read the problem metadata back off a plan, or null when it isn't a one-problem plan. */
export function homeworkProblemOf(plan: { metadata?: Record<string, unknown> } | null | undefined): HomeworkProblemMeta | null {
  const m = plan?.metadata;
  if (!m || m.kind !== HOMEWORK_PROBLEM_KIND) return null;
  if (typeof m.parentPlanId !== 'string' || typeof m.n !== 'number' || typeof m.text !== 'string') return null;
  return {
    kind: HOMEWORK_PROBLEM_KIND,
    parentPlanId: m.parentPlanId,
    n: m.n,
    text: m.text,
    figure: (m.figure ?? null) as FigureCommand | null,
    verified: m.verified === true,
    ...(typeof m.priorNote === 'string' ? { priorNote: m.priorNote } : {}),
  };
}

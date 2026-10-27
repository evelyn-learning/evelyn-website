/**
 * Server-side resolution of a `homework-problem` turn (GAC per-problem
 * homework, 2026-10-20). The stream route calls this with the session's plan
 * id; a one-problem plan (lesson-plan/homework-problem.ts) yields the brain's
 * `homeworkProblem` input and the `activeProblem` it runs on. The answer key
 * is read from the homework build — never from the plan or the request — and
 * only when the plan is verified. Every other plan → null (the turn is
 * exactly as before).
 */

import type { AnswerKey, HomeworkBuildDoc } from '../homework-build/types';
import { homeworkProblemOf, type HomeworkProblemMeta } from '../lesson-plan/homework-problem';
import type { LessonPlan } from '../lesson-plan/types';
import type { HomeworkProblemTurnInput } from './homework-problem-block';
import { keyFinalsLine, solutionPathLines } from './keyed-verdict';

/** A homework-problem turn's text-thinking deadline (the default is 14 s). */
export const HOMEWORK_PROBLEM_THINKING_DEADLINE_MS = 8000;

export interface HomeworkProblemTurn {
  meta: HomeworkProblemMeta;
  homeworkProblem: HomeworkProblemTurnInput;
  /** Only for a verified problem: an unverified one carries no <active_problem>. */
  activeProblem?: { statement: string; source: 'homework'; expectedAnswer: string; solutionPath?: string[] };
}

export interface HomeworkProblemTurnDeps {
  getPlan?: (id: string) => Promise<Pick<LessonPlan, 'metadata'> | null>;
  getBuild?: (planId: string) => Promise<Pick<HomeworkBuildDoc, 'problems'> | null>;
  /** Tests: bypass the per-process cache. */
  noCache?: boolean;
}

// A minted one-problem plan never changes, and neither does a ready build
// entry's key; a plan that is not one never becomes one. Only definite
// answers are cached (a missing plan or key is looked up again next turn).
const CACHE_MAX = 500;
const cache = new Map<string, HomeworkProblemTurn | null>();

function remember(planId: string, v: HomeworkProblemTurn | null): void {
  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value as string);
  cache.set(planId, v);
}

export async function resolveHomeworkProblemTurn(planId: string, deps: HomeworkProblemTurnDeps = {}): Promise<HomeworkProblemTurn | null> {
  if (!planId) return null;
  if (!deps.noCache && cache.has(planId)) return cache.get(planId) ?? null;
  const getPlan = deps.getPlan ?? (async (id: string) => (await import('../lesson-plan/store')).getLessonPlan(id));
  const getBuild = deps.getBuild ?? (async (id: string) => (await import('../homework-build/store')).getHomeworkBuild(id));
  let plan: Pick<LessonPlan, 'metadata'> | null = null;
  try { plan = await getPlan(planId); } catch { plan = null; }
  if (!plan) return null;
  const meta = homeworkProblemOf(plan as { metadata?: Record<string, unknown> });
  if (!meta) {
    if (!deps.noCache) remember(planId, null);
    return null;
  }
  // 2026-10-29 (local validation, Biology): a problem opened while its build was
  // still preparing was minted unverified and stayed so for the whole session,
  // although its key was ready seconds later. The build is read on every
  // unresolved turn; a ready key makes the turn verified.
  let key: AnswerKey | undefined;
  try {
    const build = await getBuild(meta.parentPlanId);
    const pb = build?.problems.find((p) => p.n === meta.n) as { key?: AnswerKey | null; status?: string } | undefined;
    key = pb && (pb.status === undefined || pb.status === 'ready') ? (pb.key ?? undefined) : undefined;
  } catch { key = undefined; }
  if (!key?.parts?.length) {
    key = undefined;
    if (meta.verified) console.warn(`[homework-problem] plan ${planId} is verified but its key could not be read — running unverified this turn`);
  }
  const verified = !!key;
  const solutionPath = key ? solutionPathLines(key) : [];
  const turn: HomeworkProblemTurn = {
    meta,
    homeworkProblem: {
      text: meta.text,
      verified,
      hasFigure: meta.figure != null,
      ...(meta.priorNote ? { priorNote: meta.priorNote } : {}),
      ...(meta.priorConfirmed?.length ? { priorConfirmed: meta.priorConfirmed } : {}),
      ...(key ? { key } : {}),
    },
    ...(key ? { activeProblem: { statement: meta.text, source: 'homework' as const, expectedAnswer: keyFinalsLine(key), ...(solutionPath.length ? { solutionPath } : {}) } } : {}),
  };
  // Only a verified turn is cached: an unverified one looks again next turn (the build may finish).
  if (!deps.noCache && verified) remember(planId, turn);
  return turn;
}

/**
 * Homework build runner: for each problem of a homework plan, prepare a
 * figure and a verified answer key ahead of the session (cache -> else
 * buildFigure + solveKey in parallel), persisting each problem as it lands.
 */

import { getLessonPlan } from '../lesson-plan/store';
import { homeworkProblemsOf } from '../lesson-plan/homework';
import { buildFigure, defaultFigureBuildDeps, type FigureBuildDeps } from './figure-build';
import { solveKey, defaultKeySolveDeps, type KeySolveDeps } from './key-solve';
import { ensureHomeworkBuild, findCachedProblem, patchProblemBuild } from './store';
import type { ProblemBuild } from './types';

export const BUILD_STALE_MS = 3 * 60_000;

/** A build to (re)start: none yet, or not done and untouched for longer than BUILD_STALE_MS (a run that died). Pure. */
export function buildNeedsKick(build: { done?: boolean; updatedAt?: Date | string | number } | null | undefined, now: number = Date.now()): boolean {
  if (!build) return true;
  if (build.done) return false;
  const at = build.updatedAt != null ? new Date(build.updatedAt).getTime() : NaN;
  return !Number.isFinite(at) || now - at > BUILD_STALE_MS;
}

export interface RunnerDeps { figure: FigureBuildDeps; key: KeySolveDeps; now?: () => number }

export async function runHomeworkBuild(
  planId: string,
  partnerId: string,
  opts: { first?: number; deps?: RunnerDeps; concurrency?: number } = {},
): Promise<void> {
  const plan = await getLessonPlan(planId);
  const problems = plan ? homeworkProblemsOf(plan) : null;
  if (!problems) return;

  const doc = await ensureHomeworkBuild(planId, partnerId, problems);
  const pending = doc.problems.filter((p) => p.status === 'preparing');
  pending.sort((a, b) => {
    const fa = a.n === opts.first ? 0 : 1;
    const fb = b.n === opts.first ? 0 : 1;
    return fa - fb || a.n - b.n;
  });
  if (pending.length === 0) return;

  const deps: RunnerDeps = opts.deps ?? { figure: defaultFigureBuildDeps(), key: defaultKeySolveDeps() };
  const now = deps.now ?? Date.now;
  const queue = [...pending];

  const buildOne = async (p: ProblemBuild): Promise<void> => {
    const t0 = now();
    let patch: Parameters<typeof patchProblemBuild>[2];
    try {
      // buildFigure and solveKey are total, so a throw anywhere around a problem is
      // infrastructure (Mongo, process). Leave the problem `preparing` so the stale
      // re-kick retries it; never persist a transient fault as a final verdict.
      const cached = await findCachedProblem(p.hash);
      if (cached && cached.status === 'ready') {
        patch = {
          status: 'ready', figure: cached.figure, figureNote: cached.figureNote,
          key: cached.key, verify: cached.verify, ms: 0,
        };
      } else {
        const [fig, keyRes] = await Promise.all([buildFigure(p, deps.figure), solveKey(p, deps.key)]);
        const fi = fig.tokens, ki = keyRes.tokens;
        patch = {
          status: keyRes.key ? 'ready' : 'unverified',
          figure: fig.figure,
          figureNote: fig.note,
          key: keyRes.key,
          verify: {
            agreed: keyRes.agreed,
            ...(keyRes.agreed ? {} : { candidates: keyRes.candidates }),
            ...(keyRes.note ? { note: keyRes.note } : {}),
          },
          ms: now() - t0,
          ...(fi || ki ? { tokens: { in: (fi?.in ?? 0) + (ki?.in ?? 0), out: (fi?.out ?? 0) + (ki?.out ?? 0) } } : {}),
        };
      }
      await patchProblemBuild(planId, p.n, patch);
    } catch (err) {
      console.error(`[homework-build] plan=${planId} n=${p.n} infra_error=${(err as Error).message}`);
      return;
    }
    const tk = patch.tokens;
    console.log(
      `[homework-build] plan=${planId} n=${p.n} status=${patch.status} figure=${patch.figure ? 'yes' : 'no'} ms=${patch.ms} in=${tk ? tk.in : '-'} out=${tk ? tk.out : '-'}`,
    );
  };

  const worker = async (): Promise<void> => {
    for (let p = queue.shift(); p; p = queue.shift()) await buildOne(p);
  };
  const n = Math.max(1, opts.concurrency ?? 2);
  await Promise.all(Array.from({ length: Math.min(n, queue.length) }, worker));
}

const running = new Set<string>();

/** Detached: never delays or fails the caller. A second kick while running is a no-op. */
export function kickHomeworkBuild(planId: string, partnerId: string, opts: { first?: number } = {}): boolean {
  if (running.has(planId)) return false;
  running.add(planId);
  void runHomeworkBuild(planId, partnerId, opts)
    .catch((err) => console.error(`[homework-build] plan=${planId} run failed: ${(err as Error).message}`))
    .finally(() => running.delete(planId));
  return true;
}

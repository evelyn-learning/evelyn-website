/// <reference types="node" />
/**
 * Replay harness — what a homework-problem run (GAC) came to, read the way the
 * academy reads it: `classifyHomeworkProblemOutcome` (homework-build/outcome.ts)
 * over the run's debug events and transcript, plus a scan of every tutor turn
 * for a key value the student had not yet written (the no-reveal rule).
 *
 * Read-only: the plan and its build are read, nothing is written. Used by
 * run-replay.ts (v1 / v2 in the browser) and run-offline-v2.ts.
 */
import type { ReplayTurn } from './scripted-student';

export interface HomeworkRunOutcome {
  planId: string;
  verified: boolean;
  outcome: 'done' | 'in_progress' | 'needs_review';
  /** Tutor turns (0-based among tutor turns) that state a key value the student had not written. */
  reveals: Array<{ turn: number; part: string; value: string; sentence: string }>;
  keyFinals: string[];
}

export async function homeworkRunOutcome(planId: string, turns: ReadonlyArray<ReplayTurn>, events: ReadonlyArray<{ type: string; message: string; timestamp?: unknown }>): Promise<HomeworkRunOutcome | null> {
  const { resolveHomeworkProblemTurn } = await import('../../../src/lib/tutor/voice/homework-problem-turn');
  const { classifyHomeworkProblemOutcome } = await import('../../../src/lib/tutor/homework-build/outcome');
  const { revealsWithheldAnswer } = await import('../../../src/lib/tutor/voice/whole-answer-reveal');
  const hp = await resolveHomeworkProblemTurn(planId, { noCache: true });
  // The plan store's connection would keep the runner's process alive.
  await (await import('mongoose')).default.disconnect().catch(() => {});
  if (!hp) { console.warn(`[homework-outcome] plan ${planId} is not a readable homework-problem plan (MONGODB_URI set?)`); return null; }
  const key = hp.homeworkProblem.key ?? null;
  // Debug events carry no timestamps in a bundle: the outcome's dedupe then
  // counts consecutive identical verdicts once, as it does for an untimed row.
  const transcript = turns.map((t) => ({ role: t.role === 'tutor' ? 'tutor' : 'student', text: t.text }));
  const outcome = classifyHomeworkProblemOutcome({ debugEvents: events, transcript, verified: hp.homeworkProblem.verified, key, priorConfirmed: hp.meta.priorConfirmed ?? [] });
  const reveals: HomeworkRunOutcome['reveals'] = [];
  let studentSoFar = '';
  let tutorN = 0;
  for (const t of turns) {
    if (t.role === 'student') { studentSoFar += `\n${t.text}`; continue; }
    for (const part of key?.parts ?? []) {
      for (const sentence of t.text.split(/(?<=[.!?])\s+|\n+/).filter(Boolean)) {
        const r = revealsWithheldAnswer(sentence, { value: part.final, studentText: studentSoFar, givenText: hp.meta.text });
        if (r.hit) { reveals.push({ turn: tutorN, part: part.label, value: part.final, sentence: sentence.slice(0, 200) }); break; }
      }
    }
    tutorN += 1;
  }
  return { planId, verified: hp.homeworkProblem.verified, outcome, reveals, keyFinals: (key?.parts ?? []).map((p) => `${p.label}: ${p.final}`) };
}

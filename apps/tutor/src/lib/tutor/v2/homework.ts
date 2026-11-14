/**
 * Tutor brain v2 — homework mode (docs/superpowers/plans/2026-11-13-gac-on-v2-plan.md).
 *
 * Switched on by the plan, not by the partner: a session whose plan is one problem of a student's homework
 * sheet (lesson-plan/homework-problem.ts) works that problem. What the tutor is given is the problem and the
 * hard rules of homework help: the student reaches the final answer themselves, each answer is checked
 * against the sheet's key on the server, and the session ends when the problem is done. How to teach it is
 * v2's own.
 *
 * The answer key never enters the model's context. It is read on the server (voice/homework-problem-turn.ts)
 * and only the checker sees it; the model is told what the check found.
 */
import type { AnswerKey } from '../homework-build/types';
import { resolveHomeworkProblemTurn, type HomeworkProblemTurn, type HomeworkProblemTurnDeps } from '../voice/homework-problem-turn';
import { sanitizeConfirmedMarks } from '../voice/keyed-verdict';
import { noRevealLedgerForPartner } from '../voice/no-reveal-ledger-gate';
import {
  HOMEWORK_PROBLEM_CONDUCT_RULES, HOMEWORK_PROBLEM_FIGURE_SHOWN, HOMEWORK_PROBLEM_NO_FIGURE, HOMEWORK_PROBLEM_UNVERIFIED,
} from '../voice/homework-problem-block';
import { marksInWords, oneLine, partLabel } from './homework-facts';
import type { V2HomeworkProblem, V2HomeworkState, V2Session } from './types';

export { marksInWords, partLabel, v2HomeworkFacts } from './homework-facts';

/** The session's homework problem as the tutor may see it: everything but the key. */
export function v2HomeworkSession(turn: HomeworkProblemTurn, opts: { noReveal: boolean }): V2HomeworkProblem {
  const hp = turn.homeworkProblem;
  return {
    text: hp.text,
    verified: hp.verified,
    hasFigure: hp.hasFigure,
    ...(hp.priorNote ? { priorNote: hp.priorNote } : {}),
    ...(hp.priorConfirmed?.length ? { priorConfirmed: [...hp.priorConfirmed] } : {}),
    // The parts' labels only, to name what is open: never their answers.
    ...(hp.verified && hp.key?.parts.length ? { parts: hp.key.parts.map((p) => partLabel(p.label)) } : {}),
    ...(opts.noReveal ? { noReveal: true } : {}),
  };
}

/** The principle the homework session runs on. It is the one place the constitution's "show the step and move
 *  on after two tries" gives way: here the student must still reach the answer themselves. */
export const V2_HOMEWORK_NO_REVEAL = 'This is the student\'s own homework: they must reach the final answer themselves. Never state it, even when they ask for it outright or ask again; when they are stuck, give the next smallest step. This holds after any number of tries, in place of showing the step and moving on.';

/** The homework part of the session part (turn.ts v2SessionPart), in place of the plan map. */
export function v2HomeworkPart(hw: V2HomeworkProblem): string {
  const prior = marksInWords(hw.priorConfirmed ?? []);
  return [
    'HOMEWORK',
    'The student has opened ONE problem from their own homework sheet. It reads (verbatim):',
    hw.text.trim().slice(0, 4000),
    hw.priorNote ? `What happened last time on this problem: ${oneLine(hw.priorNote, 400)}` : '',
    prior.length ? `Already confirmed correct in an earlier session: ${prior.join('; ')}. Do not ask for these again.` : '',
    `- ${V2_HOMEWORK_NO_REVEAL}`,
    `- ${hw.hasFigure ? HOMEWORK_PROBLEM_FIGURE_SHOWN : HOMEWORK_PROBLEM_NO_FIGURE}`,
    hw.verified
      ? '- Each answer the student gives is checked against the sheet\'s checked answer key, and what the check found is in the facts as "answer check". It is right: when your own working disagrees with it, look again at yours. Call a part done only when the homework record in the facts lists it as confirmed.'
      : `- ${HOMEWORK_PROBLEM_UNVERIFIED}`,
    '- Labels and values are the ones on the student\'s sheet, as written in the problem above.',
    '- The session is for this one problem. When the homework record says every part is confirmed correct, say in a sentence that the problem is done, tell them they can go back to their list, and call end_lesson.',
    HOMEWORK_PROBLEM_CONDUCT_RULES.trimEnd(),
  ].filter(Boolean).join('\n');
}

/** In place of the student's words at the start of a homework session (turn.ts v2StudentBlock). */
export function v2HomeworkOpener(hw: V2HomeworkProblem): string {
  return `[The session has just started. The student has opened one problem from their homework, and it is on their screen${hw.hasFigure ? ' with its figure: do not draw it again' : ''}. Greet them in a few words and ask the first question that gets them working on it.${hw.priorNote || hw.priorConfirmed?.length ? ' They worked on it in an earlier session: say in a sentence where that left off and carry on from there.' : ''} Keep it short.]`;
}

/** Whether the session is in homework mode. */
export const isHomeworkSession = (s: V2Session): s is V2Session & { homework: V2HomeworkProblem } => !!s.homework;

/** What the turn route resolves for a homework plan: the problem as the tutor sees it, and the key, which only
 *  the checker reads. Null for every other plan. */
export interface V2HomeworkResolved { problem: V2HomeworkProblem; key?: AnswerKey; turn: HomeworkProblemTurn }

export async function v2HomeworkFor(
  planId: string | undefined, partnerId: string | undefined,
  deps: HomeworkProblemTurnDeps & { env?: Record<string, string | undefined> } = {},
): Promise<V2HomeworkResolved | null> {
  if (!planId) return null;
  const turn = await resolveHomeworkProblemTurn(planId, deps);
  if (!turn) return null;
  return { problem: v2HomeworkSession(turn, { noReveal: noRevealLedgerForPartner(partnerId, deps.env) }), ...(turn.homeworkProblem.key ? { key: turn.homeworkProblem.key } : {}), turn };
}

/** The homework record from a client-held state, kept to well-formed marks. */
export function readHomeworkState(raw: unknown): V2HomeworkState | undefined {
  const h = raw as Partial<V2HomeworkState> | null | undefined;
  if (!h || typeof h !== 'object') return undefined;
  return { confirmed: sanitizeConfirmedMarks(h.confirmed), ...(h.done === true ? { done: true } : {}) };
}

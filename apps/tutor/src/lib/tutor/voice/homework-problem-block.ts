/**
 * The per-turn `<homework_problem>` block (GAC per-problem homework,
 * 2026-10-20): a session that runs on ONE problem of the student's homework
 * sheet (lesson-plan/homework-problem.ts). Rendered only when the stream
 * route has resolved the session's plan as a `homework-problem` plan; every
 * other session's user content is unchanged.
 *
 * The block never carries the answer key: a verified expected answer reaches
 * the prompt only through `<active_problem>`.
 */

import type { AnswerKey } from '../homework-build/types';

/** Server-populated only (never from the request body). */
export interface HomeworkProblemTurnInput {
  text: string;
  verified: boolean;
  hasFigure: boolean;
  priorNote?: string;
  /** Present only when `verified`; read server-side from the homework build. */
  key?: AnswerKey;
}

export const HOMEWORK_PROBLEM_FIGURE_SHOWN =
  'The problem\'s figure is already on the student\'s screen beside the chat. Never redraw the problem\'s figure; sketch only new work.';
export const HOMEWORK_PROBLEM_NO_FIGURE =
  'No figure could be drawn for this problem: refer to the sheet for it. Never draw the problem\'s figure yourself; sketch only new work.';
export const HOMEWORK_PROBLEM_VERIFIED =
  'Check the student\'s final answer against the expected answer in <active_problem> and say plainly whether it matches.';
export const HOMEWORK_PROBLEM_UNVERIFIED =
  'This problem has no checked answer, so never say an answer is right or wrong — work it through step by step with the student and ask them to check their result with their teacher. This overrides every other line of this message that asks you to grade an answer or say whether it matches.';

/** The rules every homework-problem turn carries. */
export const HOMEWORK_PROBLEM_RULES = [
  '- Labels and values are the ones on the student\'s sheet, as written in the problem above.',
  '- When the student says they do not know or remember a name or fact, tell them after one miss and move on.',
  '- The prior-work note, when there is one, is what happened last time on this problem.',
  '- When every part is confirmed correct, say the problem is done and offer "Back to your list".',
].join('\n');

const oneLine = (s: string, max: number) => String(s ?? '').replace(/[<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);

export function formatHomeworkProblemBlock(hp: HomeworkProblemTurnInput | undefined): string {
  if (!hp?.text?.trim()) return '';
  const note = hp.priorNote ? oneLine(hp.priorNote, 400) : '';
  return '<homework_problem>\n'
    + 'The student is working ONE problem from their homework sheet (verbatim):\n'
    + `${hp.text.trim().slice(0, 4000)}\n`
    + (note ? `Prior work on this problem: ${note}\n` : '')
    + `- ${hp.hasFigure ? HOMEWORK_PROBLEM_FIGURE_SHOWN : HOMEWORK_PROBLEM_NO_FIGURE}\n`
    + `- ${hp.verified ? HOMEWORK_PROBLEM_VERIFIED : HOMEWORK_PROBLEM_UNVERIFIED}\n`
    + `${HOMEWORK_PROBLEM_RULES}\n`
    + '</homework_problem>\n\n';
}

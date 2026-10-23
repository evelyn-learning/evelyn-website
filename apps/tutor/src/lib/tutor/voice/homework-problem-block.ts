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
import { EXTRA_PROBLEM_SAME_RULES, LEDGER_CONDUCT_RULES, OFF_TOPIC_NOT_ANSWERED, PERSONAL_DETAILS_RULE } from '../lesson-plan/homework-ledger';
import { boardRevealsWithheldAnswer, type RevealRead, type WithheldAnswer } from './whole-answer-reveal';

/** Server-populated only (never from the request body). */
export interface HomeworkProblemTurnInput {
  text: string;
  verified: boolean;
  hasFigure: boolean;
  priorNote?: string;
  /** A2: marks earlier sessions of this problem confirmed (keyed-verdict.ts). */
  priorConfirmed?: string[];
  /** Present only when `verified`; read server-side from the homework build. */
  key?: AnswerKey;
}

export const HOMEWORK_PROBLEM_FIGURE_SHOWN =
  'The problem\'s figure is already on the student\'s screen beside the chat. Never redraw the problem\'s figure; sketch only new work.';
export const HOMEWORK_PROBLEM_NO_FIGURE =
  'No figure could be built for this problem: refer to the sheet for it. If you sketch the sheet\'s figure, draw only what the sheet shows — its labels and its given values — never a value the problem asks the student to find.';
export const HOMEWORK_PROBLEM_VERIFIED =
  'Check the student\'s final answer against the expected answer in <active_problem> and say plainly whether it matches. The expected answer is correct: before you assert a relation or an intermediate value, make sure it is consistent with the expected values, and when the student\'s claim is consistent with them and yours is not, the student is right — say so and continue from their claim.';
export const HOMEWORK_PROBLEM_UNVERIFIED =
  'This problem has no checked answer, so never say an answer is right or wrong — work it through step by step with the student and ask them to check their result with their teacher. This overrides every other line of this message that asks you to grade an answer or say whether it matches.';

/** The rules every homework-problem turn carries. */
export const HOMEWORK_PROBLEM_RULES = [
  '- Labels and values are the ones on the student\'s sheet, as written in the problem above.',
  '- Ask, never tell: never state the final answer, even when asked outright; when the student gives up, give the next smallest hint.',
  '- When the student says they do not know or remember a fact to recall (a name, a definition, a formula), tell them after one miss and move on. This never applies to the problem\'s answer or to any numeric result.',
  '- The prior-work note, when there is one, is what happened last time on this problem.',
  '- When every part is confirmed correct, say the problem is done and offer "Back to your list".',
].join('\n');

/** The homework path's conduct and safeguarding rules (crisis line, personal
 *  details, live tests and graded work, off-topic, extra problems, methods…),
 *  the same constants `<homework_session>` renders, so the two cannot drift. */
export const HOMEWORK_PROBLEM_CONDUCT_RULES =
  `- ${OFF_TOPIC_NOT_ANSWERED}\n` +
  `- ${EXTRA_PROBLEM_SAME_RULES}\n` +
  `- ${PERSONAL_DETAILS_RULE}\n` +
  `- ${LEDGER_CONDUCT_RULES}\n`;

/**
 * GAC acceptance 2026-10-21 (hw-10 problem 4): with no pre-built figure the
 * tutor sketched the cone itself and labelled it "h=12" — the answer to part
 * (a) — in its opening turn, before the student had said a word. The rule
 * above is wording; this is the guard. One withheld value per key part: a
 * board item that writes it is not forwarded (the model gets
 * HOMEWORK_BOARD_KEY_WITHHELD_REASON as its tool result and redraws). A
 * number the sheet gives (r = 5) or the student has already written is never
 * a hit, so a confirmed part can be drawn.
 */
export const HOMEWORK_OPENER_BOARD_WITHHELD_REASON =
  'not shown — the problem\'s figure is already on the board; open with your question, not a drawing';

export const HOMEWORK_BOARD_KEY_WITHHELD_REASON =
  'not shown — it writes a value the problem asks the student to find; draw only what the sheet gives';

/**
 * Haiku 5.5 brain trial 2026-10-23 (worksheet 3 p6, no figure): the opener's
 * problem card carried the area answer, the key guard withheld it, and the
 * model said "here's the problem" over an empty board. In the opening turn of
 * a problem with no figure, a withheld board item is replaced — once — by the
 * sheet's own problem text, which holds only what the sheet gives.
 */
export const HOMEWORK_SHEET_CARD_SUBSTITUTED_REASON =
  'not shown — it writes a value the problem asks the student to find; the sheet\'s own problem text is on the board in its place, so do not draw the problem again';

export function homeworkSheetProblemCard(hp: HomeworkProblemTurnInput | undefined): Record<string, unknown> | null {
  const statement = String(hp?.text ?? '').trim().slice(0, 4000);
  return statement ? { statement, title: 'Problem', format: 'free-response' } : null;
}

export function homeworkKeyWithheld(hp: HomeworkProblemTurnInput | undefined, studentText: string): WithheldAnswer[] {
  if (!hp?.verified || !hp.key?.parts?.length) return [];
  return hp.key.parts
    .map((part) => String(part.final ?? '').trim())
    .filter(Boolean)
    .map((value) => ({ value, studentText: String(studentText ?? ''), givenText: String(hp.text ?? '') }));
}

export function boardRevealsHomeworkKey(args: unknown, withheld: ReadonlyArray<WithheldAnswer>): RevealRead | null {
  for (const a of withheld) {
    const r = boardRevealsWithheldAnswer(args, a);
    if (r.hit) return r;
  }
  return null;
}

const oneLine = (s: string, max: number) => String(s ?? '').replace(/[<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);

/** A2 (2026-10-23): what an earlier session already confirmed, in words. */
function priorConfirmedLine(marks: string[] | undefined): string {
  const items = (marks ?? []).map((m) => {
    if (m.startsWith('part:')) return m.slice(5) ? `part ${m.slice(5)}` : 'the answer';
    const body = m.slice(6); const eq = body.indexOf('=');
    const part = body.slice(0, eq); const value = oneLine(body.slice(eq + 1), 40);
    return part ? `${value} in part ${part}` : value;
  }).filter(Boolean);
  if (!items.length) return '';
  return `Already confirmed correct in an earlier session: ${items.join('; ')}. Do not ask for these again; acknowledge them briefly and continue with what is left.\n`;
}

export function formatHomeworkProblemBlock(hp: HomeworkProblemTurnInput | undefined): string {
  if (!hp?.text?.trim()) return '';
  const note = hp.priorNote ? oneLine(hp.priorNote, 400) : '';
  return '<homework_problem>\n'
    + 'The student is working ONE problem from their homework sheet (verbatim):\n'
    + `${hp.text.trim().slice(0, 4000)}\n`
    + (note ? `Prior work on this problem: ${note}\n` : '')
    + priorConfirmedLine(hp.priorConfirmed)
    + `- ${hp.hasFigure ? HOMEWORK_PROBLEM_FIGURE_SHOWN : HOMEWORK_PROBLEM_NO_FIGURE}\n`
    + `- ${hp.verified ? HOMEWORK_PROBLEM_VERIFIED : HOMEWORK_PROBLEM_UNVERIFIED}\n`
    + `${HOMEWORK_PROBLEM_RULES}\n`
    + HOMEWORK_PROBLEM_CONDUCT_RULES
    + '</homework_problem>\n\n';
}

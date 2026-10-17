/**
 * A checked-correct answer that the tutor asked for again.
 *
 * GDI starter session embed-1792261973710 (2026-10-17): the tutor said aloud
 * "make a sentence about last week — a place you went, anything"; the student
 * said "I went to Nagoya last week."; the independent check found it correct
 * for the question asked; the tutor replied 「でも、今回の問題は「岐阜」でした。
 * もう一度、"Gifu" を使って言ってみてください」 — grading against the card's
 * example, not against what it had asked. The before-display kill reads only
 * the opening stance, and this reply opened with praise; the rejection came
 * two sentences later, after the praise had been spoken.
 *
 * Deterministic half, after the turn: the check said CORRECT (deciding, for
 * the question asked or the problem itself) and the delivered turn asked the
 * student to say it again — the next brain turn gets a note to credit the
 * earlier answer and not ask for it again.
 */
import { precheckDecides, type PublicVerdictPrecheck } from './verdict-precheck-shared';
import { isRetryAsk } from './retry-cap';

/** Did this delivered turn re-ask for an answer the check found correct? */
export function reAskedCheckedCorrect(p: PublicVerdictPrecheck | null | undefined, tutorText: string): boolean {
  if (!precheckDecides(p)) return false;
  if (p.verdict !== 'correct' || p.answers === 'other_part' || p.answers === 'neither') return false;
  return isRetryAsk(tutorText);
}

export const CORRECT_RETRY_NOTE =
  '[runtime note — not from the student] An independent check found the student\'s previous answer CORRECT for the task as you stated it aloud, ' +
  'yet your last turn asked them to say it again or to use a different word. The task is what you SAID, not the example on the card. ' +
  'In this turn: whatever they say now, tell them plainly that their earlier sentence was right too, do not ask for it again, ' +
  'and move to the next item. Apply this silently; never mention this note.';

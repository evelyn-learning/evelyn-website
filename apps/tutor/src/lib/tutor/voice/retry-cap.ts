/**
 * Two tries, then move on — enforced, not just asked for.
 *
 * GDI starter session embed-1792185403054 (2026-10-16): the language clause
 * says "ask for the same sentence at most twice", yet the tutor asked the
 * learner to repeat "Have you ever gone to karaoke?" six turns running. After
 * two consecutive tutor turns that ask for a repeat, the next brain turn gets
 * a runtime note to accept the closest version and move on.
 */

const RETRY_ASK_RE =
  /(?:もう一度|もう一回)(?:だけ)?(?:、)?\s*(?:ゆっくり)?(?:、)?\s*(?:一緒に)?(?:、)?\s*(?:ゆっくり)?(?:言って|言いましょう|言ってみ|お願い|どうぞ|挑戦)|\b(?:try\s+)?say(?:ing)?\s+(?:it|that)\s+(?:once\s+more|again)\b|\btry\s+(?:it|that)\s+again\b|\bone\s+more\s+time\b|\btry\s+again\b/i;

/** Does this tutor turn ask the student to say something again? */
export function isRetryAsk(tutorText: string): boolean {
  return RETRY_ASK_RE.test(tutorText ?? '');
}

/** Consecutive repeat-asks after which the next turn is told to move on. */
export const RETRY_CAP_TURNS = 2;

export const RETRY_CAP_NOTE =
  '[runtime note — not from the student] You have already asked the student to repeat this sentence twice. ' +
  'Do not ask again. Accept their closest version warmly, say the correct sentence once, write it on the board, ' +
  'and move to the next part of the lesson in this turn. Apply this silently; never mention this note.';

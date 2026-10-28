/**
 * Two tries, then move on — enforced, not just asked for.
 *
 * GDI starter session embed-1792185403054 (2026-10-16): the language clause
 * says "ask for the same sentence at most twice", yet the tutor asked the
 * learner to repeat "Have you ever gone to karaoke?" six turns running. After
 * two consecutive tutor turns that ask for a repeat, the next brain turn gets
 * a runtime note to accept the closest version and move on.
 *
 * embed-1792254012923 (2026-10-17): the detector only knew もう一度 + (ゆっくり)
 * + 言って. Six of eleven repeat-asks in that session went uncounted —
 * 「もう一度、声に出して言ってみてください」, 「もう一度聞きますね」,
 * 「もう一度、I sang karaoke last week、と言ってみてください」 — so the cap
 * fired after the fifth ask, not the second. Now: もう一度/もう一回 followed,
 * within the same sentence, by any student-directed repeat verb; and the
 * streak keeps counting past the cap (it was zeroed on plant, so an ignored
 * note needed two more asks before the next one).
 */

// Japanese: もう一度 / もう一回 / 再度 … then, before the sentence ends, a verb
// that asks the STUDENT to produce it again (言ってみて, 読んでみて, 繰り返して,
// お願いします, どうぞ, 挑戦, 聞きますね = "I'll ask you again"). Anything may
// sit between — 「、ゆっくり」, 「声に出して」, the target sentence itself.
// 「もう一度読みますね」 / 「もう一度説明しますね」 (the TUTOR will read or
// explain again) are not repeat-asks and do not match.
const RETRY_ASK_JA_RE =
  /(?:もう一度|もう一回|もう1度|もう1回|もういちど|再度)[^。！？!?\n]{0,40}?(?:言(?:って|い)(?:み|て|ましょう)|読んで(?:み|て)|繰り返し|リピート|お願い|どうぞ|挑戦|聞(?:きます|かせて|いてみ)|やってみ|試してみ)/;

// English: "say it again", "try saying it once more", "one more time",
// "repeat after me", "let's try that again".
const RETRY_ASK_EN_RE =
  /\b(?:try\s+)?say(?:ing)?\s+(?:it|that|this)\s+(?:once\s+more|again)\b|\btry\s+(?:it|that|this)\s+(?:again|once\s+more)\b|\bone\s+more\s+time\b|\btry\s+again\b|\brepeat\s+(?:after\s+me|that|it|this)\b|\bonce\s+more\b/i;

/** Does this tutor turn ask the student to say something again? */
export function isRetryAsk(tutorText: string): boolean {
  const t = tutorText ?? '';
  return RETRY_ASK_JA_RE.test(t) || RETRY_ASK_EN_RE.test(t);
}

/** Consecutive repeat-asks after which the next turn is told to move on. */
export const RETRY_CAP_TURNS = 2;

/** The move-on note, naming how many times the tutor has already asked. */
export function retryCapNote(timesAsked: number): string {
  const n = Math.max(RETRY_CAP_TURNS, Math.floor(timesAsked));
  const times = n === 2 ? 'twice' : `${n} times`;
  return (
    `[runtime note — not from the student] You have already asked the student to repeat this sentence ${times}. ` +
    'Do not ask again. Accept their closest version warmly, say the correct sentence once, write it on the board, ' +
    'and move to the next part of the lesson in this turn. Apply this silently; never mention this note.'
  );
}

export const RETRY_CAP_NOTE = retryCapNote(RETRY_CAP_TURNS);

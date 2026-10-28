/**
 * "準備はいいですか" — the readiness check that stalls the lesson.
 *
 * GDI starter session embed-1792276942766 (2026-10-17): five tutor turns
 * ended with 「準備はいいですか」. Each time the student said はい, the next
 * turn re-announced the same transition ("では次に、今日の二つ目の形を練習
 * しましょうね…") — the evaluator read it as "poor state tracking" and
 * "repeated transitions". A readiness check adds a round trip and gives the
 * brain a turn with nothing to do but repeat itself. The next item should
 * simply start.
 */
const READINESS_ASK_RE =
  /準備は(?:いい|よろしい|でき(?:て|ました))(?:です)?か|用意は(?:いい|でき)|始めてもいいですか|いいですか、(?:では|じゃ)|\b(?:are you ready|ready\s*\?|shall we (?:start|begin|go on)\s*\?)/i;

/** Does this tutor turn end on (or contain) a readiness check? */
export function asksReadiness(tutorText: string): boolean {
  return READINESS_ASK_RE.test(tutorText ?? '');
}

export const READINESS_ASK_NOTE =
  '[runtime note — not from the student] Your last turn asked whether the student was ready. Do not ask that again, and do not re-announce the transition: ' +
  'begin the next item itself in this turn — say the first question or sentence to practise. Apply this silently; never mention this note.';

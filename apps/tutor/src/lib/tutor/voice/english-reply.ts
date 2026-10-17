/**
 * The tutor asked for English; the transcript has none.
 *
 * GDI starter session embed-1792254012923 (2026-10-17): asked to put
 * 「海外に行ったことがありますか」 into English, the learner replied in
 * Japanese only (that they would rather answer the question). The tutor
 * said 「"Have you ever been abroad?" 完璧な文です」 — crediting an English
 * sentence the learner never produced. Earlier sessions did the same when a
 * learner answered the question instead of translating it.
 *
 * Deterministic half: when the previous tutor turn asked the student to
 * produce English and the student's transcript carries no Latin letters, the
 * next brain turn gets a note. The transcript may still BE English — the
 * recognizer writes a Japanese speaker's English in katakana at times
 * (「アイサンカロケラストウィーク」) — so the note names both readings and
 * forbids only the one failure: praising a sentence that is not there.
 */

// Tutor turns that ask the student to say something in English: 英語で言って /
// 英語で聞いて / 英語にすると / 英語だと / 言ってみましょう (the lesson's target
// language is English, so a repeat-ask is an English ask) / "in English" /
// "say it" / "repeat after me".
const ASKS_ENGLISH_RE =
  /英語で(?:言|聞|答|質問|お願い|どう|何と|なんと)|英語に(?:す|直|して)|英語だと|英語では|言(?:って|い)(?:み|て|ましょう)|\bin\s+english\b|\bsay\s+(?:it|that|this)\b|\brepeat\s+after\s+me\b|\btry\s+saying\b/i;

/** Did this tutor turn ask the student to produce English? */
export function asksForEnglish(tutorText: string): boolean {
  return ASKS_ENGLISH_RE.test(tutorText ?? '');
}

/** The student asked to hear it again (「もう一度お願いします」, "say it again"):
 *  a request, not an answer — no note (embed-1792266148587: two false notes). */
const REPEAT_REQUEST_RE = /もう一度|もう一回|もう1度|もう1回|もういちど|もっかい|再度|\b(?:again|repeat|one more time|once more)\b/i;
export function isStudentRepeatRequest(studentText: string): boolean {
  return REPEAT_REQUEST_RE.test(studentText ?? '');
}

/** 2026-10-17 (embed-1792276942766): after 「先週岐阜に行きました」を英語で,
 *  the student said only 「はい。」 and the tutor replied 「I went to Gifu last
 *  week、合っていますよ」 — crediting a sentence nobody said. A bare はい after
 *  an English ask is exactly the case the note exists for, so the caller no
 *  longer skips pleasantry-only replies; only repeat requests are skipped. */

/** Is there no Latin-letter English anywhere in the student's transcript? */
export function hasNoLatinLetters(studentText: string): boolean {
  return !/[A-Za-z]/.test(studentText ?? '');
}

export const NO_ENGLISH_REPLY_NOTE =
  '[runtime note — not from the student] You asked for English, and the transcript of the student\'s reply contains no English words in Latin letters. ' +
  'Either they answered in Japanese (respond to what they said, then say the English sentence once yourself and ask them to say it), ' +
  'or the recognizer wrote their English in katakana (treat it as their attempt at the sentence). ' +
  'Do not praise or confirm an English sentence they did not say, and do not say the item or the exercise is finished. Apply this silently; never mention this note.';

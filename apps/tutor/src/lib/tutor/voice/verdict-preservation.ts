/**
 * portal-704e3e01 (2026-09-04): the false-assertion guard killed two turns
 * that had correctly graded the student, and both retries came back with no
 * verdict at all. The rejection text tells the brain "never state x = N
 * again"; when N was in fact right, the model has nothing safe to say about
 * the answer, so it drops the grading and opens on the next segment. The
 * student's own words 20s later: "I don't know if I got that last question
 * correct, so now I'm confused."
 *
 * This module decides, purely, whether a retry has silently dropped the
 * verdict the killed attempt was carrying. Generic — verdict words only, no
 * subject content, no numbers.
 *
 * Pure module — no side effects, never throws.
 */

/** Praise- and denial-class openers. Kept deliberately small: these are the
 *  words the system prompt tells the brain to open a graded turn with. */
const VERDICT_WORD_RE =
  /\b(?:exactly|right|correct|precisely|spot on|that'?s it|nice work|good job|not quite|not really|almost|close|that'?s not|incorrect|nope)\b/i;

/** Only the opening TWO sentences are scanned — the same window the
 *  verdict-hold and praise-contradiction detectors use. A verdict word
 *  further downstream is prose ("Right, so next…"), not a grading. */
const OPENING_SENTENCES = 2;

function firstSentences(text: string, n: number): string {
  const parts = (text ?? '').split(/(?<=[.!?])\s+/);
  return parts.slice(0, n).join(' ');
}

export function hasVerdictOpener(text: string): boolean {
  return VERDICT_WORD_RE.test(firstSentences(text, OPENING_SENTENCES));
}

/** Appended to a false-assertion rejection so the retry cannot answer by
 *  simply saying nothing about the student's answer. Generic by design — it
 *  names no value, so it can never coach the brain toward a wrong one. */
export const VERDICT_REPLANT_CLAUSE =
  ' Your previous attempt graded the student\'s answer and that grading was cut before they heard it. '
  + 'Your re-delivery MUST still open by telling the student whether their answer was right or wrong — '
  + 're-derive the value first if you need to, but do not move on to new content without grading what they said.';

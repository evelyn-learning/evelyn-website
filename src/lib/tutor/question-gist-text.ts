/**
 * Pure text helpers for the Q-pin gist (2026-07-14 live-test ask).
 *
 * Lives outside TutorSession.tsx so it stays importable from node test
 * scripts — same reasoning as whiteboard/inline-math.ts living outside
 * InlineMathText.tsx.
 *
 * Task X8 (live-test ask, 2026-07-16): the Haiku gist producer
 * (/api/tutor/question-gist) restates the tutor's question in its own
 * words and sometimes wraps part of it in markdown emphasis (single-star
 * italics / double-star bold). The pin renders through InlineMathText,
 * which only special-cases $...$ math — any other markup, including
 * emphasis, renders as literal text, so the pin showed raw asterisks
 * ("*in order to*") instead of plain words. stripMarkdownEmphasis() strips
 * that markup. lastQuestionSentence() (the client-derived fallback used
 * when the API call fails) already ran this same regex inline before this
 * task — it's extracted here so both paths share one implementation and
 * can't drift apart again.
 */

/** Content must start with a letter (same gate as the TTS layer's
 *  MD_EMPHASIS_REPLACEMENTS in tts-pronunciation.ts) so bare multiplication
 *  ("2*3*4") is never touched. */
const EMPHASIS_RE = /\*{1,2}([A-Za-z][^*]{0,60}?)\*{1,2}/g;

/** A $...$ math span. Content must not itself contain "$" or a newline —
 *  same shape as the TTS layer's dollar-math handling. */
const DOLLAR_MATH_RE = /\$[^$\n]*\$/g;

/** Strip *italic* / **bold** markdown emphasis, keeping the wrapped text.
 *
 *  X8 review (I2): the emphasis regex used to run over the whole string
 *  unconditionally, so asterisks used as literal multiplication INSIDE a
 *  $...$ math span ("$x*y*z$") were eaten too, mangling the math
 *  ("$xyz$"). Math spans are never markdown emphasis — split the string
 *  on $...$ first, strip emphasis only in the surrounding prose, then
 *  reassemble the (untouched) math spans back in place. */
export function stripMarkdownEmphasis(s: string): string {
  const mathSpans = s.match(DOLLAR_MATH_RE) ?? [];
  const prose = s.split(DOLLAR_MATH_RE);
  return prose
    .map((part) => part.replace(EMPHASIS_RE, '$1'))
    .reduce((out, part, i) => out + part + (mathSpans[i] ?? ''), '');
}

/** The turn's LAST question sentence, COMPLETE (round-4 feedback: a
 *  mid-cut ellipsis gist is useless). Used as the fallback when the LLM
 *  gist call fails, and as the probe source for spoken-reveal timing.
 *  Returns null when there's no question or it's too long to pin whole. */
export function lastQuestionSentence(text: string): string | null {
  const questions = stripMarkdownEmphasis(text).match(/[^.!?\n]{4,}\?/g);
  const last = questions?.[questions.length - 1]?.trim();
  if (!last || last.length > 220) return null;
  return last;
}

/** Task Y2: pure seam for the Haiku reply → gist decision, extracted out
 *  of the route handler so it's unit-testable without a network call.
 *  A deliberate "NONE" verdict (the turn's "?" was conversational
 *  plumbing, not worth pinning) and an over-length reply both resolve to
 *  null here — same as the model saying nothing pin-worthy. This is
 *  distinct from an API/transport failure, which never reaches this
 *  function; the route returns a non-200 status for that case instead so
 *  the client can tell "deliberately nothing" from "we don't know". */
export function parseGistReply(raw: string): string | null {
  const trimmed = raw.trim();
  return trimmed && trimmed !== 'NONE' && trimmed.length <= 200 ? trimmed : null;
}

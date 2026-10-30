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
  if (!last || last.length > QPIN_MAX_CHARS) return null;
  return last;
}

/** Longest text a pin shows whole (lastQuestionSentence's cap). */
export const QPIN_MAX_CHARS = 220;

/** Sentences of a tutor turn. A boundary is terminal punctuation (with an
 *  optional closing quote/bracket) followed by whitespace and a capital or
 *  an opening quote, or a newline — so `starting with "I have..."` stays
 *  one sentence. */
function splitSentences(text: string): string[] {
  return text
    .split(/\n+|(?<=[.!?…。！？]["”’)]?)\s+(?=[A-Z"“'‘(])/)
    .map((x) => x.trim())
    .filter(Boolean);
}

const ASK_LEAD_RE =
  /^(?:(?:now|next|then|so),\s*)?(?:tell me|please (?:say|tell|try|give)|try|say|could you|can you|give me|describe|finish|complete)\b/i;

/** GDI run 3 (2026-10-29): language lessons ask in the imperative — `Next,
 *  tell me one thing you have been doing at your company for a long time,
 *  starting with "I have..."` — and the gist model judged the turn's only
 *  "?" conversational, so no pin. The turn's LAST ask sentence (optionally
 *  led by "Now,/Next,/Then,/So,"), verbatim, when no question sentence
 *  follows it; capped at QPIN_MAX_CHARS. null ⇒ none (or a later question
 *  wins). */
export function lastAskSentence(text: string): string | null {
  const sentences = splitSentences(stripMarkdownEmphasis(text ?? ''));
  let askIdx = -1;
  for (let i = sentences.length - 1; i >= 0; i--) {
    if (ASK_LEAD_RE.test(sentences[i])) { askIdx = i; break; }
  }
  if (askIdx < 0) return null;
  for (let j = askIdx + 1; j < sentences.length; j++) {
    if (/[?？]["”’)]?\s*$/.test(sentences[j])) return null;
  }
  return capPinText(sentences[askIdx]);
}

/** A pin text capped at QPIN_MAX_CHARS, cut at a word boundary with "…". */
export function capPinText(text: string): string {
  if (text.length <= QPIN_MAX_CHARS) return text;
  const cut = text.slice(0, QPIN_MAX_CHARS - 1);
  const sp = cut.lastIndexOf(' ');
  return `${(sp > QPIN_MAX_CHARS / 2 ? cut.slice(0, sp) : cut).trim()}…`;
}

/** GDI run 4 (2026-10-29): the gist model returned nothing for `Now, can you
 *  tell me one more thing you sold, or a customer you helped?` — in a
 *  language session the turn's last question sentence is pinned verbatim
 *  instead (capped like an ask pin). null ⇒ no question sentence. */
export function verbatimQuestionPin(text: string): string | null {
  const questions = stripMarkdownEmphasis(text ?? '').match(/[^.!?\n]{4,}\?/g);
  const last = questions?.[questions.length - 1]?.trim();
  return last ? capPinText(last) : null;
}

/** Language sessions: the pin a tutor turn would carry, before any gist —
 *  its trailing ask, else its last question. null ⇒ the turn asks nothing. */
export function languagePinCandidate(text: string): string | null {
  return lastAskSentence(text) ?? verbatimQuestionPin(text);
}

/** GDI run 4: a NEW tutor turn that asks something replaces the previous
 *  turn's pin at once — the old pin must not linger until the stale sweep. */
export function pinReplacedByTurn(pinTurnId: string | null | undefined, turnId: string, candidate: string | null): boolean {
  return !!pinTurnId && pinTurnId !== turnId && !!candidate;
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
  let t = raw.trim();
  if (!t) return null;
  // R33 (session-1784830146734): the model sometimes ANNOTATES its verdict —
  // "NONE\n(This is a follow-up prompt asking the student to elaborate…)" —
  // and the exact-match check let the whole thing through, so the pin
  // displayed "NONE" plus the model's meta-commentary. Any reply that
  // STARTS with NONE is a NONE verdict; the trailing explanation is for us,
  // never for the student.
  if (/^NONE\b/.test(t)) return null;
  // A reply that is entirely a parenthetical is meta-commentary, not a question.
  if (/^\([\s\S]*\)$/.test(t)) return null;
  // R33: self-correction chatter — "What is the first step?\nWait — let me
  // rephrase to match the teaching context:\nIs $f(x)…$ continuous?" — the
  // pin rendered all three lines. The model's FINAL question sentence is
  // the one it settled on; keep only that. A multi-line reply with no "?"
  // anywhere is meta → null.
  if (/\n/.test(t) || /\?[\s\S]*\?/.test(t)) {
    const questions = t.match(/[^?\n]{2,}\?/g);
    if (!questions) return null;
    t = questions[questions.length - 1].trim();
  }
  // Same-line rephrase preamble ("let me rephrase that: Is …?") — cut
  // through the colon.
  t = t.replace(/^.*\b(?:let me (?:rephrase|restate)|rephras\w+)\b[^:]*:\s*/i, '').trim();
  return t && t.length <= 200 ? t : null;
}

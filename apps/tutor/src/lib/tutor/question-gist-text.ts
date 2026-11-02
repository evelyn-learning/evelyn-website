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
  const last = stripUnbalancedQuotes(questions?.[questions.length - 1] ?? '');
  if (!last || last.length > QPIN_MAX_CHARS) return null;
  return last;
}

/** Task 29 §F (GDI run 16, 608 s / 749 s): a question cut after a quoted
 *  sentence kept that quote's closing mark at its start — `" Now, what was
 *  …?`. Strips leading / trailing quote marks ("“”'‘’「」『』) that are
 *  UNBALANCED in the text; a fully quoted sentence keeps its pair. */
const PAIRED_QUOTES: ReadonlyArray<[string, string]> = [['“', '”'], ['‘', '’'], ['「', '」'], ['『', '』']];
const SYMMETRIC_QUOTES = ['"', "'"];
const countOf = (s: string, c: string) => s.split(c).length - 1;
function edgeQuoteUnbalanced(s: string, c: string, atStart: boolean): boolean {
  if (SYMMETRIC_QUOTES.includes(c)) return countOf(s, c) % 2 === 1;
  for (const [open, close] of PAIRED_QUOTES) {
    if (c !== open && c !== close) continue;
    const opens = countOf(s, open);
    const closes = countOf(s, close);
    // a closer at the start / an opener at the end pairs with nothing there
    if ((atStart && c === close) || (!atStart && c === open)) return true;
    return c === open ? opens > closes : closes > opens;
  }
  return false;
}
export function stripUnbalancedQuotes(text: string): string {
  let s = (text ?? '').trim();
  for (let guard = 0; guard < 8 && s; guard++) {
    const first = s[0];
    const last = s[s.length - 1];
    if ('"“”\'‘’「」『』'.includes(first) && edgeQuoteUnbalanced(s, first, true)) { s = s.slice(1).trim(); continue; }
    if ('"“”\'‘’「」『』'.includes(last) && edgeQuoteUnbalanced(s, last, false)) { s = s.slice(0, -1).trim(); continue; }
    break;
  }
  return s;
}

/** Longest text a pin shows whole (lastQuestionSentence's cap). */
export const QPIN_MAX_CHARS = 220;

/** Sentences of a tutor turn. A boundary is terminal punctuation (with an
 *  optional closing quote/bracket) followed by whitespace and a capital or
 *  an opening quote, or a newline — so `starting with "I have..."` stays
 *  one sentence. */
export function splitSentences(text: string): string[] {
  return text
    .split(/\n+|(?<=[.!?…。！？]["”’)]?)\s+(?=[A-Z"“'‘(])/)
    .map((x) => x.trim())
    .filter(Boolean);
}

// Task 20 §E1 (GDI run 8, 1418 s): read / repeat asks ("please read the
// sentence "…" after me") are asks too.
const ASK_PHRASE = String.raw`(?:tell me|please (?:say|tell|try|give|read|repeat)|try|say|read|repeat|could you|can you|give me|describe|finish|complete)\b`;
const ASK_LEAD_RE = new RegExp(String.raw`^(?:(?:now|next|then|so),\s*)?` + ASK_PHRASE, 'i');
/** Task 20 §E1 (GDI run 8, 1302 s / 1418 s): an ask after a lead clause —
 *  "Now, you asked earlier about …, so please tell me one thing …", "Let's
 *  move on to the next part: please read the sentence …". The ask phrase
 *  introduced by ", so " / ": " / " — " inside the sentence; the pin text runs
 *  from the ask phrase on. */
// Fix round 1 (m2): after a lead clause only an unmistakable ask counts —
// "please …", "tell me", "could / can you", "give me" — never a bare say / try
// ("Pick any number — say 5 — and double it.").
const INNER_ASK_PHRASE = String.raw`(?:please\s+\w+|tell me|could you|can you|give me)\b`;
const INNER_ASK_RE = new RegExp(String.raw`(?:,\s*so\s+|:\s+|\s[—–]\s+)(?=` + INNER_ASK_PHRASE + ')', 'i');

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
  let askText = '';
  for (let i = sentences.length - 1; i >= 0; i--) {
    if (ASK_LEAD_RE.test(sentences[i])) { askIdx = i; askText = sentences[i]; break; }
    const inner = INNER_ASK_RE.exec(sentences[i]);
    if (inner) { askIdx = i; askText = sentences[i].slice(inner.index + inner[0].length); break; }
  }
  if (askIdx < 0) return null;
  for (let j = askIdx + 1; j < sentences.length; j++) {
    if (/[?？]["”’)]?\s*$/.test(sentences[j])) return null;
  }
  return capPinText(stripUnbalancedQuotes(askText));
}

// ─────────────────────────────────────────────────────────────────────────
// Task 28 §B (GDI run 15, 150–178 s: the level-set turn ended "Take a look at
// the board, and tell me one thing you do at work." — an ask with no "?" and
// no ask lead the pin knew, so the silent continuation fired and a second
// full turn re-asked it in other words). The turn's LAST sentence asks the
// student when it ends with "?", ends with a colon-led prompt ("Start with:
// …"), or carries an imperative ask at a clause start — after an optional
// lead ("Now," / "Next," / "Then," / "First," / "So," / "Take a look at the
// board, and" / "Look at the board and", "please") — in the second person
// (no "I'll" / "I will" / "let me" before it). One helper, used by every
// continuation decider (announcedTurnNeedsContinuation and the deciders that
// call it) and by turnEndsWithAsk.
// ─────────────────────────────────────────────────────────────────────────
const IMPERATIVE_ASK_VERB = String.raw`(?:tell me|say|try|give me|describe|explain|show me|read|repeat|answer|choose|pick|name|list|make a sentence|use|finish|complete)\b`;
const IMPERATIVE_ASK_LEAD = String.raw`(?:(?:now|next|then|first|so),\s*|take a look at the board,?\s*and\s+|look at the board,?\s*and\s+)*(?:please,?\s+)?`;
/** An imperative ask at a clause start: the sentence start, or after , ; : — –
 *  (optionally + and / so / then / now). */
// Fix round 1 (m-1): a verb read as a noun or an interjection ("use of
// articles", "list of verbs", "Say, that was …") or negated ("try not to
// worry") is no ask.
const IMPERATIVE_ASK_RE = new RegExp(String.raw`(?:^|[,;:—–]\s*(?:(?:and|so|then|now)\s+)?)` + IMPERATIVE_ASK_LEAD + IMPERATIVE_ASK_VERB + String.raw`(?!\s*(?:of\b|,|not\b))`, 'i');
/** A first-person plan before the verb ("I'll read it first, then …"). */
// Fix round 1 (m-1): "let me know …, and tell me …" is no first-person plan.
const FIRST_PERSON_PLAN_RE = /\b(?:I['’]ll|I will|I['’]m going to|I am going to|let me(?! know\b))\b/i;
/** A colon-led prompt closing the sentence ("Start with: …", "Begin with: …"). */
const COLON_PROMPT_RE = /\b(?:start|begin|starting|beginning)\s+with\s*:\s*\S/i;
const QUOTED_SPAN_RE = /"[^"\n]*"|“[^”\n]*”|「[^」\n]*」|『[^』\n]*』/g;
/** Task 28 §B: one sentence asks the student (see above). */
export function sentenceAsksStudent(sentence: string): boolean {
  const raw = stripMarkdownEmphasis(sentence ?? '').trim();
  if (!raw) return false;
  if (/[?？]["”’)\]]*\s*$/.test(raw)) return true;
  if (COLON_PROMPT_RE.test(raw)) return true;
  // quoted model words never count ("The sentence is "Tell me more."")
  const s = raw.replace(QUOTED_SPAN_RE, '"…"');
  const m = IMPERATIVE_ASK_RE.exec(s);
  if (!m) return false;
  return !FIRST_PERSON_PLAN_RE.test(s.slice(0, m.index + m[0].length));
}
/** Task 28 §B: the turn's LAST sentence asks the student (sentenceAsksStudent). */
export function lastSentenceAsks(text: string): boolean {
  const sentences = splitSentences(stripMarkdownEmphasis(text ?? ''));
  const last = sentences[sentences.length - 1];
  return !!last && sentenceAsksStudent(last);
}

/** Task 22 §A (GDI run 10, 574 s / 882 s): the turn ENDS with something the
 *  student must answer — its last sentence is a question, or the turn's last
 *  ask (lastAskSentence's shapes: an ask lead / an inner ask) sits in one of
 *  its last two sentences ("Could you tell me one result? Start with "As a
 *  result, …"."). Used to hold a due fixed-script auto-advance one turn so
 *  the answer lands on the part that asked it. */
export function turnEndsWithAsk(text: string): boolean {
  const sentences = splitSentences(stripMarkdownEmphasis(text ?? ''));
  if (!sentences.length) return false;
  if (/[?？]["”’)\]]*\s*$/.test(sentences[sentences.length - 1])) return true;
  // Task 28 §B: an imperative ask / colon-led prompt in the last sentence.
  if (sentenceAsksStudent(sentences[sentences.length - 1])) return true;
  for (let i = sentences.length - 1; i >= Math.max(0, sentences.length - 2); i--) {
    if (ASK_LEAD_RE.test(sentences[i]) || INNER_ASK_RE.test(sentences[i])) return true;
  }
  return false;
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
  const last = stripUnbalancedQuotes(questions?.[questions.length - 1] ?? '');
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

/**
 * Pronunciation auto-arm (Task 14 §F, GDI run 4: in the pronunciation part
 * the brain never called request_pronunciation_check — no clip was ever
 * measured — and the target word was never on the board).
 *
 * When the current segment lists pronunciation targets
 * (`metadata.pronunciation.words[] / sentences[]`) and a tutor turn asks the
 * learner to say one, the client arms the clip itself and paints the target.
 * A turn "asks for a target" when it QUOTES one of the listed words or
 * sentences, or when it ends with an ask containing say / repeat / "after me"
 * and quotes something (that quote is the target). A hyphenated syllable
 * pattern for the target ("re-spon-si-BIL-i-ties") becomes the card's gloss.
 *
 * Pure: no React, no I/O.
 */

export interface PronunciationTargets { words: string[]; sentences: string[] }
export interface PronunciationAutoTarget {
  referenceText: string;
  kind: 'word' | 'sentence';
  /** hyphenated syllable pattern for the target, when the turn gave one */
  gloss?: string;
  /** Task 21 §D1: the target is the sentence this turn put on the board
   *  (show_sentence / the auto card), not a quote in the text. */
  source?: 'card';
}

/** The segment's targets from `metadata.pronunciation`, or null. */
export function pronunciationTargetsOf(metadata: Record<string, unknown> | undefined | null): PronunciationTargets | null {
  const p = metadata?.pronunciation as { words?: unknown; sentences?: unknown } | undefined;
  if (!p || typeof p !== 'object') return null;
  const clean = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && !!x.trim()).map((x) => x.trim()) : []);
  const words = clean(p.words);
  const sentences = clean(p.sentences);
  return words.length || sentences.length ? { words, sentences } : null;
}

/** "…", “…”, 「…」, 『…』, ‘…’ spans (inner text, trimmed) with the text
 *  before each, in order. */
function quotedSpansAt(text: string): Array<{ text: string; before: string; after: string }> {
  const t = text ?? '';
  return [...t.matchAll(/"([^"\n]+)"|“([^”\n]+)”|「([^」\n]+)」|『([^』\n]+)』|‘((?:[^’\n]|’(?=\p{L}))+)’/gu)]
    .map((m) => ({ text: (m.slice(1).find((g) => g !== undefined) ?? '').trim(), before: t.slice(0, m.index ?? 0), after: t.slice((m.index ?? 0) + m[0].length) }))
    .filter((x) => !!x.text);
}

/** Task 21 §D2 (GDI run 9, 910 s: `Start with "I will..."` was armed as the
 *  target and the learner's free sentence scored 44/100 against "I will"): a
 *  sentence STARTER is never a target — a starter lead before the quote, or a
 *  quote ending in "..." / "…". */
const STARTER_LEAD_RE = /\b(?:start|starting|begin|beginning)\s+with\s*[:,]?\s*$/i;
const isStarterQuote = (q: { text: string; before: string }) => STARTER_LEAD_RE.test(q.before) || /(?:\.\.\.|…)\s*$/.test(q.text);
/** Task 21 §D2: a quote under 3 words is a target only when the turn asks
 *  for it right there — "Please say "will" once more", "Repeat "schedule"",
 *  or a colon introduction ("Listen: "schedule." Repeat after me."). */
const SHORT_TARGET_LEAD_RE = /[:：]\s*$/;
/** Fix round 2 (I4): the verb must GOVERN the short quote — 'We say "with",
 *  not "wiz". Say the sentence again.' armed "wiz" because a say / try verb sat
 *  somewhere in the sentence. Either the quote follows the verb directly
 *  (say / repeat / try / pronounce [after me,] "…"), or the verb is at most
 *  three words before it and only once more / again / slowly … ends the
 *  sentence after it ('Please say the word "will" once more, slowly.'). */
const SHORT_TARGET_DIRECT_RE = /\b(?:say|repeat|try|pronounce)\s+(?:after me,?\s*)?$/i;
const SHORT_TARGET_NEAR_RE = /\b(?:say|repeat|try|pronounce)(?:\s+after me,?)?(?:\s+[\p{L}'’]+){0,3}\s*$/iu;
const SHORT_TARGET_TAIL_RE = /^\s*(?:,?\s*(?:once more|again|slowly|carefully|for me|please)\b)*\s*[.!]?\s*(?:$|[.!?。！？]|\s+\p{Lu})/u;
/** Fix round 2 (I4 a): the turn asks for the whole sentence — no word target. */
// Fix round 3 (I5): only an ASK clause — a say / repeat / try / read verb
// governing the sentence in one of the turn's last two sentences; "Your
// sentence was clear." is praise, not an ask.
const WHOLE_SENTENCE_ASK_RE = /\b(?:say|repeat|try|read)\b[^.!?。！？]*?\b(?:the (?:whole|full|complete) sentence|your sentence|the sentence again)\b/i;
const asksWholeSentence = (turnText: string) =>
  (turnText ?? '').split(/(?<=[.!?。！？])\s+/).map((x) => x.trim()).filter(Boolean).slice(-2).some((x) => WHOLE_SENTENCE_ASK_RE.test(x));
/** Fix round 2 (I4 b): the wrong form of an "X, not Y" pair. */
const NEGATED_QUOTE_RE = /\b(?:not|instead of|rather than|never say)\s*$/i;
const WE_SAY_NOT_RE = /\bwe say\b[^.!?。！？]*\bnot\s*$/i;
// Task 21 fix round 4 (I6): a word INTRODUCED as the target ("The word is
// \"schedule\". Say it again, slowly.") is a word ask when the turn asks to say
// it — "it" is that word, not the sentence.
const SHORT_TARGET_INTRO_RE = /\b(?:the|this|that|our|your|next|first|new) (?:word|target|sound)(?: (?:is|was|will be))?\s*[:,]?\s*$/i;
const isShortTargetAsked = (q: { before: string; after: string; text: string }, turnText: string) => {
  if (asksWholeSentence(turnText) || NEGATED_QUOTE_RE.test(q.before) || WE_SAY_NOT_RE.test(q.before)) return false;
  return SHORT_TARGET_LEAD_RE.test(q.before) || SHORT_TARGET_DIRECT_RE.test(q.before)
    || (SHORT_TARGET_INTRO_RE.test(q.before) && SAY_ASK_RE.test(turnText))
    || (SHORT_TARGET_NEAR_RE.test(q.before) && SHORT_TARGET_TAIL_RE.test(q.after));
};
const SHORT_TARGET_MAX_WORDS = 2;
/** Task 21 §D1 (GDI run 9, 889 s: "Here is the first model. Listen and repeat
 *  after me." — the model only in a show_sentence call): a listen / repeat /
 *  say-it ask. */
const CARD_ASK_RE = /\b(?:listen|repeat|after me|say (?:it|this|that|the (?:sentence|model|line|phrase)))\b/i;

const FILLERS = new Set(['uh', 'um', 'er', 'erm', 'hmm', 'ah', 'oh']);
/** Fix round 1: lower-cased words with hesitations dropped. */
const fillerFree = (s: string) => norm(s).split(' ').filter((w) => w && !FILLERS.has(w)).join(' ');
/** Lower-cased Latin words, punctuation dropped. */
const norm = (s: string) => ((s ?? '').toLowerCase().match(/[a-z0-9]+(?:['’][a-z0-9]+)*/g) ?? []).join(' ');

/** Ask cue in the turn's LAST sentence(s): say / repeat / after me. */
const SAY_ASK_RE = /\b(?:say|repeat|after me)\b/i;

function lastSentences(text: string, n: number): string {
  const parts = (text ?? '').split(/(?<=[.!?。！？])\s+/).map((x) => x.trim()).filter(Boolean);
  return parts.slice(-n).join(' ');
}

/** Task 31 §C1: a quote that reports a measured result — "pronunciation of
 *  / result for / score for "…"", or the quote's own sentence goes on with
 *  scored / measured / out of 100. */
const MENTION_BEFORE_RE = /\b(?:pronunciation of|result (?:for|of)|score (?:for|of)|scored)\s*$/i;
const MENTION_AFTER_RE = /^[^.!?。！？]*\b(?:scored|measured|out of 100)\b/i;
function isMeasuredMention(q: { before: string; after: string }): boolean {
  return MENTION_BEFORE_RE.test(q.before) || MENTION_AFTER_RE.test(q.after);
}
/** Task 31 §C2: a listen / repeat ask without a say verb ("Please listen,
 *  then repeat after me." is caught by SAY_ASK_RE too). */
const LISTEN_ASK_RE = /\blisten\b/i;
/** Task 31 §C2 / §D: the lead of an unquoted colon target — an ask (repeat
 *  after me / listen (and|then) repeat / say / repeat / try [it / this / one
 *  sentence …]) or an introduction (the / this / next / one sentence / word
 *  [is]) — then a colon and the text. */
// Fix round 1 (I-3: "Try this: the stress is on the third syllable." armed the
// explanation): no bare try / try this lead — only repeat after me, listen
// (and|then) repeat, say / repeat (it / this / the sentence …).
const COLON_ASK_LEAD_RE = /\b(?:repeat after me|listen,?\s+(?:and\s+|then\s+|and then\s+)?repeat(?: after me)?|(?:say|repeat)(?: it| this| that| (?:the|this|one|a) (?:whole |full |complete )?(?:sentence|word|phrase|line))?)\s*[:：]\s*(.+)$/i;
const COLON_INTRO_LEAD_RE = /\b(?:(?:the|this|next|one|a|our|first) (?:sentence|word|phrase|line)(?: is)?)\s*[:：]\s*(.+)$/i;
const TURN_SENTENCES = (text: string) => (text ?? '').split(/(?<=[.!?。！？])\s+/).map((x) => x.trim()).filter(Boolean);
function cleanColonTarget(raw: string): string | null {
  const t = raw.replace(/^["“「『'‘]+|["”」』'’]+$/gu, '').replace(/[.,!;:]+$/u, '').trim();
  if (!t || /[?？]/.test(t) || !/[A-Za-z]/.test(t) || /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(t)) return null;
  const words = norm(t).split(' ').filter(Boolean);
  if (!words.length || words.length > 25) return null;
  // "responsibilities, responsibilities" — a trailing duplicate of the same word
  if (words.length === 2 && words[0] === words[1]) return t.split(/[\s,]+/)[0]!.trim();
  if (words.length === 1) return t;
  return looksLikeModelSentence(t) ? t : null;
}
/** Fix round 1 (I-3): a colon text of ≥ 2 words is a model to repeat only when
 *  it has ≥ 3 words and a finite verb (an auxiliary / be / have, an -ed form,
 *  or a pronoun subject + a word), and is not an explanation — no you / your,
 *  no "the stress / sound / syllable … is", "means", "because". Pure. */
const MODEL_EXPLANATION_RE = /\b(?:you|your|means|because)\b|\b(?:stress|sound|syllable|vowel|letter|intonation)s? (?:is|are|was|goes|falls)\b/i;
const MODEL_FINITE_RE = /\b(?:am|is|are|was|were|have|has|had|do|does|did|will|would|can|could|should|must|may|might|shall)\b|\b[a-z]{3,}ed\b|^(?:i|we|they|he|she|it|my \w+|our \w+)\s+[a-z]+/i;
export function looksLikeModelSentence(text: string): boolean {
  const t = (text ?? '').trim();
  if (norm(t).split(' ').filter(Boolean).length < 3) return false;
  if (MODEL_EXPLANATION_RE.test(t)) return false;
  return MODEL_FINITE_RE.test(t);
}
/** Task 31 §C2 / §D: the unquoted target of the turn's last ask, or null. In
 *  the last three sentences (latest first): a colon ask carries its target
 *  after the colon; a colon introduction counts when a listen / say / repeat
 *  ask is in that sentence or the next one. Pure. */
export function colonTarget(turnText: string): string | null {
  const sentences = TURN_SENTENCES(turnText);
  const start = Math.max(0, sentences.length - 3);
  for (let i = sentences.length - 1; i >= start; i -= 1) {
    const s = sentences[i]!;
    const ask = COLON_ASK_LEAD_RE.exec(s);
    if (ask) { const c = cleanColonTarget(ask[1]!); if (c) return c; }
    const intro = COLON_INTRO_LEAD_RE.exec(s);
    if (intro) {
      const window = `${s} ${sentences[i + 1] ?? ''}`;
      if (CARD_ASK_RE.test(window)) { const c = cleanColonTarget(intro[1]!); if (c) return c; }
    }
  }
  return null;
}

/** Task 31 §C3 (run 18, 1204 s: the sentence went up by handwrite, which the
 *  card rule ignored): a handwrite of a sentence — ≥ 3 words, no "?" — is
 *  the turn's shown sentence. */
export function handwriteShownSentence(text: unknown): string | null {
  if (typeof text !== 'string') return null;
  const t = text.trim();
  if (!t || /[?？]/.test(t) || (t.match(/[\p{L}\p{N}]+(?:['’][\p{L}]+)*/gu) ?? []).length < 3) return null;
  return t;
}

/** A hyphenated syllable pattern (≥ 3 parts) in the turn whose letters spell
 *  `word` (case-insensitive) — "re-spon-si-BIL-i-ties" for "responsibilities". */
export function syllablePatternFor(turnText: string, word: string): string | undefined {
  const target = norm(word).replace(/\s+/g, '');
  if (!target) return undefined;
  for (const m of (turnText ?? '').matchAll(/(?<![\p{L}-])\p{L}+(?:-\p{L}+){2,}(?![\p{L}-])/gu)) {
    if (m[0].replace(/-/g, '').toLowerCase() === target) return m[0];
  }
  return undefined;
}

/**
 * The target a tutor turn asks the learner to say, or null.
 *  1. a quoted span equal (case/punctuation ignored) to a listed word or
 *     sentence ⇒ that listed target (its authored spelling);
 *  2. else, when the turn's last two sentences carry say/repeat/"after me",
 *     the LAST quoted span of the turn (≤ 25 words, Latin letters) ⇒ it.
 * The gloss is a syllable pattern for a single-word target.
 */
export function detectPronunciationTarget(
  turnText: string,
  targets: PronunciationTargets,
  opts?: {
    /** Task 21 §D1: the sentence this turn's show_sentence (or auto card) put up */ shownSentence?: string | null;
    /** fix round 1 (m): the student's last utterance — a card repeating it is no model */ studentLast?: string | null;
  },
): PronunciationAutoTarget | null {
  const quoted = quotedSpansAt(turnText);
  const spans = quoted.map((q) => q.text);
  const listed: Array<{ text: string; kind: 'word' | 'sentence' }> = [
    ...targets.words.map((t) => ({ text: t, kind: 'word' as const })),
    ...targets.sentences.map((t) => ({ text: t, kind: 'sentence' as const })),
  ];
  let hit: { text: string; kind: 'word' | 'sentence' } | undefined;
  // Task 31 §C1 (GDI run 18, 1203 s: `Your pronunciation of "responsibilities"
  // scored 90 out of 100 … Next, let's try one sentence: … Please listen, then
  // repeat after me.` re-armed the measured word): a quote reporting a
  // measured result is a mention, not an ask — skipped when the turn asks
  // the student to say something.
  const sayAsk = SAY_ASK_RE.test(lastSentences(turnText, 2)) || LISTEN_ASK_RE.test(lastSentences(turnText, 2));
  // Task 42 §B (bot run r36, 972 s: 'so I'll keep to what you said: "<the
  // student's sentence>" … take one word from the list: responsibilities.
  // Listen, then repeat after me: responsibilities.' armed the student's
  // sentence): (1) a quote equal to the student's last utterance (filler-free,
  // like the card guard) is never a target; (2) a word / phrase the listen /
  // repeat ask names after a colon wins over any EARLIER quoted span.
  const studentQuote = (q: { text: string }) => !!opts?.studentLast && fillerFree(q.text) !== '' && fillerFree(q.text) === fillerFree(opts.studentLast);
  const askable = (sayAsk ? quoted.filter((q) => !isMeasuredMention(q)) : quoted).filter((q) => !studentQuote(q));
  const colonNamed = colonTarget(turnText);
  const colonAt = colonNamed ? turnText.lastIndexOf(colonNamed) : -1;
  const beforeColon = (q: { before: string }) => colonAt >= 0 && q.before.length < colonAt - 1;
  for (const q of askable) {
    if (beforeColon(q)) continue;
    const n = norm(q.text);
    const found = n ? listed.find((t) => norm(t.text) === n) : undefined;
    if (found) { hit = found; break; }
  }
  if (!hit && colonNamed) {
    const n = norm(colonNamed);
    hit = listed.find((t) => norm(t.text) === n) ?? { text: colonNamed, kind: n.split(' ').length === 1 ? 'word' : 'sentence' };
  }
  // fix round 1 (m): 'Try "customer" again.' is an ask too
  if (!hit && (SAY_ASK_RE.test(lastSentences(turnText, 2)) || /\btry\s+["“]/i.test(lastSentences(turnText, 2)))) {
    const last = [...askable].reverse().find((q) => {
      const n = norm(q.text).split(' ').filter(Boolean).length;
      if (!/[A-Za-z]/.test(q.text) || n > 25 || isStarterQuote(q)) return false;
      return n > SHORT_TARGET_MAX_WORDS || isShortTargetAsked(q, turnText);
    });
    if (last) {
      const text = last.text.replace(/[.,!?;:]+$/u, '').trim();
      hit = { text, kind: norm(text).split(' ').length === 1 ? 'word' : 'sentence' };
    }
  }
  // Task 31 §C2 / §D (run 18, 1141 s / 1203 s / 1233 s): an unquoted target
  // after a colon — "repeat after me: responsibilities.", "please repeat it:
  // <sentence>", or "let's try one sentence: <sentence>" followed by the
  // listen / repeat ask.
  if (!hit) {
    const colon = colonTarget(turnText);
    if (colon) {
      const n = norm(colon);
      hit = listed.find((t) => norm(t.text) === n) ?? { text: colon, kind: n.split(' ').length === 1 ? 'word' : 'sentence' };
    }
  }
  // Task 21 §D1: nothing quoted to arm, a listen / repeat ask, and a sentence
  // shown this turn ⇒ that sentence is the target.
  const shown = (opts?.shownSentence ?? '').trim();
  // Fix round 1 (m): never a question card, never the student's own sentence.
  const sameAsStudent = !!opts?.studentLast && fillerFree(shown) !== '' && fillerFree(shown) === fillerFree(opts.studentLast);
  if (!hit && shown && /[A-Za-z]/.test(shown) && !/[?？]["”’)]?\s*$/.test(shown) && !sameAsStudent && CARD_ASK_RE.test(lastSentences(turnText, 2))) {
    const text = shown.replace(/[,;:]+$/u, '').trim();
    return { referenceText: text, kind: norm(text).split(' ').length === 1 ? 'word' : 'sentence', source: 'card' };
  }
  if (!hit) return null;
  const gloss = hit.kind === 'word' ? syllablePatternFor(turnText, hit.text) : undefined;
  return { referenceText: hit.text, kind: hit.kind, ...(gloss ? { gloss } : {}) };
}

/**
 * Task 25 §D2 (GDI run 13, 1026–1044 s: the turn that advanced into the
 * pronunciation part presented its choice menu, yet the conversation answer
 * on the board was auto-armed as the target and the tutor said "say the
 * sentence after me" with the menu unanswered): no automatic arm on the turn
 * that ENTERS the part — arming starts from the next tutor turn.
 */
export function autoArmTargetForTurn(
  detected: PronunciationAutoTarget | null | undefined,
  opts: { partEntry: boolean },
): PronunciationAutoTarget | null {
  if (opts.partEntry) return null;
  return detected ?? null;
}

/** The last target armed this session (tool or auto path) and the segment it
 *  belongs to. */
export interface LastPronunciationTarget { referenceText: string; kind: string; segId: string }

/**
 * Task 18 §C (GDI run 6): the clip of target 2 came back not_attempted, the
 * tutor asked "Please say the sentence once more, and I'll check the words."
 * — no quoted target, so detectPronunciationTarget found nothing, nothing was
 * re-armed, and the repeat was never measured. Re-arm the LAST target when:
 * there is one, it belongs to the current segment, this turn detected no
 * target of its own, the brain did not call request_pronunciation_check, and
 * the turn is a repeat / say-it ask.
 */
export function shouldRearmPronunciation(input: {
  last: LastPronunciationTarget | null | undefined;
  detected: PronunciationAutoTarget | null | undefined;
  toolCalled: boolean;
  isRepeatAsk: boolean;
  segId: string | null | undefined;
}): boolean {
  const { last } = input;
  return !!last && !!last.referenceText && !!input.segId && last.segId === input.segId
    && !input.detected && !input.toolCalled && input.isRepeatAsk;
}

/** Task 18 §C: what the vendor recognised in a not-attempted clip, for the
 *  debug line. Note (review m6): the words are the vendor's REFERENCE words it
 *  did not mark omitted (a mispronounced word is listed under its reference
 *  spelling) — a match report, not an ASR transcript — `recognized="<words not omitted>" omitted=<n>/<reference words>`
 *  — so a missed clip (nothing recognised) reads apart from a wrong one. */
export function notAttemptedDetail(result: { words?: Array<{ word?: unknown; errorType?: unknown }> } | null | undefined): string {
  const words = Array.isArray(result?.words) ? result!.words! : [];
  const heard = words.filter((w) => w && w.errorType !== 'omission').map((w) => String(w.word ?? '')).filter(Boolean);
  // reference words = everything but the vendor's insertions
  const ref = words.filter((w) => w?.errorType !== 'insertion');
  const omitted = ref.filter((w) => w?.errorType === 'omission').length;
  return `recognized="${heard.join(' ')}" omitted=${omitted}/${ref.length}`;
}

/**
 * Task 20 §F2 (GDI run 8, 1416 s): after a measured re-ask the student asked
 * "Um, can you repeat where I was wrong?" — the clip came back not_attempted,
 * the brain had no measurement in hand and said "Your sentence was right too,
 * so there's no error to fix". The segment's last measured result is
 * re-delivered on a turn in the pronunciation part when the student's
 * utterance is a question (terminal ? or an auxiliary / wh opener) or its clip
 * was not attempted. null ⇒ nothing to re-deliver (no measurement for this
 * segment, a fresh measurement rides this turn, or neither trigger).
 */
export interface LastMeasuredPronunciation { note: string; at: number; segmentId: string; /** the sentence that was measured */ referenceText: string }
const STUDENT_QUESTION_OPENER_RE =
  /^\s*(?:(?:um+|uh+|er+|so|well|sorry|ok(?:ay)?|and|but)[,.]?\s+)*(?:can|could|would|will|do|does|did|is|are|was|were|should|may|how|what|why|where|when|which|who)\b/i;
export function isStudentQuestion(text: string): boolean {
  const t = (text ?? '').trim();
  return /[?？]\s*$/.test(t) || STUDENT_QUESTION_OPENER_RE.test(t);
}
export function measuredPronunciationRedelivery(input: {
  last: LastMeasuredPronunciation | null | undefined;
  segmentId: string | null | undefined;
  inPronunciationSegment: boolean;
  studentText: string;
  notAttempted: boolean;
  measuredThisTurn: boolean;
  /** Fix round 1 (m3): the armed / last pronunciation target — the
   *  measurement is re-sent only while it is still the measured sentence. */
  currentTarget: string | null | undefined;
}): string | null {
  const { last, segmentId, inPronunciationSegment, studentText, notAttempted, measuredThisTurn, currentTarget } = input;
  if (!last || !inPronunciationSegment || measuredThisTurn || !segmentId || last.segmentId !== segmentId) return null;
  if (!currentTarget || normTarget(currentTarget) !== normTarget(last.referenceText)) return null;
  if (/^\s*\[/.test(studentText ?? '')) return null; // runtime directives are not the student
  if (!notAttempted && !isStudentQuestion(studentText)) return null;
  return `[pronunciation check result — not from the student] Last measurement for "${last.referenceText}" (still the current target): ${last.note}`;
}
const normTarget = (s: string) => (s ?? '').toLowerCase().replace(/[^\p{L}\p{N}' ]+/gu, ' ').replace(/\s+/g, ' ').trim();

/** Task 23 §G1 (GDI run 11, 1094–1099 s: the clip measured 80/100 and the
 *  first attempt, "Good effort. Your overall sentence was clear and close to
 *  the…", was CUT as denied_correct): on a turn carrying a MEASURED
 *  pronunciation result the measured score is the verdict — the voice
 *  verdict hold / cut stands down ("Good effort" is not a denial there). */
export function voiceVerdictHoldStandsDown(measuredThisTurn: boolean): boolean {
  return measuredThisTurn === true;
}

/** Task 23 §G2: the instruction riding a re-delivered measurement on a retry. */
export const PRONUNCIATION_RETRY_INSTRUCTION =
  '[runtime note — not from the student] Your previous attempt was not spoken, so the student has not heard this measurement yet. Give the overall score and name the weak words and sounds from it, in one or two sentences, then continue.';
/** Task 23 §G2 (generalising Task 20 §F): ANY kill of a measured turn —
 *  validator retry, voice verdict cut, judge kill — re-delivers the turn's
 *  pronunciation note to the retry (the retry message replaces the turn's
 *  input, and in run 11 the retry said only "Yes, you've got it right…").
 *  null when the turn was not measured or no note was kept. */
export function pronunciationNoteForRetry(input: {
  measuredThisTurn: boolean;
  note: string | null | undefined;
  /** Fix round 1 (m8): the attempt's speech was cut (a kill, or a verdict cut
   *  before audio) — only then is the "not spoken … give the score" order
   *  true; after a fully delivered attempt the note rides alone. */
  attemptCut: boolean;
}): string | null {
  if (!input.measuredThisTurn || !input.note || !input.note.trim()) return null;
  return input.attemptCut ? `${input.note.trim()}\n${PRONUNCIATION_RETRY_INSTRUCTION}` : input.note.trim();
}

/** Task 24 §A4 (GDI run 12, 1092 s: the clip was silent, the recogniser heard
 *  the sentence word-perfect, and the tutor read "not attempted" aloud as
 *  "the transcript shows…"): the note the brain reads when nothing was
 *  scored but the learner's words matched the target. */
export const PRONUNCIATION_UNSCORED_NOTE =
  'The learner said the sentence (the words matched) but the recording could not be scored this time. Confirm the sentence in one short sentence and ask them to say it once more so you can listen. Do not mention recordings, transcripts, captures, checks or scores.';

/** The planted pronunciation note for this brain turn: unscored + the turn's
 *  transcript said the target ⇒ PRONUNCIATION_UNSCORED_NOTE; otherwise the
 *  note unchanged (a measured result, or a not-attempted / unavailable note
 *  whose transcript is not the target). `saidTarget` is the caller's
 *  `saidModelSentence(referenceText, transcript)`. Pure. */
export function pronunciationNoteForTurn(input: { note: string; measured: boolean; notAttempted: boolean; saidTarget: boolean }): string {
  if (!input.measured && input.saidTarget) return PRONUNCIATION_UNSCORED_NOTE;
  return input.note;
}

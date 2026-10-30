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
/** Fix round 1 (m): a try / repeat / say verb anywhere in the quote's own
 *  sentence ('Try "customer" again.', 'Repeat after me, "schedule".'). */
const SHORT_TARGET_VERB_RE = /\b(?:say|try|repeat|pronounce|practi[sc]e)\b/i;
function quoteSentence(q: { before: string; after: string; text: string }): string {
  // the quote's own text may end in "." — the sentence runs on to the next end after the quote
  const head = q.before.slice(Math.max(q.before.search(/[^.!?。！？]*$/), 0));
  const tail = /^[^.!?。！？]*/.exec(q.after)?.[0] ?? '';
  return `${head} ${tail}`;
}
const isShortTargetAsked = (q: { before: string; after: string; text: string }) => SHORT_TARGET_LEAD_RE.test(q.before) || SHORT_TARGET_VERB_RE.test(quoteSentence(q));
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
  for (const sp of spans) {
    const n = norm(sp);
    const found = n ? listed.find((t) => norm(t.text) === n) : undefined;
    if (found) { hit = found; break; }
  }
  // fix round 1 (m): 'Try "customer" again.' is an ask too
  if (!hit && (SAY_ASK_RE.test(lastSentences(turnText, 2)) || /\btry\s+["“]/i.test(lastSentences(turnText, 2)))) {
    const last = [...quoted].reverse().find((q) => {
      const n = norm(q.text).split(' ').filter(Boolean).length;
      if (!/[A-Za-z]/.test(q.text) || n > 25 || isStarterQuote(q)) return false;
      return n > SHORT_TARGET_MAX_WORDS || isShortTargetAsked(q);
    });
    if (last) {
      const text = last.text.replace(/[.,!?;:]+$/u, '').trim();
      hit = { text, kind: norm(text).split(' ').length === 1 ? 'word' : 'sentence' };
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

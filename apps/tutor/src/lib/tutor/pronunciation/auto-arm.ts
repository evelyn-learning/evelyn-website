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

/** "…", “…”, 「…」, 『…』, ‘…’ spans (inner text, trimmed), in order. */
function quotedSpans(text: string): string[] {
  return [...(text ?? '').matchAll(/"([^"\n]+)"|“([^”\n]+)”|「([^」\n]+)」|『([^』\n]+)』|‘((?:[^’\n]|’(?=\p{L}))+)’/gu)]
    .map((m) => (m.slice(1).find((g) => g !== undefined) ?? '').trim())
    .filter(Boolean);
}

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
export function detectPronunciationTarget(turnText: string, targets: PronunciationTargets): PronunciationAutoTarget | null {
  const spans = quotedSpans(turnText);
  if (spans.length === 0) return null;
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
  if (!hit && SAY_ASK_RE.test(lastSentences(turnText, 2))) {
    const last = [...spans].reverse().find((sp) => /[A-Za-z]/.test(sp) && norm(sp).split(' ').length <= 25);
    if (last) {
      const text = last.replace(/[.,!?;:]+$/u, '').trim();
      hit = { text, kind: norm(text).split(' ').length === 1 ? 'word' : 'sentence' };
    }
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

/**
 * Tutor brain v2 — Task 7h: a target word in the tutor's speech is set apart by a short pause.
 *
 * In "Please add "an" before "important customer"." the voice gave the quoted words no stress: rewriteForTTS strips
 * every double quote before the voice sees the text (mic test 2, embed-1794941004529, flag 8). The voice has no
 * emphasis tag, and capitals are not for emphasis; it has a break tag, `<break time="200ms"/>`, inline in the
 * transcript (https://docs.cartesia.ai/build-with-cartesia/sonic-3/ssml-tags). The vendor warns that several breaks in
 * quick succession can make the model hallucinate, and that each break splits the generation.
 *
 * So, in a spoken lesson that teaches a language: a short quoted target (a word, an ending such as "-ed", a phrase of at
 * most V2_TARGET_MAX_WORDS words, in Latin script) gets one break before and one after, at most V2_TARGET_MAX_PER_PART
 * targets in what goes to the voice at once (one speech part: each is its own generation request); targets close
 * together share their breaks (targetPauses); a quoted sentence (more words) gets none. Two steps, either side of
 * rewriteForTTS: markTargets turns the quotes into private-use marks, which rewriteForTTS passes through (its own quote
 * stripping, and its `"` / `/` rules, would wreck a tag written before it); targetPauses turns the marks into the tags.
 * Only the voice's text changes: the transcript, the captions and the board keep the quotes.
 */

/** The pause either side of a target. */
export const V2_TARGET_PAUSE_MS = 200;
/** A quoted span of more words than this is a sentence, not a target. */
export const V2_TARGET_MAX_WORDS = 3;
/** At most this many targets get pauses in one piece of speech (a sentence, or one language part of it). */
export const V2_TARGET_MAX_PER_PART = 2;

const OPEN = '';
const CLOSE = '';
const BREAK = `<break time="${V2_TARGET_PAUSE_MS}ms"/>`;
const QUOTED = /"([^"\n]+)"|“([^“”\n]+)”|「([^「」\n]+)」/g;
/** A target: one to three Latin words, the first may be an ending ("-ed"); a trailing stop or comma may sit inside. */
const TARGET = new RegExp(`^-?[A-Za-z][A-Za-z'’-]*(?:\\s+[A-Za-z][A-Za-z'’-]*){0,${V2_TARGET_MAX_WORDS - 1}}[.,;:!?]?$`);

/** The first V2_TARGET_MAX_PER_PART short quoted targets, their quotes replaced by marks. Anything else unchanged. */
export function markTargets(text: string): string {
  let n = 0;
  return text.replace(QUOTED, (whole, a?: string, b?: string, c?: string) => {
    const inner = (a ?? b ?? c ?? '').trim();
    if (n >= V2_TARGET_MAX_PER_PART || !TARGET.test(inner)) return whole;
    n += 1;
    return `${OPEN}${inner}${CLOSE}`;
  });
}

/** Fewer words than this between two targets: they share their breaks (Task 7h fix round 1, I2). */
export const V2_TARGET_BREAK_MIN_WORDS = 4;
const wordCount = (t: string) => (t.match(/[\p{L}\p{N}]+/gu) ?? []).length;

/** The marks as the voice's break tags, after rewriteForTTS. One target: a break before it and one after. Several in one
 *  piece of speech: a break before the first and one after the last, and between two neighbours a single break (after
 *  the first of them) only when V2_TARGET_BREAK_MIN_WORDS words or more lie between them; never two tags back to back.
 *  Fix round 1 (I2): Please add "an" before "important customer" had four breaks in five words, and "a" "an" two tags
 *  with only a space between, where the vendor warns that breaks in quick succession can make the voice hallucinate.
 *  A stray mark is removed. */
export function targetPauses(spoken: string): string {
  const spans = [...spoken.matchAll(new RegExp(`${OPEN}\\s*([^${OPEN}${CLOSE}]*?)\\s*${CLOSE}`, 'g'))].filter((m) => m[1]);
  let out = ''; let at = 0;
  spans.forEach((m, i) => {
    const start = m.index ?? 0; const end = start + m[0].length;
    out += spoken.slice(at, start);
    if (i === 0) out += BREAK;
    out += m[1];
    const next = spans[i + 1];
    if (!next || wordCount(spoken.slice(end, next.index ?? end)) >= V2_TARGET_BREAK_MIN_WORDS) out += BREAK;
    at = end;
  });
  out += spoken.slice(at);
  return out.replace(new RegExp(`[${OPEN}${CLOSE}]`, 'g'), '');
}

/** The voice's text for one piece of speech with its targets set apart: `rewrite` is the rest of the speech path
 *  (rewriteForTTS and the steps before it). `on`: a spoken language lesson with TUTOR_V2_TARGET_PAUSE on. */
export function withTargetPauses(text: string, rewrite: (s: string) => string, on: boolean): string {
  if (!on) return rewrite(text);
  const marked = markTargets(text);
  return marked === text ? rewrite(text) : targetPauses(rewrite(marked));
}

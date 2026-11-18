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

import { TUTOR_V2_CARD_STRESS_SPOKEN } from '../orchestrator/flags';

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
export function markTargets(text: string, max: number = V2_TARGET_MAX_PER_PART): string {
  let n = 0;
  return text.replace(QUOTED, (whole, a?: string, b?: string, c?: string) => {
    const inner = (a ?? b ?? c ?? '').trim();
    if (n >= max || !TARGET.test(inner)) return whole;
    n += 1;
    return `${OPEN}${inner}${CLOSE}`;
  });
}

/** Fewer words than this between two targets: they share their breaks (Task 7h fix round 1, I2). */
export const V2_TARGET_BREAK_MIN_WORDS = 4;
const wordCount = (t: string) => (t.match(/[\p{L}\p{N}]+/gu) ?? []).length;

/** The marks as the voice's break tags, after rewriteForTTS. Each target gets a break before it and one after, except
 *  that neighbours with fewer than V2_TARGET_BREAK_MIN_WORDS words between them share: one break before the first and
 *  one after the last, none between (so never two tags back to back). Targets that far apart or more keep their own.
 *  Fix round 1 (I2): Please add "an" before "important customer" had four breaks in five words, and "a" "an" two tags
 *  with only a space between, where the vendor warns that breaks in quick succession can make the voice hallucinate.
 *  A stray mark is removed. */
export function targetPauses(spoken: string): string {
  const spans = [...spoken.matchAll(new RegExp(`${OPEN}\\s*([^${OPEN}${CLOSE}]*?)\\s*${CLOSE}`, 'g'))].filter((m) => m[1]);
  let out = ''; let at = 0;
  spans.forEach((m, i) => {
    const start = m.index ?? 0; const end = start + m[0].length;
    out += spoken.slice(at, start);
    const prev = spans[i - 1];
    const apart = (a: RegExpMatchArray, b: RegExpMatchArray) => wordCount(spoken.slice((a.index ?? 0) + a[0].length, b.index ?? 0)) >= V2_TARGET_BREAK_MIN_WORDS;
    if (!prev || apart(prev, m)) out += BREAK;
    out += m[1];
    const next = spans[i + 1];
    if (!next || apart(m, next)) out += BREAK;
    at = end;
  });
  out += spoken.slice(at);
  return out.replace(new RegExp(`[${OPEN}${CLOSE}]`, 'g'), '');
}

/** Task 7l: Japanese script in a part: a part led in Japanese (an English target quoted inside a Japanese sentence). */
const JAPANESE = /[\u3040-\u30ff\u4e00-\u9fff]/;
/** A mark that already pauses: a target after one of these (or a sentence's start) gets no mark before it, and a target
 *  followed by one gets none after it. */
const PAUSING = /[,.;:!?\u3001\u3002\uff0c\uff1a\uff1b\uff01\uff1f\u2014\u2013\u2026]/;

/** Task 7l: the marks as punctuation, after rewriteForTTS: no break tag. mic test 3 (embed-1794967959470, flags 3 and 4):
 *  each break tag splits the generation (the voice falls before it, the 200 ms became about 0.6 s). The product owner
 *  chose by ear from the 7j samples: led in English, a long dash either side of the target (option J: "we need — have
 *  worked — here, not — work."); led in Japanese, a comma either side (option I: "には、attended、を使います。").
 *  Each target is set apart on its own. Nothing is added after a target that carries its own stop or comma, or that ends
 *  the text or sits before a mark that pauses (so never a mark after a sentence's own full stop); nothing before a
 *  target at the start of the text or after a comma, colon, stop or dash (never doubled). No dash or comma is a word
 *  and neither splits the sentence into two requests (the voice gets the string whole). A stray mark is removed. */
export function targetPunctuation(spoken: string): string {
  const ja = JAPANESE.test(spoken);
  const spans = [...spoken.matchAll(new RegExp(`${OPEN}\\s*([^${OPEN}${CLOSE}]*?)\\s*${CLOSE}`, 'g'))].filter((m) => m[1]);
  let out = ''; let at = 0;
  for (const m of spans) {
    const start = m.index ?? 0; const end = start + m[0].length;
    out += spoken.slice(at, start);
    const prev = out.trimEnd();
    if (prev && !PAUSING.test(prev.slice(-1))) out = prev + (ja ? '\u3001' : ' \u2014 ');
    out += m[1];
    const rest = spoken.slice(end).trimStart();
    if (!/[.,;:!?]$/.test(m[1]!) && rest && !PAUSING.test(rest[0]!)) {
      out += ja ? '\u3001' : ' \u2014';
      if (!ja && !/^\s/.test(spoken.slice(end))) out += ' ';
    }
    at = end;
  }
  out += spoken.slice(at);
  return out.replace(new RegExp(`[${OPEN}${CLOSE}]`, 'g'), '');
}

/** Task 7m (CARD_STRESS_SPOKEN): a sentence card of this reply, its sentence and its stressed words (`<board sentence
 *  stress="…">`, show_sentence.emphasis). */
export interface V2CardStress { sentence: string; stress: readonly string[] }

const wordsOf = (t: string) => (t.toLowerCase().match(/[\p{L}\p{N}'’]+/gu) ?? []).join(' ');
const escapeRe = (w: string) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** The first occurrence of each word as a whole word (Latin letters either side do not count), marked; at most `max`. */
function markWords(text: string, words: readonly string[], max: number): { text: string; n: number } {
  let out = text; let n = 0;
  for (const w of words) {
    if (n >= max) break;
    const re = new RegExp(`(?<![A-Za-z'’${OPEN}])${escapeRe(w)}(?![A-Za-z'’${CLOSE}])`, 'i');
    const m = re.exec(out);
    if (!m) continue;
    out = `${out.slice(0, m.index)}${OPEN}${m[0]}${CLOSE}${out.slice(m.index + m[0].length)}`; n += 1;
  }
  return { text: out, n };
}

/** Task 7m (CARD_STRESS_SPOKEN, mic test 4 flag 1, embed-1795028886172 3.68 min): the corrected word of a sentence card set
 *  apart where it is heard. The card "I work in sales in the home appliance division." (stress "the") was spoken from its body
 *  only, and the reply's quoted correction "in the home appliance division." is four words (more than a 7h target): "the" was
 *  heard nowhere apart. Marks (as markTargets makes) go around a card's stressed words (a Latin word or phrase of at most
 *  V2_TARGET_MAX_WORDS words) in a piece of speech that IS the card's sentence, and around them inside a longer quoted span that
 *  holds one (the stress word only, never the whole quote). At most V2_TARGET_MAX_PER_PART marks a piece. Pure. */
export function markStressed(text: string, cards: readonly V2CardStress[] = [], enabled: boolean = TUTOR_V2_CARD_STRESS_SPOKEN): string {
  if (!enabled || !cards.length) return text;
  const stressOf = (c: V2CardStress) => c.stress.map((w) => w.trim()).filter((w) => TARGET.test(w));
  const me = wordsOf(text);
  const own = cards.find((c) => me && wordsOf(c.sentence) === me && stressOf(c).length);
  if (own) return markWords(text, stressOf(own), V2_TARGET_MAX_PER_PART).text;
  const all = [...new Set(cards.flatMap(stressOf))];
  if (!all.length) return text;
  let n = 0;
  return text.replace(QUOTED, (whole, a?: string, b?: string, c?: string) => {
    const inner = (a ?? b ?? c ?? '').trim();
    if (n >= V2_TARGET_MAX_PER_PART || TARGET.test(inner)) return whole;
    const marked = markWords(whole, all, V2_TARGET_MAX_PER_PART - n);
    n += marked.n;
    return marked.text;
  });
}

/** The voice's text for one piece of speech with its targets set apart: `rewrite` is the rest of the speech path
 *  (rewriteForTTS and the steps before it). `on`: a spoken language lesson with TUTOR_V2_TARGET_PAUSE on.
 *  `byPunctuation` (Task 7l, TUTOR_V2_TARGET_PUNCT): dashes / commas instead of the 7h break tags.
 *  `stress` (Task 7m, CARD_STRESS_SPOKEN): the sentence cards of this reply so far; their stressed words are marked first
 *  (markStressed), then short quoted targets up to the same cap. */
export function withTargetPauses(text: string, rewrite: (s: string) => string, on: boolean, byPunctuation = false, stress: readonly V2CardStress[] = []): string {
  if (!on) return rewrite(text);
  const stressed = markStressed(text, stress);
  const used = (stressed.match(new RegExp(OPEN, 'g')) ?? []).length;
  const marked = used ? markTargets(stressed, V2_TARGET_MAX_PER_PART - used) : markTargets(text);
  return marked === text ? rewrite(text) : (byPunctuation ? targetPunctuation : targetPauses)(rewrite(marked));
}

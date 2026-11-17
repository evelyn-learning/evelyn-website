/**
 * Tutor brain v2 — a sound written with phonetic symbols, spoken in words (Task 7c, SPOKEN_SOUNDS).
 *
 * Mic test 1 (embed-1794882458629, t≈16.42): "The ending of "was" is a buzzing /z/ sound, not /s/." reached the voice with
 * its slashes; the plain-speech chain (TutorVoiceV2.tsx speakSlashes) read "/s/" as "per second". For the voice only, a
 * sound between slashes ("/z/", "/ʃ/", "/tʃ/", "/iː/": one to four IPA letters, or one or two plain ones) or in phonetic
 * brackets ("[z]", "[θ]") becomes words: "the z sound", or just "z" where "sound" is already beside it ("a buzzing z
 * sound"). The board and the stored reply keep the symbols. Fractions, dates, "and/or", "km/h", URLs and paths are left:
 * the symbol must stand alone between spaces or punctuation, with no digit, capital or dot in it. Pure.
 */
import { IPA_SPOKEN } from '../voice/tts-pronunciation';

/** A letter a sound is written with: lowercase Latin or IPA (with length and stress marks, combining marks). */
const SOUND_LETTER = /^[a-zæçðøŋœɐ-ʯβθχ]$/u;
const MARKS = /[\u02D0\u02D1\u02C8\u02CC\u0300-\u036F]/gu;
/** Before the symbol: the start, a space, a bracket or a quote. After it: the end, a space or punctuation. */
const BEFORE = /(?:^|[\s(“‘'"「『（])$/u;
const AFTER = /^(?:$|[\s.,!?;:)”’'"」』）、。！？])/u;

/** Spellings of a sound in three or four plain letters, as phonics writes them. */
const LONG_SPELLINGS = new Set(['igh', 'tch', 'dge', 'air', 'ear', 'eer', 'ure', 'oor', 'ore', 'our', 'ere', 'are']);

function letters(inner: string): string | null {
  const base = inner.replace(MARKS, '');
  if (!base || [...base].length > 4 || ![...base].every((c) => SOUND_LETTER.test(c))) return null;
  return base;
}

/** The sound's name in words: "θ" → "th", "tʃ" → "ch", "z" → "z". */
function nameOf(inner: string, base: string): string {
  return IPA_SPOKEN[inner] ?? IPA_SPOKEN[inner.replace(/[ˈˌ]/g, '')] ?? IPA_SPOKEN[base] ?? base;
}

/** The speech text with each written sound in words. `text` is one sentence (or part of one) about to be spoken. */
export function v2SpeakSounds(text: string): string {
  if (!text || !/[/[]/.test(text)) return text;
  return text.replace(/\/([^\s/]{1,10})\/|\[([^\s[\]]{1,10})\]/gu, (m: string, slashed: string | undefined, bracketed: string | undefined, at: number, all: string) => {
    const inner = slashed ?? bracketed ?? '';
    const before = all.slice(0, at); const after = all.slice(at + m.length);
    if (!BEFORE.test(before) || !AFTER.test(after)) return m;
    const base = letters(inner);
    if (!base) return m;
    // Plain letters: one or two ("/s/", "/th/"), or a longer spelling of a sound ("/igh/"): "/help/" and "/api/" are words or
    // paths. In brackets only a single letter or an IPA symbol: "[sic]", "[a]nd" and "[OH]" are not sounds.
    const ascii = /^[a-z]+$/.test(base);
    if (ascii && base.length > 2 && !LONG_SPELLINGS.has(base)) return m;
    if (bracketed !== undefined && ascii && base.length > 1) return m;
    const name = nameOf(inner, base);
    if (/^\s*(?:sounds?\b|[」』]?\s*の?音)/iu.test(after) || /\bsounds?\s*$/i.test(before)) return name;
    if (/\b(?:the|a|an|this|that)\s+$/i.test(before)) return `${name} sound`;
    return `the ${name} sound`;
  });
}

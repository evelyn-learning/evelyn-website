/**
 * Tutor brain v2 — a sound written with phonetic symbols, spoken in words (Task 7c, SPOKEN_SOUNDS).
 *
 * Mic test 1 (embed-1794882458629, t≈16.42): "The ending of "was" is a buzzing /z/ sound, not /s/." reached the voice with
 * its slashes; the plain-speech chain (TutorVoiceV2.tsx speakSlashes) read "/s/" as "per second". For the voice only, a
 * sound between slashes ("/z/", "/ʃ/", "/tʃ/", "/iː/": one to four IPA letters, or one or two plain ones) or in phonetic
 * brackets ("[θ]"; plain letters only with "sound" beside: "the [z] sound") becomes words: "the z sound", or just
 * "z" where "sound" is already beside it ("a buzzing z sound"). The board and the stored reply keep the symbols.
 * Fractions, dates, "and/or", "km/h", URLs and paths are left: the symbol must stand alone between spaces or punctuation,
 * with no digit, capital or dot in it. Pure.
 */
import { IPA_SPOKEN } from '../voice/tts-pronunciation';
import { TUTOR_V2_WAVE_DASH } from '../orchestrator/flags';

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

/** Fix round 1 (review M2): English vowels and other symbols the shared map leaves out, named as a learner hears them. */
const MORE_NAMES: Record<string, string> = {
  'ɜː': 'er', 'ɜ': 'er', 'ɝ': 'er', 'ɚ': 'er', 'ʊə': 'oor', 'ɪə': 'ear', 'eə': 'air', 'ɛə': 'air', 'aʊ': 'ow', 'ɔɪ': 'oy',
  'ʌ': 'uh', 'ɒ': 'o', 'ɑ': 'ah', 'ɛ': 'e', 'e': 'e', 'uː': 'oo', 'u': 'oo', 'i': 'ee', 'ɔ': 'or', 'o': 'oh', 'ɐ': 'uh',
  'j': 'y', 'ɡ': 'g', 'ɫ': 'l', 'ɾ': 'quick t', 'ʔ': 'glottal stop', 'ʍ': 'wh', 'x': 'kh', 'ɲ': 'ny', 'ʎ': 'ly',
};
/** A name the voice can say: plain letters and spaces. */
const SAYABLE = /^[a-z ]+$/;

/** The sound's name in words ("θ" → "th", "tʃ" → "ch", "ɜː" → "er", "z" → "z"), or null when there is none to say (an IPA
 *  symbol no map names is never read out raw). */
function nameOf(inner: string, base: string): string | null {
  const plain = inner.replace(/[ˈˌ]/g, '');
  // Task 7d (7c re-review): plain letters are ambiguous between IPA and phonics ("/i/ as in sit", "/u/ as in cup"), so a
  // name for them could be the wrong sound: they are spoken as written. MORE_NAMES is for non-ASCII symbols only.
  if (/^[a-z]+$/.test(plain)) return plain;
  const name = IPA_SPOKEN[inner] ?? IPA_SPOKEN[plain] ?? MORE_NAMES[plain] ?? IPA_SPOKEN[base] ?? MORE_NAMES[base] ?? base;
  return SAYABLE.test(name) ? name : null;
}

/** A word that names what the symbol is, beside it: "a buzzing /z/ sound", "the /ʊə/ vowel", 「/z/」の音. */
const KIND_AFTER = /^\s*(?:(?:sounds?|vowels?|consonants?|diphthongs?)\b|[」』]?\s*の?音)/iu;
const KIND_BEFORE = /\b(?:sounds?|vowels?|consonants?|diphthongs?)\s*$/i;

/** A symbol taken out with nothing in its place (its space goes with it). */
const GONE = '\u0001';

/** The speech text with each written sound in words. `text` is one sentence (or part of one) about to be spoken. */
export function v2SpeakSounds(text: string): string {
  if (!text || !/[/[]/.test(text)) return text;
  return text.replace(/\/([^\s/]{1,10})\/|\[([^\s[\]]{1,10})\]/gu, (m: string, slashed: string | undefined, bracketed: string | undefined, at: number, all: string) => {
    const inner = slashed ?? bracketed ?? '';
    const before = all.slice(0, at); const after = all.slice(at + m.length);
    if (!BEFORE.test(before) || !AFTER.test(after)) return m;
    const base = letters(inner);
    if (!base) return m;
    const kindBeside = KIND_AFTER.test(after) || KIND_BEFORE.test(before);
    // Plain letters: one or two ("/s/", "/th/"), or a longer spelling of a sound ("/igh/"): "/help/" and "/api/" are words or
    // paths. Fix round 1 (review M1): in brackets, plain letters only with "sound" beside them ("Choose [a] or [b]." is a
    // choice); IPA in brackets is always a sound. "[sic]", "[a]nd" and "[OH]" are never sounds.
    const ascii = /^[a-z]+$/.test(base);
    if (ascii && base.length > 2 && !LONG_SPELLINGS.has(base)) return m;
    if (bracketed !== undefined && ascii && (base.length > 1 || !kindBeside)) return m;
    const name = nameOf(inner, base);
    // An IPA symbol with no name: "this sound", or no word at all where the kind is already said ("the /ɘ/ vowel" → "the vowel").
    if (name === null) return kindBeside ? GONE : /\b(?:the|a|an|this|that)\s+$/i.test(before) ? 'sound' : 'this sound';
    if (kindBeside) return name;
    if (/\b(?:the|a|an|this|that)\s+$/i.test(before)) return `${name} sound`;
    return `the ${name} sound`;
  }).replace(/\u0001 ?/g, '');
}

/** A number or a time either side of a wave dash: "3〜5", "9:00〜10:00", "9時〜10時", "1月〜3月". */
const RANGE_END_BEFORE = /[0-9０-９][0-9０-９:：.]*[時分秒月日年歳円人回個本枚点%％]?$/;
const RANGE_END_AFTER = /^[0-9０-９]/;
/** Task 7m (WAVE_DASH, mic test 4, embed-1795028886172 6.76 min): 「今、〜しています」 was heard as 「今、からしています」: the voice
 *  reads a wave dash (〜 U+301C, ～ U+FF5E) as "kara" ("from … to"). Standing for "something" (a gap in a pattern, 「〜で」), it is
 *  not spoken at all; joining two numbers or times ("3〜5人", "9:00〜10:00") it is kept, a range, read as before. For the voice
 *  only: the board and the transcript keep it. Pure. */
export function v2SpeakWaveDash(text: string, enabled: boolean = TUTOR_V2_WAVE_DASH): string {
  if (!enabled || !/[〜～]/.test(text)) return text;
  return text.replace(/\s*[〜～]\s*/g, (m, at: number) => {
    const before = text.slice(0, at); const after = text.slice(at + m.length);
    return RANGE_END_BEFORE.test(before) && RANGE_END_AFTER.test(after) ? m : /\s/.test(m) ? ' ' : '';
  });
}

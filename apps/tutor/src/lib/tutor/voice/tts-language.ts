/**
 * Per-sentence TTS language for a bilingual session.
 *
 * Cartesia synthesizes ONE language per request, and the tutor speaks
 * sentence by sentence, so a bilingual session picks the language per
 * sentence from the script it is written in. A sentence with any Japanese
 * script is sent as 'ja' — Japanese voices read the embedded English words
 * as loanwords, which is how a Japanese teacher says them too; an
 * all-Latin sentence is 'en'.
 *
 * Sessions without extra tutor languages get `undefined`, and callers then
 * omit the field, so every existing request is byte-identical.
 */

import { LESSON_LANGUAGES, lessonLanguageOf, sessionLanguageRows, taughtIn } from './lesson-language';

/** Tutor languages a tenant may switch on: the rows of lesson-language.ts (each has a recogniser, a voice and a
 *  script test). */
export const SUPPORTED_TUTOR_LANGUAGES: readonly string[] = LESSON_LANGUAGES.map((l) => l.code);
export type TutorLanguage = string;
/** The voice `language` values a session may send (the rows' Sonic codes). */
export const SUPPORTED_TTS_LANGUAGES: readonly string[] = [...new Set(LESSON_LANGUAGES.map((l) => l.tts))];

const KANA_SCRIPT = /[\p{Script=Hiragana}\p{Script=Katakana}]/u;
const HAN_SCRIPT = /\p{Script=Han}/u;
const JAPANESE_SCRIPT = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u;

/** Normalise a claim/flag value to the supported rows. English comes first whenever it is listed (an English
 *  lesson with a second language for help); a list without English keeps its order, and its first language is
 *  the one the lesson is taught in (lesson-language.ts taughtIn). Anything unusable, or English alone ⇒ null
 *  (= the default English-only session). */
export function parseTutorLanguages(raw: unknown): TutorLanguage[] | null {
  const list = typeof raw === 'string' ? raw.split(/[,\s]+/) : Array.isArray(raw) ? raw : null;
  if (!list) return null;
  const picked: string[] = [];
  for (const v of list) {
    const row = lessonLanguageOf(v);
    // One row per language: a second region of a language already listed adds nothing the voice could speak.
    if (row && !picked.some((c) => lessonLanguageOf(c)!.base === row.base)) picked.push(row.code);
  }
  const others = picked.filter((c) => c !== 'en');
  if (others.length === 0) return null;
  const ordered = picked.includes('en') ? ['en', ...others] : others;
  // One shared array per language set: callers pass this down as a React
  // prop/effect dependency, and a fresh array each render would re-fire them.
  const key = ordered.join(',');
  let cached = PARSED.get(key);
  if (!cached) { cached = ordered; PARSED.set(key, cached); }
  return cached;
}
const PARSED = new Map<string, TutorLanguage[]>();

/** The voice language of one sentence, from the script it is written in and the session's languages. A sentence
 *  with kana is Japanese; one with Han characters and no kana is Chinese in a session that has Chinese, else
 *  Japanese; a sentence with neither is English in a session that has English, and in a lesson taught in
 *  another language it is that language ("x = 4" in a Chinese lesson is said by the Chinese voice). */
export function ttsLanguageFor(text: string, languages: readonly string[] | null | undefined): string | undefined {
  if (!languages || languages.length === 0) return undefined;
  const rows = sessionLanguageRows(languages);
  const lesson = taughtIn(languages);
  if (!lesson && rows.length < 2) return undefined;
  const has = (base: string) => rows.find((r) => r.base === base);
  if (KANA_SCRIPT.test(text) && has('ja')) return 'ja';
  if (HAN_SCRIPT.test(text)) { const r = has('zh') ?? has('ja'); if (r) return r.tts; }
  for (const r of rows) if (r.script && r.base !== 'ja' && r.base !== 'zh' && r.script.test(text)) return r.tts;
  if (has('en')) return 'en';
  return lesson ? lesson.tts : 'en';
}

// ─────────────────────────────────────────────────────────────────────────
// Task 25 §B (GDI run 13, 889 s): 「My manager showed me slogans he had
// written earlier」ですね、… went whole to the Japanese voice, which read the
// English sentence as loanwords. A Japanese sentence that quotes an English
// span of 3+ words is spoken as consecutive parts — the frame before, the
// English span (quote marks stripped, a full stop added), the frame after —
// each with its own language. One- and two-word quotes (「for」) stay inside
// the Japanese request, which is how a teacher says a single loanword.
// No such span ⇒ one part, the language ttsLanguageFor gives today.
// ─────────────────────────────────────────────────────────────────────────

export interface TtsPart { text: string; language: string | undefined }

const QUOTED_SPAN_RE = /「([^「」]+)」|"([^"]+)"|“([^“”]+)”/g;
const LATIN_WORD_RE = /[A-Za-z][A-Za-z'’-]*/g;
const SPOKEN_CONTENT_RE = /[\p{L}\p{N}]/u;

/** Minimum Latin words a quoted span needs before it gets its own request. */
export const TTS_SPLIT_MIN_LATIN_WORDS = 3;

function quotedEnglish(inner: string): string | null {
  const t = inner.trim();
  if (!t || JAPANESE_SCRIPT.test(t)) return null;
  if ((t.match(LATIN_WORD_RE) ?? []).length < TTS_SPLIT_MIN_LATIN_WORDS) return null;
  const body = t.replace(/[,;:、，\s]+$/u, '');
  return /[.!?]$/.test(body) ? body : `${body}.`;
}

/**
 * The TTS requests one sentence is spoken as. A bilingual (non-Latin) session
 * whose Japanese sentence quotes an English span of 3+ words gets 2–N parts in
 * order; anything else gets exactly one part `{ text, language:
 * ttsLanguageFor(text, languages) }` with `text` unchanged.
 */
export function splitSentenceForTts(text: string, languages: readonly string[] | null | undefined): TtsPart[] {
  const whole: TtsPart[] = [{ text, language: ttsLanguageFor(text, languages) }];
  if (!languages || languages.length < 2 || !languages.includes('ja')) return whole;
  if (!JAPANESE_SCRIPT.test(text.replace(QUOTED_SPAN_RE, ' '))) return whole;
  const parts: TtsPart[] = [];
  const pushFrame = (frame: string) => {
    const f = frame.trim();
    if (f && SPOKEN_CONTENT_RE.test(f)) parts.push({ text: f, language: ttsLanguageFor(f, languages) });
  };
  let last = 0;
  let split = false;
  for (const m of text.matchAll(QUOTED_SPAN_RE)) {
    const english = quotedEnglish(m[1] ?? m[2] ?? m[3] ?? '');
    if (english === null) continue;
    pushFrame(text.slice(last, m.index));
    parts.push({ text: english, language: ttsLanguageFor(english, languages) });
    last = (m.index ?? 0) + m[0].length;
    split = true;
  }
  if (!split) return whole;
  pushFrame(text.slice(last));
  return parts.length > 1 ? parts : whole;
}

/**
 * Tutor brain v2, Task 7y (MIXED_SENTENCE_PARTS; v2/languages.ts v2SpeechParts is the only caller, v1 never calls it): the other
 * direction. A sentence led in Latin script (no Japanese outside its quotes) that quotes a Japanese span is spoken as parts: the
 * frame before (English), the Japanese span (its brackets left out), the rest (English); each part's language is then its own
 * script (ttsLanguageFor). Mic test 8 (embed-1795115593161, wall 02:56): "…so ask me one more: 「中国で誰に売りましたか？」 What
 * kind of customers…?" went whole to the Japanese voice, which read the English as loanwords. Null: not such a sentence (a
 * one-language session, Japanese outside the quotes, no Japanese span): the caller goes on as before.
 */
export function splitLatinLedForTts(text: string, languages: readonly string[] | null | undefined): TtsPart[] | null {
  if (!languages || languages.length < 2 || !languages.includes('ja')) return null;
  const outside = text.replace(QUOTED_SPAN_RE, ' ');
  if (JAPANESE_SCRIPT.test(outside) || !/[A-Za-z]/.test(outside)) return null;
  const parts: TtsPart[] = [];
  const push = (t: string) => {
    const f = t.trim();
    if (f && SPOKEN_CONTENT_RE.test(f)) parts.push({ text: f, language: ttsLanguageFor(f, languages) });
  };
  let last = 0;
  for (const m of text.matchAll(QUOTED_SPAN_RE)) {
    const inner = (m[1] ?? m[2] ?? m[3] ?? '').trim();
    if (!JAPANESE_SCRIPT.test(inner)) continue;
    push(text.slice(last, m.index));
    push(inner);
    last = (m.index ?? 0) + m[0].length;
  }
  if (last === 0) return null;
  push(text.slice(last));
  return parts.length > 1 ? parts : null;
}

/** Task 25 fix round 1 (I-2): the resume tail with the kept split sentence's
 *  remaining parts removed from its head (they are spoken right after the
 *  kill, so the resume must not play them again). */
export function keptRestRemoved(tail: readonly string[], rest: readonly string[]): string[] {
  let k = 0;
  while (k < rest.length && k < tail.length && tail[k] === rest[k]) k++;
  return tail.slice(k);
}

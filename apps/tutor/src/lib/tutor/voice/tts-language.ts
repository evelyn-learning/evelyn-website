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

/** Tutor languages a tenant may switch on. Each needs STT (ink-2) and TTS
 *  (sonic-3.6) support and a script test below before it joins this list. */
export const SUPPORTED_TUTOR_LANGUAGES = ['en', 'ja'] as const;
export type TutorLanguage = (typeof SUPPORTED_TUTOR_LANGUAGES)[number];

const JAPANESE_SCRIPT = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u;

/** Normalise a claim/flag value to the supported list, English always first.
 *  Anything unusable ⇒ null (= the default English-only session). */
export function parseTutorLanguages(raw: unknown): TutorLanguage[] | null {
  const list = typeof raw === 'string' ? raw.split(/[,\s]+/) : Array.isArray(raw) ? raw : null;
  if (!list) return null;
  const picked = new Set<TutorLanguage>();
  for (const v of list) {
    const code = typeof v === 'string' ? v.trim().toLowerCase().slice(0, 2) : '';
    if ((SUPPORTED_TUTOR_LANGUAGES as readonly string[]).includes(code)) picked.add(code as TutorLanguage);
  }
  picked.delete('en');
  if (picked.size === 0) return null;
  // One shared array per language set: callers pass this down as a React
  // prop/effect dependency, and a fresh array each render would re-fire them.
  const key = ['en', ...picked].join(',');
  let cached = PARSED.get(key);
  if (!cached) { cached = ['en', ...picked]; PARSED.set(key, cached); }
  return cached;
}
const PARSED = new Map<string, TutorLanguage[]>();

export function ttsLanguageFor(text: string, languages: readonly string[] | null | undefined): string | undefined {
  if (!languages || languages.length < 2) return undefined;
  if (languages.includes('ja') && JAPANESE_SCRIPT.test(text)) return 'ja';
  return 'en';
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

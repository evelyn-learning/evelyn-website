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

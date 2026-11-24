/**
 * The languages a demo lesson can be taught in, as the pickers on the marketing site and the developer portal
 * offer them. Each code is a row of the tutor engine's lesson-language table
 * (apps/tutor/src/lib/tutor/voice/lesson-language.ts): a language joins this list only once it has a row there
 * and a spoken test lesson has been run in it. English is the default and adds nothing to the session.
 *
 * Shared by both apps, so it holds no engine code: just what a picker shows and what the token carries.
 */
export interface DemoLanguage {
  /** The code the embed token carries in `tutor_languages`. */
  code: string;
  /** Its name in itself, as the picker shows it. */
  label: string;
  /** Its name in English, for the picker's title text and for analytics. */
  english: string;
}

export const DEMO_LANGUAGES: readonly DemoLanguage[] = [
  { code: 'en', label: 'English', english: 'English' },
  { code: 'zh-TW', label: '繁體中文', english: 'Chinese (Traditional)' },
  { code: 'zh-CN', label: '简体中文', english: 'Chinese (Simplified)' },
  { code: 'ja', label: '日本語', english: 'Japanese' },
];

/** What a demo's session config adds for a picked language: nothing for English (the session every demo was
 *  before), else the lesson's language as the token's `tutor_languages`. An unknown code adds nothing. */
export function demoLanguageClaims(code: string | null | undefined): { tutor_languages?: string[] } {
  const row = DEMO_LANGUAGES.find((l) => l.code === code);
  return row && row.code !== 'en' ? { tutor_languages: [row.code] } : {};
}

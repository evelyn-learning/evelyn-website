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
  /** A first topic every school system teaches, named in the language (a demo with no ready lesson opens on it). */
  firstTopic: string;
}

export const DEMO_LANGUAGES: readonly DemoLanguage[] = [
  { code: 'en', label: 'English', english: 'English', firstTopic: 'Solving linear equations' },
  { code: 'zh-TW', label: '繁體中文', english: 'Chinese (Traditional)', firstTopic: '一元一次方程式' },
  { code: 'zh-CN', label: '简体中文', english: 'Chinese (Simplified)', firstTopic: '一元一次方程' },
  { code: 'ja', label: '日本語', english: 'Japanese', firstTopic: '一次方程式' },
  // 2026-11-24. This built-in list is what a picker shows before the engine's live list arrives, and what names a
  // code elsewhere; the engine's table (GET /api/tutor-portal/languages) is the list that counts.
  { code: 'hi', label: 'हिन्दी', english: 'Hindi', firstTopic: 'रैखिक समीकरण' },
  { code: 'hi-Latn', label: 'Hinglish', english: 'Hinglish', firstTopic: 'Solving linear equations' },
  { code: 'fr', label: 'Français', english: 'French', firstTopic: 'Les équations du premier degré' },
  { code: 'es', label: 'Español', english: 'Spanish', firstTopic: 'Ecuaciones de primer grado' },
];

/** What a demo's session config adds for a picked language: nothing for English (the session every demo was
 *  before), else the lesson's language as the token's `tutor_languages`. An unknown code adds nothing. */
export function demoLanguageClaims(code: string | null | undefined): { tutor_languages?: string[] } {
  const row = DEMO_LANGUAGES.find((l) => l.code === code);
  return row && row.code !== 'en' ? { tutor_languages: [row.code] } : {};
}

/** The live list from the tutor engine (GET /api/tutor-portal/languages), for a picker to show in place of the
 *  built-in one: a language added to the engine then appears with no change here and no redeploy of this app.
 *  Null on any failure or an answer of the wrong shape: the caller keeps DEMO_LANGUAGES. English is always first. */
export async function fetchDemoLanguages(origin = ''): Promise<DemoLanguage[] | null> {
  try {
    const res = await fetch(`${origin}/api/tutor-portal/languages`, { cache: 'no-store' });
    if (!res.ok) return null;
    const body = (await res.json()) as { languages?: unknown };
    if (!Array.isArray(body.languages)) return null;
    const rows = body.languages.filter((l): l is DemoLanguage => !!l && typeof (l as DemoLanguage).code === 'string' && typeof (l as DemoLanguage).label === 'string' && typeof (l as DemoLanguage).english === 'string' && typeof (l as DemoLanguage).firstTopic === 'string');
    if (!rows.some((l) => l.code === 'en')) return null;
    return [...rows.filter((l) => l.code === 'en'), ...rows.filter((l) => l.code !== 'en')];
  } catch { return null; }
}

/** `demoLanguageClaims` for a list that came from the engine: the code is one the engine itself offered. */
export function languageClaims(code: string | null | undefined, offered: readonly DemoLanguage[]): { tutor_languages?: string[] } {
  const row = offered.find((l) => l.code === code);
  return row && row.code !== 'en' ? { tutor_languages: [row.code] } : {};
}

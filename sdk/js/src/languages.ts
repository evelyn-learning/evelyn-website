import { DEFAULT_EMBED_HOST } from './token.js';

/** A language a lesson can be taught in. */
export interface Language {
  /** The code to put in `tutor_languages` and `switch_languages`. */
  code: string;
  /** The language's name in itself, as a picker shows it. */
  label: string;
  /** The language's name in English. */
  english: string;
  /** A first topic in that language, for a demo or a test lesson. */
  firstTopic: string;
}

/**
 * The languages as they were when this version was released. `fetchLanguages` returns the service's current
 * list and falls back to this one when the network fails.
 */
export const BUNDLED_LANGUAGES: readonly Language[] = Object.freeze([
  { code: 'en', label: 'English', english: 'English', firstTopic: 'Solving linear equations' },
  { code: 'ja', label: '日本語', english: 'Japanese', firstTopic: '一次方程式' },
  { code: 'zh-TW', label: '繁體中文', english: 'Chinese (Traditional)', firstTopic: '一元一次方程式' },
  { code: 'zh-CN', label: '简体中文', english: 'Chinese (Simplified)', firstTopic: '一元一次方程' },
  { code: 'hi', label: 'हिन्दी', english: 'Hindi', firstTopic: 'रैखिक समीकरण' },
  { code: 'hi-Latn', label: 'Hinglish', english: 'Hinglish', firstTopic: 'Solving linear equations' },
  { code: 'fr', label: 'Français', english: 'French', firstTopic: 'Les équations du premier degré' },
  { code: 'es', label: 'Español', english: 'Spanish', firstTopic: 'Ecuaciones de primer grado' },
]);

function isLanguage(value: unknown): value is Language {
  const row = value as Language | null;
  return !!row && typeof row === 'object' && typeof row.code === 'string' && row.code !== '' && typeof row.label === 'string' && typeof row.english === 'string' && typeof row.firstTopic === 'string';
}

/**
 * The languages a lesson can be taught in, from the service's public list (no keys needed). Never throws:
 * when the list cannot be read within 5 seconds, the list bundled with this package is returned.
 */
export async function fetchLanguages(options: { embedHost?: string; fetch?: typeof fetch } = {}): Promise<Language[]> {
  const host = (options.embedHost ?? DEFAULT_EMBED_HOST).replace(/\/+$/, '');
  try {
    const response = await (options.fetch ?? fetch)(`${host}/api/tutor-portal/languages`, { signal: AbortSignal.timeout(5000) });
    const body = (await response.json()) as { languages?: unknown };
    if (response.ok && Array.isArray(body.languages) && body.languages.length > 0 && body.languages.every(isLanguage)) {
      return body.languages.map(({ code, label, english, firstTopic }) => ({ code, label, english, firstTopic }));
    }
  } catch {
    // Offline, blocked, slow, or not the list: the bundled list answers.
  }
  return BUNDLED_LANGUAGES.map((language) => ({ ...language }));
}

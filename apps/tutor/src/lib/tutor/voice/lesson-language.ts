/**
 * The languages a lesson can be TAUGHT IN: one row per language, and everything the engine needs to hear,
 * speak and write it. Engine code asks this table; it holds no language of its own.
 *
 * A session's languages (`tutor_languages` on the token, `V2Session.languages` on the server) list the lesson's
 * own language first. Two shapes exist:
 *   - English first with a second language (`['en', 'ja']`): an English lesson with help in the learner's
 *     language (v2/languages.ts, built for GDI). Unchanged by this file.
 *   - a first language that is not English (`['zh-TW']`, `['ja']`): the whole lesson — speech, board, questions —
 *     is in that language, whatever the subject. `taughtIn()` names it.
 *
 * Why a row and not a list of codes (2026-11-24, a Taiwan pilot request): one language needs a recogniser that
 * hears it, a voice native to it, the script its board is written in and the wording of its region. Taiwan and
 * mainland China share a spoken language and not a script or a maths vocabulary, so a region is its own row.
 *
 * Pure. No env, no I/O, client-safe.
 */

export interface LessonLanguage {
  /** The code a session carries (BCP-47, canonical case). */
  code: string;
  /** The language without its region: what the recogniser, the voice and the language packs key on. */
  base: string;
  /** Its name in English, as the brain is told it. */
  name: string;
  /** Its name in itself, as a picker shows it. */
  ownName: string;
  /** Its short name in English, for a picker's tooltip and for lists. */
  label: string;
  /** A first topic every school system teaches, named in the language of the board (a demo with no ready lesson opens on it). */
  firstTopic: string;
  /** Cartesia Sonic `language`. */
  tts: string;
  /** Cartesia Ink model that hears it. ink-2 hears en/fr/hi/ja/es; ink-preview hears 44 languages (Mandarin among them). */
  sttModel: 'ink-2' | 'ink-preview';
  /** ink-preview only: the languages it is told to expect (base codes). ink-2 refuses hints. */
  sttHints?: readonly string[];
  /** What the recogniser's text is converted to before anyone reads it. Ink writes Mandarin in Simplified
   *  characters whoever speaks; a Taiwan learner reads Traditional. */
  heardAs?: 'traditional';
  /** A voice native to the language for each gender (Cartesia voice ids), used when the session's own voice
   *  is not one of this language's. An English voice reads Chinese with an accent no teacher has. */
  voices: { female: string; male: string };
  /** The script test for a sentence in this language (none: Latin script). */
  script?: RegExp;
  /** How the brain is told to write it: script, register, regional wording. One fact per line. */
  writing: readonly string[];
  /** The language the board and the screen's own labels are written in when it is not the row's own: Hinglish
   *  is spoken in the Hindi-English mix and written on the board in English. Absent: the row's own language. */
  boardIn?: 'en';
  /** Numbers in a spoken line are said in English ("two x plus three equals eleven"), as Hinglish speakers do. */
  numbersInEnglish?: boolean;
  /** A spoken test lesson has been run in it and passed: it may be offered to people (the demo pickers, the
   *  dashboard's test lesson, the public language list). A row without the mark works for a token that names it
   *  and is not yet advertised. */
  ready?: boolean;
}

const HAN = /\p{Script=Han}/u;
const KANA = /[\p{Script=Hiragana}\p{Script=Katakana}]/u;
const DEVANAGARI = /\p{Script=Devanagari}/u;

export const LESSON_LANGUAGES: readonly LessonLanguage[] = [
  {
    code: 'en', base: 'en', name: 'English', ownName: 'English', label: 'English', firstTopic: 'Solving linear equations', tts: 'en', sttModel: 'ink-2',
    voices: { female: '01eaafa9-308a-4276-a017-6ab0cf061b1f', male: '86e30c1d-714b-4074-a1f2-1cb6b552fb49' },
    writing: [], ready: true,
  },
  {
    code: 'ja', base: 'ja', name: 'Japanese', ownName: '日本語', label: 'Japanese', firstTopic: '一次方程式', tts: 'ja', sttModel: 'ink-2',
    // Ayako ("friendly and calm, for providing instructions") and Tohru ("for providing guidance and instruction").
    voices: { female: '63d6f469-8c2c-489d-b53f-d36f0bbdcd4b', male: '49e02441-83ea-4c77-bda8-79fdd7f07e92' },
    script: KANA,
    writing: [
      'Japanese is natural and polite (です/ます), the way a kind teacher speaks to a student.',
      'Write Japanese in Japanese script, never romaji. Use the terms Japanese schools use (連立方程式, 代入, 約分).',
    ],
    ready: true,
  },
  {
    code: 'zh-TW', base: 'zh', name: 'Mandarin Chinese as used in Taiwan', ownName: '繁體中文（台灣）', label: 'Chinese (Traditional)', firstTopic: '一元一次方程式', tts: 'zh', sttModel: 'ink-preview', sttHints: ['zh', 'en'],
    heardAs: 'traditional',
    // Yu-Hsin and Feng: Cartesia's two Taiwan-native Mandarin voices.
    voices: { female: '0f5ac064-30c7-4cf6-8748-d275f682a0d5', male: '453c418c-125e-4e5a-b048-03fec55d0963' },
    script: HAN,
    writing: [
      'Write Traditional Chinese characters only, never Simplified, in speech and on the board.',
      'Use the wording of Taiwan\'s schools and textbooks, not mainland China\'s (聯立方程式 not 方程组, 加減消去法, 代入消去法, 分數 and 小數, 公分 not 厘米, 國中 and 高中 for the school levels).',
      'Speak the way a kind teacher in Taiwan speaks to a student: natural spoken Mandarin, 你 for the student.',
    ],
    ready: true,
  },
  {
    code: 'zh-CN', base: 'zh', name: 'Mandarin Chinese as used in mainland China', ownName: '简体中文', label: 'Chinese (Simplified)', firstTopic: '一元一次方程', tts: 'zh', sttModel: 'ink-preview', sttHints: ['zh', 'en'],
    // Lan ("for providing guidance and instruction") and Tao ("for presentations and educational content").
    voices: { female: 'bf32f849-7bc9-4b91-8c62-954588efcc30', male: 'c59c247b-6aa9-4ab6-91f9-9eabea7dc69e' },
    script: HAN,
    writing: [
      'Write Simplified Chinese characters only, in speech and on the board.',
      'Use the wording of mainland China\'s schools and textbooks (方程组, 代入消元法, 加减消元法).',
      'Speak the way a kind teacher speaks to a student: natural spoken Mandarin, 你 for the student.',
    ],
    ready: true,
  },
  // 2026-11-24, after the Chinese and Japanese lessons: the next languages people asked the demo for. Voices were
  // picked from the vendor's own descriptions and a speak-then-transcribe check (nobody has yet listened to them);
  // the recogniser choice is from the same check (ink-2 heard a short "हाँ" as "Huh." and "Sí." as "See,").
  {
    code: 'hi', base: 'hi', name: 'Hindi', ownName: 'हिन्दी', label: 'Hindi', firstTopic: 'रैखिक समीकरण', tts: 'hi', sttModel: 'ink-preview', sttHints: ['hi', 'en'],
    // Kriti ("clear explainer") and Rehan ("friendly explainer", described for educational content).
    voices: { female: '5283efe8-07d1-4e3a-b615-2ae4a81c1b73', male: '205fc552-2cce-4307-baa1-598b9dc3dd01' },
    script: DEVANAGARI,
    writing: [
      'Write Hindi in Devanagari, never in Latin letters, in speech and on the board. Letters for variables stay Latin (x, y).',
      'Use the terms Hindi-medium schools use (समीकरण, भिन्न, प्रतिशत, वर्ग, वर्गमूल).',
      'Speak the way a kind teacher speaks to a student: simple everyday Hindi, तुम for the student, never stiff or literary.',
    ],
  },
  {
    // Hinglish: Hindi mixed with English, the way most Indian students speak and are taught (Praveen 2026-11-24:
    // many are not at ease with pure Hindi spoken or written, and ask for Hindi all the same). Spoken by the Hindi
    // voice, which reads the mix naturally (an English voice does not); the board stays English.
    code: 'hi-Latn', base: 'hi', name: 'Hinglish (Hindi mixed with English, as students in India speak)', ownName: 'Hinglish', label: 'Hinglish', firstTopic: 'Solving linear equations', tts: 'hi', sttModel: 'ink-preview', sttHints: ['hi', 'en'],
    voices: { female: '5283efe8-07d1-4e3a-b615-2ae4a81c1b73', male: '205fc552-2cce-4307-baa1-598b9dc3dd01' },
    script: DEVANAGARI, boardIn: 'en', numbersInEnglish: true,
    writing: [
      'Speak Hinglish: Hindi sentence structure and connecting words, with English for every school and subject term (equation, value, add, cancel, slope, answer, formula), as a friendly teacher in India talks to a student. Never pure formal Hindi.',
      'In what you say, write the Hindi words in Devanagari and the English words in English spelling: "देखो, पहले हम दोनों equations को add करेंगे।" The voice reads that naturally; Hindi in Latin letters it may misread.',
      'Everything on the board is in English: titles, steps, problems, labels. No Hindi on the board.',
      'The student\'s words reach you with the Hindi in Devanagari and the English in Latin letters. A number may arrive as चार, four or 4: all the same answer.',
    ],
  },
  {
    code: 'fr', base: 'fr', name: 'French', ownName: 'Français', label: 'French', firstTopic: 'Les équations du premier degré', tts: 'fr', sttModel: 'ink-preview', sttHints: ['fr', 'en'],
    // Maëlle B ("measured and empathetic, for thoughtful guidance and detailed explanations") and Mathis
    // ("thoughtful, measured delivery, simplifying detailed analyses"): France.
    voices: { female: '80f117a5-5196-4b64-8b4c-efda3d3ab176', male: '996ec149-0dca-4389-ad08-e2d6f906b4bf' },
    writing: [
      'Write standard French as used in France, in speech and on the board, tu for the student, the way a kind teacher speaks.',
      'Use the terms French schools use (équation, fraction, numérateur, dénominateur, pourcentage, racine carrée).',
    ],
  },
  {
    code: 'es', base: 'es', name: 'Spanish as used in Latin America', ownName: 'Español', label: 'Spanish', firstTopic: 'Ecuaciones de primer grado', tts: 'es', sttModel: 'ink-preview', sttHints: ['es', 'en'],
    // Laura ("making complex information accessible, calm and friendly") and Jose ("patient explainer, for
    // listeners learning new or intricate subjects"): Mexico.
    voices: { female: '1cc00672-e9d4-455e-b3fb-31dfb7aad231', male: '3ca54c01-ef9a-4f44-9f73-adbde3a26ef8' },
    writing: [
      'Write neutral Latin American Spanish, in speech and on the board, tú for the student (never vosotros), the way a kind teacher speaks.',
      'Use the terms Latin American schools use (ecuación, fracción, porcentaje, raíz cuadrada).',
    ],
  },
];

/** Codes a token may carry for a row besides its own (lower case). A bare `zh` is Simplified, as most software reads it. */
const ALIASES: Readonly<Record<string, string>> = {
  zh: 'zh-CN', 'zh-hans': 'zh-CN', 'zh-hans-cn': 'zh-CN', 'zh-sg': 'zh-CN', cmn: 'zh-CN',
  'zh-hant': 'zh-TW', 'zh-hant-tw': 'zh-TW', 'zh-hk': 'zh-TW', 'zh-mo': 'zh-TW',
  hinglish: 'hi-Latn', 'hi-en': 'hi-Latn', 'hi-latn-in': 'hi-Latn', 'es-419': 'es', 'es-mx': 'es',
};

const BY_CODE = new Map(LESSON_LANGUAGES.map((l) => [l.code.toLowerCase(), l]));

/** The row for a code a token or a picker gives (`zh-TW`, `zh_tw`, `ja-JP`, `ZH-Hant`), or null. */
export function lessonLanguageOf(raw: unknown): LessonLanguage | null {
  if (typeof raw !== 'string') return null;
  const code = raw.trim().toLowerCase().replace(/_/g, '-');
  if (!code) return null;
  const exact = BY_CODE.get(code) ?? BY_CODE.get((ALIASES[code] ?? '').toLowerCase());
  if (exact) return exact;
  // A region this table has no row for falls to the language's first row (`ja-JP` → ja, `en-GB` → en).
  const base = code.split('-')[0]!;
  return BY_CODE.get(base) ?? BY_CODE.get((ALIASES[base] ?? '').toLowerCase()) ?? null;
}

/** A code's language without its region (`zh-TW` → `zh`); the code itself when it is not in the table. */
export function baseLanguage(code: string | null | undefined): string {
  return lessonLanguageOf(code)?.base ?? (code ?? '').toLowerCase().split(/[-_]/)[0]!;
}

/** The language the lesson is taught in when it is not English: the session's first language. Null for an
 *  English lesson, with or without a second language for help. */
export function taughtIn(languages: readonly string[] | null | undefined): LessonLanguage | null {
  const first = lessonLanguageOf(languages?.[0]);
  return first && first.base !== 'en' ? first : null;
}

/** Every row of the session, in its order. */
export function sessionLanguageRows(languages: readonly string[] | null | undefined): LessonLanguage[] {
  return (languages ?? []).map(lessonLanguageOf).filter((x): x is LessonLanguage => !!x);
}

/** The voice a lesson taught in another language speaks with. `own` says what the session's voice is: 'partner'
 *  (an id the partner chose themselves: kept, they picked it for this language), or the gender of one of the
 *  engine's own English voices, which is swapped for the language's voice of that gender (female when there is
 *  no voice or no gender). An English voice reads Chinese with an accent no teacher has. An English lesson keeps
 *  its voice. */
export function lessonVoiceId(languages: readonly string[] | null | undefined, sessionVoiceId: string | undefined, own: 'partner' | 'female' | 'male' | null = null): string | undefined {
  const lang = taughtIn(languages);
  if (!lang) return sessionVoiceId;
  if (sessionVoiceId && own === 'partner') return sessionVoiceId;
  return lang.voices[own === 'male' ? 'male' : 'female'];
}

/** The recogniser a session listens with: ink-2 unless one of its languages needs ink-preview, with the hints
 *  ink-preview is given (the session's base codes; English always among them, since learners say letters,
 *  numbers and names in it). */
export function sessionRecogniser(languages: readonly string[] | null | undefined): { model: 'ink-2' | 'ink-preview'; hints: string[] } {
  const rows = sessionLanguageRows(languages);
  if (!rows.some((r) => r.sttModel === 'ink-preview')) return { model: 'ink-2', hints: [] };
  return { model: 'ink-preview', hints: [...new Set([...rows.flatMap((r) => r.sttHints ?? [r.base]), 'en'])].slice(0, 6) };
}

/** The language the board and the screen's labels are in for a lesson taught in `lang`: its own, or English for
 *  a row that says so (Hinglish). */
export function boardLanguage(lang: LessonLanguage): LessonLanguage {
  return lang.boardIn === 'en' ? BY_CODE.get('en')! : lang;
}

/** What a picker or a public list needs of a language. */
export interface OfferedLanguage { code: string; label: string; english: string; firstTopic: string }

/** The ready languages as a picker shows them (the same shape as packages/core demo-languages.ts). */
export function offeredLanguages(): OfferedLanguage[] {
  return readyLessonLanguages().map((l) => ({ code: l.code, label: l.ownName.replace(/（.*）$/, ''), english: l.label, firstTopic: l.firstTopic }));
}

/** The languages that may be offered to people: rows marked ready, in the table's order. */
export function readyLessonLanguages(): LessonLanguage[] {
  return LESSON_LANGUAGES.filter((l) => l.ready);
}

/** The language the board is written in when it is not English, or null: an English lesson, and a lesson spoken
 *  in a mix whose board stays English (Hinglish). What the engine writes on the board itself (a first page from
 *  the plan, a recap page) is in English, so it writes those only when this is null. */
export function boardTaughtIn(languages: readonly string[] | null | undefined): LessonLanguage | null {
  const row = taughtIn(languages);
  return row && boardLanguage(row).code !== 'en' ? row : null;
}

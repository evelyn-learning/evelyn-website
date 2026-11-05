// src/lib/tutor/voice/language-request.ts
/**
 * Wave 11 (GDI run 7, 187 s): the tutor explained the scores in Japanese, the
 * student said "Can you please talk in English?", and the tutor answered "Of
 * course, let's continue in English" — and moved on to the summary without
 * ever saying the explanation in English. A request to be spoken to in a
 * session language is a "say that again in <language>" request: the previous
 * turn is restated in that language, the open ask is asked again, and the
 * preference sticks for the rest of the session.
 *
 *  - languageRequestIn: the session language (code) the student asked for, or null;
 *  - languageRequestNoteFirst / languageRequestNote: the brain notes (first turn
 *    carries the previous tutor turn; later turns the short preference).
 * Pure, generic over the session's languages.
 */

const LANGUAGE_WORDS: Record<string, { name: string; latin: RegExp; native: RegExp }> = {
  en: { name: 'English', latin: /\benglish\b/i, native: /英語で/ },
  ja: { name: 'Japanese', latin: /\bjapanese\b/i, native: /日本語で/ },
  zh: { name: 'Chinese', latin: /\b(?:chinese|mandarin)\b/i, native: /用中文|中文/ },
  ko: { name: 'Korean', latin: /\bkorean\b/i, native: /한국어로/ },
  es: { name: 'Spanish', latin: /\bspanish\b/i, native: /en español/i },
  fr: { name: 'French', latin: /\bfrench\b/i, native: /en français/i },
  de: { name: 'German', latin: /\bgerman\b/i, native: /auf deutsch/i },
  pt: { name: 'Portuguese', latin: /\bportuguese\b/i, native: /em português/i },
  hu: { name: 'Hungarian', latin: /\bhungarian\b/i, native: /magyarul/i },
  ar: { name: 'Arabic', latin: /\barabic\b/i, native: /بالعربية/ },
};

export function languageNameOf(code: string): string {
  return LANGUAGE_WORDS[code.toLowerCase().split(/[-_]/)[0]!]?.name ?? code;
}

// "can/could/would/will you … <language>", "please … <language>", "<language>, please", a bare "<language>?",
// or an imperative verb with "in <language>" — and never when the student speaks about THEMSELVES doing it.
const ASK_YOU_RE = /\b(?:can|could|would|will)\s+you\b/i;
const PLEASE_RE = /\bplease\b/i;
const IMPERATIVE_RE = /\b(?:speak|talk|explain|say|repeat|use|continue|go on|teach|tell me)\b/i;
const FIRST_PERSON_RE = /\b(?:i|i'm|i'd|i'll|i've|me|my|mine|we|our)\b/i;
const NATIVE_REQUEST_RE = /(?:話し|言っ|説明し|お願い|ください|もらえ|いただけ|して)/;

/** The session language the student asks to be spoken to in (its code from `sessionLanguages`), or null. An engine
 *  directive (bracketed) is never a request. */
export function languageRequestIn(studentText: string | null | undefined, sessionLanguages: readonly string[]): string | null {
  const t = (studentText ?? '').trim();
  if (!t || /^\s*\[/.test(t)) return null;
  for (const raw of sessionLanguages) {
    const code = raw.toLowerCase().split(/[-_]/)[0]!;
    const w = LANGUAGE_WORDS[code];
    if (!w) continue;
    // native-script request ("英語で話してください", "英語でお願いします")
    if (w.native.test(t) && NATIVE_REQUEST_RE.test(t)) return code;
    if (!w.latin.test(t)) continue;
    const idx = t.search(w.latin);
    const before = t.slice(0, idx);
    const after = t.slice(idx).replace(w.latin, '').trim();
    const words = (t.match(/[\p{L}']+/gu) ?? []).length;
    // "<language>, please" / "<language>?" / "in <language>, please." — the language is the utterance
    if (words <= 4 && (PLEASE_RE.test(t) || /\?\s*$/.test(t) || /^(?:in\s+)?$/i.test(before.trim()) && /^[,.!?\s]*$/.test(after))) return code;
    // "can you … in English", "please … in English", "speak English"
    const inLang = /\bin\s*$/i.test(before) || IMPERATIVE_RE.test(before) || PLEASE_RE.test(before);
    if (ASK_YOU_RE.test(before) && inLang) return code;
    if (PLEASE_RE.test(t) && inLang && !FIRST_PERSON_RE.test(before)) return code;
    if (IMPERATIVE_RE.test(before) && /\bin\s*$/i.test(before) && !FIRST_PERSON_RE.test(before) && /^[,.!?\s]*$/.test(after)) return code;
  }
  return null;
}

const PREV_CAP = 400;

/** The note for the turn the request arrives on: restate the previous turn in that language, then re-ask; sticky. */
export function languageRequestNoteFirst(code: string, previousTutorTurn: string | null | undefined): string {
  const name = languageNameOf(code);
  const prev = (previousTutorTurn ?? '').replace(/\s+/g, ' ').trim();
  const shown = prev.length > PREV_CAP ? `${prev.slice(0, PREV_CAP)}…` : prev;
  return `[Language request — the student asked you to use ${name}] First say again in ${name} what your previous turn said — its content (any scores, the explanation, the question), in at most two sentences, not word for word — then ask the open question again. From now on in this session use ${name} for explanations, instructions and feedback too; use the other session language only when the student asks for it.${shown ? ` Your previous turn was: "${shown}"` : ''}`;
}

/** The short preference note for every later turn of the session. */
export const LANGUAGE_REQUEST_NOTE = (name: string): string =>
  `[Language preference] The student asked for ${name}: give explanations, instructions and feedback in ${name}.`;

export function languageRequestNote(code: string): string {
  return LANGUAGE_REQUEST_NOTE(languageNameOf(code));
}

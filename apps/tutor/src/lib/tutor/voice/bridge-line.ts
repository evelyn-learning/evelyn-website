/**
 * Bridge line: the tutor's first words, spoken by the CLIENT from a fixed
 * table the moment the session starts — before the first brain call — so the
 * student hears something within a second instead of 3–8 s of silence.
 * No model, no personalisation beyond first name and the host's short title.
 *
 * 2026-10-18 (embed-1792378728971, GDI demo): "Hey Sato. Let’s get started."
 * opened a Japanese beginner lesson — English, casual, and the FAMILY name of
 * "Sato Kenji" (a romaji name carries no safe given/family order). A session
 * whose tutor languages include a non-Latin language never gets the English
 * line: a language with a fixed line here (Japanese) gets that line WITHOUT
 * the name — the brain greets by name a moment later — and any other gets no
 * bridge at all (silence beats the wrong language as the first thing heard).
 */
import { studentFirstName } from '../student-name';
import { sessionAllowsNonLatin } from './transcript-filters';

const MAX_TITLE = 60;

/** Nameless first words per non-Latin tutor language. One line for both the
 *  in-flow and the standalone start: the host's title is usually English. */
const NON_LATIN_BRIDGE_LINES: Readonly<Record<string, string>> = {
  ja: 'こんにちは。それでは、始めましょう。',
};

/** "Adult beginner (A1)", "Pre-A1", "true beginner", "初級" → beginner.
 *  Missing level → beginner (the line it gave before levels were read). */
export function isBeginnerLevel(level?: string): boolean {
  const l = (level ?? '').trim();
  if (!l) return true;
  return /\bbeginner\b|\b(?:pre-?)?a1\b|初級|入門|初心者/i.test(l);
}

export function bridgeLineFor(a: {
  studentName?: string;
  title?: string;
  inFlow: boolean;
  inputMode: 'voice' | 'text';
  resume: boolean;
  /** The session's tutor languages (embed `tutor_languages`); undefined = English. */
  tutorLanguages?: string[];
  /** The student's level string (e.g. "Adult beginner (A1)"). */
  level?: string;
}): string | null {
  if (a.inputMode === 'text' || a.resume) return null;
  if (sessionAllowsNonLatin(a.tutorLanguages)) {
    // 2026-10-27 (GDI demo embed-1793146791189): an advanced, English-led
    // lesson opened in Japanese. The prompt uses the second language mostly
    // with beginners, so the first words follow the level: a beginner hears
    // the Japanese line, anyone else a nameless English one (names can arrive
    // family-name first — "Hey Sato." in embed-1792378728971).
    if (!isBeginnerLevel(a.level)) return 'Hello.';
    const lang = (a.tutorLanguages ?? []).find((l) => l in NON_LATIN_BRIDGE_LINES);
    return lang ? NON_LATIN_BRIDGE_LINES[lang] : null;
  }
  // An id / placeholder in the name field is no name (student-name.ts).
  const first = studentFirstName(a.studentName);
  const greet = first ? `Hey ${first}.` : 'Hey.';
  if (a.inFlow) {
    const t = (a.title || '').trim();
    const title = t.length > MAX_TITLE ? `${t.slice(0, MAX_TITLE - 1)}…` : t;
    return title ? `${greet} ${title} — let’s look at it.` : `${greet} Let’s look at it.`;
  }
  // 2026-10-28 (Praveen): the greeting alone — "Let's get started" stacked
  // on the brain's own lead-in read as stalling.
  return greet;
}

/** Did this bridge line address the student by name? (The English lines do
 *  when a usable name exists; the non-Latin lines never do.) */
export function bridgeSpokeName(line: string): boolean {
  return /^Hey \S/.test(line) && !/^Hey\.\s/.test(line);
}

/** Appended to the opening directive when a bridge line was spoken. */
export const BRIDGE_SPOKEN_DIRECTIVE =
  ' You have ALREADY greeted the student by name a moment ago (a short spoken line); do not greet again or repeat ' +
  'their name — start directly with your first content sentence.';

/** Appended instead when the bridge line said hello WITHOUT the name. */
export const BRIDGE_SPOKEN_NO_NAME_DIRECTIVE =
  ' You have ALREADY said hello a moment ago (a short spoken line, without the student\'s name); do not say hello ' +
  'again — you may address the student by name once, then go straight to your first content sentence.';

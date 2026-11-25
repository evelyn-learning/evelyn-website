/**
 * Tutor brain v2 — changing the lesson's language in the middle of a lesson.
 *
 * Where this came from (2026-11-24, two sessions from India): a student typed "Hindi me samjhao" into the
 * marketing demo and the tutor went on in Hindi written in Latin letters, which an English voice then read aloud
 * as nonsense; another spoke a Hindi-English mix to an English lesson throughout, was understood, and was
 * answered only in English. The tutor changed its words and nothing else: the voice, the recogniser and the
 * board stayed where they were.
 *
 * The rule (Praveen 2026-11-24): a change of language is all or nothing. The tutor speaks only a language this
 * session has a voice, a recogniser and a board for. When the student asks for another language that is allowed
 * here, the tutor calls `switch_language`; the session page then changes the voice, the recogniser, the screen's
 * labels and the lesson's language together, and the next reply is the first in the new language. When it is not
 * allowed or not one we teach in, the tutor says so in a sentence and goes on. It never tells a student to leave
 * and start again.
 *
 * Which languages a session may change to is the partner's to decide (portal/partner-session-options.ts
 * `languageSwitch`): every ready language (our own demos and products), those the session's token lists
 * (`switch_languages`), or none (a partner whose lesson being in one language is the product).
 *
 * The student's wish is read by the model, not by a list of phrases: "can you talk in Chinese?", "Hindi me
 * samjhao" and "説明は日本語で" are the same request, and "how do you say this in Spanish?" is not one.
 */
import type Anthropic from '@anthropic-ai/sdk';
import { LESSON_LANGUAGES, lessonLanguageOf, readyLessonLanguages, taughtIn, type LessonLanguage } from '../voice/lesson-language';
import type { V2Session, V2State } from './types';

/** The row of the language the session is in now: the one it is taught in, or English. */
export function v2CurrentLanguage(languages: readonly string[] | null | undefined): LessonLanguage {
  return taughtIn(languages) ?? LESSON_LANGUAGES.find((l) => l.code === 'en')!;
}

/** The codes a session may change to: ready languages only, never the one it is in. `setting` is the partner
 *  row's; `claim` the token's `switch_languages` (a list of codes, or true / 'all' for every ready language). */
export function v2SwitchLanguages(input: { setting: 'all' | 'claim' | 'off' | undefined; claim: unknown; languages: readonly string[] | null | undefined; bilingual?: boolean }): string[] {
  // An English lesson with a second language for help (languages.ts) is built on both: it is not changed.
  if (input.setting === 'off' || input.bilingual) return [];
  const ready = readyLessonLanguages();
  const current = v2CurrentLanguage(input.languages).code;
  const asked = input.claim === true || input.claim === 'all' ? null : Array.isArray(input.claim) ? input.claim.map(lessonLanguageOf).filter((r): r is LessonLanguage => !!r).map((r) => r.code) : typeof input.claim === 'string' ? input.claim.split(/[,\s]+/).map(lessonLanguageOf).filter((r): r is LessonLanguage => !!r).map((r) => r.code) : [];
  const allowed = input.setting === 'all' || asked === null ? ready : ready.filter((r) => asked.includes(r.code));
  return allowed.map((r) => r.code).filter((c) => c !== current);
}

export const V2_SWITCH_LANGUAGE_TOOL_NAME = 'switch_language';

export function v2SwitchLanguageTool(codes: readonly string[]): Anthropic.Tool {
  return {
    name: V2_SWITCH_LANGUAGE_TOOL_NAME,
    description: 'Change the language of the whole lesson (your voice, what you hear, the board and the screen) because the student asked for it. The change happens after this reply: in this reply say at most one short sentence, in the language the lesson is in now ("Sure, one moment."), and call no other tool. Your next reply is the first in the new language.',
    input_schema: { type: 'object', properties: { language: { type: 'string', enum: [...codes], description: 'The code of the language to change to.' } }, required: ['language'] },
  };
}

const list = (rows: readonly LessonLanguage[]) => rows.map((r) => `${r.name} (${r.code})`).join('; ');

/** The session part's section on the lesson's language and changing it. Every session gets it: the first
 *  paragraph is what stops a half-change in a session that cannot change at all. */
export function v2LanguageSwitchSection(session: Pick<V2Session, 'languages' | 'switchLanguages' | 'mode'>): string {
  const now = v2CurrentLanguage(session.languages);
  const to = (session.switchLanguages ?? []).map(lessonLanguageOf).filter((r): r is LessonLanguage => !!r);
  const spoken = session.mode === 'voice';
  const lines = [
    'CHANGING LANGUAGE',
    // embed-1795484691909: asked for Hindi, the tutor wrote Hindi in Latin letters and the English voice read it.
    `You teach this lesson in ${now.name} and in no other language${spoken ? ': your voice can pronounce only that, and words of another language come out as nonsense' : ''}. Never drift into another language on your own, not for a sentence and not in Latin letters, however the student writes or speaks. You still understand whatever language they use: answer what they asked.`,
  ];
  if (to.length) {
    lines.push(
      `The student may have the lesson in one of these instead: ${list(to)}. When they ask for one of them (in any words and any language: "can you talk in Hindi?", "Hindi me samjhao", "explain in Chinese"), or plainly cannot follow ${now.name} and are using one of them, call ${V2_SWITCH_LANGUAGE_TOOL_NAME} with its code. In that reply say at most one short sentence, still in ${now.name}: your voice changes only after it, and the new language's words would be mispronounced. When it is not clear which they want (Hindi or Hinglish; which Chinese), ask once, in ${now.name}, naming the choices. Asking how to say a word in another language is a question about that word, not a request to change the lesson.`,
      `When they ask for a language that is not in that list, say in one sentence that it is not available in this lesson, name the ones that are, and go on in ${now.name}.`,
    );
  } else {
    lines.push(`This lesson cannot change language. If the student asks for another one, say in one sentence that this lesson is in ${now.name}, and go on. Do not tell them to leave or start again.`);
  }
  return lines.join('\n');
}

/** The `switch_language` call: record it on the state for the session page to act on. */
export function v2ApplySwitchLanguage(state: V2State, session: Pick<V2Session, 'languages' | 'switchLanguages'>, args: Record<string, unknown>, nowMs: number): string {
  const row = lessonLanguageOf(args.language);
  if (!row || !(session.switchLanguages ?? []).includes(row.code)) {
    const to = (session.switchLanguages ?? []).join(', ');
    return to ? `not changed: this lesson can change only to ${to}. Tell the student in one sentence, and go on.` : 'not changed: this lesson cannot change language. Tell the student in one sentence, and go on.';
  }
  if (row.code === v2CurrentLanguage(session.languages).code) return `not changed: the lesson is already in ${row.name}.`;
  state.languageSwitch = { to: row.code, at: nowMs };
  return `changing to ${row.name} after this reply: say nothing more now, and nothing in ${row.name} yet. Your next reply is in ${row.name}.`;
}

/** The note the session page sends as the first turn after the change, in place of the student's words. */
export function v2LanguageChangedNote(from: LessonLanguage, to: LessonLanguage): string {
  return `[The lesson's language has just changed from ${from.name} to ${to.name} because the student asked. Say in one short sentence, in ${to.name}, that you will go on in ${to.name}, then carry on from exactly where the lesson was: the same step, the same question. What is already on the board stays; write new things in the board's language for this lesson.]`;
}

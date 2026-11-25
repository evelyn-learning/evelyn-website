/**
 * Tutor brain v2 — a lesson taught in another language.
 *
 * `V2Session.languages` whose first language is not English (voice/lesson-language.ts taughtIn) is a lesson held
 * wholly in that language, whatever its subject: a maths lesson in Traditional Chinese for a learner in Taiwan,
 * a science lesson in Japanese. The session part gets the section below. It is a different thing from an English
 * lesson with a second language for help (languages.ts), which stays as it is.
 *
 * Where this came from (2026-11-24, three demo sessions from Taipei): asked in Chinese whether it could write
 * Chinese, the tutor said the board and the teaching would be in English; told in a typed message to teach in
 * Traditional Chinese it did so correctly, with the engine's own English lines between its sentences and one
 * reply in Simplified characters. The model can teach in the language; it was never told to.
 */
import { boardLanguage, taughtIn } from '../voice/lesson-language';
import type { V2Session } from './types';

/** The session part's section for a lesson taught in another language, or null for an English lesson. */
export function v2LessonLanguageSection(session: Pick<V2Session, 'languages' | 'mode'>): string | null {
  const lang = taughtIn(session.languages);
  if (!lang) return null;
  const L = lang.name;
  // A language spoken in one tongue and written on the board in another (Hinglish: the mix in speech, English on
  // the board, as Indian classrooms and textbooks have it) gets its own wording; every other lesson is unchanged.
  const B = boardLanguage(lang);
  if (B.code !== lang.code) return splitSection(session, lang.name, B.name, lang.writing);
  return [
    'LESSON LANGUAGE',
    // embed-1795518069724: "the board and my explanations will be in English".
    `This whole lesson is in ${L}. Everything you say and everything you write on the board (page titles, notes, problems, labels, cards, the summary) is in ${L}, from your first word to your goodbye. You can write it on the board: never say you cannot.`,
    // The plan, the topic and the catalogue's lessons are written in English; read aloud as written they put English in a Chinese lesson.
    `The plan, the topic and everything else in these instructions may be written in English: that is only how they are stored. Teach their content in ${L}, in your own words as a teacher of that language would put it; never read their English wording aloud or copy it to the board. The names of the lesson's parts are said and written in ${L} too.`,
    ...lang.writing,
    // The engine's fallback first card (the plan's title and objectives, in English) is not written in such a lesson.
    `Your first reply opens the board yourself: a page with a title in ${L} and a short note of what today's lesson covers.`,
    'Mathematical and scientific notation is the same in every language: numbers, variable letters, equations and units in symbols stay as they are on the board.',
    // The voice reads "x = 4" symbol by symbol, or not at all.
    session.mode === 'voice' ? `In speech, say notation in ${L} words, the way a teacher there says it aloud; the symbols go on the board.` : '',
    // embed-1795519284671: the recogniser wrote Taiwan Mandarin as unrelated characters; a reply built on them answers something never said.
    session.mode === 'voice' ? `The student speaks ${L}. Their words reach you through a speech recogniser, which now and then writes a word as another that sounds like it: read what they said for its sound and its sense in the lesson, and when it still makes no sense, ask them to say it again.` : '',
    // What happens when they use or ask for another language is the CHANGING LANGUAGE section's (language-switch.ts).
    'Their name, and yours, stay as they are written.',
    // The engine's notes (facts lines, tool names and results, bracketed lines in the student's turn) are written in English.
    `Notes from the engine in the conversation (lines in square brackets, tool results) are written in English and are for you alone: act on them, and never say them or translate them aloud.`,
  ].filter(Boolean).join('\n');
}

/** The section for a lesson spoken in `L` and written on the board in `B`. */
function splitSection(session: Pick<V2Session, 'mode'>, L: string, B: string, writing: readonly string[]): string {
  return [
    'LESSON LANGUAGE',
    `You speak this whole lesson in ${L}, from your first word to your goodbye. Everything you write on the board (page titles, notes, problems, labels, cards, the summary) is in ${B}.`,
    `The plan and the topic are written in ${B}: use their terms as they are on the board, and explain them aloud in ${L}.`,
    ...writing,
    session.mode === 'voice' ? `In speech, say every number and every piece of notation in ${B} words inside your sentence ("two x plus three equals eleven", "x squared", "three by four"), never as digits or symbols; the symbols go on the board.` : `In a typed reply the same mix is written the way students type it; numbers and notation stay as symbols.`,
    session.mode === 'voice' ? `The student speaks ${L}. Their words reach you through a speech recogniser, which now and then writes a word as another that sounds like it: read what they said for its sound and its sense in the lesson, and when it still makes no sense, ask them to say it again.` : '',
    'Their name, and yours, stay as they are written.',
    `Notes from the engine in the conversation (lines in square brackets, tool results) are written in English and are for you alone: act on them, and never say them or translate them aloud.`,
  ].filter(Boolean).join('\n');
}

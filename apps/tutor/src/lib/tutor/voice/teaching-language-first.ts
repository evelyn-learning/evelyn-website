/**
 * Task 38 §H (voice run 19, 1187 s): in an English-first language lesson the
 * pronunciation feedback turn was entirely Japanese
 * (「発音のチェック結果は100点中95点で…」) after the student had spoken English,
 * and the student had to ask for English.
 *
 * Rule (language lessons whose tutor_languages[0] is 'en'): a tutor attempt
 * with ZERO English sentences, when the student's last turn was English, is
 * killed and retried with TEACHING_LANGUAGE_FIRST_REASON. An English
 * sentence = a sentence with no CJK characters and at least two Latin words.
 * A Japanese gloss after an English sentence is fine; a student who wrote /
 * spoke Japanese (any CJK in their turn) is never the trigger. Pure.
 */
import { withRetryStyle } from './output-budget';

const CJK_RE = /[぀-ヿ㐀-鿿ｦ-ﾟ]/;
const LATIN_WORD_RE = /[A-Za-z][A-Za-z'’]*/g;
const LANGUAGE_NAMES: Record<string, string> = { en: 'English', ja: 'Japanese', zh: 'Chinese', ko: 'Korean', es: 'Spanish', fr: 'French', de: 'German', pt: 'Portuguese', ar: 'Arabic' };

function latinWords(s: string): number {
  return (s.match(LATIN_WORD_RE) ?? []).length;
}
function sentencesOf(text: string): string[] {
  return (text ?? '').split(/(?<=[。！？.!?])\s*|\n+/).map((x) => x.trim()).filter(Boolean);
}
/** The student's turn is English: ≥ 2 Latin words and no CJK. */
export function studentTurnIsEnglish(studentText: string | null | undefined): boolean {
  const s = (studentText ?? '').trim();
  return !!s && !/^\s*\[/.test(s) && !CJK_RE.test(s) && latinWords(s) >= 2;
}
/** A sentence of the teaching language (English): no CJK, ≥ 2 Latin words. */
export function isEnglishSentence(sentence: string): boolean {
  return !CJK_RE.test(sentence) && latinWords(sentence) >= 2;
}
export function teachingLanguageFirstViolation(input: { tutorLanguages: readonly string[] | null | undefined; studentText: string | null | undefined; attemptText: string | null | undefined }): boolean {
  if ((input.tutorLanguages ?? [])[0] !== 'en') return false;
  if (!studentTurnIsEnglish(input.studentText)) return false;
  const text = (input.attemptText ?? '').trim();
  if (!text || !CJK_RE.test(text)) return false;
  return !sentencesOf(text).some(isEnglishSentence);
}
/** The retry directive: "Say it in English first; Japanese only as a short gloss." */
export function teachingLanguageFirstReason(tutorLanguages: readonly string[] | null | undefined): string {
  const first = LANGUAGE_NAMES[(tutorLanguages ?? [])[0] ?? 'en'] ?? 'English';
  const second = LANGUAGE_NAMES[(tutorLanguages ?? [])[1] ?? ''] ?? 'the other language';
  return withRetryStyle(`Say it in ${first} first; ${second} only as a short gloss. The student spoke ${first}, and this lesson is taught in ${first}.`);
}

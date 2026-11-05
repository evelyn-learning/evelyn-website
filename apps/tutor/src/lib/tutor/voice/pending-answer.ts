// src/lib/tutor/voice/pending-answer.ts
/**
 * Task 30 §A (GDI run 17, 433–499 s): the student answered "one more or move
 * on?" three times ("Yes. one", "Yes", …) and every answer was dropped as
 * self-voice by the lookback-overlap gates — an answer to an offer or a
 * numbered menu is MADE of the tutor's own words. The drops then counted
 * toward the noise nag, whose synthetic turn spent the offer's hold.
 *
 *  - pendingAnswerVocabularyFor: the words such an answer is made of, when
 *    the last tutor turn asked an offer (offerAsked) or read a numbered menu;
 *  - countsAsNoiseCancel: the noise nag's counting predicate — a self-voice
 *    drop of a pending answer is not noise.
 * Pure, generic.
 */
import { offerAsked } from '../lesson-plan/fixed-script';
import { isPendingAnswer } from './perception-classifier';
import { menuWordTokens, parseMenuOptions } from './menu-pick';

/** The generic answer words of an offer / menu reply. */
export const PENDING_ANSWER_WORDS: readonly string[] = [
  'yes', 'no', 'okay', 'ok', 'yeah', 'sure', 'one', 'more', 'another', 'again',
  'move', 'on', 'go', 'next', 'continue', 'skip', 'practice', 'please', 'summary',
  'the', 'a', 'that', 'this', 'option', 'number',
  '1', '2', '3', '4', 'two', 'three', 'four',
  'はい', 'いいえ', 'もう一', '次', '進',
  // the counter / request endings of those Japanese answers (もう一回、お願いします)
  '回', 'つ', 'お願いします', 'ください', 'です',
];

/** Non-null when `lastTutorText` asked the offer (offerAsked) or holds a
 *  numbered menu (≥ 2 "n)" markers): the generic answer words, plus — for a
 *  menu — every word of each option's text.
 *  W10-2 (fix wave 10, GDI run 6 782 / 786 s): the brain read the menu WITHOUT
 *  its numbers, so the say held no menu and the option-word barge-ins
 *  ("complete sentence", "two") were dropped as echo. `menuCard` — the open
 *  part's choice card, passed by the caller while its pick is unresolved —
 *  supplies the numbered options when the say has none. */
export function pendingAnswerVocabularyFor(lastTutorText: string | null | undefined, menuCard?: string | null): string[] | null {
  const text = lastTutorText ?? '';
  if (!text.trim()) return null;
  const menu = parseMenuOptions(text) ?? parseMenuOptions(menuCard ?? '');
  if (!menu && !offerAsked(text)) return null;
  const words = new Set<string>(PENDING_ANSWER_WORDS);
  for (const o of menu ?? []) for (const w of menuWordTokens(o.text)) words.add(w);
  return [...words];
}

/** Task 30 §A3: does this cancel count toward NOISE_INTERRUPTION_REACTION?
 *  noise / filler / drop_self_voice count, except a drop_self_voice whose
 *  partial is non-empty while an answer is pending (`pendingVocabulary`
 *  non-null) and either is a pending answer (isPendingAnswer) or has ≤ 3
 *  words. Any other verdict never counts. */
export function countsAsNoiseCancel(
  verdict: string,
  partial: string | null | undefined,
  pendingVocabulary: readonly string[] | null | undefined,
): boolean {
  if (verdict !== 'noise' && verdict !== 'filler' && verdict !== 'drop_self_voice') return false;
  if (verdict !== 'drop_self_voice' || !pendingVocabulary) return true;
  const p = (partial ?? '').trim();
  if (!p) return true;
  if (isPendingAnswer(p, pendingVocabulary)) return false;
  return (p.match(/[\p{L}\p{N}]+/gu) ?? []).length > 3;
}

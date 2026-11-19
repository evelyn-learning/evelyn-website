/**
 * Tutor brain v2 — Task 7u (SUMMARY_GROUPS): the summary page of a spoken lesson that teaches a language, laid out in groups.
 *
 * Mic test 6 (embed-1795067373124, 18.4 min): the summary page held two rule notes and six sentence cards in no order, one of them
 * holding the mistake ("I work in sales, not on sales."), and the learner asked for "what went right and then those sentences, and
 * what I should be improving on, label that and write the sentences underneath". Now, in a spoken lesson that teaches a language
 * with a labelled plan, the facts at the close give the page's order:
 *   1. the rule notes, one short line per grammar point of the lesson (always first);
 *   2. a heading note "What went well" (in the lesson's own language, with the 7p gloss line where rule notes carry one), then 1–2
 *      sentences the learner said right, as sentence cards;
 *   3. a heading note "To improve", then 1–2 corrections, each ONE card of the right sentence with the changed words stressed,
 *      never a card holding the mistake;
 * at most V2_SUMMARY_SENTENCE_CARDS sentence cards in all (the runtime refuses one more on the summary page: turn.ts), spoken in
 * the same order. A heading note is <board note style="heading">, drawn as a bold line with no box (WhiteboardCanvas.tsx).
 * Every other lesson: nothing (facts and section byte-identical). Pure, client-safe.
 */
import { TUTOR_V2_SUMMARY_GROUPS, TUTOR_V2_SUMMARY_SPOKEN } from '../orchestrator/flags';
import { languageNameOf } from '../voice/language-request';
import { v2CardGlossOn, v2GlossLevelOn } from './card-gloss';
import { v2NoteTargetsOn } from './note-targets';
import { V2_CLOSING_PAGE } from './part-close';
import { v2PlanLabelled } from './part-flow';
import { V2_SUMMARY_SENTENCE_CARDS } from './sentence-cards';
import type { V2Session, V2State } from './types';

/** The lessons it applies to: spoken, teaching a language, with a labelled plan. `enabled` is the kill switch. */
export function v2SummaryGroupsOn(session: V2Session, enabled: boolean = TUTOR_V2_SUMMARY_GROUPS): boolean {
  return enabled && v2NoteTargetsOn(session) && v2PlanLabelled(session.plan);
}

const base = (code: string) => code.toLowerCase().split(/[-_]/)[0]!;

/** Task 7w (SUMMARY_SPOKEN): mic test 7 (embed-1795100797999, 16.9 min): the model wrote the whole Summary page and said none of it. */
export const V2_SUMMARY_SPOKEN_LINE = 'Say the summary aloud as you write it: for each group (the grammar points, what went well, what to improve) one or two sentences of your own, said just before its cards; never a summary page with nothing said for it';

/** The facts line for the summary page (`heard`: their words this turn, for the gloss level). `spoken`: SUMMARY_SPOKEN (Task 7w). */
export function v2SummaryLayoutLine(session: V2Session, state: V2State, heard: string | null | undefined, spoken: boolean = TUTOR_V2_SUMMARY_SPOKEN): string {
  const T = languageNameOf(base(session.languages?.[0] ?? 'en'));
  const gloss = v2CardGlossOn(session) && v2GlossLevelOn(session, state, heard) ? ` with gloss="…" in ${languageNameOf(base(session.languages![1]!))} as your rule notes carry` : '';
  return `summary page: lay the Summary page out in this order, and say it in the same order, each card right after the words that say it and none after your last question: (1) the rule notes, one short line per grammar point of the lesson; (2) a heading note in ${T}, <board note style="heading"${gloss ? ' gloss="…"' : ''}>What went well</board>${gloss}, then 1–2 sentences they said right in this lesson, as sentence cards; (3) a heading note <board note style="heading"${gloss ? ' gloss="…"' : ''}>To improve</board>, then 1–2 of their corrections, each as ONE sentence card of the right sentence with the changed words in stress, never a card holding their mistake (no "…, not …"). At most ${V2_SUMMARY_SENTENCE_CARDS} sentence cards on the page in all${spoken ? `. ${V2_SUMMARY_SPOKEN_LINE}` : ''}`;
}

/** The runtime's cap: a sentence card on the summary page in view that already holds V2_SUMMARY_SENTENCE_CARDS of them is not painted. */
export function v2SummaryCardsFull(session: V2Session, state: V2State, enabled: boolean = TUTOR_V2_SUMMARY_GROUPS): boolean {
  if (!v2SummaryGroupsOn(session, enabled)) return false;
  const page = state.board.pages[state.board.current];
  return !!page && V2_CLOSING_PAGE.test(page.title) && page.items.filter((it) => it.tool === 'show_sentence').length >= V2_SUMMARY_SENTENCE_CARDS;
}
export const V2_SUMMARY_CARDS_FULL = `not painted: the summary page holds at most ${V2_SUMMARY_SENTENCE_CARDS} sentence cards, and it has them; say this one without a card`;

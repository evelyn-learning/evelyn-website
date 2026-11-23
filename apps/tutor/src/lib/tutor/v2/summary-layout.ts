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
/** Task 8l (WELL_WITH_CARD): `well`: the sentences they said right on record (summary-marks.ts v2SaidRightSentences): the went-well cards
 *  come from them, and with none the group is left out (no heading, nothing said of it) and the summary speaks kindly of what to improve
 *  and of their effort. Undefined: as before. */
export const V2_SUMMARY_NO_WELL = 'nothing they said right is on record apart from their corrections, so leave this group out: no "What went well" heading and no cards for it, and do not say that something went well with no card for it; instead say kindly what to improve, and say something encouraging about their effort in this lesson';
export function v2SummaryLayoutLine(session: V2Session, state: V2State, heard: string | null | undefined, spoken: boolean = TUTOR_V2_SUMMARY_SPOKEN, well?: readonly string[]): string {
  const T = languageNameOf(base(session.languages?.[0] ?? 'en'));
  const gloss = v2CardGlossOn(session) && v2GlossLevelOn(session, state, heard) ? ` with gloss="…" in ${languageNameOf(base(session.languages![1]!))} as your rule notes carry` : '';
  const two = well === undefined
    ? `a heading note in ${T}, <board note style="heading"${gloss ? ' gloss="…"' : ''}>What went well</board>${gloss}, then 1–2 sentences they said right in this lesson, as sentence cards`
    : well.length
    ? `a heading note in ${T}, <board note style="heading"${gloss ? ' gloss="…"' : ''}>What went well</board>${gloss}, then 1–2 of the sentences they said right in this lesson, as sentence cards, chosen from these only (none of them a correction): ${well.map((x) => JSON.stringify(x)).join('; ')}`
    : V2_SUMMARY_NO_WELL;
  const spokenLine = well !== undefined && !well.length ? V2_SUMMARY_SPOKEN_LINE.replace('(the grammar points, what went well, what to improve)', '(the grammar points, what to improve)') : V2_SUMMARY_SPOKEN_LINE;
  return `summary page: lay the Summary page out in this order, and say it in the same order, each card right after the words that say it and none after your last question: (1) the rule notes, one short line per grammar point of the lesson; (2) ${two}; (3) a heading note <board note style="heading"${gloss ? ' gloss="…"' : ''}>To improve</board>, then 1–2 of their corrections, each as ONE sentence card of the right sentence with the changed words in stress, never a card holding their mistake (no "…, not …"). At most ${V2_SUMMARY_SENTENCE_CARDS} sentence cards on the page in all${spoken ? `. ${spokenLine}` : ''}`;
}

/** The runtime's cap: a sentence card on the summary page in view that already holds V2_SUMMARY_SENTENCE_CARDS of them is not painted. */
export function v2SummaryCardsFull(session: V2Session, state: V2State, enabled: boolean = TUTOR_V2_SUMMARY_GROUPS): boolean {
  if (!v2SummaryGroupsOn(session, enabled)) return false;
  const page = state.board.pages[state.board.current];
  return !!page && V2_CLOSING_PAGE.test(page.title) && page.items.filter((it) => it.tool === 'show_sentence').length >= V2_SUMMARY_SENTENCE_CARDS;
}
export const V2_SUMMARY_CARDS_FULL = `not painted: the summary page holds at most ${V2_SUMMARY_SENTENCE_CARDS} sentence cards, and it has them; say this one without a card`;

/** Task 8c (SUMMARY_HEADINGS): the 7u headings and how a heading is recognised (summary-headings.ts, summary-marks.ts). */
/** The headings' words, as the 7u layout line gives them. */
export const V2_SUMMARY_WELL_HEADING = 'What went well';
export const V2_SUMMARY_IMPROVE_HEADING = 'To improve';
/** The learner-language line under each heading, by the learner's language (the second teaching language). A language with none here
 *  gets the heading with no line. */
export const V2_SUMMARY_HEADING_GLOSS: Record<string, { well: string; improve: string }> = {
  ja: { well: '良かったところ', improve: 'これから直すところ' },
};
export type V2SummaryHeadingGroup = 'well' | 'improve';
type Group = V2SummaryHeadingGroup;
/** Fix round 1 (M1): a heading is known only by its wording: the 7u heading or its learner-language line, equal after normalising (case,
 *  spaces, punctuation). A rule note that merely contains "good" or "better" is no heading. */
const norm = (t: string) => t.toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, '');
const WORDINGS: Record<Group, Set<string>> = {
  well: new Set([V2_SUMMARY_WELL_HEADING, ...Object.values(V2_SUMMARY_HEADING_GLOSS).map((g) => g.well)].map(norm)),
  improve: new Set([V2_SUMMARY_IMPROVE_HEADING, ...Object.values(V2_SUMMARY_HEADING_GLOSS).map((g) => g.improve)].map(norm)),
};
/** Task 8c (SUMMARY_HEADINGS): the group a heading's wording names, or null (fix round 3, M-3: shared by the runtime's placement and the 7w
 *  guard). */
export const v2SummaryHeadingGroup = (text: string): Group | null => { const k = norm(text); return WORDINGS.well.has(k) ? 'well' : WORDINGS.improve.has(k) ? 'improve' : null; };

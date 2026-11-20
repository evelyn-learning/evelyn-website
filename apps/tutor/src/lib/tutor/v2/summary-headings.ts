/**
 * Tutor brain v2 — Task 8c (SUMMARY_HEADINGS): the Summary page's group headings, written by the runtime.
 *
 * Mic test 10 (embed-1795202398886, flag 4: "it just put all the sentences together one after the other"): the 7u layout line was sent
 * and the model said each group aloud but wrote no heading note, so the page was rule notes and four sentence cards with no labels, and
 * the 7w guard (which reads the group from the heading notes) never ran: two corrections stood under the spoken "went well" part.
 * Now, on the Summary page of a lesson laid out in groups (summary-layout.ts v2SummaryGroupsOn), when a sentence card is about to be
 * painted, the runtime places it under its group by state:
 *  - a recorded correction (summary-marks.ts v2CorrectionFor, or an older one) goes under "To improve";
 *  - any other card under "What went well" (above the "To improve" heading when that is up already);
 *  - a group's heading, when the page has none, is written right before its first card, once, in the 7u wording, with the learner's
 *    language line (the 7p gloss) where the page's cards carry one (a beginner in a lesson taught through their language);
 *  - a heading the model wrote stands: the runtime writes none for that group, and a second heading of the same group is not painted.
 * Rule notes written before the cards stay above the groups (the headings go before their first card, never at the top). No model text
 * is cut; a card is placed, never dropped. Every other lesson and page: nothing. Pure, client-safe.
 */
import { TUTOR_V2_CORRECTIONS_ALL_GUARDED, TUTOR_V2_SUMMARY_HEADINGS } from '../orchestrator/flags';
import { V2_CLOSING_PAGE } from './part-close';
import { V2_SUMMARY_IMPROVE, V2_SUMMARY_WELL, v2CorrectionFor, v2OlderCorrection } from './summary-marks';
import { v2SummaryGroupsOn } from './summary-layout';
import type { V2Session, V2State, V2ToolCall } from './types';

/** The headings' words, as the 7u layout line gives them. */
export const V2_SUMMARY_WELL_HEADING = 'What went well';
export const V2_SUMMARY_IMPROVE_HEADING = 'To improve';
/** The learner-language line under each heading, by the learner's language (the second teaching language). A language with none here
 *  gets the heading with no line. */
const HEADING_GLOSS: Record<string, { well: string; improve: string }> = {
  ja: { well: '良かったところ', improve: 'これから直すところ' },
};
/** A heading note written in an earlier reply is known by its words only (the board record keeps no style): a short note. */
const HEADING_MAX_WORDS = 6;

type Group = 'well' | 'improve';
const groupOf = (text: string): Group | null => (V2_SUMMARY_IMPROVE.test(text) ? 'improve' : V2_SUMMARY_WELL.test(text) ? 'well' : null);

/** On the Summary page in view of a grouped lesson: the page. Else null. */
function summaryPage(session: V2Session, state: V2State, enabled: boolean) {
  if (!enabled || !v2SummaryGroupsOn(session)) return null;
  const page = state.board.pages[state.board.current];
  return page && V2_CLOSING_PAGE.test(page.title) ? page : null;
}

/** The group headings on the page in view: this reply's heading notes (style heading, the runtime's own included) and short notes of an
 *  earlier reply that read as one; the first of each group. */
function headingsOn(page: { items: Array<{ id: string; tool: string; summary: string }> }, calls: readonly V2ToolCall[]): Partial<Record<Group, string>> {
  const out: Partial<Record<Group, string>> = {};
  const mine = new Map(calls.filter((c) => c.name === 'annotate' && !/^not /.test(c.outcome)).map((c) => [c.id, c]));
  for (const it of page.items) {
    if (it.tool !== 'annotate') continue;
    const call = mine.get(it.id);
    const heading = call ? call.args.style === 'heading' : it.summary.trim().split(/\s+/).length <= HEADING_MAX_WORDS;
    if (!heading) continue;
    const g = groupOf(call ? String(call.args.text ?? '') : it.summary);
    if (g && !out[g]) out[g] = it.id;
  }
  return out;
}

export interface V2SummaryHeadingPlan {
  /** The heading note to write right before the card (its args), when the group has none on the page. */
  write?: { text: string; style: 'heading'; gloss?: string };
  /** The item the card (and the heading written for it) goes above: the "To improve" heading, for a card that is no correction. */
  above?: string;
}

/** Where a sentence card goes on the Summary page (see the header). `glossOn`: the page's cards carry a learner-language line (the 7p
 *  gate at this turn). Null: nothing to do (not the Summary page of a grouped lesson, or its group's heading is up and it goes last). */
export function v2SummaryHeadingPlan(session: V2Session, state: V2State, sentence: unknown, calls: readonly V2ToolCall[], glossOn: boolean, enabled: boolean = TUTOR_V2_SUMMARY_HEADINGS, guardAll: boolean = TUTOR_V2_CORRECTIONS_ALL_GUARDED): V2SummaryHeadingPlan | null {
  const page = summaryPage(session, state, enabled);
  if (!page || typeof sentence !== 'string' || !sentence.trim()) return null;
  const correction = !!v2CorrectionFor(state, sentence) || (guardAll && v2OlderCorrection(state, sentence));
  const have = headingsOn(page, calls);
  const lang = (session.languages?.[1] ?? '').toLowerCase().split(/[-_]/)[0]!;
  const gloss = glossOn ? HEADING_GLOSS[lang] : undefined;
  if (correction) return have.improve ? null : { write: { text: V2_SUMMARY_IMPROVE_HEADING, style: 'heading', ...(gloss ? { gloss: gloss.improve } : {}) } };
  const at = (id?: string) => (id ? page.items.findIndex((it) => it.id === id) : -1);
  // Above "To improve" only when the went-well group (if any) stands before it.
  const above = have.improve && (!have.well || at(have.well) < at(have.improve)) ? have.improve : undefined;
  const write = have.well ? undefined : { text: V2_SUMMARY_WELL_HEADING, style: 'heading' as const, ...(gloss ? { gloss: gloss.well } : {}) };
  return write || above ? { ...(write ? { write } : {}), ...(above ? { above } : {}) } : null;
}

/** A heading note the model writes on the Summary page whose group has its heading there already (the runtime's or its own): not
 *  painted, with the reason. Null: paint it. */
export function v2SummaryHeadingRepeat(session: V2Session, state: V2State, name: string, args: Record<string, unknown>, calls: readonly V2ToolCall[], enabled: boolean = TUTOR_V2_SUMMARY_HEADINGS): string | null {
  if (name !== 'annotate' || args.style !== 'heading' || typeof args.text !== 'string') return null;
  const page = summaryPage(session, state, enabled);
  const g = page ? groupOf(args.text) : null;
  if (!page || !g || !headingsOn(page, calls)[g]) return null;
  return `not painted: the "${g === 'well' ? V2_SUMMARY_WELL_HEADING : V2_SUMMARY_IMPROVE_HEADING}" heading is on the summary page already; its cards go under it`;
}

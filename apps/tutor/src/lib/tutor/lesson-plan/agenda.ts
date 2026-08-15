/**
 * Session agenda — feeds the opener's spoken agenda preview; the visual
 * agenda is the rail (Task 3, agenda-rail).
 *
 * Pure helper: given the active LessonPlan, derive the short list of
 * things today's session will cover (the forward-looking mirror of the
 * recap card's mustRemember list). The count feeds buildOpenerClause's
 * `agendaItemCount` so the brain can preview it in one spoken sentence on
 * fresh plan starts only — never resume/diagnostic/picker/no-plan
 * sessions. The rail itself renders the item labels visually; no
 * whiteboard card is ever dispatched for the agenda.
 *
 * Item sources, in priority order:
 *  - generated plans (metadata.generatedFromText): LO shortTitles from
 *    stage-1 (Task 2), falling back to the LO description for legacy
 *    cached plans minted before shortTitle existed;
 *  - curated plans with an authored recap segment: mustRemember verbatim
 *    (the promise and the recap then bookend the session with the same
 *    words);
 *  - curated plans without one: LO descriptions.
 */

import type { LessonPlan, SegmentRecap } from './types';
import { isGeneratedPlan } from './context';
import { stripWbEmphasisText } from '../whiteboard/wb-emphasis-strip';

const MAX_AGENDA_ITEMS = 8;

/** Forward-looking mirror of the recap card: what we'll cover today. */
export function buildAgendaItems(plan: LessonPlan): string[] {
  if (plan.metadata?.pendingPicker === true) return [];
  let items: string[];
  if (isGeneratedPlan(plan)) {
    items = (plan.los ?? []).map((lo) => lo.shortTitle ?? lo.description);
  } else {
    const recap = plan.segments.find((s) => s.kind === 'recap') as SegmentRecap | undefined;
    items = recap?.mustRemember?.length
      ? [...recap.mustRemember]
      : (plan.los ?? []).map((lo) => lo.description);
  }
  return items
    .filter((t) => typeof t === 'string' && t.trim().length > 0)
    .slice(0, MAX_AGENDA_ITEMS)
    .map((t) => stripWbEmphasisText(t.trim()));
}

/**
 * Session agenda (Task 4) — the deterministic opening "Agenda" card.
 *
 * Pure helpers: given the active LessonPlan, derive the short list of
 * things today's session will cover (the forward-looking mirror of the
 * recap card's mustRemember list) and the WhiteboardCommand that paints
 * it. The orchestrator (VoiceTutorRealtime) injects the command as the
 * FIRST buffered render of the opening brain turn on fresh plan starts
 * only — never resume/diagnostic/picker/no-plan sessions.
 *
 * Item sources, in priority order:
 *  - generated plans (metadata.generatedFromText): LO shortTitles from
 *    stage-1 (Task 2), falling back to the LO description for legacy
 *    cached plans minted before shortTitle existed;
 *  - curated plans with an authored recap segment: mustRemember verbatim
 *    (the promise and the recap then bookend the session with the same
 *    words);
 *  - curated plans without one: LO descriptions.
 *
 * Emphasis strip: the injected command is built runtime-side and never
 * passes through the brain-tool-args deepStripWbEmphasis walk, so board
 * renderers would print any authored bold/italic asterisk markers verbatim.
 * Strip them here with the shared single-string helper.
 */

import type { LessonPlan, SegmentRecap } from './types';
import { isGeneratedPlan } from './context';
import type { WhiteboardCommand } from '../../knowledge/types';
import { stripWbEmphasisText } from '../whiteboard/wb-emphasis-strip';

const MAX_AGENDA_ITEMS = 8;

/** Card title — also the marker isAgendaCardCommand keys on, so the
 *  active-problem tracker can tell the agenda card from a real problem. */
export const AGENDA_CARD_TITLE = 'Agenda';

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

/** The deterministic opening card, or null when the plan yields no items
 *  (picker plans, zero-LO plans without an authored recap). */
export function buildAgendaCommand(plan: LessonPlan): WhiteboardCommand | null {
  const items = buildAgendaItems(plan);
  if (items.length === 0) return null;
  return {
    action: 'showProblem',
    problem: {
      title: AGENDA_CARD_TITLE,
      format: 'free-response',
      statement: items.map((t) => '• ' + t).join('\n'),
    },
  } as WhiteboardCommand;
}

/** True when `cmd` is the runtime-injected Agenda card. Used to exempt it
 *  from active-problem tracking (live dispatch AND resume rehydrate): the
 *  agenda is a board artifact, not a problem the student is answering —
 *  without this the opening turn's <active_problem> block would ground
 *  verification on the bullet list. */
export function isAgendaCardCommand(cmd: unknown): boolean {
  const c = cmd as { action?: string; problem?: { title?: string } } | null;
  return c?.action === 'showProblem' && c?.problem?.title === AGENDA_CARD_TITLE;
}

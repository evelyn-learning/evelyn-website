/**
 * Tutor brain v2 — Task 7w (SUMMARY_OPENS_CLOSE): the check question and the close follow the summary whenever the summary is given.
 *
 * Mic test 7 (embed-1795100797999, 16.9 min): the summary page went up while the close was not open (wrap 18, held to 19.3 for the
 * optional Pronunciation part, its goal unmarked). The check and the invitation lines exist only while the close is open (7u, 7d),
 * the summary was marked begun only after the reply, and from then the check was never owed; the reply's end_lesson met the generic
 * menu ("Would you like to try something harder, do more practice, ask me a question, or stop here?"). Now, by state, in a spoken
 * lesson that teaches a language with a labelled plan:
 *  - the tutor begins the summary (its page written in a reply): the summary is marked begun at that block, and the close is open
 *    from there on (time-box.ts v2CloseOpen), whatever the wrap minute or a held wrap says; the optional-part hold ends;
 *  - the 7u check step applies to that reply (close-check.ts: owed in the reply that begins the summary); an end_lesson in it meets the
 *    7d / 7u deferral, never the menu;
 *  - a summary reply that did not end on the check owes it on the next reply, once (state.closeCheckLate), then the invitation.
 * The facts give the check line beside the summary page's layout line (facts.ts). Pure, client-safe.
 */
import { TUTOR_V2_SUMMARY_OPENS_CLOSE } from '../orchestrator/flags';
import { v2NoteTargetsOn } from './note-targets';
import { v2PlanLabelled } from './part-flow';
import type { V2Session, V2State } from './types';

/** The lessons it applies to. `enabled` is the kill switch. */
export function v2SummaryOpensCloseOn(session: Pick<V2Session, 'mode' | 'plan' | 'homework' | 'homeworkSheet' | 'languages' | 'pronunciation'>, enabled: boolean = TUTOR_V2_SUMMARY_OPENS_CLOSE): boolean {
  return enabled && v2NoteTargetsOn(session as V2Session) && v2PlanLabelled(session.plan);
}

/** The summary has begun in such a lesson: the close is open (time-box.ts v2CloseOpen). */
export function v2SummaryOpensClose(session: Pick<V2Session, 'mode' | 'plan' | 'homework' | 'homeworkSheet' | 'languages' | 'pronunciation'>, state: Partial<Pick<V2State, 'summaryBegunAt' | 'closed'>>, enabled: boolean = TUTOR_V2_SUMMARY_OPENS_CLOSE): boolean {
  return typeof state.summaryBegunAt === 'number' && !state.closed && v2SummaryOpensCloseOn(session, enabled);
}

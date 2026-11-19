/**
 * Tutor brain v2 — the state fields the turn writes for the next turn, read back from the client's copy (the brain-v2 turn
 * route). Validated and bounded: the client's state is not trusted. A field that is absent or malformed is left out, so a
 * session that never set one sends and gets exactly what it did before.
 */
import { TUTOR_V2_STATE_CARRY } from '../orchestrator/flags';
import type { V2Session, V2State } from './types';
import { discussionOf } from './discussion';
import { v2CloseInviteOn } from './close-invite';
import { V2_CLOCK_PAUSE_HONOURED } from './time-box';
import { v2AdaptOn } from './adaptive';
import { v2ReadCloseCheck, v2ReadCloseCheckLate } from './close-check';
import { v2SummaryMarksOn } from './summary-marks';

export const V2_MAX_BOARD_PROBLEMS = 12;
/** Task 7g: at most this many sentences owed a card are carried. */
export const V2_MAX_CARDS_OWED = 8;
const PROBLEM_CHARS = 300;
/** Task 7i: at most this many unheard sentences are carried. */
export const V2_MAX_UNHEARD = 4;

/** Task 7a fix round 1: when the summary began, replies since the board was written, what was not painted last reply (all
 *  under STATE_CARRY, `enabled`), and the page held for their yes (Task 7a). Task 7d: when questions were invited before
 *  the close; final review I6: read whatever STATE_CARRY says, as the held page is (its own switch, CLOSE_INVITES_QUESTIONS,
 *  and its scope are applied in v2ScopeCarried): with STATE_CARRY off it was dropped every turn, and every close after the
 *  invitation was refused and the invitation asked again. */
type Carried = Pick<V2State, 'heldPage' | 'summaryBegunAt' | 'repliesSinceBoard' | 'boardProblems' | 'closeInvitedAt' | 'closeReopened' | 'closeAsk' | 'closeCheck' | 'closeCheckLate' | 'visitPages' | 'clockPausedMs' | 'timeFit' | 'practiceSaid' | 'moveOnAsked' | 'cardsOwed' | 'unheard' | 'partStart'>;
const ID = /^[\w.:-]{1,80}$/;
export function v2ReadCarried(raw: unknown, enabled: boolean = TUTOR_V2_STATE_CARRY): Carried {
  const s = (raw && typeof raw === 'object' ? raw : {}) as Partial<Record<keyof V2State, unknown>>;
  const out: Carried = {};
  // Task 7f (B, C): read whatever STATE_CARRY says, as the held page is (their own switches and scope in v2ScopeCarried).
  const tf = s.timeFit as Partial<NonNullable<V2State['timeFit']>> | undefined;
  if (tf && typeof tf === 'object' && Array.isArray(tf.dropped)) {
    out.timeFit = { dropped: tf.dropped.filter((x): x is string => typeof x === 'string' && ID.test(x)).slice(0, 20), ...(tf.told === true ? { told: true as const } : {}), ...(typeof tf.shown === 'number' && Number.isFinite(tf.shown) && tf.shown > 0 ? { shown: Math.min(20, Math.floor(tf.shown)) } : {}), ...(tf.byArrival === true ? { byArrival: true as const } : {}), ...(Array.isArray(tf.taken) && tf.taken.some((x) => typeof x === 'string' && ID.test(x)) ? { taken: tf.taken.filter((x): x is string => typeof x === 'string' && ID.test(x)).slice(0, 20) } : {}), ...(Array.isArray(tf.toldIds) && tf.toldIds.some((x) => typeof x === 'string' && ID.test(x)) ? { toldIds: tf.toldIds.filter((x): x is string => typeof x === 'string' && ID.test(x)).slice(0, 20) } : {}), ...(Array.isArray(tf.byChoice) && tf.byChoice.some((x) => typeof x === 'string' && ID.test(x)) ? { byChoice: tf.byChoice.filter((x): x is string => typeof x === 'string' && ID.test(x)).slice(0, 20) } : {}) };
  }
  if (s.practiceSaid && typeof s.practiceSaid === 'object' && !Array.isArray(s.practiceSaid)) {
    const said = Object.fromEntries(Object.entries(s.practiceSaid as Record<string, unknown>).filter((e): e is [string, number] => ID.test(e[0]) && typeof e[1] === 'number' && Number.isFinite(e[1]) && e[1] > 0).slice(0, 40).map(([k, v]) => [k, Math.min(99, Math.floor(v))]));
    if (Object.keys(said).length) out.practiceSaid = said;
  }
  if (Array.isArray(s.moveOnAsked)) { const ids = s.moveOnAsked.filter((x): x is string => typeof x === 'string' && ID.test(x)).slice(-20); if (ids.length) out.moveOnAsked = ids; }
  // Task 7g (CARD_EVERY_SENTENCE): the sentences owed a card, whatever STATE_CARRY says (its own switch; scope in v2ScopeCarried).
  if (Array.isArray(s.cardsOwed)) { const list = s.cardsOwed.filter((x): x is string => typeof x === 'string' && !!x.trim()).slice(0, V2_MAX_CARDS_OWED).map((x) => x.slice(0, PROBLEM_CHARS)); if (list.length) out.cardsOwed = list; }
  // Task 7i (STAY_IN_PART): the sentences of the last reply not heard (its own switch; scope in v2ScopeCarried).
  if (Array.isArray(s.unheard)) { const list = s.unheard.filter((x): x is string => typeof x === 'string' && !!x.trim()).slice(0, V2_MAX_UNHEARD).map((x) => x.slice(0, PROBLEM_CHARS)); if (list.length) out.unheard = list; }
  const h = s.heldPage as Partial<NonNullable<V2State['heldPage']>> | undefined;
  if (h && typeof h === 'object' && typeof h.title === 'string' && typeof h.part === 'string' && typeof h.at === 'number' && Number.isFinite(h.at)) out.heldPage = { title: h.title.slice(0, 80), part: h.part.slice(0, 80), at: h.at, ...(h.unasked === true ? { unasked: true as const } : {}), ...(h.byPosition === true ? { byPosition: true as const } : {}) };
  if (typeof s.closeInvitedAt === 'number' && Number.isFinite(s.closeInvitedAt) && s.closeInvitedAt > 0) out.closeInvitedAt = s.closeInvitedAt;
  // Task 7k (CLOSE_REOPENED): the close reopened, read as closeInvitedAt is (its switch and scope in v2ScopeCarried).
  if (typeof s.closeReopened === 'number' && Number.isFinite(s.closeReopened) && s.closeReopened > 0) out.closeReopened = s.closeReopened;
  // Task 7k fix round 1: the recorded ask was "more, or finish?" (I2); the pages a practice visit opened (I1).
  if (s.closeAsk === 'more') out.closeAsk = 'more';
  // Task 7u (CLOSE_CHECK): the closing check asked / answered, read as closeInvitedAt is (its switch and scope in v2ScopeCarried).
  const check = v2ReadCloseCheck(s.closeCheck);
  if (check) out.closeCheck = check;
  // Task 7w (SUMMARY_OPENS_CLOSE): the check owed on the reply after a summary that skipped it, read as closeCheck is.
  const late = v2ReadCloseCheckLate(s.closeCheckLate);
  if (late) out.closeCheckLate = late;
  // Task 7v (PART_CLOCK): the part in hand and when the lesson entered it, whatever STATE_CARRY says (its own switch, read in
  // time-fit.ts; scope in v2ScopeCarried).
  const ps = s.partStart as Partial<NonNullable<V2State['partStart']>> | undefined;
  if (ps && typeof ps === 'object' && typeof ps.part === 'string' && ID.test(ps.part) && typeof ps.at === 'number' && Number.isFinite(ps.at) && ps.at >= 0) out.partStart = { part: ps.part, at: ps.at };
  if (Array.isArray(s.visitPages)) { const list = s.visitPages.filter((x): x is number => typeof x === 'number' && Number.isInteger(x) && x >= 0 && x < 200).slice(-20); if (list.length) out.visitPages = list; }
  // Task 7n (FLAG_CLOCK_PAUSE): the flag panel's paused total, whatever STATE_CARRY says (its own switch, read in time-box.ts).
  // Fix round 1 (I2): never in production (no legitimate sender); bounded by elapsed time and the box where it is read (time-box.ts).
  if (V2_CLOCK_PAUSE_HONOURED && typeof s.clockPausedMs === 'number' && Number.isFinite(s.clockPausedMs) && s.clockPausedMs > 0) out.clockPausedMs = Math.min(Math.floor(s.clockPausedMs), 6 * 60 * 60000);
  if (!enabled) return out;
  if (typeof s.summaryBegunAt === 'number' && Number.isFinite(s.summaryBegunAt) && s.summaryBegunAt > 0) out.summaryBegunAt = s.summaryBegunAt;
  if (typeof s.repliesSinceBoard === 'number' && Number.isFinite(s.repliesSinceBoard) && s.repliesSinceBoard >= 0) out.repliesSinceBoard = Math.min(1000, Math.floor(s.repliesSinceBoard));
  if (Array.isArray(s.boardProblems)) {
    const list = s.boardProblems.filter((x): x is string => typeof x === 'string' && !!x.trim()).slice(-V2_MAX_BOARD_PROBLEMS).map((x) => x.slice(0, PROBLEM_CHARS));
    if (list.length) out.boardProblems = list;
  }
  return out;
}

/** Fix round 2 (controller ruling): the three fields are carried only for a spoken, plan-led teaching lesson, the only kind
 *  in which the turn sets `summaryBegunAt` (turn.ts). Homework (GAC text), discussions and typed lessons were verified live
 *  without them and keep that: a growing "board last written on" line in a discussion that paints by design rarely would
 *  read as a nudge. */
export function v2CarryApplies(session: Pick<V2Session, 'mode' | 'plan' | 'homework' | 'homeworkSheet'>): boolean {
  return session.mode === 'voice' && !!session.plan && !session.homework && !session.homeworkSheet && !discussionOf(session.plan);
}

/** The state as the turn gets it: the carried fields dropped (as before Task 7a) for a session they do not apply to. Mutates.
 *  `closeInvitedAt` is kept only for the lessons Task 7d applies to (close-invite.ts v2CloseInviteOn, its switch included);
 *  Task 7k's `closeReopened` likewise. */
export function v2ScopeCarried(state: V2State, session: Pick<V2Session, 'mode' | 'plan' | 'homework' | 'homeworkSheet'> & Partial<Pick<V2Session, 'languages' | 'pronunciation'>>, closeInviteOn: boolean = v2CloseInviteOn(session)): V2State {
  if (!v2CarryApplies(session)) { delete state.summaryBegunAt; delete state.repliesSinceBoard; delete state.boardProblems; delete state.closeInvitedAt; delete state.closeReopened; delete state.closeAsk; delete state.closeCheck; delete state.closeCheckLate; }
  if (!closeInviteOn) { delete state.closeInvitedAt; delete state.closeReopened; delete state.closeAsk; delete state.closeCheck; delete state.closeCheckLate; }
  // Task 7f: the practice count is the part flow's (spoken plan-led lessons); the time fit any timed taught lesson's with a plan.
  if (!v2CarryApplies(session)) { delete state.practiceSaid; delete state.moveOnAsked; delete state.cardsOwed; delete state.unheard; delete state.visitPages; delete state.partStart; }
  if (!session.plan || session.homework || session.homeworkSheet || discussionOf(session.plan)) delete state.timeFit;
  // Task 7q: the support step and the recorded corrections only for the lessons they run in (adaptive.ts v2AdaptOn).
  if (!v2AdaptOn(session as V2Session)) { delete state.support; delete state.retests; }
  // Task 7w (SUMMARY_MARKS): the corrections with their marks only for the lessons they are recorded in.
  if (!v2SummaryMarksOn(session as V2Session)) delete state.corrections;
  return state;
}

/**
 * Tutor brain v2 — the state fields the turn writes for the next turn, read back from the client's copy (the brain-v2 turn
 * route). Validated and bounded: the client's state is not trusted. A field that is absent or malformed is left out, so a
 * session that never set one sends and gets exactly what it did before.
 */
import { TUTOR_V2_STATE_CARRY } from '../orchestrator/flags';
import type { V2Session, V2State } from './types';
import { discussionOf } from './discussion';
import { v2CloseInviteOn } from './close-invite';

export const V2_MAX_BOARD_PROBLEMS = 12;
const PROBLEM_CHARS = 300;

/** Task 7a fix round 1: when the summary began, replies since the board was written, what was not painted last reply (all
 *  under STATE_CARRY, `enabled`), and the page held for their yes (Task 7a). Task 7d: when questions were invited before
 *  the close; final review I6: read whatever STATE_CARRY says, as the held page is (its own switch, CLOSE_INVITES_QUESTIONS,
 *  and its scope are applied in v2ScopeCarried): with STATE_CARRY off it was dropped every turn, and every close after the
 *  invitation was refused and the invitation asked again. */
type Carried = Pick<V2State, 'heldPage' | 'summaryBegunAt' | 'repliesSinceBoard' | 'boardProblems' | 'closeInvitedAt' | 'timeFit' | 'practiceSaid' | 'moveOnAsked'>;
const ID = /^[\w.:-]{1,80}$/;
export function v2ReadCarried(raw: unknown, enabled: boolean = TUTOR_V2_STATE_CARRY): Carried {
  const s = (raw && typeof raw === 'object' ? raw : {}) as Partial<Record<keyof V2State, unknown>>;
  const out: Carried = {};
  // Task 7f (B, C): read whatever STATE_CARRY says, as the held page is (their own switches and scope in v2ScopeCarried).
  const tf = s.timeFit as Partial<NonNullable<V2State['timeFit']>> | undefined;
  if (tf && typeof tf === 'object' && Array.isArray(tf.dropped)) {
    out.timeFit = { dropped: tf.dropped.filter((x): x is string => typeof x === 'string' && ID.test(x)).slice(0, 20), ...(tf.told === true ? { told: true as const } : {}), ...(typeof tf.shown === 'number' && Number.isFinite(tf.shown) && tf.shown > 0 ? { shown: Math.min(20, Math.floor(tf.shown)) } : {}) };
  }
  if (s.practiceSaid && typeof s.practiceSaid === 'object' && !Array.isArray(s.practiceSaid)) {
    const said = Object.fromEntries(Object.entries(s.practiceSaid as Record<string, unknown>).filter((e): e is [string, number] => ID.test(e[0]) && typeof e[1] === 'number' && Number.isFinite(e[1]) && e[1] > 0).slice(0, 40).map(([k, v]) => [k, Math.min(99, Math.floor(v))]));
    if (Object.keys(said).length) out.practiceSaid = said;
  }
  if (Array.isArray(s.moveOnAsked)) { const ids = s.moveOnAsked.filter((x): x is string => typeof x === 'string' && ID.test(x)).slice(-20); if (ids.length) out.moveOnAsked = ids; }
  const h = s.heldPage as Partial<NonNullable<V2State['heldPage']>> | undefined;
  if (h && typeof h === 'object' && typeof h.title === 'string' && typeof h.part === 'string' && typeof h.at === 'number' && Number.isFinite(h.at)) out.heldPage = { title: h.title.slice(0, 80), part: h.part.slice(0, 80), at: h.at, ...(h.unasked === true ? { unasked: true as const } : {}) };
  if (typeof s.closeInvitedAt === 'number' && Number.isFinite(s.closeInvitedAt) && s.closeInvitedAt > 0) out.closeInvitedAt = s.closeInvitedAt;
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
 *  `closeInvitedAt` is kept only for the lessons Task 7d applies to (close-invite.ts v2CloseInviteOn, its switch included). */
export function v2ScopeCarried(state: V2State, session: Pick<V2Session, 'mode' | 'plan' | 'homework' | 'homeworkSheet'> & Partial<Pick<V2Session, 'languages' | 'pronunciation'>>, closeInviteOn: boolean = v2CloseInviteOn(session)): V2State {
  if (!v2CarryApplies(session)) { delete state.summaryBegunAt; delete state.repliesSinceBoard; delete state.boardProblems; delete state.closeInvitedAt; }
  if (!closeInviteOn) delete state.closeInvitedAt;
  // Task 7f: the practice count is the part flow's (spoken plan-led lessons); the time fit any timed taught lesson's with a plan.
  if (!v2CarryApplies(session)) { delete state.practiceSaid; delete state.moveOnAsked; }
  if (!session.plan || session.homework || session.homeworkSheet || discussionOf(session.plan)) delete state.timeFit;
  return state;
}

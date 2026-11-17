/**
 * Tutor brain v2 — the state fields the turn writes for the next turn, read back from the client's copy (the brain-v2 turn
 * route). Validated and bounded: the client's state is not trusted. A field that is absent or malformed is left out, so a
 * session that never set one sends and gets exactly what it did before.
 */
import { TUTOR_V2_STATE_CARRY } from '../orchestrator/flags';
import type { V2Session, V2State } from './types';
import { discussionOf } from './discussion';

export const V2_MAX_BOARD_PROBLEMS = 12;
const PROBLEM_CHARS = 300;

/** Task 7a fix round 1: when the summary began, replies since the board was written, what was not painted last reply (all
 *  under STATE_CARRY, `enabled`), and the page held for their yes (Task 7a). */
export function v2ReadCarried(raw: unknown, enabled: boolean = TUTOR_V2_STATE_CARRY): Pick<V2State, 'heldPage' | 'summaryBegunAt' | 'repliesSinceBoard' | 'boardProblems'> {
  const s = (raw && typeof raw === 'object' ? raw : {}) as Partial<Record<keyof V2State, unknown>>;
  const out: Pick<V2State, 'heldPage' | 'summaryBegunAt' | 'repliesSinceBoard' | 'boardProblems'> = {};
  const h = s.heldPage as Partial<NonNullable<V2State['heldPage']>> | undefined;
  if (h && typeof h === 'object' && typeof h.title === 'string' && typeof h.part === 'string' && typeof h.at === 'number' && Number.isFinite(h.at)) out.heldPage = { title: h.title.slice(0, 80), part: h.part.slice(0, 80), at: h.at };
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

/** The state as the turn gets it: the carried fields dropped (as before Task 7a) for a session they do not apply to. Mutates. */
export function v2ScopeCarried(state: V2State, session: Pick<V2Session, 'mode' | 'plan' | 'homework' | 'homeworkSheet'>): V2State {
  if (!v2CarryApplies(session)) { delete state.summaryBegunAt; delete state.repliesSinceBoard; delete state.boardProblems; }
  return state;
}

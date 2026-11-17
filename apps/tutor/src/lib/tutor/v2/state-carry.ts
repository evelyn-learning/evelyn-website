/**
 * Tutor brain v2 — the state fields the turn writes for the next turn, read back from the client's copy (the brain-v2 turn
 * route). Validated and bounded: the client's state is not trusted. A field that is absent or malformed is left out, so a
 * session that never set one sends and gets exactly what it did before.
 */
import { TUTOR_V2_STATE_CARRY } from '../orchestrator/flags';
import type { V2State } from './types';

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

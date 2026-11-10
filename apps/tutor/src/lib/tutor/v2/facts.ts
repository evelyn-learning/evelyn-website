/**
 * Tutor brain v2 — the facts block (design §4.2).
 *
 * The one thing the runtime adds to a turn. Facts only: nothing in here tells
 * the model what to do.
 */
import { renderBoard } from './board';
import { renderGoalStatus } from './plan-map';
import type { V2Session, V2State } from './types';

export interface V2TurnFacts {
  nowMs: number;
  /** The result of an answer check, when the runtime ran one. */
  answerCheck?: string;
  /** Seconds the student was silent before this turn, when that is why the turn exists. */
  silenceSeconds?: number;
}

export function renderFacts(session: V2Session, state: V2State, f: V2TurnFacts): string {
  const usedMin = Math.max(0, Math.round((f.nowMs - state.startedAtMs) / 60000));
  const lines = [
    `time: ${usedMin} min used${session.timeBoxMinutes ? ` of about ${session.timeBoxMinutes}` : ''}`,
    `board:\n  ${renderBoard(state.board)}`,
  ];
  if (session.plan) lines.push(`plan: ${renderGoalStatus(session.plan, state.goals)}`);
  lines.push(`your note: ${state.note.trim() || '(empty — nothing written yet)'}`);
  if (f.answerCheck) lines.push(`answer check: ${f.answerCheck}`);
  if (f.silenceSeconds) lines.push(`the student has said nothing for ${Math.round(f.silenceSeconds)} seconds`);
  return `<facts>\n${lines.join('\n')}\n</facts>`;
}

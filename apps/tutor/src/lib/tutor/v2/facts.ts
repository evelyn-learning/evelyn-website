/**
 * Tutor brain v2 — the facts block (design §4.2).
 *
 * The one thing the runtime adds to a turn. Facts only: nothing in here tells
 * the model what to do.
 */
import { renderBoard } from './board';
import { renderGoalStatus } from './plan-map';
import type { V2Session, V2State } from './types';

/** The early silence check after a spoken reply that asked nothing (TutorVoiceV2). */
export const V2_NO_ASK_RECHECK_S = 6;

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
  if ((state.repliesSinceBoard ?? 0) >= 1) lines.push(`board last written on: ${state.repliesSinceBoard} ${state.repliesSinceBoard === 1 ? 'reply' : 'replies'} ago`);
  if (state.boardProblems?.length) lines.push(`not painted in your last reply:\n${state.boardProblems.map((x) => `  - ${x}`).join('\n')}`);
  if (session.plan) lines.push(`plan: ${renderGoalStatus(session.plan, state.goals)}`);
  lines.push(`your note: ${state.note.trim() || '(empty — nothing written yet)'}`);
  if (state.gaps?.length) {
    const label: Record<string, string> = { found: 'found, not yet worked on', explained: 'explained to them, not yet done by them', done_with_help: 'they did one with help, not yet alone', done_alone: 'they did one alone' };
    lines.push(`gaps you have recorded:\n${state.gaps.map((g) => `  - ${g.what}: ${label[g.status] ?? g.status}`).join('\n')}`);
  }
  if (f.answerCheck) lines.push(`answer check: ${f.answerCheck}`);
  if (f.silenceSeconds) lines.push(Math.round(f.silenceSeconds) === V2_NO_ASK_RECHECK_S
    ? `the student has said nothing for ${V2_NO_ASK_RECHECK_S} seconds since your last reply, which ended on a statement: no question, and nothing for them to do. They are waiting for you to go on`
    : `the student has said nothing for ${Math.round(f.silenceSeconds)} seconds`);
  return `<facts>\n${lines.join('\n')}\n</facts>`;
}

/**
 * Tutor brain v2 — the facts block (design §4.2).
 *
 * The one thing the runtime adds to a turn. Facts only: nothing in here tells
 * the model what to do.
 */
import { renderBoard } from './board';
import { renderGoalStatus } from './plan-map';
import type { V2Session, V2State } from './types';

/** After the tutor chose to keep listening: how long the student stays silent before it is told so (TutorVoiceV2).
 *  At that point silence is no longer open to it: it kept listening twice and the student sat with a blank
 *  indicator for a minute (biology, embed-1794452229126). */
export const V2_WAITED_RECHECK_S = 5;
/** The early silence check after a spoken reply that asked nothing (TutorVoiceV2). Short: a tutor who has
 *  explained something and stopped leaves the student to say "got it" before the lesson moves (AP CS A,
 *  embed-1794440489707; it was 6 s, and the student spoke first). */
export const V2_NO_ASK_RECHECK_S = 2;

export interface V2TurnFacts {
  nowMs: number;
  /** The result of an answer check, when the runtime ran one. */
  answerCheck?: string;
  /** Seconds the student was silent before this turn, when that is why the turn exists. */
  silenceSeconds?: number;
  /** The page was reloaded and the session has just been picked up again (resume.ts). */
  resumed?: boolean;
}

export function renderFacts(session: V2Session, state: V2State, f: V2TurnFacts): string {
  const usedMin = Math.max(0, Math.round((f.nowMs - state.startedAtMs) / 60000));
  const left = session.timeBoxMinutes ? session.timeBoxMinutes - (f.nowMs - state.startedAtMs) / 60000 : 0;
  const lines = [
    // What is left, said outright: with only "22 used of 30" the tutor said goodbye, was refused the close, and
    // took the goodbye back in the same breath (embed-1794593747478, embed-1794595194384).
    `time: ${usedMin} min used${session.timeBoxMinutes ? ` of about ${session.timeBoxMinutes}; ${left > session.timeBoxMinutes * 0.2 ? `about ${Math.round(left)} left, which is time for more: the lesson is not at its close unless the student asks to stop` : left > 1.5 ? `about ${Math.round(left)} left: the close is near` : 'the time is up'}` : ''}`,
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
    ? `your last reply has finished and it ended on a statement: no question, and nothing for them to do. They are waiting for you to go on`
    : Math.round(f.silenceSeconds) === V2_WAITED_RECHECK_S
    ? `you kept listening after the student's last words, and they have said nothing more for ${V2_WAITED_RECHECK_S} seconds: they had finished. Take what they said as their answer and reply to it now`
    : `the student has said nothing for ${Math.round(f.silenceSeconds)} seconds`);
  return `<facts>\n${lines.join('\n')}\n</facts>`;
}

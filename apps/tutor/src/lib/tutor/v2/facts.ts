/**
 * Tutor brain v2 — the facts block (design §4.2).
 *
 * The one thing the runtime adds to a turn. Facts only: nothing in here tells
 * the model what to do.
 */
import { closeDueMinutes } from './close-heard';
import { renderBoard } from './board';
import { v2HomeworkFacts, v2HomeworkGuardFacts, v2SheetFacts } from './homework-facts';
import { renderGoalStatus } from './plan-map';
import type { V2Session, V2State } from './types';
import { discussionOf, effectiveMinutes, lastReplyNotes, renderThinking } from './discussion';

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
  /** A draft of this reply was held back, and why (homework-turn.ts). */
  notSent?: string;
  /** What the person has just said, for the notes on how the last reply landed. */
  heard?: string | null;
}

export function renderFacts(session: V2Session, state: V2State, f: V2TurnFacts): string {
  const usedMin = Math.max(0, Math.round((f.nowMs - state.startedAtMs) / 60000));
  const discussion = !!discussionOf(session.plan);
  // A discussion runs to the time the person said they have, when that is shorter (replay round 6: "about eight
  // minutes" ran to 10.4).
  const box = discussion ? effectiveMinutes(session.timeBoxMinutes, state.thinking) : session.timeBoxMinutes;
  const left = box ? box - (f.nowMs - state.startedAtMs) / 60000 : 0;
  const lines = [
    // A discussion runs 8–12 minutes and may close early once the person has chosen where to go next: the teaching
    // line's "time for more, not at its close" would hold it open.
    discussion ? `time: ${usedMin} min used${box ? ` of about ${box}${box !== session.timeBoxMinutes ? ' (the time they said they have)' : ''}; ${left > box * 0.4 ? `about ${Math.round(left)} left: plenty of time, not yet time to reflect or close unless they ask` : left > 4 ? `about ${Math.round(left)} left` : left > 1.5 ? `about ${Math.round(left)} left: time to reflect and choose a direction` : 'the time is up'}` : ''}` :
    // What is left, said outright: with only "22 used of 30" the tutor said goodbye, was refused the close, and
    // took the goodbye back in the same breath (embed-1794593747478, embed-1794595194384).
    // Homework: a solved problem does not go on spending the student's minutes.
    session.homework || session.homeworkSheet
      ? `time: ${usedMin} min used${session.timeBoxMinutes ? ` of about ${session.timeBoxMinutes}; ${left > 1.5 ? `about ${Math.round(left)} left` : 'the time is up'}` : ''}; the session ends when ${session.homeworkSheet ? 'the sheet' : 'this problem'} is done`
      : `time: ${usedMin} min used${session.timeBoxMinutes ? ` of about ${session.timeBoxMinutes}; ${left > closeDueMinutes(session.timeBoxMinutes) ? `about ${Math.round(left)} left, which is time for more: the lesson is not at its close unless the student asks to stop` : left > 1.5 ? `about ${Math.round(left)} left: the close is near` : 'the time is up'}` : ''}`,
    `board:\n  ${renderBoard(state.board)}`,
  ];
  if ((state.repliesSinceBoard ?? 0) >= 1) lines.push(`board last written on: ${state.repliesSinceBoard} ${state.repliesSinceBoard === 1 ? 'reply' : 'replies'} ago`);
  if (state.boardProblems?.length) lines.push(`not painted in your last reply:\n${state.boardProblems.map((x) => `  - ${x}`).join('\n')}`);
  if (session.homework) lines.push(...v2HomeworkFacts(session.homework, state.homework));
  else if (session.homeworkSheet) lines.push(...v2SheetFacts(session.homeworkSheet, state.homework?.sheet));
  if (session.homework || session.homeworkSheet) lines.push(...v2HomeworkGuardFacts(state.homework));
  else if (session.plan) lines.push(`plan: ${renderGoalStatus(session.plan, state.goals)}`);
  lines.push(`your note: ${state.note.trim() || '(empty — nothing written yet)'}`);
  const thinking = discussion ? renderThinking(state.thinking) : '';
  if (thinking) lines.push(thinking);
  const lastNotes = discussion ? lastReplyNotes(state.history, session.mode === 'voice', f.heard) : [];
  if (lastNotes.length) lines.push(`your last reply: ${lastNotes.join('; ')}`);
  // Said once in the prompt, the length and the opener drift back within a few turns (live test 2, 2026-11-15: replies of
  // 55–75 words, asked to repeat twice); a line in every turn's facts holds them.
  if (discussion && session.mode === 'voice' && state.history.length) lines.push('this reply is heard, not read: one idea in under 40 words (longer only to tell a case), opening on substance, never on "That\'s" or a word about what they said');
  if (state.gaps?.length) {
    const label: Record<string, string> = { found: 'found, not yet worked on', explained: 'explained to them, not yet done by them', done_with_help: 'they did one with help, not yet alone', done_alone: 'they did one alone' };
    lines.push(`gaps you have recorded:\n${state.gaps.map((g) => `  - ${g.what}: ${label[g.status] ?? g.status}`).join('\n')}`);
  }
  if (f.answerCheck) lines.push(`answer check: ${f.answerCheck}`);
  if (f.notSent) lines.push(`your first draft of this reply was not sent (the student never saw it: do not mention it): ${f.notSent}`);
  if (f.silenceSeconds) lines.push(Math.round(f.silenceSeconds) === V2_NO_ASK_RECHECK_S
    ? `your last reply has finished and it ended on a statement: no question, and nothing for them to do. They are waiting for you to go on`
    : Math.round(f.silenceSeconds) === V2_WAITED_RECHECK_S
    ? `you kept listening after the student's last words, and they have said nothing more for ${V2_WAITED_RECHECK_S} seconds: they had finished. Take what they said as their answer and reply to it now, as you would have straight away: no remark about the wait, and no telling them you are here`
    : `the student has said nothing for ${Math.round(f.silenceSeconds)} seconds`);
  return `<facts>\n${lines.join('\n')}\n</facts>`;
}

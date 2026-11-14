/**
 * Tutor brain v2 — one homework turn (homework.ts): the answer check, then the turn. Apart from homework.ts,
 * which turn.ts reads for the session part, so the two do not import each other.
 */
import type { ProseAnswerMatchFn } from '../voice/prose-answer-match';
import { v2HomeworkCheck, type V2HomeworkResolved } from './homework';
import { runV2Turn, type V2TurnInput } from './turn';
import type { V2Session, V2State, V2TurnResult } from './types';

/** A homework frame for the client (client.ts V2HomeworkFrame). */
export type V2HomeworkFrameOut = { type: 'homework-keyed-verdict'; part: string; verdict: 'correct' | 'incorrect'; value?: string } | { type: 'homework-problem-done' };

/**
 * One homework turn: the answer check, then the turn with what it found as a fact. The route and the offline
 * harness both run this, so what is tested offline is what the student gets.
 */
export async function runV2HomeworkTurn(input: V2TurnInput & { resolved: V2HomeworkResolved; onHomeworkFrame?: (f: V2HomeworkFrameOut) => void; proseMatch?: ProseAnswerMatchFn }): Promise<V2TurnResult & { homeworkFrames: V2HomeworkFrameOut[] }> {
  const { resolved, onHomeworkFrame, proseMatch, ...turn } = input;
  const session: V2Session = { ...turn.session, homework: turn.session.homework ?? resolved.problem };
  const hc = await v2HomeworkCheck({ key: resolved.key, problem: session.homework!, state: turn.state, studentSaid: turn.studentSaid, ...(proseMatch ? { proseMatch } : {}) });
  const frames: V2HomeworkFrameOut[] = [...hc.verdicts.map((v) => ({ type: 'homework-keyed-verdict' as const, ...v })), ...(hc.justDone ? [{ type: 'homework-problem-done' as const }] : [])];
  for (const f of frames) onHomeworkFrame?.(f);
  const state: V2State = { ...turn.state, homework: { confirmed: hc.confirmed, ...(hc.done ? { done: true } : {}) } };
  const facts = { ...(turn.facts ?? {}), ...(hc.answerCheck ? { answerCheck: hc.answerCheck } : {}) };
  const r = await runV2Turn({ ...turn, session, state, facts });
  return { ...r, homeworkFrames: frames };
}

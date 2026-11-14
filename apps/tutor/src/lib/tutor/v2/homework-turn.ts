/**
 * Tutor brain v2 — one homework turn (homework.ts): the answer check, then the turn, with the no-reveal guard
 * around it. Apart from homework.ts, which turn.ts reads for the session part, so the two do not import each
 * other.
 *
 * No-reveal (design 4). The principle is in the session part; this is the one runtime guard behind it.
 *   - The board, for every checked problem: a board call that writes a value of the key the student has not
 *     written is not painted, and the model reads why (v1's homeworkKeyWithheld / boardRevealsHomeworkKey).
 *     In the opening reply of a problem whose figure is already on screen nothing is drawn.
 *   - The reply, for partners under the no-reveal rule (no-reveal-ledger-gate.ts): the reply is held until it
 *     is complete; one that states a final answer is not sent and is written again once, with a fact saying
 *     why. A second draft that still states it has those sentences cut (v1's fixed tails are the last resort).
 *     Held replies cost the student the stream of a typed reply, not its words; homework is typed (GAC).
 */
import type { ProseAnswerMatchFn } from '../voice/prose-answer-match';
import { boardRevealsHomeworkKey, homeworkKeyWithheld, HOMEWORK_BOARD_KEY_WITHHELD_REASON, HOMEWORK_OPENER_BOARD_WITHHELD_REASON } from '../voice/homework-problem-block';
import { revealsWithheldAnswer, type WithheldAnswer } from '../voice/whole-answer-reveal';
import { studentMessagesOf, v2HomeworkCheck, type V2HomeworkResolved } from './homework';
import { V2_CONTROL_TOOL_NAMES } from './tool-names';
import { runV2Turn, type V2TurnInput } from './turn';
import type { V2Session, V2State, V2ToolCall, V2TurnResult } from './types';

/** A homework frame for the client (client.ts V2HomeworkFrame). */
export type V2HomeworkFrameOut = { type: 'homework-keyed-verdict'; part: string; verdict: 'correct' | 'incorrect'; value?: string } | { type: 'homework-problem-done' };

/** Said in place of a draft whose every sentence stated the answer, so the reply still hands the turn over. */
export const V2_HOMEWORK_FALLBACK_QUESTION = 'What do you think the next step is?';
export const V2_HOMEWORK_NOT_SENT = 'it stated the final answer of a part the student has not reached. They must reach it themselves: write the reply again without it, and give them the next smallest step.';

const sentencesOf = (text: string) => text.split(/(?<=[.!?])\s+|\n+/).map((x) => x.trim()).filter(Boolean);
const revealing = (sentence: string, withheld: ReadonlyArray<WithheldAnswer>) => withheld.some((a) => revealsWithheldAnswer(sentence, a).hit);

/**
 * One homework turn: the answer check, then the turn with what it found as a fact. The route and the offline
 * harness both run this, so what is tested offline is what the student gets.
 */
export async function runV2HomeworkTurn(input: V2TurnInput & { resolved: V2HomeworkResolved; onHomeworkFrame?: (f: V2HomeworkFrameOut) => void; proseMatch?: ProseAnswerMatchFn }): Promise<V2TurnResult & { homeworkFrames: V2HomeworkFrameOut[] }> {
  const { resolved, onHomeworkFrame, proseMatch, ...turn } = input;
  const session: V2Session = { ...turn.session, homework: turn.session.homework ?? resolved.problem };
  const hw = session.homework!;
  const hc = await v2HomeworkCheck({ key: resolved.key, problem: hw, state: turn.state, studentSaid: turn.studentSaid, ...(proseMatch ? { proseMatch } : {}) });
  const frames: V2HomeworkFrameOut[] = [...hc.verdicts.map((v) => ({ type: 'homework-keyed-verdict' as const, ...v })), ...(hc.justDone ? [{ type: 'homework-problem-done' as const }] : [])];
  for (const f of frames) onHomeworkFrame?.(f);
  const state: V2State = { ...turn.state, homework: { confirmed: hc.confirmed, ...(hc.done ? { done: true } : {}) } };
  const facts = { ...(turn.facts ?? {}), ...(hc.answerCheck ? { answerCheck: hc.answerCheck } : {}) };

  // What the student has written, this message included: a value of theirs is never withheld from them.
  const studentText = [...studentMessagesOf(turn.state.history).map((m) => m.content), turn.studentSaid ?? ''].join('\n');
  const withheld = hw.verified && resolved.key ? homeworkKeyWithheld({ text: hw.text, verified: true, hasFigure: hw.hasFigure, key: resolved.key }, studentText) : [];
  const opening = !turn.state.history.length && turn.studentSaid === null;
  const boardGuard = (name: string, args: Record<string, unknown>): string | null => {
    if (V2_CONTROL_TOOL_NAMES.has(name) || name === 'new_page' || name === 'go_to_page') return null;
    if (opening && hw.hasFigure) return HOMEWORK_OPENER_BOARD_WITHHELD_REASON.replace(/^not shown — /, '');
    return withheld.length && boardRevealsHomeworkKey(args, withheld) ? HOMEWORK_BOARD_KEY_WITHHELD_REASON.replace(/^not shown — /, '') : null;
  };
  const guarded: V2TurnInput = { ...turn, session, state, facts, boardGuard };

  if (!hw.noReveal || !withheld.length) return { ...(await runV2Turn(guarded)), homeworkFrames: frames };

  // Held: the student sees a draft only once it is known not to state an answer.
  const held = async (extra: Partial<V2TurnInput>) => {
    const events: Array<() => void> = [];
    const r = await runV2Turn({
      ...guarded, ...extra,
      onText: (d) => events.push(() => turn.onText?.(d)),
      onToolCall: (c: V2ToolCall) => events.push(() => turn.onToolCall?.(c)),
      onBoardOpen: () => events.push(() => turn.onBoardOpen?.()),
      onBoardWithdraw: (id) => events.push(() => turn.onBoardWithdraw?.(id)),
    });
    return { r, flush: () => { for (const e of events) e(); }, reveals: sentencesOf(r.spoken).some((x) => revealing(x, withheld)) };
  };
  const first = await held({});
  if (!first.reveals) { first.flush(); return { ...first.r, homeworkFrames: frames }; }
  console.log('[brain-v2] homework: a draft stated a final answer — written again');
  const second = await held({ facts: { ...facts, notSent: V2_HOMEWORK_NOT_SENT } });
  if (!second.reveals) { second.flush(); return { ...second.r, homeworkFrames: frames }; }
  console.log('[brain-v2] homework: the second draft stated it too — those sentences are cut');
  // Last resort: the sentences that state it are cut from what is said and from what is stored.
  const cut = (text: string) => sentencesOf(text).filter((x) => !revealing(x, withheld)).join(' ');
  let spoken = cut(second.r.spoken);
  if (!/\?\s*$/.test(spoken)) spoken = `${spoken} ${V2_HOMEWORK_FALLBACK_QUESTION}`.trim();
  const before = turn.state.history.length;
  const history = second.r.state.history.map((m, i) => {
    if (i < before + 1 || m.role !== 'assistant' || typeof m.content === 'string') return m;
    // An empty text block is refused by the API: a block left with nothing is dropped.
    const content = m.content.map((b) => (b.type === 'text' ? { ...b, text: cut(b.text) } : b)).filter((b) => b.type !== 'text' || b.text.trim());
    return { ...m, content: content.length ? content : [{ type: 'text' as const, text: V2_HOMEWORK_FALLBACK_QUESTION }] };
  });
  // What is stored hands the turn over as what is said does.
  const lastText = [...history].reverse().find((m) => m.role === 'assistant' && Array.isArray(m.content) && m.content.some((b) => b.type === 'text'));
  const tail = lastText && Array.isArray(lastText.content) ? ([...lastText.content].reverse().find((b) => b.type === 'text') as { text: string } | undefined) : undefined;
  if (tail && !/\?\s*$/.test(tail.text)) tail.text = `${tail.text} ${V2_HOMEWORK_FALLBACK_QUESTION}`.trim();
  turn.onText?.(spoken);
  for (const c of second.r.toolCalls) turn.onToolCall?.(c);
  return { ...second.r, spoken, state: { ...second.r.state, history }, homeworkFrames: frames };
}

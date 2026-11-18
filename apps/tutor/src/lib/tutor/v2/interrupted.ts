/**
 * Tutor brain v2 — keeping a turn that was cut short.
 *
 * When the student speaks over the tutor the request is abandoned, and with it
 * the state the server would have returned. But the student heard part of the
 * reply and saw what was drawn, so the tutor must remember exactly that much:
 * the words that got out, the tool calls that were settled, and the fact that
 * it was cut off. This rebuilds that from what the browser received.
 */
import type Anthropic from '@anthropic-ai/sdk';
import { applyToModelBoard } from './board';
import { V2_CONTROL_TOOL_NAMES } from './tool-names';
import type { V2State, V2ToolCall } from './types';

export const V2_CUT_MARK = '[cut off here: the student began to speak]';

export function foldInterruptedTurn(state: V2State, studentBlock: string, heard: string, toolCalls: V2ToolCall[]): V2State {
  const said = heard.trim();
  if (!said && toolCalls.length === 0) return state; // nothing reached the student: the turn never happened
  const next: V2State = structuredClone(state);
  const assistant: Anthropic.ContentBlockParam[] = [{ type: 'text', text: said ? `${said} ${V2_CUT_MARK}` : V2_CUT_MARK }];
  const results: Anthropic.ToolResultBlockParam[] = [];
  for (const call of toolCalls) {
    assistant.push({ type: 'tool_use', id: call.id, name: call.name, input: call.args });
    results.push({ type: 'tool_result', tool_use_id: call.id, content: call.outcome });
    // The board record follows what was painted. Notes and goal marks made in a cut turn
    // are not replayed: the model will set them again if they still hold.
    if (!V2_CONTROL_TOOL_NAMES.has(call.name) && !/^not painted/.test(call.outcome)) applyToModelBoard(next.board, call.id, call.name, call.args);
  }
  next.history = [
    ...next.history,
    { role: 'user', content: [{ type: 'text', text: studentBlock }] },
    { role: 'assistant', content: assistant },
    ...(results.length ? [{ role: 'user' as const, content: results }] : []),
  ];
  return next;
}

/** The student spoke over a reply the server had already finished: the record held all of it, though only the
 *  sentences that had begun to play were heard. Cut by a sound in the room one sentence into a case, the tutor
 *  believed it had told the case and asked about it; the teacher had heard none of it (ECS, embed-1794708025170).
 *  The last reply's words become the sentences that were spoken, marked as cut off; its tool calls stay, so their
 *  results still pair. Nothing unheard ⇒ the state is returned as it was. */
export function trimToSpoken(state: V2State, sentences: string[], started: number): V2State {
  if (!sentences.length || started >= sentences.length) return state;
  const i = state.history.map((m) => m.role).lastIndexOf('assistant');
  if (i < 0) return state;
  const msg = state.history[i];
  const blocks: Anthropic.ContentBlockParam[] = typeof msg.content === 'string' ? [{ type: 'text', text: msg.content }] : [...(msg.content as Anthropic.ContentBlockParam[])];
  const said = sentences.slice(0, Math.max(0, started)).join(' ').trim();
  const others = blocks.filter((b) => b.type !== 'text');
  const next: V2State = structuredClone(state);
  next.history[i] = { role: 'assistant', content: [{ type: 'text', text: said ? `${said} ${V2_CUT_MARK}` : V2_CUT_MARK }, ...others] };
  return next;
}

/** The student came in over the last sentence of a reply, a question, with a brief answer to it: they heard it.
 *  Counted as unheard, "Shall we go on, or do you have a question first?" answered "Yeah." a moment before it
 *  ended was struck from the record, and the tutor asked it again (AP Macroeconomics, portal-a4f66d55, twice).
 *  Anything longer, or said over an earlier sentence, is still a cut: the question may not have got through. */
const BRIEF_ANSWER = /^\s*(?:(?:oh|um|uh|well|so)[, ]+)*(?:yes|yeah|yep|yup|ya|ok|okay|sure|alright|all right|mhm|uh[- ]?huh|no|nope|nah|not yet|go on|go ahead|let'?s (?:go|go on|move on|do it|continue)|i do|i don'?t|got it|makes sense)\b/i;
export function answeredAsItEnded(studentSaid: string, sentences: string[], started: number): boolean {
  if (!sentences.length || started !== sentences.length) return false;
  const words = studentSaid.trim().split(/\s+/).filter(Boolean);
  return /\?["')\]]*$/.test(sentences[sentences.length - 1].trim()) && words.length > 0 && words.length <= 6 && BRIEF_ANSWER.test(studentSaid);
}

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

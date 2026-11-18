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
import { TUTOR_V2_STAY_IN_PART } from '../orchestrator/flags';

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
    // Final review M6: no call whose outcome begins "not " (a page held for their yes is "not opened yet: …"): applied, the
    // held page stood open in the record, its chip lit, and the held page was lost.
    if (!V2_CONTROL_TOOL_NAMES.has(call.name) && !/^not /.test(call.outcome)) {
      const o = applyToModelBoard(next.board, call.id, call.name, call.args);
      // Task 7k fix round 2 (m1): a page a practice visit opened stays marked (state.visitPages) in a cut reply's record: the
      // server's marks were lost with the reply, and the page later counted as the lesson's own.
      if (call.visit && call.name === 'new_page' && o.painted) next.visitPages = [...(next.visitPages ?? []), next.board.current].slice(-20);
    }
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
/** Task 7i (STAY_IN_PART, `keepUnheard`): the sentences not heard are kept in `state.unheard` for the next turn's facts: mic
 *  test 3 (embed-1794967959470, 12.47–12.57) lost the follow-up "When did you start this project?" to a barge-in, and the
 *  tutor, not knowing, went to the summary. */
export function trimToSpoken(state: V2State, sentences: string[], started: number, keepUnheard: boolean = TUTOR_V2_STAY_IN_PART): V2State {
  if (!sentences.length || started >= sentences.length) return state;
  const i = state.history.map((m) => m.role).lastIndexOf('assistant');
  if (i < 0) return state;
  const msg = state.history[i];
  const blocks: Anthropic.ContentBlockParam[] = typeof msg.content === 'string' ? [{ type: 'text', text: msg.content }] : [...(msg.content as Anthropic.ContentBlockParam[])];
  const said = sentences.slice(0, Math.max(0, started)).join(' ').trim();
  const others = blocks.filter((b) => b.type !== 'text');
  const next: V2State = structuredClone(state);
  next.history[i] = { role: 'assistant', content: [{ type: 'text', text: said ? `${said} ${V2_CUT_MARK}` : V2_CUT_MARK }, ...others] };
  const unheard = sentences.slice(Math.max(0, started)).map((x) => x.trim()).filter(Boolean).slice(0, 4);
  if (keepUnheard && unheard.length) next.unheard = unheard;
  return next;
}

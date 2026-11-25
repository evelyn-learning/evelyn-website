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
import { TUTOR_V2_SELF_CORRECTION, TUTOR_V2_STAY_IN_PART } from '../orchestrator/flags';
import { lessonBriefAnswer } from './lesson-words';

export const V2_CUT_MARK = '[cut off here: the student began to speak]';
/** Merge with main (Task 8e): main's note on a cut reply (trimToSpoken: "[this reply had already put on the board, where the student
 *  can read it: the problem "…"]") is the system's, as the cut mark is. This branch's readers of the tutor's own words (the last
 *  reply's asks, questions put, openers) take it out as they take the mark out: left in, the quoted problem read as a question the
 *  cut reply had asked aloud (the level check counted a question as put by a reply cut before it, 8a). */
export const V2_CUT_BOARD_NOTE = /\s*\[this reply had already put on the board, where the student can read it: [\s\S]*?"\](?=\s|$)/g;
export const v2WithoutCutBoardNote = (text: string): string => text.replace(V2_CUT_BOARD_NOTE, '');

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
  // A problem this reply put on the board is on the board, heard or not, and the student may go on to answer it.
  // With its sentence struck from the record the tutor did not know it had set it: the student solved it, and was
  // then told "the next one is already on the board" and given the same problem again (ACT Math, portal-3d431436).
  const whole = blocks.map((b) => (b.type === 'text' ? b.text : '')).join('\n');
  const cards = [...whole.matchAll(/<board problem[^>]*>([\s\S]*?)<\/board>/g)].map((m) => m[1].replace(/\s+/g, ' ').trim()).filter(Boolean);
  const onBoard = cards.length ? ` [this reply had already put on the board, where the student can read it: ${cards.map((c) => `the problem "${c.slice(0, 300)}"`).join('; ')}]` : '';
  const next: V2State = structuredClone(state);
  next.history[i] = { role: 'assistant', content: [{ type: 'text', text: `${said ? `${said} ${V2_CUT_MARK}` : V2_CUT_MARK}${onBoard}` }, ...others] };
  const unheard = sentences.slice(Math.max(0, started)).map((x) => x.trim()).filter(Boolean).slice(0, 4);
  if (keepUnheard && unheard.length) next.unheard = unheard;
  return next;
}

/** The student came in over the last sentence of a reply, a question, with a brief answer to it: they heard it.
 *  Counted as unheard, "Shall we go on, or do you have a question first?" answered "Yeah." a moment before it
 *  ended was struck from the record, and the tutor asked it again (AP Macroeconomics, portal-a4f66d55, twice).
 *  Anything longer, or said over an earlier sentence, is still a cut: the question may not have got through. */
const BRIEF_ANSWER = /^\s*(?:(?:oh|um|uh|well|so)[, ]+)*(?:yes|yeah|yep|yup|ya|ok|okay|sure|alright|all right|mhm|uh[- ]?huh|no|nope|nah|not yet|go on|go ahead|let'?s (?:go|go on|move on|do it|continue)|i do|i don'?t|got it|makes sense)\b/i;
/** The same in a lesson taught in Chinese or Japanese: a short answer over the end of a question (？ as well as ?). The
 *  recogniser writes these with no spaces, so the length is counted in characters. */
const BRIEF_ANSWER_CJK = /^\s*(?:(?:嗯|喔|哦|啊|えっと|あの)[，,、\s]*)*(?:好的?|好啊|對|对|是的?|嗯|可以|不是|不對|不对|沒有|没有|還沒|还没|懂了?|知道了?|明白了?|繼續|继续|有|不用|はい|ええ|うん|いいえ|いえ|大丈夫(?:です)?|わかりました|お願いします|まだです)/u;
export function answeredAsItEnded(studentSaid: string, sentences: string[], started: number): boolean {
  if (!sentences.length || started !== sentences.length) return false;
  if (/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(studentSaid)) return /[?？]["')\]」』）]*$/.test(sentences[sentences.length - 1].trim()) && studentSaid.replace(/[^\p{L}\p{N}]/gu, '').length <= 8 && BRIEF_ANSWER_CJK.test(studentSaid);
  const words = studentSaid.trim().split(/\s+/).filter(Boolean);
  // 2026-11-24: or a brief answer in Hindi, French or Spanish (lesson-words.ts: हाँ, ठीक है, oui, d'accord, sí, claro).
  return /\?["')\]]*$/.test(sentences[sentences.length - 1].trim()) && words.length > 0 && words.length <= 6 && (BRIEF_ANSWER.test(studentSaid) || lessonBriefAnswer(studentSaid));
}

/** Task 7v (SELF_CORRECTION): the learner's words of a turn cut before anything of the reply reached them (no words heard, no board
 *  item settled) while newer words of theirs wait (`pending`: what cut it): carried into the next turn, since the record keeps no
 *  trace of the cut turn (foldInterruptedTurn). Null: nothing to carry. Mic test 6 (embed-1795067373124, 6.1 min): "My team is
 *  working on um uh presentation for senior staff." was lost and "for senior bosses." reached the tutor alone. */
export function v2CutWordsCarried(said: string | null, reached: string, settled: number, pending: string | null, on: boolean = TUTOR_V2_SELF_CORRECTION): string | null {
  return on && !!said && !reached.trim() && settled === 0 && !!pending ? said : null;
}
/** Task 7v (SELF_CORRECTION): their words for the brain this turn: carried words first, then theirs. */
export function v2WithCarried(carried: string | null, said: string | null, on: boolean = TUTOR_V2_SELF_CORRECTION): string | null {
  return on && carried && said ? `${carried}\n${said}` : said;
}
